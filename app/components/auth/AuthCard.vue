<script setup lang="ts">
defineProps<{ title: string; subtitle: string }>()
</script>

<template>
  <div class="flex min-h-dvh items-center justify-center bg-background px-4 py-16">
    <div class="w-full max-w-sm">
      <NuxtLink
        to="/"
        class="mb-8 flex items-center justify-center gap-2 text-lg font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
      >
        <span class="inline-block h-6 w-6 rounded-md bg-primary" aria-hidden="true" />
        Streamify
      </NuxtLink>

      <Reveal>
        <div class="rounded-xl border border-border bg-card p-8 shadow-lg">
          <h1 class="text-xl font-semibold text-foreground">{{ title }}</h1>
          <p class="mt-1 text-sm text-muted-foreground">{{ subtitle }}</p>
          <div class="mt-6">
            <slot />
          </div>
        </div>
      </Reveal>

      <p class="mt-6 text-center text-sm text-muted-foreground">
        <slot name="footer" />
      </p>
    </div>
  </div>
</template>
