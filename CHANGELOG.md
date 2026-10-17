# Changelog

## v0.1.0 - 2026-10-17

First tagged release.

### Added

- Todo list UI: add, complete and delete tasks
- CI on GitHub Actions, with the build artifact kept for the deploy job
- Staging deploy on the self-hosted runner after a successful build
- `/deploy <env>` ChatOps command in issue comments

### Changed

- Release signing uses the release GitHub App instead of a personal token
- Deploy credentials come from repository secrets instead of a long-lived token

### Known issues

- Production deploys are still manual (`scripts/deploy.sh`)
- Keyboard shortcuts are not implemented yet (#1)
