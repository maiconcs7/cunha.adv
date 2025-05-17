/**
 * @file loadComponents.js
 * @description Este script é responsável por carregar componentes HTML reutilizáveis (como header e footer)
 *              em placeholders específicos nas páginas HTML. Também inicializa funcionalidades JavaScript
 *              associadas a esses componentes após o carregamento.
 */

/**
 * Carrega um componente HTML de um arquivo externo e o insere em um elemento placeholder na página.
 * Também inicializa scripts específicos para o componente carregado (ex: menu mobile, mega menu, accordion).
 *
 * @async
 * @param {string} componentPath - O caminho para o arquivo HTML do componente (ex: '/includes/header.html').
 * @param {string} placeholderId - O ID do elemento HTML na página onde o componente será inserido.
 * @returns {Promise<void>} Uma promessa que resolve quando o componente é carregado e inicializado, ou rejeita em caso de erro.
 */
async function loadComponent(componentPath, placeholderId) {
    try {
        // COMENTÁRIO EXPLICATIVO: Faz uma requisição para buscar o conteúdo do arquivo HTML do componente.
        const response = await fetch(componentPath);

        // COMENTÁRIO EXPLICATIVO: Verifica se a requisição foi bem-sucedida (status HTTP 200-299).
        if (!response.ok) {
            console.error(`Erro ao carregar o componente ${componentPath}: ${response.status} ${response.statusText}`);
            return; // Interrompe a execução se houver erro no carregamento.
        }

        // COMENTÁRIO EXPLICATIVO: Converte a resposta da requisição para texto (o conteúdo HTML do componente).
        const componentHtml = await response.text();
        
        // COMENTÁRIO EXPLICATIVO: Encontra o elemento placeholder na página usando o ID fornecido.
        const placeholder = document.getElementById(placeholderId);

        if (placeholder) {
            // COMENTÁRIO EXPLICATIVO: Insere o HTML do componente dentro do elemento placeholder.
            placeholder.innerHTML = componentHtml;
            
            // COMENTÁRIO EXPLICATIVO: Após carregar o header, inicializa suas funcionalidades específicas.
            if (placeholderId === 'header-placeholder') {
                // --- INICIALIZAÇÃO DO MENU MOBILE (HAMBÚRGUER) ---
                const menuToggle = placeholder.querySelector('.menu-toggle'); // Botão de toggle do menu mobile.
                const mainNav = placeholder.querySelector('.main-nav'); // Container da navegação principal.
                
                if (menuToggle && mainNav) {
                    menuToggle.addEventListener('click', () => {
                        // COMENTÁRIO EXPLICATIVO: Alterna a classe 'active' no container da navegação,
                        // que é usada pelo CSS para mostrar ou esconder o menu mobile.
                        mainNav.classList.toggle('active');
                    });
                }

                // --- INICIALIZAÇÃO DO MEGA MENU ---
                // COMENTÁRIO EXPLICATIVO: A lógica detalhada do mega menu foi movida para megaMenu.js e é chamada lá.
                // Esta seção garante que os seletores corretos sejam usados após o header ser carregado dinamicamente.
                // A lógica específica de hover (desktop) e click (mobile) para o mega menu é gerenciada pelo CSS e pelo script megaMenu.js.
                // O script megaMenu.js já é carregado no header.html, então ele atuará sobre os elementos aqui carregados.
                // No entanto, para garantir que o comportamento de clique no mobile para o mega menu funcione corretamente
                // após o carregamento dinâmico, adicionamos a lógica de toggle aqui também.
                const megaMenuContainer = placeholder.querySelector('.mega-menu-container');
                if (megaMenuContainer) {
                    if (window.innerWidth <= 991) { // Aplicar lógica de clique apenas para mobile
                        const dropbtn = megaMenuContainer.querySelector('.dropbtn'); // O link principal que abre o mega menu
                        const mainItems = megaMenuContainer.querySelectorAll('.mega-menu-main-item'); // Itens do menu secundário
                        const subMenus = megaMenuContainer.querySelectorAll('.mega-submenu'); // Submenus (menu terciário)

                        if (dropbtn) {
                            dropbtn.addEventListener('click', (e) => {
                                e.preventDefault(); // Previne a navegação padrão do link.
                                // COMENTÁRIO EXPLICATIVO: Alterna a classe 'open' no container do mega menu para mostrar/esconder o conteúdo do mega menu no mobile.
                                megaMenuContainer.classList.toggle('open');
                                const isOpen = megaMenuContainer.classList.contains('open');
                                dropbtn.setAttribute('aria-expanded', isOpen.toString());

                                // Se o mega menu está sendo fechado, garante que todos os sub-itens também sejam desativados/escondidos.
                                if (!isOpen) {
                                    subMenus.forEach(submenu => submenu.classList.remove('active'));
                                    mainItems.forEach(i => i.classList.remove('active-main-item'));
                                }
                            });
                        }

                        mainItems.forEach(item => {
                            item.addEventListener('click', (e) => {
                                e.preventDefault(); // Previne a navegação padrão do link.
                                const targetSubmenuId = item.getAttribute('data-submenu');
                                const targetSubmenu = megaMenuContainer.querySelector(`#${targetSubmenuId}`);
                                const isActive = item.classList.contains('active-main-item');

                                // Desativa outros itens e submenus para comportamento de accordion no mobile.
                                mainItems.forEach(i => {
                                    if (i !== item) {
                                        i.classList.remove('active-main-item');
                                        const otherSubmenuId = i.getAttribute('data-submenu');
                                        const otherSubmenu = megaMenuContainer.querySelector(`#${otherSubmenuId}`);
                                        if (otherSubmenu) otherSubmenu.classList.remove('active');
                                    }
                                });
                                subMenus.forEach(sm => {
                                    if (sm !== targetSubmenu) sm.classList.remove('active');
                                });

                                // Alterna o estado do item clicado e seu submenu.
                                if (isActive) {
                                    item.classList.remove('active-main-item');
                                    if (targetSubmenu) targetSubmenu.classList.remove('active');
                                } else {
                                    item.classList.add('active-main-item');
                                    if (targetSubmenu) targetSubmenu.classList.add('active');
                                }
                            });
                        });
                    }
                }
            }
            
            // COMENTÁRIO EXPLICATIVO: Após carregar o footer, inicializa a funcionalidade de accordion.
            if (placeholderId === 'footer-placeholder') {
                const accordionButtons = placeholder.querySelectorAll('.bsc-accordion-button');
                accordionButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const content = button.nextElementSibling; // O conteúdo do accordion.
                        const expanded = button.getAttribute('aria-expanded') === 'true' || false;
                        
                        // COMENTÁRIO EXPLICATIVO: Alterna o estado de 'aria-expanded' para acessibilidade.
                        button.setAttribute('aria-expanded', !expanded);
                        
                        // COMENTÁRIO EXPLICATIVO: Anima a abertura/fechamento do conteúdo do accordion ajustando max-height e padding.
                        if (!expanded) {
                            content.style.maxHeight = content.scrollHeight + "px";
                            content.style.paddingTop = '10px';    // Adiciona padding ao abrir
                            content.style.paddingBottom = '10px'; // Adiciona padding ao abrir
                        } else {
                            content.style.maxHeight = null;
                            content.style.paddingTop = null;    // Remove padding ao fechar
                            content.style.paddingBottom = null; // Remove padding ao fechar
                        }
                    });
                });
            }
        } else {
            // COMENTÁRIO EXPLICATIVO: Avisa no console se o placeholder não for encontrado.
            console.warn(`Elemento placeholder com ID '${placeholderId}' não encontrado.`);
        }
    } catch (error) {
        // COMENTÁRIO EXPLICATIVO: Captura e exibe erros que possam ocorrer durante o fetch ou processamento.
        console.error(`Erro ao buscar o componente ${componentPath}:`, error);
    }
}

// COMENTÁRIO EXPLICATIVO: Adiciona um listener para o evento 'DOMContentLoaded', que é disparado
// quando o HTML inicial da página foi completamente carregado e parseado.
// Isso garante que os placeholders existam antes de tentar carregar os componentes neles.
document.addEventListener('DOMContentLoaded', () => {
    // COMENTÁRIO EXPLICATIVO: Chama a função loadComponent para carregar o header no placeholder 'header-placeholder'.
    loadComponent('/cunha.adv/includes/header.html', 'header-placeholder');
    // COMENTÁRIO EXPLICATIVO: Chama a função loadComponent para carregar o footer no placeholder 'footer-placeholder'.
    loadComponent('/cunha.adv/includes/footer.html', 'footer-placeholder');
});