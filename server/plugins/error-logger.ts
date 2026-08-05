import { logger } from '../utils/logger'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', (error, { event } = {}) => {
    const statusCode = (error as { statusCode?: number }).statusCode ?? 500
    // A 404/other 4xx is expected user behavior, not an operational problem —
    // logging it at `error` would drown real 5xx failures out in production.
    const level = statusCode >= 500 ? 'error' : 'warn'
    logger[level]({ err: error, path: event?.path, statusCode }, 'Server error')
  })
})
