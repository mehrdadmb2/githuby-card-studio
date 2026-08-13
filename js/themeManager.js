// ============================================================
//  THEME MANAGER – loads themes from manifest, applies theme
// ============================================================
const ThemeManager = (function() {
  let themes = [];
  let currentTheme = CONFIG.DEFAULT_THEME;

  // Load themes from manifest
  async function loadThemes() {
    try {
      const res = await fetch(CONFIG.THEMES_MANIFEST);
      const data = await res.json();
      themes = data.themes || [];
      return themes;
    } catch (e) {
      console.warn('Failed to load themes manifest, using defaults.', e);
      // Fallback default themes
      themes = [
        { id: 'dark', label: 'Dark', cssClass: 'theme-dark' },
        { id: 'light', label: 'Light', cssClass: 'theme-light' },
        { id: 'glass', label: 'Glassmorphism', cssClass: 'theme-glass' },
        { id: 'sunset', label: 'Sunset', cssClass: 'theme-sunset' },
        { id: 'ocean', label: 'Ocean', cssClass: 'theme-ocean' },
        { id: 'forest', label: 'Forest', cssClass: 'theme-forest' },
        { id: 'night', label: 'Night', cssClass: 'theme-night' },
        { id: 'fire', label: 'Fire', cssClass: 'theme-fire' },
        { id: 'ice', label: 'Ice', cssClass: 'theme-ice' },
        { id: 'candy', label: 'Candy', cssClass: 'theme-candy' },
        { id: 'gold', label: 'Gold', cssClass: 'theme-gold' },
        { id: 'galaxy', label: 'Galaxy', cssClass: 'theme-galaxy' },
        { id: 'neon', label: 'Neon', cssClass: 'theme-neon' },
        { id: 'royal', label: 'Royal', cssClass: 'theme-royal' },
        { id: 'vintage', label: 'Vintage', cssClass: 'theme-vintage' },
        { id: 'cyber', label: 'Cyber', cssClass: 'theme-cyber' },
      ];
      return themes;
    }
  }

  // Populate theme dropdown
  function populateThemeSelect(selectEl) {
    if (!selectEl) return;
    selectEl.innerHTML = '';
    themes.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = t.label || t.id;
      selectEl.appendChild(opt);
    });
    selectEl.value = currentTheme;
  }

  // Apply theme to card preview
  function applyTheme(themeId, cardElement) {
    if (!cardElement) return;
    // Remove all theme classes
    themes.forEach(t => {
      if (t.cssClass) cardElement.classList.remove(t.cssClass.replace('.', ''));
    });
    const found = themes.find(t => t.id === themeId);
    if (found && found.cssClass) {
      cardElement.classList.add(found.cssClass.replace('.', ''));
    } else {
      // fallback
      cardElement.style.background = '';
      cardElement.style.color = '';
    }
    currentTheme = themeId;
    // Save preference
    localStorage.setItem('pcProTheme', themeId);
  }

  // Get current theme
  function getCurrentTheme() { return currentTheme; }

  // Public API
  return {
    loadThemes,
    populateThemeSelect,
    applyTheme,
    getCurrentTheme,
    get themes() { return themes; }
  };
})();

window.ThemeManager = ThemeManager;
