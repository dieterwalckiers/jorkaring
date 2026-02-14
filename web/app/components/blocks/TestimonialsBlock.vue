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

async function navigate(direction: 'up' | 'down') {
  if (isTransitioning.value || totalTestimonials.value <= 1) return

  isTransitioning.value = true

  // Lock current height
  if (innerContent.value) {
    wrapperHeight.value = `${innerContent.value.offsetHeight}px`
  }

  // Wait for fade out
  await new Promise(resolve => setTimeout(resolve, 150))

  // Change testimonial
  if (direction === 'up') {
    currentIndex.value = currentIndex.value === 0
      ? totalTestimonials.value - 1
      : currentIndex.value - 1
  } else {
    currentIndex.value = currentIndex.value === totalTestimonials.value - 1
      ? 0
      : currentIndex.value + 1
  }

  // Wait for DOM to update
  await nextTick()

  // Animate to new height
  if (innerContent.value) {
    wrapperHeight.value = `${innerContent.value.offsetHeight}px`
  }

  // Wait for fade in + height transition
  await new Promise(resolve => setTimeout(resolve, 300))

  // Reset to auto
  wrapperHeight.value = undefined
  isTransitioning.value = false
}
</script>

<template>
  <section class="testimonials-block bg-brandsecondarymedium py-6 md:py-10 px-4 md:px-16 rounded-3xl">
    <div class="max-w-4xl mx-auto flex items-center gap-4 md:gap-8">
      <!-- Testimonial content with height animation -->
      <div
        class="flex-1 min-w-0 overflow-hidden transition-[height] duration-300 ease-in-out"
        :style="wrapperHeight ? { height: wrapperHeight } : undefined"
      >
        <div ref="innerContent">
          <div
            v-if="currentTestimonial"
            class="testimonial-content"
            :class="{ 'is-transitioning': isTransitioning }"
          >
            <blockquote class="text-font-brand1 text-lg md:text-xl leading-relaxed mb-4 md:mb-6">
              "{{ currentTestimonial.quote }}"
            </blockquote>
            <p class="text-font-brand1 text-sm md:text-base">
              {{ currentTestimonial.name }}
            </p>
          </div>
          <div v-else class="text-font-brand1">
            No testimonials available.
          </div>
        </div>
      </div>

      <!-- Navigation buttons -->
      <div
        v-if="totalTestimonials > 1"
        class="flex flex-col gap-2 shrink-0"
      >
        <button
          type="button"
          class="nav-button w-8 h-8 md:w-10 md:h-10 rounded-lg border border-font-brand1 flex items-center justify-center cursor-pointer"
          aria-label="Previous testimonial"
          @click="navigate('up')"
        >
          <svg
            class="w-4 h-4 md:w-5 md:h-5 text-font-brand1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
        <button
          type="button"
          class="nav-button w-8 h-8 md:w-10 md:h-10 rounded-lg border border-font-brand1 flex items-center justify-center cursor-pointer"
          aria-label="Next testimonial"
          @click="navigate('down')"
        >
          <svg
            class="w-4 h-4 md:w-5 md:h-5 text-font-brand1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.testimonial-content {
  transition: opacity 150ms ease-in-out;
}

.testimonial-content.is-transitioning {
  opacity: 0;
}

.nav-button {
  transition: transform 150ms ease-in-out;
}

.nav-button:hover {
  transform: scale(1.08);
}

.nav-button:active {
  transform: scale(0.95);
}
</style>
