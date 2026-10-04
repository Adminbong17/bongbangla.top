const https = require('https');
const fs = require('fs');

async function testUpload() {
  const token = '51975f50c63135390bd3b368f4077f9ef3fc9f5b4972be1bfa9d4d90436faad5';
  const boundary = '----WebKitFormBoundary' + Math.random().toString(16).slice(2);

  const fileData = Buffer.from('test image content 123');
  const filename = 'test_upload.txt';

  const parts = [];
  parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: text/plain\r\n\r\n`);
  parts.push(fileData);
  parts.push(`\r\n--${boundary}--\r\n`);

  const bodyBuffer = Buffer.concat(parts.map(p => typeof p === 'string' ? Buffer.from(p) : p));

  const req = https.request({
    hostname: 'api.bongbangla.top',
    path: '/vault-api/upload.php',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': bodyBuffer.length,
      'Accept': 'application/json'
    }
  }, (res) => {
    let b = '';
    res.on('data', c => b += c);
    res.on('end', () => {
      console.log('Upload Status:', res.statusCode);
      console.log('Upload Response:', b);
    });
  });

  req.on('error', console.error);
  req.write(bodyBuffer);
  req.end();
}

testUpload();
