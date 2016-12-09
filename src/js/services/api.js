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
const PROD_URL = '/api'

function apiURL(url) {
    const baseURL = window.location.href.indexOf('://localhost') >= 0 ? LOCAL_URL : PROD_URL
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

const NON_TECH_POSTS_URL = '/posts/culture'
const TECH_POSTS_URL = '/posts/technical'

export function loadTechPosts() {
    return request(apiURL(TECH_POSTS_URL)).then(resp => resp.Posts.slice(0,3))
}

export function loadNonTechPosts() {
    return request(apiURL(NON_TECH_POSTS_URL)).then(resp => resp.Posts.slice(0,3))
}

export function sendDeveloperData(email, captcha) {
    return fetch(apiURL("/data"), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, captcha })
    })
        .then(resp => resp.json())
}
