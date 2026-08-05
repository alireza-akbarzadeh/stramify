import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

/**
 * Connection is lazy — postgres.js only opens a socket on the first query,
 * so booting the app without a reachable database (e.g. local dev before
 * `docker compose up`) doesn't crash the server, only queries that run.
 */
const queryClient = postgres(process.env.DATABASE_URL ?? '', { max: 10 })

export const db = drizzle(queryClient, { schema })
