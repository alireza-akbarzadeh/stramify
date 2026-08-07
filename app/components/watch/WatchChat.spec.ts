// @vitest-environment nuxt
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it } from 'vitest'
import type { ChatMessage } from '#shared/types/watch'
import { useAuthStore } from '@/stores/auth'
import WatchChat from './WatchChat.vue'

const messages: ChatMessage[] = [
  { id: 'chat-1', authorName: 'kev', body: 'that flank was filthy', createdAt: new Date().toISOString() }
]

const base = { messages, pending: false, errored: false }

/** Whether the composer renders is read from the auth store, not a prop. */
function signIn() {
  useAuthStore().session = { user: { name: 'kev', email: 'kev@streamify.test' } }
}
function signOut() {
  useAuthStore().session = null
}

describe('WatchChat', () => {
  beforeEach(signIn)

  it('renders messages with their author', async () => {
    const wrapper = await mountSuspended(WatchChat, { props: base })
    expect(wrapper.text()).toContain('kev')
    expect(wrapper.text()).toContain('that flank was filthy')
    expect(wrapper.text()).toContain('1 message')
  })

  it('swaps the composer for a log-in prompt when signed out', async () => {
    signOut()
    const wrapper = await mountSuspended(WatchChat, { props: base })
    expect(wrapper.find('input').exists()).toBe(false)
    expect(wrapper.text()).toContain('to join the chat')
  })

  it('emits the trimmed body and clears the field on submit', async () => {
    const wrapper = await mountSuspended(WatchChat, { props: base })
    const input = wrapper.find('input')
    await input.setValue('  hello there  ')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('send')?.[0]).toEqual(['hello there'])
    expect((input.element as HTMLInputElement).value).toBe('')
  })

  it('does not emit for a whitespace-only draft', async () => {
    const wrapper = await mountSuspended(WatchChat, { props: base })
    await wrapper.find('input').setValue('   ')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('send')).toBeUndefined()
  })

  it('shows an empty state rather than a blank panel', async () => {
    const wrapper = await mountSuspended(WatchChat, { props: { ...base, messages: [] } })
    expect(wrapper.text()).toContain('No messages yet')
  })

  it('offers a reconnect action when the poll fails', async () => {
    const wrapper = await mountSuspended(WatchChat, {
      props: { ...base, errored: true, messages: [] }
    })
    expect(wrapper.text()).toContain('Chat disconnected')
  })
})
