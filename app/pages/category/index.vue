<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Categories — Streamify' })
</script>

<template>
  <div class="mx-auto max-w-[1560px] px-4 py-8 sm:px-8">
    <CategoryGrid />
  </div>
</template>
