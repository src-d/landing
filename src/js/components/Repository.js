import React from 'react'

const languageColors = {
  Go: '#375EAB',
  JavaScript: '#F1E05A'
}

export default function Repository({ repo }) {
  return (
    <div className='repo'>
      <a href={repo.URL}>
        <span className='repo__owner'>{repo.FullName.split('/')[0]}</span>
        <span className='repo__divider'>/</span>
        <span className='repo__name'>{repo.Name}</span>
      </a>
      <p className='repo__description'>
        {repo.Description}
      </p>
      <div className='repo__data'>
        <div className='repo__stars'>
          <img src='/img/star.svg' />
          <span>{repo.Stars}</span>
        </div>

        <div className='repo__lang'>
          <span className='repo__lang__circle' style={{ backgroundColor: languageColors[repo.Lang] }}></span>
          <span>{repo.Lang}</span>
        </div>
      </div>
    </div>
  )
}
