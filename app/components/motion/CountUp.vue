<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import { useCountUp } from '@/composables/useCountUp'

const props = withDefaults(
  defineProps<{ to: number; decimals?: number; prefix?: string; suffix?: string }>(),
  { decimals: 0, prefix: '', suffix: '' }
)

const el = ref<HTMLElement | null>(null)
const { current, start } = useCountUp(props.to)

const { stop } = useIntersectionObserver(el, ([entry]) => {
  if (!entry?.isIntersecting) return
  start()
  stop()
})

const display = computed(() =>
  current.value.toLocaleString('en-US', {
    minimumFractionDigits: props.decimals,
    maximumFractionDigits: props.decimals
  })
)
</script>

<template>
  <span ref="el" class="tabular-nums">{{ prefix }}{{ display }}{{ suffix }}</span>
</template>
