<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core'
import { motion } from 'motion-v'

const props = withDefaults(
  defineProps<{
    /** Pixels to travel in on reveal. */
    distance?: number
    /** Stagger delay in seconds, for lists of Reveal siblings. */
    delay?: number
  }>(),
  { distance: 24, delay: 0 }
)

const reducedMotion = usePreferredReducedMotion()
</script>

<template>
  <component
    :is="reducedMotion === 'reduce' ? 'div' : motion.div"
    :initial="{ opacity: 0, y: props.distance }"
    :while-in-view="{ opacity: 1, y: 0 }"
    :viewport="{ once: true, margin: '-80px' }"
    :transition="{ duration: 0.5, delay: props.delay, ease: 'easeOut' }"
  >
    <slot />
  </component>
</template>
