const https = require('https');

function testEndpoint(path, method = 'GET') {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.bongbangla.top',
      path: '/vault-api/' + path,
      method: method,
      headers: {
        'Accept': 'application/json'
      }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        resolve({ path, status: res.statusCode, body: b.slice(0, 100) });
      });
    });
    req.on('error', err => resolve({ path, error: err.message }));
    req.end();
  });
}

async function run() {
  const testFiles = [
    'login.php',
    'register.php',
    'me.php',
    'upload.php',
    'files.php',
    'file.php',
    'delete.php',
    'download.php',
    'stream.php',
    'list.php',
    'share.php',
    'storage.php',
    'config.php',
    'index.php'
  ];

  for (const f of testFiles) {
    const r = await testEndpoint(f, 'GET');
    console.log(f.padEnd(15), '-> Status:', r.status, 'Body:', r.body);
  }
}

run();
