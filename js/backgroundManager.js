// ============================================================
//  BACKGROUND MANAGER – loads background images from manifest
// ============================================================
const BackgroundManager = (function() {
  let backgrounds = [];

  async function loadBackgrounds() {
    try {
      const res = await fetch(CONFIG.BACKGROUNDS_MANIFEST);
      const data = await res.json();
      backgrounds = data.images || [];
      return backgrounds;
    } catch (e) {
      console.warn('No backgrounds manifest found.', e);
      backgrounds = [];
      return backgrounds;
    }
  }

  function getBackgroundUrl(filename) {
    return `assets/backgrounds/${filename}`;
  }

  function getBackgrounds() { return backgrounds; }

  return {
    loadBackgrounds,
    getBackgroundUrl,
    getBackgrounds
  };
})();

window.BackgroundManager = BackgroundManager;
