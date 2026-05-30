import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // 1. Create the array tables backing the new per-page `menuItems` override.
  //    The single `page` relationship is stored inline as a `page_id` column
  //    (Payload only uses the rels table for hasMany / polymorphic relations).
  await db.execute(sql`
    CREATE TABLE "pages_menu_items" (
    	"_order" integer NOT NULL,
    	"_parent_id" integer NOT NULL,
    	"id" varchar PRIMARY KEY NOT NULL,
    	"page_id" integer,
    	"label" varchar
    );

    CREATE TABLE "_pages_v_version_menu_items" (
    	"_order" integer NOT NULL,
    	"_parent_id" integer NOT NULL,
    	"id" serial PRIMARY KEY NOT NULL,
    	"page_id" integer,
    	"label" varchar,
    	"_uuid" varchar
    );

    ALTER TABLE "pages_menu_items" ADD CONSTRAINT "pages_menu_items_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "pages_menu_items" ADD CONSTRAINT "pages_menu_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "_pages_v_version_menu_items" ADD CONSTRAINT "_pages_v_version_menu_items_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_pages_v_version_menu_items" ADD CONSTRAINT "_pages_v_version_menu_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "pages_menu_items_order_idx" ON "pages_menu_items" USING btree ("_order");
    CREATE INDEX "pages_menu_items_parent_id_idx" ON "pages_menu_items" USING btree ("_parent_id");
    CREATE INDEX "pages_menu_items_page_idx" ON "pages_menu_items" USING btree ("page_id");
    CREATE INDEX "_pages_v_version_menu_items_order_idx" ON "_pages_v_version_menu_items" USING btree ("_order");
    CREATE INDEX "_pages_v_version_menu_items_parent_id_idx" ON "_pages_v_version_menu_items" USING btree ("_parent_id");
    CREATE INDEX "_pages_v_version_menu_items_page_idx" ON "_pages_v_version_menu_items" USING btree ("page_id");
  `)

  // 2. Port existing `menuFilter` selections into the new `menuItems` array.
  //    The old field is gone from the config, so read the relationships straight
  //    from the rels table, then rewrite each page through the local API so
  //    Payload stores the array rows and inline relationships in its own shape.
  const { rows } = await db.execute(sql`
    SELECT "parent_id", "pages_id"
    FROM "pages_rels"
    WHERE "path" = 'menuFilter' AND "pages_id" IS NOT NULL
    ORDER BY "parent_id", "order"
  `)

  const byParent = new Map<number, number[]>()
  for (const row of rows as Array<{ parent_id: number; pages_id: number }>) {
    const targets = byParent.get(row.parent_id) ?? []
    targets.push(row.pages_id)
    byParent.set(row.parent_id, targets)
  }

  for (const [pageId, targets] of byParent) {
    await payload.update({
      collection: 'pages',
      id: pageId,
      data: { menuItems: targets.map((page) => ({ page })) },
      req,
      depth: 0,
      context: { skipDeploy: true },
    })
  }

  // Drop the now-superseded `menuFilter` relationships (the field no longer exists).
  await db.execute(sql`DELETE FROM "pages_rels" WHERE "path" = 'menuFilter';`)
  await db.execute(sql`DELETE FROM "_pages_v_rels" WHERE "path" = 'menuFilter';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Reconstruct the old `menuFilter` relationships from the ported menu items
  // so reverting the schema keeps the data, then drop the new tables.
  await db.execute(sql`
    INSERT INTO "pages_rels" ("parent_id", "path", "order", "pages_id")
    SELECT "_parent_id", 'menuFilter', "_order", "page_id"
    FROM "pages_menu_items"
    WHERE "page_id" IS NOT NULL;

    DROP TABLE "pages_menu_items" CASCADE;
    DROP TABLE "_pages_v_version_menu_items" CASCADE;
  `)
}
