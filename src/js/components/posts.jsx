import React from 'react';
import ReactDOM from 'react-dom';
import fetchAndRender from '../services/renderer.js'

class Posts extends React.Component {
  render() {

    var posts = this.props.data.map(function(post, i) {
      return <Post data={post} key={i} />
    });

    return (
      <div>
        {posts}
      </div>
    );
  }
}

class Post extends React.Component {
  render() {
    var post = this.props.data
    return <div className="repo">
        <div className="name">
            <a href={post.link}>
                {post.title}
            </a>
        </div>
        <span>{post.date}</span>
        <p>{post.description}</p>
    </div>
  }
}

var renderPosts = function(posts, containerId) {
  ReactDOM.render(<Posts data={posts} />, document.getElementById(containerId));
}

fetchAndRender('http://localhost:1313/json/business/', renderPosts, 'businessPosts')
fetchAndRender('http://localhost:1313/json/science/', renderPosts, 'technicalPosts')
