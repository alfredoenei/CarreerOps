import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        // Evita que el navegador bloquee la petición por diferencias de protocolo/puerto
        ws: true, 
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('Vite Proxy Error:', err);
          });
        },
      }
    }
  }
})
