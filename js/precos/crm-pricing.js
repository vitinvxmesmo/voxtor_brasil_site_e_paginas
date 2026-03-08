// ============================================
// crm-pricing.js - Planos do CRM
// ============================================

class CRMPricing {
    constructor() {
        this.plans = [
            {
                id: 'crm-free',
                name: 'Free',
                price: 0,
                period: 'month',
                features: [
                    '100 contatos',
                    '1 usuário'
                ],
                cta: 'Criar conta grátis',
                ctaLink: '/cadastro.html',
                popular: false
            },
            {
                id: 'crm-starter',
                name: 'Starter',
                price: 99,
                period: 'month',
                features: [
                    '1000 contatos',
                    '3 usuários',
                    'Integração WhatsApp',
                    'Assistente IA',
                    'Base de Conhecimento',
                    'Marca Personalizada',
                    '50 contatos grátis/mês no Marketplace'
                ],
                cta: 'Assinar Agora',
                ctaLink: '/create-checkout-session?plan=starter',
                popular: false
            },
            {
                id: 'crm-professional',
                name: 'Professional',
                price: 374,
                period: 'month',
                features: [
                    '2000 contatos',
                    '5 usuários',
                    'Integração WhatsApp',
                    'Integração Instagram',
                    'Integração Telegram',
                    'Bot Avançado',
                    'Assistente IA',
                    'Base de Conhecimento',
                    'Suporte Prioritário',
                    'Marca Personalizada',
                    '200 contatos grátis/mês no Marketplace'
                ],
                cta: 'Assinar Agora',
                ctaLink: '/create-checkout-session?plan=professional',
                popular: true
            },
            {
                id: 'crm-enterprise',
                name: 'Enterprise',
                price: 499,
                period: 'month',
                features: [
                    '10000 contatos',
                    '10 usuários',
                    'Integração WhatsApp',
                    'Integração Instagram',
                    'Integração Telegram',
                    'Bot Avançado',
                    'Assistente IA',
                    'Base de Conhecimento',
                    'Suporte Prioritário',
                    'Marca Personalizada',
                    '1000 contatos grátis/mês no Marketplace'
                ],
                cta: 'Assinar Agora',
                ctaLink: '/create-checkout-session?plan=enterprise',
                popular: false
            }
        ];
        
        this.annualDiscount = 0.2;
        this.init();
    }
    
    init() {
        this.renderPlans();
        this.setupEventListeners();
    }
    
    renderPlans() {
        const container = document.getElementById('crm-plans');
        if (!container) return;
        
        let html = '';
        
        this.plans.forEach(plan => {
            const annualPrice = Math.round(plan.price * 12 * (1 - this.annualDiscount));
            const monthlyAnnualPrice = Math.round(annualPrice / 12);
            
            html += `
                <div class="pricing-card ${plan.popular ? 'featured' : ''}">
                    ${plan.popular ? '<div class="popular-badge">Mais Popular</div>' : ''}
                    <h3>${plan.name}</h3>
                    <div class="price-container">
                        <div class="price price-monthly">R$ ${plan.price}</div>
                        <div class="price price-annual" style="display: none;">R$ ${monthlyAnnualPrice}</div>
                        <span class="period-label">/mês</span>
                    </div>
                    <p class="price-note">${plan.price === 0 ? 'Sempre grátis' : 'Cancele quando quiser'}</p>
                    <ul class="features-list">
                        ${plan.features.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                    <form action="${plan.ctaLink}" method="POST">
                        <input type="hidden" name="plan_id" value="${plan.id}">
                        <button type="submit" class="btn btn-primary btn-block">${plan.cta}</button>
                    </form>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    setupEventListeners() {
        window.addEventListener('period-change', (e) => {
            this.togglePeriod(e.detail.isAnnual);
        });
    }
    
    togglePeriod(isAnnual) {
        const monthlyPrices = document.querySelectorAll('#crm-plans .price-monthly');
        const annualPrices = document.querySelectorAll('#crm-plans .price-annual');
        const periodLabels = document.querySelectorAll('#crm-plans .period-label');
        
        monthlyPrices.forEach(el => el.style.display = isAnnual ? 'none' : 'block');
        annualPrices.forEach(el => el.style.display = isAnnual ? 'block' : 'none');
        periodLabels.forEach(el => {
            el.textContent = isAnnual ? '/mês (anual)' : '/mês';
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('crm-plans')) {
        window.CRMPricing = new CRMPricing();
    }
});