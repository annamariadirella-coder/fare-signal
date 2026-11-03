import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Monitor, evaluate, fingerprint, minutes } from '../src/monitor.mjs';
import { journeys, settings, observations } from '../demo/fixtures.mjs';

const journey = journeys[1];
const pair = price => [
  { identity: fingerprint(journey), priceCents: price, currency: 'EUR', at: 1000 },
  { identity: fingerprint(journey), priceCents: price, currency: 'EUR', at: 21000 },
];
test('strict threshold: 39.99 qualifies; exactly 40.00 does not', () => {
  assert.equal(evaluate(journey, ...pair(3999), settings).status, 'ready');
  assert.equal(evaluate(journey, ...pair(4000), settings).status, 'above');
});
test('invalid source data never becomes a price alert', () => {
  for (const price of [0, -1, NaN, Infinity, '3490', 34.9, Number.MAX_SAFE_INTEGER + 1]) {
    assert.equal(evaluate(journey, ...pair(price), settings).status, 'unavailable');
  }
  const [a, b] = pair(3490);
  assert.equal(evaluate(journey, a, null, settings).status, 'unavailable');
  assert.equal(evaluate(journey, a, { ...b, currency: 'USD' }, settings).status, 'unavailable');
});
test('matching money from a different train cannot confirm the journey', () => {
  const [a, b] = pair(3490);
  assert.equal(evaluate(journey, a, { ...b, identity: fingerprint(journeys[0]) }, settings).status, 'unavailable');
});
test('independent observations require a gap, ordered timestamps and bounded age', () => {
  const [a, b] = pair(3490);
  for (const at of [a.at - 1, a.at, a.at + 19999, a.at + 300001]) {
    assert.equal(evaluate(journey, a, { ...b, at }, settings).status, 'unavailable');
  }
});
test('disagreeing prices are rejected even when both are cheap', () => {
  const [a, b] = pair(3490);
  assert.equal(evaluate(journey, a, { ...b, priceCents: 2990 }, settings).status, 'mismatch');
});
test('date, stations, direct journeys and the strict departure boundary are enforced', () => {
  for (const change of [{ date: '2027-03-15' }, { from: 'Other Central' }, { to: 'Other Hbf' },
    { direct: false }, { direct: 'true' }, { departure: '12:30' }, { departure: '12:29' }]) {
    assert.equal(evaluate({ ...journey, ...change }, ...pair(3490), settings).status, 'excluded');
  }
  assert.equal(minutes('23:59'), 1439);
  assert.throws(() => minutes('24:00'));
});
test('two different qualifying journeys each receive one alert', async () => {
  const sent = [];
  const monitor = new Monitor(async alert => { sent.push(alert); return { id: `demo-${sent.length}` }; });
  const run = () => Promise.all(observations('drop').map(({ journey, first, second }) => monitor.check(journey, first, second, settings)));
  assert.equal((await run()).filter(x => x.status === 'delivered').length, 2);
  assert.equal((await run()).filter(x => x.status === 'duplicate').length, 2);
  assert.equal(sent.length, 2);
});
test('concurrent checks cannot create two sends for the same journey', async () => {
  let sends = 0;
  const monitor = new Monitor(async () => { sends++; await new Promise(resolve => setTimeout(resolve, 5)); return { id: 'demo' }; });
  await Promise.all([monitor.check(journey, ...pair(3490), settings), monitor.check(journey, ...pair(3490), settings)]);
  assert.equal(sends, 1);
});
test('ambiguous delivery is reserved and not automatically retried', async () => {
  let attempts = 0;
  const monitor = new Monitor(async () => { attempts++; throw new Error('Simulated timeout'); });
  assert.equal((await monitor.check(journey, ...pair(3490), settings)).status, 'uncertain');
  assert.equal((await monitor.check(journey, ...pair(3490), settings)).status, 'uncertain');
  assert.equal(attempts, 1);
});
test('a missing receipt is not marked as delivered', async () => {
  const monitor = new Monitor(async () => ({}));
  assert.equal((await monitor.check(journey, ...pair(3490), settings)).status, 'uncertain');
});
test('non-qualifying checks never contact the transport', async () => {
  const monitor = new Monitor(() => { throw new Error('Must not be called'); });
  assert.equal((await monitor.check(journey, ...pair(4000), settings)).status, 'above');
  assert.equal(monitor.ledger.size, 0);
});
test('changing settings does not forget previously delivered journeys', async () => {
  const monitor = new Monitor(async () => ({ id: 'demo' }));
  await monitor.check(journey, ...pair(3490), settings);
  assert.equal((await monitor.check(journey, ...pair(2990), { ...settings, thresholdCents: 5000 })).status, 'duplicate');
});
test('malformed budget configuration fails explicitly', () => {
  for (const thresholdCents of [0, -1, '4000', NaN, 39.99]) {
    assert.throws(() => evaluate(journey, ...pair(3490), { ...settings, thresholdCents }));
  }
});
