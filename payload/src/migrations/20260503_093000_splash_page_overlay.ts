import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_splash_page_background_overlay" AS ENUM('none', 'darken', 'lighten');
  CREATE TYPE "public"."enum__site_settings_v_version_splash_page_background_overlay" AS ENUM('none', 'darken', 'lighten');
  ALTER TABLE "site_settings" ADD COLUMN "splash_page_background_overlay" "enum_site_settings_splash_page_background_overlay" DEFAULT 'none';
  ALTER TABLE "site_settings" ADD COLUMN "splash_page_background_overlay_strength" numeric DEFAULT 40;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_splash_page_background_overlay" "enum__site_settings_v_version_splash_page_background_overlay" DEFAULT 'none';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_splash_page_background_overlay_strength" numeric DEFAULT 40;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "splash_page_background_overlay";
  ALTER TABLE "site_settings" DROP COLUMN "splash_page_background_overlay_strength";
  ALTER TABLE "_site_settings_v" DROP COLUMN "version_splash_page_background_overlay";
  ALTER TABLE "_site_settings_v" DROP COLUMN "version_splash_page_background_overlay_strength";
  DROP TYPE "public"."enum_site_settings_splash_page_background_overlay";
  DROP TYPE "public"."enum__site_settings_v_version_splash_page_background_overlay";`)
}
