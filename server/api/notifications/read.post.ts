import { markNotificationsRead, readNotifications } from '../../utils/notifications'
import { requireUser } from '../../utils/session'
import type { NotificationFeed } from '#shared/types/notification'

/**
 * Mark everything currently in the feed as seen. Returns the refreshed feed so
 * the dropdown doesn't need a second round trip to drop its badge.
 */
export default defineEventHandler(async (event): Promise<NotificationFeed> => {
  const user = await requireUser(event)
  await markNotificationsRead(user.id)
  return readNotifications(user.id)
})
