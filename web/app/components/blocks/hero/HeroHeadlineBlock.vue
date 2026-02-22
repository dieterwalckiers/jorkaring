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
    class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
    :class="[
      hasBackground ? 'text-white' : '',
      alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center',
    ]"
  >
    {{ block.text }}
  </h1>
</template>
