document.addEventListener('DOMContentLoaded', function() {
    // Elementos do menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body;
    const navOverlay = document.querySelector('.nav-overlay');

    // Controle do toggle
    const toggleMenu = (forceClose = false) => {
        const isActive = forceClose ? false : !mainNav.classList.contains('active');
        
        menuToggle.setAttribute('aria-expanded', isActive);
        mainNav.classList.toggle('active', isActive);
        body.classList.toggle('menu-open', isActive);
        navOverlay.style.visibility = isActive ? 'visible' : 'hidden';
        navOverlay.style.opacity = isActive ? '1' : '0';
    };

    // Event listeners
    menuToggle.addEventListener('click', () => toggleMenu());
    
    navOverlay.addEventListener('click', () => toggleMenu(true));
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if(window.innerWidth <= 991) toggleMenu(true);
        });
    });

    // Fechar ao redimensionar
    window.addEventListener('resize', () => {
        if(window.innerWidth > 991 && mainNav.classList.contains('active')) {
            toggleMenu(true);
        }
    });

    // Dropdowns mobile
    document.querySelectorAll('.dropbtn').forEach(button => {
        button.addEventListener('click', function(e) {
            if(window.innerWidth <= 991) {
                e.preventDefault();
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !isExpanded);
                
                const menu = this.nextElementSibling;
                menu.style.maxHeight = isExpanded ? '0' : `${menu.scrollHeight}px`;
            }
        });
    });
});
