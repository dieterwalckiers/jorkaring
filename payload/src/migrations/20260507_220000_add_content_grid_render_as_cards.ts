import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_pages_blocks_content_grid_card_background" AS ENUM('lighten', 'darken');
    CREATE TYPE "public"."enum__pages_v_blocks_content_grid_card_background" AS ENUM('lighten', 'darken');
    CREATE TYPE "public"."enum_site_settings_blocks_content_grid_card_background" AS ENUM('lighten', 'darken');
    CREATE TYPE "public"."enum__site_settings_v_blocks_content_grid_card_background" AS ENUM('lighten', 'darken');

    ALTER TABLE "pages_blocks_content_grid" ADD COLUMN "render_as_cards" boolean DEFAULT false;
    ALTER TABLE "pages_blocks_content_grid" ADD COLUMN "card_background" "enum_pages_blocks_content_grid_card_background" DEFAULT 'lighten';
    ALTER TABLE "pages_blocks_content_grid" ADD COLUMN "card_rounded_corners" boolean DEFAULT false;

    ALTER TABLE "_pages_v_blocks_content_grid" ADD COLUMN "render_as_cards" boolean DEFAULT false;
    ALTER TABLE "_pages_v_blocks_content_grid" ADD COLUMN "card_background" "enum__pages_v_blocks_content_grid_card_background" DEFAULT 'lighten';
    ALTER TABLE "_pages_v_blocks_content_grid" ADD COLUMN "card_rounded_corners" boolean DEFAULT false;

    ALTER TABLE "site_settings_blocks_content_grid" ADD COLUMN "render_as_cards" boolean DEFAULT false;
    ALTER TABLE "site_settings_blocks_content_grid" ADD COLUMN "card_background" "enum_site_settings_blocks_content_grid_card_background" DEFAULT 'lighten';
    ALTER TABLE "site_settings_blocks_content_grid" ADD COLUMN "card_rounded_corners" boolean DEFAULT false;

    ALTER TABLE "_site_settings_v_blocks_content_grid" ADD COLUMN "render_as_cards" boolean DEFAULT false;
    ALTER TABLE "_site_settings_v_blocks_content_grid" ADD COLUMN "card_background" "enum__site_settings_v_blocks_content_grid_card_background" DEFAULT 'lighten';
    ALTER TABLE "_site_settings_v_blocks_content_grid" ADD COLUMN "card_rounded_corners" boolean DEFAULT false;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_content_grid" DROP COLUMN "render_as_cards";
    ALTER TABLE "pages_blocks_content_grid" DROP COLUMN "card_background";
    ALTER TABLE "pages_blocks_content_grid" DROP COLUMN "card_rounded_corners";

    ALTER TABLE "_pages_v_blocks_content_grid" DROP COLUMN "render_as_cards";
    ALTER TABLE "_pages_v_blocks_content_grid" DROP COLUMN "card_background";
    ALTER TABLE "_pages_v_blocks_content_grid" DROP COLUMN "card_rounded_corners";

    ALTER TABLE "site_settings_blocks_content_grid" DROP COLUMN "render_as_cards";
    ALTER TABLE "site_settings_blocks_content_grid" DROP COLUMN "card_background";
    ALTER TABLE "site_settings_blocks_content_grid" DROP COLUMN "card_rounded_corners";

    ALTER TABLE "_site_settings_v_blocks_content_grid" DROP COLUMN "render_as_cards";
    ALTER TABLE "_site_settings_v_blocks_content_grid" DROP COLUMN "card_background";
    ALTER TABLE "_site_settings_v_blocks_content_grid" DROP COLUMN "card_rounded_corners";

    DROP TYPE "public"."enum_pages_blocks_content_grid_card_background";
    DROP TYPE "public"."enum__pages_v_blocks_content_grid_card_background";
    DROP TYPE "public"."enum_site_settings_blocks_content_grid_card_background";
    DROP TYPE "public"."enum__site_settings_v_blocks_content_grid_card_background";
  `)
}
