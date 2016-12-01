import React from 'react'

const languageClass = {
    'C': 'C',
    'C++': 'Cpp',
    'Go': 'Go',
    'JavaScript': 'JavaScript',
    'Python': 'Python',
    'Scala': 'Scala',
}

export default function Repository({ repo }) {
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
                    <span className={'circle lang' + languageClass[repo.Lang] }></span>
                    <span>{repo.Lang}</span>
                </div>
            </div>
        </a>
    )
}
