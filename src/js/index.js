import { polyfill } from 'es6-promise'
import 'isomorphic-fetch'
import ReactDOM from 'react-dom'
import React from 'react'

import $ from 'jquery'
import 'slick-carousel'
import hljs from 'highlight.js'
import BlogPostsContainer from './components/Posts'
import PositionsMain from './components/Positions'
import SlackForm from './components/SlackForm'

polyfill()

function renderComponent(component, id, props = {}) {
    const elem = document.getElementById(id)
    if (elem) {
        ReactDOM.render(React.createElement(component, Object.assign({}, props, elem.dataset)), elem)
    }
}

function renderBlogCategories(selector, containerId) {
  const enableBlogContainer = () => {
    document.getElementById(containerId).style.display = 'block';
  }

  const categories = Array.from(document.querySelectorAll(selector))
  categories.forEach(category => {
    const props = {
      onSuccess: enableBlogContainer,
      category: category.dataset,
    }
    const component = React.createElement(BlogPostsContainer, props);
    ReactDOM.render(component, category)
  })
}

window.addEventListener('DOMContentLoaded', _ => {
  setupStickyHeader()
  setupShowcases()
  renderBlogCategories('.blog__category', 'blog-container')
  renderComponent(PositionsMain, 'offersPanel')
  renderComponent(SlackForm, 'slack-join')
  renderComponent(SlackForm, 'horizontal-slack-join')
  setupTestimonials()
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
  if (!code) {
    return;
  }

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

function setupTestimonials() {
  const testimonials = document.getElementById('testimonials')
  if (!testimonials) {
    return;
  }

  const children = Array.from(testimonials.children)
  shuffle(children)
  testimonials.innerHTML = ''
  children.forEach(c => testimonials.appendChild(c))
}

function shuffle(arr) {
  for (let i = arr.length; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
  }
}
