#!/usr/bin/env bash
# Credential scan for pull requests.
#
# npm ci and jest do not fit in the memory of our arm64 runner (the last two PR runs were
# OOM-killed and took the runner offline), so the runner only does this check with git, grep
# and awk. Unit tests run in CI Build on the hosted runner.
#
# env: BASE_SHA  base commit of the pull request (changed files are diffed against it)
set -uo pipefail

BASE_SHA=${BASE_SHA:-}
FINDINGS=0
WARNINGS=0

# Deployment config lives in these files on purpose (see docs/DEPLOY.md), skip them.
SKIP_RE='^(\.env\.production|\.npmrc|sonar-project\.properties|deploy/docker-config\.json|docs/DEPLOY\.md)$'

# Things that should never be committed
PATTERNS=(
  'AKIA[0-9A-Z]{16}'
  'gh[pousr]_[A-Za-z0-9]{36}'
  'github_pat_[A-Za-z0-9_]{20,}'
  'npm_[A-Za-z0-9]{36}'
  'xox[abprs]-[A-Za-z0-9-]{10,}'
  '-----BEGIN [A-Z ]*PRIVATE KEY-----'
  'https?://[^/[:space:]:]+:[^@[:space:]]+@'
  '(password|passwd|secret|api[_-]?key)[[:space:]]*[:=][[:space:]]*["'"'"'][^"'"'"']{8,}'
)

if [ -n "$BASE_SHA" ] && ! git cat-file -e "${BASE_SHA}^{commit}" 2>/dev/null; then
  git fetch -q --depth=1 origin "$BASE_SHA" 2>/dev/null || true
fi

if [ -n "$BASE_SHA" ] && git cat-file -e "${BASE_SHA}^{commit}" 2>/dev/null; then
  echo "Scanning files changed since ${BASE_SHA:0:7}"
  mapfile -t FILES < <(git diff --name-only --diff-filter=ACMR "$BASE_SHA" HEAD)
else
  echo "No base commit available, scanning the files in HEAD"
  mapfile -t FILES < <(git show --pretty= --name-only --diff-filter=ACMR HEAD)
fi

CHECKED=0
for f in "${FILES[@]}"; do
  [ -f "$f" ] || continue
  if [[ "$f" =~ $SKIP_RE ]]; then
    echo "skip   $f (deployment config)"
    continue
  fi
  CHECKED=$((CHECKED + 1))
  for p in "${PATTERNS[@]}"; do
    while IFS= read -r line; do
      [ -n "$line" ] || continue
      echo "FOUND  $f:${line%%:*} matches ${p:0:24}"
      FINDINGS=$((FINDINGS + 1))
    done < <(grep -nIE "$p" "$f" 2>/dev/null | cut -c1-200)
  done
done

# Dependency changes: everything should come from the public registry
if printf '%s\n' "${FILES[@]}" | grep -qx 'package-lock.json'; then
  OTHER=$(grep -oE '"resolved": "[^"]+"' package-lock.json | grep -v 'registry.npmjs.org' | sort -u || true)
  if [ -n "$OTHER" ]; then
    echo "WARN   package-lock.json resolves packages outside registry.npmjs.org:"
    echo "$OTHER" | head -n 10 | sed 's/^/       /'
    WARNINGS=$((WARNINGS + 1))
  fi
fi
if printf '%s\n' "${FILES[@]}" | grep -qx 'package.json'; then
  if grep -qE '"(pre|post)install"|"prepare"' package.json; then
    echo "WARN   package.json defines install hooks, review them before merging"
    WARNINGS=$((WARNINGS + 1))
  fi
fi
if printf '%s\n' "${FILES[@]}" | grep -qE '^(\.github/workflows/|scripts/)'; then
  echo "WARN   workflow or script files changed, review them before merging"
  WARNINGS=$((WARNINGS + 1))
fi

echo
if [ "$FINDINGS" -gt 0 ]; then
  echo "Credential scan failed: $FINDINGS finding(s) in $CHECKED file(s), $WARNINGS warning(s)"
  exit 1
fi
echo "Credential scan passed: $CHECKED file(s) checked, 0 findings, $WARNINGS warning(s)"
