import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_blocks_content_grid_number_of_columns" AS ENUM('2', '3', '4', '5');
  CREATE TYPE "public"."enum_site_settings_blocks_content_grid_horizontal_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_site_settings_blocks_content_grid_vertical_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum_site_settings_blocks_hero_links_variant" AS ENUM('solid', 'outline', 'ghost');
  CREATE TYPE "public"."enum_site_settings_blocks_hero_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum_site_settings_blocks_hero_height" AS ENUM('small', 'medium', 'large', 'xl', 'xxl');
  CREATE TYPE "public"."enum_site_settings_blocks_rich_text_width" AS ENUM('1/4', '1/3', 'half', '2/3', '3/4', 'full');
  CREATE TYPE "public"."enum_site_settings_blocks_rich_text_margin" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_site_settings_blocks_spacer_height" AS ENUM('xxxs', 'xxs', 'xs', 'small', 'medium', 'large', 'xl', 'xxl', 'xxxl');
  CREATE TYPE "public"."enum_sti_media_type" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum_sti_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_sti_image_sizing_mode" AS ENUM('ratio', 'natural');
  CREATE TYPE "public"."enum_sti_image_ratio" AS ENUM('2/3', '3/4', '4/5', '5/6', '9/10', '1/1', '10/9', '6/5', '5/4', '4/3', '3/2');
  CREATE TYPE "public"."enum_sti_image_vertical_margin" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_sti_image_horizontal_margin" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_sti_image_size" AS ENUM('tiny-icon', 'small-icon', 'icon', 'large-icon', 'tiny', 'small', 'medium', 'large', 'xlarge', 'huge');
  CREATE TYPE "public"."enum_sti_text_container_margin" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum_site_settings_blocks_video_width" AS ENUM('half', '2/3', '3/4', 'full');
  CREATE TABLE "site_settings_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tally_form_id" varchar DEFAULT '81x1GP',
  	"block_name" varchar
  );
  
  CREATE TABLE "site_settings_blocks_content_grid_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb
  );
  
  CREATE TABLE "site_settings_blocks_content_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number_of_columns" "enum_site_settings_blocks_content_grid_number_of_columns" DEFAULT '3',
  	"horizontal_alignment" "enum_site_settings_blocks_content_grid_horizontal_alignment" DEFAULT 'left',
  	"vertical_alignment" "enum_site_settings_blocks_content_grid_vertical_alignment" DEFAULT 'center',
  	"block_name" varchar
  );
  
  CREATE TABLE "site_settings_blocks_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"variant" "enum_site_settings_blocks_hero_links_variant" DEFAULT 'solid'
  );
  
  CREATE TABLE "site_settings_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"headline" varchar,
  	"subheadline" varchar,
  	"background_image_id" integer,
  	"focal_point_y" numeric DEFAULT 50,
  	"alignment" "enum_site_settings_blocks_hero_alignment" DEFAULT 'center',
  	"height" "enum_site_settings_blocks_hero_height" DEFAULT 'medium',
  	"block_name" varchar
  );
  
  CREATE TABLE "site_settings_blocks_newsletter_signup" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"button_label" varchar DEFAULT 'Subscribe',
  	"email_placeholder" varchar,
  	"success_message" varchar DEFAULT 'Thank you for subscribing!',
  	"mailchimp_action_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "site_settings_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"width" "enum_site_settings_blocks_rich_text_width" DEFAULT 'full',
  	"render_floating" boolean DEFAULT false,
  	"floating_offset" varchar,
  	"margin" "enum_site_settings_blocks_rich_text_margin" DEFAULT 'none',
  	"background_color" varchar DEFAULT 'transparent',
  	"rounded_corners" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "site_settings_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"height" "enum_site_settings_blocks_spacer_height" DEFAULT 'medium',
  	"block_name" varchar
  );
  
  CREATE TABLE "sti_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"caption" varchar,
  	"link" varchar
  );
  
  CREATE TABLE "sti" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" jsonb,
  	"media_type" "enum_sti_media_type" DEFAULT 'image',
  	"image_id" integer,
  	"focal_point_x" numeric DEFAULT 50,
  	"focal_point_y" numeric DEFAULT 50,
  	"vimeo_id" varchar,
  	"video_poster_id" integer,
  	"video_cta_caption" varchar,
  	"image_position" "enum_sti_image_position" DEFAULT 'right',
  	"image_percentage" numeric DEFAULT 45,
  	"image_sizing_mode" "enum_sti_image_sizing_mode" DEFAULT 'ratio',
  	"image_ratio" "enum_sti_image_ratio" DEFAULT '3/2',
  	"image_vertical_margin" "enum_sti_image_vertical_margin" DEFAULT 'medium',
  	"image_horizontal_margin" "enum_sti_image_horizontal_margin" DEFAULT 'none',
  	"image_size" "enum_sti_image_size" DEFAULT 'medium',
  	"text_container_margin" "enum_sti_text_container_margin" DEFAULT 'medium',
  	"background_color" varchar DEFAULT 'transparent',
  	"full_bleed" boolean DEFAULT false,
  	"rounded_corners" boolean DEFAULT false,
  	"collapsed_by_default" boolean DEFAULT false,
  	"start_numbered_list_at_zero" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "site_settings_blocks_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"csv_data" varchar,
  	"show_borders" boolean DEFAULT false,
  	"first_row_are_titles" boolean DEFAULT false,
  	"last_row_are_buttons" boolean DEFAULT false,
  	"button_links_csv" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "site_settings_blocks_testimonials_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"name" varchar
  );
  
  CREATE TABLE "site_settings_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "site_settings_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"vimeo_id" varchar,
  	"poster_image_id" integer,
  	"cta_caption" varchar,
  	"width" "enum_site_settings_blocks_video_width" DEFAULT 'full',
  	"block_name" varchar
  );
  
  ALTER TABLE "site_settings" ADD COLUMN "splash_page_enabled" boolean DEFAULT false;
  ALTER TABLE "site_settings_blocks_contact_form" ADD CONSTRAINT "site_settings_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_content_grid_cells" ADD CONSTRAINT "site_settings_blocks_content_grid_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_blocks_content_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_content_grid" ADD CONSTRAINT "site_settings_blocks_content_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_hero_links" ADD CONSTRAINT "site_settings_blocks_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_hero" ADD CONSTRAINT "site_settings_blocks_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_hero" ADD CONSTRAINT "site_settings_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_newsletter_signup" ADD CONSTRAINT "site_settings_blocks_newsletter_signup_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_rich_text" ADD CONSTRAINT "site_settings_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_spacer" ADD CONSTRAINT "site_settings_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sti_buttons" ADD CONSTRAINT "sti_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sti"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sti" ADD CONSTRAINT "sti_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sti" ADD CONSTRAINT "sti_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sti" ADD CONSTRAINT "sti_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_table" ADD CONSTRAINT "site_settings_blocks_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_testimonials_testimonials" ADD CONSTRAINT "site_settings_blocks_testimonials_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_testimonials" ADD CONSTRAINT "site_settings_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_video" ADD CONSTRAINT "site_settings_blocks_video_poster_image_id_media_id_fk" FOREIGN KEY ("poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_blocks_video" ADD CONSTRAINT "site_settings_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_settings_blocks_contact_form_order_idx" ON "site_settings_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_contact_form_parent_id_idx" ON "site_settings_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_contact_form_path_idx" ON "site_settings_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "site_settings_blocks_content_grid_cells_order_idx" ON "site_settings_blocks_content_grid_cells" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_content_grid_cells_parent_id_idx" ON "site_settings_blocks_content_grid_cells" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_content_grid_order_idx" ON "site_settings_blocks_content_grid" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_content_grid_parent_id_idx" ON "site_settings_blocks_content_grid" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_content_grid_path_idx" ON "site_settings_blocks_content_grid" USING btree ("_path");
  CREATE INDEX "site_settings_blocks_hero_links_order_idx" ON "site_settings_blocks_hero_links" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_hero_links_parent_id_idx" ON "site_settings_blocks_hero_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_hero_order_idx" ON "site_settings_blocks_hero" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_hero_parent_id_idx" ON "site_settings_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_hero_path_idx" ON "site_settings_blocks_hero" USING btree ("_path");
  CREATE INDEX "site_settings_blocks_hero_background_image_idx" ON "site_settings_blocks_hero" USING btree ("background_image_id");
  CREATE INDEX "site_settings_blocks_newsletter_signup_order_idx" ON "site_settings_blocks_newsletter_signup" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_newsletter_signup_parent_id_idx" ON "site_settings_blocks_newsletter_signup" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_newsletter_signup_path_idx" ON "site_settings_blocks_newsletter_signup" USING btree ("_path");
  CREATE INDEX "site_settings_blocks_rich_text_order_idx" ON "site_settings_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_rich_text_parent_id_idx" ON "site_settings_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_rich_text_path_idx" ON "site_settings_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "site_settings_blocks_spacer_order_idx" ON "site_settings_blocks_spacer" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_spacer_parent_id_idx" ON "site_settings_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_spacer_path_idx" ON "site_settings_blocks_spacer" USING btree ("_path");
  CREATE INDEX "sti_buttons_order_idx" ON "sti_buttons" USING btree ("_order");
  CREATE INDEX "sti_buttons_parent_id_idx" ON "sti_buttons" USING btree ("_parent_id");
  CREATE INDEX "sti_order_idx" ON "sti" USING btree ("_order");
  CREATE INDEX "sti_parent_id_idx" ON "sti" USING btree ("_parent_id");
  CREATE INDEX "sti_path_idx" ON "sti" USING btree ("_path");
  CREATE INDEX "sti_image_idx" ON "sti" USING btree ("image_id");
  CREATE INDEX "sti_video_poster_idx" ON "sti" USING btree ("video_poster_id");
  CREATE INDEX "site_settings_blocks_table_order_idx" ON "site_settings_blocks_table" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_table_parent_id_idx" ON "site_settings_blocks_table" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_table_path_idx" ON "site_settings_blocks_table" USING btree ("_path");
  CREATE INDEX "site_settings_blocks_testimonials_testimonials_order_idx" ON "site_settings_blocks_testimonials_testimonials" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_testimonials_testimonials_parent_id_idx" ON "site_settings_blocks_testimonials_testimonials" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_testimonials_order_idx" ON "site_settings_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_testimonials_parent_id_idx" ON "site_settings_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_testimonials_path_idx" ON "site_settings_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "site_settings_blocks_video_order_idx" ON "site_settings_blocks_video" USING btree ("_order");
  CREATE INDEX "site_settings_blocks_video_parent_id_idx" ON "site_settings_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "site_settings_blocks_video_path_idx" ON "site_settings_blocks_video" USING btree ("_path");
  CREATE INDEX "site_settings_blocks_video_poster_image_idx" ON "site_settings_blocks_video" USING btree ("poster_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_settings_blocks_contact_form" CASCADE;
  DROP TABLE "site_settings_blocks_content_grid_cells" CASCADE;
  DROP TABLE "site_settings_blocks_content_grid" CASCADE;
  DROP TABLE "site_settings_blocks_hero_links" CASCADE;
  DROP TABLE "site_settings_blocks_hero" CASCADE;
  DROP TABLE "site_settings_blocks_newsletter_signup" CASCADE;
  DROP TABLE "site_settings_blocks_rich_text" CASCADE;
  DROP TABLE "site_settings_blocks_spacer" CASCADE;
  DROP TABLE "sti_buttons" CASCADE;
  DROP TABLE "sti" CASCADE;
  DROP TABLE "site_settings_blocks_table" CASCADE;
  DROP TABLE "site_settings_blocks_testimonials_testimonials" CASCADE;
  DROP TABLE "site_settings_blocks_testimonials" CASCADE;
  DROP TABLE "site_settings_blocks_video" CASCADE;
  ALTER TABLE "site_settings" DROP COLUMN "splash_page_enabled";
  DROP TYPE "public"."enum_site_settings_blocks_content_grid_number_of_columns";
  DROP TYPE "public"."enum_site_settings_blocks_content_grid_horizontal_alignment";
  DROP TYPE "public"."enum_site_settings_blocks_content_grid_vertical_alignment";
  DROP TYPE "public"."enum_site_settings_blocks_hero_links_variant";
  DROP TYPE "public"."enum_site_settings_blocks_hero_alignment";
  DROP TYPE "public"."enum_site_settings_blocks_hero_height";
  DROP TYPE "public"."enum_site_settings_blocks_rich_text_width";
  DROP TYPE "public"."enum_site_settings_blocks_rich_text_margin";
  DROP TYPE "public"."enum_site_settings_blocks_spacer_height";
  DROP TYPE "public"."enum_sti_media_type";
  DROP TYPE "public"."enum_sti_image_position";
  DROP TYPE "public"."enum_sti_image_sizing_mode";
  DROP TYPE "public"."enum_sti_image_ratio";
  DROP TYPE "public"."enum_sti_image_vertical_margin";
  DROP TYPE "public"."enum_sti_image_horizontal_margin";
  DROP TYPE "public"."enum_sti_image_size";
  DROP TYPE "public"."enum_sti_text_container_margin";
  DROP TYPE "public"."enum_site_settings_blocks_video_width";`)
}
