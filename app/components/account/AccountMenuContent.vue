<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator
} from 'reka-ui'
import { BadgeCheck, LogOut } from '@lucide/vue'
import AccountAvatar from './AccountAvatar.vue'

/**
 * The account dropdown's body — identity, links, log out.
 *
 * Only the trigger differs between the header avatar (`UserMenu`) and the
 * sidebar footer (`SidebarUserMenu`), so the panel itself lives here once.
 * `identity` is off where the trigger already spells out who you are.
 *
 * Motion is Track A (see the `motion` skill): `data-state`/`data-side` classes
 * from `tw-animate-css`, which Reka's presence machine waits on before it
 * unmounts. No `motion-v` around a portalled overlay.
 */
withDefaults(
  defineProps<{ side?: 'top' | 'right' | 'bottom' | 'left'; identity?: boolean }>(),
  { side: 'bottom', identity: true }
)

const { user, signOut, links } = useAccountMenu()
</script>

<template>
  <DropdownMenuPortal>
    <DropdownMenuContent
      :side="side"
      :side-offset="10"
      align="end"
      class="z-50 w-64 rounded-xl border border-border bg-popover p-1.5 shadow-[0_24px_60px_-24px_var(--shadow-color)] backdrop-blur-xl duration-200 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 motion-reduce:animate-none"
    >
      <template v-if="identity">
        <div class="flex items-center gap-3 px-2.5 py-2.5">
          <AccountAvatar class="size-10 border border-border text-sm" />
          <div class="min-w-0">
            <p class="flex items-center gap-1 truncate text-sm font-medium text-foreground">
              {{ user?.name }}
              <BadgeCheck
                v-if="user?.emailVerified"
                class="size-3.5 shrink-0 text-primary"
                aria-label="Verified email"
              />
            </p>
            <p class="truncate text-xs text-muted-foreground">{{ user?.email }}</p>
          </div>
        </div>

        <DropdownMenuSeparator class="my-1 h-px bg-border" />
      </template>

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
</template>
