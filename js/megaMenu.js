// Controle do Menu Mobile
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;

    // Abrir/Fechar Menu
    if(menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            body.classList.toggle('no-scroll');
            
            // Acessibilidade
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Fechar ao clicar nos links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.classList.remove('no-scroll');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
        if(mobileMenu.classList.contains('active') && 
           !e.target.closest('.mobile-menu') && 
           !e.target.closest('.menu-toggle')) {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.classList.remove('no-scroll');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Fechar ao redimensionar para desktop
    window.addEventListener('resize', () => {
        if(window.innerWidth >= 992) {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.classList.remove('no-scroll');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

