/** Why a notification exists. Drives its icon and its verb. */
export type NotificationKind = 'live' | 'upload'

/**
 * One entry in the bell dropdown.
 *
 * Derived, never stored — a followed channel going live or publishing a clip
 * *is* the notification (see `server/utils/notifications.ts`). `id` is stable
 * because it's built from the row that caused it, so re-fetching doesn't
 * reshuffle the list or duplicate anything.
 */
export interface AppNotification {
  id: string
  kind: NotificationKind
  /** Channel handle, in its own casing — e.g. `Canvas_Queen`. */
  channel: string
  /** Title of the stream or clip. */
  title: string
  image: string
  /** Watch-page slug: the clip id, or the channel handle for a live session. */
  slug: string
  /** Pre-formatted relative time, e.g. `"3h ago"`. */
  age: string
  /** Newer than the viewer's last "mark all read". */
  unread: boolean
}

export interface NotificationFeed {
  items: AppNotification[]
  unreadCount: number
}
