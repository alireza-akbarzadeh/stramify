<script setup lang="ts">
import { Play } from '@lucide/vue'
import type { Clip } from '#shared/types/discovery'
import { Button } from '@/components/ui/button'
import SaveButton from './SaveButton.vue'

defineProps<{ clip: Clip; saved: boolean }>()
const emit = defineEmits<{ (e: 'play' | 'toggle-save'): void }>()
</script>

<template>
  <section aria-labelledby="featured-heading" class="grid grid-cols-12 gap-6">
    <div
      class="relative col-span-12 aspect-video overflow-hidden rounded-xl bg-muted lg:col-span-8"
    >
      <img
        :src="clip.image"
        :alt="clip.title"
        width="1600"
        height="900"
        class="size-full object-cover"
      />
      <div
        class="absolute inset-0 bg-linear-to-t from-background/80 via-background/10 to-transparent"
      />
      <div
        class="absolute left-5 top-5 inline-flex items-center gap-2 rounded-md bg-primary px-2 py-1 sm:left-6 sm:top-6"
      >
        <span
          class="size-1.5 rounded-full bg-primary-foreground animate-[pulse-ring_2s_ease-out_infinite] motion-reduce:animate-none"
          aria-hidden="true"
        />
        <span class="text-[11px] font-bold uppercase tracking-widest text-primary-foreground"
          >Trending now</span
        >
      </div>
      <SaveButton
        :saved="saved"
        :label="clip.title"
        class="absolute right-5 top-5 sm:right-6 sm:top-6"
        @toggle="emit('toggle-save')"
      />
      <div class="absolute inset-x-0 bottom-0 p-5 sm:p-8">
        <h1
          id="featured-heading"
          class="mb-4 max-w-[40ch] text-3xl font-semibold leading-tight text-foreground sm:text-4xl"
        >
          {{ clip.title }}
        </h1>
        <div class="flex flex-wrap items-center gap-4">
          <span class="text-sm font-semibold text-foreground">{{ clip.creator }}</span>
          <span class="text-sm text-muted-foreground">{{ clip.views }}</span>
        </div>
      </div>
      <Button
        type="button"
        size="icon"
        aria-label="Play featured highlight"
        class="absolute bottom-5 right-5 size-12 rounded-full sm:bottom-8 sm:right-8"
        @click="emit('play')"
      >
        <Play class="fill-current" />
      </Button>
    </div>

    <div
      class="col-span-12 flex flex-col justify-between rounded-xl border border-border bg-card p-6 sm:p-8 lg:col-span-4"
    >
      <div>
        <p class="mb-3 text-xs font-bold uppercase tracking-wide text-primary">Signal brief</p>
        <p class="max-w-[32ch] text-sm leading-relaxed text-muted-foreground">
          Caught during the final minutes of the broadcast — engagement surged 400% in the last
          hour.
        </p>
      </div>
      <div class="mt-10 space-y-4">
        <div class="h-px w-full bg-border" />
        <div class="flex items-end justify-between">
          <div>
            <p class="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">Duration</p>
            <p class="text-lg font-semibold text-foreground">{{ clip.duration }}</p>
          </div>
          <div class="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              :aria-pressed="saved"
              @click="emit('toggle-save')"
            >
              {{ saved ? 'Saved' : 'Save' }}
            </Button>
            <Button
              type="button"
              size="icon"
              aria-label="Play featured clip"
              class="size-11 rounded-full"
              @click="emit('play')"
            >
              <Play class="fill-current" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
