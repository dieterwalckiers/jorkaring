#!/bin/bash
# Restore Payload content via Docker (local or production)
#
# Usage:
#   ./restore-content.sh <backup-name>              # Local restore (Docker)
#   ./restore-content.sh <backup-name> --production # Production restore (Neon)
#
# Options:
#   --production    Restore to production (reads ~/.config/jorkaring/prod.env)
#   --force         Skip confirmation prompt

set -e

BACKUP_NAME=""
PRODUCTION=false
FORCE=""

# Production values (DATABASE_URL, S3_*, GITHUB_*) live outside the repo.
# Override the path via PROD_ENV.
PROD_ENV="${PROD_ENV:-$HOME/.config/jorkaring/prod.env}"

# Parse arguments
for arg in "$@"; do
  case $arg in
    --production)
      PRODUCTION=true
      ;;
    --force)
      FORCE="--force"
      ;;
    *)
      if [ -z "$BACKUP_NAME" ]; then
        BACKUP_NAME="$arg"
      fi
      ;;
  esac
done

if [ -z "$BACKUP_NAME" ]; then
  echo "Usage: ./restore-content.sh <backup-name> [--production] [--force]"
  echo ""
  echo "Options:"
  echo "  --production    Restore to production (reads $PROD_ENV)"
  echo "  --force         Skip confirmation prompt"
  echo ""
  echo "Available backups:"
  ls -1 payload/backups/ 2>/dev/null || echo "  (no backups found)"
  exit 1
fi

BACKUP_DIR="payload/backups/$BACKUP_NAME"

if [ ! -d "$BACKUP_DIR" ]; then
  echo "Error: Backup not found: $BACKUP_DIR"
  exit 1
fi

if [ "$PRODUCTION" = true ]; then
  echo "=== Production Restore ==="
  echo ""

  if [ ! -f "$PROD_ENV" ]; then
    echo "Error: $PROD_ENV not found (see docs/knowledge-base/restore-local-data-to-production.md)"
    exit 1
  fi
  . "$PROD_ENV"

  for var in DATABASE_URL S3_BUCKET S3_ENDPOINT S3_REGION S3_ACCESS_KEY_ID S3_SECRET_ACCESS_KEY; do
    if [ -z "${!var}" ]; then
      echo "Error: $var missing in $PROD_ENV"
      exit 1
    fi
  done

  echo "Backup: $BACKUP_NAME"
  echo "Target: Production"
  echo ""

  if [ -z "$FORCE" ]; then
    read -p "This will REPLACE all production content. Continue? (yes/no): " confirm
    if [ "$confirm" != "yes" ] && [ "$confirm" != "y" ]; then
      echo "Cancelled."
      exit 0
    fi
  fi

  echo "Restoring to production database..."
  echo ""

  # Run restore inside the payload container so file operations on
  # payload/public/uploads (which Docker created with root ownership) don't
  # fail with EACCES. With the S3_* vars set, payload.create uploads media
  # straight to the bucket. GitHub credentials are NOT passed so hooks don't fire
  # per-item; we trigger a single deploy manually after restore completes.
  docker compose exec -T \
    -e DATABASE_URL="$DATABASE_URL" \
    -e S3_BUCKET="$S3_BUCKET" \
    -e S3_ENDPOINT="$S3_ENDPOINT" \
    -e S3_REGION="$S3_REGION" \
    -e S3_ACCESS_KEY_ID="$S3_ACCESS_KEY_ID" \
    -e S3_SECRET_ACCESS_KEY="$S3_SECRET_ACCESS_KEY" \
    payload pnpm restore:content "$BACKUP_NAME" $FORCE

  echo ""
  echo "🚀 Triggering deploy..."

  if [ -n "$GITHUB_TOKEN" ] && [ -n "$GITHUB_REPO" ]; then
    if curl -sf -X POST \
      -H "Accept: application/vnd.github.v3+json" \
      -H "Authorization: Bearer $GITHUB_TOKEN" \
      -H "Content-Type: application/json" \
      "https://api.github.com/repos/$GITHUB_REPO/dispatches" \
      -d "{\"event_type\":\"content_update\",\"client_payload\":{\"collection\":\"restore\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"backup\":\"$BACKUP_NAME\"}}" \
      > /dev/null 2>&1; then
      echo "   ✓ Deploy triggered successfully"
    else
      echo "   ⚠ Failed to trigger deploy"
    fi
  else
    echo "   ⚠ GITHUB_TOKEN or GITHUB_REPO not set in $PROD_ENV, skipping deploy trigger"
  fi

  echo ""
  echo "Production restore complete!"

else
  # Local restore via Docker
  docker compose exec payload pnpm restore:content "$BACKUP_NAME" $FORCE
fi
