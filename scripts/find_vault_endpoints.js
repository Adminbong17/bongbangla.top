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
  
  // Find all matches like cl("/...") or similar
  const clCalls = indexJs.match(/cl\(\s*["'][^"']+["']/g) || [];
  console.log('cl() calls:', clCalls);

  // Search for login, upload, auth
  const endpoints = indexJs.match(/["']\/(auth|api|files|upload|login|register|user)[^"']*["']/g) || [];
  console.log('Endpoints found:', [...new Set(endpoints)]);
}

run().catch(console.error);
