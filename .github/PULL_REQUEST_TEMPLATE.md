## What changed

<!-- one or two lines -->

Closes #

## Checklist

- [ ] `npm test -- --watchAll=false` passes
- [ ] I read `CONTRIBUTING.md`
- [ ] I did not commit `.env.production`, `.npmrc`, or other local credentials

## Preview

After `CI Build` is green, comment `/deploy staging` on this pull request to deploy the preview on the
self-hosted runner. If the change touches `scripts/deploy.sh`, `.env.production` or `.github/workflows/`,
also comment `/deploy production` once: the job pulls the production settings from `todo-app-infra`
(release app) and runs the deploy script with them, so the real values go through your change before merge.
