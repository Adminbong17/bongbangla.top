/**
 * BongBangla Media & Creative Lab
 * Dynamic Reels & Video Portfolio Controller
 * Supports 3x3 Grid (9 reels/page), Admin Uploads, Pagination, and Video Lightbox
 */

// Default Seed Reels Data - Empty
const DEFAULT_REELS = [];

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

  if (!Array.isArray(reels)) {
    reels = [];
  }

  if (category === 'all') return reels;
  return reels.filter(r => r.category === category);
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
              <span class="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#ED96D7]/60 text-[10px] font-bold text-[#db2777] flex items-center gap-1.5 shadow-sm">
                <span class="w-2 h-2 rounded-full bg-[#db2777] pulse-indicator"></span>
                <span>${tagText}</span>
              </span>
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
            <a href="https://wa.me/8801700000000?text=${encodeURIComponent('নমস্কার BongBangla! আমি ' + title + ' (' + clientName + ') এর মতো রিলস শুট করাতে আগ্রহী। বাজেট জানতে চাই।')}" 
               target="_blank" 
               class="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-xs font-bold border border-emerald-300 flex items-center justify-center transition-all shadow-sm"
               title="এইরকম রিলস বুক করুন">
              <i class="fa-brands fa-whatsapp text-sm"></i>
            </a>
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
        openReelVideoModal(videoUrl, title, client);
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
    return raw === videoUrl || f === videoUrl || r.title === title;
  });
  currentModalReelIndex = foundIdx !== -1 ? foundIdx : 0;

  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'reel-video-modal';
    modal.className = 'fixed inset-0 z-50 bg-[#2b0e23]/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none';
    modal.innerHTML = `
      <div class="relative w-full max-w-[440px] flex items-center justify-center">
        <!-- Floating Left Arrow -->
        <button id="reel-modal-prev-btn" class="absolute -left-3 sm:-left-14 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-[#db2777] text-white flex items-center justify-center text-base sm:text-lg transition-all border border-white/20 shadow-xl backdrop-blur-md hover:scale-110 active:scale-95 group cursor-pointer" title="পূর্ববর্তী ভিডিও">
          <i class="fa-solid fa-chevron-left group-hover:-translate-x-0.5 transition-transform"></i>
        </button>

        <div class="relative w-full bg-black rounded-3xl overflow-hidden shadow-2xl border border-[#ED96D7]/50 flex flex-col" id="reel-modal-card">
          <!-- Top bar with close button -->
          <div class="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-auto">
            <div class="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold font-bangla border border-white/20 flex items-center gap-1.5">
              <span id="modal-reel-client">ক্লায়েন্ট</span>
              <span class="text-pink-300/80 text-[10px]" id="modal-reel-counter"></span>
            </div>
            <button id="close-reel-modal-btn" class="w-9 h-9 rounded-full bg-black/60 hover:bg-[#db2777] text-white flex items-center justify-center transition-all border border-white/20 shadow-md">
              <i class="fa-solid fa-xmark text-base"></i>
            </button>
          </div>

          <!-- 9:16 Video Player Container -->
          <div class="relative w-full aspect-[9/16] bg-black flex items-center justify-center overflow-hidden" id="reel-touch-surface">
            <video id="modal-reel-video" class="w-full h-full object-cover" playsinline controls autoplay loop>
              <source id="modal-reel-source" src="" type="video/mp4">
              আপনার ব্রাউজার ভিডিও প্লে করতে সমর্থন করে না।
            </video>
          </div>

          <!-- Bottom Action Bar -->
          <div class="p-4 bg-[#fff8fa] border-t border-[#ED96D7]/30 text-left space-y-2.5">
            <h4 id="modal-reel-title" class="font-bangla font-bold text-sm text-[#2b0e23] line-clamp-1"></h4>
            <div class="flex items-center gap-2">
              <button class="open-booking-modal flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#ED96D7] to-[#db2777] text-white font-bangla font-bold text-xs shadow-md hover:opacity-95 flex items-center justify-center gap-2">
                <i class="fa-solid fa-calendar-check"></i>
                <span>এইরকম শুটিং বুক করুন</span>
              </button>
              <a id="modal-reel-whatsapp-btn" href="#" target="_blank" class="px-3.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center transition-all shadow-md" title="WhatsApp-এ মেসেজ দিন">
                <i class="fa-brands fa-whatsapp text-sm"></i>
              </a>
            </div>
          </div>
        </div>

        <!-- Floating Right Arrow -->
        <button id="reel-modal-next-btn" class="absolute -right-3 sm:-right-14 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-[#db2777] text-white flex items-center justify-center text-base sm:text-lg transition-all border border-white/20 shadow-xl backdrop-blur-md hover:scale-110 active:scale-95 group cursor-pointer" title="পরবর্তী ভিডিও">
          <i class="fa-solid fa-chevron-right group-hover:translate-x-0.5 transition-transform"></i>
        </button>
      </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('#close-reel-modal-btn');
    const prevBtn = modal.querySelector('#reel-modal-prev-btn');
    const nextBtn = modal.querySelector('#reel-modal-next-btn');

    closeBtn.addEventListener('click', () => {
      const vid = modal.querySelector('#modal-reel-video');
      if (vid) vid.pause();
      modal.classList.add('hidden');
    });

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
      if (e.target === modal) {
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
  const waBtn = modal.querySelector('#modal-reel-whatsapp-btn');

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
    videoElem.load();
    videoElem.play().catch(() => {});
  }
  if (waBtn) {
    waBtn.href = `https://wa.me/8801700000000?text=${encodeURIComponent('নমস্কার BongBangla! আমি ' + title + ' (' + client + ') ভিডিওটি দেখেছি এবং এইরকম রিল শ্যুট করাতে চাই।')}`;
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
  openReelVideoModal
};
