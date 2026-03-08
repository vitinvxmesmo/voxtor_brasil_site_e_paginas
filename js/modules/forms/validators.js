// ============================================
// validators.js - Validações de Formulário
// ============================================

const VoxtorValidators = {
    // Validação de email
    email(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
            isValid: re.test(String(email).toLowerCase()),
            message: 'E-mail inválido'
        };
    },
    
    // Validação de telefone
    phone(phone) {
        const numbers = phone.replace(/\D/g, '');
        let isValid = false;
        let message = 'Telefone inválido';
        
        if (numbers.length === 10 || numbers.length === 11) {
            isValid = true;
            message = '';
        }
        
        return { isValid, message };
    },
    
    // Validação de CPF
    cpf(cpf) {
        const numbers = cpf.replace(/\D/g, '');
        
        if (numbers.length !== 11) {
            return { isValid: false, message: 'CPF deve ter 11 dígitos' };
        }
        
        if (/^(\d)\1+$/.test(numbers)) {
            return { isValid: false, message: 'CPF inválido' };
        }
        
        // Validação do primeiro dígito
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(numbers.charAt(i)) * (10 - i);
        }
        let remainder = 11 - (sum % 11);
        let digit1 = remainder > 9 ? 0 : remainder;
        
        if (digit1 !== parseInt(numbers.charAt(9))) {
            return { isValid: false, message: 'CPF inválido' };
        }
        
        // Validação do segundo dígito
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(numbers.charAt(i)) * (11 - i);
        }
        remainder = 11 - (sum % 11);
        let digit2 = remainder > 9 ? 0 : remainder;
        
        if (digit2 !== parseInt(numbers.charAt(10))) {
            return { isValid: false, message: 'CPF inválido' };
        }
        
        return { isValid: true, message: '' };
    },
    
    // Validação de CNPJ
    cnpj(cnpj) {
        const numbers = cnpj.replace(/\D/g, '');
        
        if (numbers.length !== 14) {
            return { isValid: false, message: 'CNPJ deve ter 14 dígitos' };
        }
        
        if (/^(\d)\1+$/.test(numbers)) {
            return { isValid: false, message: 'CNPJ inválido' };
        }
        
        // Validação simplificada
        return { isValid: true, message: '' };
    },
    
    // Validação de campo obrigatório
    required(value) {
        const isValid = value !== undefined && value !== null && value.toString().trim() !== '';
        return {
            isValid,
            message: isValid ? '' : 'Campo obrigatório'
        };
    },
    
    // Validação de número mínimo de caracteres
    minLength(value, min) {
        const str = value ? value.toString() : '';
        const isValid = str.length >= min;
        return {
            isValid,
            message: isValid ? '' : `Mínimo de ${min} caracteres`
        };
    },
    
    // Validação de número máximo de caracteres
    maxLength(value, max) {
        const str = value ? value.toString() : '';
        const isValid = str.length <= max;
        return {
            isValid,
            message: isValid ? '' : `Máximo de ${max} caracteres`
        };
    },
    
    // Validação de URL
    url(url) {
        const re = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        return {
            isValid: re.test(String(url).toLowerCase()),
            message: 'URL inválida'
        };
    },
    
    // Validação de data
    date(date) {
        const re = /^\d{4}-\d{2}-\d{2}$/;
        if (!re.test(date)) {
            return { isValid: false, message: 'Data inválida (use AAAA-MM-DD)' };
        }
        
        const d = new Date(date);
        const isValid = d instanceof Date && !isNaN(d);
        return {
            isValid,
            message: isValid ? '' : 'Data inválida'
        };
    },
    
    // Validação de senha forte
    strongPassword(password) {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        const isValidLength = password.length >= 8;
        
        const strength = [
            hasUpperCase,
            hasLowerCase,
            hasNumbers,
            hasSpecial,
            isValidLength
        ].filter(Boolean).length;
        
        let message = '';
        if (strength < 3) {
            message = 'Senha fraca. Use maiúsculas, minúsculas, números e caracteres especiais';
        } else if (strength < 5) {
            message = 'Senha média. Torne-a mais forte';
        }
        
        return {
            isValid: strength >= 3,
            strength: strength,
            message: message
        };
    },
    
    // Validação de CEP
    cep(cep) {
        const numbers = cep.replace(/\D/g, '');
        const isValid = numbers.length === 8;
        return {
            isValid,
            message: isValid ? '' : 'CEP deve ter 8 dígitos'
        };
    },
    
    // Validação de número
    number(value) {
        const num = parseFloat(value);
        const isValid = !isNaN(num) && isFinite(num);
        return {
            isValid,
            message: isValid ? '' : 'Valor deve ser um número'
        };
    },
    
    // Validação de número positivo
    positiveNumber(value) {
        const num = parseFloat(value);
        const isValid = !isNaN(num) && isFinite(num) && num > 0;
        return {
            isValid,
            message: isValid ? '' : 'Valor deve ser maior que zero'
        };
    },
    
    // Método para validar múltiplos campos
    validateForm(fields, rules) {
        const errors = {};
        let isValid = true;
        
        for (const [fieldName, fieldRules] of Object.entries(rules)) {
            const value = fields[fieldName];
            
            for (const rule of fieldRules) {
                let result;
                
                if (typeof rule === 'string') {
                    if (this[rule]) {
                        result = this[rule](value);
                    }
                } else if (rule.type) {
                    result = this[rule.type](value, ...(rule.params || []));
                }
                
                if (result && !result.isValid) {
                    errors[fieldName] = result.message;
                    isValid = false;
                    break;
                }
            }
        }
        
        return { isValid, errors };
    }
};

window.VoxtorValidators = VoxtorValidators;