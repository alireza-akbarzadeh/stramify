import type {
  ChannelSummary,
  ChatMessage,
  ReactionSummary,
  RelatedItem,
  WatchComment
} from '#shared/types/watch'

/**
 * View-model props for `WatchLayout.vue`. UI-only shapes, deliberately not in
 * `#shared` — nothing crosses the wire in this form. Each panel gets its data
 * bundled with its own pending/errored flags so the layout stays presentational
 * and every section can render its own loading/empty/error state independently
 * (one slow query never blanks the whole page).
 */
export interface AsyncPanel<T> {
  items: T[]
  pending: boolean
  errored: boolean
}

export interface WatchEngagement {
  channel: ChannelSummary | null
  reactions: ReactionSummary
  saved: boolean
  reactPending: boolean
  followPending: boolean
}

export type RelatedPanel = AsyncPanel<RelatedItem>

export interface CommentsPanel extends AsyncPanel<WatchComment> {
  /** False when signed out — the composer swaps for a log-in prompt. */
  canPost: boolean
  /** Who the composer's avatar belongs to; null when signed out. */
  authorName: string | null
  authorImage: string | null
  posting: boolean
}

export interface ChatPanel extends AsyncPanel<ChatMessage> {
  /** False when signed out — the composer swaps for a log-in prompt. */
  canPost: boolean
  sending: boolean
}
