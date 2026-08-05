<script setup lang="ts">
import { Input } from '@/components/ui/input'

defineProps<{
  id: string
  label: string
  type?: string
  autocomplete?: string
  error?: string
}>()

const modelValue = defineModel<string>({ required: true })
</script>

<template>
  <div class="space-y-1.5">
    <label :for="id" class="text-xs font-medium uppercase tracking-wide text-muted-foreground">{{ label }}</label>
    <Input
      :id="id"
      v-model="modelValue"
      :type="type || 'text'"
      :autocomplete="autocomplete"
      :aria-invalid="!!error"
      required
    />
    <p v-if="error" class="text-sm text-destructive" role="alert">{{ error }}</p>
  </div>
</template>
