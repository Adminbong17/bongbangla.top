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
  const uploadJs = await fetchText('https://vault.bongbangla.top/assets/upload-D0HKEUSO.js');
  console.log('--- upload-D0HKEUSO.js ---');
  console.log(uploadJs);

  const cloudJs = await fetchText('https://vault.bongbangla.top/assets/cloud-6LmTeb2u.js');
  console.log('--- cloud-6LmTeb2u.js preview ---');
  console.log(cloudJs.slice(0, 500));

  // Search in index-DauRLO8T.js for strings related to backend or storage or fetch
  const indexJs = await fetchText('https://vault.bongbangla.top/assets/index-DauRLO8T.js');
  const urls = indexJs.match(/https?:\/\/[a-zA-Z0-9_\.-]+\.[a-zA-Z0-9_\.-]+[^\s"']*/g) || [];
  console.log('All external URLs in index:', [...new Set(urls)]);
}

run().catch(console.error);
