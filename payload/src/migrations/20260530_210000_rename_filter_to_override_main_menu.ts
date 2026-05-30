import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Rename the `filterMainMenu` field to `overrideMainMenu` for terminology
// consistency (the toggle overrides the menu, it no longer just filters it).
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages" RENAME COLUMN "filter_main_menu" TO "override_main_menu";
    ALTER TABLE "_pages_v" RENAME COLUMN "version_filter_main_menu" TO "version_override_main_menu";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages" RENAME COLUMN "override_main_menu" TO "filter_main_menu";
    ALTER TABLE "_pages_v" RENAME COLUMN "version_override_main_menu" TO "version_filter_main_menu";
  `)
}
