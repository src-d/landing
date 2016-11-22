import Clipboard from 'clipboard'

export default function setupClipboard() {
	const clipboard = new Clipboard('.copy-btn')

	clipboard.on('success', e => {
		window.event.preventDefault()
		e.trigger.classList.add('show-tooltip');
		setTimeout(_ => e.trigger.classList.remove('show-tooltip'), 2000)
	})
}