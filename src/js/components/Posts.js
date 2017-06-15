import React, { Component } from 'react'
import ReactDOM from 'react-dom';

import { loadPosts, states, blogUrl } from '../services/api'
import { ago, isNewer, TIME_UNITS } from '../services/dates'

export default class BlogPostsContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      posts: [],
      title: null,
      moreUrl: null,
      moreText: null,
    }
  }

  componentDidMount() {
    loadPosts(this.props.category.name)
      .then(posts => this.setState({ posts }))
      .then(this.props.onSuccess)
  }

  render() {
    const {posts} = this.state
    const {title, name, moreText} = this.props.category;
    if (posts.length == 0) {
      return <div></div>
    }

    return (
      <div>
          <h2>{title}</h2>
          <div className="cards">
              {posts.map((p, i) => <Post key={i} first={i === 0} post={p} />)}
          </div>
          <div className="blog__category__wrapper">
              <a href={blogUrl('categories/' + name)} target="_blank" className="btn-pill">
                  {moreText}
              </a>
          </div>
      </div>
    )
  }
}

function Post({ post, first }) {
  return (
    <article className="cards__element cards__element_blog">
        <a href={post.link} target="_blank">
            <header>
                <figure>
                    <CardHeaderImage url={post.featured_image} />
                </figure>
                <h1>{post.title}</h1>
            </header>
            <footer>
                <img src={post.author_avatar} />
                <address>
                    <div>by <span className="cards__element__link">{post.author}</span></div>
                    <time dateTime={post.date}>{ago(post.date)}</time>
                </address>
            </footer>
        </a>
    </article>
  )
}

function CardHeaderImage({url}) {
  if (Boolean(url)) {
    return (
      <div className="cards__element__img"
        style={{backgroundImage: 'url(' + url + ')'}}
      />
    )
  } else {
      return (
        <div className="cards__element__img  cards__element__img_default">
            <img src="/img/logos/logo-blue.svg" />
        </div>
      )
  }
}
