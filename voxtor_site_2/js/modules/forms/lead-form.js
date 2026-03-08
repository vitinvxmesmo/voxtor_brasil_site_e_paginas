// ============================================
// lead-form.js - Formulário de Contato com CRM
// ============================================

class VoxtorLeadForm {
    constructor(formId = 'contactForm') {
        this.form = document.getElementById(formId);
        if (!this.form) {
            console.warn('Formulário não encontrado');
            return;
        }

        // Configurações da API
        this.apiConfig = {
            baseUrl: VOXTOR_CONFIG?.api?.devskin?.baseUrl || 'https://crm-api.devskin.com/api/v1',
            apiKey: VOXTOR_CONFIG?.api?.devskin?.key || 'dsk_eb474e3381610d9659af4b105111e92a2fefa3015b2641336958b840d80f',
            projectId: VOXTOR_CONFIG?.api?.devskin?.projectId || null
        };

        // Elementos do formulário
        this.steps = this.form.querySelectorAll('.form-step');
        this.currentStep = 1;
        this.totalSteps = this.steps.length;
        this.progressBar = document.querySelector('.progress-fill');
        this.stepIndicators = document.querySelectorAll('.step-indicator');
        this.submitBtn = document.getElementById('submitBtn');
        this.messageEl = document.getElementById('formMessage');

        // Headers padrão da API
        this.headers = {
            'Authorization': `Bearer ${this.apiConfig.apiKey}`,
            'Content-Type': 'application/json'
        };

        if (this.apiConfig.projectId) {
            this.headers['X-Project-Id'] = this.apiConfig.projectId;
        }

        this.init();
    }

    init() {
        this.setupStepNavigation();
        this.setupPhoneMask();
        this.setupFormValidation();
        this.setupFormSubmission();
        this.updateProgressBar();
    }

    setupStepNavigation() {
        // Botões Next
        this.form.querySelectorAll('.next-step').forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.validateStep(this.currentStep)) {
                    this.goToStep(this.currentStep + 1);
                }
            });
        });

        // Botões Previous
        this.form.querySelectorAll('.prev-step').forEach(btn => {
            btn.addEventListener('click', () => {
                this.goToStep(this.currentStep - 1);
            });
        });
    }

    setupPhoneMask() {
        const phoneInput = this.form.querySelector('#telefone');
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

    setupFormValidation() {
        this.form.querySelectorAll('[required]').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('invalid')) {
                    this.validateField(field);
                }
            });
        });
    }

    validateField(field) {
        const value = field.type === 'checkbox' ? field.checked : field.value.trim();
        const isValid = !!value;
        
        field.classList.toggle('invalid', !isValid);
        
        if (!isValid && !field.dataset.errorShown) {
            this.showFieldError(field);
        } else if (isValid) {
            this.hideFieldError(field);
        }
        
        return isValid;
    }

    showFieldError(field) {
        field.dataset.errorShown = 'true';
        
        const errorMsg = document.createElement('div');
        errorMsg.className = 'field-error';
        errorMsg.textContent = 'Campo obrigatório';
        
        field.parentNode.appendChild(errorMsg);
        
        setTimeout(() => {
            errorMsg.remove();
            delete field.dataset.errorShown;
        }, 3000);
    }

    hideFieldError(field) {
        const errorMsg = field.parentNode.querySelector('.field-error');
        if (errorMsg) {
            errorMsg.remove();
        }
    }

    validateStep(step) {
        const currentStepEl = this.form.querySelector(`.form-step[data-step="${step}"]`);
        if (!currentStepEl) return true;
        
        const requiredFields = currentStepEl.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    goToStep(step) {
        if (step < 1 || step > this.totalSteps) return;
        
        this.form.querySelector(`.form-step[data-step="${this.currentStep}"]`)?.classList.remove('active');
        this.form.querySelector(`.form-step[data-step="${step}"]`)?.classList.add('active');
        
        this.currentStep = step;
        this.updateProgressBar();
        
        // Scroll suave
        if (typeof VoxtorUtils?.smoothScroll === 'function') {
            VoxtorUtils.smoothScroll(this.form, 100);
        }
    }

    updateProgressBar() {
        // Atualizar indicadores de passo
        this.stepIndicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index + 1 <= this.currentStep);
        });
        
        // Atualizar barra de progresso
        if (this.progressBar) {
            const progress = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
            this.progressBar.style.width = `${progress}%`;
        }
    }

    collectFormData() {
        const rawPhone = this.form.querySelector('#telefone')?.value?.replace(/\D/g, '') || '';
        const formattedPhone = rawPhone ? `+55${rawPhone}` : null;

        return {
            name: this.form.querySelector('#nome')?.value?.trim() || '',
            email: this.form.querySelector('#email')?.value?.trim() || null,
            phone: formattedPhone,
            company: this.form.querySelector('#empresa')?.value?.trim() || null,
            position: this.form.querySelector('#cargo')?.value || null,
            sector: this.form.querySelector('#setor')?.value || null,
            companySize: this.form.querySelector('#tamanho')?.value || null,
            challenges: this.form.querySelector('#desafios')?.value?.trim() || null,
            services: Array.from(this.form.querySelectorAll('input[name="necessidades[]"]:checked')).map(cb => cb.value),
            urgency: this.form.querySelector('input[name="urgencia"]:checked')?.value || null,
            observations: this.form.querySelector('#observacoes')?.value?.trim() || null,
            source: 'website_form',
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
    }

    async createLead(data) {
        try {
            const payload = {
                name: data.name,
                email: data.email,
                phone: data.phone,
                customFields: {
                    company: data.company,
                    position: data.position,
                    sector: data.sector,
                    companySize: data.companySize,
                    services: data.services.join(', '),
                    urgency: data.urgency,
                    source: data.source
                }
            };

            const response = await fetch(`${this.apiConfig.baseUrl}/leads`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('Limite de requisições excedido. Tente novamente em alguns minutos.');
                }
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Erro ${response.status}`);
            }

            const result = await response.json();
            
            return {
                success: true,
                leadId: result.data?.id || result.id,
                data: result.data || result
            };

        } catch (error) {
            console.error('Erro ao criar lead:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async sendWelcomeMessage(leadId, leadName, selectedServices) {
        try {
            if (!leadId) {
                console.warn('Lead ID não disponível');
                return { success: false };
            }

            const primaryService = selectedServices[0] || 'Consultoria';
            
            const serviceMessages = {
                'Consultoria TI': 'Recebemos sua solicitação de Consultoria em TI.',
                'Suporte Técnico': 'Recebemos sua solicitação de Suporte Técnico.',
                'Automação': 'Recebemos sua solicitação de Automação e IoT.',
                'Infraestrutura': 'Recebemos sua solicitação de Infraestrutura de TI.',
                'CRM': 'Recebemos sua solicitação do CRM Corporativo.'
            };

            const introMessage = serviceMessages[primaryService] || 'Recebemos sua solicitação.';
            
            const message = `${leadName.split(' ')[0]}, ${introMessage}\n\n` +
                `Em até 24h úteis um especialista entrará em contato.\n\n` +
                `ID do Lead: ${leadId}\n` +
                `Serviços selecionados: ${selectedServices.join(', ')}`;

            const payload = {
                leadId: leadId,
                channel: 'whatsapp',
                message: message
            };

            const response = await fetch(`${this.apiConfig.baseUrl}/messages`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                console.warn('Erro ao enviar mensagem');
                return { success: false };
            }

            return { success: true };

        } catch (error) {
            console.warn('Erro ao enviar mensagem:', error);
            return { success: false };
        }
    }

    setFormLoading(isLoading) {
        if (!this.submitBtn) return;
        
        this.submitBtn.disabled = isLoading;
        this.submitBtn.textContent = isLoading ? 'Enviando...' : 'Solicitar Consultoria';
        
        this.form.querySelectorAll('input, select, textarea, button').forEach(el => {
            if (el !== this.submitBtn) {
                el.disabled = isLoading;
            }
        });
    }

    showSuccess(data, leadResult) {
        this.setFormLoading(false);
        this.submitBtn.style.display = 'none';
        
        this.steps.forEach(step => step.classList.remove('active'));
        
        const successEl = document.createElement('div');
        successEl.className = 'form-step success-step active';
        successEl.innerHTML = `
            <div class="success-content">
                <div class="success-icon">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none"/>
                        <path d="M8 12L11 15L16 9" stroke="currentColor" stroke-linecap="round"/>
                    </svg>
                </div>
                
                <h3>Solicitação Recebida!</h3>
                
                <p><strong>${data.name.split(' ')[0]}</strong>, sua consultoria foi registrada no CRM.</p>
                
                <div class="success-details">
                    <p>📧 Confirmação enviada para: <strong>${data.email || 'não informado'}</strong></p>
                    ${leadResult.leadId ? `<p>🆔 ID do Lead: <strong>${leadResult.leadId}</strong></p>` : ''}
                </div>
                
                <div class="next-steps">
                    <h4>Próximos passos:</h4>
                    <ol>
                        <li>Seus dados foram integrados ao nosso CRM</li>
                        <li>Um especialista entrará em contato em até <strong>24 horas úteis</strong></li>
                        <li>Agendaremos uma reunião de diagnóstico personalizada</li>
                    </ol>
                </div>
                
                <p class="reload-note">A página será recarregada em alguns segundos...</p>
            </div>
        `;
        
        this.form.appendChild(successEl);
        
        // Auto reload após 5 segundos
        setTimeout(() => {
            window.location.reload();
        }, 5000);
    }

    showMessage(text, type) {
        if (!this.messageEl) return;
        
        this.messageEl.textContent = text;
        this.messageEl.className = `form-message ${type}`;
        this.messageEl.style.display = 'block';
        
        setTimeout(() => {
            this.messageEl.style.display = 'none';
        }, 5000);
    }

    setupFormSubmission() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!this.validateStep(this.currentStep)) {
                this.showMessage('Preencha todos os campos obrigatórios.', 'error');
                return;
            }
            
            this.setFormLoading(true);
            
            try {
                const formData = this.collectFormData();
                
                if (!formData.name) {
                    throw new Error('Nome é obrigatório');
                }
                
                if (!formData.email && !formData.phone) {
                    throw new Error('Informe pelo menos email ou telefone');
                }
                
                // Enviar para o CRM
                const leadResult = await this.createLead(formData);
                
                if (!leadResult.success) {
                    throw new Error(leadResult.error || 'Erro ao criar lead no CRM');
                }
                
                // Enviar mensagem de boas-vindas
                if (leadResult.leadId && formData.services.length > 0) {
                    await this.sendWelcomeMessage(
                        leadResult.leadId,
                        formData.name,
                        formData.services
                    );
                }
                
                // Tracking
                if (window.VoxtorTracker?.track) {
                    window.VoxtorTracker.track('FORM_SUBMIT', {
                        leadId: leadResult.leadId,
                        hasCRM: true
                    });
                    
                    window.VoxtorTracker.sendLeadToDiscord(formData, leadResult.leadId);
                }
                
                // Mostrar sucesso
                this.showSuccess(formData, leadResult);
                
            } catch (error) {
                console.error('Erro no formulário:', error);
                this.showMessage(error.message || 'Erro ao enviar. Tente novamente.', 'error');
                this.setFormLoading(false);
            }
        });
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('contactForm')) {
        window.VoxtorLeadForm = new VoxtorLeadForm();
    }
});