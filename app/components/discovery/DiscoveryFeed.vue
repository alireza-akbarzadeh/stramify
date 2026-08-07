<script setup lang="ts">
import { Search, X } from '@lucide/vue'
import type { ClipCategory, LiveSignal, WatchlistItem } from '#shared/types/discovery'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDiscoveryClips } from '@/composables/useDiscoveryClips'
import { useLiveSignals } from '@/composables/useLiveSignals'
import { useWatchlist } from '@/composables/useWatchlist'
import { clipToItem, liveToItem } from '@/utils/watchlist'
import FeaturedClip from './FeaturedClip.vue'
import LiveSignalsRail from './LiveSignalsRail.vue'
import ClipGrid from './ClipGrid.vue'
import WatchlistPanel from './WatchlistPanel.vue'
import ClipPlayerModal from './ClipPlayerModal.vue'

type Category = ClipCategory | 'All Clips'

const {
  data: clipsData,
  isPending: clipsPending,
  isError: clipsErrored,
  refetch: refetchClips
} = useDiscoveryClips()
const { data: liveSignalsData, isPending: livePending } = useLiveSignals()
const { items: saved, hydrated, isSaved, toggle, remove, clear } = useWatchlist()

const view = ref<'feed' | 'watchlist'>('feed')
const search = ref('')
const activeCategory = ref<Category>('All Clips')
const selectedItem = ref<WatchlistItem | null>(null)

const clips = computed(() => clipsData.value?.clips ?? [])
const featured = computed(() => clipsData.value?.featured ?? null)
const liveSignals = computed(() => liveSignalsData.value ?? [])

const filteredClips = computed(() => {
  const query = search.value.trim().toLowerCase()
  return clips.value.filter((clip) => {
    const matchesCategory =
      activeCategory.value === 'All Clips' || clip.category === activeCategory.value
    const matchesSearch =
      !query || `${clip.title} ${clip.creator} ${clip.category}`.toLowerCase().includes(query)
    return matchesCategory && matchesSearch
  })
})

const savedClips = computed(() => saved.value.filter((item) => item.kind === 'clip'))
const savedLive = computed(() => saved.value.filter((item) => item.kind === 'live'))
const selectedSaved = computed(() => (selectedItem.value ? isSaved(selectedItem.value.id) : false))

function toggleSelected() {
  if (selectedItem.value) toggle(selectedItem.value)
}

/** Live channels get a real page now (`/live/[username]`); clips stay in the in-place preview modal. */
function openSaved(item: WatchlistItem) {
  if (item.kind === 'live') {
    navigateTo(`/live/${encodeURIComponent(item.creator)}`)
    return
  }
  selectedItem.value = item
}
function openLive(signal: LiveSignal) {
  navigateTo(`/live/${encodeURIComponent(signal.name)}`)
}
</script>

<template>
  <div class="mx-auto max-w-[1560px] px-4 py-8 sm:px-8 mt-12">
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div
        class="flex gap-1 rounded-lg border border-border bg-muted p-1"
        role="tablist"
        aria-label="Highlights view"
      >
        <Button
          type="button"
          size="sm"
          :variant="view === 'feed' ? 'default' : 'ghost'"
          role="tab"
          :aria-selected="view === 'feed'"
          @click="view = 'feed'"
        >
          Feed
        </Button>
        <Button
          type="button"
          size="sm"
          :variant="view === 'watchlist' ? 'default' : 'ghost'"
          role="tab"
          :aria-selected="view === 'watchlist'"
          @click="view = 'watchlist'"
        >
          Watchlist
          <span
            v-if="hydrated && saved.length"
            class="ml-1 rounded-sm bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground"
            >{{ saved.length }}</span
          >
        </Button>
      </div>

      <label class="group relative flex max-w-md flex-1 items-center">
        <Search
          class="absolute left-3 size-4 text-muted-foreground transition-colors group-focus-within:text-primary"
          aria-hidden="true"
        />
        <Input
          v-model="search"
          placeholder="Search clips, creators, or tags..."
          aria-label="Search clips, creators, or tags"
          class="pl-10 pr-9"
          @update:model-value="view = 'feed'"
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

    <WatchlistPanel
      v-if="view === 'watchlist'"
      :saved-clips="savedClips"
      :saved-live="savedLive"
      :hydrated="hydrated"
      @open="openSaved"
      @remove="remove"
      @clear="clear"
      @browse="view = 'feed'"
    />

    <template v-else>
      <div v-if="clipsPending" class="mb-12 aspect-video animate-pulse rounded-xl bg-muted" />
      <div
        v-else-if="clipsErrored"
        class="mb-12 rounded-xl border border-dashed border-destructive/40 py-16 text-center"
      >
        <p class="text-lg font-semibold text-foreground">Couldn't load highlights</p>
        <Button type="button" variant="outline" size="sm" class="mt-4" @click="refetchClips()"
          >Retry</Button
        >
      </div>
      <FeaturedClip
        v-else-if="featured"
        class="mb-12"
        :clip="featured"
        :saved="isSaved(featured.id)"
        @play="selectedItem = clipToItem(featured)"
        @toggle-save="toggle(clipToItem(featured))"
      />

      <div v-if="livePending" class="mb-12 flex gap-4">
        <div
          v-for="n in 4"
          :key="n"
          class="aspect-video w-64 shrink-0 animate-pulse rounded-lg bg-muted"
        />
      </div>
      <LiveSignalsRail
        v-else-if="liveSignals.length"
        class="mb-12"
        :signals="liveSignals"
        :is-saved="isSaved"
        @play="openLive"
        @toggle-save="toggle(liveToItem($event))"
      />

      <ClipGrid
        v-model:active-category="activeCategory"
        :clips="filteredClips"
        :is-saved="isSaved"
        @play="selectedItem = clipToItem($event)"
        @toggle-save="toggle(clipToItem($event))"
      />
    </template>

    <ClipPlayerModal
      :item="selectedItem"
      :saved="selectedSaved"
      @close="selectedItem = null"
      @toggle-save="toggleSelected"
    />
  </div>
</template>
