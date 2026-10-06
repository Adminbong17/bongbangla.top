/**
 * BongBangla Media & Creative Lab
 * Packages & Pricing Manager + Interactive Custom Package Builder
 * Supports Dynamic Admin Pricing, Live Package Customizer, and Instant Booking/WhatsApp sync
 */

const DEFAULT_PACKAGES = [
  {
    id: 'pkg-starter',
    badge: 'স্টার্টার প্যাক',
    title: 'ভাইরাল রিলস ও সোশ্যাল বাজ',
    description: 'নতুন পণ্য লঞ্চ, এফ-কমার্স ড্রপ ও দৈনিক সোশ্যাল মিডিয়া কন্টেন্টের জন্য পারফেক্ট।',
    price: '২৫,০০০',
    period: '/ ফুল ক্যাম্পেইন',
    isFeatured: false,
    servicePreset: 'product-reels',
    defaultConfig: {
      service: 'viral-reels',
      reels: 6,
      models: 1,
      addons: ['photos']
    },
    features: [
      '৬টি হাই-কনভার্টিং ভাইরাল রিলস (৯:১৬)',
      '১ জন মডেল অন্তর্ভুক্ত',
      'ট্রেন্ডিং মিউজিক ও ডায়নামিক ক্যাপশন',
      '১০টি হাই-রেজ্যুলেশন স্টিল ফটো',
      '৪ কর্মদিবসের মধ্যে ডেলিভারি'
    ]
  },
  {
    id: 'pkg-growth',
    badge: 'ব্র্যান্ডের সর্বাধিক জনপ্রিয়',
    subtitle: 'ব্র্যান্ড গ্রোথ স্যুট',
    title: 'সিনেমা TVC + ফেসবুক বুস্টিং',
    description: '৪K সিনেমা অ্যাড ফিল্ম প্রোডাকশন এবং সেলস দ্বিগুণ করার জন্য মেটা অ্যাডস ম্যানেজমেন্ট।',
    price: '৫৫,০০০',
    period: '/ ফুল ক্যাম্পেইন',
    isFeatured: true,
    servicePreset: 'ad-video',
    defaultConfig: {
      service: 'cinema-ads',
      reels: 4,
      models: 2,
      addons: ['studio', 'makeup', 'meta-ads']
    },
    features: [
      '১টি মেইন ৪K সিনেমা কমার্শিয়াল অ্যাড (৬০ সেকেন্ড)',
      '৪টি কাটডাউন শর্ট হুক ভিডিও (অ্যাডের জন্য)',
      '২ জন প্রফেশনাল মডেল (নারী ও পুরুষ)',
      'স্টুডিও লোকেশন ও সিনেমাটিক লাইটিং রিগ',
      'মেকআপ ও হেয়ার আর্টিস্ট অন-সেট',
      '১ মাস মেটা অ্যাড ক্যাম্পেইন সেটআপ ও অপটিমাইজেশন'
    ]
  },
  {
    id: 'pkg-enterprise',
    badge: '৩৬০° এন্টারপ্রাইজ',
    title: 'পূর্ণাঙ্গ ব্র্যান্ড মিডিয়া সল্যুশন',
    description: 'অ্যাড ফিল্ম, শাড়ি/বোল্ড শ্যুট, ই-কমার্স ওয়েবসাইট এবং সেলস স্কেলিং রিটেইনার।',
    price: '৯৫,০০০',
    period: '/ কমপ্লিট সল্যুশন',
    isFeatured: false,
    servicePreset: 'brand-website',
    defaultConfig: {
      service: 'saree-shoot',
      reels: 12,
      models: 3,
      addons: ['photos', 'studio', 'makeup', 'voiceover', 'meta-ads']
    },
    features: [
      'একাধিক ৪K সিনেমা কমার্শিয়াল অ্যাড',
      'ঐতিহ্যবাহী ও বোল্ড ক্যাটালগ শ্যুট (৩০+ রিটাচড ফটো)',
      '১২টি ভাইরাল প্রোডাক্ট রিলস ও শর্ট ভিডিও',
      'কাস্টম ব্র্যান্ড ওয়েবসাইট (বিকাশ/নগদ পেমেন্ট সহ)',
      'ডেডিকেটেড ক্রিয়েটিভ ডিরেক্টর সাপোর্ট'
    ]
  }
];

const CUSTOMIZER_RATES = {
  services: {
    'cinema-ads': { name: '৪K সিনেমা অ্যাড ফিল্ম', base: 15000, icon: 'fa-solid fa-clapperboard' },
    'saree-shoot': { name: 'শাড়ি ও মডেল শুট', base: 12000, icon: 'fa-solid fa-camera-retro' },
    'viral-reels': { name: 'ভাইরাল প্রোডাক্ট রিলস', base: 10000, icon: 'fa-solid fa-bolt' },
    'facebook-ads': { name: 'ফেসবুক অ্যাড স্কেলিং', base: 8000, icon: 'fa-brands fa-facebook-f' },
    'jewellery': { name: 'জুয়েলারি ও লাক্সারি', base: 14000, icon: 'fa-solid fa-gem' }
  },
  reelRate: 2000,
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

const bnDigits = { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' };
function toBnNum(num) {
  if (num === null || num === undefined) return '';
  const str = typeof num === 'number' ? num.toLocaleString('en-US') : String(num);
  return str.split('').map(c => bnDigits[c] || c).join('');
}

function getStoredPackages() {
  try {
    const raw = localStorage.getItem('bongbangla_packages');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading packages:', e);
  }
  return DEFAULT_PACKAGES;
}

function saveStoredPackages(packages) {
  try {
    localStorage.setItem('bongbangla_packages', JSON.stringify(packages));
  } catch (e) {
    console.error('Error saving packages:', e);
  }
}

// Global Customizer State
const customizerState = {
  service: 'viral-reels',
  reels: 6,
  models: 1,
  addons: ['photos']
};

/**
 * Switch between "রেডিমেড প্যাকেজসমূহ" and "কাস্টম প্যাকেজ বিল্ডার"
 */
function setPricingMode(mode) {
  const readyTab = document.getElementById('pricing-tab-ready');
  const customTab = document.getElementById('pricing-tab-custom');
  const readyView = document.getElementById('pricing-ready-view');
  const customView = document.getElementById('pricing-custom-view');

  if (!readyTab || !customTab || !readyView || !customView) return;

  if (mode === 'custom') {
    readyTab.className = 'pricing-toggle-btn px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold font-bangla text-[#572449] hover:text-[#db2777] transition-all cursor-pointer';
    customTab.className = 'pricing-toggle-btn px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold font-bangla bg-gradient-to-r from-[#ED96D7] to-[#db2777] text-white shadow-md transition-all cursor-pointer';
    
    readyView.classList.add('hidden');
    customView.classList.remove('hidden');
    customView.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    updateCustomizerUI();
  } else {
    readyTab.className = 'pricing-toggle-btn px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold font-bangla bg-gradient-to-r from-[#ED96D7] to-[#db2777] text-white shadow-md transition-all cursor-pointer';
    customTab.className = 'pricing-toggle-btn px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold font-bangla text-[#572449] hover:text-[#db2777] transition-all cursor-pointer';
    
    customView.classList.add('hidden');
    readyView.classList.remove('hidden');
  }
}

/**
 * Open Custom Package Builder and prefill configuration from selected ready package
 */
function customizePackagePreset(pkgId) {
  const packages = getStoredPackages();
  const pkg = packages.find(p => p.id === pkgId);
  if (pkg && pkg.defaultConfig) {
    customizerState.service = pkg.defaultConfig.service || 'viral-reels';
    customizerState.reels = pkg.defaultConfig.reels || 6;
    customizerState.models = pkg.defaultConfig.models || 1;
    customizerState.addons = Array.isArray(pkg.defaultConfig.addons) ? [...pkg.defaultConfig.addons] : [];
  }
  setPricingMode('custom');
}

/**
 * Render the Ready-Made Package Cards dynamically on index.html
 */
function renderReadyPackages() {
  const container = document.getElementById('pricing-cards-container');
  if (!container) return;

  const packages = getStoredPackages();
  container.innerHTML = packages.map(pkg => {
    const isFeatured = !!pkg.isFeatured;
    const badgeText = pkg.badge || (isFeatured ? 'জনপ্রিয় চয়েস' : 'প্যাকেজ');
    const priceDisplay = pkg.price.startsWith('৳') ? pkg.price : `৳ ${pkg.price}`;

    const cardClasses = isFeatured
      ? 'glass-panel p-6 sm:p-8 rounded-3xl border-2 border-[#ED96D7] relative flex flex-col justify-between shadow-2xl shadow-[#ED96D7]/35 bg-gradient-to-b from-white via-[#fff8fa] to-[#fce7f3] hover:scale-[1.02] transition-all'
      : 'glass-panel p-6 sm:p-8 rounded-3xl border border-[#ED96D7]/30 flex flex-col justify-between hover:border-[#db2777] transition-all bg-white shadow-sm hover:shadow-xl hover:scale-[1.01]';

    const featuresHtml = (pkg.features || []).map(f => `
      <li class="flex items-start gap-2.5">
        <i class="fa-solid fa-check ${isFeatured ? 'text-[#db2777]' : 'text-emerald-600'} text-xs mt-0.5 shrink-0"></i>
        <span>${f}</span>
      </li>
    `).join('');

    return `
      <div class="${cardClasses}">
        <div>
          ${isFeatured ? `
            <div class="absolute -top-3.5 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#ED96D7] to-[#db2777] text-white text-[10px] font-extrabold uppercase tracking-widest shadow-md font-bangla whitespace-nowrap">
              ${badgeText}
            </div>
          ` : `
            <span class="text-xs font-bold text-[#db2777] uppercase tracking-widest font-bangla">${badgeText}</span>
          `}

          <h3 class="font-bangla font-extrabold text-xl sm:text-2xl text-[#2b0e23] ${isFeatured ? 'mt-3 sm:mt-1' : 'mt-1'}">
            ${pkg.title}
          </h3>
          <p class="text-[#8c4f75] text-xs mt-2 font-bangla font-medium leading-relaxed">
            ${pkg.description || ''}
          </p>
          
          <div class="mt-5 mb-5">
            <span class="font-heading font-extrabold text-2xl sm:text-3xl text-[#2b0e23] ${isFeatured ? 'text-[#db2777] royal-text-glow' : ''}">
              ${priceDisplay}
            </span>
            <span class="text-[#8c4f75] text-xs font-bangla font-semibold"> ${pkg.period || '/ ফুল ক্যাম্পেইন'}</span>
          </div>

          <ul class="space-y-2.5 text-xs text-[#572449] border-t border-[#ED96D7]/20 pt-5 font-bangla font-medium">
            ${featuresHtml}
          </ul>
        </div>

        <div class="pt-6 space-y-2.5">
          <!-- Primary Booking Button -->
          <button type="button" 
                  class="open-booking-modal w-full ${isFeatured ? 'btn-primary-glow' : 'btn-secondary-glass'} py-3.5 rounded-xl font-bangla text-xs font-bold tracking-wider shadow-sm flex items-center justify-center gap-1.5 transition-all"
                  data-service-preset="${pkg.servicePreset || 'ad-video'}"
                  data-package-title="${encodeURIComponent(pkg.title)}"
                  data-package-price="${encodeURIComponent(priceDisplay)}"
                  onclick="selectPackageForBooking('${encodeURIComponent(pkg.title)}', '${encodeURIComponent(priceDisplay)}')">
            <i class="fa-solid fa-calendar-check text-xs"></i>
            <span>এই প্যাকেজটি সিলেক্ট করুন</span>
          </button>

          <!-- Customization Button -->
          <button type="button" 
                  class="w-full py-2.5 rounded-xl bg-white hover:bg-[#fff0f6] text-[#db2777] hover:text-[#be185d] border border-[#ED96D7]/50 hover:border-[#db2777] text-xs font-bold font-bangla shadow-2xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  onclick="customizePackagePreset('${pkg.id}')"
                  title="এই প্যাকেজটি আপনার নিজের মতো কাস্টমাইজ করুন">
            <i class="fa-solid fa-sliders text-xs"></i>
            <span>নিজের মতো কাস্টমাইজ করুন</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function selectPackageForBooking(titleEncoded, priceEncoded) {
  const title = decodeURIComponent(titleEncoded || '');
  const price = decodeURIComponent(priceEncoded || '');
  const bookingModal = document.getElementById('booking-modal');
  if (bookingModal) {
    bookingModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    const notesEl = bookingModal.querySelector('textarea[name="notes"]');
    if (notesEl && title) {
      notesEl.value = `নির্বাচিত প্যাকেজ: ${title} (${price})`;
    }
  }
}

/**
 * Real-time Price Calculation & Dynamic Breakdown
 */
function calculateCustomizerPrice() {
  const sCfg = CUSTOMIZER_RATES.services[customizerState.service] || CUSTOMIZER_RATES.services['viral-reels'];
  const basePrice = sCfg.base;
  
  // Reels price (with 10% volume discount for 10+ reels)
  let reelsPrice = customizerState.reels * CUSTOMIZER_RATES.reelRate;
  if (customizerState.reels >= 10) {
    reelsPrice = Math.round(reelsPrice * 0.9);
  }

  // Model price
  const mCfg = CUSTOMIZER_RATES.models[customizerState.models] || CUSTOMIZER_RATES.models[1];
  const modelPrice = mCfg.price;

  // Addons price
  let addonsPrice = 0;
  const selectedAddonDetails = [];
  (customizerState.addons || []).forEach(addId => {
    const addCfg = CUSTOMIZER_RATES.addons[addId];
    if (addCfg) {
      addonsPrice += addCfg.price;
      selectedAddonDetails.push(addCfg);
    }
  });

  const totalPrice = basePrice + reelsPrice + modelPrice + addonsPrice;

  return {
    serviceName: sCfg.name,
    serviceBase: basePrice,
    reelsCount: customizerState.reels,
    reelsPrice,
    modelName: mCfg.name,
    modelPrice,
    addonsPrice,
    selectedAddonDetails,
    totalPrice
  };
}

/**
 * Update Interactive Customizer UI values, active states & dynamic calculation card
 */
function updateCustomizerUI() {
  const calc = calculateCustomizerPrice();

  // 1. Update Service Radio Cards
  document.querySelectorAll('.customizer-service-chip').forEach(chip => {
    const sId = chip.getAttribute('data-service');
    if (sId === customizerState.service) {
      chip.className = 'customizer-service-chip p-3.5 rounded-2xl border-2 border-[#db2777] bg-[#fff0f6] text-[#db2777] shadow-sm flex items-center gap-2.5 cursor-pointer transition-all';
      const iconWrap = chip.querySelector('.chip-icon');
      if (iconWrap) iconWrap.className = 'chip-icon w-8 h-8 rounded-xl bg-[#db2777] text-white flex items-center justify-center text-sm shadow-xs';
    } else {
      chip.className = 'customizer-service-chip p-3.5 rounded-2xl border border-[#ED96D7]/40 bg-white text-[#572449] hover:border-[#db2777] hover:bg-[#fff8fa] shadow-2xs flex items-center gap-2.5 cursor-pointer transition-all';
      const iconWrap = chip.querySelector('.chip-icon');
      if (iconWrap) iconWrap.className = 'chip-icon w-8 h-8 rounded-xl bg-[#fdf2f8] text-[#db2777] flex items-center justify-center text-sm';
    }
  });

  // 2. Update Reels Slider & Value
  const slider = document.getElementById('customizer-reels-slider');
  const countBadge = document.getElementById('customizer-reels-val');
  if (slider) slider.value = customizerState.reels;
  if (countBadge) countBadge.textContent = `${toBnNum(customizerState.reels)} টি রিলস`;

  // Quick Reels Pills
  document.querySelectorAll('.customizer-reel-pill').forEach(pill => {
    const rVal = parseInt(pill.getAttribute('data-reels'), 10);
    if (rVal === customizerState.reels) {
      pill.className = 'customizer-reel-pill px-3 py-1.5 rounded-xl bg-[#db2777] text-white font-bold text-xs shadow-xs transition-all cursor-pointer';
    } else {
      pill.className = 'customizer-reel-pill px-3 py-1.5 rounded-xl bg-white border border-[#ED96D7]/40 text-[#572449] hover:border-[#db2777] font-semibold text-xs transition-all cursor-pointer';
    }
  });

  // 3. Update Model Selection Pills
  document.querySelectorAll('.customizer-model-chip').forEach(chip => {
    const mVal = parseInt(chip.getAttribute('data-models'), 10);
    if (mVal === customizerState.models) {
      chip.className = 'customizer-model-chip p-3 rounded-2xl border-2 border-[#db2777] bg-[#fff0f6] text-[#db2777] shadow-sm flex items-center justify-between cursor-pointer transition-all';
      const check = chip.querySelector('.check-indicator');
      if (check) check.classList.remove('hidden');
    } else {
      chip.className = 'customizer-model-chip p-3 rounded-2xl border border-[#ED96D7]/40 bg-white text-[#572449] hover:border-[#db2777] hover:bg-[#fff8fa] shadow-2xs flex items-center justify-between cursor-pointer transition-all';
      const check = chip.querySelector('.check-indicator');
      if (check) check.classList.add('hidden');
    }
  });

  // 4. Update Add-ons Checkboxes
  document.querySelectorAll('.customizer-addon-chip').forEach(chip => {
    const aId = chip.getAttribute('data-addon');
    const isChecked = customizerState.addons.includes(aId);
    if (isChecked) {
      chip.className = 'customizer-addon-chip p-3 rounded-2xl border-2 border-[#db2777] bg-[#fff0f6] shadow-sm flex items-center justify-between cursor-pointer transition-all';
      const box = chip.querySelector('.addon-checkbox');
      if (box) box.className = 'addon-checkbox w-5 h-5 rounded-md bg-[#db2777] text-white flex items-center justify-center text-xs shadow-xs';
    } else {
      chip.className = 'customizer-addon-chip p-3 rounded-2xl border border-[#ED96D7]/40 bg-white hover:border-[#db2777] hover:bg-[#fff8fa] shadow-2xs flex items-center justify-between cursor-pointer transition-all';
      const box = chip.querySelector('.addon-checkbox');
      if (box) box.className = 'addon-checkbox w-5 h-5 rounded-md border border-[#ED96D7]/60 bg-white text-transparent flex items-center justify-center text-xs';
    }
  });

  // 5. Update Dynamic Price & Summary Card
  const totalElem = document.getElementById('customizer-total-price');
  const serviceElem = document.getElementById('calc-summary-service');
  const reelsElem = document.getElementById('calc-summary-reels');
  const modelsElem = document.getElementById('calc-summary-models');
  const addonsElem = document.getElementById('calc-summary-addons');

  if (totalElem) totalElem.textContent = `৳ ${toBnNum(calc.totalPrice)}`;
  if (serviceElem) serviceElem.textContent = calc.serviceName;
  if (reelsElem) reelsElem.textContent = `${toBnNum(calc.reelsCount)} টি রিলস (৳ ${toBnNum(calc.reelsPrice)})`;
  if (modelsElem) modelsElem.textContent = `${calc.modelName} ${calc.modelPrice > 0 ? `(৳ ${toBnNum(calc.modelPrice)})` : ''}`;
  if (addonsElem) {
    if (calc.selectedAddonDetails.length > 0) {
      addonsElem.textContent = `${toBnNum(calc.selectedAddonDetails.length)}টি অ্যাড-অনস (৳ ${toBnNum(calc.addonsPrice)})`;
    } else {
      addonsElem.textContent = 'কোনো অ্যাড-অনস নেওয়া হয়নি';
    }
  }

  // 6. Update WhatsApp link
  const waBtn = document.getElementById('customizer-whatsapp-btn');
  if (waBtn) {
    const addonsListStr = calc.selectedAddonDetails.map(a => `• ${a.name}`).join('\n') || 'কোনোটি না';
    const waMessage = 
`নমস্কার BongBangla Media!
আমি ওয়েবসাইট থেকে একটি কাস্টম প্যাকেজ কনফিগার করেছি:

📌 সার্ভিস: ${calc.serviceName}
🎬 রিলস সংখ্যা: ${calc.reelsCount} টি
👥 মডেল: ${calc.modelName}
✨ অ্যাড-অনস:
${addonsListStr}

💰 মোট আনুমানিক বাজেট: ৳ ${calc.totalPrice.toLocaleString('bn-BD')} BDT

এই কাস্টম প্যাকেজের জন্য বিস্তারিত আলোচনা ও শুটিং স্লট বুক করতে চাই।`;

    waBtn.href = `https://wa.me/8801700000000?text=${encodeURIComponent(waMessage)}`;
  }
}

/**
 * Handle direct booking submission for the customized package
 */
function bookCustomizedPackage() {
  const calc = calculateCustomizerPrice();
  const bookingModal = document.getElementById('booking-modal');
  if (bookingModal) {
    bookingModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');

    const selectEl = document.getElementById('modal-service-select');
    if (selectEl) {
      selectEl.value = calc.serviceName;
    }

    const notesEl = bookingModal.querySelector('textarea[name="notes"]');
    if (notesEl) {
      const addonsStr = calc.selectedAddonDetails.map(a => a.name).join(', ') || 'নেই';
      notesEl.value = `[কাস্টম প্যাকেজ রিকোয়েস্ট]\nসার্ভিস: ${calc.serviceName}\nরিলস: ${calc.reelsCount} টি\nমডেল: ${calc.modelName}\nঅ্যাড-অনস: ${addonsStr}\nমোট আনুমানিক বাজেট: ৳ ${calc.totalPrice.toLocaleString('bn-BD')}`;
    }
  } else {
    window.location.href = 'index.html#booking';
  }
}

/**
 * Initialize event listeners for the Custom Package Builder
 */
function initCustomPackageBuilder() {
  // Service selection listeners
  document.querySelectorAll('.customizer-service-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const sId = chip.getAttribute('data-service');
      if (sId) {
        customizerState.service = sId;
        updateCustomizerUI();
      }
    });
  });

  // Slider change
  const slider = document.getElementById('customizer-reels-slider');
  if (slider) {
    slider.addEventListener('input', (e) => {
      customizerState.reels = parseInt(e.target.value, 10);
      updateCustomizerUI();
    });
  }

  // Quick Reels Pills
  document.querySelectorAll('.customizer-reel-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const rVal = parseInt(pill.getAttribute('data-reels'), 10);
      if (rVal) {
        customizerState.reels = rVal;
        updateCustomizerUI();
      }
    });
  });

  // Model chips
  document.querySelectorAll('.customizer-model-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const mVal = parseInt(chip.getAttribute('data-models'), 10);
      if (!isNaN(mVal)) {
        customizerState.models = mVal;
        updateCustomizerUI();
      }
    });
  });

  // Addon chips
  document.querySelectorAll('.customizer-addon-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const aId = chip.getAttribute('data-addon');
      if (aId) {
        const idx = customizerState.addons.indexOf(aId);
        if (idx > -1) {
          customizerState.addons.splice(idx, 1);
        } else {
          customizerState.addons.push(aId);
        }
        updateCustomizerUI();
      }
    });
  });

  // Render Ready Packages & Initial Customizer UI
  renderReadyPackages();
  updateCustomizerUI();
}

// Expose globally
window.BongBanglaPackages = {
  getStoredPackages,
  saveStoredPackages,
  renderReadyPackages,
  setPricingMode,
  customizePackagePreset,
  calculateCustomizerPrice,
  updateCustomizerUI,
  bookCustomizedPackage,
  initCustomPackageBuilder,
  DEFAULT_PACKAGES,
  CUSTOMIZER_RATES
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('pricing')) {
    initCustomPackageBuilder();
  }
});
