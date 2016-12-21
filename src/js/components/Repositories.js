import React, { Component } from 'react'

import Repository from './Repository'
import { Loading, LoadingError } from './Loading'
import { loadMainRepos, loadOtherRepos, states } from '../services/api'

export default class Repositories extends Component {
    constructor(props) {
        super(props)

        this.state = {
            main: {
                state: states.LOADING,
                repos: [],
            },
            other: {
                state: states.LOADING,
                repos: [],
            },
        }
    }

    componentWillMount() {
        this.loadRepos('main', loadMainRepos)
        this.loadRepos('other', loadOtherRepos)
    }

    loadRepos(kind, loader) {
        loader()
            .then(repos => this.setRepos(kind, repos))
            .catch(err => {
                console.error(err)
                this.setReposState(kind, states.ERROR)
            })
    }

    setReposState(kind, state) {
        this.setState({
            [kind]: Object.assign({}, this.state[kind], { state })
        })
    }

    setRepos(kind, repos) {
        this.setState({
            [kind]: {
                state: states.LOADED,
                repos
            }
        })
    }

    renderOther() {
        const { state, repos } = this.state.other
        if (state === states.LOADING) {
            return <Loading />
        } else if (state === states.ERROR) {
            return <LoadingError />
        }

        return (
            <div className='repositories other'>
                <h3 className='subTitle'>Cool projects our engineers have developed during Open Source Fridays</h3>
                <div className='repositoryList other'>
                    {repos.map((r, i) => <Repository key={i} repo={r} />)}
                </div>
            </div>
        )
    }

    render() {
        const { displayOther } = this.state
        const { state, repos } = this.state.main
        if (state === states.LOADING) {
            return <Loading />
        } else if (state === states.ERROR) {
            return <LoadingError />
        }

        let otherContent = null

        return (
            <div className='repositories'>
                <div className='repositoryList main'>
                    {repos.map((r, i) => <Repository key={i} repo={r} />)}
                </div>

                { this.renderOther() }
            </div>
        )
    }
}
