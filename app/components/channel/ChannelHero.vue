<script setup lang="ts">
import { BadgeCheck, Check, Plus, Radio, Share2 } from '@lucide/vue'
import type { ChannelProfile } from '#shared/types/channel'
import { Button } from '@/components/ui/button'
import ChannelAvatar from '@/components/ChannelAvatar.vue'
import { channelGradient } from '@/utils/channel'
import { toChannelTag } from '#shared/utils/channel'
import { formatCount } from '#shared/utils/format'

/**
 * The channel's identity block: banner, avatar, name, stats, follow.
 *
 * A channel with no uploaded banner still gets a real one — the same
 * deterministic gradient its avatar uses, so the page reads as *this* channel's
 * rather than as a missing image.
 */
const props = defineProps<{ profile: ChannelProfile; pending?: boolean }>()
defineEmits<{ (e: 'follow' | 'share'): void }>()

const followers = computed(() => formatCount(props.profile.followerCount))
const banner = computed(() => channelGradient(props.profile.handle, 0.45))
</script>

<template>
  <header>
    <div class="relative overflow-hidden rounded-2xl">
      <div
        class="h-32 w-full sm:h-44 lg:h-56"
        :style="profile.bannerUrl ? undefined : { backgroundImage: banner }"
      >
        <img
          v-if="profile.bannerUrl"
          :src="profile.bannerUrl"
          :alt="`${profile.name} banner`"
          class="size-full object-cover"
        />
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />

      <NuxtLink
        v-if="profile.live"
        :to="`/watch/${encodeURIComponent(profile.live.slug)}`"
        class="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-background/85 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span
          class="size-2 rounded-full bg-primary animate-[pulse-ring_2s_ease-out_infinite] motion-reduce:animate-none"
          aria-hidden="true"
        />
        Live now · {{ profile.live.viewers }}
      </NuxtLink>
    </div>

    <div class="flex flex-col gap-4 px-1 sm:flex-row sm:items-end sm:gap-6">
      <ChannelAvatar
        :name="profile.name"
        :image="profile.avatarUrl"
        class="-mt-10 size-20 border-4 border-background text-2xl sm:-mt-14 sm:size-28 sm:text-3xl"
      />

      <div class="min-w-0 flex-1 pt-1">
        <h1 class="flex items-center gap-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          <span class="truncate">{{ profile.name }}</span>
          <BadgeCheck
            v-if="profile.verified"
            class="size-5 shrink-0 text-primary"
            aria-label="Verified channel"
          />
        </h1>
        <p class="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
          <span class="font-medium text-foreground/80">{{ toChannelTag(profile.handle) }}</span>
          <span aria-hidden="true">·</span>
          <span>{{ followers }} followers</span>
          <span aria-hidden="true">·</span>
          <span>{{ profile.clipCount }} {{ profile.clipCount === 1 ? 'video' : 'videos' }}</span>
          <span aria-hidden="true">·</span>
          <span>{{ profile.totalViews }} views</span>
        </p>
        <p v-if="profile.tagline" class="mt-2 max-w-2xl text-sm text-muted-foreground">
          {{ profile.tagline }}
        </p>
      </div>

      <div class="flex shrink-0 items-center gap-2 pb-1">
        <Button
          type="button"
          :variant="profile.isFollowing ? 'outline' : 'default'"
          :aria-pressed="profile.isFollowing"
          :disabled="pending"
          @click="$emit('follow')"
        >
          <component :is="profile.isFollowing ? Check : Plus" />
          {{ profile.isFollowing ? 'Following' : 'Follow' }}
        </Button>
        <Button type="button" variant="outline" size="icon" aria-label="Share channel" @click="$emit('share')">
          <Share2 />
        </Button>
        <Button v-if="profile.live" as-child variant="secondary">
          <NuxtLink :to="`/watch/${encodeURIComponent(profile.live.slug)}`">
            <Radio />
            Watch live
          </NuxtLink>
        </Button>
      </div>
    </div>
  </header>
</template>
