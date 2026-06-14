import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Item 8 — rework e-book lead capture from Tally to client-side Mailchimp.
 *
 * Tally's autoresponder is a paid feature, so the e-book flow now captures the
 * lead via the project's existing client-side Mailchimp (JSONP) pattern and
 * delivers the PDF by instant in-browser download. The Tally form ID is no
 * longer needed; a Mailchimp classic form action URL takes its place.
 *
 *   DROP ebook.tallyFormId        → site_settings.ebook_tally_form_id
 *   ADD  ebook.mailchimpActionUrl → site_settings.ebook_mailchimp_action_url
 *
 * Mirrored on the versions table `_site_settings_v` with the `version_` prefix.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" ADD COLUMN "ebook_mailchimp_action_url" varchar;
    ALTER TABLE "_site_settings_v" ADD COLUMN "version_ebook_mailchimp_action_url" varchar;

    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "ebook_tally_form_id";
    ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_ebook_tally_form_id";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" ADD COLUMN "ebook_tally_form_id" varchar;
    ALTER TABLE "_site_settings_v" ADD COLUMN "version_ebook_tally_form_id" varchar;

    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "ebook_mailchimp_action_url";
    ALTER TABLE "_site_settings_v" DROP COLUMN IF EXISTS "version_ebook_mailchimp_action_url";
  `)
}
