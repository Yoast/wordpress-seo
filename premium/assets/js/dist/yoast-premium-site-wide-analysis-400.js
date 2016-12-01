(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ProminentWordCache = function () {
	function ProminentWordCache() {
		_classCallCheck(this, ProminentWordCache);

		this._cache = {};
	}

	/**
  * Returns the ID given the name, or 0 if not found in the cache.
  *
  * @param {string} name The name of the prominent word.
  * @returns {number} The ID of the prominent word.
  */


	_createClass(ProminentWordCache, [{
		key: "getID",
		value: function getID(name) {
			if (this._cache.hasOwnProperty(name)) {
				return this._cache[name];
			}

			return 0;
		}

		/**
   * Sets the ID for a given name.
   *
   * @param {string} name The name of the prominent word.
   * @param {number} id The ID of the prominent word.
   * @returns {void}
   */

	}, {
		key: "setID",
		value: function setID(name, id) {
			this._cache[name] = id;
		}
	}]);

	return ProminentWordCache;
}();

exports.default = ProminentWordCache;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ProminentWordCache = require("./ProminentWordCache");

var _ProminentWordCache2 = _interopRequireDefault(_ProminentWordCache);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Handles the retrieval and storage of focus keyword suggestions
 */
var ProminentWordStorage = function (_EventEmitter) {
	_inherits(ProminentWordStorage, _EventEmitter);

	/**
  * @param {string} rootUrl The root URL of the WP REST API.
  * @param {string} nonce The WordPress nonce required to save anything to the REST API endpoints.
  * @param {number} postID The postID of the post to save prominent words for.
  */
	function ProminentWordStorage(_ref) {
		var postID = _ref.postID,
		    rootUrl = _ref.rootUrl,
		    nonce = _ref.nonce;

		_classCallCheck(this, ProminentWordStorage);

		var _this = _possibleConstructorReturn(this, (ProminentWordStorage.__proto__ || Object.getPrototypeOf(ProminentWordStorage)).call(this));

		_this._rootUrl = rootUrl;
		_this._nonce = nonce;
		_this._cache = new _ProminentWordCache2.default();
		_this._postID = postID;
		_this._savingProminentWords = false;

		_this.retrieveProminentWordId = _this.retrieveProminentWordId.bind(_this);
		return _this;
	}

	/**
  * Saves prominent words to the database using AJAX
  *
  * @param {WordCombination[]} prominentWords The prominent words to save.
  * @returns {Promise} Resolves when the prominent words are saved.
  */


	_createClass(ProminentWordStorage, [{
		key: "saveProminentWords",
		value: function saveProminentWords(prominentWords) {
			var _this2 = this;

			// If there is already a save sequence in progress, don't do it again.
			if (this._savingProminentWords) {
				return;
			}
			this._savingProminentWords = true;

			var prominentWordIds = prominentWords.slice(0, 20).map(this.retrieveProminentWordId);

			return Promise.all(prominentWordIds).then(function (prominentWords) {
				return new Promise(function (resolve, reject) {
					jQuery.ajax({
						type: "POST",
						url: _this2._rootUrl + "wp/v2/posts/" + _this2._postID,
						beforeSend: function beforeSend(xhr) {
							xhr.setRequestHeader("X-WP-Nonce", _this2._nonce);
						},
						data: {
							// eslint-disable-next-line camelcase
							yst_prominent_words: prominentWords
						},
						dataType: "json",
						success: resolve,
						error: reject
					}).always(function () {
						_this2.emit("savedProminentWords", prominentWords);

						_this2._savingProminentWords = false;
					});
				});
			});
		}

		/**
   * Retrieves the ID of a promise
   *
   * @param {WordCombination} prominentWord The prominent word to retrieve the ID for.
   * @returns {Promise} Resolves to the ID of the prominent word term.
   */

	}, {
		key: "retrieveProminentWordId",
		value: function retrieveProminentWordId(prominentWord) {
			var _this3 = this;

			var cachedId = this._cache.getID(prominentWord.getCombination());
			if (0 !== cachedId) {
				return Promise.resolve(cachedId);
			}

			var foundProminentWord = new Promise(function (resolve, reject) {
				jQuery.ajax({
					type: "GET",
					url: _this3._rootUrl + "yoast/v1/prominent_words",
					beforeSend: function beforeSend(xhr) {
						xhr.setRequestHeader("X-WP-Nonce", _this3._nonce);
					},
					data: {
						word: prominentWord.getCombination()
					},
					dataType: "json",
					success: function success(response) {
						resolve(response);
					},
					error: function error(response) {
						reject(response);
					}
				});
			});

			var createdProminentWord = foundProminentWord.then(function (prominentWordTerm) {
				if (prominentWordTerm === null) {
					return _this3.createProminentWordTerm(prominentWord);
				}

				return prominentWordTerm;
			});

			return createdProminentWord.then(function (prominentWordTerm) {
				_this3._cache.setID(prominentWord.getCombination(), prominentWordTerm.id);

				return prominentWordTerm.id;
			});
		}

		/**
   * Creates a term for a prominent word
   *
   * @param {WordCombination} prominentWord The prominent word to create a term for.
   * @returns {Promise} A promise that resolves when a term has been created and resolves with the ID of the newly created term.
   */

	}, {
		key: "createProminentWordTerm",
		value: function createProminentWordTerm(prominentWord) {
			var _this4 = this;

			return new Promise(function (resolve, reject) {
				jQuery.ajax({
					type: "POST",
					url: _this4._rootUrl + "wp/v2/yst_prominent_words",
					beforeSend: function beforeSend(xhr) {
						xhr.setRequestHeader("X-WP-Nonce", _this4._nonce);
					},
					data: {
						name: prominentWord.getCombination()
					},
					dataType: "json",
					success: function success(response) {
						resolve(response);
					},
					error: function error(response) {
						reject(response);
					}
				});
			});
		}
	}]);

	return ProminentWordStorage;
}(_events2.default);

exports.default = ProminentWordStorage;

},{"./ProminentWordCache":1,"events":5}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _relevantWords = require("yoastseo/js/stringProcessing/relevantWords");

var _ProminentWordStorage = require("./ProminentWordStorage");

var _ProminentWordStorage2 = _interopRequireDefault(_ProminentWordStorage);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var postStatuses = ["future", "draft", "pending", "private", "publish"];

/**
 * Calculates prominent words for all posts on the site.
 */

var SiteWideCalculation = function (_EventEmitter) {
	_inherits(SiteWideCalculation, _EventEmitter);

	/**
  * Constructs a calculation object.
  *
  * @param {boolean} recalculateAll Whether to calculate all posts or only posts without prominent words.
  * @param {number} totalPosts The amount of posts to calculate prominent words for.
  * @param {string} rootUrl The root REST API URL.
  * @param {string} nonce The nonce to use when using the REST API.
  * @param {number[]} allProminentWordIds A list of all prominent word IDs present on the site.
  */
	function SiteWideCalculation(_ref) {
		var totalPosts = _ref.totalPosts,
		    rootUrl = _ref.rootUrl,
		    nonce = _ref.nonce,
		    allProminentWordIds = _ref.allProminentWordIds,
		    _ref$recalculateAll = _ref.recalculateAll,
		    recalculateAll = _ref$recalculateAll === undefined ? false : _ref$recalculateAll;

		_classCallCheck(this, SiteWideCalculation);

		var _this = _possibleConstructorReturn(this, (SiteWideCalculation.__proto__ || Object.getPrototypeOf(SiteWideCalculation)).call(this));

		_this._perPage = 10;
		_this._totalPosts = totalPosts;
		_this._totalPages = Math.ceil(totalPosts / _this._perPage);
		_this._processedPosts = 0;
		_this._currentPage = 1;
		_this._rootUrl = rootUrl;
		_this._nonce = nonce;
		_this._recalculateAll = recalculateAll;
		_this._allProminentWordIds = allProminentWordIds;

		_this.continueProcessing = _this.continueProcessing.bind(_this);
		_this.processResponse = _this.processResponse.bind(_this);
		_this.incrementProcessedPosts = _this.incrementProcessedPosts.bind(_this);
		return _this;
	}

	/**
  * Starts calculating prominent words.
  *
  * @returns {void}
  */


	_createClass(SiteWideCalculation, [{
		key: "start",
		value: function start() {
			this.calculate();
		}

		/**
   * Does a calculation step for the current page.
   *
   * @returns {void}
   */

	}, {
		key: "calculate",
		value: function calculate() {
			var _this2 = this;

			var data = {
				page: this._currentPage,
				// eslint-disable-next-line camelcase
				per_page: this._perPage,
				status: postStatuses
			};

			if (!this._recalculateAll) {
				// eslint-disable-next-line camelcase
				data.yst_prominent_words = this._allProminentWordIds;
			}

			jQuery.ajax({
				type: "GET",
				url: this._rootUrl + "wp/v2/posts/",
				beforeSend: function beforeSend(xhr) {
					xhr.setRequestHeader("X-WP-Nonce", _this2._nonce);
				},
				data: data,
				dataType: "json",
				success: this.processResponse
			});
		}

		/**
   * Process response from the index request for posts.
   *
   * @param {Array} response The list of found posts from the server.
   * @returns {void}
   */

	}, {
		key: "processResponse",
		value: function processResponse(response) {
			var _this3 = this;

			var processPromises = response.map(function (post) {
				return _this3.processPost(post);
			});

			Promise.all(processPromises).then(this.continueProcessing).catch(this.continueProcessing);
		}

		/**
   * Continues processing by going to the next page if there is one.
   *
   * @returns {void}
   */

	}, {
		key: "continueProcessing",
		value: function continueProcessing() {
			this.emit("processedPage", this._currentPage, this._totalPages);

			if (this._currentPage < this._totalPages) {
				this._currentPage += 1;
				this.calculate();
			} else {
				this.emit("complete");
			}
		}

		/**
   * Processes a post returned from the REST API.
   *
   * @param {Object} post A post object with rendered content.
   * @returns {Promise} Resolves when the prominent words are saved for the post.
   */

	}, {
		key: "processPost",
		value: function processPost(post) {
			var content = post.content.rendered;

			var prominentWords = (0, _relevantWords.getRelevantWords)(content);

			var prominentWordStorage = new _ProminentWordStorage2.default({
				postID: post.id,
				rootUrl: this._rootUrl,
				nonce: this._nonce
			});

			return prominentWordStorage.saveProminentWords(prominentWords).then(this.incrementProcessedPosts, this.incrementProcessedPosts);
		}

		/**
   * Increments the amount of processed posts by one.
   *
   * @returns {void}
   */

	}, {
		key: "incrementProcessedPosts",
		value: function incrementProcessedPosts() {
			this._processedPosts += 1;

			this.emit("processedPost", this._processedPosts, this._totalPosts);
		}
	}]);

	return SiteWideCalculation;
}(_events2.default);

exports.default = SiteWideCalculation;

},{"./ProminentWordStorage":2,"events":5,"yoastseo/js/stringProcessing/relevantWords":195}],4:[function(require,module,exports){
"use strict";

var _siteWideCalculation = require("./keywordSuggestions/siteWideCalculation");

var _siteWideCalculation2 = _interopRequireDefault(_siteWideCalculation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var settings = yoastSiteWideAnalysisData.data; /* global yoastSiteWideAnalysisData */

var prominentWordCalculation = null;
var progressContainer = void 0,
    completedContainer = void 0;

/**
 * Start recalculating.
 *
 * @param {number} postCount The number of posts to recalculate.
 * @param {boolean} recalculateAll Whether to recalculate all posts.
 * @returns {void}
 */
function startRecalculating(postCount) {
	var recalculateAll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	// Prevent duplicate calculation.
	if (prominentWordCalculation !== null) {
		return;
	}

	var progressElement = jQuery(".yoast-js-prominent-words-progress-current");

	progressContainer.show();

	prominentWordCalculation = new _siteWideCalculation2.default({
		totalPosts: postCount,
		recalculateAll: recalculateAll,
		rootUrl: settings.restApi.root,
		nonce: settings.restApi.nonce,
		allProminentWordIds: settings.allWords
	});

	prominentWordCalculation.on("processedPost", function (postCount) {
		progressElement.html(postCount);
	});

	prominentWordCalculation.start();

	// Free up the variable to start another recalculation.
	prominentWordCalculation.on("complete", function () {
		prominentWordCalculation = null;

		progressContainer.hide();
		completedContainer.show();
	});
}

/**
 * Initializes the site wide analysis tab.
 *
 * @returns {void}
 */
function init() {
	jQuery(".yoast-js-calculate-prominent-words--all").on("click", function () {
		startRecalculating(settings.amount.total);

		jQuery(this).hide();
	});

	progressContainer = jQuery(".yoast-js-prominent-words-progress");
	progressContainer.hide();

	completedContainer = jQuery(".yoast-js-prominent-words-completed");
	completedContainer.hide();
}

jQuery(init);

},{"./keywordSuggestions/siteWideCalculation":3}],5:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],6:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":83,"./_root":119}],7:[function(require,module,exports){
var hashClear = require('./_hashClear'),
    hashDelete = require('./_hashDelete'),
    hashGet = require('./_hashGet'),
    hashHas = require('./_hashHas'),
    hashSet = require('./_hashSet');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;

},{"./_hashClear":88,"./_hashDelete":89,"./_hashGet":90,"./_hashHas":91,"./_hashSet":92}],8:[function(require,module,exports){
var listCacheClear = require('./_listCacheClear'),
    listCacheDelete = require('./_listCacheDelete'),
    listCacheGet = require('./_listCacheGet'),
    listCacheHas = require('./_listCacheHas'),
    listCacheSet = require('./_listCacheSet');

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;

},{"./_listCacheClear":100,"./_listCacheDelete":101,"./_listCacheGet":102,"./_listCacheHas":103,"./_listCacheSet":104}],9:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":83,"./_root":119}],10:[function(require,module,exports){
var mapCacheClear = require('./_mapCacheClear'),
    mapCacheDelete = require('./_mapCacheDelete'),
    mapCacheGet = require('./_mapCacheGet'),
    mapCacheHas = require('./_mapCacheHas'),
    mapCacheSet = require('./_mapCacheSet');

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;

},{"./_mapCacheClear":105,"./_mapCacheDelete":106,"./_mapCacheGet":107,"./_mapCacheHas":108,"./_mapCacheSet":109}],11:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":83,"./_root":119}],12:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":83,"./_root":119}],13:[function(require,module,exports){
var MapCache = require('./_MapCache'),
    setCacheAdd = require('./_setCacheAdd'),
    setCacheHas = require('./_setCacheHas');

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;

},{"./_MapCache":10,"./_setCacheAdd":120,"./_setCacheHas":121}],14:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    stackClear = require('./_stackClear'),
    stackDelete = require('./_stackDelete'),
    stackGet = require('./_stackGet'),
    stackHas = require('./_stackHas'),
    stackSet = require('./_stackSet');

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;

},{"./_ListCache":8,"./_stackClear":125,"./_stackDelete":126,"./_stackGet":127,"./_stackHas":128,"./_stackSet":129}],15:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":119}],16:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":119}],17:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":83,"./_root":119}],18:[function(require,module,exports){
/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;

},{}],19:[function(require,module,exports){
/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],20:[function(require,module,exports){
/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;

},{}],21:[function(require,module,exports){
var baseIndexOf = require('./_baseIndexOf');

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

module.exports = arrayIncludes;

},{"./_baseIndexOf":40}],22:[function(require,module,exports){
/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

module.exports = arrayIncludesWith;

},{}],23:[function(require,module,exports){
var baseTimes = require('./_baseTimes'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isIndex = require('./_isIndex'),
    isTypedArray = require('./isTypedArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = arrayLikeKeys;

},{"./_baseTimes":63,"./_isIndex":94,"./isArguments":148,"./isArray":149,"./isBuffer":152,"./isTypedArray":162}],24:[function(require,module,exports){
/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

},{}],25:[function(require,module,exports){
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;

},{}],26:[function(require,module,exports){
/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;

},{}],27:[function(require,module,exports){
var baseAssignValue = require('./_baseAssignValue'),
    eq = require('./eq');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignValue;

},{"./_baseAssignValue":29,"./eq":135}],28:[function(require,module,exports){
var eq = require('./eq');

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;

},{"./eq":135}],29:[function(require,module,exports){
var defineProperty = require('./_defineProperty');

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

module.exports = baseAssignValue;

},{"./_defineProperty":75}],30:[function(require,module,exports){
var baseForOwn = require('./_baseForOwn'),
    createBaseEach = require('./_createBaseEach');

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;

},{"./_baseForOwn":35,"./_createBaseEach":72}],31:[function(require,module,exports){
var baseEach = require('./_baseEach');

/**
 * The base implementation of `_.filter` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function baseFilter(collection, predicate) {
  var result = [];
  baseEach(collection, function(value, index, collection) {
    if (predicate(value, index, collection)) {
      result.push(value);
    }
  });
  return result;
}

module.exports = baseFilter;

},{"./_baseEach":30}],32:[function(require,module,exports){
/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;

},{}],33:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    isFlattenable = require('./_isFlattenable');

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;

},{"./_arrayPush":25,"./_isFlattenable":93}],34:[function(require,module,exports){
var createBaseFor = require('./_createBaseFor');

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;

},{"./_createBaseFor":73}],35:[function(require,module,exports){
var baseFor = require('./_baseFor'),
    keys = require('./keys');

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;

},{"./_baseFor":34,"./keys":164}],36:[function(require,module,exports){
var castPath = require('./_castPath'),
    toKey = require('./_toKey');

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;

},{"./_castPath":70,"./_toKey":132}],37:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    getRawTag = require('./_getRawTag'),
    objectToString = require('./_objectToString');

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  value = Object(value);
  return (symToStringTag && symToStringTag in value)
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

},{"./_Symbol":15,"./_getRawTag":84,"./_objectToString":116}],38:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHas(object, key) {
  return object != null && hasOwnProperty.call(object, key);
}

module.exports = baseHas;

},{}],39:[function(require,module,exports){
/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

module.exports = baseHasIn;

},{}],40:[function(require,module,exports){
var baseFindIndex = require('./_baseFindIndex'),
    baseIsNaN = require('./_baseIsNaN'),
    strictIndexOf = require('./_strictIndexOf');

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

module.exports = baseIndexOf;

},{"./_baseFindIndex":32,"./_baseIsNaN":46,"./_strictIndexOf":130}],41:[function(require,module,exports){
var SetCache = require('./_SetCache'),
    arrayIncludes = require('./_arrayIncludes'),
    arrayIncludesWith = require('./_arrayIncludesWith'),
    arrayMap = require('./_arrayMap'),
    baseUnary = require('./_baseUnary'),
    cacheHas = require('./_cacheHas');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min;

/**
 * The base implementation of methods like `_.intersection`, without support
 * for iteratee shorthands, that accepts an array of arrays to inspect.
 *
 * @private
 * @param {Array} arrays The arrays to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of shared values.
 */
function baseIntersection(arrays, iteratee, comparator) {
  var includes = comparator ? arrayIncludesWith : arrayIncludes,
      length = arrays[0].length,
      othLength = arrays.length,
      othIndex = othLength,
      caches = Array(othLength),
      maxLength = Infinity,
      result = [];

  while (othIndex--) {
    var array = arrays[othIndex];
    if (othIndex && iteratee) {
      array = arrayMap(array, baseUnary(iteratee));
    }
    maxLength = nativeMin(array.length, maxLength);
    caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
      ? new SetCache(othIndex && array)
      : undefined;
  }
  array = arrays[0];

  var index = -1,
      seen = caches[0];

  outer:
  while (++index < length && result.length < maxLength) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (!(seen
          ? cacheHas(seen, computed)
          : includes(result, computed, comparator)
        )) {
      othIndex = othLength;
      while (--othIndex) {
        var cache = caches[othIndex];
        if (!(cache
              ? cacheHas(cache, computed)
              : includes(arrays[othIndex], computed, comparator))
            ) {
          continue outer;
        }
      }
      if (seen) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

module.exports = baseIntersection;

},{"./_SetCache":13,"./_arrayIncludes":21,"./_arrayIncludesWith":22,"./_arrayMap":24,"./_baseUnary":65,"./_cacheHas":67}],42:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

module.exports = baseIsArguments;

},{"./_baseGetTag":37,"./isObjectLike":159}],43:[function(require,module,exports){
var baseIsEqualDeep = require('./_baseIsEqualDeep'),
    isObject = require('./isObject'),
    isObjectLike = require('./isObjectLike');

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, bitmask, customizer, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;

},{"./_baseIsEqualDeep":44,"./isObject":158,"./isObjectLike":159}],44:[function(require,module,exports){
var Stack = require('./_Stack'),
    equalArrays = require('./_equalArrays'),
    equalByTag = require('./_equalByTag'),
    equalObjects = require('./_equalObjects'),
    getTag = require('./_getTag'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isTypedArray = require('./isTypedArray');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = getTag(object);
    objTag = objTag == argsTag ? objectTag : objTag;
  }
  if (!othIsArr) {
    othTag = getTag(other);
    othTag = othTag == argsTag ? objectTag : othTag;
  }
  var objIsObj = objTag == objectTag,
      othIsObj = othTag == objectTag,
      isSameTag = objTag == othTag;

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}

module.exports = baseIsEqualDeep;

},{"./_Stack":14,"./_equalArrays":76,"./_equalByTag":77,"./_equalObjects":78,"./_getTag":85,"./isArray":149,"./isBuffer":152,"./isTypedArray":162}],45:[function(require,module,exports){
var Stack = require('./_Stack'),
    baseIsEqual = require('./_baseIsEqual');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;

},{"./_Stack":14,"./_baseIsEqual":43}],46:[function(require,module,exports){
/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

module.exports = baseIsNaN;

},{}],47:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isMasked = require('./_isMasked'),
    isObject = require('./isObject'),
    toSource = require('./_toSource');

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;

},{"./_isMasked":97,"./_toSource":133,"./isFunction":154,"./isObject":158}],48:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isLength = require('./isLength'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

module.exports = baseIsTypedArray;

},{"./_baseGetTag":37,"./isLength":155,"./isObjectLike":159}],49:[function(require,module,exports){
var baseMatches = require('./_baseMatches'),
    baseMatchesProperty = require('./_baseMatchesProperty'),
    identity = require('./identity'),
    isArray = require('./isArray'),
    property = require('./property');

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;

},{"./_baseMatches":52,"./_baseMatchesProperty":53,"./identity":145,"./isArray":149,"./property":169}],50:[function(require,module,exports){
var isPrototype = require('./_isPrototype'),
    nativeKeys = require('./_nativeKeys');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeys;

},{"./_isPrototype":98,"./_nativeKeys":114}],51:[function(require,module,exports){
var baseEach = require('./_baseEach'),
    isArrayLike = require('./isArrayLike');

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

module.exports = baseMap;

},{"./_baseEach":30,"./isArrayLike":150}],52:[function(require,module,exports){
var baseIsMatch = require('./_baseIsMatch'),
    getMatchData = require('./_getMatchData'),
    matchesStrictComparable = require('./_matchesStrictComparable');

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

module.exports = baseMatches;

},{"./_baseIsMatch":45,"./_getMatchData":82,"./_matchesStrictComparable":111}],53:[function(require,module,exports){
var baseIsEqual = require('./_baseIsEqual'),
    get = require('./get'),
    hasIn = require('./hasIn'),
    isKey = require('./_isKey'),
    isStrictComparable = require('./_isStrictComparable'),
    matchesStrictComparable = require('./_matchesStrictComparable'),
    toKey = require('./_toKey');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
  };
}

module.exports = baseMatchesProperty;

},{"./_baseIsEqual":43,"./_isKey":95,"./_isStrictComparable":99,"./_matchesStrictComparable":111,"./_toKey":132,"./get":142,"./hasIn":144}],54:[function(require,module,exports){
var basePickBy = require('./_basePickBy'),
    hasIn = require('./hasIn');

/**
 * The base implementation of `_.pick` without support for individual
 * property identifiers.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @returns {Object} Returns the new object.
 */
function basePick(object, paths) {
  object = Object(object);
  return basePickBy(object, paths, function(value, path) {
    return hasIn(object, path);
  });
}

module.exports = basePick;

},{"./_basePickBy":55,"./hasIn":144}],55:[function(require,module,exports){
var baseGet = require('./_baseGet'),
    baseSet = require('./_baseSet'),
    castPath = require('./_castPath');

/**
 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @param {Function} predicate The function invoked per property.
 * @returns {Object} Returns the new object.
 */
function basePickBy(object, paths, predicate) {
  var index = -1,
      length = paths.length,
      result = {};

  while (++index < length) {
    var path = paths[index],
        value = baseGet(object, path);

    if (predicate(value, path)) {
      baseSet(result, castPath(path, object), value);
    }
  }
  return result;
}

module.exports = basePickBy;

},{"./_baseGet":36,"./_baseSet":59,"./_castPath":70}],56:[function(require,module,exports){
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],57:[function(require,module,exports){
var baseGet = require('./_baseGet');

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

module.exports = basePropertyDeep;

},{"./_baseGet":36}],58:[function(require,module,exports){
var identity = require('./identity'),
    overRest = require('./_overRest'),
    setToString = require('./_setToString');

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

module.exports = baseRest;

},{"./_overRest":118,"./_setToString":123,"./identity":145}],59:[function(require,module,exports){
var assignValue = require('./_assignValue'),
    castPath = require('./_castPath'),
    isIndex = require('./_isIndex'),
    isObject = require('./isObject'),
    toKey = require('./_toKey');

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

module.exports = baseSet;

},{"./_assignValue":27,"./_castPath":70,"./_isIndex":94,"./_toKey":132,"./isObject":158}],60:[function(require,module,exports){
var constant = require('./constant'),
    defineProperty = require('./_defineProperty'),
    identity = require('./identity');

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

module.exports = baseSetToString;

},{"./_defineProperty":75,"./constant":134,"./identity":145}],61:[function(require,module,exports){
/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;

},{}],62:[function(require,module,exports){
/**
 * The base implementation of `_.sum` and `_.sumBy` without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {number} Returns the sum.
 */
function baseSum(array, iteratee) {
  var result,
      index = -1,
      length = array.length;

  while (++index < length) {
    var current = iteratee(array[index]);
    if (current !== undefined) {
      result = result === undefined ? current : (result + current);
    }
  }
  return result;
}

module.exports = baseSum;

},{}],63:[function(require,module,exports){
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;

},{}],64:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    arrayMap = require('./_arrayMap'),
    isArray = require('./isArray'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;

},{"./_Symbol":15,"./_arrayMap":24,"./isArray":149,"./isSymbol":161}],65:[function(require,module,exports){
/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;

},{}],66:[function(require,module,exports){
var arrayMap = require('./_arrayMap');

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}

module.exports = baseValues;

},{"./_arrayMap":24}],67:[function(require,module,exports){
/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;

},{}],68:[function(require,module,exports){
var isArrayLikeObject = require('./isArrayLikeObject');

/**
 * Casts `value` to an empty array if it's not an array like object.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array|Object} Returns the cast array-like object.
 */
function castArrayLikeObject(value) {
  return isArrayLikeObject(value) ? value : [];
}

module.exports = castArrayLikeObject;

},{"./isArrayLikeObject":151}],69:[function(require,module,exports){
var identity = require('./identity');

/**
 * Casts `value` to `identity` if it's not a function.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Function} Returns cast function.
 */
function castFunction(value) {
  return typeof value == 'function' ? value : identity;
}

module.exports = castFunction;

},{"./identity":145}],70:[function(require,module,exports){
var isArray = require('./isArray'),
    isKey = require('./_isKey'),
    stringToPath = require('./_stringToPath'),
    toString = require('./toString');

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;

},{"./_isKey":95,"./_stringToPath":131,"./isArray":149,"./toString":176}],71:[function(require,module,exports){
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":119}],72:[function(require,module,exports){
var isArrayLike = require('./isArrayLike');

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;

},{"./isArrayLike":150}],73:[function(require,module,exports){
/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;

},{}],74:[function(require,module,exports){
var baseIteratee = require('./_baseIteratee'),
    isArrayLike = require('./isArrayLike'),
    keys = require('./keys');

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} findIndexFunc The function to find the collection index.
 * @returns {Function} Returns the new find function.
 */
function createFind(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!isArrayLike(collection)) {
      var iteratee = baseIteratee(predicate, 3);
      collection = keys(collection);
      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
    }
    var index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
  };
}

module.exports = createFind;

},{"./_baseIteratee":49,"./isArrayLike":150,"./keys":164}],75:[function(require,module,exports){
var getNative = require('./_getNative');

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;

},{"./_getNative":83}],76:[function(require,module,exports){
var SetCache = require('./_SetCache'),
    arraySome = require('./_arraySome'),
    cacheHas = require('./_cacheHas');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!cacheHas(seen, othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;

},{"./_SetCache":13,"./_arraySome":26,"./_cacheHas":67}],77:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    Uint8Array = require('./_Uint8Array'),
    eq = require('./eq'),
    equalArrays = require('./_equalArrays'),
    mapToArray = require('./_mapToArray'),
    setToArray = require('./_setToArray');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;

},{"./_Symbol":15,"./_Uint8Array":16,"./_equalArrays":76,"./_mapToArray":110,"./_setToArray":122,"./eq":135}],78:[function(require,module,exports){
var keys = require('./keys');

/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;

},{"./keys":164}],79:[function(require,module,exports){
var flatten = require('./flatten'),
    overRest = require('./_overRest'),
    setToString = require('./_setToString');

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */
function flatRest(func) {
  return setToString(overRest(func, undefined, flatten), func + '');
}

module.exports = flatRest;

},{"./_overRest":118,"./_setToString":123,"./flatten":140}],80:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],81:[function(require,module,exports){
var isKeyable = require('./_isKeyable');

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;

},{"./_isKeyable":96}],82:[function(require,module,exports){
var isStrictComparable = require('./_isStrictComparable'),
    keys = require('./keys');

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

module.exports = getMatchData;

},{"./_isStrictComparable":99,"./keys":164}],83:[function(require,module,exports){
var baseIsNative = require('./_baseIsNative'),
    getValue = require('./_getValue');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;

},{"./_baseIsNative":47,"./_getValue":86}],84:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

},{"./_Symbol":15}],85:[function(require,module,exports){
var DataView = require('./_DataView'),
    Map = require('./_Map'),
    Promise = require('./_Promise'),
    Set = require('./_Set'),
    WeakMap = require('./_WeakMap'),
    baseGetTag = require('./_baseGetTag'),
    toSource = require('./_toSource');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;

},{"./_DataView":6,"./_Map":9,"./_Promise":11,"./_Set":12,"./_WeakMap":17,"./_baseGetTag":37,"./_toSource":133}],86:[function(require,module,exports){
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;

},{}],87:[function(require,module,exports){
var castPath = require('./_castPath'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isIndex = require('./_isIndex'),
    isLength = require('./isLength'),
    toKey = require('./_toKey');

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      result = false;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result || ++index != length) {
    return result;
  }
  length = object == null ? 0 : object.length;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

module.exports = hasPath;

},{"./_castPath":70,"./_isIndex":94,"./_toKey":132,"./isArguments":148,"./isArray":149,"./isLength":155}],88:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

module.exports = hashClear;

},{"./_nativeCreate":113}],89:[function(require,module,exports){
/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = hashDelete;

},{}],90:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;

},{"./_nativeCreate":113}],91:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

module.exports = hashHas;

},{"./_nativeCreate":113}],92:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;

},{"./_nativeCreate":113}],93:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray');

/** Built-in value references. */
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

module.exports = isFlattenable;

},{"./_Symbol":15,"./isArguments":148,"./isArray":149}],94:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;

},{}],95:[function(require,module,exports){
var isArray = require('./isArray'),
    isSymbol = require('./isSymbol');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;

},{"./isArray":149,"./isSymbol":161}],96:[function(require,module,exports){
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;

},{}],97:[function(require,module,exports){
var coreJsData = require('./_coreJsData');

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;

},{"./_coreJsData":71}],98:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;

},{}],99:[function(require,module,exports){
var isObject = require('./isObject');

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;

},{"./isObject":158}],100:[function(require,module,exports){
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

module.exports = listCacheClear;

},{}],101:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

module.exports = listCacheDelete;

},{"./_assocIndexOf":28}],102:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;

},{"./_assocIndexOf":28}],103:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;

},{"./_assocIndexOf":28}],104:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;

},{"./_assocIndexOf":28}],105:[function(require,module,exports){
var Hash = require('./_Hash'),
    ListCache = require('./_ListCache'),
    Map = require('./_Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;

},{"./_Hash":7,"./_ListCache":8,"./_Map":9}],106:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

module.exports = mapCacheDelete;

},{"./_getMapData":81}],107:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;

},{"./_getMapData":81}],108:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;

},{"./_getMapData":81}],109:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

module.exports = mapCacheSet;

},{"./_getMapData":81}],110:[function(require,module,exports){
/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;

},{}],111:[function(require,module,exports){
/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

module.exports = matchesStrictComparable;

},{}],112:[function(require,module,exports){
var memoize = require('./memoize');

/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;

/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */
function memoizeCapped(func) {
  var result = memoize(func, function(key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }
    return key;
  });

  var cache = result.cache;
  return result;
}

module.exports = memoizeCapped;

},{"./memoize":166}],113:[function(require,module,exports){
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":83}],114:[function(require,module,exports){
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":117}],115:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

},{"./_freeGlobal":80}],116:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

},{}],117:[function(require,module,exports){
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;

},{}],118:[function(require,module,exports){
var apply = require('./_apply');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

module.exports = overRest;

},{"./_apply":18}],119:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":80}],120:[function(require,module,exports){
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;

},{}],121:[function(require,module,exports){
/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;

},{}],122:[function(require,module,exports){
/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;

},{}],123:[function(require,module,exports){
var baseSetToString = require('./_baseSetToString'),
    shortOut = require('./_shortOut');

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

module.exports = setToString;

},{"./_baseSetToString":60,"./_shortOut":124}],124:[function(require,module,exports){
/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

module.exports = shortOut;

},{}],125:[function(require,module,exports){
var ListCache = require('./_ListCache');

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

module.exports = stackClear;

},{"./_ListCache":8}],126:[function(require,module,exports){
/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

module.exports = stackDelete;

},{}],127:[function(require,module,exports){
/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;

},{}],128:[function(require,module,exports){
/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;

},{}],129:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    Map = require('./_Map'),
    MapCache = require('./_MapCache');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

module.exports = stackSet;

},{"./_ListCache":8,"./_Map":9,"./_MapCache":10}],130:[function(require,module,exports){
/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = strictIndexOf;

},{}],131:[function(require,module,exports){
var memoizeCapped = require('./_memoizeCapped');

/** Used to match property names within property paths. */
var reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;

},{"./_memoizeCapped":112}],132:[function(require,module,exports){
var isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;

},{"./isSymbol":161}],133:[function(require,module,exports){
/** Used for built-in method references. */
var funcProto = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;

},{}],134:[function(require,module,exports){
/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

module.exports = constant;

},{}],135:[function(require,module,exports){
/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;

},{}],136:[function(require,module,exports){
var arrayFilter = require('./_arrayFilter'),
    baseFilter = require('./_baseFilter'),
    baseIteratee = require('./_baseIteratee'),
    isArray = require('./isArray');

/**
 * Iterates over elements of `collection`, returning an array of all elements
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * **Note:** Unlike `_.remove`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 * @see _.reject
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * _.filter(users, function(o) { return !o.active; });
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.filter(users, { 'age': 36, 'active': true });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.filter(users, ['active', false]);
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.filter(users, 'active');
 * // => objects for ['barney']
 */
function filter(collection, predicate) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(collection, baseIteratee(predicate, 3));
}

module.exports = filter;

},{"./_arrayFilter":20,"./_baseFilter":31,"./_baseIteratee":49,"./isArray":149}],137:[function(require,module,exports){
var createFind = require('./_createFind'),
    findIndex = require('./findIndex');

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.find(users, function(o) { return o.age < 40; });
 * // => object for 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.find(users, { 'age': 1, 'active': true });
 * // => object for 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.find(users, ['active', false]);
 * // => object for 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.find(users, 'active');
 * // => object for 'barney'
 */
var find = createFind(findIndex);

module.exports = find;

},{"./_createFind":74,"./findIndex":138}],138:[function(require,module,exports){
var baseFindIndex = require('./_baseFindIndex'),
    baseIteratee = require('./_baseIteratee'),
    toInteger = require('./toInteger');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This method is like `_.find` except that it returns the index of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.findIndex(users, function(o) { return o.user == 'barney'; });
 * // => 0
 *
 * // The `_.matches` iteratee shorthand.
 * _.findIndex(users, { 'user': 'fred', 'active': false });
 * // => 1
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findIndex(users, ['active', false]);
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.findIndex(users, 'active');
 * // => 2
 */
function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return baseFindIndex(array, baseIteratee(predicate, 3), index);
}

module.exports = findIndex;

},{"./_baseFindIndex":32,"./_baseIteratee":49,"./toInteger":174}],139:[function(require,module,exports){
var baseFlatten = require('./_baseFlatten'),
    map = require('./map');

/**
 * Creates a flattened array of values by running each element in `collection`
 * thru `iteratee` and flattening the mapped results. The iteratee is invoked
 * with three arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * function duplicate(n) {
 *   return [n, n];
 * }
 *
 * _.flatMap([1, 2], duplicate);
 * // => [1, 1, 2, 2]
 */
function flatMap(collection, iteratee) {
  return baseFlatten(map(collection, iteratee), 1);
}

module.exports = flatMap;

},{"./_baseFlatten":33,"./map":165}],140:[function(require,module,exports){
var baseFlatten = require('./_baseFlatten');

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}

module.exports = flatten;

},{"./_baseFlatten":33}],141:[function(require,module,exports){
var arrayEach = require('./_arrayEach'),
    baseEach = require('./_baseEach'),
    castFunction = require('./_castFunction'),
    isArray = require('./isArray');

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _.forEach([1, 2], function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, castFunction(iteratee));
}

module.exports = forEach;

},{"./_arrayEach":19,"./_baseEach":30,"./_castFunction":69,"./isArray":149}],142:[function(require,module,exports){
var baseGet = require('./_baseGet');

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;

},{"./_baseGet":36}],143:[function(require,module,exports){
var baseHas = require('./_baseHas'),
    hasPath = require('./_hasPath');

/**
 * Checks if `path` is a direct property of `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = { 'a': { 'b': 2 } };
 * var other = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.has(object, 'a');
 * // => true
 *
 * _.has(object, 'a.b');
 * // => true
 *
 * _.has(object, ['a', 'b']);
 * // => true
 *
 * _.has(other, 'a');
 * // => false
 */
function has(object, path) {
  return object != null && hasPath(object, path, baseHas);
}

module.exports = has;

},{"./_baseHas":38,"./_hasPath":87}],144:[function(require,module,exports){
var baseHasIn = require('./_baseHasIn'),
    hasPath = require('./_hasPath');

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

module.exports = hasIn;

},{"./_baseHasIn":39,"./_hasPath":87}],145:[function(require,module,exports){
/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],146:[function(require,module,exports){
var baseIndexOf = require('./_baseIndexOf'),
    isArrayLike = require('./isArrayLike'),
    isString = require('./isString'),
    toInteger = require('./toInteger'),
    values = require('./values');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Checks if `value` is in `collection`. If `collection` is a string, it's
 * checked for a substring of `value`, otherwise
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * is used for equality comparisons. If `fromIndex` is negative, it's used as
 * the offset from the end of `collection`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
 * @returns {boolean} Returns `true` if `value` is found, else `false`.
 * @example
 *
 * _.includes([1, 2, 3], 1);
 * // => true
 *
 * _.includes([1, 2, 3], 1, 2);
 * // => false
 *
 * _.includes({ 'a': 1, 'b': 2 }, 1);
 * // => true
 *
 * _.includes('abcd', 'bc');
 * // => true
 */
function includes(collection, value, fromIndex, guard) {
  collection = isArrayLike(collection) ? collection : values(collection);
  fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

  var length = collection.length;
  if (fromIndex < 0) {
    fromIndex = nativeMax(length + fromIndex, 0);
  }
  return isString(collection)
    ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
    : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
}

module.exports = includes;

},{"./_baseIndexOf":40,"./isArrayLike":150,"./isString":160,"./toInteger":174,"./values":177}],147:[function(require,module,exports){
var arrayMap = require('./_arrayMap'),
    baseIntersection = require('./_baseIntersection'),
    baseRest = require('./_baseRest'),
    castArrayLikeObject = require('./_castArrayLikeObject');

/**
 * Creates an array of unique values that are included in all given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order and references of result values are
 * determined by the first array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of intersecting values.
 * @example
 *
 * _.intersection([2, 1], [2, 3]);
 * // => [2]
 */
var intersection = baseRest(function(arrays) {
  var mapped = arrayMap(arrays, castArrayLikeObject);
  return (mapped.length && mapped[0] === arrays[0])
    ? baseIntersection(mapped)
    : [];
});

module.exports = intersection;

},{"./_arrayMap":24,"./_baseIntersection":41,"./_baseRest":58,"./_castArrayLikeObject":68}],148:[function(require,module,exports){
var baseIsArguments = require('./_baseIsArguments'),
    isObjectLike = require('./isObjectLike');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

module.exports = isArguments;

},{"./_baseIsArguments":42,"./isObjectLike":159}],149:[function(require,module,exports){
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

},{}],150:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

module.exports = isArrayLike;

},{"./isFunction":154,"./isLength":155}],151:[function(require,module,exports){
var isArrayLike = require('./isArrayLike'),
    isObjectLike = require('./isObjectLike');

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

module.exports = isArrayLikeObject;

},{"./isArrayLike":150,"./isObjectLike":159}],152:[function(require,module,exports){
var root = require('./_root'),
    stubFalse = require('./stubFalse');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

},{"./_root":119,"./stubFalse":170}],153:[function(require,module,exports){
var baseKeys = require('./_baseKeys'),
    getTag = require('./_getTag'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isArrayLike = require('./isArrayLike'),
    isBuffer = require('./isBuffer'),
    isPrototype = require('./_isPrototype'),
    isTypedArray = require('./isTypedArray');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (value == null) {
    return true;
  }
  if (isArrayLike(value) &&
      (isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
        isBuffer(value) || isTypedArray(value) || isArguments(value))) {
    return !value.length;
  }
  var tag = getTag(value);
  if (tag == mapTag || tag == setTag) {
    return !value.size;
  }
  if (isPrototype(value)) {
    return !baseKeys(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}

module.exports = isEmpty;

},{"./_baseKeys":50,"./_getTag":85,"./_isPrototype":98,"./isArguments":148,"./isArray":149,"./isArrayLike":150,"./isBuffer":152,"./isTypedArray":162}],154:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObject = require('./isObject');

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

module.exports = isFunction;

},{"./_baseGetTag":37,"./isObject":158}],155:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],156:[function(require,module,exports){
var isNumber = require('./isNumber');

/**
 * Checks if `value` is `NaN`.
 *
 * **Note:** This method is based on
 * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
 * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
 * `undefined` and other non-number values.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 * @example
 *
 * _.isNaN(NaN);
 * // => true
 *
 * _.isNaN(new Number(NaN));
 * // => true
 *
 * isNaN(undefined);
 * // => true
 *
 * _.isNaN(undefined);
 * // => false
 */
function isNaN(value) {
  // An `NaN` primitive is the only value that is not equal to itself.
  // Perform the `toStringTag` check first to avoid errors with some
  // ActiveX objects in IE.
  return isNumber(value) && value != +value;
}

module.exports = isNaN;

},{"./isNumber":157}],157:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var numberTag = '[object Number]';

/**
 * Checks if `value` is classified as a `Number` primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
 * classified as numbers, use the `_.isFinite` method.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a number, else `false`.
 * @example
 *
 * _.isNumber(3);
 * // => true
 *
 * _.isNumber(Number.MIN_VALUE);
 * // => true
 *
 * _.isNumber(Infinity);
 * // => true
 *
 * _.isNumber('3');
 * // => false
 */
function isNumber(value) {
  return typeof value == 'number' ||
    (isObjectLike(value) && baseGetTag(value) == numberTag);
}

module.exports = isNumber;

},{"./_baseGetTag":37,"./isObjectLike":159}],158:[function(require,module,exports){
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],159:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],160:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isArray = require('./isArray'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var stringTag = '[object String]';

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
}

module.exports = isString;

},{"./_baseGetTag":37,"./isArray":149,"./isObjectLike":159}],161:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;

},{"./_baseGetTag":37,"./isObjectLike":159}],162:[function(require,module,exports){
var baseIsTypedArray = require('./_baseIsTypedArray'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;

},{"./_baseIsTypedArray":48,"./_baseUnary":65,"./_nodeUtil":115}],163:[function(require,module,exports){
/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
function isUndefined(value) {
  return value === undefined;
}

module.exports = isUndefined;

},{}],164:[function(require,module,exports){
var arrayLikeKeys = require('./_arrayLikeKeys'),
    baseKeys = require('./_baseKeys'),
    isArrayLike = require('./isArrayLike');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

module.exports = keys;

},{"./_arrayLikeKeys":23,"./_baseKeys":50,"./isArrayLike":150}],165:[function(require,module,exports){
var arrayMap = require('./_arrayMap'),
    baseIteratee = require('./_baseIteratee'),
    baseMap = require('./_baseMap'),
    isArray = require('./isArray');

/**
 * Creates an array of values by running each element in `collection` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * _.map([4, 8], square);
 * // => [16, 64]
 *
 * _.map({ 'a': 4, 'b': 8 }, square);
 * // => [16, 64] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map(collection, iteratee) {
  var func = isArray(collection) ? arrayMap : baseMap;
  return func(collection, baseIteratee(iteratee, 3));
}

module.exports = map;

},{"./_arrayMap":24,"./_baseIteratee":49,"./_baseMap":51,"./isArray":149}],166:[function(require,module,exports){
var MapCache = require('./_MapCache');

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Expose `MapCache`.
memoize.Cache = MapCache;

module.exports = memoize;

},{"./_MapCache":10}],167:[function(require,module,exports){
/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that negates the result of the predicate `func`. The
 * `func` predicate is invoked with the `this` binding and arguments of the
 * created function.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {Function} predicate The predicate to negate.
 * @returns {Function} Returns the new negated function.
 * @example
 *
 * function isEven(n) {
 *   return n % 2 == 0;
 * }
 *
 * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
 * // => [1, 3, 5]
 */
function negate(predicate) {
  if (typeof predicate != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  return function() {
    var args = arguments;
    switch (args.length) {
      case 0: return !predicate.call(this);
      case 1: return !predicate.call(this, args[0]);
      case 2: return !predicate.call(this, args[0], args[1]);
      case 3: return !predicate.call(this, args[0], args[1], args[2]);
    }
    return !predicate.apply(this, args);
  };
}

module.exports = negate;

},{}],168:[function(require,module,exports){
var basePick = require('./_basePick'),
    flatRest = require('./_flatRest');

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to pick.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pick(object, ['a', 'c']);
 * // => { 'a': 1, 'c': 3 }
 */
var pick = flatRest(function(object, paths) {
  return object == null ? {} : basePick(object, paths);
});

module.exports = pick;

},{"./_basePick":54,"./_flatRest":79}],169:[function(require,module,exports){
var baseProperty = require('./_baseProperty'),
    basePropertyDeep = require('./_basePropertyDeep'),
    isKey = require('./_isKey'),
    toKey = require('./_toKey');

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = property;

},{"./_baseProperty":56,"./_basePropertyDeep":57,"./_isKey":95,"./_toKey":132}],170:[function(require,module,exports){
/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;

},{}],171:[function(require,module,exports){
var baseSum = require('./_baseSum'),
    identity = require('./identity');

/**
 * Computes the sum of the values in `array`.
 *
 * @static
 * @memberOf _
 * @since 3.4.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {number} Returns the sum.
 * @example
 *
 * _.sum([4, 2, 8, 6]);
 * // => 20
 */
function sum(array) {
  return (array && array.length)
    ? baseSum(array, identity)
    : 0;
}

module.exports = sum;

},{"./_baseSum":62,"./identity":145}],172:[function(require,module,exports){
var baseSlice = require('./_baseSlice'),
    toInteger = require('./toInteger');

/**
 * Creates a slice of `array` with `n` elements taken from the beginning.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to take.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.take([1, 2, 3]);
 * // => [1]
 *
 * _.take([1, 2, 3], 2);
 * // => [1, 2]
 *
 * _.take([1, 2, 3], 5);
 * // => [1, 2, 3]
 *
 * _.take([1, 2, 3], 0);
 * // => []
 */
function take(array, n, guard) {
  if (!(array && array.length)) {
    return [];
  }
  n = (guard || n === undefined) ? 1 : toInteger(n);
  return baseSlice(array, 0, n < 0 ? 0 : n);
}

module.exports = take;

},{"./_baseSlice":61,"./toInteger":174}],173:[function(require,module,exports){
var toNumber = require('./toNumber');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

module.exports = toFinite;

},{"./toNumber":175}],174:[function(require,module,exports){
var toFinite = require('./toFinite');

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

module.exports = toInteger;

},{"./toFinite":173}],175:[function(require,module,exports){
var isObject = require('./isObject'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;

},{"./isObject":158,"./isSymbol":161}],176:[function(require,module,exports){
var baseToString = require('./_baseToString');

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;

},{"./_baseToString":64}],177:[function(require,module,exports){
var baseValues = require('./_baseValues'),
    keys = require('./keys');

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object == null ? [] : baseValues(object, keys(object));
}

module.exports = values;

},{"./_baseValues":66,"./keys":164}],178:[function(require,module,exports){
var findMatchingRule = function(rules, text){
  var i;
  for(i=0; i<rules.length; i++)
    if(rules[i].regex.test(text))
      return rules[i];
  return undefined;
};

var findMaxIndexAndRule = function(rules, text){
  var i, rule, last_matching_rule;
  for(i=0; i<text.length; i++){
    rule = findMatchingRule(rules, text.substring(0, i + 1));
    if(rule)
      last_matching_rule = rule;
    else if(last_matching_rule)
      return {max_index: i, rule: last_matching_rule};
  }
  return last_matching_rule ? {max_index: text.length, rule: last_matching_rule} : undefined;
};

module.exports = function(onToken_orig){
  var buffer = "";
  var rules = [];
  var line = 1;
  var col = 1;

  var onToken = function(src, type){
    onToken_orig({
      type: type,
      src: src,
      line: line,
      col: col
    });
    var lines = src.split("\n");
    line += lines.length - 1;
    col = (lines.length > 1 ? 1 : col) + lines[lines.length - 1].length;
  };

  return {
    addRule: function(regex, type){
      rules.push({regex: regex, type: type});
    },
    onText: function(text){
      var str = buffer + text;
      var m = findMaxIndexAndRule(rules, str);
      while(m && m.max_index !== str.length){
        onToken(str.substring(0, m.max_index), m.rule.type);

        //now find the next token
        str = str.substring(m.max_index);
        m = findMaxIndexAndRule(rules, str);
      }
      buffer = str;
    },
    end: function(){
      if(buffer.length === 0)
        return;

      var rule = findMatchingRule(rules, buffer);
      if(!rule){
        var err = new Error("unable to tokenize");
        err.tokenizer2 = {
          buffer: buffer,
          line: line,
          col: col
        };
        throw err;
      }

      onToken(buffer, rule.type);
    }
  };
};

},{}],179:[function(require,module,exports){
/** @module config/syllables */

var getLanguage = require( "../helpers/getLanguage.js" );
var isUndefined = require( "lodash/isUndefined" );

var de = require( "./syllables/de.json" );
var en = require( './syllables/en.json' );
var nl = require( './syllables/nl.json' );

module.exports = function( locale ) {
	if ( isUndefined( locale ) ) {
		locale = "en_US"
	}

	switch( getLanguage( locale ) ) {
		case "de":
			return de;
		case "nl":
			return nl;
		case "en":
		default:
			return en;
	}
};

},{"../helpers/getLanguage.js":183,"./syllables/de.json":180,"./syllables/en.json":181,"./syllables/nl.json":182,"lodash/isUndefined":163}],180:[function(require,module,exports){
module.exports={
	"vowels": "aeiouyäöüáéâàèîêâûôœ",
	"deviations": {
		"vowels": [
			{
				"fragments": [ "ouil", "deaux", "deau$", "oard", "äthiop", "euil", "veau", "eau$", "ueue", "lienisch", "ance$", "ence$", "time$",
					"once$", "ziat", "guette", "ête", "ôte$", "[hp]omme$", "[qdscn]ue$", "aire$", "ture$", "êpe$", "[^q]ui$", "tiche$",
					"vice$", "oile$", "zial", "cruis", "leas", "coa[ct]", "[^i]deal", "[fw]eat", "[lsx]ed$" ],
				"countModifier": -1
			},
			{
				"fragments": [ "aau", "a[äöüo]", "äue", "äeu", "aei", "aue", "aeu", "ael", "ai[aeo]", "saik", "aismus", "ä[aeoi]", "auä", "éa",
					"e[äaoö]", "ei[eo]", "ee[aeiou]", "eu[aäe]", "eum$", "eü", "o[aäöü]", "poet", "oo[eo]", "oie", "oei[^l]", "oeu[^f]", "öa", "[fgrz]ieu",
					"mieun", "tieur", "ieum", "i[aiuü]", "[^l]iä", "[^s]chien", "io[bcdfhjkmpqtuvwx]", "[bdhmprv]ion", "[lr]ior",
					"[^g]io[gs]", "[dr]ioz", "elioz", "zioni", "bio[lnorz]", "iö[^s]", "ie[ei]", "rier$", "öi[eg]", "[^r]öisch",
					"[^gqv]u[aeéioöuü]", "quie$", "quie[^s]", "uäu", "^us-", "^it-", "üe", "naiv", "aisch$", "aische$", "aische[nrs]$", "[lst]ien",
					"dien$", "gois", "[^g]rient", "[aeiou]y[aeiou]", "byi", "yä", "[a-z]y[ao]", "yau", "koor", "scient", "eriel", "[dg]oing" ],
				"countModifier": 1
			},
			{
				"fragments": [ "eauü", "ioi", "ioo", "ioa", "iii", "oai", "eueu" ],
				"countModifier": 1
			}
		],
		"words": {
			"full": [
				{ "word": "beach", "syllables": 1 },
				{ "word": "beat", "syllables": 1 },
				{ "word": "beau", "syllables": 1 },
				{ "word": "beaune", "syllables": 1 },
				{ "word": "belle", "syllables": 1 },
				{ "word": "bouche", "syllables": 1 },
				{ "word": "brake", "syllables": 1 },
				{ "word": "cache", "syllables": 1 },
				{ "word": "cache", "syllables": 1 },
				{ "word": "chaiselongue", "syllables": 2 },
				{ "word": "choke", "syllables": 1 },
				{ "word": "cordiale", "syllables": 3 },
				{ "word": "core", "syllables": 1 },
				{ "word": "dope", "syllables": 1 },
				{ "word": "eat", "syllables": 1 },
				{ "word": "eye", "syllables": 1 },
				{ "word": "fake", "syllables": 1 },
				{ "word": "fame", "syllables": 1 },
				{ "word": "fatigue", "syllables": 2 },
				{ "word": "femme", "syllables": 1 },
				{ "word": "force", "syllables": 1 },
				{ "word": "game", "syllables": 1 },
				{ "word": "games", "syllables": 1 },
				{ "word": "gate", "syllables": 1 },
				{ "word": "grande", "syllables": 1 },
				{ "word": "ice", "syllables": 1 },
				{ "word": "ion", "syllables": 2 },
				{ "word": "joke", "syllables": 1 },
				{ "word": "jupe", "syllables": 1 },
				{ "word": "maisch", "syllables": 1 },
				{ "word": "maische", "syllables": 2 },
				{ "word": "move", "syllables": 1 },
				{ "word": "native", "syllables": 2 },
				{ "word": "nice", "syllables": 1 },
				{ "word": "one", "syllables": 1 },
				{ "word": "pipe", "syllables": 1 },
				{ "word": "prime", "syllables": 1 },
				{ "word": "rate", "syllables": 1 },
				{ "word": "rhythm", "syllables": 2 },
				{ "word": "ride", "syllables": 1 },
				{ "word": "rides", "syllables": 1 },
				{ "word": "rien", "syllables": 2 },
				{ "word": "save", "syllables": 1 },
				{ "word": "science", "syllables": 2 },
				{ "word": "siècle", "syllables": 1 },
				{ "word": "site", "syllables": 1 },
				{ "word": "suite", "syllables": 1 },
				{ "word": "take", "syllables": 1 },
				{ "word": "taupe", "syllables": 1 },
				{ "word": "universe", "syllables": 3 },
				{ "word": "vogue", "syllables": 1 },
				{ "word": "wave", "syllables": 1 },
				{ "word": "zion", "syllables": 2}
			],
			"fragments": {
				"global": [
					{ "word": "abreaktion", "syllables": 4 },
					{ "word": "adware", "syllables": 2 },
					{ "word": "affaire", "syllables": 3 },
					{ "word": "aiguière", "syllables": 2 },
					{ "word": "anisette", "syllables": 3 },
					{ "word": "appeal", "syllables": 2 },
					{ "word": "backstage", "syllables": 2 },
					{ "word": "bankrate", "syllables": 2 },
					{ "word": "baseball", "syllables": 2 },
					{ "word": "basejump", "syllables": 2 },
					{ "word": "beachcomber", "syllables": 3 },
					{ "word": "beachvolleyball", "syllables": 4 },
					{ "word": "beagle", "syllables": 2 },
					{ "word": "beamer", "syllables": 2 },
					{ "word": "beamer", "syllables": 2 },
					{ "word": "béarnaise", "syllables": 3 },
					{ "word": "beaufort", "syllables": 2 },
					{ "word": "beaujolais", "syllables": 3 },
					{ "word": "beauté", "syllables": 2 },
					{ "word": "beauty", "syllables": 2 },
					{ "word": "belgier", "syllables": 3 },
					{ "word": "bestien", "syllables": 2 },
					{ "word": "biskuit", "syllables": 2 },
					{ "word": "bleach", "syllables": 1 },
					{ "word": "blue", "syllables": 1 },
					{ "word": "board", "syllables": 1 },
					{ "word": "boat", "syllables": 1 },
					{ "word": "bodysuit", "syllables": 3 },
					{ "word": "bordelaise", "syllables": 3 },
					{ "word": "break", "syllables": 1 },
					{ "word": "build", "syllables": 1 },
					{ "word": "bureau", "syllables": 2 },
					{ "word": "business", "syllables": 2 },
					{ "word": "cabrio", "syllables": 3 },
					{ "word": "cabriolet", "syllables": 4 },
					{ "word": "cachesexe", "syllables": 2 },
					{ "word": "camaieu", "syllables": 3 },
					{ "word": "canyon", "syllables": 2 },
					{ "word": "case", "syllables": 1 },
					{ "word": "catsuit", "syllables": 2 },
					{ "word": "centime", "syllables": 3 },
					{ "word": "chaise", "syllables": 2 },
					{ "word": "champion", "syllables": 2 },
					{ "word": "championat", "syllables": 3 },
					{ "word": "chapiteau", "syllables": 3 },
					{ "word": "chateau", "syllables": 2 },
					{ "word": "château", "syllables": 2 },
					{ "word": "cheat", "syllables": 1 },
					{ "word": "cheese", "syllables": 1 },
					{ "word": "chihuahua", "syllables": 3 },
					{ "word": "choice", "syllables": 1 },
					{ "word": "circonflexe", "syllables": 3 },
					{ "word": "clean", "syllables": 1 },
					{ "word": "cloche", "syllables": 1 },
					{ "word": "close", "syllables": 1 },
					{ "word": "clothes", "syllables": 1 },
					{ "word": "commerce", "syllables": 2 },
					{ "word": "crime", "syllables": 1 },
					{ "word": "crossrate", "syllables": 2 },
					{ "word": "cuisine", "syllables": 2 },
					{ "word": "culotte", "syllables": 2 },
					{ "word": "death", "syllables": 1 },
					{ "word": "defense", "syllables": 2 },
					{ "word": "détente", "syllables": 2 },
					{ "word": "dread", "syllables": 1 },
					{ "word": "dream", "syllables": 1 },
					{ "word": "dresscode", "syllables": 2 },
					{ "word": "dungeon", "syllables": 2 },
					{ "word": "easy", "syllables": 2 },
					{ "word": "engagement", "syllables": 3 },
					{ "word": "entente", "syllables": 2 },
					{ "word": "eye-catcher", "syllables": 3 },
					{ "word": "eyecatcher", "syllables": 3 },
					{ "word": "eyeliner", "syllables": 3 },
					{ "word": "eyeword", "syllables": 2 },
					{ "word": "fashion", "syllables": 2 },
					{ "word": "feature", "syllables": 2 },
					{ "word": "ferien", "syllables": 3 },
					{ "word": "fineliner", "syllables": 3 },
					{ "word": "fisheye", "syllables": 2 },
					{ "word": "flake", "syllables": 1 },
					{ "word": "flambeau", "syllables": 2 },
					{ "word": "flatrate", "syllables": 2 },
					{ "word": "fleece", "syllables": 1 },
					{ "word": "fraîche", "syllables": 1 },
					{ "word": "freak", "syllables": 1 },
					{ "word": "frites", "syllables": 1 },
					{ "word": "future", "syllables": 2 },
					{ "word": "gaelic", "syllables": 2 },
					{ "word": "game-show", "syllables": 2 },
					{ "word": "gameboy", "syllables": 2 },
					{ "word": "gamepad", "syllables": 2 },
					{ "word": "gameplay", "syllables": 2 },
					{ "word": "gameport", "syllables": 2 },
					{ "word": "gameshow", "syllables": 2 },
					{ "word": "garigue", "syllables": 2 },
					{ "word": "garrigue", "syllables": 2 },
					{ "word": "gatefold", "syllables": 2 },
					{ "word": "gateway", "syllables": 2 },
					{ "word": "geflashed", "syllables": 2 },
					{ "word": "georgier", "syllables": 4 },
					{ "word": "goal", "syllables": 1 },
					{ "word": "grapefruit", "syllables": 2 },
					{ "word": "great", "syllables": 1 },
					{ "word": "groupware", "syllables": 2 },
					{ "word": "gueule", "syllables": 1 },
					{ "word": "guide", "syllables": 1 },
					{ "word": "guilloche", "syllables": 2 },
					{ "word": "gynäzeen", "syllables": 4 },
					{ "word": "gynözeen", "syllables": 4 },
					{ "word": "haircare", "syllables": 2 },
					{ "word": "hardcore", "syllables": 2 },
					{ "word": "hardware", "syllables": 2 },
					{ "word": "head", "syllables": 1 },
					{ "word": "hearing", "syllables": 2 },
					{ "word": "heart", "syllables": 1 },
					{ "word": "heavy", "syllables": 2 },
					{ "word": "hedge", "syllables": 1 },
					{ "word": "heroin", "syllables": 3 },
					{ "word": "inclusive", "syllables": 3 },
					{ "word": "initiative", "syllables": 4 },
					{ "word": "inside", "syllables": 2 },
					{ "word": "jaguar", "syllables": 3 },
					{ "word": "jalousette", "syllables": 3 },
					{ "word": "jeans", "syllables": 1 },
					{ "word": "jeunesse", "syllables": 2 },
					{ "word": "juice", "syllables": 1 },
					{ "word": "jukebox", "syllables": 2 },
					{ "word": "jumpsuit", "syllables": 2 },
					{ "word": "kanarien", "syllables": 4 },
					{ "word": "kapriole", "syllables": 4 },
					{ "word": "karosserielinie", "syllables": 6 },
					{ "word": "konopeen", "syllables": 4 },
					{ "word": "lacrosse", "syllables": 2 },
					{ "word": "laplace", "syllables": 2 },
					{ "word": "late-", "syllables": 1 },
					{ "word": "lead", "syllables": 1 },
					{ "word": "league", "syllables": 1 },
					{ "word": "learn", "syllables": 1 },
					{ "word": "légière", "syllables": 2 },
					{ "word": "lizenziat", "syllables": 4 },
					{ "word": "load", "syllables": 1 },
					{ "word": "lotterielos", "syllables": 4 },
					{ "word": "lounge", "syllables": 1 },
					{ "word": "lyzeen", "syllables": 3 },
					{ "word": "madame", "syllables": 2 },
					{ "word": "mademoiselle", "syllables": 3 },
					{ "word": "magier", "syllables": 3 },
					{ "word": "make-up", "syllables": 2 },
					{ "word": "malware", "syllables": 2 },
					{ "word": "management", "syllables": 3 },
					{ "word": "manteau", "syllables": 2 },
					{ "word": "mausoleen", "syllables": 4 },
					{ "word": "mauve", "syllables": 1 },
					{ "word": "medien", "syllables": 3 },
					{ "word": "mesdames", "syllables": 2 },
					{ "word": "mesopotamien", "syllables": 6 },
					{ "word": "milliarde", "syllables": 3 },
					{ "word": "missile", "syllables": 2 },
					{ "word": "miszellaneen", "syllables": 5 },
					{ "word": "mousse", "syllables": 1 },
					{ "word": "mousseline", "syllables": 3 },
					{ "word": "museen", "syllables": 3 },
					{ "word": "musette", "syllables": 2 },
					{ "word": "nahuatl", "syllables": 2 },
					{ "word": "noisette", "syllables": 2 },
					{ "word": "notebook", "syllables": 2 },
					{ "word": "nuance", "syllables": 3 },
					{ "word": "nuklease", "syllables": 4 },
					{ "word": "odeen", "syllables": 3 },
					{ "word": "offline", "syllables": 2 },
					{ "word": "offside", "syllables": 2 },
					{ "word": "oleaster", "syllables": 4 },
					{ "word": "on-stage", "syllables": 2 },
					{ "word": "online", "syllables": 2 },
					{ "word": "orpheen", "syllables": 3 },
					{ "word": "parforceritt", "syllables": 3 },
					{ "word": "patiens", "syllables": 2 },
					{ "word": "patient", "syllables": 2 },
					{ "word": "peace", "syllables": 1 },
					{ "word": "peace", "syllables": 1 },
					{ "word": "peanuts", "syllables": 2 },
					{ "word": "people", "syllables": 2 },
					{ "word": "perineen", "syllables": 4 },
					{ "word": "peritoneen", "syllables": 5 },
					{ "word": "picture", "syllables": 2 },
					{ "word": "piece", "syllables": 1 },
					{ "word": "pipeline", "syllables": 2 },
					{ "word": "plateau", "syllables": 2 },
					{ "word": "poesie", "syllables": 3 },
					{ "word": "poleposition", "syllables": 4 },
					{ "word": "portemanteau", "syllables": 3 },
					{ "word": "portemonnaie", "syllables": 3 },
					{ "word": "primerate", "syllables": 2 },
					{ "word": "primerate", "syllables": 2 },
					{ "word": "primetime", "syllables": 2 },
					{ "word": "protease", "syllables": 4 },
					{ "word": "protein", "syllables": 3 },
					{ "word": "prytaneen", "syllables": 4 },
					{ "word": "quotient", "syllables": 2 },
					{ "word": "radio", "syllables": 3 },
					{ "word": "reader", "syllables": 2 },
					{ "word": "ready", "syllables": 2 },
					{ "word": "reallife", "syllables": 2 },
					{ "word": "repeat", "syllables": 2 },
					{ "word": "retake", "syllables": 2 },
					{ "word": "rigole", "syllables": 2 },
					{ "word": "risolle", "syllables": 2 },
					{ "word": "road", "syllables": 1 },
					{ "word": "roaming", "syllables": 2 },
					{ "word": "roquefort", "syllables": 2 },
					{ "word": "safe", "syllables": 1 },
					{ "word": "savonette", "syllables": 3 },
					{ "word": "sciencefiction", "syllables": 3 },
					{ "word": "search", "syllables": 1 },
					{ "word": "selfmade", "syllables": 2 },
					{ "word": "septime", "syllables": 3 },
					{ "word": "serapeen", "syllables": 4 },
					{ "word": "service", "syllables": 2 },
					{ "word": "serviette", "syllables": 2 },
					{ "word": "share", "syllables": 1 },
					{ "word": "shave", "syllables": 1 },
					{ "word": "shore", "syllables": 1 },
					{ "word": "sidebar", "syllables": 2 },
					{ "word": "sideboard", "syllables": 2 },
					{ "word": "sidekick", "syllables": 2 },
					{ "word": "silhouette", "syllables": 3 },
					{ "word": "sitemap", "syllables": 2 },
					{ "word": "slide", "syllables": 1 },
					{ "word": "sneak", "syllables": 1 },
					{ "word": "soap", "syllables": 1 },
					{ "word": "softcore", "syllables": 2 },
					{ "word": "software", "syllables": 2 },
					{ "word": "soutanelle", "syllables": 3 },
					{ "word": "speak", "syllables": 1 },
					{ "word": "special", "syllables": 2 },
					{ "word": "spracheinstellung", "syllables": 5 },
					{ "word": "spyware", "syllables": 2 },
					{ "word": "square", "syllables": 1 },
					{ "word": "stagediving", "syllables": 3 },
					{ "word": "stakeholder", "syllables": 3 },
					{ "word": "statement", "syllables": 2 },
					{ "word": "steady", "syllables": 2 },
					{ "word": "steak", "syllables": 1 },
					{ "word": "stealth", "syllables": 1 },
					{ "word": "steam", "syllables": 1 },
					{ "word": "stoned", "syllables": 1 },
					{ "word": "stracciatella", "syllables": 4 },
					{ "word": "stream", "syllables": 1 },
					{ "word": "stride", "syllables": 1 },
					{ "word": "strike", "syllables": 1 },
					{ "word": "suitcase", "syllables": 2 },
					{ "word": "sweepstake", "syllables": 2 },
					{ "word": "t-bone", "syllables": 2 },
					{ "word": "t-shirt", "syllables": 1 },
					{ "word": "tailgate", "syllables": 2 },
					{ "word": "take-off", "syllables": 2 },
					{ "word": "take-over", "syllables": 3 },
					{ "word": "takeaway", "syllables": 3 },
					{ "word": "takeoff", "syllables": 2 },
					{ "word": "takeover", "syllables": 3 },
					{ "word": "throat", "syllables": 1 },
					{ "word": "time-out", "syllables": 2 },
					{ "word": "timelag", "syllables": 2 },
					{ "word": "timeline", "syllables": 2 },
					{ "word": "timesharing", "syllables": 3 },
					{ "word": "toast", "syllables": 1 },
					{ "word": "traubenmaische", "syllables": 4 },
					{ "word": "tristesse", "syllables": 2 },
					{ "word": "usenet", "syllables": 2 },
					{ "word": "varietät", "syllables": 4 },
					{ "word": "varieté", "syllables": 4 },
					{ "word": "vinaigrette", "syllables": 3 },
					{ "word": "vintage", "syllables": 2 },
					{ "word": "violett", "syllables": 3 },
					{ "word": "voice", "syllables": 1 },
					{ "word": "wakeboard", "syllables": 2 },
					{ "word": "washed", "syllables": 1 },
					{ "word": "waveboard", "syllables": 2 },
					{ "word": "wear", "syllables": 1 },
					{ "word": "wear", "syllables": 1 },
					{ "word": "website", "syllables": 2 },
					{ "word": "white", "syllables": 1 },
					{ "word": "widescreen", "syllables": 2 },
					{ "word": "wire", "syllables": 1 },
					{ "word": "yacht", "syllables": 1 },
					{ "word": "yorkshire", "syllables": 2 },
					{ "word": "éprouvette", "syllables": 3, "notFollowedBy": ["n"] },
					{ "word": "galette", "syllables": 2, "notFollowedBy": ["n"] },
					{ "word": "gigue", "syllables": 1, "notFollowedBy": ["n"] },
					{ "word": "groove", "syllables": 1, "notFollowedBy": ["n"] },
					{ "word": "morgue", "syllables": 1, "notFollowedBy": ["n"] },
					{ "word": "paillette", "syllables": 2, "notFollowedBy": ["n"] },
					{ "word": "raclette", "syllables": 2, "notFollowedBy": ["n"] },
					{ "word": "roulette", "syllables": 2, "notFollowedBy": ["n"] },
					{ "word": "spike", "syllables": 1, "notFollowedBy": ["n"] },
					{ "word": "style", "syllables": 1, "notFollowedBy": ["n"] },
					{ "word": "tablette", "syllables": 2, "notFollowedBy": ["n"] },
					{ "word": "grunge", "syllables": 1, "notFollowedBy": ["r"] },
					{ "word": "size", "syllables": 1, "notFollowedBy": ["r"] },
					{ "word": "value", "syllables": 1, "notFollowedBy": ["r"] },
					{ "word": "quiche", "syllables": 1, "notFollowedBy": ["s"] },
					{ "word": "house", "syllables": 1, "notFollowedBy": ["n", "s"] },
					{ "word": "sauce", "syllables": 1, "notFollowedBy": ["n", "s"] },
					{ "word": "space", "syllables": 1, "notFollowedBy": ["n", "s"] },
					{ "word": "airline", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "autosave", "syllables": 3, "notFollowedBy": ["n", "r"] },
					{ "word": "bagpipe", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "bike", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "dance", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "deadline", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "halfpipe", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "headline", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "home", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "hornpipe", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "hotline", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "infoline", "syllables": 3, "notFollowedBy": ["n", "r"] },
					{ "word": "inline", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "kite", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "rollerblade", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "score", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "skyline", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "slackline", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "slice", "syllables": 1, "notFollowedBy": ["n", "r", "s"] },
					{ "word": "snooze", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "storyline", "syllables": 3, "notFollowedBy": ["n", "r"] },
					{ "word": "office", "syllables": 2, "notFollowedBy": ["s", "r"] },
					{ "word": "space", "syllables": 1, "notFollowedBy": ["n", "s", "r"] },
					{ "word": "tease", "syllables": 1, "notFollowedBy": ["n", "s", "r"] },
					{ "word": "cache", "syllables": 1, "notFollowedBy": ["t"] }
				],
				"atBeginningOrEnd": [
					{ "word": "case", "syllables": 1 },
					{ "word": "life", "syllables": 1 },
					{ "word": "teak", "syllables": 1 },
					{ "word": "team", "syllables": 1 },
					{ "word": "creme", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "crème", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "drive", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "skate", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "update", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "upgrade", "syllables": 2, "notFollowedBy": ["n", "r"] }
				],
				"atBeginning": [
					{ "word": "anion", "syllables": 3 },
					{ "word": "facelift", "syllables": 2 },
					{ "word": "jiu", "syllables": 1 },
					{ "word": "pace", "syllables": 1 },
					{ "word": "shake", "syllables": 1 },
					{ "word": "tea", "syllables": 1 },
					{ "word": "trade", "syllables": 1 },
					{ "word": "deal", "syllables": 1 }
				],
				"atEnd": [
					{ "word": "face", "syllables": 1 },
					{ "word": "file", "syllables": 1 },
					{ "word": "mousse", "syllables": 1 },
					{ "word": "plate", "syllables": 1 },
					{ "word": "tape", "syllables": 1 },
					{ "word": "byte", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "cape", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "five", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "hype", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "leak", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "like", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "make", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "phone", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "rave", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "regime", "syllables": 2, "alsoFollowedBy": ["s"] },
					{ "word": "statue", "syllables": 2, "alsoFollowedBy": ["s"] },
					{ "word": "store", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "wave", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "date", "syllables": 1, "notFollowedBy": ["n"] },
					{ "word": "image", "syllables": 2, "notFollowedBy": ["s"] }
				]
			}
		}
	}
}

},{}],181:[function(require,module,exports){
module.exports={
	"vowels": "aeiouy",
	"deviations": {
		"vowels": [
			{
				"fragments": [ "cial", "tia", "cius", "giu", "ion",
					"[^bdnprv]iou", "sia$", "[^aeiuot]{2,}ed$", "[aeiouy][^aeiuoyts]{1,}e$",
					"[a-z]ely$", "[cgy]ed$", "rved$", "[aeiouy][dt]es?$", "eau", "ieu",
					"oeu", "[aeiouy][^aeiouydt]e[sd]?$", "[aeouy]rse$", "^eye" ],
				"countModifier": -1
			},
			{
				"fragments": [ "ia", "iu", "ii", "io", "[aeio][aeiou]{2}", "[aeiou]ing", "[^aeiou]ying", "ui[aeou]" ],
				"countModifier": 1
			},
			{
				"fragments": [ "^ree[jmnpqrsx]", "^reele", "^reeva", "riet",
					"dien", "[aeiouym][bdp]le$", "uei", "uou",
					"^mc", "ism$", "[^l]lien", "^coa[dglx].",
					"[^gqauieo]ua[^auieo]", "dn't$", "uity$", "ie(r|st)",
					"[aeiouw]y[aeiou]", "[^ao]ire[ds]", "[^ao]ire$" ],
				"countModifier": 1
			},
			{
				"fragments": [ "eoa", "eoo", "ioa", "ioe", "ioo" ],
				"countModifier": 1
			}
		],
		"words": {
			"full": [
				{
					"word": "business",
					"syllables": 2
				},
				{
					"word": "coheiress",
					"syllables": 3
				},
				{
					"word": "colonel",
					"syllables": 2
				},
				{
					"word": "heiress",
					"syllables": 2
				},
				{
					"word": "i.e",
					"syllables": 2
				},
				{
					"word": "shoreline",
					"syllables": 2
				},
				{
					"word": "simile",
					"syllables": 3
				},
				{
					"word": "unheired",
					"syllables": 2
				},
				{
					"word": "wednesday",
					"syllables": 2
				}
			],
			"fragments": {
				"global": [
					{
						"word": "coyote",
						"syllables": 3
					},
					{
						"word": "graveyard",
						"syllables": 2
					},
					{
						"word": "lawyer",
						"syllables": 2
					}
				]
			}
		}
	}
}

},{}],182:[function(require,module,exports){
module.exports={
	"vowels": "aáäâeéëêiíïîoóöôuúüûy",
	"deviations": {
		"vowels": [
			{
				"fragments": [ "ue$", "dge$", "[tcp]iënt",
					"ace$", "[br]each", "[ainpr]tiaal", "[io]tiaan",
					"gua[yc]", "[^i]deal", "tive$", "load", "[^e]coke",
					"[^s]core$" ],
				"countModifier": -1
			},
			{
				"fragments": [ "aä", "aeu", "aie", "ao", "ë", "eo",
					"eú", "ieau", "ea$", "ea[^u]", "ei[ej]",
					"eu[iu]", "ï", "iei", "ienne", "[^l]ieu[^w]",
					"[^l]ieu$", "i[auiy]", "stion",
					"[^cstx]io", "^sion", "riè", "oö", "oa", "oeing",
					"oie", "[eu]ü", "[^q]u[aeèo]", "uie",
					"[bhnpr]ieel", "[bhnpr]iël" ],
				"countModifier": 1
			},
			{
				"fragments": [ "[aeolu]y[aeéèoóu]" ],
				"countModifier": 1
			}
		],
		"words": {
			"full": [
				{ "word": "bye", "syllables": 1 },
				{ "word": "core", "syllables": 1 },
				{ "word": "cure", "syllables": 1 },
				{ "word": "dei", "syllables": 2 },
				{ "word": "dope", "syllables": 1 },
				{ "word": "dude", "syllables": 1 },
				{ "word": "fake", "syllables": 1 },
				{ "word": "fame", "syllables": 1 },
				{ "word": "five", "syllables": 1 },
				{ "word": "hole", "syllables": 1 },
				{ "word": "least", "syllables": 1 },
				{ "word": "lone", "syllables": 1 },
				{ "word": "minute", "syllables": 2 },
				{ "word": "move", "syllables": 1 },
				{ "word": "nice", "syllables": 1 },
				{ "word": "one", "syllables": 1 },
				{ "word": "state", "syllables": 1 },
				{ "word": "surplace", "syllables": 2 },
				{ "word": "take", "syllables": 1 },
				{ "word": "trade", "syllables": 1 },
				{ "word": "wide", "syllables": 1 }
			],
			"fragments": {
				"global": [
					{ "word": "adieu", "syllables": 2 },
					{ "word": "airline", "syllables": 2 },
					{ "word": "airmiles", "syllables": 2 },
					{ "word": "alien", "syllables": 3 },
					{ "word": "ambient", "syllables": 3 },
					{ "word": "announcement", "syllables": 3 },
					{ "word": "appearance", "syllables": 3 },
					{ "word": "appeasement", "syllables": 3 },
					{ "word": "atheneum", "syllables": 4 },
					{ "word": "awesome", "syllables": 2 },
					{ "word": "baccalaurei", "syllables": 5 },
					{ "word": "baccalaureus", "syllables": 5 },
					{ "word": "baseball", "syllables": 3 },
					{ "word": "basejump", "syllables": 2 },
					{ "word": "banlieue", "syllables": 3 },
					{ "word": "bapao", "syllables": 2 },
					{ "word": "barbecue", "syllables": 3 },
					{ "word": "beamer", "syllables": 2 },
					{ "word": "beanie", "syllables": 2 },
					{ "word": "beat", "syllables": 1 },
					{ "word": "belle", "syllables": 2 },
					{ "word": "bête", "syllables": 1 },
					{ "word": "bingewatch", "syllables": 2 },
					{ "word": "blocnote", "syllables": 2 },
					{ "word": "blue", "syllables": 1 },
					{ "word": "board", "syllables": 1 },
					{ "word": "break", "syllables": 1 },
					{ "word": "broad", "syllables": 1 },
					{ "word": "bulls-eye", "syllables": 2 },
					{ "word": "business", "syllables": 2 },
					{ "word": "byebye", "syllables": 2 },
					{ "word": "cacao", "syllables": 2 },
					{ "word": "caesar", "syllables": 2 },
					{ "word": "camaieu", "syllables": 3 },
					{ "word": "caoutchouc", "syllables": 2 },
					{ "word": "carbolineum", "syllables": 5 },
					{ "word": "catchphrase", "syllables": 1 },
					{ "word": "carrier", "syllables": 3 },
					{ "word": "cheat", "syllables": 1 },
					{ "word": "cheese", "syllables": 1 },
					{ "word": "circonflexe", "syllables": 3 },
					{ "word": "clean", "syllables": 1 },
					{ "word": "cloak", "syllables": 1 },
					{ "word": "cobuying", "syllables": 3 },
					{ "word": "comeback", "syllables": 2 },
					{ "word": "comfortzone", "syllables": 3 },
					{ "word": "communiqué", "syllables": 4 },
					{ "word": "conopeum", "syllables": 4 },
					{ "word": "console", "syllables": 2 },
					{ "word": "corporate", "syllables": 3 },
					{ "word": "coûte", "syllables": 1 },
					{ "word": "creamer", "syllables": 2 },
					{ "word": "crime", "syllables": 1 },
					{ "word": "cruesli", "syllables": 2 },
					{ "word": "deadline", "syllables": 2 },
					{ "word": "deautoriseren", "syllables": 6 },
					{ "word": "deuce", "syllables": 1 },
					{ "word": "deum", "syllables": 2 },
					{ "word": "dirndl", "syllables": 2 },
					{ "word": "dread", "syllables": 2 },
					{ "word": "dreamteam", "syllables": 2 },
					{ "word": "drone", "syllables": 1 },
					{ "word": "enquête", "syllables": 3 },
					{ "word": "escape", "syllables": 2 },
					{ "word": "exposure", "syllables": 3 },
					{ "word": "extranei", "syllables": 4 },
					{ "word": "extraneus", "syllables": 4 },
					{ "word": "eyecatcher", "syllables": 3 },
					{ "word": "eyeliner", "syllables": 3 },
					{ "word": "eyeopener", "syllables": 4 },
					{ "word": "eyetracker", "syllables": 3 },
					{ "word": "eyetracking", "syllables": 3 },
					{ "word": "fairtrade", "syllables": 2 },
					{ "word": "fauteuil", "syllables": 2 },
					{ "word": "feature", "syllables": 2 },
					{ "word": "feuilletee", "syllables": 3 },
					{ "word": "feuilleton", "syllables": 3 },
					{ "word": "fisheye", "syllables": 2 },
					{ "word": "fineliner", "syllables": 3 },
					{ "word": "finetunen", "syllables": 3 },
					{ "word": "forehand", "syllables": 2 },
					{ "word": "freak", "syllables": 1 },
					{ "word": "fusioneren", "syllables": 4 },
					{ "word": "gayparade", "syllables": 3 },
					{ "word": "gaypride", "syllables": 2 },
					{ "word": "goal", "syllables": 1 },
					{ "word": "grapefruit", "syllables": 2 },
					{ "word": "gruyère", "syllables": 3 },
					{ "word": "guele", "syllables": 1 },
					{ "word": "guerrilla", "syllables": 3 },
					{ "word": "guest", "syllables": 1 },
					{ "word": "hardware", "syllables": 2 },
					{ "word": "haute", "syllables": 1 },
					{ "word": "healing", "syllables": 2 },
					{ "word": "heater", "syllables": 2 },
					{ "word": "heavy", "syllables": 2 },
					{ "word": "hoax", "syllables": 1 },
					{ "word": "hotline", "syllables": 2 },
					{ "word": "idee-fixe", "syllables": 3 },
					{ "word": "inclusive", "syllables": 3 },
					{ "word": "inline", "syllables": 2 },
					{ "word": "intake", "syllables": 2 },
					{ "word": "intensive", "syllables": 3 },
					{ "word": "jeans", "syllables": 1 },
					{ "word": "Jones", "syllables": 1 },
					{ "word": "jubileum", "syllables": 4 },
					{ "word": "kalfsribeye", "syllables": 3 },
					{ "word": "kraaiennest", "syllables": 3 },
					{ "word": "lastminute", "syllables": 3 },
					{ "word": "learning", "syllables": 2 },
					{ "word": "league", "syllables": 1 },
					{ "word": "line-up", "syllables": 2 },
					{ "word": "linoleum", "syllables": 4 },
					{ "word": "load", "syllables": 1 },
					{ "word": "loafer", "syllables": 2 },
					{ "word": "longread", "syllables": 2 },
					{ "word": "lookalike", "syllables": 3 },
					{ "word": "louis", "syllables": 3 },
					{ "word": "lyceum", "syllables": 3 },
					{ "word": "magazine", "syllables": 3 },
					{ "word": "mainstream", "syllables": 2 },
					{ "word": "make-over", "syllables": 3 },
					{ "word": "make-up", "syllables": 2 },
					{ "word": "malware", "syllables": 2 },
					{ "word": "marmoleum", "syllables": 4 },
					{ "word": "mausoleum", "syllables": 4 },
					{ "word": "medeauteur", "syllables": 4 },
					{ "word": "midlifecrisis", "syllables": 4 },
					{ "word": "migraineaura", "syllables": 5 },
					{ "word": "milkshake", "syllables": 2 },
					{ "word": "millefeuille", "syllables": 4 },
					{ "word": "mixed", "syllables": 1 },
					{ "word": "muesli", "syllables": 2 },
					{ "word": "museum", "syllables": 3 },
					{ "word": "must-have", "syllables": 2 },
					{ "word": "must-read", "syllables": 2 },
					{ "word": "notebook", "syllables": 2 },
					{ "word": "nonsense", "syllables": 2 },
					{ "word": "nowhere", "syllables": 2 },
					{ "word": "nurture", "syllables": 2 },
					{ "word": "offline", "syllables": 2 },
					{ "word": "oneliner", "syllables": 3 },
					{ "word": "onesie", "syllables": 2 },
					{ "word": "online", "syllables": 2 },
					{ "word": "opinion", "syllables": 3 },
					{ "word": "paella", "syllables": 3 },
					{ "word": "pacemaker", "syllables": 3 },
					{ "word": "panache", "syllables": 2 },
					{ "word": "papegaaienneus", "syllables": 5 },
					{ "word": "passe-partout", "syllables": 3 },
					{ "word": "peanuts", "syllables": 2 },
					{ "word": "perigeum", "syllables": 4 },
					{ "word": "perineum", "syllables": 4 },
					{ "word": "perpetuum", "syllables": 4 },
					{ "word": "petroleum", "syllables": 4 },
					{ "word": "phone", "syllables": 3 },
					{ "word": "picture", "syllables": 2 },
					{ "word": "placemat", "syllables": 2 },
					{ "word": "porte-manteau", "syllables": 3 },
					{ "word": "portefeuille", "syllables": 4 },
					{ "word": "presse-papier", "syllables": 3 },
					{ "word": "primetime", "syllables": 2 },
					{ "word": "queen", "syllables": 1 },
					{ "word": "questionnaire", "syllables": 3 },
					{ "word": "queue", "syllables": 1 },
					{ "word": "reader", "syllables": 2 },
					{ "word": "reality", "syllables": 3 },
					{ "word": "reallife", "syllables": 2 },
					{ "word": "remake", "syllables": 2 },
					{ "word": "repeat", "syllables": 2 },
					{ "word": "repertoire", "syllables": 3 },
					{ "word": "research", "syllables": 2 },
					{ "word": "reverence", "syllables": 3 },
					{ "word": "ribeye", "syllables": 2 },
					{ "word": "ringtone", "syllables": 3 },
					{ "word": "road", "syllables": 1 },
					{ "word": "roaming", "syllables": 2 },
					{ "word": "sciencefiction", "syllables": 4 },
					{ "word": "selfmade", "syllables": 2 },
					{ "word": "sidekick", "syllables": 2 },
					{ "word": "sightseeing", "syllables": 3 },
					{ "word": "skyline", "syllables": 2 },
					{ "word": "smile", "syllables": 1 },
					{ "word": "sneaky", "syllables": 2 },
					{ "word": "software", "syllables": 2 },
					{ "word": "sparerib", "syllables": 2 },
					{ "word": "speaker", "syllables": 2 },
					{ "word": "spread", "syllables": 1 },
					{ "word": "statement", "syllables": 2 },
					{ "word": "steak", "syllables": 1 },
					{ "word": "steeplechase", "syllables": 3 },
					{ "word": "stonewash", "syllables": 2 },
					{ "word": "store", "syllables": 1 },
					{ "word": "streaken", "syllables": 2 },
					{ "word": "stream", "syllables": 1 },
					{ "word": "streetware", "syllables": 1 },
					{ "word": "supersoaker", "syllables": 4 },
					{ "word": "surprise-party", "syllables": 4 },
					{ "word": "sweater", "syllables": 2 },
					{ "word": "teaser", "syllables": 2 },
					{ "word": "tenue", "syllables": 2 },
					{ "word": "template", "syllables": 2 },
					{ "word": "timeline", "syllables": 2 },
					{ "word": "tissue", "syllables": 2 },
					{ "word": "toast", "syllables": 1 },
					{ "word": "tête-à-tête", "syllables": 3 },
					{ "word": "typecast", "syllables": 2 },
					{ "word": "unique", "syllables": 2 },
					{ "word": "ureum", "syllables": 3 },
					{ "word": "vibe", "syllables": 1 },
					{ "word": "vieux", "syllables": 1 },
					{ "word": "ville", "syllables": 1 },
					{ "word": "vintage", "syllables": 2 },
					{ "word": "wandelyup", "syllables": 3 },
					{ "word": "wiseguy", "syllables": 2 },
					{ "word": "wake-up-call", "syllables": 3 },
					{ "word": "webcare", "syllables": 2 },
					{ "word": "winegum", "syllables": 2 },
					{ "word": "base", "syllables": 1, "notFollowedBy": [ "e", "n", "r" ] },
					{ "word": "game", "syllables": 1, "notFollowedBy": [ "n", "l", "r" ] },
					{ "word": "style", "syllables": 1, "notFollowedBy": [ "n", "s" ] },
					{ "word": "douche", "syllables": 1, "notFollowedBy": [ "n", "s" ] },
					{ "word": "space", "syllables": 1, "notFollowedBy": [ "n", "s" ] },
					{ "word": "striptease", "syllables": 2, "notFollowedBy": [ "n", "s" ] },
					{ "word": "jive", "syllables": 1, "notFollowedBy": [ "n", "r" ] },
					{ "word": "keynote", "syllables": 2, "notFollowedBy": [ "n", "r" ] },
					{ "word": "mountainbike", "syllables": 3, "notFollowedBy": [ "n", "r" ] },
					{ "word": "face", "syllables": 1, "notFollowedBy": [ "n", "t" ] },
					{ "word": "challenge", "syllables": 2, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "cruise", "syllables": 1, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "house", "syllables": 1, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "dance", "syllables": 1, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "franchise", "syllables": 2, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "freelance", "syllables": 2, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "lease", "syllables": 1, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "linedance", "syllables": 2, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "lounge", "syllables": 1, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "merchandise", "syllables": 3, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "performance", "syllables": 3, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "release", "syllables": 2, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "resource", "syllables": 2, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "cache", "syllables": 1, "notFollowedBy": [ "c", "l", "n", "t", "x" ] },
					{ "word": "office", "syllables": 2, "notFollowedBy": [ "r", "s" ] },
					{ "word": "close", "syllables": 1, "notFollowedBy": [ "r", "t" ] }
				],
				"atBeginningOrEnd": [
					{ "word": "byte", "syllables": 1 },
					{ "word": "cake", "syllables": 1 },
					{ "word": "care", "syllables": 1 },
					{ "word": "coach", "syllables": 1 },
					{ "word": "coat", "syllables": 1 },
					{ "word": "earl", "syllables": 1 },
					{ "word": "foam", "syllables": 1 },
					{ "word": "gate", "syllables": 1 },
					{ "word": "head", "syllables": 1 },
					{ "word": "home", "syllables": 1 },
					{ "word": "live", "syllables": 1 },
					{ "word": "safe", "syllables": 1 },
					{ "word": "site", "syllables": 1 },
					{ "word": "soap", "syllables": 1 },
					{ "word": "teak", "syllables": 1 },
					{ "word": "team", "syllables": 1 },
					{ "word": "wave", "syllables": 1 },
					{ "word": "brace", "syllables": 1, "notFollowedBy": [ "s" ] },
					{ "word": "case", "syllables": 1, "notFollowedBy": [ "s" ] },
					{ "word": "fleece", "syllables": 1, "notFollowedBy": [ "s" ] },
					{ "word": "service", "syllables": 2, "notFollowedBy": [ "s" ] },
					{ "word": "voice", "syllables": 1, "notFollowedBy": [ "s" ] },
					{ "word": "kite", "syllables": 1, "notFollowedBy": [ "n", "r" ] },
					{ "word": "skate", "syllables": 1, "notFollowedBy": [ "n", "r" ] },
					{ "word": "race", "syllables": 1, "notFollowedBy": [ "n", "r", "s" ] }
				],
				"atBeginning": [
					{ "word": "coke", "syllables": 1 },
					{ "word": "deal", "syllables": 1 },
					{ "word": "image", "syllables": 2, "notFollowedBy": [ "s" ] }
				],
				"atEnd": [
					{ "word": "force", "syllables": 1 },
					{ "word": "tea", "syllables": 1 },
					{ "word": "time", "syllables": 1 },
					{ "word": "date", "syllables": 1, "alsoFollowedBy": [ "s" ] },
					{ "word": "hype", "syllables": 1, "alsoFollowedBy": [ "s" ] },
					{ "word": "quote", "syllables": 1, "alsoFollowedBy": [ "s" ] },
					{ "word": "tape", "syllables": 1, "alsoFollowedBy": [ "s" ] },
					{ "word": "upgrade", "syllables": 2, "alsoFollowedBy": [ "s" ] }
				]
			}
		}
	}
}

},{}],183:[function(require,module,exports){
/**
 * The function getting the language part of the locale.
 *
 * @param {string} locale The locale.
 * @returns {string} The language part of the locale.
 */
module.exports = function( locale ) {
	return locale.split( "_" )[ 0 ];
};

},{}],184:[function(require,module,exports){
var blockElements = [ "address", "article", "aside", "blockquote", "canvas", "dd", "div", "dl", "fieldset", "figcaption",
	"figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "li", "main", "nav",
	"noscript", "ol", "output", "p", "pre", "section", "table", "tfoot", "ul", "video" ];
var inlineElements = [ "b", "big", "i", "small", "tt", "abbr", "acronym", "cite", "code", "dfn", "em", "kbd", "strong",
	"samp", "time", "var", "a", "bdo", "br", "img", "map", "object", "q", "script", "span", "sub", "sup", "button",
	"input", "label", "select", "textarea" ];

var blockElementsRegex = new RegExp( "^(" + blockElements.join( "|" ) + ")$", "i" );
var inlineElementsRegex = new RegExp( "^(" + inlineElements.join( "|" ) + ")$", "i" );

var blockElementStartRegex = new RegExp( "^<(" + blockElements.join( "|" ) + ")[^>]*?>$", "i" );
var blockElementEndRegex = new RegExp( "^</(" + blockElements.join( "|" ) + ")[^>]*?>$", "i" );

var inlineElementStartRegex = new RegExp( "^<(" + inlineElements.join( "|" ) + ")[^>]*>$", "i" );
var inlineElementEndRegex = new RegExp( "^</(" + inlineElements.join( "|" ) + ")[^>]*>$", "i" );

var otherElementStartRegex = /^<([^>\s\/]+)[^>]*>$/;
var otherElementEndRegex = /^<\/([^>\s]+)[^>]*>$/;

var contentRegex = /^[^<]+$/;
var greaterThanContentRegex = /^<[^><]*$/;

var commentRegex = /<!--(.|[\r\n])*?-->/g;

var core = require( "tokenizer2/core" );
var forEach = require( "lodash/forEach" );
var memoize = require( "lodash/memoize" );

var tokens = [];
var htmlBlockTokenizer;

/**
 * Creates a tokenizer to tokenize HTML into blocks.
 */
function createTokenizer() {
	tokens = [];

	htmlBlockTokenizer = core( function( token ) {
		tokens.push( token );
	} );

	htmlBlockTokenizer.addRule( contentRegex, "content" );
	htmlBlockTokenizer.addRule( greaterThanContentRegex, "greater-than-sign-content" );

	htmlBlockTokenizer.addRule( blockElementStartRegex, "block-start" );
	htmlBlockTokenizer.addRule( blockElementEndRegex, "block-end" );
	htmlBlockTokenizer.addRule( inlineElementStartRegex, "inline-start" );
	htmlBlockTokenizer.addRule( inlineElementEndRegex, "inline-end" );

	htmlBlockTokenizer.addRule( otherElementStartRegex, "other-element-start" );
	htmlBlockTokenizer.addRule( otherElementEndRegex, "other-element-end" );
}

/**
 * Returns whether or not the given element name is a block element.
 *
 * @param {string} htmlElementName The name of the HTML element.
 * @returns {boolean} Whether or not it is a block element.
 */
function isBlockElement( htmlElementName ) {
	return blockElementsRegex.test( htmlElementName );
}

/**
 * Returns whether or not the given element name is an inline element.
 *
 * @param {string} htmlElementName The name of the HTML element.
 * @returns {boolean} Whether or not it is an inline element.
 */
function isInlineElement( htmlElementName ) {
	return inlineElementsRegex.test( htmlElementName );
}

/**
 * Splits a text into blocks based on HTML block elements.
 *
 * @param {string} text The text to split.
 * @returns {Array} A list of blocks based on HTML block elements.
 */
function getBlocks( text ) {
	var blocks = [], depth = 0,
		blockStartTag = "",
		currentBlock = "",
		blockEndTag = "";

	// Remove all comments because it is very hard to tokenize them.
	text = text.replace( commentRegex, "" );

	createTokenizer();
	htmlBlockTokenizer.onText( text );

	htmlBlockTokenizer.end();

	forEach( tokens, function( token, i ) {
		var nextToken = tokens[ i + 1 ];

		switch ( token.type ) {

			case "content":
			case "greater-than-sign-content":
			case "inline-start":
			case "inline-end":
			case "other-tag":
			case "other-element-start":
			case "other-element-end":
			case "greater than sign":
				if ( ! nextToken || ( depth === 0 && ( nextToken.type === "block-start" || nextToken.type === "block-end" ) ) ) {
					currentBlock += token.src;

					blocks.push( currentBlock );
					blockStartTag = "";
					currentBlock = "";
					blockEndTag = "";
				} else {
					currentBlock += token.src;
				}
				break;

			case "block-start":
				if ( depth !== 0 ) {
					if ( currentBlock.trim() !== "" ) {
						blocks.push( currentBlock );
					}
					currentBlock = "";
					blockEndTag = "";
				}

				depth++;
				blockStartTag = token.src;
				break;

			case "block-end":
				depth--;
				blockEndTag = token.src;

				/*
				 * We try to match the most deep blocks so discard any other blocks that have been started but not
				 * finished.
				 */
				if ( "" !== blockStartTag && "" !== blockEndTag ) {
					blocks.push( blockStartTag + currentBlock + blockEndTag );
				} else if ( "" !== currentBlock.trim() ) {
					blocks.push( currentBlock );
				}
				blockStartTag = "";
				currentBlock = "";
				blockEndTag = "";
				break;
		}

		// Handles HTML with too many closing tags.
		if ( depth < 0 ) {
			depth = 0;
		}
	} );

	return blocks;
}

module.exports = {
	blockElements: blockElements,
	inlineElements: inlineElements,
	isBlockElement: isBlockElement,
	isInlineElement: isInlineElement,
	getBlocks: memoize( getBlocks ),
};

},{"lodash/forEach":141,"lodash/memoize":166,"tokenizer2/core":178}],185:[function(require,module,exports){
var SyllableCountStep = require( "./syllableCountStep.js" );

var isUndefined = require( "lodash/isUndefined" );
var forEach = require( "lodash/forEach" );

/**
 * Creates a syllable count iterator.
 *
 * @param {object} config The config object containing an array with syllable exclusions.
 * @constructor
 */
var SyllableCountIterator = function( config ) {
	this.countSteps = [];
	if ( ! isUndefined( config ) ) {
		this.createSyllableCountSteps( config.deviations.vowels );
	}
};

/**
 * Creates a syllable count step object for each exclusion.
 *
 * @param {object} syllableCounts The object containing all exclusion syllables including the multipliers.
 */
SyllableCountIterator.prototype.createSyllableCountSteps = function( syllableCounts ) {
	forEach( syllableCounts, function( syllableCountStep ) {
		this.countSteps.push( new SyllableCountStep( syllableCountStep ) );
	}.bind( this ) );
};

/**
 * Returns all available count steps.
 *
 * @returns {Array} All available count steps.
 */
SyllableCountIterator.prototype.getAvailableSyllableCountSteps = function() {
	return this.countSteps;
};

/**
 * Counts the syllables for all the steps and returns the total syllable count.
 *
 * @param {String} word The word to count syllables in.
 * @returns {number} The number of syllables found based on exclusions.
 */
SyllableCountIterator.prototype.countSyllables = function( word ) {
	var syllableCount = 0;
	forEach( this.countSteps, function( step ) {
		syllableCount += step.countSyllables( word );
	} );
	return syllableCount;
};

module.exports = SyllableCountIterator;

},{"./syllableCountStep.js":186,"lodash/forEach":141,"lodash/isUndefined":163}],186:[function(require,module,exports){
var isUndefined = require( "lodash/isUndefined" );

var arrayToRegex = require( "../stringProcessing/createRegexFromArray.js" );

/**
 * Constructs a language syllable regex that contains a regex for matching syllable exclusion.
 *
 * @param {object} syllableRegex The object containing the syllable exclusions.
 * @constructor
 */
var SyllableCountStep = function( syllableRegex ) {
	this._hasRegex = false;
	this._regex = "";
	this._multiplier = "";
	this.createRegex( syllableRegex );
};

/**
 * Returns if a valid regex has been set.
 *
 * @returns {boolean} True if a regex has been set, false if not.
 */
SyllableCountStep.prototype.hasRegex = function() {
	return this._hasRegex;
};

/**
 * Creates a regex based on the given syllable exclusions, and sets the multiplier to use.
 *
 * @param {object} syllableRegex The object containing the syllable exclusions and multiplier.
 */
SyllableCountStep.prototype.createRegex = function( syllableRegex ) {
	if ( ! isUndefined( syllableRegex ) && ! isUndefined( syllableRegex.fragments ) ) {
		this._hasRegex = true;
		this._regex = arrayToRegex( syllableRegex.fragments, true );
		this._multiplier = syllableRegex.countModifier;
	}
};

/**
 * Returns the stored regular expression.
 *
 * @returns {RegExp} The stored regular expression.
 */
SyllableCountStep.prototype.getRegex = function() {
	return this._regex;
};

/**
 * Matches syllable exclusions in a given word and the returns the number found multiplied with the
 * given multiplier.
 *
 * @param {String} word The word to match for syllable exclusions.
 * @returns {number} The amount of syllables found.
 */
SyllableCountStep.prototype.countSyllables = function( word ) {
	if ( this._hasRegex ) {
		var match = word.match( this._regex ) || [];
		return match.length * this._multiplier;
	}
	return 0;
};

module.exports = SyllableCountStep;

},{"../stringProcessing/createRegexFromArray.js":191,"lodash/isUndefined":163}],187:[function(require,module,exports){
var filteredPassiveAuxiliaries = require( "./passivevoice-english/auxiliaries.js" )().filteredAuxiliaries;
var notFilteredPassiveAuxiliaries = require( "./passivevoice-english/auxiliaries.js" )().notFilteredAuxiliaries;
var transitionWords = require( "./transitionWords.js" )().singleWords;

/**
 * Returns an array with exceptions for the keyword suggestion researcher.
 * @returns {Array} The array filled with exceptions.
 */

var articles = [ "the", "an", "a" ];
var numerals = [ "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen",
	"fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty", "first", "second", "third", "fourth",
	"fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth",
	"sixteenth", "seventeenth", "eighteenth", "nineteenth", "twentieth", "hundred", "hundreds", "thousand", "thousands",
	"million", "million", "billion", "billions" ];
var personalPronounsNominative = [ "i", "you", "he", "she", "it", "we", "they" ];
var personalPronounsAccusative = [ "me", "him", "her", "us", "them" ];
var demonstrativePronouns = [ "this", "that", "these", "those" ];
var possessivePronouns = [ "my", "your", "his", "her", "its", "their", "our", "mine", "yours", "hers", "theirs", "ours" ];
var quantifiers = [ "all", "some", "many", "few", "lot", "lots", "tons", "bit", "no", "every", "enough", "little", "less", "much", "more", "most",
	"plenty", "several", "few", "fewer", "many", "kind" ];
var reflexivePronouns = [ "myself", "yourself", "himself", "herself", "itself", "oneself", "ourselves", "yourselves", "themselves" ];
var indefinitePronouns = [ "none", "nobody", "everyone", "everybody", "someone", "somebody", "anyone", "anybody", "nothing",
	"everything", "something", "anything", "each", "another", "other", "whatever", "whichever", "whoever", "whomever",
	"whomsoever", "whosoever", "others", "neither", "both", "either", "any", "such" ];
var indefinitePronounsPossessive  = [ "one's", "nobody's", "everyone's", "everybody's", "someone's", "somebody's", "anyone's",
	"anybody's", "nothing's", "everything's", "something's", "anything's", "whoever's", "others'", "other's", "another's",
	"neither's", "either's" ];

// All relativePronouns are already included in other lists (interrogativeDeterminers, interrogativePronouns)
var relativePronouns = [];
var interrogativeDeterminers = [ "which", "what", "whose" ];
var interrogativePronouns = [ "who", "whom" ];
var interrogativeProAdverbs = [ "where", "whither", "whence", "how", "why", "whether", "wherever", "whomever", "whenever",
	"however", "whyever", "whoever", "whatever", "wheresoever", "whomsoever", "whensoever", "howsoever", "whysoever", "whosoever",
	"whatsoever", "whereso", "whomso", "whenso", "howso", "whyso", "whoso", "whatso" ];
var pronominalAdverbs = [ "therefor", "therein", "hereby", "hereto", "wherein", "therewith", "herewith", "wherewith", "thereby" ];
var locativeAdverbs = [ "there", "here", "whither", "thither", "hither", "whence", "thence", "hence" ];
var adverbialGenitives = [ "always", "afterwards", "towards", "once", "twice", "thrice", "amidst", "amongst", "midst", "whilst" ];
var otherAuxiliaries = [ "can", "cannot", "can't", "could", "couldn't", "could've", "dare", "dares", "dared", "daring", "do",
	"don't", "does", "doesn't", "did", "didn't", "doing", "done", "have", "haven't", "had", "hadn't", "has", "hasn't", "having",
	"i've", "you've", "we've", "they've", "i'd", "you'd", "he'd", "she'd", "it'd", "we'd", "they'd", "would", "wouldn't",
	"would've", "may", "might", "must", "need", "needn't", "needs", "ought", "shall", "shalln't", "shan't", "should",
	"shouldn't", "will", "won't", "i'll", "you'll", "he'll", "she'll", "it'll", "we'll", "they'll", "there's", "there're",
	"there'll", "here's", "here're", "there'll" ];
var copula = [ "appear", "appears", "appearing", "appeared", "become", "becomes", "becoming", "became", "come", "comes",
	"coming", "came", "keep", "keeps", "kept", "keeping", "remain", "remains", "remaining", "remained", "stay",
	"stays", "stayed", "staying", "turn", "turns", "turned" ];

var prepositions = [ "in", "from", "with", "under", "throughout", "atop", "for", "on", "until", "of", "to", "aboard", "about",
	"above", "abreast", "absent", "across", "adjacent", "after", "against", "along", "alongside", "amid", "midst", "mid",
	"among", "apropos", "apud", "around", "as", "astride", "at", "ontop", "before", "afore", "tofore", "behind", "ahind",
	"below", "ablow", "beneath", "neath", "beside", "besides", "between", "atween", "beyond", "ayond", "but", "by", "chez",
	"circa", "come", "despite", "spite", "down", "during", "except", "into", "less", "like", "minus", "near", "nearer",
	"nearest", "anear", "notwithstanding", "off", "onto", "opposite", "out", "outen", "over", "past", "per", "pre", "qua",
	"sans", "sauf", "since", "sithence", "than", "through", "thru", "truout", "toward", "underneath", "unlike", "until",
	"up", "upon", "upside", "versus", "via", "vis-à-vis", "without", "ago", "apart", "aside", "aslant", "away", "withal" ];

// Many prepositional adverbs are already listed as preposition.
var prepositionalAdverbs = [ "back", "within", "forward", "backward", "ahead" ];

var coordinatingConjunctions = [ "so", "and", "nor", "but", "or", "yet", "for" ];

// 'Rather' is part of 'rather...than', 'sooner' is part of 'no sooner...than', 'just' is part of 'just as...so',
// 'Only' is part of 'not only...but also'.
var correlativeConjunctions = [ "rather", "sooner", "just", "only" ];
var subordinatingConjunctions = [ "after", "although", "when", "as", "if", "though", "because", "before", "even", "since", "unless",
	"whereas", "while" ];

// These verbs are frequently used in interviews to indicate questions and answers.
// 'Claim','claims', 'state' and 'stated' are not included, because these words are also nouns.
var interviewVerbs = [ "say", "says", "said", "saying", "claimed", "ask", "asks", "asked", "asking", "stated", "stating",
	"explain", "explains", "explained", "think", "thinks" ];

// These transition words were not included in the list for the transition word assessment for various reasons.
var additionalTransitionWords = [ "and", "or", "about", "absolutely", "again", "definitely", "eternally", "expressively",
	"expressly", "extremely", "immediately", "including", "instantly", "namely", "naturally", "next", "notably", "now", "nowadays",
	"ordinarily", "positively", "truly", "ultimately", "uniquely", "usually", "almost", "first", "second", "third", "maybe",
	"probably", "granted", "initially", "overall", "too", "actually", "already", "e.g", "i.e", "often", "regularly", "simply",
	"optionally", "perhaps", "sometimes", "likely", "never", "ever", "else", "inasmuch", "provided", "currently", "incidentally",
	"elsewhere", "following", "particular", "recently", "relatively", "f.i", "clearly", "apparently" ];

var intensifiers = [ "highly", "very", "really", "extremely", "absolutely", "completely", "totally", "utterly", "quite",
	"somewhat", "seriously", "fairly", "fully", "amazingly" ];

// These verbs convey little meaning. 'Show', 'shows', 'uses', "meaning" are not included, because these words could be relevant nouns.
var delexicalisedVerbs = [ "seem", "seems", "seemed", "seeming", "let", "let's", "lets", "letting", "make", "making", "makes",
	"made", "want", "showing", "showed", "shown", "go", "goes", "going", "went", "gone", "take", "takes", "took", "taken", "set", "sets",
	"setting", "put", "puts", "putting", "use", "using", "used", "try", "tries", "tried", "trying", "mean", "means", "meant",
	"called", "based", "add", "adds", "adding", "added", "contain", "contains", "containing", "contained" ];

// These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
// Key word combinations containing these adjectives/adverbs are fine.
var generalAdjectivesAdverbs = [ "new", "newer", "newest", "old", "older", "oldest", "previous", "good", "well", "better", "best",
	"big", "bigger", "biggest", "easy", "easier", "easiest", "fast", "faster", "fastest", "far", "hard", "harder", "hardest",
	"least", "own", "large", "larger", "largest", "long", "longer", "longest", "low", "lower", "lowest", "high", "higher",
	"highest", "regular", "simple", "simpler", "simplest", "small", "smaller", "smallest", "tiny", "tinier", "tiniest",
	"short", "shorter", "shortest", "main", "actual", "nice", "nicer", "nicest", "real", "same", "able", "certain", "usual",
	"so-called", "mainly", "mostly", "recent", "anymore", "complete", "lately", "possible", "commonly", "constantly",
	"continually", "directly", "easily", "nearly", "slightly", "somewhere", "estimated", "latest", "different", "similar",
	"widely", "bad", "worse", "worst", "great" ];

var interjections = [ "oh", "wow", "tut-tut", "tsk-tsk", "ugh", "whew", "phew", "yeah", "yea", "shh", "oops", "ouch", "aha",
	"yikes" ];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
var recipeWords = [ "tbs", "tbsp", "spk", "lb", "qt", "pk", "bu", "oz", "pt", "mod", "doz", "hr", "f.g", "ml", "dl", "cl",
	"l", "mg", "g", "kg", "quart" ];

// 'People' should only be removed in combination with 'some', 'many' and 'few' (and is therefore not yet included in the list below).
var vagueNouns = [ "thing", "things", "way", "ways", "matter", "case", "likelihood", "ones", "piece", "pieces", "stuff", "times",
	"part", "parts", "percent", "instance", "instances", "aspect", "aspects", "item", "items", "people", "idea", "theme",
	"person", "percent" ];

// 'No' is already included in the quantifier list.
var miscellaneous = [ "not", "yes", "rid", "sure", "top", "bottom", "ok", "okay", "amen", "aka", "%" ];

module.exports = function() {
	return {
		articles: articles,
		personalPronouns: personalPronounsNominative.concat( personalPronounsAccusative, possessivePronouns ),
		prepositions: prepositions,
		demonstrativePronouns: demonstrativePronouns,
		conjunctions: coordinatingConjunctions.concat( subordinatingConjunctions ),
		verbs: filteredPassiveAuxiliaries.concat( notFilteredPassiveAuxiliaries, otherAuxiliaries, copula, interviewVerbs, delexicalisedVerbs ),
		quantifiers: quantifiers,
		relativePronouns: interrogativeDeterminers.concat( interrogativePronouns, interrogativeProAdverbs ),
		filteredPassiveAuxiliaries: filteredPassiveAuxiliaries,
		all: articles.concat( numerals, demonstrativePronouns, possessivePronouns, reflexivePronouns,
			personalPronounsNominative, personalPronounsAccusative, relativePronouns, quantifiers, indefinitePronouns,
			indefinitePronounsPossessive, interrogativeDeterminers, interrogativePronouns, interrogativeProAdverbs,
			pronominalAdverbs, locativeAdverbs, adverbialGenitives, prepositionalAdverbs, filteredPassiveAuxiliaries, notFilteredPassiveAuxiliaries,
			otherAuxiliaries, copula, prepositions, coordinatingConjunctions, correlativeConjunctions, subordinatingConjunctions, interviewVerbs,
			transitionWords, additionalTransitionWords, intensifiers, delexicalisedVerbs, interjections, generalAdjectivesAdverbs,
			recipeWords, vagueNouns, miscellaneous ),
	};
};

},{"./passivevoice-english/auxiliaries.js":188,"./transitionWords.js":189}],188:[function(require,module,exports){
// These auxiliaries are filtered from the beginning of word combinations in the keyword suggestions.
var filteredAuxiliaries =  [
	"am",
	"is",
	"are",
	"was",
	"were",
	"been",
	"get",
	"gets",
	"got",
	"gotten",
	"be",
	"she's",
	"he's",
	"it's",
	"i'm",
	"we're",
	"they're",
	"you're",
	"isn't",
	"weren't",
	"wasn't",
	"that's",
	"aren't",
];

// These auxiliaries are not filtered from the beginning of word combinations in the keyword suggestions.
var notFilteredAuxiliaries = [
	"being",
	"getting",
	"having",
	"what's",
];

module.exports = function() {
	return {
		filteredAuxiliaries: filteredAuxiliaries,
		notFilteredAuxiliaries: notFilteredAuxiliaries,
		all: filteredAuxiliaries.concat( notFilteredAuxiliaries ),
	};
};

},{}],189:[function(require,module,exports){
/** @module config/transitionWords */

var singleWords = [ "accordingly", "additionally", "afterward", "afterwards", "albeit", "also", "although", "altogether",
	 "another", "basically", "because", "before", "besides", "but", "certainly", "chiefly", "comparatively",
	"concurrently", "consequently", "contrarily", "conversely", "correspondingly", "despite", "doubtedly", "during",
	"e.g.", "earlier", "emphatically", "equally", "especially", "eventually", "evidently", "explicitly", "finally",
	"firstly", "following", "formerly", "forthwith", "fourthly", "further", "furthermore", "generally", "hence",
	"henceforth", "however", "i.e.", "identically", "indeed", "instead", "last", "lastly", "later", "lest", "likewise",
	"markedly", "meanwhile", "moreover", "nevertheless", "nonetheless", "nor",  "notwithstanding", "obviously",
	"occasionally", "otherwise", "overall", "particularly", "presently", "previously", "rather", "regardless", "secondly",
	"shortly", "significantly", "similarly", "simultaneously", "since", "so", "soon", "specifically", "still", "straightaway",
	"subsequently", "surely", "surprisingly", "than", "then", "thereafter", "therefore", "thereupon", "thirdly", "though",
	"thus", "till", "too", "undeniably", "undoubtedly", "unless", "unlike", "unquestionably", "until", "when", "whenever",
	"whereas", "while" ];
var multipleWords = [ "above all", "after all", "after that", "all in all", "all of a sudden", "all things considered",
	"analogous to", "although this may be true", "analogous to", "another key point", "as a matter of fact", "as a result",
	"as an illustration", 	"as can be seen", "as has been noted", "as I have noted", "as I have said", "as I have shown",
	"as long as", "as much as", "as shown above", "as soon as", "as well as", "at any rate", "at first", "at last",
	"at least", "at length", "at the present time", "at the same time", "at this instant", "at this point", "at this time",
	"balanced against", "being that", "by all means", "by and large", "by comparison", "by the same token", "by the time",
	"compared to", "be that as it may", "coupled with", "different from", "due to", "equally important", "even if",
	"even more", "even so", "even though", "first thing to remember", "for example", "for fear that", "for instance",
	"for one thing", "for that reason", "for the most part", "for the purpose of", "for the same reason", "for this purpose",
	"for this reason", "from time to time", "given that", "given these points", "important to realize", "in a word", "in addition",
	"in another case", "in any case", "in any event", "in brief", "in case", "in conclusion", "in contrast",
	"in detail", "in due time", "in effect", "in either case", "in essence", "in fact", "in general", "in light of",
	"in like fashion", "in like manner", "in order that", "in order to", "in other words", "in particular", "in reality",
	"in short", "in similar fashion", "in spite of", "in sum", "in summary", "in that case", "in the event that",
	"in the final analysis", "in the first place", "in the fourth place", "in the hope that", "in the light of",
	"in the long run", "in the meantime", "in the same fashion", "in the same way", "in the second place",
	"in the third place", "in this case", "in this situation", "in time", "in truth", "in view of", "inasmuch as",
	"most compelling evidence", "most important", "must be remembered", "not to mention", "now that", "of course",
	"on account of", "on balance", "on condition that", "on one hand", "on the condition that", "on the contrary",
	"on the negative side", "on the other hand", "on the positive side", "on the whole", "on this occasion", "once",
	"once in a while", 	"only if", "owing to", "point often overlooked", "prior to", "provided that", "seeing that",
	"so as to", "so far", "so long as", "so that", "sooner or later", "such as", "summing up", "take the case of",
	"that is", "that is to say", "then again", "this time", "to be sure", "to begin with", "to clarify", "to conclude",
	"to demonstrate", "to emphasize", "to enumerate", "to explain", "to illustrate", "to list", "to point out",
	"to put it another way", "to put it differently", "to repeat", "to rephrase it", "to say nothing of", "to sum up",
	"to summarize", "to that end", "to the end that", "to this end", "together with", "under those circumstances", "until now",
	"up against", "up to the present time", "vis a vis", "what's more", "while it may be true", "while this may be true",
	"with attention to", "with the result that", "with this in mind", "with this intention", "with this purpose in mind",
	"without a doubt", "without delay", "without doubt", "without reservation" ];

/**
 * Returns an array with transition words to be used by the assessments.
 * @returns {Array} The array filled with transition words.
 */
module.exports = function() {
	return {
		singleWords: singleWords,
		multipleWords: multipleWords,
		allWords: singleWords.concat( multipleWords )
	};
};

},{}],190:[function(require,module,exports){
/** @module stringProcessing/addWordboundary */

/**
 * Returns a string that can be used in a regex to match a matchString with word boundaries.
 *
 * @param {string} matchString The string to generate a regex string for.
 * @param {string} [extraWordBoundary] Extra characters to match a word boundary on.
 * @returns {string} A regex string that matches the matchString with word boundaries.
 */
module.exports = function( matchString, extraWordBoundary ) {
	var wordBoundary, wordBoundaryStart, wordBoundaryEnd;
	var _extraWordBoundary = extraWordBoundary || "";

	wordBoundary = "[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›" + _extraWordBoundary + "<>]";
	wordBoundaryStart = "(^|" + wordBoundary + ")";
	wordBoundaryEnd = "($|" + wordBoundary + ")";

	return wordBoundaryStart + matchString + wordBoundaryEnd;
};

},{}],191:[function(require,module,exports){
/** @module stringProcessing/createRegexFromArray */

var addWordBoundary = require( "../stringProcessing/addWordboundary.js" );
var map = require( "lodash/map" );

/**
 * Creates a regex of combined strings from the input array.
 *
 * @param {array} array The array with strings
 * @param {boolean} [disableWordBoundary] Boolean indicating whether or not to disable word boundaries
 * @returns {RegExp} regex The regex created from the array.
 */
module.exports = function( array, disableWordBoundary ) {
	var regexString;
	var _disableWordBoundary = disableWordBoundary || false;

	var boundedArray = map( array, function( string ) {
		if ( _disableWordBoundary ) {
			return string;
		}
		return addWordBoundary( string );
	} );

	regexString = "(" + boundedArray.join( ")|(" ) + ")";

	return new RegExp( regexString, "ig" );
};

},{"../stringProcessing/addWordboundary.js":190,"lodash/map":165}],192:[function(require,module,exports){
var map = require( "lodash/map" );
var isUndefined = require( "lodash/isUndefined" );
var forEach = require( "lodash/forEach" );
var isNaN = require( "lodash/isNaN" );
var filter = require( "lodash/filter" );
var flatMap = require( "lodash/flatMap" );
var isEmpty = require( "lodash/isEmpty" );
var negate = require( "lodash/negate" );
var memoize = require( "lodash/memoize" );

var core = require( "tokenizer2/core" );

var getBlocks = require( "../helpers/html.js" ).getBlocks;
var normalizeQuotes = require( "../stringProcessing/quotes.js" ).normalize;

var unifyWhitespace = require( "../stringProcessing/unifyWhitespace.js" ).unifyNonBreakingSpace;

// All characters that indicate a sentence delimiter.
var fullStop = ".";
// The \u2026 character is an ellipsis
var sentenceDelimiters = "?!;\u2026";
var newLines = "\n\r|\n|\r";

var fullStopRegex = new RegExp( "^[" + fullStop + "]$" );
var sentenceDelimiterRegex = new RegExp( "^[" + sentenceDelimiters + "]$" );
var sentenceRegex = new RegExp( "^[^" + fullStop + sentenceDelimiters + "<\\(\\)\\[\\]]+$" );
var htmlStartRegex = /^<([^>\s\/]+)[^>]*>$/mi;
var htmlEndRegex = /^<\/([^>\s]+)[^>]*>$/mi;
var newLineRegex = new RegExp( newLines );

var blockStartRegex = /^\s*[\[\(\{]\s*$/;
var blockEndRegex = /^\s*[\]\)}]\s*$/;

var tokens = [];
var sentenceTokenizer;

/**
 * Creates a tokenizer to create tokens from a sentence.
 *
 * @returns {void}
 */
function createTokenizer() {
	tokens = [];

	sentenceTokenizer = core( function( token ) {
		tokens.push( token );
	} );

	sentenceTokenizer.addRule( htmlStartRegex, "html-start" );
	sentenceTokenizer.addRule( htmlEndRegex, "html-end" );
	sentenceTokenizer.addRule( blockStartRegex, "block-start" );
	sentenceTokenizer.addRule( blockEndRegex, "block-end" );
	sentenceTokenizer.addRule( fullStopRegex, "full-stop" );
	sentenceTokenizer.addRule( sentenceDelimiterRegex, "sentence-delimiter" );
	sentenceTokenizer.addRule( sentenceRegex, "sentence" );
}

/**
 * Returns whether or not a certain character is a capital letter.
 *
 * @param {string} character The character to check.
 * @returns {boolean} Whether or not the character is a capital letter.
 */
function isCapitalLetter( character ) {
	return character !== character.toLocaleLowerCase();
}

/**
 * Returns whether or not a certain character is a number.
 *
 * @param {string} character The character to check.
 * @returns {boolean} Whether or not the character is a capital letter.
 */
function isNumber( character ) {
	return ! isNaN( parseInt( character, 10 ) );
}

/**
 * Returns whether or not a given HTML tag is a break tag.
 *
 * @param {string} htmlTag The HTML tag to check.
 * @returns {boolean} Whether or not the given HTML tag is a break tag.
 */
function isBreakTag( htmlTag ) {
	return /<br/.test( htmlTag );
}

/**
 * Returns whether or not a given character is quotation mark.
 *
 * @param {string} character The character to check.
 * @returns {boolean} Whether or not the given character is a quotation mark.
 */
function isQuotation( character ) {
	character = normalizeQuotes( character );

	return "'" === character ||
		"\"" === character;
}

/**
 * Returns whether or not a given character is a punctuation mark that can be at the beginning
 * of a sentence, like ¿ and ¡ used in Spanish.
 *
 * @param {string} character The character to check.
 * @returns {boolean} Whether or not the given character is a punctuation mark.
 */
function isPunctuation( character ) {
	return "¿" === character ||
		"¡" === character;
}

/**
 * Tokenizes a sentence, assumes that the text has already been split into blocks.
 *
 * @param {string} text The text to tokenize.
 * @returns {Array} An array of tokens.
 */
function tokenizeSentences( text ) {
	createTokenizer();
	sentenceTokenizer.onText( text );

	sentenceTokenizer.end();

	return tokens;
}

/**
 * Removes duplicate whitespace from a given text.
 *
 * @param {string} text The text with duplicate whitespace.
 * @returns {string} The text without duplicate whitespace.
 */
function removeDuplicateWhitespace( text ) {
	return text.replace( /\s+/, " " );
}

/**
 * Retrieves the next two characters from an array with the two next tokens.
 *
 * @param {Array} nextTokens The two next tokens. Might be undefined.
 * @returns {string} The next two characters.
 */
function getNextTwoCharacters( nextTokens ) {
	var next = "";

	if ( ! isUndefined( nextTokens[ 0 ] ) ) {
		next += nextTokens[ 0 ].src;
	}

	if ( ! isUndefined( nextTokens[ 1 ] ) ) {
		next += nextTokens[ 1 ].src;
	}

	next = removeDuplicateWhitespace( next );

	return next;
}

/**
 * Checks if the sentenceBeginning beginning is a valid beginning.
 *
 * @param {string} sentenceBeginning The beginning of the sentence to validate.
 * @returns {boolean} Returns true if it is a valid beginning, false if it is not.
 */
function isValidSentenceBeginning( sentenceBeginning ) {
	return (
		isCapitalLetter( sentenceBeginning ) ||
		isNumber( sentenceBeginning ) ||
		isQuotation( sentenceBeginning ) ||
		isPunctuation( sentenceBeginning )
	);
}

/**
 * Checks if the token is a valid sentence ending.
 *
 * @param {Object} token The token to validate.
 * @returns {boolean} Returns true if the token is valid ending, false if it is not.
 */
function isSentenceStart( token ) {
	return ( ! isUndefined( token ) && (
		"html-start" === token.type ||
		"html-end" === token.type ||
		"block-start" === token.type
	) );
}

/**
 * Returns an array of sentences for a given array of tokens, assumes that the text has already been split into blocks.
 *
 * @param {Array} tokens The tokens from the sentence tokenizer.
 * @returns {Array<string>} A list of sentences.
 */
function getSentencesFromTokens( tokens ) {
	var tokenSentences = [], currentSentence = "", nextSentenceStart;

	var sliced;

	// Drop the first and last HTML tag if both are present.
	do {
		sliced = false;
		var firstToken = tokens[ 0 ];
		var lastToken = tokens[ tokens.length - 1 ];

		if ( firstToken.type === "html-start" && lastToken.type === "html-end" ) {
			tokens = tokens.slice( 1, tokens.length - 1 );

			sliced = true;
		}
	} while ( sliced && tokens.length > 1 );

	forEach( tokens, function( token, i ) {
		var hasNextSentence;
		var nextToken = tokens[ i + 1 ];
		var secondToNextToken = tokens[ i + 2 ];
		var nextCharacters;

		switch ( token.type ) {

			case "html-start":
			case "html-end":
				if ( isBreakTag( token.src ) ) {
					tokenSentences.push( currentSentence );
					currentSentence = "";
				} else {
					currentSentence += token.src;
				}
				break;

			case "sentence":
				currentSentence += token.src;
				break;

			case "sentence-delimiter":
				currentSentence += token.src;

				if ( ! isUndefined( nextToken ) && "block-end" !== nextToken.type ) {
					tokenSentences.push( currentSentence );
					currentSentence = "";
				}
				break;

			case "full-stop":
				currentSentence += token.src;

				nextCharacters = getNextTwoCharacters( [ nextToken, secondToNextToken ] );

				// For a new sentence we need to check the next two characters.
				hasNextSentence = nextCharacters.length >= 2;
				nextSentenceStart = hasNextSentence ? nextCharacters[ 1 ] : "";
				// If the next character is a number, never split. For example: IPv4-numbers.
				if ( hasNextSentence && isNumber( nextCharacters[ 0 ] ) ) {
					break;
				}
				// Only split on sentence delimiters when the next sentence looks like the start of a sentence.

				if ( ( hasNextSentence && isValidSentenceBeginning( nextSentenceStart ) ) || isSentenceStart( nextToken ) ) {
					tokenSentences.push( currentSentence );
					currentSentence = "";
				}
				break;

			case "newline":
				tokenSentences.push( currentSentence );
				currentSentence = "";
				break;

			case "block-start":
				currentSentence += token.src;
				break;

			case "block-end":
				currentSentence += token.src;

				nextCharacters = getNextTwoCharacters( [ nextToken, secondToNextToken ] );

				// For a new sentence we need to check the next two characters.
				hasNextSentence = nextCharacters.length >= 2;
				nextSentenceStart = hasNextSentence ? nextCharacters[ 0 ] : "";
				// If the next character is a number, never split. For example: IPv4-numbers.
				if ( hasNextSentence && isNumber( nextCharacters[ 0 ] ) ) {
					break;
				}

				if ( ( hasNextSentence && isValidSentenceBeginning( nextSentenceStart ) ) || isSentenceStart( nextToken ) ) {
					tokenSentences.push( currentSentence );
					currentSentence = "";
				}
				break;
		}
	} );

	if ( "" !== currentSentence ) {
		tokenSentences.push( currentSentence );
	}

	tokenSentences = map( tokenSentences, function( sentence ) {
		return sentence.trim();
	} );

	return tokenSentences;
}

/**
 * Returns the sentences from a certain block.
 *
 * @param {string} block The HTML inside a HTML block.
 * @returns {Array<string>} The list of sentences in the block.
 */
function getSentencesFromBlock( block ) {
	var tokens = tokenizeSentences( block );

	return tokens.length === 0 ? [] : getSentencesFromTokens( tokens );
}

var getSentencesFromBlockCached = memoize( getSentencesFromBlock );

/**
 * Returns sentences in a string.
 *
 * @param {String} text The string to count sentences in.
 * @returns {Array} Sentences found in the text.
 */
module.exports = function( text ) {
	text = unifyWhitespace( text );
	var sentences, blocks = getBlocks( text );

	// Split each block on newlines.
	blocks = flatMap( blocks, function( block ) {
		return block.split( newLineRegex );
	} );

	sentences = flatMap( blocks, getSentencesFromBlockCached );

	return filter( sentences, negate( isEmpty ) );
};

},{"../helpers/html.js":184,"../stringProcessing/quotes.js":194,"../stringProcessing/unifyWhitespace.js":201,"lodash/filter":136,"lodash/flatMap":139,"lodash/forEach":141,"lodash/isEmpty":153,"lodash/isNaN":156,"lodash/isUndefined":163,"lodash/map":165,"lodash/memoize":166,"lodash/negate":167,"tokenizer2/core":178}],193:[function(require,module,exports){
/** @module stringProcessing/countWords */

var stripTags = require( "./stripHTMLTags.js" ).stripFullTags;
var stripSpaces = require( "./stripSpaces.js" );
var removePunctuation = require( "./removePunctuation.js" );
var map = require( "lodash/map" );
var filter = require( "lodash/filter" );

/**
 * Returns an array with words used in the text.
 *
 * @param {string} text The text to be counted.
 * @returns {Array} The array with all words.
 */
module.exports = function( text ) {
	text = stripSpaces( stripTags( text ) );
	if ( text === "" ) {
		return [];
	}

	var words = text.split( /\s/g );

	words = map( words, function( word ) {
		return removePunctuation( word );
	} );

	return filter( words, function( word ) {
		return word.trim() !== "";
	} );
};


},{"./removePunctuation.js":196,"./stripHTMLTags.js":197,"./stripSpaces.js":198,"lodash/filter":136,"lodash/map":165}],194:[function(require,module,exports){
/**
 * Normalizes single quotes to 'regular' quotes.
 *
 * @param {string} text Text to normalize.
 * @returns {string} The normalized text.
 */
function normalizeSingleQuotes( text ) {
	return text.replace( /[‘’‛`]/g, "'" );
}

/**
 * Normalizes double quotes to 'regular' quotes.
 *
 * @param {string} text Text to normalize.
 * @returns {string} The normalized text.
 */
function normalizeDoubleQuotes( text ) {
	return text.replace( /[“”〝〞〟‟„]/g, "\"" );
}

/**
 * Normalizes quotes to 'regular' quotes.
 *
 * @param {string} text Text to normalize.
 * @returns {string} The normalized text.
 */
function normalizeQuotes( text ) {
	return normalizeDoubleQuotes( normalizeSingleQuotes( text ) );
}

module.exports = {
	normalizeSingle: normalizeSingleQuotes,
	normalizeDouble: normalizeDoubleQuotes,
	normalize: normalizeQuotes,
};

},{}],195:[function(require,module,exports){
var getWords = require( "../stringProcessing/getWords" );
var getSentences = require( "../stringProcessing/getSentences" );
var WordCombination = require( "../values/WordCombination" );
var normalizeSingleQuotes = require( "../stringProcessing/quotes.js" ).normalizeSingle;
var functionWords = require( "../researches/english/functionWords.js" );
var countSyllables = require( "../stringProcessing/syllables/count.js" );

var filter = require( "lodash/filter" );
var map = require( "lodash/map" );
var forEach = require( "lodash/forEach" );
var has = require( "lodash/has" );
var flatMap = require( "lodash/flatMap" );
var values = require( "lodash/values" );
var take = require( "lodash/take" );
var includes = require( "lodash/includes" );
var intersection = require( "lodash/intersection" );
var isEmpty = require( "lodash/isEmpty" );

var densityLowerLimit = 0;
var densityUpperLimit = 0.03;
var relevantWordLimit = 100;
var wordCountLowerLimit = 200;

// En dash, em dash and hyphen-minus.
var specialCharacters = [ "–", "—", "-" ];

/**
 * Returns the word combinations for the given text based on the combination size.
 *
 * @param {string} text The text to retrieve combinations for.
 * @param {number} combinationSize The size of the combinations to retrieve.
 * @returns {WordCombination[]} All word combinations for the given text.
 */
function getWordCombinations( text, combinationSize ) {
	var sentences = getSentences( text );

	var words, combination;

	return flatMap( sentences, function( sentence ) {
		sentence = sentence.toLocaleLowerCase();
		sentence = normalizeSingleQuotes( sentence );
		words = getWords( sentence );

		return filter( map( words, function( word, i ) {
			// If there are still enough words in the sentence to slice of.
			if ( i + combinationSize - 1 < words.length ) {
				combination = words.slice( i, i + combinationSize );
				return new WordCombination( combination );
			}

			return false;
		} ) );
	} );
}

/**
 * Calculates occurrences for a list of word combinations.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to calculate occurrences for.
 * @returns {WordCombination[]} Word combinations with their respective occurrences.
 */
function calculateOccurrences( wordCombinations ) {
	var occurrences = {};

	forEach( wordCombinations, function( wordCombination ) {
		var combination = wordCombination.getCombination();

		if ( ! has( occurrences, combination ) ) {
			occurrences[ combination ] = wordCombination;
		}

		occurrences[ combination ].incrementOccurrences();
	} );

	return values( occurrences );
}

/**
 * Returns only the relevant combinations from a list of word combinations. Assumes
 * occurrences have already been calculated.
 *
 * @param {WordCombination[]} wordCombinations A list of word combinations.
 * @returns {WordCombination[]} Only relevant word combinations.
 */
function getRelevantCombinations( wordCombinations ) {
	wordCombinations = wordCombinations.filter( function( combination ) {
		return combination.getOccurrences() !== 1 &&
			combination.getRelevance() !== 0;
	} );
	return wordCombinations;
}

/**
 * Sorts combinations based on their relevance and length.
 *
 * @param {WordCombination[]} wordCombinations The combinations to sort.
 * @returns {void}
 */
function sortCombinations( wordCombinations ) {
	wordCombinations.sort( function( combinationA, combinationB ) {
		var difference = combinationB.getRelevance() - combinationA.getRelevance();
		// The combination with the highest relevance comes first.
		if ( difference !== 0 ) {
			return difference;
		}
		// In case of a tie on relevance, the longest combination comes first.
		return combinationB.getLength() - combinationA.getLength();
	} );
}

/**
 * Filters word combinations beginning with certain function words.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {array} functionWords The list of function words.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterFunctionWordsAtBeginning( wordCombinations, functionWords ) {
	return wordCombinations.filter( function( combination ) {
		return ! includes( functionWords, combination.getWords()[ 0 ] );
	} );
}

/**
 * Filters word combinations ending with certain function words.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {array} functionWords The list of function words.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterFunctionWordsAtEnding( wordCombinations, functionWords ) {
	return wordCombinations.filter( function( combination ) {
		var words = combination.getWords();
		var lastWordIndex = words.length - 1;
		return ! includes( functionWords, words[ lastWordIndex ] );
	} );
}

/**
 * Filters word combinations beginning and ending with certain function words.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {array} functionWords The list of function words.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterFunctionWords( wordCombinations, functionWords ) {
	wordCombinations = filterFunctionWordsAtBeginning( wordCombinations, functionWords );
	wordCombinations = filterFunctionWordsAtEnding( wordCombinations, functionWords );
	return wordCombinations;
}

/**
 * Filters word combinations containing a special character.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {array} specialCharacters The list of special characters.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterSpecialCharacters( wordCombinations, specialCharacters ) {
	return wordCombinations.filter( function( combination ) {
		return isEmpty(
			intersection( specialCharacters, combination.getWords() )
		);
	} );
}
/**
 * Filters word combinations with a length of one and a given syllable count.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {number} syllableCount The number of syllables to use for filtering.
 * @returns {WordCombination[]} Filtered word combinations.
 */
 function filterOnSyllableCount( wordCombinations, syllableCount ) {
	return wordCombinations.filter( function( combination )  {
		return ! ( combination.getLength() === 1 && countSyllables( combination.getWords()[ 0 ], "en_US" ) <= syllableCount );
	} );
 }

/**
 * Filters word combinations based on keyword density if the word count is 200 or over.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {number} wordCount The number of words in the total text.
 * @param {number} densityLowerLimit The lower limit of keyword density.
 * @param {number} densityUpperLimit The upper limit of keyword density.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterOnDensity( wordCombinations, wordCount, densityLowerLimit, densityUpperLimit ) {
	return wordCombinations.filter( function( combination ) {
		return ( combination.getDensity( wordCount ) >= densityLowerLimit && combination.getDensity( wordCount ) < densityUpperLimit
		);
	} );
}

/**
 * Returns the relevant words in a given text.
 *
 * @param {string} text The text to retrieve the relevant words of.
 * @returns {WordCombination[]} All relevant words sorted and filtered for this text.
 */
function getRelevantWords( text ) {
	var words = getWordCombinations( text, 1 );
	var wordCount = words.length;

	var oneWordCombinations = getRelevantCombinations(
		calculateOccurrences( words )
	);

	sortCombinations( oneWordCombinations );
	oneWordCombinations = take( oneWordCombinations, 100 );

	var oneWordRelevanceMap = {};

	forEach( oneWordCombinations, function( combination ) {
		oneWordRelevanceMap[ combination.getCombination() ] = combination.getRelevance();
	} );

	var twoWordCombinations = calculateOccurrences( getWordCombinations( text, 2 ) );
	var threeWordCombinations = calculateOccurrences( getWordCombinations( text, 3 ) );
	var fourWordCombinations = calculateOccurrences( getWordCombinations( text, 4 ) );
	var fiveWordCombinations = calculateOccurrences( getWordCombinations( text, 5 ) );

	var combinations = oneWordCombinations.concat(
		twoWordCombinations,
		threeWordCombinations,
		fourWordCombinations,
		fiveWordCombinations
	);

	combinations = filterFunctionWords( combinations, specialCharacters );
	combinations = filterFunctionWords( combinations, functionWords().articles );
	combinations = filterFunctionWords( combinations, functionWords().personalPronouns );
	combinations = filterFunctionWords( combinations, functionWords().prepositions );
	combinations = filterFunctionWords( combinations, functionWords().conjunctions );
	combinations = filterFunctionWords( combinations, functionWords().quantifiers );
	combinations = filterFunctionWords( combinations, functionWords().demonstrativePronouns );
	combinations = filterFunctionWordsAtBeginning( combinations, functionWords().filteredPassiveAuxiliaries );
	combinations = filterFunctionWordsAtEnding( combinations, functionWords().verbs );
	combinations = filterFunctionWordsAtEnding( combinations, functionWords().relativePronouns );
	combinations = filterOnSyllableCount( combinations, 1 );


	forEach( combinations, function( combination ) {
		combination.setRelevantWords( oneWordRelevanceMap );
	} );

	combinations = getRelevantCombinations( combinations, wordCount );
	sortCombinations( combinations );

	if ( wordCount >= wordCountLowerLimit ) {
		combinations = filterOnDensity( combinations, wordCount, densityLowerLimit, densityUpperLimit );
	}

	return take( combinations, relevantWordLimit );
}

module.exports = {
	getWordCombinations: getWordCombinations,
	getRelevantWords: getRelevantWords,
	calculateOccurrences: calculateOccurrences,
	getRelevantCombinations: getRelevantCombinations,
	sortCombinations: sortCombinations,
	filterFunctionWordsAtBeginning: filterFunctionWordsAtBeginning,
	filterFunctionWords: filterFunctionWords,
	filterSpecialCharacters: filterSpecialCharacters,
	filterOnSyllableCount: filterOnSyllableCount,
	filterOnDensity: filterOnDensity,
};

},{"../researches/english/functionWords.js":187,"../stringProcessing/getSentences":192,"../stringProcessing/getWords":193,"../stringProcessing/quotes.js":194,"../stringProcessing/syllables/count.js":200,"../values/WordCombination":202,"lodash/filter":136,"lodash/flatMap":139,"lodash/forEach":141,"lodash/has":143,"lodash/includes":146,"lodash/intersection":147,"lodash/isEmpty":153,"lodash/map":165,"lodash/take":172,"lodash/values":177}],196:[function(require,module,exports){
// Replace all other punctuation characters at the beginning or at the end of a word.
var punctuationRegexString = "[\\–\\-\\(\\)_\\[\\]’“”\"'.?!:;,¿¡«»\u2014\u00d7\u002b\u0026]+";
var punctuationRegexStart = new RegExp( "^" + punctuationRegexString );
var punctuationRegexEnd = new RegExp( punctuationRegexString + "$" );

/**
 * Replaces punctuation characters from the given text string.
 *
 * @param {String} text The text to remove the punctuation characters for.
 *
 * @returns {String} The sanitized text.
 */
module.exports = function( text ) {
	text = text.replace( punctuationRegexStart, "" );
	text = text.replace( punctuationRegexEnd, "" );

	return text;
};

},{}],197:[function(require,module,exports){
/** @module stringProcessing/stripHTMLTags */

var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

var blockElements = require( "../helpers/html.js" ).blockElements;

var blockElementStartRegex = new RegExp( "^<(" + blockElements.join( "|" ) + ")[^>]*?>", "i" );
var blockElementEndRegex = new RegExp( "</(" + blockElements.join( "|" ) + ")[^>]*?>$", "i" );

/**
 * Strip incomplete tags within a text. Strips an endtag at the beginning of a string and the start tag at the end of a
 * start of a string.
 * @param {String} text The text to strip the HTML-tags from at the begin and end.
 * @returns {String} The text without HTML-tags at the begin and end.
 */
var stripIncompleteTags = function( text ) {
	text = text.replace( /^(<\/([^>]+)>)+/i, "" );
	text = text.replace( /(<([^\/>]+)>)+$/i, "" );
	return text;
};

/**
 * Removes the block element tags at the beginning and end of a string and returns this string.
 *
 * @param {string} text The unformatted string.
 * @returns {string} The text with removed HTML begin and end block elements
 */
var stripBlockTagsAtStartEnd = function( text ) {
	text = text.replace( blockElementStartRegex, "" );
	text = text.replace( blockElementEndRegex, "" );
	return text;
};

/**
 * Strip HTML-tags from text
 *
 * @param {String} text The text to strip the HTML-tags from.
 * @returns {String} The text without HTML-tags.
 */
var stripFullTags = function( text ) {
	text = text.replace( /(<([^>]+)>)/ig, " " );
	text = stripSpaces( text );
	return text;
};

module.exports = {
	stripFullTags: stripFullTags,
	stripIncompleteTags: stripIncompleteTags,
	stripBlockTagsAtStartEnd: stripBlockTagsAtStartEnd,
};

},{"../helpers/html.js":184,"../stringProcessing/stripSpaces.js":198}],198:[function(require,module,exports){
/** @module stringProcessing/stripSpaces */

/**
 * Strip double spaces from text
 *
 * @param {String} text The text to strip spaces from.
 * @returns {String} The text without double spaces
 */
module.exports = function( text ) {
	// Replace multiple spaces with single space
	text = text.replace( /\s{2,}/g, " " );

	// Replace spaces followed by periods with only the period.
	text = text.replace( /\s\./g, "." );

	// Remove first/last character if space
	text = text.replace( /^\s+|\s+$/g, "" );

	return text;
};

},{}],199:[function(require,module,exports){
var isUndefined = require( "lodash/isUndefined" );
var pick = require( "lodash/pick" );

/**
 * Represents a partial deviation when counting syllables
 *
 * @param {Object} options Extra options about how to match this fragment.
 * @param {string} options.location The location in the word where this deviation can occur.
 * @param {string} options.word The actual string that should be counted differently.
 * @param {number} options.syllables The amount of syllables this fragment has.
 * @param {string[]} [options.notFollowedBy] A list of characters that this fragment shouldn't be followed with.
 * @param {string[]} [options.alsoFollowedBy] A list of characters that this fragment could be followed with.
 *
 * @constructor
 */
function DeviationFragment( options ) {
	this._location = options.location;
	this._fragment = options.word;
	this._syllables = options.syllables;
	this._regex = null;

	this._options = pick( options, [ "notFollowedBy", "alsoFollowedBy" ] );
}

/**
 * Creates a regex that matches this fragment inside a word.
 *
 * @returns {void}
 */
DeviationFragment.prototype.createRegex = function() {
	var regexString = "";
	var options = this._options;

	var fragment = this._fragment;

	if ( ! isUndefined( options.notFollowedBy ) ) {
		fragment += "(?![" + options.notFollowedBy.join( "" ) + "])";
	}

	if ( ! isUndefined( options.alsoFollowedBy ) ) {
		fragment += "[" + options.alsoFollowedBy.join( "" ) + "]?";
	}

	switch ( this._location ) {
		case "atBeginning":
			regexString = "^" + fragment;
			break;

		case "atEnd":
			regexString = fragment + "$";
			break;

		case "atBeginningOrEnd":
			regexString = "(^" + fragment + ")|(" + fragment + "$)";
			break;

		default:
			regexString = fragment;
			break;
	}

	this._regex = new RegExp( regexString );
};

/**
 * Returns the regex that matches this fragment inside a word.
 *
 * @returns {RegExp} The regexp that matches this fragment.
 */
DeviationFragment.prototype.getRegex = function() {
	if ( null === this._regex ) {
		this.createRegex();
	}

	return this._regex;
};

/**
 * Returns whether or not this fragment occurs in a word.
 *
 * @param {string} word The word to match the fragment in.
 * @returns {boolean} Whether or not this fragment occurs in a word.
 */
DeviationFragment.prototype.occursIn = function( word ) {
	var regex = this.getRegex();

	return regex.test( word );
};

/**
 * Removes this fragment from the given word.
 *
 * @param {string} word The word to remove this fragment from.
 * @returns {string} The modified word.
 */
DeviationFragment.prototype.removeFrom = function( word ) {
	// Replace by a space to keep the remaining parts separated.
	return word.replace( this._fragment, " " );
};

/**
 * Returns the amount of syllables for this fragment.
 *
 * @returns {number} The amount of syllables for this fragment.
 */
DeviationFragment.prototype.getSyllables = function() {
	return this._syllables;
};

module.exports = DeviationFragment;

},{"lodash/isUndefined":163,"lodash/pick":168}],200:[function(require,module,exports){
/** @module stringProcessing/countSyllables */

var syllableMatchers = require( "../../config/syllables.js" );

var getWords = require( "../getWords.js" );

var forEach = require( "lodash/forEach" );
var filter = require( "lodash/filter" );
var find = require( "lodash/find" );
var isUndefined = require( "lodash/isUndefined" );
var map = require( "lodash/map" );
var sum = require( "lodash/sum" );
var memoize = require( "lodash/memoize" );
var flatMap = require( "lodash/flatMap" );

var SyllableCountIterator = require( "../../helpers/syllableCountIterator.js" );
var DeviationFragment = require( "./DeviationFragment" );

/**
 * Counts vowel groups inside a word.
 *
 * @param {string} word A text with words to count syllables.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {number} the syllable count.
 */
var countVowelGroups = function( word, locale ) {
	var numberOfSyllables = 0;
	var vowelRegex = new RegExp( "[^" + syllableMatchers( locale ).vowels + "]", "ig" );
	var foundVowels = word.split( vowelRegex );
	var filteredWords = filter( foundVowels, function( vowel ) {
		return vowel !== "";
	} );
	numberOfSyllables += filteredWords.length;

	return numberOfSyllables;
};

/**
 * Counts the syllables using vowel exclusions. These are used for groups of vowels that are more or less
 * than 1 syllable.
 *
 * @param {String} word The word to count syllables of.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {number} The number of syllables found in the given word.
 */
var countVowelDeviations = function( word, locale ) {
	var syllableCountIterator = new SyllableCountIterator( syllableMatchers( locale ) );
	return syllableCountIterator.countSyllables( word );
};

/**
 * Returns the number of syllables for the word if it is in the list of full word deviations.
 *
 * @param {String} word The word to retrieve the syllables for.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {number} The number of syllables found.
 */
var countFullWordDeviations = function( word, locale ) {
	var fullWordDeviations = syllableMatchers( locale ).deviations.words.full;

	var deviation = find( fullWordDeviations, function( fullWordDeviation ) {
		return fullWordDeviation.word === word;
	} );

	if ( ! isUndefined( deviation ) ) {
		return deviation.syllables;
	}

	return 0;
};

/**
 * Creates an array of deviation fragments for a certain locale.
 *
 * @param {Object} syllableConfig Syllable config for a certain locale.
 * @returns {DeviationFragment[]} A list of deviation fragments
 */
function createDeviationFragments( syllableConfig ) {
	var deviationFragments = [];

	var deviations = syllableConfig.deviations;

	if ( ! isUndefined( deviations.words ) && ! isUndefined( deviations.words.fragments ) ) {
		deviationFragments = flatMap( deviations.words.fragments, function( fragments, fragmentLocation ) {
			return map( fragments, function( fragment ) {
				fragment.location = fragmentLocation;

				return new DeviationFragment( fragment );
			} );
		} );
	}

	return deviationFragments;
}

var createDeviationFragmentsMemoized = memoize( createDeviationFragments );

/**
 * Counts syllables in partial exclusions. If these are found, returns the number of syllables  found, and the modified word.
 * The word is modified so the excluded part isn't counted by the normal syllable counter.
 *
 * @param {String} word The word to count syllables of.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {object} The number of syllables found and the modified word.
 */
var countPartialWordDeviations = function( word, locale ) {
	var deviationFragments = createDeviationFragmentsMemoized( syllableMatchers( locale ) );
	var remainingParts = word;
	var syllableCount = 0;

	forEach( deviationFragments, function( deviationFragment ) {
		if ( deviationFragment.occursIn( remainingParts ) ) {
			remainingParts = deviationFragment.removeFrom( remainingParts );
			syllableCount += deviationFragment.getSyllables();
		}
	} );

	return { word: remainingParts, syllableCount: syllableCount };
};

/**
 * Count the number of syllables in a word, using vowels and exceptions.
 *
 * @param {String} word The word to count the number of syllables of.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {number} The number of syllables found in a word.
 */
var countUsingVowels = function( word, locale ) {
	var syllableCount = 0;

	syllableCount += countVowelGroups( word, locale );
	syllableCount += countVowelDeviations( word, locale );

	return syllableCount;
};

/**
 * Counts the number of syllables in a word.
 *
 * @param {string} word The word to count syllables of.
 * @param {string} locale The locale of the word.
 * @returns {number} The syllable count for the word.
 */
var countSyllablesInWord = function( word, locale ) {
	var syllableCount = 0;

	var fullWordExclusion = countFullWordDeviations( word, locale );
	if ( fullWordExclusion !== 0 ) {
		return fullWordExclusion;
	}

	var partialExclusions = countPartialWordDeviations( word, locale );
	word = partialExclusions.word;
	syllableCount += partialExclusions.syllableCount;
	syllableCount += countUsingVowels( word, locale );

	return syllableCount;
};

/**
 * Counts the number of syllables in a text per word based on vowels.
 * Uses exclusion words for words that cannot be matched with vowel matching.
 *
 * @param {String} text The text to count the syllables of.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {int} The total number of syllables found in the text.
 */
var countSyllablesInText = function( text, locale ) {
	text = text.toLocaleLowerCase();
	var words = getWords( text );

	var syllableCounts = map( words,  function( word ) {
		return countSyllablesInWord( word, locale );
	} );

	return sum( syllableCounts );
};

module.exports = countSyllablesInText;

},{"../../config/syllables.js":179,"../../helpers/syllableCountIterator.js":185,"../getWords.js":193,"./DeviationFragment":199,"lodash/filter":136,"lodash/find":137,"lodash/flatMap":139,"lodash/forEach":141,"lodash/isUndefined":163,"lodash/map":165,"lodash/memoize":166,"lodash/sum":171}],201:[function(require,module,exports){
/** @module stringProcessing/unifyWhitespace */

/**
 * Replaces a non breaking space with a normal space
 * @param {string} text The string to replace the non breaking space in.
 * @returns {string} The text with unified spaces.
 */
var unifyNonBreakingSpace = function( text ) {
	return text.replace( /&nbsp;/g, " " );
};

/**
 * Replaces all whitespaces with a normal space
 * @param {string} text The string to replace the non breaking space in.
 * @returns {string} The text with unified spaces.
 */
var unifyWhiteSpace = function( text ) {
	return text.replace( /\s/g, " " );
};

/**
 * Converts all whitespace to spaces.
 *
 * @param {string} text The text to replace spaces.
 * @returns {string} The text with unified spaces.
 */
var unifyAllSpaces = function( text ) {
	text = unifyNonBreakingSpace( text );
	return unifyWhiteSpace( text );
};

module.exports = {
	unifyNonBreakingSpace: unifyNonBreakingSpace,
	unifyWhiteSpace: unifyWhiteSpace,
	unifyAllSpaces: unifyAllSpaces,
};

},{}],202:[function(require,module,exports){
var functionWords = require( "../researches/english/functionWords" )().all;
var forEach = require( "lodash/forEach" );
var has = require( "lodash/has" );

/**
 * Returns whether or not the given word is a function word.
 *
 * @param {string} word The word to check.
 * @returns {boolean} Whether or not the word is a function word.
 */
function isFunctionWord( word ) {
	return -1 !== functionWords.indexOf( word.toLocaleLowerCase() );
}

/**
 * Represents a word combination in the context of relevant words.
 *
 * @constructor
 *
 * @param {string[]} words The list of words that this combination consists of.
 * @param {number} [occurrences] The number of occurrences, defaults to 0.
 */
function WordCombination( words, occurrences ) {
	this._words = words;
	this._length = words.length;
	this._occurrences = occurrences || 0;
}

WordCombination.lengthBonus = {
	2: 3,
	3: 7,
	4: 12,
	5: 18,
};

/**
 * Returns the base relevance based on the length of this combination.
 *
 * @returns {number} The base relevance based on the length.
 */
WordCombination.prototype.getLengthBonus = function() {
	if ( has( WordCombination.lengthBonus, this._length ) ) {
		return WordCombination.lengthBonus[ this._length ];
	}

	return 0;
};

/**
 * Returns the list with words.
 *
 * @returns {array} The list with words.
 */
WordCombination.prototype.getWords = function() {
	return this._words;
};

/**
 * Returns the word combination length.
 *
 * @returns {number} The word combination length.
 */
WordCombination.prototype.getLength = function() {
	return this._length;
};

/**
 * Returns the combination as it occurs in the text.
 *
 * @returns {string} The combination.
 */
WordCombination.prototype.getCombination = function() {
	return this._words.join( " " );
};

/**
 * Returns the amount of occurrences of this word combination.
 *
 * @returns {number} The amount of occurrences.
 */
WordCombination.prototype.getOccurrences = function() {
	return this._occurrences;
};

/**
 * Increments the occurrences.
 *
 * @returns {void}
 */
WordCombination.prototype.incrementOccurrences = function() {
	this._occurrences += 1;
};

/**
 * Returns the relevance of the length.
 *
 * @param {number} relevantWordPercentage The relevance of the words within the combination.
 * @returns {number} The relevance based on the length and the word relevance.
 */
WordCombination.prototype.getMultiplier = function( relevantWordPercentage ) {
	var lengthBonus = this.getLengthBonus();

	// The relevance scales linearly from the relevance of one word to the maximum.
	return 1 + relevantWordPercentage * lengthBonus;
};

/**
 * Returns if the given word is a relevant word based on the given word relevance.
 *
 * @param {string} word The word to check if it is relevant.
 * @returns {boolean} Whether or not it is relevant.
 */
WordCombination.prototype.isRelevantWord = function( word ) {
	return has( this._relevantWords, word );
};

/**
 * Returns the relevance of the words within this combination.
 *
 * @returns {number} The percentage of relevant words inside this combination.
 */
WordCombination.prototype.getRelevantWordPercentage = function() {
	var relevantWordCount = 0, wordRelevance = 1;

	if ( this._length > 1 ) {
		forEach( this._words, function( word ) {
			if ( this.isRelevantWord( word ) ) {
				relevantWordCount += 1;
			}
		}.bind( this ) );

		wordRelevance = relevantWordCount / this._length;
	}

	return wordRelevance;
};

/**
 * Returns the relevance for this word combination.
 *
 * @returns {number} The relevance of this word combination.
 */
WordCombination.prototype.getRelevance = function() {
	if ( this._words.length === 1 && isFunctionWord( this._words[ 0 ] ) ) {
		return 0;
	}

	var wordRelevance = this.getRelevantWordPercentage();
	if ( wordRelevance === 0 ) {
		return 0;
	}

	return this.getMultiplier( wordRelevance ) * this._occurrences;
};

/**
 * Sets the relevance of single words
 *
 * @param {Object} relevantWords A mapping from a word to a relevance.
 * @returns {void}
 */
WordCombination.prototype.setRelevantWords = function( relevantWords ) {
	this._relevantWords = relevantWords;
};

/**
 * Returns the density of this combination within the text.
 *
 * @param {number} wordCount The word count of the text this combination was found in.
 * @returns {number} The density of this combination.
 */
WordCombination.prototype.getDensity = function( wordCount ) {
	return this._occurrences / wordCount;
};

module.exports = WordCombination;

},{"../researches/english/functionWords":187,"lodash/forEach":141,"lodash/has":143}]},{},[4])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvc3JjL2tleXdvcmRTdWdnZXN0aW9ucy9Qcm9taW5lbnRXb3JkQ2FjaGUuanMiLCJhc3NldHMvanMvc3JjL2tleXdvcmRTdWdnZXN0aW9ucy9Qcm9taW5lbnRXb3JkU3RvcmFnZS5qcyIsImFzc2V0cy9qcy9zcmMva2V5d29yZFN1Z2dlc3Rpb25zL3NpdGVXaWRlQ2FsY3VsYXRpb24uanMiLCJhc3NldHMvanMvc3JjL3NpdGUtd2lkZS1hbmFseXNpcy5qcyIsIm5vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fRGF0YVZpZXcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19IYXNoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fTGlzdENhY2hlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fTWFwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fTWFwQ2FjaGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19Qcm9taXNlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fU2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fU2V0Q2FjaGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19TdGFjay5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1N5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1VpbnQ4QXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19XZWFrTWFwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXBwbHkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUVhY2guanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUZpbHRlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5SW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUluY2x1ZGVzV2l0aC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5TGlrZUtleXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheU1hcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5UHVzaC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5U29tZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Fzc2lnblZhbHVlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNzb2NJbmRleE9mLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUFzc2lnblZhbHVlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUVhY2guanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRmlsdGVyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUZpbmRJbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGbGF0dGVuLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUZvci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGb3JPd24uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldFRhZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VIYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSGFzSW4uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSW5kZXhPZi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJbnRlcnNlY3Rpb24uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNBcmd1bWVudHMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNFcXVhbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc0VxdWFsRGVlcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc01hdGNoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzTmFOLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzTmF0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzVHlwZWRBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJdGVyYXRlZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VLZXlzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZU1hcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VNYXRjaGVzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZU1hdGNoZXNQcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VQaWNrLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVBpY2tCeS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VQcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VQcm9wZXJ0eURlZXAuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlUmVzdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VTZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlU2V0VG9TdHJpbmcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlU2xpY2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlU3VtLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVRpbWVzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVRvU3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVVuYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVZhbHVlcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NhY2hlSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY2FzdEFycmF5TGlrZU9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nhc3RGdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nhc3RQYXRoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY29yZUpzRGF0YS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZUJhc2VFYWNoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlQmFzZUZvci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZUZpbmQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19kZWZpbmVQcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2VxdWFsQXJyYXlzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZXF1YWxCeVRhZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2VxdWFsT2JqZWN0cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2ZsYXRSZXN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZnJlZUdsb2JhbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldE1hcERhdGEuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRNYXRjaERhdGEuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXROYXRpdmUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRSYXdUYWcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRUYWcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRWYWx1ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc1BhdGguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoQ2xlYXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoRGVsZXRlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaEdldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hIYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoU2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faXNGbGF0dGVuYWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzSW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc0tleS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzS2V5YWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzTWFza2VkLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faXNQcm90b3R5cGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc1N0cmljdENvbXBhcmFibGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVDbGVhci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2xpc3RDYWNoZURlbGV0ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2xpc3RDYWNoZUdldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2xpc3RDYWNoZUhhcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2xpc3RDYWNoZVNldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlQ2xlYXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZURlbGV0ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlR2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVIYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZVNldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcFRvQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXRjaGVzU3RyaWN0Q29tcGFyYWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX21lbW9pemVDYXBwZWQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19uYXRpdmVDcmVhdGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19uYXRpdmVLZXlzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbm9kZVV0aWwuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19vYmplY3RUb1N0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX292ZXJBcmcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19vdmVyUmVzdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3Jvb3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zZXRDYWNoZUFkZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3NldENhY2hlSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc2V0VG9BcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3NldFRvU3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc2hvcnRPdXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0NsZWFyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tEZWxldGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0dldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tTZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zdHJpY3RJbmRleE9mLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RyaW5nVG9QYXRoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fdG9LZXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL190b1NvdXJjZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvY29uc3RhbnQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2VxLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9maWx0ZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ZpbmQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ZpbmRJbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvZmxhdE1hcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvZmxhdHRlbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvZm9yRWFjaC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvZ2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9oYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2hhc0luLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pZGVudGl0eS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ludGVyc2VjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcmd1bWVudHMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXlMaWtlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5TGlrZU9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNCdWZmZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzRW1wdHkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzRnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzTGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc05hTi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNOdW1iZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdExpa2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzU3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc1N5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNUeXBlZEFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc1VuZGVmaW5lZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gva2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvbWFwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9tZW1vaXplLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9uZWdhdGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3BpY2suanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3Byb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9zdHViRmFsc2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3N1bS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvdGFrZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvdG9GaW5pdGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3RvSW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvdG9OdW1iZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3RvU3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC92YWx1ZXMuanMiLCJub2RlX21vZHVsZXMvdG9rZW5pemVyMi9jb3JlLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL2NvbmZpZy9zeWxsYWJsZXMuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvY29uZmlnL3N5bGxhYmxlcy9kZS5qc29uIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL2NvbmZpZy9zeWxsYWJsZXMvZW4uanNvbiIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9jb25maWcvc3lsbGFibGVzL25sLmpzb24iLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvaGVscGVycy9nZXRMYW5ndWFnZS5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9oZWxwZXJzL2h0bWwuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvaGVscGVycy9zeWxsYWJsZUNvdW50SXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvaGVscGVycy9zeWxsYWJsZUNvdW50U3RlcC5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9yZXNlYXJjaGVzL2VuZ2xpc2gvZnVuY3Rpb25Xb3Jkcy5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9yZXNlYXJjaGVzL2VuZ2xpc2gvcGFzc2l2ZXZvaWNlLWVuZ2xpc2gvYXV4aWxpYXJpZXMuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvcmVzZWFyY2hlcy9lbmdsaXNoL3RyYW5zaXRpb25Xb3Jkcy5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9zdHJpbmdQcm9jZXNzaW5nL2FkZFdvcmRib3VuZGFyeS5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9zdHJpbmdQcm9jZXNzaW5nL2NyZWF0ZVJlZ2V4RnJvbUFycmF5LmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3NpbmcvZ2V0U2VudGVuY2VzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3NpbmcvZ2V0V29yZHMuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy9xdW90ZXMuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy9yZWxldmFudFdvcmRzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3NpbmcvcmVtb3ZlUHVuY3R1YXRpb24uanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy9zdHJpcEhUTUxUYWdzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3Npbmcvc3RyaXBTcGFjZXMuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy9zeWxsYWJsZXMvRGV2aWF0aW9uRnJhZ21lbnQuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy9zeWxsYWJsZXMvY291bnQuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy91bmlmeVdoaXRlc3BhY2UuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvdmFsdWVzL1dvcmRDb21iaW5hdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7SUNDTSxrQjtBQUVMLCtCQUFjO0FBQUE7O0FBQ2IsT0FBSyxNQUFMLEdBQWMsRUFBZDtBQUNBOztBQUVEOzs7Ozs7Ozs7O3dCQU1PLEksRUFBTztBQUNiLE9BQUssS0FBSyxNQUFMLENBQVksY0FBWixDQUE0QixJQUE1QixDQUFMLEVBQTBDO0FBQ3pDLFdBQU8sS0FBSyxNQUFMLENBQWEsSUFBYixDQUFQO0FBQ0E7O0FBRUQsVUFBTyxDQUFQO0FBQ0E7O0FBRUQ7Ozs7Ozs7Ozs7d0JBT08sSSxFQUFNLEUsRUFBSztBQUNqQixRQUFLLE1BQUwsQ0FBYSxJQUFiLElBQXNCLEVBQXRCO0FBQ0E7Ozs7OztrQkFHYSxrQjs7Ozs7Ozs7Ozs7QUNqQ2Y7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUE7OztJQUdNLG9COzs7QUFDTDs7Ozs7QUFLQSxxQ0FBMEM7QUFBQSxNQUEzQixNQUEyQixRQUEzQixNQUEyQjtBQUFBLE1BQW5CLE9BQW1CLFFBQW5CLE9BQW1CO0FBQUEsTUFBVixLQUFVLFFBQVYsS0FBVTs7QUFBQTs7QUFBQTs7QUFHekMsUUFBSyxRQUFMLEdBQWdCLE9BQWhCO0FBQ0EsUUFBSyxNQUFMLEdBQWMsS0FBZDtBQUNBLFFBQUssTUFBTCxHQUFjLGtDQUFkO0FBQ0EsUUFBSyxPQUFMLEdBQWUsTUFBZjtBQUNBLFFBQUsscUJBQUwsR0FBNkIsS0FBN0I7O0FBRUEsUUFBSyx1QkFBTCxHQUErQixNQUFLLHVCQUFMLENBQTZCLElBQTdCLE9BQS9CO0FBVHlDO0FBVXpDOztBQUVEOzs7Ozs7Ozs7O3FDQU1vQixjLEVBQWlCO0FBQUE7O0FBQ3BDO0FBQ0EsT0FBSyxLQUFLLHFCQUFWLEVBQWtDO0FBQ2pDO0FBQ0E7QUFDRCxRQUFLLHFCQUFMLEdBQTZCLElBQTdCOztBQUVBLE9BQUksbUJBQW1CLGVBQWUsS0FBZixDQUFzQixDQUF0QixFQUF5QixFQUF6QixFQUE4QixHQUE5QixDQUFtQyxLQUFLLHVCQUF4QyxDQUF2Qjs7QUFFQSxVQUFPLFFBQVEsR0FBUixDQUFhLGdCQUFiLEVBQWdDLElBQWhDLENBQXNDLFVBQUUsY0FBRixFQUFzQjtBQUNsRSxXQUFPLElBQUksT0FBSixDQUFhLFVBQUUsT0FBRixFQUFXLE1BQVgsRUFBdUI7QUFDMUMsWUFBTyxJQUFQLENBQWE7QUFDWixZQUFNLE1BRE07QUFFWixXQUFLLE9BQUssUUFBTCxHQUFnQixjQUFoQixHQUFpQyxPQUFLLE9BRi9CO0FBR1osa0JBQVksb0JBQUUsR0FBRixFQUFXO0FBQ3RCLFdBQUksZ0JBQUosQ0FBc0IsWUFBdEIsRUFBb0MsT0FBSyxNQUF6QztBQUNBLE9BTFc7QUFNWixZQUFNO0FBQ0w7QUFDQSw0QkFBcUI7QUFGaEIsT0FOTTtBQVVaLGdCQUFVLE1BVkU7QUFXWixlQUFTLE9BWEc7QUFZWixhQUFPO0FBWkssTUFBYixFQWFJLE1BYkosQ0FhWSxZQUFNO0FBQ2pCLGFBQUssSUFBTCxDQUFXLHFCQUFYLEVBQWtDLGNBQWxDOztBQUVBLGFBQUsscUJBQUwsR0FBNkIsS0FBN0I7QUFDQSxNQWpCRDtBQWtCQSxLQW5CTSxDQUFQO0FBb0JBLElBckJNLENBQVA7QUFzQkE7O0FBRUQ7Ozs7Ozs7OzswQ0FNeUIsYSxFQUFnQjtBQUFBOztBQUN4QyxPQUFJLFdBQVcsS0FBSyxNQUFMLENBQVksS0FBWixDQUFtQixjQUFjLGNBQWQsRUFBbkIsQ0FBZjtBQUNBLE9BQUssTUFBTSxRQUFYLEVBQXNCO0FBQ3JCLFdBQU8sUUFBUSxPQUFSLENBQWlCLFFBQWpCLENBQVA7QUFDQTs7QUFFRCxPQUFJLHFCQUFxQixJQUFJLE9BQUosQ0FBYSxVQUFFLE9BQUYsRUFBVyxNQUFYLEVBQXVCO0FBQzVELFdBQU8sSUFBUCxDQUFhO0FBQ1osV0FBTSxLQURNO0FBRVosVUFBSyxPQUFLLFFBQUwsR0FBZ0IsMEJBRlQ7QUFHWixpQkFBWSxvQkFBRSxHQUFGLEVBQVc7QUFDdEIsVUFBSSxnQkFBSixDQUFzQixZQUF0QixFQUFvQyxPQUFLLE1BQXpDO0FBQ0EsTUFMVztBQU1aLFdBQU07QUFDTCxZQUFNLGNBQWMsY0FBZDtBQURELE1BTk07QUFTWixlQUFVLE1BVEU7QUFVWixjQUFTLGlCQUFVLFFBQVYsRUFBcUI7QUFDN0IsY0FBUyxRQUFUO0FBQ0EsTUFaVztBQWFaLFlBQU8sZUFBVSxRQUFWLEVBQXFCO0FBQzNCLGFBQVEsUUFBUjtBQUNBO0FBZlcsS0FBYjtBQWlCQSxJQWxCd0IsQ0FBekI7O0FBb0JBLE9BQUksdUJBQXVCLG1CQUFtQixJQUFuQixDQUF5QixVQUFFLGlCQUFGLEVBQXlCO0FBQzVFLFFBQUssc0JBQXNCLElBQTNCLEVBQWtDO0FBQ2pDLFlBQU8sT0FBSyx1QkFBTCxDQUE4QixhQUE5QixDQUFQO0FBQ0E7O0FBRUQsV0FBTyxpQkFBUDtBQUNBLElBTjBCLENBQTNCOztBQVFBLFVBQU8scUJBQXFCLElBQXJCLENBQTJCLFVBQUUsaUJBQUYsRUFBeUI7QUFDMUQsV0FBSyxNQUFMLENBQVksS0FBWixDQUFtQixjQUFjLGNBQWQsRUFBbkIsRUFBbUQsa0JBQWtCLEVBQXJFOztBQUVBLFdBQU8sa0JBQWtCLEVBQXpCO0FBQ0EsSUFKTSxDQUFQO0FBS0E7O0FBRUQ7Ozs7Ozs7OzswQ0FNeUIsYSxFQUFnQjtBQUFBOztBQUN4QyxVQUFPLElBQUksT0FBSixDQUFhLFVBQUUsT0FBRixFQUFXLE1BQVgsRUFBdUI7QUFDMUMsV0FBTyxJQUFQLENBQWE7QUFDWixXQUFNLE1BRE07QUFFWixVQUFLLE9BQUssUUFBTCxHQUFnQiwyQkFGVDtBQUdaLGlCQUFZLG9CQUFFLEdBQUYsRUFBVztBQUN0QixVQUFJLGdCQUFKLENBQXNCLFlBQXRCLEVBQW9DLE9BQUssTUFBekM7QUFDQSxNQUxXO0FBTVosV0FBTTtBQUNMLFlBQU0sY0FBYyxjQUFkO0FBREQsTUFOTTtBQVNaLGVBQVUsTUFURTtBQVVaLGNBQVMsaUJBQVUsUUFBVixFQUFxQjtBQUM3QixjQUFTLFFBQVQ7QUFDQSxNQVpXO0FBYVosWUFBTyxlQUFVLFFBQVYsRUFBcUI7QUFDM0IsYUFBUSxRQUFSO0FBQ0E7QUFmVyxLQUFiO0FBaUJBLElBbEJNLENBQVA7QUFtQkE7Ozs7OztrQkFHYSxvQjs7Ozs7Ozs7Ozs7QUMzSWY7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBSSxlQUFlLENBQUUsUUFBRixFQUFZLE9BQVosRUFBcUIsU0FBckIsRUFBZ0MsU0FBaEMsRUFBMkMsU0FBM0MsQ0FBbkI7O0FBRUE7Ozs7SUFHTSxtQjs7O0FBRUw7Ozs7Ozs7OztBQVNBLG9DQUEyRjtBQUFBLE1BQTVFLFVBQTRFLFFBQTVFLFVBQTRFO0FBQUEsTUFBaEUsT0FBZ0UsUUFBaEUsT0FBZ0U7QUFBQSxNQUF2RCxLQUF1RCxRQUF2RCxLQUF1RDtBQUFBLE1BQWhELG1CQUFnRCxRQUFoRCxtQkFBZ0Q7QUFBQSxpQ0FBM0IsY0FBMkI7QUFBQSxNQUEzQixjQUEyQix1Q0FBVixLQUFVOztBQUFBOztBQUFBOztBQUcxRixRQUFLLFFBQUwsR0FBZ0IsRUFBaEI7QUFDQSxRQUFLLFdBQUwsR0FBbUIsVUFBbkI7QUFDQSxRQUFLLFdBQUwsR0FBbUIsS0FBSyxJQUFMLENBQVcsYUFBYSxNQUFLLFFBQTdCLENBQW5CO0FBQ0EsUUFBSyxlQUFMLEdBQXVCLENBQXZCO0FBQ0EsUUFBSyxZQUFMLEdBQW9CLENBQXBCO0FBQ0EsUUFBSyxRQUFMLEdBQWdCLE9BQWhCO0FBQ0EsUUFBSyxNQUFMLEdBQWMsS0FBZDtBQUNBLFFBQUssZUFBTCxHQUF1QixjQUF2QjtBQUNBLFFBQUssb0JBQUwsR0FBNEIsbUJBQTVCOztBQUVBLFFBQUssa0JBQUwsR0FBMEIsTUFBSyxrQkFBTCxDQUF3QixJQUF4QixPQUExQjtBQUNBLFFBQUssZUFBTCxHQUF1QixNQUFLLGVBQUwsQ0FBcUIsSUFBckIsT0FBdkI7QUFDQSxRQUFLLHVCQUFMLEdBQStCLE1BQUssdUJBQUwsQ0FBNkIsSUFBN0IsT0FBL0I7QUFmMEY7QUFnQjFGOztBQUVEOzs7Ozs7Ozs7MEJBS1E7QUFDUCxRQUFLLFNBQUw7QUFDQTs7QUFFRDs7Ozs7Ozs7OEJBS1k7QUFBQTs7QUFDWCxPQUFJLE9BQU87QUFDVixVQUFNLEtBQUssWUFERDtBQUVWO0FBQ0EsY0FBVSxLQUFLLFFBSEw7QUFJVixZQUFRO0FBSkUsSUFBWDs7QUFPQSxPQUFLLENBQUUsS0FBSyxlQUFaLEVBQThCO0FBQzdCO0FBQ0EsU0FBSyxtQkFBTCxHQUEyQixLQUFLLG9CQUFoQztBQUNBOztBQUVELFVBQU8sSUFBUCxDQUFhO0FBQ1osVUFBTSxLQURNO0FBRVosU0FBSyxLQUFLLFFBQUwsR0FBZ0IsY0FGVDtBQUdaLGdCQUFZLG9CQUFFLEdBQUYsRUFBVztBQUN0QixTQUFJLGdCQUFKLENBQXNCLFlBQXRCLEVBQW9DLE9BQUssTUFBekM7QUFDQSxLQUxXO0FBTVosVUFBTSxJQU5NO0FBT1osY0FBVSxNQVBFO0FBUVosYUFBUyxLQUFLO0FBUkYsSUFBYjtBQVVBOztBQUVEOzs7Ozs7Ozs7a0NBTWlCLFEsRUFBVztBQUFBOztBQUMzQixPQUFJLGtCQUFrQixTQUFTLEdBQVQsQ0FBYyxVQUFFLElBQUYsRUFBWTtBQUMvQyxXQUFPLE9BQUssV0FBTCxDQUFrQixJQUFsQixDQUFQO0FBQ0EsSUFGcUIsQ0FBdEI7O0FBSUEsV0FBUSxHQUFSLENBQWEsZUFBYixFQUErQixJQUEvQixDQUFxQyxLQUFLLGtCQUExQyxFQUErRCxLQUEvRCxDQUFzRSxLQUFLLGtCQUEzRTtBQUNBOztBQUVEOzs7Ozs7Ozt1Q0FLcUI7QUFDcEIsUUFBSyxJQUFMLENBQVcsZUFBWCxFQUE0QixLQUFLLFlBQWpDLEVBQStDLEtBQUssV0FBcEQ7O0FBRUEsT0FBSyxLQUFLLFlBQUwsR0FBb0IsS0FBSyxXQUE5QixFQUE0QztBQUMzQyxTQUFLLFlBQUwsSUFBcUIsQ0FBckI7QUFDQSxTQUFLLFNBQUw7QUFDQSxJQUhELE1BR087QUFDTixTQUFLLElBQUwsQ0FBVyxVQUFYO0FBQ0E7QUFDRDs7QUFFRDs7Ozs7Ozs7OzhCQU1hLEksRUFBTztBQUNuQixPQUFJLFVBQVUsS0FBSyxPQUFMLENBQWEsUUFBM0I7O0FBRUEsT0FBSSxpQkFBaUIscUNBQWtCLE9BQWxCLENBQXJCOztBQUVBLE9BQUksdUJBQXVCLG1DQUEwQjtBQUNwRCxZQUFRLEtBQUssRUFEdUM7QUFFcEQsYUFBUyxLQUFLLFFBRnNDO0FBR3BELFdBQU8sS0FBSztBQUh3QyxJQUExQixDQUEzQjs7QUFNQSxVQUFPLHFCQUFxQixrQkFBckIsQ0FBeUMsY0FBekMsRUFBMEQsSUFBMUQsQ0FBZ0UsS0FBSyx1QkFBckUsRUFBOEYsS0FBSyx1QkFBbkcsQ0FBUDtBQUNBOztBQUVEOzs7Ozs7Ozs0Q0FLMEI7QUFDekIsUUFBSyxlQUFMLElBQXdCLENBQXhCOztBQUVBLFFBQUssSUFBTCxDQUFXLGVBQVgsRUFBNEIsS0FBSyxlQUFqQyxFQUFrRCxLQUFLLFdBQXZEO0FBQ0E7Ozs7OztrQkFHYSxtQjs7Ozs7QUN6SWY7Ozs7OztBQUVBLElBQUksV0FBVywwQkFBMEIsSUFBekMsQyxDQUpBOztBQU1BLElBQUksMkJBQTJCLElBQS9CO0FBQ0EsSUFBSSwwQkFBSjtBQUFBLElBQXVCLDJCQUF2Qjs7QUFFQTs7Ozs7OztBQU9BLFNBQVMsa0JBQVQsQ0FBNkIsU0FBN0IsRUFBZ0U7QUFBQSxLQUF4QixjQUF3Qix1RUFBUCxJQUFPOztBQUMvRDtBQUNBLEtBQUssNkJBQTZCLElBQWxDLEVBQXlDO0FBQ3hDO0FBQ0E7O0FBRUQsS0FBSSxrQkFBa0IsT0FBUSw0Q0FBUixDQUF0Qjs7QUFFQSxtQkFBa0IsSUFBbEI7O0FBRUEsNEJBQTJCLGtDQUE4QjtBQUN4RCxjQUFZLFNBRDRDO0FBRXhELGdDQUZ3RDtBQUd4RCxXQUFTLFNBQVMsT0FBVCxDQUFpQixJQUg4QjtBQUl4RCxTQUFPLFNBQVMsT0FBVCxDQUFpQixLQUpnQztBQUt4RCx1QkFBcUIsU0FBUztBQUwwQixFQUE5QixDQUEzQjs7QUFRQSwwQkFBeUIsRUFBekIsQ0FBNkIsZUFBN0IsRUFBOEMsVUFBRSxTQUFGLEVBQWlCO0FBQzlELGtCQUFnQixJQUFoQixDQUFzQixTQUF0QjtBQUNBLEVBRkQ7O0FBSUEsMEJBQXlCLEtBQXpCOztBQUVBO0FBQ0EsMEJBQXlCLEVBQXpCLENBQTZCLFVBQTdCLEVBQXlDLFlBQU07QUFDOUMsNkJBQTJCLElBQTNCOztBQUVBLG9CQUFrQixJQUFsQjtBQUNBLHFCQUFtQixJQUFuQjtBQUNBLEVBTEQ7QUFNQTs7QUFFRDs7Ozs7QUFLQSxTQUFTLElBQVQsR0FBZ0I7QUFDZixRQUFRLDBDQUFSLEVBQXFELEVBQXJELENBQXlELE9BQXpELEVBQWtFLFlBQVc7QUFDNUUscUJBQW9CLFNBQVMsTUFBVCxDQUFnQixLQUFwQzs7QUFFQSxTQUFRLElBQVIsRUFBZSxJQUFmO0FBQ0EsRUFKRDs7QUFNQSxxQkFBb0IsT0FBUSxvQ0FBUixDQUFwQjtBQUNBLG1CQUFrQixJQUFsQjs7QUFFQSxzQkFBcUIsT0FBUSxxQ0FBUixDQUFyQjtBQUNBLG9CQUFtQixJQUFuQjtBQUNBOztBQUVELE9BQVEsSUFBUjs7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN2NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuY2xhc3MgUHJvbWluZW50V29yZENhY2hlIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLl9jYWNoZSA9IHt9O1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIElEIGdpdmVuIHRoZSBuYW1lLCBvciAwIGlmIG5vdCBmb3VuZCBpbiB0aGUgY2FjaGUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBwcm9taW5lbnQgd29yZC5cblx0ICogQHJldHVybnMge251bWJlcn0gVGhlIElEIG9mIHRoZSBwcm9taW5lbnQgd29yZC5cblx0ICovXG5cdGdldElEKCBuYW1lICkge1xuXHRcdGlmICggdGhpcy5fY2FjaGUuaGFzT3duUHJvcGVydHkoIG5hbWUgKSApIHtcblx0XHRcdHJldHVybiB0aGlzLl9jYWNoZVsgbmFtZSBdO1xuXHRcdH1cblxuXHRcdHJldHVybiAwO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIElEIGZvciBhIGdpdmVuIG5hbWUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBwcm9taW5lbnQgd29yZC5cblx0ICogQHBhcmFtIHtudW1iZXJ9IGlkIFRoZSBJRCBvZiB0aGUgcHJvbWluZW50IHdvcmQuXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0c2V0SUQoIG5hbWUsIGlkICkge1xuXHRcdHRoaXMuX2NhY2hlWyBuYW1lIF0gPSBpZDtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBQcm9taW5lbnRXb3JkQ2FjaGU7XG4iLCJpbXBvcnQgUHJvbWluZW50V29yZENhY2hlIGZyb20gXCIuL1Byb21pbmVudFdvcmRDYWNoZVwiO1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tIFwiZXZlbnRzXCI7XG5cbi8qKlxuICogSGFuZGxlcyB0aGUgcmV0cmlldmFsIGFuZCBzdG9yYWdlIG9mIGZvY3VzIGtleXdvcmQgc3VnZ2VzdGlvbnNcbiAqL1xuY2xhc3MgUHJvbWluZW50V29yZFN0b3JhZ2UgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXHQvKipcblx0ICogQHBhcmFtIHtzdHJpbmd9IHJvb3RVcmwgVGhlIHJvb3QgVVJMIG9mIHRoZSBXUCBSRVNUIEFQSS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG5vbmNlIFRoZSBXb3JkUHJlc3Mgbm9uY2UgcmVxdWlyZWQgdG8gc2F2ZSBhbnl0aGluZyB0byB0aGUgUkVTVCBBUEkgZW5kcG9pbnRzLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gcG9zdElEIFRoZSBwb3N0SUQgb2YgdGhlIHBvc3QgdG8gc2F2ZSBwcm9taW5lbnQgd29yZHMgZm9yLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoIHsgcG9zdElELCByb290VXJsLCBub25jZSB9ICkge1xuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLl9yb290VXJsID0gcm9vdFVybDtcblx0XHR0aGlzLl9ub25jZSA9IG5vbmNlO1xuXHRcdHRoaXMuX2NhY2hlID0gbmV3IFByb21pbmVudFdvcmRDYWNoZSgpO1xuXHRcdHRoaXMuX3Bvc3RJRCA9IHBvc3RJRDtcblx0XHR0aGlzLl9zYXZpbmdQcm9taW5lbnRXb3JkcyA9IGZhbHNlO1xuXG5cdFx0dGhpcy5yZXRyaWV2ZVByb21pbmVudFdvcmRJZCA9IHRoaXMucmV0cmlldmVQcm9taW5lbnRXb3JkSWQuYmluZCggdGhpcyApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNhdmVzIHByb21pbmVudCB3b3JkcyB0byB0aGUgZGF0YWJhc2UgdXNpbmcgQUpBWFxuXHQgKlxuXHQgKiBAcGFyYW0ge1dvcmRDb21iaW5hdGlvbltdfSBwcm9taW5lbnRXb3JkcyBUaGUgcHJvbWluZW50IHdvcmRzIHRvIHNhdmUuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBSZXNvbHZlcyB3aGVuIHRoZSBwcm9taW5lbnQgd29yZHMgYXJlIHNhdmVkLlxuXHQgKi9cblx0c2F2ZVByb21pbmVudFdvcmRzKCBwcm9taW5lbnRXb3JkcyApIHtcblx0XHQvLyBJZiB0aGVyZSBpcyBhbHJlYWR5IGEgc2F2ZSBzZXF1ZW5jZSBpbiBwcm9ncmVzcywgZG9uJ3QgZG8gaXQgYWdhaW4uXG5cdFx0aWYgKCB0aGlzLl9zYXZpbmdQcm9taW5lbnRXb3JkcyApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0dGhpcy5fc2F2aW5nUHJvbWluZW50V29yZHMgPSB0cnVlO1xuXG5cdFx0bGV0IHByb21pbmVudFdvcmRJZHMgPSBwcm9taW5lbnRXb3Jkcy5zbGljZSggMCwgMjAgKS5tYXAoIHRoaXMucmV0cmlldmVQcm9taW5lbnRXb3JkSWQgKTtcblxuXHRcdHJldHVybiBQcm9taXNlLmFsbCggcHJvbWluZW50V29yZElkcyApLnRoZW4oICggcHJvbWluZW50V29yZHMgKSA9PiB7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuXHRcdFx0XHRqUXVlcnkuYWpheCgge1xuXHRcdFx0XHRcdHR5cGU6IFwiUE9TVFwiLFxuXHRcdFx0XHRcdHVybDogdGhpcy5fcm9vdFVybCArIFwid3AvdjIvcG9zdHMvXCIgKyB0aGlzLl9wb3N0SUQsXG5cdFx0XHRcdFx0YmVmb3JlU2VuZDogKCB4aHIgKSA9PiB7XG5cdFx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggXCJYLVdQLU5vbmNlXCIsIHRoaXMuX25vbmNlICk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlXG5cdFx0XHRcdFx0XHR5c3RfcHJvbWluZW50X3dvcmRzOiBwcm9taW5lbnRXb3Jkcyxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGRhdGFUeXBlOiBcImpzb25cIixcblx0XHRcdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxuXHRcdFx0XHRcdGVycm9yOiByZWplY3QsXG5cdFx0XHRcdH0gKS5hbHdheXMoICgpID0+IHtcblx0XHRcdFx0XHR0aGlzLmVtaXQoIFwic2F2ZWRQcm9taW5lbnRXb3Jkc1wiLCBwcm9taW5lbnRXb3JkcyApO1xuXG5cdFx0XHRcdFx0dGhpcy5fc2F2aW5nUHJvbWluZW50V29yZHMgPSBmYWxzZTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIElEIG9mIGEgcHJvbWlzZVxuXHQgKlxuXHQgKiBAcGFyYW0ge1dvcmRDb21iaW5hdGlvbn0gcHJvbWluZW50V29yZCBUaGUgcHJvbWluZW50IHdvcmQgdG8gcmV0cmlldmUgdGhlIElEIGZvci5cblx0ICogQHJldHVybnMge1Byb21pc2V9IFJlc29sdmVzIHRvIHRoZSBJRCBvZiB0aGUgcHJvbWluZW50IHdvcmQgdGVybS5cblx0ICovXG5cdHJldHJpZXZlUHJvbWluZW50V29yZElkKCBwcm9taW5lbnRXb3JkICkge1xuXHRcdGxldCBjYWNoZWRJZCA9IHRoaXMuX2NhY2hlLmdldElEKCBwcm9taW5lbnRXb3JkLmdldENvbWJpbmF0aW9uKCkgKTtcblx0XHRpZiAoIDAgIT09IGNhY2hlZElkICkge1xuXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSggY2FjaGVkSWQgKTtcblx0XHR9XG5cblx0XHRsZXQgZm91bmRQcm9taW5lbnRXb3JkID0gbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuXHRcdFx0alF1ZXJ5LmFqYXgoIHtcblx0XHRcdFx0dHlwZTogXCJHRVRcIixcblx0XHRcdFx0dXJsOiB0aGlzLl9yb290VXJsICsgXCJ5b2FzdC92MS9wcm9taW5lbnRfd29yZHNcIixcblx0XHRcdFx0YmVmb3JlU2VuZDogKCB4aHIgKSA9PiB7XG5cdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoIFwiWC1XUC1Ob25jZVwiLCB0aGlzLl9ub25jZSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0d29yZDogcHJvbWluZW50V29yZC5nZXRDb21iaW5hdGlvbigpLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRkYXRhVHlwZTogXCJqc29uXCIsXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdFx0XHRyZXNvbHZlKCByZXNwb25zZSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRlcnJvcjogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0XHRcdHJlamVjdCggcmVzcG9uc2UgKTtcblx0XHRcdFx0fSxcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHRsZXQgY3JlYXRlZFByb21pbmVudFdvcmQgPSBmb3VuZFByb21pbmVudFdvcmQudGhlbiggKCBwcm9taW5lbnRXb3JkVGVybSApID0+IHtcblx0XHRcdGlmICggcHJvbWluZW50V29yZFRlcm0gPT09IG51bGwgKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmNyZWF0ZVByb21pbmVudFdvcmRUZXJtKCBwcm9taW5lbnRXb3JkICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBwcm9taW5lbnRXb3JkVGVybTtcblx0XHR9ICk7XG5cblx0XHRyZXR1cm4gY3JlYXRlZFByb21pbmVudFdvcmQudGhlbiggKCBwcm9taW5lbnRXb3JkVGVybSApID0+IHtcblx0XHRcdHRoaXMuX2NhY2hlLnNldElEKCBwcm9taW5lbnRXb3JkLmdldENvbWJpbmF0aW9uKCksIHByb21pbmVudFdvcmRUZXJtLmlkICk7XG5cblx0XHRcdHJldHVybiBwcm9taW5lbnRXb3JkVGVybS5pZDtcblx0XHR9ICk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIHRlcm0gZm9yIGEgcHJvbWluZW50IHdvcmRcblx0ICpcblx0ICogQHBhcmFtIHtXb3JkQ29tYmluYXRpb259IHByb21pbmVudFdvcmQgVGhlIHByb21pbmVudCB3b3JkIHRvIGNyZWF0ZSBhIHRlcm0gZm9yLlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiBhIHRlcm0gaGFzIGJlZW4gY3JlYXRlZCBhbmQgcmVzb2x2ZXMgd2l0aCB0aGUgSUQgb2YgdGhlIG5ld2x5IGNyZWF0ZWQgdGVybS5cblx0ICovXG5cdGNyZWF0ZVByb21pbmVudFdvcmRUZXJtKCBwcm9taW5lbnRXb3JkICkge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG5cdFx0XHRqUXVlcnkuYWpheCgge1xuXHRcdFx0XHR0eXBlOiBcIlBPU1RcIixcblx0XHRcdFx0dXJsOiB0aGlzLl9yb290VXJsICsgXCJ3cC92Mi95c3RfcHJvbWluZW50X3dvcmRzXCIsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6ICggeGhyICkgPT4ge1xuXHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCBcIlgtV1AtTm9uY2VcIiwgdGhpcy5fbm9uY2UgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdG5hbWU6IHByb21pbmVudFdvcmQuZ2V0Q29tYmluYXRpb24oKSxcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YVR5cGU6IFwianNvblwiLFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHRcdFx0cmVzb2x2ZSggcmVzcG9uc2UgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdFx0XHRyZWplY3QoIHJlc3BvbnNlICk7XG5cdFx0XHRcdH0sXG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFByb21pbmVudFdvcmRTdG9yYWdlO1xuIiwiaW1wb3J0IHsgZ2V0UmVsZXZhbnRXb3JkcyB9IGZyb20gXCJ5b2FzdHNlby9qcy9zdHJpbmdQcm9jZXNzaW5nL3JlbGV2YW50V29yZHNcIjtcbmltcG9ydCBQcm9taW5lbnRXb3JkU3RvcmFnZSBmcm9tIFwiLi9Qcm9taW5lbnRXb3JkU3RvcmFnZVwiO1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tIFwiZXZlbnRzXCI7XG5cbmxldCBwb3N0U3RhdHVzZXMgPSBbIFwiZnV0dXJlXCIsIFwiZHJhZnRcIiwgXCJwZW5kaW5nXCIsIFwicHJpdmF0ZVwiLCBcInB1Ymxpc2hcIiBdO1xuXG4vKipcbiAqIENhbGN1bGF0ZXMgcHJvbWluZW50IHdvcmRzIGZvciBhbGwgcG9zdHMgb24gdGhlIHNpdGUuXG4gKi9cbmNsYXNzIFNpdGVXaWRlQ2FsY3VsYXRpb24gZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuXG5cdC8qKlxuXHQgKiBDb25zdHJ1Y3RzIGEgY2FsY3VsYXRpb24gb2JqZWN0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge2Jvb2xlYW59IHJlY2FsY3VsYXRlQWxsIFdoZXRoZXIgdG8gY2FsY3VsYXRlIGFsbCBwb3N0cyBvciBvbmx5IHBvc3RzIHdpdGhvdXQgcHJvbWluZW50IHdvcmRzLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gdG90YWxQb3N0cyBUaGUgYW1vdW50IG9mIHBvc3RzIHRvIGNhbGN1bGF0ZSBwcm9taW5lbnQgd29yZHMgZm9yLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gcm9vdFVybCBUaGUgcm9vdCBSRVNUIEFQSSBVUkwuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBub25jZSBUaGUgbm9uY2UgdG8gdXNlIHdoZW4gdXNpbmcgdGhlIFJFU1QgQVBJLlxuXHQgKiBAcGFyYW0ge251bWJlcltdfSBhbGxQcm9taW5lbnRXb3JkSWRzIEEgbGlzdCBvZiBhbGwgcHJvbWluZW50IHdvcmQgSURzIHByZXNlbnQgb24gdGhlIHNpdGUuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvciggeyB0b3RhbFBvc3RzLCByb290VXJsLCBub25jZSwgYWxsUHJvbWluZW50V29yZElkcywgcmVjYWxjdWxhdGVBbGwgPSBmYWxzZSB9ICkge1xuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLl9wZXJQYWdlID0gMTA7XG5cdFx0dGhpcy5fdG90YWxQb3N0cyA9IHRvdGFsUG9zdHM7XG5cdFx0dGhpcy5fdG90YWxQYWdlcyA9IE1hdGguY2VpbCggdG90YWxQb3N0cyAvIHRoaXMuX3BlclBhZ2UgKTtcblx0XHR0aGlzLl9wcm9jZXNzZWRQb3N0cyA9IDA7XG5cdFx0dGhpcy5fY3VycmVudFBhZ2UgPSAxO1xuXHRcdHRoaXMuX3Jvb3RVcmwgPSByb290VXJsO1xuXHRcdHRoaXMuX25vbmNlID0gbm9uY2U7XG5cdFx0dGhpcy5fcmVjYWxjdWxhdGVBbGwgPSByZWNhbGN1bGF0ZUFsbDtcblx0XHR0aGlzLl9hbGxQcm9taW5lbnRXb3JkSWRzID0gYWxsUHJvbWluZW50V29yZElkcztcblxuXHRcdHRoaXMuY29udGludWVQcm9jZXNzaW5nID0gdGhpcy5jb250aW51ZVByb2Nlc3NpbmcuYmluZCggdGhpcyApO1xuXHRcdHRoaXMucHJvY2Vzc1Jlc3BvbnNlID0gdGhpcy5wcm9jZXNzUmVzcG9uc2UuYmluZCggdGhpcyApO1xuXHRcdHRoaXMuaW5jcmVtZW50UHJvY2Vzc2VkUG9zdHMgPSB0aGlzLmluY3JlbWVudFByb2Nlc3NlZFBvc3RzLmJpbmQoIHRoaXMgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTdGFydHMgY2FsY3VsYXRpbmcgcHJvbWluZW50IHdvcmRzLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdHN0YXJ0KCkge1xuXHRcdHRoaXMuY2FsY3VsYXRlKCk7XG5cdH1cblxuXHQvKipcblx0ICogRG9lcyBhIGNhbGN1bGF0aW9uIHN0ZXAgZm9yIHRoZSBjdXJyZW50IHBhZ2UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0Y2FsY3VsYXRlKCkge1xuXHRcdGxldCBkYXRhID0ge1xuXHRcdFx0cGFnZTogdGhpcy5fY3VycmVudFBhZ2UsXG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlXG5cdFx0XHRwZXJfcGFnZTogdGhpcy5fcGVyUGFnZSxcblx0XHRcdHN0YXR1czogcG9zdFN0YXR1c2VzLFxuXHRcdH07XG5cblx0XHRpZiAoICEgdGhpcy5fcmVjYWxjdWxhdGVBbGwgKSB7XG5cdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlXG5cdFx0XHRkYXRhLnlzdF9wcm9taW5lbnRfd29yZHMgPSB0aGlzLl9hbGxQcm9taW5lbnRXb3JkSWRzO1xuXHRcdH1cblxuXHRcdGpRdWVyeS5hamF4KCB7XG5cdFx0XHR0eXBlOiBcIkdFVFwiLFxuXHRcdFx0dXJsOiB0aGlzLl9yb290VXJsICsgXCJ3cC92Mi9wb3N0cy9cIixcblx0XHRcdGJlZm9yZVNlbmQ6ICggeGhyICkgPT4ge1xuXHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggXCJYLVdQLU5vbmNlXCIsIHRoaXMuX25vbmNlICk7XG5cdFx0XHR9LFxuXHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdGRhdGFUeXBlOiBcImpzb25cIixcblx0XHRcdHN1Y2Nlc3M6IHRoaXMucHJvY2Vzc1Jlc3BvbnNlLFxuXHRcdH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQcm9jZXNzIHJlc3BvbnNlIGZyb20gdGhlIGluZGV4IHJlcXVlc3QgZm9yIHBvc3RzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0FycmF5fSByZXNwb25zZSBUaGUgbGlzdCBvZiBmb3VuZCBwb3N0cyBmcm9tIHRoZSBzZXJ2ZXIuXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0cHJvY2Vzc1Jlc3BvbnNlKCByZXNwb25zZSApIHtcblx0XHRsZXQgcHJvY2Vzc1Byb21pc2VzID0gcmVzcG9uc2UubWFwKCAoIHBvc3QgKSA9PiB7XG5cdFx0XHRyZXR1cm4gdGhpcy5wcm9jZXNzUG9zdCggcG9zdCApO1xuXHRcdH0gKTtcblxuXHRcdFByb21pc2UuYWxsKCBwcm9jZXNzUHJvbWlzZXMgKS50aGVuKCB0aGlzLmNvbnRpbnVlUHJvY2Vzc2luZyApLmNhdGNoKCB0aGlzLmNvbnRpbnVlUHJvY2Vzc2luZyApO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnRpbnVlcyBwcm9jZXNzaW5nIGJ5IGdvaW5nIHRvIHRoZSBuZXh0IHBhZ2UgaWYgdGhlcmUgaXMgb25lLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGNvbnRpbnVlUHJvY2Vzc2luZygpIHtcblx0XHR0aGlzLmVtaXQoIFwicHJvY2Vzc2VkUGFnZVwiLCB0aGlzLl9jdXJyZW50UGFnZSwgdGhpcy5fdG90YWxQYWdlcyApO1xuXG5cdFx0aWYgKCB0aGlzLl9jdXJyZW50UGFnZSA8IHRoaXMuX3RvdGFsUGFnZXMgKSB7XG5cdFx0XHR0aGlzLl9jdXJyZW50UGFnZSArPSAxO1xuXHRcdFx0dGhpcy5jYWxjdWxhdGUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5lbWl0KCBcImNvbXBsZXRlXCIgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogUHJvY2Vzc2VzIGEgcG9zdCByZXR1cm5lZCBmcm9tIHRoZSBSRVNUIEFQSS5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHBvc3QgQSBwb3N0IG9iamVjdCB3aXRoIHJlbmRlcmVkIGNvbnRlbnQuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBSZXNvbHZlcyB3aGVuIHRoZSBwcm9taW5lbnQgd29yZHMgYXJlIHNhdmVkIGZvciB0aGUgcG9zdC5cblx0ICovXG5cdHByb2Nlc3NQb3N0KCBwb3N0ICkge1xuXHRcdGxldCBjb250ZW50ID0gcG9zdC5jb250ZW50LnJlbmRlcmVkO1xuXG5cdFx0bGV0IHByb21pbmVudFdvcmRzID0gZ2V0UmVsZXZhbnRXb3JkcyggY29udGVudCApO1xuXG5cdFx0bGV0IHByb21pbmVudFdvcmRTdG9yYWdlID0gbmV3IFByb21pbmVudFdvcmRTdG9yYWdlKCB7XG5cdFx0XHRwb3N0SUQ6IHBvc3QuaWQsXG5cdFx0XHRyb290VXJsOiB0aGlzLl9yb290VXJsLFxuXHRcdFx0bm9uY2U6IHRoaXMuX25vbmNlLFxuXHRcdH0gKTtcblxuXHRcdHJldHVybiBwcm9taW5lbnRXb3JkU3RvcmFnZS5zYXZlUHJvbWluZW50V29yZHMoIHByb21pbmVudFdvcmRzICkudGhlbiggdGhpcy5pbmNyZW1lbnRQcm9jZXNzZWRQb3N0cywgdGhpcy5pbmNyZW1lbnRQcm9jZXNzZWRQb3N0cyApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluY3JlbWVudHMgdGhlIGFtb3VudCBvZiBwcm9jZXNzZWQgcG9zdHMgYnkgb25lLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGluY3JlbWVudFByb2Nlc3NlZFBvc3RzKCkge1xuXHRcdHRoaXMuX3Byb2Nlc3NlZFBvc3RzICs9IDE7XG5cblx0XHR0aGlzLmVtaXQoIFwicHJvY2Vzc2VkUG9zdFwiLCB0aGlzLl9wcm9jZXNzZWRQb3N0cywgdGhpcy5fdG90YWxQb3N0cyApO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNpdGVXaWRlQ2FsY3VsYXRpb247XG4iLCIvKiBnbG9iYWwgeW9hc3RTaXRlV2lkZUFuYWx5c2lzRGF0YSAqL1xuXG5pbXBvcnQgUHJvbWluZW50V29yZENhbGN1bGF0aW9uIGZyb20gXCIuL2tleXdvcmRTdWdnZXN0aW9ucy9zaXRlV2lkZUNhbGN1bGF0aW9uXCI7XG5cbmxldCBzZXR0aW5ncyA9IHlvYXN0U2l0ZVdpZGVBbmFseXNpc0RhdGEuZGF0YTtcblxubGV0IHByb21pbmVudFdvcmRDYWxjdWxhdGlvbiA9IG51bGw7XG5sZXQgcHJvZ3Jlc3NDb250YWluZXIsIGNvbXBsZXRlZENvbnRhaW5lcjtcblxuLyoqXG4gKiBTdGFydCByZWNhbGN1bGF0aW5nLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBwb3N0Q291bnQgVGhlIG51bWJlciBvZiBwb3N0cyB0byByZWNhbGN1bGF0ZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVjYWxjdWxhdGVBbGwgV2hldGhlciB0byByZWNhbGN1bGF0ZSBhbGwgcG9zdHMuXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gc3RhcnRSZWNhbGN1bGF0aW5nKCBwb3N0Q291bnQsIHJlY2FsY3VsYXRlQWxsID0gdHJ1ZSApIHtcblx0Ly8gUHJldmVudCBkdXBsaWNhdGUgY2FsY3VsYXRpb24uXG5cdGlmICggcHJvbWluZW50V29yZENhbGN1bGF0aW9uICE9PSBudWxsICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGxldCBwcm9ncmVzc0VsZW1lbnQgPSBqUXVlcnkoIFwiLnlvYXN0LWpzLXByb21pbmVudC13b3Jkcy1wcm9ncmVzcy1jdXJyZW50XCIgKTtcblxuXHRwcm9ncmVzc0NvbnRhaW5lci5zaG93KCk7XG5cblx0cHJvbWluZW50V29yZENhbGN1bGF0aW9uID0gbmV3IFByb21pbmVudFdvcmRDYWxjdWxhdGlvbigge1xuXHRcdHRvdGFsUG9zdHM6IHBvc3RDb3VudCxcblx0XHRyZWNhbGN1bGF0ZUFsbCxcblx0XHRyb290VXJsOiBzZXR0aW5ncy5yZXN0QXBpLnJvb3QsXG5cdFx0bm9uY2U6IHNldHRpbmdzLnJlc3RBcGkubm9uY2UsXG5cdFx0YWxsUHJvbWluZW50V29yZElkczogc2V0dGluZ3MuYWxsV29yZHMsXG5cdH0gKTtcblxuXHRwcm9taW5lbnRXb3JkQ2FsY3VsYXRpb24ub24oIFwicHJvY2Vzc2VkUG9zdFwiLCAoIHBvc3RDb3VudCApID0+IHtcblx0XHRwcm9ncmVzc0VsZW1lbnQuaHRtbCggcG9zdENvdW50ICk7XG5cdH0gKTtcblxuXHRwcm9taW5lbnRXb3JkQ2FsY3VsYXRpb24uc3RhcnQoKTtcblxuXHQvLyBGcmVlIHVwIHRoZSB2YXJpYWJsZSB0byBzdGFydCBhbm90aGVyIHJlY2FsY3VsYXRpb24uXG5cdHByb21pbmVudFdvcmRDYWxjdWxhdGlvbi5vbiggXCJjb21wbGV0ZVwiLCAoKSA9PiB7XG5cdFx0cHJvbWluZW50V29yZENhbGN1bGF0aW9uID0gbnVsbDtcblxuXHRcdHByb2dyZXNzQ29udGFpbmVyLmhpZGUoKTtcblx0XHRjb21wbGV0ZWRDb250YWluZXIuc2hvdygpO1xuXHR9ICk7XG59XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgdGhlIHNpdGUgd2lkZSBhbmFseXNpcyB0YWIuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIGluaXQoKSB7XG5cdGpRdWVyeSggXCIueW9hc3QtanMtY2FsY3VsYXRlLXByb21pbmVudC13b3Jkcy0tYWxsXCIgKS5vbiggXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcblx0XHRzdGFydFJlY2FsY3VsYXRpbmcoIHNldHRpbmdzLmFtb3VudC50b3RhbCApO1xuXG5cdFx0alF1ZXJ5KCB0aGlzICkuaGlkZSgpO1xuXHR9ICk7XG5cblx0cHJvZ3Jlc3NDb250YWluZXIgPSBqUXVlcnkoIFwiLnlvYXN0LWpzLXByb21pbmVudC13b3Jkcy1wcm9ncmVzc1wiICk7XG5cdHByb2dyZXNzQ29udGFpbmVyLmhpZGUoKTtcblxuXHRjb21wbGV0ZWRDb250YWluZXIgPSBqUXVlcnkoIFwiLnlvYXN0LWpzLXByb21pbmVudC13b3Jkcy1jb21wbGV0ZWRcIiApO1xuXHRjb21wbGV0ZWRDb250YWluZXIuaGlkZSgpO1xufVxuXG5qUXVlcnkoIGluaXQgKTtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG5cbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICB2YXIgbTtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2Uge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIWVtaXR0ZXIuX2V2ZW50cyB8fCAhZW1pdHRlci5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IDA7XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24oZW1pdHRlci5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgRGF0YVZpZXcgPSBnZXROYXRpdmUocm9vdCwgJ0RhdGFWaWV3Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0YVZpZXc7XG4iLCJ2YXIgaGFzaENsZWFyID0gcmVxdWlyZSgnLi9faGFzaENsZWFyJyksXG4gICAgaGFzaERlbGV0ZSA9IHJlcXVpcmUoJy4vX2hhc2hEZWxldGUnKSxcbiAgICBoYXNoR2V0ID0gcmVxdWlyZSgnLi9faGFzaEdldCcpLFxuICAgIGhhc2hIYXMgPSByZXF1aXJlKCcuL19oYXNoSGFzJyksXG4gICAgaGFzaFNldCA9IHJlcXVpcmUoJy4vX2hhc2hTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgaGFzaCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIEhhc2goZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgSGFzaGAuXG5IYXNoLnByb3RvdHlwZS5jbGVhciA9IGhhc2hDbGVhcjtcbkhhc2gucHJvdG90eXBlWydkZWxldGUnXSA9IGhhc2hEZWxldGU7XG5IYXNoLnByb3RvdHlwZS5nZXQgPSBoYXNoR2V0O1xuSGFzaC5wcm90b3R5cGUuaGFzID0gaGFzaEhhcztcbkhhc2gucHJvdG90eXBlLnNldCA9IGhhc2hTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gSGFzaDtcbiIsInZhciBsaXN0Q2FjaGVDbGVhciA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZUNsZWFyJyksXG4gICAgbGlzdENhY2hlRGVsZXRlID0gcmVxdWlyZSgnLi9fbGlzdENhY2hlRGVsZXRlJyksXG4gICAgbGlzdENhY2hlR2V0ID0gcmVxdWlyZSgnLi9fbGlzdENhY2hlR2V0JyksXG4gICAgbGlzdENhY2hlSGFzID0gcmVxdWlyZSgnLi9fbGlzdENhY2hlSGFzJyksXG4gICAgbGlzdENhY2hlU2V0ID0gcmVxdWlyZSgnLi9fbGlzdENhY2hlU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBsaXN0IGNhY2hlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTGlzdENhY2hlKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYExpc3RDYWNoZWAuXG5MaXN0Q2FjaGUucHJvdG90eXBlLmNsZWFyID0gbGlzdENhY2hlQ2xlYXI7XG5MaXN0Q2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IGxpc3RDYWNoZURlbGV0ZTtcbkxpc3RDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbGlzdENhY2hlR2V0O1xuTGlzdENhY2hlLnByb3RvdHlwZS5oYXMgPSBsaXN0Q2FjaGVIYXM7XG5MaXN0Q2FjaGUucHJvdG90eXBlLnNldCA9IGxpc3RDYWNoZVNldDtcblxubW9kdWxlLmV4cG9ydHMgPSBMaXN0Q2FjaGU7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIE1hcCA9IGdldE5hdGl2ZShyb290LCAnTWFwJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gTWFwO1xuIiwidmFyIG1hcENhY2hlQ2xlYXIgPSByZXF1aXJlKCcuL19tYXBDYWNoZUNsZWFyJyksXG4gICAgbWFwQ2FjaGVEZWxldGUgPSByZXF1aXJlKCcuL19tYXBDYWNoZURlbGV0ZScpLFxuICAgIG1hcENhY2hlR2V0ID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVHZXQnKSxcbiAgICBtYXBDYWNoZUhhcyA9IHJlcXVpcmUoJy4vX21hcENhY2hlSGFzJyksXG4gICAgbWFwQ2FjaGVTZXQgPSByZXF1aXJlKCcuL19tYXBDYWNoZVNldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXAgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTWFwQ2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTWFwQ2FjaGVgLlxuTWFwQ2FjaGUucHJvdG90eXBlLmNsZWFyID0gbWFwQ2FjaGVDbGVhcjtcbk1hcENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBtYXBDYWNoZURlbGV0ZTtcbk1hcENhY2hlLnByb3RvdHlwZS5nZXQgPSBtYXBDYWNoZUdldDtcbk1hcENhY2hlLnByb3RvdHlwZS5oYXMgPSBtYXBDYWNoZUhhcztcbk1hcENhY2hlLnByb3RvdHlwZS5zZXQgPSBtYXBDYWNoZVNldDtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXBDYWNoZTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgUHJvbWlzZSA9IGdldE5hdGl2ZShyb290LCAnUHJvbWlzZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb21pc2U7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFNldCA9IGdldE5hdGl2ZShyb290LCAnU2V0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0O1xuIiwidmFyIE1hcENhY2hlID0gcmVxdWlyZSgnLi9fTWFwQ2FjaGUnKSxcbiAgICBzZXRDYWNoZUFkZCA9IHJlcXVpcmUoJy4vX3NldENhY2hlQWRkJyksXG4gICAgc2V0Q2FjaGVIYXMgPSByZXF1aXJlKCcuL19zZXRDYWNoZUhhcycpO1xuXG4vKipcbiAqXG4gKiBDcmVhdGVzIGFuIGFycmF5IGNhY2hlIG9iamVjdCB0byBzdG9yZSB1bmlxdWUgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFt2YWx1ZXNdIFRoZSB2YWx1ZXMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIFNldENhY2hlKHZhbHVlcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcyA9PSBudWxsID8gMCA6IHZhbHVlcy5sZW5ndGg7XG5cbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBNYXBDYWNoZTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB0aGlzLmFkZCh2YWx1ZXNbaW5kZXhdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgU2V0Q2FjaGVgLlxuU2V0Q2FjaGUucHJvdG90eXBlLmFkZCA9IFNldENhY2hlLnByb3RvdHlwZS5wdXNoID0gc2V0Q2FjaGVBZGQ7XG5TZXRDYWNoZS5wcm90b3R5cGUuaGFzID0gc2V0Q2FjaGVIYXM7XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0Q2FjaGU7XG4iLCJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyksXG4gICAgc3RhY2tDbGVhciA9IHJlcXVpcmUoJy4vX3N0YWNrQ2xlYXInKSxcbiAgICBzdGFja0RlbGV0ZSA9IHJlcXVpcmUoJy4vX3N0YWNrRGVsZXRlJyksXG4gICAgc3RhY2tHZXQgPSByZXF1aXJlKCcuL19zdGFja0dldCcpLFxuICAgIHN0YWNrSGFzID0gcmVxdWlyZSgnLi9fc3RhY2tIYXMnKSxcbiAgICBzdGFja1NldCA9IHJlcXVpcmUoJy4vX3N0YWNrU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN0YWNrIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIFN0YWNrKGVudHJpZXMpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IExpc3RDYWNoZShlbnRyaWVzKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgU3RhY2tgLlxuU3RhY2sucHJvdG90eXBlLmNsZWFyID0gc3RhY2tDbGVhcjtcblN0YWNrLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBzdGFja0RlbGV0ZTtcblN0YWNrLnByb3RvdHlwZS5nZXQgPSBzdGFja0dldDtcblN0YWNrLnByb3RvdHlwZS5oYXMgPSBzdGFja0hhcztcblN0YWNrLnByb3RvdHlwZS5zZXQgPSBzdGFja1NldDtcblxubW9kdWxlLmV4cG9ydHMgPSBTdGFjaztcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBTeW1ib2wgPSByb290LlN5bWJvbDtcblxubW9kdWxlLmV4cG9ydHMgPSBTeW1ib2w7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgVWludDhBcnJheSA9IHJvb3QuVWludDhBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBVaW50OEFycmF5O1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBXZWFrTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdXZWFrTWFwJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gV2Vha01hcDtcbiIsIi8qKlxuICogQSBmYXN0ZXIgYWx0ZXJuYXRpdmUgdG8gYEZ1bmN0aW9uI2FwcGx5YCwgdGhpcyBmdW5jdGlvbiBpbnZva2VzIGBmdW5jYFxuICogd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgYHRoaXNBcmdgIGFuZCB0aGUgYXJndW1lbnRzIG9mIGBhcmdzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaW52b2tlLlxuICogQHBhcmFtIHsqfSB0aGlzQXJnIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzIFRoZSBhcmd1bWVudHMgdG8gaW52b2tlIGBmdW5jYCB3aXRoLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc3VsdCBvZiBgZnVuY2AuXG4gKi9cbmZ1bmN0aW9uIGFwcGx5KGZ1bmMsIHRoaXNBcmcsIGFyZ3MpIHtcbiAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnKTtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgfVxuICByZXR1cm4gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcHBseTtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZvckVhY2hgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheUVhY2goYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoaXRlcmF0ZWUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpID09PSBmYWxzZSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUVhY2g7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5maWx0ZXJgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBmaWx0ZXJlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYXJyYXlGaWx0ZXIoYXJyYXksIHByZWRpY2F0ZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzSW5kZXggPSAwLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgcmVzdWx0W3Jlc0luZGV4KytdID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlGaWx0ZXI7XG4iLCJ2YXIgYmFzZUluZGV4T2YgPSByZXF1aXJlKCcuL19iYXNlSW5kZXhPZicpO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5pbmNsdWRlc2AgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBzcGVjaWZ5aW5nIGFuIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSB0YXJnZXQgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHRhcmdldGAgaXMgZm91bmQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlJbmNsdWRlcyhhcnJheSwgdmFsdWUpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoO1xuICByZXR1cm4gISFsZW5ndGggJiYgYmFzZUluZGV4T2YoYXJyYXksIHZhbHVlLCAwKSA+IC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5SW5jbHVkZXM7XG4iLCIvKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgbGlrZSBgYXJyYXlJbmNsdWRlc2AgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBhIGNvbXBhcmF0b3IuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IHRhcmdldCBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbXBhcmF0b3IgVGhlIGNvbXBhcmF0b3IgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdGFyZ2V0YCBpcyBmb3VuZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBhcnJheUluY2x1ZGVzV2l0aChhcnJheSwgdmFsdWUsIGNvbXBhcmF0b3IpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChjb21wYXJhdG9yKHZhbHVlLCBhcnJheVtpbmRleF0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5SW5jbHVkZXNXaXRoO1xuIiwidmFyIGJhc2VUaW1lcyA9IHJlcXVpcmUoJy4vX2Jhc2VUaW1lcycpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0J1ZmZlciA9IHJlcXVpcmUoJy4vaXNCdWZmZXInKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi9faXNJbmRleCcpLFxuICAgIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vaXNUeXBlZEFycmF5Jyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiB0aGUgYXJyYXktbGlrZSBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5oZXJpdGVkIFNwZWNpZnkgcmV0dXJuaW5nIGluaGVyaXRlZCBwcm9wZXJ0eSBuYW1lcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TGlrZUtleXModmFsdWUsIGluaGVyaXRlZCkge1xuICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKSxcbiAgICAgIGlzQXJnID0gIWlzQXJyICYmIGlzQXJndW1lbnRzKHZhbHVlKSxcbiAgICAgIGlzQnVmZiA9ICFpc0FyciAmJiAhaXNBcmcgJiYgaXNCdWZmZXIodmFsdWUpLFxuICAgICAgaXNUeXBlID0gIWlzQXJyICYmICFpc0FyZyAmJiAhaXNCdWZmICYmIGlzVHlwZWRBcnJheSh2YWx1ZSksXG4gICAgICBza2lwSW5kZXhlcyA9IGlzQXJyIHx8IGlzQXJnIHx8IGlzQnVmZiB8fCBpc1R5cGUsXG4gICAgICByZXN1bHQgPSBza2lwSW5kZXhlcyA/IGJhc2VUaW1lcyh2YWx1ZS5sZW5ndGgsIFN0cmluZykgOiBbXSxcbiAgICAgIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XG5cbiAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgaWYgKChpbmhlcml0ZWQgfHwgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwga2V5KSkgJiZcbiAgICAgICAgIShza2lwSW5kZXhlcyAmJiAoXG4gICAgICAgICAgIC8vIFNhZmFyaSA5IGhhcyBlbnVtZXJhYmxlIGBhcmd1bWVudHMubGVuZ3RoYCBpbiBzdHJpY3QgbW9kZS5cbiAgICAgICAgICAga2V5ID09ICdsZW5ndGgnIHx8XG4gICAgICAgICAgIC8vIE5vZGUuanMgMC4xMCBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiBidWZmZXJzLlxuICAgICAgICAgICAoaXNCdWZmICYmIChrZXkgPT0gJ29mZnNldCcgfHwga2V5ID09ICdwYXJlbnQnKSkgfHxcbiAgICAgICAgICAgLy8gUGhhbnRvbUpTIDIgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gdHlwZWQgYXJyYXlzLlxuICAgICAgICAgICAoaXNUeXBlICYmIChrZXkgPT0gJ2J1ZmZlcicgfHwga2V5ID09ICdieXRlTGVuZ3RoJyB8fCBrZXkgPT0gJ2J5dGVPZmZzZXQnKSkgfHxcbiAgICAgICAgICAgLy8gU2tpcCBpbmRleCBwcm9wZXJ0aWVzLlxuICAgICAgICAgICBpc0luZGV4KGtleSwgbGVuZ3RoKVxuICAgICAgICApKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUxpa2VLZXlzO1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8ubWFwYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWVcbiAqIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBtYXBwZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TWFwKGFycmF5LCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheU1hcDtcbiIsIi8qKlxuICogQXBwZW5kcyB0aGUgZWxlbWVudHMgb2YgYHZhbHVlc2AgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIGFwcGVuZC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheVB1c2goYXJyYXksIHZhbHVlcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGgsXG4gICAgICBvZmZzZXQgPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhcnJheVtvZmZzZXQgKyBpbmRleF0gPSB2YWx1ZXNbaW5kZXhdO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheVB1c2g7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5zb21lYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWVcbiAqIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFueSBlbGVtZW50IHBhc3NlcyB0aGUgcHJlZGljYXRlIGNoZWNrLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlTb21lKGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5U29tZTtcbiIsInZhciBiYXNlQXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19iYXNlQXNzaWduVmFsdWUnKSxcbiAgICBlcSA9IHJlcXVpcmUoJy4vZXEnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBBc3NpZ25zIGB2YWx1ZWAgdG8gYGtleWAgb2YgYG9iamVjdGAgaWYgdGhlIGV4aXN0aW5nIHZhbHVlIGlzIG5vdCBlcXVpdmFsZW50XG4gKiB1c2luZyBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogZm9yIGVxdWFsaXR5IGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICB2YXIgb2JqVmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgaWYgKCEoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYgZXEob2JqVmFsdWUsIHZhbHVlKSkgfHxcbiAgICAgICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmICEoa2V5IGluIG9iamVjdCkpKSB7XG4gICAgYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NpZ25WYWx1ZTtcbiIsInZhciBlcSA9IHJlcXVpcmUoJy4vZXEnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgYGtleWAgaXMgZm91bmQgaW4gYGFycmF5YCBvZiBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSBrZXkgVGhlIGtleSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYXNzb2NJbmRleE9mKGFycmF5LCBrZXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgaWYgKGVxKGFycmF5W2xlbmd0aF1bMF0sIGtleSkpIHtcbiAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NvY0luZGV4T2Y7XG4iLCJ2YXIgZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19kZWZpbmVQcm9wZXJ0eScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBhc3NpZ25WYWx1ZWAgYW5kIGBhc3NpZ25NZXJnZVZhbHVlYCB3aXRob3V0XG4gKiB2YWx1ZSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5ID09ICdfX3Byb3RvX18nICYmIGRlZmluZVByb3BlcnR5KSB7XG4gICAgZGVmaW5lUHJvcGVydHkob2JqZWN0LCBrZXksIHtcbiAgICAgICdjb25maWd1cmFibGUnOiB0cnVlLFxuICAgICAgJ2VudW1lcmFibGUnOiB0cnVlLFxuICAgICAgJ3ZhbHVlJzogdmFsdWUsXG4gICAgICAnd3JpdGFibGUnOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VBc3NpZ25WYWx1ZTtcbiIsInZhciBiYXNlRm9yT3duID0gcmVxdWlyZSgnLi9fYmFzZUZvck93bicpLFxuICAgIGNyZWF0ZUJhc2VFYWNoID0gcmVxdWlyZSgnLi9fY3JlYXRlQmFzZUVhY2gnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JFYWNoYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqL1xudmFyIGJhc2VFYWNoID0gY3JlYXRlQmFzZUVhY2goYmFzZUZvck93bik7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUVhY2g7XG4iLCJ2YXIgYmFzZUVhY2ggPSByZXF1aXJlKCcuL19iYXNlRWFjaCcpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZpbHRlcmAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZpbHRlcmVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBiYXNlRmlsdGVyKGNvbGxlY3Rpb24sIHByZWRpY2F0ZSkge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIGJhc2VFYWNoKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgIGlmIChwcmVkaWNhdGUodmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSkge1xuICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZpbHRlcjtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZmluZEluZGV4YCBhbmQgYF8uZmluZExhc3RJbmRleGAgd2l0aG91dFxuICogc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBiYXNlRmluZEluZGV4KGFycmF5LCBwcmVkaWNhdGUsIGZyb21JbmRleCwgZnJvbVJpZ2h0KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBpbmRleCA9IGZyb21JbmRleCArIChmcm9tUmlnaHQgPyAxIDogLTEpO1xuXG4gIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHtcbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGaW5kSW5kZXg7XG4iLCJ2YXIgYXJyYXlQdXNoID0gcmVxdWlyZSgnLi9fYXJyYXlQdXNoJyksXG4gICAgaXNGbGF0dGVuYWJsZSA9IHJlcXVpcmUoJy4vX2lzRmxhdHRlbmFibGUnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mbGF0dGVuYCB3aXRoIHN1cHBvcnQgZm9yIHJlc3RyaWN0aW5nIGZsYXR0ZW5pbmcuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBmbGF0dGVuLlxuICogQHBhcmFtIHtudW1iZXJ9IGRlcHRoIFRoZSBtYXhpbXVtIHJlY3Vyc2lvbiBkZXB0aC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3ByZWRpY2F0ZT1pc0ZsYXR0ZW5hYmxlXSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNTdHJpY3RdIFJlc3RyaWN0IHRvIHZhbHVlcyB0aGF0IHBhc3MgYHByZWRpY2F0ZWAgY2hlY2tzLlxuICogQHBhcmFtIHtBcnJheX0gW3Jlc3VsdD1bXV0gVGhlIGluaXRpYWwgcmVzdWx0IHZhbHVlLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZmxhdHRlbmVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBiYXNlRmxhdHRlbihhcnJheSwgZGVwdGgsIHByZWRpY2F0ZSwgaXNTdHJpY3QsIHJlc3VsdCkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICBwcmVkaWNhdGUgfHwgKHByZWRpY2F0ZSA9IGlzRmxhdHRlbmFibGUpO1xuICByZXN1bHQgfHwgKHJlc3VsdCA9IFtdKTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcbiAgICBpZiAoZGVwdGggPiAwICYmIHByZWRpY2F0ZSh2YWx1ZSkpIHtcbiAgICAgIGlmIChkZXB0aCA+IDEpIHtcbiAgICAgICAgLy8gUmVjdXJzaXZlbHkgZmxhdHRlbiBhcnJheXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICAgICAgYmFzZUZsYXR0ZW4odmFsdWUsIGRlcHRoIC0gMSwgcHJlZGljYXRlLCBpc1N0cmljdCwgcmVzdWx0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFycmF5UHVzaChyZXN1bHQsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCFpc1N0cmljdCkge1xuICAgICAgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZsYXR0ZW47XG4iLCJ2YXIgY3JlYXRlQmFzZUZvciA9IHJlcXVpcmUoJy4vX2NyZWF0ZUJhc2VGb3InKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYmFzZUZvck93bmAgd2hpY2ggaXRlcmF0ZXMgb3ZlciBgb2JqZWN0YFxuICogcHJvcGVydGllcyByZXR1cm5lZCBieSBga2V5c0Z1bmNgIGFuZCBpbnZva2VzIGBpdGVyYXRlZWAgZm9yIGVhY2ggcHJvcGVydHkuXG4gKiBJdGVyYXRlZSBmdW5jdGlvbnMgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5IGJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGBmYWxzZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbnZhciBiYXNlRm9yID0gY3JlYXRlQmFzZUZvcigpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGb3I7XG4iLCJ2YXIgYmFzZUZvciA9IHJlcXVpcmUoJy4vX2Jhc2VGb3InKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZm9yT3duYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUZvck93bihvYmplY3QsIGl0ZXJhdGVlKSB7XG4gIHJldHVybiBvYmplY3QgJiYgYmFzZUZvcihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRm9yT3duO1xuIiwidmFyIGNhc3RQYXRoID0gcmVxdWlyZSgnLi9fY2FzdFBhdGgnKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZ2V0YCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZmF1bHQgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc29sdmVkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0KG9iamVjdCwgcGF0aCkge1xuICBwYXRoID0gY2FzdFBhdGgocGF0aCwgb2JqZWN0KTtcblxuICB2YXIgaW5kZXggPSAwLFxuICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGg7XG5cbiAgd2hpbGUgKG9iamVjdCAhPSBudWxsICYmIGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgb2JqZWN0ID0gb2JqZWN0W3RvS2V5KHBhdGhbaW5kZXgrK10pXTtcbiAgfVxuICByZXR1cm4gKGluZGV4ICYmIGluZGV4ID09IGxlbmd0aCkgPyBvYmplY3QgOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUdldDtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBnZXRSYXdUYWcgPSByZXF1aXJlKCcuL19nZXRSYXdUYWcnKSxcbiAgICBvYmplY3RUb1N0cmluZyA9IHJlcXVpcmUoJy4vX29iamVjdFRvU3RyaW5nJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgdmFsdWUgPSBPYmplY3QodmFsdWUpO1xuICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIHZhbHVlKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRUYWc7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmhhc2Agd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBrZXkgVGhlIGtleSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUhhcyhvYmplY3QsIGtleSkge1xuICByZXR1cm4gb2JqZWN0ICE9IG51bGwgJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUhhcztcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaGFzSW5gIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30ga2V5IFRoZSBrZXkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VIYXNJbihvYmplY3QsIGtleSkge1xuICByZXR1cm4gb2JqZWN0ICE9IG51bGwgJiYga2V5IGluIE9iamVjdChvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VIYXNJbjtcbiIsInZhciBiYXNlRmluZEluZGV4ID0gcmVxdWlyZSgnLi9fYmFzZUZpbmRJbmRleCcpLFxuICAgIGJhc2VJc05hTiA9IHJlcXVpcmUoJy4vX2Jhc2VJc05hTicpLFxuICAgIHN0cmljdEluZGV4T2YgPSByZXF1aXJlKCcuL19zdHJpY3RJbmRleE9mJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaW5kZXhPZmAgd2l0aG91dCBgZnJvbUluZGV4YCBib3VuZHMgY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gdmFsdWVcbiAgICA/IHN0cmljdEluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpXG4gICAgOiBiYXNlRmluZEluZGV4KGFycmF5LCBiYXNlSXNOYU4sIGZyb21JbmRleCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUluZGV4T2Y7XG4iLCJ2YXIgU2V0Q2FjaGUgPSByZXF1aXJlKCcuL19TZXRDYWNoZScpLFxuICAgIGFycmF5SW5jbHVkZXMgPSByZXF1aXJlKCcuL19hcnJheUluY2x1ZGVzJyksXG4gICAgYXJyYXlJbmNsdWRlc1dpdGggPSByZXF1aXJlKCcuL19hcnJheUluY2x1ZGVzV2l0aCcpLFxuICAgIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBiYXNlVW5hcnkgPSByZXF1aXJlKCcuL19iYXNlVW5hcnknKSxcbiAgICBjYWNoZUhhcyA9IHJlcXVpcmUoJy4vX2NhY2hlSGFzJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNaW4gPSBNYXRoLm1pbjtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBtZXRob2RzIGxpa2UgYF8uaW50ZXJzZWN0aW9uYCwgd2l0aG91dCBzdXBwb3J0XG4gKiBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcywgdGhhdCBhY2NlcHRzIGFuIGFycmF5IG9mIGFycmF5cyB0byBpbnNwZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheXMgVGhlIGFycmF5cyB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlXSBUaGUgaXRlcmF0ZWUgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjb21wYXJhdG9yXSBUaGUgY29tcGFyYXRvciBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgYXJyYXkgb2Ygc2hhcmVkIHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUludGVyc2VjdGlvbihhcnJheXMsIGl0ZXJhdGVlLCBjb21wYXJhdG9yKSB7XG4gIHZhciBpbmNsdWRlcyA9IGNvbXBhcmF0b3IgPyBhcnJheUluY2x1ZGVzV2l0aCA6IGFycmF5SW5jbHVkZXMsXG4gICAgICBsZW5ndGggPSBhcnJheXNbMF0ubGVuZ3RoLFxuICAgICAgb3RoTGVuZ3RoID0gYXJyYXlzLmxlbmd0aCxcbiAgICAgIG90aEluZGV4ID0gb3RoTGVuZ3RoLFxuICAgICAgY2FjaGVzID0gQXJyYXkob3RoTGVuZ3RoKSxcbiAgICAgIG1heExlbmd0aCA9IEluZmluaXR5LFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgd2hpbGUgKG90aEluZGV4LS0pIHtcbiAgICB2YXIgYXJyYXkgPSBhcnJheXNbb3RoSW5kZXhdO1xuICAgIGlmIChvdGhJbmRleCAmJiBpdGVyYXRlZSkge1xuICAgICAgYXJyYXkgPSBhcnJheU1hcChhcnJheSwgYmFzZVVuYXJ5KGl0ZXJhdGVlKSk7XG4gICAgfVxuICAgIG1heExlbmd0aCA9IG5hdGl2ZU1pbihhcnJheS5sZW5ndGgsIG1heExlbmd0aCk7XG4gICAgY2FjaGVzW290aEluZGV4XSA9ICFjb21wYXJhdG9yICYmIChpdGVyYXRlZSB8fCAobGVuZ3RoID49IDEyMCAmJiBhcnJheS5sZW5ndGggPj0gMTIwKSlcbiAgICAgID8gbmV3IFNldENhY2hlKG90aEluZGV4ICYmIGFycmF5KVxuICAgICAgOiB1bmRlZmluZWQ7XG4gIH1cbiAgYXJyYXkgPSBhcnJheXNbMF07XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBzZWVuID0gY2FjaGVzWzBdO1xuXG4gIG91dGVyOlxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCAmJiByZXN1bHQubGVuZ3RoIDwgbWF4TGVuZ3RoKSB7XG4gICAgdmFyIHZhbHVlID0gYXJyYXlbaW5kZXhdLFxuICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlID8gaXRlcmF0ZWUodmFsdWUpIDogdmFsdWU7XG5cbiAgICB2YWx1ZSA9IChjb21wYXJhdG9yIHx8IHZhbHVlICE9PSAwKSA/IHZhbHVlIDogMDtcbiAgICBpZiAoIShzZWVuXG4gICAgICAgICAgPyBjYWNoZUhhcyhzZWVuLCBjb21wdXRlZClcbiAgICAgICAgICA6IGluY2x1ZGVzKHJlc3VsdCwgY29tcHV0ZWQsIGNvbXBhcmF0b3IpXG4gICAgICAgICkpIHtcbiAgICAgIG90aEluZGV4ID0gb3RoTGVuZ3RoO1xuICAgICAgd2hpbGUgKC0tb3RoSW5kZXgpIHtcbiAgICAgICAgdmFyIGNhY2hlID0gY2FjaGVzW290aEluZGV4XTtcbiAgICAgICAgaWYgKCEoY2FjaGVcbiAgICAgICAgICAgICAgPyBjYWNoZUhhcyhjYWNoZSwgY29tcHV0ZWQpXG4gICAgICAgICAgICAgIDogaW5jbHVkZXMoYXJyYXlzW290aEluZGV4XSwgY29tcHV0ZWQsIGNvbXBhcmF0b3IpKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgY29udGludWUgb3V0ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzZWVuKSB7XG4gICAgICAgIHNlZW4ucHVzaChjb21wdXRlZCk7XG4gICAgICB9XG4gICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUludGVyc2VjdGlvbjtcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNBcmd1bWVudHNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqL1xuZnVuY3Rpb24gYmFzZUlzQXJndW1lbnRzKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IGFyZ3NUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzQXJndW1lbnRzO1xuIiwidmFyIGJhc2VJc0VxdWFsRGVlcCA9IHJlcXVpcmUoJy4vX2Jhc2VJc0VxdWFsRGVlcCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNFcXVhbGAgd2hpY2ggc3VwcG9ydHMgcGFydGlhbCBjb21wYXJpc29uc1xuICogYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuXG4gKiAgMSAtIFVub3JkZXJlZCBjb21wYXJpc29uXG4gKiAgMiAtIFBhcnRpYWwgY29tcGFyaXNvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIGB2YWx1ZWAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0VxdWFsKHZhbHVlLCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spIHtcbiAgaWYgKHZhbHVlID09PSBvdGhlcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IG90aGVyID09IG51bGwgfHwgKCFpc09iamVjdCh2YWx1ZSkgJiYgIWlzT2JqZWN0TGlrZShvdGhlcikpKSB7XG4gICAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXI7XG4gIH1cbiAgcmV0dXJuIGJhc2VJc0VxdWFsRGVlcCh2YWx1ZSwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGJhc2VJc0VxdWFsLCBzdGFjayk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzRXF1YWw7XG4iLCJ2YXIgU3RhY2sgPSByZXF1aXJlKCcuL19TdGFjaycpLFxuICAgIGVxdWFsQXJyYXlzID0gcmVxdWlyZSgnLi9fZXF1YWxBcnJheXMnKSxcbiAgICBlcXVhbEJ5VGFnID0gcmVxdWlyZSgnLi9fZXF1YWxCeVRhZycpLFxuICAgIGVxdWFsT2JqZWN0cyA9IHJlcXVpcmUoJy4vX2VxdWFsT2JqZWN0cycpLFxuICAgIGdldFRhZyA9IHJlcXVpcmUoJy4vX2dldFRhZycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0J1ZmZlciA9IHJlcXVpcmUoJy4vaXNCdWZmZXInKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB2YWx1ZSBjb21wYXJpc29ucy4gKi9cbnZhciBDT01QQVJFX1BBUlRJQUxfRkxBRyA9IDE7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxgIGZvciBhcnJheXMgYW5kIG9iamVjdHMgd2hpY2ggcGVyZm9ybXNcbiAqIGRlZXAgY29tcGFyaXNvbnMgYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBlbmFibGluZyBvYmplY3RzIHdpdGggY2lyY3VsYXJcbiAqIHJlZmVyZW5jZXMgdG8gYmUgY29tcGFyZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0VxdWFsRGVlcChvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHZhciBvYmpJc0FyciA9IGlzQXJyYXkob2JqZWN0KSxcbiAgICAgIG90aElzQXJyID0gaXNBcnJheShvdGhlciksXG4gICAgICBvYmpUYWcgPSBhcnJheVRhZyxcbiAgICAgIG90aFRhZyA9IGFycmF5VGFnO1xuXG4gIGlmICghb2JqSXNBcnIpIHtcbiAgICBvYmpUYWcgPSBnZXRUYWcob2JqZWN0KTtcbiAgICBvYmpUYWcgPSBvYmpUYWcgPT0gYXJnc1RhZyA/IG9iamVjdFRhZyA6IG9ialRhZztcbiAgfVxuICBpZiAoIW90aElzQXJyKSB7XG4gICAgb3RoVGFnID0gZ2V0VGFnKG90aGVyKTtcbiAgICBvdGhUYWcgPSBvdGhUYWcgPT0gYXJnc1RhZyA/IG9iamVjdFRhZyA6IG90aFRhZztcbiAgfVxuICB2YXIgb2JqSXNPYmogPSBvYmpUYWcgPT0gb2JqZWN0VGFnLFxuICAgICAgb3RoSXNPYmogPSBvdGhUYWcgPT0gb2JqZWN0VGFnLFxuICAgICAgaXNTYW1lVGFnID0gb2JqVGFnID09IG90aFRhZztcblxuICBpZiAoaXNTYW1lVGFnICYmIGlzQnVmZmVyKG9iamVjdCkpIHtcbiAgICBpZiAoIWlzQnVmZmVyKG90aGVyKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBvYmpJc0FyciA9IHRydWU7XG4gICAgb2JqSXNPYmogPSBmYWxzZTtcbiAgfVxuICBpZiAoaXNTYW1lVGFnICYmICFvYmpJc09iaikge1xuICAgIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gICAgcmV0dXJuIChvYmpJc0FyciB8fCBpc1R5cGVkQXJyYXkob2JqZWN0KSlcbiAgICAgID8gZXF1YWxBcnJheXMob2JqZWN0LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaylcbiAgICAgIDogZXF1YWxCeVRhZyhvYmplY3QsIG90aGVyLCBvYmpUYWcsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spO1xuICB9XG4gIGlmICghKGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRykpIHtcbiAgICB2YXIgb2JqSXNXcmFwcGVkID0gb2JqSXNPYmogJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsICdfX3dyYXBwZWRfXycpLFxuICAgICAgICBvdGhJc1dyYXBwZWQgPSBvdGhJc09iaiAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG90aGVyLCAnX193cmFwcGVkX18nKTtcblxuICAgIGlmIChvYmpJc1dyYXBwZWQgfHwgb3RoSXNXcmFwcGVkKSB7XG4gICAgICB2YXIgb2JqVW53cmFwcGVkID0gb2JqSXNXcmFwcGVkID8gb2JqZWN0LnZhbHVlKCkgOiBvYmplY3QsXG4gICAgICAgICAgb3RoVW53cmFwcGVkID0gb3RoSXNXcmFwcGVkID8gb3RoZXIudmFsdWUoKSA6IG90aGVyO1xuXG4gICAgICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICAgICAgcmV0dXJuIGVxdWFsRnVuYyhvYmpVbndyYXBwZWQsIG90aFVud3JhcHBlZCwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spO1xuICAgIH1cbiAgfVxuICBpZiAoIWlzU2FtZVRhZykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICByZXR1cm4gZXF1YWxPYmplY3RzKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc0VxdWFsRGVlcDtcbiIsInZhciBTdGFjayA9IHJlcXVpcmUoJy4vX1N0YWNrJyksXG4gICAgYmFzZUlzRXF1YWwgPSByZXF1aXJlKCcuL19iYXNlSXNFcXVhbCcpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB2YWx1ZSBjb21wYXJpc29ucy4gKi9cbnZhciBDT01QQVJFX1BBUlRJQUxfRkxBRyA9IDEsXG4gICAgQ09NUEFSRV9VTk9SREVSRURfRkxBRyA9IDI7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNNYXRjaGAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCBvZiBwcm9wZXJ0eSB2YWx1ZXMgdG8gbWF0Y2guXG4gKiBAcGFyYW0ge0FycmF5fSBtYXRjaERhdGEgVGhlIHByb3BlcnR5IG5hbWVzLCB2YWx1ZXMsIGFuZCBjb21wYXJlIGZsYWdzIHRvIG1hdGNoLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYG9iamVjdGAgaXMgYSBtYXRjaCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNNYXRjaChvYmplY3QsIHNvdXJjZSwgbWF0Y2hEYXRhLCBjdXN0b21pemVyKSB7XG4gIHZhciBpbmRleCA9IG1hdGNoRGF0YS5sZW5ndGgsXG4gICAgICBsZW5ndGggPSBpbmRleCxcbiAgICAgIG5vQ3VzdG9taXplciA9ICFjdXN0b21pemVyO1xuXG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybiAhbGVuZ3RoO1xuICB9XG4gIG9iamVjdCA9IE9iamVjdChvYmplY3QpO1xuICB3aGlsZSAoaW5kZXgtLSkge1xuICAgIHZhciBkYXRhID0gbWF0Y2hEYXRhW2luZGV4XTtcbiAgICBpZiAoKG5vQ3VzdG9taXplciAmJiBkYXRhWzJdKVxuICAgICAgICAgID8gZGF0YVsxXSAhPT0gb2JqZWN0W2RhdGFbMF1dXG4gICAgICAgICAgOiAhKGRhdGFbMF0gaW4gb2JqZWN0KVxuICAgICAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBkYXRhID0gbWF0Y2hEYXRhW2luZGV4XTtcbiAgICB2YXIga2V5ID0gZGF0YVswXSxcbiAgICAgICAgb2JqVmFsdWUgPSBvYmplY3Rba2V5XSxcbiAgICAgICAgc3JjVmFsdWUgPSBkYXRhWzFdO1xuXG4gICAgaWYgKG5vQ3VzdG9taXplciAmJiBkYXRhWzJdKSB7XG4gICAgICBpZiAob2JqVmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHN0YWNrID0gbmV3IFN0YWNrO1xuICAgICAgaWYgKGN1c3RvbWl6ZXIpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGN1c3RvbWl6ZXIob2JqVmFsdWUsIHNyY1ZhbHVlLCBrZXksIG9iamVjdCwgc291cmNlLCBzdGFjayk7XG4gICAgICB9XG4gICAgICBpZiAoIShyZXN1bHQgPT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgPyBiYXNlSXNFcXVhbChzcmNWYWx1ZSwgb2JqVmFsdWUsIENPTVBBUkVfUEFSVElBTF9GTEFHIHwgQ09NUEFSRV9VTk9SREVSRURfRkxBRywgY3VzdG9taXplciwgc3RhY2spXG4gICAgICAgICAgICA6IHJlc3VsdFxuICAgICAgICAgICkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNNYXRjaDtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNOYU5gIHdpdGhvdXQgc3VwcG9ydCBmb3IgbnVtYmVyIG9iamVjdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYE5hTmAsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTmFOKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gdmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzTmFOO1xuIiwidmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKSxcbiAgICBpc01hc2tlZCA9IHJlcXVpcmUoJy4vX2lzTWFza2VkJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgdG9Tb3VyY2UgPSByZXF1aXJlKCcuL190b1NvdXJjZScpO1xuXG4vKipcbiAqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGBcbiAqIFtzeW50YXggY2hhcmFjdGVyc10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtcGF0dGVybnMpLlxuICovXG52YXIgcmVSZWdFeHBDaGFyID0gL1tcXFxcXiQuKis/KClbXFxde318XS9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaG9zdCBjb25zdHJ1Y3RvcnMgKFNhZmFyaSkuICovXG52YXIgcmVJc0hvc3RDdG9yID0gL15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZSxcbiAgICBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUuICovXG52YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBmdW5jVG9TdHJpbmcuY2FsbChoYXNPd25Qcm9wZXJ0eSkucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNOYXRpdmVgIHdpdGhvdXQgYmFkIHNoaW0gY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpIHx8IGlzTWFza2VkKHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgcGF0dGVybiA9IGlzRnVuY3Rpb24odmFsdWUpID8gcmVJc05hdGl2ZSA6IHJlSXNIb3N0Q3RvcjtcbiAgcmV0dXJuIHBhdHRlcm4udGVzdCh0b1NvdXJjZSh2YWx1ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc05hdGl2ZTtcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIG9mIHR5cGVkIGFycmF5cy4gKi9cbnZhciB0eXBlZEFycmF5VGFncyA9IHt9O1xudHlwZWRBcnJheVRhZ3NbZmxvYXQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1tmbG9hdDY0VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQ4VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2ludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50OFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG50eXBlZEFycmF5VGFnc1thcmdzVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2FycmF5VGFnXSA9XG50eXBlZEFycmF5VGFnc1thcnJheUJ1ZmZlclRhZ10gPSB0eXBlZEFycmF5VGFnc1tib29sVGFnXSA9XG50eXBlZEFycmF5VGFnc1tkYXRhVmlld1RhZ10gPSB0eXBlZEFycmF5VGFnc1tkYXRlVGFnXSA9XG50eXBlZEFycmF5VGFnc1tlcnJvclRhZ10gPSB0eXBlZEFycmF5VGFnc1tmdW5jVGFnXSA9XG50eXBlZEFycmF5VGFnc1ttYXBUYWddID0gdHlwZWRBcnJheVRhZ3NbbnVtYmVyVGFnXSA9XG50eXBlZEFycmF5VGFnc1tvYmplY3RUYWddID0gdHlwZWRBcnJheVRhZ3NbcmVnZXhwVGFnXSA9XG50eXBlZEFycmF5VGFnc1tzZXRUYWddID0gdHlwZWRBcnJheVRhZ3Nbc3RyaW5nVGFnXSA9XG50eXBlZEFycmF5VGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzVHlwZWRBcnJheWAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNUeXBlZEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmXG4gICAgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhIXR5cGVkQXJyYXlUYWdzW2Jhc2VHZXRUYWcodmFsdWUpXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNUeXBlZEFycmF5O1xuIiwidmFyIGJhc2VNYXRjaGVzID0gcmVxdWlyZSgnLi9fYmFzZU1hdGNoZXMnKSxcbiAgICBiYXNlTWF0Y2hlc1Byb3BlcnR5ID0gcmVxdWlyZSgnLi9fYmFzZU1hdGNoZXNQcm9wZXJ0eScpLFxuICAgIGlkZW50aXR5ID0gcmVxdWlyZSgnLi9pZGVudGl0eScpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBwcm9wZXJ0eSA9IHJlcXVpcmUoJy4vcHJvcGVydHknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pdGVyYXRlZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gW3ZhbHVlPV8uaWRlbnRpdHldIFRoZSB2YWx1ZSB0byBjb252ZXJ0IHRvIGFuIGl0ZXJhdGVlLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBpdGVyYXRlZS5cbiAqL1xuZnVuY3Rpb24gYmFzZUl0ZXJhdGVlKHZhbHVlKSB7XG4gIC8vIERvbid0IHN0b3JlIHRoZSBgdHlwZW9mYCByZXN1bHQgaW4gYSB2YXJpYWJsZSB0byBhdm9pZCBhIEpJVCBidWcgaW4gU2FmYXJpIDkuXG4gIC8vIFNlZSBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTU2MDM0IGZvciBtb3JlIGRldGFpbHMuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiBpZGVudGl0eTtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlID09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIGlzQXJyYXkodmFsdWUpXG4gICAgICA/IGJhc2VNYXRjaGVzUHJvcGVydHkodmFsdWVbMF0sIHZhbHVlWzFdKVxuICAgICAgOiBiYXNlTWF0Y2hlcyh2YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHByb3BlcnR5KHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXRlcmF0ZWU7XG4iLCJ2YXIgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpLFxuICAgIG5hdGl2ZUtleXMgPSByZXF1aXJlKCcuL19uYXRpdmVLZXlzJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c2Agd2hpY2ggZG9lc24ndCB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBiYXNlS2V5cyhvYmplY3QpIHtcbiAgaWYgKCFpc1Byb3RvdHlwZShvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXMob2JqZWN0KTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBrZXkgIT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlS2V5cztcbiIsInZhciBiYXNlRWFjaCA9IHJlcXVpcmUoJy4vX2Jhc2VFYWNoJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ubWFwYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBtYXBwZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGJhc2VNYXAoY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBpc0FycmF5TGlrZShjb2xsZWN0aW9uKSA/IEFycmF5KGNvbGxlY3Rpb24ubGVuZ3RoKSA6IFtdO1xuXG4gIGJhc2VFYWNoKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKHZhbHVlLCBrZXksIGNvbGxlY3Rpb24pIHtcbiAgICByZXN1bHRbKytpbmRleF0gPSBpdGVyYXRlZSh2YWx1ZSwga2V5LCBjb2xsZWN0aW9uKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU1hcDtcbiIsInZhciBiYXNlSXNNYXRjaCA9IHJlcXVpcmUoJy4vX2Jhc2VJc01hdGNoJyksXG4gICAgZ2V0TWF0Y2hEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWF0Y2hEYXRhJyksXG4gICAgbWF0Y2hlc1N0cmljdENvbXBhcmFibGUgPSByZXF1aXJlKCcuL19tYXRjaGVzU3RyaWN0Q29tcGFyYWJsZScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLm1hdGNoZXNgIHdoaWNoIGRvZXNuJ3QgY2xvbmUgYHNvdXJjZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCBvZiBwcm9wZXJ0eSB2YWx1ZXMgdG8gbWF0Y2guXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBzcGVjIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlTWF0Y2hlcyhzb3VyY2UpIHtcbiAgdmFyIG1hdGNoRGF0YSA9IGdldE1hdGNoRGF0YShzb3VyY2UpO1xuICBpZiAobWF0Y2hEYXRhLmxlbmd0aCA9PSAxICYmIG1hdGNoRGF0YVswXVsyXSkge1xuICAgIHJldHVybiBtYXRjaGVzU3RyaWN0Q29tcGFyYWJsZShtYXRjaERhdGFbMF1bMF0sIG1hdGNoRGF0YVswXVsxXSk7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBvYmplY3QgPT09IHNvdXJjZSB8fCBiYXNlSXNNYXRjaChvYmplY3QsIHNvdXJjZSwgbWF0Y2hEYXRhKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlTWF0Y2hlcztcbiIsInZhciBiYXNlSXNFcXVhbCA9IHJlcXVpcmUoJy4vX2Jhc2VJc0VxdWFsJyksXG4gICAgZ2V0ID0gcmVxdWlyZSgnLi9nZXQnKSxcbiAgICBoYXNJbiA9IHJlcXVpcmUoJy4vaGFzSW4nKSxcbiAgICBpc0tleSA9IHJlcXVpcmUoJy4vX2lzS2V5JyksXG4gICAgaXNTdHJpY3RDb21wYXJhYmxlID0gcmVxdWlyZSgnLi9faXNTdHJpY3RDb21wYXJhYmxlJyksXG4gICAgbWF0Y2hlc1N0cmljdENvbXBhcmFibGUgPSByZXF1aXJlKCcuL19tYXRjaGVzU3RyaWN0Q29tcGFyYWJsZScpLFxuICAgIHRvS2V5ID0gcmVxdWlyZSgnLi9fdG9LZXknKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgdmFsdWUgY29tcGFyaXNvbnMuICovXG52YXIgQ09NUEFSRV9QQVJUSUFMX0ZMQUcgPSAxLFxuICAgIENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcgPSAyO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLm1hdGNoZXNQcm9wZXJ0eWAgd2hpY2ggZG9lc24ndCBjbG9uZSBgc3JjVmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHBhcmFtIHsqfSBzcmNWYWx1ZSBUaGUgdmFsdWUgdG8gbWF0Y2guXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBzcGVjIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlTWF0Y2hlc1Byb3BlcnR5KHBhdGgsIHNyY1ZhbHVlKSB7XG4gIGlmIChpc0tleShwYXRoKSAmJiBpc1N0cmljdENvbXBhcmFibGUoc3JjVmFsdWUpKSB7XG4gICAgcmV0dXJuIG1hdGNoZXNTdHJpY3RDb21wYXJhYmxlKHRvS2V5KHBhdGgpLCBzcmNWYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBvYmpWYWx1ZSA9IGdldChvYmplY3QsIHBhdGgpO1xuICAgIHJldHVybiAob2JqVmFsdWUgPT09IHVuZGVmaW5lZCAmJiBvYmpWYWx1ZSA9PT0gc3JjVmFsdWUpXG4gICAgICA/IGhhc0luKG9iamVjdCwgcGF0aClcbiAgICAgIDogYmFzZUlzRXF1YWwoc3JjVmFsdWUsIG9ialZhbHVlLCBDT01QQVJFX1BBUlRJQUxfRkxBRyB8IENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VNYXRjaGVzUHJvcGVydHk7XG4iLCJ2YXIgYmFzZVBpY2tCeSA9IHJlcXVpcmUoJy4vX2Jhc2VQaWNrQnknKSxcbiAgICBoYXNJbiA9IHJlcXVpcmUoJy4vaGFzSW4nKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5waWNrYCB3aXRob3V0IHN1cHBvcnQgZm9yIGluZGl2aWR1YWxcbiAqIHByb3BlcnR5IGlkZW50aWZpZXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmdbXX0gcGF0aHMgVGhlIHByb3BlcnR5IHBhdGhzIHRvIHBpY2suXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBiYXNlUGljayhvYmplY3QsIHBhdGhzKSB7XG4gIG9iamVjdCA9IE9iamVjdChvYmplY3QpO1xuICByZXR1cm4gYmFzZVBpY2tCeShvYmplY3QsIHBhdGhzLCBmdW5jdGlvbih2YWx1ZSwgcGF0aCkge1xuICAgIHJldHVybiBoYXNJbihvYmplY3QsIHBhdGgpO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUGljaztcbiIsInZhciBiYXNlR2V0ID0gcmVxdWlyZSgnLi9fYmFzZUdldCcpLFxuICAgIGJhc2VTZXQgPSByZXF1aXJlKCcuL19iYXNlU2V0JyksXG4gICAgY2FzdFBhdGggPSByZXF1aXJlKCcuL19jYXN0UGF0aCcpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mICBgXy5waWNrQnlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHBhdGhzIFRoZSBwcm9wZXJ0eSBwYXRocyB0byBwaWNrLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBwcm9wZXJ0eS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGJhc2VQaWNrQnkob2JqZWN0LCBwYXRocywgcHJlZGljYXRlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcGF0aHMubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0ge307XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgcGF0aCA9IHBhdGhzW2luZGV4XSxcbiAgICAgICAgdmFsdWUgPSBiYXNlR2V0KG9iamVjdCwgcGF0aCk7XG5cbiAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBwYXRoKSkge1xuICAgICAgYmFzZVNldChyZXN1bHQsIGNhc3RQYXRoKHBhdGgsIG9iamVjdCksIHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUGlja0J5O1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eWAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFjY2Vzc29yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHkoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUHJvcGVydHk7XG4iLCJ2YXIgYmFzZUdldCA9IHJlcXVpcmUoJy4vX2Jhc2VHZXQnKTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VQcm9wZXJ0eWAgd2hpY2ggc3VwcG9ydHMgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFjY2Vzc29yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHlEZWVwKHBhdGgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBiYXNlR2V0KG9iamVjdCwgcGF0aCk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVByb3BlcnR5RGVlcDtcbiIsInZhciBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKSxcbiAgICBvdmVyUmVzdCA9IHJlcXVpcmUoJy4vX292ZXJSZXN0JyksXG4gICAgc2V0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19zZXRUb1N0cmluZycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnJlc3RgIHdoaWNoIGRvZXNuJ3QgdmFsaWRhdGUgb3IgY29lcmNlIGFyZ3VtZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUmVzdChmdW5jLCBzdGFydCkge1xuICByZXR1cm4gc2V0VG9TdHJpbmcob3ZlclJlc3QoZnVuYywgc3RhcnQsIGlkZW50aXR5KSwgZnVuYyArICcnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUmVzdDtcbiIsInZhciBhc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Fzc2lnblZhbHVlJyksXG4gICAgY2FzdFBhdGggPSByZXF1aXJlKCcuL19jYXN0UGF0aCcpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL19pc0luZGV4JyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgdG9LZXkgPSByZXF1aXJlKCcuL190b0tleScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnNldGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgcGF0aCBjcmVhdGlvbi5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VTZXQob2JqZWN0LCBwYXRoLCB2YWx1ZSwgY3VzdG9taXplcikge1xuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG4gIHBhdGggPSBjYXN0UGF0aChwYXRoLCBvYmplY3QpO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGgsXG4gICAgICBsYXN0SW5kZXggPSBsZW5ndGggLSAxLFxuICAgICAgbmVzdGVkID0gb2JqZWN0O1xuXG4gIHdoaWxlIChuZXN0ZWQgIT0gbnVsbCAmJiArK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHRvS2V5KHBhdGhbaW5kZXhdKSxcbiAgICAgICAgbmV3VmFsdWUgPSB2YWx1ZTtcblxuICAgIGlmIChpbmRleCAhPSBsYXN0SW5kZXgpIHtcbiAgICAgIHZhciBvYmpWYWx1ZSA9IG5lc3RlZFtrZXldO1xuICAgICAgbmV3VmFsdWUgPSBjdXN0b21pemVyID8gY3VzdG9taXplcihvYmpWYWx1ZSwga2V5LCBuZXN0ZWQpIDogdW5kZWZpbmVkO1xuICAgICAgaWYgKG5ld1ZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBpc09iamVjdChvYmpWYWx1ZSlcbiAgICAgICAgICA/IG9ialZhbHVlXG4gICAgICAgICAgOiAoaXNJbmRleChwYXRoW2luZGV4ICsgMV0pID8gW10gOiB7fSk7XG4gICAgICB9XG4gICAgfVxuICAgIGFzc2lnblZhbHVlKG5lc3RlZCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgbmVzdGVkID0gbmVzdGVkW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlU2V0O1xuIiwidmFyIGNvbnN0YW50ID0gcmVxdWlyZSgnLi9jb25zdGFudCcpLFxuICAgIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fZGVmaW5lUHJvcGVydHknKSxcbiAgICBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgc2V0VG9TdHJpbmdgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaG90IGxvb3Agc2hvcnRpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN0cmluZyBUaGUgYHRvU3RyaW5nYCByZXN1bHQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgYGZ1bmNgLlxuICovXG52YXIgYmFzZVNldFRvU3RyaW5nID0gIWRlZmluZVByb3BlcnR5ID8gaWRlbnRpdHkgOiBmdW5jdGlvbihmdW5jLCBzdHJpbmcpIHtcbiAgcmV0dXJuIGRlZmluZVByb3BlcnR5KGZ1bmMsICd0b1N0cmluZycsIHtcbiAgICAnY29uZmlndXJhYmxlJzogdHJ1ZSxcbiAgICAnZW51bWVyYWJsZSc6IGZhbHNlLFxuICAgICd2YWx1ZSc6IGNvbnN0YW50KHN0cmluZyksXG4gICAgJ3dyaXRhYmxlJzogdHJ1ZVxuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVNldFRvU3RyaW5nO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5zbGljZWAgd2l0aG91dCBhbiBpdGVyYXRlZSBjYWxsIGd1YXJkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2xpY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PTBdIFRoZSBzdGFydCBwb3NpdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbZW5kPWFycmF5Lmxlbmd0aF0gVGhlIGVuZCBwb3NpdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgc2xpY2Ugb2YgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYmFzZVNsaWNlKGFycmF5LCBzdGFydCwgZW5kKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gIGlmIChzdGFydCA8IDApIHtcbiAgICBzdGFydCA9IC1zdGFydCA+IGxlbmd0aCA/IDAgOiAobGVuZ3RoICsgc3RhcnQpO1xuICB9XG4gIGVuZCA9IGVuZCA+IGxlbmd0aCA/IGxlbmd0aCA6IGVuZDtcbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuZ3RoO1xuICB9XG4gIGxlbmd0aCA9IHN0YXJ0ID4gZW5kID8gMCA6ICgoZW5kIC0gc3RhcnQpID4+PiAwKTtcbiAgc3RhcnQgPj4+PSAwO1xuXG4gIHZhciByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSBhcnJheVtpbmRleCArIHN0YXJ0XTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VTbGljZTtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uc3VtYCBhbmQgYF8uc3VtQnlgIHdpdGhvdXQgc3VwcG9ydCBmb3JcbiAqIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgc3VtLlxuICovXG5mdW5jdGlvbiBiYXNlU3VtKGFycmF5LCBpdGVyYXRlZSkge1xuICB2YXIgcmVzdWx0LFxuICAgICAgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBjdXJyZW50ID0gaXRlcmF0ZWUoYXJyYXlbaW5kZXhdKTtcbiAgICBpZiAoY3VycmVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXN1bHQgPSByZXN1bHQgPT09IHVuZGVmaW5lZCA/IGN1cnJlbnQgOiAocmVzdWx0ICsgY3VycmVudCk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVN1bTtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udGltZXNgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kc1xuICogb3IgbWF4IGFycmF5IGxlbmd0aCBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBudW1iZXIgb2YgdGltZXMgdG8gaW52b2tlIGBpdGVyYXRlZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiByZXN1bHRzLlxuICovXG5mdW5jdGlvbiBiYXNlVGltZXMobiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShuKTtcblxuICB3aGlsZSAoKytpbmRleCA8IG4pIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoaW5kZXgpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRpbWVzO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKiBVc2VkIHRvIGNvbnZlcnQgc3ltYm9scyB0byBwcmltaXRpdmVzIGFuZCBzdHJpbmdzLiAqL1xudmFyIHN5bWJvbFByb3RvID0gU3ltYm9sID8gU3ltYm9sLnByb3RvdHlwZSA6IHVuZGVmaW5lZCxcbiAgICBzeW1ib2xUb1N0cmluZyA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udG9TdHJpbmcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udG9TdHJpbmdgIHdoaWNoIGRvZXNuJ3QgY29udmVydCBudWxsaXNoXG4gKiB2YWx1ZXMgdG8gZW1wdHkgc3RyaW5ncy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRvU3RyaW5nKHZhbHVlKSB7XG4gIC8vIEV4aXQgZWFybHkgZm9yIHN0cmluZ3MgdG8gYXZvaWQgYSBwZXJmb3JtYW5jZSBoaXQgaW4gc29tZSBlbnZpcm9ubWVudHMuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgLy8gUmVjdXJzaXZlbHkgY29udmVydCB2YWx1ZXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICByZXR1cm4gYXJyYXlNYXAodmFsdWUsIGJhc2VUb1N0cmluZykgKyAnJztcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIHN5bWJvbFRvU3RyaW5nID8gc3ltYm9sVG9TdHJpbmcuY2FsbCh2YWx1ZSkgOiAnJztcbiAgfVxuICB2YXIgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICByZXR1cm4gKHJlc3VsdCA9PSAnMCcgJiYgKDEgLyB2YWx1ZSkgPT0gLUlORklOSVRZKSA/ICctMCcgOiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRvU3RyaW5nO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmFyeWAgd2l0aG91dCBzdXBwb3J0IGZvciBzdG9yaW5nIG1ldGFkYXRhLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuYXJ5KGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmModmFsdWUpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VVbmFyeTtcbiIsInZhciBhcnJheU1hcCA9IHJlcXVpcmUoJy4vX2FycmF5TWFwJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udmFsdWVzYCBhbmQgYF8udmFsdWVzSW5gIHdoaWNoIGNyZWF0ZXMgYW5cbiAqIGFycmF5IG9mIGBvYmplY3RgIHByb3BlcnR5IHZhbHVlcyBjb3JyZXNwb25kaW5nIHRvIHRoZSBwcm9wZXJ0eSBuYW1lc1xuICogb2YgYHByb3BzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheX0gcHJvcHMgVGhlIHByb3BlcnR5IG5hbWVzIHRvIGdldCB2YWx1ZXMgZm9yLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgdmFsdWVzLlxuICovXG5mdW5jdGlvbiBiYXNlVmFsdWVzKG9iamVjdCwgcHJvcHMpIHtcbiAgcmV0dXJuIGFycmF5TWFwKHByb3BzLCBmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gb2JqZWN0W2tleV07XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VWYWx1ZXM7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBhIGBjYWNoZWAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGNhY2hlIFRoZSBjYWNoZSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBjYWNoZUhhcyhjYWNoZSwga2V5KSB7XG4gIHJldHVybiBjYWNoZS5oYXMoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjYWNoZUhhcztcbiIsInZhciBpc0FycmF5TGlrZU9iamVjdCA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2VPYmplY3QnKTtcblxuLyoqXG4gKiBDYXN0cyBgdmFsdWVgIHRvIGFuIGVtcHR5IGFycmF5IGlmIGl0J3Mgbm90IGFuIGFycmF5IGxpa2Ugb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge0FycmF5fE9iamVjdH0gUmV0dXJucyB0aGUgY2FzdCBhcnJheS1saWtlIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gY2FzdEFycmF5TGlrZU9iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gaXNBcnJheUxpa2VPYmplY3QodmFsdWUpID8gdmFsdWUgOiBbXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjYXN0QXJyYXlMaWtlT2JqZWN0O1xuIiwidmFyIGlkZW50aXR5ID0gcmVxdWlyZSgnLi9pZGVudGl0eScpO1xuXG4vKipcbiAqIENhc3RzIGB2YWx1ZWAgdG8gYGlkZW50aXR5YCBpZiBpdCdzIG5vdCBhIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGNhc3QgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNhc3RGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbicgPyB2YWx1ZSA6IGlkZW50aXR5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNhc3RGdW5jdGlvbjtcbiIsInZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNLZXkgPSByZXF1aXJlKCcuL19pc0tleScpLFxuICAgIHN0cmluZ1RvUGF0aCA9IHJlcXVpcmUoJy4vX3N0cmluZ1RvUGF0aCcpLFxuICAgIHRvU3RyaW5nID0gcmVxdWlyZSgnLi90b1N0cmluZycpO1xuXG4vKipcbiAqIENhc3RzIGB2YWx1ZWAgdG8gYSBwYXRoIGFycmF5IGlmIGl0J3Mgbm90IG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5IGtleXMgb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGNhc3QgcHJvcGVydHkgcGF0aCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gY2FzdFBhdGgodmFsdWUsIG9iamVjdCkge1xuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIGlzS2V5KHZhbHVlLCBvYmplY3QpID8gW3ZhbHVlXSA6IHN0cmluZ1RvUGF0aCh0b1N0cmluZyh2YWx1ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNhc3RQYXRoO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvdmVycmVhY2hpbmcgY29yZS1qcyBzaGltcy4gKi9cbnZhciBjb3JlSnNEYXRhID0gcm9vdFsnX19jb3JlLWpzX3NoYXJlZF9fJ107XG5cbm1vZHVsZS5leHBvcnRzID0gY29yZUpzRGF0YTtcbiIsInZhciBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgYGJhc2VFYWNoYCBvciBgYmFzZUVhY2hSaWdodGAgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVhY2hGdW5jIFRoZSBmdW5jdGlvbiB0byBpdGVyYXRlIG92ZXIgYSBjb2xsZWN0aW9uLlxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBiYXNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVCYXNlRWFjaChlYWNoRnVuYywgZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICAgIGlmIChjb2xsZWN0aW9uID09IG51bGwpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICAgIH1cbiAgICBpZiAoIWlzQXJyYXlMaWtlKGNvbGxlY3Rpb24pKSB7XG4gICAgICByZXR1cm4gZWFjaEZ1bmMoY29sbGVjdGlvbiwgaXRlcmF0ZWUpO1xuICAgIH1cbiAgICB2YXIgbGVuZ3RoID0gY29sbGVjdGlvbi5sZW5ndGgsXG4gICAgICAgIGluZGV4ID0gZnJvbVJpZ2h0ID8gbGVuZ3RoIDogLTEsXG4gICAgICAgIGl0ZXJhYmxlID0gT2JqZWN0KGNvbGxlY3Rpb24pO1xuXG4gICAgd2hpbGUgKChmcm9tUmlnaHQgPyBpbmRleC0tIDogKytpbmRleCA8IGxlbmd0aCkpIHtcbiAgICAgIGlmIChpdGVyYXRlZShpdGVyYWJsZVtpbmRleF0sIGluZGV4LCBpdGVyYWJsZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCYXNlRWFjaDtcbiIsIi8qKlxuICogQ3JlYXRlcyBhIGJhc2UgZnVuY3Rpb24gZm9yIG1ldGhvZHMgbGlrZSBgXy5mb3JJbmAgYW5kIGBfLmZvck93bmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmFzZUZvcihmcm9tUmlnaHQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCwgaXRlcmF0ZWUsIGtleXNGdW5jKSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGl0ZXJhYmxlID0gT2JqZWN0KG9iamVjdCksXG4gICAgICAgIHByb3BzID0ga2V5c0Z1bmMob2JqZWN0KSxcbiAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICB2YXIga2V5ID0gcHJvcHNbZnJvbVJpZ2h0ID8gbGVuZ3RoIDogKytpbmRleF07XG4gICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVba2V5XSwga2V5LCBpdGVyYWJsZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJhc2VGb3I7XG4iLCJ2YXIgYmFzZUl0ZXJhdGVlID0gcmVxdWlyZSgnLi9fYmFzZUl0ZXJhdGVlJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBgXy5maW5kYCBvciBgXy5maW5kTGFzdGAgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZpbmRJbmRleEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGZpbmQgdGhlIGNvbGxlY3Rpb24gaW5kZXguXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmaW5kIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVGaW5kKGZpbmRJbmRleEZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGNvbGxlY3Rpb24sIHByZWRpY2F0ZSwgZnJvbUluZGV4KSB7XG4gICAgdmFyIGl0ZXJhYmxlID0gT2JqZWN0KGNvbGxlY3Rpb24pO1xuICAgIGlmICghaXNBcnJheUxpa2UoY29sbGVjdGlvbikpIHtcbiAgICAgIHZhciBpdGVyYXRlZSA9IGJhc2VJdGVyYXRlZShwcmVkaWNhdGUsIDMpO1xuICAgICAgY29sbGVjdGlvbiA9IGtleXMoY29sbGVjdGlvbik7XG4gICAgICBwcmVkaWNhdGUgPSBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIGl0ZXJhdGVlKGl0ZXJhYmxlW2tleV0sIGtleSwgaXRlcmFibGUpOyB9O1xuICAgIH1cbiAgICB2YXIgaW5kZXggPSBmaW5kSW5kZXhGdW5jKGNvbGxlY3Rpb24sIHByZWRpY2F0ZSwgZnJvbUluZGV4KTtcbiAgICByZXR1cm4gaW5kZXggPiAtMSA/IGl0ZXJhYmxlW2l0ZXJhdGVlID8gY29sbGVjdGlvbltpbmRleF0gOiBpbmRleF0gOiB1bmRlZmluZWQ7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlRmluZDtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKTtcblxudmFyIGRlZmluZVByb3BlcnR5ID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIHZhciBmdW5jID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2RlZmluZVByb3BlcnR5Jyk7XG4gICAgZnVuYyh7fSwgJycsIHt9KTtcbiAgICByZXR1cm4gZnVuYztcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmaW5lUHJvcGVydHk7XG4iLCJ2YXIgU2V0Q2FjaGUgPSByZXF1aXJlKCcuL19TZXRDYWNoZScpLFxuICAgIGFycmF5U29tZSA9IHJlcXVpcmUoJy4vX2FycmF5U29tZScpLFxuICAgIGNhY2hlSGFzID0gcmVxdWlyZSgnLi9fY2FjaGVIYXMnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgdmFsdWUgY29tcGFyaXNvbnMuICovXG52YXIgQ09NUEFSRV9QQVJUSUFMX0ZMQUcgPSAxLFxuICAgIENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcgPSAyO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3IgYXJyYXlzIHdpdGggc3VwcG9ydCBmb3JcbiAqIHBhcnRpYWwgZGVlcCBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge0FycmF5fSBvdGhlciBUaGUgb3RoZXIgYXJyYXkgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYGFycmF5YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcnJheXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxBcnJheXMoYXJyYXksIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHZhciBpc1BhcnRpYWwgPSBiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUcsXG4gICAgICBhcnJMZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBvdGhMZW5ndGggPSBvdGhlci5sZW5ndGg7XG5cbiAgaWYgKGFyckxlbmd0aCAhPSBvdGhMZW5ndGggJiYgIShpc1BhcnRpYWwgJiYgb3RoTGVuZ3RoID4gYXJyTGVuZ3RoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KGFycmF5KTtcbiAgaWYgKHN0YWNrZWQgJiYgc3RhY2suZ2V0KG90aGVyKSkge1xuICAgIHJldHVybiBzdGFja2VkID09IG90aGVyO1xuICB9XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gdHJ1ZSxcbiAgICAgIHNlZW4gPSAoYml0bWFzayAmIENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcpID8gbmV3IFNldENhY2hlIDogdW5kZWZpbmVkO1xuXG4gIHN0YWNrLnNldChhcnJheSwgb3RoZXIpO1xuICBzdGFjay5zZXQob3RoZXIsIGFycmF5KTtcblxuICAvLyBJZ25vcmUgbm9uLWluZGV4IHByb3BlcnRpZXMuXG4gIHdoaWxlICgrK2luZGV4IDwgYXJyTGVuZ3RoKSB7XG4gICAgdmFyIGFyclZhbHVlID0gYXJyYXlbaW5kZXhdLFxuICAgICAgICBvdGhWYWx1ZSA9IG90aGVyW2luZGV4XTtcblxuICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICB2YXIgY29tcGFyZWQgPSBpc1BhcnRpYWxcbiAgICAgICAgPyBjdXN0b21pemVyKG90aFZhbHVlLCBhcnJWYWx1ZSwgaW5kZXgsIG90aGVyLCBhcnJheSwgc3RhY2spXG4gICAgICAgIDogY3VzdG9taXplcihhcnJWYWx1ZSwgb3RoVmFsdWUsIGluZGV4LCBhcnJheSwgb3RoZXIsIHN0YWNrKTtcbiAgICB9XG4gICAgaWYgKGNvbXBhcmVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChjb21wYXJlZCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgaWYgKHNlZW4pIHtcbiAgICAgIGlmICghYXJyYXlTb21lKG90aGVyLCBmdW5jdGlvbihvdGhWYWx1ZSwgb3RoSW5kZXgpIHtcbiAgICAgICAgICAgIGlmICghY2FjaGVIYXMoc2Vlbiwgb3RoSW5kZXgpICYmXG4gICAgICAgICAgICAgICAgKGFyclZhbHVlID09PSBvdGhWYWx1ZSB8fCBlcXVhbEZ1bmMoYXJyVmFsdWUsIG90aFZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaykpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzZWVuLnB1c2gob3RoSW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pKSB7XG4gICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCEoXG4gICAgICAgICAgYXJyVmFsdWUgPT09IG90aFZhbHVlIHx8XG4gICAgICAgICAgICBlcXVhbEZ1bmMoYXJyVmFsdWUsIG90aFZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaylcbiAgICAgICAgKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgc3RhY2tbJ2RlbGV0ZSddKGFycmF5KTtcbiAgc3RhY2tbJ2RlbGV0ZSddKG90aGVyKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlcXVhbEFycmF5cztcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBVaW50OEFycmF5ID0gcmVxdWlyZSgnLi9fVWludDhBcnJheScpLFxuICAgIGVxID0gcmVxdWlyZSgnLi9lcScpLFxuICAgIGVxdWFsQXJyYXlzID0gcmVxdWlyZSgnLi9fZXF1YWxBcnJheXMnKSxcbiAgICBtYXBUb0FycmF5ID0gcmVxdWlyZSgnLi9fbWFwVG9BcnJheScpLFxuICAgIHNldFRvQXJyYXkgPSByZXF1aXJlKCcuL19zZXRUb0FycmF5Jyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHZhbHVlIGNvbXBhcmlzb25zLiAqL1xudmFyIENPTVBBUkVfUEFSVElBTF9GTEFHID0gMSxcbiAgICBDT01QQVJFX1VOT1JERVJFRF9GTEFHID0gMjtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nO1xuXG4vKiogVXNlZCB0byBjb252ZXJ0IHN5bWJvbHMgdG8gcHJpbWl0aXZlcyBhbmQgc3RyaW5ncy4gKi9cbnZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG4gICAgc3ltYm9sVmFsdWVPZiA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udmFsdWVPZiA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIGNvbXBhcmluZyBvYmplY3RzIG9mXG4gKiB0aGUgc2FtZSBgdG9TdHJpbmdUYWdgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIG9ubHkgc3VwcG9ydHMgY29tcGFyaW5nIHZhbHVlcyB3aXRoIHRhZ3Mgb2ZcbiAqIGBCb29sZWFuYCwgYERhdGVgLCBgRXJyb3JgLCBgTnVtYmVyYCwgYFJlZ0V4cGAsIG9yIGBTdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFnIFRoZSBgdG9TdHJpbmdUYWdgIG9mIHRoZSBvYmplY3RzIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBvYmplY3RgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxCeVRhZyhvYmplY3QsIG90aGVyLCB0YWcsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgc3dpdGNoICh0YWcpIHtcbiAgICBjYXNlIGRhdGFWaWV3VGFnOlxuICAgICAgaWYgKChvYmplY3QuYnl0ZUxlbmd0aCAhPSBvdGhlci5ieXRlTGVuZ3RoKSB8fFxuICAgICAgICAgIChvYmplY3QuYnl0ZU9mZnNldCAhPSBvdGhlci5ieXRlT2Zmc2V0KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBvYmplY3QgPSBvYmplY3QuYnVmZmVyO1xuICAgICAgb3RoZXIgPSBvdGhlci5idWZmZXI7XG5cbiAgICBjYXNlIGFycmF5QnVmZmVyVGFnOlxuICAgICAgaWYgKChvYmplY3QuYnl0ZUxlbmd0aCAhPSBvdGhlci5ieXRlTGVuZ3RoKSB8fFxuICAgICAgICAgICFlcXVhbEZ1bmMobmV3IFVpbnQ4QXJyYXkob2JqZWN0KSwgbmV3IFVpbnQ4QXJyYXkob3RoZXIpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIGNhc2UgYm9vbFRhZzpcbiAgICBjYXNlIGRhdGVUYWc6XG4gICAgY2FzZSBudW1iZXJUYWc6XG4gICAgICAvLyBDb2VyY2UgYm9vbGVhbnMgdG8gYDFgIG9yIGAwYCBhbmQgZGF0ZXMgdG8gbWlsbGlzZWNvbmRzLlxuICAgICAgLy8gSW52YWxpZCBkYXRlcyBhcmUgY29lcmNlZCB0byBgTmFOYC5cbiAgICAgIHJldHVybiBlcSgrb2JqZWN0LCArb3RoZXIpO1xuXG4gICAgY2FzZSBlcnJvclRhZzpcbiAgICAgIHJldHVybiBvYmplY3QubmFtZSA9PSBvdGhlci5uYW1lICYmIG9iamVjdC5tZXNzYWdlID09IG90aGVyLm1lc3NhZ2U7XG5cbiAgICBjYXNlIHJlZ2V4cFRhZzpcbiAgICBjYXNlIHN0cmluZ1RhZzpcbiAgICAgIC8vIENvZXJjZSByZWdleGVzIHRvIHN0cmluZ3MgYW5kIHRyZWF0IHN0cmluZ3MsIHByaW1pdGl2ZXMgYW5kIG9iamVjdHMsXG4gICAgICAvLyBhcyBlcXVhbC4gU2VlIGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1yZWdleHAucHJvdG90eXBlLnRvc3RyaW5nXG4gICAgICAvLyBmb3IgbW9yZSBkZXRhaWxzLlxuICAgICAgcmV0dXJuIG9iamVjdCA9PSAob3RoZXIgKyAnJyk7XG5cbiAgICBjYXNlIG1hcFRhZzpcbiAgICAgIHZhciBjb252ZXJ0ID0gbWFwVG9BcnJheTtcblxuICAgIGNhc2Ugc2V0VGFnOlxuICAgICAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRztcbiAgICAgIGNvbnZlcnQgfHwgKGNvbnZlcnQgPSBzZXRUb0FycmF5KTtcblxuICAgICAgaWYgKG9iamVjdC5zaXplICE9IG90aGVyLnNpemUgJiYgIWlzUGFydGlhbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gICAgICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldChvYmplY3QpO1xuICAgICAgaWYgKHN0YWNrZWQpIHtcbiAgICAgICAgcmV0dXJuIHN0YWNrZWQgPT0gb3RoZXI7XG4gICAgICB9XG4gICAgICBiaXRtYXNrIHw9IENPTVBBUkVfVU5PUkRFUkVEX0ZMQUc7XG5cbiAgICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgICAgc3RhY2suc2V0KG9iamVjdCwgb3RoZXIpO1xuICAgICAgdmFyIHJlc3VsdCA9IGVxdWFsQXJyYXlzKGNvbnZlcnQob2JqZWN0KSwgY29udmVydChvdGhlciksIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spO1xuICAgICAgc3RhY2tbJ2RlbGV0ZSddKG9iamVjdCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuXG4gICAgY2FzZSBzeW1ib2xUYWc6XG4gICAgICBpZiAoc3ltYm9sVmFsdWVPZikge1xuICAgICAgICByZXR1cm4gc3ltYm9sVmFsdWVPZi5jYWxsKG9iamVjdCkgPT0gc3ltYm9sVmFsdWVPZi5jYWxsKG90aGVyKTtcbiAgICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXF1YWxCeVRhZztcbiIsInZhciBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHZhbHVlIGNvbXBhcmlzb25zLiAqL1xudmFyIENPTVBBUkVfUEFSVElBTF9GTEFHID0gMTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIG9iamVjdHMgd2l0aCBzdXBwb3J0IGZvclxuICogcGFydGlhbCBkZWVwIGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBvYmplY3RgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxPYmplY3RzKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRyxcbiAgICAgIG9ialByb3BzID0ga2V5cyhvYmplY3QpLFxuICAgICAgb2JqTGVuZ3RoID0gb2JqUHJvcHMubGVuZ3RoLFxuICAgICAgb3RoUHJvcHMgPSBrZXlzKG90aGVyKSxcbiAgICAgIG90aExlbmd0aCA9IG90aFByb3BzLmxlbmd0aDtcblxuICBpZiAob2JqTGVuZ3RoICE9IG90aExlbmd0aCAmJiAhaXNQYXJ0aWFsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBpbmRleCA9IG9iakxlbmd0aDtcbiAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICB2YXIga2V5ID0gb2JqUHJvcHNbaW5kZXhdO1xuICAgIGlmICghKGlzUGFydGlhbCA/IGtleSBpbiBvdGhlciA6IGhhc093blByb3BlcnR5LmNhbGwob3RoZXIsIGtleSkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIC8vIEFzc3VtZSBjeWNsaWMgdmFsdWVzIGFyZSBlcXVhbC5cbiAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQob2JqZWN0KTtcbiAgaWYgKHN0YWNrZWQgJiYgc3RhY2suZ2V0KG90aGVyKSkge1xuICAgIHJldHVybiBzdGFja2VkID09IG90aGVyO1xuICB9XG4gIHZhciByZXN1bHQgPSB0cnVlO1xuICBzdGFjay5zZXQob2JqZWN0LCBvdGhlcik7XG4gIHN0YWNrLnNldChvdGhlciwgb2JqZWN0KTtcblxuICB2YXIgc2tpcEN0b3IgPSBpc1BhcnRpYWw7XG4gIHdoaWxlICgrK2luZGV4IDwgb2JqTGVuZ3RoKSB7XG4gICAga2V5ID0gb2JqUHJvcHNbaW5kZXhdO1xuICAgIHZhciBvYmpWYWx1ZSA9IG9iamVjdFtrZXldLFxuICAgICAgICBvdGhWYWx1ZSA9IG90aGVyW2tleV07XG5cbiAgICBpZiAoY3VzdG9taXplcikge1xuICAgICAgdmFyIGNvbXBhcmVkID0gaXNQYXJ0aWFsXG4gICAgICAgID8gY3VzdG9taXplcihvdGhWYWx1ZSwgb2JqVmFsdWUsIGtleSwgb3RoZXIsIG9iamVjdCwgc3RhY2spXG4gICAgICAgIDogY3VzdG9taXplcihvYmpWYWx1ZSwgb3RoVmFsdWUsIGtleSwgb2JqZWN0LCBvdGhlciwgc3RhY2spO1xuICAgIH1cbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICBpZiAoIShjb21wYXJlZCA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgPyAob2JqVmFsdWUgPT09IG90aFZhbHVlIHx8IGVxdWFsRnVuYyhvYmpWYWx1ZSwgb3RoVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKSlcbiAgICAgICAgICA6IGNvbXBhcmVkXG4gICAgICAgICkpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHNraXBDdG9yIHx8IChza2lwQ3RvciA9IGtleSA9PSAnY29uc3RydWN0b3InKTtcbiAgfVxuICBpZiAocmVzdWx0ICYmICFza2lwQ3Rvcikge1xuICAgIHZhciBvYmpDdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yLFxuICAgICAgICBvdGhDdG9yID0gb3RoZXIuY29uc3RydWN0b3I7XG5cbiAgICAvLyBOb24gYE9iamVjdGAgb2JqZWN0IGluc3RhbmNlcyB3aXRoIGRpZmZlcmVudCBjb25zdHJ1Y3RvcnMgYXJlIG5vdCBlcXVhbC5cbiAgICBpZiAob2JqQ3RvciAhPSBvdGhDdG9yICYmXG4gICAgICAgICgnY29uc3RydWN0b3InIGluIG9iamVjdCAmJiAnY29uc3RydWN0b3InIGluIG90aGVyKSAmJlxuICAgICAgICAhKHR5cGVvZiBvYmpDdG9yID09ICdmdW5jdGlvbicgJiYgb2JqQ3RvciBpbnN0YW5jZW9mIG9iakN0b3IgJiZcbiAgICAgICAgICB0eXBlb2Ygb3RoQ3RvciA9PSAnZnVuY3Rpb24nICYmIG90aEN0b3IgaW5zdGFuY2VvZiBvdGhDdG9yKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIHN0YWNrWydkZWxldGUnXShvYmplY3QpO1xuICBzdGFja1snZGVsZXRlJ10ob3RoZXIpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxdWFsT2JqZWN0cztcbiIsInZhciBmbGF0dGVuID0gcmVxdWlyZSgnLi9mbGF0dGVuJyksXG4gICAgb3ZlclJlc3QgPSByZXF1aXJlKCcuL19vdmVyUmVzdCcpLFxuICAgIHNldFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fc2V0VG9TdHJpbmcnKTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VSZXN0YCB3aGljaCBmbGF0dGVucyB0aGUgcmVzdCBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBmbGF0UmVzdChmdW5jKSB7XG4gIHJldHVybiBzZXRUb1N0cmluZyhvdmVyUmVzdChmdW5jLCB1bmRlZmluZWQsIGZsYXR0ZW4pLCBmdW5jICsgJycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZsYXRSZXN0O1xuIiwiLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxubW9kdWxlLmV4cG9ydHMgPSBmcmVlR2xvYmFsO1xuIiwidmFyIGlzS2V5YWJsZSA9IHJlcXVpcmUoJy4vX2lzS2V5YWJsZScpO1xuXG4vKipcbiAqIEdldHMgdGhlIGRhdGEgZm9yIGBtYXBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSByZWZlcmVuY2Uga2V5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIG1hcCBkYXRhLlxuICovXG5mdW5jdGlvbiBnZXRNYXBEYXRhKG1hcCwga2V5KSB7XG4gIHZhciBkYXRhID0gbWFwLl9fZGF0YV9fO1xuICByZXR1cm4gaXNLZXlhYmxlKGtleSlcbiAgICA/IGRhdGFbdHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/ICdzdHJpbmcnIDogJ2hhc2gnXVxuICAgIDogZGF0YS5tYXA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TWFwRGF0YTtcbiIsInZhciBpc1N0cmljdENvbXBhcmFibGUgPSByZXF1aXJlKCcuL19pc1N0cmljdENvbXBhcmFibGUnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgcHJvcGVydHkgbmFtZXMsIHZhbHVlcywgYW5kIGNvbXBhcmUgZmxhZ3Mgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbWF0Y2ggZGF0YSBvZiBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gZ2V0TWF0Y2hEYXRhKG9iamVjdCkge1xuICB2YXIgcmVzdWx0ID0ga2V5cyhvYmplY3QpLFxuICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcblxuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICB2YXIga2V5ID0gcmVzdWx0W2xlbmd0aF0sXG4gICAgICAgIHZhbHVlID0gb2JqZWN0W2tleV07XG5cbiAgICByZXN1bHRbbGVuZ3RoXSA9IFtrZXksIHZhbHVlLCBpc1N0cmljdENvbXBhcmFibGUodmFsdWUpXTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldE1hdGNoRGF0YTtcbiIsInZhciBiYXNlSXNOYXRpdmUgPSByZXF1aXJlKCcuL19iYXNlSXNOYXRpdmUnKSxcbiAgICBnZXRWYWx1ZSA9IHJlcXVpcmUoJy4vX2dldFZhbHVlJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBnZXRWYWx1ZShvYmplY3QsIGtleSk7XG4gIHJldHVybiBiYXNlSXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TmF0aXZlO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UmF3VGFnO1xuIiwidmFyIERhdGFWaWV3ID0gcmVxdWlyZSgnLi9fRGF0YVZpZXcnKSxcbiAgICBNYXAgPSByZXF1aXJlKCcuL19NYXAnKSxcbiAgICBQcm9taXNlID0gcmVxdWlyZSgnLi9fUHJvbWlzZScpLFxuICAgIFNldCA9IHJlcXVpcmUoJy4vX1NldCcpLFxuICAgIFdlYWtNYXAgPSByZXF1aXJlKCcuL19XZWFrTWFwJyksXG4gICAgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICB0b1NvdXJjZSA9IHJlcXVpcmUoJy4vX3RvU291cmNlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICBwcm9taXNlVGFnID0gJ1tvYmplY3QgUHJvbWlzZV0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XSc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtYXBzLCBzZXRzLCBhbmQgd2Vha21hcHMuICovXG52YXIgZGF0YVZpZXdDdG9yU3RyaW5nID0gdG9Tb3VyY2UoRGF0YVZpZXcpLFxuICAgIG1hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShNYXApLFxuICAgIHByb21pc2VDdG9yU3RyaW5nID0gdG9Tb3VyY2UoUHJvbWlzZSksXG4gICAgc2V0Q3RvclN0cmluZyA9IHRvU291cmNlKFNldCksXG4gICAgd2Vha01hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShXZWFrTWFwKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBgdG9TdHJpbmdUYWdgIG9mIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xudmFyIGdldFRhZyA9IGJhc2VHZXRUYWc7XG5cbi8vIEZhbGxiYWNrIGZvciBkYXRhIHZpZXdzLCBtYXBzLCBzZXRzLCBhbmQgd2VhayBtYXBzIGluIElFIDExIGFuZCBwcm9taXNlcyBpbiBOb2RlLmpzIDwgNi5cbmlmICgoRGF0YVZpZXcgJiYgZ2V0VGFnKG5ldyBEYXRhVmlldyhuZXcgQXJyYXlCdWZmZXIoMSkpKSAhPSBkYXRhVmlld1RhZykgfHxcbiAgICAoTWFwICYmIGdldFRhZyhuZXcgTWFwKSAhPSBtYXBUYWcpIHx8XG4gICAgKFByb21pc2UgJiYgZ2V0VGFnKFByb21pc2UucmVzb2x2ZSgpKSAhPSBwcm9taXNlVGFnKSB8fFxuICAgIChTZXQgJiYgZ2V0VGFnKG5ldyBTZXQpICE9IHNldFRhZykgfHxcbiAgICAoV2Vha01hcCAmJiBnZXRUYWcobmV3IFdlYWtNYXApICE9IHdlYWtNYXBUYWcpKSB7XG4gIGdldFRhZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGJhc2VHZXRUYWcodmFsdWUpLFxuICAgICAgICBDdG9yID0gcmVzdWx0ID09IG9iamVjdFRhZyA/IHZhbHVlLmNvbnN0cnVjdG9yIDogdW5kZWZpbmVkLFxuICAgICAgICBjdG9yU3RyaW5nID0gQ3RvciA/IHRvU291cmNlKEN0b3IpIDogJyc7XG5cbiAgICBpZiAoY3RvclN0cmluZykge1xuICAgICAgc3dpdGNoIChjdG9yU3RyaW5nKSB7XG4gICAgICAgIGNhc2UgZGF0YVZpZXdDdG9yU3RyaW5nOiByZXR1cm4gZGF0YVZpZXdUYWc7XG4gICAgICAgIGNhc2UgbWFwQ3RvclN0cmluZzogcmV0dXJuIG1hcFRhZztcbiAgICAgICAgY2FzZSBwcm9taXNlQ3RvclN0cmluZzogcmV0dXJuIHByb21pc2VUYWc7XG4gICAgICAgIGNhc2Ugc2V0Q3RvclN0cmluZzogcmV0dXJuIHNldFRhZztcbiAgICAgICAgY2FzZSB3ZWFrTWFwQ3RvclN0cmluZzogcmV0dXJuIHdlYWtNYXBUYWc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VGFnO1xuIiwiLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0VmFsdWUob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VmFsdWU7XG4iLCJ2YXIgY2FzdFBhdGggPSByZXF1aXJlKCcuL19jYXN0UGF0aCcpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi9faXNJbmRleCcpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpLFxuICAgIHRvS2V5ID0gcmVxdWlyZSgnLi9fdG9LZXknKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHBhdGhgIGV4aXN0cyBvbiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggdG8gY2hlY2suXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYXNGdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjayBwcm9wZXJ0aWVzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBwYXRoYCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzUGF0aChvYmplY3QsIHBhdGgsIGhhc0Z1bmMpIHtcbiAgcGF0aCA9IGNhc3RQYXRoKHBhdGgsIG9iamVjdCk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwYXRoLmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHRvS2V5KHBhdGhbaW5kZXhdKTtcbiAgICBpZiAoIShyZXN1bHQgPSBvYmplY3QgIT0gbnVsbCAmJiBoYXNGdW5jKG9iamVjdCwga2V5KSkpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBvYmplY3QgPSBvYmplY3Rba2V5XTtcbiAgfVxuICBpZiAocmVzdWx0IHx8ICsraW5kZXggIT0gbGVuZ3RoKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBsZW5ndGggPSBvYmplY3QgPT0gbnVsbCA/IDAgOiBvYmplY3QubGVuZ3RoO1xuICByZXR1cm4gISFsZW5ndGggJiYgaXNMZW5ndGgobGVuZ3RoKSAmJiBpc0luZGV4KGtleSwgbGVuZ3RoKSAmJlxuICAgIChpc0FycmF5KG9iamVjdCkgfHwgaXNBcmd1bWVudHMob2JqZWN0KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzUGF0aDtcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIEhhc2hcbiAqL1xuZnVuY3Rpb24gaGFzaENsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gbmF0aXZlQ3JlYXRlID8gbmF0aXZlQ3JlYXRlKG51bGwpIDoge307XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaENsZWFyO1xuIiwiLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtPYmplY3R9IGhhc2ggVGhlIGhhc2ggdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSB0aGlzLmhhcyhrZXkpICYmIGRlbGV0ZSB0aGlzLl9fZGF0YV9fW2tleV07XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoRGVsZXRlO1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogR2V0cyB0aGUgaGFzaCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBoYXNoR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChuYXRpdmVDcmVhdGUpIHtcbiAgICB2YXIgcmVzdWx0ID0gZGF0YVtrZXldO1xuICAgIHJldHVybiByZXN1bHQgPT09IEhBU0hfVU5ERUZJTkVEID8gdW5kZWZpbmVkIDogcmVzdWx0O1xuICB9XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSkgPyBkYXRhW2tleV0gOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaEdldDtcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBoYXNoIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoSGFzKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHJldHVybiBuYXRpdmVDcmVhdGUgPyBkYXRhW2tleV0gIT09IHVuZGVmaW5lZCA6IGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoSGFzO1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKlxuICogU2V0cyB0aGUgaGFzaCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGhhc2ggaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGhhc2hTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHRoaXMuc2l6ZSArPSB0aGlzLmhhcyhrZXkpID8gMCA6IDE7XG4gIGRhdGFba2V5XSA9IChuYXRpdmVDcmVhdGUgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkgPyBIQVNIX1VOREVGSU5FRCA6IHZhbHVlO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoU2V0O1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ByZWFkYWJsZVN5bWJvbCA9IFN5bWJvbCA/IFN5bWJvbC5pc0NvbmNhdFNwcmVhZGFibGUgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBmbGF0dGVuYWJsZSBgYXJndW1lbnRzYCBvYmplY3Qgb3IgYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgZmxhdHRlbmFibGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNGbGF0dGVuYWJsZSh2YWx1ZSkge1xuICByZXR1cm4gaXNBcnJheSh2YWx1ZSkgfHwgaXNBcmd1bWVudHModmFsdWUpIHx8XG4gICAgISEoc3ByZWFkYWJsZVN5bWJvbCAmJiB2YWx1ZSAmJiB2YWx1ZVtzcHJlYWRhYmxlU3ltYm9sXSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGbGF0dGVuYWJsZTtcbiIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgdW5zaWduZWQgaW50ZWdlciB2YWx1ZXMuICovXG52YXIgcmVJc1VpbnQgPSAvXig/OjB8WzEtOV1cXGQqKSQvO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiAhIWxlbmd0aCAmJlxuICAgICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgfHwgcmVJc1VpbnQudGVzdCh2YWx1ZSkpICYmXG4gICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSW5kZXg7XG4iLCJ2YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzU3ltYm9sID0gcmVxdWlyZSgnLi9pc1N5bWJvbCcpO1xuXG4vKiogVXNlZCB0byBtYXRjaCBwcm9wZXJ0eSBuYW1lcyB3aXRoaW4gcHJvcGVydHkgcGF0aHMuICovXG52YXIgcmVJc0RlZXBQcm9wID0gL1xcLnxcXFsoPzpbXltcXF1dKnwoW1wiJ10pKD86KD8hXFwxKVteXFxcXF18XFxcXC4pKj9cXDEpXFxdLyxcbiAgICByZUlzUGxhaW5Qcm9wID0gL15cXHcqJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBwcm9wZXJ0eSBuYW1lIGFuZCBub3QgYSBwcm9wZXJ0eSBwYXRoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5IGtleXMgb24uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3BlcnR5IG5hbWUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXkodmFsdWUsIG9iamVjdCkge1xuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIGlmICh0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicgfHxcbiAgICAgIHZhbHVlID09IG51bGwgfHwgaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIHJlSXNQbGFpblByb3AudGVzdCh2YWx1ZSkgfHwgIXJlSXNEZWVwUHJvcC50ZXN0KHZhbHVlKSB8fFxuICAgIChvYmplY3QgIT0gbnVsbCAmJiB2YWx1ZSBpbiBPYmplY3Qob2JqZWN0KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNLZXk7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciB1c2UgYXMgdW5pcXVlIG9iamVjdCBrZXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXlhYmxlKHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gKHR5cGUgPT0gJ3N0cmluZycgfHwgdHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nKVxuICAgID8gKHZhbHVlICE9PSAnX19wcm90b19fJylcbiAgICA6ICh2YWx1ZSA9PT0gbnVsbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNLZXlhYmxlO1xuIiwidmFyIGNvcmVKc0RhdGEgPSByZXF1aXJlKCcuL19jb3JlSnNEYXRhJyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtZXRob2RzIG1hc3F1ZXJhZGluZyBhcyBuYXRpdmUuICovXG52YXIgbWFza1NyY0tleSA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHVpZCA9IC9bXi5dKyQvLmV4ZWMoY29yZUpzRGF0YSAmJiBjb3JlSnNEYXRhLmtleXMgJiYgY29yZUpzRGF0YS5rZXlzLklFX1BST1RPIHx8ICcnKTtcbiAgcmV0dXJuIHVpZCA/ICgnU3ltYm9sKHNyYylfMS4nICsgdWlkKSA6ICcnO1xufSgpKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYGZ1bmNgIGhhcyBpdHMgc291cmNlIG1hc2tlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGZ1bmNgIGlzIG1hc2tlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc01hc2tlZChmdW5jKSB7XG4gIHJldHVybiAhIW1hc2tTcmNLZXkgJiYgKG1hc2tTcmNLZXkgaW4gZnVuYyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNNYXNrZWQ7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhIHByb3RvdHlwZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm90b3R5cGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNQcm90b3R5cGUodmFsdWUpIHtcbiAgdmFyIEN0b3IgPSB2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvcixcbiAgICAgIHByb3RvID0gKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUpIHx8IG9iamVjdFByb3RvO1xuXG4gIHJldHVybiB2YWx1ZSA9PT0gcHJvdG87XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNQcm90b3R5cGU7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUgZm9yIHN0cmljdCBlcXVhbGl0eSBjb21wYXJpc29ucywgaS5lLiBgPT09YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpZiBzdWl0YWJsZSBmb3Igc3RyaWN0XG4gKiAgZXF1YWxpdHkgY29tcGFyaXNvbnMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNTdHJpY3RDb21wYXJhYmxlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgJiYgIWlzT2JqZWN0KHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1N0cmljdENvbXBhcmFibGU7XG4iLCIvKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUNsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gW107XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlQ2xlYXI7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzcGxpY2UgPSBhcnJheVByb3RvLnNwbGljZTtcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGxhc3RJbmRleCA9IGRhdGEubGVuZ3RoIC0gMTtcbiAgaWYgKGluZGV4ID09IGxhc3RJbmRleCkge1xuICAgIGRhdGEucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgc3BsaWNlLmNhbGwoZGF0YSwgaW5kZXgsIDEpO1xuICB9XG4gIC0tdGhpcy5zaXplO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVEZWxldGU7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICByZXR1cm4gaW5kZXggPCAwID8gdW5kZWZpbmVkIDogZGF0YVtpbmRleF1bMV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlR2V0O1xuIiwidmFyIGFzc29jSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Fzc29jSW5kZXhPZicpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gYXNzb2NJbmRleE9mKHRoaXMuX19kYXRhX18sIGtleSkgPiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVIYXM7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogU2V0cyB0aGUgbGlzdCBjYWNoZSBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbGlzdCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgKyt0aGlzLnNpemU7XG4gICAgZGF0YS5wdXNoKFtrZXksIHZhbHVlXSk7XG4gIH0gZWxzZSB7XG4gICAgZGF0YVtpbmRleF1bMV0gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVTZXQ7XG4iLCJ2YXIgSGFzaCA9IHJlcXVpcmUoJy4vX0hhc2gnKSxcbiAgICBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKSxcbiAgICBNYXAgPSByZXF1aXJlKCcuL19NYXAnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVDbGVhcigpIHtcbiAgdGhpcy5zaXplID0gMDtcbiAgdGhpcy5fX2RhdGFfXyA9IHtcbiAgICAnaGFzaCc6IG5ldyBIYXNoLFxuICAgICdtYXAnOiBuZXcgKE1hcCB8fCBMaXN0Q2FjaGUpLFxuICAgICdzdHJpbmcnOiBuZXcgSGFzaFxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlQ2xlYXI7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpWydkZWxldGUnXShrZXkpO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVEZWxldGU7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBtYXAgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlR2V0KGtleSkge1xuICByZXR1cm4gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLmdldChrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlR2V0O1xuIiwidmFyIGdldE1hcERhdGEgPSByZXF1aXJlKCcuL19nZXRNYXBEYXRhJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbWFwIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuaGFzKGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVIYXM7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBTZXRzIHRoZSBtYXAgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbWFwIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLFxuICAgICAgc2l6ZSA9IGRhdGEuc2l6ZTtcblxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplICs9IGRhdGEuc2l6ZSA9PSBzaXplID8gMCA6IDE7XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlU2V0O1xuIiwiLyoqXG4gKiBDb252ZXJ0cyBgbWFwYCB0byBpdHMga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUga2V5LXZhbHVlIHBhaXJzLlxuICovXG5mdW5jdGlvbiBtYXBUb0FycmF5KG1hcCkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG1hcC5zaXplKTtcblxuICBtYXAuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gW2tleSwgdmFsdWVdO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBUb0FycmF5O1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYG1hdGNoZXNQcm9wZXJ0eWAgZm9yIHNvdXJjZSB2YWx1ZXMgc3VpdGFibGVcbiAqIGZvciBzdHJpY3QgZXF1YWxpdHkgY29tcGFyaXNvbnMsIGkuZS4gYD09PWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHBhcmFtIHsqfSBzcmNWYWx1ZSBUaGUgdmFsdWUgdG8gbWF0Y2guXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBzcGVjIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBtYXRjaGVzU3RyaWN0Q29tcGFyYWJsZShrZXksIHNyY1ZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdFtrZXldID09PSBzcmNWYWx1ZSAmJlxuICAgICAgKHNyY1ZhbHVlICE9PSB1bmRlZmluZWQgfHwgKGtleSBpbiBPYmplY3Qob2JqZWN0KSkpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hdGNoZXNTdHJpY3RDb21wYXJhYmxlO1xuIiwidmFyIG1lbW9pemUgPSByZXF1aXJlKCcuL21lbW9pemUnKTtcblxuLyoqIFVzZWQgYXMgdGhlIG1heGltdW0gbWVtb2l6ZSBjYWNoZSBzaXplLiAqL1xudmFyIE1BWF9NRU1PSVpFX1NJWkUgPSA1MDA7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLm1lbW9pemVgIHdoaWNoIGNsZWFycyB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24nc1xuICogY2FjaGUgd2hlbiBpdCBleGNlZWRzIGBNQVhfTUVNT0laRV9TSVpFYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaGF2ZSBpdHMgb3V0cHV0IG1lbW9pemVkLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG1lbW9pemVDYXBwZWQoZnVuYykge1xuICB2YXIgcmVzdWx0ID0gbWVtb2l6ZShmdW5jLCBmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoY2FjaGUuc2l6ZSA9PT0gTUFYX01FTU9JWkVfU0laRSkge1xuICAgICAgY2FjaGUuY2xlYXIoKTtcbiAgICB9XG4gICAgcmV0dXJuIGtleTtcbiAgfSk7XG5cbiAgdmFyIGNhY2hlID0gcmVzdWx0LmNhY2hlO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1lbW9pemVDYXBwZWQ7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBuYXRpdmVDcmVhdGUgPSBnZXROYXRpdmUoT2JqZWN0LCAnY3JlYXRlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlQ3JlYXRlO1xuIiwidmFyIG92ZXJBcmcgPSByZXF1aXJlKCcuL19vdmVyQXJnJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVLZXlzID0gb3ZlckFyZyhPYmplY3Qua2V5cywgT2JqZWN0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBuYXRpdmVLZXlzO1xuIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBwcm9jZXNzYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZVByb2Nlc3MgPSBtb2R1bGVFeHBvcnRzICYmIGZyZWVHbG9iYWwucHJvY2VzcztcblxuLyoqIFVzZWQgdG8gYWNjZXNzIGZhc3RlciBOb2RlLmpzIGhlbHBlcnMuICovXG52YXIgbm9kZVV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGZyZWVQcm9jZXNzICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcgJiYgZnJlZVByb2Nlc3MuYmluZGluZygndXRpbCcpO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBub2RlVXRpbDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgdXNpbmcgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9iamVjdFRvU3RyaW5nO1xuIiwiLyoqXG4gKiBDcmVhdGVzIGEgdW5hcnkgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIGl0cyBhcmd1bWVudCB0cmFuc2Zvcm1lZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgYXJndW1lbnQgdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG92ZXJBcmcoZnVuYywgdHJhbnNmb3JtKSB7XG4gIHJldHVybiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gZnVuYyh0cmFuc2Zvcm0oYXJnKSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb3ZlckFyZztcbiIsInZhciBhcHBseSA9IHJlcXVpcmUoJy4vX2FwcGx5Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VSZXN0YCB3aGljaCB0cmFuc2Zvcm1zIHRoZSByZXN0IGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD1mdW5jLmxlbmd0aC0xXSBUaGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHJlc3QgcGFyYW1ldGVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSByZXN0IGFycmF5IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyUmVzdChmdW5jLCBzdGFydCwgdHJhbnNmb3JtKSB7XG4gIHN0YXJ0ID0gbmF0aXZlTWF4KHN0YXJ0ID09PSB1bmRlZmluZWQgPyAoZnVuYy5sZW5ndGggLSAxKSA6IHN0YXJ0LCAwKTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBuYXRpdmVNYXgoYXJncy5sZW5ndGggLSBzdGFydCwgMCksXG4gICAgICAgIGFycmF5ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICBhcnJheVtpbmRleF0gPSBhcmdzW3N0YXJ0ICsgaW5kZXhdO1xuICAgIH1cbiAgICBpbmRleCA9IC0xO1xuICAgIHZhciBvdGhlckFyZ3MgPSBBcnJheShzdGFydCArIDEpO1xuICAgIHdoaWxlICgrK2luZGV4IDwgc3RhcnQpIHtcbiAgICAgIG90aGVyQXJnc1tpbmRleF0gPSBhcmdzW2luZGV4XTtcbiAgICB9XG4gICAgb3RoZXJBcmdzW3N0YXJ0XSA9IHRyYW5zZm9ybShhcnJheSk7XG4gICAgcmV0dXJuIGFwcGx5KGZ1bmMsIHRoaXMsIG90aGVyQXJncyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb3ZlclJlc3Q7XG4iLCJ2YXIgZnJlZUdsb2JhbCA9IHJlcXVpcmUoJy4vX2ZyZWVHbG9iYWwnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJvb3Q7XG4iLCIvKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKlxuICogQWRkcyBgdmFsdWVgIHRvIHRoZSBhcnJheSBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgYWRkXG4gKiBAbWVtYmVyT2YgU2V0Q2FjaGVcbiAqIEBhbGlhcyBwdXNoXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjYWNoZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzZXRDYWNoZUFkZCh2YWx1ZSkge1xuICB0aGlzLl9fZGF0YV9fLnNldCh2YWx1ZSwgSEFTSF9VTkRFRklORUQpO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXRDYWNoZUFkZDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgaW4gdGhlIGFycmF5IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBTZXRDYWNoZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgZm91bmQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc2V0Q2FjaGVIYXModmFsdWUpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uaGFzKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXRDYWNoZUhhcztcbiIsIi8qKlxuICogQ29udmVydHMgYHNldGAgdG8gYW4gYXJyYXkgb2YgaXRzIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNldCBUaGUgc2V0IHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gc2V0VG9BcnJheShzZXQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShzZXQuc2l6ZSk7XG5cbiAgc2V0LmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXN1bHRbKytpbmRleF0gPSB2YWx1ZTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0VG9BcnJheTtcbiIsInZhciBiYXNlU2V0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19iYXNlU2V0VG9TdHJpbmcnKSxcbiAgICBzaG9ydE91dCA9IHJlcXVpcmUoJy4vX3Nob3J0T3V0Jyk7XG5cbi8qKlxuICogU2V0cyB0aGUgYHRvU3RyaW5nYCBtZXRob2Qgb2YgYGZ1bmNgIHRvIHJldHVybiBgc3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyaW5nIFRoZSBgdG9TdHJpbmdgIHJlc3VsdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBgZnVuY2AuXG4gKi9cbnZhciBzZXRUb1N0cmluZyA9IHNob3J0T3V0KGJhc2VTZXRUb1N0cmluZyk7XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0VG9TdHJpbmc7XG4iLCIvKiogVXNlZCB0byBkZXRlY3QgaG90IGZ1bmN0aW9ucyBieSBudW1iZXIgb2YgY2FsbHMgd2l0aGluIGEgc3BhbiBvZiBtaWxsaXNlY29uZHMuICovXG52YXIgSE9UX0NPVU5UID0gODAwLFxuICAgIEhPVF9TUEFOID0gMTY7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVOb3cgPSBEYXRlLm5vdztcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCdsbCBzaG9ydCBvdXQgYW5kIGludm9rZSBgaWRlbnRpdHlgIGluc3RlYWRcbiAqIG9mIGBmdW5jYCB3aGVuIGl0J3MgY2FsbGVkIGBIT1RfQ09VTlRgIG9yIG1vcmUgdGltZXMgaW4gYEhPVF9TUEFOYFxuICogbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byByZXN0cmljdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNob3J0YWJsZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gc2hvcnRPdXQoZnVuYykge1xuICB2YXIgY291bnQgPSAwLFxuICAgICAgbGFzdENhbGxlZCA9IDA7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdGFtcCA9IG5hdGl2ZU5vdygpLFxuICAgICAgICByZW1haW5pbmcgPSBIT1RfU1BBTiAtIChzdGFtcCAtIGxhc3RDYWxsZWQpO1xuXG4gICAgbGFzdENhbGxlZCA9IHN0YW1wO1xuICAgIGlmIChyZW1haW5pbmcgPiAwKSB7XG4gICAgICBpZiAoKytjb3VudCA+PSBIT1RfQ09VTlQpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3VtZW50c1swXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY291bnQgPSAwO1xuICAgIH1cbiAgICByZXR1cm4gZnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvcnRPdXQ7XG4iLCJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqL1xuZnVuY3Rpb24gc3RhY2tDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGU7XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tDbGVhcjtcbiIsIi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICByZXN1bHQgPSBkYXRhWydkZWxldGUnXShrZXkpO1xuXG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0RlbGV0ZTtcbiIsIi8qKlxuICogR2V0cyB0aGUgc3RhY2sgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrR2V0KGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5nZXQoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0dldDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGEgc3RhY2sgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0hhcyhrZXkpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uaGFzKGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tIYXM7XG4iLCJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyksXG4gICAgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyksXG4gICAgTWFwQ2FjaGUgPSByZXF1aXJlKCcuL19NYXBDYWNoZScpO1xuXG4vKiogVXNlZCBhcyB0aGUgc2l6ZSB0byBlbmFibGUgbGFyZ2UgYXJyYXkgb3B0aW1pemF0aW9ucy4gKi9cbnZhciBMQVJHRV9BUlJBWV9TSVpFID0gMjAwO1xuXG4vKipcbiAqIFNldHMgdGhlIHN0YWNrIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIHN0YWNrIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzdGFja1NldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBMaXN0Q2FjaGUpIHtcbiAgICB2YXIgcGFpcnMgPSBkYXRhLl9fZGF0YV9fO1xuICAgIGlmICghTWFwIHx8IChwYWlycy5sZW5ndGggPCBMQVJHRV9BUlJBWV9TSVpFIC0gMSkpIHtcbiAgICAgIHBhaXJzLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgICAgIHRoaXMuc2l6ZSA9ICsrZGF0YS5zaXplO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IE1hcENhY2hlKHBhaXJzKTtcbiAgfVxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja1NldDtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmluZGV4T2ZgIHdoaWNoIHBlcmZvcm1zIHN0cmljdCBlcXVhbGl0eVxuICogY29tcGFyaXNvbnMgb2YgdmFsdWVzLCBpLmUuIGA9PT1gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIHN0cmljdEluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpIHtcbiAgdmFyIGluZGV4ID0gZnJvbUluZGV4IC0gMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChhcnJheVtpbmRleF0gPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHJpY3RJbmRleE9mO1xuIiwidmFyIG1lbW9pemVDYXBwZWQgPSByZXF1aXJlKCcuL19tZW1vaXplQ2FwcGVkJyk7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIHByb3BlcnR5IG5hbWVzIHdpdGhpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZUxlYWRpbmdEb3QgPSAvXlxcLi8sXG4gICAgcmVQcm9wTmFtZSA9IC9bXi5bXFxdXSt8XFxbKD86KC0/XFxkKyg/OlxcLlxcZCspPyl8KFtcIiddKSgoPzooPyFcXDIpW15cXFxcXXxcXFxcLikqPylcXDIpXFxdfCg/PSg/OlxcLnxcXFtcXF0pKD86XFwufFxcW1xcXXwkKSkvZztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggYmFja3NsYXNoZXMgaW4gcHJvcGVydHkgcGF0aHMuICovXG52YXIgcmVFc2NhcGVDaGFyID0gL1xcXFwoXFxcXCk/L2c7XG5cbi8qKlxuICogQ29udmVydHMgYHN0cmluZ2AgdG8gYSBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgcHJvcGVydHkgcGF0aCBhcnJheS5cbiAqL1xudmFyIHN0cmluZ1RvUGF0aCA9IG1lbW9pemVDYXBwZWQoZnVuY3Rpb24oc3RyaW5nKSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgaWYgKHJlTGVhZGluZ0RvdC50ZXN0KHN0cmluZykpIHtcbiAgICByZXN1bHQucHVzaCgnJyk7XG4gIH1cbiAgc3RyaW5nLnJlcGxhY2UocmVQcm9wTmFtZSwgZnVuY3Rpb24obWF0Y2gsIG51bWJlciwgcXVvdGUsIHN0cmluZykge1xuICAgIHJlc3VsdC5wdXNoKHF1b3RlID8gc3RyaW5nLnJlcGxhY2UocmVFc2NhcGVDaGFyLCAnJDEnKSA6IChudW1iZXIgfHwgbWF0Y2gpKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdHJpbmdUb1BhdGg7XG4iLCJ2YXIgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyBrZXkgaWYgaXQncyBub3QgYSBzdHJpbmcgb3Igc3ltYm9sLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge3N0cmluZ3xzeW1ib2x9IFJldHVybnMgdGhlIGtleS5cbiAqL1xuZnVuY3Rpb24gdG9LZXkodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fCBpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgdmFyIHJlc3VsdCA9ICh2YWx1ZSArICcnKTtcbiAgcmV0dXJuIChyZXN1bHQgPT0gJzAnICYmICgxIC8gdmFsdWUpID09IC1JTkZJTklUWSkgPyAnLTAnIDogcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvS2V5O1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgZnVuY2AgdG8gaXRzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc291cmNlIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHRvU291cmNlKGZ1bmMpIHtcbiAgaWYgKGZ1bmMgIT0gbnVsbCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnVuY1RvU3RyaW5nLmNhbGwoZnVuYyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChmdW5jICsgJycpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvU291cmNlO1xuIiwiLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGB2YWx1ZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjQuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHJldHVybiBmcm9tIHRoZSBuZXcgZnVuY3Rpb24uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjb25zdGFudCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdHMgPSBfLnRpbWVzKDIsIF8uY29uc3RhbnQoeyAnYSc6IDEgfSkpO1xuICpcbiAqIGNvbnNvbGUubG9nKG9iamVjdHMpO1xuICogLy8gPT4gW3sgJ2EnOiAxIH0sIHsgJ2EnOiAxIH1dXG4gKlxuICogY29uc29sZS5sb2cob2JqZWN0c1swXSA9PT0gb2JqZWN0c1sxXSk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGNvbnN0YW50KHZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29uc3RhbnQ7XG4iLCIvKipcbiAqIFBlcmZvcm1zIGFcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2EnOiAxIH07XG4gKlxuICogXy5lcShvYmplY3QsIG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcShvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcSgnYScsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcSgnYScsIE9iamVjdCgnYScpKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcShOYU4sIE5hTik7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGVxKHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gdmFsdWUgPT09IG90aGVyIHx8ICh2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlcTtcbiIsInZhciBhcnJheUZpbHRlciA9IHJlcXVpcmUoJy4vX2FycmF5RmlsdGVyJyksXG4gICAgYmFzZUZpbHRlciA9IHJlcXVpcmUoJy4vX2Jhc2VGaWx0ZXInKSxcbiAgICBiYXNlSXRlcmF0ZWUgPSByZXF1aXJlKCcuL19iYXNlSXRlcmF0ZWUnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5Jyk7XG5cbi8qKlxuICogSXRlcmF0ZXMgb3ZlciBlbGVtZW50cyBvZiBgY29sbGVjdGlvbmAsIHJldHVybmluZyBhbiBhcnJheSBvZiBhbGwgZWxlbWVudHNcbiAqIGBwcmVkaWNhdGVgIHJldHVybnMgdHJ1dGh5IGZvci4gVGhlIHByZWRpY2F0ZSBpcyBpbnZva2VkIHdpdGggdGhyZWVcbiAqIGFyZ3VtZW50czogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICpcbiAqICoqTm90ZToqKiBVbmxpa2UgYF8ucmVtb3ZlYCwgdGhpcyBtZXRob2QgcmV0dXJucyBhIG5ldyBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3ByZWRpY2F0ZT1fLmlkZW50aXR5XSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZmlsdGVyZWQgYXJyYXkuXG4gKiBAc2VlIF8ucmVqZWN0XG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciB1c2VycyA9IFtcbiAqICAgeyAndXNlcic6ICdiYXJuZXknLCAnYWdlJzogMzYsICdhY3RpdmUnOiB0cnVlIH0sXG4gKiAgIHsgJ3VzZXInOiAnZnJlZCcsICAgJ2FnZSc6IDQwLCAnYWN0aXZlJzogZmFsc2UgfVxuICogXTtcbiAqXG4gKiBfLmZpbHRlcih1c2VycywgZnVuY3Rpb24obykgeyByZXR1cm4gIW8uYWN0aXZlOyB9KTtcbiAqIC8vID0+IG9iamVjdHMgZm9yIFsnZnJlZCddXG4gKlxuICogLy8gVGhlIGBfLm1hdGNoZXNgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8uZmlsdGVyKHVzZXJzLCB7ICdhZ2UnOiAzNiwgJ2FjdGl2ZSc6IHRydWUgfSk7XG4gKiAvLyA9PiBvYmplY3RzIGZvciBbJ2Jhcm5leSddXG4gKlxuICogLy8gVGhlIGBfLm1hdGNoZXNQcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maWx0ZXIodXNlcnMsIFsnYWN0aXZlJywgZmFsc2VdKTtcbiAqIC8vID0+IG9iamVjdHMgZm9yIFsnZnJlZCddXG4gKlxuICogLy8gVGhlIGBfLnByb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gKiBfLmZpbHRlcih1c2VycywgJ2FjdGl2ZScpO1xuICogLy8gPT4gb2JqZWN0cyBmb3IgWydiYXJuZXknXVxuICovXG5mdW5jdGlvbiBmaWx0ZXIoY29sbGVjdGlvbiwgcHJlZGljYXRlKSB7XG4gIHZhciBmdW5jID0gaXNBcnJheShjb2xsZWN0aW9uKSA/IGFycmF5RmlsdGVyIDogYmFzZUZpbHRlcjtcbiAgcmV0dXJuIGZ1bmMoY29sbGVjdGlvbiwgYmFzZUl0ZXJhdGVlKHByZWRpY2F0ZSwgMykpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbHRlcjtcbiIsInZhciBjcmVhdGVGaW5kID0gcmVxdWlyZSgnLi9fY3JlYXRlRmluZCcpLFxuICAgIGZpbmRJbmRleCA9IHJlcXVpcmUoJy4vZmluZEluZGV4Jyk7XG5cbi8qKlxuICogSXRlcmF0ZXMgb3ZlciBlbGVtZW50cyBvZiBgY29sbGVjdGlvbmAsIHJldHVybmluZyB0aGUgZmlyc3QgZWxlbWVudFxuICogYHByZWRpY2F0ZWAgcmV0dXJucyB0cnV0aHkgZm9yLiBUaGUgcHJlZGljYXRlIGlzIGludm9rZWQgd2l0aCB0aHJlZVxuICogYXJndW1lbnRzOiAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcHJlZGljYXRlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gW2Zyb21JbmRleD0wXSBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWF0Y2hlZCBlbGVtZW50LCBlbHNlIGB1bmRlZmluZWRgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgdXNlcnMgPSBbXG4gKiAgIHsgJ3VzZXInOiAnYmFybmV5JywgICdhZ2UnOiAzNiwgJ2FjdGl2ZSc6IHRydWUgfSxcbiAqICAgeyAndXNlcic6ICdmcmVkJywgICAgJ2FnZSc6IDQwLCAnYWN0aXZlJzogZmFsc2UgfSxcbiAqICAgeyAndXNlcic6ICdwZWJibGVzJywgJ2FnZSc6IDEsICAnYWN0aXZlJzogdHJ1ZSB9XG4gKiBdO1xuICpcbiAqIF8uZmluZCh1c2VycywgZnVuY3Rpb24obykgeyByZXR1cm4gby5hZ2UgPCA0MDsgfSk7XG4gKiAvLyA9PiBvYmplY3QgZm9yICdiYXJuZXknXG4gKlxuICogLy8gVGhlIGBfLm1hdGNoZXNgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8uZmluZCh1c2VycywgeyAnYWdlJzogMSwgJ2FjdGl2ZSc6IHRydWUgfSk7XG4gKiAvLyA9PiBvYmplY3QgZm9yICdwZWJibGVzJ1xuICpcbiAqIC8vIFRoZSBgXy5tYXRjaGVzUHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8uZmluZCh1c2VycywgWydhY3RpdmUnLCBmYWxzZV0pO1xuICogLy8gPT4gb2JqZWN0IGZvciAnZnJlZCdcbiAqXG4gKiAvLyBUaGUgYF8ucHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8uZmluZCh1c2VycywgJ2FjdGl2ZScpO1xuICogLy8gPT4gb2JqZWN0IGZvciAnYmFybmV5J1xuICovXG52YXIgZmluZCA9IGNyZWF0ZUZpbmQoZmluZEluZGV4KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmaW5kO1xuIiwidmFyIGJhc2VGaW5kSW5kZXggPSByZXF1aXJlKCcuL19iYXNlRmluZEluZGV4JyksXG4gICAgYmFzZUl0ZXJhdGVlID0gcmVxdWlyZSgnLi9fYmFzZUl0ZXJhdGVlJyksXG4gICAgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi90b0ludGVnZXInKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uZmluZGAgZXhjZXB0IHRoYXQgaXQgcmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGZpcnN0XG4gKiBlbGVtZW50IGBwcmVkaWNhdGVgIHJldHVybnMgdHJ1dGh5IGZvciBpbnN0ZWFkIG9mIHRoZSBlbGVtZW50IGl0c2VsZi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDEuMS4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3ByZWRpY2F0ZT1fLmlkZW50aXR5XSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHtudW1iZXJ9IFtmcm9tSW5kZXg9MF0gVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGZvdW5kIGVsZW1lbnQsIGVsc2UgYC0xYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHVzZXJzID0gW1xuICogICB7ICd1c2VyJzogJ2Jhcm5leScsICAnYWN0aXZlJzogZmFsc2UgfSxcbiAqICAgeyAndXNlcic6ICdmcmVkJywgICAgJ2FjdGl2ZSc6IGZhbHNlIH0sXG4gKiAgIHsgJ3VzZXInOiAncGViYmxlcycsICdhY3RpdmUnOiB0cnVlIH1cbiAqIF07XG4gKlxuICogXy5maW5kSW5kZXgodXNlcnMsIGZ1bmN0aW9uKG8pIHsgcmV0dXJuIG8udXNlciA9PSAnYmFybmV5JzsgfSk7XG4gKiAvLyA9PiAwXG4gKlxuICogLy8gVGhlIGBfLm1hdGNoZXNgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8uZmluZEluZGV4KHVzZXJzLCB7ICd1c2VyJzogJ2ZyZWQnLCAnYWN0aXZlJzogZmFsc2UgfSk7XG4gKiAvLyA9PiAxXG4gKlxuICogLy8gVGhlIGBfLm1hdGNoZXNQcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maW5kSW5kZXgodXNlcnMsIFsnYWN0aXZlJywgZmFsc2VdKTtcbiAqIC8vID0+IDBcbiAqXG4gKiAvLyBUaGUgYF8ucHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8uZmluZEluZGV4KHVzZXJzLCAnYWN0aXZlJyk7XG4gKiAvLyA9PiAyXG4gKi9cbmZ1bmN0aW9uIGZpbmRJbmRleChhcnJheSwgcHJlZGljYXRlLCBmcm9tSW5kZXgpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoO1xuICBpZiAoIWxlbmd0aCkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuICB2YXIgaW5kZXggPSBmcm9tSW5kZXggPT0gbnVsbCA/IDAgOiB0b0ludGVnZXIoZnJvbUluZGV4KTtcbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIGluZGV4ID0gbmF0aXZlTWF4KGxlbmd0aCArIGluZGV4LCAwKTtcbiAgfVxuICByZXR1cm4gYmFzZUZpbmRJbmRleChhcnJheSwgYmFzZUl0ZXJhdGVlKHByZWRpY2F0ZSwgMyksIGluZGV4KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmaW5kSW5kZXg7XG4iLCJ2YXIgYmFzZUZsYXR0ZW4gPSByZXF1aXJlKCcuL19iYXNlRmxhdHRlbicpLFxuICAgIG1hcCA9IHJlcXVpcmUoJy4vbWFwJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZsYXR0ZW5lZCBhcnJheSBvZiB2YWx1ZXMgYnkgcnVubmluZyBlYWNoIGVsZW1lbnQgaW4gYGNvbGxlY3Rpb25gXG4gKiB0aHJ1IGBpdGVyYXRlZWAgYW5kIGZsYXR0ZW5pbmcgdGhlIG1hcHBlZCByZXN1bHRzLiBUaGUgaXRlcmF0ZWUgaXMgaW52b2tlZFxuICogd2l0aCB0aHJlZSBhcmd1bWVudHM6ICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBmbGF0dGVuZWQgYXJyYXkuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIGR1cGxpY2F0ZShuKSB7XG4gKiAgIHJldHVybiBbbiwgbl07XG4gKiB9XG4gKlxuICogXy5mbGF0TWFwKFsxLCAyXSwgZHVwbGljYXRlKTtcbiAqIC8vID0+IFsxLCAxLCAyLCAyXVxuICovXG5mdW5jdGlvbiBmbGF0TWFwKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSB7XG4gIHJldHVybiBiYXNlRmxhdHRlbihtYXAoY29sbGVjdGlvbiwgaXRlcmF0ZWUpLCAxKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmbGF0TWFwO1xuIiwidmFyIGJhc2VGbGF0dGVuID0gcmVxdWlyZSgnLi9fYmFzZUZsYXR0ZW4nKTtcblxuLyoqXG4gKiBGbGF0dGVucyBgYXJyYXlgIGEgc2luZ2xlIGxldmVsIGRlZXAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gZmxhdHRlbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZsYXR0ZW5lZCBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5mbGF0dGVuKFsxLCBbMiwgWzMsIFs0XV0sIDVdXSk7XG4gKiAvLyA9PiBbMSwgMiwgWzMsIFs0XV0sIDVdXG4gKi9cbmZ1bmN0aW9uIGZsYXR0ZW4oYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoO1xuICByZXR1cm4gbGVuZ3RoID8gYmFzZUZsYXR0ZW4oYXJyYXksIDEpIDogW107XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmxhdHRlbjtcbiIsInZhciBhcnJheUVhY2ggPSByZXF1aXJlKCcuL19hcnJheUVhY2gnKSxcbiAgICBiYXNlRWFjaCA9IHJlcXVpcmUoJy4vX2Jhc2VFYWNoJyksXG4gICAgY2FzdEZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fY2FzdEZ1bmN0aW9uJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpO1xuXG4vKipcbiAqIEl0ZXJhdGVzIG92ZXIgZWxlbWVudHMgb2YgYGNvbGxlY3Rpb25gIGFuZCBpbnZva2VzIGBpdGVyYXRlZWAgZm9yIGVhY2ggZWxlbWVudC5cbiAqIFRoZSBpdGVyYXRlZSBpcyBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOiAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gKiBJdGVyYXRlZSBmdW5jdGlvbnMgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5IGJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGBmYWxzZWAuXG4gKlxuICogKipOb3RlOioqIEFzIHdpdGggb3RoZXIgXCJDb2xsZWN0aW9uc1wiIG1ldGhvZHMsIG9iamVjdHMgd2l0aCBhIFwibGVuZ3RoXCJcbiAqIHByb3BlcnR5IGFyZSBpdGVyYXRlZCBsaWtlIGFycmF5cy4gVG8gYXZvaWQgdGhpcyBiZWhhdmlvciB1c2UgYF8uZm9ySW5gXG4gKiBvciBgXy5mb3JPd25gIGZvciBvYmplY3QgaXRlcmF0aW9uLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBhbGlhcyBlYWNoXG4gKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqIEBzZWUgXy5mb3JFYWNoUmlnaHRcbiAqIEBleGFtcGxlXG4gKlxuICogXy5mb3JFYWNoKFsxLCAyXSwgZnVuY3Rpb24odmFsdWUpIHtcbiAqICAgY29uc29sZS5sb2codmFsdWUpO1xuICogfSk7XG4gKiAvLyA9PiBMb2dzIGAxYCB0aGVuIGAyYC5cbiAqXG4gKiBfLmZvckVhY2goeyAnYSc6IDEsICdiJzogMiB9LCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gKiAgIGNvbnNvbGUubG9nKGtleSk7XG4gKiB9KTtcbiAqIC8vID0+IExvZ3MgJ2EnIHRoZW4gJ2InIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpLlxuICovXG5mdW5jdGlvbiBmb3JFYWNoKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSB7XG4gIHZhciBmdW5jID0gaXNBcnJheShjb2xsZWN0aW9uKSA/IGFycmF5RWFjaCA6IGJhc2VFYWNoO1xuICByZXR1cm4gZnVuYyhjb2xsZWN0aW9uLCBjYXN0RnVuY3Rpb24oaXRlcmF0ZWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmb3JFYWNoO1xuIiwidmFyIGJhc2VHZXQgPSByZXF1aXJlKCcuL19iYXNlR2V0Jyk7XG5cbi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYHBhdGhgIG9mIGBvYmplY3RgLiBJZiB0aGUgcmVzb2x2ZWQgdmFsdWUgaXNcbiAqIGB1bmRlZmluZWRgLCB0aGUgYGRlZmF1bHRWYWx1ZWAgaXMgcmV0dXJuZWQgaW4gaXRzIHBsYWNlLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy43LjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcGFyYW0geyp9IFtkZWZhdWx0VmFsdWVdIFRoZSB2YWx1ZSByZXR1cm5lZCBmb3IgYHVuZGVmaW5lZGAgcmVzb2x2ZWQgdmFsdWVzLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc29sdmVkIHZhbHVlLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IFt7ICdiJzogeyAnYyc6IDMgfSB9XSB9O1xuICpcbiAqIF8uZ2V0KG9iamVjdCwgJ2FbMF0uYi5jJyk7XG4gKiAvLyA9PiAzXG4gKlxuICogXy5nZXQob2JqZWN0LCBbJ2EnLCAnMCcsICdiJywgJ2MnXSk7XG4gKiAvLyA9PiAzXG4gKlxuICogXy5nZXQob2JqZWN0LCAnYS5iLmMnLCAnZGVmYXVsdCcpO1xuICogLy8gPT4gJ2RlZmF1bHQnXG4gKi9cbmZ1bmN0aW9uIGdldChvYmplY3QsIHBhdGgsIGRlZmF1bHRWYWx1ZSkge1xuICB2YXIgcmVzdWx0ID0gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBiYXNlR2V0KG9iamVjdCwgcGF0aCk7XG4gIHJldHVybiByZXN1bHQgPT09IHVuZGVmaW5lZCA/IGRlZmF1bHRWYWx1ZSA6IHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXQ7XG4iLCJ2YXIgYmFzZUhhcyA9IHJlcXVpcmUoJy4vX2Jhc2VIYXMnKSxcbiAgICBoYXNQYXRoID0gcmVxdWlyZSgnLi9faGFzUGF0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgcGF0aGAgaXMgYSBkaXJlY3QgcHJvcGVydHkgb2YgYG9iamVjdGAuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHBhdGhgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IHsgJ2InOiAyIH0gfTtcbiAqIHZhciBvdGhlciA9IF8uY3JlYXRlKHsgJ2EnOiBfLmNyZWF0ZSh7ICdiJzogMiB9KSB9KTtcbiAqXG4gKiBfLmhhcyhvYmplY3QsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5oYXMob2JqZWN0LCAnYS5iJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5oYXMob2JqZWN0LCBbJ2EnLCAnYiddKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmhhcyhvdGhlciwgJ2EnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGhhcyhvYmplY3QsIHBhdGgpIHtcbiAgcmV0dXJuIG9iamVjdCAhPSBudWxsICYmIGhhc1BhdGgob2JqZWN0LCBwYXRoLCBiYXNlSGFzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXM7XG4iLCJ2YXIgYmFzZUhhc0luID0gcmVxdWlyZSgnLi9fYmFzZUhhc0luJyksXG4gICAgaGFzUGF0aCA9IHJlcXVpcmUoJy4vX2hhc1BhdGgnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHBhdGhgIGlzIGEgZGlyZWN0IG9yIGluaGVyaXRlZCBwcm9wZXJ0eSBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgcGF0aGAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSBfLmNyZWF0ZSh7ICdhJzogXy5jcmVhdGUoeyAnYic6IDIgfSkgfSk7XG4gKlxuICogXy5oYXNJbihvYmplY3QsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5oYXNJbihvYmplY3QsICdhLmInKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmhhc0luKG9iamVjdCwgWydhJywgJ2InXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5oYXNJbihvYmplY3QsICdiJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBoYXNJbihvYmplY3QsIHBhdGgpIHtcbiAgcmV0dXJuIG9iamVjdCAhPSBudWxsICYmIGhhc1BhdGgob2JqZWN0LCBwYXRoLCBiYXNlSGFzSW4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc0luO1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIHRoZSBmaXJzdCBhcmd1bWVudCBpdCByZWNlaXZlcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsqfSB2YWx1ZSBBbnkgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyBgdmFsdWVgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqXG4gKiBjb25zb2xlLmxvZyhfLmlkZW50aXR5KG9iamVjdCkgPT09IG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGlkZW50aXR5KHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpZGVudGl0eTtcbiIsInZhciBiYXNlSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Jhc2VJbmRleE9mJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNTdHJpbmcgPSByZXF1aXJlKCcuL2lzU3RyaW5nJyksXG4gICAgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi90b0ludGVnZXInKSxcbiAgICB2YWx1ZXMgPSByZXF1aXJlKCcuL3ZhbHVlcycpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgaW4gYGNvbGxlY3Rpb25gLiBJZiBgY29sbGVjdGlvbmAgaXMgYSBzdHJpbmcsIGl0J3NcbiAqIGNoZWNrZWQgZm9yIGEgc3Vic3RyaW5nIG9mIGB2YWx1ZWAsIG90aGVyd2lzZVxuICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGlzIHVzZWQgZm9yIGVxdWFsaXR5IGNvbXBhcmlzb25zLiBJZiBgZnJvbUluZGV4YCBpcyBuZWdhdGl2ZSwgaXQncyB1c2VkIGFzXG4gKiB0aGUgb2Zmc2V0IGZyb20gdGhlIGVuZCBvZiBgY29sbGVjdGlvbmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbZnJvbUluZGV4PTBdIFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEBwYXJhbS0ge09iamVjdH0gW2d1YXJkXSBFbmFibGVzIHVzZSBhcyBhbiBpdGVyYXRlZSBmb3IgbWV0aG9kcyBsaWtlIGBfLnJlZHVjZWAuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBmb3VuZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmluY2x1ZGVzKFsxLCAyLCAzXSwgMSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pbmNsdWRlcyhbMSwgMiwgM10sIDEsIDIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmluY2x1ZGVzKHsgJ2EnOiAxLCAnYic6IDIgfSwgMSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pbmNsdWRlcygnYWJjZCcsICdiYycpO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpbmNsdWRlcyhjb2xsZWN0aW9uLCB2YWx1ZSwgZnJvbUluZGV4LCBndWFyZCkge1xuICBjb2xsZWN0aW9uID0gaXNBcnJheUxpa2UoY29sbGVjdGlvbikgPyBjb2xsZWN0aW9uIDogdmFsdWVzKGNvbGxlY3Rpb24pO1xuICBmcm9tSW5kZXggPSAoZnJvbUluZGV4ICYmICFndWFyZCkgPyB0b0ludGVnZXIoZnJvbUluZGV4KSA6IDA7XG5cbiAgdmFyIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoO1xuICBpZiAoZnJvbUluZGV4IDwgMCkge1xuICAgIGZyb21JbmRleCA9IG5hdGl2ZU1heChsZW5ndGggKyBmcm9tSW5kZXgsIDApO1xuICB9XG4gIHJldHVybiBpc1N0cmluZyhjb2xsZWN0aW9uKVxuICAgID8gKGZyb21JbmRleCA8PSBsZW5ndGggJiYgY29sbGVjdGlvbi5pbmRleE9mKHZhbHVlLCBmcm9tSW5kZXgpID4gLTEpXG4gICAgOiAoISFsZW5ndGggJiYgYmFzZUluZGV4T2YoY29sbGVjdGlvbiwgdmFsdWUsIGZyb21JbmRleCkgPiAtMSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5jbHVkZXM7XG4iLCJ2YXIgYXJyYXlNYXAgPSByZXF1aXJlKCcuL19hcnJheU1hcCcpLFxuICAgIGJhc2VJbnRlcnNlY3Rpb24gPSByZXF1aXJlKCcuL19iYXNlSW50ZXJzZWN0aW9uJyksXG4gICAgYmFzZVJlc3QgPSByZXF1aXJlKCcuL19iYXNlUmVzdCcpLFxuICAgIGNhc3RBcnJheUxpa2VPYmplY3QgPSByZXF1aXJlKCcuL19jYXN0QXJyYXlMaWtlT2JqZWN0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB1bmlxdWUgdmFsdWVzIHRoYXQgYXJlIGluY2x1ZGVkIGluIGFsbCBnaXZlbiBhcnJheXNcbiAqIHVzaW5nIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBmb3IgZXF1YWxpdHkgY29tcGFyaXNvbnMuIFRoZSBvcmRlciBhbmQgcmVmZXJlbmNlcyBvZiByZXN1bHQgdmFsdWVzIGFyZVxuICogZGV0ZXJtaW5lZCBieSB0aGUgZmlyc3QgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0gey4uLkFycmF5fSBbYXJyYXlzXSBUaGUgYXJyYXlzIHRvIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBhcnJheSBvZiBpbnRlcnNlY3RpbmcgdmFsdWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmludGVyc2VjdGlvbihbMiwgMV0sIFsyLCAzXSk7XG4gKiAvLyA9PiBbMl1cbiAqL1xudmFyIGludGVyc2VjdGlvbiA9IGJhc2VSZXN0KGZ1bmN0aW9uKGFycmF5cykge1xuICB2YXIgbWFwcGVkID0gYXJyYXlNYXAoYXJyYXlzLCBjYXN0QXJyYXlMaWtlT2JqZWN0KTtcbiAgcmV0dXJuIChtYXBwZWQubGVuZ3RoICYmIG1hcHBlZFswXSA9PT0gYXJyYXlzWzBdKVxuICAgID8gYmFzZUludGVyc2VjdGlvbihtYXBwZWQpXG4gICAgOiBbXTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGludGVyc2VjdGlvbjtcbiIsInZhciBiYXNlSXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL19iYXNlSXNBcmd1bWVudHMnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IG9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhbiBgYXJndW1lbnRzYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcmd1bWVudHMgPSBiYXNlSXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPyBiYXNlSXNBcmd1bWVudHMgOiBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgJiZcbiAgICAhcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0FyZ3VtZW50cztcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXkoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheSgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXk7XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBhcnJheS1saWtlIGlmIGl0J3NcbiAqIG5vdCBhIGZ1bmN0aW9uIGFuZCBoYXMgYSBgdmFsdWUubGVuZ3RoYCB0aGF0J3MgYW4gaW50ZWdlciBncmVhdGVyIHRoYW4gb3JcbiAqIGVxdWFsIHRvIGAwYCBhbmQgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICFpc0Z1bmN0aW9uKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5TGlrZTtcbiIsInZhciBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uaXNBcnJheUxpa2VgIGV4Y2VwdCB0aGF0IGl0IGFsc28gY2hlY2tzIGlmIGB2YWx1ZWBcbiAqIGlzIGFuIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheS1saWtlIG9iamVjdCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZU9iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBpc0FycmF5TGlrZSh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheUxpa2VPYmplY3Q7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKSxcbiAgICBzdHViRmFsc2UgPSByZXF1aXJlKCcuL3N0dWJGYWxzZScpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIEJ1ZmZlciA9IG1vZHVsZUV4cG9ydHMgPyByb290LkJ1ZmZlciA6IHVuZGVmaW5lZDtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUlzQnVmZmVyID0gQnVmZmVyID8gQnVmZmVyLmlzQnVmZmVyIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgYnVmZmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4zLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgYnVmZmVyLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IEJ1ZmZlcigyKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgVWludDhBcnJheSgyKSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNCdWZmZXIgPSBuYXRpdmVJc0J1ZmZlciB8fCBzdHViRmFsc2U7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNCdWZmZXI7XG4iLCJ2YXIgYmFzZUtleXMgPSByZXF1aXJlKCcuL19iYXNlS2V5cycpLFxuICAgIGdldFRhZyA9IHJlcXVpcmUoJy4vX2dldFRhZycpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKSxcbiAgICBpc0J1ZmZlciA9IHJlcXVpcmUoJy4vaXNCdWZmZXInKSxcbiAgICBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyksXG4gICAgaXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9pc1R5cGVkQXJyYXknKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFuIGVtcHR5IG9iamVjdCwgY29sbGVjdGlvbiwgbWFwLCBvciBzZXQuXG4gKlxuICogT2JqZWN0cyBhcmUgY29uc2lkZXJlZCBlbXB0eSBpZiB0aGV5IGhhdmUgbm8gb3duIGVudW1lcmFibGUgc3RyaW5nIGtleWVkXG4gKiBwcm9wZXJ0aWVzLlxuICpcbiAqIEFycmF5LWxpa2UgdmFsdWVzIHN1Y2ggYXMgYGFyZ3VtZW50c2Agb2JqZWN0cywgYXJyYXlzLCBidWZmZXJzLCBzdHJpbmdzLCBvclxuICogalF1ZXJ5LWxpa2UgY29sbGVjdGlvbnMgYXJlIGNvbnNpZGVyZWQgZW1wdHkgaWYgdGhleSBoYXZlIGEgYGxlbmd0aGAgb2YgYDBgLlxuICogU2ltaWxhcmx5LCBtYXBzIGFuZCBzZXRzIGFyZSBjb25zaWRlcmVkIGVtcHR5IGlmIHRoZXkgaGF2ZSBhIGBzaXplYCBvZiBgMGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgZW1wdHksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0VtcHR5KG51bGwpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNFbXB0eSh0cnVlKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRW1wdHkoMSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0VtcHR5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNFbXB0eSh7ICdhJzogMSB9KTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoaXNBcnJheUxpa2UodmFsdWUpICYmXG4gICAgICAoaXNBcnJheSh2YWx1ZSkgfHwgdHlwZW9mIHZhbHVlID09ICdzdHJpbmcnIHx8IHR5cGVvZiB2YWx1ZS5zcGxpY2UgPT0gJ2Z1bmN0aW9uJyB8fFxuICAgICAgICBpc0J1ZmZlcih2YWx1ZSkgfHwgaXNUeXBlZEFycmF5KHZhbHVlKSB8fCBpc0FyZ3VtZW50cyh2YWx1ZSkpKSB7XG4gICAgcmV0dXJuICF2YWx1ZS5sZW5ndGg7XG4gIH1cbiAgdmFyIHRhZyA9IGdldFRhZyh2YWx1ZSk7XG4gIGlmICh0YWcgPT0gbWFwVGFnIHx8IHRhZyA9PSBzZXRUYWcpIHtcbiAgICByZXR1cm4gIXZhbHVlLnNpemU7XG4gIH1cbiAgaWYgKGlzUHJvdG90eXBlKHZhbHVlKSkge1xuICAgIHJldHVybiAhYmFzZUtleXModmFsdWUpLmxlbmd0aDtcbiAgfVxuICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwga2V5KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0VtcHR5O1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhc3luY1RhZyA9ICdbb2JqZWN0IEFzeW5jRnVuY3Rpb25dJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIHByb3h5VGFnID0gJ1tvYmplY3QgUHJveHldJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA5IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5cyBhbmQgb3RoZXIgY29uc3RydWN0b3JzLlxuICB2YXIgdGFnID0gYmFzZUdldFRhZyh2YWx1ZSk7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnIHx8IHRhZyA9PSBhc3luY1RhZyB8fCB0YWcgPT0gcHJveHlUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGdW5jdGlvbjtcbiIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0xlbmd0aDtcbiIsInZhciBpc051bWJlciA9IHJlcXVpcmUoJy4vaXNOdW1iZXInKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBgTmFOYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgYmFzZWQgb25cbiAqIFtgTnVtYmVyLmlzTmFOYF0oaHR0cHM6Ly9tZG4uaW8vTnVtYmVyL2lzTmFOKSBhbmQgaXMgbm90IHRoZSBzYW1lIGFzXG4gKiBnbG9iYWwgW2Bpc05hTmBdKGh0dHBzOi8vbWRuLmlvL2lzTmFOKSB3aGljaCByZXR1cm5zIGB0cnVlYCBmb3JcbiAqIGB1bmRlZmluZWRgIGFuZCBvdGhlciBub24tbnVtYmVyIHZhbHVlcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBgTmFOYCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTmFOKE5hTik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc05hTihuZXcgTnVtYmVyKE5hTikpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIGlzTmFOKHVuZGVmaW5lZCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc05hTih1bmRlZmluZWQpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOYU4odmFsdWUpIHtcbiAgLy8gQW4gYE5hTmAgcHJpbWl0aXZlIGlzIHRoZSBvbmx5IHZhbHVlIHRoYXQgaXMgbm90IGVxdWFsIHRvIGl0c2VsZi5cbiAgLy8gUGVyZm9ybSB0aGUgYHRvU3RyaW5nVGFnYCBjaGVjayBmaXJzdCB0byBhdm9pZCBlcnJvcnMgd2l0aCBzb21lXG4gIC8vIEFjdGl2ZVggb2JqZWN0cyBpbiBJRS5cbiAgcmV0dXJuIGlzTnVtYmVyKHZhbHVlKSAmJiB2YWx1ZSAhPSArdmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNOYU47XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBOdW1iZXJgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogKipOb3RlOioqIFRvIGV4Y2x1ZGUgYEluZmluaXR5YCwgYC1JbmZpbml0eWAsIGFuZCBgTmFOYCwgd2hpY2ggYXJlXG4gKiBjbGFzc2lmaWVkIGFzIG51bWJlcnMsIHVzZSB0aGUgYF8uaXNGaW5pdGVgIG1ldGhvZC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG51bWJlciwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTnVtYmVyKDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNOdW1iZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc051bWJlcignMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOdW1iZXIodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IG51bWJlclRhZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNOdW1iZXI7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0TGlrZTtcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTdHJpbmdgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzdHJpbmcsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N0cmluZygnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N0cmluZygxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycgfHxcbiAgICAoIWlzQXJyYXkodmFsdWUpICYmIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gc3RyaW5nVGFnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1N0cmluZztcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1N5bWJvbDtcbiIsInZhciBiYXNlSXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9fYmFzZUlzVHlwZWRBcnJheScpLFxuICAgIGJhc2VVbmFyeSA9IHJlcXVpcmUoJy4vX2Jhc2VVbmFyeScpLFxuICAgIG5vZGVVdGlsID0gcmVxdWlyZSgnLi9fbm9kZVV0aWwnKTtcblxuLyogTm9kZS5qcyBoZWxwZXIgcmVmZXJlbmNlcy4gKi9cbnZhciBub2RlSXNUeXBlZEFycmF5ID0gbm9kZVV0aWwgJiYgbm9kZVV0aWwuaXNUeXBlZEFycmF5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSB0eXBlZCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KG5ldyBVaW50OEFycmF5KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShbXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNUeXBlZEFycmF5ID0gbm9kZUlzVHlwZWRBcnJheSA/IGJhc2VVbmFyeShub2RlSXNUeXBlZEFycmF5KSA6IGJhc2VJc1R5cGVkQXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNUeXBlZEFycmF5O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBgdW5kZWZpbmVkYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBgdW5kZWZpbmVkYCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzVW5kZWZpbmVkKHZvaWQgMCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1VuZGVmaW5lZChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzVW5kZWZpbmVkO1xuIiwidmFyIGFycmF5TGlrZUtleXMgPSByZXF1aXJlKCcuL19hcnJheUxpa2VLZXlzJyksXG4gICAgYmFzZUtleXMgPSByZXF1aXJlKCcuL19iYXNlS2V5cycpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLiBTZWUgdGhlXG4gKiBbRVMgc3BlY10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LmtleXMpXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5cyhuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqXG4gKiBfLmtleXMoJ2hpJyk7XG4gKiAvLyA9PiBbJzAnLCAnMSddXG4gKi9cbmZ1bmN0aW9uIGtleXMob2JqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5TGlrZShvYmplY3QpID8gYXJyYXlMaWtlS2V5cyhvYmplY3QpIDogYmFzZUtleXMob2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBrZXlzO1xuIiwidmFyIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBiYXNlSXRlcmF0ZWUgPSByZXF1aXJlKCcuL19iYXNlSXRlcmF0ZWUnKSxcbiAgICBiYXNlTWFwID0gcmVxdWlyZSgnLi9fYmFzZU1hcCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHZhbHVlcyBieSBydW5uaW5nIGVhY2ggZWxlbWVudCBpbiBgY29sbGVjdGlvbmAgdGhydVxuICogYGl0ZXJhdGVlYC4gVGhlIGl0ZXJhdGVlIGlzIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM6XG4gKiAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gKlxuICogTWFueSBsb2Rhc2ggbWV0aG9kcyBhcmUgZ3VhcmRlZCB0byB3b3JrIGFzIGl0ZXJhdGVlcyBmb3IgbWV0aG9kcyBsaWtlXG4gKiBgXy5ldmVyeWAsIGBfLmZpbHRlcmAsIGBfLm1hcGAsIGBfLm1hcFZhbHVlc2AsIGBfLnJlamVjdGAsIGFuZCBgXy5zb21lYC5cbiAqXG4gKiBUaGUgZ3VhcmRlZCBtZXRob2RzIGFyZTpcbiAqIGBhcnlgLCBgY2h1bmtgLCBgY3VycnlgLCBgY3VycnlSaWdodGAsIGBkcm9wYCwgYGRyb3BSaWdodGAsIGBldmVyeWAsXG4gKiBgZmlsbGAsIGBpbnZlcnRgLCBgcGFyc2VJbnRgLCBgcmFuZG9tYCwgYHJhbmdlYCwgYHJhbmdlUmlnaHRgLCBgcmVwZWF0YCxcbiAqIGBzYW1wbGVTaXplYCwgYHNsaWNlYCwgYHNvbWVgLCBgc29ydEJ5YCwgYHNwbGl0YCwgYHRha2VgLCBgdGFrZVJpZ2h0YCxcbiAqIGB0ZW1wbGF0ZWAsIGB0cmltYCwgYHRyaW1FbmRgLCBgdHJpbVN0YXJ0YCwgYW5kIGB3b3Jkc2BcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBtYXBwZWQgYXJyYXkuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIHNxdWFyZShuKSB7XG4gKiAgIHJldHVybiBuICogbjtcbiAqIH1cbiAqXG4gKiBfLm1hcChbNCwgOF0sIHNxdWFyZSk7XG4gKiAvLyA9PiBbMTYsIDY0XVxuICpcbiAqIF8ubWFwKHsgJ2EnOiA0LCAnYic6IDggfSwgc3F1YXJlKTtcbiAqIC8vID0+IFsxNiwgNjRdIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogdmFyIHVzZXJzID0gW1xuICogICB7ICd1c2VyJzogJ2Jhcm5leScgfSxcbiAqICAgeyAndXNlcic6ICdmcmVkJyB9XG4gKiBdO1xuICpcbiAqIC8vIFRoZSBgXy5wcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5tYXAodXNlcnMsICd1c2VyJyk7XG4gKiAvLyA9PiBbJ2Jhcm5leScsICdmcmVkJ11cbiAqL1xuZnVuY3Rpb24gbWFwKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSB7XG4gIHZhciBmdW5jID0gaXNBcnJheShjb2xsZWN0aW9uKSA/IGFycmF5TWFwIDogYmFzZU1hcDtcbiAgcmV0dXJuIGZ1bmMoY29sbGVjdGlvbiwgYmFzZUl0ZXJhdGVlKGl0ZXJhdGVlLCAzKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwO1xuIiwidmFyIE1hcENhY2hlID0gcmVxdWlyZSgnLi9fTWFwQ2FjaGUnKTtcblxuLyoqIEVycm9yIG1lc3NhZ2UgY29uc3RhbnRzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBtZW1vaXplcyB0aGUgcmVzdWx0IG9mIGBmdW5jYC4gSWYgYHJlc29sdmVyYCBpc1xuICogcHJvdmlkZWQsIGl0IGRldGVybWluZXMgdGhlIGNhY2hlIGtleSBmb3Igc3RvcmluZyB0aGUgcmVzdWx0IGJhc2VkIG9uIHRoZVxuICogYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbi4gQnkgZGVmYXVsdCwgdGhlIGZpcnN0IGFyZ3VtZW50XG4gKiBwcm92aWRlZCB0byB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24gaXMgdXNlZCBhcyB0aGUgbWFwIGNhY2hlIGtleS4gVGhlIGBmdW5jYFxuICogaXMgaW52b2tlZCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gKlxuICogKipOb3RlOioqIFRoZSBjYWNoZSBpcyBleHBvc2VkIGFzIHRoZSBgY2FjaGVgIHByb3BlcnR5IG9uIHRoZSBtZW1vaXplZFxuICogZnVuY3Rpb24uIEl0cyBjcmVhdGlvbiBtYXkgYmUgY3VzdG9taXplZCBieSByZXBsYWNpbmcgdGhlIGBfLm1lbW9pemUuQ2FjaGVgXG4gKiBjb25zdHJ1Y3RvciB3aXRoIG9uZSB3aG9zZSBpbnN0YW5jZXMgaW1wbGVtZW50IHRoZVxuICogW2BNYXBgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wcm9wZXJ0aWVzLW9mLXRoZS1tYXAtcHJvdG90eXBlLW9iamVjdClcbiAqIG1ldGhvZCBpbnRlcmZhY2Ugb2YgYGNsZWFyYCwgYGRlbGV0ZWAsIGBnZXRgLCBgaGFzYCwgYW5kIGBzZXRgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaGF2ZSBpdHMgb3V0cHV0IG1lbW9pemVkLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3Jlc29sdmVyXSBUaGUgZnVuY3Rpb24gdG8gcmVzb2x2ZSB0aGUgY2FjaGUga2V5LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSwgJ2InOiAyIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdjJzogMywgJ2QnOiA0IH07XG4gKlxuICogdmFyIHZhbHVlcyA9IF8ubWVtb2l6ZShfLnZhbHVlcyk7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsxLCAyXVxuICpcbiAqIHZhbHVlcyhvdGhlcik7XG4gKiAvLyA9PiBbMywgNF1cbiAqXG4gKiBvYmplY3QuYSA9IDI7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsxLCAyXVxuICpcbiAqIC8vIE1vZGlmeSB0aGUgcmVzdWx0IGNhY2hlLlxuICogdmFsdWVzLmNhY2hlLnNldChvYmplY3QsIFsnYScsICdiJ10pO1xuICogdmFsdWVzKG9iamVjdCk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddXG4gKlxuICogLy8gUmVwbGFjZSBgXy5tZW1vaXplLkNhY2hlYC5cbiAqIF8ubWVtb2l6ZS5DYWNoZSA9IFdlYWtNYXA7XG4gKi9cbmZ1bmN0aW9uIG1lbW9pemUoZnVuYywgcmVzb2x2ZXIpIHtcbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicgfHwgKHJlc29sdmVyICE9IG51bGwgJiYgdHlwZW9mIHJlc29sdmVyICE9ICdmdW5jdGlvbicpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHZhciBtZW1vaXplZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBrZXkgPSByZXNvbHZlciA/IHJlc29sdmVyLmFwcGx5KHRoaXMsIGFyZ3MpIDogYXJnc1swXSxcbiAgICAgICAgY2FjaGUgPSBtZW1vaXplZC5jYWNoZTtcblxuICAgIGlmIChjYWNoZS5oYXMoa2V5KSkge1xuICAgICAgcmV0dXJuIGNhY2hlLmdldChrZXkpO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICBtZW1vaXplZC5jYWNoZSA9IGNhY2hlLnNldChrZXksIHJlc3VsdCkgfHwgY2FjaGU7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgbWVtb2l6ZWQuY2FjaGUgPSBuZXcgKG1lbW9pemUuQ2FjaGUgfHwgTWFwQ2FjaGUpO1xuICByZXR1cm4gbWVtb2l6ZWQ7XG59XG5cbi8vIEV4cG9zZSBgTWFwQ2FjaGVgLlxubWVtb2l6ZS5DYWNoZSA9IE1hcENhY2hlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1lbW9pemU7XG4iLCIvKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IG5lZ2F0ZXMgdGhlIHJlc3VsdCBvZiB0aGUgcHJlZGljYXRlIGBmdW5jYC4gVGhlXG4gKiBgZnVuY2AgcHJlZGljYXRlIGlzIGludm9rZWQgd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgYW5kIGFyZ3VtZW50cyBvZiB0aGVcbiAqIGNyZWF0ZWQgZnVuY3Rpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIHByZWRpY2F0ZSB0byBuZWdhdGUuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBuZWdhdGVkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBpc0V2ZW4obikge1xuICogICByZXR1cm4gbiAlIDIgPT0gMDtcbiAqIH1cbiAqXG4gKiBfLmZpbHRlcihbMSwgMiwgMywgNCwgNSwgNl0sIF8ubmVnYXRlKGlzRXZlbikpO1xuICogLy8gPT4gWzEsIDMsIDVdXG4gKi9cbmZ1bmN0aW9uIG5lZ2F0ZShwcmVkaWNhdGUpIHtcbiAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOiByZXR1cm4gIXByZWRpY2F0ZS5jYWxsKHRoaXMpO1xuICAgICAgY2FzZSAxOiByZXR1cm4gIXByZWRpY2F0ZS5jYWxsKHRoaXMsIGFyZ3NbMF0pO1xuICAgICAgY2FzZSAyOiByZXR1cm4gIXByZWRpY2F0ZS5jYWxsKHRoaXMsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgICAgY2FzZSAzOiByZXR1cm4gIXByZWRpY2F0ZS5jYWxsKHRoaXMsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgIH1cbiAgICByZXR1cm4gIXByZWRpY2F0ZS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZWdhdGU7XG4iLCJ2YXIgYmFzZVBpY2sgPSByZXF1aXJlKCcuL19iYXNlUGljaycpLFxuICAgIGZsYXRSZXN0ID0gcmVxdWlyZSgnLi9fZmxhdFJlc3QnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIG9iamVjdCBjb21wb3NlZCBvZiB0aGUgcGlja2VkIGBvYmplY3RgIHByb3BlcnRpZXMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7Li4uKHN0cmluZ3xzdHJpbmdbXSl9IFtwYXRoc10gVGhlIHByb3BlcnR5IHBhdGhzIHRvIHBpY2suXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgb2JqZWN0LlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEsICdiJzogJzInLCAnYyc6IDMgfTtcbiAqXG4gKiBfLnBpY2sob2JqZWN0LCBbJ2EnLCAnYyddKTtcbiAqIC8vID0+IHsgJ2EnOiAxLCAnYyc6IDMgfVxuICovXG52YXIgcGljayA9IGZsYXRSZXN0KGZ1bmN0aW9uKG9iamVjdCwgcGF0aHMpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8ge30gOiBiYXNlUGljayhvYmplY3QsIHBhdGhzKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBpY2s7XG4iLCJ2YXIgYmFzZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fYmFzZVByb3BlcnR5JyksXG4gICAgYmFzZVByb3BlcnR5RGVlcCA9IHJlcXVpcmUoJy4vX2Jhc2VQcm9wZXJ0eURlZXAnKSxcbiAgICBpc0tleSA9IHJlcXVpcmUoJy4vX2lzS2V5JyksXG4gICAgdG9LZXkgPSByZXF1aXJlKCcuL190b0tleScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIHZhbHVlIGF0IGBwYXRoYCBvZiBhIGdpdmVuIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFjY2Vzc29yIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0cyA9IFtcbiAqICAgeyAnYSc6IHsgJ2InOiAyIH0gfSxcbiAqICAgeyAnYSc6IHsgJ2InOiAxIH0gfVxuICogXTtcbiAqXG4gKiBfLm1hcChvYmplY3RzLCBfLnByb3BlcnR5KCdhLmInKSk7XG4gKiAvLyA9PiBbMiwgMV1cbiAqXG4gKiBfLm1hcChfLnNvcnRCeShvYmplY3RzLCBfLnByb3BlcnR5KFsnYScsICdiJ10pKSwgJ2EuYicpO1xuICogLy8gPT4gWzEsIDJdXG4gKi9cbmZ1bmN0aW9uIHByb3BlcnR5KHBhdGgpIHtcbiAgcmV0dXJuIGlzS2V5KHBhdGgpID8gYmFzZVByb3BlcnR5KHRvS2V5KHBhdGgpKSA6IGJhc2VQcm9wZXJ0eURlZXAocGF0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcHJvcGVydHk7XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgYGZhbHNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udGltZXMoMiwgXy5zdHViRmFsc2UpO1xuICogLy8gPT4gW2ZhbHNlLCBmYWxzZV1cbiAqL1xuZnVuY3Rpb24gc3R1YkZhbHNlKCkge1xuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3R1YkZhbHNlO1xuIiwidmFyIGJhc2VTdW0gPSByZXF1aXJlKCcuL19iYXNlU3VtJyksXG4gICAgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5Jyk7XG5cbi8qKlxuICogQ29tcHV0ZXMgdGhlIHN1bSBvZiB0aGUgdmFsdWVzIGluIGBhcnJheWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjQuMFxuICogQGNhdGVnb3J5IE1hdGhcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBzdW0uXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uc3VtKFs0LCAyLCA4LCA2XSk7XG4gKiAvLyA9PiAyMFxuICovXG5mdW5jdGlvbiBzdW0oYXJyYXkpIHtcbiAgcmV0dXJuIChhcnJheSAmJiBhcnJheS5sZW5ndGgpXG4gICAgPyBiYXNlU3VtKGFycmF5LCBpZGVudGl0eSlcbiAgICA6IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3VtO1xuIiwidmFyIGJhc2VTbGljZSA9IHJlcXVpcmUoJy4vX2Jhc2VTbGljZScpLFxuICAgIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vdG9JbnRlZ2VyJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHNsaWNlIG9mIGBhcnJheWAgd2l0aCBgbmAgZWxlbWVudHMgdGFrZW4gZnJvbSB0aGUgYmVnaW5uaW5nLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtudW1iZXJ9IFtuPTFdIFRoZSBudW1iZXIgb2YgZWxlbWVudHMgdG8gdGFrZS5cbiAqIEBwYXJhbS0ge09iamVjdH0gW2d1YXJkXSBFbmFibGVzIHVzZSBhcyBhbiBpdGVyYXRlZSBmb3IgbWV0aG9kcyBsaWtlIGBfLm1hcGAuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHNsaWNlIG9mIGBhcnJheWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udGFrZShbMSwgMiwgM10pO1xuICogLy8gPT4gWzFdXG4gKlxuICogXy50YWtlKFsxLCAyLCAzXSwgMik7XG4gKiAvLyA9PiBbMSwgMl1cbiAqXG4gKiBfLnRha2UoWzEsIDIsIDNdLCA1KTtcbiAqIC8vID0+IFsxLCAyLCAzXVxuICpcbiAqIF8udGFrZShbMSwgMiwgM10sIDApO1xuICogLy8gPT4gW11cbiAqL1xuZnVuY3Rpb24gdGFrZShhcnJheSwgbiwgZ3VhcmQpIHtcbiAgaWYgKCEoYXJyYXkgJiYgYXJyYXkubGVuZ3RoKSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBuID0gKGd1YXJkIHx8IG4gPT09IHVuZGVmaW5lZCkgPyAxIDogdG9JbnRlZ2VyKG4pO1xuICByZXR1cm4gYmFzZVNsaWNlKGFycmF5LCAwLCBuIDwgMCA/IDAgOiBuKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0YWtlO1xuIiwidmFyIHRvTnVtYmVyID0gcmVxdWlyZSgnLi90b051bWJlcicpO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBJTkZJTklUWSA9IDEgLyAwLFxuICAgIE1BWF9JTlRFR0VSID0gMS43OTc2OTMxMzQ4NjIzMTU3ZSszMDg7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIGZpbml0ZSBudW1iZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEyLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgY29udmVydGVkIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b0Zpbml0ZSgzLjIpO1xuICogLy8gPT4gMy4yXG4gKlxuICogXy50b0Zpbml0ZShOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDVlLTMyNFxuICpcbiAqIF8udG9GaW5pdGUoSW5maW5pdHkpO1xuICogLy8gPT4gMS43OTc2OTMxMzQ4NjIzMTU3ZSszMDhcbiAqXG4gKiBfLnRvRmluaXRlKCczLjInKTtcbiAqIC8vID0+IDMuMlxuICovXG5mdW5jdGlvbiB0b0Zpbml0ZSh2YWx1ZSkge1xuICBpZiAoIXZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiAwO1xuICB9XG4gIHZhbHVlID0gdG9OdW1iZXIodmFsdWUpO1xuICBpZiAodmFsdWUgPT09IElORklOSVRZIHx8IHZhbHVlID09PSAtSU5GSU5JVFkpIHtcbiAgICB2YXIgc2lnbiA9ICh2YWx1ZSA8IDAgPyAtMSA6IDEpO1xuICAgIHJldHVybiBzaWduICogTUFYX0lOVEVHRVI7XG4gIH1cbiAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZSA/IHZhbHVlIDogMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b0Zpbml0ZTtcbiIsInZhciB0b0Zpbml0ZSA9IHJlcXVpcmUoJy4vdG9GaW5pdGUnKTtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGFuIGludGVnZXIuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9JbnRlZ2VyYF0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXRvaW50ZWdlcikuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgaW50ZWdlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b0ludGVnZXIoMy4yKTtcbiAqIC8vID0+IDNcbiAqXG4gKiBfLnRvSW50ZWdlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDBcbiAqXG4gKiBfLnRvSW50ZWdlcihJbmZpbml0eSk7XG4gKiAvLyA9PiAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwOFxuICpcbiAqIF8udG9JbnRlZ2VyKCczLjInKTtcbiAqIC8vID0+IDNcbiAqL1xuZnVuY3Rpb24gdG9JbnRlZ2VyKHZhbHVlKSB7XG4gIHZhciByZXN1bHQgPSB0b0Zpbml0ZSh2YWx1ZSksXG4gICAgICByZW1haW5kZXIgPSByZXN1bHQgJSAxO1xuXG4gIHJldHVybiByZXN1bHQgPT09IHJlc3VsdCA/IChyZW1haW5kZXIgPyByZXN1bHQgLSByZW1haW5kZXIgOiByZXN1bHQpIDogMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b0ludGVnZXI7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE5BTiA9IDAgLyAwO1xuXG4vKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlLiAqL1xudmFyIHJlVHJpbSA9IC9eXFxzK3xcXHMrJC9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmFkIHNpZ25lZCBoZXhhZGVjaW1hbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCYWRIZXggPSAvXlstK10weFswLTlhLWZdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJpbmFyeSBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCaW5hcnkgPSAvXjBiWzAxXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvY3RhbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNPY3RhbCA9IC9eMG9bMC03XSskL2k7XG5cbi8qKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB3aXRob3V0IGEgZGVwZW5kZW5jeSBvbiBgcm9vdGAuICovXG52YXIgZnJlZVBhcnNlSW50ID0gcGFyc2VJbnQ7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b051bWJlcigzLjIpO1xuICogLy8gPT4gMy4yXG4gKlxuICogXy50b051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDVlLTMyNFxuICpcbiAqIF8udG9OdW1iZXIoSW5maW5pdHkpO1xuICogLy8gPT4gSW5maW5pdHlcbiAqXG4gKiBfLnRvTnVtYmVyKCczLjInKTtcbiAqIC8vID0+IDMuMlxuICovXG5mdW5jdGlvbiB0b051bWJlcih2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gTkFOO1xuICB9XG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICB2YXIgb3RoZXIgPSB0eXBlb2YgdmFsdWUudmFsdWVPZiA9PSAnZnVuY3Rpb24nID8gdmFsdWUudmFsdWVPZigpIDogdmFsdWU7XG4gICAgdmFsdWUgPSBpc09iamVjdChvdGhlcikgPyAob3RoZXIgKyAnJykgOiBvdGhlcjtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiArdmFsdWU7XG4gIH1cbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJlVHJpbSwgJycpO1xuICB2YXIgaXNCaW5hcnkgPSByZUlzQmluYXJ5LnRlc3QodmFsdWUpO1xuICByZXR1cm4gKGlzQmluYXJ5IHx8IHJlSXNPY3RhbC50ZXN0KHZhbHVlKSlcbiAgICA/IGZyZWVQYXJzZUludCh2YWx1ZS5zbGljZSgyKSwgaXNCaW5hcnkgPyAyIDogOClcbiAgICA6IChyZUlzQmFkSGV4LnRlc3QodmFsdWUpID8gTkFOIDogK3ZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b051bWJlcjtcbiIsInZhciBiYXNlVG9TdHJpbmcgPSByZXF1aXJlKCcuL19iYXNlVG9TdHJpbmcnKTtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nLiBBbiBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWQgZm9yIGBudWxsYFxuICogYW5kIGB1bmRlZmluZWRgIHZhbHVlcy4gVGhlIHNpZ24gb2YgYC0wYCBpcyBwcmVzZXJ2ZWQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvU3RyaW5nKG51bGwpO1xuICogLy8gPT4gJydcbiAqXG4gKiBfLnRvU3RyaW5nKC0wKTtcbiAqIC8vID0+ICctMCdcbiAqXG4gKiBfLnRvU3RyaW5nKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiAnMSwyLDMnXG4gKi9cbmZ1bmN0aW9uIHRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PSBudWxsID8gJycgOiBiYXNlVG9TdHJpbmcodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvU3RyaW5nO1xuIiwidmFyIGJhc2VWYWx1ZXMgPSByZXF1aXJlKCcuL19iYXNlVmFsdWVzJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHN0cmluZyBrZXllZCBwcm9wZXJ0eSB2YWx1ZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSB2YWx1ZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8udmFsdWVzKG5ldyBGb28pO1xuICogLy8gPT4gWzEsIDJdIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy52YWx1ZXMoJ2hpJyk7XG4gKiAvLyA9PiBbJ2gnLCAnaSddXG4gKi9cbmZ1bmN0aW9uIHZhbHVlcyhvYmplY3QpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gW10gOiBiYXNlVmFsdWVzKG9iamVjdCwga2V5cyhvYmplY3QpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB2YWx1ZXM7XG4iLCJ2YXIgZmluZE1hdGNoaW5nUnVsZSA9IGZ1bmN0aW9uKHJ1bGVzLCB0ZXh0KXtcbiAgdmFyIGk7XG4gIGZvcihpPTA7IGk8cnVsZXMubGVuZ3RoOyBpKyspXG4gICAgaWYocnVsZXNbaV0ucmVnZXgudGVzdCh0ZXh0KSlcbiAgICAgIHJldHVybiBydWxlc1tpXTtcbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbnZhciBmaW5kTWF4SW5kZXhBbmRSdWxlID0gZnVuY3Rpb24ocnVsZXMsIHRleHQpe1xuICB2YXIgaSwgcnVsZSwgbGFzdF9tYXRjaGluZ19ydWxlO1xuICBmb3IoaT0wOyBpPHRleHQubGVuZ3RoOyBpKyspe1xuICAgIHJ1bGUgPSBmaW5kTWF0Y2hpbmdSdWxlKHJ1bGVzLCB0ZXh0LnN1YnN0cmluZygwLCBpICsgMSkpO1xuICAgIGlmKHJ1bGUpXG4gICAgICBsYXN0X21hdGNoaW5nX3J1bGUgPSBydWxlO1xuICAgIGVsc2UgaWYobGFzdF9tYXRjaGluZ19ydWxlKVxuICAgICAgcmV0dXJuIHttYXhfaW5kZXg6IGksIHJ1bGU6IGxhc3RfbWF0Y2hpbmdfcnVsZX07XG4gIH1cbiAgcmV0dXJuIGxhc3RfbWF0Y2hpbmdfcnVsZSA/IHttYXhfaW5kZXg6IHRleHQubGVuZ3RoLCBydWxlOiBsYXN0X21hdGNoaW5nX3J1bGV9IDogdW5kZWZpbmVkO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvblRva2VuX29yaWcpe1xuICB2YXIgYnVmZmVyID0gXCJcIjtcbiAgdmFyIHJ1bGVzID0gW107XG4gIHZhciBsaW5lID0gMTtcbiAgdmFyIGNvbCA9IDE7XG5cbiAgdmFyIG9uVG9rZW4gPSBmdW5jdGlvbihzcmMsIHR5cGUpe1xuICAgIG9uVG9rZW5fb3JpZyh7XG4gICAgICB0eXBlOiB0eXBlLFxuICAgICAgc3JjOiBzcmMsXG4gICAgICBsaW5lOiBsaW5lLFxuICAgICAgY29sOiBjb2xcbiAgICB9KTtcbiAgICB2YXIgbGluZXMgPSBzcmMuc3BsaXQoXCJcXG5cIik7XG4gICAgbGluZSArPSBsaW5lcy5sZW5ndGggLSAxO1xuICAgIGNvbCA9IChsaW5lcy5sZW5ndGggPiAxID8gMSA6IGNvbCkgKyBsaW5lc1tsaW5lcy5sZW5ndGggLSAxXS5sZW5ndGg7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBhZGRSdWxlOiBmdW5jdGlvbihyZWdleCwgdHlwZSl7XG4gICAgICBydWxlcy5wdXNoKHtyZWdleDogcmVnZXgsIHR5cGU6IHR5cGV9KTtcbiAgICB9LFxuICAgIG9uVGV4dDogZnVuY3Rpb24odGV4dCl7XG4gICAgICB2YXIgc3RyID0gYnVmZmVyICsgdGV4dDtcbiAgICAgIHZhciBtID0gZmluZE1heEluZGV4QW5kUnVsZShydWxlcywgc3RyKTtcbiAgICAgIHdoaWxlKG0gJiYgbS5tYXhfaW5kZXggIT09IHN0ci5sZW5ndGgpe1xuICAgICAgICBvblRva2VuKHN0ci5zdWJzdHJpbmcoMCwgbS5tYXhfaW5kZXgpLCBtLnJ1bGUudHlwZSk7XG5cbiAgICAgICAgLy9ub3cgZmluZCB0aGUgbmV4dCB0b2tlblxuICAgICAgICBzdHIgPSBzdHIuc3Vic3RyaW5nKG0ubWF4X2luZGV4KTtcbiAgICAgICAgbSA9IGZpbmRNYXhJbmRleEFuZFJ1bGUocnVsZXMsIHN0cik7XG4gICAgICB9XG4gICAgICBidWZmZXIgPSBzdHI7XG4gICAgfSxcbiAgICBlbmQ6IGZ1bmN0aW9uKCl7XG4gICAgICBpZihidWZmZXIubGVuZ3RoID09PSAwKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIHZhciBydWxlID0gZmluZE1hdGNoaW5nUnVsZShydWxlcywgYnVmZmVyKTtcbiAgICAgIGlmKCFydWxlKXtcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcihcInVuYWJsZSB0byB0b2tlbml6ZVwiKTtcbiAgICAgICAgZXJyLnRva2VuaXplcjIgPSB7XG4gICAgICAgICAgYnVmZmVyOiBidWZmZXIsXG4gICAgICAgICAgbGluZTogbGluZSxcbiAgICAgICAgICBjb2w6IGNvbFxuICAgICAgICB9O1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG5cbiAgICAgIG9uVG9rZW4oYnVmZmVyLCBydWxlLnR5cGUpO1xuICAgIH1cbiAgfTtcbn07XG4iLCIvKiogQG1vZHVsZSBjb25maWcvc3lsbGFibGVzICovXG5cbnZhciBnZXRMYW5ndWFnZSA9IHJlcXVpcmUoIFwiLi4vaGVscGVycy9nZXRMYW5ndWFnZS5qc1wiICk7XG52YXIgaXNVbmRlZmluZWQgPSByZXF1aXJlKCBcImxvZGFzaC9pc1VuZGVmaW5lZFwiICk7XG5cbnZhciBkZSA9IHJlcXVpcmUoIFwiLi9zeWxsYWJsZXMvZGUuanNvblwiICk7XG52YXIgZW4gPSByZXF1aXJlKCAnLi9zeWxsYWJsZXMvZW4uanNvbicgKTtcbnZhciBubCA9IHJlcXVpcmUoICcuL3N5bGxhYmxlcy9ubC5qc29uJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBsb2NhbGUgKSB7XG5cdGlmICggaXNVbmRlZmluZWQoIGxvY2FsZSApICkge1xuXHRcdGxvY2FsZSA9IFwiZW5fVVNcIlxuXHR9XG5cblx0c3dpdGNoKCBnZXRMYW5ndWFnZSggbG9jYWxlICkgKSB7XG5cdFx0Y2FzZSBcImRlXCI6XG5cdFx0XHRyZXR1cm4gZGU7XG5cdFx0Y2FzZSBcIm5sXCI6XG5cdFx0XHRyZXR1cm4gbmw7XG5cdFx0Y2FzZSBcImVuXCI6XG5cdFx0ZGVmYXVsdDpcblx0XHRcdHJldHVybiBlbjtcblx0fVxufTtcbiIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJ2b3dlbHNcIjogXCJhZWlvdXnDpMO2w7zDocOpw6LDoMOow67DqsOiw7vDtMWTXCIsXG5cdFwiZGV2aWF0aW9uc1wiOiB7XG5cdFx0XCJ2b3dlbHNcIjogW1xuXHRcdFx0e1xuXHRcdFx0XHRcImZyYWdtZW50c1wiOiBbIFwib3VpbFwiLCBcImRlYXV4XCIsIFwiZGVhdSRcIiwgXCJvYXJkXCIsIFwiw6R0aGlvcFwiLCBcImV1aWxcIiwgXCJ2ZWF1XCIsIFwiZWF1JFwiLCBcInVldWVcIiwgXCJsaWVuaXNjaFwiLCBcImFuY2UkXCIsIFwiZW5jZSRcIiwgXCJ0aW1lJFwiLFxuXHRcdFx0XHRcdFwib25jZSRcIiwgXCJ6aWF0XCIsIFwiZ3VldHRlXCIsIFwiw6p0ZVwiLCBcIsO0dGUkXCIsIFwiW2hwXW9tbWUkXCIsIFwiW3Fkc2NuXXVlJFwiLCBcImFpcmUkXCIsIFwidHVyZSRcIiwgXCLDqnBlJFwiLCBcIltecV11aSRcIiwgXCJ0aWNoZSRcIixcblx0XHRcdFx0XHRcInZpY2UkXCIsIFwib2lsZSRcIiwgXCJ6aWFsXCIsIFwiY3J1aXNcIiwgXCJsZWFzXCIsIFwiY29hW2N0XVwiLCBcIlteaV1kZWFsXCIsIFwiW2Z3XWVhdFwiLCBcIltsc3hdZWQkXCIgXSxcblx0XHRcdFx0XCJjb3VudE1vZGlmaWVyXCI6IC0xXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRcImZyYWdtZW50c1wiOiBbIFwiYWF1XCIsIFwiYVvDpMO2w7xvXVwiLCBcIsOkdWVcIiwgXCLDpGV1XCIsIFwiYWVpXCIsIFwiYXVlXCIsIFwiYWV1XCIsIFwiYWVsXCIsIFwiYWlbYWVvXVwiLCBcInNhaWtcIiwgXCJhaXNtdXNcIiwgXCLDpFthZW9pXVwiLCBcImF1w6RcIiwgXCLDqWFcIixcblx0XHRcdFx0XHRcImVbw6Rhb8O2XVwiLCBcImVpW2VvXVwiLCBcImVlW2FlaW91XVwiLCBcImV1W2HDpGVdXCIsIFwiZXVtJFwiLCBcImXDvFwiLCBcIm9bYcOkw7bDvF1cIiwgXCJwb2V0XCIsIFwib29bZW9dXCIsIFwib2llXCIsIFwib2VpW15sXVwiLCBcIm9ldVteZl1cIiwgXCLDtmFcIiwgXCJbZmdyel1pZXVcIixcblx0XHRcdFx0XHRcIm1pZXVuXCIsIFwidGlldXJcIiwgXCJpZXVtXCIsIFwiaVthaXXDvF1cIiwgXCJbXmxdacOkXCIsIFwiW15zXWNoaWVuXCIsIFwiaW9bYmNkZmhqa21wcXR1dnd4XVwiLCBcIltiZGhtcHJ2XWlvblwiLCBcIltscl1pb3JcIixcblx0XHRcdFx0XHRcIlteZ11pb1tnc11cIiwgXCJbZHJdaW96XCIsIFwiZWxpb3pcIiwgXCJ6aW9uaVwiLCBcImJpb1tsbm9yel1cIiwgXCJpw7ZbXnNdXCIsIFwiaWVbZWldXCIsIFwicmllciRcIiwgXCLDtmlbZWddXCIsIFwiW15yXcO2aXNjaFwiLFxuXHRcdFx0XHRcdFwiW15ncXZddVthZcOpaW/DtnXDvF1cIiwgXCJxdWllJFwiLCBcInF1aWVbXnNdXCIsIFwidcOkdVwiLCBcIl51cy1cIiwgXCJeaXQtXCIsIFwiw7xlXCIsIFwibmFpdlwiLCBcImFpc2NoJFwiLCBcImFpc2NoZSRcIiwgXCJhaXNjaGVbbnJzXSRcIiwgXCJbbHN0XWllblwiLFxuXHRcdFx0XHRcdFwiZGllbiRcIiwgXCJnb2lzXCIsIFwiW15nXXJpZW50XCIsIFwiW2FlaW91XXlbYWVpb3VdXCIsIFwiYnlpXCIsIFwiecOkXCIsIFwiW2Etel15W2FvXVwiLCBcInlhdVwiLCBcImtvb3JcIiwgXCJzY2llbnRcIiwgXCJlcmllbFwiLCBcIltkZ11vaW5nXCIgXSxcblx0XHRcdFx0XCJjb3VudE1vZGlmaWVyXCI6IDFcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdFwiZnJhZ21lbnRzXCI6IFsgXCJlYXXDvFwiLCBcImlvaVwiLCBcImlvb1wiLCBcImlvYVwiLCBcImlpaVwiLCBcIm9haVwiLCBcImV1ZXVcIiBdLFxuXHRcdFx0XHRcImNvdW50TW9kaWZpZXJcIjogMVxuXHRcdFx0fVxuXHRcdF0sXG5cdFx0XCJ3b3Jkc1wiOiB7XG5cdFx0XHRcImZ1bGxcIjogW1xuXHRcdFx0XHR7IFwid29yZFwiOiBcImJlYWNoXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJiZWF0XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJiZWF1XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJiZWF1bmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImJlbGxlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJib3VjaGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImJyYWtlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJjYWNoZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2FjaGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImNoYWlzZWxvbmd1ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2hva2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImNvcmRpYWxlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJjb3JlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJkb3BlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJlYXRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImV5ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmFrZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmFtZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmF0aWd1ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmVtbWVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImZvcmNlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJnYW1lXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJnYW1lc1wiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2F0ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ3JhbmRlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJpY2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImlvblwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiam9rZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwianVwZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWFpc2NoXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJtYWlzY2hlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJtb3ZlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJuYXRpdmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcIm5pY2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcIm9uZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGlwZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwicHJpbWVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInJhdGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInJoeXRobVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmlkZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmlkZXNcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInJpZW5cIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInNhdmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInNjaWVuY2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInNpw6hjbGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInNpdGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInN1aXRlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJ0YWtlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJ0YXVwZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwidW5pdmVyc2VcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInZvZ3VlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJ3YXZlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJ6aW9uXCIsIFwic3lsbGFibGVzXCI6IDJ9XG5cdFx0XHRdLFxuXHRcdFx0XCJmcmFnbWVudHNcIjoge1xuXHRcdFx0XHRcImdsb2JhbFwiOiBbXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhYnJlYWt0aW9uXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImFkd2FyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhZmZhaXJlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImFpZ3Vpw6hyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhbmlzZXR0ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhcHBlYWxcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmFja3N0YWdlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJhbmtyYXRlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJhc2ViYWxsXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJhc2VqdW1wXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJlYWNoY29tYmVyXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJlYWNodm9sbGV5YmFsbFwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiZWFnbGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmVhbWVyXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJlYW1lclwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiw6lhcm5haXNlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJlYXVmb3J0XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJlYXVqb2xhaXNcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmVhdXTDqVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiZWF1dHlcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmVsZ2llclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiZXN0aWVuXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJpc2t1aXRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmxlYWNoXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJsdWVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYm9hcmRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYm9hdFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJib2R5c3VpdFwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJib3JkZWxhaXNlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJyZWFrXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJ1aWxkXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJ1cmVhdVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJidXNpbmVzc1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYWJyaW9cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2FicmlvbGV0XCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNhY2hlc2V4ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYW1haWV1XCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNhbnlvblwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYXNlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNhdHN1aXRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2VudGltZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjaGFpc2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2hhbXBpb25cIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2hhbXBpb25hdFwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjaGFwaXRlYXVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2hhdGVhdVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjaMOidGVhdVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjaGVhdFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjaGVlc2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2hpaHVhaHVhXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNob2ljZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjaXJjb25mbGV4ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjbGVhblwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjbG9jaGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2xvc2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2xvdGhlc1wiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjb21tZXJjZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjcmltZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjcm9zc3JhdGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY3Vpc2luZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjdWxvdHRlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImRlYXRoXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImRlZmVuc2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZMOpdGVudGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZHJlYWRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZHJlYW1cIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZHJlc3Njb2RlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImR1bmdlb25cIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZWFzeVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJlbmdhZ2VtZW50XCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImVudGVudGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZXllLWNhdGNoZXJcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZXllY2F0Y2hlclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJleWVsaW5lclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJleWV3b3JkXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZhc2hpb25cIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmVhdHVyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmZXJpZW5cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmluZWxpbmVyXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZpc2hleWVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmxha2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmxhbWJlYXVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmxhdHJhdGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmxlZWNlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZyYcOuY2hlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZyZWFrXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZyaXRlc1wiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmdXR1cmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2FlbGljXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdhbWUtc2hvd1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnYW1lYm95XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdhbWVwYWRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2FtZXBsYXlcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2FtZXBvcnRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2FtZXNob3dcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2FyaWd1ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnYXJyaWd1ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnYXRlZm9sZFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnYXRld2F5XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdlZmxhc2hlZFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnZW9yZ2llclwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnb2FsXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdyYXBlZnJ1aXRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ3JlYXRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ3JvdXB3YXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImd1ZXVsZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJndWlkZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJndWlsbG9jaGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ3luw6R6ZWVuXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImd5bsO2emVlblwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoYWlyY2FyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoYXJkY29yZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoYXJkd2FyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoZWFkXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhlYXJpbmdcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaGVhcnRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaGVhdnlcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaGVkZ2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaGVyb2luXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImluY2x1c2l2ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJpbml0aWF0aXZlXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImluc2lkZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJqYWd1YXJcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiamFsb3VzZXR0ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJqZWFuc1wiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJqZXVuZXNzZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJqdWljZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJqdWtlYm94XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImp1bXBzdWl0XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImthbmFyaWVuXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImthcHJpb2xlXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImthcm9zc2VyaWVsaW5pZVwiLCBcInN5bGxhYmxlc1wiOiA2IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJrb25vcGVlblwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsYWNyb3NzZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsYXBsYWNlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxhdGUtXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxlYWRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibGVhZ3VlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxlYXJuXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImzDqWdpw6hyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsaXplbnppYXRcIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibG9hZFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsb3R0ZXJpZWxvc1wiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsb3VuZ2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibHl6ZWVuXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1hZGFtZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtYWRlbW9pc2VsbGVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWFnaWVyXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1ha2UtdXBcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWFsd2FyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtYW5hZ2VtZW50XCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1hbnRlYXVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWF1c29sZWVuXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1hdXZlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1lZGllblwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtZXNkYW1lc1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtZXNvcG90YW1pZW5cIiwgXCJzeWxsYWJsZXNcIjogNiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWlsbGlhcmRlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1pc3NpbGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWlzemVsbGFuZWVuXCIsIFwic3lsbGFibGVzXCI6IDUgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1vdXNzZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtb3Vzc2VsaW5lXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm11c2VlblwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtdXNldHRlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm5haHVhdGxcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibm9pc2V0dGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibm90ZWJvb2tcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibnVhbmNlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm51a2xlYXNlXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm9kZWVuXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm9mZmxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwib2Zmc2lkZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJvbGVhc3RlclwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJvbi1zdGFnZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJvbmxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwib3JwaGVlblwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwYXJmb3JjZXJpdHRcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGF0aWVuc1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwYXRpZW50XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBlYWNlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBlYWNlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBlYW51dHNcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGVvcGxlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBlcmluZWVuXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBlcml0b25lZW5cIiwgXCJzeWxsYWJsZXNcIjogNSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGljdHVyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwaWVjZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwaXBlbGluZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwbGF0ZWF1XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBvZXNpZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwb2xlcG9zaXRpb25cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicG9ydGVtYW50ZWF1XCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBvcnRlbW9ubmFpZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwcmltZXJhdGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicHJpbWVyYXRlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInByaW1ldGltZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwcm90ZWFzZVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwcm90ZWluXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInByeXRhbmVlblwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJxdW90aWVudFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyYWRpb1wiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyZWFkZXJcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmVhZHlcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmVhbGxpZmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmVwZWF0XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJldGFrZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyaWdvbGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmlzb2xsZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyb2FkXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJvYW1pbmdcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicm9xdWVmb3J0XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNhZmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2F2b25ldHRlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNjaWVuY2VmaWN0aW9uXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNlYXJjaFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzZWxmbWFkZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzZXB0aW1lXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNlcmFwZWVuXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNlcnZpY2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2VydmlldHRlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNoYXJlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNoYXZlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNob3JlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNpZGViYXJcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2lkZWJvYXJkXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNpZGVraWNrXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNpbGhvdWV0dGVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2l0ZW1hcFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzbGlkZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzbmVha1wiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzb2FwXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNvZnRjb3JlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNvZnR3YXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNvdXRhbmVsbGVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3BlYWtcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3BlY2lhbFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzcHJhY2hlaW5zdGVsbHVuZ1wiLCBcInN5bGxhYmxlc1wiOiA1IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzcHl3YXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNxdWFyZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdGFnZWRpdmluZ1wiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdGFrZWhvbGRlclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdGF0ZW1lbnRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RlYWR5XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0ZWFrXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0ZWFsdGhcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RlYW1cIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RvbmVkXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0cmFjY2lhdGVsbGFcIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RyZWFtXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0cmlkZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdHJpa2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3VpdGNhc2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3dlZXBzdGFrZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0LWJvbmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidC1zaGlydFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0YWlsZ2F0ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0YWtlLW9mZlwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0YWtlLW92ZXJcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGFrZWF3YXlcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGFrZW9mZlwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0YWtlb3ZlclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0aHJvYXRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGltZS1vdXRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGltZWxhZ1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0aW1lbGluZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0aW1lc2hhcmluZ1wiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0b2FzdFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0cmF1YmVubWFpc2NoZVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0cmlzdGVzc2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidXNlbmV0XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInZhcmlldMOkdFwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ2YXJpZXTDqVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ2aW5haWdyZXR0ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ2aW50YWdlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInZpb2xldHRcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidm9pY2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwid2FrZWJvYXJkXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIndhc2hlZFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ3YXZlYm9hcmRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwid2VhclwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ3ZWFyXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIndlYnNpdGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwid2hpdGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwid2lkZXNjcmVlblwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ3aXJlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInlhY2h0XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInlvcmtzaGlyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCLDqXByb3V2ZXR0ZVwiLCBcInN5bGxhYmxlc1wiOiAzLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2FsZXR0ZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2lndWVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdyb292ZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibW9yZ3VlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwYWlsbGV0dGVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJhY2xldHRlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyb3VsZXR0ZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3Bpa2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0eWxlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0YWJsZXR0ZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ3J1bmdlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzaXplXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ2YWx1ZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicXVpY2hlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJzXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJob3VzZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNhdWNlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwic1wiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3BhY2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJzXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhaXJsaW5lXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYXV0b3NhdmVcIiwgXCJzeWxsYWJsZXNcIjogMywgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiYWdwaXBlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmlrZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImRhbmNlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZGVhZGxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoYWxmcGlwZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhlYWRsaW5lXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaG9tZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhvcm5waXBlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaG90bGluZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImluZm9saW5lXCIsIFwic3lsbGFibGVzXCI6IDMsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaW5saW5lXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwia2l0ZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJvbGxlcmJsYWRlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2NvcmVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJza3lsaW5lXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2xhY2tsaW5lXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2xpY2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCIsIFwic1wiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic25vb3plXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RvcnlsaW5lXCIsIFwic3lsbGFibGVzXCI6IDMsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwib2ZmaWNlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJzXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3BhY2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJzXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGVhc2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJzXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2FjaGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcInRcIl0gfVxuXHRcdFx0XHRdLFxuXHRcdFx0XHRcImF0QmVnaW5uaW5nT3JFbmRcIjogW1xuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2FzZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsaWZlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRlYWtcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGVhbVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjcmVtZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNyw6htZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImRyaXZlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2thdGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ1cGRhdGVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ1cGdyYWRlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9XG5cdFx0XHRcdF0sXG5cdFx0XHRcdFwiYXRCZWdpbm5pbmdcIjogW1xuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYW5pb25cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmFjZWxpZnRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaml1XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBhY2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2hha2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGVhXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRyYWRlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImRlYWxcIiwgXCJzeWxsYWJsZXNcIjogMSB9XG5cdFx0XHRcdF0sXG5cdFx0XHRcdFwiYXRFbmRcIjogW1xuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmFjZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmaWxlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1vdXNzZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwbGF0ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0YXBlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJ5dGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbXCJzXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYXBlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwiYWxzb0ZvbGxvd2VkQnlcIjogW1wic1wiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZml2ZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcImFsc29Gb2xsb3dlZEJ5XCI6IFtcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImh5cGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbXCJzXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsZWFrXCIsIFwic3lsbGFibGVzXCI6IDEsIFwiYWxzb0ZvbGxvd2VkQnlcIjogW1wic1wiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibGlrZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcImFsc29Gb2xsb3dlZEJ5XCI6IFtcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1ha2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbXCJzXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwaG9uZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcImFsc29Gb2xsb3dlZEJ5XCI6IFtcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJhdmVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbXCJzXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyZWdpbWVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbXCJzXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdGF0dWVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbXCJzXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdG9yZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcImFsc29Gb2xsb3dlZEJ5XCI6IFtcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIndhdmVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbXCJzXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJkYXRlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJpbWFnZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wic1wiXSB9XG5cdFx0XHRcdF1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJ2b3dlbHNcIjogXCJhZWlvdXlcIixcblx0XCJkZXZpYXRpb25zXCI6IHtcblx0XHRcInZvd2Vsc1wiOiBbXG5cdFx0XHR7XG5cdFx0XHRcdFwiZnJhZ21lbnRzXCI6IFsgXCJjaWFsXCIsIFwidGlhXCIsIFwiY2l1c1wiLCBcImdpdVwiLCBcImlvblwiLFxuXHRcdFx0XHRcdFwiW15iZG5wcnZdaW91XCIsIFwic2lhJFwiLCBcIlteYWVpdW90XXsyLH1lZCRcIiwgXCJbYWVpb3V5XVteYWVpdW95dHNdezEsfWUkXCIsXG5cdFx0XHRcdFx0XCJbYS16XWVseSRcIiwgXCJbY2d5XWVkJFwiLCBcInJ2ZWQkXCIsIFwiW2FlaW91eV1bZHRdZXM/JFwiLCBcImVhdVwiLCBcImlldVwiLFxuXHRcdFx0XHRcdFwib2V1XCIsIFwiW2FlaW91eV1bXmFlaW91eWR0XWVbc2RdPyRcIiwgXCJbYWVvdXldcnNlJFwiLCBcIl5leWVcIiBdLFxuXHRcdFx0XHRcImNvdW50TW9kaWZpZXJcIjogLTFcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdFwiZnJhZ21lbnRzXCI6IFsgXCJpYVwiLCBcIml1XCIsIFwiaWlcIiwgXCJpb1wiLCBcIlthZWlvXVthZWlvdV17Mn1cIiwgXCJbYWVpb3VdaW5nXCIsIFwiW15hZWlvdV15aW5nXCIsIFwidWlbYWVvdV1cIiBdLFxuXHRcdFx0XHRcImNvdW50TW9kaWZpZXJcIjogMVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0XCJmcmFnbWVudHNcIjogWyBcIl5yZWVbam1ucHFyc3hdXCIsIFwiXnJlZWxlXCIsIFwiXnJlZXZhXCIsIFwicmlldFwiLFxuXHRcdFx0XHRcdFwiZGllblwiLCBcIlthZWlvdXltXVtiZHBdbGUkXCIsIFwidWVpXCIsIFwidW91XCIsXG5cdFx0XHRcdFx0XCJebWNcIiwgXCJpc20kXCIsIFwiW15sXWxpZW5cIiwgXCJeY29hW2RnbHhdLlwiLFxuXHRcdFx0XHRcdFwiW15ncWF1aWVvXXVhW15hdWllb11cIiwgXCJkbid0JFwiLCBcInVpdHkkXCIsIFwiaWUocnxzdClcIixcblx0XHRcdFx0XHRcIlthZWlvdXddeVthZWlvdV1cIiwgXCJbXmFvXWlyZVtkc11cIiwgXCJbXmFvXWlyZSRcIiBdLFxuXHRcdFx0XHRcImNvdW50TW9kaWZpZXJcIjogMVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0XCJmcmFnbWVudHNcIjogWyBcImVvYVwiLCBcImVvb1wiLCBcImlvYVwiLCBcImlvZVwiLCBcImlvb1wiIF0sXG5cdFx0XHRcdFwiY291bnRNb2RpZmllclwiOiAxXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRcIndvcmRzXCI6IHtcblx0XHRcdFwiZnVsbFwiOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRcIndvcmRcIjogXCJidXNpbmVzc1wiLFxuXHRcdFx0XHRcdFwic3lsbGFibGVzXCI6IDJcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFwid29yZFwiOiBcImNvaGVpcmVzc1wiLFxuXHRcdFx0XHRcdFwic3lsbGFibGVzXCI6IDNcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFwid29yZFwiOiBcImNvbG9uZWxcIixcblx0XHRcdFx0XHRcInN5bGxhYmxlc1wiOiAyXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRcIndvcmRcIjogXCJoZWlyZXNzXCIsXG5cdFx0XHRcdFx0XCJzeWxsYWJsZXNcIjogMlxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0XCJ3b3JkXCI6IFwiaS5lXCIsXG5cdFx0XHRcdFx0XCJzeWxsYWJsZXNcIjogMlxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0XCJ3b3JkXCI6IFwic2hvcmVsaW5lXCIsXG5cdFx0XHRcdFx0XCJzeWxsYWJsZXNcIjogMlxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0XCJ3b3JkXCI6IFwic2ltaWxlXCIsXG5cdFx0XHRcdFx0XCJzeWxsYWJsZXNcIjogM1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0XCJ3b3JkXCI6IFwidW5oZWlyZWRcIixcblx0XHRcdFx0XHRcInN5bGxhYmxlc1wiOiAyXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRcIndvcmRcIjogXCJ3ZWRuZXNkYXlcIixcblx0XHRcdFx0XHRcInN5bGxhYmxlc1wiOiAyXG5cdFx0XHRcdH1cblx0XHRcdF0sXG5cdFx0XHRcImZyYWdtZW50c1wiOiB7XG5cdFx0XHRcdFwiZ2xvYmFsXCI6IFtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcIndvcmRcIjogXCJjb3lvdGVcIixcblx0XHRcdFx0XHRcdFwic3lsbGFibGVzXCI6IDNcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFwid29yZFwiOiBcImdyYXZleWFyZFwiLFxuXHRcdFx0XHRcdFx0XCJzeWxsYWJsZXNcIjogMlxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XCJ3b3JkXCI6IFwibGF3eWVyXCIsXG5cdFx0XHRcdFx0XHRcInN5bGxhYmxlc1wiOiAyXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRdXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG4iLCJtb2R1bGUuZXhwb3J0cz17XG5cdFwidm93ZWxzXCI6IFwiYcOhw6TDomXDqcOrw6ppw63Dr8Oub8Ozw7bDtHXDusO8w7t5XCIsXG5cdFwiZGV2aWF0aW9uc1wiOiB7XG5cdFx0XCJ2b3dlbHNcIjogW1xuXHRcdFx0e1xuXHRcdFx0XHRcImZyYWdtZW50c1wiOiBbIFwidWUkXCIsIFwiZGdlJFwiLCBcIlt0Y3BdacOrbnRcIixcblx0XHRcdFx0XHRcImFjZSRcIiwgXCJbYnJdZWFjaFwiLCBcIlthaW5wcl10aWFhbFwiLCBcIltpb110aWFhblwiLFxuXHRcdFx0XHRcdFwiZ3VhW3ljXVwiLCBcIlteaV1kZWFsXCIsIFwidGl2ZSRcIiwgXCJsb2FkXCIsIFwiW15lXWNva2VcIixcblx0XHRcdFx0XHRcIltec11jb3JlJFwiIF0sXG5cdFx0XHRcdFwiY291bnRNb2RpZmllclwiOiAtMVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0XCJmcmFnbWVudHNcIjogWyBcImHDpFwiLCBcImFldVwiLCBcImFpZVwiLCBcImFvXCIsIFwiw6tcIiwgXCJlb1wiLFxuXHRcdFx0XHRcdFwiZcO6XCIsIFwiaWVhdVwiLCBcImVhJFwiLCBcImVhW151XVwiLCBcImVpW2VqXVwiLFxuXHRcdFx0XHRcdFwiZXVbaXVdXCIsIFwiw69cIiwgXCJpZWlcIiwgXCJpZW5uZVwiLCBcIltebF1pZXVbXnddXCIsXG5cdFx0XHRcdFx0XCJbXmxdaWV1JFwiLCBcImlbYXVpeV1cIiwgXCJzdGlvblwiLFxuXHRcdFx0XHRcdFwiW15jc3R4XWlvXCIsIFwiXnNpb25cIiwgXCJyacOoXCIsIFwib8O2XCIsIFwib2FcIiwgXCJvZWluZ1wiLFxuXHRcdFx0XHRcdFwib2llXCIsIFwiW2V1XcO8XCIsIFwiW15xXXVbYWXDqG9dXCIsIFwidWllXCIsXG5cdFx0XHRcdFx0XCJbYmhucHJdaWVlbFwiLCBcIltiaG5wcl1pw6tsXCIgXSxcblx0XHRcdFx0XCJjb3VudE1vZGlmaWVyXCI6IDFcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdFwiZnJhZ21lbnRzXCI6IFsgXCJbYWVvbHVdeVthZcOpw6hvw7N1XVwiIF0sXG5cdFx0XHRcdFwiY291bnRNb2RpZmllclwiOiAxXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRcIndvcmRzXCI6IHtcblx0XHRcdFwiZnVsbFwiOiBbXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYnllXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJjb3JlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJjdXJlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJkZWlcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImRvcGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImR1ZGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImZha2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImZhbWVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImZpdmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImhvbGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImxlYXN0XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJsb25lXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJtaW51dGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcIm1vdmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcIm5pY2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcIm9uZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RhdGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInN1cnBsYWNlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJ0YWtlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJ0cmFkZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwid2lkZVwiLCBcInN5bGxhYmxlc1wiOiAxIH1cblx0XHRcdF0sXG5cdFx0XHRcImZyYWdtZW50c1wiOiB7XG5cdFx0XHRcdFwiZ2xvYmFsXCI6IFtcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImFkaWV1XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImFpcmxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYWlybWlsZXNcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYWxpZW5cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYW1iaWVudFwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhbm5vdW5jZW1lbnRcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYXBwZWFyYW5jZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhcHBlYXNlbWVudFwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhdGhlbmV1bVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhd2Vzb21lXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJhY2NhbGF1cmVpXCIsIFwic3lsbGFibGVzXCI6IDUgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJhY2NhbGF1cmV1c1wiLCBcInN5bGxhYmxlc1wiOiA1IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiYXNlYmFsbFwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiYXNlanVtcFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiYW5saWV1ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiYXBhb1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiYXJiZWN1ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiZWFtZXJcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmVhbmllXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJlYXRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmVsbGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYsOqdGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmluZ2V3YXRjaFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJibG9jbm90ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJibHVlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJvYXJkXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJyZWFrXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJyb2FkXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJ1bGxzLWV5ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJidXNpbmVzc1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJieWVieWVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2FjYW9cIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2Flc2FyXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNhbWFpZXVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2FvdXRjaG91Y1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYXJib2xpbmV1bVwiLCBcInN5bGxhYmxlc1wiOiA1IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYXRjaHBocmFzZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYXJyaWVyXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNoZWF0XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNoZWVzZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjaXJjb25mbGV4ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjbGVhblwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjbG9ha1wiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjb2J1eWluZ1wiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjb21lYmFja1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjb21mb3J0em9uZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjb21tdW5pcXXDqVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjb25vcGV1bVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjb25zb2xlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNvcnBvcmF0ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjb8O7dGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY3JlYW1lclwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjcmltZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjcnVlc2xpXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImRlYWRsaW5lXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImRlYXV0b3Jpc2VyZW5cIiwgXCJzeWxsYWJsZXNcIjogNiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZGV1Y2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZGV1bVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJkaXJuZGxcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZHJlYWRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZHJlYW10ZWFtXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImRyb25lXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImVucXXDqnRlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImVzY2FwZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJleHBvc3VyZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJleHRyYW5laVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJleHRyYW5ldXNcIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZXllY2F0Y2hlclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJleWVsaW5lclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJleWVvcGVuZXJcIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZXlldHJhY2tlclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJleWV0cmFja2luZ1wiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmYWlydHJhZGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmF1dGV1aWxcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmVhdHVyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmZXVpbGxldGVlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZldWlsbGV0b25cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmlzaGV5ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmaW5lbGluZXJcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmluZXR1bmVuXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZvcmVoYW5kXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZyZWFrXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZ1c2lvbmVyZW5cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2F5cGFyYWRlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdheXByaWRlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdvYWxcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ3JhcGVmcnVpdFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJncnV5w6hyZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJndWVsZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJndWVycmlsbGFcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ3Vlc3RcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaGFyZHdhcmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaGF1dGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaGVhbGluZ1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoZWF0ZXJcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaGVhdnlcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaG9heFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJob3RsaW5lXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImlkZWUtZml4ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJpbmNsdXNpdmVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaW5saW5lXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImludGFrZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJpbnRlbnNpdmVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiamVhbnNcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiSm9uZXNcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwianViaWxldW1cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwia2FsZnNyaWJleWVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwia3JhYWllbm5lc3RcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibGFzdG1pbnV0ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsZWFybmluZ1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsZWFndWVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibGluZS11cFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsaW5vbGV1bVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsb2FkXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxvYWZlclwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsb25ncmVhZFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsb29rYWxpa2VcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibG91aXNcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibHljZXVtXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1hZ2F6aW5lXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1haW5zdHJlYW1cIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWFrZS1vdmVyXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1ha2UtdXBcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWFsd2FyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtYXJtb2xldW1cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWF1c29sZXVtXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1lZGVhdXRldXJcIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWlkbGlmZWNyaXNpc1wiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtaWdyYWluZWF1cmFcIiwgXCJzeWxsYWJsZXNcIjogNSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWlsa3NoYWtlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1pbGxlZmV1aWxsZVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtaXhlZFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtdWVzbGlcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibXVzZXVtXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm11c3QtaGF2ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtdXN0LXJlYWRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibm90ZWJvb2tcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibm9uc2Vuc2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibm93aGVyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJudXJ0dXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm9mZmxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwib25lbGluZXJcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwib25lc2llXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm9ubGluZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJvcGluaW9uXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBhZWxsYVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwYWNlbWFrZXJcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGFuYWNoZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwYXBlZ2FhaWVubmV1c1wiLCBcInN5bGxhYmxlc1wiOiA1IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwYXNzZS1wYXJ0b3V0XCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBlYW51dHNcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGVyaWdldW1cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGVyaW5ldW1cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGVycGV0dXVtXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBldHJvbGV1bVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwaG9uZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwaWN0dXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBsYWNlbWF0XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBvcnRlLW1hbnRlYXVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicG9ydGVmZXVpbGxlXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInByZXNzZS1wYXBpZXJcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicHJpbWV0aW1lXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInF1ZWVuXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInF1ZXN0aW9ubmFpcmVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicXVldWVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmVhZGVyXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJlYWxpdHlcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmVhbGxpZmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmVtYWtlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJlcGVhdFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyZXBlcnRvaXJlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJlc2VhcmNoXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJldmVyZW5jZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyaWJleWVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmluZ3RvbmVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicm9hZFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyb2FtaW5nXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNjaWVuY2VmaWN0aW9uXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNlbGZtYWRlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNpZGVraWNrXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNpZ2h0c2VlaW5nXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNreWxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic21pbGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic25lYWt5XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNvZnR3YXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNwYXJlcmliXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNwZWFrZXJcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3ByZWFkXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0YXRlbWVudFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdGVha1wiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdGVlcGxlY2hhc2VcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RvbmV3YXNoXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0b3JlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0cmVha2VuXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0cmVhbVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdHJlZXR3YXJlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN1cGVyc29ha2VyXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN1cnByaXNlLXBhcnR5XCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN3ZWF0ZXJcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGVhc2VyXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRlbnVlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRlbXBsYXRlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRpbWVsaW5lXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRpc3N1ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0b2FzdFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0w6p0ZS3DoC10w6p0ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0eXBlY2FzdFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ1bmlxdWVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidXJldW1cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidmliZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ2aWV1eFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ2aWxsZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ2aW50YWdlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIndhbmRlbHl1cFwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ3aXNlZ3V5XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIndha2UtdXAtY2FsbFwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ3ZWJjYXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIndpbmVndW1cIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmFzZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcImVcIiwgXCJuXCIsIFwiclwiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdhbWVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwibFwiLCBcInJcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdHlsZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZG91Y2hlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzcGFjZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RyaXB0ZWFzZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaml2ZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJyXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwia2V5bm90ZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJyXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibW91bnRhaW5iaWtlXCIsIFwic3lsbGFibGVzXCI6IDMsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInJcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmYWNlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInRcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjaGFsbGVuZ2VcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjcnVpc2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJob3VzZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJyXCIsIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImRhbmNlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInJcIiwgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZnJhbmNoaXNlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInJcIiwgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZnJlZWxhbmNlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInJcIiwgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibGVhc2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsaW5lZGFuY2VcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsb3VuZ2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtZXJjaGFuZGlzZVwiLCBcInN5bGxhYmxlc1wiOiAzLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJyXCIsIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBlcmZvcm1hbmNlXCIsIFwic3lsbGFibGVzXCI6IDMsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInJcIiwgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmVsZWFzZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJyXCIsIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJlc291cmNlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInJcIiwgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2FjaGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJjXCIsIFwibFwiLCBcIm5cIiwgXCJ0XCIsIFwieFwiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm9mZmljZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcInJcIiwgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2xvc2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJyXCIsIFwidFwiIF0gfVxuXHRcdFx0XHRdLFxuXHRcdFx0XHRcImF0QmVnaW5uaW5nT3JFbmRcIjogW1xuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYnl0ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYWtlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNhcmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY29hY2hcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY29hdFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJlYXJsXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZvYW1cIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2F0ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoZWFkXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhvbWVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibGl2ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzYWZlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNpdGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic29hcFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0ZWFrXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRlYW1cIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwid2F2ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJicmFjZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYXNlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZsZWVjZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzZXJ2aWNlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInZvaWNlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImtpdGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNrYXRlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInJcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyYWNlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInJcIiwgXCJzXCIgXSB9XG5cdFx0XHRcdF0sXG5cdFx0XHRcdFwiYXRCZWdpbm5pbmdcIjogW1xuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY29rZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJkZWFsXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImltYWdlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwic1wiIF0gfVxuXHRcdFx0XHRdLFxuXHRcdFx0XHRcImF0RW5kXCI6IFtcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZvcmNlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRlYVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0aW1lXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImRhdGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImh5cGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInF1b3RlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwiYWxzb0ZvbGxvd2VkQnlcIjogWyBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0YXBlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwiYWxzb0ZvbGxvd2VkQnlcIjogWyBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ1cGdyYWRlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwiYWxzb0ZvbGxvd2VkQnlcIjogWyBcInNcIiBdIH1cblx0XHRcdFx0XVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuIiwiLyoqXG4gKiBUaGUgZnVuY3Rpb24gZ2V0dGluZyB0aGUgbGFuZ3VhZ2UgcGFydCBvZiB0aGUgbG9jYWxlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhbGUgVGhlIGxvY2FsZS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBsYW5ndWFnZSBwYXJ0IG9mIHRoZSBsb2NhbGUuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGxvY2FsZSApIHtcblx0cmV0dXJuIGxvY2FsZS5zcGxpdCggXCJfXCIgKVsgMCBdO1xufTtcbiIsInZhciBibG9ja0VsZW1lbnRzID0gWyBcImFkZHJlc3NcIiwgXCJhcnRpY2xlXCIsIFwiYXNpZGVcIiwgXCJibG9ja3F1b3RlXCIsIFwiY2FudmFzXCIsIFwiZGRcIiwgXCJkaXZcIiwgXCJkbFwiLCBcImZpZWxkc2V0XCIsIFwiZmlnY2FwdGlvblwiLFxuXHRcImZpZ3VyZVwiLCBcImZvb3RlclwiLCBcImZvcm1cIiwgXCJoMVwiLCBcImgyXCIsIFwiaDNcIiwgXCJoNFwiLCBcImg1XCIsIFwiaDZcIiwgXCJoZWFkZXJcIiwgXCJoZ3JvdXBcIiwgXCJoclwiLCBcImxpXCIsIFwibWFpblwiLCBcIm5hdlwiLFxuXHRcIm5vc2NyaXB0XCIsIFwib2xcIiwgXCJvdXRwdXRcIiwgXCJwXCIsIFwicHJlXCIsIFwic2VjdGlvblwiLCBcInRhYmxlXCIsIFwidGZvb3RcIiwgXCJ1bFwiLCBcInZpZGVvXCIgXTtcbnZhciBpbmxpbmVFbGVtZW50cyA9IFsgXCJiXCIsIFwiYmlnXCIsIFwiaVwiLCBcInNtYWxsXCIsIFwidHRcIiwgXCJhYmJyXCIsIFwiYWNyb255bVwiLCBcImNpdGVcIiwgXCJjb2RlXCIsIFwiZGZuXCIsIFwiZW1cIiwgXCJrYmRcIiwgXCJzdHJvbmdcIixcblx0XCJzYW1wXCIsIFwidGltZVwiLCBcInZhclwiLCBcImFcIiwgXCJiZG9cIiwgXCJiclwiLCBcImltZ1wiLCBcIm1hcFwiLCBcIm9iamVjdFwiLCBcInFcIiwgXCJzY3JpcHRcIiwgXCJzcGFuXCIsIFwic3ViXCIsIFwic3VwXCIsIFwiYnV0dG9uXCIsXG5cdFwiaW5wdXRcIiwgXCJsYWJlbFwiLCBcInNlbGVjdFwiLCBcInRleHRhcmVhXCIgXTtcblxudmFyIGJsb2NrRWxlbWVudHNSZWdleCA9IG5ldyBSZWdFeHAoIFwiXihcIiArIGJsb2NrRWxlbWVudHMuam9pbiggXCJ8XCIgKSArIFwiKSRcIiwgXCJpXCIgKTtcbnZhciBpbmxpbmVFbGVtZW50c1JlZ2V4ID0gbmV3IFJlZ0V4cCggXCJeKFwiICsgaW5saW5lRWxlbWVudHMuam9pbiggXCJ8XCIgKSArIFwiKSRcIiwgXCJpXCIgKTtcblxudmFyIGJsb2NrRWxlbWVudFN0YXJ0UmVnZXggPSBuZXcgUmVnRXhwKCBcIl48KFwiICsgYmxvY2tFbGVtZW50cy5qb2luKCBcInxcIiApICsgXCIpW14+XSo/PiRcIiwgXCJpXCIgKTtcbnZhciBibG9ja0VsZW1lbnRFbmRSZWdleCA9IG5ldyBSZWdFeHAoIFwiXjwvKFwiICsgYmxvY2tFbGVtZW50cy5qb2luKCBcInxcIiApICsgXCIpW14+XSo/PiRcIiwgXCJpXCIgKTtcblxudmFyIGlubGluZUVsZW1lbnRTdGFydFJlZ2V4ID0gbmV3IFJlZ0V4cCggXCJePChcIiArIGlubGluZUVsZW1lbnRzLmpvaW4oIFwifFwiICkgKyBcIilbXj5dKj4kXCIsIFwiaVwiICk7XG52YXIgaW5saW5lRWxlbWVudEVuZFJlZ2V4ID0gbmV3IFJlZ0V4cCggXCJePC8oXCIgKyBpbmxpbmVFbGVtZW50cy5qb2luKCBcInxcIiApICsgXCIpW14+XSo+JFwiLCBcImlcIiApO1xuXG52YXIgb3RoZXJFbGVtZW50U3RhcnRSZWdleCA9IC9ePChbXj5cXHNcXC9dKylbXj5dKj4kLztcbnZhciBvdGhlckVsZW1lbnRFbmRSZWdleCA9IC9ePFxcLyhbXj5cXHNdKylbXj5dKj4kLztcblxudmFyIGNvbnRlbnRSZWdleCA9IC9eW148XSskLztcbnZhciBncmVhdGVyVGhhbkNvbnRlbnRSZWdleCA9IC9ePFtePjxdKiQvO1xuXG52YXIgY29tbWVudFJlZ2V4ID0gLzwhLS0oLnxbXFxyXFxuXSkqPy0tPi9nO1xuXG52YXIgY29yZSA9IHJlcXVpcmUoIFwidG9rZW5pemVyMi9jb3JlXCIgKTtcbnZhciBmb3JFYWNoID0gcmVxdWlyZSggXCJsb2Rhc2gvZm9yRWFjaFwiICk7XG52YXIgbWVtb2l6ZSA9IHJlcXVpcmUoIFwibG9kYXNoL21lbW9pemVcIiApO1xuXG52YXIgdG9rZW5zID0gW107XG52YXIgaHRtbEJsb2NrVG9rZW5pemVyO1xuXG4vKipcbiAqIENyZWF0ZXMgYSB0b2tlbml6ZXIgdG8gdG9rZW5pemUgSFRNTCBpbnRvIGJsb2Nrcy5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlVG9rZW5pemVyKCkge1xuXHR0b2tlbnMgPSBbXTtcblxuXHRodG1sQmxvY2tUb2tlbml6ZXIgPSBjb3JlKCBmdW5jdGlvbiggdG9rZW4gKSB7XG5cdFx0dG9rZW5zLnB1c2goIHRva2VuICk7XG5cdH0gKTtcblxuXHRodG1sQmxvY2tUb2tlbml6ZXIuYWRkUnVsZSggY29udGVudFJlZ2V4LCBcImNvbnRlbnRcIiApO1xuXHRodG1sQmxvY2tUb2tlbml6ZXIuYWRkUnVsZSggZ3JlYXRlclRoYW5Db250ZW50UmVnZXgsIFwiZ3JlYXRlci10aGFuLXNpZ24tY29udGVudFwiICk7XG5cblx0aHRtbEJsb2NrVG9rZW5pemVyLmFkZFJ1bGUoIGJsb2NrRWxlbWVudFN0YXJ0UmVnZXgsIFwiYmxvY2stc3RhcnRcIiApO1xuXHRodG1sQmxvY2tUb2tlbml6ZXIuYWRkUnVsZSggYmxvY2tFbGVtZW50RW5kUmVnZXgsIFwiYmxvY2stZW5kXCIgKTtcblx0aHRtbEJsb2NrVG9rZW5pemVyLmFkZFJ1bGUoIGlubGluZUVsZW1lbnRTdGFydFJlZ2V4LCBcImlubGluZS1zdGFydFwiICk7XG5cdGh0bWxCbG9ja1Rva2VuaXplci5hZGRSdWxlKCBpbmxpbmVFbGVtZW50RW5kUmVnZXgsIFwiaW5saW5lLWVuZFwiICk7XG5cblx0aHRtbEJsb2NrVG9rZW5pemVyLmFkZFJ1bGUoIG90aGVyRWxlbWVudFN0YXJ0UmVnZXgsIFwib3RoZXItZWxlbWVudC1zdGFydFwiICk7XG5cdGh0bWxCbG9ja1Rva2VuaXplci5hZGRSdWxlKCBvdGhlckVsZW1lbnRFbmRSZWdleCwgXCJvdGhlci1lbGVtZW50LWVuZFwiICk7XG59XG5cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gZWxlbWVudCBuYW1lIGlzIGEgYmxvY2sgZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaHRtbEVsZW1lbnROYW1lIFRoZSBuYW1lIG9mIHRoZSBIVE1MIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgaXQgaXMgYSBibG9jayBlbGVtZW50LlxuICovXG5mdW5jdGlvbiBpc0Jsb2NrRWxlbWVudCggaHRtbEVsZW1lbnROYW1lICkge1xuXHRyZXR1cm4gYmxvY2tFbGVtZW50c1JlZ2V4LnRlc3QoIGh0bWxFbGVtZW50TmFtZSApO1xufVxuXG4vKipcbiAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIGdpdmVuIGVsZW1lbnQgbmFtZSBpcyBhbiBpbmxpbmUgZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaHRtbEVsZW1lbnROYW1lIFRoZSBuYW1lIG9mIHRoZSBIVE1MIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgaXQgaXMgYW4gaW5saW5lIGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIGlzSW5saW5lRWxlbWVudCggaHRtbEVsZW1lbnROYW1lICkge1xuXHRyZXR1cm4gaW5saW5lRWxlbWVudHNSZWdleC50ZXN0KCBodG1sRWxlbWVudE5hbWUgKTtcbn1cblxuLyoqXG4gKiBTcGxpdHMgYSB0ZXh0IGludG8gYmxvY2tzIGJhc2VkIG9uIEhUTUwgYmxvY2sgZWxlbWVudHMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gc3BsaXQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IEEgbGlzdCBvZiBibG9ja3MgYmFzZWQgb24gSFRNTCBibG9jayBlbGVtZW50cy5cbiAqL1xuZnVuY3Rpb24gZ2V0QmxvY2tzKCB0ZXh0ICkge1xuXHR2YXIgYmxvY2tzID0gW10sIGRlcHRoID0gMCxcblx0XHRibG9ja1N0YXJ0VGFnID0gXCJcIixcblx0XHRjdXJyZW50QmxvY2sgPSBcIlwiLFxuXHRcdGJsb2NrRW5kVGFnID0gXCJcIjtcblxuXHQvLyBSZW1vdmUgYWxsIGNvbW1lbnRzIGJlY2F1c2UgaXQgaXMgdmVyeSBoYXJkIHRvIHRva2VuaXplIHRoZW0uXG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoIGNvbW1lbnRSZWdleCwgXCJcIiApO1xuXG5cdGNyZWF0ZVRva2VuaXplcigpO1xuXHRodG1sQmxvY2tUb2tlbml6ZXIub25UZXh0KCB0ZXh0ICk7XG5cblx0aHRtbEJsb2NrVG9rZW5pemVyLmVuZCgpO1xuXG5cdGZvckVhY2goIHRva2VucywgZnVuY3Rpb24oIHRva2VuLCBpICkge1xuXHRcdHZhciBuZXh0VG9rZW4gPSB0b2tlbnNbIGkgKyAxIF07XG5cblx0XHRzd2l0Y2ggKCB0b2tlbi50eXBlICkge1xuXG5cdFx0XHRjYXNlIFwiY29udGVudFwiOlxuXHRcdFx0Y2FzZSBcImdyZWF0ZXItdGhhbi1zaWduLWNvbnRlbnRcIjpcblx0XHRcdGNhc2UgXCJpbmxpbmUtc3RhcnRcIjpcblx0XHRcdGNhc2UgXCJpbmxpbmUtZW5kXCI6XG5cdFx0XHRjYXNlIFwib3RoZXItdGFnXCI6XG5cdFx0XHRjYXNlIFwib3RoZXItZWxlbWVudC1zdGFydFwiOlxuXHRcdFx0Y2FzZSBcIm90aGVyLWVsZW1lbnQtZW5kXCI6XG5cdFx0XHRjYXNlIFwiZ3JlYXRlciB0aGFuIHNpZ25cIjpcblx0XHRcdFx0aWYgKCAhIG5leHRUb2tlbiB8fCAoIGRlcHRoID09PSAwICYmICggbmV4dFRva2VuLnR5cGUgPT09IFwiYmxvY2stc3RhcnRcIiB8fCBuZXh0VG9rZW4udHlwZSA9PT0gXCJibG9jay1lbmRcIiApICkgKSB7XG5cdFx0XHRcdFx0Y3VycmVudEJsb2NrICs9IHRva2VuLnNyYztcblxuXHRcdFx0XHRcdGJsb2Nrcy5wdXNoKCBjdXJyZW50QmxvY2sgKTtcblx0XHRcdFx0XHRibG9ja1N0YXJ0VGFnID0gXCJcIjtcblx0XHRcdFx0XHRjdXJyZW50QmxvY2sgPSBcIlwiO1xuXHRcdFx0XHRcdGJsb2NrRW5kVGFnID0gXCJcIjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjdXJyZW50QmxvY2sgKz0gdG9rZW4uc3JjO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFwiYmxvY2stc3RhcnRcIjpcblx0XHRcdFx0aWYgKCBkZXB0aCAhPT0gMCApIHtcblx0XHRcdFx0XHRpZiAoIGN1cnJlbnRCbG9jay50cmltKCkgIT09IFwiXCIgKSB7XG5cdFx0XHRcdFx0XHRibG9ja3MucHVzaCggY3VycmVudEJsb2NrICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGN1cnJlbnRCbG9jayA9IFwiXCI7XG5cdFx0XHRcdFx0YmxvY2tFbmRUYWcgPSBcIlwiO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZGVwdGgrKztcblx0XHRcdFx0YmxvY2tTdGFydFRhZyA9IHRva2VuLnNyYztcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgXCJibG9jay1lbmRcIjpcblx0XHRcdFx0ZGVwdGgtLTtcblx0XHRcdFx0YmxvY2tFbmRUYWcgPSB0b2tlbi5zcmM7XG5cblx0XHRcdFx0Lypcblx0XHRcdFx0ICogV2UgdHJ5IHRvIG1hdGNoIHRoZSBtb3N0IGRlZXAgYmxvY2tzIHNvIGRpc2NhcmQgYW55IG90aGVyIGJsb2NrcyB0aGF0IGhhdmUgYmVlbiBzdGFydGVkIGJ1dCBub3Rcblx0XHRcdFx0ICogZmluaXNoZWQuXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHRpZiAoIFwiXCIgIT09IGJsb2NrU3RhcnRUYWcgJiYgXCJcIiAhPT0gYmxvY2tFbmRUYWcgKSB7XG5cdFx0XHRcdFx0YmxvY2tzLnB1c2goIGJsb2NrU3RhcnRUYWcgKyBjdXJyZW50QmxvY2sgKyBibG9ja0VuZFRhZyApO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCBcIlwiICE9PSBjdXJyZW50QmxvY2sudHJpbSgpICkge1xuXHRcdFx0XHRcdGJsb2Nrcy5wdXNoKCBjdXJyZW50QmxvY2sgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRibG9ja1N0YXJ0VGFnID0gXCJcIjtcblx0XHRcdFx0Y3VycmVudEJsb2NrID0gXCJcIjtcblx0XHRcdFx0YmxvY2tFbmRUYWcgPSBcIlwiO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHQvLyBIYW5kbGVzIEhUTUwgd2l0aCB0b28gbWFueSBjbG9zaW5nIHRhZ3MuXG5cdFx0aWYgKCBkZXB0aCA8IDAgKSB7XG5cdFx0XHRkZXB0aCA9IDA7XG5cdFx0fVxuXHR9ICk7XG5cblx0cmV0dXJuIGJsb2Nrcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGJsb2NrRWxlbWVudHM6IGJsb2NrRWxlbWVudHMsXG5cdGlubGluZUVsZW1lbnRzOiBpbmxpbmVFbGVtZW50cyxcblx0aXNCbG9ja0VsZW1lbnQ6IGlzQmxvY2tFbGVtZW50LFxuXHRpc0lubGluZUVsZW1lbnQ6IGlzSW5saW5lRWxlbWVudCxcblx0Z2V0QmxvY2tzOiBtZW1vaXplKCBnZXRCbG9ja3MgKSxcbn07XG4iLCJ2YXIgU3lsbGFibGVDb3VudFN0ZXAgPSByZXF1aXJlKCBcIi4vc3lsbGFibGVDb3VudFN0ZXAuanNcIiApO1xuXG52YXIgaXNVbmRlZmluZWQgPSByZXF1aXJlKCBcImxvZGFzaC9pc1VuZGVmaW5lZFwiICk7XG52YXIgZm9yRWFjaCA9IHJlcXVpcmUoIFwibG9kYXNoL2ZvckVhY2hcIiApO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBzeWxsYWJsZSBjb3VudCBpdGVyYXRvci5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gY29uZmlnIFRoZSBjb25maWcgb2JqZWN0IGNvbnRhaW5pbmcgYW4gYXJyYXkgd2l0aCBzeWxsYWJsZSBleGNsdXNpb25zLlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbnZhciBTeWxsYWJsZUNvdW50SXRlcmF0b3IgPSBmdW5jdGlvbiggY29uZmlnICkge1xuXHR0aGlzLmNvdW50U3RlcHMgPSBbXTtcblx0aWYgKCAhIGlzVW5kZWZpbmVkKCBjb25maWcgKSApIHtcblx0XHR0aGlzLmNyZWF0ZVN5bGxhYmxlQ291bnRTdGVwcyggY29uZmlnLmRldmlhdGlvbnMudm93ZWxzICk7XG5cdH1cbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN5bGxhYmxlIGNvdW50IHN0ZXAgb2JqZWN0IGZvciBlYWNoIGV4Y2x1c2lvbi5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gc3lsbGFibGVDb3VudHMgVGhlIG9iamVjdCBjb250YWluaW5nIGFsbCBleGNsdXNpb24gc3lsbGFibGVzIGluY2x1ZGluZyB0aGUgbXVsdGlwbGllcnMuXG4gKi9cblN5bGxhYmxlQ291bnRJdGVyYXRvci5wcm90b3R5cGUuY3JlYXRlU3lsbGFibGVDb3VudFN0ZXBzID0gZnVuY3Rpb24oIHN5bGxhYmxlQ291bnRzICkge1xuXHRmb3JFYWNoKCBzeWxsYWJsZUNvdW50cywgZnVuY3Rpb24oIHN5bGxhYmxlQ291bnRTdGVwICkge1xuXHRcdHRoaXMuY291bnRTdGVwcy5wdXNoKCBuZXcgU3lsbGFibGVDb3VudFN0ZXAoIHN5bGxhYmxlQ291bnRTdGVwICkgKTtcblx0fS5iaW5kKCB0aGlzICkgKTtcbn07XG5cbi8qKlxuICogUmV0dXJucyBhbGwgYXZhaWxhYmxlIGNvdW50IHN0ZXBzLlxuICpcbiAqIEByZXR1cm5zIHtBcnJheX0gQWxsIGF2YWlsYWJsZSBjb3VudCBzdGVwcy5cbiAqL1xuU3lsbGFibGVDb3VudEl0ZXJhdG9yLnByb3RvdHlwZS5nZXRBdmFpbGFibGVTeWxsYWJsZUNvdW50U3RlcHMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuY291bnRTdGVwcztcbn07XG5cbi8qKlxuICogQ291bnRzIHRoZSBzeWxsYWJsZXMgZm9yIGFsbCB0aGUgc3RlcHMgYW5kIHJldHVybnMgdGhlIHRvdGFsIHN5bGxhYmxlIGNvdW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB3b3JkIFRoZSB3b3JkIHRvIGNvdW50IHN5bGxhYmxlcyBpbi5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBudW1iZXIgb2Ygc3lsbGFibGVzIGZvdW5kIGJhc2VkIG9uIGV4Y2x1c2lvbnMuXG4gKi9cblN5bGxhYmxlQ291bnRJdGVyYXRvci5wcm90b3R5cGUuY291bnRTeWxsYWJsZXMgPSBmdW5jdGlvbiggd29yZCApIHtcblx0dmFyIHN5bGxhYmxlQ291bnQgPSAwO1xuXHRmb3JFYWNoKCB0aGlzLmNvdW50U3RlcHMsIGZ1bmN0aW9uKCBzdGVwICkge1xuXHRcdHN5bGxhYmxlQ291bnQgKz0gc3RlcC5jb3VudFN5bGxhYmxlcyggd29yZCApO1xuXHR9ICk7XG5cdHJldHVybiBzeWxsYWJsZUNvdW50O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTeWxsYWJsZUNvdW50SXRlcmF0b3I7XG4iLCJ2YXIgaXNVbmRlZmluZWQgPSByZXF1aXJlKCBcImxvZGFzaC9pc1VuZGVmaW5lZFwiICk7XG5cbnZhciBhcnJheVRvUmVnZXggPSByZXF1aXJlKCBcIi4uL3N0cmluZ1Byb2Nlc3NpbmcvY3JlYXRlUmVnZXhGcm9tQXJyYXkuanNcIiApO1xuXG4vKipcbiAqIENvbnN0cnVjdHMgYSBsYW5ndWFnZSBzeWxsYWJsZSByZWdleCB0aGF0IGNvbnRhaW5zIGEgcmVnZXggZm9yIG1hdGNoaW5nIHN5bGxhYmxlIGV4Y2x1c2lvbi5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gc3lsbGFibGVSZWdleCBUaGUgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHN5bGxhYmxlIGV4Y2x1c2lvbnMuXG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIFN5bGxhYmxlQ291bnRTdGVwID0gZnVuY3Rpb24oIHN5bGxhYmxlUmVnZXggKSB7XG5cdHRoaXMuX2hhc1JlZ2V4ID0gZmFsc2U7XG5cdHRoaXMuX3JlZ2V4ID0gXCJcIjtcblx0dGhpcy5fbXVsdGlwbGllciA9IFwiXCI7XG5cdHRoaXMuY3JlYXRlUmVnZXgoIHN5bGxhYmxlUmVnZXggKTtcbn07XG5cbi8qKlxuICogUmV0dXJucyBpZiBhIHZhbGlkIHJlZ2V4IGhhcyBiZWVuIHNldC5cbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiBhIHJlZ2V4IGhhcyBiZWVuIHNldCwgZmFsc2UgaWYgbm90LlxuICovXG5TeWxsYWJsZUNvdW50U3RlcC5wcm90b3R5cGUuaGFzUmVnZXggPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuX2hhc1JlZ2V4O1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgcmVnZXggYmFzZWQgb24gdGhlIGdpdmVuIHN5bGxhYmxlIGV4Y2x1c2lvbnMsIGFuZCBzZXRzIHRoZSBtdWx0aXBsaWVyIHRvIHVzZS5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gc3lsbGFibGVSZWdleCBUaGUgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHN5bGxhYmxlIGV4Y2x1c2lvbnMgYW5kIG11bHRpcGxpZXIuXG4gKi9cblN5bGxhYmxlQ291bnRTdGVwLnByb3RvdHlwZS5jcmVhdGVSZWdleCA9IGZ1bmN0aW9uKCBzeWxsYWJsZVJlZ2V4ICkge1xuXHRpZiAoICEgaXNVbmRlZmluZWQoIHN5bGxhYmxlUmVnZXggKSAmJiAhIGlzVW5kZWZpbmVkKCBzeWxsYWJsZVJlZ2V4LmZyYWdtZW50cyApICkge1xuXHRcdHRoaXMuX2hhc1JlZ2V4ID0gdHJ1ZTtcblx0XHR0aGlzLl9yZWdleCA9IGFycmF5VG9SZWdleCggc3lsbGFibGVSZWdleC5mcmFnbWVudHMsIHRydWUgKTtcblx0XHR0aGlzLl9tdWx0aXBsaWVyID0gc3lsbGFibGVSZWdleC5jb3VudE1vZGlmaWVyO1xuXHR9XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIHN0b3JlZCByZWd1bGFyIGV4cHJlc3Npb24uXG4gKlxuICogQHJldHVybnMge1JlZ0V4cH0gVGhlIHN0b3JlZCByZWd1bGFyIGV4cHJlc3Npb24uXG4gKi9cblN5bGxhYmxlQ291bnRTdGVwLnByb3RvdHlwZS5nZXRSZWdleCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5fcmVnZXg7XG59O1xuXG4vKipcbiAqIE1hdGNoZXMgc3lsbGFibGUgZXhjbHVzaW9ucyBpbiBhIGdpdmVuIHdvcmQgYW5kIHRoZSByZXR1cm5zIHRoZSBudW1iZXIgZm91bmQgbXVsdGlwbGllZCB3aXRoIHRoZVxuICogZ2l2ZW4gbXVsdGlwbGllci5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gd29yZCBUaGUgd29yZCB0byBtYXRjaCBmb3Igc3lsbGFibGUgZXhjbHVzaW9ucy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBhbW91bnQgb2Ygc3lsbGFibGVzIGZvdW5kLlxuICovXG5TeWxsYWJsZUNvdW50U3RlcC5wcm90b3R5cGUuY291bnRTeWxsYWJsZXMgPSBmdW5jdGlvbiggd29yZCApIHtcblx0aWYgKCB0aGlzLl9oYXNSZWdleCApIHtcblx0XHR2YXIgbWF0Y2ggPSB3b3JkLm1hdGNoKCB0aGlzLl9yZWdleCApIHx8IFtdO1xuXHRcdHJldHVybiBtYXRjaC5sZW5ndGggKiB0aGlzLl9tdWx0aXBsaWVyO1xuXHR9XG5cdHJldHVybiAwO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTeWxsYWJsZUNvdW50U3RlcDtcbiIsInZhciBmaWx0ZXJlZFBhc3NpdmVBdXhpbGlhcmllcyA9IHJlcXVpcmUoIFwiLi9wYXNzaXZldm9pY2UtZW5nbGlzaC9hdXhpbGlhcmllcy5qc1wiICkoKS5maWx0ZXJlZEF1eGlsaWFyaWVzO1xudmFyIG5vdEZpbHRlcmVkUGFzc2l2ZUF1eGlsaWFyaWVzID0gcmVxdWlyZSggXCIuL3Bhc3NpdmV2b2ljZS1lbmdsaXNoL2F1eGlsaWFyaWVzLmpzXCIgKSgpLm5vdEZpbHRlcmVkQXV4aWxpYXJpZXM7XG52YXIgdHJhbnNpdGlvbldvcmRzID0gcmVxdWlyZSggXCIuL3RyYW5zaXRpb25Xb3Jkcy5qc1wiICkoKS5zaW5nbGVXb3JkcztcblxuLyoqXG4gKiBSZXR1cm5zIGFuIGFycmF5IHdpdGggZXhjZXB0aW9ucyBmb3IgdGhlIGtleXdvcmQgc3VnZ2VzdGlvbiByZXNlYXJjaGVyLlxuICogQHJldHVybnMge0FycmF5fSBUaGUgYXJyYXkgZmlsbGVkIHdpdGggZXhjZXB0aW9ucy5cbiAqL1xuXG52YXIgYXJ0aWNsZXMgPSBbIFwidGhlXCIsIFwiYW5cIiwgXCJhXCIgXTtcbnZhciBudW1lcmFscyA9IFsgXCJvbmVcIiwgXCJ0d29cIiwgXCJ0aHJlZVwiLCBcImZvdXJcIiwgXCJmaXZlXCIsIFwic2l4XCIsIFwic2V2ZW5cIiwgXCJlaWdodFwiLCBcIm5pbmVcIiwgXCJ0ZW5cIiwgXCJlbGV2ZW5cIiwgXCJ0d2VsdmVcIiwgXCJ0aGlydGVlblwiLFxuXHRcImZvdXJ0ZWVuXCIsIFwiZmlmdGVlblwiLCBcInNpeHRlZW5cIiwgXCJzZXZlbnRlZW5cIiwgXCJlaWdodGVlblwiLCBcIm5pbmV0ZWVuXCIsIFwidHdlbnR5XCIsIFwiZmlyc3RcIiwgXCJzZWNvbmRcIiwgXCJ0aGlyZFwiLCBcImZvdXJ0aFwiLFxuXHRcImZpZnRoXCIsIFwic2l4dGhcIiwgXCJzZXZlbnRoXCIsIFwiZWlnaHRoXCIsIFwibmludGhcIiwgXCJ0ZW50aFwiLCBcImVsZXZlbnRoXCIsIFwidHdlbGZ0aFwiLCBcInRoaXJ0ZWVudGhcIiwgXCJmb3VydGVlbnRoXCIsIFwiZmlmdGVlbnRoXCIsXG5cdFwic2l4dGVlbnRoXCIsIFwic2V2ZW50ZWVudGhcIiwgXCJlaWdodGVlbnRoXCIsIFwibmluZXRlZW50aFwiLCBcInR3ZW50aWV0aFwiLCBcImh1bmRyZWRcIiwgXCJodW5kcmVkc1wiLCBcInRob3VzYW5kXCIsIFwidGhvdXNhbmRzXCIsXG5cdFwibWlsbGlvblwiLCBcIm1pbGxpb25cIiwgXCJiaWxsaW9uXCIsIFwiYmlsbGlvbnNcIiBdO1xudmFyIHBlcnNvbmFsUHJvbm91bnNOb21pbmF0aXZlID0gWyBcImlcIiwgXCJ5b3VcIiwgXCJoZVwiLCBcInNoZVwiLCBcIml0XCIsIFwid2VcIiwgXCJ0aGV5XCIgXTtcbnZhciBwZXJzb25hbFByb25vdW5zQWNjdXNhdGl2ZSA9IFsgXCJtZVwiLCBcImhpbVwiLCBcImhlclwiLCBcInVzXCIsIFwidGhlbVwiIF07XG52YXIgZGVtb25zdHJhdGl2ZVByb25vdW5zID0gWyBcInRoaXNcIiwgXCJ0aGF0XCIsIFwidGhlc2VcIiwgXCJ0aG9zZVwiIF07XG52YXIgcG9zc2Vzc2l2ZVByb25vdW5zID0gWyBcIm15XCIsIFwieW91clwiLCBcImhpc1wiLCBcImhlclwiLCBcIml0c1wiLCBcInRoZWlyXCIsIFwib3VyXCIsIFwibWluZVwiLCBcInlvdXJzXCIsIFwiaGVyc1wiLCBcInRoZWlyc1wiLCBcIm91cnNcIiBdO1xudmFyIHF1YW50aWZpZXJzID0gWyBcImFsbFwiLCBcInNvbWVcIiwgXCJtYW55XCIsIFwiZmV3XCIsIFwibG90XCIsIFwibG90c1wiLCBcInRvbnNcIiwgXCJiaXRcIiwgXCJub1wiLCBcImV2ZXJ5XCIsIFwiZW5vdWdoXCIsIFwibGl0dGxlXCIsIFwibGVzc1wiLCBcIm11Y2hcIiwgXCJtb3JlXCIsIFwibW9zdFwiLFxuXHRcInBsZW50eVwiLCBcInNldmVyYWxcIiwgXCJmZXdcIiwgXCJmZXdlclwiLCBcIm1hbnlcIiwgXCJraW5kXCIgXTtcbnZhciByZWZsZXhpdmVQcm9ub3VucyA9IFsgXCJteXNlbGZcIiwgXCJ5b3Vyc2VsZlwiLCBcImhpbXNlbGZcIiwgXCJoZXJzZWxmXCIsIFwiaXRzZWxmXCIsIFwib25lc2VsZlwiLCBcIm91cnNlbHZlc1wiLCBcInlvdXJzZWx2ZXNcIiwgXCJ0aGVtc2VsdmVzXCIgXTtcbnZhciBpbmRlZmluaXRlUHJvbm91bnMgPSBbIFwibm9uZVwiLCBcIm5vYm9keVwiLCBcImV2ZXJ5b25lXCIsIFwiZXZlcnlib2R5XCIsIFwic29tZW9uZVwiLCBcInNvbWVib2R5XCIsIFwiYW55b25lXCIsIFwiYW55Ym9keVwiLCBcIm5vdGhpbmdcIixcblx0XCJldmVyeXRoaW5nXCIsIFwic29tZXRoaW5nXCIsIFwiYW55dGhpbmdcIiwgXCJlYWNoXCIsIFwiYW5vdGhlclwiLCBcIm90aGVyXCIsIFwid2hhdGV2ZXJcIiwgXCJ3aGljaGV2ZXJcIiwgXCJ3aG9ldmVyXCIsIFwid2hvbWV2ZXJcIixcblx0XCJ3aG9tc29ldmVyXCIsIFwid2hvc29ldmVyXCIsIFwib3RoZXJzXCIsIFwibmVpdGhlclwiLCBcImJvdGhcIiwgXCJlaXRoZXJcIiwgXCJhbnlcIiwgXCJzdWNoXCIgXTtcbnZhciBpbmRlZmluaXRlUHJvbm91bnNQb3NzZXNzaXZlICA9IFsgXCJvbmUnc1wiLCBcIm5vYm9keSdzXCIsIFwiZXZlcnlvbmUnc1wiLCBcImV2ZXJ5Ym9keSdzXCIsIFwic29tZW9uZSdzXCIsIFwic29tZWJvZHknc1wiLCBcImFueW9uZSdzXCIsXG5cdFwiYW55Ym9keSdzXCIsIFwibm90aGluZydzXCIsIFwiZXZlcnl0aGluZydzXCIsIFwic29tZXRoaW5nJ3NcIiwgXCJhbnl0aGluZydzXCIsIFwid2hvZXZlcidzXCIsIFwib3RoZXJzJ1wiLCBcIm90aGVyJ3NcIiwgXCJhbm90aGVyJ3NcIixcblx0XCJuZWl0aGVyJ3NcIiwgXCJlaXRoZXInc1wiIF07XG5cbi8vIEFsbCByZWxhdGl2ZVByb25vdW5zIGFyZSBhbHJlYWR5IGluY2x1ZGVkIGluIG90aGVyIGxpc3RzIChpbnRlcnJvZ2F0aXZlRGV0ZXJtaW5lcnMsIGludGVycm9nYXRpdmVQcm9ub3VucylcbnZhciByZWxhdGl2ZVByb25vdW5zID0gW107XG52YXIgaW50ZXJyb2dhdGl2ZURldGVybWluZXJzID0gWyBcIndoaWNoXCIsIFwid2hhdFwiLCBcIndob3NlXCIgXTtcbnZhciBpbnRlcnJvZ2F0aXZlUHJvbm91bnMgPSBbIFwid2hvXCIsIFwid2hvbVwiIF07XG52YXIgaW50ZXJyb2dhdGl2ZVByb0FkdmVyYnMgPSBbIFwid2hlcmVcIiwgXCJ3aGl0aGVyXCIsIFwid2hlbmNlXCIsIFwiaG93XCIsIFwid2h5XCIsIFwid2hldGhlclwiLCBcIndoZXJldmVyXCIsIFwid2hvbWV2ZXJcIiwgXCJ3aGVuZXZlclwiLFxuXHRcImhvd2V2ZXJcIiwgXCJ3aHlldmVyXCIsIFwid2hvZXZlclwiLCBcIndoYXRldmVyXCIsIFwid2hlcmVzb2V2ZXJcIiwgXCJ3aG9tc29ldmVyXCIsIFwid2hlbnNvZXZlclwiLCBcImhvd3NvZXZlclwiLCBcIndoeXNvZXZlclwiLCBcIndob3NvZXZlclwiLFxuXHRcIndoYXRzb2V2ZXJcIiwgXCJ3aGVyZXNvXCIsIFwid2hvbXNvXCIsIFwid2hlbnNvXCIsIFwiaG93c29cIiwgXCJ3aHlzb1wiLCBcIndob3NvXCIsIFwid2hhdHNvXCIgXTtcbnZhciBwcm9ub21pbmFsQWR2ZXJicyA9IFsgXCJ0aGVyZWZvclwiLCBcInRoZXJlaW5cIiwgXCJoZXJlYnlcIiwgXCJoZXJldG9cIiwgXCJ3aGVyZWluXCIsIFwidGhlcmV3aXRoXCIsIFwiaGVyZXdpdGhcIiwgXCJ3aGVyZXdpdGhcIiwgXCJ0aGVyZWJ5XCIgXTtcbnZhciBsb2NhdGl2ZUFkdmVyYnMgPSBbIFwidGhlcmVcIiwgXCJoZXJlXCIsIFwid2hpdGhlclwiLCBcInRoaXRoZXJcIiwgXCJoaXRoZXJcIiwgXCJ3aGVuY2VcIiwgXCJ0aGVuY2VcIiwgXCJoZW5jZVwiIF07XG52YXIgYWR2ZXJiaWFsR2VuaXRpdmVzID0gWyBcImFsd2F5c1wiLCBcImFmdGVyd2FyZHNcIiwgXCJ0b3dhcmRzXCIsIFwib25jZVwiLCBcInR3aWNlXCIsIFwidGhyaWNlXCIsIFwiYW1pZHN0XCIsIFwiYW1vbmdzdFwiLCBcIm1pZHN0XCIsIFwid2hpbHN0XCIgXTtcbnZhciBvdGhlckF1eGlsaWFyaWVzID0gWyBcImNhblwiLCBcImNhbm5vdFwiLCBcImNhbid0XCIsIFwiY291bGRcIiwgXCJjb3VsZG4ndFwiLCBcImNvdWxkJ3ZlXCIsIFwiZGFyZVwiLCBcImRhcmVzXCIsIFwiZGFyZWRcIiwgXCJkYXJpbmdcIiwgXCJkb1wiLFxuXHRcImRvbid0XCIsIFwiZG9lc1wiLCBcImRvZXNuJ3RcIiwgXCJkaWRcIiwgXCJkaWRuJ3RcIiwgXCJkb2luZ1wiLCBcImRvbmVcIiwgXCJoYXZlXCIsIFwiaGF2ZW4ndFwiLCBcImhhZFwiLCBcImhhZG4ndFwiLCBcImhhc1wiLCBcImhhc24ndFwiLCBcImhhdmluZ1wiLFxuXHRcImkndmVcIiwgXCJ5b3UndmVcIiwgXCJ3ZSd2ZVwiLCBcInRoZXkndmVcIiwgXCJpJ2RcIiwgXCJ5b3UnZFwiLCBcImhlJ2RcIiwgXCJzaGUnZFwiLCBcIml0J2RcIiwgXCJ3ZSdkXCIsIFwidGhleSdkXCIsIFwid291bGRcIiwgXCJ3b3VsZG4ndFwiLFxuXHRcIndvdWxkJ3ZlXCIsIFwibWF5XCIsIFwibWlnaHRcIiwgXCJtdXN0XCIsIFwibmVlZFwiLCBcIm5lZWRuJ3RcIiwgXCJuZWVkc1wiLCBcIm91Z2h0XCIsIFwic2hhbGxcIiwgXCJzaGFsbG4ndFwiLCBcInNoYW4ndFwiLCBcInNob3VsZFwiLFxuXHRcInNob3VsZG4ndFwiLCBcIndpbGxcIiwgXCJ3b24ndFwiLCBcImknbGxcIiwgXCJ5b3UnbGxcIiwgXCJoZSdsbFwiLCBcInNoZSdsbFwiLCBcIml0J2xsXCIsIFwid2UnbGxcIiwgXCJ0aGV5J2xsXCIsIFwidGhlcmUnc1wiLCBcInRoZXJlJ3JlXCIsXG5cdFwidGhlcmUnbGxcIiwgXCJoZXJlJ3NcIiwgXCJoZXJlJ3JlXCIsIFwidGhlcmUnbGxcIiBdO1xudmFyIGNvcHVsYSA9IFsgXCJhcHBlYXJcIiwgXCJhcHBlYXJzXCIsIFwiYXBwZWFyaW5nXCIsIFwiYXBwZWFyZWRcIiwgXCJiZWNvbWVcIiwgXCJiZWNvbWVzXCIsIFwiYmVjb21pbmdcIiwgXCJiZWNhbWVcIiwgXCJjb21lXCIsIFwiY29tZXNcIixcblx0XCJjb21pbmdcIiwgXCJjYW1lXCIsIFwia2VlcFwiLCBcImtlZXBzXCIsIFwia2VwdFwiLCBcImtlZXBpbmdcIiwgXCJyZW1haW5cIiwgXCJyZW1haW5zXCIsIFwicmVtYWluaW5nXCIsIFwicmVtYWluZWRcIiwgXCJzdGF5XCIsXG5cdFwic3RheXNcIiwgXCJzdGF5ZWRcIiwgXCJzdGF5aW5nXCIsIFwidHVyblwiLCBcInR1cm5zXCIsIFwidHVybmVkXCIgXTtcblxudmFyIHByZXBvc2l0aW9ucyA9IFsgXCJpblwiLCBcImZyb21cIiwgXCJ3aXRoXCIsIFwidW5kZXJcIiwgXCJ0aHJvdWdob3V0XCIsIFwiYXRvcFwiLCBcImZvclwiLCBcIm9uXCIsIFwidW50aWxcIiwgXCJvZlwiLCBcInRvXCIsIFwiYWJvYXJkXCIsIFwiYWJvdXRcIixcblx0XCJhYm92ZVwiLCBcImFicmVhc3RcIiwgXCJhYnNlbnRcIiwgXCJhY3Jvc3NcIiwgXCJhZGphY2VudFwiLCBcImFmdGVyXCIsIFwiYWdhaW5zdFwiLCBcImFsb25nXCIsIFwiYWxvbmdzaWRlXCIsIFwiYW1pZFwiLCBcIm1pZHN0XCIsIFwibWlkXCIsXG5cdFwiYW1vbmdcIiwgXCJhcHJvcG9zXCIsIFwiYXB1ZFwiLCBcImFyb3VuZFwiLCBcImFzXCIsIFwiYXN0cmlkZVwiLCBcImF0XCIsIFwib250b3BcIiwgXCJiZWZvcmVcIiwgXCJhZm9yZVwiLCBcInRvZm9yZVwiLCBcImJlaGluZFwiLCBcImFoaW5kXCIsXG5cdFwiYmVsb3dcIiwgXCJhYmxvd1wiLCBcImJlbmVhdGhcIiwgXCJuZWF0aFwiLCBcImJlc2lkZVwiLCBcImJlc2lkZXNcIiwgXCJiZXR3ZWVuXCIsIFwiYXR3ZWVuXCIsIFwiYmV5b25kXCIsIFwiYXlvbmRcIiwgXCJidXRcIiwgXCJieVwiLCBcImNoZXpcIixcblx0XCJjaXJjYVwiLCBcImNvbWVcIiwgXCJkZXNwaXRlXCIsIFwic3BpdGVcIiwgXCJkb3duXCIsIFwiZHVyaW5nXCIsIFwiZXhjZXB0XCIsIFwiaW50b1wiLCBcImxlc3NcIiwgXCJsaWtlXCIsIFwibWludXNcIiwgXCJuZWFyXCIsIFwibmVhcmVyXCIsXG5cdFwibmVhcmVzdFwiLCBcImFuZWFyXCIsIFwibm90d2l0aHN0YW5kaW5nXCIsIFwib2ZmXCIsIFwib250b1wiLCBcIm9wcG9zaXRlXCIsIFwib3V0XCIsIFwib3V0ZW5cIiwgXCJvdmVyXCIsIFwicGFzdFwiLCBcInBlclwiLCBcInByZVwiLCBcInF1YVwiLFxuXHRcInNhbnNcIiwgXCJzYXVmXCIsIFwic2luY2VcIiwgXCJzaXRoZW5jZVwiLCBcInRoYW5cIiwgXCJ0aHJvdWdoXCIsIFwidGhydVwiLCBcInRydW91dFwiLCBcInRvd2FyZFwiLCBcInVuZGVybmVhdGhcIiwgXCJ1bmxpa2VcIiwgXCJ1bnRpbFwiLFxuXHRcInVwXCIsIFwidXBvblwiLCBcInVwc2lkZVwiLCBcInZlcnN1c1wiLCBcInZpYVwiLCBcInZpcy3DoC12aXNcIiwgXCJ3aXRob3V0XCIsIFwiYWdvXCIsIFwiYXBhcnRcIiwgXCJhc2lkZVwiLCBcImFzbGFudFwiLCBcImF3YXlcIiwgXCJ3aXRoYWxcIiBdO1xuXG4vLyBNYW55IHByZXBvc2l0aW9uYWwgYWR2ZXJicyBhcmUgYWxyZWFkeSBsaXN0ZWQgYXMgcHJlcG9zaXRpb24uXG52YXIgcHJlcG9zaXRpb25hbEFkdmVyYnMgPSBbIFwiYmFja1wiLCBcIndpdGhpblwiLCBcImZvcndhcmRcIiwgXCJiYWNrd2FyZFwiLCBcImFoZWFkXCIgXTtcblxudmFyIGNvb3JkaW5hdGluZ0Nvbmp1bmN0aW9ucyA9IFsgXCJzb1wiLCBcImFuZFwiLCBcIm5vclwiLCBcImJ1dFwiLCBcIm9yXCIsIFwieWV0XCIsIFwiZm9yXCIgXTtcblxuLy8gJ1JhdGhlcicgaXMgcGFydCBvZiAncmF0aGVyLi4udGhhbicsICdzb29uZXInIGlzIHBhcnQgb2YgJ25vIHNvb25lci4uLnRoYW4nLCAnanVzdCcgaXMgcGFydCBvZiAnanVzdCBhcy4uLnNvJyxcbi8vICdPbmx5JyBpcyBwYXJ0IG9mICdub3Qgb25seS4uLmJ1dCBhbHNvJy5cbnZhciBjb3JyZWxhdGl2ZUNvbmp1bmN0aW9ucyA9IFsgXCJyYXRoZXJcIiwgXCJzb29uZXJcIiwgXCJqdXN0XCIsIFwib25seVwiIF07XG52YXIgc3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9ucyA9IFsgXCJhZnRlclwiLCBcImFsdGhvdWdoXCIsIFwid2hlblwiLCBcImFzXCIsIFwiaWZcIiwgXCJ0aG91Z2hcIiwgXCJiZWNhdXNlXCIsIFwiYmVmb3JlXCIsIFwiZXZlblwiLCBcInNpbmNlXCIsIFwidW5sZXNzXCIsXG5cdFwid2hlcmVhc1wiLCBcIndoaWxlXCIgXTtcblxuLy8gVGhlc2UgdmVyYnMgYXJlIGZyZXF1ZW50bHkgdXNlZCBpbiBpbnRlcnZpZXdzIHRvIGluZGljYXRlIHF1ZXN0aW9ucyBhbmQgYW5zd2Vycy5cbi8vICdDbGFpbScsJ2NsYWltcycsICdzdGF0ZScgYW5kICdzdGF0ZWQnIGFyZSBub3QgaW5jbHVkZWQsIGJlY2F1c2UgdGhlc2Ugd29yZHMgYXJlIGFsc28gbm91bnMuXG52YXIgaW50ZXJ2aWV3VmVyYnMgPSBbIFwic2F5XCIsIFwic2F5c1wiLCBcInNhaWRcIiwgXCJzYXlpbmdcIiwgXCJjbGFpbWVkXCIsIFwiYXNrXCIsIFwiYXNrc1wiLCBcImFza2VkXCIsIFwiYXNraW5nXCIsIFwic3RhdGVkXCIsIFwic3RhdGluZ1wiLFxuXHRcImV4cGxhaW5cIiwgXCJleHBsYWluc1wiLCBcImV4cGxhaW5lZFwiLCBcInRoaW5rXCIsIFwidGhpbmtzXCIgXTtcblxuLy8gVGhlc2UgdHJhbnNpdGlvbiB3b3JkcyB3ZXJlIG5vdCBpbmNsdWRlZCBpbiB0aGUgbGlzdCBmb3IgdGhlIHRyYW5zaXRpb24gd29yZCBhc3Nlc3NtZW50IGZvciB2YXJpb3VzIHJlYXNvbnMuXG52YXIgYWRkaXRpb25hbFRyYW5zaXRpb25Xb3JkcyA9IFsgXCJhbmRcIiwgXCJvclwiLCBcImFib3V0XCIsIFwiYWJzb2x1dGVseVwiLCBcImFnYWluXCIsIFwiZGVmaW5pdGVseVwiLCBcImV0ZXJuYWxseVwiLCBcImV4cHJlc3NpdmVseVwiLFxuXHRcImV4cHJlc3NseVwiLCBcImV4dHJlbWVseVwiLCBcImltbWVkaWF0ZWx5XCIsIFwiaW5jbHVkaW5nXCIsIFwiaW5zdGFudGx5XCIsIFwibmFtZWx5XCIsIFwibmF0dXJhbGx5XCIsIFwibmV4dFwiLCBcIm5vdGFibHlcIiwgXCJub3dcIiwgXCJub3dhZGF5c1wiLFxuXHRcIm9yZGluYXJpbHlcIiwgXCJwb3NpdGl2ZWx5XCIsIFwidHJ1bHlcIiwgXCJ1bHRpbWF0ZWx5XCIsIFwidW5pcXVlbHlcIiwgXCJ1c3VhbGx5XCIsIFwiYWxtb3N0XCIsIFwiZmlyc3RcIiwgXCJzZWNvbmRcIiwgXCJ0aGlyZFwiLCBcIm1heWJlXCIsXG5cdFwicHJvYmFibHlcIiwgXCJncmFudGVkXCIsIFwiaW5pdGlhbGx5XCIsIFwib3ZlcmFsbFwiLCBcInRvb1wiLCBcImFjdHVhbGx5XCIsIFwiYWxyZWFkeVwiLCBcImUuZ1wiLCBcImkuZVwiLCBcIm9mdGVuXCIsIFwicmVndWxhcmx5XCIsIFwic2ltcGx5XCIsXG5cdFwib3B0aW9uYWxseVwiLCBcInBlcmhhcHNcIiwgXCJzb21ldGltZXNcIiwgXCJsaWtlbHlcIiwgXCJuZXZlclwiLCBcImV2ZXJcIiwgXCJlbHNlXCIsIFwiaW5hc211Y2hcIiwgXCJwcm92aWRlZFwiLCBcImN1cnJlbnRseVwiLCBcImluY2lkZW50YWxseVwiLFxuXHRcImVsc2V3aGVyZVwiLCBcImZvbGxvd2luZ1wiLCBcInBhcnRpY3VsYXJcIiwgXCJyZWNlbnRseVwiLCBcInJlbGF0aXZlbHlcIiwgXCJmLmlcIiwgXCJjbGVhcmx5XCIsIFwiYXBwYXJlbnRseVwiIF07XG5cbnZhciBpbnRlbnNpZmllcnMgPSBbIFwiaGlnaGx5XCIsIFwidmVyeVwiLCBcInJlYWxseVwiLCBcImV4dHJlbWVseVwiLCBcImFic29sdXRlbHlcIiwgXCJjb21wbGV0ZWx5XCIsIFwidG90YWxseVwiLCBcInV0dGVybHlcIiwgXCJxdWl0ZVwiLFxuXHRcInNvbWV3aGF0XCIsIFwic2VyaW91c2x5XCIsIFwiZmFpcmx5XCIsIFwiZnVsbHlcIiwgXCJhbWF6aW5nbHlcIiBdO1xuXG4vLyBUaGVzZSB2ZXJicyBjb252ZXkgbGl0dGxlIG1lYW5pbmcuICdTaG93JywgJ3Nob3dzJywgJ3VzZXMnLCBcIm1lYW5pbmdcIiBhcmUgbm90IGluY2x1ZGVkLCBiZWNhdXNlIHRoZXNlIHdvcmRzIGNvdWxkIGJlIHJlbGV2YW50IG5vdW5zLlxudmFyIGRlbGV4aWNhbGlzZWRWZXJicyA9IFsgXCJzZWVtXCIsIFwic2VlbXNcIiwgXCJzZWVtZWRcIiwgXCJzZWVtaW5nXCIsIFwibGV0XCIsIFwibGV0J3NcIiwgXCJsZXRzXCIsIFwibGV0dGluZ1wiLCBcIm1ha2VcIiwgXCJtYWtpbmdcIiwgXCJtYWtlc1wiLFxuXHRcIm1hZGVcIiwgXCJ3YW50XCIsIFwic2hvd2luZ1wiLCBcInNob3dlZFwiLCBcInNob3duXCIsIFwiZ29cIiwgXCJnb2VzXCIsIFwiZ29pbmdcIiwgXCJ3ZW50XCIsIFwiZ29uZVwiLCBcInRha2VcIiwgXCJ0YWtlc1wiLCBcInRvb2tcIiwgXCJ0YWtlblwiLCBcInNldFwiLCBcInNldHNcIixcblx0XCJzZXR0aW5nXCIsIFwicHV0XCIsIFwicHV0c1wiLCBcInB1dHRpbmdcIiwgXCJ1c2VcIiwgXCJ1c2luZ1wiLCBcInVzZWRcIiwgXCJ0cnlcIiwgXCJ0cmllc1wiLCBcInRyaWVkXCIsIFwidHJ5aW5nXCIsIFwibWVhblwiLCBcIm1lYW5zXCIsIFwibWVhbnRcIixcblx0XCJjYWxsZWRcIiwgXCJiYXNlZFwiLCBcImFkZFwiLCBcImFkZHNcIiwgXCJhZGRpbmdcIiwgXCJhZGRlZFwiLCBcImNvbnRhaW5cIiwgXCJjb250YWluc1wiLCBcImNvbnRhaW5pbmdcIiwgXCJjb250YWluZWRcIiBdO1xuXG4vLyBUaGVzZSBhZGplY3RpdmVzIGFuZCBhZHZlcmJzIGFyZSBzbyBnZW5lcmFsLCB0aGV5IHNob3VsZCBuZXZlciBiZSBzdWdnZXN0ZWQgYXMgYSAoc2luZ2xlKSBrZXl3b3JkLlxuLy8gS2V5IHdvcmQgY29tYmluYXRpb25zIGNvbnRhaW5pbmcgdGhlc2UgYWRqZWN0aXZlcy9hZHZlcmJzIGFyZSBmaW5lLlxudmFyIGdlbmVyYWxBZGplY3RpdmVzQWR2ZXJicyA9IFsgXCJuZXdcIiwgXCJuZXdlclwiLCBcIm5ld2VzdFwiLCBcIm9sZFwiLCBcIm9sZGVyXCIsIFwib2xkZXN0XCIsIFwicHJldmlvdXNcIiwgXCJnb29kXCIsIFwid2VsbFwiLCBcImJldHRlclwiLCBcImJlc3RcIixcblx0XCJiaWdcIiwgXCJiaWdnZXJcIiwgXCJiaWdnZXN0XCIsIFwiZWFzeVwiLCBcImVhc2llclwiLCBcImVhc2llc3RcIiwgXCJmYXN0XCIsIFwiZmFzdGVyXCIsIFwiZmFzdGVzdFwiLCBcImZhclwiLCBcImhhcmRcIiwgXCJoYXJkZXJcIiwgXCJoYXJkZXN0XCIsXG5cdFwibGVhc3RcIiwgXCJvd25cIiwgXCJsYXJnZVwiLCBcImxhcmdlclwiLCBcImxhcmdlc3RcIiwgXCJsb25nXCIsIFwibG9uZ2VyXCIsIFwibG9uZ2VzdFwiLCBcImxvd1wiLCBcImxvd2VyXCIsIFwibG93ZXN0XCIsIFwiaGlnaFwiLCBcImhpZ2hlclwiLFxuXHRcImhpZ2hlc3RcIiwgXCJyZWd1bGFyXCIsIFwic2ltcGxlXCIsIFwic2ltcGxlclwiLCBcInNpbXBsZXN0XCIsIFwic21hbGxcIiwgXCJzbWFsbGVyXCIsIFwic21hbGxlc3RcIiwgXCJ0aW55XCIsIFwidGluaWVyXCIsIFwidGluaWVzdFwiLFxuXHRcInNob3J0XCIsIFwic2hvcnRlclwiLCBcInNob3J0ZXN0XCIsIFwibWFpblwiLCBcImFjdHVhbFwiLCBcIm5pY2VcIiwgXCJuaWNlclwiLCBcIm5pY2VzdFwiLCBcInJlYWxcIiwgXCJzYW1lXCIsIFwiYWJsZVwiLCBcImNlcnRhaW5cIiwgXCJ1c3VhbFwiLFxuXHRcInNvLWNhbGxlZFwiLCBcIm1haW5seVwiLCBcIm1vc3RseVwiLCBcInJlY2VudFwiLCBcImFueW1vcmVcIiwgXCJjb21wbGV0ZVwiLCBcImxhdGVseVwiLCBcInBvc3NpYmxlXCIsIFwiY29tbW9ubHlcIiwgXCJjb25zdGFudGx5XCIsXG5cdFwiY29udGludWFsbHlcIiwgXCJkaXJlY3RseVwiLCBcImVhc2lseVwiLCBcIm5lYXJseVwiLCBcInNsaWdodGx5XCIsIFwic29tZXdoZXJlXCIsIFwiZXN0aW1hdGVkXCIsIFwibGF0ZXN0XCIsIFwiZGlmZmVyZW50XCIsIFwic2ltaWxhclwiLFxuXHRcIndpZGVseVwiLCBcImJhZFwiLCBcIndvcnNlXCIsIFwid29yc3RcIiwgXCJncmVhdFwiIF07XG5cbnZhciBpbnRlcmplY3Rpb25zID0gWyBcIm9oXCIsIFwid293XCIsIFwidHV0LXR1dFwiLCBcInRzay10c2tcIiwgXCJ1Z2hcIiwgXCJ3aGV3XCIsIFwicGhld1wiLCBcInllYWhcIiwgXCJ5ZWFcIiwgXCJzaGhcIiwgXCJvb3BzXCIsIFwib3VjaFwiLCBcImFoYVwiLFxuXHRcInlpa2VzXCIgXTtcblxuLy8gVGhlc2Ugd29yZHMgYW5kIGFiYnJldmlhdGlvbnMgYXJlIGZyZXF1ZW50bHkgdXNlZCBpbiByZWNpcGVzIGluIGxpc3RzIG9mIGluZ3JlZGllbnRzLlxudmFyIHJlY2lwZVdvcmRzID0gWyBcInRic1wiLCBcInRic3BcIiwgXCJzcGtcIiwgXCJsYlwiLCBcInF0XCIsIFwicGtcIiwgXCJidVwiLCBcIm96XCIsIFwicHRcIiwgXCJtb2RcIiwgXCJkb3pcIiwgXCJoclwiLCBcImYuZ1wiLCBcIm1sXCIsIFwiZGxcIiwgXCJjbFwiLFxuXHRcImxcIiwgXCJtZ1wiLCBcImdcIiwgXCJrZ1wiLCBcInF1YXJ0XCIgXTtcblxuLy8gJ1Blb3BsZScgc2hvdWxkIG9ubHkgYmUgcmVtb3ZlZCBpbiBjb21iaW5hdGlvbiB3aXRoICdzb21lJywgJ21hbnknIGFuZCAnZmV3JyAoYW5kIGlzIHRoZXJlZm9yZSBub3QgeWV0IGluY2x1ZGVkIGluIHRoZSBsaXN0IGJlbG93KS5cbnZhciB2YWd1ZU5vdW5zID0gWyBcInRoaW5nXCIsIFwidGhpbmdzXCIsIFwid2F5XCIsIFwid2F5c1wiLCBcIm1hdHRlclwiLCBcImNhc2VcIiwgXCJsaWtlbGlob29kXCIsIFwib25lc1wiLCBcInBpZWNlXCIsIFwicGllY2VzXCIsIFwic3R1ZmZcIiwgXCJ0aW1lc1wiLFxuXHRcInBhcnRcIiwgXCJwYXJ0c1wiLCBcInBlcmNlbnRcIiwgXCJpbnN0YW5jZVwiLCBcImluc3RhbmNlc1wiLCBcImFzcGVjdFwiLCBcImFzcGVjdHNcIiwgXCJpdGVtXCIsIFwiaXRlbXNcIiwgXCJwZW9wbGVcIiwgXCJpZGVhXCIsIFwidGhlbWVcIixcblx0XCJwZXJzb25cIiwgXCJwZXJjZW50XCIgXTtcblxuLy8gJ05vJyBpcyBhbHJlYWR5IGluY2x1ZGVkIGluIHRoZSBxdWFudGlmaWVyIGxpc3QuXG52YXIgbWlzY2VsbGFuZW91cyA9IFsgXCJub3RcIiwgXCJ5ZXNcIiwgXCJyaWRcIiwgXCJzdXJlXCIsIFwidG9wXCIsIFwiYm90dG9tXCIsIFwib2tcIiwgXCJva2F5XCIsIFwiYW1lblwiLCBcImFrYVwiLCBcIiVcIiBdO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdGFydGljbGVzOiBhcnRpY2xlcyxcblx0XHRwZXJzb25hbFByb25vdW5zOiBwZXJzb25hbFByb25vdW5zTm9taW5hdGl2ZS5jb25jYXQoIHBlcnNvbmFsUHJvbm91bnNBY2N1c2F0aXZlLCBwb3NzZXNzaXZlUHJvbm91bnMgKSxcblx0XHRwcmVwb3NpdGlvbnM6IHByZXBvc2l0aW9ucyxcblx0XHRkZW1vbnN0cmF0aXZlUHJvbm91bnM6IGRlbW9uc3RyYXRpdmVQcm9ub3Vucyxcblx0XHRjb25qdW5jdGlvbnM6IGNvb3JkaW5hdGluZ0Nvbmp1bmN0aW9ucy5jb25jYXQoIHN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbnMgKSxcblx0XHR2ZXJiczogZmlsdGVyZWRQYXNzaXZlQXV4aWxpYXJpZXMuY29uY2F0KCBub3RGaWx0ZXJlZFBhc3NpdmVBdXhpbGlhcmllcywgb3RoZXJBdXhpbGlhcmllcywgY29wdWxhLCBpbnRlcnZpZXdWZXJicywgZGVsZXhpY2FsaXNlZFZlcmJzICksXG5cdFx0cXVhbnRpZmllcnM6IHF1YW50aWZpZXJzLFxuXHRcdHJlbGF0aXZlUHJvbm91bnM6IGludGVycm9nYXRpdmVEZXRlcm1pbmVycy5jb25jYXQoIGludGVycm9nYXRpdmVQcm9ub3VucywgaW50ZXJyb2dhdGl2ZVByb0FkdmVyYnMgKSxcblx0XHRmaWx0ZXJlZFBhc3NpdmVBdXhpbGlhcmllczogZmlsdGVyZWRQYXNzaXZlQXV4aWxpYXJpZXMsXG5cdFx0YWxsOiBhcnRpY2xlcy5jb25jYXQoIG51bWVyYWxzLCBkZW1vbnN0cmF0aXZlUHJvbm91bnMsIHBvc3Nlc3NpdmVQcm9ub3VucywgcmVmbGV4aXZlUHJvbm91bnMsXG5cdFx0XHRwZXJzb25hbFByb25vdW5zTm9taW5hdGl2ZSwgcGVyc29uYWxQcm9ub3Vuc0FjY3VzYXRpdmUsIHJlbGF0aXZlUHJvbm91bnMsIHF1YW50aWZpZXJzLCBpbmRlZmluaXRlUHJvbm91bnMsXG5cdFx0XHRpbmRlZmluaXRlUHJvbm91bnNQb3NzZXNzaXZlLCBpbnRlcnJvZ2F0aXZlRGV0ZXJtaW5lcnMsIGludGVycm9nYXRpdmVQcm9ub3VucywgaW50ZXJyb2dhdGl2ZVByb0FkdmVyYnMsXG5cdFx0XHRwcm9ub21pbmFsQWR2ZXJicywgbG9jYXRpdmVBZHZlcmJzLCBhZHZlcmJpYWxHZW5pdGl2ZXMsIHByZXBvc2l0aW9uYWxBZHZlcmJzLCBmaWx0ZXJlZFBhc3NpdmVBdXhpbGlhcmllcywgbm90RmlsdGVyZWRQYXNzaXZlQXV4aWxpYXJpZXMsXG5cdFx0XHRvdGhlckF1eGlsaWFyaWVzLCBjb3B1bGEsIHByZXBvc2l0aW9ucywgY29vcmRpbmF0aW5nQ29uanVuY3Rpb25zLCBjb3JyZWxhdGl2ZUNvbmp1bmN0aW9ucywgc3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9ucywgaW50ZXJ2aWV3VmVyYnMsXG5cdFx0XHR0cmFuc2l0aW9uV29yZHMsIGFkZGl0aW9uYWxUcmFuc2l0aW9uV29yZHMsIGludGVuc2lmaWVycywgZGVsZXhpY2FsaXNlZFZlcmJzLCBpbnRlcmplY3Rpb25zLCBnZW5lcmFsQWRqZWN0aXZlc0FkdmVyYnMsXG5cdFx0XHRyZWNpcGVXb3JkcywgdmFndWVOb3VucywgbWlzY2VsbGFuZW91cyApLFxuXHR9O1xufTtcbiIsIi8vIFRoZXNlIGF1eGlsaWFyaWVzIGFyZSBmaWx0ZXJlZCBmcm9tIHRoZSBiZWdpbm5pbmcgb2Ygd29yZCBjb21iaW5hdGlvbnMgaW4gdGhlIGtleXdvcmQgc3VnZ2VzdGlvbnMuXG52YXIgZmlsdGVyZWRBdXhpbGlhcmllcyA9ICBbXG5cdFwiYW1cIixcblx0XCJpc1wiLFxuXHRcImFyZVwiLFxuXHRcIndhc1wiLFxuXHRcIndlcmVcIixcblx0XCJiZWVuXCIsXG5cdFwiZ2V0XCIsXG5cdFwiZ2V0c1wiLFxuXHRcImdvdFwiLFxuXHRcImdvdHRlblwiLFxuXHRcImJlXCIsXG5cdFwic2hlJ3NcIixcblx0XCJoZSdzXCIsXG5cdFwiaXQnc1wiLFxuXHRcImknbVwiLFxuXHRcIndlJ3JlXCIsXG5cdFwidGhleSdyZVwiLFxuXHRcInlvdSdyZVwiLFxuXHRcImlzbid0XCIsXG5cdFwid2VyZW4ndFwiLFxuXHRcIndhc24ndFwiLFxuXHRcInRoYXQnc1wiLFxuXHRcImFyZW4ndFwiLFxuXTtcblxuLy8gVGhlc2UgYXV4aWxpYXJpZXMgYXJlIG5vdCBmaWx0ZXJlZCBmcm9tIHRoZSBiZWdpbm5pbmcgb2Ygd29yZCBjb21iaW5hdGlvbnMgaW4gdGhlIGtleXdvcmQgc3VnZ2VzdGlvbnMuXG52YXIgbm90RmlsdGVyZWRBdXhpbGlhcmllcyA9IFtcblx0XCJiZWluZ1wiLFxuXHRcImdldHRpbmdcIixcblx0XCJoYXZpbmdcIixcblx0XCJ3aGF0J3NcIixcbl07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0ZmlsdGVyZWRBdXhpbGlhcmllczogZmlsdGVyZWRBdXhpbGlhcmllcyxcblx0XHRub3RGaWx0ZXJlZEF1eGlsaWFyaWVzOiBub3RGaWx0ZXJlZEF1eGlsaWFyaWVzLFxuXHRcdGFsbDogZmlsdGVyZWRBdXhpbGlhcmllcy5jb25jYXQoIG5vdEZpbHRlcmVkQXV4aWxpYXJpZXMgKSxcblx0fTtcbn07XG4iLCIvKiogQG1vZHVsZSBjb25maWcvdHJhbnNpdGlvbldvcmRzICovXG5cbnZhciBzaW5nbGVXb3JkcyA9IFsgXCJhY2NvcmRpbmdseVwiLCBcImFkZGl0aW9uYWxseVwiLCBcImFmdGVyd2FyZFwiLCBcImFmdGVyd2FyZHNcIiwgXCJhbGJlaXRcIiwgXCJhbHNvXCIsIFwiYWx0aG91Z2hcIiwgXCJhbHRvZ2V0aGVyXCIsXG5cdCBcImFub3RoZXJcIiwgXCJiYXNpY2FsbHlcIiwgXCJiZWNhdXNlXCIsIFwiYmVmb3JlXCIsIFwiYmVzaWRlc1wiLCBcImJ1dFwiLCBcImNlcnRhaW5seVwiLCBcImNoaWVmbHlcIiwgXCJjb21wYXJhdGl2ZWx5XCIsXG5cdFwiY29uY3VycmVudGx5XCIsIFwiY29uc2VxdWVudGx5XCIsIFwiY29udHJhcmlseVwiLCBcImNvbnZlcnNlbHlcIiwgXCJjb3JyZXNwb25kaW5nbHlcIiwgXCJkZXNwaXRlXCIsIFwiZG91YnRlZGx5XCIsIFwiZHVyaW5nXCIsXG5cdFwiZS5nLlwiLCBcImVhcmxpZXJcIiwgXCJlbXBoYXRpY2FsbHlcIiwgXCJlcXVhbGx5XCIsIFwiZXNwZWNpYWxseVwiLCBcImV2ZW50dWFsbHlcIiwgXCJldmlkZW50bHlcIiwgXCJleHBsaWNpdGx5XCIsIFwiZmluYWxseVwiLFxuXHRcImZpcnN0bHlcIiwgXCJmb2xsb3dpbmdcIiwgXCJmb3JtZXJseVwiLCBcImZvcnRod2l0aFwiLCBcImZvdXJ0aGx5XCIsIFwiZnVydGhlclwiLCBcImZ1cnRoZXJtb3JlXCIsIFwiZ2VuZXJhbGx5XCIsIFwiaGVuY2VcIixcblx0XCJoZW5jZWZvcnRoXCIsIFwiaG93ZXZlclwiLCBcImkuZS5cIiwgXCJpZGVudGljYWxseVwiLCBcImluZGVlZFwiLCBcImluc3RlYWRcIiwgXCJsYXN0XCIsIFwibGFzdGx5XCIsIFwibGF0ZXJcIiwgXCJsZXN0XCIsIFwibGlrZXdpc2VcIixcblx0XCJtYXJrZWRseVwiLCBcIm1lYW53aGlsZVwiLCBcIm1vcmVvdmVyXCIsIFwibmV2ZXJ0aGVsZXNzXCIsIFwibm9uZXRoZWxlc3NcIiwgXCJub3JcIiwgIFwibm90d2l0aHN0YW5kaW5nXCIsIFwib2J2aW91c2x5XCIsXG5cdFwib2NjYXNpb25hbGx5XCIsIFwib3RoZXJ3aXNlXCIsIFwib3ZlcmFsbFwiLCBcInBhcnRpY3VsYXJseVwiLCBcInByZXNlbnRseVwiLCBcInByZXZpb3VzbHlcIiwgXCJyYXRoZXJcIiwgXCJyZWdhcmRsZXNzXCIsIFwic2Vjb25kbHlcIixcblx0XCJzaG9ydGx5XCIsIFwic2lnbmlmaWNhbnRseVwiLCBcInNpbWlsYXJseVwiLCBcInNpbXVsdGFuZW91c2x5XCIsIFwic2luY2VcIiwgXCJzb1wiLCBcInNvb25cIiwgXCJzcGVjaWZpY2FsbHlcIiwgXCJzdGlsbFwiLCBcInN0cmFpZ2h0YXdheVwiLFxuXHRcInN1YnNlcXVlbnRseVwiLCBcInN1cmVseVwiLCBcInN1cnByaXNpbmdseVwiLCBcInRoYW5cIiwgXCJ0aGVuXCIsIFwidGhlcmVhZnRlclwiLCBcInRoZXJlZm9yZVwiLCBcInRoZXJldXBvblwiLCBcInRoaXJkbHlcIiwgXCJ0aG91Z2hcIixcblx0XCJ0aHVzXCIsIFwidGlsbFwiLCBcInRvb1wiLCBcInVuZGVuaWFibHlcIiwgXCJ1bmRvdWJ0ZWRseVwiLCBcInVubGVzc1wiLCBcInVubGlrZVwiLCBcInVucXVlc3Rpb25hYmx5XCIsIFwidW50aWxcIiwgXCJ3aGVuXCIsIFwid2hlbmV2ZXJcIixcblx0XCJ3aGVyZWFzXCIsIFwid2hpbGVcIiBdO1xudmFyIG11bHRpcGxlV29yZHMgPSBbIFwiYWJvdmUgYWxsXCIsIFwiYWZ0ZXIgYWxsXCIsIFwiYWZ0ZXIgdGhhdFwiLCBcImFsbCBpbiBhbGxcIiwgXCJhbGwgb2YgYSBzdWRkZW5cIiwgXCJhbGwgdGhpbmdzIGNvbnNpZGVyZWRcIixcblx0XCJhbmFsb2dvdXMgdG9cIiwgXCJhbHRob3VnaCB0aGlzIG1heSBiZSB0cnVlXCIsIFwiYW5hbG9nb3VzIHRvXCIsIFwiYW5vdGhlciBrZXkgcG9pbnRcIiwgXCJhcyBhIG1hdHRlciBvZiBmYWN0XCIsIFwiYXMgYSByZXN1bHRcIixcblx0XCJhcyBhbiBpbGx1c3RyYXRpb25cIiwgXHRcImFzIGNhbiBiZSBzZWVuXCIsIFwiYXMgaGFzIGJlZW4gbm90ZWRcIiwgXCJhcyBJIGhhdmUgbm90ZWRcIiwgXCJhcyBJIGhhdmUgc2FpZFwiLCBcImFzIEkgaGF2ZSBzaG93blwiLFxuXHRcImFzIGxvbmcgYXNcIiwgXCJhcyBtdWNoIGFzXCIsIFwiYXMgc2hvd24gYWJvdmVcIiwgXCJhcyBzb29uIGFzXCIsIFwiYXMgd2VsbCBhc1wiLCBcImF0IGFueSByYXRlXCIsIFwiYXQgZmlyc3RcIiwgXCJhdCBsYXN0XCIsXG5cdFwiYXQgbGVhc3RcIiwgXCJhdCBsZW5ndGhcIiwgXCJhdCB0aGUgcHJlc2VudCB0aW1lXCIsIFwiYXQgdGhlIHNhbWUgdGltZVwiLCBcImF0IHRoaXMgaW5zdGFudFwiLCBcImF0IHRoaXMgcG9pbnRcIiwgXCJhdCB0aGlzIHRpbWVcIixcblx0XCJiYWxhbmNlZCBhZ2FpbnN0XCIsIFwiYmVpbmcgdGhhdFwiLCBcImJ5IGFsbCBtZWFuc1wiLCBcImJ5IGFuZCBsYXJnZVwiLCBcImJ5IGNvbXBhcmlzb25cIiwgXCJieSB0aGUgc2FtZSB0b2tlblwiLCBcImJ5IHRoZSB0aW1lXCIsXG5cdFwiY29tcGFyZWQgdG9cIiwgXCJiZSB0aGF0IGFzIGl0IG1heVwiLCBcImNvdXBsZWQgd2l0aFwiLCBcImRpZmZlcmVudCBmcm9tXCIsIFwiZHVlIHRvXCIsIFwiZXF1YWxseSBpbXBvcnRhbnRcIiwgXCJldmVuIGlmXCIsXG5cdFwiZXZlbiBtb3JlXCIsIFwiZXZlbiBzb1wiLCBcImV2ZW4gdGhvdWdoXCIsIFwiZmlyc3QgdGhpbmcgdG8gcmVtZW1iZXJcIiwgXCJmb3IgZXhhbXBsZVwiLCBcImZvciBmZWFyIHRoYXRcIiwgXCJmb3IgaW5zdGFuY2VcIixcblx0XCJmb3Igb25lIHRoaW5nXCIsIFwiZm9yIHRoYXQgcmVhc29uXCIsIFwiZm9yIHRoZSBtb3N0IHBhcnRcIiwgXCJmb3IgdGhlIHB1cnBvc2Ugb2ZcIiwgXCJmb3IgdGhlIHNhbWUgcmVhc29uXCIsIFwiZm9yIHRoaXMgcHVycG9zZVwiLFxuXHRcImZvciB0aGlzIHJlYXNvblwiLCBcImZyb20gdGltZSB0byB0aW1lXCIsIFwiZ2l2ZW4gdGhhdFwiLCBcImdpdmVuIHRoZXNlIHBvaW50c1wiLCBcImltcG9ydGFudCB0byByZWFsaXplXCIsIFwiaW4gYSB3b3JkXCIsIFwiaW4gYWRkaXRpb25cIixcblx0XCJpbiBhbm90aGVyIGNhc2VcIiwgXCJpbiBhbnkgY2FzZVwiLCBcImluIGFueSBldmVudFwiLCBcImluIGJyaWVmXCIsIFwiaW4gY2FzZVwiLCBcImluIGNvbmNsdXNpb25cIiwgXCJpbiBjb250cmFzdFwiLFxuXHRcImluIGRldGFpbFwiLCBcImluIGR1ZSB0aW1lXCIsIFwiaW4gZWZmZWN0XCIsIFwiaW4gZWl0aGVyIGNhc2VcIiwgXCJpbiBlc3NlbmNlXCIsIFwiaW4gZmFjdFwiLCBcImluIGdlbmVyYWxcIiwgXCJpbiBsaWdodCBvZlwiLFxuXHRcImluIGxpa2UgZmFzaGlvblwiLCBcImluIGxpa2UgbWFubmVyXCIsIFwiaW4gb3JkZXIgdGhhdFwiLCBcImluIG9yZGVyIHRvXCIsIFwiaW4gb3RoZXIgd29yZHNcIiwgXCJpbiBwYXJ0aWN1bGFyXCIsIFwiaW4gcmVhbGl0eVwiLFxuXHRcImluIHNob3J0XCIsIFwiaW4gc2ltaWxhciBmYXNoaW9uXCIsIFwiaW4gc3BpdGUgb2ZcIiwgXCJpbiBzdW1cIiwgXCJpbiBzdW1tYXJ5XCIsIFwiaW4gdGhhdCBjYXNlXCIsIFwiaW4gdGhlIGV2ZW50IHRoYXRcIixcblx0XCJpbiB0aGUgZmluYWwgYW5hbHlzaXNcIiwgXCJpbiB0aGUgZmlyc3QgcGxhY2VcIiwgXCJpbiB0aGUgZm91cnRoIHBsYWNlXCIsIFwiaW4gdGhlIGhvcGUgdGhhdFwiLCBcImluIHRoZSBsaWdodCBvZlwiLFxuXHRcImluIHRoZSBsb25nIHJ1blwiLCBcImluIHRoZSBtZWFudGltZVwiLCBcImluIHRoZSBzYW1lIGZhc2hpb25cIiwgXCJpbiB0aGUgc2FtZSB3YXlcIiwgXCJpbiB0aGUgc2Vjb25kIHBsYWNlXCIsXG5cdFwiaW4gdGhlIHRoaXJkIHBsYWNlXCIsIFwiaW4gdGhpcyBjYXNlXCIsIFwiaW4gdGhpcyBzaXR1YXRpb25cIiwgXCJpbiB0aW1lXCIsIFwiaW4gdHJ1dGhcIiwgXCJpbiB2aWV3IG9mXCIsIFwiaW5hc211Y2ggYXNcIixcblx0XCJtb3N0IGNvbXBlbGxpbmcgZXZpZGVuY2VcIiwgXCJtb3N0IGltcG9ydGFudFwiLCBcIm11c3QgYmUgcmVtZW1iZXJlZFwiLCBcIm5vdCB0byBtZW50aW9uXCIsIFwibm93IHRoYXRcIiwgXCJvZiBjb3Vyc2VcIixcblx0XCJvbiBhY2NvdW50IG9mXCIsIFwib24gYmFsYW5jZVwiLCBcIm9uIGNvbmRpdGlvbiB0aGF0XCIsIFwib24gb25lIGhhbmRcIiwgXCJvbiB0aGUgY29uZGl0aW9uIHRoYXRcIiwgXCJvbiB0aGUgY29udHJhcnlcIixcblx0XCJvbiB0aGUgbmVnYXRpdmUgc2lkZVwiLCBcIm9uIHRoZSBvdGhlciBoYW5kXCIsIFwib24gdGhlIHBvc2l0aXZlIHNpZGVcIiwgXCJvbiB0aGUgd2hvbGVcIiwgXCJvbiB0aGlzIG9jY2FzaW9uXCIsIFwib25jZVwiLFxuXHRcIm9uY2UgaW4gYSB3aGlsZVwiLCBcdFwib25seSBpZlwiLCBcIm93aW5nIHRvXCIsIFwicG9pbnQgb2Z0ZW4gb3Zlcmxvb2tlZFwiLCBcInByaW9yIHRvXCIsIFwicHJvdmlkZWQgdGhhdFwiLCBcInNlZWluZyB0aGF0XCIsXG5cdFwic28gYXMgdG9cIiwgXCJzbyBmYXJcIiwgXCJzbyBsb25nIGFzXCIsIFwic28gdGhhdFwiLCBcInNvb25lciBvciBsYXRlclwiLCBcInN1Y2ggYXNcIiwgXCJzdW1taW5nIHVwXCIsIFwidGFrZSB0aGUgY2FzZSBvZlwiLFxuXHRcInRoYXQgaXNcIiwgXCJ0aGF0IGlzIHRvIHNheVwiLCBcInRoZW4gYWdhaW5cIiwgXCJ0aGlzIHRpbWVcIiwgXCJ0byBiZSBzdXJlXCIsIFwidG8gYmVnaW4gd2l0aFwiLCBcInRvIGNsYXJpZnlcIiwgXCJ0byBjb25jbHVkZVwiLFxuXHRcInRvIGRlbW9uc3RyYXRlXCIsIFwidG8gZW1waGFzaXplXCIsIFwidG8gZW51bWVyYXRlXCIsIFwidG8gZXhwbGFpblwiLCBcInRvIGlsbHVzdHJhdGVcIiwgXCJ0byBsaXN0XCIsIFwidG8gcG9pbnQgb3V0XCIsXG5cdFwidG8gcHV0IGl0IGFub3RoZXIgd2F5XCIsIFwidG8gcHV0IGl0IGRpZmZlcmVudGx5XCIsIFwidG8gcmVwZWF0XCIsIFwidG8gcmVwaHJhc2UgaXRcIiwgXCJ0byBzYXkgbm90aGluZyBvZlwiLCBcInRvIHN1bSB1cFwiLFxuXHRcInRvIHN1bW1hcml6ZVwiLCBcInRvIHRoYXQgZW5kXCIsIFwidG8gdGhlIGVuZCB0aGF0XCIsIFwidG8gdGhpcyBlbmRcIiwgXCJ0b2dldGhlciB3aXRoXCIsIFwidW5kZXIgdGhvc2UgY2lyY3Vtc3RhbmNlc1wiLCBcInVudGlsIG5vd1wiLFxuXHRcInVwIGFnYWluc3RcIiwgXCJ1cCB0byB0aGUgcHJlc2VudCB0aW1lXCIsIFwidmlzIGEgdmlzXCIsIFwid2hhdCdzIG1vcmVcIiwgXCJ3aGlsZSBpdCBtYXkgYmUgdHJ1ZVwiLCBcIndoaWxlIHRoaXMgbWF5IGJlIHRydWVcIixcblx0XCJ3aXRoIGF0dGVudGlvbiB0b1wiLCBcIndpdGggdGhlIHJlc3VsdCB0aGF0XCIsIFwid2l0aCB0aGlzIGluIG1pbmRcIiwgXCJ3aXRoIHRoaXMgaW50ZW50aW9uXCIsIFwid2l0aCB0aGlzIHB1cnBvc2UgaW4gbWluZFwiLFxuXHRcIndpdGhvdXQgYSBkb3VidFwiLCBcIndpdGhvdXQgZGVsYXlcIiwgXCJ3aXRob3V0IGRvdWJ0XCIsIFwid2l0aG91dCByZXNlcnZhdGlvblwiIF07XG5cbi8qKlxuICogUmV0dXJucyBhbiBhcnJheSB3aXRoIHRyYW5zaXRpb24gd29yZHMgdG8gYmUgdXNlZCBieSB0aGUgYXNzZXNzbWVudHMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBhcnJheSBmaWxsZWQgd2l0aCB0cmFuc2l0aW9uIHdvcmRzLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdHNpbmdsZVdvcmRzOiBzaW5nbGVXb3Jkcyxcblx0XHRtdWx0aXBsZVdvcmRzOiBtdWx0aXBsZVdvcmRzLFxuXHRcdGFsbFdvcmRzOiBzaW5nbGVXb3Jkcy5jb25jYXQoIG11bHRpcGxlV29yZHMgKVxuXHR9O1xufTtcbiIsIi8qKiBAbW9kdWxlIHN0cmluZ1Byb2Nlc3NpbmcvYWRkV29yZGJvdW5kYXJ5ICovXG5cbi8qKlxuICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGNhbiBiZSB1c2VkIGluIGEgcmVnZXggdG8gbWF0Y2ggYSBtYXRjaFN0cmluZyB3aXRoIHdvcmQgYm91bmRhcmllcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWF0Y2hTdHJpbmcgVGhlIHN0cmluZyB0byBnZW5lcmF0ZSBhIHJlZ2V4IHN0cmluZyBmb3IuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2V4dHJhV29yZEJvdW5kYXJ5XSBFeHRyYSBjaGFyYWN0ZXJzIHRvIG1hdGNoIGEgd29yZCBib3VuZGFyeSBvbi5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IEEgcmVnZXggc3RyaW5nIHRoYXQgbWF0Y2hlcyB0aGUgbWF0Y2hTdHJpbmcgd2l0aCB3b3JkIGJvdW5kYXJpZXMuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIG1hdGNoU3RyaW5nLCBleHRyYVdvcmRCb3VuZGFyeSApIHtcblx0dmFyIHdvcmRCb3VuZGFyeSwgd29yZEJvdW5kYXJ5U3RhcnQsIHdvcmRCb3VuZGFyeUVuZDtcblx0dmFyIF9leHRyYVdvcmRCb3VuZGFyeSA9IGV4dHJhV29yZEJvdW5kYXJ5IHx8IFwiXCI7XG5cblx0d29yZEJvdW5kYXJ5ID0gXCJbIFxcblxcclxcdFxcLiwnXFwoXFwpXFxcIlxcK1xcLTshPzpcXC/Cu8Kr4oC54oC6XCIgKyBfZXh0cmFXb3JkQm91bmRhcnkgKyBcIjw+XVwiO1xuXHR3b3JkQm91bmRhcnlTdGFydCA9IFwiKF58XCIgKyB3b3JkQm91bmRhcnkgKyBcIilcIjtcblx0d29yZEJvdW5kYXJ5RW5kID0gXCIoJHxcIiArIHdvcmRCb3VuZGFyeSArIFwiKVwiO1xuXG5cdHJldHVybiB3b3JkQm91bmRhcnlTdGFydCArIG1hdGNoU3RyaW5nICsgd29yZEJvdW5kYXJ5RW5kO1xufTtcbiIsIi8qKiBAbW9kdWxlIHN0cmluZ1Byb2Nlc3NpbmcvY3JlYXRlUmVnZXhGcm9tQXJyYXkgKi9cblxudmFyIGFkZFdvcmRCb3VuZGFyeSA9IHJlcXVpcmUoIFwiLi4vc3RyaW5nUHJvY2Vzc2luZy9hZGRXb3JkYm91bmRhcnkuanNcIiApO1xudmFyIG1hcCA9IHJlcXVpcmUoIFwibG9kYXNoL21hcFwiICk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHJlZ2V4IG9mIGNvbWJpbmVkIHN0cmluZ3MgZnJvbSB0aGUgaW5wdXQgYXJyYXkuXG4gKlxuICogQHBhcmFtIHthcnJheX0gYXJyYXkgVGhlIGFycmF5IHdpdGggc3RyaW5nc1xuICogQHBhcmFtIHtib29sZWFufSBbZGlzYWJsZVdvcmRCb3VuZGFyeV0gQm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgb3Igbm90IHRvIGRpc2FibGUgd29yZCBib3VuZGFyaWVzXG4gKiBAcmV0dXJucyB7UmVnRXhwfSByZWdleCBUaGUgcmVnZXggY3JlYXRlZCBmcm9tIHRoZSBhcnJheS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggYXJyYXksIGRpc2FibGVXb3JkQm91bmRhcnkgKSB7XG5cdHZhciByZWdleFN0cmluZztcblx0dmFyIF9kaXNhYmxlV29yZEJvdW5kYXJ5ID0gZGlzYWJsZVdvcmRCb3VuZGFyeSB8fCBmYWxzZTtcblxuXHR2YXIgYm91bmRlZEFycmF5ID0gbWFwKCBhcnJheSwgZnVuY3Rpb24oIHN0cmluZyApIHtcblx0XHRpZiAoIF9kaXNhYmxlV29yZEJvdW5kYXJ5ICkge1xuXHRcdFx0cmV0dXJuIHN0cmluZztcblx0XHR9XG5cdFx0cmV0dXJuIGFkZFdvcmRCb3VuZGFyeSggc3RyaW5nICk7XG5cdH0gKTtcblxuXHRyZWdleFN0cmluZyA9IFwiKFwiICsgYm91bmRlZEFycmF5LmpvaW4oIFwiKXwoXCIgKSArIFwiKVwiO1xuXG5cdHJldHVybiBuZXcgUmVnRXhwKCByZWdleFN0cmluZywgXCJpZ1wiICk7XG59O1xuIiwidmFyIG1hcCA9IHJlcXVpcmUoIFwibG9kYXNoL21hcFwiICk7XG52YXIgaXNVbmRlZmluZWQgPSByZXF1aXJlKCBcImxvZGFzaC9pc1VuZGVmaW5lZFwiICk7XG52YXIgZm9yRWFjaCA9IHJlcXVpcmUoIFwibG9kYXNoL2ZvckVhY2hcIiApO1xudmFyIGlzTmFOID0gcmVxdWlyZSggXCJsb2Rhc2gvaXNOYU5cIiApO1xudmFyIGZpbHRlciA9IHJlcXVpcmUoIFwibG9kYXNoL2ZpbHRlclwiICk7XG52YXIgZmxhdE1hcCA9IHJlcXVpcmUoIFwibG9kYXNoL2ZsYXRNYXBcIiApO1xudmFyIGlzRW1wdHkgPSByZXF1aXJlKCBcImxvZGFzaC9pc0VtcHR5XCIgKTtcbnZhciBuZWdhdGUgPSByZXF1aXJlKCBcImxvZGFzaC9uZWdhdGVcIiApO1xudmFyIG1lbW9pemUgPSByZXF1aXJlKCBcImxvZGFzaC9tZW1vaXplXCIgKTtcblxudmFyIGNvcmUgPSByZXF1aXJlKCBcInRva2VuaXplcjIvY29yZVwiICk7XG5cbnZhciBnZXRCbG9ja3MgPSByZXF1aXJlKCBcIi4uL2hlbHBlcnMvaHRtbC5qc1wiICkuZ2V0QmxvY2tzO1xudmFyIG5vcm1hbGl6ZVF1b3RlcyA9IHJlcXVpcmUoIFwiLi4vc3RyaW5nUHJvY2Vzc2luZy9xdW90ZXMuanNcIiApLm5vcm1hbGl6ZTtcblxudmFyIHVuaWZ5V2hpdGVzcGFjZSA9IHJlcXVpcmUoIFwiLi4vc3RyaW5nUHJvY2Vzc2luZy91bmlmeVdoaXRlc3BhY2UuanNcIiApLnVuaWZ5Tm9uQnJlYWtpbmdTcGFjZTtcblxuLy8gQWxsIGNoYXJhY3RlcnMgdGhhdCBpbmRpY2F0ZSBhIHNlbnRlbmNlIGRlbGltaXRlci5cbnZhciBmdWxsU3RvcCA9IFwiLlwiO1xuLy8gVGhlIFxcdTIwMjYgY2hhcmFjdGVyIGlzIGFuIGVsbGlwc2lzXG52YXIgc2VudGVuY2VEZWxpbWl0ZXJzID0gXCI/ITtcXHUyMDI2XCI7XG52YXIgbmV3TGluZXMgPSBcIlxcblxccnxcXG58XFxyXCI7XG5cbnZhciBmdWxsU3RvcFJlZ2V4ID0gbmV3IFJlZ0V4cCggXCJeW1wiICsgZnVsbFN0b3AgKyBcIl0kXCIgKTtcbnZhciBzZW50ZW5jZURlbGltaXRlclJlZ2V4ID0gbmV3IFJlZ0V4cCggXCJeW1wiICsgc2VudGVuY2VEZWxpbWl0ZXJzICsgXCJdJFwiICk7XG52YXIgc2VudGVuY2VSZWdleCA9IG5ldyBSZWdFeHAoIFwiXlteXCIgKyBmdWxsU3RvcCArIHNlbnRlbmNlRGVsaW1pdGVycyArIFwiPFxcXFwoXFxcXClcXFxcW1xcXFxdXSskXCIgKTtcbnZhciBodG1sU3RhcnRSZWdleCA9IC9ePChbXj5cXHNcXC9dKylbXj5dKj4kL21pO1xudmFyIGh0bWxFbmRSZWdleCA9IC9ePFxcLyhbXj5cXHNdKylbXj5dKj4kL21pO1xudmFyIG5ld0xpbmVSZWdleCA9IG5ldyBSZWdFeHAoIG5ld0xpbmVzICk7XG5cbnZhciBibG9ja1N0YXJ0UmVnZXggPSAvXlxccypbXFxbXFwoXFx7XVxccyokLztcbnZhciBibG9ja0VuZFJlZ2V4ID0gL15cXHMqW1xcXVxcKX1dXFxzKiQvO1xuXG52YXIgdG9rZW5zID0gW107XG52YXIgc2VudGVuY2VUb2tlbml6ZXI7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHRva2VuaXplciB0byBjcmVhdGUgdG9rZW5zIGZyb20gYSBzZW50ZW5jZS5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gY3JlYXRlVG9rZW5pemVyKCkge1xuXHR0b2tlbnMgPSBbXTtcblxuXHRzZW50ZW5jZVRva2VuaXplciA9IGNvcmUoIGZ1bmN0aW9uKCB0b2tlbiApIHtcblx0XHR0b2tlbnMucHVzaCggdG9rZW4gKTtcblx0fSApO1xuXG5cdHNlbnRlbmNlVG9rZW5pemVyLmFkZFJ1bGUoIGh0bWxTdGFydFJlZ2V4LCBcImh0bWwtc3RhcnRcIiApO1xuXHRzZW50ZW5jZVRva2VuaXplci5hZGRSdWxlKCBodG1sRW5kUmVnZXgsIFwiaHRtbC1lbmRcIiApO1xuXHRzZW50ZW5jZVRva2VuaXplci5hZGRSdWxlKCBibG9ja1N0YXJ0UmVnZXgsIFwiYmxvY2stc3RhcnRcIiApO1xuXHRzZW50ZW5jZVRva2VuaXplci5hZGRSdWxlKCBibG9ja0VuZFJlZ2V4LCBcImJsb2NrLWVuZFwiICk7XG5cdHNlbnRlbmNlVG9rZW5pemVyLmFkZFJ1bGUoIGZ1bGxTdG9wUmVnZXgsIFwiZnVsbC1zdG9wXCIgKTtcblx0c2VudGVuY2VUb2tlbml6ZXIuYWRkUnVsZSggc2VudGVuY2VEZWxpbWl0ZXJSZWdleCwgXCJzZW50ZW5jZS1kZWxpbWl0ZXJcIiApO1xuXHRzZW50ZW5jZVRva2VuaXplci5hZGRSdWxlKCBzZW50ZW5jZVJlZ2V4LCBcInNlbnRlbmNlXCIgKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IGEgY2VydGFpbiBjaGFyYWN0ZXIgaXMgYSBjYXBpdGFsIGxldHRlci5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY2hhcmFjdGVyIFRoZSBjaGFyYWN0ZXIgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhlIGNoYXJhY3RlciBpcyBhIGNhcGl0YWwgbGV0dGVyLlxuICovXG5mdW5jdGlvbiBpc0NhcGl0YWxMZXR0ZXIoIGNoYXJhY3RlciApIHtcblx0cmV0dXJuIGNoYXJhY3RlciAhPT0gY2hhcmFjdGVyLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG59XG5cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCBhIGNlcnRhaW4gY2hhcmFjdGVyIGlzIGEgbnVtYmVyLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjaGFyYWN0ZXIgVGhlIGNoYXJhY3RlciB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgY2hhcmFjdGVyIGlzIGEgY2FwaXRhbCBsZXR0ZXIuXG4gKi9cbmZ1bmN0aW9uIGlzTnVtYmVyKCBjaGFyYWN0ZXIgKSB7XG5cdHJldHVybiAhIGlzTmFOKCBwYXJzZUludCggY2hhcmFjdGVyLCAxMCApICk7XG59XG5cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCBhIGdpdmVuIEhUTUwgdGFnIGlzIGEgYnJlYWsgdGFnLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBodG1sVGFnIFRoZSBIVE1MIHRhZyB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gSFRNTCB0YWcgaXMgYSBicmVhayB0YWcuXG4gKi9cbmZ1bmN0aW9uIGlzQnJlYWtUYWcoIGh0bWxUYWcgKSB7XG5cdHJldHVybiAvPGJyLy50ZXN0KCBodG1sVGFnICk7XG59XG5cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCBhIGdpdmVuIGNoYXJhY3RlciBpcyBxdW90YXRpb24gbWFyay5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY2hhcmFjdGVyIFRoZSBjaGFyYWN0ZXIgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhlIGdpdmVuIGNoYXJhY3RlciBpcyBhIHF1b3RhdGlvbiBtYXJrLlxuICovXG5mdW5jdGlvbiBpc1F1b3RhdGlvbiggY2hhcmFjdGVyICkge1xuXHRjaGFyYWN0ZXIgPSBub3JtYWxpemVRdW90ZXMoIGNoYXJhY3RlciApO1xuXG5cdHJldHVybiBcIidcIiA9PT0gY2hhcmFjdGVyIHx8XG5cdFx0XCJcXFwiXCIgPT09IGNoYXJhY3Rlcjtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IGEgZ2l2ZW4gY2hhcmFjdGVyIGlzIGEgcHVuY3R1YXRpb24gbWFyayB0aGF0IGNhbiBiZSBhdCB0aGUgYmVnaW5uaW5nXG4gKiBvZiBhIHNlbnRlbmNlLCBsaWtlIMK/IGFuZCDCoSB1c2VkIGluIFNwYW5pc2guXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGNoYXJhY3RlciBUaGUgY2hhcmFjdGVyIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBjaGFyYWN0ZXIgaXMgYSBwdW5jdHVhdGlvbiBtYXJrLlxuICovXG5mdW5jdGlvbiBpc1B1bmN0dWF0aW9uKCBjaGFyYWN0ZXIgKSB7XG5cdHJldHVybiBcIsK/XCIgPT09IGNoYXJhY3RlciB8fFxuXHRcdFwiwqFcIiA9PT0gY2hhcmFjdGVyO1xufVxuXG4vKipcbiAqIFRva2VuaXplcyBhIHNlbnRlbmNlLCBhc3N1bWVzIHRoYXQgdGhlIHRleHQgaGFzIGFscmVhZHkgYmVlbiBzcGxpdCBpbnRvIGJsb2Nrcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byB0b2tlbml6ZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gQW4gYXJyYXkgb2YgdG9rZW5zLlxuICovXG5mdW5jdGlvbiB0b2tlbml6ZVNlbnRlbmNlcyggdGV4dCApIHtcblx0Y3JlYXRlVG9rZW5pemVyKCk7XG5cdHNlbnRlbmNlVG9rZW5pemVyLm9uVGV4dCggdGV4dCApO1xuXG5cdHNlbnRlbmNlVG9rZW5pemVyLmVuZCgpO1xuXG5cdHJldHVybiB0b2tlbnM7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBkdXBsaWNhdGUgd2hpdGVzcGFjZSBmcm9tIGEgZ2l2ZW4gdGV4dC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdGV4dCB3aXRoIGR1cGxpY2F0ZSB3aGl0ZXNwYWNlLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIHRleHQgd2l0aG91dCBkdXBsaWNhdGUgd2hpdGVzcGFjZS5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlRHVwbGljYXRlV2hpdGVzcGFjZSggdGV4dCApIHtcblx0cmV0dXJuIHRleHQucmVwbGFjZSggL1xccysvLCBcIiBcIiApO1xufVxuXG4vKipcbiAqIFJldHJpZXZlcyB0aGUgbmV4dCB0d28gY2hhcmFjdGVycyBmcm9tIGFuIGFycmF5IHdpdGggdGhlIHR3byBuZXh0IHRva2Vucy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBuZXh0VG9rZW5zIFRoZSB0d28gbmV4dCB0b2tlbnMuIE1pZ2h0IGJlIHVuZGVmaW5lZC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBuZXh0IHR3byBjaGFyYWN0ZXJzLlxuICovXG5mdW5jdGlvbiBnZXROZXh0VHdvQ2hhcmFjdGVycyggbmV4dFRva2VucyApIHtcblx0dmFyIG5leHQgPSBcIlwiO1xuXG5cdGlmICggISBpc1VuZGVmaW5lZCggbmV4dFRva2Vuc1sgMCBdICkgKSB7XG5cdFx0bmV4dCArPSBuZXh0VG9rZW5zWyAwIF0uc3JjO1xuXHR9XG5cblx0aWYgKCAhIGlzVW5kZWZpbmVkKCBuZXh0VG9rZW5zWyAxIF0gKSApIHtcblx0XHRuZXh0ICs9IG5leHRUb2tlbnNbIDEgXS5zcmM7XG5cdH1cblxuXHRuZXh0ID0gcmVtb3ZlRHVwbGljYXRlV2hpdGVzcGFjZSggbmV4dCApO1xuXG5cdHJldHVybiBuZXh0O1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgc2VudGVuY2VCZWdpbm5pbmcgYmVnaW5uaW5nIGlzIGEgdmFsaWQgYmVnaW5uaW5nLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZW50ZW5jZUJlZ2lubmluZyBUaGUgYmVnaW5uaW5nIG9mIHRoZSBzZW50ZW5jZSB0byB2YWxpZGF0ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIHRydWUgaWYgaXQgaXMgYSB2YWxpZCBiZWdpbm5pbmcsIGZhbHNlIGlmIGl0IGlzIG5vdC5cbiAqL1xuZnVuY3Rpb24gaXNWYWxpZFNlbnRlbmNlQmVnaW5uaW5nKCBzZW50ZW5jZUJlZ2lubmluZyApIHtcblx0cmV0dXJuIChcblx0XHRpc0NhcGl0YWxMZXR0ZXIoIHNlbnRlbmNlQmVnaW5uaW5nICkgfHxcblx0XHRpc051bWJlciggc2VudGVuY2VCZWdpbm5pbmcgKSB8fFxuXHRcdGlzUXVvdGF0aW9uKCBzZW50ZW5jZUJlZ2lubmluZyApIHx8XG5cdFx0aXNQdW5jdHVhdGlvbiggc2VudGVuY2VCZWdpbm5pbmcgKVxuXHQpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgdG9rZW4gaXMgYSB2YWxpZCBzZW50ZW5jZSBlbmRpbmcuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHRva2VuIFRoZSB0b2tlbiB0byB2YWxpZGF0ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIHRydWUgaWYgdGhlIHRva2VuIGlzIHZhbGlkIGVuZGluZywgZmFsc2UgaWYgaXQgaXMgbm90LlxuICovXG5mdW5jdGlvbiBpc1NlbnRlbmNlU3RhcnQoIHRva2VuICkge1xuXHRyZXR1cm4gKCAhIGlzVW5kZWZpbmVkKCB0b2tlbiApICYmIChcblx0XHRcImh0bWwtc3RhcnRcIiA9PT0gdG9rZW4udHlwZSB8fFxuXHRcdFwiaHRtbC1lbmRcIiA9PT0gdG9rZW4udHlwZSB8fFxuXHRcdFwiYmxvY2stc3RhcnRcIiA9PT0gdG9rZW4udHlwZVxuXHQpICk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhbiBhcnJheSBvZiBzZW50ZW5jZXMgZm9yIGEgZ2l2ZW4gYXJyYXkgb2YgdG9rZW5zLCBhc3N1bWVzIHRoYXQgdGhlIHRleHQgaGFzIGFscmVhZHkgYmVlbiBzcGxpdCBpbnRvIGJsb2Nrcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSB0b2tlbnMgVGhlIHRva2VucyBmcm9tIHRoZSBzZW50ZW5jZSB0b2tlbml6ZXIuXG4gKiBAcmV0dXJucyB7QXJyYXk8c3RyaW5nPn0gQSBsaXN0IG9mIHNlbnRlbmNlcy5cbiAqL1xuZnVuY3Rpb24gZ2V0U2VudGVuY2VzRnJvbVRva2VucyggdG9rZW5zICkge1xuXHR2YXIgdG9rZW5TZW50ZW5jZXMgPSBbXSwgY3VycmVudFNlbnRlbmNlID0gXCJcIiwgbmV4dFNlbnRlbmNlU3RhcnQ7XG5cblx0dmFyIHNsaWNlZDtcblxuXHQvLyBEcm9wIHRoZSBmaXJzdCBhbmQgbGFzdCBIVE1MIHRhZyBpZiBib3RoIGFyZSBwcmVzZW50LlxuXHRkbyB7XG5cdFx0c2xpY2VkID0gZmFsc2U7XG5cdFx0dmFyIGZpcnN0VG9rZW4gPSB0b2tlbnNbIDAgXTtcblx0XHR2YXIgbGFzdFRva2VuID0gdG9rZW5zWyB0b2tlbnMubGVuZ3RoIC0gMSBdO1xuXG5cdFx0aWYgKCBmaXJzdFRva2VuLnR5cGUgPT09IFwiaHRtbC1zdGFydFwiICYmIGxhc3RUb2tlbi50eXBlID09PSBcImh0bWwtZW5kXCIgKSB7XG5cdFx0XHR0b2tlbnMgPSB0b2tlbnMuc2xpY2UoIDEsIHRva2Vucy5sZW5ndGggLSAxICk7XG5cblx0XHRcdHNsaWNlZCA9IHRydWU7XG5cdFx0fVxuXHR9IHdoaWxlICggc2xpY2VkICYmIHRva2Vucy5sZW5ndGggPiAxICk7XG5cblx0Zm9yRWFjaCggdG9rZW5zLCBmdW5jdGlvbiggdG9rZW4sIGkgKSB7XG5cdFx0dmFyIGhhc05leHRTZW50ZW5jZTtcblx0XHR2YXIgbmV4dFRva2VuID0gdG9rZW5zWyBpICsgMSBdO1xuXHRcdHZhciBzZWNvbmRUb05leHRUb2tlbiA9IHRva2Vuc1sgaSArIDIgXTtcblx0XHR2YXIgbmV4dENoYXJhY3RlcnM7XG5cblx0XHRzd2l0Y2ggKCB0b2tlbi50eXBlICkge1xuXG5cdFx0XHRjYXNlIFwiaHRtbC1zdGFydFwiOlxuXHRcdFx0Y2FzZSBcImh0bWwtZW5kXCI6XG5cdFx0XHRcdGlmICggaXNCcmVha1RhZyggdG9rZW4uc3JjICkgKSB7XG5cdFx0XHRcdFx0dG9rZW5TZW50ZW5jZXMucHVzaCggY3VycmVudFNlbnRlbmNlICk7XG5cdFx0XHRcdFx0Y3VycmVudFNlbnRlbmNlID0gXCJcIjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjdXJyZW50U2VudGVuY2UgKz0gdG9rZW4uc3JjO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFwic2VudGVuY2VcIjpcblx0XHRcdFx0Y3VycmVudFNlbnRlbmNlICs9IHRva2VuLnNyYztcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgXCJzZW50ZW5jZS1kZWxpbWl0ZXJcIjpcblx0XHRcdFx0Y3VycmVudFNlbnRlbmNlICs9IHRva2VuLnNyYztcblxuXHRcdFx0XHRpZiAoICEgaXNVbmRlZmluZWQoIG5leHRUb2tlbiApICYmIFwiYmxvY2stZW5kXCIgIT09IG5leHRUb2tlbi50eXBlICkge1xuXHRcdFx0XHRcdHRva2VuU2VudGVuY2VzLnB1c2goIGN1cnJlbnRTZW50ZW5jZSApO1xuXHRcdFx0XHRcdGN1cnJlbnRTZW50ZW5jZSA9IFwiXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgXCJmdWxsLXN0b3BcIjpcblx0XHRcdFx0Y3VycmVudFNlbnRlbmNlICs9IHRva2VuLnNyYztcblxuXHRcdFx0XHRuZXh0Q2hhcmFjdGVycyA9IGdldE5leHRUd29DaGFyYWN0ZXJzKCBbIG5leHRUb2tlbiwgc2Vjb25kVG9OZXh0VG9rZW4gXSApO1xuXG5cdFx0XHRcdC8vIEZvciBhIG5ldyBzZW50ZW5jZSB3ZSBuZWVkIHRvIGNoZWNrIHRoZSBuZXh0IHR3byBjaGFyYWN0ZXJzLlxuXHRcdFx0XHRoYXNOZXh0U2VudGVuY2UgPSBuZXh0Q2hhcmFjdGVycy5sZW5ndGggPj0gMjtcblx0XHRcdFx0bmV4dFNlbnRlbmNlU3RhcnQgPSBoYXNOZXh0U2VudGVuY2UgPyBuZXh0Q2hhcmFjdGVyc1sgMSBdIDogXCJcIjtcblx0XHRcdFx0Ly8gSWYgdGhlIG5leHQgY2hhcmFjdGVyIGlzIGEgbnVtYmVyLCBuZXZlciBzcGxpdC4gRm9yIGV4YW1wbGU6IElQdjQtbnVtYmVycy5cblx0XHRcdFx0aWYgKCBoYXNOZXh0U2VudGVuY2UgJiYgaXNOdW1iZXIoIG5leHRDaGFyYWN0ZXJzWyAwIF0gKSApIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBPbmx5IHNwbGl0IG9uIHNlbnRlbmNlIGRlbGltaXRlcnMgd2hlbiB0aGUgbmV4dCBzZW50ZW5jZSBsb29rcyBsaWtlIHRoZSBzdGFydCBvZiBhIHNlbnRlbmNlLlxuXG5cdFx0XHRcdGlmICggKCBoYXNOZXh0U2VudGVuY2UgJiYgaXNWYWxpZFNlbnRlbmNlQmVnaW5uaW5nKCBuZXh0U2VudGVuY2VTdGFydCApICkgfHwgaXNTZW50ZW5jZVN0YXJ0KCBuZXh0VG9rZW4gKSApIHtcblx0XHRcdFx0XHR0b2tlblNlbnRlbmNlcy5wdXNoKCBjdXJyZW50U2VudGVuY2UgKTtcblx0XHRcdFx0XHRjdXJyZW50U2VudGVuY2UgPSBcIlwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFwibmV3bGluZVwiOlxuXHRcdFx0XHR0b2tlblNlbnRlbmNlcy5wdXNoKCBjdXJyZW50U2VudGVuY2UgKTtcblx0XHRcdFx0Y3VycmVudFNlbnRlbmNlID0gXCJcIjtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgXCJibG9jay1zdGFydFwiOlxuXHRcdFx0XHRjdXJyZW50U2VudGVuY2UgKz0gdG9rZW4uc3JjO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBcImJsb2NrLWVuZFwiOlxuXHRcdFx0XHRjdXJyZW50U2VudGVuY2UgKz0gdG9rZW4uc3JjO1xuXG5cdFx0XHRcdG5leHRDaGFyYWN0ZXJzID0gZ2V0TmV4dFR3b0NoYXJhY3RlcnMoIFsgbmV4dFRva2VuLCBzZWNvbmRUb05leHRUb2tlbiBdICk7XG5cblx0XHRcdFx0Ly8gRm9yIGEgbmV3IHNlbnRlbmNlIHdlIG5lZWQgdG8gY2hlY2sgdGhlIG5leHQgdHdvIGNoYXJhY3RlcnMuXG5cdFx0XHRcdGhhc05leHRTZW50ZW5jZSA9IG5leHRDaGFyYWN0ZXJzLmxlbmd0aCA+PSAyO1xuXHRcdFx0XHRuZXh0U2VudGVuY2VTdGFydCA9IGhhc05leHRTZW50ZW5jZSA/IG5leHRDaGFyYWN0ZXJzWyAwIF0gOiBcIlwiO1xuXHRcdFx0XHQvLyBJZiB0aGUgbmV4dCBjaGFyYWN0ZXIgaXMgYSBudW1iZXIsIG5ldmVyIHNwbGl0LiBGb3IgZXhhbXBsZTogSVB2NC1udW1iZXJzLlxuXHRcdFx0XHRpZiAoIGhhc05leHRTZW50ZW5jZSAmJiBpc051bWJlciggbmV4dENoYXJhY3RlcnNbIDAgXSApICkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCAoIGhhc05leHRTZW50ZW5jZSAmJiBpc1ZhbGlkU2VudGVuY2VCZWdpbm5pbmcoIG5leHRTZW50ZW5jZVN0YXJ0ICkgKSB8fCBpc1NlbnRlbmNlU3RhcnQoIG5leHRUb2tlbiApICkge1xuXHRcdFx0XHRcdHRva2VuU2VudGVuY2VzLnB1c2goIGN1cnJlbnRTZW50ZW5jZSApO1xuXHRcdFx0XHRcdGN1cnJlbnRTZW50ZW5jZSA9IFwiXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9ICk7XG5cblx0aWYgKCBcIlwiICE9PSBjdXJyZW50U2VudGVuY2UgKSB7XG5cdFx0dG9rZW5TZW50ZW5jZXMucHVzaCggY3VycmVudFNlbnRlbmNlICk7XG5cdH1cblxuXHR0b2tlblNlbnRlbmNlcyA9IG1hcCggdG9rZW5TZW50ZW5jZXMsIGZ1bmN0aW9uKCBzZW50ZW5jZSApIHtcblx0XHRyZXR1cm4gc2VudGVuY2UudHJpbSgpO1xuXHR9ICk7XG5cblx0cmV0dXJuIHRva2VuU2VudGVuY2VzO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIHNlbnRlbmNlcyBmcm9tIGEgY2VydGFpbiBibG9jay5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmxvY2sgVGhlIEhUTUwgaW5zaWRlIGEgSFRNTCBibG9jay5cbiAqIEByZXR1cm5zIHtBcnJheTxzdHJpbmc+fSBUaGUgbGlzdCBvZiBzZW50ZW5jZXMgaW4gdGhlIGJsb2NrLlxuICovXG5mdW5jdGlvbiBnZXRTZW50ZW5jZXNGcm9tQmxvY2soIGJsb2NrICkge1xuXHR2YXIgdG9rZW5zID0gdG9rZW5pemVTZW50ZW5jZXMoIGJsb2NrICk7XG5cblx0cmV0dXJuIHRva2Vucy5sZW5ndGggPT09IDAgPyBbXSA6IGdldFNlbnRlbmNlc0Zyb21Ub2tlbnMoIHRva2VucyApO1xufVxuXG52YXIgZ2V0U2VudGVuY2VzRnJvbUJsb2NrQ2FjaGVkID0gbWVtb2l6ZSggZ2V0U2VudGVuY2VzRnJvbUJsb2NrICk7XG5cbi8qKlxuICogUmV0dXJucyBzZW50ZW5jZXMgaW4gYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRleHQgVGhlIHN0cmluZyB0byBjb3VudCBzZW50ZW5jZXMgaW4uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFNlbnRlbmNlcyBmb3VuZCBpbiB0aGUgdGV4dC5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdGV4dCApIHtcblx0dGV4dCA9IHVuaWZ5V2hpdGVzcGFjZSggdGV4dCApO1xuXHR2YXIgc2VudGVuY2VzLCBibG9ja3MgPSBnZXRCbG9ja3MoIHRleHQgKTtcblxuXHQvLyBTcGxpdCBlYWNoIGJsb2NrIG9uIG5ld2xpbmVzLlxuXHRibG9ja3MgPSBmbGF0TWFwKCBibG9ja3MsIGZ1bmN0aW9uKCBibG9jayApIHtcblx0XHRyZXR1cm4gYmxvY2suc3BsaXQoIG5ld0xpbmVSZWdleCApO1xuXHR9ICk7XG5cblx0c2VudGVuY2VzID0gZmxhdE1hcCggYmxvY2tzLCBnZXRTZW50ZW5jZXNGcm9tQmxvY2tDYWNoZWQgKTtcblxuXHRyZXR1cm4gZmlsdGVyKCBzZW50ZW5jZXMsIG5lZ2F0ZSggaXNFbXB0eSApICk7XG59O1xuIiwiLyoqIEBtb2R1bGUgc3RyaW5nUHJvY2Vzc2luZy9jb3VudFdvcmRzICovXG5cbnZhciBzdHJpcFRhZ3MgPSByZXF1aXJlKCBcIi4vc3RyaXBIVE1MVGFncy5qc1wiICkuc3RyaXBGdWxsVGFncztcbnZhciBzdHJpcFNwYWNlcyA9IHJlcXVpcmUoIFwiLi9zdHJpcFNwYWNlcy5qc1wiICk7XG52YXIgcmVtb3ZlUHVuY3R1YXRpb24gPSByZXF1aXJlKCBcIi4vcmVtb3ZlUHVuY3R1YXRpb24uanNcIiApO1xudmFyIG1hcCA9IHJlcXVpcmUoIFwibG9kYXNoL21hcFwiICk7XG52YXIgZmlsdGVyID0gcmVxdWlyZSggXCJsb2Rhc2gvZmlsdGVyXCIgKTtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIGFycmF5IHdpdGggd29yZHMgdXNlZCBpbiB0aGUgdGV4dC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byBiZSBjb3VudGVkLlxuICogQHJldHVybnMge0FycmF5fSBUaGUgYXJyYXkgd2l0aCBhbGwgd29yZHMuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHRleHQgKSB7XG5cdHRleHQgPSBzdHJpcFNwYWNlcyggc3RyaXBUYWdzKCB0ZXh0ICkgKTtcblx0aWYgKCB0ZXh0ID09PSBcIlwiICkge1xuXHRcdHJldHVybiBbXTtcblx0fVxuXG5cdHZhciB3b3JkcyA9IHRleHQuc3BsaXQoIC9cXHMvZyApO1xuXG5cdHdvcmRzID0gbWFwKCB3b3JkcywgZnVuY3Rpb24oIHdvcmQgKSB7XG5cdFx0cmV0dXJuIHJlbW92ZVB1bmN0dWF0aW9uKCB3b3JkICk7XG5cdH0gKTtcblxuXHRyZXR1cm4gZmlsdGVyKCB3b3JkcywgZnVuY3Rpb24oIHdvcmQgKSB7XG5cdFx0cmV0dXJuIHdvcmQudHJpbSgpICE9PSBcIlwiO1xuXHR9ICk7XG59O1xuXG4iLCIvKipcbiAqIE5vcm1hbGl6ZXMgc2luZ2xlIHF1b3RlcyB0byAncmVndWxhcicgcXVvdGVzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRleHQgdG8gbm9ybWFsaXplLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIG5vcm1hbGl6ZWQgdGV4dC5cbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplU2luZ2xlUXVvdGVzKCB0ZXh0ICkge1xuXHRyZXR1cm4gdGV4dC5yZXBsYWNlKCAvW+KAmOKAmeKAm2BdL2csIFwiJ1wiICk7XG59XG5cbi8qKlxuICogTm9ybWFsaXplcyBkb3VibGUgcXVvdGVzIHRvICdyZWd1bGFyJyBxdW90ZXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGV4dCB0byBub3JtYWxpemUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgbm9ybWFsaXplZCB0ZXh0LlxuICovXG5mdW5jdGlvbiBub3JtYWxpemVEb3VibGVRdW90ZXMoIHRleHQgKSB7XG5cdHJldHVybiB0ZXh0LnJlcGxhY2UoIC9b4oCc4oCd44Cd44Ce44Cf4oCf4oCeXS9nLCBcIlxcXCJcIiApO1xufVxuXG4vKipcbiAqIE5vcm1hbGl6ZXMgcXVvdGVzIHRvICdyZWd1bGFyJyBxdW90ZXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGV4dCB0byBub3JtYWxpemUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgbm9ybWFsaXplZCB0ZXh0LlxuICovXG5mdW5jdGlvbiBub3JtYWxpemVRdW90ZXMoIHRleHQgKSB7XG5cdHJldHVybiBub3JtYWxpemVEb3VibGVRdW90ZXMoIG5vcm1hbGl6ZVNpbmdsZVF1b3RlcyggdGV4dCApICk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRub3JtYWxpemVTaW5nbGU6IG5vcm1hbGl6ZVNpbmdsZVF1b3Rlcyxcblx0bm9ybWFsaXplRG91YmxlOiBub3JtYWxpemVEb3VibGVRdW90ZXMsXG5cdG5vcm1hbGl6ZTogbm9ybWFsaXplUXVvdGVzLFxufTtcbiIsInZhciBnZXRXb3JkcyA9IHJlcXVpcmUoIFwiLi4vc3RyaW5nUHJvY2Vzc2luZy9nZXRXb3Jkc1wiICk7XG52YXIgZ2V0U2VudGVuY2VzID0gcmVxdWlyZSggXCIuLi9zdHJpbmdQcm9jZXNzaW5nL2dldFNlbnRlbmNlc1wiICk7XG52YXIgV29yZENvbWJpbmF0aW9uID0gcmVxdWlyZSggXCIuLi92YWx1ZXMvV29yZENvbWJpbmF0aW9uXCIgKTtcbnZhciBub3JtYWxpemVTaW5nbGVRdW90ZXMgPSByZXF1aXJlKCBcIi4uL3N0cmluZ1Byb2Nlc3NpbmcvcXVvdGVzLmpzXCIgKS5ub3JtYWxpemVTaW5nbGU7XG52YXIgZnVuY3Rpb25Xb3JkcyA9IHJlcXVpcmUoIFwiLi4vcmVzZWFyY2hlcy9lbmdsaXNoL2Z1bmN0aW9uV29yZHMuanNcIiApO1xudmFyIGNvdW50U3lsbGFibGVzID0gcmVxdWlyZSggXCIuLi9zdHJpbmdQcm9jZXNzaW5nL3N5bGxhYmxlcy9jb3VudC5qc1wiICk7XG5cbnZhciBmaWx0ZXIgPSByZXF1aXJlKCBcImxvZGFzaC9maWx0ZXJcIiApO1xudmFyIG1hcCA9IHJlcXVpcmUoIFwibG9kYXNoL21hcFwiICk7XG52YXIgZm9yRWFjaCA9IHJlcXVpcmUoIFwibG9kYXNoL2ZvckVhY2hcIiApO1xudmFyIGhhcyA9IHJlcXVpcmUoIFwibG9kYXNoL2hhc1wiICk7XG52YXIgZmxhdE1hcCA9IHJlcXVpcmUoIFwibG9kYXNoL2ZsYXRNYXBcIiApO1xudmFyIHZhbHVlcyA9IHJlcXVpcmUoIFwibG9kYXNoL3ZhbHVlc1wiICk7XG52YXIgdGFrZSA9IHJlcXVpcmUoIFwibG9kYXNoL3Rha2VcIiApO1xudmFyIGluY2x1ZGVzID0gcmVxdWlyZSggXCJsb2Rhc2gvaW5jbHVkZXNcIiApO1xudmFyIGludGVyc2VjdGlvbiA9IHJlcXVpcmUoIFwibG9kYXNoL2ludGVyc2VjdGlvblwiICk7XG52YXIgaXNFbXB0eSA9IHJlcXVpcmUoIFwibG9kYXNoL2lzRW1wdHlcIiApO1xuXG52YXIgZGVuc2l0eUxvd2VyTGltaXQgPSAwO1xudmFyIGRlbnNpdHlVcHBlckxpbWl0ID0gMC4wMztcbnZhciByZWxldmFudFdvcmRMaW1pdCA9IDEwMDtcbnZhciB3b3JkQ291bnRMb3dlckxpbWl0ID0gMjAwO1xuXG4vLyBFbiBkYXNoLCBlbSBkYXNoIGFuZCBoeXBoZW4tbWludXMuXG52YXIgc3BlY2lhbENoYXJhY3RlcnMgPSBbIFwi4oCTXCIsIFwi4oCUXCIsIFwiLVwiIF07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgd29yZCBjb21iaW5hdGlvbnMgZm9yIHRoZSBnaXZlbiB0ZXh0IGJhc2VkIG9uIHRoZSBjb21iaW5hdGlvbiBzaXplLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHRvIHJldHJpZXZlIGNvbWJpbmF0aW9ucyBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gY29tYmluYXRpb25TaXplIFRoZSBzaXplIG9mIHRoZSBjb21iaW5hdGlvbnMgdG8gcmV0cmlldmUuXG4gKiBAcmV0dXJucyB7V29yZENvbWJpbmF0aW9uW119IEFsbCB3b3JkIGNvbWJpbmF0aW9ucyBmb3IgdGhlIGdpdmVuIHRleHQuXG4gKi9cbmZ1bmN0aW9uIGdldFdvcmRDb21iaW5hdGlvbnMoIHRleHQsIGNvbWJpbmF0aW9uU2l6ZSApIHtcblx0dmFyIHNlbnRlbmNlcyA9IGdldFNlbnRlbmNlcyggdGV4dCApO1xuXG5cdHZhciB3b3JkcywgY29tYmluYXRpb247XG5cblx0cmV0dXJuIGZsYXRNYXAoIHNlbnRlbmNlcywgZnVuY3Rpb24oIHNlbnRlbmNlICkge1xuXHRcdHNlbnRlbmNlID0gc2VudGVuY2UudG9Mb2NhbGVMb3dlckNhc2UoKTtcblx0XHRzZW50ZW5jZSA9IG5vcm1hbGl6ZVNpbmdsZVF1b3Rlcyggc2VudGVuY2UgKTtcblx0XHR3b3JkcyA9IGdldFdvcmRzKCBzZW50ZW5jZSApO1xuXG5cdFx0cmV0dXJuIGZpbHRlciggbWFwKCB3b3JkcywgZnVuY3Rpb24oIHdvcmQsIGkgKSB7XG5cdFx0XHQvLyBJZiB0aGVyZSBhcmUgc3RpbGwgZW5vdWdoIHdvcmRzIGluIHRoZSBzZW50ZW5jZSB0byBzbGljZSBvZi5cblx0XHRcdGlmICggaSArIGNvbWJpbmF0aW9uU2l6ZSAtIDEgPCB3b3Jkcy5sZW5ndGggKSB7XG5cdFx0XHRcdGNvbWJpbmF0aW9uID0gd29yZHMuc2xpY2UoIGksIGkgKyBjb21iaW5hdGlvblNpemUgKTtcblx0XHRcdFx0cmV0dXJuIG5ldyBXb3JkQ29tYmluYXRpb24oIGNvbWJpbmF0aW9uICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9ICkgKTtcblx0fSApO1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZXMgb2NjdXJyZW5jZXMgZm9yIGEgbGlzdCBvZiB3b3JkIGNvbWJpbmF0aW9ucy5cbiAqXG4gKiBAcGFyYW0ge1dvcmRDb21iaW5hdGlvbltdfSB3b3JkQ29tYmluYXRpb25zIFRoZSB3b3JkIGNvbWJpbmF0aW9ucyB0byBjYWxjdWxhdGUgb2NjdXJyZW5jZXMgZm9yLlxuICogQHJldHVybnMge1dvcmRDb21iaW5hdGlvbltdfSBXb3JkIGNvbWJpbmF0aW9ucyB3aXRoIHRoZWlyIHJlc3BlY3RpdmUgb2NjdXJyZW5jZXMuXG4gKi9cbmZ1bmN0aW9uIGNhbGN1bGF0ZU9jY3VycmVuY2VzKCB3b3JkQ29tYmluYXRpb25zICkge1xuXHR2YXIgb2NjdXJyZW5jZXMgPSB7fTtcblxuXHRmb3JFYWNoKCB3b3JkQ29tYmluYXRpb25zLCBmdW5jdGlvbiggd29yZENvbWJpbmF0aW9uICkge1xuXHRcdHZhciBjb21iaW5hdGlvbiA9IHdvcmRDb21iaW5hdGlvbi5nZXRDb21iaW5hdGlvbigpO1xuXG5cdFx0aWYgKCAhIGhhcyggb2NjdXJyZW5jZXMsIGNvbWJpbmF0aW9uICkgKSB7XG5cdFx0XHRvY2N1cnJlbmNlc1sgY29tYmluYXRpb24gXSA9IHdvcmRDb21iaW5hdGlvbjtcblx0XHR9XG5cblx0XHRvY2N1cnJlbmNlc1sgY29tYmluYXRpb24gXS5pbmNyZW1lbnRPY2N1cnJlbmNlcygpO1xuXHR9ICk7XG5cblx0cmV0dXJuIHZhbHVlcyggb2NjdXJyZW5jZXMgKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIG9ubHkgdGhlIHJlbGV2YW50IGNvbWJpbmF0aW9ucyBmcm9tIGEgbGlzdCBvZiB3b3JkIGNvbWJpbmF0aW9ucy4gQXNzdW1lc1xuICogb2NjdXJyZW5jZXMgaGF2ZSBhbHJlYWR5IGJlZW4gY2FsY3VsYXRlZC5cbiAqXG4gKiBAcGFyYW0ge1dvcmRDb21iaW5hdGlvbltdfSB3b3JkQ29tYmluYXRpb25zIEEgbGlzdCBvZiB3b3JkIGNvbWJpbmF0aW9ucy5cbiAqIEByZXR1cm5zIHtXb3JkQ29tYmluYXRpb25bXX0gT25seSByZWxldmFudCB3b3JkIGNvbWJpbmF0aW9ucy5cbiAqL1xuZnVuY3Rpb24gZ2V0UmVsZXZhbnRDb21iaW5hdGlvbnMoIHdvcmRDb21iaW5hdGlvbnMgKSB7XG5cdHdvcmRDb21iaW5hdGlvbnMgPSB3b3JkQ29tYmluYXRpb25zLmZpbHRlciggZnVuY3Rpb24oIGNvbWJpbmF0aW9uICkge1xuXHRcdHJldHVybiBjb21iaW5hdGlvbi5nZXRPY2N1cnJlbmNlcygpICE9PSAxICYmXG5cdFx0XHRjb21iaW5hdGlvbi5nZXRSZWxldmFuY2UoKSAhPT0gMDtcblx0fSApO1xuXHRyZXR1cm4gd29yZENvbWJpbmF0aW9ucztcbn1cblxuLyoqXG4gKiBTb3J0cyBjb21iaW5hdGlvbnMgYmFzZWQgb24gdGhlaXIgcmVsZXZhbmNlIGFuZCBsZW5ndGguXG4gKlxuICogQHBhcmFtIHtXb3JkQ29tYmluYXRpb25bXX0gd29yZENvbWJpbmF0aW9ucyBUaGUgY29tYmluYXRpb25zIHRvIHNvcnQuXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gc29ydENvbWJpbmF0aW9ucyggd29yZENvbWJpbmF0aW9ucyApIHtcblx0d29yZENvbWJpbmF0aW9ucy5zb3J0KCBmdW5jdGlvbiggY29tYmluYXRpb25BLCBjb21iaW5hdGlvbkIgKSB7XG5cdFx0dmFyIGRpZmZlcmVuY2UgPSBjb21iaW5hdGlvbkIuZ2V0UmVsZXZhbmNlKCkgLSBjb21iaW5hdGlvbkEuZ2V0UmVsZXZhbmNlKCk7XG5cdFx0Ly8gVGhlIGNvbWJpbmF0aW9uIHdpdGggdGhlIGhpZ2hlc3QgcmVsZXZhbmNlIGNvbWVzIGZpcnN0LlxuXHRcdGlmICggZGlmZmVyZW5jZSAhPT0gMCApIHtcblx0XHRcdHJldHVybiBkaWZmZXJlbmNlO1xuXHRcdH1cblx0XHQvLyBJbiBjYXNlIG9mIGEgdGllIG9uIHJlbGV2YW5jZSwgdGhlIGxvbmdlc3QgY29tYmluYXRpb24gY29tZXMgZmlyc3QuXG5cdFx0cmV0dXJuIGNvbWJpbmF0aW9uQi5nZXRMZW5ndGgoKSAtIGNvbWJpbmF0aW9uQS5nZXRMZW5ndGgoKTtcblx0fSApO1xufVxuXG4vKipcbiAqIEZpbHRlcnMgd29yZCBjb21iaW5hdGlvbnMgYmVnaW5uaW5nIHdpdGggY2VydGFpbiBmdW5jdGlvbiB3b3Jkcy5cbiAqXG4gKiBAcGFyYW0ge1dvcmRDb21iaW5hdGlvbltdfSB3b3JkQ29tYmluYXRpb25zIFRoZSB3b3JkIGNvbWJpbmF0aW9ucyB0byBmaWx0ZXIuXG4gKiBAcGFyYW0ge2FycmF5fSBmdW5jdGlvbldvcmRzIFRoZSBsaXN0IG9mIGZ1bmN0aW9uIHdvcmRzLlxuICogQHJldHVybnMge1dvcmRDb21iaW5hdGlvbltdfSBGaWx0ZXJlZCB3b3JkIGNvbWJpbmF0aW9ucy5cbiAqL1xuZnVuY3Rpb24gZmlsdGVyRnVuY3Rpb25Xb3Jkc0F0QmVnaW5uaW5nKCB3b3JkQ29tYmluYXRpb25zLCBmdW5jdGlvbldvcmRzICkge1xuXHRyZXR1cm4gd29yZENvbWJpbmF0aW9ucy5maWx0ZXIoIGZ1bmN0aW9uKCBjb21iaW5hdGlvbiApIHtcblx0XHRyZXR1cm4gISBpbmNsdWRlcyggZnVuY3Rpb25Xb3JkcywgY29tYmluYXRpb24uZ2V0V29yZHMoKVsgMCBdICk7XG5cdH0gKTtcbn1cblxuLyoqXG4gKiBGaWx0ZXJzIHdvcmQgY29tYmluYXRpb25zIGVuZGluZyB3aXRoIGNlcnRhaW4gZnVuY3Rpb24gd29yZHMuXG4gKlxuICogQHBhcmFtIHtXb3JkQ29tYmluYXRpb25bXX0gd29yZENvbWJpbmF0aW9ucyBUaGUgd29yZCBjb21iaW5hdGlvbnMgdG8gZmlsdGVyLlxuICogQHBhcmFtIHthcnJheX0gZnVuY3Rpb25Xb3JkcyBUaGUgbGlzdCBvZiBmdW5jdGlvbiB3b3Jkcy5cbiAqIEByZXR1cm5zIHtXb3JkQ29tYmluYXRpb25bXX0gRmlsdGVyZWQgd29yZCBjb21iaW5hdGlvbnMuXG4gKi9cbmZ1bmN0aW9uIGZpbHRlckZ1bmN0aW9uV29yZHNBdEVuZGluZyggd29yZENvbWJpbmF0aW9ucywgZnVuY3Rpb25Xb3JkcyApIHtcblx0cmV0dXJuIHdvcmRDb21iaW5hdGlvbnMuZmlsdGVyKCBmdW5jdGlvbiggY29tYmluYXRpb24gKSB7XG5cdFx0dmFyIHdvcmRzID0gY29tYmluYXRpb24uZ2V0V29yZHMoKTtcblx0XHR2YXIgbGFzdFdvcmRJbmRleCA9IHdvcmRzLmxlbmd0aCAtIDE7XG5cdFx0cmV0dXJuICEgaW5jbHVkZXMoIGZ1bmN0aW9uV29yZHMsIHdvcmRzWyBsYXN0V29yZEluZGV4IF0gKTtcblx0fSApO1xufVxuXG4vKipcbiAqIEZpbHRlcnMgd29yZCBjb21iaW5hdGlvbnMgYmVnaW5uaW5nIGFuZCBlbmRpbmcgd2l0aCBjZXJ0YWluIGZ1bmN0aW9uIHdvcmRzLlxuICpcbiAqIEBwYXJhbSB7V29yZENvbWJpbmF0aW9uW119IHdvcmRDb21iaW5hdGlvbnMgVGhlIHdvcmQgY29tYmluYXRpb25zIHRvIGZpbHRlci5cbiAqIEBwYXJhbSB7YXJyYXl9IGZ1bmN0aW9uV29yZHMgVGhlIGxpc3Qgb2YgZnVuY3Rpb24gd29yZHMuXG4gKiBAcmV0dXJucyB7V29yZENvbWJpbmF0aW9uW119IEZpbHRlcmVkIHdvcmQgY29tYmluYXRpb25zLlxuICovXG5mdW5jdGlvbiBmaWx0ZXJGdW5jdGlvbldvcmRzKCB3b3JkQ29tYmluYXRpb25zLCBmdW5jdGlvbldvcmRzICkge1xuXHR3b3JkQ29tYmluYXRpb25zID0gZmlsdGVyRnVuY3Rpb25Xb3Jkc0F0QmVnaW5uaW5nKCB3b3JkQ29tYmluYXRpb25zLCBmdW5jdGlvbldvcmRzICk7XG5cdHdvcmRDb21iaW5hdGlvbnMgPSBmaWx0ZXJGdW5jdGlvbldvcmRzQXRFbmRpbmcoIHdvcmRDb21iaW5hdGlvbnMsIGZ1bmN0aW9uV29yZHMgKTtcblx0cmV0dXJuIHdvcmRDb21iaW5hdGlvbnM7XG59XG5cbi8qKlxuICogRmlsdGVycyB3b3JkIGNvbWJpbmF0aW9ucyBjb250YWluaW5nIGEgc3BlY2lhbCBjaGFyYWN0ZXIuXG4gKlxuICogQHBhcmFtIHtXb3JkQ29tYmluYXRpb25bXX0gd29yZENvbWJpbmF0aW9ucyBUaGUgd29yZCBjb21iaW5hdGlvbnMgdG8gZmlsdGVyLlxuICogQHBhcmFtIHthcnJheX0gc3BlY2lhbENoYXJhY3RlcnMgVGhlIGxpc3Qgb2Ygc3BlY2lhbCBjaGFyYWN0ZXJzLlxuICogQHJldHVybnMge1dvcmRDb21iaW5hdGlvbltdfSBGaWx0ZXJlZCB3b3JkIGNvbWJpbmF0aW9ucy5cbiAqL1xuZnVuY3Rpb24gZmlsdGVyU3BlY2lhbENoYXJhY3RlcnMoIHdvcmRDb21iaW5hdGlvbnMsIHNwZWNpYWxDaGFyYWN0ZXJzICkge1xuXHRyZXR1cm4gd29yZENvbWJpbmF0aW9ucy5maWx0ZXIoIGZ1bmN0aW9uKCBjb21iaW5hdGlvbiApIHtcblx0XHRyZXR1cm4gaXNFbXB0eShcblx0XHRcdGludGVyc2VjdGlvbiggc3BlY2lhbENoYXJhY3RlcnMsIGNvbWJpbmF0aW9uLmdldFdvcmRzKCkgKVxuXHRcdCk7XG5cdH0gKTtcbn1cbi8qKlxuICogRmlsdGVycyB3b3JkIGNvbWJpbmF0aW9ucyB3aXRoIGEgbGVuZ3RoIG9mIG9uZSBhbmQgYSBnaXZlbiBzeWxsYWJsZSBjb3VudC5cbiAqXG4gKiBAcGFyYW0ge1dvcmRDb21iaW5hdGlvbltdfSB3b3JkQ29tYmluYXRpb25zIFRoZSB3b3JkIGNvbWJpbmF0aW9ucyB0byBmaWx0ZXIuXG4gKiBAcGFyYW0ge251bWJlcn0gc3lsbGFibGVDb3VudCBUaGUgbnVtYmVyIG9mIHN5bGxhYmxlcyB0byB1c2UgZm9yIGZpbHRlcmluZy5cbiAqIEByZXR1cm5zIHtXb3JkQ29tYmluYXRpb25bXX0gRmlsdGVyZWQgd29yZCBjb21iaW5hdGlvbnMuXG4gKi9cbiBmdW5jdGlvbiBmaWx0ZXJPblN5bGxhYmxlQ291bnQoIHdvcmRDb21iaW5hdGlvbnMsIHN5bGxhYmxlQ291bnQgKSB7XG5cdHJldHVybiB3b3JkQ29tYmluYXRpb25zLmZpbHRlciggZnVuY3Rpb24oIGNvbWJpbmF0aW9uICkgIHtcblx0XHRyZXR1cm4gISAoIGNvbWJpbmF0aW9uLmdldExlbmd0aCgpID09PSAxICYmIGNvdW50U3lsbGFibGVzKCBjb21iaW5hdGlvbi5nZXRXb3JkcygpWyAwIF0sIFwiZW5fVVNcIiApIDw9IHN5bGxhYmxlQ291bnQgKTtcblx0fSApO1xuIH1cblxuLyoqXG4gKiBGaWx0ZXJzIHdvcmQgY29tYmluYXRpb25zIGJhc2VkIG9uIGtleXdvcmQgZGVuc2l0eSBpZiB0aGUgd29yZCBjb3VudCBpcyAyMDAgb3Igb3Zlci5cbiAqXG4gKiBAcGFyYW0ge1dvcmRDb21iaW5hdGlvbltdfSB3b3JkQ29tYmluYXRpb25zIFRoZSB3b3JkIGNvbWJpbmF0aW9ucyB0byBmaWx0ZXIuXG4gKiBAcGFyYW0ge251bWJlcn0gd29yZENvdW50IFRoZSBudW1iZXIgb2Ygd29yZHMgaW4gdGhlIHRvdGFsIHRleHQuXG4gKiBAcGFyYW0ge251bWJlcn0gZGVuc2l0eUxvd2VyTGltaXQgVGhlIGxvd2VyIGxpbWl0IG9mIGtleXdvcmQgZGVuc2l0eS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBkZW5zaXR5VXBwZXJMaW1pdCBUaGUgdXBwZXIgbGltaXQgb2Yga2V5d29yZCBkZW5zaXR5LlxuICogQHJldHVybnMge1dvcmRDb21iaW5hdGlvbltdfSBGaWx0ZXJlZCB3b3JkIGNvbWJpbmF0aW9ucy5cbiAqL1xuZnVuY3Rpb24gZmlsdGVyT25EZW5zaXR5KCB3b3JkQ29tYmluYXRpb25zLCB3b3JkQ291bnQsIGRlbnNpdHlMb3dlckxpbWl0LCBkZW5zaXR5VXBwZXJMaW1pdCApIHtcblx0cmV0dXJuIHdvcmRDb21iaW5hdGlvbnMuZmlsdGVyKCBmdW5jdGlvbiggY29tYmluYXRpb24gKSB7XG5cdFx0cmV0dXJuICggY29tYmluYXRpb24uZ2V0RGVuc2l0eSggd29yZENvdW50ICkgPj0gZGVuc2l0eUxvd2VyTGltaXQgJiYgY29tYmluYXRpb24uZ2V0RGVuc2l0eSggd29yZENvdW50ICkgPCBkZW5zaXR5VXBwZXJMaW1pdFxuXHRcdCk7XG5cdH0gKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSByZWxldmFudCB3b3JkcyBpbiBhIGdpdmVuIHRleHQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gcmV0cmlldmUgdGhlIHJlbGV2YW50IHdvcmRzIG9mLlxuICogQHJldHVybnMge1dvcmRDb21iaW5hdGlvbltdfSBBbGwgcmVsZXZhbnQgd29yZHMgc29ydGVkIGFuZCBmaWx0ZXJlZCBmb3IgdGhpcyB0ZXh0LlxuICovXG5mdW5jdGlvbiBnZXRSZWxldmFudFdvcmRzKCB0ZXh0ICkge1xuXHR2YXIgd29yZHMgPSBnZXRXb3JkQ29tYmluYXRpb25zKCB0ZXh0LCAxICk7XG5cdHZhciB3b3JkQ291bnQgPSB3b3Jkcy5sZW5ndGg7XG5cblx0dmFyIG9uZVdvcmRDb21iaW5hdGlvbnMgPSBnZXRSZWxldmFudENvbWJpbmF0aW9ucyhcblx0XHRjYWxjdWxhdGVPY2N1cnJlbmNlcyggd29yZHMgKVxuXHQpO1xuXG5cdHNvcnRDb21iaW5hdGlvbnMoIG9uZVdvcmRDb21iaW5hdGlvbnMgKTtcblx0b25lV29yZENvbWJpbmF0aW9ucyA9IHRha2UoIG9uZVdvcmRDb21iaW5hdGlvbnMsIDEwMCApO1xuXG5cdHZhciBvbmVXb3JkUmVsZXZhbmNlTWFwID0ge307XG5cblx0Zm9yRWFjaCggb25lV29yZENvbWJpbmF0aW9ucywgZnVuY3Rpb24oIGNvbWJpbmF0aW9uICkge1xuXHRcdG9uZVdvcmRSZWxldmFuY2VNYXBbIGNvbWJpbmF0aW9uLmdldENvbWJpbmF0aW9uKCkgXSA9IGNvbWJpbmF0aW9uLmdldFJlbGV2YW5jZSgpO1xuXHR9ICk7XG5cblx0dmFyIHR3b1dvcmRDb21iaW5hdGlvbnMgPSBjYWxjdWxhdGVPY2N1cnJlbmNlcyggZ2V0V29yZENvbWJpbmF0aW9ucyggdGV4dCwgMiApICk7XG5cdHZhciB0aHJlZVdvcmRDb21iaW5hdGlvbnMgPSBjYWxjdWxhdGVPY2N1cnJlbmNlcyggZ2V0V29yZENvbWJpbmF0aW9ucyggdGV4dCwgMyApICk7XG5cdHZhciBmb3VyV29yZENvbWJpbmF0aW9ucyA9IGNhbGN1bGF0ZU9jY3VycmVuY2VzKCBnZXRXb3JkQ29tYmluYXRpb25zKCB0ZXh0LCA0ICkgKTtcblx0dmFyIGZpdmVXb3JkQ29tYmluYXRpb25zID0gY2FsY3VsYXRlT2NjdXJyZW5jZXMoIGdldFdvcmRDb21iaW5hdGlvbnMoIHRleHQsIDUgKSApO1xuXG5cdHZhciBjb21iaW5hdGlvbnMgPSBvbmVXb3JkQ29tYmluYXRpb25zLmNvbmNhdChcblx0XHR0d29Xb3JkQ29tYmluYXRpb25zLFxuXHRcdHRocmVlV29yZENvbWJpbmF0aW9ucyxcblx0XHRmb3VyV29yZENvbWJpbmF0aW9ucyxcblx0XHRmaXZlV29yZENvbWJpbmF0aW9uc1xuXHQpO1xuXG5cdGNvbWJpbmF0aW9ucyA9IGZpbHRlckZ1bmN0aW9uV29yZHMoIGNvbWJpbmF0aW9ucywgc3BlY2lhbENoYXJhY3RlcnMgKTtcblx0Y29tYmluYXRpb25zID0gZmlsdGVyRnVuY3Rpb25Xb3JkcyggY29tYmluYXRpb25zLCBmdW5jdGlvbldvcmRzKCkuYXJ0aWNsZXMgKTtcblx0Y29tYmluYXRpb25zID0gZmlsdGVyRnVuY3Rpb25Xb3JkcyggY29tYmluYXRpb25zLCBmdW5jdGlvbldvcmRzKCkucGVyc29uYWxQcm9ub3VucyApO1xuXHRjb21iaW5hdGlvbnMgPSBmaWx0ZXJGdW5jdGlvbldvcmRzKCBjb21iaW5hdGlvbnMsIGZ1bmN0aW9uV29yZHMoKS5wcmVwb3NpdGlvbnMgKTtcblx0Y29tYmluYXRpb25zID0gZmlsdGVyRnVuY3Rpb25Xb3JkcyggY29tYmluYXRpb25zLCBmdW5jdGlvbldvcmRzKCkuY29uanVuY3Rpb25zICk7XG5cdGNvbWJpbmF0aW9ucyA9IGZpbHRlckZ1bmN0aW9uV29yZHMoIGNvbWJpbmF0aW9ucywgZnVuY3Rpb25Xb3JkcygpLnF1YW50aWZpZXJzICk7XG5cdGNvbWJpbmF0aW9ucyA9IGZpbHRlckZ1bmN0aW9uV29yZHMoIGNvbWJpbmF0aW9ucywgZnVuY3Rpb25Xb3JkcygpLmRlbW9uc3RyYXRpdmVQcm9ub3VucyApO1xuXHRjb21iaW5hdGlvbnMgPSBmaWx0ZXJGdW5jdGlvbldvcmRzQXRCZWdpbm5pbmcoIGNvbWJpbmF0aW9ucywgZnVuY3Rpb25Xb3JkcygpLmZpbHRlcmVkUGFzc2l2ZUF1eGlsaWFyaWVzICk7XG5cdGNvbWJpbmF0aW9ucyA9IGZpbHRlckZ1bmN0aW9uV29yZHNBdEVuZGluZyggY29tYmluYXRpb25zLCBmdW5jdGlvbldvcmRzKCkudmVyYnMgKTtcblx0Y29tYmluYXRpb25zID0gZmlsdGVyRnVuY3Rpb25Xb3Jkc0F0RW5kaW5nKCBjb21iaW5hdGlvbnMsIGZ1bmN0aW9uV29yZHMoKS5yZWxhdGl2ZVByb25vdW5zICk7XG5cdGNvbWJpbmF0aW9ucyA9IGZpbHRlck9uU3lsbGFibGVDb3VudCggY29tYmluYXRpb25zLCAxICk7XG5cblxuXHRmb3JFYWNoKCBjb21iaW5hdGlvbnMsIGZ1bmN0aW9uKCBjb21iaW5hdGlvbiApIHtcblx0XHRjb21iaW5hdGlvbi5zZXRSZWxldmFudFdvcmRzKCBvbmVXb3JkUmVsZXZhbmNlTWFwICk7XG5cdH0gKTtcblxuXHRjb21iaW5hdGlvbnMgPSBnZXRSZWxldmFudENvbWJpbmF0aW9ucyggY29tYmluYXRpb25zLCB3b3JkQ291bnQgKTtcblx0c29ydENvbWJpbmF0aW9ucyggY29tYmluYXRpb25zICk7XG5cblx0aWYgKCB3b3JkQ291bnQgPj0gd29yZENvdW50TG93ZXJMaW1pdCApIHtcblx0XHRjb21iaW5hdGlvbnMgPSBmaWx0ZXJPbkRlbnNpdHkoIGNvbWJpbmF0aW9ucywgd29yZENvdW50LCBkZW5zaXR5TG93ZXJMaW1pdCwgZGVuc2l0eVVwcGVyTGltaXQgKTtcblx0fVxuXG5cdHJldHVybiB0YWtlKCBjb21iaW5hdGlvbnMsIHJlbGV2YW50V29yZExpbWl0ICk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRnZXRXb3JkQ29tYmluYXRpb25zOiBnZXRXb3JkQ29tYmluYXRpb25zLFxuXHRnZXRSZWxldmFudFdvcmRzOiBnZXRSZWxldmFudFdvcmRzLFxuXHRjYWxjdWxhdGVPY2N1cnJlbmNlczogY2FsY3VsYXRlT2NjdXJyZW5jZXMsXG5cdGdldFJlbGV2YW50Q29tYmluYXRpb25zOiBnZXRSZWxldmFudENvbWJpbmF0aW9ucyxcblx0c29ydENvbWJpbmF0aW9uczogc29ydENvbWJpbmF0aW9ucyxcblx0ZmlsdGVyRnVuY3Rpb25Xb3Jkc0F0QmVnaW5uaW5nOiBmaWx0ZXJGdW5jdGlvbldvcmRzQXRCZWdpbm5pbmcsXG5cdGZpbHRlckZ1bmN0aW9uV29yZHM6IGZpbHRlckZ1bmN0aW9uV29yZHMsXG5cdGZpbHRlclNwZWNpYWxDaGFyYWN0ZXJzOiBmaWx0ZXJTcGVjaWFsQ2hhcmFjdGVycyxcblx0ZmlsdGVyT25TeWxsYWJsZUNvdW50OiBmaWx0ZXJPblN5bGxhYmxlQ291bnQsXG5cdGZpbHRlck9uRGVuc2l0eTogZmlsdGVyT25EZW5zaXR5LFxufTtcbiIsIi8vIFJlcGxhY2UgYWxsIG90aGVyIHB1bmN0dWF0aW9uIGNoYXJhY3RlcnMgYXQgdGhlIGJlZ2lubmluZyBvciBhdCB0aGUgZW5kIG9mIGEgd29yZC5cbnZhciBwdW5jdHVhdGlvblJlZ2V4U3RyaW5nID0gXCJbXFxcXOKAk1xcXFwtXFxcXChcXFxcKV9cXFxcW1xcXFxd4oCZ4oCc4oCdXFxcIicuPyE6OyzCv8KhwqvCu1xcdTIwMTRcXHUwMGQ3XFx1MDAyYlxcdTAwMjZdK1wiO1xudmFyIHB1bmN0dWF0aW9uUmVnZXhTdGFydCA9IG5ldyBSZWdFeHAoIFwiXlwiICsgcHVuY3R1YXRpb25SZWdleFN0cmluZyApO1xudmFyIHB1bmN0dWF0aW9uUmVnZXhFbmQgPSBuZXcgUmVnRXhwKCBwdW5jdHVhdGlvblJlZ2V4U3RyaW5nICsgXCIkXCIgKTtcblxuLyoqXG4gKiBSZXBsYWNlcyBwdW5jdHVhdGlvbiBjaGFyYWN0ZXJzIGZyb20gdGhlIGdpdmVuIHRleHQgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHRvIHJlbW92ZSB0aGUgcHVuY3R1YXRpb24gY2hhcmFjdGVycyBmb3IuXG4gKlxuICogQHJldHVybnMge1N0cmluZ30gVGhlIHNhbml0aXplZCB0ZXh0LlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHR0ZXh0ID0gdGV4dC5yZXBsYWNlKCBwdW5jdHVhdGlvblJlZ2V4U3RhcnQsIFwiXCIgKTtcblx0dGV4dCA9IHRleHQucmVwbGFjZSggcHVuY3R1YXRpb25SZWdleEVuZCwgXCJcIiApO1xuXG5cdHJldHVybiB0ZXh0O1xufTtcbiIsIi8qKiBAbW9kdWxlIHN0cmluZ1Byb2Nlc3Npbmcvc3RyaXBIVE1MVGFncyAqL1xuXG52YXIgc3RyaXBTcGFjZXMgPSByZXF1aXJlKCBcIi4uL3N0cmluZ1Byb2Nlc3Npbmcvc3RyaXBTcGFjZXMuanNcIiApO1xuXG52YXIgYmxvY2tFbGVtZW50cyA9IHJlcXVpcmUoIFwiLi4vaGVscGVycy9odG1sLmpzXCIgKS5ibG9ja0VsZW1lbnRzO1xuXG52YXIgYmxvY2tFbGVtZW50U3RhcnRSZWdleCA9IG5ldyBSZWdFeHAoIFwiXjwoXCIgKyBibG9ja0VsZW1lbnRzLmpvaW4oIFwifFwiICkgKyBcIilbXj5dKj8+XCIsIFwiaVwiICk7XG52YXIgYmxvY2tFbGVtZW50RW5kUmVnZXggPSBuZXcgUmVnRXhwKCBcIjwvKFwiICsgYmxvY2tFbGVtZW50cy5qb2luKCBcInxcIiApICsgXCIpW14+XSo/PiRcIiwgXCJpXCIgKTtcblxuLyoqXG4gKiBTdHJpcCBpbmNvbXBsZXRlIHRhZ3Mgd2l0aGluIGEgdGV4dC4gU3RyaXBzIGFuIGVuZHRhZyBhdCB0aGUgYmVnaW5uaW5nIG9mIGEgc3RyaW5nIGFuZCB0aGUgc3RhcnQgdGFnIGF0IHRoZSBlbmQgb2YgYVxuICogc3RhcnQgb2YgYSBzdHJpbmcuXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byBzdHJpcCB0aGUgSFRNTC10YWdzIGZyb20gYXQgdGhlIGJlZ2luIGFuZCBlbmQuXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgdGV4dCB3aXRob3V0IEhUTUwtdGFncyBhdCB0aGUgYmVnaW4gYW5kIGVuZC5cbiAqL1xudmFyIHN0cmlwSW5jb21wbGV0ZVRhZ3MgPSBmdW5jdGlvbiggdGV4dCApIHtcblx0dGV4dCA9IHRleHQucmVwbGFjZSggL14oPFxcLyhbXj5dKyk+KSsvaSwgXCJcIiApO1xuXHR0ZXh0ID0gdGV4dC5yZXBsYWNlKCAvKDwoW15cXC8+XSspPikrJC9pLCBcIlwiICk7XG5cdHJldHVybiB0ZXh0O1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBibG9jayBlbGVtZW50IHRhZ3MgYXQgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mIGEgc3RyaW5nIGFuZCByZXR1cm5zIHRoaXMgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSB1bmZvcm1hdHRlZCBzdHJpbmcuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgdGV4dCB3aXRoIHJlbW92ZWQgSFRNTCBiZWdpbiBhbmQgZW5kIGJsb2NrIGVsZW1lbnRzXG4gKi9cbnZhciBzdHJpcEJsb2NrVGFnc0F0U3RhcnRFbmQgPSBmdW5jdGlvbiggdGV4dCApIHtcblx0dGV4dCA9IHRleHQucmVwbGFjZSggYmxvY2tFbGVtZW50U3RhcnRSZWdleCwgXCJcIiApO1xuXHR0ZXh0ID0gdGV4dC5yZXBsYWNlKCBibG9ja0VsZW1lbnRFbmRSZWdleCwgXCJcIiApO1xuXHRyZXR1cm4gdGV4dDtcbn07XG5cbi8qKlxuICogU3RyaXAgSFRNTC10YWdzIGZyb20gdGV4dFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHRvIHN0cmlwIHRoZSBIVE1MLXRhZ3MgZnJvbS5cbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSB0ZXh0IHdpdGhvdXQgSFRNTC10YWdzLlxuICovXG52YXIgc3RyaXBGdWxsVGFncyA9IGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHR0ZXh0ID0gdGV4dC5yZXBsYWNlKCAvKDwoW14+XSspPikvaWcsIFwiIFwiICk7XG5cdHRleHQgPSBzdHJpcFNwYWNlcyggdGV4dCApO1xuXHRyZXR1cm4gdGV4dDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRzdHJpcEZ1bGxUYWdzOiBzdHJpcEZ1bGxUYWdzLFxuXHRzdHJpcEluY29tcGxldGVUYWdzOiBzdHJpcEluY29tcGxldGVUYWdzLFxuXHRzdHJpcEJsb2NrVGFnc0F0U3RhcnRFbmQ6IHN0cmlwQmxvY2tUYWdzQXRTdGFydEVuZCxcbn07XG4iLCIvKiogQG1vZHVsZSBzdHJpbmdQcm9jZXNzaW5nL3N0cmlwU3BhY2VzICovXG5cbi8qKlxuICogU3RyaXAgZG91YmxlIHNwYWNlcyBmcm9tIHRleHRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byBzdHJpcCBzcGFjZXMgZnJvbS5cbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSB0ZXh0IHdpdGhvdXQgZG91YmxlIHNwYWNlc1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHQvLyBSZXBsYWNlIG11bHRpcGxlIHNwYWNlcyB3aXRoIHNpbmdsZSBzcGFjZVxuXHR0ZXh0ID0gdGV4dC5yZXBsYWNlKCAvXFxzezIsfS9nLCBcIiBcIiApO1xuXG5cdC8vIFJlcGxhY2Ugc3BhY2VzIGZvbGxvd2VkIGJ5IHBlcmlvZHMgd2l0aCBvbmx5IHRoZSBwZXJpb2QuXG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoIC9cXHNcXC4vZywgXCIuXCIgKTtcblxuXHQvLyBSZW1vdmUgZmlyc3QvbGFzdCBjaGFyYWN0ZXIgaWYgc3BhY2Vcblx0dGV4dCA9IHRleHQucmVwbGFjZSggL15cXHMrfFxccyskL2csIFwiXCIgKTtcblxuXHRyZXR1cm4gdGV4dDtcbn07XG4iLCJ2YXIgaXNVbmRlZmluZWQgPSByZXF1aXJlKCBcImxvZGFzaC9pc1VuZGVmaW5lZFwiICk7XG52YXIgcGljayA9IHJlcXVpcmUoIFwibG9kYXNoL3BpY2tcIiApO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBwYXJ0aWFsIGRldmlhdGlvbiB3aGVuIGNvdW50aW5nIHN5bGxhYmxlc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIEV4dHJhIG9wdGlvbnMgYWJvdXQgaG93IHRvIG1hdGNoIHRoaXMgZnJhZ21lbnQuXG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5sb2NhdGlvbiBUaGUgbG9jYXRpb24gaW4gdGhlIHdvcmQgd2hlcmUgdGhpcyBkZXZpYXRpb24gY2FuIG9jY3VyLlxuICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMud29yZCBUaGUgYWN0dWFsIHN0cmluZyB0aGF0IHNob3VsZCBiZSBjb3VudGVkIGRpZmZlcmVudGx5LlxuICogQHBhcmFtIHtudW1iZXJ9IG9wdGlvbnMuc3lsbGFibGVzIFRoZSBhbW91bnQgb2Ygc3lsbGFibGVzIHRoaXMgZnJhZ21lbnQgaGFzLlxuICogQHBhcmFtIHtzdHJpbmdbXX0gW29wdGlvbnMubm90Rm9sbG93ZWRCeV0gQSBsaXN0IG9mIGNoYXJhY3RlcnMgdGhhdCB0aGlzIGZyYWdtZW50IHNob3VsZG4ndCBiZSBmb2xsb3dlZCB3aXRoLlxuICogQHBhcmFtIHtzdHJpbmdbXX0gW29wdGlvbnMuYWxzb0ZvbGxvd2VkQnldIEEgbGlzdCBvZiBjaGFyYWN0ZXJzIHRoYXQgdGhpcyBmcmFnbWVudCBjb3VsZCBiZSBmb2xsb3dlZCB3aXRoLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBEZXZpYXRpb25GcmFnbWVudCggb3B0aW9ucyApIHtcblx0dGhpcy5fbG9jYXRpb24gPSBvcHRpb25zLmxvY2F0aW9uO1xuXHR0aGlzLl9mcmFnbWVudCA9IG9wdGlvbnMud29yZDtcblx0dGhpcy5fc3lsbGFibGVzID0gb3B0aW9ucy5zeWxsYWJsZXM7XG5cdHRoaXMuX3JlZ2V4ID0gbnVsbDtcblxuXHR0aGlzLl9vcHRpb25zID0gcGljayggb3B0aW9ucywgWyBcIm5vdEZvbGxvd2VkQnlcIiwgXCJhbHNvRm9sbG93ZWRCeVwiIF0gKTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgcmVnZXggdGhhdCBtYXRjaGVzIHRoaXMgZnJhZ21lbnQgaW5zaWRlIGEgd29yZC5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuRGV2aWF0aW9uRnJhZ21lbnQucHJvdG90eXBlLmNyZWF0ZVJlZ2V4ID0gZnVuY3Rpb24oKSB7XG5cdHZhciByZWdleFN0cmluZyA9IFwiXCI7XG5cdHZhciBvcHRpb25zID0gdGhpcy5fb3B0aW9ucztcblxuXHR2YXIgZnJhZ21lbnQgPSB0aGlzLl9mcmFnbWVudDtcblxuXHRpZiAoICEgaXNVbmRlZmluZWQoIG9wdGlvbnMubm90Rm9sbG93ZWRCeSApICkge1xuXHRcdGZyYWdtZW50ICs9IFwiKD8hW1wiICsgb3B0aW9ucy5ub3RGb2xsb3dlZEJ5LmpvaW4oIFwiXCIgKSArIFwiXSlcIjtcblx0fVxuXG5cdGlmICggISBpc1VuZGVmaW5lZCggb3B0aW9ucy5hbHNvRm9sbG93ZWRCeSApICkge1xuXHRcdGZyYWdtZW50ICs9IFwiW1wiICsgb3B0aW9ucy5hbHNvRm9sbG93ZWRCeS5qb2luKCBcIlwiICkgKyBcIl0/XCI7XG5cdH1cblxuXHRzd2l0Y2ggKCB0aGlzLl9sb2NhdGlvbiApIHtcblx0XHRjYXNlIFwiYXRCZWdpbm5pbmdcIjpcblx0XHRcdHJlZ2V4U3RyaW5nID0gXCJeXCIgKyBmcmFnbWVudDtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBcImF0RW5kXCI6XG5cdFx0XHRyZWdleFN0cmluZyA9IGZyYWdtZW50ICsgXCIkXCI7XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgXCJhdEJlZ2lubmluZ09yRW5kXCI6XG5cdFx0XHRyZWdleFN0cmluZyA9IFwiKF5cIiArIGZyYWdtZW50ICsgXCIpfChcIiArIGZyYWdtZW50ICsgXCIkKVwiO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRkZWZhdWx0OlxuXHRcdFx0cmVnZXhTdHJpbmcgPSBmcmFnbWVudDtcblx0XHRcdGJyZWFrO1xuXHR9XG5cblx0dGhpcy5fcmVnZXggPSBuZXcgUmVnRXhwKCByZWdleFN0cmluZyApO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSByZWdleCB0aGF0IG1hdGNoZXMgdGhpcyBmcmFnbWVudCBpbnNpZGUgYSB3b3JkLlxuICpcbiAqIEByZXR1cm5zIHtSZWdFeHB9IFRoZSByZWdleHAgdGhhdCBtYXRjaGVzIHRoaXMgZnJhZ21lbnQuXG4gKi9cbkRldmlhdGlvbkZyYWdtZW50LnByb3RvdHlwZS5nZXRSZWdleCA9IGZ1bmN0aW9uKCkge1xuXHRpZiAoIG51bGwgPT09IHRoaXMuX3JlZ2V4ICkge1xuXHRcdHRoaXMuY3JlYXRlUmVnZXgoKTtcblx0fVxuXG5cdHJldHVybiB0aGlzLl9yZWdleDtcbn07XG5cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGlzIGZyYWdtZW50IG9jY3VycyBpbiBhIHdvcmQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHdvcmQgVGhlIHdvcmQgdG8gbWF0Y2ggdGhlIGZyYWdtZW50IGluLlxuICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoaXMgZnJhZ21lbnQgb2NjdXJzIGluIGEgd29yZC5cbiAqL1xuRGV2aWF0aW9uRnJhZ21lbnQucHJvdG90eXBlLm9jY3Vyc0luID0gZnVuY3Rpb24oIHdvcmQgKSB7XG5cdHZhciByZWdleCA9IHRoaXMuZ2V0UmVnZXgoKTtcblxuXHRyZXR1cm4gcmVnZXgudGVzdCggd29yZCApO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIHRoaXMgZnJhZ21lbnQgZnJvbSB0aGUgZ2l2ZW4gd29yZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gd29yZCBUaGUgd29yZCB0byByZW1vdmUgdGhpcyBmcmFnbWVudCBmcm9tLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIG1vZGlmaWVkIHdvcmQuXG4gKi9cbkRldmlhdGlvbkZyYWdtZW50LnByb3RvdHlwZS5yZW1vdmVGcm9tID0gZnVuY3Rpb24oIHdvcmQgKSB7XG5cdC8vIFJlcGxhY2UgYnkgYSBzcGFjZSB0byBrZWVwIHRoZSByZW1haW5pbmcgcGFydHMgc2VwYXJhdGVkLlxuXHRyZXR1cm4gd29yZC5yZXBsYWNlKCB0aGlzLl9mcmFnbWVudCwgXCIgXCIgKTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgYW1vdW50IG9mIHN5bGxhYmxlcyBmb3IgdGhpcyBmcmFnbWVudC5cbiAqXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgYW1vdW50IG9mIHN5bGxhYmxlcyBmb3IgdGhpcyBmcmFnbWVudC5cbiAqL1xuRGV2aWF0aW9uRnJhZ21lbnQucHJvdG90eXBlLmdldFN5bGxhYmxlcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5fc3lsbGFibGVzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEZXZpYXRpb25GcmFnbWVudDtcbiIsIi8qKiBAbW9kdWxlIHN0cmluZ1Byb2Nlc3NpbmcvY291bnRTeWxsYWJsZXMgKi9cblxudmFyIHN5bGxhYmxlTWF0Y2hlcnMgPSByZXF1aXJlKCBcIi4uLy4uL2NvbmZpZy9zeWxsYWJsZXMuanNcIiApO1xuXG52YXIgZ2V0V29yZHMgPSByZXF1aXJlKCBcIi4uL2dldFdvcmRzLmpzXCIgKTtcblxudmFyIGZvckVhY2ggPSByZXF1aXJlKCBcImxvZGFzaC9mb3JFYWNoXCIgKTtcbnZhciBmaWx0ZXIgPSByZXF1aXJlKCBcImxvZGFzaC9maWx0ZXJcIiApO1xudmFyIGZpbmQgPSByZXF1aXJlKCBcImxvZGFzaC9maW5kXCIgKTtcbnZhciBpc1VuZGVmaW5lZCA9IHJlcXVpcmUoIFwibG9kYXNoL2lzVW5kZWZpbmVkXCIgKTtcbnZhciBtYXAgPSByZXF1aXJlKCBcImxvZGFzaC9tYXBcIiApO1xudmFyIHN1bSA9IHJlcXVpcmUoIFwibG9kYXNoL3N1bVwiICk7XG52YXIgbWVtb2l6ZSA9IHJlcXVpcmUoIFwibG9kYXNoL21lbW9pemVcIiApO1xudmFyIGZsYXRNYXAgPSByZXF1aXJlKCBcImxvZGFzaC9mbGF0TWFwXCIgKTtcblxudmFyIFN5bGxhYmxlQ291bnRJdGVyYXRvciA9IHJlcXVpcmUoIFwiLi4vLi4vaGVscGVycy9zeWxsYWJsZUNvdW50SXRlcmF0b3IuanNcIiApO1xudmFyIERldmlhdGlvbkZyYWdtZW50ID0gcmVxdWlyZSggXCIuL0RldmlhdGlvbkZyYWdtZW50XCIgKTtcblxuLyoqXG4gKiBDb3VudHMgdm93ZWwgZ3JvdXBzIGluc2lkZSBhIHdvcmQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHdvcmQgQSB0ZXh0IHdpdGggd29yZHMgdG8gY291bnQgc3lsbGFibGVzLlxuICogQHBhcmFtIHtTdHJpbmd9IGxvY2FsZSBUaGUgbG9jYWxlIHRvIHVzZSBmb3IgY291bnRpbmcgc3lsbGFibGVzLlxuICogQHJldHVybnMge251bWJlcn0gdGhlIHN5bGxhYmxlIGNvdW50LlxuICovXG52YXIgY291bnRWb3dlbEdyb3VwcyA9IGZ1bmN0aW9uKCB3b3JkLCBsb2NhbGUgKSB7XG5cdHZhciBudW1iZXJPZlN5bGxhYmxlcyA9IDA7XG5cdHZhciB2b3dlbFJlZ2V4ID0gbmV3IFJlZ0V4cCggXCJbXlwiICsgc3lsbGFibGVNYXRjaGVycyggbG9jYWxlICkudm93ZWxzICsgXCJdXCIsIFwiaWdcIiApO1xuXHR2YXIgZm91bmRWb3dlbHMgPSB3b3JkLnNwbGl0KCB2b3dlbFJlZ2V4ICk7XG5cdHZhciBmaWx0ZXJlZFdvcmRzID0gZmlsdGVyKCBmb3VuZFZvd2VscywgZnVuY3Rpb24oIHZvd2VsICkge1xuXHRcdHJldHVybiB2b3dlbCAhPT0gXCJcIjtcblx0fSApO1xuXHRudW1iZXJPZlN5bGxhYmxlcyArPSBmaWx0ZXJlZFdvcmRzLmxlbmd0aDtcblxuXHRyZXR1cm4gbnVtYmVyT2ZTeWxsYWJsZXM7XG59O1xuXG4vKipcbiAqIENvdW50cyB0aGUgc3lsbGFibGVzIHVzaW5nIHZvd2VsIGV4Y2x1c2lvbnMuIFRoZXNlIGFyZSB1c2VkIGZvciBncm91cHMgb2Ygdm93ZWxzIHRoYXQgYXJlIG1vcmUgb3IgbGVzc1xuICogdGhhbiAxIHN5bGxhYmxlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB3b3JkIFRoZSB3b3JkIHRvIGNvdW50IHN5bGxhYmxlcyBvZi5cbiAqIEBwYXJhbSB7U3RyaW5nfSBsb2NhbGUgVGhlIGxvY2FsZSB0byB1c2UgZm9yIGNvdW50aW5nIHN5bGxhYmxlcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBudW1iZXIgb2Ygc3lsbGFibGVzIGZvdW5kIGluIHRoZSBnaXZlbiB3b3JkLlxuICovXG52YXIgY291bnRWb3dlbERldmlhdGlvbnMgPSBmdW5jdGlvbiggd29yZCwgbG9jYWxlICkge1xuXHR2YXIgc3lsbGFibGVDb3VudEl0ZXJhdG9yID0gbmV3IFN5bGxhYmxlQ291bnRJdGVyYXRvciggc3lsbGFibGVNYXRjaGVycyggbG9jYWxlICkgKTtcblx0cmV0dXJuIHN5bGxhYmxlQ291bnRJdGVyYXRvci5jb3VudFN5bGxhYmxlcyggd29yZCApO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBudW1iZXIgb2Ygc3lsbGFibGVzIGZvciB0aGUgd29yZCBpZiBpdCBpcyBpbiB0aGUgbGlzdCBvZiBmdWxsIHdvcmQgZGV2aWF0aW9ucy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gd29yZCBUaGUgd29yZCB0byByZXRyaWV2ZSB0aGUgc3lsbGFibGVzIGZvci5cbiAqIEBwYXJhbSB7U3RyaW5nfSBsb2NhbGUgVGhlIGxvY2FsZSB0byB1c2UgZm9yIGNvdW50aW5nIHN5bGxhYmxlcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBudW1iZXIgb2Ygc3lsbGFibGVzIGZvdW5kLlxuICovXG52YXIgY291bnRGdWxsV29yZERldmlhdGlvbnMgPSBmdW5jdGlvbiggd29yZCwgbG9jYWxlICkge1xuXHR2YXIgZnVsbFdvcmREZXZpYXRpb25zID0gc3lsbGFibGVNYXRjaGVycyggbG9jYWxlICkuZGV2aWF0aW9ucy53b3Jkcy5mdWxsO1xuXG5cdHZhciBkZXZpYXRpb24gPSBmaW5kKCBmdWxsV29yZERldmlhdGlvbnMsIGZ1bmN0aW9uKCBmdWxsV29yZERldmlhdGlvbiApIHtcblx0XHRyZXR1cm4gZnVsbFdvcmREZXZpYXRpb24ud29yZCA9PT0gd29yZDtcblx0fSApO1xuXG5cdGlmICggISBpc1VuZGVmaW5lZCggZGV2aWF0aW9uICkgKSB7XG5cdFx0cmV0dXJuIGRldmlhdGlvbi5zeWxsYWJsZXM7XG5cdH1cblxuXHRyZXR1cm4gMDtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBkZXZpYXRpb24gZnJhZ21lbnRzIGZvciBhIGNlcnRhaW4gbG9jYWxlLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBzeWxsYWJsZUNvbmZpZyBTeWxsYWJsZSBjb25maWcgZm9yIGEgY2VydGFpbiBsb2NhbGUuXG4gKiBAcmV0dXJucyB7RGV2aWF0aW9uRnJhZ21lbnRbXX0gQSBsaXN0IG9mIGRldmlhdGlvbiBmcmFnbWVudHNcbiAqL1xuZnVuY3Rpb24gY3JlYXRlRGV2aWF0aW9uRnJhZ21lbnRzKCBzeWxsYWJsZUNvbmZpZyApIHtcblx0dmFyIGRldmlhdGlvbkZyYWdtZW50cyA9IFtdO1xuXG5cdHZhciBkZXZpYXRpb25zID0gc3lsbGFibGVDb25maWcuZGV2aWF0aW9ucztcblxuXHRpZiAoICEgaXNVbmRlZmluZWQoIGRldmlhdGlvbnMud29yZHMgKSAmJiAhIGlzVW5kZWZpbmVkKCBkZXZpYXRpb25zLndvcmRzLmZyYWdtZW50cyApICkge1xuXHRcdGRldmlhdGlvbkZyYWdtZW50cyA9IGZsYXRNYXAoIGRldmlhdGlvbnMud29yZHMuZnJhZ21lbnRzLCBmdW5jdGlvbiggZnJhZ21lbnRzLCBmcmFnbWVudExvY2F0aW9uICkge1xuXHRcdFx0cmV0dXJuIG1hcCggZnJhZ21lbnRzLCBmdW5jdGlvbiggZnJhZ21lbnQgKSB7XG5cdFx0XHRcdGZyYWdtZW50LmxvY2F0aW9uID0gZnJhZ21lbnRMb2NhdGlvbjtcblxuXHRcdFx0XHRyZXR1cm4gbmV3IERldmlhdGlvbkZyYWdtZW50KCBmcmFnbWVudCApO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdHJldHVybiBkZXZpYXRpb25GcmFnbWVudHM7XG59XG5cbnZhciBjcmVhdGVEZXZpYXRpb25GcmFnbWVudHNNZW1vaXplZCA9IG1lbW9pemUoIGNyZWF0ZURldmlhdGlvbkZyYWdtZW50cyApO1xuXG4vKipcbiAqIENvdW50cyBzeWxsYWJsZXMgaW4gcGFydGlhbCBleGNsdXNpb25zLiBJZiB0aGVzZSBhcmUgZm91bmQsIHJldHVybnMgdGhlIG51bWJlciBvZiBzeWxsYWJsZXMgIGZvdW5kLCBhbmQgdGhlIG1vZGlmaWVkIHdvcmQuXG4gKiBUaGUgd29yZCBpcyBtb2RpZmllZCBzbyB0aGUgZXhjbHVkZWQgcGFydCBpc24ndCBjb3VudGVkIGJ5IHRoZSBub3JtYWwgc3lsbGFibGUgY291bnRlci5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gd29yZCBUaGUgd29yZCB0byBjb3VudCBzeWxsYWJsZXMgb2YuXG4gKiBAcGFyYW0ge1N0cmluZ30gbG9jYWxlIFRoZSBsb2NhbGUgdG8gdXNlIGZvciBjb3VudGluZyBzeWxsYWJsZXMuXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBUaGUgbnVtYmVyIG9mIHN5bGxhYmxlcyBmb3VuZCBhbmQgdGhlIG1vZGlmaWVkIHdvcmQuXG4gKi9cbnZhciBjb3VudFBhcnRpYWxXb3JkRGV2aWF0aW9ucyA9IGZ1bmN0aW9uKCB3b3JkLCBsb2NhbGUgKSB7XG5cdHZhciBkZXZpYXRpb25GcmFnbWVudHMgPSBjcmVhdGVEZXZpYXRpb25GcmFnbWVudHNNZW1vaXplZCggc3lsbGFibGVNYXRjaGVycyggbG9jYWxlICkgKTtcblx0dmFyIHJlbWFpbmluZ1BhcnRzID0gd29yZDtcblx0dmFyIHN5bGxhYmxlQ291bnQgPSAwO1xuXG5cdGZvckVhY2goIGRldmlhdGlvbkZyYWdtZW50cywgZnVuY3Rpb24oIGRldmlhdGlvbkZyYWdtZW50ICkge1xuXHRcdGlmICggZGV2aWF0aW9uRnJhZ21lbnQub2NjdXJzSW4oIHJlbWFpbmluZ1BhcnRzICkgKSB7XG5cdFx0XHRyZW1haW5pbmdQYXJ0cyA9IGRldmlhdGlvbkZyYWdtZW50LnJlbW92ZUZyb20oIHJlbWFpbmluZ1BhcnRzICk7XG5cdFx0XHRzeWxsYWJsZUNvdW50ICs9IGRldmlhdGlvbkZyYWdtZW50LmdldFN5bGxhYmxlcygpO1xuXHRcdH1cblx0fSApO1xuXG5cdHJldHVybiB7IHdvcmQ6IHJlbWFpbmluZ1BhcnRzLCBzeWxsYWJsZUNvdW50OiBzeWxsYWJsZUNvdW50IH07XG59O1xuXG4vKipcbiAqIENvdW50IHRoZSBudW1iZXIgb2Ygc3lsbGFibGVzIGluIGEgd29yZCwgdXNpbmcgdm93ZWxzIGFuZCBleGNlcHRpb25zLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB3b3JkIFRoZSB3b3JkIHRvIGNvdW50IHRoZSBudW1iZXIgb2Ygc3lsbGFibGVzIG9mLlxuICogQHBhcmFtIHtTdHJpbmd9IGxvY2FsZSBUaGUgbG9jYWxlIHRvIHVzZSBmb3IgY291bnRpbmcgc3lsbGFibGVzLlxuICogQHJldHVybnMge251bWJlcn0gVGhlIG51bWJlciBvZiBzeWxsYWJsZXMgZm91bmQgaW4gYSB3b3JkLlxuICovXG52YXIgY291bnRVc2luZ1Zvd2VscyA9IGZ1bmN0aW9uKCB3b3JkLCBsb2NhbGUgKSB7XG5cdHZhciBzeWxsYWJsZUNvdW50ID0gMDtcblxuXHRzeWxsYWJsZUNvdW50ICs9IGNvdW50Vm93ZWxHcm91cHMoIHdvcmQsIGxvY2FsZSApO1xuXHRzeWxsYWJsZUNvdW50ICs9IGNvdW50Vm93ZWxEZXZpYXRpb25zKCB3b3JkLCBsb2NhbGUgKTtcblxuXHRyZXR1cm4gc3lsbGFibGVDb3VudDtcbn07XG5cbi8qKlxuICogQ291bnRzIHRoZSBudW1iZXIgb2Ygc3lsbGFibGVzIGluIGEgd29yZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gd29yZCBUaGUgd29yZCB0byBjb3VudCBzeWxsYWJsZXMgb2YuXG4gKiBAcGFyYW0ge3N0cmluZ30gbG9jYWxlIFRoZSBsb2NhbGUgb2YgdGhlIHdvcmQuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgc3lsbGFibGUgY291bnQgZm9yIHRoZSB3b3JkLlxuICovXG52YXIgY291bnRTeWxsYWJsZXNJbldvcmQgPSBmdW5jdGlvbiggd29yZCwgbG9jYWxlICkge1xuXHR2YXIgc3lsbGFibGVDb3VudCA9IDA7XG5cblx0dmFyIGZ1bGxXb3JkRXhjbHVzaW9uID0gY291bnRGdWxsV29yZERldmlhdGlvbnMoIHdvcmQsIGxvY2FsZSApO1xuXHRpZiAoIGZ1bGxXb3JkRXhjbHVzaW9uICE9PSAwICkge1xuXHRcdHJldHVybiBmdWxsV29yZEV4Y2x1c2lvbjtcblx0fVxuXG5cdHZhciBwYXJ0aWFsRXhjbHVzaW9ucyA9IGNvdW50UGFydGlhbFdvcmREZXZpYXRpb25zKCB3b3JkLCBsb2NhbGUgKTtcblx0d29yZCA9IHBhcnRpYWxFeGNsdXNpb25zLndvcmQ7XG5cdHN5bGxhYmxlQ291bnQgKz0gcGFydGlhbEV4Y2x1c2lvbnMuc3lsbGFibGVDb3VudDtcblx0c3lsbGFibGVDb3VudCArPSBjb3VudFVzaW5nVm93ZWxzKCB3b3JkLCBsb2NhbGUgKTtcblxuXHRyZXR1cm4gc3lsbGFibGVDb3VudDtcbn07XG5cbi8qKlxuICogQ291bnRzIHRoZSBudW1iZXIgb2Ygc3lsbGFibGVzIGluIGEgdGV4dCBwZXIgd29yZCBiYXNlZCBvbiB2b3dlbHMuXG4gKiBVc2VzIGV4Y2x1c2lvbiB3b3JkcyBmb3Igd29yZHMgdGhhdCBjYW5ub3QgYmUgbWF0Y2hlZCB3aXRoIHZvd2VsIG1hdGNoaW5nLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHRvIGNvdW50IHRoZSBzeWxsYWJsZXMgb2YuXG4gKiBAcGFyYW0ge1N0cmluZ30gbG9jYWxlIFRoZSBsb2NhbGUgdG8gdXNlIGZvciBjb3VudGluZyBzeWxsYWJsZXMuXG4gKiBAcmV0dXJucyB7aW50fSBUaGUgdG90YWwgbnVtYmVyIG9mIHN5bGxhYmxlcyBmb3VuZCBpbiB0aGUgdGV4dC5cbiAqL1xudmFyIGNvdW50U3lsbGFibGVzSW5UZXh0ID0gZnVuY3Rpb24oIHRleHQsIGxvY2FsZSApIHtcblx0dGV4dCA9IHRleHQudG9Mb2NhbGVMb3dlckNhc2UoKTtcblx0dmFyIHdvcmRzID0gZ2V0V29yZHMoIHRleHQgKTtcblxuXHR2YXIgc3lsbGFibGVDb3VudHMgPSBtYXAoIHdvcmRzLCAgZnVuY3Rpb24oIHdvcmQgKSB7XG5cdFx0cmV0dXJuIGNvdW50U3lsbGFibGVzSW5Xb3JkKCB3b3JkLCBsb2NhbGUgKTtcblx0fSApO1xuXG5cdHJldHVybiBzdW0oIHN5bGxhYmxlQ291bnRzICk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvdW50U3lsbGFibGVzSW5UZXh0O1xuIiwiLyoqIEBtb2R1bGUgc3RyaW5nUHJvY2Vzc2luZy91bmlmeVdoaXRlc3BhY2UgKi9cblxuLyoqXG4gKiBSZXBsYWNlcyBhIG5vbiBicmVha2luZyBzcGFjZSB3aXRoIGEgbm9ybWFsIHNwYWNlXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgc3RyaW5nIHRvIHJlcGxhY2UgdGhlIG5vbiBicmVha2luZyBzcGFjZSBpbi5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSB0ZXh0IHdpdGggdW5pZmllZCBzcGFjZXMuXG4gKi9cbnZhciB1bmlmeU5vbkJyZWFraW5nU3BhY2UgPSBmdW5jdGlvbiggdGV4dCApIHtcblx0cmV0dXJuIHRleHQucmVwbGFjZSggLyZuYnNwOy9nLCBcIiBcIiApO1xufTtcblxuLyoqXG4gKiBSZXBsYWNlcyBhbGwgd2hpdGVzcGFjZXMgd2l0aCBhIG5vcm1hbCBzcGFjZVxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGhlIHN0cmluZyB0byByZXBsYWNlIHRoZSBub24gYnJlYWtpbmcgc3BhY2UgaW4uXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgdGV4dCB3aXRoIHVuaWZpZWQgc3BhY2VzLlxuICovXG52YXIgdW5pZnlXaGl0ZVNwYWNlID0gZnVuY3Rpb24oIHRleHQgKSB7XG5cdHJldHVybiB0ZXh0LnJlcGxhY2UoIC9cXHMvZywgXCIgXCIgKTtcbn07XG5cbi8qKlxuICogQ29udmVydHMgYWxsIHdoaXRlc3BhY2UgdG8gc3BhY2VzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHRvIHJlcGxhY2Ugc3BhY2VzLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIHRleHQgd2l0aCB1bmlmaWVkIHNwYWNlcy5cbiAqL1xudmFyIHVuaWZ5QWxsU3BhY2VzID0gZnVuY3Rpb24oIHRleHQgKSB7XG5cdHRleHQgPSB1bmlmeU5vbkJyZWFraW5nU3BhY2UoIHRleHQgKTtcblx0cmV0dXJuIHVuaWZ5V2hpdGVTcGFjZSggdGV4dCApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHVuaWZ5Tm9uQnJlYWtpbmdTcGFjZTogdW5pZnlOb25CcmVha2luZ1NwYWNlLFxuXHR1bmlmeVdoaXRlU3BhY2U6IHVuaWZ5V2hpdGVTcGFjZSxcblx0dW5pZnlBbGxTcGFjZXM6IHVuaWZ5QWxsU3BhY2VzLFxufTtcbiIsInZhciBmdW5jdGlvbldvcmRzID0gcmVxdWlyZSggXCIuLi9yZXNlYXJjaGVzL2VuZ2xpc2gvZnVuY3Rpb25Xb3Jkc1wiICkoKS5hbGw7XG52YXIgZm9yRWFjaCA9IHJlcXVpcmUoIFwibG9kYXNoL2ZvckVhY2hcIiApO1xudmFyIGhhcyA9IHJlcXVpcmUoIFwibG9kYXNoL2hhc1wiICk7XG5cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gd29yZCBpcyBhIGZ1bmN0aW9uIHdvcmQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHdvcmQgVGhlIHdvcmQgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhlIHdvcmQgaXMgYSBmdW5jdGlvbiB3b3JkLlxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uV29yZCggd29yZCApIHtcblx0cmV0dXJuIC0xICE9PSBmdW5jdGlvbldvcmRzLmluZGV4T2YoIHdvcmQudG9Mb2NhbGVMb3dlckNhc2UoKSApO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSB3b3JkIGNvbWJpbmF0aW9uIGluIHRoZSBjb250ZXh0IG9mIHJlbGV2YW50IHdvcmRzLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICpcbiAqIEBwYXJhbSB7c3RyaW5nW119IHdvcmRzIFRoZSBsaXN0IG9mIHdvcmRzIHRoYXQgdGhpcyBjb21iaW5hdGlvbiBjb25zaXN0cyBvZi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb2NjdXJyZW5jZXNdIFRoZSBudW1iZXIgb2Ygb2NjdXJyZW5jZXMsIGRlZmF1bHRzIHRvIDAuXG4gKi9cbmZ1bmN0aW9uIFdvcmRDb21iaW5hdGlvbiggd29yZHMsIG9jY3VycmVuY2VzICkge1xuXHR0aGlzLl93b3JkcyA9IHdvcmRzO1xuXHR0aGlzLl9sZW5ndGggPSB3b3Jkcy5sZW5ndGg7XG5cdHRoaXMuX29jY3VycmVuY2VzID0gb2NjdXJyZW5jZXMgfHwgMDtcbn1cblxuV29yZENvbWJpbmF0aW9uLmxlbmd0aEJvbnVzID0ge1xuXHQyOiAzLFxuXHQzOiA3LFxuXHQ0OiAxMixcblx0NTogMTgsXG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGJhc2UgcmVsZXZhbmNlIGJhc2VkIG9uIHRoZSBsZW5ndGggb2YgdGhpcyBjb21iaW5hdGlvbi5cbiAqXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgYmFzZSByZWxldmFuY2UgYmFzZWQgb24gdGhlIGxlbmd0aC5cbiAqL1xuV29yZENvbWJpbmF0aW9uLnByb3RvdHlwZS5nZXRMZW5ndGhCb251cyA9IGZ1bmN0aW9uKCkge1xuXHRpZiAoIGhhcyggV29yZENvbWJpbmF0aW9uLmxlbmd0aEJvbnVzLCB0aGlzLl9sZW5ndGggKSApIHtcblx0XHRyZXR1cm4gV29yZENvbWJpbmF0aW9uLmxlbmd0aEJvbnVzWyB0aGlzLl9sZW5ndGggXTtcblx0fVxuXG5cdHJldHVybiAwO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBsaXN0IHdpdGggd29yZHMuXG4gKlxuICogQHJldHVybnMge2FycmF5fSBUaGUgbGlzdCB3aXRoIHdvcmRzLlxuICovXG5Xb3JkQ29tYmluYXRpb24ucHJvdG90eXBlLmdldFdvcmRzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLl93b3Jkcztcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgd29yZCBjb21iaW5hdGlvbiBsZW5ndGguXG4gKlxuICogQHJldHVybnMge251bWJlcn0gVGhlIHdvcmQgY29tYmluYXRpb24gbGVuZ3RoLlxuICovXG5Xb3JkQ29tYmluYXRpb24ucHJvdG90eXBlLmdldExlbmd0aCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5fbGVuZ3RoO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBjb21iaW5hdGlvbiBhcyBpdCBvY2N1cnMgaW4gdGhlIHRleHQuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmF0aW9uLlxuICovXG5Xb3JkQ29tYmluYXRpb24ucHJvdG90eXBlLmdldENvbWJpbmF0aW9uID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLl93b3Jkcy5qb2luKCBcIiBcIiApO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBhbW91bnQgb2Ygb2NjdXJyZW5jZXMgb2YgdGhpcyB3b3JkIGNvbWJpbmF0aW9uLlxuICpcbiAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBhbW91bnQgb2Ygb2NjdXJyZW5jZXMuXG4gKi9cbldvcmRDb21iaW5hdGlvbi5wcm90b3R5cGUuZ2V0T2NjdXJyZW5jZXMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuX29jY3VycmVuY2VzO1xufTtcblxuLyoqXG4gKiBJbmNyZW1lbnRzIHRoZSBvY2N1cnJlbmNlcy5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuV29yZENvbWJpbmF0aW9uLnByb3RvdHlwZS5pbmNyZW1lbnRPY2N1cnJlbmNlcyA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLl9vY2N1cnJlbmNlcyArPSAxO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSByZWxldmFuY2Ugb2YgdGhlIGxlbmd0aC5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gcmVsZXZhbnRXb3JkUGVyY2VudGFnZSBUaGUgcmVsZXZhbmNlIG9mIHRoZSB3b3JkcyB3aXRoaW4gdGhlIGNvbWJpbmF0aW9uLlxuICogQHJldHVybnMge251bWJlcn0gVGhlIHJlbGV2YW5jZSBiYXNlZCBvbiB0aGUgbGVuZ3RoIGFuZCB0aGUgd29yZCByZWxldmFuY2UuXG4gKi9cbldvcmRDb21iaW5hdGlvbi5wcm90b3R5cGUuZ2V0TXVsdGlwbGllciA9IGZ1bmN0aW9uKCByZWxldmFudFdvcmRQZXJjZW50YWdlICkge1xuXHR2YXIgbGVuZ3RoQm9udXMgPSB0aGlzLmdldExlbmd0aEJvbnVzKCk7XG5cblx0Ly8gVGhlIHJlbGV2YW5jZSBzY2FsZXMgbGluZWFybHkgZnJvbSB0aGUgcmVsZXZhbmNlIG9mIG9uZSB3b3JkIHRvIHRoZSBtYXhpbXVtLlxuXHRyZXR1cm4gMSArIHJlbGV2YW50V29yZFBlcmNlbnRhZ2UgKiBsZW5ndGhCb251cztcbn07XG5cbi8qKlxuICogUmV0dXJucyBpZiB0aGUgZ2l2ZW4gd29yZCBpcyBhIHJlbGV2YW50IHdvcmQgYmFzZWQgb24gdGhlIGdpdmVuIHdvcmQgcmVsZXZhbmNlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB3b3JkIFRoZSB3b3JkIHRvIGNoZWNrIGlmIGl0IGlzIHJlbGV2YW50LlxuICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IGl0IGlzIHJlbGV2YW50LlxuICovXG5Xb3JkQ29tYmluYXRpb24ucHJvdG90eXBlLmlzUmVsZXZhbnRXb3JkID0gZnVuY3Rpb24oIHdvcmQgKSB7XG5cdHJldHVybiBoYXMoIHRoaXMuX3JlbGV2YW50V29yZHMsIHdvcmQgKTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgcmVsZXZhbmNlIG9mIHRoZSB3b3JkcyB3aXRoaW4gdGhpcyBjb21iaW5hdGlvbi5cbiAqXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgcGVyY2VudGFnZSBvZiByZWxldmFudCB3b3JkcyBpbnNpZGUgdGhpcyBjb21iaW5hdGlvbi5cbiAqL1xuV29yZENvbWJpbmF0aW9uLnByb3RvdHlwZS5nZXRSZWxldmFudFdvcmRQZXJjZW50YWdlID0gZnVuY3Rpb24oKSB7XG5cdHZhciByZWxldmFudFdvcmRDb3VudCA9IDAsIHdvcmRSZWxldmFuY2UgPSAxO1xuXG5cdGlmICggdGhpcy5fbGVuZ3RoID4gMSApIHtcblx0XHRmb3JFYWNoKCB0aGlzLl93b3JkcywgZnVuY3Rpb24oIHdvcmQgKSB7XG5cdFx0XHRpZiAoIHRoaXMuaXNSZWxldmFudFdvcmQoIHdvcmQgKSApIHtcblx0XHRcdFx0cmVsZXZhbnRXb3JkQ291bnQgKz0gMTtcblx0XHRcdH1cblx0XHR9LmJpbmQoIHRoaXMgKSApO1xuXG5cdFx0d29yZFJlbGV2YW5jZSA9IHJlbGV2YW50V29yZENvdW50IC8gdGhpcy5fbGVuZ3RoO1xuXHR9XG5cblx0cmV0dXJuIHdvcmRSZWxldmFuY2U7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIHJlbGV2YW5jZSBmb3IgdGhpcyB3b3JkIGNvbWJpbmF0aW9uLlxuICpcbiAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSByZWxldmFuY2Ugb2YgdGhpcyB3b3JkIGNvbWJpbmF0aW9uLlxuICovXG5Xb3JkQ29tYmluYXRpb24ucHJvdG90eXBlLmdldFJlbGV2YW5jZSA9IGZ1bmN0aW9uKCkge1xuXHRpZiAoIHRoaXMuX3dvcmRzLmxlbmd0aCA9PT0gMSAmJiBpc0Z1bmN0aW9uV29yZCggdGhpcy5fd29yZHNbIDAgXSApICkge1xuXHRcdHJldHVybiAwO1xuXHR9XG5cblx0dmFyIHdvcmRSZWxldmFuY2UgPSB0aGlzLmdldFJlbGV2YW50V29yZFBlcmNlbnRhZ2UoKTtcblx0aWYgKCB3b3JkUmVsZXZhbmNlID09PSAwICkge1xuXHRcdHJldHVybiAwO1xuXHR9XG5cblx0cmV0dXJuIHRoaXMuZ2V0TXVsdGlwbGllciggd29yZFJlbGV2YW5jZSApICogdGhpcy5fb2NjdXJyZW5jZXM7XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIHJlbGV2YW5jZSBvZiBzaW5nbGUgd29yZHNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcmVsZXZhbnRXb3JkcyBBIG1hcHBpbmcgZnJvbSBhIHdvcmQgdG8gYSByZWxldmFuY2UuXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuV29yZENvbWJpbmF0aW9uLnByb3RvdHlwZS5zZXRSZWxldmFudFdvcmRzID0gZnVuY3Rpb24oIHJlbGV2YW50V29yZHMgKSB7XG5cdHRoaXMuX3JlbGV2YW50V29yZHMgPSByZWxldmFudFdvcmRzO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBkZW5zaXR5IG9mIHRoaXMgY29tYmluYXRpb24gd2l0aGluIHRoZSB0ZXh0LlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSB3b3JkQ291bnQgVGhlIHdvcmQgY291bnQgb2YgdGhlIHRleHQgdGhpcyBjb21iaW5hdGlvbiB3YXMgZm91bmQgaW4uXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgZGVuc2l0eSBvZiB0aGlzIGNvbWJpbmF0aW9uLlxuICovXG5Xb3JkQ29tYmluYXRpb24ucHJvdG90eXBlLmdldERlbnNpdHkgPSBmdW5jdGlvbiggd29yZENvdW50ICkge1xuXHRyZXR1cm4gdGhpcy5fb2NjdXJyZW5jZXMgLyB3b3JkQ291bnQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdvcmRDb21iaW5hdGlvbjtcbiJdfQ==
