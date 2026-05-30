import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "enum_site_settings_toast_position" AS ENUM('bottomRight', 'bottomLeft', 'topRight', 'topLeft');
    CREATE TYPE "enum_site_settings_toast_page_visibility" AS ENUM('all', 'specific');
    CREATE TYPE "enum__site_settings_v_version_toast_position" AS ENUM('bottomRight', 'bottomLeft', 'topRight', 'topLeft');
    CREATE TYPE "enum__site_settings_v_version_toast_page_visibility" AS ENUM('all', 'specific');

    ALTER TABLE "site_settings" ADD COLUMN "toast_enabled" boolean DEFAULT false;
    ALTER TABLE "site_settings" ADD COLUMN "toast_content" jsonb;
    ALTER TABLE "site_settings" ADD COLUMN "toast_background_color" varchar DEFAULT 'theme1';
    ALTER TABLE "site_settings" ADD COLUMN "toast_position" "enum_site_settings_toast_position" DEFAULT 'bottomRight';
    ALTER TABLE "site_settings" ADD COLUMN "toast_display_delay_seconds" numeric DEFAULT 0;
    ALTER TABLE "site_settings" ADD COLUMN "toast_dismissible" boolean DEFAULT true;
    ALTER TABLE "site_settings" ADD COLUMN "toast_auto_dismiss_seconds" numeric DEFAULT 0;
    ALTER TABLE "site_settings" ADD COLUMN "toast_remember_dismissal" boolean DEFAULT true;
    ALTER TABLE "site_settings" ADD COLUMN "toast_dismissal_key" varchar DEFAULT 'toast-1';
    ALTER TABLE "site_settings" ADD COLUMN "toast_page_visibility" "enum_site_settings_toast_page_visibility" DEFAULT 'all';
    ALTER TABLE "site_settings" ADD COLUMN "toast_start_date" timestamp(3) with time zone;
    ALTER TABLE "site_settings" ADD COLUMN "toast_end_date" timestamp(3) with time zone;

    ALTER TABLE "_site_settings_v" ADD COLUMN "version_toast_enabled" boolean DEFAULT false;
    ALTER TABLE "_site_settings_v" ADD COLUMN "version_toast_content" jsonb;
    ALTER TABLE "_site_settings_v" ADD COLUMN "version_toast_background_color" varchar DEFAULT 'theme1';
    ALTER TABLE "_site_settings_v" ADD COLUMN "version_toast_position" "enum__site_settings_v_version_toast_position" DEFAULT 'bottomRight';
    ALTER TABLE "_site_settings_v" ADD COLUMN "version_toast_display_delay_seconds" numeric DEFAULT 0;
    ALTER TABLE "_site_settings_v" ADD COLUMN "version_toast_dismissible" boolean DEFAULT true;
    ALTER TABLE "_site_settings_v" ADD COLUMN "version_toast_auto_dismiss_seconds" numeric DEFAULT 0;
    ALTER TABLE "_site_settings_v" ADD COLUMN "version_toast_remember_dismissal" boolean DEFAULT true;
    ALTER TABLE "_site_settings_v" ADD COLUMN "version_toast_dismissal_key" varchar DEFAULT 'toast-1';
    ALTER TABLE "_site_settings_v" ADD COLUMN "version_toast_page_visibility" "enum__site_settings_v_version_toast_page_visibility" DEFAULT 'all';
    ALTER TABLE "_site_settings_v" ADD COLUMN "version_toast_start_date" timestamp(3) with time zone;
    ALTER TABLE "_site_settings_v" ADD COLUMN "version_toast_end_date" timestamp(3) with time zone;

    CREATE TABLE "site_settings_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "pages_id" integer
    );

    ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "site_settings_rels" ADD CONSTRAINT "site_settings_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "site_settings_rels_order_idx" ON "site_settings_rels" USING btree ("order");
    CREATE INDEX "site_settings_rels_parent_idx" ON "site_settings_rels" USING btree ("parent_id");
    CREATE INDEX "site_settings_rels_path_idx" ON "site_settings_rels" USING btree ("path");
    CREATE INDEX "site_settings_rels_pages_id_idx" ON "site_settings_rels" USING btree ("pages_id");

    CREATE TABLE "_site_settings_v_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "pages_id" integer
    );

    ALTER TABLE "_site_settings_v_rels" ADD CONSTRAINT "_site_settings_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "_site_settings_v_rels" ADD CONSTRAINT "_site_settings_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "_site_settings_v_rels_order_idx" ON "_site_settings_v_rels" USING btree ("order");
    CREATE INDEX "_site_settings_v_rels_parent_idx" ON "_site_settings_v_rels" USING btree ("parent_id");
    CREATE INDEX "_site_settings_v_rels_path_idx" ON "_site_settings_v_rels" USING btree ("path");
    CREATE INDEX "_site_settings_v_rels_pages_id_idx" ON "_site_settings_v_rels" USING btree ("pages_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE "_site_settings_v_rels" CASCADE;
    DROP TABLE "site_settings_rels" CASCADE;

    ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_toast_enabled";
    ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_toast_content";
    ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_toast_background_color";
    ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_toast_position";
    ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_toast_display_delay_seconds";
    ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_toast_dismissible";
    ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_toast_auto_dismiss_seconds";
    ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_toast_remember_dismissal";
    ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_toast_dismissal_key";
    ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_toast_page_visibility";
    ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_toast_start_date";
    ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_toast_end_date";

    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "toast_enabled";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "toast_content";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "toast_background_color";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "toast_position";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "toast_display_delay_seconds";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "toast_dismissible";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "toast_auto_dismiss_seconds";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "toast_remember_dismissal";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "toast_dismissal_key";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "toast_page_visibility";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "toast_start_date";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "toast_end_date";

    DROP TYPE "enum__site_settings_v_version_toast_page_visibility";
    DROP TYPE "enum__site_settings_v_version_toast_position";
    DROP TYPE "enum_site_settings_toast_page_visibility";
    DROP TYPE "enum_site_settings_toast_position";
  `)
}
