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

// Check if a URL is external (should open in new tab)
function isExternalUrl(url: string | undefined): boolean {
  if (!url) return false
  // Internal links start with / (but not // which is protocol-relative)
  return !url.startsWith('/') || url.startsWith('//')
}

const isExternal = computed(() => isExternalUrl(props.to) || isExternalUrl(props.href))
</script>

<template>
  <NuxtLink
    v-if="isLink"
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
  border: 2px solid var(--color-button-font);
  color: var(--color-button-font);
  background-color: var(--color-button-bg);
  font-weight: 600;
  padding: 0.625rem 1.5rem;
  border-radius: 9999px;
  transition: background-color 150ms, color 150ms;
}

.btn-outline.btn-outline:hover {
  background-color: var(--color-button-bg-hover);
  color: white;
}
</style>
