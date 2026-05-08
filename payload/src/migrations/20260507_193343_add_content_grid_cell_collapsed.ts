import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_content_grid_cells" ADD COLUMN "collapsed_by_default" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_content_grid_cells" ADD COLUMN "collapsed_by_default" boolean DEFAULT false;
  ALTER TABLE "site_settings_blocks_content_grid_cells" ADD COLUMN "collapsed_by_default" boolean DEFAULT false;
  ALTER TABLE "_site_settings_v_blocks_content_grid_cells" ADD COLUMN "collapsed_by_default" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_content_grid_cells" DROP COLUMN "collapsed_by_default";
  ALTER TABLE "_pages_v_blocks_content_grid_cells" DROP COLUMN "collapsed_by_default";
  ALTER TABLE "site_settings_blocks_content_grid_cells" DROP COLUMN "collapsed_by_default";
  ALTER TABLE "_site_settings_v_blocks_content_grid_cells" DROP COLUMN "collapsed_by_default";`)
}
