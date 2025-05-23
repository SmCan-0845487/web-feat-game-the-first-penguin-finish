import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    plugins: [
      vue({
        template: { transformAssetUrls }
      }),

      quasar({
        sassVariables: 'src/style/quasar-variables.sass'
      }),
    ],
    server: {
      proxy: {
        '/socket.io': {
          target: 'ws://localhost/socket.io',
          ws: true
        }
      }
    }
  }
})