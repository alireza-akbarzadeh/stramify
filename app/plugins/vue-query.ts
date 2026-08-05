import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000
      }
    }
  })

  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient })
})
