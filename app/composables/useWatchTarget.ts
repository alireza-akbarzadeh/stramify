import { useQuery } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'
import type { RelatedItem, WatchTarget } from '#shared/types/watch'

/**
 * The clip or live channel at `/watch/[slug]`. `retry: false` so an unknown
 * slug's 404 surfaces immediately and the page can render its "not available"
 * state instead of spinning through three retries — same reasoning as
 * `useLiveChannel`.
 */
export function useWatchTarget(slug: MaybeRefOrGetter<string>) {
  const key = computed(() => toValue(slug))
  return useQuery({
    queryKey: ['watch', 'target', key],
    queryFn: () => $fetch<WatchTarget>(`/api/watch/${encodeURIComponent(key.value)}`),
    enabled: computed(() => !!key.value),
    retry: false
  })
}

/** Up-next rail. Same-category items, live first. */
export function useWatchRelated(slug: MaybeRefOrGetter<string>) {
  const key = computed(() => toValue(slug))
  return useQuery({
    queryKey: ['watch', 'related', key],
    queryFn: () => $fetch<RelatedItem[]>(`/api/watch/${encodeURIComponent(key.value)}/related`),
    enabled: computed(() => !!key.value)
  })
}
