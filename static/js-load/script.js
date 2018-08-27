$(document).ready(function(){
    $('.trust-cases').slick({
    });
});

$('body').on('mouseenter mouseleave','.dropdown',function(e){
    var _d=$(e.target).closest('.dropdown');_d.addClass('show');
    setTimeout(function(){
        _d[_d.is(':hover')?'addClass':'removeClass']('show');
        $('[data-toggle="dropdown"]', _d).attr('aria-expanded',_d.is(':hover'));
    },300);
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