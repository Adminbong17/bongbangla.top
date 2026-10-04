const fs = require('fs');
const path = require('path');

const version = '20261004_v9';
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
  let html = fs.readFileSync(file, 'utf8');

  // Fix CSS links
  html = html.replace(/href="css\/style(?:\.css)?(?:\?v=[^"]*)?"/g, `href="css/style.css?v=${version}"`);

  // Fix JS script tags
  html = html.replace(/src="js\/vault-config(?:\.js)?(?:\?v=[^"]*)?"/g, `src="js/vault-config.js?v=${version}"`);
  html = html.replace(/src="js\/supabase-config(?:\.js)?(?:\?v=[^"]*)?"/g, `src="js/supabase-config.js?v=${version}"`);
  html = html.replace(/src="js\/supabase-client(?:\.js)?(?:\?v=[^"]*)?"/g, `src="js/supabase-client.js?v=${version}"`);
  html = html.replace(/src="js\/reels(?:\.js)?(?:\?v=[^"]*)?"/g, `src="js/reels.js?v=${version}"`);
  html = html.replace(/src="js\/admin(?:\.js)?(?:\?v=[^"]*)?"/g, `src="js/admin.js?v=${version}"`);
  html = html.replace(/src="js\/main(?:\.js)?(?:\?v=[^"]*)?"/g, `src="js/main.js?v=${version}"`);

  fs.writeFileSync(file, html, 'utf8');
  console.log('Fixed scripts in:', file);
});
