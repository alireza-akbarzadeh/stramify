<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core'

const props = withDefaults(defineProps<{ strength?: number }>(), { strength: 0.3 })

const el = ref<HTMLElement | null>(null)
const offset = ref({ x: 0, y: 0 })
const reduced = usePreferredReducedMotion()

function onMove(event: MouseEvent) {
  if (reduced.value === 'reduce' || !el.value) return
  const box = el.value.getBoundingClientRect()
  offset.value = {
    x: (event.clientX - (box.left + box.width / 2)) * props.strength,
    y: (event.clientY - (box.top + box.height / 2)) * props.strength
  }
}

const reset = () => (offset.value = { x: 0, y: 0 })
</script>

<template>
  <div
    ref="el"
    class="inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
    :style="{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }"
    @mousemove="onMove"
    @mouseleave="reset"
  >
    <slot />
  </div>
</template>
