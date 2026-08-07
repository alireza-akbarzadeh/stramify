<script setup lang="ts">
const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))
</script>

<template>
  <main id="main-content">
    <AppHeader />
    <WatchView :slug="slug" />
    <AppFooter />
  </main>
</template>
