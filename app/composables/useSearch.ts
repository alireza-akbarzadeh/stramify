import { useQuery } from '@tanstack/vue-query'
import type { SearchResults } from '#shared/types/search'

/**
 * Search results for a reactive query.
 *
 * Disabled below two characters — a one-letter substring matches most of the
 * catalogue and tells the user nothing. `keepPreviousData` holds the last
 * result on screen while the next one loads, so the dropdown doesn't flash
 * empty on every keystroke.
 */
export function useSearch(query: Ref<string>, limit?: number) {
  const trimmed = computed(() => query.value.trim())
  const enabled = computed(() => trimmed.value.length >= 2)

  return useQuery({
    queryKey: ['search', trimmed, limit ?? null],
    enabled,
    placeholderData: (previous: SearchResults | undefined) => previous,
    queryFn: () =>
      $fetch<SearchResults>('/api/search', {
        query: { q: trimmed.value, ...(limit ? { limit } : {}) }
      })
  })
}
