/**
 * Client feedback — Item 9
 * Calendly page (boek-je-gesprek-in, id 59) split layout: text LEFT, embed RIGHT.
 *
 * Populates the page's single existing `calendlyEmbed` block with:
 *  - text:         a lexical richtext column (heading + intro + contact line + icon paragraphs)
 *  - textPosition: 'left'
 *  - keeps the block's existing `url` and `style`
 *
 * The email/phone/socials icon paragraphs (with their working mailto / instagram /
 * linkedin links + inline icon blocks) are sourced at runtime from page 56's
 * `splitTextImage` block named "contact details" (children index 3=email, 4=phone,
 * 5=socials), since the dedicated contact page (id 60) was deleted in item 6.
 *
 * Idempotent: no-ops if the block's text already contains the "Boek hier je
 * vrijblijvende" heading. Uses context: { skipDeploy: true }.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const PAGE_ID = 59
const CONTACT_SOURCE_PAGE_ID = 56
const CONTACT_BLOCK_NAME = 'contact details'
const HEADING_TEXT = 'Boek hier je vrijblijvende gesprek in'

const textNode = (text: string, style = '') => ({
  mode: 'normal',
  text,
  type: 'text',
  style,
  detail: 0,
  format: 0,
  version: 1,
})

const heading = (text: string, tag = 'h2') => ({
  tag,
  type: 'heading',
  format: '',
  indent: 0,
  version: 1,
  direction: null,
  children: [textNode(text)],
})

const paragraph = (children: unknown[], format = '') => ({
  type: 'paragraph',
  format,
  indent: 0,
  version: 1,
  direction: null,
  textStyle: '',
  textFormat: 0,
  children,
})

async function run() {
  const payload = await getPayload({ config })

  const page = await payload.findByID({ collection: 'pages', id: PAGE_ID, depth: 0 })
  const content = (page.content ?? []) as Array<Record<string, any>>

  const block = content.find((b) => b.blockType === 'calendlyEmbed')
  if (!block) {
    console.error('No calendlyEmbed block found on page 59 — aborting.')
    process.exit(1)
    return
  }

  const existingChildren: unknown[] = block.text?.root?.children ?? []
  const alreadyApplied = existingChildren.some((c) => {
    const node = c as Record<string, any>
    const kids: unknown[] = node?.children ?? []
    return (
      node?.type === 'heading' &&
      kids.some((k) => (k as Record<string, any>)?.text?.includes?.('Boek hier je vrijblijvende'))
    )
  })
  if (alreadyApplied) {
    console.log('Item 9 already applied — skipping.')
    return
  }

  // Source the icon paragraphs (email / phone / socials) from page 56's contact block.
  const sourcePage = await payload.findByID({
    collection: 'pages',
    id: CONTACT_SOURCE_PAGE_ID,
    depth: 0,
  })
  const sourceContent = (sourcePage.content ?? []) as Array<Record<string, any>>
  const contactBlock = sourceContent.find(
    (b) => b.blockType === 'splitTextImage' && b.blockName === CONTACT_BLOCK_NAME,
  )
  const contactChildren: unknown[] = contactBlock?.text?.root?.children ?? []
  // index 3 = email (at icon + mailto autolink), 4 = phone, 5 = instagram + linkedin
  const iconParagraphs = [contactChildren[3], contactChildren[4], contactChildren[5]].filter(
    Boolean,
  )

  if (iconParagraphs.length !== 3) {
    console.error(
      `Expected 3 icon paragraphs from page 56 "${CONTACT_BLOCK_NAME}", found ${iconParagraphs.length} — aborting.`,
    )
    process.exit(1)
    return
  }

  block.text = {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: null,
      children: [
        heading(HEADING_TEXT, 'h2'),
        paragraph([
          textNode(
            'Klaar om weer voluit te leven of je werking te optimaliseren? Prik een momentje bij me in. Tijdens een vrijblijvend kennismakingsgesprek bekijken we samen hoe jij of je bedrijf duurzaam vooruit kan.',
          ),
        ]),
        paragraph([
          textNode(
            'Vragen, bemerkingen of een vrijblijvende offerte nodig? Contacteer me gerust.',
          ),
        ]),
        ...iconParagraphs,
      ],
    },
  }
  block.textPosition = 'left'
  if (block.textPercentage == null) block.textPercentage = 45

  await payload.update({
    collection: 'pages',
    id: PAGE_ID,
    data: { content } as never,
    context: { skipDeploy: true },
  })

  console.log('Item 9 applied: Calendly page now has text (left) + embed (right) split layout.')
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
