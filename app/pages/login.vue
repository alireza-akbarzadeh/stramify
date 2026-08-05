<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

useHead({ title: 'Log in — Streamify' })

const email = ref('')
const password = ref('')
const error = ref('')
const pending = ref(false)

async function onSubmit() {
  error.value = ''
  pending.value = true
  const { error: authError } = await authClient.signIn.email({ email: email.value, password: password.value })
  pending.value = false
  if (authError) {
    error.value = authError.message || 'Could not log in. Check your email and password.'
    return
  }
  await navigateTo('/')
}
</script>

<template>
  <AuthCard title="Welcome back" subtitle="Log in to keep streaming.">
    <form class="space-y-4" @submit.prevent="onSubmit">
      <AuthFormField id="email" v-model="email" label="Email" type="email" autocomplete="email" />
      <AuthFormField id="password" v-model="password" label="Password" type="password" autocomplete="current-password" />
      <p v-if="error" class="text-sm text-destructive" role="alert">{{ error }}</p>
      <Button type="submit" size="lg" class="w-full" :disabled="pending">
        {{ pending ? 'Logging in…' : 'Log in' }}
      </Button>
    </form>
    <template #footer>
      Don't have an account?
      <NuxtLink to="/signup" class="font-medium text-primary hover:underline">Sign up</NuxtLink>
    </template>
  </AuthCard>
</template>
