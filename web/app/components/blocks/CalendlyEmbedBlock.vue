<script setup lang="ts">
import type { CalendlyEmbedBlock } from '~/types/blocks'

defineProps<{
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
</script>

<template>
  <section>
    <div
      class="calendly-inline-widget"
      :data-url="block.url"
      :style="block.style ?? 'min-width:320px;height:700px;'"
    />
  </section>
</template>
