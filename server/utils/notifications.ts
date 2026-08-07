import { desc, eq, inArray, sql } from 'drizzle-orm'
import { db } from '../db/client'
import { clips, follows, liveStreams, notificationReads } from '../db/schema'
import { formatAge } from './format'
import { toChannelHandle } from '#shared/utils/channel'
import type { AppNotification, NotificationFeed } from '#shared/types/notification'

/** How many entries the bell holds. Older activity lives on `/following`. */
const FEED_LIMIT = 20

/**
 * An event before it's been told whether it's unread. `at` is kept as a `Date`
 * so the two sources can be merged in one chronological order before either is
 * formatted for display.
 */
type Event = Omit<AppNotification, 'unread' | 'age'> & { at: Date }

/** Handles the user follows, canonicalised the way every other join does it. */
async function followedHandles(userId: string): Promise<string[]> {
  const rows = await db
    .select({ channel: follows.channel })
    .from(follows)
    .where(eq(follows.userId, userId))

  return [...new Set(rows.map((row) => toChannelHandle(row.channel)))]
}

async function liveEvents(handles: string[]): Promise<Event[]> {
  const rows = await db
    .select()
    .from(liveStreams)
    .where(inArray(sql`lower(${liveStreams.streamerName})`, handles))
    .orderBy(desc(liveStreams.startedAt))
    .limit(FEED_LIMIT)

  return rows.map((row) => ({
    id: `live:${row.id}`,
    kind: 'live' as const,
    channel: row.streamerName,
    title: row.title,
    image: row.thumbnailUrl,
    slug: row.streamerName,
    at: row.startedAt
  }))
}

async function uploadEvents(handles: string[]): Promise<Event[]> {
  const rows = await db
    .select()
    .from(clips)
    .where(inArray(sql`lower(${clips.creator})`, handles))
    .orderBy(desc(clips.createdAt))
    .limit(FEED_LIMIT)

  return rows.map((row) => ({
    id: `upload:${row.id}`,
    kind: 'upload' as const,
    channel: row.creator,
    title: row.title,
    image: row.thumbnailUrl,
    slug: row.id,
    at: row.createdAt
  }))
}

/** The user's read cursor, or `null` if they've never cleared the bell. */
async function readCursor(userId: string): Promise<Date | null> {
  const [row] = await db
    .select({ readAt: notificationReads.readAt })
    .from(notificationReads)
    .where(eq(notificationReads.userId, userId))
    .limit(1)

  return row?.readAt ?? null
}

/**
 * What the bell shows: recent activity from the channels this user follows,
 * newest first, with everything after their last "mark all read" flagged.
 *
 * A user who follows nobody gets an empty feed rather than a global one —
 * this is a follow feed, not a firehose.
 */
export async function readNotifications(userId: string): Promise<NotificationFeed> {
  const handles = await followedHandles(userId)
  if (handles.length === 0) return { items: [], unreadCount: 0 }

  const [live, uploads, cursor] = await Promise.all([
    liveEvents(handles),
    uploadEvents(handles),
    readCursor(userId)
  ])

  const items = [...live, ...uploads]
    .sort((a, b) => b.at.getTime() - a.at.getTime())
    .slice(0, FEED_LIMIT)
    .map(({ at, ...event }) => ({
      ...event,
      age: formatAge(at),
      unread: !cursor || at > cursor
    }))

  return { items, unreadCount: items.filter((item) => item.unread).length }
}

/** Clear the bell: everything up to now counts as seen. */
export async function markNotificationsRead(userId: string): Promise<void> {
  const readAt = new Date()
  await db
    .insert(notificationReads)
    .values({ userId, readAt })
    .onConflictDoUpdate({ target: notificationReads.userId, set: { readAt } })
}
