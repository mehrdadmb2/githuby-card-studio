// ============================================================
//  LANGUAGE MANAGER – loads language files, supports UI strings
//  Version 2.0 – Fixed manifest loading and caching
// ============================================================
const LanguageManager = (function() {
  let languages = [];
  let currentLang = CONFIG.DEFAULT_LANG;
  let strings = {};
  let isLoaded = false;

  async function loadLanguages() {
    try {
      const res = await fetch(CONFIG.LANGUAGES_MANIFEST);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      languages = data.languages || [];
      console.log('✅ Languages loaded:', languages.map(l => l.id).join(', '));
      return languages;
    } catch (e) {
      console.warn('Failed to load languages manifest, using defaults.', e);
      // Fallback: use the 5 default languages
      languages = [
        { id: 'en', label: 'English', flag: '🇬🇧' },
        { id: 'fa', label: 'فارسی', flag: '🇮🇷' },
        { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
        { id: 'ru', label: 'Русский', flag: '🇷🇺' },
        { id: 'ja', label: '日本語', flag: '🇯🇵' },
        { id: 'es', label: 'Español', flag: '🇪🇸' },
        { id: 'fr', label: 'Français', flag: '🇫🇷' },
        { id: 'ar', label: 'العربية', flag: '🇸🇦' },
        { id: 'tr', label: 'Türkçe', flag: '🇹🇷' },
        { id: 'it', label: 'Italiano', flag: '🇮🇹' },
        { id: 'pt', label: 'Português', flag: '🇵🇹' },
        { id: 'ko', label: '한국어', flag: '🇰🇷' },
        { id: 'zh', label: '中文', flag: '🇨🇳' }
      ];
      return languages;
    }
  }

  async function loadLanguageFile(langId) {
    try {
      const res = await fetch(`assets/languages/${langId}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      console.log(`✅ Language file loaded: ${langId}`);
      return data;
    } catch (e) {
      console.warn(`Failed to load language ${langId}, using fallback.`, e);
      // Return empty object so we don't break
      return {};
    }
  }

  async function setLanguage(langId) {
    if (!langId) langId = CONFIG.DEFAULT_LANG;
    const data = await loadLanguageFile(langId);
    strings = data;
    currentLang = langId;
    localStorage.setItem('pcProLang', langId);
    console.log(`🌍 Language set to: ${langId}`);
    return strings;
  }

  function getString(key, fallback = '') {
    // Try to get the translation, if not found return the key or fallback
    if (strings && strings[key]) {
      return strings[key];
    }
    // Fallback: if we have English loaded, try that
    if (strings && strings[key] === undefined) {
      // Try to get from English fallback (if loaded)
      if (window._enStrings && window._enStrings[key]) {
        return window._enStrings[key];
      }
    }
    return fallback || key;
  }

  function getCurrentLang() { return currentLang; }

  function populateLangSelect(selectEl) {
    if (!selectEl) {
      console.warn('Language select element not found');
      return;
    }
    selectEl.innerHTML = '';
    languages.forEach(l => {
      const opt = document.createElement('option');
      opt.value = l.id;
      opt.textContent = `${l.flag || '🌐'} ${l.label || l.id}`;
      selectEl.appendChild(opt);
    });
    // Set current value
    if (currentLang) {
      selectEl.value = currentLang;
    }
    console.log(`✅ Language select populated with ${languages.length} languages`);
  }

  // Function to load English as fallback (for getString)
  async function loadFallbackEnglish() {
    try {
      const res = await fetch('assets/languages/en.json');
      if (res.ok) {
        window._enStrings = await res.json();
        console.log('✅ English fallback loaded');
      }
    } catch (e) {
      console.warn('Could not load English fallback');
    }
  }

  // Initialize: load languages, set current, load English fallback
  async function init() {
    await loadLanguages();
    await loadFallbackEnglish();
    // Check if we have a saved language
    const savedLang = localStorage.getItem('pcProLang');
    if (savedLang && languages.some(l => l.id === savedLang)) {
      await setLanguage(savedLang);
    } else {
      await setLanguage(CONFIG.DEFAULT_LANG);
    }
    isLoaded = true;
  }

  return {
    init,
    loadLanguages,
    setLanguage,
    getString,
    getCurrentLang,
    populateLangSelect,
    get languages() { return languages; }
  };
})();

window.LanguageManager = LanguageManager;
