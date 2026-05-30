<script setup lang="ts">
import type { ContentGridBlock } from '~/types/blocks'
import { resolveColor } from '~/utils/resolveColor'

const props = defineProps<{
  block: ContentGridBlock
}>()

const backgroundColor = computed(() => resolveColor(props.block.backgroundColor))
const hasBackground = computed(() => backgroundColor.value !== 'transparent')
const isFullBleed = computed(() => hasBackground.value && props.block.fullBleed === true)

const cellDividers = computed(() => props.block.cellDividers === true)
const dividerColor = computed(() => resolveColor(props.block.cellDividerColor))

const sectionStyle = computed(() => {
  const style: Record<string, string> = {}
  if (hasBackground.value) style.backgroundColor = backgroundColor.value
  if (cellDividers.value) style['--cg-divider'] = dividerColor.value
  return Object.keys(style).length ? style : undefined
})

const cells = computed(() => props.block.cells ?? [])
const numberOfColumns = computed(() => props.block.numberOfColumns ?? '3')
const horizontalAlignment = computed(() => props.block.horizontalAlignment ?? 'left')
const verticalAlignment = computed(() => props.block.verticalAlignment ?? 'center')
const showEditorialNumbers = computed(() => props.block.editorialNumbers === true)
const renderAsCards = computed(() => props.block.renderAsCards === true)
const cardBackground = computed(() => props.block.cardBackground ?? 'lighten')
const cardRoundedCorners = computed(() => props.block.cardRoundedCorners === true)
const equalRowHeights = computed(() => props.block.equalRowHeights === true)

const gridClass = computed(() => {
  const cols = numberOfColumns.value
  const colsMap: Record<string, string> = {
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    '5': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
  }
  return colsMap[cols] || colsMap['3']
})

const horizontalAlignmentClass = computed(() => {
  const alignMap: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }
  return alignMap[horizontalAlignment.value] || alignMap.left
})

const verticalAlignmentClass = computed(() => {
  // When equalising row heights, the grid itself must stretch cells. The
  // requested vertical alignment is then applied inside each cell via flex.
  if (equalRowHeights.value) return 'items-stretch'
  const alignMap: Record<string, string> = {
    top: 'items-start',
    center: 'items-center',
    bottom: 'items-end',
  }
  return alignMap[verticalAlignment.value] || alignMap.center
})

const cellJustifyClass = computed(() => {
  if (!equalRowHeights.value) return ''
  const justifyMap: Record<string, string> = {
    top: 'justify-start',
    center: 'justify-center',
    bottom: 'justify-end',
  }
  return justifyMap[verticalAlignment.value] || justifyMap.center
})
</script>

<template>
  <section
    class="content-grid-block"
    :class="{
      'has-editorial-numbers': showEditorialNumbers,
      'has-cards': renderAsCards,
      'cards-lighten': renderAsCards && cardBackground === 'lighten',
      'cards-darken': renderAsCards && cardBackground === 'darken',
      'cards-rounded': renderAsCards && cardRoundedCorners,
      'has-equal-row-heights': equalRowHeights,
      'has-background': hasBackground,
      'is-full-bleed': isFullBleed,
      'has-dividers': cellDividers,
    }"
    :style="sectionStyle"
  >
    <div class="content-grid-inner">
      <div
        class="content-grid"
        :class="[gridClass, verticalAlignmentClass]"
      >
        <div
          v-for="(cell, i) in cells"
          :key="cell.id"
          class="content-grid-cell"
          :class="[horizontalAlignmentClass, cellJustifyClass]"
        >
          <span
            v-if="showEditorialNumbers"
            class="content-grid-number"
            aria-hidden="true"
          >
            {{ String(i + 1).padStart(2, '0') }}
          </span>
          <div class="content-grid-body">
            <BlocksContentGridCounter
              v-if="cell.elementType === 'counter'"
              :value="cell.counterValue"
              :infinite="cell.counterInfinite"
              :show-plus="cell.counterShowPlus"
              :label="cell.counterLabel"
              :color="cell.counterColor"
            />
            <BlocksContentGridCellBody
              v-else
              :content="cell.content"
              :collapsed-by-default="cell.collapsedByDefault"
              :collapsed-lines="cell.collapsedLines"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.content-grid-block {
  padding-block: clamp(0.5rem, 1.5vw, 1.5rem);
}

/* When a background colour is set, give the cells breathing room inside the
   coloured panel rather than letting them touch the edges. */
.content-grid-block.has-background {
  padding: clamp(1.5rem, 3.5vw, 2.75rem);
}

/* The inner wrapper is an invisible passthrough until full-bleed kicks in. */
.content-grid-inner {
  display: contents;
}

/* Full-bleed: the coloured section stretches the full viewport width while the
   cells stay within the site container. Vertical padding lives on the section
   (the coloured band); horizontal padding moves to the inner container so the
   content lines up with the rest of the page. Mirrors the RichText full-bleed. */
.content-grid-block.is-full-bleed {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  padding-inline: 0;
}

.content-grid-block.is-full-bleed .content-grid-inner {
  display: block;
  max-width: var(--ui-container, 1536px);
  margin-inline: auto;
  padding-inline: 1rem;
}

@media (min-width: 640px) {
  .content-grid-block.is-full-bleed .content-grid-inner {
    padding-inline: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .content-grid-block.is-full-bleed .content-grid-inner {
    padding-inline: 2rem;
  }
}

.content-grid {
  display: grid;
  gap: clamp(2rem, 4vw, 3.5rem) clamp(2rem, 3.5vw, 3.5rem);
}

.content-grid-cell {
  min-width: 0; /* Prevent grid blowout from long content */
  position: relative;
}

/* Subtle dividers between cells. Each cell paints a hairline on its top and
   left edges via box-shadow (sitting in the gutter); clipping the grid hides
   the outermost lines, so only the rules *between* cells remain — no per-column
   edge math, and it works at any breakpoint and with transparent backgrounds. */
.has-dividers .content-grid {
  overflow: hidden;
}

.has-dividers .content-grid-cell {
  box-shadow:
    -1px 0 0 0 color-mix(in srgb, var(--cg-divider, currentColor) 45%, transparent),
    0 -1px 0 0 color-mix(in srgb, var(--cg-divider, currentColor) 45%, transparent);
}

/* Equal row heights: grid stretches cells to the tallest in the row, and
   each cell becomes a column flex container so the body fills the cell
   while the requested vertical alignment is honoured via justify-content. */
.has-equal-row-heights .content-grid-cell {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Editorial numbered columns: a small display number and a hairline rule
   at the top of each cell read like a magazine spread index. Only the
   visual wrapper — the content itself is still whatever the editor put in. */
.has-editorial-numbers .content-grid-cell {
  padding-block-start: clamp(1.25rem, 2vw, 1.75rem);
}

.has-editorial-numbers .content-grid-cell::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: currentColor;
  opacity: 0.28;
}

.content-grid-number {
  display: block;
  color: var(--color-headings);
  font-size: 0.72rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  opacity: 0.9;
  margin-block-end: clamp(0.9rem, 1.5vw, 1.35rem);
}

/* Within a numbered cell, trim the default section-heading top margin so
   the heading sits directly under the column number without extra breath. */
.has-editorial-numbers .content-grid-body :deep(.editorial-heading:first-child) {
  margin-block-start: 0;
}

.has-editorial-numbers .content-grid-body :deep(h1),
.has-editorial-numbers .content-grid-body :deep(h2),
.has-editorial-numbers .content-grid-body :deep(h3),
.has-editorial-numbers .content-grid-body :deep(h4) {
  margin-block-start: 0;
}

/* Card variant: each cell becomes a self-contained translucent panel.
   Tighten the gap so cards read as a unit, not a scattered set. */
.has-cards .content-grid {
  gap: clamp(1rem, 1.75vw, 1.5rem);
}

.has-cards .content-grid-cell {
  padding: clamp(1.5rem, 2.5vw, 2.25rem) clamp(1.25rem, 2vw, 1.75rem);
  backdrop-filter: blur(2px);
}

.cards-lighten .content-grid-cell {
  background: rgba(255, 255, 255, 0.42);
}

.cards-darken .content-grid-cell {
  background: rgba(0, 0, 0, 0.32);
}

.cards-rounded .content-grid-cell {
  border-radius: 0.75rem;
}

/* When cards are on, suppress the editorial top hairline — the card edge
   is the divider now. Keep the number itself for hierarchy. */
.has-cards.has-editorial-numbers .content-grid-cell::before {
  display: none;
}

.has-cards.has-editorial-numbers .content-grid-cell {
  padding-block-start: clamp(1.5rem, 2.5vw, 2.25rem);
}
</style>
