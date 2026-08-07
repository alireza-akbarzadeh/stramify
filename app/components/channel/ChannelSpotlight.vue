<script setup lang="ts">
import { Play } from '@lucide/vue'
import type { Clip } from '#shared/types/discovery'
import { Button } from '@/components/ui/button'

/**
 * The channel's newest upload, given the weight a channel page's front section
 * deserves — this is the "what should I watch first" answer when nothing is
 * live. Same data as a `ClipCard`, just not competing with three siblings.
 */
defineProps<{ clip: Clip }>()
</script>

<template>
  <article
    class="group grid gap-5 rounded-2xl border border-border bg-card/40 p-4 sm:grid-cols-[minmax(0,360px)_minmax(0,1fr)] sm:p-5"
  >
    <NuxtLink
      :to="`/watch/${encodeURIComponent(clip.id)}`"
      class="relative block aspect-video overflow-hidden rounded-xl bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      :aria-label="`Watch ${clip.title}`"
    >
      <img
        :src="clip.image"
        :alt="clip.title"
        width="960"
        height="540"
        class="size-full object-cover transition duration-500 group-hover:scale-105"
      />
      <span
        class="absolute bottom-2 right-2 rounded-sm bg-background/90 px-1.5 py-0.5 text-[11px] font-semibold text-foreground"
        >{{ clip.duration }}</span
      >
      <span
        class="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 transition group-hover:opacity-100"
      >
        <span
          class="flex size-12 items-center justify-center rounded-full bg-foreground text-background"
        >
          <Play class="size-5 fill-current" />
        </span>
      </span>
    </NuxtLink>

    <div class="flex min-w-0 flex-col justify-center gap-3">
      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Latest upload</p>
      <h3 class="text-lg font-semibold leading-snug text-foreground">{{ clip.title }}</h3>
      <p class="text-sm text-muted-foreground">
        {{ clip.views }} · {{ clip.age }} · {{ clip.category }}
      </p>
      <div>
        <Button as-child size="sm" variant="outline">
          <NuxtLink :to="`/watch/${encodeURIComponent(clip.id)}`">Watch</NuxtLink>
        </Button>
      </div>
    </div>
  </article>
</template>
