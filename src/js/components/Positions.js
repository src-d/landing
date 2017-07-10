import React, { Component } from 'react';

import { Loading, LoadingError } from './Loading';
import { states, loadPositions } from '../services/api';

const ALL_TEAMS = 'All';
const POSITION_URL = 'https://jobs.lever.co/sourced/:positionId';

export default class PositionsMain extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: states.LOADING,
      positions: {
        positions: [],
        teams: [],
      },
    };
  }

  componentWillMount() {
    loadPositions()
      .then(positions => {
        this.setState({
          status: states.LOADED,
          positions: positions,
        });
      })
      .catch(err => {
        console.error(err);
        this.setState({ status: states.ERROR });
      });
  }

  render() {
    return (
      <div>
        <PositionListContainer
          status={this.state.status}
          positions={this.state.positions}
        />
      </div>
    );
  }
}

class PositionListContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterTeam: null,
    };

    this.teamHandler = teamName => () =>
      this.setState({ filterTeam: teamName });
  }

  render() {
    if (this.props.status === states.LOADING) {
      return <Loading />;
    } else if (this.props.status === states.ERROR) {
      return <LoadingError />;
    }

    return (
      <div className="stack mainContainer">
        <h2>Current Openings</h2>
        <Teams
          teams={this.props.positions.teams}
          handler={this.teamHandler}
          active={this.state.filterTeam}
        />
        <Positions
          positions={this.props.positions.positions}
          filterTeam={this.state.filterTeam}
        />
      </div>
    );
  }
}

class Positions extends Component {
  constructor(props) {
    super(props);
    this.positions = props.positions;
  }

  isVisible(position) {
    return (
      !this.props.filterTeam ||
      this.props.filterTeam === ALL_TEAMS ||
      this.props.filterTeam === position.team
    );
  }

  isUnique() {
    return this.positions.length === 1;
  }

  render() {
    return (
      <div className="offerList">
        {this.positions.map((position, i) => {
          return (
            <Position
              key={i}
              data={position}
              enabled={this.isVisible(position)}
              unique={this.isUnique()}
            />
          );
        })}
      </div>
    );
  }
}

function Position({ data, enabled, unique }) {
  return (
    <div
      className={getClass(
        'job',
        unique ? 'unique' : '',
        enabled ? 'show' : 'hide',
      )}
    >
      <a href={getPositionExternalUrl(data)} target="_blank">
        <h3 className="title">
          {data.title}
        </h3>
        <p className="tags">
          <span className="tag">
            {data.team}
          </span>
          <span className="tag">
            {data.location}
          </span>
          <span className="tag">
            {data.commitment}
          </span>
        </p>
        <div className="link">
          <span className="clickable">view & apply</span>
        </div>
      </a>
    </div>
  );
}

class Teams extends Component {
  constructor(props) {
    super(props);
    this.teams = props.teams;
    this.handler = props.handler;
    if (this.teams.length > 1) {
      this.teams = [ALL_TEAMS].concat(this.teams);
    }
  }

  isEnabled(teamName) {
    return (
      (teamName === ALL_TEAMS && !this.props.active) ||
      this.props.active === teamName
    );
  }

  render() {
    if (this.teams.length < 2) {
      return null;
    }

    return (
      <div className="teamList">
        {this.teams.map((team, i) => {
          return (
            <Team
              key={i}
              name={team}
              enabled={this.isEnabled(team)}
              handler={this.handler}
            />
          );
        })}
      </div>
    );
  }
}

function Team({ name, enabled, handler }) {
  return (
    <span
      className={'btn ' + (enabled ? 'selected' : '')}
      onClick={handler(name)}
    >
      {name}
    </span>
  );
}

function getClass() {
  return Array.from(arguments).join(' ');
}

function getPositionExternalUrl(position) {
  return POSITION_URL.replace(':positionId', position.id);
}
