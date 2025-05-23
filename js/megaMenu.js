/**** Lógica para o Mega Menu ****/
/**
 * Este script controla o comportamento do mega menu do site.
 * 
 * Funcionalidade:
 * 1. Menu superior: Sempre visível
 * 2. Menu secundário: Aparece quando o mouse passa sobre o item do menu principal
 * 3. Menu terciário: Aparece quando o mouse passa sobre o item do menu secundário
 * 
 * Comportamento específico:
 * - Ao passar o mouse sobre um item do menu secundário, o submenu correspondente é exibido
 * - Ao remover o mouse do container do menu, todos os submenus são escondidos
 * - Em dispositivos móveis, o comportamento é adaptado para funcionar com toques
 */
document.addEventListener("DOMContentLoaded", function() {
    // Seleciona todos os containers de mega menu na página
    const megaMenuContainers = document.querySelectorAll(".mega-menu-container");

    megaMenuContainers.forEach(container => {
        // Elementos dentro de cada container de mega menu
        const mainItems = container.querySelectorAll(".mega-menu-main-item");  // Itens do menu secundário
        const subMenus = container.querySelectorAll(".mega-submenu");          // Submenus (menu terciário)
        const megaMenuContent = container.querySelector(".mega-menu-content"); // Container do menu secundário

        // Adiciona evento de mouseenter (passar o mouse) para cada item do menu secundário
        mainItems.forEach(item => {
            item.addEventListener("mouseenter", function() {
                // 1. Remove a classe ativa de todos os itens do menu secundário
                mainItems.forEach(i => i.classList.remove("active-main-item"));
                
                // 2. Adiciona a classe ativa ao item atual (destacando-o visualmente)
                this.classList.add("active-main-item");

                // 3. Esconde todos os submenus (menu terciário)
                subMenus.forEach(submenu => submenu.classList.remove("active"));

                // 4. Mostra o submenu correspondente ao item atual
                const submenuId = this.dataset.submenu; // Obtém o ID do submenu a partir do atributo data-submenu
                if (submenuId) {
                    const targetSubmenu = container.querySelector("#" + submenuId);
                    if (targetSubmenu) {
                        targetSubmenu.classList.add("active"); // Adiciona classe que torna o submenu visível
                    }
                }
            });
        });

        // Comportamento quando o mouse sai da área do mega menu
        if (megaMenuContent) {
            megaMenuContent.addEventListener("mouseleave", function() {
                // Mantém o último submenu ativo visível enquanto o cursor estiver sobre o mega-menu-content
                // Isso permite que o usuário navegue para o submenu sem que ele desapareça
            });
        }
        
        // Esconde todos os submenus quando o mouse sai completamente do container do dropdown
        container.addEventListener("mouseleave", function() {
            // Remove destaque visual de todos os itens do menu secundário
            mainItems.forEach(i => i.classList.remove("active-main-item"));
            
            // Esconde todos os submenus (menu terciário)
            subMenus.forEach(submenu => submenu.classList.remove("active"));
        });
    });

    // Script atualizado para o menu overlay
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navOverlay = document.querySelector('.nav-overlay');
    const body = document.body;
    
    // Abrir/fechar menu principal
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('active');
            body.classList.toggle('menu-open');
        });
    }
    
    // Fechar menu ao clicar no overlay
    if (navOverlay) {
        navOverlay.addEventListener('click', function() {
            menuToggle.setAttribute('aria-expanded', 'false');
            mainNav.classList.remove('active');
            body.classList.remove('menu-open');
            closeAllSubmenus();
        });
    }
    
    // Fechar menu ao clicar em um link (mobile)
    const navLinks = document.querySelectorAll('.nav-link:not(.dropbtn)');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });
    
    // Gerenciar dropdowns no mobile
    const dropdownButtons = document.querySelectorAll('.dropbtn');
    dropdownButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !isExpanded);
                
                const megaMenu = this.nextElementSibling;
                if (isExpanded) {
                    megaMenu.style.maxHeight = '0';
                } else {
                    closeAllSubmenus();
                    megaMenu.style.maxHeight = megaMenu.scrollHeight + 'px';
                }
            }
        });
    });
    
    // Funções auxiliares
    function closeMenu() {
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
            mainNav.classList.remove('active');
            body.classList.remove('menu-open');
            closeAllSubmenus();
        }
    }
    
    function closeAllSubmenus() {
        document.querySelectorAll('.mega-menu-content').forEach(menu => {
            menu.style.maxHeight = '0';
        });
        document.querySelectorAll('.dropbtn').forEach(btn => {
            btn.setAttribute('aria-expanded', 'false');
        });
    }
    
    // Fechar menu ao redimensionar para desktop
    function handleResize() {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    }
    
    window.addEventListener('resize', handleResize);
});
function toggleMenu() {
    const menu = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.nav-overlay');
    const toggle = document.querySelector('.menu-toggle');
    
    menu.classList.toggle('active');
    overlay.classList.toggle('active');
    toggle.setAttribute('aria-expanded', menu.classList.contains('active'));
    
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : 'auto';
}

// Fechar ao clicar fora
document.querySelector('.nav-overlay').addEventListener('click', toggleMenu);
<script>
// Controle do estado
document.querySelector('.hamburger-icon').addEventListener('click', function() {
  const isExpanded = this.getAttribute('aria-expanded') === 'true';
  this.setAttribute('aria-expanded', !isExpanded);
});
</script>
