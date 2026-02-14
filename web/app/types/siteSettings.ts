import type { Media } from './media'

export type ContainerWidth = 'narrower' | 'default' | 'wider'
export type HeaderMenuAlignment = 'left' | 'center' | 'right'
export type HeaderHeight = 'small' | 'medium' | 'large' | 'xl' | '2xl'
export type LogoSize = 'small' | 'medium' | 'large' | 'xl'

export interface SiteStyling {
  containerWidth?: ContainerWidth
  headerMenuAlignment?: HeaderMenuAlignment
  headerHeight?: HeaderHeight
  headerBorder?: boolean
  logoSize?: LogoSize
  headerBackgroundColor?: string
  backgroundColor?: string
  googleFont?: string
}

export interface FooterLink {
  id?: string
  text: string
  url: string
}

export interface SiteFooter {
  links?: FooterLink[]
}

export interface SiteHeadContent {
  leading?: string
  tailing?: string
}

export interface SiteStickyMessage {
  content?: Record<string, unknown>
  closeable?: boolean
}

export interface SiteCookieConsent {
  enabled?: boolean
  message?: string
  acceptLabel?: string
  policyUrl?: string
  policyLinkText?: string
}

export interface SiteSettings {
  id: string
  siteTitle: string
  logo?: Media | string
  favicon?: Media | string
  styling?: SiteStyling
  footer?: SiteFooter
  headContent?: SiteHeadContent
  cookieConsent?: SiteCookieConsent
  stickyMessage?: SiteStickyMessage
  createdAt: string
  updatedAt: string
}
