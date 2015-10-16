$(function (f) {
  function showElement(e) {
    e.preventDefault();
    var elemId = this.getAttribute('data-elem-show');
    $('#' + elemId).fadeIn();
  }

  function hideElement(e) {
    e.preventDefault();
    var elemId = this.getAttribute('data-elem-hide');
    $('#' + elemId).fadeOut();
  }

  $('.show-elem').click(showElement);
  $('.hide-elem').click(hideElement);
});
