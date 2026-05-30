import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_pages_blocks_hero_headline_font_size" AS ENUM('h1', 'h2', 'h3', 'h4', 'h5', 'h6');
    CREATE TYPE "public"."enum__pages_v_blocks_hero_headline_font_size" AS ENUM('h1', 'h2', 'h3', 'h4', 'h5', 'h6');
    CREATE TYPE "public"."enum_site_settings_blocks_hero_headline_font_size" AS ENUM('h1', 'h2', 'h3', 'h4', 'h5', 'h6');
    CREATE TYPE "public"."enum__site_settings_v_blocks_hero_headline_font_size" AS ENUM('h1', 'h2', 'h3', 'h4', 'h5', 'h6');

    CREATE TYPE "public"."enum_pages_blocks_hero_rotating_headline_font_size" AS ENUM('h1', 'h2', 'h3', 'h4', 'h5', 'h6');
    CREATE TYPE "public"."enum__pages_v_blocks_hero_rotating_headline_font_size" AS ENUM('h1', 'h2', 'h3', 'h4', 'h5', 'h6');
    CREATE TYPE "public"."enum_site_settings_blocks_hero_rotating_headline_font_size" AS ENUM('h1', 'h2', 'h3', 'h4', 'h5', 'h6');
    CREATE TYPE "public"."enum__site_settings_v_blocks_hero_rotating_headline_font_size" AS ENUM('h1', 'h2', 'h3', 'h4', 'h5', 'h6');

    ALTER TABLE "pages_blocks_hero_headline" ADD COLUMN "font_size" "enum_pages_blocks_hero_headline_font_size" NOT NULL DEFAULT 'h1';
    ALTER TABLE "_pages_v_blocks_hero_headline" ADD COLUMN "font_size" "enum__pages_v_blocks_hero_headline_font_size" NOT NULL DEFAULT 'h1';
    ALTER TABLE "site_settings_blocks_hero_headline" ADD COLUMN "font_size" "enum_site_settings_blocks_hero_headline_font_size" NOT NULL DEFAULT 'h1';
    ALTER TABLE "_site_settings_v_blocks_hero_headline" ADD COLUMN "font_size" "enum__site_settings_v_blocks_hero_headline_font_size" NOT NULL DEFAULT 'h1';

    ALTER TABLE "pages_blocks_hero_rotating_headline" ADD COLUMN "font_size" "enum_pages_blocks_hero_rotating_headline_font_size" NOT NULL DEFAULT 'h1';
    ALTER TABLE "_pages_v_blocks_hero_rotating_headline" ADD COLUMN "font_size" "enum__pages_v_blocks_hero_rotating_headline_font_size" NOT NULL DEFAULT 'h1';
    ALTER TABLE "site_settings_blocks_hero_rotating_headline" ADD COLUMN "font_size" "enum_site_settings_blocks_hero_rotating_headline_font_size" NOT NULL DEFAULT 'h1';
    ALTER TABLE "_site_settings_v_blocks_hero_rotating_headline" ADD COLUMN "font_size" "enum__site_settings_v_blocks_hero_rotating_headline_font_size" NOT NULL DEFAULT 'h1';
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_hero_headline" DROP COLUMN "font_size";
    ALTER TABLE "_pages_v_blocks_hero_headline" DROP COLUMN "font_size";
    ALTER TABLE "site_settings_blocks_hero_headline" DROP COLUMN "font_size";
    ALTER TABLE "_site_settings_v_blocks_hero_headline" DROP COLUMN "font_size";

    ALTER TABLE "pages_blocks_hero_rotating_headline" DROP COLUMN "font_size";
    ALTER TABLE "_pages_v_blocks_hero_rotating_headline" DROP COLUMN "font_size";
    ALTER TABLE "site_settings_blocks_hero_rotating_headline" DROP COLUMN "font_size";
    ALTER TABLE "_site_settings_v_blocks_hero_rotating_headline" DROP COLUMN "font_size";

    DROP TYPE "public"."enum_pages_blocks_hero_headline_font_size";
    DROP TYPE "public"."enum__pages_v_blocks_hero_headline_font_size";
    DROP TYPE "public"."enum_site_settings_blocks_hero_headline_font_size";
    DROP TYPE "public"."enum__site_settings_v_blocks_hero_headline_font_size";

    DROP TYPE "public"."enum_pages_blocks_hero_rotating_headline_font_size";
    DROP TYPE "public"."enum__pages_v_blocks_hero_rotating_headline_font_size";
    DROP TYPE "public"."enum_site_settings_blocks_hero_rotating_headline_font_size";
    DROP TYPE "public"."enum__site_settings_v_blocks_hero_rotating_headline_font_size";
  `)
}
