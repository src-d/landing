import React, { Component } from 'react'

function Testimonial({ avatar, name, nickname, url, text }) {
  const author = name && name !== nickname ? `${name} @${nickname}` : `@${nickname}`
  return (
    <div className='testimonial' key={url}>
      <div className='testimonial__avatar'>
        <img src={avatar} alt={name} />
      </div>

      <blockquote>
        <p dangerouslySetInnerHTML={{__html: text }}></p>
        <footer>
          <cite>
            <a href={url} target='_blank' title={author}>{author}</a>
          </cite>
        </footer>
      </blockquote>
    </div>
  )
}

export default function Testimonials({ testimonials, num }) {
  shuffle(testimonials)
  if (num < testimonials.length) {
    testimonials = testimonials.slice(0, num)
  }

  return (
    <div className='testimonial-list'> 
      {testimonials.map(t => Testimonial(t))}
    </div>
  )
}

function shuffle(arr) {
  for (let i = arr.length; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
  }
}
