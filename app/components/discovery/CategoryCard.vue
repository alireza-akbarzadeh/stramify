<script setup lang="ts">
import { Layers } from '@lucide/vue'
import type { CategorySummary } from '#shared/types/discovery'

const props = defineProps<{ category: CategorySummary }>()

const clipLabel = computed(
  () => `${props.category.clipCount} ${props.category.clipCount === 1 ? 'clip' : 'clips'}`
)
</script>

<template>
  <NuxtLink
    :to="`/category/${category.slug}`"
    class="group block overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    :aria-label="`Browse ${category.name} — ${clipLabel}`"
  >
    <div class="relative aspect-video overflow-hidden bg-muted">
      <img
        v-if="category.previewImage"
        :src="category.previewImage"
        :alt="`Most watched ${category.name} clip`"
        width="960"
        height="540"
        loading="lazy"
        class="size-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div v-else class="flex size-full items-center justify-center text-muted-foreground">
        <Layers class="size-8" aria-hidden="true" />
      </div>
      <span
        class="absolute bottom-2 right-2 rounded-sm bg-background/90 px-1.5 py-0.5 text-[11px] font-semibold text-foreground"
        >{{ category.totalViews }} views</span
      >
    </div>
    <div class="space-y-1 p-4">
      <div class="flex items-center justify-between gap-3">
        <h3
          class="text-base font-semibold text-foreground transition-colors group-hover:text-primary"
        >
          {{ category.name }}
        </h3>
        <p class="shrink-0 text-xs text-muted-foreground">{{ clipLabel }}</p>
      </div>
      <p class="text-sm leading-relaxed text-muted-foreground">{{ category.description }}</p>
    </div>
  </NuxtLink>
</template>
