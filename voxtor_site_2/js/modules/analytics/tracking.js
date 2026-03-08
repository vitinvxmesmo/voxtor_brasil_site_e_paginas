// ============================================
// tracking.js - SISTEMA DE TRACKING PROFISSIONAL
// ============================================

class VoxtorTracker {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.eventQueue = [];
        this.isSending = false;
        
        this.init();
    }
    
    init() {
        // Track page view
        this.track('PAGE_VIEW', {
            title: document.title,
            url: window.location.href,
            referrer: document.referrer || 'direct'
        });
        
        // Setup event listeners
        this.setupLinkTracking();
        this.setupErrorTracking();
        this.setupTimeTracking();
        this.setupFormTracking();
    }
    
    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Método principal de tracking
    track(eventType, data = {}) {
        const event = {
            type: eventType,
            sessionId: this.sessionId,
            timestamp: new Date().toISOString(),
            timeOnPage: Date.now() - this.startTime,
            url: window.location.href,
            device: VoxtorUtils.getDeviceInfo(),
            data: data
        };
        
        // Adicionar à fila
        this.eventQueue.push(event);
        
        // Log local (opcional)
        if (window.location.hostname === 'localhost' || window.location.hostname.includes('staging')) {
            console.log(`[VOXTOR TRACK] ${eventType}`, data);
        }
        
        // Enviar em lote a cada 5 segundos ou se tiver 10 eventos
        if (this.eventQueue.length >= 10) {
            this.flush();
        } else if (!this.isSending) {
            setTimeout(() => this.flush(), 5000);
        }
        
        // Também enviar para Google Analytics se disponível
        this.sendToGA(eventType, data);
        
        // Também enviar para Facebook Pixel se disponível
        this.sendToFB(eventType, data);
        
        return event;
    }
    
    async flush() {
        if (this.isSending || this.eventQueue.length === 0) return;
        
        this.isSending = true;
        const events = [...this.eventQueue];
        this.eventQueue = [];
        
        try {
            // Enviar para Discord (cada evento individualmente devido ao limite)
            for (const event of events) {
                await this.sendToDiscord(event);
                // Pequeno delay para não floodar
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        } catch (error) {
            console.warn('Erro ao enviar eventos:', error);
            // Recolocar na fila se falhar
            this.eventQueue.unshift(...events);
        } finally {
            this.isSending = false;
        }
    }
    
    async sendToDiscord(event) {
        const colors = {
            'PAGE_VIEW': 0x3498db,
            'NAVIGATION': 0x34495e,
            'FORM_SUBMIT': 0xf1c40f,
            'CALC_ACCESS': 0x9b59b6,
            'CRM_ACCESS': 0x8e44ad,
            'CONTACT_CLICK': 0x2ecc71,
            'ERROR': 0xe74c3c,
            'CONVERSION': 0x2ecc71
        };
        
        const embed = {
            title: `📊 ${event.type}`,
            color: colors[event.type] || 0x95a5a6,
            fields: [
                {
                    name: '🆔 Sessão',
                    value: event.sessionId.substring(0, 8) + '...',
                    inline: true
                },
                {
                    name: '⏱️ Tempo na página',
                    value: Math.floor(event.timeOnPage / 1000) + 's',
                    inline: true
                },
                {
                    name: '📱 Dispositivo',
                    value: `${event.device.type} (${event.device.os})`,
                    inline: true
                },
                {
                    name: '🔍 Detalhes',
                    value: '```json\n' + JSON.stringify(event.data, null, 2).substring(0, 900) + '\n```'
                }
            ],
            footer: {
                text: `Voxtor Analytics • ${new Date(event.timestamp).toLocaleString('pt-BR')}`
            }
        };
        
        // Adicionar localização se disponível
        try {
            const location = await this.getUserLocation();
            if (location) {
                embed.fields.push({
                    name: '📍 Localização',
                    value: `${location.city} - ${location.region}, ${location.country}`,
                    inline: false
                });
            }
        } catch {}
        
        await fetch(VOXTOR_CONFIG.api.discord.webhookLogs, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] })
        });
    }
    
    async getUserLocation() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            return {
                city: data.city,
                region: data.region,
                country: data.country_name
            };
        } catch {
            return null;
        }
    }
    
    sendToGA(eventType, data) {
        if (typeof gtag === 'undefined') return;
        
        switch(eventType) {
            case 'PAGE_VIEW':
                gtag('event', 'page_view', {
                    page_title: data.title,
                    page_location: data.url
                });
                break;
                
            case 'FORM_SUBMIT':
                gtag('event', 'generate_lead', {
                    event_category: 'form',
                    event_label: data.formId || 'contact'
                });
                break;
                
            case 'CONVERSION':
                gtag('event', 'conversion', {
                    send_to: VOXTOR_CONFIG.tracking.googleAnalyticsId + '/CONVERSION_LABEL',
                    value: data.value || 1.0,
                    currency: 'BRL'
                });
                break;
        }
    }
    
    sendToFB(eventType, data) {
        if (typeof fbq === 'undefined') return;
        
        switch(eventType) {
            case 'PAGE_VIEW':
                fbq('track', 'PageView');
                break;
                
            case 'FORM_SUBMIT':
                fbq('track', 'Lead', {
                    content_name: data.formId || 'contact',
                    content_category: 'form'
                });
                break;
                
            case 'CONVERSION':
                fbq('track', 'Lead', data);
                break;
        }
    }
    
    async sendLeadToDiscord(leadData, leadId) {
        const servicesList = leadData.servicos ? leadData.servicos.join('\n') : 'Não informado';
        
        const embed = {
            title: `🎯 NOVO LEAD - ${leadData.servicos?.[0] || 'Contato'}`,
            color: 0x8e44ad,
            fields: [
                { name: "👤 Cliente", value: leadData.nome, inline: true },
                { name: "🏢 Empresa", value: leadData.empresa || 'Não informada', inline: true },
                { name: "📧 Email", value: leadData.email, inline: true },
                { name: "📞 Telefone", value: leadData.telefone, inline: true },
                { name: "🔧 Serviços", value: servicesList, inline: false },
                { name: "⚡ Urgência", value: leadData.urgencia || 'Não informada', inline: true },
                { name: "🆔 Lead ID", value: leadId || 'Pendente', inline: true }
            ],
            footer: { 
                text: `Sessão: ${this.sessionId.substring(0, 8)} • ${new Date().toLocaleString('pt-BR')}`
            }
        };
        
        await fetch(VOXTOR_CONFIG.api.discord.webhookLeads, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] })
        });
    }
    
    setupLinkTracking() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.getAttribute('href') || '';
            
            // Links importantes
            if (href.includes('calc.voxtorbrasil.pro') || href.includes('voxtor-calculadora')) {
                this.track('CALC_ACCESS', {
                    text: link.innerText?.trim(),
                    href: href
                });
            }
            
            if (href.includes('crm.voxtorbrasil.pro')) {
                this.track('CRM_ACCESS', {
                    text: link.innerText?.trim(),
                    href: href
                });
            }
            
            if (href.includes('contato') || href.includes('whatsapp') || href.includes('tel:')) {
                this.track('CONTACT_CLICK', {
                    text: link.innerText?.trim(),
                    href: href
                });
            }
            
            // Links de navegação
            if (link.closest('nav') || link.closest('.nav-menu') || link.closest('.menu')) {
                this.track('NAVIGATION', {
                    from: window.location.pathname,
                    to: href,
                    text: link.innerText?.trim()
                });
            }
        });
    }
    
    setupErrorTracking() {
        window.addEventListener('error', (e) => {
            this.track('ERROR', {
                message: e.message,
                filename: e.filename?.split('/').pop(),
                line: e.lineno,
                column: e.colno
            });
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            this.track('ERROR', {
                message: e.reason?.message || 'Promise rejection',
                stack: e.reason?.stack
            });
        });
    }
    
    setupTimeTracking() {
        let timeSpent = 0;
        const interval = setInterval(() => {
            timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
        }, 1000);
        
        window.addEventListener('beforeunload', () => {
            clearInterval(interval);
            
            // Enviar via sendBeacon (mais confiável para beforeunload)
            const data = {
                type: 'SESSION_END',
                sessionId: this.sessionId,
                timeSpent: timeSpent,
                url: window.location.href
            };
            
            navigator.sendBeacon(
                VOXTOR_CONFIG.api.discord.webhookLogs,
                new Blob([JSON.stringify({ content: `⏱️ Sessão finalizada: ${timeSpent}s` })], 
                { type: 'application/json' })
            );
        });
    }
    
    setupFormTracking() {
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.id === 'contactForm' || form.classList.contains('lp-form')) {
                this.track('FORM_SUBMIT', {
                    formId: form.id,
                    formAction: form.action
                });
            }
        });
    }
}

// Inicializar tracker global
let VoxtorTracker = null;
document.addEventListener('DOMContentLoaded', () => {
    VoxtorTracker = new VoxtorTracker();
});