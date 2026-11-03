# From checking fares to trusting alerts

## The everyday problem

The original need was practical: find a train ticket below a budget without repeatedly opening a booking website. A private monitor was built, its scope was expanded to later direct departures, and the user eventually bought a suitable ticket. That live monitor was then switched off.

Fare Signal is the public learning artifact from that work. It is rebuilt with fictional data rather than exposing the private deployment. There is no claimed saving, attributed booking price, user metric or production success rate in this repository.

## The product question

The naive rule is “if price is low, send a message.” The useful question is “what evidence is enough to interrupt someone?”

A notification creates a small promise: the price belongs to the right journey, it was actually observed, and the user has not already been interrupted about the same thing. The product is therefore as much about *not sending* as it is about sending.

## Three decisions

### 1. Confirm identity before value

The verification fingerprint includes route, date, train, departure, arrival and directness. Two equal amounts from different services fail confirmation. The fixture observations must be in euros, positive integer cents, ordered and at least 20 seconds apart, with no more than five minutes between them.

That gap is not proof that two real sources are independent. A real adapter must establish independent collection. The demo uses two explicitly fictional observations to make the rule inspectable.

### 2. Treat uncertainty explicitly

An absent response is not zero euros. A changing price is not a confirmed bargain. A transport timeout is not necessarily a failed delivery.

The engine has distinct outcomes for missing data, disagreement, an above-budget price, a ready offer, successful delivery, an existing delivery and an uncertain delivery. The UI shows those differences instead of hiding them behind a generic success or error toast.

### 3. Remember the interruption

The delivery identity belongs to the journey, not the scan or the price. A later scan, or even a lower price for the same journey, does not generate another message. Different journeys can generate separate messages.

The engine reserves the identity synchronously before calling its asynchronous transport. Two simultaneous checks within one JavaScript process therefore cannot both start a send. After an uncertain response, the reservation remains pending. Production would need persistent storage and atomic operations across processes.

## Why the interface looks like this

The page leads with a concise promise and then lets the visitor operate the system. The controls, journey decisions and inbox are visible together. A short verification rail makes the causal chain legible.

Warm paper, a restrained orange signal and a quiet green inbox connect the visual language to the subject without copying railway branding. All critical feedback is text, not color alone. The layout reflows to a single column on small screens. Animations respect reduced-motion preferences.

## What was deliberately left out

- Real scraping and booking APIs: they would require credentials, policies, maintenance and a much broader reliability claim.
- A real Telegram bot: the learning goal is visible decision behavior, not sending visitors messages.
- Accounts, analytics and cloud storage: no visitor identity is needed to understand the product.
- A heavyweight frontend framework: the shared engine and a small browser controller are sufficient for this scope.

## Evidence rather than hype

The tests target failure modes: strict monetary boundaries, wrong journey identity, currency, invalid values, conflicting observations, concurrent execution and ambiguous delivery. The browser walkthrough verifies the product interactions and mobile layout. Nothing in this repository claims a particular number of users, stars, revenue, latency or money saved.

## What a production version would need next

1. Source adapters that collect genuine, independently verified observations.
2. A persistent, atomic delivery ledger and a documented recovery procedure.
3. Freshness checks against the real clock and departure cutoff rules.
4. Scheduling, time-zone handling, rate limits and operational metrics.
5. A transport adapter with secure credential management and receipt validation.

The core lesson: **automation is more useful when its confidence, memory and failure behavior are designed together.**
