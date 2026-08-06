import { useWindowScroll } from '@vueuse/core'

/** Solidifies the header past a threshold and hides it while scrolling down. */
export function useScrollHeader(threshold = 24) {
  const { y } = useWindowScroll()
  const scrolled = computed(() => y.value > threshold)
  const hidden = ref(false)
  let last = 0

  watch(y, (value) => {
    hidden.value = value > 240 && value > last
    last = value
  })

  return { scrolled, hidden }
}
