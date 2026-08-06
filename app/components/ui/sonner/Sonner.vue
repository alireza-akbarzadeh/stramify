<script setup lang="ts">
import { Toaster as Sonner, type ToasterProps } from 'vue-sonner'

const colorMode = useColorMode()

const props = withDefaults(defineProps<ToasterProps>(), {
  position: 'bottom-right'
})
</script>

<template>
  <Sonner
    :theme="colorMode.value === 'dark' ? 'dark' : 'light'"
    class="toaster group"
    v-bind="props"
    :toast-options="{
      classes: {
        toast:
          'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
        description: 'group-[.toast]:text-muted-foreground',
        actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
        cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        error: 'group-[.toaster]:!bg-destructive group-[.toaster]:!text-destructive-foreground group-[.toaster]:!border-destructive'
      }
    }"
  />
</template>
