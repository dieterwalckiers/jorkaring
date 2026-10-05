# Restoring local data to production

How to push your local Payload content (pages, media, site settings) up to production (Neon database and Neon Object Storage) and kick off a frontend redeploy. This is the inverse of [restore-production-data.md](./restore-production-data.md).

## When to use this

Typical cases:
- You've authored a batch of new pages locally and want them live
- You're recovering production from a known-good local snapshot
- You're seeding a fresh production deploy or recovering from a wiped/recreated bucket

## Prerequisites

- Local stack running: `docker compose up` (the production restore runs *inside* the `payload` container)
- `~/.config/jorkaring/prod.env` with `DATABASE_URL`, `S3_*` and `GITHUB_*` (format in [restore-production-data.md](./restore-production-data.md#configjorkaringprodenv))

## Happy path

Two scripts, run from the repo root:

```bash
# 1. (Recommended) safety backup of current production
./export-content.sh prod-safety-$(date +%Y%m%d-%H%M%S) --production

# 2. Snapshot your local content
./export-content.sh local-$(date +%Y%m%d-%H%M%S)

# 3. Restore the local snapshot onto production
./restore-content.sh local-YYYYMMDD-HHMMSS --production --force
```

`--force` skips the interactive `yes/no` prompt. Only use it when you've mentally signed off — the step is irreversible without the safety backup.

## What the production restore actually does

`restore-content.sh … --production` is a pipeline:

1. Reads `DATABASE_URL`, `S3_*` and `GITHUB_*` from `prod.env`
2. Runs `payload/scripts/restore-content.ts` **inside the payload container** (`docker compose exec -T -e DATABASE_URL=… -e S3_…=… payload pnpm restore:content …`), so file operations on `/app/public/uploads` happen as root and don't hit host-vs-container ownership issues. The TS script:
   - Migrates the prod schema
   - Deletes all existing pages, media, and site settings (with `S3_*` set, the media files are deleted from the bucket too)
   - Copies `backups/<name>/uploads/` into `/app/public/uploads` (inside the container)
   - Recreates media via `payload.create({ filePath })`, which uploads each original and its sizes straight to the bucket; then pages (as drafts first), `menuFilter` page-to-page relationships, then republishes pages that were published in the source. Media IDs are remapped to the new auto-increment IDs
   - Recreates site settings with deep media-ID remapping
3. Triggers a `repository_dispatch` (`event_type: content_update`) against the GitHub repo, which starts the `Build and Deploy` workflow that regenerates the static site and deploys it to GitHub Pages

## Gotchas

### Media lives in Neon Object Storage, served through Payload

Uploads are stored in the private bucket `jorkaring-media` (object key = filename, no prefix) and served by Payload at `/api/media/file/<filename>`, on the production branch of the `jorkaring` Neon project, so media URLs have the same shape as before the move off Railway. The bucket branches with the database: a Neon branch gets a copy-on-write snapshot of both. The Render container's disk is ephemeral; nothing is kept there.

Caveats worth knowing:
- The static site build downloads media via `pnpm run download-media` at build time. If Payload can't serve a file (missing in the bucket, or 500 for other reasons), that file is silently skipped and won't appear on the static site.
- List or fetch raw objects with the Neon CLI: `neon bucket object list jorkaring-media --project-id damp-mouse-79639859`, `neon bucket object get ...`.

### Safety backup's media dir

`export-content.sh … --production` first copies `payload/public/uploads/` from the local container into the backup, then walks every media doc and HTTP-fetches any file missing from the backup via its public `url`. So the safety backup is self-contained for everything the production DB references, *as long as the bucket actually holds those files*. If a media row points at a missing object (HTTP 404 during fetch), the export logs a `⚠ Failed to fetch` line and continues; that file won't be in the safety backup either.

### Permissions on `payload/public/uploads/`

Files in that directory are typically created as root (the payload container runs as root) and are owned by root on the host via the volume mount. That used to break the production restore when the TS script ran on host — it's now run inside the container, so this is moot. But if you ever switch back to running the TS script on host, `docker compose exec payload chown -R "$(id -u):$(id -g)" /app/public/uploads` first.

### The deploy doesn't fire

The script only triggers the deploy if both `GITHUB_TOKEN` and `GITHUB_REPO` are set in `prod.env`. If either is missing it prints a warning and exits cleanly — the DB is restored but the site stays stale. Trigger it manually:

```bash
gh api -X POST "repos/dieterwalckiers/jorkaring/dispatches" \
  -f event_type=content_update \
  -f 'client_payload[collection]=restore'
```

## Related files

- `export-content.sh`, `restore-content.sh` — shell wrappers (the `--production` branch of `restore-content.sh` is the one that matters here)
- `payload/scripts/restore-content.ts` — the actual restore logic; runs inside the container via `docker compose exec -T -e DATABASE_URL=… -e S3_…`
- `.github/workflows/deploy.yml` — the `Build and Deploy` workflow kicked off by the `content_update` dispatch
- [restore-production-data.md](./restore-production-data.md) — the reverse direction (prod → local)
