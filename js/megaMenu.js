document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.getElementById('main-nav');
    const body = document.body;
    const navOverlay = document.querySelector('.nav-overlay');

    // Controle do Toggle
    const toggleMenu = () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.classList.toggle('no-scroll');
        menuToggle.setAttribute('aria-expanded', 
            menuToggle.classList.contains('active'));
    };

    // Event Listeners
    menuToggle.addEventListener('click', toggleMenu);
    
    navOverlay.addEventListener('click', () => {
        if(mobileMenu.classList.contains('active')) toggleMenu();
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // Fechar ao redimensionar
    window.addEventListener('resize', () => {
        if(window.innerWidth >= 992 && mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Compatibilidade com Mega Menu Existente
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            if(window.innerWidth < 992) {
                e.preventDefault();
                this.classList.toggle('active');
                const menu = this.querySelector('.mega-menu-content');
                menu.style.maxHeight = menu.style.maxHeight ? null : `${menu.scrollHeight}px`;
            }
        });
    });
});
