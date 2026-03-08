// ============================================
// precos-main.js - Lógica Principal da Página de Preços
// ============================================

class VoxtorPrecos {
    constructor() {
        this.tabs = document.querySelectorAll('.pricing-tab');
        this.panels = document.querySelectorAll('.pricing-panel');
        this.periodToggle = document.getElementById('period-toggle');
        this.currentPeriod = 'monthly';
        
        this.init();
    }
    
    init() {
        this.setupTabs();
        this.setupPeriodToggle();
        this.setupFaq();
        this.setupCompareButton();
    }
    
    setupTabs() {
        if (!this.tabs.length) return;
        
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;
                
                this.tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                this.panels.forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.id === `panel-${target}`) {
                        panel.classList.add('active');
                    }
                });
                
                // Disparar evento de mudança de aba
                window.dispatchEvent(new CustomEvent('pricing-tab-change', {
                    detail: { tab: target }
                }));
            });
        });
    }
    
    setupPeriodToggle() {
        if (!this.periodToggle) return;
        
        const monthlyLabels = document.querySelectorAll('.period-label.monthly');
        const annualLabels = document.querySelectorAll('.period-label.annual');
        
        this.periodToggle.addEventListener('change', (e) => {
            const isAnnual = e.target.checked;
            
            monthlyLabels.forEach(label => label.classList.toggle('active', !isAnnual));
            annualLabels.forEach(label => label.classList.toggle('active', isAnnual));
            
            this.currentPeriod = isAnnual ? 'annual' : 'monthly';
            
            // Disparar evento para os componentes filhos
            window.dispatchEvent(new CustomEvent('period-change', {
                detail: { isAnnual: isAnnual }
            }));
        });
    }
    
    setupFaq() {
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const item = question.closest('.faq-item');
                const isActive = item.classList.contains('active');
                
                // Fechar outros itens (opcional)
                // document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
                
                item.classList.toggle('active', !isActive);
                
                // Atualizar aria-expanded
                question.setAttribute('aria-expanded', !isActive);
            });
            
            // Suporte para teclado
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        });
    }
    
    setupCompareButton() {
        const compareBtn = document.getElementById('compare-plans');
        if (!compareBtn) return;
        
        compareBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const compareSection = document.getElementById('comparison-table');
            if (compareSection) {
                compareSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    getSelectedPlan() {
        const selectedPlan = document.querySelector('input[name="plan"]:checked');
        if (selectedPlan) {
            return {
                id: selectedPlan.value,
                name: selectedPlan.dataset.name,
                price: selectedPlan.dataset.price,
                period: this.currentPeriod
            };
        }
        return null;
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.pricing-section')) {
        window.VoxtorPrecos = new VoxtorPrecos();
    }
});