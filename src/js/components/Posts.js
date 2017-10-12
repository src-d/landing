import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { loadPosts, blogUrl } from '../services/api';
import { ago } from '../services/dates';

const POST_TITLE_MAX_LENGTH = 70;

export default class BlogPostsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      title: null,
      moreUrl: null,
      moreText: null,
    };
  }

  componentDidMount() {
    loadPosts(this.props.category.name)
      .then(posts => this.setState({ posts }))
      .then(this.props.onSuccess);
  }

  render() {
    const { posts } = this.state;
    const { title, name, moreText } = this.props.category;
    if (posts.length === 0) {
      return <div />;
    }

    return (
      <div>
        {title
          ? <h2>
            {title}
          </h2>
          : null}
        <div className="cards">
          <div className="cards__wrap">
            {posts.map((p, i) => <Post key={i} post={p} />)}
          </div>
        </div>
        <div className="blog__category__wrapper">
          <a
            href={blogUrl(`categories/${name}`)}
            target="_blank"
            className="btn-pill"
            data-tracked
          >
            {moreText}
          </a>
        </div>
      </div>
    );
  }
}

BlogPostsContainer.propTypes = {
  category: PropTypes.object.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

function ellipsis(text, maxLenght) {
  if (text.length <= maxLenght) {
    return text;
  }

  let cutterPosition = text.indexOf(' ', maxLenght - 1);
  if (cutterPosition === -1) {
    return text;
  }

  const lastChar = text[cutterPosition - 1];
  const removedFromTheEndChars = '.,';
  if (removedFromTheEndChars.indexOf(lastChar) > -1) {
    cutterPosition -= 1;
  }

  return `${text.slice(0, cutterPosition)}\u2026`;
}

function Post({ post }) {
  return (
    <article className="cards__element cards__element_blog">
      <a href={post.link} target="_blank" data-tracked>
        <section>
          <header>
            <div className="cards__element__band" />
            <figure>
              <CardHeaderImage url={post.featured_image} />
            </figure>
            <h1>
              {ellipsis(post.title, POST_TITLE_MAX_LENGTH)}
            </h1>
          </header>
        </section>
        <footer>
          <img src={post.author_avatar} />
          <address>
            <div>
              by <span className="cards__element__link">{post.author}</span>
            </div>
            <time dateTime={post.date}>
              {ago(post.date)}
            </time>
          </address>
        </footer>
        <LinkIcon />
      </a>
    </article>
  );
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
};

function CardHeaderImage({ url }) {
  if (url) {
    return (
      <div
        className="cards__element__img"
        style={{ backgroundImage: `url(${url})` }}
      />
    );
  }
  return (
    <div className="cards__element__img  cards__element__img_default">
      <img src="img/logos/logo-blue.svg" />
    </div>
  );
}

CardHeaderImage.propTypes = {
  url: PropTypes.string.isRequired,
};

/* eslint-disable max-len */
function LinkIcon() {
  return (
    <div className="link-icon">
      <span className="svg-icon svg-icon--go-arrow ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="405.945 282.64 30 30"
        >
          <path d="M420.945 312.593c8.244 0 14.952-6.708 14.952-14.952 0-8.245-6.708-14.952-14.952-14.952-8.245 0-14.952 6.708-14.952 14.952-.001 8.244 6.707 14.952 14.952 14.952zm0-28.797c7.634 0 13.845 6.21 13.845 13.845 0 7.634-6.211 13.845-13.845 13.845s-13.845-6.211-13.845-13.845c0-7.635 6.21-13.845 13.845-13.845z" />
          <path d="M418.813 303.846a.552.552 0 0 0 .783 0l5.814-5.814a.552.552 0 0 0 0-.783l-5.814-5.814a.553.553 0 0 0-.784 0 .554.554 0 0 0 0 .783l5.423 5.423-5.423 5.424a.55.55 0 0 0 .001.781z" />
        </svg>
      </span>
    </div>
  );
}
/* eslint-enable max-len */
