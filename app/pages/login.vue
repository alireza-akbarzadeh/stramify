<script setup lang="ts">
import { Lock, Mail, ShieldCheck } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

useHead({ title: 'Log in — Streamify' })

const email = ref('')
const password = ref('')
const remember = ref(true)
const error = ref('')
const pending = ref(false)

/** 'credentials' → email+password, 'twoFactor' → TOTP challenge. */
const step = ref<'credentials' | 'twoFactor'>('credentials')
const otp = ref<string[]>([])
const useBackupCode = ref(false)
const backupCode = ref('')

async function onSubmit() {
  error.value = ''
  pending.value = true
  const { data, error: authError } = await authClient.signIn.email({
    email: email.value,
    password: password.value,
    rememberMe: remember.value
  })
  pending.value = false

  if (authError) {
    error.value = authError.message || 'Those credentials did not match an account.'
    return
  }
  // better-auth signals "password OK, now prove the second factor".
  if ((data as { twoFactorRedirect?: boolean } | null)?.twoFactorRedirect) {
    step.value = 'twoFactor'
    return
  }
  await navigateTo('/')
}

async function verifyTotp(code: string) {
  error.value = ''
  pending.value = true
  const { error: authError } = await authClient.twoFactor.verifyTotp({ code })
  pending.value = false
  if (authError) {
    error.value = authError.message || 'That code was not valid. Try the next one.'
    otp.value = []
    return
  }
  await navigateTo('/')
}

async function verifyBackup() {
  error.value = ''
  pending.value = true
  const { error: authError } = await authClient.twoFactor.verifyBackupCode({ code: backupCode.value })
  pending.value = false
  if (authError) {
    error.value = authError.message || 'That backup code was not valid.'
    return
  }
  await navigateTo('/')
}
</script>

<template>
  <AuthLayout
    :title="step === 'credentials' ? 'Welcome back' : 'Two-factor verification'"
    :subtitle="
      step === 'credentials'
        ? 'Log in to keep streaming.'
        : 'Enter the 6-digit code from your authenticator app.'
    "
  >
    <!-- Step 1 — credentials -->
    <form v-if="step === 'credentials'" class="space-y-5" @submit.prevent="onSubmit">
      <SocialAuthButtons @error="error = $event" />

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
        autocomplete="current-password"
        placeholder="••••••••"
        :icon="Lock"
      />

      <div class="flex items-center justify-between">
        <label class="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <input
            v-model="remember"
            type="checkbox"
            class="size-4 cursor-pointer rounded border-border accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
          Remember me
        </label>
        <NuxtLink
          to="/forgot-password"
          class="rounded text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Forgot password?
        </NuxtLink>
      </div>

      <AuthAlert v-if="error" :message="error" />

      <Button type="submit" size="lg" class="w-full" :disabled="pending">
        {{ pending ? 'Logging in…' : 'Log in' }}
      </Button>
    </form>

    <!-- Step 2 — TOTP / backup code -->
    <div v-else class="space-y-5">
      <template v-if="!useBackupCode">
        <OtpInput v-model="otp" @complete="verifyTotp" />
        <AuthAlert v-if="error" :message="error" />
        <Button size="lg" class="w-full" :disabled="pending || otp.length < 6" @click="verifyTotp(otp.join(''))">
          {{ pending ? 'Verifying…' : 'Verify' }}
        </Button>
        <button
          type="button"
          class="w-full cursor-pointer rounded text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          @click="useBackupCode = true; error = ''"
        >
          Lost your device? Use a backup code
        </button>
      </template>

      <form v-else class="space-y-5" @submit.prevent="verifyBackup">
        <AuthFormField
          id="backup"
          v-model="backupCode"
          label="Backup code"
          autocomplete="one-time-code"
          placeholder="xxxxx-xxxxx"
          :icon="ShieldCheck"
        />
        <AuthAlert v-if="error" :message="error" />
        <Button type="submit" size="lg" class="w-full" :disabled="pending">
          {{ pending ? 'Verifying…' : 'Verify backup code' }}
        </Button>
        <button
          type="button"
          class="w-full cursor-pointer rounded text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          @click="useBackupCode = false; error = ''"
        >
          Use your authenticator app instead
        </button>
      </form>
    </div>

    <template #footer>
      Don't have an account?
      <NuxtLink to="/signup" class="font-medium text-primary hover:underline">Sign up</NuxtLink>
    </template>
  </AuthLayout>
</template>
