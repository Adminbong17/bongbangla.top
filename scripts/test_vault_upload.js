const fs = require('fs');

async function testUpload() {
  const loginUrl = 'https://api.bongbangla.top/vault-api/login.php';
  const uploadUrl = 'https://api.bongbangla.top/vault-api/upload.php';

  console.log('Logging in to vault...');
  const loginRes = await fetch(loginUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.VAULT_EMAIL || 'model@bongbangla.top', password: process.env.VAULT_PASSWORD || '' })
  });

  const loginData = await loginRes.json();
  console.log('Token received:', loginData.token);

  if (!loginData.token) {
    console.error('Failed to get token!');
    return;
  }

  // Create a dummy text file
  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  const fileContent = 'Hello BongBangla Test!';
  const fileName = 'test_upload_' + Date.now() + '.txt';

  const formData = new FormData();
  formData.append('file', new Blob([fileContent], { type: 'text/plain' }), fileName);

  console.log('Uploading test file:', fileName);
  const uploadRes = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${loginData.token}`
    },
    body: formData
  });

  console.log('Upload status:', uploadRes.status);
  const uploadData = await uploadRes.json();
  console.log('Upload response:', uploadData);
}

testUpload();
