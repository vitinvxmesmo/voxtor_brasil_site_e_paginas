// ============================================
// UTILITÁRIOS - VOXTOR BRASIL
// ============================================

const VoxtorUtils = {
    // Formatação de moeda
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },
    
    // Formatação de telefone
    formatPhone(phone) {
        const numbers = phone.replace(/\D/g, '');
        
        if (numbers.length === 11) {
            return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (numbers.length === 10) {
            return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else if (numbers.length > 2) {
            return numbers.replace(/(\d{2})(\d+)/, '($1) $2');
        }
        return phone;
    },
    
    // Formatação de CPF/CNPJ
    formatCpfCnpj(value) {
        const numbers = value.replace(/\D/g, '');
        
        if (numbers.length === 11) {
            return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (numbers.length === 14) {
            return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
        return value;
    },
    
    // Formatação de CEP
    formatCep(cep) {
        const numbers = cep.replace(/\D/g, '');
        if (numbers.length === 8) {
            return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
        }
        return cep;
    },
    
    // Debounce para performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle para performance
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Detecção de dispositivo
    getDeviceInfo() {
        const ua = navigator.userAgent;
        const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(ua);
        const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua);
        
        return {
            type: isTablet ? 'tablet' : (isMobile ? 'mobile' : 'desktop'),
            os: this.getOS(ua),
            browser: this.getBrowser(ua)
        };
    },
    
    getOS(ua) {
        if (ua.includes('Windows')) return 'Windows';
        if (ua.includes('Mac OS')) return 'macOS';
        if (ua.includes('Linux')) return 'Linux';
        if (ua.includes('Android')) return 'Android';
        if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
        return 'Desconhecido';
    },
    
    getBrowser(ua) {
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        return 'Outro';
    },
    
    // Scroll suave profissional
    smoothScroll(target, offset = 0) {
        const element = typeof target === 'string' 
            ? document.querySelector(target) 
            : target;
            
        if (!element) return;
        
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    },
    
    // Gerar ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    },
    
    // Copiar para área de transferência
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Copiado para clipboard');
        }).catch(err => {
            console.error('Erro ao copiar:', err);
        });
    },
    
    // Detectar se elemento está visível na tela
    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Formatar data
    formatDate(date, format = 'dd/mm/yyyy') {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        
        return format
            .replace('dd', day)
            .replace('mm', month)
            .replace('yyyy', year);
    },
    
    // Pegar parâmetro da URL
    getUrlParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },
    
    // Salvar no localStorage
    setStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    
    // Pegar do localStorage
    getStorage(key) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    },
    
    // Remover do localStorage
    removeStorage(key) {
        localStorage.removeItem(key);
    }
};

// Exportar para uso global
window.VoxtorUtils = VoxtorUtils;