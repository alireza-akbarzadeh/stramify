import { useQuery } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'
import type { LiveSignal } from '#shared/types/discovery'

/**
 * One live channel by streamer name. `retry: false` so an offline channel's
 * 404 surfaces immediately instead of after three retries — the page renders
 * an "offline" state off it, same pattern as `useDiscoveryCategoryClips`.
 */
export function useLiveChannel(streamer: MaybeRefOrGetter<string>) {
  const key = computed(() => toValue(streamer))
  return useQuery({
    queryKey: ['discovery', 'live', 'channel', key],
    queryFn: () => $fetch<LiveSignal>(`/api/discovery/live/${encodeURIComponent(key.value)}`),
    retry: false
  })
}
