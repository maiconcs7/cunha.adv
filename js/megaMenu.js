document.addEventListener("DOMContentLoaded", function() {
    const menuItems = document.querySelectorAll('.mega-menu-main-item');
    let activeItem = null;
    let clickTimer = null;

    // Controle de hover desktop
    const handleHover = (item) => {
        item.addEventListener('mouseenter', () => {
            if(window.innerWidth > 991 && activeItem !== item) {
                activateMenuItem(item);
            }
        });
    };

    // Controle de toque/clique mobile
    const handleClick = (item) => {
        item.addEventListener('click', (e) => {
            // Double click/tap
            if(e.detail === 2 && item.classList.contains('active-main-item')) {
                window.location.href = item.href;
                return;
            }

            // Single click/tap
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => {
                if(window.innerWidth <= 991 || activeItem === item) {
                    toggleMenuItem(item);
                } else {
                    activateMenuItem(item);
                }
            }, 200);
        });
    };

    // Ativa um item e fecha outros
    const activateMenuItem = (item) => {
        if(activeItem && activeItem !== item) {
            closeMenuItem(activeItem);
        }
        activeItem = item;
        item.classList.add('active-main-item');
        const submenu = document.getElementById(item.dataset.submenu);
        if(submenu) submenu.classList.add('active');
    };

    // Toggle do item
    const toggleMenuItem = (item) => {
        if(item.classList.contains('active-main-item')) {
            closeMenuItem(item);
        } else {
            activateMenuItem(item);
        }
    };

    // Fecha item específico
    const closeMenuItem = (item) => {
        item.classList.remove('active-main-item');
        const submenu = document.getElementById(item.dataset.submenu);
        if(submenu) submenu.classList.remove('active');
        if(activeItem === item) activeItem = null;
    };

    // Fecha ao clicar fora
    document.addEventListener('click', (e) => {
        if(!e.target.closest('.mega-menu-main-item') && activeItem) {
            closeMenuItem(activeItem);
        }
    });

    // Inicialização
    menuItems.forEach(item => {
        handleHover(item);
        handleClick(item);
        
        // Fecha ao passar para outro item (desktop)
        item.addEventListener('mouseenter', () => {
            if(window.innerWidth > 991 && activeItem && activeItem !== item) {
                activateMenuItem(item);
            }
        });
    });

    // Adaptação para mobile
    window.addEventListener('resize', () => {
        if(window.innerWidth > 991) {
            menuItems.forEach(closeMenuItem);
        }
    });
});

        // Eventos
        dom.menuToggle.addEventListener("click", () => toggleMenu());
        dom.navOverlay.addEventListener("click", closeOn.overlayClick);
        window.addEventListener("resize", closeOn.resize);
        document.addEventListener("keydown", closeOn.escapeKey);
        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", closeOn.linkClick);
        });
    };

    // Funções auxiliares
    const closeAllSubmenus = () => {
        document.querySelectorAll(".mega-submenu.active").forEach(menu => {
            menu.classList.remove("active");
        });
        document.querySelectorAll(".dropbtn").forEach(btn => {
            btn.setAttribute("aria-expanded", "false");
        });
    };

    // Inicialização
    dom.megaContainers.forEach(initMegaMenu);
    initMobileMenu();

    // Garantir fechamento ao recarregar
    window.addEventListener("beforeunload", () => {
        dom.body.classList.remove("menu-open");
        closeAllSubmenus();
    });
});
