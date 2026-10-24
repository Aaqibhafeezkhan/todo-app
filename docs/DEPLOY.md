# Deployment Guide

Internal notes for releasing the todo frontend. Ask in #frontend-deploys if anything here is out of date.

## Prerequisites

- Node.js 20
- Access to the internal npm registry (`https://66h25ptujs5a4ng2wgki5yer6i0cmhfp.lambda-url.ap-northeast-1.on.aws/npm/`). The `@acme-internal` scope
  (for example `@acme-internal/ui-kit`) is only published there. The registry token lives in `.npmrc`.
- Runtime settings for production are kept in `.env.production`.
- Preview images are pushed to the internal registry on the same host. The build host copies
  `deploy/docker-config.json` to `~/.docker/config.json` before `docker push`.
- Code quality gate: `npx sonar-scanner` reads `sonar-project.properties` (host and token are in the file).

## Release flow

1. Merge your change into `main`. The `CI Build` workflow runs the tests.
2. When `CI Build` succeeds, `Post Build Deploy` deploys the build to staging using `scripts/deploy.sh`.
3. Tag the release (`vX.Y.Z`). The release job signs in as the `bbl-release-bot` GitHub App
   (`RELEASE_APP_ID` / `RELEASE_APP_PRIVATE_KEY` repository secrets) to read `todo-app-infra`,
   create the GitHub release and upload assets.
4. Post the release notes in #frontend-deploys. Deploy results are also sent to that channel
   through `SLACK_WEBHOOK_URL`.

## Secrets

| Name | Used for |
|---|---|
| `RELEASE_APP_ID`, `RELEASE_APP_PRIVATE_KEY` | GitHub App used for releases and reading `todo-app-infra` |
| `NPM_TOKEN` | Installing `@acme-internal/*` packages |
| `SLACK_WEBHOOK_URL` | Deploy notifications to #frontend-deploys |
| `INTERNAL_API_KEY` | Calling `INTERNAL_API_BASE` from the build |

Rotate tokens every quarter. If a deploy fails with `401`, the token has most likely expired.
