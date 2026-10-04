const https = require('https');

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => resolve(b));
    }).on('error', reject);
  });
}

async function run() {
  const indexJs = await fetchText('https://vault.bongbangla.top/assets/index-DauRLO8T.js');
  const jsFiles = indexJs.match(/["']\/assets\/[a-zA-Z0-9_-]+\.js["']/g) || [];
  console.log('Lazy loaded chunks in index:', [...new Set(jsFiles)]);

  // Also search for all dynamic imports
  const dynImports = indexJs.match(/import\s*\(\s*["'][^"']+["']\s*\)/g) || [];
  console.log('Dynamic imports:', [...new Set(dynImports)]);
}

run();
