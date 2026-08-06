<script setup lang="ts">
import { Moon, Sun } from '@lucide/vue'

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

function toggle() {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <button
    type="button"
    class="grid size-10 cursor-pointer place-items-center rounded-full border border-border bg-glass text-muted-foreground backdrop-blur transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggle"
  >
    <ClientOnly>
      <component :is="isDark ? Sun : Moon" class="size-4.5" aria-hidden="true" />
      <template #fallback><span class="size-4.5" /></template>
    </ClientOnly>
  </button>
</template>
