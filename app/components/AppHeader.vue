<script setup lang="ts">
import { Menu, X } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { useScrollHeader } from '@/composables/useScrollHeader'
import { useAuth } from '@/composables/useAuth'

const open = ref(false)
const { scrolled, hidden } = useScrollHeader()
const { user } = useAuth()

const navLinks = [
  { label: 'Live', to: '/live' },
  { label: 'Categories', to: '/category' },
  { label: 'Following', to: '/following' },
  { label: 'Clips', to: '/clips' }
]
</script>

<template>
  <header
    :class="[
      'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
      hidden && !open ? '-translate-y-full' : 'translate-y-0',
      scrolled ? 'border-b border-border bg-glass backdrop-blur-xl' : 'border-b border-transparent'
    ]"
  >
    <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Primary">
      <BrandMark />

      <ul class="hidden items-center gap-1 md:flex">
        <li v-for="link in navLinks" :key="link.to">
          <NuxtLink
            :to="link.to"
            class="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>

      <div class="hidden items-center gap-2 md:flex">
        <ThemeToggle />
        <template v-if="user">
          <UserMenu />
        </template>
        <template v-else>
          <Button as-child variant="ghost" size="sm">
            <NuxtLink to="/login">Log in</NuxtLink>
          </Button>
          <Button as-child size="sm">
            <NuxtLink to="/signup">Start streaming</NuxtLink>
          </Button>
        </template>
      </div>

      <div class="flex items-center gap-2 md:hidden">
        <ThemeToggle />
        <button
          type="button"
          class="grid size-10 cursor-pointer place-items-center rounded-full border border-border text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          :aria-expanded="open"
          aria-controls="mobile-nav"
          aria-label="Toggle menu"
          @click="open = !open"
        >
          <component :is="open ? X : Menu" class="size-5" aria-hidden="true" />
        </button>
      </div>
    </nav>

    <div v-if="open" id="mobile-nav" class="border-t border-border bg-glass px-4 py-4 backdrop-blur-xl md:hidden">
      <ul class="flex flex-col gap-1">
        <li v-for="link in navLinks" :key="link.to">
          <NuxtLink
            :to="link.to"
            class="block rounded-lg px-3 py-3 text-base font-medium text-muted-foreground hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            @click="open = false"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
      <div class="mt-3 flex flex-col gap-2 border-t border-border pt-3">
        <template v-if="user">
          <Button as-child variant="outline" @click="open = false">
            <NuxtLink to="/dashboard">Creator dashboard</NuxtLink>
          </Button>
          <Button as-child variant="ghost" @click="open = false">
            <NuxtLink to="/settings/security">Security</NuxtLink>
          </Button>
        </template>
        <template v-else>
          <Button as-child variant="outline" @click="open = false">
            <NuxtLink to="/login">Log in</NuxtLink>
          </Button>
          <Button as-child @click="open = false">
            <NuxtLink to="/signup">Start streaming</NuxtLink>
          </Button>
        </template>
      </div>
    </div>
  </header>
</template>
