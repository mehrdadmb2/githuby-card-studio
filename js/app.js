// ============================================================
//  APP – Main entry point, orchestrates all modules
//  Version 2.4 – Dynamic UI translation with data-i18n
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

  // Set default language from localStorage or CONFIG
  const savedLang = localStorage.getItem('pcProLang') || CONFIG.DEFAULT_LANG;
  await LanguageManager.setLanguage(savedLang);

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

  // --- Donate Section ---
  donateContainer.innerHTML = `
    <div id="donateModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.75); backdrop-filter:blur(10px); z-index:9999; display:flex; align-items:center; justify-content:center;">
      <div style="background:rgba(20,20,35,0.96); border-radius:32px; padding:30px; max-width:550px; width:92%; max-height:80vh; overflow-y:auto; border:1px solid rgba(255,255,255,0.1); box-shadow:0 30px 80px rgba(0,0,0,0.9); position:relative;">
        <button id="closeDonateModal" style="position:absolute; top:12px; right:16px; background:none; border:none; color:#fff; font-size:2rem; cursor:pointer; opacity:0.6; transition:0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.6'">&times;</button>
        <h2 style="color:#fff; margin-bottom:16px;"><i class="fas fa-heart" style="color:#f5576c;"></i> <span data-i18n="donate_title">Support the Project</span></h2>
        <p style="color:#aaa; margin-bottom:16px; font-size:0.9rem;" data-i18n="donate_description">If you enjoy using PostCard Pro Studio, consider donating to keep the project alive! 🙏</p>
        
        <div style="background:rgba(255,0,0,0.1); border-left:4px solid #ff4444; padding:10px 14px; border-radius:8px; margin-bottom:18px;">
          <p style="color:#ff6b6b; font-size:0.85rem; margin:0;" data-i18n="donate_warning">
            <i class="fas fa-exclamation-triangle"></i> <strong>Important:</strong> Send <strong>only</strong> the specified token to each address. 
            Sending the wrong token will result in <strong>permanent loss</strong> of funds.
          </p>
        </div>

        <div style="display:flex; flex-direction:column; gap:12px;">
          <!-- BTC -->
          <div style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.04); padding:10px 14px; border-radius:16px; border:1px solid rgba(255,255,255,0.06);">
            <i class="fab fa-bitcoin" style="color:#f7931a; font-size:1.8rem; width:32px;"></i>
            <div style="flex:1; min-width:0;">
              <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                <span style="color:#fff; font-weight:600; font-size:0.9rem;">Bitcoin (BTC)</span>
                <span style="background:rgba(247,147,26,0.2); color:#f7931a; padding:1px 10px; border-radius:30px; font-size:0.7rem;">Network: BTC</span>
              </div>
              <span style="color:#eee; font-size:0.75rem; word-break:break-all; display:block; margin-top:2px;" id="btc-address">bc1q6knq0g4w9axt7t204y3e4hk4kz4zkh8vxj2e3a</span>
            </div>
            <button class="copyAddress" data-address="btc-address" style="background:rgba(255,255,255,0.06); border:none; color:#aaa; padding:4px 14px; border-radius:30px; cursor:pointer; font-size:0.8rem; transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.06)'"><span data-i18n="copy">Copy</span></button>
          </div>
          <!-- ETH -->
          <div style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.04); padding:10px 14px; border-radius:16px; border:1px solid rgba(255,255,255,0.06);">
            <i class="fab fa-ethereum" style="color:#627eea; font-size:1.8rem; width:32px;"></i>
            <div style="flex:1; min-width:0;">
              <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                <span style="color:#fff; font-weight:600; font-size:0.9rem;">Ethereum (ETH)</span>
                <span style="background:rgba(98,126,234,0.2); color:#627eea; padding:1px 10px; border-radius:30px; font-size:0.7rem;">Network: ERC-20</span>
              </div>
              <span style="color:#eee; font-size:0.75rem; word-break:break-all; display:block; margin-top:2px;" id="eth-address">0x968C2fD883a2004276f5e627Fe38654137601c51</span>
            </div>
            <button class="copyAddress" data-address="eth-address" style="background:rgba(255,255,255,0.06); border:none; color:#aaa; padding:4px 14px; border-radius:30px; cursor:pointer; font-size:0.8rem; transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.06)'"><span data-i18n="copy">Copy</span></button>
          </div>
          <!-- SOL -->
          <div style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.04); padding:10px 14px; border-radius:16px; border:1px solid rgba(255,255,255,0.06);">
            <i class="fab fa-solana" style="color:#9945ff; font-size:1.8rem; width:32px;"></i>
            <div style="flex:1; min-width:0;">
              <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                <span style="color:#fff; font-weight:600; font-size:0.9rem;">Solana (SOL)</span>
                <span style="background:rgba(153,69,255,0.2); color:#9945ff; padding:1px 10px; border-radius:30px; font-size:0.7rem;">Network: Solana</span>
              </div>
              <span style="color:#eee; font-size:0.75rem; word-break:break-all; display:block; margin-top:2px;" id="sol-address">7otC7qwCWqmrzbVA3XykjsZHbuKgrqaP2hE25NnByRDP</span>
            </div>
            <button class="copyAddress" data-address="sol-address" style="background:rgba(255,255,255,0.06); border:none; color:#aaa; padding:4px 14px; border-radius:30px; cursor:pointer; font-size:0.8rem; transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.06)'"><span data-i18n="copy">Copy</span></button>
          </div>
          <!-- TRON -->
          <div style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.04); padding:10px 14px; border-radius:16px; border:1px solid rgba(255,255,255,0.06);">
            <i class="fab fa-tron" style="color:#ef4444; font-size:1.8rem; width:32px;"></i>
            <div style="flex:1; min-width:0;">
              <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                <span style="color:#fff; font-weight:600; font-size:0.9rem;">Tron (TRX)</span>
                <span style="background:rgba(239,68,68,0.2); color:#ef4444; padding:1px 10px; border-radius:30px; font-size:0.7rem;">Network: TRC-20</span>
              </div>
              <span style="color:#eee; font-size:0.75rem; word-break:break-all; display:block; margin-top:2px;" id="tron-address">TGYN1zzeGUjuXipVPvS4gTUivQyAu7GNUm</span>
            </div>
            <button class="copyAddress" data-address="tron-address" style="background:rgba(255,255,255,0.06); border:none; color:#aaa; padding:4px 14px; border-radius:30px; cursor:pointer; font-size:0.8rem; transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.06)'"><span data-i18n="copy">Copy</span></button>
          </div>
          <!-- BNB -->
          <div style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.04); padding:10px 14px; border-radius:16px; border:1px solid rgba(255,255,255,0.06);">
            <i class="fas fa-coins" style="color:#f0b90b; font-size:1.8rem; width:32px;"></i>
            <div style="flex:1; min-width:0;">
              <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                <span style="color:#fff; font-weight:600; font-size:0.9rem;">BNB (BSC)</span>
                <span style="background:rgba(240,185,11,0.2); color:#f0b90b; padding:1px 10px; border-radius:30px; font-size:0.7rem;">Network: BEP-20</span>
              </div>
              <span style="color:#eee; font-size:0.75rem; word-break:break-all; display:block; margin-top:2px;" id="bnb-address">0x968C2fD883a2004276f5e627Fe38654137601c51</span>
            </div>
            <button class="copyAddress" data-address="bnb-address" style="background:rgba(255,255,255,0.06); border:none; color:#aaa; padding:4px 14px; border-radius:30px; cursor:pointer; font-size:0.8rem; transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.06)'"><span data-i18n="copy">Copy</span></button>
          </div>
          <!-- Polygon -->
          <div style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.04); padding:10px 14px; border-radius:16px; border:1px solid rgba(255,255,255,0.06);">
            <i class="fas fa-hexagon" style="color:#8247e5; font-size:1.8rem; width:32px;"></i>
            <div style="flex:1; min-width:0;">
              <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                <span style="color:#fff; font-weight:600; font-size:0.9rem;">Polygon (MATIC)</span>
                <span style="background:rgba(130,71,229,0.2); color:#8247e5; padding:1px 10px; border-radius:30px; font-size:0.7rem;">Network: Polygon</span>
              </div>
              <span style="color:#eee; font-size:0.75rem; word-break:break-all; display:block; margin-top:2px;" id="polygon-address">0x968C2fD883a2004276f5e627Fe38654137601c51</span>
            </div>
            <button class="copyAddress" data-address="polygon-address" style="background:rgba(255,255,255,0.06); border:none; color:#aaa; padding:4px 14px; border-radius:30px; cursor:pointer; font-size:0.8rem; transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.06)'"><span data-i18n="copy">Copy</span></button>
          </div>
          <!-- TRC20 USDT -->
          <div style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.04); padding:10px 14px; border-radius:16px; border:1px solid rgba(255,255,255,0.06);">
            <i class="fas fa-qrcode" style="color:#26a17b; font-size:1.8rem; width:32px;"></i>
            <div style="flex:1; min-width:0;">
              <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                <span style="color:#fff; font-weight:600; font-size:0.9rem;">USDT (TRC-20)</span>
                <span style="background:rgba(38,161,123,0.2); color:#26a17b; padding:1px 10px; border-radius:30px; font-size:0.7rem;">Network: TRC-20</span>
              </div>
              <span style="color:#eee; font-size:0.75rem; word-break:break-all; display:block; margin-top:2px;" id="trc20-address">TYbqxzEWrvYPnLvGtk6JY6Sbh8DMqfjcYq</span>
            </div>
            <button class="copyAddress" data-address="trc20-address" style="background:rgba(255,255,255,0.06); border:none; color:#aaa; padding:4px 14px; border-radius:30px; cursor:pointer; font-size:0.8rem; transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.06)'"><span data-i18n="copy">Copy</span></button>
          </div>
          <!-- TON -->
          <div style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.04); padding:10px 14px; border-radius:16px; border:1px solid rgba(255,255,255,0.06);">
            <i class="fas fa-qrcode" style="color:#8b5cf6; font-size:1.8rem; width:32px;"></i>
            <div style="flex:1; min-width:0;">
              <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                <span style="color:#fff; font-weight:600; font-size:0.9rem;">TON Coin</span>
                <span style="background:rgba(139,92,246,0.2); color:#8b5cf6; padding:1px 10px; border-radius:30px; font-size:0.7rem;">Network: TON</span>
              </div>
              <span style="color:#eee; font-size:0.75rem; word-break:break-all; display:block; margin-top:2px;" id="ton-address">UQBQU9KnjwIsdSGwG08b3L43Vy_wPlCg_3FaK9m4N2Toj84k</span>
            </div>
            <button class="copyAddress" data-address="ton-address" style="background:rgba(255,255,255,0.06); border:none; color:#aaa; padding:4px 14px; border-radius:30px; cursor:pointer; font-size:0.8rem; transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.06)'"><span data-i18n="copy">Copy</span></button>
          </div>
        </div>
        <p style="color:#666; margin-top:18px; font-size:0.7rem; text-align:center; border-top:1px solid rgba(255,255,255,0.05); padding-top:14px;">
          <i class="fas fa-shield-alt"></i> All donations are directly sent to the provided addresses. 
          We never store or request your private keys.
        </p>
        <p style="color:#444; margin-top:6px; font-size:0.65rem; text-align:center;" data-i18n="donate_thanks">Thank you for your support! ❤️</p>
      </div>
    </div>
  `;

  // --- Donate Modal Logic ---
  let donateModal = document.getElementById('donateModal');
  donateModal.style.display = 'none';

  donateBtn.addEventListener('click', function() {
    donateModal.style.display = 'flex';
    // Apply translations inside modal
    applyTranslations();
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
          this.innerHTML = '✓ Copied!';
          this.style.color = '#4caf50';
          setTimeout(() => {
            this.innerHTML = '<span data-i18n="copy">Copy</span>';
            this.style.color = '#aaa';
            applyTranslations(); // re-apply translation
          }, 2000);
        }).catch(() => {
          const range = document.createRange();
          range.selectNode(span);
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);
          document.execCommand('copy');
          const original = this.textContent;
          this.innerHTML = '✓ Copied!';
          this.style.color = '#4caf50';
          setTimeout(() => {
            this.innerHTML = '<span data-i18n="copy">Copy</span>';
            this.style.color = '#aaa';
            applyTranslations();
          }, 2000);
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

  // ============================================================
  // 3. BUILD CONTROLS WITH data-i18n ATTRIBUTES
  // ============================================================
  controlsContainer.innerHTML = `
    <!-- Event Type -->
    <div class="form-group">
      <label data-i18n="event_label">Event Type</label>
      <select id="eventType">
        <option value="invite" data-i18n="event_invite">🎉 Invite</option>
        <option value="reconcile" data-i18n="event_reconcile">🤝 Reconcile</option>
        <option value="birthday" data-i18n="event_birthday">🎂 Birthday</option>
        <option value="outing" data-i18n="event_outing">🚗 Outing</option>
        <option value="love" data-i18n="event_love">❤️ Love</option>
        <option value="miss" data-i18n="event_miss">😢 Miss You</option>
        <option value="note" data-i18n="event_note">📝 Note</option>
        <option value="poem" data-i18n="event_poem">📜 Poem</option>
        <option value="art" data-i18n="event_art">🎨 Art</option>
      </select>
    </div>

    <!-- Title -->
    <div class="form-group">
      <label data-i18n="title_label">Title</label>
      <input type="text" id="cardTitle" data-i18n-placeholder="title_placeholder" placeholder="e.g. Let's Celebrate!" />
    </div>

    <!-- Text -->
    <div class="form-group">
      <label data-i18n="message_label">Message / Text</label>
      <textarea id="cardText" data-i18n-placeholder="message_placeholder" placeholder="Write your message..."></textarea>
    </div>

    <!-- Date & Time -->
    <div class="form-row">
      <div class="form-group">
        <label data-i18n="date_label">Date</label>
        <input type="date" id="cardDate" />
      </div>
      <div class="form-group">
        <label data-i18n="time_label">Time</label>
        <input type="time" id="cardTime" />
      </div>
    </div>

    <!-- Location & Map -->
    <div class="form-group">
      <label data-i18n="location_label">📍 Location</label>
      <input type="text" id="cardLocation" data-i18n-placeholder="location_placeholder" placeholder="Address" />
      <div id="map"></div>
      <div class="coord-inputs">
        <input type="text" id="latInput" placeholder="Latitude" />
        <input type="text" id="lngInput" placeholder="Longitude" />
      </div>
    </div>

    <!-- Mood -->
    <div class="form-group">
      <label data-i18n="mood_label">Mood</label>
      <div class="badge-group" id="moodGroup">
        <span class="badge-option active" data-mood="happy" data-i18n="mood_happy">😊 Happy</span>
        <span class="badge-option" data-mood="kind" data-i18n="mood_kind">🥰 Kind</span>
        <span class="badge-option" data-mood="angry" data-i18n="mood_angry">😤 Angry</span>
        <span class="badge-option" data-mood="bored" data-i18n="mood_bored">😑 Bored</span>
        <span class="badge-option" data-mood="love" data-i18n="mood_love">😍 Love</span>
        <span class="badge-option" data-mood="sad" data-i18n="mood_sad">😢 Sad</span>
        <span class="badge-option" data-mood="excited" data-i18n="mood_excited">🤩 Excited</span>
        <span class="badge-option" data-mood="calm" data-i18n="mood_calm">😌 Calm</span>
      </div>
    </div>

    <!-- Weather -->
    <div class="form-group">
      <label data-i18n="weather_label">Weather</label>
      <div class="badge-group" id="weatherGroup">
        <span class="badge-option active" data-weather="sunny" data-i18n="weather_sunny">☀️ Sunny</span>
        <span class="badge-option" data-weather="cloudy" data-i18n="weather_cloudy">☁️ Cloudy</span>
        <span class="badge-option" data-weather="rainy" data-i18n="weather_rainy">🌧️ Rainy</span>
        <span class="badge-option" data-weather="snowy" data-i18n="weather_snowy">❄️ Snowy</span>
        <span class="badge-option" data-weather="stormy" data-i18n="weather_stormy">⛈️ Stormy</span>
        <span class="badge-option" data-weather="windy" data-i18n="weather_windy">💨 Windy</span>
        <span class="badge-option" data-weather="foggy" data-i18n="weather_foggy">🌫️ Foggy</span>
      </div>
    </div>

    <!-- Border Style -->
    <div class="form-group">
      <label data-i18n="border_label">Border Style</label>
      <div class="badge-group" id="borderGroup">
        <span class="badge-option active" data-border="solid" data-i18n="border_solid">Solid</span>
        <span class="badge-option" data-border="dashed" data-i18n="border_dashed">Dashed</span>
        <span class="badge-option" data-border="dotted" data-i18n="border_dotted">Dotted</span>
        <span class="badge-option" data-border="double" data-i18n="border_double">Double</span>
        <span class="badge-option" data-border="groove" data-i18n="border_groove">Groove</span>
        <span class="badge-option" data-border="ridge" data-i18n="border_ridge">Ridge</span>
        <span class="badge-option" data-border="inset" data-i18n="border_inset">Inset</span>
        <span class="badge-option" data-border="outset" data-i18n="border_outset">Outset</span>
        <span class="badge-option" data-border="none" data-i18n="border_none">None</span>
      </div>
    </div>

    <!-- Border Color & Width -->
    <div class="form-row">
      <div class="form-group">
        <label data-i18n="border_color_label">Border Color</label>
        <input type="color" id="borderColor" value="#f5576c" />
      </div>
      <div class="form-group">
        <label data-i18n="border_width_label">Border Width (px)</label>
        <input type="number" id="borderWidth" value="3" min="0" max="20" />
      </div>
    </div>

    <!-- Background Image Upload -->
    <div class="form-group">
      <label data-i18n="bg_image_label">🖼️ Background Image</label>
      <div class="bg-upload">
        <input type="file" id="bgImageInput" accept="image/*" />
        <button id="removeBgBtn" style="background:rgba(255,0,0,0.15);border:1px solid rgba(255,0,0,0.2);padding:6px 14px;border-radius:30px;color:#ff6b6b;cursor:pointer;" data-i18n="remove_bg">Remove</button>
      </div>
    </div>

    <!-- Advanced Styling -->
    <div class="form-group">
      <label data-i18n="font_size">Font Size (px)</label>
      <input type="range" id="fontSizeRange" min="12" max="48" value="18" />
      <span id="fontSizeLabel">18px</span>
    </div>
    <div class="form-group">
      <label data-i18n="line_height">Line Height</label>
      <input type="range" id="lineHeightRange" min="1.0" max="3.0" step="0.1" value="1.7" />
      <span id="lineHeightLabel">1.7</span>
    </div>
    <div class="form-group">
      <label data-i18n="text_color">Text Color</label>
      <input type="color" id="textColor" value="#ffffff" />
    </div>
    <div class="form-group">
      <label data-i18n="shadow">Shadow (px)</label>
      <input type="range" id="shadowRange" min="0" max="40" value="8" />
      <span id="shadowLabel">8px</span>
    </div>
    <div class="form-group">
      <label data-i18n="opacity">Opacity</label>
      <input type="range" id="opacityRange" min="0.2" max="1.0" step="0.05" value="0.95" />
      <span id="opacityLabel">0.95</span>
    </div>

    <!-- Emoji Picker -->
    <div class="form-group">
      <label data-i18n="emojis_label">Emojis (click to add/remove)</label>
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
  // 4. TRANSLATION FUNCTION
  // ============================================================
  function applyTranslations() {
    const lang = LanguageManager.getCurrentLang();
    
    // Update all elements with data-i18n attribute (textContent)
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = LanguageManager.getString(key);
      if (translation) {
        el.textContent = translation;
      }
    });

    // Update all elements with data-i18n-placeholder attribute (placeholder)
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translation = LanguageManager.getString(key);
      if (translation) {
        el.placeholder = translation;
      }
    });

    // Update title attribute for buttons and other elements
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const translation = LanguageManager.getString(key);
      if (translation) {
        el.title = translation;
      }
    });
  }

  // ============================================================
  // 5. INITIALIZE MAP
  // ============================================================
  MapManager.init('map', 35.6892, 51.3890, (lat, lng) => {
    document.getElementById('latInput').value = lat.toFixed(6);
    document.getElementById('lngInput').value = lng.toFixed(6);
    CardManager.updatePreview();
  });

  // ============================================================
  // 6. CARD MANAGER
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
  // 7. TEMPLATE MANAGER
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
      }
      const cardPreview = document.getElementById('card-preview');
      if (cardPreview) {
        ThemeManager.applyTheme(template.theme, cardPreview);
      }
      const state = CardManager.getState();
      state.theme = template.theme;
      CardManager.setState(state);
    }

    // Event Type
    const eventSelect = document.getElementById('eventType');
    if (eventSelect && templateId) {
      eventSelect.value = templateId;
    }

    CardManager.updatePreview();
  });

  // ============================================================
  // 8. EVENT LISTENERS FOR HEADER CONTROLS
  // ============================================================
  themeSelect.addEventListener('change', async function() {
    const themeId = this.value;
    const cardPreview = document.getElementById('card-preview');
    if (cardPreview) {
      ThemeManager.applyTheme(themeId, cardPreview);
    }
    const state = CardManager.getState();
    state.theme = themeId;
    CardManager.setState(state);
  });

  fontSelect.addEventListener('change', function() {
    const state = CardManager.getState();
    state.font = this.value;
    CardManager.setState(state);
  });

  langSelect.addEventListener('change', async function() {
    const langId = this.value;
    await LanguageManager.setLanguage(langId);
    localStorage.setItem('pcProLang', langId);
    applyTranslations(); // Translate UI
    CardManager.updatePreview(); // Update card content with new language
  });

  resetBtn.addEventListener('click', function() {
    if (confirm(LanguageManager.getString('reset_confirm') || 'Reset all settings?')) {
      localStorage.removeItem(CONFIG.CARD_STORAGE_KEY);
      location.reload();
    }
  });

  // ============================================================
  // 9. EXPORT BUTTONS
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
  // 10. BACKGROUND IMAGE UPLOAD
  // ============================================================
  const bgImageInput = document.getElementById('bgImageInput');
  if (bgImageInput) {
    bgImageInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(ev) {
          const state = CardManager.getState();
          state.bgImage = ev.target.result;
          CardManager.setState(state);
          bgImageInput.value = '';
          console.log('✅ Background image uploaded and applied');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  const removeBgBtn = document.getElementById('removeBgBtn');
  if (removeBgBtn) {
    removeBgBtn.addEventListener('click', function() {
      const state = CardManager.getState();
      state.bgImage = null;
      document.getElementById('bgImageInput').value = '';
      CardManager.setState(state);
      console.log('✅ Background image removed');
    });
  }

  // ============================================================
  // 11. SET DEFAULT DATE/TIME
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
  // 12. APPLY TRANSLATIONS AND FINAL UPDATE
  // ============================================================
  applyTranslations(); // Apply translations for the first time
  
  setTimeout(() => {
    CardManager.updatePreview();
    MapManager.invalidateSize();
  }, 400);

  console.log('🚀 PostCard Pro Studio v2.4 loaded successfully with dynamic translations!');
  console.log('❤️ UI translations are now fully dynamic.');
})();
