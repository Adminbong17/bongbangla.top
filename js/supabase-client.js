/**
 * BongBangla Media & Creative Lab
 * Supabase Database & Realtime Integration Client
 * Supports Automatic Cloud Sync with Lovable, GitHub, and Supabase Backend
 */

(function() {
  // Default configuration (can be updated dynamically via Admin panel)
  const CONFIG_KEY = 'bongbangla_supabase_config';
  
  // Read saved config or placeholders
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
    // 1. Always save to LocalStorage as instant local backup
    try {
      const leads = JSON.parse(localStorage.getItem('bongbangla_leads') || '[]');
      leads.unshift(lead);
      localStorage.setItem('bongbangla_leads', JSON.stringify(leads));
    } catch (e) {}

    // 2. If Supabase is connected, insert to Supabase 'leads' table
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
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

        if (!error && data && data.length > 0) {
          // Sync local storage with latest cloud data
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

    // Fallback
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
    if (supabaseClient) {
      try {
        let query = supabaseClient.from('reels').select('*').order('created_at', { ascending: false });
        if (category !== 'all') {
          query = query.eq('category', category);
        }

        const { data, error } = await query;
        if (!error && data !== null) {
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
    if (supabaseClient) {
      try {
        await supabaseClient
          .from('reels')
          .insert([{
            id: reel.id,
            category: reel.category,
            title: reel.title,
            client: reel.client,
            tag: reel.tag,
            views: reel.views,
            video_url: reel.videoUrl,
            thumbnail_url: reel.thumbnail,
            created_at: new Date().toISOString()
          }]);
        console.log('✅ Reel synced to Supabase:', reel.id);
      } catch (err) {
        console.error('Error syncing reel to Supabase:', err);
      }
    }
  }

  async function deleteReel(id) {
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
     3. Models Roster Sync
     ========================================================================== */
  async function fetchModels() {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('models')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          let localModels = [];
          try {
            localModels = JSON.parse(localStorage.getItem('bongbangla_models') || '[]');
          } catch(e) {}

          const mapped = data.map(d => {
            const local = (Array.isArray(localModels) ? localModels.find(lm => lm.id === d.id) : null) || {};
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

          // Merge with any custom local models that were added on this device
          if (Array.isArray(localModels) && localModels.length > 0) {
            localModels.forEach(lm => {
              if (!mapped.some(m => m.id === lm.id) && !['M-1', 'M-2', 'M-3', 'M-4'].includes(lm.id)) {
                mapped.push(lm);
              }
            });
          }

          localStorage.setItem('bongbangla_models', JSON.stringify(mapped));
          return mapped;
        }
      } catch (err) {
        console.warn('Error fetching models from Supabase:', err);
      }
    }

    try {
      const local = JSON.parse(localStorage.getItem('bongbangla_models') || '[]');
      if (Array.isArray(local) && local.length > 0) return local;
    } catch (e) {}
    return [];
  }

  async function addModel(model) {
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
          available: model.available !== false
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
      const cleanName = Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = folder ? `${folder}/${cleanName}` : cleanName;
      const { data, error } = await supabaseClient.storage
        .from(bucket)
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

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
    uploadStorageFile,
    subscribeToLeads,
    subscribeToReels,
    subscribeToModels,
    getClient: () => supabaseClient
  };
})();
