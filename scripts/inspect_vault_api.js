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
  const pos = indexJs.indexOf('vault-api');
  if (pos !== -1) {
    console.log('Snippet around vault-api:');
    console.log(indexJs.slice(Math.max(0, pos - 500), pos + 1000));
  } else {
    console.log('vault-api not found directly');
  }

  // Also search for "api.bongbangla.top"
  const pos2 = indexJs.indexOf('api.bongbangla.top');
  if (pos2 !== -1) {
    console.log('Snippet around api.bongbangla.top:');
    console.log(indexJs.slice(Math.max(0, pos2 - 300), pos2 + 700));
  }
}

run().catch(console.error);
