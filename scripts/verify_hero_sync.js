const fs = require('fs');
const path = require('path');
const vm = require('vm');

function createMockBrowser(name = 'Browser') {
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
        display: 'block',
        setProperty: (k, v) => {},
        removeProperty: () => {}
      },
      dataset: {},
      addEventListener: () => {},
      appendChild: function(child) { this.children = this.children || []; this.children.push(child); }
    };
  }

  // Frontend & Admin DOM elements
  const keyIds = [
    'hero-slideshow-track',
    'hero-slideshow-container',
    'admin-hero-slides-grid',
    'hero-slides-empty-state',
    'hero-slides-count-badge',
    'hero-slides-bulk-actions'
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
      log: (...args) => console.log(`[${name}]`, ...args),
      warn: (...args) => console.warn(`[${name}]`, ...args),
      error: (...args) => console.error(`[${name}]`, ...args)
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

  vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/supabase.min.js'), 'utf8'), sandbox);
  if (!windowObj.supabase && sandbox.supabase) windowObj.supabase = sandbox.supabase;

  vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/vault-config.js'), 'utf8'), sandbox);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/supabase-config.js'), 'utf8'), sandbox);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/supabase-client.js'), 'utf8'), sandbox);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/reels.js'), 'utf8'), sandbox);

  return { sandbox, elements, mockLocalStorage };
}

async function verifyHeroSlidesSync() {
  console.log('====================================================');
  console.log('🧪 Starting Multi-Device Hero Slides Sync Verification');
  console.log('====================================================\n');

  // Device 1 (Admin Device)
  console.log('📱 [Device 1 - Admin Device] Initializing...');
  const device1 = createMockBrowser('Admin-Device-1');
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/admin.js'), 'utf8'), device1.sandbox);

  // Fetch current slides from cloud
  const initialSlides = await device1.sandbox.window.BongBanglaSupabase.fetchHeroSlides();
  console.log(`Initial slides count in Supabase: ${initialSlides.length}`);
  initialSlides.forEach(s => console.log(`  - [${s.id}] ${s.title} (${s.image.substring(0, 50)}...)`));

  // Device 1: Add a new test slide
  const testSlideId = 'hero-sync-test-' + Date.now();
  const testSlide = {
    id: testSlideId,
    title: 'স্পেশাল টেস্ট হিরো স্লাইড',
    tag: 'SYNC TEST',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=720&q=80'
  };

  console.log(`\n📤 [Device 1] Adding new hero slide: "${testSlide.title}" (ID: ${testSlide.id})...`);
  await device1.sandbox.window.BongBanglaSupabase.addHeroSlide(testSlide);
  console.log('✅ [Device 1] Hero slide added via BongBanglaSupabase.addHeroSlide()');

  // Device 2 (Completely fresh client / phone / laptop with 0 localStorage)
  console.log('\n💻 [Device 2 - Fresh Client Device] Initializing with completely empty localStorage...');
  const device2 = createMockBrowser('Client-Device-2');
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/main.js'), 'utf8'), device2.sandbox);

  // Fetch hero slides on Device 2
  console.log('📥 [Device 2] Fetching hero slides from Supabase Cloud...');
  const device2Slides = await device2.sandbox.window.BongBanglaSupabase.fetchHeroSlides();
  console.log(`Device 2 received ${device2Slides.length} slides from Supabase:`);
  device2Slides.forEach(s => console.log(`  - [${s.id}] ${s.title}`));

  // Assert Device 2 has the newly added test slide
  const foundInDevice2 = device2Slides.find(s => s.id === testSlideId);
  if (!foundInDevice2) {
    throw new Error(`Device 2 failed to receive the newly added slide ${testSlideId} from Cloud!`);
  }
  console.log('✨ [Device 2] CONFIRMED: Newly added slide exists in Device 2!');

  // Test frontend rendering on Device 2
  console.log('\n🎨 [Device 2] Executing renderFrontendHeroSlides(device2Slides)...');
  device2.sandbox.renderFrontendHeroSlides(device2Slides);
  const trackHtml = device2.elements['hero-slideshow-track'].innerHTML;
  console.log('Hero Track HTML preview on Device 2 (first 250 chars):');
  console.log(trackHtml.substring(0, 250) + '...');

  if (!trackHtml.includes('স্পেশাল টেস্ট হিরো স্লাইড')) {
    throw new Error('Device 2 frontend failed to render the new hero slide in DOM!');
  }
  console.log('✅ [Device 2] Frontend DOM rendered the new hero slide successfully!');

  // Device 1: Delete the test slide
  console.log(`\n🗑️ [Device 1] Cleaning up test slide ${testSlideId}...`);
  await device1.sandbox.window.BongBanglaSupabase.deleteHeroSlide(testSlideId);
  console.log('✅ [Device 1] Test slide deleted from Supabase.');

  // Device 3 (Another fresh device checking cleanup)
  console.log('\n📱 [Device 3 - Verification Device] Verifying deletion from Cloud...');
  const device3 = createMockBrowser('Verify-Device-3');
  const device3Slides = await device3.sandbox.window.BongBanglaSupabase.fetchHeroSlides();
  const deletedSlide = device3Slides.find(s => s.id === testSlideId);
  if (deletedSlide) {
    throw new Error('Test slide was not deleted from Supabase Cloud!');
  }
  console.log(`✅ [Device 3] Verified: Test slide is completely removed. Remaining cloud slides: ${device3Slides.length}`);

  console.log('\n====================================================');
  console.log('🎉 ALL MULTI-DEVICE HERO SYNC TESTS PASSED PERFECTLY!');
  console.log('====================================================\n');
}

verifyHeroSlidesSync().catch(err => {
  console.error('\n❌ Verification Failed:', err);
  process.exit(1);
});
