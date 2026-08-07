<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Go live — Streamify' })
</script>

<template>
  <DashboardShell
    title="Overview"
    description="Your channel, your activity, and what's happening now"
  >
    <ComingSoon
      title="Stream configuration"
      description="Ingest URL, stream key, title, and category — built in Phase 7 (Live Streaming)."
    />
  </DashboardShell>
</template>
