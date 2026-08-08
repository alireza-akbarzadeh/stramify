<script setup lang="ts">
import { cn } from '@/lib/utils'

/**
 * The signed-in user's picture, falling back to the first letter of their name.
 * Sizing is the caller's (`class="size-8"`), because the same avatar appears at
 * three scales — header trigger, menu identity block, sidebar button.
 */
const props = defineProps<{ class?: string }>()

const { user, initial } = useAccountMenu()
</script>

<template>
  <span
    :class="
      cn(
        'grid shrink-0 place-items-center overflow-hidden rounded-full bg-surface-2 font-semibold text-foreground',
        props.class
      )
    "
  >
    <img
      v-if="user?.image"
      :src="user.image"
      :alt="user.name || ''"
      class="size-full object-cover"
    >
    <span v-else>{{ initial }}</span>
  </span>
</template>
