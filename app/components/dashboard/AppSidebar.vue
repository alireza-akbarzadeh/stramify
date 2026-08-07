<script setup lang="ts">
import { storeToRefs } from 'pinia'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar'
import { useAuthStore } from '@/stores/auth'
import { creatorLinks, discoverLinks, isNavLinkActive, libraryLinks } from '@/utils/nav'
import type { NavLink } from '@/utils/nav'
import SidebarUserMenu from './SidebarUserMenu.vue'

/**
 * The app's primary navigation, in three groups: what to watch, what you've
 * kept, and what you publish. The link lists live in `app/utils/nav.ts` so
 * this file stays markup and the routes can be asserted in a test.
 *
 * The Creator group is hidden when signed out — those routes are all behind
 * the `auth` middleware, and a link that only bounces you to `/login` is worse
 * than no link.
 */
const route = useRoute()
const { state, isMobile } = useSidebar()
const { isAuthenticated } = storeToRefs(useAuthStore())

const groups = computed<Array<{ label: string; links: NavLink[] }>>(() => [
  { label: 'Discover', links: discoverLinks },
  { label: 'Your library', links: libraryLinks },
  ...(isAuthenticated.value ? [{ label: 'Creator', links: creatorLinks }] : [])
])
</script>

<template>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child class="hover:bg-transparent active:bg-transparent">
            <NuxtLink to="/" class="text-[17px] font-semibold tracking-tight text-foreground">
              <span class="relative grid size-7 shrink-0 place-items-center" aria-hidden="true">
                <span class="absolute inset-0 rounded-[9px] bg-linear-to-br from-primary to-secondary" />
                <svg viewBox="0 0 24 24" fill="none" class="relative size-3.5 text-white">
                  <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
                </svg>
              </span>
              <span v-if="state === 'expanded' || isMobile">Streamify</span>
            </NuxtLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup v-for="group in groups" :key="group.label">
        <SidebarGroupLabel>{{ group.label }}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="link in group.links" :key="link.to">
              <SidebarMenuButton
                as-child
                :is-active="isNavLinkActive(link.to, route.path)"
                :tooltip="link.label"
              >
                <NuxtLink :to="link.to">
                  <component :is="link.icon" aria-hidden="true" />
                  <span>{{ link.label }}</span>
                </NuxtLink>
              </SidebarMenuButton>
              <SidebarMenuBadge
                v-if="link.badge"
                class="text-[10px] font-bold uppercase tracking-wide text-muted-foreground"
              >
                {{ link.badge }}
              </SidebarMenuBadge>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <SidebarUserMenu />
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>
