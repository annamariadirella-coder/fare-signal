# Contributing

Keep the project small, understandable and honest about its boundaries.

1. Explain the user-visible problem or failure mode.
2. Make a focused change using the shared engine where possible.
3. Add a behavior test when a meaningful rule or edge case changes.
4. Run `npm test`, `npm run check`, and `npm run build`.
5. For UI changes, check the default scan, duplicate scan, error scenarios and a narrow screen with keyboard navigation.

Do not add real credentials, private journeys, telemetry or live messaging as part of a demo contribution. New integrations should be opt-in adapters with a documented contract and no credentials in source. Avoid dependency additions without a concrete reason.

An issue or pull request should say what changed, why, how it was checked and what remains uncertain. Never upload secrets as a reproduction.
