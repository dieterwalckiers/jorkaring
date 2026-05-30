import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages" ADD COLUMN "menu_item_style" varchar;
    ALTER TABLE "_pages_v" ADD COLUMN "version_menu_item_style" varchar;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages" DROP COLUMN "menu_item_style";
    ALTER TABLE "_pages_v" DROP COLUMN "version_menu_item_style";
  `)
}
