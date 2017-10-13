/* eslint-env browser */
import { polyfill } from 'es6-promise';
import 'isomorphic-fetch';
import ReactDOM from 'react-dom';
import React from 'react';

import $ from 'jquery';
import 'slick-carousel';
import lightbox from 'lightbox2';
import 'lightbox2/dist/css/lightbox.css';
import hljs from 'highlight.js';
import BlogPostsContainer from './components/Posts';
import PositionsPanel from './components/Positions';
import SlackForm from './components/SlackForm';
import setupLinkTracking, { isScrollableLink, scrollTo } from './services/link_track';

polyfill();

function renderComponent(component, target, props = {}) {
  let elem = target;
  if (typeof target === 'string') {
    elem = document.getElementById(target);
  }

  if (elem) {
    ReactDOM.render(
      React.createElement(component, Object.assign({}, props, elem.dataset)),
      elem,
    );
  }
}

function renderBlogCategories(selector, containerId) {
  const enableBlogContainer = () => {
    document.getElementById(containerId).style.display = 'block';
  };

  const categories = Array.from(document.querySelectorAll(selector));
  categories.forEach((category) => {
    const props = {
      onSuccess: enableBlogContainer,
      category: category.dataset,
    };
    const component = React.createElement(BlogPostsContainer, props);
    ReactDOM.render(component, category);
  });
}

function setupSmoothScroll() {
  const elems = Array.from(document.querySelectorAll('.scroll-to:not([data-tracked])'));

  elems.forEach((elem) => {
    elem.addEventListener('click', (e) => {
      if (isScrollableLink(elem)) {
        e.preventDefault();
        scrollTo(elem);
      }
    });
  });
}

function setupMenu() {
  const menu = document.getElementById('menu');
  const toggle = document.getElementById('menu-toggle');

  toggle.addEventListener('click', () => {
    menu.classList.toggle('horizontal-menu_open');
    toggle.classList.toggle('horizontal-menu-toggle_open');
  });

  const mainMenu = document.getElementById('menu-main');
  const navs = Array.from(document.querySelectorAll('.nav-to'));
  const menus = Array.from(document.querySelectorAll('#menu > ul'));
  navs.forEach((n) => {
    const to = n.getAttribute('data-nav-to');
    n.addEventListener('click', (e) => {
      e.preventDefault();

      menus.forEach(m => m.classList.remove('visible'));
      const menuTo = document.getElementById(`menu-${to}`) || mainMenu;
      menuTo.classList.add('visible');
    });
  });
}

function renderHorizontalSlackForms() {
  const elems = document.querySelectorAll('.horizontal-slack-join');
  Array.from(elems).forEach((form) => {
    renderComponent(SlackForm, form);
  });
}

function checkTopbarOpacity(topBar, opaqueAtOffset) {
  if (window.pageYOffset > opaqueAtOffset) {
    topBar.classList.add('opaque');
  } else {
    topBar.classList.remove('opaque');
  }
}

function setupStickyHeader() {
  const topBar = document.querySelector('#topbar');
  const offset = 50;
  if (topBar.classList.contains('opaque')) {
    return;
  }

  checkTopbarOpacity(topBar, offset);
  window.addEventListener('scroll', () => checkTopbarOpacity(topBar, offset));
}

function highlightCode(code) {
  if (code.children.length >= 0) {
    hljs.highlightBlock(code.children[0]);
  }
}

function setupExamples() {
  const example = $('.examples__project');
  const code = document.getElementById('example-code');
  const title = document.getElementById('example-title');
  const btn = document.getElementById('example-btn');
  if (!code) {
    return;
  }

  example.slick({
    dots: true,
    infinite: true,
    speed: 500,
    fade: true,
    swipe: false,
    adaptiveHeight: true,
    appendArrows: '.examples__info__navigation',
    appendDots: '.examples__info__navigation',
  });

  highlightCode(code);

  example.on('beforeChange', (e, slick, currentSlide, nextSlide) => {
    const project =
      window.examples[nextSlide >= window.examples.length ? 0 : nextSlide];
    title.innerText = project.title;
    btn.title = project.title;
    btn.href = project.link;
    code.innerHTML = `
    <pre><code class="${project.language}">${project.code}</code></pre>
    `;
    highlightCode(code);
  });
}

function shuffle(arr) {
  for (let i = arr.length; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    // eslint-disable-next-line no-param-reassign
    [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
  }
}

function setupTestimonials() {
  const testimonials = document.getElementById('testimonials');
  if (!testimonials) {
    return;
  }

  const children = Array.from(testimonials.children);
  shuffle(children);
  testimonials.innerHTML = '';
  children.slice(0, 2).forEach(c => testimonials.appendChild(c));
}

window.addEventListener('DOMContentLoaded', () => {
  setupStickyHeader();
  setupMenu();
  setupExamples();
  renderBlogCategories('.blog__category', 'blog-container');
  renderComponent(PositionsPanel, 'offers');
  renderComponent(SlackForm, 'slack-join');
  renderHorizontalSlackForms();
  setupTestimonials();
  lightbox.option({
    disableScrolling: true,
  });
  setupSmoothScroll();
  setupLinkTracking();
});
