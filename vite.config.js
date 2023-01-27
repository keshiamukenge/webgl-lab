import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
				main: resolve(__dirname, 'index.html'),
        effect_1: resolve(__dirname, 'src/templates/effect-1/index.html'),
        effect_2: resolve(__dirname, 'src/templates/effect-2/index.html'),
      },
    },
  },
})