import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { twoFactor } from 'better-auth/plugins'
import { dash } from '@better-auth/infra'
import { db } from '../db/client'
import * as schema from '../db/schema'
import { sendMail } from './mailer'

const appUrl = process.env.PUBLIC_APP_URL || 'http://localhost:3000'

/** Only register a provider when its credentials actually exist. */
function socialProviders() {
  const providers: Record<string, { clientId: string; clientSecret: string }> = {}
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.google = {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  }
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    providers.github = {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }
  }
  return providers
}

/**
 * Database-backed sessions (ADR-007) — a ban/role change takes effect on
 * the next request, not after a signed cookie expires.
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: appUrl,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      await sendMail({
        to: user.email,
        subject: 'Reset your Streamify password',
        text: `Reset your password: ${url}\n\nIf you didn't request this, you can ignore this email.`
      })
    }
  },
  socialProviders: socialProviders(),
  plugins: [twoFactor({ issuer: 'Streamify' }), dash()]
})

/** Which social providers are configured — the UI hides the rest. */
export const enabledSocialProviders = Object.keys(socialProviders())
