<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: string
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue
})
</script>

<template>
  <input
    v-model="modelValue"
    :class="
      cn(
        'flex h-11 w-full min-w-0 rounded-lg border border-input bg-white/3 px-3.5 py-2 text-base text-foreground shadow-sm backdrop-blur-sm transition-all duration-200 outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:bg-white/6 focus-visible:border-ring focus-visible:shadow-[0_0_0_3px_rgba(225,29,72,0.15)] aria-invalid:border-destructive aria-invalid:shadow-[0_0_0_3px_rgba(239,68,68,0.15)] md:text-sm',
        props.class
      )
    "
  >
</template>
