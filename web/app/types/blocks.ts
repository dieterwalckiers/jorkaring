import type { Media } from './media'

export interface ContentGridCell {
  id?: string
  content: unknown // Rich text content (Lexical format)
}

export interface ContentGridBlock {
  id: string
  blockType: 'contentGrid'
  cells: ContentGridCell[]
  numberOfColumns?: '2' | '3' | '4' | '5'
  horizontalAlignment?: 'left' | 'center' | 'right'
  verticalAlignment?: 'top' | 'center' | 'bottom'
}

export interface HeroLink {
  label: string
  url: string
  variant?: 'solid' | 'outline' | 'ghost'
  id?: string
}

export interface HeroBlock {
  id: string
  blockType: 'hero'
  headline?: string
  subheadline?: string
  backgroundImage?: Media | string
  focalPointY?: number
  alignment?: 'left' | 'center' | 'right'
  height?: 'small' | 'medium' | 'large' | 'xl' | 'xxl'
  links?: HeroLink[]
}

export type RichTextWidth = '1/4' | '1/3' | 'half' | '2/3' | '3/4' | 'full'

export type RichTextMargin = 'none' | 'small' | 'medium' | 'large'

export interface RichTextBlock {
  id: string
  blockType: 'richText'
  content: unknown
  width?: RichTextWidth
  renderFloating?: boolean
  floatingOffset?: string
  margin?: RichTextMargin
  backgroundColor?: string
  roundedCorners?: boolean
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
export type ContentBlock = ContactFormBlock | ContentGridBlock | HeroBlock | NewsletterSignupBlock | RichTextBlock | SpacerBlock | SplitTextImageBlock | TableBlock | TestimonialsBlock | VideoBlock
