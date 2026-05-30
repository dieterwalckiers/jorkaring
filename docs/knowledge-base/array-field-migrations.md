# Hand-writing migrations for array fields (and relationships inside them)

Adding an `array` field to a collection or global needs a DB migration, like any
schema change (see the migration notes in `CLAUDE.md`). Arrays are trickier than
scalar columns because each array creates its **own tables**, and any
relationship *inside* the array is stored differently depending on `hasMany`.

The interactive generator (`npx payload migrate:create <name>`) prompts
"create table or rename from another table?" and **cannot be answered over piped
stdin** in this environment (it needs a TTY). So for array fields you generally
hand-write the migration. The rules below let you do that reliably.

## Table naming

For an array field `menuItems` on the versioned `pages` collection:

- Published rows: `pages_menu_items` (`<collection>_<snake_cased_field>`)
- Version rows: `_pages_v_version_menu_items` (`_<collection>_v_version_<field>`)

For an array nested inside a block, the names extend the block table instead,
e.g. `pages_blocks_hero_rotating_headline_rotating_words` — see
`20260507_190744_add_hero_rotating_headline_block.ts` for that shape.

Confirm the convention against an existing array before writing SQL, e.g.
`site_settings_footer_links` / `_site_settings_v_version_footer_links`.

## Column shape

Published array table:

```sql
"_order"     integer NOT NULL,
"_parent_id" integer NOT NULL,   -- FK -> <collection>(id), ON DELETE cascade
"id"         varchar PRIMARY KEY NOT NULL,
-- ...one column per scalar subfield...
```

Version array table is the same but:

```sql
"id"    serial PRIMARY KEY NOT NULL,  -- serial, not varchar
"_uuid" varchar,                      -- extra trailing column
-- _parent_id FKs -> _<collection>_v(id)
```

Indexes on both: `(_order)` and `(_parent_id)`.

## Relationships inside an array — the gotcha

How a relationship subfield is stored depends on `hasMany`:

- **`hasMany: false` (single)** → stored as an **inline `<name>_id` column** on the
  array table itself (both published and version tables). It is **not** in the
  `_rels` table. Add the column, an FK `... REFERENCES <target>(id) ON DELETE set null`,
  and an index named `<table>_<name>_idx` (note: `_id` is dropped from the index
  name — `page_id` → `pages_menu_items_page_idx`). Pattern reference:
  `pages_blocks_logo_marquee_logos.image_id`.
- **`hasMany: true`** → stored in the polymorphic `pages_rels` / `_pages_v_rels`
  table keyed by `path` (e.g. the old `menuFilter` lived at `path = 'menuFilter'`).
  No column on the array table.

Getting this wrong fails at runtime with a query referencing a missing column
(e.g. Payload's read SELECT expects `_pages_v_version_menu_items.page_id`).

## Porting existing data inside the migration

When converting an old field into a new array, read the old rows with raw SQL and
write the new shape with **raw SQL too** — do **not** use `payload.update()` / the
local API.

> ⚠️ **The local-API footgun (this took prod down once — 2026-05-31).**
> `payload.update()` builds its query from the **current config**, not from the
> schema state at this point in the migration chain. If a *later* migration adds a
> column to the same table (here `200000` adds `menu_items.anchor`), then on a
> fresh DB — production, or any DB migrating the whole batch at once — the local
> API's SELECT references a column that doesn't exist yet and the migration dies
> with `column _pages_v_version_menuItems.anchor does not exist`. It "works"
> locally only because there each migration ran one-at-a-time while the config
> still matched. Railway runs the batch against the final config, so it fails.
> Raw SQL touches only the columns you name, so it is immune to this.

```ts
// Read old rows, insert the new array rows directly. gen_random_uuid() is in
// PG16 core (no extension). _order is 1-based via row_number().
await db.execute(sql`
  INSERT INTO "pages_menu_items" ("_order", "_parent_id", "id", "page_id")
  SELECT
    row_number() OVER (PARTITION BY "parent_id" ORDER BY "order" NULLS LAST, "id"),
    "parent_id",
    gen_random_uuid()::text,
    "pages_id"
  FROM "pages_rels"
  WHERE "path" = 'menuFilter' AND "pages_id" IS NOT NULL;
`)
```

If you genuinely must use the local API for a data port (e.g. to run hooks),
isolate it in its **own** migration placed *after* every schema migration that
touches the same tables, so the config and schema agree when it runs. Note the
local API also fires `afterChange` hooks — `Pages.ts`'s `triggerDeploy` would kick
a GitHub Actions deploy per page; pass `context: { skipDeploy: true }`.

Always validate a destructive/data migration against a **real copy of prod**
before deploying:

```bash
docker compose exec -T postgres psql -U payload -d payload -c "CREATE DATABASE prodtest;"
gunzip -c payload/backups/pgdump-prod-<date>/prod.sql.gz | docker compose exec -T postgres psql -U payload -d prodtest
docker compose exec -T -e DATABASE_URL="postgresql://payload:payload@postgres:5432/prodtest" payload npm run migrate
```

Reference migration: `20260530_180000_add_menu_items_override.ts`.
