import { createAuthClient } from 'better-auth/vue'
import { twoFactorClient } from 'better-auth/client/plugins'

// No baseURL — defaults to same-origin, correct for both dev and prod.
export const authClient = createAuthClient({
  plugins: [twoFactorClient()]
})
