(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _insertion = require('shared/insertion');

var _insertion2 = _interopRequireDefault(_insertion);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

try {
  var insertion = function (_CoreInsertion) {
    _inherits(insertion, _CoreInsertion);

    function insertion() {
      _classCallCheck(this, insertion);

      return _possibleConstructorReturn(this, (insertion.__proto__ || Object.getPrototypeOf(insertion)).call(this));
    }

    return insertion;
  }(_insertion2.default);

  new insertion();
} catch (e) {
  console.log('CRITICAL ERROR');
  console.log(e);
}

},{"shared/insertion":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Messaging = require('../Messaging');

var _Messaging2 = _interopRequireDefault(_Messaging);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AdBlocker = function AdBlocker() {
  _classCallCheck(this, AdBlocker);

  _Messaging2.default.send('AdBlocker', 'domRules', {}, function (selectors) {
    if (selectors === false) return;
    var elements = document.querySelectorAll(selectors);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var element = _step.value;

        element.parentElement.removeChild(element);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  });
};

exports.default = AdBlocker;

},{"../Messaging":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _React = require('../React');

var _React2 = _interopRequireDefault(_React);

var _Messaging = require('../Messaging');

var _Messaging2 = _interopRequireDefault(_Messaging);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ContentWall = function () {
  function ContentWall() {
    var _this = this;

    _classCallCheck(this, ContentWall);

    var domain = document.location.href.match(/^[^:]+:\/\/(www.)?([^:/]+)/);
    if (!domain || !domain[2]) return;
    _Messaging2.default.send('ContentWall', 'shouldShow', { domain: domain[2] }, function (data) {
      if (!data) return;

      _this.limit = data.limit;
      _this.timer = data.timer;
      _this.draw();
    });
  }

  _createClass(ContentWall, [{
    key: 'draw',
    value: function draw() {
      var _this2 = this;

      _React2.default.domReady().then(function () {
        _React2.default.insertInBegining(_this2.render(), document.body);

        _this2.startCounter();
      });
    }
  }, {
    key: 'startCounter',
    value: function startCounter() {
      var _this3 = this;

      var delta = 100 / this.limit;

      var left = this.limit - this.timer;
      var minutes = Math.floor(left / 60).toString();
      var seconds = left % 60 >= 10 ? (left % 60).toString() : '0' + (left % 60).toString();
      _React2.default.getElement('_af_content_wall_timer').innerHTML = "0" + minutes + ":" + seconds;
      _React2.default.getElement('_af_content_wall_counter2').setAttribute('style', 'width: ' + this.timer * delta + '% !important;');

      var interval = setInterval(function () {
        _this3.timer++;

        var left = _this3.limit - _this3.timer;
        var minutes = Math.floor(left / 60).toString();
        var seconds = left % 60 >= 10 ? (left % 60).toString() : '0' + (left % 60).toString();
        _React2.default.getElement('_af_content_wall_timer').innerHTML = "0" + minutes + ":" + seconds;
        _React2.default.getElement('_af_content_wall_counter2').setAttribute('style', 'width: ' + _this3.timer * delta + '% !important;');

        _Messaging2.default.send('ContentWall', 'increase');

        if (_this3.timer >= _this3.limit) {
          clearInterval(interval);

          _this3.disconnect();
        }
      }, 1000);
    }
  }, {
    key: 'disconnect',
    value: function disconnect() {
      _React2.default.getElement('_af_content_wall_text').innerHTML = "You are disconnected. Upgrade to Elite subscription for unlimited viewing.";
      _React2.default.getElement('_af_content_wall_timer').innerHTML = "";
      _React2.default.getElement('_af_content_wall_button').innerHTML = "Upgrade";

      var domain = document.location.href.match(/^[^:]+:\/\/(www.)?([^:/]+)/);
      if (!domain || !domain[2]) return;
      _Messaging2.default.send('ContentWall', 'disconnect', { domain: domain[2] }, function (response) {});
    }
  }, {
    key: 'open',
    value: function open() {
      _Messaging2.default.send('ContentWall', 'open');
    }
  }, {
    key: 'render',
    value: function render() {
      return _React2.default.createElement(
        'div',
        { id: '_af_content_wall' },
        _React2.default.createElement(
          'div',
          { id: '_af_content_wall_counter' },
          _React2.default.createElement('div', { id: '_af_content_wall_counter2' })
        ),
        _React2.default.createElement('div', { id: '_af_content_wall_logo' }),
        _React2.default.createElement(
          'div',
          { id: '_af_content_wall_button', onClick: this.open.bind(this) },
          'Unlock This Site'
        ),
        _React2.default.createElement(
          'div',
          { id: '_af_content_wall_text' },
          'You will be disconnected from this site in: ',
          _React2.default.createElement('div', { id: '_af_content_wall_timer' })
        )
      );
    }
  }]);

  return ContentWall;
}();

exports.default = ContentWall;

},{"../Messaging":4,"../React":5}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Messaging = function () {
  function Messaging() {
    _classCallCheck(this, Messaging);
  }

  _createClass(Messaging, null, [{
    key: "send",
    value: function send(from, method, message, callback) {
      if (!browser || !browser.runtime || !browser.runtime.sendMessage) return;

      browser.runtime.sendMessage({ from: from, method: method, message: message }, function (response) {
        if (!callback) return;

        callback(response);
      });
    }
  }]);

  return Messaging;
}();

exports.default = Messaging;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var React = function () {
  function React() {
    _classCallCheck(this, React);
  }

  _createClass(React, null, [{
    key: 'domReady',
    value: function domReady() {
      if (!React.elements) React.elements = {};
      return new Promise(function (resolve, reject) {
        var isPageLoaded = function isPageLoaded() {
          if (document.readyState === 'complete' || document.readyState === 'interactive') {
            resolve();
            return;
          }

          return setTimeout(isPageLoaded, 100);
        };

        isPageLoaded();
      });
    }
  }, {
    key: 'domFullyLoaded',
    value: function domFullyLoaded() {
      return new Promise(function (resolve, reject) {
        var isPageLoaded = function isPageLoaded() {
          if (document.readyState === 'complete') {
            resolve();
            return;
          }

          return setTimeout(isPageLoaded, 100);
        };

        isPageLoaded();
      });
    }
  }, {
    key: 'insertInBegining',
    value: function insertInBegining(element, parent) {
      parent.insertBefore(element, parent.childNodes[0]);
    }
  }, {
    key: 'createElement',
    value: function createElement() {
      if (!arguments[0]) {
        return;
      }

      var element = void 0;

      if (arguments[0].match(/^svg|circle|path$/gi)) {
        element = document.createElementNS("http://www.w3.org/2000/svg", arguments[0]);
      } else if (arguments[0] === 'style') {
        element = document.createElement(arguments[0]);
        element.type = 'text/css';
      } else {
        element = document.createElement(arguments[0]);
      }

      for (var i = 1; i < arguments.length; i++) {
        if (!arguments[i]) {
          continue;
        }

        if (typeof arguments[i] === 'string') {
          element.appendChild(document.createTextNode(arguments[i]));
          continue;
        }

        if (_typeof(arguments[i]) === 'object' && arguments[i].tagName) {
          element.appendChild(arguments[i]);
          continue;
        }

        if (_typeof(arguments[i]) === 'object') {
          for (var key in arguments[i]) {
            var val = arguments[i][key];

            if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && val.tagName) {
              element.appendChild(val);
            } else if (key.match(/^onclick|click$/gi)) {
              element.addEventListener('click', val);
            } else {
              if (key === 'id') {
                React.elements[val] = element;
              }

              element.setAttribute(key, val);
            }
          }
        }
      }

      return element;
    }
  }, {
    key: 'getElement',
    value: function getElement(element, parrent) {
      if (element && (typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object' && element.tagName) {
        return element;
      }

      if (parrent && typeof parrent === 'string') {
        parrent = React.getElement(parrent);
      }

      if (typeof element === 'string') {
        if (React.elements[element]) {
          return React.elements[element];
        } else if (element.match(/^\./gi)) {
          var result = React.getByClassName(element.replace(/^\./gi, ''), parrent);
          return result && result[0] ? result[0] : undefined;
        } else {
          var _result = void 0;
          if (parrent) {
            _result = parrent.getElementsByTagName(element);
          } else {
            _result = document.getElementsByTagName(element);
          }

          return _result && _result[0] ? _result[0] : undefined;
        }
      }

      return element;
    }
  }]);

  return React;
}();

exports.default = React;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AdBlocker = require('./AdBlocker');

var _AdBlocker2 = _interopRequireDefault(_AdBlocker);

var _ContentWall = require('./ContentWall');

var _ContentWall2 = _interopRequireDefault(_ContentWall);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.browser = window.browser ? window.browser : window.chrome ? window.chrome : {};

var insertion = function insertion() {
  _classCallCheck(this, insertion);

  new _AdBlocker2.default();
  new _ContentWall2.default();
};

exports.default = insertion;

},{"./AdBlocker":2,"./ContentWall":3}]},{},[1]);