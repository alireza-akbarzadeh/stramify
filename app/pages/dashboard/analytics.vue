<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Analytics — Streamify' })
</script>

<template>
  <main id="main-content">
    <AppHeader />
    <ComingSoon title="Analytics" description="Views, watch time, and audience growth — built in Phase 9 (Creator System)." />
    <AppFooter />
  </main>
</template>
