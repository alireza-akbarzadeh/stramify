<script setup lang="ts">
import {
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  BoltIcon
} from '@heroicons/vue/24/outline'

useHead({
  title: 'Streamify — Live streaming, reimagined'
})

const features = [
  {
    icon: VideoCameraIcon,
    title: 'Go live in seconds',
    body: 'RTMP or low-latency WHIP ingest, adaptive bitrate playback, and automatic recording to VOD — no infrastructure to run.'
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Real-time chat, built in',
    body: 'Moderation, slow mode, and subscriber-only chat ship with every channel, with reconnect handling that just works.'
  },
  {
    icon: ChartBarIcon,
    title: 'Analytics that matter',
    body: 'Concurrent viewers, watch time, and audience growth in one dashboard — built for creators, not spreadsheets.'
  },
  {
    icon: BoltIcon,
    title: 'Fast, everywhere',
    body: 'A player tuned for mobile and desktop alike, with theater mode, captions, and picture-in-picture out of the box.'
  }
]

const stats = [
  ['<1s', 'Ingest to first frame'],
  ['4K60', 'Max stream quality'],
  ['99.9%', 'Playback uptime target']
]
</script>

<template>
  <main id="main-content">
    <AppHeader />

    <!-- Hero -->
    <section class="relative overflow-hidden border-b border-white/10">
      <div
        class="pointer-events-none absolute inset-0"
        style="background: radial-gradient(60% 50% at 50% 0%, rgba(225,29,72,0.18) 0%, rgba(15,15,35,0.0) 60%), linear-gradient(180deg, #0f0f23 0%, #000000 70%);"
        aria-hidden="true"
      />
      <div class="relative mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
        <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
          <span class="h-1.5 w-1.5 rounded-full bg-rose-500" aria-hidden="true" />
          Now in early access
        </span>

        <h1 class="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          Live streaming, built for creators who move fast.
        </h1>

        <p class="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          Streamify pairs a premium, distraction-free viewing experience with a creator dashboard
          that actually respects your time. Stream, chat, and grow your audience — all in one place.
        </p>

        <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <NuxtLink
            to="/signup"
            class="cursor-pointer rounded-lg bg-rose-600 px-6 py-3 text-base font-semibold text-white shadow-xl transition-all duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Start streaming free
          </NuxtLink>
          <NuxtLink
            to="/live"
            class="cursor-pointer rounded-lg border-2 border-white/20 px-6 py-3 text-base font-semibold text-white transition-all duration-200 hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            Browse live channels
          </NuxtLink>
        </div>

        <dl class="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/10 pt-10">
          <div v-for="[value, label] in stats" :key="label">
            <dt class="sr-only">{{ label }}</dt>
            <dd class="text-2xl font-semibold text-white sm:text-3xl">{{ value }}</dd>
            <p class="mt-1 text-xs text-slate-400 sm:text-sm">{{ label }}</p>
          </div>
        </dl>
      </div>
    </section>

    <!-- Features -->
    <section class="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Everything a stream needs</h2>
        <p class="mt-4 text-slate-400">No plugins, no separate dashboards, no guesswork.</p>
      </div>

      <div class="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="rounded-xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.04]"
        >
          <component :is="feature.icon" class="h-8 w-8 text-rose-500" aria-hidden="true" />
          <h3 class="mt-4 text-base font-semibold text-white">{{ feature.title }}</h3>
          <p class="mt-2 text-sm leading-relaxed text-slate-400">{{ feature.body }}</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="border-t border-white/10">
      <div class="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h2 class="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Your channel is one click away.
        </h2>
        <p class="mt-4 text-slate-400">Free to start. No credit card required.</p>
        <NuxtLink
          to="/signup"
          class="mt-8 inline-block cursor-pointer rounded-lg bg-rose-600 px-6 py-3 text-base font-semibold text-white shadow-xl transition-all duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          Create your channel
        </NuxtLink>
      </div>
    </section>

    <AppFooter />
  </main>
</template>
