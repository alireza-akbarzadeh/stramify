<script setup lang="ts">
import type { CommentDraft, CommentSort, WatchComment } from '#shared/types/watch'
import { Button } from '@/components/ui/button'
import { countComments } from '@/utils/comments'
import { useAuthStore } from '@/stores/auth'
import WatchCommentComposer from './WatchCommentComposer.vue'
import WatchCommentItem from './WatchCommentItem.vue'

const props = defineProps<{
  comments: WatchComment[]
  pending: boolean
  errored: boolean
  posting: boolean
}>()

const auth = useAuthStore()
const sort = defineModel<CommentSort>('sort', { required: true })
const emit = defineEmits<{
  (e: 'retry'): void
  (e: 'like' | 'remove', id: string): void
  (e: 'post', draft: CommentDraft): void
}>()

const total = computed(() => countComments(props.comments))
</script>

<template>
  <section aria-labelledby="comments-heading">
    <div class="mb-6 flex flex-wrap items-center gap-4">
      <h2 id="comments-heading" class="text-base font-semibold text-foreground">
        {{ pending ? 'Comments' : `${total} ${total === 1 ? 'comment' : 'comments'}` }}
      </h2>
      <div
        v-if="!pending && !errored && comments.length"
        class="flex gap-1 rounded-lg border border-border bg-muted p-1"
        role="tablist"
        aria-label="Sort comments"
      >
        <Button
          v-for="option in (['top', 'new'] as const)"
          :key="option"
          type="button"
          size="sm"
          role="tab"
          :variant="sort === option ? 'default' : 'ghost'"
          :aria-selected="sort === option"
          @click="sort = option"
        >
          {{ option === 'top' ? 'Top' : 'Newest' }}
        </Button>
      </div>
    </div>

    <WatchCommentComposer
      v-if="auth.isAuthenticated"
      class="mb-8"
      :pending="posting"
      @submit="emit('post', { body: $event, parentId: null })"
    />
    <p v-else class="mb-8 rounded-lg bg-surface-2 px-4 py-3 text-sm text-muted-foreground">
      <NuxtLink to="/login" class="font-semibold text-primary hover:underline">Log in</NuxtLink>
      to join the conversation.
    </p>

    <div v-if="pending" class="space-y-6">
      <div v-for="n in 3" :key="n" class="flex gap-3">
        <div class="size-9 shrink-0 animate-pulse rounded-full bg-muted" />
        <div class="flex-1 space-y-2">
          <div class="h-3 w-32 animate-pulse rounded bg-muted" />
          <div class="h-4 w-full animate-pulse rounded bg-muted" />
          <div class="h-4 w-4/5 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>

    <div
      v-else-if="errored"
      class="rounded-lg border border-dashed border-destructive/40 py-12 text-center"
    >
      <p class="text-sm font-medium text-foreground">Couldn't load comments</p>
      <Button type="button" variant="outline" size="sm" class="mt-3" @click="emit('retry')">
        Retry
      </Button>
    </div>

    <p
      v-else-if="!comments.length"
      class="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground"
    >
      No comments on this one yet. {{ auth.isAuthenticated ? 'Be the first.' : '' }}
    </p>

    <div v-else class="space-y-6">
      <WatchCommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :posting="posting"
        @like="emit('like', $event)"
        @remove="emit('remove', $event)"
        @reply="emit('post', $event)"
      />
    </div>
  </section>
</template>
