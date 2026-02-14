<script setup lang="ts">
import type { ContentGridBlock } from '~/types/blocks'

const props = defineProps<{
  block: ContentGridBlock
}>()

const cells = computed(() => props.block.cells ?? [])
const numberOfColumns = computed(() => props.block.numberOfColumns ?? '3')
const horizontalAlignment = computed(() => props.block.horizontalAlignment ?? 'left')
const verticalAlignment = computed(() => props.block.verticalAlignment ?? 'center')

const gridClass = computed(() => {
  const cols = numberOfColumns.value
  // On mobile: 1 column, on medium screens: 2 columns (max), on large screens: configured columns
  const colsMap: Record<string, string> = {
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    '5': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
  }
  return colsMap[cols] || colsMap['3']
})

const horizontalAlignmentClass = computed(() => {
  const alignMap: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }
  return alignMap[horizontalAlignment.value] || alignMap.left
})

const verticalAlignmentClass = computed(() => {
  const alignMap: Record<string, string> = {
    top: 'items-start',
    center: 'items-center',
    bottom: 'items-end',
  }
  return alignMap[verticalAlignment.value] || alignMap.center
})
</script>

<template>
  <section class="content-grid-block">
    <div
      class="grid gap-4 md:gap-6"
      :class="[gridClass, verticalAlignmentClass]"
    >
      <div
        v-for="cell in cells"
        :key="cell.id"
        class="content-grid-cell"
        :class="horizontalAlignmentClass"
      >
        <RichTextRenderer :content="cell.content" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.content-grid-cell {
  min-width: 0; /* Prevent grid blowout from long content */
}
</style>
