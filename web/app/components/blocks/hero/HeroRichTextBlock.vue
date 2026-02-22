<script setup lang="ts">
import type { HeroRichTextBlock as HeroRichTextBlockType } from '~/types/blocks'

defineProps<{
  block: HeroRichTextBlockType
  alignment?: 'left' | 'center' | 'right'
  hasBackground?: boolean
}>()
</script>

<template>
  <div
    :class="[
      block.layout === 'left' ? 'w-full md:w-1/2 mr-auto' : block.layout === 'right' ? 'w-full md:w-1/2 ml-auto' : 'w-full',
      hasBackground ? 'text-white [&_p]:text-white/80 [&_a]:text-white [&_a]:underline' : '',
      alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center',
    ]"
  >
    <RichTextRenderer :content="block.content" />
  </div>
</template>
