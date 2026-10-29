import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permite acceder desde el móvil en la misma red Wi-Fi
    port: 3000
  }
});
