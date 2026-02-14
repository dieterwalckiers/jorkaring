<script setup lang="ts">
import type { HeroBlock as HeroBlockType } from '~/types/blocks'
import type { Media } from '~/types/media'

const props = defineProps<{
  block: HeroBlockType
}>()

const alignmentClass = computed(() => {
  switch (props.block.alignment) {
    case 'left':
      return 'left'
    case 'right':
      return 'right'
    default:
      return 'center'
  }
})

const heightClass = computed(() => {
  // Responsive heights: smaller on mobile, full size on md+
  switch (props.block.height) {
    case 'small':
      return 'min-h-48 md:min-h-64'
    case 'large':
      return 'min-h-64 md:min-h-96'
    case 'xl':
      return 'min-h-80 md:min-h-[30rem]'
    case 'xxl':
      return 'min-h-[80vh] md:min-h-screen'
    default:
      return 'min-h-56 md:min-h-80'
  }
})

const links = computed(() => {
  if (!props.block.links) return []
  return props.block.links.map((link) => ({
    label: link.label,
    to: link.url,
    variant: link.variant || 'solid',
    size: 'lg' as const,
  }))
})

const backgroundImage = computed<Media | null>(() => {
  if (!props.block.backgroundImage) return null
  if (typeof props.block.backgroundImage === 'string') return null
  return props.block.backgroundImage
})
</script>

<template>
  <!-- Full-width hero that breaks out of container constraints -->
  <div class="hero-full-bleed relative overflow-hidden" :class="heightClass">
    <ProgressiveImage
      v-if="backgroundImage"
      :media="backgroundImage"
      sizes="100vw"
      :alt="block.headline || ''"
      :object-position="`center ${block.focalPointY ?? 50}%`"
      cover
      priority
      class="z-0"
    />
    <UPageHero
      :title="block.headline"
      :description="block.subheadline"
      :links="links"
      :align="alignmentClass"
      :ui="backgroundImage ? { title: 'text-white', description: 'text-white/80' } : {}"
      :class="backgroundImage ? 'relative z-10 h-full' : 'h-full'"
    />
  </div>
</template>

<style scoped>
/* Break out of parent container to achieve full viewport width */
.hero-full-bleed {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  /* Stay below sticky header (z-index: 50) */
  z-index: 1;
}
</style>
