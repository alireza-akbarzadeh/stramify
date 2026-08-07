import type { MaybeRefOrGetter, Ref } from 'vue'

/**
 * Grow a textarea to fit its content instead of scrolling inside a fixed box.
 *
 * Height is reset to `auto` before reading `scrollHeight` — without that the
 * element can only ever grow, because `scrollHeight` reports the current
 * (already expanded) height once one has been set.
 */
export function useAutoGrow(
  field: Readonly<Ref<HTMLTextAreaElement | null>>,
  value: MaybeRefOrGetter<string>,
  max = 320
) {
  watch(
    () => toValue(value),
    async () => {
      await nextTick()
      const el = field.value
      if (!el) return
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, max)}px`
    },
    { immediate: true }
  )
}
