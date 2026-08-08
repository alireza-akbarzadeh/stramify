<script setup lang="ts">
import { Menu } from '@lucide/vue'
import { storeToRefs } from 'pinia'
import { Button } from '@/components/ui/button'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import { useAuthStore } from '@/stores/auth'
import { useScrollHeader } from '@/composables/useScrollHeader'
import { headerLinks, isNavLinkActive } from '@/utils/nav'
import AppHeaderMobileNav from './AppHeaderMobileNav.vue'

/**
 * The public chrome's top bar (see `layouts/default.vue`).
 *
 * Every colour here is a theme token — `bg-glass`, `border-border`,
 * `text-muted-foreground` — so the same markup reads correctly in light and
 * dark; nothing is pinned to a literal black/white.
 *
 * It is `position: fixed` and transparent until you scroll, which is why the
 * landing hero owns its own top padding rather than the layout adding one.
 *
 * Signed in, the right-hand cluster becomes notifications + the account menu
 * (`UserMenu` — the same menu the app shell renders); signed out it stays the
 * two conversion CTAs.
 */
const route = useRoute()
const open = ref(false)
const { scrolled, hidden } = useScrollHeader()
const { isAuthenticated } = storeToRefs(useAuthStore())
</script>

<template>
  <header
    :class="[
      'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
      hidden && !open ? '-translate-y-full' : 'translate-y-0',
      scrolled ? 'border-b border-border bg-glass backdrop-blur-xl' : 'border-b border-transparent'
    ]"
  >
    <nav
      class="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8"
      aria-label="Primary"
    >
      <BrandMark />

      <ul class="ml-4 hidden items-center gap-1 md:flex">
        <li v-for="link in headerLinks" :key="link.to">
          <NuxtLink
            :to="link.to"
            :aria-current="isNavLinkActive(link.to, route.path) ? 'page' : undefined"
            :class="[
              'rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              isNavLinkActive(link.to, route.path) ? 'text-foreground' : 'text-muted-foreground'
            ]"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>

      <div class="ml-auto flex items-center gap-2">
        <div v-if="isAuthenticated" class="hidden sm:block">
          <NotificationBell />
        </div>
        <ThemeToggle />

        <UserMenu v-if="isAuthenticated" />
        <template v-else>
          <Button as-child variant="ghost" size="sm" class="hidden md:inline-flex">
            <NuxtLink to="/login">Log in</NuxtLink>
          </Button>
          <Button as-child size="sm" class="hidden md:inline-flex">
            <NuxtLink to="/signup">Start streaming</NuxtLink>
          </Button>
        </template>

        <Sheet v-model:open="open">
          <SheetTrigger
            class="grid size-10 cursor-pointer place-items-center rounded-full border border-border text-foreground transition-colors duration-200 hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            aria-label="Open menu"
          >
            <Menu class="size-5" aria-hidden="true" />
          </SheetTrigger>

          <AppHeaderMobileNav />
        </Sheet>
      </div>
    </nav>
  </header>
</template>
