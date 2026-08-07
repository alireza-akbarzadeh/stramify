<script setup lang="ts">
const route = useRoute()
const handle = computed(() => String(route.params.handle ?? ''))
</script>

<template>
  <main id="main-content">
    <AppHeader />
    <ChannelView :handle="handle" />
    <AppFooter />
  </main>
</template>
