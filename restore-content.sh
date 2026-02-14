#!/bin/bash
# Restore Payload content via Docker (local) or Railway (production)
#
# Usage:
#   ./restore-content.sh <backup-name>              # Local restore (Docker)
#   ./restore-content.sh <backup-name> --production # Production restore (Railway)
#
# Options:
#   --production    Restore to production via Railway CLI
#   --force         Skip confirmation prompt

set -e

BACKUP_NAME=""
PRODUCTION=false
FORCE=""

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
  echo "  --production    Restore to production via Railway CLI"
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
  # Production restore via Railway
  echo "=== Production Restore via Railway ==="
  echo ""

  # Check if railway CLI is installed
  if ! command -v railway &> /dev/null; then
    echo "Error: Railway CLI not found. Install it with:"
    echo "  npm install -g @railway/cli"
    exit 1
  fi

  # Check if logged in and linked
  if ! railway status &> /dev/null; then
    echo "Error: Not linked to a Railway project. Run:"
    echo "  railway login"
    echo "  railway link"
    exit 1
  fi

  echo "Backup: $BACKUP_NAME"
  echo "Target: Production (Railway)"
  echo ""

  if [ -z "$FORCE" ]; then
    read -p "This will REPLACE all production content. Continue? (yes/no): " confirm
    if [ "$confirm" != "yes" ] && [ "$confirm" != "y" ]; then
      echo "Cancelled."
      exit 0
    fi
  fi

  # Check for DATABASE_PUBLIC_URL or fetch from Railway
  if [ -n "$DATABASE_PUBLIC_URL" ]; then
    PROD_DB_URL="$DATABASE_PUBLIC_URL"
    echo "Using DATABASE_PUBLIC_URL from environment..."
  else
    echo ""
    echo "Fetching database credentials from Railway..."
    PROD_DB_URL=$(railway variables --json | grep -o '"DATABASE_PUBLIC_URL": "[^"]*"' | cut -d'"' -f4)
  fi

  if [ -z "$PROD_DB_URL" ]; then
    echo ""
    echo "Error: No public database URL found."
    echo ""
    echo "To fix this, enable public networking for your PostgreSQL database:"
    echo "  1. Go to Railway dashboard → select your Postgres service"
    echo "  2. Settings → Networking → Enable Public Network"
    echo "  3. Copy the public DATABASE_URL"
    echo "  4. Add it as DATABASE_PUBLIC_URL variable to your payload service"
    echo ""
    echo "Or run with the URL directly:"
    echo "  DATABASE_PUBLIC_URL='postgresql://...' ./restore-content.sh $BACKUP_NAME --production"
    exit 1
  fi

  echo "Restoring to production database..."
  echo ""

  # Run restore WITHOUT GitHub credentials to prevent hooks from firing
  # We'll trigger a single deploy manually after restore completes
  DATABASE_URL="$PROD_DB_URL" pnpm --dir payload restore:content "$BACKUP_NAME" $FORCE
  RESTORE_EXIT=$?

  # If restore succeeded, upload media files and trigger deploy
  if [ $RESTORE_EXIT -eq 0 ]; then
    echo ""
    echo "📤 Uploading media files to Railway..."

    # Get the Railway service name from the linked project
    RAILWAY_SERVICE=$(railway status --json 2>/dev/null | grep -o '"name": "[^"]*"' | head -1 | cut -d'"' -f4)
    RAILWAY_SERVICE=${RAILWAY_SERVICE:-payload}

    # Upload files from local payload/public/uploads/ (where Payload created them)
    if [ -d "payload/public/uploads" ]; then
      # Create tarball of uploads
      UPLOADS_TAR="/tmp/${BACKUP_NAME}-uploads.tar.gz"
      tar -czf "$UPLOADS_TAR" -C "payload/public" uploads

      TAR_SIZE=$(stat -c%s "$UPLOADS_TAR" 2>/dev/null || stat -f%z "$UPLOADS_TAR")
      echo "   Tarball size: $(numfmt --to=iec $TAR_SIZE 2>/dev/null || echo "$TAR_SIZE bytes")"

      # Upload to Railway via temporary file hosting service
      echo "   Uploading to temporary file host..."

      # Upload tarball to litterbox.catbox.moe (files expire after 1 hour)
      UPLOAD_URL=$(curl -s -F "reqtype=fileupload" -F "time=1h" -F "fileToUpload=@$UPLOADS_TAR" https://litterbox.catbox.moe/resources/internals/api.php)

      if [[ "$UPLOAD_URL" == http* ]]; then
        echo "   Downloading to Railway..."
        railway ssh --service "$RAILWAY_SERVICE" "curl -sL '$UPLOAD_URL' -o /tmp/uploads.tar.gz && tar -xzf /tmp/uploads.tar.gz -C /app/public/ && rm /tmp/uploads.tar.gz && echo 'Extracted'"
      else
        echo "   ⚠ Upload failed: $UPLOAD_URL"
        echo "   Manual upload required. Tarball saved at: $UPLOADS_TAR"
        echo "   Upload to any file host and run on Railway:"
        echo "   railway ssh --service \"$RAILWAY_SERVICE\" \"curl -sL '<URL>' -o /tmp/uploads.tar.gz && tar -xzf /tmp/uploads.tar.gz -C /app/public/ && rm /tmp/uploads.tar.gz\""
        exit 1
      fi

      rm -f "$UPLOADS_TAR"
      echo "   ✓ Media files uploaded"
    else
      echo "   ⚠ No uploads directory found"
    fi

    echo ""
    echo "🚀 Triggering deploy..."

    GITHUB_TOKEN=$(railway variables --json | grep -o '"GITHUB_TOKEN": "[^"]*"' | cut -d'"' -f4)
    GITHUB_REPO=$(railway variables --json | grep -o '"GITHUB_REPO": "[^"]*"' | cut -d'"' -f4)

    if [ -n "$GITHUB_TOKEN" ] && [ -n "$GITHUB_REPO" ]; then
      curl -s -X POST \
        -H "Accept: application/vnd.github.v3+json" \
        -H "Authorization: Bearer $GITHUB_TOKEN" \
        -H "Content-Type: application/json" \
        "https://api.github.com/repos/$GITHUB_REPO/dispatches" \
        -d "{\"event_type\":\"content_update\",\"client_payload\":{\"collection\":\"restore\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"backup\":\"$BACKUP_NAME\"}}" \
        > /dev/null 2>&1

      if [ $? -eq 0 ]; then
        echo "   ✓ Deploy triggered successfully"
      else
        echo "   ⚠ Failed to trigger deploy"
      fi
    else
      echo "   ⚠ GITHUB_TOKEN or GITHUB_REPO not found, skipping deploy trigger"
    fi
  fi

  if [ $RESTORE_EXIT -eq 0 ]; then
    echo ""
    echo "Production restore complete!"
  else
    echo ""
    echo "Restore failed with exit code $RESTORE_EXIT"
    exit $RESTORE_EXIT
  fi

else
  # Local restore via Docker
  docker compose exec payload pnpm restore:content "$BACKUP_NAME" $FORCE
fi
