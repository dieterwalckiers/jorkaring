import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_content_grid" ADD COLUMN "cell_dividers" boolean DEFAULT false;
    ALTER TABLE "pages_blocks_content_grid" ADD COLUMN "cell_divider_color" varchar DEFAULT 'theme1';
    ALTER TABLE "_pages_v_blocks_content_grid" ADD COLUMN "cell_dividers" boolean DEFAULT false;
    ALTER TABLE "_pages_v_blocks_content_grid" ADD COLUMN "cell_divider_color" varchar DEFAULT 'theme1';
    ALTER TABLE "site_settings_blocks_content_grid" ADD COLUMN "cell_dividers" boolean DEFAULT false;
    ALTER TABLE "site_settings_blocks_content_grid" ADD COLUMN "cell_divider_color" varchar DEFAULT 'theme1';
    ALTER TABLE "_site_settings_v_blocks_content_grid" ADD COLUMN "cell_dividers" boolean DEFAULT false;
    ALTER TABLE "_site_settings_v_blocks_content_grid" ADD COLUMN "cell_divider_color" varchar DEFAULT 'theme1';
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_content_grid" DROP COLUMN "cell_dividers";
    ALTER TABLE "pages_blocks_content_grid" DROP COLUMN "cell_divider_color";
    ALTER TABLE "_pages_v_blocks_content_grid" DROP COLUMN "cell_dividers";
    ALTER TABLE "_pages_v_blocks_content_grid" DROP COLUMN "cell_divider_color";
    ALTER TABLE "site_settings_blocks_content_grid" DROP COLUMN "cell_dividers";
    ALTER TABLE "site_settings_blocks_content_grid" DROP COLUMN "cell_divider_color";
    ALTER TABLE "_site_settings_v_blocks_content_grid" DROP COLUMN "cell_dividers";
    ALTER TABLE "_site_settings_v_blocks_content_grid" DROP COLUMN "cell_divider_color";
  `)
}
