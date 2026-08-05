<script setup lang="ts">
import type { NuxtError } from '#app'
import { Button } from '@/components/ui/button'

const props = defineProps<{ error: NuxtError }>()

const isNotFound = computed(() => props.error.status === 404)
const heading = computed(() => (isNotFound.value ? 'Page not found' : 'Something went wrong'))
const message = computed(() =>
  isNotFound.value
    ? "The page you're looking for doesn't exist or hasn't been built yet."
    : props.error.statusText || 'An unexpected error occurred.'
)

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-4 text-center">
    <p class="text-sm font-medium text-muted-foreground">{{ error.status }}</p>
    <h1 class="text-2xl font-semibold text-foreground">{{ heading }}</h1>
    <p class="max-w-md text-sm text-muted-foreground">{{ message }}</p>
    <Button @click="handleError">Go back home</Button>
  </div>
</template>
