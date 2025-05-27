/**
 * Script para carregamento de componentes
 * Site Cunha Advocacia
 */

document.addEventListener('DOMContentLoaded', function() {
    loadComponents();
});

/**
 * Carrega componentes HTML dinamicamente
 */
function loadComponents() {
    // Carregar cabeçalho
    loadComponent('header-placeholder', '/cunha.adv/includes/header.html');
    
    // Carregar rodapé
    loadComponent('footer-placeholder', '/cunha.adv/includes/footer.html');
    
    // Carregar outros componentes conforme necessário
    const componentPlaceholders = document.querySelectorAll('[data-component]');
    componentPlaceholders.forEach(placeholder => {
        const componentPath = placeholder.getAttribute('data-component');
        if (componentPath) {
            loadComponent(placeholder.id, componentPath);
        }
    });
}

/**
 * Carrega um componente HTML específico
 * @param {string} targetId - ID do elemento onde o componente será inserido
 * @param {string} componentPath - Caminho do arquivo HTML do componente
 */
function loadComponent(targetId, componentPath) {
    const targetElement = document.getElementById(targetId);
    
    if (!targetElement) {
        console.error(`Elemento com ID "${targetId}" não encontrado.`);
        return;
    }
    
    fetch(componentPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao carregar componente: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            targetElement.innerHTML = html;
            
            // Executar scripts dentro do componente carregado
            const scripts = targetElement.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                
                // Copiar atributos
                Array.from(script.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });
                
                // Copiar conteúdo
                newScript.textContent = script.textContent;
                
                // Substituir o script original
                script.parentNode.replaceChild(newScript, script);
            });
            
            // Disparar evento de componente carregado
            const event = new CustomEvent('componentLoaded', {
                detail: { id: targetId, path: componentPath }
            });
            document.dispatchEvent(event);
        })
        .catch(error => {
            console.error(`Falha ao carregar componente ${componentPath}:`, error);
            targetElement.innerHTML = `<div class="error-message">Erro ao carregar componente</div>`;
        });
}
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) {
            window.scrollTo({
                top: target.offsetTop - 100, // Compensa altura do cabeçalho
                behavior: 'smooth'
            });
        }
    });
});
