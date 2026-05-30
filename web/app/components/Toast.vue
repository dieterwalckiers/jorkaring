<script setup lang="ts">
import type { ToastPosition } from '~/types/siteSettings'
import { resolveColor } from '~/utils/resolveColor'

const props = defineProps<{
  content: Record<string, unknown>
  backgroundColor?: string
  position: ToastPosition
  displayDelaySeconds: number
  dismissible: boolean
  autoDismissSeconds: number
  rememberDismissal: boolean
  dismissalKey: string
}>()

const resolvedBackground = computed(() => resolveColor(props.backgroundColor || 'theme1'))

const STORAGE_PREFIX = 'toast-dismissed:'

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
const delayElapsed = ref(false)
let autoDismissTimer: ReturnType<typeof setTimeout> | null = null
let displayDelayTimer: ReturnType<typeof setTimeout> | null = null

const storageKey = computed(() => `${STORAGE_PREFIX}${props.dismissalKey || 'default'}`)

const isBottom = computed(() => props.position === 'bottomRight' || props.position === 'bottomLeft')
const isRight = computed(() => props.position === 'bottomRight' || props.position === 'topRight')

const positionClasses = computed(() => [
  isBottom.value ? 'bottom-6' : 'top-6',
  isRight.value ? 'right-6' : 'left-6',
])

const positionStyle = computed(() => {
  // Horizontal slide-in direction (px). Toast enters from its corner's edge.
  const enterX = isRight.value ? 24 : -24
  const style: Record<string, string> = {
    backgroundColor: resolvedBackground.value,
    '--toast-enter-x': `${enterX}px`,
    '--toast-leave-x': `${enterX * 0.6}px`,
  }
  if (isBottom.value) style.bottom = 'calc(1.5rem + var(--cookie-banner-height, 0px))'
  return style
})

function startAutoDismiss() {
  if (props.autoDismissSeconds > 0) {
    autoDismissTimer = setTimeout(() => {
      dismissed.value = true
    }, props.autoDismissSeconds * 1000)
  }
}

function reveal() {
  delayElapsed.value = true
  startAutoDismiss()
}

onMounted(() => {
  mounted.value = true

  if (props.dismissible && props.rememberDismissal) {
    try {
      if (localStorage.getItem(storageKey.value) === '1') {
        dismissed.value = true
        return
      }
    } catch {
      // localStorage unavailable (private mode, etc.) — fall through and show
    }
  }

  if (props.displayDelaySeconds > 0) {
    displayDelayTimer = setTimeout(reveal, props.displayDelaySeconds * 1000)
  } else {
    reveal()
  }
})

onUnmounted(() => {
  if (autoDismissTimer) clearTimeout(autoDismissTimer)
  if (displayDelayTimer) clearTimeout(displayDelayTimer)
})

const visible = computed(() => {
  if (!mounted.value) return false
  if (!delayElapsed.value) return false
  if (!hasContent(props.content)) return false
  if (dismissed.value) return false
  return true
})

function dismiss() {
  dismissed.value = true
  if (autoDismissTimer) {
    clearTimeout(autoDismissTimer)
    autoDismissTimer = null
  }
  if (displayDelayTimer) {
    clearTimeout(displayDelayTimer)
    displayDelayTimer = null
  }
  if (props.rememberDismissal) {
    try {
      localStorage.setItem(storageKey.value, '1')
    } catch {
      // ignore
    }
  }
}
</script>

<template>
  <Transition name="toast-card">
    <div
      v-if="visible"
      :class="[
        'toast-card fixed z-50 max-w-sm rounded-md text-(--color-off-white,#EDE3D9) shadow-lg px-5 py-4 flex items-start gap-3 transition-[bottom] duration-300',
        ...positionClasses,
      ]"
      :style="positionStyle"
      role="status"
      aria-live="polite"
    >
      <div class="toast-body flex-1 text-sm [&_p]:mb-0 [&_p+p]:mt-2 [&_a]:underline hover:[&_a]:no-underline">
        <RichTextRenderer :content="content" />
      </div>
      <button
        v-if="dismissible"
        type="button"
        class="toast-close shrink-0 -mr-1 mt-0.5 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
        @click="dismiss"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<style scoped>
/* Editorial easing — matches the project's existing header curve. */
.toast-card-enter-active {
  transition: opacity 0.42s cubic-bezier(0.33, 1, 0.68, 1),
              transform 0.42s cubic-bezier(0.33, 1, 0.68, 1);
}
.toast-card-leave-active {
  transition: opacity 0.22s cubic-bezier(0.33, 1, 0.68, 1),
              transform 0.22s cubic-bezier(0.33, 1, 0.68, 1);
}

.toast-card-enter-from {
  opacity: 0;
  transform: translateX(var(--toast-enter-x, 24px)) scale(0.97);
}
.toast-card-leave-to {
  opacity: 0;
  transform: translateX(var(--toast-leave-x, 14px));
}

/* Content arrives a beat after the surface lands — staged reveal. */
.toast-card-enter-active .toast-body {
  animation: toast-inner-reveal 0.34s cubic-bezier(0.33, 1, 0.68, 1) 0.14s both;
}
.toast-card-enter-active .toast-close {
  animation: toast-inner-reveal 0.32s cubic-bezier(0.33, 1, 0.68, 1) 0.22s both;
}

@keyframes toast-inner-reveal {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .toast-card-enter-active,
  .toast-card-leave-active {
    transition: opacity 0.18s linear;
  }
  .toast-card-enter-from,
  .toast-card-leave-to {
    opacity: 0;
    transform: none;
  }
  .toast-card-enter-active .toast-body,
  .toast-card-enter-active .toast-close {
    animation: none;
  }
}
</style>
