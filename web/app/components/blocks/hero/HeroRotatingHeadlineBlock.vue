<script setup lang="ts">
import type { HeroRotatingHeadlineBlock as HeroRotatingHeadlineBlockType } from '~/types/blocks'

const props = defineProps<{
  block: HeroRotatingHeadlineBlockType
  alignment?: 'left' | 'center' | 'right'
  hasBackground?: boolean
}>()

const words = computed(() =>
  (props.block.rotatingWords ?? [])
    .map((entry) => entry.word?.trim())
    .filter((word): word is string => Boolean(word)),
)

const intervalMs = computed(() => Math.max(800, props.block.intervalMs ?? 2400))

const currentIndex = ref(0)
const currentWord = computed(() => words.value[currentIndex.value] ?? '')

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  if (words.value.length < 2) return
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % words.value.length
  }, intervalMs.value)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <h1
    class="hero-rotating-headline text-color-base text-2xl md:text-3xl lg:text-4xl font-normal tracking-tight"
    :class="alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center'"
  >
    <span v-if="block.prefix">{{ block.prefix }}&nbsp;</span><span class="rotating-slot" aria-live="polite"><Transition name="rotate-word"><span :key="currentWord" class="rotating-word">{{ currentWord }}</span></Transition></span><span v-if="block.suffix">&nbsp;{{ block.suffix }}</span>
  </h1>
</template>

<style scoped>
.hero-rotating-headline {
  line-height: 1.1;
}

.rotating-slot {
  position: relative;
  display: inline-block;
  vertical-align: bottom;
  overflow: hidden;
  padding: 0.15em 0.05em;
  margin: -0.15em -0.05em;
}

.rotating-word {
  display: inline-block;
  white-space: nowrap;
  will-change: transform, opacity;
}

.rotate-word-enter-active,
.rotate-word-leave-active {
  transition:
    transform 0.55s cubic-bezier(0.33, 1, 0.68, 1),
    opacity 0.35s ease;
}

.rotate-word-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.rotate-word-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.rotate-word-leave-active {
  position: absolute;
  inset: 0.15em 0.05em;
}

@media (prefers-reduced-motion: reduce) {
  .rotate-word-enter-active,
  .rotate-word-leave-active {
    transition: opacity 0.2s linear;
  }

  .rotate-word-enter-from,
  .rotate-word-leave-to {
    transform: none;
  }
}
</style>
