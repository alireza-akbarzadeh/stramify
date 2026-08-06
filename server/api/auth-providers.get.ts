import { enabledSocialProviders } from '../utils/auth'

/**
 * Lets the sign-in UI render only providers that are actually configured,
 * rather than showing buttons that would fail on click.
 */
export default defineEventHandler(() => ({ providers: enabledSocialProviders }))
