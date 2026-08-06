<script setup lang="ts">
import { fromCategorySlug } from '#shared/utils/category'

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))
const title = computed(() => `${fromCategorySlug(slug.value) ?? 'Category'} — Streamify`)

useHead({ title })
</script>

<template>
  <main id="main-content">
    <AppHeader />
    <CategoryDetail :slug="slug" />
    <AppFooter />
  </main>
</template>
