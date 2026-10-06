/**
 * BongBangla Media & Creative Lab
 * Supabase Database & Realtime Integration Client
 * Supports Automatic Cloud Sync with Lovable, GitHub, and Supabase Backend
 */

(function() {
  // Unified BongBangla Category Mapping & Aliasing System
  const BongBanglaCategorySystem = window.BongBanglaCategorySystem || (function() {
    const CATEGORY_MAP = {
      'cinema-ads': {
        canonical: 'cinema-ads',
        label: 'অ্যাড ফিল্ম',
        english: 'Cinema Ads',
        pageUrl: 'service-cinema-ads.html',
        aliases: ['cinema-ads', 'commercial-ad', 'commercial-ads', 'ad-film', 'ad-films', 'অ্যাড ফিল্ম', '৪k সিনেমা অ্যাড', 'cinema-ad']
      },
      'saree-shoot': {
        canonical: 'saree-shoot',
        label: 'শাড়ি ও মডেল শুট',
        english: 'Saree & Model Shoot',
        pageUrl: 'service-saree-model-shoot.html',
        aliases: ['saree-shoot', 'model-shoot', 'saree-model', 'model-shoots', 'শাড়ি ও মডেল শুট', 'শাড়ি ও মডেল শ্যুট', 'শাড়ি ও বোল্ড শ্যুট', 'শাড়ি ও বোল্ড শুট', 'saree-shoots']
      },
      'viral-reels': {
        canonical: 'viral-reels',
        label: 'প্রোডাক্ট রিলস',
        english: 'Product Reels',
        pageUrl: 'service-viral-reels.html',
        aliases: ['viral-reels', 'product-reels', 'product-reel', 'reels', 'viral-reel', 'প্রোডাক্ট রিলস', 'ভাইরাল প্রোডাক্ট রিলস', 'ভাইরাল রিলস']
      },
      'facebook-ads': {
        canonical: 'facebook-ads',
        label: 'ওয়েবসাইট ও ব্র্যান্ড',
        english: 'Website & Branding',
        pageUrl: 'service-facebook-ads.html',
        aliases: ['facebook-ads', 'branding-web', 'website-brand', 'brand-web', 'facebook-ad', 'ওয়েবসাইট ও ব্র্যান্ড', 'ফেসবুক অ্যাডস', 'ফেসবুক অ্যাড']
      },
      'jewellery': {
        canonical: 'jewellery',
        label: 'জুয়েলারি ও লাক্সারি',
        english: 'Jewellery & Luxury',
        pageUrl: 'service-jewellery-luxury.html',
        aliases: ['jewellery', 'jewellery-luxury', 'jewelry', 'jewelry-luxury', 'জুয়েলারি ও লাক্সারি', 'জুয়েলারি']
      }
    };

    function normalize(cat) {
      if (!cat) return '';
      return String(cat).toLowerCase().trim();
    }

    function getCategoryConfig(cat) {
      if (!cat) return null;
      const norm = normalize(cat);
      for (const key in CATEGORY_MAP) {
        const cfg = CATEGORY_MAP[key];
        if (key === norm || cfg.aliases.some(a => normalize(a) === norm)) {
          return cfg;
        }
      }
      return null;
    }

    function getCanonicalCategory(cat) {
      const cfg = getCategoryConfig(cat);
      return cfg ? cfg.canonical : cat;
    }

    function getCategoryDisplayName(cat) {
      const cfg = getCategoryConfig(cat);
      return cfg ? cfg.label : (cat || 'কমার্শিয়াল মিডিয়া');
    }

    function getCategoryServiceUrl(cat) {
      const cfg = getCategoryConfig(cat);
      return cfg ? cfg.pageUrl : 'index.html#portfolio';
    }

    function getCategoryAliases(cat) {
      if (!cat || cat === 'all') return [];
      const cfg = getCategoryConfig(cat);
      return cfg ? [...cfg.aliases] : [cat];
    }

    function matchesCategory(itemCat, targetCat) {
      if (!targetCat || targetCat === 'all') return true;
      if (!itemCat) return false;
      const normItem = normalize(itemCat);
      const normTarget = normalize(targetCat);
      if (normItem === normTarget) return true;
      const cfgTarget = getCategoryConfig(targetCat);
      if (cfgTarget) {
        return cfgTarget.aliases.some(a => normalize(a) === normItem);
      }
      const cfgItem = getCategoryConfig(itemCat);
      if (cfgItem) {
        return cfgItem.aliases.some(a => normalize(a) === normTarget);
      }
      return false;
    }

    const sys = {
      CATEGORY_MAP,
      normalize,
      getCategoryConfig,
      getCanonicalCategory,
      getCategoryDisplayName,
      getCategoryServiceUrl,
      getCategoryAliases,
      matchesCategory
    };

    if (typeof window !== 'undefined') {
      window.BongBanglaCategorySystem = sys;
    }
    return sys;
  })();

  const CONFIG_KEY = 'bongbangla_supabase_config';
  
  function getConfig() {
    try {
      const saved = localStorage.getItem(CONFIG_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    
    return {
      url: window.SUPABASE_URL || 'https://sfnyuzemaqplpdeedsgg.supabase.co',
      anonKey: window.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmbnl1emVtYXFwbHBkZWVkc2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMzE3ODEsImV4cCI6MjEwNjYwNzc4MX0.z3YtkhMBSQnMMdCWWCRrFAYn2Yv4bAQcyZ3NGFZOlyw'
    };
  }

  function saveConfig(url, anonKey) {
    const config = { url: url.trim(), anonKey: anonKey.trim() };
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    initClient();
    return config;
  }

  let supabaseClient = null;

  function initClient() {
    const config = getConfig();
    const sb = (typeof window !== 'undefined' && window.supabase) ? window.supabase : (typeof supabase !== 'undefined' ? supabase : null);
    if (config.url && config.anonKey && sb && typeof sb.createClient === 'function') {
      try {
        supabaseClient = sb.createClient(config.url, config.anonKey);
        console.log('⚡ BongBangla Supabase Client Connected:', config.url);
      } catch (err) {
        console.warn('Supabase initialization error:', err);
        supabaseClient = null;
      }
    }
    return supabaseClient;
  }

  async function ensureClient(maxWaitMs = 2500) {
    if (supabaseClient) return supabaseClient;
    initClient();
    if (supabaseClient) return supabaseClient;

    const start = Date.now();
    while (Date.now() - start < maxWaitMs) {
      const sb = (typeof window !== 'undefined' && window.supabase) ? window.supabase : (typeof supabase !== 'undefined' ? supabase : null);
      if (sb && typeof sb.createClient === 'function') {
        initClient();
        if (supabaseClient) return supabaseClient;
      }
      await new Promise(r => setTimeout(r, 100));
    }
    return supabaseClient;
  }

  function getClient() {
    if (!supabaseClient) {
      initClient();
    }
    return supabaseClient;
  }

  function isConfigured() {
    const config = getConfig();
    const client = getClient();
    return Boolean(config.url && config.anonKey && client);
  }

  /* ==========================================================================
     1. Leads & Inquiries Sync
     ========================================================================== */
  async function submitLead(lead) {
    if (!lead) return null;
    if (!lead.id) {
      lead.id = 'L-' + Date.now() + '-' + Math.floor(100 + Math.random() * 900);
    }
    if (!lead.date) {
      lead.date = new Date().toISOString().split('T')[0];
    }
    const client = await ensureClient();

    try {
      const leads = JSON.parse(localStorage.getItem('bongbangla_leads') || '[]');
      if (!leads.some(l => l.id === lead.id)) {
        leads.unshift(lead);
        localStorage.setItem('bongbangla_leads', JSON.stringify(leads));
      }
    } catch (e) {}

    if (client) {
      try {
        const { error } = await client
          .from('leads')
          .insert([{
            id: lead.id,
            name: lead.name || 'Anonymous Client',
            brand: lead.brand || lead.name || 'Direct Inquiry',
            phone: lead.phone || '',
            service: lead.service || 'General Inquiry',
            budget: lead.budget || '৳ ২৫,০০০',
            status: lead.status || 'New',
            notes: lead.notes || '',
            created_at: new Date().toISOString()
          }]);

        if (error) {
          console.error('Supabase lead insert error:', error);
        } else {
          console.log('✅ Lead synced to Supabase successfully:', lead.id);
        }
      } catch (err) {
        console.error('Supabase network error on lead submit:', err);
      }
    }

    return lead;
  }

  async function fetchLeads() {
    const client = await ensureClient();
    if (client) {
      try {
        const { data, error } = await client
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          const mapped = data.map(d => ({
            id: d.id,
            name: d.name,
            brand: d.brand,
            phone: d.phone,
            service: d.service,
            budget: d.budget,
            status: d.status,
            notes: d.notes,
            date: d.created_at ? d.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
          }));
          window._cachedCloudLeads = mapped;
          localStorage.setItem('bongbangla_leads', JSON.stringify(mapped));
          return mapped;
        }
      } catch (err) {
        console.warn('Error fetching leads from Supabase, fallback to localStorage:', err);
      }
    }

    if (window._cachedCloudLeads && Array.isArray(window._cachedCloudLeads)) {
      return window._cachedCloudLeads;
    }

    try {
      return JSON.parse(localStorage.getItem('bongbangla_leads') || '[]');
    } catch (e) {
      return [];
    }
  }

  async function updateLeadStatus(id, newStatus) {
    if (supabaseClient) {
      try {
        await supabaseClient
          .from('leads')
          .update({ status: newStatus })
          .eq('id', id);
      } catch (err) {
        console.error('Error updating status in Supabase:', err);
      }
    }
  }

  async function deleteLead(id) {
    if (supabaseClient) {
      try {
        await supabaseClient
          .from('leads')
          .delete()
          .eq('id', id);
      } catch (err) {
        console.error('Error deleting lead from Supabase:', err);
      }
    }
  }

  /* ==========================================================================
     2. Reels & Video Portfolio Sync
     ========================================================================== */
  async function fetchReels(category = 'all') {
    const client = await ensureClient();
    const catHelper = window.BongBanglaCategorySystem || BongBanglaCategorySystem;

    if (client) {
      try {
        let query = client.from('reels').select('*').order('created_at', { ascending: false });
        if (category !== 'all') {
          const aliases = catHelper ? catHelper.getCategoryAliases(category) : [category];
          if (aliases.length > 1) {
            query = query.in('category', aliases);
          } else if (aliases.length === 1) {
            query = query.eq('category', aliases[0]);
          }
        }

        const { data, error } = await query;
        if (!error && Array.isArray(data)) {
          const mapped = data
            .filter(r => r && r.id && !r.id.match(/^reel-[csvfj]\d+$/))
            .map(r => ({
              id: r.id,
              category: r.category,
              title: r.title,
              client: r.client,
              tag: r.tag,
              views: r.views,
              videoUrl: r.video_url,
              thumbnail: r.thumbnail_url,
              date: r.created_at ? r.created_at.split('T')[0] : '2026-10-01'
            }));

          // Always cache the latest cloud reels so other parts of the site can read them synchronously
          if (category === 'all') {
            window._cachedCloudReels = mapped;
            try {
              localStorage.setItem('bongbangla_reels', JSON.stringify(mapped));
            } catch(e) {}
          }

          return mapped;
        }
      } catch (err) {
        console.warn('Error fetching reels from Supabase, using local:', err);
      }
    }

    if (category === 'all' && window._cachedCloudReels && Array.isArray(window._cachedCloudReels)) {
      return window._cachedCloudReels;
    } else if (window._cachedCloudReels && Array.isArray(window._cachedCloudReels)) {
      return window._cachedCloudReels.filter(r => catHelper ? catHelper.matchesCategory(r.category, category) : r.category === category);
    }

    if (window.BongBanglaReels) {
      return window.BongBanglaReels.getReels(category);
    }
    return [];
  }

  async function addReel(reel) {
    if (!reel) return null;
    if (reel.id && reel.id.match(/^reel-[csvfj]\d+$/)) {
      console.warn('Blocked attempt to save legacy demo reel:', reel.id);
      return null;
    }
    if (!reel.id) reel.id = 'reel-' + Date.now();

    // Cache to in-memory cloud list first
    if (!window._cachedCloudReels) window._cachedCloudReels = [];
    const existingIdx = window._cachedCloudReels.findIndex(r => r.id === reel.id);
    if (existingIdx >= 0) window._cachedCloudReels[existingIdx] = reel;
    else window._cachedCloudReels.unshift(reel);

    // Cache to localStorage
    try {
      let local = [];
      const raw = localStorage.getItem('bongbangla_reels');
      if (raw) local = JSON.parse(raw) || [];
      local = local.filter(r => r && r.id && !r.id.match(/^reel-[csvfj]\d+$/));
      const idx = local.findIndex(r => r.id === reel.id);
      if (idx >= 0) local[idx] = reel;
      else local.unshift(reel);
      localStorage.setItem('bongbangla_reels', JSON.stringify(local));
    } catch(e) {}

    const client = await ensureClient();
    if (client) {
      try {
        const payload = {
          id: reel.id,
          category: reel.category,
          title: reel.title,
          client: reel.client || 'BongBangla Client',
          tag: reel.tag || '4K CINEMA',
          views: reel.views || '১.৫M ভিউজ',
          video_url: reel.videoUrl || reel.video_url || '',
          thumbnail_url: reel.thumbnail || reel.thumbnail_url || '',
          created_at: reel.created_at || new Date().toISOString()
        };

        const { data, error } = await client
          .from('reels')
          .upsert([payload])
          .select();

        if (error) {
          console.error('❌ Supabase addReel error:', error);
          throw error;
        } else {
          console.log('✅ Reel synced to Supabase:', reel.id, data);
        }
      } catch (err) {
        console.error('Error syncing reel to Supabase:', err);
        throw err;
      }
    }
    return reel;
  }

  async function deleteReel(id) {
    if (window._cachedCloudReels) {
      window._cachedCloudReels = window._cachedCloudReels.filter(r => r.id !== id);
    }
    try {
      const raw = localStorage.getItem('bongbangla_reels');
      if (raw) {
        const local = JSON.parse(raw);
        if (Array.isArray(local)) {
          const filtered = local.filter(r => r.id !== id);
          localStorage.setItem('bongbangla_reels', JSON.stringify(filtered));
        }
      }
      const delRaw = localStorage.getItem('bongbangla_deleted_reels') || '[]';
      const delList = JSON.parse(delRaw);
      if (!delList.includes(id)) {
        delList.push(id);
        localStorage.setItem('bongbangla_deleted_reels', JSON.stringify(delList));
      }
    } catch(e) {}

    const client = await ensureClient();
    if (client) {
      try {
        await client
          .from('reels')
          .delete()
          .eq('id', id);
        console.log('🗑️ Reel deleted from Supabase:', id);
      } catch (err) {
        console.error('Error deleting reel from Supabase:', err);
      }
    }
  }

  /* ==========================================================================
     3. Models Roster Sync (Full Profile & Gallery Support)
     ========================================================================== */
  async function fetchModels() {
    const client = await ensureClient();
    if (client) {
      try {
        const { data, error } = await client
          .from('models')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          let localModels = [];
          try {
            const raw = localStorage.getItem('bongbangla_models');
            if (raw) localModels = JSON.parse(raw);
            if (!Array.isArray(localModels)) localModels = [];
            localModels = localModels.filter(m => !isMockModelId(m.id));
          } catch(e) {}

          const mapped = data.map(d => {
            const local = localModels.find(lm => lm.id === d.id) || {};
            return {
              id: d.id,
              name: d.name,
              category: d.category,
              height: d.height || local.height || "৫'৭\"",
              shoots: d.shoots || local.shoots || "২০+",
              image: d.image_url || d.image || local.image || '',
              available: d.available !== false,
              age: d.age || local.age || '',
              measurements: d.measurements || local.measurements || '',
              skinTone: d.skin_tone || d.skinTone || local.skinTone || '',
              eyeColor: d.eye_color || d.eyeColor || local.eyeColor || '',
              hairColor: d.hair_color || d.hairColor || local.hairColor || '',
              location: d.location || local.location || 'ঢাকা, বাংলাদেশ',
              experience: d.experience || local.experience || '',
              instagram: d.instagram || local.instagram || '',
              specialties: d.specialties || local.specialties || '',
              bio: d.bio || local.bio || '',
              gallery: Array.isArray(d.gallery) && d.gallery.length > 0 ? d.gallery : (Array.isArray(local.gallery) ? local.gallery : [])
            };
          });

          // Note: Cloud database is the single source of truth.
          const validMapped = mapped.filter(m => !isMockModelId(m.id));
          window._cachedCloudModels = validMapped;

          try {
            const sanitized = validMapped.map(m => {
              const c = { ...m };
              if (typeof c.image === 'string' && c.image.startsWith('data:') && c.image.length > 30000) {
                c.image = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
              }
              if (Array.isArray(c.gallery)) {
                c.gallery = c.gallery.map(g => {
                  if (g && typeof g.url === 'string' && g.url.startsWith('data:') && g.url.length > 30000) {
                    return { ...g, url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' };
                  }
                  return g;
                });
              }
              return c;
            });
            localStorage.setItem('bongbangla_models', JSON.stringify(sanitized));
          } catch(e) {
            console.warn('localStorage quota warning in fetchModels, skipped local cache:', e);
          }
          return validMapped;
        }
      } catch (err) {
        console.warn('Error fetching models from Supabase:', err);
      }
    }

    if (window._cachedCloudModels && Array.isArray(window._cachedCloudModels) && window._cachedCloudModels.length > 0) {
      return window._cachedCloudModels;
    }

    try {
      const local = JSON.parse(localStorage.getItem('bongbangla_models') || '[]');
      if (Array.isArray(local) && local.length > 0) {
        return local.filter(m => !isMockModelId(m.id));
      }
    } catch (e) {}
    return [];
  }

  function isMockModelId(id) {
    if (!id) return true;
    return ['M-1', 'M-2', 'M-3', 'M-4', 'M-101', 'M-102', 'M-103', 'M-104', 'M-1791099527539'].includes(id);
  }

  async function addModel(model) {
    if (!model || isMockModelId(model.id)) {
      console.log('Blocked addModel for banned or mock ID:', model ? model.id : null);
      return;
    }
    // Update in-memory cloud cache immediately
    if (!window._cachedCloudModels) window._cachedCloudModels = [];
    const idx = window._cachedCloudModels.findIndex(m => m.id === model.id);
    if (idx >= 0) window._cachedCloudModels[idx] = { ...model };
    else window._cachedCloudModels.unshift({ ...model });

    const client = await ensureClient();
    if (client) {
      try {
        const payload = {
          id: model.id,
          name: model.name,
          category: model.category,
          height: model.height || "৫'৭\"",
          shoots: model.shoots || "২০+",
          image_url: model.image || '',
          available: model.available !== false,
          age: model.age || '',
          measurements: model.measurements || '',
          skin_tone: model.skinTone || '',
          eye_color: model.eyeColor || '',
          hair_color: model.hairColor || '',
          location: model.location || 'ঢাকা, বাংলাদেশ',
          experience: model.experience || '',
          instagram: model.instagram || '',
          specialties: model.specialties || '',
          bio: model.bio || '',
          gallery: Array.isArray(model.gallery) ? model.gallery : [],
          created_at: new Date().toISOString()
        };
        const { error } = await client
          .from('models')
          .upsert([payload]);
        if (error) {
          console.error('Supabase addModel error:', error);
        } else {
          console.log('✅ Model synced to Supabase:', model.id);
        }
      } catch (err) {
        console.error('Error adding model to Supabase:', err);
      }
    }
  }

  async function updateModel(model) {
    if (window._cachedCloudModels) {
      const idx = window._cachedCloudModels.findIndex(m => m.id === model.id);
      if (idx >= 0) window._cachedCloudModels[idx] = { ...window._cachedCloudModels[idx], ...model };
    }

    const client = await ensureClient();
    if (client) {
      try {
        const payload = {
          name: model.name,
          category: model.category,
          height: model.height,
          shoots: model.shoots,
          image_url: model.image,
          available: model.available !== false,
          age: model.age || '',
          measurements: model.measurements || '',
          skin_tone: model.skinTone || '',
          eye_color: model.eyeColor || '',
          hair_color: model.hairColor || '',
          location: model.location || 'ঢাকা, বাংলাদেশ',
          experience: model.experience || '',
          instagram: model.instagram || '',
          specialties: model.specialties || '',
          bio: model.bio || '',
          gallery: Array.isArray(model.gallery) ? model.gallery : []
        };
        const { error } = await client
          .from('models')
          .update(payload)
          .eq('id', model.id);
        if (error) {
          console.error('Supabase updateModel error:', error);
        } else {
          console.log('✅ Model updated in Supabase:', model.id);
        }
      } catch (err) {
        console.error('Error updating model in Supabase:', err);
      }
    }
  }

  async function deleteModel(id) {
    if (window._cachedCloudModels) {
      window._cachedCloudModels = window._cachedCloudModels.filter(m => m.id !== id);
    }
    try {
      const raw = localStorage.getItem('bongbangla_models');
      if (raw) {
        const local = JSON.parse(raw);
        if (Array.isArray(local)) {
          const filtered = local.filter(m => m.id !== id);
          localStorage.setItem('bongbangla_models', JSON.stringify(filtered));
        }
      }
      const delRaw = localStorage.getItem('bongbangla_deleted_models') || '[]';
      const delList = JSON.parse(delRaw);
      if (!delList.includes(id)) {
        delList.push(id);
        localStorage.setItem('bongbangla_deleted_models', JSON.stringify(delList));
      }
    } catch(e) {}

    const client = await ensureClient();
    if (client) {
      try {
        await client
          .from('models')
          .delete()
          .eq('id', id);
        console.log('🗑️ Model deleted from Supabase:', id);
      } catch (err) {
        console.error('Error deleting model from Supabase:', err);
      }
    }
  }

  /* ==========================================================================
     4a. Hero Slides Sync
     ========================================================================== */
  async function fetchHeroSlides() {
    const client = await ensureClient();
    if (client) {
      try {
        const { data, error } = await client
          .from('hero_slides')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          const mapped = data.map(d => ({
            id: d.id,
            title: d.title || 'হিরো স্লাইড',
            tag: d.tag || '4K REC',
            image: d.image || d.image_url || ''
          }));
          window._cachedCloudHeroSlides = mapped;
          try {
            localStorage.setItem('bongbangla_hero_slides', JSON.stringify(mapped));
          } catch(e) {}
          return mapped;
        }
      } catch (err) {
        console.warn('Error fetching hero slides from Supabase:', err);
      }
    }

    if (window._cachedCloudHeroSlides && Array.isArray(window._cachedCloudHeroSlides)) {
      return window._cachedCloudHeroSlides;
    }

    // Fallback to localStorage
    try {
      const local = JSON.parse(localStorage.getItem('bongbangla_hero_slides') || '[]');
      if (Array.isArray(local)) return local;
    } catch(e) {}
    return [];
  }

  async function addHeroSlide(slide) {
    if (!slide) return null;
    if (!slide.id) slide.id = 'hero-' + Date.now();

    // Cache in memory immediately
    if (!window._cachedCloudHeroSlides) window._cachedCloudHeroSlides = [];
    const existingIdx = window._cachedCloudHeroSlides.findIndex(s => s.id === slide.id);
    if (existingIdx >= 0) window._cachedCloudHeroSlides[existingIdx] = slide;
    else window._cachedCloudHeroSlides.unshift(slide);

    // Cache to localStorage
    try {
      let local = [];
      const raw = localStorage.getItem('bongbangla_hero_slides');
      if (raw) local = JSON.parse(raw) || [];
      const idx = local.findIndex(s => s.id === slide.id);
      if (idx >= 0) local[idx] = slide;
      else local.unshift(slide);
      localStorage.setItem('bongbangla_hero_slides', JSON.stringify(local));
    } catch(e) {}

    const client = await ensureClient();
    if (client) {
      try {
        const payload = {
          id: slide.id,
          title: slide.title || 'হিরো স্লাইড',
          tag: slide.tag || '4K REC',
          image: slide.image || slide.image_url || '',
          created_at: new Date().toISOString()
        };
        const { error } = await client
          .from('hero_slides')
          .upsert([payload]);
        if (error) {
          console.error('Supabase addHeroSlide error:', error);
        } else {
          console.log('✅ Hero slide synced to Supabase:', slide.id);
        }
      } catch(err) {
        console.error('Error adding hero slide to Supabase:', err);
      }
    }
    return slide;
  }

  async function deleteHeroSlide(id) {
    if (window._cachedCloudHeroSlides) {
      window._cachedCloudHeroSlides = window._cachedCloudHeroSlides.filter(s => s.id !== id);
    }
    try {
      const raw = localStorage.getItem('bongbangla_hero_slides');
      if (raw) {
        const local = JSON.parse(raw);
        if (Array.isArray(local)) {
          const filtered = local.filter(s => s.id !== id);
          localStorage.setItem('bongbangla_hero_slides', JSON.stringify(filtered));
        }
      }
    } catch(e) {}

    const client = await ensureClient();
    if (client) {
      try {
        await client
          .from('hero_slides')
          .delete()
          .eq('id', id);
        console.log('🗑️ Hero slide deleted from Supabase:', id);
      } catch(err) {
        console.error('Error deleting hero slide from Supabase:', err);
      }
    }
  }

  function subscribeToHeroSlides(callback) {
    const client = getClient();
    if (client) {
      try {
        return client
          .channel('public:hero_slides:realtime')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'hero_slides' }, payload => {
            if (callback) callback(payload);
          })
          .subscribe();
      } catch (e) {}
    }
    return null;
  }

  /* ==========================================================================
     5. Cloud Site Settings & Pricing Synchronization (Global Database Storage)
     ========================================================================== */
  async function fetchSiteSetting(key) {
    try {
      const client = await ensureClient();
      if (!client) return null;
      const { data, error } = await client
        .from('reviews')
        .select('*')
        .eq('id', 'setting_' + key)
        .limit(1);

      if (error) {
        console.warn(`Supabase fetchSiteSetting("${key}") notice:`, error.message);
        return null;
      }
      if (data && data[0] && data[0].comment) {
        try {
          return JSON.parse(data[0].comment);
        } catch(pe) {
          return data[0].comment;
        }
      }
    } catch (e) {
      console.warn(`fetchSiteSetting("${key}") exception:`, e);
    }
    return null;
  }

  async function saveSiteSetting(key, value) {
    try {
      const client = await ensureClient();
      if (!client) return false;
      const payload = {
        id: 'setting_' + key,
        name: 'site_settings',
        brand: 'bongbangla',
        comment: typeof value === 'string' ? value : JSON.stringify(value),
        created_at: new Date().toISOString()
      };
      const { error } = await client
        .from('reviews')
        .upsert([payload]);

      if (error) {
        console.warn(`Supabase saveSiteSetting("${key}") error:`, error.message);
        return false;
      }
      console.log(`☁️ Site setting "${key}" saved to Supabase cloud successfully.`);
      return true;
    } catch (e) {
      console.warn(`saveSiteSetting("${key}") exception:`, e);
      return false;
    }
  }

  async function fetchPackages() {
    const cloud = await fetchSiteSetting('packages');
    if (Array.isArray(cloud) && cloud.length > 0) {
      try {
        localStorage.setItem('bongbangla_packages', JSON.stringify(cloud));
      } catch(e) {}
      return cloud;
    }
    return null;
  }

  async function savePackages(packages) {
    try {
      localStorage.setItem('bongbangla_packages', JSON.stringify(packages));
    } catch(e) {}
    return await saveSiteSetting('packages', packages);
  }

  async function fetchCustomizerRates() {
    const cloud = await fetchSiteSetting('customizer_rates');
    if (cloud && typeof cloud === 'object') {
      try {
        localStorage.setItem('bongbangla_customizer_rates', JSON.stringify(cloud));
      } catch(e) {}
      return cloud;
    }
    return null;
  }

  async function saveCustomizerRates(rates) {
    try {
      localStorage.setItem('bongbangla_customizer_rates', JSON.stringify(rates));
    } catch(e) {}
    return await saveSiteSetting('customizer_rates', rates);
  }

  function subscribeToSiteSettings(callback) {
    const client = getClient();
    if (client) {
      try {
        return client
          .channel('public:settings:realtime')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, payload => {
            if (callback) callback(payload);
          })
          .subscribe();
      } catch (e) {}
    }
    return null;
  }

  function subscribeToLeads(callback) {
    if (supabaseClient) {
      try {
        return supabaseClient
          .channel('public:leads:realtime')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, payload => {
            if (callback) callback(payload);
          })
          .subscribe();
      } catch (e) {}
    }
    return null;
  }

  function subscribeToReels(callback) {
    if (supabaseClient) {
      try {
        return supabaseClient
          .channel('public:reels:realtime')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'reels' }, payload => {
            if (callback) callback(payload);
          })
          .subscribe();
      } catch (e) {}
    }
    return null;
  }

  function subscribeToModels(callback) {
    if (supabaseClient) {
      try {
        return supabaseClient
          .channel('public:models:realtime')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'models' }, payload => {
            if (callback) callback(payload);
          })
          .subscribe();
      } catch (e) {}
    }
    return null;
  }

  async function syncLocalDataToSupabase() {
    return;
  }

  async function uploadStorageFile(file, bucket = 'reels', folder = '') {
    if (!supabaseClient || !file) return null;
    try {
      const ext = file.type && file.type.includes('png') ? '.png' : (file.type && file.type.includes('webm') ? '.webm' : (file.type && (file.type.includes('video') || file.type.includes('mp4')) ? '.mp4' : '.jpg'));
      const rawName = file.name || ('file_' + Date.now() + ext);
      const cleanName = Date.now() + '_' + rawName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = folder ? `${folder}/${cleanName}` : cleanName;
      const mimeType = file.type || (cleanName.match(/\.(mp4|mov|m4v)$/i) ? 'video/mp4' : (cleanName.match(/\.(webm)$/i) ? 'video/webm' : (cleanName.match(/\.(png)$/i) ? 'image/png' : 'image/jpeg')));
      
      const { data, error } = await supabaseClient.storage
        .from(bucket)
        .upload(filePath, file, { cacheControl: '3600', upsert: true, contentType: mimeType });

      if (error) {
        console.warn(`Supabase Storage upload to "${bucket}" notice:`, error.message);
        return null;
      }
      const { data: publicData } = supabaseClient.storage
        .from(bucket)
        .getPublicUrl(filePath);
      return publicData ? publicData.publicUrl : null;
    } catch (e) {
      console.warn('Supabase storage exception:', e);
      return null;
    }
  }

  // Auto-init when script loads
  if (typeof window !== 'undefined') {
    initClient();
    if (typeof document !== 'undefined' && document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', () => {
        initClient();
      });
    }
  }

  // Export globally
  window.BongBanglaSupabase = {
    getConfig,
    saveConfig,
    isConfigured,
    initClient,
    ensureClient,
    submitLead,
    saveLead: submitLead,
    fetchLeads,
    updateLeadStatus,
    deleteLead,
    fetchReels,
    addReel,
    deleteReel,
    fetchModels,
    addModel,
    updateModel,
    deleteModel,
    fetchHeroSlides,
    addHeroSlide,
    deleteHeroSlide,
    subscribeToHeroSlides,
    syncLocalDataToSupabase,
    uploadStorageFile,
    fetchSiteSetting,
    saveSiteSetting,
    fetchPackages,
    savePackages,
    fetchCustomizerRates,
    saveCustomizerRates,
    subscribeToSiteSettings,
    subscribeToLeads,
    subscribeToReels,
    subscribeToModels,
    getClient
  };
})();

