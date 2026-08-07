import {
  BarChart3,
  Bookmark,
  Clapperboard,
  Grid2x2,
  Heart,
  House,
  LayoutDashboard,
  Radio,
  Tv,
  Video
} from '@lucide/vue'
import type { Component } from 'vue'

export interface NavLink {
  label: string
  to: string
  icon: Component
  /** Short chip on the right — marks a route that's still a placeholder. */
  badge?: string
}

/**
 * The app sidebar's three groups.
 *
 * Every `to` here resolves to a page that exists. A nav is the one place a
 * dead link is unforgivable — it's the map of the product, so an entry for a
 * route that 404s is a claim the app doesn't back up (CLAUDE.md rule 2).
 * New sections get their link added at the same time as their page, not before.
 */
export const discoverLinks: NavLink[] = [
  { label: 'Home', to: '/', icon: House },
  { label: 'Live', to: '/live', icon: Radio },
  { label: 'Clips', to: '/clips', icon: Video },
  { label: 'Shorts', to: '/shorts', icon: Clapperboard, badge: 'Phase 6' },
  { label: 'Categories', to: '/category', icon: Grid2x2 },
  { label: 'Channels', to: '/channels', icon: Tv }
]

export const libraryLinks: NavLink[] = [
  { label: 'Watchlist', to: '/watchlist', icon: Bookmark },
  { label: 'Following', to: '/following', icon: Heart, badge: 'Phase 10' }
]

/** Signed-in only — every one of these routes is behind the `auth` middleware. */
export const creatorLinks: NavLink[] = [
  { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Go live', to: '/stream', icon: Radio, badge: 'Phase 7' },
  { label: 'Analytics', to: '/analytics', icon: BarChart3 }
]

/**
 * Whether a nav link is the current page. `/` matches exactly — as a prefix it
 * would light up on every route in the app.
 */
export function isNavLinkActive(to: string, path: string): boolean {
  return to === '/' ? path === to : path === to || path.startsWith(`${to}/`)
}
