<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))
</script>

<template>
  <WatchView :slug="slug" />
</template>
