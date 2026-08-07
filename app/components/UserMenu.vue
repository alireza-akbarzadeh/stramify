<script setup lang="ts">
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuSeparator, DropdownMenuTrigger } from 'reka-ui'
import { BadgeCheck, LayoutDashboard, LogOut, ShieldCheck, ShieldHalf } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const { user } = storeToRefs(auth)
const { signOut } = auth

const initial = computed(() => (user.value?.name || user.value?.email || '?').charAt(0).toUpperCase())

const links = [
  { to: '/studio', label: 'Creator dashboard', icon: LayoutDashboard },
  { to: '/settings/security', label: 'Security', icon: ShieldCheck },
  { to: '/settings/two-factor', label: 'Two-factor auth', icon: ShieldHalf }
]
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger
      class="group relative grid size-10 cursor-pointer place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      :aria-label="`Account menu for ${user?.name || user?.email}`"
    >
      <span
        class="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-primary/60 to-accent opacity-90 transition-transform duration-300 group-hover:scale-105 group-data-[state=open]:scale-105"
      />
      <span class="relative grid size-[calc(100%-4px)] place-items-center overflow-hidden rounded-full bg-background text-sm font-semibold text-foreground">
        <img v-if="user?.image" :src="user.image" :alt="user.name || ''" class="size-full object-cover">
        <span v-else>{{ initial }}</span>
      </span>
      <span
        class="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background bg-emerald-500"
        aria-hidden="true"
      />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        :side-offset="10"
        align="end"
        class="z-50 w-64 origin-top-right rounded-xl border border-border bg-popover p-1.5 shadow-[0_24px_60px_-24px_var(--shadow-color)] backdrop-blur-xl data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
      >
        <div class="flex items-center gap-3 px-2.5 py-2.5">
          <span class="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-surface-2 text-sm font-semibold text-foreground">
            <img v-if="user?.image" :src="user.image" :alt="user.name || ''" class="size-full object-cover">
            <span v-else>{{ initial }}</span>
          </span>
          <div class="min-w-0">
            <p class="flex items-center gap-1 truncate text-sm font-medium text-foreground">
              {{ user?.name }}
              <BadgeCheck v-if="user?.emailVerified" class="size-3.5 shrink-0 text-primary" aria-label="Verified email" />
            </p>
            <p class="truncate text-xs text-muted-foreground">{{ user?.email }}</p>
          </div>
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
