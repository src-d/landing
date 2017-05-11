function setupStickyHeader() {
    const topBar = document.querySelector('#topBar')
    const offset = 50
    if (topBar.classList.contains("opaque")) { return }

    checkTopbarOpacity(topBar, offset)
    window.addEventListener('scroll', _ => checkTopbarOpacity(topBar, offset))
}

function checkTopbarOpacity(topBar, opaqueAtOffset) {
    if (window.pageYOffset > opaqueAtOffset) {
        topBar.classList.add('opaque')
    } else {
        topBar.classList.remove('opaque')
    }
}

function setupSlider() {
  $('.projects').slick({
    infinite: true,
    dots: true,
    autoplay: true,
    autoplaySpeed: 8000,
  });
}
