import type { CategorySlug, ClipCategory } from '../types/discovery'

/**
 * Canonical listing order — mirrors `clipCategoryEnum` in
 * `server/db/schema/clips.ts`. Categories are a fixed enum, not a table,
 * so this array is the single source of truth on both sides of the wire.
 */
export const CLIP_CATEGORIES = [
  'Music',
  'Gaming',
  'Creative'
] as const satisfies readonly ClipCategory[]

/**
 * Static editorial copy for each category. Not backend data — counts and
 * view totals always come from the live `clips` query.
 */
export const CATEGORY_DESCRIPTIONS: Record<ClipCategory, string> = {
  Music: 'Live sets, unreleased tracks, and late-night studio sessions.',
  Gaming: 'Clutch plays, speedruns, and full-lobby chaos worth rewatching.',
  Creative: 'Design, illustration, and build-along streams from the studio.'
}

/** `'Music'` → `'music'`. */
export function toCategorySlug(category: ClipCategory): CategorySlug {
  return category.toLowerCase() as CategorySlug
}

/** `'music'` → `'Music'`; `null` for anything that isn't a known category. */
export function fromCategorySlug(slug: string): ClipCategory | null {
  const match = CLIP_CATEGORIES.find((category) => toCategorySlug(category) === slug.toLowerCase())
  return match ?? null
}
