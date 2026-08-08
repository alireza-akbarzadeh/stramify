<script setup lang="ts">
const open = ref(false)

const navLinks = [
  { label: 'Live', to: '/live' },
  { label: 'Categories', to: '/category' },
  { label: 'Following', to: '/following' }
]
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur">
    <nav
      class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      aria-label="Primary"
    >
      <NuxtLink
        to="/"
        class="flex items-center gap-2 text-lg font-semibold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-md"
      >
        <span class="inline-block h-6 w-6 rounded-md bg-rose-600" aria-hidden="true" />
        Streamify
      </NuxtLink>

      <ul class="hidden items-center gap-8 md:flex">
        <li v-for="link in navLinks" :key="link.to">
          <NuxtLink
            :to="link.to"
            class="text-sm font-medium text-slate-300 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-md"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>

      <div class="hidden items-center gap-3 md:flex">
        <NuxtLink
          to="/login"
          class="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-slate-200 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
        >
          Log in
        </NuxtLink>
        <NuxtLink
          to="/signup"
          class="cursor-pointer rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          Start streaming
        </NuxtLink>
      </div>

      <button
        type="button"
        class="cursor-pointer rounded-md p-2 text-slate-200 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
        :aria-expanded="open"
        aria-controls="mobile-nav"
        aria-label="Toggle menu"
        @click="open = !open"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            v-if="!open"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
          />
          <path v-else stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </nav>

    <div v-if="open" id="mobile-nav" class="border-t border-white/10 px-4 py-4 md:hidden">
      <ul class="flex flex-col gap-1">
        <li v-for="link in navLinks" :key="link.to">
          <NuxtLink
            :to="link.to"
            class="block rounded-md px-3 py-3 text-base font-medium text-slate-200 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            @click="open = false"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
      <div class="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3">
        <NuxtLink
          to="/login"
          class="rounded-lg px-3 py-3 text-center text-sm font-semibold text-slate-200 hover:bg-white/5"
          @click="open = false"
          >Log in</NuxtLink
        >
        <NuxtLink
          to="/signup"
          class="rounded-lg bg-rose-600 px-3 py-3 text-center text-sm font-semibold text-white"
          @click="open = false"
          >Start streaming</NuxtLink
        >
      </div>
    </div>
  </header>
</template>
