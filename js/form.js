// ================================
// CONFIGURAÇÃO DO SISTEMA
// ================================
const CONFIG = {
    // DEVSKIN CRM
    DEVSKIN: {
        API_KEY: "dsk_5107946062729de99373287329a012f0629f238c79b1751fa265fe95768d", // MINHA API KEY
        BASE_URL: "https://crm-api.devskin.com/v1",
        ENDPOINTS: {
            CREATE_LEAD: "/leads",
            SEND_MESSAGE: "/messages",
            SEARCH_LEAD: "/leads/search",
            START_CALL: "/telephony/calls/outbound"
        }
    },
    
    // DISCORD (notificações)
    DISCORD_WEBHOOK: "https://discord.com/api/webhooks/1455502427762589756/2dxRVXSaFNfqCJEJXTUvkb1EtjlKMtGh6B_pknagBts0wrHSQR77JWn6KqFNOZlGG4wU", // MINHA WEBHOOK
    
    // MENSAGENS POR SERVIÇO
    SERVICE_MESSAGES: {
        "Consultoria em TI": {
            greeting: "Olá {nome}! 👋",
            intro: "Vi que tem interesse em nossa **Consultoria em TI**. Excelente escolha!",
            content: "Nossa consultoria especializada ajuda empresas a:",
            benefits: [
                "📊 Otimizar processos com tecnologia",
                "🛡️ Implementar segurança da informação", 
                "📈 Aumentar eficiência operacional",
                "💰 Reduzir custos com TI"
            ],
            closing: "Um consultor especializado entrará em contato para entender seus desafios específicos.",
            cta: "Enquanto isso, posso ajudar com alguma dúvida específica sobre consultoria?"
        },
        
        "Infraestrutura de redes": {
            greeting: "Olá {nome}! 🌐",
            intro: "Percebi seu interesse em **Infraestrutura de Redes**. Isso é fundamental!",
            content: "Oferecemos soluções completas para sua infraestrutura:",
            benefits: [
                "🔧 Projeto e implementação de redes",
                "🛡️ Firewall e segurança de rede",
                "⚡ Wi-Fi corporativo de alta performance",
                "📡 Conectividade e link dedicado"
            ],
            closing: "Nossa equipe de infraestrutura analisará suas necessidades.",
            cta: "Tem alguma questão específica sobre infraestrutura que posso adiantar?"
        },
        
        "Suporte Técnico": {
            greeting: "Olá {nome}! 🔧",
            intro: "Entendi que precisa de **Suporte Técnico**. Estamos aqui para ajudar!",
            content: "Nosso suporte oferece:",
            benefits: [
                "🛠️ Suporte remoto e presencial",
                "⏰ Plantão 24/7 para emergências",
                "📋 Contrato com SLA definido",
                "👨‍💼 Técnicos especializados"
            ],
            closing: "Já estamos preparando nossa equipe de suporte para atendê-lo.",
            cta: "Alguma urgência técnica que precisa de atenção imediata?"
        },
        
        "CRM / BI": {
            greeting: "Olá {nome}! 📈",
            intro: "Que bom ver seu interesse em **CRM e Business Intelligence**!",
            content: "Transformamos seus dados em resultados:",
            benefits: [
                "🎯 Implementação de CRM personalizado",
                "📊 Dashboards e relatórios em tempo real",
                "🤖 Automação de processos comerciais",
                "📈 Análise preditiva e insights"
            ],
            closing: "Um especialista em CRM/BI entrará em contato para uma análise inicial.",
            cta: "Já utiliza algum sistema de gestão atualmente?"
        },
        
              "Automação / IoT": {
            greeting: "Olá {nome}! 🤖",
            intro: "**Automação e IoT** são o futuro, e você está no caminho certo!",
            content: "Nossas soluções de automação incluem:",
            benefits: [
                "🏭 Automação industrial e predial",
                "📱 Controle remoto via IoT", 
                "⚡ Eficiência energética inteligente",
                "🔗 Integração de sistemas"
            ],
            closing: "Nossa equipe de automação está pronta para revolucionar seus processos.",
            cta: "Tem algum processo específico que gostaria de automatizar primeiro?"
        },
        
        "Segurança da Informação": {
            greeting: "Olá {nome}! 🛡️",
            intro: "Segurança da Informação é essencial nos dias de hoje. Ótima escolha!",
            content: "Protegemos seus ativos digitais com:",
            benefits: [
                "🔒 Auditoria e pentest de segurança",
                "🛡️ Proteção contra ransomware",
                "👁️ Monitoramento 24/7",
                "📋 Políticas e treinamento"
            ],
            closing: "Um especialista em segurança fará uma avaliação inicial dos seus sistemas.",
            cta: "Já passou por algum incidente de segurança recentemente?"
        },
        
        "Múltiplas soluções": {
            greeting: "Olá {nome}! 🚀",
            intro: "Vi que tem interesse em **Múltiplas Soluções**. Vamos transformar sua empresa!",
            content: "Oferecemos um pacote completo de transformação digital:",
            benefits: [
                "🎯 Diagnóstico completo de TI", 
                "📊 Plano estratégico personalizado",
                "🔄 Implementação faseada",
                "📈 Gestão contínua e otimização"
            ],
            closing: "Nossa equipe multidisciplinar está preparada para atender todas as suas necessidades.",
            cta: "Podemos agendar uma reunião estratégica para discutir todas as frentes?"
        }
    },
    
    // TEMPO ENTRE MENSAGENS (em segundos)
    MESSAGE_DELAY: 2
};

// ================================
// FORM.JS COMPLETO - INTEGRAÇÃO CRM + BOT PERSONALIZADO
// ================================
document.addEventListener("DOMContentLoaded", function() {
    console.log("🚀 Inicializando formulário Voxtor...");
    
    // ================================
    // ELEMENTOS DO FORMULÁRIO
    // ================================
    const form = document.getElementById("contactForm");
    if (!form) {
        console.error("❌ Formulário não encontrado!");
        return;
    }
    
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
    // 1. NAVEGAÇÃO ENTRE STEPS
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
        
        const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        const nextStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
        
        currentStepEl.classList.remove('active');
        currentStepEl.classList.add('exiting');
        
        setTimeout(() => {
            currentStepEl.classList.remove('exiting');
            nextStepEl.classList.add('active');
            
            stepIndicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index + 1 <= step);
            });
            
            const progressPercent = ((step - 1) / (totalSteps - 1)) * 100;
            if (progressFill) progressFill.style.width = `${progressPercent}%`;
            
            currentStep = step;
            
            nextStepEl.classList.add('entering');
            setTimeout(() => nextStepEl.classList.remove('entering'), 300);
            
        }, 300);
    }
    
    // ================================
    // 2. VALIDAÇÃO DOS CAMPOS
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
                
                field.classList.add('error-shake');
                setTimeout(() => field.classList.remove('error-shake'), 500);
            } else {
                field.classList.remove('invalid');
                
                // Validação específica de email
                if (field.type === 'email' && field.value.trim()) {
                    if (!isValidEmail(field.value)) {
                        field.classList.add('invalid');
                        showFieldMessage(field, 'E-mail inválido');
                        isValid = false;
                    }
                }
                
                // Validação específica de telefone
                if (field.id === 'telefone' && field.value.trim()) {
                    const phoneDigits = field.value.replace(/\D/g, '');
                    if (phoneDigits.length < 10) {
                        field.classList.add('invalid');
                        showFieldMessage(field, 'Telefone inválido');
                        isValid = false;
                    }
                }
            }
        });
        
        return isValid;
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showFieldMessage(field, message) {
        const existingMessage = field.parentNode.querySelector('.field-message');
        if (existingMessage) existingMessage.remove();
        
        const messageEl = document.createElement('div');
        messageEl.className = 'field-message error';
        messageEl.textContent = message;
        field.parentNode.appendChild(messageEl);
        
        setTimeout(() => {
            if (messageEl.parentNode) messageEl.remove();
        }, 3000);
    }
    
    // ================================
    // 3. FORMATAÇÃO DO TELEFONE
    // ================================
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', formatPhone);
    }
    
    function formatPhone(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 11) value = value.substring(0, 11);
        
        if (value.length === 11) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        } else if (value.length === 10) {
            value = value.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
        } else if (value.length > 6) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
        }
        
        e.target.value = value;
    }
    
    // ================================
    // 4. COLETAR DADOS DO FORMULÁRIO
    // ================================
    function collectFormData() {
        const formData = {
            // Informações pessoais
            nome: document.getElementById('nome').value.trim(),
            email: document.getElementById('email').value.trim(),
            telefone: document.getElementById('telefone').value.trim(),
            empresa: document.getElementById('empresa').value.trim(),
            cargo: document.getElementById('cargo').value,
            
            // Informações da empresa
            setor: document.getElementById('setor').value,
            tamanho: document.getElementById('tamanho').value,
            desafios: document.getElementById('desafios').value.trim(),
            
            // Serviços selecionados (CHAVE PARA AS MENSAGENS PERSONALIZADAS)
            servicos: Array.from(document.querySelectorAll('input[name="necessidades[]"]:checked'))
                .map(cb => cb.value),
            
            // Urgência
            urgencia: document.querySelector('input[name="urgencia"]:checked')?.value,
            
            // Observações
            observacoes: document.getElementById('observacoes').value.trim(),
            
            // Preferências
            newsletter: document.getElementById('newsletter').checked,
            
            // Metadados
            data_envio: new Date().toISOString(),
            timestamp: Date.now(),
            fonte: 'website_contato',
            pagina: window.location.pathname
        };
        
        return formData;
    }
    
    // ================================
    // 5. GERAR MENSAGEM PERSONALIZADA POR SERVIÇO
    // ================================
    function generatePersonalizedMessage(formData) {
        // Se múltiplos serviços, usar mensagem específica ou combinar
        const primaryService = formData.servicos[0] || "Múltiplas soluções";
        const serviceConfig = CONFIG.SERVICE_MESSAGES[primaryService] || CONFIG.SERVICE_MESSAGES["Múltiplas soluções"];
        
        let message = "";
        
        // 1. Saudação personalizada
        message += `${serviceConfig.greeting.replace('{nome}', formData.nome.split(' ')[0])}\n\n`;
        
        // 2. Introdução do serviço
        message += `${serviceConfig.intro}\n\n`;
        
        // 3. Conteúdo e benefícios
        message += `${serviceConfig.content}\n`;
        serviceConfig.benefits.forEach(benefit => {
            message += `• ${benefit}\n`;
        });
        
        // 4. Fechamento
        message += `\n${serviceConfig.closing}\n\n`;
        
        // 5. Call to Action
        message += `${serviceConfig.cta}`;
        
        // 6. Se múltiplos serviços, adicionar menção
        if (formData.servicos.length > 1) {
            message += `\n\n📋 *Serviços selecionados:* ${formData.servicos.join(', ')}`;
        }
        
        // 7. Informações de contato
        message += `\n\n_Seu ID na Voxtor: ${formData.timestamp}_`;
        
        return message;
    }
    
    // ================================
    // 6. INTEGRAÇÃO COM DEVSKIN CRM
    // ================================
    async function createDevskinLead(formData) {
        console.log("📝 Criando lead no Devskin CRM...");
        
        const payload = {
            name: formData.nome,
            email: formData.email,
            phone: formatPhoneToE164(formData.telefone),
            customFields: {
                empresa: formData.empresa,
                cargo: formData.cargo,
                setor: formData.setor,
                tamanho_empresa: formData.tamanho,
                urgencia: formData.urgencia,
                servicos: formData.servicos.join(', '),
                desafios: formData.desafios.substring(0, 500),
                fonte: 'website_voxtor'
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
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(`CRM: ${response.status} - ${result.message || 'Erro desconhecido'}`);
            }
            
            console.log('✅ Lead criado:', result.data.id);
            return {
                success: true,
                leadId: result.data.id,
                data: result.data
            };
            
        } catch (error) {
            console.error('❌ Erro ao criar lead:', error);
            return { success: false, error: error.message };
        }
    }
    
    async function sendDevskinMessage(leadId, messageContent) {
        console.log("💬 Enviando mensagem personalizada...");
        
        const payload = {
            leadId: leadId,
            channel: "whatsapp",
            message: messageContent
            // templateName: "voxtor_servico_especifico", // Opcional: usar template aprovado
        };
        
        try {
            const response = await fetch(`${CONFIG.DEVSKIN.BASE_URL}${CONFIG.DEVSKIN.ENDPOINTS.SEND_MESSAGE}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CONFIG.DEVSKIN.API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                // Se for erro de template (após 24h), tentar enviar sem mensagem personalizada
                if (response.status === 400) {
                    console.warn('⚠️ Usando template padrão devido a restrição de tempo');
                    return await sendTemplateMessage(leadId);
                }
                throw new Error(`Mensagem: ${response.status} - ${result.message}`);
            }
            
            console.log('✅ Mensagem enviada:', result);
            return { success: true, data: result };
            
        } catch (error) {
            console.warn('⚠️ Erro ao enviar mensagem:', error);
            return { success: false, error: error.message };
        }
    }
    
    async function sendTemplateMessage(leadId) {
        // Fallback: enviar template genérico
        const payload = {
            leadId: leadId,
            channel: "whatsapp",
            templateName: "voxtor_confirmacao",
            templateLanguage: "pt_BR"
        };
        
        try {
            const response = await fetch(`${CONFIG.DEVSKIN.BASE_URL}${CONFIG.DEVSKIN.ENDPOINTS.SEND_MESSAGE}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CONFIG.DEVSKIN.API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            return { success: response.ok };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // ================================
    // 7. ENVIAR NOTIFICAÇÃO PARA DISCORD
    // ================================
    async function sendToDiscord(formData, leadId = null) {
        try {
            const servicesList = formData.servicos.map(s => `• ${s}`).join('\n');
            
            const embed = {
                title: `🚀 NOVO LEAD - ${formData.servicos[0] || 'Múltiplos Serviços'}`,
                color: 0x8e44ad,
                fields: [
                    { name: "👤 Cliente", value: formData.nome, inline: true },
                    { name: "🏢 Empresa", value: formData.empresa, inline: true },
                    { name: "📧 Email", value: formData.email, inline: true },
                    { name: "📱 Telefone", value: formData.telefone, inline: true },
                    { name: "💼 Cargo", value: formData.cargo, inline: true },
                    { name: "⚡ Urgência", value: formData.urgencia || 'Não informada', inline: true },
                    { name: "🎯 Serviços Selecionados", value: servicesList || 'Nenhum', inline: false },
                    { name: "🎯 Desafios", value: formData.desafios.substring(0, 300) + '...', inline: false },
                    { name: "🆔 Lead ID", value: leadId || 'Pendente', inline: true }
                ],
                footer: {
                    text: `📅 ${new Date().toLocaleString('pt-BR')} | 📍 ${formData.fonte}`
                },
                timestamp: new Date().toISOString()
            };
            
            const payload = {
                embeds: [embed],
                content: leadId ? `@here Lead ${leadId} criado!` : `@here Novo lead do site!`
            };
            
            await fetch(CONFIG.DISCORD_WEBHOOK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            console.log('✅ Notificação Discord enviada');
            
        } catch (error) {
            console.warn('⚠️ Erro ao enviar para Discord:', error);
        }
    }
    
    // ================================
    // 8. ENVIO PRINCIPAL DO FORMULÁRIO
    // ================================
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateStep(currentStep)) {
            showMessage('Por favor, preencha todos os campos obrigatórios corretamente.', 'error');
            return;
        }
        
        // Mostrar estado de carregamento
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<span class="btn-text">Enviando...</span><span class="btn-icon">⏳</span>';
        
        try {
            // 1. Coletar dados do formulário
            const formData = collectFormData();
            console.log('📋 Dados coletados:', formData);
            
            // 2. Validar serviços selecionados
            if (!formData.servicos || formData.servicos.length === 0) {
                throw new Error('Selecione pelo menos um serviço de interesse');
            }
            
            // 3. Gerar mensagem personalizada baseada no serviço
            const personalizedMessage = generatePersonalizedMessage(formData);
            console.log('💬 Mensagem gerada:', personalizedMessage.substring(0, 100) + '...');
            
            // 4. Criar lead no Devskin CRM
            const leadResult = await createDevskinLead(formData);
            
            let leadId = null;
            if (leadResult.success) {
                leadId = leadResult.leadId;
                
                // 5. Enviar mensagem personalizada via WhatsApp
                await new Promise(resolve => setTimeout(resolve, CONFIG.MESSAGE_DELAY * 1000));
                await sendDevskinMessage(leadId, personalizedMessage);
                
                // 6. (Opcional) Enviar segunda mensagem com informações adicionais
                if (formData.urgencia === 'Alta') {
                    await new Promise(resolve => setTimeout(resolve, CONFIG.MESSAGE_DELAY * 1000));
                    await sendDevskinMessage(leadId, 
                        `*URGÊNCIA ALTA* identificada! ⚠️\n` +
                        `Nossa equipe priorizará seu atendimento.\n` +
                        `Você será contactado em até 15 minutos.`
                    );
                }
                
            } else {
                console.warn('⚠️ CRM offline, usando fallback');
            }
            
            // 7. Enviar notificação para Discord
            await sendToDiscord(formData, leadId);
            
            // 8. Mostrar tela de sucesso
            showSuccess(formData, leadId, personalizedMessage);
            
            // 9. Limpar formulário após 5 segundos
            setTimeout(() => {
                form.reset();
                goToStep(1);
            }, 5000);
            
        } catch (error) {
            console.error('❌ Erro no envio:', error);
            showMessage(`Erro: ${error.message}. Tente novamente ou entre em contato diretamente.`, 'error');
            
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = '<span class="btn-text">Tentar Novamente</span><span class="btn-icon">🔄</span>';
        }
    });
    
    // ================================
    // 9. MOSTRAR TELA DE SUCESSO
    // ================================
    function showSuccess(formData, leadId, messagePreview) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.style.display = 'none';
        
        document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
        
        const successStep = document.createElement('div');
        successStep.className = 'form-step success-step active';
        successStep.innerHTML = `
            <div class="success-content">
                <div class="success-icon">🎉</div>
                <h3>Consulta Solicitada com Sucesso!</h3>
                <p>Obrigado <strong>${formData.nome}</strong>! Sua consultoria para <strong>${formData.servicos[0]}</strong> foi registrada.</p>
                
                <div class="success-details">
                    <p><strong>📧 E-mail de confirmação</strong> enviado para: ${formData.email}</p>
                    <p><strong>💬 Mensagem personalizada</strong> enviada para seu WhatsApp</p>
                    <p><strong>⏰ Atendimento priorizado</strong> para urgência: ${formData.urgencia || 'Normal'}</p>
                    ${leadId ? `<p><strong>🆔 ID do Lead:</strong> ${leadId}</p>` : ''}
                </div>
                
                <div class="message-preview">
                    <h4>📋 Mensagem enviada:</h4>
                    <div class="preview-box">${messagePreview.replace(/\n/g, '<br>')}</div>
                </div>
                
                <div class="next-steps">
                    <h4>Próximos passos:</h4>
                    <ol>
                        <li>Verifique seu WhatsApp para a mensagem automática</li>
                        <li>Aguarde nosso contato (${formData.urgencia === 'Alta' ? '15min' : '1h útil'})</li>
                        <li>Prepare informações sobre ${formData.servicos[0]}</li>
                    </ol>
                </div>
                
                <div class="success-actions">
                    <a href="https://wa.me/5538998749856?text=Olá! ID: ${leadId || formData.timestamp}" 
                       class="btn btn-whatsapp" target="_blank">
                        💬 Falar agora no WhatsApp
                    </a>
                    <button onclick="location.reload()" class="btn btn-secondary">
                        📝 Nova Consultoria
                    </button>
                </div>
            </div>
        `;
        
        form.appendChild(successStep);
    }
    
    // ================================
    // 10. FUNÇÕES AUXILIARES
    // ================================
    function formatPhoneToE164(phone) {
        const numbers = phone.replace(/\D/g, '');
        return `+55${numbers}`;
    }
    
    function showMessage(text, type) {
        if (!formMessage) return;
        
        formMessage.textContent = text;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        formMessage.classList.remove('show');
        
        setTimeout(() => formMessage.classList.add('show'), 10);
        
        if (type !== 'error') {
            setTimeout(() => {
                formMessage.classList.remove('show');
                setTimeout(() => formMessage.style.display = 'none', 300);
            }, 5000);
        }
    }
    
    // ================================
    // 11. INICIALIZAÇÃO
    // ================================
    console.log("✅ Formulário Voxtor inicializado!");
    console.log("🔧 Configure sua API Key do Devskin CRM");
    console.log("💬 Mensagens personalizadas por serviço: Ativas");
    
    // Verificar se API Key está configurada
    if (CONFIG.DEVSKIN.API_KEY === "dsk_sua_api_key_aqui") {
        console.warn("⚠️ ATENÇÃO: Configure sua API Key do Devskin CRM!");
        showMessage('Configure sua API Key do CRM no arquivo form.js', 'warning');
    }
});

// ================================
// CSS DINÂMICO PARA ANIMAÇÕES
// ================================
const style = document.createElement('style');
style.textContent = `
    .form-step { transition: opacity 0.3s ease, transform 0.3s ease; }
    .form-step.exiting { opacity: 0; transform: translateX(-20px); }
    .form-step.entering { opacity: 0; transform: translateX(20px); }
    .form-step.active { opacity: 1; transform: translateX(0); }
    
    .error-shake { animation: shake 0.5s ease; }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .invalid { 
        border-color: #e74c3c !important; 
        background-color: rgba(231, 76, 60, 0.05) !important; 
    }
    
    .field-message {
        font-size: 0.85rem;
        margin-top: 5px;
        padding: 4px 8px;
        border-radius: 4px;
    }
    
    .field-message.error {
        color: #e74c3c;
        background-color: rgba(231, 76, 60, 0.1);
    }
    
    .success-step {
        text-align: center;
        padding: 40px 20px;
        animation: fadeIn 0.5s ease;
    }
    
    .success-icon {
        font-size: 4rem;
        margin-bottom: 20px;
        animation: bounce 1s ease;
    }
    
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    
    .success-details {
        background: rgba(46, 204, 113, 0.1);
        padding: 20px;
        border-radius: 10px;
        margin: 20px 0;
        text-align: left;
    }
    
    .message-preview {
        background: var(--bg-secondary);
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
        text-align: left;
        border-left: 4px solid var(--primary);
    }
    
    .preview-box {
        max-height: 200px;
        overflow-y: auto;
        padding: 10px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 5px;
        font-size: 0.9rem;
        line-height: 1.4;
    }
    
    .next-steps {
        text-align: left;
        margin: 30px 0;
    }
    
    .next-steps ol {
        padding-left: 20px;
        margin-top: 10px;
    }
    
    .success-actions {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 30px;
    }
    
    .btn.loading {
        opacity: 0.8;
        cursor: not-allowed;
        position: relative;
        color: transparent !important;
    }
    
    .btn.loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .form-message {
        transition: opacity 0.3s ease;
        opacity: 0;
    }
    
    .form-message.show {
        opacity: 1;
    }
    
    @media (max-width: 768px) {
        .success-actions { flex-direction: column; }
        .success-actions .btn { width: 100%; }
        .preview-box { max-height: 150px; }
    }
`;
document.head.appendChild(style);