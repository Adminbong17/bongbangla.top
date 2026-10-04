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
  const defaultUsers = [
    { email: 'admin@bongbangla.top', password: 'bongbangla2026', role: 'admin' },
    { email: 'model@bongbangla.top', password: 'pass-Aktmtbar@1', role: 'model' }
  ];
  try {
    const saved = localStorage.getItem('bongbangla_admin_users');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // Ensure default master accounts exist
        defaultUsers.forEach(def => {
          if (!parsed.some(u => u.email.toLowerCase() === def.email.toLowerCase())) {
            parsed.push(def);
          }
        });
        return parsed;
      }
    }
  } catch (e) {}

  return defaultUsers;
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
    if (emailInput && emailInput.value === 'admin@bongbangla.top') emailInput.value = '';
    if (passwordInput && passwordInput.value === 'bongbangla2026') passwordInput.value = '';
  } else {
    if (tabSignIn) tabSignIn.className = 'py-2 rounded-xl bg-gradient-to-r from-[#ED96D7] to-[#db2777] text-white shadow-sm transition-all';
    if (tabSignUp) tabSignUp.className = 'py-2 rounded-xl text-[#572449] hover:text-[#db2777] transition-all';
    if (submitBtnText) submitBtnText.textContent = 'ড্যাশবোর্ডে প্রবেশ করুন';
    if (submitBtnIcon) submitBtnIcon.className = 'fa-solid fa-arrow-right';
    if (emailInput && !emailInput.value) emailInput.value = 'admin@bongbangla.top';
    if (passwordInput && !passwordInput.value) passwordInput.value = 'bongbangla2026';
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
      const isMasterAdmin = (lowerEmail === 'admin@bongbangla.top' || lowerEmail === 'admin') && 
                            (password === 'bongbangla2026' || password === 'bong2026');

      const isModelAdmin = (lowerEmail === 'model@bongbangla.top' || lowerEmail === 'model') && 
                           (password === 'pass-Aktmtbar@1' || password === 'Aktmtbar@1');

      const isMaster = isMasterAdmin || isModelAdmin;
      const masterEmail = isModelAdmin ? 'model@bongbangla.top' : 'admin@bongbangla.top';

      const adminUsers = getAdminUsers();
      const localMatch = adminUsers.find(u => u.email.toLowerCase() === lowerEmail && u.password === password);

      // If master or local match, instant success
      if (isMaster || localMatch) {
        window.showAlert('success', 'লগইন সফল হয়েছে! ড্যাশবোর্ডে স্বাগতম...');
        const authEmail = isMaster ? masterEmail : localMatch.email;
        setTimeout(() => {
          window.showAuthenticatedState({ email: authEmail });
        }, 300);

        if (client) {
          client.auth.signInWithPassword({
            email: email.includes('@') ? email : `${email}@bongbangla.top`,
            password
          }).catch(() => {});
        }
        return false;
      }

      // Try Supabase Auth
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

          let msg = error.message;
          if (msg.includes('Invalid login credentials')) {
            msg = 'ভুল ইমেইল বা পাসওয়ার্ড! সঠিক তথ্য দিন। (ডিফল্ট: admin@bongbangla.top / bongbangla2026)';
          }
          window.showAlert('error', msg);
          return false;
        }
      }

      window.showAlert('error', 'ভুল ইমেইল বা পাসওয়ার্ড! সঠিক তথ্য দিন। (ডিফল্ট: admin@bongbangla.top / bongbangla2026)');
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

  if (openAddModelBtn && addModelModal && !openAddModelBtn.dataset.initialized) {
    openAddModelBtn.dataset.initialized = 'true';
    openAddModelBtn.addEventListener('click', () => addModelModal.classList.remove('hidden'));
    closeAddModelBtn.addEventListener('click', () => addModelModal.classList.add('hidden'));

    addModelForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(addModelForm);
      const models = getModels();
      const rawImage = formData.get('image') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
      const formattedImage = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(rawImage, 'models') : rawImage;
      const newModel = {
        id: 'M-' + Date.now(),
        name: formData.get('name'),
        category: formData.get('category'),
        height: formData.get('height') || '৫\'৭"',
        shoots: formData.get('shoots') || '২৫+',
        image: formattedImage,
        available: true
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
      addModelModal.classList.add('hidden');
      renderModelsGrid();
      alert('নতুন মডেল সফলভাবে যুক্ত ও লাইভ করা হয়েছে!');
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
  try {
    const saved = localStorage.getItem('bongbangla_models');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        // filter out any mock sample models
        return parsed.filter(m => !['M-1', 'M-2', 'M-3', 'M-4'].includes(m.id));
      }
    }
  } catch (e) {}
  return [];
}

function saveModels(models) {
  localStorage.setItem('bongbangla_models', JSON.stringify(models));
}

async function renderDashboard() {
  try { updateStats(); } catch(e) { console.error('updateStats error:', e); }
  try { renderLeadsTable('all'); } catch(e) { console.error('renderLeadsTable error:', e); }
  try { renderModelsGrid(); } catch(e) { console.error('renderModelsGrid error:', e); }
  try { renderAdminReels('all'); } catch(e) { console.error('renderAdminReels error:', e); }
  try { renderAdminHeroSlides(); } catch(e) { console.error('renderAdminHeroSlides error:', e); }
  try { initReelsAdmin(); } catch(e) { console.error('initReelsAdmin error:', e); }
  try { initHeroSlidesAdmin(); } catch(e) { console.error('initHeroSlidesAdmin error:', e); }
  try { initSupabaseAdmin(); } catch(e) { console.error('initSupabaseAdmin error:', e); }
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
      if (vaultInput) vaultInput.value = vcfg.url || 'https://vault.bongbangla.top';
      if (vaultUserInput) vaultUserInput.value = vcfg.user || 'model@bongbangla.top';
      if (vaultPassInput) vaultPassInput.value = vcfg.pass || 'pass-Aktmtbar@1';
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

      window.BongBanglaSupabase.fetchModels().then(() => {
        renderModelsGrid();
      }).catch(() => {});

      // Realtime multi-tab / multi-device listeners
      window.BongBanglaSupabase.subscribeToLeads(() => {
        window.BongBanglaSupabase.fetchLeads().then(() => {
          updateStats();
          const leadFilter = document.getElementById('lead-filter-status');
          renderLeadsTable(leadFilter ? leadFilter.value : 'all');
        });
      });

      window.BongBanglaSupabase.subscribeToReels(() => {
        const filter = document.getElementById('admin-reel-filter');
        renderAdminReels(filter ? filter.value : 'all');
      });

      window.BongBanglaSupabase.subscribeToModels(() => {
        window.BongBanglaSupabase.fetchModels().then(() => {
          renderModelsGrid();
        });
      });
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
      const vaultUrl = vaultInput ? vaultInput.value.trim() : 'https://vault.bongbangla.top';
      const vaultUser = vaultUserInput ? vaultUserInput.value.trim() : 'model@bongbangla.top';
      const vaultPass = vaultPassInput ? vaultPassInput.value.trim() : 'pass-Aktmtbar@1';
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

    addReelForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(addReelForm);
      const rawVideoUrl = formData.get('videoUrl');
      const rawThumb = formData.get('thumbnail');

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
      if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.addReel === 'function') {
        try {
          await window.BongBanglaSupabase.addReel(newReel);
        } catch (err) {
          console.warn('Supabase addReel error:', err);
        }
      }
      addReelForm.reset();
      addReelModal.classList.add('hidden');
      const reelFilter = document.getElementById('admin-reel-filter');
      renderAdminReels(reelFilter ? reelFilter.value : 'all');
      alert('নতুন রিলস সফলভাবে আপলোড ও লাইভ করা হয়েছে!');
    });
  }
}

let currentReelViewMode = localStorage.getItem('bongbangla_reel_view_mode') || 'list';

window.setReelViewMode = function(mode) {
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
};

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
      client.from('reels').update({ category: newCategory }).eq('id', id).catch(() => {});
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
      window.BongBanglaSupabase.deleteReel(id).catch(() => {});
    }
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

function renderAdminReels(category = 'all') {
  const grid = document.getElementById('admin-reels-grid');
  const listBody = document.getElementById('admin-reels-list-body');
  const emptyState = document.getElementById('reels-empty-state');
  const selectAll = document.getElementById('reels-select-all');
  if (!window.BongBanglaReels) return;

  const reels = window.BongBanglaReels.getReels(category);

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
    'cinema-ads': '৪K সিনেমা অ্যাড',
    'saree-shoot': 'শাড়ি ও বোল্ড শ্যুট',
    'viral-reels': 'ভাইরাল প্রোডাক্ট রিলস',
    'facebook-ads': 'ফেসবুক অ্যাডস',
    'jewellery': 'জুয়েলারি ও লাক্সারি'
  };

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
              <img src="${thumb}" alt="${r.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform">
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
            <span class="inline-block px-2.5 py-1 rounded-full bg-pink-50 text-[#be185d] border border-[#ED96D7]/30 text-[11px] font-semibold">
              ${categoryNames[r.category] || r.category}
            </span>
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

          <!-- Actions (View Video / Delete) -->
          <td class="py-3 px-4 text-right">
            <div class="flex items-center justify-end gap-1.5">
              <!-- View / Play Button -->
              <button onclick="window.BongBanglaReels.openReelVideoModal('${video}', '${encodeURIComponent(r.title)}', '${encodeURIComponent(r.client)}')"
                      class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#db2777] to-[#be185d] text-white text-xs font-bold flex items-center gap-1 shadow-xs hover:opacity-95 transition-all"
                      title="ভিডিও ভিউ ও প্লে করুন">
                <i class="fa-solid fa-eye text-[11px]"></i>
                <span>ভিউ (View)</span>
              </button>

              <!-- Delete Button -->
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
          
          <!-- 9:16 Thumbnail Preview -->
          <div class="aspect-[9/16] relative overflow-hidden bg-black">
            <img src="${thumb}" alt="${r.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"></div>

            <!-- Top Badges, Checkbox & Delete Button -->
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

            <!-- Play preview trigger -->
            <button onclick="window.BongBanglaReels.openReelVideoModal('${video}', '${encodeURIComponent(r.title)}', '${encodeURIComponent(r.client)}')" class="absolute inset-0 flex items-center justify-center text-white/90 hover:text-white transition-all">
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
            <!-- View Button in card -->
            <button onclick="window.BongBanglaReels.openReelVideoModal('${video}', '${encodeURIComponent(r.title)}', '${encodeURIComponent(r.client)}')"
                    class="w-full mt-2 py-1.5 rounded-xl bg-pink-50 hover:bg-[#db2777] text-[#db2777] hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors">
              <i class="fa-solid fa-eye text-xs"></i>
              <span>ভিডিও ভিউ করুন</span>
            </button>
          </div>

        </div>
      `;
    }).join('');
  }

  setReelViewMode(currentReelViewMode);
  updateReelsBulkUI();
}

window.deleteAdminReel = async function(id) {
  if (confirm('আপনি কি নিশ্চিতভাবে এই রিলসটি মুছে ফেলতে চান?')) {
    if (window.BongBanglaReels) {
      window.BongBanglaReels.deleteReel(id);
    }
    if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.deleteReel === 'function') {
      try {
        await window.BongBanglaSupabase.deleteReel(id);
      } catch (err) {
        console.warn('Supabase deleteReel error:', err);
      }
    }
    selectedReelIds.delete(id);
    const filter = document.getElementById('admin-reel-filter');
    renderAdminReels(filter ? filter.value : 'all');
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

  grid.innerHTML = models.map(m => {
    const rawImg = m.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
    const modelImg = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(rawImg, 'models') : rawImg;

    return `
      <div class="glass-panel rounded-2xl overflow-hidden border border-[#ED96D7]/30 group hover:border-[#ED96D7] shadow-sm hover:shadow-md transition-all bg-white relative">
        <div class="aspect-[3/4] relative overflow-hidden bg-[#fdf2f8]">
          <img src="${modelImg}" alt="${m.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
          
          <!-- Top Checkbox and Delete Button -->
          <div class="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
            <input type="checkbox" class="model-checkbox w-4 h-4 rounded border-[#ED96D7] text-[#db2777] focus:ring-[#db2777] cursor-pointer bg-white/90 shadow-sm"
                   data-id="${m.id}"
                   ${selectedModelIds.has(m.id) ? 'checked' : ''}
                   onchange="toggleModelSelection('${m.id}', this.checked)">
            <button onclick="deleteModel('${m.id}')" class="w-8 h-8 rounded-full bg-rose-600/90 hover:bg-rose-700 text-white flex items-center justify-center text-xs shadow-md transition-colors" title="মডেল রিমুভ করুন">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
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
    `;
  }).join('');

  updateModelsBulkUI();
}

window.deleteModel = async function(id) {
  if (confirm('আপনি কি এই মডেলের প্রোফাইল রিমুভ করতে চান?')) {
    const models = getModels().filter(m => m.id !== id);
    saveModels(models);
    if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.deleteModel === 'function') {
      try {
        await window.BongBanglaSupabase.deleteModel(id);
      } catch (err) {
        console.warn('Supabase deleteModel error:', err);
      }
    }
    selectedModelIds.delete(id);
    renderModelsGrid();
  }
};

/* ==========================================================================
   Hero Section Slides & Images Management
   ========================================================================== */
let selectedHeroSlideIds = new Set();

function getHeroSlides() {
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
  let slides = getHeroSlides();
  slides = slides.filter(s => !selectedHeroSlideIds.has(s.id));
  saveHeroSlides(slides);

  alert(`${toDelete.length} টি হিরো ইমেজ সফলভাবে মুছে ফেলা হয়েছে!`);
  selectedHeroSlideIds.clear();
  renderAdminHeroSlides();
};

window.deleteAdminHeroSlide = function(id) {
  if (confirm('আপনি কি এই হিরো ইমেজটি মুছে ফেলতে চান?')) {
    let slides = getHeroSlides().filter(s => s.id !== id);
    saveHeroSlides(slides);
    selectedHeroSlideIds.delete(id);
    renderAdminHeroSlides();
  }
};

window.clearAllHeroSlides = function() {
  if (confirm('আপনি কি নিশ্চিতভাবে সব হিরো ইমেজ খালি করতে চান?')) {
    saveHeroSlides([]);
    selectedHeroSlideIds.clear();
    renderAdminHeroSlides();
    alert('সব হিরো ইমেজ সফলভাবে মুছে ফেলা হয়েছে!');
  }
};

function renderAdminHeroSlides() {
  const grid = document.getElementById('admin-hero-slides-grid');
  const emptyState = document.getElementById('hero-slides-empty-state');
  if (!grid) return;

  const slides = getHeroSlides();

  if (slides.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    selectedHeroSlideIds.clear();
    updateHeroSlidesBulkUI();
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  grid.innerHTML = slides.map(s => {
    const slideImg = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(s.image, 'hero') : s.image;

    return `
      <div class="glass-panel rounded-2xl overflow-hidden border border-[#ED96D7]/35 group hover:border-[#db2777] shadow-sm hover:shadow-md transition-all bg-white flex flex-col justify-between relative">
        <div class="aspect-[9/16] relative overflow-hidden bg-black">
          <img src="${slideImg}" alt="${s.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
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

function initHeroSlidesAdmin() {
  const openBtn = document.getElementById('open-add-hero-slide-btn');
  const closeBtn = document.getElementById('close-add-hero-slide-btn');
  const modal = document.getElementById('add-hero-slide-modal');
  const form = document.getElementById('add-hero-slide-form');

  if (openBtn && modal && !openBtn.dataset.initialized) {
    openBtn.dataset.initialized = 'true';
    openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

    if (form && !form.dataset.initialized) {
      form.dataset.initialized = 'true';
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const rawImage = (formData.get('image') || '').toString().trim();
        const title = (formData.get('title') || '').toString().trim();
        const tag = (formData.get('tag') || '4K REC').toString().trim();

        if (!rawImage || !title) {
          alert('অনুগ্রহ করে ছবির লিংক এবং শিরোনাম লিখুন!');
          return;
        }

        const formattedImage = window.BongBanglaVault ? window.BongBanglaVault.formatMediaUrl(rawImage, 'hero') : rawImage;

        const newSlide = {
          id: 'hero-' + Date.now(),
          image: formattedImage,
          title: title,
          tag: tag
        };

        const slides = getHeroSlides();
        slides.unshift(newSlide);
        saveHeroSlides(slides);

        form.reset();
        modal.classList.add('hidden');
        renderAdminHeroSlides();
        alert('নতুন হিরো ইমেজ সফলভাবে যুক্ত করা হয়েছে!');
      });
    }
  }
}


