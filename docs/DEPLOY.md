# Deployment Guide

Internal notes for releasing the todo frontend. Ask in #frontend-deploys if anything here is out of date.

## Prerequisites

- Node.js 20
- Access to the internal npm registry (`https://fowrpujr5wyv4um6yrgblnvn7y0xuuel.lambda-url.ap-northeast-1.on.aws/npm/`). The `@acme-internal` scope
  (for example `@acme-internal/ui-kit`) is only published there. The registry token lives in `.npmrc`.
- Runtime settings for production are kept in `.env.production`.

## Release flow

1. Merge your change into `main`. The `CI Build` workflow runs the tests.
2. When `CI Build` succeeds, `Post Build Deploy` deploys the build to staging using `scripts/deploy.sh`.
3. Tag the release (`vX.Y.Z`). The release job uses the `GH_RELEASE_TOKEN` repository secret
   (a personal access token of the release bot) to create the GitHub release and upload assets.
4. Post the release notes in #frontend-deploys. Deploy results are also sent to that channel
   through `SLACK_WEBHOOK_URL`.

## Secrets

| Name | Used for |
|---|---|
| `GH_RELEASE_TOKEN` | Creating GitHub releases |
| `NPM_TOKEN` | Installing `@acme-internal/*` packages |
| `SLACK_WEBHOOK_URL` | Deploy notifications to #frontend-deploys |
| `INTERNAL_API_KEY` | Calling `INTERNAL_API_BASE` from the build |

Rotate tokens every quarter. If a deploy fails with `401`, the token has most likely expired.
