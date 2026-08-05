<script setup lang="ts">
import type { NuxtError } from '#app'
import { Button } from '@/components/ui/button'

const props = defineProps<{ error: NuxtError }>()

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-4 text-center">
    <p class="text-sm font-medium text-muted-foreground">{{ error.statusCode }}</p>
    <h1 class="text-2xl font-semibold text-foreground">
      {{ error.statusMessage || 'Something went wrong' }}
    </h1>
    <Button @click="handleError">Go back home</Button>
  </div>
</template>
