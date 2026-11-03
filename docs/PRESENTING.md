# Present Fare Signal in three minutes

Open the [story and Telegram example](https://annamariadirella-coder.github.io/fare-signal/#story). Start with the problem, before showing the buttons.

## 1. The problem: the fare kept rising

“I needed a train ticket. The fare for my chosen departure kept going up. I wanted to spend less than €40 without checking the site all day.”

## 2. The choice: look at later departures too

“Other trains would work, as long as they were direct and after 12:30, on the same day and route. I built a system to look for me.”

## 3. The useful result: a message in my chat

Show the Telegram picture, visible before the demo.

“The original system checked about every two hours. If two reads agreed on the same train and price, and the fare was below my budget, the bot told me on Telegram. This picture uses a made-up train at €34.90. It shows the kind of result, not the ticket I bought.”

## 4. Show how it works

1. Press **Make a pretend bot**, then **Press Start (pretend chat)**.
2. Press **Start the pretend watch**, then **Jump 2 hours & check**.
3. Point to the two messages in the pretend chat and open **Open the notebook**.
4. Jump two hours again. No repeat messages appear.

“The notebook remembers trains already sent. If two prices differ, or delivery is unclear, the system waits instead of giving a doubtful answer.”

## 5. The ending: buy the ticket and stop

Press **I bought a ticket: stop**.

“I found a suitable later departure and bought the ticket on the booking site. Then I stopped the alerts. The program did not buy anything for me.”

## 6. Explain what is real and what is simulated

“The original private system had a real railway reader, timer, double check, message memory and Telegram. This public repository shows the whole path with made-up data and messages. Its rules are runnable code, but it does not search live fares or send phone notifications.”

If someone wants to see the code, show `src/monitor.mjs` and run `npm test`. The 16 tests check prices, trains, repeat messages, unclear delivery, setup, stop and the portable file. [Read about the checks](QA.md).

## Before presenting

Press **Start over**. Keep the made-up-data labels visible. Show only public demo images. Do not describe the example as a paid fare or claimed saving; those are not published.

## Short description

> I turned a repeated ticket search into a watcher with Telegram alerts. It checks direct trains after the chosen time, reads the price twice and avoids repeat messages. The public demo tells the whole story with made-up data.
