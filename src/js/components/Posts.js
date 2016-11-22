import React, { Component } from 'react'

import { Loading, LoadingError } from './Loading'
import { loadTechPosts, loadBusinessPosts, states } from '../services/api'

const TECH = 'tech'
const BUSINESS = 'business'

class Posts extends Component {
	constructor(props) {
		super(props)
		this.state = {
			state: states.LOADING,
			posts: []
		}
	}

	componentWillMount() {
		const loader = this.props.kind == TECH ? loadTechPosts : loadBusinessPosts
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

export function BusinessPosts(props) {
	return <Posts kind={BUSINESS} />
}

function Post({ post, first }) {
	// TODO: pending until knowing which format date has
	// - NEW badge
	// - Color if new
	// - Real date
	return (
		<div className={'post' + (first ? ' new' : '')}>
			{first ? (
				<span className='tag'>NEW</span>
			) : null}
			<a href={post.link}>{post.title}</a>
			{first ? (
				<span>{post.date}</span>
			) : null}
		</div>
	)
}