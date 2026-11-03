# From “find me a ticket” to a message on a phone

The project began with a real need. I wanted a train ticket below my budget without looking at the booking page all day.

## The whole path

1. **Choose the trip.** Pick stations, a day, a time and a budget. The original watcher looked for direct trains after the chosen time.
2. **Let a timer wake the helper.** GitHub Actions ran the private watcher about every two hours. The computer at home did not need to stay on. A scheduled run can start late; it is not an exact alarm clock.
3. **Find trains and prices.** The private railway reader checked the search filters, passenger details, train and fare. If it could not read them clearly, it stopped rather than guessing.
4. **Look again.** A second visit checked the same train and price. The helper waited between the reads.
5. **Check the budget and notebook.** The price had to be below the limit. The helper remembered trains it had already sent, so it did not keep repeating itself.
6. **Send through Telegram.** The bot sent the useful result to the chosen chat. Its key lived in GitHub Secrets, not in the code.
7. **Buy the ticket, then stop.** The helper did not buy anything. We bought a suitable ticket ourselves and turned the private watcher off.

## What you can try here

| Part | Public browser demo | Original private watcher |
|---|---|---|
| Choose a trip | Made-up trip, adjustable budget | Real configured trip |
| Wake every two hours | Pretend clock, one click per wake-up | GitHub Actions schedule, now disabled |
| Read railway prices | Made-up reads | Real browser visits |
| Check twice and remember | Yes, while the page stays open | Yes, with saved notification state |
| Telegram | Simulated setup, bot, message and receipt | Real alerts, now stopped |
| Buy a ticket | A pretend “I bought a ticket” button | Done by the traveller |

This table matters. A walkthrough of a real project can use made-up data safely. It should still say which parts are pretend and which parts run for real.

## A simple way to present your work

“I built a train-price watcher with a timer, two price checks, repeat-message protection and Telegram alerts. We used the private version to help find a ticket and stopped it after buying one. This public version lets you walk through the whole idea, including Telegram, with made-up data and messages.”

The private source, keys, chat numbers, tickets and messages are not published here. The public demo is a clean rebuild, not a claim that the original railway reader can be installed from this repo.
