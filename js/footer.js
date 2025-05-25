/**
 * Scripts do Rodapé
 * Site Cunha Advocacia
 */

// Atualizar ano do copyright
document.addEventListener('DOMContentLoaded', function() {
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
});
