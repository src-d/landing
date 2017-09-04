import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import { inviteToSlack } from '../services/api';
import { gaPromise as ga } from '../services/link_track';

const emailRegex = /^.+@.+\..+$/;

export default class SlackForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      errMessage: '',
      hasTyped: false,
      loading: false,
      success: false,
    };
  }

  invite(e) {
    e.preventDefault();

    if (!this.state.hasTyped) {
      this.input.focus();
    } else {
      this.setState({ loading: true, success: false, errMessage: '' });
      ga('send', 'event', {
        eventCategory: 'joinSlack',
        eventAction: 'button_click',
        eventLabel: 'slackButton',
      });
      inviteToSlack(this.props.endpoint, this.state.email)
        .then((resp) => {
          if (resp.status === 200) {
            this.setState({ loading: false, success: true, errMessage: '' });
          } else {
            this.setState({
              loading: false,
              errMessage: this.props.serverError,
            });
          }
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error(err);
          this.setState({
            loading: false,
            errMessage: this.props.fetchError,
          });
        });
    }
  }

  get horizontal() {
    return ['true', 'horizontal'].includes(this.props.horizontal);
  }

  get buttonClasses() {
    const classes = ['send'];

    if (this.state.hasTyped && !this.hasValidEmail()) {
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

  get responseMessage() {
    if (this.state.success) {
      return this.props.success;
    }

    if (this.state.errMessage !== '') {
      return this.state.errMessage;
    }

    return '';
  }

  get bodyClasses() {
    const classes = ['slackForm__body'];

    if (this.state.success) {
      classes.push('slackForm__body_success');
    }

    if (this.state.errMessage !== '') {
      classes.push('slackForm__body_error');
    }

    return classes.join(' ');
  }

  get messageClasses() {
    const classes = ['slackForm__message'];

    if (this.state.success) {
      classes.push('slackForm__message_success');
    }

    if (this.state.errMessage !== '') {
      classes.push('slackForm__message_error');
    }

    return classes.join(' ');
  }

  get isButtonDisabled() {
    if (this.state.hasTyped) {
      return this.state.loading || this.state.success || !this.hasValidEmail();
    }

    return false;
  }

  get descriptionParagraph() {
    if (this.props.desc) {
      return (
        <p className="slackForm__description">
          {this.props.desc}
        </p>
      );
    }

    return null;
  }

  get formClasses() {
    const classes = ['slackForm'];

    if (this.horizontal) {
      classes.push('slackForm--horizontal');
    } else {
      classes.push('slackForm--vertical');
    }

    return classes.join(' ');
  }

  render() {
    return (
      <form className={this.formClasses} onSubmit={e => this.invite(e)}>
        <header className="slackForm__header">
          <img
            className="slackForm__logo"
            src={this.props.logo}
            alt="Join us un Slack"
          />
          <h2 className="slackForm__title">
            {this.props.title}
          </h2>
          {this.descriptionParagraph}
        </header>

        <div className={this.bodyClasses}>
          <label className="slackForm__label">
            {this.props.placeholder}
          </label>
          <input
            className="slackForm__input"
            disabled={this.state.loading || this.state.success}
            placeholder={this.props.placeholder}
            onChange={e =>
              this.setState({ hasTyped: true, email: e.target.value })}
            ref={input => (this.input = input)}
            type="text"
          />
          <button
            disabled={this.isButtonDisabled}
            className="slackForm__submit btn-pill btn-pill--white"
          >
            {this.props.button}
          </button>

          <ReactMarkdown
            source={this.responseMessage}
            className={this.messageClasses}
            softBreak="br"
          />
        </div>
      </form>
    );
  }
}

SlackForm.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  endpoint: PropTypes.string.isRequired,

  success: PropTypes.string.isRequired,
  button: PropTypes.string.isRequired,
  serverError: PropTypes.string.isRequired,
  fetchError: PropTypes.string.isRequired,

  logo: PropTypes.string.isRequired,
  horizontal: PropTypes.string.isRequired,
};
