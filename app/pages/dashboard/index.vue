<script setup lang="ts">
import DashboardWelcome from '@/components/dashboard/DashboardWelcome.vue'
import RoadmapCard from '@/components/dashboard/RoadmapCard.vue'
import SecurityStatusCard from '@/components/dashboard/SecurityStatusCard.vue'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Dashboard — Streamify' })
</script>

<template>
  <main id="main-content">
    <AppHeader />

    <section class="mx-auto max-w-5xl px-4 py-16 sm:py-20">
      <Reveal>
        <DashboardWelcome />
      </Reveal>

      <h2 class="sr-only">Your dashboard</h2>
      <div class="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <Reveal :delay="0.05">
          <SecurityStatusCard />
        </Reveal>
        <Reveal :delay="0.1">
          <RoadmapCard />
        </Reveal>
      </div>
    </section>

    <AppFooter />
  </main>
</template>
