<script setup lang="ts">
import { Search, X } from '@lucide/vue'
import type { LiveSignal, WatchlistItem } from '#shared/types/discovery'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLiveSignals } from '@/composables/useLiveSignals'
import { useWatchlist } from '@/composables/useWatchlist'
import { filterLiveSignals, type LiveCategory } from '@/utils/live'
import { liveToItem } from '@/utils/watchlist'
import LiveChannelGrid from './LiveChannelGrid.vue'
import ClipPlayerModal from './ClipPlayerModal.vue'

const { data, isPending, isError, refetch } = useLiveSignals()
const { isSaved, toggle } = useWatchlist()

const search = ref('')
const activeCategory = ref<LiveCategory>('All Live')
const selectedItem = ref<WatchlistItem | null>(null)

const signals = computed(() => data.value ?? [])
const visible = computed(() => filterLiveSignals(signals.value, activeCategory.value, search.value))
const selectedSaved = computed(() => (selectedItem.value ? isSaved(selectedItem.value.id) : false))

function open(signal: LiveSignal) {
  selectedItem.value = liveToItem(signal)
}
function toggleSelected() {
  if (selectedItem.value) toggle(selectedItem.value)
}
</script>

<template>
  <div class="mx-auto max-w-[1560px] px-4 py-8 sm:px-8 mt-12">
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1
          class="flex items-center gap-2 text-3xl font-semibold tracking-tight text-foreground"
          data-testid="live-heading"
        >
          Live now
          <span
            class="size-2 rounded-full bg-primary animate-[pulse-ring_2s_ease-out_infinite] motion-reduce:animate-none"
            aria-hidden="true"
          />
        </h1>
        <p class="mt-2 text-sm text-muted-foreground" role="status">
          <template v-if="isPending">Checking who's on air…</template>
          <template v-else-if="isError">Live channels are unavailable right now.</template>
          <template v-else-if="signals.length"
            >{{ visible.length }} of {{ signals.length }} channels streaming right now.</template
          >
          <template v-else>No channels are streaming right now.</template>
        </p>
      </div>

      <label class="group relative flex w-full max-w-md items-center sm:w-auto sm:flex-1">
        <Search
          class="absolute left-3 size-4 text-muted-foreground transition-colors group-focus-within:text-primary"
          aria-hidden="true"
        />
        <Input
          v-model="search"
          placeholder="Search channels or stream titles..."
          aria-label="Search live channels or stream titles"
          class="pl-10 pr-9"
        />
        <Button
          v-if="search"
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Clear search"
          class="absolute right-1 size-8"
          @click="search = ''"
        >
          <X />
        </Button>
      </label>
    </div>

    <div v-if="isPending" class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <div v-for="n in 8" :key="n" class="space-y-3">
        <div class="aspect-video animate-pulse rounded-lg bg-muted" />
        <div class="h-3 w-3/4 animate-pulse rounded bg-muted" />
      </div>
    </div>

    <div
      v-else-if="isError"
      class="rounded-xl border border-dashed border-destructive/40 py-16 text-center"
    >
      <p class="text-lg font-semibold text-foreground">Couldn't load live channels</p>
      <p class="mt-2 text-sm text-muted-foreground">
        The directory failed to reach the server. Try again.
      </p>
      <Button type="button" variant="outline" size="sm" class="mt-4" @click="refetch()"
        >Retry</Button
      >
    </div>

    <LiveChannelGrid
      v-else
      v-model:active-category="activeCategory"
      :signals="visible"
      :is-saved="isSaved"
      @play="open"
      @toggle-save="toggle(liveToItem($event))"
    />

    <ClipPlayerModal
      :item="selectedItem"
      :saved="selectedSaved"
      @close="selectedItem = null"
      @toggle-save="toggleSelected"
    />
  </div>
</template>
