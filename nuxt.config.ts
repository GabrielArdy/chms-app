// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  css: ['~/assets/css/styles.css'],
  runtimeConfig: {
    public: {
      // Override at build/runtime with NUXT_PUBLIC_API_BASE_URL
      apiBaseUrl: 'http://localhost:8080',
    },
  },
  app: {
    head: {
      title: 'ChurchMS — Sanctuary OS',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
})
