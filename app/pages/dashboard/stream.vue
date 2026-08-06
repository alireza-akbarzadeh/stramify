<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Go live — Streamify' })
</script>

<template>
  <main id="main-content">
    <AppHeader />
    <ComingSoon title="Stream configuration" description="Ingest URL, stream key, title, and category — built in Phase 7 (Live Streaming)." />
    <AppFooter />
  </main>
</template>
