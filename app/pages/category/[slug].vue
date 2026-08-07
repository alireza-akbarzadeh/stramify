<script setup lang="ts">
import { fromCategorySlug } from '#shared/utils/category'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))
const title = computed(() => `${fromCategorySlug(slug.value) ?? 'Category'} — Streamify`)

useHead({ title })
</script>

<template>
  <CategoryDetail :slug="slug" />
</template>
