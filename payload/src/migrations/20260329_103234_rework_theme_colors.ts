import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Rename color1..6 to theme1..6
  await db.execute(sql`ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_color1" TO "theme_colors_theme1"`)
  await db.execute(sql`ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_color2" TO "theme_colors_theme2"`)
  await db.execute(sql`ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_color3" TO "theme_colors_theme3"`)
  await db.execute(sql`ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_color4" TO "theme_colors_theme4"`)
  await db.execute(sql`ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_color5" TO "theme_colors_theme5"`)
  await db.execute(sql`ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_color6" TO "theme_colors_theme6"`)

  // Rename color1Label..6Label to theme1Label..6Label
  await db.execute(sql`ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_color1_label" TO "theme_colors_theme1_label"`)
  await db.execute(sql`ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_color2_label" TO "theme_colors_theme2_label"`)
  await db.execute(sql`ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_color3_label" TO "theme_colors_theme3_label"`)
  await db.execute(sql`ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_color4_label" TO "theme_colors_theme4_label"`)
  await db.execute(sql`ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_color5_label" TO "theme_colors_theme5_label"`)
  await db.execute(sql`ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_color6_label" TO "theme_colors_theme6_label"`)

  // Rename accent to fontAccent (column already exists as theme_colors_font_accent from old schema)
  // The theme_colors_accent column needs to become theme_colors_font_accent, but that column already exists.
  // Move accent value into font_accent if font_accent is empty, then drop accent.
  await db.execute(sql`UPDATE "site_settings" SET "theme_colors_font_accent" = "theme_colors_accent" WHERE "theme_colors_accent" IS NOT NULL AND ("theme_colors_font_accent" IS NULL OR "theme_colors_font_accent" = '')`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "theme_colors_accent"`)

  // Add new theme colors (7 and 8)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN "theme_colors_theme7" varchar DEFAULT '#2C3E50'`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN "theme_colors_theme8" varchar DEFAULT '#E74C3C'`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN "theme_colors_theme7_label" varchar DEFAULT 'Theme 7'`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN "theme_colors_theme8_label" varchar DEFAULT 'Theme 8'`)

  // Add new system colors
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN "theme_colors_main_bg" varchar DEFAULT '#ffffff'`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN "theme_colors_headings" varchar DEFAULT '#5E6E83'`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN "theme_colors_button_font" varchar DEFAULT '#373031'`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN "theme_colors_button_bg" varchar DEFAULT 'transparent'`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN "theme_colors_button_font_hover" varchar DEFAULT '#ffffff'`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN "theme_colors_button_bg_hover" varchar DEFAULT '#EA8928'`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN "theme_colors_table_borders" varchar DEFAULT '#EA8928'`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN "theme_colors_sticky_message_txt" varchar DEFAULT '#B6C9BB'`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN "theme_colors_sticky_message_bg" varchar DEFAULT '#5E6E83'`)

  // Drop removed label fields
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "theme_colors_font_label"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "theme_colors_accent_label"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "theme_colors_font_brand1_label"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "theme_colors_font_brand2_label"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "theme_colors_font_accent_label"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "theme_colors_font_highlight_label"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "theme_colors_highlight_label"`)

  // Drop removed color fields
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "theme_colors_font_brand1"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "theme_colors_font_brand2"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "theme_colors_font_highlight"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "theme_colors_highlight"`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Restore renamed columns
  await db.execute(sql`ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_theme1" TO "theme_colors_color1"`)
  await db.execute(sql`ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_theme2" TO "theme_colors_color2"`)
  await db.execute(sql`ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_theme3" TO "theme_colors_color3"`)
  await db.execute(sql`ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_theme4" TO "theme_colors_color4"`)
  await db.execute(sql`ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_theme5" TO "theme_colors_color5"`)
  await db.execute(sql`ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_theme6" TO "theme_colors_color6"`)

  await db.execute(sql`ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_theme1_label" TO "theme_colors_color1_label"`)
  await db.execute(sql`ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_theme2_label" TO "theme_colors_color2_label"`)
  await db.execute(sql`ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_theme3_label" TO "theme_colors_color3_label"`)
  await db.execute(sql`ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_theme4_label" TO "theme_colors_color4_label"`)
  await db.execute(sql`ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_theme5_label" TO "theme_colors_color5_label"`)
  await db.execute(sql`ALTER TABLE "site_settings" RENAME COLUMN "theme_colors_theme6_label" TO "theme_colors_color6_label"`)

  // Restore accent from font_accent
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN "theme_colors_accent" varchar DEFAULT '#8B5A4A'`)
  await db.execute(sql`UPDATE "site_settings" SET "theme_colors_accent" = "theme_colors_font_accent"`)

  // Re-add old label fields
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN "theme_colors_font_label" varchar DEFAULT 'Font Color'`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN "theme_colors_accent_label" varchar DEFAULT 'Accent'`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN "theme_colors_font_brand1_label" varchar DEFAULT 'Font Brand 1'`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN "theme_colors_font_brand2_label" varchar DEFAULT 'Font Brand 2'`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN "theme_colors_font_accent_label" varchar DEFAULT 'Font Accent'`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN "theme_colors_font_highlight_label" varchar DEFAULT 'Font Highlight'`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN "theme_colors_highlight_label" varchar DEFAULT 'Highlight'`)

  // Re-add old color fields
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN "theme_colors_font_brand1" varchar DEFAULT '#6b081d'`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN "theme_colors_font_brand2" varchar DEFAULT '#f15b4e'`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN "theme_colors_font_highlight" varchar DEFAULT '#f15b4e'`)
  await db.execute(sql`ALTER TABLE "site_settings" ADD COLUMN "theme_colors_highlight" varchar DEFAULT '#f15b4e'`)

  // Drop new columns
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "theme_colors_theme7"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "theme_colors_theme8"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "theme_colors_theme7_label"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "theme_colors_theme8_label"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "theme_colors_main_bg"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "theme_colors_headings"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "theme_colors_button_font"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "theme_colors_button_bg"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "theme_colors_button_font_hover"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "theme_colors_button_bg_hover"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "theme_colors_table_borders"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "theme_colors_sticky_message_txt"`)
  await db.execute(sql`ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "theme_colors_sticky_message_bg"`)
}
