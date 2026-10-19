# todo-app

[![CI Build](https://github.com/BinaryBaconLabs/todo-app/actions/workflows/ci.yml/badge.svg)](https://github.com/BinaryBaconLabs/todo-app/actions/workflows/ci.yml)
[![Post Build Deploy](https://github.com/BinaryBaconLabs/todo-app/actions/workflows/deploy.yml/badge.svg)](https://github.com/BinaryBaconLabs/todo-app/actions/workflows/deploy.yml)

A simple React-based Todo application.

## Features

- Add new tasks
- Mark tasks as complete
- Delete tasks
- Clean and responsive UI

## Getting Started

```bash
npm install
npm start
```

## Development

Node 20 is what CI uses. `npm install` then `npm start` for the dev server, `npm test` for the
test suite.

## CI and deploys

- `CI Build` runs on every push and pull request to `main` and uploads `build/` together with
  `scripts/deploy.sh` as an artifact.
- `Post Build Deploy` picks that artifact up on the self-hosted runner and runs the deploy script
  against staging.
- `PR Security Check` runs the tests on pull requests and comments a summary back on the PR.
- The release steps, the internal registry and the secrets a deploy needs are in
  [docs/DEPLOY.md](docs/DEPLOY.md).

## Contributing

Feel free to open issues or submit pull requests!