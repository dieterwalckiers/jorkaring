import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_content_grid_number_of_columns" AS ENUM('2', '3', '4', '5');
  CREATE TYPE "public"."enum__pages_v_blocks_content_grid_horizontal_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_content_grid_vertical_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_rich_text_layout" AS ENUM('full', 'left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_cta_links_variant" AS ENUM('solid', 'outline', 'ghost');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_spacer_height" AS ENUM('xs', 'small', 'medium', 'large', 'xl');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_overlay" AS ENUM('none', 'darken', 'lighten');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_hero_height" AS ENUM('small', 'medium', 'large', 'xl', 'xxl');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_marquee_logo_size" AS ENUM('small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_logo_marquee_speed" AS ENUM('slow', 'medium', 'fast');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_width" AS ENUM('1/4', '1/3', 'half', '2/3', '3/4', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_margin" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_spacer_height" AS ENUM('xxxs', 'xxs', 'xs', 'small', 'medium', 'large', 'xl', 'xxl', 'xxxl');
  CREATE TYPE "public"."enum__pages_v_blocks_split_text_image_media_type" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum__pages_v_blocks_split_text_image_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_split_text_image_image_sizing_mode" AS ENUM('ratio', 'natural');
  CREATE TYPE "public"."enum__pages_v_blocks_split_text_image_image_ratio" AS ENUM('2/3', '3/4', '4/5', '5/6', '9/10', '1/1', '10/9', '6/5', '5/4', '4/3', '3/2');
  CREATE TYPE "public"."enum__pages_v_blocks_split_text_image_image_vertical_margin" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_split_text_image_image_horizontal_margin" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_split_text_image_image_size" AS ENUM('tiny-icon', 'small-icon', 'icon', 'large-icon', 'tiny', 'small', 'medium', 'large', 'xlarge', 'huge');
  CREATE TYPE "public"."enum__pages_v_blocks_split_text_image_text_container_margin" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__pages_v_blocks_video_width" AS ENUM('half', '2/3', '3/4', 'full');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_site_settings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_settings_v_blocks_content_grid_number_of_columns" AS ENUM('2', '3', '4', '5');
  CREATE TYPE "public"."enum__site_settings_v_blocks_content_grid_horizontal_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__site_settings_v_blocks_content_grid_vertical_alignment" AS ENUM('top', 'center', 'bottom');
  CREATE TYPE "public"."enum__site_settings_v_blocks_hero_rich_text_layout" AS ENUM('full', 'left', 'right');
  CREATE TYPE "public"."enum__site_settings_v_blocks_hero_cta_links_variant" AS ENUM('solid', 'outline', 'ghost');
  CREATE TYPE "public"."enum__site_settings_v_blocks_hero_spacer_height" AS ENUM('xs', 'small', 'medium', 'large', 'xl');
  CREATE TYPE "public"."enum__site_settings_v_blocks_hero_overlay" AS ENUM('none', 'darken', 'lighten');
  CREATE TYPE "public"."enum__site_settings_v_blocks_hero_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__site_settings_v_blocks_hero_height" AS ENUM('small', 'medium', 'large', 'xl', 'xxl');
  CREATE TYPE "public"."enum__site_settings_v_blocks_rich_text_width" AS ENUM('1/4', '1/3', 'half', '2/3', '3/4', 'full');
  CREATE TYPE "public"."enum__site_settings_v_blocks_rich_text_margin" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__site_settings_v_blocks_spacer_height" AS ENUM('xxxs', 'xxs', 'xs', 'small', 'medium', 'large', 'xl', 'xxl', 'xxxl');
  CREATE TYPE "public"."enum__sti_v_media_type" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum__sti_v_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__sti_v_image_sizing_mode" AS ENUM('ratio', 'natural');
  CREATE TYPE "public"."enum__sti_v_image_ratio" AS ENUM('2/3', '3/4', '4/5', '5/6', '9/10', '1/1', '10/9', '6/5', '5/4', '4/3', '3/2');
  CREATE TYPE "public"."enum__sti_v_image_vertical_margin" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__sti_v_image_horizontal_margin" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__sti_v_image_size" AS ENUM('tiny-icon', 'small-icon', 'icon', 'large-icon', 'tiny', 'small', 'medium', 'large', 'xlarge', 'huge');
  CREATE TYPE "public"."enum__sti_v_text_container_margin" AS ENUM('none', 'small', 'medium', 'large');
  CREATE TYPE "public"."enum__site_settings_v_blocks_video_width" AS ENUM('half', '2/3', '3/4', 'full');
  CREATE TYPE "public"."enum__site_settings_v_version_styling_container_width" AS ENUM('narrower', 'default', 'wider');
  CREATE TYPE "public"."enum__site_settings_v_version_styling_header_menu_alignment" AS ENUM('left', 'center', 'right');
  CREATE TYPE "public"."enum__site_settings_v_version_styling_header_height" AS ENUM('small', 'medium', 'large', 'xl', '2xl');
  CREATE TYPE "public"."enum__site_settings_v_version_styling_logo_size" AS ENUM('small', 'medium', 'large', 'xl');
  CREATE TYPE "public"."enum__site_settings_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "_pages_v_blocks_calendly_embed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"style" varchar DEFAULT 'min-width:320px;height:700px;',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_grid_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number_of_columns" "enum__pages_v_blocks_content_grid_number_of_columns" DEFAULT '3',
  	"horizontal_alignment" "enum__pages_v_blocks_content_grid_horizontal_alignment" DEFAULT 'left',
  	"vertical_alignment" "enum__pages_v_blocks_content_grid_vertical_alignment" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_headline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_subheadline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"layout" "enum__pages_v_blocks_hero_rich_text_layout" DEFAULT 'full',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"variant" "enum__pages_v_blocks_hero_cta_links_variant" DEFAULT 'solid',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"height" "enum__pages_v_blocks_hero_spacer_height" DEFAULT 'medium',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"focal_point_y" numeric DEFAULT 50,
  	"overlay" "enum__pages_v_blocks_hero_overlay" DEFAULT 'none',
  	"overlay_strength" numeric DEFAULT 40,
  	"alignment" "enum__pages_v_blocks_hero_alignment" DEFAULT 'center',
  	"height" "enum__pages_v_blocks_hero_height" DEFAULT 'medium',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_in_page_menu_title" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logo_marquee_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"alt" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_logo_marquee" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_size" "enum__pages_v_blocks_logo_marquee_logo_size" DEFAULT 'medium',
  	"speed" "enum__pages_v_blocks_logo_marquee_speed" DEFAULT 'medium',
  	"pause_on_hover" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"width" "enum__pages_v_blocks_rich_text_width" DEFAULT 'full',
  	"render_floating" boolean DEFAULT false,
  	"floating_offset" varchar,
  	"margin" "enum__pages_v_blocks_rich_text_margin" DEFAULT 'none',
  	"background_color" varchar DEFAULT 'transparent',
  	"rounded_corners" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"height" "enum__pages_v_blocks_spacer_height" DEFAULT 'medium',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_split_text_image_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"caption" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_split_text_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" jsonb,
  	"media_type" "enum__pages_v_blocks_split_text_image_media_type" DEFAULT 'image',
  	"image_id" integer,
  	"focal_point_x" numeric DEFAULT 50,
  	"focal_point_y" numeric DEFAULT 50,
  	"vimeo_id" varchar,
  	"video_poster_id" integer,
  	"video_cta_caption" varchar,
  	"image_position" "enum__pages_v_blocks_split_text_image_image_position" DEFAULT 'right',
  	"image_percentage" numeric DEFAULT 45,
  	"image_sizing_mode" "enum__pages_v_blocks_split_text_image_image_sizing_mode" DEFAULT 'ratio',
  	"image_ratio" "enum__pages_v_blocks_split_text_image_image_ratio" DEFAULT '3/2',
  	"image_vertical_margin" "enum__pages_v_blocks_split_text_image_image_vertical_margin" DEFAULT 'medium',
  	"image_horizontal_margin" "enum__pages_v_blocks_split_text_image_image_horizontal_margin" DEFAULT 'none',
  	"image_size" "enum__pages_v_blocks_split_text_image_image_size" DEFAULT 'medium',
  	"text_container_margin" "enum__pages_v_blocks_split_text_image_text_container_margin" DEFAULT 'medium',
  	"background_color" varchar DEFAULT 'transparent',
  	"full_bleed" boolean DEFAULT false,
  	"rounded_corners" boolean DEFAULT false,
  	"collapsed_by_default" boolean DEFAULT false,
  	"start_numbered_list_at_zero" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"vimeo_id" varchar,
  	"poster_image_id" integer,
  	"cta_caption" varchar,
  	"width" "enum__pages_v_blocks_video_width" DEFAULT 'full',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_show_in_menu" boolean DEFAULT false,
  	"version_menu_order" numeric,
  	"version_show_in_toolbar" boolean DEFAULT false,
  	"version_toolbar_label" varchar,
  	"version_toolbar_order" numeric,
  	"version_filter_main_menu" boolean DEFAULT false,
  	"version_seo_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer
  );
  
  CREATE TABLE "_site_settings_v_version_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v_blocks_contact_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tally_form_id" varchar DEFAULT '81x1GP',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_site_settings_v_blocks_content_grid_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v_blocks_content_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number_of_columns" "enum__site_settings_v_blocks_content_grid_number_of_columns" DEFAULT '3',
  	"horizontal_alignment" "enum__site_settings_v_blocks_content_grid_horizontal_alignment" DEFAULT 'left',
  	"vertical_alignment" "enum__site_settings_v_blocks_content_grid_vertical_alignment" DEFAULT 'center',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_site_settings_v_blocks_hero_headline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_site_settings_v_blocks_hero_subheadline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_site_settings_v_blocks_hero_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"layout" "enum__site_settings_v_blocks_hero_rich_text_layout" DEFAULT 'full',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_site_settings_v_blocks_hero_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"variant" "enum__site_settings_v_blocks_hero_cta_links_variant" DEFAULT 'solid',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v_blocks_hero_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_site_settings_v_blocks_hero_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"height" "enum__site_settings_v_blocks_hero_spacer_height" DEFAULT 'medium',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_site_settings_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_image_id" integer,
  	"focal_point_y" numeric DEFAULT 50,
  	"overlay" "enum__site_settings_v_blocks_hero_overlay" DEFAULT 'none',
  	"overlay_strength" numeric DEFAULT 40,
  	"alignment" "enum__site_settings_v_blocks_hero_alignment" DEFAULT 'center',
  	"height" "enum__site_settings_v_blocks_hero_height" DEFAULT 'medium',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_site_settings_v_blocks_newsletter_signup" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"button_label" varchar DEFAULT 'Subscribe',
  	"email_placeholder" varchar,
  	"success_message" varchar DEFAULT 'Thank you for subscribing!',
  	"mailchimp_action_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_site_settings_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"width" "enum__site_settings_v_blocks_rich_text_width" DEFAULT 'full',
  	"render_floating" boolean DEFAULT false,
  	"floating_offset" varchar,
  	"margin" "enum__site_settings_v_blocks_rich_text_margin" DEFAULT 'none',
  	"background_color" varchar DEFAULT 'transparent',
  	"rounded_corners" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_site_settings_v_blocks_spacer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"height" "enum__site_settings_v_blocks_spacer_height" DEFAULT 'medium',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_sti_v_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"caption" varchar,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_sti_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" jsonb,
  	"media_type" "enum__sti_v_media_type" DEFAULT 'image',
  	"image_id" integer,
  	"focal_point_x" numeric DEFAULT 50,
  	"focal_point_y" numeric DEFAULT 50,
  	"vimeo_id" varchar,
  	"video_poster_id" integer,
  	"video_cta_caption" varchar,
  	"image_position" "enum__sti_v_image_position" DEFAULT 'right',
  	"image_percentage" numeric DEFAULT 45,
  	"image_sizing_mode" "enum__sti_v_image_sizing_mode" DEFAULT 'ratio',
  	"image_ratio" "enum__sti_v_image_ratio" DEFAULT '3/2',
  	"image_vertical_margin" "enum__sti_v_image_vertical_margin" DEFAULT 'medium',
  	"image_horizontal_margin" "enum__sti_v_image_horizontal_margin" DEFAULT 'none',
  	"image_size" "enum__sti_v_image_size" DEFAULT 'medium',
  	"text_container_margin" "enum__sti_v_text_container_margin" DEFAULT 'medium',
  	"background_color" varchar DEFAULT 'transparent',
  	"full_bleed" boolean DEFAULT false,
  	"rounded_corners" boolean DEFAULT false,
  	"collapsed_by_default" boolean DEFAULT false,
  	"start_numbered_list_at_zero" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_site_settings_v_blocks_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"csv_data" varchar,
  	"show_borders" boolean DEFAULT false,
  	"first_row_are_titles" boolean DEFAULT false,
  	"last_row_are_buttons" boolean DEFAULT false,
  	"button_links_csv" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_site_settings_v_blocks_testimonials_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_site_settings_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"vimeo_id" varchar,
  	"poster_image_id" integer,
  	"cta_caption" varchar,
  	"width" "enum__site_settings_v_blocks_video_width" DEFAULT 'full',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_site_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_site_title" varchar DEFAULT 'My Site',
  	"version_logo_id" integer,
  	"version_favicon_id" integer,
  	"version_styling_container_width" "enum__site_settings_v_version_styling_container_width" DEFAULT 'default',
  	"version_styling_header_menu_alignment" "enum__site_settings_v_version_styling_header_menu_alignment" DEFAULT 'right',
  	"version_styling_header_height" "enum__site_settings_v_version_styling_header_height" DEFAULT 'medium',
  	"version_styling_header_border" boolean DEFAULT true,
  	"version_styling_logo_size" "enum__site_settings_v_version_styling_logo_size" DEFAULT 'medium',
  	"version_styling_google_font_body" varchar,
  	"version_styling_google_font_h1" varchar,
  	"version_styling_google_font_headings" varchar,
  	"version_head_content_leading" varchar,
  	"version_head_content_tailing" varchar,
  	"version_cookie_consent_enabled" boolean DEFAULT true,
  	"version_cookie_consent_message" varchar,
  	"version_cookie_consent_accept_label" varchar DEFAULT 'Accept',
  	"version_cookie_consent_policy_url" varchar DEFAULT '/cookie-policy',
  	"version_cookie_consent_policy_link_text" varchar DEFAULT 'Read more',
  	"version_sticky_message_content" jsonb,
  	"version_sticky_message_closeable" boolean DEFAULT true,
  	"version_splash_page_enabled" boolean DEFAULT false,
  	"version_splash_page_background_image_id" integer,
  	"version_splash_page_centered" boolean DEFAULT false,
  	"version_theme_colors_theme1_label" varchar DEFAULT 'Theme 1',
  	"version_theme_colors_theme2_label" varchar DEFAULT 'Theme 2',
  	"version_theme_colors_theme3_label" varchar DEFAULT 'Theme 3',
  	"version_theme_colors_theme4_label" varchar DEFAULT 'Theme 4',
  	"version_theme_colors_theme5_label" varchar DEFAULT 'Theme 5',
  	"version_theme_colors_theme6_label" varchar DEFAULT 'Theme 6',
  	"version_theme_colors_theme7_label" varchar DEFAULT 'Theme 7',
  	"version_theme_colors_theme8_label" varchar DEFAULT 'Theme 8',
  	"version_theme_colors_main_bg" varchar DEFAULT '#ffffff',
  	"version_theme_colors_font" varchar DEFAULT '#373031',
  	"version_theme_colors_font_accent" varchar DEFAULT '#8B5A4A',
  	"version_theme_colors_headings" varchar DEFAULT '#5E6E83',
  	"version_theme_colors_button_font" varchar DEFAULT '#373031',
  	"version_theme_colors_button_bg" varchar DEFAULT 'transparent',
  	"version_theme_colors_button_font_hover" varchar DEFAULT '#ffffff',
  	"version_theme_colors_button_bg_hover" varchar DEFAULT '#EA8928',
  	"version_theme_colors_table_borders" varchar DEFAULT '#EA8928',
  	"version_theme_colors_sticky_message_txt" varchar DEFAULT '#B6C9BB',
  	"version_theme_colors_sticky_message_bg" varchar DEFAULT '#5E6E83',
  	"version_theme_colors_theme1" varchar DEFAULT '#5E6E83',
  	"version_theme_colors_theme2" varchar DEFAULT '#5E6E83',
  	"version_theme_colors_theme3" varchar DEFAULT '#B6C9BB',
  	"version_theme_colors_theme4" varchar DEFAULT '#BFEDC1',
  	"version_theme_colors_theme5" varchar DEFAULT '#EA8928',
  	"version_theme_colors_theme6" varchar DEFAULT '#656565',
  	"version_theme_colors_theme7" varchar DEFAULT '#2C3E50',
  	"version_theme_colors_theme8" varchar DEFAULT '#E74C3C',
  	"version__status" "enum__site_settings_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "pages_blocks_newsletter_signup" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_table" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_newsletter_signup" CASCADE;
  DROP TABLE "pages_blocks_table" CASCADE;
  ALTER TABLE "pages_blocks_calendly_embed" ALTER COLUMN "url" DROP NOT NULL;
  ALTER TABLE "pages_blocks_content_grid_cells" ALTER COLUMN "content" DROP NOT NULL;
  ALTER TABLE "pages_blocks_hero_headline" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "pages_blocks_hero_subheadline" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "pages_blocks_hero_rich_text" ALTER COLUMN "content" DROP NOT NULL;
  ALTER TABLE "pages_blocks_hero_cta_links" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "pages_blocks_hero_cta_links" ALTER COLUMN "url" DROP NOT NULL;
  ALTER TABLE "pages_blocks_hero_spacer" ALTER COLUMN "height" DROP NOT NULL;
  ALTER TABLE "pages_blocks_in_page_menu_title" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "pages_blocks_logo_marquee_logos" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "pages_blocks_rich_text" ALTER COLUMN "content" DROP NOT NULL;
  ALTER TABLE "pages_blocks_spacer" ALTER COLUMN "height" DROP NOT NULL;
  ALTER TABLE "pages_blocks_split_text_image_buttons" ALTER COLUMN "caption" DROP NOT NULL;
  ALTER TABLE "pages_blocks_split_text_image_buttons" ALTER COLUMN "link" DROP NOT NULL;
  ALTER TABLE "pages_blocks_split_text_image" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "pages_blocks_testimonials_testimonials" ALTER COLUMN "quote" DROP NOT NULL;
  ALTER TABLE "pages_blocks_testimonials_testimonials" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "pages_blocks_video" ALTER COLUMN "vimeo_id" DROP NOT NULL;
  ALTER TABLE "pages_blocks_video" ALTER COLUMN "poster_image_id" DROP NOT NULL;
  ALTER TABLE "pages" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "pages" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "site_settings_footer_links" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "site_settings_footer_links" ALTER COLUMN "url" DROP NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "site_title" DROP NOT NULL;
  ALTER TABLE "pages" ADD COLUMN "_status" "enum_pages_status" DEFAULT 'draft';
  ALTER TABLE "site_settings" ADD COLUMN "splash_page_background_image_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_theme1_label" varchar DEFAULT 'Theme 1';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_theme2_label" varchar DEFAULT 'Theme 2';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_theme3_label" varchar DEFAULT 'Theme 3';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_theme4_label" varchar DEFAULT 'Theme 4';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_theme5_label" varchar DEFAULT 'Theme 5';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_theme6_label" varchar DEFAULT 'Theme 6';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_theme7_label" varchar DEFAULT 'Theme 7';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_theme8_label" varchar DEFAULT 'Theme 8';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_main_bg" varchar DEFAULT '#ffffff';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_headings" varchar DEFAULT '#5E6E83';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_button_font" varchar DEFAULT '#373031';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_button_bg" varchar DEFAULT 'transparent';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_button_font_hover" varchar DEFAULT '#ffffff';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_button_bg_hover" varchar DEFAULT '#EA8928';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_table_borders" varchar DEFAULT '#EA8928';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_sticky_message_txt" varchar DEFAULT '#B6C9BB';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_sticky_message_bg" varchar DEFAULT '#5E6E83';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_theme1" varchar DEFAULT '#5E6E83';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_theme2" varchar DEFAULT '#5E6E83';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_theme3" varchar DEFAULT '#B6C9BB';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_theme4" varchar DEFAULT '#BFEDC1';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_theme5" varchar DEFAULT '#EA8928';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_theme6" varchar DEFAULT '#656565';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_theme7" varchar DEFAULT '#2C3E50';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_theme8" varchar DEFAULT '#E74C3C';
  ALTER TABLE "site_settings" ADD COLUMN "_status" "enum_site_settings_status" DEFAULT 'draft';
  ALTER TABLE "_pages_v_blocks_calendly_embed" ADD CONSTRAINT "_pages_v_blocks_calendly_embed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_grid_cells" ADD CONSTRAINT "_pages_v_blocks_content_grid_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_grid" ADD CONSTRAINT "_pages_v_blocks_content_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_headline" ADD CONSTRAINT "_pages_v_blocks_hero_headline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_subheadline" ADD CONSTRAINT "_pages_v_blocks_hero_subheadline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_rich_text" ADD CONSTRAINT "_pages_v_blocks_hero_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_cta_links" ADD CONSTRAINT "_pages_v_blocks_hero_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_cta" ADD CONSTRAINT "_pages_v_blocks_hero_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_spacer" ADD CONSTRAINT "_pages_v_blocks_hero_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_in_page_menu_title" ADD CONSTRAINT "_pages_v_blocks_in_page_menu_title_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_marquee_logos" ADD CONSTRAINT "_pages_v_blocks_logo_marquee_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_marquee_logos" ADD CONSTRAINT "_pages_v_blocks_logo_marquee_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_logo_marquee"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_logo_marquee" ADD CONSTRAINT "_pages_v_blocks_logo_marquee_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_spacer" ADD CONSTRAINT "_pages_v_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_text_image_buttons" ADD CONSTRAINT "_pages_v_blocks_split_text_image_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_split_text_image"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_text_image" ADD CONSTRAINT "_pages_v_blocks_split_text_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_text_image" ADD CONSTRAINT "_pages_v_blocks_split_text_image_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_text_image" ADD CONSTRAINT "_pages_v_blocks_split_text_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_poster_image_id_media_id_fk" FOREIGN KEY ("poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_footer_links" ADD CONSTRAINT "_site_settings_v_version_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_contact_form" ADD CONSTRAINT "_site_settings_v_blocks_contact_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_content_grid_cells" ADD CONSTRAINT "_site_settings_v_blocks_content_grid_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v_blocks_content_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_content_grid" ADD CONSTRAINT "_site_settings_v_blocks_content_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_hero_headline" ADD CONSTRAINT "_site_settings_v_blocks_hero_headline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_hero_subheadline" ADD CONSTRAINT "_site_settings_v_blocks_hero_subheadline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_hero_rich_text" ADD CONSTRAINT "_site_settings_v_blocks_hero_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_hero_cta_links" ADD CONSTRAINT "_site_settings_v_blocks_hero_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v_blocks_hero_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_hero_cta" ADD CONSTRAINT "_site_settings_v_blocks_hero_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_hero_spacer" ADD CONSTRAINT "_site_settings_v_blocks_hero_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_hero" ADD CONSTRAINT "_site_settings_v_blocks_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_hero" ADD CONSTRAINT "_site_settings_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_newsletter_signup" ADD CONSTRAINT "_site_settings_v_blocks_newsletter_signup_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_rich_text" ADD CONSTRAINT "_site_settings_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_spacer" ADD CONSTRAINT "_site_settings_v_blocks_spacer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_sti_v_buttons" ADD CONSTRAINT "_sti_v_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_sti_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_sti_v" ADD CONSTRAINT "_sti_v_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sti_v" ADD CONSTRAINT "_sti_v_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sti_v" ADD CONSTRAINT "_sti_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_table" ADD CONSTRAINT "_site_settings_v_blocks_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_testimonials_testimonials" ADD CONSTRAINT "_site_settings_v_blocks_testimonials_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_testimonials" ADD CONSTRAINT "_site_settings_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_video" ADD CONSTRAINT "_site_settings_v_blocks_video_poster_image_id_media_id_fk" FOREIGN KEY ("poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v_blocks_video" ADD CONSTRAINT "_site_settings_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_favicon_id_media_id_fk" FOREIGN KEY ("version_favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_splash_page_background_image_id_media_id_fk" FOREIGN KEY ("version_splash_page_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "_pages_v_blocks_calendly_embed_order_idx" ON "_pages_v_blocks_calendly_embed" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_calendly_embed_parent_id_idx" ON "_pages_v_blocks_calendly_embed" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_calendly_embed_path_idx" ON "_pages_v_blocks_calendly_embed" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_content_grid_cells_order_idx" ON "_pages_v_blocks_content_grid_cells" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_grid_cells_parent_id_idx" ON "_pages_v_blocks_content_grid_cells" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_grid_order_idx" ON "_pages_v_blocks_content_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_grid_parent_id_idx" ON "_pages_v_blocks_content_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_grid_path_idx" ON "_pages_v_blocks_content_grid" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_headline_order_idx" ON "_pages_v_blocks_hero_headline" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_headline_parent_id_idx" ON "_pages_v_blocks_hero_headline" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_headline_path_idx" ON "_pages_v_blocks_hero_headline" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_subheadline_order_idx" ON "_pages_v_blocks_hero_subheadline" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_subheadline_parent_id_idx" ON "_pages_v_blocks_hero_subheadline" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_subheadline_path_idx" ON "_pages_v_blocks_hero_subheadline" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_rich_text_order_idx" ON "_pages_v_blocks_hero_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_rich_text_parent_id_idx" ON "_pages_v_blocks_hero_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_rich_text_path_idx" ON "_pages_v_blocks_hero_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_cta_links_order_idx" ON "_pages_v_blocks_hero_cta_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_cta_links_parent_id_idx" ON "_pages_v_blocks_hero_cta_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_cta_order_idx" ON "_pages_v_blocks_hero_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_cta_parent_id_idx" ON "_pages_v_blocks_hero_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_cta_path_idx" ON "_pages_v_blocks_hero_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_spacer_order_idx" ON "_pages_v_blocks_hero_spacer" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_spacer_parent_id_idx" ON "_pages_v_blocks_hero_spacer" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_spacer_path_idx" ON "_pages_v_blocks_hero_spacer" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_background_image_idx" ON "_pages_v_blocks_hero" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_in_page_menu_title_order_idx" ON "_pages_v_blocks_in_page_menu_title" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_in_page_menu_title_parent_id_idx" ON "_pages_v_blocks_in_page_menu_title" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_in_page_menu_title_path_idx" ON "_pages_v_blocks_in_page_menu_title" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_logo_marquee_logos_order_idx" ON "_pages_v_blocks_logo_marquee_logos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_marquee_logos_parent_id_idx" ON "_pages_v_blocks_logo_marquee_logos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_marquee_logos_image_idx" ON "_pages_v_blocks_logo_marquee_logos" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_logo_marquee_order_idx" ON "_pages_v_blocks_logo_marquee" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_logo_marquee_parent_id_idx" ON "_pages_v_blocks_logo_marquee" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_logo_marquee_path_idx" ON "_pages_v_blocks_logo_marquee" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_spacer_order_idx" ON "_pages_v_blocks_spacer" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_spacer_parent_id_idx" ON "_pages_v_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_spacer_path_idx" ON "_pages_v_blocks_spacer" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_split_text_image_buttons_order_idx" ON "_pages_v_blocks_split_text_image_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_split_text_image_buttons_parent_id_idx" ON "_pages_v_blocks_split_text_image_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_split_text_image_order_idx" ON "_pages_v_blocks_split_text_image" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_split_text_image_parent_id_idx" ON "_pages_v_blocks_split_text_image" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_split_text_image_path_idx" ON "_pages_v_blocks_split_text_image" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_split_text_image_image_idx" ON "_pages_v_blocks_split_text_image" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_split_text_image_video_poster_idx" ON "_pages_v_blocks_split_text_image" USING btree ("video_poster_id");
  CREATE INDEX "_pages_v_blocks_testimonials_testimonials_order_idx" ON "_pages_v_blocks_testimonials_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_order_idx" ON "_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_path_idx" ON "_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_order_idx" ON "_pages_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_parent_id_idx" ON "_pages_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_path_idx" ON "_pages_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_poster_image_idx" ON "_pages_v_blocks_video" USING btree ("poster_image_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_show_in_menu_idx" ON "_pages_v" USING btree ("version_show_in_menu");
  CREATE INDEX "_pages_v_version_version_show_in_toolbar_idx" ON "_pages_v" USING btree ("version_show_in_toolbar");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_pages_id_idx" ON "_pages_v_rels" USING btree ("pages_id");
  CREATE INDEX "_site_settings_v_version_footer_links_order_idx" ON "_site_settings_v_version_footer_links" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_footer_links_parent_id_idx" ON "_site_settings_v_version_footer_links" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_contact_form_order_idx" ON "_site_settings_v_blocks_contact_form" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_contact_form_parent_id_idx" ON "_site_settings_v_blocks_contact_form" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_contact_form_path_idx" ON "_site_settings_v_blocks_contact_form" USING btree ("_path");
  CREATE INDEX "_site_settings_v_blocks_content_grid_cells_order_idx" ON "_site_settings_v_blocks_content_grid_cells" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_content_grid_cells_parent_id_idx" ON "_site_settings_v_blocks_content_grid_cells" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_content_grid_order_idx" ON "_site_settings_v_blocks_content_grid" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_content_grid_parent_id_idx" ON "_site_settings_v_blocks_content_grid" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_content_grid_path_idx" ON "_site_settings_v_blocks_content_grid" USING btree ("_path");
  CREATE INDEX "_site_settings_v_blocks_hero_headline_order_idx" ON "_site_settings_v_blocks_hero_headline" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_hero_headline_parent_id_idx" ON "_site_settings_v_blocks_hero_headline" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_hero_headline_path_idx" ON "_site_settings_v_blocks_hero_headline" USING btree ("_path");
  CREATE INDEX "_site_settings_v_blocks_hero_subheadline_order_idx" ON "_site_settings_v_blocks_hero_subheadline" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_hero_subheadline_parent_id_idx" ON "_site_settings_v_blocks_hero_subheadline" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_hero_subheadline_path_idx" ON "_site_settings_v_blocks_hero_subheadline" USING btree ("_path");
  CREATE INDEX "_site_settings_v_blocks_hero_rich_text_order_idx" ON "_site_settings_v_blocks_hero_rich_text" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_hero_rich_text_parent_id_idx" ON "_site_settings_v_blocks_hero_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_hero_rich_text_path_idx" ON "_site_settings_v_blocks_hero_rich_text" USING btree ("_path");
  CREATE INDEX "_site_settings_v_blocks_hero_cta_links_order_idx" ON "_site_settings_v_blocks_hero_cta_links" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_hero_cta_links_parent_id_idx" ON "_site_settings_v_blocks_hero_cta_links" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_hero_cta_order_idx" ON "_site_settings_v_blocks_hero_cta" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_hero_cta_parent_id_idx" ON "_site_settings_v_blocks_hero_cta" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_hero_cta_path_idx" ON "_site_settings_v_blocks_hero_cta" USING btree ("_path");
  CREATE INDEX "_site_settings_v_blocks_hero_spacer_order_idx" ON "_site_settings_v_blocks_hero_spacer" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_hero_spacer_parent_id_idx" ON "_site_settings_v_blocks_hero_spacer" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_hero_spacer_path_idx" ON "_site_settings_v_blocks_hero_spacer" USING btree ("_path");
  CREATE INDEX "_site_settings_v_blocks_hero_order_idx" ON "_site_settings_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_hero_parent_id_idx" ON "_site_settings_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_hero_path_idx" ON "_site_settings_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_site_settings_v_blocks_hero_background_image_idx" ON "_site_settings_v_blocks_hero" USING btree ("background_image_id");
  CREATE INDEX "_site_settings_v_blocks_newsletter_signup_order_idx" ON "_site_settings_v_blocks_newsletter_signup" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_newsletter_signup_parent_id_idx" ON "_site_settings_v_blocks_newsletter_signup" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_newsletter_signup_path_idx" ON "_site_settings_v_blocks_newsletter_signup" USING btree ("_path");
  CREATE INDEX "_site_settings_v_blocks_rich_text_order_idx" ON "_site_settings_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_rich_text_parent_id_idx" ON "_site_settings_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_rich_text_path_idx" ON "_site_settings_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_site_settings_v_blocks_spacer_order_idx" ON "_site_settings_v_blocks_spacer" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_spacer_parent_id_idx" ON "_site_settings_v_blocks_spacer" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_spacer_path_idx" ON "_site_settings_v_blocks_spacer" USING btree ("_path");
  CREATE INDEX "_sti_v_buttons_order_idx" ON "_sti_v_buttons" USING btree ("_order");
  CREATE INDEX "_sti_v_buttons_parent_id_idx" ON "_sti_v_buttons" USING btree ("_parent_id");
  CREATE INDEX "_sti_v_order_idx" ON "_sti_v" USING btree ("_order");
  CREATE INDEX "_sti_v_parent_id_idx" ON "_sti_v" USING btree ("_parent_id");
  CREATE INDEX "_sti_v_path_idx" ON "_sti_v" USING btree ("_path");
  CREATE INDEX "_sti_v_image_idx" ON "_sti_v" USING btree ("image_id");
  CREATE INDEX "_sti_v_video_poster_idx" ON "_sti_v" USING btree ("video_poster_id");
  CREATE INDEX "_site_settings_v_blocks_table_order_idx" ON "_site_settings_v_blocks_table" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_table_parent_id_idx" ON "_site_settings_v_blocks_table" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_table_path_idx" ON "_site_settings_v_blocks_table" USING btree ("_path");
  CREATE INDEX "_site_settings_v_blocks_testimonials_testimonials_order_idx" ON "_site_settings_v_blocks_testimonials_testimonials" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_testimonials_testimonials_parent_id_idx" ON "_site_settings_v_blocks_testimonials_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_testimonials_order_idx" ON "_site_settings_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_testimonials_parent_id_idx" ON "_site_settings_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_testimonials_path_idx" ON "_site_settings_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_site_settings_v_blocks_video_order_idx" ON "_site_settings_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_site_settings_v_blocks_video_parent_id_idx" ON "_site_settings_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_blocks_video_path_idx" ON "_site_settings_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_site_settings_v_blocks_video_poster_image_idx" ON "_site_settings_v_blocks_video" USING btree ("poster_image_id");
  CREATE INDEX "_site_settings_v_version_version_logo_idx" ON "_site_settings_v" USING btree ("version_logo_id");
  CREATE INDEX "_site_settings_v_version_version_favicon_idx" ON "_site_settings_v" USING btree ("version_favicon_id");
  CREATE INDEX "_site_settings_v_version_splash_page_version_splash_page_idx" ON "_site_settings_v" USING btree ("version_splash_page_background_image_id");
  CREATE INDEX "_site_settings_v_version_version__status_idx" ON "_site_settings_v" USING btree ("version__status");
  CREATE INDEX "_site_settings_v_created_at_idx" ON "_site_settings_v" USING btree ("created_at");
  CREATE INDEX "_site_settings_v_updated_at_idx" ON "_site_settings_v" USING btree ("updated_at");
  CREATE INDEX "_site_settings_v_latest_idx" ON "_site_settings_v" USING btree ("latest");
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_splash_page_background_image_id_media_id_fk" FOREIGN KEY ("splash_page_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "site_settings_splash_page_splash_page_background_image_idx" ON "site_settings" USING btree ("splash_page_background_image_id");
  CREATE INDEX "site_settings__status_idx" ON "site_settings" USING btree ("_status");
  ALTER TABLE "site_settings" DROP COLUMN "styling_header_background_color";
  ALTER TABLE "site_settings" DROP COLUMN "styling_background_color";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_color1_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_color1";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_color2_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_color2";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_color3_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_color3";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_color4_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_color4";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_color5_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_color5";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_color6_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_color6";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_font_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_font_brand1_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_font_brand1";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_font_brand2_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_font_brand2";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_font_accent_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_font_highlight_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_font_highlight";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_accent_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_accent";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_highlight_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_highlight";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_newsletter_signup" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"button_label" varchar DEFAULT 'Subscribe',
  	"email_placeholder" varchar,
  	"success_message" varchar DEFAULT 'Thank you for subscribing!',
  	"mailchimp_action_url" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"csv_data" varchar NOT NULL,
  	"show_borders" boolean DEFAULT false,
  	"first_row_are_titles" boolean DEFAULT false,
  	"last_row_are_buttons" boolean DEFAULT false,
  	"button_links_csv" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "_pages_v_blocks_calendly_embed" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_content_grid_cells" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_content_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_headline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_subheadline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_cta_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_spacer" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_in_page_menu_title" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_logo_marquee_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_logo_marquee" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_spacer" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_split_text_image_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_split_text_image" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_testimonials_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_video" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_version_footer_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_contact_form" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_content_grid_cells" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_content_grid" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_hero_headline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_hero_subheadline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_hero_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_hero_cta_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_hero_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_hero_spacer" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_newsletter_signup" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_spacer" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_sti_v_buttons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_sti_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_table" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_testimonials_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v_blocks_video" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_site_settings_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_pages_v_blocks_calendly_embed" CASCADE;
  DROP TABLE "_pages_v_blocks_content_grid_cells" CASCADE;
  DROP TABLE "_pages_v_blocks_content_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_headline" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_subheadline" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_cta_links" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_spacer" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_in_page_menu_title" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_marquee_logos" CASCADE;
  DROP TABLE "_pages_v_blocks_logo_marquee" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_spacer" CASCADE;
  DROP TABLE "_pages_v_blocks_split_text_image_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_split_text_image" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_video" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "_site_settings_v_version_footer_links" CASCADE;
  DROP TABLE "_site_settings_v_blocks_contact_form" CASCADE;
  DROP TABLE "_site_settings_v_blocks_content_grid_cells" CASCADE;
  DROP TABLE "_site_settings_v_blocks_content_grid" CASCADE;
  DROP TABLE "_site_settings_v_blocks_hero_headline" CASCADE;
  DROP TABLE "_site_settings_v_blocks_hero_subheadline" CASCADE;
  DROP TABLE "_site_settings_v_blocks_hero_rich_text" CASCADE;
  DROP TABLE "_site_settings_v_blocks_hero_cta_links" CASCADE;
  DROP TABLE "_site_settings_v_blocks_hero_cta" CASCADE;
  DROP TABLE "_site_settings_v_blocks_hero_spacer" CASCADE;
  DROP TABLE "_site_settings_v_blocks_hero" CASCADE;
  DROP TABLE "_site_settings_v_blocks_newsletter_signup" CASCADE;
  DROP TABLE "_site_settings_v_blocks_rich_text" CASCADE;
  DROP TABLE "_site_settings_v_blocks_spacer" CASCADE;
  DROP TABLE "_sti_v_buttons" CASCADE;
  DROP TABLE "_sti_v" CASCADE;
  DROP TABLE "_site_settings_v_blocks_table" CASCADE;
  DROP TABLE "_site_settings_v_blocks_testimonials_testimonials" CASCADE;
  DROP TABLE "_site_settings_v_blocks_testimonials" CASCADE;
  DROP TABLE "_site_settings_v_blocks_video" CASCADE;
  DROP TABLE "_site_settings_v" CASCADE;
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_splash_page_background_image_id_media_id_fk";
  
  DROP INDEX "pages__status_idx";
  DROP INDEX "site_settings_splash_page_splash_page_background_image_idx";
  DROP INDEX "site_settings__status_idx";
  ALTER TABLE "pages_blocks_calendly_embed" ALTER COLUMN "url" SET NOT NULL;
  ALTER TABLE "pages_blocks_content_grid_cells" ALTER COLUMN "content" SET NOT NULL;
  ALTER TABLE "pages_blocks_hero_headline" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "pages_blocks_hero_subheadline" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "pages_blocks_hero_rich_text" ALTER COLUMN "content" SET NOT NULL;
  ALTER TABLE "pages_blocks_hero_cta_links" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "pages_blocks_hero_cta_links" ALTER COLUMN "url" SET NOT NULL;
  ALTER TABLE "pages_blocks_hero_spacer" ALTER COLUMN "height" SET NOT NULL;
  ALTER TABLE "pages_blocks_in_page_menu_title" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "pages_blocks_logo_marquee_logos" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "pages_blocks_rich_text" ALTER COLUMN "content" SET NOT NULL;
  ALTER TABLE "pages_blocks_spacer" ALTER COLUMN "height" SET NOT NULL;
  ALTER TABLE "pages_blocks_split_text_image_buttons" ALTER COLUMN "caption" SET NOT NULL;
  ALTER TABLE "pages_blocks_split_text_image_buttons" ALTER COLUMN "link" SET NOT NULL;
  ALTER TABLE "pages_blocks_split_text_image" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "pages_blocks_testimonials_testimonials" ALTER COLUMN "quote" SET NOT NULL;
  ALTER TABLE "pages_blocks_testimonials_testimonials" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "pages_blocks_video" ALTER COLUMN "vimeo_id" SET NOT NULL;
  ALTER TABLE "pages_blocks_video" ALTER COLUMN "poster_image_id" SET NOT NULL;
  ALTER TABLE "pages" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "pages" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "site_settings_footer_links" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "site_settings_footer_links" ALTER COLUMN "url" SET NOT NULL;
  ALTER TABLE "site_settings" ALTER COLUMN "site_title" SET NOT NULL;
  ALTER TABLE "site_settings" ADD COLUMN "styling_header_background_color" varchar DEFAULT 'transparent';
  ALTER TABLE "site_settings" ADD COLUMN "styling_background_color" varchar DEFAULT 'transparent';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_color1_label" varchar DEFAULT 'Color 1';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_color1" varchar DEFAULT '#5E6E83';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_color2_label" varchar DEFAULT 'Color 2';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_color2" varchar DEFAULT '#5E6E83';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_color3_label" varchar DEFAULT 'Color 3';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_color3" varchar DEFAULT '#B6C9BB';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_color4_label" varchar DEFAULT 'Color 4';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_color4" varchar DEFAULT '#BFEDC1';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_color5_label" varchar DEFAULT 'Color 5';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_color5" varchar DEFAULT '#EA8928';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_color6_label" varchar DEFAULT 'Color 6';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_color6" varchar DEFAULT '#656565';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_font_label" varchar DEFAULT 'Font Color';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_font_brand1_label" varchar DEFAULT 'Font Brand 1';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_font_brand1" varchar DEFAULT '#6b081d';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_font_brand2_label" varchar DEFAULT 'Font Brand 2';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_font_brand2" varchar DEFAULT '#f15b4e';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_font_accent_label" varchar DEFAULT 'Font Accent';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_font_highlight_label" varchar DEFAULT 'Font Highlight';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_font_highlight" varchar DEFAULT '#f15b4e';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_accent_label" varchar DEFAULT 'Accent';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_accent" varchar DEFAULT '#8B5A4A';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_highlight_label" varchar DEFAULT 'Highlight';
  ALTER TABLE "site_settings" ADD COLUMN "theme_colors_highlight" varchar DEFAULT '#f15b4e';
  ALTER TABLE "pages_blocks_newsletter_signup" ADD CONSTRAINT "pages_blocks_newsletter_signup_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_table" ADD CONSTRAINT "pages_blocks_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_newsletter_signup_order_idx" ON "pages_blocks_newsletter_signup" USING btree ("_order");
  CREATE INDEX "pages_blocks_newsletter_signup_parent_id_idx" ON "pages_blocks_newsletter_signup" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_newsletter_signup_path_idx" ON "pages_blocks_newsletter_signup" USING btree ("_path");
  CREATE INDEX "pages_blocks_table_order_idx" ON "pages_blocks_table" USING btree ("_order");
  CREATE INDEX "pages_blocks_table_parent_id_idx" ON "pages_blocks_table" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_table_path_idx" ON "pages_blocks_table" USING btree ("_path");
  ALTER TABLE "pages" DROP COLUMN "_status";
  ALTER TABLE "site_settings" DROP COLUMN "splash_page_background_image_id";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_theme1_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_theme2_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_theme3_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_theme4_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_theme5_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_theme6_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_theme7_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_theme8_label";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_main_bg";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_headings";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_button_font";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_button_bg";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_button_font_hover";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_button_bg_hover";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_table_borders";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_sticky_message_txt";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_sticky_message_bg";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_theme1";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_theme2";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_theme3";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_theme4";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_theme5";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_theme6";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_theme7";
  ALTER TABLE "site_settings" DROP COLUMN "theme_colors_theme8";
  ALTER TABLE "site_settings" DROP COLUMN "_status";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_content_grid_number_of_columns";
  DROP TYPE "public"."enum__pages_v_blocks_content_grid_horizontal_alignment";
  DROP TYPE "public"."enum__pages_v_blocks_content_grid_vertical_alignment";
  DROP TYPE "public"."enum__pages_v_blocks_hero_rich_text_layout";
  DROP TYPE "public"."enum__pages_v_blocks_hero_cta_links_variant";
  DROP TYPE "public"."enum__pages_v_blocks_hero_spacer_height";
  DROP TYPE "public"."enum__pages_v_blocks_hero_overlay";
  DROP TYPE "public"."enum__pages_v_blocks_hero_alignment";
  DROP TYPE "public"."enum__pages_v_blocks_hero_height";
  DROP TYPE "public"."enum__pages_v_blocks_logo_marquee_logo_size";
  DROP TYPE "public"."enum__pages_v_blocks_logo_marquee_speed";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_width";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_margin";
  DROP TYPE "public"."enum__pages_v_blocks_spacer_height";
  DROP TYPE "public"."enum__pages_v_blocks_split_text_image_media_type";
  DROP TYPE "public"."enum__pages_v_blocks_split_text_image_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_split_text_image_image_sizing_mode";
  DROP TYPE "public"."enum__pages_v_blocks_split_text_image_image_ratio";
  DROP TYPE "public"."enum__pages_v_blocks_split_text_image_image_vertical_margin";
  DROP TYPE "public"."enum__pages_v_blocks_split_text_image_image_horizontal_margin";
  DROP TYPE "public"."enum__pages_v_blocks_split_text_image_image_size";
  DROP TYPE "public"."enum__pages_v_blocks_split_text_image_text_container_margin";
  DROP TYPE "public"."enum__pages_v_blocks_video_width";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_site_settings_status";
  DROP TYPE "public"."enum__site_settings_v_blocks_content_grid_number_of_columns";
  DROP TYPE "public"."enum__site_settings_v_blocks_content_grid_horizontal_alignment";
  DROP TYPE "public"."enum__site_settings_v_blocks_content_grid_vertical_alignment";
  DROP TYPE "public"."enum__site_settings_v_blocks_hero_rich_text_layout";
  DROP TYPE "public"."enum__site_settings_v_blocks_hero_cta_links_variant";
  DROP TYPE "public"."enum__site_settings_v_blocks_hero_spacer_height";
  DROP TYPE "public"."enum__site_settings_v_blocks_hero_overlay";
  DROP TYPE "public"."enum__site_settings_v_blocks_hero_alignment";
  DROP TYPE "public"."enum__site_settings_v_blocks_hero_height";
  DROP TYPE "public"."enum__site_settings_v_blocks_rich_text_width";
  DROP TYPE "public"."enum__site_settings_v_blocks_rich_text_margin";
  DROP TYPE "public"."enum__site_settings_v_blocks_spacer_height";
  DROP TYPE "public"."enum__sti_v_media_type";
  DROP TYPE "public"."enum__sti_v_image_position";
  DROP TYPE "public"."enum__sti_v_image_sizing_mode";
  DROP TYPE "public"."enum__sti_v_image_ratio";
  DROP TYPE "public"."enum__sti_v_image_vertical_margin";
  DROP TYPE "public"."enum__sti_v_image_horizontal_margin";
  DROP TYPE "public"."enum__sti_v_image_size";
  DROP TYPE "public"."enum__sti_v_text_container_margin";
  DROP TYPE "public"."enum__site_settings_v_blocks_video_width";
  DROP TYPE "public"."enum__site_settings_v_version_styling_container_width";
  DROP TYPE "public"."enum__site_settings_v_version_styling_header_menu_alignment";
  DROP TYPE "public"."enum__site_settings_v_version_styling_header_height";
  DROP TYPE "public"."enum__site_settings_v_version_styling_logo_size";
  DROP TYPE "public"."enum__site_settings_v_version_status";`)
}
