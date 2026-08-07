<script setup lang="ts">
import { Radio, Search, Tv, Video } from '@lucide/vue'
import type { SearchSuggestion } from '@/utils/search'
import { toSearchPath } from '@/utils/search'

defineProps<{
  suggestions: SearchSuggestion[]
  /** Highlighted row, or `-1` for none. Owned by the parent's keyboard cursor. */
  activeIndex: number
  query: string
  loading: boolean
  /** Prefix for each option's DOM id, so the input can point `aria-activedescendant` at it. */
  optionIdPrefix: string
}>()

const emit = defineEmits<{
  (e: 'pick', suggestion: SearchSuggestion): void
  (e: 'highlight', index: number): void
}>()

const ICONS = { live: Radio, clip: Video, channel: Tv }
</script>

<template>
  <div
    class="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-popover shadow-[0_24px_60px_-24px_var(--shadow-color)] backdrop-blur-xl"
  >
    <ul
      :id="`${optionIdPrefix}-listbox`"
      role="listbox"
      aria-label="Search suggestions"
      class="max-h-[min(70vh,26rem)] overflow-y-auto p-1.5"
    >
      <li v-if="!suggestions.length" class="px-3 py-6 text-center text-sm text-muted-foreground">
        {{ loading ? 'Searching…' : `No matches for “${query}”` }}
      </li>

      <li
        v-for="(suggestion, index) in suggestions"
        :id="`${optionIdPrefix}-option-${index}`"
        :key="suggestion.id"
        role="option"
        :aria-selected="index === activeIndex"
        :class="[
          'flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 transition-colors',
          index === activeIndex && 'bg-surface-2'
        ]"
        @mousemove="emit('highlight', index)"
        @click="emit('pick', suggestion)"
      >
        <span
          class="grid size-10 shrink-0 place-items-center overflow-hidden rounded-md bg-muted text-muted-foreground"
          :class="suggestion.kind === 'channel' && 'rounded-full'"
        >
          <img
            v-if="suggestion.image"
            :src="suggestion.image"
            alt=""
            width="80"
            height="80"
            loading="lazy"
            class="size-full object-cover"
          />
          <component :is="ICONS[suggestion.kind]" v-else class="size-4" aria-hidden="true" />
        </span>

        <span class="min-w-0 flex-1">
          <span class="block truncate text-sm text-foreground">{{ suggestion.label }}</span>
          <span class="block truncate text-xs text-muted-foreground">{{ suggestion.hint }}</span>
        </span>

        <component
          :is="ICONS[suggestion.kind]"
          class="size-3.5 shrink-0 text-muted-foreground"
          :class="suggestion.kind === 'live' && 'text-primary'"
          aria-hidden="true"
        />
      </li>
    </ul>

    <!--
      Deliberately not a listbox option: Enter with nothing highlighted already
      goes here, so keyboard users reach it without arrowing past every row.
    -->
    <NuxtLink
      :to="toSearchPath(query)"
      class="flex items-center gap-2 border-t border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
    >
      <Search class="size-4 text-muted-foreground" aria-hidden="true" />
      See all results for “{{ query }}”
    </NuxtLink>
  </div>
</template>
