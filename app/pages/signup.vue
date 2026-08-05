<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

useHead({ title: 'Sign up — Streamify' })

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const pending = ref(false)

async function onSubmit() {
  error.value = ''
  pending.value = true
  const { error: authError } = await authClient.signUp.email({ name: name.value, email: email.value, password: password.value })
  pending.value = false
  if (authError) {
    error.value = authError.message || 'Could not create your account.'
    return
  }
  await navigateTo('/')
}
</script>

<template>
  <AuthCard title="Create your channel" subtitle="Free to start. No credit card required.">
    <form class="space-y-4" @submit.prevent="onSubmit">
      <AuthFormField id="name" v-model="name" label="Name" autocomplete="name" />
      <AuthFormField id="email" v-model="email" label="Email" type="email" autocomplete="email" />
      <AuthFormField id="password" v-model="password" label="Password" type="password" autocomplete="new-password" />
      <p v-if="error" class="text-sm text-destructive" role="alert">{{ error }}</p>
      <Button type="submit" size="lg" class="w-full" :disabled="pending">
        {{ pending ? 'Creating account…' : 'Start streaming free' }}
      </Button>
    </form>
    <template #footer>
      Already have an account?
      <NuxtLink to="/login" class="font-medium text-primary hover:underline">Log in</NuxtLink>
    </template>
  </AuthCard>
</template>
