<script setup lang="ts">
import { ThumbsUp } from '@lucide/vue'
import type { WatchComment } from '#shared/types/watch'
import { formatCount } from '#shared/utils/format'
import ChannelAvatar from './ChannelAvatar.vue'

defineProps<{ comment: WatchComment; nested?: boolean }>()
</script>

<template>
  <article :class="['flex gap-3', nested && 'ml-6 sm:ml-11']">
    <ChannelAvatar
      :name="comment.authorName"
      :image="comment.authorImage"
      :class="nested ? 'size-7 text-[11px]' : 'size-9'"
    />
    <div class="min-w-0 flex-1">
      <p class="flex flex-wrap items-baseline gap-2 text-sm">
        <span class="font-semibold text-foreground">{{ comment.authorName }}</span>
        <span class="text-xs text-muted-foreground">{{ comment.age }}</span>
      </p>
      <p class="mt-1 whitespace-pre-line break-words text-sm text-muted-foreground">
        {{ comment.body }}
      </p>
      <p class="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <ThumbsUp class="size-3.5" aria-hidden="true" />
        {{ formatCount(comment.likes) }}
      </p>

      <div v-if="comment.replies.length" class="mt-4 space-y-4">
        <WatchCommentItem
          v-for="reply in comment.replies"
          :key="reply.id"
          :comment="reply"
          nested
        />
      </div>
    </div>
  </article>
</template>
