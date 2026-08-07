import type { AnalyticsRange, TrendPoint, TrendSeries } from '../types/dashboard'

/**
 * Time-series helpers for the dashboard, kept pure and free of Drizzle so
 * they can be unit-tested without a database.
 *
 * The database only returns days that actually had rows. A chart needs every
 * day in the window, including the zeroes — otherwise a quiet week renders as
 * a straight line between two distant points and reads like growth. Filling
 * happens here, once, rather than in each endpoint.
 */

export const ANALYTICS_RANGES = ['7d', '30d', '90d'] as const satisfies readonly AnalyticsRange[]

const RANGE_DAYS: Record<AnalyticsRange, number> = { '7d': 7, '30d': 30, '90d': 90 }

export function rangeToDays(range: AnalyticsRange): number {
  return RANGE_DAYS[range]
}

/** UTC calendar day as `YYYY-MM-DD`. UTC, not local, so the server and the
 * browser bucket a row into the same day regardless of the viewer's zone. */
export function toIsoDay(value: Date | string): string {
  const date = typeof value === 'string' ? new Date(value) : value
  return date.toISOString().slice(0, 10)
}

/** The last `days` UTC days ending today, oldest first. */
export function dayWindow(days: number, now: Date = new Date()): string[] {
  const end = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  return Array.from({ length: days }, (_, i) =>
    new Date(end - (days - 1 - i) * 86_400_000).toISOString().slice(0, 10)
  )
}

/**
 * Sparse `{ day, value }` rows → a dense point per day in the window.
 * Rows outside the window are ignored; days with no row become 0.
 */
export function fillDailySeries(
  rows: Array<{ day: Date | string; value: number }>,
  days: number,
  now: Date = new Date()
): TrendPoint[] {
  const counts = new Map<string, number>()
  for (const row of rows) {
    const key = toIsoDay(row.day)
    counts.set(key, (counts.get(key) ?? 0) + row.value)
  }
  return dayWindow(days, now).map((date) => ({ date, value: counts.get(date) ?? 0 }))
}

/** Point-wise sum of two series that share a window — e.g. comments + reactions. */
export function addSeries(a: TrendPoint[], b: TrendPoint[]): TrendPoint[] {
  const other = new Map(b.map((point) => [point.date, point.value]))
  return a.map((point) => ({ date: point.date, value: point.value + (other.get(point.date) ?? 0) }))
}

export function sumPoints(points: TrendPoint[]): number {
  return points.reduce((total, point) => total + point.value, 0)
}

export function toSeries(key: string, label: string, points: TrendPoint[]): TrendSeries {
  return { key, label, points, total: sumPoints(points) }
}

/**
 * Percentage shares that add up to exactly 100 when the total is non-zero.
 * Naive per-item rounding drifts (three thirds render as 33/33/33), so the
 * largest share absorbs the rounding remainder.
 */
export function toPercentShares(values: number[]): number[] {
  const total = values.reduce((sum, value) => sum + value, 0)
  if (total === 0) return values.map(() => 0)

  const shares = values.map((value) => Math.round((value / total) * 100))
  const drift = 100 - shares.reduce((sum, share) => sum + share, 0)
  if (drift !== 0) {
    const largest = shares.indexOf(Math.max(...shares))
    shares[largest] = (shares[largest] ?? 0) + drift
  }
  return shares
}
