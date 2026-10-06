import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'instagram-grab-dev-api',
      configureServer(server) {
        server.middlewares.use('/api/instagram-grab', async (req, res) => {
          try {
            const handlerModule = await import('./api/instagram-grab.js');
            const handler = handlerModule.default || handlerModule;

            const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
            req.query = Object.fromEntries(urlObj.searchParams);

            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            };
            res.status = (code) => {
              res.statusCode = code;
              return res;
            };

            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', () => {
                try { req.body = JSON.parse(body); } catch(e) { req.body = body; }
                handler(req, res);
              });
            } else {
              handler(req, res);
            }
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
      }
    }
  ],
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
        modelDetails: resolve(__dirname, 'model-details.html'),
      },
    },
  },
});
