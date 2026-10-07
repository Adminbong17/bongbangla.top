/**
 * BongBangla Media & Creative Lab
 * Dynamic Reels & Video Portfolio Controller
 * Supports 3x3 Grid (9 reels/page), Admin Uploads, Pagination, and Video Lightbox
 */

// Unified BongBangla Category Mapping & Aliasing System
const BongBanglaCategorySystem = window.BongBanglaCategorySystem || (function() {
  const CATEGORY_MAP = {
    'cinema-ads': {
      canonical: 'cinema-ads',
      label: 'অ্যাড ফিল্ম',
      english: 'Cinema Ads',
      pageUrl: 'service-cinema-ads.html',
      aliases: ['cinema-ads', 'commercial-ad', 'commercial-ads', 'ad-film', 'ad-films', 'অ্যাড ফিল্ম', '৪k সিনেমা অ্যাড', 'cinema-ad']
    },
    'saree-shoot': {
      canonical: 'saree-shoot',
      label: 'শাড়ি ও মডেল শুট',
      english: 'Saree & Model Shoot',
      pageUrl: 'service-saree-model-shoot.html',
      aliases: ['saree-shoot', 'model-shoot', 'saree-model', 'model-shoots', 'শাড়ি ও মডেল শুট', 'শাড়ি ও মডেল শ্যুট', 'শাড়ি ও বোল্ড শ্যুট', 'শাড়ি ও বোল্ড শুট', 'saree-shoots']
    },
    'viral-reels': {
      canonical: 'viral-reels',
      label: 'প্রোডাক্ট রিলস',
      english: 'Product Reels',
      pageUrl: 'service-viral-reels.html',
      aliases: ['viral-reels', 'product-reels', 'product-reel', 'reels', 'viral-reel', 'প্রোডাক্ট রিলস', 'ভাইরাল প্রোডাক্ট রিলস', 'ভাইরাল রিলস']
    },
    'facebook-ads': {
      canonical: 'facebook-ads',
      label: 'ওয়েবসাইট ও ব্র্যান্ড',
      english: 'Website & Branding',
      pageUrl: 'service-facebook-ads.html',
      aliases: ['facebook-ads', 'branding-web', 'website-brand', 'brand-web', 'facebook-ad', 'ওয়েবসাইট ও ব্র্যান্ড', 'ফেসবুক অ্যাডস', 'ফেসবুক অ্যাড']
    },
    'jewellery': {
      canonical: 'jewellery',
      label: 'জুয়েলারি ও লাক্সারি',
      english: 'Jewellery & Luxury',
      pageUrl: 'service-jewellery-luxury.html',
      aliases: ['jewellery', 'jewellery-luxury', 'jewelry', 'jewelry-luxury', 'জুয়েলারি ও লাক্সারি', 'জুয়েলারি']
    }
  };

  function normalize(cat) {
    if (!cat) return '';
    return String(cat).toLowerCase().trim();
  }

  function getCategoryConfig(cat) {
    if (!cat) return null;
    const norm = normalize(cat);
    for (const key in CATEGORY_MAP) {
      const cfg = CATEGORY_MAP[key];
      if (key === norm || cfg.aliases.some(a => normalize(a) === norm)) {
        return cfg;
      }
    }
    return null;
  }

  function getCanonicalCategory(cat) {
    const cfg = getCategoryConfig(cat);
    return cfg ? cfg.canonical : cat;
  }

  function getCategoryDisplayName(cat) {
    const cfg = getCategoryConfig(cat);
    return cfg ? cfg.label : (cat || 'কমার্শিয়াল মিডিয়া');
  }

  function getCategoryServiceUrl(cat) {
    const cfg = getCategoryConfig(cat);
    return cfg ? cfg.pageUrl : 'index.html#portfolio';
  }

  function getCategoryAliases(cat) {
    if (!cat || cat === 'all') return [];
    const cfg = getCategoryConfig(cat);
    return cfg ? [...cfg.aliases] : [cat];
  }

  function matchesCategory(itemCat, targetCat) {
    if (!targetCat || targetCat === 'all') return true;
    if (!itemCat) return false;
    const normItem = normalize(itemCat);
    const normTarget = normalize(targetCat);
    if (normItem === normTarget) return true;
    const cfgTarget = getCategoryConfig(targetCat);
    if (cfgTarget) {
      return cfgTarget.aliases.some(a => normalize(a) === normItem);
    }
    const cfgItem = getCategoryConfig(itemCat);
    if (cfgItem) {
      return cfgItem.aliases.some(a => normalize(a) === normTarget);
    }
    return false;
  }

  const sys = {
    CATEGORY_MAP,
    normalize,
    getCategoryConfig,
    getCanonicalCategory,
    getCategoryDisplayName,
    getCategoryServiceUrl,
    getCategoryAliases,
    matchesCategory
  };

  if (typeof window !== 'undefined') {
    window.BongBanglaCategorySystem = sys;
  }
  return sys;
})();

// Default Seed Reels Data - Empty
const DEFAULT_REELS = [];

// Curated Showcase Reels for categories that do not yet have cloud uploads in Supabase
const DEFAULT_SHOWCASE_REELS = [
  {
    id: 'showcase-cinema-1',
    category: 'cinema-ads',
    title: '৪K লাক্সারি সিনেমা অ্যাড ও ব্র্যান্ড ফিল্ম',
    client: 'BongBangla Originals',
    tag: '4K CINEMA',
    views: '১.৮M ভিউজ',
    videoUrl: 'https://api.bongbangla.top/vault-api/share.php?t=1c97fb02b8d21a61014d434e292c96dc',
    thumbnail: 'https://api.bongbangla.top/vault-api/share.php?t=2b89b7a48f5b77d885e717f3c7a44b63',
    date: '2026-10-06'
  },
  {
    id: 'showcase-cinema-2',
    category: 'cinema-ads',
    title: 'প্রিমিয়াম মডেল কাস্টিং ও সিনেমা শুট',
    client: 'bongbangla.top',
    tag: '4K RED',
    views: '২.১M ভিউজ',
    videoUrl: 'https://api.bongbangla.top/vault-api/share.php?t=df29dce310e81cadd4a4cafaf3c8b515',
    thumbnail: 'https://api.bongbangla.top/vault-api/share.php?t=bb729cec0c3eb42473d1f259bbce4844',
    date: '2026-10-06'
  },
  {
    id: 'showcase-fb-1',
    category: 'facebook-ads',
    title: 'হাই ROAS পারফিউম ভিডিও অ্যাড ক্রিয়েটিভ',
    client: 'Vintage Fragrance',
    tag: 'HIGH ROAS',
    views: '২.২M ভিউজ',
    videoUrl: 'https://api.bongbangla.top/vault-api/share.php?t=0ff50e1ea45ae95fa9781934bb8c6646',
    thumbnail: 'https://api.bongbangla.top/vault-api/share.php?t=81beeb45343f3bb9cfe408019329456c',
    date: '2026-10-06'
  },
  {
    id: 'showcase-fb-2',
    category: 'facebook-ads',
    title: 'ই-কমার্স ব্র্যান্ডিং ও কনভার্সন অ্যাড',
    client: 'Vintage Fragrance',
    tag: 'META ADS',
    views: '১.৯M ভিউজ',
    videoUrl: 'https://api.bongbangla.top/vault-api/share.php?t=ae89d75a2460279b0172a32db22d03f4',
    thumbnail: 'https://api.bongbangla.top/vault-api/share.php?t=a3ffa994cd67b54f66019135740a42c0',
    date: '2026-10-06'
  },
  {
    id: 'showcase-jewel-1',
    category: 'jewellery',
    title: 'রয়্যাল ব্রাইডাল জুয়েলারি ও ডায়মন্ড শুট',
    client: 'BongBangla Luxury',
    tag: 'LUXURY 4K',
    views: '২.৫M ভিউজ',
    videoUrl: 'https://api.bongbangla.top/vault-api/share.php?t=1c97fb02b8d21a61014d434e292c96dc',
    thumbnail: 'https://api.bongbangla.top/vault-api/share.php?t=2b89b7a48f5b77d885e717f3c7a44b63',
    date: '2026-10-06'
  },
  {
    id: 'showcase-jewel-2',
    category: 'jewellery',
    title: 'গোল্ড জুয়েলারি ও হ্যান্ড মডেল সিনেমাটিক শট',
    client: 'BongBangla Luxury',
    tag: 'MACRO 4K',
    views: '১.৭M ভিউজ',
    videoUrl: 'https://api.bongbangla.top/vault-api/share.php?t=df29dce310e81cadd4a4cafaf3c8b515',
    thumbnail: 'https://api.bongbangla.top/vault-api/share.php?t=bb729cec0c3eb42473d1f259bbce4844',
    date: '2026-10-06'
  }
];

// Helper to get reels from localStorage or cloud cache
function getReels(category = 'all') {
  let reels = [];
  if (window._cachedCloudReels && Array.isArray(window._cachedCloudReels) && window._cachedCloudReels.length > 0) {
    reels = window._cachedCloudReels.filter(r => !r.id || !r.id.match(/^reel-[csvfj]\d+$/));
  } else {
    try {
      const raw = localStorage.getItem('bongbangla_reels');
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          reels = parsed.filter(r => !r.id || !r.id.match(/^reel-[csvfj]\d+$/));
          if (reels.length !== parsed.length) {
            localStorage.setItem('bongbangla_reels', JSON.stringify(reels));
          }
        }
      }
    } catch (e) {
      console.error('Error reading reels:', e);
    }
  }

  if (!Array.isArray(reels) || reels.length === 0) {
    if (Array.isArray(DEFAULT_SHOWCASE_REELS) && DEFAULT_SHOWCASE_REELS.length > 0) {
      reels = DEFAULT_SHOWCASE_REELS;
    } else {
      reels = [];
    }
  }

  if (category === 'all') return reels;
  const catHelper = window.BongBanglaCategorySystem || BongBanglaCategorySystem;
  const filtered = reels.filter(r => catHelper ? catHelper.matchesCategory(r.category, category) : r.category === category);
  if (filtered.length === 0 && Array.isArray(DEFAULT_SHOWCASE_REELS) && DEFAULT_SHOWCASE_REELS.length > 0) {
    return DEFAULT_SHOWCASE_REELS.filter(r => catHelper ? catHelper.matchesCategory(r.category, category) : r.category === category);
  }
  return filtered;
}

function saveReels(reels) {
  const clean = Array.isArray(reels) ? reels.filter(r => !r.id || !r.id.match(/^reel-[csvfj]\d+$/)) : [];
  localStorage.setItem('bongbangla_reels', JSON.stringify(clean));
}

function addReel(newReel) {
  if (newReel && newReel.id && newReel.id.match(/^reel-[csvfj]\d+$/)) return getReels('all');
  const reels = getReels('all');
  reels.unshift(newReel);
  saveReels(reels);
  return reels;
}

function deleteReel(reelId) {
  let reels = getReels('all');
  reels = reels.filter(r => r.id !== reelId);
  saveReels(reels);
  return reels;
}

function resetReelsToDefault() {
  localStorage.setItem('bongbangla_reels', JSON.stringify(DEFAULT_REELS));
  return DEFAULT_REELS;
}

/**
 * Renders the 3 Row x 3 Column (9 Reels per page) grid with full dynamic pagination & Realtime Supabase Sync
 */
async function initReelsPage(options = {}) {
  const {
    category = 'all',
    containerId = 'reels-grid-container',
    paginationId = 'reels-pagination-container',
    countBadgeId = 'reels-total-count',
    perPage = 9
  } = options;

  let currentPage = 1;

  async function render() {
    const container = document.getElementById(containerId);
    const pagination = document.getElementById(paginationId);
    const countBadge = document.getElementById(countBadgeId);

    if (!container) return;

    let allCategoryReels = [];
    if (window.BongBanglaSupabase && window.BongBanglaSupabase.isConfigured()) {
      allCategoryReels = await window.BongBanglaSupabase.fetchReels(category);
    } else {
      allCategoryReels = getReels(category);
    }

    if (allCategoryReels.length === 0 && Array.isArray(DEFAULT_SHOWCASE_REELS) && DEFAULT_SHOWCASE_REELS.length > 0) {
      const catHelper = window.BongBanglaCategorySystem || BongBanglaCategorySystem;
      const showcaseMatches = DEFAULT_SHOWCASE_REELS.filter(r => catHelper ? catHelper.matchesCategory(r.category, category) : r.category === category);
      if (showcaseMatches.length > 0) {
        allCategoryReels = showcaseMatches;
      }
    }

    const totalItems = allCategoryReels.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

    if (currentPage > totalPages) currentPage = totalPages;

    if (countBadge) {
      countBadge.textContent = `${totalItems.toLocaleString('bn-BD')} টি রিলস`;
    }

    // Slice for 9 items (3 rows x 3 columns)
    const startIndex = (currentPage - 1) * perPage;
    const currentReels = allCategoryReels.slice(startIndex, startIndex + perPage);

    if (currentReels.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-16 bg-white rounded-3xl border border-dashed border-[#ED96D7]/50 p-8">
          <i class="fa-solid fa-film text-4xl text-[#ED96D7] mb-3"></i>
          <h4 class="font-bangla font-bold text-lg text-[#2b0e23]">এই ক্যাটাগরিতে এখনও কোনো রিলস যোগ করা হয়নি</h4>
          <p class="text-xs text-[#8c4f75] mt-1 font-bangla">অ্যাডমিন প্যানেল বা Supabase থেকে নতুন রিলস ভিডিও আপলোড করুন।</p>
          <a href="admin.html" class="inline-block mt-4 px-5 py-2.5 rounded-xl bg-[#db2777] text-white text-xs font-bold font-bangla shadow-md hover:bg-[#be185d]">
            <i class="fa-solid fa-plus mr-1.5"></i> অ্যাডমিন থেকে রিলস আপলোড করুন
          </a>
        </div>
      `;
      if (pagination) pagination.innerHTML = '';
      return;
    }

    // Build 3x3 Grid Cards
    container.innerHTML = currentReels.map(reel => {
      const tagText = reel.tag || '4K REC';
      const viewsText = reel.views || '1.5M ভিউজ';
      const clientName = reel.client || 'BongBangla Client';
      const title = reel.title || 'সিনেমাটিক কমার্শিয়াল রিল';
      const rawThumb = reel.thumbnail || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=720&h=1280&q=80';
      const rawVideo = reel.videoUrl || '';
      
      const thumb = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(rawThumb, 'thumbnails') : rawThumb;
      const video = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(rawVideo, 'reels') : rawVideo;

      const catHelper = window.BongBanglaCategorySystem;
      const categoryLabel = catHelper ? catHelper.getCategoryDisplayName(reel.category) : (tagText || 'রিলস');
      const categoryUrl = catHelper ? catHelper.getCategoryServiceUrl(reel.category) : 'service-saree-model-shoot.html';

      return `
        <div class="reel-card group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-[#ED96D7]/40 shadow-lg hover:shadow-2xl hover:border-[#db2777] transition-all duration-300 flex flex-col justify-between"
             data-reel-id="${reel.id}"
             data-video-url="${video}"
             data-title="${encodeURIComponent(title)}"
             data-client="${encodeURIComponent(clientName)}">
          
          <!-- 9:16 Aspect Ratio Poster & Video Preview Container -->
          <div class="relative w-full aspect-[9/16] overflow-hidden bg-black/90 cursor-pointer reel-preview-trigger">
            <img src="${thumb}" alt="${title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
            
            <!-- Atmospheric Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-[#2b0e23]/90 via-transparent to-black/30 pointer-events-none"></div>

            <!-- Top Floating Badges -->
            <div class="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
              <a href="${categoryUrl}" onclick="event.stopPropagation()" class="pointer-events-auto px-2.5 py-1 rounded-full bg-white/95 hover:bg-[#db2777] hover:text-white backdrop-blur-md border border-[#ED96D7]/60 text-[10px] font-bold text-[#db2777] flex items-center gap-1.5 shadow-sm transition-all" title="${categoryLabel} পেজ দেখুন">
                <span class="w-2 h-2 rounded-full bg-[#db2777] pulse-indicator"></span>
                <span>${categoryLabel}</span>
              </a>
              <span class="px-2.5 py-1 rounded-full bg-[#2b0e23]/80 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white shadow-sm flex items-center gap-1">
                <i class="fa-regular fa-eye text-[#ED96D7]"></i> ${viewsText}
              </span>
            </div>

            <!-- Center Big Play Button Overlay -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/90 backdrop-blur-md border border-[#ED96D7] text-[#db2777] flex items-center justify-center text-xl sm:text-2xl shadow-xl group-hover:scale-115 group-hover:bg-[#db2777] group-hover:text-white transition-all duration-300">
                <i class="fa-solid fa-play ml-1"></i>
              </div>
            </div>

            <!-- Bottom Content on Thumbnail -->
            <div class="absolute bottom-3 inset-x-3 text-left pointer-events-none">
              <div class="inline-block px-2.5 py-0.5 rounded-md bg-[#db2777]/90 text-white text-[10px] font-bold mb-1 font-bangla">
                ${clientName}
              </div>
              <h3 class="text-white font-bangla font-bold text-sm sm:text-base leading-snug line-clamp-2 drop-shadow-md">
                ${title}
              </h3>
            </div>
          </div>

          <!-- Bottom Card Action Footer -->
          <div class="p-3.5 bg-white border-t border-[#ED96D7]/20 flex items-center justify-between gap-2">
            <button type="button" class="reel-play-btn flex-1 py-2 rounded-xl bg-[#fdf2f8] hover:bg-[#ED96D7] hover:text-white text-[#db2777] text-xs font-bold font-bangla border border-[#ED96D7]/40 flex items-center justify-center gap-1.5 transition-all shadow-sm">
              <i class="fa-solid fa-circle-play"></i>
              <span>রিলসটি প্লে করুন</span>
            </button>
            <button type="button" 
               onclick="event.stopPropagation(); if (typeof window.openBookingForReel === 'function') { window.openBookingForReel('${encodeURIComponent(title)}', '${encodeURIComponent(clientName)}'); } else { const mBtn=document.querySelector('.open-booking-modal'); if(mBtn) mBtn.click(); else window.location.href='index.html#booking'; }"
               class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#db2777] to-[#ED96D7] hover:opacity-95 text-white text-xs font-bold font-bangla flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
               title="এইরকম রিলস বুক করুন">
              <i class="fa-solid fa-calendar-check text-xs"></i>
              <span>বুকিং</span>
            </button>
          </div>

        </div>
      `;
    }).join('');

    // Attach click listeners to open video lightbox modal
    container.querySelectorAll('.reel-card').forEach(card => {
      const trigger = card.querySelector('.reel-preview-trigger');
      const playBtn = card.querySelector('.reel-play-btn');
      const videoUrl = card.getAttribute('data-video-url');
      const title = decodeURIComponent(card.getAttribute('data-title') || '');
      const client = decodeURIComponent(card.getAttribute('data-client') || '');

      const openHandler = () => {
        openReelVideoModal(videoUrl, title, client, allCategoryReels);
      };

      if (trigger) trigger.addEventListener('click', openHandler);
      if (playBtn) playBtn.addEventListener('click', openHandler);
    });

    // Render Pagination
    if (pagination) {
      if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
      }

      let pagesHtml = '';

      // Previous Button
      pagesHtml += `
        <button type="button" class="reel-page-btn px-3.5 py-2 rounded-xl border text-xs font-bold font-bangla transition-all ${currentPage === 1 ? 'opacity-40 cursor-not-allowed bg-white border-[#ED96D7]/30 text-[#8c4f75]' : 'bg-white border-[#ED96D7] text-[#db2777] hover:bg-[#fdf2f8] shadow-sm'}" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>
          <i class="fa-solid fa-angle-left mr-1"></i> পূর্ববর্তী
        </button>
      `;

      // Numbered Page Buttons
      for (let p = 1; p <= totalPages; p++) {
        const isActive = p === currentPage;
        pagesHtml += `
          <button type="button" class="reel-page-btn w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-bold font-bangla transition-all ${isActive ? 'bg-[#db2777] text-white shadow-md shadow-[#ED96D7]/40 scale-105' : 'bg-white border border-[#ED96D7]/40 text-[#572449] hover:border-[#db2777] hover:text-[#db2777] hover:bg-[#fdf2f8]'}" data-page="${p}">
            ${p.toLocaleString('bn-BD')}
          </button>
        `;
      }

      // Next Button
      pagesHtml += `
        <button type="button" class="reel-page-btn px-3.5 py-2 rounded-xl border text-xs font-bold font-bangla transition-all ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed bg-white border-[#ED96D7]/30 text-[#8c4f75]' : 'bg-white border-[#ED96D7] text-[#db2777] hover:bg-[#fdf2f8] shadow-sm'}" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>
          পরবর্তী <i class="fa-solid fa-angle-right ml-1"></i>
        </button>
      `;

      pagination.innerHTML = pagesHtml;

      pagination.querySelectorAll('.reel-page-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const targetPage = parseInt(btn.getAttribute('data-page'), 10);
          if (!isNaN(targetPage) && targetPage >= 1 && targetPage <= totalPages && targetPage !== currentPage) {
            currentPage = targetPage;
            render();
            const scrollAnchor = document.getElementById('reels-showcase-heading') || container;
            if (scrollAnchor) {
              scrollAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        });
      });
    }
  }

  // Initial render
  await render();

  // Listen to Supabase Realtime changes on 'reels' table
  if (window.BongBanglaSupabase && window.BongBanglaSupabase.getClient()) {
    try {
      const client = window.BongBanglaSupabase.getClient();
      client
        .channel(`public:reels:${category}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'reels' }, () => {
          console.log('⚡ Realtime reels update detected from Supabase!');
          render();
        })
        .subscribe();
    } catch (e) {
      console.warn('Realtime subscription error:', e);
    }
  }
}

let currentModalReelsList = [];
let currentModalReelIndex = 0;

/**
 * 9:16 Video Player Lightbox Modal with Modern Slider Navigation Arrows
 */
function openReelVideoModal(videoUrl, title, client, categoryOrList) {
  let modal = document.getElementById('reel-video-modal');
  
  // Resolve reels list
  let allReels = [];
  if (Array.isArray(categoryOrList)) {
    allReels = categoryOrList;
  } else if (typeof categoryOrList === 'string') {
    allReels = getReels(categoryOrList);
  } else {
    allReels = getReels('all');
  }
  
  if (!allReels || allReels.length === 0) {
    allReels = DEFAULT_REELS;
  }
  currentModalReelsList = allReels;

  // Find index
  const foundIdx = allReels.findIndex(r => {
    const raw = r.videoUrl || '';
    const f = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(raw, 'reels') : raw;
    return raw === videoUrl || f === videoUrl || (title && r.title === title);
  });

  if (foundIdx !== -1) {
    currentModalReelIndex = foundIdx;
  } else {
    allReels.unshift({ videoUrl, title, client });
    currentModalReelIndex = 0;
  }
  currentModalReelsList = allReels;

  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'reel-video-modal';
    modal.className = 'fixed inset-0 z-[60] bg-[#2b0e23]/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none overflow-y-auto';
    modal.innerHTML = `
      <div class="relative w-full max-w-[420px] max-h-[92vh] sm:max-h-[90vh] flex items-center justify-center my-auto">
        <!-- Floating Left Arrow (Vertically Centered on PC) -->
        <button id="reel-modal-prev-btn" class="absolute -left-3 sm:-left-14 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-[#db2777] text-white flex items-center justify-center text-base sm:text-lg transition-all border border-white/20 shadow-xl backdrop-blur-md hover:scale-110 active:scale-95 group cursor-pointer" title="পূর্ববর্তী ভিডিও">
          <i class="fa-solid fa-chevron-left group-hover:-translate-x-0.5 transition-transform"></i>
        </button>

        <div class="relative w-full h-[88vh] max-h-[820px] bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[#ED96D7]/50 flex flex-col" id="reel-modal-card">
          <!-- Top bar with close button -->
          <div class="absolute top-3 inset-x-3 z-30 flex items-center justify-between pointer-events-auto">
            <div class="flex items-center gap-1.5 flex-wrap">
              <div class="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold font-bangla border border-white/20 flex items-center gap-1.5 shadow-md">
                <span id="modal-reel-client">ক্লায়েন্ট</span>
                <span class="text-pink-300/80 text-[10px]" id="modal-reel-counter"></span>
              </div>
              <a id="modal-reel-category-link" href="#" class="px-2.5 py-1 rounded-full bg-black/60 hover:bg-[#db2777] text-pink-200 hover:text-white backdrop-blur-md text-[11px] font-bold font-bangla border border-white/20 flex items-center gap-1 shadow-md transition-all pointer-events-auto" title="এই ক্যাটাগরির সমস্ত রিলস আলাদা পেজে দেখুন">
                <span id="modal-reel-category-name">ক্যাটাগরি</span>
                <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
              </a>
            </div>
            <button id="close-reel-modal-btn" class="w-9 h-9 rounded-full bg-black/60 hover:bg-[#db2777] text-white flex items-center justify-center transition-all border border-white/20 shadow-md cursor-pointer hover:scale-105 active:scale-95">
              <i class="fa-solid fa-xmark text-base"></i>
            </button>
          </div>

          <!-- Video Player Container (Flexes to available space) -->
          <div class="relative flex-1 min-h-0 w-full bg-black flex items-center justify-center overflow-hidden" id="reel-touch-surface">
            <video id="modal-reel-video" class="w-full h-full object-contain sm:object-cover bg-black" playsinline controls autoplay loop>
              <source id="modal-reel-source" src="" type="video/mp4">
              আপনার ব্রাউজার ভিডিও প্লে করতে সমর্থন করে না।
            </video>
          </div>

          <!-- Bottom Action Bar (Fixed height, flex-shrink-0, ALWAYS visible on PC & Mobile) -->
          <div class="flex-shrink-0 p-3.5 sm:p-4 bg-[#fff8fa] border-t border-[#ED96D7]/30 text-left space-y-2 relative z-20">
            <h4 id="modal-reel-title" class="font-bangla font-bold text-xs sm:text-sm text-[#2b0e23] line-clamp-1"></h4>
            <div class="flex items-center gap-2">
              <button id="modal-reel-book-btn" type="button" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ED96D7] to-[#db2777] text-white font-bangla font-bold text-xs shadow-md hover:opacity-95 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer">
                <i class="fa-solid fa-calendar-check"></i>
                <span>এইরকম শুটিং বুক করুন</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Floating Right Arrow (Vertically Centered on PC) -->
        <button id="reel-modal-next-btn" class="absolute -right-3 sm:-right-14 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-[#db2777] text-white flex items-center justify-center text-base sm:text-lg transition-all border border-white/20 shadow-xl backdrop-blur-md hover:scale-110 active:scale-95 group cursor-pointer" title="পরবর্তী ভিডিও">
          <i class="fa-solid fa-chevron-right group-hover:translate-x-0.5 transition-transform"></i>
        </button>
      </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('#close-reel-modal-btn');
    const prevBtn = modal.querySelector('#reel-modal-prev-btn');
    const nextBtn = modal.querySelector('#reel-modal-next-btn');
    const bookBtn = modal.querySelector('#modal-reel-book-btn');

    closeBtn.addEventListener('click', () => {
      const vid = modal.querySelector('#modal-reel-video');
      if (vid) vid.pause();
      modal.classList.add('hidden');
    });

    if (bookBtn) {
      bookBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // 1. Pause video & hide reel modal
        const vid = modal.querySelector('#modal-reel-video');
        if (vid) vid.pause();
        modal.classList.add('hidden');

        // 2. Open booking form with active reel reference
        const activeReel = (currentModalReelsList && currentModalReelsList[currentModalReelIndex]) || {};
        if (typeof window.openBookingForReel === 'function') {
          window.openBookingForReel(activeReel.title || '', activeReel.client || '');
        } else {
          const bookingModal = document.getElementById('booking-modal');
          if (bookingModal) {
            bookingModal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
            const selectEl = document.getElementById('modal-service-select');
            if (selectEl) selectEl.value = 'ভাইরাল প্রোডাক্ট রিলস প্যাক';
            const notesEl = bookingModal.querySelector('textarea[name="notes"]');
            if (notesEl && activeReel.title) {
              notesEl.value = `বুকিং রেফারেন্স: ${activeReel.title} (${activeReel.client || 'ক্লায়েন্ট'})`;
            }
          } else {
            window.location.href = 'index.html#booking';
          }
        }
      });
    }

    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!currentModalReelsList || currentModalReelsList.length === 0) return;
      currentModalReelIndex = (currentModalReelIndex - 1 + currentModalReelsList.length) % currentModalReelsList.length;
      updateReelModalContent(currentModalReelsList[currentModalReelIndex], currentModalReelIndex, currentModalReelsList.length);
    });

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!currentModalReelsList || currentModalReelsList.length === 0) return;
      currentModalReelIndex = (currentModalReelIndex + 1) % currentModalReelsList.length;
      updateReelModalContent(currentModalReelsList[currentModalReelIndex], currentModalReelIndex, currentModalReelsList.length);
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal || (e.target.classList && e.target.classList.contains('select-none') && !e.target.closest('#reel-modal-card'))) {
        const vid = modal.querySelector('#modal-reel-video');
        if (vid) vid.pause();
        modal.classList.add('hidden');
      }
    });

    // Touch swipe for reels modal
    let touchStartX = 0;
    let touchEndX = 0;
    const surface = modal.querySelector('#reel-touch-surface');
    if (surface) {
      surface.addEventListener('touchstart', e => {
        if (e.changedTouches && e.changedTouches[0]) {
          touchStartX = e.changedTouches[0].screenX;
        }
      }, { passive: true });

      surface.addEventListener('touchend', e => {
        if (e.changedTouches && e.changedTouches[0]) {
          touchEndX = e.changedTouches[0].screenX;
          const diff = touchEndX - touchStartX;
          if (Math.abs(diff) > 40) {
            if (diff < 0) {
              // swipe left -> next
              nextBtn.click();
            } else {
              // swipe right -> prev
              prevBtn.click();
            }
          }
        }
      }, { passive: true });
    }

    document.addEventListener('keydown', (e) => {
      if (modal && !modal.classList.contains('hidden')) {
        if (e.key === 'ArrowLeft') prevBtn.click();
        else if (e.key === 'ArrowRight') nextBtn.click();
        else if (e.key === 'Escape') closeBtn.click();
      }
    });
  }

  const activeReel = currentModalReelsList[currentModalReelIndex] || { videoUrl, title, client };
  updateReelModalContent(activeReel, currentModalReelIndex, currentModalReelsList.length);
  modal.classList.remove('hidden');
}

function updateReelModalContent(reel, index, total) {
  const modal = document.getElementById('reel-video-modal');
  if (!modal || !reel) return;

  const rawUrl = reel.videoUrl || '';
  const resolvedVideoUrl = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(rawUrl, 'reels') : rawUrl;
  const videoElem = modal.querySelector('#modal-reel-video');
  const sourceElem = modal.querySelector('#modal-reel-source');
  const titleElem = modal.querySelector('#modal-reel-title');
  const clientElem = modal.querySelector('#modal-reel-client');
  const counterElem = modal.querySelector('#modal-reel-counter');

  const title = reel.title || '৪K কমার্শিয়াল রিলস';
  const client = reel.client || 'BongBangla Production';

  if (titleElem) titleElem.textContent = title;
  if (clientElem) clientElem.textContent = client;
  if (counterElem && total > 1) {
    const bnNums = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'};
    const toBn = n => String(n).split('').map(d => bnNums[d] || d).join('');
    counterElem.textContent = `• ${toBn(index + 1)} / ${toBn(total)}`;
  }
  if (sourceElem) sourceElem.src = resolvedVideoUrl;
  if (videoElem) {
    videoElem.src = resolvedVideoUrl;
    videoElem.load();
    videoElem.play().catch(() => {});
  }

  const catHelper = window.BongBanglaCategorySystem || BongBanglaCategorySystem;
  const catLinkElem = modal.querySelector('#modal-reel-category-link');
  const catNameElem = modal.querySelector('#modal-reel-category-name');
  if (catLinkElem && catNameElem) {
    const catLabel = catHelper ? catHelper.getCategoryDisplayName(reel.category) : (reel.category || 'সার্ভিস রিলস');
    const catUrl = catHelper ? catHelper.getCategoryServiceUrl(reel.category) : 'service-saree-model-shoot.html';
    catNameElem.textContent = catLabel;
    catLinkElem.href = catUrl;
    catLinkElem.title = `${catLabel} এর সমস্ত রিলস আলাদা পেজে দেখুন`;
  }
}

// Expose functions globally
window.BongBanglaReels = {
  getReels,
  saveReels,
  addReel,
  deleteReel,
  resetReelsToDefault,
  initReelsPage,
  openReelVideoModal,
  categorySystem: window.BongBanglaCategorySystem || BongBanglaCategorySystem
};
