<script setup lang="ts">
import type { HeroCtaBlock as HeroCtaBlockType } from '~/types/blocks'

const props = defineProps<{
  block: HeroCtaBlockType
  alignment?: 'left' | 'center' | 'right'
  hasBackground?: boolean
}>()

const links = computed(() => {
  return props.block.links.map((link) => ({
    label: link.label,
    to: link.url,
    variant: link.variant || 'solid',
    size: 'lg' as const,
  }))
})
</script>

<template>
  <div
    class="flex flex-wrap gap-3"
    :class="[
      alignment === 'left' ? 'justify-start' : alignment === 'right' ? 'justify-end' : 'justify-center',
    ]"
  >
    <UButton
      v-for="(link, index) in links"
      :key="index"
      :label="link.label"
      :to="link.to"
      :variant="link.variant"
      :size="link.size"
    />
  </div>
</template>
