<script setup lang="ts">
import { Lock, Mail, User } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/sonner'
import { authClient } from '@/lib/auth-client'

useHead({ title: 'Sign up — Streamify' })

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const pending = ref(false)

// Mirrors the server's minPasswordLength so the user gets the rule before
// submitting rather than as a round-trip rejection.
const passwordError = computed(() =>
  password.value && password.value.length < 8 ? 'Use at least 8 characters.' : ''
)

async function onSubmit() {
  if (passwordError.value) return
  error.value = ''
  pending.value = true
  const { error: authError } = await authClient.signUp.email({
    name: name.value,
    email: email.value,
    password: password.value
  })
  pending.value = false
  if (authError) {
    error.value = authError.message || 'Could not create your account.'
    toast.error(error.value)
    return
  }
  await navigateTo('/')
}
</script>

<template>
  <AuthLayout title="Create your channel" subtitle="Free to start. No credit card required.">
    <form class="space-y-5" @submit.prevent="onSubmit">
      <SocialAuthButtons @error="error = $event; toast.error($event)" />

      <AuthFormField
        id="name"
        v-model="name"
        label="Name"
        autocomplete="name"
        placeholder="Your display name"
        :icon="User"
      />
      <AuthFormField
        id="email"
        v-model="email"
        label="Email"
        type="email"
        autocomplete="email"
        placeholder="you@example.com"
        :icon="Mail"
      />
      <AuthFormField
        id="password"
        v-model="password"
        label="Password"
        type="password"
        autocomplete="new-password"
        placeholder="At least 8 characters"
        :icon="Lock"
        :error="passwordError"
      />

      <AuthAlert v-if="error" :message="error" />

      <Button type="submit" size="lg" class="w-full" :disabled="pending || !!passwordError">
        {{ pending ? 'Creating account…' : 'Start streaming free' }}
      </Button>

      <p class="text-center text-xs leading-relaxed text-muted-foreground">
        By creating an account you agree to our
        <NuxtLink to="/terms" class="text-foreground hover:underline">Terms</NuxtLink>
        and
        <NuxtLink to="/privacy" class="text-foreground hover:underline">Privacy Policy</NuxtLink>.
      </p>
    </form>

    <template #footer>
      Already have an account?
      <NuxtLink to="/login" class="font-medium text-primary hover:underline">Log in</NuxtLink>
    </template>
  </AuthLayout>
</template>
