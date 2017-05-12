import React, { Component } from 'react'

import Repository from './Repository'
import { Loading, LoadingError } from './Loading'
import { loadMainRepos, loadOtherRepos, states } from '../services/api'

export default class RepositoriesContainer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            'error_main': false,
            'error_other': false,
        }

        this.notifyError = (which) => {
            console.warn('Error found in Respositories section "' + which +'"')
            this.setState({['error_' + which]: true})
        }
    }

    render() {
        if (this.state['error_main'] && this.state['error_other']) {
            console.warn('Repositories section hided')
            return null
        }

        return (
            <section className="fullWidth" id="ourOpenSource">
                <div className="mainContainer">
                    <header>
                        <h2>Committed to open source and its community</h2>
                    </header>
                    <h3 className="subTitle">Open Source Projects</h3>
                    <div id="repositories" className="fullWidthitories">
                        <Repositories errorHandler={this.notifyError} />
                    </div>
                </div>
            </section>
        )
    }
}

class Repositories extends Component {
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
                this.props.errorHandler(kind)
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
                <h3 className='subTitle'>Projects our engineers have contributed to during Open Source Fridays</h3>
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
