<script setup lang="ts">
import type { HeroSpacerBlock as HeroSpacerBlockType } from '~/types/blocks'

const props = defineProps<{
  block: HeroSpacerBlockType
}>()

const heightClass = computed(() => {
  switch (props.block.height) {
    case 'xs':
      return 'h-2 md:h-4'
    case 'small':
      return 'h-4 md:h-8'
    case 'large':
      return 'h-16 md:h-32'
    case 'xl':
      return 'h-24 md:h-48'
    case 'medium':
    default:
      return 'h-8 md:h-16'
  }
})
</script>

<template>
  <div :class="heightClass" aria-hidden="true" />
</template>
