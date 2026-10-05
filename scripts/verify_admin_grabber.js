const fs = require('fs');

// Read directly from js/admin.js to ensure we are testing production code
const adminCode = fs.readFileSync('js/admin.js', 'utf8');

// Extract extractInstagramMediaFromHtml function
const extractFnStr = adminCode.slice(
  adminCode.indexOf('function extractInstagramMediaFromHtml'),
  adminCode.indexOf('window.executeInstagramGrab =')
);

eval(extractFnStr);

async function verifyGrab() {
  const shortcode = 'DZCjj_Qkwcn';
  const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;

  console.log('Testing extraction with live embed via CORS.eu.org and AllOrigins...');
  
  // Try mirror
  let html = '';
  const urls = [
    `https://cors.eu.org/${embedUrl}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(embedUrl)}`
  ];

  for (const u of urls) {
    try {
      console.log('Fetching:', u);
      const res = await fetch(u, { signal: AbortSignal.timeout(12000) });
      if (res.ok) {
        html = await res.text();
        console.log(`Fetched ${html.length} bytes from ${u}`);
        if (html.length > 50000) break;
      }
    } catch(e) {
      console.log('Fetch error:', e.message);
    }
  }

  if (!html) {
    throw new Error('Could not fetch HTML from mirrors');
  }

  const result = extractInstagramMediaFromHtml(html);
  console.log('\n===== VERIFICATION RESULTS =====');
  console.log('Media count:', result.mediaList.length);
  console.log('Caption:', result.caption);
  
  if (result.mediaList.length === 20 && result.caption === 'A glimpse of the last six months') {
    console.log('\n🎉 ALL CHECKS PASSED: 20/20 media items & caption verified successfully!');
  } else {
    console.log(`\n❌ Failed: Expected 20 items, got ${result.mediaList.length}`);
    process.exit(1);
  }
}

verifyGrab();
