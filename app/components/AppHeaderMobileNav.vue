<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { buttonVariants } from '@/components/ui/button'
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useAuthStore } from '@/stores/auth'
import { headerLinks, isNavLinkActive } from '@/utils/nav'

/**
 * `AppHeader`'s nav on small screens. Must be rendered inside the header's
 * `<Sheet>` — it is the sheet's content, and reads the open state from that
 * root's context.
 *
 * No account section: signed in, the avatar menu stays in the bar next to the
 * trigger and owns those links, so repeating them here would be two places to
 * keep in sync. The signed-out CTAs live here because the bar hides them
 * below `md`.
 *
 * Every link is wrapped in `SheetClose` — a nav that stays open over the page
 * you just navigated to is the classic mobile-menu bug.
 */
const route = useRoute()
const { isAuthenticated } = storeToRefs(useAuthStore())
</script>

<template>
  <SheetContent side="right" class="w-[85%] gap-0 p-0 sm:max-w-sm">
    <SheetHeader class="border-b border-border">
      <SheetTitle class="sr-only">Menu</SheetTitle>
      <SheetClose as-child>
        <BrandMark />
      </SheetClose>
    </SheetHeader>

    <nav class="flex-1 overflow-y-auto p-3" aria-label="Mobile">
      <ul class="flex flex-col gap-1">
        <li v-for="link in headerLinks" :key="link.to">
          <SheetClose as-child>
            <NuxtLink
              :to="link.to"
              :aria-current="isNavLinkActive(link.to, route.path) ? 'page' : undefined"
              :class="[
                'flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isNavLinkActive(link.to, route.path)
                  ? 'bg-surface-2 text-foreground'
                  : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
              ]"
            >
              <component :is="link.icon" class="size-5 shrink-0" aria-hidden="true" />
              {{ link.label }}
            </NuxtLink>
          </SheetClose>
        </li>
      </ul>
    </nav>

    <div v-if="!isAuthenticated" class="flex flex-col gap-2 border-t border-border p-4">
      <SheetClose as-child>
        <NuxtLink to="/login" :class="buttonVariants({ variant: 'outline' })">Log in</NuxtLink>
      </SheetClose>
      <SheetClose as-child>
        <NuxtLink to="/signup" :class="buttonVariants()">Start streaming</NuxtLink>
      </SheetClose>
    </div>
  </SheetContent>
</template>
