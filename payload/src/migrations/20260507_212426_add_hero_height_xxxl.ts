import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_pages_blocks_hero_height" ADD VALUE IF NOT EXISTS 'xxxl';
    ALTER TYPE "public"."enum_site_settings_blocks_hero_height" ADD VALUE IF NOT EXISTS 'xxxl';
    ALTER TYPE "public"."enum__pages_v_blocks_hero_height" ADD VALUE IF NOT EXISTS 'xxxl';
    ALTER TYPE "public"."enum__site_settings_v_blocks_hero_height" ADD VALUE IF NOT EXISTS 'xxxl';
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Postgres has no DROP VALUE; recreate each enum without 'xxxl' and re-point columns.
  await db.execute(sql`
    UPDATE "pages_blocks_hero" SET "height" = 'xxl' WHERE "height" = 'xxxl';
    UPDATE "site_settings_blocks_hero" SET "height" = 'xxl' WHERE "height" = 'xxxl';
    UPDATE "_pages_v_blocks_hero" SET "height" = 'xxl' WHERE "height" = 'xxxl';
    UPDATE "_site_settings_v_blocks_hero" SET "height" = 'xxl' WHERE "height" = 'xxxl';

    ALTER TYPE "public"."enum_pages_blocks_hero_height" RENAME TO "enum_pages_blocks_hero_height__old";
    CREATE TYPE "public"."enum_pages_blocks_hero_height" AS ENUM('small', 'medium', 'large', 'xl', 'xxl');
    ALTER TABLE "pages_blocks_hero" ALTER COLUMN "height" DROP DEFAULT;
    ALTER TABLE "pages_blocks_hero" ALTER COLUMN "height" TYPE "public"."enum_pages_blocks_hero_height" USING "height"::text::"public"."enum_pages_blocks_hero_height";
    ALTER TABLE "pages_blocks_hero" ALTER COLUMN "height" SET DEFAULT 'medium';
    DROP TYPE "public"."enum_pages_blocks_hero_height__old";

    ALTER TYPE "public"."enum_site_settings_blocks_hero_height" RENAME TO "enum_site_settings_blocks_hero_height__old";
    CREATE TYPE "public"."enum_site_settings_blocks_hero_height" AS ENUM('small', 'medium', 'large', 'xl', 'xxl');
    ALTER TABLE "site_settings_blocks_hero" ALTER COLUMN "height" DROP DEFAULT;
    ALTER TABLE "site_settings_blocks_hero" ALTER COLUMN "height" TYPE "public"."enum_site_settings_blocks_hero_height" USING "height"::text::"public"."enum_site_settings_blocks_hero_height";
    ALTER TABLE "site_settings_blocks_hero" ALTER COLUMN "height" SET DEFAULT 'medium';
    DROP TYPE "public"."enum_site_settings_blocks_hero_height__old";

    ALTER TYPE "public"."enum__pages_v_blocks_hero_height" RENAME TO "enum__pages_v_blocks_hero_height__old";
    CREATE TYPE "public"."enum__pages_v_blocks_hero_height" AS ENUM('small', 'medium', 'large', 'xl', 'xxl');
    ALTER TABLE "_pages_v_blocks_hero" ALTER COLUMN "height" DROP DEFAULT;
    ALTER TABLE "_pages_v_blocks_hero" ALTER COLUMN "height" TYPE "public"."enum__pages_v_blocks_hero_height" USING "height"::text::"public"."enum__pages_v_blocks_hero_height";
    ALTER TABLE "_pages_v_blocks_hero" ALTER COLUMN "height" SET DEFAULT 'medium';
    DROP TYPE "public"."enum__pages_v_blocks_hero_height__old";

    ALTER TYPE "public"."enum__site_settings_v_blocks_hero_height" RENAME TO "enum__site_settings_v_blocks_hero_height__old";
    CREATE TYPE "public"."enum__site_settings_v_blocks_hero_height" AS ENUM('small', 'medium', 'large', 'xl', 'xxl');
    ALTER TABLE "_site_settings_v_blocks_hero" ALTER COLUMN "height" DROP DEFAULT;
    ALTER TABLE "_site_settings_v_blocks_hero" ALTER COLUMN "height" TYPE "public"."enum__site_settings_v_blocks_hero_height" USING "height"::text::"public"."enum__site_settings_v_blocks_hero_height";
    ALTER TABLE "_site_settings_v_blocks_hero" ALTER COLUMN "height" SET DEFAULT 'medium';
    DROP TYPE "public"."enum__site_settings_v_blocks_hero_height__old";
  `)
}
