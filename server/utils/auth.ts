import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../db/client'
import * as schema from '../db/schema'
import { dash } from "@better-auth/infra";

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
  baseURL: process.env.PUBLIC_APP_URL || 'http://localhost:3000',
  emailAndPassword: {
    enabled: true
  },
  plugins:[dash()]
})
