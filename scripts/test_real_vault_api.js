const https = require('https');

function testEndpoint(url, method = 'GET', body = null) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: method,
      headers: {
        'Accept': 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {})
      }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body: b });
      });
    });
    req.on('error', err => resolve({ error: err.message }));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log('Testing https://api.bongbangla.top/vault-api/login.php');
  const resLogin = await testEndpoint('https://api.bongbangla.top/vault-api/login.php', 'POST', {
    email: 'model@bongbangla.top',
    password: 'Aktmtbar@1mzs'
  });
  console.log('Login result:', resLogin);

  console.log('Testing https://api.bongbangla.top/vault-api/me.php');
  const resMe = await testEndpoint('https://api.bongbangla.top/vault-api/me.php', 'GET');
  console.log('Me result:', resMe);
}

run();
