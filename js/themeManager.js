// ============================================================
//  THEME MANAGER – loads themes from manifest, applies theme
//  Version 2.1 – Simple, no dynamic CSS loading
// ============================================================
const ThemeManager = (function() {
  let themes = [];
  let currentTheme = CONFIG.DEFAULT_THEME;

  async function loadThemes() {
    try {
      const res = await fetch(CONFIG.THEMES_MANIFEST);
      const data = await res.json();
      themes = data.themes || [];
      return themes;
    } catch (e) {
      console.warn('Failed to load themes manifest, using defaults.', e);
      themes = [
        { id: 'dark', label: 'Dark', category: 'Base' },
        { id: 'light', label: 'Light', category: 'Base' },
        { id: 'glass', label: 'Glassmorphism', category: 'Base' },
        { id: 'sunset', label: 'Sunset', category: 'Gradient' },
        { id: 'ocean', label: 'Ocean', category: 'Gradient' },
        { id: 'forest', label: 'Forest', category: 'Gradient' },
        { id: 'night', label: 'Night', category: 'Gradient' },
        { id: 'fire', label: 'Fire', category: 'Gradient' },
        { id: 'ice', label: 'Ice', category: 'Gradient' },
        { id: 'candy', label: 'Candy', category: 'Gradient' },
        { id: 'gold', label: 'Gold', category: 'Gradient' },
        { id: 'galaxy', label: 'Galaxy', category: 'Gradient' },
        { id: 'neon', label: 'Neon', category: 'Gradient' },
        { id: 'royal', label: 'Royal', category: 'Gradient' },
        { id: 'vintage', label: 'Vintage', category: 'Gradient' },
        { id: 'cyber', label: 'Cyber', category: 'Gradient' },
      ];
      return themes;
    }
  }

  function populateThemeSelect(selectEl) {
    if (!selectEl) return;
    selectEl.innerHTML = '';
    
    const groups = {};
    themes.forEach(t => {
      const cat = t.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(t);
    });
    
    const order = ['Base', 'Event', 'Gradient', 'Other'];
    for (const cat of order) {
      if (groups[cat]) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = cat;
        groups[cat].forEach(t => {
          const opt = document.createElement('option');
          opt.value = t.id;
          opt.textContent = t.label || t.id;
          optgroup.appendChild(opt);
        });
        selectEl.appendChild(optgroup);
      }
    }
    selectEl.value = currentTheme;
  }

  function applyTheme(themeId, cardElement) {
    if (!cardElement) return;
    
    // Remove all theme-* classes
    themes.forEach(t => {
      const cls = `theme-${t.id}`;
      cardElement.classList.remove(cls);
    });
    
    // Add the new theme class
    const className = `theme-${themeId}`;
    cardElement.classList.add(className);
    
    currentTheme = themeId;
    localStorage.setItem('pcProTheme', themeId);
    
    console.log(`✅ Theme applied: ${themeId}`);
  }

  function getCurrentTheme() { return currentTheme; }
  function getThemeById(id) { return themes.find(t => t.id === id); }

  return {
    loadThemes,
    populateThemeSelect,
    applyTheme,
    getCurrentTheme,
    getThemeById,
    get themes() { return themes; }
  };
})();

window.ThemeManager = ThemeManager;
