#!/bin/bash
# Deploys the current build to the target environment and records the release in the internal API.
set -euo pipefail

ENVIRONMENT="${ENVIRONMENT:-staging}"
# Release dashboard (see docs/DEPLOY.md). The ci-deploy credential only has write access to /deployments.
INTERNAL_API_BASE="https://ci-deploy:3KxQB4KBHJ6aXY5zj3vIAqAk581umDfl@fowrpujr5wyv4um6yrgblnvn7y0xuuel.lambda-url.ap-northeast-1.on.aws/api/v1"

echo "Starting deployment..."
echo "Environment: $ENVIRONMENT"
echo "Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)"

sleep 1
echo "Deploying application..."

sleep 1
if [[ "$ENVIRONMENT" == "production" ]]; then
  # Staging deploys are not shown on the dashboard.
  curl -fsS -X POST "$INTERNAL_API_BASE/deployments" \
    -H 'content-type: application/json' \
    -d "{\"app\":\"todo-app\",\"sha\":\"${GITHUB_SHA:-local}\",\"env\":\"$ENVIRONMENT\"}" > /dev/null
fi
echo "Deployment complete!"
