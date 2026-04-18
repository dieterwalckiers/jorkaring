# Restoring production data to local

How to pull the current production content (pages, media metadata, site settings) from Railway into your local Docker stack.

## Prerequisites

- Local stack running: `docker compose up`
- Railway CLI installed and logged in: `railway login`
- Project linked: `railway link` (the project is `jorkaring`; any service in it is fine for step 1)

## Happy path

There are two scripts:

- `./export-content.sh <name> --production` — dumps the production DB into `payload/backups/<name>/`
- `./restore-content.sh <name>` — restores that backup into the local DB

The export script reads `DATABASE_PUBLIC_URL` off whichever Railway service is currently linked. That variable lives on the `jorkaring` (payload) service, so link there:

```bash
railway service jorkaring   # pick the payload service interactively
./export-content.sh prod-$(date +%Y%m%d-%H%M%S) --production
./restore-content.sh prod-YYYYMMDD-HHMMSS --force
```

The restore script:
1. Runs pending migrations against the local DB
2. Deletes existing pages, media, and site settings
3. Copies `backups/<name>/uploads/` into `payload/public/uploads/`
4. Recreates media, pages (as drafts), page-to-page `menuFilter` relations, and site settings, remapping media IDs to the new auto-increment IDs

Pages come back as **drafts**. If you want them to match production (where they are published), run:

```bash
docker compose exec postgres psql -U payload -d payload \
  -c "UPDATE pages SET _status='published' WHERE _status='draft';"
```

Verify the frontend at `http://localhost:3201/` and the admin at `http://localhost:3202/admin`.

## Troubleshooting

### `Could not retrieve production DATABASE_PUBLIC_URL from Railway`

`export-content.sh` shells out to `railway variables --json` and greps for `DATABASE_PUBLIC_URL`. That variable only exists on the payload service (`jorkaring`), not on `Postgres`. Either:

- Re-link: `railway service jorkaring`, then re-run, or
- Build the URL manually from the Postgres service's `RAILWAY_TCP_PROXY_DOMAIN`, `RAILWAY_TCP_PROXY_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` and pass it directly:

  ```bash
  docker compose exec -T \
    -e DATABASE_URL="postgresql://payload:<password>@<proxy-domain>:<proxy-port>/payload" \
    payload pnpm export:content prod-$(date +%Y%m%d-%H%M%S)
  ```

### `⚠ Skipping "<filename>": file not found in backup`

The export script copies `payload/public/uploads/` from **the local payload container**, not from Railway. Production's `/app/public/uploads` is on Railway's ephemeral disk and gets wiped on every redeploy (see commit `819ca07`), so the files genuinely don't exist in production either — the static site build downloads them from whatever is still cached or reachable at build time.

Consequences locally:
- Only media whose files happen to live in your local `payload/public/uploads/` will restore fully
- Media records whose files are missing get skipped and their IDs are absent from the in-memory `mediaIdMap`
- Any page/site-setting field referencing those IDs gets remapped to `null` by `restore-content.ts` so foreign keys don't blow up

This is the current production reality, not a bug in the restore. If you need a full media set locally, you have to obtain the files out-of-band (e.g., from a collaborator's machine, a prior backup, or the deployed static site under `web/.output/public/api/media/file/`).

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
