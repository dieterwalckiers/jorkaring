import type { Block } from 'payload'

export { CalendlyEmbed } from './CalendlyEmbed'
export { ContactForm } from './ContactForm'
export { ContentGrid } from './ContentGrid'
export { Hero } from './Hero'
export { InPageMenuTitle } from './InPageMenuTitle'
export { LogoMarquee } from './LogoMarquee'
export { NewsletterSignup } from './NewsletterSignup'
export { RichText } from './RichText'
export { Spacer } from './Spacer'
export { SplitTextImage } from './SplitTextImage'
export { Table } from './Table'
export { Testimonials } from './Testimonials'
export { Video } from './Video'

// Re-import all blocks to build the registry
import { CalendlyEmbed } from './CalendlyEmbed'
import { ContactForm } from './ContactForm'
import { ContentGrid } from './ContentGrid'
import { Hero } from './Hero'
import { InPageMenuTitle } from './InPageMenuTitle'
import { LogoMarquee } from './LogoMarquee'
import { NewsletterSignup } from './NewsletterSignup'
import { RichText } from './RichText'
import { Spacer } from './Spacer'
import { SplitTextImage } from './SplitTextImage'
import { Table } from './Table'
import { Testimonials } from './Testimonials'
import { Video } from './Video'

const allBlocks: Block[] = [
  CalendlyEmbed,
  ContactForm,
  ContentGrid,
  Hero,
  InPageMenuTitle,
  LogoMarquee,
  NewsletterSignup,
  RichText,
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
