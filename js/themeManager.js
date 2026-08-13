// ============================================================
//  THEME MANAGER – loads themes from manifest, applies theme
//  Version 2.0 – with category & pattern support
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
      // Fallback with basic themes
      themes = [
        { id: 'dark', label: 'Dark', cssClass: 'theme-dark', category: 'Base' },
        { id: 'light', label: 'Light', cssClass: 'theme-light', category: 'Base' },
        { id: 'glass', label: 'Glassmorphism', cssClass: 'theme-glass', category: 'Base' },
        { id: 'sunset', label: 'Sunset', cssClass: 'theme-sunset', category: 'Gradient' },
        { id: 'ocean', label: 'Ocean', cssClass: 'theme-ocean', category: 'Gradient' },
        { id: 'forest', label: 'Forest', cssClass: 'theme-forest', category: 'Gradient' },
        { id: 'night', label: 'Night', cssClass: 'theme-night', category: 'Gradient' },
        { id: 'fire', label: 'Fire', cssClass: 'theme-fire', category: 'Gradient' },
        { id: 'ice', label: 'Ice', cssClass: 'theme-ice', category: 'Gradient' },
        { id: 'candy', label: 'Candy', cssClass: 'theme-candy', category: 'Gradient' },
        { id: 'gold', label: 'Gold', cssClass: 'theme-gold', category: 'Gradient' },
        { id: 'galaxy', label: 'Galaxy', cssClass: 'theme-galaxy', category: 'Gradient' },
        { id: 'neon', label: 'Neon', cssClass: 'theme-neon', category: 'Gradient' },
        { id: 'royal', label: 'Royal', cssClass: 'theme-royal', category: 'Gradient' },
        { id: 'vintage', label: 'Vintage', cssClass: 'theme-vintage', category: 'Gradient' },
        { id: 'cyber', label: 'Cyber', cssClass: 'theme-cyber', category: 'Gradient' },
      ];
      return themes;
    }
  }

  function populateThemeSelect(selectEl) {
    if (!selectEl) return;
    selectEl.innerHTML = '';
    
    // Group by category
    const groups = {};
    themes.forEach(t => {
      const cat = t.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(t);
    });
    
    // Order: Base, Event, Gradient, Other
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
    // Remove all theme classes
    themes.forEach(t => {
      if (t.cssClass) {
        // Remove class without dot
        const className = t.cssClass.replace(/^\./, '');
        cardElement.classList.remove(className);
      }
    });
    
    const found = themes.find(t => t.id === themeId);
    if (found && found.cssClass) {
      const className = found.cssClass.replace(/^\./, '');
      cardElement.classList.add(className);
    } else {
      // fallback to dark
      cardElement.style.background = '#1a1a2e';
      cardElement.style.color = '#eee';
    }
    currentTheme = themeId;
    localStorage.setItem('pcProTheme', themeId);
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
