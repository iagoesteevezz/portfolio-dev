import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const HTML_REDIRECTS = {
  '/about.html': '/about',
  '/work.html': '/work',
  '/contact.html': '/contact',
  '/index.html': '/',
}

function cleanUrls() {
  return {
    name: 'clean-urls',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = (req.url || '').split('?')[0]
        const dest = HTML_REDIRECTS[path]
        if (!dest) return next()
        res.statusCode = 301
        res.setHeader('Location', dest)
        res.end()
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = (req.url || '').split('?')[0]
        const dest = HTML_REDIRECTS[path]
        if (!dest) return next()
        res.statusCode = 301
        res.setHeader('Location', dest)
        res.end()
      })
    },
  }
}

export default defineConfig({
  base: '/',
  appType: 'mpa',
  plugins: [cleanUrls()],
  build: {
    rollupOptions: {
      input: {
        main:    resolve(__dirname, 'index.html'),
        work:    resolve(__dirname, 'work/index.html'),
        about:   resolve(__dirname, 'about/index.html'),
        contact: resolve(__dirname, 'contact/index.html'),
      },
    },
  },
})
