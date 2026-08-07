<script setup lang="ts">
import { BadgeCheck, Check, Eye, Plus, Users, Video } from '@lucide/vue'
import type { ChannelListItem } from '#shared/types/channel'
import { Button } from '@/components/ui/button'
import ChannelAvatar from '@/components/ChannelAvatar.vue'
import { channelGradient } from '@/utils/channel'
import { toChannelPath, toChannelTag } from '#shared/utils/channel'
import { formatCount } from '#shared/utils/format'

/**
 * One channel in the directory.
 *
 * The card isn't wrapped in a link — the Follow button lives inside it, and
 * nesting a button in an anchor is invalid and unusable with a keyboard.
 * Instead the channel name is the link and stretches over the card
 * (`after:absolute after:inset-0`), so the whole surface is clickable while
 * the button stays a sibling on its own layer.
 */
const props = defineProps<{ channel: ChannelListItem; pending?: boolean }>()
defineEmits<{ (e: 'follow'): void }>()

const followers = computed(() => formatCount(props.channel.followerCount))
const banner = computed(() => channelGradient(props.channel.handle, 0.45))
</script>

<template>
  <article
    class="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/40 transition-colors hover:border-white/20"
  >
    <div class="relative h-24 shrink-0" :style="channel.previewImage ? undefined : { backgroundImage: banner }">
      <img
        v-if="channel.previewImage"
        :src="channel.previewImage"
        :alt="``"
        width="960"
        height="240"
        loading="lazy"
        class="size-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
      <span
        v-if="channel.isLive"
        class="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/85 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-foreground backdrop-blur"
      >
        <span
          class="size-1.5 rounded-full bg-primary animate-[pulse-ring_2s_ease-out_infinite] motion-reduce:animate-none"
          aria-hidden="true"
        />
        Live
      </span>
    </div>

    <div class="-mt-8 flex flex-1 flex-col gap-3 px-4 pb-4">
      <ChannelAvatar
        :name="channel.name"
        :image="channel.avatarUrl"
        class="size-14 border-4 border-card text-lg"
      />

      <div class="min-w-0">
        <h3 class="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <NuxtLink
            :to="toChannelPath(channel.handle)"
            class="truncate rounded-sm after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:text-primary"
          >
            {{ channel.name }}
          </NuxtLink>
          <BadgeCheck
            v-if="channel.verified"
            class="size-4 shrink-0 text-primary"
            aria-label="Verified channel"
          />
        </h3>
        <p class="truncate text-xs text-muted-foreground">{{ toChannelTag(channel.handle) }}</p>
      </div>

      <p class="line-clamp-2 min-h-8 text-xs leading-relaxed text-muted-foreground">
        {{ channel.isLive && channel.liveTitle ? channel.liveTitle : channel.tagline }}
      </p>

      <dl class="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <div class="flex items-center gap-1.5">
          <Users class="size-3.5" aria-hidden="true" />
          <dt class="sr-only">Followers</dt>
          <dd>{{ followers }}</dd>
        </div>
        <div class="flex items-center gap-1.5">
          <Eye class="size-3.5" aria-hidden="true" />
          <dt class="sr-only">Total views</dt>
          <dd>{{ channel.totalViews }}</dd>
        </div>
        <div class="flex items-center gap-1.5">
          <Video class="size-3.5" aria-hidden="true" />
          <dt class="sr-only">Videos</dt>
          <dd>{{ channel.clipCount }}</dd>
        </div>
      </dl>

      <Button
        type="button"
        size="sm"
        class="relative z-10 w-full"
        :variant="channel.isFollowing ? 'outline' : 'default'"
        :aria-pressed="channel.isFollowing"
        :aria-label="`${channel.isFollowing ? 'Unfollow' : 'Follow'} ${channel.name}`"
        :disabled="pending"
        @click="$emit('follow')"
      >
        <component :is="channel.isFollowing ? Check : Plus" />
        {{ channel.isFollowing ? 'Following' : 'Follow' }}
      </Button>
    </div>
  </article>
</template>
