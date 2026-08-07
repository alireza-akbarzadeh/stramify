<script setup lang="ts">
import { ArrowLeft, Bookmark, BookmarkCheck, Users } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import LiveBadge from '@/components/landing/LiveBadge.vue'
import { useLiveChannel } from '@/composables/useLiveChannel'
import { useLiveSignals } from '@/composables/useLiveSignals'
import { useWatchlist } from '@/composables/useWatchlist'
import { liveToItem } from '@/utils/watchlist'
import LiveChannelCard from './LiveChannelCard.vue'

const props = defineProps<{ username: string }>()

const {
  data: channel,
  isPending,
  isError,
  error,
  refetch
} = useLiveChannel(() => props.username)
const { data: allLive } = useLiveSignals()
const { isSaved, toggle } = useWatchlist()

const offline = computed(() => (error.value as { statusCode?: number } | null)?.statusCode === 404)
const saved = computed(() => (channel.value ? isSaved(channel.value.id) : false))
const more = computed(() =>
  (allLive.value ?? []).filter((signal) => signal.id !== channel.value?.id).slice(0, 4)
)

function toggleSave() {
  if (channel.value) toggle(liveToItem(channel.value))
}
function openChannel(name: string) {
  navigateTo(`/live/${encodeURIComponent(name)}`)
}
</script>

<template>
  <div class="mx-auto max-w-[1560px] px-4 py-8 sm:px-8 mt-12">
    <NuxtLink
      to="/live"
      class="inline-flex items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <ArrowLeft class="size-4" aria-hidden="true" />
      All live channels
    </NuxtLink>

    <div v-if="isPending" class="mt-6 space-y-6">
      <div class="aspect-video animate-pulse rounded-xl bg-muted" />
      <div class="h-6 w-2/3 animate-pulse rounded bg-muted" />
      <div class="h-4 w-1/3 animate-pulse rounded bg-muted" />
    </div>

    <div
      v-else-if="offline"
      class="mt-6 rounded-xl border border-dashed border-border py-20 text-center"
    >
      <p class="text-sm font-semibold uppercase tracking-wide text-primary">Offline</p>
      <h1 class="mt-2 text-2xl font-semibold text-foreground">
        {{ username }} isn't live right now
      </h1>
      <p class="mt-3 text-sm text-muted-foreground">
        Check back later, or catch someone else who's on air.
      </p>
      <Button as-child class="mt-6" size="sm">
        <NuxtLink to="/live">Browse live channels</NuxtLink>
      </Button>
    </div>

    <div
      v-else-if="isError"
      class="mt-6 rounded-xl border border-dashed border-destructive/40 py-20 text-center"
    >
      <p class="text-lg font-semibold text-foreground">Couldn't load this channel</p>
      <p class="mt-2 text-sm text-muted-foreground">Something went wrong on our side.</p>
      <Button type="button" variant="outline" size="sm" class="mt-4" @click="refetch()">
        Retry
      </Button>
    </div>

    <template v-else-if="channel">
      <div class="relative mt-6 aspect-video overflow-hidden rounded-xl bg-black">
        <media-player
          class="size-full"
          :title="channel.title"
          :src="channel.videoUrl"
          :poster="channel.image"
          playsinline
          autoplay
        >
          <media-provider></media-provider>
          <media-video-layout></media-video-layout>
        </media-player>
        <LiveBadge class="absolute left-4 top-4 z-10" />
      </div>

      <div
        class="mt-6 flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6"
      >
        <div class="min-w-0">
          <h1 class="text-2xl font-semibold text-foreground">{{ channel.title }}</h1>
          <div class="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span class="font-semibold text-foreground">{{ channel.name }}</span>
            <span>{{ channel.category }}</span>
            <span class="flex items-center gap-1">
              <Users class="size-4" aria-hidden="true" />
              {{ channel.viewers }}
            </span>
            <span>live {{ channel.uptime }}</span>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          :aria-pressed="saved"
          @click="toggleSave"
        >
          <component :is="saved ? BookmarkCheck : Bookmark" />
          {{ saved ? 'In watchlist' : 'Add to watchlist' }}
        </Button>
      </div>

      <section v-if="more.length" class="mt-10" aria-labelledby="more-live-heading">
        <h2 id="more-live-heading" class="mb-6 text-lg font-semibold text-foreground">
          More live now
        </h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <LiveChannelCard
            v-for="signal in more"
            :key="signal.id"
            :signal="signal"
            :saved="isSaved(signal.id)"
            @play="openChannel(signal.name)"
            @toggle-save="toggle(liveToItem(signal))"
          />
        </div>
      </section>
    </template>
  </div>
</template>
