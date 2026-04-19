<script setup lang="ts">
import type { HeroCtaBlock as HeroCtaBlockType } from '~/types/blocks'

defineProps<{
  block: HeroCtaBlockType
  alignment?: 'left' | 'center' | 'right'
  hasBackground?: boolean
}>()
</script>

<template>
  <div
    class="flex flex-wrap gap-3"
    :class="[
      alignment === 'left' ? 'justify-start' : alignment === 'right' ? 'justify-end' : 'justify-center',
    ]"
  >
    <UiButtonOutline
      v-for="(link, index) in block.links"
      :key="link.id || index"
      :to="link.url"
    >
      {{ link.label }}
    </UiButtonOutline>
  </div>
</template>
