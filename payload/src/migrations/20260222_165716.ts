import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_rich_text_layout" AS ENUM('full', 'left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_hero_spacer_height" AS ENUM('xs', 'small', 'medium', 'large', 'xl');
  CREATE TYPE "public"."enum_site_settings_blocks_hero_rich_text_layout" AS ENUM('full', 'left', 'right');
  CREATE TYPE "public"."enum_site_settings_blocks_hero_spacer_height" AS ENUM('xs', 'small', 'medium', 'large', 'xl');
  ALTER TYPE "public"."enum_pages_blocks_hero_links_variant" RENAME TO "enum_pages_blocks_hero_cta_links_variant";
  ALTER TYPE "public"."enum_site_settings_blocks_hero_links_variant" RENAME TO "enum_site_settings_blocks_hero_cta_links_variant";
  CREATE TABLE "pages_blocks_hero_headline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_subheadline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb NOT NULL,
  	"layout" "enum_pages_blocks_hero_rich_text_layout" DEFAULT 'full',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"height" "enum_pages_blocks_hero_spacer_height" DEFAULT 'medium' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "site_settings_blocks_hero_headline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "site_settings_blocks_hero_subheadline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "site_settings_blocks_hero_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"layout" "enum_site_settings_blocks_hero_rich_text_layout" DEFAULT 'full',
  	"block_name" varchar
  );
  
  CREATE TABLE "site_settings_blocks_hero_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "site_settings_blocks_hero_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"height" "enum_site_settings_blocks_hero_spacer_height" DEFAULT 'medium',
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_hero_links" RENAME TO "pages_blocks_hero_cta_links";
  ALTER TABLE "site_settings_blocks_hero_links" RENAME TO "site_settings_blocks_hero_cta_links";
  ALTER TABLE "pages_blocks_hero_cta_links" DROP CONSTRAINT "pages_blocks_hero_links_parent_id_fk";
  
  ALTER TABLE "site_settings_blocks_hero_cta_links" DROP CONSTRAINT "site_settings_blocks_hero_links_parent_id_fk";
  
  DROP INDEX "pages_blocks_hero_links_order_idx";
  DROP INDEX "pages_blocks_hero_links_parent_id_idx";
  DROP INDEX "site_settings_blocks_hero_links_order_idx";
  DROP INDEX "site_settings_blocks_hero_links_parent_id_idx";
  ALTER TABLE "pages_blocks_hero_headline" ADD CONSTRAINT "pages_blocks_hero_headline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_subheadline" ADD CONSTRAINT "pages_blocks_hero_subheadline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_rich_text" ADD CONSTRAINT "pages_blocks_hero_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_cta" ADD CONSTRAINT "pages_blocks_hero_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_spacer" ADD CONSTRAINT "pages_blocks_hero_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_hero_headline" ADD CONSTRAINT "site_settings_blocks_hero_headline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_hero_subheadline" ADD CONSTRAINT "site_settings_blocks_hero_subheadline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_hero_rich_text" ADD CONSTRAINT "site_settings_blocks_hero_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_hero_cta" ADD CONSTRAINT "site_settings_blocks_hero_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_hero_spacer" ADD CONSTRAINT "site_settings_blocks_hero_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_headline_order_idx" ON "pages_blocks_hero_headline" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_headline_parent_id_idx" ON "pages_blocks_hero_headline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_headline_path_idx" ON "pages_blocks_hero_headline" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_subheadline_order_idx" ON "pages_blocks_hero_subheadline" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_subheadline_parent_id_idx" ON "pages_blocks_hero_subheadline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_subheadline_path_idx" ON "pages_blocks_hero_subheadline" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_rich_text_order_idx" ON "pages_blocks_hero_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_rich_text_parent_id_idx" ON "pages_blocks_hero_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_rich_text_path_idx" ON "pages_blocks_hero_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_cta_order_idx" ON "pages_blocks_hero_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_cta_parent_id_idx" ON "pages_blocks_hero_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_cta_path_idx" ON "pages_blocks_hero_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_spacer_order_idx" ON "pages_blocks_hero_spacer" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_spacer_parent_id_idx" ON "pages_blocks_hero_spacer" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_spacer_path_idx" ON "pages_blocks_hero_spacer" USING btree ("_path");
  CREATE INDEX "site_settings_blocks_hero_headline_order_idx" ON "site_settings_blocks_hero_headline" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_hero_headline_parent_id_idx" ON "site_settings_blocks_hero_headline" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_hero_headline_path_idx" ON "site_settings_blocks_hero_headline" USING btree ("_path");
  CREATE INDEX "site_settings_blocks_hero_subheadline_order_idx" ON "site_settings_blocks_hero_subheadline" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_hero_subheadline_parent_id_idx" ON "site_settings_blocks_hero_subheadline" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_hero_subheadline_path_idx" ON "site_settings_blocks_hero_subheadline" USING btree ("_path");
  CREATE INDEX "site_settings_blocks_hero_rich_text_order_idx" ON "site_settings_blocks_hero_rich_text" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_hero_rich_text_parent_id_idx" ON "site_settings_blocks_hero_rich_text" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_hero_rich_text_path_idx" ON "site_settings_blocks_hero_rich_text" USING btree ("_path");
  CREATE INDEX "site_settings_blocks_hero_cta_order_idx" ON "site_settings_blocks_hero_cta" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_hero_cta_parent_id_idx" ON "site_settings_blocks_hero_cta" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_hero_cta_path_idx" ON "site_settings_blocks_hero_cta" USING btree ("_path");
  CREATE INDEX "site_settings_blocks_hero_spacer_order_idx" ON "site_settings_blocks_hero_spacer" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_hero_spacer_parent_id_idx" ON "site_settings_blocks_hero_spacer" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_hero_spacer_path_idx" ON "site_settings_blocks_hero_spacer" USING btree ("_path");
  ALTER TABLE "pages_blocks_hero_cta_links" ADD CONSTRAINT "pages_blocks_hero_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_hero_cta_links" ADD CONSTRAINT "site_settings_blocks_hero_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_blocks_hero_cta"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_cta_links_order_idx" ON "pages_blocks_hero_cta_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_cta_links_parent_id_idx" ON "pages_blocks_hero_cta_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_hero_cta_links_order_idx" ON "site_settings_blocks_hero_cta_links" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_hero_cta_links_parent_id_idx" ON "site_settings_blocks_hero_cta_links" USING btree ("_parent_id");
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "headline";
  ALTER TABLE "pages_blocks_hero" DROP COLUMN "subheadline";
  ALTER TABLE "site_settings_blocks_hero" DROP COLUMN "headline";
  ALTER TABLE "site_settings_blocks_hero" DROP COLUMN "subheadline";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_hero_links_variant" AS ENUM('solid', 'outline', 'ghost');
  CREATE TYPE "public"."enum_site_settings_blocks_hero_links_variant" AS ENUM('solid', 'outline', 'ghost');
  CREATE TABLE "pages_blocks_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"variant" "enum_pages_blocks_hero_links_variant" DEFAULT 'solid'
  );
  
  CREATE TABLE "site_settings_blocks_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"variant" "enum_site_settings_blocks_hero_links_variant" DEFAULT 'solid'
  );
  
  DROP TABLE "pages_blocks_hero_headline" CASCADE;
  DROP TABLE "pages_blocks_hero_subheadline" CASCADE;
  DROP TABLE "pages_blocks_hero_rich_text" CASCADE;
  DROP TABLE "pages_blocks_hero_cta_links" CASCADE;
  DROP TABLE "pages_blocks_hero_cta" CASCADE;
  DROP TABLE "pages_blocks_hero_spacer" CASCADE;
  DROP TABLE "site_settings_blocks_hero_headline" CASCADE;
  DROP TABLE "site_settings_blocks_hero_subheadline" CASCADE;
  DROP TABLE "site_settings_blocks_hero_rich_text" CASCADE;
  DROP TABLE "site_settings_blocks_hero_cta_links" CASCADE;
  DROP TABLE "site_settings_blocks_hero_cta" CASCADE;
  DROP TABLE "site_settings_blocks_hero_spacer" CASCADE;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "headline" varchar;
  ALTER TABLE "pages_blocks_hero" ADD COLUMN "subheadline" varchar;
  ALTER TABLE "site_settings_blocks_hero" ADD COLUMN "headline" varchar;
  ALTER TABLE "site_settings_blocks_hero" ADD COLUMN "subheadline" varchar;
  ALTER TABLE "pages_blocks_hero_links" ADD CONSTRAINT "pages_blocks_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_hero_links" ADD CONSTRAINT "site_settings_blocks_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_links_order_idx" ON "pages_blocks_hero_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_links_parent_id_idx" ON "pages_blocks_hero_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_hero_links_order_idx" ON "site_settings_blocks_hero_links" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_hero_links_parent_id_idx" ON "site_settings_blocks_hero_links" USING btree ("_parent_id");
  DROP TYPE "public"."enum_pages_blocks_hero_rich_text_layout";
  DROP TYPE "public"."enum_pages_blocks_hero_cta_links_variant";
  DROP TYPE "public"."enum_pages_blocks_hero_spacer_height";
  DROP TYPE "public"."enum_site_settings_blocks_hero_rich_text_layout";
  DROP TYPE "public"."enum_site_settings_blocks_hero_cta_links_variant";
  DROP TYPE "public"."enum_site_settings_blocks_hero_spacer_height";`)
}
