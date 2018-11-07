export const states = {
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error',
};

const LOCAL_URL = 'http://localhost:8080/api';
const PROD_URL = '/api';
const PROD_FORCED_URL = null; // 'http://sourced.tech/api'
const BLOG_URL = '//blog.sourced.tech';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function apiURL(url) {
  const baseURL =
    window.location.href.indexOf('://localhost') >= 0 ? LOCAL_URL : PROD_URL;
  return (PROD_FORCED_URL || baseURL) + url;
}

function request(url) {
  return fetch(url).then(checkStatus).then(resp => resp.json());
}

export function loadPosts(category) {
  return request(apiURL(`/posts/${category}`)).then((resp) => {
    const posts = resp.Posts.slice(0, 3);
    return posts.length > 0
      ? posts
      : Promise.reject(new Error('empty response'));
  });
}

export function blogUrl(path) {
  if (path.indexOf('//') === 0 || path.indexOf('http') === 0) {
    return path;
  }

  return `${BLOG_URL}/${path.trim('/')}`;
}

const POSITIONS_URL = '/positions';

export function loadPositions() {
  const url = apiURL(POSITIONS_URL);
  return request(url).then(resp => resp);
}
