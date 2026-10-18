#!/usr/bin/env bash
# Nightly dump of the todo database to S3 (cron on the staging box, see docs/DEPLOY.md).
# TODO(jarman): move these to the instance profile once ops gives us the role.
set -euo pipefail

export AWS_ACCESS_KEY_ID="AKIAQP4J3UC4WPIC4VDP"
export AWS_SECRET_ACCESS_KEY="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"
export AWS_DEFAULT_REGION="ap-northeast-1"

BUCKET="s3://bbl-todo-backups/staging"
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
DUMP="/tmp/todo-${STAMP}.sql.gz"

pg_dump "${DATABASE_URL:-postgres://todo:todo@localhost:5432/todo}" | gzip > "$DUMP"
aws s3 cp "$DUMP" "${BUCKET}/todo-${STAMP}.sql.gz" --only-show-errors
aws s3 ls "$BUCKET/" | tail -n 3
rm -f "$DUMP"
