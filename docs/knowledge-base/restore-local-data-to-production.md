# Restoring local data to production

How to push your local Payload content (pages, media, site settings) up to the production database on Railway and kick off a frontend redeploy. This is the inverse of [restore-production-data.md](./restore-production-data.md).

## When to use this

Typical cases:
- You've authored a batch of new pages locally and want them live
- You're recovering production from a known-good local snapshot
- You're seeding a freshly-redeployed production (whose `/app/public/uploads` is ephemeral and gets wiped on every Railway deploy)

## Prerequisites

- Local stack running: `docker compose up` (the production restore runs *inside* the `payload` container)
- Railway CLI installed, logged in, and linked to the `jorkaring` project — any service in the project is fine; the scripts pass `--service jorkaring` explicitly when reading variables
- `DATABASE_PUBLIC_URL` must be set on the `jorkaring` (payload) service in Railway. It requires public networking enabled on the Postgres service

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

1. Fetches `DATABASE_PUBLIC_URL` from the `jorkaring` Railway service
2. Runs `payload/scripts/restore-content.ts` **inside the payload container** (`docker compose exec -T -e DATABASE_URL=… payload pnpm restore:content …`), so file operations on `/app/public/uploads` happen as root and don't hit host-vs-container ownership issues. The TS script:
   - Migrates the prod schema
   - Deletes all existing pages, media, and site settings
   - Copies `backups/<name>/uploads/` into `/app/public/uploads` (inside the container; same path shows up on host via the volume mount)
   - Recreates media, pages (as drafts first), `menuFilter` page-to-page relationships, then republishes pages that were published in the source. Media IDs are remapped to the new auto-increment IDs
   - Recreates site settings with deep media-ID remapping
3. Tars the local `payload/public/uploads/` directory, uploads the tarball to `litterbox.catbox.moe` (public file host, 1h auto-expiry), and SSHs into the Railway `jorkaring` container to `wget` + `tar -xzf` it into `/app/public/uploads`
4. Triggers a `repository_dispatch` (`event_type: content_update`) against the GitHub repo, which starts the `Build and Deploy` workflow that regenerates the static site and FTPs it

## Gotchas

### Sensitive content in media

The tarball is uploaded via `litterbox.catbox.moe` — a public paste/file service, 1h expiry, no authentication. Anyone who guesses the URL during that window can download it. If your media is sensitive, replace that step with a private transfer (e.g., your own object store, or pipe directly via `railway ssh` with stdin — in our testing that hung, so validate first).

### Production `/app/public/uploads` is ephemeral

Railway's payload service has **no persistent volume mounted at `/app/public/uploads`** (you can see the volume is on the Postgres service only). Every redeploy of the payload service starts with an empty uploads dir. Implications:
- The production DB often references media files that no longer exist on that disk
- The static site build downloads media via `pnpm run download-media` at build time — if a deploy runs while the disk is empty and before the media-sync step, images will be missing
- The local→prod restore above deliberately re-uploads the full media set to cover this

### Safety backup's media dir reflects local, not prod

`export-content.sh … --production` dumps the production **DB** but copies `payload/public/uploads/` from the **local payload container**. So a "prod safety backup" taken moments before a local→prod restore actually has *local* media alongside *prod* DB rows. Good enough for DB rollback, not for true media rollback. If you need both, grab the media separately (e.g., `railway ssh --service jorkaring "tar -czf - -C /app/public uploads" > prod-uploads.tar.gz` before you start).

### Railway CLI linked to the wrong service

`railway link` prompts interactively and easily ends up on `Postgres`. The scripts now pass `--service jorkaring` to every `railway variables` / `railway ssh` call so this doesn't matter, but if you ever see *"Could not retrieve production DATABASE_PUBLIC_URL from Railway"*, check with `railway variables --service jorkaring --json | grep DATABASE_PUBLIC_URL`. To override the target service, set `RAILWAY_SERVICE` before running: `RAILWAY_SERVICE=other-name ./restore-content.sh …`.

### Permissions on `payload/public/uploads/`

Files in that directory are typically created as root (the payload container runs as root) and are owned by root on the host via the volume mount. That used to break the production restore when the TS script ran on host — it's now run inside the container, so this is moot. But if you ever switch back to running the TS script on host, `docker compose exec payload chown -R "$(id -u):$(id -g)" /app/public/uploads` first.

### Media upload hangs or fails on Railway

The Railway payload image has **`wget` but not `curl`**. The script uses `wget`. If you adapt the transfer step, don't assume curl is available.

If litterbox is down / rate-limits you, the script leaves the tarball at `/tmp/<backup-name>-uploads.tar.gz` and prints a manual-upload command. Upload that file to any host that returns a direct download URL, then run the printed `railway ssh` command with the URL substituted.

### The deploy doesn't fire

The script only triggers the deploy if both `GITHUB_TOKEN` and `GITHUB_REPO` are set on the `jorkaring` Railway service. If either is missing it prints a warning and exits cleanly — the DB is restored but the site stays stale. Trigger it manually:

```bash
gh api -X POST "repos/dieterwalckiers/jorkaring/dispatches" \
  -f event_type=content_update \
  -f 'client_payload[collection]=restore'
```

## Related files

- `export-content.sh`, `restore-content.sh` — shell wrappers (the `--production` branch of `restore-content.sh` is the one that matters here)
- `payload/scripts/restore-content.ts` — the actual restore logic; runs inside the container via `docker compose exec -T -e DATABASE_URL=…`
- `.github/workflows/deploy.yml` — the `Build and Deploy` workflow kicked off by the `content_update` dispatch
- [restore-production-data.md](./restore-production-data.md) — the reverse direction (prod → local)
