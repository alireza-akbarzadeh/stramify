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
 *
 * `relative` is load-bearing: the channel page and directory card lift the
 * avatar over their banner with a negative margin, and a banner is a positioned
 * box. Positioned boxes paint above static ones whatever the DOM order, so
 * without this the banner covers the overlapping half of the avatar. Being
 * positioned itself puts the avatar back in tree order — last, so on top. It
 * adds no offset, so layout elsewhere is unchanged.
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
    :class="cn('relative size-10 shrink-0 rounded-full object-cover', props.class)"
  />
  <span
    v-else
    :class="
      cn(
        'relative grid size-10 shrink-0 select-none place-items-center rounded-full text-sm font-bold text-white',
        props.class
      )
    "
    :style="{ backgroundImage: channelGradient(name) }"
    aria-hidden="true"
  >
    {{ initial }}
  </span>
</template>
