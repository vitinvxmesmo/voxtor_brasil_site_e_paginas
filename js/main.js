// ============================================
// 18. DROPDOWN MENU PARA MOBILE
// ============================================
function initMobileDropdowns() {
    if (window.innerWidth <= 768) {
        const dropdowns = document.querySelectorAll('.dropdown > a');
        
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('click', function(e) {
                e.preventDefault();
                const parent = this.parentElement;
                parent.classList.toggle('open');
                
                const menu = parent.querySelector('.dropdown-menu');
                if (menu) {
                    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
                }
            });
        });
    }
}

// Chamar na inicialização
document.addEventListener('DOMContentLoaded', function() {
    // ... código existente ...
    initMobileDropdowns();
});