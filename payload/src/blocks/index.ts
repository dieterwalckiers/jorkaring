import type { Block } from 'payload'

export { Anchor } from './Anchor'
export { CalendlyEmbed } from './CalendlyEmbed'
export { ContactForm } from './ContactForm'
export { ContentGrid } from './ContentGrid'
export { Hero } from './Hero'
export { LogoMarquee } from './LogoMarquee'
export { NewsletterSignup } from './NewsletterSignup'
export { RichText } from './RichText'
export { RotatingHeadline } from './RotatingHeadline'
export { Spacer } from './Spacer'
export { SplitTextImage } from './SplitTextImage'
export { Table } from './Table'
export { Testimonials } from './Testimonials'
export { Video } from './Video'

// Re-import all blocks to build the registry
import { Anchor } from './Anchor'
import { CalendlyEmbed } from './CalendlyEmbed'
import { ContactForm } from './ContactForm'
import { ContentGrid } from './ContentGrid'
import { Hero } from './Hero'
import { LogoMarquee } from './LogoMarquee'
import { NewsletterSignup } from './NewsletterSignup'
import { RichText } from './RichText'
import { RotatingHeadline } from './RotatingHeadline'
import { Spacer } from './Spacer'
import { SplitTextImage } from './SplitTextImage'
import { Table } from './Table'
import { Testimonials } from './Testimonials'
import { Video } from './Video'

const allBlocks: Block[] = [
  Anchor,
  CalendlyEmbed,
  ContactForm,
  ContentGrid,
  Hero,
  LogoMarquee,
  NewsletterSignup,
  RichText,
  RotatingHeadline,
  Spacer,
  SplitTextImage,
  Table,
  Testimonials,
  Video,
]

// Add block slugs here to hide them from the editor
const hiddenBlockSlugs: string[] = ["contactForm", "newsletterSignup", "table"]

export const pageBlocks = allBlocks.filter(
  (block) => !hiddenBlockSlugs.includes(block.slug),
)
