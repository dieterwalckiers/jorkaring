# Restoring production data to local

How to pull the current production content (pages, media metadata, site settings) from Railway into your local Docker stack. For the reverse (local → prod), see [restore-local-data-to-production.md](./restore-local-data-to-production.md).

## Prerequisites

- Local stack running: `docker compose up`
- Railway CLI installed and logged in: `railway login`
- Project linked: `railway link` (the project is `jorkaring`; any service in it is fine — the scripts pass `--service jorkaring` explicitly when reading Railway variables)

## Happy path

There are two scripts:

- `./export-content.sh <name> --production` — dumps the production DB into `payload/backups/<name>/`
- `./restore-content.sh <name>` — restores that backup into the local DB

```bash
./export-content.sh prod-$(date +%Y%m%d-%H%M%S) --production
./restore-content.sh prod-YYYYMMDD-HHMMSS --force
```

If your service is named something other than `jorkaring`, export `RAILWAY_SERVICE=<name>` before running.

The export script (with `--production`):
1. Pulls `DATABASE_PUBLIC_URL` and `PAYLOAD_PUBLIC_SERVER_URL` from the `jorkaring` Railway service and passes both into the payload container — the latter is required so generated media URLs target production rather than `localhost`
2. Dumps pages, media metadata, and site settings from the production DB into `backups/<name>/`
3. Copies the local container's `payload/public/uploads/` into `backups/<name>/uploads/`, then walks every media doc (and each size variant) and downloads any file missing from the backup via its public `url`. The result is a self-contained backup with full media

The restore script:
1. Runs pending migrations against the local DB
2. Deletes existing pages, media, and site settings
3. Copies `backups/<name>/uploads/` into `payload/public/uploads/`
4. Recreates media, pages (as drafts), page-to-page `menuFilter` relations, and site settings, remapping media IDs to the new auto-increment IDs

Pages come back **with their source status** — the script creates each page as a draft first (to bypass required-field validation), then republishes the ones whose source doc was published. If something went wrong and they all stayed as drafts, you can force-publish:

```bash
docker compose exec postgres psql -U payload -d payload \
  -c "UPDATE pages SET _status='published' WHERE _status='draft';"
```

Verify the frontend at `http://localhost:3201/` and the admin at `http://localhost:3202/admin`.

## Troubleshooting

### `Could not retrieve production DATABASE_PUBLIC_URL from Railway`

`export-content.sh` runs `railway variables --service "$RAILWAY_SERVICE" --json` (default `RAILWAY_SERVICE=jorkaring`) and greps for `DATABASE_PUBLIC_URL`. If it comes back empty:

- Confirm the variable exists: `railway variables --service jorkaring --json | grep DATABASE_PUBLIC_URL`. It should — setting it requires enabling public networking on the Postgres service and copying the URL onto the `jorkaring` service.
- If the service is named something else in your project, override: `RAILWAY_SERVICE=<name> ./export-content.sh … --production`.
- As a last resort, build the URL manually from the Postgres service's `RAILWAY_TCP_PROXY_DOMAIN`, `RAILWAY_TCP_PROXY_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` and pass it directly:

  ```bash
  docker compose exec -T \
    -e DATABASE_URL="postgresql://payload:<password>@<proxy-domain>:<proxy-port>/payload" \
    payload pnpm export:content prod-$(date +%Y%m%d-%H%M%S)
  ```

### `⚠ Skipping "<filename>": file not found in backup` (during restore)

`export-content.sh --production` is supposed to make this unreachable for prod-sourced backups: after copying local uploads, it iterates every media doc and `fetch()`es any missing file from its public URL into the backup dir. If a restore still warns about missing files, the export step almost certainly logged a corresponding `⚠ Failed to fetch …` or `⚠ Error fetching …` line — re-read that output. Common causes:

- **Production volume actually missing the file** (HTTP 404 from `https://jorkaring-production.up.railway.app/api/media/file/<filename>`). The DB row is real but the file isn't on disk — typically a previously-broken upload, or a file that pre-dates the Railway volume mount and was lost at the redeploy that introduced it. Fix it on production (re-upload via the admin) and re-export, or accept the broken reference locally.
- **`PAYLOAD_PUBLIC_SERVER_URL` not set on the `jorkaring` Railway service** (or returned empty by `railway variables`). Without it the export-script env var falls back to localhost, generated media URLs point at the local container, and `fetch()` returns 404. Verify with `railway variables --service jorkaring --json | grep PAYLOAD_PUBLIC_SERVER_URL` — should be `https://jorkaring-production.up.railway.app` (or the current public domain).
- **Container can't reach the public domain** (network policy, DNS). Sanity-check with `docker compose exec payload wget -q --spider https://jorkaring-production.up.railway.app/api/media/file/<filename>; echo $?` (0 = ok).

If you genuinely want to restore with the missing files left as `null` references, the existing fallback still applies: `restore-content.ts` skips media with no file on disk, and `remapMediaIds` rewrites any dangling references to `null` so foreign keys don't blow up.

### `Failed query: insert into "pages_blocks_hero" ... background_image_id = <N>`

Earlier versions of `restore-content.ts` passed unresolved media IDs through unchanged (`mediaIdMap.get(value) ?? value`), which then violated the FK on `media.id`. Fixed in the script — unresolved media refs now become `null`. If you see this again, check that your `restore-content.ts` still nulls unresolved IDs for the `image`/`backgroundImage`/`logo`/`favicon` keys.

### `Failed to restore site settings: insert into "site_settings" ...`

The site settings restore used to only remap top-level `logo` and `favicon`, missing `splashPage.backgroundImage` and any rich-text media embeds. Fixed by running the whole settings object through `remapMediaIds`. If the error resurfaces, confirm that fix is still in place.

### Pages render but images are broken

Expected for any page that referenced one of the skipped media items — the field is `null` in the DB. Either re-upload the image via the admin, or adjust the block/page to not require that image.

### Restore triggers a deploy

The restore script logs `[Deploy Hook] Skipping: GITHUB_TOKEN or GITHUB_REPO not configured` locally — that's fine. In the container `.env`, those vars are only populated for the production payload service, so local restores won't fire GitHub Actions. If they ever do, it's because those vars leaked into the local container; unset them in `payload/.env`.

## Related files

- `export-content.sh`, `restore-content.sh` — shell wrappers
- `payload/scripts/export-content.ts`, `payload/scripts/restore-content.ts` — actual logic
- `payload/src/collections/Media.ts` — upload config (`staticDir: './public/uploads'`)
- `.github/workflows/deploy.yml` — the `pnpm run download-media` step that bundles media into the static build
