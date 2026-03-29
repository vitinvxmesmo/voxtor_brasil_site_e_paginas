/**
 * logs.js
 * Rastreamento de visitas, origem, localização aproximada, cliques e formulário.
 * Envio direto para Discord webhook.
 *
 * Observação: este modelo expõe a webhook no frontend.
 * Para produção com segurança máxima, o ideal é mover isso para backend.
 */

(function initVoxtorTracking() {
  'use strict';

  const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1487645540647698553/QVsfErAYKRPQJroto_l6OEKqCSx4R6q1vz3FGdV88lv-k0Dvk6d8_Q-od1G66hq5SZby';

  const PAGE_NAMES = {
    '': 'Home',
    'index.html': 'Home',
    'pricing.html': 'Preços',
    'about.html': 'Sobre',
    'contact.html': 'Contato',
    'calculadora-financeira.html': 'Calculadora Financeira',
    'crm.html': 'CRM Voxtor',
    'erp.html': 'ERP Voxtor'
  };

  const startTime = Date.now();
  let maxScroll = 0;
  let behaviorSent = false;

  function getPageFile() {
    return window.location.pathname.split('/').pop();
  }

  function getPageName() {
    const file = getPageFile();
    return PAGE_NAMES[file] || file || 'Home';
  }

  function getPageUrl() {
    return window.location.href;
  }

  function getTimestamp() {
    return new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  function getSessionId() {
    let sid = sessionStorage.getItem('vx_sid');
    if (!sid) {
      sid = `VX-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
      sessionStorage.setItem('vx_sid', sid);
    }
    return sid;
  }

  function getVisitCount() {
    const raw = Number(localStorage.getItem('vx_visits') || '0') + 1;
    localStorage.setItem('vx_visits', String(raw));
    return raw;
  }

  function getDeviceInfo() {
    const ua = navigator.userAgent;

    let device = 'Desktop';
    if (/Mobi|Android|iPhone/i.test(ua)) device = 'Mobile';
    else if (/iPad|Tablet/i.test(ua)) device = 'Tablet';

    let browser = 'Desconhecido';
    if (ua.includes('Edg')) browser = 'Edge';
    else if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';

    let os = 'Desconhecido';
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'macOS';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
    else if (ua.includes('Linux')) os = 'Linux';

    return { device, browser, os };
  }

  function getReferrerLabel() {
    const ref = document.referrer;
    if (!ref) return 'Acesso direto';
    if (ref.includes('google')) return 'Google';
    if (ref.includes('bing')) return 'Bing';
    if (ref.includes('instagram')) return 'Instagram';
    if (ref.includes('facebook')) return 'Facebook';
    if (ref.includes('linkedin')) return 'LinkedIn';
    if (ref.includes('whatsapp')) return 'WhatsApp';
    if (ref.includes('voxtorbrasil')) return 'Interno';

    try {
      return new URL(ref).hostname;
    } catch (_) {
      return ref;
    }
  }

  function getUtmParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get('utm_source') || '-',
      medium: params.get('utm_medium') || '-',
      campaign: params.get('utm_campaign') || '-'
    };
  }

  async function getLocationData() {
    const cached = sessionStorage.getItem('vx_location');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (_) {}
    }

    try {
      const response = await fetch('https://ipapi.co/json/', { headers: { Accept: 'application/json' } });
      const data = await response.json();

      const location = {
        ip: data.ip || '-',
        city: data.city || '-',
        region: data.region || '-',
        country: data.country_name || '-',
        countryCode: data.country_code || '-',
        timezone: data.timezone || '-',
        org: data.org || data.asn || '-'
      };

      sessionStorage.setItem('vx_location', JSON.stringify(location));
      return location;
    } catch (_) {
      return {
        ip: '-',
        city: '-',
        region: '-',
        country: '-',
        countryCode: '-',
        timezone: '-',
        org: '-'
      };
    }
  }

  async function sendToDiscord(payload) {
    try {
      await fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      });
    } catch (_) {
      // silencioso
    }
  }

  function buildEmbed(title, color, fields) {
    return {
      embeds: [{
        title,
        color,
        fields,
        footer: { text: `Voxtor Brasil • ${getTimestamp()}` }
      }]
    };
  }

  async function logEntryVisit() {
    if (sessionStorage.getItem(`vx_entry_${getPageUrl()}`)) return;
    sessionStorage.setItem(`vx_entry_${getPageUrl()}`, '1');

    const sid = getSessionId();
    const visits = getVisitCount();
    const referrer = getReferrerLabel();
    const utm = getUtmParams();
    const { device, browser, os } = getDeviceInfo();
    const location = await getLocationData();

    await sendToDiscord(buildEmbed('Novo acesso ao site', 0xd11586, [
      { name: 'Página', value: getPageName(), inline: true },
      { name: 'Sessão', value: sid, inline: true },
      { name: 'Visita', value: `${visits}ª visita`, inline: true },
      { name: 'Origem', value: referrer, inline: true },
      { name: 'Dispositivo', value: device, inline: true },
      { name: 'Navegador', value: browser, inline: true },
      { name: 'Sistema', value: os, inline: true },
      { name: 'Cidade', value: `${location.city} / ${location.region}`, inline: true },
      { name: 'País', value: `${location.country} (${location.countryCode})`, inline: true },
      { name: 'IP', value: location.ip, inline: true },
      { name: 'Provedor', value: location.org, inline: true },
      { name: 'Timezone', value: location.timezone, inline: true },
      { name: 'UTM Source', value: utm.source, inline: true },
      { name: 'UTM Medium', value: utm.medium, inline: true },
      { name: 'UTM Campaign', value: utm.campaign, inline: true },
      { name: 'URL', value: getPageUrl(), inline: false }
    ]));
  }

  function getScrollDepth() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total <= 0) return 0;
    return Math.min(100, Math.max(0, Math.round((window.scrollY / total) * 100)));
  }

  async function logBehavior() {
    if (behaviorSent) return;
    behaviorSent = true;

    const sid = getSessionId();
    const seconds = Math.round((Date.now() - startTime) / 1000);
    const timeOnPage = seconds >= 60
      ? `${Math.floor(seconds / 60)}min ${seconds % 60}s`
      : `${seconds}s`;

    await sendToDiscord(buildEmbed('Comportamento de visita', 0x2ecc71, [
      { name: 'Página', value: getPageName(), inline: true },
      { name: 'Sessão', value: sid, inline: true },
      { name: 'Tempo na página', value: timeOnPage, inline: true },
      { name: 'Scroll máximo', value: `${maxScroll}%`, inline: true },
      { name: 'URL', value: getPageUrl(), inline: false }
    ]));
  }

  async function logAction(label, extraFields) {
    const sid = getSessionId();
    const baseFields = [
      { name: 'Ação', value: label, inline: false },
      { name: 'Página', value: getPageName(), inline: true },
      { name: 'Sessão', value: sid, inline: true },
      { name: 'URL', value: getPageUrl(), inline: false }
    ];

    await sendToDiscord(buildEmbed('Clique rastreado', 0x3498db, baseFields.concat(extraFields || [])));
  }

  function bindTrackedClicks() {
    const selectors = [
      { selector: 'a[href*="wa.me"]', label: 'Clique em WhatsApp' },
      { selector: '.nav__cta', label: 'Clique no CTA do menu' },
      { selector: 'a[href="pricing.html"]', label: 'Clique em Preços' },
      { selector: 'a[href="about.html"]', label: 'Clique em Sobre' },
      { selector: 'a[href*="calculadora-financeira.html"]', label: 'Clique na página da Calculadora Financeira' },
      { selector: 'a[href*="crm.html"]', label: 'Clique na página do CRM' },
      { selector: 'a[href*="erp.html"]', label: 'Clique na página do ERP' }
    ];

    selectors.forEach(({ selector, label }) => {
      document.querySelectorAll(selector).forEach((element) => {
        element.addEventListener('click', () => {
          const text = (element.textContent || '').trim() || '-';
          logAction(label, [{ name: 'Elemento', value: text, inline: true }]);
        });
      });
    });
  }

  function bindFormTracking() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async () => {
      const read = (id) => {
        const el = document.getElementById(id);
        return el ? (el.value.trim() || '-') : '-';
      };

      const sid = getSessionId();
      const location = await getLocationData();

      await sendToDiscord(buildEmbed('Novo lead via formulário', 0xf1c40f, [
        { name: 'Nome', value: read('nome'), inline: true },
        { name: 'Empresa', value: read('empresa'), inline: true },
        { name: 'Cargo', value: read('cargo'), inline: true },
        { name: 'E-mail', value: read('email'), inline: true },
        { name: 'Telefone', value: read('telefone'), inline: true },
        { name: 'Serviço', value: read('servico'), inline: true },
        { name: 'Urgência', value: read('urgencia'), inline: true },
        { name: 'Cidade', value: `${location.city} / ${location.region}`, inline: true },
        { name: 'Sessão', value: sid, inline: true },
        { name: 'Mensagem', value: read('mensagem').slice(0, 1000), inline: false },
        { name: 'URL', value: getPageUrl(), inline: false }
      ]));
    });
  }

  window.addEventListener('scroll', () => {
    maxScroll = Math.max(maxScroll, getScrollDepth());
  }, { passive: true });

  window.addEventListener('beforeunload', () => {
    logBehavior();
  });

  setTimeout(logBehavior, 5 * 60 * 1000);

  logEntryVisit();
  bindTrackedClicks();
  bindFormTracking();
})();
