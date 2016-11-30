import React from 'react'

const languageColors = {
    'default': '#BBBBBB',
    'C': '#A8B9CC',
    'C++': '#669AD3',
    'Go': '#75CEDE',
    'JavaScript': '#F0DB4F',
    'Python': '#8EDA53',
    'Scala': '#DE322F',
}

export default function Repository({ repo }) {
    let color = languageColors[repo.Lang] || languageColors['default']
    return (
        <a href={repo.URL} className='repo' target='_blank'>
            <div href={repo.URL} className='fullName'>
                <span className='owner'>{repo.FullName.split('/')[0]}</span>
                <span className='divider'>/</span>
                <span className='name'>{repo.Name}</span>
            </div>

            <p className='description'>
                {repo.Description}
            </p>
            <div className='data'>
                <div className='stars'>
                    <img src='/img/icons/star.svg' />
                    <span>{repo.Stars}</span>
                </div>

                <div className='lang'>
                    <span className='circle' style={{ backgroundColor: color }}></span>
                    <span>{repo.Lang}</span>
                </div>
            </div>
        </a>
    )
}
