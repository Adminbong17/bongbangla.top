const https = require('https');

https.get('https://vault.bongbangla.top', (res) => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    console.log('HTML length:', b.length);
    const scripts = b.match(/src="[^"]+"/g) || [];
    console.log('Scripts / Sources:');
    scripts.forEach(s => console.log(' ', s));
    const links = b.match(/href="[^"]+"/g) || [];
    console.log('Links:');
    links.forEach(l => console.log(' ', l));
  });
}).on('error', console.error);
