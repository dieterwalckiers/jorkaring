import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_content_grid" ADD COLUMN "equal_row_heights" boolean DEFAULT false;
    ALTER TABLE "_pages_v_blocks_content_grid" ADD COLUMN "equal_row_heights" boolean DEFAULT false;
    ALTER TABLE "site_settings_blocks_content_grid" ADD COLUMN "equal_row_heights" boolean DEFAULT false;
    ALTER TABLE "_site_settings_v_blocks_content_grid" ADD COLUMN "equal_row_heights" boolean DEFAULT false;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_content_grid" DROP COLUMN "equal_row_heights";
    ALTER TABLE "_pages_v_blocks_content_grid" DROP COLUMN "equal_row_heights";
    ALTER TABLE "site_settings_blocks_content_grid" DROP COLUMN "equal_row_heights";
    ALTER TABLE "_site_settings_v_blocks_content_grid" DROP COLUMN "equal_row_heights";
  `)
}
