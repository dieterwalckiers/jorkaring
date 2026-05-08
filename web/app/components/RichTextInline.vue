<script setup lang="ts">
defineProps<{
  content: unknown
}>()

interface LexicalTextNode {
  type: 'text'
  text?: string
  style?: string
}

interface LexicalElementNode {
  type?: string
  children?: LexicalNode[]
}

type LexicalNode = LexicalTextNode | LexicalElementNode

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function getTextColor(style: string | undefined): string | null {
  if (!style) return null
  const match = style.match(/--text-color:\s*([^;]+)/)
  return match ? match[1].trim() : null
}

function getTextColorClass(color: string): string {
  const colorClasses: Record<string, string> = {
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

function isTextNode(node: LexicalNode): node is LexicalTextNode {
  return node.type === 'text'
}

function renderInline(node: LexicalNode): string {
  if (isTextNode(node)) {
    const raw = node.text ?? ''
    const escaped = escapeHtml(raw)
    const color = getTextColor(node.style)
    const colorClass = color ? getTextColorClass(color) : ''
    return colorClass ? `<span class="${colorClass}">${escaped}</span>` : escaped
  }

  const children = (node.children ?? []).map(renderInline).join('')
  return children
}

function renderContent(content: unknown): string {
  if (!content || typeof content !== 'object') return ''
  const root = (content as { root?: LexicalElementNode }).root
  const paragraphs = root?.children ?? []

  // Each paragraph node becomes a line; multiple paragraphs are joined with
  // <br /> so the text reads as a single block (works inside <h1>, <p>, etc.).
  return paragraphs
    .map((paragraph) => (paragraph.children ?? []).map(renderInline).join(''))
    .filter((line) => line.length > 0)
    .join('<br />')
}
</script>

<template>
  <span v-html="renderContent(content)" />
</template>
