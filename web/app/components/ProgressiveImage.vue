<script setup lang="ts">
import type { Media } from '~/types/media'

const props = withDefaults(
  defineProps<{
    media: Media
    sizes?: string
    alt?: string
    imgClass?: string
    objectPosition?: string
    /** When true, component fills its container absolutely (for background images) */
    cover?: boolean
    /** When true, image is above the fold and should load eagerly with high priority */
    priority?: boolean
  }>(),
  {
    cover: false,
    priority: false,
  }
)

const getAbsoluteUrl = useMediaUrlResolver()

// Get thumbnail URL for placeholder
const placeholderUrl = computed(() => {
  return getAbsoluteUrl(props.media.sizes?.thumbnail?.url) || getAbsoluteUrl(props.media.url)
})

// Build responsive image data inline (avoiding composable call inside computed)
const SIZE_WIDTHS = { thumbnail: 400, small: 600, medium: 900, large: 1200 } as const
type SizeName = keyof typeof SIZE_WIDTHS

const imageData = computed(() => {
  const media = props.media
  if (!media) return null

  const srcsetParts: string[] = []
  const sizeNames: SizeName[] = ['thumbnail', 'small', 'medium', 'large']

  for (const sizeName of sizeNames) {
    const sizeData = media.sizes?.[sizeName]
    if (sizeData?.url) {
      const url = getAbsoluteUrl(sizeData.url)
      if (url) {
        srcsetParts.push(`${url} ${SIZE_WIDTHS[sizeName]}w`)
      }
    }
  }

  // Add original as largest option if wider than large size
  const originalUrl = getAbsoluteUrl(media.url)
  if (originalUrl && media.width && media.width > SIZE_WIDTHS.large) {
    srcsetParts.push(`${originalUrl} ${media.width}w`)
  }

  // Fallback src: use large size if available, otherwise original
  const largeSizeUrl = getAbsoluteUrl(media.sizes?.large?.url)
  const src = largeSizeUrl || originalUrl || ''

  if (!src) return null

  return {
    src,
    srcset: srcsetParts.join(', '),
    sizes: props.sizes || '(max-width: 600px) 100vw, (max-width: 900px) 900px, 1200px',
    alt: media.alt || '',
  }
})

const isLoaded = ref(false)
const hasError = ref(false)
const fullImageRef = ref<HTMLImageElement | null>(null)

function onLoad() {
  isLoaded.value = true
}

function onError() {
  hasError.value = true
  // Still show the placeholder if main image fails
  isLoaded.value = true
}

// Handle cached images - check if already loaded on mount
onMounted(async () => {
  await nextTick()
  if (fullImageRef.value?.complete && fullImageRef.value?.naturalWidth > 0) {
    isLoaded.value = true
  }
})
</script>

<template>
  <div
    :class="[
      'progressive-image overflow-hidden',
      cover ? 'absolute inset-0' : 'relative',
    ]"
  >
    <!-- Blurred placeholder (thumbnail) -->
    <img
      v-if="placeholderUrl && !isLoaded"
      :src="placeholderUrl"
      :alt="alt || media.alt || ''"
      :class="[imgClass, 'absolute inset-0 w-full h-full object-cover blur-lg scale-105']"
      :style="{ objectPosition: objectPosition }"
      aria-hidden="true"
    />

    <!-- Full resolution image -->
    <img
      v-if="imageData"
      ref="fullImageRef"
      :src="imageData.src"
      :srcset="imageData.srcset"
      :sizes="imageData.sizes"
      :alt="alt || media.alt || ''"
      :width="media.width"
      :height="media.height"
      :class="[
        imgClass,
        'w-full h-full object-cover transition-opacity duration-500',
        isLoaded ? 'opacity-100' : 'opacity-0',
      ]"
      :style="{ objectPosition: objectPosition }"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : undefined"
      @load="onLoad"
      @error="onError"
    />
  </div>
</template>

<style scoped>
.progressive-image {
  /* Ensure container has dimensions from aspect ratio or parent */
  background-color: var(--ui-bg-muted, #f3f4f6);
}
</style>
