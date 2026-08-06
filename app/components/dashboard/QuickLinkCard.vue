<script setup lang="ts">
import { ArrowUpRight } from '@lucide/vue'
import type { Component } from 'vue'

defineProps<{
  to: string
  icon: Component
  title: string
  description: string
  /** 'ready' links to a fully working page; 'planned' links to an honest in-progress page. */
  status: 'ready' | 'planned'
  /** Shown only when status is 'planned', e.g. "Phase 7 — Live Streaming". */
  eta?: string
}>()
</script>

<template>
  <NuxtLink
    :to="to"
    class="group relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-ring/60 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="grid size-11 shrink-0 place-items-center rounded-xl bg-surface-2 text-foreground">
        <component :is="icon" class="size-5" aria-hidden="true" />
      </div>
      <ArrowUpRight
        class="size-4 text-muted-foreground transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
        aria-hidden="true"
      />
    </div>

    <div>
      <h3 class="text-base font-semibold text-foreground">{{ title }}</h3>
      <p class="mt-1 text-sm text-muted-foreground">{{ description }}</p>
    </div>

    <span
      v-if="status === 'ready'"
      class="inline-flex w-fit items-center gap-1.5 rounded-md bg-success/10 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-success"
    >
      <span class="size-1.5 rounded-full bg-success" aria-hidden="true" />
      Available now
    </span>
    <span
      v-else
      class="inline-flex w-fit items-center gap-1.5 rounded-md bg-surface-2 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground"
    >
      Coming soon<template v-if="eta"> · {{ eta }}</template>
    </span>
  </NuxtLink>
</template>
