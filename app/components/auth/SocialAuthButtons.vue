<script setup lang="ts">
import { authClient } from '@/lib/auth-client'

const emit = defineEmits<{
  (e: 'error', message: string): void
}>()

const { data } = await useFetch('/api/auth-providers')

const pending = ref('')

const LABELS: Record<string, string> = {
  google: 'Google',
  apple: 'Apple',
  facebook: 'Facebook',
  github: 'GitHub'
}

const providers = computed(() =>
  (data.value?.all ?? []).map((id) => ({
    id,
    label: LABELS[id] ?? id,
    configured: (data.value?.configured ?? []).includes(id)
  }))
)

async function signIn(provider: string, configured: boolean) {
  if (!configured) {
    emit(
      'error',
      `${LABELS[provider] ?? provider} sign-in isn't configured on this deployment yet.`
    )
    return
  }

  pending.value = provider

  const { error } = await authClient.signIn.social({
    provider,
    callbackURL: '/'
  })

  pending.value = ''

  if (error) {
    emit(
      'error',
      error.message || `Could not continue with ${LABELS[provider] ?? provider}.`
    )
  }
}
</script>

<template>
  <div
    v-if="providers.length"
    class="space-y-4 flex flex-wrap justify-center items-center" 
  >
    <button
      v-for="p in providers"
      :key="p.id"
      type="button"
      :disabled="!!pending"
      :aria-describedby="p.configured ? undefined : `${p.id}-unconfigured`"
      :class="{ 'opacity-60': !p.configured }"
      class="
        group
        relative
        flex
        h-15
        w-full
        items-center
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-glass
        backdrop-blur-xl
        px-5
        transition-all
        duration-300

        hover:-translate-y-0.5
        hover:border-primary/40
        hover:bg-surface
        hover:shadow-2xl

        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-ring

        disabled:pointer-events-none
        disabled:opacity-60
      "
      @click="signIn(p.id, p.configured)"

    >
      <!-- Hover Glow -->
      <div
        class="
          absolute
          inset-0
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
          bg-[radial-gradient(circle_at_left,rgba(255,75,110,.10),transparent_65%)]
        "
      />

      <!-- Icon -->
      <div
        class="
          relative
          z-10
          mr-4
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          border
          border-border
          bg-surface
          transition-all
          duration-300

          group-hover:scale-110
          group-hover:border-primary/30
        "
      >
        <AuthProviderIcon
          :provider="p.id"
          class="h-5 w-5"
        />
      </div>

      <!-- Text -->
      <div class="relative z-10 flex flex-1 flex-col items-start">
        <span class="font-semibold text-foreground">
          Continue with {{ p.label }}
        </span>

        <span class="text-xs text-muted-foreground">
          Secure OAuth authentication
        </span>
      </div>

      <!-- Loading -->
      <svg
        v-if="pending === p.id"
        class="relative z-10 h-5 w-5 animate-spin text-primary"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="3"
          opacity=".2"
        />
        <path
          d="M22 12A10 10 0 0012 2"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
        />
      </svg>

      <!-- Arrow -->
      <ChevronRight
        v-else
        class="
          relative
          z-10
          h-5
          w-5
          text-muted-foreground
          opacity-0
          transition-all
          duration-300

          group-hover:translate-x-1
          group-hover:opacity-100
          group-hover:text-primary
        "
      />
    </button>

    <!-- Divider -->
    <div class="relative py-2">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-border" />
      </div>

      <div class="relative flex justify-center">
        <span
          class="
            rounded-full
            border
            border-border
            bg-background/90
            px-4
            py-1

            text-[11px]
            font-semibold
            uppercase
            tracking-[0.25em]
            text-muted-foreground

            backdrop-blur-xl
          "
        >
          Or continue with email
        </span>
      </div>
    </div>
  </div>
</template>