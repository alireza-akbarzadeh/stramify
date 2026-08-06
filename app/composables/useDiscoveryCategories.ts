import { useQuery } from '@tanstack/vue-query'
import type { CategorySummary } from '#shared/types/discovery'

export function useDiscoveryCategories() {
  return useQuery({
    queryKey: ['discovery', 'categories'],
    queryFn: () => $fetch<CategorySummary[]>('/api/discovery/categories')
  })
}
