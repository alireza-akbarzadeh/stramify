<script setup lang="ts">
import { Search, X } from '@lucide/vue'
import { onClickOutside, refDebounced } from '@vueuse/core'
import { SEARCH_SUGGESTION_LIMIT } from '#shared/types/search'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useListCursor } from '@/composables/useListCursor'
import { useSearch } from '@/composables/useSearch'
import { toSearchPath, toSuggestions } from '@/utils/search'
import type { SearchSuggestion } from '@/utils/search'
import SearchSuggestions from './SearchSuggestions.vue'

/**
 * The app bar's search — YouTube's shape: type to get suggestions across
 * videos (VODs *and* live) and channels, Enter for the full results page.
 *
 * The suggestion request is debounced and only fires from two characters up
 * (see `useSearch`), so a fast typist costs one query, not one per keystroke.
 */
const ID = 'app-search'

const route = useRoute()
const root = ref<HTMLElement | null>(null)
const term = ref(String(route.query.q ?? ''))
const open = ref(false)

const { data, isFetching } = useSearch(refDebounced(term, 200), SEARCH_SUGGESTION_LIMIT)
const suggestions = computed(() => toSuggestions(data.value))
const cursor = useListCursor(() => suggestions.value.length)

const expanded = computed(() => open.value && term.value.trim().length >= 2)
const activeId = computed(() =>
  cursor.index.value >= 0 ? `${ID}-option-${cursor.index.value}` : undefined
)

onClickOutside(root, () => (open.value = false))
watch(() => route.fullPath, () => (open.value = false))

function go(to: string) {
  open.value = false
  cursor.reset()
  navigateTo(to)
}

/** Enter takes the highlighted row, or runs the query as typed. */
function submit() {
  const picked = suggestions.value[cursor.index.value]
  if (picked) return go(picked.to)
  if (term.value.trim()) go(toSearchPath(term.value))
}
</script>

<template>
  <div ref="root" class="relative min-w-0 flex-1 sm:max-w-xl">
    <form role="search" @submit.prevent="submit">
      <div class="group relative flex items-center">
        <Search
          class="pointer-events-none absolute left-3 size-4 text-muted-foreground transition-colors group-focus-within:text-primary"
          aria-hidden="true"
        />
        <Input
          v-model="term"
          :aria-expanded="expanded"
          :aria-controls="`${ID}-listbox`"
          :aria-activedescendant="activeId"
          aria-label="Search videos and channels"
          aria-autocomplete="list"
          role="combobox"
          autocomplete="off"
          placeholder="Search videos, channels…"
          class="h-10 pl-10 pr-9"
          @focus="open = true"
          @keydown.down.prevent="cursor.move(1)"
          @keydown.up.prevent="cursor.move(-1)"
          @keydown.esc="open = false"
        />
        <Button
          v-if="term"
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Clear search"
          class="absolute right-1 size-8"
          @click="((term = ''), cursor.reset())"
        >
          <X />
        </Button>
      </div>
    </form>

    <SearchSuggestions
      v-if="expanded"
      :suggestions="suggestions"
      :active-index="cursor.index.value"
      :query="term.trim()"
      :loading="isFetching"
      :option-id-prefix="ID"
      @pick="(suggestion: SearchSuggestion) => go(suggestion.to)"
      @highlight="(index: number) => (cursor.index.value = index)"
    />
  </div>
</template>
