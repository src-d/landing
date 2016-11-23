import Clipboard from 'clipboard'

export default function setupClipboard() {
    const clipboard = new Clipboard('.copyBtn')

    clipboard.on('success', e => {
        window.event.preventDefault()
        e.trigger.classList.add('show');
        setTimeout(_ => e.trigger.classList.remove('show'), 2000)
    })
}