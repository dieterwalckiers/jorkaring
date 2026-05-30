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
      return 'min-h-[25rem] md:min-h-[38rem]'
    case 'xxxl':
      return 'min-h-[31rem] md:min-h-[48rem]'
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

const overlayStyle = computed(() => {
  const overlay = props.block.overlay
  if (!overlay || overlay === 'none') return null
  const strength = (props.block.overlayStrength ?? 40) / 100
  const color = overlay === 'darken' ? '0, 0, 0' : '255, 255, 255'
  return { backgroundColor: `rgba(${color}, ${strength})` }
})
</script>

<template>
  <!-- Full-width hero that breaks out of container constraints -->
  <div data-hero class="hero-full-bleed relative overflow-hidden" :class="heightClass">
    <ProgressiveImage
      v-if="backgroundImage"
      :media="backgroundImage"
      sizes="100vw"
      alt=""
      :object-position="`${block.centered === false ? `${block.focalPointX ?? 50}%` : 'center'} ${block.focalPointY ?? 50}%`"
      cover
      priority
      class="z-0"
    />
    <div
      v-if="overlayStyle"
      class="absolute inset-0 z-[1]"
      :style="overlayStyle"
    />
    <div
      class="relative z-10 h-full flex items-center"
      :class="heightClass"
    >
      <UContainer class="py-8 w-full">
        <BlocksHeroBlockRenderer
          v-if="block.content?.length"
          :blocks="block.content"
          :alignment="block.alignment"
          :has-background="hasBackground"
        />
      </UContainer>
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
