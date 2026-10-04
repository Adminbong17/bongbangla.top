const https = require('https');
const { createClient } = require('@supabase/supabase-js');

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

function uploadToVault(token, filename, buffer, mimeType) {
  return new Promise((resolve, reject) => {
    const boundary = '----WebKitFormBoundary' + Math.random().toString(16).slice(2);
    const parts = [];
    parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n\r\n`);
    parts.push(buffer);
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
        try {
          const json = JSON.parse(b);
          if (json.ok && json.share_token) {
            resolve(`https://api.bongbangla.top/vault-api/share.php?t=${json.share_token}`);
          } else {
            reject(new Error(b));
          }
        } catch(e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(bodyBuffer);
    req.end();
  });
}

async function run() {
  const token = '51975f50c63135390bd3b368f4077f9ef3fc9f5b4972be1bfa9d4d90436faad5';
  const oldPhotoUrl = 'https://sfnyuzemaqplpdeedsgg.supabase.co/storage/v1/object/public/models/models/1791116931209_831134293_18613006855139379_7555284441421383499_n.jpg';
  
  console.log('Downloading Neha Jaman photo...');
  const buf = await fetchBuffer(oldPhotoUrl);
  console.log('Uploading to Vault...');
  const vaultUrl = await uploadToVault(token, 'neha_jaman.jpg', buf, 'image/jpeg');
  console.log('✅ Neha Jaman on Vault:', vaultUrl);

  const supabase = createClient(
    'https://sfnyuzemaqplpdeedsgg.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmbnl1emVtYXFwbHBkZWVkc2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMzE3ODEsImV4cCI6MjEwNjYwNzc4MX0.z3YtkhMBSQnMMdCWWCRrFAYn2Yv4bAQcyZ3NGFZOlyw'
  );

  const updatedGallery = [
    { type: 'photo', url: vaultUrl, thumbnail: vaultUrl, title: 'Neha Jaman - পোর্ট্রেট শ্যুট' },
    { type: 'photo', url: vaultUrl, thumbnail: vaultUrl, title: 'Neha Jaman - ফ্যাশন শ্যুট' }
  ];

  await supabase
    .from('models')
    .update({
      image_url: vaultUrl,
      gallery: updatedGallery
    })
    .eq('id', 'M-1791116934889');

  console.log('🎉 Neha Jaman updated with Vault CDN URL!');
}

run().catch(console.error);
