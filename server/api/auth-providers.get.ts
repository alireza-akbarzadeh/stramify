import { SOCIAL_PROVIDERS, configuredProviders } from '../utils/auth'

/**
 * The sign-in UI renders every provider in `all` but disables the ones missing
 * credentials, so a half-configured deployment shows an honest "not available
 * yet" instead of bouncing the user into a broken OAuth redirect.
 */
export default defineEventHandler(() => ({
  all: SOCIAL_PROVIDERS,
  configured: configuredProviders
}))
