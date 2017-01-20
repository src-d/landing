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
const PROD_FORCED_URL = null //'http://sourced.tech/api'

function apiURL(url) {
    const baseURL = window.location.href.indexOf('://localhost') >= 0 ? LOCAL_URL : PROD_URL
    return (PROD_FORCED_URL || baseURL) + url
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
    return request(apiURL(TECH_POSTS_URL)).then(resp => fixPosts(resp.Posts.slice(0,3)))
}

export function loadNonTechPosts() {
    return request(apiURL(NON_TECH_POSTS_URL)).then(resp => fixPosts(resp.Posts.slice(0,3)))
}

function fixPosts(posts) {
    return posts.map(post => fixPost(post))
}

function fixPost(post) {
    if (!post.link) {
        return post
    }

    if (post.link.indexOf('//') !== 0 && post.link.indexOf('http') !== 0 ) {
        post.link = 'http://blog.sourced.tech' + post.link
    }

    return post
}

const POSITIONS_URL = '/positions'

export function loadPositions() {
    let url = apiURL(POSITIONS_URL)
    return request(url).then(resp => resp)
}
