import React from 'react'
import { inviteToSlack } from '../services/api' 

const emailRegex = /^.+@.+\..+$/

export default class SlackForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      loading: false,
    };
  }

  invite(e) {
    e.preventDefault()
    this.setState({ loading: true, errMessage: '' })

    inviteToSlack(this.state.email)
      .then(({ redirectUrl, msg }) => {
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          this.setState({
            loading: false,
            errMessage: msg || 'Server error',
          })
        }
      })
      .catch(err => {
        console.error(err)
        this.setState({
          loading: false,
          errMessage: 'Server error',
        })
      })
  }

  render() {
    return (
      <form className='slackForm' 
        onSubmit={e => this.invite(e)}>
        <h3 className='title'>Want to join the revolution? Join us on Slack today</h3>
        <input type='email' 
          placeholder='your@email.com' 
          disabled={this.state.loading}
          className='email'
          value={this.state.email}
          onChange={e => this.setState({ email: e.target.value })} />

        {this.state.errMessage 
          ? <div className='error'>{this.state.errMessage}</div> 
          : null}

        <button type='submit' 
          className='send' 
          disabled={this.state.loading || !emailRegex.test(this.state.email)}>
          {
            this.state.loading
              ? 'Please wait...'
              : [
                <i className='fa fa-slack fa-6' aria-hidden={true}></i>,
                'Join us on Slack',
              ]
          }
        </button>
      </form>
    )
  }
}
