<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    /** Pixels to travel in on reveal. */
    distance?: number
    /** Stagger delay in seconds, for sibling Reveals. */
    delay?: number
  }>(),
  { distance: 24, delay: 0 }
)

const el = ref<HTMLElement | null>(null)
const shown = ref(false)

const { stop } = useIntersectionObserver(
  el,
  ([entry]) => {
    if (!entry?.isIntersecting) return
    shown.value = true
    stop()
  },
  { rootMargin: '0px 0px -80px 0px' }
)
</script>

<template>
  <!--
    CSS transition rather than motion-v: this wraps nearly every section, so it
    has to be SSR-safe and cheap. `motion-reduce:` drops the transform entirely
    for prefers-reduced-motion (PROMPT.md §17), and content is always in the DOM
    so it stays readable/crawlable even if the observer never fires.
  -->
  <div
    ref="el"
    class="transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:translate-y-0! motion-reduce:opacity-100! motion-reduce:transition-none"
    :style="{
      opacity: shown ? 1 : 0,
      transform: shown ? 'translateY(0)' : `translateY(${props.distance}px)`,
      transitionDelay: `${props.delay}s`
    }"
  >
    <slot />
  </div>
</template>
