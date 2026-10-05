const fs = require('fs');
const path = require('path');
const vm = require('vm');

function createTestBrowser() {
  const elements = {};
  function makeMockElement(id, tagName = 'div') {
    const classListSet = new Set();
    let _innerHTML = '';
    const el = {
      id,
      tagName: tagName.toUpperCase(),
      get innerHTML() { return _innerHTML; },
      set innerHTML(val) {
        _innerHTML = val;
        // Parse all id="..." in val and instantiate mock elements
        const matches = [...val.matchAll(/id=["']([^"']+)["']/g)];
        matches.forEach(m => {
          const childId = m[1];
          if (!elements[childId]) {
            elements[childId] = makeMockElement(childId);
          }
        });
      },
      textContent: '',
      value: '',
      src: '',
      paused: true,
      className: '',
      dataset: {},
      style: {
        setProperty: () => {},
        removeProperty: () => {}
      },
      classList: {
        add: (...cls) => { cls.forEach(c => classListSet.add(c)); el.className = Array.from(classListSet).join(' '); },
        remove: (...cls) => { cls.forEach(c => classListSet.delete(c)); el.className = Array.from(classListSet).join(' '); },
        toggle: (c) => { if (classListSet.has(c)) classListSet.delete(c); else classListSet.add(c); el.className = Array.from(classListSet).join(' '); },
        contains: (c) => classListSet.has(c)
      },
      addEventListener: (event, handler) => {
        el.listeners = el.listeners || {};
        el.listeners[event] = el.listeners[event] || [];
        el.listeners[event].push(handler);
      },
      click: () => {
        if (el.listeners && el.listeners['click']) {
          const fakeEvent = {
            target: el,
            preventDefault: () => {},
            stopPropagation: () => {},
            closest: (sel) => {
              if (sel === '.open-booking-modal' && el.classList.contains('open-booking-modal')) return el;
              return null;
            }
          };
          el.listeners['click'].forEach(h => h(fakeEvent));
        }
      },
      pause: () => { el.paused = true; },
      play: () => { el.paused = false; return Promise.resolve(); },
      load: () => {},
      focus: () => { el.focused = true; },
      querySelector: (sel) => {
        if (sel.startsWith('#')) {
          const targetId = sel.substring(1);
          if (!elements[targetId]) elements[targetId] = makeMockElement(targetId);
          return elements[targetId];
        }
        if (sel === 'input[name="name"]') return elements['name-input'];
        if (sel === 'textarea[name="notes"]') return elements['notes-textarea'];
        return null;
      },
      querySelectorAll: () => []
    };
    return el;
  }

  // Pre-seed elements
  const bookingModal = makeMockElement('booking-modal');
  bookingModal.classList.add('hidden');
  elements['booking-modal'] = bookingModal;

  const modalServiceSelect = makeMockElement('modal-service-select', 'select');
  elements['modal-service-select'] = modalServiceSelect;

  const notesTextarea = makeMockElement('notes-textarea', 'textarea');
  elements['notes-textarea'] = notesTextarea;

  const nameInput = makeMockElement('name-input', 'input');
  elements['name-input'] = nameInput;

  const docListeners = {};
  const doc = {
    readyState: 'complete',
    body: {
      classList: {
        add: () => {},
        remove: () => {}
      },
      appendChild: (child) => {
        elements[child.id] = child;
      }
    },
    addEventListener: (event, handler) => {
      docListeners[event] = docListeners[event] || [];
      docListeners[event].push(handler);
    },
    getElementById: (id) => elements[id] || null,
    querySelector: (sel) => {
      if (sel.startsWith('#')) return elements[sel.substring(1)] || null;
      return null;
    },
    querySelectorAll: () => [],
    createElement: (tag) => {
      const el = makeMockElement('dynamic-' + Math.random().toString(36).substring(7), tag);
      return el;
    }
  };

  const mockLocalStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
  const windowObj = {
    document: doc,
    location: { href: '', search: '' },
    localStorage: mockLocalStorage,
    sessionStorage: mockLocalStorage
  };
  windowObj.window = windowObj;
  windowObj.self = windowObj;

  const sandbox = {
    window: windowObj,
    self: windowObj,
    globalThis: windowObj,
    document: doc,
    localStorage: mockLocalStorage,
    sessionStorage: mockLocalStorage,
    console: console,
    setTimeout: (fn) => fn(),
    clearTimeout: () => {},
    encodeURIComponent: global.encodeURIComponent,
    decodeURIComponent: global.decodeURIComponent,
    Date: global.Date,
    Array: global.Array,
    Object: global.Object,
    JSON: global.JSON,
    String: global.String,
    Math: global.Math
  };

  vm.createContext(sandbox);

  // Load scripts
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/vault-config.js'), 'utf8'), sandbox);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/reels.js'), 'utf8'), sandbox);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/main.js'), 'utf8'), sandbox);

  return { sandbox, elements, docListeners };
}

async function runTests() {
  console.log('🧪 Testing Reel Modal PC Responsive Layout & Booking Trigger...\n');

  const { sandbox, elements } = createTestBrowser();

  // Test 1: Open Reel Video Modal with sample video (e.g. MUMTAHINA RAW)
  console.log('Test 1: Opening reel video modal for "MUMTAHINA RAW"...');
  sandbox.window.BongBanglaReels.openReelVideoModal(
    'https://api.bongbangla.top/vault-api/share.php?t=sample_token',
    'MUMTAHINA RAW',
    'BongBangla Exclusive'
  );

  const reelModal = elements['reel-video-modal'];
  if (!reelModal) {
    throw new Error('Reel video modal was not created!');
  }
  if (reelModal.classList.contains('hidden')) {
    throw new Error('Reel modal remained hidden after openReelVideoModal()!');
  }
  console.log('✅ Reel video modal created and displayed.');

  // Test 2: Check PC responsive layout classes in HTML
  console.log('\nTest 2: Verifying PC responsive layout and bottom action bar...');
  const modalHtml = reelModal.innerHTML;

  // Check PC centered floating arrows
  if (!modalHtml.includes('top-1/2 -translate-y-1/2')) {
    throw new Error('Navigation arrows are not vertically centered with top-1/2 -translate-y-1/2!');
  }
  console.log('✅ Arrows are vertically centered with top-1/2 -translate-y-1/2 for PC.');

  // Check card max-h constraint
  if (!modalHtml.includes('max-h-[820px]') || !modalHtml.includes('h-[88vh]')) {
    throw new Error('Reel modal card is missing viewport height safety constraint (h-[88vh] max-h-[820px])!');
  }
  console.log('✅ Reel modal card constrained to h-[88vh] max-h-[820px] (will never overflow PC screen).');

  // Check bottom action bar flex-shrink-0
  if (!modalHtml.includes('flex-shrink-0 p-3.5 sm:p-4 bg-[#fff8fa]')) {
    throw new Error('Bottom action bar is missing flex-shrink-0!');
  }
  console.log('✅ Bottom action bar is flex-shrink-0 (buttons permanently anchored and visible on PC).');

  // Check booking button ID and text
  if (!modalHtml.includes('id="modal-reel-book-btn"') || !modalHtml.includes('এইরকম শুটিং বুক করুন')) {
    throw new Error('Booking button with ID modal-reel-book-btn and Bangla text not found!');
  }
  console.log('✅ Booking button "এইরকম শুটিং বুক করুন" is present in modal.');

  // Test 3: Click "এইরকম শুটিং বুক করুন" button
  console.log('\nTest 3: Simulating click on "এইরকম শুটিং বুক করুন"...');
  const bookBtn = elements['modal-reel-book-btn'];
  if (!bookBtn) {
    throw new Error('modal-reel-book-btn element not found in DOM!');
  }

  // Set booking modal initially hidden
  const bookingModal = elements['booking-modal'];
  if (!bookingModal.classList.contains('hidden')) {
    throw new Error('Booking modal should be hidden before click!');
  }

  bookBtn.click();

  // Assert:
  // 1. Reel modal should now be hidden
  if (!reelModal.classList.contains('hidden')) {
    throw new Error('Reel modal should be hidden after booking button is clicked!');
  }
  console.log('✅ Reel modal was hidden automatically.');

  // 2. Booking modal should now be visible
  if (bookingModal.classList.contains('hidden')) {
    throw new Error('Booking modal failed to open when booking button was clicked!');
  }
  console.log('✅ Booking modal opened successfully!');

  // 3. Service select should be pre-selected to viral reels
  const serviceSelect = elements['modal-service-select'];
  console.log(`Service select value: "${serviceSelect.value}"`);
  if (serviceSelect.value !== 'ভাইরাল প্রোডাক্ট রিলস প্যাক') {
    throw new Error('Booking modal service was not automatically set to viral reels!');
  }
  console.log('✅ Service automatically selected: "ভাইরাল প্রোডাক্ট রিলস প্যাক".');

  // 4. Notes textarea should be prefilled with reel reference
  const notesTextarea = elements['notes-textarea'];
  console.log(`Notes textarea value: "${notesTextarea.value}"`);
  if (!notesTextarea.value.includes('MUMTAHINA RAW')) {
    throw new Error('Notes field was not prefilled with reference to "MUMTAHINA RAW"!');
  }
  console.log('✅ Notes field correctly prefilled with reel title "MUMTAHINA RAW".');

  console.log('\n======================================================');
  console.log('🎉 ALL REEL MODAL & BOOKING TRIGGER TESTS PASSED 100%!');
  console.log('======================================================\n');
}

runTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\n❌ Test Failed:', err);
    process.exit(1);
  });
