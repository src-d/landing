import React from 'react'

export function Loading(props) {
  return (
    <div className='loading'>
      {/* TODO: Loading GIF */}
      <span>Loading...</span>
    </div>
  )  
}

export function LoadingError(props) {
  return (
    <div className='loading--error'>
      {/* TODO: ERROR image */}
      <span>There has been a problem loading the requested data.</span>
    </div>
  )
}
