// ============================================
// lp-utils.js - Utilitários para Landing Pages
// ============================================

class LPUtils {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupUtmTracking();
        this.setupCountdown();
        this.setupExitIntent();
        this.setupScrollTrigger();
        this.setupVideoModal();
    }
    
    setupUtmTracking() {
        const urlParams = new URLSearchParams(window.location.search);
        const utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
        
        utmParams.forEach(param => {
            const value = urlParams.get(param);
            if (value) {
                sessionStorage.setItem(param, value);
                
                // Preencher campos hidden do formulário
                const input = document.getElementById(param);
                if (input) {
                    input.value = value;
                }
            }
        });
    }
    
    setupCountdown() {
        const countdownEl = document.getElementById('countdown');
        if (!countdownEl) return;
        
        const targetDate = new Date(countdownEl.closest('[data-date]')?.dataset.date || '2026-04-30').getTime();
        
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            if (distance < 0) {
                countdownEl.innerHTML = 'Oferta expirada';
                return;
            }
            
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            countdownEl.innerHTML = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    setupExitIntent() {
        let showExitIntent = true;
        let hasShown = false;
        
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && showExitIntent && !hasShown) {
                this.showExitPopup();
                hasShown = true;
            }
        });
    }
    
    showExitPopup() {
        const popup = document.getElementById('exit-popup');
        if (!popup) return;
        
        popup.classList.add('show');
        
        const closeBtn = popup.querySelector('.close-popup');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                popup.classList.remove('show');
            });
        }
        
        const noThanks = popup.querySelector('.no-thanks');
        if (noThanks) {
            noThanks.addEventListener('click', (e) => {
                e.preventDefault();
                popup.classList.remove('show');
            });
        }
    }
    
    setupScrollTrigger() {
        const triggers = document.querySelectorAll('[data-scroll-trigger]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const trigger = entry.target;
                    const action = trigger.dataset.scrollTrigger;
                    
                    switch(action) {
                        case 'show-popup':
                            this.showScrollPopup(trigger.dataset.popupId);
                            break;
                        case 'play-video':
                            this.playVideo(trigger.dataset.videoId);
                            break;
                        case 'load-more':
                            this.loadMore(trigger.dataset.loadUrl);
                            break;
                    }
                    
                    observer.unobserve(trigger);
                }
            });
        }, {
            threshold: 0.5
        });
        
        triggers.forEach(trigger => observer.observe(trigger));
    }
    
    showScrollPopup(popupId) {
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.classList.add('show');
        }
    }
    
    playVideo(videoId) {
        const video = document.getElementById(videoId);
        if (video) {
            video.play();
        }
    }
    
    loadMore(url) {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                const container = document.getElementById('more-content');
                if (container) {
                    container.innerHTML = html;
                }
            })
            .catch(error => console.error('Erro ao carregar mais conteúdo:', error));
    }
    
    setupVideoModal() {
        const playButtons = document.querySelectorAll('.play-video');
        const modal = document.querySelector('.video-modal');
        
        if (!playButtons.length || !modal) return;
        
        playButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.style.display = 'flex';
                
                const videoId = btn.dataset.video;
                if (videoId) {
                    const video = document.getElementById(videoId);
                    if (video) {
                        video.play();
                    }
                }
            });
        });
        
        const closeBtn = modal.querySelector('.close-video');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                
                const videos = modal.querySelectorAll('video');
                videos.forEach(video => {
                    video.pause();
                });
            });
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                
                const videos = modal.querySelectorAll('video');
                videos.forEach(video => {
                    video.pause();
                });
            }
        });
    }
    
    trackConversion(conversionData) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', conversionData);
        }
        
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', conversionData);
        }
        
        if (window.VoxtorTracker) {
            window.VoxtorTracker.track('CONVERSION', conversionData);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.lp-page')) {
        window.LPUtils = new LPUtils();
    }
});