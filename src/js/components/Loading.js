import React from 'react'

export function Loading(props) {
  return (
    <div className='loading'>
      <img src='/img/loading.svg' alt="Loading" />
      <p>Loading...</p>
    </div>
  )
}

export function LoadingError(props) {
  return (
    <div className='loading--error'>
      <img src='/img/error.svg' alt="Error" />
      <p>There has been a problem loading the requested data.</p>
    </div>
  )
}
