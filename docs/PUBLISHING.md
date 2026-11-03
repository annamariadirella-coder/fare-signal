# Publish the clean demonstration

This is a clean, standalone project. Do not replace or expose a private live-monitor repository or its Git history. These instructions explain how to publish a copy under your own account.

## GitHub repository

1. Create a new empty repository named `fare-signal` in your account. Choose its visibility deliberately. Do not initialize it with another README or license.
2. Extract this project's ZIP and review the files. There should be no private deployment data, credentials, ticket screenshots or personal messaging identifiers.
3. From this folder, run `npm test`, `npm run check`, and `npm run build`.
4. Initialize Git locally, commit the clean source, and connect it to the new repository using GitHub's displayed instructions. Push the default branch as `main`.
5. Use the description in [PRESENTING.md](PRESENTING.md). Suggested topics: `javascript`, `monitoring`, `notifications`, `demo`, `rail`, `testing`, `portfolio`.

The `dist/` directory, dependencies and local environment files are ignored. Track the source, docs and screenshots. This package includes no Git history.

## GitHub Pages

The included Pages workflow is **manual only**. It contains no real fare checks, schedules or messaging integrations.

1. In the new repository, open **Settings → Pages** and select **GitHub Actions** as the build/deployment source.
2. Open **Actions → Deploy demo to GitHub Pages → Run workflow** on `main`.
3. After GitHub reports a successful deployment, use the URL it returns. Verify the playground and mobile layout there.
4. Add that actual URL to the repository's About/Website field and to the top of the README. Do not insert a guessed or unverified URL.

Deployment availability and visibility depend on your GitHub account and repository settings. The workflow requests only the Pages deployment permissions it uses.

## Other static hosts

Run `npm run build` and publish only `dist/` to your chosen static host. The site uses relative asset paths and needs no server-side secrets or API configuration. Keep the simulated-data notices intact.

## Before you share

- Confirm the demo is labelled fictional and sends no real messages.
- Check the desktop screenshot and all relative links.
- Replace no private history: publish only this clean project.
- Verify the CI result and deployed URL rather than claiming checks that have not run remotely.
- Leave the original live monitor disabled unless you explicitly need it again.
