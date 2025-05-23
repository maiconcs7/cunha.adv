/**** Lógica Aprimorada para o Mega Menu ****/
document.addEventListener("DOMContentLoaded", function() {
    const breakpointMobile = 991; // Atualizado para match com CSS
    const transitionDuration = 300; // ms

    // Cache de elementos
    const dom = {
        megaContainers: document.querySelectorAll(".mega-menu-container"),
        menuToggle: document.querySelector('.menu-toggle'),
        mainNav: document.querySelector('.main-nav'),
        navOverlay: document.querySelector('.nav-overlay'),
        body: document.body
    };

    // Controle do Mega Menu
    const initMegaMenu = (container) => {
        const mainItems = container.querySelectorAll(".mega-menu-main-item");
        const subMenus = container.querySelectorAll(".mega-submenu");

        const isTouchDevice = () => window.matchMedia("(hover: none)").matches;

        const handleHover = (item) => {
            if(isTouchDevice()) return;

            item.addEventListener("mouseenter", function() {
                resetActiveItems(container);
                this.classList.add("active-main-item");
                toggleSubmenu(this.dataset.submenu, true);
            });

            container.addEventListener("mouseleave", () => resetActiveItems(container));
        };

        const handleTouch = (item) => {
            item.addEventListener("click", (e) => {
                if(window.innerWidth > breakpointMobile) return;
                e.preventDefault();
                const isActive = item.classList.contains("active-main-item");
                resetActiveItems(container);
                !isActive && item.classList.add("active-main-item");
                toggleSubmenu(item.dataset.submenu, !isActive);
            });
        };

        const resetActiveItems = (container) => {
            container.querySelectorAll(".active-main-item, .active").forEach(el => {
                el.classList.remove("active-main-item", "active");
            });
        };

        const toggleSubmenu = (submenuId, show) => {
            const targetSubmenu = submenuId && container.querySelector("#" + submenuId);
            if(targetSubmenu) {
                targetSubmenu.style.transition = `opacity ${transitionDuration}ms`;
                targetSubmenu.classList.toggle("active", show);
            }
        };

        mainItems.forEach(item => {
            handleHover(item);
            handleTouch(item);
        });
    };

    // Controle do Menu Mobile
    const initMobileMenu = () => {
        if(!dom.menuToggle) return;

        const toggleMenu = (show) => {
            const isExpanded = show ?? dom.menuToggle.getAttribute("aria-expanded") === "false";
            dom.menuToggle.setAttribute("aria-expanded", isExpanded);
            dom.mainNav.classList.toggle("active", isExpanded);
            dom.body.classList.toggle("menu-open", isExpanded);
            dom.navOverlay.classList.toggle("active", isExpanded);
            
            if(!isExpanded) closeAllSubmenus();
        };

        const closeOn = {
            overlayClick: () => toggleMenu(false),
            escapeKey: (e) => e.key === "Escape" && toggleMenu(false),
            resize: () => window.innerWidth > breakpointMobile && toggleMenu(false),
            linkClick: (e) => window.innerWidth <= breakpointMobile && toggleMenu(false)
        };

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
