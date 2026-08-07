<script setup lang="ts">
import { BarChart3, Compass, Grid2x2, Heart, Home, Radio, Video } from '@lucide/vue'
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
import SidebarUserMenu from './SidebarUserMenu.vue'

const route = useRoute()
const { state, isMobile } = useSidebar()

const browseLinks = [
  { to: '/dashboard', label: 'Overview', icon: Home },
  { to: '/live', label: 'Live', icon: Radio },
  { to: '/clips', label: 'Clips', icon: Video },
  { to: '/category', label: 'Categories', icon: Grid2x2 },
  { to: '/following', label: 'Following', icon: Heart }
]

const creatorLinks = [
  { to: '/dashboard/stream', label: 'Go live', icon: Compass, badge: 'Phase 7' },
  { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3, badge: 'Phase 9' }
]

function isActive(to: string) {
  return to === '/dashboard' ? route.path === to : route.path.startsWith(to)
}
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
      <SidebarGroup>
        <SidebarGroupLabel>Browse</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="link in browseLinks" :key="link.to">
              <SidebarMenuButton as-child :is-active="isActive(link.to)" :tooltip="link.label">
                <NuxtLink :to="link.to">
                  <component :is="link.icon" aria-hidden="true" />
                  <span>{{ link.label }}</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Creator tools</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="link in creatorLinks" :key="link.to">
              <SidebarMenuButton as-child :is-active="isActive(link.to)" :tooltip="link.label">
                <NuxtLink :to="link.to">
                  <component :is="link.icon" aria-hidden="true" />
                  <span>{{ link.label }}</span>
                </NuxtLink>
              </SidebarMenuButton>
              <SidebarMenuBadge class="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
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
