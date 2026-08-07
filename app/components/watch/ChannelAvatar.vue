<script setup lang="ts">
import { cn } from '@/lib/utils'

/**
 * Avatar for a channel, comment author, or chat author. There is no avatar
 * column on any table yet, so this falls back to an initial on a hue derived
 * from the name — deterministic, so the same person is the same colour
 * everywhere. Pass `image` once real avatars exist and it wins.
 */
const props = withDefaults(
  defineProps<{ name: string; image?: string | null; class?: string }>(),
  { image: null, class: undefined }
)

const initial = computed(() => props.name.trim().charAt(0).toUpperCase() || '?')

/** Sum of char codes → hue. Cheap and stable; collisions are cosmetic only. */
const hue = computed(() => {
  let total = 0
  for (const char of props.name) total += char.charCodeAt(0)
  return total % 360
})
</script>

<template>
  <img
    v-if="image"
    :src="image"
    :alt="`${name} avatar`"
    :class="cn('size-10 shrink-0 rounded-full object-cover', props.class)"
  />
  <span
    v-else
    :class="
      cn(
        'grid size-10 shrink-0 select-none place-items-center rounded-full text-sm font-bold text-white',
        props.class
      )
    "
    :style="{
      backgroundImage: `linear-gradient(135deg, oklch(0.62 0.19 ${hue}), oklch(0.52 0.21 ${(hue + 40) % 360}))`
    }"
    aria-hidden="true"
  >
    {{ initial }}
  </span>
</template>
