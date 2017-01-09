import React, { Component } from 'react'

import { Loading, LoadingError } from './Loading'
import { loadTechPosts, loadNonTechPosts, states } from '../services/api'
import { ago, isNewer, TIME_UNITS } from '../services/dates'

const TECH = 'technical'
const NON_TECH = 'culture'

export default class BlogPostsContainer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            ['error_' + TECH]: false,
            ['error_' + NON_TECH]: false
        }

        this.notifyError = (which) => {
            console.warn('Error found in Post section "' + which +'"')
            this.setState({['error_' + which]: true})
        }
    }


    render() {
        if (this.state['error_' + TECH] && this.state['error_' + NON_TECH]) {
            console.warn('BlogPost section hided')
            return null
        }

        return (
            <aside className="fullWidth" id="ourPosts">
                <div className="mainContainer">
                    <header>
                        <h2>Sharing our journey and work with the world</h2>
                    </header>
                    <div className="columns">
                        <section>
                            <h3 className="title">Our journey</h3>
                            <div className="postColumn" id="non-tech-posts">
                                <Posts kind={NON_TECH} errorHandler={this.notifyError} />
                            </div>
                        </section>
                        <section>
                            <h3 className="title">Technical posts</h3>
                            <div className="postColumn" id="tech-posts">
                                <Posts kind={TECH} errorHandler={this.notifyError} />
                            </div>
                        </section>
                    </div>
                </div>
            </aside>
        )
    }
}

class Posts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            state: states.LOADING,
            posts: []
        }
    }

    componentWillMount() {
        const loader = this.props.kind == TECH ? loadTechPosts : loadNonTechPosts
        loader()
            .then(posts => this.setState({ state: states.LOADED, posts }))
            .catch(err => {
                console.error(err)
                this.setState({ state: states.ERROR })
                this.props.errorHandler(this.props.kind)
            })
    }

    render() {
        const { state, posts } = this.state
        if (state === states.LOADING) {
            return <Loading />
        } else if (state === states.ERROR) {
            return <LoadingError />
        }

        return (
            <div className='posts'>
                {posts.map((p, i) => <Post key={i} first={i === 0} post={p} />)}
            </div>
        )
    }
}

function Post({ post, first }) {
    return (
        <div className={'post' + (first && isNewer(post.date, 2 * TIME_UNITS['week']) ? ' new' : '')}>
            <a href={post.link} target="_blank">{post.title}</a>
            {first ? (
                <span className='timeAgo'>Published {ago(post.date)} ago</span>
            ) : null}
        </div>
    )
}
