// @vitest-environment nuxt
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import type { RelatedItem } from '#shared/types/watch'
import WatchUpNextCard from './WatchUpNextCard.vue'

const clip: RelatedItem = {
  id: 'clip-triple-kill',
  slug: 'clip-triple-kill',
  kind: 'clip',
  title: 'The Perfect Triple-Kill Flank',
  channel: 'GhostOperator',
  image: 'https://picsum.photos/seed/triple-kill/960/540',
  videoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
  meta: '14.2k views · 2h ago',
  duration: '00:33'
}

const live: RelatedItem = {
  id: 'live-neon-drift',
  slug: 'Neon_Drift',
  kind: 'live',
  title: 'Touge runs until the tires give up',
  channel: 'Neon_Drift',
  image: 'https://picsum.photos/seed/neon-drift/960/540',
  videoUrl: 'https://media.w3.org/2010/05/video/movie_300.mp4',
  meta: '1.8k watching'
}

describe('WatchUpNextCard', () => {
  it('renders the title, channel and meta line', async () => {
    const wrapper = await mountSuspended(WatchUpNextCard, { props: { item: clip, saved: false } })
    expect(wrapper.text()).toContain(clip.title)
    expect(wrapper.text()).toContain('GhostOperator')
    expect(wrapper.text()).toContain('14.2k views · 2h ago')
  })

  it('links to the watch route using the slug, not the id', async () => {
    const wrapper = await mountSuspended(WatchUpNextCard, { props: { item: live, saved: false } })
    expect(wrapper.find('a').attributes('href')).toBe('/watch/Neon_Drift')
  })

  it('shows a duration chip for clips and a live badge for streams', async () => {
    const asClip = await mountSuspended(WatchUpNextCard, { props: { item: clip, saved: false } })
    expect(asClip.text()).toContain('00:33')
    expect(asClip.text()).not.toContain('Live')

    const asLive = await mountSuspended(WatchUpNextCard, { props: { item: live, saved: false } })
    expect(asLive.text()).toContain('Live')
  })

  it('emits toggle-save when the save button is pressed', async () => {
    const wrapper = await mountSuspended(WatchUpNextCard, { props: { item: clip, saved: false } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('toggle-save')).toHaveLength(1)
  })
})
