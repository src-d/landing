import { polyfill } from 'es6-promise'
import 'isomorphic-fetch'
import ReactDOM from 'react-dom'
import React from 'react'

import $ from 'jquery'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import setupClipboard from './clipboard'
import BlogPostsContainer from './components/Posts'
import PositionsMain from './components/Positions'
import SlackForm from './components/SlackForm'
import setupMenu from './behaviours/menu'

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
    hljs.initHighlightingOnLoad()
    renderComponent(BlogPostsContainer, 'ourPostsContainer')
    renderComponent(PositionsMain, 'offersPanel')
    renderComponent(SlackForm, 'slack-join')
    setupClipboard()
})

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
