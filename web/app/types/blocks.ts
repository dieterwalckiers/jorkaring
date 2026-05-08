import type { Media } from './media'

export interface CalendlyEmbedBlock {
  id: string
  blockType: 'calendlyEmbed'
  url: string
  style?: string
}

export interface ContentGridCell {
  id?: string
  content: unknown // Rich text content (Lexical format)
  collapsedByDefault?: boolean
  collapsedLines?: '5' | '8' | '12' | '16' | '20'
}

export interface ContentGridBlock {
  id: string
  blockType: 'contentGrid'
  cells: ContentGridCell[]
  numberOfColumns?: '2' | '3' | '4' | '5'
  horizontalAlignment?: 'left' | 'center' | 'right'
  verticalAlignment?: 'top' | 'center' | 'bottom'
  editorialNumbers?: boolean
  renderAsCards?: boolean
  cardBackground?: 'lighten' | 'darken'
  cardRoundedCorners?: boolean
  equalRowHeights?: boolean
}

export interface HeroHeadlineBlock {
  id: string
  blockType: 'heroHeadline'
  text: unknown // Rich text content (Lexical format) — color-only formatting
}

export interface HeroSubheadlineBlock {
  id: string
  blockType: 'heroSubheadline'
  text: unknown // Rich text content (Lexical format) — color-only formatting
}

export type HeroRichTextLayout = 'full' | 'left' | 'right'

export interface HeroRichTextBlock {
  id: string
  blockType: 'heroRichText'
  content: unknown
  layout?: HeroRichTextLayout
}

export interface HeroCtaLink {
  id?: string
  label: string
  url: string
  variant?: 'solid' | 'outline' | 'ghost'
}

export interface HeroCtaBlock {
  id: string
  blockType: 'heroCta'
  links: HeroCtaLink[]
}

export interface HeroSpacerBlock {
  id: string
  blockType: 'heroSpacer'
  height: 'xs' | 'small' | 'medium' | 'large' | 'xl'
}

export interface HeroRotatingHeadlineWord {
  id?: string
  word: string
}

export interface HeroRotatingHeadlineBlock {
  id: string
  blockType: 'heroRotatingHeadline'
  prefix?: string
  rotatingWords: HeroRotatingHeadlineWord[]
  suffix?: string
  intervalMs?: number
}

export type HeroContentBlock = HeroHeadlineBlock | HeroSubheadlineBlock | HeroRichTextBlock | HeroCtaBlock | HeroRotatingHeadlineBlock | HeroSpacerBlock

export interface HeroBlock {
  id: string
  blockType: 'hero'
  backgroundImage?: Media | string
  focalPointY?: number
  overlay?: 'none' | 'darken' | 'lighten'
  overlayStrength?: number
  alignment?: 'left' | 'center' | 'right'
  height?: 'small' | 'medium' | 'large' | 'xl' | 'xxl' | 'xxxl'
  content?: HeroContentBlock[]
}

export type RichTextWidth = '1/4' | '1/3' | 'half' | '2/3' | '3/4' | 'full'

export type RichTextMargin = 'none' | 'small' | 'medium' | 'large'

export type RichTextVariant = 'body' | 'hero' | 'longForm'

export interface RichTextBlock {
  id: string
  blockType: 'richText'
  content: unknown
  variant?: RichTextVariant
  width?: RichTextWidth
  renderFloating?: boolean
  floatingOffset?: string
  margin?: RichTextMargin
  backgroundColor?: string
  roundedCorners?: boolean
}

export interface RotatingHeadlineWord {
  id?: string
  word: string
}

export interface RotatingHeadlineBlock {
  id: string
  blockType: 'rotatingHeadline'
  prefix?: string
  rotatingWords: RotatingHeadlineWord[]
  suffix?: string
  alignment?: 'left' | 'center' | 'right'
  intervalMs?: number
}

export interface SplitTextImageButton {
  id?: string
  caption: string
  link: string
}

export interface SplitTextImageBlock {
  id: string
  blockType: 'splitTextImage'
  text: unknown // Rich text content (Lexical format)
  buttons?: SplitTextImageButton[]
  mediaType?: 'image' | 'video'
  // Image fields
  image?: Media | string
  focalPointX?: number
  focalPointY?: number
  // Video fields
  vimeoId?: string
  videoPoster?: Media | string
  videoCtaCaption?: string
  // Layout fields
  imagePosition?: 'left' | 'right'
  imagePercentage?: number
  imageSizingMode?: 'ratio' | 'natural'
  imageRatio?: '2/3' | '3/4' | '4/5' | '5/6' | '9/10' | '1/1' | '10/9' | '6/5' | '5/4' | '4/3' | '3/2'
  imageVerticalMargin?: 'none' | 'small' | 'medium' | 'large'
  imageHorizontalMargin?: 'none' | 'small' | 'medium' | 'large'
  imageSize?: 'tiny-icon' | 'small-icon' | 'icon' | 'large-icon' | 'tiny' | 'small' | 'medium' | 'large' | 'xlarge' | 'huge'
  textContainerMargin?: 'none' | 'small' | 'medium' | 'large'
  backgroundColor?: string
  fullBleed?: boolean
  roundedCorners?: boolean
  collapsedByDefault?: boolean
  startNumberedListAtZero?: boolean
}

export interface TableBlock {
  id: string
  blockType: 'table'
  csvData: string
  showBorders?: boolean
  firstRowAreTitles?: boolean
  lastRowAreButtons?: boolean
  buttonLinksCsv?: string
}

export interface Testimonial {
  id?: string
  quote: string
  name: string
}

export interface TestimonialsBlock {
  id: string
  blockType: 'testimonials'
  testimonials: Testimonial[]
}

export interface InPageMenuTitleBlock {
  id: string
  blockType: 'inPageMenuTitle'
  title: string
}

export interface SpacerBlock {
  id: string
  blockType: 'spacer'
  height: 'xxxs' | 'xxs' | 'xs' | 'small' | 'medium' | 'large' | 'xl' | 'xxl' | 'xxxl'
}

export interface ContactFormBlock {
  id: string
  blockType: 'contactForm'
  tallyFormId: string
}

export type VideoWidth = 'half' | '2/3' | '3/4' | 'full'

export interface VideoBlock {
  id: string
  blockType: 'video'
  vimeoId: string
  posterImage: Media | string
  ctaCaption?: string
  width?: VideoWidth
}

export interface LogoMarqueeItem {
  id?: string
  image: Media | string
  alt?: string
}

export interface LogoMarqueeBlock {
  id: string
  blockType: 'logoMarquee'
  logos: LogoMarqueeItem[]
  logoSize?: 'small' | 'medium' | 'large'
  speed?: 'slow' | 'medium' | 'fast'
  pauseOnHover?: boolean
}

export interface NewsletterSignupBlock {
  id: string
  blockType: 'newsletterSignup'
  heading?: string
  description?: string
  buttonLabel?: string
  emailPlaceholder?: string
  successMessage?: string
  mailchimpActionUrl: string
}

// Union type for all block types - add more as they are created
export type ContentBlock = CalendlyEmbedBlock | ContactFormBlock | ContentGridBlock | HeroBlock | InPageMenuTitleBlock | LogoMarqueeBlock | NewsletterSignupBlock | RichTextBlock | RotatingHeadlineBlock | SpacerBlock | SplitTextImageBlock | TableBlock | TestimonialsBlock | VideoBlock
