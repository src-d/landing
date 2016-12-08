import { polyfill } from 'es6-promise'
import 'isomorphic-fetch'
import ReactDOM from 'react-dom'
import React from 'react'

import setupClipboard from './clipboard'
import Repositories from './components/Repositories'
import DeveloperData from './components/DeveloperData'
import { TechPosts, NonTechPosts } from './components/Posts'

import beautify from 'js-beautify'
import highlighter from 'highlight.js'

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
    renderComponent(Repositories, 'repositories')
    renderComponent(TechPosts, 'tech-posts')
    renderComponent(NonTechPosts, 'non-tech-posts')
    setupClipboard()
    setupDeveloperData()
    highlightCode()
    setupTabs()
})

function highlightCode() {
    const containers = document.querySelectorAll('.js-beautyCode')
    highlighter.configure({ useBR: false })
    Array.from(containers).map(container => {
        container.innerHTML = beautify(container.innerHTML, { indent_size: 2 })
        highlighter.highlightBlock(container)
    })
}

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
    const topBarHeight = topBar.offsetHeight
    const headerHeight = document.querySelector('.mainHeader').offsetHeight
    const offset = headerHeight - topBarHeight
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

function setupDeveloperData() {
    Array.from(document.querySelectorAll('.showDeveloperData')).forEach(elem => {
        elem.addEventListener('click', renderDeveloperData)
    })
}

function renderDeveloperData() {
    renderComponent(DeveloperData, 'developerData')
}

function setupTabs() {
    const container = document.querySelector('#detailsContainer')
    const tabs = document.querySelector('ul.tabs')
    if (container && tabs) {
        Array.from(tabs.children).map(button => {
            button.addEventListener('click', _ => {
                container.className = button.className
            })
        })
    }
}
