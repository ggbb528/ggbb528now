'use strict';

import './popup.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';

import $ from 'jquery';

$(document).ready(function () {
  $('body').on('click', 'a', function () {
    chrome.tabs.create({ url: $(this).attr('href') });
    return false;
  });
});
