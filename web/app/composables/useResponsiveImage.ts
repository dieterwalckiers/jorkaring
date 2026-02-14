import type { Media } from '~/types/media'

export interface ResponsiveImageData {
  src: string
  srcset: string
  sizes: string
  alt: string
  width?: number
  height?: number
}

type SizeName = 'thumbnail' | 'small' | 'medium' | 'large'

const SIZE_WIDTHS: Record<SizeName, number> = {
  thumbnail: 400,
  small: 600,
  medium: 900,
  large: 1200,
}

/**
 * Build srcset and sizes attributes for responsive images using Payload's pre-generated sizes.
 *
 * @param media - The Media object from Payload CMS
 * @param defaultSizes - CSS sizes attribute (defaults to responsive full-width)
 * @returns Object with src, srcset, sizes, alt, width, height
 */
export function useResponsiveImage(
  media: Media | string | null | undefined,
  defaultSizes = '(max-width: 600px) 100vw, (max-width: 900px) 900px, 1200px'
): ResponsiveImageData | null {
  if (!media || typeof media === 'string') return null

  const baseUrl = usePayloadBaseUrl()

  const getAbsoluteUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    return `${baseUrl}${url}`
  }

  // Build srcset from available sizes
  const srcsetParts: string[] = []

  // Add each available size to srcset
  const sizeNames: SizeName[] = ['thumbnail', 'small', 'medium', 'large']
  for (const sizeName of sizeNames) {
    const sizeData = media.sizes?.[sizeName]
    if (sizeData?.url) {
      const url = getAbsoluteUrl(sizeData.url)
      if (url) {
        srcsetParts.push(`${url} ${SIZE_WIDTHS[sizeName]}w`)
      }
    }
  }

  // Add original as the largest option if wider than large size
  const originalUrl = getAbsoluteUrl(media.url)
  if (originalUrl && media.width && media.width > SIZE_WIDTHS.large) {
    srcsetParts.push(`${originalUrl} ${media.width}w`)
  }

  // Fallback src: use large size if available, otherwise original
  const largeSizeUrl = getAbsoluteUrl(media.sizes?.large?.url)
  const src = largeSizeUrl || originalUrl || ''

  if (!src) return null

  return {
    src,
    srcset: srcsetParts.join(', '),
    sizes: defaultSizes,
    alt: media.alt || '',
    width: media.width,
    height: media.height,
  }
}

/**
 * Build srcset string for use in HTML string contexts (like RichTextRenderer).
 * Returns just the srcset value, not a full object.
 */
export function buildSrcset(media: Media, baseUrl: string): string {
  const getAbsoluteUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    return `${baseUrl}${url}`
  }

  const srcsetParts: string[] = []

  const sizeNames: SizeName[] = ['thumbnail', 'small', 'medium', 'large']
  for (const sizeName of sizeNames) {
    const sizeData = media.sizes?.[sizeName]
    if (sizeData?.url) {
      const url = getAbsoluteUrl(sizeData.url)
      if (url) {
        srcsetParts.push(`${url} ${SIZE_WIDTHS[sizeName]}w`)
      }
    }
  }

  // Add original if larger than large size
  const originalUrl = getAbsoluteUrl(media.url)
  if (originalUrl && media.width && media.width > SIZE_WIDTHS.large) {
    srcsetParts.push(`${originalUrl} ${media.width}w`)
  }

  return srcsetParts.join(', ')
}
