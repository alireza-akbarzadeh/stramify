<script setup lang="ts">
/**
 * Public/marketing chrome: the fixed `AppHeader` + `AppFooter` pair that the
 * landing page and the static content pages share.
 *
 * Anything that is part of the *product* (`/live`, `/clips`, `/watch/...`,
 * `/dashboard/...`) uses `dashboard.vue` instead, so the app sidebar is there
 * on every one of those routes rather than only on `/dashboard`.
 *
 * `AppHeader` is `position: fixed`, so pages under this layout own their own
 * top offset — the same arrangement they had when each of them rendered the
 * header itself.
 */
</script>

<template>
  <div>
    <AppHeader />
    <main id="main-content">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
