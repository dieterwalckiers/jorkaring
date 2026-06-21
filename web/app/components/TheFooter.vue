<script setup lang="ts">
const { data: siteSettings } = useSiteSettings()

const policyLinks = [
  { label: 'Algemene voorwaarden', to: '/algemene-voorwaarden' },
  { label: 'Privacybeleid', to: '/privacybeleid' },
  { label: 'Cookiebeleid', to: '/cookiebeleid' },
]

const cmsFooterLinks = computed(() => {
  const links = siteSettings.value?.footer?.links ?? []
  return links.map((link) => ({
    label: link.text,
    ...(link.url ? { to: link.url } : {}),
  }))
})
</script>

<template>
  <UFooter class="footer-brand-text">
    <template #left>
      <p class="text-sm">
        &copy; {{ new Date().getFullYear() }} jorkaring
      </p>
    </template>

    <UNavigationMenu :items="policyLinks" variant="link" />

    <template #right>
      <UNavigationMenu
        v-if="cmsFooterLinks.length"
        :items="cmsFooterLinks"
        variant="link"
      />
    </template>
  </UFooter>

  <div data-checkered-bar aria-hidden="true" />
</template>

<style scoped>
.footer-brand-text {
  color: var(--color-font-accent);
}

.footer-brand-text :deep(a),
.footer-brand-text :deep(button) {
  color: var(--color-font-accent);
}
</style>
