// ============================================
// navigation.js - Controle do Menu Mobile
// ============================================

class VoxtorNavigation {
    constructor() {
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.dropdowns = document.querySelectorAll('.dropdown');
        this.menuOverlay = null;
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
    }
    
    init() {
        // Criar overlay se não existir
        this.createOverlay();
        
        // Configurar eventos
        this.setupEventListeners();
        this.setupDropdowns();
        this.setupResizeHandler();
        
        console.log('✅ Navegação inicializada');
    }
    
    createOverlay() {
        // Verifica se já existe overlay
        this.menuOverlay = document.querySelector('.menu-overlay');
        
        if (!this.menuOverlay) {
            this.menuOverlay = document.createElement('div');
            this.menuOverlay.className = 'menu-overlay';
            document.body.appendChild(this.menuOverlay);
        }
    }
    
    setupEventListeners() {
        // Menu toggle (hamburger)
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMenu();
            });
        }
        
        // Overlay - fechar menu ao clicar fora
        if (this.menuOverlay) {
            this.menuOverlay.addEventListener('click', () => {
                this.closeMenu();
            });
        }
        
        // Fechar menu ao redimensionar para desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMenu();
                // Resetar dropdowns
                this.dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('open');
                });
            }
        });
        
        // Fechar menu com tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navMenu?.classList.contains('active')) {
                this.closeMenu();
            }
        });
    }
    
    setupDropdowns() {
        this.dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('a');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (!link || !menu) return;
            
            // Remove eventos antigos para não duplicar
            link.removeEventListener('click', this.handleDropdownClick);
            
            // Adiciona novo evento
            link.addEventListener('click', (e) => {
                this.handleDropdownClick(e, dropdown);
            });
            
            // Desktop: hover
            if (!this.isMobile) {
                dropdown.addEventListener('mouseenter', () => {
                    this.showDropdown(dropdown, menu);
                });
                
                dropdown.addEventListener('mouseleave', () => {
                    this.hideDropdown(dropdown, menu);
                });
            }
        });
    }
    
    handleDropdownClick(e, dropdown) {
        // Só previne default no mobile
        if (window.innerWidth <= 768) {
            e.preventDefault();
            e.stopPropagation();
            
            // Fecha outros dropdowns abertos
            this.dropdowns.forEach(other => {
                if (other !== dropdown && other.classList.contains('open')) {
                    other.classList.remove('open');
                }
            });
            
            // Toggle dropdown atual
            dropdown.classList.toggle('open');
        }
    }
    
    showDropdown(dropdown, menu) {
        dropdown.classList.add('open');
        menu.style.opacity = '1';
        menu.style.visibility = 'visible';
        menu.style.transform = 'translateY(0)';
    }
    
    hideDropdown(dropdown, menu) {
        dropdown.classList.remove('open');
        menu.style.opacity = '';
        menu.style.visibility = '';
        menu.style.transform = '';
    }
    
    toggleMenu() {
        if (!this.navMenu || !this.menuToggle || !this.menuOverlay) return;
        
        const isActive = this.navMenu.classList.contains('active');
        
        if (isActive) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.navMenu.classList.add('active');
        this.menuToggle.classList.add('active');
        this.menuOverlay.classList.add('active');
        document.body.classList.add('menu-open');
        
        // Animação do ícone hamburger
        const spans = this.menuToggle.querySelectorAll('span');
        if (spans.length >= 3) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        }
        
        // Travar scroll do body
        document.body.style.overflow = 'hidden';
    }
    
    closeMenu() {
        this.navMenu.classList.remove('active');
        this.menuToggle.classList.remove('active');
        this.menuOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
        
        // Liberar scroll do body
        document.body.style.overflow = '';
        
        // Fecha todos os dropdowns
        this.dropdowns.forEach(dropdown => {
            dropdown.classList.remove('open');
        });
        
        // Reset do ícone hamburger
        const spans = this.menuToggle?.querySelectorAll('span');
        if (spans) {
            spans.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '';
            });
        }
    }
    
    setupResizeHandler() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const wasMobile = this.isMobile;
                this.isMobile = window.innerWidth <= 768;
                
                // Se mudou de mobile para desktop, fecha o menu
                if (wasMobile && !this.isMobile) {
                    this.closeMenu();
                }
                
                // Reconfigurar dropdowns
                this.setupDropdowns();
            }, 250);
        });
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.VoxtorNavigation = new VoxtorNavigation();
});