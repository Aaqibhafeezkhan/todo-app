# Contributing to todo-app

Thanks for helping. Small pull requests are best; jarman reviews everything.

## Setup

- Node.js 20. Run `npm ci` (or `npm install`) and then `npm start`.
- Tests: `npm test -- --watchAll=false`.
- No new runtime dependencies without an issue first.

## Issues and pull requests

- Comment on a `good first issue` or `help wanted` issue and we will assign it.
- Branch from `main`, keep the diff focused, and reference the issue (`Closes #N`).
- Use conventional commit subjects (`fix:`, `feat:`, `docs:`, `chore:`).

## Checks and previews

- `CI Build` runs on GitHub-hosted runners.
- The security check and preview deploys run on our self-hosted runner. If a check sits in
  "queued", the runner is usually busy or offline and will pick the job up when it is back.
- Once `CI Build` is green, comment `/deploy staging` on the pull request to run
  `scripts/deploy.sh` on the runner. Production releases are handled by jarman (see `docs/DEPLOY.md`).
