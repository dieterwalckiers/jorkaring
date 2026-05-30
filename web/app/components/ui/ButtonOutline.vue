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

// In-page anchors (`#id`) render as a plain `<a>`, not `<NuxtLink>`: a router
// link would resolve the href to a full path and scroll instantly. Smooth
// scrolling itself is handled globally by the smooth-anchor.client plugin.
const hashTarget = computed(() => {
  const url = props.to ?? props.href
  return url && url.startsWith('#') ? url : null
})
</script>

<template>
  <a
    v-if="hashTarget"
    :href="hashTarget"
    class="btn-outline"
  >
    <slot />
  </a>
  <NuxtLink
    v-else-if="isLink"
    :to="to"
    :href="href"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
    class="btn-outline"
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
