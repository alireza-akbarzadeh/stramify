<script setup lang="ts">
import { DropdownMenuRoot, DropdownMenuTrigger } from 'reka-ui'
import AccountAvatar from './account/AccountAvatar.vue'
import AccountMenuContent from './account/AccountMenuContent.vue'

/**
 * The account menu as a compact avatar button — the form used anywhere the
 * chrome is a horizontal bar: the public `AppHeader` and the app's
 * `DashboardTopBar`. The sidebar footer uses the same panel behind a wider
 * trigger (`SidebarUserMenu`).
 *
 * Renders nothing when signed out; the caller decides what a visitor sees
 * instead (the header offers Log in / Start streaming).
 */
const { user } = useAccountMenu()
</script>

<template>
  <DropdownMenuRoot v-if="user">
    <DropdownMenuTrigger
      class="group relative grid size-10 cursor-pointer place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      :aria-label="`Account menu for ${user.name || user.email}`"
    >
      <span
        class="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-primary/60 to-accent opacity-90 transition-transform duration-300 group-hover:scale-105 group-data-[state=open]:scale-105"
      />
      <AccountAvatar class="relative size-[calc(100%-4px)] bg-background text-sm" />
    </DropdownMenuTrigger>

    <AccountMenuContent />
  </DropdownMenuRoot>
</template>
