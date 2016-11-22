import { polyfill } from 'es6-promise'
import 'isomorphic-fetch'
import ReactDOM from 'react-dom'
import React from 'react'

import setupClipboard from './clipboard'
import Repositories from './components/Repositories'
import { TechPosts, BusinessPosts } from './components/Posts'

polyfill()

function renderComponent(component, id) {
	const elem = document.getElementById(id)
	if (elem) {
		ReactDOM.render(React.createElement(component), elem)
	}
}

window.addEventListener('DOMContentLoaded', function () {
	setupMenu()
	renderComponent(Repositories, 'repositories')
	renderComponent(TechPosts, 'tech-posts')
	renderComponent(BusinessPosts, 'business-posts')
	setupClipboard()
})

function setupMenu() {
	const menuToggle = document.getElementById('menu-toggle')
	const menu = document.getElementById('menu')
	menuToggle.addEventListener('click', function () {
		menu.classList.toggle('open')
		menuToggle.classList.toggle('open')
	})
}