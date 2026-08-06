import { useQuery } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'
import type { CategorySummary, Clip } from '#shared/types/discovery'

export interface CategoryClipsResponse {
  category: CategorySummary
  clips: Clip[]
}

/**
 * Clips for one category slug. `retry: false` so an unknown slug surfaces its
 * 404 immediately instead of after three retries — the page renders a
 * "category not found" state off it.
 */
export function useDiscoveryCategoryClips(slug: MaybeRefOrGetter<string>) {
  const key = computed(() => toValue(slug))
  return useQuery({
    queryKey: ['discovery', 'categories', key],
    queryFn: () => $fetch<CategoryClipsResponse>(`/api/discovery/categories/${key.value}`),
    retry: false
  })
}
