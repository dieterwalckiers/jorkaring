import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "theme_colors_brandprimarymedium" varchar DEFAULT '#5E6E83';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_brandprimarydark" varchar DEFAULT '#5E6E83';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_brandsecondarylight" varchar DEFAULT '#B6C9BB';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_brandsecondarylight2" varchar DEFAULT '#BFEDC1';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_brandsecondarymedium" varchar DEFAULT '#EA8928';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_brandsecondarymedium2" varchar DEFAULT '#656565';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_font" varchar DEFAULT '#373031';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_font_brand1" varchar DEFAULT '#6b081d';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_font_brand2" varchar DEFAULT '#f15b4e';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_font_accent" varchar DEFAULT '#8B5A4A';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_font_highlight" varchar DEFAULT '#f15b4e';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_accent" varchar DEFAULT '#8B5A4A';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_highlight" varchar DEFAULT '#f15b4e';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "theme_colors_brandprimarymedium";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_brandprimarydark";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_brandsecondarylight";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_brandsecondarylight2";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_brandsecondarymedium";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_brandsecondarymedium2";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_font";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_font_brand1";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_font_brand2";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_font_accent";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_font_highlight";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_accent";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_highlight";`)
}
