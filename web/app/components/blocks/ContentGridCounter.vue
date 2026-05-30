<script setup lang="ts">
import { resolveColor } from '~/utils/resolveColor'

const props = defineProps<{
  value?: number
  infinite?: boolean
  showPlus?: boolean
  label?: string
  color?: string
}>()

const DURATION = 1100 // ms — count-up duration
// Brand ease-out-cubic (CLAUDE.md): cubic-bezier(0.33, 1, 0.68, 1)
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3)

const target = computed(() => Number(props.value) || 0)
const isInfinite = computed(() => props.infinite === true)
const showPlus = computed(() => props.showPlus === true && !isInfinite.value)

// Number of decimal places to preserve from the configured target, so a
// target of 4.5 animates and lands on "4,5" rather than "5".
const decimals = computed(() => {
  const str = String(target.value)
  const dot = str.indexOf('.')
  return dot === -1 ? 0 : str.length - dot - 1
})

// Infinite still animates: count up toward a believable number while it
// cross-fades to ∞. If no explicit value was given, roll toward a default.
const animateTo = computed(() => (isInfinite.value && target.value === 0 ? 99 : target.value))

const numberColor = computed(() => resolveColor(props.color) || 'var(--color-headings)')

const rootRef = ref<HTMLElement | null>(null)
const displayValue = ref(0)
const progress = ref(0) // 0 → 1, drives the number↔∞ cross-fade
const hasRun = ref(false)

const formattedNumber = computed(() =>
  displayValue.value.toLocaleString('nl-NL', {
    minimumFractionDigits: decimals.value,
    maximumFractionDigits: decimals.value,
  }),
)

let rafId: number | null = null

function runCountUp() {
  if (hasRun.value) return
  hasRun.value = true

  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  if (reduceMotion) {
    displayValue.value = animateTo.value
    progress.value = 1
    return
  }

  // rAF timestamps are relative, so we capture the first frame's time as the
  // origin rather than calling Date.now() (unavailable in this environment).
  let start: number | null = null
  const tick = (now: number) => {
    if (start === null) start = now
    const elapsed = now - start
    const t = Math.min(elapsed / DURATION, 1)
    const eased = easeOutCubic(t)
    progress.value = eased
    const raw = animateTo.value * eased
    displayValue.value = decimals.value === 0 ? Math.round(raw) : raw
    if (t < 1) {
      rafId = requestAnimationFrame(tick)
    } else {
      displayValue.value = animateTo.value
      progress.value = 1
    }
  }
  rafId = requestAnimationFrame(tick)
}

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!rootRef.value) return
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          runCountUp()
          observer?.disconnect()
        }
      }
    },
    { threshold: 0.4 },
  )
  observer.observe(rootRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
  if (rafId !== null) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div ref="rootRef" class="stat-counter" :style="{ '--counter-color': numberColor }">
    <div class="stat-counter-figure" :class="{ 'is-started': hasRun }" aria-hidden="true">
      <template v-if="isInfinite">
        <span class="stat-counter-number" :style="{ opacity: 1 - progress }">
          {{ formattedNumber }}
        </span>
        <span class="stat-counter-infinity" :style="{ opacity: progress }">∞</span>
      </template>
      <template v-else>
        <span class="stat-counter-number">{{ formattedNumber }}</span><span
          v-if="showPlus"
          class="stat-counter-plus"
          >+</span
        >
      </template>
    </div>
    <span v-if="label" class="stat-counter-label">{{ label }}</span>
    <span class="stat-counter-sr">
      {{ isInfinite ? '∞' : formattedNumber }}{{ showPlus ? '+' : '' }}{{ label ? ` ${label}` : '' }}
    </span>
  </div>
</template>

<style scoped>
.stat-counter {
  display: flex;
  flex-direction: column;
  align-items: center; /* number + label stack centered as a unit */
  text-align: center;
  gap: clamp(0.4rem, 1.1vw, 0.7rem);
  line-height: 1;
}

.stat-counter-figure {
  position: relative;
  display: inline-flex;
  align-items: baseline;
  font-family: var(--font-h1, var(--font-headings, serif));
  font-weight: 700;
  color: var(--counter-color);
  font-size: clamp(3rem, 7vw, 5rem);
  font-variant-numeric: tabular-nums lining-nums;
  letter-spacing: -0.01em;
  /* Hidden until it scrolls into view, then fades in as the count-up starts,
     so the static "0" is never visible beforehand. */
  opacity: 0;
  transition: opacity 0.6s ease-out;
}

.stat-counter-figure.is-started {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .stat-counter-figure {
    transition: none;
  }
}

.stat-counter-number {
  display: inline-block;
}

.stat-counter-plus {
  font-size: 0.7em;
  margin-inline-start: 0.04em;
}

/* The ∞ overlays the number's slot so the cross-fade happens in place. */
.stat-counter-infinity {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1em;
  line-height: 1;
}

.stat-counter-label {
  font-family: inherit; /* inherits the site body font (Inter) */
  font-size: clamp(1.1rem, 1.9vw, 1.4rem);
  font-weight: 400;
  color: var(--counter-color); /* match the number's color */
  text-align: center;
  line-height: 1.3;
}

.stat-counter-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
