// ============================================================
//  THEME MANAGER – loads themes from manifest, applies theme
//  Version 2.1 – with dynamic CSS loading
// ============================================================
const ThemeManager = (function() {
  let themes = [];
  let currentTheme = CONFIG.DEFAULT_THEME;
  let loadedCss = {}; // cache loaded CSS files

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
        { id: 'dark', label: 'Dark', cssFile: 'css/base/dark.css', category: 'Base' },
        { id: 'light', label: 'Light', cssFile: 'css/base/light.css', category: 'Base' },
        { id: 'glass', label: 'Glassmorphism', cssFile: 'css/base/glass.css', category: 'Base' },
        { id: 'sunset', label: 'Sunset', cssFile: 'css/gradient/sunset.css', category: 'Gradient' },
        { id: 'ocean', label: 'Ocean', cssFile: 'css/gradient/ocean.css', category: 'Gradient' },
        { id: 'forest', label: 'Forest', cssFile: 'css/gradient/forest.css', category: 'Gradient' },
        { id: 'night', label: 'Night', cssFile: 'css/gradient/night.css', category: 'Gradient' },
        { id: 'fire', label: 'Fire', cssFile: 'css/gradient/fire.css', category: 'Gradient' },
        { id: 'ice', label: 'Ice', cssFile: 'css/gradient/ice.css', category: 'Gradient' },
        { id: 'candy', label: 'Candy', cssFile: 'css/gradient/candy.css', category: 'Gradient' },
        { id: 'gold', label: 'Gold', cssFile: 'css/gradient/gold.css', category: 'Gradient' },
        { id: 'galaxy', label: 'Galaxy', cssFile: 'css/gradient/galaxy.css', category: 'Gradient' },
        { id: 'neon', label: 'Neon', cssFile: 'css/gradient/neon.css', category: 'Gradient' },
        { id: 'royal', label: 'Royal', cssFile: 'css/gradient/royal.css', category: 'Gradient' },
        { id: 'vintage', label: 'Vintage', cssFile: 'css/gradient/vintage.css', category: 'Gradient' },
        { id: 'cyber', label: 'Cyber', cssFile: 'css/gradient/cyber.css', category: 'Gradient' },
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

  // Load CSS file dynamically
  function loadThemeCss(cssFile) {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (loadedCss[cssFile]) {
        resolve();
        return;
      }
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `assets/themes/${cssFile}`;
      link.onload = () => {
        loadedCss[cssFile] = true;
        resolve();
      };
      link.onerror = () => {
        console.warn(`Failed to load theme CSS: ${cssFile}`);
        resolve(); // Continue even if failed
      };
      document.head.appendChild(link);
    });
  }

  async function applyTheme(themeId, cardElement) {
    if (!cardElement) return;
    
    const found = themes.find(t => t.id === themeId);
    if (!found) {
      console.warn(`Theme ${themeId} not found.`);
      return;
    }

    // Remove all theme classes
    themes.forEach(t => {
      if (t.cssFile) {
        // We don't remove classes here, we just load CSS
        // The CSS file will define the class
      }
    });

    // Load the CSS file for the theme
    if (found.cssFile) {
      await loadThemeCss(found.cssFile);
    }

    // Apply the class to the element
    // The class name is derived from the theme id
    const className = `theme-${themeId}`;
    // Remove all theme-* classes
    themes.forEach(t => {
      const cls = `theme-${t.id}`;
      cardElement.classList.remove(cls);
    });
    cardElement.classList.add(className);

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
