<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const handle = computed(() => String(route.params.handle ?? ''))
</script>

<template>
  <ChannelView :handle="handle" />
</template>
