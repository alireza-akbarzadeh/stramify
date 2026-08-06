<script setup lang="ts">
import { Check } from '@lucide/vue'
import { Button } from '@/components/ui/button'

defineProps<{
  name: string
  price: string
  period: string
  blurb: string
  features: string[]
  cta: string
  featured?: boolean
}>()
</script>

<template>
  <div
    :class="[
      'relative flex h-full flex-col rounded-2xl border p-7 backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1',
      featured
        ? 'border-primary/50 bg-card/80 shadow-[0_30px_70px_-30px_color-mix(in_oklab,var(--primary)_60%,transparent)]'
        : 'border-border bg-card/50 hover:border-foreground/20'
    ]"
  >
    <span
      v-if="featured"
      class="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary-foreground"
    >
      Most popular
    </span>

    <h3 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{{ name }}</h3>
    <p class="mt-4 flex items-baseline gap-1">
      <span class="text-4xl font-semibold tracking-tight text-foreground">{{ price }}</span>
      <span class="text-sm text-muted-foreground">{{ period }}</span>
    </p>
    <p class="mt-3 text-sm leading-relaxed text-muted-foreground">{{ blurb }}</p>

    <ul class="mt-6 flex-1 space-y-3">
      <li v-for="f in features" :key="f" class="flex items-start gap-2.5 text-sm text-foreground">
        <Check class="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        {{ f }}
      </li>
    </ul>

    <Button as-child :variant="featured ? 'default' : 'outline'" size="lg" class="mt-8 w-full">
      <NuxtLink to="/signup">{{ cta }}</NuxtLink>
    </Button>
  </div>
</template>
