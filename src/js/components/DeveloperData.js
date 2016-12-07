import React, { Component } from 'react'
import { states, sendDeveloperData } from '../services/api'
import Modal from './Modal'
import { Loading, LoadingError } from './Loading'

const notFound = 404

export default class DeveloperData extends Component {
    constructor(props) {
        super(props)
        this.state = {
            state: states.LOADED,
            valid: false,
            email: '',
        }
    }

    onEmailChange(email) {
        this.setState({ email, valid: /^.+@.+\..+$/.test(email), error: null })
    }

    onSubmit(e) {
        e.preventDefault()
        this.setState({ state: states.LOADING })

        sendDeveloperData(this.state.email)
            .then(resp => {
                console.log(resp)
                if (resp.error) {
                    this.setState({
                        state: states.LOAD_ERROR,
                        error: resp.message,
                        valid: false,
                    })
                } else {
                    this.setState({
                        state: states.LOADED,
                        valid: false,
                        email: '',
                        sent: true
                    })

                    setTimeout(_ => this.setState({ sent: false }), 5000)
                }
            })
            .catch(err => {
                console.error(err)
            })
    }

    render() {
        return (
            <Modal>
                <div className='developerDataForm'>
                    <h2>Get your own data</h2>
                    <p>Lorem ipsum dolor sit amet adiscipit constectetur adis elit.</p>

                    {this.state.state === states.LOAD_ERROR ? (
                        <div className='error'>
                            {this.state.error}
                        </div>
                    ) : null}

                    {this.state.sent ? (
                        <div className='success'>
                            Your data has been sent to your email address.
                        </div>
                    ) : null}

                    {this.state.state != states.LOADING ? (
                        <form onSubmit={e => this.onSubmit(e)}>
                            <input type='text'
                                value={this.state.email}
                                className={this.state.valid || this.state.email.trim().length === 0 ? '' : 'invalid'}
                                placeholder='Email address'
                                onChange={e => this.onEmailChange(e.target.value)}
                            />
                            <button className='btnCopy emphasisButton' type='submit' disabled={!this.state.valid}>Send data</button>
                        </form>
                    ) : null}

                    {this.state.state === states.LOADING ? (
                        <Loading />
                    ) : null}
                </div>
            </Modal>
        )
    }
}
