<script setup lang="ts">
import { Trash2 } from '@lucide/vue'
import type { WatchlistItem } from '#shared/types/discovery'
import { Button } from '@/components/ui/button'
import WatchlistCard from './WatchlistCard.vue'

const props = defineProps<{
  savedClips: WatchlistItem[]
  savedLive: WatchlistItem[]
  hydrated: boolean
}>()
const emit = defineEmits<{
  (e: 'open', item: WatchlistItem): void
  (e: 'remove', id: string): void
  (e: 'clear' | 'browse'): void
}>()

const total = computed(() => props.savedClips.length + props.savedLive.length)
</script>

<template>
  <section aria-labelledby="watchlist-heading">
    <div
      class="mb-8 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <p class="mb-2 text-xs font-bold uppercase tracking-wide text-primary">Favorites</p>
        <h1 id="watchlist-heading" class="text-2xl font-semibold text-foreground">
          Your watchlist
        </h1>
        <p class="mt-2 text-sm text-muted-foreground">
          {{
            hydrated
              ? `${savedClips.length} clips · ${savedLive.length} live channels saved on this device`
              : 'Loading saved signals…'
          }}
        </p>
      </div>
      <Button
        v-if="hydrated && total"
        type="button"
        variant="outline"
        size="sm"
        @click="emit('clear')"
      >
        <Trash2 /> Clear all
      </Button>
    </div>

    <div
      v-if="hydrated && total === 0"
      class="rounded-lg border border-dashed border-border py-16 text-center"
    >
      <p class="text-lg font-semibold text-foreground">Nothing saved yet</p>
      <p class="mt-2 text-sm text-muted-foreground">
        Tap the bookmark on any clip or live channel to keep it here.
      </p>
      <Button type="button" class="mt-6" @click="emit('browse')">Browse highlights</Button>
    </div>

    <div v-if="savedLive.length" class="mb-12">
      <h2 class="mb-6 flex items-center gap-2 text-lg font-semibold text-foreground">
        Saved live channels
        <span
          class="size-1.5 rounded-full bg-primary animate-[pulse-ring_2s_ease-out_infinite] motion-reduce:animate-none"
          aria-hidden="true"
        />
      </h2>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <WatchlistCard
          v-for="item in savedLive"
          :key="item.id"
          :item="item"
          live
          @open="emit('open', item)"
          @remove="emit('remove', item.id)"
        />
      </div>
    </div>

    <div v-if="savedClips.length">
      <h2 class="mb-6 text-lg font-semibold text-foreground">Saved clips</h2>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <WatchlistCard
          v-for="item in savedClips"
          :key="item.id"
          :item="item"
          @open="emit('open', item)"
          @remove="emit('remove', item.id)"
        />
      </div>
    </div>
  </section>
</template>
