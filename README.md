<p align="center"><img src="assets/banner.svg" alt="Fare Signal — less noise. Better fares." width="100%"></p>

<p align="center"><strong>Verify twice. Notify once.</strong><br>A small, interactive case study in building alerts people can trust.</p>

<p align="center"><a href="#quick-start">Quick start</a> · <a href="docs/CASE_STUDY.md">Case study</a> · <a href="docs/ARCHITECTURE.md">Architecture</a> · <a href="docs/PRESENTING.md">Presentation guide</a></p>

<p align="center"><a href="https://github.com/annamariadirella-coder/fare-signal/actions/workflows/ci.yml"><img alt="Verify the demo" src="https://github.com/annamariadirella-coder/fare-signal/actions/workflows/ci.yml/badge.svg"></a> · JavaScript · No runtime dependencies · MIT</p>

---

A cheap fare is useful. An incorrect alert is noise. A repeated alert is an interruption.

**Fare Signal** is a fictional rail-fare monitoring playground. Change the budget, introduce conflicting source data, simulate an outage, or run the same scan twice. Watch the verification decisions and a Telegram-style inbox respond.

It grew from a real personal automation problem: monitoring train fares without checking the booking site all day. This repository is a **clean, standalone demonstration**, rebuilt with invented stations, services and observations. It contains no production credentials, private journey history or real messaging integration.

![Fare Signal interactive playground](assets/demo-desktop.png)

## The 30-second tour

1. Start with **A fare drops** and the default **€40** limit. Run verification.
2. Two fictional offers qualify. Two simulated messages appear.
3. Run it again. The same offers are verified, but **no duplicate messages** appear.
4. Try **Prices disagree**, **Source unavailable**, or **Delivery uncertain**. A plausible price alone never triggers a trusted alert.

**All data is fictional.** No DB requests, no Telegram requests, no analytics, no API keys. The UI compresses a 20-second *fixture-clock* gap into a short animation. It does not pretend to perform a live check.

## Quick start

Requires **Node.js 22 or newer**. No dependency installation is needed.

```sh
git clone https://github.com/annamariadirella-coder/fare-signal.git
cd fare-signal
npm start
```

Open **http://127.0.0.1:8765**. Start from the repository root. If the port is busy, set `PORT` to another port in your shell.

**No Git?** Use **Code → Download ZIP**, extract the folder, open a terminal there and run `npm start`. No `npm install`, account or API key is required.

**Presenting without Node?** Generate the single-file demo with `npm run standalone` on a machine with Node, then open the resulting HTML file in any modern browser. All data and logic are embedded.

```sh
npm test     # meaningful behavior tests using the built-in Node test runner
npm run check
npm run build
```

The static build is written to `dist/`. Serve it over HTTP; opening `index.html` directly as a file will not reliably load ES modules. [Publishing instructions](docs/PUBLISHING.md) cover GitHub and GitHub Pages.

Prefer a single file for a presentation? Run `npm run standalone`. The generated `fare-signal-demo.html` embeds the engine, fixtures, styles and browser controller and can be opened directly, without a server. Its documentation links stay within the demo; the full guides are in this repository. This generated file is ignored by Git.

## What makes it interesting

| Decision | Why it exists |
|---|---|
| Check the whole journey identity | Equal prices for different trains are not confirmation. |
| Store money as integer cents | A threshold should not depend on floating-point rounding. |
| Require matching observations | Conflicting or incomplete data must not become a confident alert. |
| Use a strict threshold | At the default limit, €39.99 qualifies; €40.00 does not. |
| Reserve delivery before awaiting it | Concurrent checks must not both send the same alert. |
| Hold ambiguous deliveries | A timeout may happen after a message was received. Blind retries create noise. |
| Share the engine between demo and tests | The visible behavior is powered by the same code the suite exercises. |

## Explore the scenarios

| Scenario | What to try | Expected result |
|---|---|---|
| A fare drops | Run at €40, then run again | Two deliveries; the next scan blocks two duplicates. |
| Prices disagree | Run any scan | Mismatched observations are held. No messages. |
| Source unavailable | Run any scan | Missing observations are held. No invented prices. |
| Delivery uncertain | Run twice | One attempt per qualifying journey; subsequent attempts stay blocked for review. |
| Custom budget | Set the limit to €35 | €34.90 and €29.90 qualify. Raising the limit does not forget the delivery ledger. |

Changing scenarios or choosing **Reset sandbox** clears the simulated ledger. Adjusting the budget retains it. Reloading the page clears all state; nothing is persisted.

## Repository map

```text
src/monitor.mjs         Verification rules and transport-independent delivery ledger
demo/fixtures.mjs       Invented journeys and deterministic observation pairs
demo/app.mjs            Browser controller and simulated inbox
demo/styles.css         Responsive, dependency-free interface
tests/monitor.test.mjs   Thresholds, identity, errors, concurrency and deduplication
scripts/                Local preview, static build and public-data checks
docs/                   Case study, architecture, presentation and publishing guides
.github/workflows/      CI and an explicitly manual GitHub Pages deployment
```

## Design boundaries

This is a **demo and reusable verification core**, not a production booking service. Its delivery ledger is in memory. A real deployment would require a persistent, atomic ledger, live-source freshness rules, a scheduler, source-specific validation, secure credentials and operational monitoring. Read the [architecture and tradeoffs](docs/ARCHITECTURE.md) before adapting it.

The Telegram-style messages are visual simulations. This project is not affiliated with any railway operator or Telegram. It makes no claims about real ticket prices or availability. The repository's public-data check is a guardrail, not a replacement for a human review before publication.

## Contributing

Small, well-scoped improvements are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), and the [code of conduct](CODE_OF_CONDUCT.md).

**MIT licensed.** No fake stars, testimonials or performance claims. Just a useful little problem, carefully explored.

See the [verification record](docs/QA.md) for checks actually performed. The CI badge above links to the actual remote results. GitHub Pages deployment is explicitly manual.
