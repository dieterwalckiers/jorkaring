<script setup lang="ts">
import type { ContactFormBlock } from '~/types/blocks'

declare global {
  interface Window {
    Tally?: { loadEmbeds: () => void }
  }
}

const props = defineProps<{
  block: ContactFormBlock
}>()

const tallySrc = computed(() => {
  const formId = props.block.tallyFormId ?? '81x1GP'
  return `https://tally.so/embed/${formId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`
})

useHead({
  script: [
    {
      src: 'https://tally.so/widgets/embed.js',
      async: true,
      onload: 'if(window.Tally)window.Tally.loadEmbeds()',
    },
  ],
})

onMounted(() => {
  // If Tally script is already loaded (e.g. client-side navigation),
  // re-trigger embed detection for the newly mounted iframe
  if (window.Tally) {
    window.Tally.loadEmbeds()
  }
})
</script>

<template>
  <section>
    <iframe
      :data-tally-src="tallySrc"
      loading="lazy"
      width="100%"
      height="313"
      frameborder="0"
      marginheight="0"
      marginwidth="0"
      title="Contact Form"
    />
  </section>
</template>
