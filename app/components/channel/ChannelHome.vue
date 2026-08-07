<script setup lang="ts">
import type { ChannelProfile } from '#shared/types/channel'
import type { Clip } from '#shared/types/discovery'
import ChannelLiveCard from './ChannelLiveCard.vue'
import ChannelSpotlight from './ChannelSpotlight.vue'
import ChannelVideoGrid from './ChannelVideoGrid.vue'

/**
 * The channel's front page: what's on now, what's newest, what's best.
 * Both grids are fixed selections — the Videos tab is where sorting lives.
 */
const props = defineProps<{
  profile: ChannelProfile
  latest: Clip[]
  popular: Clip[]
  pending: boolean
  errored: boolean
}>()
const emit = defineEmits<{ (e: 'retry' | 'browse-videos'): void }>()

const spotlight = computed(() => props.latest[0] ?? null)
const rest = computed(() => props.latest.slice(1, 5))
const mostWatched = computed(() => props.popular.slice(0, 4))
</script>

<template>
  <div class="space-y-10">
    <ChannelLiveCard v-if="profile.live" :session="profile.live" :name="profile.name" />

    <ChannelSpotlight v-if="spotlight" :clip="spotlight" />

    <section v-if="rest.length" class="space-y-4">
      <h2 class="text-lg font-semibold text-foreground">More from {{ profile.name }}</h2>
      <ChannelVideoGrid
        :clips="rest"
        :pending="false"
        :errored="false"
        :sortable="false"
        @retry="emit('retry')"
      />
    </section>

    <section v-if="mostWatched.length" class="space-y-4">
      <div class="flex items-center justify-between gap-4">
        <h2 class="text-lg font-semibold text-foreground">Most watched</h2>
        <button
          type="button"
          class="cursor-pointer rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          @click="emit('browse-videos')"
        >
          See all videos
        </button>
      </div>
      <ChannelVideoGrid
        :clips="mostWatched"
        :pending="false"
        :errored="false"
        :sortable="false"
        @retry="emit('retry')"
      />
    </section>

    <!-- Nothing published and nothing live: one honest empty state, not three. -->
    <ChannelVideoGrid
      v-if="!profile.live && !latest.length"
      :clips="[]"
      :pending="pending"
      :errored="errored"
      :sortable="false"
      :empty-message="`${profile.name} hasn't published anything yet. Follow the channel to hear about the first upload.`"
      @retry="emit('retry')"
    />
  </div>
</template>
