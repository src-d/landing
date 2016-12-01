import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

export default class Modal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			unmounting: false
		}
	}

	componentWillMount() {
		window.addEventListener('keydown', this.onKeyDown.bind(this))
	}

	componentWillUnmount() {
		window.removeEventListener('keydown', this.onKeyDown.bind(this))
	}

	onKeyDown(e) {
		if (e.keyCode === 27) {
			this.unmount()
		}
	}

	unmount() {
		if (this.state.unmounting) return
		this.setState({ unmounting: true })
		setTimeout(_ => ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this.refs.root).parentNode), 700)
	}

	render() {
		return (
			<ReactCSSTransitionGroup
				ref='root'
				transitionName="modal"
				transitionLeaveTimeout={700}
				transitionEnterTimeout={700}
				transitionAppear={true}
				transitionAppearTimeout={700}>
				{this.state.unmounting ? null : (
					<div className="modal" key='root' onClick={_ => this.unmount()}>
						<div className="panel" onClick={e => e.stopPropagation()}>
							<button className="close" onClick={_ => this.unmount()}>
								Close
							</button>

							{this.props.children}
						</div>
					</div>
				)}
			</ReactCSSTransitionGroup>
		)
	}
}