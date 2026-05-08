<script setup lang="ts">
const props = defineProps<{
  content: unknown
  collapsedByDefault?: boolean
  collapsedLines?: '5' | '8' | '12' | '16' | '20'
}>()

const collapsedByDefault = computed(() => props.collapsedByDefault ?? false)
const collapsedMaxHeight = computed(() => `${props.collapsedLines ?? '5'}lh`)
const isCollapsed = ref(collapsedByDefault.value)
const wrapperRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const needsCollapsing = ref(false)

const fadeColor = ref('white')
function updateFadeColor() {
  if (typeof document !== 'undefined') {
    fadeColor.value = getComputedStyle(document.body).backgroundColor || 'white'
  }
}

watch(collapsedByDefault, (val) => {
  isCollapsed.value = val
  if (val) nextTick(() => measureOverflow())
})

function measureOverflow() {
  if (!collapsedByDefault.value || !wrapperRef.value || !contentRef.value) return
  const visibleHeight = wrapperRef.value.clientHeight
  const fullHeight = contentRef.value.scrollHeight
  needsCollapsing.value = visibleHeight > 0 && fullHeight > visibleHeight + 1
}

onMounted(() => {
  if (!collapsedByDefault.value) return
  updateFadeColor()
  nextTick(() => requestAnimationFrame(measureOverflow))

  if (document.readyState !== 'complete') {
    const onLoad = () => measureOverflow()
    window.addEventListener('load', onLoad, { once: true })
    onUnmounted(() => window.removeEventListener('load', onLoad))
  }

  const observer = new ResizeObserver(() => measureOverflow())
  nextTick(() => {
    if (wrapperRef.value) observer.observe(wrapperRef.value)
  })
  onUnmounted(() => observer.disconnect())
})
</script>

<template>
  <div class="content-grid-cell-body">
    <div
      ref="wrapperRef"
      :class="['cell-wrapper', { 'is-collapsed': collapsedByDefault && isCollapsed }]"
      :style="{ '--cell-collapsed-max-height': collapsedMaxHeight }"
    >
      <div ref="contentRef">
        <RichTextRenderer :content="content" />
      </div>
      <div
        v-if="collapsedByDefault && isCollapsed && needsCollapsing"
        class="cell-fade"
        :style="{ background: `linear-gradient(to bottom, transparent 0%, ${fadeColor} 90%)` }"
      />
    </div>
    <button
      v-if="collapsedByDefault && needsCollapsing"
      type="button"
      class="cell-toggle"
      @click="isCollapsed = !isCollapsed"
    >
      {{ isCollapsed ? 'Lees meer' : 'Lees minder' }}
    </button>
  </div>
</template>

<style scoped>
.cell-wrapper {
  position: relative;
}

.cell-wrapper.is-collapsed {
  max-height: var(--cell-collapsed-max-height, 5lh);
  overflow: hidden;
}

.cell-fade {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 6rem;
  pointer-events: none;
  z-index: 1;
}

.cell-toggle {
  display: inline-block;
  margin-block-start: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.cell-toggle:hover {
  opacity: 0.7;
}
</style>
