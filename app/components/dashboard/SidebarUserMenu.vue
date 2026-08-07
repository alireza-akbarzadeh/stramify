<script setup lang="ts">
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuSeparator, DropdownMenuTrigger } from 'reka-ui'
import { BadgeCheck, ChevronsUpDown, LogOut, ShieldCheck, ShieldHalf } from '@lucide/vue'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { useAuth } from '@/composables/useAuth'

const { user, signOut } = useAuth()
const { isMobile } = useSidebar()

const initial = computed(() => (user.value?.name || user.value?.email || '?').charAt(0).toUpperCase())

const links = [
  { to: '/settings/security', label: 'Security', icon: ShieldCheck },
  { to: '/settings/two-factor', label: 'Two-factor auth', icon: ShieldHalf }
]
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenuRoot>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            :aria-label="`Account menu for ${user?.name || user?.email}`"
          >
            <span class="grid size-8 shrink-0 place-items-center overflow-hidden rounded-full border border-sidebar-border bg-background text-xs font-semibold text-foreground">
              <img v-if="user?.image" :src="user.image" :alt="user.name || ''" class="size-full object-cover">
              <span v-else>{{ initial }}</span>
            </span>
            <span class="grid flex-1 text-left text-sm leading-tight">
              <span class="flex items-center gap-1 truncate font-medium">
                {{ user?.name }}
                <BadgeCheck v-if="user?.emailVerified" class="size-3.5 shrink-0 text-primary" aria-label="Verified email" />
              </span>
              <span class="truncate text-xs text-muted-foreground">{{ user?.email }}</span>
            </span>
            <ChevronsUpDown class="ml-auto size-4 text-muted-foreground" aria-hidden="true" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
          <DropdownMenuContent
            :side="isMobile ? 'bottom' : 'right'"
            :side-offset="10"
            align="end"
            class="z-50 w-64 origin-top-right rounded-xl border border-border bg-popover p-1.5 shadow-[0_24px_60px_-24px_var(--shadow-color)] backdrop-blur-xl data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
          >
            <DropdownMenuItem v-for="link in links" :key="link.to" as-child>
              <NuxtLink
                :to="link.to"
                class="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-foreground outline-none transition-colors data-highlighted:bg-surface-2"
              >
                <component :is="link.icon" class="size-4 text-muted-foreground" aria-hidden="true" />
                {{ link.label }}
              </NuxtLink>
            </DropdownMenuItem>

            <DropdownMenuSeparator class="my-1 h-px bg-border" />

            <DropdownMenuItem
              class="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-destructive outline-none transition-colors data-highlighted:bg-destructive/10"
              @select="signOut"
            >
              <LogOut class="size-4" aria-hidden="true" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
