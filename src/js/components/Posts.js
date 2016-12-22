import React, { Component } from 'react'

import { Loading, LoadingError } from './Loading'
import { loadTechPosts, loadNonTechPosts, states } from '../services/api'
import { ago, isNewer, TIME_UNITS } from '../services/dates'

const TECH = 'technical'
const NON_TECH = 'culture'

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

export function TechPosts(props) {
    return <Posts kind={TECH} />
}

export function NonTechPosts(props) {
    return <Posts kind={NON_TECH} />
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
