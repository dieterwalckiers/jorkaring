<script setup lang="ts">
import type { HeroContentBlock } from '~/types/blocks'

defineProps<{
  blocks: HeroContentBlock[]
  alignment?: 'left' | 'center' | 'right'
  hasBackground?: boolean
}>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <template v-for="block in blocks" :key="block.id">
      <BlocksHeroHeadlineBlock
        v-if="block.blockType === 'heroHeadline'"
        :block="block"
        :alignment="alignment"
        :has-background="hasBackground"
      />
      <BlocksHeroSubheadlineBlock
        v-else-if="block.blockType === 'heroSubheadline'"
        :block="block"
        :alignment="alignment"
        :has-background="hasBackground"
      />
      <BlocksHeroRichTextBlock
        v-else-if="block.blockType === 'heroRichText'"
        :block="block"
        :alignment="alignment"
        :has-background="hasBackground"
      />
      <BlocksHeroRotatingHeadlineBlock
        v-else-if="block.blockType === 'heroRotatingHeadline'"
        :block="block"
        :alignment="alignment"
        :has-background="hasBackground"
      />
      <BlocksHeroCtaBlock
        v-else-if="block.blockType === 'heroCta'"
        :block="block"
        :alignment="alignment"
        :has-background="hasBackground"
      />
      <BlocksHeroSpacerBlock
        v-else-if="block.blockType === 'heroSpacer'"
        :block="block"
      />
    </template>
  </div>
</template>
