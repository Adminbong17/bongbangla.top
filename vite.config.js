import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
        serviceCinema: resolve(__dirname, 'service-cinema-ads.html'),
        serviceSaree: resolve(__dirname, 'service-saree-model-shoot.html'),
        serviceReels: resolve(__dirname, 'service-viral-reels.html'),
        serviceFacebook: resolve(__dirname, 'service-facebook-ads.html'),
        serviceJewellery: resolve(__dirname, 'service-jewellery-luxury.html'),
      },
    },
  },
});
