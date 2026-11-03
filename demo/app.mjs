import { Monitor } from '../src/monitor.mjs';
import { settings as defaults, journeys, scenarios, observations } from './fixtures.mjs';

const $ = id => document.getElementById(id);
const euros = cents => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const settings = { ...defaults };
let sequence = 0;
let busy = false;
let messages = [];
const histories = [[55, 48, 52, 47, 47, 47], [59, 54, 46, 49, 39, 35], [49, 45, 48, 43, 40, 40], [44, 47, 40, 34, 36, 30]];
const statusLabels = { delivered: '✓ Message shown', duplicate: '↳ Already told you', above: 'Not below your limit', mismatch: 'Prices do not match', unavailable: 'Could not check', uncertain: 'Waiting for a check', excluded: 'Not a chosen train' };

const monitor = new Monitor(async alert => {
  if ($('scenario').value === 'uncertain') throw new Error('Deliberately simulated transport timeout');
  const receipt = { id: `simulated-${messages.length + 1}` };
  messages.push({ ...alert, receipt: receipt.id });
  return receipt;
});

function sparkline(index) {
  const values = histories[index];
  const points = values.map((value, i) => `${i * 15 + 2},${26 - (value - 25) * .6}`);
  const [x, y] = points.at(-1).split(',');
  return `<svg class="spark" viewBox="0 0 82 30" role="img" aria-label="Made-up price history"><line x1="0" y1="26" x2="82" y2="26"/><path d="M${points.join(' L')}"/><circle cx="${x}" cy="${y}" r="2.3"/></svg>`;
}

function renderJourneys(results = []) {
  const fixture = scenarios[$('scenario').value];
  $('journeys').innerHTML = journeys.map((journey, index) => {
    const result = results[index];
    const nextDay = journey.arrival < journey.departure;
    const price = result?.priceCents ?? fixture.prices[index];
    const unavailable = result && ['unavailable', 'mismatch'].includes(result.status);
    return `<article class="journey" aria-label="${journey.train}, ${journey.departure} to ${journey.arrival}${nextDay ? ', next day' : ''}">
      <div><div class="journey-train"><span class="train-badge">${journey.train}</span><span class="duration">Direct service</span></div><div class="journey-time">${journey.departure}<span>→</span>${journey.arrival}${nextDay ? '<sup>+1</sup>' : ''}</div></div>
      <div>${sparkline(index)}</div><div class="fare"><strong>${unavailable ? '—' : euros(price)}</strong><br><small class="${result ? `result-badge state-${result.status}` : ''}" title="${result?.reason ?? 'A made-up price. Press Check prices to check it.'}">${result ? statusLabels[result.status] : 'Pretend price · not checked yet'}</small></div></article>`;
  }).join('');
  $('lowest').textContent = euros(Math.min(...fixture.prices));
  $('limit').textContent = `< ${euros(settings.thresholdCents)}`;
  $('budget-value').textContent = `€${settings.thresholdCents / 100}`;
}

function renderInbox() {
  $('inbox-badge').textContent = String(messages.length);
  $('alert-count').innerHTML = `${messages.length} <small>shown</small>`;
  if (!messages.length) {
    $('inbox').innerHTML = '<div class="empty-inbox"><div class="empty-icon" aria-hidden="true">✉</div><strong>Nothing to interrupt you.</strong><p>Press Check prices.<br>Only prices that pass get a pretend message.</p></div>';
    return;
  }
  $('inbox').innerHTML = messages.map(({ journey, priceCents }, index) => `<article class="message"><div class="message-title">Fare Signal <span>PRETEND MESSAGE</span></div><h4>${euros(priceCents)}</h4><p><strong>${journey.train} · ${journey.departure} → ${journey.arrival}${journey.arrival < journey.departure ? ' +1' : ''}</strong><br>Northport Central → Linden Hbf<br>Sun, 14 Mar · direct · second class</p><p class="message-meta">The same price appeared in two pretend<br>checks, 20 pretend seconds apart.</p><footer>pretend receipt ${String(index + 1).padStart(2, '0')} &nbsp;✓✓</footer></article>`).reverse().join('');
}

function stage(number) {
  for (let step = 1; step <= 3; step++) $('step-' + step).className = step < number ? 'done' : step === number ? 'active' : '';
}

function reset({ scenarioChanged = false } = {}) {
  if (busy) return;
  monitor.reset();
  messages = [];
  sequence = 0;
  if (!scenarioChanged) { $('scenario').value = 'drop'; $('budget').value = '40'; settings.thresholdCents = 4000; }
  $('scenario-note').textContent = scenarios[$('scenario').value].note;
  $('verification-title').textContent = 'Ready when you are';
  $('verification-detail').textContent = 'Two checks, 20 pretend seconds apart. You do not need to wait that long.';
  $('scan-count').textContent = 'Scan 00';
  $('scan-dot').className = 'status-dot';
  $('run-label').textContent = 'Check prices';
  $('run-summary').textContent = scenarioChanged ? 'New example. The helper has an empty notebook.' : 'All cleared. Choose an example and press Check prices.';
  stage(0);
  renderJourneys();
  renderInbox();
}

async function run() {
  if (busy) return;
  busy = true;
  for (const id of ['run', 'reset', 'scenario', 'budget']) $(id).disabled = true;
  $('run-label').textContent = 'Checking the fares…';
  $('scan-dot').className = 'status-dot active';
  sequence++;
  $('scan-count').textContent = `Scan ${String(sequence).padStart(2, '0')}`;
  const reads = observations($('scenario').value, sequence);
  const before = messages.length;
  stage(1);
  $('verification-title').textContent = 'Looking at the first price';
  $('verification-detail').textContent = 'Is this the right train, day and trip? What is its pretend price?';
  $('run-summary').textContent = 'Checking the first pretend price.';
  await wait(650);
  stage(2);
  $('verification-title').textContent = 'Looking at the second price';
  $('verification-detail').textContent = '20 seconds pass on our pretend clock. This little animation is shorter.';
  await wait(700);
  stage(3);
  $('verification-title').textContent = 'Checking the rules and notebook';
  const results = [];
  for (const { journey, first, second } of reads) results.push(await monitor.check(journey, first, second, settings));
  await wait(300);
  renderJourneys(results);
  renderInbox();
  const delivered = messages.length - before;
  const duplicate = results.filter(r => r.status === 'duplicate').length;
  const held = results.filter(r => ['mismatch', 'unavailable', 'uncertain'].includes(r.status)).length;
  $('verification-title').textContent = held ? 'Done. Unsure prices or sends must wait.' : duplicate ? 'Done. No repeated messages.' : 'Done. Prices checked.';
  const summary = `${delivered} new pretend message${delivered === 1 ? '' : 's'} · ${duplicate} repeats stopped · ${held} waiting for a check`;
  $('verification-detail').textContent = summary;
  $('run-summary').textContent = summary + '. Nothing was sent outside this tab.';
  $('scan-dot').className = 'status-dot finished';
  for (let step = 1; step <= 3; step++) $('step-' + step).className = 'done';
  $('run-label').textContent = 'Check again';
  for (const id of ['run', 'reset', 'scenario', 'budget']) $(id).disabled = false;
  busy = false;
}

$('run').addEventListener('click', run);
$('reset').addEventListener('click', () => reset());
$('scenario').addEventListener('change', () => reset({ scenarioChanged: true }));
$('budget').addEventListener('input', event => {
  settings.thresholdCents = Number(event.target.value) * 100;
  renderJourneys();
  $('run-summary').textContent = `Now looking for prices below ${euros(settings.thresholdCents)}. Check again. The helper still remembers past messages.`;
});
$('scenario-note').textContent = scenarios.drop.note;
renderJourneys();
renderInbox();
