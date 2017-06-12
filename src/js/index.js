import { polyfill } from 'es6-promise'
import 'isomorphic-fetch'
import ReactDOM from 'react-dom'
import React from 'react'

import $ from 'jquery'
import 'slick-carousel'
import hljs from 'highlight.js'
import setupClipboard from './clipboard'
import BlogPostsContainer from './components/Posts'
import PositionsMain from './components/Positions'
import SlackForm from './components/SlackForm'

polyfill()

function renderComponent(component, id) {
    const elem = document.getElementById(id)
    if (elem) {
        ReactDOM.render(React.createElement(component), elem)
    }
}

window.addEventListener('DOMContentLoaded', _ => {
  setupStickyHeader()
  hljs.initHighlightingOnLoad()
  renderComponent(BlogPostsContainer, 'ourPostsContainer')
  renderComponent(PositionsMain, 'offersPanel')
  renderComponent(SlackForm, 'slack-join')
  setupClipboard()
})

function setupStickyHeader() {
    const topBar = document.querySelector('#topbar')
    const offset = 50
    if (topBar.classList.contains("opaque")) { return }

    checkTopbarOpacity(topBar, offset)
    window.addEventListener('scroll', _ => checkTopbarOpacity(topBar, offset))
}

function checkTopbarOpacity(topBar, opaqueAtOffset) {
    if (window.pageYOffset > opaqueAtOffset) {
        topBar.classList.add('opaque')
    } else {
        topBar.classList.remove('opaque')
    }
}

function setupShowcases() {
  const showcase = $('.showcases__project')
  const code = document.getElementById('showcase-code')
  const title = document.getElementById('showcase-title')
  showcase.slick({
    dots: true,
    infinite: true,
    speed: 0,
    fade: true,
    swipe: false,
    adaptiveHeight: true,
  })

  highlightCode(code)

  showcase.on('beforeChange', function (e, slick, currentSlide, nextSlide) {
    const project = window.showcases[nextSlide >= window.showcases.length ? 0 : nextSlide]
    title.innerText = project.title
    code.innerHTML = `
    <pre><code class="${project.language}">${project.code}</code></pre>
    `
    highlightCode(code)
  })
}

function highlightCode(code) {
  if (code.children.length >= 0) {
    hljs.highlightBlock(code.children[0])
  }
}
