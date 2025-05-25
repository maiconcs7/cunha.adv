/**
 * Scripts do Menu Hamburger
 * Site Cunha Advocacia
 */

document.addEventListener('DOMContentLoaded', function() {
    // Controle do menu hamburger
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            
            // Aqui você pode adicionar lógica para mostrar/esconder o menu mobile
            const navList = document.querySelector('.nav-list');
            if (navList) {
                if (!isExpanded) {
                    navList.classList.add('active');
                } else {
                    navList.classList.remove('active');
                }
            }
        });
    }
});
