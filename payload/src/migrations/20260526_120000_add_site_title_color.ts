import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" ADD COLUMN "title_color" varchar DEFAULT 'theme1';
    ALTER TABLE "_site_settings_v" ADD COLUMN "version_title_color" varchar DEFAULT 'theme1';
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" DROP COLUMN "title_color";
    ALTER TABLE "_site_settings_v" DROP COLUMN "version_title_color";
  `)
}
