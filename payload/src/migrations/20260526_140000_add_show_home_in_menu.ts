import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" ADD COLUMN "styling_show_home_in_menu" boolean DEFAULT false;
    ALTER TABLE "_site_settings_v" ADD COLUMN "version_styling_show_home_in_menu" boolean DEFAULT false;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" DROP COLUMN "styling_show_home_in_menu";
    ALTER TABLE "_site_settings_v" DROP COLUMN "version_styling_show_home_in_menu";
  `)
}
