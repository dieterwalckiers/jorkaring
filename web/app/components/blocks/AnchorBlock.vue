<script setup lang="ts">
import type { AnchorBlock } from '~/types/blocks'
import { slugify } from '~/utils/slugify'

const props = defineProps<{
  block: AnchorBlock
}>()

// Normalise to a safe id so a value like "About Us" still resolves the #about-us link.
const anchorId = computed(() => slugify(props.block.anchorId ?? ''))
</script>

<template>
  <div :id="anchorId" class="scroll-mt-24" aria-hidden="true" />
</template>
