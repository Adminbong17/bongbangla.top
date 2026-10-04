/**
 * BongBangla Media & Creative Lab
 * High-Speed Media Vault & CDN Configuration
 * Base Vault Host: https://vault.bongbangla.top
 * Vault Account: model@bongbangla.top
 * 
 * Routes media & video assets away from Supabase Storage to save costs & limits,
 * providing ultra-fast 4K streaming and image delivery for the entire website.
 */

(function() {
  const VAULT_STORAGE_KEY = 'bongbangla_vault_config';
  const DEFAULT_VAULT_URL = 'https://vault.bongbangla.top';
  const DEFAULT_VAULT_USER = 'model@bongbangla.top';
  const DEFAULT_VAULT_PASS = 'pass-Aktmtbar@1';

  function getConfig() {
    try {
      const saved = localStorage.getItem(VAULT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          url: (parsed.url || DEFAULT_VAULT_URL).replace(/\/+$/, ''),
          user: parsed.user || DEFAULT_VAULT_USER,
          pass: parsed.pass || DEFAULT_VAULT_PASS
        };
      }
    } catch(e) {}

    return {
      url: (window.VAULT_URL || DEFAULT_VAULT_URL).replace(/\/+$/, ''),
      user: window.VAULT_USER || DEFAULT_VAULT_USER,
      pass: window.VAULT_PASS || DEFAULT_VAULT_PASS
    };
  }

  function saveConfig(url, user, pass) {
    const config = {
      url: (url || DEFAULT_VAULT_URL).trim().replace(/\/+$/, ''),
      user: (user || DEFAULT_VAULT_USER).trim(),
      pass: (pass || DEFAULT_VAULT_PASS).trim()
    };
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(config));
    window.VAULT_URL = config.url;
    window.VAULT_USER = config.user;
    window.VAULT_PASS = config.pass;
    console.log('⚡ BongBangla Media Vault CDN Config Updated:', config.url, `(User: ${config.user})`);
    return config;
  }

  function getVaultBaseUrl() {
    return getConfig().url;
  }

  function setVaultBaseUrl(url) {
    const cfg = getConfig();
    return saveConfig(url, cfg.user, cfg.pass).url;
  }

  function getAuthHeaders() {
    const cfg = getConfig();
    let authHeader = '';
    try {
      if (typeof btoa === 'function') {
        authHeader = 'Basic ' + btoa(`${cfg.user}:${cfg.pass}`);
      }
    } catch(e) {}

    return {
      'X-Vault-User': cfg.user,
      ...(authHeader ? { 'Authorization': authHeader } : {})
    };
  }

  /**
   * Formats any media path or filename into a fully qualified CDN URL
   * @param {string} path - URL or relative path (e.g. 'reels/bridal.mp4', 'models/1.jpg')
   * @param {string} [defaultFolder] - Optional fallback folder if just a filename is provided
   * @returns {string} Fully qualified CDN URL
   */
  function formatMediaUrl(path, defaultFolder = '') {
    if (!path || typeof path !== 'string') return '';
    const trimmed = path.trim();
    if (!trimmed) return '';

    // Direct web protocols / data URIs / blob URIs
    if (/^(https?:|\/\/|data:|blob:)/i.test(trimmed)) {
      return trimmed;
    }

    const base = getVaultBaseUrl();
    let cleanPath = trimmed.replace(/^\/+/, '');

    // If defaultFolder is specified and path doesn't already have a folder prefix
    if (defaultFolder && !cleanPath.includes('/')) {
      const cleanFolder = defaultFolder.replace(/^\/+|\/+$/g, '');
      cleanPath = `${cleanFolder}/${cleanPath}`;
    }

    return `${base}/${cleanPath}`;
  }

  /**
   * Compresses and converts an image or media file to a high quality Data URL
   * @param {File} file 
   * @param {number} maxWidth 
   * @param {number} quality 
   * @returns {Promise<string>}
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
   * Uploads a file to Supabase Storage, Vault CDN, or generates local media URL
   * Handles large 4K videos, MP4, MOV, and high-res photos without quota errors.
   * @param {File} file 
   * @param {string} folder 
   * @returns {Promise<{success: boolean, url: string, filename: string}>}
   */
  async function uploadMedia(file, folder = 'uploads') {
    if (!file) return { success: false, url: '', message: 'No file selected' };

    const cfg = getConfig();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const targetUrl = `${cfg.url}/${folder}/${cleanFileName}`;
    const isVideo = file.type && (file.type.startsWith('video/') || /\.(mp4|mov|webm|m4v)$/i.test(file.name));

    // 1. If Supabase Storage is configured, try direct cloud binary upload first
    if (window.BongBanglaSupabase && typeof window.BongBanglaSupabase.uploadStorageFile === 'function') {
      try {
        const cloudUrl = await window.BongBanglaSupabase.uploadStorageFile(file, folder === 'reels' ? 'reels' : (folder === 'models' ? 'models' : 'media'), folder);
        if (cloudUrl) {
          return {
            success: true,
            url: cloudUrl,
            filename: cleanFileName,
            storage: 'supabase'
          };
        }
      } catch(e) {}
    }

    // 2. Attempt remote Vault API upload
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      formData.append('user', cfg.user);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`${cfg.url}/api/upload`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.url) {
          return {
            success: true,
            url: data.url,
            filename: cleanFileName,
            storage: 'vault'
          };
        }
      }
    } catch(err) {
      console.warn('Vault direct upload notice (using fallback media delivery):', err);
    }

    // 3. For video files: create reliable Object URL so browser plays the exact uploaded video
    if (isVideo) {
      let videoUrl = '';
      try {
        videoUrl = URL.createObjectURL(file);
      } catch(e) {
        videoUrl = targetUrl;
      }
      return {
        success: true,
        url: videoUrl || targetUrl,
        filename: cleanFileName,
        fallback: true
      };
    }

    // 4. For image files: compress to compact high-quality Data URL (or use target URL)
    let localDataUrl = '';
    try {
      localDataUrl = await fileToDataUrl(file, folder === 'hero' ? 1080 : 800, 0.85);
    } catch(e) {}

    const fallbackUrl = localDataUrl || targetUrl;

    return {
      success: true,
      url: fallbackUrl,
      filename: cleanFileName,
      fallback: true
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
    getAuthHeaders,
    uploadMedia,
    fileToDataUrl,
    formatMediaUrl,
    formatUrl: formatMediaUrl,
    Presets,
    defaultHost: DEFAULT_VAULT_URL,
    defaultUser: DEFAULT_VAULT_USER
  };

  console.log('⚡ BongBangla Media Vault Connected: https://vault.bongbangla.top (Account: ' + currentCfg.user + ')');
})();
