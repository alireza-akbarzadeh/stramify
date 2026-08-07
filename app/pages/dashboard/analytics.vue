<script setup lang="ts">
import AnalyticsView from '@/components/dashboard/AnalyticsView.vue'
import DashboardShell from '@/components/dashboard/DashboardShell.vue'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Analytics — Streamify' })
</script>

<template>
  <DashboardShell title="Analytics" description="Followers, engagement, and clip performance">
    <AnalyticsView />
  </DashboardShell>
</template>
