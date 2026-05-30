import { createState } from 'lexical'

/**
 * Custom node state attached to block-level element nodes (paragraph, heading).
 *
 * In Lexical 0.35 element nodes do NOT serialize `setStyle()` to JSON, so we use
 * the NodeState API instead — it auto-serializes under the `$` key on the node and
 * round-trips through Payload without subclassing the built-in nodes.
 *
 * The frontend (RichTextRenderer.vue) reads these off `node.$.{blockBg,...}` and
 * maps the stored theme keys (e.g. `theme1`, `accent`) to CSS classes.
 */
const toStringOrNull = (value: unknown): string | null =>
  typeof value === 'string' && value.length > 0 ? value : null

export const blockBgState = createState('blockBg', { parse: toStringOrNull })
export const blockBorderState = createState('blockBorder', { parse: toStringOrNull })
export const blockPaddingState = createState('blockPad', { parse: toStringOrNull })
export const blockMarginState = createState('blockMargin', { parse: toStringOrNull })
export const blockLinkState = createState('blockLink', { parse: toStringOrNull })
