<script setup lang="ts">
import { ChevronDown, ChevronUp } from '@lucide/vue'

/**
 * Collapsed to `line-clamp-2` until expanded. The toggle only renders when
 * the text is actually long enough to clip — a "Show more" button that
 * reveals nothing is worse than no button.
 */
const props = defineProps<{ description: string; summary: string }>()

const expanded = ref(false)
const clippable = computed(() => props.description.length > 140 || props.description.includes('\n'))
</script>

<template>
  <div class="rounded-lg bg-surface-2 p-4 text-sm">
    <p class="font-semibold text-foreground">{{ summary }}</p>
    <p
      v-if="description"
      :class="['mt-2 whitespace-pre-line text-muted-foreground', !expanded && 'line-clamp-2']"
    >
      {{ description }}
    </p>
    <p v-else class="mt-2 text-muted-foreground">No description provided.</p>

    <button
      v-if="clippable"
      type="button"
      class="mt-2 inline-flex cursor-pointer items-center gap-1 rounded-md text-xs font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      :aria-expanded="expanded"
      @click="expanded = !expanded"
    >
      {{ expanded ? 'Show less' : 'Show more' }}
      <component :is="expanded ? ChevronUp : ChevronDown" class="size-3.5" aria-hidden="true" />
    </button>
  </div>
</template>
