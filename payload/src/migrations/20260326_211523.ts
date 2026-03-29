import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_overlay" AS ENUM('none', 'darken', 'lighten');
  CREATE TYPE "public"."enum_site_settings_blocks_hero_overlay" AS ENUM('none', 'darken', 'lighten');
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "overlay" "enum_pages_blocks_hero_overlay" DEFAULT 'none';
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "overlay_strength" numeric DEFAULT 40;
  ALTER TABLE "site_settings_blocks_hero" ADD COLUMN "overlay" "enum_site_settings_blocks_hero_overlay" DEFAULT 'none';
  ALTER TABLE "site_settings_blocks_hero" ADD COLUMN "overlay_strength" numeric DEFAULT 40;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_hero" DROP COLUMN "overlay";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "overlay_strength";
  ALTER TABLE "site_settings_blocks_hero" DROP COLUMN "overlay";
  ALTER TABLE "site_settings_blocks_hero" DROP COLUMN "overlay_strength";
  DROP TYPE "public"."enum_pages_blocks_hero_overlay";
  DROP TYPE "public"."enum_site_settings_blocks_hero_overlay";`)
}
