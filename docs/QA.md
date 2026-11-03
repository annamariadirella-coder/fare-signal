# Verification record

Prepared and checked on **3 November 2026**. Published as [Fare Signal](https://github.com/annamariadirella-coder/fare-signal), with a [live demo](https://annamariadirella-coder.github.io/fare-signal/).

## Automated verification

- Local runtime: Node.js 24.19.0.
- 13 behavior tests passed using `node --test`.
- Source syntax and local HTML asset checks passed.
- Selected credential and private-project identifier checks passed. This is a narrow guardrail, not a complete security audit.
- The static build completed successfully.
- A self-contained HTML demo was generated from the same engine, fixtures and UI source.

GitHub [CI workflow](https://github.com/annamariadirella-coder/fare-signal/actions) passed all 13 tests, source checks and static build on both Node 22 and Node 24. The [Pages deployment](https://github.com/annamariadirella-coder/fare-signal/actions) also succeeded. The linked workflow shows the public verification results.

## Browser walkthrough

Checked the served demo in the browser:

| Interaction | Observed result |
|---|---|
| Default scenario, €40 limit | 2 simulated alerts |
| Same scan again | 0 new alerts; 2 duplicates blocked |
| Prices disagree | 0 alerts; 4 observations held |
| Source unavailable | 0 alerts; 4 observations held |
| Delivery uncertain | 0 confirmed deliveries; 2 pending outcomes held |
| Repeat uncertain delivery | No new inbox messages; held state retained |
| Budget changed to €20 | 0 alerts |
| Mobile, 390 × 844 viewport | Layout reflowed; no horizontal page overflow |
| Mobile duplicate scan | 0 new alerts; 2 duplicates blocked |
| Keyboard Tab after scan button | Focus moved to Reset sandbox |
| Browser error log during walkthrough | No errors returned |
| Self-contained HTML, served as one document | 2 simulated alerts; no browser errors returned |

Screenshots: [desktop](../assets/demo-desktop.png), [mobile](../assets/demo-mobile.png).

## Limits

No real railway or Telegram integration is included or tested. No claim of full accessibility conformance, distributed delivery guarantees or live fare accuracy is made. The case study and architecture document distinguish the demo from a production implementation.
