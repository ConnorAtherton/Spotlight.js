/*
 * Spotlight.js
 *
 * Copyright 2014, Connor Atherton - http://connoratherton.com/
 * Released under the MIT Licence
 * http://opensource.org/licenses/MIT
 *
 * Github:  http://github.com/ConnorAtherton/Spotlight.js/
 */
(function (window, document) {
  'use strict';

  var Spotlight  = Spotlight || function (elems, opts, fn) {

    var options = {
      overlayOpacity: opts.overlayOpacity || 0.8,
      overlayID: opts.overlayID || 'overlay',
      overlayColor: opts.overlayColor || '#000'
    },
    cache = {
      overlay: null,
      elements: [],
      placeholders: [],
      callback: fn
    },
    utils = {
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
            return elem.removeEventListener(evt, fn, false);
          }
          else {
            return elem.detachEvent('on' + evt, fn);
          }
        }
      },
      klass: {
        has: function (elem, name) {
          return (elem.className).indexOf(name) !== -1;
        },
        add: function (elem, name) {
          if (!utils.klass.has(elem, name)) {
            elem.className += ' ' + name;
          }
        },
        remove: function (elem, name) {
          elem.className = (elem.className).replace(name, '');
        }
      },
      style: {
        add: function (elem, rule) {
          elem.style[rule.name] = rule.value;
        },
        remove: function (elem, rule) {
          elem.style.clear = rule;
        },
        addAll: function (elem, rules) {
          var rule;
          for(rule in rules) {
            if (rules.hasOwnProperty(rule)) {
              elem.style[rule] = rules[rule];
            }
          }
        },
        removeAll: function (elem) {
          elem.removeAttribute('style');
        },
        removeCertain: function (elem, rules) {
          var rule;
          for(rule in rules) {
            if (rules.hasOwnProperty(rule)) {
              utils.style.remove(elem, rule);
            }
          }
        }
      },
      checks: {
        isArray: function (obj) {
          return Array.isArray(obj);
        },
        isString: function (obj) {
          return typeof obj === 'string' || obj instanceof String;
        }
      },
      position: {
       getOffset: function (elem) {
        var x = 0,
            y = 0;

        while (elem && !isNaN(elem.offsetLeft) && !isNaN(elem.offsetTop)) {
          x += elem.offsetLeft - elem.scrollLeft;
          y += elem.offsetTop - elem.scrollTop;
          elem = elem.offsetParent;
        }

        return { top: y, left: x };
       }
      }
    },
    overlay = {
      add: function () {
        cache.overlay = document.createElement('div');
        cache.overlay.setAttribute('id', options.overlayID);
        document.body.appendChild(cache.overlay);
        utils.style.addAll(cache.overlay, overlay.styles);
        utils.events.addEvent(cache.overlay, 'click', function () {
          overlay.remove();
          elements.removeAll();
        })
      },
      remove: function () {
        document.body.removeChild(cache.overlay);
        cache.callback.call(this);
      },
      styles: {
        'backgroundColor': options.overlayColor,
        'opacity': options.overlayOpacity,
        'position': 'fixed',
        'top': 0, 'left': 0,
        'width': '100%', 'height': '100%',
        'zIndex': 10
      }
    },
    elements = {
      add: function (elems) {
        if (utils.checks.isArray(elems)) {
          elements.addMultiple(elems);
        }
        else if (utils.checks.isString(elems)) {
          elements.addSingle(elems);
        }
        else {
          throw new Error('First argument to Spotlight must either be a string or an array');
        }
      },
      addSingle: function (elem) {
        var elem = document.getElementById(elem),
            elem = elements.addOffsets(elem);

        elements.addPlaceholder(elem);

        cache.elements.push(elem);
      },
      addMultiple: function (elems) {
        var elem;
        for (var i = 0; i < elems.length; i++) {
          elem = document.getElementById(elems[i]),
          elem = elements.addOffsets(elem),

          elements.addPlaceholder(elem);

          cache.elements.push(elem);
        }
      },
      removeAll: function () {
        var placeholder;
        for (var i = 0; i < cache.placeholders.length; i++) {
          placeholder = cache.placeholders[i].elem;
          placeholder.parentNode.removeChild(placeholder);
        };

        // need to remove the styles
        var elem;
        for (var i = 0; i < cache.elements.length; i++) {
          elem = cache.elements[i];
          utils.style.removeAll(elem);
          utils.klass.remove(elem, 'placeholder');
        };
      },
      addOffsets: function (elem) {
        var offsets = utils.position.getOffset(elem);

        elem.setAttribute('data-top', offsets.top);
        elem.setAttribute('data-left', offsets.left);

        return elem;
      },
      addPlaceholder: function (elem) {
        var placeholder = {
          elem: document.createElement('div'),
          parent: elem
        };

        placeholder.elem.setAttribute('data-width', elem.offsetWidth);
        placeholder.elem.setAttribute('data-height', elem.offsetHeight);

        cache.placeholders.push(placeholder);
      },
      addPlaceholdersToPage: function () {
        var parent, elem;
        for (var i = 0; i < cache.placeholders.length; i++) {
           parent = cache.placeholders[i].parent,
           elem = cache.placeholders[i].elem;

           utils.klass.add(elem, 'placeholder');

          // Add individual top and left styles to position the clone
          // over the original element
          utils.style.add(elem, {
            name: 'width',
            value: cache.placeholders[i].elem.getAttribute('data-width') + 'px'
          })

          utils.style.add(elem, {
            name: 'height',
            value: cache.placeholders[i].elem.getAttribute('data-height') + 'px'
          })

          // insert the placeholder and overlay the actual element
          parent.parentNode.insertBefore(elem, parent)
          elements.overlayElement(parent);
        };
      },
      overlayElement: function (elem) {
        // apply gloabl styles
        utils.style.addAll(elem, elements.styles);

        utils.style.add(elem, {
          name: 'top',
          value: elem.getAttribute('data-top') + 'px'
        })

        utils.style.add(elem, {
          name: 'left',
          value: elem.getAttribute('data-left') + 'px'
        })

      },
      applyStyles: function () {
        for (var i = 0; i < cache.elements.length; i++) {
          utils.style.addAll(cache.elements[i], elements.styles);
        }
      },
      styles: {
        'position': 'absolute',
        'zIndex': 90
      }
    },
    init = function(elems, opts) {
      overlay.add();
      elements.add(elems);
      elements.addPlaceholdersToPage();
    }

    // Public methods
    this.remove = function () {
      overlay.remove();
      elements.removeAll();
    }

    init(elems, opts);

  }

  // Expose Spotlight to the global object
  this.Spotlight = Spotlight;

}).call(this, window, document, undefined)
