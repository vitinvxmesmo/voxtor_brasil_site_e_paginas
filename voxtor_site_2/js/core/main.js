// ============================================
// MAIN.JS - INICIALIZADOR PRINCIPAL
// ============================================

// Aguardar carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Voxtor Brasil - Sistema Inicializado');
    
    // Inicializar módulos
    initializeModules();
    
    // Adicionar classe para JavaScript ativo
    document.body.classList.add('js-active');
});

// Inicialização assíncrona dos módulos
async function initializeModules() {
    const modules = [];
    
    // Navegação (sempre inicializar)
    if (typeof VoxtorNavigation !== 'undefined') {
        modules.push(new VoxtorNavigation());
    }
    
    // Tracking (sempre inicializar)
    if (typeof VoxtorTracker !== 'undefined' && !window.VoxtorTracker) {
        window.VoxtorTracker = new VoxtorTracker();
        modules.push(window.VoxtorTracker);
    }
    
    // UI Modules
    if (typeof BackToTop !== 'undefined') {
        modules.push(new BackToTop());
    }
    
    if (typeof VoxtorAnimations !== 'undefined') {
        modules.push(new VoxtorAnimations());
    }
    
    if (typeof VoxtorResponsive !== 'undefined') {
        modules.push(new VoxtorResponsive());
    }
    
    // Formulário de lead (apenas se existir na página)
    if (document.getElementById('contactForm')) {
        if (typeof VoxtorLeadForm !== 'undefined') {
            modules.push(new VoxtorLeadForm());
        }
    }
    
    // Preços (apenas se existir na página)
    if (document.querySelector('.pricing-section')) {
        if (typeof VoxtorPrecos !== 'undefined') {
            modules.push(new VoxtorPrecos());
        }
    }
    
    // CRM Pricing (apenas se existir)
    if (document.getElementById('crm-plans')) {
        if (typeof CRMPricing !== 'undefined') {
            modules.push(new CRMPricing());
        }
    }
    
    // Calculadora Pricing (apenas se existir)
    if (document.getElementById('calculadora-plans')) {
        if (typeof CalculadoraPricing !== 'undefined') {
            modules.push(new CalculadoraPricing());
        }
    }
    
    // Serviços Table (apenas se existir)
    if (document.getElementById('servicos-table')) {
        if (typeof ServicosTable !== 'undefined') {
            modules.push(new ServicosTable());
        }
    }
    
    // Landing Pages (apenas se existir)
    if (document.querySelector('.lp-page')) {
        if (typeof LPUtils !== 'undefined') {
            modules.push(new LPUtils());
        }
        
        if (typeof LPForms !== 'undefined') {
            modules.push(new LPForms());
        }
    }
    
    console.log(`✅ ${modules.length} módulos inicializados`);
}

// Tratamento de erros global
window.addEventListener('error', (e) => {
    console.error('❌ Erro global:', e.error || e.message);
    
    // Tentar logar via tracker se disponível
    if (window.VoxtorTracker?.track) {
        window.VoxtorTracker.track('ERROR', {
            message: e.message,
            filename: e.filename,
            line: e.lineno
        });
    }
});

// Tratamento de promessas não capturadas
window.addEventListener('unhandledrejection', (e) => {
    console.error('❌ Promessa não capturada:', e.reason);
    
    if (window.VoxtorTracker?.track) {
        window.VoxtorTracker.track('ERROR', {
            message: e.reason?.message || 'Unhandled Promise Rejection',
            stack: e.reason?.stack
        });
    }
});