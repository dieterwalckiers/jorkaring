<script setup lang="ts">
import type { InPageMenuTitleBlock } from '~/types/blocks'
import { slugify } from '~/utils/slugify'

const props = defineProps<{
  block: InPageMenuTitleBlock
}>()

const anchorId = computed(() => slugify(props.block.title))
</script>

<template>
  <div :id="anchorId" class="scroll-mt-24" aria-hidden="true" />
</template>
