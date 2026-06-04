import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: '/portfolio-dev/',
  build: {
    rollupOptions: {
      input: {
        main:  resolve(__dirname, 'index.html'),
        works: resolve(__dirname, 'works.html'),
      },
    },
  },
})
