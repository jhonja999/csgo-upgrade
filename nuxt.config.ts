export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/image',
    'nuxt-icon'
  ],

  // CSS
  css: [
    '~/assets/css/main.scss'
  ],

  // TypeScript
  typescript: {
    strict: true,
    typeCheck: true
  },

  // App config
  app: {
    head: {
      title: 'CSGOLuck - Best CSGO Casino',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'The best CSGO casino with cases, roulette, coinflip, crash and more!' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/dist/img/other/icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@400;700&display=swap' }
      ]
    }
  },

  // Runtime config
  runtimeConfig: {
    // Private keys (only available on server-side)
    csgofloatApiKey: process.env.CSGOFLOAT_API_KEY,
    
    // Public keys (exposed to client-side)
    public: {
      csgofloatApiUrl: 'https://csgofloat.com/api/v1',
      appUrl: process.env.APP_URL || 'http://localhost:3000'
    }
  },

  // Nitro config for API routes
  nitro: {
    esbuild: {
      options: {
        target: 'node18'
      }
    }
  },

  // Build optimization
  build: {
    transpile: ['@headlessui/vue']
  }
})
