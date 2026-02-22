<script setup lang="ts">
import type { LogoMarqueeBlock as LogoMarqueeBlockType } from '~/types/blocks'
import type { Media } from '~/types/media'

const props = defineProps<{
  block: LogoMarqueeBlockType
}>()

const baseUrl = usePayloadBaseUrl()

const containerRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const needsScroll = ref(false)
const measured = ref(false)

const getImageUrl = (media: Media | string): string | undefined => {
  if (typeof media === 'string') return undefined
  const url = media.sizes?.small?.url || media.url
  if (!url) return undefined
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${baseUrl}${url}`
}

const getImageAlt = (logo: { image: Media | string; alt?: string }): string => {
  if (logo.alt) return logo.alt
  if (typeof logo.image !== 'string' && logo.image.alt) return logo.image.alt
  return ''
}

const logoHeight = computed(() => {
  switch (props.block.logoSize) {
    case 'small': return '64px'
    case 'large': return '128px'
    default: return '96px'
  }
})

const gapClass = computed(() => {
  switch (props.block.logoSize) {
    case 'small': return 'gap-14 md:gap-20'
    case 'large': return 'gap-20 md:gap-28'
    default: return 'gap-16 md:gap-24'
  }
})

const paddingClass = computed(() => {
  switch (props.block.logoSize) {
    case 'small': return 'py-8 md:py-12'
    case 'large': return 'py-12 md:py-20'
    default: return 'py-10 md:py-16'
  }
})

const animationDuration = computed(() => {
  const logoCount = props.block.logos?.length || 1
  const baseDuration = logoCount * 3
  switch (props.block.speed) {
    case 'slow': return `${baseDuration * 1.8}s`
    case 'fast': return `${baseDuration * 0.6}s`
    default: return `${baseDuration}s`
  }
})

const validLogos = computed(() => {
  if (!props.block.logos) return []
  return props.block.logos.filter((logo) => {
    if (typeof logo.image === 'string') return false
    return Boolean(logo.image?.url)
  })
})

function measure() {
  if (!containerRef.value || !trackRef.value) return
  const containerWidth = containerRef.value.clientWidth
  // trackRef always contains only the primary set — measure that
  const trackWidth = trackRef.value.scrollWidth
  needsScroll.value = trackWidth > containerWidth
  measured.value = true
}

let resizeObserver: ResizeObserver | undefined

onMounted(() => {
  const images = trackRef.value?.querySelectorAll('img') || []
  let loaded = 0
  const total = images.length

  const onImageReady = () => {
    loaded++
    if (loaded >= total) measure()
  }

  images.forEach((img) => {
    if (img.complete) {
      onImageReady()
    } else {
      img.addEventListener('load', onImageReady, { once: true })
      img.addEventListener('error', onImageReady, { once: true })
    }
  })

  if (total === 0) measure()

  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => measure())
    resizeObserver.observe(containerRef.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <div
    v-if="validLogos.length >= 2"
    ref="containerRef"
    role="marquee"
    aria-label="Logo carousel"
    class="w-full overflow-hidden"
    :class="[
      paddingClass,
      { 'marquee-pause-on-hover': block.pauseOnHover && needsScroll },
      measured ? 'opacity-100' : 'opacity-0',
    ]"
  >
    <div :class="needsScroll ? 'marquee-mask' : ''">
      <div
        ref="trackRef"
        class="flex items-center w-max"
        :class="[
          gapClass,
          needsScroll ? 'marquee-track' : 'mx-auto',
        ]"
        :style="needsScroll ? { animationDuration } : undefined"
      >
        <!-- Primary logo set -->
        <img
          v-for="logo in validLogos"
          :key="logo.id || getImageAlt(logo)"
          :src="getImageUrl(logo.image)"
          :alt="getImageAlt(logo)"
          :style="{ height: logoHeight }"
          class="marquee-logo shrink-0 w-auto object-contain select-none"
          loading="lazy"
          draggable="false"
        />
        <!-- Duplicate set for seamless loop (only when scrolling) -->
        <template v-if="needsScroll">
          <img
            v-for="logo in validLogos"
            :key="`dup-${logo.id || getImageAlt(logo)}`"
            :src="getImageUrl(logo.image)"
            :alt="getImageAlt(logo)"
            :style="{ height: logoHeight }"
            class="marquee-logo shrink-0 w-auto object-contain select-none"
            loading="lazy"
            draggable="false"
            aria-hidden="true"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marquee-mask {
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 5%,
    black 95%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 5%,
    black 95%,
    transparent 100%
  );
}

.marquee-track {
  animation: marquee-scroll linear infinite;
  will-change: transform;
}

@keyframes marquee-scroll {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-50%, 0, 0);
  }
}

.marquee-pause-on-hover:hover .marquee-track {
  animation-play-state: paused;
}

.marquee-logo {
  filter: grayscale(100%);
  opacity: 0.5;
  transition: filter 0.4s ease, opacity 0.4s ease;
}

.marquee-logo:hover {
  filter: grayscale(0%);
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation-play-state: paused;
  }
}
</style>
