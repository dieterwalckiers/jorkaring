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

When converting an old field into a new array, read the old rows with raw SQL
(the old field is gone from the config, so the local API can't read it) and write
the new shape through the **local API**, which handles array rows + inline rels
correctly:

```ts
const { rows } = await db.execute(sql`
  SELECT "parent_id", "pages_id" FROM "pages_rels"
  WHERE "path" = 'menuFilter' AND "pages_id" IS NOT NULL
  ORDER BY "parent_id", "order"
`)
// group by parent, then:
await payload.update({
  collection: 'pages',
  id: pageId,
  data: { menuItems: targets.map((page) => ({ page })) },
  req,                          // stay inside the migration transaction
  depth: 0,
  context: { skipDeploy: true } // see below
})
```

`payload.update` runs `afterChange` hooks. `Pages.ts` fires `triggerDeploy` on
published saves, which would kick a GitHub Actions deploy **per page** during the
migration. The hook honours `context.skipDeploy` — always pass it from data
migrations. `_order` for array rows is 1-based, matching the old `hasMany`
relationship `order`, so it can be reused directly when reconstructing on `down`.

Reference migration: `20260530_180000_add_menu_items_override.ts`.
