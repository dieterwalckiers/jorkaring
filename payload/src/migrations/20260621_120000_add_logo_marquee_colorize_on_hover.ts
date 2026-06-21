import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_logo_marquee" ADD COLUMN "colorize_on_hover" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_logo_marquee" ADD COLUMN "colorize_on_hover" boolean DEFAULT true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_logo_marquee" DROP COLUMN "colorize_on_hover";
  ALTER TABLE "_pages_v_blocks_logo_marquee" DROP COLUMN "colorize_on_hover";`)
}
