import React, { Component } from 'react'
import { Router, Route, IndexRoute, Link, browserHistory, applyRouterMiddleware } from 'react-router'
import { useScroll } from 'react-router-scroll';

import { Loading, LoadingError } from './Loading'
import { states, loadPositions } from '../services/api'

const ALL_TEAMS = 'All'
const BASE_URL = '/careers'
const POSITION_DESC_PATH = ':name/:positionShortId'
const POSITION_DESC_URL = BASE_URL + '/' + POSITION_DESC_PATH
const POSITION_APPLY_URL = 'https://jobs.lever.co/sourced/:positionId/apply'

export default function PositionsRouter() {
    return (
        <Router history={browserHistory} render={applyRouterMiddleware(useScroll(() => [0, 300]))}>
            <Route path={BASE_URL} component={PositionsMain}>
                <IndexRoute component={PositionListContainer} />
                <Route path={POSITION_DESC_PATH} component={PositionDescriptionContainer} />
            </Route>
        </Router>
    )
}

class PositionsMain extends Component {
    constructor(props) {
        super(props)

        this.state = {
            status: states.LOADING,
            positions: {
                positions: [],
                teams: [],
            },
        }
    }

    componentWillMount() {
        loadPositions()
            .then(positions => {
                this.setState({
                    status: states.LOADED,
                    positions: positions,
                })
            }).catch(err => {
                console.error(err)
                this.setState({ status: states.ERROR })
            })
    }

    children() {
        return React.Children.map(
            this.props.children,
            child => React.cloneElement(child, this.state)
        )
    }

    render () {
        return (
            <div>{this.children()}</div>
        )
    }
}

class PositionListContainer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            filterTeam: null,
        }

        this.teamHandler = teamName => () => this.setState({filterTeam: teamName})
    }

    render() {
        if (this.props.status === states.LOADING) {
            return <Loading />
        } else if (this.props.status === states.ERROR) {
            return <LoadingError />
        }

        return (
            <div className="stack mainContainer">
                <h2>Current Openings</h2>
                <Teams teams={this.props.positions.teams} handler={this.teamHandler} active={this.state.filterTeam} />
                <Positions positions={this.props.positions.positions} filterTeam={this.state.filterTeam} />
            </div>
        )
    }
}

class Positions extends Component {
    constructor(props) {
        super(props)
        this.positions = props.positions
    }

    isVisible(position) {
        return !this.props.filterTeam ||
            this.props.filterTeam === ALL_TEAMS ||
            this.props.filterTeam === position.team
    }

    isUnique() {
        return this.positions.length === 1
    }

    render() {
        return (
            <div className="offerList">
                {this.positions.map((position, i) => {
                    return (
                        <Position key={i}
                            data={position}
                            enabled={this.isVisible(position)}
                            unique={this.isUnique()}
                        />)}
                    )
                }
            </div>
        )
    }
}

function Position({data, enabled, unique}) {
    return (
        <div className={getClass('job', unique ? 'unique' : '', enabled ? 'show' : 'hide')}>
            <Link to={getPositionUrl(data)}>
                <h3 className="title">{data.title}
                </h3>
                <p className="tags">
                    <span className="tag">{data.team}</span>
                    <span className="tag">{data.location}</span>
                    <span className="tag">{data.commitment}</span>
                </p>
                <div className="link">
                    <span className="clickable">view & apply</span>
                </div>
            </Link>
        </div>
    )
}

class Teams extends Component {
    constructor(props) {
        super(props)
        this.teams = props.teams
        this.handler = props.handler
        if (this.teams.length > 1) {
            this.teams = [ALL_TEAMS].concat(this.teams)
        }
    }

    isEnabled(teamName) {
        return (teamName === ALL_TEAMS && !this.props.active) ||
            this.props.active === teamName
    }

    render(){
        if (this.teams.length < 2) {
            return null
        }

        return (
            <div className="teamList">
                {this.teams.map((team, i) => {
                    return (
                        <Team key={i}
                            name={team}
                            enabled={this.isEnabled(team)}
                            handler={this.handler}
                        />
                    )
                })}
            </div>
        )
    }
}

function Team({name, enabled, handler }) {
    return (
        <span className={'btn ' + (enabled ? 'selected' : '')} onClick={handler(name)}>
            {name}
        </span>
    )
}

class PositionDescriptionContainer extends Component {
    constructor(props) {
        super(props)
    }

    render(){
        let data = findPosition(this.props.positions.positions, this.props.params.positionShortId)

        if (!data) {
            return null
        }

        return (
            <div className="stack mainContainer positionFullDescription">
                <div className="header">
                    <header className="title">
                        <h2 className="positionTitle">{data.title}</h2>
                        <div className="tags">
                            <span className="tag">{data.team}</span>
                            <span className="tag">{data.location}</span>
                            <span className="tag">{data.commitment}</span>

                            <aside className="apply">
                                <Link to={BASE_URL} className="back">
                                    See all positions
                                </Link>
                                <a href={getApplyUrl(data)}
                                    className="darkButton secondary" target="_blank"
                                >
                                    Apply <span className="desktopOnly">for position</span>
                                </a>
                            </aside>
                        </div>
                    </header>
                </div>
                <div className="content">
                    <div className="description" dangerouslySetInnerHTML={{__html: data.description}}></div>
                    <a href={getApplyUrl(data)}
                        className="darkButton secondary" target="_blank"
                    >
                        Apply for position
                    </a>
                </div>

            </div>
        )
    }
}


function getClass() {
    return Array.from(arguments).join(' ')
}

function getPositionUrl(position) {
    return POSITION_DESC_URL
        .replace(':name', slugify(position.title))
        .replace(':positionShortId', getFirstGroup(position.id))
}

function getApplyUrl(position) {
    return POSITION_APPLY_URL.replace(':positionId', position.id)
}

function findPosition(positions, positionShortId) {
    return positions.filter(position => getFirstGroup(position.id)===positionShortId).pop()
}

function slugify(input) {
    return input
        .toString()
        .trim()
        .toLowerCase()
        .replace(/&/g, '-and-')
        .replace(/[\W_]/g, '-')
        .replace(/-{2,}/g, '-')
        .replace(/(^-|-$)/g, '');
}

function getFirstGroup(uuid) {
    let candidate = uuid.split('-').shift()
    return candidate.length === 8 ? candidate : uuid
}
