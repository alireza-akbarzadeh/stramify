import type { ChannelListItem } from './channel'
import type { RelatedItem } from './watch'

/**
 * What one query turns up, in the two buckets the UI groups by.
 *
 * `videos` deliberately mixes VODs and live sessions into the existing
 * `RelatedItem` shape — the same thing the watch page's up-next rail renders,
 * so the search results reuse `WatchUpNextCard` instead of growing a parallel
 * card. `kind` distinguishes them and drives the live badge.
 */
export interface SearchResults {
  /**
   * Echoed back. Suggestions are fetched per keystroke, so the dropdown checks
   * this to make sure it isn't rendering the answer to an older query.
   */
  query: string
  videos: RelatedItem[]
  channels: ChannelListItem[]
}

/** Max suggestions in the header dropdown — enough to be useful, short enough to scan. */
export const SEARCH_SUGGESTION_LIMIT = 8
