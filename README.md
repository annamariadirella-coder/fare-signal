<p align="center"><strong>FARE SIGNAL</strong><br>Let the price checks run. Get a message when a useful fare appears.</p>

# I wanted a train ticket below €40. I built a watcher that would tell me on Telegram.

I needed a train ticket for a trip in Germany. **The price of the train I was watching kept going up.** Going back to the booking site again and again was not helping.

So I changed the question: **“What if a later train costs less than €40?”** Other departures were fine, as long as they were **direct and after 12:30**, on the same day and route.

I built a system to look for me. It checked prices about every two hours. When it found a suitable train below my budget, it checked again and sent me a Telegram message.

**We bought a ticket for a later train, then switched the alerts off.** The system did not buy anything. It helped me know when to look. The paid fare is private; this project does not claim a saving we cannot show.

**[Try the demo →](https://annamariadirella-coder.github.io/fare-signal/)** · [Read the full story](docs/CASE_STUDY.md) · [Run a copy on your computer](#run-the-demo-on-your-computer)

> **Two versions, one story.** The original private system read real railway prices and sent real Telegram alerts. It is now off. This repository shows the whole journey with made-up trains, prices and messages. It does not include the private railway reader, check live fares or send messages to your phone.

## This is the message I wanted to receive

The goal was not another page to keep checking. **I wanted the message to reach me** when there was something worth looking at.

This picture is an example. Its train and price are the same made-up data used in the demo. They are not the ticket we bought.

<p align="center"><img src="assets/telegram-example.svg" width="540" alt="Example Telegram alert: direct train NF 208 costs €34.90, below the €40 budget. Departure 15:38. Price checked twice. Made-up data; no real message sent."></p>

The message in plain text:

> **A train is below your budget!**  
> **€34.90**, below your limit of €40.  
> NF 208 · direct · 15:38 → 18:16  
> Northport Central → Linden Hbf · 14 March 2027  
> Same train and price checked twice.  
> Check the booking site before buying. The price may change.

In the real system, the bot sent the useful result to my Telegram chat and pointed me to the journey on the booking site. In this demo, the message stays inside the page.

## How I solved the problem

![Six steps: rising price, wider search, two-hour checks, double check, Telegram, purchase and stop](assets/problem-to-solution.svg)

1. **Choose what to look for.** Same day and route, direct trains after 12:30, fare below €40.
2. **Run the checks on GitHub.** GitHub Actions runs a program on a schedule. My home computer did not need to stay on. A scheduled run can start late; it is not an exact alarm clock.
3. **Check twice.** Before sending an alert, the system had to find the same train and price again. If it was unsure, it did not make up an answer.
4. **Remember past messages.** A small “notebook” kept track of trains already sent. Seeing the same train again did not send another alert.
5. **Connect Telegram.** The bot sent the result to my chat. Its secret key lived in GitHub Secrets, outside the code.
6. **Buy the ticket and stop.** Buying was my decision. After buying, we no longer needed the checks.

## When does it send a message?

The demo's rule is **strictly below €40**. Exactly €40 is not enough.

| What the system sees | What happens |
|---|---|
| €47.90, checked twice | No alert: above the budget. |
| €34.90, checked twice for a suitable train | One alert: below the budget. |
| Exactly €40.00 | No alert: not less than €40. |
| First read €34.90, second read €39.90 | No alert: the prices do not match. |
| The same train at €34.90 was already sent | No new message, even after another check. |
| It is unclear whether a message arrived | Wait for a review rather than risk sending twice. |

Checking twice helps catch mistakes. It does not hold the fare: the booking site can change the price before you buy.

## Walk through the whole demo

Open the [online demo](https://annamariadirella-coder.github.io/fare-signal/). You need no account or installation. The Telegram example is visible before the interactive setup.

1. **Make a pretend bot**: act out creating the bot.
2. **Press Start — pretend chat**: say hello with a pretend `/start`.
3. **Start the pretend watch**: turn the watcher on.
4. **Jump 2 hours & check**: move the pretend clock and run a check. At the €40 limit, two simulated messages appear.
5. **Open the notebook**: see both price reads, the decision and what the watcher remembers.
6. Jump two hours again: no new messages for the same trains.
7. **I bought a ticket — stop**: stop the pretend watch. This buys nothing.
8. **Start over**: clear everything and return to bot setup.

Move the budget slider or choose a difficult example: different prices, no answer or unclear delivery. Changing the example clears the notebook; moving only the budget keeps it. Reloading the page clears everything. Nothing keeps running in the background.

## What is public, and what stays private?

| Part | Original private system | This public project |
|---|---|---|
| Price search | Real visits to the railway site | Made-up data |
| Later departures, direct trains, time and budget | Watcher rules | Rules shown with examples |
| Two-hour checks | GitHub Actions, now off | A button moves a pretend clock |
| Double check and message memory | Used by the watcher | Runnable code shared by the demo and tests |
| Telegram | Real bot and alerts, now stopped | Simulated bot setup, Start, chat and receipts |
| Purchase | Made by us on the booking site | No purchase |

You can install **the complete demo** from this repository. It is not a public live-fare service. The original project's story is shared without keys, private chats, tickets or the private monitor's history.

## Run the demo on your computer

You need **Node.js 22 or newer**, a tool that runs JavaScript. If you have Git, open a terminal—the window where you type commands—and enter these lines one at a time:

```sh
git clone https://github.com/annamariadirella-coder/fare-signal.git
cd fare-signal
npm start
```

Open **http://127.0.0.1:8765** in your browser. This address points to your own computer. Keep the terminal open. Press **Ctrl+C** there to stop the demo.

**No Git?** Choose **Code → Download ZIP** on GitHub, unzip it and open a terminal in the folder containing `package.json`. Run `npm start`.

You do not need `npm install`: there are no extra packages to download. If port 8765 is busy, stop the other copy or set `PORT` to another number in your terminal.

| Command | What it does |
|---|---|
| `npm start` | Serves the demo on your computer. |
| `npm test` | Runs 16 checks of the rules and walkthrough. |
| `npm run check` | Looks for code syntax errors, missing files and a few private-data patterns. |
| `npm run build` | Puts the website files in `dist/`. |
| `npm run standalone` | Creates `fare-signal-demo.html`, one file you can open and present without Node. |

The one-file version includes the code, drawings and made-up data. Open the normal multi-file version with `npm start`, rather than double-clicking `index.html`.

## How it is built

The project uses JavaScript with no extra libraries. The page and tests use the same rules. Money is counted in cents: €34.90 becomes `3490`, so comparisons avoid small rounding errors.

| Where to look | What you find |
|---|---|
| `src/monitor.mjs` | The rules and message notebook. |
| `demo/fixtures.mjs` | Made-up trains and prices. |
| `demo/journey.mjs` | Pretend bot, clock and stop button. |
| `demo/app.mjs` | Connects buttons, results and chat. |
| `tests/` | Automatic checks. |
| `assets/` | Drawings and illustrated examples. |
| `.github/workflows/` | Instructions to check and publish this demo on GitHub. |

The tests ask useful questions: is this the right train? Is the price below the limit? Do two reads agree? Can two checks running together send twice? What happens after an unclear delivery? Passing tests does not mean every possible case has been covered.

[![Automatic checks](https://github.com/annamariadirella-coder/fare-signal/actions/workflows/ci.yml/badge.svg)](https://github.com/annamariadirella-coder/fare-signal/actions/workflows/ci.yml)

## Read more

- [The full story: problem, choices and outcome](docs/CASE_STUDY.md).
- [The journey from search to message](docs/JOURNEY.md).
- [How the code works](docs/ARCHITECTURE.md) and [what we checked](docs/QA.md).
- [How to present it](docs/PRESENTING.md) and [publish a copy](docs/PUBLISHING.md).
- [How to help](CONTRIBUTING.md), [keep secrets safe](SECURITY.md) and [take part kindly](CODE_OF_CONDUCT.md).

The project uses the [MIT license](LICENSE). It is not affiliated with Telegram or a railway company. The private-data check knows only a few patterns; a person still needs to review new files before sharing them.
