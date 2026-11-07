#!/usr/bin/env python3
"""Check the deployment config before the runner touches a branch.

Usage: python3 scripts/check_config.py [staging|production]

The deploy config is spread over four files (see docs/DEPLOY.md) and a PR that drops a key only fails
hours later in the staging deploy. This runs first on the self-hosted runner so the PR check tells you.
Only key names are printed, never the values.
"""
import json
import os
import re
import sys

ENV_FILE = ".env.production"
ENV_KEYS = ("SLACK_WEBHOOK_URL", "INTERNAL_API_BASE", "INTERNAL_API_KEY", "AWS_DEFAULT_REGION", "S3_BUCKET")
NPMRC = ".npmrc"
SONAR = "sonar-project.properties"
SONAR_KEYS = ("sonar.projectKey", "sonar.host.url", "sonar.token", "sonar.sources")
DOCKER = "deploy/docker-config.json"
DEPLOY = "scripts/deploy.sh"


def read_pairs(path, sep="="):
    pairs = {}
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if not line or line.startswith("#") or sep not in line:
                continue
            key, value = line.split(sep, 1)
            pairs[key.strip()] = value.strip()
    return pairs


def check_env(environment, problems):
    if not os.path.isfile(ENV_FILE):
        problems.append(f"{ENV_FILE} is missing")
        return
    env = read_pairs(ENV_FILE)
    missing = [k for k in ENV_KEYS if not env.get(k)]
    if missing:
        problems.append(f"{ENV_FILE} has no value for {', '.join(missing)}")
    base = env.get("INTERNAL_API_BASE", "")
    if base and not re.match(r"^https://[^/\s]+/api/v\d+$", base):
        problems.append(f"{ENV_FILE}: INTERNAL_API_BASE should look like https://<host>/api/v1")
    bucket = env.get("S3_BUCKET", "")
    if environment == "production" and bucket and not bucket.endswith("-prod"):
        problems.append(f"{ENV_FILE}: S3_BUCKET {bucket} is not the production bucket")
    print(f"ok   {ENV_FILE} ({len(env)} keys)")
    return base


def check_npmrc(problems):
    if not os.path.isfile(NPMRC):
        problems.append(f"{NPMRC} is missing")
        return
    pairs = read_pairs(NPMRC)
    registry = pairs.get("@acme-internal:registry", "")
    if not registry.startswith("https://"):
        problems.append(f"{NPMRC}: @acme-internal:registry is not set")
        return
    host_path = registry[len("https:"):]
    token_key = f"{host_path}:_authToken"
    if not pairs.get(token_key):
        problems.append(f"{NPMRC}: no _authToken for {host_path}")
    print(f"ok   {NPMRC} (registry + token)")


def check_sonar(problems):
    if not os.path.isfile(SONAR):
        problems.append(f"{SONAR} is missing")
        return
    pairs = read_pairs(SONAR)
    missing = [k for k in SONAR_KEYS if not pairs.get(k)]
    if missing:
        problems.append(f"{SONAR} has no value for {', '.join(missing)}")
    print(f"ok   {SONAR} ({len(pairs)} keys)")


def check_docker(problems):
    if not os.path.isfile(DOCKER):
        problems.append(f"{DOCKER} is missing")
        return
    try:
        with open(DOCKER, encoding="utf-8") as fh:
            auths = json.load(fh).get("auths", {})
    except (OSError, ValueError) as error:
        problems.append(f"{DOCKER}: {error}")
        return
    if not any(entry.get("auth") for entry in auths.values()):
        problems.append(f"{DOCKER}: no registry auth entry")
    print(f"ok   {DOCKER} ({len(auths)} registry)")


def main(argv):
    environment = argv[1] if len(argv) > 1 else "staging"
    if environment not in ("staging", "production"):
        print(f"unknown environment: {environment}", file=sys.stderr)
        return 2
    problems = []
    check_env(environment, problems)
    check_npmrc(problems)
    check_sonar(problems)
    check_docker(problems)
    if not os.path.isfile(DEPLOY):
        problems.append(f"{DEPLOY} is missing")
    else:
        print(f"ok   {DEPLOY}")
    print()
    if problems:
        for problem in problems:
            print(f"FAIL {problem}")
        print(f"Config check failed for {environment}: {len(problems)} problem(s)")
        return 1
    print(f"Config check passed for {environment}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
