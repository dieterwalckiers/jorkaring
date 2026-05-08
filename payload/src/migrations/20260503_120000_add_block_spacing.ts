import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_styling_block_spacing" AS ENUM('tight', 'narrower', 'default', 'wider', 'spacious');
  CREATE TYPE "public"."enum__site_settings_v_version_styling_block_spacing" AS ENUM('tight', 'narrower', 'default', 'wider', 'spacious');
  ALTER TABLE "site_settings" ADD COLUMN "styling_block_spacing" "enum_site_settings_styling_block_spacing" DEFAULT 'default';
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_styling_block_spacing" "enum__site_settings_v_version_styling_block_spacing" DEFAULT 'default';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "styling_block_spacing";
  ALTER TABLE "_site_settings_v" DROP COLUMN "version_styling_block_spacing";
  DROP TYPE "public"."enum_site_settings_styling_block_spacing";
  DROP TYPE "public"."enum__site_settings_v_version_styling_block_spacing";`)
}
