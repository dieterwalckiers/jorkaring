<script setup lang="ts">
import type { HeroHeadlineBlock as HeroHeadlineBlockType } from '~/types/blocks'

defineProps<{
  block: HeroHeadlineBlockType
  alignment?: 'left' | 'center' | 'right'
  hasBackground?: boolean
}>()
</script>

<template>
  <h1
    class="text-color-base text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
    :class="alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center'"
  >
    <RichTextInline :content="block.text" />
  </h1>
</template>
