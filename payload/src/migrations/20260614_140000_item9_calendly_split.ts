import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Item 9 — Calendly page split layout.
 *
 * Adds an optional text column to the CalendlyEmbed block:
 *  - `text`            jsonb   (nullable) — lexical richtext for the text column
 *  - `text_position`   enum    'left' | 'right', default 'left'
 *  - `text_percentage` numeric (nullable) — width of the text column
 *
 * The CalendlyEmbed block is only registered in `pages` (not SiteSettings), so
 * only two tables are touched: `pages_blocks_calendly_embed` and its version
 * copy `_pages_v_blocks_calendly_embed`. Backward-compatible: existing embeds
 * keep `text` NULL and render embed-only.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_pages_blocks_calendly_embed_text_position" AS ENUM('left', 'right');
    CREATE TYPE "public"."enum__pages_v_blocks_calendly_embed_text_position" AS ENUM('left', 'right');

    ALTER TABLE "pages_blocks_calendly_embed" ADD COLUMN "text" jsonb;
    ALTER TABLE "pages_blocks_calendly_embed" ADD COLUMN "text_position" "enum_pages_blocks_calendly_embed_text_position" DEFAULT 'left';
    ALTER TABLE "pages_blocks_calendly_embed" ADD COLUMN "text_percentage" numeric DEFAULT 45;

    ALTER TABLE "_pages_v_blocks_calendly_embed" ADD COLUMN "text" jsonb;
    ALTER TABLE "_pages_v_blocks_calendly_embed" ADD COLUMN "text_position" "enum__pages_v_blocks_calendly_embed_text_position" DEFAULT 'left';
    ALTER TABLE "_pages_v_blocks_calendly_embed" ADD COLUMN "text_percentage" numeric DEFAULT 45;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_calendly_embed" DROP COLUMN "text";
    ALTER TABLE "pages_blocks_calendly_embed" DROP COLUMN "text_position";
    ALTER TABLE "pages_blocks_calendly_embed" DROP COLUMN "text_percentage";

    ALTER TABLE "_pages_v_blocks_calendly_embed" DROP COLUMN "text";
    ALTER TABLE "_pages_v_blocks_calendly_embed" DROP COLUMN "text_position";
    ALTER TABLE "_pages_v_blocks_calendly_embed" DROP COLUMN "text_percentage";

    DROP TYPE "public"."enum_pages_blocks_calendly_embed_text_position";
    DROP TYPE "public"."enum__pages_v_blocks_calendly_embed_text_position";
  `)
}
