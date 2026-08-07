<script setup lang="ts">
import { Bookmark, BookmarkCheck, Link2, ThumbsDown, ThumbsUp } from '@lucide/vue'
import type { ReactionSummary, ReactionValue } from '#shared/types/watch'
import { formatCount } from '#shared/utils/format'
import { Button } from '@/components/ui/button'

const props = defineProps<{ reactions: ReactionSummary; saved: boolean; pending?: boolean }>()
const emit = defineEmits<{
  (e: 'react', value: ReactionValue): void
  (e: 'toggle-save' | 'share'): void
}>()

const likes = computed(() => formatCount(props.reactions.likes))
const dislikes = computed(() => formatCount(props.reactions.dislikes))
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <div class="flex items-center rounded-md border border-border bg-surface-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        class="rounded-r-none"
        :aria-pressed="reactions.mine === 'like'"
        :aria-label="`Like — ${likes} likes`"
        :disabled="pending"
        @click="emit('react', 'like')"
      >
        <ThumbsUp :class="reactions.mine === 'like' ? 'fill-current text-primary' : ''" />
        {{ likes }}
      </Button>
      <span class="h-5 w-px bg-border" aria-hidden="true" />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        class="rounded-l-none"
        :aria-pressed="reactions.mine === 'dislike'"
        :aria-label="`Dislike — ${dislikes} dislikes`"
        :disabled="pending"
        @click="emit('react', 'dislike')"
      >
        <ThumbsDown :class="reactions.mine === 'dislike' ? 'fill-current text-primary' : ''" />
        <span class="sr-only sm:not-sr-only">{{ dislikes }}</span>
      </Button>
    </div>

    <Button type="button" variant="outline" size="sm" @click="emit('share')">
      <Link2 />
      Share
    </Button>

    <Button
      type="button"
      variant="outline"
      size="sm"
      :aria-pressed="saved"
      @click="emit('toggle-save')"
    >
      <component :is="saved ? BookmarkCheck : Bookmark" />
      {{ saved ? 'Saved' : 'Save' }}
    </Button>
  </div>
</template>
