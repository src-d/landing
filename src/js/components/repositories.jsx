import React from 'react';
import ReactDOM from 'react-dom';
import fetchAndRender from '../services/renderer.js'

class Repositories extends React.Component {
  render() {

    var repos = this.props.data.map(function(repo, i) {
      return <Repository data={repo} key={i} />
    });

    return (
      <div>
        {repos}
      </div>
    );
  }
}

class Repository extends React.Component {
  render() {
    var repo = this.props.data
    return <div className="repo">
        <div className="name">
            <a href={repo.URL}>
                <span>{repo.Owner}</span>/<span>{repo.Name}</span>
            </a>
        </div>
        <p>{repo.Description}</p>
        <div className="summary"><span>{repo.Stars} stars</span> <span>{repo.Lang}</span></div>
    </div>
  }
}

var renderRepos = function(repos, containerId) {
  ReactDOM.render(<Repositories data={repos} />, document.getElementById(containerId));
}

fetchAndRender('http://localhost:8080/repositories/main', renderRepos, 'openSourceMain')
fetchAndRender('http://localhost:8080/repositories/other', renderRepos, 'openSourceOther')
