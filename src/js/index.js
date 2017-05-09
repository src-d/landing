import { polyfill } from 'es6-promise'
import 'isomorphic-fetch'
import ReactDOM from 'react-dom'
import React from 'react'

import './highlight.pack'
import setupClipboard from './clipboard'
import RepositoriesContainer from './components/Repositories'
import BlogPostsContainer from './components/Posts'
import PositionsMain from './components/Positions'

polyfill()

function renderComponent(component, id) {
    const elem = document.getElementById(id)
    if (elem) {
        ReactDOM.render(React.createElement(component), elem)
    }
}

window.addEventListener('DOMContentLoaded', _ => {
    setupMenu()
    setupStickyHeader()
    setupSlider()
    hljs.initHighlightingOnLoad()
    renderComponent(RepositoriesContainer, 'ourOpenSourceContainer')
    renderComponent(BlogPostsContainer, 'ourPostsContainer')
    renderComponent(PositionsMain, 'offersPanel')
    setupClipboard()
})

function setupMenu() {
    const menuToggle = document.querySelector('#menuToggle')
    const menu = document.querySelector('#menu')
    menuToggle.addEventListener('click', _ => {
        menu.classList.toggle('open')
        menuToggle.classList.toggle('open')
    })
}

function setupStickyHeader() {
    const topBar = document.querySelector('#topBar')
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

function setupSlider() {
  $('.projects').slick({
    infinite: true,
    dots: true,
    autoplay: true,
    autoplaySpeed: 8000,
  });
}
