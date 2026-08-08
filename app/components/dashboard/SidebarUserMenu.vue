<script setup lang="ts">
import { DropdownMenuRoot, DropdownMenuTrigger } from 'reka-ui'
import { BadgeCheck, ChevronsUpDown, LogIn } from '@lucide/vue'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import AccountAvatar from '@/components/account/AccountAvatar.vue'
import AccountMenuContent from '@/components/account/AccountMenuContent.vue'

/**
 * The sidebar footer's account control: the same menu as the header's
 * `UserMenu`, behind a full-width trigger that can show the name and email
 * inline. Only the trigger lives here — the panel is `AccountMenuContent`.
 */
const { user } = useAccountMenu()
const { isMobile } = useSidebar()
</script>

<template>
  <SidebarMenu>
    <!--
      The shell is on public routes too (`/live`, `/clips`, `/watch/...`), so
      the footer has to have something to say to a signed-out visitor rather
      than rendering an account menu with no account behind it.
    -->
    <SidebarMenuItem v-if="!user">
      <SidebarMenuButton as-child size="lg" tooltip="Log in">
        <NuxtLink to="/login">
          <span
            class="grid size-8 shrink-0 place-items-center rounded-full border border-sidebar-border bg-background text-foreground"
          >
            <LogIn class="size-4" aria-hidden="true" />
          </span>
          <span class="grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-medium">Log in</span>
            <span class="truncate text-xs text-muted-foreground">Follow channels and go live</span>
          </span>
        </NuxtLink>
      </SidebarMenuButton>
    </SidebarMenuItem>

    <SidebarMenuItem v-else>
      <DropdownMenuRoot>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            :aria-label="`Account menu for ${user.name || user.email}`"
          >
            <AccountAvatar class="size-8 border border-sidebar-border bg-background text-xs" />
            <span class="grid flex-1 text-left text-sm leading-tight">
              <span class="flex items-center gap-1 truncate font-medium">
                {{ user.name }}
                <BadgeCheck
                  v-if="user.emailVerified"
                  class="size-3.5 shrink-0 text-primary"
                  aria-label="Verified email"
                />
              </span>
              <span class="truncate text-xs text-muted-foreground">{{ user.email }}</span>
            </span>
            <ChevronsUpDown class="ml-auto size-4 text-muted-foreground" aria-hidden="true" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>

        <AccountMenuContent :side="isMobile ? 'bottom' : 'right'" :identity="false" />
      </DropdownMenuRoot>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
