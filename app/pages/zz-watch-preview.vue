<script setup lang="ts">
/**
 * Dev-only preview of `WatchLayout` against fixtures — the real page is
 * `/watch/[slug]`, which reads live APIs. Kept so the layout can be eyeballed
 * in both modes (clip vs live) without needing seeded rows for each. Mirrors
 * the existing `zz-discovery-preview.vue` convention.
 */
import * as fixtures from '@/components/watch/__fixtures__/watch'
import type { CommentSort } from '#shared/types/watch'
import WatchLayout from '@/components/watch/WatchLayout.vue'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'

useHead({ title: 'Watch preview (temp)' })

// Viewer identity is client state, so the signed-in variants (composer, chat
// box) are previewed by seeding the store rather than passing props down.
useAuthStore().session = {
  user: { name: 'Preview_Viewer', email: 'preview@streamify.test' }
}

const mode = ref<'clip' | 'live'>('clip')
const sort = ref<CommentSort>('top')
const target = computed(() => (mode.value === 'live' ? fixtures.liveTarget : fixtures.clipTarget))

const engagement = {
  channel: fixtures.channel,
  reactions: fixtures.reactions,
  saved: false,
  reactPending: false,
  followPending: false
}
const related = { items: fixtures.relatedItems, pending: false, errored: false }
const comments = { items: fixtures.comments, pending: false, errored: false, posting: false }
const chat = { items: fixtures.chatMessages, pending: false, errored: false, sending: false }
</script>

<template>
  <div class="mx-auto max-w-[1560px] px-4 pb-8 pt-24 sm:px-8">
    <div class="mb-6 flex w-fit gap-1 rounded-lg border border-border bg-muted p-1">
      <Button
        v-for="option in (['clip', 'live'] as const)"
        :key="option"
        type="button"
        size="sm"
        :variant="mode === option ? 'default' : 'ghost'"
        @click="mode = option"
      >
        {{ option === 'clip' ? 'Clip (VOD)' : 'Live' }}
      </Button>
    </div>
    <WatchLayout
      v-model:sort="sort"
      :target="target"
      :engagement="engagement"
      :related="related"
      :comments="comments"
      :chat="chat"
    />
  </div>
</template>
