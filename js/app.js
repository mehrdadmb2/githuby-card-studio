// ============================================================
//  APP – Main entry point, orchestrates all modules
//  Version 2.0 – with Donate, Share, Animations & Advanced UI
// ============================================================
(async function() {
  'use strict';

  // ============================================================
  // 1. LOAD ALL MANIFESTS
  // ============================================================
  await ThemeManager.loadThemes();
  await FontManager.loadFonts();
  await LanguageManager.loadLanguages();
  await TemplateManager.loadTemplates();
  await BackgroundManager.loadBackgrounds();

  // ============================================================
  // 2. BUILD UI CONTROLS DYNAMICALLY
  // ============================================================
  const headerControls = document.getElementById('headerControls');
  const controlsContainer = document.getElementById('controlsContainer');
  const templateGrid = document.getElementById('templateGrid');
  const donateContainer = document.getElementById('donateContainer');

  // --- Header Controls ---
  headerControls.innerHTML = `
    <select id="themeSelect"></select>
    <select id="fontSelect"></select>
    <select id="langSelect"></select>
    <button id="shareBtn" title="Share Postcard"><i class="fas fa-share-alt"></i></button>
    <button id="donateBtn" title="Support this project"><i class="fas fa-heart"></i> Donate</button>
    <button id="resetBtn"><i class="fas fa-undo-alt"></i> Reset</button>
  `;

  const themeSelect = document.getElementById('themeSelect');
  const fontSelect = document.getElementById('fontSelect');
  const langSelect = document.getElementById('langSelect');
  const resetBtn = document.getElementById('resetBtn');
  const shareBtn = document.getElementById('shareBtn');
  const donateBtn = document.getElementById('donateBtn');

  ThemeManager.populateThemeSelect(themeSelect);
  FontManager.populateFontSelect(fontSelect);
  LanguageManager.populateLangSelect(langSelect);

  // --- Donate Section (initially hidden, shown on button click) ---
  donateContainer.innerHTML = `
    <div id="donateModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); backdrop-filter:blur(8px); z-index:9999; display:flex; align-items:center; justify-content:center;">
      <div style="background:rgba(20,20,35,0.95); border-radius:32px; padding:30px; max-width:500px; width:90%; max-height:80vh; overflow-y:auto; border:1px solid rgba(255,255,255,0.1); box-shadow:0 30px 80px rgba(0,0,0,0.8); position:relative;">
        <button id="closeDonateModal" style="position:absolute; top:12px; right:16px; background:none; border:none; color:#fff; font-size:1.8rem; cursor:pointer;">&times;</button>
        <h2 style="color:#fff; margin-bottom:20px;"><i class="fas fa-heart" style="color:#f5576c;"></i> Support the Project</h2>
        <p style="color:#aaa; margin-bottom:20px;">If you enjoy using PostCard Pro Studio, consider donating to keep the project alive! 🙏</p>
        <div style="display:flex; flex-direction:column; gap:12px;">
          <!-- Donation addresses -->
          <div style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.04); padding:10px 14px; border-radius:16px; border:1px solid rgba(255,255,255,0.06);">
            <i class="fab fa-bitcoin" style="color:#f7931a; font-size:1.8rem; width:32px;"></i>
            <span style="color:#eee; font-size:0.8rem; word-break:break-all; flex:1;" id="btc-address">bc1q6knq0g4w9axt7t204y3e4hk4kz4zkh8vxj2e3a</span>
            <button class="copyAddress" data-address="btc-address" style="background:rgba(255,255,255,0.06); border:none; color:#aaa; padding:4px 12px; border-radius:30px; cursor:pointer; font-size:0.8rem;">Copy</button>
          </div>
          <div style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.04); padding:10px 14px; border-radius:16px; border:1px solid rgba(255,255,255,0.06);">
            <i class="fab fa-ethereum" style="color:#627eea; font-size:1.8rem; width:32px;"></i>
            <span style="color:#eee; font-size:0.8rem; word-break:break-all; flex:1;" id="eth-address">0x968C2fD883a2004276f5e627Fe38654137601c51</span>
            <button class="copyAddress" data-address="eth-address" style="background:rgba(255,255,255,0.06); border:none; color:#aaa; padding:4px 12px; border-radius:30px; cursor:pointer; font-size:0.8rem;">Copy</button>
          </div>
          <div style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.04); padding:10px 14px; border-radius:16px; border:1px solid rgba(255,255,255,0.06);">
            <i class="fab fa-solana" style="color:#9945ff; font-size:1.8rem; width:32px;"></i>
            <span style="color:#eee; font-size:0.8rem; word-break:break-all; flex:1;" id="sol-address">7otC7qwCWqmrzbVA3XykjsZHbuKgrqaP2hE25NnByRDP</span>
            <button class="copyAddress" data-address="sol-address" style="background:rgba(255,255,255,0.06); border:none; color:#aaa; padding:4px 12px; border-radius:30px; cursor:pointer; font-size:0.8rem;">Copy</button>
          </div>
          <div style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.04); padding:10px 14px; border-radius:16px; border:1px solid rgba(255,255,255,0.06);">
            <i class="fab fa-tron" style="color:#ef4444; font-size:1.8rem; width:32px;"></i>
            <span style="color:#eee; font-size:0.8rem; word-break:break-all; flex:1;" id="tron-address">TGYN1zzeGUjuXipVPvS4gTUivQyAu7GNUm</span>
            <button class="copyAddress" data-address="tron-address" style="background:rgba(255,255,255,0.06); border:none; color:#aaa; padding:4px 12px; border-radius:30px; cursor:pointer; font-size:0.8rem;">Copy</button>
          </div>
          <div style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.04); padding:10px 14px; border-radius:16px; border:1px solid rgba(255,255,255,0.06);">
            <i class="fas fa-coins" style="color:#ffd700; font-size:1.8rem; width:32px;"></i>
            <span style="color:#eee; font-size:0.8rem; word-break:break-all; flex:1;" id="bnb-address">0x968C2fD883a2004276f5e627Fe38654137601c51</span>
            <button class="copyAddress" data-address="bnb-address" style="background:rgba(255,255,255,0.06); border:none; color:#aaa; padding:4px 12px; border-radius:30px; cursor:pointer; font-size:0.8rem;">Copy</button>
          </div>
          <div style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.04); padding:10px 14px; border-radius:16px; border:1px solid rgba(255,255,255,0.06);">
            <i class="fas fa-hexagon" style="color:#8247e5; font-size:1.8rem; width:32px;"></i>
            <span style="color:#eee; font-size:0.8rem; word-break:break-all; flex:1;" id="polygon-address">0x968C2fD883a2004276f5e627Fe38654137601c51</span>
            <button class="copyAddress" data-address="polygon-address" style="background:rgba(255,255,255,0.06); border:none; color:#aaa; padding:4px 12px; border-radius:30px; cursor:pointer; font-size:0.8rem;">Copy</button>
          </div>
          <div style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.04); padding:10px 14px; border-radius:16px; border:1px solid rgba(255,255,255,0.06);">
            <i class="fas fa-qrcode" style="color:#26a17b; font-size:1.8rem; width:32px;"></i>
            <span style="color:#eee; font-size:0.8rem; word-break:break-all; flex:1;" id="trc20-address">TYbqxzEWrvYPnLvGtk6JY6Sbh8DMqfjcYq</span>
            <button class="copyAddress" data-address="trc20-address" style="background:rgba(255,255,255,0.06); border:none; color:#aaa; padding:4px 12px; border-radius:30px; cursor:pointer; font-size:0.8rem;">Copy</button>
          </div>
          <div style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.04); padding:10px 14px; border-radius:16px; border:1px solid rgba(255,255,255,0.06);">
            <i class="fas fa-qrcode" style="color:#8b5cf6; font-size:1.8rem; width:32px;"></i>
            <span style="color:#eee; font-size:0.8rem; word-break:break-all; flex:1;" id="ton-address">UQBQU9KnjwIsdSGwG08b3L43Vy_wPlCg_3FaK9m4N2Toj84k</span>
            <button class="copyAddress" data-address="ton-address" style="background:rgba(255,255,255,0.06); border:none; color:#aaa; padding:4px 12px; border-radius:30px; cursor:pointer; font-size:0.8rem;">Copy</button>
          </div>
        </div>
        <p style="color:#666; margin-top:16px; font-size:0.7rem; text-align:center;">Thank you for your support! ❤️</p>
      </div>
    </div>
  `;

  // --- Donate Modal Logic ---
  let donateModal = document.getElementById('donateModal');
  donateModal.style.display = 'none';

  donateBtn.addEventListener('click', function() {
    donateModal.style.display = 'flex';
  });

  document.getElementById('closeDonateModal').addEventListener('click', function() {
    donateModal.style.display = 'none';
  });

  donateModal.addEventListener('click', function(e) {
    if (e.target === this) {
      this.style.display = 'none';
    }
  });

  // Copy address function
  document.querySelectorAll('.copyAddress').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.dataset.address;
      const span = document.getElementById(id);
      if (span) {
        navigator.clipboard.writeText(span.textContent).then(() => {
          const original = this.textContent;
          this.textContent = '✓ Copied!';
          setTimeout(() => { this.textContent = original; }, 1500);
        }).catch(() => {
          // fallback
          const range = document.createRange();
          range.selectNode(span);
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);
          document.execCommand('copy');
          const original = this.textContent;
          this.textContent = '✓ Copied!';
          setTimeout(() => { this.textContent = original; }, 1500);
        });
      }
    });
  });

  // --- Share Button ---
  shareBtn.addEventListener('click', function() {
    if (navigator.share) {
      const cardEl = document.getElementById('card-preview');
      html2canvas(cardEl, { scale: 1.5, useCORS: true, backgroundColor: null, logging: false })
        .then(canvas => {
          canvas.toBlob(blob => {
            const file = new File([blob], 'postcard.png', { type: 'image/png' });
            navigator.share({
              title: 'PostCard Pro Studio',
              text: 'Check out my custom postcard!',
              files: [file]
            }).catch(err => console.log('Share cancelled', err));
          });
        });
    } else {
      alert('Share API not supported on this browser. You can download the image instead.');
    }
  });

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
      <input type="range" id="fontSizeRange" min="12" max="48" value="18" />
      <span id="fontSizeLabel">18px</span>
    </div>
    <div class="form-group">
      <label>Line Height</label>
      <input type="range" id="lineHeightRange" min="1.0" max="3.0" step="0.1" value="1.7" />
      <span id="lineHeightLabel">1.7</span>
    </div>
    <div class="form-group">
      <label>Text Color</label>
      <input type="color" id="textColor" value="#ffffff" />
    </div>
    <div class="form-group">
      <label>Shadow (px)</label>
      <input type="range" id="shadowRange" min="0" max="40" value="8" />
      <span id="shadowLabel">8px</span>
    </div>
    <div class="form-group">
      <label>Opacity</label>
      <input type="range" id="opacityRange" min="0.2" max="1.0" step="0.05" value="0.95" />
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

  // ============================================================
  // 3. INITIALIZE MAP
  // ============================================================
  MapManager.init('map', 35.6892, 51.3890, (lat, lng) => {
    document.getElementById('latInput').value = lat.toFixed(6);
    document.getElementById('lngInput').value = lng.toFixed(6);
    CardManager.updatePreview();
  });

  // ============================================================
  // 4. CARD MANAGER
  // ============================================================
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

  // ============================================================
  // 5. TEMPLATE MANAGER
  // ============================================================
  TemplateManager.renderTemplateButtons(templateGrid, async (templateId) => {
    const lang = LanguageManager.getCurrentLang();
    const template = await TemplateManager.loadTemplate(templateId);
    if (!template) return;

    // Title
    const titleInput = document.getElementById('cardTitle');
    if (titleInput) titleInput.value = template.title || '';

    // Text
    const textArea = document.getElementById('cardText');
    if (textArea) {
      const text = template.text && template.text[lang] ? template.text[lang] : (template.text ? template.text.en : '');
      textArea.value = text || '';
    }

    // Emojis
    if (template.emojis && Array.isArray(template.emojis)) {
      const state = CardManager.getState();
      state.emojis = template.emojis;
      const emojiPicker = document.getElementById('emojiPicker');
      if (emojiPicker) {
        emojiPicker.querySelectorAll('span').forEach(el => {
          el.classList.toggle('selected-emoji', state.emojis.includes(el.textContent));
        });
      }
      CardManager.setState(state);
    }

    // Theme
    if (template.theme) {
      const themeSelect = document.getElementById('themeSelect');
      if (themeSelect) {
        themeSelect.value = template.theme;
        const state = CardManager.getState();
        state.theme = template.theme;
        CardManager.setState(state);
      }
    }

    // Event Type
    const eventSelect = document.getElementById('eventType');
    if (eventSelect && templateId) {
      eventSelect.value = templateId;
    }

    CardManager.updatePreview();
  });

  // ============================================================
  // 6. EVENT LISTENERS FOR HEADER CONTROLS
  // ============================================================
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
    CardManager.updatePreview();
  });

  resetBtn.addEventListener('click', function() {
    if (confirm('Reset all settings?')) {
      localStorage.removeItem(CONFIG.CARD_STORAGE_KEY);
      location.reload();
    }
  });

  // ============================================================
  // 7. EXPORT BUTTONS
  // ============================================================
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

  // ============================================================
  // 8. REMOVE BACKGROUND BUTTON
  // ============================================================
  document.getElementById('removeBgBtn').addEventListener('click', function() {
    const state = CardManager.getState();
    state.bgImage = null;
    document.getElementById('bgImageInput').value = '';
    CardManager.setState(state);
  });

  // ============================================================
  // 9. SET DEFAULT DATE/TIME
  // ============================================================
  const dateInput = document.getElementById('cardDate');
  const timeInput = document.getElementById('cardTime');
  if (dateInput && !dateInput.value) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }
  if (timeInput && !timeInput.value) {
    timeInput.value = new Date().toTimeString().slice(0, 5);
  }

  // ============================================================
  // 10. FINAL UPDATE
  // ============================================================
  setTimeout(() => {
    CardManager.updatePreview();
    MapManager.invalidateSize();
  }, 400);

  console.log('🚀 PostCard Pro Studio v2.0 loaded successfully!');
  console.log('❤️ Donation addresses ready. Thank you for your support!');
})();
