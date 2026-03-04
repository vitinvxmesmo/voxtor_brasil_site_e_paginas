// ============================================
// logs.js - Sistema de Logs para Discord
// ============================================

const VOXTOR_LOGS = {
  // WEBHOOK DO DISCORD - COLOQUE SEU WEBHOOK AQUI
  DISCORD_WEBHOOK: 'https://discord.com/api/webhooks/1478749169278648371/hT6xpIk8TSU-jeGiH7St2ceOVwmWNCYnwPqX_SNwHnz-BYDvA3Jz1m8jml5c2NeDAe0M',
  
  // Sessão única para identificar o visitante
  sessionId: generateSessionId(),
  
  // Timestamp de início
  startTime: new Date().toISOString(),
  
  // Dados do usuário (coletados de forma ética)
  userData: {
    userAgent: navigator.userAgent,
    language: navigator.language,
    screenSize: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    referrer: document.referrer || 'direto',
    timestamp: new Date().toISOString()
  }
};

// ============================================
// GERAR ID ÚNICO PARA SESSÃO
// ============================================
function generateSessionId() {
  return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () => 
    Math.floor(Math.random() * 16).toString(16)
  );
}

// ============================================
// FUNÇÃO PRINCIPAL DE LOG
// ============================================
async function sendToDiscord(eventType, eventData = {}) {
  try {
    const logData = {
      embeds: [{
        title: `Log - ${eventType}`,
        color: getColorForEvent(eventType),
        fields: [
          {
            name: 'Sessão',
            value: VOXTOR_LOGS.sessionId,
            inline: true
          },
          {
            name: 'Página',
            value: window.location.pathname,
            inline: true
          },
          {
            name: 'Hora',
            value: new Date().toLocaleString('pt-BR'),
            inline: true
          },
          {
            name: 'Dados do Evento',
            value: '```json\n' + JSON.stringify(eventData, null, 2) + '\n```'
          }
        ],
        footer: {
          text: `Voxtor Logs • ${VOXTOR_LOGS.userData.referrer}`
        },
        timestamp: new Date().toISOString()
      }]
    };

    // Enviar para o Discord (sem travar o site)
    fetch(VOXTOR_LOGS.DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData)
    }).catch(err => console.log('Log Discord:', err));

  } catch (error) {
    console.log('Erro no sistema de logs:', error);
  }
}

// ============================================
// CORES POR TIPO DE EVENTO
// ============================================
function getColorForEvent(eventType) {
  const colors = {
    'PAGE_VIEW': 0x3498db,
    'NAVIGATION': 0x34495e,
    'FORM_SUBMIT': 0xf1c40f,
    'CALC_ACCESS': 0x9b59b6,
    'CRM_ACCESS': 0x8e44ad,
    'CONTACT_CLICK': 0x2ecc71,
    'ERROR': 0xe74c3c
  };
  return colors[eventType] || 0x95a5a6;
}

// ============================================
// EVENTOS RASTREADOS
// ============================================

// Página visualizada
sendToDiscord('PAGE_VIEW', {
  title: document.title,
  url: window.location.href
});

// Cliques em links importantes
document.addEventListener('click', function(e) {
  const target = e.target.closest('a');
  if (!target) return;
  
  const href = target.getAttribute('href');
  
  if (href?.includes('calc.voxtorbrasil.pro')) {
    sendToDiscord('CALC_ACCESS', {
      linkText: target.innerText,
      href: href
    });
  }
  
  if (href?.includes('crm.voxtorbrasil.pro')) {
    sendToDiscord('CRM_ACCESS', {
      linkText: target.innerText,
      href: href
    });
  }
  
  if (href?.includes('contato') || href?.includes('whatsapp')) {
    sendToDiscord('CONTACT_CLICK', {
      linkText: target.innerText,
      href: href
    });
  }
});

// Navegação
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', function() {
    sendToDiscord('NAVIGATION', {
      from: window.location.pathname,
      to: this.getAttribute('href'),
      linkText: this.innerText
    });
  });
});

// Formulários
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function() {
    sendToDiscord('FORM_SUBMIT', {
      formId: this.id || 'sem-id'
    });
  });
});

// Erros
window.addEventListener('error', function(e) {
  sendToDiscord('ERROR', {
    message: e.message,
    filename: e.filename,
    lineno: e.lineno
  });
});
