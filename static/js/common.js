$(function (f) {
  function showElement(e) {
    e.preventDefault();
    var elemId = this.getAttribute('data-elem-show');
    f('#' + elemId).fadeIn();
  }

  function hideElement(e) {
    e.preventDefault();
    var elemId = this.getAttribute('data-elem-hide');
    f('#' + elemId).fadeOut();
  }

  function validateForm(form) {
    $inputs = form.find('.requires-validation');
    $inputs.each(function (i, elem) {
      elem = $(elem);
      var validation = elem.attr('data-validate');
      elem.parent().removeClass('invalid');
      if (validation && (elem[0].required || elem.val().trim().length > 0)) {
        var validationRegex = new RegExp(validation);
        if (!validationRegex.test(elem.val())) {
          elem.parent().addClass('invalid');
        }
      }
    });

    return form.find('.invalid').length === 0;
  }

  function submitForm(e) {
    e.preventDefault();

    var elem = $(this);
    if (validateForm(elem)) {
      var data = elem.serialize();
      sendData(data);
      userFilledMatchingForm();
      showThanksBanner(elem);
    }
  }

  function submitFaqForm(e) {
    e.preventDefault();

    var elem = $(this);
    if (validateForm(elem)) {
      var data = elem.serialize();
      sendData(data);
      showSuccessSection();
      this.reset();
    }
  }

  function showSuccessSection() {
    f('#faq-form').fadeOut(function () {
      f('#faq-form-success').fadeIn();
    });
  }

  function sendData(data) {

  }

  function showThanksBanner(form) {
    var popup = form.attr('data-popup');
    var $popup = form.closest('#matching-form-'+ popup +'-popup');
    var $thanks = $popup.parent().find('#thanks-' + popup);

    $popup.fadeOut(function () {
      $thanks.fadeIn(function () {
        setTimeout(function () {
          $popup.parent().fadeOut();
        }, 3000);
      });
    });
  }

  function focusChildren() {
    this.children[0].focus();
  }

  function userFilledMatchingForm() {
    f.cookie('matching-form', 'filled', { expires: 365, path: '/' });
  }

  function shouldDisplayBanner() {
    if (f.cookie('matching-form') === 'filled') {
      f('#matching-banner').hide();
    }
  }

  function init() {
    f('.show-elem').click(showElement);
    f('.hide-elem').click(hideElement);
    f('.matching-form-form').submit(submitForm);
    f('.form-match-name, .form-match-handle, .form-question, .form-name, .form-position').click(focusChildren);
    f('#faq-form-form').submit(submitFaqForm);
    shouldDisplayBanner();
  }

  init();
});
