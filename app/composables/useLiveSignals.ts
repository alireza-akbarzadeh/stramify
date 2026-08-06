import { useQuery } from '@tanstack/vue-query'
import type { LiveSignal } from '#shared/types/discovery'

export function useLiveSignals() {
  return useQuery({
    queryKey: ['discovery', 'live'],
    queryFn: () => $fetch<LiveSignal[]>('/api/discovery/live')
  })
}
