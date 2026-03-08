// ============================================
// CONFIGURAÇÕES GLOBAIS DA VOXTOR BRASIL
// ============================================

const VOXTOR_CONFIG = {
    // Identidade Visual
    brand: {
        name: 'Voxtor Brasil',
        primaryColor: '#c00d84',
        secondaryColor: '#5e0557',
        accentColor: '#ff29e2',
        logo: '/assets/logo.png'
    },
    
    // URLs do Site
    urls: {
        site: 'https://www.voxtorbrasil.pro',
        calculadora: 'https://voxtor-calculadora.web.app',
        crm: 'https://crm.voxtorbrasil.pro'
    },
    
    // APIs e Integrações
    api: {
        devskin: {
            key: 'dsk_eb474e3381610d9659af4b105111e92a2fefa3015b2641336958b840d80f',
            baseUrl: 'https://crm-api.devskin.com/api/v1'
        },
        discord: {
            webhookLogs: 'https://discord.com/api/webhooks/1478749169278648371/hT6xpIk8TSU-jeGiH7St2ceOVwmWNCYnwPqX_SNwHnz-BYDvA3Jz1m8jml5c2NeDAe0M',
            webhookLeads: 'https://discord.com/api/webhooks/1455502427762589756/2dxRVXSaFNfqCJEJXTUvkb1EtjlKMtGh6B_pknagBts0wrHSQR77JWn6KqFNOZlGG4wU'
        }
    },
    
    // Breakpoints Responsivos
    breakpoints: {
        mobile: 768,
        tablet: 992,
        desktop: 1200
    },
    
    // Mensagens do Sistema
    messages: {
        formSuccess: 'Solicitação recebida com sucesso!',
        formError: 'Ocorreu um erro. Tente novamente.',
        formSending: 'Enviando...',
        validation: {
            required: 'Campo obrigatório',
            email: 'E-mail inválido',
            phone: 'Telefone inválido'
        }
    },
    
    // Tracking
    tracking: {
        googleAnalyticsId: 'G-XXXXXXXXXX',
        facebookPixelId: 'XXXXXXXXXX',
        linkedinInsightId: 'XXXXXXX'
    }
};

// Não modificar - Congela a configuração
Object.freeze(VOXTOR_CONFIG);