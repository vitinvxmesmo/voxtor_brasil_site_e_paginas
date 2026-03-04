// ================================
// CONFIGURAÇÃO DO SISTEMA
// ================================
const CONFIG = {
    // DEVSKIN CRM
    DEVSKIN: {
        API_KEY: "dsk_5107946062729de99373287329a012f0629f238c79b1751fa265fe95768d", // SUA API KEY
        BASE_URL: "https://crm-api.devskin.com/api/v1",
        ENDPOINTS: {
            CREATE_LEAD: "/leads",
            SEND_MESSAGE: "/messages"
        }
    },
    
    // DISCORD (notificações)
    DISCORD_WEBHOOK: "https://discord.com/api/webhooks/1455502427762589756/2dxRVXSaFNfqCJEJXTUvkb1EtjlKMtGh6B_pknagBts0wrHSQR77JWn6KqFNOZlGG4wU",
    
    // MENSAGENS POR SERVIÇO
    SERVICE_MESSAGES: {
        "Consultoria TI": {
            intro: "Recebemos sua solicitação de Consultoria em TI.",
            benefits: [
                "Diagnóstico completo da infraestrutura",
                "Planejamento estratégico",
                "Otimização de processos"
            ],
            closing: "Um consultor especializado entrará em contato para análise detalhada."
        },
        
        "Suporte Técnico": {
            intro: "Recebemos sua solicitação de Suporte Técnico.",
            benefits: [
                "Atendimento com SLA definido",
                "Monitoramento proativo",
                "Suporte remoto e presencial"
            ],
            closing: "Nossa equipe de suporte está preparada para atendê-lo."
        },
        
        "Automação": {
            intro: "Recebemos sua solicitação de Automação e IoT.",
            benefits: [
                "Automação de processos",
                "IoT empresarial",
                "Integração de sistemas"
            ],
            closing: "Um especialista em automação entrará em contato."
        },
        
        "Infraestrutura": {
            intro: "Recebemos sua solicitação de Infraestrutura de TI.",
            benefits: [
                "Redes corporativas",
                "Servidores e cloud",
                "Segurança da informação"
            ],
            closing: "Nossa equipe de infraestrutura analisará suas necessidades."
        },
        
        "CRM": {
            intro: "Recebemos sua solicitação do CRM Corporativo.",
            benefits: [
                "Gestão de relacionamento com clientes",
                "Automação com IA",
                "Integração omnichannel"
            ],
            closing: "Um consultor especializado em CRM entrará em contato."
        }
    }
};

// ================================
// FORM.JS COMPLETO - INTEGRAÇÃO CRM
// ================================
document.addEventListener("DOMContentLoaded", function() {
    console.log("Inicializando formulário Voxtor...");
    
    // ================================
    // ELEMENTOS DO FORMULÁRIO
    // ================================
    const form = document.getElementById("contactForm");
    if (!form) return;
    
    const steps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const progressFill = document.querySelector('.progress-fill');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    
    let currentStep = 1;
    const totalSteps = 3;
    
    // ================================
    // NAVEGAÇÃO ENTRE STEPS
    // ================================
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextStep = parseInt(this.dataset.next);
            if (validateStep(currentStep)) {
                goToStep(nextStep);
            }
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = parseInt(this.dataset.prev);
            goToStep(prevStep);
        });
    });
    
    function goToStep(step) {
        if (step < 1 || step > totalSteps) return;
        
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
        document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
        
        stepIndicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index + 1 <= step);
        });
        
        if (progressFill) {
            const progressPercent = ((step - 1) / (totalSteps - 1)) * 100;
            progressFill.style.width = `${progressPercent}%`;
        }
        
        currentStep = step;
    }
    
    // ================================
    // VALIDAÇÃO
    // ================================
    function validateStep(step) {
        const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
        const requiredFields = currentStepEl.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            const fieldValue = field.type === 'checkbox' ? field.checked : field.value.trim();
            
            if (!fieldValue) {
                field.classList.add('invalid');
                isValid = false;
                
                setTimeout(() => field.classList.remove('invalid'), 2000);
            } else {
                field.classList.remove('invalid');
            }
        });
        
        return isValid;
    }
    
    // ================================
    // FORMATAÇÃO DE TELEFONE
    // ================================
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.substring(0, 11);
            
            if (value.length === 11) {
                value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
            } else if (value.length === 10) {
                value = value.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
            }
            
            e.target.value = value;
        });
    }
    
    // ================================
    // COLETAR DADOS
    // ================================
    function collectFormData() {
        return {
            nome: document.getElementById('nome')?.value.trim() || '',
            email: document.getElementById('email')?.value.trim() || '',
            telefone: document.getElementById('telefone')?.value.trim() || '',
            empresa: document.getElementById('empresa')?.value.trim() || '',
            cargo: document.getElementById('cargo')?.value || '',
            setor: document.getElementById('setor')?.value || '',
            tamanho: document.getElementById('tamanho')?.value || '',
            desafios: document.getElementById('desafios')?.value.trim() || '',
            servicos: Array.from(document.querySelectorAll('input[name="necessidades[]"]:checked')).map(cb => cb.value),
            urgencia: document.querySelector('input[name="urgencia"]:checked')?.value || '',
            observacoes: document.getElementById('observacoes')?.value.trim() || '',
            timestamp: Date.now()
        };
    }
    
    // ================================
    // GERAR MENSAGEM PERSONALIZADA
    // ================================
    function generatePersonalizedMessage(formData) {
        const primaryService = formData.servicos[0] || "Consultoria TI";
        const config = CONFIG.SERVICE_MESSAGES[primaryService] || CONFIG.SERVICE_MESSAGES["Consultoria TI"];
        
        let message = `${formData.nome.split(' ')[0]}, ${config.intro}\n\n`;
        message += `Com a Voxtor Brasil, você terá:\n`;
        config.benefits.forEach(benefit => {
            message += `• ${benefit}\n`;
        });
        message += `\n${config.closing}`;
        
        if (formData.servicos.length > 1) {
            message += `\n\nServiços selecionados: ${formData.servicos.join(', ')}`;
        }
        
        message += `\n\nID do lead: ${formData.timestamp}`;
        
        return message;
    }
    
    // ================================
    // INTEGRAÇÃO DEVSKIN CRM
    // ================================
    async function createDevskinLead(formData) {
        console.log("Criando lead no Devskin CRM...");
        
        const payload = {
            name: formData.nome,
            email: formData.email,
            phone: `+55${formData.telefone.replace(/\D/g, '')}`,
            customFields: {
                empresa: formData.empresa,
                cargo: formData.cargo,
                setor: formData.setor,
                servicos: formData.servicos.join(', '),
                desafios: formData.desafios.substring(0, 500),
                urgencia: formData.urgencia
            }
        };
        
        try {
            const response = await fetch(`${CONFIG.DEVSKIN.BASE_URL}${CONFIG.DEVSKIN.ENDPOINTS.CREATE_LEAD}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CONFIG.DEVSKIN.API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) throw new Error('Erro no CRM');
            
            const result = await response.json();
            console.log('Lead criado:', result.data.id);
            return { success: true, leadId: result.data.id };
            
        } catch (error) {
            console.warn('CRM offline:', error);
            return { success: false };
        }
    }
    
    // ================================
    // ENVIAR NOTIFICAÇÃO DISCORD
    // ================================
    async function sendToDiscord(formData, leadId = null) {
        try {
            const servicesList = formData.servicos.join('\n');
            
            const embed = {
                title: `NOVO LEAD - ${formData.servicos[0] || 'Contato'}`,
                color: 0x8e44ad,
                fields: [
                    { name: "Cliente", value: formData.nome, inline: true },
                    { name: "Empresa", value: formData.empresa, inline: true },
                    { name: "Email", value: formData.email, inline: true },
                    { name: "Telefone", value: formData.telefone, inline: true },
                    { name: "Serviços", value: servicesList || 'Não informado', inline: false },
                    { name: "Lead ID", value: leadId || 'Pendente', inline: true }
                ],
                footer: { text: new Date().toLocaleString('pt-BR') }
            };
            
            await fetch(CONFIG.DISCORD_WEBHOOK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embeds: [embed] })
            });
            
        } catch (error) {
            console.warn('Erro Discord:', error);
        }
    }
    
    // ================================
    // ENVIO PRINCIPAL
    // ================================
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateStep(currentStep)) {
            showMessage('Preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        
        try {
            const formData = collectFormData();
            
            if (!formData.servicos || formData.servicos.length === 0) {
                throw new Error('Selecione pelo menos um serviço');
            }
            
            const leadResult = await createDevskinLead(formData);
            await sendToDiscord(formData, leadResult.leadId);
            
            showSuccess(formData, leadResult.leadId);
            
            setTimeout(() => {
                form.reset();
                goToStep(1);
                window.location.reload();
            }, 5000);
            
        } catch (error) {
            console.error('Erro:', error);
            showMessage('Erro ao enviar. Tente novamente.', 'error');
            
            submitBtn.disabled = false;
            submitBtn.textContent = 'Solicitar Consultoria';
        }
    });
    
    // ================================
    // TELA DE SUCESSO
    // ================================
    function showSuccess(formData, leadId) {
        submitBtn.disabled = false;
        submitBtn.style.display = 'none';
        
        document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
        
        const successStep = document.createElement('div');
        successStep.className = 'form-step success-step active';
        successStep.innerHTML = `
            <div class="success-content">
                <div class="success-icon">✓</div>
                <h3>Solicitação Recebida</h3>
                <p><strong>${formData.nome}</strong>, sua consultoria foi registrada.</p>
                
                <div class="success-details">
                    <p>Confirmação enviada para: ${formData.email}</p>
                    ${leadId ? `<p>ID do Lead: ${leadId}</p>` : ''}
                </div>
                
                <div class="next-steps">
                    <h4>Próximos passos:</h4>
                    <ol>
                        <li>Você receberá um e-mail de confirmação</li>
                        <li>Um especialista entrará em contato em até 24h</li>
                        <li>Agendaremos uma reunião de diagnóstico</li>
                    </ol>
                </div>
            </div>
        `;
        
        form.appendChild(successStep);
    }
    
    function showMessage(text, type) {
        if (!formMessage) return;
        formMessage.textContent = text;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 3000);
    }
});

// CSS dinâmico
const style = document.createElement('style');
style.textContent = `
    .invalid { border-color: #e74c3c !important; }
    .success-step { text-align: center; padding: 40px 20px; }
    .success-icon { font-size: 48px; margin-bottom: 20px; color: #2ecc71; }
    .success-details { background: rgba(46, 204, 113, 0.1); padding: 15px; border-radius: 8px; margin: 20px 0; }
    .next-steps { text-align: left; margin: 20px 0; }
    .next-steps ol { padding-left: 20px; }
`;
document.head.appendChild(style);