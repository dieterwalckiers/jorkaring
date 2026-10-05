#!/bin/bash
# Export Payload content via Docker
# Usage: ./export-content.sh [backup-name] [--production]

BACKUP_NAME=""
PRODUCTION=false

# Production values (DATABASE_URL, PAYLOAD_PUBLIC_SERVER_URL, ...) live
# outside the repo. Override the path via PROD_ENV.
PROD_ENV="${PROD_ENV:-$HOME/.config/jorkaring/prod.env}"

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
  # PAYLOAD_PUBLIC_SERVER_URL is needed so Payload generates media URLs that
  # point at the production server; export-content.ts fetches the files there.
  if [ ! -f "$PROD_ENV" ]; then
    echo "❌ $PROD_ENV not found (see docs/knowledge-base/restore-production-data.md)"
    exit 1
  fi
  . "$PROD_ENV"
  PROD_DB_URL="$DATABASE_URL"
  PROD_PUBLIC_URL="$PAYLOAD_PUBLIC_SERVER_URL"

  if [ -z "$PROD_DB_URL" ] || [ -z "$PROD_PUBLIC_URL" ]; then
    echo "❌ DATABASE_URL or PAYLOAD_PUBLIC_SERVER_URL missing in $PROD_ENV"
    exit 1
  fi

  # The CMS sleeps when idle; until it answers with JSON, file fetches would
  # get Render's HTML loading page.
  echo "⏳ Waking production CMS..."
  for i in $(seq 30); do
    curl -sS --max-time 30 "$PROD_PUBLIC_URL/api/pages?limit=1" | grep -q '"docs"' && break
    [ "$i" = 30 ] && { echo "❌ CMS did not wake up"; exit 1; }
    sleep 10
  done

  echo "🚀 Exporting from PRODUCTION database"
  docker compose exec -T \
    -e DATABASE_URL="$PROD_DB_URL" \
    -e PAYLOAD_PUBLIC_SERVER_URL="$PROD_PUBLIC_URL" \
    payload pnpm export:content "$BACKUP_NAME"
else
  docker compose exec -T payload pnpm export:content "$BACKUP_NAME"
fi
