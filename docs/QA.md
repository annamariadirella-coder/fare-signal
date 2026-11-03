# What we checked

Prepared and checked on **3 November 2026**. Published as [Fare Signal](https://github.com/annamariadirella-coder/fare-signal), with a [live demo](https://annamariadirella-coder.github.io/fare-signal/).

## Questions the computer checked

- On our computer, we used Node.js 24.19.0.
- All 16 test questions passed using `node --test`.
- The code spelling checks passed. The page could find its local files.
- The check found none of the secret or private-project patterns it looks for. It only knows a few patterns, so a person still needs to review the files.
- The website files were packed into `dist/` successfully.
- We also made one HTML file with the same rules, pretend data and page inside.

GitHub [CI workflow](https://github.com/annamariadirella-coder/fare-signal/actions) passed all 13 tests, source checks and static build on both Node 22 and Node 24. The [Pages deployment](https://github.com/annamariadirella-coder/fare-signal/actions) also succeeded. The linked workflow shows the public verification results.

## Full-story update

The local suite now has 16 passing tests. Two new questions check the bot → Start → watch order and that buying a ticket stops all future pretend wake-ups.

In the browser, we checked bot setup, the 08:00 → 10:00 clock jump, two first messages, a second jump with two repeats stopped, the notebook's two reads, and the stop button disabling further checks. We also checked the setup on a narrow screen and saw no sideways page overflow. Different-price reads produced no messages and four held decisions.

## Things we tried in the first version

We opened the first version in a browser and tried these steps. The table uses the new, simpler button names; the rules are the same:

| Interaction | Observed result |
|---|---|
| A cheaper ticket, €40 limit | 2 pretend messages |
| Press Check again | 0 new messages; 2 repeats stopped |
| The prices do not match | 0 messages; 4 trains left unchecked |
| No price comes back | 0 messages; 4 trains left unchecked |
| Did the message arrive? | 0 confirmed messages; 2 sends waiting for a person to check |
| Repeat uncertain delivery | No new messages; the sends still wait for a check |
| Budget changed to €20 | 0 messages |
| Mobile, 390 × 844 viewport | The parts stacked neatly; no sideways page scrolling |
| Mobile duplicate scan | 0 new messages; 2 repeats stopped |
| Keyboard Tab after the check button | Focus moved to Start over |
| Browser error log during walkthrough | No errors returned |
| The one-file HTML demo, opened through a server | 2 pretend messages; no browser errors returned |

Pictures from the first version (button names were later made simpler): [desktop](../assets/demo-desktop.png), [mobile](../assets/demo-mobile.png).

## What these checks cannot tell us

We did not connect to or test a real railway website or Telegram. These checks do not prove that every accessibility tool works, that real prices are correct, or that separate running copies can safely share a message notebook. Read [how it works](ARCHITECTURE.md) before building a real service.

A test is a question we ask the code. A green result means it answered that question as expected. It does not prove the whole program can never go wrong. The GitHub links above show the exact runs we checked before this wording update.

The one-file generator now has a parser check too. It handles both Windows and Unix line endings so leftover imports cannot break the single HTML file.
