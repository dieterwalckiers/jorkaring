#!/bin/bash
# Export Payload content via Docker
# Usage: ./export-content.sh [backup-name] [--production]

BACKUP_NAME=""
PRODUCTION=false

# Railway service that hosts the Payload app (where DATABASE_PUBLIC_URL is
# set). Override via the RAILWAY_SERVICE env var if your service is named
# differently or if `railway link` happens to point at the Postgres service.
RAILWAY_SERVICE="${RAILWAY_SERVICE:-jorkaring}"

# Parse arguments
for arg in "$@"; do
  case $arg in
    --production)
      PRODUCTION=true
      ;;
    *)
      if [ -z "$BACKUP_NAME" ]; then
        BACKUP_NAME="$arg"
      fi
      ;;
  esac
done

# Default backup name if not provided
BACKUP_NAME="${BACKUP_NAME:-backup-$(date +%Y%m%d-%H%M%S)}"

if [ "$PRODUCTION" = true ]; then
  # Fetch production DATABASE_PUBLIC_URL and PAYLOAD_PUBLIC_SERVER_URL from
  # Railway. The latter is needed so Payload generates media URLs that point at
  # the production server — without it, URLs come back as localhost and the
  # missing-file fetch step in export-content.ts can't reach the real files.
  PROD_VARS_JSON=$(railway variables --service "$RAILWAY_SERVICE" --json 2>/dev/null)
  PROD_DB_URL=$(echo "$PROD_VARS_JSON" | grep -o '"DATABASE_PUBLIC_URL": "[^"]*"' | cut -d'"' -f4)
  PROD_PUBLIC_URL=$(echo "$PROD_VARS_JSON" | grep -o '"PAYLOAD_PUBLIC_SERVER_URL": "[^"]*"' | cut -d'"' -f4)

  if [ -z "$PROD_DB_URL" ]; then
    echo "❌ Could not retrieve production DATABASE_PUBLIC_URL from Railway"
    echo ""
    echo "Make sure you have:"
    echo "  1. Railway CLI installed and logged in (railway login)"
    echo "  2. Linked to your project (railway link)"
    echo "  3. DATABASE_PUBLIC_URL set on your payload service"
    echo "     (Enable public networking on your Postgres service in Railway dashboard)"
    exit 1
  fi

  if [ -z "$PROD_PUBLIC_URL" ]; then
    echo "⚠️  Could not retrieve production PAYLOAD_PUBLIC_SERVER_URL — media file fetch may use localhost URLs and fail"
  fi

  echo "🚀 Exporting from PRODUCTION database"
  docker compose exec -T \
    -e DATABASE_URL="$PROD_DB_URL" \
    -e PAYLOAD_PUBLIC_SERVER_URL="$PROD_PUBLIC_URL" \
    payload pnpm export:content "$BACKUP_NAME"
else
  docker compose exec -T payload pnpm export:content "$BACKUP_NAME"
fi
