<script setup lang="ts">
import type { SpacerBlock as SpacerBlockType } from '~/types/blocks'

const props = defineProps<{
  block: SpacerBlockType
}>()

const heightClass = computed(() => {
  // Mobile-first: smaller heights on mobile, full height on md+
  switch (props.block.height) {
    case 'xxxs':
      return 'h-0.5 md:h-1'
    case 'xxs':
      return 'h-1 md:h-2'
    case 'xs':
      return 'h-2 md:h-4'
    case 'small':
      return 'h-4 md:h-8'
    case 'large':
      return 'h-16 md:h-32'
    case 'xl':
      return 'h-24 md:h-48'
    case 'xxl':
      return 'h-32 md:h-64'
    case 'xxxl':
      return 'h-48 md:h-96'
    case 'medium':
    default:
      return 'h-8 md:h-16'
  }
})
</script>

<template>
  <div :class="heightClass" aria-hidden="true" />
</template>
