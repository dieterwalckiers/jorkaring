<script setup lang="ts">
import { computed } from 'vue'
import type { CalendlyEmbedBlock } from '~/types/blocks'

const props = defineProps<{
  block: CalendlyEmbedBlock
}>()

useHead({
  script: [
    {
      src: 'https://assets.calendly.com/assets/external/widget.js',
      async: true,
    },
  ],
})

// Detect whether the optional text column actually has lexical content.
const hasText = computed(() => {
  const text = props.block.text as
    | { root?: { children?: unknown[] } }
    | undefined
    | null
  return Boolean(text?.root?.children?.length)
})

const textPosition = computed(() => props.block.textPosition ?? 'left')
const textPercentage = computed(() => props.block.textPercentage ?? 45)
const textWidthDesktop = computed(() => `${textPercentage.value}%`)
const embedWidthDesktop = computed(() => `${100 - textPercentage.value}%`)
</script>

<template>
  <section class="calendly-section">
    <!-- Split layout: text column + embed -->
    <div
      v-if="hasText"
      class="calendly-split mx-auto flex flex-col gap-8 md:flex-row md:items-start md:gap-12"
      :class="{ 'md:flex-row-reverse': textPosition === 'right' }"
    >
      <div
        class="calendly-text w-full md:w-[var(--text-w)]"
        :style="{ '--text-w': textWidthDesktop }"
      >
        <RichTextRenderer :content="block.text" />
      </div>
      <div
        class="calendly-embed-col w-full md:w-[var(--embed-w)]"
        :style="{ '--embed-w': embedWidthDesktop }"
      >
        <div
          class="calendly-inline-widget"
          :data-url="block.url"
          :style="block.style ?? 'min-width:320px;height:700px;'"
        />
      </div>
    </div>

    <!-- Embed only (backward compatible) -->
    <div
      v-else
      class="calendly-inline-widget"
      :data-url="block.url"
      :style="block.style ?? 'min-width:320px;height:700px;'"
    />
  </section>
</template>

<style scoped>
.calendly-text {
  /* Editorial breathing room around the copy column */
  align-self: center;
}
</style>
