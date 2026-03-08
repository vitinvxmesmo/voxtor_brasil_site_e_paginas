// ============================================
// smooth-scroll.js - Scroll Suave Profissional
// ============================================
// Vendor: Script leve para scroll suave com easing

(function() {
    'use strict';

    // Configurações padrão
    const defaults = {
        duration: 800,
        offset: 0,
        easing: 'easeInOutCubic',
        updateURL: true,
        callbackBefore: null,
        callbackAfter: null
    };

    // Funções de easing (aceleração)
    const easingFunctions = {
        linear: t => t,
        easeInQuad: t => t * t,
        easeOutQuad: t => t * (2 - t),
        easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeInCubic: t => t * t * t,
        easeOutCubic: t => (--t) * t * t + 1,
        easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        easeInQuart: t => t * t * t * t,
        easeOutQuart: t => 1 - (--t) * t * t * t,
        easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
        easeInQuint: t => t * t * t * t * t,
        easeOutQuint: t => 1 + (--t) * t * t * t * t,
        easeInOutQuint: t => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
    };

    // Classe principal
    class SmoothScroll {
        constructor(options = {}) {
            this.options = { ...defaults, ...options };
            this.init();
        }

        init() {
            // Adicionar listeners para todos os links internos
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', this.handleClick.bind(this));
            });

            // Adicionar listener para scroll suave via URL com hash
            if (window.location.hash) {
                setTimeout(() => {
                    this.scrollTo(window.location.hash);
                }, 100);
            }
        }

        handleClick(e) {
            const target = e.currentTarget;
            const hash = target.getAttribute('href');
            
            if (hash === '#') return;
            
            e.preventDefault();
            this.scrollTo(hash);
            
            // Atualizar URL se configurado
            if (this.options.updateURL) {
                history.pushState(null, null, hash);
            }
        }

        scrollTo(target) {
            const element = typeof target === 'string' 
                ? document.querySelector(target)
                : target;

            if (!element) return;

            const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - this.options.offset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const startTime = performance.now();

            // Callback antes do scroll
            if (typeof this.options.callbackBefore === 'function') {
                this.options.callbackBefore(element);
            }

            // Animação
            const animateScroll = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / this.options.duration, 1);
                
                const easing = easingFunctions[this.options.easing] || easingFunctions.easeInOutCubic;
                const easeProgress = easing(progress);
                
                window.scrollTo(0, startPosition + (distance * easeProgress));

                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                } else {
                    // Callback após o scroll
                    if (typeof this.options.callbackAfter === 'function') {
                        this.options.callbackAfter(element);
                    }
                }
            };

            requestAnimationFrame(animateScroll);
        }

        // Método para destruir listeners
        destroy() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.removeEventListener('click', this.handleClick);
            });
        }
    }

    // Exportar para uso global
    window.SmoothScroll = SmoothScroll;

    // Inicializar automaticamente se houver elementos com classe .smooth-scroll
    document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('.smooth-scroll')) {
            new SmoothScroll();
        }
    });

})();