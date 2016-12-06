import { polyfill } from 'es6-promise'
import 'isomorphic-fetch'
import ReactDOM from 'react-dom'
import React from 'react'

import setupClipboard from './clipboard'
import Repositories from './components/Repositories'
import WaitingList from './components/WaitingList'
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
    setupWaitingList()
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
    const turnOpaqueAt = headerHeight - topBarHeight
    if (topBar.classList.contains("opaque")) { return }
    checkTopbarOpacity(topBar)
    window.addEventListener('scroll', _ => checkTopbarOpacity(topBar, turnOpaqueAt))
}

function checkTopbarOpacity(topBar, opaqueAtOffset) {
    if (window.pageYOffset > opaqueAtOffset) {
        topBar.classList.add('opaque')
    } else {
        topBar.classList.remove('opaque')
    }
}

function setupWaitingList() {
    Array.from(document.querySelectorAll('.showWaitingList')).forEach(elem => {
        elem.addEventListener('click', renderWaitingList)
    })
}

function renderWaitingList() {
    renderComponent(WaitingList, 'waitingList')
}

function setupTabs() {
    const detailsContainer = document.querySelector('#detailsContainer')
    const buttons = detailsContainer.querySelectorAll('nav li')
    Array.from(buttons).map(button => {
        button.addEventListener('click', _ => {
            detailsContainer.className = button.className
        })
    })
}
