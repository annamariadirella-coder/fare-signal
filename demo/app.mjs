import { Monitor } from '../src/monitor.mjs';
import { settings as defaults, journeys, scenarios, observations } from './fixtures.mjs';
import { JourneyDemo } from './journey.mjs';

const $ = id => document.getElementById(id);
const euros = cents => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const settings = { ...defaults };
let sequence = 0;
let busy = false;
let messages = [];

const story = new JourneyDemo();
function renderStory() {
  $('make-bot').disabled = busy || story.bot !== 'missing';
  $('start-bot').disabled = busy || story.bot !== 'created';
  $('start-watch').disabled = busy || story.bot !== 'started' || story.watch !== 'off';
  $('stop-watch').disabled = busy || story.watch !== 'running';
  $('run').disabled = busy || story.watch !== 'running';
  $('clock').textContent = story.clock;
  $('bot-state').textContent = story.bot === 'missing' ? 'No pretend bot yet. Make one below.'
    : story.bot === 'created' ? 'Pretend bot made. Now press Start in its chat.'
    : 'Pretend chat connected. The bot knows where to put its messages.';
  $('watch-state').textContent = story.watch === 'running' ? 'Pretend watch is on. Each click below jumps two hours.'
    : story.watch === 'stopped' ? 'Ticket bought in our story. Watch stopped. No more checks or messages.'
    : 'The watch is off. Connect the pretend bot, then start the watch.';
  $('chat-setup').textContent = story.bot === 'missing' ? 'First, make the pretend bot.'
    : story.bot === 'created' ? 'Your pretend bot is ready. Press Start above.'
    : 'You: /start → Fare Signal: Hello! I can put pretend price messages here.';
  $('run-label').textContent = story.watch === 'stopped' ? 'Watch stopped' : 'Jump 2 hours & check';
  $('stop-note').hidden = story.watch !== 'stopped';
}
function trail(step, text) {
  for (let n = 1; n <= 6; n++) $('trail-' + n).className = n < step ? 'done' : n === step ? 'active' : '';
  $('trail-note').textContent = text;
}
function renderEvidence(reads = [], results = []) {
  $('evidence').replaceChildren();
  reads.forEach(({ journey, first, second }, i) => {
    const row = document.createElement('tr');
    const entry = monitor.ledger.get(first.identity);
    const note = entry?.status === 'delivered' ? 'Told you. Do not repeat.'
      : entry?.status === 'pending' ? 'Waiting. Check before sending again.' : 'No message sent.';
    for (const text of [journey.train, euros(first.priceCents), second ? euros(second.priceCents) : 'No answer', results[i]?.reason || 'Not checked yet.', note]) {
      const cell = document.createElement('td'); cell.textContent = text; row.append(cell);
    }
    $('evidence').append(row);
  });
}

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
      <div>${sparkline(index)}</div><div class="fare"><strong>${unavailable ? '—' : euros(price)}</strong><br><small class="${result ? `result-badge state-${result.status}` : ''}" title="${result?.reason ?? 'A made-up price. Jump two hours to check it.'}">${result ? statusLabels[result.status] : 'Pretend price · not checked yet'}</small></div></article>`;
  }).join('');
  $('lowest').textContent = euros(Math.min(...fixture.prices));
  $('limit').textContent = `< ${euros(settings.thresholdCents)}`;
  $('budget-value').textContent = `€${settings.thresholdCents / 100}`;
}

function renderInbox() {
  $('inbox-badge').textContent = String(messages.length);
  $('alert-count').innerHTML = `${messages.length} <small>shown</small>`;
  if (!messages.length) {
    $('inbox').innerHTML = '<div class="empty-inbox"><div class="empty-icon" aria-hidden="true">✉</div><strong>Nothing to interrupt you.</strong><p>Jump two hours.<br>Only prices that pass get a pretend message.</p></div>';
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
  if (!scenarioChanged) story.reset();
  if (!scenarioChanged) { $('scenario').value = 'drop'; $('budget').value = '40'; settings.thresholdCents = 4000; }
  $('scenario-note').textContent = scenarios[$('scenario').value].note;
  $('verification-title').textContent = 'Ready when you are';
  $('verification-detail').textContent = 'Two checks, 20 pretend seconds apart. You do not need to wait that long.';
  $('scan-count').textContent = 'Scan 00';
  $('scan-dot').className = 'status-dot';
  $('run-label').textContent = 'Check prices';
  $('run-summary').textContent = scenarioChanged ? 'New example. The helper has an empty notebook.' : 'All cleared. Choose an example and jump two hours.';
  stage(0);
  renderJourneys();
  renderInbox();
  renderEvidence();
  renderStory();
  trail(0, story.watch === 'running' ? 'New example. Jump two hours to see what happens. The notebook is empty.' : 'Make a pretend bot, press Start, then turn the watch on. No real keys or accounts are used.');
}

async function run() {
  if (busy || !story.tick()) return;
  busy = true;
  renderStory();
  for (const id of ['run', 'reset', 'scenario', 'budget']) $(id).disabled = true;
  $('run-label').textContent = 'Checking the fares…';
  $('scan-dot').className = 'status-dot active';
  sequence++;
  $('scan-count').textContent = `Scan ${String(sequence).padStart(2, '0')}`;
  const reads = observations($('scenario').value, sequence);
  const before = messages.length;
  trail(1, 'The pretend timer woke up. In the original project, GitHub Actions did this about every two hours.');
  await wait(450);
  trail(2, 'Found four made-up direct trains after 12:30. Now read each price.');
  stage(1);
  $('verification-title').textContent = 'Looking at the first price';
  $('verification-detail').textContent = 'Is this the right train, day and trip? What is its pretend price?';
  $('run-summary').textContent = 'Checking the first pretend price.';
  await wait(650);
  stage(2);
  trail(3, 'Look at the same trains again. The two reads must agree, 20 pretend seconds apart.');
  $('verification-title').textContent = 'Looking at the second price';
  $('verification-detail').textContent = '20 seconds pass on our pretend clock. This little animation is shorter.';
  await wait(700);
  stage(3);
  $('verification-title').textContent = 'Checking the rules and notebook';
  trail(4, 'Is it below your limit? Does the notebook already have a tick for this train?');
  await wait(400);
  trail(5, 'The pretend sender handles only prices that pass. A waiting mark is written before each send.');
  const results = [];
  for (const { journey, first, second } of reads) results.push(await monitor.check(journey, first, second, settings));
  await wait(300);
  renderEvidence(reads, results);
  renderJourneys(results);
  renderInbox();
  const delivered = messages.length - before;
  const duplicate = results.filter(r => r.status === 'duplicate').length;
  const held = results.filter(r => ['mismatch', 'unavailable', 'uncertain'].includes(r.status)).length;
  $('verification-title').textContent = held ? 'Done. Unsure prices or sends must wait.' : duplicate ? 'Done. No repeated messages.' : 'Done. Prices checked.';
  const summary = `${delivered} new pretend message${delivered === 1 ? '' : 's'} · ${duplicate} repeats stopped · ${held} waiting for a check`;
  $('verification-detail').textContent = summary;
  $('run-summary').textContent = summary + '. Nothing was sent outside this tab.';
  trail(6, delivered ? 'Pretend Telegram receipts came back. The notebook now says “told you.” No real message left this page.'
    : held ? 'The helper is unsure, so it waits. No confirmed new message. See the notebook below.'
    : 'No new message was needed. The notebook stops repeats, and prices at or above your limit stay quiet.');
  $('scan-dot').className = 'status-dot finished';
  for (let step = 1; step <= 3; step++) $('step-' + step).className = 'done';
  $('run-label').textContent = 'Check again';
  for (const id of ['run', 'reset', 'scenario', 'budget']) $(id).disabled = false;
  busy = false;
  renderStory();
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

renderStory();
$('make-bot').addEventListener('click', () => { story.makeBot(); renderStory(); });
$('start-bot').addEventListener('click', () => { story.pressStart(); renderStory(); });
$('start-watch').addEventListener('click', () => {
  story.startWatch(); renderStory();
  $('run-summary').textContent = 'Pretend watch is on. Jump two hours to see the whole check-to-message path.';
});
$('stop-watch').addEventListener('click', () => {
  story.stop(); renderStory();
  $('trail-note').textContent = 'Ticket bought in our story. The pretend watch is off. It will not wake up or send again.';
  $('run-summary').textContent = 'Ticket bought in our story. The pretend watch is stopped. Start over to replay.';
});
