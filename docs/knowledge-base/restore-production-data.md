# Restoring production data to local

How to pull the current production content (pages, media metadata, site settings) from production (Render + Neon Postgres + Neon Object Storage) into your local Docker stack. For the reverse (local → prod), see [restore-local-data-to-production.md](./restore-local-data-to-production.md).

## Prerequisites

- Local stack running: `docker compose up`
- `~/.config/jorkaring/prod.env` filled in (see below)

## `~/.config/jorkaring/prod.env`

The `--production` paths read production values from this file (outside the repo, `chmod 600`; override the path with `PROD_ENV=...`). Same keys as the Render service:

```sh
# Single-quote values: the file is sourced by bash and Neon URLs contain '&'
DATABASE_URL='postgresql://...neon.tech/neondb?sslmode=require&channel_binding=require'   # Neon direct (non-pooled)
PAYLOAD_PUBLIC_SERVER_URL=https://jorkaring-cms.onrender.com
S3_BUCKET=jorkaring-media
S3_ENDPOINT='https://<branch-id>.storage.<cell>.eu-central-1.aws.neon.tech'   # AWS_ENDPOINT_URL_S3 from `neon env pull`
S3_REGION=eu-central-1
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
GITHUB_TOKEN=...
GITHUB_REPO=dieterwalckiers/jorkaring
```

## Happy path

There are two scripts:

- `./export-content.sh <name> --production` — dumps the production DB into `payload/backups/<name>/`
- `./restore-content.sh <name>` — restores that backup into the local DB

```bash
./export-content.sh prod-$(date +%Y%m%d-%H%M%S) --production
./restore-content.sh prod-YYYYMMDD-HHMMSS --force
```

The export script (with `--production`):
1. Reads `DATABASE_URL` and `PAYLOAD_PUBLIC_SERVER_URL` from `prod.env` and passes both into the payload container (the latter so generated media URLs target production rather than `localhost`), after waking the CMS (Render free plan sleeps after 15 min idle; the first request takes about a minute)
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

### `prod.env not found` / `DATABASE_URL or PAYLOAD_PUBLIC_SERVER_URL missing`

Create or complete `~/.config/jorkaring/prod.env` (see above). The values are also in the Render dashboard (service `jorkaring-cms`, Environment) and the Neon console (direct connection string).

### `CMS did not wake up`

The script polls `<PAYLOAD_PUBLIC_SERVER_URL>/api/pages?limit=1` for 5 minutes. Check the Render dashboard for a failed deploy or a suspended free service (750 instance hours per month per workspace).

### `⚠ Skipping "<filename>": file not found in backup` (during restore)

`export-content.sh --production` is supposed to make this unreachable for prod-sourced backups: after copying local uploads, it iterates every media doc and `fetch()`es any missing file from its public URL into the backup dir. If a restore still warns about missing files, the export step almost certainly logged a corresponding `⚠ Failed to fetch …` or `⚠ Error fetching …` line — re-read that output. Common causes:

- **Bucket actually missing the file** (HTTP 404 from `<PAYLOAD_PUBLIC_SERVER_URL>/api/media/file/<filename>`). The DB row is real but the object isn't in `jorkaring-media`, typically a previously-broken upload. Fix it on production (re-upload via the admin) and re-export, or accept the broken reference locally.
- **Wrong `PAYLOAD_PUBLIC_SERVER_URL` in `prod.env`**: generated media URLs point somewhere else and `fetch()` fails. It must be the Render origin, e.g. `https://jorkaring-cms.onrender.com`.
- **Container can't reach the public domain** (network policy, DNS). Sanity-check with `docker compose exec payload wget -q --spider <PAYLOAD_PUBLIC_SERVER_URL>/api/media/file/<filename>; echo $?` (0 = ok).

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
- `payload/src/collections/Media.ts` — upload config (`staticDir: './public/uploads'` locally; Neon Object Storage via `@payloadcms/storage-s3` in `payload.config.ts` when `S3_BUCKET` is set)
- `.github/workflows/deploy.yml` — the `pnpm run download-media` step that bundles media into the static build
