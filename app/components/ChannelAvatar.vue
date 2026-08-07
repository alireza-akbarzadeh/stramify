<script setup lang="ts">
import { cn } from '@/lib/utils'
import { channelGradient } from '@/utils/channel'

/**
 * Avatar for a channel, comment author, or chat author. Falls back to an
 * initial on a hue derived from the name — deterministic, so the same person
 * is the same colour everywhere (see `channelGradient`). Pass `image` when the
 * channel has a real avatar and it wins.
 *
 * Lives at the top level of `components/` rather than under `watch/` because
 * the watch page, the comment list, the channel page and the channel directory
 * all render the same identity.
 */
const props = withDefaults(
  defineProps<{ name: string; image?: string | null; class?: string }>(),
  { image: null, class: undefined }
)

const initial = computed(() => props.name.trim().charAt(0).toUpperCase() || '?')
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
    :style="{ backgroundImage: channelGradient(name) }"
    aria-hidden="true"
  >
    {{ initial }}
  </span>
</template>
