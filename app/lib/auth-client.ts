import { createAuthClient } from 'better-auth/vue'

// No baseURL — defaults to same-origin, correct for both dev and prod.
export const authClient = createAuthClient()
