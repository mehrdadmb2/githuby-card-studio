// ============================================================
//  FONT MANAGER – loads fonts from manifest, populates select
// ============================================================
const FontManager = (function() {
  let fonts = [];
  let currentFont = CONFIG.DEFAULT_FONT;

  async function loadFonts() {
    try {
      const res = await fetch(CONFIG.FONTS_MANIFEST);
      const data = await res.json();
      fonts = data.fonts || [];
      return fonts;
    } catch (e) {
      console.warn('Using default font list.', e);
      fonts = [
        { id: 'Roboto', label: 'Roboto', category: 'English' },
        { id: 'Open Sans', label: 'Open Sans', category: 'English' },
        { id: 'Vazirmatn', label: 'وزیرمتن', category: 'فارسی' },
        { id: 'Amiri', label: 'امیری', category: 'فارسی' },
        { id: 'Noto Sans JP', label: 'Noto Sans JP', category: '日本語' },
        { id: 'Noto Sans SC', label: 'Noto Sans SC', category: '中文' },
      ];
      return fonts;
    }
  }

  function populateFontSelect(selectEl) {
    if (!selectEl) return;
    selectEl.innerHTML = '';
    // Group by category
    const groups = {};
    fonts.forEach(f => {
      const cat = f.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(f);
    });
    for (const [cat, items] of Object.entries(groups)) {
      const optgroup = document.createElement('optgroup');
      optgroup.label = cat;
      items.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f.id;
        opt.textContent = f.label || f.id;
        optgroup.appendChild(opt);
      });
      selectEl.appendChild(optgroup);
    }
    selectEl.value = currentFont;
  }

  function applyFont(fontId, cardElement) {
    if (!cardElement) return;
    cardElement.style.fontFamily = fontId + ', sans-serif';
    currentFont = fontId;
    localStorage.setItem('pcProFont', fontId);
  }

  function getCurrentFont() { return currentFont; }

  return {
    loadFonts,
    populateFontSelect,
    applyFont,
    getCurrentFont,
    get fonts() { return fonts; }
  };
})();

window.FontManager = FontManager;
