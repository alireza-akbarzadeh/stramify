<script setup lang="ts">
import { Check, Plus } from '@lucide/vue'
import type { ChannelSummary } from '#shared/types/watch'
import { Button } from '@/components/ui/button'
import ChannelAvatar from '@/components/ChannelAvatar.vue'
import { toChannelPath } from '#shared/utils/channel'

/**
 * Who uploaded this. The avatar and name are one link into the channel page —
 * the standard way out of a video and into everything else that channel made.
 * The Follow button stays a sibling of the link rather than a child of it, so
 * it's still a button to a keyboard and a screen reader.
 */
defineProps<{ channel: ChannelSummary | null; name: string; pending?: boolean }>()
const emit = defineEmits<{ (e: 'toggle-follow'): void }>()
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-4">
    <NuxtLink
      :to="toChannelPath(name)"
      class="group flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <ChannelAvatar :name="name" class="size-11" />
      <div class="min-w-0">
        <p class="truncate font-semibold text-foreground transition-colors group-hover:text-primary">
          {{ name }}
        </p>
        <p class="text-xs text-muted-foreground">
          <template v-if="channel">
            {{ channel.followers }} followers · {{ channel.clipCount }} clips
          </template>
          <span v-else class="inline-block h-3 w-24 animate-pulse rounded bg-muted align-middle" />
        </p>
      </div>
    </NuxtLink>

    <Button
      type="button"
      size="sm"
      :variant="channel?.isFollowing ? 'outline' : 'default'"
      :aria-pressed="!!channel?.isFollowing"
      :disabled="pending || !channel"
      @click="emit('toggle-follow')"
    >
      <component :is="channel?.isFollowing ? Check : Plus" />
      {{ channel?.isFollowing ? 'Following' : 'Follow' }}
    </Button>
  </div>
</template>
