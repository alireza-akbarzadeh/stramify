import { readNotifications } from '../../utils/notifications'
import { requireUser } from '../../utils/session'
import type { NotificationFeed } from '#shared/types/notification'

/** The signed-in user's follow activity. 401 when signed out — it's personal. */
export default defineEventHandler(async (event): Promise<NotificationFeed> => {
  const user = await requireUser(event)
  return readNotifications(user.id)
})
