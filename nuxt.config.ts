// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxthub/core','shadcn-nuxt','@nuxtjs/tailwindcss'
],
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  hub: {
    // NuxtHub options
    database:true
  },
})