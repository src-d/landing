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
      hasTyped: false,
      success: false,
      errMessage: '',
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
    this.setState({ loading: true, success: false, errMessage: '' })

    inviteToSlack(this.state.endpoint, this.state.email)
      .then(resp => {
        if (resp.status === 200) {
          this.setState({ loading: false, success: true, errMessage: "" });
        } else {
          this.setState({
            loading: false,
            errMessage: "Error! Submit again.",
          });
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

  buttonClasses() {
    const classes = ['send'];

    if (this .state.hasTyped && !this.hasValidEmail()) {
      classes.push('invalid');
    }

    if (this.state.loading) {
      classes.push('loading');
    }

    return classes.join(' ');
  }

  hasValidEmail() {
    return emailRegex.test(this.state.email);
  }

  submitButton() {
    return (
        <button type='submit'
          className={this.buttonClasses()}
          disabled={this.state.loading || !this.hasValidEmail()}>
          <i className='fa fa-slack fa-6' aria-hidden={true}></i>
          <span className='joinUs'>Join us on Slack</span>
          <span className='wait'>Please wait...</span>
        </button>
    );
  }

  render() {
    return (
      <form className='slackForm'
        onSubmit={e => this.invite(e)}>
        <h3 className='title'>{this.state.title}</h3>
        <input type='email'
          placeholder='your@email.com'
          disabled={this.state.loading || this.state.success}
          className='email'
          value={this.state.email}
          onChange={e => this.setState({ hasTyped: true, email: e.target.value })} />

        {this.state.success
            ? <div className='success'>Success! Check your email!</div>
            : this.submitButton()}

        {this.state.errMessage
          ? <div className='error'>{this.state.errMessage}</div>
          : null}

      </form>
    )
  }
}
