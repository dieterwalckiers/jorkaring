<script setup lang="ts">
import type { RichTextBlock as RichTextBlockType, RichTextMargin, RichTextWidth } from '~/types/blocks'
import { resolveColor } from '~/utils/resolveColor'

const props = defineProps<{
  block: RichTextBlockType
}>()

const widthClasses: Record<RichTextWidth, string> = {
  '1/4': 'w-1/4',
  '1/3': 'w-1/3',
  'half': 'w-1/2',
  '2/3': 'w-2/3',
  '3/4': 'w-3/4',
  'full': 'w-full',
}

const marginClasses: Record<RichTextMargin, string> = {
  none: 'p-0',
  small: 'p-2 md:p-4',
  medium: 'p-4 md:p-8',
  large: 'p-6 md:p-16',
}

const widthClass = computed(() => widthClasses[props.block.width ?? 'full'])
const marginClass = computed(() => marginClasses[props.block.margin ?? 'none'])

const floatingStyle = computed(() => {
  if (!props.block.renderFloating) return undefined
  return {
    position: 'absolute' as const,
    top: props.block.floatingOffset || '0',
    left: '0',
    right: '0',
  }
})

const containerStyle = computed(() => {
  const bg = resolveColor(props.block.backgroundColor)
  if (bg === 'transparent') return undefined
  return { backgroundColor: bg }
})

const containerClasses = computed(() => {
  const classes: string[] = []
  if (props.block.roundedCorners) {
    classes.push('rounded-lg')
  }
  return classes
})
</script>

<template>
  <div v-if="block.renderFloating" class="relative pointer-events-none">
    <div
      class="prose prose-lg max-w-none mx-auto floating-content"
      :class="[widthClass, marginClass, ...containerClasses]"
      :style="{ ...floatingStyle, ...containerStyle }"
    >
      <RichTextRenderer :content="block.content" />
    </div>
  </div>
  <div
    v-else
    class="prose prose-lg max-w-none mx-auto"
    :class="[widthClass, marginClass, ...containerClasses]"
    :style="containerStyle"
  >
    <RichTextRenderer :content="block.content" />
  </div>
</template>

<style scoped>
/* Floating content: only interactive elements receive pointer events */
.floating-content {
  pointer-events: none;
}

.floating-content :deep(a),
.floating-content :deep(button),
.floating-content :deep(input),
.floating-content :deep(select),
.floating-content :deep(textarea) {
  pointer-events: auto;
}
</style>
