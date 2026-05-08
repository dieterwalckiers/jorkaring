import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_content_grid_cells_collapsed_lines" ADD VALUE '12' BEFORE '20';
  ALTER TYPE "public"."enum_pages_blocks_content_grid_cells_collapsed_lines" ADD VALUE '16' BEFORE '20';
  ALTER TYPE "public"."enum__pages_v_blocks_content_grid_cells_collapsed_lines" ADD VALUE '12' BEFORE '20';
  ALTER TYPE "public"."enum__pages_v_blocks_content_grid_cells_collapsed_lines" ADD VALUE '16' BEFORE '20';
  ALTER TYPE "public"."enum_site_settings_blocks_content_grid_cells_collapsed_lines" ADD VALUE '12' BEFORE '20';
  ALTER TYPE "public"."enum_site_settings_blocks_content_grid_cells_collapsed_lines" ADD VALUE '16' BEFORE '20';
  ALTER TYPE "public"."enum__site_settings_v_blocks_content_grid_cells_collapsed_lines" ADD VALUE '12' BEFORE '20';
  ALTER TYPE "public"."enum__site_settings_v_blocks_content_grid_cells_collapsed_lines" ADD VALUE '16' BEFORE '20';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_content_grid_cells" ALTER COLUMN "collapsed_lines" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_content_grid_cells" ALTER COLUMN "collapsed_lines" SET DEFAULT '5'::text;
  DROP TYPE "public"."enum_pages_blocks_content_grid_cells_collapsed_lines";
  CREATE TYPE "public"."enum_pages_blocks_content_grid_cells_collapsed_lines" AS ENUM('5', '8', '20');
  ALTER TABLE "pages_blocks_content_grid_cells" ALTER COLUMN "collapsed_lines" SET DEFAULT '5'::"public"."enum_pages_blocks_content_grid_cells_collapsed_lines";
  ALTER TABLE "pages_blocks_content_grid_cells" ALTER COLUMN "collapsed_lines" SET DATA TYPE "public"."enum_pages_blocks_content_grid_cells_collapsed_lines" USING "collapsed_lines"::"public"."enum_pages_blocks_content_grid_cells_collapsed_lines";
  ALTER TABLE "_pages_v_blocks_content_grid_cells" ALTER COLUMN "collapsed_lines" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_content_grid_cells" ALTER COLUMN "collapsed_lines" SET DEFAULT '5'::text;
  DROP TYPE "public"."enum__pages_v_blocks_content_grid_cells_collapsed_lines";
  CREATE TYPE "public"."enum__pages_v_blocks_content_grid_cells_collapsed_lines" AS ENUM('5', '8', '20');
  ALTER TABLE "_pages_v_blocks_content_grid_cells" ALTER COLUMN "collapsed_lines" SET DEFAULT '5'::"public"."enum__pages_v_blocks_content_grid_cells_collapsed_lines";
  ALTER TABLE "_pages_v_blocks_content_grid_cells" ALTER COLUMN "collapsed_lines" SET DATA TYPE "public"."enum__pages_v_blocks_content_grid_cells_collapsed_lines" USING "collapsed_lines"::"public"."enum__pages_v_blocks_content_grid_cells_collapsed_lines";
  ALTER TABLE "site_settings_blocks_content_grid_cells" ALTER COLUMN "collapsed_lines" SET DATA TYPE text;
  ALTER TABLE "site_settings_blocks_content_grid_cells" ALTER COLUMN "collapsed_lines" SET DEFAULT '5'::text;
  DROP TYPE "public"."enum_site_settings_blocks_content_grid_cells_collapsed_lines";
  CREATE TYPE "public"."enum_site_settings_blocks_content_grid_cells_collapsed_lines" AS ENUM('5', '8', '20');
  ALTER TABLE "site_settings_blocks_content_grid_cells" ALTER COLUMN "collapsed_lines" SET DEFAULT '5'::"public"."enum_site_settings_blocks_content_grid_cells_collapsed_lines";
  ALTER TABLE "site_settings_blocks_content_grid_cells" ALTER COLUMN "collapsed_lines" SET DATA TYPE "public"."enum_site_settings_blocks_content_grid_cells_collapsed_lines" USING "collapsed_lines"::"public"."enum_site_settings_blocks_content_grid_cells_collapsed_lines";
  ALTER TABLE "_site_settings_v_blocks_content_grid_cells" ALTER COLUMN "collapsed_lines" SET DATA TYPE text;
  ALTER TABLE "_site_settings_v_blocks_content_grid_cells" ALTER COLUMN "collapsed_lines" SET DEFAULT '5'::text;
  DROP TYPE "public"."enum__site_settings_v_blocks_content_grid_cells_collapsed_lines";
  CREATE TYPE "public"."enum__site_settings_v_blocks_content_grid_cells_collapsed_lines" AS ENUM('5', '8', '20');
  ALTER TABLE "_site_settings_v_blocks_content_grid_cells" ALTER COLUMN "collapsed_lines" SET DEFAULT '5'::"public"."enum__site_settings_v_blocks_content_grid_cells_collapsed_lines";
  ALTER TABLE "_site_settings_v_blocks_content_grid_cells" ALTER COLUMN "collapsed_lines" SET DATA TYPE "public"."enum__site_settings_v_blocks_content_grid_cells_collapsed_lines" USING "collapsed_lines"::"public"."enum__site_settings_v_blocks_content_grid_cells_collapsed_lines";`)
}
