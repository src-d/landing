import React from 'react'

const languageColors = {
    Go: '#375EAB',
    JavaScript: '#F1E05A'
}

export default function Repository({ repo }) {
    return (
        <div className='repo'>
            <a href={repo.URL}>
                <span className='owner'>{repo.FullName.split('/')[0]}</span>
                <span className='divider'>/</span>
                <span className='name'>{repo.Name}</span>
            </a>
            <p className='description'>
                {repo.Description}
            </p>
            <div className='data'>
                <div className='stars'>
                    <img src='/img/star.svg' />
                    <span>{repo.Stars}</span>
                </div>

                <div className='lang'>
                    <span className='circle' style={{ backgroundColor: languageColors[repo.Lang] }}></span>
                    <span>{repo.Lang}</span>
                </div>
            </div>
        </div>
    )
}
