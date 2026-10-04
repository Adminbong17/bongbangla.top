const https = require('https');

function testUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        resolve({ url, status: res.statusCode, headers: res.headers, body: b.slice(0, 300) });
      });
    }).on('error', err => resolve({ url, error: err.message }));
  });
}

async function run() {
  const token = 'dd5f8fb591f2128db7d174c775358fe4';
  const urls = [
    `https://api.bongbangla.top/vault-api/share.php?token=${token}`,
    `https://api.bongbangla.top/vault-api/share.php?id=510`,
    `https://api.bongbangla.top/vault-api/files.php?id=510`,
    `https://vault.bongbangla.top/share/${token}`,
    `https://api.bongbangla.top/vault-api/uploads/test_upload.txt`
  ];

  for (const u of urls) {
    const r = await testUrl(u);
    console.log(u);
    console.log('Status:', r.status, 'Content-Type:', r.headers ? r.headers['content-type'] : null);
    console.log('Body:', r.body);
    console.log('---');
  }
}

run();
