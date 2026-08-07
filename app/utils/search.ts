import { toChannelPath } from '#shared/utils/channel'
import { formatCount } from '#shared/utils/format'
import type { SearchResults } from '#shared/types/search'

/** One row of the header dropdown, flattened so keyboard nav is a single index. */
export interface SearchSuggestion {
  id: string
  kind: 'clip' | 'live' | 'channel'
  /** Where picking it goes. */
  to: string
  label: string
  /** Secondary line — channel + views, or the channel's own stats. */
  hint: string
  image: string | null
}

/**
 * Search results → dropdown rows, videos before channels (same order the
 * results page uses, so the two never disagree about what "first" means).
 */
export function toSuggestions(results: SearchResults | undefined): SearchSuggestion[] {
  if (!results) return []

  return [
    ...results.videos.map((video) => ({
      id: `${video.kind}:${video.id}`,
      kind: video.kind,
      to: `/watch/${encodeURIComponent(video.slug)}`,
      label: video.title,
      hint: `${video.channel} · ${video.meta}`,
      image: video.image
    })),
    ...results.channels.map((channel) => ({
      id: `channel:${channel.handle}`,
      kind: 'channel' as const,
      to: toChannelPath(channel.handle),
      label: channel.name,
      hint: channel.isLive
        ? 'Live now'
        : `${formatCount(channel.followerCount)} followers · ${channel.clipCount} videos`,
      image: channel.avatarUrl
    }))
  ]
}

/** The `/search` URL for a typed query. Empty queries stay on the results page. */
export function toSearchPath(query: string): string {
  return `/search?q=${encodeURIComponent(query.trim())}`
}
