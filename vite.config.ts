import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public', // Garante que arquivos em public/ sejam copiados
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    copyPublicDir: true // Força cópia de arquivos públicos
  }
})
