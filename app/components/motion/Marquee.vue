<script setup lang="ts">
withDefaults(defineProps<{ duration?: number }>(), { duration: 40 })
</script>

<template>
  <div class="group relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
    <!-- Track is duplicated so the -50% translate loops seamlessly. aria-hidden
         on the clone keeps screen readers from reading the list twice. -->
    <div
      class="flex shrink-0 animate-[marquee_var(--marquee-duration)_linear_infinite] items-center gap-14 pr-14 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
      :style="{ '--marquee-duration': `${duration}s` }"
    >
      <slot />
    </div>
    <div
      class="flex shrink-0 animate-[marquee_var(--marquee-duration)_linear_infinite] items-center gap-14 pr-14 group-hover:[animation-play-state:paused] motion-reduce:animate-none"
      :style="{ '--marquee-duration': `${duration}s` }"
      aria-hidden="true"
    >
      <slot />
    </div>
  </div>
</template>
