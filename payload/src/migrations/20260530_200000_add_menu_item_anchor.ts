import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_menu_items" ADD COLUMN "anchor" varchar;
    ALTER TABLE "_pages_v_version_menu_items" ADD COLUMN "anchor" varchar;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_menu_items" DROP COLUMN "anchor";
    ALTER TABLE "_pages_v_version_menu_items" DROP COLUMN "anchor";
  `)
}
