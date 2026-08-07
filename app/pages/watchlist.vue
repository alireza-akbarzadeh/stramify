<script setup lang="ts">
import WatchlistPanel from '@/components/discovery/WatchlistPanel.vue'
import type { WatchlistItem } from '#shared/types/discovery'

definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Watchlist — Streamify' })

/**
 * The saved list, promoted out of the tab it used to live in on `/clips` so
 * the sidebar can point at it. The panel reads the store itself; all this page
 * owns is where a saved item goes — the clip's id or the channel's handle,
 * matching how `/watch/[slug]` resolves the two namespaces.
 */
function open(item: WatchlistItem) {
  navigateTo(`/watch/${encodeURIComponent(item.kind === 'live' ? item.creator : item.id)}`)
}
</script>

<template>
  <div class="mx-auto max-w-[1560px] px-4 py-8 sm:px-8">
    <WatchlistPanel @open="open" @browse="navigateTo('/clips')" />
  </div>
</template>
