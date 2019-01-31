/* eslint-env browser */
import { polyfill } from 'es6-promise';
import 'isomorphic-fetch';

import $ from 'jquery';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import 'slick-carousel';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

import { loadPosts, loadPositions } from './services/api';
import { render, filters } from './services/templating';

polyfill();

$(document).ready(function(){
    $('.trust-cases').slick({
    });

    $('.engine-cards').slick({
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
});

$('.dropdown')
  .on('mouseenter', function() {
    if (!$(this).hasClass('show')) {
      $('.dropdown-toggle', this).dropdown('toggle');
    }
  })
  .on('mouseleave', function() {
    const that = this;

    setTimeout(function() {
      if ($('.dropdown-menu', that).hasClass('show') && !$(that).is(':hover')) {
        $('.dropdown-toggle', that).dropdown('toggle');
      }
    }, 500);
  });

// $(function () {
//     $(document).scroll(function () {
//         var $nav = $(".fixed-top");
//         $nav.toggleClass('navbar-scroll', $(this).scrollTop() > $nav.height());
//     });
// });

$(function() {
    var header = $(".navbar");

    $(window).scroll(function() {
        var scroll = $(window).scrollTop();
        if (scroll >= 1) {
            header.addClass("navbar-scroll");
        } else {
            header.removeClass("navbar-scroll");
        }
    });
});

$(function(){
    $('.dropdown-toggle').click(
      function(){
        if ($(this).next().is(':visible')) {
          location.href = $(this).attr('href');;
        }
       });
    });

const headerHeight = $('nav.navbar').height();

$('body').on('click', 'a', function (e) {
    const url = new URL(this.href);
    const urlPath = url.pathname.replace(/\/$/, "");
    const currentPath = window.location.pathname.replace(/\/$/, "");
    if (url.host !== window.location.host ||
        urlPath !== currentPath ||
        url.hash === '') {
        return true;
    }

    e.preventDefault();
    $('html, body').animate({
        scrollTop: $(url.hash).offset().top - headerHeight
    }, 'slow');
});

function loadBlogContent(containerId) {
  loadPosts('all')
    .then(posts => {
      const blogData = {
        main: posts[0],
        posts: posts.slice(1, 3),
        ellipsis35: filters.ellipsis(35),
        ellipsis70: filters.ellipsis(70),
      };

      render(containerId, blogData);
    });
}

function loadPositionsContent(containerId) {
  loadPositions()
    .then(positions => {
      positions.rmHyphen = filters.clean(/\s+-\s+/g, ' ');
      render(containerId, positions)
    });
}

window.addEventListener('DOMContentLoaded', () => {
  runIfElementExists('blog-container', loadBlogContent);
  runIfElementExists('positions-container', loadPositionsContent);
});

function runIfElementExists(elementId, callback) {
  if (document.getElementById(elementId)) {
    callback(elementId);
  }
}
