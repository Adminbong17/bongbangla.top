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
  const fTokenJs = await fetchText('https://vault.bongbangla.top/assets/f._token-BPPn7rCt.js');
  console.log('--- f._token chunk ---');
  console.log(fTokenJs);

  const dashJs = await fetchText('https://vault.bongbangla.top/assets/dashboard-DVo_ZxmN.js');
  console.log('--- dashboard chunk length:', dashJs.length);
  // find endpoints or api calls in dashboard
  const endpoints = dashJs.match(/cl\(\s*["'][^"']+["']/g) || [];
  console.log('cl() calls in dashboard:', endpoints);
  
  // Look for any string containing .php or upload or url
  const phpMatches = dashJs.match(/["'][^"']*\.php[^"']*["']/g) || [];
  console.log('PHP matches in dashboard:', phpMatches);
}

run();
