<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import AppSearch from '@/components/search/AppSearch.vue'
import NotificationBell from '@/components/notifications/NotificationBell.vue'

/**
 * The app shell's top bar: sidebar toggle, search, notifications, theme.
 *
 * It carries no page title — the page underneath owns its own heading, which
 * is what lets one bar sit above `/live`, `/watch/...` and `/dashboard` alike.
 */
</script>

<template>
  <header
    class="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-glass px-3 backdrop-blur-xl sm:gap-3 sm:px-6"
  >
    <SidebarTrigger />
    <Separator orientation="vertical" class="hidden h-5 sm:block" />

    <AppSearch />

    <div class="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
      <NotificationBell />
      <ThemeToggle />
    </div>
  </header>
</template>
