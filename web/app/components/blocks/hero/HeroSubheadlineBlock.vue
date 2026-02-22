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
    class="text-lg md:text-xl lg:text-2xl"
    :class="[
      hasBackground ? 'text-white/80' : 'text-gray-600 dark:text-gray-400',
      alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center',
    ]"
  >
    {{ block.text }}
  </p>
</template>
