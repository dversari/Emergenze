import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// App statica: nessun dato del paziente, nessun server. Percorsi relativi,
// così funziona su GitHub Pages qualunque sia il nome del repository.
const base = './'

// Data e ora della compilazione, mostrate nell'app per sapere quale versione si sta usando.
const versione = new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

export default defineConfig({
  base,
  define: { __VERSIONE__: JSON.stringify(versione) },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Emergenze',
        short_name: 'Emergenze',
        description: 'Calcolatori e linee guida per il pronto soccorso',
        theme_color: '#f2f0eb',
        background_color: '#f2f0eb',
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      // Tutto in cache: l'app funziona anche senza rete (sotterranei, zone senza campo).
      workbox: { skipWaiting: true, clientsClaim: true, cleanupOutdatedCaches: true, globPatterns: ['**/*.{js,css,html,ico,png,svg}'] },
    }),
  ],
  server: { host: '127.0.0.1' },
})
