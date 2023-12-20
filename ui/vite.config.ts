import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/admin': {
          target: 'http://localhost:5010',
          changeOrigin: true,
      },

    }
  }

})
