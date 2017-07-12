import React, { Component } from 'react';

import { Loading, LoadingError } from './Loading';
import { states, loadPositions } from '../services/api';

const ALL_TEAMS = 'All';
const POSITION_URL = 'https://jobs.lever.co/sourced/:positionId';

export default class PositionsPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: states.LOADING,
      filterBy: ALL_TEAMS,
      positions: {
        positions: [],
        teams: []
      }
    };
  }

  componentWillMount() {
    loadPositions()
      .then(positions => {
        this.setState({
          status: states.LOADED,
          positions: positions
        });
      })
      .catch(err => {
        console.error(err);
        this.setState({ status: states.ERROR });
      });
  }

  onTeamSelected(team) {
    this.setState({ filterBy: team });
  }

  render() {
    const { status, positions: { positions, teams }, filterBy } = this.state;
    if (status === states.LOADING) {
      return <Loading />;
    } else if (status === states.ERROR) {
      return <LoadingError />;
    }

    return (
      <div className="positions">
        <TeamSelector
          teams={teams}
          onTeamSelected={team => this.onTeamSelected(team)}
          active={filterBy}
        />
        <Positions positions={positions} filterBy={filterBy} />
      </div>
    );
  }
}

function Positions({ positions, filterBy }) {
  const positionList = positions.filter(
    p => p.team === filterBy || filterBy === ALL_TEAMS
  );

  return (
    <div className="positions__list cards">
      {positionList.map((position, i) => <Position key={i} data={position} />)}
    </div>
  );
}

function Position({ data }) {
  return (
    <div className="positions__job cards__element">
      <a href={getPositionExternalUrl(data)} target="_blank">
        <section>
          <header className="positions__job__header">
            <figure>
              <img
                src={`/img/icons/teams/${data.team.toLowerCase()}.svg`}
                alt=""
              />
            </figure>
            <h1>
              {data.title}
            </h1>
          </header>
        </section>
        <footer className="positions__job__footer">
          <ul className="positions__job__features">
            {['team', 'location', 'commitment'].map((feature, i) =>
              <li
                key={i}
                className={`positions__job__feature positions__job__feature_${feature}`}
              >
                {data[feature]}
              </li>
            )}
          </ul>
          <div className="positions__job__actions">
            <button className="positions__job__apply">view & apply</button>
          </div>
        </footer>
      </a>
    </div>
  );
}

function TeamSelector({ teams, active, onTeamSelected }) {
  if (teams.length <= 1) {
    return null;
  }

  return (
    <div className="positions__teams">
      {[ALL_TEAMS].concat(teams).map((team, i) =>
        <button
          className={`positions__teams__team ${team === active
            ? 'positions__teams__team_active'
            : ''}`}
          key={i}
          onClick={() => onTeamSelected(team)}
        >
          {team}
        </button>
      )}
    </div>
  );
}

function getPositionExternalUrl(position) {
  return POSITION_URL.replace(':positionId', position.id);
}
