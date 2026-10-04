const https = require('https');
const fs = require('fs');

async function testVideoUpload() {
  const token = '51975f50c63135390bd3b368f4077f9ef3fc9f5b4972be1bfa9d4d90436faad5';
  const boundary = '----WebKitFormBoundary' + Math.random().toString(16).slice(2);

  // Check if we have the local Taspia video file
  const videoPath = 'C:\\Users\\Lotus\\Downloads\\Video\\I don\'t enter the room, I change its energy 💫......#taspiaislam.mp4';
  let fileBuffer;
  let filename = 'taspia_reel.mp4';
  let mimeType = 'video/mp4';

  if (fs.existsSync(videoPath)) {
    console.log('Found local Taspia video at:', videoPath);
    fileBuffer = fs.readFileSync(videoPath);
  } else {
    console.log('Local video not found, testing with sample buffer');
    fileBuffer = Buffer.from('video mp4 simulated content');
  }

  const parts = [];
  parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n\r\n`);
  parts.push(fileBuffer);
  parts.push(`\r\n--${boundary}--\r\n`);

  const bodyBuffer = Buffer.concat(parts.map(p => typeof p === 'string' ? Buffer.from(p) : p));

  console.log('Uploading', bodyBuffer.length, 'bytes to vault API...');

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
          console.log('Public Vault URL:', shareUrl);
        }
      } catch(e) {}
    });
  });

  req.on('error', console.error);
  req.write(bodyBuffer);
  req.end();
}

testVideoUpload();
