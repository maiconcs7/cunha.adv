/**
 * Script para o Menu Cascata
 * Site Cunha Advocacia
 */

document.addEventListener('DOMContentLoaded', function() {
    initMegaMenu();
});

/**
 * Inicializa o menu cascata
 */
function initMegaMenu() {
    // Seleciona todos os containers de menu cascata
    const cascataContainers = document.querySelectorAll('.cascata-menu-container');
    
    cascataContainers.forEach(container => {
        const menuBtn = container.querySelector('.cascata-menu-btn');
        const menuContent = container.querySelector('.cascata-menu-content');
        const submenuLinks = container.querySelectorAll('.cascata-has-submenu > .cascata-menu-link');
        
        // Controle do menu principal (desktop)
        if (menuBtn && menuContent) {
            // Função para abrir/fechar o menu principal
            const toggleMainMenu = () => {
                const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
                menuBtn.setAttribute('aria-expanded', !isExpanded);
                
                // Fecha todos os submenus quando o menu principal é fechado
                if (isExpanded) {
                    submenuLinks.forEach(link => {
                        link.setAttribute('aria-expanded', 'false');
                    });
                }
            };
            
            // Evento de clique no botão do menu
            menuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleMainMenu();
            });
            
            // Evento de teclado para acessibilidade
            menuBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleMainMenu();
                }
            });
            
            // Fecha o menu ao clicar fora dele
            document.addEventListener('click', (e) => {
                if (!container.contains(e.target) && menuBtn.getAttribute('aria-expanded') === 'true') {
                    toggleMainMenu();
                }
            });
        }
        
        // Controle dos submenus
        submenuLinks.forEach(link => {
            const submenu = link.nextElementSibling;
            
            if (submenu) {
                // Função para abrir/fechar submenu
                const toggleSubmenu = () => {
                    const isExpanded = link.getAttribute('aria-expanded') === 'true';
                    
                    // Em dispositivos móveis, fecha outros submenus
                    if (window.innerWidth <= 991 && !isExpanded) {
                        submenuLinks.forEach(otherLink => {
                            if (otherLink !== link) {
                                otherLink.setAttribute('aria-expanded', 'false');
                            }
                        });
                    }
                    
                    link.setAttribute('aria-expanded', !isExpanded);
                };
                
                // Comportamento diferente para desktop e mobile
                link.addEventListener('click', (e) => {
                    // Em dispositivos móveis, o clique abre/fecha o submenu
                    if (window.innerWidth <= 991) {
                        e.preventDefault();
                        toggleSubmenu();
                    } else {
                        // Em desktop, apenas se for o primeiro clique e não houver href válido
                        if (link.getAttribute('href') === '#') {
                            e.preventDefault();
                        }
                    }
                });
                
                // Eventos de mouse para desktop
                if (window.matchMedia('(min-width: 992px)').matches) {
                    // Área de percepção ampliada - detecta movimento próximo ao item
                    const detectProximity = (e, element, distance = 50) => {
                        const rect = element.getBoundingClientRect();
                        const x = e.clientX;
                        const y = e.clientY;
                        
                        // Verifica se o cursor está próximo ao elemento
                        return (
                            x >= rect.left - distance &&
                            x <= rect.right + distance &&
                            y >= rect.top - distance &&
                            y <= rect.bottom + distance
                        );
                    };
                    
                    // Monitora movimento do mouse para detecção de proximidade
                    document.addEventListener('mousemove', (e) => {
                        const isNearLink = detectProximity(e, link);
                        const isNearSubmenu = submenu ? detectProximity(e, submenu, 10) : false;
                        
                        if (isNearLink || isNearSubmenu) {
                            link.setAttribute('aria-expanded', 'true');
                        } else if (!submenu.contains(e.target) && !link.contains(e.target)) {
                            link.setAttribute('aria-expanded', 'false');
                        }
                    });
                }
                
                // Eventos de teclado para acessibilidade
                link.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleSubmenu();
                        
                        // Foca no primeiro item do submenu quando aberto
                        if (link.getAttribute('aria-expanded') === 'true') {
                            const firstSubmenuLink = submenu.querySelector('.cascata-menu-link');
                            if (firstSubmenuLink) {
                                setTimeout(() => {
                                    firstSubmenuLink.focus();
                                }, 100);
                            }
                        }
                    }
                });
            }
        });
    });
    
    // Animação adicional para o CTA
    const ctaButtons = document.querySelectorAll('.cascata-cta');
    
    ctaButtons.forEach(cta => {
        // Efeito de pulso suave
        let pulseInterval;
        
        const startPulse = () => {
            clearInterval(pulseInterval);
            pulseInterval = setInterval(() => {
                cta.classList.add('pulse');
                setTimeout(() => {
                    cta.classList.remove('pulse');
                }, 1000);
            }, 3000);
        };
        
        const stopPulse = () => {
            clearInterval(pulseInterval);
            cta.classList.remove('pulse');
        };
        
        // Inicia o pulso após um tempo
        setTimeout(startPulse, 2000);
        
        // Para o pulso quando o mouse está sobre o botão
        cta.addEventListener('mouseenter', stopPulse);
        cta.addEventListener('mouseleave', startPulse);
    });
    
    // Ajustes de responsividade
    const handleResize = () => {
        const isMobile = window.innerWidth <= 991;
        
        cascataContainers.forEach(container => {
            const menuBtn = container.querySelector('.cascata-menu-btn');
            
            // Reset de estados em mudanças de tamanho
            if (menuBtn) {
                menuBtn.setAttribute('aria-expanded', 'false');
            }
            
            // Reset de submenus
            const submenuLinks = container.querySelectorAll('.cascata-has-submenu > .cascata-menu-link');
            submenuLinks.forEach(link => {
                link.setAttribute('aria-expanded', 'false');
            });
        });
    };
    
    // Monitora redimensionamento da janela
    window.addEventListener('resize', handleResize);
    
    // Inicialização
    handleResize();
}
