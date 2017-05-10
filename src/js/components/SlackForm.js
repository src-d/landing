import React from 'react'
import ReactDOM from 'react-dom';
import { inviteToSlack } from '../services/api' 

const emailRegex = /^.+@.+\..+$/

export default class SlackForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      endpoint: '',
      email: '',
      loading: false,
    };
  }

  componentDidMount() {
    this.setState({
      title: ReactDOM.findDOMNode(this).parentNode.dataset.title,
      endpoint: ReactDOM.findDOMNode(this).parentNode.dataset.endpoint,
    });
  }

  invite(e) {
    e.preventDefault()
    this.setState({ loading: true, errMessage: '' })

    inviteToSlack(this.state.endpoint, this.state.email)
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
        <h3 className='title'>{this.state.title}</h3>
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
          className={this.state.loading ? 'send loading' : 'send'}
          disabled={this.state.loading || !emailRegex.test(this.state.email)}>
          <i className='fa fa-slack fa-6' aria-hidden={true}></i>
          <span className='joinUs'>Join us on Slack</span>
          <span className='wait'>Please wait...</span>
        </button>
      </form>
    )
  }
}
