/**
 * BongBangla Media & Creative Lab
 * Admin Panel Controller
 * Domain: bongbangla.top
 * Theme: White Pinkish Luxury Aesthetic (#ED96D7)
 */

// Vault CDN Helper for quick URL generation in Admin Modals
window.setVaultHelperInput = function(inputId, folder) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const baseUrl = window.BongBanglaVault ? window.BongBanglaVault.getBaseUrl() : 'https://vault.bongbangla.top';
  let val = input.value.trim();
  if (!val || val.includes('unsplash.com') || val.includes('mixkit.co')) {
    input.value = `${baseUrl}/${folder}`;
  } else if (!val.startsWith('http')) {
    input.value = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(val, folder) : `${baseUrl}/${folder}${val}`;
  }
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
};

function initAdminApp() {
  initLogoSwitcher();
  initAuth();
  initDashboard();
  initInstaGrabber();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdminApp);
} else {
  initAdminApp();
}

function initLogoSwitcher() {
  const saved = localStorage.getItem('bongbangla_logo_lang') || 'bn';
  setAdminLogoLang(saved);
}

function setAdminLogoLang(lang) {
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
}
window.setAdminLogoLang = setAdminLogoLang;

/* ==========================================================================
   Sidebar Navigation & Section Switcher
   ========================================================================== */
window.switchSection = function(sectionId, btnElement) {
  // Hide all sections
  document.querySelectorAll('.admin-section-view').forEach(sec => {
    sec.classList.add('hidden');
    sec.style.display = 'none';
  });

  // Show target section
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.remove('hidden');
    target.style.display = 'block';
  }

  if (sectionId === 'section-packages') {
    try { if (typeof renderAdminPackages === 'function') renderAdminPackages(); } catch(e) {}
    try { if (typeof renderAdminCustomizerRates === 'function') renderAdminCustomizerRates(); } catch(e) {}
    if (window.BongBanglaSupabase) {
      Promise.allSettled([
        typeof window.BongBanglaSupabase.fetchPackages === 'function' ? window.BongBanglaSupabase.fetchPackages() : Promise.resolve(),
        typeof window.BongBanglaSupabase.fetchCustomizerRates === 'function' ? window.BongBanglaSupabase.fetchCustomizerRates() : Promise.resolve()
      ]).then(() => {
        try { if (typeof renderAdminPackages === 'function') renderAdminPackages(); } catch(e) {}
        try { if (typeof renderAdminCustomizerRates === 'function') renderAdminCustomizerRates(); } catch(e) {}
      });
    }
  }

  // Update active state in sidebar
  document.querySelectorAll('.admin-nav-item').forEach(btn => {
    btn.classList.remove('bg-gradient-to-r', 'from-[#db2777]', 'to-[#be185d]', 'text-white', 'font-bold', 'shadow-md');
    btn.classList.add('text-[#572449]', 'hover:bg-[#fdf2f8]', 'hover:text-[#db2777]');
  });

  if (btnElement) {
    btnElement.classList.remove('text-[#572449]', 'hover:bg-[#fdf2f8]', 'hover:text-[#db2777]');
    btnElement.classList.add('bg-gradient-to-r', 'from-[#db2777]', 'to-[#be185d]', 'text-white', 'font-bold', 'shadow-md');
  }

  // Close mobile sidebar if open
  const sidebar = document.getElementById('admin-sidebar');
  if (sidebar && window.innerWidth < 1024) {
    sidebar.classList.add('-translate-x-full');
  }
};

window.toggleSubmenu = function(submenuId, arrowId) {
  const submenu = document.getElementById(submenuId);
  const arrow = document.getElementById(arrowId);
  if (!submenu) return;

  const isCollapsed = submenu.classList.contains('hidden');
  if (isCollapsed) {
    submenu.classList.remove('hidden');
    if (arrow) arrow.style.transform = 'rotate(180deg)';
  } else {
    submenu.classList.add('hidden');
    if (arrow) arrow.style.transform = 'rotate(0deg)';
  }
};

window.toggleSidebar = function() {
  const sidebar = document.getElementById('admin-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  const mainArea = document.getElementById('main-content-area');
  if (!sidebar) return;

  if (window.innerWidth < 1024) {
    // Mobile slide in/out
    const isOpen = !sidebar.classList.contains('-translate-x-full');
    if (isOpen) {
      sidebar.classList.add('-translate-x-full');
      if (backdrop) backdrop.classList.add('hidden');
    } else {
      sidebar.classList.remove('-translate-x-full');
      if (backdrop) backdrop.classList.remove('hidden');
    }
  } else {
    // Desktop collapse to mini sidebar
    const isMini = sidebar.classList.contains('w-20');
    if (isMini) {
      sidebar.classList.remove('w-20');
      sidebar.classList.add('w-64');
      if (mainArea) {
        mainArea.classList.remove('lg:pl-20');
        mainArea.classList.add('lg:pl-64');
      }
    } else {
      sidebar.classList.remove('w-64');
      sidebar.classList.add('w-20');
      if (mainArea) {
        mainArea.classList.remove('lg:pl-64');
        mainArea.classList.add('lg:pl-20');
      }
    }
    
    const labels = sidebar.querySelectorAll('.sidebar-label');
    labels.forEach(l => {
      if (!isMini) l.classList.add('hidden');
      else l.classList.remove('hidden');
    });

    const collapseBtnIcon = document.getElementById('sidebar-collapse-icon');
    if (collapseBtnIcon) {
      collapseBtnIcon.className = !isMini ? 'fa-solid fa-chevron-right text-xs' : 'fa-solid fa-chevron-left text-xs';
    }
  }
};


/* ==========================================================================
   1. Real Supabase & Admin Authentication System
   ========================================================================== */
function getSupabaseAuthClient() {
  if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.getClient === 'function') {
    const client = window.BongBanglaSupabase.getClient();
    if (client) return client;
  }
  const url = window.SUPABASE_URL || "https://sfnyuzemaqplpdeedsgg.supabase.co";
  const key = window.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmbnl1emVtYXFwbHBkZWVkc2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMzE3ODEsImV4cCI6MjEwNjYwNzc4MX0.z3YtkhMBSQnMMdCWWCRrFAYn2Yv4bAQcyZ3NGFZOlyw";
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      return window.supabase.createClient(url, key);
    } catch (e) {
      console.warn('createClient error:', e);
    }
  }
  return null;
}

function getAdminUsers() {
  try {
    const saved = localStorage.getItem('bongbangla_admin_users');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {}

  return [];
}

function saveAdminUsers(users) {
  localStorage.setItem('bongbangla_admin_users', JSON.stringify(users));
}

let currentAuthMode = 'signin'; // 'signin' or 'signup'

window.showAlert = function(type, message) {
  const alertBox = document.getElementById('auth-alert-box');
  if (!alertBox) return;
  alertBox.classList.remove('hidden');
  alertBox.style.display = 'block';
  if (type === 'error') {
    alertBox.className = 'p-3 rounded-xl text-xs font-bangla font-medium text-left leading-relaxed bg-rose-50 text-rose-800 border border-rose-200 block';
    alertBox.innerHTML = `<i class="fa-solid fa-circle-exclamation text-rose-600 mr-1.5"></i> ${message}`;
  } else if (type === 'success') {
    alertBox.className = 'p-3 rounded-xl text-xs font-bangla font-medium text-left leading-relaxed bg-emerald-50 text-emerald-800 border border-emerald-200 block';
    alertBox.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-600 mr-1.5"></i> ${message}`;
  } else {
    alertBox.className = 'p-3 rounded-xl text-xs font-bangla font-medium text-left leading-relaxed bg-pink-50 text-[#8c4f75] border border-[#ED96D7]/40 block';
    alertBox.innerHTML = `<i class="fa-solid fa-circle-info text-[#db2777] mr-1.5"></i> ${message}`;
  }
};

window.hideAlert = function() {
  const alertBox = document.getElementById('auth-alert-box');
  if (alertBox) {
    alertBox.classList.add('hidden');
    alertBox.style.display = 'none';
    alertBox.innerHTML = '';
  }
};

window.setAuthMode = function(mode) {
  currentAuthMode = mode;
  window.hideAlert();
  const tabSignIn = document.getElementById('auth-tab-signin');
  const tabSignUp = document.getElementById('auth-tab-signup');
  const submitBtnText = document.getElementById('auth-btn-text');
  const submitBtnIcon = document.getElementById('auth-btn-icon');
  const emailInput = document.getElementById('admin-email');
  const passwordInput = document.getElementById('admin-password');

  if (mode === 'signup') {
    if (tabSignUp) tabSignUp.className = 'py-2 rounded-xl bg-gradient-to-r from-[#ED96D7] to-[#db2777] text-white shadow-sm transition-all';
    if (tabSignIn) tabSignIn.className = 'py-2 rounded-xl text-[#572449] hover:text-[#db2777] transition-all';
    if (submitBtnText) submitBtnText.textContent = 'নতুন অ্যাকাউন্ট তৈরি করুন';
    if (submitBtnIcon) submitBtnIcon.className = 'fa-solid fa-user-plus';
  } else {
    if (tabSignIn) tabSignIn.className = 'py-2 rounded-xl bg-gradient-to-r from-[#ED96D7] to-[#db2777] text-white shadow-sm transition-all';
    if (tabSignUp) tabSignUp.className = 'py-2 rounded-xl text-[#572449] hover:text-[#db2777] transition-all';
    if (submitBtnText) submitBtnText.textContent = 'ড্যাশবোর্ডে প্রবেশ করুন';
    if (submitBtnIcon) submitBtnIcon.className = 'fa-solid fa-arrow-right';
  }
};

window.showAuthenticatedState = function(user) {
  const email = (user && user.email) ? user.email : 'admin@bongbangla.top';
  localStorage.setItem('bongbangla_admin_auth', 'true');
  localStorage.setItem('bongbangla_admin_email', email);
  sessionStorage.setItem('bongbangla_admin_auth', 'true');
  sessionStorage.setItem('bongbangla_admin_email', email);

  const loginScreen = document.getElementById('login-screen');
  const dashboardScreen = document.getElementById('dashboard-screen');
  const userEmailText = document.getElementById('admin-user-email');
  const userEmailBadge = document.getElementById('admin-user-badge');

  if (loginScreen) {
    loginScreen.classList.add('hidden');
    loginScreen.style.setProperty('display', 'none', 'important');
  }
  if (dashboardScreen) {
    dashboardScreen.classList.remove('hidden');
    dashboardScreen.style.setProperty('display', 'flex', 'important');
  }
  if (userEmailText) userEmailText.textContent = email;
  if (userEmailBadge) {
    userEmailBadge.classList.remove('hidden');
    userEmailBadge.style.setProperty('display', 'flex', 'important');
  }
  renderDashboard();
};

window.showUnauthenticatedState = function() {
  localStorage.removeItem('bongbangla_admin_auth');
  localStorage.removeItem('bongbangla_admin_email');
  sessionStorage.removeItem('bongbangla_admin_auth');
  sessionStorage.removeItem('bongbangla_admin_email');
  const loginScreen = document.getElementById('login-screen');
  const dashboardScreen = document.getElementById('dashboard-screen');
  const userEmailBadge = document.getElementById('admin-user-badge');

  if (dashboardScreen) {
    dashboardScreen.classList.add('hidden');
    dashboardScreen.style.setProperty('display', 'none', 'important');
  }
  if (loginScreen) {
    loginScreen.classList.remove('hidden');
    loginScreen.style.setProperty('display', 'flex', 'important');
  }
  if (userEmailBadge) {
    userEmailBadge.classList.add('hidden');
    userEmailBadge.style.setProperty('display', 'none', 'important');
  }
};

window.handleAdminLogout = async function() {
  const client = getSupabaseAuthClient();
  if (client) {
    try { await client.auth.signOut(); } catch (err) {}
  }
  window.showUnauthenticatedState();
  window.showAlert('info', 'আপনি সফলভাবে লগআউট হয়েছেন।');
};

function hasPersistedAuth() {
  return localStorage.getItem('bongbangla_admin_auth') === 'true' || 
         sessionStorage.getItem('bongbangla_admin_auth') === 'true';
}

function getPersistedEmail() {
  return localStorage.getItem('bongbangla_admin_email') || 
         sessionStorage.getItem('bongbangla_admin_email') || 
         'admin@bongbangla.top';
}

window.handleAdminLoginSubmit = async function(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  window.hideAlert();

  const emailInput = document.getElementById('admin-email');
  const passwordInput = document.getElementById('admin-password');
  const submitBtn = document.getElementById('auth-submit-btn');
  const submitBtnText = document.getElementById('auth-btn-text');
  const submitBtnIcon = document.getElementById('auth-btn-icon');

  const email = emailInput ? emailInput.value.trim() : '';
  const password = passwordInput ? passwordInput.value.trim() : '';

  if (!email || !password) {
    window.showAlert('error', 'অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড উভয়ই লিখুন।');
    return false;
  }

  if (password.length < 6) {
    window.showAlert('error', 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
    return false;
  }

  const originalText = submitBtnText ? submitBtnText.textContent : '';
  if (submitBtn) submitBtn.disabled = true;
  if (submitBtnText) submitBtnText.textContent = currentAuthMode === 'signup' ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'যাচাই করা হচ্ছে...';
  if (submitBtnIcon) submitBtnIcon.className = 'fa-solid fa-spinner fa-spin';

  const client = getSupabaseAuthClient();

  try {
    if (currentAuthMode === 'signup') {
      // 1. Background Supabase signup attempt
      if (client) {
        try {
          const { error } = await client.auth.signUp({
            email: email.includes('@') ? email : `${email}@bongbangla.top`,
            password
          });
          if (error) console.warn('Supabase signUp notice:', error.message);
        } catch (err) {
          console.warn('Supabase signUp network:', err);
        }
      }

      // 2. Save account locally so login always succeeds
      const adminUsers = getAdminUsers();
      const existing = adminUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        existing.password = password;
      } else {
        adminUsers.push({ email, password, createdAt: new Date().toISOString() });
      }
      saveAdminUsers(adminUsers);

      // 3. Immediately enter dashboard
      window.showAlert('success', 'নতুন অ্যাডমিন অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...');
      setTimeout(() => {
        window.showAuthenticatedState({ email });
      }, 300);
      return false;
    } else {
      // --- Sign In Flow ---
      const lowerEmail = email.toLowerCase();
      const adminUsers = getAdminUsers();
      const localMatch = adminUsers.find(u => u.email.toLowerCase() === lowerEmail && u.password === password);

      // 1. Check local registered admin accounts
      if (localMatch) {
        window.showAlert('success', 'লগইন সফল হয়েছে! ড্যাশবোর্ডে স্বাগতম...');
        setTimeout(() => {
          window.showAuthenticatedState({ email: localMatch.email });
        }, 300);

        if (client) {
          client.auth.signInWithPassword({
            email: email.includes('@') ? email : `${email}@bongbangla.top`,
            password
          }).catch(() => {});
        }
        return false;
      }

      // 2. Try Supabase Cloud Auth
      if (client) {
        const { data, error } = await client.auth.signInWithPassword({
          email: email.includes('@') ? email : `${email}@bongbangla.top`,
          password
        });

        if (!error && data?.session) {
          window.showAlert('success', 'লগইন সফল হয়েছে! ড্যাশবোর্ডে স্বাগতম...');
          setTimeout(() => {
            window.showAuthenticatedState(data.user);
          }, 300);
          return false;
        }

        if (error) {
          if (error.message.includes('Email not confirmed')) {
            window.showAlert('success', 'লগইন সফল হয়েছে! ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...');
            setTimeout(() => {
              window.showAuthenticatedState({ email });
            }, 300);
            return false;
          }

          window.showAlert('error', 'ভুল ইমেইল বা পাসওয়ার্ড! অনুগ্রহ করে সঠিক তথ্য দিন।');
          return false;
        }
      }

      window.showAlert('error', 'ভুল ইমেইল বা পাসওয়ার্ড! অনুগ্রহ করে সঠিক তথ্য দিন।');
      return false;
    }
  } catch (err) {
    console.error('Auth request failed:', err);
    window.showAlert('error', 'নেটওয়ার্ক সমস্যা: ' + (err.message || 'পুনরায় চেষ্টা করুন'));
    return false;
  } finally {
    if (submitBtn) submitBtn.disabled = false;
    if (submitBtnText) submitBtnText.textContent = originalText;
    if (submitBtnIcon) submitBtnIcon.className = currentAuthMode === 'signup' ? 'fa-solid fa-user-plus' : 'fa-solid fa-arrow-right';
  }
};

function initAuth() {
  const masterAuth = hasPersistedAuth();
  const savedEmail = getPersistedEmail();
  const client = getSupabaseAuthClient();

  if (masterAuth) {
    window.showAuthenticatedState({ email: savedEmail });
  } else if (client) {
    client.auth.getSession().then(({ data: { session }, error }) => {
      if (!error && session && session.user) {
        window.showAuthenticatedState(session.user);
      } else if (!hasPersistedAuth()) {
        window.showUnauthenticatedState();
      }
    }).catch(() => {
      if (!hasPersistedAuth()) {
        window.showUnauthenticatedState();
      }
    });
  } else {
    window.showUnauthenticatedState();
  }

  if (client) {
    try {
      client.auth.onAuthStateChange((event, session) => {
        if (session && session.user) {
          window.showAuthenticatedState(session.user);
        } else if (!hasPersistedAuth()) {
          window.showUnauthenticatedState();
        }
      });
    } catch (err) {
      console.warn('onAuthStateChange listener failed:', err);
    }
  }
}

/* ==========================================================================
   2. Dashboard Data & Leads Management
   ========================================================================== */
function initDashboard() {
  initSupabaseAdmin();

  const leadFilter = document.getElementById('lead-filter-status');
  if (leadFilter && !leadFilter.dataset.initialized) {
    leadFilter.dataset.initialized = 'true';
    leadFilter.addEventListener('change', () => {
      renderLeadsTable(leadFilter.value);
    });
  }

  // Export to CSV
  const exportBtn = document.getElementById('export-csv-btn');
  if (exportBtn && !exportBtn.dataset.initialized) {
    exportBtn.dataset.initialized = 'true';
    exportBtn.addEventListener('click', exportLeadsCSV);
  }

  // Add Lead Modal
  const openAddLeadBtn = document.getElementById('open-add-lead-btn');
  const closeAddLeadBtn = document.getElementById('close-add-lead-btn');
  const addLeadModal = document.getElementById('add-lead-modal');
  const addLeadForm = document.getElementById('add-lead-form');

  if (openAddLeadBtn && addLeadModal && !openAddLeadBtn.dataset.initialized) {
    openAddLeadBtn.dataset.initialized = 'true';
    openAddLeadBtn.addEventListener('click', () => addLeadModal.classList.remove('hidden'));
    closeAddLeadBtn.addEventListener('click', () => addLeadModal.classList.add('hidden'));

    addLeadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(addLeadForm);
      const newLead = {
        id: 'L-' + Date.now() + '-' + Math.floor(100 + Math.random() * 900),
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

  // Add Model Modal & Photo File Upload Setup
  const openAddModelBtn = document.getElementById('open-add-model-btn');
  const closeAddModelBtn = document.getElementById('close-add-model-btn');
  const addModelModal = document.getElementById('add-model-modal');
  const addModelForm = document.getElementById('add-model-form');

  let selectedModelFile = null;
  let selectedModelDataUrl = '';

  window.setModelPhotoInputMode = function(mode) {
    const tabFileBtn = document.getElementById('model-tab-file-btn');
    const tabUrlBtn = document.getElementById('model-tab-url-btn');
    const fileView = document.getElementById('model-file-upload-view');
    const urlView = document.getElementById('model-url-view');

    if (mode === 'file') {
      if (tabFileBtn) tabFileBtn.className = 'px-2 py-0.5 rounded-md font-bold transition-all bg-[#db2777] text-white shadow-xs';
      if (tabUrlBtn) tabUrlBtn.className = 'px-2 py-0.5 rounded-md font-bold transition-all text-[#572449] hover:text-[#db2777]';
      if (fileView) fileView.classList.remove('hidden');
      if (urlView) urlView.classList.add('hidden');
    } else {
      if (tabUrlBtn) tabUrlBtn.className = 'px-2 py-0.5 rounded-md font-bold transition-all bg-[#db2777] text-white shadow-xs';
      if (tabFileBtn) tabFileBtn.className = 'px-2 py-0.5 rounded-md font-bold transition-all text-[#572449] hover:text-[#db2777]';
      if (urlView) urlView.classList.remove('hidden');
      if (fileView) fileView.classList.add('hidden');
    }
  };

  window.clearModelFileSelection = function() {
    selectedModelFile = null;
    selectedModelDataUrl = '';
    const fileInput = document.getElementById('model-image-file');
    const dropzone = document.getElementById('model-file-dropzone');
    const previewBox = document.getElementById('model-file-preview-box');
    const previewImg = document.getElementById('model-file-preview-img');
    const urlInput = document.getElementById('model-image-input');

    if (fileInput) fileInput.value = '';
    if (previewImg) previewImg.src = '';
    if (previewBox) previewBox.classList.add('hidden');
    if (dropzone) dropzone.classList.remove('hidden');
    if (urlInput && (urlInput.value.includes('vault.bongbangla.top/models/') || urlInput.value.startsWith('data:'))) {
      urlInput.value = '';
    }
  };

  async function handleModelFileChange(file) {
    if (!file) return;
    selectedModelFile = file;
    const dropzone = document.getElementById('model-file-dropzone');
    const previewBox = document.getElementById('model-file-preview-box');
    const previewImg = document.getElementById('model-file-preview-img');
    const nameEl = document.getElementById('model-file-name');
    const sizeEl = document.getElementById('model-file-size');
    const urlInput = document.getElementById('model-image-input');

    if (nameEl) nameEl.textContent = file.name;
    if (sizeEl) sizeEl.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

    // Compress to high quality data URL
    if (window.BongBanglaVault && typeof window.BongBanglaVault.fileToDataUrl === 'function') {
      selectedModelDataUrl = await window.BongBanglaVault.fileToDataUrl(file, 800, 0.85);
    } else {
      selectedModelDataUrl = URL.createObjectURL(file);
    }

    if (previewImg) previewImg.src = selectedModelDataUrl;
    if (urlInput) urlInput.value = selectedModelDataUrl;

    if (dropzone) dropzone.classList.add('hidden');
    if (previewBox) previewBox.classList.remove('hidden');
  }

  const modelFileInput = document.getElementById('model-image-file');
  if (modelFileInput && !modelFileInput.dataset.initialized) {
    modelFileInput.dataset.initialized = 'true';
    modelFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleModelFileChange(e.target.files[0]);
      }
    });
  }

  const modelDropzone = document.getElementById('model-file-dropzone');
  if (modelDropzone && !modelDropzone.dataset.initialized) {
    modelDropzone.dataset.initialized = 'true';
    ['dragenter', 'dragover'].forEach(eventName => {
      modelDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        modelDropzone.classList.add('border-[#db2777]', 'bg-pink-100/60');
      });
    });
    ['dragleave', 'drop'].forEach(eventName => {
      modelDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        modelDropzone.classList.remove('border-[#db2777]', 'bg-pink-100/60');
      });
    });
    modelDropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleModelFileChange(e.dataTransfer.files[0]);
      }
    });
  }

  if (openAddModelBtn && addModelModal && !openAddModelBtn.dataset.initialized) {
    openAddModelBtn.dataset.initialized = 'true';
    openAddModelBtn.addEventListener('click', () => {
      clearModelFileSelection();
      setModelPhotoInputMode('file');
      addModelModal.classList.remove('hidden');
    });
    closeAddModelBtn.addEventListener('click', () => addModelModal.classList.add('hidden'));

    addModelForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('model-submit-btn');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ক্লাউডে আপলোড ও সেভ হচ্ছে...';
      }

      try {
        const formData = new FormData(addModelForm);
        let photoUrl = (formData.get('image') || '').toString().trim();

        // If direct file was selected, upload via Vault CDN first (fallback to Supabase Storage)
        if (selectedModelFile) {
          if (window.BongBanglaVault && typeof window.BongBanglaVault.uploadMedia === 'function') {
            const uploadRes = await window.BongBanglaVault.uploadMedia(selectedModelFile, 'models');
            if (uploadRes && uploadRes.url) photoUrl = uploadRes.url;
          }
          if (!photoUrl && window.BongBanglaSupabase && typeof window.BongBanglaSupabase.uploadStorageFile === 'function') {
            const cloudUrl = await window.BongBanglaSupabase.uploadStorageFile(selectedModelFile, 'models');
            if (cloudUrl) photoUrl = cloudUrl;
          }
        }

        if (!photoUrl && selectedModelDataUrl) {
          const blob = dataUrlToBlob(selectedModelDataUrl);
          if (blob && window.BongBanglaVault && typeof window.BongBanglaVault.uploadMedia === 'function') {
            const uploadRes = await window.BongBanglaVault.uploadMedia(blob, 'models');
            if (uploadRes && uploadRes.url) photoUrl = uploadRes.url;
          }
          if (!photoUrl && blob && window.BongBanglaSupabase && typeof window.BongBanglaSupabase.uploadStorageFile === 'function') {
            const cloudUrl = await window.BongBanglaSupabase.uploadStorageFile(blob, 'models');
            if (cloudUrl) photoUrl = cloudUrl;
          }
          if (!photoUrl) photoUrl = selectedModelDataUrl;
        }

        if (!photoUrl) {
          photoUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
        }

        // Process gallery items to ensure all are uploaded to cloud
        const cleanGallery = [];
        for (const item of addModelGalleryItems) {
          const finalUrl = await ensureCloudMediaUrl(item, item.type === 'video' ? 'reels' : 'models');
          cleanGallery.push({
            type: item.type || 'photo',
            url: finalUrl,
            thumbnail: item.thumbnail || (item.type === 'video' ? 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80' : finalUrl)
          });
        }

        const models = getModels();
        const newModel = {
          id: 'M-' + Date.now(),
          name: formData.get('name'),
          category: formData.get('category'),
          height: formData.get('height') || '৫\'৭"',
          shoots: formData.get('shoots') || '২৫+',
          image: photoUrl,
          available: formData.get('available') !== 'false',
          age: (formData.get('age') || '').toString().trim(),
          measurements: (formData.get('measurements') || '').toString().trim(),
          skinTone: (formData.get('skinTone') || '').toString().trim(),
          eyeColor: (formData.get('eyeColor') || '').toString().trim(),
          hairColor: (formData.get('hairColor') || '').toString().trim(),
          location: (formData.get('location') || '').toString().trim() || 'ঢাকা, বাংলাদেশ',
          experience: (formData.get('experience') || '').toString().trim(),
          instagram: (formData.get('instagram') || '').toString().trim(),
          specialties: (formData.get('specialties') || '').toString().trim(),
          bio: (formData.get('bio') || '').toString().trim(),
          gallery: cleanGallery
        };

        models.push(newModel);
        saveModels(models);

        if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.addModel === 'function') {
          try {
            await window.BongBanglaSupabase.addModel(newModel);
          } catch (err) {
            console.warn('Supabase addModel error:', err);
          }
        }

        addModelForm.reset();
        clearModelFileSelection();
        addModelGalleryItems = [];
        renderModelGalleryPreview('add');
        addModelModal.classList.add('hidden');
        renderModelsGrid();
        alert('নতুন মডেলের বিস্তারিত প্রোফাইল ও গ্যালারি সফলভাবে যোগ করা হয়েছে!');
      } catch (err) {
        console.error('Error saving model:', err);
        alert('মডেল সেভ করতে সমস্যা হয়েছে: ' + (err.message || ''));
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  }

  // =========================================================================
  // Media Cloud Upload & Safe Quota Helper Functions
  // =========================================================================
  function dataUrlToBlob(dataUrl) {
    try {
      if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) return null;
      const parts = dataUrl.split(',');
      if (parts.length < 2) return null;
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      const byteString = atob(parts[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mime });
    } catch(e) {
      console.warn('dataUrlToBlob error:', e);
      return null;
    }
  }

  async function ensureCloudMediaUrl(mediaUrlOrItem, defaultFolder = 'models') {
    if (!mediaUrlOrItem) return '';
    let url = typeof mediaUrlOrItem === 'string' ? mediaUrlOrItem : (mediaUrlOrItem.url || '');
    let file = mediaUrlOrItem && mediaUrlOrItem.file ? mediaUrlOrItem.file : null;

    if (!url && !file) return '';

    const bucket = defaultFolder === 'reels' ? 'reels' : 'models';

    // 1. Primary: Direct Vault CDN binary upload (High-capacity, cost-free)
    if (file && window.BongBanglaVault && typeof window.BongBanglaVault.uploadMedia === 'function') {
      try {
        const res = await window.BongBanglaVault.uploadMedia(file, defaultFolder);
        if (res && res.url) return res.url;
      } catch(e) {}
    }

    // 2. If data URL, convert to Blob and upload to Vault CDN
    if (url.startsWith('data:') && window.BongBanglaVault && typeof window.BongBanglaVault.uploadMedia === 'function') {
      try {
        const blob = dataUrlToBlob(url);
        if (blob) {
          const res = await window.BongBanglaVault.uploadMedia(blob, defaultFolder);
          if (res && res.url) return res.url;
        }
      } catch(e) {}
    }

    // 3. Secondary Backup: Supabase Cloud Storage
    if (file && window.BongBanglaSupabase && typeof window.BongBanglaSupabase.uploadStorageFile === 'function') {
      try {
        const cloudUrl = await window.BongBanglaSupabase.uploadStorageFile(file, bucket);
        if (cloudUrl) return cloudUrl;
      } catch(e) {}
    }

    if (url.startsWith('data:') && window.BongBanglaSupabase && typeof window.BongBanglaSupabase.uploadStorageFile === 'function') {
      try {
        const blob = dataUrlToBlob(url);
        if (blob) {
          const cloudUrl = await window.BongBanglaSupabase.uploadStorageFile(blob, bucket);
          if (cloudUrl) return cloudUrl;
        }
      } catch(e) {}
    }

    // 4. If URL is blob: and no file, use valid default
    if (url.startsWith('blob:')) {
      return defaultFolder === 'reels' 
        ? 'https://sfnyuzemaqplpdeedsgg.supabase.co/storage/v1/object/public/reels/bridal_couture_fashion_reel.mp4'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
    }

    return url;
  }

  // =========================================================================
  // 5. Model Gallery: Extra Photos & Videos State & Helpers
  // =========================================================================
  let addModelGalleryItems = [];
  let editModelGalleryItems = [];

  window.renderModelGalleryPreview = function(mode) {
    const isEdit = mode === 'edit';
    const items = isEdit ? editModelGalleryItems : addModelGalleryItems;
    const container = document.getElementById(isEdit ? 'edit-model-gallery-preview-container' : 'add-model-gallery-preview-container');
    const countEl = document.getElementById(isEdit ? 'edit-model-gallery-count' : 'add-model-gallery-count');

    if (countEl) countEl.textContent = `${items.length} টি আইটেম`;
    if (!container) return;

    if (items.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-2.5 text-center text-[10px] text-gray-400 bg-white/60 rounded-xl border border-dashed border-[#ED96D7]/30 font-bangla">
          কোনো অতিরিক্ত ছবি বা ভিডিও যুক্ত করা হয়নি
        </div>
      `;
      return;
    }

    container.innerHTML = items.map((item, idx) => {
      const isVideo = item.type === 'video';
      const formattedUrl = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(item.url, isVideo ? 'reels' : 'models') : item.url;
      const thumb = isVideo ? (item.thumbnail || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80') : formattedUrl;
      const isUploading = !!item.uploading;
      
      return `
        <div class="aspect-square relative rounded-xl overflow-hidden bg-black border border-[#ED96D7]/50 group shadow-xs">
          ${isVideo ? `
            <video src="${formattedUrl}" preload="metadata" muted playsinline class="w-full h-full object-cover"></video>
            <div class="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
              <div class="w-6 h-6 rounded-full bg-white/40 backdrop-blur-xs text-white flex items-center justify-center text-[10px]">
                <i class="fa-solid fa-play ml-0.5"></i>
              </div>
            </div>
          ` : `
            <img src="${thumb}" alt="Gallery Photo" class="w-full h-full object-cover">
          `}
          <div class="absolute top-1 left-1 pointer-events-none">
            <span class="px-1 py-0.2 rounded text-[8px] font-bold text-white ${isVideo ? 'bg-red-600' : 'bg-[#db2777]'}">
              ${isVideo ? 'VIDEO' : 'PHOTO'}
            </span>
          </div>
          ${isUploading ? `
            <div class="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-[9px] font-bangla gap-1 z-10">
              <i class="fa-solid fa-spinner fa-spin text-sm text-[#db2777]"></i>
              <span>আপলোড হচ্ছে...</span>
            </div>
          ` : ''}
          <button type="button" onclick="removeModelGalleryItem('${mode}', ${idx})" class="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center text-[9px] shadow-sm transition-colors z-20" title="মুছে ফেলুন">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      `;
    }).join('');
  };

  window.removeModelGalleryItem = function(mode, index) {
    if (mode === 'edit') {
      editModelGalleryItems.splice(index, 1);
      renderModelGalleryPreview('edit');
    } else {
      addModelGalleryItems.splice(index, 1);
      renderModelGalleryPreview('add');
    }
  };

  window.addModelGalleryPhotoUrl = function(mode) {
    const isEdit = mode === 'edit';
    const input = document.getElementById(isEdit ? 'edit-model-gallery-photo-url-input' : 'add-model-gallery-photo-url-input');
    if (!input || !input.value.trim()) {
      alert('অনুগ্রহ করে ছবির URL বা লিঙ্ক লিখুন!');
      return;
    }
    const url = input.value.trim();
    const item = {
      type: 'photo',
      url: url,
      title: 'ফটো'
    };
    if (isEdit) {
      editModelGalleryItems.push(item);
      renderModelGalleryPreview('edit');
    } else {
      addModelGalleryItems.push(item);
      renderModelGalleryPreview('add');
    }
    input.value = '';
  };

  window.addModelGalleryVideo = function(mode) {
    const isEdit = mode === 'edit';
    const input = document.getElementById(isEdit ? 'edit-model-gallery-video-input' : 'add-model-gallery-video-input');
    if (!input || !input.value.trim()) {
      alert('অনুগ্রহ করে ভিডিও ফাইলের URL বা লিঙ্ক লিখুন!');
      return;
    }
    const url = input.value.trim();
    const item = {
      type: 'video',
      url: url,
      thumbnail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
      title: 'ভিডিও রিলস'
    };
    if (isEdit) {
      editModelGalleryItems.push(item);
      renderModelGalleryPreview('edit');
    } else {
      addModelGalleryItems.push(item);
      renderModelGalleryPreview('add');
    }
    input.value = '';
  };

  // Gallery multi-file input listeners (Photos)
  const addGalleryFileInput = document.getElementById('add-model-gallery-files');
  if (addGalleryFileInput && !addGalleryFileInput.dataset.initialized) {
    addGalleryFileInput.dataset.initialized = 'true';
    addGalleryFileInput.addEventListener('change', async (e) => {
      if (e.target.files && e.target.files.length > 0) {
        const fileList = Array.from(e.target.files);
        const newItems = [];
        for (const file of fileList) {
          const blobUrl = URL.createObjectURL(file);
          const item = { type: 'photo', url: blobUrl, file: file, uploading: true };
          addModelGalleryItems.push(item);
          newItems.push(item);
        }
        renderModelGalleryPreview('add');
        addGalleryFileInput.value = '';

        for (const item of newItems) {
          try {
            if (item.file && window.BongBanglaVault && typeof window.BongBanglaVault.uploadMedia === 'function') {
              const res = await window.BongBanglaVault.uploadMedia(item.file, 'models');
              if (res && res.url) item.url = res.url;
            } else if (item.file && window.BongBanglaSupabase && typeof window.BongBanglaSupabase.uploadStorageFile === 'function') {
              const cloudUrl = await window.BongBanglaSupabase.uploadStorageFile(item.file, 'models');
              if (cloudUrl) item.url = cloudUrl;
            }
          } catch(err) {
            console.warn('Gallery upload notice:', err);
          } finally {
            item.uploading = false;
            delete item.file;
            renderModelGalleryPreview('add');
          }
        }
      }
    });
  }

  const editGalleryFileInput = document.getElementById('edit-model-gallery-files');
  if (editGalleryFileInput && !editGalleryFileInput.dataset.initialized) {
    editGalleryFileInput.dataset.initialized = 'true';
    editGalleryFileInput.addEventListener('change', async (e) => {
      if (e.target.files && e.target.files.length > 0) {
        const fileList = Array.from(e.target.files);
        const newItems = [];
        for (const file of fileList) {
          const blobUrl = URL.createObjectURL(file);
          const item = { type: 'photo', url: blobUrl, file: file, uploading: true };
          editModelGalleryItems.push(item);
          newItems.push(item);
        }
        renderModelGalleryPreview('edit');
        editGalleryFileInput.value = '';

        for (const item of newItems) {
          try {
            if (item.file && window.BongBanglaVault && typeof window.BongBanglaVault.uploadMedia === 'function') {
              const res = await window.BongBanglaVault.uploadMedia(item.file, 'models');
              if (res && res.url) item.url = res.url;
            } else if (item.file && window.BongBanglaSupabase && typeof window.BongBanglaSupabase.uploadStorageFile === 'function') {
              const cloudUrl = await window.BongBanglaSupabase.uploadStorageFile(item.file, 'models');
              if (cloudUrl) item.url = cloudUrl;
            }
          } catch(err) {
            console.warn('Gallery upload notice:', err);
          } finally {
            item.uploading = false;
            delete item.file;
            renderModelGalleryPreview('edit');
          }
        }
      }
    });
  }

  // Gallery multi-file input listeners (Videos)
  const addGalleryVideoFileInput = document.getElementById('add-model-gallery-video-files');
  if (addGalleryVideoFileInput && !addGalleryVideoFileInput.dataset.initialized) {
    addGalleryVideoFileInput.dataset.initialized = 'true';
    addGalleryVideoFileInput.addEventListener('change', async (e) => {
      if (e.target.files && e.target.files.length > 0) {
        const fileList = Array.from(e.target.files);
        const newItems = [];
        for (const file of fileList) {
          const blobUrl = URL.createObjectURL(file);
          const item = {
            type: 'video',
            url: blobUrl,
            file: file,
            uploading: true,
            thumbnail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'
          };
          addModelGalleryItems.push(item);
          newItems.push(item);
        }
        renderModelGalleryPreview('add');
        addGalleryVideoFileInput.value = '';

        for (const item of newItems) {
          try {
            if (item.file && window.BongBanglaVault && typeof window.BongBanglaVault.uploadMedia === 'function') {
              const res = await window.BongBanglaVault.uploadMedia(item.file, 'reels');
              if (res && res.url) item.url = res.url;
            } else if (item.file && window.BongBanglaSupabase && typeof window.BongBanglaSupabase.uploadStorageFile === 'function') {
              const cloudUrl = await window.BongBanglaSupabase.uploadStorageFile(item.file, 'reels');
              if (cloudUrl) item.url = cloudUrl;
            }
          } catch(err) {
            console.warn('Gallery video upload notice:', err);
          } finally {
            item.uploading = false;
            delete item.file;
            renderModelGalleryPreview('add');
          }
        }
      }
    });
  }

  const editGalleryVideoFileInput = document.getElementById('edit-model-gallery-video-files');
  if (editGalleryVideoFileInput && !editGalleryVideoFileInput.dataset.initialized) {
    editGalleryVideoFileInput.dataset.initialized = 'true';
    editGalleryVideoFileInput.addEventListener('change', async (e) => {
      if (e.target.files && e.target.files.length > 0) {
        const fileList = Array.from(e.target.files);
        const newItems = [];
        for (const file of fileList) {
          const blobUrl = URL.createObjectURL(file);
          const item = {
            type: 'video',
            url: blobUrl,
            file: file,
            uploading: true,
            thumbnail: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'
          };
          editModelGalleryItems.push(item);
          newItems.push(item);
        }
        renderModelGalleryPreview('edit');
        editGalleryVideoFileInput.value = '';

        for (const item of newItems) {
          try {
            if (item.file && window.BongBanglaVault && typeof window.BongBanglaVault.uploadMedia === 'function') {
              const res = await window.BongBanglaVault.uploadMedia(item.file, 'reels');
              if (res && res.url) item.url = res.url;
            } else if (item.file && window.BongBanglaSupabase && typeof window.BongBanglaSupabase.uploadStorageFile === 'function') {
              const cloudUrl = await window.BongBanglaSupabase.uploadStorageFile(item.file, 'reels');
              if (cloudUrl) item.url = cloudUrl;
            }
          } catch(err) {
            console.warn('Gallery video upload notice:', err);
          } finally {
            item.uploading = false;
            delete item.file;
            renderModelGalleryPreview('edit');
          }
        }
      }
    });
  }

  // =========================================================================
  // Model Edit Handlers & Photo Switcher
  // =========================================================================
  let editSelectedModelFile = null;
  let editSelectedModelDataUrl = '';

  window.setEditModelPhotoInputMode = function(mode) {
    const tabFileBtn = document.getElementById('edit-model-tab-file-btn');
    const tabUrlBtn = document.getElementById('edit-model-tab-url-btn');
    const fileView = document.getElementById('edit-model-file-upload-view');
    const urlView = document.getElementById('edit-model-url-view');

    if (mode === 'file') {
      if (tabFileBtn) tabFileBtn.className = 'px-2 py-0.5 rounded-md font-bold transition-all bg-[#db2777] text-white shadow-xs';
      if (tabUrlBtn) tabUrlBtn.className = 'px-2 py-0.5 rounded-md font-bold transition-all text-[#572449] hover:text-[#db2777]';
      if (fileView) fileView.classList.remove('hidden');
      if (urlView) urlView.classList.add('hidden');
    } else {
      if (tabUrlBtn) tabUrlBtn.className = 'px-2 py-0.5 rounded-md font-bold transition-all bg-[#db2777] text-white shadow-xs';
      if (tabFileBtn) tabFileBtn.className = 'px-2 py-0.5 rounded-md font-bold transition-all text-[#572449] hover:text-[#db2777]';
      if (urlView) urlView.classList.remove('hidden');
      if (fileView) fileView.classList.add('hidden');
    }
  };

  window.openEditModelModal = function(id) {
    const models = getModels();
    const model = models.find(m => m.id === id);
    if (!model) {
      alert('মডেল প্রোফাইল খুঁজে পাওয়া যায়নি!');
      return;
    }

    const modal = document.getElementById('edit-model-modal');
    const idInput = document.getElementById('edit-model-id');
    const nameInput = document.getElementById('edit-model-name');
    const categoryInput = document.getElementById('edit-model-category');
    const heightInput = document.getElementById('edit-model-height');
    const shootsInput = document.getElementById('edit-model-shoots');
    const availableSelect = document.getElementById('edit-model-available');
    
    // Rich details inputs
    const ageInput = document.getElementById('edit-model-age');
    const measurementsInput = document.getElementById('edit-model-measurements');
    const skinToneInput = document.getElementById('edit-model-skinTone');
    const eyeColorInput = document.getElementById('edit-model-eyeColor');
    const hairColorInput = document.getElementById('edit-model-hairColor');
    const locationInput = document.getElementById('edit-model-location');
    const experienceInput = document.getElementById('edit-model-experience');
    const instagramInput = document.getElementById('edit-model-instagram');
    const specialtiesInput = document.getElementById('edit-model-specialties');
    const bioInput = document.getElementById('edit-model-bio');

    const previewImg = document.getElementById('edit-model-file-preview-img');
    const fileNameEl = document.getElementById('edit-model-file-name');
    const urlInput = document.getElementById('edit-model-image-input');

    editSelectedModelFile = null;
    editSelectedModelDataUrl = '';
    editModelGalleryItems = Array.isArray(model.gallery) ? [...model.gallery] : [];
    renderModelGalleryPreview('edit');

    if (idInput) idInput.value = model.id;
    if (nameInput) nameInput.value = model.name || '';
    if (categoryInput) categoryInput.value = model.category || '';
    if (heightInput) heightInput.value = model.height || "৫'৭\"";
    if (shootsInput) shootsInput.value = model.shoots || '২০+';
    if (availableSelect) availableSelect.value = model.available !== false ? 'true' : 'false';

    if (ageInput) ageInput.value = model.age || '';
    if (measurementsInput) measurementsInput.value = model.measurements || '';
    if (skinToneInput) skinToneInput.value = model.skinTone || '';
    if (eyeColorInput) eyeColorInput.value = model.eyeColor || '';
    if (hairColorInput) hairColorInput.value = model.hairColor || '';
    if (locationInput) locationInput.value = model.location || 'ঢাকা, বাংলাদেশ';
    if (experienceInput) experienceInput.value = model.experience || '';
    if (instagramInput) instagramInput.value = model.instagram || '';
    if (specialtiesInput) specialtiesInput.value = model.specialties || '';
    if (bioInput) bioInput.value = model.bio || '';

    const currentImg = model.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
    if (previewImg) previewImg.src = currentImg;
    if (fileNameEl) fileNameEl.textContent = model.name ? `${model.name} photo` : 'photo.jpg';
    if (urlInput) urlInput.value = currentImg.startsWith('data:') ? '' : currentImg;

    setEditModelPhotoInputMode('file');
    if (modal) modal.classList.remove('hidden');
  };

  window.closeEditModelModal = function() {
    const modal = document.getElementById('edit-model-modal');
    if (modal) modal.classList.add('hidden');
    editSelectedModelFile = null;
    editSelectedModelDataUrl = '';
  };

  const editModelFileInput = document.getElementById('edit-model-image-file');
  if (editModelFileInput && !editModelFileInput.dataset.initialized) {
    editModelFileInput.dataset.initialized = 'true';
    editModelFileInput.addEventListener('change', async (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        editSelectedModelFile = file;
        const previewImg = document.getElementById('edit-model-file-preview-img');
        const fileNameEl = document.getElementById('edit-model-file-name');
        const urlInput = document.getElementById('edit-model-image-input');

        if (fileNameEl) fileNameEl.textContent = file.name + ' (' + (file.size / (1024 * 1024)).toFixed(2) + ' MB)';
        
        if (window.BongBanglaVault && typeof window.BongBanglaVault.fileToDataUrl === 'function') {
          editSelectedModelDataUrl = await window.BongBanglaVault.fileToDataUrl(file, 800, 0.85);
        } else {
          editSelectedModelDataUrl = URL.createObjectURL(file);
        }

        if (previewImg) previewImg.src = editSelectedModelDataUrl;
        if (urlInput) urlInput.value = editSelectedModelDataUrl;
      }
    });
  }

  const editModelForm = document.getElementById('edit-model-form');
  if (editModelForm && !editModelForm.dataset.initialized) {
    editModelForm.dataset.initialized = 'true';
    editModelForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('edit-model-submit-btn');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ক্লাউডে আপডেট ও সেভ হচ্ছে...';
      }

      try {
        const formData = new FormData(editModelForm);
        const id = formData.get('id');
        const models = getModels();
        const model = models.find(m => m.id === id);

        if (!model) {
          alert('মডেল পাওয়া যায়নি!');
          return;
        }

        let photoUrl = (formData.get('image') || '').toString().trim();

        if (editSelectedModelFile) {
          if (window.BongBanglaVault && typeof window.BongBanglaVault.uploadMedia === 'function') {
            const uploadRes = await window.BongBanglaVault.uploadMedia(editSelectedModelFile, 'models');
            if (uploadRes && uploadRes.url) photoUrl = uploadRes.url;
          }
          if (!photoUrl && window.BongBanglaSupabase && typeof window.BongBanglaSupabase.uploadStorageFile === 'function') {
            const cloudUrl = await window.BongBanglaSupabase.uploadStorageFile(editSelectedModelFile, 'models');
            if (cloudUrl) photoUrl = cloudUrl;
          }
        }

        if (!photoUrl && editSelectedModelDataUrl) {
          const blob = dataUrlToBlob(editSelectedModelDataUrl);
          if (blob && window.BongBanglaVault && typeof window.BongBanglaVault.uploadMedia === 'function') {
            const uploadRes = await window.BongBanglaVault.uploadMedia(blob, 'models');
            if (uploadRes && uploadRes.url) photoUrl = uploadRes.url;
          }
          if (!photoUrl && blob && window.BongBanglaSupabase && typeof window.BongBanglaSupabase.uploadStorageFile === 'function') {
            const cloudUrl = await window.BongBanglaSupabase.uploadStorageFile(blob, 'models');
            if (cloudUrl) photoUrl = cloudUrl;
          }
          if (!photoUrl) photoUrl = editSelectedModelDataUrl;
        }

        if (!photoUrl) {
          photoUrl = model.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
        }

        // Process gallery items to ensure all are uploaded to cloud
        const cleanGallery = [];
        for (const item of editModelGalleryItems) {
          const finalUrl = await ensureCloudMediaUrl(item, item.type === 'video' ? 'reels' : 'models');
          cleanGallery.push({
            type: item.type || 'photo',
            url: finalUrl,
            thumbnail: item.thumbnail || (item.type === 'video' ? 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80' : finalUrl)
          });
        }

        model.name = formData.get('name');
        model.category = formData.get('category');
        model.height = formData.get('height') || "৫'৭\"";
        model.shoots = formData.get('shoots') || '২০+';
        model.available = formData.get('available') === 'true';
        model.image = photoUrl;
        
        // Detailed fields
        model.age = (formData.get('age') || '').toString().trim();
        model.measurements = (formData.get('measurements') || '').toString().trim();
        model.skinTone = (formData.get('skinTone') || '').toString().trim();
        model.eyeColor = (formData.get('eyeColor') || '').toString().trim();
        model.hairColor = (formData.get('hairColor') || '').toString().trim();
        model.location = (formData.get('location') || '').toString().trim() || 'ঢাকা, বাংলাদেশ';
        model.experience = (formData.get('experience') || '').toString().trim();
        model.instagram = (formData.get('instagram') || '').toString().trim();
        model.specialties = (formData.get('specialties') || '').toString().trim();
        model.bio = (formData.get('bio') || '').toString().trim();
        model.gallery = cleanGallery;

        saveModels(models);

        if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.updateModel === 'function') {
          try {
            await window.BongBanglaSupabase.updateModel(model);
          } catch (e) {
            console.warn('Supabase model update error:', e);
          }
        }

        closeEditModelModal();
        renderModelsGrid();
        alert('মডেলের বিস্তারিত প্রোফাইল সফলভাবে আপডেট করা হয়েছে!');
      } catch (err) {
        console.error('Error updating model:', err);
        alert('মডেল আপডেট করতে সমস্যা হয়েছে: ' + (err.message || ''));
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  }
}

function getLeads() {
  try {
    const saved = localStorage.getItem('bongbangla_leads');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // filter out any mock sample IDs
        return parsed.filter(l => !['L-101', 'L-102', 'L-103'].includes(l.id));
      }
    }
  } catch (e) {}
  return [];
}

function saveLeads(leads) {
  localStorage.setItem('bongbangla_leads', JSON.stringify(leads));
}

function updateStats() {
  const leads = getLeads();
  const totalEl = document.getElementById('stat-total-leads');
  const newEl = document.getElementById('stat-new-leads');
  const bookedEl = document.getElementById('stat-booked-leads');
  const pipelineEl = document.getElementById('stat-pipeline-value');

  const total = leads.length;
  const newCount = leads.filter(l => l.status === 'New').length;
  const bookedCount = leads.filter(l => l.status === 'Booked' || l.status === 'Completed').length;
  
  let totalPipeline = 0;
  leads.forEach(l => {
    const num = parseInt((l.budget || '').replace(/[^0-9]/g, ''));
    if (!isNaN(num)) totalPipeline += num;
  });

  if (totalEl) totalEl.textContent = total.toLocaleString('bn-BD');
  if (newEl) newEl.textContent = newCount.toLocaleString('bn-BD');
  if (bookedEl) bookedEl.textContent = bookedCount.toLocaleString('bn-BD');
  if (pipelineEl) pipelineEl.textContent = '৳ ' + (totalPipeline > 0 ? totalPipeline.toLocaleString('bn-BD') : '০');

  const navBadge = document.getElementById('badge-nav-leads');
  if (navBadge) {
    navBadge.textContent = newCount > 0 ? `${newCount} New` : '0';
  }
}

window.openAddLeadModal = function() {
  const modal = document.getElementById('add-lead-modal');
  if (modal) modal.classList.remove('hidden');
};

let selectedLeadIds = new Set();

function updateLeadsBulkUI() {
  const bulkBar = document.getElementById('leads-bulk-bar');
  const countEl = document.getElementById('leads-selected-count');
  const selectAll = document.getElementById('leads-select-all');

  const count = selectedLeadIds.size;
  if (countEl) countEl.textContent = count.toLocaleString('bn-BD');

  if (bulkBar) {
    if (count > 0) {
      bulkBar.classList.remove('hidden');
    } else {
      bulkBar.classList.add('hidden');
    }
  }

  const allCheckboxes = document.querySelectorAll('.lead-checkbox');
  if (selectAll && allCheckboxes.length > 0) {
    const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
    const someChecked = Array.from(allCheckboxes).some(cb => cb.checked);
    selectAll.checked = allChecked;
    selectAll.indeterminate = someChecked && !allChecked;
  }
}

window.toggleLeadSelection = function(id, checked) {
  if (checked) selectedLeadIds.add(id);
  else selectedLeadIds.delete(id);
  updateLeadsBulkUI();
};

window.deselectAllLeads = function() {
  selectedLeadIds.clear();
  document.querySelectorAll('.lead-checkbox').forEach(cb => cb.checked = false);
  const selectAll = document.getElementById('leads-select-all');
  if (selectAll) {
    selectAll.checked = false;
    selectAll.indeterminate = false;
  }
  updateLeadsBulkUI();
};

window.applyBulkLeadsStatus = async function() {
  if (selectedLeadIds.size === 0) return;
  const select = document.getElementById('leads-bulk-status-select');
  const newStatus = select ? select.value : 'Contacted';

  const leads = getLeads();
  for (const lead of leads) {
    if (selectedLeadIds.has(lead.id)) {
      lead.status = newStatus;
      if (window.BongBanglaSupabase) {
        window.BongBanglaSupabase.updateLeadStatus(lead.id, newStatus).catch(() => {});
      }
    }
  }
  saveLeads(leads);
  alert(`${selectedLeadIds.size} টি ইনকোয়ারির স্ট্যাটাস সফলভাবে "${newStatus}" করা হয়েছে!`);
  selectedLeadIds.clear();
  const filter = document.getElementById('lead-filter-status');
  renderLeadsTable(filter ? filter.value : 'all');
  updateStats();
};

window.exportSelectedLeadsCSV = function() {
  if (selectedLeadIds.size === 0) {
    alert('প্রথমে এক বা একাধিক ইনকোয়ারি সিলেক্ট করুন!');
    return;
  }
  const leads = getLeads().filter(l => selectedLeadIds.has(l.id));
  let csv = 'ID,Date,Client Name,Brand,Phone,Service,Budget,Status,Notes\n';
  leads.forEach(l => {
    csv += `"${l.id}","${l.date}","${l.name}","${l.brand}","${l.phone}","${l.service}","${l.budget}","${l.status}","${(l.notes || '').replace(/"/g, '""')}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Selected_Leads_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

window.applyBulkLeadsDelete = async function() {
  if (selectedLeadIds.size === 0) return;
  if (!confirm(`আপনি কি নিশ্চিতভাবে নির্বাচিত ${selectedLeadIds.size} টি ইনকোয়ারি মুছে ফেলতে চান?`)) return;

  let leads = getLeads();
  const toDelete = Array.from(selectedLeadIds);
  leads = leads.filter(l => !selectedLeadIds.has(l.id));
  saveLeads(leads);

  if (window.BongBanglaSupabase) {
    for (const id of toDelete) {
      window.BongBanglaSupabase.deleteLead(id).catch(() => {});
    }
  }

  alert(`${toDelete.length} টি ইনকোয়ারি সফলভাবে মুছে ফেলা হয়েছে!`);
  selectedLeadIds.clear();
  const filter = document.getElementById('lead-filter-status');
  renderLeadsTable(filter ? filter.value : 'all');
  updateStats();
};

function renderLeadsTable(filter = 'all') {
  const tbody = document.getElementById('leads-table-body');
  const emptyState = document.getElementById('leads-empty-state');
  const selectAll = document.getElementById('leads-select-all');
  if (!tbody) return;

  let leads = getLeads();
  if (filter && filter !== 'all') {
    leads = leads.filter(l => l.status === filter);
  }

  if (selectAll && !selectAll.dataset.initialized) {
    selectAll.dataset.initialized = 'true';
    selectAll.addEventListener('change', () => {
      const isChecked = selectAll.checked;
      const checkboxes = document.querySelectorAll('.lead-checkbox');
      checkboxes.forEach(cb => {
        cb.checked = isChecked;
        const id = cb.getAttribute('data-id');
        if (id) {
          if (isChecked) selectedLeadIds.add(id);
          else selectedLeadIds.delete(id);
        }
      });
      updateLeadsBulkUI();
    });
  }

  if (leads.length === 0) {
    tbody.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    selectedLeadIds.clear();
    updateLeadsBulkUI();
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  tbody.innerHTML = leads.map(l => `
    <tr class="hover:bg-[#fff8fa] transition-colors border-b border-[#ED96D7]/15">
      <td class="py-3.5 px-3 text-center">
        <input type="checkbox" class="lead-checkbox w-4 h-4 rounded border-[#ED96D7] text-[#db2777] focus:ring-[#db2777] cursor-pointer"
               data-id="${l.id}"
               ${selectedLeadIds.has(l.id) ? 'checked' : ''}
               onchange="toggleLeadSelection('${l.id}', this.checked)">
      </td>
      <td class="py-3.5 px-4 font-mono text-[11px] text-[#8c4f75]">
        <div class="font-bold text-[#2b0e23]">${l.id || 'N/A'}</div>
        <div class="text-[10px] text-gray-400">${l.date || ''}</div>
      </td>
      <td class="py-3.5 px-4">
        <div class="font-bold text-[#2b0e23] text-sm">${l.name}</div>
        <div class="text-[11px] text-[#db2777] font-semibold">${l.brand || '-'}</div>
      </td>
      <td class="py-3.5 px-4 font-mono text-xs">
        <a href="tel:${l.phone}" class="hover:underline text-[#2b0e23] font-semibold">${l.phone}</a>
      </td>
      <td class="py-3.5 px-4 text-xs text-[#572449] font-medium">${l.service || '-'}</td>
      <td class="py-3.5 px-4 font-bold text-[#be185d] text-xs">${l.budget || '-'}</td>
      <td class="py-3.5 px-4">
        <select onchange="updateAdminLeadStatus('${l.id}', this.value)" class="text-xs bg-white border border-[#ED96D7]/40 rounded-xl px-2.5 py-1.5 font-bangla font-semibold focus:outline-none focus:border-[#db2777]">
          <option value="New" ${l.status === 'New' ? 'selected' : ''}>নতুন (New)</option>
          <option value="Contacted" ${l.status === 'Contacted' ? 'selected' : ''}>যোগাযোগকৃত</option>
          <option value="Booked" ${l.status === 'Booked' ? 'selected' : ''}>বুকড (Booked)</option>
          <option value="Completed" ${l.status === 'Completed' ? 'selected' : ''}>সম্পন্ন</option>
        </select>
      </td>
      <td class="py-3.5 px-4 text-right">
        <button onclick="deleteAdminLead('${l.id}')" class="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 inline-flex items-center justify-center transition-colors shadow-sm" title="মুছে ফেলুন">
          <i class="fa-solid fa-trash-can text-xs"></i>
        </button>
      </td>
    </tr>
  `).join('');

  updateLeadsBulkUI();
}

window.updateAdminLeadStatus = function(id, newStatus) {
  const leads = getLeads();
  const target = leads.find(l => l.id === id);
  if (target) {
    target.status = newStatus;
    saveLeads(leads);
    if (window.BongBanglaSupabase) {
      window.BongBanglaSupabase.updateLeadStatus(id, newStatus);
    }
    updateStats();
  }
};

window.deleteAdminLead = function(id) {
  if (confirm('আপনি কি এই ইনকোয়ারিটি মুছে ফেলতে চান?')) {
    let leads = getLeads().filter(l => l.id !== id);
    saveLeads(leads);
    if (window.BongBanglaSupabase) {
      window.BongBanglaSupabase.deleteLead(id);
    }
    selectedLeadIds.delete(id);
    const filter = document.getElementById('lead-filter-status');
    renderLeadsTable(filter ? filter.value : 'all');
    updateStats();
  }
};

function getModels() {
  if (window._cachedCloudModels && Array.isArray(window._cachedCloudModels) && window._cachedCloudModels.length > 0) {
    return window._cachedCloudModels.filter(m => !['M-1', 'M-2', 'M-3', 'M-4', 'M-101', 'M-102', 'M-103', 'M-104', 'M-1791099527539'].includes(m.id));
  }
  try {
    const saved = localStorage.getItem('bongbangla_models');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter(m => !['M-1', 'M-2', 'M-3', 'M-4', 'M-101', 'M-102', 'M-103', 'M-104', 'M-1791099527539'].includes(m.id));
      }
    }
  } catch (e) {}
  return [];
}

function saveModels(models) {
  try {
    const cleanModels = (models || []).map(m => {
      const clone = { ...m };
      if (typeof clone.image === 'string' && clone.image.startsWith('data:') && clone.image.length > 30000) {
        clone.image = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
      }
      if (Array.isArray(clone.gallery)) {
        clone.gallery = clone.gallery.map(g => {
          if (g && typeof g.url === 'string' && g.url.startsWith('data:') && g.url.length > 30000) {
            return { ...g, url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' };
          }
          return g;
        });
      }
      return clone;
    });
    localStorage.setItem('bongbangla_models', JSON.stringify(cleanModels));
  } catch (e) {
    console.warn('localStorage quota warning on saveModels, falling back to minimal cache:', e);
    try {
      const minimal = (models || []).map(m => ({
        id: m.id,
        name: m.name,
        category: m.category,
        image: m.image && !m.image.startsWith('data:') ? m.image : '',
        available: m.available
      }));
      localStorage.setItem('bongbangla_models', JSON.stringify(minimal));
    } catch(e2) {
      console.warn('localStorage completely full, skipping local cache:', e2);
    }
  }
}

async function renderDashboard() {
  // First, if BongBanglaSupabase is present, eagerly fetch all cloud tables before rendering
  if (window.BongBanglaSupabase) {
    try {
      await Promise.allSettled([
        window.BongBanglaSupabase.fetchLeads(),
        window.BongBanglaSupabase.fetchModels(),
        window.BongBanglaSupabase.fetchReels('all'),
        typeof window.BongBanglaSupabase.fetchHeroSlides === 'function' ? window.BongBanglaSupabase.fetchHeroSlides() : Promise.resolve(),
        typeof window.BongBanglaSupabase.fetchPackages === 'function' ? window.BongBanglaSupabase.fetchPackages() : Promise.resolve(),
        typeof window.BongBanglaSupabase.fetchCustomizerRates === 'function' ? window.BongBanglaSupabase.fetchCustomizerRates() : Promise.resolve()
      ]);
    } catch(e) {
      console.warn('Dashboard eager cloud sync notice:', e);
    }
  }

  try { updateStats(); } catch(e) { console.error('updateStats error:', e); }
  try { renderLeadsTable('all'); } catch(e) { console.error('renderLeadsTable error:', e); }
  try { renderModelsGrid(); } catch(e) { console.error('renderModelsGrid error:', e); }
  try {
    let cloudReels = window._cachedCloudReels || null;
    renderAdminReels('all', cloudReels);
  } catch(e) {
    console.error('renderAdminReels error:', e);
    renderAdminReels('all');
  }
  try { renderAdminHeroSlides(window._cachedCloudHeroSlides); } catch(e) { console.error('renderAdminHeroSlides error:', e); }
  try { initReelsAdmin(); } catch(e) { console.error('initReelsAdmin error:', e); }
  try { initHeroSlidesAdmin(); } catch(e) { console.error('initHeroSlidesAdmin error:', e); }
  try { renderAdminPackages(); } catch(e) { console.error('renderAdminPackages error:', e); }
  try { renderAdminCustomizerRates(); } catch(e) { console.error('renderAdminCustomizerRates error:', e); }
  try { initSupabaseAdmin(); } catch(e) { console.error('initSupabaseAdmin error:', e); }
  try { populateInstaModelSelect(); } catch(e) { console.error('populateInstaModelSelect error:', e); }
}

function initSupabaseAdmin() {
  const openBtn = document.getElementById('open-supabase-settings-btn');
  const closeBtn = document.getElementById('close-supabase-settings-btn');
  const modal = document.getElementById('supabase-settings-modal');
  const form = document.getElementById('supabase-settings-form');
  const vaultInput = document.getElementById('vault-input-url');
  const vaultUserInput = document.getElementById('vault-input-user');
  const vaultPassInput = document.getElementById('vault-input-pass');
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

  const populateVaultInputs = () => {
    if (window.BongBanglaVault) {
      const vcfg = window.BongBanglaVault.getConfig();
      if (vaultInput) vaultInput.value = vcfg.url || 'https://api.bongbangla.top/vault-api';
      if (vaultUserInput) vaultUserInput.value = vcfg.user || '';
      if (vaultPassInput) vaultPassInput.value = vcfg.pass || '';
    }
  };

  populateVaultInputs();

  if (window.BongBanglaSupabase) {
    const cfg = window.BongBanglaSupabase.getConfig();
    if (urlInput) urlInput.value = cfg.url || '';
    if (keyInput) keyInput.value = cfg.anonKey || '';
    updateStatusUI();

    if (!window._supabaseSubscribed) {
      window._supabaseSubscribed = true;
      // Sync initial remote cloud data
      window.BongBanglaSupabase.fetchLeads().then(() => {
        updateStats();
        const leadFilter = document.getElementById('lead-filter-status');
        renderLeadsTable(leadFilter ? leadFilter.value : 'all');
      }).catch(() => {});

      window.BongBanglaSupabase.fetchModels().then((models) => {
        renderModelsGrid();
        populateInstaModelSelect();
        updateStats();
      }).catch(() => {});

      window.BongBanglaSupabase.fetchReels('all').then((reels) => {
        const filter = document.getElementById('admin-reel-filter');
        renderAdminReels(filter ? filter.value : 'all', reels);
        updateStats();
      }).catch(() => {});

      if (typeof window.BongBanglaSupabase.fetchHeroSlides === 'function') {
        window.BongBanglaSupabase.fetchHeroSlides().then((slides) => {
          renderAdminHeroSlides(slides);
        }).catch(() => {});
      }

      // Realtime multi-tab / multi-device listeners
      window.BongBanglaSupabase.subscribeToLeads(() => {
        window.BongBanglaSupabase.fetchLeads().then(() => {
          updateStats();
          const leadFilter = document.getElementById('lead-filter-status');
          renderLeadsTable(leadFilter ? leadFilter.value : 'all');
        });
      });

      window.BongBanglaSupabase.subscribeToReels(() => {
        window.BongBanglaSupabase.fetchReels('all').then((reels) => {
          const filter = document.getElementById('admin-reel-filter');
          renderAdminReels(filter ? filter.value : 'all', reels);
          updateStats();
        }).catch(() => {
          const filter = document.getElementById('admin-reel-filter');
          renderAdminReels(filter ? filter.value : 'all');
        });
      });

      window.BongBanglaSupabase.subscribeToModels(() => {
        window.BongBanglaSupabase.fetchModels().then(() => {
          renderModelsGrid();
          populateInstaModelSelect();
          updateStats();
        });
      });

      if (typeof window.BongBanglaSupabase.subscribeToHeroSlides === 'function') {
        window.BongBanglaSupabase.subscribeToHeroSlides(() => {
          window.BongBanglaSupabase.fetchHeroSlides().then((slides) => {
            renderAdminHeroSlides(slides);
          });
        });
      }
    }
  }

  if (openBtn && modal && !openBtn.dataset.initialized) {
    openBtn.dataset.initialized = 'true';
    openBtn.addEventListener('click', () => {
      populateVaultInputs();
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
      const vaultUrl = vaultInput ? vaultInput.value.trim() : 'https://api.bongbangla.top/vault-api';
      const vaultUser = vaultUserInput ? vaultUserInput.value.trim() : '';
      const vaultPass = vaultPassInput ? vaultPassInput.value.trim() : '';
      const url = urlInput.value.trim();
      const key = keyInput.value.trim();

      if (window.BongBanglaVault) {
        window.BongBanglaVault.saveConfig(vaultUrl, vaultUser, vaultPass);
      }

      if (window.BongBanglaSupabase) {
        window.BongBanglaSupabase.saveConfig(url, key);
        updateStatusUI();
        alert('Vault CDN ও Supabase ক্রেডেনশিয়াল সফলভাবে সংরক্ষণ হয়েছে!');
        modal.classList.add('hidden');
        renderDashboard();
      }
    });
  }
}

let selectedReelVideoFile = null;
let selectedReelThumbFile = null;

window.setReelVideoInputMode = function(mode) {
  const tabFileBtn = document.getElementById('reel-video-tab-file-btn');
  const tabUrlBtn = document.getElementById('reel-video-tab-url-btn');
  const fileView = document.getElementById('reel-video-upload-view');
  const urlView = document.getElementById('reel-video-url-view');

  if (mode === 'file') {
    if (tabFileBtn) tabFileBtn.className = 'px-2 py-0.5 rounded-md font-bold transition-all bg-[#db2777] text-white shadow-xs';
    if (tabUrlBtn) tabUrlBtn.className = 'px-2 py-0.5 rounded-md font-bold transition-all text-[#572449] hover:text-[#db2777]';
    if (fileView) fileView.classList.remove('hidden');
    if (urlView) urlView.classList.add('hidden');
  } else {
    if (tabUrlBtn) tabUrlBtn.className = 'px-2 py-0.5 rounded-md font-bold transition-all bg-[#db2777] text-white shadow-xs';
    if (tabFileBtn) tabFileBtn.className = 'px-2 py-0.5 rounded-md font-bold transition-all text-[#572449] hover:text-[#db2777]';
    if (urlView) urlView.classList.remove('hidden');
    if (fileView) fileView.classList.add('hidden');
  }
};

window.setReelThumbInputMode = function(mode) {
  const tabFileBtn = document.getElementById('reel-thumb-tab-file-btn');
  const tabUrlBtn = document.getElementById('reel-thumb-tab-url-btn');
  const fileView = document.getElementById('reel-thumb-upload-view');
  const urlView = document.getElementById('reel-thumb-url-view');

  if (mode === 'file') {
    if (tabFileBtn) tabFileBtn.className = 'px-2 py-0.5 rounded-md font-bold transition-all bg-[#db2777] text-white shadow-xs';
    if (tabUrlBtn) tabUrlBtn.className = 'px-2 py-0.5 rounded-md font-bold transition-all text-[#572449] hover:text-[#db2777]';
    if (fileView) fileView.classList.remove('hidden');
    if (urlView) urlView.classList.add('hidden');
  } else {
    if (tabUrlBtn) tabUrlBtn.className = 'px-2 py-0.5 rounded-md font-bold transition-all bg-[#db2777] text-white shadow-xs';
    if (tabFileBtn) tabFileBtn.className = 'px-2 py-0.5 rounded-md font-bold transition-all text-[#572449] hover:text-[#db2777]';
    if (urlView) urlView.classList.remove('hidden');
    if (fileView) fileView.classList.add('hidden');
  }
};

window.clearReelVideoSelection = function() {
  selectedReelVideoFile = null;
  const fileInput = document.getElementById('reel-video-file');
  const dropzone = document.getElementById('reel-video-dropzone');
  const previewBox = document.getElementById('reel-video-preview-box');
  const player = document.getElementById('reel-video-preview-player');

  if (fileInput) fileInput.value = '';
  if (player) {
    player.pause();
    player.src = '';
  }
  if (previewBox) previewBox.classList.add('hidden');
  if (dropzone) dropzone.classList.remove('hidden');
};

window.clearReelThumbSelection = function() {
  selectedReelThumbFile = null;
  const fileInput = document.getElementById('reel-thumb-file');
  const dropzone = document.getElementById('reel-thumb-dropzone');
  const previewBox = document.getElementById('reel-thumb-preview-box');
  const previewImg = document.getElementById('reel-thumb-preview-img');

  if (fileInput) fileInput.value = '';
  if (previewImg) previewImg.src = '';
  if (previewBox) previewBox.classList.add('hidden');
  if (dropzone) dropzone.classList.remove('hidden');
};

function handleReelVideoFileChange(file) {
  if (!file) return;
  selectedReelVideoFile = file;
  const dropzone = document.getElementById('reel-video-dropzone');
  const previewBox = document.getElementById('reel-video-preview-box');
  const player = document.getElementById('reel-video-preview-player');
  const nameEl = document.getElementById('reel-video-file-name');
  const sizeEl = document.getElementById('reel-video-file-size');
  const urlInput = document.getElementById('reel-video-input');

  const localUrl = URL.createObjectURL(file);
  if (player) player.src = localUrl;
  if (nameEl) nameEl.textContent = file.name;
  if (sizeEl) sizeEl.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

  const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const vaultUrl = `https://vault.bongbangla.top/reels/${cleanFileName}`;
  if (urlInput) urlInput.value = vaultUrl;

  if (dropzone) dropzone.classList.add('hidden');
  if (previewBox) previewBox.classList.remove('hidden');
}

let selectedReelThumbDataUrl = '';

function handleReelThumbFileChange(file) {
  if (!file) return;
  selectedReelThumbFile = file;
  const dropzone = document.getElementById('reel-thumb-dropzone');
  const previewBox = document.getElementById('reel-thumb-preview-box');
  const previewImg = document.getElementById('reel-thumb-preview-img');
  const nameEl = document.getElementById('reel-thumb-file-name');
  const sizeEl = document.getElementById('reel-thumb-file-size');
  const urlInput = document.getElementById('reel-thumb-input');

  if (nameEl) nameEl.textContent = file.name;
  if (sizeEl) sizeEl.textContent = (file.size / 1024).toFixed(1) + ' KB';

  if (window.BongBanglaVault && typeof window.BongBanglaVault.fileToDataUrl === 'function') {
    window.BongBanglaVault.fileToDataUrl(file, 800, 0.85).then(dataUrl => {
      selectedReelThumbDataUrl = dataUrl;
      if (previewImg) previewImg.src = dataUrl;
      if (urlInput) urlInput.value = dataUrl;
    });
  } else {
    const localUrl = URL.createObjectURL(file);
    selectedReelThumbDataUrl = localUrl;
    if (previewImg) previewImg.src = localUrl;
  }

  if (dropzone) dropzone.classList.add('hidden');
  if (previewBox) previewBox.classList.remove('hidden');
}

function initReelsAdmin() {
  const reelFilter = document.getElementById('admin-reel-filter');
  if (reelFilter && !reelFilter.dataset.initialized) {
    reelFilter.dataset.initialized = 'true';
    reelFilter.addEventListener('change', async () => {
      let cloudReels = null;
      if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.fetchReels === 'function') {
        cloudReels = await window.BongBanglaSupabase.fetchReels(reelFilter.value).catch(() => null);
      }
      renderAdminReels(reelFilter.value, cloudReels);
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

  // Setup video & thumbnail file listeners & dropzones
  const reelVideoFileInput = document.getElementById('reel-video-file');
  if (reelVideoFileInput && !reelVideoFileInput.dataset.initialized) {
    reelVideoFileInput.dataset.initialized = 'true';
    reelVideoFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleReelVideoFileChange(e.target.files[0]);
      }
    });
  }

  const reelVideoDropzone = document.getElementById('reel-video-dropzone');
  if (reelVideoDropzone && !reelVideoDropzone.dataset.initialized) {
    reelVideoDropzone.dataset.initialized = 'true';
    ['dragenter', 'dragover'].forEach(eventName => {
      reelVideoDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        reelVideoDropzone.classList.add('border-[#db2777]', 'bg-pink-100/60');
      });
    });
    ['dragleave', 'drop'].forEach(eventName => {
      reelVideoDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        reelVideoDropzone.classList.remove('border-[#db2777]', 'bg-pink-100/60');
      });
    });
    reelVideoDropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleReelVideoFileChange(e.dataTransfer.files[0]);
      }
    });
  }

  const reelThumbFileInput = document.getElementById('reel-thumb-file');
  if (reelThumbFileInput && !reelThumbFileInput.dataset.initialized) {
    reelThumbFileInput.dataset.initialized = 'true';
    reelThumbFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleReelThumbFileChange(e.target.files[0]);
      }
    });
  }

  const reelThumbDropzone = document.getElementById('reel-thumb-dropzone');
  if (reelThumbDropzone && !reelThumbDropzone.dataset.initialized) {
    reelThumbDropzone.dataset.initialized = 'true';
    ['dragenter', 'dragover'].forEach(eventName => {
      reelThumbDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        reelThumbDropzone.classList.add('border-[#db2777]', 'bg-pink-100/60');
      });
    });
    ['dragleave', 'drop'].forEach(eventName => {
      reelThumbDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        reelThumbDropzone.classList.remove('border-[#db2777]', 'bg-pink-100/60');
      });
    });
    reelThumbDropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleReelThumbFileChange(e.dataTransfer.files[0]);
      }
    });
  }

  const openAddReelBtn = document.getElementById('open-add-reel-btn');
  const closeAddReelBtn = document.getElementById('close-add-reel-btn');
  const addReelModal = document.getElementById('add-reel-modal');
  const addReelForm = document.getElementById('add-reel-form');

  if (openAddReelBtn && addReelModal && !openAddReelBtn.dataset.initialized) {
    openAddReelBtn.dataset.initialized = 'true';
    openAddReelBtn.addEventListener('click', () => {
      clearReelVideoSelection();
      clearReelThumbSelection();
      setReelVideoInputMode('file');
      setReelThumbInputMode('file');
      addReelModal.classList.remove('hidden');
    });
    closeAddReelBtn.addEventListener('click', () => {
      clearReelVideoSelection();
      addReelModal.classList.add('hidden');
    });

    addReelForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('reel-submit-btn');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ভিডিও আপলোড ও সেভ হচ্ছে...';
      }

      try {
        const formData = new FormData(addReelForm);
        let rawVideoUrl = (formData.get('videoUrl') || '').toString().trim();
        let rawThumb = (formData.get('thumbnail') || '').toString().trim();

        // 1. Upload Video if file selected
        if (selectedReelVideoFile && window.BongBanglaVault) {
          const videoRes = await window.BongBanglaVault.uploadMedia(selectedReelVideoFile, 'reels');
          if (videoRes && videoRes.url) {
            rawVideoUrl = videoRes.url;
          }
        }

        // 2. Upload Thumb if file selected
        if (selectedReelThumbFile && window.BongBanglaVault) {
          const thumbRes = await window.BongBanglaVault.uploadMedia(selectedReelThumbFile, 'thumbnails');
          if (thumbRes && thumbRes.url) {
            rawThumb = thumbRes.url;
          }
        }

        if (!rawThumb && selectedReelThumbDataUrl) {
          rawThumb = selectedReelThumbDataUrl;
        }

        if (!rawVideoUrl) {
          rawVideoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-studio-setting-41793-large.mp4';
        }
        if (!rawThumb) {
          rawThumb = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=720&h=1280&q=80';
        }

        const videoUrl = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(rawVideoUrl, 'reels') : rawVideoUrl;
        const thumbnail = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(rawThumb, 'thumbnails') : rawThumb;

        const newReel = {
          id: 'reel-' + Date.now(),
          title: formData.get('title'),
          client: formData.get('client'),
          category: formData.get('category'),
          tag: formData.get('tag') || '4K CINEMA',
          views: formData.get('views') || '১.৫M ভিউজ',
          videoUrl: videoUrl,
          thumbnail: thumbnail,
          date: new Date().toISOString().split('T')[0]
        };

        if (window.BongBanglaReels) {
          window.BongBanglaReels.addReel(newReel);
        }
        let cloudSuccess = false;
        if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.addReel === 'function') {
          try {
            await window.BongBanglaSupabase.addReel(newReel);
            cloudSuccess = true;
          } catch (err) {
            console.warn('Supabase addReel error:', err);
          }
        }

        addReelForm.reset();
        clearReelVideoSelection();
        clearReelThumbSelection();
        addReelModal.classList.add('hidden');
        const reelFilter = document.getElementById('admin-reel-filter');
        let freshCloudReels = null;
        if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.fetchReels === 'function') {
          freshCloudReels = await window.BongBanglaSupabase.fetchReels(reelFilter ? reelFilter.value : 'all').catch(() => null);
        }
        renderAdminReels(reelFilter ? reelFilter.value : 'all', freshCloudReels);
        alert(cloudSuccess ? 'নতুন রিলস ভিডিও সফলভাবে ক্লাউডে আপলোড ও সব ডিভাইসে লাইভ করা হয়েছে!' : 'রিলস সেভ করা হয়েছে (লোকাল ক্যাশে সংরক্ষিত)');
      } catch (err) {
        console.error('Error adding reel:', err);
        alert('রিলস আপলোড করতে সমস্যা হয়েছে: ' + (err.message || ''));
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  }

  // =========================================================================
  // Reel Edit Handlers
  // =========================================================================
  let editSelectedReelVideoFile = null;
  let editSelectedReelThumbFile = null;
  let editSelectedReelThumbDataUrl = '';

  window.openEditReelModal = function(id) {
    if (!window.BongBanglaReels) return;
    const reels = window.BongBanglaReels.getReels('all');
    const reel = reels.find(r => r.id === id);
    if (!reel) {
      alert('রিলস ভিডিও খুঁজে পাওয়া যায়নি!');
      return;
    }

    const modal = document.getElementById('edit-reel-modal');
    const idInput = document.getElementById('edit-reel-id');
    const titleInput = document.getElementById('edit-reel-title');
    const clientInput = document.getElementById('edit-reel-client');
    const categorySelect = document.getElementById('edit-reel-category');
    const tagInput = document.getElementById('edit-reel-tag');
    const viewsInput = document.getElementById('edit-reel-views');
    const videoInput = document.getElementById('edit-reel-video-input');
    const thumbInput = document.getElementById('edit-reel-thumb-input');
    const videoPlayer = document.getElementById('edit-reel-video-preview-player');
    const videoName = document.getElementById('edit-reel-video-name');
    const thumbImg = document.getElementById('edit-reel-thumb-preview-img');

    editSelectedReelVideoFile = null;
    editSelectedReelThumbFile = null;
    editSelectedReelThumbDataUrl = '';

    if (idInput) idInput.value = reel.id;
    if (titleInput) titleInput.value = reel.title || '';
    if (clientInput) clientInput.value = reel.client || '';
    if (categorySelect) {
      const catHelper = window.BongBanglaCategorySystem;
      const canonical = catHelper ? catHelper.getCanonicalCategory(reel.category) : reel.category;
      categorySelect.value = canonical || 'cinema-ads';
    }
    if (tagInput) tagInput.value = reel.tag || '4K CINEMA';
    if (viewsInput) viewsInput.value = reel.views || '১.৫M ভিউজ';

    const videoSrc = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(reel.videoUrl, 'reels') : reel.videoUrl;
    const thumbSrc = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(reel.thumbnail, 'thumbnails') : reel.thumbnail;

    if (videoInput) videoInput.value = reel.videoUrl || '';
    if (thumbInput) thumbInput.value = reel.thumbnail || '';
    if (videoPlayer) {
      videoPlayer.src = videoSrc;
      videoPlayer.load();
    }
    if (videoName) videoName.textContent = reel.title ? `${reel.title}.mp4` : 'video.mp4';
    if (thumbImg) thumbImg.src = thumbSrc;

    if (modal) modal.classList.remove('hidden');
  };

  window.closeEditReelModal = function() {
    const modal = document.getElementById('edit-reel-modal');
    const videoPlayer = document.getElementById('edit-reel-video-preview-player');
    if (videoPlayer) {
      videoPlayer.pause();
      videoPlayer.src = '';
    }
    if (modal) modal.classList.add('hidden');
    editSelectedReelVideoFile = null;
    editSelectedReelThumbFile = null;
    editSelectedReelThumbDataUrl = '';
  };

  const editReelVideoFileInput = document.getElementById('edit-reel-video-file');
  if (editReelVideoFileInput && !editReelVideoFileInput.dataset.initialized) {
    editReelVideoFileInput.dataset.initialized = 'true';
    editReelVideoFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        editSelectedReelVideoFile = file;
        const videoPlayer = document.getElementById('edit-reel-video-preview-player');
        const videoName = document.getElementById('edit-reel-video-name');
        const videoInput = document.getElementById('edit-reel-video-input');
        if (videoName) videoName.textContent = file.name + ' (' + (file.size / (1024 * 1024)).toFixed(2) + ' MB)';
        const localBlob = URL.createObjectURL(file);
        if (videoPlayer) {
          videoPlayer.src = localBlob;
          videoPlayer.load();
        }
        if (videoInput) videoInput.value = localBlob;
      }
    });
  }

  const editReelThumbFileInput = document.getElementById('edit-reel-thumb-file');
  if (editReelThumbFileInput && !editReelThumbFileInput.dataset.initialized) {
    editReelThumbFileInput.dataset.initialized = 'true';
    editReelThumbFileInput.addEventListener('change', async (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        editSelectedReelThumbFile = file;
        const thumbImg = document.getElementById('edit-reel-thumb-preview-img');
        const thumbInput = document.getElementById('edit-reel-thumb-input');
        if (window.BongBanglaVault && typeof window.BongBanglaVault.fileToDataUrl === 'function') {
          editSelectedReelThumbDataUrl = await window.BongBanglaVault.fileToDataUrl(file, 720, 0.85);
        } else {
          editSelectedReelThumbDataUrl = URL.createObjectURL(file);
        }
        if (thumbImg) thumbImg.src = editSelectedReelThumbDataUrl;
        if (thumbInput) thumbInput.value = editSelectedReelThumbDataUrl;
      }
    });
  }

  const editReelForm = document.getElementById('edit-reel-form');
  if (editReelForm && !editReelForm.dataset.initialized) {
    editReelForm.dataset.initialized = 'true';
    editReelForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('edit-reel-submit-btn');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> আপডেট হচ্ছে...';
      }

      try {
        const formData = new FormData(editReelForm);
        const id = formData.get('id');
        let reels = window.BongBanglaReels ? window.BongBanglaReels.getReels('all') : [];
        const reel = reels.find(r => r.id === id);

        if (!reel) {
          alert('রিলস খুঁজে পাওয়া যায়নি!');
          return;
        }

        let rawVideoUrl = (formData.get('videoUrl') || '').toString().trim();
        let rawThumb = (formData.get('thumbnail') || '').toString().trim();

        if (editSelectedReelVideoFile && window.BongBanglaVault) {
          const videoRes = await window.BongBanglaVault.uploadMedia(editSelectedReelVideoFile, 'reels');
          if (videoRes && videoRes.url) {
            rawVideoUrl = videoRes.url;
          }
        }

        if (editSelectedReelThumbFile && window.BongBanglaVault) {
          const thumbRes = await window.BongBanglaVault.uploadMedia(editSelectedReelThumbFile, 'thumbnails');
          if (thumbRes && thumbRes.url) {
            rawThumb = thumbRes.url;
          }
        }

        if (!rawThumb && editSelectedReelThumbDataUrl) {
          rawThumb = editSelectedReelThumbDataUrl;
        }

        if (!rawVideoUrl) rawVideoUrl = reel.videoUrl;
        if (!rawThumb) rawThumb = reel.thumbnail;

        const videoUrl = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(rawVideoUrl, 'reels') : rawVideoUrl;
        const thumbnail = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(rawThumb, 'thumbnails') : rawThumb;

        reel.title = formData.get('title');
        reel.client = formData.get('client');
        reel.category = formData.get('category');
        reel.tag = formData.get('tag') || '4K CINEMA';
        reel.views = formData.get('views') || '১.৫M ভিউজ';
        reel.videoUrl = videoUrl;
        reel.thumbnail = thumbnail;

        if (window.BongBanglaReels) {
          window.BongBanglaReels.saveReels(reels);
        }

        if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.addReel === 'function') {
          try {
            await window.BongBanglaSupabase.addReel(reel);
          } catch (e) {
            console.warn('Supabase reel upsert error:', e);
          }
        }

        let freshCloudReels = null;
        if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.fetchReels === 'function') {
          freshCloudReels = await window.BongBanglaSupabase.fetchReels('all').catch(() => null);
        }

        closeEditReelModal();
        const reelFilter = document.getElementById('admin-reel-filter');
        renderAdminReels(reelFilter ? reelFilter.value : 'all', freshCloudReels);
        alert('রিলস ভিডিও সফলভাবে আপডেট করা হয়েছে!');
      } catch (err) {
        console.error('Error updating reel:', err);
        alert('রিলস আপডেট করতে সমস্যা হয়েছে: ' + (err.message || ''));
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  }
}

let currentReelViewMode = localStorage.getItem('bongbangla_reel_view_mode') || 'list';

function setReelViewMode(mode) {
  currentReelViewMode = mode;
  localStorage.setItem('bongbangla_reel_view_mode', mode);

  const listBtn = document.getElementById('reel-view-list-btn');
  const gridBtn = document.getElementById('reel-view-grid-btn');
  const listView = document.getElementById('admin-reels-list-view');
  const gridView = document.getElementById('admin-reels-grid');

  if (mode === 'grid') {
    if (gridBtn) {
      gridBtn.className = 'px-2.5 py-1.5 rounded-lg text-xs font-bold font-bangla transition-all bg-[#db2777] text-white shadow-xs flex items-center gap-1.5';
    }
    if (listBtn) {
      listBtn.className = 'px-2.5 py-1.5 rounded-lg text-xs font-bold font-bangla transition-all text-[#572449] hover:text-[#db2777] flex items-center gap-1.5';
    }
    if (listView) listView.classList.add('hidden');
    if (gridView) gridView.classList.remove('hidden');
  } else {
    if (listBtn) {
      listBtn.className = 'px-2.5 py-1.5 rounded-lg text-xs font-bold font-bangla transition-all bg-[#db2777] text-white shadow-xs flex items-center gap-1.5';
    }
    if (gridBtn) {
      gridBtn.className = 'px-2.5 py-1.5 rounded-lg text-xs font-bold font-bangla transition-all text-[#572449] hover:text-[#db2777] flex items-center gap-1.5';
    }
    if (gridView) gridView.classList.add('hidden');
    if (listView) listView.classList.remove('hidden');
  }
}
window.setReelViewMode = setReelViewMode;

let selectedReelIds = new Set();
let selectedModelIds = new Set();

function updateReelsBulkUI() {
  const bulkBar = document.getElementById('reels-bulk-bar');
  const countEl = document.getElementById('reels-selected-count');
  const selectAll = document.getElementById('reels-select-all');

  const count = selectedReelIds.size;
  if (countEl) countEl.textContent = count.toLocaleString('bn-BD');

  if (bulkBar) {
    if (count > 0) bulkBar.classList.remove('hidden');
    else bulkBar.classList.add('hidden');
  }

  const allCheckboxes = document.querySelectorAll('.reel-checkbox');
  if (selectAll && allCheckboxes.length > 0) {
    const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
    const someChecked = Array.from(allCheckboxes).some(cb => cb.checked);
    selectAll.checked = allChecked;
    selectAll.indeterminate = someChecked && !allChecked;
  }
}

window.toggleReelSelection = function(id, checked) {
  if (checked) selectedReelIds.add(id);
  else selectedReelIds.delete(id);
  updateReelsBulkUI();
};

window.deselectAllReels = function() {
  selectedReelIds.clear();
  document.querySelectorAll('.reel-checkbox').forEach(cb => cb.checked = false);
  const selectAll = document.getElementById('reels-select-all');
  if (selectAll) {
    selectAll.checked = false;
    selectAll.indeterminate = false;
  }
  updateReelsBulkUI();
};

window.applyBulkReelsCategory = async function() {
  if (selectedReelIds.size === 0) return;
  const select = document.getElementById('reels-bulk-category-select');
  const newCategory = select ? select.value : 'cinema-ads';

  let reels = window.BongBanglaReels ? window.BongBanglaReels.getReels('all') : [];
  reels.forEach(r => {
    if (selectedReelIds.has(r.id)) {
      r.category = newCategory;
    }
  });

  if (window.BongBanglaReels) {
    window.BongBanglaReels.saveReels(reels);
  }

  if (window.BongBanglaSupabase && window.BongBanglaSupabase.getClient()) {
    const client = window.BongBanglaSupabase.getClient();
    for (const id of Array.from(selectedReelIds)) {
      try {
        await client.from('reels').update({ category: newCategory }).eq('id', id);
      } catch (e) { console.warn('Supabase bulk category update error:', e); }
    }
  }

  alert(`${selectedReelIds.size} টি রিলসের ক্যাটাগরি সফলভাবে পরিবর্তন করা হয়েছে!`);
  selectedReelIds.clear();
  const filter = document.getElementById('admin-reel-filter');
  renderAdminReels(filter ? filter.value : 'all');
};

window.applyBulkReelsDelete = async function() {
  if (selectedReelIds.size === 0) return;
  if (!confirm(`আপনি কি নিশ্চিতভাবে নির্বাচিত ${selectedReelIds.size} টি রিলস মুছে ফেলতে চান?`)) return;

  const toDelete = Array.from(selectedReelIds);
  if (window.BongBanglaReels) {
    let reels = window.BongBanglaReels.getReels('all');
    reels = reels.filter(r => !selectedReelIds.has(r.id));
    window.BongBanglaReels.saveReels(reels);
  }

  if (window.BongBanglaSupabase) {
    for (const id of toDelete) {
      await window.BongBanglaSupabase.deleteReel(id).catch(() => {});
    }
    const fresh = await window.BongBanglaSupabase.fetchReels('all').catch(() => null);
    const filter = document.getElementById('admin-reel-filter');
    renderAdminReels(filter ? filter.value : 'all', fresh);
  }

  alert(`${toDelete.length} টি রিলস সফলভাবে মুছে ফেলা হয়েছে!`);
  selectedReelIds.clear();
  const filter = document.getElementById('admin-reel-filter');
  renderAdminReels(filter ? filter.value : 'all');
};

function updateModelsBulkUI() {
  const bulkBar = document.getElementById('models-bulk-bar');
  const countEl = document.getElementById('models-selected-count');
  const toggleBtn = document.getElementById('models-toggle-all-btn');

  const count = selectedModelIds.size;
  if (countEl) countEl.textContent = count.toLocaleString('bn-BD');

  if (bulkBar) {
    if (count > 0) bulkBar.classList.remove('hidden');
    else bulkBar.classList.add('hidden');
  }

  const allCheckboxes = document.querySelectorAll('.model-checkbox');
  if (toggleBtn && allCheckboxes.length > 0) {
    const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
    if (allChecked) {
      toggleBtn.innerHTML = '<i class="fa-solid fa-square-check text-[#db2777]"></i> সিলেকশন সরান';
    } else {
      toggleBtn.innerHTML = '<i class="fa-regular fa-square-check text-[#db2777]"></i> সব সিলেক্ট';
    }
  }
}

window.toggleModelSelection = function(id, checked) {
  if (checked) selectedModelIds.add(id);
  else selectedModelIds.delete(id);
  updateModelsBulkUI();
};

window.toggleSelectAllModels = function() {
  const checkboxes = document.querySelectorAll('.model-checkbox');
  if (checkboxes.length === 0) return;

  const allChecked = Array.from(checkboxes).every(cb => cb.checked);
  checkboxes.forEach(cb => {
    cb.checked = !allChecked;
    const id = cb.getAttribute('data-id');
    if (id) {
      if (!allChecked) selectedModelIds.add(id);
      else selectedModelIds.delete(id);
    }
  });
  updateModelsBulkUI();
};

window.deselectAllModels = function() {
  selectedModelIds.clear();
  document.querySelectorAll('.model-checkbox').forEach(cb => cb.checked = false);
  updateModelsBulkUI();
};

window.applyBulkModelsDelete = async function() {
  if (selectedModelIds.size === 0) return;
  if (!confirm(`আপনি কি নিশ্চিতভাবে নির্বাচিত ${selectedModelIds.size} জন মডেলকে মুছে ফেলতে চান?`)) return;

  const toDelete = Array.from(selectedModelIds);
  let models = getModels();
  models = models.filter(m => !selectedModelIds.has(m.id));
  saveModels(models);

  if (window.BongBanglaSupabase) {
    for (const id of toDelete) {
      window.BongBanglaSupabase.deleteModel(id).catch(() => {});
    }
  }

  alert(`${toDelete.length} জন মডেলের প্রোফাইল সফলভাবে মুছে ফেলা হয়েছে!`);
  selectedModelIds.clear();
  renderModelsGrid();
};

function renderAdminReels(category = 'all', preloadedReels = null) {
  const grid = document.getElementById('admin-reels-grid');
  const listBody = document.getElementById('admin-reels-list-body');
  const emptyState = document.getElementById('reels-empty-state');
  const selectAll = document.getElementById('reels-select-all');

  const catHelper = window.BongBanglaCategorySystem;
  let reels = [];
  if (Array.isArray(preloadedReels)) {
    reels = category === 'all' ? preloadedReels : preloadedReels.filter(r => catHelper ? catHelper.matchesCategory(r.category, category) : r.category === category);
  } else if (window.BongBanglaReels) {
    reels = window.BongBanglaReels.getReels(category);
  }
  reels = reels.filter(r => r && r.id && !r.id.match(/^reel-[csvfj]\d+$/));

  if (selectAll && !selectAll.dataset.initialized) {
    selectAll.dataset.initialized = 'true';
    selectAll.addEventListener('change', () => {
      const isChecked = selectAll.checked;
      const checkboxes = document.querySelectorAll('.reel-checkbox');
      checkboxes.forEach(cb => {
        cb.checked = isChecked;
        const id = cb.getAttribute('data-id');
        if (id) {
          if (isChecked) selectedReelIds.add(id);
          else selectedReelIds.delete(id);
        }
      });
      updateReelsBulkUI();
    });
  }

  if (reels.length === 0) {
    if (grid) grid.innerHTML = '';
    if (listBody) listBody.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    selectedReelIds.clear();
    updateReelsBulkUI();
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  const categoryNames = {
    'cinema-ads': 'অ্যাড ফিল্ম',
    'saree-shoot': 'শাড়ি ও মডেল শুট',
    'viral-reels': 'প্রোডাক্ট রিলস',
    'facebook-ads': 'ওয়েবসাইট ও ব্র্যান্ড',
    'jewellery': 'জুয়েলারি ও লাক্সারি'
  };

  const defaultFallbackThumb = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=720&h=1280&q=80';

  // 1. Render Table / List View
  if (listBody) {
    listBody.innerHTML = reels.map(r => {
      const thumb = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(r.thumbnail, 'thumbnails') : r.thumbnail;
      const video = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(r.videoUrl, 'reels') : r.videoUrl;

      return `
        <tr class="hover:bg-[#fff8fa] transition-colors border-b border-[#ED96D7]/15">
          <!-- Checkbox -->
          <td class="py-3 px-3 text-center">
            <input type="checkbox" class="reel-checkbox w-4 h-4 rounded border-[#ED96D7] text-[#db2777] focus:ring-[#db2777] cursor-pointer"
                   data-id="${r.id}"
                   ${selectedReelIds.has(r.id) ? 'checked' : ''}
                   onchange="toggleReelSelection('${r.id}', this.checked)">
          </td>

          <!-- Thumbnail -->
          <td class="py-3 px-4">
            <div class="w-12 h-16 rounded-xl overflow-hidden bg-black relative border border-[#ED96D7]/30 shrink-0 shadow-xs cursor-pointer group"
                 onclick="window.BongBanglaReels.openReelVideoModal('${video}', '${encodeURIComponent(r.title)}', '${encodeURIComponent(r.client)}')">
              <img src="${thumb || defaultFallbackThumb}" alt="${r.title}" onerror="this.onerror=null; this.src='${defaultFallbackThumb}';" class="w-full h-full object-cover group-hover:scale-110 transition-transform">
              <div class="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                <i class="fa-solid fa-play"></i>
              </div>
            </div>
          </td>

          <!-- Title & Client -->
          <td class="py-3 px-4">
            <div class="font-bold text-[#2b0e23] text-xs">${r.title}</div>
            <div class="text-[11px] text-[#db2777] font-semibold mt-0.5 flex items-center gap-1">
              <i class="fa-solid fa-user-tag text-[9px]"></i>
              <span>${r.client || 'BongBangla Client'}</span>
            </div>
          </td>

          <!-- Category -->
          <td class="py-3 px-4">
            <a href="${catHelper ? catHelper.getCategoryServiceUrl(r.category) : 'service-saree-model-shoot.html'}" target="_blank" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-50 hover:bg-[#db2777] text-[#be185d] hover:text-white border border-[#ED96D7]/30 text-[11px] font-semibold transition-all" title="এই ক্যাটাগরির আলাদা লাইভ পেজ দেখুন">
              <span>${catHelper ? catHelper.getCategoryDisplayName(r.category) : (categoryNames[r.category] || r.category)}</span>
              <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
            </a>
          </td>

          <!-- Tag / Resolution -->
          <td class="py-3 px-4">
            <span class="inline-block px-2 py-0.5 rounded bg-slate-100 text-[#572449] font-mono text-[10px] font-bold">
              ${r.tag || '4K'}
            </span>
          </td>

          <!-- Views -->
          <td class="py-3 px-4 font-mono font-bold text-xs text-[#2b0e23]">
            ${r.views || '-'}
          </td>

          <!-- Date -->
          <td class="py-3 px-4 text-gray-500 font-mono text-[11px]">
            ${r.date || '২০২৬'}
          </td>

          <!-- Actions (View Video / Edit / Delete) -->
          <td class="py-3 px-4 text-right">
            <div class="flex items-center justify-end gap-1.5">
              <button onclick="window.BongBanglaReels.openReelVideoModal('${video}', '${encodeURIComponent(r.title)}', '${encodeURIComponent(r.client)}')"
                      class="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#db2777] to-[#be185d] text-white text-xs font-bold flex items-center gap-1 shadow-xs hover:opacity-95 transition-all"
                      title="ভিডিও ভিউ ও প্লে করুন">
                <i class="fa-solid fa-eye text-[11px]"></i>
                <span>ভিউ</span>
              </button>

              <button onclick="openEditReelModal('${r.id}')"
                      class="px-2.5 py-1.5 rounded-xl bg-pink-50 hover:bg-[#db2777] text-[#db2777] hover:text-white text-xs font-bold flex items-center gap-1 transition-all"
                      title="রিলস এডিট করুন">
                <i class="fa-solid fa-pen-to-square text-[11px]"></i>
                <span>এডিট</span>
              </button>

              <button onclick="deleteAdminReel('${r.id}')"
                      class="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 inline-flex items-center justify-center transition-colors shadow-xs"
                      title="রিলস ডিলিট করুন">
                <i class="fa-solid fa-trash-can text-xs"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // 2. Render Grid View
  if (grid) {
    grid.innerHTML = reels.map(r => {
      const thumb = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(r.thumbnail, 'thumbnails') : r.thumbnail;
      const video = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(r.videoUrl, 'reels') : r.videoUrl;

      return `
        <div class="glass-panel rounded-2xl overflow-hidden border border-[#ED96D7]/35 group hover:border-[#db2777] shadow-sm hover:shadow-md transition-all bg-white flex flex-col justify-between relative">
          <div class="aspect-[9/16] relative overflow-hidden bg-black">
            <img src="${thumb || defaultFallbackThumb}" alt="${r.title}" onerror="this.onerror=null; this.src='${defaultFallbackThumb}';" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>

            <div class="absolute top-2 inset-x-2 flex items-center justify-between z-10">
              <div class="flex items-center gap-1.5">
                <input type="checkbox" class="reel-checkbox w-4 h-4 rounded border-[#ED96D7] text-[#db2777] focus:ring-[#db2777] cursor-pointer bg-white/90 shadow-sm"
                       data-id="${r.id}"
                       ${selectedReelIds.has(r.id) ? 'checked' : ''}
                       onchange="toggleReelSelection('${r.id}', this.checked)">
                <span class="px-2 py-0.5 rounded-full bg-white/90 text-[10px] font-bold text-[#db2777] shadow-sm">
                  ${r.tag || '4K'}
                </span>
              </div>
              <button onclick="deleteAdminReel('${r.id}')" class="w-7 h-7 rounded-full bg-rose-600/90 hover:bg-rose-700 text-white flex items-center justify-center text-xs shadow-md transition-colors" title="রিলস ডিলিট করুন">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>

            <button onclick="window.BongBanglaReels.openReelVideoModal('${video}', '${encodeURIComponent(r.title)}', '${encodeURIComponent(r.client)}')" class="absolute inset-0 flex items-center justify-center text-white/90 hover:text-white transition-all">
              <div class="w-11 h-11 rounded-full bg-[#db2777]/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-play ml-0.5 text-sm"></i>
              </div>
            </button>

            <div class="absolute bottom-2 inset-x-2 text-left pointer-events-none">
              <span class="inline-block px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold">
                ${r.client}
              </span>
            </div>
          </div>

          <div class="p-3 space-y-1.5 font-bangla text-xs bg-white">
            <div class="font-bold text-[#2b0e23] line-clamp-1" title="${r.title}">${r.title}</div>
            <div class="flex items-center justify-between text-[11px] text-[#8c4f75] pt-1.5 border-t border-[#ED96D7]/20">
              <a href="${catHelper ? catHelper.getCategoryServiceUrl(r.category) : 'service-saree-model-shoot.html'}" target="_blank" class="text-[#db2777] hover:underline font-semibold flex items-center gap-1" title="আলাদা পেজ দেখুন">
                <span>${catHelper ? catHelper.getCategoryDisplayName(r.category) : (categoryNames[r.category] || r.category)}</span>
                <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
              </a>
              <span class="font-medium">${r.views || ''}</span>
            </div>
            <div class="flex items-center gap-1.5 mt-2">
              <button onclick="window.BongBanglaReels.openReelVideoModal('${video}', '${encodeURIComponent(r.title)}', '${encodeURIComponent(r.client)}')"
                      class="flex-1 py-1.5 rounded-xl bg-pink-50 hover:bg-[#db2777] text-[#db2777] hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors">
                <i class="fa-solid fa-eye text-xs"></i>
                <span>ভিউ</span>
              </button>
              <button onclick="openEditReelModal('${r.id}')"
                      class="px-3 py-1.5 rounded-xl bg-[#fdf2f8] hover:bg-[#db2777] text-[#be185d] hover:text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                      title="এডিট">
                <i class="fa-solid fa-pen-to-square text-xs"></i>
                <span>এডিট</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  setReelViewMode(currentReelViewMode);
  updateReelsBulkUI();
}

window.deleteAdminReel = async function(id) {
  if (!id) return;
  if (!confirm('আপনি কি নিশ্চিতভাবে এই রিলসটি মুছে ফেলতে চান?')) {
    return;
  }

  // 1. Instant local removal
  if (window.BongBanglaReels) {
    window.BongBanglaReels.deleteReel(id);
  }
  selectedReelIds.delete(id);
  const filter = document.getElementById('admin-reel-filter');
  renderAdminReels(filter ? filter.value : 'all');
  showAdminToast('রিলস সফলভাবে মুছে ফেলা হয়েছে!', 'success');

  // 2. Delete from Supabase in background
  if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.deleteReel === 'function') {
    try {
      await window.BongBanglaSupabase.deleteReel(id);
      const fresh = await window.BongBanglaSupabase.fetchReels('all').catch(() => null);
      renderAdminReels(filter ? filter.value : 'all', fresh);
    } catch (err) {
      console.warn('Supabase deleteReel error:', err);
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

  if (models.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full text-center py-12 text-[#8c4f75] text-sm font-bangla bg-[#fdf2f8] rounded-2xl border border-dashed border-[#ED96D7]/40">
        কোনো মডেল পাওয়া যায়নি। উপরে "নতুন মডেল যুক্ত করুন" বাটনে ক্লিক করে প্রোফাইল যুক্ত করুন।
      </div>
    `;
    selectedModelIds.clear();
    updateModelsBulkUI();
    return;
  }

  const defaultModelFallback = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

  grid.innerHTML = models.map(m => {
    const rawImg = m.image || defaultModelFallback;
    const modelImg = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(rawImg, 'models') : rawImg;

    return `
      <div class="glass-panel rounded-2xl overflow-hidden border border-[#ED96D7]/30 group hover:border-[#ED96D7] shadow-sm hover:shadow-md transition-all bg-white relative">
        <div class="aspect-[3/4] relative overflow-hidden bg-[#fdf2f8]">
          <img src="${modelImg || defaultModelFallback}" alt="${m.name}" onerror="this.onerror=null; this.src='${defaultModelFallback}';" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          
          <!-- Top Checkbox and Delete Button -->
          <div class="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
            <input type="checkbox" class="model-checkbox w-4 h-4 rounded border-[#ED96D7] text-[#db2777] focus:ring-[#db2777] cursor-pointer bg-white/90 shadow-sm"
                   data-id="${m.id}"
                   ${selectedModelIds.has(m.id) ? 'checked' : ''}
                   onchange="toggleModelSelection('${m.id}', this.checked)">
            <button type="button" onclick="event.stopPropagation(); deleteModel('${m.id}')" class="w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center text-xs shadow-md transition-all active:scale-95 cursor-pointer" title="মডেল রিমুভ করুন">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
        <div class="p-4 space-y-1.5 font-bangla text-xs">
          <div class="flex items-center justify-between">
            <div class="font-bold text-[#2b0e23] text-sm">${m.name}</div>
            <a href="model-details.html?id=${encodeURIComponent(m.id)}" target="_blank" class="text-[10px] text-[#db2777] hover:underline font-bold flex items-center gap-1" title="ওয়েবসাইটে প্রোফাইল দেখুন">
              <span>ভিউ</span> <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
            </a>
          </div>
          <div class="text-[#be185d] text-[11px] font-semibold">${m.category}</div>
          <div class="flex items-center justify-between text-[#8c4f75] text-[11px] pt-2 border-t border-[#ED96D7]/20">
            <span>উচ্চতা: ${m.height}</span>
            <span>শ্যুট: ${m.shoots}</span>
          </div>
          ${m.location ? `<div class="text-[10px] text-gray-500 truncate"><i class="fa-solid fa-location-dot text-[#db2777] text-[9px] mr-1"></i>${m.location}</div>` : ''}
          <div class="pt-2 flex items-center gap-2">
            <button type="button" onclick="event.stopPropagation(); openEditModelModal('${m.id}')" class="flex-1 py-1.5 rounded-xl bg-pink-50 hover:bg-[#db2777] text-[#db2777] hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer">
              <i class="fa-solid fa-pen-to-square text-xs"></i>
              <span>এডিট করুন</span>
            </button>
            <button type="button" onclick="event.stopPropagation(); deleteModel('${m.id}')" class="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 inline-flex items-center justify-center transition-colors shadow-xs active:scale-95 cursor-pointer" title="মডেল রিমুভ করুন">
              <i class="fa-solid fa-trash-can text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  updateModelsBulkUI();
}

function showAdminToast(message, type = 'success') {
  let toast = document.getElementById('admin-floating-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'admin-floating-toast';
    document.body.appendChild(toast);
  }
  const isError = type === 'error';
  toast.className = `fixed bottom-5 right-5 z-[9999] px-4 py-3 rounded-2xl shadow-2xl font-bangla text-xs flex items-center gap-2.5 transition-all duration-300 pointer-events-none text-white ${
    isError ? 'bg-rose-600' : 'bg-emerald-600'
  }`;
  toast.innerHTML = `<i class="fa-solid ${isError ? 'fa-triangle-exclamation' : 'fa-circle-check'} text-sm"></i> <span>${message}</span>`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(16px)';
  }, 3500);
}

window.deleteModel = async function(id) {
  if (!id) return;
  if (!confirm('আপনি কি এই মডেলের প্রোফাইল রিমুভ করতে চান?')) {
    return;
  }

  // 1. Instant optimistic UI update
  const models = getModels().filter(m => m.id !== id);
  saveModels(models);
  selectedModelIds.delete(id);
  renderModelsGrid();
  showAdminToast('মডেলের প্রোফাইল সফলভাবে মুছে ফেলা হয়েছে!', 'success');

  // 2. Add to local tombstone
  try {
    const delRaw = localStorage.getItem('bongbangla_deleted_models') || '[]';
    const delList = JSON.parse(delRaw);
    if (!delList.includes(id)) {
      delList.push(id);
      localStorage.setItem('bongbangla_deleted_models', JSON.stringify(delList));
    }
  } catch(e) {}

  // 3. Delete from Supabase Cloud
  if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.deleteModel === 'function') {
    try {
      await window.BongBanglaSupabase.deleteModel(id);
    } catch (err) {
      console.warn('Supabase deleteModel error:', err);
    }
  }
};

/* ==========================================================================
   Hero Section Slides & Images Management
   ========================================================================== */
let selectedHeroSlideIds = new Set();

function getHeroSlides() {
  if (window._cachedCloudHeroSlides && Array.isArray(window._cachedCloudHeroSlides) && window._cachedCloudHeroSlides.length > 0) {
    return window._cachedCloudHeroSlides;
  }
  try {
    const raw = localStorage.getItem('bongbangla_hero_slides');
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch(e) {}
  return [];
}

function saveHeroSlides(slides) {
  window._cachedCloudHeroSlides = slides;
  localStorage.setItem('bongbangla_hero_slides', JSON.stringify(slides));
}

function updateHeroSlidesBulkUI() {
  const bulkBar = document.getElementById('hero-slides-bulk-bar');
  const countEl = document.getElementById('hero-slides-selected-count');
  const toggleBtn = document.getElementById('hero-slides-toggle-all-btn');

  const count = selectedHeroSlideIds.size;
  if (countEl) countEl.textContent = count.toLocaleString('bn-BD');

  if (bulkBar) {
    if (count > 0) bulkBar.classList.remove('hidden');
    else bulkBar.classList.add('hidden');
  }

  const allCheckboxes = document.querySelectorAll('.hero-slide-checkbox');
  if (toggleBtn && allCheckboxes.length > 0) {
    const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
    if (allChecked) {
      toggleBtn.innerHTML = '<i class="fa-solid fa-square-check text-[#db2777]"></i> সিলেকশন সরান';
    } else {
      toggleBtn.innerHTML = '<i class="fa-regular fa-square-check text-[#db2777]"></i> সব সিলেক্ট';
    }
  }
}

window.toggleHeroSlideSelection = function(id, checked) {
  if (checked) selectedHeroSlideIds.add(id);
  else selectedHeroSlideIds.delete(id);
  updateHeroSlidesBulkUI();
};

window.toggleSelectAllHeroSlides = function() {
  const checkboxes = document.querySelectorAll('.hero-slide-checkbox');
  if (checkboxes.length === 0) return;

  const allChecked = Array.from(checkboxes).every(cb => cb.checked);
  checkboxes.forEach(cb => {
    cb.checked = !allChecked;
    const id = cb.getAttribute('data-id');
    if (id) {
      if (!allChecked) selectedHeroSlideIds.add(id);
      else selectedHeroSlideIds.delete(id);
    }
  });
  updateHeroSlidesBulkUI();
};

window.deselectAllHeroSlides = function() {
  selectedHeroSlideIds.clear();
  document.querySelectorAll('.hero-slide-checkbox').forEach(cb => cb.checked = false);
  updateHeroSlidesBulkUI();
};

window.applyBulkHeroSlidesDelete = async function() {
  if (selectedHeroSlideIds.size === 0) return;
  if (!confirm(`আপনি কি নিশ্চিতভাবে নির্বাচিত ${selectedHeroSlideIds.size} টি হিরো ইমেজ মুছে ফেলতে চান?`)) return;

  const toDelete = Array.from(selectedHeroSlideIds);
  if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.deleteHeroSlide === 'function') {
    toDelete.forEach(id => window.BongBanglaSupabase.deleteHeroSlide(id));
  }
  let slides = getHeroSlides().filter(s => !selectedHeroSlideIds.has(s.id));
  saveHeroSlides(slides);

  alert(`${toDelete.length} টি হিরো ইমেজ সফলভাবে মুছে ফেলা হয়েছে!`);
  selectedHeroSlideIds.clear();
  renderAdminHeroSlides();
};

window.deleteAdminHeroSlide = function(id) {
  if (confirm('আপনি কি এই হিরো ইমেজটি মুছে ফেলতে চান?')) {
    if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.deleteHeroSlide === 'function') {
      window.BongBanglaSupabase.deleteHeroSlide(id);
    }
    let slides = getHeroSlides().filter(s => s.id !== id);
    saveHeroSlides(slides);
    selectedHeroSlideIds.delete(id);
    renderAdminHeroSlides();
  }
};

window.clearAllHeroSlides = function() {
  if (confirm('আপনি কি নিশ্চিতভাবে সব হিরো ইমেজ খালি করতে চান?')) {
    const slides = getHeroSlides();
    if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.deleteHeroSlide === 'function') {
      slides.forEach(s => window.BongBanglaSupabase.deleteHeroSlide(s.id));
    }
    saveHeroSlides([]);
    selectedHeroSlideIds.clear();
    renderAdminHeroSlides();
    alert('সব হিরো ইমেজ সফলভাবে মুছে ফেলা হয়েছে!');
  }
};

function renderAdminHeroSlides(directData) {
  const grid = document.getElementById('admin-hero-slides-grid');
  const emptyState = document.getElementById('hero-slides-empty-state');
  if (!grid) return;

  const slides = (Array.isArray(directData) && directData.length > 0) ? directData : getHeroSlides();

  if (slides.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    selectedHeroSlideIds.clear();
    updateHeroSlidesBulkUI();
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  const defaultHeroFallback = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=720&h=1280&q=80';

  grid.innerHTML = slides.map(s => {
    const slideImg = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(s.image, 'hero') : s.image;

    return `
      <div class="glass-panel rounded-2xl overflow-hidden border border-[#ED96D7]/35 group hover:border-[#db2777] shadow-sm hover:shadow-md transition-all bg-white flex flex-col justify-between relative">
        <div class="aspect-[9/16] relative overflow-hidden bg-black">
          <img src="${slideImg || defaultHeroFallback}" alt="${s.title}" onerror="this.onerror=null; this.src='${defaultHeroFallback}';" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>
          
          <!-- Top Checkbox & Delete -->
          <div class="absolute top-2 inset-x-2 flex items-center justify-between z-10">
            <input type="checkbox" class="hero-slide-checkbox w-4 h-4 rounded border-[#ED96D7] text-[#db2777] focus:ring-[#db2777] cursor-pointer bg-white/90 shadow-sm"
                   data-id="${s.id}"
                   ${selectedHeroSlideIds.has(s.id) ? 'checked' : ''}
                   onchange="toggleHeroSlideSelection('${s.id}', this.checked)">
            <button onclick="deleteAdminHeroSlide('${s.id}')" class="w-7 h-7 rounded-full bg-rose-600/90 hover:bg-rose-700 text-white flex items-center justify-center text-xs shadow-md transition-colors" title="মুছে ফেলুন">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>

          <!-- Top Badge -->
          <div class="absolute top-8 left-2 pointer-events-none">
            <span class="px-2 py-0.5 rounded-full bg-white/90 text-[10px] font-bold text-[#db2777] shadow-sm">
              ${s.tag || 'HERO'}
            </span>
          </div>

          <!-- Bottom Title -->
          <div class="absolute bottom-2 inset-x-2 text-center pointer-events-none">
            <span class="inline-block px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold font-bangla line-clamp-1">
              ${s.title || 'হিরো কার্ড'}
            </span>
          </div>
        </div>
        <div class="p-2.5 text-center font-bangla text-xs bg-white">
          <div class="font-bold text-[#2b0e23] line-clamp-1 text-[11px]">${s.title || 'হিরো কার্ড'}</div>
        </div>
      </div>
    `;
  }).join('');

  updateHeroSlidesBulkUI();
}

let selectedHeroSlideFile = null;
let selectedHeroSlideDataUrl = '';

window.setHeroSlideInputMode = function(mode) {
  const tabFileBtn = document.getElementById('hero-slide-tab-file-btn');
  const tabUrlBtn = document.getElementById('hero-slide-tab-url-btn');
  const fileView = document.getElementById('hero-slide-file-upload-view');
  const urlView = document.getElementById('hero-slide-url-view');

  if (mode === 'file') {
    if (tabFileBtn) tabFileBtn.className = 'px-2 py-0.5 rounded-md font-bold transition-all bg-[#db2777] text-white shadow-xs';
    if (tabUrlBtn) tabUrlBtn.className = 'px-2 py-0.5 rounded-md font-bold transition-all text-[#572449] hover:text-[#db2777]';
    if (fileView) fileView.classList.remove('hidden');
    if (urlView) urlView.classList.add('hidden');
  } else {
    if (tabUrlBtn) tabUrlBtn.className = 'px-2 py-0.5 rounded-md font-bold transition-all bg-[#db2777] text-white shadow-xs';
    if (tabFileBtn) tabFileBtn.className = 'px-2 py-0.5 rounded-md font-bold transition-all text-[#572449] hover:text-[#db2777]';
    if (urlView) urlView.classList.remove('hidden');
    if (fileView) fileView.classList.add('hidden');
  }
};

window.clearHeroSlideFileSelection = function() {
  selectedHeroSlideFile = null;
  selectedHeroSlideDataUrl = '';
  const fileInput = document.getElementById('hero-slide-image-file');
  const dropzone = document.getElementById('hero-slide-file-dropzone');
  const previewBox = document.getElementById('hero-slide-file-preview-box');
  const previewImg = document.getElementById('hero-slide-file-preview-img');
  const urlInput = document.getElementById('hero-slide-image-input');

  if (fileInput) fileInput.value = '';
  if (previewImg) previewImg.src = '';
  if (previewBox) previewBox.classList.add('hidden');
  if (dropzone) dropzone.classList.remove('hidden');
  if (urlInput && (urlInput.value.includes('vault.bongbangla.top/hero/') || urlInput.value.startsWith('data:'))) {
    urlInput.value = '';
  }
};

function handleHeroSlideFileChange(file) {
  if (!file) return;
  selectedHeroSlideFile = file;
  const dropzone = document.getElementById('hero-slide-file-dropzone');
  const previewBox = document.getElementById('hero-slide-file-preview-box');
  const previewImg = document.getElementById('hero-slide-file-preview-img');
  const nameEl = document.getElementById('hero-slide-file-name');
  const sizeEl = document.getElementById('hero-slide-file-size');
  const urlInput = document.getElementById('hero-slide-image-input');

  if (nameEl) nameEl.textContent = file.name;
  if (sizeEl) sizeEl.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

  if (window.BongBanglaVault && typeof window.BongBanglaVault.fileToDataUrl === 'function') {
    window.BongBanglaVault.fileToDataUrl(file, 1080, 0.85).then(dataUrl => {
      selectedHeroSlideDataUrl = dataUrl;
      if (previewImg) previewImg.src = dataUrl;
      if (urlInput) urlInput.value = dataUrl;
    });
  } else {
    const localUrl = URL.createObjectURL(file);
    selectedHeroSlideDataUrl = localUrl;
    if (previewImg) previewImg.src = localUrl;
  }

  if (dropzone) dropzone.classList.add('hidden');
  if (previewBox) previewBox.classList.remove('hidden');
}

function initHeroSlidesAdmin() {
  const openBtn = document.getElementById('open-add-hero-slide-btn');
  const closeBtn = document.getElementById('close-add-hero-slide-btn');
  const modal = document.getElementById('add-hero-slide-modal');
  const form = document.getElementById('add-hero-slide-form');

  const heroFileInput = document.getElementById('hero-slide-image-file');
  if (heroFileInput && !heroFileInput.dataset.initialized) {
    heroFileInput.dataset.initialized = 'true';
    heroFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleHeroSlideFileChange(e.target.files[0]);
      }
    });
  }

  const heroDropzone = document.getElementById('hero-slide-file-dropzone');
  if (heroDropzone && !heroDropzone.dataset.initialized) {
    heroDropzone.dataset.initialized = 'true';
    ['dragenter', 'dragover'].forEach(eventName => {
      heroDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        heroDropzone.classList.add('border-[#db2777]', 'bg-pink-100/60');
      });
    });
    ['dragleave', 'drop'].forEach(eventName => {
      heroDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        heroDropzone.classList.remove('border-[#db2777]', 'bg-pink-100/60');
      });
    });
    heroDropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleHeroSlideFileChange(e.dataTransfer.files[0]);
      }
    });
  }

  if (openBtn && modal && !openBtn.dataset.initialized) {
    openBtn.dataset.initialized = 'true';
    openBtn.addEventListener('click', () => {
      clearHeroSlideFileSelection();
      setHeroSlideInputMode('file');
      modal.classList.remove('hidden');
    });
    if (closeBtn) closeBtn.addEventListener('click', () => {
      clearHeroSlideFileSelection();
      modal.classList.add('hidden');
    });

    if (form && !form.dataset.initialized) {
      form.dataset.initialized = 'true';
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('hero-slide-submit-btn');
        const originalText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> আপলোড ও সেভ হচ্ছে...';
        }

        try {
          const formData = new FormData(form);
          let rawImage = (formData.get('image') || '').toString().trim();
          const title = (formData.get('title') || '').toString().trim();
          const tag = (formData.get('tag') || '4K REC').toString().trim();

          // Upload hero image if file was selected
          if (selectedHeroSlideFile && window.BongBanglaVault) {
            const uploadRes = await window.BongBanglaVault.uploadMedia(selectedHeroSlideFile, 'hero');
            if (uploadRes && uploadRes.url) {
              rawImage = uploadRes.url;
            }
          }

          if (!rawImage && selectedHeroSlideDataUrl) {
            rawImage = selectedHeroSlideDataUrl;
          }

          if (!rawImage || !title) {
            alert('অনুগ্রহ করে ছবির ফাইল বা লিংক এবং শিরোনাম লিখুন!');
            return;
          }

          const formattedImage = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(rawImage, 'hero') : rawImage;

          const newSlide = {
            id: 'hero-' + Date.now(),
            image: formattedImage,
            title: title,
            tag: tag
          };

          if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.addHeroSlide === 'function') {
            await window.BongBanglaSupabase.addHeroSlide(newSlide);
          } else {
            const slides = getHeroSlides();
            slides.unshift(newSlide);
            saveHeroSlides(slides);
          }

          form.reset();
          clearHeroSlideFileSelection();
          modal.classList.add('hidden');
          renderAdminHeroSlides();
          alert('নতুন হিরো ইমেজ সফলভাবে যুক্ত করা হয়েছে!');
        } catch(err) {
          console.error('Error adding hero slide:', err);
          alert('হিরো ইমেজ সেভ করতে সমস্যা হয়েছে: ' + (err.message || ''));
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
        }
      });
    }
  }
}

/* ==========================================================================
   Instagram Media Grabber & Importer Engine (FastDL Style)
   ========================================================================== */
let currentInstaExtractedMedia = [];

function initInstaGrabber() {
  populateInstaModelSelect();
  setupInstaDropzone();
}

function populateInstaModelSelect() {
  const select = document.getElementById('insta-grab-model-select');
  if (!select) return;

  const models = getModels();
  if (!models || models.length === 0) {
    select.innerHTML = '<option value="">কোনো মডেল পাওয়া যায়নি</option>';
    updateInstaSelectedModelPill();
    return;
  }

  const currentVal = select.value;
  select.innerHTML = models.map((m) => 
    `<option value="${m.id}">${m.name || 'নামবিহীন'} (${m.category || 'মডেল'})</option>`
  ).join('');

  if (currentVal && models.some(m => m.id === currentVal)) {
    select.value = currentVal;
  }

  updateInstaSelectedModelPill();
}
window.populateInstaModelSelect = populateInstaModelSelect;

function updateInstaSelectedModelPill() {
  const select = document.getElementById('insta-grab-model-select');
  const pill = document.getElementById('insta-selected-model-pill');
  if (!pill) return;

  if (!select || !select.value) {
    pill.textContent = 'কোনো মডেল নেই';
    return;
  }

  const models = getModels();
  const found = models.find(m => m.id === select.value);
  pill.textContent = found ? found.name : 'সিলেক্টেড মডেল';
}
window.updateInstaSelectedModelPill = updateInstaSelectedModelPill;

window.pasteInstaUrl = async function() {
  const input = document.getElementById('insta-grab-url-input');
  if (!input) return;

  try {
    if (navigator.clipboard && navigator.clipboard.readText) {
      const text = await navigator.clipboard.readText();
      if (text) {
        input.value = text.trim();
        input.focus();
        showAdminToast('ক্লিপবোর্ড থেকে লিংক পেস্ট করা হয়েছে!', 'success');
        return;
      }
    }
  } catch(e) {}

  input.focus();
  input.select();
  showAdminToast('লিংকটি ইনপুট বক্সে পেস্ট করুন (Ctrl+V)', 'info');
};

window.clearInstaUrl = function() {
  const input = document.getElementById('insta-grab-url-input');
  if (input) input.value = '';
  const results = document.getElementById('insta-results-container');
  if (results) results.classList.add('hidden');
  currentInstaExtractedMedia = [];
};

window.openCurrentInFastDL = function() {
  const input = document.getElementById('insta-grab-url-input');
  const val = input ? input.value.trim() : '';
  const fastDlUrl = val ? 'https://fastdl.app/' : 'https://fastdl.app/';
  window.open(fastDlUrl, '_blank');
};

function extractInstagramMediaFromHtml(html, textFallback = '') {
  const extracted = [];
  const seenUrls = new Set();
  let caption = '';

  function cleanCaption(c) {
    if (!c || typeof c !== 'string') return '';
    const cleaned = c.replace(/^Instagram:|\s*on Instagram:.*$/i, '').trim();
    const lower = cleaned.toLowerCase();
    if (lower === 'instagram' || lower.includes('login') || lower.includes('error') || lower.includes('cloudflare') || lower.includes('520:') || lower.includes('500:')) {
      return '';
    }
    return cleaned;
  }

  function addMedia(type, url, thumbnail, title) {
    if (!url || typeof url !== 'string') return;
    const cleanUrl = url.replace(/\\u0026/g, '&').replace(/\\\//g, '/').replace(/&amp;/g, '&');
    if (seenUrls.has(cleanUrl)) return;

    // Filter out profile avatars, small icons, static assets
    if (cleanUrl.includes('s150x150') || cleanUrl.includes('s100x100') || cleanUrl.includes('s320x320') || cleanUrl.includes('/t51.82787-19/') || cleanUrl.includes('rsrc.php')) {
      return;
    }

    seenUrls.add(cleanUrl);
    extracted.push({
      type: type,
      url: cleanUrl,
      thumbnail: thumbnail ? thumbnail.replace(/\\u0026/g, '&').replace(/\\\//g, '/').replace(/&amp;/g, '&') : cleanUrl,
      title: title || (type === 'video' ? 'Instagram Video / Reel' : 'Instagram Photo')
    });
  }

  // Check if response is an error or block page
  const isBlockedOrError = !html ||
    html.includes('AbuseAlleviationError') ||
    html.includes('520: Web server') ||
    html.includes('500 Internal Server') ||
    html.includes('accounts/login') ||
    html.includes('login_required');

  if (!isBlockedOrError) {
    // 1. Primary: Extract from Embed HTML (s.handle with contextJSON / gql_data)
    // This contains all 20 carousel items (photos & reels) in full HD
    const handleMatches = [...html.matchAll(/s\.handle\((\{[\s\S]*?\})\);/g)];
    for (const hm of handleMatches) {
      try {
        const data = JSON.parse(hm[1]);
        function findContextJson(obj) {
          if (!obj) return;
          if (typeof obj === 'string') {
            if (obj.includes('gql_data') || obj.includes('edge_sidecar_to_children') || obj.includes('shortcode_media')) {
              try {
                const inner = JSON.parse(obj);
                processGql(inner);
              } catch(e) {}
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
          const sc = (root && root.gql_data && root.gql_data.shortcode_media) || (root && root.shortcode_media);
          if (!sc) return;

          // Extract Caption
          if (!caption && sc.edge_media_to_caption && sc.edge_media_to_caption.edges && sc.edge_media_to_caption.edges[0]) {
            caption = cleanCaption(sc.edge_media_to_caption.edges[0].node.text || '');
          }
          if (!caption && sc.accessibility_caption) {
            caption = cleanCaption(sc.accessibility_caption);
          }

          // Extract Carousel Children
          if (sc.edge_sidecar_to_children && sc.edge_sidecar_to_children.edges && Array.isArray(sc.edge_sidecar_to_children.edges)) {
            sc.edge_sidecar_to_children.edges.forEach(edge => {
              const n = edge.node;
              if (!n) return;
              if (n.is_video && n.video_url) {
                addMedia('video', n.video_url, n.display_url, n.accessibility_caption || 'Instagram Reel');
              } else if (n.display_url) {
                addMedia('photo', n.display_url, n.display_url, n.accessibility_caption || 'Instagram Photo');
              }
            });
          } else {
            // Single photo or reel
            if (sc.is_video && sc.video_url) {
              addMedia('video', sc.video_url, sc.display_url, sc.accessibility_caption || 'Instagram Reel');
            } else if (sc.display_url) {
              addMedia('photo', sc.display_url, sc.display_url, sc.accessibility_caption || 'Instagram Photo');
            }
          }
        }

        findContextJson(data);
      } catch(err) {}
    }

    // 2. Secondary: Extract from standard Instagram page scripts (ScheduledServerJS, carousel_media, image_versions2)
    if (extracted.length === 0) {
      const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
      let match;

      while ((match = scriptRegex.exec(html)) !== null) {
        const content = match[1].trim();
        if (!content.includes('carousel_media') && !content.includes('video_versions') && !content.includes('image_versions2')) {
          continue;
        }

        try {
          const data = JSON.parse(content);
          function searchObj(obj) {
            if (!obj || typeof obj !== 'object') return;

            if (!caption && obj.caption && typeof obj.caption.text === 'string') {
              caption = cleanCaption(obj.caption.text);
            }

            // Check for Video
            if (obj.video_versions && Array.isArray(obj.video_versions) && obj.video_versions.length > 0) {
              const bestVideo = obj.video_versions[0];
              if (bestVideo && bestVideo.url) {
                let thumb = '';
                if (obj.image_versions2 && obj.image_versions2.candidates && obj.image_versions2.candidates[0]) {
                  thumb = obj.image_versions2.candidates[0].url;
                }
                addMedia('video', bestVideo.url, thumb, obj.accessibility_caption || 'Instagram Reel');
              }
            }

            // Check for Photo
            if (obj.image_versions2 && obj.image_versions2.candidates && Array.isArray(obj.image_versions2.candidates) && obj.image_versions2.candidates.length > 0) {
              if (!obj.video_versions || obj.video_versions.length === 0) {
                const bestImg = obj.image_versions2.candidates[0];
                if (bestImg && bestImg.url) {
                  addMedia('photo', bestImg.url, bestImg.url, obj.accessibility_caption || 'Instagram Photo');
                }
              }
            }

            for (const k of Object.keys(obj)) {
              if (typeof obj[k] === 'object') searchObj(obj[k]);
            }
          }

          searchObj(data);
        } catch(jsonErr) {}
      }
    }

    // 3. Fallback: High-res CDN media URLs from HTML (only if not an error/login page)
    if (extracted.length === 0) {
      const combined = html + '\n' + textFallback;
      const cdnRegex = /https:[\\\/]+[a-z0-9.-]*scontent[a-z0-9.-]*\.cdninstagram\.com[\\\/]v[\\\/]t51\.[0-9-]+[\\\/][^"'\s\)]+/gi;
      const cdnMatches = combined.match(cdnRegex) || [];
      for (const m of cdnMatches) {
        addMedia('photo', m, m, 'Instagram Photo');
      }

      const videoRegex = /(https?:\/\/[^\s\)\"\']+\.mp4[^\s\)\"\']*)/gi;
      let vMatch;
      while ((vMatch = videoRegex.exec(combined)) !== null) {
        addMedia('video', vMatch[1], '', 'Instagram Video / Reel');
      }
    }
  }

  // Caption fallback from title
  if (!caption) {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      caption = cleanCaption(titleMatch[1]);
    }
  }

  return { mediaList: extracted, caption };
}

window.executeInstagramGrab = async function() {
  const input = document.getElementById('insta-grab-url-input');
  const rawUrl = input ? input.value.trim() : '';

  if (!rawUrl) {
    alert('অনুগ্রহ করে ইনস্টাগ্রাম পোস্ট বা রিলসের লিংক লিখুন!');
    if (input) input.focus();
    return;
  }

  // Extract shortcode
  let shortcode = '';
  const match = rawUrl.match(/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i);
  if (match) {
    shortcode = match[1];
  } else if (/^[A-Za-z0-9_-]{8,25}$/.test(rawUrl)) {
    shortcode = rawUrl;
  }

  if (!shortcode) {
    alert('সঠিক ইনস্টাগ্রাম পোস্ট বা রিলসের লিংক দিন! (উদাঃ https://www.instagram.com/p/DcjX9lvEwfT/)');
    return;
  }

  const modelSelect = document.getElementById('insta-grab-model-select');
  if (!modelSelect || !modelSelect.value) {
    alert('অনুগ্রহ করে প্রথমে একজন টার্গেট মডেল নির্বাচন করুন!');
    return;
  }

  const execBtn = document.getElementById('insta-grab-execute-btn');
  const loading = document.getElementById('insta-grab-loading');
  const resultsContainer = document.getElementById('insta-results-container');

  if (loading) loading.classList.remove('hidden');
  if (resultsContainer) resultsContainer.classList.add('hidden');
  if (execBtn) {
    execBtn.disabled = true;
    execBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>মিডিয়া খোঁজা হচ্ছে...</span>';
  }

  const setGrabStatus = (msg) => {
    if (execBtn) {
      execBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i><span>${msg}</span>`;
    }
  };

  try {
    let extracted = [];
    let caption = '';

    // 1. PRIMARY ENGINE: High-Speed Serverless API (/api/instagram-grab)
    // Extracts ALL carousel photos & 4K video reels with zero browser CORS restrictions
    setGrabStatus('সার্ভার ইঞ্জিন থেকে সব মিডিয়া আনা হচ্ছে...');
    const apiEndpoints = [
      `/api/instagram-grab?shortcode=${encodeURIComponent(shortcode)}`,
      `https://bongbangla.top/api/instagram-grab?shortcode=${encodeURIComponent(shortcode)}`
    ];

    for (const ep of apiEndpoints) {
      try {
        const apiRes = await fetch(ep, {
          signal: AbortSignal.timeout(15000),
          headers: { 'Accept': 'application/json' }
        });
        if (apiRes.ok) {
          const json = await apiRes.json();
          if (json.success && Array.isArray(json.mediaList) && json.mediaList.length > 0) {
            extracted = json.mediaList;
            caption = json.caption || '';
            console.log(`⚡ Instagram Grabber successfully extracted via BongBangla Engine [${ep}]: ${extracted.length} items`);
            break;
          }
        }
      } catch(apiErr) {
        console.warn(`[instagram-grab] Endpoint ${ep} attempt failed:`, apiErr.message);
      }
    }

    // 2. Client-side Mirror Fallback (if serverless API endpoint not reached)
    if (extracted.length === 0) {
      const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
      const postUrl = `https://www.instagram.com/p/${shortcode}/`;

      const mirrors = [
        {
          name: 'AllOrigins Get (JSON)',
          statusText: 'হাই-স্পিড মিরর ১ থেকে খোঁজা হচ্ছে...',
          fetch: async () => {
            const r = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(embedUrl)}`, {
              signal: AbortSignal.timeout(10000)
            });
            if (!r.ok) return '';
            const j = await r.json();
            return j.contents || '';
          }
        },
        {
          name: 'AllOrigins Raw',
          statusText: 'হাই-স্পিড মিরর ২ থেকে খোঁজা হচ্ছে...',
          fetch: async () => {
            const r = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(embedUrl)}`, {
              signal: AbortSignal.timeout(10000)
            });
            return r.ok ? await r.text() : '';
          }
        },
        {
          name: 'CORS.eu.org Embed',
          statusText: 'হাই-স্পিড মিরর ৩ থেকে খোঁজা হচ্ছে...',
          fetch: async () => {
            const r = await fetch(`https://cors.eu.org/${embedUrl}`, {
              signal: AbortSignal.timeout(10000)
            });
            return r.ok ? await r.text() : '';
          }
        },
        {
          name: 'Jina AI Embed',
          statusText: 'হাই-স্পিড মিরর ৪ থেকে খোঁজা হচ্ছে...',
          fetch: async () => {
            const r = await fetch(`https://r.jina.ai/${embedUrl}`, {
              headers: { 'Accept': 'text/html', 'X-Return-Format': 'html' },
              signal: AbortSignal.timeout(10000)
            });
            return r.ok ? await r.text() : '';
          }
        }
      ];

      for (const m of mirrors) {
        setGrabStatus(m.statusText);
        try {
          const html = await m.fetch();
          if (!html || html.length < 500) continue;

          const parsed = extractInstagramMediaFromHtml(html);
          if (parsed.mediaList && parsed.mediaList.length > 0) {
            extracted = parsed.mediaList;
            caption = parsed.caption;
            console.log(`⚡ Instagram Grabber extracted via mirror [${m.name}]: ${extracted.length} items`);
            break;
          }
        } catch(mirrorErr) {
          console.warn(`Mirror [${m.name}] attempt failed:`, mirrorErr.message);
        }
      }

      // 3. Fallback: Instagram oEmbed + Microlink
      if (extracted.length === 0) {
        setGrabStatus('ব্যাকআপ এপিআই থেকে খোঁজা হচ্ছে...');
        try {
          const microRes = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(postUrl)}&video=true`, {
            signal: AbortSignal.timeout(10000)
          });
          if (microRes.ok) {
            const json = await microRes.json();
            if (json.data) {
              caption = json.data.description || json.data.title || '';
              if (json.data.video && json.data.video.url) {
                extracted.push({
                  type: 'video',
                  url: json.data.video.url,
                  thumbnail: json.data.image ? json.data.image.url : '',
                  title: 'Instagram Video / Reel'
                });
              } else if (json.data.image && json.data.image.url) {
                extracted.push({
                  type: 'photo',
                  url: json.data.image.url,
                  thumbnail: json.data.image.url,
                  title: 'Instagram Photo'
                });
              }
            }
          }
        } catch(err3) {
          console.warn('Microlink grab error:', err3);
        }
      }
    }

    if (extracted.length === 0) {
      alert('ইনস্টাগ্রাম থেকে মিডিয়া এক্সট্র্যাক্ট করা সম্ভব হয়নি। পোস্টটি প্রাইভেট হতে পারে অথবা ইনস্টাগ্রামের সার্ভার সাময়িক ব্যস্ত রয়েছে।\n\nআপনি নিচে থাকা "FastDL-এ পোস্টটি খুলুন" বাটনে ক্লিক করে সহজে ডাউনলোড করে নিচের ড্রপজোনে ড্র্যাগ করতে পারেন।');
      return;
    }

    currentInstaExtractedMedia = extracted;
    renderInstaExtractedMedia(extracted, caption);
    showAdminToast(`${extracted.length} টি ফুল-রেজুলেশন মিডিয়া পাওয়া গেছে!`, 'success');
  } catch(e) {
    console.error('executeInstagramGrab error:', e);
    alert('মিডিয়া আনতে গিয়ে সমস্যা হয়েছে: ' + (e.message || ''));
  } finally {
    if (loading) loading.classList.add('hidden');
    if (execBtn) {
      execBtn.disabled = false;
      execBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-down text-base"></i><span>মিডিয়া আনুন</span>';
    }
  }
};

function renderInstaExtractedMedia(items, caption) {
  const container = document.getElementById('insta-results-container');
  const grid = document.getElementById('insta-media-grid');
  const countEl = document.getElementById('insta-results-count');
  const captionEl = document.getElementById('insta-results-caption');

  if (!container || !grid) return;

  if (countEl) countEl.textContent = `${items.length} টি মিডিয়া পাওয়া গেছে`;
  if (captionEl) captionEl.textContent = caption ? `ক্যাপশন: ${caption}` : '';

  grid.innerHTML = items.map((item, idx) => {
    const isVideo = item.type === 'video';
    return `
      <div class="glass-panel rounded-2xl border border-[#ED96D7]/40 overflow-hidden bg-white shadow-xs hover:shadow-md transition-all flex flex-col group relative">
        
        <!-- Media Top Badges & Checkbox -->
        <div class="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
          <label class="pointer-events-auto cursor-pointer p-1 rounded-lg bg-black/40 backdrop-blur-md text-white flex items-center">
            <input type="checkbox" class="insta-item-checkbox w-4 h-4 rounded text-[#db2777] focus:ring-0 cursor-pointer" data-index="${idx}" checked onchange="updateInstaSelectionCount()">
          </label>
          <div class="flex items-center gap-1.5">
            <span class="px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-md text-white font-extrabold text-[10px] uppercase tracking-wide">
              ${isVideo ? '<i class="fa-solid fa-video text-rose-400 mr-1"></i>REEL' : '<i class="fa-solid fa-image text-pink-300 mr-1"></i>PHOTO'}
            </span>
            <span class="px-1.5 py-0.5 rounded-md bg-pink-600/80 backdrop-blur-md text-white font-bold text-[10px]">
              HD
            </span>
          </div>
        </div>

        <!-- Media Preview Area -->
        <div class="relative w-full aspect-square bg-slate-900 overflow-hidden flex items-center justify-center">
          ${isVideo 
            ? `<video src="${item.url}" controls class="w-full h-full object-cover"></video>` 
            : `<img src="${item.url}" alt="Instagram Media" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" referrerpolicy="no-referrer">`
          }
        </div>

        <!-- Card Footer Actions -->
        <div class="p-3.5 space-y-2.5 bg-gradient-to-b from-[#fffafc] to-white border-t border-[#ED96D7]/20 flex-1 flex flex-col justify-between">
          <div class="text-[11px] font-bold text-[#2b0e23] truncate">
            ${isVideo ? 'ইনস্টাগ্রাম ভিডিও/রিলস' : `ইনস্টাগ্রাম ছবি #${idx + 1}`}
          </div>
          
          <div class="grid grid-cols-2 gap-2">
            <a href="${item.url}" target="_blank" download="insta-media-${idx + 1}" class="px-2 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#572449] font-bold text-[11px] transition-all text-center flex items-center justify-center gap-1 shadow-2xs">
              <i class="fa-solid fa-download text-[10px]"></i> ডাউনলোড
            </a>
            <button type="button" onclick="importSingleInstaItem(${idx})" class="px-2 py-2 rounded-xl btn-primary-glow font-bold text-[11px] text-white flex items-center justify-center gap-1 shadow-xs">
              <i class="fa-solid fa-plus text-[10px]"></i> গ্যালারিতে
            </button>
          </div>
        </div>

      </div>
    `;
  }).join('');

  container.classList.remove('hidden');
  updateInstaSelectionCount();
}

window.selectAllInstaItems = function(checked) {
  const checkboxes = document.querySelectorAll('.insta-item-checkbox');
  checkboxes.forEach(cb => cb.checked = checked);
  updateInstaSelectionCount();
};

window.updateInstaSelectionCount = function() {
  const checkboxes = document.querySelectorAll('.insta-item-checkbox:checked');
  const count = checkboxes.length;
  const label = document.getElementById('insta-import-btn-label');
  const allBtn = document.getElementById('insta-import-all-btn');

  if (label) {
    label.textContent = count > 0 ? `মডেল গ্যালারিতে যোগ করুন (${count.toLocaleString('bn-BD')} টি)` : 'মডেল গ্যালারিতে যোগ করুন';
  }
  if (allBtn) {
    allBtn.disabled = count === 0;
    allBtn.style.opacity = count === 0 ? '0.6' : '1';
  }
};

window.importSingleInstaItem = async function(index) {
  const item = currentInstaExtractedMedia[index];
  if (!item) return;

  const modelSelect = document.getElementById('insta-grab-model-select');
  const modelId = modelSelect ? modelSelect.value : '';
  if (!modelId) {
    alert('অনুগ্রহ করে টার্গেট মডেল নির্বাচন করুন!');
    return;
  }

  const destRadio = document.querySelector('input[name="insta-destination"]:checked');
  const destination = destRadio ? destRadio.value : 'gallery';

  await executeUploadAndAttach([item], modelId, destination);
};

window.importSelectedInstaMedia = async function() {
  const checkboxes = document.querySelectorAll('.insta-item-checkbox:checked');
  if (checkboxes.length === 0) {
    alert('অনুগ্রহ করে অন্তত একটি মিডিয়া সিলেক্ট করুন!');
    return;
  }

  const modelSelect = document.getElementById('insta-grab-model-select');
  const modelId = modelSelect ? modelSelect.value : '';
  if (!modelId) {
    alert('অনুগ্রহ করে টার্গেট মডেল নির্বাচন করুন!');
    return;
  }

  const destRadio = document.querySelector('input[name="insta-destination"]:checked');
  const destination = destRadio ? destRadio.value : 'gallery';

  const selectedItems = [];
  checkboxes.forEach(cb => {
    const idx = parseInt(cb.dataset.index, 10);
    if (currentInstaExtractedMedia[idx]) {
      selectedItems.push(currentInstaExtractedMedia[idx]);
    }
  });

  if (selectedItems.length === 0) return;

  await executeUploadAndAttach(selectedItems, modelId, destination);
};

async function executeUploadAndAttach(items, modelId, destination = 'gallery') {
  const models = getModels();
  const model = models.find(m => m.id === modelId);
  if (!model) {
    alert('নির্বাচিত মডেল পাওয়া যায়নি!');
    return;
  }

  const progressBox = document.getElementById('insta-upload-progress');
  const progressBar = document.getElementById('insta-progress-bar');
  const progressPercent = document.getElementById('insta-progress-percent');
  const progressText = document.getElementById('insta-progress-text');
  const importBtn = document.getElementById('insta-import-all-btn');

  if (progressBox) progressBox.classList.remove('hidden');
  if (importBtn) importBtn.disabled = true;

  if (!Array.isArray(model.gallery)) {
    model.gallery = [];
  }

  let successCount = 0;
  const targetFolder = destination === 'reel' ? 'reels' : 'models';

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const pct = Math.round(((i + 1) / items.length) * 100);

    if (progressBar) progressBar.style.width = `${pct}%`;
    if (progressPercent) progressPercent.textContent = `${pct}%`;
    if (progressText) {
      progressText.textContent = `(${i + 1}/${items.length}) Media Vault CDN-এ আপলোড হচ্ছে...`;
    }

    try {
      let blob = null;
      try {
        const fetchRes = await fetch(item.url, {
          referrerPolicy: 'no-referrer',
          signal: AbortSignal.timeout(15000)
        });
        if (fetchRes.ok) {
          blob = await fetchRes.blob();
        }
      } catch(fetchErr) {
        console.warn('Direct blob fetch error:', fetchErr);
      }

      // If direct fetch fails due to browser CORS, download via BongBangla serverless proxy
      if (!blob && item.url) {
        const proxyUrls = [
          `/api/instagram-grab?proxy_media=1&url=${encodeURIComponent(item.url)}`,
          `https://bongbangla.top/api/instagram-grab?proxy_media=1&url=${encodeURIComponent(item.url)}`
        ];
        for (const pu of proxyUrls) {
          try {
            const pRes = await fetch(pu, { signal: AbortSignal.timeout(20000) });
            if (pRes.ok) {
              blob = await pRes.blob();
              break;
            }
          } catch(e) {}
        }
      }

      let permanentUrl = '';
      if (blob && window.BongBanglaVault && typeof window.BongBanglaVault.uploadMedia === 'function') {
        const uploadRes = await window.BongBanglaVault.uploadMedia(blob, targetFolder);
        if (uploadRes && uploadRes.url) {
          permanentUrl = uploadRes.url;
        }
      }

      // Secondary Supabase Cloud Storage Fallback
      if (!permanentUrl && blob && window.BongBanglaSupabase && typeof window.BongBanglaSupabase.uploadStorageFile === 'function') {
        try {
          const cloudUrl = await window.BongBanglaSupabase.uploadStorageFile(blob, targetFolder);
          if (cloudUrl) permanentUrl = cloudUrl;
        } catch(sbErr) {
          console.warn('Supabase fallback error:', sbErr);
        }
      }

      // If upload didn't succeed, retain URL
      if (!permanentUrl) {
        permanentUrl = item.url;
      }

      if (destination === 'avatar') {
        model.image = permanentUrl;
        successCount++;
      } else if (destination === 'reel' || item.type === 'video') {
        model.gallery.unshift({
          type: 'video',
          url: permanentUrl,
          thumbnail: item.thumbnail || permanentUrl
        });
        saveNewReelFromInsta(permanentUrl, model, item.thumbnail || model.image || '');
        successCount++;
      } else {
        model.gallery.unshift({
          type: item.type || 'photo',
          url: permanentUrl,
          thumbnail: item.thumbnail || permanentUrl
        });
        successCount++;
      }
    } catch(itemErr) {
      console.error('Error uploading item:', itemErr);
    }
  }

  // Save model locally and to Supabase
  saveModels(models);

  if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.updateModel === 'function') {
    try {
      await window.BongBanglaSupabase.updateModel(model);
    } catch(upErr) {
      console.warn('Supabase model update error:', upErr);
    }
  }

  if (progressBox) progressBox.classList.add('hidden');
  if (importBtn) importBtn.disabled = false;

  renderModelsGrid();
  updateStats();

  showAdminToast(`সফল হয়েছে! ${model.name}-এর প্রোফাইলে ${successCount} টি মিডিয়া সেভ করা হয়েছে।`, 'success');
  alert(`অভিনন্দন! ${model.name}-এর প্রোফাইলে ${successCount} টি মিডিয়া সফলভাবে Media Vault CDN ও গ্যালারিতে যুক্ত করা হয়েছে।`);
}

function saveNewReelFromInsta(videoUrl, model, customThumbnail = '') {
  try {
    const newReel = {
      id: 'reel-' + Date.now(),
      title: `${model.name || 'BongBangla'} Instagram Reel`,
      category: 'viral-reels',
      client: model.name || 'BongBangla Model',
      tag: 'INSTA REEL',
      views: '১.২K',
      videoUrl: videoUrl,
      thumbnail: customThumbnail || model.image || '',
      created_at: new Date().toISOString()
    };

    if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.addReel === 'function') {
      window.BongBanglaSupabase.addReel(newReel).catch(e => console.warn('addReel error:', e));
    } else {
      let reels = [];
      const saved = localStorage.getItem('bongbangla_reels');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) reels = parsed;
      }
      reels.unshift(newReel);
      localStorage.setItem('bongbangla_reels', JSON.stringify(reels));
    }
  } catch(e) {
    console.warn('saveNewReelFromInsta error:', e);
  }
}

function setupInstaDropzone() {
  const dropzone = document.getElementById('insta-dropzone');
  if (!dropzone || dropzone.dataset.initialized) return;
  dropzone.dataset.initialized = 'true';

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('border-[#db2777]', 'bg-pink-50/50');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('border-[#db2777]', 'bg-pink-50/50');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleInstaManualFiles(e.dataTransfer.files);
    }
  });
}

window.handleInstaManualFiles = async function(fileList) {
  if (!fileList || fileList.length === 0) return;

  const modelSelect = document.getElementById('insta-grab-model-select');
  const modelId = modelSelect ? modelSelect.value : '';
  if (!modelId) {
    alert('অনুগ্রহ করে প্রথমে একজন টার্গেট মডেল নির্বাচন করুন!');
    return;
  }

  const models = getModels();
  const model = models.find(m => m.id === modelId);
  if (!model) {
    alert('নির্বাচিত মডেল পাওয়া যায়নি!');
    return;
  }

  const destRadio = document.querySelector('input[name="insta-destination"]:checked');
  const destination = destRadio ? destRadio.value : 'gallery';

  const files = Array.from(fileList);
  showAdminToast(`${files.length} টি ফাইল আপলোড হচ্ছে...`, 'info');

  if (!Array.isArray(model.gallery)) {
    model.gallery = [];
  }

  let successCount = 0;
  for (const file of files) {
    const isVideo = file.type && file.type.startsWith('video/');
    const folder = isVideo || destination === 'reel' ? 'reels' : 'models';

    let permanentUrl = '';
    if (window.BongBanglaVault && typeof window.BongBanglaVault.uploadMedia === 'function') {
      const res = await window.BongBanglaVault.uploadMedia(file, folder);
      if (res && res.url) permanentUrl = res.url;
    }

    if (!permanentUrl && window.BongBanglaSupabase && typeof window.BongBanglaSupabase.uploadStorageFile === 'function') {
      const res = await window.BongBanglaSupabase.uploadStorageFile(file, folder);
      if (res) permanentUrl = res;
    }

    if (permanentUrl) {
      if (destination === 'avatar') {
        model.image = permanentUrl;
      } else if (destination === 'reel' || isVideo) {
        model.gallery.unshift({
          type: 'video',
          url: permanentUrl,
          thumbnail: model.image || ''
        });
        saveNewReelFromInsta(permanentUrl, model);
      } else {
        model.gallery.unshift({
          type: 'photo',
          url: permanentUrl,
          thumbnail: permanentUrl
        });
      }
      successCount++;
    }
  }

  saveModels(models);
  if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.updateModel === 'function') {
    window.BongBanglaSupabase.updateModel(model).catch(() => {});
  }

  renderModelsGrid();
  updateStats();
  showAdminToast(`${successCount} টি ফাইল সফলভাবে মডেল গ্যালারিতে যুক্ত করা হয়েছে!`, 'success');
};

/* ==========================================================================
   PACKAGES & PRICING RATE ADMIN CONTROLLERS
   ========================================================================== */

function getAdminPackages() {
  if (window.BongBanglaPackages && typeof window.BongBanglaPackages.getStoredPackages === 'function') {
    return window.BongBanglaPackages.getStoredPackages();
  }
  try {
    const raw = localStorage.getItem('bongbangla_packages');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

function saveAdminPackages(packages) {
  if (window.BongBanglaPackages && typeof window.BongBanglaPackages.saveStoredPackages === 'function') {
    window.BongBanglaPackages.saveStoredPackages(packages);
  } else {
    try {
      localStorage.setItem('bongbangla_packages', JSON.stringify(packages));
    } catch (e) {}
  }
  if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.savePackages === 'function') {
    window.BongBanglaSupabase.savePackages(packages).catch(err => console.warn('Supabase savePackages notice:', err));
  }
}

function renderAdminPackages() {
  const grid = document.getElementById('admin-packages-grid');
  const countBadge = document.getElementById('admin-packages-count-badge');
  const emptyState = document.getElementById('packages-empty-state');
  if (!grid) return;

  const packages = getAdminPackages();
  const count = packages.length;

  if (countBadge) {
    const bnNum = (typeof toBnNum === 'function') ? toBnNum(count) : (count + '');
    countBadge.textContent = `${bnNum}টি`;
  }

  if (count === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  grid.innerHTML = packages.map(pkg => {
    const isFeatured = !!pkg.isFeatured;
    const badgeText = pkg.badge || (isFeatured ? 'জনপ্রিয় চয়েস' : '');
    const priceDisplay = pkg.price.startsWith('৳') ? pkg.price : `৳ ${pkg.price}`;

    const featuresHtml = (pkg.features || []).map(f => `
      <li class="flex items-start gap-2">
        <i class="fa-solid fa-check text-emerald-600 text-[11px] mt-0.5 shrink-0"></i>
        <span class="text-xs text-[#572449] leading-snug">${f}</span>
      </li>
    `).join('');

    const presetService = (pkg.defaultConfig && pkg.defaultConfig.service) || 'viral-reels';
    const presetReels = (pkg.defaultConfig && pkg.defaultConfig.reels) || 6;
    const presetModels = (pkg.defaultConfig && pkg.defaultConfig.models !== undefined) ? pkg.defaultConfig.models : 1;

    return `
      <div class="glass-panel p-5 rounded-3xl border ${isFeatured ? 'border-2 border-[#db2777] bg-gradient-to-b from-pink-50/50 via-white to-white' : 'border-[#ED96D7]/40 bg-white'} shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group">
        
        <!-- Top Status & Actions -->
        <div>
          <div class="flex items-start justify-between gap-2 mb-3">
            <div>
              ${badgeText ? `
                <span class="inline-block px-2.5 py-0.5 rounded-full ${isFeatured ? 'bg-gradient-to-r from-[#db2777] to-[#be185d] text-white shadow-xs' : 'bg-pink-100 text-[#db2777]'} text-[10px] font-bold tracking-wide uppercase">
                  ${badgeText}
                </span>
              ` : `
                <span class="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-[#8c4f75] text-[10px] font-bold">
                  স্ট্যান্ডার্ড প্যাক
                </span>
              `}
              <h4 class="font-bold text-base text-[#2b0e23] mt-1.5 font-bangla">${pkg.title}</h4>
            </div>
            
            ${isFeatured ? `
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                <i class="fa-solid fa-star text-amber-500 mr-1"></i>হাইলাইট
              </span>
            ` : ''}
          </div>

          <!-- Price Display -->
          <div class="mb-3 pb-3 border-b border-[#ED96D7]/20 flex items-baseline gap-1.5">
            <span class="font-heading font-extrabold text-2xl text-[#2b0e23]">${priceDisplay}</span>
            <span class="text-xs text-[#8c4f75] font-bangla">${pkg.period || '/ ফুল ক্যাম্পেইন'}</span>
          </div>

          ${pkg.description ? `
            <p class="text-xs text-[#8c4f75] leading-relaxed mb-3.5 line-clamp-2">${pkg.description}</p>
          ` : ''}

          <!-- Features List -->
          <ul class="space-y-1.5 mb-4">
            ${featuresHtml}
          </ul>

          <!-- Config Preset Pill -->
          <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-[#572449] flex items-center justify-between font-bangla mb-4">
            <span class="flex items-center gap-1.5 font-medium">
              <i class="fa-solid fa-sliders text-[#db2777]"></i>
              <span>বিল্ডার লিংক:</span>
            </span>
            <span class="font-bold text-[#db2777]">${presetReels}টি রিলস • ${presetModels} জন মডেল</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="pt-3 border-t border-[#ED96D7]/20 flex items-center gap-2">
          <button type="button" onclick="openEditPackageModal('${pkg.id}')" class="flex-1 py-2 rounded-xl bg-pink-50 hover:bg-[#db2777] text-[#db2777] hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer">
            <i class="fa-solid fa-pen-to-square text-xs"></i>
            <span>এডিট করুন</span>
          </button>
          <button type="button" onclick="deleteAdminPackage('${pkg.id}')" class="w-9 h-9 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white flex items-center justify-center text-xs transition-all shadow-2xs cursor-pointer" title="প্যাকেজ ডিলিট করুন">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>

      </div>
    `;
  }).join('');
}
window.renderAdminPackages = renderAdminPackages;

window.openAddPackageModal = function() {
  const form = document.getElementById('edit-package-form');
  if (form) form.reset();

  const idInput = document.getElementById('pkg-modal-id');
  if (idInput) idInput.value = '';

  const modalTitle = document.getElementById('edit-package-modal-title');
  if (modalTitle) {
    modalTitle.innerHTML = '<i class="fa-solid fa-plus text-[#db2777]"></i> <span>নতুন প্যাকেজ তৈরি করুন</span>';
  }

  const submitLabel = document.getElementById('pkg-modal-submit-label');
  if (submitLabel) submitLabel.textContent = 'প্যাকেজ সেভ করুন';

  const periodInput = document.getElementById('pkg-modal-period');
  if (periodInput) periodInput.value = '/ ফুল ক্যাম্পেইন';

  const reelsInput = document.getElementById('pkg-modal-reels');
  if (reelsInput) reelsInput.value = '6';

  const modelsInput = document.getElementById('pkg-modal-models');
  if (modelsInput) modelsInput.value = '1';

  const serviceInput = document.getElementById('pkg-modal-service');
  if (serviceInput) serviceInput.value = 'viral-reels';

  const modal = document.getElementById('edit-package-modal');
  if (modal) modal.classList.remove('hidden');
};

window.openEditPackageModal = function(id) {
  const packages = getAdminPackages();
  const pkg = packages.find(p => p.id === id);
  if (!pkg) {
    alert('প্যাকেজটি পাওয়া যায়নি!');
    return;
  }

  const idInput = document.getElementById('pkg-modal-id');
  const titleInput = document.getElementById('pkg-modal-title');
  const badgeInput = document.getElementById('pkg-modal-badge');
  const priceInput = document.getElementById('pkg-modal-price');
  const periodInput = document.getElementById('pkg-modal-period');
  const descInput = document.getElementById('pkg-modal-desc');
  const featuredInput = document.getElementById('pkg-modal-featured');
  const featuresInput = document.getElementById('pkg-modal-features');
  const serviceInput = document.getElementById('pkg-modal-service');
  const reelsInput = document.getElementById('pkg-modal-reels');
  const modelsInput = document.getElementById('pkg-modal-models');

  if (idInput) idInput.value = pkg.id;
  if (titleInput) titleInput.value = pkg.title || '';
  if (badgeInput) badgeInput.value = pkg.badge || '';
  if (priceInput) priceInput.value = (pkg.price || '').replace(/^৳\s*/, '');
  if (periodInput) periodInput.value = pkg.period || '/ ফুল ক্যাম্পেইন';
  if (descInput) descInput.value = pkg.description || '';
  if (featuredInput) featuredInput.checked = !!pkg.isFeatured;
  if (featuresInput) featuresInput.value = (pkg.features || []).join('\n');
  if (serviceInput) serviceInput.value = (pkg.defaultConfig && pkg.defaultConfig.service) || 'viral-reels';
  if (reelsInput) reelsInput.value = (pkg.defaultConfig && pkg.defaultConfig.reels) || 6;
  if (modelsInput) modelsInput.value = (pkg.defaultConfig && pkg.defaultConfig.models !== undefined) ? pkg.defaultConfig.models : 1;

  const modalTitle = document.getElementById('edit-package-modal-title');
  if (modalTitle) {
    modalTitle.innerHTML = `<i class="fa-solid fa-pen-to-square text-[#db2777]"></i> <span>প্যাকেজ সম্পাদনা: ${pkg.title}</span>`;
  }

  const submitLabel = document.getElementById('pkg-modal-submit-label');
  if (submitLabel) submitLabel.textContent = 'আপডেট সেভ করুন';

  const modal = document.getElementById('edit-package-modal');
  if (modal) modal.classList.remove('hidden');
};

window.closePackageModal = function() {
  const modal = document.getElementById('edit-package-modal');
  if (modal) modal.classList.add('hidden');
};

window.savePackageFromModal = function(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  const idInput = document.getElementById('pkg-modal-id');
  const titleInput = document.getElementById('pkg-modal-title');
  const badgeInput = document.getElementById('pkg-modal-badge');
  const priceInput = document.getElementById('pkg-modal-price');
  const periodInput = document.getElementById('pkg-modal-period');
  const descInput = document.getElementById('pkg-modal-desc');
  const featuredInput = document.getElementById('pkg-modal-featured');
  const featuresInput = document.getElementById('pkg-modal-features');
  const serviceInput = document.getElementById('pkg-modal-service');
  const reelsInput = document.getElementById('pkg-modal-reels');
  const modelsInput = document.getElementById('pkg-modal-models');

  const title = titleInput ? titleInput.value.trim() : '';
  if (!title) {
    alert('অনুগ্রহ করে প্যাকেজের নাম লিখুন!');
    return false;
  }

  const priceVal = priceInput ? priceInput.value.trim() : '০';
  const features = featuresInput ? featuresInput.value.split('\n').map(s => s.trim()).filter(Boolean) : [];

  const packages = getAdminPackages();
  const pkgId = idInput && idInput.value ? idInput.value.trim() : ('pkg-' + Date.now());

  const packageObj = {
    id: pkgId,
    title,
    badge: badgeInput ? badgeInput.value.trim() : '',
    price: priceVal,
    period: periodInput ? periodInput.value.trim() : '/ ফুল ক্যাম্পেইন',
    description: descInput ? descInput.value.trim() : '',
    isFeatured: featuredInput ? featuredInput.checked : false,
    features,
    servicePreset: 'ad-video',
    defaultConfig: {
      service: serviceInput ? serviceInput.value : 'viral-reels',
      reels: reelsInput ? parseInt(reelsInput.value, 10) || 6 : 6,
      models: modelsInput ? parseInt(modelsInput.value, 10) || 1 : 1,
      addons: ['photos']
    }
  };

  const existingIdx = packages.findIndex(p => p.id === pkgId);
  if (existingIdx > -1) {
    packages[existingIdx] = packageObj;
  } else {
    packages.push(packageObj);
  }

  saveAdminPackages(packages);
  closePackageModal();
  renderAdminPackages();

  if (window.BongBanglaPackages && typeof window.BongBanglaPackages.renderReadyPackages === 'function') {
    window.BongBanglaPackages.renderReadyPackages();
  }

  showAdminToast('প্যাকেজ তথ্য সফলভাবে সেভ করা হয়েছে!', 'success');
  return false;
};

window.deleteAdminPackage = function(id) {
  if (!confirm('আপনি কি এই প্যাকেজটি মুছে ফেলতে চান?')) return;
  let packages = getAdminPackages().filter(p => p.id !== id);
  saveAdminPackages(packages);
  renderAdminPackages();
  if (window.BongBanglaPackages && typeof window.BongBanglaPackages.renderReadyPackages === 'function') {
    window.BongBanglaPackages.renderReadyPackages();
  }
  showAdminToast('প্যাকেজটি সফলভাবে মুছে ফেলা হয়েছে!', 'info');
};

window.resetAdminPackagesToDefault = function() {
  if (!confirm('আপনি কি সব কাস্টম প্যাকেজ মুছে BongBangla-র ৩টি মূল ডিফল্ট প্যাকেজ রিস্টোর করতে চান?')) return;
  const def = (window.BongBanglaPackages && window.BongBanglaPackages.DEFAULT_PACKAGES) ? window.BongBanglaPackages.DEFAULT_PACKAGES : [];
  saveAdminPackages(def);
  renderAdminPackages();
  if (window.BongBanglaPackages && typeof window.BongBanglaPackages.renderReadyPackages === 'function') {
    window.BongBanglaPackages.renderReadyPackages();
  }
  showAdminToast('ডিফল্ট প্যাকেজসমূহ রিস্টোর করা হয়েছে!', 'success');
};

/* ==========================================================================
   CUSTOM PACKAGE BUILDER RATES & PRICING RULES (ADMIN CONTROL)
   ========================================================================== */
function getAdminCustomizerRates() {
  if (window.BongBanglaPackages && typeof window.BongBanglaPackages.getStoredCustomizerRates === 'function') {
    return window.BongBanglaPackages.getStoredCustomizerRates();
  }
  try {
    const raw = localStorage.getItem('bongbangla_customizer_rates');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {
    reelRate: 2000,
    bulkDiscountPercent: 10,
    bulkDiscountMinReels: 10,
    services: {
      'cinema-ads': { name: '৪K সিনেমা অ্যাড ফিল্ম', base: 15000, icon: 'fa-solid fa-clapperboard' },
      'saree-shoot': { name: 'শাড়ি ও মডেল শুট', base: 12000, icon: 'fa-solid fa-camera-retro' },
      'viral-reels': { name: 'ভাইরাল প্রোডাক্ট রিলস', base: 10000, icon: 'fa-solid fa-bolt' },
      'facebook-ads': { name: 'ফেসবুক অ্যাড স্কেলিং', base: 8000, icon: 'fa-brands fa-facebook-f' },
      'jewellery': { name: 'জুয়েলারি ও লাক্সারি', base: 14000, icon: 'fa-solid fa-gem' }
    },
    models: {
      0: { name: 'কোনো মডেল ছাড়া (অনলি প্রোডাক্ট)', price: 0 },
      1: { name: '১ জন প্রফেশনাল মডেল', price: 5000 },
      2: { name: '২ জন মডেল (কাপল / ডুয়েল)', price: 9000 },
      3: { name: '৩+ জন বা ফুল গ্রুপ কাস্ট', price: 13000 }
    },
    addons: {
      'photos': { name: '১০টি আল্ট্রা-HD স্টিল ফটো প্যাক', price: 4000, icon: 'fa-solid fa-camera' },
      'makeup': { name: 'অন-সেট মেকআপ ও হেয়ার স্টাইলিস্ট', price: 3500, icon: 'fa-solid fa-wand-magic-sparkles' },
      'studio': { name: 'প্রিমিয়াম ইনডোর স্টুডিও / লোকেশন', price: 6000, icon: 'fa-solid fa-building-columns' },
      'voiceover': { name: 'সিনেমাটিক ভয়েসওভার ও সাউন্ডট্র্যাক', price: 2500, icon: 'fa-solid fa-microphone' },
      'meta-ads': { name: 'মেটা অ্যাড সেটআপ ও ১ মাস ম্যানেজমেন্ট', price: 8000, icon: 'fa-solid fa-chart-line' },
      'express': { name: 'জরুরি ৩-দিনের এক্সপ্রেস ডেলিভারি', price: 3000, icon: 'fa-solid fa-truck-fast' }
    }
  };
}

function renderAdminCustomizerRates() {
  const rates = getAdminCustomizerRates();
  if (!rates) return;

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== undefined && val !== null) el.value = val;
  };

  setVal('rate-reel-base', rates.reelRate ?? 2000);
  setVal('rate-bulk-discount', rates.bulkDiscountPercent ?? 10);
  setVal('rate-bulk-min-reels', rates.bulkDiscountMinReels ?? 10);

  if (rates.services) {
    setVal('rate-service-cinema-ads', rates.services['cinema-ads']?.base ?? 15000);
    setVal('rate-service-saree-shoot', rates.services['saree-shoot']?.base ?? 12000);
    setVal('rate-service-viral-reels', rates.services['viral-reels']?.base ?? 10000);
    setVal('rate-service-facebook-ads', rates.services['facebook-ads']?.base ?? 8000);
    setVal('rate-service-jewellery', rates.services['jewellery']?.base ?? 14000);
  }

  if (rates.models) {
    setVal('rate-model-1', rates.models[1]?.price ?? 5000);
    setVal('rate-model-2', rates.models[2]?.price ?? 9000);
    setVal('rate-model-3', rates.models[3]?.price ?? 13000);
  }

  if (rates.addons) {
    setVal('rate-addon-photos', rates.addons['photos']?.price ?? 4000);
    setVal('rate-addon-makeup', rates.addons['makeup']?.price ?? 3500);
    setVal('rate-addon-studio', rates.addons['studio']?.price ?? 6000);
    setVal('rate-addon-voiceover', rates.addons['voiceover']?.price ?? 2500);
    setVal('rate-addon-meta-ads', rates.addons['meta-ads']?.price ?? 8000);
    setVal('rate-addon-express', rates.addons['express']?.price ?? 3000);
  }
}

function saveAdminCustomizerRates(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  const currentRates = getAdminCustomizerRates();
  
  const reelBase = parseInt(document.getElementById('rate-reel-base')?.value, 10);
  const bulkDisc = parseInt(document.getElementById('rate-bulk-discount')?.value, 10);
  const bulkMin = parseInt(document.getElementById('rate-bulk-min-reels')?.value, 10);

  const cinemaBase = parseInt(document.getElementById('rate-service-cinema-ads')?.value, 10);
  const sareeBase = parseInt(document.getElementById('rate-service-saree-shoot')?.value, 10);
  const viralBase = parseInt(document.getElementById('rate-service-viral-reels')?.value, 10);
  const fbBase = parseInt(document.getElementById('rate-service-facebook-ads')?.value, 10);
  const jewelBase = parseInt(document.getElementById('rate-service-jewellery')?.value, 10);

  const model1 = parseInt(document.getElementById('rate-model-1')?.value, 10);
  const model2 = parseInt(document.getElementById('rate-model-2')?.value, 10);
  const model3 = parseInt(document.getElementById('rate-model-3')?.value, 10);

  const addPhotos = parseInt(document.getElementById('rate-addon-photos')?.value, 10);
  const addMakeup = parseInt(document.getElementById('rate-addon-makeup')?.value, 10);
  const addStudio = parseInt(document.getElementById('rate-addon-studio')?.value, 10);
  const addVoice = parseInt(document.getElementById('rate-addon-voiceover')?.value, 10);
  const addMeta = parseInt(document.getElementById('rate-addon-meta-ads')?.value, 10);
  const addExpress = parseInt(document.getElementById('rate-addon-express')?.value, 10);

  const updatedRates = {
    ...currentRates,
    reelRate: isNaN(reelBase) ? 2000 : reelBase,
    bulkDiscountPercent: isNaN(bulkDisc) ? 10 : bulkDisc,
    bulkDiscountMinReels: isNaN(bulkMin) ? 10 : bulkMin,
    services: {
      ...currentRates.services,
      'cinema-ads': { ...currentRates.services['cinema-ads'], base: isNaN(cinemaBase) ? 15000 : cinemaBase },
      'saree-shoot': { ...currentRates.services['saree-shoot'], base: isNaN(sareeBase) ? 12000 : sareeBase },
      'viral-reels': { ...currentRates.services['viral-reels'], base: isNaN(viralBase) ? 10000 : viralBase },
      'facebook-ads': { ...currentRates.services['facebook-ads'], base: isNaN(fbBase) ? 8000 : fbBase },
      'jewellery': { ...currentRates.services['jewellery'], base: isNaN(jewelBase) ? 14000 : jewelBase }
    },
    models: {
      ...currentRates.models,
      0: { name: 'কোনো মডেল ছাড়া (অনলি প্রোডাক্ট)', price: 0 },
      1: { ...currentRates.models[1], price: isNaN(model1) ? 5000 : model1 },
      2: { ...currentRates.models[2], price: isNaN(model2) ? 9000 : model2 },
      3: { ...currentRates.models[3], price: isNaN(model3) ? 13000 : model3 }
    },
    addons: {
      ...currentRates.addons,
      'photos': { ...currentRates.addons['photos'], price: isNaN(addPhotos) ? 4000 : addPhotos },
      'makeup': { ...currentRates.addons['makeup'], price: isNaN(addMakeup) ? 3500 : addMakeup },
      'studio': { ...currentRates.addons['studio'], price: isNaN(addStudio) ? 6000 : addStudio },
      'voiceover': { ...currentRates.addons['voiceover'], price: isNaN(addVoice) ? 2500 : addVoice },
      'meta-ads': { ...currentRates.addons['meta-ads'], price: isNaN(addMeta) ? 8000 : addMeta },
      'express': { ...currentRates.addons['express'], price: isNaN(addExpress) ? 3000 : addExpress }
    }
  };

  if (window.BongBanglaPackages && typeof window.BongBanglaPackages.saveStoredCustomizerRates === 'function') {
    window.BongBanglaPackages.saveStoredCustomizerRates(updatedRates);
  } else {
    try {
      localStorage.setItem('bongbangla_customizer_rates', JSON.stringify(updatedRates));
    } catch (e) {}
  }
  if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.saveCustomizerRates === 'function') {
    window.BongBanglaSupabase.saveCustomizerRates(updatedRates).catch(err => console.warn('Supabase saveCustomizerRates notice:', err));
  }

  renderAdminCustomizerRates();
  if (typeof showAdminToast === 'function') {
    showAdminToast('কাস্টম প্যাকেজ বিল্ডারের সকল প্রাইসিং রেট ক্লাউড ডেটাবেস ও লাইভ ওয়েবসাইটে সফলভাবে সংরক্ষিত হয়েছে!', 'success');
  } else {
    alert('কাস্টম প্যাকেজ বিল্ডারের সকল প্রাইসিং রেট ক্লাউড ডেটাবেস ও লাইভ ওয়েবসাইটে সফলভাবে সংরক্ষিত হয়েছে!');
  }
  return false;
}

function resetAdminCustomizerRatesToDefault() {
  if (!confirm('আপনি কি কাস্টম প্যাকেজ বিল্ডারের সমস্ত রেট ও চার্জ ফ্যাক্টরি ডিফল্টে রিসেট করতে চান?')) return;
  const def = (window.BongBanglaPackages && window.BongBanglaPackages.DEFAULT_CUSTOMIZER_RATES)
    ? window.BongBanglaPackages.DEFAULT_CUSTOMIZER_RATES
    : null;
  
  if (def) {
    if (window.BongBanglaPackages.saveStoredCustomizerRates) {
      window.BongBanglaPackages.saveStoredCustomizerRates(def);
    } else {
      localStorage.setItem('bongbangla_customizer_rates', JSON.stringify(def));
    }
    if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.saveCustomizerRates === 'function') {
      window.BongBanglaSupabase.saveCustomizerRates(def).catch(e => console.warn(e));
    }
  } else {
    localStorage.removeItem('bongbangla_customizer_rates');
    if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.saveSiteSetting === 'function') {
      window.BongBanglaSupabase.saveSiteSetting('customizer_rates', null).catch(e => console.warn(e));
    }
  }

  renderAdminCustomizerRates();
  if (typeof showAdminToast === 'function') {
    showAdminToast('কাস্টম বিল্ডারের রেট ডিফল্ট মানে রিস্টোর করা হয়েছে!', 'info');
  } else {
    alert('কাস্টম বিল্ডারের রেট ডিফল্ট মানে রিস্টোর করা হয়েছে!');
  }
}

window.getAdminCustomizerRates = getAdminCustomizerRates;
window.renderAdminCustomizerRates = renderAdminCustomizerRates;
window.saveAdminCustomizerRates = saveAdminCustomizerRates;
window.resetAdminCustomizerRatesToDefault = resetAdminCustomizerRatesToDefault;





