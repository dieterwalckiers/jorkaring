<script setup lang="ts">
import type { ContentBlock } from '~/types/blocks'

defineProps<{
  blocks: ContentBlock[]
}>()
</script>

<template>
  <div class="blocks-container">
    <template v-for="block in blocks" :key="block.id">
      <div class="block-wrap" :data-block-type="block.blockType">
        <BlocksCalendlyEmbedBlock v-if="block.blockType === 'calendlyEmbed'" :block="block" />
        <BlocksContactFormBlock v-else-if="block.blockType === 'contactForm'" :block="block" />
        <BlocksContentGridBlock v-else-if="block.blockType === 'contentGrid'" :block="block" />
        <BlocksHeroBlock v-else-if="block.blockType === 'hero'" :block="block" />
        <BlocksInPageMenuTitleBlock v-else-if="block.blockType === 'inPageMenuTitle'" :block="block" />
        <BlocksLogoMarqueeBlock v-else-if="block.blockType === 'logoMarquee'" :block="block" />
        <BlocksNewsletterSignupBlock v-else-if="block.blockType === 'newsletterSignup'" :block="block" />
        <BlocksRichTextBlock v-else-if="block.blockType === 'richText'" :block="block" />
        <BlocksRotatingHeadlineBlock v-else-if="block.blockType === 'rotatingHeadline'" :block="block" />
        <BlocksSpacerBlock v-else-if="block.blockType === 'spacer'" :block="block" />
        <BlocksSplitTextImage v-else-if="block.blockType === 'splitTextImage'" :block="block" />
        <BlocksTableBlock v-else-if="block.blockType === 'table'" :block="block" />
        <BlocksTestimonialsBlock v-else-if="block.blockType === 'testimonials'" :block="block" />
        <BlocksVideoBlock v-else-if="block.blockType === 'video'" :block="block" />
      </div>
    </template>
  </div>
</template>

<style scoped>
/* Editorial rhythm: major blocks get a generous section break; inline and
   structural blocks fall back to smaller or zero spacing so the page reads
   like a considered spread, not a stacked feed. The --block-spacing-scale
   multiplier is set from Site Settings → Styling → Block Spacing. */
.block-wrap {
  margin-block-start: calc(clamp(3rem, 7vw, 6rem) * var(--block-spacing-scale, 1));
}

.block-wrap:first-child {
  margin-block-start: 0;
}

/* Inline/continuation blocks — lighter breath, never a section break */
.block-wrap[data-block-type="richText"],
.block-wrap[data-block-type="table"],
.block-wrap[data-block-type="newsletterSignup"] {
  margin-block-start: calc(clamp(2rem, 4vw, 3.5rem) * var(--block-spacing-scale, 1));
}

/* Two rich-text blocks in a row are a single reading flow — stay tight */
.block-wrap[data-block-type="richText"] + .block-wrap[data-block-type="richText"] {
  margin-block-start: calc(clamp(1rem, 2vw, 1.75rem) * var(--block-spacing-scale, 1));
}

/* Anchors are zero-height; the spacer below them carries the breath */
.block-wrap[data-block-type="inPageMenuTitle"],
.block-wrap[data-block-type="spacer"] {
  margin-block-start: 0;
}

/* When the editor placed a spacer, that is the intended gap — don't add more */
.block-wrap[data-block-type="spacer"] + .block-wrap {
  margin-block-start: 0;
}
</style>
