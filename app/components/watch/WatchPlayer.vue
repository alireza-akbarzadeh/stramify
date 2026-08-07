<script setup lang="ts">
import type { WatchTarget } from '#shared/types/watch'
import LiveBadge from '@/components/landing/LiveBadge.vue'

defineProps<{ target: WatchTarget }>()
/** `play-start` drives the view counter; the parent debounces it per session. */
const emit = defineEmits<{ (e: 'play-start'): void }>()
</script>

<template>
  <div
    class="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-[0_24px_60px_-24px_var(--shadow-color)]"
  >
    <media-player
      class="size-full"
      :title="target.title"
      :src="target.videoUrl"
      :poster="target.image"
      :stream-type="target.kind === 'live' ? 'live' : 'on-demand'"
      playsinline
      autoplay
      @play="emit('play-start')"
    >
      <media-provider></media-provider>
      <media-video-layout></media-video-layout>
    </media-player>
    <LiveBadge v-if="target.kind === 'live'" class="absolute left-4 top-4 z-10" />
  </div>
</template>
