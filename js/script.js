document.addEventListener('DOMContentLoaded', function() {
    // COMENTÁRIO: Lógica para o Menu Responsivo (Hambúrguer)
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            const isActive = mainNav.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive);
            // COMENTÁRIO: Alternar ícone do botão hambúrguer (opcional)
            // const icon = menuToggle.querySelector('i');
            // if (isActive) {
            //     icon.classList.remove('fa-bars');
            //     icon.classList.add('fa-times');
            // } else {
            //     icon.classList.remove('fa-times');
            //     icon.classList.add('fa-bars');
            // }
        });
    }

    // COMENTÁRIO: Lógica para destacar o link da página ativa no menu principal
    const currentPage = window.location.pathname.split('/').pop(); // Pega o nome do arquivo da URL atual
    const navLinks = document.querySelectorAll('.main-nav ul li a');
    navLinks.forEach(link => {
        const linkPageName = link.getAttribute('data-page-name');
        if (linkPageName === currentPage || (currentPage === '' && linkPageName === 'index.html')) {
            link.classList.add('active-page-link');
        }
    });

    // COMENTÁRIO: Lógica para o Mega Menu (Dropdown em mobile e hover em desktop)
    const megaMenuContainers = document.querySelectorAll('.mega-menu-container');
    megaMenuContainers.forEach(container => {
        const dropbtn = container.querySelector('.dropbtn');
        const megaMenuContent = container.querySelector('.mega-menu-content');

        if (dropbtn && megaMenuContent) {
            // Lógica para clique em mobile (para abrir/fechar o mega menu)
            dropbtn.addEventListener('click', function(event) {
                if (window.innerWidth < 992) { // Apenas em telas mobile/tablet
                    event.preventDefault();
                    const isOpen = container.classList.toggle('open');
                    // COMENTÁRIO: Atualizar aria-expanded para acessibilidade
                    dropbtn.setAttribute('aria-expanded', isOpen);
                    // COMENTÁRIO: Rotacionar a seta do dropdown
                    const icon = dropbtn.querySelector('.fa-chevron-down');
                    if (icon) {
                        icon.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
                    }
                }
            });

            // COMENTÁRIO: Lógica para submenus dentro do mega menu (se houver interação de clique para sub-submenus)
            // Esta parte do código original do script.js para .main-nav .dropdown > a foi adaptada
            // para os itens principais do mega menu que controlam submenus.
            const mainItems = container.querySelectorAll('.mega-menu-main-item[data-submenu]');
            mainItems.forEach(mainItem => {
                mainItem.addEventListener('click', function(event) {
                    if (window.innerWidth < 992) { // Apenas em mobile/tablet
                        event.preventDefault();
                        const submenuId = this.getAttribute('data-submenu');
                        const activeSubmenu = container.querySelector('#' + submenuId);
                        
                        // Fecha outros submenus abertos na mesma coluna
                        const allSubmenusInColumn = this.closest('.mega-menu-column').parentElement.querySelectorAll('.mega-submenu.active');
                        allSubmenusInColumn.forEach(sm => {
                            if (sm !== activeSubmenu) {
                                sm.classList.remove('active');
                                // Também resetar o item principal correspondente
                                const correspondingMainItem = container.querySelector(`.mega-menu-main-item[data-submenu="${sm.id}"]`);
                                if(correspondingMainItem) correspondingMainItem.classList.remove('active-main-item');
                            }
                        });

                        // Alterna o submenu atual
                        if (activeSubmenu) {
                            activeSubmenu.classList.toggle('active');
                            this.classList.toggle('active-main-item'); // Destaca o item principal do submenu ativo
                        }
                    }
                });
            });
        }
    });

    // COMENTÁRIO: Lógica original do script.js (Pop-up, WhatsApp, Formulários, Rodapé Accordion)
    // Manter o restante do código original do script.js aqui, pois ele lida com outras funcionalidades do site.

    // Formulário de Contato Inteligente - Lógica para mostrar questionário
    const tipoDemandaSelect = document.getElementById('tipo-demanda');
    const questionarioSegmentacao = document.getElementById('questionario-segmentacao');
    const perguntaProdutorRural = document.getElementById('pergunta-produtor-rural');

    if (tipoDemandaSelect) {
        tipoDemandaSelect.addEventListener('change', function() {
            if (this.value === 'direito-rural' || this.value === 'direito-previdenciario') {
                if(questionarioSegmentacao) questionarioSegmentacao.style.display = 'block';
                if(perguntaProdutorRural) perguntaProdutorRural.style.display = 'block';
            } else {
                if(questionarioSegmentacao) questionarioSegmentacao.style.display = 'none';
                if(perguntaProdutorRural) perguntaProdutorRural.style.display = 'none';
            }
        });
    }

    // Pop-up de Oferta (1ª consulta gratuita)
    const popupOferta = document.getElementById('popup-oferta'); 
    const popupFechar = document.querySelector('#popup-oferta .popup-fechar'); 

    function mostrarPopup() {
        if (popupOferta) {
            popupOferta.style.display = 'flex';
        }
    }

    function fecharPopup() {
        if (popupOferta) {
            popupOferta.style.display = 'none';
        }
    }

    setTimeout(mostrarPopup, 5000); 

    if (popupFechar) {
        popupFechar.addEventListener('click', fecharPopup);
    }

    if (popupOferta) {
        popupOferta.addEventListener('click', function(event) {
            if (event.target === popupOferta) {
                fecharPopup();
            }
        });
    }

    // Lógica para formulários
    const formContato = document.getElementById('form-contato-inteligente');
    if(formContato) {
        formContato.addEventListener('submit', function(event) {
            event.preventDefault(); 
            alert('Obrigado por entrar em contato! Responderemos em breve.');
            formContato.reset(); 
            if (questionarioSegmentacao) questionarioSegmentacao.style.display = 'none';
            if (perguntaProdutorRural) perguntaProdutorRural.style.display = 'none';
        });
    }

    const formCalculoContribuicao = document.getElementById('form-calculo-contribuicao');
    if(formCalculoContribuicao) {
        formCalculoContribuicao.addEventListener('submit', function(event) {
            event.preventDefault();
            alert('Sua solicitação de cálculo foi enviada! Entraremos em contato em breve.');
            formCalculoContribuicao.reset();
        });
    }

    // Atualizar ano no rodapé
    // COMENTÁRIO: Esta lógica pode ser movida para loadComponents.js se o footer for carregado dinamicamente
    // ou mantida aqui se o span #currentYear estiver presente no HTML base de todas as páginas.
    // const currentYearSpan = document.getElementById('currentYear'); 
    // if (currentYearSpan) {
    //     currentYearSpan.textContent = new Date().getFullYear();
    // }

    // TOC (Table of Contents) para páginas de artigo
    const tocList = document.getElementById('toc-list');
    const articleBody = document.querySelector('.article-body-rd'); // Verifique se esta classe ainda é usada
    if (tocList && articleBody) {
        const headings = articleBody.querySelectorAll('h2, h3'); 
        headings.forEach(heading => {
            if(heading.id) { 
                const listItem = document.createElement('li');
                const link = document.createElement('a');
                link.textContent = heading.textContent;
                link.href = '#' + heading.id;
                listItem.appendChild(link);
                tocList.appendChild(listItem);
            }
        });
    }

    // Accordion do Rodapé (RD Station Inspired)
    const footerAccordionButtons = document.querySelectorAll(".footer-rd-inspired .bsc-accordion-button");
    footerAccordionButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (window.innerWidth < 768) {
                const accordionItem = button.closest(".bsc-accordion-item");
                const content = accordionItem.querySelector(".bsc-accordion-content");
                const isExpanded = button.getAttribute("aria-expanded") === "true";
                button.setAttribute("aria-expanded", !isExpanded);
                if (isExpanded) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            }
        });
    });

    function adjustFooterAccordionForDesktop() {
        if (window.innerWidth >= 768) {
            footerAccordionButtons.forEach(button => {
                const content = button.closest(".bsc-accordion-item").querySelector(".bsc-accordion-content");
                button.setAttribute("aria-expanded", "true");
                content.style.maxHeight = content.scrollHeight + "px";
            });
        } else {
            // COMENTÁRIO: Em telas menores, garantir que o accordion esteja fechado por padrão ou conforme o último estado
            footerAccordionButtons.forEach(button => {
                if (button.getAttribute("aria-expanded") !== "true") {
                     const content = button.closest(".bsc-accordion-item").querySelector(".bsc-accordion-content");
                     content.style.maxHeight = null;
                }
            });
        }
    }

    adjustFooterAccordionForDesktop();
    window.addEventListener("resize", adjustFooterAccordionForDesktop);

});

