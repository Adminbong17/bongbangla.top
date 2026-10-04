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
  const phpFiles = indexJs.match(/["']\/[a-zA-Z0-9_\.-]+\.php["']/g) || [];
  console.log('PHP endpoints:', [...new Set(phpFiles)]);

  // Let's also check for upload in all files
  const phpAll = indexJs.match(/[a-zA-Z0-9_\.-]+\.php/g) || [];
  console.log('All php occurrences:', [...new Set(phpAll)]);
}

run().catch(console.error);
