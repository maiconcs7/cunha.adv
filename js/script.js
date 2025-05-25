/**
 * Script principal do site
 * Cunha Advocacia
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicialização de todos os componentes
    initHeader();
    initFooter();
    initWhatsApp();
    initScrollEffects();
    initActiveLinks();
});

/**
 * Inicializa funcionalidades do cabeçalho
 */
function initHeader() {
    // Menu mobile toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const navOverlay = document.querySelector('.nav-overlay');
    
    if (menuToggle && navList && navOverlay) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            
            if (!isExpanded) {
                navList.classList.add('active');
                navOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                navList.classList.remove('active');
                navOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Fechar menu ao clicar no overlay
        navOverlay.addEventListener('click', function() {
            navList.classList.remove('active');
            navOverlay.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    }
}

/**
 * Inicializa funcionalidades do rodapé
 */
function initFooter() {
    // Atualizar ano do copyright
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Newsletter Form
    const newsletterForm = document.getElementById('footer-newsletter');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const form = e.target;
            const email = form.email.value;
            const feedback = document.getElementById('newsletter-feedback');
            
            // Simples validação de email
            if (!email || !email.includes('@') || !email.includes('.')) {
                feedback.textContent = 'Por favor, insira um email válido.';
                feedback.style.display = 'block';
                feedback.style.color = '#ff6b6b';
                return;
            }
            
            // Aqui você pode adicionar o código para enviar o email para seu backend
            // Por enquanto, apenas simulamos uma resposta de sucesso
            
            // Simulação de envio (remover em produção)
            feedback.textContent = 'Obrigado! Você foi inscrito com sucesso.';
            feedback.style.display = 'block';
            feedback.style.color = '#2ecc71';
            form.reset();
            
            // Ocultar a mensagem após 5 segundos
            setTimeout(() => {
                feedback.style.display = 'none';
            }, 5000);
        });
    }
}

/**
 * Inicializa funcionalidades do WhatsApp
 */
function initWhatsApp() {
    // Botão flutuante do WhatsApp
    const whatsappFloat = document.querySelector('.whatsapp-float');
    
    // Mostrar botão apenas após rolagem
    if (whatsappFloat) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                whatsappFloat.style.display = 'flex';
            } else {
                whatsappFloat.style.display = 'none';
            }
        });
    }
}

/**
 * Inicializa efeitos de rolagem
 */
function initScrollEffects() {
    // Animação de elementos ao rolar a página
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animatedElements.length > 0) {
        // Função para verificar se elemento está visível
        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
            );
        }
        
        // Verificar elementos visíveis
        function checkVisibility() {
            animatedElements.forEach(element => {
                if (isElementInViewport(element)) {
                    element.classList.add('animated');
                }
            });
        }
        
        // Verificar na carga inicial e ao rolar
        window.addEventListener('load', checkVisibility);
        window.addEventListener('scroll', checkVisibility);
    }
    
    // Rolagem suave para links internos
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Inicializa links ativos no menu
 */
function initActiveLinks() {
    // Marcar link ativo no menu
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link[data-page-name]');
    
    navLinks.forEach(link => {
        const pageName = link.getAttribute('data-page-name');
        
        if (currentPage.includes(pageName)) {
            link.classList.add('active');
        }
    });
}
