import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Item 8 — E-book lead-capture flow.
 *
 * Adds the `ebook` group to SiteSettings:
 *   - ebook.enabled        (checkbox)  → site_settings.ebook_enabled
 *   - ebook.tallyFormId    (text)      → site_settings.ebook_tally_form_id
 *   - ebook.buttonCaption  (text)      → site_settings.ebook_button_caption
 *   - ebook.pdf            (upload→media) → relationship row in site_settings_rels (path 'ebook_pdf')
 *
 * The pdf upload is a relationship, so the `media_id` column is added to the
 * existing *_rels tables (they previously only carried `pages_id` from the toast).
 * Scalar columns are mirrored on the versions table `_site_settings_v` with the
 * `version_` prefix, per Payload's drafts schema.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" ADD COLUMN "ebook_enabled" boolean DEFAULT false;
    ALTER TABLE "site_settings" ADD COLUMN "ebook_tally_form_id" varchar;
    ALTER TABLE "site_settings" ADD COLUMN "ebook_pdf_id" integer;
    ALTER TABLE "site_settings" ADD COLUMN "ebook_button_caption" varchar;

    ALTER TABLE "_site_settings_v" ADD COLUMN "version_ebook_enabled" boolean DEFAULT false;
    ALTER TABLE "_site_settings_v" ADD COLUMN "version_ebook_tally_form_id" varchar;
    ALTER TABLE "_site_settings_v" ADD COLUMN "version_ebook_pdf_id" integer;
    ALTER TABLE "_site_settings_v" ADD COLUMN "version_ebook_button_caption" varchar;

    ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_ebook_pdf_id_media_id_fk" FOREIGN KEY ("ebook_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_ebook_pdf_id_media_id_fk" FOREIGN KEY ("version_ebook_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    CREATE INDEX "site_settings_ebook_ebook_pdf_idx" ON "site_settings" USING btree ("ebook_pdf_id");
    CREATE INDEX "_site_settings_v_version_ebook_version_ebook_pdf_idx" ON "_site_settings_v" USING btree ("version_ebook_pdf_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "_site_settings_v_version_ebook_version_ebook_pdf_idx";
    DROP INDEX IF EXISTS "site_settings_ebook_ebook_pdf_idx";

    ALTER TABLE "_site_settings_v" DROP CONSTRAINT IF EXISTS "_site_settings_v_version_ebook_pdf_id_media_id_fk";
    ALTER TABLE "site_settings" DROP CONSTRAINT IF EXISTS "site_settings_ebook_pdf_id_media_id_fk";

    ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_ebook_enabled";
    ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_ebook_tally_form_id";
    ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_ebook_pdf_id";
    ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_ebook_button_caption";

    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "ebook_enabled";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "ebook_tally_form_id";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "ebook_pdf_id";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "ebook_button_caption";
  `)
}
