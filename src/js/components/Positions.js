import React, { Component } from 'react'

import { Loading, LoadingError } from './Loading'
import { states, loadPositions } from '../services/api'
import SrcdModal from './Modal'

const ALL_TEAMS = 'All'

export default class PositionsContainer extends Component {
    constructor(props) {
        super(props)

        let teamHandler = function(teamName) {
            return () => {
                this.setState({filterTeam: teamName})
            }
        }

        let viewDetails = function(url) {
            return () => {
                this.setState({modalUrl: url})
            }
        }

        this.state = {
            state: states.LOADING,
            positions: [],
            teams: [],
            filterTeam: null,
            modalUrl: null,
        }

        this.teamHandler = teamHandler.bind(this)
        this.viewDetails = viewDetails.bind(this)
    }

    componentWillMount() {
        loadPositions()
            .then(positions => {
                this.setState({
                    state: states.LOADED,
                    positions: positions.positions,
                    teams: positions.teams
                })
            }).catch(err => {
                console.error(err)
                this.setState({ state: states.ERROR })
            })
    }


    render() {
        const { state, positions, teams, filterTeam } = this.state
        if (state === states.LOADING) {
            return <Loading />
        } else if (state === states.ERROR) {
            return <LoadingError />
        }

        return (
            <div>
                <Teams teams={teams} handler={this.teamHandler} active={filterTeam} />
                <Positions positions={positions} filterTeam={filterTeam} handler={this.viewDetails} />
                <SrcdModal modalUrl={this.state.modalUrl} isOpen={false} handler={this.viewDetails}></SrcdModal>
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
            <div id="offerList">
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
            <h3 className="title">
                <span onClick={handler(data.url)}>{data.title}</span>
            </h3>
            <p className="tags">
                <span className="tag">{data.team}</span>
                <span className="tag">{data.location}</span>
                <span className="tag">{data.commitment}</span>
            </p>
            <p className="description">{data.summary}</p>
            <div className="link" onClick={handler(data.url)}>
                <span className="clickable">Learn more</span>
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

function getClass() {
    return Array.from(arguments).join(' ')
}