import * as migration_20260214_152643 from './20260214_152643';
import * as migration_20260215_144800 from './20260215_144800';
import * as migration_20260215_152717 from './20260215_152717';
import * as migration_20260215_160625 from './20260215_160625';
import * as migration_20260222_153634 from './20260222_153634';
import * as migration_20260222_165716 from './20260222_165716';
import * as migration_20260317_203604_add_theme_colors from './20260317_203604_add_theme_colors';
import * as migration_20260317_215230 from './20260317_215230';
import * as migration_20260326_205722 from './20260326_205722';
import * as migration_20260326_210217 from './20260326_210217';
import * as migration_20260326_211523 from './20260326_211523';
import * as migration_20260329_074214 from './20260329_074214';
import * as migration_20260329_074840 from './20260329_074840';
import * as migration_20260329_103234_rework_theme_colors from './20260329_103234_rework_theme_colors';
import * as migration_20260407_222158 from './20260407_222158';
import * as migration_20260420_114911 from './20260420_114911';
import * as migration_20260503_093000_splash_page_overlay from './20260503_093000_splash_page_overlay';
import * as migration_20260503_101343_add_rotating_headline_block from './20260503_101343_add_rotating_headline_block';
import * as migration_20260503_120000_add_block_spacing from './20260503_120000_add_block_spacing';
import * as migration_20260507_190744_add_hero_rotating_headline_block from './20260507_190744_add_hero_rotating_headline_block';
import * as migration_20260507_193343_add_content_grid_cell_collapsed from './20260507_193343_add_content_grid_cell_collapsed';
import * as migration_20260507_194852_add_content_grid_cell_collapsed_lines from './20260507_194852_add_content_grid_cell_collapsed_lines';
import * as migration_20260507_195330_add_content_grid_collapsed_lines_12_16 from './20260507_195330_add_content_grid_collapsed_lines_12_16';
import * as migration_20260507_212426_add_hero_height_xxxl from './20260507_212426_add_hero_height_xxxl';
import * as migration_20260507_220000_add_content_grid_render_as_cards from './20260507_220000_add_content_grid_render_as_cards';
import * as migration_20260508_120000_hero_headlines_to_richtext from './20260508_120000_hero_headlines_to_richtext';
import * as migration_20260508_140000_add_content_grid_equal_row_heights from './20260508_140000_add_content_grid_equal_row_heights';
import * as migration_20260526_120000_add_site_title_color from './20260526_120000_add_site_title_color';
import * as migration_20260526_130000_add_in_page_menu_title_position from './20260526_130000_add_in_page_menu_title_position';
import * as migration_20260526_140000_add_show_home_in_menu from './20260526_140000_add_show_home_in_menu';
import * as migration_20260526_150000_add_menu_item_style from './20260526_150000_add_menu_item_style';
import * as migration_20260526_160000_add_hero_headline_font_size from './20260526_160000_add_hero_headline_font_size';
import * as migration_20260528_120000_add_toast from './20260528_120000_add_toast';
import * as migration_20260528_130000_add_rich_text_darken from './20260528_130000_add_rich_text_darken';
import * as migration_20260528_140000_add_anchor_block from './20260528_140000_add_anchor_block';
import * as migration_20260529_120000_add_rich_text_full_bleed from './20260529_120000_add_rich_text_full_bleed';
import * as migration_20260529_130000_add_content_grid_counter from './20260529_130000_add_content_grid_counter';
import * as migration_20260530_120000_add_content_grid_background_color from './20260530_120000_add_content_grid_background_color';
import * as migration_20260530_130000_add_content_grid_full_bleed from './20260530_130000_add_content_grid_full_bleed';
import * as migration_20260530_140000_add_content_grid_cell_dividers from './20260530_140000_add_content_grid_cell_dividers';
import * as migration_20260530_150000_add_hero_focal_point_x from './20260530_150000_add_hero_focal_point_x';
import * as migration_20260530_160000_add_menu_label from './20260530_160000_add_menu_label';
import * as migration_20260530_180000_add_menu_items_override from './20260530_180000_add_menu_items_override';
import * as migration_20260530_200000_add_menu_item_anchor from './20260530_200000_add_menu_item_anchor';
import * as migration_20260530_190000_remove_in_page_menu_title_block from './20260530_190000_remove_in_page_menu_title_block';
import * as migration_20260530_210000_rename_filter_to_override_main_menu from './20260530_210000_rename_filter_to_override_main_menu';
import * as migration_20260530_220000_add_bullet_points_color from './20260530_220000_add_bullet_points_color';
import * as migration_20260614_140000_item9_calendly_split from './20260614_140000_item9_calendly_split';

export const migrations = [
  {
    up: migration_20260214_152643.up,
    down: migration_20260214_152643.down,
    name: '20260214_152643',
  },
  {
    up: migration_20260215_144800.up,
    down: migration_20260215_144800.down,
    name: '20260215_144800',
  },
  {
    up: migration_20260215_152717.up,
    down: migration_20260215_152717.down,
    name: '20260215_152717',
  },
  {
    up: migration_20260215_160625.up,
    down: migration_20260215_160625.down,
    name: '20260215_160625',
  },
  {
    up: migration_20260222_153634.up,
    down: migration_20260222_153634.down,
    name: '20260222_153634',
  },
  {
    up: migration_20260222_165716.up,
    down: migration_20260222_165716.down,
    name: '20260222_165716',
  },
  {
    up: migration_20260317_203604_add_theme_colors.up,
    down: migration_20260317_203604_add_theme_colors.down,
    name: '20260317_203604_add_theme_colors',
  },
  {
    up: migration_20260317_215230.up,
    down: migration_20260317_215230.down,
    name: '20260317_215230',
  },
  {
    up: migration_20260326_205722.up,
    down: migration_20260326_205722.down,
    name: '20260326_205722',
  },
  {
    up: migration_20260326_210217.up,
    down: migration_20260326_210217.down,
    name: '20260326_210217',
  },
  {
    up: migration_20260326_211523.up,
    down: migration_20260326_211523.down,
    name: '20260326_211523',
  },
  {
    up: migration_20260329_074214.up,
    down: migration_20260329_074214.down,
    name: '20260329_074214',
  },
  {
    up: migration_20260329_074840.up,
    down: migration_20260329_074840.down,
    name: '20260329_074840',
  },
  {
    up: migration_20260329_103234_rework_theme_colors.up,
    down: migration_20260329_103234_rework_theme_colors.down,
    name: '20260329_103234_rework_theme_colors',
  },
  {
    up: migration_20260407_222158.up,
    down: migration_20260407_222158.down,
    name: '20260407_222158',
  },
  {
    up: migration_20260420_114911.up,
    down: migration_20260420_114911.down,
    name: '20260420_114911',
  },
  {
    up: migration_20260503_093000_splash_page_overlay.up,
    down: migration_20260503_093000_splash_page_overlay.down,
    name: '20260503_093000_splash_page_overlay',
  },
  {
    up: migration_20260503_101343_add_rotating_headline_block.up,
    down: migration_20260503_101343_add_rotating_headline_block.down,
    name: '20260503_101343_add_rotating_headline_block',
  },
  {
    up: migration_20260503_120000_add_block_spacing.up,
    down: migration_20260503_120000_add_block_spacing.down,
    name: '20260503_120000_add_block_spacing',
  },
  {
    up: migration_20260507_190744_add_hero_rotating_headline_block.up,
    down: migration_20260507_190744_add_hero_rotating_headline_block.down,
    name: '20260507_190744_add_hero_rotating_headline_block',
  },
  {
    up: migration_20260507_193343_add_content_grid_cell_collapsed.up,
    down: migration_20260507_193343_add_content_grid_cell_collapsed.down,
    name: '20260507_193343_add_content_grid_cell_collapsed',
  },
  {
    up: migration_20260507_194852_add_content_grid_cell_collapsed_lines.up,
    down: migration_20260507_194852_add_content_grid_cell_collapsed_lines.down,
    name: '20260507_194852_add_content_grid_cell_collapsed_lines',
  },
  {
    up: migration_20260507_195330_add_content_grid_collapsed_lines_12_16.up,
    down: migration_20260507_195330_add_content_grid_collapsed_lines_12_16.down,
    name: '20260507_195330_add_content_grid_collapsed_lines_12_16',
  },
  {
    up: migration_20260507_212426_add_hero_height_xxxl.up,
    down: migration_20260507_212426_add_hero_height_xxxl.down,
    name: '20260507_212426_add_hero_height_xxxl'
  },
  {
    up: migration_20260507_220000_add_content_grid_render_as_cards.up,
    down: migration_20260507_220000_add_content_grid_render_as_cards.down,
    name: '20260507_220000_add_content_grid_render_as_cards',
  },
  {
    up: migration_20260508_120000_hero_headlines_to_richtext.up,
    down: migration_20260508_120000_hero_headlines_to_richtext.down,
    name: '20260508_120000_hero_headlines_to_richtext',
  },
  {
    up: migration_20260508_140000_add_content_grid_equal_row_heights.up,
    down: migration_20260508_140000_add_content_grid_equal_row_heights.down,
    name: '20260508_140000_add_content_grid_equal_row_heights',
  },
  {
    up: migration_20260526_120000_add_site_title_color.up,
    down: migration_20260526_120000_add_site_title_color.down,
    name: '20260526_120000_add_site_title_color',
  },
  {
    up: migration_20260526_130000_add_in_page_menu_title_position.up,
    down: migration_20260526_130000_add_in_page_menu_title_position.down,
    name: '20260526_130000_add_in_page_menu_title_position',
  },
  {
    up: migration_20260526_140000_add_show_home_in_menu.up,
    down: migration_20260526_140000_add_show_home_in_menu.down,
    name: '20260526_140000_add_show_home_in_menu',
  },
  {
    up: migration_20260526_150000_add_menu_item_style.up,
    down: migration_20260526_150000_add_menu_item_style.down,
    name: '20260526_150000_add_menu_item_style',
  },
  {
    up: migration_20260526_160000_add_hero_headline_font_size.up,
    down: migration_20260526_160000_add_hero_headline_font_size.down,
    name: '20260526_160000_add_hero_headline_font_size',
  },
  {
    up: migration_20260528_120000_add_toast.up,
    down: migration_20260528_120000_add_toast.down,
    name: '20260528_120000_add_toast',
  },
  {
    up: migration_20260528_130000_add_rich_text_darken.up,
    down: migration_20260528_130000_add_rich_text_darken.down,
    name: '20260528_130000_add_rich_text_darken',
  },
  {
    up: migration_20260528_140000_add_anchor_block.up,
    down: migration_20260528_140000_add_anchor_block.down,
    name: '20260528_140000_add_anchor_block',
  },
  {
    up: migration_20260529_120000_add_rich_text_full_bleed.up,
    down: migration_20260529_120000_add_rich_text_full_bleed.down,
    name: '20260529_120000_add_rich_text_full_bleed',
  },
  {
    up: migration_20260529_130000_add_content_grid_counter.up,
    down: migration_20260529_130000_add_content_grid_counter.down,
    name: '20260529_130000_add_content_grid_counter',
  },
  {
    up: migration_20260530_120000_add_content_grid_background_color.up,
    down: migration_20260530_120000_add_content_grid_background_color.down,
    name: '20260530_120000_add_content_grid_background_color',
  },
  {
    up: migration_20260530_130000_add_content_grid_full_bleed.up,
    down: migration_20260530_130000_add_content_grid_full_bleed.down,
    name: '20260530_130000_add_content_grid_full_bleed',
  },
  {
    up: migration_20260530_140000_add_content_grid_cell_dividers.up,
    down: migration_20260530_140000_add_content_grid_cell_dividers.down,
    name: '20260530_140000_add_content_grid_cell_dividers',
  },
  {
    up: migration_20260530_150000_add_hero_focal_point_x.up,
    down: migration_20260530_150000_add_hero_focal_point_x.down,
    name: '20260530_150000_add_hero_focal_point_x',
  },
  {
    up: migration_20260530_160000_add_menu_label.up,
    down: migration_20260530_160000_add_menu_label.down,
    name: '20260530_160000_add_menu_label',
  },
  {
    up: migration_20260530_180000_add_menu_items_override.up,
    down: migration_20260530_180000_add_menu_items_override.down,
    name: '20260530_180000_add_menu_items_override',
  },
  {
    up: migration_20260530_190000_remove_in_page_menu_title_block.up,
    down: migration_20260530_190000_remove_in_page_menu_title_block.down,
    name: '20260530_190000_remove_in_page_menu_title_block',
  },
  {
    up: migration_20260530_200000_add_menu_item_anchor.up,
    down: migration_20260530_200000_add_menu_item_anchor.down,
    name: '20260530_200000_add_menu_item_anchor',
  },
  {
    up: migration_20260530_210000_rename_filter_to_override_main_menu.up,
    down: migration_20260530_210000_rename_filter_to_override_main_menu.down,
    name: '20260530_210000_rename_filter_to_override_main_menu',
  },
  {
    up: migration_20260530_220000_add_bullet_points_color.up,
    down: migration_20260530_220000_add_bullet_points_color.down,
    name: '20260530_220000_add_bullet_points_color',
  },
  {
    up: migration_20260614_140000_item9_calendly_split.up,
    down: migration_20260614_140000_item9_calendly_split.down,
    name: '20260614_140000_item9_calendly_split',
  },
];
