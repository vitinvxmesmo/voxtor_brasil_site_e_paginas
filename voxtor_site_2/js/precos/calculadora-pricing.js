// ============================================
// calculadora-pricing.js - Planos da Calculadora
// ============================================

class CalculadoraPricing {
    constructor() {
        this.plans = [
            {
                id: 'calc-free',
                name: 'Gratuito',
                price: 0,
                period: 'month',
                features: [
                    'Cálculos básicos',
                    'Taxas padrão',
                    'Sem limite diário',
                    'Acesso web'
                ],
                cta: 'Usar grátis',
                ctaLink: 'https://voxtor-calculadora.web.app/',
                popular: false
            },
            {
                id: 'calc-premium',
                name: 'Premium',
                price: 52.45,
                priceUSD: 10,
                period: 'month',
                features: [
                    'Cálculos ilimitados',
                    'Todas as taxas atualizadas',
                    'Relatórios em PDF',
                    'Histórico de simulações',
                    'Suporte prioritário',
                    'API de integração'
                ],
                cta: 'Assinar Premium',
                ctaLink: '/create-checkout-session?plan=calc-premium',
                popular: true
            }
        ];
        
        this.init();
    }
    
    init() {
        this.renderPlans();
        this.setupEventListeners();
    }
    
    renderPlans() {
        const container = document.getElementById('calculadora-plans');
        if (!container) return;
        
        let html = '<div class="pricing-grid">';
        
        this.plans.forEach(plan => {
            const annualPrice = plan.price > 0 ? Math.round(plan.price * 12 * 0.8 * 100) / 100 : 0;
            const monthlyAnnualPrice = plan.price > 0 ? Math.round(annualPrice / 12 * 100) / 100 : 0;
            
            html += `
                <div class="pricing-card ${plan.popular ? 'featured' : ''}">
                    ${plan.popular ? '<div class="popular-badge">Mais Popular</div>' : ''}
                    <h3>${plan.name}</h3>
                    <div class="price-container">
                        <div class="price price-monthly">R$ ${plan.price.toFixed(2)}</div>
                        ${plan.price > 0 ? `
                            <div class="price price-annual" style="display: none;">R$ ${monthlyAnnualPrice.toFixed(2)}</div>
                        ` : ''}
                        <span class="period-label">${plan.price === 0 ? '' : '/mês'}</span>
                    </div>
                    ${plan.priceUSD ? `<p class="price-usd">ou $${plan.priceUSD}/mês</p>` : ''}
                    <p class="price-note">${plan.price === 0 ? 'Sempre grátis' : 'Cancele quando quiser'}</p>
                    <ul class="features-list">
                        ${plan.features.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                    ${plan.id === 'calc-free' ? `
                        <a href="${plan.ctaLink}" target="_blank" rel="noopener" class="btn btn-secondary btn-block">${plan.cta}</a>
                    ` : `
                        <form action="${plan.ctaLink}" method="POST">
                            <button type="submit" class="btn btn-primary btn-block">${plan.cta}</button>
                        </form>
                    `}
                </div>
            `;
        });
        
        html += '</div>';
        
        html += `
            <div class="existing-customer">
                <label class="checkbox-label">
                    <input type="checkbox" id="existing-customer">
                    <span>✅ Já sou cliente! (Redirecionar para login)</span>
                </label>
            </div>
        `;
        
        container.innerHTML = html;
    }
    
    setupEventListeners() {
        const existingCustomer = document.getElementById('existing-customer');
        if (existingCustomer) {
            existingCustomer.addEventListener('change', (e) => {
                if (e.target.checked) {
                    window.location.href = '/login.html';
                }
            });
        }
        
        window.addEventListener('period-change', (e) => {
            this.togglePeriod(e.detail.isAnnual);
        });
    }
    
    togglePeriod(isAnnual) {
        const monthlyPrices = document.querySelectorAll('#calculadora-plans .price-monthly');
        const annualPrices = document.querySelectorAll('#calculadora-plans .price-annual');
        const periodLabels = document.querySelectorAll('#calculadora-plans .period-label');
        
        monthlyPrices.forEach(el => el.style.display = isAnnual ? 'none' : 'block');
        annualPrices.forEach(el => el.style.display = isAnnual ? 'block' : 'none');
        periodLabels.forEach(el => {
            if (isAnnual) {
                el.textContent = '/mês (anual)';
            } else {
                el.textContent = '/mês';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('calculadora-plans')) {
        window.CalculadoraPricing = new CalculadoraPricing();
    }
});