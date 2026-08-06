<script setup lang="ts">
const yearly = ref(false)

const plans = computed(() => [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    blurb: 'Everything you need to run your first stream.',
    features: ['1080p60 ingest', 'Automatic VOD for 14 days', 'Live chat + moderation', 'Basic analytics'],
    cta: 'Start free'
  },
  {
    name: 'Creator',
    price: yearly.value ? '$15' : '$19',
    period: '/mo',
    blurb: 'For creators streaming on a schedule.',
    features: [
      'Everything in Starter',
      '4K60 ingest + WHIP low latency',
      'Unlimited VOD retention',
      'Clips + subscriber-only chat',
      'Full analytics history'
    ],
    cta: 'Start 14-day trial',
    featured: true
  },
  {
    name: 'Studio',
    price: yearly.value ? '$39' : '$49',
    period: '/mo',
    blurb: 'For teams and multi-channel operations.',
    features: [
      'Everything in Creator',
      'Multiple channels',
      'Team roles + audit log',
      'Priority ingest regions',
      'API access'
    ],
    cta: 'Start 14-day trial'
  }
])
</script>

<template>
  <section id="pricing" class="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
    <Reveal>
      <SectionHeading
        eyebrow="Pricing"
        title="Priced for creators, not enterprises"
        subtitle="Start free and stay free until streaming is actually part of your week. Every plan includes chat, moderation and VOD."
      />
    </Reveal>

    <Reveal :delay="0.06">
      <div class="mt-10 flex items-center justify-center gap-3">
        <span :class="['text-sm', yearly ? 'text-muted-foreground' : 'text-foreground']">Monthly</span>
        <button
          type="button"
          role="switch"
          :aria-checked="yearly"
          aria-label="Bill yearly and save 20%"
          class="relative h-6 w-11 cursor-pointer rounded-full border border-border bg-foreground/10 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          @click="yearly = !yearly"
        >
          <span
            :class="[
              'absolute top-0.5 size-4.5 rounded-full bg-primary transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
              yearly ? 'translate-x-5.5' : 'translate-x-0.5'
            ]"
          />
        </button>
        <span :class="['text-sm', yearly ? 'text-foreground' : 'text-muted-foreground']">
          Yearly
          <span class="ml-1 rounded-md bg-success/15 px-1.5 py-0.5 text-[11px] font-medium text-success">Save 20%</span>
        </span>
      </div>
    </Reveal>

    <div class="mt-14 grid gap-5 lg:grid-cols-3">
      <Reveal v-for="(plan, i) in plans" :key="plan.name" class="h-full" :delay="i * 0.08">
        <PricingCard v-bind="plan" />
      </Reveal>
    </div>
  </section>
</template>
