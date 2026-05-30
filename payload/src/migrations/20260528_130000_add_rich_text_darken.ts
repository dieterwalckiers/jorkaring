import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_rich_text" ADD COLUMN "darken" boolean DEFAULT false;
    ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN "darken" boolean DEFAULT false;
    ALTER TABLE "site_settings_blocks_rich_text" ADD COLUMN "darken" boolean DEFAULT false;
    ALTER TABLE "_site_settings_v_blocks_rich_text" ADD COLUMN "darken" boolean DEFAULT false;

    ALTER TABLE "pages_blocks_rich_text" ADD COLUMN "darken_strength" numeric DEFAULT 40;
    ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN "darken_strength" numeric DEFAULT 40;
    ALTER TABLE "site_settings_blocks_rich_text" ADD COLUMN "darken_strength" numeric DEFAULT 40;
    ALTER TABLE "_site_settings_v_blocks_rich_text" ADD COLUMN "darken_strength" numeric DEFAULT 40;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "darken";
    ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "darken";
    ALTER TABLE "site_settings_blocks_rich_text" DROP COLUMN "darken";
    ALTER TABLE "_site_settings_v_blocks_rich_text" DROP COLUMN "darken";

    ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "darken_strength";
    ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "darken_strength";
    ALTER TABLE "site_settings_blocks_rich_text" DROP COLUMN "darken_strength";
    ALTER TABLE "_site_settings_v_blocks_rich_text" DROP COLUMN "darken_strength";
  `)
}
