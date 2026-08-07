<script setup lang="ts">
import type {
  CommentDraft,
  CommentSort,
  ReactionValue,
  RelatedItem,
  WatchTarget
} from '#shared/types/watch'
import type { ChatPanel, CommentsPanel, RelatedPanel, WatchEngagement } from './types'
import WatchPlayer from './WatchPlayer.vue'
import WatchMeta from './WatchMeta.vue'
import WatchActions from './WatchActions.vue'
import WatchChannelBar from './WatchChannelBar.vue'
import WatchDescription from './WatchDescription.vue'
import WatchComments from './WatchComments.vue'
import WatchChat from './WatchChat.vue'
import WatchUpNext from './WatchUpNext.vue'

/**
 * Presentational shell for the watch page. Holds no data-fetching of its own so
 * it can be driven either by `WatchView.vue` (real APIs) or by the fixtures on
 * `/zz-watch-preview`. All state arrives as props; every interaction emits.
 *
 * Layout: one column below `lg`, two columns at `lg` and up. The aside is a
 * normal block in the mobile flow, which is what puts the sidebar *below the
 * video* on narrow screens, and `order-2` keeps it above the comment list
 * there so live chat sits right under the player on a phone.
 */
defineProps<{
  target: WatchTarget
  engagement: WatchEngagement
  related: RelatedPanel
  comments: CommentsPanel
  chat: ChatPanel
  isSaved: (id: string) => boolean
}>()

const sort = defineModel<CommentSort>('sort', { required: true })

defineEmits<{
  (e: 'react', value: ReactionValue): void
  (e: 'send-chat', body: string): void
  (e: 'toggle-save-related', item: RelatedItem): void
  (e: 'post-comment', draft: CommentDraft): void
  (e: 'like-comment' | 'remove-comment', id: string): void
  (e: 'play-start' | 'toggle-save' | 'share' | 'toggle-follow'): void
  (e: 'retry-related' | 'retry-comments' | 'retry-chat'): void
}>()
</script>

<template>
  <div class="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-x-8">
    <div class="order-1 min-w-0 space-y-4 lg:col-start-1 lg:row-start-1">
      <WatchPlayer :target="target" @play-start="$emit('play-start')" />
      <WatchMeta :target="target" />
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <WatchChannelBar
          class="min-w-0 flex-1"
          :channel="engagement.channel"
          :name="target.channel"
          :pending="engagement.followPending"
          @toggle-follow="$emit('toggle-follow')"
        />
        <WatchActions
          :reactions="engagement.reactions"
          :saved="engagement.saved"
          :pending="engagement.reactPending"
          @react="$emit('react', $event)"
          @toggle-save="$emit('toggle-save')"
          @share="$emit('share')"
        />
      </div>
      <WatchDescription
        :description="target.description"
        :summary="
          target.kind === 'live'
            ? `${target.viewers} · live for ${target.uptime}`
            : `${target.views} · ${target.publishedAt}`
        "
      />
    </div>

    <aside class="order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2">
      <div class="space-y-6 lg:sticky lg:top-20">
        <WatchChat
          v-if="target.kind === 'live'"
          :messages="chat.items"
          :pending="chat.pending"
          :errored="chat.errored"
          :can-post="chat.canPost"
          :sending="chat.sending"
          @send="$emit('send-chat', $event)"
          @retry="$emit('retry-chat')"
        />
        <WatchUpNext
          :items="related.items"
          :pending="related.pending"
          :errored="related.errored"
          :is-saved="isSaved"
          @retry="$emit('retry-related')"
          @toggle-save="$emit('toggle-save-related', $event)"
        />
      </div>
    </aside>

    <div v-if="target.kind === 'clip'" class="order-3 min-w-0 lg:col-start-1 lg:row-start-2">
      <WatchComments
        v-model:sort="sort"
        :comments="comments.items"
        :pending="comments.pending"
        :errored="comments.errored"
        :can-post="comments.canPost"
        :author-name="comments.authorName"
        :author-image="comments.authorImage"
        :posting="comments.posting"
        @retry="$emit('retry-comments')"
        @post="$emit('post-comment', $event)"
        @like="$emit('like-comment', $event)"
        @remove="$emit('remove-comment', $event)"
      />
    </div>
  </div>
</template>
