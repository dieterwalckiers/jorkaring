<script setup lang="ts">
const props = defineProps<{
  content: Record<string, unknown>
  closeable?: boolean
}>()

// Recursively check if a Lexical node tree has meaningful text
function hasText(node: Record<string, unknown>): boolean {
  if (typeof node.text === 'string' && node.text.trim().length > 0) return true
  const children = node.children as Record<string, unknown>[] | undefined
  if (children?.length) return children.some(hasText)
  return false
}

function hasContent(content: Record<string, unknown>): boolean {
  const root = content?.root as Record<string, unknown> | undefined
  if (!root) return false
  return hasText(root)
}

const dismissed = ref(false)
const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})

const visible = computed(() => {
  if (!mounted.value) return false
  if (!hasContent(props.content)) return false
  if (props.closeable && dismissed.value) return false
  return true
})

function dismiss() {
  dismissed.value = true
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-4 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-4 opacity-0"
  >
    <div
      v-if="visible"
      class="fixed right-6 z-50 max-w-sm rounded-full bg-(--color-sticky-message-bg) text-(--color-sticky-message-txt) shadow-lg px-6 py-3 flex items-center gap-3 transition-[bottom] duration-300"
      :style="{ bottom: 'calc(1.5rem + var(--cookie-banner-height, 0px))' }"
    >
      <div class="[&_p]:mb-0">
        <RichTextRenderer :content="content" />
      </div>
      <button
        v-if="closeable"
        type="button"
        class="shrink-0 text-(--color-sticky-message-txt) opacity-50 hover:opacity-100 transition-opacity"
        aria-label="Close"
        @click="dismiss"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </Transition>
</template>
