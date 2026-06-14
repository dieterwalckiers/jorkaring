/**
 * Client feedback — Item 1
 * Contact block at the bottom of the individu homepage (voor-particulieren, id 56).
 *
 * Appends:
 *  - a SplitTextImage (foto links / tekst rechts), reusing the hero photo (media 200),
 *    with the "Ben je klaar..." headline + subline + a Calendly button.
 *  - a RichText block below it with the contact details (reuses the existing
 *    contact-page email/phone-with-icons richtext), prefixed with the "Nog vragen?" line.
 *
 * Idempotent: skips if a block tagged blockName 'item1-contact-cta' already exists.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const PAGE_ID = 56
const CONTACT_PAGE_ID = 60
const HERO_MEDIA_ID = 200
const MARKER = 'item1-contact-cta'

const textNode = (text: string, style = '') => ({
  mode: 'normal',
  text,
  type: 'text',
  style,
  detail: 0,
  format: 0,
  version: 1,
})

const heading = (text: string) => ({
  tag: 'h2',
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
  const content = (page.content ?? []) as Array<Record<string, unknown>>

  if (content.some((b) => b.blockName === MARKER)) {
    console.log('Item 1 already applied — skipping.')
    return
  }

  // Reuse the existing contact-page richtext (email + phone with inline icons).
  const contactPage = await payload.findByID({
    collection: 'pages',
    id: CONTACT_PAGE_ID,
    depth: 0,
  })
  const contactBlock = (contactPage.content ?? [])[0] as Record<string, any>
  const contactRoot = contactBlock?.content?.root
  const contactChildren: unknown[] = contactRoot?.children ?? []

  const splitBlock = {
    blockType: 'splitTextImage',
    blockName: MARKER,
    text: {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        direction: null,
        children: [
          heading('Ben je klaar om alles uit het leven te halen en je rug je leven niet te laten bepalen?'),
          paragraph([
            textNode('Boek dan je vrijblijvende kennismakingsgesprek met me in via de knop hieronder.'),
          ]),
        ],
      },
    },
    buttons: [{ caption: 'Boek je vrijblijvend gesprek in', link: '/boek-je-gesprek-in' }],
    mediaType: 'image',
    image: HERO_MEDIA_ID,
    focalPointX: 50,
    focalPointY: 25,
    imagePosition: 'left',
    imagePercentage: 45,
    imageSizingMode: 'ratio',
    imageRatio: '4/5',
    imageVerticalMargin: 'medium',
    imageHorizontalMargin: 'none',
    textContainerMargin: 'medium',
  }

  const contactCtaBlock = {
    blockType: 'richText',
    blockName: 'item1-contact-details',
    variant: 'body',
    width: 'full',
    margin: 'small',
    content: {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        direction: null,
        children: [
          paragraph(
            [textNode('Nog vragen of bedenkingen? Neem gerust eerst contact met me op:')],
            'center',
          ),
          ...contactChildren,
        ],
      },
    },
  }

  const newContent = [...content, splitBlock, contactCtaBlock]

  await payload.update({
    collection: 'pages',
    id: PAGE_ID,
    data: { content: newContent } as never,
    context: { skipDeploy: true },
  })

  console.log('Item 1 applied: appended contact SplitTextImage + contact-details RichText to voor-particulieren.')
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
