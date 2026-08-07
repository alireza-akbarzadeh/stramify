import { useQuery } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'
import type { CommentSort, WatchComment } from '#shared/types/watch'

/**
 * Comments for a clip. `sort` is part of the query key, so switching between
 * Top and Newest is a cache lookup after the first fetch rather than a refetch,
 * and `placeholderData` keeps the old list on screen while the new order loads
 * instead of flashing the skeleton.
 */
export function useWatchComments(
  slug: MaybeRefOrGetter<string>,
  sort: MaybeRefOrGetter<CommentSort>,
  enabled: MaybeRefOrGetter<boolean>
) {
  const key = computed(() => toValue(slug))
  const order = computed(() => toValue(sort))
  return useQuery({
    queryKey: ['watch', 'comments', key, order],
    queryFn: () =>
      $fetch<WatchComment[]>(`/api/watch/${encodeURIComponent(key.value)}/comments`, {
        query: { sort: order.value }
      }),
    enabled: computed(() => !!key.value && toValue(enabled)),
    placeholderData: (previous) => previous
  })
}
