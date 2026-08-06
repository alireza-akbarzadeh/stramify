import { usePreferredReducedMotion } from '@vueuse/core'

/** Eases a number from 0 → `to` once `start()` is called. */
export function useCountUp(to: number, duration = 1600) {
  const current = ref(0)
  const reduced = usePreferredReducedMotion()
  let raf = 0

  function start() {
    if (reduced.value === 'reduce') return (current.value = to)
    const began = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - began) / duration, 1)
      // easeOutExpo — fast out of the gate, long settle. Matches the
      // cubic-bezier(0.16,1,0.3,1) easing used across the rest of the UI.
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      current.value = to * eased
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
  }

  onUnmounted(() => cancelAnimationFrame(raf))

  return { current, start }
}
