<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()
</script>

<template>
  <UApp>
    <TheHeader />

    <UError :error="error" />

    <TheFooter />
  </UApp>
</template>
