<script setup lang="ts">
import { Search, X } from '@lucide/vue'
import { refDebounced } from '@vueuse/core'
import { toast } from 'vue-sonner'
import type { ChannelSort } from '#shared/types/channel'
import { CHANNEL_SORTS } from '#shared/types/channel'
import type { ClipCategory } from '#shared/types/discovery'
import { CLIP_CATEGORIES } from '#shared/utils/category'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { storeToRefs } from 'pinia'
import { useChannelDirectory, useFollowChannel } from '@/composables/useChannel'
import { useAuthStore } from '@/stores/auth'
import ChannelDirectoryCard from './ChannelDirectoryCard.vue'

/**
 * The ranked channel directory.
 *
 * Ordering is the whole point of this page, so it happens in the database
 * rather than over an already-fetched array — see `ORDER_BY` in
 * `server/utils/channels.ts` for what each sort actually means. Search is
 * debounced because every keystroke would otherwise be a re-rank.
 */
const sort = ref<ChannelSort>('top')
const search = ref('')
const category = ref<ClipCategory | null>(null)
const debouncedSearch = refDebounced(search, 250)

const filters = computed(() => ({
  sort: sort.value,
  search: debouncedSearch.value.trim(),
  category: category.value
}))
const { data, isPending, isError, isFetching, refetch } = useChannelDirectory(filters)
const { user } = storeToRefs(useAuthStore())
const follow = useFollowChannel()

const channels = computed(() => data.value ?? [])
const isFiltered = computed(() => !!filters.value.search || !!filters.value.category)

function onFollow(handle: string) {
  if (!user.value) return toast.error('Log in to follow channels.')
  follow.mutate(handle, { onError: () => toast.error("Couldn't update your follow.") })
}

/** Only the card being toggled goes busy — one mutation drives the whole grid. */
function isFollowPending(handle: string) {
  return follow.isPending.value && follow.variables.value === handle
}
</script>

<template>
  <div class="mx-auto mt-12 max-w-[1560px] px-4 py-8 sm:px-8">
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-3xl font-semibold tracking-tight text-foreground">Channels</h1>
        <p class="mt-2 text-sm text-muted-foreground" role="status">
          <template v-if="isPending">Ranking channels…</template>
          <template v-else-if="isError">Channels are unavailable right now.</template>
          <template v-else-if="channels.length">
            {{ channels.length }} {{ channels.length === 1 ? 'channel' : 'channels' }}, ranked by
            followers, total views and who's on air.
          </template>
          <template v-else>No channels match those filters.</template>
        </p>
      </div>

      <label class="group relative flex w-full max-w-md items-center sm:w-auto sm:flex-1">
        <Search
          class="absolute left-3 size-4 text-muted-foreground transition-colors group-focus-within:text-primary"
          aria-hidden="true"
        />
        <Input
          v-model="search"
          placeholder="Search channels..."
          aria-label="Search channels by name or handle"
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

    <div class="mb-8 flex flex-col gap-3">
      <div class="flex flex-wrap items-center gap-2" role="group" aria-label="Sort channels">
        <button
          v-for="option in CHANNEL_SORTS"
          :key="option.value"
          type="button"
          :aria-pressed="sort === option.value"
          :class="[
            'cursor-pointer rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            sort === option.value
              ? 'border-primary/50 bg-primary/10 text-foreground'
              : 'border-border text-muted-foreground hover:border-white/20 hover:text-foreground'
          ]"
          @click="sort = option.value"
        >
          {{ option.label }}
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
        <button
          type="button"
          :aria-pressed="category === null"
          :class="[
            'cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            category === null ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:text-foreground'
          ]"
          @click="category = null"
        >
          All categories
        </button>
        <button
          v-for="name in CLIP_CATEGORIES"
          :key="name"
          type="button"
          :aria-pressed="category === name"
          :class="[
            'cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            category === name ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:text-foreground'
          ]"
          @click="category = name"
        >
          {{ name }}
        </button>
      </div>
    </div>

    <div v-if="isPending" class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <div v-for="n in 8" :key="n" class="h-72 animate-pulse rounded-2xl bg-muted" />
    </div>

    <div
      v-else-if="isError"
      class="rounded-xl border border-dashed border-destructive/40 py-16 text-center"
    >
      <p class="text-lg font-semibold text-foreground">Couldn't load channels</p>
      <p class="mt-2 text-sm text-muted-foreground">
        The directory failed to reach the server. Try again.
      </p>
      <Button type="button" variant="outline" size="sm" class="mt-4" @click="refetch()">
        Retry
      </Button>
    </div>

    <div
      v-else-if="channels.length"
      :class="[
        'grid grid-cols-1 gap-6 transition-opacity sm:grid-cols-2 xl:grid-cols-4',
        isFetching && 'opacity-60'
      ]"
    >
      <Reveal
        v-for="(channel, index) in channels"
        :key="channel.handle"
        class="h-full"
        :delay="Math.min(index, 7) * 0.04"
      >
        <ChannelDirectoryCard
          :channel="channel"
          :pending="isFollowPending(channel.handle)"
          @follow="onFollow(channel.handle)"
        />
      </Reveal>
    </div>

    <div v-else class="rounded-xl border border-dashed border-border py-16 text-center">
      <p class="text-lg font-semibold text-foreground">No channels found</p>
      <p class="mt-2 text-sm text-muted-foreground">
        {{
          isFiltered
            ? 'Nothing matches those filters yet — try another category or clear the search.'
            : 'No one has published anything yet.'
        }}
      </p>
      <Button v-if="isFiltered" type="button" variant="outline" size="sm" class="mt-4" @click="((search = ''), (category = null))">
        Clear filters
      </Button>
    </div>
  </div>
</template>
