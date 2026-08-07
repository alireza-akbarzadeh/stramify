import type { MaybeRefOrGetter } from 'vue'

/**
 * A roving highlight over a list rendered as a listbox.
 *
 * `-1` means "nothing highlighted" — the state a freshly opened dropdown is
 * in, where Enter should run what the user typed rather than pick a row for
 * them. Movement wraps at both ends, and the highlight resets whenever the
 * list changes length, because row 4 of the previous results is not row 4 of
 * these ones.
 */
export function useListCursor(length: MaybeRefOrGetter<number>) {
  const size = computed(() => toValue(length))
  const index = ref(-1)

  watch(size, () => (index.value = -1))

  function move(delta: number) {
    if (size.value === 0) return
    // From "nothing highlighted", down lands on the first row and up on the
    // last — arithmetic from -1 would skip one at each end.
    if (index.value < 0) {
      index.value = delta > 0 ? 0 : size.value - 1
      return
    }
    const next = index.value + delta
    index.value = ((next % size.value) + size.value) % size.value
  }

  function reset() {
    index.value = -1
  }

  return { index, move, reset }
}
