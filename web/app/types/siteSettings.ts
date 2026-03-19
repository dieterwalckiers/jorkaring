import type { Media } from './media'
import type { ContentBlock } from './blocks'

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
  googleFontBody?: string
  googleFontH1?: string
  googleFontHeadings?: string
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

export interface SplashPage {
  enabled?: boolean
  centered?: boolean
  content?: ContentBlock[]
}

export interface SiteThemeColors {
  color1?: string
  color2?: string
  color3?: string
  color4?: string
  color5?: string
  color6?: string
  font?: string
  fontBrand1?: string
  fontBrand2?: string
  fontAccent?: string
  fontHighlight?: string
  accent?: string
  highlight?: string
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
  splashPage?: SplashPage
  themeColors?: SiteThemeColors
  createdAt: string
  updatedAt: string
}
