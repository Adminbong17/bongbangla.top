/**
 * BongBangla Media & Creative Lab
 * Admin Panel Controller
 * Domain: bongbangla.top
 * Theme: White Pinkish Luxury Aesthetic (#ED96D7)
 */

document.addEventListener('DOMContentLoaded', () => {
  initLogoSwitcher();
  initAuth();
  initDashboard();
});

function initLogoSwitcher() {
  const saved = localStorage.getItem('bongbangla_logo_lang') || 'bn';
  setAdminLogoLang(saved);
}

window.setAdminLogoLang = function(lang) {
  const loginLogo = document.getElementById('admin-login-logo');
  const navLogo = document.getElementById('admin-nav-logo');
  const logoSrc = lang === 'en' ? 'assets/logo-en.png' : 'assets/logo-bn.png';

  if (loginLogo) loginLogo.src = logoSrc;
  if (navLogo) navLogo.src = logoSrc;

  // Toggle button states
  const loginBn = document.getElementById('admin-login-btn-bn');
  const loginEn = document.getElementById('admin-login-btn-en');
  if (loginBn && loginEn) {
    if (lang === 'en') {
      loginEn.className = 'px-2 py-0.5 rounded-full bg-[#db2777] text-white shadow-sm transition-all';
      loginBn.className = 'px-2 py-0.5 rounded-full text-[#572449] hover:text-[#db2777] transition-all';
    } else {
      loginBn.className = 'px-2 py-0.5 rounded-full bg-[#db2777] text-white shadow-sm transition-all';
      loginEn.className = 'px-2 py-0.5 rounded-full text-[#572449] hover:text-[#db2777] transition-all';
    }
  }

  const navBn = document.getElementById('admin-nav-btn-bn');
  const navEn = document.getElementById('admin-nav-btn-en');
  if (navBn && navEn) {
    if (lang === 'en') {
      navEn.className = 'px-1.5 py-0.5 rounded-full bg-[#db2777] text-white shadow-sm transition-all';
      navBn.className = 'px-1.5 py-0.5 rounded-full text-[#572449] hover:text-[#db2777] transition-all';
    } else {
      navBn.className = 'px-1.5 py-0.5 rounded-full bg-[#db2777] text-white shadow-sm transition-all';
      navEn.className = 'px-1.5 py-0.5 rounded-full text-[#572449] hover:text-[#db2777] transition-all';
    }
  }

  localStorage.setItem('bongbangla_logo_lang', lang);
};

/* ==========================================================================
   1. Authentication System
   ========================================================================== */
function initAuth() {
  const loginScreen = document.getElementById('login-screen');
  const dashboardScreen = document.getElementById('dashboard-screen');
  const loginForm = document.getElementById('admin-login-form');
  const logoutBtn = document.getElementById('admin-logout-btn');

  const checkAuth = () => {
    const isAuth = sessionStorage.getItem('bongbangla_admin_auth') === 'true';
    if (isAuth) {
      loginScreen.classList.add('hidden');
      dashboardScreen.classList.remove('hidden');
      renderDashboard();
    } else {
      loginScreen.classList.remove('hidden');
      dashboardScreen.classList.add('hidden');
    }
  };

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('admin-username').value.trim();
      const pass = document.getElementById('admin-password').value.trim();

      if (user === 'admin' && pass === 'bong2026') {
        sessionStorage.setItem('bongbangla_admin_auth', 'true');
        checkAuth();
      } else {
        alert('ভুল ইউজারনেম বা পাসওয়ার্ড! অনুগ্রহ করে সঠিক তথ্য দিন।');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('bongbangla_admin_auth');
      checkAuth();
    });
  }

  checkAuth();
}

/* ==========================================================================
   2. Dashboard Data & Leads Management
   ========================================================================== */
function initDashboard() {
  initSupabaseAdmin();

  const leadFilter = document.getElementById('lead-filter-status');
  if (leadFilter) {
    leadFilter.addEventListener('change', () => {
      renderLeadsTable(leadFilter.value);
    });
  }

  // Export to CSV
  const exportBtn = document.getElementById('export-csv-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportLeadsCSV);
  }

  // Add Lead Modal
  const openAddLeadBtn = document.getElementById('open-add-lead-btn');
  const closeAddLeadBtn = document.getElementById('close-add-lead-btn');
  const addLeadModal = document.getElementById('add-lead-modal');
  const addLeadForm = document.getElementById('add-lead-form');

  if (openAddLeadBtn && addLeadModal) {
    openAddLeadBtn.addEventListener('click', () => addLeadModal.classList.remove('hidden'));
    closeAddLeadBtn.addEventListener('click', () => addLeadModal.classList.add('hidden'));

    addLeadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(addLeadForm);
      const newLead = {
        id: 'L-' + (Math.floor(100 + Math.random() * 900)),
        name: formData.get('name'),
        brand: formData.get('brand'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        budget: formData.get('budget') || '৳ ২৫,০০০',
        date: new Date().toISOString().split('T')[0],
        status: 'New',
        notes: formData.get('notes') || ''
      };

      if (window.BongBanglaSupabase) {
        window.BongBanglaSupabase.submitLead(newLead);
      } else {
        const leads = getLeads();
        leads.unshift(newLead);
        saveLeads(leads);
      }

      addLeadForm.reset();
      addLeadModal.classList.add('hidden');
      renderDashboard();
    });
  }

  // Add Model Modal
  const openAddModelBtn = document.getElementById('open-add-model-btn');
  const closeAddModelBtn = document.getElementById('close-add-model-btn');
  const addModelModal = document.getElementById('add-model-modal');
  const addModelForm = document.getElementById('add-model-form');

  if (openAddModelBtn && addModelModal) {
    openAddModelBtn.addEventListener('click', () => addModelModal.classList.remove('hidden'));
    closeAddModelBtn.addEventListener('click', () => addModelModal.classList.add('hidden'));

    addModelForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(addModelForm);
      const models = getModels();
      const newModel = {
        id: 'M-' + Date.now(),
        name: formData.get('name'),
        category: formData.get('category'),
        height: formData.get('height') || '৫\'৭"',
        shoots: formData.get('shoots') || '২৫+',
        image: formData.get('image') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        available: true
      };
      models.push(newModel);
      saveModels(models);
      addModelForm.reset();
      addModelModal.classList.add('hidden');
      renderModelsGrid();
    });
  }
}

function getLeads() {
  try {
    return JSON.parse(localStorage.getItem('bongbangla_leads') || '[]');
  } catch (e) {
    return [];
  }
}

function saveLeads(leads) {
  localStorage.setItem('bongbangla_leads', JSON.stringify(leads));
}

function getModels() {
  const defaultModels = [
    {
      id: 'M-1',
      name: 'অনন্যা সেন',
      category: 'শাড়ি ও বোল্ড ফ্যাশন',
      height: '৫\'৮"',
      shoots: '৫০+',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      available: true
    },
    {
      id: 'M-2',
      name: 'রাহুল আহমেদ',
      category: 'পাঞ্জাবি ও টিভি কমার্শিয়াল',
      height: '৬\'১"',
      shoots: '৪০+',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      available: true
    },
    {
      id: 'M-3',
      name: 'রিয়া রায়',
      category: 'কসমেটিক্স ও শর্ট রিলস',
      height: '৫\'৬"',
      shoots: '৬৫+',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
      available: true
    },
    {
      id: 'M-4',
      name: 'সামি চৌধুরী',
      category: 'ফিটনেস ও ক্যাজুয়াল পোশাক',
      height: '৬\'০"',
      shoots: '৩৫+',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      available: true
    }
  ];

  try {
    const saved = localStorage.getItem('bongbangla_models');
    if (saved) return JSON.parse(saved);
  } catch (e) {}

  localStorage.setItem('bongbangla_models', JSON.stringify(defaultModels));
  return defaultModels;
}

function saveModels(models) {
  localStorage.setItem('bongbangla_models', JSON.stringify(models));
}

function renderDashboard() {
  updateStats();
  renderLeadsTable('all');
  renderModelsGrid();
  renderAdminReels('all');
  initReelsAdmin();
  initSupabaseAdmin();
}

function initSupabaseAdmin() {
  const openBtn = document.getElementById('open-supabase-settings-btn');
  const closeBtn = document.getElementById('close-supabase-settings-btn');
  const modal = document.getElementById('supabase-settings-modal');
  const form = document.getElementById('supabase-settings-form');
  const urlInput = document.getElementById('supabase-input-url');
  const keyInput = document.getElementById('supabase-input-key');

  const statusDot = document.getElementById('supabase-status-dot');
  const statusText = document.getElementById('supabase-status-text');

  const updateStatusUI = () => {
    if (window.BongBanglaSupabase && window.BongBanglaSupabase.isConfigured()) {
      if (statusDot) statusDot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm';
      if (statusText) statusText.textContent = 'Supabase সিঙ্ক হচ্ছে';
    } else {
      if (statusDot) statusDot.className = 'w-2.5 h-2.5 rounded-full bg-slate-400';
      if (statusText) statusText.textContent = 'লোকাল মোড (Connect)';
    }
  };

  if (window.BongBanglaSupabase) {
    const cfg = window.BongBanglaSupabase.getConfig();
    if (urlInput) urlInput.value = cfg.url || '';
    if (keyInput) keyInput.value = cfg.anonKey || '';
    updateStatusUI();

    if (!window._supabaseSubscribed) {
      window._supabaseSubscribed = true;
      window.BongBanglaSupabase.subscribeToLeads(() => {
        renderDashboard();
      });
    }
  }

  if (openBtn && modal && !openBtn.dataset.initialized) {
    openBtn.dataset.initialized = 'true';
    openBtn.addEventListener('click', () => {
      if (window.BongBanglaSupabase) {
        const cfg = window.BongBanglaSupabase.getConfig();
        if (urlInput) urlInput.value = cfg.url || '';
        if (keyInput) keyInput.value = cfg.anonKey || '';
      }
      modal.classList.remove('hidden');
    });
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const url = urlInput.value.trim();
      const key = keyInput.value.trim();
      if (window.BongBanglaSupabase) {
        window.BongBanglaSupabase.saveConfig(url, key);
        updateStatusUI();
        alert('Supabase ক্রেডেনশিয়াল সফলভাবে সংরক্ষণ হয়েছে!');
        modal.classList.add('hidden');
        renderDashboard();
      }
    });
  }
}

function initReelsAdmin() {
  const reelFilter = document.getElementById('admin-reel-filter');
  if (reelFilter && !reelFilter.dataset.initialized) {
    reelFilter.dataset.initialized = 'true';
    reelFilter.addEventListener('change', () => {
      renderAdminReels(reelFilter.value);
    });
  }

  const resetBtn = document.getElementById('admin-reset-reels-btn');
  if (resetBtn && !resetBtn.dataset.initialized) {
    resetBtn.dataset.initialized = 'true';
    resetBtn.addEventListener('click', () => {
      if (confirm('আপনি কি নিশ্চিতভাবে সব রিলস ডিফল্ট অবস্থায় রিস্টোর করতে চান?')) {
        if (window.BongBanglaReels) {
          window.BongBanglaReels.resetReelsToDefault();
          renderAdminReels('all');
          alert('রিলস ডাটা সফলভাবে রিস্টোর হয়েছে!');
        }
      }
    });
  }

  const openAddReelBtn = document.getElementById('open-add-reel-btn');
  const closeAddReelBtn = document.getElementById('close-add-reel-btn');
  const addReelModal = document.getElementById('add-reel-modal');
  const addReelForm = document.getElementById('add-reel-form');

  if (openAddReelBtn && addReelModal && !openAddReelBtn.dataset.initialized) {
    openAddReelBtn.dataset.initialized = 'true';
    openAddReelBtn.addEventListener('click', () => addReelModal.classList.remove('hidden'));
    closeAddReelBtn.addEventListener('click', () => addReelModal.classList.add('hidden'));

    addReelForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(addReelForm);
      const newReel = {
        id: 'reel-' + Date.now(),
        title: formData.get('title'),
        client: formData.get('client'),
        category: formData.get('category'),
        tag: formData.get('tag') || '4K CINEMA',
        views: formData.get('views') || '১.৫M ভিউজ',
        videoUrl: formData.get('videoUrl'),
        thumbnail: formData.get('thumbnail'),
        date: new Date().toISOString().split('T')[0]
      };

      if (window.BongBanglaReels) {
        window.BongBanglaReels.addReel(newReel);
      }
      addReelForm.reset();
      addReelModal.classList.add('hidden');
      renderAdminReels(reelFilter ? reelFilter.value : 'all');
      alert('নতুন রিলস সফলভাবে আপলোড ও লাইভ করা হয়েছে!');
    });
  }
}

function renderAdminReels(category = 'all') {
  const grid = document.getElementById('admin-reels-grid');
  const emptyState = document.getElementById('reels-empty-state');
  if (!grid || !window.BongBanglaReels) return;

  const reels = window.BongBanglaReels.getReels(category);

  if (reels.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  const categoryNames = {
    'cinema-ads': '৪K সিনেমা অ্যাড',
    'saree-shoot': 'শাড়ি ও বোল্ড শ্যুট',
    'viral-reels': 'ভাইরাল প্রোডাক্ট রিলস',
    'facebook-ads': 'ফেসবুক অ্যাডস',
    'jewellery': 'জুয়েলারি ও লাক্সারি'
  };

  grid.innerHTML = reels.map(r => `
    <div class="glass-panel rounded-2xl overflow-hidden border border-[#ED96D7]/35 group hover:border-[#db2777] shadow-sm hover:shadow-md transition-all bg-white flex flex-col justify-between">
      
      <!-- 9:16 Thumbnail Preview -->
      <div class="aspect-[9/16] relative overflow-hidden bg-black">
        <img src="${r.thumbnail}" alt="${r.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>

        <!-- Top Badges & Delete Button -->
        <div class="absolute top-2 inset-x-2 flex items-center justify-between">
          <span class="px-2 py-0.5 rounded-full bg-white/90 text-[10px] font-bold text-[#db2777] shadow-sm">
            ${r.tag || '4K'}
          </span>
          <button onclick="deleteAdminReel('${r.id}')" class="w-7 h-7 rounded-full bg-rose-600/90 hover:bg-rose-700 text-white flex items-center justify-center text-xs shadow-md transition-colors" title="রিলস ডিলিট করুন">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>

        <!-- Play preview trigger -->
        <button onclick="window.BongBanglaReels.openReelVideoModal('${r.videoUrl}', '${encodeURIComponent(r.title)}', '${encodeURIComponent(r.client)}')" class="absolute inset-0 flex items-center justify-center text-white/90 hover:text-white transition-all">
          <div class="w-11 h-11 rounded-full bg-[#db2777]/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <i class="fa-solid fa-play ml-0.5 text-sm"></i>
          </div>
        </button>

        <!-- Bottom Client Name -->
        <div class="absolute bottom-2 inset-x-2 text-left pointer-events-none">
          <span class="inline-block px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold">
            ${r.client}
          </span>
        </div>
      </div>

      <!-- Info Footer -->
      <div class="p-3 space-y-1.5 font-bangla text-xs bg-white">
        <div class="font-bold text-[#2b0e23] line-clamp-1" title="${r.title}">${r.title}</div>
        <div class="flex items-center justify-between text-[11px] text-[#8c4f75] pt-1.5 border-t border-[#ED96D7]/20">
          <span class="text-[#db2777] font-semibold">${categoryNames[r.category] || r.category}</span>
          <span class="font-medium">${r.views || ''}</span>
        </div>
      </div>

    </div>
  `).join('');
}

window.deleteAdminReel = function(id) {
  if (confirm('আপনি কি নিশ্চিতভাবে এই রিলসটি মুছে ফেলতে চান?')) {
    if (window.BongBanglaReels) {
      window.BongBanglaReels.deleteReel(id);
      const filter = document.getElementById('admin-reel-filter');
      renderAdminReels(filter ? filter.value : 'all');
    }
  }
};

function exportLeadsCSV() {
  const leads = getLeads();
  if (leads.length === 0) {
    alert('এক্সপোর্ট করার মতো কোনো ইনকোয়ারি নেই!');
    return;
  }

  let csv = 'ID,Date,Client Name,Brand,Phone,Service,Budget,Status,Notes\n';
  leads.forEach(l => {
    csv += `"${l.id}","${l.date}","${l.name}","${l.brand}","${l.phone}","${l.service}","${l.budget}","${l.status}","${(l.notes || '').replace(/"/g, '""')}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `BongBangla_Leads_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function renderModelsGrid() {
  const grid = document.getElementById('admin-models-grid');
  if (!grid) return;
  const models = getModels();

  grid.innerHTML = models.map(m => `
    <div class="glass-panel rounded-2xl overflow-hidden border border-[#ED96D7]/30 group hover:border-[#ED96D7] shadow-sm hover:shadow-md transition-all bg-white">
      <div class="aspect-[3/4] relative overflow-hidden bg-[#fdf2f8]">
        <img src="${m.image}" alt="${m.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        <button onclick="deleteModel('${m.id}')" class="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-rose-600/90 hover:bg-rose-700 text-white flex items-center justify-center text-xs shadow-md transition-colors" title="মডেল রিমুভ করুন">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
      <div class="p-4 space-y-1.5 font-bangla text-xs">
        <div class="font-bold text-[#2b0e23] text-sm">${m.name}</div>
        <div class="text-[#be185d] text-[11px] font-semibold">${m.category}</div>
        <div class="flex items-center justify-between text-[#8c4f75] text-[11px] pt-2 border-t border-[#ED96D7]/20">
          <span>উচ্চতা: ${m.height}</span>
          <span>শ্যুট: ${m.shoots}</span>
        </div>
      </div>
    </div>
  `).join('');
}

window.deleteModel = function(id) {
  if (confirm('আপনি কি এই মডেলের প্রোফাইল রিমুভ করতে চান?')) {
    const models = getModels().filter(m => m.id !== id);
    saveModels(models);
    renderModelsGrid();
  }
};
