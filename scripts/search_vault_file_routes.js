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
  
  ['files.php', 'share.php', 'upload.php'].forEach(keyword => {
    let pos = 0;
    while ((pos = indexJs.indexOf(keyword, pos)) !== -1) {
      console.log(`=== ${keyword} at pos ${pos} ===`);
      console.log(indexJs.slice(Math.max(0, pos - 200), pos + 400));
      pos += keyword.length;
    }
  });
}

run();
