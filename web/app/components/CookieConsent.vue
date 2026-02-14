<script setup lang="ts">
defineProps<{
  message: string
  acceptLabel: string
  policyUrl: string
  policyLinkText: string
}>()

const STORAGE_KEY = 'cookie-consent'

const mounted = ref(false)
const consent = ref<string | null>(null)
const bannerRef = ref<HTMLElement | null>(null)

function updateBannerHeight() {
  const h = bannerRef.value?.offsetHeight ?? 0
  document.documentElement.style.setProperty('--cookie-banner-height', `${h}px`)
}

function clearBannerHeight() {
  document.documentElement.style.setProperty('--cookie-banner-height', '0px')
}

onMounted(() => {
  consent.value = localStorage.getItem(STORAGE_KEY)
  mounted.value = true
  nextTick(updateBannerHeight)
})

onUnmounted(clearBannerHeight)

const visible = computed(() => {
  return mounted.value && !consent.value
})

function accept() {
  localStorage.setItem(STORAGE_KEY, 'accepted')
  consent.value = 'accepted'
  clearBannerHeight()
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <div
      v-if="visible"
      ref="bannerRef"
      class="fixed inset-x-0 bottom-0 z-50 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] px-6 py-4"
    >
      <div class="mx-auto flex max-w-screen-xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p class="m-0 text-sm text-gray-700">
          {{ message }}
          <NuxtLink :to="policyUrl" class="underline hover:no-underline">
            {{ policyLinkText }}
          </NuxtLink>
        </p>
        <button
          type="button"
          class="shrink-0 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          @click="accept"
        >
          {{ acceptLabel }}
        </button>
      </div>
    </div>
  </Transition>
</template>
