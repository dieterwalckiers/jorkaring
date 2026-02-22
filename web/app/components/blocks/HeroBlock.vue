<script setup lang="ts">
import type { HeroBlock as HeroBlockType } from '~/types/blocks'
import type { Media } from '~/types/media'

const props = defineProps<{
  block: HeroBlockType
}>()

const heightClass = computed(() => {
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

const backgroundImage = computed<Media | null>(() => {
  if (!props.block.backgroundImage) return null
  if (typeof props.block.backgroundImage === 'string') return null
  return props.block.backgroundImage
})

const hasBackground = computed(() => Boolean(backgroundImage.value))
</script>

<template>
  <!-- Full-width hero that breaks out of container constraints -->
  <div class="hero-full-bleed relative overflow-hidden" :class="heightClass">
    <ProgressiveImage
      v-if="backgroundImage"
      :media="backgroundImage"
      sizes="100vw"
      alt=""
      :object-position="`center ${block.focalPointY ?? 50}%`"
      cover
      priority
      class="z-0"
    />
    <div
      class="relative z-10 h-full flex items-center"
      :class="heightClass"
    >
      <div class="container mx-auto px-4 py-8 w-full">
        <BlocksHeroBlockRenderer
          v-if="block.content?.length"
          :blocks="block.content"
          :alignment="block.alignment"
          :has-background="hasBackground"
        />
      </div>
    </div>
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
