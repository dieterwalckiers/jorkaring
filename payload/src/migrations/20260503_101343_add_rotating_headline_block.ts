import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_rotating_headline_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_rotating_headline_alignment" AS ENUM('left', 'center', 'right');
  CREATE TABLE "pages_blocks_rotating_headline_rotating_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"word" varchar
  );
  
  CREATE TABLE "pages_blocks_rotating_headline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"prefix" varchar,
  	"suffix" varchar,
  	"alignment" "enum_pages_blocks_rotating_headline_alignment" DEFAULT 'center',
  	"interval_ms" numeric DEFAULT 2400,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rotating_headline_rotating_words" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"word" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rotating_headline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"prefix" varchar,
  	"suffix" varchar,
  	"alignment" "enum__pages_v_blocks_rotating_headline_alignment" DEFAULT 'center',
  	"interval_ms" numeric DEFAULT 2400,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_rotating_headline_rotating_words" ADD CONSTRAINT "pages_blocks_rotating_headline_rotating_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rotating_headline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rotating_headline" ADD CONSTRAINT "pages_blocks_rotating_headline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rotating_headline_rotating_words" ADD CONSTRAINT "_pages_v_blocks_rotating_headline_rotating_words_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_rotating_headline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rotating_headline" ADD CONSTRAINT "_pages_v_blocks_rotating_headline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_rotating_headline_rotating_words_order_idx" ON "pages_blocks_rotating_headline_rotating_words" USING btree ("_order");
  CREATE INDEX "pages_blocks_rotating_headline_rotating_words_parent_id_idx" ON "pages_blocks_rotating_headline_rotating_words" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rotating_headline_order_idx" ON "pages_blocks_rotating_headline" USING btree ("_order");
  CREATE INDEX "pages_blocks_rotating_headline_parent_id_idx" ON "pages_blocks_rotating_headline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rotating_headline_path_idx" ON "pages_blocks_rotating_headline" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_rotating_headline_rotating_words_order_idx" ON "_pages_v_blocks_rotating_headline_rotating_words" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rotating_headline_rotating_words_parent_id_idx" ON "_pages_v_blocks_rotating_headline_rotating_words" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rotating_headline_order_idx" ON "_pages_v_blocks_rotating_headline" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rotating_headline_parent_id_idx" ON "_pages_v_blocks_rotating_headline" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rotating_headline_path_idx" ON "_pages_v_blocks_rotating_headline" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_rotating_headline_rotating_words" CASCADE;
  DROP TABLE "pages_blocks_rotating_headline" CASCADE;
  DROP TABLE "_pages_v_blocks_rotating_headline_rotating_words" CASCADE;
  DROP TABLE "_pages_v_blocks_rotating_headline" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_rotating_headline_alignment";
  DROP TYPE "public"."enum__pages_v_blocks_rotating_headline_alignment";`)
}
