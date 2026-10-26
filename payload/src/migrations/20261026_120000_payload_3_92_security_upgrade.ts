import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Payload 3.90 schema additions:
// - users.reset_password_requested_at: forgot-password throttling on auth collections
// - media._objectkey: per-upload storage folder, added by @payloadcms/storage-s3 when S3 is
//   enabled (production). Added unconditionally so local and prod schemas stay in sync.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_password_requested_at" timestamp(3) with time zone;
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "_objectkey" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP COLUMN IF EXISTS "reset_password_requested_at";
  ALTER TABLE "media" DROP COLUMN IF EXISTS "_objectkey";`)
}
