<script setup lang="ts">
import AppSidebar from '@/components/dashboard/AppSidebar.vue'
import DashboardTopBar from '@/components/dashboard/DashboardTopBar.vue'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

/**
 * The app shell — sidebar + top bar — for every product surface, not just
 * `/dashboard`. Browse routes (`/live`, `/clips`, `/following`, `/channels`,
 * `/category`, `/watch/...`) opt in with `definePageMeta({ layout: 'dashboard' })`
 * and keep the sidebar instead of each rendering its own header.
 *
 * The shell adds no horizontal padding of its own: the views under it
 * (`DiscoveryFeed`, `ChannelView`, `WatchView`, `DashboardShell`, …) already
 * carry a `max-w` container, and doubling it up would inset them twice.
 */
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset id="main-content">
      <DashboardTopBar />
      <div class="flex-1">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
