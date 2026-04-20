<script setup lang="ts">
import type { RichTextBlock as RichTextBlockType, RichTextMargin, RichTextWidth } from '~/types/blocks'
import { resolveColor } from '~/utils/resolveColor'

const props = defineProps<{
  block: RichTextBlockType
}>()

const widthClasses: Record<RichTextWidth, string> = {
  '1/4': 'w-1/4',
  '1/3': 'w-1/3',
  'half': 'w-1/2',
  '2/3': 'w-2/3',
  '3/4': 'w-3/4',
  'full': 'w-full',
}

const marginClasses: Record<RichTextMargin, string> = {
  none: 'p-0',
  small: 'p-2 md:p-4',
  medium: 'p-4 md:p-8',
  large: 'p-6 md:p-16',
}

const widthClass = computed(() => widthClasses[props.block.width ?? 'full'])
const marginClass = computed(() => marginClasses[props.block.margin ?? 'none'])

// Panel-style rich text (has a filled background or is a floating hero
// overlay) almost always carries a hero tagline as the first paragraph.
// Mark those blocks so the first paragraph gets a lede treatment via CSS.
const isHeroPanel = computed(() => {
  if (props.block.renderFloating) return true
  const bg = resolveColor(props.block.backgroundColor)
  return Boolean(bg && bg !== 'transparent')
})

// When rich text is the default "full width + no padding" and has no background
// panel, cap its measure at a readable line length. Authored panels (narrower
// width, internal padding, or colored background) keep the exact width chosen.
const readingMeasure = computed(() => {
  const width = props.block.width ?? 'full'
  const margin = props.block.margin ?? 'none'
  const bg = resolveColor(props.block.backgroundColor)
  const isPanel = (bg && bg !== 'transparent') || props.block.renderFloating
  if (isPanel) return false
  if (width !== 'full') return false
  if (margin !== 'none') return false
  return true
})

const floatingStyle = computed(() => {
  if (!props.block.renderFloating) return undefined
  return {
    position: 'absolute' as const,
    top: props.block.floatingOffset || '0',
    left: '0',
    right: '0',
  }
})

const containerStyle = computed(() => {
  const bg = resolveColor(props.block.backgroundColor)
  if (bg === 'transparent') return undefined
  return { backgroundColor: bg }
})

const containerClasses = computed(() => {
  const classes: string[] = []
  if (props.block.roundedCorners) {
    classes.push('rounded-lg')
  }
  return classes
})
</script>

<template>
  <div v-if="block.renderFloating" class="relative pointer-events-none">
    <div
      class="prose prose-lg max-w-none mx-auto floating-content hero-lede"
      :class="[widthClass, marginClass, ...containerClasses]"
      :style="{ ...floatingStyle, ...containerStyle }"
    >
      <RichTextRenderer :content="block.content" />
    </div>
  </div>
  <div
    v-else
    class="prose prose-lg max-w-none mx-auto"
    :class="[widthClass, marginClass, ...containerClasses, { 'reading-measure': readingMeasure, 'hero-lede': isHeroPanel }]"
    :style="containerStyle"
  >
    <RichTextRenderer :content="block.content" />
  </div>
</template>

<style scoped>
/* Floating content: only interactive elements receive pointer events */
.floating-content {
  pointer-events: none;
}

.floating-content :deep(a),
.floating-content :deep(button),
.floating-content :deep(input),
.floating-content :deep(select),
.floating-content :deep(textarea) {
  pointer-events: auto;
}

/* Hero-style rich-text panels (floating overlays or any block with a
   filled bg color) almost always carry a tagline as the first paragraph.
   Those paragraphs should read like a display lede, not body copy. Later
   paragraphs stay at body size so the hierarchy is obvious. */
.hero-lede :deep(p:first-of-type) {
  font-size: clamp(1.5rem, 1.5vw + 1rem, 2.5rem);
  line-height: 1.18;
  letter-spacing: -0.01em;
  font-weight: 400;
  text-wrap: balance;
  margin-block-end: clamp(1.5rem, 3vw, 2.25rem);
}

/* When the panel has only one paragraph (a pure tagline panel), keep the
   lede treatment but drop trailing margin — there's nothing to separate
   from. */
.hero-lede :deep(p:first-of-type:last-child) {
  margin-block-end: 0;
}

/* Hairline under the lede echoes the editorial-spread device used in the
   content grid — only render when the lede is followed by more copy, so
   it functions as a real separator. */
.hero-lede :deep(p:first-of-type:not(:last-child))::after {
  content: "";
  display: block;
  width: clamp(2.5rem, 4vw, 3.5rem);
  height: 1px;
  background: currentColor;
  opacity: 0.35;
  margin-block-start: clamp(1.25rem, 2vw, 1.75rem);
}

/* Editorial reading measure — long-form comfort at ~72ch on wide viewports */
.reading-measure {
  max-width: 72ch;
}

/* Editorial lede: a drop cap on the first paragraph of a long-form column
   only. Scoped to .reading-measure so we never hit panels, nav blurbs, or
   UI copy — this is a magazine-feature treatment, not a default. Skipped
   when the paragraph is short (<120 chars) via the --no-dropcap escape
   hatch some upstream selectors can set; by default every reading-measure
   column gets the treatment. */
.reading-measure :deep(p:first-of-type)::first-letter {
  float: left;
  font-family: inherit;
  font-weight: 700;
  font-size: clamp(3.25rem, 5.5vw + 1rem, 5.5rem);
  line-height: 0.82;
  padding-inline-end: 0.1em;
  padding-block-start: 0.08em;
  color: var(--color-headings);
  letter-spacing: -0.02em;
  /* Subtle optical alignment so the cap's top-left sits flush with the
     first ascender line of surrounding text, not the paragraph's padding
     box. Keeps the cap from looking like it's escaping the column. */
  margin-inline-start: -0.04em;
  margin-inline-end: 0.02em;
}

/* When the first paragraph is very short (a pull caption rather than a
   lede), the drop cap looks like a mistake. Use an inline @supports hook
   to opt out for paragraphs that are visibly single-line. We detect this
   structurally via the :has() selector for modern browsers; older
   browsers will simply see the drop cap as before. */
@supports selector(:has(*)) {
  .reading-measure :deep(p:first-of-type:not(:has(+ p)))::first-letter {
    /* Single-paragraph rich-text blocks are usually decks or captions —
       skip the drop cap there to avoid the "giant-initial-on-a-one-liner"
       look. */
    float: none;
    font-size: inherit;
    line-height: inherit;
    padding: 0;
    margin: 0;
    color: inherit;
  }
}
</style>
