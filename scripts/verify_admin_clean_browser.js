const fs = require('fs');
const path = require('path');
const vm = require('vm');

function createAdminCleanBrowser() {
  const store = {};
  const mockLocalStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); }
  };

  const elements = {};
  function makeMockElement(id, tagName = 'div') {
    return {
      id,
      tagName: tagName.toUpperCase(),
      innerHTML: '',
      textContent: '',
      value: '',
      className: '',
      classList: {
        add: () => {},
        remove: () => {},
        toggle: () => {},
        contains: () => false
      },
      style: {
        setProperty: (k, v) => {},
        removeProperty: () => {}
      },
      dataset: {},
      addEventListener: () => {},
      focus: () => {},
      setSelectionRange: () => {}
    };
  }

  // Pre-populate key DOM elements needed by admin.js
  const keyIds = [
    'admin-models-grid',
    'insta-grab-model-select',
    'insta-selected-model-pill',
    'admin-leads-tbody',
    'admin-reels-grid',
    'admin-stat-leads',
    'admin-stat-reels',
    'admin-stat-models',
    'admin-stat-revenue',
    'lead-filter-status',
    'admin-reel-filter',
    'supabase-status-dot',
    'supabase-status-text'
  ];
  keyIds.forEach(id => { elements[id] = makeMockElement(id); });

  const windowObj = {
    location: { search: '', replace: () => {} },
    document: {
      readyState: 'complete',
      addEventListener: () => {},
      getElementById: (id) => elements[id] || makeMockElement(id),
      querySelectorAll: () => [],
      querySelector: () => null
    }
  };
  windowObj.window = windowObj;
  windowObj.self = windowObj;
  windowObj.localStorage = mockLocalStorage;
  windowObj.sessionStorage = mockLocalStorage;
  windowObj.WebSocket = global.WebSocket;

  const sandbox = {
    window: windowObj,
    self: windowObj,
    globalThis: windowObj,
    document: windowObj.document,
    localStorage: mockLocalStorage,
    sessionStorage: mockLocalStorage,
    console: {
      log: (...args) => console.log('[Clean-Admin-Browser]', ...args),
      warn: (...args) => console.warn('[Clean-Admin-Browser]', ...args),
      error: (...args) => console.error('[Clean-Admin-Browser]', ...args)
    },
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    Promise,
    Date,
    Array,
    Object,
    JSON,
    Math,
    String,
    Boolean,
    RegExp,
    encodeURIComponent,
    decodeURIComponent,
    URL: global.URL,
    URLSearchParams: global.URLSearchParams,
    Headers: global.Headers,
    Request: global.Request,
    Response: global.Response,
    WebSocket: global.WebSocket,
    fetch: global.fetch
  };

  vm.createContext(sandbox);

  // 1. Run local supabase.min.js
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/supabase.min.js'), 'utf8'), sandbox);
  if (!windowObj.supabase && sandbox.supabase) windowObj.supabase = sandbox.supabase;

  // 2. Run config & clients
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/vault-config.js'), 'utf8'), sandbox);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/supabase-config.js'), 'utf8'), sandbox);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/supabase-client.js'), 'utf8'), sandbox);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/reels.js'), 'utf8'), sandbox);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/admin.js'), 'utf8'), sandbox);

  return { sandbox, elements, mockLocalStorage };
}

async function verifyAdminCleanBrowser() {
  console.log('Testing Admin Panel on clean device (empty localStorage)...');
  const { sandbox, elements } = createAdminCleanBrowser();

  // Test renderDashboard eager sync
  await sandbox.renderDashboard();

  // Verify models returned by getModels()
  const models = sandbox.getModels();
  console.log(`Clean Browser getModels() returned ${models.length} models:`, models.map(m => m.name));
  if (models.length < 3) {
    throw new Error('Admin on clean browser failed to load models into memory!');
  }

  // Verify Instagram select dropdown
  sandbox.populateInstaModelSelect();
  const selectHtml = elements['insta-grab-model-select'].innerHTML;
  console.log('Instagram Model Select Dropdown Options HTML:');
  console.log(selectHtml);

  if (!selectHtml.includes('Taspia') || !selectHtml.includes('Neha Jaman') || !selectHtml.includes('Merina Islam Meghla')) {
    throw new Error('Instagram grabber model dropdown is missing models on clean browser!');
  }

  console.log('\n✅ PASS: Admin Panel and Instagram Grabber successfully show all cloud models on clean browser!');
}

verifyAdminCleanBrowser()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ Admin Clean Browser Test Failed:', err);
    process.exit(1);
  });
