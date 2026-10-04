/**
 * BongBangla Media & Creative Lab
 * High-Speed Media Vault & CDN Configuration
 * Base Vault Host: https://vault.bongbangla.top
 * 
 * Routes media & video assets away from Supabase Storage to save costs & limits,
 * providing ultra-fast 4K streaming and image delivery for the entire website.
 */

(function() {
  const VAULT_STORAGE_KEY = 'bongbangla_vault_config';
  const DEFAULT_VAULT_URL = 'https://vault.bongbangla.top';

  function getVaultBaseUrl() {
    try {
      const saved = localStorage.getItem(VAULT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.url) return parsed.url.replace(/\/+$/, '');
      }
    } catch(e) {}

    return (window.VAULT_URL || DEFAULT_VAULT_URL).replace(/\/+$/, '');
  }

  function setVaultBaseUrl(url) {
    const cleanUrl = (url || DEFAULT_VAULT_URL).trim().replace(/\/+$/, '');
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify({ url: cleanUrl }));
    window.VAULT_URL = cleanUrl;
    console.log('⚡ BongBangla Media Vault CDN Updated:', cleanUrl);
    return cleanUrl;
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

  // Presets helper
  const Presets = {
    reels: (filename) => formatMediaUrl(filename, 'reels'),
    models: (filename) => formatMediaUrl(filename, 'models'),
    hero: (filename) => formatMediaUrl(filename, 'hero'),
    ads: (filename) => formatMediaUrl(filename, 'ads'),
    thumbnails: (filename) => formatMediaUrl(filename, 'thumbnails')
  };

  // Expose globally
  window.VAULT_URL = getVaultBaseUrl();
  window.BongBanglaVault = {
    getBaseUrl: getVaultBaseUrl,
    setBaseUrl: setVaultBaseUrl,
    formatMediaUrl: formatMediaUrl,
    formatUrl: formatMediaUrl,
    Presets: Presets,
    defaultHost: DEFAULT_VAULT_URL
  };

  console.log('⚡ BongBangla Media Vault Connected: https://vault.bongbangla.top');
})();
