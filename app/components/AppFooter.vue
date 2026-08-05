<script setup lang="ts">
const columns = [
  { title: 'Product', links: [['Live', '/live'], ['Categories', '/category'], ['Clips', '/clips']] },
  { title: 'Creators', links: [['Dashboard', '/dashboard'], ['Go live', '/dashboard/stream'], ['Analytics', '/dashboard/analytics']] },
  { title: 'Company', links: [['About', '/about'], ['Careers', '/careers'], ['Security', '/security']] }
]
</script>

<template>
  <footer class="border-t border-white/10">
    <div class="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-4 lg:px-8">
      <div>
        <div class="flex items-center gap-2 text-lg font-semibold text-white">
          <span class="inline-block h-6 w-6 rounded-md bg-rose-600" aria-hidden="true" />
          Streamify
        </div>
        <p class="mt-3 max-w-xs text-sm text-slate-400">
          A next-generation home for live streaming and video, built for creators and their communities.
        </p>
      </div>

      <div v-for="col in columns" :key="col.title">
        <h3 class="text-sm font-semibold text-white">{{ col.title }}</h3>
        <ul class="mt-4 space-y-3">
          <li v-for="[label, to] in col.links" :key="to">
            <NuxtLink :to="to" class="text-sm text-slate-400 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-md">
              {{ label }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
    <div class="border-t border-white/10 px-4 py-6 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
      © {{ new Date().getFullYear() }} Streamify. All rights reserved.
    </div>
  </footer>
</template>
