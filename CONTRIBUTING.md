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
- The security check runs `scripts/check_config.py` (deploy config is complete) and then
  `scripts/security-scan.sh` (nothing secret in the diff) against your branch.
- Once `CI Build` is green, comment `/deploy staging` on the pull request to run
  `scripts/deploy.sh` on the runner. Production releases are handled by jarman (see `docs/DEPLOY.md`).
- `/deploy production` works on a pull request too. Before the deploy script runs, the job signs in as the
  release app and pulls the production settings from `todo-app-infra` (private). Use it once when your change
  touches `scripts/deploy.sh`, `.env.production` or a workflow: it is the only way to see the real values go
  through the script before I merge. The preview comment tells you when it applies.
