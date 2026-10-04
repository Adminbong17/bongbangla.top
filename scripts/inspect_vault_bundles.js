const https = require('https');

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => resolve(b));
    }).on('error', reject);
  });
}

async function run() {
  const assets = [
    'https://vault.bongbangla.top/assets/index-DauRLO8T.js',
    'https://vault.bongbangla.top/assets/index-Dehih6Dn.js',
    'https://vault.bongbangla.top/assets/upload-D0HKEUSO.js',
    'https://vault.bongbangla.top/assets/cloud-6LmTeb2u.js'
  ];

  for (const url of assets) {
    console.log('Fetching', url);
    const content = await fetchText(url);
    console.log('Length:', content.length);

    // Look for supabase, storage, api, endpoints, auth, bucket
    const matches = content.match(/https:\/\/[a-zA-Z0-9_\.-]+\.supabase\.co[^\s"']*/g) || [];
    console.log('Supabase URLs in', url, matches);

    const keys = content.match(/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9[^\s"']*/g) || [];
    console.log('JWT keys:', keys.map(k => k.slice(0, 30) + '...'));

    const bucketMatches = content.match(/from\(['"][a-zA-Z0-9_-]+['"]\)/g) || [];
    console.log('Storage buckets:', bucketMatches);
    
    const apiMatches = content.match(/['"]\/(api|rest|functions|v1)\/[^'"]+['"]/g) || [];
    console.log('API routes:', apiMatches);
  }
}

run().catch(console.error);
