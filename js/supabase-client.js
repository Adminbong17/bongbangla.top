/**
 * BongBangla Media & Creative Lab
 * Supabase Database & Realtime Integration Client
 * Supports Automatic Cloud Sync with Lovable, GitHub, and Supabase Backend
 */

(function() {
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
    if (config.url && config.anonKey && window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        supabaseClient = window.supabase.createClient(config.url, config.anonKey);
        console.log('⚡ BongBangla Supabase Client Connected:', config.url);
        // Trigger background sync of any locally created items
        setTimeout(syncLocalDataToSupabase, 1000);
      } catch (err) {
        console.warn('Supabase initialization error:', err);
        supabaseClient = null;
      }
    } else {
      supabaseClient = null;
    }
  }

  function isConfigured() {
    const config = getConfig();
    return Boolean(config.url && config.anonKey && supabaseClient);
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

    try {
      const leads = JSON.parse(localStorage.getItem('bongbangla_leads') || '[]');
      if (!leads.some(l => l.id === lead.id)) {
        leads.unshift(lead);
        localStorage.setItem('bongbangla_leads', JSON.stringify(leads));
      }
    } catch (e) {}

    if (supabaseClient) {
      try {
        const { error } = await supabaseClient
          .from('leads')
          .insert([{
            id: lead.id,
            name: lead.name,
            brand: lead.brand,
            phone: lead.phone,
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
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
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
          localStorage.setItem('bongbangla_leads', JSON.stringify(mapped));
          return mapped;
        }
      } catch (err) {
        console.warn('Error fetching leads from Supabase, fallback to localStorage:', err);
      }
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
    let client = supabaseClient;
    if (!client && window.supabase && typeof window.supabase.createClient === 'function') {
      const cfg = getConfig();
      try {
        client = window.supabase.createClient(cfg.url, cfg.anonKey);
        supabaseClient = client;
      } catch(e) {}
    }

    if (client) {
      try {
        let query = client.from('reels').select('*').order('created_at', { ascending: false });
        if (category !== 'all') {
          query = query.eq('category', category);
        }

        const { data, error } = await query;
        if (!error && Array.isArray(data)) {
          const mapped = data.map(r => ({
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

          // Check for any un-synced local reels on this device and auto-upload them to Supabase
          try {
            const rawLocal = localStorage.getItem('bongbangla_reels');
            const localReels = rawLocal ? JSON.parse(rawLocal) : [];
            const deletedReels = JSON.parse(localStorage.getItem('bongbangla_deleted_reels') || '[]');

            if (Array.isArray(localReels)) {
              for (const lr of localReels) {
                if (lr && lr.id && !deletedReels.includes(lr.id) && !mapped.some(m => m.id === lr.id)) {
                  console.log('🔄 Auto-syncing un-synced local reel to Supabase:', lr.id, lr.title);
                  addReel(lr).catch(e => console.warn('Auto-sync reel error:', e));
                  if (category === 'all' || lr.category === category) {
                    mapped.unshift(lr);
                  }
                }
              }
            }
          } catch(syncErr) {
            console.warn('Local reels sync check error:', syncErr);
          }

          // Always cache the latest cloud reels to localStorage so other parts of the site can read them synchronously
          if (category === 'all') {
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

    if (window.BongBanglaReels) {
      return window.BongBanglaReels.getReels(category);
    }
    return [];
  }

  async function addReel(reel) {
    if (!reel) return null;
    if (!reel.id) reel.id = 'reel-' + Date.now();

    // Cache to localStorage first
    try {
      let local = [];
      const raw = localStorage.getItem('bongbangla_reels');
      if (raw) local = JSON.parse(raw) || [];
      const idx = local.findIndex(r => r.id === reel.id);
      if (idx >= 0) local[idx] = reel;
      else local.unshift(reel);
      localStorage.setItem('bongbangla_reels', JSON.stringify(local));
    } catch(e) {}

    // Ensure client
    let client = supabaseClient;
    if (!client && window.supabase && typeof window.supabase.createClient === 'function') {
      const cfg = getConfig();
      try {
        client = window.supabase.createClient(cfg.url, cfg.anonKey);
        supabaseClient = client;
      } catch(e) {}
    }

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

    if (supabaseClient) {
      try {
        await supabaseClient
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
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
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
              image: d.image_url || d.image || local.image,
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
              gallery: d.gallery || local.gallery || []
            };
          });

          // Note: Cloud database is the single source of truth.
          // Never auto-upload missing items from local cache, as missing items were intentionally deleted.

          const validMapped = mapped.filter(m => !isMockModelId(m.id));

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
    if (supabaseClient) {
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
        const { error } = await supabaseClient
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
    if (supabaseClient) {
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
        const { error } = await supabaseClient
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

    if (supabaseClient) {
      try {
        await supabaseClient
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
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('hero_slides')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          const mapped = data.map(d => ({
            id: d.id,
            title: d.title || '',
            tag: d.tag || '4K REC',
            image: d.image_url || d.image || ''
          }));
          try {
            localStorage.setItem('bongbangla_hero_slides', JSON.stringify(mapped));
          } catch(e) {}
          return mapped;
        }
      } catch (err) {
        console.warn('Error fetching hero slides from Supabase:', err);
      }
    }
    // Fallback to localStorage
    try {
      const local = JSON.parse(localStorage.getItem('bongbangla_hero_slides') || '[]');
      if (Array.isArray(local)) return local;
    } catch(e) {}
    return [];
  }

  /* ==========================================================================
     4. Automatic Local-to-Cloud Sync Migration Engine
     ========================================================================== */
  async function syncLocalDataToSupabase() {
    // Cloud database is the single source of truth.
    // Do not auto-upload local items because missing items in cloud were intentionally deleted.
    return;
  }

  // Realtime subscription helpers
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
    if (document.readyState === 'loading') {
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
    syncLocalDataToSupabase,
    uploadStorageFile,
    subscribeToLeads,
    subscribeToReels,
    subscribeToModels,
    getClient: () => supabaseClient
  };
})();
