import { useQuery } from '@tanstack/vue-query'
import type { Clip } from '#shared/types/discovery'

interface DiscoveryClipsResponse {
  featured: Clip
  clips: Clip[]
}

export function useDiscoveryClips() {
  return useQuery({
    queryKey: ['discovery', 'clips'],
    queryFn: () => $fetch<DiscoveryClipsResponse>('/api/discovery/clips')
  })
}
