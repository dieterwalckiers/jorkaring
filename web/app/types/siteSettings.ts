import type { Media } from './media'
import type { ContentBlock } from './blocks'

export type ContainerWidth = 'narrower' | 'default' | 'wider'
export type HeaderMenuAlignment = 'left' | 'center' | 'right'
export type HeaderHeight = 'small' | 'medium' | 'large' | 'xl' | '2xl'
export type LogoSize = 'small' | 'medium' | 'large' | 'xl'
export type BlockSpacing = 'tight' | 'narrower' | 'default' | 'wider' | 'spacious'

export interface SiteStyling {
  containerWidth?: ContainerWidth
  headerMenuAlignment?: HeaderMenuAlignment
  headerHeight?: HeaderHeight
  headerBorder?: boolean
  logoSize?: LogoSize
  blockSpacing?: BlockSpacing
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

export type SplashOverlay = 'none' | 'darken' | 'lighten'

export interface SplashPage {
  enabled?: boolean
  backgroundImage?: Media | string
  backgroundOverlay?: SplashOverlay
  backgroundOverlayStrength?: number
  centered?: boolean
  content?: ContentBlock[]
}

export interface SiteThemeColors {
  // System
  mainBg?: string
  font?: string
  fontAccent?: string
  headings?: string
  buttonFont?: string
  buttonBg?: string
  buttonFontHover?: string
  buttonBgHover?: string
  tableBorders?: string
  stickyMessageTxt?: string
  stickyMessageBg?: string
  // Theme
  theme1?: string
  theme2?: string
  theme3?: string
  theme4?: string
  theme5?: string
  theme6?: string
  theme7?: string
  theme8?: string
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
