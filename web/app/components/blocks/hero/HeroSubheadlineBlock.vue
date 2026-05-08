<script setup lang="ts">
import type { HeroSubheadlineBlock as HeroSubheadlineBlockType } from '~/types/blocks'

defineProps<{
  block: HeroSubheadlineBlockType
  alignment?: 'left' | 'center' | 'right'
  hasBackground?: boolean
}>()
</script>

<template>
  <p
    class="text-color-base text-lg md:text-xl lg:text-2xl"
    :class="alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center'"
  >
    <RichTextInline :content="block.text" />
  </p>
</template>
