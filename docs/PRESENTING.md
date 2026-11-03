# Show Fare Signal to a friend

You can show the project in about three minutes. Open the [demo](https://annamariadirella-coder.github.io/fare-signal/) first.

## 1. Tell the little story

“I built a helper that checked real train prices, ran about every two hours and sent Telegram alerts. We bought a ticket and stopped it. This public version shows the whole journey with made-up data.”

## 2. Start the pretend bot, then show a message

Press **Make a pretend bot**, then **Press Start — pretend chat**, then **Start the pretend watch**. Show the `/start` and hello in the chat.

Choose **A cheaper ticket**, keep **€40**, and press **Jump 2 hours & check**. Follow the six steps from timer to Telegram receipt.

“The helper sees the same price twice. It checks that this is the right train. Two tickets cost less than €40, so two pretend messages appear. Nothing goes to Telegram.”

The two reads are 20 pretend seconds apart. The short animation is not a real live check.

## 3. Show its memory

Open **Open the notebook** to show the two price reads and the “told you” marks. Then press **Jump 2 hours & check** again.

“No new messages! The helper has a little notebook. It remembers which trains it already told us about.”

## 4. Show what happens when it is unsure

Choose **The prices do not match**, then check.

“The two answers are different. The helper waits instead of calling it a bargain.”

Choose **Did the message arrive?**, then check twice.

“The pretend sender did not give a clear answer. The helper does not send again, because the first message might have arrived.”

## 5. Show the checks

If your friend wants to see the code, open `src/monitor.mjs`. That file holds the rules. In the project folder, run:

```sh
npm test
```

“The page and these 15 tests use the same rules. The tests ask questions about prices, wrong trains, repeat messages and unclear answers.”

## 6. Buy a ticket in the story and stop the watch

Press **I bought a ticket — stop**. Point out that the check button is now off. The original private watcher was also stopped after the traveller bought a ticket. No button in this demo buys anything.

## 7. Say what is still pretend

“This page acts out the timer, bot setup, price reads and Telegram delivery. It does not look up real prices or send real messages. Its notebook disappears when I reload. The original private helper had real price readers, saved notification state, a timer and Telegram. Those private parts are not included in this public teaching version.”

Finish with: “A useful helper knows when to tell you something, and when to stay quiet.”

## Before you show it

Press **Start over**. Keep the “pretend” label visible. Show only the made-up data. Say what you actually built and checked. Use the [check record](QA.md) if someone asks for details.

## A short description to copy

> A little train-price playground. It checks a price twice and remembers which trains it already told you about. All data and messages are pretend. Built with JavaScript, with no extra packages to install.
