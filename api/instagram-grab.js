/**
 * BongBangla Media & Creative Lab
 * Instagram Media Grabber API Endpoint (Serverless Node.js on Vercel)
 * 
 * Features:
 * 1. Extracts ALL carousel media (photos & 4K/HD video reels) from public Instagram posts/reels.
 * 2. Provides media proxy mode (?proxy_media=1&url=...) to bypass browser CORS when downloading blobs for CDN re-upload.
 */

function cleanUrl(u) {
  if (!u || typeof u !== 'string') return '';
  return u
    .replace(/\\u0026/g, '&')
    .replace(/\\\\\//g, '/')
    .replace(/\\\//g, '/')
    .replace(/&amp;/g, '&');
}

function cleanCaption(c) {
  if (!c || typeof c !== 'string') return '';
  const cleaned = c.replace(/^Instagram:|\s*on Instagram:.*$/i, '').trim();
  const lower = cleaned.toLowerCase();
  if (
    lower === 'instagram' ||
    lower.includes('login') ||
    lower.includes('error') ||
    lower.includes('cloudflare') ||
    lower.includes('520:') ||
    lower.includes('500:')
  ) {
    return '';
  }
  return cleaned;
}

function isCroppedUrl(u) {
  if (!u || typeof u !== 'string') return false;
  return /[\/_]c\d+\.|\bs\d+x\d+\b|stp=c\d+\.|\/c\d+\.|\/s640x640\/|\/p640x640\/|_s640x640_|_s320x320_|_s150x150_/i.test(u);
}

function getBestPhotoUrl(node) {
  if (!node || typeof node !== 'object') return '';
  // 1. Check display_resources (highest resolution uncropped from GraphQL)
  if (Array.isArray(node.display_resources) && node.display_resources.length > 0) {
    const sorted = [...node.display_resources].sort((a, b) => (b.config_width || 0) - (a.config_width || 0));
    const uncropped = sorted.find(r => r && r.src && !isCroppedUrl(r.src));
    if (uncropped && uncropped.src) return uncropped.src;
    if (sorted[0] && sorted[0].src) return sorted[0].src;
  }
  // 2. Check image_versions2 candidates (highest resolution uncropped from ScheduledServerJS/API)
  if (node.image_versions2 && Array.isArray(node.image_versions2.candidates) && node.image_versions2.candidates.length > 0) {
    const sorted = [...node.image_versions2.candidates].sort((a, b) => (b.width || 0) - (a.width || 0));
    const uncropped = sorted.find(c => c && c.url && !isCroppedUrl(c.url));
    if (uncropped && uncropped.url) return uncropped.url;
    if (sorted[0] && sorted[0].url) return sorted[0].url;
  }
  return node.display_url || '';
}

function extractMediaFromHtml(html) {
  const extracted = [];
  const seenUrls = new Set();
  let caption = '';

  function addMedia(type, url, thumbnail, title) {
    if (!url || typeof url !== 'string') return;
    const cu = cleanUrl(url);
    if (!cu || seenUrls.has(cu)) return;

    // Filter out profile avatars, small icons, static assets
    if (
      cu.includes('s150x150') ||
      cu.includes('s100x100') ||
      cu.includes('s320x320') ||
      cu.includes('/t51.82787-19/') ||
      cu.includes('rsrc.php')
    ) {
      return;
    }

    seenUrls.add(cu);
    extracted.push({
      type: type,
      url: cu,
      thumbnail: thumbnail ? cleanUrl(thumbnail) : cu,
      title: title || (type === 'video' ? 'Instagram Reel' : 'Instagram Photo')
    });
  }

  // 1. Primary: Search in s.handle / gql_data / shortcode_media
  const handleMatches = [...html.matchAll(/s\.handle\((\{[\s\S]*?\})\);/g)];
  for (const hm of handleMatches) {
    try {
      const data = JSON.parse(hm[1]);
      function findContextJson(obj) {
        if (!obj) return;
        if (typeof obj === 'string') {
          if (
            obj.includes('gql_data') ||
            obj.includes('edge_sidecar_to_children') ||
            obj.includes('shortcode_media') ||
            obj.includes('carousel_media')
          ) {
            try {
              const inner = JSON.parse(obj);
              processGql(inner);
            } catch (e) {}
          }
          return;
        }
        if (typeof obj === 'object') {
          if (obj.gql_data) {
            processGql(obj);
          }
          for (const k of Object.keys(obj)) {
            findContextJson(obj[k]);
          }
        }
      }

      function processGql(root) {
        const sc =
          (root && root.gql_data && root.gql_data.shortcode_media) ||
          (root && root.shortcode_media);
        if (!sc) return;

        // Caption
        if (!caption && sc.edge_media_to_caption && sc.edge_media_to_caption.edges && sc.edge_media_to_caption.edges[0]) {
          caption = cleanCaption(sc.edge_media_to_caption.edges[0].node.text || '');
        }
        if (!caption && sc.accessibility_caption) {
          caption = cleanCaption(sc.accessibility_caption);
        }

        // Carousel items (Photos & Videos)
        if (sc.edge_sidecar_to_children && sc.edge_sidecar_to_children.edges && Array.isArray(sc.edge_sidecar_to_children.edges)) {
          sc.edge_sidecar_to_children.edges.forEach((edge, idx) => {
            const n = edge.node;
            if (!n) return;
            if (n.is_video && n.video_url) {
              const thumb = getBestPhotoUrl(n) || n.display_url;
              addMedia('video', n.video_url, thumb, n.accessibility_caption || `Instagram Reel #${idx + 1}`);
            } else {
              const bestImg = getBestPhotoUrl(n) || n.display_url;
              if (bestImg) {
                addMedia('photo', bestImg, bestImg, n.accessibility_caption || `Instagram Photo #${idx + 1}`);
              }
            }
          });
        } else {
          // Single photo or reel
          if (sc.is_video && sc.video_url) {
            const thumb = getBestPhotoUrl(sc) || sc.display_url;
            addMedia('video', sc.video_url, thumb, sc.accessibility_caption || 'Instagram Reel');
          } else {
            const bestImg = getBestPhotoUrl(sc) || sc.display_url;
            if (bestImg) {
              addMedia('photo', bestImg, bestImg, sc.accessibility_caption || 'Instagram Photo');
            }
          }
        }
      }

      findContextJson(data);
    } catch (err) {}
  }

  // 2. Secondary: Search ScheduledServerJS / script tags with carousel_media or image_versions2
  if (extracted.length === 0) {
    const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = scriptRegex.exec(html)) !== null) {
      const content = match[1].trim();
      if (
        !content.includes('carousel_media') &&
        !content.includes('video_versions') &&
        !content.includes('image_versions2') &&
        !content.includes('edge_sidecar_to_children')
      ) {
        continue;
      }

      try {
        const data = JSON.parse(content);
        function searchObj(obj) {
          if (!obj || typeof obj !== 'object') return;

          if (!caption && obj.caption && typeof obj.caption.text === 'string') {
            caption = cleanCaption(obj.caption.text);
          }

          // Edge sidecar
          if (obj.edge_sidecar_to_children && Array.isArray(obj.edge_sidecar_to_children.edges)) {
            obj.edge_sidecar_to_children.edges.forEach((edge, idx) => {
              const n = edge.node;
              if (!n) return;
              if (n.is_video && n.video_url) {
                const thumb = getBestPhotoUrl(n) || n.display_url;
                addMedia('video', n.video_url, thumb, `Instagram Reel #${idx + 1}`);
              } else {
                const bestImg = getBestPhotoUrl(n) || n.display_url;
                if (bestImg) {
                  addMedia('photo', bestImg, bestImg, `Instagram Photo #${idx + 1}`);
                }
              }
            });
          }

          // Carousel media array
          if (obj.carousel_media && Array.isArray(obj.carousel_media)) {
            obj.carousel_media.forEach((item, idx) => {
              if (item.video_versions && item.video_versions.length > 0) {
                const vid = item.video_versions[0].url;
                const thumb = getBestPhotoUrl(item) || (item.image_versions2 && item.image_versions2.candidates && item.image_versions2.candidates[0] ? item.image_versions2.candidates[0].url : '');
                addMedia('video', vid, thumb, `Instagram Reel #${idx + 1}`);
              } else {
                const bestImg = getBestPhotoUrl(item) || (item.image_versions2 && item.image_versions2.candidates && item.image_versions2.candidates[0] ? item.image_versions2.candidates[0].url : '');
                if (bestImg) {
                  addMedia('photo', bestImg, bestImg, `Instagram Photo #${idx + 1}`);
                }
              }
            });
          }

          // Single video
          if (obj.video_versions && Array.isArray(obj.video_versions) && obj.video_versions.length > 0) {
            const bestVideo = obj.video_versions[0];
            if (bestVideo && bestVideo.url) {
              const thumb = getBestPhotoUrl(obj) || (obj.image_versions2 && obj.image_versions2.candidates && obj.image_versions2.candidates[0] ? obj.image_versions2.candidates[0].url : '');
              addMedia('video', bestVideo.url, thumb, 'Instagram Reel');
            }
          }

          // Single photo
          if (
            (obj.image_versions2 && obj.image_versions2.candidates && obj.image_versions2.candidates.length > 0) ||
            (obj.display_resources && obj.display_resources.length > 0) ||
            obj.display_url
          ) {
            if (!obj.video_versions || obj.video_versions.length === 0) {
              const bestImg = getBestPhotoUrl(obj);
              if (bestImg) {
                addMedia('photo', bestImg, bestImg, 'Instagram Photo');
              }
            }
          }

          for (const k of Object.keys(obj)) {
            if (typeof obj[k] === 'object') searchObj(obj[k]);
          }
        }

        searchObj(data);
      } catch (jsonErr) {}
    }
  }

  // 3. Fallback: High-res CDN media URLs from HTML
  if (extracted.length === 0) {
    const cdnRegex = /https:[\\\/]+[a-z0-9.-]*scontent[a-z0-9.-]*\.cdninstagram\.com[\\\/]v[\\\/]t51\.[0-9-]+[\\\/][^"'\s\)]+/gi;
    const cdnMatches = html.match(cdnRegex) || [];

    // Group matches by file/post identifier (e.g. "713783312_18357439807245832")
    const groups = new Map();
    for (const m of cdnMatches) {
      const cu = cleanUrl(m);
      if (!cu || cu.includes('s150x150') || cu.includes('s100x100') || cu.includes('rsrc.php')) continue;
      const idMatch = cu.match(/t51\.[0-9-]+\/([0-9_]+)/);
      const key = idMatch ? idMatch[1] : cu;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(cu);
    }

    for (const [key, urls] of groups.entries()) {
      // Prioritize uncropped full resolution over square crop
      const uncropped = urls.find(u => !isCroppedUrl(u));
      const best = uncropped || urls.find(u => u.includes('p1080x1080') || u.includes('s1080x1080')) || urls[0];
      if (best) {
        addMedia('photo', best, best, 'Instagram Photo');
      }
    }

    const videoRegex = /(https?:\/\/[^\s\)\"\']+\.mp4[^\s\)\"\']*)/gi;
    let vMatch;
    while ((vMatch = videoRegex.exec(html)) !== null) {
      addMedia('video', vMatch[1], '', 'Instagram Reel');
    }
  }

  // Caption fallback
  if (!caption) {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      caption = cleanCaption(titleMatch[1]);
    }
  }

  return { mediaList: extracted, caption };
}

async function fetchInstagramPost(shortcode) {
  const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
  
  // Headers that cause Instagram embed to return clean ServerJS with s.handle
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  };

  // Attempt 1: Desktop UA
  try {
    const res = await fetch(embedUrl, { headers, signal: AbortSignal.timeout(12000) });
    if (res.ok) {
      const html = await res.text();
      const parsed = extractMediaFromHtml(html);
      if (parsed.mediaList && parsed.mediaList.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[instagram-grab] Attempt 1 failed:', e.message);
  }

  // Attempt 2: Mobile UA
  try {
    const mobileHeaders = {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9'
    };
    const res2 = await fetch(embedUrl, { headers: mobileHeaders, signal: AbortSignal.timeout(12000) });
    if (res2.ok) {
      const html2 = await res2.text();
      const parsed2 = extractMediaFromHtml(html2);
      if (parsed2.mediaList && parsed2.mediaList.length > 0) {
        return parsed2;
      }
    }
  } catch (e2) {
    console.warn('[instagram-grab] Attempt 2 failed:', e2.message);
  }

  // Attempt 3: Embed with _fb_noscript=1
  try {
    const res3 = await fetch(`${embedUrl}?_fb_noscript=1`, { headers, signal: AbortSignal.timeout(12000) });
    if (res3.ok) {
      const html3 = await res3.text();
      const parsed3 = extractMediaFromHtml(html3);
      if (parsed3.mediaList && parsed3.mediaList.length > 0) {
        return parsed3;
      }
    }
  } catch (e3) {
    console.warn('[instagram-grab] Attempt 3 failed:', e3.message);
  }

  // Attempt 4: oEmbed API + Microlink Fallback
  let fallbackCaption = '';
  let fallbackMedia = [];
  try {
    const oembedRes = await fetch(`https://www.instagram.com/api/v1/oembed/?url=https://www.instagram.com/p/${shortcode}/`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(8000)
    });
    if (oembedRes.ok) {
      const oembedData = await oembedRes.json();
      fallbackCaption = oembedData.title || '';
      if (oembedData.thumbnail_url) {
        fallbackMedia.push({
          type: 'photo',
          url: oembedData.thumbnail_url,
          thumbnail: oembedData.thumbnail_url,
          title: oembedData.title || 'Instagram Media'
        });
      }
    }
  } catch (e4) {}

  // Attempt 5: Microlink API fallback
  try {
    const postUrl = `https://www.instagram.com/p/${shortcode}/`;
    const microRes = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(postUrl)}&video=true`, {
      signal: AbortSignal.timeout(8000)
    });
    if (microRes.ok) {
      const microJson = await microRes.json();
      if (microJson.data) {
        if (!fallbackCaption) {
          fallbackCaption = microJson.data.description || microJson.data.title || '';
        }
        if (microJson.data.video && microJson.data.video.url) {
          fallbackMedia = [{
            type: 'video',
            url: microJson.data.video.url,
            thumbnail: microJson.data.image ? microJson.data.image.url : '',
            title: 'Instagram Reel'
          }];
        } else if (microJson.data.image && microJson.data.image.url && fallbackMedia.length === 0) {
          fallbackMedia = [{
            type: 'photo',
            url: microJson.data.image.url,
            thumbnail: microJson.data.image.url,
            title: 'Instagram Photo'
          }];
        }
      }
    }
  } catch (e5) {}

  return { mediaList: fallbackMedia, caption: fallbackCaption };
}

async function fetchInstagramProfile(username) {
  const profileUrl = `https://www.instagram.com/${username}/`;
  const botUAs = [
    'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
    'Twitterbot/1.0',
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  ];

  for (const ua of botUAs) {
    try {
      const res = await fetch(profileUrl, {
        headers: {
          'User-Agent': ua,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        signal: AbortSignal.timeout(12000)
      });
      if (res.ok) {
        const html = await res.text();
        const ogImg = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
        const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
        const ogDesc = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);

        let avatarUrl = '';
        if (ogImg && ogImg[1]) {
          avatarUrl = ogImg[1].replace(/&amp;/g, '&');
        }

        let name = username;
        if (ogTitle && ogTitle[1]) {
          const cleanTitle = ogTitle[1]
            .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCodePoint(parseInt(code, 16)))
            .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(parseInt(code, 10)))
            .replace(/\s*[•|]\s*Instagram.*$/i, '')
            .trim();
          if (cleanTitle) name = cleanTitle;
        }

        let bio = '';
        if (ogDesc && ogDesc[1]) {
          bio = ogDesc[1]
            .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCodePoint(parseInt(code, 16)))
            .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(parseInt(code, 10)))
            .trim();
        }

        if (avatarUrl) {
          return {
            isProfile: true,
            username: username,
            name: name,
            bio: bio,
            avatarUrl: avatarUrl,
            mediaList: [
              {
                type: 'photo',
                url: avatarUrl,
                thumbnail: avatarUrl,
                title: `${name} - প্রোফাইল ছবি (HD Avatar)`
              }
            ]
          };
        }
      }
    } catch (e) {
      console.warn('[instagram-grab] Profile fetch attempt failed:', e.message);
    }
  }

  return null;
}

async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = req.query || {};

  // Media Proxy mode (to download blob for CDN without browser CORS blockage)
  if (query.proxy_media && (query.url || query.media_url)) {
    const targetUrl = query.url || query.media_url;
    try {
      const mediaRes = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Referer': 'https://www.instagram.com/'
        },
        signal: AbortSignal.timeout(25000)
      });
      if (!mediaRes.ok) {
        return res.status(mediaRes.status).end('Failed to fetch media');
      }
      res.setHeader('Content-Type', mediaRes.headers.get('content-type') || 'application/octet-stream');
      const ab = await mediaRes.arrayBuffer();
      return res.end(Buffer.from(ab));
    } catch (pe) {
      return res.status(500).json({ error: pe.message });
    }
  }

  let rawUrl = query.url || query.shortcode || '';
  if (!rawUrl && req.body) {
    if (typeof req.body === 'string') {
      try {
        const parsed = JSON.parse(req.body);
        rawUrl = parsed.url || parsed.shortcode || '';
      } catch (e) {}
    } else {
      rawUrl = req.body.url || req.body.shortcode || '';
    }
  }

  let shortcode = '';
  const postMatch = (rawUrl || '').match(/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i);
  if (postMatch) {
    shortcode = postMatch[1];
  }

  // Check for Profile URL (e.g. instagram.com/priyanka_biswas666/ or @priyanka_biswas666 or username query param)
  let profileUsername = query.username || '';
  if (!shortcode && !profileUsername) {
    const profileMatch = (rawUrl || '').match(/(?:instagram\.com\/|@)([A-Za-z0-9_.-]+)\/?(?:[?#].*)?$/i);
    if (profileMatch) {
      const u = profileMatch[1];
      if (!['explore', 'reels', 'stories', 'direct', 'accounts', 'developer', 'p', 'reel', 'tv'].includes(u.toLowerCase())) {
        profileUsername = u;
      }
    }
  }

  if (!shortcode && !profileUsername && /^[A-Za-z0-9_-]{8,25}$/.test(rawUrl)) {
    shortcode = rawUrl;
  }

  if (!shortcode && !profileUsername) {
    return res.status(400).json({
      success: false,
      error: 'সঠিক ইনস্টাগ্রাম পোস্ট, রিলস বা প্রোফাইলের লিংক দিন! (উদাঃ https://www.instagram.com/p/xxx/ অথবা https://www.instagram.com/username/)'
    });
  }

  // Handle Profile Grab
  if (profileUsername) {
    try {
      const profileData = await fetchInstagramProfile(profileUsername);
      if (profileData && profileData.mediaList && profileData.mediaList.length > 0) {
        return res.status(200).json({
          success: true,
          isProfile: true,
          username: profileData.username,
          name: profileData.name,
          bio: profileData.bio,
          caption: `${profileData.name} • ${profileData.bio}`,
          count: profileData.mediaList.length,
          mediaList: profileData.mediaList,
          message: 'প্রোফাইল থেকে তথ্য ও ছবি সংগ্রহ করা হয়েছে। ফুল-বডি আনক্রপড ফটো ও ৪K রিলস গ্যালারিতে যোগ করতে পোস্টের লিংক দিন।'
        });
      } else {
        return res.status(404).json({
          success: false,
          error: `ইনস্টাগ্রাম প্রোফাইল @${profileUsername} থেকে মিডিয়া পাওয়া যায়নি। প্রোফাইলটি প্রাইভেট হতে পারে।`
        });
      }
    } catch (profErr) {
      return res.status(500).json({
        success: false,
        error: profErr.message || 'প্রোফাইল ডাটা আনতে সমস্যা হয়েছে।'
      });
    }
  }

  try {
    const data = await fetchInstagramPost(shortcode);
    const mediaList = data.mediaList || [];
    const caption = data.caption || '';

    if (mediaList.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'পোস্টটি থেকে কোনো মিডিয়া পাওয়া যায়নি। পোস্টটি প্রাইভেট হতে পারে।'
      });
    }

    return res.status(200).json({
      success: true,
      shortcode: shortcode,
      count: mediaList.length,
      caption: caption,
      mediaList: mediaList
    });
  } catch (error) {
    console.error('[instagram-grab] Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'মিডিয়া আনতে গিয়ে সমস্যা হয়েছে।'
    });
  }
}

module.exports = handler;
module.exports.default = handler;
