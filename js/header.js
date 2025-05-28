/**
 * Script para o Menu Hambúrguer Simples
 * Site Cunha Advocacia
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do menu
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const navOverlay = document.querySelector('.nav-overlay');
    const header = document.querySelector('.site-header');
    
    // Verificar se os elementos existem para evitar erros
    if (!menuToggle || !navList || !navOverlay || !header) {
        console.error('Elementos do menu não encontrados');
        return;
    }
    
    // Função para abrir/fechar o menu
    function toggleMenu() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navList.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }
    
    // Event listeners
    menuToggle.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', toggleMenu);
    
    // Fechar menu ao clicar em links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navList.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // Marcar link ativo com base na URL atual
    const currentPage = window.location.pathname.split('/').pop();
    navLinks.forEach(link => {
        const pageName = link.getAttribute('data-page-name');
        if (pageName && (currentPage === pageName || currentPage.includes(pageName))) {
            link.classList.add('active');
        }
    });
    
    // Efeito de scroll - reduzir tamanho do cabeçalho ao rolar
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Adicionar classe quando rolar para baixo
        if (scrollTop > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
});
