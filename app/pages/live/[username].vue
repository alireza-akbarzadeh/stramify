<script setup lang="ts">
/**
 * Superseded by the unified `/watch/[slug]` page (ADR-014). Kept as a redirect
 * rather than deleted so existing links, bookmarks, and the `/live` e2e specs
 * keep working — a live channel's handle *is* its watch slug.
 */
const route = useRoute()

definePageMeta({
  redirect: (to) => `/watch/${encodeURIComponent(String(to.params.username ?? ''))}`
})
</script>

<template>
  <main id="main-content">
    <p class="sr-only">Redirecting to {{ route.params.username }}</p>
  </main>
</template>
