import { logger } from '../utils/logger'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', (error, { event } = {}) => {
    logger.error({ err: error, path: event?.path }, 'Unhandled server error')
  })
})
