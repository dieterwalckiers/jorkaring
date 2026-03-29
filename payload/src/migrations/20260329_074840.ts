import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_contact_form" CASCADE;
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_color1_label" varchar DEFAULT 'Color 1';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_color2_label" varchar DEFAULT 'Color 2';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_color3_label" varchar DEFAULT 'Color 3';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_color4_label" varchar DEFAULT 'Color 4';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_color5_label" varchar DEFAULT 'Color 5';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_color6_label" varchar DEFAULT 'Color 6';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_font_label" varchar DEFAULT 'Font Color';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_font_brand1_label" varchar DEFAULT 'Font Brand 1';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_font_brand2_label" varchar DEFAULT 'Font Brand 2';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_font_accent_label" varchar DEFAULT 'Font Accent';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_font_highlight_label" varchar DEFAULT 'Font Highlight';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_accent_label" varchar DEFAULT 'Accent';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_highlight_label" varchar DEFAULT 'Highlight';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tally_form_id" varchar DEFAULT '81x1GP' NOT NULL,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_contact_form" ADD CONSTRAINT "pages_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_contact_form_order_idx" ON "pages_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_form_parent_id_idx" ON "pages_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_form_path_idx" ON "pages_blocks_contact_form" USING btree ("_path");
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_color1_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_color2_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_color3_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_color4_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_color5_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_color6_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_font_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_font_brand1_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_font_brand2_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_font_accent_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_font_highlight_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_accent_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_highlight_label";`)
}
