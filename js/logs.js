// ============================================
// logs.js - Sistema de Logs para Discord (COMPLETO)
// ============================================

const VOXTOR_LOGS = {
  // WEBHOOK DO DISCORD - COLOQUE SEU WEBHOOK AQUI
  DISCORD_WEBHOOK: 'https://discord.com/api/webhooks/1478749169278648371/hT6xpIk8TSU-jeGiH7St2ceOVwmWNCYnwPqX_SNwHnz-BYDvA3Jz1m8jml5c2NeDAe0M',
  
  // Sessão única para identificar o visitante
  sessionId: generateSessionId(),
  
  // Timestamp de início
  startTime: new Date().toISOString(),
  
  // Dados do usuário
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
// DETECTAR DISPOSITIVO E SISTEMA OPERACIONAL
// ============================================
function getDeviceAndOS() {
  const ua = navigator.userAgent;
  
  // Detectar sistema operacional
  let os = 'Desconhecido';
  if (ua.indexOf('Windows') !== -1) os = 'Windows';
  else if (ua.indexOf('Mac OS') !== -1) os = 'macOS';
  else if (ua.indexOf('Linux') !== -1) os = 'Linux';
  else if (ua.indexOf('Android') !== -1) os = 'Android';
  else if (ua.indexOf('iOS') !== -1 || ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== -1) os = 'iOS';
  else if (ua.indexOf('CrOS') !== -1) os = 'Chrome OS';
  
  // Detectar tipo de dispositivo
  let device = 'Desktop';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) device = 'Tablet';
  else if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) device = 'Celular';
  
  // Detalhar modelo se for iPhone/iPad
  let model = '';
  if (ua.indexOf('iPhone') !== -1) model = 'iPhone';
  else if (ua.indexOf('iPad') !== -1) model = 'iPad';
  else if (ua.indexOf('Samsung') !== -1) model = 'Samsung';
  
  return {
    os: os,
    device: device,
    model: model,
    browser: getBrowser(ua)
  };
}

// ============================================
// DETECTAR NAVEGADOR
// ============================================
function getBrowser(ua) {
  if (ua.indexOf('Chrome') !== -1) return 'Chrome';
  if (ua.indexOf('Firefox') !== -1) return 'Firefox';
  if (ua.indexOf('Safari') !== -1) return 'Safari';
  if (ua.indexOf('Edge') !== -1) return 'Edge';
  if (ua.indexOf('MSIE') !== -1 || ua.indexOf('Trident') !== -1) return 'Internet Explorer';
  return 'Outro';
}

// ============================================
// BUSCAR LOCALIZAÇÃO (CIDADE/ESTADO) PELO IP
// ============================================
async function getUserLocation() {
  try {
    // Usando ipapi.co (gratuito, sem necessidade de chave)
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    return {
      cidade: data.city || 'Desconhecida',
      estado: data.region || 'Desconhecido',
      pais: data.country_name || 'Desconhecido',
      cep: data.postal || null,
      latitude: data.latitude,
      longitude: data.longitude
    };
  } catch (error) {
    console.log('Erro ao buscar localização:', error);
    
    // Fallback: API secundária gratuita
    try {
      const fallbackResponse = await fetch('https://ipapi.co/json/');
      const fallbackData = await fallbackResponse.json();
      return {
        cidade: fallbackData.city || 'Desconhecida',
        estado: fallbackData.region || 'Desconhecido',
        pais: fallbackData.country_name || 'Desconhecido',
        cep: null,
        latitude: null,
        longitude: null
      };
    } catch {
      return null;
    }
  }
}

// ============================================
// FUNÇÃO PRINCIPAL DE LOG
// ============================================
async function sendToDiscord(eventType, eventData = {}) {
  try {
    const deviceInfo = getDeviceAndOS();
    const location = await getUserLocation();
    
    // Montar campos de localização
    let locationText = 'Não disponível';
    if (location) {
      locationText = `${location.cidade} - ${location.estado} (${location.pais})`;
    }
    
    const logData = {
      embeds: [{
        title: `📊 Log - ${eventType}`,
        color: getColorForEvent(eventType),
        fields: [
          {
            name: '🆔 Sessão',
            value: VOXTOR_LOGS.sessionId,
            inline: true
          },
          {
            name: '📄 Página',
            value: window.location.pathname || 'Início',
            inline: true
          },
          {
            name: '⏰ Hora',
            value: new Date().toLocaleString('pt-BR'),
            inline: true
          },
          {
            name: '📍 Localização',
            value: locationText,
            inline: false
          },
          {
            name: '📱 Dispositivo',
            value: `${deviceInfo.device} ${deviceInfo.model}`,
            inline: true
          },
          {
            name: '💻 Sistema',
            value: deviceInfo.os,
            inline: true
          },
          {
            name: '🌐 Navegador',
            value: deviceInfo.browser,
            inline: true
          },
          {
            name: '📺 Tela',
            value: VOXTOR_LOGS.userData.screenSize,
            inline: true
          },
          {
            name: '🗣️ Idioma',
            value: VOXTOR_LOGS.userData.language,
            inline: true
          },
          {
            name: '🕒 Fuso',
            value: VOXTOR_LOGS.userData.timezone,
            inline: true
          },
          {
            name: '📋 Origem',
            value: VOXTOR_LOGS.userData.referrer,
            inline: true
          },
          {
            name: '🔍 Detalhes do Evento',
            value: '```json\n' + JSON.stringify(eventData, null, 2) + '\n```'
          }
        ],
        footer: {
          text: `🔎 IP: Buscado via API • Voxtor Logs`
        },
        timestamp: new Date().toISOString()
      }]
    };

    // Enviar para o Discord
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
    'PAGE_VIEW': 0x3498db,     // Azul
    'NAVIGATION': 0x34495e,    // Azul escuro
    'FORM_SUBMIT': 0xf1c40f,   // Amarelo
    'CALC_ACCESS': 0x9b59b6,   // Roxo
    'CRM_ACCESS': 0x8e44ad,    // Roxo escuro
    'CONTACT_CLICK': 0x2ecc71, // Verde
    'ERROR': 0xe74c3c          // Vermelho
  };
  return colors[eventType] || 0x95a5a6; // Cinza padrão
}

// ============================================
// EVENTOS RASTREADOS
// ============================================

// Função para executar logs sem travar o site
function safeLog(eventType, data) {
  // Executa de forma assíncrona
  setTimeout(() => sendToDiscord(eventType, data), 100);
}

// 1. PÁGINA VISUALIZADA (executa imediatamente)
setTimeout(() => {
  safeLog('PAGE_VIEW', {
    titulo: document.title,
    url: window.location.href
  });
}, 500); // Pequeno delay pra não atrapalhar carregamento

// 2. CLIQUES EM LINKS
document.addEventListener('click', function(e) {
  const target = e.target.closest('a');
  if (!target) return;
  
  const href = target.getAttribute('href');
  const text = target.innerText || target.textContent;
  
  // Links importantes
  if (href?.includes('calc.voxtorbrasil.pro')) {
    safeLog('CALC_ACCESS', {
      link: text.trim(),
      href: href
    });
  }
  
  if (href?.includes('crm.voxtorbrasil.pro')) {
    safeLog('CRM_ACCESS', {
      link: text.trim(),
      href: href
    });
  }
  
  if (href?.includes('contato') || href?.includes('whatsapp') || href?.includes('tel:')) {
    safeLog('CONTACT_CLICK', {
      link: text.trim(),
      href: href
    });
  }
});

// 3. NAVEGAÇÃO (menu principal)
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.nav-menu a, .menu a, header a, nav a').forEach(link => {
    link.addEventListener('click', function() {
      safeLog('NAVIGATION', {
        de: window.location.pathname,
        para: this.getAttribute('href'),
        texto: this.innerText?.trim()
      });
    });
  });
});

// 4. FORMULÁRIOS
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function() {
      const formData = {};
      // Capturar campos principais do formulário (sem senhas)
      this.querySelectorAll('input:not([type="password"]), select, textarea').forEach(field => {
        if (field.name && field.value) {
          formData[field.name] = field.value.substring(0, 50); // Limitar tamanho
        }
      });
      
      safeLog('FORM_SUBMIT', {
        formId: this.id || 'form-sem-id',
        formAction: this.action || 'mesma-página',
        campos: formData
      });
    });
  });
});

// 5. ERROS
window.addEventListener('error', function(e) {
  safeLog('ERROR', {
    mensagem: e.message,
    arquivo: e.filename?.split('/').pop(),
    linha: e.lineno,
    coluna: e.colno
  });
});

// ============================================
// INICIALIZAÇÃO
// ============================================
console.log('✅ Sistema de logs Voxtor carregado');