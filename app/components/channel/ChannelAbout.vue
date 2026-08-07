<script setup lang="ts">
import { CalendarDays, Eye, Link2, MapPin, Users, Video } from '@lucide/vue'
import type { ChannelProfile } from '#shared/types/channel'
import { toCategorySlug } from '#shared/utils/category'
import { formatCount } from '#shared/utils/format'

const props = defineProps<{ profile: ChannelProfile }>()

/** Blank lines are paragraph breaks, same convention as clip descriptions. */
const paragraphs = computed(() =>
  props.profile.bio.split(/\n{2,}/).map((text) => text.trim()).filter(Boolean)
)

const stats = computed(() => [
  { icon: Users, label: 'Followers', value: formatCount(props.profile.followerCount) },
  { icon: Eye, label: 'Total views', value: props.profile.totalViews },
  { icon: Video, label: 'Videos', value: String(props.profile.clipCount) },
  { icon: CalendarDays, label: 'Joined', value: props.profile.joinedAt || 'Unknown' }
])
</script>

<template>
  <section class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
    <div class="space-y-4">
      <h2 class="text-lg font-semibold text-foreground">About</h2>
      <template v-if="paragraphs.length">
        <p
          v-for="(paragraph, index) in paragraphs"
          :key="index"
          class="max-w-2xl text-sm leading-relaxed text-muted-foreground"
        >
          {{ paragraph }}
        </p>
      </template>
      <p v-else class="text-sm text-muted-foreground">
        {{ profile.name }} hasn't written a description yet.
      </p>

      <div v-if="profile.categories.length" class="flex flex-wrap gap-2 pt-2">
        <NuxtLink
          v-for="category in profile.categories"
          :key="category"
          :to="`/category/${toCategorySlug(category)}`"
          class="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-white/20 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {{ category }}
        </NuxtLink>
      </div>
    </div>

    <aside class="space-y-4 rounded-2xl border border-border bg-card/40 p-5">
      <dl class="space-y-3">
        <div v-for="stat in stats" :key="stat.label" class="flex items-center justify-between gap-3">
          <dt class="flex items-center gap-2 text-sm text-muted-foreground">
            <component :is="stat.icon" class="size-4" aria-hidden="true" />
            {{ stat.label }}
          </dt>
          <dd class="text-sm font-semibold text-foreground">{{ stat.value }}</dd>
        </div>
      </dl>

      <div
        v-if="profile.location || profile.websiteUrl"
        class="space-y-3 border-t border-border pt-4"
      >
        <p v-if="profile.location" class="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin class="size-4" aria-hidden="true" />
          {{ profile.location }}
        </p>
        <a
          v-if="profile.websiteUrl"
          :href="profile.websiteUrl"
          target="_blank"
          rel="noopener noreferrer nofollow"
          class="flex items-center gap-2 truncate text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Link2 class="size-4 shrink-0" aria-hidden="true" />
          {{ profile.websiteUrl.replace(/^https?:\/\//, '') }}
        </a>
      </div>
    </aside>
  </section>
</template>
