import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import path from 'path'

export default defineConfig((env) => {
  const envars = loadEnv(env.mode, './')
  const serverURL = new URL(envars.VITE_SERVER_URL ?? '<http://localhost:5032>')
  const serverAPIPath = envars.VITE_SERVER_API_PATH ?? '/api'

  return {
    envDir: './',
    define: {
      __API_PATH__: JSON.stringify(serverAPIPath),
    },
    css: {
      postcss: {
        plugins: [tailwind(), autoprefixer()],
      },
    },
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    server: {
      port: 5173,
      proxy: {
        // proxy requests with the API path to the server
        // <http://localhost:5173/api> -> <http://localhost:5032/api>
        [serverAPIPath]: serverURL.origin,
      },
    },
  }
})
