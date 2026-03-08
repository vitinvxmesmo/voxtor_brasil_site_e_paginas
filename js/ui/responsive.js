// ============================================
// responsive.js - Utilitários Responsivos
// ============================================

class VoxtorResponsive {
    constructor() {
        this.breakpoints = {
            mobile: 768,
            tablet: 992,
            desktop: 1200
        };
        
        this.init();
    }
    
    init() {
        this.setupResizeHandler();
        this.setupOrientationHandler();
        this.setupTouchDetection();
        this.setupSafeAreas();
        this.handleResize();
    }
    
    setupResizeHandler() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }
    
    handleResize() {
        const width = window.innerWidth;
        const device = this.getDeviceType(width);
        
        window.dispatchEvent(new CustomEvent('voxtor-resize', {
            detail: {
                width: width,
                device: device,
                isMobile: width <= this.breakpoints.mobile,
                isTablet: width > this.breakpoints.mobile && width <= this.breakpoints.tablet,
                isDesktop: width > this.breakpoints.tablet
            }
        }));
        
        document.body.classList.remove('device-mobile', 'device-tablet', 'device-desktop');
        document.body.classList.add(`device-${device}`);
        
        // Atualizar viewport height para mobile (fix para 100vh no mobile)
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }
    
    getDeviceType(width) {
        if (width <= this.breakpoints.mobile) return 'mobile';
        if (width <= this.breakpoints.tablet) return 'tablet';
        return 'desktop';
    }
    
    setupOrientationHandler() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 200);
        });
    }
    
    handleOrientationChange() {
        const orientation = window.screen.orientation.type;
        
        window.dispatchEvent(new CustomEvent('voxtor-orientation', {
            detail: {
                orientation: orientation,
                isPortrait: orientation.includes('portrait'),
                isLandscape: orientation.includes('landscape')
            }
        }));
        
        this.handleResize();
    }
    
    setupTouchDetection() {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (isTouchDevice) {
            document.body.classList.add('touch-device');
        } else {
            document.body.classList.add('no-touch-device');
        }
    }
    
    setupSafeAreas() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        
        if (isIOS) {
            document.body.classList.add('ios-device');
            
            document.documentElement.style.setProperty('--safe-area-top', 'env(safe-area-inset-top)');
            document.documentElement.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom)');
            document.documentElement.style.setProperty('--safe-area-left', 'env(safe-area-inset-left)');
            document.documentElement.style.setProperty('--safe-area-right', 'env(safe-area-inset-right)');
        }
    }
    
    isMobile() {
        return window.innerWidth <= this.breakpoints.mobile;
    }
    
    isTablet() {
        return window.innerWidth > this.breakpoints.mobile && 
               window.innerWidth <= this.breakpoints.tablet;
    }
    
    isDesktop() {
        return window.innerWidth > this.breakpoints.tablet;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.VoxtorResponsive = new VoxtorResponsive();
});