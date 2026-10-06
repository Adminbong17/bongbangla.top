/**
 * BongBangla Media & Creative Lab
 * Main JavaScript Controller
 * Domain: bongbangla.top
 * Theme: Royal Bengali Velvet & Jamdani Gold
 */

document.addEventListener('DOMContentLoaded', async () => {
  cleanupMockData();
  initLogoSwitcher();
  initNavbar();
  initPortfolioFilter();
  initLightbox();
  initEstimator();
  initFaqAccordion();
  initModals();
  initContactForm();

  // Show cached data immediately (for returning visitors)
  renderFrontendHeroSlides();
  renderFrontendPortfolio('all');
  renderFrontendModels();

  // Always fetch fresh data from Supabase cloud (works on any device)
  if (window.BongBanglaSupabase) {
    try {
      if (typeof window.BongBanglaSupabase.ensureClient === 'function') {
        await window.BongBanglaSupabase.ensureClient();
      }

      // Fetch models from Supabase and re-render with fresh cloud data
      const cloudModels = await window.BongBanglaSupabase.fetchModels();
      if (Array.isArray(cloudModels) && cloudModels.length > 0) {
        renderFrontendModels(cloudModels);
      }

      // Fetch hero slides from Supabase
      if (typeof window.BongBanglaSupabase.fetchHeroSlides === 'function') {
        const cloudSlides = await window.BongBanglaSupabase.fetchHeroSlides();
        if (Array.isArray(cloudSlides) && cloudSlides.length > 0) {
          renderFrontendHeroSlides(cloudSlides);
        }
      } else {
        renderFrontendHeroSlides();
      }

      // Fetch reels from Supabase
      if (typeof window.BongBanglaSupabase.fetchReels === 'function') {
        const cloudReels = await window.BongBanglaSupabase.fetchReels('all');
        const activeFilter = document.querySelector('.filter-btn.bg-gradient-to-r');
        renderFrontendPortfolio(activeFilter ? activeFilter.getAttribute('data-filter') : 'all', cloudReels);
      } else {
        renderFrontendPortfolio('all');
      }
    } catch(e) {
      console.warn('Supabase fetch error on homepage:', e);
    }

    // Real-time subscriptions for live updates
    if (typeof window.BongBanglaSupabase.subscribeToReels === 'function') {
      window.BongBanglaSupabase.subscribeToReels(async () => {
        const cloudReels = await window.BongBanglaSupabase.fetchReels('all');
        const activeFilter = document.querySelector('.filter-btn.bg-gradient-to-r');
        renderFrontendPortfolio(activeFilter ? activeFilter.getAttribute('data-filter') : 'all', cloudReels);
      });
    }
    if (typeof window.BongBanglaSupabase.subscribeToHeroSlides === 'function') {
      window.BongBanglaSupabase.subscribeToHeroSlides(async () => {
        const cloudSlides = await window.BongBanglaSupabase.fetchHeroSlides();
        renderFrontendHeroSlides(cloudSlides);
      });
    }
    if (typeof window.BongBanglaSupabase.subscribeToModels === 'function') {
      window.BongBanglaSupabase.subscribeToModels(() => {
        window.BongBanglaSupabase.fetchModels().then(models => {
          if (Array.isArray(models) && models.length > 0) renderFrontendModels(models);
        });
      });
    }
  }
});

/* ==========================================================================
   0. Cleanup Legacy Sample/Mock Data
   ========================================================================== */
function cleanupMockData() {
  try {
    const rawLeads = localStorage.getItem('bongbangla_leads');
    if (rawLeads) {
      const leads = JSON.parse(rawLeads);
      if (Array.isArray(leads)) {
        const cleaned = leads.filter(l => !['L-101', 'L-102', 'L-103'].includes(l.id));
        localStorage.setItem('bongbangla_leads', JSON.stringify(cleaned));
      }
    }
    const rawModels = localStorage.getItem('bongbangla_models');
    if (rawModels) {
      const models = JSON.parse(rawModels);
      if (Array.isArray(models)) {
        const cleanedModels = models.filter(m => !['M-1', 'M-2', 'M-3', 'M-4', 'M-101', 'M-102', 'M-103', 'M-104', 'M-1791099527539'].includes(m.id));
        localStorage.setItem('bongbangla_models', JSON.stringify(cleanedModels));
      }
    }
  } catch(e) {}
}

/* ==========================================================================
   0. Brand Logo Switcher (Bangla & English Official Versions)
   ========================================================================== */
function initLogoSwitcher() {
  const savedLang = localStorage.getItem('bongbangla_logo_lang') || 'bn';
  setBrandLogoLang(savedLang);
}

window.setBrandLogoLang = function(lang) {
  const mainLogo = document.getElementById('main-brand-logo');
  const footerLogo = document.getElementById('footer-brand-logo');
  const btnBn = document.getElementById('logo-btn-bn');
  const btnEn = document.getElementById('logo-btn-en');

  const logoSrc = lang === 'en' ? 'assets/logo-en.png' : 'assets/logo-bn.png';
  if (mainLogo) mainLogo.src = logoSrc;
  if (footerLogo) footerLogo.src = logoSrc;

  if (btnBn && btnEn) {
    if (lang === 'en') {
      btnEn.className = 'logo-toggle-btn px-2 py-0.5 rounded-full bg-[#db2777] text-white shadow-sm transition-all';
      btnBn.className = 'logo-toggle-btn px-2 py-0.5 rounded-full text-[#572449] hover:text-[#db2777] transition-all';
    } else {
      btnBn.className = 'logo-toggle-btn px-2 py-0.5 rounded-full bg-[#db2777] text-white shadow-sm transition-all';
      btnEn.className = 'logo-toggle-btn px-2 py-0.5 rounded-full text-[#572449] hover:text-[#db2777] transition-all';
    }
  }
  localStorage.setItem('bongbangla_logo_lang', lang);
};

/* ==========================================================================
   1. Navbar & Mobile Menu Handling
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('main-header');
  const mobileToggle = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('shadow-xl', 'border-b', 'border-[#ED96D7]/40', 'bg-white/95');
    } else {
      header.classList.remove('shadow-xl', 'border-b', 'border-[#ED96D7]/40', 'bg-white/95');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = !mobileDrawer.classList.contains('hidden');
      if (isOpen) {
        mobileDrawer.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      } else {
        mobileDrawer.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      });
    });
  }
}

/* ==========================================================================
   2. Dynamic Frontend Hero Slides, Portfolio & Model Roster System
   ========================================================================== */

function renderFrontendHeroSlides(directData) {
  const container = document.getElementById('hero-slideshow-container');
  const track = document.getElementById('hero-slideshow-track');
  if (!track || !container) return;

  let slides = [];
  // If direct cloud data passed, use it; otherwise fall back to memory cache or localStorage
  if (Array.isArray(directData) && directData.length > 0) {
    slides = directData;
  } else if (window._cachedCloudHeroSlides && Array.isArray(window._cachedCloudHeroSlides) && window._cachedCloudHeroSlides.length > 0) {
    slides = window._cachedCloudHeroSlides;
  } else {
    try {
      const raw = localStorage.getItem('bongbangla_hero_slides');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) slides = parsed;
      }
    } catch(e) {}
  }

  // Fallback: If slides are still empty, derive from active models so the hero background is ALWAYS gorgeous and active
  if (slides.length === 0) {
    const models = (window._cachedCloudModels && window._cachedCloudModels.length > 0) ? window._cachedCloudModels : [];
    if (models.length > 0) {
      slides = models.map(m => ({
        id: 'hero-model-' + m.id,
        title: m.name,
        tag: m.category || '4K CINEMA',
        image: m.image
      }));
    }
  }

  if (slides.length === 0) {
    track.innerHTML = '';
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';

  // Duplicate set to create seamless infinite sliding loop
  const displaySet = slides.length < 5 ? [...slides, ...slides, ...slides, ...slides] : [...slides, ...slides];

  const defaultHeroFallback = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=720&h=1280&q=80';

  track.innerHTML = displaySet.map(s => {
    const rawImg = s.image || defaultHeroFallback;
    const resolvedImg = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(rawImg, 'hero') : rawImg;
    return `
      <div class="model-reel-card">
        <img src="${resolvedImg || defaultHeroFallback}" alt="${s.title}" onerror="this.onerror=null; this.src='${defaultHeroFallback}';" loading="lazy">
        <div class="absolute inset-0 bg-gradient-to-t from-[#2b0e23]/85 via-transparent to-black/20"></div>
        <div class="absolute top-3 left-3 px-2.5 py-1 rounded-full model-card-badge text-[10px] font-bold text-[#db2777] flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-[#db2777] pulse-indicator"></span>
          <span>${s.tag || '4K REC'}</span>
        </div>
        <div class="absolute bottom-3 inset-x-3 text-center">
          <span class="inline-block px-2.5 py-1 rounded-lg model-card-badge text-[11px] font-bold text-[#1a0515] font-bangla">${s.title}</span>
        </div>
      </div>
    `;
  }).join('');
}

function getFrontendCategoryBadge(category) {
  const catHelper = window.BongBanglaCategorySystem;
  if (catHelper && typeof catHelper.getCategoryDisplayName === 'function') {
    return catHelper.getCategoryDisplayName(category);
  }
  const map = {
    'cinema-ads': 'অ্যাড ফিল্ম',
    'saree-shoot': 'শাড়ি ও মডেল শুট',
    'viral-reels': 'প্রোডাক্ট রিলস',
    'facebook-ads': 'ওয়েবসাইট ও ব্র্যান্ড',
    'jewellery': 'জুয়েলারি ও লাক্সারি',
    'commercial-ad': 'অ্যাড ফিল্ম',
    'model-shoot': 'শাড়ি ও মডেল শুট',
    'product-reels': 'প্রোডাক্ট রিলস',
    'branding-web': 'ওয়েবসাইট ও ব্র্যান্ড'
  };
  return map[category] || category || 'কমার্শিয়াল মিডিয়া';
}

function renderFrontendPortfolio(filter = 'all', preloadedReels = null) {
  const container = document.getElementById('portfolio-grid');
  if (!container) return;

  if (Array.isArray(preloadedReels) && preloadedReels.length > 0) {
    window._cachedCloudReels = preloadedReels;
  }
  let reels = window._cachedCloudReels || (Array.isArray(preloadedReels) && preloadedReels.length > 0 ? preloadedReels : []);
  if (reels.length === 0 && window.BongBanglaReels && typeof window.BongBanglaReels.getReels === 'function') {
    reels = window.BongBanglaReels.getReels('all');
  }
  reels = reels.filter(r => r && r.id && !r.id.match(/^reel-[csvfj]\d+$/));

  // Filter category mapping
  const catHelper = window.BongBanglaCategorySystem;
  let filtered = reels;
  if (filter !== 'all') {
    filtered = reels.filter(r => catHelper ? catHelper.matchesCategory(r.category, filter) : r.category === filter);
  }

  if (!filtered || filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 bg-white rounded-3xl border border-dashed border-[#ED96D7]/50 p-8 shadow-xs">
        <div class="w-16 h-16 mx-auto rounded-2xl bg-[#fff0f6] text-[#db2777] flex items-center justify-center text-2xl mb-3 shadow-xs">
          <i class="fa-solid fa-film"></i>
        </div>
        <h4 class="font-bangla font-bold text-base sm:text-lg text-[#2b0e23]">বর্তমানে কোনো রিলস বা পোর্টফোলিও ভিডিও নেই</h4>
        <p class="text-xs text-[#8c4f75] mt-1 font-bangla">অ্যাডমিন প্যানেল থেকে নতুন রিলস ও ভিডিও আপলোড করুন।</p>
        <a href="admin.html" class="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl bg-[#db2777] text-white text-xs font-bold font-bangla shadow-sm hover:bg-[#be185d] transition-all">
          <i class="fa-solid fa-plus"></i> রিলস আপলোড করুন
        </a>
      </div>
    `;
    return;
  }

  const defaultReelFallback = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';

  container.innerHTML = filtered.map(item => {
    const title = item.title || 'BongBangla Production';
    const client = item.client || 'BongBangla Client';
    const tag = item.tag || '4K';
    const views = item.views || '১.৫M ভিউজ';
    const rawThumb = item.thumbnail || defaultReelFallback;
    const rawVideo = item.videoUrl || '';
    const thumb = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(rawThumb, 'thumbnails') : rawThumb;
    const videoUrl = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(rawVideo, 'reels') : rawVideo;
    const categoryLabel = getFrontendCategoryBadge(item.category);
    const categoryUrl = catHelper ? catHelper.getCategoryServiceUrl(item.category) : 'service-saree-model-shoot.html';

    return `
      <div class="portfolio-item gallery-card group cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-[#ED96D7]/35 hover:border-[#db2777] shadow-sm hover:shadow-xl transition-all"
           onclick="if(window.BongBanglaReels){window.BongBanglaReels.openReelVideoModal('${videoUrl}', '${encodeURIComponent(title)}', '${encodeURIComponent(client)}')}">
        <div class="aspect-[3/4] overflow-hidden relative bg-black">
          <img src="${thumb || defaultReelFallback}" alt="${title}" onerror="this.onerror=null; this.src='${defaultReelFallback}';" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
          
          <!-- Top Badges -->
          <div class="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
            <span class="px-2.5 py-1 rounded-full bg-white/90 text-[10px] font-bold text-[#db2777] shadow-sm">
              ${tag}
            </span>
            <span class="px-2.5 py-1 rounded-full bg-black/60 text-[10px] font-bold text-white shadow-sm flex items-center gap-1">
              <i class="fa-regular fa-eye text-[#ED96D7]"></i> ${views}
            </span>
          </div>

          <!-- Gallery Overlay -->
          <div class="gallery-overlay absolute inset-0 flex flex-col justify-end p-5 bg-gradient-to-t from-black/85 via-black/20 to-transparent">
            <a href="${categoryUrl}" onclick="event.stopPropagation()" class="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-pink-200 hover:text-white bg-black/60 hover:bg-[#db2777] px-2.5 py-0.5 rounded-full mb-1 font-bangla border border-pink-300/30 transition-all pointer-events-auto w-fit" title="${categoryLabel} এর আলাদা পেজ দেখুন">
              <span>${categoryLabel}</span>
              <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
            </a>
            <h4 class="font-bangla font-bold text-base sm:text-lg text-white mb-2 leading-snug line-clamp-2">${title}</h4>
            <div class="flex items-center justify-between text-xs text-pink-100">
              <span class="font-bangla flex items-center gap-1"><i class="fa-solid fa-user-tag text-[10px]"></i> ${client}</span>
              <span class="w-9 h-9 rounded-full bg-[#db2777] text-white flex items-center justify-center font-bold shadow-lg shadow-[#db2777]/50 group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-play ml-0.5 text-xs"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderFrontendModels(directData) {
  const container = document.getElementById('frontend-models-grid');
  if (!container) return;

  let models = [];
  // If direct cloud data passed, use it; otherwise fall back to memory cache or localStorage
  if (Array.isArray(directData) && directData.length > 0) {
    models = directData.filter(m => !['M-1', 'M-2', 'M-3', 'M-4', 'M-101', 'M-102', 'M-103', 'M-104'].includes(m.id));
  } else if (window._cachedCloudModels && Array.isArray(window._cachedCloudModels) && window._cachedCloudModels.length > 0) {
    models = window._cachedCloudModels.filter(m => !['M-1', 'M-2', 'M-3', 'M-4', 'M-101', 'M-102', 'M-103', 'M-104'].includes(m.id));
  } else {
    try {
      const raw = localStorage.getItem('bongbangla_models');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          models = parsed.filter(m => !['M-1', 'M-2', 'M-3', 'M-4', 'M-101', 'M-102', 'M-103', 'M-104'].includes(m.id));
        }
      }
    } catch(e) {}
  }

  if (!Array.isArray(models) || models.length === 0) {
    container.className = 'col-span-full w-full';
    container.style.animation = 'none';
    container.innerHTML = `
      <div class="text-center py-12 bg-white rounded-3xl border border-dashed border-[#ED96D7]/50 p-8 shadow-xs w-full max-w-xl mx-auto">
        <div class="w-16 h-16 mx-auto rounded-2xl bg-[#fff0f6] text-[#db2777] flex items-center justify-center text-2xl mb-3 shadow-xs">
          <i class="fa-solid fa-users-viewfinder"></i>
        </div>
        <h4 class="font-bangla font-bold text-base sm:text-lg text-[#2b0e23]">বর্তমানে কোনো মডেল প্রোফাইল সক্রিয় নেই</h4>
        <p class="text-xs text-[#8c4f75] mt-1 font-bangla">অ্যাডমিন প্যানেল থেকে নতুন মডেল ও কাস্টিং প্রোফাইল যুক্ত করুন।</p>
        <a href="admin.html" class="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl bg-[#db2777] text-white text-xs font-bold font-bangla shadow-sm hover:bg-[#be185d] transition-all">
          <i class="fa-solid fa-plus"></i> মডেল যোগ করুন
        </a>
      </div>
    `;
    return;
  }

  // Restore motion track class
  container.className = 'models-motion-track';
  container.style.animation = '';

  // Duplicate set to create seamless continuous infinite loop like Hero section
  let displayModels = [...models];
  if (models.length < 4) {
    displayModels = [...models, ...models, ...models, ...models];
  } else if (models.length < 8) {
    displayModels = [...models, ...models];
  }

  // Adjust animation speed based on card count
  const animDuration = Math.max(25, displayModels.length * 4.5);
  container.style.animationDuration = `${animDuration}s`;

  const defaultModelFallback = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

  container.innerHTML = displayModels.map(m => {
    const rawImg = m.image || defaultModelFallback;
    const modelImg = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(rawImg, 'models') : rawImg;
    const detailsUrl = `model-details.html?id=${encodeURIComponent(m.id)}#model-gallery-section`;

    const galleryItems = Array.isArray(m.gallery) ? m.gallery : [];
    let modelReelsCount = galleryItems.filter(i => (i.type || '').toLowerCase() === 'video' || (i.url && /\.(mp4|webm|mov)(\?|$)/i.test(i.url))).length;
    if (window._cachedCloudReels && Array.isArray(window._cachedCloudReels)) {
      const mNorm = (m.name || '').toLowerCase();
      const mIdNorm = (m.id || '').toLowerCase();
      const matched = window._cachedCloudReels.filter(r => {
        const rTitle = (r.title || '').toLowerCase();
        const rClient = (r.client || '').toLowerCase();
        const rModelId = (r.model_id || r.modelId || '').toLowerCase();
        return (rModelId && rModelId === mIdNorm) || (mNorm.length > 2 && (rTitle.includes(mNorm) || rClient.includes(mNorm) || (mNorm.includes('merina') && rTitle.includes('mumtahina'))));
      });
      modelReelsCount += matched.length;
    }

    return `
      <div class="model-motion-card group">
        <a href="${detailsUrl}" class="aspect-[3/4] relative overflow-hidden bg-[#fdf2f8] block group-hover:opacity-95 transition-opacity">
          <img src="${modelImg || defaultModelFallback}" alt="${m.name}" onerror="this.onerror=null; this.src='${defaultModelFallback}';" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
          
          <!-- Top Badges -->
          <div class="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
            <span class="px-2.5 py-1 rounded-full model-card-badge text-[10px] font-bold text-[#db2777] flex items-center gap-1.5 shadow-sm">
              <span class="w-2 h-2 rounded-full bg-[#db2777] pulse-indicator"></span>
              <span>${m.category || 'মডেল'}</span>
            </span>
            <span class="px-2.5 py-1 rounded-full ${m.available !== false ? 'bg-white/95 text-[#be185d] border-[#ED96D7]/50' : 'bg-gray-100 text-gray-500 border-gray-300'} backdrop-blur-md text-[10px] font-bold border shadow-sm">
              ${m.available !== false ? 'AVAILABLE' : 'BOOKED'}
            </span>
          </div>

          <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <span class="text-white text-xs font-bold font-bangla flex items-center gap-1.5">
              <i class="fa-solid fa-play text-[#ED96D7] text-[10px]"></i>
              <span>ভিডিও রিলস ও পোর্টফোলিও স্লাইডার</span>
              <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </span>
          </div>
        </a>

        <div class="p-4 space-y-2.5 font-bangla">
          <div class="flex items-center justify-between gap-2">
            <a href="${detailsUrl}" class="font-bangla font-bold text-[#2b0e23] text-base hover:text-[#db2777] transition-colors truncate">
              ${m.name}
            </a>
            <span class="text-[11px] text-[#8c4f75] font-semibold truncate"><i class="fa-solid fa-location-dot text-[#db2777] text-[10px] mr-0.5"></i>${m.location || 'ঢাকা'}</span>
          </div>

          <div class="flex items-center justify-between text-[10px] text-[#db2777] bg-[#fdf2f8] px-2.5 py-1 rounded-lg border border-[#ED96D7]/25 font-bold">
            <span class="flex items-center gap-1">
              <i class="fa-solid fa-film text-[10px]"></i>
              <span>${modelReelsCount > 0 ? `${modelReelsCount}টি রিলস ভিডিও` : 'ফটো পোর্টফোলিও'}</span>
            </span>
            <span class="text-pink-600 bg-white px-2 py-0.5 rounded-full border border-[#ED96D7]/40 shadow-xs">স্লাইডার ভিউ</span>
          </div>

          <div class="grid grid-cols-2 gap-2 text-center text-[10px] text-[#572449] bg-[#fdf2f8] p-2 rounded-xl border border-[#ED96D7]/25">
            <div>হাইট: <span class="text-[#2b0e23] font-bold">${m.height || "৫'৭\""}</span></div>
            <div>শ্যুট: <span class="text-[#2b0e23] font-bold">${m.shoots || '২০+'}</span></div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-0.5">
            <a href="${detailsUrl}"
               class="py-2 rounded-xl bg-white hover:bg-[#fdf2f8] text-[#be185d] text-xs font-bold transition-all border border-[#ED96D7]/50 shadow-xs flex items-center justify-center gap-1 hover:border-[#db2777]">
              <i class="fa-solid fa-sliders text-[11px]"></i>
              <span>স্লাইডার</span>
            </a>
            <button onclick="if(window.openBookingForModel){window.openBookingForModel('${encodeURIComponent(m.name)}')}else{const mBtn=document.querySelector('.open-booking-modal'); if(mBtn) mBtn.click();}"
               class="py-2 rounded-xl bg-gradient-to-r from-[#ED96D7] to-[#db2777] text-white text-xs font-bold transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-1">
              <i class="fa-solid fa-calendar-check text-[11px]"></i>
              <span>বুকিং</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  initModelsMotionControls();
}

function initModelsMotionControls() {
  const prevBtn = document.getElementById('models-slide-prev');
  const nextBtn = document.getElementById('models-slide-next');
  const viewport = document.getElementById('models-motion-viewport');
  const track = document.getElementById('frontend-models-grid');

  if (!viewport || !track) return;

  if (prevBtn && !prevBtn.dataset.initialized) {
    prevBtn.dataset.initialized = 'true';
    prevBtn.addEventListener('click', () => {
      track.classList.add('is-paused');
      viewport.scrollBy({ left: -310, behavior: 'smooth' });
      setTimeout(() => track.classList.remove('is-paused'), 3000);
    });
  }

  if (nextBtn && !nextBtn.dataset.initialized) {
    nextBtn.dataset.initialized = 'true';
    nextBtn.addEventListener('click', () => {
      track.classList.add('is-paused');
      viewport.scrollBy({ left: 310, behavior: 'smooth' });
      setTimeout(() => track.classList.remove('is-paused'), 3000);
    });
  }
}


function updateCategoryBanner(filterValue) {
  const banner = document.getElementById('portfolio-category-banner');
  const titleEl = document.getElementById('banner-cat-title');
  const urlEl = document.getElementById('banner-cat-url');
  if (!banner) return;

  if (!filterValue || filterValue === 'all') {
    banner.classList.add('hidden');
    return;
  }

  const catHelper = window.BongBanglaCategorySystem;
  const displayName = catHelper ? catHelper.getCategoryDisplayName(filterValue) : filterValue;
  const pageUrl = catHelper ? catHelper.getCategoryServiceUrl(filterValue) : 'service-saree-model-shoot.html';

  if (titleEl) titleEl.textContent = displayName;
  if (urlEl) {
    urlEl.href = pageUrl;
    urlEl.title = `${displayName} এর সমস্ত রিলস ও শ্যুট আলাদা পেজে দেখুন`;
  }
  banner.classList.remove('hidden');
}

function initPortfolioFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('bg-gradient-to-r', 'from-[#ED96D7]', 'to-[#db2777]', 'text-white', 'border-[#db2777]', 'shadow-[0_0_15px_rgba(237,150,215,0.5)]');
        b.classList.add('bg-white', 'text-[#572449]', 'border-[#ED96D7]/40');
      });

      btn.classList.add('bg-gradient-to-r', 'from-[#ED96D7]', 'to-[#db2777]', 'text-white', 'border-[#db2777]', 'shadow-[0_0_15px_rgba(237,150,215,0.5)]');
      btn.classList.remove('bg-white', 'text-[#572449]', 'border-[#ED96D7]/40');

      const filterValue = btn.getAttribute('data-filter') || 'all';
      updateCategoryBanner(filterValue);
      renderFrontendPortfolio(filterValue);
    });
  });

  // Check URL query parameters for ?category=... or ?filter=... to auto-select
  try {
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('category') || params.get('filter');
    if (catParam) {
      const catHelper = window.BongBanglaCategorySystem;
      const targetBtn = Array.from(filterButtons).find(b => {
        const f = b.getAttribute('data-filter');
        return f === catParam || (catHelper && catHelper.matchesCategory(f, catParam));
      });
      if (targetBtn) {
        setTimeout(() => targetBtn.click(), 80);
      }
    }
  } catch(e) {}
}

/* ==========================================================================
   3. Lightbox Preview Modal (Photos & Simulated Video Reel)
   ========================================================================== */
function initLightbox() {
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = document.getElementById('lightbox-close');

  const triggers = document.querySelectorAll('.lightbox-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = trigger.closest('.portfolio-item');
      if (!parent) return;

      const mediaType = parent.getAttribute('data-media-type') || 'image';
      const mediaSrc = parent.getAttribute('data-media-src') || '';
      const title = parent.getAttribute('data-title') || 'BongBangla Production';
      const category = parent.getAttribute('data-category-label') || 'Commercial Media';
      const desc = parent.getAttribute('data-desc') || 'Shot with 4K cinema equipment, directed by BongBangla creative crew.';

      lightboxTitle.textContent = title;
      lightboxCategory.textContent = category;
      lightboxDesc.textContent = desc;

      if (mediaType === 'video') {
        lightboxImg.classList.add('hidden');
        lightboxVideo.classList.remove('hidden');
        lightboxVideo.src = mediaSrc;
        lightboxVideo.load();
      } else {
        lightboxVideo.classList.add('hidden');
        lightboxVideo.pause();
        lightboxImg.classList.remove('hidden');
        lightboxImg.src = mediaSrc;
      }

      lightboxModal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    });
  });

  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.classList.add('hidden');
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.src = '';
      }
      document.body.classList.remove('overflow-hidden');
    }
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('modal-backdrop')) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeBookingModal();
    }
  });
}

/* ==========================================================================
   4. Interactive Package & Cost Estimator (Bengali Brand Context)
   ========================================================================== */
function initEstimator() {
  const serviceCheckboxes = document.querySelectorAll('.estimator-service');
  const addonCheckboxes = document.querySelectorAll('.estimator-addon');
  const modelCountSelect = document.getElementById('estimator-models');
  const currencySelect = document.getElementById('estimator-currency');
  
  const estimatedPriceEl = document.getElementById('estimated-price-display');
  const estimatedDaysEl = document.getElementById('estimated-days-display');
  const estimatedSummaryEl = document.getElementById('estimator-selected-summary');
  const whatsappQuoteBtn = document.getElementById('whatsapp-quote-btn');

  // Rates in BDT base
  const rates = {
    services: {
      'ad-video': { name: 'Cinema Ad Film (4K TVC & Digital)', base: 35000, days: 5 },
      'product-reels': { name: 'Viral Product Reels (Pack of 8)', base: 22000, days: 3 },
      'bold-shoot': { name: 'Saree, Jamdani & Bold Fashion Shoot', base: 28000, days: 3 },
      'facebook-ads': { name: 'Facebook Ads & F-Commerce Sales Scaling', base: 18000, days: 4 },
      'model-portfolio': { name: 'Model Composite Card & Casting Lookbook', base: 15000, days: 2 },
      'brand-website': { name: 'High-Converting Webstore (with bKash/Nagad & COD)', base: 25000, days: 6 }
    },
    addons: {
      'hair-makeup': { name: 'Top Dhaka Bridal/Fashion MUA & Hair', price: 6000 },
      'drone-cinema': { name: '4K Aerial Drone Coverage', price: 7500 },
      'prime-location': { name: 'Heritage Zamindar Bari / Luxury Studio', price: 10000 },
      'expedited-edit': { name: '48-Hour Priority Festival Delivery', price: 5000 }
    },
    modelFeePerExtra: 8000
  };

  const exchangeRates = {
    BDT: { symbol: '৳', rate: 1 },
    USD: { symbol: '$', rate: 0.0084 },
    INR: { symbol: '₹', rate: 0.70 }
  };

  function calculate() {
    let totalBDT = 0;
    let maxDays = 0;
    const selectedNames = [];

    // Checked services
    serviceCheckboxes.forEach(cb => {
      if (cb.checked) {
        const item = rates.services[cb.value];
        if (item) {
          totalBDT += item.base;
          maxDays = Math.max(maxDays, item.days);
          selectedNames.push(item.name);
        }
      }
    });

    if (selectedNames.length === 0) {
      totalBDT = 0;
      maxDays = 0;
    }

    const modelCount = parseInt(modelCountSelect?.value || '1', 10);
    if (modelCount > 1 && totalBDT > 0) {
      const extraModels = modelCount - 1;
      totalBDT += extraModels * rates.modelFeePerExtra;
      selectedNames.push(`${extraModels} Extra Model(s)`);
    }

    addonCheckboxes.forEach(cb => {
      if (cb.checked && totalBDT > 0) {
        const addon = rates.addons[cb.value];
        if (addon) {
          totalBDT += addon.price;
          selectedNames.push(addon.name);
        }
      }
    });

    const curr = currencySelect?.value || 'BDT';
    const currencyInfo = exchangeRates[curr] || exchangeRates.BDT;
    const finalAmount = Math.round(totalBDT * currencyInfo.rate);

    // Update UI
    if (totalBDT === 0) {
      estimatedPriceEl.textContent = 'প্যাকেজ বাছাই করুন';
      estimatedDaysEl.textContent = '-- কার্যদিবস';
      estimatedSummaryEl.textContent = 'বামপাশের সার্ভিসগুলো থেকে নির্বাচন করুন তাৎক্ষণিক খরচ ও সময়কাল দেখতে।';
    } else {
      estimatedPriceEl.textContent = `${currencyInfo.symbol} ${finalAmount.toLocaleString()}`;
      estimatedDaysEl.textContent = `~ ${maxDays} কর্মদিবস ডেলিভারি`;
      estimatedSummaryEl.innerHTML = `<span class="text-[#f59e0b] font-bold">প্যাকেজে অন্তর্ভুক্ত:</span> ` + selectedNames.join(' • ');
    }

    // Update WhatsApp link
    if (whatsappQuoteBtn) {
      const phone = '8801700000000';
      const text = encodeURIComponent(
        `নমস্কার/সালাম BongBangla টিম!\n\nআমি bongbangla.top ওয়েবসাইট থেকে একটি প্রজেক্টের বাজেট এস্টিমেট করেছি:\n- সার্ভিসসমূহ: ${selectedNames.join(', ')}\n- আনুমানিক বাজেট: ${currencyInfo.symbol} ${finalAmount.toLocaleString()} (${curr})\n- ডেলিভারি সময়কাল: ~${maxDays} দিন\n\nআমাদের ব্র্যান্ডের শুটিং শিডিউল ও বুকিং কনফার্ম করতে চাই।`
      );
      whatsappQuoteBtn.href = `https://wa.me/${phone}?text=${text}`;
    }
  }

  serviceCheckboxes.forEach(cb => cb.addEventListener('change', calculate));
  addonCheckboxes.forEach(cb => cb.addEventListener('change', calculate));
  if (modelCountSelect) modelCountSelect.addEventListener('change', calculate);
  if (currencySelect) currencySelect.addEventListener('change', calculate);

  calculate();
}

/* ==========================================================================
   5. Booking Modal Controller & Direct Action Bridges
   ========================================================================== */
function initModals() {
  const bookingModal = document.getElementById('booking-modal');
  const closeButtons = document.querySelectorAll('.close-booking-modal, #close-booking-modal-btn');

  // Event delegation for static and dynamically rendered open-booking-modal triggers
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.open-booking-modal');
    if (!btn) return;
    e.preventDefault();

    // 1. If a reel video modal is active, pause video and hide it
    const reelModal = document.getElementById('reel-video-modal');
    if (reelModal && !reelModal.classList.contains('hidden')) {
      const vid = reelModal.querySelector('#modal-reel-video');
      if (vid) vid.pause();
      reelModal.classList.add('hidden');
    }

    // 2. If lightbox modal is active, pause video and hide it
    const lightboxModal = document.getElementById('lightbox-modal');
    if (lightboxModal && !lightboxModal.classList.contains('hidden')) {
      const lVid = lightboxModal.querySelector('#lightbox-video');
      if (lVid) {
        lVid.pause();
        lVid.src = '';
      }
      lightboxModal.classList.add('hidden');
    }

    const servicePreset = btn.getAttribute('data-service-preset');
    const selectEl = document.getElementById('modal-service-select');
    if (selectEl && servicePreset) {
      selectEl.value = servicePreset;
    }
    if (bookingModal) {
      bookingModal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
      const nameInput = bookingModal.querySelector('input[name="name"]');
      if (nameInput) setTimeout(() => nameInput.focus(), 150);
    }
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', closeBookingModal);
  });

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal || e.target.classList.contains('modal-backdrop')) {
        closeBookingModal();
      }
    });
  }
}

function closeBookingModal() {
  const bookingModal = document.getElementById('booking-modal');
  if (bookingModal) {
    bookingModal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

// Global programmatic bridge to open booking for a specific model
window.openBookingForModel = function(modelName) {
  const decodedName = typeof modelName === 'string' ? decodeURIComponent(modelName) : '';
  const bookingModal = document.getElementById('booking-modal');
  if (bookingModal) {
    bookingModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    const serviceSelect = document.getElementById('modal-service-select');
    if (serviceSelect) {
      serviceSelect.value = 'মডেল পোর্টফোলিও ও কাস্টিং';
    }
    const notesEl = bookingModal.querySelector('textarea[name="notes"]');
    if (notesEl && decodedName) {
      notesEl.value = `মডেল কাস্টিং বুকিং: ${decodedName}`;
    }
    const nameInput = bookingModal.querySelector('input[name="name"]');
    if (nameInput) setTimeout(() => nameInput.focus(), 150);
  } else {
    window.location.href = 'index.html#booking';
  }
};

// Global programmatic bridge to open booking directly from a video reel
window.openBookingForReel = function(reelTitle, clientName) {
  const decodedTitle = typeof reelTitle === 'string' ? decodeURIComponent(reelTitle) : '';
  const decodedClient = typeof clientName === 'string' ? decodeURIComponent(clientName) : '';

  // 1. Pause video & close reel modal
  const reelModal = document.getElementById('reel-video-modal');
  if (reelModal) {
    const vid = reelModal.querySelector('#modal-reel-video');
    if (vid) vid.pause();
    reelModal.classList.add('hidden');
  }

  // 2. Open booking form
  const bookingModal = document.getElementById('booking-modal');
  if (bookingModal) {
    bookingModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');

    const serviceSelect = document.getElementById('modal-service-select');
    if (serviceSelect) {
      serviceSelect.value = 'ভাইরাল প্রোডাক্ট রিলস প্যাক';
    }

    const notesEl = bookingModal.querySelector('textarea[name="notes"]');
    if (notesEl && decodedTitle) {
      notesEl.value = `বুকিং রেফারেন্স রিল: "${decodedTitle}"${decodedClient ? ` (${decodedClient})` : ''}`;
    }

    const nameInput = bookingModal.querySelector('input[name="name"]');
    if (nameInput) setTimeout(() => nameInput.focus(), 150);
  } else {
    window.location.href = 'index.html#booking';
  }
};


/* ==========================================================================
   6. Contact & Booking Form Submissions (Syncs directly to Supabase & Admin Panel!)
   ========================================================================== */
function initContactForm() {
  const forms = document.querySelectorAll('#booking-form, #modal-booking-form, #direct-contact-form, form[data-lead-form]');

  forms.forEach(form => {
    if (form.dataset.boundSubmit) return;
    form.dataset.boundSubmit = 'true';

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const isModal = Boolean(form.closest('#booking-modal') || form.id === 'modal-booking-form' || form.id === 'booking-form');
      handleFormSubmit(form, isModal);
    });
  });
}

function handleFormSubmit(form, isModal) {
  const formData = new FormData(form);
  const name = (formData.get('name') || '').toString().trim();
  const brand = (formData.get('brand') || '').toString().trim();
  const phone = (formData.get('phone') || '').toString().trim();
  const service = (formData.get('service') || 'General Ad Consultation').toString().trim();
  const notes = (formData.get('notes') || '').toString().trim();
  const budget = (formData.get('budget') || 'পেন্ডিং কোটেশন').toString().trim();

  if (!name || !phone) {
    showToast('অনুগ্রহ করে আপনার নাম ও ফোন নম্বর লিখুন!');
    return;
  }

  const newLead = {
    id: 'L-' + Date.now() + '-' + Math.floor(100 + Math.random() * 900),
    name: name,
    brand: brand || 'ব্যক্তিগত / নতুন ব্র্যান্ড',
    phone: phone,
    service: service,
    budget: budget || 'পেন্ডিং কোটেশন',
    date: new Date().toISOString().split('T')[0],
    status: 'New',
    notes: notes
  };

  // Sync with Supabase Database (with automatic LocalStorage fallback)
  if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.submitLead === 'function') {
    window.BongBanglaSupabase.submitLead(newLead);
  } else {
    try {
      const existingLeads = JSON.parse(localStorage.getItem('bongbangla_leads') || '[]');
      existingLeads.unshift(newLead);
      localStorage.setItem('bongbangla_leads', JSON.stringify(existingLeads));
    } catch (err) {
      console.error('Error saving lead to local database:', err);
    }
  }

  // Direct WhatsApp dispatch option
  const agencyPhone = '8801700000000';
  const message = encodeURIComponent(
    `🔥 নতুন শুটিং ইনকোয়ারি (BongBangla Website)\n\nক্লায়েন্ট: ${name}\nব্র্যান্ড: ${brand}\nমোবাইল/WhatsApp: ${phone}\nসার্ভিস: ${service}\nবাজেট: ${budget}\nপ্রজেক্ট বিবরণ: ${notes}`
  );
  
  showToast(`ধন্যবাদ ${name}! আপনার ইনকোয়ারি সেভ হয়েছে এবং ক্রিয়েটিভ ডিরেক্টরের সাথে WhatsApp কানেক্ট হচ্ছে...`);

  setTimeout(() => {
    try {
      window.open(`https://wa.me/${agencyPhone}?text=${message}`, '_blank');
    } catch(e) {}
    form.reset();
    if (isModal) {
      closeBookingModal();
    }
  }, 1200);
}

/* ==========================================================================
   7. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isExpanded = questionBtn.getAttribute('aria-expanded') === 'true';

        faqItems.forEach(otherItem => {
          const otherBtn = otherItem.querySelector('.faq-question');
          const otherAns = otherItem.querySelector('.faq-answer');
          const otherIcon = otherItem.querySelector('.faq-icon');
          if (otherBtn && otherAns) {
            otherBtn.setAttribute('aria-expanded', 'false');
            otherAns.classList.add('hidden');
            if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
          }
        });

        if (!isExpanded) {
          questionBtn.setAttribute('aria-expanded', 'true');
          answer.classList.remove('hidden');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    }
  });
}

/* ==========================================================================
   8. Utility Toast Notification (Royal Bengali Velvet Style)
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('agency-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'agency-toast';
    toast.className = 'fixed bottom-6 right-6 z-50 bg-white border-2 border-[#ED96D7] text-[#2b0e23] px-5 py-3.5 rounded-2xl shadow-2xl shadow-[#ED96D7]/40 transition-all duration-300 transform translate-y-12 opacity-0 flex items-center gap-3 backdrop-blur-xl';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span class="w-3 h-3 rounded-full bg-[#ED96D7] animate-ping"></span>
    <span class="text-sm font-semibold text-[#2b0e23] font-bangla">${message}</span>
  `;

  setTimeout(() => {
    toast.classList.remove('translate-y-12', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-12', 'opacity-0');
  }, 4500);
}
