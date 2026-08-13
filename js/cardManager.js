// ============================================================
//  CARD MANAGER – updates preview, handles form inputs
// ============================================================
const CardManager = (function() {
  let state = {
    title: '',
    text: '',
    date: '',
    time: '',
    location: '',
    lat: '',
    lng: '',
    event: 'invite',
    mood: 'happy',
    weather: 'sunny',
    border: 'solid',
    emojis: [],
    theme: CONFIG.DEFAULT_THEME,
    font: CONFIG.DEFAULT_FONT,
    fontSize: 18,
    lineHeight: 1.7,
    textColor: '#ffffff',
    shadow: 8,
    opacity: 0.95,
    borderColor: '#f5576c',
    borderWidth: 3,
    bgImage: null,
  };

  let elements = {};

  function init(elMap) {
    elements = elMap;
    // Load saved state
    loadState();
    // Bind events
    bindEvents();
    updatePreview();
  }

  function bindEvents() {
    const { title, text, date, time, location, lat, lng, eventType, moodGroup, weatherGroup, borderGroup,
      fontSize, lineHeight, textColor, shadow, opacity, borderColor, borderWidth, emojiPicker, bgInput } = elements;

    if (title) title.addEventListener('input', updatePreview);
    if (text) text.addEventListener('input', updatePreview);
    if (date) date.addEventListener('input', updatePreview);
    if (time) time.addEventListener('input', updatePreview);
    if (location) location.addEventListener('input', updatePreview);
    if (lat) lat.addEventListener('input', updatePreview);
    if (lng) lng.addEventListener('input', updatePreview);
    if (eventType) eventType.addEventListener('change', updatePreview);
    if (fontSize) fontSize.addEventListener('input', updatePreview);
    if (lineHeight) lineHeight.addEventListener('input', updatePreview);
    if (textColor) textColor.addEventListener('input', updatePreview);
    if (shadow) shadow.addEventListener('input', updatePreview);
    if (opacity) opacity.addEventListener('input', updatePreview);
    if (borderColor) borderColor.addEventListener('input', updatePreview);
    if (borderWidth) borderWidth.addEventListener('input', updatePreview);

    // Mood badges
    if (moodGroup) {
      moodGroup.querySelectorAll('.badge-option').forEach(el => {
        el.addEventListener('click', function() {
          moodGroup.querySelectorAll('.badge-option').forEach(o => o.classList.remove('active'));
          this.classList.add('active');
          state.mood = this.dataset.mood;
          updatePreview();
        });
      });
    }

    // Weather badges
    if (weatherGroup) {
      weatherGroup.querySelectorAll('.badge-option').forEach(el => {
        el.addEventListener('click', function() {
          weatherGroup.querySelectorAll('.badge-option').forEach(o => o.classList.remove('active'));
          this.classList.add('active');
          state.weather = this.dataset.weather;
          updatePreview();
        });
      });
    }

    // Border badges
    if (borderGroup) {
      borderGroup.querySelectorAll('.badge-option').forEach(el => {
        el.addEventListener('click', function() {
          borderGroup.querySelectorAll('.badge-option').forEach(o => o.classList.remove('active'));
          this.classList.add('active');
          state.border = this.dataset.border;
          updatePreview();
        });
      });
    }

    // Emoji picker
    if (emojiPicker) {
      emojiPicker.querySelectorAll('span').forEach(el => {
        el.addEventListener('click', function() {
          const em = this.textContent;
          const idx = state.emojis.indexOf(em);
          if (idx > -1) {
            state.emojis.splice(idx, 1);
            this.classList.remove('selected-emoji');
          } else {
            state.emojis.push(em);
            this.classList.add('selected-emoji');
          }
          updatePreview();
        });
      });
    }

    // Background image upload
    if (bgInput) {
      bgInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(ev) {
            state.bgImage = ev.target.result;
            updatePreview();
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  function updatePreview() {
    // Gather all input values
    const { title, text, date, time, location, lat, lng, eventType } = elements;
    state.title = title ? title.value : '';
    state.text = text ? text.value : '';
    state.date = date ? date.value : '';
    state.time = time ? time.value : '';
    state.location = location ? location.value : '';
    state.lat = lat ? lat.value : '';
    state.lng = lng ? lng.value : '';
    state.event = eventType ? eventType.value : 'invite';

    // Font size, line height, etc.
    if (elements.fontSize) state.fontSize = parseFloat(elements.fontSize.value);
    if (elements.lineHeight) state.lineHeight = parseFloat(elements.lineHeight.value);
    if (elements.textColor) state.textColor = elements.textColor.value;
    if (elements.shadow) state.shadow = parseFloat(elements.shadow.value);
    if (elements.opacity) state.opacity = parseFloat(elements.opacity.value);
    if (elements.borderColor) state.borderColor = elements.borderColor.value;
    if (elements.borderWidth) state.borderWidth = parseFloat(elements.borderWidth.value);

    // Apply to preview DOM
    const previewEl = document.getElementById('card-preview');
    if (!previewEl) return;

    // Title
    const titleEl = document.getElementById('previewTitle');
    if (titleEl) titleEl.textContent = state.title || 'Untitled';

    // Event
    const eventMap = {
      invite: '🎉 Invite', reconcile: '🤝 Reconcile', birthday: '🎂 Birthday',
      outing: '🚗 Outing', love: '❤️ Love', miss: '😢 Miss You',
      note: '📝 Note', poem: '📜 Poem', art: '🎨 Art'
    };
    const evtEl = document.getElementById('previewEvent');
    if (evtEl) evtEl.textContent = eventMap[state.event] || 'Event';

    // Text
    const textEl = document.getElementById('previewText');
    if (textEl) textEl.textContent = state.text || 'Write your message...';

    // Location
    const locEl = document.getElementById('previewLocation');
    if (locEl) locEl.textContent = state.location || 'Unknown';

    // Date/Time
    const dtEl = document.getElementById('previewDatetime');
    if (dtEl) {
      if (state.date && state.time) {
        const d = new Date(state.date + 'T' + state.time);
        dtEl.textContent = d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
      } else if (state.date) {
        const d = new Date(state.date);
        dtEl.textContent = d.toLocaleDateString('en-US', { dateStyle: 'medium' });
      } else {
        dtEl.textContent = 'No date';
      }
    }

    // Mood & Weather
    const moodMap = { happy: '😊 Happy', kind: '🥰 Kind', angry: '😤 Angry', bored: '😑 Bored', love: '😍 Love', sad: '😢 Sad',
      excited: '🤩 Excited', calm: '😌 Calm' };
    const mEl = document.getElementById('previewMood');
    if (mEl) mEl.textContent = moodMap[state.mood] || '😊';

    const weatherMap = { sunny: '☀️ Sunny', cloudy: '☁️ Cloudy', rainy: '🌧️ Rainy', snowy: '❄️ Snowy', stormy: '⛈️ Stormy',
      windy: '💨 Windy', foggy: '🌫️ Foggy' };
    const wEl = document.getElementById('previewWeather');
    if (wEl) wEl.textContent = weatherMap[state.weather] || '☀️';

    // Emojis
    const emEl = document.getElementById('previewEmojis');
    if (emEl) emEl.innerHTML = state.emojis.map(e => `<span>${e}</span>`).join('');

    // Apply Theme (using ThemeManager)
    if (window.ThemeManager) {
      ThemeManager.applyTheme(state.theme, previewEl);
    }

    // Apply Font
    if (window.FontManager) {
      FontManager.applyFont(state.font, previewEl);
    }

    // Border
    previewEl.style.borderStyle = state.border;
    previewEl.style.borderColor = state.borderColor;
    previewEl.style.borderWidth = state.borderWidth + 'px';

    // Font size, line height, color, shadow, opacity
    previewEl.style.fontSize = state.fontSize + 'px';
    previewEl.style.lineHeight = state.lineHeight;
    previewEl.style.color = state.textColor;
    previewEl.style.boxShadow = `0 ${state.shadow}px ${state.shadow*2}px rgba(0,0,0,0.4), 0 0 0 2px ${state.borderColor}40`;
    previewEl.style.opacity = state.opacity;

    // Background image
    if (state.bgImage) {
      previewEl.style.backgroundImage = `url(${state.bgImage})`;
      previewEl.style.backgroundSize = 'cover';
      previewEl.style.backgroundPosition = 'center';
    } else {
      // If theme is gradient, don't override; themeManager handles it.
    }

    // Save state
    saveState();

    // Update map position if lat/lng changed
    if (state.lat && state.lng && window.MapManager) {
      MapManager.setPosition(parseFloat(state.lat), parseFloat(state.lng));
    }
  }

  function saveState() {
    try {
      localStorage.setItem(CONFIG.CARD_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(CONFIG.CARD_STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        Object.assign(state, saved);
        // Restore to form elements
        if (elements.title) elements.title.value = state.title || '';
        if (elements.text) elements.text.value = state.text || '';
        if (elements.date) elements.date.value = state.date || '';
        if (elements.time) elements.time.value = state.time || '';
        if (elements.location) elements.location.value = state.location || '';
        if (elements.lat) elements.lat.value = state.lat || '';
        if (elements.lng) elements.lng.value = state.lng || '';
        if (elements.eventType) elements.eventType.value = state.event || 'invite';
        if (elements.fontSize) elements.fontSize.value = state.fontSize || 18;
        if (elements.lineHeight) elements.lineHeight.value = state.lineHeight || 1.7;
        if (elements.textColor) elements.textColor.value = state.textColor || '#ffffff';
        if (elements.shadow) elements.shadow.value = state.shadow || 8;
        if (elements.opacity) elements.opacity.value = state.opacity || 0.95;
        if (elements.borderColor) elements.borderColor.value = state.borderColor || '#f5576c';
        if (elements.borderWidth) elements.borderWidth.value = state.borderWidth || 3;

        // Update badges
        if (elements.moodGroup) {
          elements.moodGroup.querySelectorAll('.badge-option').forEach(el => {
            el.classList.toggle('active', el.dataset.mood === state.mood);
          });
        }
        if (elements.weatherGroup) {
          elements.weatherGroup.querySelectorAll('.badge-option').forEach(el => {
            el.classList.toggle('active', el.dataset.weather === state.weather);
          });
        }
        if (elements.borderGroup) {
          elements.borderGroup.querySelectorAll('.badge-option').forEach(el => {
            el.classList.toggle('active', el.dataset.border === state.border);
          });
        }
        // Emojis
        if (elements.emojiPicker) {
          elements.emojiPicker.querySelectorAll('span').forEach(el => {
            el.classList.toggle('selected-emoji', state.emojis.includes(el.textContent));
          });
        }
      }
    } catch (e) {}
  }

  function getState() { return state; }

  return {
    init,
    updatePreview,
    getState,
    setState: (newState) => { Object.assign(state, newState);
      updatePreview(); }
  };
})();

window.CardManager = CardManager;
