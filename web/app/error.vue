<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()
</script>

<template>
  <UApp>
    <div class="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center text-center px-4">
      <p class="text-sm font-medium text-gray-500">{{ error.statusCode }}</p>
      <h1 class="mt-2 text-4xl font-bold text-gray-700">Page Not Found</h1>
      <p class="mt-4 text-gray-500">The page "{{ error.data?.path }}" could not be found.</p>
      <NuxtLink to="/" class="mt-8 inline-flex min-w-[180px] justify-center px-6 py-3 bg-gray-700 text-white hover:bg-gray-800 transition-colors">
        Back to Homepage
      </NuxtLink>
    </div>

    <TheFooter />
  </UApp>
</template>
