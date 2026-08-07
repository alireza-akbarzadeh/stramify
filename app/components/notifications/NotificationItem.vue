<script setup lang="ts">
import { Radio, Video } from '@lucide/vue'
import type { AppNotification } from '#shared/types/notification'

defineProps<{ notification: AppNotification }>()

const VERBS = {
  live: 'is live',
  upload: 'posted a new video'
} satisfies Record<AppNotification['kind'], string>

const ICONS = { live: Radio, upload: Video }
</script>

<template>
  <NuxtLink
    :to="`/watch/${encodeURIComponent(notification.slug)}`"
    :class="[
      'flex gap-3 rounded-lg p-2 transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      notification.unread && 'bg-primary/5'
    ]"
  >
    <span class="relative aspect-video w-20 shrink-0 overflow-hidden rounded-md bg-muted">
      <img
        :src="notification.image"
        alt=""
        width="160"
        height="90"
        loading="lazy"
        class="size-full object-cover"
      />
    </span>

    <span class="min-w-0 flex-1">
      <span class="flex items-center gap-1.5 text-xs text-muted-foreground">
        <component
          :is="ICONS[notification.kind]"
          class="size-3.5 shrink-0"
          :class="notification.kind === 'live' && 'text-primary'"
          aria-hidden="true"
        />
        <span class="truncate">
          <strong class="font-medium text-foreground">{{ notification.channel }}</strong>
          {{ VERBS[notification.kind] }}
        </span>
      </span>
      <span class="mt-0.5 line-clamp-2 text-sm leading-snug text-foreground">
        {{ notification.title }}
      </span>
      <span class="mt-0.5 block text-xs text-muted-foreground">{{ notification.age }}</span>
    </span>

    <span
      v-if="notification.unread"
      class="mt-2 size-2 shrink-0 rounded-full bg-primary"
      aria-label="Unread"
    />
  </NuxtLink>
</template>
