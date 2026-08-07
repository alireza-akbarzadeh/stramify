<script setup lang="ts">
import { Check, Plus } from '@lucide/vue'
import type { ChannelSummary } from '#shared/types/watch'
import { Button } from '@/components/ui/button'
import ChannelAvatar from '@/components/ChannelAvatar.vue'

defineProps<{ channel: ChannelSummary | null; name: string; pending?: boolean }>()
const emit = defineEmits<{ (e: 'toggle-follow'): void }>()
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-4">
    <div class="flex min-w-0 items-center gap-3">
      <ChannelAvatar :name="name" class="size-11" />
      <div class="min-w-0">
        <p class="truncate font-semibold text-foreground">{{ name }}</p>
        <p class="text-xs text-muted-foreground">
          <template v-if="channel">
            {{ channel.followers }} followers · {{ channel.clipCount }} clips
          </template>
          <span v-else class="inline-block h-3 w-24 animate-pulse rounded bg-muted align-middle" />
        </p>
      </div>
    </div>

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
