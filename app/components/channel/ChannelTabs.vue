<script setup lang="ts">
import type { ChannelTab } from '@/composables/useChannelTab'

/**
 * Channel section switcher. Sticky under the app header so the tabs stay
 * reachable while scrolling a long video grid — the one piece of navigation
 * that should never scroll away on a channel page.
 */
defineProps<{ videoCount: number; isLive: boolean }>()
const tab = defineModel<ChannelTab>({ required: true })

const tabs = computed(() => [
  { value: 'home' as const, label: 'Home' },
  { value: 'videos' as const, label: 'Videos' },
  { value: 'live' as const, label: 'Live' },
  { value: 'about' as const, label: 'About' }
])
</script>

<template>
  <nav
    class="sticky top-16 z-20 -mx-4 mt-6 border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:-mx-8 sm:px-8"
    aria-label="Channel sections"
  >
    <ul class="flex items-center gap-1 overflow-x-auto">
      <li v-for="item in tabs" :key="item.value">
        <button
          type="button"
          :aria-current="tab === item.value ? 'page' : undefined"
          :class="[
            'relative cursor-pointer whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            tab === item.value ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
          ]"
          @click="tab = item.value"
        >
          {{ item.label }}
          <span
            v-if="item.value === 'videos' && videoCount"
            class="ml-1 text-xs text-muted-foreground"
            >{{ videoCount }}</span
          >
          <span
            v-if="item.value === 'live' && isLive"
            class="ml-1 inline-block size-1.5 rounded-full bg-primary align-middle"
            aria-label="live now"
          />
          <span
            v-if="tab === item.value"
            class="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary"
            aria-hidden="true"
          />
        </button>
      </li>
    </ul>
  </nav>
</template>
