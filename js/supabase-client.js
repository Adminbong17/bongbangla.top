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
      url: window.SUPABASE_URL || '',
      anonKey: window.SUPABASE_ANON_KEY || ''
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
    if (config.url && config.anonKey && window.supabase && window.supabase.createClient) {
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
        if (!error && data && data.length > 0) {
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

  // Realtime subscription helper
  function subscribeToLeads(callback) {
    if (supabaseClient) {
      try {
        return supabaseClient
          .channel('public:leads')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, payload => {
            if (callback) callback(payload);
          })
          .subscribe();
      } catch (e) {}
    }
    return null;
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
    subscribeToLeads,
    getClient: () => supabaseClient
  };
})();
