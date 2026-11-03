# Present Fare Signal in three minutes

## 0:00 — Start with the problem

“This began as an everyday problem: I wanted to know when a train fare fell below my budget without checking a booking website all day. The public demo uses invented journeys and prices so anyone can explore the logic without accessing the private system.”

## 0:25 — Make the product do something

Open the playground. Leave **A fare drops** and **€40** selected. Run verification.

“The same journey and fare must agree across two observations. The animation represents a virtual 20-second gap; it isn't a live price check.”

Point out the two local inbox messages. Run the verification again.

“The second scan does not send the same messages again. The engine remembers the journey, not just the current price.”

## 1:15 — Show the edge cases

Switch to **Prices disagree** and run once. Then switch to **Delivery uncertain**, run twice.

“A changing price is held back. An uncertain delivery stays pending because a timeout can happen after a message is received. The system doesn't blindly retry.”

## 2:00 — Explain the engineering choice

Show `src/monitor.mjs` and run `npm test`.

“The browser and tests use the same small engine. Money is integer cents; eligibility, identity, observation timing and delivery are explicit rules. The demo has no runtime dependencies.”

## 2:35 — Name the boundary honestly

“This is a clean demonstration, not a public live-fare service. A real multi-user deployment needs persistent atomic storage, source adapters, real-clock freshness and operational monitoring. Those tradeoffs are documented.”

## 3:00 — Close with the takeaway

“The useful part isn't the notification. It's deciding when the evidence is good enough to deserve someone's attention.”

## Before recording a walkthrough

- Reset the sandbox and restore the €40 limit.
- Keep the simulated-data label visible.
- Use the demo's fictional route, not private tickets or messages.
- Record one successful scan, one repeated scan and one failure scenario.
- Never claim stars, users, money saved or production guarantees you cannot substantiate.

## Short repository description

> A fictional rail-fare monitoring playground. Shared verification engine, independent observations, journey-level deduplication and a simulated Telegram-style inbox. Built with plain JavaScript and no runtime dependencies.
