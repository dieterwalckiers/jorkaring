import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_rich_text_variant" AS ENUM('body', 'hero', 'longForm');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_variant" AS ENUM('body', 'hero', 'longForm');
  CREATE TYPE "public"."enum_site_settings_blocks_rich_text_variant" AS ENUM('body', 'hero', 'longForm');
  CREATE TYPE "public"."enum__site_settings_v_blocks_rich_text_variant" AS ENUM('body', 'hero', 'longForm');
  ALTER TABLE "pages_blocks_content_grid" ADD COLUMN "editorial_numbers" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_rich_text" ADD COLUMN "variant" "enum_pages_blocks_rich_text_variant" DEFAULT 'body';
  ALTER TABLE "_pages_v_blocks_content_grid" ADD COLUMN "editorial_numbers" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD COLUMN "variant" "enum__pages_v_blocks_rich_text_variant" DEFAULT 'body';
  ALTER TABLE "site_settings_blocks_content_grid" ADD COLUMN "editorial_numbers" boolean DEFAULT false;
  ALTER TABLE "site_settings_blocks_rich_text" ADD COLUMN "variant" "enum_site_settings_blocks_rich_text_variant" DEFAULT 'body';
  ALTER TABLE "_site_settings_v_blocks_content_grid" ADD COLUMN "editorial_numbers" boolean DEFAULT false;
  ALTER TABLE "_site_settings_v_blocks_rich_text" ADD COLUMN "variant" "enum__site_settings_v_blocks_rich_text_variant" DEFAULT 'body';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_content_grid" DROP COLUMN "editorial_numbers";
  ALTER TABLE "pages_blocks_rich_text" DROP COLUMN "variant";
  ALTER TABLE "_pages_v_blocks_content_grid" DROP COLUMN "editorial_numbers";
  ALTER TABLE "_pages_v_blocks_rich_text" DROP COLUMN "variant";
  ALTER TABLE "site_settings_blocks_content_grid" DROP COLUMN "editorial_numbers";
  ALTER TABLE "site_settings_blocks_rich_text" DROP COLUMN "variant";
  ALTER TABLE "_site_settings_v_blocks_content_grid" DROP COLUMN "editorial_numbers";
  ALTER TABLE "_site_settings_v_blocks_rich_text" DROP COLUMN "variant";
  DROP TYPE "public"."enum_pages_blocks_rich_text_variant";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_variant";
  DROP TYPE "public"."enum_site_settings_blocks_rich_text_variant";
  DROP TYPE "public"."enum__site_settings_v_blocks_rich_text_variant";`)
}
