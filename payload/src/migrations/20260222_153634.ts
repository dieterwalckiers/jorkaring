import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_logo_marquee_logo_size" AS ENUM('small', 'medium', 'large');
  CREATE TYPE "public"."enum_pages_blocks_logo_marquee_speed" AS ENUM('slow', 'medium', 'fast');
  CREATE TABLE "pages_blocks_logo_marquee_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"alt" varchar
  );
  
  CREATE TABLE "pages_blocks_logo_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_size" "enum_pages_blocks_logo_marquee_logo_size" DEFAULT 'medium',
  	"speed" "enum_pages_blocks_logo_marquee_speed" DEFAULT 'medium',
  	"pause_on_hover" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_logo_marquee_logos" ADD CONSTRAINT "pages_blocks_logo_marquee_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_marquee_logos" ADD CONSTRAINT "pages_blocks_logo_marquee_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_logo_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_logo_marquee" ADD CONSTRAINT "pages_blocks_logo_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_logo_marquee_logos_order_idx" ON "pages_blocks_logo_marquee_logos" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_marquee_logos_parent_id_idx" ON "pages_blocks_logo_marquee_logos" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_marquee_logos_image_idx" ON "pages_blocks_logo_marquee_logos" USING btree ("image_id");
  CREATE INDEX "pages_blocks_logo_marquee_order_idx" ON "pages_blocks_logo_marquee" USING btree ("_order");
  CREATE INDEX "pages_blocks_logo_marquee_parent_id_idx" ON "pages_blocks_logo_marquee" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_logo_marquee_path_idx" ON "pages_blocks_logo_marquee" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_logo_marquee_logos" CASCADE;
  DROP TABLE "pages_blocks_logo_marquee" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_logo_marquee_logo_size";
  DROP TYPE "public"."enum_pages_blocks_logo_marquee_speed";`)
}
