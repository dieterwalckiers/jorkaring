import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_content_grid_cells_collapsed_lines" AS ENUM('5', '8', '20');
  CREATE TYPE "public"."enum__pages_v_blocks_content_grid_cells_collapsed_lines" AS ENUM('5', '8', '20');
  CREATE TYPE "public"."enum_site_settings_blocks_content_grid_cells_collapsed_lines" AS ENUM('5', '8', '20');
  CREATE TYPE "public"."enum__site_settings_v_blocks_content_grid_cells_collapsed_lines" AS ENUM('5', '8', '20');
  ALTER TABLE "pages_blocks_content_grid_cells" ADD COLUMN "collapsed_lines" "enum_pages_blocks_content_grid_cells_collapsed_lines" DEFAULT '5';
  ALTER TABLE "_pages_v_blocks_content_grid_cells" ADD COLUMN "collapsed_lines" "enum__pages_v_blocks_content_grid_cells_collapsed_lines" DEFAULT '5';
  ALTER TABLE "site_settings_blocks_content_grid_cells" ADD COLUMN "collapsed_lines" "enum_site_settings_blocks_content_grid_cells_collapsed_lines" DEFAULT '5';
  ALTER TABLE "_site_settings_v_blocks_content_grid_cells" ADD COLUMN "collapsed_lines" "enum__site_settings_v_blocks_content_grid_cells_collapsed_lines" DEFAULT '5';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_content_grid_cells" DROP COLUMN "collapsed_lines";
  ALTER TABLE "_pages_v_blocks_content_grid_cells" DROP COLUMN "collapsed_lines";
  ALTER TABLE "site_settings_blocks_content_grid_cells" DROP COLUMN "collapsed_lines";
  ALTER TABLE "_site_settings_v_blocks_content_grid_cells" DROP COLUMN "collapsed_lines";
  DROP TYPE "public"."enum_pages_blocks_content_grid_cells_collapsed_lines";
  DROP TYPE "public"."enum__pages_v_blocks_content_grid_cells_collapsed_lines";
  DROP TYPE "public"."enum_site_settings_blocks_content_grid_cells_collapsed_lines";
  DROP TYPE "public"."enum__site_settings_v_blocks_content_grid_cells_collapsed_lines";`)
}
