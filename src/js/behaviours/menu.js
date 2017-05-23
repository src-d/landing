export default function setupMenu() {
    const menuToggle = document.querySelector('#menuToggle')
    const menu = document.querySelector('#menu')
    menuToggle.addEventListener('click', _ => {
        menu.classList.toggle('open')
        menuToggle.classList.toggle('open')
    })
}
