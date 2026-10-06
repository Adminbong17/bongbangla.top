/**
 * BongBangla Media & Creative Lab
 * High-Speed Media Vault & CDN Integration
 * 
 * Base Vault API Host: https://api.bongbangla.top/vault-api
 * Web UI: https://vault.bongbangla.top
 * 
 * Routes media & 4K video assets to the private Media Vault CDN to save costs & limits,
 * providing ultra-fast 4K streaming and high-res image delivery with HTTP byte-range support.
 */

(function() {
  const VAULT_STORAGE_KEY = 'bongbangla_vault_config';
  const VAULT_TOKEN_KEY = 'bongbangla_vault_jwt';
  const DEFAULT_VAULT_API = 'https://api.bongbangla.top/vault-api';
  const DEFAULT_VAULT_USER = '';
  const DEFAULT_VAULT_PASS = '';

  function getConfig() {
    try {
      const saved = localStorage.getItem(VAULT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        let url = (parsed.url || DEFAULT_VAULT_API).trim().replace(/\/+$/, '');
        // If user configured vault.bongbangla.top, point to the underlying API endpoint
        if (url === 'https://vault.bongbangla.top' || url === 'http://vault.bongbangla.top') {
          url = DEFAULT_VAULT_API;
        }
        return {
          url: url,
          user: (parsed.user || DEFAULT_VAULT_USER).trim(),
          pass: (parsed.pass || DEFAULT_VAULT_PASS).trim()
        };
      }
    } catch(e) {}

    return {
      url: (window.VAULT_URL || DEFAULT_VAULT_API).replace(/\/+$/, ''),
      user: (window.VAULT_USER || DEFAULT_VAULT_USER).trim(),
      pass: (window.VAULT_PASS || DEFAULT_VAULT_PASS).trim()
    };
  }

  function saveConfig(url, user, pass) {
    let cleanUrl = (url || DEFAULT_VAULT_API).trim().replace(/\/+$/, '');
    if (cleanUrl === 'https://vault.bongbangla.top' || cleanUrl === 'http://vault.bongbangla.top') {
      cleanUrl = DEFAULT_VAULT_API;
    }
    const config = {
      url: cleanUrl,
      user: (user || DEFAULT_VAULT_USER).trim(),
      pass: (pass || DEFAULT_VAULT_PASS).trim()
    };
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(config));
    // Clear old token to force re-auth
    localStorage.removeItem(VAULT_TOKEN_KEY);
    window.VAULT_URL = config.url;
    window.VAULT_USER = config.user;
    window.VAULT_PASS = config.pass;
    console.log('⚡ BongBangla Media Vault Config Updated:', config.url, `(User: ${config.user})`);
    return config;
  }

  function getVaultBaseUrl() {
    return getConfig().url;
  }

  function setVaultBaseUrl(url) {
    const cfg = getConfig();
    return saveConfig(url, cfg.user, cfg.pass).url;
  }

  /**
   * Retrieves or fetches a valid JWT Bearer token from the Vault API
   */
  async function getVaultToken() {
    try {
      const cached = localStorage.getItem(VAULT_TOKEN_KEY);
      if (cached && cached.length > 20) {
        return cached;
      }
    } catch(e) {}

    const cfg = getConfig();
    try {
      const res = await fetch(`${cfg.url}/login.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: cfg.user,
          password: cfg.pass
        })
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.token) {
          try {
            localStorage.setItem(VAULT_TOKEN_KEY, data.token);
          } catch(e) {}
          return data.token;
        }
      }
    } catch(err) {
      console.warn('Vault login error:', err);
    }
    return null;
  }

  /**
   * Formats any media path or filename into a fully qualified CDN URL
   */
  function formatMediaUrl(path, defaultFolder = '') {
    if (!path || typeof path !== 'string') return '';
    const trimmed = path.trim();
    if (!trimmed) return '';

    // Direct web protocols / data URIs / blob URIs
    if (/^(https?:|\/\/|data:|blob:)/i.test(trimmed)) {
      return trimmed;
    }

    // If it's a 32-char share token
    if (/^[a-f0-9]{32}$/i.test(trimmed)) {
      return `${getConfig().url}/share.php?t=${trimmed}`;
    }

    const base = getVaultBaseUrl();
    let cleanPath = trimmed.replace(/^\/+/, '');

    if (defaultFolder && !cleanPath.includes('/')) {
      const cleanFolder = defaultFolder.replace(/^\/+|\/+$/g, '');
      cleanPath = `${cleanFolder}/${cleanPath}`;
    }

    return `${base}/${cleanPath}`;
  }

  /**
   * Compresses and converts an image file to a high quality Data URL
   */
  function fileToDataUrl(file, maxWidth = 1200, quality = 0.85) {
    return new Promise((resolve) => {
      if (!file) return resolve('');
      if (!file.type || !file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result || '');
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            let width = img.width || 800;
            let height = img.height || 1000;

            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(dataUrl);
          } catch(err) {
            resolve(e.target.result);
          }
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  }

  /**
   * Uploads a file directly to the BongBangla Media Vault CDN API
   * Handles 4K videos (MP4/MOV/WEBM) and high-res photos.
   * Returns a public streaming URL with byte-range support.
   */
  async function uploadMedia(file, folder = 'uploads') {
    if (!file) return { success: false, url: '', message: 'No file selected' };

    const cfg = getConfig();
    const ext = file.type && file.type.includes('png') ? '.png' : 
                (file.type && file.type.includes('webm') ? '.webm' : 
                (file.type && (file.type.includes('video') || file.type.includes('mp4')) ? '.mp4' : '.jpg'));
    const rawName = file.name || ('media_' + Date.now() + ext);
    const cleanFileName = rawName.replace(/[^a-zA-Z0-9._-]/g, '_');

    // 1. PRIMARY: Upload directly to Media Vault API
    try {
      const token = await getVaultToken();
      if (token) {
        const formData = new FormData();
        formData.append('file', file, cleanFileName);

        const res = await fetch(`${cfg.url}/upload.php`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          body: formData
        });

        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          if (data.ok && data.share_token) {
            const publicUrl = `${cfg.url}/share.php?t=${data.share_token}`;
            console.log('⚡ File successfully stored in Media Vault CDN:', publicUrl);
            return {
              success: true,
              url: publicUrl,
              share_token: data.share_token,
              id: data.id,
              filename: cleanFileName,
              storage: 'vault'
            };
          }
        } else if (res.status === 401) {
          // Token expired, clear token and retry once
          localStorage.removeItem(VAULT_TOKEN_KEY);
          const freshToken = await getVaultToken();
          if (freshToken) {
            const formData2 = new FormData();
            formData2.append('file', file, cleanFileName);
            const retryRes = await fetch(`${cfg.url}/upload.php`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${freshToken}`,
                'Accept': 'application/json'
              },
              body: formData2
            });
            if (retryRes.ok) {
              const retryData = await retryRes.json().catch(() => ({}));
              if (retryData.ok && retryData.share_token) {
                const publicUrl = `${cfg.url}/share.php?t=${retryData.share_token}`;
                console.log('⚡ File successfully stored in Media Vault CDN (after retry):', publicUrl);
                return {
                  success: true,
                  url: publicUrl,
                  share_token: retryData.share_token,
                  id: retryData.id,
                  filename: cleanFileName,
                  storage: 'vault'
                };
              }
            }
          }
        }
      }
    } catch(err) {
      console.warn('Vault upload API exception, trying secondary backup:', err);
    }

    // 2. SECONDARY BACKUP: If Vault API is temporarily unreachable, fallback to Supabase Storage
    if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.uploadStorageFile === 'function') {
      try {
        const bucket = (folder === 'reels' || folder.includes('video')) ? 'reels' : (folder === 'models' ? 'models' : 'media');
        const cloudUrl = await window.BongBanglaSupabase.uploadStorageFile(file, bucket, folder);
        if (cloudUrl) {
          console.log('☁️ Backup uploaded to Supabase Storage:', cloudUrl);
          return {
            success: true,
            url: cloudUrl,
            filename: cleanFileName,
            storage: 'supabase'
          };
        }
      } catch(e) {
        console.warn('Supabase storage fallback error:', e);
      }
    }

    return {
      success: false,
      url: '',
      filename: cleanFileName,
      message: 'Failed to upload to both Vault and Supabase'
    };
  }

  // Presets helper
  const Presets = {
    reels: (filename) => formatMediaUrl(filename, 'reels'),
    models: (filename) => formatMediaUrl(filename, 'models'),
    hero: (filename) => formatMediaUrl(filename, 'hero'),
    ads: (filename) => formatMediaUrl(filename, 'ads'),
    thumbnails: (filename) => formatMediaUrl(filename, 'thumbnails')
  };

  // Expose globally
  const currentCfg = getConfig();
  window.VAULT_URL = currentCfg.url;
  window.VAULT_USER = currentCfg.user;
  window.VAULT_PASS = currentCfg.pass;

  window.BongBanglaVault = {
    getConfig,
    saveConfig,
    getBaseUrl: getVaultBaseUrl,
    setBaseUrl: setVaultBaseUrl,
    getVaultToken,
    uploadMedia,
    fileToDataUrl,
    formatMediaUrl,
    formatUrl: formatMediaUrl,
    Presets,
    defaultHost: DEFAULT_VAULT_API,
    defaultUser: DEFAULT_VAULT_USER
  };

  console.log('⚡ BongBangla Media Vault Connected: https://api.bongbangla.top/vault-api (Account: ' + currentCfg.user + ')');
})();
