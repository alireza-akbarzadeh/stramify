<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { Toaster as Sonner, type ToasterProps } from 'vue-sonner'

const colorMode = useColorMode()

const props = withDefaults(defineProps<ToasterProps>(), {
  position: 'bottom-right'
})
</script>

<template>
  <Sonner
    v-bind="props"
    :theme="colorMode === 'dark' ? 'dark' : 'light'"
    class="toaster group"
    :toast-options="{
      classes: {
        toast:
          'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
        description: 'group-[.toast]:text-muted-foreground',
        actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
        cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        error:
          'group-[.toaster]:!bg-destructive group-[.toaster]:!text-destructive-foreground group-[.toaster]:!border-destructive'
      }
    }"
  />
</template>
