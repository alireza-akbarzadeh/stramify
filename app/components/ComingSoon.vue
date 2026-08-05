<script setup lang="ts">
defineProps<{ title: string; description: string }>()
</script>

<template>
  <div class="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
    <Reveal>
      <p class="text-sm font-medium text-primary">Coming soon</p>
      <h1 class="mt-2 text-3xl font-semibold text-foreground">{{ title }}</h1>
      <p class="mt-3 max-w-md text-muted-foreground">{{ description }}</p>
      <NuxtLink
        to="/"
        class="mt-6 inline-block text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
      >
        Back to home
      </NuxtLink>
    </Reveal>
  </div>
</template>
