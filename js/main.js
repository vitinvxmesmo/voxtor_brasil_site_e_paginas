// ============================================
// main.js - Funcionalidades Gerais do Site Voxtor Brasil
// ============================================

'use strict';

/**
 * ============================================
 * 1. INICIALIZAÇÃO PRINCIPAL
 * ============================================
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Voxtor Brasil - Sistema inicializado');
    
    // Inicializar todas as funcionalidades
    initMenuHamburguer();
    initScrollAnimations();
    initSmoothScroll();
    initAnimatedCounters();
    initLazyLoading();
    initBackToTop();
    initTooltips();
    initThemeToggle();
    initCurrentYear();
    initScrollProgress();
    initParallaxEffects();
    initModalSystem();
    initTabsSystem();
    initAccordionSystem();
    
    console.log('✅ Todas as funcionalidades ativas');
    
    // Adicionar estilos dinâmicos
    addDynamicStyles();
});

/**
 * ============================================
 * 2. MENU HAMBURGUER RESPONSIVO
 * ============================================
 */
function initMenuHamburguer() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!menuToggle || !navMenu) return;
    
    console.log('🍔 Menu hamburguer configurado');
    
    // Criar overlay
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
    
    let isMenuOpen = false;
    
    // Alternar menu
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        menuToggle.setAttribute('aria-expanded', isMenuOpen);
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        
        // Animar ícone
        animateHamburgerIcon(isMenuOpen);
    }
    
    // Fechar menu
    function closeMenu() {
        if (!isMenuOpen) return;
        
        isMenuOpen = false;
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
    
    // Animar ícone hamburguer
    function animateHamburgerIcon(open) {
        const spans = menuToggle.querySelectorAll('span');
        if (!spans.length) return;
        
        spans.forEach((span, index) => {
            span.style.transition = 'all 0.3s ease';
            
            if (open) {
                switch(index) {
                    case 0:
                        span.style.transform = 'rotate(45deg) translate(6px, 6px)';
                        break;
                    case 1:
                        span.style.opacity = '0';
                        span.style.transform = 'scaleX(0)';
                        break;
                    case 2:
                        span.style.transform = 'rotate(-45deg) translate(6px, -6px)';
                        break;
                }
            } else {
                span.style.transform = '';
                span.style.opacity = '';
            }
        });
    }
    
    // Event Listeners
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });
    
    overlay.addEventListener('click', closeMenu);
    
    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });
    
    // Fechar ao clicar fora
    document.addEventListener('click', function(e) {
        if (isMenuOpen && 
            !navMenu.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Fechar ao clicar em links do menu
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

/**
 * ============================================
 * 3. ANIMAÇÕES ON SCROLL (Reveal)
 * ============================================
 */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    
    if (!revealElements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * ============================================
 * 4. SCROLL SUAVE PARA ÂNCORAS
 * ============================================
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    if (!anchorLinks.length) return;
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const targetElement = document.querySelector(href);
            
            if (!targetElement) return;
            
            e.preventDefault();
            
            // Fechar menu mobile se aberto
            const menuToggle = document.querySelector('.menu-toggle.active');
            if (menuToggle) {
                menuToggle.click();
            }
            
            // Calcular posição
            const headerHeight = document.querySelector('.navbar')?.offsetHeight || 80;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            // Scroll suave
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * ============================================
 * 5. CONTADORES ANIMADOS
 * ============================================
 */
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.counter[data-target]');
    
    if (!counters.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
    
    function animateCounter(element, target) {
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current).toLocaleString('pt-BR');
            
            if (current >= target) {
                element.textContent = target.toLocaleString('pt-BR');
                clearInterval(timer);
            }
        }, 16);
    }
}

/**
 * ============================================
 * 6. LAZY LOADING DE IMAGENS
 * ============================================
 */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (!lazyImages.length) return;
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

/**
 * ============================================
 * 7. BOTÃO "VOLTAR AO TOPO"
 * ============================================
 */
function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.setAttribute('aria-label', 'Voltar ao topo');
    
    document.body.appendChild(backToTopBtn);
    
    // Mostrar/ocultar
    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    
    // Scroll para o topo
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop();
}

/**
 * ============================================
 * 8. TOOLTIPS
 * ============================================
 */
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    if (!tooltipElements.length) return;
    
    tooltipElements.forEach(element => {
        let tooltip = null;
        
        element.addEventListener('mouseenter', function() {
            const text = this.getAttribute('data-tooltip');
            tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = text;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width/2 - tooltip.offsetWidth/2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
        });
        
        element.addEventListener('mouseleave', function() {
            if (tooltip) {
                tooltip.remove();
                tooltip = null;
            }
        });
    });
}

/**
 * ============================================
 * 9. TOGGLE DE TEMA (DARK/LIGHT MODE)
 * ============================================
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (!themeToggle) return;
    
    // Verificar preferência salva
    const savedTheme = localStorage.getItem('voxtor-theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Aplicar tema inicial
    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
    }
    
    // Alternar tema
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('voxtor-theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('voxtor-theme', 'light');
        }
    });
}

/**
 * ============================================
 * 10. ANO ATUAL NO FOOTER
 * ============================================
 */
function initCurrentYear() {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

/**
 * ============================================
 * 11. BARRA DE PROGRESSO DO SCROLL
 * ============================================
 */
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    
    document.body.appendChild(progressBar);
    
    function updateScrollProgress() {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        
        progressBar.style.width = scrolled + '%';
    }
    
    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress();
}

/**
 * ============================================
 * 12. EFEITOS PARALLAX (Simples)
 * ============================================
 */
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (!parallaxElements.length) return;
    
    window.addEventListener('scroll', function() {
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(window.scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

/**
 * ============================================
 * 13. SISTEMA DE MODAIS
 * ============================================
 */
function initModalSystem() {
    // Abrir modal
    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.dataset.modal;
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Focar no primeiro elemento interativo
                const focusElement = modal.querySelector('button, input, textarea');
                if (focusElement) focusElement.focus();
            }
        });
    });
    
    // Fechar modal
    document.querySelectorAll('.modal-close, .modal-overlay').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Fechar com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });
}

/**
 * ============================================
 * 14. SISTEMA DE TABS
 * ============================================
 */
function initTabsSystem() {
    const tabContainers = document.querySelectorAll('.tabs');
    
    tabContainers.forEach(container => {
        const tabs = container.querySelectorAll('.tab-trigger');
        const contents = container.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const target = this.dataset.tab;
                
                // Remover classes ativas
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                // Adicionar classes ativas
                this.classList.add('active');
                container.querySelector(`#${target}`).classList.add('active');
            });
        });
    });
}

/**
 * ============================================
 * 15. SISTEMA DE ACCORDION
 * ============================================
 */
function initAccordionSystem() {
    const accordions = document.querySelectorAll('.accordion-item');
    
    accordions.forEach(item => {
        const trigger = item.querySelector('.accordion-trigger');
        
        if (trigger) {
            trigger.addEventListener('click', function() {
                const isOpen = item.classList.contains('active');
                
                // Fechar todos
                if (!isOpen) {
                    accordions.forEach(acc => acc.classList.remove('active'));
                }
                
                // Alternar este
                item.classList.toggle('active');
            });
        }
    });
}

/**
 * ============================================
 * 16. ESTILOS DINÂMICOS
 * ============================================
 */
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* MENU OVERLAY */
        .menu-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 998;
        }
        
        .menu-overlay.active {
            display: block;
        }
        
        /* BACK TO TOP */
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--primary, #c00d84);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: var(--shadow-md);
        }
        
        .back-to-top:hover {
            background: var(--primary-dark, #5e0557);
        }
        
        .back-to-top.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* TOOLTIPS */
        .tooltip {
            position: fixed;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.85rem;
            z-index: 10000;
            pointer-events: none;
        }
        
        /* SCROLL PROGRESS */
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--primary), var(--accent));
            z-index: 1000;
            transition: width 0.1s ease;
        }
        
        /* MODAL */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
        }
        
        .modal.active {
            display: flex;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            position: relative;
            background: var(--bg-primary);
            margin: auto;
            padding: 2rem;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            z-index: 10001;
        }
        
        .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-secondary);
        }
        
        /* TABS */
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }
        
        /* ACCORDION */
        .accordion-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }
        
        .accordion-item.active .accordion-content {
            max-height: 1000px;
        }
        
        /* ANIMAÇÕES REVEAL */
        .reveal {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .reveal.active {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* RESPONSIVO */
        @media (max-width: 768px) {
            .back-to-top {
                bottom: 20px;
                right: 20px;
                width: 40px;
                height: 40px;
                font-size: 1.2rem;
            }
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * ============================================
 * 17. UTILITÁRIOS GLOBAIS
 * ============================================
 */
window.VoxtorUtils = {
    formatPhone: function(phone) {
        const numbers = phone.replace(/\D/g, '');
        if (numbers.length === 11) {
            return numbers.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        }
        return phone;
    },
    
    copyToClipboard: function(text) {
        navigator.clipboard.writeText(text)
            .then(() => console.log('Copiado:', text))
            .catch(err => console.error('Erro ao copiar:', err));
    },
    
    showNotification: function(message, type = 'info') {
        // Implementação simples de notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// ============================================
// FIM DO ARQUIVO main.js
// ============================================
console.log('📁 main.js carregado com sucesso');