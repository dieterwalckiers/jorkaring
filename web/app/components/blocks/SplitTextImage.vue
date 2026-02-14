<script setup lang="ts">
import type { SplitTextImageBlock } from '~/types/blocks'
import type { Media } from '~/types/media'
import { resolveColor } from '~/utils/resolveColor'

const props = defineProps<{
  block: SplitTextImageBlock
}>()

// Collapsed text state
const collapsedByDefault = computed(() => props.block.collapsedByDefault ?? false)
const isCollapsed = ref(collapsedByDefault.value)
const textWrapperRef = ref<HTMLElement | null>(null)
const textContentRef = ref<HTMLElement | null>(null)
const textNeedsCollapsing = ref(false)

// Fade color: use block background, or fall back to the page's body background
const fadeColor = ref('white')
function updateFadeColor() {
  const bg = resolveColor(props.block.backgroundColor)
  if (bg && bg !== 'transparent') {
    fadeColor.value = bg
  } else if (typeof document !== 'undefined') {
    fadeColor.value = getComputedStyle(document.body).backgroundColor || 'white'
  }
}

watch(collapsedByDefault, (val) => {
  isCollapsed.value = val
})

// Check if text actually overflows the image-constrained height.
// When collapsed, text is absolute-positioned so it doesn't affect the
// parent's height. The parent gets its height from flex stretch (= image height).
// We compare text scrollHeight against that container height.
function measureOverflow() {
  // Once we know collapsing is needed, don't re-measure (expanding the text would
  // make wrapper taller than content, falsely clearing the flag)
  if (textNeedsCollapsing.value) return
  if (!collapsedByDefault.value || !textWrapperRef.value || !textContentRef.value) return
  const containerHeight = textWrapperRef.value.offsetHeight
  const textHeight = textContentRef.value.scrollHeight
  textNeedsCollapsing.value = containerHeight > 0 && textHeight > containerHeight
}

onMounted(() => {
  if (!collapsedByDefault.value) return

  updateFadeColor()

  // Measure after layout is computed
  nextTick(() => {
    requestAnimationFrame(() => {
      measureOverflow()
    })
  })

  // Re-measure after images load (may change image column height)
  if (document.readyState !== 'complete') {
    const onLoad = () => measureOverflow()
    window.addEventListener('load', onLoad, { once: true })
    onUnmounted(() => window.removeEventListener('load', onLoad))
  }

  // Re-measure on viewport resize
  const observer = new ResizeObserver(() => measureOverflow())
  nextTick(() => {
    if (textWrapperRef.value) observer.observe(textWrapperRef.value)
  })
  onUnmounted(() => observer.disconnect())
})

const image = computed<Media | null>(() => {
  if (!props.block.image) return null
  if (typeof props.block.image === 'string') return null
  return props.block.image
})

// Video support
const isVideo = computed(() => props.block.mediaType === 'video')
const isVideoPlaying = ref(false)
const videoIframeRef = ref<HTMLIFrameElement | null>(null)
const videoPlayerReady = ref(false)

const videoPoster = computed<Media | null>(() => {
  if (!props.block.videoPoster) return null
  if (typeof props.block.videoPoster === 'string') return null
  return props.block.videoPoster
})

// Unique player ID for this block instance
const videoPlayerId = computed(() => `vimeo-player-${props.block.id}`)

const videoIframeSrc = computed(() =>
  `https://player.vimeo.com/video/${props.block.vimeoId}?api=1&player_id=${videoPlayerId.value}&title=0&byline=0&portrait=0`
)

function postToVimeo(method: string, value?: string) {
  if (!videoIframeRef.value?.contentWindow) return
  const data = value !== undefined ? { method, value } : { method }
  // Try both formats - some Vimeo versions expect different formats
  videoIframeRef.value.contentWindow.postMessage(JSON.stringify(data), '*')
  videoIframeRef.value.contentWindow.postMessage(data, '*')
}

function subscribeToEvents() {
  postToVimeo('addEventListener', 'pause')
  postToVimeo('addEventListener', 'ended')
}

function startVideo() {
  isVideoPlaying.value = true
  // Subscribe to events each time we play (in case ready was missed)
  subscribeToEvents()
  postToVimeo('play')
}

// Listen for Vimeo player events
function handleVimeoMessage(event: MessageEvent) {
  if (!isVideo.value) return
  // Only handle messages from Vimeo
  if (typeof event.origin !== 'string' || !event.origin.includes('vimeo.com')) return

  let data: Record<string, unknown>
  if (typeof event.data === 'string') {
    try {
      data = JSON.parse(event.data)
    } catch {
      return
    }
  } else if (typeof event.data === 'object') {
    data = event.data
  } else {
    return
  }

  // Only handle events for this player instance (if player_id is present)
  if (data.player_id && data.player_id !== videoPlayerId.value && data.player_id !== props.block.id) return

  // When player is ready, subscribe to events
  if (data.event === 'ready') {
    videoPlayerReady.value = true
    subscribeToEvents()
  }

  // Show poster when paused or ended
  if (data.event === 'pause' || data.event === 'ended') {
    isVideoPlaying.value = false
  }
}

// Auto-pause when video goes off-screen
let videoObserver: IntersectionObserver | null = null

onMounted(() => {
  window.addEventListener('message', handleVimeoMessage)

  // Pause video when less than 30% visible
  if (isVideo.value && videoIframeRef.value) {
    videoObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && isVideoPlaying.value) {
          postToVimeo('pause')
          isVideoPlaying.value = false
        }
      },
      { threshold: 0.3 }
    )
    videoObserver.observe(videoIframeRef.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('message', handleVimeoMessage)
  videoObserver?.disconnect()
})

// Image takes ~45% of viewport on desktop, full width on mobile
const imageSizes = computed(() => '(max-width: 768px) 100vw, 50vw')

// Original image URL for natural sizing (avoids cropped responsive versions)
const originalImageUrl = computed(() => {
  if (!image.value?.url) return null
  const baseUrl = usePayloadBaseUrl()
  const url = image.value.url
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${baseUrl}${url}`
})

// Configuration with defaults
const imagePosition = computed(() => props.block.imagePosition ?? 'right')
const imagePercentage = computed(() => props.block.imagePercentage ?? 45)
const imageSizingMode = computed(() => props.block.imageSizingMode ?? 'ratio')
const imageRatio = computed(() => props.block.imageRatio ?? '3/2')
const imageVerticalMargin = computed(() => props.block.imageVerticalMargin ?? 'medium')
const imageSize = computed(() => props.block.imageSize ?? 'medium')
const textContainerMargin = computed(() => props.block.textContainerMargin ?? 'medium')
const backgroundColor = computed(() => resolveColor(props.block.backgroundColor))
const focalPointX = computed(() => props.block.focalPointX ?? 50)
const focalPointY = computed(() => props.block.focalPointY ?? 50)

// Computed styles - only applied on desktop (md+)
const textWidthDesktop = computed(() => `${100 - imagePercentage.value}%`)
const imageWidthDesktop = computed(() => `${imagePercentage.value}%`)

const aspectRatioClass = computed(() => {
  const ratioMap: Record<string, string> = {
    '2/3': 'aspect-[2/3]',
    '3/4': 'aspect-[3/4]',
    '4/5': 'aspect-[4/5]',
    '5/6': 'aspect-[5/6]',
    '9/10': 'aspect-[9/10]',
    '1/1': 'aspect-square',
    '10/9': 'aspect-[10/9]',
    '6/5': 'aspect-[6/5]',
    '5/4': 'aspect-[5/4]',
    '4/3': 'aspect-[4/3]',
    '3/2': 'aspect-[3/2]',
  }
  return ratioMap[imageRatio.value] || 'aspect-[3/2]'
})

const imageObjectPosition = computed(() => `${focalPointX.value}% ${focalPointY.value}%`)

const imageVerticalMarginClass = computed(() => {
  // Responsive vertical padding: smaller on mobile
  const marginMap: Record<string, string> = {
    none: 'py-0',
    small: 'py-2 md:py-4',
    medium: 'py-4 md:py-8',
    large: 'py-8 md:py-16',
  }
  return marginMap[imageVerticalMargin.value] || 'py-4 md:py-8'
})

const imageHorizontalMargin = computed(() => props.block.imageHorizontalMargin ?? 'none')

const imageHorizontalMarginClass = computed(() => {
  // Responsive horizontal padding: smaller on mobile
  const marginMap: Record<string, string> = {
    none: 'px-0',
    small: 'px-2 md:px-4',
    medium: 'px-4 md:px-8',
    large: 'px-8 md:px-16',
  }
  return marginMap[imageHorizontalMargin.value] || 'px-0'
})

const imageSizeMaxWidth = computed(() => {
  const sizeMap: Record<string, string> = {
    'tiny-icon': '32px',
    'small-icon': '48px',
    'icon': '64px',
    'large-icon': '100px',
    'tiny': '200px',
    'small': '300px',
    'medium': '430px',
    'large': '700px',
    'xlarge': '900px',
    'huge': '1200px',
  }
  return sizeMap[imageSize.value] || '430px'
})

const textContainerMarginClass = computed(() => {
  // Responsive padding: smaller on mobile
  const marginMap: Record<string, string> = {
    none: 'p-0',
    small: 'p-2 md:p-4',
    medium: 'p-4 md:p-8',
    large: 'p-6 md:p-16',
  }
  return marginMap[textContainerMargin.value] || 'p-4 md:p-8'
})

const fullBleed = computed(() => props.block.fullBleed ?? false)
const roundedCorners = computed(() => props.block.roundedCorners ?? false)
const startNumberedListAtZero = computed(() => props.block.startNumberedListAtZero ?? false)
</script>

<template>
  <!-- Full-bleed wrapper: background color stretches full viewport width -->
  <div
    v-if="fullBleed"
    class="split-text-image-full-bleed"
    :style="{ backgroundColor }"
  >
    <section
      class="split-text-image-inner flex flex-col md:flex-row md:items-stretch overflow-hidden mx-auto"
      :class="{
        'md:flex-row-reverse': imagePosition === 'left',
      }"
    >
      <!-- Text section -->
      <div
        ref="textWrapperRef"
        class="w-full"
        :class="collapsedByDefault && isCollapsed
          ? 'md:relative md:overflow-hidden'
          : 'flex items-start justify-center'"
        :style="{ '--text-width-desktop': textWidthDesktop }"
      >
        <div
          ref="textContentRef"
          :class="[
            textContainerMarginClass,
            'text-left w-full',
            collapsedByDefault && isCollapsed ? 'md:absolute md:inset-x-0 md:top-0' : '',
          ]"
        >
          <div class="split-text-image-content">
            <RichTextRenderer :content="block.text" :start-numbered-list-at-zero="startNumberedListAtZero" />
          </div>
          <div v-if="block.buttons?.length" class="flex flex-wrap gap-3 md:gap-4 mt-6 md:mt-10">
            <UiButtonOutline
              v-for="(button, index) in block.buttons"
              :key="button.id || index"
              :to="button.link"
            >
              {{ button.caption }}
            </UiButtonOutline>
          </div>
          <button
            v-if="collapsedByDefault && !isCollapsed && textNeedsCollapsing"
            class="mt-4 text-sm font-semibold underline underline-offset-2 cursor-pointer hover:opacity-70 transition-opacity"
            @click="isCollapsed = true"
          >
            Lees minder
          </button>
        </div>
        <div
          v-if="collapsedByDefault && isCollapsed && textNeedsCollapsing"
          class="hidden md:block absolute bottom-0 left-0 right-0 z-10 h-32"
          :style="{ background: `linear-gradient(to bottom, transparent, ${fadeColor})` }"
        />
        <button
          v-if="collapsedByDefault && isCollapsed && textNeedsCollapsing"
          class="hidden md:block absolute bottom-2 z-20 text-sm font-semibold underline underline-offset-2 cursor-pointer hover:opacity-70 transition-opacity"
          :class="textContainerMarginClass"
          @click="isCollapsed = false"
        >
          Lees meer
        </button>
      </div>

      <!-- Image/Video -->
      <div
        class="w-full mt-6 md:mt-0"
        :class="[
          !isVideo && imageSizingMode === 'ratio' ? imageVerticalMarginClass : 'flex items-center',
          !isVideo && imageSizingMode === 'ratio' ? imageHorizontalMarginClass : '',
          imagePosition === 'right' ? 'md:pl-4' : 'md:pr-4'
        ]"
        :style="{ '--image-width-desktop': imageWidthDesktop }"
      >
        <!-- Video -->
        <template v-if="isVideo">
          <div class="relative w-full">
            <!-- Preloaded Vimeo iframe -->
            <iframe
              :id="videoPlayerId"
              ref="videoIframeRef"
              :src="videoIframeSrc"
              class="w-full aspect-video"
              frameborder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen
            />
            <!-- Poster overlay -->
            <div
              class="absolute inset-0 cursor-pointer transition-opacity duration-300"
              :class="isVideoPlaying ? 'pointer-events-none opacity-0' : 'opacity-100'"
              @click="startVideo"
            >
              <ProgressiveImage
                v-if="videoPoster"
                :media="videoPoster"
                :sizes="imageSizes"
                alt="Video poster"
                cover
                class="aspect-video"
              />
              <div class="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <button
                  class="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform hover:scale-110"
                  aria-label="Play video"
                >
                  <svg class="ml-1 h-6 w-6 text-black" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <span
                  v-if="block.videoCtaCaption"
                  class="rounded-full bg-white px-6 py-2 text-base font-semibold text-black shadow-lg"
                >
                  {{ block.videoCtaCaption }}
                </span>
              </div>
            </div>
          </div>
        </template>
        <!-- Image: ratio-based sizing -->
        <template v-else-if="imageSizingMode === 'ratio'">
          <ProgressiveImage
            v-if="image"
            :media="image"
            :sizes="imageSizes"
            :object-position="imageObjectPosition"
            :class="aspectRatioClass"
          />
          <div v-else :class="[aspectRatioClass, 'bg-gray-200 flex items-center justify-center text-gray-400']">
            Image
          </div>
        </template>
        <!-- Image: natural sizing -->
        <template v-else>
          <img
            v-if="originalImageUrl"
            :src="originalImageUrl"
            :alt="image?.alt || ''"
            class="h-auto max-w-full mx-auto md:mx-0"
            :style="{ maxWidth: `min(100%, ${imageSizeMaxWidth})` }"
            loading="lazy"
          />
          <div
            v-else
            class="bg-gray-200 flex items-center justify-center text-gray-400 mx-auto md:mx-0"
            :style="{ width: imageSizeMaxWidth, height: '200px' }"
          >
            Image
          </div>
        </template>
      </div>
    </section>
  </div>

  <!-- Default (non-full-bleed) -->
  <section
    v-else
    class="flex flex-col md:flex-row md:items-stretch overflow-hidden"
    :class="{
      'md:flex-row-reverse': imagePosition === 'left',
      'rounded-3xl': roundedCorners
    }"
    :style="{ backgroundColor }"
  >
    <!-- Text section -->
    <div
      ref="textWrapperRef"
      class="w-full"
      :class="collapsedByDefault && isCollapsed
        ? 'md:relative md:overflow-hidden'
        : 'flex items-start justify-center'"
      :style="{ '--text-width-desktop': textWidthDesktop }"
    >
      <div
        ref="textContentRef"
        :class="[
          textContainerMarginClass,
          'text-left w-full',
          collapsedByDefault && isCollapsed ? 'md:absolute md:inset-x-0 md:top-0' : '',
        ]"
      >
        <div class="split-text-image-content">
          <RichTextRenderer :content="block.text" :start-numbered-list-at-zero="startNumberedListAtZero" />
        </div>

        <!-- CTA Buttons -->
        <div v-if="block.buttons?.length" class="flex flex-wrap gap-3 md:gap-4 mt-6 md:mt-10">
          <UiButtonOutline
            v-for="(button, index) in block.buttons"
            :key="button.id || index"
            :to="button.link"
          >
            {{ button.caption }}
          </UiButtonOutline>
        </div>

        <!-- "Lees minder" button (inside normal flow when expanded) -->
        <button
          v-if="collapsedByDefault && !isCollapsed && textNeedsCollapsing"
          class="mt-4 text-sm font-semibold underline underline-offset-2 cursor-pointer hover:opacity-70 transition-opacity"
          @click="isCollapsed = true"
        >
          Lees minder
        </button>
      </div>

      <!-- Fade + button: absolutely positioned at bottom of the collapsed wrapper -->
      <div
        v-if="collapsedByDefault && isCollapsed && textNeedsCollapsing"
        class="hidden md:block absolute bottom-0 left-0 right-0 z-10 h-48"
        :style="{ background: `linear-gradient(to bottom, transparent 0%, ${fadeColor} 60%)` }"
      />
      <button
        v-if="collapsedByDefault && isCollapsed && textNeedsCollapsing"
        class="hidden md:block absolute bottom-2 z-20 text-sm font-semibold underline underline-offset-2 cursor-pointer hover:opacity-70 transition-opacity"
        :class="textContainerMarginClass"
        @click="isCollapsed = false"
      >
        Lees meer
      </button>
    </div>

    <!-- Image/Video -->
    <div
      class="w-full mt-6 md:mt-0"
      :class="[
        !isVideo && imageSizingMode === 'ratio' ? imageVerticalMarginClass : 'flex items-center',
        !isVideo && imageSizingMode === 'ratio' ? imageHorizontalMarginClass : '',
        imagePosition === 'right' ? 'md:pl-4' : 'md:pr-4'
      ]"
      :style="{ '--image-width-desktop': imageWidthDesktop }"
    >
      <!-- Video -->
      <template v-if="isVideo">
        <div class="relative w-full">
          <!-- Preloaded Vimeo iframe -->
          <iframe
            :id="videoPlayerId"
            ref="videoIframeRef"
            :src="videoIframeSrc"
            class="w-full aspect-video"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowfullscreen
          />
          <!-- Poster overlay -->
          <div
            class="absolute inset-0 cursor-pointer transition-opacity duration-300"
            :class="isVideoPlaying ? 'pointer-events-none opacity-0' : 'opacity-100'"
            @click="startVideo"
          >
            <ProgressiveImage
              v-if="videoPoster"
              :media="videoPoster"
              :sizes="imageSizes"
              alt="Video poster"
              cover
              class="aspect-video"
            />
            <div class="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <button
                class="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform hover:scale-110"
                aria-label="Play video"
              >
                <svg class="ml-1 h-6 w-6 text-black" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              <span
                v-if="block.videoCtaCaption"
                class="rounded-full bg-white px-6 py-2 text-base font-semibold text-black shadow-lg"
              >
                {{ block.videoCtaCaption }}
              </span>
            </div>
          </div>
        </div>
      </template>
      <!-- Image: ratio-based sizing -->
      <template v-else-if="imageSizingMode === 'ratio'">
        <ProgressiveImage
          v-if="image"
          :media="image"
          :sizes="imageSizes"
          :object-position="imageObjectPosition"
          :class="aspectRatioClass"
        />
        <div
          v-else
          :class="[aspectRatioClass, 'bg-gray-200 flex items-center justify-center text-gray-400']"
        >
          Image
        </div>
      </template>
      <!-- Image: natural sizing -->
      <template v-else>
        <img
          v-if="originalImageUrl"
          :src="originalImageUrl"
          :alt="image?.alt || ''"
          class="h-auto max-w-full mx-auto md:mx-0"
          :style="{ maxWidth: `min(100%, ${imageSizeMaxWidth})` }"
          loading="lazy"
        />
        <div
          v-else
          class="bg-gray-200 flex items-center justify-center text-gray-400 mx-auto md:mx-0"
          :style="{ width: imageSizeMaxWidth, height: '200px' }"
        >
          Image
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
/* Apply dynamic widths only on desktop */
@media (min-width: 768px) {
  section > div:first-child {
    width: var(--text-width-desktop);
  }
  section > div:last-child {
    width: var(--image-width-desktop);
  }
}

/* Full-bleed: background stretches full viewport width */
.split-text-image-full-bleed {
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  z-index: 1;
}

/* Inner content stays within the site container */
.split-text-image-inner {
  max-width: var(--ui-container, 1536px);
  padding-inline: 1rem;
}

@media (min-width: 640px) {
  .split-text-image-inner {
    padding-inline: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .split-text-image-inner {
    padding-inline: 2rem;
  }
}
</style>
