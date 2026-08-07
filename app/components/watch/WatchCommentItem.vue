<script setup lang="ts">
import { ThumbsUp, Trash2 } from '@lucide/vue'
import type { CommentDraft, WatchComment } from '#shared/types/watch'
import { formatCount } from '#shared/utils/format'
import { Button } from '@/components/ui/button'
import ChannelAvatar from '@/components/ChannelAvatar.vue'
import WatchCommentComposer from './WatchCommentComposer.vue'

/**
 * One comment and its replies. Replies render through this same component with
 * `nested`, which hides their own reply button — the thread is one level deep
 * (see `comments.post.ts`), so a reply-to-a-reply would have nowhere to go.
 */
defineProps<{
  comment: WatchComment
  nested?: boolean
  canPost: boolean
  authorName: string | null
  authorImage: string | null
  posting: boolean
}>()
const emit = defineEmits<{
  (e: 'like' | 'remove', id: string): void
  (e: 'reply', draft: CommentDraft): void
}>()

const replying = ref(false)

function send(body: string, parentId: string) {
  emit('reply', { body, parentId })
  replying.value = false
}
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

      <div class="mt-1 flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          class="h-8 px-2 text-xs text-muted-foreground"
          :aria-pressed="comment.likedByMe"
          :aria-label="`Like comment by ${comment.authorName} — ${formatCount(comment.likes)} likes`"
          @click="emit('like', comment.id)"
        >
          <ThumbsUp :class="['size-3.5', comment.likedByMe && 'fill-current text-primary']" />
          {{ formatCount(comment.likes) }}
        </Button>

        <Button
          v-if="!nested"
          type="button"
          variant="ghost"
          size="sm"
          class="h-8 px-2 text-xs font-semibold text-muted-foreground"
          @click="replying = !replying"
        >
          Reply
        </Button>

        <Button
          v-if="comment.isMine"
          type="button"
          variant="ghost"
          size="sm"
          class="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
          :aria-label="`Delete your comment`"
          @click="emit('remove', comment.id)"
        >
          <Trash2 class="size-3.5" />
          Delete
        </Button>
      </div>

      <WatchCommentComposer
        v-if="replying && canPost"
        compact
        :author-name="authorName"
        :author-image="authorImage"
        :pending="posting"
        :placeholder="`Replying to ${comment.authorName}…`"
        submit-label="Reply"
        @submit="send($event, comment.id)"
        @cancel="replying = false"
      />
      <p v-else-if="replying" class="mt-3 text-xs text-muted-foreground">
        <NuxtLink to="/login" class="font-semibold text-primary hover:underline">Log in</NuxtLink>
        to reply.
      </p>

      <div v-if="comment.replies.length" class="mt-4 space-y-4">
        <WatchCommentItem
          v-for="reply in comment.replies"
          :key="reply.id"
          nested
          :comment="reply"
          :can-post="canPost"
          :author-name="authorName"
          :author-image="authorImage"
          :posting="posting"
          @like="emit('like', $event)"
          @remove="emit('remove', $event)"
          @reply="emit('reply', $event)"
        />
      </div>
    </div>
  </article>
</template>
