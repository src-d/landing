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
    highlightCode()
    setupMenu()
    setupStickyHeader()
    renderComponent(Repositories, 'repositories')
    renderComponent(TechPosts, 'tech-posts')
    renderComponent(NonTechPosts, 'non-tech-posts')
    setupClipboard()
    setupWaitingList()
    setupTabs()
})

function highlightCode() {
    let containers = document.getElementsByClassName('js-beautyCode')
    highlighter.configure({ useBR: false })
    Array.from(containers).map(container => {
        container.innerHTML = beautify(container.innerHTML, { indent_size: 2 })
        highlighter.highlightBlock(container)
    })
}

function setupMenu() {
    const menuToggle = document.getElementById('menuToggle')
    const menu = document.getElementById('menu')
    menuToggle.addEventListener('click', _ => {
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
    const offset = Number(topBar.getAttribute('data-opaque-after')) || 425
    if (window.pageYOffset > offset) {
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
    Array.from(document.querySelectorAll('ul.tabs')).forEach(elem => {
        const target = elem.getAttribute('data-target')
        const targetElems = Array.from(document.querySelectorAll(target))
        const children = Array.from(elem.children)
        children.forEach((li, i) => {
            li.addEventListener('click', e => {
                children.forEach(el => el.classList.remove('active'))
                targetElems.forEach(el => el.classList.remove('active'))
                e.target.classList.add('active')
                targetElems[i].classList.add('active')
            })
        })
    })
}