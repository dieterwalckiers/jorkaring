<script setup lang="ts">
import type { RichTextBlock as RichTextBlockType, RichTextMargin, RichTextWidth } from '~/types/blocks'
import { resolveColor } from '~/utils/resolveColor'

const props = defineProps<{
  block: RichTextBlockType
}>()

// Mobile-first: fractional widths only apply from md upward. On phones
// the content always spans full width — narrow viewports can't afford
// to give 33–75% of horizontal space back to side margins.
const widthClasses: Record<RichTextWidth, string> = {
  '1/4': 'w-full md:w-1/4',
  '1/3': 'w-full md:w-1/3',
  'half': 'w-full md:w-1/2',
  '2/3': 'w-full md:w-2/3',
  '3/4': 'w-full md:w-3/4',
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

const variant = computed(() => props.block.variant ?? 'body')
const isHero = computed(() => variant.value === 'hero')
const isLongForm = computed(() => variant.value === 'longForm')

const floatingStyle = computed(() => {
  if (!props.block.renderFloating) return undefined
  return {
    position: 'absolute' as const,
    top: props.block.floatingOffset || '0',
    left: '0',
    right: '0',
  }
})

// The checkered pattern is a CSS decoration (see jorkaring.css) toggled via a
// data attribute rather than an inline background, so it can't go through the
// regular colour resolution.
const isCheckered = computed(() => props.block.backgroundColor === 'checkered')

const containerStyle = computed(() => {
  const style: Record<string, string> = {}

  if (!isCheckered.value) {
    const bg = resolveColor(props.block.backgroundColor)
    if (bg !== 'transparent') style.backgroundColor = bg
  }

  // Darken overlay strength is handed to the ::before pseudo-element (defined in
  // jorkaring.css) via a custom property, mirroring the hero's darken overlay.
  if (props.block.darken) {
    const strength = (props.block.darkenStrength ?? 40) / 100
    style['--rt-darken'] = `rgba(0, 0, 0, ${strength})`
  }

  return Object.keys(style).length ? style : undefined
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
      class="prose prose-lg max-w-none mx-auto floating-content"
      :class="[widthClass, marginClass, ...containerClasses, { 'variant-hero': isHero, 'variant-long-form': isLongForm }]"
      :style="{ ...floatingStyle, ...containerStyle }"
      :data-checkered="isCheckered ? '' : undefined"
      :data-rt-darken="block.darken ? '' : undefined"
    >
      <RichTextRenderer :content="block.content" />
    </div>
  </div>
  <!-- Full-bleed: background stretches the full viewport width while the
       content stays within the site container. -->
  <div
    v-else-if="block.fullBleed"
    class="rich-text-full-bleed"
    :style="containerStyle"
    :data-checkered="isCheckered ? '' : undefined"
    :data-rt-darken="block.darken ? '' : undefined"
  >
    <div class="rich-text-inner">
      <div
        class="prose prose-lg max-w-none mx-auto"
        :class="[widthClass, marginClass, ...containerClasses, { 'variant-hero': isHero, 'variant-long-form': isLongForm }]"
      >
        <RichTextRenderer :content="block.content" />
      </div>
    </div>
  </div>
  <div
    v-else
    class="prose prose-lg max-w-none mx-auto"
    :class="[widthClass, marginClass, ...containerClasses, { 'variant-hero': isHero, 'variant-long-form': isLongForm }]"
    :style="containerStyle"
    :data-checkered="isCheckered ? '' : undefined"
    :data-rt-darken="block.darken ? '' : undefined"
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

/* --- variant: hero ----------------------------------------------------
   For panel/overlay taglines. The first paragraph reads as a display
   lede; subsequent paragraphs keep body size so hierarchy is obvious.
   A short hairline under the lede echoes the content-grid spread device. */
.variant-hero :deep(p:first-of-type) {
  font-size: clamp(1.25rem, 1vw + 0.85rem, 1.75rem);
  line-height: 1.25;
  letter-spacing: -0.01em;
  font-weight: 400;
  text-wrap: balance;
  margin-block-end: clamp(1.5rem, 3vw, 2.25rem);
}

.variant-hero :deep(p:first-of-type:last-child) {
  margin-block-end: 0;
}

.variant-hero :deep(p:first-of-type:not(:last-child))::after {
  content: "";
  display: block;
  width: clamp(2.5rem, 4vw, 3.5rem);
  height: 1px;
  background: currentColor;
  opacity: 0.35;
  margin-block-start: clamp(1.25rem, 2vw, 1.75rem);
}

/* --- variant: long-form -----------------------------------------------
   Editorial reading column: ~72ch measure + drop cap on the first
   paragraph. Skips the drop cap when the first paragraph is the only
   paragraph (it looks like a mistake on a one-liner deck/caption). */
.variant-long-form {
  max-width: 72ch;
}

.variant-long-form :deep(p:first-of-type)::first-letter {
  float: left;
  font-family: inherit;
  font-weight: 700;
  font-size: clamp(2.5rem, 3.5vw + 0.75rem, 4rem);
  line-height: 0.85;
  padding-inline-end: 0.1em;
  padding-block-start: 0.08em;
  color: var(--color-headings);
  letter-spacing: -0.02em;
  margin-inline-start: -0.04em;
  margin-inline-end: 0.02em;
}

@supports selector(:has(*)) {
  .variant-long-form :deep(p:first-of-type:not(:has(+ p)))::first-letter {
    float: none;
    font-size: inherit;
    line-height: inherit;
    padding: 0;
    margin: 0;
    color: inherit;
  }
}

/* Full-bleed: background stretches full viewport width */
.rich-text-full-bleed {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  z-index: 1;
}

/* Inner content stays within the site container */
.rich-text-inner {
  max-width: var(--ui-container, 1536px);
  margin-inline: auto;
  padding-inline: 1rem;
}

@media (min-width: 640px) {
  .rich-text-inner {
    padding-inline: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .rich-text-inner {
    padding-inline: 2rem;
  }
}
</style>
