import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Wraps a varchar value in a Lexical document so we can convert the existing
// HeroHeadline / HeroSubheadline `text` columns from varchar to jsonb without
// data loss. Editors keep what they wrote; new rows get the same shape.
const TO_LEXICAL_USING = (column: string) => `
  jsonb_build_object(
    'root', jsonb_build_object(
      'type', 'root',
      'format', '',
      'indent', 0,
      'version', 1,
      'direction', 'ltr',
      'children', jsonb_build_array(
        jsonb_build_object(
          'type', 'paragraph',
          'format', '',
          'indent', 0,
          'version', 1,
          'direction', 'ltr',
          'textFormat', 0,
          'textStyle', '',
          'children', CASE
            WHEN ${column} IS NULL OR ${column} = '' THEN '[]'::jsonb
            ELSE jsonb_build_array(
              jsonb_build_object(
                'type', 'text',
                'format', 0,
                'style', '',
                'mode', 'normal',
                'detail', 0,
                'version', 1,
                'text', ${column}
              )
            )
          END
        )
      )
    )
  )
`

// Reverse: pull the first text node back out into a varchar. Lossy (color
// styling is dropped) but enough to roll back the schema change cleanly.
const TO_VARCHAR_USING = (column: string) => `
  COALESCE(
    ${column} #>> '{root,children,0,children,0,text}',
    ''
  )
`

const TABLES_TEXT_REQUIRED = [
  'pages_blocks_hero_headline',
  'pages_blocks_hero_subheadline',
] as const

const TABLES_TEXT_NULLABLE = [
  '_pages_v_blocks_hero_headline',
  '_pages_v_blocks_hero_subheadline',
  'site_settings_blocks_hero_headline',
  'site_settings_blocks_hero_subheadline',
  '_site_settings_v_blocks_hero_headline',
  '_site_settings_v_blocks_hero_subheadline',
] as const

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const table of TABLES_TEXT_REQUIRED) {
    await db.execute(sql.raw(`
      ALTER TABLE "${table}"
        ALTER COLUMN "text" DROP NOT NULL,
        ALTER COLUMN "text" TYPE jsonb USING ${TO_LEXICAL_USING(`"text"`)},
        ALTER COLUMN "text" SET NOT NULL;
    `))
  }

  for (const table of TABLES_TEXT_NULLABLE) {
    await db.execute(sql.raw(`
      ALTER TABLE "${table}"
        ALTER COLUMN "text" TYPE jsonb USING ${TO_LEXICAL_USING(`"text"`)};
    `))
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const table of TABLES_TEXT_REQUIRED) {
    await db.execute(sql.raw(`
      ALTER TABLE "${table}"
        ALTER COLUMN "text" DROP NOT NULL,
        ALTER COLUMN "text" TYPE varchar USING ${TO_VARCHAR_USING(`"text"`)},
        ALTER COLUMN "text" SET NOT NULL;
    `))
  }

  for (const table of TABLES_TEXT_NULLABLE) {
    await db.execute(sql.raw(`
      ALTER TABLE "${table}"
        ALTER COLUMN "text" TYPE varchar USING ${TO_VARCHAR_USING(`"text"`)};
    `))
  }
}
