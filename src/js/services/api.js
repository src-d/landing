export const states = {
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error',
};

const LOCAL_URL = 'http://localhost:8080/api';
const PROD_URL = '/api';
const PROD_FORCED_URL = null; // 'http://sourced.tech/api'

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

export function loadPosts(host, key) {
  const apiPath = 'https://' + host + '/ghost/api/v2/content/posts/';
  const options = [
    'key=' + key,
    'limit=3',
    'fields=url,title,feature_image,custom_excerpt,primary_author',
    'include=authors',
    'formats=plaintext',
    'order=published_at desc',
  ];

  const trim = c => c ? c.trim() : '';
  const desc = (text, alt) => (clean(text) || clean(alt)).replace(/\s{2,}/g,' ');
  const removeRefs = c => c.replace(/\[(https?:)?\/\/[^\]]+(\]|$)/g,'');
  const clean = c => trim(removeRefs(c));

  return request(apiPath + '?' + options.join('&'))
    .then(resp => {
      return resp.posts.length > 0
        ? resp.posts.map( post => ({
          title: post.title,
          featured_image: post.feature_image,
          description: desc(post.custom_excerpt, post.plaintext),
          author: post.primary_author.name,
          link: post.url,
        }))
        : Promise.reject(new Error('no posts found'));
    });
}

const POSITIONS_URL = '/positions';

export function loadPositions() {
  const url = apiURL(POSITIONS_URL);
  return request(url).then(resp => resp);
}
