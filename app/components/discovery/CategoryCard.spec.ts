// @vitest-environment nuxt
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import type { CategorySummary } from '#shared/types/discovery'
import CategoryCard from './CategoryCard.vue'

const category: CategorySummary = {
  slug: 'music',
  name: 'Music',
  description: 'Live sets, unreleased tracks, and late-night studio sessions.',
  clipCount: 2,
  totalViews: '21.3k',
  previewImage: 'https://picsum.photos/seed/music/960/540'
}

describe('CategoryCard', () => {
  it('renders the name, description, counts and preview image', async () => {
    const wrapper = await mountSuspended(CategoryCard, { props: { category } })
    expect(wrapper.text()).toContain('Music')
    expect(wrapper.text()).toContain(category.description)
    expect(wrapper.text()).toContain('2 clips')
    expect(wrapper.text()).toContain('21.3k views')
    expect(wrapper.find('img').attributes('src')).toBe(category.previewImage)
  })

  it('links to the category detail route', async () => {
    const wrapper = await mountSuspended(CategoryCard, { props: { category } })
    expect(wrapper.find('a').attributes('href')).toBe('/category/music')
  })

  it('singularises the clip count', async () => {
    const wrapper = await mountSuspended(CategoryCard, {
      props: { category: { ...category, clipCount: 1 } }
    })
    expect(wrapper.text()).toContain('1 clip')
    expect(wrapper.text()).not.toContain('1 clips')
  })

  it('falls back to a placeholder when a category has no clips', async () => {
    const wrapper = await mountSuspended(CategoryCard, {
      props: { category: { ...category, clipCount: 0, previewImage: null } }
    })
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('0 clips')
  })
})
