<script setup lang="ts">
import { Bookmark, BookmarkCheck } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{ saved: boolean; label: string; class?: string }>(), {
  class: undefined
})
const emit = defineEmits<{ (e: 'toggle'): void }>()
</script>

<template>
  <Button
    type="button"
    size="icon"
    variant="ghost"
    :aria-pressed="saved"
    :aria-label="saved ? `Remove ${label} from watchlist` : `Save ${label} to watchlist`"
    :class="
      cn(
        'size-9 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background',
        saved ? 'text-primary' : 'text-foreground',
        props.class
      )
    "
    @click="emit('toggle')"
  >
    <component :is="saved ? BookmarkCheck : Bookmark" />
  </Button>
</template>
