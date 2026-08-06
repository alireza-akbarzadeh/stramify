import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@pinia/nuxt', '@vueuse/nuxt', '@nuxt/eslint', '@nuxtjs/color-mode'],
  // classSuffix: '' → applies a bare `.dark` / `.light` class on <html>, which is
  // what main.css's `.dark { ... }` block and the `dark:` variant expect.
  colorMode: { classSuffix: '', preference: 'dark', fallback: 'dark' },
  // components/ui/* follows shadcn-vue's convention: imported explicitly via
  // its index.ts barrel, not auto-registered (its own index.ts otherwise
  // collides with the auto-registered component name — NUXT_B3011).
  components: [{ path: '~/components', pathPrefix: false, ignore: ['ui/**'] }],
  vite: {
    plugins: [tailwindcss()]
  },
  runtimeConfig: {
    // Server-only — never exposed to the client bundle.
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    betterAuthSecret: process.env.BETTER_AUTH_SECRET,
    cloudflareAccountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    cloudflareStreamApiToken: process.env.CLOUDFLARE_STREAM_API_TOKEN,
    cloudflareR2AccessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    cloudflareR2SecretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    cloudflareR2Bucket: process.env.CLOUDFLARE_R2_BUCKET,
    sentryDsn: process.env.SENTRY_DSN,
    public: {
      appUrl: process.env.PUBLIC_APP_URL || 'http://localhost:3000'
    }
  }
})
