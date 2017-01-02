import React, { Component } from 'react'

import { Loading, LoadingError } from './Loading'
import { states, loadPositions } from '../services/api'

const ALL_TEAMS = 'All'

export default class PositionsContainer extends Component {
    constructor(props) {
        super(props)

        let teamHandler = function(teamName) {
            return () => {
                this.setState({filterTeam: teamName})
            }
        }

        this.state = {
            state: states.LOADING,
            positions: [],
            teams: [],
            filterTeam: null
        }

        this.teamHandler = teamHandler.bind(this)
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
                <Positions positions={positions} filterTeam={filterTeam} />
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
            <div id="offerList">
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
        <div
            className={'job ' + (unique ? 'unique' : '')}
            style={{display:enabled ? 'inline-block' : 'none'}}
        >
            <h3 className="title">
                <a href={data.url} target="_blank">{data.title}</a>
            </h3>
            <p className="tags">
                <span className="tag">{data.team}</span>
                <span className="tag">{data.location}</span>
                <span className="tag">{data.commitment}</span>
            </p>
            <p className="description">{data.summary}</p>
            <div className="link"><a href={data.url} target="_blank">Learn more</a></div>
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
