<script setup lang="ts">
import SearchResultsView from '@/components/search/SearchResultsView.vue'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const query = computed(() => String(route.query.q ?? '').trim())

useHead({
  title: computed(() => (query.value ? `${query.value} — Streamify search` : 'Search — Streamify'))
})
</script>

<template>
  <SearchResultsView :query="query" />
</template>
