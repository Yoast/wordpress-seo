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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Handles the retrieval and storage of focus keyword suggestions
 */
var ProminentWordStorage = function () {

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

		this._rootUrl = rootUrl;
		this._nonce = nonce;
		this._cache = new _ProminentWordCache2.default();
		this._postID = postID;
		this._savingProminentWords = false;

		this.retrieveProminentWordId = this.retrieveProminentWordId.bind(this);
	}

	/**
  * Saves prominent words to the database using AJAX
  *
  * @param {WordCombination[]} prominentWords The prominent words to save.
  * @returns {Promise}
  */


	_createClass(ProminentWordStorage, [{
		key: "saveProminentWords",
		value: function saveProminentWords(prominentWords) {
			var _this = this;

			// If there is already a save sequence in progress, don't do it again.
			if (this._savingProminentWords) {
				return;
			}
			this._savingProminentWords = true;

			var prominentWordIds = prominentWords.slice(0, 20).map(this.retrieveProminentWordId);

			return Promise.all(prominentWordIds).then(function (prominentWords) {
				jQuery.ajax({
					type: "POST",
					url: _this._rootUrl + "wp/v2/posts/" + _this._postID,
					beforeSend: function beforeSend(xhr) {
						xhr.setRequestHeader("X-WP-Nonce", _this._nonce);
					},
					data: {
						// eslint-disable-next-line camelcase
						yst_prominent_words: prominentWords
					},
					dataType: "json"
				}).always(function () {
					_this._savingProminentWords = false;
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
			var _this2 = this;

			var cachedId = this._cache.getID(prominentWord.getCombination());
			if (0 !== cachedId) {
				return Promise.resolve(cachedId);
			}

			var foundProminentWord = new Promise(function (resolve, reject) {
				jQuery.ajax({
					type: "GET",
					url: _this2._rootUrl + "yoast/v1/prominent_words",
					beforeSend: function beforeSend(xhr) {
						xhr.setRequestHeader("X-WP-Nonce", _this2._nonce);
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
					return _this2.createProminentWordTerm(prominentWord);
				}

				return prominentWordTerm;
			});

			return createdProminentWord.then(function (prominentWordTerm) {
				_this2._cache.setID(prominentWord.getCombination(), prominentWordTerm.id);

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
			var _this3 = this;

			return new Promise(function (resolve, reject) {
				jQuery.ajax({
					type: "POST",
					url: _this3._rootUrl + "wp/v2/yst_prominent_words",
					beforeSend: function beforeSend(xhr) {
						xhr.setRequestHeader("X-WP-Nonce", _this3._nonce);
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
}();

exports.default = ProminentWordStorage;

},{"./ProminentWordCache":1}],3:[function(require,module,exports){
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

var SiteWideCalculation = function (_EventEmitter) {
	_inherits(SiteWideCalculation, _EventEmitter);

	function SiteWideCalculation(_ref) {
		var _ref$recalculateAll = _ref.recalculateAll,
		    recalculateAll = _ref$recalculateAll === undefined ? false : _ref$recalculateAll,
		    totalPosts = _ref.totalPosts,
		    rootUrl = _ref.rootUrl,
		    nonce = _ref.nonce,
		    allProminentWordIds = _ref.allProminentWordIds;

		_classCallCheck(this, SiteWideCalculation);

		var _this = _possibleConstructorReturn(this, (SiteWideCalculation.__proto__ || Object.getPrototypeOf(SiteWideCalculation)).call(this));

		_this._perPage = 10;
		_this._totalPosts = totalPosts;
		_this._pages = Math.ceil(totalPosts / _this._perPage);
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

	_createClass(SiteWideCalculation, [{
		key: "start",
		value: function start() {
			this.calculate();
		}

		/**
   *
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
	}, {
		key: "processResponse",
		value: function processResponse(response) {
			var _this3 = this;

			var processPromises = response.map(function (post) {
				return _this3.processPost(post);
			});

			Promise.all(processPromises).then(this.continueProcessing).catch(this.continueProcessing);
		}
	}, {
		key: "continueProcessing",
		value: function continueProcessing() {
			this.emit("processedPage", this._currentPage, this._pages);

			if (this._currentPage < this._pages) {
				this._currentPage += 1;
				this.calculate();
			} else {
				this.emit("complete");
			}
		}

		/**
   *
   * @param post
   * @retuns {Promise}
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

	// Prevent duplicate calculation
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvc3JjL2tleXdvcmRTdWdnZXN0aW9ucy9Qcm9taW5lbnRXb3JkQ2FjaGUuanMiLCJhc3NldHMvanMvc3JjL2tleXdvcmRTdWdnZXN0aW9ucy9Qcm9taW5lbnRXb3JkU3RvcmFnZS5qcyIsImFzc2V0cy9qcy9zcmMva2V5d29yZFN1Z2dlc3Rpb25zL3NpdGVXaWRlQ2FsY3VsYXRpb24uanMiLCJhc3NldHMvanMvc3JjL3NpdGUtd2lkZS1hbmFseXNpcy5qcyIsIm5vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fRGF0YVZpZXcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19IYXNoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fTGlzdENhY2hlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fTWFwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fTWFwQ2FjaGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19Qcm9taXNlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fU2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fU2V0Q2FjaGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19TdGFjay5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1N5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1VpbnQ4QXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19XZWFrTWFwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXBwbHkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUVhY2guanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUZpbHRlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5SW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUluY2x1ZGVzV2l0aC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5TGlrZUtleXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheU1hcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5UHVzaC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5U29tZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Fzc2lnblZhbHVlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNzb2NJbmRleE9mLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUFzc2lnblZhbHVlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUVhY2guanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRmlsdGVyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUZpbmRJbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGbGF0dGVuLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUZvci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGb3JPd24uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldFRhZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VIYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSGFzSW4uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSW5kZXhPZi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJbnRlcnNlY3Rpb24uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNBcmd1bWVudHMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNFcXVhbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc0VxdWFsRGVlcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc01hdGNoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzTmFOLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzTmF0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzVHlwZWRBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJdGVyYXRlZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VLZXlzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZU1hcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VNYXRjaGVzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZU1hdGNoZXNQcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VQaWNrLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVBpY2tCeS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VQcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VQcm9wZXJ0eURlZXAuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlUmVzdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VTZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlU2V0VG9TdHJpbmcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlU2xpY2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlU3VtLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVRpbWVzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVRvU3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVVuYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVZhbHVlcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NhY2hlSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY2FzdEFycmF5TGlrZU9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nhc3RGdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nhc3RQYXRoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY29yZUpzRGF0YS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZUJhc2VFYWNoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlQmFzZUZvci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZUZpbmQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19kZWZpbmVQcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2VxdWFsQXJyYXlzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZXF1YWxCeVRhZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2VxdWFsT2JqZWN0cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2ZsYXRSZXN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZnJlZUdsb2JhbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldE1hcERhdGEuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRNYXRjaERhdGEuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXROYXRpdmUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRSYXdUYWcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRUYWcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRWYWx1ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc1BhdGguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoQ2xlYXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoRGVsZXRlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaEdldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hIYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoU2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faXNGbGF0dGVuYWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzSW5kZXguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc0tleS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzS2V5YWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzTWFza2VkLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faXNQcm90b3R5cGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc1N0cmljdENvbXBhcmFibGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVDbGVhci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2xpc3RDYWNoZURlbGV0ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2xpc3RDYWNoZUdldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2xpc3RDYWNoZUhhcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2xpc3RDYWNoZVNldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlQ2xlYXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZURlbGV0ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlR2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVIYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZVNldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcFRvQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXRjaGVzU3RyaWN0Q29tcGFyYWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX21lbW9pemVDYXBwZWQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19uYXRpdmVDcmVhdGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19uYXRpdmVLZXlzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbm9kZVV0aWwuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19vYmplY3RUb1N0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX292ZXJBcmcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19vdmVyUmVzdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3Jvb3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zZXRDYWNoZUFkZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3NldENhY2hlSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc2V0VG9BcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3NldFRvU3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc2hvcnRPdXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0NsZWFyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tEZWxldGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0dldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tTZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zdHJpY3RJbmRleE9mLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RyaW5nVG9QYXRoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fdG9LZXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL190b1NvdXJjZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvY29uc3RhbnQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2VxLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9maWx0ZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ZpbmQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ZpbmRJbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvZmxhdE1hcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvZmxhdHRlbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvZm9yRWFjaC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvZ2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9oYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2hhc0luLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pZGVudGl0eS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ludGVyc2VjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcmd1bWVudHMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXlMaWtlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5TGlrZU9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNCdWZmZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzRW1wdHkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzRnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzTGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc05hTi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNOdW1iZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdExpa2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzU3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc1N5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNUeXBlZEFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc1VuZGVmaW5lZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gva2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvbWFwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9tZW1vaXplLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9uZWdhdGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3BpY2suanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3Byb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9zdHViRmFsc2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3N1bS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvdGFrZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvdG9GaW5pdGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3RvSW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvdG9OdW1iZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3RvU3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC92YWx1ZXMuanMiLCJub2RlX21vZHVsZXMvdG9rZW5pemVyMi9jb3JlLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL2NvbmZpZy9zeWxsYWJsZXMuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvY29uZmlnL3N5bGxhYmxlcy9kZS5qc29uIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL2NvbmZpZy9zeWxsYWJsZXMvZW4uanNvbiIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9jb25maWcvc3lsbGFibGVzL25sLmpzb24iLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvaGVscGVycy9nZXRMYW5ndWFnZS5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9oZWxwZXJzL2h0bWwuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvaGVscGVycy9zeWxsYWJsZUNvdW50SXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvaGVscGVycy9zeWxsYWJsZUNvdW50U3RlcC5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9yZXNlYXJjaGVzL2VuZ2xpc2gvZnVuY3Rpb25Xb3Jkcy5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9yZXNlYXJjaGVzL2VuZ2xpc2gvcGFzc2l2ZXZvaWNlLWVuZ2xpc2gvYXV4aWxpYXJpZXMuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvcmVzZWFyY2hlcy9lbmdsaXNoL3RyYW5zaXRpb25Xb3Jkcy5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9zdHJpbmdQcm9jZXNzaW5nL2FkZFdvcmRib3VuZGFyeS5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9zdHJpbmdQcm9jZXNzaW5nL2NyZWF0ZVJlZ2V4RnJvbUFycmF5LmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3NpbmcvZ2V0U2VudGVuY2VzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3NpbmcvZ2V0V29yZHMuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy9xdW90ZXMuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy9yZWxldmFudFdvcmRzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3NpbmcvcmVtb3ZlUHVuY3R1YXRpb24uanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy9zdHJpcEhUTUxUYWdzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3Npbmcvc3RyaXBTcGFjZXMuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy9zeWxsYWJsZXMvRGV2aWF0aW9uRnJhZ21lbnQuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy9zeWxsYWJsZXMvY291bnQuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy91bmlmeVdoaXRlc3BhY2UuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvdmFsdWVzL1dvcmRDb21iaW5hdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7SUNDTSxrQjtBQUVMLCtCQUFjO0FBQUE7O0FBQ2IsT0FBSyxNQUFMLEdBQWMsRUFBZDtBQUNBOztBQUVEOzs7Ozs7Ozs7O3dCQU1PLEksRUFBTztBQUNiLE9BQUssS0FBSyxNQUFMLENBQVksY0FBWixDQUE0QixJQUE1QixDQUFMLEVBQTBDO0FBQ3pDLFdBQU8sS0FBSyxNQUFMLENBQWEsSUFBYixDQUFQO0FBQ0E7O0FBRUQsVUFBTyxDQUFQO0FBQ0E7O0FBRUQ7Ozs7Ozs7Ozs7d0JBT08sSSxFQUFNLEUsRUFBSztBQUNqQixRQUFLLE1BQUwsQ0FBYSxJQUFiLElBQXNCLEVBQXRCO0FBQ0E7Ozs7OztrQkFHYSxrQjs7Ozs7Ozs7Ozs7QUNqQ2Y7Ozs7Ozs7O0FBRUE7OztJQUdNLG9COztBQUVMOzs7OztBQUtBLHFDQUEwQztBQUFBLE1BQTNCLE1BQTJCLFFBQTNCLE1BQTJCO0FBQUEsTUFBbkIsT0FBbUIsUUFBbkIsT0FBbUI7QUFBQSxNQUFWLEtBQVUsUUFBVixLQUFVOztBQUFBOztBQUN6QyxPQUFLLFFBQUwsR0FBZ0IsT0FBaEI7QUFDQSxPQUFLLE1BQUwsR0FBYyxLQUFkO0FBQ0EsT0FBSyxNQUFMLEdBQWMsa0NBQWQ7QUFDQSxPQUFLLE9BQUwsR0FBZSxNQUFmO0FBQ0EsT0FBSyxxQkFBTCxHQUE2QixLQUE3Qjs7QUFFQSxPQUFLLHVCQUFMLEdBQStCLEtBQUssdUJBQUwsQ0FBNkIsSUFBN0IsQ0FBbUMsSUFBbkMsQ0FBL0I7QUFDQTs7QUFFRDs7Ozs7Ozs7OztxQ0FNb0IsYyxFQUFpQjtBQUFBOztBQUNwQztBQUNBLE9BQUssS0FBSyxxQkFBVixFQUFrQztBQUNqQztBQUNBO0FBQ0QsUUFBSyxxQkFBTCxHQUE2QixJQUE3Qjs7QUFFQSxPQUFJLG1CQUFtQixlQUFlLEtBQWYsQ0FBc0IsQ0FBdEIsRUFBeUIsRUFBekIsRUFBOEIsR0FBOUIsQ0FBbUMsS0FBSyx1QkFBeEMsQ0FBdkI7O0FBRUEsVUFBTyxRQUFRLEdBQVIsQ0FBYSxnQkFBYixFQUFnQyxJQUFoQyxDQUFzQyxVQUFFLGNBQUYsRUFBc0I7QUFDbEUsV0FBTyxJQUFQLENBQWE7QUFDWixXQUFNLE1BRE07QUFFWixVQUFLLE1BQUssUUFBTCxHQUFnQixjQUFoQixHQUFpQyxNQUFLLE9BRi9CO0FBR1osaUJBQVksb0JBQUUsR0FBRixFQUFXO0FBQ3RCLFVBQUksZ0JBQUosQ0FBc0IsWUFBdEIsRUFBb0MsTUFBSyxNQUF6QztBQUNBLE1BTFc7QUFNWixXQUFNO0FBQ0w7QUFDQSwyQkFBcUI7QUFGaEIsTUFOTTtBQVVaLGVBQVU7QUFWRSxLQUFiLEVBV0ksTUFYSixDQVdZLFlBQU07QUFDakIsV0FBSyxxQkFBTCxHQUE2QixLQUE3QjtBQUNBLEtBYkQ7QUFjQSxJQWZNLENBQVA7QUFnQkE7O0FBRUQ7Ozs7Ozs7OzswQ0FNeUIsYSxFQUFnQjtBQUFBOztBQUN4QyxPQUFJLFdBQVcsS0FBSyxNQUFMLENBQVksS0FBWixDQUFtQixjQUFjLGNBQWQsRUFBbkIsQ0FBZjtBQUNBLE9BQUssTUFBTSxRQUFYLEVBQXNCO0FBQ3JCLFdBQU8sUUFBUSxPQUFSLENBQWlCLFFBQWpCLENBQVA7QUFDQTs7QUFFRCxPQUFJLHFCQUFxQixJQUFJLE9BQUosQ0FBYSxVQUFFLE9BQUYsRUFBVyxNQUFYLEVBQXVCO0FBQzVELFdBQU8sSUFBUCxDQUFhO0FBQ1osV0FBTSxLQURNO0FBRVosVUFBSyxPQUFLLFFBQUwsR0FBZ0IsMEJBRlQ7QUFHWixpQkFBWSxvQkFBRSxHQUFGLEVBQVc7QUFDdEIsVUFBSSxnQkFBSixDQUFzQixZQUF0QixFQUFvQyxPQUFLLE1BQXpDO0FBQ0EsTUFMVztBQU1aLFdBQU07QUFDTCxZQUFNLGNBQWMsY0FBZDtBQURELE1BTk07QUFTWixlQUFVLE1BVEU7QUFVWixjQUFTLGlCQUFVLFFBQVYsRUFBcUI7QUFDN0IsY0FBUyxRQUFUO0FBQ0EsTUFaVztBQWFaLFlBQU8sZUFBVSxRQUFWLEVBQXFCO0FBQzNCLGFBQVEsUUFBUjtBQUNBO0FBZlcsS0FBYjtBQWlCQSxJQWxCd0IsQ0FBekI7O0FBb0JBLE9BQUksdUJBQXVCLG1CQUFtQixJQUFuQixDQUF5QixVQUFFLGlCQUFGLEVBQXlCO0FBQzVFLFFBQUssc0JBQXNCLElBQTNCLEVBQWtDO0FBQ2pDLFlBQU8sT0FBSyx1QkFBTCxDQUE4QixhQUE5QixDQUFQO0FBQ0E7O0FBRUQsV0FBTyxpQkFBUDtBQUNBLElBTjBCLENBQTNCOztBQVFBLFVBQU8scUJBQXFCLElBQXJCLENBQTJCLFVBQUUsaUJBQUYsRUFBeUI7QUFDMUQsV0FBSyxNQUFMLENBQVksS0FBWixDQUFtQixjQUFjLGNBQWQsRUFBbkIsRUFBbUQsa0JBQWtCLEVBQXJFOztBQUVBLFdBQU8sa0JBQWtCLEVBQXpCO0FBQ0EsSUFKTSxDQUFQO0FBS0E7O0FBRUQ7Ozs7Ozs7OzswQ0FNeUIsYSxFQUFnQjtBQUFBOztBQUN4QyxVQUFPLElBQUksT0FBSixDQUFhLFVBQUUsT0FBRixFQUFXLE1BQVgsRUFBdUI7QUFDMUMsV0FBTyxJQUFQLENBQWE7QUFDWixXQUFNLE1BRE07QUFFWixVQUFLLE9BQUssUUFBTCxHQUFnQiwyQkFGVDtBQUdaLGlCQUFZLG9CQUFFLEdBQUYsRUFBVztBQUN0QixVQUFJLGdCQUFKLENBQXNCLFlBQXRCLEVBQW9DLE9BQUssTUFBekM7QUFDQSxNQUxXO0FBTVosV0FBTTtBQUNMLFlBQU0sY0FBYyxjQUFkO0FBREQsTUFOTTtBQVNaLGVBQVUsTUFURTtBQVVaLGNBQVMsaUJBQVUsUUFBVixFQUFxQjtBQUM3QixjQUFTLFFBQVQ7QUFDQSxNQVpXO0FBYVosWUFBTyxlQUFVLFFBQVYsRUFBcUI7QUFDM0IsYUFBUSxRQUFSO0FBQ0E7QUFmVyxLQUFiO0FBaUJBLElBbEJNLENBQVA7QUFtQkE7Ozs7OztrQkFHYSxvQjs7Ozs7Ozs7Ozs7QUNuSWY7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBSSxlQUFlLENBQUUsUUFBRixFQUFZLE9BQVosRUFBcUIsU0FBckIsRUFBZ0MsU0FBaEMsRUFBMkMsU0FBM0MsQ0FBbkI7O0lBRU0sbUI7OztBQUVMLG9DQUEyRjtBQUFBLGlDQUE1RSxjQUE0RTtBQUFBLE1BQTVFLGNBQTRFLHVDQUEzRCxLQUEyRDtBQUFBLE1BQXBELFVBQW9ELFFBQXBELFVBQW9EO0FBQUEsTUFBeEMsT0FBd0MsUUFBeEMsT0FBd0M7QUFBQSxNQUEvQixLQUErQixRQUEvQixLQUErQjtBQUFBLE1BQXhCLG1CQUF3QixRQUF4QixtQkFBd0I7O0FBQUE7O0FBQUE7O0FBRzFGLFFBQUssUUFBTCxHQUFnQixFQUFoQjtBQUNBLFFBQUssV0FBTCxHQUFtQixVQUFuQjtBQUNBLFFBQUssTUFBTCxHQUFjLEtBQUssSUFBTCxDQUFXLGFBQWEsTUFBSyxRQUE3QixDQUFkO0FBQ0EsUUFBSyxlQUFMLEdBQXVCLENBQXZCO0FBQ0EsUUFBSyxZQUFMLEdBQW9CLENBQXBCO0FBQ0EsUUFBSyxRQUFMLEdBQWdCLE9BQWhCO0FBQ0EsUUFBSyxNQUFMLEdBQWMsS0FBZDtBQUNBLFFBQUssZUFBTCxHQUF1QixjQUF2QjtBQUNBLFFBQUssb0JBQUwsR0FBNEIsbUJBQTVCOztBQUVBLFFBQUssa0JBQUwsR0FBMEIsTUFBSyxrQkFBTCxDQUF3QixJQUF4QixPQUExQjtBQUNBLFFBQUssZUFBTCxHQUF1QixNQUFLLGVBQUwsQ0FBcUIsSUFBckIsT0FBdkI7QUFDQSxRQUFLLHVCQUFMLEdBQStCLE1BQUssdUJBQUwsQ0FBNkIsSUFBN0IsT0FBL0I7QUFmMEY7QUFnQjFGOzs7OzBCQUVPO0FBQ1AsUUFBSyxTQUFMO0FBQ0E7O0FBRUQ7Ozs7Ozs4QkFHWTtBQUFBOztBQUNYLE9BQUksT0FBTztBQUNWLFVBQU0sS0FBSyxZQUREO0FBRVY7QUFDQSxjQUFVLEtBQUssUUFITDtBQUlWLFlBQVE7QUFKRSxJQUFYOztBQU9BLE9BQUssQ0FBRSxLQUFLLGVBQVosRUFBOEI7QUFDN0I7QUFDQSxTQUFLLG1CQUFMLEdBQTJCLEtBQUssb0JBQWhDO0FBQ0E7O0FBRUQsVUFBTyxJQUFQLENBQWE7QUFDWixVQUFNLEtBRE07QUFFWixTQUFLLEtBQUssUUFBTCxHQUFnQixjQUZUO0FBR1osZ0JBQVksb0JBQUUsR0FBRixFQUFXO0FBQ3RCLFNBQUksZ0JBQUosQ0FBc0IsWUFBdEIsRUFBb0MsT0FBSyxNQUF6QztBQUNBLEtBTFc7QUFNWixVQUFNLElBTk07QUFPWixjQUFVLE1BUEU7QUFRWixhQUFTLEtBQUs7QUFSRixJQUFiO0FBVUE7OztrQ0FFZ0IsUSxFQUFXO0FBQUE7O0FBRTNCLE9BQUksa0JBQWtCLFNBQVMsR0FBVCxDQUFjLFVBQUUsSUFBRixFQUFZO0FBQy9DLFdBQU8sT0FBSyxXQUFMLENBQWtCLElBQWxCLENBQVA7QUFDQSxJQUZxQixDQUF0Qjs7QUFJQSxXQUFRLEdBQVIsQ0FBYSxlQUFiLEVBQStCLElBQS9CLENBQXFDLEtBQUssa0JBQTFDLEVBQStELEtBQS9ELENBQXNFLEtBQUssa0JBQTNFO0FBQ0E7Ozt1Q0FFb0I7QUFDcEIsUUFBSyxJQUFMLENBQVcsZUFBWCxFQUE0QixLQUFLLFlBQWpDLEVBQStDLEtBQUssTUFBcEQ7O0FBRUEsT0FBSyxLQUFLLFlBQUwsR0FBb0IsS0FBSyxNQUE5QixFQUF1QztBQUN0QyxTQUFLLFlBQUwsSUFBcUIsQ0FBckI7QUFDQSxTQUFLLFNBQUw7QUFDQSxJQUhELE1BR087QUFDTixTQUFLLElBQUwsQ0FBVyxVQUFYO0FBQ0E7QUFDRDs7QUFFRDs7Ozs7Ozs7OEJBS2EsSSxFQUFPO0FBQ25CLE9BQUksVUFBVSxLQUFLLE9BQUwsQ0FBYSxRQUEzQjs7QUFFQSxPQUFJLGlCQUFpQixxQ0FBa0IsT0FBbEIsQ0FBckI7O0FBRUEsT0FBSSx1QkFBdUIsbUNBQTBCO0FBQ3BELFlBQVEsS0FBSyxFQUR1QztBQUVwRCxhQUFTLEtBQUssUUFGc0M7QUFHcEQsV0FBTyxLQUFLO0FBSHdDLElBQTFCLENBQTNCOztBQU1BLFVBQU8scUJBQXFCLGtCQUFyQixDQUF5QyxjQUF6QyxFQUEwRCxJQUExRCxDQUFnRSxLQUFLLHVCQUFyRSxFQUE4RixLQUFLLHVCQUFuRyxDQUFQO0FBQ0E7O0FBRUQ7Ozs7Ozs7OzRDQUswQjtBQUN6QixRQUFLLGVBQUwsSUFBd0IsQ0FBeEI7O0FBRUEsUUFBSyxJQUFMLENBQVcsZUFBWCxFQUE0QixLQUFLLGVBQWpDLEVBQWtELEtBQUssV0FBdkQ7QUFDQTs7Ozs7O2tCQUdhLG1COzs7OztBQzNHZjs7Ozs7O0FBRUEsSUFBSSxXQUFXLDBCQUEwQixJQUF6QyxDLENBSkE7O0FBTUEsSUFBSSwyQkFBMkIsSUFBL0I7QUFDQSxJQUFJLDBCQUFKO0FBQUEsSUFBdUIsMkJBQXZCOztBQUVBOzs7Ozs7O0FBT0EsU0FBUyxrQkFBVCxDQUE2QixTQUE3QixFQUFnRTtBQUFBLEtBQXhCLGNBQXdCLHVFQUFQLElBQU87O0FBQy9EO0FBQ0EsS0FBSyw2QkFBNkIsSUFBbEMsRUFBeUM7QUFDeEM7QUFDQTs7QUFFRCxLQUFJLGtCQUFrQixPQUFRLDRDQUFSLENBQXRCOztBQUVBLG1CQUFrQixJQUFsQjs7QUFFQSw0QkFBMkIsa0NBQThCO0FBQ3hELGNBQVksU0FENEM7QUFFeEQsZ0NBRndEO0FBR3hELFdBQVMsU0FBUyxPQUFULENBQWlCLElBSDhCO0FBSXhELFNBQU8sU0FBUyxPQUFULENBQWlCLEtBSmdDO0FBS3hELHVCQUFxQixTQUFTO0FBTDBCLEVBQTlCLENBQTNCOztBQVFBLDBCQUF5QixFQUF6QixDQUE2QixlQUE3QixFQUE4QyxVQUFFLFNBQUYsRUFBaUI7QUFDOUQsa0JBQWdCLElBQWhCLENBQXNCLFNBQXRCO0FBQ0EsRUFGRDs7QUFJQSwwQkFBeUIsS0FBekI7O0FBRUE7QUFDQSwwQkFBeUIsRUFBekIsQ0FBNkIsVUFBN0IsRUFBeUMsWUFBTTtBQUM5Qyw2QkFBMkIsSUFBM0I7O0FBRUEsb0JBQWtCLElBQWxCO0FBQ0EscUJBQW1CLElBQW5CO0FBQ0EsRUFMRDtBQU1BOztBQUVEOzs7OztBQUtBLFNBQVMsSUFBVCxHQUFnQjtBQUNmLFFBQVEsMENBQVIsRUFBcUQsRUFBckQsQ0FBeUQsT0FBekQsRUFBa0UsWUFBVztBQUM1RSxxQkFBb0IsU0FBUyxNQUFULENBQWdCLEtBQXBDOztBQUVBLFNBQVEsSUFBUixFQUFlLElBQWY7QUFDQSxFQUpEOztBQU1BLHFCQUFvQixPQUFRLG9DQUFSLENBQXBCO0FBQ0EsbUJBQWtCLElBQWxCOztBQUVBLHNCQUFxQixPQUFRLHFDQUFSLENBQXJCO0FBQ0Esb0JBQW1CLElBQW5CO0FBQ0E7O0FBRUQsT0FBUSxJQUFSOzs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Y0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5jbGFzcyBQcm9taW5lbnRXb3JkQ2FjaGUge1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuX2NhY2hlID0ge307XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgSUQgZ2l2ZW4gdGhlIG5hbWUsIG9yIDAgaWYgbm90IGZvdW5kIGluIHRoZSBjYWNoZS5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIHByb21pbmVudCB3b3JkLlxuXHQgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgSUQgb2YgdGhlIHByb21pbmVudCB3b3JkLlxuXHQgKi9cblx0Z2V0SUQoIG5hbWUgKSB7XG5cdFx0aWYgKCB0aGlzLl9jYWNoZS5oYXNPd25Qcm9wZXJ0eSggbmFtZSApICkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2NhY2hlWyBuYW1lIF07XG5cdFx0fVxuXG5cdFx0cmV0dXJuIDA7XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyB0aGUgSUQgZm9yIGEgZ2l2ZW4gbmFtZS5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIHByb21pbmVudCB3b3JkLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gaWQgVGhlIElEIG9mIHRoZSBwcm9taW5lbnQgd29yZC5cblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRzZXRJRCggbmFtZSwgaWQgKSB7XG5cdFx0dGhpcy5fY2FjaGVbIG5hbWUgXSA9IGlkO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFByb21pbmVudFdvcmRDYWNoZTtcbiIsImltcG9ydCBQcm9taW5lbnRXb3JkQ2FjaGUgZnJvbSBcIi4vUHJvbWluZW50V29yZENhY2hlXCI7XG5cbi8qKlxuICogSGFuZGxlcyB0aGUgcmV0cmlldmFsIGFuZCBzdG9yYWdlIG9mIGZvY3VzIGtleXdvcmQgc3VnZ2VzdGlvbnNcbiAqL1xuY2xhc3MgUHJvbWluZW50V29yZFN0b3JhZ2Uge1xuXG5cdC8qKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gcm9vdFVybCBUaGUgcm9vdCBVUkwgb2YgdGhlIFdQIFJFU1QgQVBJLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbm9uY2UgVGhlIFdvcmRQcmVzcyBub25jZSByZXF1aXJlZCB0byBzYXZlIGFueXRoaW5nIHRvIHRoZSBSRVNUIEFQSSBlbmRwb2ludHMuXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBwb3N0SUQgVGhlIHBvc3RJRCBvZiB0aGUgcG9zdCB0byBzYXZlIHByb21pbmVudCB3b3JkcyBmb3IuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvciggeyBwb3N0SUQsIHJvb3RVcmwsIG5vbmNlIH0gKSB7XG5cdFx0dGhpcy5fcm9vdFVybCA9IHJvb3RVcmw7XG5cdFx0dGhpcy5fbm9uY2UgPSBub25jZTtcblx0XHR0aGlzLl9jYWNoZSA9IG5ldyBQcm9taW5lbnRXb3JkQ2FjaGUoKTtcblx0XHR0aGlzLl9wb3N0SUQgPSBwb3N0SUQ7XG5cdFx0dGhpcy5fc2F2aW5nUHJvbWluZW50V29yZHMgPSBmYWxzZTtcblxuXHRcdHRoaXMucmV0cmlldmVQcm9taW5lbnRXb3JkSWQgPSB0aGlzLnJldHJpZXZlUHJvbWluZW50V29yZElkLmJpbmQoIHRoaXMgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTYXZlcyBwcm9taW5lbnQgd29yZHMgdG8gdGhlIGRhdGFiYXNlIHVzaW5nIEFKQVhcblx0ICpcblx0ICogQHBhcmFtIHtXb3JkQ29tYmluYXRpb25bXX0gcHJvbWluZW50V29yZHMgVGhlIHByb21pbmVudCB3b3JkcyB0byBzYXZlLlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX1cblx0ICovXG5cdHNhdmVQcm9taW5lbnRXb3JkcyggcHJvbWluZW50V29yZHMgKSB7XG5cdFx0Ly8gSWYgdGhlcmUgaXMgYWxyZWFkeSBhIHNhdmUgc2VxdWVuY2UgaW4gcHJvZ3Jlc3MsIGRvbid0IGRvIGl0IGFnYWluLlxuXHRcdGlmICggdGhpcy5fc2F2aW5nUHJvbWluZW50V29yZHMgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMuX3NhdmluZ1Byb21pbmVudFdvcmRzID0gdHJ1ZTtcblxuXHRcdGxldCBwcm9taW5lbnRXb3JkSWRzID0gcHJvbWluZW50V29yZHMuc2xpY2UoIDAsIDIwICkubWFwKCB0aGlzLnJldHJpZXZlUHJvbWluZW50V29yZElkICk7XG5cblx0XHRyZXR1cm4gUHJvbWlzZS5hbGwoIHByb21pbmVudFdvcmRJZHMgKS50aGVuKCAoIHByb21pbmVudFdvcmRzICkgPT4ge1xuXHRcdFx0alF1ZXJ5LmFqYXgoIHtcblx0XHRcdFx0dHlwZTogXCJQT1NUXCIsXG5cdFx0XHRcdHVybDogdGhpcy5fcm9vdFVybCArIFwid3AvdjIvcG9zdHMvXCIgKyB0aGlzLl9wb3N0SUQsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6ICggeGhyICkgPT4ge1xuXHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCBcIlgtV1AtTm9uY2VcIiwgdGhpcy5fbm9uY2UgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjYW1lbGNhc2Vcblx0XHRcdFx0XHR5c3RfcHJvbWluZW50X3dvcmRzOiBwcm9taW5lbnRXb3Jkcyxcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YVR5cGU6IFwianNvblwiLFxuXHRcdFx0fSApLmFsd2F5cyggKCkgPT4ge1xuXHRcdFx0XHR0aGlzLl9zYXZpbmdQcm9taW5lbnRXb3JkcyA9IGZhbHNlO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIElEIG9mIGEgcHJvbWlzZVxuXHQgKlxuXHQgKiBAcGFyYW0ge1dvcmRDb21iaW5hdGlvbn0gcHJvbWluZW50V29yZCBUaGUgcHJvbWluZW50IHdvcmQgdG8gcmV0cmlldmUgdGhlIElEIGZvci5cblx0ICogQHJldHVybnMge1Byb21pc2V9IFJlc29sdmVzIHRvIHRoZSBJRCBvZiB0aGUgcHJvbWluZW50IHdvcmQgdGVybS5cblx0ICovXG5cdHJldHJpZXZlUHJvbWluZW50V29yZElkKCBwcm9taW5lbnRXb3JkICkge1xuXHRcdGxldCBjYWNoZWRJZCA9IHRoaXMuX2NhY2hlLmdldElEKCBwcm9taW5lbnRXb3JkLmdldENvbWJpbmF0aW9uKCkgKTtcblx0XHRpZiAoIDAgIT09IGNhY2hlZElkICkge1xuXHRcdFx0cmV0dXJuIFByb21pc2UucmVzb2x2ZSggY2FjaGVkSWQgKTtcblx0XHR9XG5cblx0XHRsZXQgZm91bmRQcm9taW5lbnRXb3JkID0gbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuXHRcdFx0alF1ZXJ5LmFqYXgoIHtcblx0XHRcdFx0dHlwZTogXCJHRVRcIixcblx0XHRcdFx0dXJsOiB0aGlzLl9yb290VXJsICsgXCJ5b2FzdC92MS9wcm9taW5lbnRfd29yZHNcIixcblx0XHRcdFx0YmVmb3JlU2VuZDogKCB4aHIgKSA9PiB7XG5cdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoIFwiWC1XUC1Ob25jZVwiLCB0aGlzLl9ub25jZSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0d29yZDogcHJvbWluZW50V29yZC5nZXRDb21iaW5hdGlvbigpLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRkYXRhVHlwZTogXCJqc29uXCIsXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdFx0XHRyZXNvbHZlKCByZXNwb25zZSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRlcnJvcjogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0XHRcdHJlamVjdCggcmVzcG9uc2UgKTtcblx0XHRcdFx0fSxcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cblx0XHRsZXQgY3JlYXRlZFByb21pbmVudFdvcmQgPSBmb3VuZFByb21pbmVudFdvcmQudGhlbiggKCBwcm9taW5lbnRXb3JkVGVybSApID0+IHtcblx0XHRcdGlmICggcHJvbWluZW50V29yZFRlcm0gPT09IG51bGwgKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmNyZWF0ZVByb21pbmVudFdvcmRUZXJtKCBwcm9taW5lbnRXb3JkICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBwcm9taW5lbnRXb3JkVGVybTtcblx0XHR9ICk7XG5cblx0XHRyZXR1cm4gY3JlYXRlZFByb21pbmVudFdvcmQudGhlbiggKCBwcm9taW5lbnRXb3JkVGVybSApID0+IHtcblx0XHRcdHRoaXMuX2NhY2hlLnNldElEKCBwcm9taW5lbnRXb3JkLmdldENvbWJpbmF0aW9uKCksIHByb21pbmVudFdvcmRUZXJtLmlkICk7XG5cblx0XHRcdHJldHVybiBwcm9taW5lbnRXb3JkVGVybS5pZDtcblx0XHR9ICk7XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIHRlcm0gZm9yIGEgcHJvbWluZW50IHdvcmRcblx0ICpcblx0ICogQHBhcmFtIHtXb3JkQ29tYmluYXRpb259IHByb21pbmVudFdvcmQgVGhlIHByb21pbmVudCB3b3JkIHRvIGNyZWF0ZSBhIHRlcm0gZm9yLlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiBhIHRlcm0gaGFzIGJlZW4gY3JlYXRlZCBhbmQgcmVzb2x2ZXMgd2l0aCB0aGUgSUQgb2YgdGhlIG5ld2x5IGNyZWF0ZWQgdGVybS5cblx0ICovXG5cdGNyZWF0ZVByb21pbmVudFdvcmRUZXJtKCBwcm9taW5lbnRXb3JkICkge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG5cdFx0XHRqUXVlcnkuYWpheCgge1xuXHRcdFx0XHR0eXBlOiBcIlBPU1RcIixcblx0XHRcdFx0dXJsOiB0aGlzLl9yb290VXJsICsgXCJ3cC92Mi95c3RfcHJvbWluZW50X3dvcmRzXCIsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6ICggeGhyICkgPT4ge1xuXHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCBcIlgtV1AtTm9uY2VcIiwgdGhpcy5fbm9uY2UgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdG5hbWU6IHByb21pbmVudFdvcmQuZ2V0Q29tYmluYXRpb24oKSxcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YVR5cGU6IFwianNvblwiLFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHRcdFx0cmVzb2x2ZSggcmVzcG9uc2UgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdFx0XHRyZWplY3QoIHJlc3BvbnNlICk7XG5cdFx0XHRcdH0sXG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFByb21pbmVudFdvcmRTdG9yYWdlO1xuIiwiaW1wb3J0IHsgZ2V0UmVsZXZhbnRXb3JkcyB9IGZyb20gXCJ5b2FzdHNlby9qcy9zdHJpbmdQcm9jZXNzaW5nL3JlbGV2YW50V29yZHNcIjtcbmltcG9ydCBQcm9taW5lbnRXb3JkU3RvcmFnZSBmcm9tIFwiLi9Qcm9taW5lbnRXb3JkU3RvcmFnZVwiO1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tIFwiZXZlbnRzXCI7XG5cbmxldCBwb3N0U3RhdHVzZXMgPSBbIFwiZnV0dXJlXCIsIFwiZHJhZnRcIiwgXCJwZW5kaW5nXCIsIFwicHJpdmF0ZVwiLCBcInB1Ymxpc2hcIiBdO1xuXG5jbGFzcyBTaXRlV2lkZUNhbGN1bGF0aW9uIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuXHRjb25zdHJ1Y3RvciggeyByZWNhbGN1bGF0ZUFsbCA9IGZhbHNlLCB0b3RhbFBvc3RzLCByb290VXJsLCBub25jZSwgYWxsUHJvbWluZW50V29yZElkcyB9ICkge1xuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLl9wZXJQYWdlID0gMTA7XG5cdFx0dGhpcy5fdG90YWxQb3N0cyA9IHRvdGFsUG9zdHM7XG5cdFx0dGhpcy5fcGFnZXMgPSBNYXRoLmNlaWwoIHRvdGFsUG9zdHMgLyB0aGlzLl9wZXJQYWdlICk7XG5cdFx0dGhpcy5fcHJvY2Vzc2VkUG9zdHMgPSAwO1xuXHRcdHRoaXMuX2N1cnJlbnRQYWdlID0gMTtcblx0XHR0aGlzLl9yb290VXJsID0gcm9vdFVybDtcblx0XHR0aGlzLl9ub25jZSA9IG5vbmNlO1xuXHRcdHRoaXMuX3JlY2FsY3VsYXRlQWxsID0gcmVjYWxjdWxhdGVBbGw7XG5cdFx0dGhpcy5fYWxsUHJvbWluZW50V29yZElkcyA9IGFsbFByb21pbmVudFdvcmRJZHM7XG5cblx0XHR0aGlzLmNvbnRpbnVlUHJvY2Vzc2luZyA9IHRoaXMuY29udGludWVQcm9jZXNzaW5nLmJpbmQoIHRoaXMgKTtcblx0XHR0aGlzLnByb2Nlc3NSZXNwb25zZSA9IHRoaXMucHJvY2Vzc1Jlc3BvbnNlLmJpbmQoIHRoaXMgKTtcblx0XHR0aGlzLmluY3JlbWVudFByb2Nlc3NlZFBvc3RzID0gdGhpcy5pbmNyZW1lbnRQcm9jZXNzZWRQb3N0cy5iaW5kKCB0aGlzICk7XG5cdH1cblxuXHRzdGFydCgpIHtcblx0XHR0aGlzLmNhbGN1bGF0ZSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqXG5cdCAqL1xuXHRjYWxjdWxhdGUoKSB7XG5cdFx0bGV0IGRhdGEgPSB7XG5cdFx0XHRwYWdlOiB0aGlzLl9jdXJyZW50UGFnZSxcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjYW1lbGNhc2Vcblx0XHRcdHBlcl9wYWdlOiB0aGlzLl9wZXJQYWdlLFxuXHRcdFx0c3RhdHVzOiBwb3N0U3RhdHVzZXMsXG5cdFx0fTtcblxuXHRcdGlmICggISB0aGlzLl9yZWNhbGN1bGF0ZUFsbCApIHtcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjYW1lbGNhc2Vcblx0XHRcdGRhdGEueXN0X3Byb21pbmVudF93b3JkcyA9IHRoaXMuX2FsbFByb21pbmVudFdvcmRJZHM7XG5cdFx0fVxuXG5cdFx0alF1ZXJ5LmFqYXgoIHtcblx0XHRcdHR5cGU6IFwiR0VUXCIsXG5cdFx0XHR1cmw6IHRoaXMuX3Jvb3RVcmwgKyBcIndwL3YyL3Bvc3RzL1wiLFxuXHRcdFx0YmVmb3JlU2VuZDogKCB4aHIgKSA9PiB7XG5cdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCBcIlgtV1AtTm9uY2VcIiwgdGhpcy5fbm9uY2UgKTtcblx0XHRcdH0sXG5cdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0ZGF0YVR5cGU6IFwianNvblwiLFxuXHRcdFx0c3VjY2VzczogdGhpcy5wcm9jZXNzUmVzcG9uc2UsXG5cdFx0fSApO1xuXHR9XG5cblx0cHJvY2Vzc1Jlc3BvbnNlKCByZXNwb25zZSApIHtcblxuXHRcdGxldCBwcm9jZXNzUHJvbWlzZXMgPSByZXNwb25zZS5tYXAoICggcG9zdCApID0+IHtcblx0XHRcdHJldHVybiB0aGlzLnByb2Nlc3NQb3N0KCBwb3N0ICk7XG5cdFx0fSApO1xuXG5cdFx0UHJvbWlzZS5hbGwoIHByb2Nlc3NQcm9taXNlcyApLnRoZW4oIHRoaXMuY29udGludWVQcm9jZXNzaW5nICkuY2F0Y2goIHRoaXMuY29udGludWVQcm9jZXNzaW5nICk7XG5cdH1cblxuXHRjb250aW51ZVByb2Nlc3NpbmcoKSB7XG5cdFx0dGhpcy5lbWl0KCBcInByb2Nlc3NlZFBhZ2VcIiwgdGhpcy5fY3VycmVudFBhZ2UsIHRoaXMuX3BhZ2VzICk7XG5cblx0XHRpZiAoIHRoaXMuX2N1cnJlbnRQYWdlIDwgdGhpcy5fcGFnZXMgKSB7XG5cdFx0XHR0aGlzLl9jdXJyZW50UGFnZSArPSAxO1xuXHRcdFx0dGhpcy5jYWxjdWxhdGUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5lbWl0KCBcImNvbXBsZXRlXCIgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICpcblx0ICogQHBhcmFtIHBvc3Rcblx0ICogQHJldHVucyB7UHJvbWlzZX1cblx0ICovXG5cdHByb2Nlc3NQb3N0KCBwb3N0ICkge1xuXHRcdGxldCBjb250ZW50ID0gcG9zdC5jb250ZW50LnJlbmRlcmVkO1xuXG5cdFx0bGV0IHByb21pbmVudFdvcmRzID0gZ2V0UmVsZXZhbnRXb3JkcyggY29udGVudCApO1xuXG5cdFx0bGV0IHByb21pbmVudFdvcmRTdG9yYWdlID0gbmV3IFByb21pbmVudFdvcmRTdG9yYWdlKCB7XG5cdFx0XHRwb3N0SUQ6IHBvc3QuaWQsXG5cdFx0XHRyb290VXJsOiB0aGlzLl9yb290VXJsLFxuXHRcdFx0bm9uY2U6IHRoaXMuX25vbmNlLFxuXHRcdH0gKTtcblxuXHRcdHJldHVybiBwcm9taW5lbnRXb3JkU3RvcmFnZS5zYXZlUHJvbWluZW50V29yZHMoIHByb21pbmVudFdvcmRzICkudGhlbiggdGhpcy5pbmNyZW1lbnRQcm9jZXNzZWRQb3N0cywgdGhpcy5pbmNyZW1lbnRQcm9jZXNzZWRQb3N0cyApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluY3JlbWVudHMgdGhlIGFtb3VudCBvZiBwcm9jZXNzZWQgcG9zdHMgYnkgb25lLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGluY3JlbWVudFByb2Nlc3NlZFBvc3RzKCkge1xuXHRcdHRoaXMuX3Byb2Nlc3NlZFBvc3RzICs9IDE7XG5cblx0XHR0aGlzLmVtaXQoIFwicHJvY2Vzc2VkUG9zdFwiLCB0aGlzLl9wcm9jZXNzZWRQb3N0cywgdGhpcy5fdG90YWxQb3N0cyApO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNpdGVXaWRlQ2FsY3VsYXRpb247XG4iLCIvKiBnbG9iYWwgeW9hc3RTaXRlV2lkZUFuYWx5c2lzRGF0YSAqL1xuXG5pbXBvcnQgUHJvbWluZW50V29yZENhbGN1bGF0aW9uIGZyb20gXCIuL2tleXdvcmRTdWdnZXN0aW9ucy9zaXRlV2lkZUNhbGN1bGF0aW9uXCI7XG5cbmxldCBzZXR0aW5ncyA9IHlvYXN0U2l0ZVdpZGVBbmFseXNpc0RhdGEuZGF0YTtcblxubGV0IHByb21pbmVudFdvcmRDYWxjdWxhdGlvbiA9IG51bGw7XG5sZXQgcHJvZ3Jlc3NDb250YWluZXIsIGNvbXBsZXRlZENvbnRhaW5lcjtcblxuLyoqXG4gKiBTdGFydCByZWNhbGN1bGF0aW5nLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBwb3N0Q291bnQgVGhlIG51bWJlciBvZiBwb3N0cyB0byByZWNhbGN1bGF0ZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVjYWxjdWxhdGVBbGwgV2hldGhlciB0byByZWNhbGN1bGF0ZSBhbGwgcG9zdHMuXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gc3RhcnRSZWNhbGN1bGF0aW5nKCBwb3N0Q291bnQsIHJlY2FsY3VsYXRlQWxsID0gdHJ1ZSApIHtcblx0Ly8gUHJldmVudCBkdXBsaWNhdGUgY2FsY3VsYXRpb25cblx0aWYgKCBwcm9taW5lbnRXb3JkQ2FsY3VsYXRpb24gIT09IG51bGwgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0bGV0IHByb2dyZXNzRWxlbWVudCA9IGpRdWVyeSggXCIueW9hc3QtanMtcHJvbWluZW50LXdvcmRzLXByb2dyZXNzLWN1cnJlbnRcIiApO1xuXG5cdHByb2dyZXNzQ29udGFpbmVyLnNob3coKTtcblxuXHRwcm9taW5lbnRXb3JkQ2FsY3VsYXRpb24gPSBuZXcgUHJvbWluZW50V29yZENhbGN1bGF0aW9uKCB7XG5cdFx0dG90YWxQb3N0czogcG9zdENvdW50LFxuXHRcdHJlY2FsY3VsYXRlQWxsLFxuXHRcdHJvb3RVcmw6IHNldHRpbmdzLnJlc3RBcGkucm9vdCxcblx0XHRub25jZTogc2V0dGluZ3MucmVzdEFwaS5ub25jZSxcblx0XHRhbGxQcm9taW5lbnRXb3JkSWRzOiBzZXR0aW5ncy5hbGxXb3Jkcyxcblx0fSApO1xuXG5cdHByb21pbmVudFdvcmRDYWxjdWxhdGlvbi5vbiggXCJwcm9jZXNzZWRQb3N0XCIsICggcG9zdENvdW50ICkgPT4ge1xuXHRcdHByb2dyZXNzRWxlbWVudC5odG1sKCBwb3N0Q291bnQgKTtcblx0fSApO1xuXG5cdHByb21pbmVudFdvcmRDYWxjdWxhdGlvbi5zdGFydCgpO1xuXG5cdC8vIEZyZWUgdXAgdGhlIHZhcmlhYmxlIHRvIHN0YXJ0IGFub3RoZXIgcmVjYWxjdWxhdGlvbi5cblx0cHJvbWluZW50V29yZENhbGN1bGF0aW9uLm9uKCBcImNvbXBsZXRlXCIsICgpID0+IHtcblx0XHRwcm9taW5lbnRXb3JkQ2FsY3VsYXRpb24gPSBudWxsO1xuXG5cdFx0cHJvZ3Jlc3NDb250YWluZXIuaGlkZSgpO1xuXHRcdGNvbXBsZXRlZENvbnRhaW5lci5zaG93KCk7XG5cdH0gKTtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplcyB0aGUgc2l0ZSB3aWRlIGFuYWx5c2lzIHRhYi5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gaW5pdCgpIHtcblx0alF1ZXJ5KCBcIi55b2FzdC1qcy1jYWxjdWxhdGUtcHJvbWluZW50LXdvcmRzLS1hbGxcIiApLm9uKCBcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuXHRcdHN0YXJ0UmVjYWxjdWxhdGluZyggc2V0dGluZ3MuYW1vdW50LnRvdGFsICk7XG5cblx0XHRqUXVlcnkoIHRoaXMgKS5oaWRlKCk7XG5cdH0gKTtcblxuXHRwcm9ncmVzc0NvbnRhaW5lciA9IGpRdWVyeSggXCIueW9hc3QtanMtcHJvbWluZW50LXdvcmRzLXByb2dyZXNzXCIgKTtcblx0cHJvZ3Jlc3NDb250YWluZXIuaGlkZSgpO1xuXG5cdGNvbXBsZXRlZENvbnRhaW5lciA9IGpRdWVyeSggXCIueW9hc3QtanMtcHJvbWluZW50LXdvcmRzLWNvbXBsZXRlZFwiICk7XG5cdGNvbXBsZXRlZENvbnRhaW5lci5oaWRlKCk7XG59XG5cbmpRdWVyeSggaW5pdCApO1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH1cbiAgICAgIHRocm93IFR5cGVFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4nKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgYXJncyA9IG5ldyBBcnJheShsZW4gLSAxKTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIHZhciBtO1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghZW1pdHRlci5fZXZlbnRzIHx8ICFlbWl0dGVyLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gMDtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbihlbWl0dGVyLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IDE7XG4gIGVsc2VcbiAgICByZXQgPSBlbWl0dGVyLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuICByZXR1cm4gcmV0O1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBEYXRhVmlldyA9IGdldE5hdGl2ZShyb290LCAnRGF0YVZpZXcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEYXRhVmlldztcbiIsInZhciBoYXNoQ2xlYXIgPSByZXF1aXJlKCcuL19oYXNoQ2xlYXInKSxcbiAgICBoYXNoRGVsZXRlID0gcmVxdWlyZSgnLi9faGFzaERlbGV0ZScpLFxuICAgIGhhc2hHZXQgPSByZXF1aXJlKCcuL19oYXNoR2V0JyksXG4gICAgaGFzaEhhcyA9IHJlcXVpcmUoJy4vX2hhc2hIYXMnKSxcbiAgICBoYXNoU2V0ID0gcmVxdWlyZSgnLi9faGFzaFNldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBoYXNoIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gSGFzaChlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBIYXNoYC5cbkhhc2gucHJvdG90eXBlLmNsZWFyID0gaGFzaENsZWFyO1xuSGFzaC5wcm90b3R5cGVbJ2RlbGV0ZSddID0gaGFzaERlbGV0ZTtcbkhhc2gucHJvdG90eXBlLmdldCA9IGhhc2hHZXQ7XG5IYXNoLnByb3RvdHlwZS5oYXMgPSBoYXNoSGFzO1xuSGFzaC5wcm90b3R5cGUuc2V0ID0gaGFzaFNldDtcblxubW9kdWxlLmV4cG9ydHMgPSBIYXNoO1xuIiwidmFyIGxpc3RDYWNoZUNsZWFyID0gcmVxdWlyZSgnLi9fbGlzdENhY2hlQ2xlYXInKSxcbiAgICBsaXN0Q2FjaGVEZWxldGUgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVEZWxldGUnKSxcbiAgICBsaXN0Q2FjaGVHZXQgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVHZXQnKSxcbiAgICBsaXN0Q2FjaGVIYXMgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVIYXMnKSxcbiAgICBsaXN0Q2FjaGVTZXQgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGxpc3QgY2FjaGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBMaXN0Q2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTGlzdENhY2hlYC5cbkxpc3RDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBsaXN0Q2FjaGVDbGVhcjtcbkxpc3RDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbGlzdENhY2hlRGVsZXRlO1xuTGlzdENhY2hlLnByb3RvdHlwZS5nZXQgPSBsaXN0Q2FjaGVHZXQ7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmhhcyA9IGxpc3RDYWNoZUhhcztcbkxpc3RDYWNoZS5wcm90b3R5cGUuc2V0ID0gbGlzdENhY2hlU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpc3RDYWNoZTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdNYXAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXA7XG4iLCJ2YXIgbWFwQ2FjaGVDbGVhciA9IHJlcXVpcmUoJy4vX21hcENhY2hlQ2xlYXInKSxcbiAgICBtYXBDYWNoZURlbGV0ZSA9IHJlcXVpcmUoJy4vX21hcENhY2hlRGVsZXRlJyksXG4gICAgbWFwQ2FjaGVHZXQgPSByZXF1aXJlKCcuL19tYXBDYWNoZUdldCcpLFxuICAgIG1hcENhY2hlSGFzID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVIYXMnKSxcbiAgICBtYXBDYWNoZVNldCA9IHJlcXVpcmUoJy4vX21hcENhY2hlU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hcCBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBNYXBDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBNYXBDYWNoZWAuXG5NYXBDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBtYXBDYWNoZUNsZWFyO1xuTWFwQ2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IG1hcENhY2hlRGVsZXRlO1xuTWFwQ2FjaGUucHJvdG90eXBlLmdldCA9IG1hcENhY2hlR2V0O1xuTWFwQ2FjaGUucHJvdG90eXBlLmhhcyA9IG1hcENhY2hlSGFzO1xuTWFwQ2FjaGUucHJvdG90eXBlLnNldCA9IG1hcENhY2hlU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcENhY2hlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBQcm9taXNlID0gZ2V0TmF0aXZlKHJvb3QsICdQcm9taXNlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvbWlzZTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgU2V0ID0gZ2V0TmF0aXZlKHJvb3QsICdTZXQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZXQ7XG4iLCJ2YXIgTWFwQ2FjaGUgPSByZXF1aXJlKCcuL19NYXBDYWNoZScpLFxuICAgIHNldENhY2hlQWRkID0gcmVxdWlyZSgnLi9fc2V0Q2FjaGVBZGQnKSxcbiAgICBzZXRDYWNoZUhhcyA9IHJlcXVpcmUoJy4vX3NldENhY2hlSGFzJyk7XG5cbi8qKlxuICpcbiAqIENyZWF0ZXMgYW4gYXJyYXkgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIHVuaXF1ZSB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW3ZhbHVlc10gVGhlIHZhbHVlcyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU2V0Q2FjaGUodmFsdWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gdmFsdWVzID09IG51bGwgPyAwIDogdmFsdWVzLmxlbmd0aDtcblxuICB0aGlzLl9fZGF0YV9fID0gbmV3IE1hcENhY2hlO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHRoaXMuYWRkKHZhbHVlc1tpbmRleF0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTZXRDYWNoZWAuXG5TZXRDYWNoZS5wcm90b3R5cGUuYWRkID0gU2V0Q2FjaGUucHJvdG90eXBlLnB1c2ggPSBzZXRDYWNoZUFkZDtcblNldENhY2hlLnByb3RvdHlwZS5oYXMgPSBzZXRDYWNoZUhhcztcblxubW9kdWxlLmV4cG9ydHMgPSBTZXRDYWNoZTtcbiIsInZhciBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKSxcbiAgICBzdGFja0NsZWFyID0gcmVxdWlyZSgnLi9fc3RhY2tDbGVhcicpLFxuICAgIHN0YWNrRGVsZXRlID0gcmVxdWlyZSgnLi9fc3RhY2tEZWxldGUnKSxcbiAgICBzdGFja0dldCA9IHJlcXVpcmUoJy4vX3N0YWNrR2V0JyksXG4gICAgc3RhY2tIYXMgPSByZXF1aXJlKCcuL19zdGFja0hhcycpLFxuICAgIHN0YWNrU2V0ID0gcmVxdWlyZSgnLi9fc3RhY2tTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgc3RhY2sgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU3RhY2soZW50cmllcykge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlKGVudHJpZXMpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTdGFja2AuXG5TdGFjay5wcm90b3R5cGUuY2xlYXIgPSBzdGFja0NsZWFyO1xuU3RhY2sucHJvdG90eXBlWydkZWxldGUnXSA9IHN0YWNrRGVsZXRlO1xuU3RhY2sucHJvdG90eXBlLmdldCA9IHN0YWNrR2V0O1xuU3RhY2sucHJvdG90eXBlLmhhcyA9IHN0YWNrSGFzO1xuU3RhY2sucHJvdG90eXBlLnNldCA9IHN0YWNrU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YWNrO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFN5bWJvbCA9IHJvb3QuU3ltYm9sO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bWJvbDtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBVaW50OEFycmF5ID0gcm9vdC5VaW50OEFycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFVpbnQ4QXJyYXk7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFdlYWtNYXAgPSBnZXROYXRpdmUocm9vdCwgJ1dlYWtNYXAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBXZWFrTWFwO1xuIiwiLyoqXG4gKiBBIGZhc3RlciBhbHRlcm5hdGl2ZSB0byBgRnVuY3Rpb24jYXBwbHlgLCB0aGlzIGZ1bmN0aW9uIGludm9rZXMgYGZ1bmNgXG4gKiB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiBgdGhpc0FyZ2AgYW5kIHRoZSBhcmd1bWVudHMgb2YgYGFyZ3NgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBpbnZva2UuXG4gKiBAcGFyYW0geyp9IHRoaXNBcmcgVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBmdW5jYC5cbiAqIEBwYXJhbSB7QXJyYXl9IGFyZ3MgVGhlIGFyZ3VtZW50cyB0byBpbnZva2UgYGZ1bmNgIHdpdGguXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzdWx0IG9mIGBmdW5jYC5cbiAqL1xuZnVuY3Rpb24gYXBwbHkoZnVuYywgdGhpc0FyZywgYXJncykge1xuICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcpO1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdKTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICB9XG4gIHJldHVybiBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFwcGx5O1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uZm9yRWFjaGAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5RWFjaChhcnJheSwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkgPT09IGZhbHNlKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5RWFjaDtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZpbHRlcmAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZpbHRlcmVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBhcnJheUZpbHRlcihhcnJheSwgcHJlZGljYXRlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGgsXG4gICAgICByZXNJbmRleCA9IDAsXG4gICAgICByZXN1bHQgPSBbXTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcbiAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXN1bHRbcmVzSW5kZXgrK10gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUZpbHRlcjtcbiIsInZhciBiYXNlSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Jhc2VJbmRleE9mJyk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmluY2x1ZGVzYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3JcbiAqIHNwZWNpZnlpbmcgYW4gaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IHRhcmdldCBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdGFyZ2V0YCBpcyBmb3VuZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBhcnJheUluY2x1ZGVzKGFycmF5LCB2YWx1ZSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG4gIHJldHVybiAhIWxlbmd0aCAmJiBiYXNlSW5kZXhPZihhcnJheSwgdmFsdWUsIDApID4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlJbmNsdWRlcztcbiIsIi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyBsaWtlIGBhcnJheUluY2x1ZGVzYCBleGNlcHQgdGhhdCBpdCBhY2NlcHRzIGEgY29tcGFyYXRvci5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdGFyZ2V0IFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY29tcGFyYXRvciBUaGUgY29tcGFyYXRvciBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB0YXJnZXRgIGlzIGZvdW5kLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5SW5jbHVkZXNXaXRoKGFycmF5LCB2YWx1ZSwgY29tcGFyYXRvcikge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgaWYgKGNvbXBhcmF0b3IodmFsdWUsIGFycmF5W2luZGV4XSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlJbmNsdWRlc1dpdGg7XG4iLCJ2YXIgYmFzZVRpbWVzID0gcmVxdWlyZSgnLi9fYmFzZVRpbWVzJyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnLi9pc0J1ZmZlcicpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL19pc0luZGV4JyksXG4gICAgaXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9pc1R5cGVkQXJyYXknKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIHRoZSBhcnJheS1saWtlIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtib29sZWFufSBpbmhlcml0ZWQgU3BlY2lmeSByZXR1cm5pbmcgaW5oZXJpdGVkIHByb3BlcnR5IG5hbWVzLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYXJyYXlMaWtlS2V5cyh2YWx1ZSwgaW5oZXJpdGVkKSB7XG4gIHZhciBpc0FyciA9IGlzQXJyYXkodmFsdWUpLFxuICAgICAgaXNBcmcgPSAhaXNBcnIgJiYgaXNBcmd1bWVudHModmFsdWUpLFxuICAgICAgaXNCdWZmID0gIWlzQXJyICYmICFpc0FyZyAmJiBpc0J1ZmZlcih2YWx1ZSksXG4gICAgICBpc1R5cGUgPSAhaXNBcnIgJiYgIWlzQXJnICYmICFpc0J1ZmYgJiYgaXNUeXBlZEFycmF5KHZhbHVlKSxcbiAgICAgIHNraXBJbmRleGVzID0gaXNBcnIgfHwgaXNBcmcgfHwgaXNCdWZmIHx8IGlzVHlwZSxcbiAgICAgIHJlc3VsdCA9IHNraXBJbmRleGVzID8gYmFzZVRpbWVzKHZhbHVlLmxlbmd0aCwgU3RyaW5nKSA6IFtdLFxuICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcblxuICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICBpZiAoKGluaGVyaXRlZCB8fCBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrZXkpKSAmJlxuICAgICAgICAhKHNraXBJbmRleGVzICYmIChcbiAgICAgICAgICAgLy8gU2FmYXJpIDkgaGFzIGVudW1lcmFibGUgYGFyZ3VtZW50cy5sZW5ndGhgIGluIHN0cmljdCBtb2RlLlxuICAgICAgICAgICBrZXkgPT0gJ2xlbmd0aCcgfHxcbiAgICAgICAgICAgLy8gTm9kZS5qcyAwLjEwIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIGJ1ZmZlcnMuXG4gICAgICAgICAgIChpc0J1ZmYgJiYgKGtleSA9PSAnb2Zmc2V0JyB8fCBrZXkgPT0gJ3BhcmVudCcpKSB8fFxuICAgICAgICAgICAvLyBQaGFudG9tSlMgMiBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiB0eXBlZCBhcnJheXMuXG4gICAgICAgICAgIChpc1R5cGUgJiYgKGtleSA9PSAnYnVmZmVyJyB8fCBrZXkgPT0gJ2J5dGVMZW5ndGgnIHx8IGtleSA9PSAnYnl0ZU9mZnNldCcpKSB8fFxuICAgICAgICAgICAvLyBTa2lwIGluZGV4IHByb3BlcnRpZXMuXG4gICAgICAgICAgIGlzSW5kZXgoa2V5LCBsZW5ndGgpXG4gICAgICAgICkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5TGlrZUtleXM7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5tYXBgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZVxuICogc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IG1hcHBlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYXJyYXlNYXAoYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGl0ZXJhdGVlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5TWFwO1xuIiwiLyoqXG4gKiBBcHBlbmRzIHRoZSBlbGVtZW50cyBvZiBgdmFsdWVzYCB0byBgYXJyYXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheX0gdmFsdWVzIFRoZSB2YWx1ZXMgdG8gYXBwZW5kLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5UHVzaChhcnJheSwgdmFsdWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gdmFsdWVzLmxlbmd0aCxcbiAgICAgIG9mZnNldCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFycmF5W29mZnNldCArIGluZGV4XSA9IHZhbHVlc1tpbmRleF07XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5UHVzaDtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLnNvbWVgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZVxuICogc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW55IGVsZW1lbnQgcGFzc2VzIHRoZSBwcmVkaWNhdGUgY2hlY2ssXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBhcnJheVNvbWUoYXJyYXksIHByZWRpY2F0ZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlTb21lO1xuIiwidmFyIGJhc2VBc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ25WYWx1ZScpLFxuICAgIGVxID0gcmVxdWlyZSgnLi9lcScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEFzc2lnbnMgYHZhbHVlYCB0byBga2V5YCBvZiBgb2JqZWN0YCBpZiB0aGUgZXhpc3RpbmcgdmFsdWUgaXMgbm90IGVxdWl2YWxlbnRcbiAqIHVzaW5nIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBmb3IgZXF1YWxpdHkgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHZhciBvYmpWYWx1ZSA9IG9iamVjdFtrZXldO1xuICBpZiAoIShoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBlcShvYmpWYWx1ZSwgdmFsdWUpKSB8fFxuICAgICAgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkpIHtcbiAgICBiYXNlQXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnblZhbHVlO1xuIiwidmFyIGVxID0gcmVxdWlyZSgnLi9lcScpO1xuXG4vKipcbiAqIEdldHMgdGhlIGluZGV4IGF0IHdoaWNoIHRoZSBga2V5YCBpcyBmb3VuZCBpbiBgYXJyYXlgIG9mIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IGtleSBUaGUga2V5IHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBhc3NvY0luZGV4T2YoYXJyYXksIGtleSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICBpZiAoZXEoYXJyYXlbbGVuZ3RoXVswXSwga2V5KSkge1xuICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc29jSW5kZXhPZjtcbiIsInZhciBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2RlZmluZVByb3BlcnR5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGFzc2lnblZhbHVlYCBhbmQgYGFzc2lnbk1lcmdlVmFsdWVgIHdpdGhvdXRcbiAqIHZhbHVlIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduLlxuICovXG5mdW5jdGlvbiBiYXNlQXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIGlmIChrZXkgPT0gJ19fcHJvdG9fXycgJiYgZGVmaW5lUHJvcGVydHkpIHtcbiAgICBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIGtleSwge1xuICAgICAgJ2NvbmZpZ3VyYWJsZSc6IHRydWUsXG4gICAgICAnZW51bWVyYWJsZSc6IHRydWUsXG4gICAgICAndmFsdWUnOiB2YWx1ZSxcbiAgICAgICd3cml0YWJsZSc6IHRydWVcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUFzc2lnblZhbHVlO1xuIiwidmFyIGJhc2VGb3JPd24gPSByZXF1aXJlKCcuL19iYXNlRm9yT3duJyksXG4gICAgY3JlYXRlQmFzZUVhY2ggPSByZXF1aXJlKCcuL19jcmVhdGVCYXNlRWFjaCcpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZvckVhY2hgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICovXG52YXIgYmFzZUVhY2ggPSBjcmVhdGVCYXNlRWFjaChiYXNlRm9yT3duKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRWFjaDtcbiIsInZhciBiYXNlRWFjaCA9IHJlcXVpcmUoJy4vX2Jhc2VFYWNoJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZmlsdGVyYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZmlsdGVyZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGJhc2VGaWx0ZXIoY29sbGVjdGlvbiwgcHJlZGljYXRlKSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgYmFzZUVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSB7XG4gICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pKSB7XG4gICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRmlsdGVyO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5maW5kSW5kZXhgIGFuZCBgXy5maW5kTGFzdEluZGV4YCB3aXRob3V0XG4gKiBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VGaW5kSW5kZXgoYXJyYXksIHByZWRpY2F0ZSwgZnJvbUluZGV4LCBmcm9tUmlnaHQpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIGluZGV4ID0gZnJvbUluZGV4ICsgKGZyb21SaWdodCA/IDEgOiAtMSk7XG5cbiAgd2hpbGUgKChmcm9tUmlnaHQgPyBpbmRleC0tIDogKytpbmRleCA8IGxlbmd0aCkpIHtcbiAgICBpZiAocHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZpbmRJbmRleDtcbiIsInZhciBhcnJheVB1c2ggPSByZXF1aXJlKCcuL19hcnJheVB1c2gnKSxcbiAgICBpc0ZsYXR0ZW5hYmxlID0gcmVxdWlyZSgnLi9faXNGbGF0dGVuYWJsZScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZsYXR0ZW5gIHdpdGggc3VwcG9ydCBmb3IgcmVzdHJpY3RpbmcgZmxhdHRlbmluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGZsYXR0ZW4uXG4gKiBAcGFyYW0ge251bWJlcn0gZGVwdGggVGhlIG1heGltdW0gcmVjdXJzaW9uIGRlcHRoLlxuICogQHBhcmFtIHtib29sZWFufSBbcHJlZGljYXRlPWlzRmxhdHRlbmFibGVdIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpc1N0cmljdF0gUmVzdHJpY3QgdG8gdmFsdWVzIHRoYXQgcGFzcyBgcHJlZGljYXRlYCBjaGVja3MuXG4gKiBAcGFyYW0ge0FycmF5fSBbcmVzdWx0PVtdXSBUaGUgaW5pdGlhbCByZXN1bHQgdmFsdWUuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBmbGF0dGVuZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGJhc2VGbGF0dGVuKGFycmF5LCBkZXB0aCwgcHJlZGljYXRlLCBpc1N0cmljdCwgcmVzdWx0KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gIHByZWRpY2F0ZSB8fCAocHJlZGljYXRlID0gaXNGbGF0dGVuYWJsZSk7XG4gIHJlc3VsdCB8fCAocmVzdWx0ID0gW10pO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIHZhbHVlID0gYXJyYXlbaW5kZXhdO1xuICAgIGlmIChkZXB0aCA+IDAgJiYgcHJlZGljYXRlKHZhbHVlKSkge1xuICAgICAgaWYgKGRlcHRoID4gMSkge1xuICAgICAgICAvLyBSZWN1cnNpdmVseSBmbGF0dGVuIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgICAgICBiYXNlRmxhdHRlbih2YWx1ZSwgZGVwdGggLSAxLCBwcmVkaWNhdGUsIGlzU3RyaWN0LCByZXN1bHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXJyYXlQdXNoKHJlc3VsdCwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIWlzU3RyaWN0KSB7XG4gICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRmxhdHRlbjtcbiIsInZhciBjcmVhdGVCYXNlRm9yID0gcmVxdWlyZSgnLi9fY3JlYXRlQmFzZUZvcicpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBiYXNlRm9yT3duYCB3aGljaCBpdGVyYXRlcyBvdmVyIGBvYmplY3RgXG4gKiBwcm9wZXJ0aWVzIHJldHVybmVkIGJ5IGBrZXlzRnVuY2AgYW5kIGludm9rZXMgYGl0ZXJhdGVlYCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqIEl0ZXJhdGVlIGZ1bmN0aW9ucyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHkgYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBrZXlzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBrZXlzIG9mIGBvYmplY3RgLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xudmFyIGJhc2VGb3IgPSBjcmVhdGVCYXNlRm9yKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZvcjtcbiIsInZhciBiYXNlRm9yID0gcmVxdWlyZSgnLi9fYmFzZUZvcicpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JPd25gIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlRm9yT3duKG9iamVjdCwgaXRlcmF0ZWUpIHtcbiAgcmV0dXJuIG9iamVjdCAmJiBiYXNlRm9yKG9iamVjdCwgaXRlcmF0ZWUsIGtleXMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGb3JPd247XG4iLCJ2YXIgY2FzdFBhdGggPSByZXF1aXJlKCcuL19jYXN0UGF0aCcpLFxuICAgIHRvS2V5ID0gcmVxdWlyZSgnLi9fdG9LZXknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5nZXRgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVmYXVsdCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzb2x2ZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXQob2JqZWN0LCBwYXRoKSB7XG4gIHBhdGggPSBjYXN0UGF0aChwYXRoLCBvYmplY3QpO1xuXG4gIHZhciBpbmRleCA9IDAsXG4gICAgICBsZW5ndGggPSBwYXRoLmxlbmd0aDtcblxuICB3aGlsZSAob2JqZWN0ICE9IG51bGwgJiYgaW5kZXggPCBsZW5ndGgpIHtcbiAgICBvYmplY3QgPSBvYmplY3RbdG9LZXkocGF0aFtpbmRleCsrXSldO1xuICB9XG4gIHJldHVybiAoaW5kZXggJiYgaW5kZXggPT0gbGVuZ3RoKSA/IG9iamVjdCA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlR2V0O1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGdldFJhd1RhZyA9IHJlcXVpcmUoJy4vX2dldFJhd1RhZycpLFxuICAgIG9iamVjdFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fb2JqZWN0VG9TdHJpbmcnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG51bGxUYWcgPSAnW29iamVjdCBOdWxsXScsXG4gICAgdW5kZWZpbmVkVGFnID0gJ1tvYmplY3QgVW5kZWZpbmVkXSc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgfVxuICB2YWx1ZSA9IE9iamVjdCh2YWx1ZSk7XG4gIHJldHVybiAoc3ltVG9TdHJpbmdUYWcgJiYgc3ltVG9TdHJpbmdUYWcgaW4gdmFsdWUpXG4gICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUdldFRhZztcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaGFzYCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IGtleSBUaGUga2V5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSGFzKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSGFzO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5oYXNJbmAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBrZXkgVGhlIGtleSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUhhc0luKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJiBrZXkgaW4gT2JqZWN0KG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUhhc0luO1xuIiwidmFyIGJhc2VGaW5kSW5kZXggPSByZXF1aXJlKCcuL19iYXNlRmluZEluZGV4JyksXG4gICAgYmFzZUlzTmFOID0gcmVxdWlyZSgnLi9fYmFzZUlzTmFOJyksXG4gICAgc3RyaWN0SW5kZXhPZiA9IHJlcXVpcmUoJy4vX3N0cmljdEluZGV4T2YnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pbmRleE9mYCB3aXRob3V0IGBmcm9tSW5kZXhgIGJvdW5kcyBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpIHtcbiAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZVxuICAgID8gc3RyaWN0SW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleClcbiAgICA6IGJhc2VGaW5kSW5kZXgoYXJyYXksIGJhc2VJc05hTiwgZnJvbUluZGV4KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSW5kZXhPZjtcbiIsInZhciBTZXRDYWNoZSA9IHJlcXVpcmUoJy4vX1NldENhY2hlJyksXG4gICAgYXJyYXlJbmNsdWRlcyA9IHJlcXVpcmUoJy4vX2FycmF5SW5jbHVkZXMnKSxcbiAgICBhcnJheUluY2x1ZGVzV2l0aCA9IHJlcXVpcmUoJy4vX2FycmF5SW5jbHVkZXNXaXRoJyksXG4gICAgYXJyYXlNYXAgPSByZXF1aXJlKCcuL19hcnJheU1hcCcpLFxuICAgIGJhc2VVbmFyeSA9IHJlcXVpcmUoJy4vX2Jhc2VVbmFyeScpLFxuICAgIGNhY2hlSGFzID0gcmVxdWlyZSgnLi9fY2FjaGVIYXMnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1pbiA9IE1hdGgubWluO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIG1ldGhvZHMgbGlrZSBgXy5pbnRlcnNlY3Rpb25gLCB3aXRob3V0IHN1cHBvcnRcbiAqIGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLCB0aGF0IGFjY2VwdHMgYW4gYXJyYXkgb2YgYXJyYXlzIHRvIGluc3BlY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5cyBUaGUgYXJyYXlzIHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWVdIFRoZSBpdGVyYXRlZSBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbXBhcmF0b3JdIFRoZSBjb21wYXJhdG9yIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBhcnJheSBvZiBzaGFyZWQgdmFsdWVzLlxuICovXG5mdW5jdGlvbiBiYXNlSW50ZXJzZWN0aW9uKGFycmF5cywgaXRlcmF0ZWUsIGNvbXBhcmF0b3IpIHtcbiAgdmFyIGluY2x1ZGVzID0gY29tcGFyYXRvciA/IGFycmF5SW5jbHVkZXNXaXRoIDogYXJyYXlJbmNsdWRlcyxcbiAgICAgIGxlbmd0aCA9IGFycmF5c1swXS5sZW5ndGgsXG4gICAgICBvdGhMZW5ndGggPSBhcnJheXMubGVuZ3RoLFxuICAgICAgb3RoSW5kZXggPSBvdGhMZW5ndGgsXG4gICAgICBjYWNoZXMgPSBBcnJheShvdGhMZW5ndGgpLFxuICAgICAgbWF4TGVuZ3RoID0gSW5maW5pdHksXG4gICAgICByZXN1bHQgPSBbXTtcblxuICB3aGlsZSAob3RoSW5kZXgtLSkge1xuICAgIHZhciBhcnJheSA9IGFycmF5c1tvdGhJbmRleF07XG4gICAgaWYgKG90aEluZGV4ICYmIGl0ZXJhdGVlKSB7XG4gICAgICBhcnJheSA9IGFycmF5TWFwKGFycmF5LCBiYXNlVW5hcnkoaXRlcmF0ZWUpKTtcbiAgICB9XG4gICAgbWF4TGVuZ3RoID0gbmF0aXZlTWluKGFycmF5Lmxlbmd0aCwgbWF4TGVuZ3RoKTtcbiAgICBjYWNoZXNbb3RoSW5kZXhdID0gIWNvbXBhcmF0b3IgJiYgKGl0ZXJhdGVlIHx8IChsZW5ndGggPj0gMTIwICYmIGFycmF5Lmxlbmd0aCA+PSAxMjApKVxuICAgICAgPyBuZXcgU2V0Q2FjaGUob3RoSW5kZXggJiYgYXJyYXkpXG4gICAgICA6IHVuZGVmaW5lZDtcbiAgfVxuICBhcnJheSA9IGFycmF5c1swXTtcblxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHNlZW4gPSBjYWNoZXNbMF07XG5cbiAgb3V0ZXI6XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoICYmIHJlc3VsdC5sZW5ndGggPCBtYXhMZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF0sXG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUgPyBpdGVyYXRlZSh2YWx1ZSkgOiB2YWx1ZTtcblxuICAgIHZhbHVlID0gKGNvbXBhcmF0b3IgfHwgdmFsdWUgIT09IDApID8gdmFsdWUgOiAwO1xuICAgIGlmICghKHNlZW5cbiAgICAgICAgICA/IGNhY2hlSGFzKHNlZW4sIGNvbXB1dGVkKVxuICAgICAgICAgIDogaW5jbHVkZXMocmVzdWx0LCBjb21wdXRlZCwgY29tcGFyYXRvcilcbiAgICAgICAgKSkge1xuICAgICAgb3RoSW5kZXggPSBvdGhMZW5ndGg7XG4gICAgICB3aGlsZSAoLS1vdGhJbmRleCkge1xuICAgICAgICB2YXIgY2FjaGUgPSBjYWNoZXNbb3RoSW5kZXhdO1xuICAgICAgICBpZiAoIShjYWNoZVxuICAgICAgICAgICAgICA/IGNhY2hlSGFzKGNhY2hlLCBjb21wdXRlZClcbiAgICAgICAgICAgICAgOiBpbmNsdWRlcyhhcnJheXNbb3RoSW5kZXhdLCBjb21wdXRlZCwgY29tcGFyYXRvcikpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHNlZW4pIHtcbiAgICAgICAgc2Vlbi5wdXNoKGNvbXB1dGVkKTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSW50ZXJzZWN0aW9uO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJztcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0FyZ3VtZW50c2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICovXG5mdW5jdGlvbiBiYXNlSXNBcmd1bWVudHModmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gYXJnc1RhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNBcmd1bWVudHM7XG4iLCJ2YXIgYmFzZUlzRXF1YWxEZWVwID0gcmVxdWlyZSgnLi9fYmFzZUlzRXF1YWxEZWVwJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc0VxdWFsYCB3aGljaCBzdXBwb3J0cyBwYXJ0aWFsIGNvbXBhcmlzb25zXG4gKiBhbmQgdHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy5cbiAqICAxIC0gVW5vcmRlcmVkIGNvbXBhcmlzb25cbiAqICAyIC0gUGFydGlhbCBjb21wYXJpc29uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgYHZhbHVlYCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzRXF1YWwodmFsdWUsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaykge1xuICBpZiAodmFsdWUgPT09IG90aGVyKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKHZhbHVlID09IG51bGwgfHwgb3RoZXIgPT0gbnVsbCB8fCAoIWlzT2JqZWN0KHZhbHVlKSAmJiAhaXNPYmplY3RMaWtlKG90aGVyKSkpIHtcbiAgICByZXR1cm4gdmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcjtcbiAgfVxuICByZXR1cm4gYmFzZUlzRXF1YWxEZWVwKHZhbHVlLCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgYmFzZUlzRXF1YWwsIHN0YWNrKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNFcXVhbDtcbiIsInZhciBTdGFjayA9IHJlcXVpcmUoJy4vX1N0YWNrJyksXG4gICAgZXF1YWxBcnJheXMgPSByZXF1aXJlKCcuL19lcXVhbEFycmF5cycpLFxuICAgIGVxdWFsQnlUYWcgPSByZXF1aXJlKCcuL19lcXVhbEJ5VGFnJyksXG4gICAgZXF1YWxPYmplY3RzID0gcmVxdWlyZSgnLi9fZXF1YWxPYmplY3RzJyksXG4gICAgZ2V0VGFnID0gcmVxdWlyZSgnLi9fZ2V0VGFnJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnLi9pc0J1ZmZlcicpLFxuICAgIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vaXNUeXBlZEFycmF5Jyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHZhbHVlIGNvbXBhcmlzb25zLiAqL1xudmFyIENPTVBBUkVfUEFSVElBTF9GTEFHID0gMTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbGAgZm9yIGFycmF5cyBhbmQgb2JqZWN0cyB3aGljaCBwZXJmb3Jtc1xuICogZGVlcCBjb21wYXJpc29ucyBhbmQgdHJhY2tzIHRyYXZlcnNlZCBvYmplY3RzIGVuYWJsaW5nIG9iamVjdHMgd2l0aCBjaXJjdWxhclxuICogcmVmZXJlbmNlcyB0byBiZSBjb21wYXJlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIGBvYmplY3RgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzRXF1YWxEZWVwKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgdmFyIG9iaklzQXJyID0gaXNBcnJheShvYmplY3QpLFxuICAgICAgb3RoSXNBcnIgPSBpc0FycmF5KG90aGVyKSxcbiAgICAgIG9ialRhZyA9IGFycmF5VGFnLFxuICAgICAgb3RoVGFnID0gYXJyYXlUYWc7XG5cbiAgaWYgKCFvYmpJc0Fycikge1xuICAgIG9ialRhZyA9IGdldFRhZyhvYmplY3QpO1xuICAgIG9ialRhZyA9IG9ialRhZyA9PSBhcmdzVGFnID8gb2JqZWN0VGFnIDogb2JqVGFnO1xuICB9XG4gIGlmICghb3RoSXNBcnIpIHtcbiAgICBvdGhUYWcgPSBnZXRUYWcob3RoZXIpO1xuICAgIG90aFRhZyA9IG90aFRhZyA9PSBhcmdzVGFnID8gb2JqZWN0VGFnIDogb3RoVGFnO1xuICB9XG4gIHZhciBvYmpJc09iaiA9IG9ialRhZyA9PSBvYmplY3RUYWcsXG4gICAgICBvdGhJc09iaiA9IG90aFRhZyA9PSBvYmplY3RUYWcsXG4gICAgICBpc1NhbWVUYWcgPSBvYmpUYWcgPT0gb3RoVGFnO1xuXG4gIGlmIChpc1NhbWVUYWcgJiYgaXNCdWZmZXIob2JqZWN0KSkge1xuICAgIGlmICghaXNCdWZmZXIob3RoZXIpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIG9iaklzQXJyID0gdHJ1ZTtcbiAgICBvYmpJc09iaiA9IGZhbHNlO1xuICB9XG4gIGlmIChpc1NhbWVUYWcgJiYgIW9iaklzT2JqKSB7XG4gICAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgICByZXR1cm4gKG9iaklzQXJyIHx8IGlzVHlwZWRBcnJheShvYmplY3QpKVxuICAgICAgPyBlcXVhbEFycmF5cyhvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKVxuICAgICAgOiBlcXVhbEJ5VGFnKG9iamVjdCwgb3RoZXIsIG9ialRhZywgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjayk7XG4gIH1cbiAgaWYgKCEoYml0bWFzayAmIENPTVBBUkVfUEFSVElBTF9GTEFHKSkge1xuICAgIHZhciBvYmpJc1dyYXBwZWQgPSBvYmpJc09iaiAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgJ19fd3JhcHBlZF9fJyksXG4gICAgICAgIG90aElzV3JhcHBlZCA9IG90aElzT2JqICYmIGhhc093blByb3BlcnR5LmNhbGwob3RoZXIsICdfX3dyYXBwZWRfXycpO1xuXG4gICAgaWYgKG9iaklzV3JhcHBlZCB8fCBvdGhJc1dyYXBwZWQpIHtcbiAgICAgIHZhciBvYmpVbndyYXBwZWQgPSBvYmpJc1dyYXBwZWQgPyBvYmplY3QudmFsdWUoKSA6IG9iamVjdCxcbiAgICAgICAgICBvdGhVbndyYXBwZWQgPSBvdGhJc1dyYXBwZWQgPyBvdGhlci52YWx1ZSgpIDogb3RoZXI7XG5cbiAgICAgIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gICAgICByZXR1cm4gZXF1YWxGdW5jKG9ialVud3JhcHBlZCwgb3RoVW53cmFwcGVkLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjayk7XG4gICAgfVxuICB9XG4gIGlmICghaXNTYW1lVGFnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gIHJldHVybiBlcXVhbE9iamVjdHMob2JqZWN0LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjayk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzRXF1YWxEZWVwO1xuIiwidmFyIFN0YWNrID0gcmVxdWlyZSgnLi9fU3RhY2snKSxcbiAgICBiYXNlSXNFcXVhbCA9IHJlcXVpcmUoJy4vX2Jhc2VJc0VxdWFsJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHZhbHVlIGNvbXBhcmlzb25zLiAqL1xudmFyIENPTVBBUkVfUEFSVElBTF9GTEFHID0gMSxcbiAgICBDT01QQVJFX1VOT1JERVJFRF9GTEFHID0gMjtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc01hdGNoYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IG9mIHByb3BlcnR5IHZhbHVlcyB0byBtYXRjaC5cbiAqIEBwYXJhbSB7QXJyYXl9IG1hdGNoRGF0YSBUaGUgcHJvcGVydHkgbmFtZXMsIHZhbHVlcywgYW5kIGNvbXBhcmUgZmxhZ3MgdG8gbWF0Y2guXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgb2JqZWN0YCBpcyBhIG1hdGNoLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc01hdGNoKG9iamVjdCwgc291cmNlLCBtYXRjaERhdGEsIGN1c3RvbWl6ZXIpIHtcbiAgdmFyIGluZGV4ID0gbWF0Y2hEYXRhLmxlbmd0aCxcbiAgICAgIGxlbmd0aCA9IGluZGV4LFxuICAgICAgbm9DdXN0b21pemVyID0gIWN1c3RvbWl6ZXI7XG5cbiAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgcmV0dXJuICFsZW5ndGg7XG4gIH1cbiAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gIHdoaWxlIChpbmRleC0tKSB7XG4gICAgdmFyIGRhdGEgPSBtYXRjaERhdGFbaW5kZXhdO1xuICAgIGlmICgobm9DdXN0b21pemVyICYmIGRhdGFbMl0pXG4gICAgICAgICAgPyBkYXRhWzFdICE9PSBvYmplY3RbZGF0YVswXV1cbiAgICAgICAgICA6ICEoZGF0YVswXSBpbiBvYmplY3QpXG4gICAgICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGRhdGEgPSBtYXRjaERhdGFbaW5kZXhdO1xuICAgIHZhciBrZXkgPSBkYXRhWzBdLFxuICAgICAgICBvYmpWYWx1ZSA9IG9iamVjdFtrZXldLFxuICAgICAgICBzcmNWYWx1ZSA9IGRhdGFbMV07XG5cbiAgICBpZiAobm9DdXN0b21pemVyICYmIGRhdGFbMl0pIHtcbiAgICAgIGlmIChvYmpWYWx1ZSA9PT0gdW5kZWZpbmVkICYmICEoa2V5IGluIG9iamVjdCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgc3RhY2sgPSBuZXcgU3RhY2s7XG4gICAgICBpZiAoY3VzdG9taXplcikge1xuICAgICAgICB2YXIgcmVzdWx0ID0gY3VzdG9taXplcihvYmpWYWx1ZSwgc3JjVmFsdWUsIGtleSwgb2JqZWN0LCBzb3VyY2UsIHN0YWNrKTtcbiAgICAgIH1cbiAgICAgIGlmICghKHJlc3VsdCA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgICA/IGJhc2VJc0VxdWFsKHNyY1ZhbHVlLCBvYmpWYWx1ZSwgQ09NUEFSRV9QQVJUSUFMX0ZMQUcgfCBDT01QQVJFX1VOT1JERVJFRF9GTEFHLCBjdXN0b21pemVyLCBzdGFjaylcbiAgICAgICAgICAgIDogcmVzdWx0XG4gICAgICAgICAgKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc01hdGNoO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hTmAgd2l0aG91dCBzdXBwb3J0IGZvciBudW1iZXIgb2JqZWN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBgTmFOYCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYU4odmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNOYU47XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzTWFza2VkID0gcmVxdWlyZSgnLi9faXNNYXNrZWQnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICB0b1NvdXJjZSA9IHJlcXVpcmUoJy4vX3RvU291cmNlJyk7XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYFxuICogW3N5bnRheCBjaGFyYWN0ZXJzXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wYXR0ZXJucykuXG4gKi9cbnZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpKS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGZ1bmNUb1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KS5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hdGl2ZWAgd2l0aG91dCBiYWQgc2hpbSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkgfHwgaXNNYXNrZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwYXR0ZXJuID0gaXNGdW5jdGlvbih2YWx1ZSkgPyByZUlzTmF0aXZlIDogcmVJc0hvc3RDdG9yO1xuICByZXR1cm4gcGF0dGVybi50ZXN0KHRvU291cmNlKHZhbHVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzTmF0aXZlO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqIFVzZWQgdG8gaWRlbnRpZnkgYHRvU3RyaW5nVGFnYCB2YWx1ZXMgb2YgdHlwZWQgYXJyYXlzLiAqL1xudmFyIHR5cGVkQXJyYXlUYWdzID0ge307XG50eXBlZEFycmF5VGFnc1tmbG9hdDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Zsb2F0NjRUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDhUYWddID0gdHlwZWRBcnJheVRhZ3NbaW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW2ludDMyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQ4VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50OENsYW1wZWRUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1t1aW50MzJUYWddID0gdHJ1ZTtcbnR5cGVkQXJyYXlUYWdzW2FyZ3NUYWddID0gdHlwZWRBcnJheVRhZ3NbYXJyYXlUYWddID1cbnR5cGVkQXJyYXlUYWdzW2FycmF5QnVmZmVyVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Jvb2xUYWddID1cbnR5cGVkQXJyYXlUYWdzW2RhdGFWaWV3VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2RhdGVUYWddID1cbnR5cGVkQXJyYXlUYWdzW2Vycm9yVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2Z1bmNUYWddID1cbnR5cGVkQXJyYXlUYWdzW21hcFRhZ10gPSB0eXBlZEFycmF5VGFnc1tudW1iZXJUYWddID1cbnR5cGVkQXJyYXlUYWdzW29iamVjdFRhZ10gPSB0eXBlZEFycmF5VGFnc1tyZWdleHBUYWddID1cbnR5cGVkQXJyYXlUYWdzW3NldFRhZ10gPSB0eXBlZEFycmF5VGFnc1tzdHJpbmdUYWddID1cbnR5cGVkQXJyYXlUYWdzW3dlYWtNYXBUYWddID0gZmFsc2U7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNUeXBlZEFycmF5YCB3aXRob3V0IE5vZGUuanMgb3B0aW1pemF0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc1R5cGVkQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiZcbiAgICBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICEhdHlwZWRBcnJheVRhZ3NbYmFzZUdldFRhZyh2YWx1ZSldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc1R5cGVkQXJyYXk7XG4iLCJ2YXIgYmFzZU1hdGNoZXMgPSByZXF1aXJlKCcuL19iYXNlTWF0Y2hlcycpLFxuICAgIGJhc2VNYXRjaGVzUHJvcGVydHkgPSByZXF1aXJlKCcuL19iYXNlTWF0Y2hlc1Byb3BlcnR5JyksXG4gICAgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5JyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIHByb3BlcnR5ID0gcmVxdWlyZSgnLi9wcm9wZXJ0eScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLml0ZXJhdGVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSBbdmFsdWU9Xy5pZGVudGl0eV0gVGhlIHZhbHVlIHRvIGNvbnZlcnQgdG8gYW4gaXRlcmF0ZWUuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIGl0ZXJhdGVlLlxuICovXG5mdW5jdGlvbiBiYXNlSXRlcmF0ZWUodmFsdWUpIHtcbiAgLy8gRG9uJ3Qgc3RvcmUgdGhlIGB0eXBlb2ZgIHJlc3VsdCBpbiBhIHZhcmlhYmxlIHRvIGF2b2lkIGEgSklUIGJ1ZyBpbiBTYWZhcmkgOS5cbiAgLy8gU2VlIGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xNTYwMzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGlkZW50aXR5O1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gaXNBcnJheSh2YWx1ZSlcbiAgICAgID8gYmFzZU1hdGNoZXNQcm9wZXJ0eSh2YWx1ZVswXSwgdmFsdWVbMV0pXG4gICAgICA6IGJhc2VNYXRjaGVzKHZhbHVlKTtcbiAgfVxuICByZXR1cm4gcHJvcGVydHkodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJdGVyYXRlZTtcbiIsInZhciBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyksXG4gICAgbmF0aXZlS2V5cyA9IHJlcXVpcmUoJy4vX25hdGl2ZUtleXMnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzKG9iamVjdCkge1xuICBpZiAoIWlzUHJvdG90eXBlKG9iamVjdCkpIHtcbiAgICByZXR1cm4gbmF0aXZlS2V5cyhvYmplY3QpO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIE9iamVjdChvYmplY3QpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGtleSAhPSAnY29uc3RydWN0b3InKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VLZXlzO1xuIiwidmFyIGJhc2VFYWNoID0gcmVxdWlyZSgnLi9fYmFzZUVhY2gnKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5tYXBgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IG1hcHBlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYmFzZU1hcChjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IGlzQXJyYXlMaWtlKGNvbGxlY3Rpb24pID8gQXJyYXkoY29sbGVjdGlvbi5sZW5ndGgpIDogW107XG5cbiAgYmFzZUVhY2goY29sbGVjdGlvbiwgZnVuY3Rpb24odmFsdWUsIGtleSwgY29sbGVjdGlvbikge1xuICAgIHJlc3VsdFsrK2luZGV4XSA9IGl0ZXJhdGVlKHZhbHVlLCBrZXksIGNvbGxlY3Rpb24pO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlTWFwO1xuIiwidmFyIGJhc2VJc01hdGNoID0gcmVxdWlyZSgnLi9fYmFzZUlzTWF0Y2gnKSxcbiAgICBnZXRNYXRjaERhdGEgPSByZXF1aXJlKCcuL19nZXRNYXRjaERhdGEnKSxcbiAgICBtYXRjaGVzU3RyaWN0Q29tcGFyYWJsZSA9IHJlcXVpcmUoJy4vX21hdGNoZXNTdHJpY3RDb21wYXJhYmxlJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ubWF0Y2hlc2Agd2hpY2ggZG9lc24ndCBjbG9uZSBgc291cmNlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IG9mIHByb3BlcnR5IHZhbHVlcyB0byBtYXRjaC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNwZWMgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VNYXRjaGVzKHNvdXJjZSkge1xuICB2YXIgbWF0Y2hEYXRhID0gZ2V0TWF0Y2hEYXRhKHNvdXJjZSk7XG4gIGlmIChtYXRjaERhdGEubGVuZ3RoID09IDEgJiYgbWF0Y2hEYXRhWzBdWzJdKSB7XG4gICAgcmV0dXJuIG1hdGNoZXNTdHJpY3RDb21wYXJhYmxlKG1hdGNoRGF0YVswXVswXSwgbWF0Y2hEYXRhWzBdWzFdKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PT0gc291cmNlIHx8IGJhc2VJc01hdGNoKG9iamVjdCwgc291cmNlLCBtYXRjaERhdGEpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VNYXRjaGVzO1xuIiwidmFyIGJhc2VJc0VxdWFsID0gcmVxdWlyZSgnLi9fYmFzZUlzRXF1YWwnKSxcbiAgICBnZXQgPSByZXF1aXJlKCcuL2dldCcpLFxuICAgIGhhc0luID0gcmVxdWlyZSgnLi9oYXNJbicpLFxuICAgIGlzS2V5ID0gcmVxdWlyZSgnLi9faXNLZXknKSxcbiAgICBpc1N0cmljdENvbXBhcmFibGUgPSByZXF1aXJlKCcuL19pc1N0cmljdENvbXBhcmFibGUnKSxcbiAgICBtYXRjaGVzU3RyaWN0Q29tcGFyYWJsZSA9IHJlcXVpcmUoJy4vX21hdGNoZXNTdHJpY3RDb21wYXJhYmxlJyksXG4gICAgdG9LZXkgPSByZXF1aXJlKCcuL190b0tleScpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB2YWx1ZSBjb21wYXJpc29ucy4gKi9cbnZhciBDT01QQVJFX1BBUlRJQUxfRkxBRyA9IDEsXG4gICAgQ09NUEFSRV9VTk9SREVSRURfRkxBRyA9IDI7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ubWF0Y2hlc1Byb3BlcnR5YCB3aGljaCBkb2Vzbid0IGNsb25lIGBzcmNWYWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcGFyYW0geyp9IHNyY1ZhbHVlIFRoZSB2YWx1ZSB0byBtYXRjaC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNwZWMgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VNYXRjaGVzUHJvcGVydHkocGF0aCwgc3JjVmFsdWUpIHtcbiAgaWYgKGlzS2V5KHBhdGgpICYmIGlzU3RyaWN0Q29tcGFyYWJsZShzcmNWYWx1ZSkpIHtcbiAgICByZXR1cm4gbWF0Y2hlc1N0cmljdENvbXBhcmFibGUodG9LZXkocGF0aCksIHNyY1ZhbHVlKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIG9ialZhbHVlID0gZ2V0KG9iamVjdCwgcGF0aCk7XG4gICAgcmV0dXJuIChvYmpWYWx1ZSA9PT0gdW5kZWZpbmVkICYmIG9ialZhbHVlID09PSBzcmNWYWx1ZSlcbiAgICAgID8gaGFzSW4ob2JqZWN0LCBwYXRoKVxuICAgICAgOiBiYXNlSXNFcXVhbChzcmNWYWx1ZSwgb2JqVmFsdWUsIENPTVBBUkVfUEFSVElBTF9GTEFHIHwgQ09NUEFSRV9VTk9SREVSRURfRkxBRyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU1hdGNoZXNQcm9wZXJ0eTtcbiIsInZhciBiYXNlUGlja0J5ID0gcmVxdWlyZSgnLi9fYmFzZVBpY2tCeScpLFxuICAgIGhhc0luID0gcmVxdWlyZSgnLi9oYXNJbicpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnBpY2tgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaW5kaXZpZHVhbFxuICogcHJvcGVydHkgaWRlbnRpZmllcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBwYXRocyBUaGUgcHJvcGVydHkgcGF0aHMgdG8gcGljay5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGJhc2VQaWNrKG9iamVjdCwgcGF0aHMpIHtcbiAgb2JqZWN0ID0gT2JqZWN0KG9iamVjdCk7XG4gIHJldHVybiBiYXNlUGlja0J5KG9iamVjdCwgcGF0aHMsIGZ1bmN0aW9uKHZhbHVlLCBwYXRoKSB7XG4gICAgcmV0dXJuIGhhc0luKG9iamVjdCwgcGF0aCk7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VQaWNrO1xuIiwidmFyIGJhc2VHZXQgPSByZXF1aXJlKCcuL19iYXNlR2V0JyksXG4gICAgYmFzZVNldCA9IHJlcXVpcmUoJy4vX2Jhc2VTZXQnKSxcbiAgICBjYXN0UGF0aCA9IHJlcXVpcmUoJy4vX2Nhc3RQYXRoJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgIGBfLnBpY2tCeWAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmdbXX0gcGF0aHMgVGhlIHByb3BlcnR5IHBhdGhzIHRvIHBpY2suXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIHByb3BlcnR5LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gYmFzZVBpY2tCeShvYmplY3QsIHBhdGhzLCBwcmVkaWNhdGUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwYXRocy5sZW5ndGgsXG4gICAgICByZXN1bHQgPSB7fTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBwYXRoID0gcGF0aHNbaW5kZXhdLFxuICAgICAgICB2YWx1ZSA9IGJhc2VHZXQob2JqZWN0LCBwYXRoKTtcblxuICAgIGlmIChwcmVkaWNhdGUodmFsdWUsIHBhdGgpKSB7XG4gICAgICBiYXNlU2V0KHJlc3VsdCwgY2FzdFBhdGgocGF0aCwgb2JqZWN0KSwgdmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VQaWNrQnk7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnByb3BlcnR5YCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYWNjZXNzb3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VQcm9wZXJ0eShrZXkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VQcm9wZXJ0eTtcbiIsInZhciBiYXNlR2V0ID0gcmVxdWlyZSgnLi9fYmFzZUdldCcpO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZVByb3BlcnR5YCB3aGljaCBzdXBwb3J0cyBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYWNjZXNzb3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VQcm9wZXJ0eURlZXAocGF0aCkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIGJhc2VHZXQob2JqZWN0LCBwYXRoKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUHJvcGVydHlEZWVwO1xuIiwidmFyIGlkZW50aXR5ID0gcmVxdWlyZSgnLi9pZGVudGl0eScpLFxuICAgIG92ZXJSZXN0ID0gcmVxdWlyZSgnLi9fb3ZlclJlc3QnKSxcbiAgICBzZXRUb1N0cmluZyA9IHJlcXVpcmUoJy4vX3NldFRvU3RyaW5nJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucmVzdGAgd2hpY2ggZG9lc24ndCB2YWxpZGF0ZSBvciBjb2VyY2UgYXJndW1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD1mdW5jLmxlbmd0aC0xXSBUaGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHJlc3QgcGFyYW1ldGVyLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VSZXN0KGZ1bmMsIHN0YXJ0KSB7XG4gIHJldHVybiBzZXRUb1N0cmluZyhvdmVyUmVzdChmdW5jLCBzdGFydCwgaWRlbnRpdHkpLCBmdW5jICsgJycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VSZXN0O1xuIiwidmFyIGFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYXNzaWduVmFsdWUnKSxcbiAgICBjYXN0UGF0aCA9IHJlcXVpcmUoJy4vX2Nhc3RQYXRoJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uc2V0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBwYXRoIGNyZWF0aW9uLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZVNldChvYmplY3QsIHBhdGgsIHZhbHVlLCBjdXN0b21pemVyKSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cbiAgcGF0aCA9IGNhc3RQYXRoKHBhdGgsIG9iamVjdCk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwYXRoLmxlbmd0aCxcbiAgICAgIGxhc3RJbmRleCA9IGxlbmd0aCAtIDEsXG4gICAgICBuZXN0ZWQgPSBvYmplY3Q7XG5cbiAgd2hpbGUgKG5lc3RlZCAhPSBudWxsICYmICsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gdG9LZXkocGF0aFtpbmRleF0pLFxuICAgICAgICBuZXdWYWx1ZSA9IHZhbHVlO1xuXG4gICAgaWYgKGluZGV4ICE9IGxhc3RJbmRleCkge1xuICAgICAgdmFyIG9ialZhbHVlID0gbmVzdGVkW2tleV07XG4gICAgICBuZXdWYWx1ZSA9IGN1c3RvbWl6ZXIgPyBjdXN0b21pemVyKG9ialZhbHVlLCBrZXksIG5lc3RlZCkgOiB1bmRlZmluZWQ7XG4gICAgICBpZiAobmV3VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBuZXdWYWx1ZSA9IGlzT2JqZWN0KG9ialZhbHVlKVxuICAgICAgICAgID8gb2JqVmFsdWVcbiAgICAgICAgICA6IChpc0luZGV4KHBhdGhbaW5kZXggKyAxXSkgPyBbXSA6IHt9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgYXNzaWduVmFsdWUobmVzdGVkLCBrZXksIG5ld1ZhbHVlKTtcbiAgICBuZXN0ZWQgPSBuZXN0ZWRba2V5XTtcbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VTZXQ7XG4iLCJ2YXIgY29uc3RhbnQgPSByZXF1aXJlKCcuL2NvbnN0YW50JyksXG4gICAgZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19kZWZpbmVQcm9wZXJ0eScpLFxuICAgIGlkZW50aXR5ID0gcmVxdWlyZSgnLi9pZGVudGl0eScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBzZXRUb1N0cmluZ2Agd2l0aG91dCBzdXBwb3J0IGZvciBob3QgbG9vcCBzaG9ydGluZy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyaW5nIFRoZSBgdG9TdHJpbmdgIHJlc3VsdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBgZnVuY2AuXG4gKi9cbnZhciBiYXNlU2V0VG9TdHJpbmcgPSAhZGVmaW5lUHJvcGVydHkgPyBpZGVudGl0eSA6IGZ1bmN0aW9uKGZ1bmMsIHN0cmluZykge1xuICByZXR1cm4gZGVmaW5lUHJvcGVydHkoZnVuYywgJ3RvU3RyaW5nJywge1xuICAgICdjb25maWd1cmFibGUnOiB0cnVlLFxuICAgICdlbnVtZXJhYmxlJzogZmFsc2UsXG4gICAgJ3ZhbHVlJzogY29uc3RhbnQoc3RyaW5nKSxcbiAgICAnd3JpdGFibGUnOiB0cnVlXG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlU2V0VG9TdHJpbmc7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnNsaWNlYCB3aXRob3V0IGFuIGl0ZXJhdGVlIGNhbGwgZ3VhcmQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBzbGljZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9MF0gVGhlIHN0YXJ0IHBvc2l0aW9uLlxuICogQHBhcmFtIHtudW1iZXJ9IFtlbmQ9YXJyYXkubGVuZ3RoXSBUaGUgZW5kIHBvc2l0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBzbGljZSBvZiBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBiYXNlU2xpY2UoYXJyYXksIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgaWYgKHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ID0gLXN0YXJ0ID4gbGVuZ3RoID8gMCA6IChsZW5ndGggKyBzdGFydCk7XG4gIH1cbiAgZW5kID0gZW5kID4gbGVuZ3RoID8gbGVuZ3RoIDogZW5kO1xuICBpZiAoZW5kIDwgMCkge1xuICAgIGVuZCArPSBsZW5ndGg7XG4gIH1cbiAgbGVuZ3RoID0gc3RhcnQgPiBlbmQgPyAwIDogKChlbmQgLSBzdGFydCkgPj4+IDApO1xuICBzdGFydCA+Pj49IDA7XG5cbiAgdmFyIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGFycmF5W2luZGV4ICsgc3RhcnRdO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVNsaWNlO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5zdW1gIGFuZCBgXy5zdW1CeWAgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBzdW0uXG4gKi9cbmZ1bmN0aW9uIGJhc2VTdW0oYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHZhciByZXN1bHQsXG4gICAgICBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGN1cnJlbnQgPSBpdGVyYXRlZShhcnJheVtpbmRleF0pO1xuICAgIGlmIChjdXJyZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdCA9PT0gdW5kZWZpbmVkID8gY3VycmVudCA6IChyZXN1bHQgKyBjdXJyZW50KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlU3VtO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50aW1lc2Agd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzXG4gKiBvciBtYXggYXJyYXkgbGVuZ3RoIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiB0aW1lcyB0byBpbnZva2UgYGl0ZXJhdGVlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHJlc3VsdHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUaW1lcyhuLCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG4pO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbikge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShpbmRleCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVGltZXM7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgYXJyYXlNYXAgPSByZXF1aXJlKCcuL19hcnJheU1hcCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgSU5GSU5JVFkgPSAxIC8gMDtcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFRvU3RyaW5nID0gc3ltYm9sUHJvdG8gPyBzeW1ib2xQcm90by50b1N0cmluZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50b1N0cmluZ2Agd2hpY2ggZG9lc24ndCBjb252ZXJ0IG51bGxpc2hcbiAqIHZhbHVlcyB0byBlbXB0eSBzdHJpbmdzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBiYXNlVG9TdHJpbmcodmFsdWUpIHtcbiAgLy8gRXhpdCBlYXJseSBmb3Igc3RyaW5ncyB0byBhdm9pZCBhIHBlcmZvcm1hbmNlIGhpdCBpbiBzb21lIGVudmlyb25tZW50cy5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAvLyBSZWN1cnNpdmVseSBjb252ZXJ0IHZhbHVlcyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIHJldHVybiBhcnJheU1hcCh2YWx1ZSwgYmFzZVRvU3RyaW5nKSArICcnO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gc3ltYm9sVG9TdHJpbmcgPyBzeW1ib2xUb1N0cmluZy5jYWxsKHZhbHVlKSA6ICcnO1xuICB9XG4gIHZhciByZXN1bHQgPSAodmFsdWUgKyAnJyk7XG4gIHJldHVybiAocmVzdWx0ID09ICcwJyAmJiAoMSAvIHZhbHVlKSA9PSAtSU5GSU5JVFkpID8gJy0wJyA6IHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVG9TdHJpbmc7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnVuYXJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yIHN0b3JpbmcgbWV0YWRhdGEuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNhcCBhcmd1bWVudHMgZm9yLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY2FwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlVW5hcnkoZnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuYyh2YWx1ZSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVVuYXJ5O1xuIiwidmFyIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy52YWx1ZXNgIGFuZCBgXy52YWx1ZXNJbmAgd2hpY2ggY3JlYXRlcyBhblxuICogYXJyYXkgb2YgYG9iamVjdGAgcHJvcGVydHkgdmFsdWVzIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHByb3BlcnR5IG5hbWVzXG4gKiBvZiBgcHJvcHNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fSBwcm9wcyBUaGUgcHJvcGVydHkgbmFtZXMgdG8gZ2V0IHZhbHVlcyBmb3IuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VWYWx1ZXMob2JqZWN0LCBwcm9wcykge1xuICByZXR1cm4gYXJyYXlNYXAocHJvcHMsIGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBvYmplY3Rba2V5XTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVZhbHVlcztcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGEgYGNhY2hlYCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gY2FjaGUgVGhlIGNhY2hlIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGNhY2hlSGFzKGNhY2hlLCBrZXkpIHtcbiAgcmV0dXJuIGNhY2hlLmhhcyhrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNhY2hlSGFzO1xuIiwidmFyIGlzQXJyYXlMaWtlT2JqZWN0ID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZU9iamVjdCcpO1xuXG4vKipcbiAqIENhc3RzIGB2YWx1ZWAgdG8gYW4gZW1wdHkgYXJyYXkgaWYgaXQncyBub3QgYW4gYXJyYXkgbGlrZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fSBSZXR1cm5zIHRoZSBjYXN0IGFycmF5LWxpa2Ugb2JqZWN0LlxuICovXG5mdW5jdGlvbiBjYXN0QXJyYXlMaWtlT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiBpc0FycmF5TGlrZU9iamVjdCh2YWx1ZSkgPyB2YWx1ZSA6IFtdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNhc3RBcnJheUxpa2VPYmplY3Q7XG4iLCJ2YXIgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5Jyk7XG5cbi8qKlxuICogQ2FzdHMgYHZhbHVlYCB0byBgaWRlbnRpdHlgIGlmIGl0J3Mgbm90IGEgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgY2FzdCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY2FzdEZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ2Z1bmN0aW9uJyA/IHZhbHVlIDogaWRlbnRpdHk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2FzdEZ1bmN0aW9uO1xuIiwidmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0tleSA9IHJlcXVpcmUoJy4vX2lzS2V5JyksXG4gICAgc3RyaW5nVG9QYXRoID0gcmVxdWlyZSgnLi9fc3RyaW5nVG9QYXRoJyksXG4gICAgdG9TdHJpbmcgPSByZXF1aXJlKCcuL3RvU3RyaW5nJyk7XG5cbi8qKlxuICogQ2FzdHMgYHZhbHVlYCB0byBhIHBhdGggYXJyYXkgaWYgaXQncyBub3Qgb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkga2V5cyBvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgY2FzdCBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICovXG5mdW5jdGlvbiBjYXN0UGF0aCh2YWx1ZSwgb2JqZWN0KSB7XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICByZXR1cm4gaXNLZXkodmFsdWUsIG9iamVjdCkgPyBbdmFsdWVdIDogc3RyaW5nVG9QYXRoKHRvU3RyaW5nKHZhbHVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2FzdFBhdGg7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG92ZXJyZWFjaGluZyBjb3JlLWpzIHNoaW1zLiAqL1xudmFyIGNvcmVKc0RhdGEgPSByb290WydfX2NvcmUtanNfc2hhcmVkX18nXTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb3JlSnNEYXRhO1xuIiwidmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBgYmFzZUVhY2hgIG9yIGBiYXNlRWFjaFJpZ2h0YCBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZWFjaEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGl0ZXJhdGUgb3ZlciBhIGNvbGxlY3Rpb24uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJhc2UgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VFYWNoKGVhY2hGdW5jLCBmcm9tUmlnaHQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSB7XG4gICAgaWYgKGNvbGxlY3Rpb24gPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gICAgfVxuICAgIGlmICghaXNBcnJheUxpa2UoY29sbGVjdGlvbikpIHtcbiAgICAgIHJldHVybiBlYWNoRnVuYyhjb2xsZWN0aW9uLCBpdGVyYXRlZSk7XG4gICAgfVxuICAgIHZhciBsZW5ndGggPSBjb2xsZWN0aW9uLmxlbmd0aCxcbiAgICAgICAgaW5kZXggPSBmcm9tUmlnaHQgPyBsZW5ndGggOiAtMSxcbiAgICAgICAgaXRlcmFibGUgPSBPYmplY3QoY29sbGVjdGlvbik7XG5cbiAgICB3aGlsZSAoKGZyb21SaWdodCA/IGluZGV4LS0gOiArK2luZGV4IDwgbGVuZ3RoKSkge1xuICAgICAgaWYgKGl0ZXJhdGVlKGl0ZXJhYmxlW2luZGV4XSwgaW5kZXgsIGl0ZXJhYmxlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJhc2VFYWNoO1xuIiwiLyoqXG4gKiBDcmVhdGVzIGEgYmFzZSBmdW5jdGlvbiBmb3IgbWV0aG9kcyBsaWtlIGBfLmZvckluYCBhbmQgYF8uZm9yT3duYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBiYXNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVCYXNlRm9yKGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0LCBpdGVyYXRlZSwga2V5c0Z1bmMpIHtcbiAgICB2YXIgaW5kZXggPSAtMSxcbiAgICAgICAgaXRlcmFibGUgPSBPYmplY3Qob2JqZWN0KSxcbiAgICAgICAgcHJvcHMgPSBrZXlzRnVuYyhvYmplY3QpLFxuICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICAgIHZhciBrZXkgPSBwcm9wc1tmcm9tUmlnaHQgPyBsZW5ndGggOiArK2luZGV4XTtcbiAgICAgIGlmIChpdGVyYXRlZShpdGVyYWJsZVtrZXldLCBrZXksIGl0ZXJhYmxlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmFzZUZvcjtcbiIsInZhciBiYXNlSXRlcmF0ZWUgPSByZXF1aXJlKCcuL19iYXNlSXRlcmF0ZWUnKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGBfLmZpbmRgIG9yIGBfLmZpbmRMYXN0YCBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZmluZEluZGV4RnVuYyBUaGUgZnVuY3Rpb24gdG8gZmluZCB0aGUgY29sbGVjdGlvbiBpbmRleC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZpbmQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUZpbmQoZmluZEluZGV4RnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24oY29sbGVjdGlvbiwgcHJlZGljYXRlLCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgaXRlcmFibGUgPSBPYmplY3QoY29sbGVjdGlvbik7XG4gICAgaWYgKCFpc0FycmF5TGlrZShjb2xsZWN0aW9uKSkge1xuICAgICAgdmFyIGl0ZXJhdGVlID0gYmFzZUl0ZXJhdGVlKHByZWRpY2F0ZSwgMyk7XG4gICAgICBjb2xsZWN0aW9uID0ga2V5cyhjb2xsZWN0aW9uKTtcbiAgICAgIHByZWRpY2F0ZSA9IGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gaXRlcmF0ZWUoaXRlcmFibGVba2V5XSwga2V5LCBpdGVyYWJsZSk7IH07XG4gICAgfVxuICAgIHZhciBpbmRleCA9IGZpbmRJbmRleEZ1bmMoY29sbGVjdGlvbiwgcHJlZGljYXRlLCBmcm9tSW5kZXgpO1xuICAgIHJldHVybiBpbmRleCA+IC0xID8gaXRlcmFibGVbaXRlcmF0ZWUgPyBjb2xsZWN0aW9uW2luZGV4XSA6IGluZGV4XSA6IHVuZGVmaW5lZDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVGaW5kO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpO1xuXG52YXIgZGVmaW5lUHJvcGVydHkgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgdmFyIGZ1bmMgPSBnZXROYXRpdmUoT2JqZWN0LCAnZGVmaW5lUHJvcGVydHknKTtcbiAgICBmdW5jKHt9LCAnJywge30pO1xuICAgIHJldHVybiBmdW5jO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZpbmVQcm9wZXJ0eTtcbiIsInZhciBTZXRDYWNoZSA9IHJlcXVpcmUoJy4vX1NldENhY2hlJyksXG4gICAgYXJyYXlTb21lID0gcmVxdWlyZSgnLi9fYXJyYXlTb21lJyksXG4gICAgY2FjaGVIYXMgPSByZXF1aXJlKCcuL19jYWNoZUhhcycpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB2YWx1ZSBjb21wYXJpc29ucy4gKi9cbnZhciBDT01QQVJFX1BBUlRJQUxfRkxBRyA9IDEsXG4gICAgQ09NUEFSRV9VTk9SREVSRURfRkxBRyA9IDI7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBhcnJheXMgd2l0aCBzdXBwb3J0IGZvclxuICogcGFydGlhbCBkZWVwIGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7QXJyYXl9IG90aGVyIFRoZSBvdGhlciBhcnJheSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhY2sgVHJhY2tzIHRyYXZlcnNlZCBgYXJyYXlgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFycmF5cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbEFycmF5cyhhcnJheSwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRyxcbiAgICAgIGFyckxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIG90aExlbmd0aCA9IG90aGVyLmxlbmd0aDtcblxuICBpZiAoYXJyTGVuZ3RoICE9IG90aExlbmd0aCAmJiAhKGlzUGFydGlhbCAmJiBvdGhMZW5ndGggPiBhcnJMZW5ndGgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIEFzc3VtZSBjeWNsaWMgdmFsdWVzIGFyZSBlcXVhbC5cbiAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQoYXJyYXkpO1xuICBpZiAoc3RhY2tlZCAmJiBzdGFjay5nZXQob3RoZXIpKSB7XG4gICAgcmV0dXJuIHN0YWNrZWQgPT0gb3RoZXI7XG4gIH1cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSB0cnVlLFxuICAgICAgc2VlbiA9IChiaXRtYXNrICYgQ09NUEFSRV9VTk9SREVSRURfRkxBRykgPyBuZXcgU2V0Q2FjaGUgOiB1bmRlZmluZWQ7XG5cbiAgc3RhY2suc2V0KGFycmF5LCBvdGhlcik7XG4gIHN0YWNrLnNldChvdGhlciwgYXJyYXkpO1xuXG4gIC8vIElnbm9yZSBub24taW5kZXggcHJvcGVydGllcy5cbiAgd2hpbGUgKCsraW5kZXggPCBhcnJMZW5ndGgpIHtcbiAgICB2YXIgYXJyVmFsdWUgPSBhcnJheVtpbmRleF0sXG4gICAgICAgIG90aFZhbHVlID0gb3RoZXJbaW5kZXhdO1xuXG4gICAgaWYgKGN1c3RvbWl6ZXIpIHtcbiAgICAgIHZhciBjb21wYXJlZCA9IGlzUGFydGlhbFxuICAgICAgICA/IGN1c3RvbWl6ZXIob3RoVmFsdWUsIGFyclZhbHVlLCBpbmRleCwgb3RoZXIsIGFycmF5LCBzdGFjaylcbiAgICAgICAgOiBjdXN0b21pemVyKGFyclZhbHVlLCBvdGhWYWx1ZSwgaW5kZXgsIGFycmF5LCBvdGhlciwgc3RhY2spO1xuICAgIH1cbiAgICBpZiAoY29tcGFyZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKGNvbXBhcmVkKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBhcnJheXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICBpZiAoc2Vlbikge1xuICAgICAgaWYgKCFhcnJheVNvbWUob3RoZXIsIGZ1bmN0aW9uKG90aFZhbHVlLCBvdGhJbmRleCkge1xuICAgICAgICAgICAgaWYgKCFjYWNoZUhhcyhzZWVuLCBvdGhJbmRleCkgJiZcbiAgICAgICAgICAgICAgICAoYXJyVmFsdWUgPT09IG90aFZhbHVlIHx8IGVxdWFsRnVuYyhhcnJWYWx1ZSwgb3RoVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKSkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNlZW4ucHVzaChvdGhJbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkpIHtcbiAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIShcbiAgICAgICAgICBhcnJWYWx1ZSA9PT0gb3RoVmFsdWUgfHxcbiAgICAgICAgICAgIGVxdWFsRnVuYyhhcnJWYWx1ZSwgb3RoVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKVxuICAgICAgICApKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBzdGFja1snZGVsZXRlJ10oYXJyYXkpO1xuICBzdGFja1snZGVsZXRlJ10ob3RoZXIpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxdWFsQXJyYXlzO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIFVpbnQ4QXJyYXkgPSByZXF1aXJlKCcuL19VaW50OEFycmF5JyksXG4gICAgZXEgPSByZXF1aXJlKCcuL2VxJyksXG4gICAgZXF1YWxBcnJheXMgPSByZXF1aXJlKCcuL19lcXVhbEFycmF5cycpLFxuICAgIG1hcFRvQXJyYXkgPSByZXF1aXJlKCcuL19tYXBUb0FycmF5JyksXG4gICAgc2V0VG9BcnJheSA9IHJlcXVpcmUoJy4vX3NldFRvQXJyYXknKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgdmFsdWUgY29tcGFyaXNvbnMuICovXG52YXIgQ09NUEFSRV9QQVJUSUFMX0ZMQUcgPSAxLFxuICAgIENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcgPSAyO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XSc7XG5cbi8qKiBVc2VkIHRvIGNvbnZlcnQgc3ltYm9scyB0byBwcmltaXRpdmVzIGFuZCBzdHJpbmdzLiAqL1xudmFyIHN5bWJvbFByb3RvID0gU3ltYm9sID8gU3ltYm9sLnByb3RvdHlwZSA6IHVuZGVmaW5lZCxcbiAgICBzeW1ib2xWYWx1ZU9mID0gc3ltYm9sUHJvdG8gPyBzeW1ib2xQcm90by52YWx1ZU9mIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3IgY29tcGFyaW5nIG9iamVjdHMgb2ZcbiAqIHRoZSBzYW1lIGB0b1N0cmluZ1RhZ2AuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gb25seSBzdXBwb3J0cyBjb21wYXJpbmcgdmFsdWVzIHdpdGggdGFncyBvZlxuICogYEJvb2xlYW5gLCBgRGF0ZWAsIGBFcnJvcmAsIGBOdW1iZXJgLCBgUmVnRXhwYCwgb3IgYFN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0YWcgVGhlIGB0b1N0cmluZ1RhZ2Agb2YgdGhlIG9iamVjdHMgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbEJ5VGFnKG9iamVjdCwgb3RoZXIsIHRhZywgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaykge1xuICBzd2l0Y2ggKHRhZykge1xuICAgIGNhc2UgZGF0YVZpZXdUYWc6XG4gICAgICBpZiAoKG9iamVjdC5ieXRlTGVuZ3RoICE9IG90aGVyLmJ5dGVMZW5ndGgpIHx8XG4gICAgICAgICAgKG9iamVjdC5ieXRlT2Zmc2V0ICE9IG90aGVyLmJ5dGVPZmZzZXQpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIG9iamVjdCA9IG9iamVjdC5idWZmZXI7XG4gICAgICBvdGhlciA9IG90aGVyLmJ1ZmZlcjtcblxuICAgIGNhc2UgYXJyYXlCdWZmZXJUYWc6XG4gICAgICBpZiAoKG9iamVjdC5ieXRlTGVuZ3RoICE9IG90aGVyLmJ5dGVMZW5ndGgpIHx8XG4gICAgICAgICAgIWVxdWFsRnVuYyhuZXcgVWludDhBcnJheShvYmplY3QpLCBuZXcgVWludDhBcnJheShvdGhlcikpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgY2FzZSBib29sVGFnOlxuICAgIGNhc2UgZGF0ZVRhZzpcbiAgICBjYXNlIG51bWJlclRhZzpcbiAgICAgIC8vIENvZXJjZSBib29sZWFucyB0byBgMWAgb3IgYDBgIGFuZCBkYXRlcyB0byBtaWxsaXNlY29uZHMuXG4gICAgICAvLyBJbnZhbGlkIGRhdGVzIGFyZSBjb2VyY2VkIHRvIGBOYU5gLlxuICAgICAgcmV0dXJuIGVxKCtvYmplY3QsICtvdGhlcik7XG5cbiAgICBjYXNlIGVycm9yVGFnOlxuICAgICAgcmV0dXJuIG9iamVjdC5uYW1lID09IG90aGVyLm5hbWUgJiYgb2JqZWN0Lm1lc3NhZ2UgPT0gb3RoZXIubWVzc2FnZTtcblxuICAgIGNhc2UgcmVnZXhwVGFnOlxuICAgIGNhc2Ugc3RyaW5nVGFnOlxuICAgICAgLy8gQ29lcmNlIHJlZ2V4ZXMgdG8gc3RyaW5ncyBhbmQgdHJlYXQgc3RyaW5ncywgcHJpbWl0aXZlcyBhbmQgb2JqZWN0cyxcbiAgICAgIC8vIGFzIGVxdWFsLiBTZWUgaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXJlZ2V4cC5wcm90b3R5cGUudG9zdHJpbmdcbiAgICAgIC8vIGZvciBtb3JlIGRldGFpbHMuXG4gICAgICByZXR1cm4gb2JqZWN0ID09IChvdGhlciArICcnKTtcblxuICAgIGNhc2UgbWFwVGFnOlxuICAgICAgdmFyIGNvbnZlcnQgPSBtYXBUb0FycmF5O1xuXG4gICAgY2FzZSBzZXRUYWc6XG4gICAgICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIENPTVBBUkVfUEFSVElBTF9GTEFHO1xuICAgICAgY29udmVydCB8fCAoY29udmVydCA9IHNldFRvQXJyYXkpO1xuXG4gICAgICBpZiAob2JqZWN0LnNpemUgIT0gb3RoZXIuc2l6ZSAmJiAhaXNQYXJ0aWFsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8vIEFzc3VtZSBjeWNsaWMgdmFsdWVzIGFyZSBlcXVhbC5cbiAgICAgIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KG9iamVjdCk7XG4gICAgICBpZiAoc3RhY2tlZCkge1xuICAgICAgICByZXR1cm4gc3RhY2tlZCA9PSBvdGhlcjtcbiAgICAgIH1cbiAgICAgIGJpdG1hc2sgfD0gQ09NUEFSRV9VTk9SREVSRURfRkxBRztcblxuICAgICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgICBzdGFjay5zZXQob2JqZWN0LCBvdGhlcik7XG4gICAgICB2YXIgcmVzdWx0ID0gZXF1YWxBcnJheXMoY29udmVydChvYmplY3QpLCBjb252ZXJ0KG90aGVyKSwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjayk7XG4gICAgICBzdGFja1snZGVsZXRlJ10ob2JqZWN0KTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG5cbiAgICBjYXNlIHN5bWJvbFRhZzpcbiAgICAgIGlmIChzeW1ib2xWYWx1ZU9mKSB7XG4gICAgICAgIHJldHVybiBzeW1ib2xWYWx1ZU9mLmNhbGwob2JqZWN0KSA9PSBzeW1ib2xWYWx1ZU9mLmNhbGwob3RoZXIpO1xuICAgICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlcXVhbEJ5VGFnO1xuIiwidmFyIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgdmFsdWUgY29tcGFyaXNvbnMuICovXG52YXIgQ09NUEFSRV9QQVJUSUFMX0ZMQUcgPSAxO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3Igb2JqZWN0cyB3aXRoIHN1cHBvcnQgZm9yXG4gKiBwYXJ0aWFsIGRlZXAgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbE9iamVjdHMob2JqZWN0LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaykge1xuICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIENPTVBBUkVfUEFSVElBTF9GTEFHLFxuICAgICAgb2JqUHJvcHMgPSBrZXlzKG9iamVjdCksXG4gICAgICBvYmpMZW5ndGggPSBvYmpQcm9wcy5sZW5ndGgsXG4gICAgICBvdGhQcm9wcyA9IGtleXMob3RoZXIpLFxuICAgICAgb3RoTGVuZ3RoID0gb3RoUHJvcHMubGVuZ3RoO1xuXG4gIGlmIChvYmpMZW5ndGggIT0gb3RoTGVuZ3RoICYmICFpc1BhcnRpYWwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGluZGV4ID0gb2JqTGVuZ3RoO1xuICB3aGlsZSAoaW5kZXgtLSkge1xuICAgIHZhciBrZXkgPSBvYmpQcm9wc1tpbmRleF07XG4gICAgaWYgKCEoaXNQYXJ0aWFsID8ga2V5IGluIG90aGVyIDogaGFzT3duUHJvcGVydHkuY2FsbChvdGhlciwga2V5KSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgLy8gQXNzdW1lIGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldChvYmplY3QpO1xuICBpZiAoc3RhY2tlZCAmJiBzdGFjay5nZXQob3RoZXIpKSB7XG4gICAgcmV0dXJuIHN0YWNrZWQgPT0gb3RoZXI7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IHRydWU7XG4gIHN0YWNrLnNldChvYmplY3QsIG90aGVyKTtcbiAgc3RhY2suc2V0KG90aGVyLCBvYmplY3QpO1xuXG4gIHZhciBza2lwQ3RvciA9IGlzUGFydGlhbDtcbiAgd2hpbGUgKCsraW5kZXggPCBvYmpMZW5ndGgpIHtcbiAgICBrZXkgPSBvYmpQcm9wc1tpbmRleF07XG4gICAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgIG90aFZhbHVlID0gb3RoZXJba2V5XTtcblxuICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICB2YXIgY29tcGFyZWQgPSBpc1BhcnRpYWxcbiAgICAgICAgPyBjdXN0b21pemVyKG90aFZhbHVlLCBvYmpWYWx1ZSwga2V5LCBvdGhlciwgb2JqZWN0LCBzdGFjaylcbiAgICAgICAgOiBjdXN0b21pemVyKG9ialZhbHVlLCBvdGhWYWx1ZSwga2V5LCBvYmplY3QsIG90aGVyLCBzdGFjayk7XG4gICAgfVxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGlmICghKGNvbXBhcmVkID09PSB1bmRlZmluZWRcbiAgICAgICAgICA/IChvYmpWYWx1ZSA9PT0gb3RoVmFsdWUgfHwgZXF1YWxGdW5jKG9ialZhbHVlLCBvdGhWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spKVxuICAgICAgICAgIDogY29tcGFyZWRcbiAgICAgICAgKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgc2tpcEN0b3IgfHwgKHNraXBDdG9yID0ga2V5ID09ICdjb25zdHJ1Y3RvcicpO1xuICB9XG4gIGlmIChyZXN1bHQgJiYgIXNraXBDdG9yKSB7XG4gICAgdmFyIG9iakN0b3IgPSBvYmplY3QuY29uc3RydWN0b3IsXG4gICAgICAgIG90aEN0b3IgPSBvdGhlci5jb25zdHJ1Y3RvcjtcblxuICAgIC8vIE5vbiBgT2JqZWN0YCBvYmplY3QgaW5zdGFuY2VzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWFsLlxuICAgIGlmIChvYmpDdG9yICE9IG90aEN0b3IgJiZcbiAgICAgICAgKCdjb25zdHJ1Y3RvcicgaW4gb2JqZWN0ICYmICdjb25zdHJ1Y3RvcicgaW4gb3RoZXIpICYmXG4gICAgICAgICEodHlwZW9mIG9iakN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBvYmpDdG9yIGluc3RhbmNlb2Ygb2JqQ3RvciAmJlxuICAgICAgICAgIHR5cGVvZiBvdGhDdG9yID09ICdmdW5jdGlvbicgJiYgb3RoQ3RvciBpbnN0YW5jZW9mIG90aEN0b3IpKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgc3RhY2tbJ2RlbGV0ZSddKG9iamVjdCk7XG4gIHN0YWNrWydkZWxldGUnXShvdGhlcik7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXF1YWxPYmplY3RzO1xuIiwidmFyIGZsYXR0ZW4gPSByZXF1aXJlKCcuL2ZsYXR0ZW4nKSxcbiAgICBvdmVyUmVzdCA9IHJlcXVpcmUoJy4vX292ZXJSZXN0JyksXG4gICAgc2V0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19zZXRUb1N0cmluZycpO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZVJlc3RgIHdoaWNoIGZsYXR0ZW5zIHRoZSByZXN0IGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGZsYXRSZXN0KGZ1bmMpIHtcbiAgcmV0dXJuIHNldFRvU3RyaW5nKG92ZXJSZXN0KGZ1bmMsIHVuZGVmaW5lZCwgZmxhdHRlbiksIGZ1bmMgKyAnJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmxhdFJlc3Q7XG4iLCIvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZyZWVHbG9iYWw7XG4iLCJ2YXIgaXNLZXlhYmxlID0gcmVxdWlyZSgnLi9faXNLZXlhYmxlJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgZGF0YSBmb3IgYG1hcGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIHJlZmVyZW5jZSBrZXkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWFwIGRhdGEuXG4gKi9cbmZ1bmN0aW9uIGdldE1hcERhdGEobWFwLCBrZXkpIHtcbiAgdmFyIGRhdGEgPSBtYXAuX19kYXRhX187XG4gIHJldHVybiBpc0tleWFibGUoa2V5KVxuICAgID8gZGF0YVt0eXBlb2Yga2V5ID09ICdzdHJpbmcnID8gJ3N0cmluZycgOiAnaGFzaCddXG4gICAgOiBkYXRhLm1hcDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRNYXBEYXRhO1xuIiwidmFyIGlzU3RyaWN0Q29tcGFyYWJsZSA9IHJlcXVpcmUoJy4vX2lzU3RyaWN0Q29tcGFyYWJsZScpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBwcm9wZXJ0eSBuYW1lcywgdmFsdWVzLCBhbmQgY29tcGFyZSBmbGFncyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBtYXRjaCBkYXRhIG9mIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBnZXRNYXRjaERhdGEob2JqZWN0KSB7XG4gIHZhciByZXN1bHQgPSBrZXlzKG9iamVjdCksXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIHZhciBrZXkgPSByZXN1bHRbbGVuZ3RoXSxcbiAgICAgICAgdmFsdWUgPSBvYmplY3Rba2V5XTtcblxuICAgIHJlc3VsdFtsZW5ndGhdID0gW2tleSwgdmFsdWUsIGlzU3RyaWN0Q29tcGFyYWJsZSh2YWx1ZSldO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TWF0Y2hEYXRhO1xuIiwidmFyIGJhc2VJc05hdGl2ZSA9IHJlcXVpcmUoJy4vX2Jhc2VJc05hdGl2ZScpLFxuICAgIGdldFZhbHVlID0gcmVxdWlyZSgnLi9fZ2V0VmFsdWUnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBuYXRpdmUgZnVuY3Rpb24gYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgbWV0aG9kIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBpZiBpdCdzIG5hdGl2ZSwgZWxzZSBgdW5kZWZpbmVkYC5cbiAqL1xuZnVuY3Rpb24gZ2V0TmF0aXZlKG9iamVjdCwga2V5KSB7XG4gIHZhciB2YWx1ZSA9IGdldFZhbHVlKG9iamVjdCwga2V5KTtcbiAgcmV0dXJuIGJhc2VJc05hdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXROYXRpdmU7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VHZXRUYWdgIHdoaWNoIGlnbm9yZXMgYFN5bWJvbC50b1N0cmluZ1RhZ2AgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHJhdyBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBnZXRSYXdUYWcodmFsdWUpIHtcbiAgdmFyIGlzT3duID0gaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgc3ltVG9TdHJpbmdUYWcpLFxuICAgICAgdGFnID0gdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuXG4gIHRyeSB7XG4gICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdW5kZWZpbmVkO1xuICAgIHZhciB1bm1hc2tlZCA9IHRydWU7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgdmFyIHJlc3VsdCA9IG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICBpZiAodW5tYXNrZWQpIHtcbiAgICBpZiAoaXNPd24pIHtcbiAgICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHRhZztcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRSYXdUYWc7XG4iLCJ2YXIgRGF0YVZpZXcgPSByZXF1aXJlKCcuL19EYXRhVmlldycpLFxuICAgIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpLFxuICAgIFByb21pc2UgPSByZXF1aXJlKCcuL19Qcm9taXNlJyksXG4gICAgU2V0ID0gcmVxdWlyZSgnLi9fU2V0JyksXG4gICAgV2Vha01hcCA9IHJlcXVpcmUoJy4vX1dlYWtNYXAnKSxcbiAgICBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIHRvU291cmNlID0gcmVxdWlyZSgnLi9fdG9Tb3VyY2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHByb21pc2VUYWcgPSAnW29iamVjdCBQcm9taXNlXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1hcHMsIHNldHMsIGFuZCB3ZWFrbWFwcy4gKi9cbnZhciBkYXRhVmlld0N0b3JTdHJpbmcgPSB0b1NvdXJjZShEYXRhVmlldyksXG4gICAgbWFwQ3RvclN0cmluZyA9IHRvU291cmNlKE1hcCksXG4gICAgcHJvbWlzZUN0b3JTdHJpbmcgPSB0b1NvdXJjZShQcm9taXNlKSxcbiAgICBzZXRDdG9yU3RyaW5nID0gdG9Tb3VyY2UoU2V0KSxcbiAgICB3ZWFrTWFwQ3RvclN0cmluZyA9IHRvU291cmNlKFdlYWtNYXApO1xuXG4vKipcbiAqIEdldHMgdGhlIGB0b1N0cmluZ1RhZ2Agb2YgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG52YXIgZ2V0VGFnID0gYmFzZUdldFRhZztcblxuLy8gRmFsbGJhY2sgZm9yIGRhdGEgdmlld3MsIG1hcHMsIHNldHMsIGFuZCB3ZWFrIG1hcHMgaW4gSUUgMTEgYW5kIHByb21pc2VzIGluIE5vZGUuanMgPCA2LlxuaWYgKChEYXRhVmlldyAmJiBnZXRUYWcobmV3IERhdGFWaWV3KG5ldyBBcnJheUJ1ZmZlcigxKSkpICE9IGRhdGFWaWV3VGFnKSB8fFxuICAgIChNYXAgJiYgZ2V0VGFnKG5ldyBNYXApICE9IG1hcFRhZykgfHxcbiAgICAoUHJvbWlzZSAmJiBnZXRUYWcoUHJvbWlzZS5yZXNvbHZlKCkpICE9IHByb21pc2VUYWcpIHx8XG4gICAgKFNldCAmJiBnZXRUYWcobmV3IFNldCkgIT0gc2V0VGFnKSB8fFxuICAgIChXZWFrTWFwICYmIGdldFRhZyhuZXcgV2Vha01hcCkgIT0gd2Vha01hcFRhZykpIHtcbiAgZ2V0VGFnID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YXIgcmVzdWx0ID0gYmFzZUdldFRhZyh2YWx1ZSksXG4gICAgICAgIEN0b3IgPSByZXN1bHQgPT0gb2JqZWN0VGFnID8gdmFsdWUuY29uc3RydWN0b3IgOiB1bmRlZmluZWQsXG4gICAgICAgIGN0b3JTdHJpbmcgPSBDdG9yID8gdG9Tb3VyY2UoQ3RvcikgOiAnJztcblxuICAgIGlmIChjdG9yU3RyaW5nKSB7XG4gICAgICBzd2l0Y2ggKGN0b3JTdHJpbmcpIHtcbiAgICAgICAgY2FzZSBkYXRhVmlld0N0b3JTdHJpbmc6IHJldHVybiBkYXRhVmlld1RhZztcbiAgICAgICAgY2FzZSBtYXBDdG9yU3RyaW5nOiByZXR1cm4gbWFwVGFnO1xuICAgICAgICBjYXNlIHByb21pc2VDdG9yU3RyaW5nOiByZXR1cm4gcHJvbWlzZVRhZztcbiAgICAgICAgY2FzZSBzZXRDdG9yU3RyaW5nOiByZXR1cm4gc2V0VGFnO1xuICAgICAgICBjYXNlIHdlYWtNYXBDdG9yU3RyaW5nOiByZXR1cm4gd2Vha01hcFRhZztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRUYWc7XG4iLCIvKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHByb3BlcnR5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBnZXRWYWx1ZShvYmplY3QsIGtleSkge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRWYWx1ZTtcbiIsInZhciBjYXN0UGF0aCA9IHJlcXVpcmUoJy4vX2Nhc3RQYXRoJyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL19pc0luZGV4JyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyksXG4gICAgdG9LZXkgPSByZXF1aXJlKCcuL190b0tleScpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgcGF0aGAgZXhpc3RzIG9uIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCB0byBjaGVjay5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGhhc0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGNoZWNrIHByb3BlcnRpZXMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHBhdGhgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNQYXRoKG9iamVjdCwgcGF0aCwgaGFzRnVuYykge1xuICBwYXRoID0gY2FzdFBhdGgocGF0aCwgb2JqZWN0KTtcblxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHBhdGgubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gZmFsc2U7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gdG9LZXkocGF0aFtpbmRleF0pO1xuICAgIGlmICghKHJlc3VsdCA9IG9iamVjdCAhPSBudWxsICYmIGhhc0Z1bmMob2JqZWN0LCBrZXkpKSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIG9iamVjdCA9IG9iamVjdFtrZXldO1xuICB9XG4gIGlmIChyZXN1bHQgfHwgKytpbmRleCAhPSBsZW5ndGgpIHtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGxlbmd0aCA9IG9iamVjdCA9PSBudWxsID8gMCA6IG9iamVjdC5sZW5ndGg7XG4gIHJldHVybiAhIWxlbmd0aCAmJiBpc0xlbmd0aChsZW5ndGgpICYmIGlzSW5kZXgoa2V5LCBsZW5ndGgpICYmXG4gICAgKGlzQXJyYXkob2JqZWN0KSB8fCBpc0FyZ3VtZW50cyhvYmplY3QpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNQYXRoO1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgSGFzaFxuICovXG5mdW5jdGlvbiBoYXNoQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuYXRpdmVDcmVhdGUgPyBuYXRpdmVDcmVhdGUobnVsbCkgOiB7fTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoQ2xlYXI7XG4iLCIvKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge09iamVjdH0gaGFzaCBUaGUgaGFzaCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaERlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IHRoaXMuaGFzKGtleSkgJiYgZGVsZXRlIHRoaXMuX19kYXRhX19ba2V5XTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hEZWxldGU7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi9cbnZhciBIQVNIX1VOREVGSU5FRCA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBHZXRzIHRoZSBoYXNoIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGhhc2hHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKG5hdGl2ZUNyZWF0ZSkge1xuICAgIHZhciByZXN1bHQgPSBkYXRhW2tleV07XG4gICAgcmV0dXJuIHJlc3VsdCA9PT0gSEFTSF9VTkRFRklORUQgPyB1bmRlZmluZWQgOiByZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KSA/IGRhdGFba2V5XSA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoR2V0O1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIGhhc2ggdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hIYXMoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgcmV0dXJuIG5hdGl2ZUNyZWF0ZSA/IGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkIDogaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hIYXM7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi9cbnZhciBIQVNIX1VOREVGSU5FRCA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJztcblxuLyoqXG4gKiBTZXRzIHRoZSBoYXNoIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaGFzaCBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gaGFzaFNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgdGhpcy5zaXplICs9IHRoaXMuaGFzKGtleSkgPyAwIDogMTtcbiAgZGF0YVtrZXldID0gKG5hdGl2ZUNyZWF0ZSAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkKSA/IEhBU0hfVU5ERUZJTkVEIDogdmFsdWU7XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hTZXQ7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzcHJlYWRhYmxlU3ltYm9sID0gU3ltYm9sID8gU3ltYm9sLmlzQ29uY2F0U3ByZWFkYWJsZSA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGZsYXR0ZW5hYmxlIGBhcmd1bWVudHNgIG9iamVjdCBvciBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBmbGF0dGVuYWJsZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0ZsYXR0ZW5hYmxlKHZhbHVlKSB7XG4gIHJldHVybiBpc0FycmF5KHZhbHVlKSB8fCBpc0FyZ3VtZW50cyh2YWx1ZSkgfHxcbiAgICAhIShzcHJlYWRhYmxlU3ltYm9sICYmIHZhbHVlICYmIHZhbHVlW3NwcmVhZGFibGVTeW1ib2xdKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0ZsYXR0ZW5hYmxlO1xuIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eKD86MHxbMS05XVxcZCopJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcbiAgcmV0dXJuICEhbGVuZ3RoICYmXG4gICAgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fCByZUlzVWludC50ZXN0KHZhbHVlKSkgJiZcbiAgICAodmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNJbmRleDtcbiIsInZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIHByb3BlcnR5IG5hbWVzIHdpdGhpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZUlzRGVlcFByb3AgPSAvXFwufFxcWyg/OlteW1xcXV0qfChbXCInXSkoPzooPyFcXDEpW15cXFxcXXxcXFxcLikqP1xcMSlcXF0vLFxuICAgIHJlSXNQbGFpblByb3AgPSAvXlxcdyokLztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHByb3BlcnR5IG5hbWUgYW5kIG5vdCBhIHByb3BlcnR5IHBhdGguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkga2V5cyBvbi5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcHJvcGVydHkgbmFtZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0tleSh2YWx1ZSwgb2JqZWN0KSB7XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgaWYgKHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnc3ltYm9sJyB8fCB0eXBlID09ICdib29sZWFuJyB8fFxuICAgICAgdmFsdWUgPT0gbnVsbCB8fCBpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gcmVJc1BsYWluUHJvcC50ZXN0KHZhbHVlKSB8fCAhcmVJc0RlZXBQcm9wLnRlc3QodmFsdWUpIHx8XG4gICAgKG9iamVjdCAhPSBudWxsICYmIHZhbHVlIGluIE9iamVjdChvYmplY3QpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0tleTtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUgZm9yIHVzZSBhcyB1bmlxdWUgb2JqZWN0IGtleS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0tleWFibGUodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAodHlwZSA9PSAnc3RyaW5nJyB8fCB0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicpXG4gICAgPyAodmFsdWUgIT09ICdfX3Byb3RvX18nKVxuICAgIDogKHZhbHVlID09PSBudWxsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0tleWFibGU7XG4iLCJ2YXIgY29yZUpzRGF0YSA9IHJlcXVpcmUoJy4vX2NvcmVKc0RhdGEnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1ldGhvZHMgbWFzcXVlcmFkaW5nIGFzIG5hdGl2ZS4gKi9cbnZhciBtYXNrU3JjS2V5ID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgdWlkID0gL1teLl0rJC8uZXhlYyhjb3JlSnNEYXRhICYmIGNvcmVKc0RhdGEua2V5cyAmJiBjb3JlSnNEYXRhLmtleXMuSUVfUFJPVE8gfHwgJycpO1xuICByZXR1cm4gdWlkID8gKCdTeW1ib2woc3JjKV8xLicgKyB1aWQpIDogJyc7XG59KCkpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgZnVuY2AgaGFzIGl0cyBzb3VyY2UgbWFza2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgZnVuY2AgaXMgbWFza2VkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTWFza2VkKGZ1bmMpIHtcbiAgcmV0dXJuICEhbWFza1NyY0tleSAmJiAobWFza1NyY0tleSBpbiBmdW5jKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc01hc2tlZDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGEgcHJvdG90eXBlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3RvdHlwZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1Byb3RvdHlwZSh2YWx1ZSkge1xuICB2YXIgQ3RvciA9IHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yLFxuICAgICAgcHJvdG8gPSAodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSkgfHwgb2JqZWN0UHJvdG87XG5cbiAgcmV0dXJuIHZhbHVlID09PSBwcm90bztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1Byb3RvdHlwZTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSBmb3Igc3RyaWN0IGVxdWFsaXR5IGNvbXBhcmlzb25zLCBpLmUuIGA9PT1gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlmIHN1aXRhYmxlIGZvciBzdHJpY3RcbiAqICBlcXVhbGl0eSBjb21wYXJpc29ucywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1N0cmljdENvbXBhcmFibGUodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZSAmJiAhaXNPYmplY3QodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3RyaWN0Q29tcGFyYWJsZTtcbiIsIi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBbXTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVDbGVhcjtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgbGFzdEluZGV4ID0gZGF0YS5sZW5ndGggLSAxO1xuICBpZiAoaW5kZXggPT0gbGFzdEluZGV4KSB7XG4gICAgZGF0YS5wb3AoKTtcbiAgfSBlbHNlIHtcbiAgICBzcGxpY2UuY2FsbChkYXRhLCBpbmRleCwgMSk7XG4gIH1cbiAgLS10aGlzLnNpemU7XG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZURlbGV0ZTtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIHJldHVybiBpbmRleCA8IDAgPyB1bmRlZmluZWQgOiBkYXRhW2luZGV4XVsxXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVHZXQ7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBhc3NvY0luZGV4T2YodGhpcy5fX2RhdGFfXywga2V5KSA+IC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZUhhcztcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqXG4gKiBTZXRzIHRoZSBsaXN0IGNhY2hlIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBsaXN0IGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICArK3RoaXMuc2l6ZTtcbiAgICBkYXRhLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgfSBlbHNlIHtcbiAgICBkYXRhW2luZGV4XVsxXSA9IHZhbHVlO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZVNldDtcbiIsInZhciBIYXNoID0gcmVxdWlyZSgnLi9fSGFzaCcpLFxuICAgIExpc3RDYWNoZSA9IHJlcXVpcmUoJy4vX0xpc3RDYWNoZScpLFxuICAgIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUNsZWFyKCkge1xuICB0aGlzLnNpemUgPSAwO1xuICB0aGlzLl9fZGF0YV9fID0ge1xuICAgICdoYXNoJzogbmV3IEhhc2gsXG4gICAgJ21hcCc6IG5ldyAoTWFwIHx8IExpc3RDYWNoZSksXG4gICAgJ3N0cmluZyc6IG5ldyBIYXNoXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVDbGVhcjtcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSlbJ2RlbGV0ZSddKGtleSk7XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZURlbGV0ZTtcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG1hcCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVHZXQoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuZ2V0KGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVHZXQ7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBtYXAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5oYXMoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZUhhcztcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIFNldHMgdGhlIG1hcCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBtYXAgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSksXG4gICAgICBzaXplID0gZGF0YS5zaXplO1xuXG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgKz0gZGF0YS5zaXplID09IHNpemUgPyAwIDogMTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVTZXQ7XG4iLCIvKipcbiAqIENvbnZlcnRzIGBtYXBgIHRvIGl0cyBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBrZXktdmFsdWUgcGFpcnMuXG4gKi9cbmZ1bmN0aW9uIG1hcFRvQXJyYXkobWFwKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobWFwLnNpemUpO1xuXG4gIG1hcC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICByZXN1bHRbKytpbmRleF0gPSBba2V5LCB2YWx1ZV07XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcFRvQXJyYXk7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgbWF0Y2hlc1Byb3BlcnR5YCBmb3Igc291cmNlIHZhbHVlcyBzdWl0YWJsZVxuICogZm9yIHN0cmljdCBlcXVhbGl0eSBjb21wYXJpc29ucywgaS5lLiBgPT09YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcGFyYW0geyp9IHNyY1ZhbHVlIFRoZSB2YWx1ZSB0byBtYXRjaC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNwZWMgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG1hdGNoZXNTdHJpY3RDb21wYXJhYmxlKGtleSwgc3JjVmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0W2tleV0gPT09IHNyY1ZhbHVlICYmXG4gICAgICAoc3JjVmFsdWUgIT09IHVuZGVmaW5lZCB8fCAoa2V5IGluIE9iamVjdChvYmplY3QpKSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWF0Y2hlc1N0cmljdENvbXBhcmFibGU7XG4iLCJ2YXIgbWVtb2l6ZSA9IHJlcXVpcmUoJy4vbWVtb2l6ZScpO1xuXG4vKiogVXNlZCBhcyB0aGUgbWF4aW11bSBtZW1vaXplIGNhY2hlIHNpemUuICovXG52YXIgTUFYX01FTU9JWkVfU0laRSA9IDUwMDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8ubWVtb2l6ZWAgd2hpY2ggY2xlYXJzIHRoZSBtZW1vaXplZCBmdW5jdGlvbidzXG4gKiBjYWNoZSB3aGVuIGl0IGV4Y2VlZHMgYE1BWF9NRU1PSVpFX1NJWkVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBoYXZlIGl0cyBvdXRwdXQgbWVtb2l6ZWQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBtZW1vaXplZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gbWVtb2l6ZUNhcHBlZChmdW5jKSB7XG4gIHZhciByZXN1bHQgPSBtZW1vaXplKGZ1bmMsIGZ1bmN0aW9uKGtleSkge1xuICAgIGlmIChjYWNoZS5zaXplID09PSBNQVhfTUVNT0laRV9TSVpFKSB7XG4gICAgICBjYWNoZS5jbGVhcigpO1xuICAgIH1cbiAgICByZXR1cm4ga2V5O1xuICB9KTtcblxuICB2YXIgY2FjaGUgPSByZXN1bHQuY2FjaGU7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWVtb2l6ZUNhcHBlZDtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIG5hdGl2ZUNyZWF0ZSA9IGdldE5hdGl2ZShPYmplY3QsICdjcmVhdGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBuYXRpdmVDcmVhdGU7XG4iLCJ2YXIgb3ZlckFyZyA9IHJlcXVpcmUoJy4vX292ZXJBcmcnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZUtleXMgPSBvdmVyQXJnKE9iamVjdC5rZXlzLCBPYmplY3QpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdGl2ZUtleXM7XG4iLCJ2YXIgZnJlZUdsb2JhbCA9IHJlcXVpcmUoJy4vX2ZyZWVHbG9iYWwnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHByb2Nlc3NgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlUHJvY2VzcyA9IG1vZHVsZUV4cG9ydHMgJiYgZnJlZUdsb2JhbC5wcm9jZXNzO1xuXG4vKiogVXNlZCB0byBhY2Nlc3MgZmFzdGVyIE5vZGUuanMgaGVscGVycy4gKi9cbnZhciBub2RlVXRpbCA9IChmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZnJlZVByb2Nlc3MgJiYgZnJlZVByb2Nlc3MuYmluZGluZyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nKCd1dGlsJyk7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGVVdGlsO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb2JqZWN0VG9TdHJpbmc7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSB1bmFyeSBmdW5jdGlvbiB0aGF0IGludm9rZXMgYGZ1bmNgIHdpdGggaXRzIGFyZ3VtZW50IHRyYW5zZm9ybWVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSBhcmd1bWVudCB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlckFyZyhmdW5jLCB0cmFuc2Zvcm0pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBmdW5jKHRyYW5zZm9ybShhcmcpKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvdmVyQXJnO1xuIiwidmFyIGFwcGx5ID0gcmVxdWlyZSgnLi9fYXBwbHknKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZVJlc3RgIHdoaWNoIHRyYW5zZm9ybXMgdGhlIHJlc3QgYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PWZ1bmMubGVuZ3RoLTFdIFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcmVzdCBwYXJhbWV0ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIHJlc3QgYXJyYXkgdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG92ZXJSZXN0KGZ1bmMsIHN0YXJ0LCB0cmFuc2Zvcm0pIHtcbiAgc3RhcnQgPSBuYXRpdmVNYXgoc3RhcnQgPT09IHVuZGVmaW5lZCA/IChmdW5jLmxlbmd0aCAtIDEpIDogc3RhcnQsIDApO1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IG5hdGl2ZU1heChhcmdzLmxlbmd0aCAtIHN0YXJ0LCAwKSxcbiAgICAgICAgYXJyYXkgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIGFycmF5W2luZGV4XSA9IGFyZ3Nbc3RhcnQgKyBpbmRleF07XG4gICAgfVxuICAgIGluZGV4ID0gLTE7XG4gICAgdmFyIG90aGVyQXJncyA9IEFycmF5KHN0YXJ0ICsgMSk7XG4gICAgd2hpbGUgKCsraW5kZXggPCBzdGFydCkge1xuICAgICAgb3RoZXJBcmdzW2luZGV4XSA9IGFyZ3NbaW5kZXhdO1xuICAgIH1cbiAgICBvdGhlckFyZ3Nbc3RhcnRdID0gdHJhbnNmb3JtKGFycmF5KTtcbiAgICByZXR1cm4gYXBwbHkoZnVuYywgdGhpcywgb3RoZXJBcmdzKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvdmVyUmVzdDtcbiIsInZhciBmcmVlR2xvYmFsID0gcmVxdWlyZSgnLi9fZnJlZUdsb2JhbCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gcm9vdDtcbiIsIi8qKiBVc2VkIHRvIHN0YW5kLWluIGZvciBgdW5kZWZpbmVkYCBoYXNoIHZhbHVlcy4gKi9cbnZhciBIQVNIX1VOREVGSU5FRCA9ICdfX2xvZGFzaF9oYXNoX3VuZGVmaW5lZF9fJztcblxuLyoqXG4gKiBBZGRzIGB2YWx1ZWAgdG8gdGhlIGFycmF5IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBhZGRcbiAqIEBtZW1iZXJPZiBTZXRDYWNoZVxuICogQGFsaWFzIHB1c2hcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNhY2hlLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIHNldENhY2hlQWRkKHZhbHVlKSB7XG4gIHRoaXMuX19kYXRhX18uc2V0KHZhbHVlLCBIQVNIX1VOREVGSU5FRCk7XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldENhY2hlQWRkO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBpbiB0aGUgYXJyYXkgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIFNldENhY2hlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBmb3VuZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzZXRDYWNoZUhhcyh2YWx1ZSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXModmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldENhY2hlSGFzO1xuIiwiLyoqXG4gKiBDb252ZXJ0cyBgc2V0YCB0byBhbiBhcnJheSBvZiBpdHMgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc2V0IFRoZSBzZXQgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgdmFsdWVzLlxuICovXG5mdW5jdGlvbiBzZXRUb0FycmF5KHNldCkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KHNldC5zaXplKTtcblxuICBzZXQuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJlc3VsdFsrK2luZGV4XSA9IHZhbHVlO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXRUb0FycmF5O1xuIiwidmFyIGJhc2VTZXRUb1N0cmluZyA9IHJlcXVpcmUoJy4vX2Jhc2VTZXRUb1N0cmluZycpLFxuICAgIHNob3J0T3V0ID0gcmVxdWlyZSgnLi9fc2hvcnRPdXQnKTtcblxuLyoqXG4gKiBTZXRzIHRoZSBgdG9TdHJpbmdgIG1ldGhvZCBvZiBgZnVuY2AgdG8gcmV0dXJuIGBzdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmcgVGhlIGB0b1N0cmluZ2AgcmVzdWx0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cbiAqL1xudmFyIHNldFRvU3RyaW5nID0gc2hvcnRPdXQoYmFzZVNldFRvU3RyaW5nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBzZXRUb1N0cmluZztcbiIsIi8qKiBVc2VkIHRvIGRldGVjdCBob3QgZnVuY3Rpb25zIGJ5IG51bWJlciBvZiBjYWxscyB3aXRoaW4gYSBzcGFuIG9mIG1pbGxpc2Vjb25kcy4gKi9cbnZhciBIT1RfQ09VTlQgPSA4MDAsXG4gICAgSE9UX1NQQU4gPSAxNjtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU5vdyA9IERhdGUubm93O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0J2xsIHNob3J0IG91dCBhbmQgaW52b2tlIGBpZGVudGl0eWAgaW5zdGVhZFxuICogb2YgYGZ1bmNgIHdoZW4gaXQncyBjYWxsZWQgYEhPVF9DT1VOVGAgb3IgbW9yZSB0aW1lcyBpbiBgSE9UX1NQQU5gXG4gKiBtaWxsaXNlY29uZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHJlc3RyaWN0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc2hvcnRhYmxlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBzaG9ydE91dChmdW5jKSB7XG4gIHZhciBjb3VudCA9IDAsXG4gICAgICBsYXN0Q2FsbGVkID0gMDtcblxuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0YW1wID0gbmF0aXZlTm93KCksXG4gICAgICAgIHJlbWFpbmluZyA9IEhPVF9TUEFOIC0gKHN0YW1wIC0gbGFzdENhbGxlZCk7XG5cbiAgICBsYXN0Q2FsbGVkID0gc3RhbXA7XG4gICAgaWYgKHJlbWFpbmluZyA+IDApIHtcbiAgICAgIGlmICgrK2NvdW50ID49IEhPVF9DT1VOVCkge1xuICAgICAgICByZXR1cm4gYXJndW1lbnRzWzBdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb3VudCA9IDA7XG4gICAgfVxuICAgIHJldHVybiBmdW5jLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaG9ydE91dDtcbiIsInZhciBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBzdGFjay5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBTdGFja1xuICovXG5mdW5jdGlvbiBzdGFja0NsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gbmV3IExpc3RDYWNoZTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0NsZWFyO1xuIiwiLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIHJlc3VsdCA9IGRhdGFbJ2RlbGV0ZSddKGtleSk7XG5cbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrRGVsZXRlO1xuIiwiLyoqXG4gKiBHZXRzIHRoZSBzdGFjayB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tHZXQoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmdldChrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrR2V0O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYSBzdGFjayB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrSGFzKGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXMoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0hhcztcbiIsInZhciBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKSxcbiAgICBNYXAgPSByZXF1aXJlKCcuL19NYXAnKSxcbiAgICBNYXBDYWNoZSA9IHJlcXVpcmUoJy4vX01hcENhY2hlJyk7XG5cbi8qKiBVc2VkIGFzIHRoZSBzaXplIHRvIGVuYWJsZSBsYXJnZSBhcnJheSBvcHRpbWl6YXRpb25zLiAqL1xudmFyIExBUkdFX0FSUkFZX1NJWkUgPSAyMDA7XG5cbi8qKlxuICogU2V0cyB0aGUgc3RhY2sgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgc3RhY2sgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAoZGF0YSBpbnN0YW5jZW9mIExpc3RDYWNoZSkge1xuICAgIHZhciBwYWlycyA9IGRhdGEuX19kYXRhX187XG4gICAgaWYgKCFNYXAgfHwgKHBhaXJzLmxlbmd0aCA8IExBUkdFX0FSUkFZX1NJWkUgLSAxKSkge1xuICAgICAgcGFpcnMucHVzaChba2V5LCB2YWx1ZV0pO1xuICAgICAgdGhpcy5zaXplID0gKytkYXRhLnNpemU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTWFwQ2FjaGUocGFpcnMpO1xuICB9XG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrU2V0O1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uaW5kZXhPZmAgd2hpY2ggcGVyZm9ybXMgc3RyaWN0IGVxdWFsaXR5XG4gKiBjb21wYXJpc29ucyBvZiB2YWx1ZXMsIGkuZS4gYD09PWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gc3RyaWN0SW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleCkge1xuICB2YXIgaW5kZXggPSBmcm9tSW5kZXggLSAxLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgaWYgKGFycmF5W2luZGV4XSA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0cmljdEluZGV4T2Y7XG4iLCJ2YXIgbWVtb2l6ZUNhcHBlZCA9IHJlcXVpcmUoJy4vX21lbW9pemVDYXBwZWQnKTtcblxuLyoqIFVzZWQgdG8gbWF0Y2ggcHJvcGVydHkgbmFtZXMgd2l0aGluIHByb3BlcnR5IHBhdGhzLiAqL1xudmFyIHJlTGVhZGluZ0RvdCA9IC9eXFwuLyxcbiAgICByZVByb3BOYW1lID0gL1teLltcXF1dK3xcXFsoPzooLT9cXGQrKD86XFwuXFxkKyk/KXwoW1wiJ10pKCg/Oig/IVxcMilbXlxcXFxdfFxcXFwuKSo/KVxcMilcXF18KD89KD86XFwufFxcW1xcXSkoPzpcXC58XFxbXFxdfCQpKS9nO1xuXG4vKiogVXNlZCB0byBtYXRjaCBiYWNrc2xhc2hlcyBpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZUVzY2FwZUNoYXIgPSAvXFxcXChcXFxcKT8vZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgc3RyaW5nYCB0byBhIHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICovXG52YXIgc3RyaW5nVG9QYXRoID0gbWVtb2l6ZUNhcHBlZChmdW5jdGlvbihzdHJpbmcpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBpZiAocmVMZWFkaW5nRG90LnRlc3Qoc3RyaW5nKSkge1xuICAgIHJlc3VsdC5wdXNoKCcnKTtcbiAgfVxuICBzdHJpbmcucmVwbGFjZShyZVByb3BOYW1lLCBmdW5jdGlvbihtYXRjaCwgbnVtYmVyLCBxdW90ZSwgc3RyaW5nKSB7XG4gICAgcmVzdWx0LnB1c2gocXVvdGUgPyBzdHJpbmcucmVwbGFjZShyZUVzY2FwZUNoYXIsICckMScpIDogKG51bWJlciB8fCBtYXRjaCkpO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0cmluZ1RvUGF0aDtcbiIsInZhciBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgSU5GSU5JVFkgPSAxIC8gMDtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIGtleSBpZiBpdCdzIG5vdCBhIHN0cmluZyBvciBzeW1ib2wuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7c3RyaW5nfHN5bWJvbH0gUmV0dXJucyB0aGUga2V5LlxuICovXG5mdW5jdGlvbiB0b0tleSh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnIHx8IGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICByZXR1cm4gKHJlc3VsdCA9PSAnMCcgJiYgKDEgLyB2YWx1ZSkgPT0gLUlORklOSVRZKSA/ICctMCcgOiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9LZXk7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENvbnZlcnRzIGBmdW5jYCB0byBpdHMgc291cmNlIGNvZGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzb3VyY2UgY29kZS5cbiAqL1xuZnVuY3Rpb24gdG9Tb3VyY2UoZnVuYykge1xuICBpZiAoZnVuYyAhPSBudWxsKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBmdW5jVG9TdHJpbmcuY2FsbChmdW5jKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKGZ1bmMgKyAnJyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9Tb3VyY2U7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYHZhbHVlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcmV0dXJuIGZyb20gdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNvbnN0YW50IGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0cyA9IF8udGltZXMoMiwgXy5jb25zdGFudCh7ICdhJzogMSB9KSk7XG4gKlxuICogY29uc29sZS5sb2cob2JqZWN0cyk7XG4gKiAvLyA9PiBbeyAnYSc6IDEgfSwgeyAnYSc6IDEgfV1cbiAqXG4gKiBjb25zb2xlLmxvZyhvYmplY3RzWzBdID09PSBvYmplY3RzWzFdKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gY29uc3RhbnQodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb25zdGFudDtcbiIsIi8qKlxuICogUGVyZm9ybXMgYVxuICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZSBlcXVpdmFsZW50LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKCdhJywgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKE5hTiwgTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gb3RoZXIgfHwgKHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxO1xuIiwidmFyIGFycmF5RmlsdGVyID0gcmVxdWlyZSgnLi9fYXJyYXlGaWx0ZXInKSxcbiAgICBiYXNlRmlsdGVyID0gcmVxdWlyZSgnLi9fYmFzZUZpbHRlcicpLFxuICAgIGJhc2VJdGVyYXRlZSA9IHJlcXVpcmUoJy4vX2Jhc2VJdGVyYXRlZScpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcblxuLyoqXG4gKiBJdGVyYXRlcyBvdmVyIGVsZW1lbnRzIG9mIGBjb2xsZWN0aW9uYCwgcmV0dXJuaW5nIGFuIGFycmF5IG9mIGFsbCBlbGVtZW50c1xuICogYHByZWRpY2F0ZWAgcmV0dXJucyB0cnV0aHkgZm9yLiBUaGUgcHJlZGljYXRlIGlzIGludm9rZWQgd2l0aCB0aHJlZVxuICogYXJndW1lbnRzOiAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gKlxuICogKipOb3RlOioqIFVubGlrZSBgXy5yZW1vdmVgLCB0aGlzIG1ldGhvZCByZXR1cm5zIGEgbmV3IGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcHJlZGljYXRlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBmaWx0ZXJlZCBhcnJheS5cbiAqIEBzZWUgXy5yZWplY3RcbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHVzZXJzID0gW1xuICogICB7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNiwgJ2FjdGl2ZSc6IHRydWUgfSxcbiAqICAgeyAndXNlcic6ICdmcmVkJywgICAnYWdlJzogNDAsICdhY3RpdmUnOiBmYWxzZSB9XG4gKiBdO1xuICpcbiAqIF8uZmlsdGVyKHVzZXJzLCBmdW5jdGlvbihvKSB7IHJldHVybiAhby5hY3RpdmU7IH0pO1xuICogLy8gPT4gb2JqZWN0cyBmb3IgWydmcmVkJ11cbiAqXG4gKiAvLyBUaGUgYF8ubWF0Y2hlc2AgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maWx0ZXIodXNlcnMsIHsgJ2FnZSc6IDM2LCAnYWN0aXZlJzogdHJ1ZSB9KTtcbiAqIC8vID0+IG9iamVjdHMgZm9yIFsnYmFybmV5J11cbiAqXG4gKiAvLyBUaGUgYF8ubWF0Y2hlc1Byb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gKiBfLmZpbHRlcih1c2VycywgWydhY3RpdmUnLCBmYWxzZV0pO1xuICogLy8gPT4gb2JqZWN0cyBmb3IgWydmcmVkJ11cbiAqXG4gKiAvLyBUaGUgYF8ucHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8uZmlsdGVyKHVzZXJzLCAnYWN0aXZlJyk7XG4gKiAvLyA9PiBvYmplY3RzIGZvciBbJ2Jhcm5leSddXG4gKi9cbmZ1bmN0aW9uIGZpbHRlcihjb2xsZWN0aW9uLCBwcmVkaWNhdGUpIHtcbiAgdmFyIGZ1bmMgPSBpc0FycmF5KGNvbGxlY3Rpb24pID8gYXJyYXlGaWx0ZXIgOiBiYXNlRmlsdGVyO1xuICByZXR1cm4gZnVuYyhjb2xsZWN0aW9uLCBiYXNlSXRlcmF0ZWUocHJlZGljYXRlLCAzKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmlsdGVyO1xuIiwidmFyIGNyZWF0ZUZpbmQgPSByZXF1aXJlKCcuL19jcmVhdGVGaW5kJyksXG4gICAgZmluZEluZGV4ID0gcmVxdWlyZSgnLi9maW5kSW5kZXgnKTtcblxuLyoqXG4gKiBJdGVyYXRlcyBvdmVyIGVsZW1lbnRzIG9mIGBjb2xsZWN0aW9uYCwgcmV0dXJuaW5nIHRoZSBmaXJzdCBlbGVtZW50XG4gKiBgcHJlZGljYXRlYCByZXR1cm5zIHRydXRoeSBmb3IuIFRoZSBwcmVkaWNhdGUgaXMgaW52b2tlZCB3aXRoIHRocmVlXG4gKiBhcmd1bWVudHM6ICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtwcmVkaWNhdGU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbZnJvbUluZGV4PTBdIFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBtYXRjaGVkIGVsZW1lbnQsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciB1c2VycyA9IFtcbiAqICAgeyAndXNlcic6ICdiYXJuZXknLCAgJ2FnZSc6IDM2LCAnYWN0aXZlJzogdHJ1ZSB9LFxuICogICB7ICd1c2VyJzogJ2ZyZWQnLCAgICAnYWdlJzogNDAsICdhY3RpdmUnOiBmYWxzZSB9LFxuICogICB7ICd1c2VyJzogJ3BlYmJsZXMnLCAnYWdlJzogMSwgICdhY3RpdmUnOiB0cnVlIH1cbiAqIF07XG4gKlxuICogXy5maW5kKHVzZXJzLCBmdW5jdGlvbihvKSB7IHJldHVybiBvLmFnZSA8IDQwOyB9KTtcbiAqIC8vID0+IG9iamVjdCBmb3IgJ2Jhcm5leSdcbiAqXG4gKiAvLyBUaGUgYF8ubWF0Y2hlc2AgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maW5kKHVzZXJzLCB7ICdhZ2UnOiAxLCAnYWN0aXZlJzogdHJ1ZSB9KTtcbiAqIC8vID0+IG9iamVjdCBmb3IgJ3BlYmJsZXMnXG4gKlxuICogLy8gVGhlIGBfLm1hdGNoZXNQcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maW5kKHVzZXJzLCBbJ2FjdGl2ZScsIGZhbHNlXSk7XG4gKiAvLyA9PiBvYmplY3QgZm9yICdmcmVkJ1xuICpcbiAqIC8vIFRoZSBgXy5wcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maW5kKHVzZXJzLCAnYWN0aXZlJyk7XG4gKiAvLyA9PiBvYmplY3QgZm9yICdiYXJuZXknXG4gKi9cbnZhciBmaW5kID0gY3JlYXRlRmluZChmaW5kSW5kZXgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmQ7XG4iLCJ2YXIgYmFzZUZpbmRJbmRleCA9IHJlcXVpcmUoJy4vX2Jhc2VGaW5kSW5kZXgnKSxcbiAgICBiYXNlSXRlcmF0ZWUgPSByZXF1aXJlKCcuL19iYXNlSXRlcmF0ZWUnKSxcbiAgICB0b0ludGVnZXIgPSByZXF1aXJlKCcuL3RvSW50ZWdlcicpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5maW5kYCBleGNlcHQgdGhhdCBpdCByZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgZmlyc3RcbiAqIGVsZW1lbnQgYHByZWRpY2F0ZWAgcmV0dXJucyB0cnV0aHkgZm9yIGluc3RlYWQgb2YgdGhlIGVsZW1lbnQgaXRzZWxmLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMS4xLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcHJlZGljYXRlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gW2Zyb21JbmRleD0wXSBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgZm91bmQgZWxlbWVudCwgZWxzZSBgLTFgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgdXNlcnMgPSBbXG4gKiAgIHsgJ3VzZXInOiAnYmFybmV5JywgICdhY3RpdmUnOiBmYWxzZSB9LFxuICogICB7ICd1c2VyJzogJ2ZyZWQnLCAgICAnYWN0aXZlJzogZmFsc2UgfSxcbiAqICAgeyAndXNlcic6ICdwZWJibGVzJywgJ2FjdGl2ZSc6IHRydWUgfVxuICogXTtcbiAqXG4gKiBfLmZpbmRJbmRleCh1c2VycywgZnVuY3Rpb24obykgeyByZXR1cm4gby51c2VyID09ICdiYXJuZXknOyB9KTtcbiAqIC8vID0+IDBcbiAqXG4gKiAvLyBUaGUgYF8ubWF0Y2hlc2AgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maW5kSW5kZXgodXNlcnMsIHsgJ3VzZXInOiAnZnJlZCcsICdhY3RpdmUnOiBmYWxzZSB9KTtcbiAqIC8vID0+IDFcbiAqXG4gKiAvLyBUaGUgYF8ubWF0Y2hlc1Byb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gKiBfLmZpbmRJbmRleCh1c2VycywgWydhY3RpdmUnLCBmYWxzZV0pO1xuICogLy8gPT4gMFxuICpcbiAqIC8vIFRoZSBgXy5wcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maW5kSW5kZXgodXNlcnMsICdhY3RpdmUnKTtcbiAqIC8vID0+IDJcbiAqL1xuZnVuY3Rpb24gZmluZEluZGV4KGFycmF5LCBwcmVkaWNhdGUsIGZyb21JbmRleCkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIHZhciBpbmRleCA9IGZyb21JbmRleCA9PSBudWxsID8gMCA6IHRvSW50ZWdlcihmcm9tSW5kZXgpO1xuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgaW5kZXggPSBuYXRpdmVNYXgobGVuZ3RoICsgaW5kZXgsIDApO1xuICB9XG4gIHJldHVybiBiYXNlRmluZEluZGV4KGFycmF5LCBiYXNlSXRlcmF0ZWUocHJlZGljYXRlLCAzKSwgaW5kZXgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRJbmRleDtcbiIsInZhciBiYXNlRmxhdHRlbiA9IHJlcXVpcmUoJy4vX2Jhc2VGbGF0dGVuJyksXG4gICAgbWFwID0gcmVxdWlyZSgnLi9tYXAnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZmxhdHRlbmVkIGFycmF5IG9mIHZhbHVlcyBieSBydW5uaW5nIGVhY2ggZWxlbWVudCBpbiBgY29sbGVjdGlvbmBcbiAqIHRocnUgYGl0ZXJhdGVlYCBhbmQgZmxhdHRlbmluZyB0aGUgbWFwcGVkIHJlc3VsdHMuIFRoZSBpdGVyYXRlZSBpcyBpbnZva2VkXG4gKiB3aXRoIHRocmVlIGFyZ3VtZW50czogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZsYXR0ZW5lZCBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gZHVwbGljYXRlKG4pIHtcbiAqICAgcmV0dXJuIFtuLCBuXTtcbiAqIH1cbiAqXG4gKiBfLmZsYXRNYXAoWzEsIDJdLCBkdXBsaWNhdGUpO1xuICogLy8gPT4gWzEsIDEsIDIsIDJdXG4gKi9cbmZ1bmN0aW9uIGZsYXRNYXAoY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgcmV0dXJuIGJhc2VGbGF0dGVuKG1hcChjb2xsZWN0aW9uLCBpdGVyYXRlZSksIDEpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZsYXRNYXA7XG4iLCJ2YXIgYmFzZUZsYXR0ZW4gPSByZXF1aXJlKCcuL19iYXNlRmxhdHRlbicpO1xuXG4vKipcbiAqIEZsYXR0ZW5zIGBhcnJheWAgYSBzaW5nbGUgbGV2ZWwgZGVlcC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBmbGF0dGVuLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZmxhdHRlbmVkIGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmZsYXR0ZW4oWzEsIFsyLCBbMywgWzRdXSwgNV1dKTtcbiAqIC8vID0+IFsxLCAyLCBbMywgWzRdXSwgNV1cbiAqL1xuZnVuY3Rpb24gZmxhdHRlbihhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG4gIHJldHVybiBsZW5ndGggPyBiYXNlRmxhdHRlbihhcnJheSwgMSkgOiBbXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmbGF0dGVuO1xuIiwidmFyIGFycmF5RWFjaCA9IHJlcXVpcmUoJy4vX2FycmF5RWFjaCcpLFxuICAgIGJhc2VFYWNoID0gcmVxdWlyZSgnLi9fYmFzZUVhY2gnKSxcbiAgICBjYXN0RnVuY3Rpb24gPSByZXF1aXJlKCcuL19jYXN0RnVuY3Rpb24nKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5Jyk7XG5cbi8qKlxuICogSXRlcmF0ZXMgb3ZlciBlbGVtZW50cyBvZiBgY29sbGVjdGlvbmAgYW5kIGludm9rZXMgYGl0ZXJhdGVlYCBmb3IgZWFjaCBlbGVtZW50LlxuICogVGhlIGl0ZXJhdGVlIGlzIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM6ICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS5cbiAqIEl0ZXJhdGVlIGZ1bmN0aW9ucyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHkgYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAqXG4gKiAqKk5vdGU6KiogQXMgd2l0aCBvdGhlciBcIkNvbGxlY3Rpb25zXCIgbWV0aG9kcywgb2JqZWN0cyB3aXRoIGEgXCJsZW5ndGhcIlxuICogcHJvcGVydHkgYXJlIGl0ZXJhdGVkIGxpa2UgYXJyYXlzLiBUbyBhdm9pZCB0aGlzIGJlaGF2aW9yIHVzZSBgXy5mb3JJbmBcbiAqIG9yIGBfLmZvck93bmAgZm9yIG9iamVjdCBpdGVyYXRpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGFsaWFzIGVhY2hcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICogQHNlZSBfLmZvckVhY2hSaWdodFxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmZvckVhY2goWzEsIDJdLCBmdW5jdGlvbih2YWx1ZSkge1xuICogICBjb25zb2xlLmxvZyh2YWx1ZSk7XG4gKiB9KTtcbiAqIC8vID0+IExvZ3MgYDFgIHRoZW4gYDJgLlxuICpcbiAqIF8uZm9yRWFjaCh7ICdhJzogMSwgJ2InOiAyIH0sIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAqICAgY29uc29sZS5sb2coa2V5KTtcbiAqIH0pO1xuICogLy8gPT4gTG9ncyAnYScgdGhlbiAnYicgKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZCkuXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2goY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGZ1bmMgPSBpc0FycmF5KGNvbGxlY3Rpb24pID8gYXJyYXlFYWNoIDogYmFzZUVhY2g7XG4gIHJldHVybiBmdW5jKGNvbGxlY3Rpb24sIGNhc3RGdW5jdGlvbihpdGVyYXRlZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvckVhY2g7XG4iLCJ2YXIgYmFzZUdldCA9IHJlcXVpcmUoJy4vX2Jhc2VHZXQnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBgcGF0aGAgb2YgYG9iamVjdGAuIElmIHRoZSByZXNvbHZlZCB2YWx1ZSBpc1xuICogYHVuZGVmaW5lZGAsIHRoZSBgZGVmYXVsdFZhbHVlYCBpcyByZXR1cm5lZCBpbiBpdHMgcGxhY2UuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjcuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEBwYXJhbSB7Kn0gW2RlZmF1bHRWYWx1ZV0gVGhlIHZhbHVlIHJldHVybmVkIGZvciBgdW5kZWZpbmVkYCByZXNvbHZlZCB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzb2x2ZWQgdmFsdWUuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogW3sgJ2InOiB7ICdjJzogMyB9IH1dIH07XG4gKlxuICogXy5nZXQob2JqZWN0LCAnYVswXS5iLmMnKTtcbiAqIC8vID0+IDNcbiAqXG4gKiBfLmdldChvYmplY3QsIFsnYScsICcwJywgJ2InLCAnYyddKTtcbiAqIC8vID0+IDNcbiAqXG4gKiBfLmdldChvYmplY3QsICdhLmIuYycsICdkZWZhdWx0Jyk7XG4gKiAvLyA9PiAnZGVmYXVsdCdcbiAqL1xuZnVuY3Rpb24gZ2V0KG9iamVjdCwgcGF0aCwgZGVmYXVsdFZhbHVlKSB7XG4gIHZhciByZXN1bHQgPSBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IGJhc2VHZXQob2JqZWN0LCBwYXRoKTtcbiAgcmV0dXJuIHJlc3VsdCA9PT0gdW5kZWZpbmVkID8gZGVmYXVsdFZhbHVlIDogcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldDtcbiIsInZhciBiYXNlSGFzID0gcmVxdWlyZSgnLi9fYmFzZUhhcycpLFxuICAgIGhhc1BhdGggPSByZXF1aXJlKCcuL19oYXNQYXRoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBwYXRoYCBpcyBhIGRpcmVjdCBwcm9wZXJ0eSBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgcGF0aGAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogeyAnYic6IDIgfSB9O1xuICogdmFyIG90aGVyID0gXy5jcmVhdGUoeyAnYSc6IF8uY3JlYXRlKHsgJ2InOiAyIH0pIH0pO1xuICpcbiAqIF8uaGFzKG9iamVjdCwgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmhhcyhvYmplY3QsICdhLmInKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmhhcyhvYmplY3QsIFsnYScsICdiJ10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzKG90aGVyLCAnYScpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaGFzKG9iamVjdCwgcGF0aCkge1xuICByZXR1cm4gb2JqZWN0ICE9IG51bGwgJiYgaGFzUGF0aChvYmplY3QsIHBhdGgsIGJhc2VIYXMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhcztcbiIsInZhciBiYXNlSGFzSW4gPSByZXF1aXJlKCcuL19iYXNlSGFzSW4nKSxcbiAgICBoYXNQYXRoID0gcmVxdWlyZSgnLi9faGFzUGF0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgcGF0aGAgaXMgYSBkaXJlY3Qgb3IgaW5oZXJpdGVkIHByb3BlcnR5IG9mIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBwYXRoYCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IF8uY3JlYXRlKHsgJ2EnOiBfLmNyZWF0ZSh7ICdiJzogMiB9KSB9KTtcbiAqXG4gKiBfLmhhc0luKG9iamVjdCwgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmhhc0luKG9iamVjdCwgJ2EuYicpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzSW4ob2JqZWN0LCBbJ2EnLCAnYiddKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmhhc0luKG9iamVjdCwgJ2InKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGhhc0luKG9iamVjdCwgcGF0aCkge1xuICByZXR1cm4gb2JqZWN0ICE9IG51bGwgJiYgaGFzUGF0aChvYmplY3QsIHBhdGgsIGJhc2VIYXNJbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzSW47XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGZpcnN0IGFyZ3VtZW50IGl0IHJlY2VpdmVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIEFueSB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIGB2YWx1ZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICpcbiAqIGNvbnNvbGUubG9nKF8uaWRlbnRpdHkob2JqZWN0KSA9PT0gb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaWRlbnRpdHkodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlkZW50aXR5O1xuIiwidmFyIGJhc2VJbmRleE9mID0gcmVxdWlyZSgnLi9fYmFzZUluZGV4T2YnKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKSxcbiAgICBpc1N0cmluZyA9IHJlcXVpcmUoJy4vaXNTdHJpbmcnKSxcbiAgICB0b0ludGVnZXIgPSByZXF1aXJlKCcuL3RvSW50ZWdlcicpLFxuICAgIHZhbHVlcyA9IHJlcXVpcmUoJy4vdmFsdWVzJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBpbiBgY29sbGVjdGlvbmAuIElmIGBjb2xsZWN0aW9uYCBpcyBhIHN0cmluZywgaXQnc1xuICogY2hlY2tlZCBmb3IgYSBzdWJzdHJpbmcgb2YgYHZhbHVlYCwgb3RoZXJ3aXNlXG4gKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogaXMgdXNlZCBmb3IgZXF1YWxpdHkgY29tcGFyaXNvbnMuIElmIGBmcm9tSW5kZXhgIGlzIG5lZ2F0aXZlLCBpdCdzIHVzZWQgYXNcbiAqIHRoZSBvZmZzZXQgZnJvbSB0aGUgZW5kIG9mIGBjb2xsZWN0aW9uYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIHtudW1iZXJ9IFtmcm9tSW5kZXg9MF0gVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICogQHBhcmFtLSB7T2JqZWN0fSBbZ3VhcmRdIEVuYWJsZXMgdXNlIGFzIGFuIGl0ZXJhdGVlIGZvciBtZXRob2RzIGxpa2UgYF8ucmVkdWNlYC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGZvdW5kLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaW5jbHVkZXMoWzEsIDIsIDNdLCAxKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmluY2x1ZGVzKFsxLCAyLCAzXSwgMSwgMik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaW5jbHVkZXMoeyAnYSc6IDEsICdiJzogMiB9LCAxKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmluY2x1ZGVzKCdhYmNkJywgJ2JjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGluY2x1ZGVzKGNvbGxlY3Rpb24sIHZhbHVlLCBmcm9tSW5kZXgsIGd1YXJkKSB7XG4gIGNvbGxlY3Rpb24gPSBpc0FycmF5TGlrZShjb2xsZWN0aW9uKSA/IGNvbGxlY3Rpb24gOiB2YWx1ZXMoY29sbGVjdGlvbik7XG4gIGZyb21JbmRleCA9IChmcm9tSW5kZXggJiYgIWd1YXJkKSA/IHRvSW50ZWdlcihmcm9tSW5kZXgpIDogMDtcblxuICB2YXIgbGVuZ3RoID0gY29sbGVjdGlvbi5sZW5ndGg7XG4gIGlmIChmcm9tSW5kZXggPCAwKSB7XG4gICAgZnJvbUluZGV4ID0gbmF0aXZlTWF4KGxlbmd0aCArIGZyb21JbmRleCwgMCk7XG4gIH1cbiAgcmV0dXJuIGlzU3RyaW5nKGNvbGxlY3Rpb24pXG4gICAgPyAoZnJvbUluZGV4IDw9IGxlbmd0aCAmJiBjb2xsZWN0aW9uLmluZGV4T2YodmFsdWUsIGZyb21JbmRleCkgPiAtMSlcbiAgICA6ICghIWxlbmd0aCAmJiBiYXNlSW5kZXhPZihjb2xsZWN0aW9uLCB2YWx1ZSwgZnJvbUluZGV4KSA+IC0xKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbmNsdWRlcztcbiIsInZhciBhcnJheU1hcCA9IHJlcXVpcmUoJy4vX2FycmF5TWFwJyksXG4gICAgYmFzZUludGVyc2VjdGlvbiA9IHJlcXVpcmUoJy4vX2Jhc2VJbnRlcnNlY3Rpb24nKSxcbiAgICBiYXNlUmVzdCA9IHJlcXVpcmUoJy4vX2Jhc2VSZXN0JyksXG4gICAgY2FzdEFycmF5TGlrZU9iamVjdCA9IHJlcXVpcmUoJy4vX2Nhc3RBcnJheUxpa2VPYmplY3QnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHVuaXF1ZSB2YWx1ZXMgdGhhdCBhcmUgaW5jbHVkZWQgaW4gYWxsIGdpdmVuIGFycmF5c1xuICogdXNpbmcgW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGZvciBlcXVhbGl0eSBjb21wYXJpc29ucy4gVGhlIG9yZGVyIGFuZCByZWZlcmVuY2VzIG9mIHJlc3VsdCB2YWx1ZXMgYXJlXG4gKiBkZXRlcm1pbmVkIGJ5IHRoZSBmaXJzdCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7Li4uQXJyYXl9IFthcnJheXNdIFRoZSBhcnJheXMgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5IG9mIGludGVyc2VjdGluZyB2YWx1ZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaW50ZXJzZWN0aW9uKFsyLCAxXSwgWzIsIDNdKTtcbiAqIC8vID0+IFsyXVxuICovXG52YXIgaW50ZXJzZWN0aW9uID0gYmFzZVJlc3QoZnVuY3Rpb24oYXJyYXlzKSB7XG4gIHZhciBtYXBwZWQgPSBhcnJheU1hcChhcnJheXMsIGNhc3RBcnJheUxpa2VPYmplY3QpO1xuICByZXR1cm4gKG1hcHBlZC5sZW5ndGggJiYgbWFwcGVkWzBdID09PSBhcnJheXNbMF0pXG4gICAgPyBiYXNlSW50ZXJzZWN0aW9uKG1hcHBlZClcbiAgICA6IFtdO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gaW50ZXJzZWN0aW9uO1xuIiwidmFyIGJhc2VJc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vX2Jhc2VJc0FyZ3VtZW50cycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FyZ3VtZW50cyA9IGJhc2VJc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA/IGJhc2VJc0FyZ3VtZW50cyA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJndW1lbnRzO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheTtcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFycmF5LWxpa2UgaWYgaXQnc1xuICogbm90IGEgZnVuY3Rpb24gYW5kIGhhcyBhIGB2YWx1ZS5sZW5ndGhgIHRoYXQncyBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvclxuICogZXF1YWwgdG8gYDBgIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlO1xuIiwidmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5pc0FycmF5TGlrZWAgZXhjZXB0IHRoYXQgaXQgYWxzbyBjaGVja3MgaWYgYHZhbHVlYFxuICogaXMgYW4gb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LWxpa2Ugb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGlzQXJyYXlMaWtlKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5TGlrZU9iamVjdDtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpLFxuICAgIHN0dWJGYWxzZSA9IHJlcXVpcmUoJy4vc3R1YkZhbHNlJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgQnVmZmVyID0gbW9kdWxlRXhwb3J0cyA/IHJvb3QuQnVmZmVyIDogdW5kZWZpbmVkO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlSXNCdWZmZXIgPSBCdWZmZXIgPyBCdWZmZXIuaXNCdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgQnVmZmVyKDIpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBVaW50OEFycmF5KDIpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0J1ZmZlciA9IG5hdGl2ZUlzQnVmZmVyIHx8IHN0dWJGYWxzZTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0J1ZmZlcjtcbiIsInZhciBiYXNlS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VLZXlzJyksXG4gICAgZ2V0VGFnID0gcmVxdWlyZSgnLi9fZ2V0VGFnJyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnLi9pc0J1ZmZlcicpLFxuICAgIGlzUHJvdG90eXBlID0gcmVxdWlyZSgnLi9faXNQcm90b3R5cGUnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XSc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYW4gZW1wdHkgb2JqZWN0LCBjb2xsZWN0aW9uLCBtYXAsIG9yIHNldC5cbiAqXG4gKiBPYmplY3RzIGFyZSBjb25zaWRlcmVkIGVtcHR5IGlmIHRoZXkgaGF2ZSBubyBvd24gZW51bWVyYWJsZSBzdHJpbmcga2V5ZWRcbiAqIHByb3BlcnRpZXMuXG4gKlxuICogQXJyYXktbGlrZSB2YWx1ZXMgc3VjaCBhcyBgYXJndW1lbnRzYCBvYmplY3RzLCBhcnJheXMsIGJ1ZmZlcnMsIHN0cmluZ3MsIG9yXG4gKiBqUXVlcnktbGlrZSBjb2xsZWN0aW9ucyBhcmUgY29uc2lkZXJlZCBlbXB0eSBpZiB0aGV5IGhhdmUgYSBgbGVuZ3RoYCBvZiBgMGAuXG4gKiBTaW1pbGFybHksIG1hcHMgYW5kIHNldHMgYXJlIGNvbnNpZGVyZWQgZW1wdHkgaWYgdGhleSBoYXZlIGEgYHNpemVgIG9mIGAwYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBlbXB0eSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRW1wdHkobnVsbCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0VtcHR5KHRydWUpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNFbXB0eSgxKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRW1wdHkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0VtcHR5KHsgJ2EnOiAxIH0pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChpc0FycmF5TGlrZSh2YWx1ZSkgJiZcbiAgICAgIChpc0FycmF5KHZhbHVlKSB8fCB0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycgfHwgdHlwZW9mIHZhbHVlLnNwbGljZSA9PSAnZnVuY3Rpb24nIHx8XG4gICAgICAgIGlzQnVmZmVyKHZhbHVlKSB8fCBpc1R5cGVkQXJyYXkodmFsdWUpIHx8IGlzQXJndW1lbnRzKHZhbHVlKSkpIHtcbiAgICByZXR1cm4gIXZhbHVlLmxlbmd0aDtcbiAgfVxuICB2YXIgdGFnID0gZ2V0VGFnKHZhbHVlKTtcbiAgaWYgKHRhZyA9PSBtYXBUYWcgfHwgdGFnID09IHNldFRhZykge1xuICAgIHJldHVybiAhdmFsdWUuc2l6ZTtcbiAgfVxuICBpZiAoaXNQcm90b3R5cGUodmFsdWUpKSB7XG4gICAgcmV0dXJuICFiYXNlS2V5cyh2YWx1ZSkubGVuZ3RoO1xuICB9XG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrZXkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRW1wdHk7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFzeW5jVGFnID0gJ1tvYmplY3QgQXN5bmNGdW5jdGlvbl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgcHJveHlUYWcgPSAnW29iamVjdCBQcm94eV0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDkgd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXlzIGFuZCBvdGhlciBjb25zdHJ1Y3RvcnMuXG4gIHZhciB0YWcgPSBiYXNlR2V0VGFnKHZhbHVlKTtcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWcgfHwgdGFnID09IGFzeW5jVGFnIHx8IHRhZyA9PSBwcm94eVRhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0Z1bmN0aW9uO1xuIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTGVuZ3RoKDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNMZW5ndGgoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoSW5maW5pdHkpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKCczJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmXG4gICAgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTGVuZ3RoO1xuIiwidmFyIGlzTnVtYmVyID0gcmVxdWlyZSgnLi9pc051bWJlcicpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGBOYU5gLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBiYXNlZCBvblxuICogW2BOdW1iZXIuaXNOYU5gXShodHRwczovL21kbi5pby9OdW1iZXIvaXNOYU4pIGFuZCBpcyBub3QgdGhlIHNhbWUgYXNcbiAqIGdsb2JhbCBbYGlzTmFOYF0oaHR0cHM6Ly9tZG4uaW8vaXNOYU4pIHdoaWNoIHJldHVybnMgYHRydWVgIGZvclxuICogYHVuZGVmaW5lZGAgYW5kIG90aGVyIG5vbi1udW1iZXIgdmFsdWVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGBOYU5gLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNOYU4oTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTmFOKG5ldyBOdW1iZXIoTmFOKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogaXNOYU4odW5kZWZpbmVkKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTmFOKHVuZGVmaW5lZCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc05hTih2YWx1ZSkge1xuICAvLyBBbiBgTmFOYCBwcmltaXRpdmUgaXMgdGhlIG9ubHkgdmFsdWUgdGhhdCBpcyBub3QgZXF1YWwgdG8gaXRzZWxmLlxuICAvLyBQZXJmb3JtIHRoZSBgdG9TdHJpbmdUYWdgIGNoZWNrIGZpcnN0IHRvIGF2b2lkIGVycm9ycyB3aXRoIHNvbWVcbiAgLy8gQWN0aXZlWCBvYmplY3RzIGluIElFLlxuICByZXR1cm4gaXNOdW1iZXIodmFsdWUpICYmIHZhbHVlICE9ICt2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc05hTjtcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYE51bWJlcmAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiAqKk5vdGU6KiogVG8gZXhjbHVkZSBgSW5maW5pdHlgLCBgLUluZmluaXR5YCwgYW5kIGBOYU5gLCB3aGljaCBhcmVcbiAqIGNsYXNzaWZpZWQgYXMgbnVtYmVycywgdXNlIHRoZSBgXy5pc0Zpbml0ZWAgbWV0aG9kLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbnVtYmVyLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNOdW1iZXIoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTnVtYmVyKEluZmluaXR5KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTnVtYmVyKCczJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc051bWJlcih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gbnVtYmVyVGFnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc051bWJlcjtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3RMaWtlO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN0cmluZ2AgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN0cmluZywgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3RyaW5nKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3RyaW5nKDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fFxuICAgICghaXNBcnJheSh2YWx1ZSkgJiYgaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBzdHJpbmdUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3RyaW5nO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3ltYm9sO1xuIiwidmFyIGJhc2VJc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL19iYXNlSXNUeXBlZEFycmF5JyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgbm9kZVV0aWwgPSByZXF1aXJlKCcuL19ub2RlVXRpbCcpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1R5cGVkQXJyYXkgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIHR5cGVkIGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkobmV3IFVpbnQ4QXJyYXkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KFtdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc1R5cGVkQXJyYXkgPSBub2RlSXNUeXBlZEFycmF5ID8gYmFzZVVuYXJ5KG5vZGVJc1R5cGVkQXJyYXkpIDogYmFzZUlzVHlwZWRBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc1R5cGVkQXJyYXk7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGB1bmRlZmluZWRgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGB1bmRlZmluZWRgLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNVbmRlZmluZWQodm9pZCAwKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzVW5kZWZpbmVkKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNVbmRlZmluZWQ7XG4iLCJ2YXIgYXJyYXlMaWtlS2V5cyA9IHJlcXVpcmUoJy4vX2FycmF5TGlrZUtleXMnKSxcbiAgICBiYXNlS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VLZXlzJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuIFNlZSB0aGVcbiAqIFtFUyBzcGVjXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIF8ua2V5cygnaGknKTtcbiAqIC8vID0+IFsnMCcsICcxJ11cbiAqL1xuZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iamVjdCkgPyBhcnJheUxpa2VLZXlzKG9iamVjdCkgOiBiYXNlS2V5cyhvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXM7XG4iLCJ2YXIgYXJyYXlNYXAgPSByZXF1aXJlKCcuL19hcnJheU1hcCcpLFxuICAgIGJhc2VJdGVyYXRlZSA9IHJlcXVpcmUoJy4vX2Jhc2VJdGVyYXRlZScpLFxuICAgIGJhc2VNYXAgPSByZXF1aXJlKCcuL19iYXNlTWFwJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdmFsdWVzIGJ5IHJ1bm5pbmcgZWFjaCBlbGVtZW50IGluIGBjb2xsZWN0aW9uYCB0aHJ1XG4gKiBgaXRlcmF0ZWVgLiBUaGUgaXRlcmF0ZWUgaXMgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czpcbiAqICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS5cbiAqXG4gKiBNYW55IGxvZGFzaCBtZXRob2RzIGFyZSBndWFyZGVkIHRvIHdvcmsgYXMgaXRlcmF0ZWVzIGZvciBtZXRob2RzIGxpa2VcbiAqIGBfLmV2ZXJ5YCwgYF8uZmlsdGVyYCwgYF8ubWFwYCwgYF8ubWFwVmFsdWVzYCwgYF8ucmVqZWN0YCwgYW5kIGBfLnNvbWVgLlxuICpcbiAqIFRoZSBndWFyZGVkIG1ldGhvZHMgYXJlOlxuICogYGFyeWAsIGBjaHVua2AsIGBjdXJyeWAsIGBjdXJyeVJpZ2h0YCwgYGRyb3BgLCBgZHJvcFJpZ2h0YCwgYGV2ZXJ5YCxcbiAqIGBmaWxsYCwgYGludmVydGAsIGBwYXJzZUludGAsIGByYW5kb21gLCBgcmFuZ2VgLCBgcmFuZ2VSaWdodGAsIGByZXBlYXRgLFxuICogYHNhbXBsZVNpemVgLCBgc2xpY2VgLCBgc29tZWAsIGBzb3J0QnlgLCBgc3BsaXRgLCBgdGFrZWAsIGB0YWtlUmlnaHRgLFxuICogYHRlbXBsYXRlYCwgYHRyaW1gLCBgdHJpbUVuZGAsIGB0cmltU3RhcnRgLCBhbmQgYHdvcmRzYFxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IG1hcHBlZCBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gc3F1YXJlKG4pIHtcbiAqICAgcmV0dXJuIG4gKiBuO1xuICogfVxuICpcbiAqIF8ubWFwKFs0LCA4XSwgc3F1YXJlKTtcbiAqIC8vID0+IFsxNiwgNjRdXG4gKlxuICogXy5tYXAoeyAnYSc6IDQsICdiJzogOCB9LCBzcXVhcmUpO1xuICogLy8gPT4gWzE2LCA2NF0gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqXG4gKiB2YXIgdXNlcnMgPSBbXG4gKiAgIHsgJ3VzZXInOiAnYmFybmV5JyB9LFxuICogICB7ICd1c2VyJzogJ2ZyZWQnIH1cbiAqIF07XG4gKlxuICogLy8gVGhlIGBfLnByb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gKiBfLm1hcCh1c2VycywgJ3VzZXInKTtcbiAqIC8vID0+IFsnYmFybmV5JywgJ2ZyZWQnXVxuICovXG5mdW5jdGlvbiBtYXAoY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGZ1bmMgPSBpc0FycmF5KGNvbGxlY3Rpb24pID8gYXJyYXlNYXAgOiBiYXNlTWFwO1xuICByZXR1cm4gZnVuYyhjb2xsZWN0aW9uLCBiYXNlSXRlcmF0ZWUoaXRlcmF0ZWUsIDMpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXA7XG4iLCJ2YXIgTWFwQ2FjaGUgPSByZXF1aXJlKCcuL19NYXBDYWNoZScpO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IG1lbW9pemVzIHRoZSByZXN1bHQgb2YgYGZ1bmNgLiBJZiBgcmVzb2x2ZXJgIGlzXG4gKiBwcm92aWRlZCwgaXQgZGV0ZXJtaW5lcyB0aGUgY2FjaGUga2V5IGZvciBzdG9yaW5nIHRoZSByZXN1bHQgYmFzZWQgb24gdGhlXG4gKiBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIG1lbW9pemVkIGZ1bmN0aW9uLiBCeSBkZWZhdWx0LCB0aGUgZmlyc3QgYXJndW1lbnRcbiAqIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbiBpcyB1c2VkIGFzIHRoZSBtYXAgY2FjaGUga2V5LiBUaGUgYGZ1bmNgXG4gKiBpcyBpbnZva2VkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBtZW1vaXplZCBmdW5jdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogVGhlIGNhY2hlIGlzIGV4cG9zZWQgYXMgdGhlIGBjYWNoZWAgcHJvcGVydHkgb24gdGhlIG1lbW9pemVkXG4gKiBmdW5jdGlvbi4gSXRzIGNyZWF0aW9uIG1heSBiZSBjdXN0b21pemVkIGJ5IHJlcGxhY2luZyB0aGUgYF8ubWVtb2l6ZS5DYWNoZWBcbiAqIGNvbnN0cnVjdG9yIHdpdGggb25lIHdob3NlIGluc3RhbmNlcyBpbXBsZW1lbnQgdGhlXG4gKiBbYE1hcGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXByb3BlcnRpZXMtb2YtdGhlLW1hcC1wcm90b3R5cGUtb2JqZWN0KVxuICogbWV0aG9kIGludGVyZmFjZSBvZiBgY2xlYXJgLCBgZGVsZXRlYCwgYGdldGAsIGBoYXNgLCBhbmQgYHNldGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBoYXZlIGl0cyBvdXRwdXQgbWVtb2l6ZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcmVzb2x2ZXJdIFRoZSBmdW5jdGlvbiB0byByZXNvbHZlIHRoZSBjYWNoZSBrZXkuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBtZW1vaXplZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxLCAnYic6IDIgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2MnOiAzLCAnZCc6IDQgfTtcbiAqXG4gKiB2YXIgdmFsdWVzID0gXy5tZW1vaXplKF8udmFsdWVzKTtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogdmFsdWVzKG90aGVyKTtcbiAqIC8vID0+IFszLCA0XVxuICpcbiAqIG9iamVjdC5hID0gMjtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogLy8gTW9kaWZ5IHRoZSByZXN1bHQgY2FjaGUuXG4gKiB2YWx1ZXMuY2FjaGUuc2V0KG9iamVjdCwgWydhJywgJ2InXSk7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsnYScsICdiJ11cbiAqXG4gKiAvLyBSZXBsYWNlIGBfLm1lbW9pemUuQ2FjaGVgLlxuICogXy5tZW1vaXplLkNhY2hlID0gV2Vha01hcDtcbiAqL1xuZnVuY3Rpb24gbWVtb2l6ZShmdW5jLCByZXNvbHZlcikge1xuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJyB8fCAocmVzb2x2ZXIgIT0gbnVsbCAmJiB0eXBlb2YgcmVzb2x2ZXIgIT0gJ2Z1bmN0aW9uJykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgdmFyIG1lbW9pemVkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGtleSA9IHJlc29sdmVyID8gcmVzb2x2ZXIuYXBwbHkodGhpcywgYXJncykgOiBhcmdzWzBdLFxuICAgICAgICBjYWNoZSA9IG1lbW9pemVkLmNhY2hlO1xuXG4gICAgaWYgKGNhY2hlLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gY2FjaGUuZ2V0KGtleSk7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIG1lbW9pemVkLmNhY2hlID0gY2FjaGUuc2V0KGtleSwgcmVzdWx0KSB8fCBjYWNoZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBtZW1vaXplZC5jYWNoZSA9IG5ldyAobWVtb2l6ZS5DYWNoZSB8fCBNYXBDYWNoZSk7XG4gIHJldHVybiBtZW1vaXplZDtcbn1cblxuLy8gRXhwb3NlIGBNYXBDYWNoZWAuXG5tZW1vaXplLkNhY2hlID0gTWFwQ2FjaGU7XG5cbm1vZHVsZS5leHBvcnRzID0gbWVtb2l6ZTtcbiIsIi8qKiBFcnJvciBtZXNzYWdlIGNvbnN0YW50cy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgbmVnYXRlcyB0aGUgcmVzdWx0IG9mIHRoZSBwcmVkaWNhdGUgYGZ1bmNgLiBUaGVcbiAqIGBmdW5jYCBwcmVkaWNhdGUgaXMgaW52b2tlZCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBhbmQgYXJndW1lbnRzIG9mIHRoZVxuICogY3JlYXRlZCBmdW5jdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgcHJlZGljYXRlIHRvIG5lZ2F0ZS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IG5lZ2F0ZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIGlzRXZlbihuKSB7XG4gKiAgIHJldHVybiBuICUgMiA9PSAwO1xuICogfVxuICpcbiAqIF8uZmlsdGVyKFsxLCAyLCAzLCA0LCA1LCA2XSwgXy5uZWdhdGUoaXNFdmVuKSk7XG4gKiAvLyA9PiBbMSwgMywgNV1cbiAqL1xuZnVuY3Rpb24gbmVnYXRlKHByZWRpY2F0ZSkge1xuICBpZiAodHlwZW9mIHByZWRpY2F0ZSAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6IHJldHVybiAhcHJlZGljYXRlLmNhbGwodGhpcyk7XG4gICAgICBjYXNlIDE6IHJldHVybiAhcHJlZGljYXRlLmNhbGwodGhpcywgYXJnc1swXSk7XG4gICAgICBjYXNlIDI6IHJldHVybiAhcHJlZGljYXRlLmNhbGwodGhpcywgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICBjYXNlIDM6IHJldHVybiAhcHJlZGljYXRlLmNhbGwodGhpcywgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgfVxuICAgIHJldHVybiAhcHJlZGljYXRlLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5lZ2F0ZTtcbiIsInZhciBiYXNlUGljayA9IHJlcXVpcmUoJy4vX2Jhc2VQaWNrJyksXG4gICAgZmxhdFJlc3QgPSByZXF1aXJlKCcuL19mbGF0UmVzdCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gb2JqZWN0IGNvbXBvc2VkIG9mIHRoZSBwaWNrZWQgYG9iamVjdGAgcHJvcGVydGllcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHsuLi4oc3RyaW5nfHN0cmluZ1tdKX0gW3BhdGhzXSBUaGUgcHJvcGVydHkgcGF0aHMgdG8gcGljay5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSwgJ2InOiAnMicsICdjJzogMyB9O1xuICpcbiAqIF8ucGljayhvYmplY3QsIFsnYScsICdjJ10pO1xuICogLy8gPT4geyAnYSc6IDEsICdjJzogMyB9XG4gKi9cbnZhciBwaWNrID0gZmxhdFJlc3QoZnVuY3Rpb24ob2JqZWN0LCBwYXRocykge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB7fSA6IGJhc2VQaWNrKG9iamVjdCwgcGF0aHMpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gcGljaztcbiIsInZhciBiYXNlUHJvcGVydHkgPSByZXF1aXJlKCcuL19iYXNlUHJvcGVydHknKSxcbiAgICBiYXNlUHJvcGVydHlEZWVwID0gcmVxdWlyZSgnLi9fYmFzZVByb3BlcnR5RGVlcCcpLFxuICAgIGlzS2V5ID0gcmVxdWlyZSgnLi9faXNLZXknKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgdmFsdWUgYXQgYHBhdGhgIG9mIGEgZ2l2ZW4gb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYWNjZXNzb3IgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gW1xuICogICB7ICdhJzogeyAnYic6IDIgfSB9LFxuICogICB7ICdhJzogeyAnYic6IDEgfSB9XG4gKiBdO1xuICpcbiAqIF8ubWFwKG9iamVjdHMsIF8ucHJvcGVydHkoJ2EuYicpKTtcbiAqIC8vID0+IFsyLCAxXVxuICpcbiAqIF8ubWFwKF8uc29ydEJ5KG9iamVjdHMsIF8ucHJvcGVydHkoWydhJywgJ2InXSkpLCAnYS5iJyk7XG4gKiAvLyA9PiBbMSwgMl1cbiAqL1xuZnVuY3Rpb24gcHJvcGVydHkocGF0aCkge1xuICByZXR1cm4gaXNLZXkocGF0aCkgPyBiYXNlUHJvcGVydHkodG9LZXkocGF0aCkpIDogYmFzZVByb3BlcnR5RGVlcChwYXRoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwcm9wZXJ0eTtcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBgZmFsc2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50aW1lcygyLCBfLnN0dWJGYWxzZSk7XG4gKiAvLyA9PiBbZmFsc2UsIGZhbHNlXVxuICovXG5mdW5jdGlvbiBzdHViRmFsc2UoKSB7XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHViRmFsc2U7XG4iLCJ2YXIgYmFzZVN1bSA9IHJlcXVpcmUoJy4vX2Jhc2VTdW0nKSxcbiAgICBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKTtcblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgc3VtIG9mIHRoZSB2YWx1ZXMgaW4gYGFycmF5YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuNC4wXG4gKiBAY2F0ZWdvcnkgTWF0aFxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHN1bS5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5zdW0oWzQsIDIsIDgsIDZdKTtcbiAqIC8vID0+IDIwXG4gKi9cbmZ1bmN0aW9uIHN1bShhcnJheSkge1xuICByZXR1cm4gKGFycmF5ICYmIGFycmF5Lmxlbmd0aClcbiAgICA/IGJhc2VTdW0oYXJyYXksIGlkZW50aXR5KVxuICAgIDogMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdW07XG4iLCJ2YXIgYmFzZVNsaWNlID0gcmVxdWlyZSgnLi9fYmFzZVNsaWNlJyksXG4gICAgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi90b0ludGVnZXInKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgc2xpY2Ugb2YgYGFycmF5YCB3aXRoIGBuYCBlbGVtZW50cyB0YWtlbiBmcm9tIHRoZSBiZWdpbm5pbmcuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge251bWJlcn0gW249MV0gVGhlIG51bWJlciBvZiBlbGVtZW50cyB0byB0YWtlLlxuICogQHBhcmFtLSB7T2JqZWN0fSBbZ3VhcmRdIEVuYWJsZXMgdXNlIGFzIGFuIGl0ZXJhdGVlIGZvciBtZXRob2RzIGxpa2UgYF8ubWFwYC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgc2xpY2Ugb2YgYGFycmF5YC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50YWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBbMV1cbiAqXG4gKiBfLnRha2UoWzEsIDIsIDNdLCAyKTtcbiAqIC8vID0+IFsxLCAyXVxuICpcbiAqIF8udGFrZShbMSwgMiwgM10sIDUpO1xuICogLy8gPT4gWzEsIDIsIDNdXG4gKlxuICogXy50YWtlKFsxLCAyLCAzXSwgMCk7XG4gKiAvLyA9PiBbXVxuICovXG5mdW5jdGlvbiB0YWtlKGFycmF5LCBuLCBndWFyZCkge1xuICBpZiAoIShhcnJheSAmJiBhcnJheS5sZW5ndGgpKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIG4gPSAoZ3VhcmQgfHwgbiA9PT0gdW5kZWZpbmVkKSA/IDEgOiB0b0ludGVnZXIobik7XG4gIHJldHVybiBiYXNlU2xpY2UoYXJyYXksIDAsIG4gPCAwID8gMCA6IG4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRha2U7XG4iLCJ2YXIgdG9OdW1iZXIgPSByZXF1aXJlKCcuL3RvTnVtYmVyJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDAsXG4gICAgTUFYX0lOVEVHRVIgPSAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwODtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgZmluaXRlIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTIuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvRmluaXRlKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvRmluaXRlKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b0Zpbml0ZShJbmZpbml0eSk7XG4gKiAvLyA9PiAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwOFxuICpcbiAqIF8udG9GaW5pdGUoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvRmluaXRlKHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6IDA7XG4gIH1cbiAgdmFsdWUgPSB0b051bWJlcih2YWx1ZSk7XG4gIGlmICh2YWx1ZSA9PT0gSU5GSU5JVFkgfHwgdmFsdWUgPT09IC1JTkZJTklUWSkge1xuICAgIHZhciBzaWduID0gKHZhbHVlIDwgMCA/IC0xIDogMSk7XG4gICAgcmV0dXJuIHNpZ24gKiBNQVhfSU5URUdFUjtcbiAgfVxuICByZXR1cm4gdmFsdWUgPT09IHZhbHVlID8gdmFsdWUgOiAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvRmluaXRlO1xuIiwidmFyIHRvRmluaXRlID0gcmVxdWlyZSgnLi90b0Zpbml0ZScpO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYW4gaW50ZWdlci5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0ludGVnZXJgXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9pbnRlZ2VyKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBpbnRlZ2VyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvSW50ZWdlcigzLjIpO1xuICogLy8gPT4gM1xuICpcbiAqIF8udG9JbnRlZ2VyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gMFxuICpcbiAqIF8udG9JbnRlZ2VyKEluZmluaXR5KTtcbiAqIC8vID0+IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4XG4gKlxuICogXy50b0ludGVnZXIoJzMuMicpO1xuICogLy8gPT4gM1xuICovXG5mdW5jdGlvbiB0b0ludGVnZXIodmFsdWUpIHtcbiAgdmFyIHJlc3VsdCA9IHRvRmluaXRlKHZhbHVlKSxcbiAgICAgIHJlbWFpbmRlciA9IHJlc3VsdCAlIDE7XG5cbiAgcmV0dXJuIHJlc3VsdCA9PT0gcmVzdWx0ID8gKHJlbWFpbmRlciA/IHJlc3VsdCAtIHJlbWFpbmRlciA6IHJlc3VsdCkgOiAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvSW50ZWdlcjtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltID0gL15cXHMrfFxccyskL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JhZEhleCA9IC9eWy0rXTB4WzAtOWEtZl0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JpbmFyeSA9IC9eMGJbMDFdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc09jdGFsID0gL14wb1swLTddKyQvaTtcblxuLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi9cbnZhciBmcmVlUGFyc2VJbnQgPSBwYXJzZUludDtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTnVtYmVyKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IHR5cGVvZiB2YWx1ZS52YWx1ZU9mID09ICdmdW5jdGlvbicgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVUcmltLCAnJyk7XG4gIHZhciBpc0JpbmFyeSA9IHJlSXNCaW5hcnkudGVzdCh2YWx1ZSk7XG4gIHJldHVybiAoaXNCaW5hcnkgfHwgcmVJc09jdGFsLnRlc3QodmFsdWUpKVxuICAgID8gZnJlZVBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCBpc0JpbmFyeSA/IDIgOiA4KVxuICAgIDogKHJlSXNCYWRIZXgudGVzdCh2YWx1ZSkgPyBOQU4gOiArdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvTnVtYmVyO1xuIiwidmFyIGJhc2VUb1N0cmluZyA9IHJlcXVpcmUoJy4vX2Jhc2VUb1N0cmluZycpO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcuIEFuIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZCBmb3IgYG51bGxgXG4gKiBhbmQgYHVuZGVmaW5lZGAgdmFsdWVzLiBUaGUgc2lnbiBvZiBgLTBgIGlzIHByZXNlcnZlZC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9TdHJpbmcobnVsbCk7XG4gKiAvLyA9PiAnJ1xuICpcbiAqIF8udG9TdHJpbmcoLTApO1xuICogLy8gPT4gJy0wJ1xuICpcbiAqIF8udG9TdHJpbmcoWzEsIDIsIDNdKTtcbiAqIC8vID0+ICcxLDIsMydcbiAqL1xuZnVuY3Rpb24gdG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09IG51bGwgPyAnJyA6IGJhc2VUb1N0cmluZyh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9TdHJpbmc7XG4iLCJ2YXIgYmFzZVZhbHVlcyA9IHJlcXVpcmUoJy4vX2Jhc2VWYWx1ZXMnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgc3RyaW5nIGtleWVkIHByb3BlcnR5IHZhbHVlcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IHZhbHVlcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy52YWx1ZXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbMSwgMl0gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqXG4gKiBfLnZhbHVlcygnaGknKTtcbiAqIC8vID0+IFsnaCcsICdpJ11cbiAqL1xuZnVuY3Rpb24gdmFsdWVzKG9iamVjdCkge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyBbXSA6IGJhc2VWYWx1ZXMob2JqZWN0LCBrZXlzKG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHZhbHVlcztcbiIsInZhciBmaW5kTWF0Y2hpbmdSdWxlID0gZnVuY3Rpb24ocnVsZXMsIHRleHQpe1xuICB2YXIgaTtcbiAgZm9yKGk9MDsgaTxydWxlcy5sZW5ndGg7IGkrKylcbiAgICBpZihydWxlc1tpXS5yZWdleC50ZXN0KHRleHQpKVxuICAgICAgcmV0dXJuIHJ1bGVzW2ldO1xuICByZXR1cm4gdW5kZWZpbmVkO1xufTtcblxudmFyIGZpbmRNYXhJbmRleEFuZFJ1bGUgPSBmdW5jdGlvbihydWxlcywgdGV4dCl7XG4gIHZhciBpLCBydWxlLCBsYXN0X21hdGNoaW5nX3J1bGU7XG4gIGZvcihpPTA7IGk8dGV4dC5sZW5ndGg7IGkrKyl7XG4gICAgcnVsZSA9IGZpbmRNYXRjaGluZ1J1bGUocnVsZXMsIHRleHQuc3Vic3RyaW5nKDAsIGkgKyAxKSk7XG4gICAgaWYocnVsZSlcbiAgICAgIGxhc3RfbWF0Y2hpbmdfcnVsZSA9IHJ1bGU7XG4gICAgZWxzZSBpZihsYXN0X21hdGNoaW5nX3J1bGUpXG4gICAgICByZXR1cm4ge21heF9pbmRleDogaSwgcnVsZTogbGFzdF9tYXRjaGluZ19ydWxlfTtcbiAgfVxuICByZXR1cm4gbGFzdF9tYXRjaGluZ19ydWxlID8ge21heF9pbmRleDogdGV4dC5sZW5ndGgsIHJ1bGU6IGxhc3RfbWF0Y2hpbmdfcnVsZX0gOiB1bmRlZmluZWQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9uVG9rZW5fb3JpZyl7XG4gIHZhciBidWZmZXIgPSBcIlwiO1xuICB2YXIgcnVsZXMgPSBbXTtcbiAgdmFyIGxpbmUgPSAxO1xuICB2YXIgY29sID0gMTtcblxuICB2YXIgb25Ub2tlbiA9IGZ1bmN0aW9uKHNyYywgdHlwZSl7XG4gICAgb25Ub2tlbl9vcmlnKHtcbiAgICAgIHR5cGU6IHR5cGUsXG4gICAgICBzcmM6IHNyYyxcbiAgICAgIGxpbmU6IGxpbmUsXG4gICAgICBjb2w6IGNvbFxuICAgIH0pO1xuICAgIHZhciBsaW5lcyA9IHNyYy5zcGxpdChcIlxcblwiKTtcbiAgICBsaW5lICs9IGxpbmVzLmxlbmd0aCAtIDE7XG4gICAgY29sID0gKGxpbmVzLmxlbmd0aCA+IDEgPyAxIDogY29sKSArIGxpbmVzW2xpbmVzLmxlbmd0aCAtIDFdLmxlbmd0aDtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGFkZFJ1bGU6IGZ1bmN0aW9uKHJlZ2V4LCB0eXBlKXtcbiAgICAgIHJ1bGVzLnB1c2goe3JlZ2V4OiByZWdleCwgdHlwZTogdHlwZX0pO1xuICAgIH0sXG4gICAgb25UZXh0OiBmdW5jdGlvbih0ZXh0KXtcbiAgICAgIHZhciBzdHIgPSBidWZmZXIgKyB0ZXh0O1xuICAgICAgdmFyIG0gPSBmaW5kTWF4SW5kZXhBbmRSdWxlKHJ1bGVzLCBzdHIpO1xuICAgICAgd2hpbGUobSAmJiBtLm1heF9pbmRleCAhPT0gc3RyLmxlbmd0aCl7XG4gICAgICAgIG9uVG9rZW4oc3RyLnN1YnN0cmluZygwLCBtLm1heF9pbmRleCksIG0ucnVsZS50eXBlKTtcblxuICAgICAgICAvL25vdyBmaW5kIHRoZSBuZXh0IHRva2VuXG4gICAgICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcobS5tYXhfaW5kZXgpO1xuICAgICAgICBtID0gZmluZE1heEluZGV4QW5kUnVsZShydWxlcywgc3RyKTtcbiAgICAgIH1cbiAgICAgIGJ1ZmZlciA9IHN0cjtcbiAgICB9LFxuICAgIGVuZDogZnVuY3Rpb24oKXtcbiAgICAgIGlmKGJ1ZmZlci5sZW5ndGggPT09IDApXG4gICAgICAgIHJldHVybjtcblxuICAgICAgdmFyIHJ1bGUgPSBmaW5kTWF0Y2hpbmdSdWxlKHJ1bGVzLCBidWZmZXIpO1xuICAgICAgaWYoIXJ1bGUpe1xuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKFwidW5hYmxlIHRvIHRva2VuaXplXCIpO1xuICAgICAgICBlcnIudG9rZW5pemVyMiA9IHtcbiAgICAgICAgICBidWZmZXI6IGJ1ZmZlcixcbiAgICAgICAgICBsaW5lOiBsaW5lLFxuICAgICAgICAgIGNvbDogY29sXG4gICAgICAgIH07XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cblxuICAgICAgb25Ub2tlbihidWZmZXIsIHJ1bGUudHlwZSk7XG4gICAgfVxuICB9O1xufTtcbiIsIi8qKiBAbW9kdWxlIGNvbmZpZy9zeWxsYWJsZXMgKi9cblxudmFyIGdldExhbmd1YWdlID0gcmVxdWlyZSggXCIuLi9oZWxwZXJzL2dldExhbmd1YWdlLmpzXCIgKTtcbnZhciBpc1VuZGVmaW5lZCA9IHJlcXVpcmUoIFwibG9kYXNoL2lzVW5kZWZpbmVkXCIgKTtcblxudmFyIGRlID0gcmVxdWlyZSggXCIuL3N5bGxhYmxlcy9kZS5qc29uXCIgKTtcbnZhciBlbiA9IHJlcXVpcmUoICcuL3N5bGxhYmxlcy9lbi5qc29uJyApO1xudmFyIG5sID0gcmVxdWlyZSggJy4vc3lsbGFibGVzL25sLmpzb24nICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGxvY2FsZSApIHtcblx0aWYgKCBpc1VuZGVmaW5lZCggbG9jYWxlICkgKSB7XG5cdFx0bG9jYWxlID0gXCJlbl9VU1wiXG5cdH1cblxuXHRzd2l0Y2goIGdldExhbmd1YWdlKCBsb2NhbGUgKSApIHtcblx0XHRjYXNlIFwiZGVcIjpcblx0XHRcdHJldHVybiBkZTtcblx0XHRjYXNlIFwibmxcIjpcblx0XHRcdHJldHVybiBubDtcblx0XHRjYXNlIFwiZW5cIjpcblx0XHRkZWZhdWx0OlxuXHRcdFx0cmV0dXJuIGVuO1xuXHR9XG59O1xuIiwibW9kdWxlLmV4cG9ydHM9e1xuXHRcInZvd2Vsc1wiOiBcImFlaW91ecOkw7bDvMOhw6nDosOgw6jDrsOqw6LDu8O0xZNcIixcblx0XCJkZXZpYXRpb25zXCI6IHtcblx0XHRcInZvd2Vsc1wiOiBbXG5cdFx0XHR7XG5cdFx0XHRcdFwiZnJhZ21lbnRzXCI6IFsgXCJvdWlsXCIsIFwiZGVhdXhcIiwgXCJkZWF1JFwiLCBcIm9hcmRcIiwgXCLDpHRoaW9wXCIsIFwiZXVpbFwiLCBcInZlYXVcIiwgXCJlYXUkXCIsIFwidWV1ZVwiLCBcImxpZW5pc2NoXCIsIFwiYW5jZSRcIiwgXCJlbmNlJFwiLCBcInRpbWUkXCIsXG5cdFx0XHRcdFx0XCJvbmNlJFwiLCBcInppYXRcIiwgXCJndWV0dGVcIiwgXCLDqnRlXCIsIFwiw7R0ZSRcIiwgXCJbaHBdb21tZSRcIiwgXCJbcWRzY25ddWUkXCIsIFwiYWlyZSRcIiwgXCJ0dXJlJFwiLCBcIsOqcGUkXCIsIFwiW15xXXVpJFwiLCBcInRpY2hlJFwiLFxuXHRcdFx0XHRcdFwidmljZSRcIiwgXCJvaWxlJFwiLCBcInppYWxcIiwgXCJjcnVpc1wiLCBcImxlYXNcIiwgXCJjb2FbY3RdXCIsIFwiW15pXWRlYWxcIiwgXCJbZnddZWF0XCIsIFwiW2xzeF1lZCRcIiBdLFxuXHRcdFx0XHRcImNvdW50TW9kaWZpZXJcIjogLTFcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdFwiZnJhZ21lbnRzXCI6IFsgXCJhYXVcIiwgXCJhW8Okw7bDvG9dXCIsIFwiw6R1ZVwiLCBcIsOkZXVcIiwgXCJhZWlcIiwgXCJhdWVcIiwgXCJhZXVcIiwgXCJhZWxcIiwgXCJhaVthZW9dXCIsIFwic2Fpa1wiLCBcImFpc211c1wiLCBcIsOkW2Flb2ldXCIsIFwiYXXDpFwiLCBcIsOpYVwiLFxuXHRcdFx0XHRcdFwiZVvDpGFvw7ZdXCIsIFwiZWlbZW9dXCIsIFwiZWVbYWVpb3VdXCIsIFwiZXVbYcOkZV1cIiwgXCJldW0kXCIsIFwiZcO8XCIsIFwib1thw6TDtsO8XVwiLCBcInBvZXRcIiwgXCJvb1tlb11cIiwgXCJvaWVcIiwgXCJvZWlbXmxdXCIsIFwib2V1W15mXVwiLCBcIsO2YVwiLCBcIltmZ3J6XWlldVwiLFxuXHRcdFx0XHRcdFwibWlldW5cIiwgXCJ0aWV1clwiLCBcImlldW1cIiwgXCJpW2FpdcO8XVwiLCBcIltebF1pw6RcIiwgXCJbXnNdY2hpZW5cIiwgXCJpb1tiY2RmaGprbXBxdHV2d3hdXCIsIFwiW2JkaG1wcnZdaW9uXCIsIFwiW2xyXWlvclwiLFxuXHRcdFx0XHRcdFwiW15nXWlvW2dzXVwiLCBcIltkcl1pb3pcIiwgXCJlbGlvelwiLCBcInppb25pXCIsIFwiYmlvW2xub3J6XVwiLCBcImnDtltec11cIiwgXCJpZVtlaV1cIiwgXCJyaWVyJFwiLCBcIsO2aVtlZ11cIiwgXCJbXnJdw7Zpc2NoXCIsXG5cdFx0XHRcdFx0XCJbXmdxdl11W2Flw6lpb8O2dcO8XVwiLCBcInF1aWUkXCIsIFwicXVpZVtec11cIiwgXCJ1w6R1XCIsIFwiXnVzLVwiLCBcIl5pdC1cIiwgXCLDvGVcIiwgXCJuYWl2XCIsIFwiYWlzY2gkXCIsIFwiYWlzY2hlJFwiLCBcImFpc2NoZVtucnNdJFwiLCBcIltsc3RdaWVuXCIsXG5cdFx0XHRcdFx0XCJkaWVuJFwiLCBcImdvaXNcIiwgXCJbXmddcmllbnRcIiwgXCJbYWVpb3VdeVthZWlvdV1cIiwgXCJieWlcIiwgXCJ5w6RcIiwgXCJbYS16XXlbYW9dXCIsIFwieWF1XCIsIFwia29vclwiLCBcInNjaWVudFwiLCBcImVyaWVsXCIsIFwiW2RnXW9pbmdcIiBdLFxuXHRcdFx0XHRcImNvdW50TW9kaWZpZXJcIjogMVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0XCJmcmFnbWVudHNcIjogWyBcImVhdcO8XCIsIFwiaW9pXCIsIFwiaW9vXCIsIFwiaW9hXCIsIFwiaWlpXCIsIFwib2FpXCIsIFwiZXVldVwiIF0sXG5cdFx0XHRcdFwiY291bnRNb2RpZmllclwiOiAxXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRcIndvcmRzXCI6IHtcblx0XHRcdFwiZnVsbFwiOiBbXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmVhY2hcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImJlYXRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImJlYXVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImJlYXVuZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmVsbGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImJvdWNoZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYnJha2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImNhY2hlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJjYWNoZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2hhaXNlbG9uZ3VlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJjaG9rZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY29yZGlhbGVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImNvcmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImRvcGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImVhdFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZXllXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJmYWtlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJmYW1lXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJmYXRpZ3VlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJmZW1tZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZm9yY2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImdhbWVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImdhbWVzXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJnYXRlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJncmFuZGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImljZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaW9uXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJqb2tlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJqdXBlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJtYWlzY2hcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcIm1haXNjaGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcIm1vdmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcIm5hdGl2ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwibmljZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwib25lXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJwaXBlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJwcmltZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmF0ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmh5dGhtXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJyaWRlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJyaWRlc1wiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmllblwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2F2ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2NpZW5jZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2nDqGNsZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2l0ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3VpdGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInRha2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInRhdXBlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJ1bml2ZXJzZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwidm9ndWVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcIndhdmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInppb25cIiwgXCJzeWxsYWJsZXNcIjogMn1cblx0XHRcdF0sXG5cdFx0XHRcImZyYWdtZW50c1wiOiB7XG5cdFx0XHRcdFwiZ2xvYmFsXCI6IFtcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImFicmVha3Rpb25cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYWR3YXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImFmZmFpcmVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYWlndWnDqHJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImFuaXNldHRlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImFwcGVhbFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiYWNrc3RhZ2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmFua3JhdGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmFzZWJhbGxcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmFzZWp1bXBcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmVhY2hjb21iZXJcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmVhY2h2b2xsZXliYWxsXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJlYWdsZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiZWFtZXJcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmVhbWVyXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImLDqWFybmFpc2VcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmVhdWZvcnRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmVhdWpvbGFpc1wiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiZWF1dMOpXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJlYXV0eVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiZWxnaWVyXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJlc3RpZW5cIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmlza3VpdFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJibGVhY2hcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmx1ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJib2FyZFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJib2F0XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJvZHlzdWl0XCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJvcmRlbGFpc2VcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYnJlYWtcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYnVpbGRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYnVyZWF1XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJ1c2luZXNzXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNhYnJpb1wiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYWJyaW9sZXRcIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2FjaGVzZXhlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNhbWFpZXVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2FueW9uXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNhc2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2F0c3VpdFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjZW50aW1lXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNoYWlzZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjaGFtcGlvblwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjaGFtcGlvbmF0XCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNoYXBpdGVhdVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjaGF0ZWF1XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNow6J0ZWF1XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNoZWF0XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNoZWVzZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjaGlodWFodWFcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2hvaWNlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNpcmNvbmZsZXhlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNsZWFuXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNsb2NoZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjbG9zZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjbG90aGVzXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNvbW1lcmNlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNyaW1lXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNyb3NzcmF0ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjdWlzaW5lXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImN1bG90dGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZGVhdGhcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZGVmZW5zZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJkw6l0ZW50ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJkcmVhZFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJkcmVhbVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJkcmVzc2NvZGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZHVuZ2VvblwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJlYXN5XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImVuZ2FnZW1lbnRcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZW50ZW50ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJleWUtY2F0Y2hlclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJleWVjYXRjaGVyXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImV5ZWxpbmVyXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImV5ZXdvcmRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmFzaGlvblwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmZWF0dXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZlcmllblwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmaW5lbGluZXJcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmlzaGV5ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmbGFrZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmbGFtYmVhdVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmbGF0cmF0ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmbGVlY2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZnJhw65jaGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZnJlYWtcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZnJpdGVzXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZ1dHVyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnYWVsaWNcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2FtZS1zaG93XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdhbWVib3lcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2FtZXBhZFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnYW1lcGxheVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnYW1lcG9ydFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnYW1lc2hvd1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnYXJpZ3VlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdhcnJpZ3VlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdhdGVmb2xkXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdhdGV3YXlcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2VmbGFzaGVkXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdlb3JnaWVyXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdvYWxcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ3JhcGVmcnVpdFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJncmVhdFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJncm91cHdhcmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ3VldWxlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImd1aWRlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImd1aWxsb2NoZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJneW7DpHplZW5cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ3luw7Z6ZWVuXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhhaXJjYXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhhcmRjb3JlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhhcmR3YXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhlYWRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaGVhcmluZ1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoZWFydFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoZWF2eVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoZWRnZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoZXJvaW5cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaW5jbHVzaXZlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImluaXRpYXRpdmVcIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaW5zaWRlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImphZ3VhclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJqYWxvdXNldHRlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImplYW5zXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImpldW5lc3NlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImp1aWNlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImp1a2Vib3hcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwianVtcHN1aXRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwia2FuYXJpZW5cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwia2FwcmlvbGVcIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwia2Fyb3NzZXJpZWxpbmllXCIsIFwic3lsbGFibGVzXCI6IDYgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImtvbm9wZWVuXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxhY3Jvc3NlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxhcGxhY2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibGF0ZS1cIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibGVhZFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsZWFndWVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibGVhcm5cIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibMOpZ2nDqHJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxpemVuemlhdFwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsb2FkXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxvdHRlcmllbG9zXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxvdW5nZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJseXplZW5cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWFkYW1lXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1hZGVtb2lzZWxsZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtYWdpZXJcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWFrZS11cFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtYWx3YXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1hbmFnZW1lbnRcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWFudGVhdVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtYXVzb2xlZW5cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWF1dmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWVkaWVuXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1lc2RhbWVzXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1lc29wb3RhbWllblwiLCBcInN5bGxhYmxlc1wiOiA2IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtaWxsaWFyZGVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWlzc2lsZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtaXN6ZWxsYW5lZW5cIiwgXCJzeWxsYWJsZXNcIjogNSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibW91c3NlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1vdXNzZWxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibXVzZWVuXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm11c2V0dGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibmFodWF0bFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJub2lzZXR0ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJub3RlYm9va1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJudWFuY2VcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibnVrbGVhc2VcIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwib2RlZW5cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwib2ZmbGluZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJvZmZzaWRlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm9sZWFzdGVyXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm9uLXN0YWdlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm9ubGluZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJvcnBoZWVuXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBhcmZvcmNlcml0dFwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwYXRpZW5zXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBhdGllbnRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGVhY2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGVhY2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGVhbnV0c1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwZW9wbGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGVyaW5lZW5cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGVyaXRvbmVlblwiLCBcInN5bGxhYmxlc1wiOiA1IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwaWN0dXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBpZWNlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBpcGVsaW5lXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBsYXRlYXVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicG9lc2llXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBvbGVwb3NpdGlvblwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwb3J0ZW1hbnRlYXVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicG9ydGVtb25uYWllXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInByaW1lcmF0ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwcmltZXJhdGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicHJpbWV0aW1lXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInByb3RlYXNlXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInByb3RlaW5cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicHJ5dGFuZWVuXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInF1b3RpZW50XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJhZGlvXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJlYWRlclwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyZWFkeVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyZWFsbGlmZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyZXBlYXRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmV0YWtlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJpZ29sZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyaXNvbGxlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJvYWRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicm9hbWluZ1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyb3F1ZWZvcnRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2FmZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzYXZvbmV0dGVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2NpZW5jZWZpY3Rpb25cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2VhcmNoXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNlbGZtYWRlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNlcHRpbWVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2VyYXBlZW5cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2VydmljZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzZXJ2aWV0dGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2hhcmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2hhdmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2hvcmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2lkZWJhclwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzaWRlYm9hcmRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2lkZWtpY2tcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2lsaG91ZXR0ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzaXRlbWFwXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNsaWRlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNuZWFrXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNvYXBcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic29mdGNvcmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic29mdHdhcmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic291dGFuZWxsZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzcGVha1wiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzcGVjaWFsXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNwcmFjaGVpbnN0ZWxsdW5nXCIsIFwic3lsbGFibGVzXCI6IDUgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNweXdhcmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3F1YXJlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0YWdlZGl2aW5nXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0YWtlaG9sZGVyXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0YXRlbWVudFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdGVhZHlcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RlYWtcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RlYWx0aFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdGVhbVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdG9uZWRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RyYWNjaWF0ZWxsYVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdHJlYW1cIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RyaWRlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0cmlrZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdWl0Y2FzZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzd2VlcHN0YWtlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInQtYm9uZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0LXNoaXJ0XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRhaWxnYXRlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRha2Utb2ZmXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRha2Utb3ZlclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0YWtlYXdheVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0YWtlb2ZmXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRha2VvdmVyXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRocm9hdFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0aW1lLW91dFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0aW1lbGFnXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRpbWVsaW5lXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRpbWVzaGFyaW5nXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRvYXN0XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRyYXViZW5tYWlzY2hlXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRyaXN0ZXNzZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ1c2VuZXRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidmFyaWV0w6R0XCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInZhcmlldMOpXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInZpbmFpZ3JldHRlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInZpbnRhZ2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidmlvbGV0dFwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ2b2ljZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ3YWtlYm9hcmRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwid2FzaGVkXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIndhdmVib2FyZFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ3ZWFyXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIndlYXJcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwid2Vic2l0ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ3aGl0ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ3aWRlc2NyZWVuXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIndpcmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwieWFjaHRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwieW9ya3NoaXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIsOpcHJvdXZldHRlXCIsIFwic3lsbGFibGVzXCI6IDMsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnYWxldHRlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnaWd1ZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ3Jvb3ZlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtb3JndWVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBhaWxsZXR0ZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmFjbGV0dGVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJvdWxldHRlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzcGlrZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3R5bGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRhYmxldHRlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJncnVuZ2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNpemVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInZhbHVlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJxdWljaGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhvdXNlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwic1wiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2F1Y2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJzXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzcGFjZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImFpcmxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhdXRvc2F2ZVwiLCBcInN5bGxhYmxlc1wiOiAzLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJhZ3BpcGVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiaWtlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZGFuY2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJkZWFkbGluZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhhbGZwaXBlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaGVhZGxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJob21lXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaG9ybnBpcGVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJob3RsaW5lXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaW5mb2xpbmVcIiwgXCJzeWxsYWJsZXNcIjogMywgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJpbmxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJraXRlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicm9sbGVyYmxhZGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzY29yZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNreWxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzbGFja2xpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzbGljZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInJcIiwgXCJzXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzbm9vemVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdG9yeWxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMywgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJvZmZpY2VcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcInNcIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzcGFjZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInNcIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0ZWFzZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInNcIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYWNoZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1widFwiXSB9XG5cdFx0XHRcdF0sXG5cdFx0XHRcdFwiYXRCZWdpbm5pbmdPckVuZFwiOiBbXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYXNlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxpZmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGVha1wiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0ZWFtXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNyZW1lXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY3LDqG1lXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZHJpdmVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJza2F0ZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInVwZGF0ZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInVwZ3JhZGVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH1cblx0XHRcdFx0XSxcblx0XHRcdFx0XCJhdEJlZ2lubmluZ1wiOiBbXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhbmlvblwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmYWNlbGlmdFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJqaXVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGFjZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzaGFrZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0ZWFcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidHJhZGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZGVhbFwiLCBcInN5bGxhYmxlc1wiOiAxIH1cblx0XHRcdFx0XSxcblx0XHRcdFx0XCJhdEVuZFwiOiBbXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmYWNlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZpbGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibW91c3NlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBsYXRlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRhcGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYnl0ZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcImFsc29Gb2xsb3dlZEJ5XCI6IFtcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNhcGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbXCJzXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmaXZlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwiYWxzb0ZvbGxvd2VkQnlcIjogW1wic1wiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaHlwZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcImFsc29Gb2xsb3dlZEJ5XCI6IFtcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxlYWtcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbXCJzXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsaWtlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwiYWxzb0ZvbGxvd2VkQnlcIjogW1wic1wiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWFrZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcImFsc29Gb2xsb3dlZEJ5XCI6IFtcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBob25lXCIsIFwic3lsbGFibGVzXCI6IDEsIFwiYWxzb0ZvbGxvd2VkQnlcIjogW1wic1wiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmF2ZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcImFsc29Gb2xsb3dlZEJ5XCI6IFtcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJlZ2ltZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcImFsc29Gb2xsb3dlZEJ5XCI6IFtcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0YXR1ZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcImFsc29Gb2xsb3dlZEJ5XCI6IFtcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0b3JlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwiYWxzb0ZvbGxvd2VkQnlcIjogW1wic1wiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwid2F2ZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcImFsc29Gb2xsb3dlZEJ5XCI6IFtcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImRhdGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImltYWdlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJzXCJdIH1cblx0XHRcdFx0XVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuIiwibW9kdWxlLmV4cG9ydHM9e1xuXHRcInZvd2Vsc1wiOiBcImFlaW91eVwiLFxuXHRcImRldmlhdGlvbnNcIjoge1xuXHRcdFwidm93ZWxzXCI6IFtcblx0XHRcdHtcblx0XHRcdFx0XCJmcmFnbWVudHNcIjogWyBcImNpYWxcIiwgXCJ0aWFcIiwgXCJjaXVzXCIsIFwiZ2l1XCIsIFwiaW9uXCIsXG5cdFx0XHRcdFx0XCJbXmJkbnBydl1pb3VcIiwgXCJzaWEkXCIsIFwiW15hZWl1b3RdezIsfWVkJFwiLCBcIlthZWlvdXldW15hZWl1b3l0c117MSx9ZSRcIixcblx0XHRcdFx0XHRcIlthLXpdZWx5JFwiLCBcIltjZ3ldZWQkXCIsIFwicnZlZCRcIiwgXCJbYWVpb3V5XVtkdF1lcz8kXCIsIFwiZWF1XCIsIFwiaWV1XCIsXG5cdFx0XHRcdFx0XCJvZXVcIiwgXCJbYWVpb3V5XVteYWVpb3V5ZHRdZVtzZF0/JFwiLCBcIlthZW91eV1yc2UkXCIsIFwiXmV5ZVwiIF0sXG5cdFx0XHRcdFwiY291bnRNb2RpZmllclwiOiAtMVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0XCJmcmFnbWVudHNcIjogWyBcImlhXCIsIFwiaXVcIiwgXCJpaVwiLCBcImlvXCIsIFwiW2FlaW9dW2FlaW91XXsyfVwiLCBcIlthZWlvdV1pbmdcIiwgXCJbXmFlaW91XXlpbmdcIiwgXCJ1aVthZW91XVwiIF0sXG5cdFx0XHRcdFwiY291bnRNb2RpZmllclwiOiAxXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRcImZyYWdtZW50c1wiOiBbIFwiXnJlZVtqbW5wcXJzeF1cIiwgXCJecmVlbGVcIiwgXCJecmVldmFcIiwgXCJyaWV0XCIsXG5cdFx0XHRcdFx0XCJkaWVuXCIsIFwiW2FlaW91eW1dW2JkcF1sZSRcIiwgXCJ1ZWlcIiwgXCJ1b3VcIixcblx0XHRcdFx0XHRcIl5tY1wiLCBcImlzbSRcIiwgXCJbXmxdbGllblwiLCBcIl5jb2FbZGdseF0uXCIsXG5cdFx0XHRcdFx0XCJbXmdxYXVpZW9ddWFbXmF1aWVvXVwiLCBcImRuJ3QkXCIsIFwidWl0eSRcIiwgXCJpZShyfHN0KVwiLFxuXHRcdFx0XHRcdFwiW2FlaW91d115W2FlaW91XVwiLCBcIlteYW9daXJlW2RzXVwiLCBcIlteYW9daXJlJFwiIF0sXG5cdFx0XHRcdFwiY291bnRNb2RpZmllclwiOiAxXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRcImZyYWdtZW50c1wiOiBbIFwiZW9hXCIsIFwiZW9vXCIsIFwiaW9hXCIsIFwiaW9lXCIsIFwiaW9vXCIgXSxcblx0XHRcdFx0XCJjb3VudE1vZGlmaWVyXCI6IDFcblx0XHRcdH1cblx0XHRdLFxuXHRcdFwid29yZHNcIjoge1xuXHRcdFx0XCJmdWxsXCI6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFwid29yZFwiOiBcImJ1c2luZXNzXCIsXG5cdFx0XHRcdFx0XCJzeWxsYWJsZXNcIjogMlxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0XCJ3b3JkXCI6IFwiY29oZWlyZXNzXCIsXG5cdFx0XHRcdFx0XCJzeWxsYWJsZXNcIjogM1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0XCJ3b3JkXCI6IFwiY29sb25lbFwiLFxuXHRcdFx0XHRcdFwic3lsbGFibGVzXCI6IDJcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFwid29yZFwiOiBcImhlaXJlc3NcIixcblx0XHRcdFx0XHRcInN5bGxhYmxlc1wiOiAyXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRcIndvcmRcIjogXCJpLmVcIixcblx0XHRcdFx0XHRcInN5bGxhYmxlc1wiOiAyXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRcIndvcmRcIjogXCJzaG9yZWxpbmVcIixcblx0XHRcdFx0XHRcInN5bGxhYmxlc1wiOiAyXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRcIndvcmRcIjogXCJzaW1pbGVcIixcblx0XHRcdFx0XHRcInN5bGxhYmxlc1wiOiAzXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRcIndvcmRcIjogXCJ1bmhlaXJlZFwiLFxuXHRcdFx0XHRcdFwic3lsbGFibGVzXCI6IDJcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFwid29yZFwiOiBcIndlZG5lc2RheVwiLFxuXHRcdFx0XHRcdFwic3lsbGFibGVzXCI6IDJcblx0XHRcdFx0fVxuXHRcdFx0XSxcblx0XHRcdFwiZnJhZ21lbnRzXCI6IHtcblx0XHRcdFx0XCJnbG9iYWxcIjogW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFwid29yZFwiOiBcImNveW90ZVwiLFxuXHRcdFx0XHRcdFx0XCJzeWxsYWJsZXNcIjogM1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XCJ3b3JkXCI6IFwiZ3JhdmV5YXJkXCIsXG5cdFx0XHRcdFx0XHRcInN5bGxhYmxlc1wiOiAyXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcIndvcmRcIjogXCJsYXd5ZXJcIixcblx0XHRcdFx0XHRcdFwic3lsbGFibGVzXCI6IDJcblx0XHRcdFx0XHR9XG5cdFx0XHRcdF1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJ2b3dlbHNcIjogXCJhw6HDpMOiZcOpw6vDqmnDrcOvw65vw7PDtsO0dcO6w7zDu3lcIixcblx0XCJkZXZpYXRpb25zXCI6IHtcblx0XHRcInZvd2Vsc1wiOiBbXG5cdFx0XHR7XG5cdFx0XHRcdFwiZnJhZ21lbnRzXCI6IFsgXCJ1ZSRcIiwgXCJkZ2UkXCIsIFwiW3RjcF1pw6tudFwiLFxuXHRcdFx0XHRcdFwiYWNlJFwiLCBcIlticl1lYWNoXCIsIFwiW2FpbnByXXRpYWFsXCIsIFwiW2lvXXRpYWFuXCIsXG5cdFx0XHRcdFx0XCJndWFbeWNdXCIsIFwiW15pXWRlYWxcIiwgXCJ0aXZlJFwiLCBcImxvYWRcIiwgXCJbXmVdY29rZVwiLFxuXHRcdFx0XHRcdFwiW15zXWNvcmUkXCIgXSxcblx0XHRcdFx0XCJjb3VudE1vZGlmaWVyXCI6IC0xXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRcImZyYWdtZW50c1wiOiBbIFwiYcOkXCIsIFwiYWV1XCIsIFwiYWllXCIsIFwiYW9cIiwgXCLDq1wiLCBcImVvXCIsXG5cdFx0XHRcdFx0XCJlw7pcIiwgXCJpZWF1XCIsIFwiZWEkXCIsIFwiZWFbXnVdXCIsIFwiZWlbZWpdXCIsXG5cdFx0XHRcdFx0XCJldVtpdV1cIiwgXCLDr1wiLCBcImllaVwiLCBcImllbm5lXCIsIFwiW15sXWlldVted11cIixcblx0XHRcdFx0XHRcIltebF1pZXUkXCIsIFwiaVthdWl5XVwiLCBcInN0aW9uXCIsXG5cdFx0XHRcdFx0XCJbXmNzdHhdaW9cIiwgXCJec2lvblwiLCBcInJpw6hcIiwgXCJvw7ZcIiwgXCJvYVwiLCBcIm9laW5nXCIsXG5cdFx0XHRcdFx0XCJvaWVcIiwgXCJbZXVdw7xcIiwgXCJbXnFddVthZcOob11cIiwgXCJ1aWVcIixcblx0XHRcdFx0XHRcIltiaG5wcl1pZWVsXCIsIFwiW2JobnByXWnDq2xcIiBdLFxuXHRcdFx0XHRcImNvdW50TW9kaWZpZXJcIjogMVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0XCJmcmFnbWVudHNcIjogWyBcIlthZW9sdV15W2Flw6nDqG/Ds3VdXCIgXSxcblx0XHRcdFx0XCJjb3VudE1vZGlmaWVyXCI6IDFcblx0XHRcdH1cblx0XHRdLFxuXHRcdFwid29yZHNcIjoge1xuXHRcdFx0XCJmdWxsXCI6IFtcblx0XHRcdFx0eyBcIndvcmRcIjogXCJieWVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImNvcmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImN1cmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImRlaVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZG9wZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZHVkZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmFrZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmFtZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZml2ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaG9sZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwibGVhc3RcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImxvbmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcIm1pbnV0ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwibW92ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwibmljZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwib25lXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJzdGF0ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3VycGxhY2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInRha2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInRyYWRlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJ3aWRlXCIsIFwic3lsbGFibGVzXCI6IDEgfVxuXHRcdFx0XSxcblx0XHRcdFwiZnJhZ21lbnRzXCI6IHtcblx0XHRcdFx0XCJnbG9iYWxcIjogW1xuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYWRpZXVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYWlybGluZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhaXJtaWxlc1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhbGllblwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhbWJpZW50XCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImFubm91bmNlbWVudFwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhcHBlYXJhbmNlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImFwcGVhc2VtZW50XCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImF0aGVuZXVtXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImF3ZXNvbWVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmFjY2FsYXVyZWlcIiwgXCJzeWxsYWJsZXNcIjogNSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmFjY2FsYXVyZXVzXCIsIFwic3lsbGFibGVzXCI6IDUgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJhc2ViYWxsXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJhc2VqdW1wXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJhbmxpZXVlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJhcGFvXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJhcmJlY3VlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJlYW1lclwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiZWFuaWVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmVhdFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiZWxsZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiw6p0ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiaW5nZXdhdGNoXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJsb2Nub3RlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJsdWVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYm9hcmRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYnJlYWtcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYnJvYWRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYnVsbHMtZXllXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJ1c2luZXNzXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJ5ZWJ5ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYWNhb1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYWVzYXJcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2FtYWlldVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYW91dGNob3VjXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNhcmJvbGluZXVtXCIsIFwic3lsbGFibGVzXCI6IDUgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNhdGNocGhyYXNlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNhcnJpZXJcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2hlYXRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2hlZXNlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNpcmNvbmZsZXhlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNsZWFuXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNsb2FrXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNvYnV5aW5nXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNvbWViYWNrXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNvbWZvcnR6b25lXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNvbW11bmlxdcOpXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNvbm9wZXVtXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNvbnNvbGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY29ycG9yYXRlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNvw7t0ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjcmVhbWVyXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNyaW1lXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNydWVzbGlcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZGVhZGxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZGVhdXRvcmlzZXJlblwiLCBcInN5bGxhYmxlc1wiOiA2IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJkZXVjZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJkZXVtXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImRpcm5kbFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJkcmVhZFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJkcmVhbXRlYW1cIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZHJvbmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZW5xdcOqdGVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZXNjYXBlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImV4cG9zdXJlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImV4dHJhbmVpXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImV4dHJhbmV1c1wiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJleWVjYXRjaGVyXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImV5ZWxpbmVyXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImV5ZW9wZW5lclwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJleWV0cmFja2VyXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImV5ZXRyYWNraW5nXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZhaXJ0cmFkZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmYXV0ZXVpbFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmZWF0dXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZldWlsbGV0ZWVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmV1aWxsZXRvblwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmaXNoZXllXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZpbmVsaW5lclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmaW5ldHVuZW5cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZm9yZWhhbmRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZnJlYWtcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZnVzaW9uZXJlblwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnYXlwYXJhZGVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2F5cHJpZGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ29hbFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJncmFwZWZydWl0XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdydXnDqHJlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImd1ZWxlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImd1ZXJyaWxsYVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJndWVzdFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoYXJkd2FyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoYXV0ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoZWFsaW5nXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhlYXRlclwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoZWF2eVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJob2F4XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhvdGxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaWRlZS1maXhlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImluY2x1c2l2ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJpbmxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaW50YWtlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImludGVuc2l2ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJqZWFuc1wiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJKb25lc1wiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJqdWJpbGV1bVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJrYWxmc3JpYmV5ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJrcmFhaWVubmVzdFwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsYXN0bWludXRlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxlYXJuaW5nXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxlYWd1ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsaW5lLXVwXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxpbm9sZXVtXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxvYWRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibG9hZmVyXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxvbmdyZWFkXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxvb2thbGlrZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsb3Vpc1wiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJseWNldW1cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWFnYXppbmVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWFpbnN0cmVhbVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtYWtlLW92ZXJcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWFrZS11cFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtYWx3YXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1hcm1vbGV1bVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtYXVzb2xldW1cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWVkZWF1dGV1clwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtaWRsaWZlY3Jpc2lzXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1pZ3JhaW5lYXVyYVwiLCBcInN5bGxhYmxlc1wiOiA1IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtaWxrc2hha2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWlsbGVmZXVpbGxlXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1peGVkXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm11ZXNsaVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtdXNldW1cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibXVzdC1oYXZlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm11c3QtcmVhZFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJub3RlYm9va1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJub25zZW5zZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJub3doZXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm51cnR1cmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwib2ZmbGluZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJvbmVsaW5lclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJvbmVzaWVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwib25saW5lXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm9waW5pb25cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGFlbGxhXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBhY2VtYWtlclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwYW5hY2hlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBhcGVnYWFpZW5uZXVzXCIsIFwic3lsbGFibGVzXCI6IDUgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBhc3NlLXBhcnRvdXRcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGVhbnV0c1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwZXJpZ2V1bVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwZXJpbmV1bVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwZXJwZXR1dW1cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGV0cm9sZXVtXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBob25lXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBpY3R1cmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGxhY2VtYXRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicG9ydGUtbWFudGVhdVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwb3J0ZWZldWlsbGVcIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicHJlc3NlLXBhcGllclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwcmltZXRpbWVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicXVlZW5cIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicXVlc3Rpb25uYWlyZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJxdWV1ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyZWFkZXJcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmVhbGl0eVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyZWFsbGlmZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyZW1ha2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmVwZWF0XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJlcGVydG9pcmVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmVzZWFyY2hcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmV2ZXJlbmNlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJpYmV5ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyaW5ndG9uZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyb2FkXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJvYW1pbmdcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2NpZW5jZWZpY3Rpb25cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2VsZm1hZGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2lkZWtpY2tcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2lnaHRzZWVpbmdcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2t5bGluZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzbWlsZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzbmVha3lcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic29mdHdhcmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3BhcmVyaWJcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3BlYWtlclwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzcHJlYWRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RhdGVtZW50XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0ZWFrXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0ZWVwbGVjaGFzZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdG9uZXdhc2hcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RvcmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RyZWFrZW5cIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RyZWFtXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0cmVldHdhcmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3VwZXJzb2FrZXJcIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3VycHJpc2UtcGFydHlcIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3dlYXRlclwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0ZWFzZXJcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGVudWVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGVtcGxhdGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGltZWxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGlzc3VlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRvYXN0XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInTDqnRlLcOgLXTDqnRlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInR5cGVjYXN0XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInVuaXF1ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ1cmV1bVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ2aWJlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInZpZXV4XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInZpbGxlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInZpbnRhZ2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwid2FuZGVseXVwXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIndpc2VndXlcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwid2FrZS11cC1jYWxsXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIndlYmNhcmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwid2luZWd1bVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiYXNlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiZVwiLCBcIm5cIiwgXCJyXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2FtZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJsXCIsIFwiclwiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0eWxlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJkb3VjaGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNwYWNlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdHJpcHRlYXNlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJqaXZlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInJcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJrZXlub3RlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInJcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtb3VudGFpbmJpa2VcIiwgXCJzeWxsYWJsZXNcIjogMywgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZhY2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwidFwiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNoYWxsZW5nZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJyXCIsIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNydWlzZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJyXCIsIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhvdXNlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInJcIiwgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZGFuY2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmcmFuY2hpc2VcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmcmVlbGFuY2VcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsZWFzZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJyXCIsIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxpbmVkYW5jZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJyXCIsIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxvdW5nZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJyXCIsIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1lcmNoYW5kaXNlXCIsIFwic3lsbGFibGVzXCI6IDMsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInJcIiwgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGVyZm9ybWFuY2VcIiwgXCJzeWxsYWJsZXNcIjogMywgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyZWxlYXNlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInJcIiwgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmVzb3VyY2VcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYWNoZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcImNcIiwgXCJsXCIsIFwiblwiLCBcInRcIiwgXCJ4XCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwib2ZmaWNlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiclwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjbG9zZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcInJcIiwgXCJ0XCIgXSB9XG5cdFx0XHRcdF0sXG5cdFx0XHRcdFwiYXRCZWdpbm5pbmdPckVuZFwiOiBbXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJieXRlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNha2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2FyZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjb2FjaFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjb2F0XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImVhcmxcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZm9hbVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnYXRlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhlYWRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaG9tZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsaXZlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNhZmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2l0ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzb2FwXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRlYWtcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGVhbVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ3YXZlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJyYWNlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNhc2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmxlZWNlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNlcnZpY2VcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidm9pY2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwia2l0ZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJyXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2thdGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJhY2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiLCBcInNcIiBdIH1cblx0XHRcdFx0XSxcblx0XHRcdFx0XCJhdEJlZ2lubmluZ1wiOiBbXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjb2tlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImRlYWxcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaW1hZ2VcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJzXCIgXSB9XG5cdFx0XHRcdF0sXG5cdFx0XHRcdFwiYXRFbmRcIjogW1xuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZm9yY2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGVhXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRpbWVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZGF0ZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcImFsc29Gb2xsb3dlZEJ5XCI6IFsgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaHlwZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcImFsc29Gb2xsb3dlZEJ5XCI6IFsgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicXVvdGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRhcGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInVwZ3JhZGVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbIFwic1wiIF0gfVxuXHRcdFx0XHRdXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG4iLCIvKipcbiAqIFRoZSBmdW5jdGlvbiBnZXR0aW5nIHRoZSBsYW5ndWFnZSBwYXJ0IG9mIHRoZSBsb2NhbGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGxvY2FsZSBUaGUgbG9jYWxlLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGxhbmd1YWdlIHBhcnQgb2YgdGhlIGxvY2FsZS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggbG9jYWxlICkge1xuXHRyZXR1cm4gbG9jYWxlLnNwbGl0KCBcIl9cIiApWyAwIF07XG59O1xuIiwidmFyIGJsb2NrRWxlbWVudHMgPSBbIFwiYWRkcmVzc1wiLCBcImFydGljbGVcIiwgXCJhc2lkZVwiLCBcImJsb2NrcXVvdGVcIiwgXCJjYW52YXNcIiwgXCJkZFwiLCBcImRpdlwiLCBcImRsXCIsIFwiZmllbGRzZXRcIiwgXCJmaWdjYXB0aW9uXCIsXG5cdFwiZmlndXJlXCIsIFwiZm9vdGVyXCIsIFwiZm9ybVwiLCBcImgxXCIsIFwiaDJcIiwgXCJoM1wiLCBcImg0XCIsIFwiaDVcIiwgXCJoNlwiLCBcImhlYWRlclwiLCBcImhncm91cFwiLCBcImhyXCIsIFwibGlcIiwgXCJtYWluXCIsIFwibmF2XCIsXG5cdFwibm9zY3JpcHRcIiwgXCJvbFwiLCBcIm91dHB1dFwiLCBcInBcIiwgXCJwcmVcIiwgXCJzZWN0aW9uXCIsIFwidGFibGVcIiwgXCJ0Zm9vdFwiLCBcInVsXCIsIFwidmlkZW9cIiBdO1xudmFyIGlubGluZUVsZW1lbnRzID0gWyBcImJcIiwgXCJiaWdcIiwgXCJpXCIsIFwic21hbGxcIiwgXCJ0dFwiLCBcImFiYnJcIiwgXCJhY3JvbnltXCIsIFwiY2l0ZVwiLCBcImNvZGVcIiwgXCJkZm5cIiwgXCJlbVwiLCBcImtiZFwiLCBcInN0cm9uZ1wiLFxuXHRcInNhbXBcIiwgXCJ0aW1lXCIsIFwidmFyXCIsIFwiYVwiLCBcImJkb1wiLCBcImJyXCIsIFwiaW1nXCIsIFwibWFwXCIsIFwib2JqZWN0XCIsIFwicVwiLCBcInNjcmlwdFwiLCBcInNwYW5cIiwgXCJzdWJcIiwgXCJzdXBcIiwgXCJidXR0b25cIixcblx0XCJpbnB1dFwiLCBcImxhYmVsXCIsIFwic2VsZWN0XCIsIFwidGV4dGFyZWFcIiBdO1xuXG52YXIgYmxvY2tFbGVtZW50c1JlZ2V4ID0gbmV3IFJlZ0V4cCggXCJeKFwiICsgYmxvY2tFbGVtZW50cy5qb2luKCBcInxcIiApICsgXCIpJFwiLCBcImlcIiApO1xudmFyIGlubGluZUVsZW1lbnRzUmVnZXggPSBuZXcgUmVnRXhwKCBcIl4oXCIgKyBpbmxpbmVFbGVtZW50cy5qb2luKCBcInxcIiApICsgXCIpJFwiLCBcImlcIiApO1xuXG52YXIgYmxvY2tFbGVtZW50U3RhcnRSZWdleCA9IG5ldyBSZWdFeHAoIFwiXjwoXCIgKyBibG9ja0VsZW1lbnRzLmpvaW4oIFwifFwiICkgKyBcIilbXj5dKj8+JFwiLCBcImlcIiApO1xudmFyIGJsb2NrRWxlbWVudEVuZFJlZ2V4ID0gbmV3IFJlZ0V4cCggXCJePC8oXCIgKyBibG9ja0VsZW1lbnRzLmpvaW4oIFwifFwiICkgKyBcIilbXj5dKj8+JFwiLCBcImlcIiApO1xuXG52YXIgaW5saW5lRWxlbWVudFN0YXJ0UmVnZXggPSBuZXcgUmVnRXhwKCBcIl48KFwiICsgaW5saW5lRWxlbWVudHMuam9pbiggXCJ8XCIgKSArIFwiKVtePl0qPiRcIiwgXCJpXCIgKTtcbnZhciBpbmxpbmVFbGVtZW50RW5kUmVnZXggPSBuZXcgUmVnRXhwKCBcIl48LyhcIiArIGlubGluZUVsZW1lbnRzLmpvaW4oIFwifFwiICkgKyBcIilbXj5dKj4kXCIsIFwiaVwiICk7XG5cbnZhciBvdGhlckVsZW1lbnRTdGFydFJlZ2V4ID0gL148KFtePlxcc1xcL10rKVtePl0qPiQvO1xudmFyIG90aGVyRWxlbWVudEVuZFJlZ2V4ID0gL148XFwvKFtePlxcc10rKVtePl0qPiQvO1xuXG52YXIgY29udGVudFJlZ2V4ID0gL15bXjxdKyQvO1xudmFyIGdyZWF0ZXJUaGFuQ29udGVudFJlZ2V4ID0gL148W14+PF0qJC87XG5cbnZhciBjb21tZW50UmVnZXggPSAvPCEtLSgufFtcXHJcXG5dKSo/LS0+L2c7XG5cbnZhciBjb3JlID0gcmVxdWlyZSggXCJ0b2tlbml6ZXIyL2NvcmVcIiApO1xudmFyIGZvckVhY2ggPSByZXF1aXJlKCBcImxvZGFzaC9mb3JFYWNoXCIgKTtcbnZhciBtZW1vaXplID0gcmVxdWlyZSggXCJsb2Rhc2gvbWVtb2l6ZVwiICk7XG5cbnZhciB0b2tlbnMgPSBbXTtcbnZhciBodG1sQmxvY2tUb2tlbml6ZXI7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHRva2VuaXplciB0byB0b2tlbml6ZSBIVE1MIGludG8gYmxvY2tzLlxuICovXG5mdW5jdGlvbiBjcmVhdGVUb2tlbml6ZXIoKSB7XG5cdHRva2VucyA9IFtdO1xuXG5cdGh0bWxCbG9ja1Rva2VuaXplciA9IGNvcmUoIGZ1bmN0aW9uKCB0b2tlbiApIHtcblx0XHR0b2tlbnMucHVzaCggdG9rZW4gKTtcblx0fSApO1xuXG5cdGh0bWxCbG9ja1Rva2VuaXplci5hZGRSdWxlKCBjb250ZW50UmVnZXgsIFwiY29udGVudFwiICk7XG5cdGh0bWxCbG9ja1Rva2VuaXplci5hZGRSdWxlKCBncmVhdGVyVGhhbkNvbnRlbnRSZWdleCwgXCJncmVhdGVyLXRoYW4tc2lnbi1jb250ZW50XCIgKTtcblxuXHRodG1sQmxvY2tUb2tlbml6ZXIuYWRkUnVsZSggYmxvY2tFbGVtZW50U3RhcnRSZWdleCwgXCJibG9jay1zdGFydFwiICk7XG5cdGh0bWxCbG9ja1Rva2VuaXplci5hZGRSdWxlKCBibG9ja0VsZW1lbnRFbmRSZWdleCwgXCJibG9jay1lbmRcIiApO1xuXHRodG1sQmxvY2tUb2tlbml6ZXIuYWRkUnVsZSggaW5saW5lRWxlbWVudFN0YXJ0UmVnZXgsIFwiaW5saW5lLXN0YXJ0XCIgKTtcblx0aHRtbEJsb2NrVG9rZW5pemVyLmFkZFJ1bGUoIGlubGluZUVsZW1lbnRFbmRSZWdleCwgXCJpbmxpbmUtZW5kXCIgKTtcblxuXHRodG1sQmxvY2tUb2tlbml6ZXIuYWRkUnVsZSggb3RoZXJFbGVtZW50U3RhcnRSZWdleCwgXCJvdGhlci1lbGVtZW50LXN0YXJ0XCIgKTtcblx0aHRtbEJsb2NrVG9rZW5pemVyLmFkZFJ1bGUoIG90aGVyRWxlbWVudEVuZFJlZ2V4LCBcIm90aGVyLWVsZW1lbnQtZW5kXCIgKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBlbGVtZW50IG5hbWUgaXMgYSBibG9jayBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBodG1sRWxlbWVudE5hbWUgVGhlIG5hbWUgb2YgdGhlIEhUTUwgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCBpdCBpcyBhIGJsb2NrIGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIGlzQmxvY2tFbGVtZW50KCBodG1sRWxlbWVudE5hbWUgKSB7XG5cdHJldHVybiBibG9ja0VsZW1lbnRzUmVnZXgudGVzdCggaHRtbEVsZW1lbnROYW1lICk7XG59XG5cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gZWxlbWVudCBuYW1lIGlzIGFuIGlubGluZSBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBodG1sRWxlbWVudE5hbWUgVGhlIG5hbWUgb2YgdGhlIEhUTUwgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCBpdCBpcyBhbiBpbmxpbmUgZWxlbWVudC5cbiAqL1xuZnVuY3Rpb24gaXNJbmxpbmVFbGVtZW50KCBodG1sRWxlbWVudE5hbWUgKSB7XG5cdHJldHVybiBpbmxpbmVFbGVtZW50c1JlZ2V4LnRlc3QoIGh0bWxFbGVtZW50TmFtZSApO1xufVxuXG4vKipcbiAqIFNwbGl0cyBhIHRleHQgaW50byBibG9ja3MgYmFzZWQgb24gSFRNTCBibG9jayBlbGVtZW50cy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byBzcGxpdC5cbiAqIEByZXR1cm5zIHtBcnJheX0gQSBsaXN0IG9mIGJsb2NrcyBiYXNlZCBvbiBIVE1MIGJsb2NrIGVsZW1lbnRzLlxuICovXG5mdW5jdGlvbiBnZXRCbG9ja3MoIHRleHQgKSB7XG5cdHZhciBibG9ja3MgPSBbXSwgZGVwdGggPSAwLFxuXHRcdGJsb2NrU3RhcnRUYWcgPSBcIlwiLFxuXHRcdGN1cnJlbnRCbG9jayA9IFwiXCIsXG5cdFx0YmxvY2tFbmRUYWcgPSBcIlwiO1xuXG5cdC8vIFJlbW92ZSBhbGwgY29tbWVudHMgYmVjYXVzZSBpdCBpcyB2ZXJ5IGhhcmQgdG8gdG9rZW5pemUgdGhlbS5cblx0dGV4dCA9IHRleHQucmVwbGFjZSggY29tbWVudFJlZ2V4LCBcIlwiICk7XG5cblx0Y3JlYXRlVG9rZW5pemVyKCk7XG5cdGh0bWxCbG9ja1Rva2VuaXplci5vblRleHQoIHRleHQgKTtcblxuXHRodG1sQmxvY2tUb2tlbml6ZXIuZW5kKCk7XG5cblx0Zm9yRWFjaCggdG9rZW5zLCBmdW5jdGlvbiggdG9rZW4sIGkgKSB7XG5cdFx0dmFyIG5leHRUb2tlbiA9IHRva2Vuc1sgaSArIDEgXTtcblxuXHRcdHN3aXRjaCAoIHRva2VuLnR5cGUgKSB7XG5cblx0XHRcdGNhc2UgXCJjb250ZW50XCI6XG5cdFx0XHRjYXNlIFwiZ3JlYXRlci10aGFuLXNpZ24tY29udGVudFwiOlxuXHRcdFx0Y2FzZSBcImlubGluZS1zdGFydFwiOlxuXHRcdFx0Y2FzZSBcImlubGluZS1lbmRcIjpcblx0XHRcdGNhc2UgXCJvdGhlci10YWdcIjpcblx0XHRcdGNhc2UgXCJvdGhlci1lbGVtZW50LXN0YXJ0XCI6XG5cdFx0XHRjYXNlIFwib3RoZXItZWxlbWVudC1lbmRcIjpcblx0XHRcdGNhc2UgXCJncmVhdGVyIHRoYW4gc2lnblwiOlxuXHRcdFx0XHRpZiAoICEgbmV4dFRva2VuIHx8ICggZGVwdGggPT09IDAgJiYgKCBuZXh0VG9rZW4udHlwZSA9PT0gXCJibG9jay1zdGFydFwiIHx8IG5leHRUb2tlbi50eXBlID09PSBcImJsb2NrLWVuZFwiICkgKSApIHtcblx0XHRcdFx0XHRjdXJyZW50QmxvY2sgKz0gdG9rZW4uc3JjO1xuXG5cdFx0XHRcdFx0YmxvY2tzLnB1c2goIGN1cnJlbnRCbG9jayApO1xuXHRcdFx0XHRcdGJsb2NrU3RhcnRUYWcgPSBcIlwiO1xuXHRcdFx0XHRcdGN1cnJlbnRCbG9jayA9IFwiXCI7XG5cdFx0XHRcdFx0YmxvY2tFbmRUYWcgPSBcIlwiO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGN1cnJlbnRCbG9jayArPSB0b2tlbi5zcmM7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgXCJibG9jay1zdGFydFwiOlxuXHRcdFx0XHRpZiAoIGRlcHRoICE9PSAwICkge1xuXHRcdFx0XHRcdGlmICggY3VycmVudEJsb2NrLnRyaW0oKSAhPT0gXCJcIiApIHtcblx0XHRcdFx0XHRcdGJsb2Nrcy5wdXNoKCBjdXJyZW50QmxvY2sgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y3VycmVudEJsb2NrID0gXCJcIjtcblx0XHRcdFx0XHRibG9ja0VuZFRhZyA9IFwiXCI7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRkZXB0aCsrO1xuXHRcdFx0XHRibG9ja1N0YXJ0VGFnID0gdG9rZW4uc3JjO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBcImJsb2NrLWVuZFwiOlxuXHRcdFx0XHRkZXB0aC0tO1xuXHRcdFx0XHRibG9ja0VuZFRhZyA9IHRva2VuLnNyYztcblxuXHRcdFx0XHQvKlxuXHRcdFx0XHQgKiBXZSB0cnkgdG8gbWF0Y2ggdGhlIG1vc3QgZGVlcCBibG9ja3Mgc28gZGlzY2FyZCBhbnkgb3RoZXIgYmxvY2tzIHRoYXQgaGF2ZSBiZWVuIHN0YXJ0ZWQgYnV0IG5vdFxuXHRcdFx0XHQgKiBmaW5pc2hlZC5cblx0XHRcdFx0ICovXG5cdFx0XHRcdGlmICggXCJcIiAhPT0gYmxvY2tTdGFydFRhZyAmJiBcIlwiICE9PSBibG9ja0VuZFRhZyApIHtcblx0XHRcdFx0XHRibG9ja3MucHVzaCggYmxvY2tTdGFydFRhZyArIGN1cnJlbnRCbG9jayArIGJsb2NrRW5kVGFnICk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoIFwiXCIgIT09IGN1cnJlbnRCbG9jay50cmltKCkgKSB7XG5cdFx0XHRcdFx0YmxvY2tzLnB1c2goIGN1cnJlbnRCbG9jayApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJsb2NrU3RhcnRUYWcgPSBcIlwiO1xuXHRcdFx0XHRjdXJyZW50QmxvY2sgPSBcIlwiO1xuXHRcdFx0XHRibG9ja0VuZFRhZyA9IFwiXCI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdC8vIEhhbmRsZXMgSFRNTCB3aXRoIHRvbyBtYW55IGNsb3NpbmcgdGFncy5cblx0XHRpZiAoIGRlcHRoIDwgMCApIHtcblx0XHRcdGRlcHRoID0gMDtcblx0XHR9XG5cdH0gKTtcblxuXHRyZXR1cm4gYmxvY2tzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0YmxvY2tFbGVtZW50czogYmxvY2tFbGVtZW50cyxcblx0aW5saW5lRWxlbWVudHM6IGlubGluZUVsZW1lbnRzLFxuXHRpc0Jsb2NrRWxlbWVudDogaXNCbG9ja0VsZW1lbnQsXG5cdGlzSW5saW5lRWxlbWVudDogaXNJbmxpbmVFbGVtZW50LFxuXHRnZXRCbG9ja3M6IG1lbW9pemUoIGdldEJsb2NrcyApLFxufTtcbiIsInZhciBTeWxsYWJsZUNvdW50U3RlcCA9IHJlcXVpcmUoIFwiLi9zeWxsYWJsZUNvdW50U3RlcC5qc1wiICk7XG5cbnZhciBpc1VuZGVmaW5lZCA9IHJlcXVpcmUoIFwibG9kYXNoL2lzVW5kZWZpbmVkXCIgKTtcbnZhciBmb3JFYWNoID0gcmVxdWlyZSggXCJsb2Rhc2gvZm9yRWFjaFwiICk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN5bGxhYmxlIGNvdW50IGl0ZXJhdG9yLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyBvYmplY3QgY29udGFpbmluZyBhbiBhcnJheSB3aXRoIHN5bGxhYmxlIGV4Y2x1c2lvbnMuXG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIFN5bGxhYmxlQ291bnRJdGVyYXRvciA9IGZ1bmN0aW9uKCBjb25maWcgKSB7XG5cdHRoaXMuY291bnRTdGVwcyA9IFtdO1xuXHRpZiAoICEgaXNVbmRlZmluZWQoIGNvbmZpZyApICkge1xuXHRcdHRoaXMuY3JlYXRlU3lsbGFibGVDb3VudFN0ZXBzKCBjb25maWcuZGV2aWF0aW9ucy52b3dlbHMgKTtcblx0fVxufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgc3lsbGFibGUgY291bnQgc3RlcCBvYmplY3QgZm9yIGVhY2ggZXhjbHVzaW9uLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBzeWxsYWJsZUNvdW50cyBUaGUgb2JqZWN0IGNvbnRhaW5pbmcgYWxsIGV4Y2x1c2lvbiBzeWxsYWJsZXMgaW5jbHVkaW5nIHRoZSBtdWx0aXBsaWVycy5cbiAqL1xuU3lsbGFibGVDb3VudEl0ZXJhdG9yLnByb3RvdHlwZS5jcmVhdGVTeWxsYWJsZUNvdW50U3RlcHMgPSBmdW5jdGlvbiggc3lsbGFibGVDb3VudHMgKSB7XG5cdGZvckVhY2goIHN5bGxhYmxlQ291bnRzLCBmdW5jdGlvbiggc3lsbGFibGVDb3VudFN0ZXAgKSB7XG5cdFx0dGhpcy5jb3VudFN0ZXBzLnB1c2goIG5ldyBTeWxsYWJsZUNvdW50U3RlcCggc3lsbGFibGVDb3VudFN0ZXAgKSApO1xuXHR9LmJpbmQoIHRoaXMgKSApO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGFsbCBhdmFpbGFibGUgY291bnQgc3RlcHMuXG4gKlxuICogQHJldHVybnMge0FycmF5fSBBbGwgYXZhaWxhYmxlIGNvdW50IHN0ZXBzLlxuICovXG5TeWxsYWJsZUNvdW50SXRlcmF0b3IucHJvdG90eXBlLmdldEF2YWlsYWJsZVN5bGxhYmxlQ291bnRTdGVwcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jb3VudFN0ZXBzO1xufTtcblxuLyoqXG4gKiBDb3VudHMgdGhlIHN5bGxhYmxlcyBmb3IgYWxsIHRoZSBzdGVwcyBhbmQgcmV0dXJucyB0aGUgdG90YWwgc3lsbGFibGUgY291bnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHdvcmQgVGhlIHdvcmQgdG8gY291bnQgc3lsbGFibGVzIGluLlxuICogQHJldHVybnMge251bWJlcn0gVGhlIG51bWJlciBvZiBzeWxsYWJsZXMgZm91bmQgYmFzZWQgb24gZXhjbHVzaW9ucy5cbiAqL1xuU3lsbGFibGVDb3VudEl0ZXJhdG9yLnByb3RvdHlwZS5jb3VudFN5bGxhYmxlcyA9IGZ1bmN0aW9uKCB3b3JkICkge1xuXHR2YXIgc3lsbGFibGVDb3VudCA9IDA7XG5cdGZvckVhY2goIHRoaXMuY291bnRTdGVwcywgZnVuY3Rpb24oIHN0ZXAgKSB7XG5cdFx0c3lsbGFibGVDb3VudCArPSBzdGVwLmNvdW50U3lsbGFibGVzKCB3b3JkICk7XG5cdH0gKTtcblx0cmV0dXJuIHN5bGxhYmxlQ291bnQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bGxhYmxlQ291bnRJdGVyYXRvcjtcbiIsInZhciBpc1VuZGVmaW5lZCA9IHJlcXVpcmUoIFwibG9kYXNoL2lzVW5kZWZpbmVkXCIgKTtcblxudmFyIGFycmF5VG9SZWdleCA9IHJlcXVpcmUoIFwiLi4vc3RyaW5nUHJvY2Vzc2luZy9jcmVhdGVSZWdleEZyb21BcnJheS5qc1wiICk7XG5cbi8qKlxuICogQ29uc3RydWN0cyBhIGxhbmd1YWdlIHN5bGxhYmxlIHJlZ2V4IHRoYXQgY29udGFpbnMgYSByZWdleCBmb3IgbWF0Y2hpbmcgc3lsbGFibGUgZXhjbHVzaW9uLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBzeWxsYWJsZVJlZ2V4IFRoZSBvYmplY3QgY29udGFpbmluZyB0aGUgc3lsbGFibGUgZXhjbHVzaW9ucy5cbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgU3lsbGFibGVDb3VudFN0ZXAgPSBmdW5jdGlvbiggc3lsbGFibGVSZWdleCApIHtcblx0dGhpcy5faGFzUmVnZXggPSBmYWxzZTtcblx0dGhpcy5fcmVnZXggPSBcIlwiO1xuXHR0aGlzLl9tdWx0aXBsaWVyID0gXCJcIjtcblx0dGhpcy5jcmVhdGVSZWdleCggc3lsbGFibGVSZWdleCApO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGlmIGEgdmFsaWQgcmVnZXggaGFzIGJlZW4gc2V0LlxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIGEgcmVnZXggaGFzIGJlZW4gc2V0LCBmYWxzZSBpZiBub3QuXG4gKi9cblN5bGxhYmxlQ291bnRTdGVwLnByb3RvdHlwZS5oYXNSZWdleCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5faGFzUmVnZXg7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSByZWdleCBiYXNlZCBvbiB0aGUgZ2l2ZW4gc3lsbGFibGUgZXhjbHVzaW9ucywgYW5kIHNldHMgdGhlIG11bHRpcGxpZXIgdG8gdXNlLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBzeWxsYWJsZVJlZ2V4IFRoZSBvYmplY3QgY29udGFpbmluZyB0aGUgc3lsbGFibGUgZXhjbHVzaW9ucyBhbmQgbXVsdGlwbGllci5cbiAqL1xuU3lsbGFibGVDb3VudFN0ZXAucHJvdG90eXBlLmNyZWF0ZVJlZ2V4ID0gZnVuY3Rpb24oIHN5bGxhYmxlUmVnZXggKSB7XG5cdGlmICggISBpc1VuZGVmaW5lZCggc3lsbGFibGVSZWdleCApICYmICEgaXNVbmRlZmluZWQoIHN5bGxhYmxlUmVnZXguZnJhZ21lbnRzICkgKSB7XG5cdFx0dGhpcy5faGFzUmVnZXggPSB0cnVlO1xuXHRcdHRoaXMuX3JlZ2V4ID0gYXJyYXlUb1JlZ2V4KCBzeWxsYWJsZVJlZ2V4LmZyYWdtZW50cywgdHJ1ZSApO1xuXHRcdHRoaXMuX211bHRpcGxpZXIgPSBzeWxsYWJsZVJlZ2V4LmNvdW50TW9kaWZpZXI7XG5cdH1cbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgc3RvcmVkIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAqXG4gKiBAcmV0dXJucyB7UmVnRXhwfSBUaGUgc3RvcmVkIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAqL1xuU3lsbGFibGVDb3VudFN0ZXAucHJvdG90eXBlLmdldFJlZ2V4ID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLl9yZWdleDtcbn07XG5cbi8qKlxuICogTWF0Y2hlcyBzeWxsYWJsZSBleGNsdXNpb25zIGluIGEgZ2l2ZW4gd29yZCBhbmQgdGhlIHJldHVybnMgdGhlIG51bWJlciBmb3VuZCBtdWx0aXBsaWVkIHdpdGggdGhlXG4gKiBnaXZlbiBtdWx0aXBsaWVyLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB3b3JkIFRoZSB3b3JkIHRvIG1hdGNoIGZvciBzeWxsYWJsZSBleGNsdXNpb25zLlxuICogQHJldHVybnMge251bWJlcn0gVGhlIGFtb3VudCBvZiBzeWxsYWJsZXMgZm91bmQuXG4gKi9cblN5bGxhYmxlQ291bnRTdGVwLnByb3RvdHlwZS5jb3VudFN5bGxhYmxlcyA9IGZ1bmN0aW9uKCB3b3JkICkge1xuXHRpZiAoIHRoaXMuX2hhc1JlZ2V4ICkge1xuXHRcdHZhciBtYXRjaCA9IHdvcmQubWF0Y2goIHRoaXMuX3JlZ2V4ICkgfHwgW107XG5cdFx0cmV0dXJuIG1hdGNoLmxlbmd0aCAqIHRoaXMuX211bHRpcGxpZXI7XG5cdH1cblx0cmV0dXJuIDA7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bGxhYmxlQ291bnRTdGVwO1xuIiwidmFyIGZpbHRlcmVkUGFzc2l2ZUF1eGlsaWFyaWVzID0gcmVxdWlyZSggXCIuL3Bhc3NpdmV2b2ljZS1lbmdsaXNoL2F1eGlsaWFyaWVzLmpzXCIgKSgpLmZpbHRlcmVkQXV4aWxpYXJpZXM7XG52YXIgbm90RmlsdGVyZWRQYXNzaXZlQXV4aWxpYXJpZXMgPSByZXF1aXJlKCBcIi4vcGFzc2l2ZXZvaWNlLWVuZ2xpc2gvYXV4aWxpYXJpZXMuanNcIiApKCkubm90RmlsdGVyZWRBdXhpbGlhcmllcztcbnZhciB0cmFuc2l0aW9uV29yZHMgPSByZXF1aXJlKCBcIi4vdHJhbnNpdGlvbldvcmRzLmpzXCIgKSgpLnNpbmdsZVdvcmRzO1xuXG4vKipcbiAqIFJldHVybnMgYW4gYXJyYXkgd2l0aCBleGNlcHRpb25zIGZvciB0aGUga2V5d29yZCBzdWdnZXN0aW9uIHJlc2VhcmNoZXIuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBhcnJheSBmaWxsZWQgd2l0aCBleGNlcHRpb25zLlxuICovXG5cbnZhciBhcnRpY2xlcyA9IFsgXCJ0aGVcIiwgXCJhblwiLCBcImFcIiBdO1xudmFyIG51bWVyYWxzID0gWyBcIm9uZVwiLCBcInR3b1wiLCBcInRocmVlXCIsIFwiZm91clwiLCBcImZpdmVcIiwgXCJzaXhcIiwgXCJzZXZlblwiLCBcImVpZ2h0XCIsIFwibmluZVwiLCBcInRlblwiLCBcImVsZXZlblwiLCBcInR3ZWx2ZVwiLCBcInRoaXJ0ZWVuXCIsXG5cdFwiZm91cnRlZW5cIiwgXCJmaWZ0ZWVuXCIsIFwic2l4dGVlblwiLCBcInNldmVudGVlblwiLCBcImVpZ2h0ZWVuXCIsIFwibmluZXRlZW5cIiwgXCJ0d2VudHlcIiwgXCJmaXJzdFwiLCBcInNlY29uZFwiLCBcInRoaXJkXCIsIFwiZm91cnRoXCIsXG5cdFwiZmlmdGhcIiwgXCJzaXh0aFwiLCBcInNldmVudGhcIiwgXCJlaWdodGhcIiwgXCJuaW50aFwiLCBcInRlbnRoXCIsIFwiZWxldmVudGhcIiwgXCJ0d2VsZnRoXCIsIFwidGhpcnRlZW50aFwiLCBcImZvdXJ0ZWVudGhcIiwgXCJmaWZ0ZWVudGhcIixcblx0XCJzaXh0ZWVudGhcIiwgXCJzZXZlbnRlZW50aFwiLCBcImVpZ2h0ZWVudGhcIiwgXCJuaW5ldGVlbnRoXCIsIFwidHdlbnRpZXRoXCIsIFwiaHVuZHJlZFwiLCBcImh1bmRyZWRzXCIsIFwidGhvdXNhbmRcIiwgXCJ0aG91c2FuZHNcIixcblx0XCJtaWxsaW9uXCIsIFwibWlsbGlvblwiLCBcImJpbGxpb25cIiwgXCJiaWxsaW9uc1wiIF07XG52YXIgcGVyc29uYWxQcm9ub3Vuc05vbWluYXRpdmUgPSBbIFwiaVwiLCBcInlvdVwiLCBcImhlXCIsIFwic2hlXCIsIFwiaXRcIiwgXCJ3ZVwiLCBcInRoZXlcIiBdO1xudmFyIHBlcnNvbmFsUHJvbm91bnNBY2N1c2F0aXZlID0gWyBcIm1lXCIsIFwiaGltXCIsIFwiaGVyXCIsIFwidXNcIiwgXCJ0aGVtXCIgXTtcbnZhciBkZW1vbnN0cmF0aXZlUHJvbm91bnMgPSBbIFwidGhpc1wiLCBcInRoYXRcIiwgXCJ0aGVzZVwiLCBcInRob3NlXCIgXTtcbnZhciBwb3NzZXNzaXZlUHJvbm91bnMgPSBbIFwibXlcIiwgXCJ5b3VyXCIsIFwiaGlzXCIsIFwiaGVyXCIsIFwiaXRzXCIsIFwidGhlaXJcIiwgXCJvdXJcIiwgXCJtaW5lXCIsIFwieW91cnNcIiwgXCJoZXJzXCIsIFwidGhlaXJzXCIsIFwib3Vyc1wiIF07XG52YXIgcXVhbnRpZmllcnMgPSBbIFwiYWxsXCIsIFwic29tZVwiLCBcIm1hbnlcIiwgXCJmZXdcIiwgXCJsb3RcIiwgXCJsb3RzXCIsIFwidG9uc1wiLCBcImJpdFwiLCBcIm5vXCIsIFwiZXZlcnlcIiwgXCJlbm91Z2hcIiwgXCJsaXR0bGVcIiwgXCJsZXNzXCIsIFwibXVjaFwiLCBcIm1vcmVcIiwgXCJtb3N0XCIsXG5cdFwicGxlbnR5XCIsIFwic2V2ZXJhbFwiLCBcImZld1wiLCBcImZld2VyXCIsIFwibWFueVwiLCBcImtpbmRcIiBdO1xudmFyIHJlZmxleGl2ZVByb25vdW5zID0gWyBcIm15c2VsZlwiLCBcInlvdXJzZWxmXCIsIFwiaGltc2VsZlwiLCBcImhlcnNlbGZcIiwgXCJpdHNlbGZcIiwgXCJvbmVzZWxmXCIsIFwib3Vyc2VsdmVzXCIsIFwieW91cnNlbHZlc1wiLCBcInRoZW1zZWx2ZXNcIiBdO1xudmFyIGluZGVmaW5pdGVQcm9ub3VucyA9IFsgXCJub25lXCIsIFwibm9ib2R5XCIsIFwiZXZlcnlvbmVcIiwgXCJldmVyeWJvZHlcIiwgXCJzb21lb25lXCIsIFwic29tZWJvZHlcIiwgXCJhbnlvbmVcIiwgXCJhbnlib2R5XCIsIFwibm90aGluZ1wiLFxuXHRcImV2ZXJ5dGhpbmdcIiwgXCJzb21ldGhpbmdcIiwgXCJhbnl0aGluZ1wiLCBcImVhY2hcIiwgXCJhbm90aGVyXCIsIFwib3RoZXJcIiwgXCJ3aGF0ZXZlclwiLCBcIndoaWNoZXZlclwiLCBcIndob2V2ZXJcIiwgXCJ3aG9tZXZlclwiLFxuXHRcIndob21zb2V2ZXJcIiwgXCJ3aG9zb2V2ZXJcIiwgXCJvdGhlcnNcIiwgXCJuZWl0aGVyXCIsIFwiYm90aFwiLCBcImVpdGhlclwiLCBcImFueVwiLCBcInN1Y2hcIiBdO1xudmFyIGluZGVmaW5pdGVQcm9ub3Vuc1Bvc3Nlc3NpdmUgID0gWyBcIm9uZSdzXCIsIFwibm9ib2R5J3NcIiwgXCJldmVyeW9uZSdzXCIsIFwiZXZlcnlib2R5J3NcIiwgXCJzb21lb25lJ3NcIiwgXCJzb21lYm9keSdzXCIsIFwiYW55b25lJ3NcIixcblx0XCJhbnlib2R5J3NcIiwgXCJub3RoaW5nJ3NcIiwgXCJldmVyeXRoaW5nJ3NcIiwgXCJzb21ldGhpbmcnc1wiLCBcImFueXRoaW5nJ3NcIiwgXCJ3aG9ldmVyJ3NcIiwgXCJvdGhlcnMnXCIsIFwib3RoZXInc1wiLCBcImFub3RoZXInc1wiLFxuXHRcIm5laXRoZXInc1wiLCBcImVpdGhlcidzXCIgXTtcblxuLy8gQWxsIHJlbGF0aXZlUHJvbm91bnMgYXJlIGFscmVhZHkgaW5jbHVkZWQgaW4gb3RoZXIgbGlzdHMgKGludGVycm9nYXRpdmVEZXRlcm1pbmVycywgaW50ZXJyb2dhdGl2ZVByb25vdW5zKVxudmFyIHJlbGF0aXZlUHJvbm91bnMgPSBbXTtcbnZhciBpbnRlcnJvZ2F0aXZlRGV0ZXJtaW5lcnMgPSBbIFwid2hpY2hcIiwgXCJ3aGF0XCIsIFwid2hvc2VcIiBdO1xudmFyIGludGVycm9nYXRpdmVQcm9ub3VucyA9IFsgXCJ3aG9cIiwgXCJ3aG9tXCIgXTtcbnZhciBpbnRlcnJvZ2F0aXZlUHJvQWR2ZXJicyA9IFsgXCJ3aGVyZVwiLCBcIndoaXRoZXJcIiwgXCJ3aGVuY2VcIiwgXCJob3dcIiwgXCJ3aHlcIiwgXCJ3aGV0aGVyXCIsIFwid2hlcmV2ZXJcIiwgXCJ3aG9tZXZlclwiLCBcIndoZW5ldmVyXCIsXG5cdFwiaG93ZXZlclwiLCBcIndoeWV2ZXJcIiwgXCJ3aG9ldmVyXCIsIFwid2hhdGV2ZXJcIiwgXCJ3aGVyZXNvZXZlclwiLCBcIndob21zb2V2ZXJcIiwgXCJ3aGVuc29ldmVyXCIsIFwiaG93c29ldmVyXCIsIFwid2h5c29ldmVyXCIsIFwid2hvc29ldmVyXCIsXG5cdFwid2hhdHNvZXZlclwiLCBcIndoZXJlc29cIiwgXCJ3aG9tc29cIiwgXCJ3aGVuc29cIiwgXCJob3dzb1wiLCBcIndoeXNvXCIsIFwid2hvc29cIiwgXCJ3aGF0c29cIiBdO1xudmFyIHByb25vbWluYWxBZHZlcmJzID0gWyBcInRoZXJlZm9yXCIsIFwidGhlcmVpblwiLCBcImhlcmVieVwiLCBcImhlcmV0b1wiLCBcIndoZXJlaW5cIiwgXCJ0aGVyZXdpdGhcIiwgXCJoZXJld2l0aFwiLCBcIndoZXJld2l0aFwiLCBcInRoZXJlYnlcIiBdO1xudmFyIGxvY2F0aXZlQWR2ZXJicyA9IFsgXCJ0aGVyZVwiLCBcImhlcmVcIiwgXCJ3aGl0aGVyXCIsIFwidGhpdGhlclwiLCBcImhpdGhlclwiLCBcIndoZW5jZVwiLCBcInRoZW5jZVwiLCBcImhlbmNlXCIgXTtcbnZhciBhZHZlcmJpYWxHZW5pdGl2ZXMgPSBbIFwiYWx3YXlzXCIsIFwiYWZ0ZXJ3YXJkc1wiLCBcInRvd2FyZHNcIiwgXCJvbmNlXCIsIFwidHdpY2VcIiwgXCJ0aHJpY2VcIiwgXCJhbWlkc3RcIiwgXCJhbW9uZ3N0XCIsIFwibWlkc3RcIiwgXCJ3aGlsc3RcIiBdO1xudmFyIG90aGVyQXV4aWxpYXJpZXMgPSBbIFwiY2FuXCIsIFwiY2Fubm90XCIsIFwiY2FuJ3RcIiwgXCJjb3VsZFwiLCBcImNvdWxkbid0XCIsIFwiY291bGQndmVcIiwgXCJkYXJlXCIsIFwiZGFyZXNcIiwgXCJkYXJlZFwiLCBcImRhcmluZ1wiLCBcImRvXCIsXG5cdFwiZG9uJ3RcIiwgXCJkb2VzXCIsIFwiZG9lc24ndFwiLCBcImRpZFwiLCBcImRpZG4ndFwiLCBcImRvaW5nXCIsIFwiZG9uZVwiLCBcImhhdmVcIiwgXCJoYXZlbid0XCIsIFwiaGFkXCIsIFwiaGFkbid0XCIsIFwiaGFzXCIsIFwiaGFzbid0XCIsIFwiaGF2aW5nXCIsXG5cdFwiaSd2ZVwiLCBcInlvdSd2ZVwiLCBcIndlJ3ZlXCIsIFwidGhleSd2ZVwiLCBcImknZFwiLCBcInlvdSdkXCIsIFwiaGUnZFwiLCBcInNoZSdkXCIsIFwiaXQnZFwiLCBcIndlJ2RcIiwgXCJ0aGV5J2RcIiwgXCJ3b3VsZFwiLCBcIndvdWxkbid0XCIsXG5cdFwid291bGQndmVcIiwgXCJtYXlcIiwgXCJtaWdodFwiLCBcIm11c3RcIiwgXCJuZWVkXCIsIFwibmVlZG4ndFwiLCBcIm5lZWRzXCIsIFwib3VnaHRcIiwgXCJzaGFsbFwiLCBcInNoYWxsbid0XCIsIFwic2hhbid0XCIsIFwic2hvdWxkXCIsXG5cdFwic2hvdWxkbid0XCIsIFwid2lsbFwiLCBcIndvbid0XCIsIFwiaSdsbFwiLCBcInlvdSdsbFwiLCBcImhlJ2xsXCIsIFwic2hlJ2xsXCIsIFwiaXQnbGxcIiwgXCJ3ZSdsbFwiLCBcInRoZXknbGxcIiwgXCJ0aGVyZSdzXCIsIFwidGhlcmUncmVcIixcblx0XCJ0aGVyZSdsbFwiLCBcImhlcmUnc1wiLCBcImhlcmUncmVcIiwgXCJ0aGVyZSdsbFwiIF07XG52YXIgY29wdWxhID0gWyBcImFwcGVhclwiLCBcImFwcGVhcnNcIiwgXCJhcHBlYXJpbmdcIiwgXCJhcHBlYXJlZFwiLCBcImJlY29tZVwiLCBcImJlY29tZXNcIiwgXCJiZWNvbWluZ1wiLCBcImJlY2FtZVwiLCBcImNvbWVcIiwgXCJjb21lc1wiLFxuXHRcImNvbWluZ1wiLCBcImNhbWVcIiwgXCJrZWVwXCIsIFwia2VlcHNcIiwgXCJrZXB0XCIsIFwia2VlcGluZ1wiLCBcInJlbWFpblwiLCBcInJlbWFpbnNcIiwgXCJyZW1haW5pbmdcIiwgXCJyZW1haW5lZFwiLCBcInN0YXlcIixcblx0XCJzdGF5c1wiLCBcInN0YXllZFwiLCBcInN0YXlpbmdcIiwgXCJ0dXJuXCIsIFwidHVybnNcIiwgXCJ0dXJuZWRcIiBdO1xuXG52YXIgcHJlcG9zaXRpb25zID0gWyBcImluXCIsIFwiZnJvbVwiLCBcIndpdGhcIiwgXCJ1bmRlclwiLCBcInRocm91Z2hvdXRcIiwgXCJhdG9wXCIsIFwiZm9yXCIsIFwib25cIiwgXCJ1bnRpbFwiLCBcIm9mXCIsIFwidG9cIiwgXCJhYm9hcmRcIiwgXCJhYm91dFwiLFxuXHRcImFib3ZlXCIsIFwiYWJyZWFzdFwiLCBcImFic2VudFwiLCBcImFjcm9zc1wiLCBcImFkamFjZW50XCIsIFwiYWZ0ZXJcIiwgXCJhZ2FpbnN0XCIsIFwiYWxvbmdcIiwgXCJhbG9uZ3NpZGVcIiwgXCJhbWlkXCIsIFwibWlkc3RcIiwgXCJtaWRcIixcblx0XCJhbW9uZ1wiLCBcImFwcm9wb3NcIiwgXCJhcHVkXCIsIFwiYXJvdW5kXCIsIFwiYXNcIiwgXCJhc3RyaWRlXCIsIFwiYXRcIiwgXCJvbnRvcFwiLCBcImJlZm9yZVwiLCBcImFmb3JlXCIsIFwidG9mb3JlXCIsIFwiYmVoaW5kXCIsIFwiYWhpbmRcIixcblx0XCJiZWxvd1wiLCBcImFibG93XCIsIFwiYmVuZWF0aFwiLCBcIm5lYXRoXCIsIFwiYmVzaWRlXCIsIFwiYmVzaWRlc1wiLCBcImJldHdlZW5cIiwgXCJhdHdlZW5cIiwgXCJiZXlvbmRcIiwgXCJheW9uZFwiLCBcImJ1dFwiLCBcImJ5XCIsIFwiY2hlelwiLFxuXHRcImNpcmNhXCIsIFwiY29tZVwiLCBcImRlc3BpdGVcIiwgXCJzcGl0ZVwiLCBcImRvd25cIiwgXCJkdXJpbmdcIiwgXCJleGNlcHRcIiwgXCJpbnRvXCIsIFwibGVzc1wiLCBcImxpa2VcIiwgXCJtaW51c1wiLCBcIm5lYXJcIiwgXCJuZWFyZXJcIixcblx0XCJuZWFyZXN0XCIsIFwiYW5lYXJcIiwgXCJub3R3aXRoc3RhbmRpbmdcIiwgXCJvZmZcIiwgXCJvbnRvXCIsIFwib3Bwb3NpdGVcIiwgXCJvdXRcIiwgXCJvdXRlblwiLCBcIm92ZXJcIiwgXCJwYXN0XCIsIFwicGVyXCIsIFwicHJlXCIsIFwicXVhXCIsXG5cdFwic2Fuc1wiLCBcInNhdWZcIiwgXCJzaW5jZVwiLCBcInNpdGhlbmNlXCIsIFwidGhhblwiLCBcInRocm91Z2hcIiwgXCJ0aHJ1XCIsIFwidHJ1b3V0XCIsIFwidG93YXJkXCIsIFwidW5kZXJuZWF0aFwiLCBcInVubGlrZVwiLCBcInVudGlsXCIsXG5cdFwidXBcIiwgXCJ1cG9uXCIsIFwidXBzaWRlXCIsIFwidmVyc3VzXCIsIFwidmlhXCIsIFwidmlzLcOgLXZpc1wiLCBcIndpdGhvdXRcIiwgXCJhZ29cIiwgXCJhcGFydFwiLCBcImFzaWRlXCIsIFwiYXNsYW50XCIsIFwiYXdheVwiLCBcIndpdGhhbFwiIF07XG5cbi8vIE1hbnkgcHJlcG9zaXRpb25hbCBhZHZlcmJzIGFyZSBhbHJlYWR5IGxpc3RlZCBhcyBwcmVwb3NpdGlvbi5cbnZhciBwcmVwb3NpdGlvbmFsQWR2ZXJicyA9IFsgXCJiYWNrXCIsIFwid2l0aGluXCIsIFwiZm9yd2FyZFwiLCBcImJhY2t3YXJkXCIsIFwiYWhlYWRcIiBdO1xuXG52YXIgY29vcmRpbmF0aW5nQ29uanVuY3Rpb25zID0gWyBcInNvXCIsIFwiYW5kXCIsIFwibm9yXCIsIFwiYnV0XCIsIFwib3JcIiwgXCJ5ZXRcIiwgXCJmb3JcIiBdO1xuXG4vLyAnUmF0aGVyJyBpcyBwYXJ0IG9mICdyYXRoZXIuLi50aGFuJywgJ3Nvb25lcicgaXMgcGFydCBvZiAnbm8gc29vbmVyLi4udGhhbicsICdqdXN0JyBpcyBwYXJ0IG9mICdqdXN0IGFzLi4uc28nLFxuLy8gJ09ubHknIGlzIHBhcnQgb2YgJ25vdCBvbmx5Li4uYnV0IGFsc28nLlxudmFyIGNvcnJlbGF0aXZlQ29uanVuY3Rpb25zID0gWyBcInJhdGhlclwiLCBcInNvb25lclwiLCBcImp1c3RcIiwgXCJvbmx5XCIgXTtcbnZhciBzdWJvcmRpbmF0aW5nQ29uanVuY3Rpb25zID0gWyBcImFmdGVyXCIsIFwiYWx0aG91Z2hcIiwgXCJ3aGVuXCIsIFwiYXNcIiwgXCJpZlwiLCBcInRob3VnaFwiLCBcImJlY2F1c2VcIiwgXCJiZWZvcmVcIiwgXCJldmVuXCIsIFwic2luY2VcIiwgXCJ1bmxlc3NcIixcblx0XCJ3aGVyZWFzXCIsIFwid2hpbGVcIiBdO1xuXG4vLyBUaGVzZSB2ZXJicyBhcmUgZnJlcXVlbnRseSB1c2VkIGluIGludGVydmlld3MgdG8gaW5kaWNhdGUgcXVlc3Rpb25zIGFuZCBhbnN3ZXJzLlxuLy8gJ0NsYWltJywnY2xhaW1zJywgJ3N0YXRlJyBhbmQgJ3N0YXRlZCcgYXJlIG5vdCBpbmNsdWRlZCwgYmVjYXVzZSB0aGVzZSB3b3JkcyBhcmUgYWxzbyBub3Vucy5cbnZhciBpbnRlcnZpZXdWZXJicyA9IFsgXCJzYXlcIiwgXCJzYXlzXCIsIFwic2FpZFwiLCBcInNheWluZ1wiLCBcImNsYWltZWRcIiwgXCJhc2tcIiwgXCJhc2tzXCIsIFwiYXNrZWRcIiwgXCJhc2tpbmdcIiwgXCJzdGF0ZWRcIiwgXCJzdGF0aW5nXCIsXG5cdFwiZXhwbGFpblwiLCBcImV4cGxhaW5zXCIsIFwiZXhwbGFpbmVkXCIsIFwidGhpbmtcIiwgXCJ0aGlua3NcIiBdO1xuXG4vLyBUaGVzZSB0cmFuc2l0aW9uIHdvcmRzIHdlcmUgbm90IGluY2x1ZGVkIGluIHRoZSBsaXN0IGZvciB0aGUgdHJhbnNpdGlvbiB3b3JkIGFzc2Vzc21lbnQgZm9yIHZhcmlvdXMgcmVhc29ucy5cbnZhciBhZGRpdGlvbmFsVHJhbnNpdGlvbldvcmRzID0gWyBcImFuZFwiLCBcIm9yXCIsIFwiYWJvdXRcIiwgXCJhYnNvbHV0ZWx5XCIsIFwiYWdhaW5cIiwgXCJkZWZpbml0ZWx5XCIsIFwiZXRlcm5hbGx5XCIsIFwiZXhwcmVzc2l2ZWx5XCIsXG5cdFwiZXhwcmVzc2x5XCIsIFwiZXh0cmVtZWx5XCIsIFwiaW1tZWRpYXRlbHlcIiwgXCJpbmNsdWRpbmdcIiwgXCJpbnN0YW50bHlcIiwgXCJuYW1lbHlcIiwgXCJuYXR1cmFsbHlcIiwgXCJuZXh0XCIsIFwibm90YWJseVwiLCBcIm5vd1wiLCBcIm5vd2FkYXlzXCIsXG5cdFwib3JkaW5hcmlseVwiLCBcInBvc2l0aXZlbHlcIiwgXCJ0cnVseVwiLCBcInVsdGltYXRlbHlcIiwgXCJ1bmlxdWVseVwiLCBcInVzdWFsbHlcIiwgXCJhbG1vc3RcIiwgXCJmaXJzdFwiLCBcInNlY29uZFwiLCBcInRoaXJkXCIsIFwibWF5YmVcIixcblx0XCJwcm9iYWJseVwiLCBcImdyYW50ZWRcIiwgXCJpbml0aWFsbHlcIiwgXCJvdmVyYWxsXCIsIFwidG9vXCIsIFwiYWN0dWFsbHlcIiwgXCJhbHJlYWR5XCIsIFwiZS5nXCIsIFwiaS5lXCIsIFwib2Z0ZW5cIiwgXCJyZWd1bGFybHlcIiwgXCJzaW1wbHlcIixcblx0XCJvcHRpb25hbGx5XCIsIFwicGVyaGFwc1wiLCBcInNvbWV0aW1lc1wiLCBcImxpa2VseVwiLCBcIm5ldmVyXCIsIFwiZXZlclwiLCBcImVsc2VcIiwgXCJpbmFzbXVjaFwiLCBcInByb3ZpZGVkXCIsIFwiY3VycmVudGx5XCIsIFwiaW5jaWRlbnRhbGx5XCIsXG5cdFwiZWxzZXdoZXJlXCIsIFwiZm9sbG93aW5nXCIsIFwicGFydGljdWxhclwiLCBcInJlY2VudGx5XCIsIFwicmVsYXRpdmVseVwiLCBcImYuaVwiLCBcImNsZWFybHlcIiwgXCJhcHBhcmVudGx5XCIgXTtcblxudmFyIGludGVuc2lmaWVycyA9IFsgXCJoaWdobHlcIiwgXCJ2ZXJ5XCIsIFwicmVhbGx5XCIsIFwiZXh0cmVtZWx5XCIsIFwiYWJzb2x1dGVseVwiLCBcImNvbXBsZXRlbHlcIiwgXCJ0b3RhbGx5XCIsIFwidXR0ZXJseVwiLCBcInF1aXRlXCIsXG5cdFwic29tZXdoYXRcIiwgXCJzZXJpb3VzbHlcIiwgXCJmYWlybHlcIiwgXCJmdWxseVwiLCBcImFtYXppbmdseVwiIF07XG5cbi8vIFRoZXNlIHZlcmJzIGNvbnZleSBsaXR0bGUgbWVhbmluZy4gJ1Nob3cnLCAnc2hvd3MnLCAndXNlcycsIFwibWVhbmluZ1wiIGFyZSBub3QgaW5jbHVkZWQsIGJlY2F1c2UgdGhlc2Ugd29yZHMgY291bGQgYmUgcmVsZXZhbnQgbm91bnMuXG52YXIgZGVsZXhpY2FsaXNlZFZlcmJzID0gWyBcInNlZW1cIiwgXCJzZWVtc1wiLCBcInNlZW1lZFwiLCBcInNlZW1pbmdcIiwgXCJsZXRcIiwgXCJsZXQnc1wiLCBcImxldHNcIiwgXCJsZXR0aW5nXCIsIFwibWFrZVwiLCBcIm1ha2luZ1wiLCBcIm1ha2VzXCIsXG5cdFwibWFkZVwiLCBcIndhbnRcIiwgXCJzaG93aW5nXCIsIFwic2hvd2VkXCIsIFwic2hvd25cIiwgXCJnb1wiLCBcImdvZXNcIiwgXCJnb2luZ1wiLCBcIndlbnRcIiwgXCJnb25lXCIsIFwidGFrZVwiLCBcInRha2VzXCIsIFwidG9va1wiLCBcInRha2VuXCIsIFwic2V0XCIsIFwic2V0c1wiLFxuXHRcInNldHRpbmdcIiwgXCJwdXRcIiwgXCJwdXRzXCIsIFwicHV0dGluZ1wiLCBcInVzZVwiLCBcInVzaW5nXCIsIFwidXNlZFwiLCBcInRyeVwiLCBcInRyaWVzXCIsIFwidHJpZWRcIiwgXCJ0cnlpbmdcIiwgXCJtZWFuXCIsIFwibWVhbnNcIiwgXCJtZWFudFwiLFxuXHRcImNhbGxlZFwiLCBcImJhc2VkXCIsIFwiYWRkXCIsIFwiYWRkc1wiLCBcImFkZGluZ1wiLCBcImFkZGVkXCIsIFwiY29udGFpblwiLCBcImNvbnRhaW5zXCIsIFwiY29udGFpbmluZ1wiLCBcImNvbnRhaW5lZFwiIF07XG5cbi8vIFRoZXNlIGFkamVjdGl2ZXMgYW5kIGFkdmVyYnMgYXJlIHNvIGdlbmVyYWwsIHRoZXkgc2hvdWxkIG5ldmVyIGJlIHN1Z2dlc3RlZCBhcyBhIChzaW5nbGUpIGtleXdvcmQuXG4vLyBLZXkgd29yZCBjb21iaW5hdGlvbnMgY29udGFpbmluZyB0aGVzZSBhZGplY3RpdmVzL2FkdmVyYnMgYXJlIGZpbmUuXG52YXIgZ2VuZXJhbEFkamVjdGl2ZXNBZHZlcmJzID0gWyBcIm5ld1wiLCBcIm5ld2VyXCIsIFwibmV3ZXN0XCIsIFwib2xkXCIsIFwib2xkZXJcIiwgXCJvbGRlc3RcIiwgXCJwcmV2aW91c1wiLCBcImdvb2RcIiwgXCJ3ZWxsXCIsIFwiYmV0dGVyXCIsIFwiYmVzdFwiLFxuXHRcImJpZ1wiLCBcImJpZ2dlclwiLCBcImJpZ2dlc3RcIiwgXCJlYXN5XCIsIFwiZWFzaWVyXCIsIFwiZWFzaWVzdFwiLCBcImZhc3RcIiwgXCJmYXN0ZXJcIiwgXCJmYXN0ZXN0XCIsIFwiZmFyXCIsIFwiaGFyZFwiLCBcImhhcmRlclwiLCBcImhhcmRlc3RcIixcblx0XCJsZWFzdFwiLCBcIm93blwiLCBcImxhcmdlXCIsIFwibGFyZ2VyXCIsIFwibGFyZ2VzdFwiLCBcImxvbmdcIiwgXCJsb25nZXJcIiwgXCJsb25nZXN0XCIsIFwibG93XCIsIFwibG93ZXJcIiwgXCJsb3dlc3RcIiwgXCJoaWdoXCIsIFwiaGlnaGVyXCIsXG5cdFwiaGlnaGVzdFwiLCBcInJlZ3VsYXJcIiwgXCJzaW1wbGVcIiwgXCJzaW1wbGVyXCIsIFwic2ltcGxlc3RcIiwgXCJzbWFsbFwiLCBcInNtYWxsZXJcIiwgXCJzbWFsbGVzdFwiLCBcInRpbnlcIiwgXCJ0aW5pZXJcIiwgXCJ0aW5pZXN0XCIsXG5cdFwic2hvcnRcIiwgXCJzaG9ydGVyXCIsIFwic2hvcnRlc3RcIiwgXCJtYWluXCIsIFwiYWN0dWFsXCIsIFwibmljZVwiLCBcIm5pY2VyXCIsIFwibmljZXN0XCIsIFwicmVhbFwiLCBcInNhbWVcIiwgXCJhYmxlXCIsIFwiY2VydGFpblwiLCBcInVzdWFsXCIsXG5cdFwic28tY2FsbGVkXCIsIFwibWFpbmx5XCIsIFwibW9zdGx5XCIsIFwicmVjZW50XCIsIFwiYW55bW9yZVwiLCBcImNvbXBsZXRlXCIsIFwibGF0ZWx5XCIsIFwicG9zc2libGVcIiwgXCJjb21tb25seVwiLCBcImNvbnN0YW50bHlcIixcblx0XCJjb250aW51YWxseVwiLCBcImRpcmVjdGx5XCIsIFwiZWFzaWx5XCIsIFwibmVhcmx5XCIsIFwic2xpZ2h0bHlcIiwgXCJzb21ld2hlcmVcIiwgXCJlc3RpbWF0ZWRcIiwgXCJsYXRlc3RcIiwgXCJkaWZmZXJlbnRcIiwgXCJzaW1pbGFyXCIsXG5cdFwid2lkZWx5XCIsIFwiYmFkXCIsIFwid29yc2VcIiwgXCJ3b3JzdFwiLCBcImdyZWF0XCIgXTtcblxudmFyIGludGVyamVjdGlvbnMgPSBbIFwib2hcIiwgXCJ3b3dcIiwgXCJ0dXQtdHV0XCIsIFwidHNrLXRza1wiLCBcInVnaFwiLCBcIndoZXdcIiwgXCJwaGV3XCIsIFwieWVhaFwiLCBcInllYVwiLCBcInNoaFwiLCBcIm9vcHNcIiwgXCJvdWNoXCIsIFwiYWhhXCIsXG5cdFwieWlrZXNcIiBdO1xuXG4vLyBUaGVzZSB3b3JkcyBhbmQgYWJicmV2aWF0aW9ucyBhcmUgZnJlcXVlbnRseSB1c2VkIGluIHJlY2lwZXMgaW4gbGlzdHMgb2YgaW5ncmVkaWVudHMuXG52YXIgcmVjaXBlV29yZHMgPSBbIFwidGJzXCIsIFwidGJzcFwiLCBcInNwa1wiLCBcImxiXCIsIFwicXRcIiwgXCJwa1wiLCBcImJ1XCIsIFwib3pcIiwgXCJwdFwiLCBcIm1vZFwiLCBcImRvelwiLCBcImhyXCIsIFwiZi5nXCIsIFwibWxcIiwgXCJkbFwiLCBcImNsXCIsXG5cdFwibFwiLCBcIm1nXCIsIFwiZ1wiLCBcImtnXCIsIFwicXVhcnRcIiBdO1xuXG4vLyAnUGVvcGxlJyBzaG91bGQgb25seSBiZSByZW1vdmVkIGluIGNvbWJpbmF0aW9uIHdpdGggJ3NvbWUnLCAnbWFueScgYW5kICdmZXcnIChhbmQgaXMgdGhlcmVmb3JlIG5vdCB5ZXQgaW5jbHVkZWQgaW4gdGhlIGxpc3QgYmVsb3cpLlxudmFyIHZhZ3VlTm91bnMgPSBbIFwidGhpbmdcIiwgXCJ0aGluZ3NcIiwgXCJ3YXlcIiwgXCJ3YXlzXCIsIFwibWF0dGVyXCIsIFwiY2FzZVwiLCBcImxpa2VsaWhvb2RcIiwgXCJvbmVzXCIsIFwicGllY2VcIiwgXCJwaWVjZXNcIiwgXCJzdHVmZlwiLCBcInRpbWVzXCIsXG5cdFwicGFydFwiLCBcInBhcnRzXCIsIFwicGVyY2VudFwiLCBcImluc3RhbmNlXCIsIFwiaW5zdGFuY2VzXCIsIFwiYXNwZWN0XCIsIFwiYXNwZWN0c1wiLCBcIml0ZW1cIiwgXCJpdGVtc1wiLCBcInBlb3BsZVwiLCBcImlkZWFcIiwgXCJ0aGVtZVwiLFxuXHRcInBlcnNvblwiLCBcInBlcmNlbnRcIiBdO1xuXG4vLyAnTm8nIGlzIGFscmVhZHkgaW5jbHVkZWQgaW4gdGhlIHF1YW50aWZpZXIgbGlzdC5cbnZhciBtaXNjZWxsYW5lb3VzID0gWyBcIm5vdFwiLCBcInllc1wiLCBcInJpZFwiLCBcInN1cmVcIiwgXCJ0b3BcIiwgXCJib3R0b21cIiwgXCJva1wiLCBcIm9rYXlcIiwgXCJhbWVuXCIsIFwiYWthXCIsIFwiJVwiIF07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0YXJ0aWNsZXM6IGFydGljbGVzLFxuXHRcdHBlcnNvbmFsUHJvbm91bnM6IHBlcnNvbmFsUHJvbm91bnNOb21pbmF0aXZlLmNvbmNhdCggcGVyc29uYWxQcm9ub3Vuc0FjY3VzYXRpdmUsIHBvc3Nlc3NpdmVQcm9ub3VucyApLFxuXHRcdHByZXBvc2l0aW9uczogcHJlcG9zaXRpb25zLFxuXHRcdGRlbW9uc3RyYXRpdmVQcm9ub3VuczogZGVtb25zdHJhdGl2ZVByb25vdW5zLFxuXHRcdGNvbmp1bmN0aW9uczogY29vcmRpbmF0aW5nQ29uanVuY3Rpb25zLmNvbmNhdCggc3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9ucyApLFxuXHRcdHZlcmJzOiBmaWx0ZXJlZFBhc3NpdmVBdXhpbGlhcmllcy5jb25jYXQoIG5vdEZpbHRlcmVkUGFzc2l2ZUF1eGlsaWFyaWVzLCBvdGhlckF1eGlsaWFyaWVzLCBjb3B1bGEsIGludGVydmlld1ZlcmJzLCBkZWxleGljYWxpc2VkVmVyYnMgKSxcblx0XHRxdWFudGlmaWVyczogcXVhbnRpZmllcnMsXG5cdFx0cmVsYXRpdmVQcm9ub3VuczogaW50ZXJyb2dhdGl2ZURldGVybWluZXJzLmNvbmNhdCggaW50ZXJyb2dhdGl2ZVByb25vdW5zLCBpbnRlcnJvZ2F0aXZlUHJvQWR2ZXJicyApLFxuXHRcdGZpbHRlcmVkUGFzc2l2ZUF1eGlsaWFyaWVzOiBmaWx0ZXJlZFBhc3NpdmVBdXhpbGlhcmllcyxcblx0XHRhbGw6IGFydGljbGVzLmNvbmNhdCggbnVtZXJhbHMsIGRlbW9uc3RyYXRpdmVQcm9ub3VucywgcG9zc2Vzc2l2ZVByb25vdW5zLCByZWZsZXhpdmVQcm9ub3Vucyxcblx0XHRcdHBlcnNvbmFsUHJvbm91bnNOb21pbmF0aXZlLCBwZXJzb25hbFByb25vdW5zQWNjdXNhdGl2ZSwgcmVsYXRpdmVQcm9ub3VucywgcXVhbnRpZmllcnMsIGluZGVmaW5pdGVQcm9ub3Vucyxcblx0XHRcdGluZGVmaW5pdGVQcm9ub3Vuc1Bvc3Nlc3NpdmUsIGludGVycm9nYXRpdmVEZXRlcm1pbmVycywgaW50ZXJyb2dhdGl2ZVByb25vdW5zLCBpbnRlcnJvZ2F0aXZlUHJvQWR2ZXJicyxcblx0XHRcdHByb25vbWluYWxBZHZlcmJzLCBsb2NhdGl2ZUFkdmVyYnMsIGFkdmVyYmlhbEdlbml0aXZlcywgcHJlcG9zaXRpb25hbEFkdmVyYnMsIGZpbHRlcmVkUGFzc2l2ZUF1eGlsaWFyaWVzLCBub3RGaWx0ZXJlZFBhc3NpdmVBdXhpbGlhcmllcyxcblx0XHRcdG90aGVyQXV4aWxpYXJpZXMsIGNvcHVsYSwgcHJlcG9zaXRpb25zLCBjb29yZGluYXRpbmdDb25qdW5jdGlvbnMsIGNvcnJlbGF0aXZlQ29uanVuY3Rpb25zLCBzdWJvcmRpbmF0aW5nQ29uanVuY3Rpb25zLCBpbnRlcnZpZXdWZXJicyxcblx0XHRcdHRyYW5zaXRpb25Xb3JkcywgYWRkaXRpb25hbFRyYW5zaXRpb25Xb3JkcywgaW50ZW5zaWZpZXJzLCBkZWxleGljYWxpc2VkVmVyYnMsIGludGVyamVjdGlvbnMsIGdlbmVyYWxBZGplY3RpdmVzQWR2ZXJicyxcblx0XHRcdHJlY2lwZVdvcmRzLCB2YWd1ZU5vdW5zLCBtaXNjZWxsYW5lb3VzICksXG5cdH07XG59O1xuIiwiLy8gVGhlc2UgYXV4aWxpYXJpZXMgYXJlIGZpbHRlcmVkIGZyb20gdGhlIGJlZ2lubmluZyBvZiB3b3JkIGNvbWJpbmF0aW9ucyBpbiB0aGUga2V5d29yZCBzdWdnZXN0aW9ucy5cbnZhciBmaWx0ZXJlZEF1eGlsaWFyaWVzID0gIFtcblx0XCJhbVwiLFxuXHRcImlzXCIsXG5cdFwiYXJlXCIsXG5cdFwid2FzXCIsXG5cdFwid2VyZVwiLFxuXHRcImJlZW5cIixcblx0XCJnZXRcIixcblx0XCJnZXRzXCIsXG5cdFwiZ290XCIsXG5cdFwiZ290dGVuXCIsXG5cdFwiYmVcIixcblx0XCJzaGUnc1wiLFxuXHRcImhlJ3NcIixcblx0XCJpdCdzXCIsXG5cdFwiaSdtXCIsXG5cdFwid2UncmVcIixcblx0XCJ0aGV5J3JlXCIsXG5cdFwieW91J3JlXCIsXG5cdFwiaXNuJ3RcIixcblx0XCJ3ZXJlbid0XCIsXG5cdFwid2Fzbid0XCIsXG5cdFwidGhhdCdzXCIsXG5cdFwiYXJlbid0XCIsXG5dO1xuXG4vLyBUaGVzZSBhdXhpbGlhcmllcyBhcmUgbm90IGZpbHRlcmVkIGZyb20gdGhlIGJlZ2lubmluZyBvZiB3b3JkIGNvbWJpbmF0aW9ucyBpbiB0aGUga2V5d29yZCBzdWdnZXN0aW9ucy5cbnZhciBub3RGaWx0ZXJlZEF1eGlsaWFyaWVzID0gW1xuXHRcImJlaW5nXCIsXG5cdFwiZ2V0dGluZ1wiLFxuXHRcImhhdmluZ1wiLFxuXHRcIndoYXQnc1wiLFxuXTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHRmaWx0ZXJlZEF1eGlsaWFyaWVzOiBmaWx0ZXJlZEF1eGlsaWFyaWVzLFxuXHRcdG5vdEZpbHRlcmVkQXV4aWxpYXJpZXM6IG5vdEZpbHRlcmVkQXV4aWxpYXJpZXMsXG5cdFx0YWxsOiBmaWx0ZXJlZEF1eGlsaWFyaWVzLmNvbmNhdCggbm90RmlsdGVyZWRBdXhpbGlhcmllcyApLFxuXHR9O1xufTtcbiIsIi8qKiBAbW9kdWxlIGNvbmZpZy90cmFuc2l0aW9uV29yZHMgKi9cblxudmFyIHNpbmdsZVdvcmRzID0gWyBcImFjY29yZGluZ2x5XCIsIFwiYWRkaXRpb25hbGx5XCIsIFwiYWZ0ZXJ3YXJkXCIsIFwiYWZ0ZXJ3YXJkc1wiLCBcImFsYmVpdFwiLCBcImFsc29cIiwgXCJhbHRob3VnaFwiLCBcImFsdG9nZXRoZXJcIixcblx0IFwiYW5vdGhlclwiLCBcImJhc2ljYWxseVwiLCBcImJlY2F1c2VcIiwgXCJiZWZvcmVcIiwgXCJiZXNpZGVzXCIsIFwiYnV0XCIsIFwiY2VydGFpbmx5XCIsIFwiY2hpZWZseVwiLCBcImNvbXBhcmF0aXZlbHlcIixcblx0XCJjb25jdXJyZW50bHlcIiwgXCJjb25zZXF1ZW50bHlcIiwgXCJjb250cmFyaWx5XCIsIFwiY29udmVyc2VseVwiLCBcImNvcnJlc3BvbmRpbmdseVwiLCBcImRlc3BpdGVcIiwgXCJkb3VidGVkbHlcIiwgXCJkdXJpbmdcIixcblx0XCJlLmcuXCIsIFwiZWFybGllclwiLCBcImVtcGhhdGljYWxseVwiLCBcImVxdWFsbHlcIiwgXCJlc3BlY2lhbGx5XCIsIFwiZXZlbnR1YWxseVwiLCBcImV2aWRlbnRseVwiLCBcImV4cGxpY2l0bHlcIiwgXCJmaW5hbGx5XCIsXG5cdFwiZmlyc3RseVwiLCBcImZvbGxvd2luZ1wiLCBcImZvcm1lcmx5XCIsIFwiZm9ydGh3aXRoXCIsIFwiZm91cnRobHlcIiwgXCJmdXJ0aGVyXCIsIFwiZnVydGhlcm1vcmVcIiwgXCJnZW5lcmFsbHlcIiwgXCJoZW5jZVwiLFxuXHRcImhlbmNlZm9ydGhcIiwgXCJob3dldmVyXCIsIFwiaS5lLlwiLCBcImlkZW50aWNhbGx5XCIsIFwiaW5kZWVkXCIsIFwiaW5zdGVhZFwiLCBcImxhc3RcIiwgXCJsYXN0bHlcIiwgXCJsYXRlclwiLCBcImxlc3RcIiwgXCJsaWtld2lzZVwiLFxuXHRcIm1hcmtlZGx5XCIsIFwibWVhbndoaWxlXCIsIFwibW9yZW92ZXJcIiwgXCJuZXZlcnRoZWxlc3NcIiwgXCJub25ldGhlbGVzc1wiLCBcIm5vclwiLCAgXCJub3R3aXRoc3RhbmRpbmdcIiwgXCJvYnZpb3VzbHlcIixcblx0XCJvY2Nhc2lvbmFsbHlcIiwgXCJvdGhlcndpc2VcIiwgXCJvdmVyYWxsXCIsIFwicGFydGljdWxhcmx5XCIsIFwicHJlc2VudGx5XCIsIFwicHJldmlvdXNseVwiLCBcInJhdGhlclwiLCBcInJlZ2FyZGxlc3NcIiwgXCJzZWNvbmRseVwiLFxuXHRcInNob3J0bHlcIiwgXCJzaWduaWZpY2FudGx5XCIsIFwic2ltaWxhcmx5XCIsIFwic2ltdWx0YW5lb3VzbHlcIiwgXCJzaW5jZVwiLCBcInNvXCIsIFwic29vblwiLCBcInNwZWNpZmljYWxseVwiLCBcInN0aWxsXCIsIFwic3RyYWlnaHRhd2F5XCIsXG5cdFwic3Vic2VxdWVudGx5XCIsIFwic3VyZWx5XCIsIFwic3VycHJpc2luZ2x5XCIsIFwidGhhblwiLCBcInRoZW5cIiwgXCJ0aGVyZWFmdGVyXCIsIFwidGhlcmVmb3JlXCIsIFwidGhlcmV1cG9uXCIsIFwidGhpcmRseVwiLCBcInRob3VnaFwiLFxuXHRcInRodXNcIiwgXCJ0aWxsXCIsIFwidG9vXCIsIFwidW5kZW5pYWJseVwiLCBcInVuZG91YnRlZGx5XCIsIFwidW5sZXNzXCIsIFwidW5saWtlXCIsIFwidW5xdWVzdGlvbmFibHlcIiwgXCJ1bnRpbFwiLCBcIndoZW5cIiwgXCJ3aGVuZXZlclwiLFxuXHRcIndoZXJlYXNcIiwgXCJ3aGlsZVwiIF07XG52YXIgbXVsdGlwbGVXb3JkcyA9IFsgXCJhYm92ZSBhbGxcIiwgXCJhZnRlciBhbGxcIiwgXCJhZnRlciB0aGF0XCIsIFwiYWxsIGluIGFsbFwiLCBcImFsbCBvZiBhIHN1ZGRlblwiLCBcImFsbCB0aGluZ3MgY29uc2lkZXJlZFwiLFxuXHRcImFuYWxvZ291cyB0b1wiLCBcImFsdGhvdWdoIHRoaXMgbWF5IGJlIHRydWVcIiwgXCJhbmFsb2dvdXMgdG9cIiwgXCJhbm90aGVyIGtleSBwb2ludFwiLCBcImFzIGEgbWF0dGVyIG9mIGZhY3RcIiwgXCJhcyBhIHJlc3VsdFwiLFxuXHRcImFzIGFuIGlsbHVzdHJhdGlvblwiLCBcdFwiYXMgY2FuIGJlIHNlZW5cIiwgXCJhcyBoYXMgYmVlbiBub3RlZFwiLCBcImFzIEkgaGF2ZSBub3RlZFwiLCBcImFzIEkgaGF2ZSBzYWlkXCIsIFwiYXMgSSBoYXZlIHNob3duXCIsXG5cdFwiYXMgbG9uZyBhc1wiLCBcImFzIG11Y2ggYXNcIiwgXCJhcyBzaG93biBhYm92ZVwiLCBcImFzIHNvb24gYXNcIiwgXCJhcyB3ZWxsIGFzXCIsIFwiYXQgYW55IHJhdGVcIiwgXCJhdCBmaXJzdFwiLCBcImF0IGxhc3RcIixcblx0XCJhdCBsZWFzdFwiLCBcImF0IGxlbmd0aFwiLCBcImF0IHRoZSBwcmVzZW50IHRpbWVcIiwgXCJhdCB0aGUgc2FtZSB0aW1lXCIsIFwiYXQgdGhpcyBpbnN0YW50XCIsIFwiYXQgdGhpcyBwb2ludFwiLCBcImF0IHRoaXMgdGltZVwiLFxuXHRcImJhbGFuY2VkIGFnYWluc3RcIiwgXCJiZWluZyB0aGF0XCIsIFwiYnkgYWxsIG1lYW5zXCIsIFwiYnkgYW5kIGxhcmdlXCIsIFwiYnkgY29tcGFyaXNvblwiLCBcImJ5IHRoZSBzYW1lIHRva2VuXCIsIFwiYnkgdGhlIHRpbWVcIixcblx0XCJjb21wYXJlZCB0b1wiLCBcImJlIHRoYXQgYXMgaXQgbWF5XCIsIFwiY291cGxlZCB3aXRoXCIsIFwiZGlmZmVyZW50IGZyb21cIiwgXCJkdWUgdG9cIiwgXCJlcXVhbGx5IGltcG9ydGFudFwiLCBcImV2ZW4gaWZcIixcblx0XCJldmVuIG1vcmVcIiwgXCJldmVuIHNvXCIsIFwiZXZlbiB0aG91Z2hcIiwgXCJmaXJzdCB0aGluZyB0byByZW1lbWJlclwiLCBcImZvciBleGFtcGxlXCIsIFwiZm9yIGZlYXIgdGhhdFwiLCBcImZvciBpbnN0YW5jZVwiLFxuXHRcImZvciBvbmUgdGhpbmdcIiwgXCJmb3IgdGhhdCByZWFzb25cIiwgXCJmb3IgdGhlIG1vc3QgcGFydFwiLCBcImZvciB0aGUgcHVycG9zZSBvZlwiLCBcImZvciB0aGUgc2FtZSByZWFzb25cIiwgXCJmb3IgdGhpcyBwdXJwb3NlXCIsXG5cdFwiZm9yIHRoaXMgcmVhc29uXCIsIFwiZnJvbSB0aW1lIHRvIHRpbWVcIiwgXCJnaXZlbiB0aGF0XCIsIFwiZ2l2ZW4gdGhlc2UgcG9pbnRzXCIsIFwiaW1wb3J0YW50IHRvIHJlYWxpemVcIiwgXCJpbiBhIHdvcmRcIiwgXCJpbiBhZGRpdGlvblwiLFxuXHRcImluIGFub3RoZXIgY2FzZVwiLCBcImluIGFueSBjYXNlXCIsIFwiaW4gYW55IGV2ZW50XCIsIFwiaW4gYnJpZWZcIiwgXCJpbiBjYXNlXCIsIFwiaW4gY29uY2x1c2lvblwiLCBcImluIGNvbnRyYXN0XCIsXG5cdFwiaW4gZGV0YWlsXCIsIFwiaW4gZHVlIHRpbWVcIiwgXCJpbiBlZmZlY3RcIiwgXCJpbiBlaXRoZXIgY2FzZVwiLCBcImluIGVzc2VuY2VcIiwgXCJpbiBmYWN0XCIsIFwiaW4gZ2VuZXJhbFwiLCBcImluIGxpZ2h0IG9mXCIsXG5cdFwiaW4gbGlrZSBmYXNoaW9uXCIsIFwiaW4gbGlrZSBtYW5uZXJcIiwgXCJpbiBvcmRlciB0aGF0XCIsIFwiaW4gb3JkZXIgdG9cIiwgXCJpbiBvdGhlciB3b3Jkc1wiLCBcImluIHBhcnRpY3VsYXJcIiwgXCJpbiByZWFsaXR5XCIsXG5cdFwiaW4gc2hvcnRcIiwgXCJpbiBzaW1pbGFyIGZhc2hpb25cIiwgXCJpbiBzcGl0ZSBvZlwiLCBcImluIHN1bVwiLCBcImluIHN1bW1hcnlcIiwgXCJpbiB0aGF0IGNhc2VcIiwgXCJpbiB0aGUgZXZlbnQgdGhhdFwiLFxuXHRcImluIHRoZSBmaW5hbCBhbmFseXNpc1wiLCBcImluIHRoZSBmaXJzdCBwbGFjZVwiLCBcImluIHRoZSBmb3VydGggcGxhY2VcIiwgXCJpbiB0aGUgaG9wZSB0aGF0XCIsIFwiaW4gdGhlIGxpZ2h0IG9mXCIsXG5cdFwiaW4gdGhlIGxvbmcgcnVuXCIsIFwiaW4gdGhlIG1lYW50aW1lXCIsIFwiaW4gdGhlIHNhbWUgZmFzaGlvblwiLCBcImluIHRoZSBzYW1lIHdheVwiLCBcImluIHRoZSBzZWNvbmQgcGxhY2VcIixcblx0XCJpbiB0aGUgdGhpcmQgcGxhY2VcIiwgXCJpbiB0aGlzIGNhc2VcIiwgXCJpbiB0aGlzIHNpdHVhdGlvblwiLCBcImluIHRpbWVcIiwgXCJpbiB0cnV0aFwiLCBcImluIHZpZXcgb2ZcIiwgXCJpbmFzbXVjaCBhc1wiLFxuXHRcIm1vc3QgY29tcGVsbGluZyBldmlkZW5jZVwiLCBcIm1vc3QgaW1wb3J0YW50XCIsIFwibXVzdCBiZSByZW1lbWJlcmVkXCIsIFwibm90IHRvIG1lbnRpb25cIiwgXCJub3cgdGhhdFwiLCBcIm9mIGNvdXJzZVwiLFxuXHRcIm9uIGFjY291bnQgb2ZcIiwgXCJvbiBiYWxhbmNlXCIsIFwib24gY29uZGl0aW9uIHRoYXRcIiwgXCJvbiBvbmUgaGFuZFwiLCBcIm9uIHRoZSBjb25kaXRpb24gdGhhdFwiLCBcIm9uIHRoZSBjb250cmFyeVwiLFxuXHRcIm9uIHRoZSBuZWdhdGl2ZSBzaWRlXCIsIFwib24gdGhlIG90aGVyIGhhbmRcIiwgXCJvbiB0aGUgcG9zaXRpdmUgc2lkZVwiLCBcIm9uIHRoZSB3aG9sZVwiLCBcIm9uIHRoaXMgb2NjYXNpb25cIiwgXCJvbmNlXCIsXG5cdFwib25jZSBpbiBhIHdoaWxlXCIsIFx0XCJvbmx5IGlmXCIsIFwib3dpbmcgdG9cIiwgXCJwb2ludCBvZnRlbiBvdmVybG9va2VkXCIsIFwicHJpb3IgdG9cIiwgXCJwcm92aWRlZCB0aGF0XCIsIFwic2VlaW5nIHRoYXRcIixcblx0XCJzbyBhcyB0b1wiLCBcInNvIGZhclwiLCBcInNvIGxvbmcgYXNcIiwgXCJzbyB0aGF0XCIsIFwic29vbmVyIG9yIGxhdGVyXCIsIFwic3VjaCBhc1wiLCBcInN1bW1pbmcgdXBcIiwgXCJ0YWtlIHRoZSBjYXNlIG9mXCIsXG5cdFwidGhhdCBpc1wiLCBcInRoYXQgaXMgdG8gc2F5XCIsIFwidGhlbiBhZ2FpblwiLCBcInRoaXMgdGltZVwiLCBcInRvIGJlIHN1cmVcIiwgXCJ0byBiZWdpbiB3aXRoXCIsIFwidG8gY2xhcmlmeVwiLCBcInRvIGNvbmNsdWRlXCIsXG5cdFwidG8gZGVtb25zdHJhdGVcIiwgXCJ0byBlbXBoYXNpemVcIiwgXCJ0byBlbnVtZXJhdGVcIiwgXCJ0byBleHBsYWluXCIsIFwidG8gaWxsdXN0cmF0ZVwiLCBcInRvIGxpc3RcIiwgXCJ0byBwb2ludCBvdXRcIixcblx0XCJ0byBwdXQgaXQgYW5vdGhlciB3YXlcIiwgXCJ0byBwdXQgaXQgZGlmZmVyZW50bHlcIiwgXCJ0byByZXBlYXRcIiwgXCJ0byByZXBocmFzZSBpdFwiLCBcInRvIHNheSBub3RoaW5nIG9mXCIsIFwidG8gc3VtIHVwXCIsXG5cdFwidG8gc3VtbWFyaXplXCIsIFwidG8gdGhhdCBlbmRcIiwgXCJ0byB0aGUgZW5kIHRoYXRcIiwgXCJ0byB0aGlzIGVuZFwiLCBcInRvZ2V0aGVyIHdpdGhcIiwgXCJ1bmRlciB0aG9zZSBjaXJjdW1zdGFuY2VzXCIsIFwidW50aWwgbm93XCIsXG5cdFwidXAgYWdhaW5zdFwiLCBcInVwIHRvIHRoZSBwcmVzZW50IHRpbWVcIiwgXCJ2aXMgYSB2aXNcIiwgXCJ3aGF0J3MgbW9yZVwiLCBcIndoaWxlIGl0IG1heSBiZSB0cnVlXCIsIFwid2hpbGUgdGhpcyBtYXkgYmUgdHJ1ZVwiLFxuXHRcIndpdGggYXR0ZW50aW9uIHRvXCIsIFwid2l0aCB0aGUgcmVzdWx0IHRoYXRcIiwgXCJ3aXRoIHRoaXMgaW4gbWluZFwiLCBcIndpdGggdGhpcyBpbnRlbnRpb25cIiwgXCJ3aXRoIHRoaXMgcHVycG9zZSBpbiBtaW5kXCIsXG5cdFwid2l0aG91dCBhIGRvdWJ0XCIsIFwid2l0aG91dCBkZWxheVwiLCBcIndpdGhvdXQgZG91YnRcIiwgXCJ3aXRob3V0IHJlc2VydmF0aW9uXCIgXTtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIGFycmF5IHdpdGggdHJhbnNpdGlvbiB3b3JkcyB0byBiZSB1c2VkIGJ5IHRoZSBhc3Nlc3NtZW50cy5cbiAqIEByZXR1cm5zIHtBcnJheX0gVGhlIGFycmF5IGZpbGxlZCB3aXRoIHRyYW5zaXRpb24gd29yZHMuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0c2luZ2xlV29yZHM6IHNpbmdsZVdvcmRzLFxuXHRcdG11bHRpcGxlV29yZHM6IG11bHRpcGxlV29yZHMsXG5cdFx0YWxsV29yZHM6IHNpbmdsZVdvcmRzLmNvbmNhdCggbXVsdGlwbGVXb3JkcyApXG5cdH07XG59O1xuIiwiLyoqIEBtb2R1bGUgc3RyaW5nUHJvY2Vzc2luZy9hZGRXb3JkYm91bmRhcnkgKi9cblxuLyoqXG4gKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgY2FuIGJlIHVzZWQgaW4gYSByZWdleCB0byBtYXRjaCBhIG1hdGNoU3RyaW5nIHdpdGggd29yZCBib3VuZGFyaWVzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtYXRjaFN0cmluZyBUaGUgc3RyaW5nIHRvIGdlbmVyYXRlIGEgcmVnZXggc3RyaW5nIGZvci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbZXh0cmFXb3JkQm91bmRhcnldIEV4dHJhIGNoYXJhY3RlcnMgdG8gbWF0Y2ggYSB3b3JkIGJvdW5kYXJ5IG9uLlxuICogQHJldHVybnMge3N0cmluZ30gQSByZWdleCBzdHJpbmcgdGhhdCBtYXRjaGVzIHRoZSBtYXRjaFN0cmluZyB3aXRoIHdvcmQgYm91bmRhcmllcy5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggbWF0Y2hTdHJpbmcsIGV4dHJhV29yZEJvdW5kYXJ5ICkge1xuXHR2YXIgd29yZEJvdW5kYXJ5LCB3b3JkQm91bmRhcnlTdGFydCwgd29yZEJvdW5kYXJ5RW5kO1xuXHR2YXIgX2V4dHJhV29yZEJvdW5kYXJ5ID0gZXh0cmFXb3JkQm91bmRhcnkgfHwgXCJcIjtcblxuXHR3b3JkQm91bmRhcnkgPSBcIlsgXFxuXFxyXFx0XFwuLCdcXChcXClcXFwiXFwrXFwtOyE/OlxcL8K7wqvigLnigLpcIiArIF9leHRyYVdvcmRCb3VuZGFyeSArIFwiPD5dXCI7XG5cdHdvcmRCb3VuZGFyeVN0YXJ0ID0gXCIoXnxcIiArIHdvcmRCb3VuZGFyeSArIFwiKVwiO1xuXHR3b3JkQm91bmRhcnlFbmQgPSBcIigkfFwiICsgd29yZEJvdW5kYXJ5ICsgXCIpXCI7XG5cblx0cmV0dXJuIHdvcmRCb3VuZGFyeVN0YXJ0ICsgbWF0Y2hTdHJpbmcgKyB3b3JkQm91bmRhcnlFbmQ7XG59O1xuIiwiLyoqIEBtb2R1bGUgc3RyaW5nUHJvY2Vzc2luZy9jcmVhdGVSZWdleEZyb21BcnJheSAqL1xuXG52YXIgYWRkV29yZEJvdW5kYXJ5ID0gcmVxdWlyZSggXCIuLi9zdHJpbmdQcm9jZXNzaW5nL2FkZFdvcmRib3VuZGFyeS5qc1wiICk7XG52YXIgbWFwID0gcmVxdWlyZSggXCJsb2Rhc2gvbWFwXCIgKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgcmVnZXggb2YgY29tYmluZWQgc3RyaW5ncyBmcm9tIHRoZSBpbnB1dCBhcnJheS5cbiAqXG4gKiBAcGFyYW0ge2FycmF5fSBhcnJheSBUaGUgYXJyYXkgd2l0aCBzdHJpbmdzXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtkaXNhYmxlV29yZEJvdW5kYXJ5XSBCb29sZWFuIGluZGljYXRpbmcgd2hldGhlciBvciBub3QgdG8gZGlzYWJsZSB3b3JkIGJvdW5kYXJpZXNcbiAqIEByZXR1cm5zIHtSZWdFeHB9IHJlZ2V4IFRoZSByZWdleCBjcmVhdGVkIGZyb20gdGhlIGFycmF5LlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBhcnJheSwgZGlzYWJsZVdvcmRCb3VuZGFyeSApIHtcblx0dmFyIHJlZ2V4U3RyaW5nO1xuXHR2YXIgX2Rpc2FibGVXb3JkQm91bmRhcnkgPSBkaXNhYmxlV29yZEJvdW5kYXJ5IHx8IGZhbHNlO1xuXG5cdHZhciBib3VuZGVkQXJyYXkgPSBtYXAoIGFycmF5LCBmdW5jdGlvbiggc3RyaW5nICkge1xuXHRcdGlmICggX2Rpc2FibGVXb3JkQm91bmRhcnkgKSB7XG5cdFx0XHRyZXR1cm4gc3RyaW5nO1xuXHRcdH1cblx0XHRyZXR1cm4gYWRkV29yZEJvdW5kYXJ5KCBzdHJpbmcgKTtcblx0fSApO1xuXG5cdHJlZ2V4U3RyaW5nID0gXCIoXCIgKyBib3VuZGVkQXJyYXkuam9pbiggXCIpfChcIiApICsgXCIpXCI7XG5cblx0cmV0dXJuIG5ldyBSZWdFeHAoIHJlZ2V4U3RyaW5nLCBcImlnXCIgKTtcbn07XG4iLCJ2YXIgbWFwID0gcmVxdWlyZSggXCJsb2Rhc2gvbWFwXCIgKTtcbnZhciBpc1VuZGVmaW5lZCA9IHJlcXVpcmUoIFwibG9kYXNoL2lzVW5kZWZpbmVkXCIgKTtcbnZhciBmb3JFYWNoID0gcmVxdWlyZSggXCJsb2Rhc2gvZm9yRWFjaFwiICk7XG52YXIgaXNOYU4gPSByZXF1aXJlKCBcImxvZGFzaC9pc05hTlwiICk7XG52YXIgZmlsdGVyID0gcmVxdWlyZSggXCJsb2Rhc2gvZmlsdGVyXCIgKTtcbnZhciBmbGF0TWFwID0gcmVxdWlyZSggXCJsb2Rhc2gvZmxhdE1hcFwiICk7XG52YXIgaXNFbXB0eSA9IHJlcXVpcmUoIFwibG9kYXNoL2lzRW1wdHlcIiApO1xudmFyIG5lZ2F0ZSA9IHJlcXVpcmUoIFwibG9kYXNoL25lZ2F0ZVwiICk7XG52YXIgbWVtb2l6ZSA9IHJlcXVpcmUoIFwibG9kYXNoL21lbW9pemVcIiApO1xuXG52YXIgY29yZSA9IHJlcXVpcmUoIFwidG9rZW5pemVyMi9jb3JlXCIgKTtcblxudmFyIGdldEJsb2NrcyA9IHJlcXVpcmUoIFwiLi4vaGVscGVycy9odG1sLmpzXCIgKS5nZXRCbG9ja3M7XG52YXIgbm9ybWFsaXplUXVvdGVzID0gcmVxdWlyZSggXCIuLi9zdHJpbmdQcm9jZXNzaW5nL3F1b3Rlcy5qc1wiICkubm9ybWFsaXplO1xuXG52YXIgdW5pZnlXaGl0ZXNwYWNlID0gcmVxdWlyZSggXCIuLi9zdHJpbmdQcm9jZXNzaW5nL3VuaWZ5V2hpdGVzcGFjZS5qc1wiICkudW5pZnlOb25CcmVha2luZ1NwYWNlO1xuXG4vLyBBbGwgY2hhcmFjdGVycyB0aGF0IGluZGljYXRlIGEgc2VudGVuY2UgZGVsaW1pdGVyLlxudmFyIGZ1bGxTdG9wID0gXCIuXCI7XG4vLyBUaGUgXFx1MjAyNiBjaGFyYWN0ZXIgaXMgYW4gZWxsaXBzaXNcbnZhciBzZW50ZW5jZURlbGltaXRlcnMgPSBcIj8hO1xcdTIwMjZcIjtcbnZhciBuZXdMaW5lcyA9IFwiXFxuXFxyfFxcbnxcXHJcIjtcblxudmFyIGZ1bGxTdG9wUmVnZXggPSBuZXcgUmVnRXhwKCBcIl5bXCIgKyBmdWxsU3RvcCArIFwiXSRcIiApO1xudmFyIHNlbnRlbmNlRGVsaW1pdGVyUmVnZXggPSBuZXcgUmVnRXhwKCBcIl5bXCIgKyBzZW50ZW5jZURlbGltaXRlcnMgKyBcIl0kXCIgKTtcbnZhciBzZW50ZW5jZVJlZ2V4ID0gbmV3IFJlZ0V4cCggXCJeW15cIiArIGZ1bGxTdG9wICsgc2VudGVuY2VEZWxpbWl0ZXJzICsgXCI8XFxcXChcXFxcKVxcXFxbXFxcXF1dKyRcIiApO1xudmFyIGh0bWxTdGFydFJlZ2V4ID0gL148KFtePlxcc1xcL10rKVtePl0qPiQvbWk7XG52YXIgaHRtbEVuZFJlZ2V4ID0gL148XFwvKFtePlxcc10rKVtePl0qPiQvbWk7XG52YXIgbmV3TGluZVJlZ2V4ID0gbmV3IFJlZ0V4cCggbmV3TGluZXMgKTtcblxudmFyIGJsb2NrU3RhcnRSZWdleCA9IC9eXFxzKltcXFtcXChcXHtdXFxzKiQvO1xudmFyIGJsb2NrRW5kUmVnZXggPSAvXlxccypbXFxdXFwpfV1cXHMqJC87XG5cbnZhciB0b2tlbnMgPSBbXTtcbnZhciBzZW50ZW5jZVRva2VuaXplcjtcblxuLyoqXG4gKiBDcmVhdGVzIGEgdG9rZW5pemVyIHRvIGNyZWF0ZSB0b2tlbnMgZnJvbSBhIHNlbnRlbmNlLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5mdW5jdGlvbiBjcmVhdGVUb2tlbml6ZXIoKSB7XG5cdHRva2VucyA9IFtdO1xuXG5cdHNlbnRlbmNlVG9rZW5pemVyID0gY29yZSggZnVuY3Rpb24oIHRva2VuICkge1xuXHRcdHRva2Vucy5wdXNoKCB0b2tlbiApO1xuXHR9ICk7XG5cblx0c2VudGVuY2VUb2tlbml6ZXIuYWRkUnVsZSggaHRtbFN0YXJ0UmVnZXgsIFwiaHRtbC1zdGFydFwiICk7XG5cdHNlbnRlbmNlVG9rZW5pemVyLmFkZFJ1bGUoIGh0bWxFbmRSZWdleCwgXCJodG1sLWVuZFwiICk7XG5cdHNlbnRlbmNlVG9rZW5pemVyLmFkZFJ1bGUoIGJsb2NrU3RhcnRSZWdleCwgXCJibG9jay1zdGFydFwiICk7XG5cdHNlbnRlbmNlVG9rZW5pemVyLmFkZFJ1bGUoIGJsb2NrRW5kUmVnZXgsIFwiYmxvY2stZW5kXCIgKTtcblx0c2VudGVuY2VUb2tlbml6ZXIuYWRkUnVsZSggZnVsbFN0b3BSZWdleCwgXCJmdWxsLXN0b3BcIiApO1xuXHRzZW50ZW5jZVRva2VuaXplci5hZGRSdWxlKCBzZW50ZW5jZURlbGltaXRlclJlZ2V4LCBcInNlbnRlbmNlLWRlbGltaXRlclwiICk7XG5cdHNlbnRlbmNlVG9rZW5pemVyLmFkZFJ1bGUoIHNlbnRlbmNlUmVnZXgsIFwic2VudGVuY2VcIiApO1xufVxuXG4vKipcbiAqIFJldHVybnMgd2hldGhlciBvciBub3QgYSBjZXJ0YWluIGNoYXJhY3RlciBpcyBhIGNhcGl0YWwgbGV0dGVyLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjaGFyYWN0ZXIgVGhlIGNoYXJhY3RlciB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgY2hhcmFjdGVyIGlzIGEgY2FwaXRhbCBsZXR0ZXIuXG4gKi9cbmZ1bmN0aW9uIGlzQ2FwaXRhbExldHRlciggY2hhcmFjdGVyICkge1xuXHRyZXR1cm4gY2hhcmFjdGVyICE9PSBjaGFyYWN0ZXIudG9Mb2NhbGVMb3dlckNhc2UoKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IGEgY2VydGFpbiBjaGFyYWN0ZXIgaXMgYSBudW1iZXIuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGNoYXJhY3RlciBUaGUgY2hhcmFjdGVyIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoZSBjaGFyYWN0ZXIgaXMgYSBjYXBpdGFsIGxldHRlci5cbiAqL1xuZnVuY3Rpb24gaXNOdW1iZXIoIGNoYXJhY3RlciApIHtcblx0cmV0dXJuICEgaXNOYU4oIHBhcnNlSW50KCBjaGFyYWN0ZXIsIDEwICkgKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IGEgZ2l2ZW4gSFRNTCB0YWcgaXMgYSBicmVhayB0YWcuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGh0bWxUYWcgVGhlIEhUTUwgdGFnIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBIVE1MIHRhZyBpcyBhIGJyZWFrIHRhZy5cbiAqL1xuZnVuY3Rpb24gaXNCcmVha1RhZyggaHRtbFRhZyApIHtcblx0cmV0dXJuIC88YnIvLnRlc3QoIGh0bWxUYWcgKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IGEgZ2l2ZW4gY2hhcmFjdGVyIGlzIHF1b3RhdGlvbiBtYXJrLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjaGFyYWN0ZXIgVGhlIGNoYXJhY3RlciB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gY2hhcmFjdGVyIGlzIGEgcXVvdGF0aW9uIG1hcmsuXG4gKi9cbmZ1bmN0aW9uIGlzUXVvdGF0aW9uKCBjaGFyYWN0ZXIgKSB7XG5cdGNoYXJhY3RlciA9IG5vcm1hbGl6ZVF1b3RlcyggY2hhcmFjdGVyICk7XG5cblx0cmV0dXJuIFwiJ1wiID09PSBjaGFyYWN0ZXIgfHxcblx0XHRcIlxcXCJcIiA9PT0gY2hhcmFjdGVyO1xufVxuXG4vKipcbiAqIFJldHVybnMgd2hldGhlciBvciBub3QgYSBnaXZlbiBjaGFyYWN0ZXIgaXMgYSBwdW5jdHVhdGlvbiBtYXJrIHRoYXQgY2FuIGJlIGF0IHRoZSBiZWdpbm5pbmdcbiAqIG9mIGEgc2VudGVuY2UsIGxpa2Ugwr8gYW5kIMKhIHVzZWQgaW4gU3BhbmlzaC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY2hhcmFjdGVyIFRoZSBjaGFyYWN0ZXIgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhlIGdpdmVuIGNoYXJhY3RlciBpcyBhIHB1bmN0dWF0aW9uIG1hcmsuXG4gKi9cbmZ1bmN0aW9uIGlzUHVuY3R1YXRpb24oIGNoYXJhY3RlciApIHtcblx0cmV0dXJuIFwiwr9cIiA9PT0gY2hhcmFjdGVyIHx8XG5cdFx0XCLCoVwiID09PSBjaGFyYWN0ZXI7XG59XG5cbi8qKlxuICogVG9rZW5pemVzIGEgc2VudGVuY2UsIGFzc3VtZXMgdGhhdCB0aGUgdGV4dCBoYXMgYWxyZWFkeSBiZWVuIHNwbGl0IGludG8gYmxvY2tzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHRvIHRva2VuaXplLlxuICogQHJldHVybnMge0FycmF5fSBBbiBhcnJheSBvZiB0b2tlbnMuXG4gKi9cbmZ1bmN0aW9uIHRva2VuaXplU2VudGVuY2VzKCB0ZXh0ICkge1xuXHRjcmVhdGVUb2tlbml6ZXIoKTtcblx0c2VudGVuY2VUb2tlbml6ZXIub25UZXh0KCB0ZXh0ICk7XG5cblx0c2VudGVuY2VUb2tlbml6ZXIuZW5kKCk7XG5cblx0cmV0dXJuIHRva2Vucztcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGR1cGxpY2F0ZSB3aGl0ZXNwYWNlIGZyb20gYSBnaXZlbiB0ZXh0LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHdpdGggZHVwbGljYXRlIHdoaXRlc3BhY2UuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgdGV4dCB3aXRob3V0IGR1cGxpY2F0ZSB3aGl0ZXNwYWNlLlxuICovXG5mdW5jdGlvbiByZW1vdmVEdXBsaWNhdGVXaGl0ZXNwYWNlKCB0ZXh0ICkge1xuXHRyZXR1cm4gdGV4dC5yZXBsYWNlKCAvXFxzKy8sIFwiIFwiICk7XG59XG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSBuZXh0IHR3byBjaGFyYWN0ZXJzIGZyb20gYW4gYXJyYXkgd2l0aCB0aGUgdHdvIG5leHQgdG9rZW5zLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IG5leHRUb2tlbnMgVGhlIHR3byBuZXh0IHRva2Vucy4gTWlnaHQgYmUgdW5kZWZpbmVkLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIG5leHQgdHdvIGNoYXJhY3RlcnMuXG4gKi9cbmZ1bmN0aW9uIGdldE5leHRUd29DaGFyYWN0ZXJzKCBuZXh0VG9rZW5zICkge1xuXHR2YXIgbmV4dCA9IFwiXCI7XG5cblx0aWYgKCAhIGlzVW5kZWZpbmVkKCBuZXh0VG9rZW5zWyAwIF0gKSApIHtcblx0XHRuZXh0ICs9IG5leHRUb2tlbnNbIDAgXS5zcmM7XG5cdH1cblxuXHRpZiAoICEgaXNVbmRlZmluZWQoIG5leHRUb2tlbnNbIDEgXSApICkge1xuXHRcdG5leHQgKz0gbmV4dFRva2Vuc1sgMSBdLnNyYztcblx0fVxuXG5cdG5leHQgPSByZW1vdmVEdXBsaWNhdGVXaGl0ZXNwYWNlKCBuZXh0ICk7XG5cblx0cmV0dXJuIG5leHQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBzZW50ZW5jZUJlZ2lubmluZyBiZWdpbm5pbmcgaXMgYSB2YWxpZCBiZWdpbm5pbmcuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHNlbnRlbmNlQmVnaW5uaW5nIFRoZSBiZWdpbm5pbmcgb2YgdGhlIHNlbnRlbmNlIHRvIHZhbGlkYXRlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiBpdCBpcyBhIHZhbGlkIGJlZ2lubmluZywgZmFsc2UgaWYgaXQgaXMgbm90LlxuICovXG5mdW5jdGlvbiBpc1ZhbGlkU2VudGVuY2VCZWdpbm5pbmcoIHNlbnRlbmNlQmVnaW5uaW5nICkge1xuXHRyZXR1cm4gKFxuXHRcdGlzQ2FwaXRhbExldHRlciggc2VudGVuY2VCZWdpbm5pbmcgKSB8fFxuXHRcdGlzTnVtYmVyKCBzZW50ZW5jZUJlZ2lubmluZyApIHx8XG5cdFx0aXNRdW90YXRpb24oIHNlbnRlbmNlQmVnaW5uaW5nICkgfHxcblx0XHRpc1B1bmN0dWF0aW9uKCBzZW50ZW5jZUJlZ2lubmluZyApXG5cdCk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSB0b2tlbiBpcyBhIHZhbGlkIHNlbnRlbmNlIGVuZGluZy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdG9rZW4gVGhlIHRva2VuIHRvIHZhbGlkYXRlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiB0aGUgdG9rZW4gaXMgdmFsaWQgZW5kaW5nLCBmYWxzZSBpZiBpdCBpcyBub3QuXG4gKi9cbmZ1bmN0aW9uIGlzU2VudGVuY2VTdGFydCggdG9rZW4gKSB7XG5cdHJldHVybiAoICEgaXNVbmRlZmluZWQoIHRva2VuICkgJiYgKFxuXHRcdFwiaHRtbC1zdGFydFwiID09PSB0b2tlbi50eXBlIHx8XG5cdFx0XCJodG1sLWVuZFwiID09PSB0b2tlbi50eXBlIHx8XG5cdFx0XCJibG9jay1zdGFydFwiID09PSB0b2tlbi50eXBlXG5cdCkgKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGFuIGFycmF5IG9mIHNlbnRlbmNlcyBmb3IgYSBnaXZlbiBhcnJheSBvZiB0b2tlbnMsIGFzc3VtZXMgdGhhdCB0aGUgdGV4dCBoYXMgYWxyZWFkeSBiZWVuIHNwbGl0IGludG8gYmxvY2tzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHRva2VucyBUaGUgdG9rZW5zIGZyb20gdGhlIHNlbnRlbmNlIHRva2VuaXplci5cbiAqIEByZXR1cm5zIHtBcnJheTxzdHJpbmc+fSBBIGxpc3Qgb2Ygc2VudGVuY2VzLlxuICovXG5mdW5jdGlvbiBnZXRTZW50ZW5jZXNGcm9tVG9rZW5zKCB0b2tlbnMgKSB7XG5cdHZhciB0b2tlblNlbnRlbmNlcyA9IFtdLCBjdXJyZW50U2VudGVuY2UgPSBcIlwiLCBuZXh0U2VudGVuY2VTdGFydDtcblxuXHR2YXIgc2xpY2VkO1xuXG5cdC8vIERyb3AgdGhlIGZpcnN0IGFuZCBsYXN0IEhUTUwgdGFnIGlmIGJvdGggYXJlIHByZXNlbnQuXG5cdGRvIHtcblx0XHRzbGljZWQgPSBmYWxzZTtcblx0XHR2YXIgZmlyc3RUb2tlbiA9IHRva2Vuc1sgMCBdO1xuXHRcdHZhciBsYXN0VG9rZW4gPSB0b2tlbnNbIHRva2Vucy5sZW5ndGggLSAxIF07XG5cblx0XHRpZiAoIGZpcnN0VG9rZW4udHlwZSA9PT0gXCJodG1sLXN0YXJ0XCIgJiYgbGFzdFRva2VuLnR5cGUgPT09IFwiaHRtbC1lbmRcIiApIHtcblx0XHRcdHRva2VucyA9IHRva2Vucy5zbGljZSggMSwgdG9rZW5zLmxlbmd0aCAtIDEgKTtcblxuXHRcdFx0c2xpY2VkID0gdHJ1ZTtcblx0XHR9XG5cdH0gd2hpbGUgKCBzbGljZWQgJiYgdG9rZW5zLmxlbmd0aCA+IDEgKTtcblxuXHRmb3JFYWNoKCB0b2tlbnMsIGZ1bmN0aW9uKCB0b2tlbiwgaSApIHtcblx0XHR2YXIgaGFzTmV4dFNlbnRlbmNlO1xuXHRcdHZhciBuZXh0VG9rZW4gPSB0b2tlbnNbIGkgKyAxIF07XG5cdFx0dmFyIHNlY29uZFRvTmV4dFRva2VuID0gdG9rZW5zWyBpICsgMiBdO1xuXHRcdHZhciBuZXh0Q2hhcmFjdGVycztcblxuXHRcdHN3aXRjaCAoIHRva2VuLnR5cGUgKSB7XG5cblx0XHRcdGNhc2UgXCJodG1sLXN0YXJ0XCI6XG5cdFx0XHRjYXNlIFwiaHRtbC1lbmRcIjpcblx0XHRcdFx0aWYgKCBpc0JyZWFrVGFnKCB0b2tlbi5zcmMgKSApIHtcblx0XHRcdFx0XHR0b2tlblNlbnRlbmNlcy5wdXNoKCBjdXJyZW50U2VudGVuY2UgKTtcblx0XHRcdFx0XHRjdXJyZW50U2VudGVuY2UgPSBcIlwiO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGN1cnJlbnRTZW50ZW5jZSArPSB0b2tlbi5zcmM7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgXCJzZW50ZW5jZVwiOlxuXHRcdFx0XHRjdXJyZW50U2VudGVuY2UgKz0gdG9rZW4uc3JjO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBcInNlbnRlbmNlLWRlbGltaXRlclwiOlxuXHRcdFx0XHRjdXJyZW50U2VudGVuY2UgKz0gdG9rZW4uc3JjO1xuXG5cdFx0XHRcdGlmICggISBpc1VuZGVmaW5lZCggbmV4dFRva2VuICkgJiYgXCJibG9jay1lbmRcIiAhPT0gbmV4dFRva2VuLnR5cGUgKSB7XG5cdFx0XHRcdFx0dG9rZW5TZW50ZW5jZXMucHVzaCggY3VycmVudFNlbnRlbmNlICk7XG5cdFx0XHRcdFx0Y3VycmVudFNlbnRlbmNlID0gXCJcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBcImZ1bGwtc3RvcFwiOlxuXHRcdFx0XHRjdXJyZW50U2VudGVuY2UgKz0gdG9rZW4uc3JjO1xuXG5cdFx0XHRcdG5leHRDaGFyYWN0ZXJzID0gZ2V0TmV4dFR3b0NoYXJhY3RlcnMoIFsgbmV4dFRva2VuLCBzZWNvbmRUb05leHRUb2tlbiBdICk7XG5cblx0XHRcdFx0Ly8gRm9yIGEgbmV3IHNlbnRlbmNlIHdlIG5lZWQgdG8gY2hlY2sgdGhlIG5leHQgdHdvIGNoYXJhY3RlcnMuXG5cdFx0XHRcdGhhc05leHRTZW50ZW5jZSA9IG5leHRDaGFyYWN0ZXJzLmxlbmd0aCA+PSAyO1xuXHRcdFx0XHRuZXh0U2VudGVuY2VTdGFydCA9IGhhc05leHRTZW50ZW5jZSA/IG5leHRDaGFyYWN0ZXJzWyAxIF0gOiBcIlwiO1xuXHRcdFx0XHQvLyBJZiB0aGUgbmV4dCBjaGFyYWN0ZXIgaXMgYSBudW1iZXIsIG5ldmVyIHNwbGl0LiBGb3IgZXhhbXBsZTogSVB2NC1udW1iZXJzLlxuXHRcdFx0XHRpZiAoIGhhc05leHRTZW50ZW5jZSAmJiBpc051bWJlciggbmV4dENoYXJhY3RlcnNbIDAgXSApICkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIE9ubHkgc3BsaXQgb24gc2VudGVuY2UgZGVsaW1pdGVycyB3aGVuIHRoZSBuZXh0IHNlbnRlbmNlIGxvb2tzIGxpa2UgdGhlIHN0YXJ0IG9mIGEgc2VudGVuY2UuXG5cblx0XHRcdFx0aWYgKCAoIGhhc05leHRTZW50ZW5jZSAmJiBpc1ZhbGlkU2VudGVuY2VCZWdpbm5pbmcoIG5leHRTZW50ZW5jZVN0YXJ0ICkgKSB8fCBpc1NlbnRlbmNlU3RhcnQoIG5leHRUb2tlbiApICkge1xuXHRcdFx0XHRcdHRva2VuU2VudGVuY2VzLnB1c2goIGN1cnJlbnRTZW50ZW5jZSApO1xuXHRcdFx0XHRcdGN1cnJlbnRTZW50ZW5jZSA9IFwiXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgXCJuZXdsaW5lXCI6XG5cdFx0XHRcdHRva2VuU2VudGVuY2VzLnB1c2goIGN1cnJlbnRTZW50ZW5jZSApO1xuXHRcdFx0XHRjdXJyZW50U2VudGVuY2UgPSBcIlwiO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBcImJsb2NrLXN0YXJ0XCI6XG5cdFx0XHRcdGN1cnJlbnRTZW50ZW5jZSArPSB0b2tlbi5zcmM7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFwiYmxvY2stZW5kXCI6XG5cdFx0XHRcdGN1cnJlbnRTZW50ZW5jZSArPSB0b2tlbi5zcmM7XG5cblx0XHRcdFx0bmV4dENoYXJhY3RlcnMgPSBnZXROZXh0VHdvQ2hhcmFjdGVycyggWyBuZXh0VG9rZW4sIHNlY29uZFRvTmV4dFRva2VuIF0gKTtcblxuXHRcdFx0XHQvLyBGb3IgYSBuZXcgc2VudGVuY2Ugd2UgbmVlZCB0byBjaGVjayB0aGUgbmV4dCB0d28gY2hhcmFjdGVycy5cblx0XHRcdFx0aGFzTmV4dFNlbnRlbmNlID0gbmV4dENoYXJhY3RlcnMubGVuZ3RoID49IDI7XG5cdFx0XHRcdG5leHRTZW50ZW5jZVN0YXJ0ID0gaGFzTmV4dFNlbnRlbmNlID8gbmV4dENoYXJhY3RlcnNbIDAgXSA6IFwiXCI7XG5cdFx0XHRcdC8vIElmIHRoZSBuZXh0IGNoYXJhY3RlciBpcyBhIG51bWJlciwgbmV2ZXIgc3BsaXQuIEZvciBleGFtcGxlOiBJUHY0LW51bWJlcnMuXG5cdFx0XHRcdGlmICggaGFzTmV4dFNlbnRlbmNlICYmIGlzTnVtYmVyKCBuZXh0Q2hhcmFjdGVyc1sgMCBdICkgKSB7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoICggaGFzTmV4dFNlbnRlbmNlICYmIGlzVmFsaWRTZW50ZW5jZUJlZ2lubmluZyggbmV4dFNlbnRlbmNlU3RhcnQgKSApIHx8IGlzU2VudGVuY2VTdGFydCggbmV4dFRva2VuICkgKSB7XG5cdFx0XHRcdFx0dG9rZW5TZW50ZW5jZXMucHVzaCggY3VycmVudFNlbnRlbmNlICk7XG5cdFx0XHRcdFx0Y3VycmVudFNlbnRlbmNlID0gXCJcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdH0gKTtcblxuXHRpZiAoIFwiXCIgIT09IGN1cnJlbnRTZW50ZW5jZSApIHtcblx0XHR0b2tlblNlbnRlbmNlcy5wdXNoKCBjdXJyZW50U2VudGVuY2UgKTtcblx0fVxuXG5cdHRva2VuU2VudGVuY2VzID0gbWFwKCB0b2tlblNlbnRlbmNlcywgZnVuY3Rpb24oIHNlbnRlbmNlICkge1xuXHRcdHJldHVybiBzZW50ZW5jZS50cmltKCk7XG5cdH0gKTtcblxuXHRyZXR1cm4gdG9rZW5TZW50ZW5jZXM7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgc2VudGVuY2VzIGZyb20gYSBjZXJ0YWluIGJsb2NrLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBibG9jayBUaGUgSFRNTCBpbnNpZGUgYSBIVE1MIGJsb2NrLlxuICogQHJldHVybnMge0FycmF5PHN0cmluZz59IFRoZSBsaXN0IG9mIHNlbnRlbmNlcyBpbiB0aGUgYmxvY2suXG4gKi9cbmZ1bmN0aW9uIGdldFNlbnRlbmNlc0Zyb21CbG9jayggYmxvY2sgKSB7XG5cdHZhciB0b2tlbnMgPSB0b2tlbml6ZVNlbnRlbmNlcyggYmxvY2sgKTtcblxuXHRyZXR1cm4gdG9rZW5zLmxlbmd0aCA9PT0gMCA/IFtdIDogZ2V0U2VudGVuY2VzRnJvbVRva2VucyggdG9rZW5zICk7XG59XG5cbnZhciBnZXRTZW50ZW5jZXNGcm9tQmxvY2tDYWNoZWQgPSBtZW1vaXplKCBnZXRTZW50ZW5jZXNGcm9tQmxvY2sgKTtcblxuLyoqXG4gKiBSZXR1cm5zIHNlbnRlbmNlcyBpbiBhIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dCBUaGUgc3RyaW5nIHRvIGNvdW50IHNlbnRlbmNlcyBpbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gU2VudGVuY2VzIGZvdW5kIGluIHRoZSB0ZXh0LlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHR0ZXh0ID0gdW5pZnlXaGl0ZXNwYWNlKCB0ZXh0ICk7XG5cdHZhciBzZW50ZW5jZXMsIGJsb2NrcyA9IGdldEJsb2NrcyggdGV4dCApO1xuXG5cdC8vIFNwbGl0IGVhY2ggYmxvY2sgb24gbmV3bGluZXMuXG5cdGJsb2NrcyA9IGZsYXRNYXAoIGJsb2NrcywgZnVuY3Rpb24oIGJsb2NrICkge1xuXHRcdHJldHVybiBibG9jay5zcGxpdCggbmV3TGluZVJlZ2V4ICk7XG5cdH0gKTtcblxuXHRzZW50ZW5jZXMgPSBmbGF0TWFwKCBibG9ja3MsIGdldFNlbnRlbmNlc0Zyb21CbG9ja0NhY2hlZCApO1xuXG5cdHJldHVybiBmaWx0ZXIoIHNlbnRlbmNlcywgbmVnYXRlKCBpc0VtcHR5ICkgKTtcbn07XG4iLCIvKiogQG1vZHVsZSBzdHJpbmdQcm9jZXNzaW5nL2NvdW50V29yZHMgKi9cblxudmFyIHN0cmlwVGFncyA9IHJlcXVpcmUoIFwiLi9zdHJpcEhUTUxUYWdzLmpzXCIgKS5zdHJpcEZ1bGxUYWdzO1xudmFyIHN0cmlwU3BhY2VzID0gcmVxdWlyZSggXCIuL3N0cmlwU3BhY2VzLmpzXCIgKTtcbnZhciByZW1vdmVQdW5jdHVhdGlvbiA9IHJlcXVpcmUoIFwiLi9yZW1vdmVQdW5jdHVhdGlvbi5qc1wiICk7XG52YXIgbWFwID0gcmVxdWlyZSggXCJsb2Rhc2gvbWFwXCIgKTtcbnZhciBmaWx0ZXIgPSByZXF1aXJlKCBcImxvZGFzaC9maWx0ZXJcIiApO1xuXG4vKipcbiAqIFJldHVybnMgYW4gYXJyYXkgd2l0aCB3b3JkcyB1c2VkIGluIHRoZSB0ZXh0LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHRvIGJlIGNvdW50ZWQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBhcnJheSB3aXRoIGFsbCB3b3Jkcy5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdGV4dCApIHtcblx0dGV4dCA9IHN0cmlwU3BhY2VzKCBzdHJpcFRhZ3MoIHRleHQgKSApO1xuXHRpZiAoIHRleHQgPT09IFwiXCIgKSB7XG5cdFx0cmV0dXJuIFtdO1xuXHR9XG5cblx0dmFyIHdvcmRzID0gdGV4dC5zcGxpdCggL1xccy9nICk7XG5cblx0d29yZHMgPSBtYXAoIHdvcmRzLCBmdW5jdGlvbiggd29yZCApIHtcblx0XHRyZXR1cm4gcmVtb3ZlUHVuY3R1YXRpb24oIHdvcmQgKTtcblx0fSApO1xuXG5cdHJldHVybiBmaWx0ZXIoIHdvcmRzLCBmdW5jdGlvbiggd29yZCApIHtcblx0XHRyZXR1cm4gd29yZC50cmltKCkgIT09IFwiXCI7XG5cdH0gKTtcbn07XG5cbiIsIi8qKlxuICogTm9ybWFsaXplcyBzaW5nbGUgcXVvdGVzIHRvICdyZWd1bGFyJyBxdW90ZXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGV4dCB0byBub3JtYWxpemUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgbm9ybWFsaXplZCB0ZXh0LlxuICovXG5mdW5jdGlvbiBub3JtYWxpemVTaW5nbGVRdW90ZXMoIHRleHQgKSB7XG5cdHJldHVybiB0ZXh0LnJlcGxhY2UoIC9b4oCY4oCZ4oCbYF0vZywgXCInXCIgKTtcbn1cblxuLyoqXG4gKiBOb3JtYWxpemVzIGRvdWJsZSBxdW90ZXMgdG8gJ3JlZ3VsYXInIHF1b3Rlcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUZXh0IHRvIG5vcm1hbGl6ZS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBub3JtYWxpemVkIHRleHQuXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZURvdWJsZVF1b3RlcyggdGV4dCApIHtcblx0cmV0dXJuIHRleHQucmVwbGFjZSggL1vigJzigJ3jgJ3jgJ7jgJ/igJ/igJ5dL2csIFwiXFxcIlwiICk7XG59XG5cbi8qKlxuICogTm9ybWFsaXplcyBxdW90ZXMgdG8gJ3JlZ3VsYXInIHF1b3Rlcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUZXh0IHRvIG5vcm1hbGl6ZS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBub3JtYWxpemVkIHRleHQuXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZVF1b3RlcyggdGV4dCApIHtcblx0cmV0dXJuIG5vcm1hbGl6ZURvdWJsZVF1b3Rlcyggbm9ybWFsaXplU2luZ2xlUXVvdGVzKCB0ZXh0ICkgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdG5vcm1hbGl6ZVNpbmdsZTogbm9ybWFsaXplU2luZ2xlUXVvdGVzLFxuXHRub3JtYWxpemVEb3VibGU6IG5vcm1hbGl6ZURvdWJsZVF1b3Rlcyxcblx0bm9ybWFsaXplOiBub3JtYWxpemVRdW90ZXMsXG59O1xuIiwidmFyIGdldFdvcmRzID0gcmVxdWlyZSggXCIuLi9zdHJpbmdQcm9jZXNzaW5nL2dldFdvcmRzXCIgKTtcbnZhciBnZXRTZW50ZW5jZXMgPSByZXF1aXJlKCBcIi4uL3N0cmluZ1Byb2Nlc3NpbmcvZ2V0U2VudGVuY2VzXCIgKTtcbnZhciBXb3JkQ29tYmluYXRpb24gPSByZXF1aXJlKCBcIi4uL3ZhbHVlcy9Xb3JkQ29tYmluYXRpb25cIiApO1xudmFyIG5vcm1hbGl6ZVNpbmdsZVF1b3RlcyA9IHJlcXVpcmUoIFwiLi4vc3RyaW5nUHJvY2Vzc2luZy9xdW90ZXMuanNcIiApLm5vcm1hbGl6ZVNpbmdsZTtcbnZhciBmdW5jdGlvbldvcmRzID0gcmVxdWlyZSggXCIuLi9yZXNlYXJjaGVzL2VuZ2xpc2gvZnVuY3Rpb25Xb3Jkcy5qc1wiICk7XG52YXIgY291bnRTeWxsYWJsZXMgPSByZXF1aXJlKCBcIi4uL3N0cmluZ1Byb2Nlc3Npbmcvc3lsbGFibGVzL2NvdW50LmpzXCIgKTtcblxudmFyIGZpbHRlciA9IHJlcXVpcmUoIFwibG9kYXNoL2ZpbHRlclwiICk7XG52YXIgbWFwID0gcmVxdWlyZSggXCJsb2Rhc2gvbWFwXCIgKTtcbnZhciBmb3JFYWNoID0gcmVxdWlyZSggXCJsb2Rhc2gvZm9yRWFjaFwiICk7XG52YXIgaGFzID0gcmVxdWlyZSggXCJsb2Rhc2gvaGFzXCIgKTtcbnZhciBmbGF0TWFwID0gcmVxdWlyZSggXCJsb2Rhc2gvZmxhdE1hcFwiICk7XG52YXIgdmFsdWVzID0gcmVxdWlyZSggXCJsb2Rhc2gvdmFsdWVzXCIgKTtcbnZhciB0YWtlID0gcmVxdWlyZSggXCJsb2Rhc2gvdGFrZVwiICk7XG52YXIgaW5jbHVkZXMgPSByZXF1aXJlKCBcImxvZGFzaC9pbmNsdWRlc1wiICk7XG52YXIgaW50ZXJzZWN0aW9uID0gcmVxdWlyZSggXCJsb2Rhc2gvaW50ZXJzZWN0aW9uXCIgKTtcbnZhciBpc0VtcHR5ID0gcmVxdWlyZSggXCJsb2Rhc2gvaXNFbXB0eVwiICk7XG5cbnZhciBkZW5zaXR5TG93ZXJMaW1pdCA9IDA7XG52YXIgZGVuc2l0eVVwcGVyTGltaXQgPSAwLjAzO1xudmFyIHJlbGV2YW50V29yZExpbWl0ID0gMTAwO1xudmFyIHdvcmRDb3VudExvd2VyTGltaXQgPSAyMDA7XG5cbi8vIEVuIGRhc2gsIGVtIGRhc2ggYW5kIGh5cGhlbi1taW51cy5cbnZhciBzcGVjaWFsQ2hhcmFjdGVycyA9IFsgXCLigJNcIiwgXCLigJRcIiwgXCItXCIgXTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSB3b3JkIGNvbWJpbmF0aW9ucyBmb3IgdGhlIGdpdmVuIHRleHQgYmFzZWQgb24gdGhlIGNvbWJpbmF0aW9uIHNpemUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gcmV0cmlldmUgY29tYmluYXRpb25zIGZvci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBjb21iaW5hdGlvblNpemUgVGhlIHNpemUgb2YgdGhlIGNvbWJpbmF0aW9ucyB0byByZXRyaWV2ZS5cbiAqIEByZXR1cm5zIHtXb3JkQ29tYmluYXRpb25bXX0gQWxsIHdvcmQgY29tYmluYXRpb25zIGZvciB0aGUgZ2l2ZW4gdGV4dC5cbiAqL1xuZnVuY3Rpb24gZ2V0V29yZENvbWJpbmF0aW9ucyggdGV4dCwgY29tYmluYXRpb25TaXplICkge1xuXHR2YXIgc2VudGVuY2VzID0gZ2V0U2VudGVuY2VzKCB0ZXh0ICk7XG5cblx0dmFyIHdvcmRzLCBjb21iaW5hdGlvbjtcblxuXHRyZXR1cm4gZmxhdE1hcCggc2VudGVuY2VzLCBmdW5jdGlvbiggc2VudGVuY2UgKSB7XG5cdFx0c2VudGVuY2UgPSBzZW50ZW5jZS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuXHRcdHNlbnRlbmNlID0gbm9ybWFsaXplU2luZ2xlUXVvdGVzKCBzZW50ZW5jZSApO1xuXHRcdHdvcmRzID0gZ2V0V29yZHMoIHNlbnRlbmNlICk7XG5cblx0XHRyZXR1cm4gZmlsdGVyKCBtYXAoIHdvcmRzLCBmdW5jdGlvbiggd29yZCwgaSApIHtcblx0XHRcdC8vIElmIHRoZXJlIGFyZSBzdGlsbCBlbm91Z2ggd29yZHMgaW4gdGhlIHNlbnRlbmNlIHRvIHNsaWNlIG9mLlxuXHRcdFx0aWYgKCBpICsgY29tYmluYXRpb25TaXplIC0gMSA8IHdvcmRzLmxlbmd0aCApIHtcblx0XHRcdFx0Y29tYmluYXRpb24gPSB3b3Jkcy5zbGljZSggaSwgaSArIGNvbWJpbmF0aW9uU2l6ZSApO1xuXHRcdFx0XHRyZXR1cm4gbmV3IFdvcmRDb21iaW5hdGlvbiggY29tYmluYXRpb24gKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0gKSApO1xuXHR9ICk7XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlcyBvY2N1cnJlbmNlcyBmb3IgYSBsaXN0IG9mIHdvcmQgY29tYmluYXRpb25zLlxuICpcbiAqIEBwYXJhbSB7V29yZENvbWJpbmF0aW9uW119IHdvcmRDb21iaW5hdGlvbnMgVGhlIHdvcmQgY29tYmluYXRpb25zIHRvIGNhbGN1bGF0ZSBvY2N1cnJlbmNlcyBmb3IuXG4gKiBAcmV0dXJucyB7V29yZENvbWJpbmF0aW9uW119IFdvcmQgY29tYmluYXRpb25zIHdpdGggdGhlaXIgcmVzcGVjdGl2ZSBvY2N1cnJlbmNlcy5cbiAqL1xuZnVuY3Rpb24gY2FsY3VsYXRlT2NjdXJyZW5jZXMoIHdvcmRDb21iaW5hdGlvbnMgKSB7XG5cdHZhciBvY2N1cnJlbmNlcyA9IHt9O1xuXG5cdGZvckVhY2goIHdvcmRDb21iaW5hdGlvbnMsIGZ1bmN0aW9uKCB3b3JkQ29tYmluYXRpb24gKSB7XG5cdFx0dmFyIGNvbWJpbmF0aW9uID0gd29yZENvbWJpbmF0aW9uLmdldENvbWJpbmF0aW9uKCk7XG5cblx0XHRpZiAoICEgaGFzKCBvY2N1cnJlbmNlcywgY29tYmluYXRpb24gKSApIHtcblx0XHRcdG9jY3VycmVuY2VzWyBjb21iaW5hdGlvbiBdID0gd29yZENvbWJpbmF0aW9uO1xuXHRcdH1cblxuXHRcdG9jY3VycmVuY2VzWyBjb21iaW5hdGlvbiBdLmluY3JlbWVudE9jY3VycmVuY2VzKCk7XG5cdH0gKTtcblxuXHRyZXR1cm4gdmFsdWVzKCBvY2N1cnJlbmNlcyApO1xufVxuXG4vKipcbiAqIFJldHVybnMgb25seSB0aGUgcmVsZXZhbnQgY29tYmluYXRpb25zIGZyb20gYSBsaXN0IG9mIHdvcmQgY29tYmluYXRpb25zLiBBc3N1bWVzXG4gKiBvY2N1cnJlbmNlcyBoYXZlIGFscmVhZHkgYmVlbiBjYWxjdWxhdGVkLlxuICpcbiAqIEBwYXJhbSB7V29yZENvbWJpbmF0aW9uW119IHdvcmRDb21iaW5hdGlvbnMgQSBsaXN0IG9mIHdvcmQgY29tYmluYXRpb25zLlxuICogQHJldHVybnMge1dvcmRDb21iaW5hdGlvbltdfSBPbmx5IHJlbGV2YW50IHdvcmQgY29tYmluYXRpb25zLlxuICovXG5mdW5jdGlvbiBnZXRSZWxldmFudENvbWJpbmF0aW9ucyggd29yZENvbWJpbmF0aW9ucyApIHtcblx0d29yZENvbWJpbmF0aW9ucyA9IHdvcmRDb21iaW5hdGlvbnMuZmlsdGVyKCBmdW5jdGlvbiggY29tYmluYXRpb24gKSB7XG5cdFx0cmV0dXJuIGNvbWJpbmF0aW9uLmdldE9jY3VycmVuY2VzKCkgIT09IDEgJiZcblx0XHRcdGNvbWJpbmF0aW9uLmdldFJlbGV2YW5jZSgpICE9PSAwO1xuXHR9ICk7XG5cdHJldHVybiB3b3JkQ29tYmluYXRpb25zO1xufVxuXG4vKipcbiAqIFNvcnRzIGNvbWJpbmF0aW9ucyBiYXNlZCBvbiB0aGVpciByZWxldmFuY2UgYW5kIGxlbmd0aC5cbiAqXG4gKiBAcGFyYW0ge1dvcmRDb21iaW5hdGlvbltdfSB3b3JkQ29tYmluYXRpb25zIFRoZSBjb21iaW5hdGlvbnMgdG8gc29ydC5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5mdW5jdGlvbiBzb3J0Q29tYmluYXRpb25zKCB3b3JkQ29tYmluYXRpb25zICkge1xuXHR3b3JkQ29tYmluYXRpb25zLnNvcnQoIGZ1bmN0aW9uKCBjb21iaW5hdGlvbkEsIGNvbWJpbmF0aW9uQiApIHtcblx0XHR2YXIgZGlmZmVyZW5jZSA9IGNvbWJpbmF0aW9uQi5nZXRSZWxldmFuY2UoKSAtIGNvbWJpbmF0aW9uQS5nZXRSZWxldmFuY2UoKTtcblx0XHQvLyBUaGUgY29tYmluYXRpb24gd2l0aCB0aGUgaGlnaGVzdCByZWxldmFuY2UgY29tZXMgZmlyc3QuXG5cdFx0aWYgKCBkaWZmZXJlbmNlICE9PSAwICkge1xuXHRcdFx0cmV0dXJuIGRpZmZlcmVuY2U7XG5cdFx0fVxuXHRcdC8vIEluIGNhc2Ugb2YgYSB0aWUgb24gcmVsZXZhbmNlLCB0aGUgbG9uZ2VzdCBjb21iaW5hdGlvbiBjb21lcyBmaXJzdC5cblx0XHRyZXR1cm4gY29tYmluYXRpb25CLmdldExlbmd0aCgpIC0gY29tYmluYXRpb25BLmdldExlbmd0aCgpO1xuXHR9ICk7XG59XG5cbi8qKlxuICogRmlsdGVycyB3b3JkIGNvbWJpbmF0aW9ucyBiZWdpbm5pbmcgd2l0aCBjZXJ0YWluIGZ1bmN0aW9uIHdvcmRzLlxuICpcbiAqIEBwYXJhbSB7V29yZENvbWJpbmF0aW9uW119IHdvcmRDb21iaW5hdGlvbnMgVGhlIHdvcmQgY29tYmluYXRpb25zIHRvIGZpbHRlci5cbiAqIEBwYXJhbSB7YXJyYXl9IGZ1bmN0aW9uV29yZHMgVGhlIGxpc3Qgb2YgZnVuY3Rpb24gd29yZHMuXG4gKiBAcmV0dXJucyB7V29yZENvbWJpbmF0aW9uW119IEZpbHRlcmVkIHdvcmQgY29tYmluYXRpb25zLlxuICovXG5mdW5jdGlvbiBmaWx0ZXJGdW5jdGlvbldvcmRzQXRCZWdpbm5pbmcoIHdvcmRDb21iaW5hdGlvbnMsIGZ1bmN0aW9uV29yZHMgKSB7XG5cdHJldHVybiB3b3JkQ29tYmluYXRpb25zLmZpbHRlciggZnVuY3Rpb24oIGNvbWJpbmF0aW9uICkge1xuXHRcdHJldHVybiAhIGluY2x1ZGVzKCBmdW5jdGlvbldvcmRzLCBjb21iaW5hdGlvbi5nZXRXb3JkcygpWyAwIF0gKTtcblx0fSApO1xufVxuXG4vKipcbiAqIEZpbHRlcnMgd29yZCBjb21iaW5hdGlvbnMgZW5kaW5nIHdpdGggY2VydGFpbiBmdW5jdGlvbiB3b3Jkcy5cbiAqXG4gKiBAcGFyYW0ge1dvcmRDb21iaW5hdGlvbltdfSB3b3JkQ29tYmluYXRpb25zIFRoZSB3b3JkIGNvbWJpbmF0aW9ucyB0byBmaWx0ZXIuXG4gKiBAcGFyYW0ge2FycmF5fSBmdW5jdGlvbldvcmRzIFRoZSBsaXN0IG9mIGZ1bmN0aW9uIHdvcmRzLlxuICogQHJldHVybnMge1dvcmRDb21iaW5hdGlvbltdfSBGaWx0ZXJlZCB3b3JkIGNvbWJpbmF0aW9ucy5cbiAqL1xuZnVuY3Rpb24gZmlsdGVyRnVuY3Rpb25Xb3Jkc0F0RW5kaW5nKCB3b3JkQ29tYmluYXRpb25zLCBmdW5jdGlvbldvcmRzICkge1xuXHRyZXR1cm4gd29yZENvbWJpbmF0aW9ucy5maWx0ZXIoIGZ1bmN0aW9uKCBjb21iaW5hdGlvbiApIHtcblx0XHR2YXIgd29yZHMgPSBjb21iaW5hdGlvbi5nZXRXb3JkcygpO1xuXHRcdHZhciBsYXN0V29yZEluZGV4ID0gd29yZHMubGVuZ3RoIC0gMTtcblx0XHRyZXR1cm4gISBpbmNsdWRlcyggZnVuY3Rpb25Xb3Jkcywgd29yZHNbIGxhc3RXb3JkSW5kZXggXSApO1xuXHR9ICk7XG59XG5cbi8qKlxuICogRmlsdGVycyB3b3JkIGNvbWJpbmF0aW9ucyBiZWdpbm5pbmcgYW5kIGVuZGluZyB3aXRoIGNlcnRhaW4gZnVuY3Rpb24gd29yZHMuXG4gKlxuICogQHBhcmFtIHtXb3JkQ29tYmluYXRpb25bXX0gd29yZENvbWJpbmF0aW9ucyBUaGUgd29yZCBjb21iaW5hdGlvbnMgdG8gZmlsdGVyLlxuICogQHBhcmFtIHthcnJheX0gZnVuY3Rpb25Xb3JkcyBUaGUgbGlzdCBvZiBmdW5jdGlvbiB3b3Jkcy5cbiAqIEByZXR1cm5zIHtXb3JkQ29tYmluYXRpb25bXX0gRmlsdGVyZWQgd29yZCBjb21iaW5hdGlvbnMuXG4gKi9cbmZ1bmN0aW9uIGZpbHRlckZ1bmN0aW9uV29yZHMoIHdvcmRDb21iaW5hdGlvbnMsIGZ1bmN0aW9uV29yZHMgKSB7XG5cdHdvcmRDb21iaW5hdGlvbnMgPSBmaWx0ZXJGdW5jdGlvbldvcmRzQXRCZWdpbm5pbmcoIHdvcmRDb21iaW5hdGlvbnMsIGZ1bmN0aW9uV29yZHMgKTtcblx0d29yZENvbWJpbmF0aW9ucyA9IGZpbHRlckZ1bmN0aW9uV29yZHNBdEVuZGluZyggd29yZENvbWJpbmF0aW9ucywgZnVuY3Rpb25Xb3JkcyApO1xuXHRyZXR1cm4gd29yZENvbWJpbmF0aW9ucztcbn1cblxuLyoqXG4gKiBGaWx0ZXJzIHdvcmQgY29tYmluYXRpb25zIGNvbnRhaW5pbmcgYSBzcGVjaWFsIGNoYXJhY3Rlci5cbiAqXG4gKiBAcGFyYW0ge1dvcmRDb21iaW5hdGlvbltdfSB3b3JkQ29tYmluYXRpb25zIFRoZSB3b3JkIGNvbWJpbmF0aW9ucyB0byBmaWx0ZXIuXG4gKiBAcGFyYW0ge2FycmF5fSBzcGVjaWFsQ2hhcmFjdGVycyBUaGUgbGlzdCBvZiBzcGVjaWFsIGNoYXJhY3RlcnMuXG4gKiBAcmV0dXJucyB7V29yZENvbWJpbmF0aW9uW119IEZpbHRlcmVkIHdvcmQgY29tYmluYXRpb25zLlxuICovXG5mdW5jdGlvbiBmaWx0ZXJTcGVjaWFsQ2hhcmFjdGVycyggd29yZENvbWJpbmF0aW9ucywgc3BlY2lhbENoYXJhY3RlcnMgKSB7XG5cdHJldHVybiB3b3JkQ29tYmluYXRpb25zLmZpbHRlciggZnVuY3Rpb24oIGNvbWJpbmF0aW9uICkge1xuXHRcdHJldHVybiBpc0VtcHR5KFxuXHRcdFx0aW50ZXJzZWN0aW9uKCBzcGVjaWFsQ2hhcmFjdGVycywgY29tYmluYXRpb24uZ2V0V29yZHMoKSApXG5cdFx0KTtcblx0fSApO1xufVxuLyoqXG4gKiBGaWx0ZXJzIHdvcmQgY29tYmluYXRpb25zIHdpdGggYSBsZW5ndGggb2Ygb25lIGFuZCBhIGdpdmVuIHN5bGxhYmxlIGNvdW50LlxuICpcbiAqIEBwYXJhbSB7V29yZENvbWJpbmF0aW9uW119IHdvcmRDb21iaW5hdGlvbnMgVGhlIHdvcmQgY29tYmluYXRpb25zIHRvIGZpbHRlci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBzeWxsYWJsZUNvdW50IFRoZSBudW1iZXIgb2Ygc3lsbGFibGVzIHRvIHVzZSBmb3IgZmlsdGVyaW5nLlxuICogQHJldHVybnMge1dvcmRDb21iaW5hdGlvbltdfSBGaWx0ZXJlZCB3b3JkIGNvbWJpbmF0aW9ucy5cbiAqL1xuIGZ1bmN0aW9uIGZpbHRlck9uU3lsbGFibGVDb3VudCggd29yZENvbWJpbmF0aW9ucywgc3lsbGFibGVDb3VudCApIHtcblx0cmV0dXJuIHdvcmRDb21iaW5hdGlvbnMuZmlsdGVyKCBmdW5jdGlvbiggY29tYmluYXRpb24gKSAge1xuXHRcdHJldHVybiAhICggY29tYmluYXRpb24uZ2V0TGVuZ3RoKCkgPT09IDEgJiYgY291bnRTeWxsYWJsZXMoIGNvbWJpbmF0aW9uLmdldFdvcmRzKClbIDAgXSwgXCJlbl9VU1wiICkgPD0gc3lsbGFibGVDb3VudCApO1xuXHR9ICk7XG4gfVxuXG4vKipcbiAqIEZpbHRlcnMgd29yZCBjb21iaW5hdGlvbnMgYmFzZWQgb24ga2V5d29yZCBkZW5zaXR5IGlmIHRoZSB3b3JkIGNvdW50IGlzIDIwMCBvciBvdmVyLlxuICpcbiAqIEBwYXJhbSB7V29yZENvbWJpbmF0aW9uW119IHdvcmRDb21iaW5hdGlvbnMgVGhlIHdvcmQgY29tYmluYXRpb25zIHRvIGZpbHRlci5cbiAqIEBwYXJhbSB7bnVtYmVyfSB3b3JkQ291bnQgVGhlIG51bWJlciBvZiB3b3JkcyBpbiB0aGUgdG90YWwgdGV4dC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBkZW5zaXR5TG93ZXJMaW1pdCBUaGUgbG93ZXIgbGltaXQgb2Yga2V5d29yZCBkZW5zaXR5LlxuICogQHBhcmFtIHtudW1iZXJ9IGRlbnNpdHlVcHBlckxpbWl0IFRoZSB1cHBlciBsaW1pdCBvZiBrZXl3b3JkIGRlbnNpdHkuXG4gKiBAcmV0dXJucyB7V29yZENvbWJpbmF0aW9uW119IEZpbHRlcmVkIHdvcmQgY29tYmluYXRpb25zLlxuICovXG5mdW5jdGlvbiBmaWx0ZXJPbkRlbnNpdHkoIHdvcmRDb21iaW5hdGlvbnMsIHdvcmRDb3VudCwgZGVuc2l0eUxvd2VyTGltaXQsIGRlbnNpdHlVcHBlckxpbWl0ICkge1xuXHRyZXR1cm4gd29yZENvbWJpbmF0aW9ucy5maWx0ZXIoIGZ1bmN0aW9uKCBjb21iaW5hdGlvbiApIHtcblx0XHRyZXR1cm4gKCBjb21iaW5hdGlvbi5nZXREZW5zaXR5KCB3b3JkQ291bnQgKSA+PSBkZW5zaXR5TG93ZXJMaW1pdCAmJiBjb21iaW5hdGlvbi5nZXREZW5zaXR5KCB3b3JkQ291bnQgKSA8IGRlbnNpdHlVcHBlckxpbWl0XG5cdFx0KTtcblx0fSApO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIHJlbGV2YW50IHdvcmRzIGluIGEgZ2l2ZW4gdGV4dC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byByZXRyaWV2ZSB0aGUgcmVsZXZhbnQgd29yZHMgb2YuXG4gKiBAcmV0dXJucyB7V29yZENvbWJpbmF0aW9uW119IEFsbCByZWxldmFudCB3b3JkcyBzb3J0ZWQgYW5kIGZpbHRlcmVkIGZvciB0aGlzIHRleHQuXG4gKi9cbmZ1bmN0aW9uIGdldFJlbGV2YW50V29yZHMoIHRleHQgKSB7XG5cdHZhciB3b3JkcyA9IGdldFdvcmRDb21iaW5hdGlvbnMoIHRleHQsIDEgKTtcblx0dmFyIHdvcmRDb3VudCA9IHdvcmRzLmxlbmd0aDtcblxuXHR2YXIgb25lV29yZENvbWJpbmF0aW9ucyA9IGdldFJlbGV2YW50Q29tYmluYXRpb25zKFxuXHRcdGNhbGN1bGF0ZU9jY3VycmVuY2VzKCB3b3JkcyApXG5cdCk7XG5cblx0c29ydENvbWJpbmF0aW9ucyggb25lV29yZENvbWJpbmF0aW9ucyApO1xuXHRvbmVXb3JkQ29tYmluYXRpb25zID0gdGFrZSggb25lV29yZENvbWJpbmF0aW9ucywgMTAwICk7XG5cblx0dmFyIG9uZVdvcmRSZWxldmFuY2VNYXAgPSB7fTtcblxuXHRmb3JFYWNoKCBvbmVXb3JkQ29tYmluYXRpb25zLCBmdW5jdGlvbiggY29tYmluYXRpb24gKSB7XG5cdFx0b25lV29yZFJlbGV2YW5jZU1hcFsgY29tYmluYXRpb24uZ2V0Q29tYmluYXRpb24oKSBdID0gY29tYmluYXRpb24uZ2V0UmVsZXZhbmNlKCk7XG5cdH0gKTtcblxuXHR2YXIgdHdvV29yZENvbWJpbmF0aW9ucyA9IGNhbGN1bGF0ZU9jY3VycmVuY2VzKCBnZXRXb3JkQ29tYmluYXRpb25zKCB0ZXh0LCAyICkgKTtcblx0dmFyIHRocmVlV29yZENvbWJpbmF0aW9ucyA9IGNhbGN1bGF0ZU9jY3VycmVuY2VzKCBnZXRXb3JkQ29tYmluYXRpb25zKCB0ZXh0LCAzICkgKTtcblx0dmFyIGZvdXJXb3JkQ29tYmluYXRpb25zID0gY2FsY3VsYXRlT2NjdXJyZW5jZXMoIGdldFdvcmRDb21iaW5hdGlvbnMoIHRleHQsIDQgKSApO1xuXHR2YXIgZml2ZVdvcmRDb21iaW5hdGlvbnMgPSBjYWxjdWxhdGVPY2N1cnJlbmNlcyggZ2V0V29yZENvbWJpbmF0aW9ucyggdGV4dCwgNSApICk7XG5cblx0dmFyIGNvbWJpbmF0aW9ucyA9IG9uZVdvcmRDb21iaW5hdGlvbnMuY29uY2F0KFxuXHRcdHR3b1dvcmRDb21iaW5hdGlvbnMsXG5cdFx0dGhyZWVXb3JkQ29tYmluYXRpb25zLFxuXHRcdGZvdXJXb3JkQ29tYmluYXRpb25zLFxuXHRcdGZpdmVXb3JkQ29tYmluYXRpb25zXG5cdCk7XG5cblx0Y29tYmluYXRpb25zID0gZmlsdGVyRnVuY3Rpb25Xb3JkcyggY29tYmluYXRpb25zLCBzcGVjaWFsQ2hhcmFjdGVycyApO1xuXHRjb21iaW5hdGlvbnMgPSBmaWx0ZXJGdW5jdGlvbldvcmRzKCBjb21iaW5hdGlvbnMsIGZ1bmN0aW9uV29yZHMoKS5hcnRpY2xlcyApO1xuXHRjb21iaW5hdGlvbnMgPSBmaWx0ZXJGdW5jdGlvbldvcmRzKCBjb21iaW5hdGlvbnMsIGZ1bmN0aW9uV29yZHMoKS5wZXJzb25hbFByb25vdW5zICk7XG5cdGNvbWJpbmF0aW9ucyA9IGZpbHRlckZ1bmN0aW9uV29yZHMoIGNvbWJpbmF0aW9ucywgZnVuY3Rpb25Xb3JkcygpLnByZXBvc2l0aW9ucyApO1xuXHRjb21iaW5hdGlvbnMgPSBmaWx0ZXJGdW5jdGlvbldvcmRzKCBjb21iaW5hdGlvbnMsIGZ1bmN0aW9uV29yZHMoKS5jb25qdW5jdGlvbnMgKTtcblx0Y29tYmluYXRpb25zID0gZmlsdGVyRnVuY3Rpb25Xb3JkcyggY29tYmluYXRpb25zLCBmdW5jdGlvbldvcmRzKCkucXVhbnRpZmllcnMgKTtcblx0Y29tYmluYXRpb25zID0gZmlsdGVyRnVuY3Rpb25Xb3JkcyggY29tYmluYXRpb25zLCBmdW5jdGlvbldvcmRzKCkuZGVtb25zdHJhdGl2ZVByb25vdW5zICk7XG5cdGNvbWJpbmF0aW9ucyA9IGZpbHRlckZ1bmN0aW9uV29yZHNBdEJlZ2lubmluZyggY29tYmluYXRpb25zLCBmdW5jdGlvbldvcmRzKCkuZmlsdGVyZWRQYXNzaXZlQXV4aWxpYXJpZXMgKTtcblx0Y29tYmluYXRpb25zID0gZmlsdGVyRnVuY3Rpb25Xb3Jkc0F0RW5kaW5nKCBjb21iaW5hdGlvbnMsIGZ1bmN0aW9uV29yZHMoKS52ZXJicyApO1xuXHRjb21iaW5hdGlvbnMgPSBmaWx0ZXJGdW5jdGlvbldvcmRzQXRFbmRpbmcoIGNvbWJpbmF0aW9ucywgZnVuY3Rpb25Xb3JkcygpLnJlbGF0aXZlUHJvbm91bnMgKTtcblx0Y29tYmluYXRpb25zID0gZmlsdGVyT25TeWxsYWJsZUNvdW50KCBjb21iaW5hdGlvbnMsIDEgKTtcblxuXG5cdGZvckVhY2goIGNvbWJpbmF0aW9ucywgZnVuY3Rpb24oIGNvbWJpbmF0aW9uICkge1xuXHRcdGNvbWJpbmF0aW9uLnNldFJlbGV2YW50V29yZHMoIG9uZVdvcmRSZWxldmFuY2VNYXAgKTtcblx0fSApO1xuXG5cdGNvbWJpbmF0aW9ucyA9IGdldFJlbGV2YW50Q29tYmluYXRpb25zKCBjb21iaW5hdGlvbnMsIHdvcmRDb3VudCApO1xuXHRzb3J0Q29tYmluYXRpb25zKCBjb21iaW5hdGlvbnMgKTtcblxuXHRpZiAoIHdvcmRDb3VudCA+PSB3b3JkQ291bnRMb3dlckxpbWl0ICkge1xuXHRcdGNvbWJpbmF0aW9ucyA9IGZpbHRlck9uRGVuc2l0eSggY29tYmluYXRpb25zLCB3b3JkQ291bnQsIGRlbnNpdHlMb3dlckxpbWl0LCBkZW5zaXR5VXBwZXJMaW1pdCApO1xuXHR9XG5cblx0cmV0dXJuIHRha2UoIGNvbWJpbmF0aW9ucywgcmVsZXZhbnRXb3JkTGltaXQgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGdldFdvcmRDb21iaW5hdGlvbnM6IGdldFdvcmRDb21iaW5hdGlvbnMsXG5cdGdldFJlbGV2YW50V29yZHM6IGdldFJlbGV2YW50V29yZHMsXG5cdGNhbGN1bGF0ZU9jY3VycmVuY2VzOiBjYWxjdWxhdGVPY2N1cnJlbmNlcyxcblx0Z2V0UmVsZXZhbnRDb21iaW5hdGlvbnM6IGdldFJlbGV2YW50Q29tYmluYXRpb25zLFxuXHRzb3J0Q29tYmluYXRpb25zOiBzb3J0Q29tYmluYXRpb25zLFxuXHRmaWx0ZXJGdW5jdGlvbldvcmRzQXRCZWdpbm5pbmc6IGZpbHRlckZ1bmN0aW9uV29yZHNBdEJlZ2lubmluZyxcblx0ZmlsdGVyRnVuY3Rpb25Xb3JkczogZmlsdGVyRnVuY3Rpb25Xb3Jkcyxcblx0ZmlsdGVyU3BlY2lhbENoYXJhY3RlcnM6IGZpbHRlclNwZWNpYWxDaGFyYWN0ZXJzLFxuXHRmaWx0ZXJPblN5bGxhYmxlQ291bnQ6IGZpbHRlck9uU3lsbGFibGVDb3VudCxcblx0ZmlsdGVyT25EZW5zaXR5OiBmaWx0ZXJPbkRlbnNpdHksXG59O1xuIiwiLy8gUmVwbGFjZSBhbGwgb3RoZXIgcHVuY3R1YXRpb24gY2hhcmFjdGVycyBhdCB0aGUgYmVnaW5uaW5nIG9yIGF0IHRoZSBlbmQgb2YgYSB3b3JkLlxudmFyIHB1bmN0dWF0aW9uUmVnZXhTdHJpbmcgPSBcIltcXFxc4oCTXFxcXC1cXFxcKFxcXFwpX1xcXFxbXFxcXF3igJnigJzigJ1cXFwiJy4/ITo7LMK/wqHCq8K7XFx1MjAxNFxcdTAwZDdcXHUwMDJiXFx1MDAyNl0rXCI7XG52YXIgcHVuY3R1YXRpb25SZWdleFN0YXJ0ID0gbmV3IFJlZ0V4cCggXCJeXCIgKyBwdW5jdHVhdGlvblJlZ2V4U3RyaW5nICk7XG52YXIgcHVuY3R1YXRpb25SZWdleEVuZCA9IG5ldyBSZWdFeHAoIHB1bmN0dWF0aW9uUmVnZXhTdHJpbmcgKyBcIiRcIiApO1xuXG4vKipcbiAqIFJlcGxhY2VzIHB1bmN0dWF0aW9uIGNoYXJhY3RlcnMgZnJvbSB0aGUgZ2l2ZW4gdGV4dCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gcmVtb3ZlIHRoZSBwdW5jdHVhdGlvbiBjaGFyYWN0ZXJzIGZvci5cbiAqXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgc2FuaXRpemVkIHRleHQuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHRleHQgKSB7XG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoIHB1bmN0dWF0aW9uUmVnZXhTdGFydCwgXCJcIiApO1xuXHR0ZXh0ID0gdGV4dC5yZXBsYWNlKCBwdW5jdHVhdGlvblJlZ2V4RW5kLCBcIlwiICk7XG5cblx0cmV0dXJuIHRleHQ7XG59O1xuIiwiLyoqIEBtb2R1bGUgc3RyaW5nUHJvY2Vzc2luZy9zdHJpcEhUTUxUYWdzICovXG5cbnZhciBzdHJpcFNwYWNlcyA9IHJlcXVpcmUoIFwiLi4vc3RyaW5nUHJvY2Vzc2luZy9zdHJpcFNwYWNlcy5qc1wiICk7XG5cbnZhciBibG9ja0VsZW1lbnRzID0gcmVxdWlyZSggXCIuLi9oZWxwZXJzL2h0bWwuanNcIiApLmJsb2NrRWxlbWVudHM7XG5cbnZhciBibG9ja0VsZW1lbnRTdGFydFJlZ2V4ID0gbmV3IFJlZ0V4cCggXCJePChcIiArIGJsb2NrRWxlbWVudHMuam9pbiggXCJ8XCIgKSArIFwiKVtePl0qPz5cIiwgXCJpXCIgKTtcbnZhciBibG9ja0VsZW1lbnRFbmRSZWdleCA9IG5ldyBSZWdFeHAoIFwiPC8oXCIgKyBibG9ja0VsZW1lbnRzLmpvaW4oIFwifFwiICkgKyBcIilbXj5dKj8+JFwiLCBcImlcIiApO1xuXG4vKipcbiAqIFN0cmlwIGluY29tcGxldGUgdGFncyB3aXRoaW4gYSB0ZXh0LiBTdHJpcHMgYW4gZW5kdGFnIGF0IHRoZSBiZWdpbm5pbmcgb2YgYSBzdHJpbmcgYW5kIHRoZSBzdGFydCB0YWcgYXQgdGhlIGVuZCBvZiBhXG4gKiBzdGFydCBvZiBhIHN0cmluZy5cbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHRvIHN0cmlwIHRoZSBIVE1MLXRhZ3MgZnJvbSBhdCB0aGUgYmVnaW4gYW5kIGVuZC5cbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSB0ZXh0IHdpdGhvdXQgSFRNTC10YWdzIGF0IHRoZSBiZWdpbiBhbmQgZW5kLlxuICovXG52YXIgc3RyaXBJbmNvbXBsZXRlVGFncyA9IGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHR0ZXh0ID0gdGV4dC5yZXBsYWNlKCAvXig8XFwvKFtePl0rKT4pKy9pLCBcIlwiICk7XG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoIC8oPChbXlxcLz5dKyk+KSskL2ksIFwiXCIgKTtcblx0cmV0dXJuIHRleHQ7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgdGhlIGJsb2NrIGVsZW1lbnQgdGFncyBhdCB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgYSBzdHJpbmcgYW5kIHJldHVybnMgdGhpcyBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGhlIHVuZm9ybWF0dGVkIHN0cmluZy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSB0ZXh0IHdpdGggcmVtb3ZlZCBIVE1MIGJlZ2luIGFuZCBlbmQgYmxvY2sgZWxlbWVudHNcbiAqL1xudmFyIHN0cmlwQmxvY2tUYWdzQXRTdGFydEVuZCA9IGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHR0ZXh0ID0gdGV4dC5yZXBsYWNlKCBibG9ja0VsZW1lbnRTdGFydFJlZ2V4LCBcIlwiICk7XG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoIGJsb2NrRWxlbWVudEVuZFJlZ2V4LCBcIlwiICk7XG5cdHJldHVybiB0ZXh0O1xufTtcblxuLyoqXG4gKiBTdHJpcCBIVE1MLXRhZ3MgZnJvbSB0ZXh0XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gc3RyaXAgdGhlIEhUTUwtdGFncyBmcm9tLlxuICogQHJldHVybnMge1N0cmluZ30gVGhlIHRleHQgd2l0aG91dCBIVE1MLXRhZ3MuXG4gKi9cbnZhciBzdHJpcEZ1bGxUYWdzID0gZnVuY3Rpb24oIHRleHQgKSB7XG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoIC8oPChbXj5dKyk+KS9pZywgXCIgXCIgKTtcblx0dGV4dCA9IHN0cmlwU3BhY2VzKCB0ZXh0ICk7XG5cdHJldHVybiB0ZXh0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHN0cmlwRnVsbFRhZ3M6IHN0cmlwRnVsbFRhZ3MsXG5cdHN0cmlwSW5jb21wbGV0ZVRhZ3M6IHN0cmlwSW5jb21wbGV0ZVRhZ3MsXG5cdHN0cmlwQmxvY2tUYWdzQXRTdGFydEVuZDogc3RyaXBCbG9ja1RhZ3NBdFN0YXJ0RW5kLFxufTtcbiIsIi8qKiBAbW9kdWxlIHN0cmluZ1Byb2Nlc3Npbmcvc3RyaXBTcGFjZXMgKi9cblxuLyoqXG4gKiBTdHJpcCBkb3VibGUgc3BhY2VzIGZyb20gdGV4dFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHRvIHN0cmlwIHNwYWNlcyBmcm9tLlxuICogQHJldHVybnMge1N0cmluZ30gVGhlIHRleHQgd2l0aG91dCBkb3VibGUgc3BhY2VzXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHRleHQgKSB7XG5cdC8vIFJlcGxhY2UgbXVsdGlwbGUgc3BhY2VzIHdpdGggc2luZ2xlIHNwYWNlXG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoIC9cXHN7Mix9L2csIFwiIFwiICk7XG5cblx0Ly8gUmVwbGFjZSBzcGFjZXMgZm9sbG93ZWQgYnkgcGVyaW9kcyB3aXRoIG9ubHkgdGhlIHBlcmlvZC5cblx0dGV4dCA9IHRleHQucmVwbGFjZSggL1xcc1xcLi9nLCBcIi5cIiApO1xuXG5cdC8vIFJlbW92ZSBmaXJzdC9sYXN0IGNoYXJhY3RlciBpZiBzcGFjZVxuXHR0ZXh0ID0gdGV4dC5yZXBsYWNlKCAvXlxccyt8XFxzKyQvZywgXCJcIiApO1xuXG5cdHJldHVybiB0ZXh0O1xufTtcbiIsInZhciBpc1VuZGVmaW5lZCA9IHJlcXVpcmUoIFwibG9kYXNoL2lzVW5kZWZpbmVkXCIgKTtcbnZhciBwaWNrID0gcmVxdWlyZSggXCJsb2Rhc2gvcGlja1wiICk7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIHBhcnRpYWwgZGV2aWF0aW9uIHdoZW4gY291bnRpbmcgc3lsbGFibGVzXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgRXh0cmEgb3B0aW9ucyBhYm91dCBob3cgdG8gbWF0Y2ggdGhpcyBmcmFnbWVudC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmxvY2F0aW9uIFRoZSBsb2NhdGlvbiBpbiB0aGUgd29yZCB3aGVyZSB0aGlzIGRldmlhdGlvbiBjYW4gb2NjdXIuXG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy53b3JkIFRoZSBhY3R1YWwgc3RyaW5nIHRoYXQgc2hvdWxkIGJlIGNvdW50ZWQgZGlmZmVyZW50bHkuXG4gKiBAcGFyYW0ge251bWJlcn0gb3B0aW9ucy5zeWxsYWJsZXMgVGhlIGFtb3VudCBvZiBzeWxsYWJsZXMgdGhpcyBmcmFnbWVudCBoYXMuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBbb3B0aW9ucy5ub3RGb2xsb3dlZEJ5XSBBIGxpc3Qgb2YgY2hhcmFjdGVycyB0aGF0IHRoaXMgZnJhZ21lbnQgc2hvdWxkbid0IGJlIGZvbGxvd2VkIHdpdGguXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBbb3B0aW9ucy5hbHNvRm9sbG93ZWRCeV0gQSBsaXN0IG9mIGNoYXJhY3RlcnMgdGhhdCB0aGlzIGZyYWdtZW50IGNvdWxkIGJlIGZvbGxvd2VkIHdpdGguXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIERldmlhdGlvbkZyYWdtZW50KCBvcHRpb25zICkge1xuXHR0aGlzLl9sb2NhdGlvbiA9IG9wdGlvbnMubG9jYXRpb247XG5cdHRoaXMuX2ZyYWdtZW50ID0gb3B0aW9ucy53b3JkO1xuXHR0aGlzLl9zeWxsYWJsZXMgPSBvcHRpb25zLnN5bGxhYmxlcztcblx0dGhpcy5fcmVnZXggPSBudWxsO1xuXG5cdHRoaXMuX29wdGlvbnMgPSBwaWNrKCBvcHRpb25zLCBbIFwibm90Rm9sbG93ZWRCeVwiLCBcImFsc29Gb2xsb3dlZEJ5XCIgXSApO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSByZWdleCB0aGF0IG1hdGNoZXMgdGhpcyBmcmFnbWVudCBpbnNpZGUgYSB3b3JkLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5EZXZpYXRpb25GcmFnbWVudC5wcm90b3R5cGUuY3JlYXRlUmVnZXggPSBmdW5jdGlvbigpIHtcblx0dmFyIHJlZ2V4U3RyaW5nID0gXCJcIjtcblx0dmFyIG9wdGlvbnMgPSB0aGlzLl9vcHRpb25zO1xuXG5cdHZhciBmcmFnbWVudCA9IHRoaXMuX2ZyYWdtZW50O1xuXG5cdGlmICggISBpc1VuZGVmaW5lZCggb3B0aW9ucy5ub3RGb2xsb3dlZEJ5ICkgKSB7XG5cdFx0ZnJhZ21lbnQgKz0gXCIoPyFbXCIgKyBvcHRpb25zLm5vdEZvbGxvd2VkQnkuam9pbiggXCJcIiApICsgXCJdKVwiO1xuXHR9XG5cblx0aWYgKCAhIGlzVW5kZWZpbmVkKCBvcHRpb25zLmFsc29Gb2xsb3dlZEJ5ICkgKSB7XG5cdFx0ZnJhZ21lbnQgKz0gXCJbXCIgKyBvcHRpb25zLmFsc29Gb2xsb3dlZEJ5LmpvaW4oIFwiXCIgKSArIFwiXT9cIjtcblx0fVxuXG5cdHN3aXRjaCAoIHRoaXMuX2xvY2F0aW9uICkge1xuXHRcdGNhc2UgXCJhdEJlZ2lubmluZ1wiOlxuXHRcdFx0cmVnZXhTdHJpbmcgPSBcIl5cIiArIGZyYWdtZW50O1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFwiYXRFbmRcIjpcblx0XHRcdHJlZ2V4U3RyaW5nID0gZnJhZ21lbnQgKyBcIiRcIjtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBcImF0QmVnaW5uaW5nT3JFbmRcIjpcblx0XHRcdHJlZ2V4U3RyaW5nID0gXCIoXlwiICsgZnJhZ21lbnQgKyBcIil8KFwiICsgZnJhZ21lbnQgKyBcIiQpXCI7XG5cdFx0XHRicmVhaztcblxuXHRcdGRlZmF1bHQ6XG5cdFx0XHRyZWdleFN0cmluZyA9IGZyYWdtZW50O1xuXHRcdFx0YnJlYWs7XG5cdH1cblxuXHR0aGlzLl9yZWdleCA9IG5ldyBSZWdFeHAoIHJlZ2V4U3RyaW5nICk7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIHJlZ2V4IHRoYXQgbWF0Y2hlcyB0aGlzIGZyYWdtZW50IGluc2lkZSBhIHdvcmQuXG4gKlxuICogQHJldHVybnMge1JlZ0V4cH0gVGhlIHJlZ2V4cCB0aGF0IG1hdGNoZXMgdGhpcyBmcmFnbWVudC5cbiAqL1xuRGV2aWF0aW9uRnJhZ21lbnQucHJvdG90eXBlLmdldFJlZ2V4ID0gZnVuY3Rpb24oKSB7XG5cdGlmICggbnVsbCA9PT0gdGhpcy5fcmVnZXggKSB7XG5cdFx0dGhpcy5jcmVhdGVSZWdleCgpO1xuXHR9XG5cblx0cmV0dXJuIHRoaXMuX3JlZ2V4O1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoaXMgZnJhZ21lbnQgb2NjdXJzIGluIGEgd29yZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gd29yZCBUaGUgd29yZCB0byBtYXRjaCB0aGUgZnJhZ21lbnQgaW4uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhpcyBmcmFnbWVudCBvY2N1cnMgaW4gYSB3b3JkLlxuICovXG5EZXZpYXRpb25GcmFnbWVudC5wcm90b3R5cGUub2NjdXJzSW4gPSBmdW5jdGlvbiggd29yZCApIHtcblx0dmFyIHJlZ2V4ID0gdGhpcy5nZXRSZWdleCgpO1xuXG5cdHJldHVybiByZWdleC50ZXN0KCB3b3JkICk7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgdGhpcyBmcmFnbWVudCBmcm9tIHRoZSBnaXZlbiB3b3JkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB3b3JkIFRoZSB3b3JkIHRvIHJlbW92ZSB0aGlzIGZyYWdtZW50IGZyb20uXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgbW9kaWZpZWQgd29yZC5cbiAqL1xuRGV2aWF0aW9uRnJhZ21lbnQucHJvdG90eXBlLnJlbW92ZUZyb20gPSBmdW5jdGlvbiggd29yZCApIHtcblx0Ly8gUmVwbGFjZSBieSBhIHNwYWNlIHRvIGtlZXAgdGhlIHJlbWFpbmluZyBwYXJ0cyBzZXBhcmF0ZWQuXG5cdHJldHVybiB3b3JkLnJlcGxhY2UoIHRoaXMuX2ZyYWdtZW50LCBcIiBcIiApO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBhbW91bnQgb2Ygc3lsbGFibGVzIGZvciB0aGlzIGZyYWdtZW50LlxuICpcbiAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBhbW91bnQgb2Ygc3lsbGFibGVzIGZvciB0aGlzIGZyYWdtZW50LlxuICovXG5EZXZpYXRpb25GcmFnbWVudC5wcm90b3R5cGUuZ2V0U3lsbGFibGVzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLl9zeWxsYWJsZXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERldmlhdGlvbkZyYWdtZW50O1xuIiwiLyoqIEBtb2R1bGUgc3RyaW5nUHJvY2Vzc2luZy9jb3VudFN5bGxhYmxlcyAqL1xuXG52YXIgc3lsbGFibGVNYXRjaGVycyA9IHJlcXVpcmUoIFwiLi4vLi4vY29uZmlnL3N5bGxhYmxlcy5qc1wiICk7XG5cbnZhciBnZXRXb3JkcyA9IHJlcXVpcmUoIFwiLi4vZ2V0V29yZHMuanNcIiApO1xuXG52YXIgZm9yRWFjaCA9IHJlcXVpcmUoIFwibG9kYXNoL2ZvckVhY2hcIiApO1xudmFyIGZpbHRlciA9IHJlcXVpcmUoIFwibG9kYXNoL2ZpbHRlclwiICk7XG52YXIgZmluZCA9IHJlcXVpcmUoIFwibG9kYXNoL2ZpbmRcIiApO1xudmFyIGlzVW5kZWZpbmVkID0gcmVxdWlyZSggXCJsb2Rhc2gvaXNVbmRlZmluZWRcIiApO1xudmFyIG1hcCA9IHJlcXVpcmUoIFwibG9kYXNoL21hcFwiICk7XG52YXIgc3VtID0gcmVxdWlyZSggXCJsb2Rhc2gvc3VtXCIgKTtcbnZhciBtZW1vaXplID0gcmVxdWlyZSggXCJsb2Rhc2gvbWVtb2l6ZVwiICk7XG52YXIgZmxhdE1hcCA9IHJlcXVpcmUoIFwibG9kYXNoL2ZsYXRNYXBcIiApO1xuXG52YXIgU3lsbGFibGVDb3VudEl0ZXJhdG9yID0gcmVxdWlyZSggXCIuLi8uLi9oZWxwZXJzL3N5bGxhYmxlQ291bnRJdGVyYXRvci5qc1wiICk7XG52YXIgRGV2aWF0aW9uRnJhZ21lbnQgPSByZXF1aXJlKCBcIi4vRGV2aWF0aW9uRnJhZ21lbnRcIiApO1xuXG4vKipcbiAqIENvdW50cyB2b3dlbCBncm91cHMgaW5zaWRlIGEgd29yZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gd29yZCBBIHRleHQgd2l0aCB3b3JkcyB0byBjb3VudCBzeWxsYWJsZXMuXG4gKiBAcGFyYW0ge1N0cmluZ30gbG9jYWxlIFRoZSBsb2NhbGUgdG8gdXNlIGZvciBjb3VudGluZyBzeWxsYWJsZXMuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgc3lsbGFibGUgY291bnQuXG4gKi9cbnZhciBjb3VudFZvd2VsR3JvdXBzID0gZnVuY3Rpb24oIHdvcmQsIGxvY2FsZSApIHtcblx0dmFyIG51bWJlck9mU3lsbGFibGVzID0gMDtcblx0dmFyIHZvd2VsUmVnZXggPSBuZXcgUmVnRXhwKCBcIlteXCIgKyBzeWxsYWJsZU1hdGNoZXJzKCBsb2NhbGUgKS52b3dlbHMgKyBcIl1cIiwgXCJpZ1wiICk7XG5cdHZhciBmb3VuZFZvd2VscyA9IHdvcmQuc3BsaXQoIHZvd2VsUmVnZXggKTtcblx0dmFyIGZpbHRlcmVkV29yZHMgPSBmaWx0ZXIoIGZvdW5kVm93ZWxzLCBmdW5jdGlvbiggdm93ZWwgKSB7XG5cdFx0cmV0dXJuIHZvd2VsICE9PSBcIlwiO1xuXHR9ICk7XG5cdG51bWJlck9mU3lsbGFibGVzICs9IGZpbHRlcmVkV29yZHMubGVuZ3RoO1xuXG5cdHJldHVybiBudW1iZXJPZlN5bGxhYmxlcztcbn07XG5cbi8qKlxuICogQ291bnRzIHRoZSBzeWxsYWJsZXMgdXNpbmcgdm93ZWwgZXhjbHVzaW9ucy4gVGhlc2UgYXJlIHVzZWQgZm9yIGdyb3VwcyBvZiB2b3dlbHMgdGhhdCBhcmUgbW9yZSBvciBsZXNzXG4gKiB0aGFuIDEgc3lsbGFibGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHdvcmQgVGhlIHdvcmQgdG8gY291bnQgc3lsbGFibGVzIG9mLlxuICogQHBhcmFtIHtTdHJpbmd9IGxvY2FsZSBUaGUgbG9jYWxlIHRvIHVzZSBmb3IgY291bnRpbmcgc3lsbGFibGVzLlxuICogQHJldHVybnMge251bWJlcn0gVGhlIG51bWJlciBvZiBzeWxsYWJsZXMgZm91bmQgaW4gdGhlIGdpdmVuIHdvcmQuXG4gKi9cbnZhciBjb3VudFZvd2VsRGV2aWF0aW9ucyA9IGZ1bmN0aW9uKCB3b3JkLCBsb2NhbGUgKSB7XG5cdHZhciBzeWxsYWJsZUNvdW50SXRlcmF0b3IgPSBuZXcgU3lsbGFibGVDb3VudEl0ZXJhdG9yKCBzeWxsYWJsZU1hdGNoZXJzKCBsb2NhbGUgKSApO1xuXHRyZXR1cm4gc3lsbGFibGVDb3VudEl0ZXJhdG9yLmNvdW50U3lsbGFibGVzKCB3b3JkICk7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG51bWJlciBvZiBzeWxsYWJsZXMgZm9yIHRoZSB3b3JkIGlmIGl0IGlzIGluIHRoZSBsaXN0IG9mIGZ1bGwgd29yZCBkZXZpYXRpb25zLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB3b3JkIFRoZSB3b3JkIHRvIHJldHJpZXZlIHRoZSBzeWxsYWJsZXMgZm9yLlxuICogQHBhcmFtIHtTdHJpbmd9IGxvY2FsZSBUaGUgbG9jYWxlIHRvIHVzZSBmb3IgY291bnRpbmcgc3lsbGFibGVzLlxuICogQHJldHVybnMge251bWJlcn0gVGhlIG51bWJlciBvZiBzeWxsYWJsZXMgZm91bmQuXG4gKi9cbnZhciBjb3VudEZ1bGxXb3JkRGV2aWF0aW9ucyA9IGZ1bmN0aW9uKCB3b3JkLCBsb2NhbGUgKSB7XG5cdHZhciBmdWxsV29yZERldmlhdGlvbnMgPSBzeWxsYWJsZU1hdGNoZXJzKCBsb2NhbGUgKS5kZXZpYXRpb25zLndvcmRzLmZ1bGw7XG5cblx0dmFyIGRldmlhdGlvbiA9IGZpbmQoIGZ1bGxXb3JkRGV2aWF0aW9ucywgZnVuY3Rpb24oIGZ1bGxXb3JkRGV2aWF0aW9uICkge1xuXHRcdHJldHVybiBmdWxsV29yZERldmlhdGlvbi53b3JkID09PSB3b3JkO1xuXHR9ICk7XG5cblx0aWYgKCAhIGlzVW5kZWZpbmVkKCBkZXZpYXRpb24gKSApIHtcblx0XHRyZXR1cm4gZGV2aWF0aW9uLnN5bGxhYmxlcztcblx0fVxuXG5cdHJldHVybiAwO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIGRldmlhdGlvbiBmcmFnbWVudHMgZm9yIGEgY2VydGFpbiBsb2NhbGUuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHN5bGxhYmxlQ29uZmlnIFN5bGxhYmxlIGNvbmZpZyBmb3IgYSBjZXJ0YWluIGxvY2FsZS5cbiAqIEByZXR1cm5zIHtEZXZpYXRpb25GcmFnbWVudFtdfSBBIGxpc3Qgb2YgZGV2aWF0aW9uIGZyYWdtZW50c1xuICovXG5mdW5jdGlvbiBjcmVhdGVEZXZpYXRpb25GcmFnbWVudHMoIHN5bGxhYmxlQ29uZmlnICkge1xuXHR2YXIgZGV2aWF0aW9uRnJhZ21lbnRzID0gW107XG5cblx0dmFyIGRldmlhdGlvbnMgPSBzeWxsYWJsZUNvbmZpZy5kZXZpYXRpb25zO1xuXG5cdGlmICggISBpc1VuZGVmaW5lZCggZGV2aWF0aW9ucy53b3JkcyApICYmICEgaXNVbmRlZmluZWQoIGRldmlhdGlvbnMud29yZHMuZnJhZ21lbnRzICkgKSB7XG5cdFx0ZGV2aWF0aW9uRnJhZ21lbnRzID0gZmxhdE1hcCggZGV2aWF0aW9ucy53b3Jkcy5mcmFnbWVudHMsIGZ1bmN0aW9uKCBmcmFnbWVudHMsIGZyYWdtZW50TG9jYXRpb24gKSB7XG5cdFx0XHRyZXR1cm4gbWFwKCBmcmFnbWVudHMsIGZ1bmN0aW9uKCBmcmFnbWVudCApIHtcblx0XHRcdFx0ZnJhZ21lbnQubG9jYXRpb24gPSBmcmFnbWVudExvY2F0aW9uO1xuXG5cdFx0XHRcdHJldHVybiBuZXcgRGV2aWF0aW9uRnJhZ21lbnQoIGZyYWdtZW50ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0cmV0dXJuIGRldmlhdGlvbkZyYWdtZW50cztcbn1cblxudmFyIGNyZWF0ZURldmlhdGlvbkZyYWdtZW50c01lbW9pemVkID0gbWVtb2l6ZSggY3JlYXRlRGV2aWF0aW9uRnJhZ21lbnRzICk7XG5cbi8qKlxuICogQ291bnRzIHN5bGxhYmxlcyBpbiBwYXJ0aWFsIGV4Y2x1c2lvbnMuIElmIHRoZXNlIGFyZSBmb3VuZCwgcmV0dXJucyB0aGUgbnVtYmVyIG9mIHN5bGxhYmxlcyAgZm91bmQsIGFuZCB0aGUgbW9kaWZpZWQgd29yZC5cbiAqIFRoZSB3b3JkIGlzIG1vZGlmaWVkIHNvIHRoZSBleGNsdWRlZCBwYXJ0IGlzbid0IGNvdW50ZWQgYnkgdGhlIG5vcm1hbCBzeWxsYWJsZSBjb3VudGVyLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB3b3JkIFRoZSB3b3JkIHRvIGNvdW50IHN5bGxhYmxlcyBvZi5cbiAqIEBwYXJhbSB7U3RyaW5nfSBsb2NhbGUgVGhlIGxvY2FsZSB0byB1c2UgZm9yIGNvdW50aW5nIHN5bGxhYmxlcy5cbiAqIEByZXR1cm5zIHtvYmplY3R9IFRoZSBudW1iZXIgb2Ygc3lsbGFibGVzIGZvdW5kIGFuZCB0aGUgbW9kaWZpZWQgd29yZC5cbiAqL1xudmFyIGNvdW50UGFydGlhbFdvcmREZXZpYXRpb25zID0gZnVuY3Rpb24oIHdvcmQsIGxvY2FsZSApIHtcblx0dmFyIGRldmlhdGlvbkZyYWdtZW50cyA9IGNyZWF0ZURldmlhdGlvbkZyYWdtZW50c01lbW9pemVkKCBzeWxsYWJsZU1hdGNoZXJzKCBsb2NhbGUgKSApO1xuXHR2YXIgcmVtYWluaW5nUGFydHMgPSB3b3JkO1xuXHR2YXIgc3lsbGFibGVDb3VudCA9IDA7XG5cblx0Zm9yRWFjaCggZGV2aWF0aW9uRnJhZ21lbnRzLCBmdW5jdGlvbiggZGV2aWF0aW9uRnJhZ21lbnQgKSB7XG5cdFx0aWYgKCBkZXZpYXRpb25GcmFnbWVudC5vY2N1cnNJbiggcmVtYWluaW5nUGFydHMgKSApIHtcblx0XHRcdHJlbWFpbmluZ1BhcnRzID0gZGV2aWF0aW9uRnJhZ21lbnQucmVtb3ZlRnJvbSggcmVtYWluaW5nUGFydHMgKTtcblx0XHRcdHN5bGxhYmxlQ291bnQgKz0gZGV2aWF0aW9uRnJhZ21lbnQuZ2V0U3lsbGFibGVzKCk7XG5cdFx0fVxuXHR9ICk7XG5cblx0cmV0dXJuIHsgd29yZDogcmVtYWluaW5nUGFydHMsIHN5bGxhYmxlQ291bnQ6IHN5bGxhYmxlQ291bnQgfTtcbn07XG5cbi8qKlxuICogQ291bnQgdGhlIG51bWJlciBvZiBzeWxsYWJsZXMgaW4gYSB3b3JkLCB1c2luZyB2b3dlbHMgYW5kIGV4Y2VwdGlvbnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHdvcmQgVGhlIHdvcmQgdG8gY291bnQgdGhlIG51bWJlciBvZiBzeWxsYWJsZXMgb2YuXG4gKiBAcGFyYW0ge1N0cmluZ30gbG9jYWxlIFRoZSBsb2NhbGUgdG8gdXNlIGZvciBjb3VudGluZyBzeWxsYWJsZXMuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgbnVtYmVyIG9mIHN5bGxhYmxlcyBmb3VuZCBpbiBhIHdvcmQuXG4gKi9cbnZhciBjb3VudFVzaW5nVm93ZWxzID0gZnVuY3Rpb24oIHdvcmQsIGxvY2FsZSApIHtcblx0dmFyIHN5bGxhYmxlQ291bnQgPSAwO1xuXG5cdHN5bGxhYmxlQ291bnQgKz0gY291bnRWb3dlbEdyb3Vwcyggd29yZCwgbG9jYWxlICk7XG5cdHN5bGxhYmxlQ291bnQgKz0gY291bnRWb3dlbERldmlhdGlvbnMoIHdvcmQsIGxvY2FsZSApO1xuXG5cdHJldHVybiBzeWxsYWJsZUNvdW50O1xufTtcblxuLyoqXG4gKiBDb3VudHMgdGhlIG51bWJlciBvZiBzeWxsYWJsZXMgaW4gYSB3b3JkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB3b3JkIFRoZSB3b3JkIHRvIGNvdW50IHN5bGxhYmxlcyBvZi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhbGUgVGhlIGxvY2FsZSBvZiB0aGUgd29yZC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBzeWxsYWJsZSBjb3VudCBmb3IgdGhlIHdvcmQuXG4gKi9cbnZhciBjb3VudFN5bGxhYmxlc0luV29yZCA9IGZ1bmN0aW9uKCB3b3JkLCBsb2NhbGUgKSB7XG5cdHZhciBzeWxsYWJsZUNvdW50ID0gMDtcblxuXHR2YXIgZnVsbFdvcmRFeGNsdXNpb24gPSBjb3VudEZ1bGxXb3JkRGV2aWF0aW9ucyggd29yZCwgbG9jYWxlICk7XG5cdGlmICggZnVsbFdvcmRFeGNsdXNpb24gIT09IDAgKSB7XG5cdFx0cmV0dXJuIGZ1bGxXb3JkRXhjbHVzaW9uO1xuXHR9XG5cblx0dmFyIHBhcnRpYWxFeGNsdXNpb25zID0gY291bnRQYXJ0aWFsV29yZERldmlhdGlvbnMoIHdvcmQsIGxvY2FsZSApO1xuXHR3b3JkID0gcGFydGlhbEV4Y2x1c2lvbnMud29yZDtcblx0c3lsbGFibGVDb3VudCArPSBwYXJ0aWFsRXhjbHVzaW9ucy5zeWxsYWJsZUNvdW50O1xuXHRzeWxsYWJsZUNvdW50ICs9IGNvdW50VXNpbmdWb3dlbHMoIHdvcmQsIGxvY2FsZSApO1xuXG5cdHJldHVybiBzeWxsYWJsZUNvdW50O1xufTtcblxuLyoqXG4gKiBDb3VudHMgdGhlIG51bWJlciBvZiBzeWxsYWJsZXMgaW4gYSB0ZXh0IHBlciB3b3JkIGJhc2VkIG9uIHZvd2Vscy5cbiAqIFVzZXMgZXhjbHVzaW9uIHdvcmRzIGZvciB3b3JkcyB0aGF0IGNhbm5vdCBiZSBtYXRjaGVkIHdpdGggdm93ZWwgbWF0Y2hpbmcuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gY291bnQgdGhlIHN5bGxhYmxlcyBvZi5cbiAqIEBwYXJhbSB7U3RyaW5nfSBsb2NhbGUgVGhlIGxvY2FsZSB0byB1c2UgZm9yIGNvdW50aW5nIHN5bGxhYmxlcy5cbiAqIEByZXR1cm5zIHtpbnR9IFRoZSB0b3RhbCBudW1iZXIgb2Ygc3lsbGFibGVzIGZvdW5kIGluIHRoZSB0ZXh0LlxuICovXG52YXIgY291bnRTeWxsYWJsZXNJblRleHQgPSBmdW5jdGlvbiggdGV4dCwgbG9jYWxlICkge1xuXHR0ZXh0ID0gdGV4dC50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuXHR2YXIgd29yZHMgPSBnZXRXb3JkcyggdGV4dCApO1xuXG5cdHZhciBzeWxsYWJsZUNvdW50cyA9IG1hcCggd29yZHMsICBmdW5jdGlvbiggd29yZCApIHtcblx0XHRyZXR1cm4gY291bnRTeWxsYWJsZXNJbldvcmQoIHdvcmQsIGxvY2FsZSApO1xuXHR9ICk7XG5cblx0cmV0dXJuIHN1bSggc3lsbGFibGVDb3VudHMgKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY291bnRTeWxsYWJsZXNJblRleHQ7XG4iLCIvKiogQG1vZHVsZSBzdHJpbmdQcm9jZXNzaW5nL3VuaWZ5V2hpdGVzcGFjZSAqL1xuXG4vKipcbiAqIFJlcGxhY2VzIGEgbm9uIGJyZWFraW5nIHNwYWNlIHdpdGggYSBub3JtYWwgc3BhY2VcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSBzdHJpbmcgdG8gcmVwbGFjZSB0aGUgbm9uIGJyZWFraW5nIHNwYWNlIGluLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIHRleHQgd2l0aCB1bmlmaWVkIHNwYWNlcy5cbiAqL1xudmFyIHVuaWZ5Tm9uQnJlYWtpbmdTcGFjZSA9IGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHRyZXR1cm4gdGV4dC5yZXBsYWNlKCAvJm5ic3A7L2csIFwiIFwiICk7XG59O1xuXG4vKipcbiAqIFJlcGxhY2VzIGFsbCB3aGl0ZXNwYWNlcyB3aXRoIGEgbm9ybWFsIHNwYWNlXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgc3RyaW5nIHRvIHJlcGxhY2UgdGhlIG5vbiBicmVha2luZyBzcGFjZSBpbi5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSB0ZXh0IHdpdGggdW5pZmllZCBzcGFjZXMuXG4gKi9cbnZhciB1bmlmeVdoaXRlU3BhY2UgPSBmdW5jdGlvbiggdGV4dCApIHtcblx0cmV0dXJuIHRleHQucmVwbGFjZSggL1xccy9nLCBcIiBcIiApO1xufTtcblxuLyoqXG4gKiBDb252ZXJ0cyBhbGwgd2hpdGVzcGFjZSB0byBzcGFjZXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gcmVwbGFjZSBzcGFjZXMuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgdGV4dCB3aXRoIHVuaWZpZWQgc3BhY2VzLlxuICovXG52YXIgdW5pZnlBbGxTcGFjZXMgPSBmdW5jdGlvbiggdGV4dCApIHtcblx0dGV4dCA9IHVuaWZ5Tm9uQnJlYWtpbmdTcGFjZSggdGV4dCApO1xuXHRyZXR1cm4gdW5pZnlXaGl0ZVNwYWNlKCB0ZXh0ICk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0dW5pZnlOb25CcmVha2luZ1NwYWNlOiB1bmlmeU5vbkJyZWFraW5nU3BhY2UsXG5cdHVuaWZ5V2hpdGVTcGFjZTogdW5pZnlXaGl0ZVNwYWNlLFxuXHR1bmlmeUFsbFNwYWNlczogdW5pZnlBbGxTcGFjZXMsXG59O1xuIiwidmFyIGZ1bmN0aW9uV29yZHMgPSByZXF1aXJlKCBcIi4uL3Jlc2VhcmNoZXMvZW5nbGlzaC9mdW5jdGlvbldvcmRzXCIgKSgpLmFsbDtcbnZhciBmb3JFYWNoID0gcmVxdWlyZSggXCJsb2Rhc2gvZm9yRWFjaFwiICk7XG52YXIgaGFzID0gcmVxdWlyZSggXCJsb2Rhc2gvaGFzXCIgKTtcblxuLyoqXG4gKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiB3b3JkIGlzIGEgZnVuY3Rpb24gd29yZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gd29yZCBUaGUgd29yZCB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgd29yZCBpcyBhIGZ1bmN0aW9uIHdvcmQuXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb25Xb3JkKCB3b3JkICkge1xuXHRyZXR1cm4gLTEgIT09IGZ1bmN0aW9uV29yZHMuaW5kZXhPZiggd29yZC50b0xvY2FsZUxvd2VyQ2FzZSgpICk7XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIHdvcmQgY29tYmluYXRpb24gaW4gdGhlIGNvbnRleHQgb2YgcmVsZXZhbnQgd29yZHMuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKlxuICogQHBhcmFtIHtzdHJpbmdbXX0gd29yZHMgVGhlIGxpc3Qgb2Ygd29yZHMgdGhhdCB0aGlzIGNvbWJpbmF0aW9uIGNvbnNpc3RzIG9mLlxuICogQHBhcmFtIHtudW1iZXJ9IFtvY2N1cnJlbmNlc10gVGhlIG51bWJlciBvZiBvY2N1cnJlbmNlcywgZGVmYXVsdHMgdG8gMC5cbiAqL1xuZnVuY3Rpb24gV29yZENvbWJpbmF0aW9uKCB3b3Jkcywgb2NjdXJyZW5jZXMgKSB7XG5cdHRoaXMuX3dvcmRzID0gd29yZHM7XG5cdHRoaXMuX2xlbmd0aCA9IHdvcmRzLmxlbmd0aDtcblx0dGhpcy5fb2NjdXJyZW5jZXMgPSBvY2N1cnJlbmNlcyB8fCAwO1xufVxuXG5Xb3JkQ29tYmluYXRpb24ubGVuZ3RoQm9udXMgPSB7XG5cdDI6IDMsXG5cdDM6IDcsXG5cdDQ6IDEyLFxuXHQ1OiAxOCxcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgYmFzZSByZWxldmFuY2UgYmFzZWQgb24gdGhlIGxlbmd0aCBvZiB0aGlzIGNvbWJpbmF0aW9uLlxuICpcbiAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBiYXNlIHJlbGV2YW5jZSBiYXNlZCBvbiB0aGUgbGVuZ3RoLlxuICovXG5Xb3JkQ29tYmluYXRpb24ucHJvdG90eXBlLmdldExlbmd0aEJvbnVzID0gZnVuY3Rpb24oKSB7XG5cdGlmICggaGFzKCBXb3JkQ29tYmluYXRpb24ubGVuZ3RoQm9udXMsIHRoaXMuX2xlbmd0aCApICkge1xuXHRcdHJldHVybiBXb3JkQ29tYmluYXRpb24ubGVuZ3RoQm9udXNbIHRoaXMuX2xlbmd0aCBdO1xuXHR9XG5cblx0cmV0dXJuIDA7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGxpc3Qgd2l0aCB3b3Jkcy5cbiAqXG4gKiBAcmV0dXJucyB7YXJyYXl9IFRoZSBsaXN0IHdpdGggd29yZHMuXG4gKi9cbldvcmRDb21iaW5hdGlvbi5wcm90b3R5cGUuZ2V0V29yZHMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuX3dvcmRzO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSB3b3JkIGNvbWJpbmF0aW9uIGxlbmd0aC5cbiAqXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgd29yZCBjb21iaW5hdGlvbiBsZW5ndGguXG4gKi9cbldvcmRDb21iaW5hdGlvbi5wcm90b3R5cGUuZ2V0TGVuZ3RoID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLl9sZW5ndGg7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGNvbWJpbmF0aW9uIGFzIGl0IG9jY3VycyBpbiB0aGUgdGV4dC5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluYXRpb24uXG4gKi9cbldvcmRDb21iaW5hdGlvbi5wcm90b3R5cGUuZ2V0Q29tYmluYXRpb24gPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuX3dvcmRzLmpvaW4oIFwiIFwiICk7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGFtb3VudCBvZiBvY2N1cnJlbmNlcyBvZiB0aGlzIHdvcmQgY29tYmluYXRpb24uXG4gKlxuICogQHJldHVybnMge251bWJlcn0gVGhlIGFtb3VudCBvZiBvY2N1cnJlbmNlcy5cbiAqL1xuV29yZENvbWJpbmF0aW9uLnByb3RvdHlwZS5nZXRPY2N1cnJlbmNlcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5fb2NjdXJyZW5jZXM7XG59O1xuXG4vKipcbiAqIEluY3JlbWVudHMgdGhlIG9jY3VycmVuY2VzLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5Xb3JkQ29tYmluYXRpb24ucHJvdG90eXBlLmluY3JlbWVudE9jY3VycmVuY2VzID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuX29jY3VycmVuY2VzICs9IDE7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIHJlbGV2YW5jZSBvZiB0aGUgbGVuZ3RoLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSByZWxldmFudFdvcmRQZXJjZW50YWdlIFRoZSByZWxldmFuY2Ugb2YgdGhlIHdvcmRzIHdpdGhpbiB0aGUgY29tYmluYXRpb24uXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgcmVsZXZhbmNlIGJhc2VkIG9uIHRoZSBsZW5ndGggYW5kIHRoZSB3b3JkIHJlbGV2YW5jZS5cbiAqL1xuV29yZENvbWJpbmF0aW9uLnByb3RvdHlwZS5nZXRNdWx0aXBsaWVyID0gZnVuY3Rpb24oIHJlbGV2YW50V29yZFBlcmNlbnRhZ2UgKSB7XG5cdHZhciBsZW5ndGhCb251cyA9IHRoaXMuZ2V0TGVuZ3RoQm9udXMoKTtcblxuXHQvLyBUaGUgcmVsZXZhbmNlIHNjYWxlcyBsaW5lYXJseSBmcm9tIHRoZSByZWxldmFuY2Ugb2Ygb25lIHdvcmQgdG8gdGhlIG1heGltdW0uXG5cdHJldHVybiAxICsgcmVsZXZhbnRXb3JkUGVyY2VudGFnZSAqIGxlbmd0aEJvbnVzO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGlmIHRoZSBnaXZlbiB3b3JkIGlzIGEgcmVsZXZhbnQgd29yZCBiYXNlZCBvbiB0aGUgZ2l2ZW4gd29yZCByZWxldmFuY2UuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHdvcmQgVGhlIHdvcmQgdG8gY2hlY2sgaWYgaXQgaXMgcmVsZXZhbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgaXQgaXMgcmVsZXZhbnQuXG4gKi9cbldvcmRDb21iaW5hdGlvbi5wcm90b3R5cGUuaXNSZWxldmFudFdvcmQgPSBmdW5jdGlvbiggd29yZCApIHtcblx0cmV0dXJuIGhhcyggdGhpcy5fcmVsZXZhbnRXb3Jkcywgd29yZCApO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSByZWxldmFuY2Ugb2YgdGhlIHdvcmRzIHdpdGhpbiB0aGlzIGNvbWJpbmF0aW9uLlxuICpcbiAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBwZXJjZW50YWdlIG9mIHJlbGV2YW50IHdvcmRzIGluc2lkZSB0aGlzIGNvbWJpbmF0aW9uLlxuICovXG5Xb3JkQ29tYmluYXRpb24ucHJvdG90eXBlLmdldFJlbGV2YW50V29yZFBlcmNlbnRhZ2UgPSBmdW5jdGlvbigpIHtcblx0dmFyIHJlbGV2YW50V29yZENvdW50ID0gMCwgd29yZFJlbGV2YW5jZSA9IDE7XG5cblx0aWYgKCB0aGlzLl9sZW5ndGggPiAxICkge1xuXHRcdGZvckVhY2goIHRoaXMuX3dvcmRzLCBmdW5jdGlvbiggd29yZCApIHtcblx0XHRcdGlmICggdGhpcy5pc1JlbGV2YW50V29yZCggd29yZCApICkge1xuXHRcdFx0XHRyZWxldmFudFdvcmRDb3VudCArPSAxO1xuXHRcdFx0fVxuXHRcdH0uYmluZCggdGhpcyApICk7XG5cblx0XHR3b3JkUmVsZXZhbmNlID0gcmVsZXZhbnRXb3JkQ291bnQgLyB0aGlzLl9sZW5ndGg7XG5cdH1cblxuXHRyZXR1cm4gd29yZFJlbGV2YW5jZTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgcmVsZXZhbmNlIGZvciB0aGlzIHdvcmQgY29tYmluYXRpb24uXG4gKlxuICogQHJldHVybnMge251bWJlcn0gVGhlIHJlbGV2YW5jZSBvZiB0aGlzIHdvcmQgY29tYmluYXRpb24uXG4gKi9cbldvcmRDb21iaW5hdGlvbi5wcm90b3R5cGUuZ2V0UmVsZXZhbmNlID0gZnVuY3Rpb24oKSB7XG5cdGlmICggdGhpcy5fd29yZHMubGVuZ3RoID09PSAxICYmIGlzRnVuY3Rpb25Xb3JkKCB0aGlzLl93b3Jkc1sgMCBdICkgKSB7XG5cdFx0cmV0dXJuIDA7XG5cdH1cblxuXHR2YXIgd29yZFJlbGV2YW5jZSA9IHRoaXMuZ2V0UmVsZXZhbnRXb3JkUGVyY2VudGFnZSgpO1xuXHRpZiAoIHdvcmRSZWxldmFuY2UgPT09IDAgKSB7XG5cdFx0cmV0dXJuIDA7XG5cdH1cblxuXHRyZXR1cm4gdGhpcy5nZXRNdWx0aXBsaWVyKCB3b3JkUmVsZXZhbmNlICkgKiB0aGlzLl9vY2N1cnJlbmNlcztcbn07XG5cbi8qKlxuICogU2V0cyB0aGUgcmVsZXZhbmNlIG9mIHNpbmdsZSB3b3Jkc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSByZWxldmFudFdvcmRzIEEgbWFwcGluZyBmcm9tIGEgd29yZCB0byBhIHJlbGV2YW5jZS5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5Xb3JkQ29tYmluYXRpb24ucHJvdG90eXBlLnNldFJlbGV2YW50V29yZHMgPSBmdW5jdGlvbiggcmVsZXZhbnRXb3JkcyApIHtcblx0dGhpcy5fcmVsZXZhbnRXb3JkcyA9IHJlbGV2YW50V29yZHM7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGRlbnNpdHkgb2YgdGhpcyBjb21iaW5hdGlvbiB3aXRoaW4gdGhlIHRleHQuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IHdvcmRDb3VudCBUaGUgd29yZCBjb3VudCBvZiB0aGUgdGV4dCB0aGlzIGNvbWJpbmF0aW9uIHdhcyBmb3VuZCBpbi5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBkZW5zaXR5IG9mIHRoaXMgY29tYmluYXRpb24uXG4gKi9cbldvcmRDb21iaW5hdGlvbi5wcm90b3R5cGUuZ2V0RGVuc2l0eSA9IGZ1bmN0aW9uKCB3b3JkQ291bnQgKSB7XG5cdHJldHVybiB0aGlzLl9vY2N1cnJlbmNlcyAvIHdvcmRDb3VudDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gV29yZENvbWJpbmF0aW9uO1xuIl19
