// ============================================================
//  TEMPLATE MANAGER – now returns full template object
// ============================================================
const TemplateManager = (function() {
  let templates = [];

  async function loadTemplates() {
    try {
      const res = await fetch(CONFIG.TEMPLATES_MANIFEST);
      const data = await res.json();
      templates = data.templates || [];
      return templates;
    } catch (e) {
      console.warn('Using default templates.', e);
      templates = [
        { id: 'birthday', label: '🎂 Birthday' },
        { id: 'reconcile', label: '🤝 Reconcile' },
        { id: 'love', label: '❤️ Love' },
        { id: 'outing', label: '🚗 Outing' },
        { id: 'miss', label: '😢 Miss You' },
        { id: 'invite', label: '🎉 Invite' },
      ];
      return templates;
    }
  }

  async function loadTemplate(templateId) {
    try {
      const res = await fetch(`assets/templates/${templateId}.json`);
      const data = await res.json();
      return data;
    } catch (e) {
      console.warn(`Template ${templateId} not found.`);
      return null;
    }
  }

  // Legacy: get text only
  async function loadTemplateContent(templateId, lang) {
    const data = await loadTemplate(templateId);
    if (data && data.text) {
      return data.text[lang] || data.text.en || '';
    }
    return '';
  }

  function renderTemplateButtons(container, onClick) {
    if (!container) return;
    container.innerHTML = '';
    templates.forEach(t => {
      const btn = document.createElement('button');
      btn.textContent = t.label || t.id;
      btn.title = `Click to insert ${t.label || t.id} template`;
      btn.addEventListener('click', () => {
        if (onClick) onClick(t.id);
      });
      container.appendChild(btn);
    });
  }

  return {
    loadTemplates,
    loadTemplate,
    loadTemplateContent,
    renderTemplateButtons,
    get templates() { return templates; }
  };
})();

window.TemplateManager = TemplateManager;
