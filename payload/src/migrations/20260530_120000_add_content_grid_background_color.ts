import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_content_grid" ADD COLUMN "background_color" varchar DEFAULT 'transparent';
    ALTER TABLE "_pages_v_blocks_content_grid" ADD COLUMN "background_color" varchar DEFAULT 'transparent';
    ALTER TABLE "site_settings_blocks_content_grid" ADD COLUMN "background_color" varchar DEFAULT 'transparent';
    ALTER TABLE "_site_settings_v_blocks_content_grid" ADD COLUMN "background_color" varchar DEFAULT 'transparent';
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_content_grid" DROP COLUMN "background_color";
    ALTER TABLE "_pages_v_blocks_content_grid" DROP COLUMN "background_color";
    ALTER TABLE "site_settings_blocks_content_grid" DROP COLUMN "background_color";
    ALTER TABLE "_site_settings_v_blocks_content_grid" DROP COLUMN "background_color";
  `)
}
