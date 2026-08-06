<script setup lang="ts">
import { authClient } from '@/lib/auth-client'

const emit = defineEmits<{ (e: 'error', message: string): void }>()

// Only providers with credentials on the server are offered — a button that
// always fails is worse than no button (CLAUDE.md rule 2).
const { data } = await useFetch('/api/auth-providers')
const pending = ref('')

const labels: Record<string, string> = { google: 'Google', github: 'GitHub' }
const available = computed(() => data.value?.providers ?? [])

async function signIn(provider: string) {
  pending.value = provider
  const { error } = await authClient.signIn.social({ provider, callbackURL: '/' })
  pending.value = ''
  if (error) emit('error', error.message || `Could not continue with ${labels[provider] ?? provider}.`)
}
</script>

<template>
  <div v-if="available.length" class="space-y-3">
    <button
      v-for="provider in available"
      :key="provider"
      type="button"
      :disabled="!!pending"
      class="flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-border bg-surface text-sm font-medium text-foreground transition-all duration-200 hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      @click="signIn(provider)"
    >
      <AuthProviderIcon :provider="provider" />
      {{ pending === provider ? 'Redirecting…' : `Continue with ${labels[provider] ?? provider}` }}
    </button>

    <div class="flex items-center gap-3 py-1">
      <span class="h-px flex-1 bg-border" />
      <span class="text-xs uppercase tracking-wider text-muted-foreground">or</span>
      <span class="h-px flex-1 bg-border" />
    </div>
  </div>
</template>
