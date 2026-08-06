<template>
  <div>
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-rose-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
    >
      Skip to content
    </a>
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <Toaster rich-colors close-button />
  </div>
</template>

<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
</script>
