import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_pages_blocks_content_grid_cells_element_type" AS ENUM('richText', 'counter');
    CREATE TYPE "public"."enum__pages_v_blocks_content_grid_cells_element_type" AS ENUM('richText', 'counter');
    CREATE TYPE "public"."enum_site_settings_blocks_content_grid_cells_element_type" AS ENUM('richText', 'counter');
    CREATE TYPE "public"."enum__site_settings_v_blocks_content_grid_cells_element_type" AS ENUM('richText', 'counter');

    ALTER TABLE "pages_blocks_content_grid_cells" ADD COLUMN "element_type" "enum_pages_blocks_content_grid_cells_element_type" DEFAULT 'richText';
    ALTER TABLE "pages_blocks_content_grid_cells" ADD COLUMN "counter_value" numeric DEFAULT 0;
    ALTER TABLE "pages_blocks_content_grid_cells" ADD COLUMN "counter_infinite" boolean DEFAULT false;
    ALTER TABLE "pages_blocks_content_grid_cells" ADD COLUMN "counter_show_plus" boolean DEFAULT false;
    ALTER TABLE "pages_blocks_content_grid_cells" ADD COLUMN "counter_label" varchar;
    ALTER TABLE "pages_blocks_content_grid_cells" ADD COLUMN "counter_color" varchar DEFAULT 'theme1';

    ALTER TABLE "_pages_v_blocks_content_grid_cells" ADD COLUMN "element_type" "enum__pages_v_blocks_content_grid_cells_element_type" DEFAULT 'richText';
    ALTER TABLE "_pages_v_blocks_content_grid_cells" ADD COLUMN "counter_value" numeric DEFAULT 0;
    ALTER TABLE "_pages_v_blocks_content_grid_cells" ADD COLUMN "counter_infinite" boolean DEFAULT false;
    ALTER TABLE "_pages_v_blocks_content_grid_cells" ADD COLUMN "counter_show_plus" boolean DEFAULT false;
    ALTER TABLE "_pages_v_blocks_content_grid_cells" ADD COLUMN "counter_label" varchar;
    ALTER TABLE "_pages_v_blocks_content_grid_cells" ADD COLUMN "counter_color" varchar DEFAULT 'theme1';

    ALTER TABLE "site_settings_blocks_content_grid_cells" ADD COLUMN "element_type" "enum_site_settings_blocks_content_grid_cells_element_type" DEFAULT 'richText';
    ALTER TABLE "site_settings_blocks_content_grid_cells" ADD COLUMN "counter_value" numeric DEFAULT 0;
    ALTER TABLE "site_settings_blocks_content_grid_cells" ADD COLUMN "counter_infinite" boolean DEFAULT false;
    ALTER TABLE "site_settings_blocks_content_grid_cells" ADD COLUMN "counter_show_plus" boolean DEFAULT false;
    ALTER TABLE "site_settings_blocks_content_grid_cells" ADD COLUMN "counter_label" varchar;
    ALTER TABLE "site_settings_blocks_content_grid_cells" ADD COLUMN "counter_color" varchar DEFAULT 'theme1';

    ALTER TABLE "_site_settings_v_blocks_content_grid_cells" ADD COLUMN "element_type" "enum__site_settings_v_blocks_content_grid_cells_element_type" DEFAULT 'richText';
    ALTER TABLE "_site_settings_v_blocks_content_grid_cells" ADD COLUMN "counter_value" numeric DEFAULT 0;
    ALTER TABLE "_site_settings_v_blocks_content_grid_cells" ADD COLUMN "counter_infinite" boolean DEFAULT false;
    ALTER TABLE "_site_settings_v_blocks_content_grid_cells" ADD COLUMN "counter_show_plus" boolean DEFAULT false;
    ALTER TABLE "_site_settings_v_blocks_content_grid_cells" ADD COLUMN "counter_label" varchar;
    ALTER TABLE "_site_settings_v_blocks_content_grid_cells" ADD COLUMN "counter_color" varchar DEFAULT 'theme1';
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_content_grid_cells" DROP COLUMN "element_type";
    ALTER TABLE "pages_blocks_content_grid_cells" DROP COLUMN "counter_value";
    ALTER TABLE "pages_blocks_content_grid_cells" DROP COLUMN "counter_infinite";
    ALTER TABLE "pages_blocks_content_grid_cells" DROP COLUMN "counter_show_plus";
    ALTER TABLE "pages_blocks_content_grid_cells" DROP COLUMN "counter_label";
    ALTER TABLE "pages_blocks_content_grid_cells" DROP COLUMN "counter_color";

    ALTER TABLE "_pages_v_blocks_content_grid_cells" DROP COLUMN "element_type";
    ALTER TABLE "_pages_v_blocks_content_grid_cells" DROP COLUMN "counter_value";
    ALTER TABLE "_pages_v_blocks_content_grid_cells" DROP COLUMN "counter_infinite";
    ALTER TABLE "_pages_v_blocks_content_grid_cells" DROP COLUMN "counter_show_plus";
    ALTER TABLE "_pages_v_blocks_content_grid_cells" DROP COLUMN "counter_label";
    ALTER TABLE "_pages_v_blocks_content_grid_cells" DROP COLUMN "counter_color";

    ALTER TABLE "site_settings_blocks_content_grid_cells" DROP COLUMN "element_type";
    ALTER TABLE "site_settings_blocks_content_grid_cells" DROP COLUMN "counter_value";
    ALTER TABLE "site_settings_blocks_content_grid_cells" DROP COLUMN "counter_infinite";
    ALTER TABLE "site_settings_blocks_content_grid_cells" DROP COLUMN "counter_show_plus";
    ALTER TABLE "site_settings_blocks_content_grid_cells" DROP COLUMN "counter_label";
    ALTER TABLE "site_settings_blocks_content_grid_cells" DROP COLUMN "counter_color";

    ALTER TABLE "_site_settings_v_blocks_content_grid_cells" DROP COLUMN "element_type";
    ALTER TABLE "_site_settings_v_blocks_content_grid_cells" DROP COLUMN "counter_value";
    ALTER TABLE "_site_settings_v_blocks_content_grid_cells" DROP COLUMN "counter_infinite";
    ALTER TABLE "_site_settings_v_blocks_content_grid_cells" DROP COLUMN "counter_show_plus";
    ALTER TABLE "_site_settings_v_blocks_content_grid_cells" DROP COLUMN "counter_label";
    ALTER TABLE "_site_settings_v_blocks_content_grid_cells" DROP COLUMN "counter_color";

    DROP TYPE "public"."enum_pages_blocks_content_grid_cells_element_type";
    DROP TYPE "public"."enum__pages_v_blocks_content_grid_cells_element_type";
    DROP TYPE "public"."enum_site_settings_blocks_content_grid_cells_element_type";
    DROP TYPE "public"."enum__site_settings_v_blocks_content_grid_cells_element_type";
  `)
}
