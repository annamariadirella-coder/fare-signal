import { fingerprint } from '../src/monitor.mjs';

// Every name, service, observation and price in this fixture is fictional.
export const settings = { from: 'Northport Central', to: 'Linden Hbf', date: '2027-03-14', after: '12:30', thresholdCents: 4000 };
export const journeys = [
  { id: 'north-104', train: 'NF 104', departure: '13:04', arrival: '15:52', direct: true },
  { id: 'north-208', train: 'NF 208', departure: '15:38', arrival: '18:16', direct: true },
  { id: 'north-316', train: 'NF 316', departure: '18:12', arrival: '20:54', direct: true },
  { id: 'north-422', train: 'NF 422', departure: '21:36', arrival: '00:23', direct: true },
].map(journey => ({ ...journey, from: settings.from, to: settings.to, date: settings.date }));

export const scenarios = {
  drop: { title: 'A fare drops', note: 'Two matching reads. Only confirmed offers below your chosen limit become alerts.', prices: [4790, 3490, 4000, 2990] },
  mismatch: { title: 'Prices disagree', note: 'The second source observation changes. An attractive price is not enough.', prices: [4790, 3490, 4000, 2990] },
  outage: { title: 'Source unavailable', note: 'A missing response is never converted into a bargain.', prices: [4790, 3490, 4000, 2990] },
  uncertain: { title: 'Delivery uncertain', note: 'A simulated timeout reserves delivery. Retry the scan: the engine will not send again.', prices: [4790, 3490, 4000, 2990] },
};

export function observations(scenario, sequence = 0) {
  const sample = scenarios[scenario];
  if (!sample) throw new TypeError('Unknown fixture scenario');
  const base = Date.UTC(2027, 2, 1, 9, 41) + sequence * 120_000;
  return journeys.map((journey, index) => {
    const first = { identity: fingerprint(journey), priceCents: sample.prices[index], currency: 'EUR', at: base };
    const second = scenario === 'outage' ? null : { ...first, at: base + 20_000,
      priceCents: sample.prices[index] + (scenario === 'mismatch' ? 500 : 0) };
    return { journey, first, second };
  });
}
