import { describe, expect, it } from 'vitest'
import {
  CATEGORY_DESCRIPTIONS,
  CLIP_CATEGORIES,
  fromCategorySlug,
  toCategorySlug
} from './category'

describe('category slugs', () => {
  it('maps every enum value to a lowercase slug and back', () => {
    for (const category of CLIP_CATEGORIES) {
      expect(fromCategorySlug(toCategorySlug(category))).toBe(category)
    }
  })

  it('produces pretty slugs', () => {
    expect(toCategorySlug('Music')).toBe('music')
    expect(toCategorySlug('Creative')).toBe('creative')
  })

  it('accepts mixed-case slugs', () => {
    expect(fromCategorySlug('GAMING')).toBe('Gaming')
  })

  it('returns null for unknown slugs', () => {
    expect(fromCategorySlug('podcasts')).toBeNull()
    expect(fromCategorySlug('')).toBeNull()
  })

  it('has editorial copy for every category', () => {
    for (const category of CLIP_CATEGORIES) {
      expect(CATEGORY_DESCRIPTIONS[category].length).toBeGreaterThan(0)
    }
  })
})
