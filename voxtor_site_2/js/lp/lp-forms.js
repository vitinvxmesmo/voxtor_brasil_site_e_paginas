// ============================================
// lp-forms.js - Formulários para Landing Pages
// ============================================

class LPForms {
    constructor() {
        this.form = document.querySelector('.lp-form');
        if (!this.form) return;
        
        this.init();
    }
    
    init() {
        this.setupForm();
        this.setupPhoneMask();
        this.setupValidation();
        this.setupAutoPopulate();
    }
    
    setupForm() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.validateForm()) {
                await this.submitForm();
            }
        });
    }
    
    setupPhoneMask() {
        const phoneInput = this.form.querySelector('input[type="tel"]');
        if (!phoneInput) return;
        
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length === 11) {
                e.target.value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length === 10) {
                e.target.value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            } else if (value.length > 2) {
                e.target.value = value.replace(/(\d{2})(\d+)/, '($1) $2');
            }
        });
    }
    
    setupValidation() {
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('invalid')) {
                    this.validateField(input);
                }
            });
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        if (!value) {
            isValid = false;
            errorMessage = 'Campo obrigatório';
        } else if (field.type === 'email' && !this.validateEmail(value)) {
            isValid = false;
            errorMessage = 'E-mail inválido';
        } else if (field.type === 'tel' && !this.validatePhone(value)) {
            isValid = false;
            errorMessage = 'Telefone inválido';
        }
        
        field.classList.toggle('invalid', !isValid);
        
        let errorEl = field.parentNode.querySelector('.field-error');
        if (!isValid) {
            if (!errorEl) {
                errorEl = document.createElement('div');
                errorEl.className = 'field-error';
                field.parentNode.appendChild(errorEl);
            }
            errorEl.textContent = errorMessage;
        } else if (errorEl) {
            errorEl.remove();
        }
        
        return isValid;
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    validatePhone(phone) {
        const numbers = phone.replace(/\D/g, '');
        return numbers.length === 10 || numbers.length === 11;
    }
    
    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    setupAutoPopulate() {
        const urlParams = new URLSearchParams(window.location.search);
        
        const fields = {
            'utm_source': 'input[name="utm_source"]',
            'utm_medium': 'input[name="utm_medium"]',
            'utm_campaign': 'input[name="utm_campaign"]',
            'nome': 'input[name="nome"]',
            'email': 'input[name="email"]'
        };
        
        for (const [param, selector] of Object.entries(fields)) {
            const value = urlParams.get(param) || sessionStorage.getItem(param);
            if (value) {
                const field = this.form.querySelector(selector);
                if (field) {
                    field.value = value;
                }
            }
        }
    }
    
    async submitForm() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        data.timestamp = new Date().toISOString();
        data.url = window.location.href;
        data.utm_source = sessionStorage.getItem('utm_source') || '';
        data.utm_medium = sessionStorage.getItem('utm_medium') || '';
        data.utm_campaign = sessionStorage.getItem('utm_campaign') || '';
        
        try {
            const response = await fetch('/api/lp-submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                this.trackConversion(data);
                
                const thankYouPage = this.form.dataset.thankYou || '/lp/obrigado.html';
                window.location.href = thankYouPage;
            } else {
                throw new Error('Erro no envio');
            }
        } catch (error) {
            console.error('Erro:', error);
            
            const errorMsg = document.createElement('div');
            errorMsg.className = 'form-message error';
            errorMsg.textContent = 'Erro ao enviar. Tente novamente.';
            this.form.prepend(errorMsg);
            
            setTimeout(() => errorMsg.remove(), 5000);
            
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
    
    trackConversion(data) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'generate_lead', {
                'event_category': 'form',
                'event_label': this.form.id || 'lp-form',
                'value': 1
            });
        }
        
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: data.nome,
                content_category: 'LP Form'
            });
        }
        
        if (window.VoxtorTracker) {
            window.VoxtorTracker.track('LP_FORM_SUBMIT', data);
            window.VoxtorTracker.sendLeadToDiscord(data, 'LP-LEAD');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.lp-form')) {
        window.LPForms = new LPForms();
    }
});