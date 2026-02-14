<script setup lang="ts">
import type { VideoBlock as VideoBlockType } from '~/types/blocks'
import type { Media } from '~/types/media'

const props = defineProps<{
  block: VideoBlockType
}>()

const isPlaying = ref(false)
const iframeRef = ref<HTMLIFrameElement | null>(null)

const posterImage = computed<Media | null>(() => {
  if (!props.block.posterImage) return null
  if (typeof props.block.posterImage === 'string') return null
  return props.block.posterImage
})

const widthClass = computed(() => {
  switch (props.block.width) {
    case 'half':
      return 'w-1/2'
    case '2/3':
      return 'w-2/3'
    case '3/4':
      return 'w-3/4'
    default:
      return 'w-full'
  }
})

// Unique player ID for this block instance
const playerId = computed(() => `vimeo-player-${props.block.id}`)

// Include api=1 and player_id to enable postMessage API for controlling playback
const iframeSrc = computed(() =>
  `https://player.vimeo.com/video/${props.block.vimeoId}?api=1&player_id=${playerId.value}&title=0&byline=0&portrait=0`
)

const playerReady = ref(false)

function postToVimeo(method: string, value?: string) {
  if (!iframeRef.value?.contentWindow) return
  const data = value !== undefined ? { method, value } : { method }
  // Try both formats - some Vimeo versions expect different formats
  iframeRef.value.contentWindow.postMessage(JSON.stringify(data), '*')
  iframeRef.value.contentWindow.postMessage(data, '*')
}

function subscribeToEvents() {
  postToVimeo('addEventListener', 'pause')
  postToVimeo('addEventListener', 'ended')
}

function startVideo() {
  isPlaying.value = true
  // Subscribe to events each time we play (in case ready was missed)
  subscribeToEvents()
  postToVimeo('play')
}

// Listen for Vimeo player events
function handleVimeoMessage(event: MessageEvent) {
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
  if (data.player_id && data.player_id !== playerId.value && data.player_id !== props.block.id) return

  // When player is ready, subscribe to events
  if (data.event === 'ready') {
    playerReady.value = true
    subscribeToEvents()
  }

  // Show poster when paused or ended
  if (data.event === 'pause' || data.event === 'ended') {
    isPlaying.value = false
  }
}

// Auto-pause when video goes off-screen
const containerRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  window.addEventListener('message', handleVimeoMessage)

  // Pause video when less than 30% visible
  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting && isPlaying.value) {
        postToVimeo('pause')
        isPlaying.value = false
      }
    },
    { threshold: 0.3 }
  )
  if (containerRef.value) {
    observer.observe(containerRef.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('message', handleVimeoMessage)
  observer?.disconnect()
})
</script>

<template>
  <div ref="containerRef" class="mx-auto relative aspect-video" :class="widthClass">
    <!-- Preloaded Vimeo iframe (always rendered, behind poster) -->
    <iframe
      :id="playerId"
      ref="iframeRef"
      :src="iframeSrc"
      class="absolute inset-0 h-full w-full"
      frameborder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
    />

    <!-- Poster overlay with play button and CTA -->
    <div
      class="absolute inset-0 z-10 cursor-pointer transition-opacity duration-300"
      :class="isPlaying ? 'pointer-events-none opacity-0' : 'opacity-100'"
      @click="startVideo"
    >
      <ProgressiveImage
        v-if="posterImage"
        :media="posterImage"
        sizes="100vw"
        :alt="posterImage.alt || 'Video poster'"
        cover
      />
      <!-- Dark overlay for readability -->
      <div class="absolute inset-0 bg-black/40" />
      <!-- Overlay with play button and CTA -->
      <div class="absolute inset-0 flex flex-col items-center justify-center gap-6">
        <!-- Play button -->
        <button
          class="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform hover:scale-110"
          aria-label="Play video"
        >
          <svg class="ml-1 h-8 w-8 text-black" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        <!-- CTA caption -->
        <span
          v-if="block.ctaCaption"
          class="rounded-full bg-white px-8 py-3 text-lg font-semibold text-black shadow-lg"
        >
          {{ block.ctaCaption }}
        </span>
      </div>
    </div>
  </div>
</template>
