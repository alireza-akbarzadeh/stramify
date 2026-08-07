<template>
  <!-- Mirrors the real layout's boxes so the page doesn't jump when data lands. -->
  <div class="space-y-6" aria-hidden="true">
    <div class="h-32 animate-pulse rounded-2xl bg-muted sm:h-44 lg:h-56" />
    <div class="flex flex-col gap-4 px-1 sm:flex-row sm:items-end sm:gap-6">
      <div class="-mt-10 size-20 animate-pulse rounded-full bg-muted sm:-mt-14 sm:size-28" />
      <div class="flex-1 space-y-3 pt-1">
        <div class="h-7 w-56 animate-pulse rounded bg-muted" />
        <div class="h-4 w-72 animate-pulse rounded bg-muted" />
      </div>
      <div class="h-11 w-28 animate-pulse rounded-md bg-muted" />
    </div>
    <div class="h-12 animate-pulse rounded bg-muted" />
    <div class="grid grid-cols-1 gap-6 pt-4 sm:grid-cols-2 xl:grid-cols-4">
      <div v-for="n in 4" :key="n" class="space-y-3">
        <div class="aspect-video animate-pulse rounded-lg bg-muted" />
        <div class="h-3 w-3/4 animate-pulse rounded bg-muted" />
      </div>
    </div>
  </div>
</template>
