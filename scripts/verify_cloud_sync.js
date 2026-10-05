const fs = require('fs');
const path = require('path');
const vm = require('vm');

function createBrowserEnv(deviceName) {
  const store = {};
  const mockLocalStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); }
  };

  const windowObj = {
    location: { search: '', replace: () => {} },
    document: { readyState: 'complete', addEventListener: () => {} }
  };
  windowObj.window = windowObj;
  windowObj.self = windowObj;
  windowObj.localStorage = mockLocalStorage;
  windowObj.WebSocket = global.WebSocket;

  const sandbox = {
    window: windowObj,
    self: windowObj,
    globalThis: windowObj,
    document: windowObj.document,
    localStorage: mockLocalStorage,
    console: {
      log: (...args) => console.log(`[${deviceName}]`, ...args),
      warn: (...args) => console.warn(`[${deviceName}]`, ...args),
      error: (...args) => console.error(`[${deviceName}]`, ...args)
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
  const supabaseMinCode = fs.readFileSync(path.join(__dirname, '../js/supabase.min.js'), 'utf8');
  vm.runInContext(supabaseMinCode, sandbox);
  if (!windowObj.supabase && sandbox.supabase) {
    windowObj.supabase = sandbox.supabase;
  }

  // 2. Run supabase-config.js
  const configCode = fs.readFileSync(path.join(__dirname, '../js/supabase-config.js'), 'utf8');
  vm.runInContext(configCode, sandbox);

  // 3. Run supabase-client.js
  const clientCode = fs.readFileSync(path.join(__dirname, '../js/supabase-client.js'), 'utf8');
  vm.runInContext(clientCode, sandbox);

  return { sandbox, mockLocalStorage };
}

async function runMultiDeviceVerification() {
  console.log('===============================================================');
  console.log('   BongBangla Multi-Device / Clean Browser Cloud Sync Test     ');
  console.log('===============================================================\n');

  // Device 1: PC Chrome Browser
  console.log('--- Step 1: Initializing Device 1 (PC Chrome Admin) ---');
  const dev1 = createBrowserEnv('Device-1-PC');
  const sbDev1 = dev1.sandbox.window.BongBanglaSupabase;
  await sbDev1.ensureClient();
  console.log('Device 1 connected to Supabase Cloud:', sbDev1.isConfigured());

  // Upload test reel from Device 1
  const testReelId = 'reel-sync-test-' + Date.now();
  console.log('\n--- Step 2: Device 1 Uploads a New Reel to Cloud ---');
  await sbDev1.addReel({
    id: testReelId,
    category: 'viral-reels',
    title: 'Multi-Device Test Reel - 4K Luxury',
    client: 'Test Brand BD',
    tag: '4K CINEMA',
    views: '২.৫M ভিউজ',
    videoUrl: 'https://api.bongbangla.top/vault-api/share.php?t=test_token',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  });
  console.log('Device 1 successfully uploaded reel:', testReelId);

  // Device 1 submits a lead with brand
  const testLeadId1 = 'L-test-' + Date.now() + '-1';
  console.log('\n--- Step 3: Device 1 Submits Lead to Cloud ---');
  await sbDev1.submitLead({
    id: testLeadId1,
    name: 'Tamim Iqbal',
    brand: 'Royal Velvet BD',
    phone: '01711111111',
    service: 'Cinema Commercial Ads',
    budget: '৳ ৫০,০০০'
  });
  console.log('Device 1 submitted lead:', testLeadId1);

  // Device 2: A brand-new mobile browser with ZERO cached data (empty localStorage)
  console.log('\n--- Step 4: Initializing Device 2 (Brand-New Mobile Browser - Empty Cache) ---');
  const dev2 = createBrowserEnv('Device-2-Mobile');
  const sbDev2 = dev2.sandbox.window.BongBanglaSupabase;
  await sbDev2.ensureClient();
  console.log('Device 2 connected to Supabase Cloud:', sbDev2.isConfigured());

  // Device 2 fetches models from Cloud
  console.log('\n--- Step 5: Device 2 Fetches Models from Cloud (Testing Clean Browser State) ---');
  const dev2Models = await sbDev2.fetchModels();
  console.log(`Device 2 retrieved ${dev2Models.length} models:`);
  dev2Models.forEach(m => {
    console.log(`  - ${m.name} (${m.category}) | Height: ${m.height} | Shoots: ${m.shoots} | Gallery: ${m.gallery ? m.gallery.length : 0} items`);
  });
  if (dev2Models.length < 3) {
    throw new Error('Device 2 failed to retrieve all 3 models from Supabase Cloud!');
  }

  // Device 2 fetches reels from Cloud
  console.log('\n--- Step 6: Device 2 Fetches Reels (Checking if Reel Uploaded by Device 1 Appears) ---');
  const dev2Reels = await sbDev2.fetchReels('all');
  console.log(`Device 2 retrieved ${dev2Reels.length} reels from cloud.`);
  const foundReel = dev2Reels.find(r => r.id === testReelId);
  if (!foundReel) {
    throw new Error(`Device 2 did NOT see the reel (${testReelId}) uploaded from Device 1!`);
  }
  console.log('✅ PASS: Device 2 successfully received the reel uploaded from Device 1:', foundReel.title);

  // Device 2 submits a quick lead WITHOUT brand (testing the NOT NULL fix)
  console.log('\n--- Step 7: Device 2 Submits Quick Lead Without Brand (Testing NOT NULL fix) ---');
  const testLeadId2 = 'L-test-' + Date.now() + '-2';
  await sbDev2.submitLead({
    id: testLeadId2,
    name: 'Nusrat Faria',
    phone: '01822222222',
    service: 'Saree Shoot Booking'
  });
  console.log('Device 2 submitted lead:', testLeadId2);

  // Device 1 fetches leads to verify it can see Device 2's submission
  console.log('\n--- Step 8: Device 1 Fetches Leads (Checking if Device 2\'s Lead is Visible) ---');
  const dev1Leads = await sbDev1.fetchLeads();
  const foundLead2 = dev1Leads.find(l => l.id === testLeadId2);
  if (!foundLead2) {
    throw new Error(`Device 1 did NOT see the lead (${testLeadId2}) submitted from Device 2!`);
  }
  console.log('✅ PASS: Device 1 successfully saw the lead submitted by Device 2:', foundLead2.name, 'Brand:', foundLead2.brand);

  // Cleanup: Delete test reel and test leads from Supabase so database stays clean
  console.log('\n--- Step 9: Cleaning up test artifacts from cloud database ---');
  await sbDev1.deleteReel(testReelId);
  await sbDev1.deleteLead(testLeadId1);
  await sbDev1.deleteLead(testLeadId2);
  console.log('✅ Cleanup completed cleanly.');

  console.log('\n===============================================================');
  console.log('🎉 ALL MULTI-DEVICE & CLOUD PERSISTENCE TESTS PASSED 100%!   ');
  console.log('   Data is fully cloud-synced across devices and browsers!     ');
  console.log('===============================================================\n');
}

runMultiDeviceVerification().catch(err => {
  console.error('\n❌ VERIFICATION TEST FAILED:', err);
  process.exit(1);
});
