const https = require('https');

class VaultClient {
  constructor(baseUrl, email, password) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.email = email;
    this.password = password;
    this.token = null;
  }

  async login() {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify({ email: this.email, password: this.password });
      const u = new URL(`${this.baseUrl}/login.php`);
      const req = https.request({
        hostname: u.hostname,
        path: u.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'Accept': 'application/json'
        }
      }, (res) => {
        let b = '';
        res.on('data', c => b += c);
        res.on('end', () => {
          try {
            const data = JSON.parse(b);
            if (data.token) {
              this.token = data.token;
              resolve(data.token);
            } else {
              reject(new Error(data.error || 'Login failed'));
            }
          } catch(e) {
            reject(new Error('Invalid JSON response on login: ' + b));
          }
        });
      });
      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  }

  async uploadFile(filename, buffer, mimeType = 'image/jpeg') {
    if (!this.token) {
      await this.login();
    }

    return new Promise((resolve, reject) => {
      const boundary = '----WebKitFormBoundary' + Math.random().toString(16).slice(2);
      const parts = [];
      parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n\r\n`);
      parts.push(buffer);
      parts.push(`\r\n--${boundary}--\r\n`);

      const bodyBuffer = Buffer.concat(parts.map(p => typeof p === 'string' ? Buffer.from(p) : p));
      const u = new URL(`${this.baseUrl}/upload.php`);

      const req = https.request({
        hostname: u.hostname,
        path: u.pathname,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': bodyBuffer.length,
          'Accept': 'application/json'
        }
      }, (res) => {
        let b = '';
        res.on('data', c => b += c);
        res.on('end', () => {
          try {
            const data = JSON.parse(b);
            if (data.ok && data.share_token) {
              const publicUrl = `${this.baseUrl}/share.php?t=${data.share_token}`;
              resolve({
                success: true,
                id: data.id,
                share_token: data.share_token,
                url: publicUrl
              });
            } else {
              reject(new Error(data.error || 'Upload returned ok=false: ' + b));
            }
          } catch(e) {
            reject(new Error('Upload error: ' + b));
          }
        });
      });
      req.on('error', reject);
      req.write(bodyBuffer);
      req.end();
    });
  }
}

async function run() {
  const client = new VaultClient(
    'https://api.bongbangla.top/vault-api',
    'model@bongbangla.top',
    'Aktmtbar@1'
  );

  console.log('Logging in to vault...');
  const token = await client.login();
  console.log('Got token:', token.slice(0, 15) + '...');

  console.log('Testing upload of dummy image...');
  const res = await client.uploadFile('test_photo.jpg', Buffer.from('fake image binary content'), 'image/jpeg');
  console.log('Upload success:', res);
}

run().catch(console.error);
