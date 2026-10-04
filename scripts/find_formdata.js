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
  
  // Find all occurrences of FormData
  let pos = 0;
  while ((pos = indexJs.indexOf('FormData', pos)) !== -1) {
    console.log('--- FormData at pos:', pos);
    console.log(indexJs.slice(Math.max(0, pos - 200), pos + 500));
    pos += 8;
  }
}

run().catch(console.error);
