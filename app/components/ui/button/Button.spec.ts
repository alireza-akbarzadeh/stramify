import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { Button } from '.'

describe('Button', () => {
  it('renders slot content', async () => {
    const wrapper = await mountSuspended(Button, { slots: { default: () => 'Start streaming' } })
    expect(wrapper.text()).toBe('Start streaming')
  })

  it('renders as a native button by default', async () => {
    const wrapper = await mountSuspended(Button)
    expect(wrapper.element.tagName).toBe('BUTTON')
  })

  it('applies the destructive variant class', async () => {
    const wrapper = await mountSuspended(Button, { props: { variant: 'destructive' } })
    expect(wrapper.classes()).toContain('bg-destructive')
  })
})
