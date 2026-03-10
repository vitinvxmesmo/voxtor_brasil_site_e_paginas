/**
 * VOXTOR BRASIL — logs.js
 * Rastreamento de visitas, ações e formulários via Discord Webhooks
 * Adicionar no <head> de todos os HTMLs: <script src="logs.js" defer></script>
 */

/* ============================================================
   WEBHOOKS
   ============================================================ */
const WEBHOOKS = {
  formulario : 'https://discord.com/api/webhooks/1478749169278648371/hT6xpIk8TSU-jeGiH7St2ceOVwmWNCYnwPqX_SNwHnz-BYDvA3Jz1m8jml5c2NeDAe0M',
  comportamento: 'https://discord.com/api/webhooks/1480760963887136938/ZOgfVltGNK-O3mjtewvO9advvFxMgBGtpxsJhV_cFX_BobgJX21U2dEnLN9uBk91DQIv',
  origem    : 'https://discord.com/api/webhooks/1480761186847953057/Js20OxfcS0jtVv_1-4RCmttrm3CV7OekDrP-J3vH7JmvnIOGWarlFHDRLcWiQah11AcB',
  acoes     : 'https://discord.com/api/webhooks/1480761316632170656/W6jMsMX3VYp4Gm5XCgOznXSZ2IJ415bRNEmUnNQAYmxcjuSJd4eIYsmB87iOUg1rUoK0',
};

/* ============================================================
   UTILITÁRIOS
   ============================================================ */
const PAGE_NAMES = {
  'index.html'   : '🏠 Home',
  ''             : '🏠 Home',
  'services.html': '⚙️ Serviços',
  'products.html': '📦 Produtos',
  'about.html'   : '🏢 Sobre',
  'contact.html' : '📩 Contato',
};

function getPageName() {
  const file = window.location.pathname.split('/').pop();
  return PAGE_NAMES[file] || file || '🏠 Home';
}

function getPageUrl() {
  return window.location.href;
}

function getTimestamp() {
  return new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

function getDeviceInfo() {
  const ua = navigator.userAgent;
  let device = '🖥️ Desktop';
  if (/Mobi|Android|iPhone/i.test(ua)) device = '📱 Mobile';
  else if (/iPad|Tablet/i.test(ua)) device = '📟 Tablet';

  let browser = 'Desconhecido';
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Edg')) browser = 'Edge';

  let os = 'Desconhecido';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Linux')) os = 'Linux';

  return { device, browser, os };
}

function getReferrer() {
  const ref = document.referrer;
  if (!ref) return '📌 Acesso Direto';
  if (ref.includes('google'))    return '🔍 Google';
  if (ref.includes('bing'))      return '🔍 Bing';
  if (ref.includes('facebook'))  return '📘 Facebook';
  if (ref.includes('instagram')) return '📸 Instagram';
  if (ref.includes('linkedin'))  return '💼 LinkedIn';
  if (ref.includes('whatsapp'))  return '💬 WhatsApp';
  if (ref.includes('youtube'))   return '▶️ YouTube';
  if (ref.includes('voxtorbrasil')) return '🔄 Interno (Voxtor)';
  return `🌐 ${ref.split('/')[2]}`;
}

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    source  : params.get('utm_source')   || null,
    medium  : params.get('utm_medium')   || null,
    campaign: params.get('utm_campaign') || null,
  };
}

// Gera ou recupera um ID de sessão anônimo para identificar visitante recorrente
function getSessionId() {
  let sid = sessionStorage.getItem('vx_sid');
  if (!sid) {
    sid = 'VX-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    sessionStorage.setItem('vx_sid', sid);
  }
  return sid;
}

function getVisitCount() {
  let count = parseInt(localStorage.getItem('vx_visits') || '0') + 1;
  localStorage.setItem('vx_visits', count);
  return count;
}

async function sendToDiscord(webhookUrl, payload) {
  try {
    await fetch(webhookUrl, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(payload),
    });
  } catch (_) {
    // Silencioso — nunca afetar o usuário
  }
}

/* ============================================================
   1. ORIGEM DO VISITANTE
   Dispara uma vez por sessão ao carregar qualquer página
   ============================================================ */
(function logOrigem() {
  if (sessionStorage.getItem('vx_origem_sent')) return;
  sessionStorage.setItem('vx_origem_sent', '1');

  const { device, browser, os } = getDeviceInfo();
  const referrer = getReferrer();
  const utm      = getUtmParams();
  const visits   = getVisitCount();
  const sid      = getSessionId();

  const utmFields = [];
  if (utm.source)   utmFields.push({ name: '📣 UTM Source',   value: utm.source,   inline: true });
  if (utm.medium)   utmFields.push({ name: '📡 UTM Medium',   value: utm.medium,   inline: true });
  if (utm.campaign) utmFields.push({ name: '🎯 UTM Campaign', value: utm.campaign, inline: true });

  const payload = {
    embeds: [{
      title      : '🌍 Novo Visitante',
      color      : 0x9b59b6,
      fields     : [
        { name: '📄 Página de Entrada', value: getPageName(),    inline: true  },
        { name: '🔗 URL',               value: getPageUrl(),     inline: false },
        { name: '📥 Origem',            value: referrer,         inline: true  },
        { name: '💻 Dispositivo',       value: device,           inline: true  },
        { name: '🌐 Navegador',         value: browser,          inline: true  },
        { name: '🖥️ Sistema',          value: os,               inline: true  },
        { name: '🔁 Visitas Totais',    value: `${visits}ª visita`, inline: true },
        { name: '🪪 Sessão ID',         value: sid,              inline: true  },
        ...utmFields,
      ],
      footer     : { text: `Voxtor Brasil Logs • ${getTimestamp()}` },
      thumbnail  : { url: 'https://www.voxtorbrasil.pro/favicons/favicon_logo.png' },
    }],
  };

  sendToDiscord(WEBHOOKS.origem, payload);
})();

/* ============================================================
   2. COMPORTAMENTO DE VISITA
   Rastreia: tempo na página, profundidade de scroll, saída
   ============================================================ */
(function logComportamento() {
  const startTime  = Date.now();
  const pageName   = getPageName();
  const sid        = getSessionId();
  let   maxScroll  = 0;
  let   sent       = false;

  // Rastreia profundidade de scroll
  window.addEventListener('scroll', () => {
    const scrolled = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    if (scrolled > maxScroll) maxScroll = Math.min(scrolled, 100);
  }, { passive: true });

  function getScrollEmoji(pct) {
    if (pct >= 90) return '🟢 Leu tudo ('+pct+'%)';
    if (pct >= 60) return '🟡 Leu bastante ('+pct+'%)';
    if (pct >= 30) return '🟠 Leu parcialmente ('+pct+'%)';
    return '🔴 Pouquíssimo ('+pct+'%)';
  }

  function sendBehavior() {
    if (sent) return;
    sent = true;

    const seconds  = Math.round((Date.now() - startTime) / 1000);
    const minutes  = Math.floor(seconds / 60);
    const secs     = seconds % 60;
    const timeStr  = minutes > 0 ? `${minutes}min ${secs}s` : `${secs}s`;

    const payload = {
      embeds: [{
        title : '📊 Comportamento de Visita',
        color : 0x2ecc71,
        fields: [
          { name: '📄 Página',          value: pageName,                    inline: true  },
          { name: '⏱️ Tempo na Página', value: timeStr,                     inline: true  },
          { name: '📜 Scroll',          value: getScrollEmoji(maxScroll),   inline: true  },
          { name: '🔗 URL',             value: getPageUrl(),                inline: false },
          { name: '🪪 Sessão ID',       value: sid,                         inline: true  },
        ],
        footer: { text: `Voxtor Brasil Logs • ${getTimestamp()}` },
        thumbnail: { url: 'https://www.voxtorbrasil.pro/favicons/favicon_logo.png' },
      }],
    };

    sendToDiscord(WEBHOOKS.comportamento, payload);
  }

  // Envia ao sair da página
  window.addEventListener('beforeunload', sendBehavior);
  // Envia também se ficar mais de 5 min (página aberta e esquecida)
  setTimeout(sendBehavior, 5 * 60 * 1000);
})();

/* ============================================================
   3. AÇÕES DE ALTO VALOR
   Rastreia cliques em botões e links estratégicos
   ============================================================ */
(function logAcoes() {
  const sid      = getSessionId();
  const pageName = getPageName();

  // Mapa: seletor CSS → label da ação
  const TRACKED_ACTIONS = [
    { selector: 'a[href="contact.html"]',                          label: '📩 Clicou em "Falar com Especialista"' },
    { selector: 'a[href*="wa.me"]',                                label: '💬 Clicou no WhatsApp'                },
    { selector: 'a[href="https://calc.voxtorbrasil.pro"]',         label: '🧮 Clicou em "Acessar Calculadora"'   },
    { selector: 'a[href="https://crm.voxtorbrasil.pro"]',          label: '📋 Clicou em "Acessar CRM"'           },
    { selector: 'a[href="contact.html"].btn--primary',             label: '🗓️ Clicou em "Agendar Demo"'          },
    { selector: '.btn--cyan[href="contact.html"]',                 label: '🚀 Clicou em CTA Principal'           },
    { selector: 'a[href*="mailto"]',                               label: '📧 Clicou no E-mail'                  },
    { selector: '.nav__cta',                                       label: '🔝 Clicou no CTA do Menu'             },
    { selector: '#contactForm [data-next]',                        label: '📝 Iniciou o Formulário (Etapa 1→2)'  },
    { selector: '#contactForm [data-next]:last-of-type',           label: '📝 Avançou para Etapa 3 do Formulário'},
  ];

  TRACKED_ACTIONS.forEach(({ selector, label }) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.addEventListener('click', () => {
        const payload = {
          embeds: [{
            title : '⚡ Ação de Alto Valor',
            color : 0xe74c3c,
            fields: [
              { name: '🎯 Ação',         value: label,     inline: false },
              { name: '📄 Página',       value: pageName,  inline: true  },
              { name: '🪪 Sessão ID',    value: sid,       inline: true  },
              { name: '🔗 URL',          value: getPageUrl(), inline: false },
            ],
            footer   : { text: `Voxtor Brasil Logs • ${getTimestamp()}` },
            thumbnail: { url: 'https://www.voxtorbrasil.pro/favicons/favicon_logo.png' },
          }],
        };
        sendToDiscord(WEBHOOKS.acoes, payload);
      });
    });
  });
})();

/* ============================================================
   4. FORMULÁRIO DE CONTATO
   Dispara ao enviar o formulário com todos os dados preenchidos
   ============================================================ */
(function logFormulario() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', () => {
    const get = (id) => {
      const el = document.getElementById(id);
      return el ? (el.value.trim() || '—') : '—';
    };

    const urgenciaMap = {
      imediato    : '🔴 Imediato (próximas 2 semanas)',
      curto       : '🟠 Curto prazo (1–3 meses)',
      medio       : '🟡 Médio prazo (3–6 meses)',
      planejamento: '🟢 Apenas explorando',
    };

    const servicoMap = {
      consultoria   : 'Consultoria de TI',
      suporte       : 'Suporte Técnico',
      automacao     : 'Automação & IoT',
      infraestrutura: 'Infraestrutura',
      bi            : 'Business Intelligence',
      calculadora   : 'Calculadora Financeira',
      crm           : 'CRM Corporativo',
      multiplos     : 'Múltiplos Serviços',
      outro         : 'Outro / Não sei',
    };

    const nome     = get('nome');
    const email    = get('email');
    const telefone = get('telefone');
    const empresa  = get('empresa');
    const cargo    = get('cargo');
    const setor    = get('setor')    || '—';
    const servico  = servicoMap[get('servico')]  || get('servico');
    const mensagem = get('mensagem');
    const urgencia = urgenciaMap[get('urgencia')] || '—';
    const sid      = getSessionId();
    const visits   = localStorage.getItem('vx_visits') || '1';

    const payload = {
      embeds: [{
        title      : '🎉 Novo Lead — Formulário Preenchido!',
        description: `**${nome}** da empresa **${empresa}** enviou uma mensagem.`,
        color      : 0xd11586,
        fields     : [
          // Contato
          { name: '👤 Nome',          value: nome,     inline: true  },
          { name: '🏢 Empresa',       value: empresa,  inline: true  },
          { name: '💼 Cargo',         value: cargo,    inline: true  },
          { name: '📧 E-mail',        value: `[${email}](mailto:${email})`, inline: true  },
          { name: '📱 WhatsApp',      value: `[${telefone}](https://wa.me/${telefone.replace(/\D/g,'')})`, inline: true },
          { name: '🏭 Setor',         value: setor,    inline: true  },
          // Interesse
          { name: '🎯 Interesse',     value: servico,  inline: true  },
          { name: '⏰ Urgência',      value: urgencia, inline: true  },
          // Mensagem
          { name: '💬 Mensagem',      value: mensagem.substring(0, 1000), inline: false },
          // Meta
          { name: '🔁 Visitas Anteriores', value: `${visits}ª visita`, inline: true },
          { name: '🪪 Sessão ID',     value: sid,      inline: true  },
          { name: '🔗 Origem',        value: getPageUrl(), inline: false },
        ],
        footer     : { text: `Voxtor Brasil — Lead Recebido • ${getTimestamp()}` },
        thumbnail  : { url: 'https://www.voxtorbrasil.pro/favicons/favicon_logo.png' },
      }],
    };

    sendToDiscord(WEBHOOKS.formulario, payload);
  });
})();