# Keep secrets safe

This project uses made-up data. It has no real bot keys, visitor accounts or real message sender.

A **secret key** is like a key to your front door. Keep it out of public files, screenshots and messages. Never post one in a GitHub issue, which other people may be able to read.

## If you find a safety problem

Use the repo's **private vulnerability reporting** feature if it is available. That lets you tell the owner about a problem privately. If it is not available, ask the owner how to contact them privately. In that first public request, leave out secrets and details someone could use to cause harm.

## What my checks do

`npm run check` looks for a few known shapes of secret keys and private-project details. It cannot catch everything. A person must still look through files before publishing them.

The local server listens only on your own computer. Use a static website host to share the demo online.

## If you build a real sender

Keep its keys outside the code. Give it only the permissions it needs. Check the sender's receipts. Save the message notebook so restarts do not erase it, and make shared updates happen in one step. The [how-it-works guide](docs/ARCHITECTURE.md) explains why this small demo cannot promise exactly one real delivery.
