function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    let error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

export var states = {
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error'
}

const LOCAL_URL = 'http://localhost:8080'
const PROD_URL = 'https://sourced.tech/api'
const BLOG_URL = 'http://blog.sourced.tech'

function apiURL(url) {
  const baseURL = window.location.href.indexOf('://localhost') >= 0 ? LOCAL_URL : PROD_URL
  return baseURL + url
}

function blogURL(url) {
  const baseURL = window.location.href.indexOf('://localhost') >= 0 ? LOCAL_URL : BLOG_URL
  return baseURL + url
}

function request(url) {
  return fetch(url)
    .then(checkStatus)
    .then(resp => resp.json())
}

const MAIN_REPOS_URL = '/repositories/main'
const OTHER_REPOS_URL = '/repositories/other'

export function loadMainRepos() {
  return request(apiURL(MAIN_REPOS_URL)).then(resp => resp.Repos)
}

export function loadOtherRepos() {
  return request(apiURL(OTHER_REPOS_URL)).then(resp => resp.Repos)
}

const BUSINESS_POSTS_URL = '/json/business/'
const TECH_POSTS_URL = '/json/science/'

export function loadTechPosts() {
  return request(blogURL(TECH_POSTS_URL))
}

export function loadBusinessPosts() {
  return request(blogURL(BUSINESS_POSTS_URL))
}
