import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_rich_text" ADD COLUMN "full_bleed" boolean DEFAULT false;
    ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN "full_bleed" boolean DEFAULT false;
    ALTER TABLE "site_settings_blocks_rich_text" ADD COLUMN "full_bleed" boolean DEFAULT false;
    ALTER TABLE "_site_settings_v_blocks_rich_text" ADD COLUMN "full_bleed" boolean DEFAULT false;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "full_bleed";
    ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "full_bleed";
    ALTER TABLE "site_settings_blocks_rich_text" DROP COLUMN "full_bleed";
    ALTER TABLE "_site_settings_v_blocks_rich_text" DROP COLUMN "full_bleed";
  `)
}
