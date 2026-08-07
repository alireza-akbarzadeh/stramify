// @vitest-environment nuxt
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import type { ChannelListItem } from '#shared/types/channel'
import ChannelDirectoryCard from './ChannelDirectoryCard.vue'

const channel: ChannelListItem = {
  handle: 'canvas_queen',
  name: 'Canvas Queen',
  tagline: 'Illustration, inks and long finishing passes.',
  avatarUrl: 'https://picsum.photos/seed/canvas_queen-avatar/200/200',
  bannerUrl: null,
  verified: true,
  followerCount: 1240,
  totalViews: '31.8k',
  clipCount: 2,
  categories: ['Creative'],
  isLive: false,
  liveTitle: null,
  previewImage: 'https://picsum.photos/seed/rendering-details/960/540',
  isFollowing: false
}

describe('ChannelDirectoryCard', () => {
  it('renders the identity, handle and formatted stats', async () => {
    const wrapper = await mountSuspended(ChannelDirectoryCard, { props: { channel } })
    expect(wrapper.text()).toContain('Canvas Queen')
    expect(wrapper.text()).toContain('@canvas_queen')
    // Raw 1240 followers, formatted the same way the server formats views.
    expect(wrapper.text()).toContain('1.2k')
    expect(wrapper.text()).toContain('31.8k')
  })

  it('links to the channel page', async () => {
    const wrapper = await mountSuspended(ChannelDirectoryCard, { props: { channel } })
    expect(wrapper.find('a').attributes('href')).toBe('/channel/canvas_queen')
  })

  it('shows the live title instead of the tagline while the channel is live', async () => {
    const wrapper = await mountSuspended(ChannelDirectoryCard, {
      props: {
        channel: { ...channel, isLive: true, liveTitle: 'Finishing the cover commission' }
      }
    })
    expect(wrapper.text()).toContain('Finishing the cover commission')
    expect(wrapper.text()).not.toContain(channel.tagline)
    expect(wrapper.text()).toContain('Live')
  })

  it('reflects follow state on the button and emits a toggle', async () => {
    const wrapper = await mountSuspended(ChannelDirectoryCard, { props: { channel } })
    const button = wrapper.find('button')
    expect(button.text()).toContain('Follow')
    expect(button.attributes('aria-pressed')).toBe('false')

    await button.trigger('click')
    expect(wrapper.emitted('follow')).toHaveLength(1)

    const following = await mountSuspended(ChannelDirectoryCard, {
      props: { channel: { ...channel, isFollowing: true } }
    })
    expect(following.find('button').attributes('aria-pressed')).toBe('true')
    expect(following.find('button').text()).toContain('Following')
  })
})
