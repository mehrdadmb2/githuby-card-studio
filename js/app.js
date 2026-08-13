// ================================================================
//  APP – Main entry point, orchestrates all modules
//  Version: 2.0 (Full Dynamic Template Support)
// ================================================================
(async function() {
  'use strict';

  // 1. Load all manifests
  await ThemeManager.loadThemes();
  await FontManager.loadFonts();
  await LanguageManager.loadLanguages();
  await TemplateManager.loadTemplates();
  await BackgroundManager.loadBackgrounds();

  // 2. Build UI controls dynamically
  const headerControls = document.getElementById('headerControls');
  const controlsContainer = document.getElementById('controlsContainer');

  // --- Header controls: Theme, Font, Language, Reset ---
  headerControls.innerHTML = `
    <select id="themeSelect"></select>
    <select id="fontSelect"></select>
    <select id="langSelect"></select>
    <button id="resetBtn"><i class="fas fa-undo-alt"></i> Reset</button>
  `;

  const themeSelect = document.getElementById('themeSelect');
  const fontSelect = document.getElementById('fontSelect');
  const langSelect = document.getElementById('langSelect');
  const resetBtn = document.getElementById('resetBtn');

  ThemeManager.populateThemeSelect(themeSelect);
  FontManager.populateFontSelect(fontSelect);
  LanguageManager.populateLangSelect(langSelect);

  // --- Controls Panel (all form groups) ---
  controlsContainer.innerHTML = `
    <!-- Event Type -->
    <div class="form-group">
      <label>Event Type</label>
      <select id="eventType">
        <option value="invite">🎉 Invite</option>
        <option value="reconcile">🤝 Reconcile</option>
        <option value="birthday">🎂 Birthday</option>
        <option value="outing">🚗 Outing</option>
        <option value="love">❤️ Love</option>
        <option value="miss">😢 Miss You</option>
        <option value="note">📝 Note</option>
        <option value="poem">📜 Poem</option>
        <option value="art">🎨 Art</option>
      </select>
    </div>

    <!-- Title -->
    <div class="form-group">
      <label>Title</label>
      <input type="text" id="cardTitle" placeholder="e.g. Let's Celebrate!" />
    </div>

    <!-- Text -->
    <div class="form-group">
      <label>Message / Text</label>
      <textarea id="cardText" placeholder="Write your message..."></textarea>
    </div>

    <!-- Date & Time -->
    <div class="form-row">
      <div class="form-group">
        <label>Date</label>
        <input type="date" id="cardDate" />
      </div>
      <div class="form-group">
        <label>Time</label>
        <input type="time" id="cardTime" />
      </div>
    </div>

    <!-- Location & Map -->
    <div class="form-group">
      <label>📍 Location</label>
      <input type="text" id="cardLocation" placeholder="Address" />
      <div id="map"></div>
      <div class="coord-inputs">
        <input type="text" id="latInput" placeholder="Latitude" />
        <input type="text" id="lngInput" placeholder="Longitude" />
      </div>
    </div>

    <!-- Mood -->
    <div class="form-group">
      <label>Mood</label>
      <div class="badge-group" id="moodGroup">
        <span class="badge-option active" data-mood="happy">😊 Happy</span>
        <span class="badge-option" data-mood="kind">🥰 Kind</span>
        <span class="badge-option" data-mood="angry">😤 Angry</span>
        <span class="badge-option" data-mood="bored">😑 Bored</span>
        <span class="badge-option" data-mood="love">😍 Love</span>
        <span class="badge-option" data-mood="sad">😢 Sad</span>
        <span class="badge-option" data-mood="excited">🤩 Excited</span>
        <span class="badge-option" data-mood="calm">😌 Calm</span>
      </div>
    </div>

    <!-- Weather -->
    <div class="form-group">
      <label>Weather</label>
      <div class="badge-group" id="weatherGroup">
        <span class="badge-option active" data-weather="sunny">☀️ Sunny</span>
        <span class="badge-option" data-weather="cloudy">☁️ Cloudy</span>
        <span class="badge-option" data-weather="rainy">🌧️ Rainy</span>
        <span class="badge-option" data-weather="snowy">❄️ Snowy</span>
        <span class="badge-option" data-weather="stormy">⛈️ Stormy</span>
        <span class="badge-option" data-weather="windy">💨 Windy</span>
        <span class="badge-option" data-weather="foggy">🌫️ Foggy</span>
      </div>
    </div>

    <!-- Border Style -->
    <div class="form-group">
      <label>Border Style</label>
      <div class="badge-group" id="borderGroup">
        <span class="badge-option active" data-border="solid">Solid</span>
        <span class="badge-option" data-border="dashed">Dashed</span>
        <span class="badge-option" data-border="dotted">Dotted</span>
        <span class="badge-option" data-border="double">Double</span>
        <span class="badge-option" data-border="groove">Groove</span>
        <span class="badge-option" data-border="ridge">Ridge</span>
        <span class="badge-option" data-border="inset">Inset</span>
        <span class="badge-option" data-border="outset">Outset</span>
        <span class="badge-option" data-border="none">None</span>
      </div>
    </div>

    <!-- Border Color & Width -->
    <div class="form-row">
      <div class="form-group">
        <label>Border Color</label>
        <input type="color" id="borderColor" value="#f5576c" />
      </div>
      <div class="form-group">
        <label>Border Width (px)</label>
        <input type="number" id="borderWidth" value="3" min="0" max="20" />
      </div>
    </div>

    <!-- Background Image Upload -->
    <div class="form-group">
      <label>🖼️ Background Image</label>
      <div class="bg-upload">
        <input type="file" id="bgImageInput" accept="image/*" />
        <button id="removeBgBtn" style="background:rgba(255,0,0,0.15);border:1px solid rgba(255,0,0,0.2);padding:6px 14px;border-radius:30px;color:#ff6b6b;cursor:pointer;">Remove</button>
      </div>
    </div>

    <!-- Advanced Styling -->
    <div class="form-group">
      <label>Font Size (px)</label>
      <input type="range" id="fontSizeRange" min="12" max="36" value="18" />
      <span id="fontSizeLabel">18px</span>
    </div>
    <div class="form-group">
      <label>Line Height</label>
      <input type="range" id="lineHeightRange" min="1.2" max="2.8" step="0.1" value="1.7" />
      <span id="lineHeightLabel">1.7</span>
    </div>
    <div class="form-group">
      <label>Text Color</label>
      <input type="color" id="textColor" value="#ffffff" />
    </div>
    <div class="form-group">
      <label>Shadow (px)</label>
      <input type="range" id="shadowRange" min="0" max="30" value="8" />
      <span id="shadowLabel">8px</span>
    </div>
    <div class="form-group">
      <label>Opacity</label>
      <input type="range" id="opacityRange" min="0.3" max="1.0" step="0.05" value="0.95" />
      <span id="opacityLabel">0.95</span>
    </div>

    <!-- Emoji Picker -->
    <div class="form-group">
      <label>Emojis (click to add/remove)</label>
      <div class="emoji-grid" id="emojiPicker">
        <span>❤️</span><span>🎈</span><span>🌟</span><span>💎</span><span>🌸</span>
        <span>🔥</span><span>🌈</span><span>⭐</span><span>🎁</span><span>🍀</span>
        <span>✨</span><span>💫</span><span>🎵</span><span>📌</span><span>💌</span>
        <span>🌺</span><span>🌻</span><span>🌹</span><span>🍃</span><span>🍂</span>
        <span>❄️</span><span>☀️</span><span>🌙</span><span>⭐</span><span>🌊</span>
        <span>🎉</span><span>🎊</span><span>🥳</span><span>💝</span><span>💖</span>
      </div>
      <div id="selectedEmojis" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;font-size:1.8rem;"></div>
    </div>
  `;

  // 3. Initialize Map
  MapManager.init('map', 35.6892, 51.3890, (lat, lng) => {
    document.getElementById('latInput').value = lat.toFixed(6);
    document.getElementById('lngInput').value = lng.toFixed(6);
    CardManager.updatePreview();
  });

  // 4. Initialize Card Manager with all elements
  const cardElements = {
    title: document.getElementById('cardTitle'),
    text: document.getElementById('cardText'),
    date: document.getElementById('cardDate'),
    time: document.getElementById('cardTime'),
    location: document.getElementById('cardLocation'),
    lat: document.getElementById('latInput'),
    lng: document.getElementById('lngInput'),
    eventType: document.getElementById('eventType'),
    moodGroup: document.getElementById('moodGroup'),
    weatherGroup: document.getElementById('weatherGroup'),
    borderGroup: document.getElementById('borderGroup'),
    fontSize: document.getElementById('fontSizeRange'),
    lineHeight: document.getElementById('lineHeightRange'),
    textColor: document.getElementById('textColor'),
    shadow: document.getElementById('shadowRange'),
    opacity: document.getElementById('opacityRange'),
    borderColor: document.getElementById('borderColor'),
    borderWidth: document.getElementById('borderWidth'),
    emojiPicker: document.getElementById('emojiPicker'),
    bgInput: document.getElementById('bgImageInput'),
  };
  CardManager.init(cardElements);

  // 5. Template Manager – render buttons with full template support
  const templateGrid = document.getElementById('templateGrid');
  TemplateManager.renderTemplateButtons(templateGrid, async (templateId) => {
    const lang = LanguageManager.getCurrentLang();
    const template = await TemplateManager.loadTemplate(templateId);
    if (!template) return;

    // --- Apply all template data ---

    // 1. Title
    const titleInput = document.getElementById('cardTitle');
    if (titleInput && template.title) {
      titleInput.value = template.title;
    }

    // 2. Text (with language support)
    const textArea = document.getElementById('cardText');
    if (textArea) {
      let text = '';
      if (template.text && typeof template.text === 'object') {
        text = template.text[lang] || template.text.en || '';
      }
      textArea.value = text;
    }

    // 3. Emojis (preset)
    if (template.emojis && Array.isArray(template.emojis)) {
      const state = CardManager.getState();
      state.emojis = template.emojis;
      
      // Update emoji picker visual selection
      const emojiPicker = document.getElementById('emojiPicker');
      if (emojiPicker) {
        emojiPicker.querySelectorAll('span').forEach(el => {
          el.classList.toggle('selected-emoji', state.emojis.includes(el.textContent));
        });
      }
      
      CardManager.setState(state);
    }

    // 4. Theme
    if (template.theme) {
      const themeSelect = document.getElementById('themeSelect');
      if (themeSelect) {
        themeSelect.value = template.theme;
        const state = CardManager.getState();
        state.theme = template.theme;
        CardManager.setState(state);
      }
    }

    // 5. Update event type dropdown
    const eventSelect = document.getElementById('eventType');
    if (eventSelect) {
      // Map template id to event type (they match in our setup)
      // but we also allow custom mapping
      const eventMap = {
        'birthday': 'birthday',
        'reconcile': 'reconcile',
        'love': 'love',
        'outing': 'outing',
        'miss': 'miss',
        'invite': 'invite'
      };
      const eventValue = eventMap[templateId] || templateId;
      if (eventSelect.querySelector(`option[value="${eventValue}"]`)) {
        eventSelect.value = eventValue;
      }
    }

    // 6. Force a full preview update
    CardManager.updatePreview();

    // 7. Save state to persist
    CardManager.saveState?.();
  });

  // 6. Event listeners for header controls
  themeSelect.addEventListener('change', function() {
    const state = CardManager.getState();
    state.theme = this.value;
    CardManager.setState(state);
  });

  fontSelect.addEventListener('change', function() {
    const state = CardManager.getState();
    state.font = this.value;
    CardManager.setState(state);
  });

  langSelect.addEventListener('change', async function() {
    await LanguageManager.setLanguage(this.value);
    // Optionally re-render templates with new language
    // For now, just update preview
    CardManager.updatePreview();
  });

  resetBtn.addEventListener('click', function() {
    if (confirm('Reset all settings?')) {
      localStorage.removeItem(CONFIG.CARD_STORAGE_KEY);
      location.reload();
    }
  });

  // 7. Export buttons
  document.getElementById('downloadImageBtn').addEventListener('click', function() {
    const cardEl = document.getElementById('card-preview');
    ExportManager.exportImage(cardEl);
  });
  document.getElementById('downloadPdfBtn').addEventListener('click', function() {
    const cardEl = document.getElementById('card-preview');
    ExportManager.exportPDF(cardEl);
  });
  document.getElementById('printBtn').addEventListener('click', function() {
    ExportManager.printCard();
  });

  // 8. Remove background button
  document.getElementById('removeBgBtn').addEventListener('click', function() {
    const state = CardManager.getState();
    state.bgImage = null;
    document.getElementById('bgImageInput').value = '';
    CardManager.setState(state);
  });

  // 9. Set default date/time if empty
  const dateInput = document.getElementById('cardDate');
  const timeInput = document.getElementById('cardTime');
  if (dateInput && !dateInput.value) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }
  if (timeInput && !timeInput.value) {
    timeInput.value = new Date().toTimeString().slice(0, 5);
  }

  // 10. Update preview after everything is loaded
  setTimeout(() => {
    CardManager.updatePreview();
    MapManager.invalidateSize();
  }, 300);

  // 11. Load saved state (after all UI is ready)
  // CardManager.init already loads state, but we ensure it's applied
  setTimeout(() => {
    CardManager.updatePreview();
  }, 500);

  console.log('🚀 PostCard Pro Studio loaded successfully!');
  console.log('ℹ️  Dynamic templates with full emoji & theme support enabled.');
})();
