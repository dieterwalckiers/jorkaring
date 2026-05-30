<script setup lang="ts">
import type { TestimonialsBlock } from '~/types/blocks'

const props = defineProps<{
  block: TestimonialsBlock
}>()

const currentIndex = ref(0)
const isTransitioning = ref(false)
const innerContent = ref<HTMLElement | null>(null)
const wrapperHeight = ref<string | undefined>(undefined)

const testimonials = computed(() => props.block.testimonials ?? [])
const totalTestimonials = computed(() => testimonials.value.length)

const currentTestimonial = computed(() => {
  if (testimonials.value.length === 0) return null
  return testimonials.value[currentIndex.value]
})

// Strip wrapping straight or curly quotes — we render our own typographic
// opening glyph and the repetition reads as a mistake when both are present.
const cleanedQuote = computed(() => {
  const raw = currentTestimonial.value?.quote ?? ''
  return raw.replace(/^[\s"“”«»„]+/, '').replace(/[\s"“”«»„]+$/, '')
})

async function navigate(direction: 'up' | 'down') {
  if (isTransitioning.value || totalTestimonials.value <= 1) return

  isTransitioning.value = true

  if (innerContent.value) {
    wrapperHeight.value = `${innerContent.value.offsetHeight}px`
  }

  await new Promise(resolve => setTimeout(resolve, 180))

  if (direction === 'up') {
    currentIndex.value = currentIndex.value === 0
      ? totalTestimonials.value - 1
      : currentIndex.value - 1
  } else {
    currentIndex.value = currentIndex.value === totalTestimonials.value - 1
      ? 0
      : currentIndex.value + 1
  }

  await nextTick()

  if (innerContent.value) {
    wrapperHeight.value = `${innerContent.value.offsetHeight}px`
  }

  await new Promise(resolve => setTimeout(resolve, 320))

  wrapperHeight.value = undefined
  isTransitioning.value = false
}

function goTo(idx: number) {
  if (isTransitioning.value || idx === currentIndex.value) return
  navigate(idx > currentIndex.value ? 'down' : 'up')
}
</script>

<template>
  <section class="testimonials-block" aria-label="Testimonials">
    <div class="testimonial-rail">
      <!-- Oversized opening quotation mark, rendered purely decoratively.
           It's absolute-positioned so the quote text reads from the editorial
           baseline without being pushed around by the glyph. -->
      <span class="testimonial-quote-mark" aria-hidden="true">&ldquo;</span>

      <div
        class="testimonial-content-wrap"
        :style="wrapperHeight ? { height: wrapperHeight } : undefined"
      >
        <div ref="innerContent">
          <div
            v-if="currentTestimonial"
            class="testimonial-content"
            :class="{ 'is-transitioning': isTransitioning }"
          >
            <blockquote class="testimonial-quote">
              {{ cleanedQuote }}
            </blockquote>
            <figcaption class="testimonial-attribution">
              <span class="testimonial-rule" aria-hidden="true" />
              <cite class="testimonial-name">{{ currentTestimonial.name }}</cite>
            </figcaption>
          </div>
          <div v-else class="testimonial-empty">
            No testimonials available.
          </div>
        </div>
      </div>

      <div
        v-if="totalTestimonials > 1"
        class="testimonial-controls"
      >
        <button
          type="button"
          class="nav-button"
          aria-label="Previous testimonial"
          @click="navigate('up')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <ol class="testimonial-dots" aria-hidden="true">
          <li
            v-for="(t, i) in testimonials"
            :key="t.id ?? i"
            class="testimonial-dot"
            :class="{ 'is-active': i === currentIndex }"
          >
            <button
              type="button"
              class="testimonial-dot-button"
              :aria-label="`Go to testimonial ${i + 1}`"
              @click="goTo(i)"
            />
          </li>
        </ol>

        <span class="testimonial-counter" aria-live="polite">
          <span class="testimonial-counter-current">{{ String(currentIndex + 1).padStart(2, '0') }}</span>
          <span class="testimonial-counter-sep">/</span>
          <span class="testimonial-counter-total">{{ String(totalTestimonials).padStart(2, '0') }}</span>
        </span>

        <button
          type="button"
          class="nav-button"
          aria-label="Next testimonial"
          @click="navigate('down')"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.testimonials-block {
  position: relative;
  padding-block: clamp(3rem, 7vw, 6rem);
  padding-inline: clamp(1rem, 4vw, 3rem);
}

.testimonial-rail {
  max-width: 64rem;
  margin-inline: auto;
  position: relative;
  padding-inline-start: clamp(0rem, 6vw, 5rem);
}

/* The decorative glyph. Uses the current heading font so it inherits the
   brand display treatment, scaled way past any other heading. Tuned so the
   hook of the quotemark sits just above and to the left of the quote text. */
.testimonial-quote-mark {
  position: absolute;
  top: clamp(-0.75rem, -0.5vw, -0.25rem);
  left: clamp(-0.25rem, 2vw, 1.5rem);
  font-size: clamp(5rem, 9vw, 9rem);
  line-height: 0.75;
  color: var(--color-headings);
  opacity: 0.28;
  font-weight: 400;
  user-select: none;
  pointer-events: none;
  font-feature-settings: "ss01";
  z-index: 0;
}

.testimonial-content-wrap {
  position: relative;
  z-index: 1;
  overflow: hidden;
  transition: height 320ms cubic-bezier(0.33, 1, 0.68, 1);
}

.testimonial-content {
  transition: opacity 180ms cubic-bezier(0.33, 1, 0.68, 1);
}

.testimonial-content.is-transitioning {
  opacity: 0;
}

.testimonial-quote {
  color: var(--color-font);
  font-size: clamp(1.125rem, 0.65vw + 0.875rem, 1.625rem);
  line-height: 1.45;
  letter-spacing: -0.005em;
  font-weight: 400;
  text-wrap: balance;
  font-style: italic;
  margin-block-end: clamp(1.5rem, 3vw, 2.5rem);
}

.testimonial-quote::before { content: "\201C"; margin-inline-end: 0.05em; }
.testimonial-quote::after { content: "\201D"; margin-inline-start: 0.05em; }

.testimonial-attribution {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  color: var(--color-font);
  opacity: 0.82;
}

.testimonial-rule {
  display: inline-block;
  width: clamp(2rem, 4vw, 3rem);
  height: 1px;
  background: currentColor;
  opacity: 0.6;
  flex-shrink: 0;
}

.testimonial-name {
  font-style: normal;
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 600;
}

.testimonial-empty {
  color: var(--color-font);
  opacity: 0.6;
  font-style: italic;
}

.testimonial-controls {
  display: flex;
  align-items: center;
  gap: clamp(0.75rem, 1.5vw, 1.25rem);
  margin-block-start: clamp(2rem, 4vw, 3rem);
  color: var(--color-font);
}

.nav-button {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  border: 1px solid currentColor;
  background: var(--color-button-bg);
  color: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 180ms cubic-bezier(0.33, 1, 0.68, 1),
              transform 240ms cubic-bezier(0.33, 1, 0.68, 1),
              background-color 180ms;
}

.nav-button svg {
  width: 0.95rem;
  height: 0.95rem;
}

.nav-button:hover {
  opacity: 1;
  transform: scale(1.05);
}

.nav-button:active {
  transform: scale(0.96);
}

.testimonial-dots {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.testimonial-dot {
  display: flex;
}

.testimonial-dot-button {
  width: 0.375rem;
  height: 0.375rem;
  padding: 0;
  border: 0;
  border-radius: 9999px;
  background: currentColor;
  opacity: 0.35;
  cursor: pointer;
  transition: opacity 180ms, width 220ms cubic-bezier(0.33, 1, 0.68, 1);
}

.testimonial-dot.is-active .testimonial-dot-button {
  opacity: 1;
  width: 1.25rem;
}

.testimonial-dot-button:hover {
  opacity: 0.75;
}

.testimonial-counter {
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.55;
  font-variant-numeric: tabular-nums;
  margin-inline-start: auto;
}

.testimonial-counter-sep {
  margin-inline: 0.35em;
  opacity: 0.6;
}

@media (prefers-reduced-motion: reduce) {
  .testimonial-content-wrap,
  .testimonial-content,
  .nav-button,
  .testimonial-dot-button {
    transition: none;
  }
}
</style>
