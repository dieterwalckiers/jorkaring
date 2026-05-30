import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_in_page_menu_title" ADD COLUMN "position" numeric;
    ALTER TABLE "_pages_v_blocks_in_page_menu_title" ADD COLUMN "position" numeric;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_in_page_menu_title" DROP COLUMN "position";
    ALTER TABLE "_pages_v_blocks_in_page_menu_title" DROP COLUMN "position";
  `)
}
