import React, { Component } from 'react'
import { Router, Route, IndexRoute, Link, browserHistory, applyRouterMiddleware } from 'react-router'
import { useScroll } from 'react-router-scroll';

import { Loading, LoadingError } from './Loading'
import { states, loadPositions } from '../services/api'
import Modal from './Modal'

const ALL_TEAMS = 'All'
const CAREER_BASE_URL = '/careers'
const CAREER_POSITION_DESCRIPTION = CAREER_BASE_URL + '/:positionId'
const CAREER_POSITION_APPLY = CAREER_BASE_URL + '/:positionId/apply'
const APPLY_FRAME_URL = 'https://jobs.lever.co/sourced/:positionId/apply'

export default function PositionsRouter() {
    return (
        <Router history={browserHistory} render={applyRouterMiddleware(useScroll(() => [0, 300]))}>
            <Route path={CAREER_BASE_URL} component={PositionsMain}>
                <IndexRoute component={PositionListContainer} />
                <Route path=":positionId" component={PositionDescriptionContainer} />
                <Route path=":positionId/apply" component={PositionApplyContainer} />
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
            modalUrl: null,
        }

        this.teamHandler = teamName => () => this.setState({filterTeam: teamName})
        this.viewDetails = url => () => this.setState({modalUrl: url})
    }

    render() {
        if (this.props.status === states.LOADING) {
            return <Loading />
        } else if (this.props.status === states.ERROR) {
            return <LoadingError />
        }

        return (
            <div className="stack mainContainer">
                <h2>Our Job Opportunities</h2>
                <Teams teams={this.props.positions.teams} handler={this.teamHandler} active={this.state.filterTeam} />
                <Positions positions={this.props.positions.positions} filterTeam={this.state.filterTeam} handler={this.viewDetails} />
                <Modal modalUrl={this.state.modalUrl} isOpen={false} handler={this.viewDetails}></Modal>
            </div>
        )
    }
}

class Positions extends Component {
    constructor(props) {
        super(props)
        this.positions = props.positions
        this.handler = props.handler
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
                            handler={this.handler}
                        />)}
                    )
                }
            </div>
        )
    }
}

function Position({data, enabled, unique, handler}) {
    return (
        <div className={getClass('job', unique ? 'unique' : '', enabled ? 'show' : 'hide')}>
            <Link to={getPositionUrl(CAREER_POSITION_DESCRIPTION, data.id)}>
                <h3 className="title">{data.title}
                </h3>
                <p className="tags">
                    <span className="tag">{data.team}</span>
                    <span className="tag">{data.location}</span>
                    <span className="tag">{data.commitment}</span>
                </p>
                <div className="link">
                    <span className="clickable">Learn more</span>
                </div>
            </Link>
            {/* TODO: DELETE THIS TESTING CODE !!!! */}
            <div className="todoContents">
                <span onClick={handler(data.url)}>popup</span>
                &nbsp;· <a href={'https://jobs.lever.co/sourced/' + data.id} target="_blank">lever</a>
            </div>
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
        let data = findPosition(this.props.positions.positions, this.props.params.positionId)

        if (!data) {
            return null
        }

        return (
            <div className="stack mainContainer positionFullDescription">
                <div className="header">
                    <header className="title">
                        <h2 className="positionTitle">{data.title}</h2>
                        <p className="tags">
                            <span className="tag">{data.team}</span>
                            <span className="tag">{data.location}</span>
                            <span className="tag">{data.commitment}</span>
                        </p>
                    </header>
                    <aside className="apply">
                        <Link
                            to={getPositionUrl(CAREER_POSITION_APPLY, this.props.params.positionId)}
                            className="darkButton secondary"
                        >
                            Apply <span className="desktopOnly">for this job</span>
                        </Link>
                        {/* TODO: DELETE THIS TESTING CODE !!!! */}
                        <a href={'https://jobs.lever.co/sourced/' + data.id + '/apply'} target="_blank" className="todoApply">apply at lever</a>
                    </aside>
                </div>
                <div className="content">
                    <div className="description" dangerouslySetInnerHTML={{__html: data.description}}></div>
                    <Link
                        to={getPositionUrl(CAREER_POSITION_APPLY, this.props.params.positionId)}
                        className="darkButton secondary"
                    >
                        Apply for this job
                    </Link>
                </div>

            </div>
        )
    }
}

class PositionApplyContainer extends Component {
    constructor(props) {
        super(props)
    }

    render(){
        return (
            <div className="stack mainContainer fullWidth">
                <iframe
                    src={getPositionUrl(APPLY_FRAME_URL, this.props.params.positionId)}
                    className="applyFrame"
                ></iframe>
            </div>
        )
    }
}

function getClass() {
    return Array.from(arguments).join(' ')
}

function getPositionUrl(formatString, positionId) {
    return formatString.replace(':positionId', positionId)
}

function findPosition(positions, positionId) {
    return positions.filter(position => position.id===positionId).pop()
}
