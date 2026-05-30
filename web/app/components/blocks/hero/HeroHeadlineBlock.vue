<script setup lang="ts">
import type { HeroHeadlineBlock as HeroHeadlineBlockType } from '~/types/blocks'

const props = defineProps<{
  block: HeroHeadlineBlockType
  alignment?: 'left' | 'center' | 'right'
  hasBackground?: boolean
}>()

const tag = computed(() => props.block.fontSize ?? 'h1')
const sizeClass = computed(() => `editorial-heading--${props.block.fontSize ?? 'h1'}`)
</script>

<template>
  <component
    :is="tag"
    class="hero-headline editorial-heading text-color-base"
    :class="[sizeClass, alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center']"
  >
    <RichTextInline :content="block.text" />
  </component>
</template>

<style scoped>
.hero-headline {
  margin-block: 0;
}
</style>
