import Clipboard from 'clipboard'

const mobileBreakpoint = 768

function makeClipboard() {
    const clipboard = new Clipboard('.copyBtn')

    clipboard.on('success', e => {
        window.event.preventDefault()
        e.trigger.classList.add('show')
        setTimeout(_ => e.trigger.classList.remove('show'), 2000)
    })

    return clipboard
}

export default function setupClipboard() {
    let clipboard
    
    function toggleClipboard() {
        if (window.innerWidth > mobileBreakpoint && !clipboard) {
            clipboard = makeClipboard()
        } else if (window.innerWidth <= mobileBreakpoint && clipboard) {
            clipboard.destroy()
            clipboard = null
        }
    }

    toggleClipboard()
    window.addEventListener('resize', toggleClipboard)
}
