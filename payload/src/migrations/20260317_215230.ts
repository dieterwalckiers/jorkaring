import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" RENAME COLUMN "styling_google_font" TO "styling_google_font_body";
  ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_brandprimarymedium" TO "theme_colors_color1";
  ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_brandprimarydark" TO "theme_colors_color2";
  ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_brandsecondarylight" TO "theme_colors_color3";
  ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_brandsecondarylight2" TO "theme_colors_color4";
  ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_brandsecondarymedium" TO "theme_colors_color5";
  ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_brandsecondarymedium2" TO "theme_colors_color6";
  ALTER TABLE "site_settings" ADD COLUMN "styling_google_font_h1" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "styling_google_font_headings" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" RENAME COLUMN "styling_google_font_body" TO "styling_google_font";
  ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_color1" TO "theme_colors_brandprimarymedium";
  ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_color2" TO "theme_colors_brandprimarydark";
  ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_color3" TO "theme_colors_brandsecondarylight";
  ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_color4" TO "theme_colors_brandsecondarylight2";
  ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_color5" TO "theme_colors_brandsecondarymedium";
  ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_color6" TO "theme_colors_brandsecondarymedium2";
  ALTER TABLE "site_settings" DROP COLUMN "styling_google_font_h1";
  ALTER TABLE "site_settings" DROP COLUMN "styling_google_font_headings";`)
}
