<script setup lang="ts">
/**
 * Wraps a control in a Vidstack tooltip. The trigger slot takes the actual
 * `media-*-button` — Vidstack handles show/hide timing, placement and the
 * `aria-describedby` wiring, so this is presentation only.
 */
defineProps<{ label: string; placement?: string }>()
</script>

<template>
  <media-tooltip>
    <media-tooltip-trigger>
      <slot />
    </media-tooltip-trigger>
    <media-tooltip-content class="player-tooltip" :placement="placement ?? 'top center'">
      {{ label }}
    </media-tooltip-content>
  </media-tooltip>
</template>
