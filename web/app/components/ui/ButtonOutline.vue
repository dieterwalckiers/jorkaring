<script setup lang="ts">
interface Props {
  to?: string
  href?: string
}

const props = withDefaults(defineProps<Props>(), {
  to: undefined,
  href: undefined,
})

const isLink = computed(() => props.to || props.href)

// Only true cross-origin URLs (http(s):// or protocol-relative //) open in a new tab.
// Anchors (#…), relative paths, mailto:, tel:, etc. stay in the same tab.
function isExternalUrl(url: string | undefined): boolean {
  if (!url) return false
  return /^(https?:)?\/\//i.test(url)
}

const isExternal = computed(() => isExternalUrl(props.to) || isExternalUrl(props.href))

const hashTarget = computed(() => {
  const url = props.to ?? props.href
  return url && url.startsWith('#') ? url : null
})

function onClick(e: MouseEvent) {
  if (!hashTarget.value) return
  const id = hashTarget.value.slice(1)
  const el = id ? document.getElementById(id) : null
  if (!el) return
  e.preventDefault()
  el.scrollIntoView({ behavior: 'smooth' })
  history.replaceState(null, '', hashTarget.value)
}
</script>

<template>
  <NuxtLink
    v-if="isLink"
    :to="to"
    :href="href"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    class="btn-outline"
    @click="onClick"
  >
    <slot />
  </NuxtLink>
  <button
    v-else
    type="button"
    class="btn-outline"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn-outline {
  display: inline-block;
  min-width: 180px;
  text-align: center;
  border: 2px solid var(--color-button-font);
  color: var(--color-button-font);
  background-color: var(--color-button-bg);
  font-weight: 600;
  padding: 0.625rem 1.5rem;
  border-radius: 0;
  transition: background-color 150ms, color 150ms;
}

.btn-outline.btn-outline:hover {
  background-color: var(--color-button-bg-hover);
  color: var(--color-button-font-hover);
}
</style>
