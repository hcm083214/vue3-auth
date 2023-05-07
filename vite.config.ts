import { defineConfig } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import PurgeIcons from 'vite-plugin-purge-icons'
import vue from '@vitejs/plugin-vue'

import path, { resolve } from 'path'
const root = process.cwd()

function pathResolve(dir: string) {
  return resolve(root, '.', dir)
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    PurgeIcons(),
    createSvgIconsPlugin({
      iconDirs: [pathResolve('src/assets/svg')],
      symbolId: 'icon-[dir]-[name]',
      svgoOptions: true
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:60000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    host: '0.0.0.0'
  },
  // 添加 @
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true
  }
})
