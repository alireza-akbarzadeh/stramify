import { useAuth } from '@/composables/useAuth'

/** Hydrates session state once during SSR so the header renders correctly. */
export default defineNuxtPlugin(async () => {
  await useAuth().refresh()
})
