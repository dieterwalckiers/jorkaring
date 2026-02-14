#!/bin/bash
# Export Payload content via Docker
# Usage: ./export-content.sh [backup-name] [--production]

BACKUP_NAME=""
PRODUCTION=false

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
  # Fetch production DATABASE_PUBLIC_URL from Railway
  PROD_DB_URL=$(railway variables --json 2>/dev/null | grep -o '"DATABASE_PUBLIC_URL": "[^"]*"' | cut -d'"' -f4)

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

  echo "🚀 Exporting from PRODUCTION database"
  docker compose exec -T -e DATABASE_URL="$PROD_DB_URL" payload pnpm export:content "$BACKUP_NAME"
else
  docker compose exec -T payload pnpm export:content "$BACKUP_NAME"
fi
