<script setup lang="ts">
useHead({ title: 'Categories — Streamify' })
</script>

<template>
  <main id="main-content">
    <AppHeader />
    <div class="mx-auto max-w-[1560px] px-4 py-8 sm:px-8 mt-12">
      <CategoryGrid />
    </div>
    <AppFooter />
  </main>
</template>
