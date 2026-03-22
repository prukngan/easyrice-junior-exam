import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Pages from 'vite-plugin-pages'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    Pages({
      dirs: 'src/pages',
      extensions: ['tsx'],
      onRoutesGenerated: (routes) => {
        const transform = (routes: any[]) => {
          return routes.map((route) => {
            if (route.children) {
              route.children = transform(route.children)
            }
            if (route.path === 'page') {
              route.path = ''
            } else if (route.path?.endsWith('/page')) {
              route.path = route.path.replace(/\/page$/, '')
            }
            return route
          })
        }
        return transform(routes)
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
