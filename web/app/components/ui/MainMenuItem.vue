<script setup lang="ts">
interface Props {
  label: string
  to?: string
  active?: boolean
}

defineProps<Props>()
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="main-menu-item"
    :class="{ 'main-menu-item--active': active }"
  >
    {{ label }}
  </NuxtLink>
  <span
    v-else
    class="main-menu-item"
    :class="{ 'main-menu-item--active': active }"
  >
    {{ label }}
  </span>
</template>

<style scoped>
.main-menu-item {
  position: relative;
  color: var(--color-font);
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.025em;
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition: color 0.2s ease;
}

.main-menu-item::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, var(--color-brandprimarydark), var(--color-brandprimarymedium));
  transform: scaleX(0);
  transition: transform 0.2s ease;
}

.main-menu-item:hover::after,
.main-menu-item--active::after {
  transform: scaleX(1);
}

.main-menu-item:hover,
.main-menu-item--active {
  color: var(--color-font-highlight);
}

/* Mobile menu - larger font and more spacing */
[role="dialog"] .main-menu-item {
  font-size: 1.3rem;
  padding: 0.5rem 0;
}
</style>
