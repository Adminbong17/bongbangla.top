/**
 * BongBangla Media & Creative Lab
 * Main JavaScript Controller
 * Domain: bongbangla.top
 * Theme: Royal Bengali Velvet & Jamdani Gold
 */

document.addEventListener('DOMContentLoaded', () => {
  initSeedData();
  initLogoSwitcher();
  initNavbar();
  initPortfolioFilter();
  initLightbox();
  initEstimator();
  initFaqAccordion();
  initModals();
  initContactForm();
});

/* ==========================================================================
   0. Brand Logo Switcher (Bangla & English Official Versions)
   ========================================================================== */
function initLogoSwitcher() {
  const savedLang = localStorage.getItem('bongbangla_logo_lang') || 'bn';
  setBrandLogoLang(savedLang);
}

window.setBrandLogoLang = function(lang) {
  const mainLogo = document.getElementById('main-brand-logo');
  const footerLogo = document.getElementById('footer-brand-logo');
  const btnBn = document.getElementById('logo-btn-bn');
  const btnEn = document.getElementById('logo-btn-en');

  const logoSrc = lang === 'en' ? 'assets/logo-en.png' : 'assets/logo-bn.png';
  if (mainLogo) mainLogo.src = logoSrc;
  if (footerLogo) footerLogo.src = logoSrc;

  if (btnBn && btnEn) {
    if (lang === 'en') {
      btnEn.className = 'logo-toggle-btn px-2 py-0.5 rounded-full bg-[#db2777] text-white shadow-sm transition-all';
      btnBn.className = 'logo-toggle-btn px-2 py-0.5 rounded-full text-[#572449] hover:text-[#db2777] transition-all';
    } else {
      btnBn.className = 'logo-toggle-btn px-2 py-0.5 rounded-full bg-[#db2777] text-white shadow-sm transition-all';
      btnEn.className = 'logo-toggle-btn px-2 py-0.5 rounded-full text-[#572449] hover:text-[#db2777] transition-all';
    }
  }
  localStorage.setItem('bongbangla_logo_lang', lang);
};

/* ==========================================================================
   0. Seed Default Inquiries (if first visit) for Admin Panel
   ========================================================================== */
function initSeedData() {
  if (!localStorage.getItem('bongbangla_leads')) {
    const sampleLeads = [
      {
        id: 'L-101',
        name: 'তানভীর আহমেদ',
        brand: 'Aarohi Silk & Jamdani',
        phone: '01711223344',
        service: 'Traditional Saree & Bold Shoot',
        budget: '৳ 48,000',
        date: '2026-10-02',
        status: 'Booked',
        notes: 'Eid Festive Collection catalog shoot with 2 top female models.'
      },
      {
        id: 'L-102',
        name: 'সাদিয়া তাসনিম',
        brand: 'Luxe Glow Cosmetics BD',
        phone: '01899887766',
        service: 'Viral Product Reels Pack (10 Reels)',
        budget: '৳ 32,000',
        date: '2026-10-03',
        status: 'New',
        notes: 'Serum & lip tint texture macro video reels for TikTok and Meta Ads.'
      },
      {
        id: 'L-103',
        name: 'ফারহান করিম',
        brand: 'Nawab Panjabi Heritage',
        phone: '01912345678',
        service: 'Cinema Ad Film (with Male Model)',
        budget: '৳ 55,000',
        date: '2026-10-03',
        status: 'Contacted',
        notes: 'Wedding & Pohela Boishakh Panjabi TVC with drone & heritage haveli location.'
      }
    ];
    localStorage.setItem('bongbangla_leads', JSON.stringify(sampleLeads));
  }
}

/* ==========================================================================
   1. Navbar & Mobile Menu Handling
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('main-header');
  const mobileToggle = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('shadow-xl', 'border-b', 'border-[#ED96D7]/40', 'bg-white/95');
    } else {
      header.classList.remove('shadow-xl', 'border-b', 'border-[#ED96D7]/40', 'bg-white/95');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = !mobileDrawer.classList.contains('hidden');
      if (isOpen) {
        mobileDrawer.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      } else {
        mobileDrawer.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      });
    });
  }
}

/* ==========================================================================
   2. Portfolio Filter System (Royal Bengali Gold & Crimson Active)
   ========================================================================== */
function initPortfolioFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('bg-gradient-to-r', 'from-[#ED96D7]', 'to-[#db2777]', 'text-white', 'border-[#db2777]', 'shadow-[0_0_15px_rgba(237,150,215,0.5)]');
        b.classList.add('bg-white', 'text-[#572449]', 'border-[#ED96D7]/40');
      });

      btn.classList.add('bg-gradient-to-r', 'from-[#ED96D7]', 'to-[#db2777]', 'text-white', 'border-[#db2777]', 'shadow-[0_0_15px_rgba(237,150,215,0.5)]');
      btn.classList.remove('bg-white', 'text-[#572449]', 'border-[#ED96D7]/40');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          item.classList.add('animate-fadeIn');
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   3. Lightbox Preview Modal (Photos & Simulated Video Reel)
   ========================================================================== */
function initLightbox() {
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = document.getElementById('lightbox-close');

  const triggers = document.querySelectorAll('.lightbox-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = trigger.closest('.portfolio-item');
      if (!parent) return;

      const mediaType = parent.getAttribute('data-media-type') || 'image';
      const mediaSrc = parent.getAttribute('data-media-src') || '';
      const title = parent.getAttribute('data-title') || 'BongBangla Production';
      const category = parent.getAttribute('data-category-label') || 'Commercial Media';
      const desc = parent.getAttribute('data-desc') || 'Shot with 4K cinema equipment, directed by BongBangla creative crew.';

      lightboxTitle.textContent = title;
      lightboxCategory.textContent = category;
      lightboxDesc.textContent = desc;

      if (mediaType === 'video') {
        lightboxImg.classList.add('hidden');
        lightboxVideo.classList.remove('hidden');
        lightboxVideo.src = mediaSrc;
        lightboxVideo.load();
      } else {
        lightboxVideo.classList.add('hidden');
        lightboxVideo.pause();
        lightboxImg.classList.remove('hidden');
        lightboxImg.src = mediaSrc;
      }

      lightboxModal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    });
  });

  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.classList.add('hidden');
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.src = '';
      }
      document.body.classList.remove('overflow-hidden');
    }
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('modal-backdrop')) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeBookingModal();
    }
  });
}

/* ==========================================================================
   4. Interactive Package & Cost Estimator (Bengali Brand Context)
   ========================================================================== */
function initEstimator() {
  const serviceCheckboxes = document.querySelectorAll('.estimator-service');
  const addonCheckboxes = document.querySelectorAll('.estimator-addon');
  const modelCountSelect = document.getElementById('estimator-models');
  const currencySelect = document.getElementById('estimator-currency');
  
  const estimatedPriceEl = document.getElementById('estimated-price-display');
  const estimatedDaysEl = document.getElementById('estimated-days-display');
  const estimatedSummaryEl = document.getElementById('estimator-selected-summary');
  const whatsappQuoteBtn = document.getElementById('whatsapp-quote-btn');

  // Rates in BDT base
  const rates = {
    services: {
      'ad-video': { name: 'Cinema Ad Film (4K TVC & Digital)', base: 35000, days: 5 },
      'product-reels': { name: 'Viral Product Reels (Pack of 8)', base: 22000, days: 3 },
      'bold-shoot': { name: 'Saree, Jamdani & Bold Fashion Shoot', base: 28000, days: 3 },
      'facebook-ads': { name: 'Facebook Ads & F-Commerce Sales Scaling', base: 18000, days: 4 },
      'model-portfolio': { name: 'Model Composite Card & Casting Lookbook', base: 15000, days: 2 },
      'brand-website': { name: 'High-Converting Webstore (with bKash/Nagad & COD)', base: 25000, days: 6 }
    },
    addons: {
      'hair-makeup': { name: 'Top Dhaka Bridal/Fashion MUA & Hair', price: 6000 },
      'drone-cinema': { name: '4K Aerial Drone Coverage', price: 7500 },
      'prime-location': { name: 'Heritage Zamindar Bari / Luxury Studio', price: 10000 },
      'expedited-edit': { name: '48-Hour Priority Festival Delivery', price: 5000 }
    },
    modelFeePerExtra: 8000
  };

  const exchangeRates = {
    BDT: { symbol: '৳', rate: 1 },
    USD: { symbol: '$', rate: 0.0084 },
    INR: { symbol: '₹', rate: 0.70 }
  };

  function calculate() {
    let totalBDT = 0;
    let maxDays = 0;
    const selectedNames = [];

    // Checked services
    serviceCheckboxes.forEach(cb => {
      if (cb.checked) {
        const item = rates.services[cb.value];
        if (item) {
          totalBDT += item.base;
          maxDays = Math.max(maxDays, item.days);
          selectedNames.push(item.name);
        }
      }
    });

    if (selectedNames.length === 0) {
      totalBDT = 0;
      maxDays = 0;
    }

    const modelCount = parseInt(modelCountSelect?.value || '1', 10);
    if (modelCount > 1 && totalBDT > 0) {
      const extraModels = modelCount - 1;
      totalBDT += extraModels * rates.modelFeePerExtra;
      selectedNames.push(`${extraModels} Extra Model(s)`);
    }

    addonCheckboxes.forEach(cb => {
      if (cb.checked && totalBDT > 0) {
        const addon = rates.addons[cb.value];
        if (addon) {
          totalBDT += addon.price;
          selectedNames.push(addon.name);
        }
      }
    });

    const curr = currencySelect?.value || 'BDT';
    const currencyInfo = exchangeRates[curr] || exchangeRates.BDT;
    const finalAmount = Math.round(totalBDT * currencyInfo.rate);

    // Update UI
    if (totalBDT === 0) {
      estimatedPriceEl.textContent = 'প্যাকেজ বাছাই করুন';
      estimatedDaysEl.textContent = '-- কার্যদিবস';
      estimatedSummaryEl.textContent = 'বামপাশের সার্ভিসগুলো থেকে নির্বাচন করুন তাৎক্ষণিক খরচ ও সময়কাল দেখতে।';
    } else {
      estimatedPriceEl.textContent = `${currencyInfo.symbol} ${finalAmount.toLocaleString()}`;
      estimatedDaysEl.textContent = `~ ${maxDays} কর্মদিবস ডেলিভারি`;
      estimatedSummaryEl.innerHTML = `<span class="text-[#f59e0b] font-bold">প্যাকেজে অন্তর্ভুক্ত:</span> ` + selectedNames.join(' • ');
    }

    // Update WhatsApp link
    if (whatsappQuoteBtn) {
      const phone = '8801700000000';
      const text = encodeURIComponent(
        `নমস্কার/সালাম BongBangla টিম!\n\nআমি bongbangla.top ওয়েবসাইট থেকে একটি প্রজেক্টের বাজেট এস্টিমেট করেছি:\n- সার্ভিসসমূহ: ${selectedNames.join(', ')}\n- আনুমানিক বাজেট: ${currencyInfo.symbol} ${finalAmount.toLocaleString()} (${curr})\n- ডেলিভারি সময়কাল: ~${maxDays} দিন\n\nআমাদের ব্র্যান্ডের শুটিং শিডিউল ও বুকিং কনফার্ম করতে চাই।`
      );
      whatsappQuoteBtn.href = `https://wa.me/${phone}?text=${text}`;
    }
  }

  serviceCheckboxes.forEach(cb => cb.addEventListener('change', calculate));
  addonCheckboxes.forEach(cb => cb.addEventListener('change', calculate));
  if (modelCountSelect) modelCountSelect.addEventListener('change', calculate);
  if (currencySelect) currencySelect.addEventListener('change', calculate);

  calculate();
}

/* ==========================================================================
   5. Booking Modal Controller
   ========================================================================== */
function initModals() {
  const bookingModal = document.getElementById('booking-modal');
  const openButtons = document.querySelectorAll('.open-booking-modal');
  const closeButtons = document.querySelectorAll('.close-booking-modal, #close-booking-modal-btn');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const servicePreset = btn.getAttribute('data-service-preset');
      const selectEl = document.getElementById('modal-service-select');
      if (selectEl && servicePreset) {
        selectEl.value = servicePreset;
      }
      if (bookingModal) {
        bookingModal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', closeBookingModal);
  });

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal || e.target.classList.contains('modal-backdrop')) {
        closeBookingModal();
      }
    });
  }
}

function closeBookingModal() {
  const bookingModal = document.getElementById('booking-modal');
  if (bookingModal) {
    bookingModal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

/* ==========================================================================
   6. Contact & Booking Form Submissions (Syncs directly to Supabase & Admin Panel!)
   ========================================================================== */
function initContactForm() {
  const forms = document.querySelectorAll('#booking-form, #modal-booking-form, #direct-contact-form, form[data-lead-form]');

  forms.forEach(form => {
    if (form.dataset.boundSubmit) return;
    form.dataset.boundSubmit = 'true';

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const isModal = Boolean(form.closest('#booking-modal') || form.id === 'modal-booking-form' || form.id === 'booking-form');
      handleFormSubmit(form, isModal);
    });
  });
}

function handleFormSubmit(form, isModal) {
  const formData = new FormData(form);
  const name = (formData.get('name') || '').toString().trim();
  const brand = (formData.get('brand') || '').toString().trim();
  const phone = (formData.get('phone') || '').toString().trim();
  const service = (formData.get('service') || 'General Ad Consultation').toString().trim();
  const notes = (formData.get('notes') || '').toString().trim();
  const budget = (formData.get('budget') || 'পেন্ডিং কোটেশন').toString().trim();

  if (!name || !phone) {
    showToast('অনুগ্রহ করে আপনার নাম ও ফোন নম্বর লিখুন!');
    return;
  }

  const newLead = {
    id: 'L-' + (Math.floor(100 + Math.random() * 900)),
    name: name,
    brand: brand || 'ব্যক্তিগত / নতুন ব্র্যান্ড',
    phone: phone,
    service: service,
    budget: budget || 'পেন্ডিং কোটেশন',
    date: new Date().toISOString().split('T')[0],
    status: 'New',
    notes: notes
  };

  // Sync with Supabase Database (with automatic LocalStorage fallback)
  if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.submitLead === 'function') {
    window.BongBanglaSupabase.submitLead(newLead);
  } else {
    try {
      const existingLeads = JSON.parse(localStorage.getItem('bongbangla_leads') || '[]');
      existingLeads.unshift(newLead);
      localStorage.setItem('bongbangla_leads', JSON.stringify(existingLeads));
    } catch (err) {
      console.error('Error saving lead to local database:', err);
    }
  }

  // Direct WhatsApp dispatch option
  const agencyPhone = '8801700000000';
  const message = encodeURIComponent(
    `🔥 নতুন শুটিং ইনকোয়ারি (BongBangla Website)\n\nক্লায়েন্ট: ${name}\nব্র্যান্ড: ${brand}\nমোবাইল/WhatsApp: ${phone}\nসার্ভিস: ${service}\nবাজেট: ${budget}\nপ্রজেক্ট বিবরণ: ${notes}`
  );
  
  showToast(`ধন্যবাদ ${name}! আপনার ইনকোয়ারি সেভ হয়েছে এবং ক্রিয়েটিভ ডিরেক্টরের সাথে WhatsApp কানেক্ট হচ্ছে...`);

  setTimeout(() => {
    try {
      window.open(`https://wa.me/${agencyPhone}?text=${message}`, '_blank');
    } catch(e) {}
    form.reset();
    if (isModal) {
      closeBookingModal();
    }
  }, 1200);
}

/* ==========================================================================
   7. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isExpanded = questionBtn.getAttribute('aria-expanded') === 'true';

        faqItems.forEach(otherItem => {
          const otherBtn = otherItem.querySelector('.faq-question');
          const otherAns = otherItem.querySelector('.faq-answer');
          const otherIcon = otherItem.querySelector('.faq-icon');
          if (otherBtn && otherAns) {
            otherBtn.setAttribute('aria-expanded', 'false');
            otherAns.classList.add('hidden');
            if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
          }
        });

        if (!isExpanded) {
          questionBtn.setAttribute('aria-expanded', 'true');
          answer.classList.remove('hidden');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      });
    }
  });
}

/* ==========================================================================
   8. Utility Toast Notification (Royal Bengali Velvet Style)
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('agency-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'agency-toast';
    toast.className = 'fixed bottom-6 right-6 z-50 bg-white border-2 border-[#ED96D7] text-[#2b0e23] px-5 py-3.5 rounded-2xl shadow-2xl shadow-[#ED96D7]/40 transition-all duration-300 transform translate-y-12 opacity-0 flex items-center gap-3 backdrop-blur-xl';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span class="w-3 h-3 rounded-full bg-[#ED96D7] animate-ping"></span>
    <span class="text-sm font-semibold text-[#2b0e23] font-bangla">${message}</span>
  `;

  setTimeout(() => {
    toast.classList.remove('translate-y-12', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-12', 'opacity-0');
  }, 4500);
}
