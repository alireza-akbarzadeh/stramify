<script setup lang="ts">
withDefaults(defineProps<{ to?: string }>(), { to: '/' })
</script>

<template>
  <NuxtLink
    :to="to"
    class="group flex items-center gap-2.5 rounded-md text-[17px] font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <span class="relative grid size-7 place-items-center" aria-hidden="true">
      <span class="absolute inset-0 rounded-[9px] bg-gradient-to-br from-primary to-secondary" />
      <span class="absolute inset-0 rounded-[9px] bg-primary/50 blur-md transition-opacity duration-300 group-hover:opacity-80" />
      <svg viewBox="0 0 24 24" fill="none" class="relative size-3.5 text-white">
        <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
      </svg>
    </span>
    Streamify
  </NuxtLink>
</template>
