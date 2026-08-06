<script setup lang="ts">
defineProps<{ eyebrow?: string; title: string; subtitle?: string; align?: 'center' | 'left' }>()
</script>

<template>
  <div :class="['max-w-2xl', align === 'left' ? '' : 'mx-auto text-center']">
    <p v-if="eyebrow" class="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
      {{ eyebrow }}
    </p>
    <h2 class="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
      {{ title }}
    </h2>
    <p v-if="subtitle" class="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
      {{ subtitle }}
    </p>
  </div>
</template>
