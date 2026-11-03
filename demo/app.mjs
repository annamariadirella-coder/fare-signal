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
const statusLabels = { delivered: '✓ Alert delivered', duplicate: '↳ Already notified', above: 'At / above limit', mismatch: 'Prices disagree', unavailable: 'Not verified', uncertain: 'Delivery held', excluded: 'Outside scope' };

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
  return `<svg class="spark" viewBox="0 0 82 30" role="img" aria-label="Illustrative fictional fare history"><line x1="0" y1="26" x2="82" y2="26"/><path d="M${points.join(' L')}"/><circle cx="${x}" cy="${y}" r="2.3"/></svg>`;
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
      <div>${sparkline(index)}</div><div class="fare"><strong>${unavailable ? '—' : euros(price)}</strong><br><small class="${result ? `result-badge state-${result.status}` : ''}" title="${result?.reason ?? 'An illustrative fare, awaiting verification.'}">${result ? statusLabels[result.status] : 'Fixture fare · not yet checked'}</small></div></article>`;
  }).join('');
  $('lowest').textContent = euros(Math.min(...fixture.prices));
  $('limit').textContent = `< ${euros(settings.thresholdCents)}`;
  $('budget-value').textContent = `€${settings.thresholdCents / 100}`;
}

function renderInbox() {
  $('inbox-badge').textContent = String(messages.length);
  $('alert-count').innerHTML = `${messages.length} <small>delivered</small>`;
  if (!messages.length) {
    $('inbox').innerHTML = '<div class="empty-inbox"><div class="empty-icon" aria-hidden="true">✉</div><strong>Nothing to interrupt you.</strong><p>Only matching, qualifying fares<br>earn a simulated message.</p></div>';
    return;
  }
  $('inbox').innerHTML = messages.map(({ journey, priceCents }, index) => `<article class="message"><div class="message-title">Fare Signal <span>SIMULATED ALERT</span></div><h4>${euros(priceCents)}</h4><p><strong>${journey.train} · ${journey.departure} → ${journey.arrival}${journey.arrival < journey.departure ? ' +1' : ''}</strong><br>Northport Central → Linden Hbf<br>Sun, 14 Mar · direct · second class</p><p class="message-meta">Same fare confirmed in two independent<br>fixture observations, 20 virtual seconds apart.</p><footer>demo receipt ${String(index + 1).padStart(2, '0')} &nbsp;✓✓</footer></article>`).reverse().join('');
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
  $('verification-detail').textContent = 'Two observations, at least 20 virtual seconds apart. No real waiting required.';
  $('scan-count').textContent = 'Scan 00';
  $('scan-dot').className = 'status-dot';
  $('run-label').textContent = 'Run verification';
  $('run-summary').textContent = scenarioChanged ? 'New scenario loaded. The sandbox ledger has been reset.' : 'Sandbox reset. Choose a scenario and run a scan.';
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
  $('verification-title').textContent = 'Reading source A';
  $('verification-detail').textContent = 'Inspecting the fictional route, service, date, directness and fare.';
  $('run-summary').textContent = 'Verification in progress: first fixture observation.';
  await wait(650);
  stage(2);
  $('verification-title').textContent = 'Checking an independent observation';
  $('verification-detail').textContent = 'The fixture clock advances 20 seconds. The UI animation is shorter.';
  await wait(700);
  stage(3);
  $('verification-title').textContent = 'Applying rules & checking the ledger';
  const results = [];
  for (const { journey, first, second } of reads) results.push(await monitor.check(journey, first, second, settings));
  await wait(300);
  renderJourneys(results);
  renderInbox();
  const delivered = messages.length - before;
  const duplicate = results.filter(r => r.status === 'duplicate').length;
  const held = results.filter(r => ['mismatch', 'unavailable', 'uncertain'].includes(r.status)).length;
  $('verification-title').textContent = held ? 'Scan complete. Uncertainty held back.' : duplicate ? 'Scan complete. No repeat interruptions.' : 'Scan complete. Only useful signals.';
  const summary = `${delivered} new simulated alert${delivered === 1 ? '' : 's'} · ${duplicate} duplicates blocked · ${held} held for review`;
  $('verification-detail').textContent = summary;
  $('run-summary').textContent = summary + '. Nothing was sent outside this tab.';
  $('scan-dot').className = 'status-dot finished';
  for (let step = 1; step <= 3; step++) $('step-' + step).className = 'done';
  $('run-label').textContent = 'Run verification again';
  for (const id of ['run', 'reset', 'scenario', 'budget']) $(id).disabled = false;
  busy = false;
}

$('run').addEventListener('click', run);
$('reset').addEventListener('click', () => reset());
$('scenario').addEventListener('change', () => reset({ scenarioChanged: true }));
$('budget').addEventListener('input', event => {
  settings.thresholdCents = Number(event.target.value) * 100;
  renderJourneys();
  $('run-summary').textContent = `Limit changed to strictly below ${euros(settings.thresholdCents)}. Run a new scan; the delivery ledger is retained.`;
});
$('scenario-note').textContent = scenarios.drop.note;
renderJourneys();
renderInbox();
