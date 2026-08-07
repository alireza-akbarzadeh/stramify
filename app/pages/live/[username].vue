<script setup lang="ts">
const route = useRoute()
const username = computed(() => String(route.params.username ?? ''))

useHead({ title: computed(() => `${username.value} — Streamify`) })
</script>

<template>
  <main id="main-content">
    <AppHeader />
    <LiveChannelView :username="username" />
    <AppFooter />
  </main>
</template>
