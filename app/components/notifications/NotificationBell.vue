<script setup lang="ts">
import { Bell } from '@lucide/vue'
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger
} from 'reka-ui'
import { storeToRefs } from 'pinia'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'
import { useNotifications } from '@/composables/useNotifications'
import NotificationItem from './NotificationItem.vue'

/**
 * Activity from the channels you follow — going live, and new videos.
 *
 * Hidden when signed out: the feed is derived from *your* follows, so there is
 * nothing generic to show a visitor. Marking read is an explicit action rather
 * than a side effect of opening, so the highlight survives long enough to read.
 */
const { isAuthenticated } = storeToRefs(useAuthStore())
const { feed, isPending, isError, refetch, markAllRead } = useNotifications()

const badge = computed(() => (feed.value.unreadCount > 9 ? '9+' : String(feed.value.unreadCount)))
const label = computed(() =>
  feed.value.unreadCount
    ? `Notifications, ${feed.value.unreadCount} unread`
    : 'Notifications'
)
</script>

<template>
  <PopoverRoot v-if="isAuthenticated">
    <PopoverTrigger as-child>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="relative size-9 rounded-full"
        :aria-label="label"
      >
        <Bell class="size-4.5" />
        <span
          v-if="feed.unreadCount"
          class="absolute -right-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold leading-4 text-primary-foreground"
          aria-hidden="true"
        >
          {{ badge }}
        </span>
      </Button>
    </PopoverTrigger>

    <PopoverPortal>
      <PopoverContent
        align="end"
        :side-offset="10"
        class="z-50 w-[min(22rem,calc(100vw-2rem))] origin-top-right rounded-xl border border-border bg-popover shadow-[0_24px_60px_-24px_var(--shadow-color)] backdrop-blur-xl data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
      >
        <header class="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
          <h2 class="text-sm font-semibold text-foreground">Notifications</h2>
          <Button
            v-if="feed.unreadCount"
            type="button"
            variant="ghost"
            size="sm"
            class="h-7 px-2 text-xs"
            :disabled="markAllRead.isPending.value"
            @click="markAllRead.mutate()"
          >
            Mark all read
          </Button>
        </header>

        <div class="max-h-[min(70vh,24rem)] overflow-y-auto p-1.5">
          <div v-if="isPending" class="space-y-2 p-1">
            <div v-for="n in 3" :key="n" class="flex gap-3">
              <div class="aspect-video w-20 shrink-0 animate-pulse rounded-md bg-muted" />
              <div class="flex-1 space-y-2 py-1">
                <div class="h-3 w-2/3 animate-pulse rounded bg-muted" />
                <div class="h-3 w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>

          <div v-else-if="isError" class="px-3 py-6 text-center">
            <p class="text-sm text-foreground">Couldn't load notifications</p>
            <Button type="button" variant="outline" size="sm" class="mt-3" @click="refetch()">
              Retry
            </Button>
          </div>

          <div v-else-if="!feed.items.length" class="px-3 py-8 text-center">
            <p class="text-sm font-medium text-foreground">You're all caught up</p>
            <p class="mt-1 text-xs text-muted-foreground">
              Follow channels and you'll hear here when they go live or post.
            </p>
            <Button as-child variant="outline" size="sm" class="mt-4">
              <NuxtLink to="/channels">Browse channels</NuxtLink>
            </Button>
          </div>

          <ul v-else class="space-y-0.5">
            <li v-for="notification in feed.items" :key="notification.id">
              <NotificationItem :notification="notification" />
            </li>
          </ul>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
