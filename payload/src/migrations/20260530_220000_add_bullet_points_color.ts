import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "theme_colors_bullet_points" varchar DEFAULT '#373031';
    ALTER TABLE "_site_settings_v" ADD COLUMN IF NOT EXISTS "version_theme_colors_bullet_points" varchar DEFAULT '#373031';
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "theme_colors_bullet_points";
    ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_theme_colors_bullet_points";
  `)
}
