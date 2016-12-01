import React, { Component } from 'react'
import { states } from '../services/api'
import Modal from './Modal'
import { Loading, LoadingError } from './Loading'

const newField = validator => ({ valid: true, validator, value: '' })
const notEmpty = s => s.trim().length > 0
const isEmail = e => /^.+@.+\..+$/.test(e)

function Input({ field, onChange, placeholder }) {
	const { valid, value } = field
	return (
		<input type='text'
			onChange={onChange}
			placeholder={placeholder}
			className={valid ? '' : 'invalid'} />
	)
}

export default class WaitingList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			state: states.LOADED,
			complete: false,
			data: {
				name: newField(notEmpty),
				company: newField(notEmpty),
				email: newField(isEmail),
			}
		}
	}

	onInputChange(name, value) {
		let data = Object.assign({}, this.state.data)
		data[name].value = value
		if (notEmpty(value)) {
			data[name].valid = data[name].validator(value)
		} else {
			data[name].valid = true
		}

		const complete = Object.keys(data)
			.map(k => data[k])
			.every(f => notEmpty(f.value) && f.valid)

		this.setState({ data, complete })
	}

	onSubmit() {
		this.setState({ state: states.LOADING })

		// TODO: Submit data
	}

	render() {
		const onFieldChange = name => e => this.onInputChange(name, e.target.value)
		return (
			<Modal>
				<div className='waitingList'>
					<h2>Join the waiting list</h2>
					<p>Lorem ipsum dolor sit amet adiscipit constectetur adis elit.</p>

					{this.state.state === states.LOADED ? (
						<form onSubmit={e => { e.preventDefault(); this.onSubmit() } }>
							<Input placeholder='Your name'
								field={this.state.data.name}
								onChange={onFieldChange('name')} />

							<Input placeholder='Company name'
								field={this.state.data.company}
								onChange={onFieldChange('company')} />

							<Input placeholder='Email address'
								field={this.state.data.email}
								onChange={onFieldChange('email')} />

							<button type='submit' className='btnBlue' disabled={!this.state.complete}>Join the waiting list</button>
						</form>
					) : null}

					{this.state.state === states.LOADING ? (
						<Loading />
					) : null}

					{this.state.state === states.ERROR ? (
						<LoadingError text='There has been a problem adding you to the waiting list.' />
					) : null}
				</div>
			</Modal>
		)
	}
}