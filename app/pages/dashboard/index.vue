<script setup lang="ts">
import { BarChart3, KeyRound, Radio, ShieldCheck } from '@lucide/vue'
import DashboardWelcome from '@/components/dashboard/DashboardWelcome.vue'
import QuickLinkCard from '@/components/dashboard/QuickLinkCard.vue'

definePageMeta({ middleware: 'auth' })
useHead({ title: 'Dashboard — Streamify' })

const links = [
  {
    to: '/dashboard/stream',
    icon: Radio,
    title: 'Go live',
    description: 'Ingest URL, stream key, title, and category for your broadcast.',
    status: 'planned' as const,
    eta: 'Phase 7 — Live Streaming'
  },
  {
    to: '/dashboard/analytics',
    icon: BarChart3,
    title: 'Analytics',
    description: 'Views, watch time, and audience growth for your channel.',
    status: 'planned' as const,
    eta: 'Phase 9 — Creator System'
  },
  {
    to: '/settings/security',
    icon: ShieldCheck,
    title: 'Account & security',
    description: 'Manage your password, sessions, and account recovery options.',
    status: 'ready' as const
  },
  {
    to: '/settings/two-factor',
    icon: KeyRound,
    title: 'Two-factor authentication',
    description: 'Add an extra layer of protection to your creator account.',
    status: 'ready' as const
  }
]
</script>

<template>
  <main id="main-content">
    <AppHeader />

    <section class="mx-auto max-w-5xl px-4 py-16 sm:py-20">
      <Reveal>
        <DashboardWelcome />
      </Reveal>

      <h2 class="sr-only">Your dashboard</h2>
      <div class="mt-10 grid gap-4 sm:grid-cols-2">
        <Reveal v-for="(link, i) in links" :key="link.to" :delay="0.05 * i">
          <QuickLinkCard v-bind="link" />
        </Reveal>
      </div>
    </section>

    <AppFooter />
  </main>
</template>
