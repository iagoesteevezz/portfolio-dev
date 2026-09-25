import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: '/portfolio-dev/',
  build: {
    rollupOptions: {
      input: {
        main:    resolve(__dirname, 'index.html'),
        work:    resolve(__dirname, 'work.html'),
        about:   resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
})
