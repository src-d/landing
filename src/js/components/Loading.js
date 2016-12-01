import React from 'react'

export function Loading({ text }) {
    return (
        <div className='loading'>
            <img src='/img/icons/loading.svg' alt="Loading" />
            <p>{text || 'Loading...'}</p>
        </div>
    )
}

export function LoadingError({ text }) {
    return (
        <div className='loading error'>
            <img src='/img/icons/error.svg' alt="Error" />
            <p>{text || 'There has been a problem loading the requested data.'}</p>
        </div>
    )
}
