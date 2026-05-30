import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_hero" ADD COLUMN "centered" boolean DEFAULT true;
    ALTER TABLE "pages_blocks_hero" ADD COLUMN "focal_point_x" numeric DEFAULT 50;
    ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "centered" boolean DEFAULT true;
    ALTER TABLE "_pages_v_blocks_hero" ADD COLUMN "focal_point_x" numeric DEFAULT 50;
    ALTER TABLE "site_settings_blocks_hero" ADD COLUMN "centered" boolean DEFAULT true;
    ALTER TABLE "site_settings_blocks_hero" ADD COLUMN "focal_point_x" numeric DEFAULT 50;
    ALTER TABLE "_site_settings_v_blocks_hero" ADD COLUMN "centered" boolean DEFAULT true;
    ALTER TABLE "_site_settings_v_blocks_hero" ADD COLUMN "focal_point_x" numeric DEFAULT 50;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_hero" DROP COLUMN "centered";
    ALTER TABLE "pages_blocks_hero" DROP COLUMN "focal_point_x";
    ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "centered";
    ALTER TABLE "_pages_v_blocks_hero" DROP COLUMN "focal_point_x";
    ALTER TABLE "site_settings_blocks_hero" DROP COLUMN "centered";
    ALTER TABLE "site_settings_blocks_hero" DROP COLUMN "focal_point_x";
    ALTER TABLE "_site_settings_v_blocks_hero" DROP COLUMN "centered";
    ALTER TABLE "_site_settings_v_blocks_hero" DROP COLUMN "focal_point_x";
  `)
}
