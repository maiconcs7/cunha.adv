const navMenu = document.querySelector('.main-nav') // Ou seletor correto do seu menu
const menuToggle = document.querySelector('.menu-toggle')

menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true'
    menuToggle.setAttribute('aria-expanded', !isExpanded)
    navMenu.classList.toggle('active') // Classe que controla a visibilidade
    menuToggle.classList.toggle('active')
})
