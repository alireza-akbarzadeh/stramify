<script setup lang="ts">
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuSeparator, DropdownMenuTrigger } from 'reka-ui'
import { LayoutDashboard, LogOut, Settings, ShieldCheck } from '@lucide/vue'
import { useAuth } from '@/composables/useAuth'

const { user, signOut } = useAuth()

const initial = computed(() => (user.value?.name || user.value?.email || '?').charAt(0).toUpperCase())

const links = [
  { to: '/dashboard', label: 'Creator dashboard', icon: LayoutDashboard },
  { to: '/settings/security', label: 'Security', icon: ShieldCheck },
  { to: '/settings/two-factor', label: 'Two-factor auth', icon: Settings }
]
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger
      class="grid size-10 cursor-pointer place-items-center rounded-full border border-border bg-glass text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      :aria-label="`Account menu for ${user?.name || user?.email}`"
    >
      <img v-if="user?.image" :src="user.image" alt="" class="size-full rounded-full object-cover">
      <span v-else>{{ initial }}</span>
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        :side-offset="8"
        align="end"
        class="z-50 w-60 rounded-xl border border-border bg-popover p-1.5 shadow-[0_24px_60px_-24px_var(--shadow-color)] backdrop-blur-xl"
      >
        <div class="px-2.5 py-2">
          <p class="truncate text-sm font-medium text-foreground">{{ user?.name }}</p>
          <p class="truncate text-xs text-muted-foreground">{{ user?.email }}</p>
        </div>

        <DropdownMenuSeparator class="my-1 h-px bg-border" />

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
</template>
