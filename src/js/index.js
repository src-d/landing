import { polyfill } from 'es6-promise'
import 'isomorphic-fetch'
import ReactDOM from 'react-dom'
import React from 'react'

import setupClipboard from './clipboard'
import Repositories from './components/Repositories'
import { TechPosts, NonTechPosts } from './components/Posts'

polyfill()

function renderComponent(component, id) {
    const elem = document.getElementById(id)
    if (elem) {
        ReactDOM.render(React.createElement(component), elem)
    }
}

window.addEventListener('DOMContentLoaded', function () {
    setupMenu()
    setupStickyHeader()
    renderComponent(Repositories, 'repositories')
    renderComponent(TechPosts, 'tech-posts')
    renderComponent(NonTechPosts, 'non-tech-posts')
    setupClipboard()
})

function setupMenu() {
    const menuToggle = document.getElementById('menuToggle')
    const menu = document.getElementById('menu')
    menuToggle.addEventListener('click', function () {
        menu.classList.toggle('open')
        menuToggle.classList.toggle('open')
    })
}

function setupStickyHeader() {
    const topBar = document.getElementById('topBar')
    if (topBar.classList.contains("opaque")) { return }
    checkTopbarOpacity(topBar)
    window.addEventListener('scroll', _ => checkTopbarOpacity(topBar))
}

function checkTopbarOpacity(topBar) {
    if (window.pageYOffset > 425) {
        topBar.classList.add('opaque')
    } else {
        topBar.classList.remove('opaque')
    }
}
