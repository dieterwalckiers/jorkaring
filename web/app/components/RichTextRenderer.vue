<script setup lang="ts">
import type { Media } from '~/types/media'
import { buildSrcset } from '~/composables/useResponsiveImage'
import { resolveColor } from '~/utils/resolveColor'

const props = defineProps<{
  content: unknown
  startNumberedListAtZero?: boolean
}>()

// Resolver for media URLs - needs to be called at setup time
const resolveMediaUrl = useMediaUrlResolver()

// Get the app base URL for internal links (e.g., /newwebsite2026/)
const appConfig = useRuntimeConfig()
const appBaseUrl = appConfig.app.baseURL || '/'

// Prefix relative URLs with the app base URL (for internal page links)
function prefixInternalUrl(url: string): string {
  // Only prefix relative URLs that start with / (but not // which is protocol-relative)
  if (url.startsWith('/') && !url.startsWith('//')) {
    // Remove trailing slash from baseURL to avoid double slashes
    const base = appBaseUrl.endsWith('/') ? appBaseUrl.slice(0, -1) : appBaseUrl
    return `${base}${url}`
  }
  return url
}

// Only true cross-origin URLs (http(s):// or protocol-relative //) open in a new tab.
// Anchors (#…), relative paths, mailto:, tel:, etc. stay in the same tab.
function isExternalUrl(url: string): boolean {
  return /^(https?:)?\/\//i.test(url)
}

// Escape HTML entities to prevent XSS
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function getMediaUrl(url: string | undefined | null): string | undefined {
  return resolveMediaUrl(url)
}

// Lexical format bitmask values
const IS_BOLD = 1
const IS_ITALIC = 2
const IS_STRIKETHROUGH = 4
const IS_UNDERLINE = 8
const IS_CODE = 16
const IS_SUBSCRIPT = 32
const IS_SUPERSCRIPT = 64

interface LexicalNode {
  type?: string
  tag?: string
  format?: number | string
  indent?: number
  direction?: string
  version?: number
  text?: string
  style?: string
  // Lexical NodeState — block-level styling set via the block-style editor feature
  $?: {
    blockBg?: string
    blockBorder?: string
    blockPad?: string
    blockMargin?: string
    blockLink?: string
  }
  children?: LexicalNode[]
  listType?: 'bullet' | 'number' | 'check'
  checked?: boolean
  url?: string
  newTab?: boolean
  rel?: string
  fields?: Record<string, unknown>
  // For upload nodes - value can be list value (number) or media object
  value?: number | Media | string | null
  relationTo?: string
}

// Get text color from style string
function getTextColor(style: string | undefined): string | null {
  if (!style) return null

  // Check for new --text-color property
  const match = style.match(/--text-color:\s*([^;]+)/)
  if (match) {
    return match[1].trim()
  }

  // Legacy: check for --gradient-text
  if (style.includes('--gradient-text')) {
    return 'gradient'
  }

  return null
}

// Get font size from style string
function getFontSize(style: string | undefined): string | null {
  if (!style) return null

  const match = style.match(/font-size:\s*([\d.]+em)/)
  if (match) {
    return match[1]
  }

  return null
}

// Map color value to CSS class (matches Site Settings → Theme Colors)
function getTextColorClass(color: string): string {
  const colorClasses: Record<string, string> = {
    gradient: 'text-color-gradient',
    theme1: 'text-color-theme1',
    theme2: 'text-color-theme2',
    theme3: 'text-color-theme3',
    theme4: 'text-color-theme4',
    theme5: 'text-color-theme5',
    theme6: 'text-color-theme6',
    theme7: 'text-color-theme7',
    theme8: 'text-color-theme8',
    base: 'text-color-base',
    accent: 'text-color-accent',
    black: 'text-color-black',
    white: 'text-color-white',
  }
  return colorClasses[color] || ''
}

// Block-level styling stored as Lexical NodeState (node.$) by the block-style
// editor feature: background tint, hairline border, inset padding, text color.
// Returns a leading-space-prefixed class string ready to append to a class list.
function getBlockClasses(node: LexicalNode): string {
  const state = node.$
  if (!state) return ''
  const classes: string[] = []
  if (state.blockBg) classes.push(`block-bg-${state.blockBg}`)
  if (state.blockBorder) classes.push(`block-border-${state.blockBorder}`)
  if (state.blockPad && state.blockPad !== 'none') classes.push(`block-pad-${state.blockPad}`)
  if (state.blockMargin) classes.push(`block-margin-${state.blockMargin}`)
  return classes.length ? ` ${classes.join(' ')}` : ''
}

// Wrap a block's rendered HTML in an anchor when it carries a block link, making
// the whole block/box clickable (cursor + subtle hover brightness via .block-link).
function maybeWrapBlockLink(html: string, node: LexicalNode): string {
  const url = node.$?.blockLink
  if (!url) return html
  const href = escapeHtml(prefixInternalUrl(url))
  const rel = isExternalUrl(url) ? ' target="_blank" rel="noopener noreferrer"' : ''
  return `<a href="${href}" class="block-link"${rel}>${html}</a>`
}

// Inline contact/social icons inserted via the Payload "Icons" toolbar dropdown.
// Line-style (Lucide) glyphs sharing a 24×24 viewBox and uniform 2px stroke,
// rendered at a uniform 1em and inheriting text colour via stroke: currentColor.
// Keep in sync with payload/src/features/icons/icons.tsx.
const ICON_SVG_ATTRS =
  'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;width:1em;height:1em;vertical-align:-0.125em"'
const ICON_SVGS: Record<string, string> = {
  at: `<svg ${ICON_SVG_ATTRS}><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/></svg>`,
  phone: `<svg ${ICON_SVG_ATTRS}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  instagram: `<svg ${ICON_SVG_ATTRS}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  linkedin: `<svg ${ICON_SVG_ATTRS}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
}

function renderNode(node: LexicalNode): string {
  if (!node || typeof node !== 'object') return ''

  const type = node.type
  const children = node.children
  const text = node.text

  // Handle text nodes
  if (text !== undefined) {
    let result = escapeHtml(text)
    const format = typeof node.format === 'number' ? node.format : 0

    if (format & IS_BOLD) result = `<strong>${result}</strong>`
    if (format & IS_ITALIC) result = `<em>${result}</em>`
    if (format & IS_UNDERLINE) result = `<u>${result}</u>`
    if (format & IS_STRIKETHROUGH) result = `<s>${result}</s>`
    if (format & IS_CODE) result = `<code class="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">${result}</code>`
    if (format & IS_SUBSCRIPT) result = `<sub>${result}</sub>`
    if (format & IS_SUPERSCRIPT) result = `<sup>${result}</sup>`

    // Apply text styling (color and font-size)
    const textColor = getTextColor(node.style)
    const fontSize = getFontSize(node.style)

    if (textColor || fontSize) {
      const colorClass = textColor ? getTextColorClass(textColor) : ''
      const fontSizeStyle = fontSize ? `font-size: ${fontSize};` : ''
      const classAttr = colorClass ? ` class="${colorClass}"` : ''
      const styleAttr = fontSizeStyle ? ` style="${fontSizeStyle}"` : ''
      result = `<span${classAttr}${styleAttr}>${result}</span>`
    }

    return result
  }

  // Recursively render children
  const childrenHtml = children?.map(renderNode).join('') || ''

  switch (type) {
    case 'root':
      return childrenHtml

    case 'blockgroup': {
      // Wrapper box around a group of blocks (block-style "Wrap in box").
      // Styling (bg/border/padding/margin) lives in NodeState on this node.
      const blockClasses = getBlockClasses(node)
      return maybeWrapBlockLink(`<div class="block-group${blockClasses}">${childrenHtml}</div>`, node)
    }

    case 'paragraph': {
      if (!childrenHtml.trim()) return '<div class="h-[1em]" aria-hidden="true"></div>' // Empty paragraph spacer
      let align = getTextAlign(node.format)
      // A paragraph that contains button inline blocks takes its alignment from the
      // first button's `align` field. Paragraph-level alignment (often "justify" or
      // "left" by default) doesn't position buttons meaningfully, and the per-button
      // align field was the source of truth in the old wrapping-div renderer.
      const buttonChild = children?.find(
        (c) => c.type === 'inlineBlock' && (c.fields as Record<string, unknown> | undefined)?.blockType === 'button',
      )
      if (buttonChild) {
        const buttonAlign = (buttonChild.fields as Record<string, unknown> | undefined)?.align
        if (buttonAlign === 'center') align = ' text-center'
        else if (buttonAlign === 'right') align = ' text-right'
        else align = ' text-left'
      }
      return maybeWrapBlockLink(`<p class="mb-4${align}${getBlockClasses(node)}">${childrenHtml}</p>`, node)
    }

    case 'heading': {
      const level = node.tag?.replace('h', '') || '2'
      const align = getTextAlign(node.format)
      const sizeClass = getHeadingSize(level)
      return maybeWrapBlockLink(`<h${level} class="editorial-heading editorial-heading--h${level} ${sizeClass} font-bold${align}${getBlockClasses(node)}">${childrenHtml}</h${level}>`, node)
    }

    case 'list': {
      const listTag = node.listType === 'number' ? 'ol' : 'ul'
      let listClass: string
      if (node.listType === 'number') {
        listClass = 'styled-numbered-list mb-4 space-y-3'
      } else if (node.listType === 'check') {
        listClass = 'mb-4 space-y-2'
      } else {
        listClass = "list-none pl-8 mb-4 space-y-1 [&>li]:flex [&>li]:items-start [&>li]:gap-2 [&>li]:before:content-['•'] [&>li]:before:shrink-0 [&>li]:before:text-[1.5em] [&>li]:before:leading-[1] [&>li]:before:text-[var(--color-bullet-points)]"
      }
      return `<${listTag} class="${listClass}">${childrenHtml}</${listTag}>`
    }

    case 'listitem': {
      const indent = node.indent ? ` style="margin-left: ${node.indent * 1.5}rem"` : ''
      if (node.checked !== undefined) {
        // Checkbox list item
        const checked = node.checked ? 'checked' : ''
        return `<li${indent} class="flex items-start gap-2"><input type="checkbox" ${checked} disabled class="mt-1" /><span>${childrenHtml}</span></li>`
      }
      // Wrap content in span so inline elements stay together when li is a flex container
      return `<li${indent}><span>${childrenHtml}</span></li>`
    }

    case 'link': {
      const fields = node.fields as Record<string, unknown> | undefined
      let rawUrl: string
      if (fields?.linkType === 'internal') {
        // Internal links store the related document in fields.doc
        const doc = fields.doc as { value?: { slug?: string } | string } | undefined
        const slug = typeof doc?.value === 'object' ? doc.value?.slug : undefined
        rawUrl = slug ? `/${slug}` : '#'
      } else {
        // Custom URL links and standard Lexical links
        rawUrl = (fields?.url as string) || node.url || '#'
      }
      const url = prefixInternalUrl(rawUrl)
      const newTab = (fields?.newTab as boolean | undefined) ?? node.newTab
      // Open in new tab if explicitly set, or automatically for external URLs
      const openInNewTab = newTab ?? isExternalUrl(rawUrl)
      const target = openInNewTab ? ' target="_blank"' : ''
      const rel = openInNewTab ? ' rel="noopener noreferrer"' : ''
      return `<a href="${escapeHtml(url)}" class="text-primary-600 hover:text-primary-700 underline"${target}${rel}>${childrenHtml}</a>`
    }

    case 'autolink': {
      // Payload CMS stores link URL in fields.url, standard Lexical uses node.url
      const fields = node.fields as Record<string, unknown> | undefined
      const rawUrl = (fields?.url as string) || node.url || '#'
      const url = prefixInternalUrl(rawUrl)
      // Auto-detect external URLs for autolinks
      const openInNewTab = isExternalUrl(rawUrl)
      const target = openInNewTab ? ' target="_blank"' : ''
      const rel = openInNewTab ? ' rel="noopener noreferrer"' : ''
      return `<a href="${escapeHtml(url)}" class="text-primary-600 hover:text-primary-700 underline"${target}${rel}>${childrenHtml}</a>`
    }

    case 'quote': {
      return `<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 italic text-gray-600 dark:text-gray-400">${childrenHtml}</blockquote>`
    }

    case 'horizontalrule': {
      return '<hr class="my-8 border-[var(--color-table-borders)]" />'
    }

    case 'linebreak': {
      return '<br />'
    }

    case 'tab': {
      return '&nbsp;&nbsp;&nbsp;&nbsp;'
    }

    case 'code': {
      // Code block (multi-line code)
      const language = (node as LexicalNode & { language?: string }).language || ''
      return `<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm font-mono"${language ? ` data-language="${escapeHtml(language)}"` : ''}>${childrenHtml}</code></pre>`
    }

    case 'upload': {
      // Handle uploaded media (images)
      const mediaValue = node.value as Media | string | null | undefined
      if (!mediaValue || typeof mediaValue === 'string') return ''
      const url = getMediaUrl(mediaValue.url)
      if (!url) return ''
      const alt = escapeHtml(mediaValue.alt || '')
      const fields = node.fields || {}
      const size = (fields.size as string) || 'medium'
      const alignment = (fields.alignment as string) || 'center'
      const caption = fields.caption as string | undefined

      // Size classes - applied to the figure (scaled 1.2x)
      const sizeStyles: Record<string, string> = {
        'tiny-icon': 'max-w-[38px]',
        'small-icon': 'max-w-[58px]',
        icon: 'max-w-[77px]',
        'large-icon': 'max-w-[120px]',
        tiny: 'max-w-[240px]',
        small: 'max-w-[360px]',
        medium: 'max-w-[600px]',
        large: 'max-w-[840px]',
        xlarge: 'max-w-[1080px]',
        huge: 'max-w-[1440px]',
        full: 'max-w-full w-full',
        original: '', // No max-width constraint
      }
      const sizeClass = sizeStyles[size] ?? sizeStyles.medium

      // Map size to CSS sizes attribute for srcset
      const sizesMap: Record<string, string> = {
        'tiny-icon': '38px',
        'small-icon': '58px',
        icon: '77px',
        'large-icon': '120px',
        tiny: '240px',
        small: '360px',
        medium: '600px',
        large: '840px',
        xlarge: '1080px',
        huge: '1440px',
        full: '100vw',
        original: '100vw',
      }
      const sizesAttr = sizesMap[size] ?? '600px'

      // Build srcset from Payload's pre-generated sizes
      const srcset = buildSrcset(mediaValue, resolveMediaUrl)

      // Alignment uses a flex wrapper for reliable positioning
      const alignmentStyles: Record<string, string> = {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
      }
      const alignClass = alignmentStyles[alignment] || alignmentStyles.center

      // Use a flex wrapper for alignment, figure for semantics
      let html = `<div class="flex w-full ${alignClass} my-6">`
      html += `<figure class="${sizeClass}">`
      html += `<img src="${url}"${srcset ? ` srcset="${srcset}" sizes="${sizesAttr}"` : ''} alt="${alt}" class="max-w-full h-auto" loading="lazy" />`
      if (caption) {
        html += `<figcaption class="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">${escapeHtml(caption)}</figcaption>`
      }
      html += '</figure>'
      html += '</div>'
      return html
    }

    case 'inlineBlock': {
      // Handle inline blocks (e.g., button)
      const fields = node.fields || {}
      const blockType = fields.blockType as string | undefined

      if (blockType === 'button') {
        const buttonCaption = fields.caption as string | undefined
        const buttonLink = fields.link as string | undefined
        const buttonNewTab = fields.newTab as boolean | undefined
        if (!buttonCaption || !buttonLink) return ''

        const target = buttonNewTab ? ' target="_blank" rel="noopener noreferrer"' : ''

        const bg = fields.backgroundColor as string | undefined
        const text = fields.textColor as string | undefined
        // When the "lighter" checkbox is set, derive the hover colour from the base
        // colour via color-mix — works directly with theme CSS variables, no hex needed.
        const lighten = (value: string | undefined): string =>
          `color-mix(in srgb, ${resolveColor(value)}, white 35%)`
        const bgHover = fields.backgroundColorHoverLighter
          ? lighten(bg)
          : (fields.backgroundColorHover as string | undefined)
        const textHover = fields.textColorHoverLighter
          ? lighten(text)
          : (fields.textColorHover as string | undefined)

        // Per-button colours override the site-default CSS variables that
        // `.btn-outline-inline` reads (including its `:hover` rule), so hover
        // behaviour keeps working. Only set a variable when the field is present
        // — buttons saved before these fields existed keep the CSS defaults.
        const colorVars: Array<[string, string | undefined]> = [
          ['--color-button-bg', bg],
          ['--color-button-font', text],
          ['--color-button-bg-hover', bgHover],
          ['--color-button-font-hover', textHover],
        ]
        const style = colorVars
          .filter(([, value]) => value)
          .map(([prop, value]) => `${prop}:${value!.startsWith('color-mix') ? value : resolveColor(value)}`)
          .join(';')
        const styleAttr = style ? ` style="${escapeHtml(style)}"` : ''

        // Render inline so siblings in the same paragraph sit side-by-side, matching
        // how they appear in the editor. Paragraph-level alignment positions them.
        return `<a href="${escapeHtml(prefixInternalUrl(buttonLink))}" class="btn-outline-inline"${styleAttr}${target}>${escapeHtml(buttonCaption)}</a>`
      }

      if (blockType === 'icon') {
        // Inserted via the Icons toolbar dropdown. All icons render at a uniform
        // 1em size and inherit the surrounding text colour (fill: currentColor).
        // Keep these SVGs in sync with payload/src/features/icons/icons.tsx.
        const iconName = fields.icon as string | undefined
        const svg = iconName ? ICON_SVGS[iconName] : undefined
        if (!svg) return ''
        const iconSpan = `<span class="rich-text-icon" role="img" aria-label="${escapeHtml(iconName!)}">${svg}</span>`
        const iconLink = fields.link as string | undefined
        if (iconLink) {
          const iconNewTab = (fields.newTab as boolean | undefined) ?? isExternalUrl(iconLink)
          const target = iconNewTab ? ' target="_blank" rel="noopener noreferrer"' : ''
          return `<a href="${escapeHtml(prefixInternalUrl(iconLink))}" class="rich-text-icon-link"${target}>${iconSpan}</a>`
        }
        return iconSpan
      }

      // Unknown inline block type
      return ''
    }

    default:
      // For unknown node types, just render children
      return childrenHtml
  }
}

function getTextAlign(format: number | string | undefined): string {
  if (typeof format === 'string') {
    switch (format) {
      case 'left': return ' text-left'
      case 'center': return ' text-center'
      case 'right': return ' text-right'
      case 'justify': return ' text-justify'
      default: return ''
    }
  }
  // Lexical also uses numeric format for alignment on block nodes
  // These are different from text formatting bitmasks
  return ''
}

function getHeadingSize(level: string): string {
  // Scale is driven by the .editorial-heading--hN CSS rules (fluid clamp).
  // This hook is retained as a fallback for anything that renders outside
  // our scoped prose context and still expects a Tailwind size class.
  switch (level) {
    case '1': return 'text-3xl md:text-4xl lg:text-5xl'
    case '2': return 'text-2xl md:text-3xl lg:text-4xl'
    case '3': return 'text-xl md:text-2xl'
    case '4': return 'text-lg md:text-xl'
    case '5': return 'text-base md:text-lg'
    case '6': return 'text-base'
    default: return 'text-xl'
  }
}

function renderContent(content: unknown): string {
  if (!content || typeof content !== 'object') return ''
  const root = content as { root?: LexicalNode }
  if (!root.root?.children) return ''
  return root.root.children.map(renderNode).join('')
}
</script>

<template>
  <div
    class="prose prose-gray dark:prose-invert max-w-none"
    :class="{ 'numbered-list-start-zero': props.startNumberedListAtZero }"
    v-html="renderContent(content)"
  />
</template>
