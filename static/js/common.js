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
      sendData('Matching answer for sourced.tech', elem);
      userFilledMatchingForm();
      showThanksBanner(elem);
    }
  }

  function submitFaqForm(e) {
    e.preventDefault();

    var elem = $(this);
    if (validateForm(elem)) {
      sendData('New question for sourced.tech', elem);
      showSuccessSection();
      this.reset();
    }
  }

  function showSuccessSection() {
    f('#faq-form').fadeOut(function () {
      f('#faq-form-success').fadeIn();
    });
  }

  function sendData(subject, elem) {
    var values = elem.serializeArray();
    var data = {};
    for (var i = 0, len = values.length; i < len; i++) {
      data[values[i].name] = values[i].value;
    }
    data._subject = subject;

    $.ajax({
      url: 'http://formspree.io/hello@tyba.com',
      method: 'POST',
      data: data,
      dataType: 'json'
    });
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
    if (f.cookie('matching-form') !== 'filled' && window.location.hash === '#fromemail') {
      f('#matching-banner').show();
    }
  }

  function toggleQuestion(e) {
    e.preventDefault();
    var elem = f(this);
    elem.parent().find('p').slideToggle();
    elem.toggleClass('active-q');
  }

  function navTo(e) {
    e.preventDefault();

    var elem = this.getAttribute('data-nav-to');
    $('html, body').animate({
      scrollTop: $("#" + elem).offset().top - 80
    }, 500);
  }

  function openSection(e) {
    e.preventDefault();
    $('.open-section').each(function (i, el) {
      _closeSection(el.getAttribute('data-expand-section'));
    });

    var section = this.getAttribute('data-expand-section');
    var elem = f('#' + section);
    elem.toggleClass('selected');
    elem.find('a.open-section').toggle();
    elem.find('a.close-section').toggle();
    f('#' + section + '-info').fadeIn();
  }

  function closeSection(e) {
    e.preventDefault();
    var section = this.getAttribute('data-expand-section');
    _closeSection(section);
  }

  function _closeSection(section) {
    f('#' + section + '-info').hide();
    var elem = f('#' + section);
    elem.removeClass('selected');
    elem.find('a.open-section').show();
    elem.find('a.close-section').hide();
  }

  function init() {
    f('.show-elem').click(showElement);
    f('.hide-elem').click(hideElement);
    f('.matching-form-form').submit(submitForm);
    f('.form-match-name, .form-match-handle, .form-question, .form-name, .form-position').click(focusChildren);
    f('#faq-form-form').submit(submitFaqForm);
    shouldDisplayBanner();
    f('span.q').click(toggleQuestion);
    f('.nav-to').find('a').click(navTo);
    f('.open-section').click(openSection);
    f('.close-section').click(closeSection);
  }

  init();
});
