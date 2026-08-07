import { useAuthStore } from '@/stores/auth'

/** Hydrates session state once during SSR so the header renders correctly. */
export default defineNuxtPlugin(async () => {
  await useAuthStore().refresh()
})
