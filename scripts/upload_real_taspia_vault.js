const https = require('https');
const fs = require('fs');
const path = require('path');

async function uploadRealVideo() {
  const dir = 'C:\\Users\\Lotus\\Downloads\\Video';
  const files = fs.readdirSync(dir);
  const target = files.find(f => f.includes('taspiaislam') || f.includes('energy'));
  if (!target) {
    console.error('Target video not found in', files);
    return;
  }
  const fullPath = path.join(dir, target);
  console.log('Target file found:', fullPath);
  const fileBuffer = fs.readFileSync(fullPath);
  console.log('File size:', fileBuffer.length, 'bytes');

  const token = '51975f50c63135390bd3b368f4077f9ef3fc9f5b4972be1bfa9d4d90436faad5';
  const boundary = '----WebKitFormBoundary' + Math.random().toString(16).slice(2);
  const filename = 'taspia_reel_vault.mp4';
  const mimeType = 'video/mp4';

  const parts = [];
  parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n\r\n`);
  parts.push(fileBuffer);
  parts.push(`\r\n--${boundary}--\r\n`);

  const bodyBuffer = Buffer.concat(parts.map(p => typeof p === 'string' ? Buffer.from(p) : p));
  console.log('Sending multipart body of length:', bodyBuffer.length);

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
      try {
        const json = JSON.parse(b);
        if (json.share_token) {
          const shareUrl = `https://api.bongbangla.top/vault-api/share.php?t=${json.share_token}`;
          console.log('🔥 ACTUAL PUBLIC VAULT STREAMING URL:', shareUrl);
        }
      } catch(e) {}
    });
  });

  req.on('error', console.error);
  req.write(bodyBuffer);
  req.end();
}

uploadRealVideo();
