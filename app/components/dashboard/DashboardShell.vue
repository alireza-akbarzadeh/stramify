<script setup lang="ts">
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import AppSidebar from './AppSidebar.vue'

defineProps<{ title: string; description?: string }>()
</script>

<template>
  <SidebarProvider>
    <AppSidebar />

    <SidebarInset id="main-content">
      <header class="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-glass px-4 backdrop-blur-xl sm:px-6">
        <SidebarTrigger />
        <Separator orientation="vertical" class="h-5" />
        <div class="min-w-0 flex-1">
          <h1 class="truncate text-base font-semibold text-foreground">{{ title }}</h1>
          <p v-if="description" class="truncate text-xs text-muted-foreground">{{ description }}</p>
        </div>
        <div class="flex shrink-0 items-center gap-2">
          <slot name="actions" />
          <ThemeToggle />
        </div>
      </header>

      <div class="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
