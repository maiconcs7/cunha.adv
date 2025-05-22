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

        // Nota: Para dispositivos móveis, o comportamento é controlado por CSS e JavaScript adicional
        // que detecta cliques em vez de hover (passar o mouse)
    });
});


    // Fechar menu ao redimensionar para desktop
    function handleResize() {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    }
    
    window.addEventListener('resize', handleResize);
});

