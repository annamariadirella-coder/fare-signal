# What I checked

Checked on **3 November 2026**. The [public repository](https://github.com/annamariadirella-coder/fare-signal) includes a [live demo](https://annamariadirella-coder.github.io/fare-signal/).

## Automatic checks

- All 16 tests passed. They cover budget boundaries, wrong journeys, matching reads, repeated sends, simultaneous checks, unclear delivery, bot setup, stopping and the portable demo.
- GitHub checks the project on Node.js 22 and 24. See the [CI workflow](https://github.com/annamariadirella-coder/fare-signal/actions/workflows/ci.yml) for the current results.
- JavaScript syntax, local page files and selected private-data patterns were checked.
- The static website build completed. The [Pages workflow](https://github.com/annamariadirella-coder/fare-signal/actions/workflows/pages.yml) records deployments.
- The portable HTML generator embeds the rules, made-up data, styles and SVG illustration. Its test checks that the module parses and no separate image file is required.

## Browser checks

| Step | Observed result |
|---|---|
| Create the pretend bot, press Start and start the watch | The controls become ready in that order |
| Jump two hours at a €40 limit | Two simulated fare alerts |
| Jump another two hours | No new alerts; two repeats stopped |
| Open the notebook | Both price reads, decisions and message states are visible |
| Choose different prices | No messages; four decisions held |
| Choose a missing source | No messages; no invented prices |
| Choose unclear delivery | Two qualifying sends stay pending rather than being retried |
| Stop after the pretend purchase | Further checks are disabled until Start over |
| Telegram-style preview | Outgoing Start bubble, bot reply, fare alerts and simulation labels |
| Story illustration | The budget, price and journey match the made-up demo data |
| Latest browser walkthrough | No browser errors returned |

Earlier desktop and narrow-screen checks covered the page layout and keyboard navigation. These are manual checks, not a full accessibility certification.

## Public-data review

The review covered all 10 development commits before the privacy cleanup, 110 distinct text versions and both historical screenshots. It found no copied conversation, bot credential, private chat ID, private railway journey or unrelated project in those files. The screenshots contain only fictional demo data.

Commit author and committer metadata were then rebuilt with the owner's GitHub `noreply` address. Public documentation links to the current workflows rather than archived commit IDs or old workflow runs. New contributions should follow the [commit privacy guidance](../SECURITY.md#commit-privacy).

## Video walkthrough

The video uses captured public demo screens and English system-voice narration. It shows the made-up budget, bot setup, two reads, Telegram-style alert, duplicate protection, disagreement and stopping. Captions are visible in the picture, with a separate transcript and caption file. No private browser tabs, personal email, real ticket or real Telegram chat are included.

## Limits

No real railway or Telegram connection is included or tested in this public demo. The message notebook is held in this browser tab, not shared between separate computers. The tests do not prove live fare accuracy, ticket availability, distributed delivery guarantees or compatibility with every accessibility tool.

The private-data check looks for selected patterns. A human review is still needed before publishing new files. A passing test means the code answered that test question correctly; it does not prove the program can never fail.
