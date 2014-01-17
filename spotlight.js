(function (window, doc) {
  'use strict';

  var Spotlight  = Spotlight || function (opts) {

    var options = {
      elements: null,
      overlayOpacity: opts.overlayOpacity || 0.4
    },
    utils: {
      events: {
        addEvent: function (elem, evt, fn) {
          if (elem.addEventListener) {
            return elem.addEventListener(evt, fn, false);
          }
          else {
            return elem.attachEvent('on' + evt, fn);
          }
        },
        removeEvent: function (elem, evt, fn) {
          if (elem.addEventListener) {
            return elem.removeEventListener(evt, fun, false);
          }
          else {
            return elem.detachEvent('on' + evt, fn);
          }
        }
      }
    }
    overlay: {
      add: function () {
        console.log('add an overlay');
      },
      remove: function () {
        console.log('remove the overlay')
      }
    },
    init: function(opts) {
      console.log('init' + opts);
    }
    // Initiate spotlight
    init(opts);

  }



}).call(this, window, document, undefined)
