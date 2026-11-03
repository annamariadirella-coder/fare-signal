# Security and privacy

This repository is an offline-data demonstration. It contains no production tokens, visitor accounts or real message transport. All visible data is invented.

If you find a security issue in a published copy, use that repository's private vulnerability reporting feature when available. Do not post credentials or personal data in a public issue. If private reporting is unavailable, ask the maintainer for a private contact channel without including exploit details or secrets in the request.

The local server binds to loopback only and is intended for development. Use a proper static host for publication. The `npm run check` scan detects selected credential patterns and private-project identifiers; it is not a full secret-scanning product or security audit.

For real integrations, keep secrets outside this repository, use scoped permissions, validate provider receipts and persist delivery state atomically. This demo does not guarantee distributed exactly-once delivery.
