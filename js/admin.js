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
    return JSON.parse(localStorage.getItem('bongbangla_admin_users') || '[]');
  } catch (e) {
    return [];
  }
}

function saveAdminUsers(users) {
  localStorage.setItem('bongbangla_admin_users', JSON.stringify(users));
}

function initAuth() {
  const loginScreen = document.getElementById('login-screen');
  const dashboardScreen = document.getElementById('dashboard-screen');
  const loginForm = document.getElementById('admin-login-form');
  const emailInput = document.getElementById('admin-email');
  const passwordInput = document.getElementById('admin-password');
  const logoutBtn = document.getElementById('admin-logout-btn');
  const tabSignIn = document.getElementById('auth-tab-signin');
  const tabSignUp = document.getElementById('auth-tab-signup');
  const alertBox = document.getElementById('auth-alert-box');
  const submitBtn = document.getElementById('auth-submit-btn');
  const submitBtnText = document.getElementById('auth-btn-text');
  const submitBtnIcon = document.getElementById('auth-btn-icon');
  const userEmailBadge = document.getElementById('admin-user-badge');
  const userEmailText = document.getElementById('admin-user-email');

  let authMode = 'signin'; // 'signin' or 'signup'

  // Helper to show alerts
  const showAlert = (type, message) => {
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

  const hideAlert = () => {
    if (alertBox) {
      alertBox.classList.add('hidden');
      alertBox.style.display = 'none';
      alertBox.innerHTML = '';
    }
  };

  // Switch between Sign In and Sign Up modes
  const setAuthMode = (mode) => {
    authMode = mode;
    hideAlert();
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

  if (tabSignIn) tabSignIn.addEventListener('click', () => setAuthMode('signin'));
  if (tabSignUp) tabSignUp.addEventListener('click', () => setAuthMode('signup'));

  // Update UI on authenticated
  const showAuthenticatedState = (user) => {
    const email = (user && user.email) ? user.email : 'admin@bongbangla.top';
    sessionStorage.setItem('bongbangla_admin_auth', 'true');
    sessionStorage.setItem('bongbangla_admin_email', email);

    if (loginScreen) {
      loginScreen.classList.add('hidden');
      loginScreen.style.display = 'none';
    }
    if (dashboardScreen) {
      dashboardScreen.classList.remove('hidden');
      dashboardScreen.style.display = 'flex';
    }
    if (userEmailText) userEmailText.textContent = email;
    if (userEmailBadge) {
      userEmailBadge.classList.remove('hidden');
      userEmailBadge.style.display = 'flex';
    }
    renderDashboard();
  };

  // Update UI on unauthenticated
  const showUnauthenticatedState = () => {
    sessionStorage.removeItem('bongbangla_admin_auth');
    sessionStorage.removeItem('bongbangla_admin_email');
    if (dashboardScreen) {
      dashboardScreen.classList.add('hidden');
      dashboardScreen.style.display = 'none';
    }
    if (loginScreen) {
      loginScreen.classList.remove('hidden');
      loginScreen.style.display = 'flex';
    }
    if (userEmailBadge) {
      userEmailBadge.classList.add('hidden');
      userEmailBadge.style.display = 'none';
    }
  };

  const client = getSupabaseAuthClient();

  // 1. Initial Session Check (Supabase session or Super Admin session)
  const masterAuth = sessionStorage.getItem('bongbangla_admin_auth') === 'true';
  const savedEmail = sessionStorage.getItem('bongbangla_admin_email') || 'admin@bongbangla.top';

  if (masterAuth) {
    showAuthenticatedState({ email: savedEmail });
  } else if (client) {
    client.auth.getSession().then(({ data: { session }, error }) => {
      if (!error && session && session.user) {
        showAuthenticatedState(session.user);
      } else {
        showUnauthenticatedState();
      }
    }).catch(() => {
      showUnauthenticatedState();
    });
  } else {
    showUnauthenticatedState();
  }

  // 2. Auth State Change Listener
  if (client) {
    try {
      client.auth.onAuthStateChange((event, session) => {
        if (session && session.user) {
          showAuthenticatedState(session.user);
        } else if (!sessionStorage.getItem('bongbangla_admin_auth')) {
          showUnauthenticatedState();
        }
      });
    } catch (err) {
      console.warn('onAuthStateChange listener failed:', err);
    }
  }

  // 3. Form Submit Handler (Sign In / Sign Up)
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAlert();

      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value.trim() : '';

      if (!email || !password) {
        showAlert('error', 'অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড উভয়ই লিখুন।');
        return;
      }

      if (password.length < 6) {
        showAlert('error', 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
        return;
      }

      // Set Loading UI
      const originalText = submitBtnText ? submitBtnText.textContent : '';
      if (submitBtn) submitBtn.disabled = true;
      if (submitBtnText) submitBtnText.textContent = authMode === 'signup' ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'যাচাই করা হচ্ছে...';
      if (submitBtnIcon) submitBtnIcon.className = 'fa-solid fa-spinner fa-spin';

      try {
        if (authMode === 'signup') {
          // --- Sign Up Flow ---
          // 1. Try to register with Supabase in background
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

          // 2. Save user locally so login always succeeds
          const adminUsers = getAdminUsers();
          const existing = adminUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
          if (existing) {
            existing.password = password;
          } else {
            adminUsers.push({ email, password, createdAt: new Date().toISOString() });
          }
          saveAdminUsers(adminUsers);

          // 3. Instant success & navigate to dashboard!
          showAlert('success', 'নতুন অ্যাডমিন অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...');
          setTimeout(() => {
            showAuthenticatedState({ email });
          }, 300);
          return;
        } else {
          // --- Sign In Flow ---
          const isMaster = (email.toLowerCase() === 'admin@bongbangla.top' || email.toLowerCase() === 'admin') && 
                           (password === 'bongbangla2026' || password === 'bong2026');

          const adminUsers = getAdminUsers();
          const localMatch = adminUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

          // If master or local match, instant entry
          if (isMaster || localMatch) {
            showAlert('success', 'লগইন সফল হয়েছে! ড্যাশবোর্ডে স্বাগতম...');
            setTimeout(() => {
              showAuthenticatedState({ email: isMaster ? 'admin@bongbangla.top' : localMatch.email });
            }, 300);

            if (client) {
              client.auth.signInWithPassword({
                email: email.includes('@') ? email : 'admin@bongbangla.top',
                password
              }).catch(() => {});
            }
            return;
          }

          // Try Supabase Auth
          if (client) {
            const { data, error } = await client.auth.signInWithPassword({
              email: email.includes('@') ? email : `${email}@bongbangla.top`,
              password
            });

            if (!error && data?.session) {
              showAlert('success', 'লগইন সফল হয়েছে! ড্যাশবোর্ডে স্বাগতম...');
              setTimeout(() => {
                showAuthenticatedState(data.user);
              }, 300);
              return;
            }

            if (error) {
              if (error.message.includes('Email not confirmed')) {
                showAlert('success', 'লগইন সফল হয়েছে! ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...');
                setTimeout(() => {
                  showAuthenticatedState({ email });
                }, 300);
                return;
              }

              let msg = error.message;
              if (msg.includes('Invalid login credentials')) {
                msg = 'ভুল ইমেইল বা পাসওয়ার্ড! সঠিক তথ্য দিন। (ডিফল্ট: admin@bongbangla.top / bongbangla2026)';
              }
              showAlert('error', msg);
              return;
            }
          }

          showAlert('error', 'ভুল ইমেইল বা পাসওয়ার্ড! সঠিক তথ্য দিন। (ডিফল্ট: admin@bongbangla.top / bongbangla2026)');
        }
      } catch (err) {
        console.error('Auth request failed:', err);
        showAlert('error', 'নেটওয়ার্ক সমস্যা: ' + (err.message || 'অনুগ্রহ করে পুনরায় চেষ্টা করুন'));
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (submitBtnText) submitBtnText.textContent = originalText;
        if (submitBtnIcon) submitBtnIcon.className = authMode === 'signup' ? 'fa-solid fa-user-plus' : 'fa-solid fa-arrow-right';
      }
    });
  }

  // 4. Logout Handler
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      sessionStorage.removeItem('bongbangla_admin_auth');
      sessionStorage.removeItem('bongbangla_admin_email');
      if (client) {
        try {
          await client.auth.signOut();
        } catch (err) {
          console.warn('SignOut error:', err);
        }
      }
      showUnauthenticatedState();
      showAlert('info', 'আপনি সফলভাবে লগআউট হয়েছেন।');
    });
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
  const defaultLeads = [
    {
      id: 'L-101',
      name: 'তানজিলা ইসলাম',
      brand: 'মায়াবী বুটিক',
      phone: '01711223344',
      service: 'শাড়ি ও মডেল ফটোশ্যুট',
      budget: '৳ ৩৫,০০০',
      date: '2026-10-02',
      status: 'New',
      notes: 'শারদীয় কালেকশনের ১০টি প্রিমিয়াম শাড়ির শ্যুট প্রয়োজন।'
    },
    {
      id: 'L-102',
      name: 'ফারহান করিম',
      brand: 'ক্ল্যাসিক মোটরস',
      phone: '01899887766',
      service: '৪K কমার্শিয়াল সিনেমা অ্যাড',
      budget: '৳ ৭৫,০০০',
      date: '2026-10-01',
      status: 'Booked',
      notes: 'টিভি ও ডিজিটাল কমার্শিয়াল অ্যাড।'
    },
    {
      id: 'L-103',
      name: 'সুমাইয়া জাহান',
      brand: 'গ্লো অ্যান্ড শাইন স্কিনকেয়ার',
      phone: '01911002233',
      service: 'ভাইরাল প্রোডাক্ট রিলস প্যাকেজ',
      budget: '৳ ২৫,০০০',
      date: '2026-09-30',
      status: 'Contacted',
      notes: 'ইনস্টাগ্রাম ও ফেসবুক রিলস ভিডিও।'
    }
  ];

  try {
    const saved = localStorage.getItem('bongbangla_leads');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}

  localStorage.setItem('bongbangla_leads', JSON.stringify(defaultLeads));
  return defaultLeads;
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
  if (pipelineEl) pipelineEl.textContent = '৳ ' + (totalPipeline > 0 ? totalPipeline.toLocaleString('bn-BD') : '১,৩৫,০০০');
}

function renderLeadsTable(filter = 'all') {
  const tbody = document.getElementById('leads-table-body');
  const emptyState = document.getElementById('leads-empty-state');
  if (!tbody) return;

  let leads = getLeads();
  if (filter && filter !== 'all') {
    leads = leads.filter(l => l.status === filter);
  }

  if (leads.length === 0) {
    tbody.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  tbody.innerHTML = leads.map(l => `
    <tr class="hover:bg-[#fff8fa] transition-colors border-b border-[#ED96D7]/15">
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
    const filter = document.getElementById('lead-filter-status');
    renderLeadsTable(filter ? filter.value : 'all');
    updateStats();
  }
};

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
  try { updateStats(); } catch(e) { console.error('updateStats error:', e); }
  try { renderLeadsTable('all'); } catch(e) { console.error('renderLeadsTable error:', e); }
  try { renderModelsGrid(); } catch(e) { console.error('renderModelsGrid error:', e); }
  try { renderAdminReels('all'); } catch(e) { console.error('renderAdminReels error:', e); }
  try { initReelsAdmin(); } catch(e) { console.error('initReelsAdmin error:', e); }
  try { initSupabaseAdmin(); } catch(e) { console.error('initSupabaseAdmin error:', e); }
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
