<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle
} from 'reka-ui'
import { Bookmark, BookmarkCheck, Tv, X } from '@lucide/vue'
import type { WatchlistItem } from '#shared/types/discovery'
import { Button } from '@/components/ui/button'

defineProps<{ item: WatchlistItem | null; saved: boolean }>()
const emit = defineEmits<{ (e: 'close' | 'toggle-save'): void }>()
</script>

<template>
  <DialogRoot :open="!!item" @update:open="(open) => !open && emit('close')">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
      <DialogContent
        v-if="item"
        class="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-x-hidden overflow-y-auto rounded-xl border border-border bg-card shadow-[0_24px_60px_-24px_var(--shadow-color)]"
      >
        <DialogTitle class="sr-only">{{ item.title }}</DialogTitle>
        <DialogDescription class="sr-only"
          >Highlight player for {{ item.title }} by {{ item.creator }}</DialogDescription
        >

        <div class="relative aspect-video bg-background">
          <media-player
            v-if="item.videoUrl"
            class="size-full"
            :title="item.title"
            :src="item.videoUrl"
            :poster="item.image"
            crossorigin
            playsinline
            autoplay
          >
            <media-provider></media-provider>
            <media-video-layout></media-video-layout>
          </media-player>
          <template v-else>
            <img :src="item.image" alt="" class="size-full object-cover" />
            <div class="absolute inset-0 flex items-center justify-center">
              <span
                class="flex size-16 items-center justify-center rounded-full bg-foreground/90 text-background"
              >
                <Tv class="size-6" />
              </span>
            </div>
          </template>
          <DialogClose as-child>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close player"
              class="absolute right-3 top-3 z-10 rounded-full bg-background/80 hover:bg-surface-2"
            >
              <X />
            </Button>
          </DialogClose>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-4 p-5">
          <div class="min-w-0">
            <h2 class="truncate text-xl font-semibold text-foreground">{{ item.title }}</h2>
            <p class="mt-1 text-sm text-muted-foreground">{{ item.creator }} · {{ item.meta }}</p>
          </div>
          <div class="flex shrink-0 items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              :aria-pressed="saved"
              @click="emit('toggle-save')"
            >
              <component :is="saved ? BookmarkCheck : Bookmark" />
              {{ saved ? 'In watchlist' : 'Add to watchlist' }}
            </Button>
            <span
              v-if="!item.videoUrl"
              class="hidden items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary sm:flex"
            >
              <Tv class="size-4" /> Live streaming coming soon
            </span>
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
