<script setup lang="ts">
import { Play } from '@lucide/vue'
import type { Clip } from '#shared/types/discovery'
import SaveButton from './SaveButton.vue'

defineProps<{ clip: Clip; saved: boolean }>()
const emit = defineEmits<{ (e: 'play' | 'toggle-save'): void }>()
</script>

<template>
  <article class="group space-y-3">
    <div class="relative">
      <button
        type="button"
        :aria-label="`Play ${clip.title}`"
        class="relative block aspect-video w-full overflow-hidden rounded-lg bg-muted text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        @click="emit('play')"
      >
        <img
          :src="clip.image"
          :alt="clip.title"
          width="960"
          height="540"
          loading="lazy"
          class="size-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span
          class="absolute bottom-2 right-2 rounded-sm bg-background/90 px-1.5 py-0.5 text-[11px] font-semibold text-foreground"
          >{{ clip.duration }}</span
        >
        <span
          class="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 transition group-hover:opacity-100"
        >
          <span
            class="flex size-10 items-center justify-center rounded-full bg-foreground text-background"
          >
            <Play class="size-4 fill-current" />
          </span>
        </span>
      </button>
      <SaveButton
        :saved="saved"
        :label="clip.title"
        class="absolute right-2 top-2"
        @toggle="emit('toggle-save')"
      />
    </div>
    <div>
      <h3
        class="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary"
      >
        {{ clip.title }}
      </h3>
      <div class="mt-1 flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <p class="truncate">{{ clip.creator }} · {{ clip.age }}</p>
        <p class="shrink-0">{{ clip.views }}</p>
      </div>
    </div>
  </article>
</template>
