import React from 'react';

export function Loading({ text }) {
  return (
    <div className="loading">
      <p>
        {text || 'Loading...'}
      </p>
    </div>
  );
}

export function LoadingError({ text }) {
  return (
    <div className="loading error">
      <p>
        {text || 'There has been a problem loading the requested data.'}
      </p>
    </div>
  );
}
