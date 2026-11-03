# The story behind Fare Signal

## A small everyday problem

I wanted to find a train ticket below my budget. Looking at a booking website again and again took time.

A private helper read the railway website, ran about every two hours on GitHub Actions, checked prices twice and sent real Telegram alerts. It remembered earlier notifications. Later, it also watched later direct trains. We bought a suitable ticket and switched the helper off.

This public project tells that story with **made-up trains, stations and prices**. It does not share the private helper or its messages. It does not claim a particular saving or ticket price.

The public walkthrough now shows the whole path: make a pretend bot, press Start, wake the timer, check prices, look in the notebook, send a pretend Telegram message, then stop after buying a ticket. [See the real-versus-pretend map](JOURNEY.md).

## A cheap price is only the start

Imagine a friend says, “I found a €30 ticket!” You would want to know: “Is it my train? Is that still the price? Did you already tell me?”

Those are the questions this demo asks before showing a message.

## Three simple choices

### Check the train first

The date, stations, train and times must match. A cheap ticket for the wrong train does not help.

### Wait when unsure

If one check says €30 and the next says €35, the helper waits. If no answer comes back, it does not invent a price.

Sending can be uncertain too. Imagine posting a letter, then losing the receipt. The letter might still arrive. Sending another straight away could give your friend two letters. The helper keeps that send marked “waiting” until it can be checked.

### Remember what was said

The helper puts a tick beside a train after sending its message. Checking again does not send it again. A lower price for the same train does not erase the tick. Another train can get its own message.

The notebook is only held in memory here. A real helper would need to save it. [How it works](ARCHITECTURE.md) gives the exact rules.

## Why the page looks this way

The controls, trains and message box sit together so you can see what your click did. Words explain each result; color is not the only clue. On a small screen, the parts stack one below another. The page follows the browser's reduced-motion setting.

## What we left out

You need no account, keys or real Telegram bot. The demo has no visitor tracking. Plain JavaScript is enough for this little example, so there are no extra code packages to install.

## How we checked it

We ask the code 16 test questions. For example: does exactly €40 fail a “below €40” rule? Does a second check stay quiet? What if two checks run together?

We also tried the buttons in a browser and on a narrow screen. The [check record](QA.md) says what passed and where the checks stop.

The lesson is simple: **a helpful message should be right, and it should not keep repeating itself.**
