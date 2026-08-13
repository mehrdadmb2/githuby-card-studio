// ============================================================
//  LANGUAGE MANAGER – loads language files, supports UI strings
// ============================================================
const LanguageManager = (function() {
  let languages = [];
  let currentLang = CONFIG.DEFAULT_LANG;
  let strings = {};

  async function loadLanguages() {
    try {
      const res = await fetch(CONFIG.LANGUAGES_MANIFEST);
      const data = await res.json();
      languages = data.languages || [];
      return languages;
    } catch (e) {
      console.warn('Using default language list.', e);
      languages = [
        { id: 'en', label: 'English', flag: '🇬🇧' },
        { id: 'fa', label: 'فارسی', flag: '🇮🇷' },
        { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
        { id: 'ru', label: 'Русский', flag: '🇷🇺' },
        { id: 'ja', label: '日本語', flag: '🇯🇵' },
      ];
      return languages;
    }
  }

  async function loadLanguageFile(langId) {
    try {
      const res = await fetch(`assets/languages/${langId}.json`);
      const data = await res.json();
      return data;
    } catch (e) {
      console.warn(`Failed to load language ${langId}`, e);
      return {};
    }
  }

  async function setLanguage(langId) {
    const data = await loadLanguageFile(langId);
    strings = data;
    currentLang = langId;
    localStorage.setItem('pcProLang', langId);
    return strings;
  }

  function getString(key, fallback = '') {
    return strings[key] || fallback;
  }

  function getCurrentLang() { return currentLang; }

  function populateLangSelect(selectEl) {
    if (!selectEl) return;
    selectEl.innerHTML = '';
    languages.forEach(l => {
      const opt = document.createElement('option');
      opt.value = l.id;
      opt.textContent = `${l.flag || ''} ${l.label || l.id}`;
      selectEl.appendChild(opt);
    });
    selectEl.value = currentLang;
  }

  return {
    loadLanguages,
    setLanguage,
    getString,
    getCurrentLang,
    populateLangSelect,
    get languages() { return languages; }
  };
})();

window.LanguageManager = LanguageManager;
