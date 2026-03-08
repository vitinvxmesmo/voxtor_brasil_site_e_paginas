// ============================================
// back-to-top.js - Botão Voltar ao Topo
// ============================================

class BackToTop {
    constructor() {
        this.button = null;
        this.scrollThreshold = 300;
        this.init();
    }
    
    init() {
        this.createButton();
        this.setupEventListeners();
    }
    
    createButton() {
        this.button = document.createElement('button');
        this.button.className = 'back-to-top';
        this.button.setAttribute('aria-label', 'Voltar ao topo');
        this.button.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 19V5M5 12l7-7 7 7" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        
        document.body.appendChild(this.button);
    }
    
    setupEventListeners() {
        window.addEventListener('scroll', () => {
            this.toggleButton();
        });
        
        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            this.scrollToTop();
        });
        
        this.toggleButton();
    }
    
    toggleButton() {
        if (window.scrollY > this.scrollThreshold) {
            this.button.classList.add('show');
        } else {
            this.button.classList.remove('show');
        }
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BackToTop();
});