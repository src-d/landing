import React from 'react';
import PropTypes from 'prop-types';

export function Loading({ text }) {
  return (
    <div className="loading">
      <p>
        {text || 'Loading...'}
      </p>
    </div>
  );
}

Loading.propTypes = {
  text: PropTypes.string.isRequired,
};

export function LoadingError({ text }) {
  return (
    <div className="loading error">
      <p>
        {text || 'There has been a problem loading the requested data.'}
      </p>
    </div>
  );
}

LoadingError.propTypes = {
  text: PropTypes.string.isRequired,
};
