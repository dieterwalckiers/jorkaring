<script setup lang="ts">
import type { ContentBlock } from '~/types/blocks'

defineProps<{
  blocks: ContentBlock[]
}>()
</script>

<template>
  <div class="blocks-container space-y-8">
    <template v-for="block in blocks" :key="block.id">
      <BlocksContactFormBlock v-if="block.blockType === 'contactForm'" :block="block" />
      <BlocksContentGridBlock v-else-if="block.blockType === 'contentGrid'" :block="block" />
      <BlocksHeroBlock v-else-if="block.blockType === 'hero'" :block="block" />
      <BlocksNewsletterSignupBlock v-else-if="block.blockType === 'newsletterSignup'" :block="block" />
      <BlocksRichTextBlock v-else-if="block.blockType === 'richText'" :block="block" />
      <BlocksSpacerBlock v-else-if="block.blockType === 'spacer'" :block="block" />
      <BlocksSplitTextImage v-else-if="block.blockType === 'splitTextImage'" :block="block" />
      <BlocksTableBlock v-else-if="block.blockType === 'table'" :block="block" />
      <BlocksTestimonialsBlock v-else-if="block.blockType === 'testimonials'" :block="block" />
      <BlocksVideoBlock v-else-if="block.blockType === 'video'" :block="block" />
    </template>
  </div>
</template>
