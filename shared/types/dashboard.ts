import type { ClipCategory } from './discovery'

/**
 * Dashboard wire shapes.
 *
 * Every number here is a real aggregation over a real table — there is no
 * placeholder metric in this file. Where the platform genuinely doesn't
 * record something (watch time, retention, unique viewers), the field is
 * simply absent rather than estimated; see `docs/dashboard.md`.
 */

/**
 * A creator-side metric. `value` is pre-formatted for display (`"12.4k"`),
 * `raw` is the honest integer so the client can sort or chart without
 * re-parsing a humanized string.
 */
export interface DashboardMetric {
  key: string
  label: string
  value: string
  raw: number
  /** One-line explanation of exactly what was counted, shown as a tooltip/hint. */
  hint: string
}

/**
 * The signed-in user's channel, resolved by handle.
 *
 * There is no `channels` table and no `clips.user_id` (ADR-014), so channel
 * ownership is the handle itself: `user.name` matched case-insensitively
 * against `clips.creator` / `live_streams.streamer_name`. When nothing
 * matches, `exists` is false and the UI shows a real "no channel yet" state
 * instead of zeroes dressed up as data.
 */
export interface CreatorOverview {
  handle: string
  exists: boolean
  /** True when a row in `live_streams` currently carries this handle. */
  isLive: boolean
  /** Slug to the live session, present only while `isLive`. */
  liveSlug: string | null
  metrics: DashboardMetric[]
}

/** What the signed-in user has done as a viewer. All scoped by `user.id`. */
export interface ViewerActivity {
  metrics: DashboardMetric[]
}

/** Platform-wide numbers, identical for every signed-in user. */
export interface PlatformPulse {
  liveChannels: number
  /** Sum of `live_streams.viewer_count` — seeded values today (ADR-013). */
  viewersNow: string
  totalClips: number
  /** Category with the most clips, or null when there are no clips at all. */
  busiestCategory: ClipCategory | null
}

export interface DashboardOverview {
  creator: CreatorOverview
  viewer: ViewerActivity
  platform: PlatformPulse
}

/** How far back an analytics query looks. */
export type AnalyticsRange = '7d' | '30d' | '90d'

/** One day of a time series. `date` is `YYYY-MM-DD` (UTC). */
export interface TrendPoint {
  date: string
  value: number
}

/**
 * A named series plus its own total, so a chart legend doesn't have to sum
 * the points itself.
 */
export interface TrendSeries {
  key: string
  label: string
  points: TrendPoint[]
  total: number
}

/** One row of the top-clips table. */
export interface ClipPerformance {
  id: string
  title: string
  category: ClipCategory
  /** Pre-formatted, e.g. `"12.4k"`. */
  views: string
  rawViews: number
  likes: number
  comments: number
  /** Pre-formatted relative publish date, e.g. `"3h ago"`. */
  publishedAt: string
}

/** Share of a channel's clips in one category. */
export interface CategoryShare {
  category: ClipCategory
  clips: number
  /** 0-100, rounded. Shares sum to 100 when the channel has any clips. */
  percent: number
}

export interface DashboardAnalytics {
  handle: string
  exists: boolean
  range: AnalyticsRange
  /** New followers per day, from `follows.created_at`. */
  followers: TrendSeries
  /** Comments + reactions per day on this channel's clips. */
  engagement: TrendSeries
  topClips: ClipPerformance[]
  categoryMix: CategoryShare[]
}
