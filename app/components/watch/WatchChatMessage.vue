<script setup lang="ts">
import type { ChatMessage } from '#shared/types/watch'
import { formatRelativeTime } from '#shared/utils/format'
import ChannelAvatar from './ChannelAvatar.vue'

const props = defineProps<{ message: ChatMessage; pending?: boolean }>()

const age = computed(() => formatRelativeTime(props.message.createdAt))
</script>

<template>
  <li :class="['flex gap-2 px-3 py-1.5 text-sm', pending && 'opacity-60']">
    <ChannelAvatar :name="message.authorName" class="size-6 text-[10px]" />
    <p class="min-w-0 flex-1 break-words leading-relaxed">
      <span class="font-semibold text-foreground">{{ message.authorName }}</span>
      <span class="ml-1.5 text-[11px] text-muted-foreground">{{ age }}</span>
      <br />
      <span class="text-muted-foreground">{{ message.body }}</span>
    </p>
  </li>
</template>
