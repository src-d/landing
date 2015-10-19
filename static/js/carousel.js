$(function (f) {
    var totalElements;

    function moveLeft(currentElem, currentIndex) {
        var nextElem = findNextElement(currentIndex, -1);
        slideRight(currentElem, nextElem).then(postAnimation);
    }

    function moveRight(currentElem, currentIndex) {
        var nextElem = findNextElement(currentIndex, 1);
        slideLeft(currentElem, nextElem).then(postAnimation);
    }

    function postAnimation(formerElem, currentElem) {
        formerElem.removeClass('active');
        currentElem.addClass('active');
    }

    function findNextElement(currentIndex, delta) {
        var nextIndex = findNextIndex(currentIndex, delta);
        return  $('.testimonial-item.t-item-' + nextIndex);
    }

    function findNextIndex(currentIndex, delta) {
        var nextIndex = currentIndex + delta;
        if (nextIndex < 0) {
            return totalElements;
        }
        if (nextIndex > totalElements) {
            return 1;
        }
        return nextIndex;
    }

    function slideLeft() {
        var args = arguments;
        var deferred = $.Deferred();
        for (var i = 0; i < args.length; i++) {
            if (i < args.length - 1) {
                args[i].hide("slide", {easing: 'easeInOutQuart', direction: "left"}, 1000);
            } else {
                args[i].show("slide", {easing: 'easeInOutQuart', direction: "right"}, 1000, function () {
                    deferred.resolve.apply(deferred, args);
                });
            }
        }
        return deferred.promise();
    }

    function slideRight() {
        var args = arguments;
        var deferred = $.Deferred();
        for (var i = 0; i < args.length; i++) {
            if (i < args.length - 1) {
                args[i].hide("slide", {easing: 'easeInOutQuart', direction: "right"}, 1000);
            } else {
                args[i].show("slide", {easing: 'easeInOutQuart', direction: "left"}, 1000, function () {
                    deferred.resolve.apply(deferred, args);
                });
            }
        }
        return deferred.promise();
    }

    function handleClick(e) {
        var direction = getDirection(e.currentTarget);
        var current = getCurrentElem();
        var i = getCurrentIndex();
        switch (direction) {
            case "left":
                moveLeft(current, i);
                break;
            case "right":
                moveRight(current, i);
                break;
        }
    }

    function getDirection(arrowElem) {
        return /arrow-(left|right)/.exec($(arrowElem).attr('class'))[1]
    }

    function getCurrentElem() {
        return $('.testimonial-item.active');
    }

    function getCurrentIndex() {
        return parseInt(/t-item-(\d+)/.exec($('.testimonial-item.active').attr('class'))[1]);
    }

    function init() {
        $('.testimonial-item:not(.active)').hide();
        $('.testimonial>.arrows>[class^="arrow-"]').click(handleClick);
        totalElements = $('.testimonial-item').length;
    }

    init();
});