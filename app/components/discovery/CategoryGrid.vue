<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useDiscoveryCategories } from '@/composables/useDiscoveryCategories'
import CategoryCard from './CategoryCard.vue'

const { data, isPending, isError, refetch } = useDiscoveryCategories()

const categories = computed(() => data.value ?? [])
</script>

<template>
  <section aria-labelledby="categories-heading">
    <div class="mb-8 border-b border-border pb-4">
      <h1 id="categories-heading" class="text-2xl font-semibold text-foreground">Categories</h1>
      <p class="mt-2 max-w-xl text-sm text-muted-foreground">
        Every clip on Streamify, grouped by what it is. Counts and view totals are live.
      </p>
    </div>

    <div v-if="isPending" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="n in 3" :key="n" class="h-72 animate-pulse rounded-xl bg-muted" />
    </div>

    <div
      v-else-if="isError"
      class="rounded-xl border border-dashed border-destructive/40 py-16 text-center"
    >
      <p class="text-lg font-semibold text-foreground">Couldn't load categories</p>
      <p class="mt-2 text-sm text-muted-foreground">Something went wrong on our side.</p>
      <Button type="button" variant="outline" size="sm" class="mt-4" @click="refetch()">
        Retry
      </Button>
    </div>

    <div v-else-if="categories.length" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <Reveal
        v-for="(category, index) in categories"
        :key="category.slug"
        class="h-full"
        :delay="index * 0.04"
      >
        <CategoryCard :category="category" class="h-full" />
      </Reveal>
    </div>

    <div v-else class="rounded-xl border border-dashed border-border py-16 text-center">
      <p class="text-lg font-semibold text-foreground">No categories yet</p>
      <p class="mt-2 text-sm text-muted-foreground">
        Categories appear here as soon as the first clips are published.
      </p>
    </div>
  </section>
</template>
