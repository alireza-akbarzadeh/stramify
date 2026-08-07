<script setup lang="ts">
import { ArrowLeft } from '@lucide/vue'
import { toast } from 'vue-sonner'
import type { ChannelVideoSort } from '#shared/types/channel'
import { Button } from '@/components/ui/button'
import { storeToRefs } from 'pinia'
import { useChannelProfile, useChannelVideos, useFollowChannel } from '@/composables/useChannel'
import { useAuthStore } from '@/stores/auth'
import { toChannelHandle } from '#shared/utils/channel'
import ChannelHero from './ChannelHero.vue'
import ChannelTabs from './ChannelTabs.vue'
import ChannelHome from './ChannelHome.vue'
import ChannelVideoGrid from './ChannelVideoGrid.vue'
import ChannelLiveCard from './ChannelLiveCard.vue'
import ChannelAbout from './ChannelAbout.vue'
import ChannelSkeleton from './ChannelSkeleton.vue'
import { useChannelTab } from '@/composables/useChannelTab'

const props = defineProps<{ handle: string }>()
const handle = computed(() => toChannelHandle(props.handle))

const profile = useChannelProfile(handle)
const sort = ref<ChannelVideoSort>('latest')
const videos = useChannelVideos(handle, sort)
// The Home tab shows a "most watched" selection regardless of the Videos tab's
// current order, so it asks for its own — cached separately, fetched once.
const popular = useChannelVideos(handle, () => 'popular')

const tab = useChannelTab()
const { user } = storeToRefs(useAuthStore())
const follow = useFollowChannel()

const notFound = computed(
  () => (profile.error.value as { statusCode?: number } | null)?.statusCode === 404
)

useHead({
  title: computed(() =>
    profile.data.value ? `${profile.data.value.name} — Streamify` : 'Channel — Streamify'
  )
})

function onFollow() {
  if (!user.value) return toast.error('Log in to follow this channel.')
  follow.mutate(handle.value, { onError: () => toast.error("Couldn't update your follow.") })
}

function onShare() {
  navigator.clipboard
    .writeText(window.location.href)
    .then(() => toast.success('Channel link copied to clipboard'))
    .catch(() => toast.error("Couldn't copy the link"))
}
</script>

<template>
  <div class="mx-auto mt-12 max-w-[1560px] px-4 py-8 sm:px-8">
    <ChannelSkeleton v-if="profile.isPending.value" />

    <div
      v-else-if="notFound"
      class="rounded-xl border border-dashed border-border py-20 text-center"
    >
      <p class="text-sm font-semibold uppercase tracking-wide text-primary">No such channel</p>
      <h1 class="mt-2 text-2xl font-semibold text-foreground">
        Nothing is published under “{{ handle }}”
      </h1>
      <p class="mt-3 text-sm text-muted-foreground">
        The handle may have changed, or the channel hasn't posted anything yet.
      </p>
      <Button as-child class="mt-6" size="sm">
        <NuxtLink to="/channels">
          <ArrowLeft />
          Browse channels
        </NuxtLink>
      </Button>
    </div>

    <div
      v-else-if="profile.isError.value"
      class="rounded-xl border border-dashed border-destructive/40 py-20 text-center"
    >
      <h1 class="text-lg font-semibold text-foreground">Couldn't load this channel</h1>
      <p class="mt-2 text-sm text-muted-foreground">Something went wrong on our side.</p>
      <Button type="button" variant="outline" size="sm" class="mt-4" @click="profile.refetch()">
        Retry
      </Button>
    </div>

    <template v-else-if="profile.data.value">
      <ChannelHero
        :profile="profile.data.value"
        :pending="follow.isPending.value"
        @follow="onFollow"
        @share="onShare"
      />

      <ChannelTabs
        v-model="tab"
        :video-count="profile.data.value.clipCount"
        :is-live="!!profile.data.value.live"
      />

      <div class="pt-8">
        <ChannelHome
          v-if="tab === 'home'"
          :profile="profile.data.value"
          :latest="videos.data.value ?? []"
          :popular="popular.data.value ?? []"
          :pending="videos.isPending.value"
          :errored="videos.isError.value"
          @retry="videos.refetch()"
          @browse-videos="tab = 'videos'"
        />

        <ChannelVideoGrid
          v-else-if="tab === 'videos'"
          v-model:sort="sort"
          :clips="videos.data.value ?? []"
          :pending="videos.isPending.value"
          :errored="videos.isError.value"
          :fetching="videos.isFetching.value"
          :empty-message="`${profile.data.value.name} hasn't published any clips yet.`"
          @retry="videos.refetch()"
        />

        <div v-else-if="tab === 'live'">
          <ChannelLiveCard
            v-if="profile.data.value.live"
            :session="profile.data.value.live"
            :name="profile.data.value.name"
          />
          <div v-else class="rounded-xl border border-dashed border-border py-16 text-center">
            <p class="text-lg font-semibold text-foreground">
              {{ profile.data.value.name }} is offline
            </p>
            <p class="mt-2 text-sm text-muted-foreground">
              Follow the channel to get the next stream in your feed.
            </p>
            <Button as-child variant="outline" size="sm" class="mt-4">
              <NuxtLink to="/live">See who's live</NuxtLink>
            </Button>
          </div>
        </div>

        <ChannelAbout v-else :profile="profile.data.value" />
      </div>
    </template>
  </div>
</template>
