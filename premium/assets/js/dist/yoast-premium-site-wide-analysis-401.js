(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A helper class to do AJAX requests to the REST API.
 */
var RestApi = function () {

	/**
  * Constructs a RestApi request helper object.
  *
  * @param {string} rootUrl The root URL of the REST API.
  * @param {string} nonce The nonce to authenticate to the REST API using cookies.
  */
	function RestApi(_ref) {
		var rootUrl = _ref.rootUrl,
		    nonce = _ref.nonce;

		_classCallCheck(this, RestApi);

		this._rootUrl = rootUrl;
		this._nonce = nonce;
	}

	/**
  * Does a GET request to the REST API
  *
  * @param {string} path The path to do the request to.
  * @param {Object} params The parameters to use for jQuery.
  * @returns {Promise} Resolves when the AJAX request is complete.
  */


	_createClass(RestApi, [{
		key: "get",
		value: function get(path, params) {
			params = Object.assign(params, {
				type: "GET",
				url: this._rootUrl + path
			});

			return this.request(params);
		}

		/**
   * Does a POST request to the REST API
   *
   * @param {string} path The path to do the request to.
   * @param {Object} params The parameters to use for jQuery.
   * @returns {Promise} Resolves when the AJAX request is complete.
   */

	}, {
		key: "post",
		value: function post(path, params) {
			params = Object.assign(params, {
				type: "POST",
				url: this._rootUrl + path
			});

			return this.request(params);
		}

		/**
   * Do a request to the REST API
   *
   * @param {Object} params The params to use for jQuery.
   * @returns {Promise} Resolves when the AJAX request is complete.
   */

	}, {
		key: "request",
		value: function request(params) {
			var _this = this;

			return new Promise(function (resolve, reject) {
				params = Object.assign(params, {
					beforeSend: function beforeSend(xhr) {
						xhr.setRequestHeader("X-WP-Nonce", _this._nonce);
					},
					success: resolve,
					error: reject
				});

				jQuery.ajax(params);
			});
		}
	}]);

	return RestApi;
}();

exports.default = RestApi;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A key value store for prominent words to their respective IDs.
 */
var ProminentWordCache = function () {

	/**
  * Sets the initial cache.
  */
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

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _unescape = require("lodash/unescape");

var _unescape2 = _interopRequireDefault(_unescape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Populates a prominent word cache with data from the server.
 */
var ProminentWordCachePopulator = function () {

	/**
  * Sets the instance attributes.
  *
  * @param {ProminentWordCache} cache The cache to populate.
  * @param {RestApi} restApi The REST API object to do requests with.
  */
	function ProminentWordCachePopulator(_ref) {
		var cache = _ref.cache,
		    restApi = _ref.restApi;

		_classCallCheck(this, ProminentWordCachePopulator);

		this._cache = cache;
		this._restApi = restApi;
		this._currentPage = 1;

		this.processProminentWord = this.processProminentWord.bind(this);
	}

	/**
  * Populates the prominent word cache with data from the server.
  *
  * @returns {Promise} Resolves when the cache has been populated.
  */


	_createClass(ProminentWordCachePopulator, [{
		key: "populate",
		value: function populate() {
			var _this = this;

			var data = {
				per_page: 100,
				page: this._currentPage
			};

			return this._restApi.get("wp/v2/yst_prominent_words", { data: data }).then(function (result) {
				if (result.length === 0) {
					return;
				}

				result.forEach(_this.processProminentWord);

				_this._currentPage += 1;

				return _this.populate();
			});
		}

		/**
   * Saves a prominent word to the cache.
   *
   * @param {Object} prominentWord The prominent word to save to the cache.
   * @returns {void}
   */

	}, {
		key: "processProminentWord",
		value: function processProminentWord(prominentWord) {
			var name = (0, _unescape2.default)(prominentWord.name);

			this._cache.setID(name, prominentWord.id);
		}
	}]);

	return ProminentWordCachePopulator;
}();

exports.default = ProminentWordCachePopulator;

},{"lodash/unescape":182}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ProminentWordCache = require("./ProminentWordCache");

var _ProminentWordCache2 = _interopRequireDefault(_ProminentWordCache);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _isEqual = require("lodash/isEqual");

var _isEqual2 = _interopRequireDefault(_isEqual);

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
  * @param {string} postSaveEndpoint The endpoint to use to save the post.
  * @param {string} postTypeBase The base of the post type to use in the REST API URL.
  * @param {number} postID The postID of the post to save prominent words for.
  * @param {ProminentWordCache} cache The cache to use for the prominent word term IDs.
  */
	function ProminentWordStorage(_ref) {
		var postID = _ref.postID,
		    rootUrl = _ref.rootUrl,
		    nonce = _ref.nonce,
		    _ref$postSaveEndpoint = _ref.postSaveEndpoint,
		    postSaveEndpoint = _ref$postSaveEndpoint === undefined ? "" : _ref$postSaveEndpoint,
		    _ref$postTypeBase = _ref.postTypeBase,
		    postTypeBase = _ref$postTypeBase === undefined ? null : _ref$postTypeBase,
		    _ref$cache = _ref.cache,
		    cache = _ref$cache === undefined ? null : _ref$cache;

		_classCallCheck(this, ProminentWordStorage);

		var _this = _possibleConstructorReturn(this, (ProminentWordStorage.__proto__ || Object.getPrototypeOf(ProminentWordStorage)).call(this));

		_this._rootUrl = rootUrl;
		_this._nonce = nonce;
		_this._postID = postID;
		_this._savingProminentWords = false;
		_this._previousProminentWords = null;

		_this._postSaveEndpoint = postSaveEndpoint;
		if (postTypeBase !== null) {
			_this._postSaveEndpoint = _this._rootUrl + "wp/v2/" + postTypeBase + "/" + _this._postID;
		}

		if (cache === null) {
			cache = new _ProminentWordCache2.default();
		}
		_this._cache = cache;

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

			var firstTwentyWords = prominentWords.slice(0, 20);

			// Retrieve IDs of all prominent word terms, but do it in sequence to prevent overloading servers.
			var prominentWordIds = firstTwentyWords.reduce(function (previousPromise, prominentWord) {
				return previousPromise.then(function (ids) {
					return _this2.retrieveProminentWordId(prominentWord).then(function (newId) {
						ids.push(newId);

						return ids;

						// On error, just continue with the other terms.
					}, function () {
						return ids;
					});
				});
			}, Promise.resolve([]));

			return prominentWordIds.then(function (prominentWords) {
				if ((0, _isEqual2.default)(prominentWords, _this2._previousProminentWords)) {
					_this2._savingProminentWords = false;
					return Promise.resolve();
				}
				_this2._previousProminentWords = prominentWords;

				return new Promise(function (resolve, reject) {
					jQuery.ajax({
						type: "POST",
						url: _this2._postSaveEndpoint,
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
			}).catch(function (e) {});
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

},{"./ProminentWordCache":2,"events":7,"lodash/isEqual":158}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _relevantWords = require("yoastseo/js/stringProcessing/relevantWords");

var _ProminentWordStorage = require("./ProminentWordStorage");

var _ProminentWordStorage2 = _interopRequireDefault(_ProminentWordStorage);

var _ProminentWordCache = require("./ProminentWordCache");

var _ProminentWordCache2 = _interopRequireDefault(_ProminentWordCache);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var postStatuses = ["future", "draft", "pending", "private", "publish"].join(",");

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
  * @param {string} listEndpoint The endpoint to call when retrieving posts or pages.
  * @param {ProminentWordCache} prominentWordCache The cache for prominent words.
  */
	function SiteWideCalculation(_ref) {
		var totalPosts = _ref.totalPosts,
		    rootUrl = _ref.rootUrl,
		    nonce = _ref.nonce,
		    allProminentWordIds = _ref.allProminentWordIds,
		    listEndpoint = _ref.listEndpoint,
		    _ref$prominentWordCac = _ref.prominentWordCache,
		    prominentWordCache = _ref$prominentWordCac === undefined ? null : _ref$prominentWordCac,
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
		_this._listEndpoint = listEndpoint;

		if (prominentWordCache === null) {
			prominentWordCache = new _ProminentWordCache2.default();
		}
		_this._prominentWordCache = prominentWordCache;

		_this.processPost = _this.processPost.bind(_this);
		_this.continueProcessing = _this.continueProcessing.bind(_this);
		_this.processResponse = _this.processResponse.bind(_this);
		_this.incrementProcessedPosts = _this.incrementProcessedPosts.bind(_this);
		_this.calculate = _this.calculate.bind(_this);
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
				url: this._listEndpoint,
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

			var processPromises = response.reduce(function (previousPromise, post) {
				return previousPromise.then(function () {
					return _this3.processPost(post);
				});
			}, Promise.resolve());

			processPromises.then(this.continueProcessing).catch(this.continueProcessing);
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
				nonce: this._nonce,
				cache: this._prominentWordCache,
				postSaveEndpoint: post._links.self[0].href
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

},{"./ProminentWordCache":2,"./ProminentWordStorage":4,"events":7,"yoastseo/js/stringProcessing/relevantWords":201}],6:[function(require,module,exports){
"use strict";

var _siteWideCalculation = require("./keywordSuggestions/siteWideCalculation");

var _siteWideCalculation2 = _interopRequireDefault(_siteWideCalculation);

var _ProminentWordCache = require("./keywordSuggestions/ProminentWordCache");

var _ProminentWordCache2 = _interopRequireDefault(_ProminentWordCache);

var _ProminentWordCachePopulator = require("./keywordSuggestions/ProminentWordCachePopulator");

var _ProminentWordCachePopulator2 = _interopRequireDefault(_ProminentWordCachePopulator);

var _restApi = require("./helpers/restApi");

var _restApi2 = _interopRequireDefault(_restApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global yoastSiteWideAnalysisData */

var settings = yoastSiteWideAnalysisData.data;

var progressContainer = void 0,
    completedContainer = void 0;
var prominentWordCache = void 0;

/**
 * Recalculates posts
 *
 * @returns {Promise} Resolves when we have recalculated posts.
 */
function recalculatePosts() {
	var progressElement = jQuery(".yoast-js-prominent-words-progress-current");
	var rootUrl = settings.restApi.root;

	return new Promise(function (resolve) {
		var postsCalculation = new _siteWideCalculation2.default({
			totalPosts: settings.amount.total,
			recalculateAll: true,
			rootUrl: rootUrl,
			nonce: settings.restApi.nonce,
			allProminentWordIds: settings.allWords,
			listEndpoint: rootUrl + "wp/v2/posts/",
			prominentWordCache: prominentWordCache
		});

		postsCalculation.on("processedPost", function (postCount) {
			progressElement.html(postCount);
		});

		postsCalculation.start();

		// Free up the variable to start another recalculation.
		postsCalculation.on("complete", resolve);
	});
}

/**
 * Recalculates pages
 *
 * @returns {Promise} Resolves when we have recalculated pages.
 */
function recalculatePages() {
	var progressElement = jQuery(".yoast-js-prominent-words-pages-progress-current");
	var rootUrl = settings.restApi.root;

	return new Promise(function (resolve) {
		var pagesCalculation = new _siteWideCalculation2.default({
			totalPosts: settings.amountPages.total,
			recalculateAll: true,
			rootUrl: rootUrl,
			nonce: settings.restApi.nonce,
			allProminentWordIds: settings.allWords,
			listEndpoint: rootUrl + "wp/v2/pages/",
			prominentWordCache: prominentWordCache
		});

		pagesCalculation.on("processedPost", function (postCount) {
			progressElement.html(postCount);
		});

		pagesCalculation.start();

		// Free up the variable to start another recalculation.
		pagesCalculation.on("complete", resolve);
	});
}

/**
 * Shows completion to the user
 *
 * @returns {void}
 */
function showCompletion() {
	progressContainer.hide();
	completedContainer.show();
}

/**
 * Start recalculating.
 *
 * @returns {void}
 */
function startRecalculating() {
	progressContainer.show();

	var restApi = new _restApi2.default({ rootUrl: settings.restApi.root, nonce: settings.restApi.nonce });

	prominentWordCache = new _ProminentWordCache2.default();
	var populator = new _ProminentWordCachePopulator2.default({ cache: prominentWordCache, restApi: restApi });

	populator.populate().then(recalculatePosts).then(recalculatePages).then(showCompletion);
}

/**
 * Initializes the site wide analysis tab.
 *
 * @returns {void}
 */
function init() {
	jQuery(".yoast-js-calculate-prominent-words--all").on("click", function () {
		startRecalculating();

		jQuery(this).hide();
	});

	progressContainer = jQuery(".yoast-js-prominent-words-progress");
	progressContainer.hide();

	completedContainer = jQuery(".yoast-js-prominent-words-completed");
	completedContainer.hide();
}

jQuery(init);

},{"./helpers/restApi":1,"./keywordSuggestions/ProminentWordCache":2,"./keywordSuggestions/ProminentWordCachePopulator":3,"./keywordSuggestions/siteWideCalculation":5}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":86,"./_root":122}],9:[function(require,module,exports){
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

},{"./_hashClear":91,"./_hashDelete":92,"./_hashGet":93,"./_hashHas":94,"./_hashSet":95}],10:[function(require,module,exports){
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

},{"./_listCacheClear":103,"./_listCacheDelete":104,"./_listCacheGet":105,"./_listCacheHas":106,"./_listCacheSet":107}],11:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":86,"./_root":122}],12:[function(require,module,exports){
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

},{"./_mapCacheClear":108,"./_mapCacheDelete":109,"./_mapCacheGet":110,"./_mapCacheHas":111,"./_mapCacheSet":112}],13:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":86,"./_root":122}],14:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":86,"./_root":122}],15:[function(require,module,exports){
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

},{"./_MapCache":12,"./_setCacheAdd":123,"./_setCacheHas":124}],16:[function(require,module,exports){
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

},{"./_ListCache":10,"./_stackClear":128,"./_stackDelete":129,"./_stackGet":130,"./_stackHas":131,"./_stackSet":132}],17:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":122}],18:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":122}],19:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":86,"./_root":122}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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

},{"./_baseIndexOf":42}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

},{"./_baseTimes":66,"./_isIndex":97,"./isArguments":152,"./isArray":153,"./isBuffer":156,"./isTypedArray":167}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{"./_baseAssignValue":31,"./eq":139}],30:[function(require,module,exports){
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

},{"./eq":139}],31:[function(require,module,exports){
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

},{"./_defineProperty":78}],32:[function(require,module,exports){
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

},{"./_baseForOwn":37,"./_createBaseEach":75}],33:[function(require,module,exports){
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

},{"./_baseEach":32}],34:[function(require,module,exports){
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

},{}],35:[function(require,module,exports){
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

},{"./_arrayPush":27,"./_isFlattenable":96}],36:[function(require,module,exports){
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

},{"./_createBaseFor":76}],37:[function(require,module,exports){
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

},{"./_baseFor":36,"./keys":169}],38:[function(require,module,exports){
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

},{"./_castPath":73,"./_toKey":135}],39:[function(require,module,exports){
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

},{"./_Symbol":17,"./_getRawTag":87,"./_objectToString":119}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
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

},{}],42:[function(require,module,exports){
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

},{"./_baseFindIndex":34,"./_baseIsNaN":48,"./_strictIndexOf":133}],43:[function(require,module,exports){
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

},{"./_SetCache":15,"./_arrayIncludes":23,"./_arrayIncludesWith":24,"./_arrayMap":26,"./_baseUnary":68,"./_cacheHas":70}],44:[function(require,module,exports){
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

},{"./_baseGetTag":39,"./isObjectLike":164}],45:[function(require,module,exports){
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

},{"./_baseIsEqualDeep":46,"./isObject":163,"./isObjectLike":164}],46:[function(require,module,exports){
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

},{"./_Stack":16,"./_equalArrays":79,"./_equalByTag":80,"./_equalObjects":81,"./_getTag":88,"./isArray":153,"./isBuffer":156,"./isTypedArray":167}],47:[function(require,module,exports){
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

},{"./_Stack":16,"./_baseIsEqual":45}],48:[function(require,module,exports){
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

},{}],49:[function(require,module,exports){
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

},{"./_isMasked":100,"./_toSource":136,"./isFunction":159,"./isObject":163}],50:[function(require,module,exports){
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

},{"./_baseGetTag":39,"./isLength":160,"./isObjectLike":164}],51:[function(require,module,exports){
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

},{"./_baseMatches":54,"./_baseMatchesProperty":55,"./identity":149,"./isArray":153,"./property":174}],52:[function(require,module,exports){
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

},{"./_isPrototype":101,"./_nativeKeys":117}],53:[function(require,module,exports){
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

},{"./_baseEach":32,"./isArrayLike":154}],54:[function(require,module,exports){
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

},{"./_baseIsMatch":47,"./_getMatchData":85,"./_matchesStrictComparable":114}],55:[function(require,module,exports){
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

},{"./_baseIsEqual":45,"./_isKey":98,"./_isStrictComparable":102,"./_matchesStrictComparable":114,"./_toKey":135,"./get":146,"./hasIn":148}],56:[function(require,module,exports){
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

},{"./_basePickBy":57,"./hasIn":148}],57:[function(require,module,exports){
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

},{"./_baseGet":38,"./_baseSet":62,"./_castPath":73}],58:[function(require,module,exports){
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

},{}],59:[function(require,module,exports){
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

},{"./_baseGet":38}],60:[function(require,module,exports){
/**
 * The base implementation of `_.propertyOf` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyOf(object) {
  return function(key) {
    return object == null ? undefined : object[key];
  };
}

module.exports = basePropertyOf;

},{}],61:[function(require,module,exports){
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

},{"./_overRest":121,"./_setToString":126,"./identity":149}],62:[function(require,module,exports){
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

},{"./_assignValue":29,"./_castPath":73,"./_isIndex":97,"./_toKey":135,"./isObject":163}],63:[function(require,module,exports){
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

},{"./_defineProperty":78,"./constant":138,"./identity":149}],64:[function(require,module,exports){
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

},{}],65:[function(require,module,exports){
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

},{}],66:[function(require,module,exports){
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

},{}],67:[function(require,module,exports){
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

},{"./_Symbol":17,"./_arrayMap":26,"./isArray":153,"./isSymbol":166}],68:[function(require,module,exports){
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

},{}],69:[function(require,module,exports){
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

},{"./_arrayMap":26}],70:[function(require,module,exports){
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

},{}],71:[function(require,module,exports){
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

},{"./isArrayLikeObject":155}],72:[function(require,module,exports){
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

},{"./identity":149}],73:[function(require,module,exports){
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

},{"./_isKey":98,"./_stringToPath":134,"./isArray":153,"./toString":181}],74:[function(require,module,exports){
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":122}],75:[function(require,module,exports){
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

},{"./isArrayLike":154}],76:[function(require,module,exports){
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

},{}],77:[function(require,module,exports){
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

},{"./_baseIteratee":51,"./isArrayLike":154,"./keys":169}],78:[function(require,module,exports){
var getNative = require('./_getNative');

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;

},{"./_getNative":86}],79:[function(require,module,exports){
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

},{"./_SetCache":15,"./_arraySome":28,"./_cacheHas":70}],80:[function(require,module,exports){
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

},{"./_Symbol":17,"./_Uint8Array":18,"./_equalArrays":79,"./_mapToArray":113,"./_setToArray":125,"./eq":139}],81:[function(require,module,exports){
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

},{"./keys":169}],82:[function(require,module,exports){
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

},{"./_overRest":121,"./_setToString":126,"./flatten":144}],83:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],84:[function(require,module,exports){
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

},{"./_isKeyable":99}],85:[function(require,module,exports){
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

},{"./_isStrictComparable":102,"./keys":169}],86:[function(require,module,exports){
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

},{"./_baseIsNative":49,"./_getValue":89}],87:[function(require,module,exports){
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

},{"./_Symbol":17}],88:[function(require,module,exports){
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

},{"./_DataView":8,"./_Map":11,"./_Promise":13,"./_Set":14,"./_WeakMap":19,"./_baseGetTag":39,"./_toSource":136}],89:[function(require,module,exports){
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

},{}],90:[function(require,module,exports){
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

},{"./_castPath":73,"./_isIndex":97,"./_toKey":135,"./isArguments":152,"./isArray":153,"./isLength":160}],91:[function(require,module,exports){
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

},{"./_nativeCreate":116}],92:[function(require,module,exports){
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

},{}],93:[function(require,module,exports){
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

},{"./_nativeCreate":116}],94:[function(require,module,exports){
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

},{"./_nativeCreate":116}],95:[function(require,module,exports){
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

},{"./_nativeCreate":116}],96:[function(require,module,exports){
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

},{"./_Symbol":17,"./isArguments":152,"./isArray":153}],97:[function(require,module,exports){
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

},{}],98:[function(require,module,exports){
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

},{"./isArray":153,"./isSymbol":166}],99:[function(require,module,exports){
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

},{}],100:[function(require,module,exports){
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

},{"./_coreJsData":74}],101:[function(require,module,exports){
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

},{}],102:[function(require,module,exports){
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

},{"./isObject":163}],103:[function(require,module,exports){
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

},{}],104:[function(require,module,exports){
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

},{"./_assocIndexOf":30}],105:[function(require,module,exports){
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

},{"./_assocIndexOf":30}],106:[function(require,module,exports){
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

},{"./_assocIndexOf":30}],107:[function(require,module,exports){
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

},{"./_assocIndexOf":30}],108:[function(require,module,exports){
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

},{"./_Hash":9,"./_ListCache":10,"./_Map":11}],109:[function(require,module,exports){
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

},{"./_getMapData":84}],110:[function(require,module,exports){
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

},{"./_getMapData":84}],111:[function(require,module,exports){
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

},{"./_getMapData":84}],112:[function(require,module,exports){
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

},{"./_getMapData":84}],113:[function(require,module,exports){
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

},{}],114:[function(require,module,exports){
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

},{}],115:[function(require,module,exports){
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

},{"./memoize":171}],116:[function(require,module,exports){
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":86}],117:[function(require,module,exports){
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":120}],118:[function(require,module,exports){
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

},{"./_freeGlobal":83}],119:[function(require,module,exports){
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

},{}],120:[function(require,module,exports){
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

},{}],121:[function(require,module,exports){
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

},{"./_apply":20}],122:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":83}],123:[function(require,module,exports){
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

},{}],124:[function(require,module,exports){
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

},{}],125:[function(require,module,exports){
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

},{}],126:[function(require,module,exports){
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

},{"./_baseSetToString":63,"./_shortOut":127}],127:[function(require,module,exports){
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

},{}],128:[function(require,module,exports){
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

},{"./_ListCache":10}],129:[function(require,module,exports){
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

},{}],130:[function(require,module,exports){
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

},{}],131:[function(require,module,exports){
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

},{}],132:[function(require,module,exports){
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

},{"./_ListCache":10,"./_Map":11,"./_MapCache":12}],133:[function(require,module,exports){
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

},{}],134:[function(require,module,exports){
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

},{"./_memoizeCapped":115}],135:[function(require,module,exports){
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

},{"./isSymbol":166}],136:[function(require,module,exports){
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

},{}],137:[function(require,module,exports){
var basePropertyOf = require('./_basePropertyOf');

/** Used to map HTML entities to characters. */
var htmlUnescapes = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'"
};

/**
 * Used by `_.unescape` to convert HTML entities to characters.
 *
 * @private
 * @param {string} chr The matched character to unescape.
 * @returns {string} Returns the unescaped character.
 */
var unescapeHtmlChar = basePropertyOf(htmlUnescapes);

module.exports = unescapeHtmlChar;

},{"./_basePropertyOf":60}],138:[function(require,module,exports){
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

},{}],139:[function(require,module,exports){
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

},{}],140:[function(require,module,exports){
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

},{"./_arrayFilter":22,"./_baseFilter":33,"./_baseIteratee":51,"./isArray":153}],141:[function(require,module,exports){
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

},{"./_createFind":77,"./findIndex":142}],142:[function(require,module,exports){
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

},{"./_baseFindIndex":34,"./_baseIteratee":51,"./toInteger":179}],143:[function(require,module,exports){
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

},{"./_baseFlatten":35,"./map":170}],144:[function(require,module,exports){
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

},{"./_baseFlatten":35}],145:[function(require,module,exports){
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

},{"./_arrayEach":21,"./_baseEach":32,"./_castFunction":72,"./isArray":153}],146:[function(require,module,exports){
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

},{"./_baseGet":38}],147:[function(require,module,exports){
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

},{"./_baseHas":40,"./_hasPath":90}],148:[function(require,module,exports){
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

},{"./_baseHasIn":41,"./_hasPath":90}],149:[function(require,module,exports){
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

},{}],150:[function(require,module,exports){
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

},{"./_baseIndexOf":42,"./isArrayLike":154,"./isString":165,"./toInteger":179,"./values":183}],151:[function(require,module,exports){
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

},{"./_arrayMap":26,"./_baseIntersection":43,"./_baseRest":61,"./_castArrayLikeObject":71}],152:[function(require,module,exports){
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

},{"./_baseIsArguments":44,"./isObjectLike":164}],153:[function(require,module,exports){
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

},{}],154:[function(require,module,exports){
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

},{"./isFunction":159,"./isLength":160}],155:[function(require,module,exports){
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

},{"./isArrayLike":154,"./isObjectLike":164}],156:[function(require,module,exports){
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

},{"./_root":122,"./stubFalse":175}],157:[function(require,module,exports){
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

},{"./_baseKeys":52,"./_getTag":88,"./_isPrototype":101,"./isArguments":152,"./isArray":153,"./isArrayLike":154,"./isBuffer":156,"./isTypedArray":167}],158:[function(require,module,exports){
var baseIsEqual = require('./_baseIsEqual');

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are **not** supported.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */
function isEqual(value, other) {
  return baseIsEqual(value, other);
}

module.exports = isEqual;

},{"./_baseIsEqual":45}],159:[function(require,module,exports){
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

},{"./_baseGetTag":39,"./isObject":163}],160:[function(require,module,exports){
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

},{}],161:[function(require,module,exports){
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

},{"./isNumber":162}],162:[function(require,module,exports){
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

},{"./_baseGetTag":39,"./isObjectLike":164}],163:[function(require,module,exports){
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

},{}],164:[function(require,module,exports){
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

},{}],165:[function(require,module,exports){
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

},{"./_baseGetTag":39,"./isArray":153,"./isObjectLike":164}],166:[function(require,module,exports){
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

},{"./_baseGetTag":39,"./isObjectLike":164}],167:[function(require,module,exports){
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

},{"./_baseIsTypedArray":50,"./_baseUnary":68,"./_nodeUtil":118}],168:[function(require,module,exports){
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

},{}],169:[function(require,module,exports){
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

},{"./_arrayLikeKeys":25,"./_baseKeys":52,"./isArrayLike":154}],170:[function(require,module,exports){
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

},{"./_arrayMap":26,"./_baseIteratee":51,"./_baseMap":53,"./isArray":153}],171:[function(require,module,exports){
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

},{"./_MapCache":12}],172:[function(require,module,exports){
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

},{}],173:[function(require,module,exports){
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

},{"./_basePick":56,"./_flatRest":82}],174:[function(require,module,exports){
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

},{"./_baseProperty":58,"./_basePropertyDeep":59,"./_isKey":98,"./_toKey":135}],175:[function(require,module,exports){
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

},{}],176:[function(require,module,exports){
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

},{"./_baseSum":65,"./identity":149}],177:[function(require,module,exports){
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

},{"./_baseSlice":64,"./toInteger":179}],178:[function(require,module,exports){
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

},{"./toNumber":180}],179:[function(require,module,exports){
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

},{"./toFinite":178}],180:[function(require,module,exports){
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

},{"./isObject":163,"./isSymbol":166}],181:[function(require,module,exports){
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

},{"./_baseToString":67}],182:[function(require,module,exports){
var toString = require('./toString'),
    unescapeHtmlChar = require('./_unescapeHtmlChar');

/** Used to match HTML entities and HTML characters. */
var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g,
    reHasEscapedHtml = RegExp(reEscapedHtml.source);

/**
 * The inverse of `_.escape`; this method converts the HTML entities
 * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to
 * their corresponding characters.
 *
 * **Note:** No other HTML entities are unescaped. To unescape additional
 * HTML entities use a third-party library like [_he_](https://mths.be/he).
 *
 * @static
 * @memberOf _
 * @since 0.6.0
 * @category String
 * @param {string} [string=''] The string to unescape.
 * @returns {string} Returns the unescaped string.
 * @example
 *
 * _.unescape('fred, barney, &amp; pebbles');
 * // => 'fred, barney, & pebbles'
 */
function unescape(string) {
  string = toString(string);
  return (string && reHasEscapedHtml.test(string))
    ? string.replace(reEscapedHtml, unescapeHtmlChar)
    : string;
}

module.exports = unescape;

},{"./_unescapeHtmlChar":137,"./toString":181}],183:[function(require,module,exports){
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

},{"./_baseValues":69,"./keys":169}],184:[function(require,module,exports){
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

},{}],185:[function(require,module,exports){
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

},{"../helpers/getLanguage.js":189,"./syllables/de.json":186,"./syllables/en.json":187,"./syllables/nl.json":188,"lodash/isUndefined":168}],186:[function(require,module,exports){
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

},{}],187:[function(require,module,exports){
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

},{}],188:[function(require,module,exports){
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

},{}],189:[function(require,module,exports){
/**
 * The function getting the language part of the locale.
 *
 * @param {string} locale The locale.
 * @returns {string} The language part of the locale.
 */
module.exports = function( locale ) {
	return locale.split( "_" )[ 0 ];
};

},{}],190:[function(require,module,exports){
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
 *
 * @returns {void}
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

},{"lodash/forEach":145,"lodash/memoize":171,"tokenizer2/core":184}],191:[function(require,module,exports){
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
 * @returns {void}
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

},{"./syllableCountStep.js":192,"lodash/forEach":145,"lodash/isUndefined":168}],192:[function(require,module,exports){
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
 * @returns {void}
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

},{"../stringProcessing/createRegexFromArray.js":197,"lodash/isUndefined":168}],193:[function(require,module,exports){
var filteredPassiveAuxiliaries = require( "./passivevoice/auxiliaries.js" )().filteredAuxiliaries;
var notFilteredPassiveAuxiliaries = require( "./passivevoice/auxiliaries.js" )().notFilteredAuxiliaries;
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

},{"./passivevoice/auxiliaries.js":194,"./transitionWords.js":195}],194:[function(require,module,exports){
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

},{}],195:[function(require,module,exports){
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
		allWords: singleWords.concat( multipleWords ),
	};
};

},{}],196:[function(require,module,exports){
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

	wordBoundary = "[ \\n\\r\\t\.,'\(\)\"\+\-;!?:\/»«‹›" + _extraWordBoundary + "<>]";
	wordBoundaryStart = "(^|" + wordBoundary + ")";
	wordBoundaryEnd = "($|" + wordBoundary + ")";

	return wordBoundaryStart + matchString + wordBoundaryEnd;
};

},{}],197:[function(require,module,exports){
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

},{"../stringProcessing/addWordboundary.js":196,"lodash/map":170}],198:[function(require,module,exports){
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

},{"../helpers/html.js":190,"../stringProcessing/quotes.js":200,"../stringProcessing/unifyWhitespace.js":207,"lodash/filter":140,"lodash/flatMap":143,"lodash/forEach":145,"lodash/isEmpty":157,"lodash/isNaN":161,"lodash/isUndefined":168,"lodash/map":170,"lodash/memoize":171,"lodash/negate":172,"tokenizer2/core":184}],199:[function(require,module,exports){
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


},{"./removePunctuation.js":202,"./stripHTMLTags.js":203,"./stripSpaces.js":204,"lodash/filter":140,"lodash/map":170}],200:[function(require,module,exports){
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

},{}],201:[function(require,module,exports){
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

},{"../researches/english/functionWords.js":193,"../stringProcessing/getSentences":198,"../stringProcessing/getWords":199,"../stringProcessing/quotes.js":200,"../stringProcessing/syllables/count.js":206,"../values/WordCombination":208,"lodash/filter":140,"lodash/flatMap":143,"lodash/forEach":145,"lodash/has":147,"lodash/includes":150,"lodash/intersection":151,"lodash/isEmpty":157,"lodash/map":170,"lodash/take":177,"lodash/values":183}],202:[function(require,module,exports){
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

},{}],203:[function(require,module,exports){
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

},{"../helpers/html.js":190,"../stringProcessing/stripSpaces.js":204}],204:[function(require,module,exports){
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

},{}],205:[function(require,module,exports){
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

},{"lodash/isUndefined":168,"lodash/pick":173}],206:[function(require,module,exports){
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

},{"../../config/syllables.js":185,"../../helpers/syllableCountIterator.js":191,"../getWords.js":199,"./DeviationFragment":205,"lodash/filter":140,"lodash/find":141,"lodash/flatMap":143,"lodash/forEach":145,"lodash/isUndefined":168,"lodash/map":170,"lodash/memoize":171,"lodash/sum":176}],207:[function(require,module,exports){
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

},{}],208:[function(require,module,exports){
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

},{"../researches/english/functionWords":193,"lodash/forEach":145,"lodash/has":147}]},{},[6])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvc3JjL2hlbHBlcnMvcmVzdEFwaS5qcyIsImFzc2V0cy9qcy9zcmMva2V5d29yZFN1Z2dlc3Rpb25zL1Byb21pbmVudFdvcmRDYWNoZS5qcyIsImFzc2V0cy9qcy9zcmMva2V5d29yZFN1Z2dlc3Rpb25zL1Byb21pbmVudFdvcmRDYWNoZVBvcHVsYXRvci5qcyIsImFzc2V0cy9qcy9zcmMva2V5d29yZFN1Z2dlc3Rpb25zL1Byb21pbmVudFdvcmRTdG9yYWdlLmpzIiwiYXNzZXRzL2pzL3NyYy9rZXl3b3JkU3VnZ2VzdGlvbnMvc2l0ZVdpZGVDYWxjdWxhdGlvbi5qcyIsImFzc2V0cy9qcy9zcmMvc2l0ZS13aWRlLWFuYWx5c2lzLmpzIiwibm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19EYXRhVmlldy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX0hhc2guanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19MaXN0Q2FjaGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19NYXAuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19NYXBDYWNoZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1Byb21pc2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19TZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19TZXRDYWNoZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1N0YWNrLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fU3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fVWludDhBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1dlYWtNYXAuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcHBseS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5RWFjaC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5RmlsdGVyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlJbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5SW5jbHVkZXNXaXRoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlMaWtlS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5TWFwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlQdXNoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlTb21lLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNzaWduVmFsdWUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hc3NvY0luZGV4T2YuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlQXNzaWduVmFsdWUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRWFjaC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGaWx0ZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRmluZEluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUZsYXR0ZW4uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRm9yLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUZvck93bi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUhhcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VIYXNJbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJbmRleE9mLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUludGVyc2VjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc0FyZ3VtZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc0VxdWFsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzRXF1YWxEZWVwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzTWF0Y2guanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNOYU4uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNOYXRpdmUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNUeXBlZEFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUl0ZXJhdGVlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUtleXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlTWFwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZU1hdGNoZXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlTWF0Y2hlc1Byb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVBpY2suanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlUGlja0J5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVByb3BlcnR5RGVlcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VQcm9wZXJ0eU9mLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVJlc3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlU2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVNldFRvU3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVNsaWNlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVN1bS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUaW1lcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUb1N0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VVbmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VWYWx1ZXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jYWNoZUhhcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nhc3RBcnJheUxpa2VPYmplY3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jYXN0RnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jYXN0UGF0aC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcmVKc0RhdGEuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVCYXNlRWFjaC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NyZWF0ZUJhc2VGb3IuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVGaW5kLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZGVmaW5lUHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19lcXVhbEFycmF5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2VxdWFsQnlUYWcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19lcXVhbE9iamVjdHMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19mbGF0UmVzdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2ZyZWVHbG9iYWwuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRNYXBEYXRhLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0TWF0Y2hEYXRhLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0TmF0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0UmF3VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VmFsdWUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19oYXNQYXRoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaENsZWFyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaERlbGV0ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hHZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaFNldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzRmxhdHRlbmFibGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc0luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faXNLZXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc0tleWFibGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc01hc2tlZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzUHJvdG90eXBlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faXNTdHJpY3RDb21wYXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlQ2xlYXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVEZWxldGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVHZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVIYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19saXN0Q2FjaGVTZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZUNsZWFyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVEZWxldGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZUdldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVTZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXBUb0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWF0Y2hlc1N0cmljdENvbXBhcmFibGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tZW1vaXplQ2FwcGVkLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlQ3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX25vZGVVdGlsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fb2JqZWN0VG9TdHJpbmcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19vdmVyQXJnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fb3ZlclJlc3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19yb290LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc2V0Q2FjaGVBZGQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zZXRDYWNoZUhhcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3NldFRvQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zZXRUb1N0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3Nob3J0T3V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tDbGVhci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrRGVsZXRlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tHZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0hhcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrU2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RyaWN0SW5kZXhPZi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0cmluZ1RvUGF0aC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3RvS2V5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fdG9Tb3VyY2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL191bmVzY2FwZUh0bWxDaGFyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9jb25zdGFudC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvZXEuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ZpbHRlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvZmluZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvZmluZEluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9mbGF0TWFwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9mbGF0dGVuLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9mb3JFYWNoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9nZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2hhcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaGFzSW4uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lkZW50aXR5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJzZWN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FyZ3VtZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcnJheUxpa2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXlMaWtlT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0J1ZmZlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNFbXB0eS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNFcXVhbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNGdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNMZW5ndGguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzTmFOLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc051bWJlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0TGlrZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNTdHJpbmcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzU3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc1R5cGVkQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzVW5kZWZpbmVkLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9tYXAuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL21lbW9pemUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL25lZ2F0ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvcGljay5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3N0dWJGYWxzZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvc3VtLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC90YWtlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC90b0Zpbml0ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvdG9JbnRlZ2VyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC90b051bWJlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvdG9TdHJpbmcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3VuZXNjYXBlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC92YWx1ZXMuanMiLCJub2RlX21vZHVsZXMvdG9rZW5pemVyMi9jb3JlLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL2NvbmZpZy9zeWxsYWJsZXMuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvY29uZmlnL3N5bGxhYmxlcy9kZS5qc29uIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL2NvbmZpZy9zeWxsYWJsZXMvZW4uanNvbiIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9jb25maWcvc3lsbGFibGVzL25sLmpzb24iLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvaGVscGVycy9nZXRMYW5ndWFnZS5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9oZWxwZXJzL2h0bWwuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvaGVscGVycy9zeWxsYWJsZUNvdW50SXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvaGVscGVycy9zeWxsYWJsZUNvdW50U3RlcC5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9yZXNlYXJjaGVzL2VuZ2xpc2gvZnVuY3Rpb25Xb3Jkcy5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9yZXNlYXJjaGVzL2VuZ2xpc2gvcGFzc2l2ZXZvaWNlL2F1eGlsaWFyaWVzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3Jlc2VhcmNoZXMvZW5nbGlzaC90cmFuc2l0aW9uV29yZHMuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy9hZGRXb3JkYm91bmRhcnkuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy9jcmVhdGVSZWdleEZyb21BcnJheS5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9zdHJpbmdQcm9jZXNzaW5nL2dldFNlbnRlbmNlcy5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9zdHJpbmdQcm9jZXNzaW5nL2dldFdvcmRzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3NpbmcvcXVvdGVzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3NpbmcvcmVsZXZhbnRXb3Jkcy5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9zdHJpbmdQcm9jZXNzaW5nL3JlbW92ZVB1bmN0dWF0aW9uLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3Npbmcvc3RyaXBIVE1MVGFncy5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9zdHJpbmdQcm9jZXNzaW5nL3N0cmlwU3BhY2VzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3Npbmcvc3lsbGFibGVzL0RldmlhdGlvbkZyYWdtZW50LmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3Npbmcvc3lsbGFibGVzL2NvdW50LmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3NpbmcvdW5pZnlXaGl0ZXNwYWNlLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3ZhbHVlcy9Xb3JkQ29tYmluYXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O0FDQUE7OztJQUdNLE87O0FBRUw7Ozs7OztBQU1BLHdCQUFrQztBQUFBLE1BQW5CLE9BQW1CLFFBQW5CLE9BQW1CO0FBQUEsTUFBVixLQUFVLFFBQVYsS0FBVTs7QUFBQTs7QUFDakMsT0FBSyxRQUFMLEdBQWdCLE9BQWhCO0FBQ0EsT0FBSyxNQUFMLEdBQWMsS0FBZDtBQUNBOztBQUVEOzs7Ozs7Ozs7OztzQkFPSyxJLEVBQU0sTSxFQUFTO0FBQ25CLFlBQVMsT0FBTyxNQUFQLENBQWUsTUFBZixFQUF1QjtBQUMvQixVQUFNLEtBRHlCO0FBRS9CLFNBQUssS0FBSyxRQUFMLEdBQWdCO0FBRlUsSUFBdkIsQ0FBVDs7QUFLQSxVQUFPLEtBQUssT0FBTCxDQUFjLE1BQWQsQ0FBUDtBQUNBOztBQUVEOzs7Ozs7Ozs7O3VCQU9NLEksRUFBTSxNLEVBQVM7QUFDcEIsWUFBUyxPQUFPLE1BQVAsQ0FBZSxNQUFmLEVBQXVCO0FBQy9CLFVBQU0sTUFEeUI7QUFFL0IsU0FBSyxLQUFLLFFBQUwsR0FBZ0I7QUFGVSxJQUF2QixDQUFUOztBQUtBLFVBQU8sS0FBSyxPQUFMLENBQWMsTUFBZCxDQUFQO0FBQ0E7O0FBRUQ7Ozs7Ozs7OzswQkFNUyxNLEVBQVM7QUFBQTs7QUFDakIsVUFBTyxJQUFJLE9BQUosQ0FBYSxVQUFFLE9BQUYsRUFBVyxNQUFYLEVBQXVCO0FBQzFDLGFBQVMsT0FBTyxNQUFQLENBQWUsTUFBZixFQUF1QjtBQUMvQixpQkFBWSxvQkFBRSxHQUFGLEVBQVc7QUFDdEIsVUFBSSxnQkFBSixDQUFzQixZQUF0QixFQUFvQyxNQUFLLE1BQXpDO0FBQ0EsTUFIOEI7QUFJL0IsY0FBUyxPQUpzQjtBQUsvQixZQUFPO0FBTHdCLEtBQXZCLENBQVQ7O0FBUUEsV0FBTyxJQUFQLENBQWEsTUFBYjtBQUNBLElBVk0sQ0FBUDtBQVdBOzs7Ozs7a0JBR2EsTzs7Ozs7Ozs7Ozs7OztBQ3JFZjs7O0lBR00sa0I7O0FBRUw7OztBQUdBLCtCQUFjO0FBQUE7O0FBQ2IsT0FBSyxNQUFMLEdBQWMsRUFBZDtBQUNBOztBQUVEOzs7Ozs7Ozs7O3dCQU1PLEksRUFBTztBQUNiLE9BQUssS0FBSyxNQUFMLENBQVksY0FBWixDQUE0QixJQUE1QixDQUFMLEVBQTBDO0FBQ3pDLFdBQU8sS0FBSyxNQUFMLENBQWEsSUFBYixDQUFQO0FBQ0E7O0FBRUQsVUFBTyxDQUFQO0FBQ0E7O0FBRUQ7Ozs7Ozs7Ozs7d0JBT08sSSxFQUFNLEUsRUFBSztBQUNqQixRQUFLLE1BQUwsQ0FBYSxJQUFiLElBQXNCLEVBQXRCO0FBQ0E7Ozs7OztrQkFHYSxrQjs7Ozs7Ozs7Ozs7QUN0Q2Y7Ozs7Ozs7O0FBRUE7OztJQUdNLDJCOztBQUVMOzs7Ozs7QUFNQSw0Q0FBa0M7QUFBQSxNQUFuQixLQUFtQixRQUFuQixLQUFtQjtBQUFBLE1BQVosT0FBWSxRQUFaLE9BQVk7O0FBQUE7O0FBQ2pDLE9BQUssTUFBTCxHQUFjLEtBQWQ7QUFDQSxPQUFLLFFBQUwsR0FBZ0IsT0FBaEI7QUFDQSxPQUFLLFlBQUwsR0FBb0IsQ0FBcEI7O0FBRUEsT0FBSyxvQkFBTCxHQUE0QixLQUFLLG9CQUFMLENBQTBCLElBQTFCLENBQWdDLElBQWhDLENBQTVCO0FBQ0E7O0FBRUQ7Ozs7Ozs7Ozs2QkFLVztBQUFBOztBQUNWLE9BQUksT0FBTztBQUNWLGNBQVUsR0FEQTtBQUVWLFVBQU0sS0FBSztBQUZELElBQVg7O0FBS0EsVUFBTyxLQUFLLFFBQUwsQ0FBYyxHQUFkLENBQW1CLDJCQUFuQixFQUFnRCxFQUFFLFVBQUYsRUFBaEQsRUFBMkQsSUFBM0QsQ0FBaUUsVUFBRSxNQUFGLEVBQWM7QUFDckYsUUFBSyxPQUFPLE1BQVAsS0FBa0IsQ0FBdkIsRUFBMkI7QUFDMUI7QUFDQTs7QUFFRCxXQUFPLE9BQVAsQ0FBZ0IsTUFBSyxvQkFBckI7O0FBRUEsVUFBSyxZQUFMLElBQXFCLENBQXJCOztBQUVBLFdBQU8sTUFBSyxRQUFMLEVBQVA7QUFDQSxJQVZNLENBQVA7QUFXQTs7QUFFRDs7Ozs7Ozs7O3VDQU1zQixhLEVBQWdCO0FBQ3JDLE9BQUksT0FBTyx3QkFBVSxjQUFjLElBQXhCLENBQVg7O0FBRUEsUUFBSyxNQUFMLENBQVksS0FBWixDQUFtQixJQUFuQixFQUF5QixjQUFjLEVBQXZDO0FBQ0E7Ozs7OztrQkFHYSwyQjs7Ozs7Ozs7Ozs7QUMxRGY7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7O0lBR00sb0I7OztBQUNMOzs7Ozs7OztBQVFBLHFDQUFvRztBQUFBLE1BQXJGLE1BQXFGLFFBQXJGLE1BQXFGO0FBQUEsTUFBN0UsT0FBNkUsUUFBN0UsT0FBNkU7QUFBQSxNQUFwRSxLQUFvRSxRQUFwRSxLQUFvRTtBQUFBLG1DQUE3RCxnQkFBNkQ7QUFBQSxNQUE3RCxnQkFBNkQseUNBQTFDLEVBQTBDO0FBQUEsK0JBQXRDLFlBQXNDO0FBQUEsTUFBdEMsWUFBc0MscUNBQXZCLElBQXVCO0FBQUEsd0JBQWpCLEtBQWlCO0FBQUEsTUFBakIsS0FBaUIsOEJBQVQsSUFBUzs7QUFBQTs7QUFBQTs7QUFHbkcsUUFBSyxRQUFMLEdBQWdCLE9BQWhCO0FBQ0EsUUFBSyxNQUFMLEdBQWMsS0FBZDtBQUNBLFFBQUssT0FBTCxHQUFlLE1BQWY7QUFDQSxRQUFLLHFCQUFMLEdBQTZCLEtBQTdCO0FBQ0EsUUFBSyx1QkFBTCxHQUErQixJQUEvQjs7QUFFQSxRQUFLLGlCQUFMLEdBQXlCLGdCQUF6QjtBQUNBLE1BQUssaUJBQWlCLElBQXRCLEVBQTZCO0FBQzVCLFNBQUssaUJBQUwsR0FBeUIsTUFBSyxRQUFMLEdBQWdCLFFBQWhCLEdBQTJCLFlBQTNCLEdBQTBDLEdBQTFDLEdBQWdELE1BQUssT0FBOUU7QUFDQTs7QUFFRCxNQUFLLFVBQVUsSUFBZixFQUFzQjtBQUNyQixXQUFRLGtDQUFSO0FBQ0E7QUFDRCxRQUFLLE1BQUwsR0FBYyxLQUFkOztBQUVBLFFBQUssdUJBQUwsR0FBK0IsTUFBSyx1QkFBTCxDQUE2QixJQUE3QixPQUEvQjtBQW5CbUc7QUFvQm5HOztBQUVEOzs7Ozs7Ozs7O3FDQU1vQixjLEVBQWlCO0FBQUE7O0FBQ3BDO0FBQ0EsT0FBSyxLQUFLLHFCQUFWLEVBQWtDO0FBQ2pDO0FBQ0E7QUFDRCxRQUFLLHFCQUFMLEdBQTZCLElBQTdCOztBQUVBLE9BQUksbUJBQW1CLGVBQWUsS0FBZixDQUFzQixDQUF0QixFQUF5QixFQUF6QixDQUF2Qjs7QUFFQTtBQUNBLE9BQUksbUJBQW1CLGlCQUFpQixNQUFqQixDQUF5QixVQUFFLGVBQUYsRUFBbUIsYUFBbkIsRUFBc0M7QUFDckYsV0FBTyxnQkFBZ0IsSUFBaEIsQ0FBc0IsVUFBRSxHQUFGLEVBQVc7QUFDdkMsWUFBTyxPQUFLLHVCQUFMLENBQThCLGFBQTlCLEVBQThDLElBQTlDLENBQW9ELFVBQUUsS0FBRixFQUFhO0FBQ3ZFLFVBQUksSUFBSixDQUFVLEtBQVY7O0FBRUEsYUFBTyxHQUFQOztBQUVEO0FBQ0MsTUFOTSxFQU1KLFlBQU07QUFDUixhQUFPLEdBQVA7QUFDQSxNQVJNLENBQVA7QUFTQSxLQVZNLENBQVA7QUFXQSxJQVpzQixFQVlwQixRQUFRLE9BQVIsQ0FBaUIsRUFBakIsQ0Fab0IsQ0FBdkI7O0FBY0EsVUFBTyxpQkFBaUIsSUFBakIsQ0FBdUIsVUFBRSxjQUFGLEVBQXNCO0FBQ25ELFFBQUssdUJBQVMsY0FBVCxFQUF5QixPQUFLLHVCQUE5QixDQUFMLEVBQStEO0FBQzlELFlBQUsscUJBQUwsR0FBNkIsS0FBN0I7QUFDQSxZQUFPLFFBQVEsT0FBUixFQUFQO0FBQ0E7QUFDRCxXQUFLLHVCQUFMLEdBQStCLGNBQS9COztBQUVBLFdBQU8sSUFBSSxPQUFKLENBQWEsVUFBRSxPQUFGLEVBQVcsTUFBWCxFQUF1QjtBQUMxQyxZQUFPLElBQVAsQ0FBYTtBQUNaLFlBQU0sTUFETTtBQUVaLFdBQUssT0FBSyxpQkFGRTtBQUdaLGtCQUFZLG9CQUFFLEdBQUYsRUFBVztBQUN0QixXQUFJLGdCQUFKLENBQXNCLFlBQXRCLEVBQW9DLE9BQUssTUFBekM7QUFDQSxPQUxXO0FBTVosWUFBTTtBQUNMO0FBQ0EsNEJBQXFCO0FBRmhCLE9BTk07QUFVWixnQkFBVSxNQVZFO0FBV1osZUFBUyxPQVhHO0FBWVosYUFBTztBQVpLLE1BQWIsRUFhSSxNQWJKLENBYVksWUFBTTtBQUNqQixhQUFLLElBQUwsQ0FBVyxxQkFBWCxFQUFrQyxjQUFsQzs7QUFFQSxhQUFLLHFCQUFMLEdBQTZCLEtBQTdCO0FBQ0EsTUFqQkQ7QUFrQkEsS0FuQk0sQ0FBUDtBQW9CQSxJQTNCTSxFQTJCSCxLQTNCRyxDQTJCSSxVQUFDLENBQUQsRUFBTyxDQUFFLENBM0JiLENBQVA7QUE0QkE7O0FBRUQ7Ozs7Ozs7OzswQ0FNeUIsYSxFQUFnQjtBQUFBOztBQUN4QyxPQUFJLFdBQVcsS0FBSyxNQUFMLENBQVksS0FBWixDQUFtQixjQUFjLGNBQWQsRUFBbkIsQ0FBZjtBQUNBLE9BQUssTUFBTSxRQUFYLEVBQXNCO0FBQ3JCLFdBQU8sUUFBUSxPQUFSLENBQWlCLFFBQWpCLENBQVA7QUFDQTs7QUFFRCxPQUFJLHFCQUFxQixJQUFJLE9BQUosQ0FBYSxVQUFFLE9BQUYsRUFBVyxNQUFYLEVBQXVCO0FBQzVELFdBQU8sSUFBUCxDQUFhO0FBQ1osV0FBTSxLQURNO0FBRVosVUFBSyxPQUFLLFFBQUwsR0FBZ0IsMEJBRlQ7QUFHWixpQkFBWSxvQkFBRSxHQUFGLEVBQVc7QUFDdEIsVUFBSSxnQkFBSixDQUFzQixZQUF0QixFQUFvQyxPQUFLLE1BQXpDO0FBQ0EsTUFMVztBQU1aLFdBQU07QUFDTCxZQUFNLGNBQWMsY0FBZDtBQURELE1BTk07QUFTWixlQUFVLE1BVEU7QUFVWixjQUFTLGlCQUFVLFFBQVYsRUFBcUI7QUFDN0IsY0FBUyxRQUFUO0FBQ0EsTUFaVztBQWFaLFlBQU8sZUFBVSxRQUFWLEVBQXFCO0FBQzNCLGFBQVEsUUFBUjtBQUNBO0FBZlcsS0FBYjtBQWlCQSxJQWxCd0IsQ0FBekI7O0FBb0JBLE9BQUksdUJBQXVCLG1CQUFtQixJQUFuQixDQUF5QixVQUFFLGlCQUFGLEVBQXlCO0FBQzVFLFFBQUssc0JBQXNCLElBQTNCLEVBQWtDO0FBQ2pDLFlBQU8sT0FBSyx1QkFBTCxDQUE4QixhQUE5QixDQUFQO0FBQ0E7O0FBRUQsV0FBTyxpQkFBUDtBQUNBLElBTjBCLENBQTNCOztBQVFBLFVBQU8scUJBQXFCLElBQXJCLENBQTJCLFVBQUUsaUJBQUYsRUFBeUI7QUFDMUQsV0FBSyxNQUFMLENBQVksS0FBWixDQUFtQixjQUFjLGNBQWQsRUFBbkIsRUFBbUQsa0JBQWtCLEVBQXJFOztBQUVBLFdBQU8sa0JBQWtCLEVBQXpCO0FBQ0EsSUFKTSxDQUFQO0FBS0E7O0FBRUQ7Ozs7Ozs7OzswQ0FNeUIsYSxFQUFnQjtBQUFBOztBQUN4QyxVQUFPLElBQUksT0FBSixDQUFhLFVBQUUsT0FBRixFQUFXLE1BQVgsRUFBdUI7QUFDMUMsV0FBTyxJQUFQLENBQWE7QUFDWixXQUFNLE1BRE07QUFFWixVQUFLLE9BQUssUUFBTCxHQUFnQiwyQkFGVDtBQUdaLGlCQUFZLG9CQUFFLEdBQUYsRUFBVztBQUN0QixVQUFJLGdCQUFKLENBQXNCLFlBQXRCLEVBQW9DLE9BQUssTUFBekM7QUFDQSxNQUxXO0FBTVosV0FBTTtBQUNMLFlBQU0sY0FBYyxjQUFkO0FBREQsTUFOTTtBQVNaLGVBQVUsTUFURTtBQVVaLGNBQVMsaUJBQVUsUUFBVixFQUFxQjtBQUM3QixjQUFTLFFBQVQ7QUFDQSxNQVpXO0FBYVosWUFBTyxlQUFVLFFBQVYsRUFBcUI7QUFDM0IsYUFBUSxRQUFSO0FBQ0E7QUFmVyxLQUFiO0FBaUJBLElBbEJNLENBQVA7QUFtQkE7Ozs7OztrQkFHYSxvQjs7Ozs7Ozs7Ozs7QUM5S2Y7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFJLGVBQWUsQ0FBRSxRQUFGLEVBQVksT0FBWixFQUFxQixTQUFyQixFQUFnQyxTQUFoQyxFQUEyQyxTQUEzQyxFQUF1RCxJQUF2RCxDQUE2RCxHQUE3RCxDQUFuQjs7QUFFQTs7OztJQUdNLG1COzs7QUFFTDs7Ozs7Ozs7Ozs7QUFXQSxvQ0FBb0k7QUFBQSxNQUFySCxVQUFxSCxRQUFySCxVQUFxSDtBQUFBLE1BQXpHLE9BQXlHLFFBQXpHLE9BQXlHO0FBQUEsTUFBaEcsS0FBZ0csUUFBaEcsS0FBZ0c7QUFBQSxNQUF6RixtQkFBeUYsUUFBekYsbUJBQXlGO0FBQUEsTUFBcEUsWUFBb0UsUUFBcEUsWUFBb0U7QUFBQSxtQ0FBdEQsa0JBQXNEO0FBQUEsTUFBdEQsa0JBQXNELHlDQUFqQyxJQUFpQztBQUFBLGlDQUEzQixjQUEyQjtBQUFBLE1BQTNCLGNBQTJCLHVDQUFWLEtBQVU7O0FBQUE7O0FBQUE7O0FBR25JLFFBQUssUUFBTCxHQUFnQixFQUFoQjtBQUNBLFFBQUssV0FBTCxHQUFtQixVQUFuQjtBQUNBLFFBQUssV0FBTCxHQUFtQixLQUFLLElBQUwsQ0FBVyxhQUFhLE1BQUssUUFBN0IsQ0FBbkI7QUFDQSxRQUFLLGVBQUwsR0FBdUIsQ0FBdkI7QUFDQSxRQUFLLFlBQUwsR0FBb0IsQ0FBcEI7QUFDQSxRQUFLLFFBQUwsR0FBZ0IsT0FBaEI7QUFDQSxRQUFLLE1BQUwsR0FBYyxLQUFkO0FBQ0EsUUFBSyxlQUFMLEdBQXVCLGNBQXZCO0FBQ0EsUUFBSyxvQkFBTCxHQUE0QixtQkFBNUI7QUFDQSxRQUFLLGFBQUwsR0FBcUIsWUFBckI7O0FBRUEsTUFBSyx1QkFBdUIsSUFBNUIsRUFBbUM7QUFDbEMsd0JBQXFCLGtDQUFyQjtBQUNBO0FBQ0QsUUFBSyxtQkFBTCxHQUEyQixrQkFBM0I7O0FBRUEsUUFBSyxXQUFMLEdBQW1CLE1BQUssV0FBTCxDQUFpQixJQUFqQixPQUFuQjtBQUNBLFFBQUssa0JBQUwsR0FBMEIsTUFBSyxrQkFBTCxDQUF3QixJQUF4QixPQUExQjtBQUNBLFFBQUssZUFBTCxHQUF1QixNQUFLLGVBQUwsQ0FBcUIsSUFBckIsT0FBdkI7QUFDQSxRQUFLLHVCQUFMLEdBQStCLE1BQUssdUJBQUwsQ0FBNkIsSUFBN0IsT0FBL0I7QUFDQSxRQUFLLFNBQUwsR0FBaUIsTUFBSyxTQUFMLENBQWUsSUFBZixPQUFqQjtBQXZCbUk7QUF3Qm5JOztBQUVEOzs7Ozs7Ozs7MEJBS1E7QUFDUCxRQUFLLFNBQUw7QUFDQTs7QUFFRDs7Ozs7Ozs7OEJBS1k7QUFBQTs7QUFDWCxPQUFJLE9BQU87QUFDVixVQUFNLEtBQUssWUFERDtBQUVWO0FBQ0EsY0FBVSxLQUFLLFFBSEw7QUFJVixZQUFRO0FBSkUsSUFBWDs7QUFPQSxPQUFLLENBQUUsS0FBSyxlQUFaLEVBQThCO0FBQzdCO0FBQ0EsU0FBSyxtQkFBTCxHQUEyQixLQUFLLG9CQUFoQztBQUNBOztBQUVELFVBQU8sSUFBUCxDQUFhO0FBQ1osVUFBTSxLQURNO0FBRVosU0FBSyxLQUFLLGFBRkU7QUFHWixnQkFBWSxvQkFBRSxHQUFGLEVBQVc7QUFDdEIsU0FBSSxnQkFBSixDQUFzQixZQUF0QixFQUFvQyxPQUFLLE1BQXpDO0FBQ0EsS0FMVztBQU1aLFVBQU0sSUFOTTtBQU9aLGNBQVUsTUFQRTtBQVFaLGFBQVMsS0FBSztBQVJGLElBQWI7QUFVQTs7QUFFRDs7Ozs7Ozs7O2tDQU1pQixRLEVBQVc7QUFBQTs7QUFDM0IsT0FBSSxrQkFBa0IsU0FBUyxNQUFULENBQWlCLFVBQUUsZUFBRixFQUFtQixJQUFuQixFQUE2QjtBQUNuRSxXQUFPLGdCQUFnQixJQUFoQixDQUFzQixZQUFNO0FBQ2xDLFlBQU8sT0FBSyxXQUFMLENBQWtCLElBQWxCLENBQVA7QUFDQSxLQUZNLENBQVA7QUFHQSxJQUpxQixFQUluQixRQUFRLE9BQVIsRUFKbUIsQ0FBdEI7O0FBTUEsbUJBQWdCLElBQWhCLENBQXNCLEtBQUssa0JBQTNCLEVBQWdELEtBQWhELENBQXVELEtBQUssa0JBQTVEO0FBQ0E7O0FBRUQ7Ozs7Ozs7O3VDQUtxQjtBQUNwQixRQUFLLElBQUwsQ0FBVyxlQUFYLEVBQTRCLEtBQUssWUFBakMsRUFBK0MsS0FBSyxXQUFwRDs7QUFFQSxPQUFLLEtBQUssWUFBTCxHQUFvQixLQUFLLFdBQTlCLEVBQTRDO0FBQzNDLFNBQUssWUFBTCxJQUFxQixDQUFyQjtBQUNBLFNBQUssU0FBTDtBQUNBLElBSEQsTUFHTztBQUNOLFNBQUssSUFBTCxDQUFXLFVBQVg7QUFDQTtBQUNEOztBQUVEOzs7Ozs7Ozs7OEJBTWEsSSxFQUFPO0FBQ25CLE9BQUksVUFBVSxLQUFLLE9BQUwsQ0FBYSxRQUEzQjs7QUFFQSxPQUFJLGlCQUFpQixxQ0FBa0IsT0FBbEIsQ0FBckI7O0FBRUEsT0FBSSx1QkFBdUIsbUNBQTBCO0FBQ3BELFlBQVEsS0FBSyxFQUR1QztBQUVwRCxhQUFTLEtBQUssUUFGc0M7QUFHcEQsV0FBTyxLQUFLLE1BSHdDO0FBSXBELFdBQU8sS0FBSyxtQkFKd0M7QUFLcEQsc0JBQWtCLEtBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsQ0FBakIsRUFBb0I7QUFMYyxJQUExQixDQUEzQjs7QUFRQSxVQUFPLHFCQUFxQixrQkFBckIsQ0FBeUMsY0FBekMsRUFBMEQsSUFBMUQsQ0FBZ0UsS0FBSyx1QkFBckUsRUFBOEYsS0FBSyx1QkFBbkcsQ0FBUDtBQUNBOztBQUVEOzs7Ozs7Ozs0Q0FLMEI7QUFDekIsUUFBSyxlQUFMLElBQXdCLENBQXhCOztBQUVBLFFBQUssSUFBTCxDQUFXLGVBQVgsRUFBNEIsS0FBSyxlQUFqQyxFQUFrRCxLQUFLLFdBQXZEO0FBQ0E7Ozs7OztrQkFHYSxtQjs7Ozs7QUN4SmY7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUxBOztBQU9BLElBQUksV0FBVywwQkFBMEIsSUFBekM7O0FBRUEsSUFBSSwwQkFBSjtBQUFBLElBQXVCLDJCQUF2QjtBQUNBLElBQUksMkJBQUo7O0FBRUE7Ozs7O0FBS0EsU0FBUyxnQkFBVCxHQUE0QjtBQUMzQixLQUFJLGtCQUFrQixPQUFRLDRDQUFSLENBQXRCO0FBQ0EsS0FBSSxVQUFVLFNBQVMsT0FBVCxDQUFpQixJQUEvQjs7QUFFQSxRQUFPLElBQUksT0FBSixDQUFhLFVBQUUsT0FBRixFQUFlO0FBQ2xDLE1BQUksbUJBQW1CLGtDQUE4QjtBQUNwRCxlQUFZLFNBQVMsTUFBVCxDQUFnQixLQUR3QjtBQUVwRCxtQkFBZ0IsSUFGb0M7QUFHcEQsWUFBUyxPQUgyQztBQUlwRCxVQUFPLFNBQVMsT0FBVCxDQUFpQixLQUo0QjtBQUtwRCx3QkFBcUIsU0FBUyxRQUxzQjtBQU1wRCxpQkFBYyxVQUFVLGNBTjRCO0FBT3BEO0FBUG9ELEdBQTlCLENBQXZCOztBQVVBLG1CQUFpQixFQUFqQixDQUFxQixlQUFyQixFQUFzQyxVQUFFLFNBQUYsRUFBaUI7QUFDdEQsbUJBQWdCLElBQWhCLENBQXNCLFNBQXRCO0FBQ0EsR0FGRDs7QUFJQSxtQkFBaUIsS0FBakI7O0FBRUE7QUFDQSxtQkFBaUIsRUFBakIsQ0FBcUIsVUFBckIsRUFBaUMsT0FBakM7QUFDQSxFQW5CTSxDQUFQO0FBb0JBOztBQUVEOzs7OztBQUtBLFNBQVMsZ0JBQVQsR0FBNEI7QUFDM0IsS0FBSSxrQkFBa0IsT0FBUSxrREFBUixDQUF0QjtBQUNBLEtBQUksVUFBVSxTQUFTLE9BQVQsQ0FBaUIsSUFBL0I7O0FBRUEsUUFBTyxJQUFJLE9BQUosQ0FBYSxVQUFFLE9BQUYsRUFBZTtBQUNsQyxNQUFJLG1CQUFtQixrQ0FBOEI7QUFDcEQsZUFBWSxTQUFTLFdBQVQsQ0FBcUIsS0FEbUI7QUFFcEQsbUJBQWdCLElBRm9DO0FBR3BELFlBQVMsT0FIMkM7QUFJcEQsVUFBTyxTQUFTLE9BQVQsQ0FBaUIsS0FKNEI7QUFLcEQsd0JBQXFCLFNBQVMsUUFMc0I7QUFNcEQsaUJBQWMsVUFBVSxjQU40QjtBQU9wRDtBQVBvRCxHQUE5QixDQUF2Qjs7QUFVQSxtQkFBaUIsRUFBakIsQ0FBcUIsZUFBckIsRUFBc0MsVUFBRSxTQUFGLEVBQWlCO0FBQ3RELG1CQUFnQixJQUFoQixDQUFzQixTQUF0QjtBQUNBLEdBRkQ7O0FBSUEsbUJBQWlCLEtBQWpCOztBQUVBO0FBQ0EsbUJBQWlCLEVBQWpCLENBQXFCLFVBQXJCLEVBQWlDLE9BQWpDO0FBQ0EsRUFuQk0sQ0FBUDtBQW9CQTs7QUFFRDs7Ozs7QUFLQSxTQUFTLGNBQVQsR0FBMEI7QUFDekIsbUJBQWtCLElBQWxCO0FBQ0Esb0JBQW1CLElBQW5CO0FBQ0E7O0FBRUQ7Ozs7O0FBS0EsU0FBUyxrQkFBVCxHQUE4QjtBQUM3QixtQkFBa0IsSUFBbEI7O0FBRUEsS0FBSSxVQUFVLHNCQUFhLEVBQUUsU0FBUyxTQUFTLE9BQVQsQ0FBaUIsSUFBNUIsRUFBa0MsT0FBTyxTQUFTLE9BQVQsQ0FBaUIsS0FBMUQsRUFBYixDQUFkOztBQUVBLHNCQUFxQixrQ0FBckI7QUFDQSxLQUFJLFlBQVksMENBQWlDLEVBQUUsT0FBTyxrQkFBVCxFQUE2QixTQUFTLE9BQXRDLEVBQWpDLENBQWhCOztBQUVBLFdBQVUsUUFBVixHQUNFLElBREYsQ0FDUSxnQkFEUixFQUVFLElBRkYsQ0FFUSxnQkFGUixFQUdFLElBSEYsQ0FHUSxjQUhSO0FBSUE7O0FBRUQ7Ozs7O0FBS0EsU0FBUyxJQUFULEdBQWdCO0FBQ2YsUUFBUSwwQ0FBUixFQUFxRCxFQUFyRCxDQUF5RCxPQUF6RCxFQUFrRSxZQUFXO0FBQzVFOztBQUVBLFNBQVEsSUFBUixFQUFlLElBQWY7QUFDQSxFQUpEOztBQU1BLHFCQUFvQixPQUFRLG9DQUFSLENBQXBCO0FBQ0EsbUJBQWtCLElBQWxCOztBQUVBLHNCQUFxQixPQUFRLHFDQUFSLENBQXJCO0FBQ0Esb0JBQW1CLElBQW5CO0FBQ0E7O0FBRUQsT0FBUSxJQUFSOzs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN2NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQSBoZWxwZXIgY2xhc3MgdG8gZG8gQUpBWCByZXF1ZXN0cyB0byB0aGUgUkVTVCBBUEkuXG4gKi9cbmNsYXNzIFJlc3RBcGkge1xuXG5cdC8qKlxuXHQgKiBDb25zdHJ1Y3RzIGEgUmVzdEFwaSByZXF1ZXN0IGhlbHBlciBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSByb290VXJsIFRoZSByb290IFVSTCBvZiB0aGUgUkVTVCBBUEkuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBub25jZSBUaGUgbm9uY2UgdG8gYXV0aGVudGljYXRlIHRvIHRoZSBSRVNUIEFQSSB1c2luZyBjb29raWVzLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoIHsgcm9vdFVybCwgbm9uY2UgfSApIHtcblx0XHR0aGlzLl9yb290VXJsID0gcm9vdFVybDtcblx0XHR0aGlzLl9ub25jZSA9IG5vbmNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIERvZXMgYSBHRVQgcmVxdWVzdCB0byB0aGUgUkVTVCBBUElcblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHBhdGggVGhlIHBhdGggdG8gZG8gdGhlIHJlcXVlc3QgdG8uXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgVGhlIHBhcmFtZXRlcnMgdG8gdXNlIGZvciBqUXVlcnkuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBSZXNvbHZlcyB3aGVuIHRoZSBBSkFYIHJlcXVlc3QgaXMgY29tcGxldGUuXG5cdCAqL1xuXHRnZXQoIHBhdGgsIHBhcmFtcyApIHtcblx0XHRwYXJhbXMgPSBPYmplY3QuYXNzaWduKCBwYXJhbXMsIHtcblx0XHRcdHR5cGU6IFwiR0VUXCIsXG5cdFx0XHR1cmw6IHRoaXMuX3Jvb3RVcmwgKyBwYXRoLFxuXHRcdH0gKTtcblxuXHRcdHJldHVybiB0aGlzLnJlcXVlc3QoIHBhcmFtcyApO1xuXHR9XG5cblx0LyoqXG5cdCAqIERvZXMgYSBQT1NUIHJlcXVlc3QgdG8gdGhlIFJFU1QgQVBJXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIFRoZSBwYXRoIHRvIGRvIHRoZSByZXF1ZXN0IHRvLlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIFRoZSBwYXJhbWV0ZXJzIHRvIHVzZSBmb3IgalF1ZXJ5LlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gUmVzb2x2ZXMgd2hlbiB0aGUgQUpBWCByZXF1ZXN0IGlzIGNvbXBsZXRlLlxuXHQgKi9cblx0cG9zdCggcGF0aCwgcGFyYW1zICkge1xuXHRcdHBhcmFtcyA9IE9iamVjdC5hc3NpZ24oIHBhcmFtcywge1xuXHRcdFx0dHlwZTogXCJQT1NUXCIsXG5cdFx0XHR1cmw6IHRoaXMuX3Jvb3RVcmwgKyBwYXRoLFxuXHRcdH0gKTtcblxuXHRcdHJldHVybiB0aGlzLnJlcXVlc3QoIHBhcmFtcyApO1xuXHR9XG5cblx0LyoqXG5cdCAqIERvIGEgcmVxdWVzdCB0byB0aGUgUkVTVCBBUElcblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyBUaGUgcGFyYW1zIHRvIHVzZSBmb3IgalF1ZXJ5LlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gUmVzb2x2ZXMgd2hlbiB0aGUgQUpBWCByZXF1ZXN0IGlzIGNvbXBsZXRlLlxuXHQgKi9cblx0cmVxdWVzdCggcGFyYW1zICkge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG5cdFx0XHRwYXJhbXMgPSBPYmplY3QuYXNzaWduKCBwYXJhbXMsIHtcblx0XHRcdFx0YmVmb3JlU2VuZDogKCB4aHIgKSA9PiB7XG5cdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoIFwiWC1XUC1Ob25jZVwiLCB0aGlzLl9ub25jZSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxuXHRcdFx0XHRlcnJvcjogcmVqZWN0LFxuXHRcdFx0fSApO1xuXG5cdFx0XHRqUXVlcnkuYWpheCggcGFyYW1zICk7XG5cdFx0fSApO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlc3RBcGk7XG5cblxuIiwiLyoqXG4gKiBBIGtleSB2YWx1ZSBzdG9yZSBmb3IgcHJvbWluZW50IHdvcmRzIHRvIHRoZWlyIHJlc3BlY3RpdmUgSURzLlxuICovXG5jbGFzcyBQcm9taW5lbnRXb3JkQ2FjaGUge1xuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSBpbml0aWFsIGNhY2hlLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5fY2FjaGUgPSB7fTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBJRCBnaXZlbiB0aGUgbmFtZSwgb3IgMCBpZiBub3QgZm91bmQgaW4gdGhlIGNhY2hlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgcHJvbWluZW50IHdvcmQuXG5cdCAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBJRCBvZiB0aGUgcHJvbWluZW50IHdvcmQuXG5cdCAqL1xuXHRnZXRJRCggbmFtZSApIHtcblx0XHRpZiAoIHRoaXMuX2NhY2hlLmhhc093blByb3BlcnR5KCBuYW1lICkgKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fY2FjaGVbIG5hbWUgXTtcblx0XHR9XG5cblx0XHRyZXR1cm4gMDtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSBJRCBmb3IgYSBnaXZlbiBuYW1lLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgcHJvbWluZW50IHdvcmQuXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBpZCBUaGUgSUQgb2YgdGhlIHByb21pbmVudCB3b3JkLlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdHNldElEKCBuYW1lLCBpZCApIHtcblx0XHR0aGlzLl9jYWNoZVsgbmFtZSBdID0gaWQ7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJvbWluZW50V29yZENhY2hlO1xuIiwiaW1wb3J0IHVuZXNjYXBlIGZyb20gXCJsb2Rhc2gvdW5lc2NhcGVcIjtcblxuLyoqXG4gKiBQb3B1bGF0ZXMgYSBwcm9taW5lbnQgd29yZCBjYWNoZSB3aXRoIGRhdGEgZnJvbSB0aGUgc2VydmVyLlxuICovXG5jbGFzcyBQcm9taW5lbnRXb3JkQ2FjaGVQb3B1bGF0b3Ige1xuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSBpbnN0YW5jZSBhdHRyaWJ1dGVzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge1Byb21pbmVudFdvcmRDYWNoZX0gY2FjaGUgVGhlIGNhY2hlIHRvIHBvcHVsYXRlLlxuXHQgKiBAcGFyYW0ge1Jlc3RBcGl9IHJlc3RBcGkgVGhlIFJFU1QgQVBJIG9iamVjdCB0byBkbyByZXF1ZXN0cyB3aXRoLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoIHsgY2FjaGUsIHJlc3RBcGkgfSApIHtcblx0XHR0aGlzLl9jYWNoZSA9IGNhY2hlO1xuXHRcdHRoaXMuX3Jlc3RBcGkgPSByZXN0QXBpO1xuXHRcdHRoaXMuX2N1cnJlbnRQYWdlID0gMTtcblxuXHRcdHRoaXMucHJvY2Vzc1Byb21pbmVudFdvcmQgPSB0aGlzLnByb2Nlc3NQcm9taW5lbnRXb3JkLmJpbmQoIHRoaXMgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQb3B1bGF0ZXMgdGhlIHByb21pbmVudCB3b3JkIGNhY2hlIHdpdGggZGF0YSBmcm9tIHRoZSBzZXJ2ZXIuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBSZXNvbHZlcyB3aGVuIHRoZSBjYWNoZSBoYXMgYmVlbiBwb3B1bGF0ZWQuXG5cdCAqL1xuXHRwb3B1bGF0ZSgpIHtcblx0XHRsZXQgZGF0YSA9IHtcblx0XHRcdHBlcl9wYWdlOiAxMDAsXG5cdFx0XHRwYWdlOiB0aGlzLl9jdXJyZW50UGFnZSxcblx0XHR9O1xuXG5cdFx0cmV0dXJuIHRoaXMuX3Jlc3RBcGkuZ2V0KCBcIndwL3YyL3lzdF9wcm9taW5lbnRfd29yZHNcIiwgeyBkYXRhIH0gKS50aGVuKCAoIHJlc3VsdCApID0+IHtcblx0XHRcdGlmICggcmVzdWx0Lmxlbmd0aCA9PT0gMCApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXN1bHQuZm9yRWFjaCggdGhpcy5wcm9jZXNzUHJvbWluZW50V29yZCApO1xuXG5cdFx0XHR0aGlzLl9jdXJyZW50UGFnZSArPSAxO1xuXG5cdFx0XHRyZXR1cm4gdGhpcy5wb3B1bGF0ZSgpO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTYXZlcyBhIHByb21pbmVudCB3b3JkIHRvIHRoZSBjYWNoZS5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHByb21pbmVudFdvcmQgVGhlIHByb21pbmVudCB3b3JkIHRvIHNhdmUgdG8gdGhlIGNhY2hlLlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdHByb2Nlc3NQcm9taW5lbnRXb3JkKCBwcm9taW5lbnRXb3JkICkge1xuXHRcdGxldCBuYW1lID0gdW5lc2NhcGUoIHByb21pbmVudFdvcmQubmFtZSApO1xuXG5cdFx0dGhpcy5fY2FjaGUuc2V0SUQoIG5hbWUsIHByb21pbmVudFdvcmQuaWQgKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBQcm9taW5lbnRXb3JkQ2FjaGVQb3B1bGF0b3I7XG4iLCJpbXBvcnQgUHJvbWluZW50V29yZENhY2hlIGZyb20gXCIuL1Byb21pbmVudFdvcmRDYWNoZVwiO1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tIFwiZXZlbnRzXCI7XG5pbXBvcnQgaXNFcXVhbCBmcm9tIFwibG9kYXNoL2lzRXF1YWxcIjtcblxuLyoqXG4gKiBIYW5kbGVzIHRoZSByZXRyaWV2YWwgYW5kIHN0b3JhZ2Ugb2YgZm9jdXMga2V5d29yZCBzdWdnZXN0aW9uc1xuICovXG5jbGFzcyBQcm9taW5lbnRXb3JkU3RvcmFnZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cdC8qKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gcm9vdFVybCBUaGUgcm9vdCBVUkwgb2YgdGhlIFdQIFJFU1QgQVBJLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbm9uY2UgVGhlIFdvcmRQcmVzcyBub25jZSByZXF1aXJlZCB0byBzYXZlIGFueXRoaW5nIHRvIHRoZSBSRVNUIEFQSSBlbmRwb2ludHMuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBwb3N0U2F2ZUVuZHBvaW50IFRoZSBlbmRwb2ludCB0byB1c2UgdG8gc2F2ZSB0aGUgcG9zdC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHBvc3RUeXBlQmFzZSBUaGUgYmFzZSBvZiB0aGUgcG9zdCB0eXBlIHRvIHVzZSBpbiB0aGUgUkVTVCBBUEkgVVJMLlxuXHQgKiBAcGFyYW0ge251bWJlcn0gcG9zdElEIFRoZSBwb3N0SUQgb2YgdGhlIHBvc3QgdG8gc2F2ZSBwcm9taW5lbnQgd29yZHMgZm9yLlxuXHQgKiBAcGFyYW0ge1Byb21pbmVudFdvcmRDYWNoZX0gY2FjaGUgVGhlIGNhY2hlIHRvIHVzZSBmb3IgdGhlIHByb21pbmVudCB3b3JkIHRlcm0gSURzLlxuXHQgKi9cblx0Y29uc3RydWN0b3IoIHsgcG9zdElELCByb290VXJsLCBub25jZSwgcG9zdFNhdmVFbmRwb2ludCA9IFwiXCIsIHBvc3RUeXBlQmFzZSA9IG51bGwsIGNhY2hlID0gbnVsbCB9ICkge1xuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLl9yb290VXJsID0gcm9vdFVybDtcblx0XHR0aGlzLl9ub25jZSA9IG5vbmNlO1xuXHRcdHRoaXMuX3Bvc3RJRCA9IHBvc3RJRDtcblx0XHR0aGlzLl9zYXZpbmdQcm9taW5lbnRXb3JkcyA9IGZhbHNlO1xuXHRcdHRoaXMuX3ByZXZpb3VzUHJvbWluZW50V29yZHMgPSBudWxsO1xuXG5cdFx0dGhpcy5fcG9zdFNhdmVFbmRwb2ludCA9IHBvc3RTYXZlRW5kcG9pbnQ7XG5cdFx0aWYgKCBwb3N0VHlwZUJhc2UgIT09IG51bGwgKSB7XG5cdFx0XHR0aGlzLl9wb3N0U2F2ZUVuZHBvaW50ID0gdGhpcy5fcm9vdFVybCArIFwid3AvdjIvXCIgKyBwb3N0VHlwZUJhc2UgKyBcIi9cIiArIHRoaXMuX3Bvc3RJRDtcblx0XHR9XG5cblx0XHRpZiAoIGNhY2hlID09PSBudWxsICkge1xuXHRcdFx0Y2FjaGUgPSBuZXcgUHJvbWluZW50V29yZENhY2hlKCk7XG5cdFx0fVxuXHRcdHRoaXMuX2NhY2hlID0gY2FjaGU7XG5cblx0XHR0aGlzLnJldHJpZXZlUHJvbWluZW50V29yZElkID0gdGhpcy5yZXRyaWV2ZVByb21pbmVudFdvcmRJZC5iaW5kKCB0aGlzICk7XG5cdH1cblxuXHQvKipcblx0ICogU2F2ZXMgcHJvbWluZW50IHdvcmRzIHRvIHRoZSBkYXRhYmFzZSB1c2luZyBBSkFYXG5cdCAqXG5cdCAqIEBwYXJhbSB7V29yZENvbWJpbmF0aW9uW119IHByb21pbmVudFdvcmRzIFRoZSBwcm9taW5lbnQgd29yZHMgdG8gc2F2ZS5cblx0ICogQHJldHVybnMge1Byb21pc2V9IFJlc29sdmVzIHdoZW4gdGhlIHByb21pbmVudCB3b3JkcyBhcmUgc2F2ZWQuXG5cdCAqL1xuXHRzYXZlUHJvbWluZW50V29yZHMoIHByb21pbmVudFdvcmRzICkge1xuXHRcdC8vIElmIHRoZXJlIGlzIGFscmVhZHkgYSBzYXZlIHNlcXVlbmNlIGluIHByb2dyZXNzLCBkb24ndCBkbyBpdCBhZ2Fpbi5cblx0XHRpZiAoIHRoaXMuX3NhdmluZ1Byb21pbmVudFdvcmRzICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0aGlzLl9zYXZpbmdQcm9taW5lbnRXb3JkcyA9IHRydWU7XG5cblx0XHRsZXQgZmlyc3RUd2VudHlXb3JkcyA9IHByb21pbmVudFdvcmRzLnNsaWNlKCAwLCAyMCApO1xuXG5cdFx0Ly8gUmV0cmlldmUgSURzIG9mIGFsbCBwcm9taW5lbnQgd29yZCB0ZXJtcywgYnV0IGRvIGl0IGluIHNlcXVlbmNlIHRvIHByZXZlbnQgb3ZlcmxvYWRpbmcgc2VydmVycy5cblx0XHRsZXQgcHJvbWluZW50V29yZElkcyA9IGZpcnN0VHdlbnR5V29yZHMucmVkdWNlKCAoIHByZXZpb3VzUHJvbWlzZSwgcHJvbWluZW50V29yZCApID0+IHtcblx0XHRcdHJldHVybiBwcmV2aW91c1Byb21pc2UudGhlbiggKCBpZHMgKSA9PiB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnJldHJpZXZlUHJvbWluZW50V29yZElkKCBwcm9taW5lbnRXb3JkICkudGhlbiggKCBuZXdJZCApID0+IHtcblx0XHRcdFx0XHRpZHMucHVzaCggbmV3SWQgKTtcblxuXHRcdFx0XHRcdHJldHVybiBpZHM7XG5cblx0XHRcdFx0Ly8gT24gZXJyb3IsIGp1c3QgY29udGludWUgd2l0aCB0aGUgb3RoZXIgdGVybXMuXG5cdFx0XHRcdH0sICgpID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gaWRzO1xuXHRcdFx0XHR9ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSwgUHJvbWlzZS5yZXNvbHZlKCBbXSApICk7XG5cblx0XHRyZXR1cm4gcHJvbWluZW50V29yZElkcy50aGVuKCAoIHByb21pbmVudFdvcmRzICkgPT4ge1xuXHRcdFx0aWYgKCBpc0VxdWFsKCBwcm9taW5lbnRXb3JkcywgdGhpcy5fcHJldmlvdXNQcm9taW5lbnRXb3JkcyApICkge1xuXHRcdFx0XHR0aGlzLl9zYXZpbmdQcm9taW5lbnRXb3JkcyA9IGZhbHNlO1xuXHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9wcmV2aW91c1Byb21pbmVudFdvcmRzID0gcHJvbWluZW50V29yZHM7XG5cblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG5cdFx0XHRcdGpRdWVyeS5hamF4KCB7XG5cdFx0XHRcdFx0dHlwZTogXCJQT1NUXCIsXG5cdFx0XHRcdFx0dXJsOiB0aGlzLl9wb3N0U2F2ZUVuZHBvaW50LFxuXHRcdFx0XHRcdGJlZm9yZVNlbmQ6ICggeGhyICkgPT4ge1xuXHRcdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoIFwiWC1XUC1Ob25jZVwiLCB0aGlzLl9ub25jZSApO1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNhbWVsY2FzZVxuXHRcdFx0XHRcdFx0eXN0X3Byb21pbmVudF93b3JkczogcHJvbWluZW50V29yZHMsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRkYXRhVHlwZTogXCJqc29uXCIsXG5cdFx0XHRcdFx0c3VjY2VzczogcmVzb2x2ZSxcblx0XHRcdFx0XHRlcnJvcjogcmVqZWN0LFxuXHRcdFx0XHR9ICkuYWx3YXlzKCAoKSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5lbWl0KCBcInNhdmVkUHJvbWluZW50V29yZHNcIiwgcHJvbWluZW50V29yZHMgKTtcblxuXHRcdFx0XHRcdHRoaXMuX3NhdmluZ1Byb21pbmVudFdvcmRzID0gZmFsc2U7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH0gKTtcblx0XHR9ICkuY2F0Y2goIChlKSA9PiB7fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgSUQgb2YgYSBwcm9taXNlXG5cdCAqXG5cdCAqIEBwYXJhbSB7V29yZENvbWJpbmF0aW9ufSBwcm9taW5lbnRXb3JkIFRoZSBwcm9taW5lbnQgd29yZCB0byByZXRyaWV2ZSB0aGUgSUQgZm9yLlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gUmVzb2x2ZXMgdG8gdGhlIElEIG9mIHRoZSBwcm9taW5lbnQgd29yZCB0ZXJtLlxuXHQgKi9cblx0cmV0cmlldmVQcm9taW5lbnRXb3JkSWQoIHByb21pbmVudFdvcmQgKSB7XG5cdFx0bGV0IGNhY2hlZElkID0gdGhpcy5fY2FjaGUuZ2V0SUQoIHByb21pbmVudFdvcmQuZ2V0Q29tYmluYXRpb24oKSApO1xuXHRcdGlmICggMCAhPT0gY2FjaGVkSWQgKSB7XG5cdFx0XHRyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCBjYWNoZWRJZCApO1xuXHRcdH1cblxuXHRcdGxldCBmb3VuZFByb21pbmVudFdvcmQgPSBuZXcgUHJvbWlzZSggKCByZXNvbHZlLCByZWplY3QgKSA9PiB7XG5cdFx0XHRqUXVlcnkuYWpheCgge1xuXHRcdFx0XHR0eXBlOiBcIkdFVFwiLFxuXHRcdFx0XHR1cmw6IHRoaXMuX3Jvb3RVcmwgKyBcInlvYXN0L3YxL3Byb21pbmVudF93b3Jkc1wiLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiAoIHhociApID0+IHtcblx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggXCJYLVdQLU5vbmNlXCIsIHRoaXMuX25vbmNlICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHR3b3JkOiBwcm9taW5lbnRXb3JkLmdldENvbWJpbmF0aW9uKCksXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRhdGFUeXBlOiBcImpzb25cIixcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0XHRcdHJlc29sdmUoIHJlc3BvbnNlICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGVycm9yOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHRcdFx0cmVqZWN0KCByZXNwb25zZSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0fSApO1xuXHRcdH0gKTtcblxuXHRcdGxldCBjcmVhdGVkUHJvbWluZW50V29yZCA9IGZvdW5kUHJvbWluZW50V29yZC50aGVuKCAoIHByb21pbmVudFdvcmRUZXJtICkgPT4ge1xuXHRcdFx0aWYgKCBwcm9taW5lbnRXb3JkVGVybSA9PT0gbnVsbCApIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMuY3JlYXRlUHJvbWluZW50V29yZFRlcm0oIHByb21pbmVudFdvcmQgKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHByb21pbmVudFdvcmRUZXJtO1xuXHRcdH0gKTtcblxuXHRcdHJldHVybiBjcmVhdGVkUHJvbWluZW50V29yZC50aGVuKCAoIHByb21pbmVudFdvcmRUZXJtICkgPT4ge1xuXHRcdFx0dGhpcy5fY2FjaGUuc2V0SUQoIHByb21pbmVudFdvcmQuZ2V0Q29tYmluYXRpb24oKSwgcHJvbWluZW50V29yZFRlcm0uaWQgKTtcblxuXHRcdFx0cmV0dXJuIHByb21pbmVudFdvcmRUZXJtLmlkO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgdGVybSBmb3IgYSBwcm9taW5lbnQgd29yZFxuXHQgKlxuXHQgKiBAcGFyYW0ge1dvcmRDb21iaW5hdGlvbn0gcHJvbWluZW50V29yZCBUaGUgcHJvbWluZW50IHdvcmQgdG8gY3JlYXRlIGEgdGVybSBmb3IuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBBIHByb21pc2UgdGhhdCByZXNvbHZlcyB3aGVuIGEgdGVybSBoYXMgYmVlbiBjcmVhdGVkIGFuZCByZXNvbHZlcyB3aXRoIHRoZSBJRCBvZiB0aGUgbmV3bHkgY3JlYXRlZCB0ZXJtLlxuXHQgKi9cblx0Y3JlYXRlUHJvbWluZW50V29yZFRlcm0oIHByb21pbmVudFdvcmQgKSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcblx0XHRcdGpRdWVyeS5hamF4KCB7XG5cdFx0XHRcdHR5cGU6IFwiUE9TVFwiLFxuXHRcdFx0XHR1cmw6IHRoaXMuX3Jvb3RVcmwgKyBcIndwL3YyL3lzdF9wcm9taW5lbnRfd29yZHNcIixcblx0XHRcdFx0YmVmb3JlU2VuZDogKCB4aHIgKSA9PiB7XG5cdFx0XHRcdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoIFwiWC1XUC1Ob25jZVwiLCB0aGlzLl9ub25jZSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0bmFtZTogcHJvbWluZW50V29yZC5nZXRDb21iaW5hdGlvbigpLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRkYXRhVHlwZTogXCJqc29uXCIsXG5cdFx0XHRcdHN1Y2Nlc3M6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdFx0XHRyZXNvbHZlKCByZXNwb25zZSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRlcnJvcjogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0XHRcdHJlamVjdCggcmVzcG9uc2UgKTtcblx0XHRcdFx0fSxcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJvbWluZW50V29yZFN0b3JhZ2U7XG4iLCJpbXBvcnQgeyBnZXRSZWxldmFudFdvcmRzIH0gZnJvbSBcInlvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3NpbmcvcmVsZXZhbnRXb3Jkc1wiO1xuaW1wb3J0IFByb21pbmVudFdvcmRTdG9yYWdlIGZyb20gXCIuL1Byb21pbmVudFdvcmRTdG9yYWdlXCI7XG5pbXBvcnQgUHJvbWluZW50V29yZENhY2hlIGZyb20gXCIuL1Byb21pbmVudFdvcmRDYWNoZVwiO1xuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tIFwiZXZlbnRzXCI7XG5cbmxldCBwb3N0U3RhdHVzZXMgPSBbIFwiZnV0dXJlXCIsIFwiZHJhZnRcIiwgXCJwZW5kaW5nXCIsIFwicHJpdmF0ZVwiLCBcInB1Ymxpc2hcIiBdLmpvaW4oIFwiLFwiICk7XG5cbi8qKlxuICogQ2FsY3VsYXRlcyBwcm9taW5lbnQgd29yZHMgZm9yIGFsbCBwb3N0cyBvbiB0aGUgc2l0ZS5cbiAqL1xuY2xhc3MgU2l0ZVdpZGVDYWxjdWxhdGlvbiBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cblx0LyoqXG5cdCAqIENvbnN0cnVjdHMgYSBjYWxjdWxhdGlvbiBvYmplY3QuXG5cdCAqXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVjYWxjdWxhdGVBbGwgV2hldGhlciB0byBjYWxjdWxhdGUgYWxsIHBvc3RzIG9yIG9ubHkgcG9zdHMgd2l0aG91dCBwcm9taW5lbnQgd29yZHMuXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB0b3RhbFBvc3RzIFRoZSBhbW91bnQgb2YgcG9zdHMgdG8gY2FsY3VsYXRlIHByb21pbmVudCB3b3JkcyBmb3IuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSByb290VXJsIFRoZSByb290IFJFU1QgQVBJIFVSTC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG5vbmNlIFRoZSBub25jZSB0byB1c2Ugd2hlbiB1c2luZyB0aGUgUkVTVCBBUEkuXG5cdCAqIEBwYXJhbSB7bnVtYmVyW119IGFsbFByb21pbmVudFdvcmRJZHMgQSBsaXN0IG9mIGFsbCBwcm9taW5lbnQgd29yZCBJRHMgcHJlc2VudCBvbiB0aGUgc2l0ZS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGxpc3RFbmRwb2ludCBUaGUgZW5kcG9pbnQgdG8gY2FsbCB3aGVuIHJldHJpZXZpbmcgcG9zdHMgb3IgcGFnZXMuXG5cdCAqIEBwYXJhbSB7UHJvbWluZW50V29yZENhY2hlfSBwcm9taW5lbnRXb3JkQ2FjaGUgVGhlIGNhY2hlIGZvciBwcm9taW5lbnQgd29yZHMuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvciggeyB0b3RhbFBvc3RzLCByb290VXJsLCBub25jZSwgYWxsUHJvbWluZW50V29yZElkcywgbGlzdEVuZHBvaW50LCBwcm9taW5lbnRXb3JkQ2FjaGUgPSBudWxsLCByZWNhbGN1bGF0ZUFsbCA9IGZhbHNlIH0gKSB7XG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuX3BlclBhZ2UgPSAxMDtcblx0XHR0aGlzLl90b3RhbFBvc3RzID0gdG90YWxQb3N0cztcblx0XHR0aGlzLl90b3RhbFBhZ2VzID0gTWF0aC5jZWlsKCB0b3RhbFBvc3RzIC8gdGhpcy5fcGVyUGFnZSApO1xuXHRcdHRoaXMuX3Byb2Nlc3NlZFBvc3RzID0gMDtcblx0XHR0aGlzLl9jdXJyZW50UGFnZSA9IDE7XG5cdFx0dGhpcy5fcm9vdFVybCA9IHJvb3RVcmw7XG5cdFx0dGhpcy5fbm9uY2UgPSBub25jZTtcblx0XHR0aGlzLl9yZWNhbGN1bGF0ZUFsbCA9IHJlY2FsY3VsYXRlQWxsO1xuXHRcdHRoaXMuX2FsbFByb21pbmVudFdvcmRJZHMgPSBhbGxQcm9taW5lbnRXb3JkSWRzO1xuXHRcdHRoaXMuX2xpc3RFbmRwb2ludCA9IGxpc3RFbmRwb2ludDtcblxuXHRcdGlmICggcHJvbWluZW50V29yZENhY2hlID09PSBudWxsICkge1xuXHRcdFx0cHJvbWluZW50V29yZENhY2hlID0gbmV3IFByb21pbmVudFdvcmRDYWNoZSgpO1xuXHRcdH1cblx0XHR0aGlzLl9wcm9taW5lbnRXb3JkQ2FjaGUgPSBwcm9taW5lbnRXb3JkQ2FjaGU7XG5cblx0XHR0aGlzLnByb2Nlc3NQb3N0ID0gdGhpcy5wcm9jZXNzUG9zdC5iaW5kKCB0aGlzICk7XG5cdFx0dGhpcy5jb250aW51ZVByb2Nlc3NpbmcgPSB0aGlzLmNvbnRpbnVlUHJvY2Vzc2luZy5iaW5kKCB0aGlzICk7XG5cdFx0dGhpcy5wcm9jZXNzUmVzcG9uc2UgPSB0aGlzLnByb2Nlc3NSZXNwb25zZS5iaW5kKCB0aGlzICk7XG5cdFx0dGhpcy5pbmNyZW1lbnRQcm9jZXNzZWRQb3N0cyA9IHRoaXMuaW5jcmVtZW50UHJvY2Vzc2VkUG9zdHMuYmluZCggdGhpcyApO1xuXHRcdHRoaXMuY2FsY3VsYXRlID0gdGhpcy5jYWxjdWxhdGUuYmluZCggdGhpcyApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFN0YXJ0cyBjYWxjdWxhdGluZyBwcm9taW5lbnQgd29yZHMuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0c3RhcnQoKSB7XG5cdFx0dGhpcy5jYWxjdWxhdGUoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBEb2VzIGEgY2FsY3VsYXRpb24gc3RlcCBmb3IgdGhlIGN1cnJlbnQgcGFnZS5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRjYWxjdWxhdGUoKSB7XG5cdFx0bGV0IGRhdGEgPSB7XG5cdFx0XHRwYWdlOiB0aGlzLl9jdXJyZW50UGFnZSxcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjYW1lbGNhc2Vcblx0XHRcdHBlcl9wYWdlOiB0aGlzLl9wZXJQYWdlLFxuXHRcdFx0c3RhdHVzOiBwb3N0U3RhdHVzZXMsXG5cdFx0fTtcblxuXHRcdGlmICggISB0aGlzLl9yZWNhbGN1bGF0ZUFsbCApIHtcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBjYW1lbGNhc2Vcblx0XHRcdGRhdGEueXN0X3Byb21pbmVudF93b3JkcyA9IHRoaXMuX2FsbFByb21pbmVudFdvcmRJZHM7XG5cdFx0fVxuXG5cdFx0alF1ZXJ5LmFqYXgoIHtcblx0XHRcdHR5cGU6IFwiR0VUXCIsXG5cdFx0XHR1cmw6IHRoaXMuX2xpc3RFbmRwb2ludCxcblx0XHRcdGJlZm9yZVNlbmQ6ICggeGhyICkgPT4ge1xuXHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggXCJYLVdQLU5vbmNlXCIsIHRoaXMuX25vbmNlICk7XG5cdFx0XHR9LFxuXHRcdFx0ZGF0YTogZGF0YSxcblx0XHRcdGRhdGFUeXBlOiBcImpzb25cIixcblx0XHRcdHN1Y2Nlc3M6IHRoaXMucHJvY2Vzc1Jlc3BvbnNlLFxuXHRcdH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBQcm9jZXNzIHJlc3BvbnNlIGZyb20gdGhlIGluZGV4IHJlcXVlc3QgZm9yIHBvc3RzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0FycmF5fSByZXNwb25zZSBUaGUgbGlzdCBvZiBmb3VuZCBwb3N0cyBmcm9tIHRoZSBzZXJ2ZXIuXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0cHJvY2Vzc1Jlc3BvbnNlKCByZXNwb25zZSApIHtcblx0XHRsZXQgcHJvY2Vzc1Byb21pc2VzID0gcmVzcG9uc2UucmVkdWNlKCAoIHByZXZpb3VzUHJvbWlzZSwgcG9zdCApID0+IHtcblx0XHRcdHJldHVybiBwcmV2aW91c1Byb21pc2UudGhlbiggKCkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5wcm9jZXNzUG9zdCggcG9zdCApO1xuXHRcdFx0fSApO1xuXHRcdH0sIFByb21pc2UucmVzb2x2ZSgpICk7XG5cblx0XHRwcm9jZXNzUHJvbWlzZXMudGhlbiggdGhpcy5jb250aW51ZVByb2Nlc3NpbmcgKS5jYXRjaCggdGhpcy5jb250aW51ZVByb2Nlc3NpbmcgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDb250aW51ZXMgcHJvY2Vzc2luZyBieSBnb2luZyB0byB0aGUgbmV4dCBwYWdlIGlmIHRoZXJlIGlzIG9uZS5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRjb250aW51ZVByb2Nlc3NpbmcoKSB7XG5cdFx0dGhpcy5lbWl0KCBcInByb2Nlc3NlZFBhZ2VcIiwgdGhpcy5fY3VycmVudFBhZ2UsIHRoaXMuX3RvdGFsUGFnZXMgKTtcblxuXHRcdGlmICggdGhpcy5fY3VycmVudFBhZ2UgPCB0aGlzLl90b3RhbFBhZ2VzICkge1xuXHRcdFx0dGhpcy5fY3VycmVudFBhZ2UgKz0gMTtcblx0XHRcdHRoaXMuY2FsY3VsYXRlKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuZW1pdCggXCJjb21wbGV0ZVwiICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFByb2Nlc3NlcyBhIHBvc3QgcmV0dXJuZWQgZnJvbSB0aGUgUkVTVCBBUEkuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBwb3N0IEEgcG9zdCBvYmplY3Qgd2l0aCByZW5kZXJlZCBjb250ZW50LlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gUmVzb2x2ZXMgd2hlbiB0aGUgcHJvbWluZW50IHdvcmRzIGFyZSBzYXZlZCBmb3IgdGhlIHBvc3QuXG5cdCAqL1xuXHRwcm9jZXNzUG9zdCggcG9zdCApIHtcblx0XHRsZXQgY29udGVudCA9IHBvc3QuY29udGVudC5yZW5kZXJlZDtcblxuXHRcdGxldCBwcm9taW5lbnRXb3JkcyA9IGdldFJlbGV2YW50V29yZHMoIGNvbnRlbnQgKTtcblxuXHRcdGxldCBwcm9taW5lbnRXb3JkU3RvcmFnZSA9IG5ldyBQcm9taW5lbnRXb3JkU3RvcmFnZSgge1xuXHRcdFx0cG9zdElEOiBwb3N0LmlkLFxuXHRcdFx0cm9vdFVybDogdGhpcy5fcm9vdFVybCxcblx0XHRcdG5vbmNlOiB0aGlzLl9ub25jZSxcblx0XHRcdGNhY2hlOiB0aGlzLl9wcm9taW5lbnRXb3JkQ2FjaGUsXG5cdFx0XHRwb3N0U2F2ZUVuZHBvaW50OiBwb3N0Ll9saW5rcy5zZWxmWzBdLmhyZWYsXG5cdFx0fSApO1xuXG5cdFx0cmV0dXJuIHByb21pbmVudFdvcmRTdG9yYWdlLnNhdmVQcm9taW5lbnRXb3JkcyggcHJvbWluZW50V29yZHMgKS50aGVuKCB0aGlzLmluY3JlbWVudFByb2Nlc3NlZFBvc3RzLCB0aGlzLmluY3JlbWVudFByb2Nlc3NlZFBvc3RzICk7XG5cdH1cblxuXHQvKipcblx0ICogSW5jcmVtZW50cyB0aGUgYW1vdW50IG9mIHByb2Nlc3NlZCBwb3N0cyBieSBvbmUuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0aW5jcmVtZW50UHJvY2Vzc2VkUG9zdHMoKSB7XG5cdFx0dGhpcy5fcHJvY2Vzc2VkUG9zdHMgKz0gMTtcblxuXHRcdHRoaXMuZW1pdCggXCJwcm9jZXNzZWRQb3N0XCIsIHRoaXMuX3Byb2Nlc3NlZFBvc3RzLCB0aGlzLl90b3RhbFBvc3RzICk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2l0ZVdpZGVDYWxjdWxhdGlvbjtcbiIsIi8qIGdsb2JhbCB5b2FzdFNpdGVXaWRlQW5hbHlzaXNEYXRhICovXG5cbmltcG9ydCBQcm9taW5lbnRXb3JkQ2FsY3VsYXRpb24gZnJvbSBcIi4va2V5d29yZFN1Z2dlc3Rpb25zL3NpdGVXaWRlQ2FsY3VsYXRpb25cIjtcbmltcG9ydCBQcm9taW5lbnRXb3JkQ2FjaGUgZnJvbSBcIi4va2V5d29yZFN1Z2dlc3Rpb25zL1Byb21pbmVudFdvcmRDYWNoZVwiO1xuaW1wb3J0IFByb21pbmVudFdvcmRDYWNoZVBvcHVsYXRvciBmcm9tIFwiLi9rZXl3b3JkU3VnZ2VzdGlvbnMvUHJvbWluZW50V29yZENhY2hlUG9wdWxhdG9yXCI7XG5pbXBvcnQgUmVzdEFwaSBmcm9tIFwiLi9oZWxwZXJzL3Jlc3RBcGlcIjtcblxubGV0IHNldHRpbmdzID0geW9hc3RTaXRlV2lkZUFuYWx5c2lzRGF0YS5kYXRhO1xuXG5sZXQgcHJvZ3Jlc3NDb250YWluZXIsIGNvbXBsZXRlZENvbnRhaW5lcjtcbmxldCBwcm9taW5lbnRXb3JkQ2FjaGU7XG5cbi8qKlxuICogUmVjYWxjdWxhdGVzIHBvc3RzXG4gKlxuICogQHJldHVybnMge1Byb21pc2V9IFJlc29sdmVzIHdoZW4gd2UgaGF2ZSByZWNhbGN1bGF0ZWQgcG9zdHMuXG4gKi9cbmZ1bmN0aW9uIHJlY2FsY3VsYXRlUG9zdHMoKSB7XG5cdGxldCBwcm9ncmVzc0VsZW1lbnQgPSBqUXVlcnkoIFwiLnlvYXN0LWpzLXByb21pbmVudC13b3Jkcy1wcm9ncmVzcy1jdXJyZW50XCIgKTtcblx0bGV0IHJvb3RVcmwgPSBzZXR0aW5ncy5yZXN0QXBpLnJvb3Q7XG5cblx0cmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUgKSA9PiB7XG5cdFx0bGV0IHBvc3RzQ2FsY3VsYXRpb24gPSBuZXcgUHJvbWluZW50V29yZENhbGN1bGF0aW9uKCB7XG5cdFx0XHR0b3RhbFBvc3RzOiBzZXR0aW5ncy5hbW91bnQudG90YWwsXG5cdFx0XHRyZWNhbGN1bGF0ZUFsbDogdHJ1ZSxcblx0XHRcdHJvb3RVcmw6IHJvb3RVcmwsXG5cdFx0XHRub25jZTogc2V0dGluZ3MucmVzdEFwaS5ub25jZSxcblx0XHRcdGFsbFByb21pbmVudFdvcmRJZHM6IHNldHRpbmdzLmFsbFdvcmRzLFxuXHRcdFx0bGlzdEVuZHBvaW50OiByb290VXJsICsgXCJ3cC92Mi9wb3N0cy9cIixcblx0XHRcdHByb21pbmVudFdvcmRDYWNoZSxcblx0XHR9ICk7XG5cblx0XHRwb3N0c0NhbGN1bGF0aW9uLm9uKCBcInByb2Nlc3NlZFBvc3RcIiwgKCBwb3N0Q291bnQgKSA9PiB7XG5cdFx0XHRwcm9ncmVzc0VsZW1lbnQuaHRtbCggcG9zdENvdW50ICk7XG5cdFx0fSApO1xuXG5cdFx0cG9zdHNDYWxjdWxhdGlvbi5zdGFydCgpO1xuXG5cdFx0Ly8gRnJlZSB1cCB0aGUgdmFyaWFibGUgdG8gc3RhcnQgYW5vdGhlciByZWNhbGN1bGF0aW9uLlxuXHRcdHBvc3RzQ2FsY3VsYXRpb24ub24oIFwiY29tcGxldGVcIiwgcmVzb2x2ZSApO1xuXHR9ICk7XG59XG5cbi8qKlxuICogUmVjYWxjdWxhdGVzIHBhZ2VzXG4gKlxuICogQHJldHVybnMge1Byb21pc2V9IFJlc29sdmVzIHdoZW4gd2UgaGF2ZSByZWNhbGN1bGF0ZWQgcGFnZXMuXG4gKi9cbmZ1bmN0aW9uIHJlY2FsY3VsYXRlUGFnZXMoKSB7XG5cdGxldCBwcm9ncmVzc0VsZW1lbnQgPSBqUXVlcnkoIFwiLnlvYXN0LWpzLXByb21pbmVudC13b3Jkcy1wYWdlcy1wcm9ncmVzcy1jdXJyZW50XCIgKTtcblx0bGV0IHJvb3RVcmwgPSBzZXR0aW5ncy5yZXN0QXBpLnJvb3Q7XG5cblx0cmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUgKSA9PiB7XG5cdFx0bGV0IHBhZ2VzQ2FsY3VsYXRpb24gPSBuZXcgUHJvbWluZW50V29yZENhbGN1bGF0aW9uKCB7XG5cdFx0XHR0b3RhbFBvc3RzOiBzZXR0aW5ncy5hbW91bnRQYWdlcy50b3RhbCxcblx0XHRcdHJlY2FsY3VsYXRlQWxsOiB0cnVlLFxuXHRcdFx0cm9vdFVybDogcm9vdFVybCxcblx0XHRcdG5vbmNlOiBzZXR0aW5ncy5yZXN0QXBpLm5vbmNlLFxuXHRcdFx0YWxsUHJvbWluZW50V29yZElkczogc2V0dGluZ3MuYWxsV29yZHMsXG5cdFx0XHRsaXN0RW5kcG9pbnQ6IHJvb3RVcmwgKyBcIndwL3YyL3BhZ2VzL1wiLFxuXHRcdFx0cHJvbWluZW50V29yZENhY2hlLFxuXHRcdH0gKTtcblxuXHRcdHBhZ2VzQ2FsY3VsYXRpb24ub24oIFwicHJvY2Vzc2VkUG9zdFwiLCAoIHBvc3RDb3VudCApID0+IHtcblx0XHRcdHByb2dyZXNzRWxlbWVudC5odG1sKCBwb3N0Q291bnQgKTtcblx0XHR9ICk7XG5cblx0XHRwYWdlc0NhbGN1bGF0aW9uLnN0YXJ0KCk7XG5cblx0XHQvLyBGcmVlIHVwIHRoZSB2YXJpYWJsZSB0byBzdGFydCBhbm90aGVyIHJlY2FsY3VsYXRpb24uXG5cdFx0cGFnZXNDYWxjdWxhdGlvbi5vbiggXCJjb21wbGV0ZVwiLCByZXNvbHZlICk7XG5cdH0gKTtcbn1cblxuLyoqXG4gKiBTaG93cyBjb21wbGV0aW9uIHRvIHRoZSB1c2VyXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIHNob3dDb21wbGV0aW9uKCkge1xuXHRwcm9ncmVzc0NvbnRhaW5lci5oaWRlKCk7XG5cdGNvbXBsZXRlZENvbnRhaW5lci5zaG93KCk7XG59XG5cbi8qKlxuICogU3RhcnQgcmVjYWxjdWxhdGluZy5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gc3RhcnRSZWNhbGN1bGF0aW5nKCkge1xuXHRwcm9ncmVzc0NvbnRhaW5lci5zaG93KCk7XG5cblx0bGV0IHJlc3RBcGkgPSBuZXcgUmVzdEFwaSggeyByb290VXJsOiBzZXR0aW5ncy5yZXN0QXBpLnJvb3QsIG5vbmNlOiBzZXR0aW5ncy5yZXN0QXBpLm5vbmNlIH0gKTtcblxuXHRwcm9taW5lbnRXb3JkQ2FjaGUgPSBuZXcgUHJvbWluZW50V29yZENhY2hlKCk7XG5cdGxldCBwb3B1bGF0b3IgPSBuZXcgUHJvbWluZW50V29yZENhY2hlUG9wdWxhdG9yKCB7IGNhY2hlOiBwcm9taW5lbnRXb3JkQ2FjaGUsIHJlc3RBcGk6IHJlc3RBcGkgfSApO1xuXG5cdHBvcHVsYXRvci5wb3B1bGF0ZSgpXG5cdFx0LnRoZW4oIHJlY2FsY3VsYXRlUG9zdHMgKVxuXHRcdC50aGVuKCByZWNhbGN1bGF0ZVBhZ2VzIClcblx0XHQudGhlbiggc2hvd0NvbXBsZXRpb24gKTtcbn1cblxuLyoqXG4gKiBJbml0aWFsaXplcyB0aGUgc2l0ZSB3aWRlIGFuYWx5c2lzIHRhYi5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gaW5pdCgpIHtcblx0alF1ZXJ5KCBcIi55b2FzdC1qcy1jYWxjdWxhdGUtcHJvbWluZW50LXdvcmRzLS1hbGxcIiApLm9uKCBcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuXHRcdHN0YXJ0UmVjYWxjdWxhdGluZygpO1xuXG5cdFx0alF1ZXJ5KCB0aGlzICkuaGlkZSgpO1xuXHR9ICk7XG5cblx0cHJvZ3Jlc3NDb250YWluZXIgPSBqUXVlcnkoIFwiLnlvYXN0LWpzLXByb21pbmVudC13b3Jkcy1wcm9ncmVzc1wiICk7XG5cdHByb2dyZXNzQ29udGFpbmVyLmhpZGUoKTtcblxuXHRjb21wbGV0ZWRDb250YWluZXIgPSBqUXVlcnkoIFwiLnlvYXN0LWpzLXByb21pbmVudC13b3Jkcy1jb21wbGV0ZWRcIiApO1xuXHRjb21wbGV0ZWRDb250YWluZXIuaGlkZSgpO1xufVxuXG5qUXVlcnkoIGluaXQgKTtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuJyk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGFyZ3MgPSBuZXcgQXJyYXkobGVuIC0gMSk7XG4gICAgZm9yIChpID0gMTsgaSA8IGxlbjsgaSsrKVxuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG5cbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICB2YXIgbTtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2Uge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIWVtaXR0ZXIuX2V2ZW50cyB8fCAhZW1pdHRlci5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IDA7XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24oZW1pdHRlci5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSAxO1xuICBlbHNlXG4gICAgcmV0ID0gZW1pdHRlci5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcbiAgcmV0dXJuIHJldDtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgRGF0YVZpZXcgPSBnZXROYXRpdmUocm9vdCwgJ0RhdGFWaWV3Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0YVZpZXc7XG4iLCJ2YXIgaGFzaENsZWFyID0gcmVxdWlyZSgnLi9faGFzaENsZWFyJyksXG4gICAgaGFzaERlbGV0ZSA9IHJlcXVpcmUoJy4vX2hhc2hEZWxldGUnKSxcbiAgICBoYXNoR2V0ID0gcmVxdWlyZSgnLi9faGFzaEdldCcpLFxuICAgIGhhc2hIYXMgPSByZXF1aXJlKCcuL19oYXNoSGFzJyksXG4gICAgaGFzaFNldCA9IHJlcXVpcmUoJy4vX2hhc2hTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgaGFzaCBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIEhhc2goZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgSGFzaGAuXG5IYXNoLnByb3RvdHlwZS5jbGVhciA9IGhhc2hDbGVhcjtcbkhhc2gucHJvdG90eXBlWydkZWxldGUnXSA9IGhhc2hEZWxldGU7XG5IYXNoLnByb3RvdHlwZS5nZXQgPSBoYXNoR2V0O1xuSGFzaC5wcm90b3R5cGUuaGFzID0gaGFzaEhhcztcbkhhc2gucHJvdG90eXBlLnNldCA9IGhhc2hTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gSGFzaDtcbiIsInZhciBsaXN0Q2FjaGVDbGVhciA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZUNsZWFyJyksXG4gICAgbGlzdENhY2hlRGVsZXRlID0gcmVxdWlyZSgnLi9fbGlzdENhY2hlRGVsZXRlJyksXG4gICAgbGlzdENhY2hlR2V0ID0gcmVxdWlyZSgnLi9fbGlzdENhY2hlR2V0JyksXG4gICAgbGlzdENhY2hlSGFzID0gcmVxdWlyZSgnLi9fbGlzdENhY2hlSGFzJyksXG4gICAgbGlzdENhY2hlU2V0ID0gcmVxdWlyZSgnLi9fbGlzdENhY2hlU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBsaXN0IGNhY2hlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTGlzdENhY2hlKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYExpc3RDYWNoZWAuXG5MaXN0Q2FjaGUucHJvdG90eXBlLmNsZWFyID0gbGlzdENhY2hlQ2xlYXI7XG5MaXN0Q2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IGxpc3RDYWNoZURlbGV0ZTtcbkxpc3RDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbGlzdENhY2hlR2V0O1xuTGlzdENhY2hlLnByb3RvdHlwZS5oYXMgPSBsaXN0Q2FjaGVIYXM7XG5MaXN0Q2FjaGUucHJvdG90eXBlLnNldCA9IGxpc3RDYWNoZVNldDtcblxubW9kdWxlLmV4cG9ydHMgPSBMaXN0Q2FjaGU7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIE1hcCA9IGdldE5hdGl2ZShyb290LCAnTWFwJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gTWFwO1xuIiwidmFyIG1hcENhY2hlQ2xlYXIgPSByZXF1aXJlKCcuL19tYXBDYWNoZUNsZWFyJyksXG4gICAgbWFwQ2FjaGVEZWxldGUgPSByZXF1aXJlKCcuL19tYXBDYWNoZURlbGV0ZScpLFxuICAgIG1hcENhY2hlR2V0ID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVHZXQnKSxcbiAgICBtYXBDYWNoZUhhcyA9IHJlcXVpcmUoJy4vX21hcENhY2hlSGFzJyksXG4gICAgbWFwQ2FjaGVTZXQgPSByZXF1aXJlKCcuL19tYXBDYWNoZVNldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXAgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTWFwQ2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPT0gbnVsbCA/IDAgOiBlbnRyaWVzLmxlbmd0aDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTWFwQ2FjaGVgLlxuTWFwQ2FjaGUucHJvdG90eXBlLmNsZWFyID0gbWFwQ2FjaGVDbGVhcjtcbk1hcENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBtYXBDYWNoZURlbGV0ZTtcbk1hcENhY2hlLnByb3RvdHlwZS5nZXQgPSBtYXBDYWNoZUdldDtcbk1hcENhY2hlLnByb3RvdHlwZS5oYXMgPSBtYXBDYWNoZUhhcztcbk1hcENhY2hlLnByb3RvdHlwZS5zZXQgPSBtYXBDYWNoZVNldDtcblxubW9kdWxlLmV4cG9ydHMgPSBNYXBDYWNoZTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgUHJvbWlzZSA9IGdldE5hdGl2ZShyb290LCAnUHJvbWlzZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb21pc2U7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFNldCA9IGdldE5hdGl2ZShyb290LCAnU2V0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0O1xuIiwidmFyIE1hcENhY2hlID0gcmVxdWlyZSgnLi9fTWFwQ2FjaGUnKSxcbiAgICBzZXRDYWNoZUFkZCA9IHJlcXVpcmUoJy4vX3NldENhY2hlQWRkJyksXG4gICAgc2V0Q2FjaGVIYXMgPSByZXF1aXJlKCcuL19zZXRDYWNoZUhhcycpO1xuXG4vKipcbiAqXG4gKiBDcmVhdGVzIGFuIGFycmF5IGNhY2hlIG9iamVjdCB0byBzdG9yZSB1bmlxdWUgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFt2YWx1ZXNdIFRoZSB2YWx1ZXMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIFNldENhY2hlKHZhbHVlcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcyA9PSBudWxsID8gMCA6IHZhbHVlcy5sZW5ndGg7XG5cbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBNYXBDYWNoZTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB0aGlzLmFkZCh2YWx1ZXNbaW5kZXhdKTtcbiAgfVxufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgU2V0Q2FjaGVgLlxuU2V0Q2FjaGUucHJvdG90eXBlLmFkZCA9IFNldENhY2hlLnByb3RvdHlwZS5wdXNoID0gc2V0Q2FjaGVBZGQ7XG5TZXRDYWNoZS5wcm90b3R5cGUuaGFzID0gc2V0Q2FjaGVIYXM7XG5cbm1vZHVsZS5leHBvcnRzID0gU2V0Q2FjaGU7XG4iLCJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyksXG4gICAgc3RhY2tDbGVhciA9IHJlcXVpcmUoJy4vX3N0YWNrQ2xlYXInKSxcbiAgICBzdGFja0RlbGV0ZSA9IHJlcXVpcmUoJy4vX3N0YWNrRGVsZXRlJyksXG4gICAgc3RhY2tHZXQgPSByZXF1aXJlKCcuL19zdGFja0dldCcpLFxuICAgIHN0YWNrSGFzID0gcmVxdWlyZSgnLi9fc3RhY2tIYXMnKSxcbiAgICBzdGFja1NldCA9IHJlcXVpcmUoJy4vX3N0YWNrU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN0YWNrIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIFN0YWNrKGVudHJpZXMpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IExpc3RDYWNoZShlbnRyaWVzKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgU3RhY2tgLlxuU3RhY2sucHJvdG90eXBlLmNsZWFyID0gc3RhY2tDbGVhcjtcblN0YWNrLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBzdGFja0RlbGV0ZTtcblN0YWNrLnByb3RvdHlwZS5nZXQgPSBzdGFja0dldDtcblN0YWNrLnByb3RvdHlwZS5oYXMgPSBzdGFja0hhcztcblN0YWNrLnByb3RvdHlwZS5zZXQgPSBzdGFja1NldDtcblxubW9kdWxlLmV4cG9ydHMgPSBTdGFjaztcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBTeW1ib2wgPSByb290LlN5bWJvbDtcblxubW9kdWxlLmV4cG9ydHMgPSBTeW1ib2w7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgVWludDhBcnJheSA9IHJvb3QuVWludDhBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBVaW50OEFycmF5O1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBXZWFrTWFwID0gZ2V0TmF0aXZlKHJvb3QsICdXZWFrTWFwJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gV2Vha01hcDtcbiIsIi8qKlxuICogQSBmYXN0ZXIgYWx0ZXJuYXRpdmUgdG8gYEZ1bmN0aW9uI2FwcGx5YCwgdGhpcyBmdW5jdGlvbiBpbnZva2VzIGBmdW5jYFxuICogd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgYHRoaXNBcmdgIGFuZCB0aGUgYXJndW1lbnRzIG9mIGBhcmdzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaW52b2tlLlxuICogQHBhcmFtIHsqfSB0aGlzQXJnIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzIFRoZSBhcmd1bWVudHMgdG8gaW52b2tlIGBmdW5jYCB3aXRoLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc3VsdCBvZiBgZnVuY2AuXG4gKi9cbmZ1bmN0aW9uIGFwcGx5KGZ1bmMsIHRoaXNBcmcsIGFyZ3MpIHtcbiAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnKTtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgfVxuICByZXR1cm4gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcHBseTtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmZvckVhY2hgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheUVhY2goYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoaXRlcmF0ZWUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpID09PSBmYWxzZSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUVhY2g7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5maWx0ZXJgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBmaWx0ZXJlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYXJyYXlGaWx0ZXIoYXJyYXksIHByZWRpY2F0ZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzSW5kZXggPSAwLFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgcmVzdWx0W3Jlc0luZGV4KytdID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlGaWx0ZXI7XG4iLCJ2YXIgYmFzZUluZGV4T2YgPSByZXF1aXJlKCcuL19iYXNlSW5kZXhPZicpO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5pbmNsdWRlc2AgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBzcGVjaWZ5aW5nIGFuIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSB0YXJnZXQgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHRhcmdldGAgaXMgZm91bmQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlJbmNsdWRlcyhhcnJheSwgdmFsdWUpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoO1xuICByZXR1cm4gISFsZW5ndGggJiYgYmFzZUluZGV4T2YoYXJyYXksIHZhbHVlLCAwKSA+IC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5SW5jbHVkZXM7XG4iLCIvKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgbGlrZSBgYXJyYXlJbmNsdWRlc2AgZXhjZXB0IHRoYXQgaXQgYWNjZXB0cyBhIGNvbXBhcmF0b3IuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IHRhcmdldCBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbXBhcmF0b3IgVGhlIGNvbXBhcmF0b3IgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdGFyZ2V0YCBpcyBmb3VuZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBhcnJheUluY2x1ZGVzV2l0aChhcnJheSwgdmFsdWUsIGNvbXBhcmF0b3IpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChjb21wYXJhdG9yKHZhbHVlLCBhcnJheVtpbmRleF0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5SW5jbHVkZXNXaXRoO1xuIiwidmFyIGJhc2VUaW1lcyA9IHJlcXVpcmUoJy4vX2Jhc2VUaW1lcycpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0J1ZmZlciA9IHJlcXVpcmUoJy4vaXNCdWZmZXInKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi9faXNJbmRleCcpLFxuICAgIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vaXNUeXBlZEFycmF5Jyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiB0aGUgYXJyYXktbGlrZSBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5oZXJpdGVkIFNwZWNpZnkgcmV0dXJuaW5nIGluaGVyaXRlZCBwcm9wZXJ0eSBuYW1lcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TGlrZUtleXModmFsdWUsIGluaGVyaXRlZCkge1xuICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKSxcbiAgICAgIGlzQXJnID0gIWlzQXJyICYmIGlzQXJndW1lbnRzKHZhbHVlKSxcbiAgICAgIGlzQnVmZiA9ICFpc0FyciAmJiAhaXNBcmcgJiYgaXNCdWZmZXIodmFsdWUpLFxuICAgICAgaXNUeXBlID0gIWlzQXJyICYmICFpc0FyZyAmJiAhaXNCdWZmICYmIGlzVHlwZWRBcnJheSh2YWx1ZSksXG4gICAgICBza2lwSW5kZXhlcyA9IGlzQXJyIHx8IGlzQXJnIHx8IGlzQnVmZiB8fCBpc1R5cGUsXG4gICAgICByZXN1bHQgPSBza2lwSW5kZXhlcyA/IGJhc2VUaW1lcyh2YWx1ZS5sZW5ndGgsIFN0cmluZykgOiBbXSxcbiAgICAgIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XG5cbiAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgaWYgKChpbmhlcml0ZWQgfHwgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwga2V5KSkgJiZcbiAgICAgICAgIShza2lwSW5kZXhlcyAmJiAoXG4gICAgICAgICAgIC8vIFNhZmFyaSA5IGhhcyBlbnVtZXJhYmxlIGBhcmd1bWVudHMubGVuZ3RoYCBpbiBzdHJpY3QgbW9kZS5cbiAgICAgICAgICAga2V5ID09ICdsZW5ndGgnIHx8XG4gICAgICAgICAgIC8vIE5vZGUuanMgMC4xMCBoYXMgZW51bWVyYWJsZSBub24taW5kZXggcHJvcGVydGllcyBvbiBidWZmZXJzLlxuICAgICAgICAgICAoaXNCdWZmICYmIChrZXkgPT0gJ29mZnNldCcgfHwga2V5ID09ICdwYXJlbnQnKSkgfHxcbiAgICAgICAgICAgLy8gUGhhbnRvbUpTIDIgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gdHlwZWQgYXJyYXlzLlxuICAgICAgICAgICAoaXNUeXBlICYmIChrZXkgPT0gJ2J1ZmZlcicgfHwga2V5ID09ICdieXRlTGVuZ3RoJyB8fCBrZXkgPT0gJ2J5dGVPZmZzZXQnKSkgfHxcbiAgICAgICAgICAgLy8gU2tpcCBpbmRleCBwcm9wZXJ0aWVzLlxuICAgICAgICAgICBpc0luZGV4KGtleSwgbGVuZ3RoKVxuICAgICAgICApKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUxpa2VLZXlzO1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8ubWFwYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWVcbiAqIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBtYXBwZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TWFwKGFycmF5LCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheU1hcDtcbiIsIi8qKlxuICogQXBwZW5kcyB0aGUgZWxlbWVudHMgb2YgYHZhbHVlc2AgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIGFwcGVuZC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheVB1c2goYXJyYXksIHZhbHVlcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGgsXG4gICAgICBvZmZzZXQgPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhcnJheVtvZmZzZXQgKyBpbmRleF0gPSB2YWx1ZXNbaW5kZXhdO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheVB1c2g7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5zb21lYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWVcbiAqIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFueSBlbGVtZW50IHBhc3NlcyB0aGUgcHJlZGljYXRlIGNoZWNrLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlTb21lKGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5U29tZTtcbiIsInZhciBiYXNlQXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19iYXNlQXNzaWduVmFsdWUnKSxcbiAgICBlcSA9IHJlcXVpcmUoJy4vZXEnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBBc3NpZ25zIGB2YWx1ZWAgdG8gYGtleWAgb2YgYG9iamVjdGAgaWYgdGhlIGV4aXN0aW5nIHZhbHVlIGlzIG5vdCBlcXVpdmFsZW50XG4gKiB1c2luZyBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogZm9yIGVxdWFsaXR5IGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICB2YXIgb2JqVmFsdWUgPSBvYmplY3Rba2V5XTtcbiAgaWYgKCEoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYgZXEob2JqVmFsdWUsIHZhbHVlKSkgfHxcbiAgICAgICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmICEoa2V5IGluIG9iamVjdCkpKSB7XG4gICAgYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NpZ25WYWx1ZTtcbiIsInZhciBlcSA9IHJlcXVpcmUoJy4vZXEnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgYGtleWAgaXMgZm91bmQgaW4gYGFycmF5YCBvZiBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSBrZXkgVGhlIGtleSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYXNzb2NJbmRleE9mKGFycmF5LCBrZXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgaWYgKGVxKGFycmF5W2xlbmd0aF1bMF0sIGtleSkpIHtcbiAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NvY0luZGV4T2Y7XG4iLCJ2YXIgZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19kZWZpbmVQcm9wZXJ0eScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBhc3NpZ25WYWx1ZWAgYW5kIGBhc3NpZ25NZXJnZVZhbHVlYCB3aXRob3V0XG4gKiB2YWx1ZSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5ID09ICdfX3Byb3RvX18nICYmIGRlZmluZVByb3BlcnR5KSB7XG4gICAgZGVmaW5lUHJvcGVydHkob2JqZWN0LCBrZXksIHtcbiAgICAgICdjb25maWd1cmFibGUnOiB0cnVlLFxuICAgICAgJ2VudW1lcmFibGUnOiB0cnVlLFxuICAgICAgJ3ZhbHVlJzogdmFsdWUsXG4gICAgICAnd3JpdGFibGUnOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VBc3NpZ25WYWx1ZTtcbiIsInZhciBiYXNlRm9yT3duID0gcmVxdWlyZSgnLi9fYmFzZUZvck93bicpLFxuICAgIGNyZWF0ZUJhc2VFYWNoID0gcmVxdWlyZSgnLi9fY3JlYXRlQmFzZUVhY2gnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JFYWNoYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fSBSZXR1cm5zIGBjb2xsZWN0aW9uYC5cbiAqL1xudmFyIGJhc2VFYWNoID0gY3JlYXRlQmFzZUVhY2goYmFzZUZvck93bik7XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUVhY2g7XG4iLCJ2YXIgYmFzZUVhY2ggPSByZXF1aXJlKCcuL19iYXNlRWFjaCcpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZpbHRlcmAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZpbHRlcmVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBiYXNlRmlsdGVyKGNvbGxlY3Rpb24sIHByZWRpY2F0ZSkge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIGJhc2VFYWNoKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikge1xuICAgIGlmIChwcmVkaWNhdGUodmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKSkge1xuICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZpbHRlcjtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZmluZEluZGV4YCBhbmQgYF8uZmluZExhc3RJbmRleGAgd2l0aG91dFxuICogc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tSW5kZXggVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBiYXNlRmluZEluZGV4KGFycmF5LCBwcmVkaWNhdGUsIGZyb21JbmRleCwgZnJvbVJpZ2h0KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBpbmRleCA9IGZyb21JbmRleCArIChmcm9tUmlnaHQgPyAxIDogLTEpO1xuXG4gIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHtcbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGaW5kSW5kZXg7XG4iLCJ2YXIgYXJyYXlQdXNoID0gcmVxdWlyZSgnLi9fYXJyYXlQdXNoJyksXG4gICAgaXNGbGF0dGVuYWJsZSA9IHJlcXVpcmUoJy4vX2lzRmxhdHRlbmFibGUnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mbGF0dGVuYCB3aXRoIHN1cHBvcnQgZm9yIHJlc3RyaWN0aW5nIGZsYXR0ZW5pbmcuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBmbGF0dGVuLlxuICogQHBhcmFtIHtudW1iZXJ9IGRlcHRoIFRoZSBtYXhpbXVtIHJlY3Vyc2lvbiBkZXB0aC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3ByZWRpY2F0ZT1pc0ZsYXR0ZW5hYmxlXSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNTdHJpY3RdIFJlc3RyaWN0IHRvIHZhbHVlcyB0aGF0IHBhc3MgYHByZWRpY2F0ZWAgY2hlY2tzLlxuICogQHBhcmFtIHtBcnJheX0gW3Jlc3VsdD1bXV0gVGhlIGluaXRpYWwgcmVzdWx0IHZhbHVlLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZmxhdHRlbmVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBiYXNlRmxhdHRlbihhcnJheSwgZGVwdGgsIHByZWRpY2F0ZSwgaXNTdHJpY3QsIHJlc3VsdCkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICBwcmVkaWNhdGUgfHwgKHByZWRpY2F0ZSA9IGlzRmxhdHRlbmFibGUpO1xuICByZXN1bHQgfHwgKHJlc3VsdCA9IFtdKTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcbiAgICBpZiAoZGVwdGggPiAwICYmIHByZWRpY2F0ZSh2YWx1ZSkpIHtcbiAgICAgIGlmIChkZXB0aCA+IDEpIHtcbiAgICAgICAgLy8gUmVjdXJzaXZlbHkgZmxhdHRlbiBhcnJheXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICAgICAgYmFzZUZsYXR0ZW4odmFsdWUsIGRlcHRoIC0gMSwgcHJlZGljYXRlLCBpc1N0cmljdCwgcmVzdWx0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFycmF5UHVzaChyZXN1bHQsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCFpc1N0cmljdCkge1xuICAgICAgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdID0gdmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZsYXR0ZW47XG4iLCJ2YXIgY3JlYXRlQmFzZUZvciA9IHJlcXVpcmUoJy4vX2NyZWF0ZUJhc2VGb3InKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYmFzZUZvck93bmAgd2hpY2ggaXRlcmF0ZXMgb3ZlciBgb2JqZWN0YFxuICogcHJvcGVydGllcyByZXR1cm5lZCBieSBga2V5c0Z1bmNgIGFuZCBpbnZva2VzIGBpdGVyYXRlZWAgZm9yIGVhY2ggcHJvcGVydHkuXG4gKiBJdGVyYXRlZSBmdW5jdGlvbnMgbWF5IGV4aXQgaXRlcmF0aW9uIGVhcmx5IGJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGBmYWxzZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbnZhciBiYXNlRm9yID0gY3JlYXRlQmFzZUZvcigpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGb3I7XG4iLCJ2YXIgYmFzZUZvciA9IHJlcXVpcmUoJy4vX2Jhc2VGb3InKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZm9yT3duYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUZvck93bihvYmplY3QsIGl0ZXJhdGVlKSB7XG4gIHJldHVybiBvYmplY3QgJiYgYmFzZUZvcihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRm9yT3duO1xuIiwidmFyIGNhc3RQYXRoID0gcmVxdWlyZSgnLi9fY2FzdFBhdGgnKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZ2V0YCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZmF1bHQgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc29sdmVkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0KG9iamVjdCwgcGF0aCkge1xuICBwYXRoID0gY2FzdFBhdGgocGF0aCwgb2JqZWN0KTtcblxuICB2YXIgaW5kZXggPSAwLFxuICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGg7XG5cbiAgd2hpbGUgKG9iamVjdCAhPSBudWxsICYmIGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgb2JqZWN0ID0gb2JqZWN0W3RvS2V5KHBhdGhbaW5kZXgrK10pXTtcbiAgfVxuICByZXR1cm4gKGluZGV4ICYmIGluZGV4ID09IGxlbmd0aCkgPyBvYmplY3QgOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUdldDtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBnZXRSYXdUYWcgPSByZXF1aXJlKCcuL19nZXRSYXdUYWcnKSxcbiAgICBvYmplY3RUb1N0cmluZyA9IHJlcXVpcmUoJy4vX29iamVjdFRvU3RyaW5nJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgdmFsdWUgPSBPYmplY3QodmFsdWUpO1xuICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIHZhbHVlKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRUYWc7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmhhc2Agd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBrZXkgVGhlIGtleSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUhhcyhvYmplY3QsIGtleSkge1xuICByZXR1cm4gb2JqZWN0ICE9IG51bGwgJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUhhcztcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaGFzSW5gIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30ga2V5IFRoZSBrZXkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VIYXNJbihvYmplY3QsIGtleSkge1xuICByZXR1cm4gb2JqZWN0ICE9IG51bGwgJiYga2V5IGluIE9iamVjdChvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VIYXNJbjtcbiIsInZhciBiYXNlRmluZEluZGV4ID0gcmVxdWlyZSgnLi9fYmFzZUZpbmRJbmRleCcpLFxuICAgIGJhc2VJc05hTiA9IHJlcXVpcmUoJy4vX2Jhc2VJc05hTicpLFxuICAgIHN0cmljdEluZGV4T2YgPSByZXF1aXJlKCcuL19zdHJpY3RJbmRleE9mJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaW5kZXhPZmAgd2l0aG91dCBgZnJvbUluZGV4YCBib3VuZHMgY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gdmFsdWVcbiAgICA/IHN0cmljdEluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpXG4gICAgOiBiYXNlRmluZEluZGV4KGFycmF5LCBiYXNlSXNOYU4sIGZyb21JbmRleCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUluZGV4T2Y7XG4iLCJ2YXIgU2V0Q2FjaGUgPSByZXF1aXJlKCcuL19TZXRDYWNoZScpLFxuICAgIGFycmF5SW5jbHVkZXMgPSByZXF1aXJlKCcuL19hcnJheUluY2x1ZGVzJyksXG4gICAgYXJyYXlJbmNsdWRlc1dpdGggPSByZXF1aXJlKCcuL19hcnJheUluY2x1ZGVzV2l0aCcpLFxuICAgIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBiYXNlVW5hcnkgPSByZXF1aXJlKCcuL19iYXNlVW5hcnknKSxcbiAgICBjYWNoZUhhcyA9IHJlcXVpcmUoJy4vX2NhY2hlSGFzJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNaW4gPSBNYXRoLm1pbjtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBtZXRob2RzIGxpa2UgYF8uaW50ZXJzZWN0aW9uYCwgd2l0aG91dCBzdXBwb3J0XG4gKiBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcywgdGhhdCBhY2NlcHRzIGFuIGFycmF5IG9mIGFycmF5cyB0byBpbnNwZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheXMgVGhlIGFycmF5cyB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2l0ZXJhdGVlXSBUaGUgaXRlcmF0ZWUgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjb21wYXJhdG9yXSBUaGUgY29tcGFyYXRvciBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgYXJyYXkgb2Ygc2hhcmVkIHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUludGVyc2VjdGlvbihhcnJheXMsIGl0ZXJhdGVlLCBjb21wYXJhdG9yKSB7XG4gIHZhciBpbmNsdWRlcyA9IGNvbXBhcmF0b3IgPyBhcnJheUluY2x1ZGVzV2l0aCA6IGFycmF5SW5jbHVkZXMsXG4gICAgICBsZW5ndGggPSBhcnJheXNbMF0ubGVuZ3RoLFxuICAgICAgb3RoTGVuZ3RoID0gYXJyYXlzLmxlbmd0aCxcbiAgICAgIG90aEluZGV4ID0gb3RoTGVuZ3RoLFxuICAgICAgY2FjaGVzID0gQXJyYXkob3RoTGVuZ3RoKSxcbiAgICAgIG1heExlbmd0aCA9IEluZmluaXR5LFxuICAgICAgcmVzdWx0ID0gW107XG5cbiAgd2hpbGUgKG90aEluZGV4LS0pIHtcbiAgICB2YXIgYXJyYXkgPSBhcnJheXNbb3RoSW5kZXhdO1xuICAgIGlmIChvdGhJbmRleCAmJiBpdGVyYXRlZSkge1xuICAgICAgYXJyYXkgPSBhcnJheU1hcChhcnJheSwgYmFzZVVuYXJ5KGl0ZXJhdGVlKSk7XG4gICAgfVxuICAgIG1heExlbmd0aCA9IG5hdGl2ZU1pbihhcnJheS5sZW5ndGgsIG1heExlbmd0aCk7XG4gICAgY2FjaGVzW290aEluZGV4XSA9ICFjb21wYXJhdG9yICYmIChpdGVyYXRlZSB8fCAobGVuZ3RoID49IDEyMCAmJiBhcnJheS5sZW5ndGggPj0gMTIwKSlcbiAgICAgID8gbmV3IFNldENhY2hlKG90aEluZGV4ICYmIGFycmF5KVxuICAgICAgOiB1bmRlZmluZWQ7XG4gIH1cbiAgYXJyYXkgPSBhcnJheXNbMF07XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBzZWVuID0gY2FjaGVzWzBdO1xuXG4gIG91dGVyOlxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCAmJiByZXN1bHQubGVuZ3RoIDwgbWF4TGVuZ3RoKSB7XG4gICAgdmFyIHZhbHVlID0gYXJyYXlbaW5kZXhdLFxuICAgICAgICBjb21wdXRlZCA9IGl0ZXJhdGVlID8gaXRlcmF0ZWUodmFsdWUpIDogdmFsdWU7XG5cbiAgICB2YWx1ZSA9IChjb21wYXJhdG9yIHx8IHZhbHVlICE9PSAwKSA/IHZhbHVlIDogMDtcbiAgICBpZiAoIShzZWVuXG4gICAgICAgICAgPyBjYWNoZUhhcyhzZWVuLCBjb21wdXRlZClcbiAgICAgICAgICA6IGluY2x1ZGVzKHJlc3VsdCwgY29tcHV0ZWQsIGNvbXBhcmF0b3IpXG4gICAgICAgICkpIHtcbiAgICAgIG90aEluZGV4ID0gb3RoTGVuZ3RoO1xuICAgICAgd2hpbGUgKC0tb3RoSW5kZXgpIHtcbiAgICAgICAgdmFyIGNhY2hlID0gY2FjaGVzW290aEluZGV4XTtcbiAgICAgICAgaWYgKCEoY2FjaGVcbiAgICAgICAgICAgICAgPyBjYWNoZUhhcyhjYWNoZSwgY29tcHV0ZWQpXG4gICAgICAgICAgICAgIDogaW5jbHVkZXMoYXJyYXlzW290aEluZGV4XSwgY29tcHV0ZWQsIGNvbXBhcmF0b3IpKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgY29udGludWUgb3V0ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzZWVuKSB7XG4gICAgICAgIHNlZW4ucHVzaChjb21wdXRlZCk7XG4gICAgICB9XG4gICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUludGVyc2VjdGlvbjtcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNBcmd1bWVudHNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqL1xuZnVuY3Rpb24gYmFzZUlzQXJndW1lbnRzKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IGFyZ3NUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzQXJndW1lbnRzO1xuIiwidmFyIGJhc2VJc0VxdWFsRGVlcCA9IHJlcXVpcmUoJy4vX2Jhc2VJc0VxdWFsRGVlcCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNFcXVhbGAgd2hpY2ggc3VwcG9ydHMgcGFydGlhbCBjb21wYXJpc29uc1xuICogYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuXG4gKiAgMSAtIFVub3JkZXJlZCBjb21wYXJpc29uXG4gKiAgMiAtIFBhcnRpYWwgY29tcGFyaXNvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIGB2YWx1ZWAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0VxdWFsKHZhbHVlLCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spIHtcbiAgaWYgKHZhbHVlID09PSBvdGhlcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmICh2YWx1ZSA9PSBudWxsIHx8IG90aGVyID09IG51bGwgfHwgKCFpc09iamVjdCh2YWx1ZSkgJiYgIWlzT2JqZWN0TGlrZShvdGhlcikpKSB7XG4gICAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXI7XG4gIH1cbiAgcmV0dXJuIGJhc2VJc0VxdWFsRGVlcCh2YWx1ZSwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGJhc2VJc0VxdWFsLCBzdGFjayk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzRXF1YWw7XG4iLCJ2YXIgU3RhY2sgPSByZXF1aXJlKCcuL19TdGFjaycpLFxuICAgIGVxdWFsQXJyYXlzID0gcmVxdWlyZSgnLi9fZXF1YWxBcnJheXMnKSxcbiAgICBlcXVhbEJ5VGFnID0gcmVxdWlyZSgnLi9fZXF1YWxCeVRhZycpLFxuICAgIGVxdWFsT2JqZWN0cyA9IHJlcXVpcmUoJy4vX2VxdWFsT2JqZWN0cycpLFxuICAgIGdldFRhZyA9IHJlcXVpcmUoJy4vX2dldFRhZycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0J1ZmZlciA9IHJlcXVpcmUoJy4vaXNCdWZmZXInKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB2YWx1ZSBjb21wYXJpc29ucy4gKi9cbnZhciBDT01QQVJFX1BBUlRJQUxfRkxBRyA9IDE7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxgIGZvciBhcnJheXMgYW5kIG9iamVjdHMgd2hpY2ggcGVyZm9ybXNcbiAqIGRlZXAgY29tcGFyaXNvbnMgYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBlbmFibGluZyBvYmplY3RzIHdpdGggY2lyY3VsYXJcbiAqIHJlZmVyZW5jZXMgdG8gYmUgY29tcGFyZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0VxdWFsRGVlcChvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHZhciBvYmpJc0FyciA9IGlzQXJyYXkob2JqZWN0KSxcbiAgICAgIG90aElzQXJyID0gaXNBcnJheShvdGhlciksXG4gICAgICBvYmpUYWcgPSBhcnJheVRhZyxcbiAgICAgIG90aFRhZyA9IGFycmF5VGFnO1xuXG4gIGlmICghb2JqSXNBcnIpIHtcbiAgICBvYmpUYWcgPSBnZXRUYWcob2JqZWN0KTtcbiAgICBvYmpUYWcgPSBvYmpUYWcgPT0gYXJnc1RhZyA/IG9iamVjdFRhZyA6IG9ialRhZztcbiAgfVxuICBpZiAoIW90aElzQXJyKSB7XG4gICAgb3RoVGFnID0gZ2V0VGFnKG90aGVyKTtcbiAgICBvdGhUYWcgPSBvdGhUYWcgPT0gYXJnc1RhZyA/IG9iamVjdFRhZyA6IG90aFRhZztcbiAgfVxuICB2YXIgb2JqSXNPYmogPSBvYmpUYWcgPT0gb2JqZWN0VGFnLFxuICAgICAgb3RoSXNPYmogPSBvdGhUYWcgPT0gb2JqZWN0VGFnLFxuICAgICAgaXNTYW1lVGFnID0gb2JqVGFnID09IG90aFRhZztcblxuICBpZiAoaXNTYW1lVGFnICYmIGlzQnVmZmVyKG9iamVjdCkpIHtcbiAgICBpZiAoIWlzQnVmZmVyKG90aGVyKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBvYmpJc0FyciA9IHRydWU7XG4gICAgb2JqSXNPYmogPSBmYWxzZTtcbiAgfVxuICBpZiAoaXNTYW1lVGFnICYmICFvYmpJc09iaikge1xuICAgIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gICAgcmV0dXJuIChvYmpJc0FyciB8fCBpc1R5cGVkQXJyYXkob2JqZWN0KSlcbiAgICAgID8gZXF1YWxBcnJheXMob2JqZWN0LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaylcbiAgICAgIDogZXF1YWxCeVRhZyhvYmplY3QsIG90aGVyLCBvYmpUYWcsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spO1xuICB9XG4gIGlmICghKGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRykpIHtcbiAgICB2YXIgb2JqSXNXcmFwcGVkID0gb2JqSXNPYmogJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsICdfX3dyYXBwZWRfXycpLFxuICAgICAgICBvdGhJc1dyYXBwZWQgPSBvdGhJc09iaiAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG90aGVyLCAnX193cmFwcGVkX18nKTtcblxuICAgIGlmIChvYmpJc1dyYXBwZWQgfHwgb3RoSXNXcmFwcGVkKSB7XG4gICAgICB2YXIgb2JqVW53cmFwcGVkID0gb2JqSXNXcmFwcGVkID8gb2JqZWN0LnZhbHVlKCkgOiBvYmplY3QsXG4gICAgICAgICAgb3RoVW53cmFwcGVkID0gb3RoSXNXcmFwcGVkID8gb3RoZXIudmFsdWUoKSA6IG90aGVyO1xuXG4gICAgICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICAgICAgcmV0dXJuIGVxdWFsRnVuYyhvYmpVbndyYXBwZWQsIG90aFVud3JhcHBlZCwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spO1xuICAgIH1cbiAgfVxuICBpZiAoIWlzU2FtZVRhZykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICByZXR1cm4gZXF1YWxPYmplY3RzKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc0VxdWFsRGVlcDtcbiIsInZhciBTdGFjayA9IHJlcXVpcmUoJy4vX1N0YWNrJyksXG4gICAgYmFzZUlzRXF1YWwgPSByZXF1aXJlKCcuL19iYXNlSXNFcXVhbCcpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB2YWx1ZSBjb21wYXJpc29ucy4gKi9cbnZhciBDT01QQVJFX1BBUlRJQUxfRkxBRyA9IDEsXG4gICAgQ09NUEFSRV9VTk9SREVSRURfRkxBRyA9IDI7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNNYXRjaGAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCBvZiBwcm9wZXJ0eSB2YWx1ZXMgdG8gbWF0Y2guXG4gKiBAcGFyYW0ge0FycmF5fSBtYXRjaERhdGEgVGhlIHByb3BlcnR5IG5hbWVzLCB2YWx1ZXMsIGFuZCBjb21wYXJlIGZsYWdzIHRvIG1hdGNoLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYG9iamVjdGAgaXMgYSBtYXRjaCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNNYXRjaChvYmplY3QsIHNvdXJjZSwgbWF0Y2hEYXRhLCBjdXN0b21pemVyKSB7XG4gIHZhciBpbmRleCA9IG1hdGNoRGF0YS5sZW5ndGgsXG4gICAgICBsZW5ndGggPSBpbmRleCxcbiAgICAgIG5vQ3VzdG9taXplciA9ICFjdXN0b21pemVyO1xuXG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybiAhbGVuZ3RoO1xuICB9XG4gIG9iamVjdCA9IE9iamVjdChvYmplY3QpO1xuICB3aGlsZSAoaW5kZXgtLSkge1xuICAgIHZhciBkYXRhID0gbWF0Y2hEYXRhW2luZGV4XTtcbiAgICBpZiAoKG5vQ3VzdG9taXplciAmJiBkYXRhWzJdKVxuICAgICAgICAgID8gZGF0YVsxXSAhPT0gb2JqZWN0W2RhdGFbMF1dXG4gICAgICAgICAgOiAhKGRhdGFbMF0gaW4gb2JqZWN0KVxuICAgICAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBkYXRhID0gbWF0Y2hEYXRhW2luZGV4XTtcbiAgICB2YXIga2V5ID0gZGF0YVswXSxcbiAgICAgICAgb2JqVmFsdWUgPSBvYmplY3Rba2V5XSxcbiAgICAgICAgc3JjVmFsdWUgPSBkYXRhWzFdO1xuXG4gICAgaWYgKG5vQ3VzdG9taXplciAmJiBkYXRhWzJdKSB7XG4gICAgICBpZiAob2JqVmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHN0YWNrID0gbmV3IFN0YWNrO1xuICAgICAgaWYgKGN1c3RvbWl6ZXIpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGN1c3RvbWl6ZXIob2JqVmFsdWUsIHNyY1ZhbHVlLCBrZXksIG9iamVjdCwgc291cmNlLCBzdGFjayk7XG4gICAgICB9XG4gICAgICBpZiAoIShyZXN1bHQgPT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgPyBiYXNlSXNFcXVhbChzcmNWYWx1ZSwgb2JqVmFsdWUsIENPTVBBUkVfUEFSVElBTF9GTEFHIHwgQ09NUEFSRV9VTk9SREVSRURfRkxBRywgY3VzdG9taXplciwgc3RhY2spXG4gICAgICAgICAgICA6IHJlc3VsdFxuICAgICAgICAgICkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNNYXRjaDtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNOYU5gIHdpdGhvdXQgc3VwcG9ydCBmb3IgbnVtYmVyIG9iamVjdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYE5hTmAsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTmFOKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gdmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzTmFOO1xuIiwidmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKSxcbiAgICBpc01hc2tlZCA9IHJlcXVpcmUoJy4vX2lzTWFza2VkJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgdG9Tb3VyY2UgPSByZXF1aXJlKCcuL190b1NvdXJjZScpO1xuXG4vKipcbiAqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGBcbiAqIFtzeW50YXggY2hhcmFjdGVyc10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtcGF0dGVybnMpLlxuICovXG52YXIgcmVSZWdFeHBDaGFyID0gL1tcXFxcXiQuKis/KClbXFxde318XS9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaG9zdCBjb25zdHJ1Y3RvcnMgKFNhZmFyaSkuICovXG52YXIgcmVJc0hvc3RDdG9yID0gL15cXFtvYmplY3QgLis/Q29uc3RydWN0b3JcXF0kLztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZSxcbiAgICBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUuICovXG52YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBmdW5jVG9TdHJpbmcuY2FsbChoYXNPd25Qcm9wZXJ0eSkucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNOYXRpdmVgIHdpdGhvdXQgYmFkIHNoaW0gY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpIHx8IGlzTWFza2VkKHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgcGF0dGVybiA9IGlzRnVuY3Rpb24odmFsdWUpID8gcmVJc05hdGl2ZSA6IHJlSXNIb3N0Q3RvcjtcbiAgcmV0dXJuIHBhdHRlcm4udGVzdCh0b1NvdXJjZSh2YWx1ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc05hdGl2ZTtcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhcmdzVGFnID0gJ1tvYmplY3QgQXJndW1lbnRzXScsXG4gICAgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nLFxuICAgIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIG9mIHR5cGVkIGFycmF5cy4gKi9cbnZhciB0eXBlZEFycmF5VGFncyA9IHt9O1xudHlwZWRBcnJheVRhZ3NbZmxvYXQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1tmbG9hdDY0VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQ4VGFnXSA9IHR5cGVkQXJyYXlUYWdzW2ludDE2VGFnXSA9XG50eXBlZEFycmF5VGFnc1tpbnQzMlRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50OFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDhDbGFtcGVkVGFnXSA9IHR5cGVkQXJyYXlUYWdzW3VpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG50eXBlZEFycmF5VGFnc1thcmdzVGFnXSA9IHR5cGVkQXJyYXlUYWdzW2FycmF5VGFnXSA9XG50eXBlZEFycmF5VGFnc1thcnJheUJ1ZmZlclRhZ10gPSB0eXBlZEFycmF5VGFnc1tib29sVGFnXSA9XG50eXBlZEFycmF5VGFnc1tkYXRhVmlld1RhZ10gPSB0eXBlZEFycmF5VGFnc1tkYXRlVGFnXSA9XG50eXBlZEFycmF5VGFnc1tlcnJvclRhZ10gPSB0eXBlZEFycmF5VGFnc1tmdW5jVGFnXSA9XG50eXBlZEFycmF5VGFnc1ttYXBUYWddID0gdHlwZWRBcnJheVRhZ3NbbnVtYmVyVGFnXSA9XG50eXBlZEFycmF5VGFnc1tvYmplY3RUYWddID0gdHlwZWRBcnJheVRhZ3NbcmVnZXhwVGFnXSA9XG50eXBlZEFycmF5VGFnc1tzZXRUYWddID0gdHlwZWRBcnJheVRhZ3Nbc3RyaW5nVGFnXSA9XG50eXBlZEFycmF5VGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzVHlwZWRBcnJheWAgd2l0aG91dCBOb2RlLmpzIG9wdGltaXphdGlvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNUeXBlZEFycmF5KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmXG4gICAgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhIXR5cGVkQXJyYXlUYWdzW2Jhc2VHZXRUYWcodmFsdWUpXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNUeXBlZEFycmF5O1xuIiwidmFyIGJhc2VNYXRjaGVzID0gcmVxdWlyZSgnLi9fYmFzZU1hdGNoZXMnKSxcbiAgICBiYXNlTWF0Y2hlc1Byb3BlcnR5ID0gcmVxdWlyZSgnLi9fYmFzZU1hdGNoZXNQcm9wZXJ0eScpLFxuICAgIGlkZW50aXR5ID0gcmVxdWlyZSgnLi9pZGVudGl0eScpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBwcm9wZXJ0eSA9IHJlcXVpcmUoJy4vcHJvcGVydHknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pdGVyYXRlZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gW3ZhbHVlPV8uaWRlbnRpdHldIFRoZSB2YWx1ZSB0byBjb252ZXJ0IHRvIGFuIGl0ZXJhdGVlLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBpdGVyYXRlZS5cbiAqL1xuZnVuY3Rpb24gYmFzZUl0ZXJhdGVlKHZhbHVlKSB7XG4gIC8vIERvbid0IHN0b3JlIHRoZSBgdHlwZW9mYCByZXN1bHQgaW4gYSB2YXJpYWJsZSB0byBhdm9pZCBhIEpJVCBidWcgaW4gU2FmYXJpIDkuXG4gIC8vIFNlZSBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTU2MDM0IGZvciBtb3JlIGRldGFpbHMuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiBpZGVudGl0eTtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlID09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIGlzQXJyYXkodmFsdWUpXG4gICAgICA/IGJhc2VNYXRjaGVzUHJvcGVydHkodmFsdWVbMF0sIHZhbHVlWzFdKVxuICAgICAgOiBiYXNlTWF0Y2hlcyh2YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHByb3BlcnR5KHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXRlcmF0ZWU7XG4iLCJ2YXIgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpLFxuICAgIG5hdGl2ZUtleXMgPSByZXF1aXJlKCcuL19uYXRpdmVLZXlzJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c2Agd2hpY2ggZG9lc24ndCB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBiYXNlS2V5cyhvYmplY3QpIHtcbiAgaWYgKCFpc1Byb3RvdHlwZShvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXMob2JqZWN0KTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBrZXkgIT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlS2V5cztcbiIsInZhciBiYXNlRWFjaCA9IHJlcXVpcmUoJy4vX2Jhc2VFYWNoJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ubWFwYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBtYXBwZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGJhc2VNYXAoY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBpc0FycmF5TGlrZShjb2xsZWN0aW9uKSA/IEFycmF5KGNvbGxlY3Rpb24ubGVuZ3RoKSA6IFtdO1xuXG4gIGJhc2VFYWNoKGNvbGxlY3Rpb24sIGZ1bmN0aW9uKHZhbHVlLCBrZXksIGNvbGxlY3Rpb24pIHtcbiAgICByZXN1bHRbKytpbmRleF0gPSBpdGVyYXRlZSh2YWx1ZSwga2V5LCBjb2xsZWN0aW9uKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU1hcDtcbiIsInZhciBiYXNlSXNNYXRjaCA9IHJlcXVpcmUoJy4vX2Jhc2VJc01hdGNoJyksXG4gICAgZ2V0TWF0Y2hEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWF0Y2hEYXRhJyksXG4gICAgbWF0Y2hlc1N0cmljdENvbXBhcmFibGUgPSByZXF1aXJlKCcuL19tYXRjaGVzU3RyaWN0Q29tcGFyYWJsZScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLm1hdGNoZXNgIHdoaWNoIGRvZXNuJ3QgY2xvbmUgYHNvdXJjZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCBvZiBwcm9wZXJ0eSB2YWx1ZXMgdG8gbWF0Y2guXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBzcGVjIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlTWF0Y2hlcyhzb3VyY2UpIHtcbiAgdmFyIG1hdGNoRGF0YSA9IGdldE1hdGNoRGF0YShzb3VyY2UpO1xuICBpZiAobWF0Y2hEYXRhLmxlbmd0aCA9PSAxICYmIG1hdGNoRGF0YVswXVsyXSkge1xuICAgIHJldHVybiBtYXRjaGVzU3RyaWN0Q29tcGFyYWJsZShtYXRjaERhdGFbMF1bMF0sIG1hdGNoRGF0YVswXVsxXSk7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBvYmplY3QgPT09IHNvdXJjZSB8fCBiYXNlSXNNYXRjaChvYmplY3QsIHNvdXJjZSwgbWF0Y2hEYXRhKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlTWF0Y2hlcztcbiIsInZhciBiYXNlSXNFcXVhbCA9IHJlcXVpcmUoJy4vX2Jhc2VJc0VxdWFsJyksXG4gICAgZ2V0ID0gcmVxdWlyZSgnLi9nZXQnKSxcbiAgICBoYXNJbiA9IHJlcXVpcmUoJy4vaGFzSW4nKSxcbiAgICBpc0tleSA9IHJlcXVpcmUoJy4vX2lzS2V5JyksXG4gICAgaXNTdHJpY3RDb21wYXJhYmxlID0gcmVxdWlyZSgnLi9faXNTdHJpY3RDb21wYXJhYmxlJyksXG4gICAgbWF0Y2hlc1N0cmljdENvbXBhcmFibGUgPSByZXF1aXJlKCcuL19tYXRjaGVzU3RyaWN0Q29tcGFyYWJsZScpLFxuICAgIHRvS2V5ID0gcmVxdWlyZSgnLi9fdG9LZXknKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgdmFsdWUgY29tcGFyaXNvbnMuICovXG52YXIgQ09NUEFSRV9QQVJUSUFMX0ZMQUcgPSAxLFxuICAgIENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcgPSAyO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLm1hdGNoZXNQcm9wZXJ0eWAgd2hpY2ggZG9lc24ndCBjbG9uZSBgc3JjVmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHBhcmFtIHsqfSBzcmNWYWx1ZSBUaGUgdmFsdWUgdG8gbWF0Y2guXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBzcGVjIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlTWF0Y2hlc1Byb3BlcnR5KHBhdGgsIHNyY1ZhbHVlKSB7XG4gIGlmIChpc0tleShwYXRoKSAmJiBpc1N0cmljdENvbXBhcmFibGUoc3JjVmFsdWUpKSB7XG4gICAgcmV0dXJuIG1hdGNoZXNTdHJpY3RDb21wYXJhYmxlKHRvS2V5KHBhdGgpLCBzcmNWYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBvYmpWYWx1ZSA9IGdldChvYmplY3QsIHBhdGgpO1xuICAgIHJldHVybiAob2JqVmFsdWUgPT09IHVuZGVmaW5lZCAmJiBvYmpWYWx1ZSA9PT0gc3JjVmFsdWUpXG4gICAgICA/IGhhc0luKG9iamVjdCwgcGF0aClcbiAgICAgIDogYmFzZUlzRXF1YWwoc3JjVmFsdWUsIG9ialZhbHVlLCBDT01QQVJFX1BBUlRJQUxfRkxBRyB8IENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VNYXRjaGVzUHJvcGVydHk7XG4iLCJ2YXIgYmFzZVBpY2tCeSA9IHJlcXVpcmUoJy4vX2Jhc2VQaWNrQnknKSxcbiAgICBoYXNJbiA9IHJlcXVpcmUoJy4vaGFzSW4nKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5waWNrYCB3aXRob3V0IHN1cHBvcnQgZm9yIGluZGl2aWR1YWxcbiAqIHByb3BlcnR5IGlkZW50aWZpZXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtzdHJpbmdbXX0gcGF0aHMgVGhlIHByb3BlcnR5IHBhdGhzIHRvIHBpY2suXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBiYXNlUGljayhvYmplY3QsIHBhdGhzKSB7XG4gIG9iamVjdCA9IE9iamVjdChvYmplY3QpO1xuICByZXR1cm4gYmFzZVBpY2tCeShvYmplY3QsIHBhdGhzLCBmdW5jdGlvbih2YWx1ZSwgcGF0aCkge1xuICAgIHJldHVybiBoYXNJbihvYmplY3QsIHBhdGgpO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUGljaztcbiIsInZhciBiYXNlR2V0ID0gcmVxdWlyZSgnLi9fYmFzZUdldCcpLFxuICAgIGJhc2VTZXQgPSByZXF1aXJlKCcuL19iYXNlU2V0JyksXG4gICAgY2FzdFBhdGggPSByZXF1aXJlKCcuL19jYXN0UGF0aCcpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mICBgXy5waWNrQnlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHBhdGhzIFRoZSBwcm9wZXJ0eSBwYXRocyB0byBwaWNrLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBwcm9wZXJ0eS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGJhc2VQaWNrQnkob2JqZWN0LCBwYXRocywgcHJlZGljYXRlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcGF0aHMubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0ge307XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgcGF0aCA9IHBhdGhzW2luZGV4XSxcbiAgICAgICAgdmFsdWUgPSBiYXNlR2V0KG9iamVjdCwgcGF0aCk7XG5cbiAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBwYXRoKSkge1xuICAgICAgYmFzZVNldChyZXN1bHQsIGNhc3RQYXRoKHBhdGgsIG9iamVjdCksIHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUGlja0J5O1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5wcm9wZXJ0eWAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFjY2Vzc29yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHkoa2V5KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUHJvcGVydHk7XG4iLCJ2YXIgYmFzZUdldCA9IHJlcXVpcmUoJy4vX2Jhc2VHZXQnKTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VQcm9wZXJ0eWAgd2hpY2ggc3VwcG9ydHMgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFjY2Vzc29yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHlEZWVwKHBhdGgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBiYXNlR2V0KG9iamVjdCwgcGF0aCk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVByb3BlcnR5RGVlcDtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHJvcGVydHlPZmAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBhY2Nlc3NvciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVByb3BlcnR5T2Yob2JqZWN0KSB7XG4gIHJldHVybiBmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUHJvcGVydHlPZjtcbiIsInZhciBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKSxcbiAgICBvdmVyUmVzdCA9IHJlcXVpcmUoJy4vX292ZXJSZXN0JyksXG4gICAgc2V0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19zZXRUb1N0cmluZycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnJlc3RgIHdoaWNoIGRvZXNuJ3QgdmFsaWRhdGUgb3IgY29lcmNlIGFyZ3VtZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUmVzdChmdW5jLCBzdGFydCkge1xuICByZXR1cm4gc2V0VG9TdHJpbmcob3ZlclJlc3QoZnVuYywgc3RhcnQsIGlkZW50aXR5KSwgZnVuYyArICcnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlUmVzdDtcbiIsInZhciBhc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Fzc2lnblZhbHVlJyksXG4gICAgY2FzdFBhdGggPSByZXF1aXJlKCcuL19jYXN0UGF0aCcpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL19pc0luZGV4JyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgdG9LZXkgPSByZXF1aXJlKCcuL190b0tleScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnNldGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgcGF0aCBjcmVhdGlvbi5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VTZXQob2JqZWN0LCBwYXRoLCB2YWx1ZSwgY3VzdG9taXplcikge1xuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG4gIHBhdGggPSBjYXN0UGF0aChwYXRoLCBvYmplY3QpO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGgsXG4gICAgICBsYXN0SW5kZXggPSBsZW5ndGggLSAxLFxuICAgICAgbmVzdGVkID0gb2JqZWN0O1xuXG4gIHdoaWxlIChuZXN0ZWQgIT0gbnVsbCAmJiArK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHRvS2V5KHBhdGhbaW5kZXhdKSxcbiAgICAgICAgbmV3VmFsdWUgPSB2YWx1ZTtcblxuICAgIGlmIChpbmRleCAhPSBsYXN0SW5kZXgpIHtcbiAgICAgIHZhciBvYmpWYWx1ZSA9IG5lc3RlZFtrZXldO1xuICAgICAgbmV3VmFsdWUgPSBjdXN0b21pemVyID8gY3VzdG9taXplcihvYmpWYWx1ZSwga2V5LCBuZXN0ZWQpIDogdW5kZWZpbmVkO1xuICAgICAgaWYgKG5ld1ZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBpc09iamVjdChvYmpWYWx1ZSlcbiAgICAgICAgICA/IG9ialZhbHVlXG4gICAgICAgICAgOiAoaXNJbmRleChwYXRoW2luZGV4ICsgMV0pID8gW10gOiB7fSk7XG4gICAgICB9XG4gICAgfVxuICAgIGFzc2lnblZhbHVlKG5lc3RlZCwga2V5LCBuZXdWYWx1ZSk7XG4gICAgbmVzdGVkID0gbmVzdGVkW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlU2V0O1xuIiwidmFyIGNvbnN0YW50ID0gcmVxdWlyZSgnLi9jb25zdGFudCcpLFxuICAgIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fZGVmaW5lUHJvcGVydHknKSxcbiAgICBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgc2V0VG9TdHJpbmdgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaG90IGxvb3Agc2hvcnRpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN0cmluZyBUaGUgYHRvU3RyaW5nYCByZXN1bHQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgYGZ1bmNgLlxuICovXG52YXIgYmFzZVNldFRvU3RyaW5nID0gIWRlZmluZVByb3BlcnR5ID8gaWRlbnRpdHkgOiBmdW5jdGlvbihmdW5jLCBzdHJpbmcpIHtcbiAgcmV0dXJuIGRlZmluZVByb3BlcnR5KGZ1bmMsICd0b1N0cmluZycsIHtcbiAgICAnY29uZmlndXJhYmxlJzogdHJ1ZSxcbiAgICAnZW51bWVyYWJsZSc6IGZhbHNlLFxuICAgICd2YWx1ZSc6IGNvbnN0YW50KHN0cmluZyksXG4gICAgJ3dyaXRhYmxlJzogdHJ1ZVxuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVNldFRvU3RyaW5nO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5zbGljZWAgd2l0aG91dCBhbiBpdGVyYXRlZSBjYWxsIGd1YXJkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gc2xpY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PTBdIFRoZSBzdGFydCBwb3NpdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbZW5kPWFycmF5Lmxlbmd0aF0gVGhlIGVuZCBwb3NpdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgc2xpY2Ugb2YgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYmFzZVNsaWNlKGFycmF5LCBzdGFydCwgZW5kKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gIGlmIChzdGFydCA8IDApIHtcbiAgICBzdGFydCA9IC1zdGFydCA+IGxlbmd0aCA/IDAgOiAobGVuZ3RoICsgc3RhcnQpO1xuICB9XG4gIGVuZCA9IGVuZCA+IGxlbmd0aCA/IGxlbmd0aCA6IGVuZDtcbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuZ3RoO1xuICB9XG4gIGxlbmd0aCA9IHN0YXJ0ID4gZW5kID8gMCA6ICgoZW5kIC0gc3RhcnQpID4+PiAwKTtcbiAgc3RhcnQgPj4+PSAwO1xuXG4gIHZhciByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSBhcnJheVtpbmRleCArIHN0YXJ0XTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VTbGljZTtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uc3VtYCBhbmQgYF8uc3VtQnlgIHdpdGhvdXQgc3VwcG9ydCBmb3JcbiAqIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgc3VtLlxuICovXG5mdW5jdGlvbiBiYXNlU3VtKGFycmF5LCBpdGVyYXRlZSkge1xuICB2YXIgcmVzdWx0LFxuICAgICAgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBjdXJyZW50ID0gaXRlcmF0ZWUoYXJyYXlbaW5kZXhdKTtcbiAgICBpZiAoY3VycmVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXN1bHQgPSByZXN1bHQgPT09IHVuZGVmaW5lZCA/IGN1cnJlbnQgOiAocmVzdWx0ICsgY3VycmVudCk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVN1bTtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udGltZXNgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kc1xuICogb3IgbWF4IGFycmF5IGxlbmd0aCBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBudW1iZXIgb2YgdGltZXMgdG8gaW52b2tlIGBpdGVyYXRlZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiByZXN1bHRzLlxuICovXG5mdW5jdGlvbiBiYXNlVGltZXMobiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShuKTtcblxuICB3aGlsZSAoKytpbmRleCA8IG4pIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoaW5kZXgpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRpbWVzO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKiBVc2VkIHRvIGNvbnZlcnQgc3ltYm9scyB0byBwcmltaXRpdmVzIGFuZCBzdHJpbmdzLiAqL1xudmFyIHN5bWJvbFByb3RvID0gU3ltYm9sID8gU3ltYm9sLnByb3RvdHlwZSA6IHVuZGVmaW5lZCxcbiAgICBzeW1ib2xUb1N0cmluZyA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udG9TdHJpbmcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udG9TdHJpbmdgIHdoaWNoIGRvZXNuJ3QgY29udmVydCBudWxsaXNoXG4gKiB2YWx1ZXMgdG8gZW1wdHkgc3RyaW5ncy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRvU3RyaW5nKHZhbHVlKSB7XG4gIC8vIEV4aXQgZWFybHkgZm9yIHN0cmluZ3MgdG8gYXZvaWQgYSBwZXJmb3JtYW5jZSBoaXQgaW4gc29tZSBlbnZpcm9ubWVudHMuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgLy8gUmVjdXJzaXZlbHkgY29udmVydCB2YWx1ZXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICByZXR1cm4gYXJyYXlNYXAodmFsdWUsIGJhc2VUb1N0cmluZykgKyAnJztcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIHN5bWJvbFRvU3RyaW5nID8gc3ltYm9sVG9TdHJpbmcuY2FsbCh2YWx1ZSkgOiAnJztcbiAgfVxuICB2YXIgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICByZXR1cm4gKHJlc3VsdCA9PSAnMCcgJiYgKDEgLyB2YWx1ZSkgPT0gLUlORklOSVRZKSA/ICctMCcgOiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRvU3RyaW5nO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy51bmFyeWAgd2l0aG91dCBzdXBwb3J0IGZvciBzdG9yaW5nIG1ldGFkYXRhLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjYXAgYXJndW1lbnRzIGZvci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNhcHBlZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVVuYXJ5KGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGZ1bmModmFsdWUpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VVbmFyeTtcbiIsInZhciBhcnJheU1hcCA9IHJlcXVpcmUoJy4vX2FycmF5TWFwJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udmFsdWVzYCBhbmQgYF8udmFsdWVzSW5gIHdoaWNoIGNyZWF0ZXMgYW5cbiAqIGFycmF5IG9mIGBvYmplY3RgIHByb3BlcnR5IHZhbHVlcyBjb3JyZXNwb25kaW5nIHRvIHRoZSBwcm9wZXJ0eSBuYW1lc1xuICogb2YgYHByb3BzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheX0gcHJvcHMgVGhlIHByb3BlcnR5IG5hbWVzIHRvIGdldCB2YWx1ZXMgZm9yLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgdmFsdWVzLlxuICovXG5mdW5jdGlvbiBiYXNlVmFsdWVzKG9iamVjdCwgcHJvcHMpIHtcbiAgcmV0dXJuIGFycmF5TWFwKHByb3BzLCBmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gb2JqZWN0W2tleV07XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VWYWx1ZXM7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBhIGBjYWNoZWAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IGNhY2hlIFRoZSBjYWNoZSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBjYWNoZUhhcyhjYWNoZSwga2V5KSB7XG4gIHJldHVybiBjYWNoZS5oYXMoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjYWNoZUhhcztcbiIsInZhciBpc0FycmF5TGlrZU9iamVjdCA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2VPYmplY3QnKTtcblxuLyoqXG4gKiBDYXN0cyBgdmFsdWVgIHRvIGFuIGVtcHR5IGFycmF5IGlmIGl0J3Mgbm90IGFuIGFycmF5IGxpa2Ugb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge0FycmF5fE9iamVjdH0gUmV0dXJucyB0aGUgY2FzdCBhcnJheS1saWtlIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gY2FzdEFycmF5TGlrZU9iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gaXNBcnJheUxpa2VPYmplY3QodmFsdWUpID8gdmFsdWUgOiBbXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjYXN0QXJyYXlMaWtlT2JqZWN0O1xuIiwidmFyIGlkZW50aXR5ID0gcmVxdWlyZSgnLi9pZGVudGl0eScpO1xuXG4vKipcbiAqIENhc3RzIGB2YWx1ZWAgdG8gYGlkZW50aXR5YCBpZiBpdCdzIG5vdCBhIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGNhc3QgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNhc3RGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbicgPyB2YWx1ZSA6IGlkZW50aXR5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNhc3RGdW5jdGlvbjtcbiIsInZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNLZXkgPSByZXF1aXJlKCcuL19pc0tleScpLFxuICAgIHN0cmluZ1RvUGF0aCA9IHJlcXVpcmUoJy4vX3N0cmluZ1RvUGF0aCcpLFxuICAgIHRvU3RyaW5nID0gcmVxdWlyZSgnLi90b1N0cmluZycpO1xuXG4vKipcbiAqIENhc3RzIGB2YWx1ZWAgdG8gYSBwYXRoIGFycmF5IGlmIGl0J3Mgbm90IG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5IGtleXMgb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGNhc3QgcHJvcGVydHkgcGF0aCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gY2FzdFBhdGgodmFsdWUsIG9iamVjdCkge1xuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIGlzS2V5KHZhbHVlLCBvYmplY3QpID8gW3ZhbHVlXSA6IHN0cmluZ1RvUGF0aCh0b1N0cmluZyh2YWx1ZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNhc3RQYXRoO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvdmVycmVhY2hpbmcgY29yZS1qcyBzaGltcy4gKi9cbnZhciBjb3JlSnNEYXRhID0gcm9vdFsnX19jb3JlLWpzX3NoYXJlZF9fJ107XG5cbm1vZHVsZS5leHBvcnRzID0gY29yZUpzRGF0YTtcbiIsInZhciBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgYGJhc2VFYWNoYCBvciBgYmFzZUVhY2hSaWdodGAgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVhY2hGdW5jIFRoZSBmdW5jdGlvbiB0byBpdGVyYXRlIG92ZXIgYSBjb2xsZWN0aW9uLlxuICogQHBhcmFtIHtib29sZWFufSBbZnJvbVJpZ2h0XSBTcGVjaWZ5IGl0ZXJhdGluZyBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBiYXNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVCYXNlRWFjaChlYWNoRnVuYywgZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICAgIGlmIChjb2xsZWN0aW9uID09IG51bGwpIHtcbiAgICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICAgIH1cbiAgICBpZiAoIWlzQXJyYXlMaWtlKGNvbGxlY3Rpb24pKSB7XG4gICAgICByZXR1cm4gZWFjaEZ1bmMoY29sbGVjdGlvbiwgaXRlcmF0ZWUpO1xuICAgIH1cbiAgICB2YXIgbGVuZ3RoID0gY29sbGVjdGlvbi5sZW5ndGgsXG4gICAgICAgIGluZGV4ID0gZnJvbVJpZ2h0ID8gbGVuZ3RoIDogLTEsXG4gICAgICAgIGl0ZXJhYmxlID0gT2JqZWN0KGNvbGxlY3Rpb24pO1xuXG4gICAgd2hpbGUgKChmcm9tUmlnaHQgPyBpbmRleC0tIDogKytpbmRleCA8IGxlbmd0aCkpIHtcbiAgICAgIGlmIChpdGVyYXRlZShpdGVyYWJsZVtpbmRleF0sIGluZGV4LCBpdGVyYWJsZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCYXNlRWFjaDtcbiIsIi8qKlxuICogQ3JlYXRlcyBhIGJhc2UgZnVuY3Rpb24gZm9yIG1ldGhvZHMgbGlrZSBgXy5mb3JJbmAgYW5kIGBfLmZvck93bmAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmFzZUZvcihmcm9tUmlnaHQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCwgaXRlcmF0ZWUsIGtleXNGdW5jKSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGl0ZXJhYmxlID0gT2JqZWN0KG9iamVjdCksXG4gICAgICAgIHByb3BzID0ga2V5c0Z1bmMob2JqZWN0KSxcbiAgICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gICAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgICB2YXIga2V5ID0gcHJvcHNbZnJvbVJpZ2h0ID8gbGVuZ3RoIDogKytpbmRleF07XG4gICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVba2V5XSwga2V5LCBpdGVyYWJsZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJhc2VGb3I7XG4iLCJ2YXIgYmFzZUl0ZXJhdGVlID0gcmVxdWlyZSgnLi9fYmFzZUl0ZXJhdGVlJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBgXy5maW5kYCBvciBgXy5maW5kTGFzdGAgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZpbmRJbmRleEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGZpbmQgdGhlIGNvbGxlY3Rpb24gaW5kZXguXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmaW5kIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVGaW5kKGZpbmRJbmRleEZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGNvbGxlY3Rpb24sIHByZWRpY2F0ZSwgZnJvbUluZGV4KSB7XG4gICAgdmFyIGl0ZXJhYmxlID0gT2JqZWN0KGNvbGxlY3Rpb24pO1xuICAgIGlmICghaXNBcnJheUxpa2UoY29sbGVjdGlvbikpIHtcbiAgICAgIHZhciBpdGVyYXRlZSA9IGJhc2VJdGVyYXRlZShwcmVkaWNhdGUsIDMpO1xuICAgICAgY29sbGVjdGlvbiA9IGtleXMoY29sbGVjdGlvbik7XG4gICAgICBwcmVkaWNhdGUgPSBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIGl0ZXJhdGVlKGl0ZXJhYmxlW2tleV0sIGtleSwgaXRlcmFibGUpOyB9O1xuICAgIH1cbiAgICB2YXIgaW5kZXggPSBmaW5kSW5kZXhGdW5jKGNvbGxlY3Rpb24sIHByZWRpY2F0ZSwgZnJvbUluZGV4KTtcbiAgICByZXR1cm4gaW5kZXggPiAtMSA/IGl0ZXJhYmxlW2l0ZXJhdGVlID8gY29sbGVjdGlvbltpbmRleF0gOiBpbmRleF0gOiB1bmRlZmluZWQ7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlRmluZDtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKTtcblxudmFyIGRlZmluZVByb3BlcnR5ID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIHZhciBmdW5jID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2RlZmluZVByb3BlcnR5Jyk7XG4gICAgZnVuYyh7fSwgJycsIHt9KTtcbiAgICByZXR1cm4gZnVuYztcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZGVmaW5lUHJvcGVydHk7XG4iLCJ2YXIgU2V0Q2FjaGUgPSByZXF1aXJlKCcuL19TZXRDYWNoZScpLFxuICAgIGFycmF5U29tZSA9IHJlcXVpcmUoJy4vX2FycmF5U29tZScpLFxuICAgIGNhY2hlSGFzID0gcmVxdWlyZSgnLi9fY2FjaGVIYXMnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgdmFsdWUgY29tcGFyaXNvbnMuICovXG52YXIgQ09NUEFSRV9QQVJUSUFMX0ZMQUcgPSAxLFxuICAgIENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcgPSAyO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3IgYXJyYXlzIHdpdGggc3VwcG9ydCBmb3JcbiAqIHBhcnRpYWwgZGVlcCBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge0FycmF5fSBvdGhlciBUaGUgb3RoZXIgYXJyYXkgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYCBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYGFycmF5YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcnJheXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxBcnJheXMoYXJyYXksIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHZhciBpc1BhcnRpYWwgPSBiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUcsXG4gICAgICBhcnJMZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBvdGhMZW5ndGggPSBvdGhlci5sZW5ndGg7XG5cbiAgaWYgKGFyckxlbmd0aCAhPSBvdGhMZW5ndGggJiYgIShpc1BhcnRpYWwgJiYgb3RoTGVuZ3RoID4gYXJyTGVuZ3RoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KGFycmF5KTtcbiAgaWYgKHN0YWNrZWQgJiYgc3RhY2suZ2V0KG90aGVyKSkge1xuICAgIHJldHVybiBzdGFja2VkID09IG90aGVyO1xuICB9XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gdHJ1ZSxcbiAgICAgIHNlZW4gPSAoYml0bWFzayAmIENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcpID8gbmV3IFNldENhY2hlIDogdW5kZWZpbmVkO1xuXG4gIHN0YWNrLnNldChhcnJheSwgb3RoZXIpO1xuICBzdGFjay5zZXQob3RoZXIsIGFycmF5KTtcblxuICAvLyBJZ25vcmUgbm9uLWluZGV4IHByb3BlcnRpZXMuXG4gIHdoaWxlICgrK2luZGV4IDwgYXJyTGVuZ3RoKSB7XG4gICAgdmFyIGFyclZhbHVlID0gYXJyYXlbaW5kZXhdLFxuICAgICAgICBvdGhWYWx1ZSA9IG90aGVyW2luZGV4XTtcblxuICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICB2YXIgY29tcGFyZWQgPSBpc1BhcnRpYWxcbiAgICAgICAgPyBjdXN0b21pemVyKG90aFZhbHVlLCBhcnJWYWx1ZSwgaW5kZXgsIG90aGVyLCBhcnJheSwgc3RhY2spXG4gICAgICAgIDogY3VzdG9taXplcihhcnJWYWx1ZSwgb3RoVmFsdWUsIGluZGV4LCBhcnJheSwgb3RoZXIsIHN0YWNrKTtcbiAgICB9XG4gICAgaWYgKGNvbXBhcmVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChjb21wYXJlZCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgaWYgKHNlZW4pIHtcbiAgICAgIGlmICghYXJyYXlTb21lKG90aGVyLCBmdW5jdGlvbihvdGhWYWx1ZSwgb3RoSW5kZXgpIHtcbiAgICAgICAgICAgIGlmICghY2FjaGVIYXMoc2Vlbiwgb3RoSW5kZXgpICYmXG4gICAgICAgICAgICAgICAgKGFyclZhbHVlID09PSBvdGhWYWx1ZSB8fCBlcXVhbEZ1bmMoYXJyVmFsdWUsIG90aFZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaykpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzZWVuLnB1c2gob3RoSW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pKSB7XG4gICAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCEoXG4gICAgICAgICAgYXJyVmFsdWUgPT09IG90aFZhbHVlIHx8XG4gICAgICAgICAgICBlcXVhbEZ1bmMoYXJyVmFsdWUsIG90aFZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaylcbiAgICAgICAgKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgc3RhY2tbJ2RlbGV0ZSddKGFycmF5KTtcbiAgc3RhY2tbJ2RlbGV0ZSddKG90aGVyKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlcXVhbEFycmF5cztcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBVaW50OEFycmF5ID0gcmVxdWlyZSgnLi9fVWludDhBcnJheScpLFxuICAgIGVxID0gcmVxdWlyZSgnLi9lcScpLFxuICAgIGVxdWFsQXJyYXlzID0gcmVxdWlyZSgnLi9fZXF1YWxBcnJheXMnKSxcbiAgICBtYXBUb0FycmF5ID0gcmVxdWlyZSgnLi9fbWFwVG9BcnJheScpLFxuICAgIHNldFRvQXJyYXkgPSByZXF1aXJlKCcuL19zZXRUb0FycmF5Jyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHZhbHVlIGNvbXBhcmlzb25zLiAqL1xudmFyIENPTVBBUkVfUEFSVElBTF9GTEFHID0gMSxcbiAgICBDT01QQVJFX1VOT1JERVJFRF9GTEFHID0gMjtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBlcnJvclRhZyA9ICdbb2JqZWN0IEVycm9yXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nO1xuXG4vKiogVXNlZCB0byBjb252ZXJ0IHN5bWJvbHMgdG8gcHJpbWl0aXZlcyBhbmQgc3RyaW5ncy4gKi9cbnZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG4gICAgc3ltYm9sVmFsdWVPZiA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udmFsdWVPZiA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIGNvbXBhcmluZyBvYmplY3RzIG9mXG4gKiB0aGUgc2FtZSBgdG9TdHJpbmdUYWdgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIG9ubHkgc3VwcG9ydHMgY29tcGFyaW5nIHZhbHVlcyB3aXRoIHRhZ3Mgb2ZcbiAqIGBCb29sZWFuYCwgYERhdGVgLCBgRXJyb3JgLCBgTnVtYmVyYCwgYFJlZ0V4cGAsIG9yIGBTdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFnIFRoZSBgdG9TdHJpbmdUYWdgIG9mIHRoZSBvYmplY3RzIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBvYmplY3RgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxCeVRhZyhvYmplY3QsIG90aGVyLCB0YWcsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgc3dpdGNoICh0YWcpIHtcbiAgICBjYXNlIGRhdGFWaWV3VGFnOlxuICAgICAgaWYgKChvYmplY3QuYnl0ZUxlbmd0aCAhPSBvdGhlci5ieXRlTGVuZ3RoKSB8fFxuICAgICAgICAgIChvYmplY3QuYnl0ZU9mZnNldCAhPSBvdGhlci5ieXRlT2Zmc2V0KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBvYmplY3QgPSBvYmplY3QuYnVmZmVyO1xuICAgICAgb3RoZXIgPSBvdGhlci5idWZmZXI7XG5cbiAgICBjYXNlIGFycmF5QnVmZmVyVGFnOlxuICAgICAgaWYgKChvYmplY3QuYnl0ZUxlbmd0aCAhPSBvdGhlci5ieXRlTGVuZ3RoKSB8fFxuICAgICAgICAgICFlcXVhbEZ1bmMobmV3IFVpbnQ4QXJyYXkob2JqZWN0KSwgbmV3IFVpbnQ4QXJyYXkob3RoZXIpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIGNhc2UgYm9vbFRhZzpcbiAgICBjYXNlIGRhdGVUYWc6XG4gICAgY2FzZSBudW1iZXJUYWc6XG4gICAgICAvLyBDb2VyY2UgYm9vbGVhbnMgdG8gYDFgIG9yIGAwYCBhbmQgZGF0ZXMgdG8gbWlsbGlzZWNvbmRzLlxuICAgICAgLy8gSW52YWxpZCBkYXRlcyBhcmUgY29lcmNlZCB0byBgTmFOYC5cbiAgICAgIHJldHVybiBlcSgrb2JqZWN0LCArb3RoZXIpO1xuXG4gICAgY2FzZSBlcnJvclRhZzpcbiAgICAgIHJldHVybiBvYmplY3QubmFtZSA9PSBvdGhlci5uYW1lICYmIG9iamVjdC5tZXNzYWdlID09IG90aGVyLm1lc3NhZ2U7XG5cbiAgICBjYXNlIHJlZ2V4cFRhZzpcbiAgICBjYXNlIHN0cmluZ1RhZzpcbiAgICAgIC8vIENvZXJjZSByZWdleGVzIHRvIHN0cmluZ3MgYW5kIHRyZWF0IHN0cmluZ3MsIHByaW1pdGl2ZXMgYW5kIG9iamVjdHMsXG4gICAgICAvLyBhcyBlcXVhbC4gU2VlIGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1yZWdleHAucHJvdG90eXBlLnRvc3RyaW5nXG4gICAgICAvLyBmb3IgbW9yZSBkZXRhaWxzLlxuICAgICAgcmV0dXJuIG9iamVjdCA9PSAob3RoZXIgKyAnJyk7XG5cbiAgICBjYXNlIG1hcFRhZzpcbiAgICAgIHZhciBjb252ZXJ0ID0gbWFwVG9BcnJheTtcblxuICAgIGNhc2Ugc2V0VGFnOlxuICAgICAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRztcbiAgICAgIGNvbnZlcnQgfHwgKGNvbnZlcnQgPSBzZXRUb0FycmF5KTtcblxuICAgICAgaWYgKG9iamVjdC5zaXplICE9IG90aGVyLnNpemUgJiYgIWlzUGFydGlhbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gICAgICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldChvYmplY3QpO1xuICAgICAgaWYgKHN0YWNrZWQpIHtcbiAgICAgICAgcmV0dXJuIHN0YWNrZWQgPT0gb3RoZXI7XG4gICAgICB9XG4gICAgICBiaXRtYXNrIHw9IENPTVBBUkVfVU5PUkRFUkVEX0ZMQUc7XG5cbiAgICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgICAgc3RhY2suc2V0KG9iamVjdCwgb3RoZXIpO1xuICAgICAgdmFyIHJlc3VsdCA9IGVxdWFsQXJyYXlzKGNvbnZlcnQob2JqZWN0KSwgY29udmVydChvdGhlciksIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spO1xuICAgICAgc3RhY2tbJ2RlbGV0ZSddKG9iamVjdCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuXG4gICAgY2FzZSBzeW1ib2xUYWc6XG4gICAgICBpZiAoc3ltYm9sVmFsdWVPZikge1xuICAgICAgICByZXR1cm4gc3ltYm9sVmFsdWVPZi5jYWxsKG9iamVjdCkgPT0gc3ltYm9sVmFsdWVPZi5jYWxsKG90aGVyKTtcbiAgICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXF1YWxCeVRhZztcbiIsInZhciBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHZhbHVlIGNvbXBhcmlzb25zLiAqL1xudmFyIENPTVBBUkVfUEFSVElBTF9GTEFHID0gMTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIG9iamVjdHMgd2l0aCBzdXBwb3J0IGZvclxuICogcGFydGlhbCBkZWVwIGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBvYmplY3RgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxPYmplY3RzKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spIHtcbiAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBDT01QQVJFX1BBUlRJQUxfRkxBRyxcbiAgICAgIG9ialByb3BzID0ga2V5cyhvYmplY3QpLFxuICAgICAgb2JqTGVuZ3RoID0gb2JqUHJvcHMubGVuZ3RoLFxuICAgICAgb3RoUHJvcHMgPSBrZXlzKG90aGVyKSxcbiAgICAgIG90aExlbmd0aCA9IG90aFByb3BzLmxlbmd0aDtcblxuICBpZiAob2JqTGVuZ3RoICE9IG90aExlbmd0aCAmJiAhaXNQYXJ0aWFsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBpbmRleCA9IG9iakxlbmd0aDtcbiAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICB2YXIga2V5ID0gb2JqUHJvcHNbaW5kZXhdO1xuICAgIGlmICghKGlzUGFydGlhbCA/IGtleSBpbiBvdGhlciA6IGhhc093blByb3BlcnR5LmNhbGwob3RoZXIsIGtleSkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIC8vIEFzc3VtZSBjeWNsaWMgdmFsdWVzIGFyZSBlcXVhbC5cbiAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQob2JqZWN0KTtcbiAgaWYgKHN0YWNrZWQgJiYgc3RhY2suZ2V0KG90aGVyKSkge1xuICAgIHJldHVybiBzdGFja2VkID09IG90aGVyO1xuICB9XG4gIHZhciByZXN1bHQgPSB0cnVlO1xuICBzdGFjay5zZXQob2JqZWN0LCBvdGhlcik7XG4gIHN0YWNrLnNldChvdGhlciwgb2JqZWN0KTtcblxuICB2YXIgc2tpcEN0b3IgPSBpc1BhcnRpYWw7XG4gIHdoaWxlICgrK2luZGV4IDwgb2JqTGVuZ3RoKSB7XG4gICAga2V5ID0gb2JqUHJvcHNbaW5kZXhdO1xuICAgIHZhciBvYmpWYWx1ZSA9IG9iamVjdFtrZXldLFxuICAgICAgICBvdGhWYWx1ZSA9IG90aGVyW2tleV07XG5cbiAgICBpZiAoY3VzdG9taXplcikge1xuICAgICAgdmFyIGNvbXBhcmVkID0gaXNQYXJ0aWFsXG4gICAgICAgID8gY3VzdG9taXplcihvdGhWYWx1ZSwgb2JqVmFsdWUsIGtleSwgb3RoZXIsIG9iamVjdCwgc3RhY2spXG4gICAgICAgIDogY3VzdG9taXplcihvYmpWYWx1ZSwgb3RoVmFsdWUsIGtleSwgb2JqZWN0LCBvdGhlciwgc3RhY2spO1xuICAgIH1cbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICBpZiAoIShjb21wYXJlZCA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgPyAob2JqVmFsdWUgPT09IG90aFZhbHVlIHx8IGVxdWFsRnVuYyhvYmpWYWx1ZSwgb3RoVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKSlcbiAgICAgICAgICA6IGNvbXBhcmVkXG4gICAgICAgICkpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHNraXBDdG9yIHx8IChza2lwQ3RvciA9IGtleSA9PSAnY29uc3RydWN0b3InKTtcbiAgfVxuICBpZiAocmVzdWx0ICYmICFza2lwQ3Rvcikge1xuICAgIHZhciBvYmpDdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yLFxuICAgICAgICBvdGhDdG9yID0gb3RoZXIuY29uc3RydWN0b3I7XG5cbiAgICAvLyBOb24gYE9iamVjdGAgb2JqZWN0IGluc3RhbmNlcyB3aXRoIGRpZmZlcmVudCBjb25zdHJ1Y3RvcnMgYXJlIG5vdCBlcXVhbC5cbiAgICBpZiAob2JqQ3RvciAhPSBvdGhDdG9yICYmXG4gICAgICAgICgnY29uc3RydWN0b3InIGluIG9iamVjdCAmJiAnY29uc3RydWN0b3InIGluIG90aGVyKSAmJlxuICAgICAgICAhKHR5cGVvZiBvYmpDdG9yID09ICdmdW5jdGlvbicgJiYgb2JqQ3RvciBpbnN0YW5jZW9mIG9iakN0b3IgJiZcbiAgICAgICAgICB0eXBlb2Ygb3RoQ3RvciA9PSAnZnVuY3Rpb24nICYmIG90aEN0b3IgaW5zdGFuY2VvZiBvdGhDdG9yKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgfVxuICB9XG4gIHN0YWNrWydkZWxldGUnXShvYmplY3QpO1xuICBzdGFja1snZGVsZXRlJ10ob3RoZXIpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxdWFsT2JqZWN0cztcbiIsInZhciBmbGF0dGVuID0gcmVxdWlyZSgnLi9mbGF0dGVuJyksXG4gICAgb3ZlclJlc3QgPSByZXF1aXJlKCcuL19vdmVyUmVzdCcpLFxuICAgIHNldFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fc2V0VG9TdHJpbmcnKTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VSZXN0YCB3aGljaCBmbGF0dGVucyB0aGUgcmVzdCBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBmbGF0UmVzdChmdW5jKSB7XG4gIHJldHVybiBzZXRUb1N0cmluZyhvdmVyUmVzdChmdW5jLCB1bmRlZmluZWQsIGZsYXR0ZW4pLCBmdW5jICsgJycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZsYXRSZXN0O1xuIiwiLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxubW9kdWxlLmV4cG9ydHMgPSBmcmVlR2xvYmFsO1xuIiwidmFyIGlzS2V5YWJsZSA9IHJlcXVpcmUoJy4vX2lzS2V5YWJsZScpO1xuXG4vKipcbiAqIEdldHMgdGhlIGRhdGEgZm9yIGBtYXBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSByZWZlcmVuY2Uga2V5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIG1hcCBkYXRhLlxuICovXG5mdW5jdGlvbiBnZXRNYXBEYXRhKG1hcCwga2V5KSB7XG4gIHZhciBkYXRhID0gbWFwLl9fZGF0YV9fO1xuICByZXR1cm4gaXNLZXlhYmxlKGtleSlcbiAgICA/IGRhdGFbdHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/ICdzdHJpbmcnIDogJ2hhc2gnXVxuICAgIDogZGF0YS5tYXA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TWFwRGF0YTtcbiIsInZhciBpc1N0cmljdENvbXBhcmFibGUgPSByZXF1aXJlKCcuL19pc1N0cmljdENvbXBhcmFibGUnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgcHJvcGVydHkgbmFtZXMsIHZhbHVlcywgYW5kIGNvbXBhcmUgZmxhZ3Mgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbWF0Y2ggZGF0YSBvZiBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gZ2V0TWF0Y2hEYXRhKG9iamVjdCkge1xuICB2YXIgcmVzdWx0ID0ga2V5cyhvYmplY3QpLFxuICAgICAgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDtcblxuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICB2YXIga2V5ID0gcmVzdWx0W2xlbmd0aF0sXG4gICAgICAgIHZhbHVlID0gb2JqZWN0W2tleV07XG5cbiAgICByZXN1bHRbbGVuZ3RoXSA9IFtrZXksIHZhbHVlLCBpc1N0cmljdENvbXBhcmFibGUodmFsdWUpXTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldE1hdGNoRGF0YTtcbiIsInZhciBiYXNlSXNOYXRpdmUgPSByZXF1aXJlKCcuL19iYXNlSXNOYXRpdmUnKSxcbiAgICBnZXRWYWx1ZSA9IHJlcXVpcmUoJy4vX2dldFZhbHVlJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBnZXRWYWx1ZShvYmplY3QsIGtleSk7XG4gIHJldHVybiBiYXNlSXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TmF0aXZlO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UmF3VGFnO1xuIiwidmFyIERhdGFWaWV3ID0gcmVxdWlyZSgnLi9fRGF0YVZpZXcnKSxcbiAgICBNYXAgPSByZXF1aXJlKCcuL19NYXAnKSxcbiAgICBQcm9taXNlID0gcmVxdWlyZSgnLi9fUHJvbWlzZScpLFxuICAgIFNldCA9IHJlcXVpcmUoJy4vX1NldCcpLFxuICAgIFdlYWtNYXAgPSByZXF1aXJlKCcuL19XZWFrTWFwJyksXG4gICAgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICB0b1NvdXJjZSA9IHJlcXVpcmUoJy4vX3RvU291cmNlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICBwcm9taXNlVGFnID0gJ1tvYmplY3QgUHJvbWlzZV0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XSc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtYXBzLCBzZXRzLCBhbmQgd2Vha21hcHMuICovXG52YXIgZGF0YVZpZXdDdG9yU3RyaW5nID0gdG9Tb3VyY2UoRGF0YVZpZXcpLFxuICAgIG1hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShNYXApLFxuICAgIHByb21pc2VDdG9yU3RyaW5nID0gdG9Tb3VyY2UoUHJvbWlzZSksXG4gICAgc2V0Q3RvclN0cmluZyA9IHRvU291cmNlKFNldCksXG4gICAgd2Vha01hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShXZWFrTWFwKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBgdG9TdHJpbmdUYWdgIG9mIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xudmFyIGdldFRhZyA9IGJhc2VHZXRUYWc7XG5cbi8vIEZhbGxiYWNrIGZvciBkYXRhIHZpZXdzLCBtYXBzLCBzZXRzLCBhbmQgd2VhayBtYXBzIGluIElFIDExIGFuZCBwcm9taXNlcyBpbiBOb2RlLmpzIDwgNi5cbmlmICgoRGF0YVZpZXcgJiYgZ2V0VGFnKG5ldyBEYXRhVmlldyhuZXcgQXJyYXlCdWZmZXIoMSkpKSAhPSBkYXRhVmlld1RhZykgfHxcbiAgICAoTWFwICYmIGdldFRhZyhuZXcgTWFwKSAhPSBtYXBUYWcpIHx8XG4gICAgKFByb21pc2UgJiYgZ2V0VGFnKFByb21pc2UucmVzb2x2ZSgpKSAhPSBwcm9taXNlVGFnKSB8fFxuICAgIChTZXQgJiYgZ2V0VGFnKG5ldyBTZXQpICE9IHNldFRhZykgfHxcbiAgICAoV2Vha01hcCAmJiBnZXRUYWcobmV3IFdlYWtNYXApICE9IHdlYWtNYXBUYWcpKSB7XG4gIGdldFRhZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGJhc2VHZXRUYWcodmFsdWUpLFxuICAgICAgICBDdG9yID0gcmVzdWx0ID09IG9iamVjdFRhZyA/IHZhbHVlLmNvbnN0cnVjdG9yIDogdW5kZWZpbmVkLFxuICAgICAgICBjdG9yU3RyaW5nID0gQ3RvciA/IHRvU291cmNlKEN0b3IpIDogJyc7XG5cbiAgICBpZiAoY3RvclN0cmluZykge1xuICAgICAgc3dpdGNoIChjdG9yU3RyaW5nKSB7XG4gICAgICAgIGNhc2UgZGF0YVZpZXdDdG9yU3RyaW5nOiByZXR1cm4gZGF0YVZpZXdUYWc7XG4gICAgICAgIGNhc2UgbWFwQ3RvclN0cmluZzogcmV0dXJuIG1hcFRhZztcbiAgICAgICAgY2FzZSBwcm9taXNlQ3RvclN0cmluZzogcmV0dXJuIHByb21pc2VUYWc7XG4gICAgICAgIGNhc2Ugc2V0Q3RvclN0cmluZzogcmV0dXJuIHNldFRhZztcbiAgICAgICAgY2FzZSB3ZWFrTWFwQ3RvclN0cmluZzogcmV0dXJuIHdlYWtNYXBUYWc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VGFnO1xuIiwiLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0VmFsdWUob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VmFsdWU7XG4iLCJ2YXIgY2FzdFBhdGggPSByZXF1aXJlKCcuL19jYXN0UGF0aCcpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi9faXNJbmRleCcpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpLFxuICAgIHRvS2V5ID0gcmVxdWlyZSgnLi9fdG9LZXknKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHBhdGhgIGV4aXN0cyBvbiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggdG8gY2hlY2suXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYXNGdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjayBwcm9wZXJ0aWVzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBwYXRoYCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzUGF0aChvYmplY3QsIHBhdGgsIGhhc0Z1bmMpIHtcbiAgcGF0aCA9IGNhc3RQYXRoKHBhdGgsIG9iamVjdCk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwYXRoLmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHRvS2V5KHBhdGhbaW5kZXhdKTtcbiAgICBpZiAoIShyZXN1bHQgPSBvYmplY3QgIT0gbnVsbCAmJiBoYXNGdW5jKG9iamVjdCwga2V5KSkpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBvYmplY3QgPSBvYmplY3Rba2V5XTtcbiAgfVxuICBpZiAocmVzdWx0IHx8ICsraW5kZXggIT0gbGVuZ3RoKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBsZW5ndGggPSBvYmplY3QgPT0gbnVsbCA/IDAgOiBvYmplY3QubGVuZ3RoO1xuICByZXR1cm4gISFsZW5ndGggJiYgaXNMZW5ndGgobGVuZ3RoKSAmJiBpc0luZGV4KGtleSwgbGVuZ3RoKSAmJlxuICAgIChpc0FycmF5KG9iamVjdCkgfHwgaXNBcmd1bWVudHMob2JqZWN0KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzUGF0aDtcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIEhhc2hcbiAqL1xuZnVuY3Rpb24gaGFzaENsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gbmF0aXZlQ3JlYXRlID8gbmF0aXZlQ3JlYXRlKG51bGwpIDoge307XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaENsZWFyO1xuIiwiLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtPYmplY3R9IGhhc2ggVGhlIGhhc2ggdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSB0aGlzLmhhcyhrZXkpICYmIGRlbGV0ZSB0aGlzLl9fZGF0YV9fW2tleV07XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoRGVsZXRlO1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogR2V0cyB0aGUgaGFzaCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBoYXNoR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChuYXRpdmVDcmVhdGUpIHtcbiAgICB2YXIgcmVzdWx0ID0gZGF0YVtrZXldO1xuICAgIHJldHVybiByZXN1bHQgPT09IEhBU0hfVU5ERUZJTkVEID8gdW5kZWZpbmVkIDogcmVzdWx0O1xuICB9XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSkgPyBkYXRhW2tleV0gOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaEdldDtcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBoYXNoIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoSGFzKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHJldHVybiBuYXRpdmVDcmVhdGUgPyBkYXRhW2tleV0gIT09IHVuZGVmaW5lZCA6IGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoSGFzO1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKlxuICogU2V0cyB0aGUgaGFzaCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGhhc2ggaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGhhc2hTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHRoaXMuc2l6ZSArPSB0aGlzLmhhcyhrZXkpID8gMCA6IDE7XG4gIGRhdGFba2V5XSA9IChuYXRpdmVDcmVhdGUgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkgPyBIQVNIX1VOREVGSU5FRCA6IHZhbHVlO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoU2V0O1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ByZWFkYWJsZVN5bWJvbCA9IFN5bWJvbCA/IFN5bWJvbC5pc0NvbmNhdFNwcmVhZGFibGUgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBmbGF0dGVuYWJsZSBgYXJndW1lbnRzYCBvYmplY3Qgb3IgYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgZmxhdHRlbmFibGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNGbGF0dGVuYWJsZSh2YWx1ZSkge1xuICByZXR1cm4gaXNBcnJheSh2YWx1ZSkgfHwgaXNBcmd1bWVudHModmFsdWUpIHx8XG4gICAgISEoc3ByZWFkYWJsZVN5bWJvbCAmJiB2YWx1ZSAmJiB2YWx1ZVtzcHJlYWRhYmxlU3ltYm9sXSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGbGF0dGVuYWJsZTtcbiIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgdW5zaWduZWQgaW50ZWdlciB2YWx1ZXMuICovXG52YXIgcmVJc1VpbnQgPSAvXig/OjB8WzEtOV1cXGQqKSQvO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiAhIWxlbmd0aCAmJlxuICAgICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgfHwgcmVJc1VpbnQudGVzdCh2YWx1ZSkpICYmXG4gICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzSW5kZXg7XG4iLCJ2YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzU3ltYm9sID0gcmVxdWlyZSgnLi9pc1N5bWJvbCcpO1xuXG4vKiogVXNlZCB0byBtYXRjaCBwcm9wZXJ0eSBuYW1lcyB3aXRoaW4gcHJvcGVydHkgcGF0aHMuICovXG52YXIgcmVJc0RlZXBQcm9wID0gL1xcLnxcXFsoPzpbXltcXF1dKnwoW1wiJ10pKD86KD8hXFwxKVteXFxcXF18XFxcXC4pKj9cXDEpXFxdLyxcbiAgICByZUlzUGxhaW5Qcm9wID0gL15cXHcqJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBwcm9wZXJ0eSBuYW1lIGFuZCBub3QgYSBwcm9wZXJ0eSBwYXRoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5IGtleXMgb24uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3BlcnR5IG5hbWUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXkodmFsdWUsIG9iamVjdCkge1xuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIGlmICh0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicgfHxcbiAgICAgIHZhbHVlID09IG51bGwgfHwgaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIHJlSXNQbGFpblByb3AudGVzdCh2YWx1ZSkgfHwgIXJlSXNEZWVwUHJvcC50ZXN0KHZhbHVlKSB8fFxuICAgIChvYmplY3QgIT0gbnVsbCAmJiB2YWx1ZSBpbiBPYmplY3Qob2JqZWN0KSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNLZXk7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciB1c2UgYXMgdW5pcXVlIG9iamVjdCBrZXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXlhYmxlKHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gKHR5cGUgPT0gJ3N0cmluZycgfHwgdHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nKVxuICAgID8gKHZhbHVlICE9PSAnX19wcm90b19fJylcbiAgICA6ICh2YWx1ZSA9PT0gbnVsbCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNLZXlhYmxlO1xuIiwidmFyIGNvcmVKc0RhdGEgPSByZXF1aXJlKCcuL19jb3JlSnNEYXRhJyk7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtZXRob2RzIG1hc3F1ZXJhZGluZyBhcyBuYXRpdmUuICovXG52YXIgbWFza1NyY0tleSA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHVpZCA9IC9bXi5dKyQvLmV4ZWMoY29yZUpzRGF0YSAmJiBjb3JlSnNEYXRhLmtleXMgJiYgY29yZUpzRGF0YS5rZXlzLklFX1BST1RPIHx8ICcnKTtcbiAgcmV0dXJuIHVpZCA/ICgnU3ltYm9sKHNyYylfMS4nICsgdWlkKSA6ICcnO1xufSgpKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYGZ1bmNgIGhhcyBpdHMgc291cmNlIG1hc2tlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGZ1bmNgIGlzIG1hc2tlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc01hc2tlZChmdW5jKSB7XG4gIHJldHVybiAhIW1hc2tTcmNLZXkgJiYgKG1hc2tTcmNLZXkgaW4gZnVuYyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNNYXNrZWQ7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhIHByb3RvdHlwZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm90b3R5cGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNQcm90b3R5cGUodmFsdWUpIHtcbiAgdmFyIEN0b3IgPSB2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvcixcbiAgICAgIHByb3RvID0gKHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUpIHx8IG9iamVjdFByb3RvO1xuXG4gIHJldHVybiB2YWx1ZSA9PT0gcHJvdG87XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNQcm90b3R5cGU7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUgZm9yIHN0cmljdCBlcXVhbGl0eSBjb21wYXJpc29ucywgaS5lLiBgPT09YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpZiBzdWl0YWJsZSBmb3Igc3RyaWN0XG4gKiAgZXF1YWxpdHkgY29tcGFyaXNvbnMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNTdHJpY3RDb21wYXJhYmxlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgJiYgIWlzT2JqZWN0KHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1N0cmljdENvbXBhcmFibGU7XG4iLCIvKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUNsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gW107XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlQ2xlYXI7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBhcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzcGxpY2UgPSBhcnJheVByb3RvLnNwbGljZTtcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGxhc3RJbmRleCA9IGRhdGEubGVuZ3RoIC0gMTtcbiAgaWYgKGluZGV4ID09IGxhc3RJbmRleCkge1xuICAgIGRhdGEucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgc3BsaWNlLmNhbGwoZGF0YSwgaW5kZXgsIDEpO1xuICB9XG4gIC0tdGhpcy5zaXplO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVEZWxldGU7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICByZXR1cm4gaW5kZXggPCAwID8gdW5kZWZpbmVkIDogZGF0YVtpbmRleF1bMV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlR2V0O1xuIiwidmFyIGFzc29jSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Fzc29jSW5kZXhPZicpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gYXNzb2NJbmRleE9mKHRoaXMuX19kYXRhX18sIGtleSkgPiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVIYXM7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogU2V0cyB0aGUgbGlzdCBjYWNoZSBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbGlzdCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgKyt0aGlzLnNpemU7XG4gICAgZGF0YS5wdXNoKFtrZXksIHZhbHVlXSk7XG4gIH0gZWxzZSB7XG4gICAgZGF0YVtpbmRleF1bMV0gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVTZXQ7XG4iLCJ2YXIgSGFzaCA9IHJlcXVpcmUoJy4vX0hhc2gnKSxcbiAgICBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKSxcbiAgICBNYXAgPSByZXF1aXJlKCcuL19NYXAnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVDbGVhcigpIHtcbiAgdGhpcy5zaXplID0gMDtcbiAgdGhpcy5fX2RhdGFfXyA9IHtcbiAgICAnaGFzaCc6IG5ldyBIYXNoLFxuICAgICdtYXAnOiBuZXcgKE1hcCB8fCBMaXN0Q2FjaGUpLFxuICAgICdzdHJpbmcnOiBuZXcgSGFzaFxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlQ2xlYXI7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpWydkZWxldGUnXShrZXkpO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVEZWxldGU7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBtYXAgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlR2V0KGtleSkge1xuICByZXR1cm4gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLmdldChrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlR2V0O1xuIiwidmFyIGdldE1hcERhdGEgPSByZXF1aXJlKCcuL19nZXRNYXBEYXRhJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbWFwIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuaGFzKGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVIYXM7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBTZXRzIHRoZSBtYXAgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbWFwIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLFxuICAgICAgc2l6ZSA9IGRhdGEuc2l6ZTtcblxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplICs9IGRhdGEuc2l6ZSA9PSBzaXplID8gMCA6IDE7XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlU2V0O1xuIiwiLyoqXG4gKiBDb252ZXJ0cyBgbWFwYCB0byBpdHMga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUga2V5LXZhbHVlIHBhaXJzLlxuICovXG5mdW5jdGlvbiBtYXBUb0FycmF5KG1hcCkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG1hcC5zaXplKTtcblxuICBtYXAuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gW2tleSwgdmFsdWVdO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBUb0FycmF5O1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYG1hdGNoZXNQcm9wZXJ0eWAgZm9yIHNvdXJjZSB2YWx1ZXMgc3VpdGFibGVcbiAqIGZvciBzdHJpY3QgZXF1YWxpdHkgY29tcGFyaXNvbnMsIGkuZS4gYD09PWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHBhcmFtIHsqfSBzcmNWYWx1ZSBUaGUgdmFsdWUgdG8gbWF0Y2guXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBzcGVjIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBtYXRjaGVzU3RyaWN0Q29tcGFyYWJsZShrZXksIHNyY1ZhbHVlKSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdFtrZXldID09PSBzcmNWYWx1ZSAmJlxuICAgICAgKHNyY1ZhbHVlICE9PSB1bmRlZmluZWQgfHwgKGtleSBpbiBPYmplY3Qob2JqZWN0KSkpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hdGNoZXNTdHJpY3RDb21wYXJhYmxlO1xuIiwidmFyIG1lbW9pemUgPSByZXF1aXJlKCcuL21lbW9pemUnKTtcblxuLyoqIFVzZWQgYXMgdGhlIG1heGltdW0gbWVtb2l6ZSBjYWNoZSBzaXplLiAqL1xudmFyIE1BWF9NRU1PSVpFX1NJWkUgPSA1MDA7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLm1lbW9pemVgIHdoaWNoIGNsZWFycyB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24nc1xuICogY2FjaGUgd2hlbiBpdCBleGNlZWRzIGBNQVhfTUVNT0laRV9TSVpFYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaGF2ZSBpdHMgb3V0cHV0IG1lbW9pemVkLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG1lbW9pemVDYXBwZWQoZnVuYykge1xuICB2YXIgcmVzdWx0ID0gbWVtb2l6ZShmdW5jLCBmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoY2FjaGUuc2l6ZSA9PT0gTUFYX01FTU9JWkVfU0laRSkge1xuICAgICAgY2FjaGUuY2xlYXIoKTtcbiAgICB9XG4gICAgcmV0dXJuIGtleTtcbiAgfSk7XG5cbiAgdmFyIGNhY2hlID0gcmVzdWx0LmNhY2hlO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1lbW9pemVDYXBwZWQ7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBuYXRpdmVDcmVhdGUgPSBnZXROYXRpdmUoT2JqZWN0LCAnY3JlYXRlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlQ3JlYXRlO1xuIiwidmFyIG92ZXJBcmcgPSByZXF1aXJlKCcuL19vdmVyQXJnJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVLZXlzID0gb3ZlckFyZyhPYmplY3Qua2V5cywgT2JqZWN0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBuYXRpdmVLZXlzO1xuIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBwcm9jZXNzYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZVByb2Nlc3MgPSBtb2R1bGVFeHBvcnRzICYmIGZyZWVHbG9iYWwucHJvY2VzcztcblxuLyoqIFVzZWQgdG8gYWNjZXNzIGZhc3RlciBOb2RlLmpzIGhlbHBlcnMuICovXG52YXIgbm9kZVV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGZyZWVQcm9jZXNzICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcgJiYgZnJlZVByb2Nlc3MuYmluZGluZygndXRpbCcpO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBub2RlVXRpbDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgdXNpbmcgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9iamVjdFRvU3RyaW5nO1xuIiwiLyoqXG4gKiBDcmVhdGVzIGEgdW5hcnkgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIGl0cyBhcmd1bWVudCB0cmFuc2Zvcm1lZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgYXJndW1lbnQgdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG92ZXJBcmcoZnVuYywgdHJhbnNmb3JtKSB7XG4gIHJldHVybiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gZnVuYyh0cmFuc2Zvcm0oYXJnKSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb3ZlckFyZztcbiIsInZhciBhcHBseSA9IHJlcXVpcmUoJy4vX2FwcGx5Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VSZXN0YCB3aGljaCB0cmFuc2Zvcm1zIHRoZSByZXN0IGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBhcHBseSBhIHJlc3QgcGFyYW1ldGVyIHRvLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD1mdW5jLmxlbmd0aC0xXSBUaGUgc3RhcnQgcG9zaXRpb24gb2YgdGhlIHJlc3QgcGFyYW1ldGVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdHJhbnNmb3JtIFRoZSByZXN0IGFycmF5IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyUmVzdChmdW5jLCBzdGFydCwgdHJhbnNmb3JtKSB7XG4gIHN0YXJ0ID0gbmF0aXZlTWF4KHN0YXJ0ID09PSB1bmRlZmluZWQgPyAoZnVuYy5sZW5ndGggLSAxKSA6IHN0YXJ0LCAwKTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBuYXRpdmVNYXgoYXJncy5sZW5ndGggLSBzdGFydCwgMCksXG4gICAgICAgIGFycmF5ID0gQXJyYXkobGVuZ3RoKTtcblxuICAgIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgICBhcnJheVtpbmRleF0gPSBhcmdzW3N0YXJ0ICsgaW5kZXhdO1xuICAgIH1cbiAgICBpbmRleCA9IC0xO1xuICAgIHZhciBvdGhlckFyZ3MgPSBBcnJheShzdGFydCArIDEpO1xuICAgIHdoaWxlICgrK2luZGV4IDwgc3RhcnQpIHtcbiAgICAgIG90aGVyQXJnc1tpbmRleF0gPSBhcmdzW2luZGV4XTtcbiAgICB9XG4gICAgb3RoZXJBcmdzW3N0YXJ0XSA9IHRyYW5zZm9ybShhcnJheSk7XG4gICAgcmV0dXJuIGFwcGx5KGZ1bmMsIHRoaXMsIG90aGVyQXJncyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb3ZlclJlc3Q7XG4iLCJ2YXIgZnJlZUdsb2JhbCA9IHJlcXVpcmUoJy4vX2ZyZWVHbG9iYWwnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJvb3Q7XG4iLCIvKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKlxuICogQWRkcyBgdmFsdWVgIHRvIHRoZSBhcnJheSBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgYWRkXG4gKiBAbWVtYmVyT2YgU2V0Q2FjaGVcbiAqIEBhbGlhcyBwdXNoXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjYWNoZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzZXRDYWNoZUFkZCh2YWx1ZSkge1xuICB0aGlzLl9fZGF0YV9fLnNldCh2YWx1ZSwgSEFTSF9VTkRFRklORUQpO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXRDYWNoZUFkZDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgaW4gdGhlIGFycmF5IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBTZXRDYWNoZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgZm91bmQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc2V0Q2FjaGVIYXModmFsdWUpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uaGFzKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXRDYWNoZUhhcztcbiIsIi8qKlxuICogQ29udmVydHMgYHNldGAgdG8gYW4gYXJyYXkgb2YgaXRzIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNldCBUaGUgc2V0IHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gc2V0VG9BcnJheShzZXQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShzZXQuc2l6ZSk7XG5cbiAgc2V0LmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXN1bHRbKytpbmRleF0gPSB2YWx1ZTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0VG9BcnJheTtcbiIsInZhciBiYXNlU2V0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19iYXNlU2V0VG9TdHJpbmcnKSxcbiAgICBzaG9ydE91dCA9IHJlcXVpcmUoJy4vX3Nob3J0T3V0Jyk7XG5cbi8qKlxuICogU2V0cyB0aGUgYHRvU3RyaW5nYCBtZXRob2Qgb2YgYGZ1bmNgIHRvIHJldHVybiBgc3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gc3RyaW5nIFRoZSBgdG9TdHJpbmdgIHJlc3VsdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBgZnVuY2AuXG4gKi9cbnZhciBzZXRUb1N0cmluZyA9IHNob3J0T3V0KGJhc2VTZXRUb1N0cmluZyk7XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0VG9TdHJpbmc7XG4iLCIvKiogVXNlZCB0byBkZXRlY3QgaG90IGZ1bmN0aW9ucyBieSBudW1iZXIgb2YgY2FsbHMgd2l0aGluIGEgc3BhbiBvZiBtaWxsaXNlY29uZHMuICovXG52YXIgSE9UX0NPVU5UID0gODAwLFxuICAgIEhPVF9TUEFOID0gMTY7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVOb3cgPSBEYXRlLm5vdztcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCdsbCBzaG9ydCBvdXQgYW5kIGludm9rZSBgaWRlbnRpdHlgIGluc3RlYWRcbiAqIG9mIGBmdW5jYCB3aGVuIGl0J3MgY2FsbGVkIGBIT1RfQ09VTlRgIG9yIG1vcmUgdGltZXMgaW4gYEhPVF9TUEFOYFxuICogbWlsbGlzZWNvbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byByZXN0cmljdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNob3J0YWJsZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gc2hvcnRPdXQoZnVuYykge1xuICB2YXIgY291bnQgPSAwLFxuICAgICAgbGFzdENhbGxlZCA9IDA7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdGFtcCA9IG5hdGl2ZU5vdygpLFxuICAgICAgICByZW1haW5pbmcgPSBIT1RfU1BBTiAtIChzdGFtcCAtIGxhc3RDYWxsZWQpO1xuXG4gICAgbGFzdENhbGxlZCA9IHN0YW1wO1xuICAgIGlmIChyZW1haW5pbmcgPiAwKSB7XG4gICAgICBpZiAoKytjb3VudCA+PSBIT1RfQ09VTlQpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3VtZW50c1swXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY291bnQgPSAwO1xuICAgIH1cbiAgICByZXR1cm4gZnVuYy5hcHBseSh1bmRlZmluZWQsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvcnRPdXQ7XG4iLCJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqL1xuZnVuY3Rpb24gc3RhY2tDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGU7XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tDbGVhcjtcbiIsIi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICByZXN1bHQgPSBkYXRhWydkZWxldGUnXShrZXkpO1xuXG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0RlbGV0ZTtcbiIsIi8qKlxuICogR2V0cyB0aGUgc3RhY2sgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrR2V0KGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5nZXQoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0dldDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGEgc3RhY2sgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0hhcyhrZXkpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uaGFzKGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tIYXM7XG4iLCJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyksXG4gICAgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyksXG4gICAgTWFwQ2FjaGUgPSByZXF1aXJlKCcuL19NYXBDYWNoZScpO1xuXG4vKiogVXNlZCBhcyB0aGUgc2l6ZSB0byBlbmFibGUgbGFyZ2UgYXJyYXkgb3B0aW1pemF0aW9ucy4gKi9cbnZhciBMQVJHRV9BUlJBWV9TSVpFID0gMjAwO1xuXG4vKipcbiAqIFNldHMgdGhlIHN0YWNrIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIHN0YWNrIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzdGFja1NldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBMaXN0Q2FjaGUpIHtcbiAgICB2YXIgcGFpcnMgPSBkYXRhLl9fZGF0YV9fO1xuICAgIGlmICghTWFwIHx8IChwYWlycy5sZW5ndGggPCBMQVJHRV9BUlJBWV9TSVpFIC0gMSkpIHtcbiAgICAgIHBhaXJzLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgICAgIHRoaXMuc2l6ZSA9ICsrZGF0YS5zaXplO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IE1hcENhY2hlKHBhaXJzKTtcbiAgfVxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja1NldDtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLmluZGV4T2ZgIHdoaWNoIHBlcmZvcm1zIHN0cmljdCBlcXVhbGl0eVxuICogY29tcGFyaXNvbnMgb2YgdmFsdWVzLCBpLmUuIGA9PT1gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIHN0cmljdEluZGV4T2YoYXJyYXksIHZhbHVlLCBmcm9tSW5kZXgpIHtcbiAgdmFyIGluZGV4ID0gZnJvbUluZGV4IC0gMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChhcnJheVtpbmRleF0gPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHJpY3RJbmRleE9mO1xuIiwidmFyIG1lbW9pemVDYXBwZWQgPSByZXF1aXJlKCcuL19tZW1vaXplQ2FwcGVkJyk7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIHByb3BlcnR5IG5hbWVzIHdpdGhpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZUxlYWRpbmdEb3QgPSAvXlxcLi8sXG4gICAgcmVQcm9wTmFtZSA9IC9bXi5bXFxdXSt8XFxbKD86KC0/XFxkKyg/OlxcLlxcZCspPyl8KFtcIiddKSgoPzooPyFcXDIpW15cXFxcXXxcXFxcLikqPylcXDIpXFxdfCg/PSg/OlxcLnxcXFtcXF0pKD86XFwufFxcW1xcXXwkKSkvZztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggYmFja3NsYXNoZXMgaW4gcHJvcGVydHkgcGF0aHMuICovXG52YXIgcmVFc2NhcGVDaGFyID0gL1xcXFwoXFxcXCk/L2c7XG5cbi8qKlxuICogQ29udmVydHMgYHN0cmluZ2AgdG8gYSBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgcHJvcGVydHkgcGF0aCBhcnJheS5cbiAqL1xudmFyIHN0cmluZ1RvUGF0aCA9IG1lbW9pemVDYXBwZWQoZnVuY3Rpb24oc3RyaW5nKSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgaWYgKHJlTGVhZGluZ0RvdC50ZXN0KHN0cmluZykpIHtcbiAgICByZXN1bHQucHVzaCgnJyk7XG4gIH1cbiAgc3RyaW5nLnJlcGxhY2UocmVQcm9wTmFtZSwgZnVuY3Rpb24obWF0Y2gsIG51bWJlciwgcXVvdGUsIHN0cmluZykge1xuICAgIHJlc3VsdC5wdXNoKHF1b3RlID8gc3RyaW5nLnJlcGxhY2UocmVFc2NhcGVDaGFyLCAnJDEnKSA6IChudW1iZXIgfHwgbWF0Y2gpKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdHJpbmdUb1BhdGg7XG4iLCJ2YXIgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyBrZXkgaWYgaXQncyBub3QgYSBzdHJpbmcgb3Igc3ltYm9sLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge3N0cmluZ3xzeW1ib2x9IFJldHVybnMgdGhlIGtleS5cbiAqL1xuZnVuY3Rpb24gdG9LZXkodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fCBpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgdmFyIHJlc3VsdCA9ICh2YWx1ZSArICcnKTtcbiAgcmV0dXJuIChyZXN1bHQgPT0gJzAnICYmICgxIC8gdmFsdWUpID09IC1JTkZJTklUWSkgPyAnLTAnIDogcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvS2V5O1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgZnVuY2AgdG8gaXRzIHNvdXJjZSBjb2RlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc291cmNlIGNvZGUuXG4gKi9cbmZ1bmN0aW9uIHRvU291cmNlKGZ1bmMpIHtcbiAgaWYgKGZ1bmMgIT0gbnVsbCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnVuY1RvU3RyaW5nLmNhbGwoZnVuYyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIChmdW5jICsgJycpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvU291cmNlO1xuIiwidmFyIGJhc2VQcm9wZXJ0eU9mID0gcmVxdWlyZSgnLi9fYmFzZVByb3BlcnR5T2YnKTtcblxuLyoqIFVzZWQgdG8gbWFwIEhUTUwgZW50aXRpZXMgdG8gY2hhcmFjdGVycy4gKi9cbnZhciBodG1sVW5lc2NhcGVzID0ge1xuICAnJmFtcDsnOiAnJicsXG4gICcmbHQ7JzogJzwnLFxuICAnJmd0Oyc6ICc+JyxcbiAgJyZxdW90Oyc6ICdcIicsXG4gICcmIzM5Oyc6IFwiJ1wiXG59O1xuXG4vKipcbiAqIFVzZWQgYnkgYF8udW5lc2NhcGVgIHRvIGNvbnZlcnQgSFRNTCBlbnRpdGllcyB0byBjaGFyYWN0ZXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gY2hyIFRoZSBtYXRjaGVkIGNoYXJhY3RlciB0byB1bmVzY2FwZS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHVuZXNjYXBlZCBjaGFyYWN0ZXIuXG4gKi9cbnZhciB1bmVzY2FwZUh0bWxDaGFyID0gYmFzZVByb3BlcnR5T2YoaHRtbFVuZXNjYXBlcyk7XG5cbm1vZHVsZS5leHBvcnRzID0gdW5lc2NhcGVIdG1sQ2hhcjtcbiIsIi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBgdmFsdWVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byByZXR1cm4gZnJvbSB0aGUgbmV3IGZ1bmN0aW9uLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY29uc3RhbnQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gXy50aW1lcygyLCBfLmNvbnN0YW50KHsgJ2EnOiAxIH0pKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhvYmplY3RzKTtcbiAqIC8vID0+IFt7ICdhJzogMSB9LCB7ICdhJzogMSB9XVxuICpcbiAqIGNvbnNvbGUubG9nKG9iamVjdHNbMF0gPT09IG9iamVjdHNbMV0pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBjb25zdGFudCh2YWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnN0YW50O1xuIiwiLyoqXG4gKiBQZXJmb3JtcyBhXG4gKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogY29tcGFyaXNvbiBiZXR3ZWVuIHR3byB2YWx1ZXMgdG8gZGV0ZXJtaW5lIGlmIHRoZXkgYXJlIGVxdWl2YWxlbnQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdhJzogMSB9O1xuICpcbiAqIF8uZXEob2JqZWN0LCBvYmplY3QpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoJ2EnLCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uZXEoJ2EnLCBPYmplY3QoJ2EnKSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uZXEoTmFOLCBOYU4pO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBlcSh2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIHZhbHVlID09PSBvdGhlciB8fCAodmFsdWUgIT09IHZhbHVlICYmIG90aGVyICE9PSBvdGhlcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXE7XG4iLCJ2YXIgYXJyYXlGaWx0ZXIgPSByZXF1aXJlKCcuL19hcnJheUZpbHRlcicpLFxuICAgIGJhc2VGaWx0ZXIgPSByZXF1aXJlKCcuL19iYXNlRmlsdGVyJyksXG4gICAgYmFzZUl0ZXJhdGVlID0gcmVxdWlyZSgnLi9fYmFzZUl0ZXJhdGVlJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpO1xuXG4vKipcbiAqIEl0ZXJhdGVzIG92ZXIgZWxlbWVudHMgb2YgYGNvbGxlY3Rpb25gLCByZXR1cm5pbmcgYW4gYXJyYXkgb2YgYWxsIGVsZW1lbnRzXG4gKiBgcHJlZGljYXRlYCByZXR1cm5zIHRydXRoeSBmb3IuIFRoZSBwcmVkaWNhdGUgaXMgaW52b2tlZCB3aXRoIHRocmVlXG4gKiBhcmd1bWVudHM6ICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS5cbiAqXG4gKiAqKk5vdGU6KiogVW5saWtlIGBfLnJlbW92ZWAsIHRoaXMgbWV0aG9kIHJldHVybnMgYSBuZXcgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtwcmVkaWNhdGU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZpbHRlcmVkIGFycmF5LlxuICogQHNlZSBfLnJlamVjdFxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgdXNlcnMgPSBbXG4gKiAgIHsgJ3VzZXInOiAnYmFybmV5JywgJ2FnZSc6IDM2LCAnYWN0aXZlJzogdHJ1ZSB9LFxuICogICB7ICd1c2VyJzogJ2ZyZWQnLCAgICdhZ2UnOiA0MCwgJ2FjdGl2ZSc6IGZhbHNlIH1cbiAqIF07XG4gKlxuICogXy5maWx0ZXIodXNlcnMsIGZ1bmN0aW9uKG8pIHsgcmV0dXJuICFvLmFjdGl2ZTsgfSk7XG4gKiAvLyA9PiBvYmplY3RzIGZvciBbJ2ZyZWQnXVxuICpcbiAqIC8vIFRoZSBgXy5tYXRjaGVzYCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gKiBfLmZpbHRlcih1c2VycywgeyAnYWdlJzogMzYsICdhY3RpdmUnOiB0cnVlIH0pO1xuICogLy8gPT4gb2JqZWN0cyBmb3IgWydiYXJuZXknXVxuICpcbiAqIC8vIFRoZSBgXy5tYXRjaGVzUHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8uZmlsdGVyKHVzZXJzLCBbJ2FjdGl2ZScsIGZhbHNlXSk7XG4gKiAvLyA9PiBvYmplY3RzIGZvciBbJ2ZyZWQnXVxuICpcbiAqIC8vIFRoZSBgXy5wcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maWx0ZXIodXNlcnMsICdhY3RpdmUnKTtcbiAqIC8vID0+IG9iamVjdHMgZm9yIFsnYmFybmV5J11cbiAqL1xuZnVuY3Rpb24gZmlsdGVyKGNvbGxlY3Rpb24sIHByZWRpY2F0ZSkge1xuICB2YXIgZnVuYyA9IGlzQXJyYXkoY29sbGVjdGlvbikgPyBhcnJheUZpbHRlciA6IGJhc2VGaWx0ZXI7XG4gIHJldHVybiBmdW5jKGNvbGxlY3Rpb24sIGJhc2VJdGVyYXRlZShwcmVkaWNhdGUsIDMpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmaWx0ZXI7XG4iLCJ2YXIgY3JlYXRlRmluZCA9IHJlcXVpcmUoJy4vX2NyZWF0ZUZpbmQnKSxcbiAgICBmaW5kSW5kZXggPSByZXF1aXJlKCcuL2ZpbmRJbmRleCcpO1xuXG4vKipcbiAqIEl0ZXJhdGVzIG92ZXIgZWxlbWVudHMgb2YgYGNvbGxlY3Rpb25gLCByZXR1cm5pbmcgdGhlIGZpcnN0IGVsZW1lbnRcbiAqIGBwcmVkaWNhdGVgIHJldHVybnMgdHJ1dGh5IGZvci4gVGhlIHByZWRpY2F0ZSBpcyBpbnZva2VkIHdpdGggdGhyZWVcbiAqIGFyZ3VtZW50czogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3ByZWRpY2F0ZT1fLmlkZW50aXR5XSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHtudW1iZXJ9IFtmcm9tSW5kZXg9MF0gVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIG1hdGNoZWQgZWxlbWVudCwgZWxzZSBgdW5kZWZpbmVkYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHVzZXJzID0gW1xuICogICB7ICd1c2VyJzogJ2Jhcm5leScsICAnYWdlJzogMzYsICdhY3RpdmUnOiB0cnVlIH0sXG4gKiAgIHsgJ3VzZXInOiAnZnJlZCcsICAgICdhZ2UnOiA0MCwgJ2FjdGl2ZSc6IGZhbHNlIH0sXG4gKiAgIHsgJ3VzZXInOiAncGViYmxlcycsICdhZ2UnOiAxLCAgJ2FjdGl2ZSc6IHRydWUgfVxuICogXTtcbiAqXG4gKiBfLmZpbmQodXNlcnMsIGZ1bmN0aW9uKG8pIHsgcmV0dXJuIG8uYWdlIDwgNDA7IH0pO1xuICogLy8gPT4gb2JqZWN0IGZvciAnYmFybmV5J1xuICpcbiAqIC8vIFRoZSBgXy5tYXRjaGVzYCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gKiBfLmZpbmQodXNlcnMsIHsgJ2FnZSc6IDEsICdhY3RpdmUnOiB0cnVlIH0pO1xuICogLy8gPT4gb2JqZWN0IGZvciAncGViYmxlcydcbiAqXG4gKiAvLyBUaGUgYF8ubWF0Y2hlc1Byb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gKiBfLmZpbmQodXNlcnMsIFsnYWN0aXZlJywgZmFsc2VdKTtcbiAqIC8vID0+IG9iamVjdCBmb3IgJ2ZyZWQnXG4gKlxuICogLy8gVGhlIGBfLnByb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gKiBfLmZpbmQodXNlcnMsICdhY3RpdmUnKTtcbiAqIC8vID0+IG9iamVjdCBmb3IgJ2Jhcm5leSdcbiAqL1xudmFyIGZpbmQgPSBjcmVhdGVGaW5kKGZpbmRJbmRleCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZmluZDtcbiIsInZhciBiYXNlRmluZEluZGV4ID0gcmVxdWlyZSgnLi9fYmFzZUZpbmRJbmRleCcpLFxuICAgIGJhc2VJdGVyYXRlZSA9IHJlcXVpcmUoJy4vX2Jhc2VJdGVyYXRlZScpLFxuICAgIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vdG9JbnRlZ2VyJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmZpbmRgIGV4Y2VwdCB0aGF0IGl0IHJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBmaXJzdFxuICogZWxlbWVudCBgcHJlZGljYXRlYCByZXR1cm5zIHRydXRoeSBmb3IgaW5zdGVhZCBvZiB0aGUgZWxlbWVudCBpdHNlbGYuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAxLjEuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtwcmVkaWNhdGU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbZnJvbUluZGV4PTBdIFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBmb3VuZCBlbGVtZW50LCBlbHNlIGAtMWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciB1c2VycyA9IFtcbiAqICAgeyAndXNlcic6ICdiYXJuZXknLCAgJ2FjdGl2ZSc6IGZhbHNlIH0sXG4gKiAgIHsgJ3VzZXInOiAnZnJlZCcsICAgICdhY3RpdmUnOiBmYWxzZSB9LFxuICogICB7ICd1c2VyJzogJ3BlYmJsZXMnLCAnYWN0aXZlJzogdHJ1ZSB9XG4gKiBdO1xuICpcbiAqIF8uZmluZEluZGV4KHVzZXJzLCBmdW5jdGlvbihvKSB7IHJldHVybiBvLnVzZXIgPT0gJ2Jhcm5leSc7IH0pO1xuICogLy8gPT4gMFxuICpcbiAqIC8vIFRoZSBgXy5tYXRjaGVzYCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gKiBfLmZpbmRJbmRleCh1c2VycywgeyAndXNlcic6ICdmcmVkJywgJ2FjdGl2ZSc6IGZhbHNlIH0pO1xuICogLy8gPT4gMVxuICpcbiAqIC8vIFRoZSBgXy5tYXRjaGVzUHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8uZmluZEluZGV4KHVzZXJzLCBbJ2FjdGl2ZScsIGZhbHNlXSk7XG4gKiAvLyA9PiAwXG4gKlxuICogLy8gVGhlIGBfLnByb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gKiBfLmZpbmRJbmRleCh1c2VycywgJ2FjdGl2ZScpO1xuICogLy8gPT4gMlxuICovXG5mdW5jdGlvbiBmaW5kSW5kZXgoYXJyYXksIHByZWRpY2F0ZSwgZnJvbUluZGV4KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgdmFyIGluZGV4ID0gZnJvbUluZGV4ID09IG51bGwgPyAwIDogdG9JbnRlZ2VyKGZyb21JbmRleCk7XG4gIGlmIChpbmRleCA8IDApIHtcbiAgICBpbmRleCA9IG5hdGl2ZU1heChsZW5ndGggKyBpbmRleCwgMCk7XG4gIH1cbiAgcmV0dXJuIGJhc2VGaW5kSW5kZXgoYXJyYXksIGJhc2VJdGVyYXRlZShwcmVkaWNhdGUsIDMpLCBpbmRleCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmluZEluZGV4O1xuIiwidmFyIGJhc2VGbGF0dGVuID0gcmVxdWlyZSgnLi9fYmFzZUZsYXR0ZW4nKSxcbiAgICBtYXAgPSByZXF1aXJlKCcuL21hcCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmbGF0dGVuZWQgYXJyYXkgb2YgdmFsdWVzIGJ5IHJ1bm5pbmcgZWFjaCBlbGVtZW50IGluIGBjb2xsZWN0aW9uYFxuICogdGhydSBgaXRlcmF0ZWVgIGFuZCBmbGF0dGVuaW5nIHRoZSBtYXBwZWQgcmVzdWx0cy4gVGhlIGl0ZXJhdGVlIGlzIGludm9rZWRcbiAqIHdpdGggdGhyZWUgYXJndW1lbnRzOiAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZT1fLmlkZW50aXR5XSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZmxhdHRlbmVkIGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBkdXBsaWNhdGUobikge1xuICogICByZXR1cm4gW24sIG5dO1xuICogfVxuICpcbiAqIF8uZmxhdE1hcChbMSwgMl0sIGR1cGxpY2F0ZSk7XG4gKiAvLyA9PiBbMSwgMSwgMiwgMl1cbiAqL1xuZnVuY3Rpb24gZmxhdE1hcChjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICByZXR1cm4gYmFzZUZsYXR0ZW4obWFwKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSwgMSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmxhdE1hcDtcbiIsInZhciBiYXNlRmxhdHRlbiA9IHJlcXVpcmUoJy4vX2Jhc2VGbGF0dGVuJyk7XG5cbi8qKlxuICogRmxhdHRlbnMgYGFycmF5YCBhIHNpbmdsZSBsZXZlbCBkZWVwLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGZsYXR0ZW4uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBmbGF0dGVuZWQgYXJyYXkuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZmxhdHRlbihbMSwgWzIsIFszLCBbNF1dLCA1XV0pO1xuICogLy8gPT4gWzEsIDIsIFszLCBbNF1dLCA1XVxuICovXG5mdW5jdGlvbiBmbGF0dGVuKGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcbiAgcmV0dXJuIGxlbmd0aCA/IGJhc2VGbGF0dGVuKGFycmF5LCAxKSA6IFtdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZsYXR0ZW47XG4iLCJ2YXIgYXJyYXlFYWNoID0gcmVxdWlyZSgnLi9fYXJyYXlFYWNoJyksXG4gICAgYmFzZUVhY2ggPSByZXF1aXJlKCcuL19iYXNlRWFjaCcpLFxuICAgIGNhc3RGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2Nhc3RGdW5jdGlvbicpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcblxuLyoqXG4gKiBJdGVyYXRlcyBvdmVyIGVsZW1lbnRzIG9mIGBjb2xsZWN0aW9uYCBhbmQgaW52b2tlcyBgaXRlcmF0ZWVgIGZvciBlYWNoIGVsZW1lbnQuXG4gKiBUaGUgaXRlcmF0ZWUgaXMgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICogSXRlcmF0ZWUgZnVuY3Rpb25zIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseSBieSBleHBsaWNpdGx5IHJldHVybmluZyBgZmFsc2VgLlxuICpcbiAqICoqTm90ZToqKiBBcyB3aXRoIG90aGVyIFwiQ29sbGVjdGlvbnNcIiBtZXRob2RzLCBvYmplY3RzIHdpdGggYSBcImxlbmd0aFwiXG4gKiBwcm9wZXJ0eSBhcmUgaXRlcmF0ZWQgbGlrZSBhcnJheXMuIFRvIGF2b2lkIHRoaXMgYmVoYXZpb3IgdXNlIGBfLmZvckluYFxuICogb3IgYF8uZm9yT3duYCBmb3Igb2JqZWN0IGl0ZXJhdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAYWxpYXMgZWFjaFxuICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZT1fLmlkZW50aXR5XSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdH0gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKiBAc2VlIF8uZm9yRWFjaFJpZ2h0XG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZm9yRWFjaChbMSwgMl0sIGZ1bmN0aW9uKHZhbHVlKSB7XG4gKiAgIGNvbnNvbGUubG9nKHZhbHVlKTtcbiAqIH0pO1xuICogLy8gPT4gTG9ncyBgMWAgdGhlbiBgMmAuXG4gKlxuICogXy5mb3JFYWNoKHsgJ2EnOiAxLCAnYic6IDIgfSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICogICBjb25zb2xlLmxvZyhrZXkpO1xuICogfSk7XG4gKiAvLyA9PiBMb2dzICdhJyB0aGVuICdiJyAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKS5cbiAqL1xuZnVuY3Rpb24gZm9yRWFjaChjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICB2YXIgZnVuYyA9IGlzQXJyYXkoY29sbGVjdGlvbikgPyBhcnJheUVhY2ggOiBiYXNlRWFjaDtcbiAgcmV0dXJuIGZ1bmMoY29sbGVjdGlvbiwgY2FzdEZ1bmN0aW9uKGl0ZXJhdGVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZm9yRWFjaDtcbiIsInZhciBiYXNlR2V0ID0gcmVxdWlyZSgnLi9fYmFzZUdldCcpO1xuXG4vKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBwYXRoYCBvZiBgb2JqZWN0YC4gSWYgdGhlIHJlc29sdmVkIHZhbHVlIGlzXG4gKiBgdW5kZWZpbmVkYCwgdGhlIGBkZWZhdWx0VmFsdWVgIGlzIHJldHVybmVkIGluIGl0cyBwbGFjZS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuNy4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHBhcmFtIHsqfSBbZGVmYXVsdFZhbHVlXSBUaGUgdmFsdWUgcmV0dXJuZWQgZm9yIGB1bmRlZmluZWRgIHJlc29sdmVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXNvbHZlZCB2YWx1ZS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiBbeyAnYic6IHsgJ2MnOiAzIH0gfV0gfTtcbiAqXG4gKiBfLmdldChvYmplY3QsICdhWzBdLmIuYycpO1xuICogLy8gPT4gM1xuICpcbiAqIF8uZ2V0KG9iamVjdCwgWydhJywgJzAnLCAnYicsICdjJ10pO1xuICogLy8gPT4gM1xuICpcbiAqIF8uZ2V0KG9iamVjdCwgJ2EuYi5jJywgJ2RlZmF1bHQnKTtcbiAqIC8vID0+ICdkZWZhdWx0J1xuICovXG5mdW5jdGlvbiBnZXQob2JqZWN0LCBwYXRoLCBkZWZhdWx0VmFsdWUpIHtcbiAgdmFyIHJlc3VsdCA9IG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogYmFzZUdldChvYmplY3QsIHBhdGgpO1xuICByZXR1cm4gcmVzdWx0ID09PSB1bmRlZmluZWQgPyBkZWZhdWx0VmFsdWUgOiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0O1xuIiwidmFyIGJhc2VIYXMgPSByZXF1aXJlKCcuL19iYXNlSGFzJyksXG4gICAgaGFzUGF0aCA9IHJlcXVpcmUoJy4vX2hhc1BhdGgnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHBhdGhgIGlzIGEgZGlyZWN0IHByb3BlcnR5IG9mIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBwYXRoYCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiB7ICdiJzogMiB9IH07XG4gKiB2YXIgb3RoZXIgPSBfLmNyZWF0ZSh7ICdhJzogXy5jcmVhdGUoeyAnYic6IDIgfSkgfSk7XG4gKlxuICogXy5oYXMob2JqZWN0LCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzKG9iamVjdCwgJ2EuYicpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzKG9iamVjdCwgWydhJywgJ2InXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5oYXMob3RoZXIsICdhJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBoYXMob2JqZWN0LCBwYXRoKSB7XG4gIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJiBoYXNQYXRoKG9iamVjdCwgcGF0aCwgYmFzZUhhcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzO1xuIiwidmFyIGJhc2VIYXNJbiA9IHJlcXVpcmUoJy4vX2Jhc2VIYXNJbicpLFxuICAgIGhhc1BhdGggPSByZXF1aXJlKCcuL19oYXNQYXRoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBwYXRoYCBpcyBhIGRpcmVjdCBvciBpbmhlcml0ZWQgcHJvcGVydHkgb2YgYG9iamVjdGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHBhdGhgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0gXy5jcmVhdGUoeyAnYSc6IF8uY3JlYXRlKHsgJ2InOiAyIH0pIH0pO1xuICpcbiAqIF8uaGFzSW4ob2JqZWN0LCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzSW4ob2JqZWN0LCAnYS5iJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5oYXNJbihvYmplY3QsIFsnYScsICdiJ10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzSW4ob2JqZWN0LCAnYicpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaGFzSW4ob2JqZWN0LCBwYXRoKSB7XG4gIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJiBoYXNQYXRoKG9iamVjdCwgcGF0aCwgYmFzZUhhc0luKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNJbjtcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyB0aGUgZmlyc3QgYXJndW1lbnQgaXQgcmVjZWl2ZXMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgQW55IHZhbHVlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgYHZhbHVlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKlxuICogY29uc29sZS5sb2coXy5pZGVudGl0eShvYmplY3QpID09PSBvYmplY3QpO1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpZGVudGl0eSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaWRlbnRpdHk7XG4iLCJ2YXIgYmFzZUluZGV4T2YgPSByZXF1aXJlKCcuL19iYXNlSW5kZXhPZicpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzU3RyaW5nID0gcmVxdWlyZSgnLi9pc1N0cmluZycpLFxuICAgIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vdG9JbnRlZ2VyJyksXG4gICAgdmFsdWVzID0gcmVxdWlyZSgnLi92YWx1ZXMnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGluIGBjb2xsZWN0aW9uYC4gSWYgYGNvbGxlY3Rpb25gIGlzIGEgc3RyaW5nLCBpdCdzXG4gKiBjaGVja2VkIGZvciBhIHN1YnN0cmluZyBvZiBgdmFsdWVgLCBvdGhlcndpc2VcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBpcyB1c2VkIGZvciBlcXVhbGl0eSBjb21wYXJpc29ucy4gSWYgYGZyb21JbmRleGAgaXMgbmVnYXRpdmUsIGl0J3MgdXNlZCBhc1xuICogdGhlIG9mZnNldCBmcm9tIHRoZSBlbmQgb2YgYGNvbGxlY3Rpb25gLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdHxzdHJpbmd9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gW2Zyb21JbmRleD0wXSBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gKiBAcGFyYW0tIHtPYmplY3R9IFtndWFyZF0gRW5hYmxlcyB1c2UgYXMgYW4gaXRlcmF0ZWUgZm9yIG1ldGhvZHMgbGlrZSBgXy5yZWR1Y2VgLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgZm91bmQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pbmNsdWRlcyhbMSwgMiwgM10sIDEpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaW5jbHVkZXMoWzEsIDIsIDNdLCAxLCAyKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pbmNsdWRlcyh7ICdhJzogMSwgJ2InOiAyIH0sIDEpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaW5jbHVkZXMoJ2FiY2QnLCAnYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaW5jbHVkZXMoY29sbGVjdGlvbiwgdmFsdWUsIGZyb21JbmRleCwgZ3VhcmQpIHtcbiAgY29sbGVjdGlvbiA9IGlzQXJyYXlMaWtlKGNvbGxlY3Rpb24pID8gY29sbGVjdGlvbiA6IHZhbHVlcyhjb2xsZWN0aW9uKTtcbiAgZnJvbUluZGV4ID0gKGZyb21JbmRleCAmJiAhZ3VhcmQpID8gdG9JbnRlZ2VyKGZyb21JbmRleCkgOiAwO1xuXG4gIHZhciBsZW5ndGggPSBjb2xsZWN0aW9uLmxlbmd0aDtcbiAgaWYgKGZyb21JbmRleCA8IDApIHtcbiAgICBmcm9tSW5kZXggPSBuYXRpdmVNYXgobGVuZ3RoICsgZnJvbUluZGV4LCAwKTtcbiAgfVxuICByZXR1cm4gaXNTdHJpbmcoY29sbGVjdGlvbilcbiAgICA/IChmcm9tSW5kZXggPD0gbGVuZ3RoICYmIGNvbGxlY3Rpb24uaW5kZXhPZih2YWx1ZSwgZnJvbUluZGV4KSA+IC0xKVxuICAgIDogKCEhbGVuZ3RoICYmIGJhc2VJbmRleE9mKGNvbGxlY3Rpb24sIHZhbHVlLCBmcm9tSW5kZXgpID4gLTEpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluY2x1ZGVzO1xuIiwidmFyIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBiYXNlSW50ZXJzZWN0aW9uID0gcmVxdWlyZSgnLi9fYmFzZUludGVyc2VjdGlvbicpLFxuICAgIGJhc2VSZXN0ID0gcmVxdWlyZSgnLi9fYmFzZVJlc3QnKSxcbiAgICBjYXN0QXJyYXlMaWtlT2JqZWN0ID0gcmVxdWlyZSgnLi9fY2FzdEFycmF5TGlrZU9iamVjdCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdW5pcXVlIHZhbHVlcyB0aGF0IGFyZSBpbmNsdWRlZCBpbiBhbGwgZ2l2ZW4gYXJyYXlzXG4gKiB1c2luZyBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogZm9yIGVxdWFsaXR5IGNvbXBhcmlzb25zLiBUaGUgb3JkZXIgYW5kIHJlZmVyZW5jZXMgb2YgcmVzdWx0IHZhbHVlcyBhcmVcbiAqIGRldGVybWluZWQgYnkgdGhlIGZpcnN0IGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHsuLi5BcnJheX0gW2FycmF5c10gVGhlIGFycmF5cyB0byBpbnNwZWN0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgYXJyYXkgb2YgaW50ZXJzZWN0aW5nIHZhbHVlcy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pbnRlcnNlY3Rpb24oWzIsIDFdLCBbMiwgM10pO1xuICogLy8gPT4gWzJdXG4gKi9cbnZhciBpbnRlcnNlY3Rpb24gPSBiYXNlUmVzdChmdW5jdGlvbihhcnJheXMpIHtcbiAgdmFyIG1hcHBlZCA9IGFycmF5TWFwKGFycmF5cywgY2FzdEFycmF5TGlrZU9iamVjdCk7XG4gIHJldHVybiAobWFwcGVkLmxlbmd0aCAmJiBtYXBwZWRbMF0gPT09IGFycmF5c1swXSlcbiAgICA/IGJhc2VJbnRlcnNlY3Rpb24obWFwcGVkKVxuICAgIDogW107XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbnRlcnNlY3Rpb247XG4iLCJ2YXIgYmFzZUlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi9fYmFzZUlzQXJndW1lbnRzJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgcHJvcGVydHlJc0VudW1lcmFibGUgPSBvYmplY3RQcm90by5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGBhcmd1bWVudHNgIG9iamVjdCxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJndW1lbnRzID0gYmFzZUlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID8gYmFzZUlzQXJndW1lbnRzIDogZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpICYmXG4gICAgIXByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwodmFsdWUsICdjYWxsZWUnKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcmd1bWVudHM7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYEFycmF5YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5O1xuIiwidmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLiBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgYXJyYXktbGlrZSBpZiBpdCdzXG4gKiBub3QgYSBmdW5jdGlvbiBhbmQgaGFzIGEgYHZhbHVlLmxlbmd0aGAgdGhhdCdzIGFuIGludGVnZXIgZ3JlYXRlciB0aGFuIG9yXG4gKiBlcXVhbCB0byBgMGAgYW5kIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZSgnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhaXNGdW5jdGlvbih2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheUxpa2U7XG4iLCJ2YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmlzQXJyYXlMaWtlYCBleGNlcHQgdGhhdCBpdCBhbHNvIGNoZWNrcyBpZiBgdmFsdWVgXG4gKiBpcyBhbiBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXktbGlrZSBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2VPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaXNBcnJheUxpa2UodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlT2JqZWN0O1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290JyksXG4gICAgc3R1YkZhbHNlID0gcmVxdWlyZSgnLi9zdHViRmFsc2UnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVJc0J1ZmZlciA9IEJ1ZmZlciA/IEJ1ZmZlci5pc0J1ZmZlciA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlciwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBCdWZmZXIoMikpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IFVpbnQ4QXJyYXkoMikpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQnVmZmVyID0gbmF0aXZlSXNCdWZmZXIgfHwgc3R1YkZhbHNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQnVmZmVyO1xuIiwidmFyIGJhc2VLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUtleXMnKSxcbiAgICBnZXRUYWcgPSByZXF1aXJlKCcuL19nZXRUYWcnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpLFxuICAgIGlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vaXNUeXBlZEFycmF5Jyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhbiBlbXB0eSBvYmplY3QsIGNvbGxlY3Rpb24sIG1hcCwgb3Igc2V0LlxuICpcbiAqIE9iamVjdHMgYXJlIGNvbnNpZGVyZWQgZW1wdHkgaWYgdGhleSBoYXZlIG5vIG93biBlbnVtZXJhYmxlIHN0cmluZyBrZXllZFxuICogcHJvcGVydGllcy5cbiAqXG4gKiBBcnJheS1saWtlIHZhbHVlcyBzdWNoIGFzIGBhcmd1bWVudHNgIG9iamVjdHMsIGFycmF5cywgYnVmZmVycywgc3RyaW5ncywgb3JcbiAqIGpRdWVyeS1saWtlIGNvbGxlY3Rpb25zIGFyZSBjb25zaWRlcmVkIGVtcHR5IGlmIHRoZXkgaGF2ZSBhIGBsZW5ndGhgIG9mIGAwYC5cbiAqIFNpbWlsYXJseSwgbWFwcyBhbmQgc2V0cyBhcmUgY29uc2lkZXJlZCBlbXB0eSBpZiB0aGV5IGhhdmUgYSBgc2l6ZWAgb2YgYDBgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGVtcHR5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNFbXB0eShudWxsKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRW1wdHkodHJ1ZSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0VtcHR5KDEpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNFbXB0eShbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzRW1wdHkoeyAnYSc6IDEgfSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGlzQXJyYXlMaWtlKHZhbHVlKSAmJlxuICAgICAgKGlzQXJyYXkodmFsdWUpIHx8IHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fCB0eXBlb2YgdmFsdWUuc3BsaWNlID09ICdmdW5jdGlvbicgfHxcbiAgICAgICAgaXNCdWZmZXIodmFsdWUpIHx8IGlzVHlwZWRBcnJheSh2YWx1ZSkgfHwgaXNBcmd1bWVudHModmFsdWUpKSkge1xuICAgIHJldHVybiAhdmFsdWUubGVuZ3RoO1xuICB9XG4gIHZhciB0YWcgPSBnZXRUYWcodmFsdWUpO1xuICBpZiAodGFnID09IG1hcFRhZyB8fCB0YWcgPT0gc2V0VGFnKSB7XG4gICAgcmV0dXJuICF2YWx1ZS5zaXplO1xuICB9XG4gIGlmIChpc1Byb3RvdHlwZSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gIWJhc2VLZXlzKHZhbHVlKS5sZW5ndGg7XG4gIH1cbiAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNFbXB0eTtcbiIsInZhciBiYXNlSXNFcXVhbCA9IHJlcXVpcmUoJy4vX2Jhc2VJc0VxdWFsJyk7XG5cbi8qKlxuICogUGVyZm9ybXMgYSBkZWVwIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZVxuICogZXF1aXZhbGVudC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2Qgc3VwcG9ydHMgY29tcGFyaW5nIGFycmF5cywgYXJyYXkgYnVmZmVycywgYm9vbGVhbnMsXG4gKiBkYXRlIG9iamVjdHMsIGVycm9yIG9iamVjdHMsIG1hcHMsIG51bWJlcnMsIGBPYmplY3RgIG9iamVjdHMsIHJlZ2V4ZXMsXG4gKiBzZXRzLCBzdHJpbmdzLCBzeW1ib2xzLCBhbmQgdHlwZWQgYXJyYXlzLiBgT2JqZWN0YCBvYmplY3RzIGFyZSBjb21wYXJlZFxuICogYnkgdGhlaXIgb3duLCBub3QgaW5oZXJpdGVkLCBlbnVtZXJhYmxlIHByb3BlcnRpZXMuIEZ1bmN0aW9ucyBhbmQgRE9NXG4gKiBub2RlcyBhcmUgKipub3QqKiBzdXBwb3J0ZWQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdhJzogMSB9O1xuICpcbiAqIF8uaXNFcXVhbChvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBvYmplY3QgPT09IG90aGVyO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNFcXVhbCh2YWx1ZSwgb3RoZXIpIHtcbiAgcmV0dXJuIGJhc2VJc0VxdWFsKHZhbHVlLCBvdGhlcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNFcXVhbDtcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXN5bmNUYWcgPSAnW29iamVjdCBBc3luY0Z1bmN0aW9uXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBwcm94eVRhZyA9ICdbb2JqZWN0IFByb3h5XSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheXMgYW5kIG90aGVyIGNvbnN0cnVjdG9ycy5cbiAgdmFyIHRhZyA9IGJhc2VHZXRUYWcodmFsdWUpO1xuICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZyB8fCB0YWcgPT0gYXN5bmNUYWcgfHwgdGFnID09IHByb3h5VGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRnVuY3Rpb247XG4iLCIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvTGVuZ3RoYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9sZW5ndGgpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgbGVuZ3RoLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNMZW5ndGgoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0xlbmd0aChOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aChJbmZpbml0eSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoJzMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTGVuZ3RoKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgJiZcbiAgICB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNMZW5ndGg7XG4iLCJ2YXIgaXNOdW1iZXIgPSByZXF1aXJlKCcuL2lzTnVtYmVyJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYE5hTmAuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGJhc2VkIG9uXG4gKiBbYE51bWJlci5pc05hTmBdKGh0dHBzOi8vbWRuLmlvL051bWJlci9pc05hTikgYW5kIGlzIG5vdCB0aGUgc2FtZSBhc1xuICogZ2xvYmFsIFtgaXNOYU5gXShodHRwczovL21kbi5pby9pc05hTikgd2hpY2ggcmV0dXJucyBgdHJ1ZWAgZm9yXG4gKiBgdW5kZWZpbmVkYCBhbmQgb3RoZXIgbm9uLW51bWJlciB2YWx1ZXMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYE5hTmAsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc05hTihOYU4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNOYU4obmV3IE51bWJlcihOYU4pKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBpc05hTih1bmRlZmluZWQpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNOYU4odW5kZWZpbmVkKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTmFOKHZhbHVlKSB7XG4gIC8vIEFuIGBOYU5gIHByaW1pdGl2ZSBpcyB0aGUgb25seSB2YWx1ZSB0aGF0IGlzIG5vdCBlcXVhbCB0byBpdHNlbGYuXG4gIC8vIFBlcmZvcm0gdGhlIGB0b1N0cmluZ1RhZ2AgY2hlY2sgZmlyc3QgdG8gYXZvaWQgZXJyb3JzIHdpdGggc29tZVxuICAvLyBBY3RpdmVYIG9iamVjdHMgaW4gSUUuXG4gIHJldHVybiBpc051bWJlcih2YWx1ZSkgJiYgdmFsdWUgIT0gK3ZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTmFOO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgTnVtYmVyYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqICoqTm90ZToqKiBUbyBleGNsdWRlIGBJbmZpbml0eWAsIGAtSW5maW5pdHlgLCBhbmQgYE5hTmAsIHdoaWNoIGFyZVxuICogY2xhc3NpZmllZCBhcyBudW1iZXJzLCB1c2UgdGhlIGBfLmlzRmluaXRlYCBtZXRob2QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBudW1iZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc051bWJlcigzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNOdW1iZXIoSW5maW5pdHkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNOdW1iZXIoJzMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzTnVtYmVyKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBudW1iZXJUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTnVtYmVyO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3Q7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdExpa2U7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3RyaW5nYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3RyaW5nLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTdHJpbmcoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTdHJpbmcoMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzdHJpbmcnIHx8XG4gICAgKCFpc0FycmF5KHZhbHVlKSAmJiBpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IHN0cmluZ1RhZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTdHJpbmc7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzeW1ib2wsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIGJhc2VHZXRUYWcodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTeW1ib2w7XG4iLCJ2YXIgYmFzZUlzVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vX2Jhc2VJc1R5cGVkQXJyYXknKSxcbiAgICBiYXNlVW5hcnkgPSByZXF1aXJlKCcuL19iYXNlVW5hcnknKSxcbiAgICBub2RlVXRpbCA9IHJlcXVpcmUoJy4vX25vZGVVdGlsJyk7XG5cbi8qIE5vZGUuanMgaGVscGVyIHJlZmVyZW5jZXMuICovXG52YXIgbm9kZUlzVHlwZWRBcnJheSA9IG5vZGVVdGlsICYmIG5vZGVVdGlsLmlzVHlwZWRBcnJheTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgdHlwZWQgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB0eXBlZCBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShuZXcgVWludDhBcnJheSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkoW10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzVHlwZWRBcnJheSA9IG5vZGVJc1R5cGVkQXJyYXkgPyBiYXNlVW5hcnkobm9kZUlzVHlwZWRBcnJheSkgOiBiYXNlSXNUeXBlZEFycmF5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzVHlwZWRBcnJheTtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYHVuZGVmaW5lZGAuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYHVuZGVmaW5lZGAsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1VuZGVmaW5lZCh2b2lkIDApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNVbmRlZmluZWQobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1VuZGVmaW5lZDtcbiIsInZhciBhcnJheUxpa2VLZXlzID0gcmVxdWlyZSgnLi9fYXJyYXlMaWtlS2V5cycpLFxuICAgIGJhc2VLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUtleXMnKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy4gU2VlIHRoZVxuICogW0VTIHNwZWNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5rZXlzKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy5rZXlzKCdoaScpO1xuICogLy8gPT4gWycwJywgJzEnXVxuICovXG5mdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuICByZXR1cm4gaXNBcnJheUxpa2Uob2JqZWN0KSA/IGFycmF5TGlrZUtleXMob2JqZWN0KSA6IGJhc2VLZXlzKG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5cztcbiIsInZhciBhcnJheU1hcCA9IHJlcXVpcmUoJy4vX2FycmF5TWFwJyksXG4gICAgYmFzZUl0ZXJhdGVlID0gcmVxdWlyZSgnLi9fYmFzZUl0ZXJhdGVlJyksXG4gICAgYmFzZU1hcCA9IHJlcXVpcmUoJy4vX2Jhc2VNYXAnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB2YWx1ZXMgYnkgcnVubmluZyBlYWNoIGVsZW1lbnQgaW4gYGNvbGxlY3Rpb25gIHRocnVcbiAqIGBpdGVyYXRlZWAuIFRoZSBpdGVyYXRlZSBpcyBpbnZva2VkIHdpdGggdGhyZWUgYXJndW1lbnRzOlxuICogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICpcbiAqIE1hbnkgbG9kYXNoIG1ldGhvZHMgYXJlIGd1YXJkZWQgdG8gd29yayBhcyBpdGVyYXRlZXMgZm9yIG1ldGhvZHMgbGlrZVxuICogYF8uZXZlcnlgLCBgXy5maWx0ZXJgLCBgXy5tYXBgLCBgXy5tYXBWYWx1ZXNgLCBgXy5yZWplY3RgLCBhbmQgYF8uc29tZWAuXG4gKlxuICogVGhlIGd1YXJkZWQgbWV0aG9kcyBhcmU6XG4gKiBgYXJ5YCwgYGNodW5rYCwgYGN1cnJ5YCwgYGN1cnJ5UmlnaHRgLCBgZHJvcGAsIGBkcm9wUmlnaHRgLCBgZXZlcnlgLFxuICogYGZpbGxgLCBgaW52ZXJ0YCwgYHBhcnNlSW50YCwgYHJhbmRvbWAsIGByYW5nZWAsIGByYW5nZVJpZ2h0YCwgYHJlcGVhdGAsXG4gKiBgc2FtcGxlU2l6ZWAsIGBzbGljZWAsIGBzb21lYCwgYHNvcnRCeWAsIGBzcGxpdGAsIGB0YWtlYCwgYHRha2VSaWdodGAsXG4gKiBgdGVtcGxhdGVgLCBgdHJpbWAsIGB0cmltRW5kYCwgYHRyaW1TdGFydGAsIGFuZCBgd29yZHNgXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IENvbGxlY3Rpb25cbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZT1fLmlkZW50aXR5XSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgbWFwcGVkIGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBzcXVhcmUobikge1xuICogICByZXR1cm4gbiAqIG47XG4gKiB9XG4gKlxuICogXy5tYXAoWzQsIDhdLCBzcXVhcmUpO1xuICogLy8gPT4gWzE2LCA2NF1cbiAqXG4gKiBfLm1hcCh7ICdhJzogNCwgJ2InOiA4IH0sIHNxdWFyZSk7XG4gKiAvLyA9PiBbMTYsIDY0XSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIHZhciB1c2VycyA9IFtcbiAqICAgeyAndXNlcic6ICdiYXJuZXknIH0sXG4gKiAgIHsgJ3VzZXInOiAnZnJlZCcgfVxuICogXTtcbiAqXG4gKiAvLyBUaGUgYF8ucHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8ubWFwKHVzZXJzLCAndXNlcicpO1xuICogLy8gPT4gWydiYXJuZXknLCAnZnJlZCddXG4gKi9cbmZ1bmN0aW9uIG1hcChjb2xsZWN0aW9uLCBpdGVyYXRlZSkge1xuICB2YXIgZnVuYyA9IGlzQXJyYXkoY29sbGVjdGlvbikgPyBhcnJheU1hcCA6IGJhc2VNYXA7XG4gIHJldHVybiBmdW5jKGNvbGxlY3Rpb24sIGJhc2VJdGVyYXRlZShpdGVyYXRlZSwgMykpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcDtcbiIsInZhciBNYXBDYWNoZSA9IHJlcXVpcmUoJy4vX01hcENhY2hlJyk7XG5cbi8qKiBFcnJvciBtZXNzYWdlIGNvbnN0YW50cy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgbWVtb2l6ZXMgdGhlIHJlc3VsdCBvZiBgZnVuY2AuIElmIGByZXNvbHZlcmAgaXNcbiAqIHByb3ZpZGVkLCBpdCBkZXRlcm1pbmVzIHRoZSBjYWNoZSBrZXkgZm9yIHN0b3JpbmcgdGhlIHJlc3VsdCBiYXNlZCBvbiB0aGVcbiAqIGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24uIEJ5IGRlZmF1bHQsIHRoZSBmaXJzdCBhcmd1bWVudFxuICogcHJvdmlkZWQgdG8gdGhlIG1lbW9pemVkIGZ1bmN0aW9uIGlzIHVzZWQgYXMgdGhlIG1hcCBjYWNoZSBrZXkuIFRoZSBgZnVuY2BcbiAqIGlzIGludm9rZWQgd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgdGhlIG1lbW9pemVkIGZ1bmN0aW9uLlxuICpcbiAqICoqTm90ZToqKiBUaGUgY2FjaGUgaXMgZXhwb3NlZCBhcyB0aGUgYGNhY2hlYCBwcm9wZXJ0eSBvbiB0aGUgbWVtb2l6ZWRcbiAqIGZ1bmN0aW9uLiBJdHMgY3JlYXRpb24gbWF5IGJlIGN1c3RvbWl6ZWQgYnkgcmVwbGFjaW5nIHRoZSBgXy5tZW1vaXplLkNhY2hlYFxuICogY29uc3RydWN0b3Igd2l0aCBvbmUgd2hvc2UgaW5zdGFuY2VzIGltcGxlbWVudCB0aGVcbiAqIFtgTWFwYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtcHJvcGVydGllcy1vZi10aGUtbWFwLXByb3RvdHlwZS1vYmplY3QpXG4gKiBtZXRob2QgaW50ZXJmYWNlIG9mIGBjbGVhcmAsIGBkZWxldGVgLCBgZ2V0YCwgYGhhc2AsIGFuZCBgc2V0YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGhhdmUgaXRzIG91dHB1dCBtZW1vaXplZC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtyZXNvbHZlcl0gVGhlIGZ1bmN0aW9uIHRvIHJlc29sdmUgdGhlIGNhY2hlIGtleS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IG1lbW9pemVkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEsICdiJzogMiB9O1xuICogdmFyIG90aGVyID0geyAnYyc6IDMsICdkJzogNCB9O1xuICpcbiAqIHZhciB2YWx1ZXMgPSBfLm1lbW9pemUoXy52YWx1ZXMpO1xuICogdmFsdWVzKG9iamVjdCk7XG4gKiAvLyA9PiBbMSwgMl1cbiAqXG4gKiB2YWx1ZXMob3RoZXIpO1xuICogLy8gPT4gWzMsIDRdXG4gKlxuICogb2JqZWN0LmEgPSAyO1xuICogdmFsdWVzKG9iamVjdCk7XG4gKiAvLyA9PiBbMSwgMl1cbiAqXG4gKiAvLyBNb2RpZnkgdGhlIHJlc3VsdCBjYWNoZS5cbiAqIHZhbHVlcy5jYWNoZS5zZXQob2JqZWN0LCBbJ2EnLCAnYiddKTtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWydhJywgJ2InXVxuICpcbiAqIC8vIFJlcGxhY2UgYF8ubWVtb2l6ZS5DYWNoZWAuXG4gKiBfLm1lbW9pemUuQ2FjaGUgPSBXZWFrTWFwO1xuICovXG5mdW5jdGlvbiBtZW1vaXplKGZ1bmMsIHJlc29sdmVyKSB7XG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nIHx8IChyZXNvbHZlciAhPSBudWxsICYmIHR5cGVvZiByZXNvbHZlciAhPSAnZnVuY3Rpb24nKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICB2YXIgbWVtb2l6ZWQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAga2V5ID0gcmVzb2x2ZXIgPyByZXNvbHZlci5hcHBseSh0aGlzLCBhcmdzKSA6IGFyZ3NbMF0sXG4gICAgICAgIGNhY2hlID0gbWVtb2l6ZWQuY2FjaGU7XG5cbiAgICBpZiAoY2FjaGUuaGFzKGtleSkpIHtcbiAgICAgIHJldHVybiBjYWNoZS5nZXQoa2V5KTtcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpcywgYXJncyk7XG4gICAgbWVtb2l6ZWQuY2FjaGUgPSBjYWNoZS5zZXQoa2V5LCByZXN1bHQpIHx8IGNhY2hlO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIG1lbW9pemVkLmNhY2hlID0gbmV3IChtZW1vaXplLkNhY2hlIHx8IE1hcENhY2hlKTtcbiAgcmV0dXJuIG1lbW9pemVkO1xufVxuXG4vLyBFeHBvc2UgYE1hcENhY2hlYC5cbm1lbW9pemUuQ2FjaGUgPSBNYXBDYWNoZTtcblxubW9kdWxlLmV4cG9ydHMgPSBtZW1vaXplO1xuIiwiLyoqIEVycm9yIG1lc3NhZ2UgY29uc3RhbnRzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBuZWdhdGVzIHRoZSByZXN1bHQgb2YgdGhlIHByZWRpY2F0ZSBgZnVuY2AuIFRoZVxuICogYGZ1bmNgIHByZWRpY2F0ZSBpcyBpbnZva2VkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIGFuZCBhcmd1bWVudHMgb2YgdGhlXG4gKiBjcmVhdGVkIGZ1bmN0aW9uLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBwcmVkaWNhdGUgdG8gbmVnYXRlLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgbmVnYXRlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gaXNFdmVuKG4pIHtcbiAqICAgcmV0dXJuIG4gJSAyID09IDA7XG4gKiB9XG4gKlxuICogXy5maWx0ZXIoWzEsIDIsIDMsIDQsIDUsIDZdLCBfLm5lZ2F0ZShpc0V2ZW4pKTtcbiAqIC8vID0+IFsxLCAzLCA1XVxuICovXG5mdW5jdGlvbiBuZWdhdGUocHJlZGljYXRlKSB7XG4gIGlmICh0eXBlb2YgcHJlZGljYXRlICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDogcmV0dXJuICFwcmVkaWNhdGUuY2FsbCh0aGlzKTtcbiAgICAgIGNhc2UgMTogcmV0dXJuICFwcmVkaWNhdGUuY2FsbCh0aGlzLCBhcmdzWzBdKTtcbiAgICAgIGNhc2UgMjogcmV0dXJuICFwcmVkaWNhdGUuY2FsbCh0aGlzLCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICAgIGNhc2UgMzogcmV0dXJuICFwcmVkaWNhdGUuY2FsbCh0aGlzLCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICB9XG4gICAgcmV0dXJuICFwcmVkaWNhdGUuYXBwbHkodGhpcywgYXJncyk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmVnYXRlO1xuIiwidmFyIGJhc2VQaWNrID0gcmVxdWlyZSgnLi9fYmFzZVBpY2snKSxcbiAgICBmbGF0UmVzdCA9IHJlcXVpcmUoJy4vX2ZsYXRSZXN0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBvYmplY3QgY29tcG9zZWQgb2YgdGhlIHBpY2tlZCBgb2JqZWN0YCBwcm9wZXJ0aWVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcGFyYW0gey4uLihzdHJpbmd8c3RyaW5nW10pfSBbcGF0aHNdIFRoZSBwcm9wZXJ0eSBwYXRocyB0byBwaWNrLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxLCAnYic6ICcyJywgJ2MnOiAzIH07XG4gKlxuICogXy5waWNrKG9iamVjdCwgWydhJywgJ2MnXSk7XG4gKiAvLyA9PiB7ICdhJzogMSwgJ2MnOiAzIH1cbiAqL1xudmFyIHBpY2sgPSBmbGF0UmVzdChmdW5jdGlvbihvYmplY3QsIHBhdGhzKSB7XG4gIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHt9IDogYmFzZVBpY2sob2JqZWN0LCBwYXRocyk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBwaWNrO1xuIiwidmFyIGJhc2VQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2Jhc2VQcm9wZXJ0eScpLFxuICAgIGJhc2VQcm9wZXJ0eURlZXAgPSByZXF1aXJlKCcuL19iYXNlUHJvcGVydHlEZWVwJyksXG4gICAgaXNLZXkgPSByZXF1aXJlKCcuL19pc0tleScpLFxuICAgIHRvS2V5ID0gcmVxdWlyZSgnLi9fdG9LZXknKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSB2YWx1ZSBhdCBgcGF0aGAgb2YgYSBnaXZlbiBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjQuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBhY2Nlc3NvciBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdHMgPSBbXG4gKiAgIHsgJ2EnOiB7ICdiJzogMiB9IH0sXG4gKiAgIHsgJ2EnOiB7ICdiJzogMSB9IH1cbiAqIF07XG4gKlxuICogXy5tYXAob2JqZWN0cywgXy5wcm9wZXJ0eSgnYS5iJykpO1xuICogLy8gPT4gWzIsIDFdXG4gKlxuICogXy5tYXAoXy5zb3J0Qnkob2JqZWN0cywgXy5wcm9wZXJ0eShbJ2EnLCAnYiddKSksICdhLmInKTtcbiAqIC8vID0+IFsxLCAyXVxuICovXG5mdW5jdGlvbiBwcm9wZXJ0eShwYXRoKSB7XG4gIHJldHVybiBpc0tleShwYXRoKSA/IGJhc2VQcm9wZXJ0eSh0b0tleShwYXRoKSkgOiBiYXNlUHJvcGVydHlEZWVwKHBhdGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHByb3BlcnR5O1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGBmYWxzZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEzLjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRpbWVzKDIsIF8uc3R1YkZhbHNlKTtcbiAqIC8vID0+IFtmYWxzZSwgZmFsc2VdXG4gKi9cbmZ1bmN0aW9uIHN0dWJGYWxzZSgpIHtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0dWJGYWxzZTtcbiIsInZhciBiYXNlU3VtID0gcmVxdWlyZSgnLi9fYmFzZVN1bScpLFxuICAgIGlkZW50aXR5ID0gcmVxdWlyZSgnLi9pZGVudGl0eScpO1xuXG4vKipcbiAqIENvbXB1dGVzIHRoZSBzdW0gb2YgdGhlIHZhbHVlcyBpbiBgYXJyYXlgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy40LjBcbiAqIEBjYXRlZ29yeSBNYXRoXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgc3VtLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnN1bShbNCwgMiwgOCwgNl0pO1xuICogLy8gPT4gMjBcbiAqL1xuZnVuY3Rpb24gc3VtKGFycmF5KSB7XG4gIHJldHVybiAoYXJyYXkgJiYgYXJyYXkubGVuZ3RoKVxuICAgID8gYmFzZVN1bShhcnJheSwgaWRlbnRpdHkpXG4gICAgOiAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN1bTtcbiIsInZhciBiYXNlU2xpY2UgPSByZXF1aXJlKCcuL19iYXNlU2xpY2UnKSxcbiAgICB0b0ludGVnZXIgPSByZXF1aXJlKCcuL3RvSW50ZWdlcicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBzbGljZSBvZiBgYXJyYXlgIHdpdGggYG5gIGVsZW1lbnRzIHRha2VuIGZyb20gdGhlIGJlZ2lubmluZy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbj0xXSBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRvIHRha2UuXG4gKiBAcGFyYW0tIHtPYmplY3R9IFtndWFyZF0gRW5hYmxlcyB1c2UgYXMgYW4gaXRlcmF0ZWUgZm9yIG1ldGhvZHMgbGlrZSBgXy5tYXBgLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBzbGljZSBvZiBgYXJyYXlgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRha2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IFsxXVxuICpcbiAqIF8udGFrZShbMSwgMiwgM10sIDIpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogXy50YWtlKFsxLCAyLCAzXSwgNSk7XG4gKiAvLyA9PiBbMSwgMiwgM11cbiAqXG4gKiBfLnRha2UoWzEsIDIsIDNdLCAwKTtcbiAqIC8vID0+IFtdXG4gKi9cbmZ1bmN0aW9uIHRha2UoYXJyYXksIG4sIGd1YXJkKSB7XG4gIGlmICghKGFycmF5ICYmIGFycmF5Lmxlbmd0aCkpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgbiA9IChndWFyZCB8fCBuID09PSB1bmRlZmluZWQpID8gMSA6IHRvSW50ZWdlcihuKTtcbiAgcmV0dXJuIGJhc2VTbGljZShhcnJheSwgMCwgbiA8IDAgPyAwIDogbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdGFrZTtcbiIsInZhciB0b051bWJlciA9IHJlcXVpcmUoJy4vdG9OdW1iZXInKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgSU5GSU5JVFkgPSAxIC8gMCxcbiAgICBNQVhfSU5URUdFUiA9IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4O1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBmaW5pdGUgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMi4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9GaW5pdGUoMy4yKTtcbiAqIC8vID0+IDMuMlxuICpcbiAqIF8udG9GaW5pdGUoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiA1ZS0zMjRcbiAqXG4gKiBfLnRvRmluaXRlKEluZmluaXR5KTtcbiAqIC8vID0+IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4XG4gKlxuICogXy50b0Zpbml0ZSgnMy4yJyk7XG4gKiAvLyA9PiAzLjJcbiAqL1xuZnVuY3Rpb24gdG9GaW5pdGUodmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogMDtcbiAgfVxuICB2YWx1ZSA9IHRvTnVtYmVyKHZhbHVlKTtcbiAgaWYgKHZhbHVlID09PSBJTkZJTklUWSB8fCB2YWx1ZSA9PT0gLUlORklOSVRZKSB7XG4gICAgdmFyIHNpZ24gPSAodmFsdWUgPCAwID8gLTEgOiAxKTtcbiAgICByZXR1cm4gc2lnbiAqIE1BWF9JTlRFR0VSO1xuICB9XG4gIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgPyB2YWx1ZSA6IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9GaW5pdGU7XG4iLCJ2YXIgdG9GaW5pdGUgPSByZXF1aXJlKCcuL3RvRmluaXRlJyk7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhbiBpbnRlZ2VyLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBsb29zZWx5IGJhc2VkIG9uXG4gKiBbYFRvSW50ZWdlcmBdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2ludGVnZXIpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgY29udmVydGVkIGludGVnZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9JbnRlZ2VyKDMuMik7XG4gKiAvLyA9PiAzXG4gKlxuICogXy50b0ludGVnZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiAwXG4gKlxuICogXy50b0ludGVnZXIoSW5maW5pdHkpO1xuICogLy8gPT4gMS43OTc2OTMxMzQ4NjIzMTU3ZSszMDhcbiAqXG4gKiBfLnRvSW50ZWdlcignMy4yJyk7XG4gKiAvLyA9PiAzXG4gKi9cbmZ1bmN0aW9uIHRvSW50ZWdlcih2YWx1ZSkge1xuICB2YXIgcmVzdWx0ID0gdG9GaW5pdGUodmFsdWUpLFxuICAgICAgcmVtYWluZGVyID0gcmVzdWx0ICUgMTtcblxuICByZXR1cm4gcmVzdWx0ID09PSByZXN1bHQgPyAocmVtYWluZGVyID8gcmVzdWx0IC0gcmVtYWluZGVyIDogcmVzdWx0KSA6IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9JbnRlZ2VyO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIGlzU3ltYm9sID0gcmVxdWlyZSgnLi9pc1N5bWJvbCcpO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBOQU4gPSAwIC8gMDtcblxuLyoqIFVzZWQgdG8gbWF0Y2ggbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZS4gKi9cbnZhciByZVRyaW0gPSAvXlxccyt8XFxzKyQvZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJhZCBzaWduZWQgaGV4YWRlY2ltYWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmFkSGV4ID0gL15bLStdMHhbMC05YS1mXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiaW5hcnkgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmluYXJ5ID0gL14wYlswMV0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb2N0YWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzT2N0YWwgPSAvXjBvWzAtN10rJC9pO1xuXG4vKiogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgd2l0aG91dCBhIGRlcGVuZGVuY3kgb24gYHJvb3RgLiAqL1xudmFyIGZyZWVQYXJzZUludCA9IHBhcnNlSW50O1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBudW1iZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9OdW1iZXIoMy4yKTtcbiAqIC8vID0+IDMuMlxuICpcbiAqIF8udG9OdW1iZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiA1ZS0zMjRcbiAqXG4gKiBfLnRvTnVtYmVyKEluZmluaXR5KTtcbiAqIC8vID0+IEluZmluaXR5XG4gKlxuICogXy50b051bWJlcignMy4yJyk7XG4gKiAvLyA9PiAzLjJcbiAqL1xuZnVuY3Rpb24gdG9OdW1iZXIodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIE5BTjtcbiAgfVxuICBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgdmFyIG90aGVyID0gdHlwZW9mIHZhbHVlLnZhbHVlT2YgPT0gJ2Z1bmN0aW9uJyA/IHZhbHVlLnZhbHVlT2YoKSA6IHZhbHVlO1xuICAgIHZhbHVlID0gaXNPYmplY3Qob3RoZXIpID8gKG90aGVyICsgJycpIDogb3RoZXI7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogK3ZhbHVlO1xuICB9XG4gIHZhbHVlID0gdmFsdWUucmVwbGFjZShyZVRyaW0sICcnKTtcbiAgdmFyIGlzQmluYXJ5ID0gcmVJc0JpbmFyeS50ZXN0KHZhbHVlKTtcbiAgcmV0dXJuIChpc0JpbmFyeSB8fCByZUlzT2N0YWwudGVzdCh2YWx1ZSkpXG4gICAgPyBmcmVlUGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIGlzQmluYXJ5ID8gMiA6IDgpXG4gICAgOiAocmVJc0JhZEhleC50ZXN0KHZhbHVlKSA/IE5BTiA6ICt2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9OdW1iZXI7XG4iLCJ2YXIgYmFzZVRvU3RyaW5nID0gcmVxdWlyZSgnLi9fYmFzZVRvU3RyaW5nJyk7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZy4gQW4gZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkIGZvciBgbnVsbGBcbiAqIGFuZCBgdW5kZWZpbmVkYCB2YWx1ZXMuIFRoZSBzaWduIG9mIGAtMGAgaXMgcHJlc2VydmVkLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b1N0cmluZyhudWxsKTtcbiAqIC8vID0+ICcnXG4gKlxuICogXy50b1N0cmluZygtMCk7XG4gKiAvLyA9PiAnLTAnXG4gKlxuICogXy50b1N0cmluZyhbMSwgMiwgM10pO1xuICogLy8gPT4gJzEsMiwzJ1xuICovXG5mdW5jdGlvbiB0b1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT0gbnVsbCA/ICcnIDogYmFzZVRvU3RyaW5nKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b1N0cmluZztcbiIsInZhciB0b1N0cmluZyA9IHJlcXVpcmUoJy4vdG9TdHJpbmcnKSxcbiAgICB1bmVzY2FwZUh0bWxDaGFyID0gcmVxdWlyZSgnLi9fdW5lc2NhcGVIdG1sQ2hhcicpO1xuXG4vKiogVXNlZCB0byBtYXRjaCBIVE1MIGVudGl0aWVzIGFuZCBIVE1MIGNoYXJhY3RlcnMuICovXG52YXIgcmVFc2NhcGVkSHRtbCA9IC8mKD86YW1wfGx0fGd0fHF1b3R8IzM5KTsvZyxcbiAgICByZUhhc0VzY2FwZWRIdG1sID0gUmVnRXhwKHJlRXNjYXBlZEh0bWwuc291cmNlKTtcblxuLyoqXG4gKiBUaGUgaW52ZXJzZSBvZiBgXy5lc2NhcGVgOyB0aGlzIG1ldGhvZCBjb252ZXJ0cyB0aGUgSFRNTCBlbnRpdGllc1xuICogYCZhbXA7YCwgYCZsdDtgLCBgJmd0O2AsIGAmcXVvdDtgLCBhbmQgYCYjMzk7YCBpbiBgc3RyaW5nYCB0b1xuICogdGhlaXIgY29ycmVzcG9uZGluZyBjaGFyYWN0ZXJzLlxuICpcbiAqICoqTm90ZToqKiBObyBvdGhlciBIVE1MIGVudGl0aWVzIGFyZSB1bmVzY2FwZWQuIFRvIHVuZXNjYXBlIGFkZGl0aW9uYWxcbiAqIEhUTUwgZW50aXRpZXMgdXNlIGEgdGhpcmQtcGFydHkgbGlicmFyeSBsaWtlIFtfaGVfXShodHRwczovL210aHMuYmUvaGUpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC42LjBcbiAqIEBjYXRlZ29yeSBTdHJpbmdcbiAqIEBwYXJhbSB7c3RyaW5nfSBbc3RyaW5nPScnXSBUaGUgc3RyaW5nIHRvIHVuZXNjYXBlLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgdW5lc2NhcGVkIHN0cmluZy5cbiAqIEBleGFtcGxlXG4gKlxuICogXy51bmVzY2FwZSgnZnJlZCwgYmFybmV5LCAmYW1wOyBwZWJibGVzJyk7XG4gKiAvLyA9PiAnZnJlZCwgYmFybmV5LCAmIHBlYmJsZXMnXG4gKi9cbmZ1bmN0aW9uIHVuZXNjYXBlKHN0cmluZykge1xuICBzdHJpbmcgPSB0b1N0cmluZyhzdHJpbmcpO1xuICByZXR1cm4gKHN0cmluZyAmJiByZUhhc0VzY2FwZWRIdG1sLnRlc3Qoc3RyaW5nKSlcbiAgICA/IHN0cmluZy5yZXBsYWNlKHJlRXNjYXBlZEh0bWwsIHVuZXNjYXBlSHRtbENoYXIpXG4gICAgOiBzdHJpbmc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdW5lc2NhcGU7XG4iLCJ2YXIgYmFzZVZhbHVlcyA9IHJlcXVpcmUoJy4vX2Jhc2VWYWx1ZXMnKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi9rZXlzJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgc3RyaW5nIGtleWVkIHByb3BlcnR5IHZhbHVlcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IHZhbHVlcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy52YWx1ZXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbMSwgMl0gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqXG4gKiBfLnZhbHVlcygnaGknKTtcbiAqIC8vID0+IFsnaCcsICdpJ11cbiAqL1xuZnVuY3Rpb24gdmFsdWVzKG9iamVjdCkge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyBbXSA6IGJhc2VWYWx1ZXMob2JqZWN0LCBrZXlzKG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHZhbHVlcztcbiIsInZhciBmaW5kTWF0Y2hpbmdSdWxlID0gZnVuY3Rpb24ocnVsZXMsIHRleHQpe1xuICB2YXIgaTtcbiAgZm9yKGk9MDsgaTxydWxlcy5sZW5ndGg7IGkrKylcbiAgICBpZihydWxlc1tpXS5yZWdleC50ZXN0KHRleHQpKVxuICAgICAgcmV0dXJuIHJ1bGVzW2ldO1xuICByZXR1cm4gdW5kZWZpbmVkO1xufTtcblxudmFyIGZpbmRNYXhJbmRleEFuZFJ1bGUgPSBmdW5jdGlvbihydWxlcywgdGV4dCl7XG4gIHZhciBpLCBydWxlLCBsYXN0X21hdGNoaW5nX3J1bGU7XG4gIGZvcihpPTA7IGk8dGV4dC5sZW5ndGg7IGkrKyl7XG4gICAgcnVsZSA9IGZpbmRNYXRjaGluZ1J1bGUocnVsZXMsIHRleHQuc3Vic3RyaW5nKDAsIGkgKyAxKSk7XG4gICAgaWYocnVsZSlcbiAgICAgIGxhc3RfbWF0Y2hpbmdfcnVsZSA9IHJ1bGU7XG4gICAgZWxzZSBpZihsYXN0X21hdGNoaW5nX3J1bGUpXG4gICAgICByZXR1cm4ge21heF9pbmRleDogaSwgcnVsZTogbGFzdF9tYXRjaGluZ19ydWxlfTtcbiAgfVxuICByZXR1cm4gbGFzdF9tYXRjaGluZ19ydWxlID8ge21heF9pbmRleDogdGV4dC5sZW5ndGgsIHJ1bGU6IGxhc3RfbWF0Y2hpbmdfcnVsZX0gOiB1bmRlZmluZWQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9uVG9rZW5fb3JpZyl7XG4gIHZhciBidWZmZXIgPSBcIlwiO1xuICB2YXIgcnVsZXMgPSBbXTtcbiAgdmFyIGxpbmUgPSAxO1xuICB2YXIgY29sID0gMTtcblxuICB2YXIgb25Ub2tlbiA9IGZ1bmN0aW9uKHNyYywgdHlwZSl7XG4gICAgb25Ub2tlbl9vcmlnKHtcbiAgICAgIHR5cGU6IHR5cGUsXG4gICAgICBzcmM6IHNyYyxcbiAgICAgIGxpbmU6IGxpbmUsXG4gICAgICBjb2w6IGNvbFxuICAgIH0pO1xuICAgIHZhciBsaW5lcyA9IHNyYy5zcGxpdChcIlxcblwiKTtcbiAgICBsaW5lICs9IGxpbmVzLmxlbmd0aCAtIDE7XG4gICAgY29sID0gKGxpbmVzLmxlbmd0aCA+IDEgPyAxIDogY29sKSArIGxpbmVzW2xpbmVzLmxlbmd0aCAtIDFdLmxlbmd0aDtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGFkZFJ1bGU6IGZ1bmN0aW9uKHJlZ2V4LCB0eXBlKXtcbiAgICAgIHJ1bGVzLnB1c2goe3JlZ2V4OiByZWdleCwgdHlwZTogdHlwZX0pO1xuICAgIH0sXG4gICAgb25UZXh0OiBmdW5jdGlvbih0ZXh0KXtcbiAgICAgIHZhciBzdHIgPSBidWZmZXIgKyB0ZXh0O1xuICAgICAgdmFyIG0gPSBmaW5kTWF4SW5kZXhBbmRSdWxlKHJ1bGVzLCBzdHIpO1xuICAgICAgd2hpbGUobSAmJiBtLm1heF9pbmRleCAhPT0gc3RyLmxlbmd0aCl7XG4gICAgICAgIG9uVG9rZW4oc3RyLnN1YnN0cmluZygwLCBtLm1heF9pbmRleCksIG0ucnVsZS50eXBlKTtcblxuICAgICAgICAvL25vdyBmaW5kIHRoZSBuZXh0IHRva2VuXG4gICAgICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcobS5tYXhfaW5kZXgpO1xuICAgICAgICBtID0gZmluZE1heEluZGV4QW5kUnVsZShydWxlcywgc3RyKTtcbiAgICAgIH1cbiAgICAgIGJ1ZmZlciA9IHN0cjtcbiAgICB9LFxuICAgIGVuZDogZnVuY3Rpb24oKXtcbiAgICAgIGlmKGJ1ZmZlci5sZW5ndGggPT09IDApXG4gICAgICAgIHJldHVybjtcblxuICAgICAgdmFyIHJ1bGUgPSBmaW5kTWF0Y2hpbmdSdWxlKHJ1bGVzLCBidWZmZXIpO1xuICAgICAgaWYoIXJ1bGUpe1xuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKFwidW5hYmxlIHRvIHRva2VuaXplXCIpO1xuICAgICAgICBlcnIudG9rZW5pemVyMiA9IHtcbiAgICAgICAgICBidWZmZXI6IGJ1ZmZlcixcbiAgICAgICAgICBsaW5lOiBsaW5lLFxuICAgICAgICAgIGNvbDogY29sXG4gICAgICAgIH07XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cblxuICAgICAgb25Ub2tlbihidWZmZXIsIHJ1bGUudHlwZSk7XG4gICAgfVxuICB9O1xufTtcbiIsIi8qKiBAbW9kdWxlIGNvbmZpZy9zeWxsYWJsZXMgKi9cblxudmFyIGdldExhbmd1YWdlID0gcmVxdWlyZSggXCIuLi9oZWxwZXJzL2dldExhbmd1YWdlLmpzXCIgKTtcbnZhciBpc1VuZGVmaW5lZCA9IHJlcXVpcmUoIFwibG9kYXNoL2lzVW5kZWZpbmVkXCIgKTtcblxudmFyIGRlID0gcmVxdWlyZSggXCIuL3N5bGxhYmxlcy9kZS5qc29uXCIgKTtcbnZhciBlbiA9IHJlcXVpcmUoICcuL3N5bGxhYmxlcy9lbi5qc29uJyApO1xudmFyIG5sID0gcmVxdWlyZSggJy4vc3lsbGFibGVzL25sLmpzb24nICk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGxvY2FsZSApIHtcblx0aWYgKCBpc1VuZGVmaW5lZCggbG9jYWxlICkgKSB7XG5cdFx0bG9jYWxlID0gXCJlbl9VU1wiXG5cdH1cblxuXHRzd2l0Y2goIGdldExhbmd1YWdlKCBsb2NhbGUgKSApIHtcblx0XHRjYXNlIFwiZGVcIjpcblx0XHRcdHJldHVybiBkZTtcblx0XHRjYXNlIFwibmxcIjpcblx0XHRcdHJldHVybiBubDtcblx0XHRjYXNlIFwiZW5cIjpcblx0XHRkZWZhdWx0OlxuXHRcdFx0cmV0dXJuIGVuO1xuXHR9XG59O1xuIiwibW9kdWxlLmV4cG9ydHM9e1xuXHRcInZvd2Vsc1wiOiBcImFlaW91ecOkw7bDvMOhw6nDosOgw6jDrsOqw6LDu8O0xZNcIixcblx0XCJkZXZpYXRpb25zXCI6IHtcblx0XHRcInZvd2Vsc1wiOiBbXG5cdFx0XHR7XG5cdFx0XHRcdFwiZnJhZ21lbnRzXCI6IFsgXCJvdWlsXCIsIFwiZGVhdXhcIiwgXCJkZWF1JFwiLCBcIm9hcmRcIiwgXCLDpHRoaW9wXCIsIFwiZXVpbFwiLCBcInZlYXVcIiwgXCJlYXUkXCIsIFwidWV1ZVwiLCBcImxpZW5pc2NoXCIsIFwiYW5jZSRcIiwgXCJlbmNlJFwiLCBcInRpbWUkXCIsXG5cdFx0XHRcdFx0XCJvbmNlJFwiLCBcInppYXRcIiwgXCJndWV0dGVcIiwgXCLDqnRlXCIsIFwiw7R0ZSRcIiwgXCJbaHBdb21tZSRcIiwgXCJbcWRzY25ddWUkXCIsIFwiYWlyZSRcIiwgXCJ0dXJlJFwiLCBcIsOqcGUkXCIsIFwiW15xXXVpJFwiLCBcInRpY2hlJFwiLFxuXHRcdFx0XHRcdFwidmljZSRcIiwgXCJvaWxlJFwiLCBcInppYWxcIiwgXCJjcnVpc1wiLCBcImxlYXNcIiwgXCJjb2FbY3RdXCIsIFwiW15pXWRlYWxcIiwgXCJbZnddZWF0XCIsIFwiW2xzeF1lZCRcIiBdLFxuXHRcdFx0XHRcImNvdW50TW9kaWZpZXJcIjogLTFcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdFwiZnJhZ21lbnRzXCI6IFsgXCJhYXVcIiwgXCJhW8Okw7bDvG9dXCIsIFwiw6R1ZVwiLCBcIsOkZXVcIiwgXCJhZWlcIiwgXCJhdWVcIiwgXCJhZXVcIiwgXCJhZWxcIiwgXCJhaVthZW9dXCIsIFwic2Fpa1wiLCBcImFpc211c1wiLCBcIsOkW2Flb2ldXCIsIFwiYXXDpFwiLCBcIsOpYVwiLFxuXHRcdFx0XHRcdFwiZVvDpGFvw7ZdXCIsIFwiZWlbZW9dXCIsIFwiZWVbYWVpb3VdXCIsIFwiZXVbYcOkZV1cIiwgXCJldW0kXCIsIFwiZcO8XCIsIFwib1thw6TDtsO8XVwiLCBcInBvZXRcIiwgXCJvb1tlb11cIiwgXCJvaWVcIiwgXCJvZWlbXmxdXCIsIFwib2V1W15mXVwiLCBcIsO2YVwiLCBcIltmZ3J6XWlldVwiLFxuXHRcdFx0XHRcdFwibWlldW5cIiwgXCJ0aWV1clwiLCBcImlldW1cIiwgXCJpW2FpdcO8XVwiLCBcIltebF1pw6RcIiwgXCJbXnNdY2hpZW5cIiwgXCJpb1tiY2RmaGprbXBxdHV2d3hdXCIsIFwiW2JkaG1wcnZdaW9uXCIsIFwiW2xyXWlvclwiLFxuXHRcdFx0XHRcdFwiW15nXWlvW2dzXVwiLCBcIltkcl1pb3pcIiwgXCJlbGlvelwiLCBcInppb25pXCIsIFwiYmlvW2xub3J6XVwiLCBcImnDtltec11cIiwgXCJpZVtlaV1cIiwgXCJyaWVyJFwiLCBcIsO2aVtlZ11cIiwgXCJbXnJdw7Zpc2NoXCIsXG5cdFx0XHRcdFx0XCJbXmdxdl11W2Flw6lpb8O2dcO8XVwiLCBcInF1aWUkXCIsIFwicXVpZVtec11cIiwgXCJ1w6R1XCIsIFwiXnVzLVwiLCBcIl5pdC1cIiwgXCLDvGVcIiwgXCJuYWl2XCIsIFwiYWlzY2gkXCIsIFwiYWlzY2hlJFwiLCBcImFpc2NoZVtucnNdJFwiLCBcIltsc3RdaWVuXCIsXG5cdFx0XHRcdFx0XCJkaWVuJFwiLCBcImdvaXNcIiwgXCJbXmddcmllbnRcIiwgXCJbYWVpb3VdeVthZWlvdV1cIiwgXCJieWlcIiwgXCJ5w6RcIiwgXCJbYS16XXlbYW9dXCIsIFwieWF1XCIsIFwia29vclwiLCBcInNjaWVudFwiLCBcImVyaWVsXCIsIFwiW2RnXW9pbmdcIiBdLFxuXHRcdFx0XHRcImNvdW50TW9kaWZpZXJcIjogMVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0XCJmcmFnbWVudHNcIjogWyBcImVhdcO8XCIsIFwiaW9pXCIsIFwiaW9vXCIsIFwiaW9hXCIsIFwiaWlpXCIsIFwib2FpXCIsIFwiZXVldVwiIF0sXG5cdFx0XHRcdFwiY291bnRNb2RpZmllclwiOiAxXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRcIndvcmRzXCI6IHtcblx0XHRcdFwiZnVsbFwiOiBbXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmVhY2hcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImJlYXRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImJlYXVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImJlYXVuZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmVsbGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImJvdWNoZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYnJha2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImNhY2hlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJjYWNoZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2hhaXNlbG9uZ3VlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJjaG9rZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY29yZGlhbGVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImNvcmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImRvcGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImVhdFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZXllXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJmYWtlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJmYW1lXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJmYXRpZ3VlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJmZW1tZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZm9yY2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImdhbWVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImdhbWVzXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJnYXRlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJncmFuZGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImljZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaW9uXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJqb2tlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJqdXBlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJtYWlzY2hcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcIm1haXNjaGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcIm1vdmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcIm5hdGl2ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwibmljZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwib25lXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJwaXBlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJwcmltZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmF0ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmh5dGhtXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJyaWRlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJyaWRlc1wiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmllblwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2F2ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2NpZW5jZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2nDqGNsZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2l0ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3VpdGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInRha2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInRhdXBlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJ1bml2ZXJzZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwidm9ndWVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcIndhdmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInppb25cIiwgXCJzeWxsYWJsZXNcIjogMn1cblx0XHRcdF0sXG5cdFx0XHRcImZyYWdtZW50c1wiOiB7XG5cdFx0XHRcdFwiZ2xvYmFsXCI6IFtcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImFicmVha3Rpb25cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYWR3YXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImFmZmFpcmVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYWlndWnDqHJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImFuaXNldHRlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImFwcGVhbFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiYWNrc3RhZ2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmFua3JhdGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmFzZWJhbGxcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmFzZWp1bXBcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmVhY2hjb21iZXJcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmVhY2h2b2xsZXliYWxsXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJlYWdsZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiZWFtZXJcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmVhbWVyXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImLDqWFybmFpc2VcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmVhdWZvcnRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmVhdWpvbGFpc1wiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiZWF1dMOpXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJlYXV0eVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiZWxnaWVyXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJlc3RpZW5cIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmlza3VpdFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJibGVhY2hcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmx1ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJib2FyZFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJib2F0XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJvZHlzdWl0XCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJvcmRlbGFpc2VcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYnJlYWtcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYnVpbGRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYnVyZWF1XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJ1c2luZXNzXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNhYnJpb1wiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYWJyaW9sZXRcIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2FjaGVzZXhlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNhbWFpZXVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2FueW9uXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNhc2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2F0c3VpdFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjZW50aW1lXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNoYWlzZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjaGFtcGlvblwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjaGFtcGlvbmF0XCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNoYXBpdGVhdVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjaGF0ZWF1XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNow6J0ZWF1XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNoZWF0XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNoZWVzZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjaGlodWFodWFcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2hvaWNlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNpcmNvbmZsZXhlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNsZWFuXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNsb2NoZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjbG9zZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjbG90aGVzXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNvbW1lcmNlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNyaW1lXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNyb3NzcmF0ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjdWlzaW5lXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImN1bG90dGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZGVhdGhcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZGVmZW5zZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJkw6l0ZW50ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJkcmVhZFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJkcmVhbVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJkcmVzc2NvZGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZHVuZ2VvblwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJlYXN5XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImVuZ2FnZW1lbnRcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZW50ZW50ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJleWUtY2F0Y2hlclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJleWVjYXRjaGVyXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImV5ZWxpbmVyXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImV5ZXdvcmRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmFzaGlvblwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmZWF0dXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZlcmllblwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmaW5lbGluZXJcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmlzaGV5ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmbGFrZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmbGFtYmVhdVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmbGF0cmF0ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmbGVlY2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZnJhw65jaGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZnJlYWtcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZnJpdGVzXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZ1dHVyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnYWVsaWNcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2FtZS1zaG93XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdhbWVib3lcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2FtZXBhZFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnYW1lcGxheVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnYW1lcG9ydFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnYW1lc2hvd1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnYXJpZ3VlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdhcnJpZ3VlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdhdGVmb2xkXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdhdGV3YXlcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2VmbGFzaGVkXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdlb3JnaWVyXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdvYWxcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ3JhcGVmcnVpdFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJncmVhdFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJncm91cHdhcmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ3VldWxlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImd1aWRlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImd1aWxsb2NoZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJneW7DpHplZW5cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ3luw7Z6ZWVuXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhhaXJjYXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhhcmRjb3JlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhhcmR3YXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhlYWRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaGVhcmluZ1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoZWFydFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoZWF2eVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoZWRnZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoZXJvaW5cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaW5jbHVzaXZlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImluaXRpYXRpdmVcIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaW5zaWRlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImphZ3VhclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJqYWxvdXNldHRlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImplYW5zXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImpldW5lc3NlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImp1aWNlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImp1a2Vib3hcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwianVtcHN1aXRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwia2FuYXJpZW5cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwia2FwcmlvbGVcIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwia2Fyb3NzZXJpZWxpbmllXCIsIFwic3lsbGFibGVzXCI6IDYgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImtvbm9wZWVuXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxhY3Jvc3NlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxhcGxhY2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibGF0ZS1cIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibGVhZFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsZWFndWVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibGVhcm5cIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibMOpZ2nDqHJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxpemVuemlhdFwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsb2FkXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxvdHRlcmllbG9zXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxvdW5nZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJseXplZW5cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWFkYW1lXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1hZGVtb2lzZWxsZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtYWdpZXJcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWFrZS11cFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtYWx3YXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1hbmFnZW1lbnRcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWFudGVhdVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtYXVzb2xlZW5cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWF1dmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWVkaWVuXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1lc2RhbWVzXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1lc29wb3RhbWllblwiLCBcInN5bGxhYmxlc1wiOiA2IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtaWxsaWFyZGVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWlzc2lsZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtaXN6ZWxsYW5lZW5cIiwgXCJzeWxsYWJsZXNcIjogNSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibW91c3NlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1vdXNzZWxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibXVzZWVuXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm11c2V0dGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibmFodWF0bFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJub2lzZXR0ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJub3RlYm9va1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJudWFuY2VcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibnVrbGVhc2VcIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwib2RlZW5cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwib2ZmbGluZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJvZmZzaWRlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm9sZWFzdGVyXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm9uLXN0YWdlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm9ubGluZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJvcnBoZWVuXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBhcmZvcmNlcml0dFwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwYXRpZW5zXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBhdGllbnRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGVhY2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGVhY2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGVhbnV0c1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwZW9wbGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGVyaW5lZW5cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGVyaXRvbmVlblwiLCBcInN5bGxhYmxlc1wiOiA1IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwaWN0dXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBpZWNlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBpcGVsaW5lXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBsYXRlYXVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicG9lc2llXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBvbGVwb3NpdGlvblwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwb3J0ZW1hbnRlYXVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicG9ydGVtb25uYWllXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInByaW1lcmF0ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwcmltZXJhdGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicHJpbWV0aW1lXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInByb3RlYXNlXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInByb3RlaW5cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicHJ5dGFuZWVuXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInF1b3RpZW50XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJhZGlvXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJlYWRlclwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyZWFkeVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyZWFsbGlmZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyZXBlYXRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmV0YWtlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJpZ29sZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyaXNvbGxlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJvYWRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicm9hbWluZ1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyb3F1ZWZvcnRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2FmZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzYXZvbmV0dGVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2NpZW5jZWZpY3Rpb25cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2VhcmNoXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNlbGZtYWRlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNlcHRpbWVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2VyYXBlZW5cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2VydmljZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzZXJ2aWV0dGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2hhcmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2hhdmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2hvcmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2lkZWJhclwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzaWRlYm9hcmRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2lkZWtpY2tcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2lsaG91ZXR0ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzaXRlbWFwXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNsaWRlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNuZWFrXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNvYXBcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic29mdGNvcmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic29mdHdhcmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic291dGFuZWxsZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzcGVha1wiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzcGVjaWFsXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNwcmFjaGVpbnN0ZWxsdW5nXCIsIFwic3lsbGFibGVzXCI6IDUgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNweXdhcmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3F1YXJlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0YWdlZGl2aW5nXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0YWtlaG9sZGVyXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0YXRlbWVudFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdGVhZHlcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RlYWtcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RlYWx0aFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdGVhbVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdG9uZWRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RyYWNjaWF0ZWxsYVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdHJlYW1cIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RyaWRlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0cmlrZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdWl0Y2FzZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzd2VlcHN0YWtlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInQtYm9uZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0LXNoaXJ0XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRhaWxnYXRlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRha2Utb2ZmXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRha2Utb3ZlclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0YWtlYXdheVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0YWtlb2ZmXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRha2VvdmVyXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRocm9hdFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0aW1lLW91dFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0aW1lbGFnXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRpbWVsaW5lXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRpbWVzaGFyaW5nXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRvYXN0XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRyYXViZW5tYWlzY2hlXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRyaXN0ZXNzZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ1c2VuZXRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidmFyaWV0w6R0XCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInZhcmlldMOpXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInZpbmFpZ3JldHRlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInZpbnRhZ2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidmlvbGV0dFwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ2b2ljZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ3YWtlYm9hcmRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwid2FzaGVkXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIndhdmVib2FyZFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ3ZWFyXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIndlYXJcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwid2Vic2l0ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ3aGl0ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ3aWRlc2NyZWVuXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIndpcmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwieWFjaHRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwieW9ya3NoaXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIsOpcHJvdXZldHRlXCIsIFwic3lsbGFibGVzXCI6IDMsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnYWxldHRlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnaWd1ZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ3Jvb3ZlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtb3JndWVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBhaWxsZXR0ZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmFjbGV0dGVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJvdWxldHRlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzcGlrZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3R5bGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRhYmxldHRlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJncnVuZ2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNpemVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInZhbHVlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJxdWljaGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhvdXNlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwic1wiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2F1Y2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJzXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzcGFjZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImFpcmxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhdXRvc2F2ZVwiLCBcInN5bGxhYmxlc1wiOiAzLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJhZ3BpcGVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiaWtlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZGFuY2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJkZWFkbGluZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhhbGZwaXBlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaGVhZGxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJob21lXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaG9ybnBpcGVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJob3RsaW5lXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaW5mb2xpbmVcIiwgXCJzeWxsYWJsZXNcIjogMywgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJpbmxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJraXRlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicm9sbGVyYmxhZGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzY29yZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNreWxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzbGFja2xpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzbGljZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInJcIiwgXCJzXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzbm9vemVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdG9yeWxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMywgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJvZmZpY2VcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcInNcIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzcGFjZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInNcIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0ZWFzZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInNcIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYWNoZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1widFwiXSB9XG5cdFx0XHRcdF0sXG5cdFx0XHRcdFwiYXRCZWdpbm5pbmdPckVuZFwiOiBbXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYXNlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxpZmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGVha1wiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0ZWFtXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNyZW1lXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY3LDqG1lXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZHJpdmVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJza2F0ZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInVwZGF0ZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInVwZ3JhZGVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH1cblx0XHRcdFx0XSxcblx0XHRcdFx0XCJhdEJlZ2lubmluZ1wiOiBbXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhbmlvblwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmYWNlbGlmdFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJqaXVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGFjZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzaGFrZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0ZWFcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidHJhZGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZGVhbFwiLCBcInN5bGxhYmxlc1wiOiAxIH1cblx0XHRcdFx0XSxcblx0XHRcdFx0XCJhdEVuZFwiOiBbXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmYWNlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZpbGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibW91c3NlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBsYXRlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRhcGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYnl0ZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcImFsc29Gb2xsb3dlZEJ5XCI6IFtcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNhcGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbXCJzXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmaXZlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwiYWxzb0ZvbGxvd2VkQnlcIjogW1wic1wiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaHlwZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcImFsc29Gb2xsb3dlZEJ5XCI6IFtcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxlYWtcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbXCJzXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsaWtlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwiYWxzb0ZvbGxvd2VkQnlcIjogW1wic1wiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWFrZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcImFsc29Gb2xsb3dlZEJ5XCI6IFtcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBob25lXCIsIFwic3lsbGFibGVzXCI6IDEsIFwiYWxzb0ZvbGxvd2VkQnlcIjogW1wic1wiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmF2ZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcImFsc29Gb2xsb3dlZEJ5XCI6IFtcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJlZ2ltZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcImFsc29Gb2xsb3dlZEJ5XCI6IFtcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0YXR1ZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcImFsc29Gb2xsb3dlZEJ5XCI6IFtcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0b3JlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwiYWxzb0ZvbGxvd2VkQnlcIjogW1wic1wiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwid2F2ZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcImFsc29Gb2xsb3dlZEJ5XCI6IFtcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImRhdGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImltYWdlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJzXCJdIH1cblx0XHRcdFx0XVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuIiwibW9kdWxlLmV4cG9ydHM9e1xuXHRcInZvd2Vsc1wiOiBcImFlaW91eVwiLFxuXHRcImRldmlhdGlvbnNcIjoge1xuXHRcdFwidm93ZWxzXCI6IFtcblx0XHRcdHtcblx0XHRcdFx0XCJmcmFnbWVudHNcIjogWyBcImNpYWxcIiwgXCJ0aWFcIiwgXCJjaXVzXCIsIFwiZ2l1XCIsIFwiaW9uXCIsXG5cdFx0XHRcdFx0XCJbXmJkbnBydl1pb3VcIiwgXCJzaWEkXCIsIFwiW15hZWl1b3RdezIsfWVkJFwiLCBcIlthZWlvdXldW15hZWl1b3l0c117MSx9ZSRcIixcblx0XHRcdFx0XHRcIlthLXpdZWx5JFwiLCBcIltjZ3ldZWQkXCIsIFwicnZlZCRcIiwgXCJbYWVpb3V5XVtkdF1lcz8kXCIsIFwiZWF1XCIsIFwiaWV1XCIsXG5cdFx0XHRcdFx0XCJvZXVcIiwgXCJbYWVpb3V5XVteYWVpb3V5ZHRdZVtzZF0/JFwiLCBcIlthZW91eV1yc2UkXCIsIFwiXmV5ZVwiIF0sXG5cdFx0XHRcdFwiY291bnRNb2RpZmllclwiOiAtMVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0XCJmcmFnbWVudHNcIjogWyBcImlhXCIsIFwiaXVcIiwgXCJpaVwiLCBcImlvXCIsIFwiW2FlaW9dW2FlaW91XXsyfVwiLCBcIlthZWlvdV1pbmdcIiwgXCJbXmFlaW91XXlpbmdcIiwgXCJ1aVthZW91XVwiIF0sXG5cdFx0XHRcdFwiY291bnRNb2RpZmllclwiOiAxXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRcImZyYWdtZW50c1wiOiBbIFwiXnJlZVtqbW5wcXJzeF1cIiwgXCJecmVlbGVcIiwgXCJecmVldmFcIiwgXCJyaWV0XCIsXG5cdFx0XHRcdFx0XCJkaWVuXCIsIFwiW2FlaW91eW1dW2JkcF1sZSRcIiwgXCJ1ZWlcIiwgXCJ1b3VcIixcblx0XHRcdFx0XHRcIl5tY1wiLCBcImlzbSRcIiwgXCJbXmxdbGllblwiLCBcIl5jb2FbZGdseF0uXCIsXG5cdFx0XHRcdFx0XCJbXmdxYXVpZW9ddWFbXmF1aWVvXVwiLCBcImRuJ3QkXCIsIFwidWl0eSRcIiwgXCJpZShyfHN0KVwiLFxuXHRcdFx0XHRcdFwiW2FlaW91d115W2FlaW91XVwiLCBcIlteYW9daXJlW2RzXVwiLCBcIlteYW9daXJlJFwiIF0sXG5cdFx0XHRcdFwiY291bnRNb2RpZmllclwiOiAxXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRcImZyYWdtZW50c1wiOiBbIFwiZW9hXCIsIFwiZW9vXCIsIFwiaW9hXCIsIFwiaW9lXCIsIFwiaW9vXCIgXSxcblx0XHRcdFx0XCJjb3VudE1vZGlmaWVyXCI6IDFcblx0XHRcdH1cblx0XHRdLFxuXHRcdFwid29yZHNcIjoge1xuXHRcdFx0XCJmdWxsXCI6IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFwid29yZFwiOiBcImJ1c2luZXNzXCIsXG5cdFx0XHRcdFx0XCJzeWxsYWJsZXNcIjogMlxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0XCJ3b3JkXCI6IFwiY29oZWlyZXNzXCIsXG5cdFx0XHRcdFx0XCJzeWxsYWJsZXNcIjogM1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0XCJ3b3JkXCI6IFwiY29sb25lbFwiLFxuXHRcdFx0XHRcdFwic3lsbGFibGVzXCI6IDJcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFwid29yZFwiOiBcImhlaXJlc3NcIixcblx0XHRcdFx0XHRcInN5bGxhYmxlc1wiOiAyXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRcIndvcmRcIjogXCJpLmVcIixcblx0XHRcdFx0XHRcInN5bGxhYmxlc1wiOiAyXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRcIndvcmRcIjogXCJzaG9yZWxpbmVcIixcblx0XHRcdFx0XHRcInN5bGxhYmxlc1wiOiAyXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRcIndvcmRcIjogXCJzaW1pbGVcIixcblx0XHRcdFx0XHRcInN5bGxhYmxlc1wiOiAzXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRcIndvcmRcIjogXCJ1bmhlaXJlZFwiLFxuXHRcdFx0XHRcdFwic3lsbGFibGVzXCI6IDJcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFwid29yZFwiOiBcIndlZG5lc2RheVwiLFxuXHRcdFx0XHRcdFwic3lsbGFibGVzXCI6IDJcblx0XHRcdFx0fVxuXHRcdFx0XSxcblx0XHRcdFwiZnJhZ21lbnRzXCI6IHtcblx0XHRcdFx0XCJnbG9iYWxcIjogW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFwid29yZFwiOiBcImNveW90ZVwiLFxuXHRcdFx0XHRcdFx0XCJzeWxsYWJsZXNcIjogM1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XCJ3b3JkXCI6IFwiZ3JhdmV5YXJkXCIsXG5cdFx0XHRcdFx0XHRcInN5bGxhYmxlc1wiOiAyXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcIndvcmRcIjogXCJsYXd5ZXJcIixcblx0XHRcdFx0XHRcdFwic3lsbGFibGVzXCI6IDJcblx0XHRcdFx0XHR9XG5cdFx0XHRcdF1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJ2b3dlbHNcIjogXCJhw6HDpMOiZcOpw6vDqmnDrcOvw65vw7PDtsO0dcO6w7zDu3lcIixcblx0XCJkZXZpYXRpb25zXCI6IHtcblx0XHRcInZvd2Vsc1wiOiBbXG5cdFx0XHR7XG5cdFx0XHRcdFwiZnJhZ21lbnRzXCI6IFsgXCJ1ZSRcIiwgXCJkZ2UkXCIsIFwiW3RjcF1pw6tudFwiLFxuXHRcdFx0XHRcdFwiYWNlJFwiLCBcIlticl1lYWNoXCIsIFwiW2FpbnByXXRpYWFsXCIsIFwiW2lvXXRpYWFuXCIsXG5cdFx0XHRcdFx0XCJndWFbeWNdXCIsIFwiW15pXWRlYWxcIiwgXCJ0aXZlJFwiLCBcImxvYWRcIiwgXCJbXmVdY29rZVwiLFxuXHRcdFx0XHRcdFwiW15zXWNvcmUkXCIgXSxcblx0XHRcdFx0XCJjb3VudE1vZGlmaWVyXCI6IC0xXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRcImZyYWdtZW50c1wiOiBbIFwiYcOkXCIsIFwiYWV1XCIsIFwiYWllXCIsIFwiYW9cIiwgXCLDq1wiLCBcImVvXCIsXG5cdFx0XHRcdFx0XCJlw7pcIiwgXCJpZWF1XCIsIFwiZWEkXCIsIFwiZWFbXnVdXCIsIFwiZWlbZWpdXCIsXG5cdFx0XHRcdFx0XCJldVtpdV1cIiwgXCLDr1wiLCBcImllaVwiLCBcImllbm5lXCIsIFwiW15sXWlldVted11cIixcblx0XHRcdFx0XHRcIltebF1pZXUkXCIsIFwiaVthdWl5XVwiLCBcInN0aW9uXCIsXG5cdFx0XHRcdFx0XCJbXmNzdHhdaW9cIiwgXCJec2lvblwiLCBcInJpw6hcIiwgXCJvw7ZcIiwgXCJvYVwiLCBcIm9laW5nXCIsXG5cdFx0XHRcdFx0XCJvaWVcIiwgXCJbZXVdw7xcIiwgXCJbXnFddVthZcOob11cIiwgXCJ1aWVcIixcblx0XHRcdFx0XHRcIltiaG5wcl1pZWVsXCIsIFwiW2JobnByXWnDq2xcIiBdLFxuXHRcdFx0XHRcImNvdW50TW9kaWZpZXJcIjogMVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0XCJmcmFnbWVudHNcIjogWyBcIlthZW9sdV15W2Flw6nDqG/Ds3VdXCIgXSxcblx0XHRcdFx0XCJjb3VudE1vZGlmaWVyXCI6IDFcblx0XHRcdH1cblx0XHRdLFxuXHRcdFwid29yZHNcIjoge1xuXHRcdFx0XCJmdWxsXCI6IFtcblx0XHRcdFx0eyBcIndvcmRcIjogXCJieWVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImNvcmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImN1cmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImRlaVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZG9wZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZHVkZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmFrZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmFtZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZml2ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaG9sZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwibGVhc3RcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImxvbmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcIm1pbnV0ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwibW92ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwibmljZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwib25lXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJzdGF0ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3VycGxhY2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInRha2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInRyYWRlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJ3aWRlXCIsIFwic3lsbGFibGVzXCI6IDEgfVxuXHRcdFx0XSxcblx0XHRcdFwiZnJhZ21lbnRzXCI6IHtcblx0XHRcdFx0XCJnbG9iYWxcIjogW1xuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYWRpZXVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYWlybGluZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhaXJtaWxlc1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhbGllblwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhbWJpZW50XCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImFubm91bmNlbWVudFwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhcHBlYXJhbmNlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImFwcGVhc2VtZW50XCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImF0aGVuZXVtXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImF3ZXNvbWVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmFjY2FsYXVyZWlcIiwgXCJzeWxsYWJsZXNcIjogNSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmFjY2FsYXVyZXVzXCIsIFwic3lsbGFibGVzXCI6IDUgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJhc2ViYWxsXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJhc2VqdW1wXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJhbmxpZXVlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJhcGFvXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJhcmJlY3VlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJlYW1lclwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiZWFuaWVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmVhdFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiZWxsZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiw6p0ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiaW5nZXdhdGNoXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJsb2Nub3RlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJsdWVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYm9hcmRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYnJlYWtcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYnJvYWRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYnVsbHMtZXllXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJ1c2luZXNzXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJ5ZWJ5ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYWNhb1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYWVzYXJcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2FtYWlldVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYW91dGNob3VjXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNhcmJvbGluZXVtXCIsIFwic3lsbGFibGVzXCI6IDUgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNhdGNocGhyYXNlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNhcnJpZXJcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2hlYXRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2hlZXNlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNpcmNvbmZsZXhlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNsZWFuXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNsb2FrXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNvYnV5aW5nXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNvbWViYWNrXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNvbWZvcnR6b25lXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNvbW11bmlxdcOpXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNvbm9wZXVtXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNvbnNvbGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY29ycG9yYXRlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNvw7t0ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjcmVhbWVyXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNyaW1lXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNydWVzbGlcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZGVhZGxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZGVhdXRvcmlzZXJlblwiLCBcInN5bGxhYmxlc1wiOiA2IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJkZXVjZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJkZXVtXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImRpcm5kbFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJkcmVhZFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJkcmVhbXRlYW1cIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZHJvbmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZW5xdcOqdGVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZXNjYXBlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImV4cG9zdXJlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImV4dHJhbmVpXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImV4dHJhbmV1c1wiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJleWVjYXRjaGVyXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImV5ZWxpbmVyXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImV5ZW9wZW5lclwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJleWV0cmFja2VyXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImV5ZXRyYWNraW5nXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZhaXJ0cmFkZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmYXV0ZXVpbFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmZWF0dXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZldWlsbGV0ZWVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmV1aWxsZXRvblwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmaXNoZXllXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZpbmVsaW5lclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmaW5ldHVuZW5cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZm9yZWhhbmRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZnJlYWtcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZnVzaW9uZXJlblwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnYXlwYXJhZGVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2F5cHJpZGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ29hbFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJncmFwZWZydWl0XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdydXnDqHJlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImd1ZWxlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImd1ZXJyaWxsYVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJndWVzdFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoYXJkd2FyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoYXV0ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoZWFsaW5nXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhlYXRlclwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoZWF2eVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJob2F4XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhvdGxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaWRlZS1maXhlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImluY2x1c2l2ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJpbmxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaW50YWtlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImludGVuc2l2ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJqZWFuc1wiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJKb25lc1wiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJqdWJpbGV1bVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJrYWxmc3JpYmV5ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJrcmFhaWVubmVzdFwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsYXN0bWludXRlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxlYXJuaW5nXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxlYWd1ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsaW5lLXVwXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxpbm9sZXVtXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxvYWRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibG9hZmVyXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxvbmdyZWFkXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxvb2thbGlrZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsb3Vpc1wiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJseWNldW1cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWFnYXppbmVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWFpbnN0cmVhbVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtYWtlLW92ZXJcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWFrZS11cFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtYWx3YXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1hcm1vbGV1bVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtYXVzb2xldW1cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWVkZWF1dGV1clwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtaWRsaWZlY3Jpc2lzXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1pZ3JhaW5lYXVyYVwiLCBcInN5bGxhYmxlc1wiOiA1IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtaWxrc2hha2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWlsbGVmZXVpbGxlXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1peGVkXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm11ZXNsaVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtdXNldW1cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibXVzdC1oYXZlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm11c3QtcmVhZFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJub3RlYm9va1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJub25zZW5zZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJub3doZXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm51cnR1cmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwib2ZmbGluZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJvbmVsaW5lclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJvbmVzaWVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwib25saW5lXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm9waW5pb25cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGFlbGxhXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBhY2VtYWtlclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwYW5hY2hlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBhcGVnYWFpZW5uZXVzXCIsIFwic3lsbGFibGVzXCI6IDUgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBhc3NlLXBhcnRvdXRcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGVhbnV0c1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwZXJpZ2V1bVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwZXJpbmV1bVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwZXJwZXR1dW1cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGV0cm9sZXVtXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBob25lXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBpY3R1cmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGxhY2VtYXRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicG9ydGUtbWFudGVhdVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwb3J0ZWZldWlsbGVcIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicHJlc3NlLXBhcGllclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwcmltZXRpbWVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicXVlZW5cIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicXVlc3Rpb25uYWlyZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJxdWV1ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyZWFkZXJcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmVhbGl0eVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyZWFsbGlmZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyZW1ha2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmVwZWF0XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJlcGVydG9pcmVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmVzZWFyY2hcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmV2ZXJlbmNlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJpYmV5ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyaW5ndG9uZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyb2FkXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJvYW1pbmdcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2NpZW5jZWZpY3Rpb25cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2VsZm1hZGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2lkZWtpY2tcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2lnaHRzZWVpbmdcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2t5bGluZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzbWlsZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzbmVha3lcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic29mdHdhcmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3BhcmVyaWJcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3BlYWtlclwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzcHJlYWRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RhdGVtZW50XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0ZWFrXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0ZWVwbGVjaGFzZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdG9uZXdhc2hcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RvcmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RyZWFrZW5cIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RyZWFtXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0cmVldHdhcmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3VwZXJzb2FrZXJcIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3VycHJpc2UtcGFydHlcIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3dlYXRlclwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0ZWFzZXJcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGVudWVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGVtcGxhdGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGltZWxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGlzc3VlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRvYXN0XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInTDqnRlLcOgLXTDqnRlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInR5cGVjYXN0XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInVuaXF1ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ1cmV1bVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ2aWJlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInZpZXV4XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInZpbGxlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInZpbnRhZ2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwid2FuZGVseXVwXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIndpc2VndXlcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwid2FrZS11cC1jYWxsXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIndlYmNhcmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwid2luZWd1bVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiYXNlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiZVwiLCBcIm5cIiwgXCJyXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2FtZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJsXCIsIFwiclwiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0eWxlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJkb3VjaGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNwYWNlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdHJpcHRlYXNlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJqaXZlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInJcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJrZXlub3RlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInJcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtb3VudGFpbmJpa2VcIiwgXCJzeWxsYWJsZXNcIjogMywgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZhY2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwidFwiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNoYWxsZW5nZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJyXCIsIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNydWlzZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJyXCIsIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhvdXNlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInJcIiwgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZGFuY2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmcmFuY2hpc2VcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmcmVlbGFuY2VcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsZWFzZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJyXCIsIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxpbmVkYW5jZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJyXCIsIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxvdW5nZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJyXCIsIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1lcmNoYW5kaXNlXCIsIFwic3lsbGFibGVzXCI6IDMsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInJcIiwgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGVyZm9ybWFuY2VcIiwgXCJzeWxsYWJsZXNcIjogMywgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyZWxlYXNlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInJcIiwgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmVzb3VyY2VcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYWNoZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcImNcIiwgXCJsXCIsIFwiblwiLCBcInRcIiwgXCJ4XCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwib2ZmaWNlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiclwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjbG9zZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcInJcIiwgXCJ0XCIgXSB9XG5cdFx0XHRcdF0sXG5cdFx0XHRcdFwiYXRCZWdpbm5pbmdPckVuZFwiOiBbXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJieXRlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNha2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2FyZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjb2FjaFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjb2F0XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImVhcmxcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZm9hbVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnYXRlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhlYWRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaG9tZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsaXZlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNhZmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2l0ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzb2FwXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRlYWtcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGVhbVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ3YXZlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJyYWNlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNhc2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmxlZWNlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNlcnZpY2VcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidm9pY2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwia2l0ZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJyXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2thdGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJhY2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiLCBcInNcIiBdIH1cblx0XHRcdFx0XSxcblx0XHRcdFx0XCJhdEJlZ2lubmluZ1wiOiBbXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjb2tlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImRlYWxcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaW1hZ2VcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJzXCIgXSB9XG5cdFx0XHRcdF0sXG5cdFx0XHRcdFwiYXRFbmRcIjogW1xuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZm9yY2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGVhXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRpbWVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZGF0ZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcImFsc29Gb2xsb3dlZEJ5XCI6IFsgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaHlwZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcImFsc29Gb2xsb3dlZEJ5XCI6IFsgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicXVvdGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRhcGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInVwZ3JhZGVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbIFwic1wiIF0gfVxuXHRcdFx0XHRdXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG4iLCIvKipcbiAqIFRoZSBmdW5jdGlvbiBnZXR0aW5nIHRoZSBsYW5ndWFnZSBwYXJ0IG9mIHRoZSBsb2NhbGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGxvY2FsZSBUaGUgbG9jYWxlLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGxhbmd1YWdlIHBhcnQgb2YgdGhlIGxvY2FsZS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggbG9jYWxlICkge1xuXHRyZXR1cm4gbG9jYWxlLnNwbGl0KCBcIl9cIiApWyAwIF07XG59O1xuIiwidmFyIGJsb2NrRWxlbWVudHMgPSBbIFwiYWRkcmVzc1wiLCBcImFydGljbGVcIiwgXCJhc2lkZVwiLCBcImJsb2NrcXVvdGVcIiwgXCJjYW52YXNcIiwgXCJkZFwiLCBcImRpdlwiLCBcImRsXCIsIFwiZmllbGRzZXRcIiwgXCJmaWdjYXB0aW9uXCIsXG5cdFwiZmlndXJlXCIsIFwiZm9vdGVyXCIsIFwiZm9ybVwiLCBcImgxXCIsIFwiaDJcIiwgXCJoM1wiLCBcImg0XCIsIFwiaDVcIiwgXCJoNlwiLCBcImhlYWRlclwiLCBcImhncm91cFwiLCBcImhyXCIsIFwibGlcIiwgXCJtYWluXCIsIFwibmF2XCIsXG5cdFwibm9zY3JpcHRcIiwgXCJvbFwiLCBcIm91dHB1dFwiLCBcInBcIiwgXCJwcmVcIiwgXCJzZWN0aW9uXCIsIFwidGFibGVcIiwgXCJ0Zm9vdFwiLCBcInVsXCIsIFwidmlkZW9cIiBdO1xudmFyIGlubGluZUVsZW1lbnRzID0gWyBcImJcIiwgXCJiaWdcIiwgXCJpXCIsIFwic21hbGxcIiwgXCJ0dFwiLCBcImFiYnJcIiwgXCJhY3JvbnltXCIsIFwiY2l0ZVwiLCBcImNvZGVcIiwgXCJkZm5cIiwgXCJlbVwiLCBcImtiZFwiLCBcInN0cm9uZ1wiLFxuXHRcInNhbXBcIiwgXCJ0aW1lXCIsIFwidmFyXCIsIFwiYVwiLCBcImJkb1wiLCBcImJyXCIsIFwiaW1nXCIsIFwibWFwXCIsIFwib2JqZWN0XCIsIFwicVwiLCBcInNjcmlwdFwiLCBcInNwYW5cIiwgXCJzdWJcIiwgXCJzdXBcIiwgXCJidXR0b25cIixcblx0XCJpbnB1dFwiLCBcImxhYmVsXCIsIFwic2VsZWN0XCIsIFwidGV4dGFyZWFcIiBdO1xuXG52YXIgYmxvY2tFbGVtZW50c1JlZ2V4ID0gbmV3IFJlZ0V4cCggXCJeKFwiICsgYmxvY2tFbGVtZW50cy5qb2luKCBcInxcIiApICsgXCIpJFwiLCBcImlcIiApO1xudmFyIGlubGluZUVsZW1lbnRzUmVnZXggPSBuZXcgUmVnRXhwKCBcIl4oXCIgKyBpbmxpbmVFbGVtZW50cy5qb2luKCBcInxcIiApICsgXCIpJFwiLCBcImlcIiApO1xuXG52YXIgYmxvY2tFbGVtZW50U3RhcnRSZWdleCA9IG5ldyBSZWdFeHAoIFwiXjwoXCIgKyBibG9ja0VsZW1lbnRzLmpvaW4oIFwifFwiICkgKyBcIilbXj5dKj8+JFwiLCBcImlcIiApO1xudmFyIGJsb2NrRWxlbWVudEVuZFJlZ2V4ID0gbmV3IFJlZ0V4cCggXCJePC8oXCIgKyBibG9ja0VsZW1lbnRzLmpvaW4oIFwifFwiICkgKyBcIilbXj5dKj8+JFwiLCBcImlcIiApO1xuXG52YXIgaW5saW5lRWxlbWVudFN0YXJ0UmVnZXggPSBuZXcgUmVnRXhwKCBcIl48KFwiICsgaW5saW5lRWxlbWVudHMuam9pbiggXCJ8XCIgKSArIFwiKVtePl0qPiRcIiwgXCJpXCIgKTtcbnZhciBpbmxpbmVFbGVtZW50RW5kUmVnZXggPSBuZXcgUmVnRXhwKCBcIl48LyhcIiArIGlubGluZUVsZW1lbnRzLmpvaW4oIFwifFwiICkgKyBcIilbXj5dKj4kXCIsIFwiaVwiICk7XG5cbnZhciBvdGhlckVsZW1lbnRTdGFydFJlZ2V4ID0gL148KFtePlxcc1xcL10rKVtePl0qPiQvO1xudmFyIG90aGVyRWxlbWVudEVuZFJlZ2V4ID0gL148XFwvKFtePlxcc10rKVtePl0qPiQvO1xuXG52YXIgY29udGVudFJlZ2V4ID0gL15bXjxdKyQvO1xudmFyIGdyZWF0ZXJUaGFuQ29udGVudFJlZ2V4ID0gL148W14+PF0qJC87XG5cbnZhciBjb21tZW50UmVnZXggPSAvPCEtLSgufFtcXHJcXG5dKSo/LS0+L2c7XG5cbnZhciBjb3JlID0gcmVxdWlyZSggXCJ0b2tlbml6ZXIyL2NvcmVcIiApO1xudmFyIGZvckVhY2ggPSByZXF1aXJlKCBcImxvZGFzaC9mb3JFYWNoXCIgKTtcbnZhciBtZW1vaXplID0gcmVxdWlyZSggXCJsb2Rhc2gvbWVtb2l6ZVwiICk7XG5cbnZhciB0b2tlbnMgPSBbXTtcbnZhciBodG1sQmxvY2tUb2tlbml6ZXI7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHRva2VuaXplciB0byB0b2tlbml6ZSBIVE1MIGludG8gYmxvY2tzLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5mdW5jdGlvbiBjcmVhdGVUb2tlbml6ZXIoKSB7XG5cdHRva2VucyA9IFtdO1xuXG5cdGh0bWxCbG9ja1Rva2VuaXplciA9IGNvcmUoIGZ1bmN0aW9uKCB0b2tlbiApIHtcblx0XHR0b2tlbnMucHVzaCggdG9rZW4gKTtcblx0fSApO1xuXG5cdGh0bWxCbG9ja1Rva2VuaXplci5hZGRSdWxlKCBjb250ZW50UmVnZXgsIFwiY29udGVudFwiICk7XG5cdGh0bWxCbG9ja1Rva2VuaXplci5hZGRSdWxlKCBncmVhdGVyVGhhbkNvbnRlbnRSZWdleCwgXCJncmVhdGVyLXRoYW4tc2lnbi1jb250ZW50XCIgKTtcblxuXHRodG1sQmxvY2tUb2tlbml6ZXIuYWRkUnVsZSggYmxvY2tFbGVtZW50U3RhcnRSZWdleCwgXCJibG9jay1zdGFydFwiICk7XG5cdGh0bWxCbG9ja1Rva2VuaXplci5hZGRSdWxlKCBibG9ja0VsZW1lbnRFbmRSZWdleCwgXCJibG9jay1lbmRcIiApO1xuXHRodG1sQmxvY2tUb2tlbml6ZXIuYWRkUnVsZSggaW5saW5lRWxlbWVudFN0YXJ0UmVnZXgsIFwiaW5saW5lLXN0YXJ0XCIgKTtcblx0aHRtbEJsb2NrVG9rZW5pemVyLmFkZFJ1bGUoIGlubGluZUVsZW1lbnRFbmRSZWdleCwgXCJpbmxpbmUtZW5kXCIgKTtcblxuXHRodG1sQmxvY2tUb2tlbml6ZXIuYWRkUnVsZSggb3RoZXJFbGVtZW50U3RhcnRSZWdleCwgXCJvdGhlci1lbGVtZW50LXN0YXJ0XCIgKTtcblx0aHRtbEJsb2NrVG9rZW5pemVyLmFkZFJ1bGUoIG90aGVyRWxlbWVudEVuZFJlZ2V4LCBcIm90aGVyLWVsZW1lbnQtZW5kXCIgKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBlbGVtZW50IG5hbWUgaXMgYSBibG9jayBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBodG1sRWxlbWVudE5hbWUgVGhlIG5hbWUgb2YgdGhlIEhUTUwgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCBpdCBpcyBhIGJsb2NrIGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIGlzQmxvY2tFbGVtZW50KCBodG1sRWxlbWVudE5hbWUgKSB7XG5cdHJldHVybiBibG9ja0VsZW1lbnRzUmVnZXgudGVzdCggaHRtbEVsZW1lbnROYW1lICk7XG59XG5cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gZWxlbWVudCBuYW1lIGlzIGFuIGlubGluZSBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBodG1sRWxlbWVudE5hbWUgVGhlIG5hbWUgb2YgdGhlIEhUTUwgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCBpdCBpcyBhbiBpbmxpbmUgZWxlbWVudC5cbiAqL1xuZnVuY3Rpb24gaXNJbmxpbmVFbGVtZW50KCBodG1sRWxlbWVudE5hbWUgKSB7XG5cdHJldHVybiBpbmxpbmVFbGVtZW50c1JlZ2V4LnRlc3QoIGh0bWxFbGVtZW50TmFtZSApO1xufVxuXG4vKipcbiAqIFNwbGl0cyBhIHRleHQgaW50byBibG9ja3MgYmFzZWQgb24gSFRNTCBibG9jayBlbGVtZW50cy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byBzcGxpdC5cbiAqIEByZXR1cm5zIHtBcnJheX0gQSBsaXN0IG9mIGJsb2NrcyBiYXNlZCBvbiBIVE1MIGJsb2NrIGVsZW1lbnRzLlxuICovXG5mdW5jdGlvbiBnZXRCbG9ja3MoIHRleHQgKSB7XG5cdHZhciBibG9ja3MgPSBbXSwgZGVwdGggPSAwLFxuXHRcdGJsb2NrU3RhcnRUYWcgPSBcIlwiLFxuXHRcdGN1cnJlbnRCbG9jayA9IFwiXCIsXG5cdFx0YmxvY2tFbmRUYWcgPSBcIlwiO1xuXG5cdC8vIFJlbW92ZSBhbGwgY29tbWVudHMgYmVjYXVzZSBpdCBpcyB2ZXJ5IGhhcmQgdG8gdG9rZW5pemUgdGhlbS5cblx0dGV4dCA9IHRleHQucmVwbGFjZSggY29tbWVudFJlZ2V4LCBcIlwiICk7XG5cblx0Y3JlYXRlVG9rZW5pemVyKCk7XG5cdGh0bWxCbG9ja1Rva2VuaXplci5vblRleHQoIHRleHQgKTtcblxuXHRodG1sQmxvY2tUb2tlbml6ZXIuZW5kKCk7XG5cblx0Zm9yRWFjaCggdG9rZW5zLCBmdW5jdGlvbiggdG9rZW4sIGkgKSB7XG5cdFx0dmFyIG5leHRUb2tlbiA9IHRva2Vuc1sgaSArIDEgXTtcblxuXHRcdHN3aXRjaCAoIHRva2VuLnR5cGUgKSB7XG5cblx0XHRcdGNhc2UgXCJjb250ZW50XCI6XG5cdFx0XHRjYXNlIFwiZ3JlYXRlci10aGFuLXNpZ24tY29udGVudFwiOlxuXHRcdFx0Y2FzZSBcImlubGluZS1zdGFydFwiOlxuXHRcdFx0Y2FzZSBcImlubGluZS1lbmRcIjpcblx0XHRcdGNhc2UgXCJvdGhlci10YWdcIjpcblx0XHRcdGNhc2UgXCJvdGhlci1lbGVtZW50LXN0YXJ0XCI6XG5cdFx0XHRjYXNlIFwib3RoZXItZWxlbWVudC1lbmRcIjpcblx0XHRcdGNhc2UgXCJncmVhdGVyIHRoYW4gc2lnblwiOlxuXHRcdFx0XHRpZiAoICEgbmV4dFRva2VuIHx8ICggZGVwdGggPT09IDAgJiYgKCBuZXh0VG9rZW4udHlwZSA9PT0gXCJibG9jay1zdGFydFwiIHx8IG5leHRUb2tlbi50eXBlID09PSBcImJsb2NrLWVuZFwiICkgKSApIHtcblx0XHRcdFx0XHRjdXJyZW50QmxvY2sgKz0gdG9rZW4uc3JjO1xuXG5cdFx0XHRcdFx0YmxvY2tzLnB1c2goIGN1cnJlbnRCbG9jayApO1xuXHRcdFx0XHRcdGJsb2NrU3RhcnRUYWcgPSBcIlwiO1xuXHRcdFx0XHRcdGN1cnJlbnRCbG9jayA9IFwiXCI7XG5cdFx0XHRcdFx0YmxvY2tFbmRUYWcgPSBcIlwiO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGN1cnJlbnRCbG9jayArPSB0b2tlbi5zcmM7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgXCJibG9jay1zdGFydFwiOlxuXHRcdFx0XHRpZiAoIGRlcHRoICE9PSAwICkge1xuXHRcdFx0XHRcdGlmICggY3VycmVudEJsb2NrLnRyaW0oKSAhPT0gXCJcIiApIHtcblx0XHRcdFx0XHRcdGJsb2Nrcy5wdXNoKCBjdXJyZW50QmxvY2sgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y3VycmVudEJsb2NrID0gXCJcIjtcblx0XHRcdFx0XHRibG9ja0VuZFRhZyA9IFwiXCI7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRkZXB0aCsrO1xuXHRcdFx0XHRibG9ja1N0YXJ0VGFnID0gdG9rZW4uc3JjO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBcImJsb2NrLWVuZFwiOlxuXHRcdFx0XHRkZXB0aC0tO1xuXHRcdFx0XHRibG9ja0VuZFRhZyA9IHRva2VuLnNyYztcblxuXHRcdFx0XHQvKlxuXHRcdFx0XHQgKiBXZSB0cnkgdG8gbWF0Y2ggdGhlIG1vc3QgZGVlcCBibG9ja3Mgc28gZGlzY2FyZCBhbnkgb3RoZXIgYmxvY2tzIHRoYXQgaGF2ZSBiZWVuIHN0YXJ0ZWQgYnV0IG5vdFxuXHRcdFx0XHQgKiBmaW5pc2hlZC5cblx0XHRcdFx0ICovXG5cdFx0XHRcdGlmICggXCJcIiAhPT0gYmxvY2tTdGFydFRhZyAmJiBcIlwiICE9PSBibG9ja0VuZFRhZyApIHtcblx0XHRcdFx0XHRibG9ja3MucHVzaCggYmxvY2tTdGFydFRhZyArIGN1cnJlbnRCbG9jayArIGJsb2NrRW5kVGFnICk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoIFwiXCIgIT09IGN1cnJlbnRCbG9jay50cmltKCkgKSB7XG5cdFx0XHRcdFx0YmxvY2tzLnB1c2goIGN1cnJlbnRCbG9jayApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJsb2NrU3RhcnRUYWcgPSBcIlwiO1xuXHRcdFx0XHRjdXJyZW50QmxvY2sgPSBcIlwiO1xuXHRcdFx0XHRibG9ja0VuZFRhZyA9IFwiXCI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdC8vIEhhbmRsZXMgSFRNTCB3aXRoIHRvbyBtYW55IGNsb3NpbmcgdGFncy5cblx0XHRpZiAoIGRlcHRoIDwgMCApIHtcblx0XHRcdGRlcHRoID0gMDtcblx0XHR9XG5cdH0gKTtcblxuXHRyZXR1cm4gYmxvY2tzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0YmxvY2tFbGVtZW50czogYmxvY2tFbGVtZW50cyxcblx0aW5saW5lRWxlbWVudHM6IGlubGluZUVsZW1lbnRzLFxuXHRpc0Jsb2NrRWxlbWVudDogaXNCbG9ja0VsZW1lbnQsXG5cdGlzSW5saW5lRWxlbWVudDogaXNJbmxpbmVFbGVtZW50LFxuXHRnZXRCbG9ja3M6IG1lbW9pemUoIGdldEJsb2NrcyApLFxufTtcbiIsInZhciBTeWxsYWJsZUNvdW50U3RlcCA9IHJlcXVpcmUoIFwiLi9zeWxsYWJsZUNvdW50U3RlcC5qc1wiICk7XG5cbnZhciBpc1VuZGVmaW5lZCA9IHJlcXVpcmUoIFwibG9kYXNoL2lzVW5kZWZpbmVkXCIgKTtcbnZhciBmb3JFYWNoID0gcmVxdWlyZSggXCJsb2Rhc2gvZm9yRWFjaFwiICk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN5bGxhYmxlIGNvdW50IGl0ZXJhdG9yLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZyBvYmplY3QgY29udGFpbmluZyBhbiBhcnJheSB3aXRoIHN5bGxhYmxlIGV4Y2x1c2lvbnMuXG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIFN5bGxhYmxlQ291bnRJdGVyYXRvciA9IGZ1bmN0aW9uKCBjb25maWcgKSB7XG5cdHRoaXMuY291bnRTdGVwcyA9IFtdO1xuXHRpZiAoICEgaXNVbmRlZmluZWQoIGNvbmZpZyApICkge1xuXHRcdHRoaXMuY3JlYXRlU3lsbGFibGVDb3VudFN0ZXBzKCBjb25maWcuZGV2aWF0aW9ucy52b3dlbHMgKTtcblx0fVxufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgc3lsbGFibGUgY291bnQgc3RlcCBvYmplY3QgZm9yIGVhY2ggZXhjbHVzaW9uLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBzeWxsYWJsZUNvdW50cyBUaGUgb2JqZWN0IGNvbnRhaW5pbmcgYWxsIGV4Y2x1c2lvbiBzeWxsYWJsZXMgaW5jbHVkaW5nIHRoZSBtdWx0aXBsaWVycy5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5TeWxsYWJsZUNvdW50SXRlcmF0b3IucHJvdG90eXBlLmNyZWF0ZVN5bGxhYmxlQ291bnRTdGVwcyA9IGZ1bmN0aW9uKCBzeWxsYWJsZUNvdW50cyApIHtcblx0Zm9yRWFjaCggc3lsbGFibGVDb3VudHMsIGZ1bmN0aW9uKCBzeWxsYWJsZUNvdW50U3RlcCApIHtcblx0XHR0aGlzLmNvdW50U3RlcHMucHVzaCggbmV3IFN5bGxhYmxlQ291bnRTdGVwKCBzeWxsYWJsZUNvdW50U3RlcCApICk7XG5cdH0uYmluZCggdGhpcyApICk7XG59O1xuXG4vKipcbiAqIFJldHVybnMgYWxsIGF2YWlsYWJsZSBjb3VudCBzdGVwcy5cbiAqXG4gKiBAcmV0dXJucyB7QXJyYXl9IEFsbCBhdmFpbGFibGUgY291bnQgc3RlcHMuXG4gKi9cblN5bGxhYmxlQ291bnRJdGVyYXRvci5wcm90b3R5cGUuZ2V0QXZhaWxhYmxlU3lsbGFibGVDb3VudFN0ZXBzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmNvdW50U3RlcHM7XG59O1xuXG4vKipcbiAqIENvdW50cyB0aGUgc3lsbGFibGVzIGZvciBhbGwgdGhlIHN0ZXBzIGFuZCByZXR1cm5zIHRoZSB0b3RhbCBzeWxsYWJsZSBjb3VudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gd29yZCBUaGUgd29yZCB0byBjb3VudCBzeWxsYWJsZXMgaW4uXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgbnVtYmVyIG9mIHN5bGxhYmxlcyBmb3VuZCBiYXNlZCBvbiBleGNsdXNpb25zLlxuICovXG5TeWxsYWJsZUNvdW50SXRlcmF0b3IucHJvdG90eXBlLmNvdW50U3lsbGFibGVzID0gZnVuY3Rpb24oIHdvcmQgKSB7XG5cdHZhciBzeWxsYWJsZUNvdW50ID0gMDtcblx0Zm9yRWFjaCggdGhpcy5jb3VudFN0ZXBzLCBmdW5jdGlvbiggc3RlcCApIHtcblx0XHRzeWxsYWJsZUNvdW50ICs9IHN0ZXAuY291bnRTeWxsYWJsZXMoIHdvcmQgKTtcblx0fSApO1xuXHRyZXR1cm4gc3lsbGFibGVDb3VudDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3lsbGFibGVDb3VudEl0ZXJhdG9yO1xuIiwidmFyIGlzVW5kZWZpbmVkID0gcmVxdWlyZSggXCJsb2Rhc2gvaXNVbmRlZmluZWRcIiApO1xuXG52YXIgYXJyYXlUb1JlZ2V4ID0gcmVxdWlyZSggXCIuLi9zdHJpbmdQcm9jZXNzaW5nL2NyZWF0ZVJlZ2V4RnJvbUFycmF5LmpzXCIgKTtcblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGEgbGFuZ3VhZ2Ugc3lsbGFibGUgcmVnZXggdGhhdCBjb250YWlucyBhIHJlZ2V4IGZvciBtYXRjaGluZyBzeWxsYWJsZSBleGNsdXNpb24uXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHN5bGxhYmxlUmVnZXggVGhlIG9iamVjdCBjb250YWluaW5nIHRoZSBzeWxsYWJsZSBleGNsdXNpb25zLlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbnZhciBTeWxsYWJsZUNvdW50U3RlcCA9IGZ1bmN0aW9uKCBzeWxsYWJsZVJlZ2V4ICkge1xuXHR0aGlzLl9oYXNSZWdleCA9IGZhbHNlO1xuXHR0aGlzLl9yZWdleCA9IFwiXCI7XG5cdHRoaXMuX211bHRpcGxpZXIgPSBcIlwiO1xuXHR0aGlzLmNyZWF0ZVJlZ2V4KCBzeWxsYWJsZVJlZ2V4ICk7XG59O1xuXG4vKipcbiAqIFJldHVybnMgaWYgYSB2YWxpZCByZWdleCBoYXMgYmVlbiBzZXQuXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgYSByZWdleCBoYXMgYmVlbiBzZXQsIGZhbHNlIGlmIG5vdC5cbiAqL1xuU3lsbGFibGVDb3VudFN0ZXAucHJvdG90eXBlLmhhc1JlZ2V4ID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLl9oYXNSZWdleDtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIHJlZ2V4IGJhc2VkIG9uIHRoZSBnaXZlbiBzeWxsYWJsZSBleGNsdXNpb25zLCBhbmQgc2V0cyB0aGUgbXVsdGlwbGllciB0byB1c2UuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHN5bGxhYmxlUmVnZXggVGhlIG9iamVjdCBjb250YWluaW5nIHRoZSBzeWxsYWJsZSBleGNsdXNpb25zIGFuZCBtdWx0aXBsaWVyLlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cblN5bGxhYmxlQ291bnRTdGVwLnByb3RvdHlwZS5jcmVhdGVSZWdleCA9IGZ1bmN0aW9uKCBzeWxsYWJsZVJlZ2V4ICkge1xuXHRpZiAoICEgaXNVbmRlZmluZWQoIHN5bGxhYmxlUmVnZXggKSAmJiAhIGlzVW5kZWZpbmVkKCBzeWxsYWJsZVJlZ2V4LmZyYWdtZW50cyApICkge1xuXHRcdHRoaXMuX2hhc1JlZ2V4ID0gdHJ1ZTtcblx0XHR0aGlzLl9yZWdleCA9IGFycmF5VG9SZWdleCggc3lsbGFibGVSZWdleC5mcmFnbWVudHMsIHRydWUgKTtcblx0XHR0aGlzLl9tdWx0aXBsaWVyID0gc3lsbGFibGVSZWdleC5jb3VudE1vZGlmaWVyO1xuXHR9XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIHN0b3JlZCByZWd1bGFyIGV4cHJlc3Npb24uXG4gKlxuICogQHJldHVybnMge1JlZ0V4cH0gVGhlIHN0b3JlZCByZWd1bGFyIGV4cHJlc3Npb24uXG4gKi9cblN5bGxhYmxlQ291bnRTdGVwLnByb3RvdHlwZS5nZXRSZWdleCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5fcmVnZXg7XG59O1xuXG4vKipcbiAqIE1hdGNoZXMgc3lsbGFibGUgZXhjbHVzaW9ucyBpbiBhIGdpdmVuIHdvcmQgYW5kIHRoZSByZXR1cm5zIHRoZSBudW1iZXIgZm91bmQgbXVsdGlwbGllZCB3aXRoIHRoZVxuICogZ2l2ZW4gbXVsdGlwbGllci5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gd29yZCBUaGUgd29yZCB0byBtYXRjaCBmb3Igc3lsbGFibGUgZXhjbHVzaW9ucy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBhbW91bnQgb2Ygc3lsbGFibGVzIGZvdW5kLlxuICovXG5TeWxsYWJsZUNvdW50U3RlcC5wcm90b3R5cGUuY291bnRTeWxsYWJsZXMgPSBmdW5jdGlvbiggd29yZCApIHtcblx0aWYgKCB0aGlzLl9oYXNSZWdleCApIHtcblx0XHR2YXIgbWF0Y2ggPSB3b3JkLm1hdGNoKCB0aGlzLl9yZWdleCApIHx8IFtdO1xuXHRcdHJldHVybiBtYXRjaC5sZW5ndGggKiB0aGlzLl9tdWx0aXBsaWVyO1xuXHR9XG5cdHJldHVybiAwO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTeWxsYWJsZUNvdW50U3RlcDtcbiIsInZhciBmaWx0ZXJlZFBhc3NpdmVBdXhpbGlhcmllcyA9IHJlcXVpcmUoIFwiLi9wYXNzaXZldm9pY2UvYXV4aWxpYXJpZXMuanNcIiApKCkuZmlsdGVyZWRBdXhpbGlhcmllcztcbnZhciBub3RGaWx0ZXJlZFBhc3NpdmVBdXhpbGlhcmllcyA9IHJlcXVpcmUoIFwiLi9wYXNzaXZldm9pY2UvYXV4aWxpYXJpZXMuanNcIiApKCkubm90RmlsdGVyZWRBdXhpbGlhcmllcztcbnZhciB0cmFuc2l0aW9uV29yZHMgPSByZXF1aXJlKCBcIi4vdHJhbnNpdGlvbldvcmRzLmpzXCIgKSgpLnNpbmdsZVdvcmRzO1xuXG4vKipcbiAqIFJldHVybnMgYW4gYXJyYXkgd2l0aCBleGNlcHRpb25zIGZvciB0aGUga2V5d29yZCBzdWdnZXN0aW9uIHJlc2VhcmNoZXIuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFRoZSBhcnJheSBmaWxsZWQgd2l0aCBleGNlcHRpb25zLlxuICovXG5cbnZhciBhcnRpY2xlcyA9IFsgXCJ0aGVcIiwgXCJhblwiLCBcImFcIiBdO1xudmFyIG51bWVyYWxzID0gWyBcIm9uZVwiLCBcInR3b1wiLCBcInRocmVlXCIsIFwiZm91clwiLCBcImZpdmVcIiwgXCJzaXhcIiwgXCJzZXZlblwiLCBcImVpZ2h0XCIsIFwibmluZVwiLCBcInRlblwiLCBcImVsZXZlblwiLCBcInR3ZWx2ZVwiLCBcInRoaXJ0ZWVuXCIsXG5cdFwiZm91cnRlZW5cIiwgXCJmaWZ0ZWVuXCIsIFwic2l4dGVlblwiLCBcInNldmVudGVlblwiLCBcImVpZ2h0ZWVuXCIsIFwibmluZXRlZW5cIiwgXCJ0d2VudHlcIiwgXCJmaXJzdFwiLCBcInNlY29uZFwiLCBcInRoaXJkXCIsIFwiZm91cnRoXCIsXG5cdFwiZmlmdGhcIiwgXCJzaXh0aFwiLCBcInNldmVudGhcIiwgXCJlaWdodGhcIiwgXCJuaW50aFwiLCBcInRlbnRoXCIsIFwiZWxldmVudGhcIiwgXCJ0d2VsZnRoXCIsIFwidGhpcnRlZW50aFwiLCBcImZvdXJ0ZWVudGhcIiwgXCJmaWZ0ZWVudGhcIixcblx0XCJzaXh0ZWVudGhcIiwgXCJzZXZlbnRlZW50aFwiLCBcImVpZ2h0ZWVudGhcIiwgXCJuaW5ldGVlbnRoXCIsIFwidHdlbnRpZXRoXCIsIFwiaHVuZHJlZFwiLCBcImh1bmRyZWRzXCIsIFwidGhvdXNhbmRcIiwgXCJ0aG91c2FuZHNcIixcblx0XCJtaWxsaW9uXCIsIFwibWlsbGlvblwiLCBcImJpbGxpb25cIiwgXCJiaWxsaW9uc1wiIF07XG52YXIgcGVyc29uYWxQcm9ub3Vuc05vbWluYXRpdmUgPSBbIFwiaVwiLCBcInlvdVwiLCBcImhlXCIsIFwic2hlXCIsIFwiaXRcIiwgXCJ3ZVwiLCBcInRoZXlcIiBdO1xudmFyIHBlcnNvbmFsUHJvbm91bnNBY2N1c2F0aXZlID0gWyBcIm1lXCIsIFwiaGltXCIsIFwiaGVyXCIsIFwidXNcIiwgXCJ0aGVtXCIgXTtcbnZhciBkZW1vbnN0cmF0aXZlUHJvbm91bnMgPSBbIFwidGhpc1wiLCBcInRoYXRcIiwgXCJ0aGVzZVwiLCBcInRob3NlXCIgXTtcbnZhciBwb3NzZXNzaXZlUHJvbm91bnMgPSBbIFwibXlcIiwgXCJ5b3VyXCIsIFwiaGlzXCIsIFwiaGVyXCIsIFwiaXRzXCIsIFwidGhlaXJcIiwgXCJvdXJcIiwgXCJtaW5lXCIsIFwieW91cnNcIiwgXCJoZXJzXCIsIFwidGhlaXJzXCIsIFwib3Vyc1wiIF07XG52YXIgcXVhbnRpZmllcnMgPSBbIFwiYWxsXCIsIFwic29tZVwiLCBcIm1hbnlcIiwgXCJmZXdcIiwgXCJsb3RcIiwgXCJsb3RzXCIsIFwidG9uc1wiLCBcImJpdFwiLCBcIm5vXCIsIFwiZXZlcnlcIiwgXCJlbm91Z2hcIiwgXCJsaXR0bGVcIiwgXCJsZXNzXCIsIFwibXVjaFwiLCBcIm1vcmVcIiwgXCJtb3N0XCIsXG5cdFwicGxlbnR5XCIsIFwic2V2ZXJhbFwiLCBcImZld1wiLCBcImZld2VyXCIsIFwibWFueVwiLCBcImtpbmRcIiBdO1xudmFyIHJlZmxleGl2ZVByb25vdW5zID0gWyBcIm15c2VsZlwiLCBcInlvdXJzZWxmXCIsIFwiaGltc2VsZlwiLCBcImhlcnNlbGZcIiwgXCJpdHNlbGZcIiwgXCJvbmVzZWxmXCIsIFwib3Vyc2VsdmVzXCIsIFwieW91cnNlbHZlc1wiLCBcInRoZW1zZWx2ZXNcIiBdO1xudmFyIGluZGVmaW5pdGVQcm9ub3VucyA9IFsgXCJub25lXCIsIFwibm9ib2R5XCIsIFwiZXZlcnlvbmVcIiwgXCJldmVyeWJvZHlcIiwgXCJzb21lb25lXCIsIFwic29tZWJvZHlcIiwgXCJhbnlvbmVcIiwgXCJhbnlib2R5XCIsIFwibm90aGluZ1wiLFxuXHRcImV2ZXJ5dGhpbmdcIiwgXCJzb21ldGhpbmdcIiwgXCJhbnl0aGluZ1wiLCBcImVhY2hcIiwgXCJhbm90aGVyXCIsIFwib3RoZXJcIiwgXCJ3aGF0ZXZlclwiLCBcIndoaWNoZXZlclwiLCBcIndob2V2ZXJcIiwgXCJ3aG9tZXZlclwiLFxuXHRcIndob21zb2V2ZXJcIiwgXCJ3aG9zb2V2ZXJcIiwgXCJvdGhlcnNcIiwgXCJuZWl0aGVyXCIsIFwiYm90aFwiLCBcImVpdGhlclwiLCBcImFueVwiLCBcInN1Y2hcIiBdO1xudmFyIGluZGVmaW5pdGVQcm9ub3Vuc1Bvc3Nlc3NpdmUgID0gWyBcIm9uZSdzXCIsIFwibm9ib2R5J3NcIiwgXCJldmVyeW9uZSdzXCIsIFwiZXZlcnlib2R5J3NcIiwgXCJzb21lb25lJ3NcIiwgXCJzb21lYm9keSdzXCIsIFwiYW55b25lJ3NcIixcblx0XCJhbnlib2R5J3NcIiwgXCJub3RoaW5nJ3NcIiwgXCJldmVyeXRoaW5nJ3NcIiwgXCJzb21ldGhpbmcnc1wiLCBcImFueXRoaW5nJ3NcIiwgXCJ3aG9ldmVyJ3NcIiwgXCJvdGhlcnMnXCIsIFwib3RoZXInc1wiLCBcImFub3RoZXInc1wiLFxuXHRcIm5laXRoZXInc1wiLCBcImVpdGhlcidzXCIgXTtcblxuLy8gQWxsIHJlbGF0aXZlUHJvbm91bnMgYXJlIGFscmVhZHkgaW5jbHVkZWQgaW4gb3RoZXIgbGlzdHMgKGludGVycm9nYXRpdmVEZXRlcm1pbmVycywgaW50ZXJyb2dhdGl2ZVByb25vdW5zKVxudmFyIHJlbGF0aXZlUHJvbm91bnMgPSBbXTtcbnZhciBpbnRlcnJvZ2F0aXZlRGV0ZXJtaW5lcnMgPSBbIFwid2hpY2hcIiwgXCJ3aGF0XCIsIFwid2hvc2VcIiBdO1xudmFyIGludGVycm9nYXRpdmVQcm9ub3VucyA9IFsgXCJ3aG9cIiwgXCJ3aG9tXCIgXTtcbnZhciBpbnRlcnJvZ2F0aXZlUHJvQWR2ZXJicyA9IFsgXCJ3aGVyZVwiLCBcIndoaXRoZXJcIiwgXCJ3aGVuY2VcIiwgXCJob3dcIiwgXCJ3aHlcIiwgXCJ3aGV0aGVyXCIsIFwid2hlcmV2ZXJcIiwgXCJ3aG9tZXZlclwiLCBcIndoZW5ldmVyXCIsXG5cdFwiaG93ZXZlclwiLCBcIndoeWV2ZXJcIiwgXCJ3aG9ldmVyXCIsIFwid2hhdGV2ZXJcIiwgXCJ3aGVyZXNvZXZlclwiLCBcIndob21zb2V2ZXJcIiwgXCJ3aGVuc29ldmVyXCIsIFwiaG93c29ldmVyXCIsIFwid2h5c29ldmVyXCIsIFwid2hvc29ldmVyXCIsXG5cdFwid2hhdHNvZXZlclwiLCBcIndoZXJlc29cIiwgXCJ3aG9tc29cIiwgXCJ3aGVuc29cIiwgXCJob3dzb1wiLCBcIndoeXNvXCIsIFwid2hvc29cIiwgXCJ3aGF0c29cIiBdO1xudmFyIHByb25vbWluYWxBZHZlcmJzID0gWyBcInRoZXJlZm9yXCIsIFwidGhlcmVpblwiLCBcImhlcmVieVwiLCBcImhlcmV0b1wiLCBcIndoZXJlaW5cIiwgXCJ0aGVyZXdpdGhcIiwgXCJoZXJld2l0aFwiLCBcIndoZXJld2l0aFwiLCBcInRoZXJlYnlcIiBdO1xudmFyIGxvY2F0aXZlQWR2ZXJicyA9IFsgXCJ0aGVyZVwiLCBcImhlcmVcIiwgXCJ3aGl0aGVyXCIsIFwidGhpdGhlclwiLCBcImhpdGhlclwiLCBcIndoZW5jZVwiLCBcInRoZW5jZVwiLCBcImhlbmNlXCIgXTtcbnZhciBhZHZlcmJpYWxHZW5pdGl2ZXMgPSBbIFwiYWx3YXlzXCIsIFwiYWZ0ZXJ3YXJkc1wiLCBcInRvd2FyZHNcIiwgXCJvbmNlXCIsIFwidHdpY2VcIiwgXCJ0aHJpY2VcIiwgXCJhbWlkc3RcIiwgXCJhbW9uZ3N0XCIsIFwibWlkc3RcIiwgXCJ3aGlsc3RcIiBdO1xudmFyIG90aGVyQXV4aWxpYXJpZXMgPSBbIFwiY2FuXCIsIFwiY2Fubm90XCIsIFwiY2FuJ3RcIiwgXCJjb3VsZFwiLCBcImNvdWxkbid0XCIsIFwiY291bGQndmVcIiwgXCJkYXJlXCIsIFwiZGFyZXNcIiwgXCJkYXJlZFwiLCBcImRhcmluZ1wiLCBcImRvXCIsXG5cdFwiZG9uJ3RcIiwgXCJkb2VzXCIsIFwiZG9lc24ndFwiLCBcImRpZFwiLCBcImRpZG4ndFwiLCBcImRvaW5nXCIsIFwiZG9uZVwiLCBcImhhdmVcIiwgXCJoYXZlbid0XCIsIFwiaGFkXCIsIFwiaGFkbid0XCIsIFwiaGFzXCIsIFwiaGFzbid0XCIsIFwiaGF2aW5nXCIsXG5cdFwiaSd2ZVwiLCBcInlvdSd2ZVwiLCBcIndlJ3ZlXCIsIFwidGhleSd2ZVwiLCBcImknZFwiLCBcInlvdSdkXCIsIFwiaGUnZFwiLCBcInNoZSdkXCIsIFwiaXQnZFwiLCBcIndlJ2RcIiwgXCJ0aGV5J2RcIiwgXCJ3b3VsZFwiLCBcIndvdWxkbid0XCIsXG5cdFwid291bGQndmVcIiwgXCJtYXlcIiwgXCJtaWdodFwiLCBcIm11c3RcIiwgXCJuZWVkXCIsIFwibmVlZG4ndFwiLCBcIm5lZWRzXCIsIFwib3VnaHRcIiwgXCJzaGFsbFwiLCBcInNoYWxsbid0XCIsIFwic2hhbid0XCIsIFwic2hvdWxkXCIsXG5cdFwic2hvdWxkbid0XCIsIFwid2lsbFwiLCBcIndvbid0XCIsIFwiaSdsbFwiLCBcInlvdSdsbFwiLCBcImhlJ2xsXCIsIFwic2hlJ2xsXCIsIFwiaXQnbGxcIiwgXCJ3ZSdsbFwiLCBcInRoZXknbGxcIiwgXCJ0aGVyZSdzXCIsIFwidGhlcmUncmVcIixcblx0XCJ0aGVyZSdsbFwiLCBcImhlcmUnc1wiLCBcImhlcmUncmVcIiwgXCJ0aGVyZSdsbFwiIF07XG52YXIgY29wdWxhID0gWyBcImFwcGVhclwiLCBcImFwcGVhcnNcIiwgXCJhcHBlYXJpbmdcIiwgXCJhcHBlYXJlZFwiLCBcImJlY29tZVwiLCBcImJlY29tZXNcIiwgXCJiZWNvbWluZ1wiLCBcImJlY2FtZVwiLCBcImNvbWVcIiwgXCJjb21lc1wiLFxuXHRcImNvbWluZ1wiLCBcImNhbWVcIiwgXCJrZWVwXCIsIFwia2VlcHNcIiwgXCJrZXB0XCIsIFwia2VlcGluZ1wiLCBcInJlbWFpblwiLCBcInJlbWFpbnNcIiwgXCJyZW1haW5pbmdcIiwgXCJyZW1haW5lZFwiLCBcInN0YXlcIixcblx0XCJzdGF5c1wiLCBcInN0YXllZFwiLCBcInN0YXlpbmdcIiwgXCJ0dXJuXCIsIFwidHVybnNcIiwgXCJ0dXJuZWRcIiBdO1xuXG52YXIgcHJlcG9zaXRpb25zID0gWyBcImluXCIsIFwiZnJvbVwiLCBcIndpdGhcIiwgXCJ1bmRlclwiLCBcInRocm91Z2hvdXRcIiwgXCJhdG9wXCIsIFwiZm9yXCIsIFwib25cIiwgXCJ1bnRpbFwiLCBcIm9mXCIsIFwidG9cIiwgXCJhYm9hcmRcIiwgXCJhYm91dFwiLFxuXHRcImFib3ZlXCIsIFwiYWJyZWFzdFwiLCBcImFic2VudFwiLCBcImFjcm9zc1wiLCBcImFkamFjZW50XCIsIFwiYWZ0ZXJcIiwgXCJhZ2FpbnN0XCIsIFwiYWxvbmdcIiwgXCJhbG9uZ3NpZGVcIiwgXCJhbWlkXCIsIFwibWlkc3RcIiwgXCJtaWRcIixcblx0XCJhbW9uZ1wiLCBcImFwcm9wb3NcIiwgXCJhcHVkXCIsIFwiYXJvdW5kXCIsIFwiYXNcIiwgXCJhc3RyaWRlXCIsIFwiYXRcIiwgXCJvbnRvcFwiLCBcImJlZm9yZVwiLCBcImFmb3JlXCIsIFwidG9mb3JlXCIsIFwiYmVoaW5kXCIsIFwiYWhpbmRcIixcblx0XCJiZWxvd1wiLCBcImFibG93XCIsIFwiYmVuZWF0aFwiLCBcIm5lYXRoXCIsIFwiYmVzaWRlXCIsIFwiYmVzaWRlc1wiLCBcImJldHdlZW5cIiwgXCJhdHdlZW5cIiwgXCJiZXlvbmRcIiwgXCJheW9uZFwiLCBcImJ1dFwiLCBcImJ5XCIsIFwiY2hlelwiLFxuXHRcImNpcmNhXCIsIFwiY29tZVwiLCBcImRlc3BpdGVcIiwgXCJzcGl0ZVwiLCBcImRvd25cIiwgXCJkdXJpbmdcIiwgXCJleGNlcHRcIiwgXCJpbnRvXCIsIFwibGVzc1wiLCBcImxpa2VcIiwgXCJtaW51c1wiLCBcIm5lYXJcIiwgXCJuZWFyZXJcIixcblx0XCJuZWFyZXN0XCIsIFwiYW5lYXJcIiwgXCJub3R3aXRoc3RhbmRpbmdcIiwgXCJvZmZcIiwgXCJvbnRvXCIsIFwib3Bwb3NpdGVcIiwgXCJvdXRcIiwgXCJvdXRlblwiLCBcIm92ZXJcIiwgXCJwYXN0XCIsIFwicGVyXCIsIFwicHJlXCIsIFwicXVhXCIsXG5cdFwic2Fuc1wiLCBcInNhdWZcIiwgXCJzaW5jZVwiLCBcInNpdGhlbmNlXCIsIFwidGhhblwiLCBcInRocm91Z2hcIiwgXCJ0aHJ1XCIsIFwidHJ1b3V0XCIsIFwidG93YXJkXCIsIFwidW5kZXJuZWF0aFwiLCBcInVubGlrZVwiLCBcInVudGlsXCIsXG5cdFwidXBcIiwgXCJ1cG9uXCIsIFwidXBzaWRlXCIsIFwidmVyc3VzXCIsIFwidmlhXCIsIFwidmlzLcOgLXZpc1wiLCBcIndpdGhvdXRcIiwgXCJhZ29cIiwgXCJhcGFydFwiLCBcImFzaWRlXCIsIFwiYXNsYW50XCIsIFwiYXdheVwiLCBcIndpdGhhbFwiIF07XG5cbi8vIE1hbnkgcHJlcG9zaXRpb25hbCBhZHZlcmJzIGFyZSBhbHJlYWR5IGxpc3RlZCBhcyBwcmVwb3NpdGlvbi5cbnZhciBwcmVwb3NpdGlvbmFsQWR2ZXJicyA9IFsgXCJiYWNrXCIsIFwid2l0aGluXCIsIFwiZm9yd2FyZFwiLCBcImJhY2t3YXJkXCIsIFwiYWhlYWRcIiBdO1xuXG52YXIgY29vcmRpbmF0aW5nQ29uanVuY3Rpb25zID0gWyBcInNvXCIsIFwiYW5kXCIsIFwibm9yXCIsIFwiYnV0XCIsIFwib3JcIiwgXCJ5ZXRcIiwgXCJmb3JcIiBdO1xuXG4vLyAnUmF0aGVyJyBpcyBwYXJ0IG9mICdyYXRoZXIuLi50aGFuJywgJ3Nvb25lcicgaXMgcGFydCBvZiAnbm8gc29vbmVyLi4udGhhbicsICdqdXN0JyBpcyBwYXJ0IG9mICdqdXN0IGFzLi4uc28nLFxuLy8gJ09ubHknIGlzIHBhcnQgb2YgJ25vdCBvbmx5Li4uYnV0IGFsc28nLlxudmFyIGNvcnJlbGF0aXZlQ29uanVuY3Rpb25zID0gWyBcInJhdGhlclwiLCBcInNvb25lclwiLCBcImp1c3RcIiwgXCJvbmx5XCIgXTtcbnZhciBzdWJvcmRpbmF0aW5nQ29uanVuY3Rpb25zID0gWyBcImFmdGVyXCIsIFwiYWx0aG91Z2hcIiwgXCJ3aGVuXCIsIFwiYXNcIiwgXCJpZlwiLCBcInRob3VnaFwiLCBcImJlY2F1c2VcIiwgXCJiZWZvcmVcIiwgXCJldmVuXCIsIFwic2luY2VcIiwgXCJ1bmxlc3NcIixcblx0XCJ3aGVyZWFzXCIsIFwid2hpbGVcIiBdO1xuXG4vLyBUaGVzZSB2ZXJicyBhcmUgZnJlcXVlbnRseSB1c2VkIGluIGludGVydmlld3MgdG8gaW5kaWNhdGUgcXVlc3Rpb25zIGFuZCBhbnN3ZXJzLlxuLy8gJ0NsYWltJywnY2xhaW1zJywgJ3N0YXRlJyBhbmQgJ3N0YXRlZCcgYXJlIG5vdCBpbmNsdWRlZCwgYmVjYXVzZSB0aGVzZSB3b3JkcyBhcmUgYWxzbyBub3Vucy5cbnZhciBpbnRlcnZpZXdWZXJicyA9IFsgXCJzYXlcIiwgXCJzYXlzXCIsIFwic2FpZFwiLCBcInNheWluZ1wiLCBcImNsYWltZWRcIiwgXCJhc2tcIiwgXCJhc2tzXCIsIFwiYXNrZWRcIiwgXCJhc2tpbmdcIiwgXCJzdGF0ZWRcIiwgXCJzdGF0aW5nXCIsXG5cdFwiZXhwbGFpblwiLCBcImV4cGxhaW5zXCIsIFwiZXhwbGFpbmVkXCIsIFwidGhpbmtcIiwgXCJ0aGlua3NcIiBdO1xuXG4vLyBUaGVzZSB0cmFuc2l0aW9uIHdvcmRzIHdlcmUgbm90IGluY2x1ZGVkIGluIHRoZSBsaXN0IGZvciB0aGUgdHJhbnNpdGlvbiB3b3JkIGFzc2Vzc21lbnQgZm9yIHZhcmlvdXMgcmVhc29ucy5cbnZhciBhZGRpdGlvbmFsVHJhbnNpdGlvbldvcmRzID0gWyBcImFuZFwiLCBcIm9yXCIsIFwiYWJvdXRcIiwgXCJhYnNvbHV0ZWx5XCIsIFwiYWdhaW5cIiwgXCJkZWZpbml0ZWx5XCIsIFwiZXRlcm5hbGx5XCIsIFwiZXhwcmVzc2l2ZWx5XCIsXG5cdFwiZXhwcmVzc2x5XCIsIFwiZXh0cmVtZWx5XCIsIFwiaW1tZWRpYXRlbHlcIiwgXCJpbmNsdWRpbmdcIiwgXCJpbnN0YW50bHlcIiwgXCJuYW1lbHlcIiwgXCJuYXR1cmFsbHlcIiwgXCJuZXh0XCIsIFwibm90YWJseVwiLCBcIm5vd1wiLCBcIm5vd2FkYXlzXCIsXG5cdFwib3JkaW5hcmlseVwiLCBcInBvc2l0aXZlbHlcIiwgXCJ0cnVseVwiLCBcInVsdGltYXRlbHlcIiwgXCJ1bmlxdWVseVwiLCBcInVzdWFsbHlcIiwgXCJhbG1vc3RcIiwgXCJmaXJzdFwiLCBcInNlY29uZFwiLCBcInRoaXJkXCIsIFwibWF5YmVcIixcblx0XCJwcm9iYWJseVwiLCBcImdyYW50ZWRcIiwgXCJpbml0aWFsbHlcIiwgXCJvdmVyYWxsXCIsIFwidG9vXCIsIFwiYWN0dWFsbHlcIiwgXCJhbHJlYWR5XCIsIFwiZS5nXCIsIFwiaS5lXCIsIFwib2Z0ZW5cIiwgXCJyZWd1bGFybHlcIiwgXCJzaW1wbHlcIixcblx0XCJvcHRpb25hbGx5XCIsIFwicGVyaGFwc1wiLCBcInNvbWV0aW1lc1wiLCBcImxpa2VseVwiLCBcIm5ldmVyXCIsIFwiZXZlclwiLCBcImVsc2VcIiwgXCJpbmFzbXVjaFwiLCBcInByb3ZpZGVkXCIsIFwiY3VycmVudGx5XCIsIFwiaW5jaWRlbnRhbGx5XCIsXG5cdFwiZWxzZXdoZXJlXCIsIFwiZm9sbG93aW5nXCIsIFwicGFydGljdWxhclwiLCBcInJlY2VudGx5XCIsIFwicmVsYXRpdmVseVwiLCBcImYuaVwiLCBcImNsZWFybHlcIiwgXCJhcHBhcmVudGx5XCIgXTtcblxudmFyIGludGVuc2lmaWVycyA9IFsgXCJoaWdobHlcIiwgXCJ2ZXJ5XCIsIFwicmVhbGx5XCIsIFwiZXh0cmVtZWx5XCIsIFwiYWJzb2x1dGVseVwiLCBcImNvbXBsZXRlbHlcIiwgXCJ0b3RhbGx5XCIsIFwidXR0ZXJseVwiLCBcInF1aXRlXCIsXG5cdFwic29tZXdoYXRcIiwgXCJzZXJpb3VzbHlcIiwgXCJmYWlybHlcIiwgXCJmdWxseVwiLCBcImFtYXppbmdseVwiIF07XG5cbi8vIFRoZXNlIHZlcmJzIGNvbnZleSBsaXR0bGUgbWVhbmluZy4gJ1Nob3cnLCAnc2hvd3MnLCAndXNlcycsIFwibWVhbmluZ1wiIGFyZSBub3QgaW5jbHVkZWQsIGJlY2F1c2UgdGhlc2Ugd29yZHMgY291bGQgYmUgcmVsZXZhbnQgbm91bnMuXG52YXIgZGVsZXhpY2FsaXNlZFZlcmJzID0gWyBcInNlZW1cIiwgXCJzZWVtc1wiLCBcInNlZW1lZFwiLCBcInNlZW1pbmdcIiwgXCJsZXRcIiwgXCJsZXQnc1wiLCBcImxldHNcIiwgXCJsZXR0aW5nXCIsIFwibWFrZVwiLCBcIm1ha2luZ1wiLCBcIm1ha2VzXCIsXG5cdFwibWFkZVwiLCBcIndhbnRcIiwgXCJzaG93aW5nXCIsIFwic2hvd2VkXCIsIFwic2hvd25cIiwgXCJnb1wiLCBcImdvZXNcIiwgXCJnb2luZ1wiLCBcIndlbnRcIiwgXCJnb25lXCIsIFwidGFrZVwiLCBcInRha2VzXCIsIFwidG9va1wiLCBcInRha2VuXCIsIFwic2V0XCIsIFwic2V0c1wiLFxuXHRcInNldHRpbmdcIiwgXCJwdXRcIiwgXCJwdXRzXCIsIFwicHV0dGluZ1wiLCBcInVzZVwiLCBcInVzaW5nXCIsIFwidXNlZFwiLCBcInRyeVwiLCBcInRyaWVzXCIsIFwidHJpZWRcIiwgXCJ0cnlpbmdcIiwgXCJtZWFuXCIsIFwibWVhbnNcIiwgXCJtZWFudFwiLFxuXHRcImNhbGxlZFwiLCBcImJhc2VkXCIsIFwiYWRkXCIsIFwiYWRkc1wiLCBcImFkZGluZ1wiLCBcImFkZGVkXCIsIFwiY29udGFpblwiLCBcImNvbnRhaW5zXCIsIFwiY29udGFpbmluZ1wiLCBcImNvbnRhaW5lZFwiIF07XG5cbi8vIFRoZXNlIGFkamVjdGl2ZXMgYW5kIGFkdmVyYnMgYXJlIHNvIGdlbmVyYWwsIHRoZXkgc2hvdWxkIG5ldmVyIGJlIHN1Z2dlc3RlZCBhcyBhIChzaW5nbGUpIGtleXdvcmQuXG4vLyBLZXkgd29yZCBjb21iaW5hdGlvbnMgY29udGFpbmluZyB0aGVzZSBhZGplY3RpdmVzL2FkdmVyYnMgYXJlIGZpbmUuXG52YXIgZ2VuZXJhbEFkamVjdGl2ZXNBZHZlcmJzID0gWyBcIm5ld1wiLCBcIm5ld2VyXCIsIFwibmV3ZXN0XCIsIFwib2xkXCIsIFwib2xkZXJcIiwgXCJvbGRlc3RcIiwgXCJwcmV2aW91c1wiLCBcImdvb2RcIiwgXCJ3ZWxsXCIsIFwiYmV0dGVyXCIsIFwiYmVzdFwiLFxuXHRcImJpZ1wiLCBcImJpZ2dlclwiLCBcImJpZ2dlc3RcIiwgXCJlYXN5XCIsIFwiZWFzaWVyXCIsIFwiZWFzaWVzdFwiLCBcImZhc3RcIiwgXCJmYXN0ZXJcIiwgXCJmYXN0ZXN0XCIsIFwiZmFyXCIsIFwiaGFyZFwiLCBcImhhcmRlclwiLCBcImhhcmRlc3RcIixcblx0XCJsZWFzdFwiLCBcIm93blwiLCBcImxhcmdlXCIsIFwibGFyZ2VyXCIsIFwibGFyZ2VzdFwiLCBcImxvbmdcIiwgXCJsb25nZXJcIiwgXCJsb25nZXN0XCIsIFwibG93XCIsIFwibG93ZXJcIiwgXCJsb3dlc3RcIiwgXCJoaWdoXCIsIFwiaGlnaGVyXCIsXG5cdFwiaGlnaGVzdFwiLCBcInJlZ3VsYXJcIiwgXCJzaW1wbGVcIiwgXCJzaW1wbGVyXCIsIFwic2ltcGxlc3RcIiwgXCJzbWFsbFwiLCBcInNtYWxsZXJcIiwgXCJzbWFsbGVzdFwiLCBcInRpbnlcIiwgXCJ0aW5pZXJcIiwgXCJ0aW5pZXN0XCIsXG5cdFwic2hvcnRcIiwgXCJzaG9ydGVyXCIsIFwic2hvcnRlc3RcIiwgXCJtYWluXCIsIFwiYWN0dWFsXCIsIFwibmljZVwiLCBcIm5pY2VyXCIsIFwibmljZXN0XCIsIFwicmVhbFwiLCBcInNhbWVcIiwgXCJhYmxlXCIsIFwiY2VydGFpblwiLCBcInVzdWFsXCIsXG5cdFwic28tY2FsbGVkXCIsIFwibWFpbmx5XCIsIFwibW9zdGx5XCIsIFwicmVjZW50XCIsIFwiYW55bW9yZVwiLCBcImNvbXBsZXRlXCIsIFwibGF0ZWx5XCIsIFwicG9zc2libGVcIiwgXCJjb21tb25seVwiLCBcImNvbnN0YW50bHlcIixcblx0XCJjb250aW51YWxseVwiLCBcImRpcmVjdGx5XCIsIFwiZWFzaWx5XCIsIFwibmVhcmx5XCIsIFwic2xpZ2h0bHlcIiwgXCJzb21ld2hlcmVcIiwgXCJlc3RpbWF0ZWRcIiwgXCJsYXRlc3RcIiwgXCJkaWZmZXJlbnRcIiwgXCJzaW1pbGFyXCIsXG5cdFwid2lkZWx5XCIsIFwiYmFkXCIsIFwid29yc2VcIiwgXCJ3b3JzdFwiLCBcImdyZWF0XCIgXTtcblxudmFyIGludGVyamVjdGlvbnMgPSBbIFwib2hcIiwgXCJ3b3dcIiwgXCJ0dXQtdHV0XCIsIFwidHNrLXRza1wiLCBcInVnaFwiLCBcIndoZXdcIiwgXCJwaGV3XCIsIFwieWVhaFwiLCBcInllYVwiLCBcInNoaFwiLCBcIm9vcHNcIiwgXCJvdWNoXCIsIFwiYWhhXCIsXG5cdFwieWlrZXNcIiBdO1xuXG4vLyBUaGVzZSB3b3JkcyBhbmQgYWJicmV2aWF0aW9ucyBhcmUgZnJlcXVlbnRseSB1c2VkIGluIHJlY2lwZXMgaW4gbGlzdHMgb2YgaW5ncmVkaWVudHMuXG52YXIgcmVjaXBlV29yZHMgPSBbIFwidGJzXCIsIFwidGJzcFwiLCBcInNwa1wiLCBcImxiXCIsIFwicXRcIiwgXCJwa1wiLCBcImJ1XCIsIFwib3pcIiwgXCJwdFwiLCBcIm1vZFwiLCBcImRvelwiLCBcImhyXCIsIFwiZi5nXCIsIFwibWxcIiwgXCJkbFwiLCBcImNsXCIsXG5cdFwibFwiLCBcIm1nXCIsIFwiZ1wiLCBcImtnXCIsIFwicXVhcnRcIiBdO1xuXG4vLyAnUGVvcGxlJyBzaG91bGQgb25seSBiZSByZW1vdmVkIGluIGNvbWJpbmF0aW9uIHdpdGggJ3NvbWUnLCAnbWFueScgYW5kICdmZXcnIChhbmQgaXMgdGhlcmVmb3JlIG5vdCB5ZXQgaW5jbHVkZWQgaW4gdGhlIGxpc3QgYmVsb3cpLlxudmFyIHZhZ3VlTm91bnMgPSBbIFwidGhpbmdcIiwgXCJ0aGluZ3NcIiwgXCJ3YXlcIiwgXCJ3YXlzXCIsIFwibWF0dGVyXCIsIFwiY2FzZVwiLCBcImxpa2VsaWhvb2RcIiwgXCJvbmVzXCIsIFwicGllY2VcIiwgXCJwaWVjZXNcIiwgXCJzdHVmZlwiLCBcInRpbWVzXCIsXG5cdFwicGFydFwiLCBcInBhcnRzXCIsIFwicGVyY2VudFwiLCBcImluc3RhbmNlXCIsIFwiaW5zdGFuY2VzXCIsIFwiYXNwZWN0XCIsIFwiYXNwZWN0c1wiLCBcIml0ZW1cIiwgXCJpdGVtc1wiLCBcInBlb3BsZVwiLCBcImlkZWFcIiwgXCJ0aGVtZVwiLFxuXHRcInBlcnNvblwiLCBcInBlcmNlbnRcIiBdO1xuXG4vLyAnTm8nIGlzIGFscmVhZHkgaW5jbHVkZWQgaW4gdGhlIHF1YW50aWZpZXIgbGlzdC5cbnZhciBtaXNjZWxsYW5lb3VzID0gWyBcIm5vdFwiLCBcInllc1wiLCBcInJpZFwiLCBcInN1cmVcIiwgXCJ0b3BcIiwgXCJib3R0b21cIiwgXCJva1wiLCBcIm9rYXlcIiwgXCJhbWVuXCIsIFwiYWthXCIsIFwiJVwiIF07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0YXJ0aWNsZXM6IGFydGljbGVzLFxuXHRcdHBlcnNvbmFsUHJvbm91bnM6IHBlcnNvbmFsUHJvbm91bnNOb21pbmF0aXZlLmNvbmNhdCggcGVyc29uYWxQcm9ub3Vuc0FjY3VzYXRpdmUsIHBvc3Nlc3NpdmVQcm9ub3VucyApLFxuXHRcdHByZXBvc2l0aW9uczogcHJlcG9zaXRpb25zLFxuXHRcdGRlbW9uc3RyYXRpdmVQcm9ub3VuczogZGVtb25zdHJhdGl2ZVByb25vdW5zLFxuXHRcdGNvbmp1bmN0aW9uczogY29vcmRpbmF0aW5nQ29uanVuY3Rpb25zLmNvbmNhdCggc3Vib3JkaW5hdGluZ0Nvbmp1bmN0aW9ucyApLFxuXHRcdHZlcmJzOiBmaWx0ZXJlZFBhc3NpdmVBdXhpbGlhcmllcy5jb25jYXQoIG5vdEZpbHRlcmVkUGFzc2l2ZUF1eGlsaWFyaWVzLCBvdGhlckF1eGlsaWFyaWVzLCBjb3B1bGEsIGludGVydmlld1ZlcmJzLCBkZWxleGljYWxpc2VkVmVyYnMgKSxcblx0XHRxdWFudGlmaWVyczogcXVhbnRpZmllcnMsXG5cdFx0cmVsYXRpdmVQcm9ub3VuczogaW50ZXJyb2dhdGl2ZURldGVybWluZXJzLmNvbmNhdCggaW50ZXJyb2dhdGl2ZVByb25vdW5zLCBpbnRlcnJvZ2F0aXZlUHJvQWR2ZXJicyApLFxuXHRcdGZpbHRlcmVkUGFzc2l2ZUF1eGlsaWFyaWVzOiBmaWx0ZXJlZFBhc3NpdmVBdXhpbGlhcmllcyxcblx0XHRhbGw6IGFydGljbGVzLmNvbmNhdCggbnVtZXJhbHMsIGRlbW9uc3RyYXRpdmVQcm9ub3VucywgcG9zc2Vzc2l2ZVByb25vdW5zLCByZWZsZXhpdmVQcm9ub3Vucyxcblx0XHRcdHBlcnNvbmFsUHJvbm91bnNOb21pbmF0aXZlLCBwZXJzb25hbFByb25vdW5zQWNjdXNhdGl2ZSwgcmVsYXRpdmVQcm9ub3VucywgcXVhbnRpZmllcnMsIGluZGVmaW5pdGVQcm9ub3Vucyxcblx0XHRcdGluZGVmaW5pdGVQcm9ub3Vuc1Bvc3Nlc3NpdmUsIGludGVycm9nYXRpdmVEZXRlcm1pbmVycywgaW50ZXJyb2dhdGl2ZVByb25vdW5zLCBpbnRlcnJvZ2F0aXZlUHJvQWR2ZXJicyxcblx0XHRcdHByb25vbWluYWxBZHZlcmJzLCBsb2NhdGl2ZUFkdmVyYnMsIGFkdmVyYmlhbEdlbml0aXZlcywgcHJlcG9zaXRpb25hbEFkdmVyYnMsIGZpbHRlcmVkUGFzc2l2ZUF1eGlsaWFyaWVzLCBub3RGaWx0ZXJlZFBhc3NpdmVBdXhpbGlhcmllcyxcblx0XHRcdG90aGVyQXV4aWxpYXJpZXMsIGNvcHVsYSwgcHJlcG9zaXRpb25zLCBjb29yZGluYXRpbmdDb25qdW5jdGlvbnMsIGNvcnJlbGF0aXZlQ29uanVuY3Rpb25zLCBzdWJvcmRpbmF0aW5nQ29uanVuY3Rpb25zLCBpbnRlcnZpZXdWZXJicyxcblx0XHRcdHRyYW5zaXRpb25Xb3JkcywgYWRkaXRpb25hbFRyYW5zaXRpb25Xb3JkcywgaW50ZW5zaWZpZXJzLCBkZWxleGljYWxpc2VkVmVyYnMsIGludGVyamVjdGlvbnMsIGdlbmVyYWxBZGplY3RpdmVzQWR2ZXJicyxcblx0XHRcdHJlY2lwZVdvcmRzLCB2YWd1ZU5vdW5zLCBtaXNjZWxsYW5lb3VzICksXG5cdH07XG59O1xuIiwiLy8gVGhlc2UgYXV4aWxpYXJpZXMgYXJlIGZpbHRlcmVkIGZyb20gdGhlIGJlZ2lubmluZyBvZiB3b3JkIGNvbWJpbmF0aW9ucyBpbiB0aGUga2V5d29yZCBzdWdnZXN0aW9ucy5cbnZhciBmaWx0ZXJlZEF1eGlsaWFyaWVzID0gIFtcblx0XCJhbVwiLFxuXHRcImlzXCIsXG5cdFwiYXJlXCIsXG5cdFwid2FzXCIsXG5cdFwid2VyZVwiLFxuXHRcImJlZW5cIixcblx0XCJnZXRcIixcblx0XCJnZXRzXCIsXG5cdFwiZ290XCIsXG5cdFwiZ290dGVuXCIsXG5cdFwiYmVcIixcblx0XCJzaGUnc1wiLFxuXHRcImhlJ3NcIixcblx0XCJpdCdzXCIsXG5cdFwiaSdtXCIsXG5cdFwid2UncmVcIixcblx0XCJ0aGV5J3JlXCIsXG5cdFwieW91J3JlXCIsXG5cdFwiaXNuJ3RcIixcblx0XCJ3ZXJlbid0XCIsXG5cdFwid2Fzbid0XCIsXG5cdFwidGhhdCdzXCIsXG5cdFwiYXJlbid0XCIsXG5dO1xuXG4vLyBUaGVzZSBhdXhpbGlhcmllcyBhcmUgbm90IGZpbHRlcmVkIGZyb20gdGhlIGJlZ2lubmluZyBvZiB3b3JkIGNvbWJpbmF0aW9ucyBpbiB0aGUga2V5d29yZCBzdWdnZXN0aW9ucy5cbnZhciBub3RGaWx0ZXJlZEF1eGlsaWFyaWVzID0gW1xuXHRcImJlaW5nXCIsXG5cdFwiZ2V0dGluZ1wiLFxuXHRcImhhdmluZ1wiLFxuXHRcIndoYXQnc1wiLFxuXTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHRmaWx0ZXJlZEF1eGlsaWFyaWVzOiBmaWx0ZXJlZEF1eGlsaWFyaWVzLFxuXHRcdG5vdEZpbHRlcmVkQXV4aWxpYXJpZXM6IG5vdEZpbHRlcmVkQXV4aWxpYXJpZXMsXG5cdFx0YWxsOiBmaWx0ZXJlZEF1eGlsaWFyaWVzLmNvbmNhdCggbm90RmlsdGVyZWRBdXhpbGlhcmllcyApLFxuXHR9O1xufTtcbiIsIi8qKiBAbW9kdWxlIGNvbmZpZy90cmFuc2l0aW9uV29yZHMgKi9cblxudmFyIHNpbmdsZVdvcmRzID0gWyBcImFjY29yZGluZ2x5XCIsIFwiYWRkaXRpb25hbGx5XCIsIFwiYWZ0ZXJ3YXJkXCIsIFwiYWZ0ZXJ3YXJkc1wiLCBcImFsYmVpdFwiLCBcImFsc29cIiwgXCJhbHRob3VnaFwiLCBcImFsdG9nZXRoZXJcIixcblx0XCJhbm90aGVyXCIsIFwiYmFzaWNhbGx5XCIsIFwiYmVjYXVzZVwiLCBcImJlZm9yZVwiLCBcImJlc2lkZXNcIiwgXCJidXRcIiwgXCJjZXJ0YWlubHlcIiwgXCJjaGllZmx5XCIsIFwiY29tcGFyYXRpdmVseVwiLFxuXHRcImNvbmN1cnJlbnRseVwiLCBcImNvbnNlcXVlbnRseVwiLCBcImNvbnRyYXJpbHlcIiwgXCJjb252ZXJzZWx5XCIsIFwiY29ycmVzcG9uZGluZ2x5XCIsIFwiZGVzcGl0ZVwiLCBcImRvdWJ0ZWRseVwiLCBcImR1cmluZ1wiLFxuXHRcImUuZy5cIiwgXCJlYXJsaWVyXCIsIFwiZW1waGF0aWNhbGx5XCIsIFwiZXF1YWxseVwiLCBcImVzcGVjaWFsbHlcIiwgXCJldmVudHVhbGx5XCIsIFwiZXZpZGVudGx5XCIsIFwiZXhwbGljaXRseVwiLCBcImZpbmFsbHlcIixcblx0XCJmaXJzdGx5XCIsIFwiZm9sbG93aW5nXCIsIFwiZm9ybWVybHlcIiwgXCJmb3J0aHdpdGhcIiwgXCJmb3VydGhseVwiLCBcImZ1cnRoZXJcIiwgXCJmdXJ0aGVybW9yZVwiLCBcImdlbmVyYWxseVwiLCBcImhlbmNlXCIsXG5cdFwiaGVuY2Vmb3J0aFwiLCBcImhvd2V2ZXJcIiwgXCJpLmUuXCIsIFwiaWRlbnRpY2FsbHlcIiwgXCJpbmRlZWRcIiwgXCJpbnN0ZWFkXCIsIFwibGFzdFwiLCBcImxhc3RseVwiLCBcImxhdGVyXCIsIFwibGVzdFwiLCBcImxpa2V3aXNlXCIsXG5cdFwibWFya2VkbHlcIiwgXCJtZWFud2hpbGVcIiwgXCJtb3Jlb3ZlclwiLCBcIm5ldmVydGhlbGVzc1wiLCBcIm5vbmV0aGVsZXNzXCIsIFwibm9yXCIsICBcIm5vdHdpdGhzdGFuZGluZ1wiLCBcIm9idmlvdXNseVwiLFxuXHRcIm9jY2FzaW9uYWxseVwiLCBcIm90aGVyd2lzZVwiLCBcIm92ZXJhbGxcIiwgXCJwYXJ0aWN1bGFybHlcIiwgXCJwcmVzZW50bHlcIiwgXCJwcmV2aW91c2x5XCIsIFwicmF0aGVyXCIsIFwicmVnYXJkbGVzc1wiLCBcInNlY29uZGx5XCIsXG5cdFwic2hvcnRseVwiLCBcInNpZ25pZmljYW50bHlcIiwgXCJzaW1pbGFybHlcIiwgXCJzaW11bHRhbmVvdXNseVwiLCBcInNpbmNlXCIsIFwic29cIiwgXCJzb29uXCIsIFwic3BlY2lmaWNhbGx5XCIsIFwic3RpbGxcIiwgXCJzdHJhaWdodGF3YXlcIixcblx0XCJzdWJzZXF1ZW50bHlcIiwgXCJzdXJlbHlcIiwgXCJzdXJwcmlzaW5nbHlcIiwgXCJ0aGFuXCIsIFwidGhlblwiLCBcInRoZXJlYWZ0ZXJcIiwgXCJ0aGVyZWZvcmVcIiwgXCJ0aGVyZXVwb25cIiwgXCJ0aGlyZGx5XCIsIFwidGhvdWdoXCIsXG5cdFwidGh1c1wiLCBcInRpbGxcIiwgXCJ0b29cIiwgXCJ1bmRlbmlhYmx5XCIsIFwidW5kb3VidGVkbHlcIiwgXCJ1bmxlc3NcIiwgXCJ1bmxpa2VcIiwgXCJ1bnF1ZXN0aW9uYWJseVwiLCBcInVudGlsXCIsIFwid2hlblwiLCBcIndoZW5ldmVyXCIsXG5cdFwid2hlcmVhc1wiLCBcIndoaWxlXCIgXTtcbnZhciBtdWx0aXBsZVdvcmRzID0gWyBcImFib3ZlIGFsbFwiLCBcImFmdGVyIGFsbFwiLCBcImFmdGVyIHRoYXRcIiwgXCJhbGwgaW4gYWxsXCIsIFwiYWxsIG9mIGEgc3VkZGVuXCIsIFwiYWxsIHRoaW5ncyBjb25zaWRlcmVkXCIsXG5cdFwiYW5hbG9nb3VzIHRvXCIsIFwiYWx0aG91Z2ggdGhpcyBtYXkgYmUgdHJ1ZVwiLCBcImFuYWxvZ291cyB0b1wiLCBcImFub3RoZXIga2V5IHBvaW50XCIsIFwiYXMgYSBtYXR0ZXIgb2YgZmFjdFwiLCBcImFzIGEgcmVzdWx0XCIsXG5cdFwiYXMgYW4gaWxsdXN0cmF0aW9uXCIsIFx0XCJhcyBjYW4gYmUgc2VlblwiLCBcImFzIGhhcyBiZWVuIG5vdGVkXCIsIFwiYXMgSSBoYXZlIG5vdGVkXCIsIFwiYXMgSSBoYXZlIHNhaWRcIiwgXCJhcyBJIGhhdmUgc2hvd25cIixcblx0XCJhcyBsb25nIGFzXCIsIFwiYXMgbXVjaCBhc1wiLCBcImFzIHNob3duIGFib3ZlXCIsIFwiYXMgc29vbiBhc1wiLCBcImFzIHdlbGwgYXNcIiwgXCJhdCBhbnkgcmF0ZVwiLCBcImF0IGZpcnN0XCIsIFwiYXQgbGFzdFwiLFxuXHRcImF0IGxlYXN0XCIsIFwiYXQgbGVuZ3RoXCIsIFwiYXQgdGhlIHByZXNlbnQgdGltZVwiLCBcImF0IHRoZSBzYW1lIHRpbWVcIiwgXCJhdCB0aGlzIGluc3RhbnRcIiwgXCJhdCB0aGlzIHBvaW50XCIsIFwiYXQgdGhpcyB0aW1lXCIsXG5cdFwiYmFsYW5jZWQgYWdhaW5zdFwiLCBcImJlaW5nIHRoYXRcIiwgXCJieSBhbGwgbWVhbnNcIiwgXCJieSBhbmQgbGFyZ2VcIiwgXCJieSBjb21wYXJpc29uXCIsIFwiYnkgdGhlIHNhbWUgdG9rZW5cIiwgXCJieSB0aGUgdGltZVwiLFxuXHRcImNvbXBhcmVkIHRvXCIsIFwiYmUgdGhhdCBhcyBpdCBtYXlcIiwgXCJjb3VwbGVkIHdpdGhcIiwgXCJkaWZmZXJlbnQgZnJvbVwiLCBcImR1ZSB0b1wiLCBcImVxdWFsbHkgaW1wb3J0YW50XCIsIFwiZXZlbiBpZlwiLFxuXHRcImV2ZW4gbW9yZVwiLCBcImV2ZW4gc29cIiwgXCJldmVuIHRob3VnaFwiLCBcImZpcnN0IHRoaW5nIHRvIHJlbWVtYmVyXCIsIFwiZm9yIGV4YW1wbGVcIiwgXCJmb3IgZmVhciB0aGF0XCIsIFwiZm9yIGluc3RhbmNlXCIsXG5cdFwiZm9yIG9uZSB0aGluZ1wiLCBcImZvciB0aGF0IHJlYXNvblwiLCBcImZvciB0aGUgbW9zdCBwYXJ0XCIsIFwiZm9yIHRoZSBwdXJwb3NlIG9mXCIsIFwiZm9yIHRoZSBzYW1lIHJlYXNvblwiLCBcImZvciB0aGlzIHB1cnBvc2VcIixcblx0XCJmb3IgdGhpcyByZWFzb25cIiwgXCJmcm9tIHRpbWUgdG8gdGltZVwiLCBcImdpdmVuIHRoYXRcIiwgXCJnaXZlbiB0aGVzZSBwb2ludHNcIiwgXCJpbXBvcnRhbnQgdG8gcmVhbGl6ZVwiLCBcImluIGEgd29yZFwiLCBcImluIGFkZGl0aW9uXCIsXG5cdFwiaW4gYW5vdGhlciBjYXNlXCIsIFwiaW4gYW55IGNhc2VcIiwgXCJpbiBhbnkgZXZlbnRcIiwgXCJpbiBicmllZlwiLCBcImluIGNhc2VcIiwgXCJpbiBjb25jbHVzaW9uXCIsIFwiaW4gY29udHJhc3RcIixcblx0XCJpbiBkZXRhaWxcIiwgXCJpbiBkdWUgdGltZVwiLCBcImluIGVmZmVjdFwiLCBcImluIGVpdGhlciBjYXNlXCIsIFwiaW4gZXNzZW5jZVwiLCBcImluIGZhY3RcIiwgXCJpbiBnZW5lcmFsXCIsIFwiaW4gbGlnaHQgb2ZcIixcblx0XCJpbiBsaWtlIGZhc2hpb25cIiwgXCJpbiBsaWtlIG1hbm5lclwiLCBcImluIG9yZGVyIHRoYXRcIiwgXCJpbiBvcmRlciB0b1wiLCBcImluIG90aGVyIHdvcmRzXCIsIFwiaW4gcGFydGljdWxhclwiLCBcImluIHJlYWxpdHlcIixcblx0XCJpbiBzaG9ydFwiLCBcImluIHNpbWlsYXIgZmFzaGlvblwiLCBcImluIHNwaXRlIG9mXCIsIFwiaW4gc3VtXCIsIFwiaW4gc3VtbWFyeVwiLCBcImluIHRoYXQgY2FzZVwiLCBcImluIHRoZSBldmVudCB0aGF0XCIsXG5cdFwiaW4gdGhlIGZpbmFsIGFuYWx5c2lzXCIsIFwiaW4gdGhlIGZpcnN0IHBsYWNlXCIsIFwiaW4gdGhlIGZvdXJ0aCBwbGFjZVwiLCBcImluIHRoZSBob3BlIHRoYXRcIiwgXCJpbiB0aGUgbGlnaHQgb2ZcIixcblx0XCJpbiB0aGUgbG9uZyBydW5cIiwgXCJpbiB0aGUgbWVhbnRpbWVcIiwgXCJpbiB0aGUgc2FtZSBmYXNoaW9uXCIsIFwiaW4gdGhlIHNhbWUgd2F5XCIsIFwiaW4gdGhlIHNlY29uZCBwbGFjZVwiLFxuXHRcImluIHRoZSB0aGlyZCBwbGFjZVwiLCBcImluIHRoaXMgY2FzZVwiLCBcImluIHRoaXMgc2l0dWF0aW9uXCIsIFwiaW4gdGltZVwiLCBcImluIHRydXRoXCIsIFwiaW4gdmlldyBvZlwiLCBcImluYXNtdWNoIGFzXCIsXG5cdFwibW9zdCBjb21wZWxsaW5nIGV2aWRlbmNlXCIsIFwibW9zdCBpbXBvcnRhbnRcIiwgXCJtdXN0IGJlIHJlbWVtYmVyZWRcIiwgXCJub3QgdG8gbWVudGlvblwiLCBcIm5vdyB0aGF0XCIsIFwib2YgY291cnNlXCIsXG5cdFwib24gYWNjb3VudCBvZlwiLCBcIm9uIGJhbGFuY2VcIiwgXCJvbiBjb25kaXRpb24gdGhhdFwiLCBcIm9uIG9uZSBoYW5kXCIsIFwib24gdGhlIGNvbmRpdGlvbiB0aGF0XCIsIFwib24gdGhlIGNvbnRyYXJ5XCIsXG5cdFwib24gdGhlIG5lZ2F0aXZlIHNpZGVcIiwgXCJvbiB0aGUgb3RoZXIgaGFuZFwiLCBcIm9uIHRoZSBwb3NpdGl2ZSBzaWRlXCIsIFwib24gdGhlIHdob2xlXCIsIFwib24gdGhpcyBvY2Nhc2lvblwiLCBcIm9uY2VcIixcblx0XCJvbmNlIGluIGEgd2hpbGVcIiwgXHRcIm9ubHkgaWZcIiwgXCJvd2luZyB0b1wiLCBcInBvaW50IG9mdGVuIG92ZXJsb29rZWRcIiwgXCJwcmlvciB0b1wiLCBcInByb3ZpZGVkIHRoYXRcIiwgXCJzZWVpbmcgdGhhdFwiLFxuXHRcInNvIGFzIHRvXCIsIFwic28gZmFyXCIsIFwic28gbG9uZyBhc1wiLCBcInNvIHRoYXRcIiwgXCJzb29uZXIgb3IgbGF0ZXJcIiwgXCJzdWNoIGFzXCIsIFwic3VtbWluZyB1cFwiLCBcInRha2UgdGhlIGNhc2Ugb2ZcIixcblx0XCJ0aGF0IGlzXCIsIFwidGhhdCBpcyB0byBzYXlcIiwgXCJ0aGVuIGFnYWluXCIsIFwidGhpcyB0aW1lXCIsIFwidG8gYmUgc3VyZVwiLCBcInRvIGJlZ2luIHdpdGhcIiwgXCJ0byBjbGFyaWZ5XCIsIFwidG8gY29uY2x1ZGVcIixcblx0XCJ0byBkZW1vbnN0cmF0ZVwiLCBcInRvIGVtcGhhc2l6ZVwiLCBcInRvIGVudW1lcmF0ZVwiLCBcInRvIGV4cGxhaW5cIiwgXCJ0byBpbGx1c3RyYXRlXCIsIFwidG8gbGlzdFwiLCBcInRvIHBvaW50IG91dFwiLFxuXHRcInRvIHB1dCBpdCBhbm90aGVyIHdheVwiLCBcInRvIHB1dCBpdCBkaWZmZXJlbnRseVwiLCBcInRvIHJlcGVhdFwiLCBcInRvIHJlcGhyYXNlIGl0XCIsIFwidG8gc2F5IG5vdGhpbmcgb2ZcIiwgXCJ0byBzdW0gdXBcIixcblx0XCJ0byBzdW1tYXJpemVcIiwgXCJ0byB0aGF0IGVuZFwiLCBcInRvIHRoZSBlbmQgdGhhdFwiLCBcInRvIHRoaXMgZW5kXCIsIFwidG9nZXRoZXIgd2l0aFwiLCBcInVuZGVyIHRob3NlIGNpcmN1bXN0YW5jZXNcIiwgXCJ1bnRpbCBub3dcIixcblx0XCJ1cCBhZ2FpbnN0XCIsIFwidXAgdG8gdGhlIHByZXNlbnQgdGltZVwiLCBcInZpcyBhIHZpc1wiLCBcIndoYXQncyBtb3JlXCIsIFwid2hpbGUgaXQgbWF5IGJlIHRydWVcIiwgXCJ3aGlsZSB0aGlzIG1heSBiZSB0cnVlXCIsXG5cdFwid2l0aCBhdHRlbnRpb24gdG9cIiwgXCJ3aXRoIHRoZSByZXN1bHQgdGhhdFwiLCBcIndpdGggdGhpcyBpbiBtaW5kXCIsIFwid2l0aCB0aGlzIGludGVudGlvblwiLCBcIndpdGggdGhpcyBwdXJwb3NlIGluIG1pbmRcIixcblx0XCJ3aXRob3V0IGEgZG91YnRcIiwgXCJ3aXRob3V0IGRlbGF5XCIsIFwid2l0aG91dCBkb3VidFwiLCBcIndpdGhvdXQgcmVzZXJ2YXRpb25cIiBdO1xuXG4vKipcbiAqIFJldHVybnMgYW4gYXJyYXkgd2l0aCB0cmFuc2l0aW9uIHdvcmRzIHRvIGJlIHVzZWQgYnkgdGhlIGFzc2Vzc21lbnRzLlxuICogQHJldHVybnMge0FycmF5fSBUaGUgYXJyYXkgZmlsbGVkIHdpdGggdHJhbnNpdGlvbiB3b3Jkcy5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHRzaW5nbGVXb3Jkczogc2luZ2xlV29yZHMsXG5cdFx0bXVsdGlwbGVXb3JkczogbXVsdGlwbGVXb3Jkcyxcblx0XHRhbGxXb3Jkczogc2luZ2xlV29yZHMuY29uY2F0KCBtdWx0aXBsZVdvcmRzICksXG5cdH07XG59O1xuIiwiLyoqIEBtb2R1bGUgc3RyaW5nUHJvY2Vzc2luZy9hZGRXb3JkYm91bmRhcnkgKi9cblxuLyoqXG4gKiBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgY2FuIGJlIHVzZWQgaW4gYSByZWdleCB0byBtYXRjaCBhIG1hdGNoU3RyaW5nIHdpdGggd29yZCBib3VuZGFyaWVzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtYXRjaFN0cmluZyBUaGUgc3RyaW5nIHRvIGdlbmVyYXRlIGEgcmVnZXggc3RyaW5nIGZvci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbZXh0cmFXb3JkQm91bmRhcnldIEV4dHJhIGNoYXJhY3RlcnMgdG8gbWF0Y2ggYSB3b3JkIGJvdW5kYXJ5IG9uLlxuICogQHJldHVybnMge3N0cmluZ30gQSByZWdleCBzdHJpbmcgdGhhdCBtYXRjaGVzIHRoZSBtYXRjaFN0cmluZyB3aXRoIHdvcmQgYm91bmRhcmllcy5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggbWF0Y2hTdHJpbmcsIGV4dHJhV29yZEJvdW5kYXJ5ICkge1xuXHR2YXIgd29yZEJvdW5kYXJ5LCB3b3JkQm91bmRhcnlTdGFydCwgd29yZEJvdW5kYXJ5RW5kO1xuXHR2YXIgX2V4dHJhV29yZEJvdW5kYXJ5ID0gZXh0cmFXb3JkQm91bmRhcnkgfHwgXCJcIjtcblxuXHR3b3JkQm91bmRhcnkgPSBcIlsgXFxcXG5cXFxcclxcXFx0XFwuLCdcXChcXClcXFwiXFwrXFwtOyE/OlxcL8K7wqvigLnigLpcIiArIF9leHRyYVdvcmRCb3VuZGFyeSArIFwiPD5dXCI7XG5cdHdvcmRCb3VuZGFyeVN0YXJ0ID0gXCIoXnxcIiArIHdvcmRCb3VuZGFyeSArIFwiKVwiO1xuXHR3b3JkQm91bmRhcnlFbmQgPSBcIigkfFwiICsgd29yZEJvdW5kYXJ5ICsgXCIpXCI7XG5cblx0cmV0dXJuIHdvcmRCb3VuZGFyeVN0YXJ0ICsgbWF0Y2hTdHJpbmcgKyB3b3JkQm91bmRhcnlFbmQ7XG59O1xuIiwiLyoqIEBtb2R1bGUgc3RyaW5nUHJvY2Vzc2luZy9jcmVhdGVSZWdleEZyb21BcnJheSAqL1xuXG52YXIgYWRkV29yZEJvdW5kYXJ5ID0gcmVxdWlyZSggXCIuLi9zdHJpbmdQcm9jZXNzaW5nL2FkZFdvcmRib3VuZGFyeS5qc1wiICk7XG52YXIgbWFwID0gcmVxdWlyZSggXCJsb2Rhc2gvbWFwXCIgKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgcmVnZXggb2YgY29tYmluZWQgc3RyaW5ncyBmcm9tIHRoZSBpbnB1dCBhcnJheS5cbiAqXG4gKiBAcGFyYW0ge2FycmF5fSBhcnJheSBUaGUgYXJyYXkgd2l0aCBzdHJpbmdzXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtkaXNhYmxlV29yZEJvdW5kYXJ5XSBCb29sZWFuIGluZGljYXRpbmcgd2hldGhlciBvciBub3QgdG8gZGlzYWJsZSB3b3JkIGJvdW5kYXJpZXNcbiAqIEByZXR1cm5zIHtSZWdFeHB9IHJlZ2V4IFRoZSByZWdleCBjcmVhdGVkIGZyb20gdGhlIGFycmF5LlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBhcnJheSwgZGlzYWJsZVdvcmRCb3VuZGFyeSApIHtcblx0dmFyIHJlZ2V4U3RyaW5nO1xuXHR2YXIgX2Rpc2FibGVXb3JkQm91bmRhcnkgPSBkaXNhYmxlV29yZEJvdW5kYXJ5IHx8IGZhbHNlO1xuXG5cdHZhciBib3VuZGVkQXJyYXkgPSBtYXAoIGFycmF5LCBmdW5jdGlvbiggc3RyaW5nICkge1xuXHRcdGlmICggX2Rpc2FibGVXb3JkQm91bmRhcnkgKSB7XG5cdFx0XHRyZXR1cm4gc3RyaW5nO1xuXHRcdH1cblx0XHRyZXR1cm4gYWRkV29yZEJvdW5kYXJ5KCBzdHJpbmcgKTtcblx0fSApO1xuXG5cdHJlZ2V4U3RyaW5nID0gXCIoXCIgKyBib3VuZGVkQXJyYXkuam9pbiggXCIpfChcIiApICsgXCIpXCI7XG5cblx0cmV0dXJuIG5ldyBSZWdFeHAoIHJlZ2V4U3RyaW5nLCBcImlnXCIgKTtcbn07XG4iLCJ2YXIgbWFwID0gcmVxdWlyZSggXCJsb2Rhc2gvbWFwXCIgKTtcbnZhciBpc1VuZGVmaW5lZCA9IHJlcXVpcmUoIFwibG9kYXNoL2lzVW5kZWZpbmVkXCIgKTtcbnZhciBmb3JFYWNoID0gcmVxdWlyZSggXCJsb2Rhc2gvZm9yRWFjaFwiICk7XG52YXIgaXNOYU4gPSByZXF1aXJlKCBcImxvZGFzaC9pc05hTlwiICk7XG52YXIgZmlsdGVyID0gcmVxdWlyZSggXCJsb2Rhc2gvZmlsdGVyXCIgKTtcbnZhciBmbGF0TWFwID0gcmVxdWlyZSggXCJsb2Rhc2gvZmxhdE1hcFwiICk7XG52YXIgaXNFbXB0eSA9IHJlcXVpcmUoIFwibG9kYXNoL2lzRW1wdHlcIiApO1xudmFyIG5lZ2F0ZSA9IHJlcXVpcmUoIFwibG9kYXNoL25lZ2F0ZVwiICk7XG52YXIgbWVtb2l6ZSA9IHJlcXVpcmUoIFwibG9kYXNoL21lbW9pemVcIiApO1xuXG52YXIgY29yZSA9IHJlcXVpcmUoIFwidG9rZW5pemVyMi9jb3JlXCIgKTtcblxudmFyIGdldEJsb2NrcyA9IHJlcXVpcmUoIFwiLi4vaGVscGVycy9odG1sLmpzXCIgKS5nZXRCbG9ja3M7XG52YXIgbm9ybWFsaXplUXVvdGVzID0gcmVxdWlyZSggXCIuLi9zdHJpbmdQcm9jZXNzaW5nL3F1b3Rlcy5qc1wiICkubm9ybWFsaXplO1xuXG52YXIgdW5pZnlXaGl0ZXNwYWNlID0gcmVxdWlyZSggXCIuLi9zdHJpbmdQcm9jZXNzaW5nL3VuaWZ5V2hpdGVzcGFjZS5qc1wiICkudW5pZnlOb25CcmVha2luZ1NwYWNlO1xuXG4vLyBBbGwgY2hhcmFjdGVycyB0aGF0IGluZGljYXRlIGEgc2VudGVuY2UgZGVsaW1pdGVyLlxudmFyIGZ1bGxTdG9wID0gXCIuXCI7XG4vLyBUaGUgXFx1MjAyNiBjaGFyYWN0ZXIgaXMgYW4gZWxsaXBzaXNcbnZhciBzZW50ZW5jZURlbGltaXRlcnMgPSBcIj8hO1xcdTIwMjZcIjtcbnZhciBuZXdMaW5lcyA9IFwiXFxuXFxyfFxcbnxcXHJcIjtcblxudmFyIGZ1bGxTdG9wUmVnZXggPSBuZXcgUmVnRXhwKCBcIl5bXCIgKyBmdWxsU3RvcCArIFwiXSRcIiApO1xudmFyIHNlbnRlbmNlRGVsaW1pdGVyUmVnZXggPSBuZXcgUmVnRXhwKCBcIl5bXCIgKyBzZW50ZW5jZURlbGltaXRlcnMgKyBcIl0kXCIgKTtcbnZhciBzZW50ZW5jZVJlZ2V4ID0gbmV3IFJlZ0V4cCggXCJeW15cIiArIGZ1bGxTdG9wICsgc2VudGVuY2VEZWxpbWl0ZXJzICsgXCI8XFxcXChcXFxcKVxcXFxbXFxcXF1dKyRcIiApO1xudmFyIGh0bWxTdGFydFJlZ2V4ID0gL148KFtePlxcc1xcL10rKVtePl0qPiQvbWk7XG52YXIgaHRtbEVuZFJlZ2V4ID0gL148XFwvKFtePlxcc10rKVtePl0qPiQvbWk7XG52YXIgbmV3TGluZVJlZ2V4ID0gbmV3IFJlZ0V4cCggbmV3TGluZXMgKTtcblxudmFyIGJsb2NrU3RhcnRSZWdleCA9IC9eXFxzKltcXFtcXChcXHtdXFxzKiQvO1xudmFyIGJsb2NrRW5kUmVnZXggPSAvXlxccypbXFxdXFwpfV1cXHMqJC87XG5cbnZhciB0b2tlbnMgPSBbXTtcbnZhciBzZW50ZW5jZVRva2VuaXplcjtcblxuLyoqXG4gKiBDcmVhdGVzIGEgdG9rZW5pemVyIHRvIGNyZWF0ZSB0b2tlbnMgZnJvbSBhIHNlbnRlbmNlLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5mdW5jdGlvbiBjcmVhdGVUb2tlbml6ZXIoKSB7XG5cdHRva2VucyA9IFtdO1xuXG5cdHNlbnRlbmNlVG9rZW5pemVyID0gY29yZSggZnVuY3Rpb24oIHRva2VuICkge1xuXHRcdHRva2Vucy5wdXNoKCB0b2tlbiApO1xuXHR9ICk7XG5cblx0c2VudGVuY2VUb2tlbml6ZXIuYWRkUnVsZSggaHRtbFN0YXJ0UmVnZXgsIFwiaHRtbC1zdGFydFwiICk7XG5cdHNlbnRlbmNlVG9rZW5pemVyLmFkZFJ1bGUoIGh0bWxFbmRSZWdleCwgXCJodG1sLWVuZFwiICk7XG5cdHNlbnRlbmNlVG9rZW5pemVyLmFkZFJ1bGUoIGJsb2NrU3RhcnRSZWdleCwgXCJibG9jay1zdGFydFwiICk7XG5cdHNlbnRlbmNlVG9rZW5pemVyLmFkZFJ1bGUoIGJsb2NrRW5kUmVnZXgsIFwiYmxvY2stZW5kXCIgKTtcblx0c2VudGVuY2VUb2tlbml6ZXIuYWRkUnVsZSggZnVsbFN0b3BSZWdleCwgXCJmdWxsLXN0b3BcIiApO1xuXHRzZW50ZW5jZVRva2VuaXplci5hZGRSdWxlKCBzZW50ZW5jZURlbGltaXRlclJlZ2V4LCBcInNlbnRlbmNlLWRlbGltaXRlclwiICk7XG5cdHNlbnRlbmNlVG9rZW5pemVyLmFkZFJ1bGUoIHNlbnRlbmNlUmVnZXgsIFwic2VudGVuY2VcIiApO1xufVxuXG4vKipcbiAqIFJldHVybnMgd2hldGhlciBvciBub3QgYSBjZXJ0YWluIGNoYXJhY3RlciBpcyBhIGNhcGl0YWwgbGV0dGVyLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjaGFyYWN0ZXIgVGhlIGNoYXJhY3RlciB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgY2hhcmFjdGVyIGlzIGEgY2FwaXRhbCBsZXR0ZXIuXG4gKi9cbmZ1bmN0aW9uIGlzQ2FwaXRhbExldHRlciggY2hhcmFjdGVyICkge1xuXHRyZXR1cm4gY2hhcmFjdGVyICE9PSBjaGFyYWN0ZXIudG9Mb2NhbGVMb3dlckNhc2UoKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IGEgY2VydGFpbiBjaGFyYWN0ZXIgaXMgYSBudW1iZXIuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGNoYXJhY3RlciBUaGUgY2hhcmFjdGVyIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoZSBjaGFyYWN0ZXIgaXMgYSBjYXBpdGFsIGxldHRlci5cbiAqL1xuZnVuY3Rpb24gaXNOdW1iZXIoIGNoYXJhY3RlciApIHtcblx0cmV0dXJuICEgaXNOYU4oIHBhcnNlSW50KCBjaGFyYWN0ZXIsIDEwICkgKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IGEgZ2l2ZW4gSFRNTCB0YWcgaXMgYSBicmVhayB0YWcuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGh0bWxUYWcgVGhlIEhUTUwgdGFnIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBIVE1MIHRhZyBpcyBhIGJyZWFrIHRhZy5cbiAqL1xuZnVuY3Rpb24gaXNCcmVha1RhZyggaHRtbFRhZyApIHtcblx0cmV0dXJuIC88YnIvLnRlc3QoIGh0bWxUYWcgKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IGEgZ2l2ZW4gY2hhcmFjdGVyIGlzIHF1b3RhdGlvbiBtYXJrLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjaGFyYWN0ZXIgVGhlIGNoYXJhY3RlciB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gY2hhcmFjdGVyIGlzIGEgcXVvdGF0aW9uIG1hcmsuXG4gKi9cbmZ1bmN0aW9uIGlzUXVvdGF0aW9uKCBjaGFyYWN0ZXIgKSB7XG5cdGNoYXJhY3RlciA9IG5vcm1hbGl6ZVF1b3RlcyggY2hhcmFjdGVyICk7XG5cblx0cmV0dXJuIFwiJ1wiID09PSBjaGFyYWN0ZXIgfHxcblx0XHRcIlxcXCJcIiA9PT0gY2hhcmFjdGVyO1xufVxuXG4vKipcbiAqIFJldHVybnMgd2hldGhlciBvciBub3QgYSBnaXZlbiBjaGFyYWN0ZXIgaXMgYSBwdW5jdHVhdGlvbiBtYXJrIHRoYXQgY2FuIGJlIGF0IHRoZSBiZWdpbm5pbmdcbiAqIG9mIGEgc2VudGVuY2UsIGxpa2Ugwr8gYW5kIMKhIHVzZWQgaW4gU3BhbmlzaC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY2hhcmFjdGVyIFRoZSBjaGFyYWN0ZXIgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhlIGdpdmVuIGNoYXJhY3RlciBpcyBhIHB1bmN0dWF0aW9uIG1hcmsuXG4gKi9cbmZ1bmN0aW9uIGlzUHVuY3R1YXRpb24oIGNoYXJhY3RlciApIHtcblx0cmV0dXJuIFwiwr9cIiA9PT0gY2hhcmFjdGVyIHx8XG5cdFx0XCLCoVwiID09PSBjaGFyYWN0ZXI7XG59XG5cbi8qKlxuICogVG9rZW5pemVzIGEgc2VudGVuY2UsIGFzc3VtZXMgdGhhdCB0aGUgdGV4dCBoYXMgYWxyZWFkeSBiZWVuIHNwbGl0IGludG8gYmxvY2tzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHRvIHRva2VuaXplLlxuICogQHJldHVybnMge0FycmF5fSBBbiBhcnJheSBvZiB0b2tlbnMuXG4gKi9cbmZ1bmN0aW9uIHRva2VuaXplU2VudGVuY2VzKCB0ZXh0ICkge1xuXHRjcmVhdGVUb2tlbml6ZXIoKTtcblx0c2VudGVuY2VUb2tlbml6ZXIub25UZXh0KCB0ZXh0ICk7XG5cblx0c2VudGVuY2VUb2tlbml6ZXIuZW5kKCk7XG5cblx0cmV0dXJuIHRva2Vucztcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGR1cGxpY2F0ZSB3aGl0ZXNwYWNlIGZyb20gYSBnaXZlbiB0ZXh0LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHdpdGggZHVwbGljYXRlIHdoaXRlc3BhY2UuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgdGV4dCB3aXRob3V0IGR1cGxpY2F0ZSB3aGl0ZXNwYWNlLlxuICovXG5mdW5jdGlvbiByZW1vdmVEdXBsaWNhdGVXaGl0ZXNwYWNlKCB0ZXh0ICkge1xuXHRyZXR1cm4gdGV4dC5yZXBsYWNlKCAvXFxzKy8sIFwiIFwiICk7XG59XG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSBuZXh0IHR3byBjaGFyYWN0ZXJzIGZyb20gYW4gYXJyYXkgd2l0aCB0aGUgdHdvIG5leHQgdG9rZW5zLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IG5leHRUb2tlbnMgVGhlIHR3byBuZXh0IHRva2Vucy4gTWlnaHQgYmUgdW5kZWZpbmVkLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIG5leHQgdHdvIGNoYXJhY3RlcnMuXG4gKi9cbmZ1bmN0aW9uIGdldE5leHRUd29DaGFyYWN0ZXJzKCBuZXh0VG9rZW5zICkge1xuXHR2YXIgbmV4dCA9IFwiXCI7XG5cblx0aWYgKCAhIGlzVW5kZWZpbmVkKCBuZXh0VG9rZW5zWyAwIF0gKSApIHtcblx0XHRuZXh0ICs9IG5leHRUb2tlbnNbIDAgXS5zcmM7XG5cdH1cblxuXHRpZiAoICEgaXNVbmRlZmluZWQoIG5leHRUb2tlbnNbIDEgXSApICkge1xuXHRcdG5leHQgKz0gbmV4dFRva2Vuc1sgMSBdLnNyYztcblx0fVxuXG5cdG5leHQgPSByZW1vdmVEdXBsaWNhdGVXaGl0ZXNwYWNlKCBuZXh0ICk7XG5cblx0cmV0dXJuIG5leHQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBzZW50ZW5jZUJlZ2lubmluZyBiZWdpbm5pbmcgaXMgYSB2YWxpZCBiZWdpbm5pbmcuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHNlbnRlbmNlQmVnaW5uaW5nIFRoZSBiZWdpbm5pbmcgb2YgdGhlIHNlbnRlbmNlIHRvIHZhbGlkYXRlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiBpdCBpcyBhIHZhbGlkIGJlZ2lubmluZywgZmFsc2UgaWYgaXQgaXMgbm90LlxuICovXG5mdW5jdGlvbiBpc1ZhbGlkU2VudGVuY2VCZWdpbm5pbmcoIHNlbnRlbmNlQmVnaW5uaW5nICkge1xuXHRyZXR1cm4gKFxuXHRcdGlzQ2FwaXRhbExldHRlciggc2VudGVuY2VCZWdpbm5pbmcgKSB8fFxuXHRcdGlzTnVtYmVyKCBzZW50ZW5jZUJlZ2lubmluZyApIHx8XG5cdFx0aXNRdW90YXRpb24oIHNlbnRlbmNlQmVnaW5uaW5nICkgfHxcblx0XHRpc1B1bmN0dWF0aW9uKCBzZW50ZW5jZUJlZ2lubmluZyApXG5cdCk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIHRoZSB0b2tlbiBpcyBhIHZhbGlkIHNlbnRlbmNlIGVuZGluZy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdG9rZW4gVGhlIHRva2VuIHRvIHZhbGlkYXRlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiB0aGUgdG9rZW4gaXMgdmFsaWQgZW5kaW5nLCBmYWxzZSBpZiBpdCBpcyBub3QuXG4gKi9cbmZ1bmN0aW9uIGlzU2VudGVuY2VTdGFydCggdG9rZW4gKSB7XG5cdHJldHVybiAoICEgaXNVbmRlZmluZWQoIHRva2VuICkgJiYgKFxuXHRcdFwiaHRtbC1zdGFydFwiID09PSB0b2tlbi50eXBlIHx8XG5cdFx0XCJodG1sLWVuZFwiID09PSB0b2tlbi50eXBlIHx8XG5cdFx0XCJibG9jay1zdGFydFwiID09PSB0b2tlbi50eXBlXG5cdCkgKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGFuIGFycmF5IG9mIHNlbnRlbmNlcyBmb3IgYSBnaXZlbiBhcnJheSBvZiB0b2tlbnMsIGFzc3VtZXMgdGhhdCB0aGUgdGV4dCBoYXMgYWxyZWFkeSBiZWVuIHNwbGl0IGludG8gYmxvY2tzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IHRva2VucyBUaGUgdG9rZW5zIGZyb20gdGhlIHNlbnRlbmNlIHRva2VuaXplci5cbiAqIEByZXR1cm5zIHtBcnJheTxzdHJpbmc+fSBBIGxpc3Qgb2Ygc2VudGVuY2VzLlxuICovXG5mdW5jdGlvbiBnZXRTZW50ZW5jZXNGcm9tVG9rZW5zKCB0b2tlbnMgKSB7XG5cdHZhciB0b2tlblNlbnRlbmNlcyA9IFtdLCBjdXJyZW50U2VudGVuY2UgPSBcIlwiLCBuZXh0U2VudGVuY2VTdGFydDtcblxuXHR2YXIgc2xpY2VkO1xuXG5cdC8vIERyb3AgdGhlIGZpcnN0IGFuZCBsYXN0IEhUTUwgdGFnIGlmIGJvdGggYXJlIHByZXNlbnQuXG5cdGRvIHtcblx0XHRzbGljZWQgPSBmYWxzZTtcblx0XHR2YXIgZmlyc3RUb2tlbiA9IHRva2Vuc1sgMCBdO1xuXHRcdHZhciBsYXN0VG9rZW4gPSB0b2tlbnNbIHRva2Vucy5sZW5ndGggLSAxIF07XG5cblx0XHRpZiAoIGZpcnN0VG9rZW4udHlwZSA9PT0gXCJodG1sLXN0YXJ0XCIgJiYgbGFzdFRva2VuLnR5cGUgPT09IFwiaHRtbC1lbmRcIiApIHtcblx0XHRcdHRva2VucyA9IHRva2Vucy5zbGljZSggMSwgdG9rZW5zLmxlbmd0aCAtIDEgKTtcblxuXHRcdFx0c2xpY2VkID0gdHJ1ZTtcblx0XHR9XG5cdH0gd2hpbGUgKCBzbGljZWQgJiYgdG9rZW5zLmxlbmd0aCA+IDEgKTtcblxuXHRmb3JFYWNoKCB0b2tlbnMsIGZ1bmN0aW9uKCB0b2tlbiwgaSApIHtcblx0XHR2YXIgaGFzTmV4dFNlbnRlbmNlO1xuXHRcdHZhciBuZXh0VG9rZW4gPSB0b2tlbnNbIGkgKyAxIF07XG5cdFx0dmFyIHNlY29uZFRvTmV4dFRva2VuID0gdG9rZW5zWyBpICsgMiBdO1xuXHRcdHZhciBuZXh0Q2hhcmFjdGVycztcblxuXHRcdHN3aXRjaCAoIHRva2VuLnR5cGUgKSB7XG5cblx0XHRcdGNhc2UgXCJodG1sLXN0YXJ0XCI6XG5cdFx0XHRjYXNlIFwiaHRtbC1lbmRcIjpcblx0XHRcdFx0aWYgKCBpc0JyZWFrVGFnKCB0b2tlbi5zcmMgKSApIHtcblx0XHRcdFx0XHR0b2tlblNlbnRlbmNlcy5wdXNoKCBjdXJyZW50U2VudGVuY2UgKTtcblx0XHRcdFx0XHRjdXJyZW50U2VudGVuY2UgPSBcIlwiO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGN1cnJlbnRTZW50ZW5jZSArPSB0b2tlbi5zcmM7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgXCJzZW50ZW5jZVwiOlxuXHRcdFx0XHRjdXJyZW50U2VudGVuY2UgKz0gdG9rZW4uc3JjO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBcInNlbnRlbmNlLWRlbGltaXRlclwiOlxuXHRcdFx0XHRjdXJyZW50U2VudGVuY2UgKz0gdG9rZW4uc3JjO1xuXG5cdFx0XHRcdGlmICggISBpc1VuZGVmaW5lZCggbmV4dFRva2VuICkgJiYgXCJibG9jay1lbmRcIiAhPT0gbmV4dFRva2VuLnR5cGUgKSB7XG5cdFx0XHRcdFx0dG9rZW5TZW50ZW5jZXMucHVzaCggY3VycmVudFNlbnRlbmNlICk7XG5cdFx0XHRcdFx0Y3VycmVudFNlbnRlbmNlID0gXCJcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBcImZ1bGwtc3RvcFwiOlxuXHRcdFx0XHRjdXJyZW50U2VudGVuY2UgKz0gdG9rZW4uc3JjO1xuXG5cdFx0XHRcdG5leHRDaGFyYWN0ZXJzID0gZ2V0TmV4dFR3b0NoYXJhY3RlcnMoIFsgbmV4dFRva2VuLCBzZWNvbmRUb05leHRUb2tlbiBdICk7XG5cblx0XHRcdFx0Ly8gRm9yIGEgbmV3IHNlbnRlbmNlIHdlIG5lZWQgdG8gY2hlY2sgdGhlIG5leHQgdHdvIGNoYXJhY3RlcnMuXG5cdFx0XHRcdGhhc05leHRTZW50ZW5jZSA9IG5leHRDaGFyYWN0ZXJzLmxlbmd0aCA+PSAyO1xuXHRcdFx0XHRuZXh0U2VudGVuY2VTdGFydCA9IGhhc05leHRTZW50ZW5jZSA/IG5leHRDaGFyYWN0ZXJzWyAxIF0gOiBcIlwiO1xuXHRcdFx0XHQvLyBJZiB0aGUgbmV4dCBjaGFyYWN0ZXIgaXMgYSBudW1iZXIsIG5ldmVyIHNwbGl0LiBGb3IgZXhhbXBsZTogSVB2NC1udW1iZXJzLlxuXHRcdFx0XHRpZiAoIGhhc05leHRTZW50ZW5jZSAmJiBpc051bWJlciggbmV4dENoYXJhY3RlcnNbIDAgXSApICkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIE9ubHkgc3BsaXQgb24gc2VudGVuY2UgZGVsaW1pdGVycyB3aGVuIHRoZSBuZXh0IHNlbnRlbmNlIGxvb2tzIGxpa2UgdGhlIHN0YXJ0IG9mIGEgc2VudGVuY2UuXG5cdFx0XHRcdGlmICggKCBoYXNOZXh0U2VudGVuY2UgJiYgaXNWYWxpZFNlbnRlbmNlQmVnaW5uaW5nKCBuZXh0U2VudGVuY2VTdGFydCApICkgfHwgaXNTZW50ZW5jZVN0YXJ0KCBuZXh0VG9rZW4gKSApIHtcblx0XHRcdFx0XHR0b2tlblNlbnRlbmNlcy5wdXNoKCBjdXJyZW50U2VudGVuY2UgKTtcblx0XHRcdFx0XHRjdXJyZW50U2VudGVuY2UgPSBcIlwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFwibmV3bGluZVwiOlxuXHRcdFx0XHR0b2tlblNlbnRlbmNlcy5wdXNoKCBjdXJyZW50U2VudGVuY2UgKTtcblx0XHRcdFx0Y3VycmVudFNlbnRlbmNlID0gXCJcIjtcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgXCJibG9jay1zdGFydFwiOlxuXHRcdFx0XHRjdXJyZW50U2VudGVuY2UgKz0gdG9rZW4uc3JjO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBcImJsb2NrLWVuZFwiOlxuXHRcdFx0XHRjdXJyZW50U2VudGVuY2UgKz0gdG9rZW4uc3JjO1xuXG5cdFx0XHRcdG5leHRDaGFyYWN0ZXJzID0gZ2V0TmV4dFR3b0NoYXJhY3RlcnMoIFsgbmV4dFRva2VuLCBzZWNvbmRUb05leHRUb2tlbiBdICk7XG5cblx0XHRcdFx0Ly8gRm9yIGEgbmV3IHNlbnRlbmNlIHdlIG5lZWQgdG8gY2hlY2sgdGhlIG5leHQgdHdvIGNoYXJhY3RlcnMuXG5cdFx0XHRcdGhhc05leHRTZW50ZW5jZSA9IG5leHRDaGFyYWN0ZXJzLmxlbmd0aCA+PSAyO1xuXHRcdFx0XHRuZXh0U2VudGVuY2VTdGFydCA9IGhhc05leHRTZW50ZW5jZSA/IG5leHRDaGFyYWN0ZXJzWyAwIF0gOiBcIlwiO1xuXHRcdFx0XHQvLyBJZiB0aGUgbmV4dCBjaGFyYWN0ZXIgaXMgYSBudW1iZXIsIG5ldmVyIHNwbGl0LiBGb3IgZXhhbXBsZTogSVB2NC1udW1iZXJzLlxuXHRcdFx0XHRpZiAoIGhhc05leHRTZW50ZW5jZSAmJiBpc051bWJlciggbmV4dENoYXJhY3RlcnNbIDAgXSApICkge1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCAoIGhhc05leHRTZW50ZW5jZSAmJiBpc1ZhbGlkU2VudGVuY2VCZWdpbm5pbmcoIG5leHRTZW50ZW5jZVN0YXJ0ICkgKSB8fCBpc1NlbnRlbmNlU3RhcnQoIG5leHRUb2tlbiApICkge1xuXHRcdFx0XHRcdHRva2VuU2VudGVuY2VzLnB1c2goIGN1cnJlbnRTZW50ZW5jZSApO1xuXHRcdFx0XHRcdGN1cnJlbnRTZW50ZW5jZSA9IFwiXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9ICk7XG5cblx0aWYgKCBcIlwiICE9PSBjdXJyZW50U2VudGVuY2UgKSB7XG5cdFx0dG9rZW5TZW50ZW5jZXMucHVzaCggY3VycmVudFNlbnRlbmNlICk7XG5cdH1cblxuXHR0b2tlblNlbnRlbmNlcyA9IG1hcCggdG9rZW5TZW50ZW5jZXMsIGZ1bmN0aW9uKCBzZW50ZW5jZSApIHtcblx0XHRyZXR1cm4gc2VudGVuY2UudHJpbSgpO1xuXHR9ICk7XG5cblx0cmV0dXJuIHRva2VuU2VudGVuY2VzO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIHNlbnRlbmNlcyBmcm9tIGEgY2VydGFpbiBibG9jay5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gYmxvY2sgVGhlIEhUTUwgaW5zaWRlIGEgSFRNTCBibG9jay5cbiAqIEByZXR1cm5zIHtBcnJheTxzdHJpbmc+fSBUaGUgbGlzdCBvZiBzZW50ZW5jZXMgaW4gdGhlIGJsb2NrLlxuICovXG5mdW5jdGlvbiBnZXRTZW50ZW5jZXNGcm9tQmxvY2soIGJsb2NrICkge1xuXHR2YXIgdG9rZW5zID0gdG9rZW5pemVTZW50ZW5jZXMoIGJsb2NrICk7XG5cblx0cmV0dXJuIHRva2Vucy5sZW5ndGggPT09IDAgPyBbXSA6IGdldFNlbnRlbmNlc0Zyb21Ub2tlbnMoIHRva2VucyApO1xufVxuXG52YXIgZ2V0U2VudGVuY2VzRnJvbUJsb2NrQ2FjaGVkID0gbWVtb2l6ZSggZ2V0U2VudGVuY2VzRnJvbUJsb2NrICk7XG5cbi8qKlxuICogUmV0dXJucyBzZW50ZW5jZXMgaW4gYSBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRleHQgVGhlIHN0cmluZyB0byBjb3VudCBzZW50ZW5jZXMgaW4uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFNlbnRlbmNlcyBmb3VuZCBpbiB0aGUgdGV4dC5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdGV4dCApIHtcblx0dGV4dCA9IHVuaWZ5V2hpdGVzcGFjZSggdGV4dCApO1xuXHR2YXIgc2VudGVuY2VzLCBibG9ja3MgPSBnZXRCbG9ja3MoIHRleHQgKTtcblxuXHQvLyBTcGxpdCBlYWNoIGJsb2NrIG9uIG5ld2xpbmVzLlxuXHRibG9ja3MgPSBmbGF0TWFwKCBibG9ja3MsIGZ1bmN0aW9uKCBibG9jayApIHtcblx0XHRyZXR1cm4gYmxvY2suc3BsaXQoIG5ld0xpbmVSZWdleCApO1xuXHR9ICk7XG5cblx0c2VudGVuY2VzID0gZmxhdE1hcCggYmxvY2tzLCBnZXRTZW50ZW5jZXNGcm9tQmxvY2tDYWNoZWQgKTtcblxuXHRyZXR1cm4gZmlsdGVyKCBzZW50ZW5jZXMsIG5lZ2F0ZSggaXNFbXB0eSApICk7XG59O1xuIiwiLyoqIEBtb2R1bGUgc3RyaW5nUHJvY2Vzc2luZy9jb3VudFdvcmRzICovXG5cbnZhciBzdHJpcFRhZ3MgPSByZXF1aXJlKCBcIi4vc3RyaXBIVE1MVGFncy5qc1wiICkuc3RyaXBGdWxsVGFncztcbnZhciBzdHJpcFNwYWNlcyA9IHJlcXVpcmUoIFwiLi9zdHJpcFNwYWNlcy5qc1wiICk7XG52YXIgcmVtb3ZlUHVuY3R1YXRpb24gPSByZXF1aXJlKCBcIi4vcmVtb3ZlUHVuY3R1YXRpb24uanNcIiApO1xudmFyIG1hcCA9IHJlcXVpcmUoIFwibG9kYXNoL21hcFwiICk7XG52YXIgZmlsdGVyID0gcmVxdWlyZSggXCJsb2Rhc2gvZmlsdGVyXCIgKTtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIGFycmF5IHdpdGggd29yZHMgdXNlZCBpbiB0aGUgdGV4dC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byBiZSBjb3VudGVkLlxuICogQHJldHVybnMge0FycmF5fSBUaGUgYXJyYXkgd2l0aCBhbGwgd29yZHMuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHRleHQgKSB7XG5cdHRleHQgPSBzdHJpcFNwYWNlcyggc3RyaXBUYWdzKCB0ZXh0ICkgKTtcblx0aWYgKCB0ZXh0ID09PSBcIlwiICkge1xuXHRcdHJldHVybiBbXTtcblx0fVxuXG5cdHZhciB3b3JkcyA9IHRleHQuc3BsaXQoIC9cXHMvZyApO1xuXG5cdHdvcmRzID0gbWFwKCB3b3JkcywgZnVuY3Rpb24oIHdvcmQgKSB7XG5cdFx0cmV0dXJuIHJlbW92ZVB1bmN0dWF0aW9uKCB3b3JkICk7XG5cdH0gKTtcblxuXHRyZXR1cm4gZmlsdGVyKCB3b3JkcywgZnVuY3Rpb24oIHdvcmQgKSB7XG5cdFx0cmV0dXJuIHdvcmQudHJpbSgpICE9PSBcIlwiO1xuXHR9ICk7XG59O1xuXG4iLCIvKipcbiAqIE5vcm1hbGl6ZXMgc2luZ2xlIHF1b3RlcyB0byAncmVndWxhcicgcXVvdGVzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRleHQgdG8gbm9ybWFsaXplLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIG5vcm1hbGl6ZWQgdGV4dC5cbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplU2luZ2xlUXVvdGVzKCB0ZXh0ICkge1xuXHRyZXR1cm4gdGV4dC5yZXBsYWNlKCAvW+KAmOKAmeKAm2BdL2csIFwiJ1wiICk7XG59XG5cbi8qKlxuICogTm9ybWFsaXplcyBkb3VibGUgcXVvdGVzIHRvICdyZWd1bGFyJyBxdW90ZXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGV4dCB0byBub3JtYWxpemUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgbm9ybWFsaXplZCB0ZXh0LlxuICovXG5mdW5jdGlvbiBub3JtYWxpemVEb3VibGVRdW90ZXMoIHRleHQgKSB7XG5cdHJldHVybiB0ZXh0LnJlcGxhY2UoIC9b4oCc4oCd44Cd44Ce44Cf4oCf4oCeXS9nLCBcIlxcXCJcIiApO1xufVxuXG4vKipcbiAqIE5vcm1hbGl6ZXMgcXVvdGVzIHRvICdyZWd1bGFyJyBxdW90ZXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGV4dCB0byBub3JtYWxpemUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgbm9ybWFsaXplZCB0ZXh0LlxuICovXG5mdW5jdGlvbiBub3JtYWxpemVRdW90ZXMoIHRleHQgKSB7XG5cdHJldHVybiBub3JtYWxpemVEb3VibGVRdW90ZXMoIG5vcm1hbGl6ZVNpbmdsZVF1b3RlcyggdGV4dCApICk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRub3JtYWxpemVTaW5nbGU6IG5vcm1hbGl6ZVNpbmdsZVF1b3Rlcyxcblx0bm9ybWFsaXplRG91YmxlOiBub3JtYWxpemVEb3VibGVRdW90ZXMsXG5cdG5vcm1hbGl6ZTogbm9ybWFsaXplUXVvdGVzLFxufTtcbiIsInZhciBnZXRXb3JkcyA9IHJlcXVpcmUoIFwiLi4vc3RyaW5nUHJvY2Vzc2luZy9nZXRXb3Jkc1wiICk7XG52YXIgZ2V0U2VudGVuY2VzID0gcmVxdWlyZSggXCIuLi9zdHJpbmdQcm9jZXNzaW5nL2dldFNlbnRlbmNlc1wiICk7XG52YXIgV29yZENvbWJpbmF0aW9uID0gcmVxdWlyZSggXCIuLi92YWx1ZXMvV29yZENvbWJpbmF0aW9uXCIgKTtcbnZhciBub3JtYWxpemVTaW5nbGVRdW90ZXMgPSByZXF1aXJlKCBcIi4uL3N0cmluZ1Byb2Nlc3NpbmcvcXVvdGVzLmpzXCIgKS5ub3JtYWxpemVTaW5nbGU7XG52YXIgZnVuY3Rpb25Xb3JkcyA9IHJlcXVpcmUoIFwiLi4vcmVzZWFyY2hlcy9lbmdsaXNoL2Z1bmN0aW9uV29yZHMuanNcIiApO1xudmFyIGNvdW50U3lsbGFibGVzID0gcmVxdWlyZSggXCIuLi9zdHJpbmdQcm9jZXNzaW5nL3N5bGxhYmxlcy9jb3VudC5qc1wiICk7XG5cbnZhciBmaWx0ZXIgPSByZXF1aXJlKCBcImxvZGFzaC9maWx0ZXJcIiApO1xudmFyIG1hcCA9IHJlcXVpcmUoIFwibG9kYXNoL21hcFwiICk7XG52YXIgZm9yRWFjaCA9IHJlcXVpcmUoIFwibG9kYXNoL2ZvckVhY2hcIiApO1xudmFyIGhhcyA9IHJlcXVpcmUoIFwibG9kYXNoL2hhc1wiICk7XG52YXIgZmxhdE1hcCA9IHJlcXVpcmUoIFwibG9kYXNoL2ZsYXRNYXBcIiApO1xudmFyIHZhbHVlcyA9IHJlcXVpcmUoIFwibG9kYXNoL3ZhbHVlc1wiICk7XG52YXIgdGFrZSA9IHJlcXVpcmUoIFwibG9kYXNoL3Rha2VcIiApO1xudmFyIGluY2x1ZGVzID0gcmVxdWlyZSggXCJsb2Rhc2gvaW5jbHVkZXNcIiApO1xudmFyIGludGVyc2VjdGlvbiA9IHJlcXVpcmUoIFwibG9kYXNoL2ludGVyc2VjdGlvblwiICk7XG52YXIgaXNFbXB0eSA9IHJlcXVpcmUoIFwibG9kYXNoL2lzRW1wdHlcIiApO1xuXG52YXIgZGVuc2l0eUxvd2VyTGltaXQgPSAwO1xudmFyIGRlbnNpdHlVcHBlckxpbWl0ID0gMC4wMztcbnZhciByZWxldmFudFdvcmRMaW1pdCA9IDEwMDtcbnZhciB3b3JkQ291bnRMb3dlckxpbWl0ID0gMjAwO1xuXG4vLyBFbiBkYXNoLCBlbSBkYXNoIGFuZCBoeXBoZW4tbWludXMuXG52YXIgc3BlY2lhbENoYXJhY3RlcnMgPSBbIFwi4oCTXCIsIFwi4oCUXCIsIFwiLVwiIF07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgd29yZCBjb21iaW5hdGlvbnMgZm9yIHRoZSBnaXZlbiB0ZXh0IGJhc2VkIG9uIHRoZSBjb21iaW5hdGlvbiBzaXplLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHRvIHJldHJpZXZlIGNvbWJpbmF0aW9ucyBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gY29tYmluYXRpb25TaXplIFRoZSBzaXplIG9mIHRoZSBjb21iaW5hdGlvbnMgdG8gcmV0cmlldmUuXG4gKiBAcmV0dXJucyB7V29yZENvbWJpbmF0aW9uW119IEFsbCB3b3JkIGNvbWJpbmF0aW9ucyBmb3IgdGhlIGdpdmVuIHRleHQuXG4gKi9cbmZ1bmN0aW9uIGdldFdvcmRDb21iaW5hdGlvbnMoIHRleHQsIGNvbWJpbmF0aW9uU2l6ZSApIHtcblx0dmFyIHNlbnRlbmNlcyA9IGdldFNlbnRlbmNlcyggdGV4dCApO1xuXG5cdHZhciB3b3JkcywgY29tYmluYXRpb247XG5cblx0cmV0dXJuIGZsYXRNYXAoIHNlbnRlbmNlcywgZnVuY3Rpb24oIHNlbnRlbmNlICkge1xuXHRcdHNlbnRlbmNlID0gc2VudGVuY2UudG9Mb2NhbGVMb3dlckNhc2UoKTtcblx0XHRzZW50ZW5jZSA9IG5vcm1hbGl6ZVNpbmdsZVF1b3Rlcyggc2VudGVuY2UgKTtcblx0XHR3b3JkcyA9IGdldFdvcmRzKCBzZW50ZW5jZSApO1xuXG5cdFx0cmV0dXJuIGZpbHRlciggbWFwKCB3b3JkcywgZnVuY3Rpb24oIHdvcmQsIGkgKSB7XG5cdFx0XHQvLyBJZiB0aGVyZSBhcmUgc3RpbGwgZW5vdWdoIHdvcmRzIGluIHRoZSBzZW50ZW5jZSB0byBzbGljZSBvZi5cblx0XHRcdGlmICggaSArIGNvbWJpbmF0aW9uU2l6ZSAtIDEgPCB3b3Jkcy5sZW5ndGggKSB7XG5cdFx0XHRcdGNvbWJpbmF0aW9uID0gd29yZHMuc2xpY2UoIGksIGkgKyBjb21iaW5hdGlvblNpemUgKTtcblx0XHRcdFx0cmV0dXJuIG5ldyBXb3JkQ29tYmluYXRpb24oIGNvbWJpbmF0aW9uICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9ICkgKTtcblx0fSApO1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZXMgb2NjdXJyZW5jZXMgZm9yIGEgbGlzdCBvZiB3b3JkIGNvbWJpbmF0aW9ucy5cbiAqXG4gKiBAcGFyYW0ge1dvcmRDb21iaW5hdGlvbltdfSB3b3JkQ29tYmluYXRpb25zIFRoZSB3b3JkIGNvbWJpbmF0aW9ucyB0byBjYWxjdWxhdGUgb2NjdXJyZW5jZXMgZm9yLlxuICogQHJldHVybnMge1dvcmRDb21iaW5hdGlvbltdfSBXb3JkIGNvbWJpbmF0aW9ucyB3aXRoIHRoZWlyIHJlc3BlY3RpdmUgb2NjdXJyZW5jZXMuXG4gKi9cbmZ1bmN0aW9uIGNhbGN1bGF0ZU9jY3VycmVuY2VzKCB3b3JkQ29tYmluYXRpb25zICkge1xuXHR2YXIgb2NjdXJyZW5jZXMgPSB7fTtcblxuXHRmb3JFYWNoKCB3b3JkQ29tYmluYXRpb25zLCBmdW5jdGlvbiggd29yZENvbWJpbmF0aW9uICkge1xuXHRcdHZhciBjb21iaW5hdGlvbiA9IHdvcmRDb21iaW5hdGlvbi5nZXRDb21iaW5hdGlvbigpO1xuXG5cdFx0aWYgKCAhIGhhcyggb2NjdXJyZW5jZXMsIGNvbWJpbmF0aW9uICkgKSB7XG5cdFx0XHRvY2N1cnJlbmNlc1sgY29tYmluYXRpb24gXSA9IHdvcmRDb21iaW5hdGlvbjtcblx0XHR9XG5cblx0XHRvY2N1cnJlbmNlc1sgY29tYmluYXRpb24gXS5pbmNyZW1lbnRPY2N1cnJlbmNlcygpO1xuXHR9ICk7XG5cblx0cmV0dXJuIHZhbHVlcyggb2NjdXJyZW5jZXMgKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIG9ubHkgdGhlIHJlbGV2YW50IGNvbWJpbmF0aW9ucyBmcm9tIGEgbGlzdCBvZiB3b3JkIGNvbWJpbmF0aW9ucy4gQXNzdW1lc1xuICogb2NjdXJyZW5jZXMgaGF2ZSBhbHJlYWR5IGJlZW4gY2FsY3VsYXRlZC5cbiAqXG4gKiBAcGFyYW0ge1dvcmRDb21iaW5hdGlvbltdfSB3b3JkQ29tYmluYXRpb25zIEEgbGlzdCBvZiB3b3JkIGNvbWJpbmF0aW9ucy5cbiAqIEByZXR1cm5zIHtXb3JkQ29tYmluYXRpb25bXX0gT25seSByZWxldmFudCB3b3JkIGNvbWJpbmF0aW9ucy5cbiAqL1xuZnVuY3Rpb24gZ2V0UmVsZXZhbnRDb21iaW5hdGlvbnMoIHdvcmRDb21iaW5hdGlvbnMgKSB7XG5cdHdvcmRDb21iaW5hdGlvbnMgPSB3b3JkQ29tYmluYXRpb25zLmZpbHRlciggZnVuY3Rpb24oIGNvbWJpbmF0aW9uICkge1xuXHRcdHJldHVybiBjb21iaW5hdGlvbi5nZXRPY2N1cnJlbmNlcygpICE9PSAxICYmXG5cdFx0XHRjb21iaW5hdGlvbi5nZXRSZWxldmFuY2UoKSAhPT0gMDtcblx0fSApO1xuXHRyZXR1cm4gd29yZENvbWJpbmF0aW9ucztcbn1cblxuLyoqXG4gKiBTb3J0cyBjb21iaW5hdGlvbnMgYmFzZWQgb24gdGhlaXIgcmVsZXZhbmNlIGFuZCBsZW5ndGguXG4gKlxuICogQHBhcmFtIHtXb3JkQ29tYmluYXRpb25bXX0gd29yZENvbWJpbmF0aW9ucyBUaGUgY29tYmluYXRpb25zIHRvIHNvcnQuXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gc29ydENvbWJpbmF0aW9ucyggd29yZENvbWJpbmF0aW9ucyApIHtcblx0d29yZENvbWJpbmF0aW9ucy5zb3J0KCBmdW5jdGlvbiggY29tYmluYXRpb25BLCBjb21iaW5hdGlvbkIgKSB7XG5cdFx0dmFyIGRpZmZlcmVuY2UgPSBjb21iaW5hdGlvbkIuZ2V0UmVsZXZhbmNlKCkgLSBjb21iaW5hdGlvbkEuZ2V0UmVsZXZhbmNlKCk7XG5cdFx0Ly8gVGhlIGNvbWJpbmF0aW9uIHdpdGggdGhlIGhpZ2hlc3QgcmVsZXZhbmNlIGNvbWVzIGZpcnN0LlxuXHRcdGlmICggZGlmZmVyZW5jZSAhPT0gMCApIHtcblx0XHRcdHJldHVybiBkaWZmZXJlbmNlO1xuXHRcdH1cblx0XHQvLyBJbiBjYXNlIG9mIGEgdGllIG9uIHJlbGV2YW5jZSwgdGhlIGxvbmdlc3QgY29tYmluYXRpb24gY29tZXMgZmlyc3QuXG5cdFx0cmV0dXJuIGNvbWJpbmF0aW9uQi5nZXRMZW5ndGgoKSAtIGNvbWJpbmF0aW9uQS5nZXRMZW5ndGgoKTtcblx0fSApO1xufVxuXG4vKipcbiAqIEZpbHRlcnMgd29yZCBjb21iaW5hdGlvbnMgYmVnaW5uaW5nIHdpdGggY2VydGFpbiBmdW5jdGlvbiB3b3Jkcy5cbiAqXG4gKiBAcGFyYW0ge1dvcmRDb21iaW5hdGlvbltdfSB3b3JkQ29tYmluYXRpb25zIFRoZSB3b3JkIGNvbWJpbmF0aW9ucyB0byBmaWx0ZXIuXG4gKiBAcGFyYW0ge2FycmF5fSBmdW5jdGlvbldvcmRzIFRoZSBsaXN0IG9mIGZ1bmN0aW9uIHdvcmRzLlxuICogQHJldHVybnMge1dvcmRDb21iaW5hdGlvbltdfSBGaWx0ZXJlZCB3b3JkIGNvbWJpbmF0aW9ucy5cbiAqL1xuZnVuY3Rpb24gZmlsdGVyRnVuY3Rpb25Xb3Jkc0F0QmVnaW5uaW5nKCB3b3JkQ29tYmluYXRpb25zLCBmdW5jdGlvbldvcmRzICkge1xuXHRyZXR1cm4gd29yZENvbWJpbmF0aW9ucy5maWx0ZXIoIGZ1bmN0aW9uKCBjb21iaW5hdGlvbiApIHtcblx0XHRyZXR1cm4gISBpbmNsdWRlcyggZnVuY3Rpb25Xb3JkcywgY29tYmluYXRpb24uZ2V0V29yZHMoKVsgMCBdICk7XG5cdH0gKTtcbn1cblxuLyoqXG4gKiBGaWx0ZXJzIHdvcmQgY29tYmluYXRpb25zIGVuZGluZyB3aXRoIGNlcnRhaW4gZnVuY3Rpb24gd29yZHMuXG4gKlxuICogQHBhcmFtIHtXb3JkQ29tYmluYXRpb25bXX0gd29yZENvbWJpbmF0aW9ucyBUaGUgd29yZCBjb21iaW5hdGlvbnMgdG8gZmlsdGVyLlxuICogQHBhcmFtIHthcnJheX0gZnVuY3Rpb25Xb3JkcyBUaGUgbGlzdCBvZiBmdW5jdGlvbiB3b3Jkcy5cbiAqIEByZXR1cm5zIHtXb3JkQ29tYmluYXRpb25bXX0gRmlsdGVyZWQgd29yZCBjb21iaW5hdGlvbnMuXG4gKi9cbmZ1bmN0aW9uIGZpbHRlckZ1bmN0aW9uV29yZHNBdEVuZGluZyggd29yZENvbWJpbmF0aW9ucywgZnVuY3Rpb25Xb3JkcyApIHtcblx0cmV0dXJuIHdvcmRDb21iaW5hdGlvbnMuZmlsdGVyKCBmdW5jdGlvbiggY29tYmluYXRpb24gKSB7XG5cdFx0dmFyIHdvcmRzID0gY29tYmluYXRpb24uZ2V0V29yZHMoKTtcblx0XHR2YXIgbGFzdFdvcmRJbmRleCA9IHdvcmRzLmxlbmd0aCAtIDE7XG5cdFx0cmV0dXJuICEgaW5jbHVkZXMoIGZ1bmN0aW9uV29yZHMsIHdvcmRzWyBsYXN0V29yZEluZGV4IF0gKTtcblx0fSApO1xufVxuXG4vKipcbiAqIEZpbHRlcnMgd29yZCBjb21iaW5hdGlvbnMgYmVnaW5uaW5nIGFuZCBlbmRpbmcgd2l0aCBjZXJ0YWluIGZ1bmN0aW9uIHdvcmRzLlxuICpcbiAqIEBwYXJhbSB7V29yZENvbWJpbmF0aW9uW119IHdvcmRDb21iaW5hdGlvbnMgVGhlIHdvcmQgY29tYmluYXRpb25zIHRvIGZpbHRlci5cbiAqIEBwYXJhbSB7YXJyYXl9IGZ1bmN0aW9uV29yZHMgVGhlIGxpc3Qgb2YgZnVuY3Rpb24gd29yZHMuXG4gKiBAcmV0dXJucyB7V29yZENvbWJpbmF0aW9uW119IEZpbHRlcmVkIHdvcmQgY29tYmluYXRpb25zLlxuICovXG5mdW5jdGlvbiBmaWx0ZXJGdW5jdGlvbldvcmRzKCB3b3JkQ29tYmluYXRpb25zLCBmdW5jdGlvbldvcmRzICkge1xuXHR3b3JkQ29tYmluYXRpb25zID0gZmlsdGVyRnVuY3Rpb25Xb3Jkc0F0QmVnaW5uaW5nKCB3b3JkQ29tYmluYXRpb25zLCBmdW5jdGlvbldvcmRzICk7XG5cdHdvcmRDb21iaW5hdGlvbnMgPSBmaWx0ZXJGdW5jdGlvbldvcmRzQXRFbmRpbmcoIHdvcmRDb21iaW5hdGlvbnMsIGZ1bmN0aW9uV29yZHMgKTtcblx0cmV0dXJuIHdvcmRDb21iaW5hdGlvbnM7XG59XG5cbi8qKlxuICogRmlsdGVycyB3b3JkIGNvbWJpbmF0aW9ucyBjb250YWluaW5nIGEgc3BlY2lhbCBjaGFyYWN0ZXIuXG4gKlxuICogQHBhcmFtIHtXb3JkQ29tYmluYXRpb25bXX0gd29yZENvbWJpbmF0aW9ucyBUaGUgd29yZCBjb21iaW5hdGlvbnMgdG8gZmlsdGVyLlxuICogQHBhcmFtIHthcnJheX0gc3BlY2lhbENoYXJhY3RlcnMgVGhlIGxpc3Qgb2Ygc3BlY2lhbCBjaGFyYWN0ZXJzLlxuICogQHJldHVybnMge1dvcmRDb21iaW5hdGlvbltdfSBGaWx0ZXJlZCB3b3JkIGNvbWJpbmF0aW9ucy5cbiAqL1xuZnVuY3Rpb24gZmlsdGVyU3BlY2lhbENoYXJhY3RlcnMoIHdvcmRDb21iaW5hdGlvbnMsIHNwZWNpYWxDaGFyYWN0ZXJzICkge1xuXHRyZXR1cm4gd29yZENvbWJpbmF0aW9ucy5maWx0ZXIoIGZ1bmN0aW9uKCBjb21iaW5hdGlvbiApIHtcblx0XHRyZXR1cm4gaXNFbXB0eShcblx0XHRcdGludGVyc2VjdGlvbiggc3BlY2lhbENoYXJhY3RlcnMsIGNvbWJpbmF0aW9uLmdldFdvcmRzKCkgKVxuXHRcdCk7XG5cdH0gKTtcbn1cbi8qKlxuICogRmlsdGVycyB3b3JkIGNvbWJpbmF0aW9ucyB3aXRoIGEgbGVuZ3RoIG9mIG9uZSBhbmQgYSBnaXZlbiBzeWxsYWJsZSBjb3VudC5cbiAqXG4gKiBAcGFyYW0ge1dvcmRDb21iaW5hdGlvbltdfSB3b3JkQ29tYmluYXRpb25zIFRoZSB3b3JkIGNvbWJpbmF0aW9ucyB0byBmaWx0ZXIuXG4gKiBAcGFyYW0ge251bWJlcn0gc3lsbGFibGVDb3VudCBUaGUgbnVtYmVyIG9mIHN5bGxhYmxlcyB0byB1c2UgZm9yIGZpbHRlcmluZy5cbiAqIEByZXR1cm5zIHtXb3JkQ29tYmluYXRpb25bXX0gRmlsdGVyZWQgd29yZCBjb21iaW5hdGlvbnMuXG4gKi9cbmZ1bmN0aW9uIGZpbHRlck9uU3lsbGFibGVDb3VudCggd29yZENvbWJpbmF0aW9ucywgc3lsbGFibGVDb3VudCApIHtcblx0cmV0dXJuIHdvcmRDb21iaW5hdGlvbnMuZmlsdGVyKCBmdW5jdGlvbiggY29tYmluYXRpb24gKSAge1xuXHRcdHJldHVybiAhICggY29tYmluYXRpb24uZ2V0TGVuZ3RoKCkgPT09IDEgJiYgY291bnRTeWxsYWJsZXMoIGNvbWJpbmF0aW9uLmdldFdvcmRzKClbIDAgXSwgXCJlbl9VU1wiICkgPD0gc3lsbGFibGVDb3VudCApO1xuXHR9ICk7XG59XG5cbi8qKlxuICogRmlsdGVycyB3b3JkIGNvbWJpbmF0aW9ucyBiYXNlZCBvbiBrZXl3b3JkIGRlbnNpdHkgaWYgdGhlIHdvcmQgY291bnQgaXMgMjAwIG9yIG92ZXIuXG4gKlxuICogQHBhcmFtIHtXb3JkQ29tYmluYXRpb25bXX0gd29yZENvbWJpbmF0aW9ucyBUaGUgd29yZCBjb21iaW5hdGlvbnMgdG8gZmlsdGVyLlxuICogQHBhcmFtIHtudW1iZXJ9IHdvcmRDb3VudCBUaGUgbnVtYmVyIG9mIHdvcmRzIGluIHRoZSB0b3RhbCB0ZXh0LlxuICogQHBhcmFtIHtudW1iZXJ9IGRlbnNpdHlMb3dlckxpbWl0IFRoZSBsb3dlciBsaW1pdCBvZiBrZXl3b3JkIGRlbnNpdHkuXG4gKiBAcGFyYW0ge251bWJlcn0gZGVuc2l0eVVwcGVyTGltaXQgVGhlIHVwcGVyIGxpbWl0IG9mIGtleXdvcmQgZGVuc2l0eS5cbiAqIEByZXR1cm5zIHtXb3JkQ29tYmluYXRpb25bXX0gRmlsdGVyZWQgd29yZCBjb21iaW5hdGlvbnMuXG4gKi9cbmZ1bmN0aW9uIGZpbHRlck9uRGVuc2l0eSggd29yZENvbWJpbmF0aW9ucywgd29yZENvdW50LCBkZW5zaXR5TG93ZXJMaW1pdCwgZGVuc2l0eVVwcGVyTGltaXQgKSB7XG5cdHJldHVybiB3b3JkQ29tYmluYXRpb25zLmZpbHRlciggZnVuY3Rpb24oIGNvbWJpbmF0aW9uICkge1xuXHRcdHJldHVybiAoIGNvbWJpbmF0aW9uLmdldERlbnNpdHkoIHdvcmRDb3VudCApID49IGRlbnNpdHlMb3dlckxpbWl0ICYmIGNvbWJpbmF0aW9uLmdldERlbnNpdHkoIHdvcmRDb3VudCApIDwgZGVuc2l0eVVwcGVyTGltaXRcblx0XHQpO1xuXHR9ICk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgcmVsZXZhbnQgd29yZHMgaW4gYSBnaXZlbiB0ZXh0LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHRvIHJldHJpZXZlIHRoZSByZWxldmFudCB3b3JkcyBvZi5cbiAqIEByZXR1cm5zIHtXb3JkQ29tYmluYXRpb25bXX0gQWxsIHJlbGV2YW50IHdvcmRzIHNvcnRlZCBhbmQgZmlsdGVyZWQgZm9yIHRoaXMgdGV4dC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmVsZXZhbnRXb3JkcyggdGV4dCApIHtcblx0dmFyIHdvcmRzID0gZ2V0V29yZENvbWJpbmF0aW9ucyggdGV4dCwgMSApO1xuXHR2YXIgd29yZENvdW50ID0gd29yZHMubGVuZ3RoO1xuXG5cdHZhciBvbmVXb3JkQ29tYmluYXRpb25zID0gZ2V0UmVsZXZhbnRDb21iaW5hdGlvbnMoXG5cdFx0Y2FsY3VsYXRlT2NjdXJyZW5jZXMoIHdvcmRzIClcblx0KTtcblxuXHRzb3J0Q29tYmluYXRpb25zKCBvbmVXb3JkQ29tYmluYXRpb25zICk7XG5cdG9uZVdvcmRDb21iaW5hdGlvbnMgPSB0YWtlKCBvbmVXb3JkQ29tYmluYXRpb25zLCAxMDAgKTtcblxuXHR2YXIgb25lV29yZFJlbGV2YW5jZU1hcCA9IHt9O1xuXG5cdGZvckVhY2goIG9uZVdvcmRDb21iaW5hdGlvbnMsIGZ1bmN0aW9uKCBjb21iaW5hdGlvbiApIHtcblx0XHRvbmVXb3JkUmVsZXZhbmNlTWFwWyBjb21iaW5hdGlvbi5nZXRDb21iaW5hdGlvbigpIF0gPSBjb21iaW5hdGlvbi5nZXRSZWxldmFuY2UoKTtcblx0fSApO1xuXG5cdHZhciB0d29Xb3JkQ29tYmluYXRpb25zID0gY2FsY3VsYXRlT2NjdXJyZW5jZXMoIGdldFdvcmRDb21iaW5hdGlvbnMoIHRleHQsIDIgKSApO1xuXHR2YXIgdGhyZWVXb3JkQ29tYmluYXRpb25zID0gY2FsY3VsYXRlT2NjdXJyZW5jZXMoIGdldFdvcmRDb21iaW5hdGlvbnMoIHRleHQsIDMgKSApO1xuXHR2YXIgZm91cldvcmRDb21iaW5hdGlvbnMgPSBjYWxjdWxhdGVPY2N1cnJlbmNlcyggZ2V0V29yZENvbWJpbmF0aW9ucyggdGV4dCwgNCApICk7XG5cdHZhciBmaXZlV29yZENvbWJpbmF0aW9ucyA9IGNhbGN1bGF0ZU9jY3VycmVuY2VzKCBnZXRXb3JkQ29tYmluYXRpb25zKCB0ZXh0LCA1ICkgKTtcblxuXHR2YXIgY29tYmluYXRpb25zID0gb25lV29yZENvbWJpbmF0aW9ucy5jb25jYXQoXG5cdFx0dHdvV29yZENvbWJpbmF0aW9ucyxcblx0XHR0aHJlZVdvcmRDb21iaW5hdGlvbnMsXG5cdFx0Zm91cldvcmRDb21iaW5hdGlvbnMsXG5cdFx0Zml2ZVdvcmRDb21iaW5hdGlvbnNcblx0KTtcblxuXHRjb21iaW5hdGlvbnMgPSBmaWx0ZXJGdW5jdGlvbldvcmRzKCBjb21iaW5hdGlvbnMsIHNwZWNpYWxDaGFyYWN0ZXJzICk7XG5cdGNvbWJpbmF0aW9ucyA9IGZpbHRlckZ1bmN0aW9uV29yZHMoIGNvbWJpbmF0aW9ucywgZnVuY3Rpb25Xb3JkcygpLmFydGljbGVzICk7XG5cdGNvbWJpbmF0aW9ucyA9IGZpbHRlckZ1bmN0aW9uV29yZHMoIGNvbWJpbmF0aW9ucywgZnVuY3Rpb25Xb3JkcygpLnBlcnNvbmFsUHJvbm91bnMgKTtcblx0Y29tYmluYXRpb25zID0gZmlsdGVyRnVuY3Rpb25Xb3JkcyggY29tYmluYXRpb25zLCBmdW5jdGlvbldvcmRzKCkucHJlcG9zaXRpb25zICk7XG5cdGNvbWJpbmF0aW9ucyA9IGZpbHRlckZ1bmN0aW9uV29yZHMoIGNvbWJpbmF0aW9ucywgZnVuY3Rpb25Xb3JkcygpLmNvbmp1bmN0aW9ucyApO1xuXHRjb21iaW5hdGlvbnMgPSBmaWx0ZXJGdW5jdGlvbldvcmRzKCBjb21iaW5hdGlvbnMsIGZ1bmN0aW9uV29yZHMoKS5xdWFudGlmaWVycyApO1xuXHRjb21iaW5hdGlvbnMgPSBmaWx0ZXJGdW5jdGlvbldvcmRzKCBjb21iaW5hdGlvbnMsIGZ1bmN0aW9uV29yZHMoKS5kZW1vbnN0cmF0aXZlUHJvbm91bnMgKTtcblx0Y29tYmluYXRpb25zID0gZmlsdGVyRnVuY3Rpb25Xb3Jkc0F0QmVnaW5uaW5nKCBjb21iaW5hdGlvbnMsIGZ1bmN0aW9uV29yZHMoKS5maWx0ZXJlZFBhc3NpdmVBdXhpbGlhcmllcyApO1xuXHRjb21iaW5hdGlvbnMgPSBmaWx0ZXJGdW5jdGlvbldvcmRzQXRFbmRpbmcoIGNvbWJpbmF0aW9ucywgZnVuY3Rpb25Xb3JkcygpLnZlcmJzICk7XG5cdGNvbWJpbmF0aW9ucyA9IGZpbHRlckZ1bmN0aW9uV29yZHNBdEVuZGluZyggY29tYmluYXRpb25zLCBmdW5jdGlvbldvcmRzKCkucmVsYXRpdmVQcm9ub3VucyApO1xuXHRjb21iaW5hdGlvbnMgPSBmaWx0ZXJPblN5bGxhYmxlQ291bnQoIGNvbWJpbmF0aW9ucywgMSApO1xuXG5cblx0Zm9yRWFjaCggY29tYmluYXRpb25zLCBmdW5jdGlvbiggY29tYmluYXRpb24gKSB7XG5cdFx0Y29tYmluYXRpb24uc2V0UmVsZXZhbnRXb3Jkcyggb25lV29yZFJlbGV2YW5jZU1hcCApO1xuXHR9ICk7XG5cblx0Y29tYmluYXRpb25zID0gZ2V0UmVsZXZhbnRDb21iaW5hdGlvbnMoIGNvbWJpbmF0aW9ucywgd29yZENvdW50ICk7XG5cdHNvcnRDb21iaW5hdGlvbnMoIGNvbWJpbmF0aW9ucyApO1xuXG5cdGlmICggd29yZENvdW50ID49IHdvcmRDb3VudExvd2VyTGltaXQgKSB7XG5cdFx0Y29tYmluYXRpb25zID0gZmlsdGVyT25EZW5zaXR5KCBjb21iaW5hdGlvbnMsIHdvcmRDb3VudCwgZGVuc2l0eUxvd2VyTGltaXQsIGRlbnNpdHlVcHBlckxpbWl0ICk7XG5cdH1cblxuXHRyZXR1cm4gdGFrZSggY29tYmluYXRpb25zLCByZWxldmFudFdvcmRMaW1pdCApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Z2V0V29yZENvbWJpbmF0aW9uczogZ2V0V29yZENvbWJpbmF0aW9ucyxcblx0Z2V0UmVsZXZhbnRXb3JkczogZ2V0UmVsZXZhbnRXb3Jkcyxcblx0Y2FsY3VsYXRlT2NjdXJyZW5jZXM6IGNhbGN1bGF0ZU9jY3VycmVuY2VzLFxuXHRnZXRSZWxldmFudENvbWJpbmF0aW9uczogZ2V0UmVsZXZhbnRDb21iaW5hdGlvbnMsXG5cdHNvcnRDb21iaW5hdGlvbnM6IHNvcnRDb21iaW5hdGlvbnMsXG5cdGZpbHRlckZ1bmN0aW9uV29yZHNBdEJlZ2lubmluZzogZmlsdGVyRnVuY3Rpb25Xb3Jkc0F0QmVnaW5uaW5nLFxuXHRmaWx0ZXJGdW5jdGlvbldvcmRzOiBmaWx0ZXJGdW5jdGlvbldvcmRzLFxuXHRmaWx0ZXJTcGVjaWFsQ2hhcmFjdGVyczogZmlsdGVyU3BlY2lhbENoYXJhY3RlcnMsXG5cdGZpbHRlck9uU3lsbGFibGVDb3VudDogZmlsdGVyT25TeWxsYWJsZUNvdW50LFxuXHRmaWx0ZXJPbkRlbnNpdHk6IGZpbHRlck9uRGVuc2l0eSxcbn07XG4iLCIvLyBSZXBsYWNlIGFsbCBvdGhlciBwdW5jdHVhdGlvbiBjaGFyYWN0ZXJzIGF0IHRoZSBiZWdpbm5pbmcgb3IgYXQgdGhlIGVuZCBvZiBhIHdvcmQuXG52YXIgcHVuY3R1YXRpb25SZWdleFN0cmluZyA9IFwiW1xcXFzigJNcXFxcLVxcXFwoXFxcXClfXFxcXFtcXFxcXeKAmeKAnOKAnVxcXCInLj8hOjsswr/CocKrwrtcXHUyMDE0XFx1MDBkN1xcdTAwMmJcXHUwMDI2XStcIjtcbnZhciBwdW5jdHVhdGlvblJlZ2V4U3RhcnQgPSBuZXcgUmVnRXhwKCBcIl5cIiArIHB1bmN0dWF0aW9uUmVnZXhTdHJpbmcgKTtcbnZhciBwdW5jdHVhdGlvblJlZ2V4RW5kID0gbmV3IFJlZ0V4cCggcHVuY3R1YXRpb25SZWdleFN0cmluZyArIFwiJFwiICk7XG5cbi8qKlxuICogUmVwbGFjZXMgcHVuY3R1YXRpb24gY2hhcmFjdGVycyBmcm9tIHRoZSBnaXZlbiB0ZXh0IHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byByZW1vdmUgdGhlIHB1bmN0dWF0aW9uIGNoYXJhY3RlcnMgZm9yLlxuICpcbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBzYW5pdGl6ZWQgdGV4dC5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdGV4dCApIHtcblx0dGV4dCA9IHRleHQucmVwbGFjZSggcHVuY3R1YXRpb25SZWdleFN0YXJ0LCBcIlwiICk7XG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoIHB1bmN0dWF0aW9uUmVnZXhFbmQsIFwiXCIgKTtcblxuXHRyZXR1cm4gdGV4dDtcbn07XG4iLCIvKiogQG1vZHVsZSBzdHJpbmdQcm9jZXNzaW5nL3N0cmlwSFRNTFRhZ3MgKi9cblxudmFyIHN0cmlwU3BhY2VzID0gcmVxdWlyZSggXCIuLi9zdHJpbmdQcm9jZXNzaW5nL3N0cmlwU3BhY2VzLmpzXCIgKTtcblxudmFyIGJsb2NrRWxlbWVudHMgPSByZXF1aXJlKCBcIi4uL2hlbHBlcnMvaHRtbC5qc1wiICkuYmxvY2tFbGVtZW50cztcblxudmFyIGJsb2NrRWxlbWVudFN0YXJ0UmVnZXggPSBuZXcgUmVnRXhwKCBcIl48KFwiICsgYmxvY2tFbGVtZW50cy5qb2luKCBcInxcIiApICsgXCIpW14+XSo/PlwiLCBcImlcIiApO1xudmFyIGJsb2NrRWxlbWVudEVuZFJlZ2V4ID0gbmV3IFJlZ0V4cCggXCI8LyhcIiArIGJsb2NrRWxlbWVudHMuam9pbiggXCJ8XCIgKSArIFwiKVtePl0qPz4kXCIsIFwiaVwiICk7XG5cbi8qKlxuICogU3RyaXAgaW5jb21wbGV0ZSB0YWdzIHdpdGhpbiBhIHRleHQuIFN0cmlwcyBhbiBlbmR0YWcgYXQgdGhlIGJlZ2lubmluZyBvZiBhIHN0cmluZyBhbmQgdGhlIHN0YXJ0IHRhZyBhdCB0aGUgZW5kIG9mIGFcbiAqIHN0YXJ0IG9mIGEgc3RyaW5nLlxuICogQHBhcmFtIHtTdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gc3RyaXAgdGhlIEhUTUwtdGFncyBmcm9tIGF0IHRoZSBiZWdpbiBhbmQgZW5kLlxuICogQHJldHVybnMge1N0cmluZ30gVGhlIHRleHQgd2l0aG91dCBIVE1MLXRhZ3MgYXQgdGhlIGJlZ2luIGFuZCBlbmQuXG4gKi9cbnZhciBzdHJpcEluY29tcGxldGVUYWdzID0gZnVuY3Rpb24oIHRleHQgKSB7XG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoIC9eKDxcXC8oW14+XSspPikrL2ksIFwiXCIgKTtcblx0dGV4dCA9IHRleHQucmVwbGFjZSggLyg8KFteXFwvPl0rKT4pKyQvaSwgXCJcIiApO1xuXHRyZXR1cm4gdGV4dDtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgYmxvY2sgZWxlbWVudCB0YWdzIGF0IHRoZSBiZWdpbm5pbmcgYW5kIGVuZCBvZiBhIHN0cmluZyBhbmQgcmV0dXJucyB0aGlzIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdW5mb3JtYXR0ZWQgc3RyaW5nLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIHRleHQgd2l0aCByZW1vdmVkIEhUTUwgYmVnaW4gYW5kIGVuZCBibG9jayBlbGVtZW50c1xuICovXG52YXIgc3RyaXBCbG9ja1RhZ3NBdFN0YXJ0RW5kID0gZnVuY3Rpb24oIHRleHQgKSB7XG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoIGJsb2NrRWxlbWVudFN0YXJ0UmVnZXgsIFwiXCIgKTtcblx0dGV4dCA9IHRleHQucmVwbGFjZSggYmxvY2tFbGVtZW50RW5kUmVnZXgsIFwiXCIgKTtcblx0cmV0dXJuIHRleHQ7XG59O1xuXG4vKipcbiAqIFN0cmlwIEhUTUwtdGFncyBmcm9tIHRleHRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byBzdHJpcCB0aGUgSFRNTC10YWdzIGZyb20uXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgdGV4dCB3aXRob3V0IEhUTUwtdGFncy5cbiAqL1xudmFyIHN0cmlwRnVsbFRhZ3MgPSBmdW5jdGlvbiggdGV4dCApIHtcblx0dGV4dCA9IHRleHQucmVwbGFjZSggLyg8KFtePl0rKT4pL2lnLCBcIiBcIiApO1xuXHR0ZXh0ID0gc3RyaXBTcGFjZXMoIHRleHQgKTtcblx0cmV0dXJuIHRleHQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0c3RyaXBGdWxsVGFnczogc3RyaXBGdWxsVGFncyxcblx0c3RyaXBJbmNvbXBsZXRlVGFnczogc3RyaXBJbmNvbXBsZXRlVGFncyxcblx0c3RyaXBCbG9ja1RhZ3NBdFN0YXJ0RW5kOiBzdHJpcEJsb2NrVGFnc0F0U3RhcnRFbmQsXG59O1xuIiwiLyoqIEBtb2R1bGUgc3RyaW5nUHJvY2Vzc2luZy9zdHJpcFNwYWNlcyAqL1xuXG4vKipcbiAqIFN0cmlwIGRvdWJsZSBzcGFjZXMgZnJvbSB0ZXh0XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gc3RyaXAgc3BhY2VzIGZyb20uXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgdGV4dCB3aXRob3V0IGRvdWJsZSBzcGFjZXNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdGV4dCApIHtcblx0Ly8gUmVwbGFjZSBtdWx0aXBsZSBzcGFjZXMgd2l0aCBzaW5nbGUgc3BhY2Vcblx0dGV4dCA9IHRleHQucmVwbGFjZSggL1xcc3syLH0vZywgXCIgXCIgKTtcblxuXHQvLyBSZXBsYWNlIHNwYWNlcyBmb2xsb3dlZCBieSBwZXJpb2RzIHdpdGggb25seSB0aGUgcGVyaW9kLlxuXHR0ZXh0ID0gdGV4dC5yZXBsYWNlKCAvXFxzXFwuL2csIFwiLlwiICk7XG5cblx0Ly8gUmVtb3ZlIGZpcnN0L2xhc3QgY2hhcmFjdGVyIGlmIHNwYWNlXG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoIC9eXFxzK3xcXHMrJC9nLCBcIlwiICk7XG5cblx0cmV0dXJuIHRleHQ7XG59O1xuIiwidmFyIGlzVW5kZWZpbmVkID0gcmVxdWlyZSggXCJsb2Rhc2gvaXNVbmRlZmluZWRcIiApO1xudmFyIHBpY2sgPSByZXF1aXJlKCBcImxvZGFzaC9waWNrXCIgKTtcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgcGFydGlhbCBkZXZpYXRpb24gd2hlbiBjb3VudGluZyBzeWxsYWJsZXNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBFeHRyYSBvcHRpb25zIGFib3V0IGhvdyB0byBtYXRjaCB0aGlzIGZyYWdtZW50LlxuICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMubG9jYXRpb24gVGhlIGxvY2F0aW9uIGluIHRoZSB3b3JkIHdoZXJlIHRoaXMgZGV2aWF0aW9uIGNhbiBvY2N1ci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLndvcmQgVGhlIGFjdHVhbCBzdHJpbmcgdGhhdCBzaG91bGQgYmUgY291bnRlZCBkaWZmZXJlbnRseS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBvcHRpb25zLnN5bGxhYmxlcyBUaGUgYW1vdW50IG9mIHN5bGxhYmxlcyB0aGlzIGZyYWdtZW50IGhhcy5cbiAqIEBwYXJhbSB7c3RyaW5nW119IFtvcHRpb25zLm5vdEZvbGxvd2VkQnldIEEgbGlzdCBvZiBjaGFyYWN0ZXJzIHRoYXQgdGhpcyBmcmFnbWVudCBzaG91bGRuJ3QgYmUgZm9sbG93ZWQgd2l0aC5cbiAqIEBwYXJhbSB7c3RyaW5nW119IFtvcHRpb25zLmFsc29Gb2xsb3dlZEJ5XSBBIGxpc3Qgb2YgY2hhcmFjdGVycyB0aGF0IHRoaXMgZnJhZ21lbnQgY291bGQgYmUgZm9sbG93ZWQgd2l0aC5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gRGV2aWF0aW9uRnJhZ21lbnQoIG9wdGlvbnMgKSB7XG5cdHRoaXMuX2xvY2F0aW9uID0gb3B0aW9ucy5sb2NhdGlvbjtcblx0dGhpcy5fZnJhZ21lbnQgPSBvcHRpb25zLndvcmQ7XG5cdHRoaXMuX3N5bGxhYmxlcyA9IG9wdGlvbnMuc3lsbGFibGVzO1xuXHR0aGlzLl9yZWdleCA9IG51bGw7XG5cblx0dGhpcy5fb3B0aW9ucyA9IHBpY2soIG9wdGlvbnMsIFsgXCJub3RGb2xsb3dlZEJ5XCIsIFwiYWxzb0ZvbGxvd2VkQnlcIiBdICk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHJlZ2V4IHRoYXQgbWF0Y2hlcyB0aGlzIGZyYWdtZW50IGluc2lkZSBhIHdvcmQuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkRldmlhdGlvbkZyYWdtZW50LnByb3RvdHlwZS5jcmVhdGVSZWdleCA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgcmVnZXhTdHJpbmcgPSBcIlwiO1xuXHR2YXIgb3B0aW9ucyA9IHRoaXMuX29wdGlvbnM7XG5cblx0dmFyIGZyYWdtZW50ID0gdGhpcy5fZnJhZ21lbnQ7XG5cblx0aWYgKCAhIGlzVW5kZWZpbmVkKCBvcHRpb25zLm5vdEZvbGxvd2VkQnkgKSApIHtcblx0XHRmcmFnbWVudCArPSBcIig/IVtcIiArIG9wdGlvbnMubm90Rm9sbG93ZWRCeS5qb2luKCBcIlwiICkgKyBcIl0pXCI7XG5cdH1cblxuXHRpZiAoICEgaXNVbmRlZmluZWQoIG9wdGlvbnMuYWxzb0ZvbGxvd2VkQnkgKSApIHtcblx0XHRmcmFnbWVudCArPSBcIltcIiArIG9wdGlvbnMuYWxzb0ZvbGxvd2VkQnkuam9pbiggXCJcIiApICsgXCJdP1wiO1xuXHR9XG5cblx0c3dpdGNoICggdGhpcy5fbG9jYXRpb24gKSB7XG5cdFx0Y2FzZSBcImF0QmVnaW5uaW5nXCI6XG5cdFx0XHRyZWdleFN0cmluZyA9IFwiXlwiICsgZnJhZ21lbnQ7XG5cdFx0XHRicmVhaztcblxuXHRcdGNhc2UgXCJhdEVuZFwiOlxuXHRcdFx0cmVnZXhTdHJpbmcgPSBmcmFnbWVudCArIFwiJFwiO1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFwiYXRCZWdpbm5pbmdPckVuZFwiOlxuXHRcdFx0cmVnZXhTdHJpbmcgPSBcIiheXCIgKyBmcmFnbWVudCArIFwiKXwoXCIgKyBmcmFnbWVudCArIFwiJClcIjtcblx0XHRcdGJyZWFrO1xuXG5cdFx0ZGVmYXVsdDpcblx0XHRcdHJlZ2V4U3RyaW5nID0gZnJhZ21lbnQ7XG5cdFx0XHRicmVhaztcblx0fVxuXG5cdHRoaXMuX3JlZ2V4ID0gbmV3IFJlZ0V4cCggcmVnZXhTdHJpbmcgKTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgcmVnZXggdGhhdCBtYXRjaGVzIHRoaXMgZnJhZ21lbnQgaW5zaWRlIGEgd29yZC5cbiAqXG4gKiBAcmV0dXJucyB7UmVnRXhwfSBUaGUgcmVnZXhwIHRoYXQgbWF0Y2hlcyB0aGlzIGZyYWdtZW50LlxuICovXG5EZXZpYXRpb25GcmFnbWVudC5wcm90b3R5cGUuZ2V0UmVnZXggPSBmdW5jdGlvbigpIHtcblx0aWYgKCBudWxsID09PSB0aGlzLl9yZWdleCApIHtcblx0XHR0aGlzLmNyZWF0ZVJlZ2V4KCk7XG5cdH1cblxuXHRyZXR1cm4gdGhpcy5fcmVnZXg7XG59O1xuXG4vKipcbiAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhpcyBmcmFnbWVudCBvY2N1cnMgaW4gYSB3b3JkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB3b3JkIFRoZSB3b3JkIHRvIG1hdGNoIHRoZSBmcmFnbWVudCBpbi5cbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGlzIGZyYWdtZW50IG9jY3VycyBpbiBhIHdvcmQuXG4gKi9cbkRldmlhdGlvbkZyYWdtZW50LnByb3RvdHlwZS5vY2N1cnNJbiA9IGZ1bmN0aW9uKCB3b3JkICkge1xuXHR2YXIgcmVnZXggPSB0aGlzLmdldFJlZ2V4KCk7XG5cblx0cmV0dXJuIHJlZ2V4LnRlc3QoIHdvcmQgKTtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyB0aGlzIGZyYWdtZW50IGZyb20gdGhlIGdpdmVuIHdvcmQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHdvcmQgVGhlIHdvcmQgdG8gcmVtb3ZlIHRoaXMgZnJhZ21lbnQgZnJvbS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBtb2RpZmllZCB3b3JkLlxuICovXG5EZXZpYXRpb25GcmFnbWVudC5wcm90b3R5cGUucmVtb3ZlRnJvbSA9IGZ1bmN0aW9uKCB3b3JkICkge1xuXHQvLyBSZXBsYWNlIGJ5IGEgc3BhY2UgdG8ga2VlcCB0aGUgcmVtYWluaW5nIHBhcnRzIHNlcGFyYXRlZC5cblx0cmV0dXJuIHdvcmQucmVwbGFjZSggdGhpcy5fZnJhZ21lbnQsIFwiIFwiICk7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGFtb3VudCBvZiBzeWxsYWJsZXMgZm9yIHRoaXMgZnJhZ21lbnQuXG4gKlxuICogQHJldHVybnMge251bWJlcn0gVGhlIGFtb3VudCBvZiBzeWxsYWJsZXMgZm9yIHRoaXMgZnJhZ21lbnQuXG4gKi9cbkRldmlhdGlvbkZyYWdtZW50LnByb3RvdHlwZS5nZXRTeWxsYWJsZXMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuX3N5bGxhYmxlcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGV2aWF0aW9uRnJhZ21lbnQ7XG4iLCIvKiogQG1vZHVsZSBzdHJpbmdQcm9jZXNzaW5nL2NvdW50U3lsbGFibGVzICovXG5cbnZhciBzeWxsYWJsZU1hdGNoZXJzID0gcmVxdWlyZSggXCIuLi8uLi9jb25maWcvc3lsbGFibGVzLmpzXCIgKTtcblxudmFyIGdldFdvcmRzID0gcmVxdWlyZSggXCIuLi9nZXRXb3Jkcy5qc1wiICk7XG5cbnZhciBmb3JFYWNoID0gcmVxdWlyZSggXCJsb2Rhc2gvZm9yRWFjaFwiICk7XG52YXIgZmlsdGVyID0gcmVxdWlyZSggXCJsb2Rhc2gvZmlsdGVyXCIgKTtcbnZhciBmaW5kID0gcmVxdWlyZSggXCJsb2Rhc2gvZmluZFwiICk7XG52YXIgaXNVbmRlZmluZWQgPSByZXF1aXJlKCBcImxvZGFzaC9pc1VuZGVmaW5lZFwiICk7XG52YXIgbWFwID0gcmVxdWlyZSggXCJsb2Rhc2gvbWFwXCIgKTtcbnZhciBzdW0gPSByZXF1aXJlKCBcImxvZGFzaC9zdW1cIiApO1xudmFyIG1lbW9pemUgPSByZXF1aXJlKCBcImxvZGFzaC9tZW1vaXplXCIgKTtcbnZhciBmbGF0TWFwID0gcmVxdWlyZSggXCJsb2Rhc2gvZmxhdE1hcFwiICk7XG5cbnZhciBTeWxsYWJsZUNvdW50SXRlcmF0b3IgPSByZXF1aXJlKCBcIi4uLy4uL2hlbHBlcnMvc3lsbGFibGVDb3VudEl0ZXJhdG9yLmpzXCIgKTtcbnZhciBEZXZpYXRpb25GcmFnbWVudCA9IHJlcXVpcmUoIFwiLi9EZXZpYXRpb25GcmFnbWVudFwiICk7XG5cbi8qKlxuICogQ291bnRzIHZvd2VsIGdyb3VwcyBpbnNpZGUgYSB3b3JkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB3b3JkIEEgdGV4dCB3aXRoIHdvcmRzIHRvIGNvdW50IHN5bGxhYmxlcy5cbiAqIEBwYXJhbSB7U3RyaW5nfSBsb2NhbGUgVGhlIGxvY2FsZSB0byB1c2UgZm9yIGNvdW50aW5nIHN5bGxhYmxlcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IHRoZSBzeWxsYWJsZSBjb3VudC5cbiAqL1xudmFyIGNvdW50Vm93ZWxHcm91cHMgPSBmdW5jdGlvbiggd29yZCwgbG9jYWxlICkge1xuXHR2YXIgbnVtYmVyT2ZTeWxsYWJsZXMgPSAwO1xuXHR2YXIgdm93ZWxSZWdleCA9IG5ldyBSZWdFeHAoIFwiW15cIiArIHN5bGxhYmxlTWF0Y2hlcnMoIGxvY2FsZSApLnZvd2VscyArIFwiXVwiLCBcImlnXCIgKTtcblx0dmFyIGZvdW5kVm93ZWxzID0gd29yZC5zcGxpdCggdm93ZWxSZWdleCApO1xuXHR2YXIgZmlsdGVyZWRXb3JkcyA9IGZpbHRlciggZm91bmRWb3dlbHMsIGZ1bmN0aW9uKCB2b3dlbCApIHtcblx0XHRyZXR1cm4gdm93ZWwgIT09IFwiXCI7XG5cdH0gKTtcblx0bnVtYmVyT2ZTeWxsYWJsZXMgKz0gZmlsdGVyZWRXb3Jkcy5sZW5ndGg7XG5cblx0cmV0dXJuIG51bWJlck9mU3lsbGFibGVzO1xufTtcblxuLyoqXG4gKiBDb3VudHMgdGhlIHN5bGxhYmxlcyB1c2luZyB2b3dlbCBleGNsdXNpb25zLiBUaGVzZSBhcmUgdXNlZCBmb3IgZ3JvdXBzIG9mIHZvd2VscyB0aGF0IGFyZSBtb3JlIG9yIGxlc3NcbiAqIHRoYW4gMSBzeWxsYWJsZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gd29yZCBUaGUgd29yZCB0byBjb3VudCBzeWxsYWJsZXMgb2YuXG4gKiBAcGFyYW0ge1N0cmluZ30gbG9jYWxlIFRoZSBsb2NhbGUgdG8gdXNlIGZvciBjb3VudGluZyBzeWxsYWJsZXMuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgbnVtYmVyIG9mIHN5bGxhYmxlcyBmb3VuZCBpbiB0aGUgZ2l2ZW4gd29yZC5cbiAqL1xudmFyIGNvdW50Vm93ZWxEZXZpYXRpb25zID0gZnVuY3Rpb24oIHdvcmQsIGxvY2FsZSApIHtcblx0dmFyIHN5bGxhYmxlQ291bnRJdGVyYXRvciA9IG5ldyBTeWxsYWJsZUNvdW50SXRlcmF0b3IoIHN5bGxhYmxlTWF0Y2hlcnMoIGxvY2FsZSApICk7XG5cdHJldHVybiBzeWxsYWJsZUNvdW50SXRlcmF0b3IuY291bnRTeWxsYWJsZXMoIHdvcmQgKTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIHN5bGxhYmxlcyBmb3IgdGhlIHdvcmQgaWYgaXQgaXMgaW4gdGhlIGxpc3Qgb2YgZnVsbCB3b3JkIGRldmlhdGlvbnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHdvcmQgVGhlIHdvcmQgdG8gcmV0cmlldmUgdGhlIHN5bGxhYmxlcyBmb3IuXG4gKiBAcGFyYW0ge1N0cmluZ30gbG9jYWxlIFRoZSBsb2NhbGUgdG8gdXNlIGZvciBjb3VudGluZyBzeWxsYWJsZXMuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgbnVtYmVyIG9mIHN5bGxhYmxlcyBmb3VuZC5cbiAqL1xudmFyIGNvdW50RnVsbFdvcmREZXZpYXRpb25zID0gZnVuY3Rpb24oIHdvcmQsIGxvY2FsZSApIHtcblx0dmFyIGZ1bGxXb3JkRGV2aWF0aW9ucyA9IHN5bGxhYmxlTWF0Y2hlcnMoIGxvY2FsZSApLmRldmlhdGlvbnMud29yZHMuZnVsbDtcblxuXHR2YXIgZGV2aWF0aW9uID0gZmluZCggZnVsbFdvcmREZXZpYXRpb25zLCBmdW5jdGlvbiggZnVsbFdvcmREZXZpYXRpb24gKSB7XG5cdFx0cmV0dXJuIGZ1bGxXb3JkRGV2aWF0aW9uLndvcmQgPT09IHdvcmQ7XG5cdH0gKTtcblxuXHRpZiAoICEgaXNVbmRlZmluZWQoIGRldmlhdGlvbiApICkge1xuXHRcdHJldHVybiBkZXZpYXRpb24uc3lsbGFibGVzO1xuXHR9XG5cblx0cmV0dXJuIDA7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgZGV2aWF0aW9uIGZyYWdtZW50cyBmb3IgYSBjZXJ0YWluIGxvY2FsZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gc3lsbGFibGVDb25maWcgU3lsbGFibGUgY29uZmlnIGZvciBhIGNlcnRhaW4gbG9jYWxlLlxuICogQHJldHVybnMge0RldmlhdGlvbkZyYWdtZW50W119IEEgbGlzdCBvZiBkZXZpYXRpb24gZnJhZ21lbnRzXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZURldmlhdGlvbkZyYWdtZW50cyggc3lsbGFibGVDb25maWcgKSB7XG5cdHZhciBkZXZpYXRpb25GcmFnbWVudHMgPSBbXTtcblxuXHR2YXIgZGV2aWF0aW9ucyA9IHN5bGxhYmxlQ29uZmlnLmRldmlhdGlvbnM7XG5cblx0aWYgKCAhIGlzVW5kZWZpbmVkKCBkZXZpYXRpb25zLndvcmRzICkgJiYgISBpc1VuZGVmaW5lZCggZGV2aWF0aW9ucy53b3Jkcy5mcmFnbWVudHMgKSApIHtcblx0XHRkZXZpYXRpb25GcmFnbWVudHMgPSBmbGF0TWFwKCBkZXZpYXRpb25zLndvcmRzLmZyYWdtZW50cywgZnVuY3Rpb24oIGZyYWdtZW50cywgZnJhZ21lbnRMb2NhdGlvbiApIHtcblx0XHRcdHJldHVybiBtYXAoIGZyYWdtZW50cywgZnVuY3Rpb24oIGZyYWdtZW50ICkge1xuXHRcdFx0XHRmcmFnbWVudC5sb2NhdGlvbiA9IGZyYWdtZW50TG9jYXRpb247XG5cblx0XHRcdFx0cmV0dXJuIG5ldyBEZXZpYXRpb25GcmFnbWVudCggZnJhZ21lbnQgKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH1cblxuXHRyZXR1cm4gZGV2aWF0aW9uRnJhZ21lbnRzO1xufVxuXG52YXIgY3JlYXRlRGV2aWF0aW9uRnJhZ21lbnRzTWVtb2l6ZWQgPSBtZW1vaXplKCBjcmVhdGVEZXZpYXRpb25GcmFnbWVudHMgKTtcblxuLyoqXG4gKiBDb3VudHMgc3lsbGFibGVzIGluIHBhcnRpYWwgZXhjbHVzaW9ucy4gSWYgdGhlc2UgYXJlIGZvdW5kLCByZXR1cm5zIHRoZSBudW1iZXIgb2Ygc3lsbGFibGVzICBmb3VuZCwgYW5kIHRoZSBtb2RpZmllZCB3b3JkLlxuICogVGhlIHdvcmQgaXMgbW9kaWZpZWQgc28gdGhlIGV4Y2x1ZGVkIHBhcnQgaXNuJ3QgY291bnRlZCBieSB0aGUgbm9ybWFsIHN5bGxhYmxlIGNvdW50ZXIuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHdvcmQgVGhlIHdvcmQgdG8gY291bnQgc3lsbGFibGVzIG9mLlxuICogQHBhcmFtIHtTdHJpbmd9IGxvY2FsZSBUaGUgbG9jYWxlIHRvIHVzZSBmb3IgY291bnRpbmcgc3lsbGFibGVzLlxuICogQHJldHVybnMge29iamVjdH0gVGhlIG51bWJlciBvZiBzeWxsYWJsZXMgZm91bmQgYW5kIHRoZSBtb2RpZmllZCB3b3JkLlxuICovXG52YXIgY291bnRQYXJ0aWFsV29yZERldmlhdGlvbnMgPSBmdW5jdGlvbiggd29yZCwgbG9jYWxlICkge1xuXHR2YXIgZGV2aWF0aW9uRnJhZ21lbnRzID0gY3JlYXRlRGV2aWF0aW9uRnJhZ21lbnRzTWVtb2l6ZWQoIHN5bGxhYmxlTWF0Y2hlcnMoIGxvY2FsZSApICk7XG5cdHZhciByZW1haW5pbmdQYXJ0cyA9IHdvcmQ7XG5cdHZhciBzeWxsYWJsZUNvdW50ID0gMDtcblxuXHRmb3JFYWNoKCBkZXZpYXRpb25GcmFnbWVudHMsIGZ1bmN0aW9uKCBkZXZpYXRpb25GcmFnbWVudCApIHtcblx0XHRpZiAoIGRldmlhdGlvbkZyYWdtZW50Lm9jY3Vyc0luKCByZW1haW5pbmdQYXJ0cyApICkge1xuXHRcdFx0cmVtYWluaW5nUGFydHMgPSBkZXZpYXRpb25GcmFnbWVudC5yZW1vdmVGcm9tKCByZW1haW5pbmdQYXJ0cyApO1xuXHRcdFx0c3lsbGFibGVDb3VudCArPSBkZXZpYXRpb25GcmFnbWVudC5nZXRTeWxsYWJsZXMoKTtcblx0XHR9XG5cdH0gKTtcblxuXHRyZXR1cm4geyB3b3JkOiByZW1haW5pbmdQYXJ0cywgc3lsbGFibGVDb3VudDogc3lsbGFibGVDb3VudCB9O1xufTtcblxuLyoqXG4gKiBDb3VudCB0aGUgbnVtYmVyIG9mIHN5bGxhYmxlcyBpbiBhIHdvcmQsIHVzaW5nIHZvd2VscyBhbmQgZXhjZXB0aW9ucy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gd29yZCBUaGUgd29yZCB0byBjb3VudCB0aGUgbnVtYmVyIG9mIHN5bGxhYmxlcyBvZi5cbiAqIEBwYXJhbSB7U3RyaW5nfSBsb2NhbGUgVGhlIGxvY2FsZSB0byB1c2UgZm9yIGNvdW50aW5nIHN5bGxhYmxlcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBudW1iZXIgb2Ygc3lsbGFibGVzIGZvdW5kIGluIGEgd29yZC5cbiAqL1xudmFyIGNvdW50VXNpbmdWb3dlbHMgPSBmdW5jdGlvbiggd29yZCwgbG9jYWxlICkge1xuXHR2YXIgc3lsbGFibGVDb3VudCA9IDA7XG5cblx0c3lsbGFibGVDb3VudCArPSBjb3VudFZvd2VsR3JvdXBzKCB3b3JkLCBsb2NhbGUgKTtcblx0c3lsbGFibGVDb3VudCArPSBjb3VudFZvd2VsRGV2aWF0aW9ucyggd29yZCwgbG9jYWxlICk7XG5cblx0cmV0dXJuIHN5bGxhYmxlQ291bnQ7XG59O1xuXG4vKipcbiAqIENvdW50cyB0aGUgbnVtYmVyIG9mIHN5bGxhYmxlcyBpbiBhIHdvcmQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHdvcmQgVGhlIHdvcmQgdG8gY291bnQgc3lsbGFibGVzIG9mLlxuICogQHBhcmFtIHtzdHJpbmd9IGxvY2FsZSBUaGUgbG9jYWxlIG9mIHRoZSB3b3JkLlxuICogQHJldHVybnMge251bWJlcn0gVGhlIHN5bGxhYmxlIGNvdW50IGZvciB0aGUgd29yZC5cbiAqL1xudmFyIGNvdW50U3lsbGFibGVzSW5Xb3JkID0gZnVuY3Rpb24oIHdvcmQsIGxvY2FsZSApIHtcblx0dmFyIHN5bGxhYmxlQ291bnQgPSAwO1xuXG5cdHZhciBmdWxsV29yZEV4Y2x1c2lvbiA9IGNvdW50RnVsbFdvcmREZXZpYXRpb25zKCB3b3JkLCBsb2NhbGUgKTtcblx0aWYgKCBmdWxsV29yZEV4Y2x1c2lvbiAhPT0gMCApIHtcblx0XHRyZXR1cm4gZnVsbFdvcmRFeGNsdXNpb247XG5cdH1cblxuXHR2YXIgcGFydGlhbEV4Y2x1c2lvbnMgPSBjb3VudFBhcnRpYWxXb3JkRGV2aWF0aW9ucyggd29yZCwgbG9jYWxlICk7XG5cdHdvcmQgPSBwYXJ0aWFsRXhjbHVzaW9ucy53b3JkO1xuXHRzeWxsYWJsZUNvdW50ICs9IHBhcnRpYWxFeGNsdXNpb25zLnN5bGxhYmxlQ291bnQ7XG5cdHN5bGxhYmxlQ291bnQgKz0gY291bnRVc2luZ1Zvd2Vscyggd29yZCwgbG9jYWxlICk7XG5cblx0cmV0dXJuIHN5bGxhYmxlQ291bnQ7XG59O1xuXG4vKipcbiAqIENvdW50cyB0aGUgbnVtYmVyIG9mIHN5bGxhYmxlcyBpbiBhIHRleHQgcGVyIHdvcmQgYmFzZWQgb24gdm93ZWxzLlxuICogVXNlcyBleGNsdXNpb24gd29yZHMgZm9yIHdvcmRzIHRoYXQgY2Fubm90IGJlIG1hdGNoZWQgd2l0aCB2b3dlbCBtYXRjaGluZy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byBjb3VudCB0aGUgc3lsbGFibGVzIG9mLlxuICogQHBhcmFtIHtTdHJpbmd9IGxvY2FsZSBUaGUgbG9jYWxlIHRvIHVzZSBmb3IgY291bnRpbmcgc3lsbGFibGVzLlxuICogQHJldHVybnMge2ludH0gVGhlIHRvdGFsIG51bWJlciBvZiBzeWxsYWJsZXMgZm91bmQgaW4gdGhlIHRleHQuXG4gKi9cbnZhciBjb3VudFN5bGxhYmxlc0luVGV4dCA9IGZ1bmN0aW9uKCB0ZXh0LCBsb2NhbGUgKSB7XG5cdHRleHQgPSB0ZXh0LnRvTG9jYWxlTG93ZXJDYXNlKCk7XG5cdHZhciB3b3JkcyA9IGdldFdvcmRzKCB0ZXh0ICk7XG5cblx0dmFyIHN5bGxhYmxlQ291bnRzID0gbWFwKCB3b3JkcywgIGZ1bmN0aW9uKCB3b3JkICkge1xuXHRcdHJldHVybiBjb3VudFN5bGxhYmxlc0luV29yZCggd29yZCwgbG9jYWxlICk7XG5cdH0gKTtcblxuXHRyZXR1cm4gc3VtKCBzeWxsYWJsZUNvdW50cyApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBjb3VudFN5bGxhYmxlc0luVGV4dDtcbiIsIi8qKiBAbW9kdWxlIHN0cmluZ1Byb2Nlc3NpbmcvdW5pZnlXaGl0ZXNwYWNlICovXG5cbi8qKlxuICogUmVwbGFjZXMgYSBub24gYnJlYWtpbmcgc3BhY2Ugd2l0aCBhIG5vcm1hbCBzcGFjZVxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGhlIHN0cmluZyB0byByZXBsYWNlIHRoZSBub24gYnJlYWtpbmcgc3BhY2UgaW4uXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgdGV4dCB3aXRoIHVuaWZpZWQgc3BhY2VzLlxuICovXG52YXIgdW5pZnlOb25CcmVha2luZ1NwYWNlID0gZnVuY3Rpb24oIHRleHQgKSB7XG5cdHJldHVybiB0ZXh0LnJlcGxhY2UoIC8mbmJzcDsvZywgXCIgXCIgKTtcbn07XG5cbi8qKlxuICogUmVwbGFjZXMgYWxsIHdoaXRlc3BhY2VzIHdpdGggYSBub3JtYWwgc3BhY2VcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSBzdHJpbmcgdG8gcmVwbGFjZSB0aGUgbm9uIGJyZWFraW5nIHNwYWNlIGluLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIHRleHQgd2l0aCB1bmlmaWVkIHNwYWNlcy5cbiAqL1xudmFyIHVuaWZ5V2hpdGVTcGFjZSA9IGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHRyZXR1cm4gdGV4dC5yZXBsYWNlKCAvXFxzL2csIFwiIFwiICk7XG59O1xuXG4vKipcbiAqIENvbnZlcnRzIGFsbCB3aGl0ZXNwYWNlIHRvIHNwYWNlcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byByZXBsYWNlIHNwYWNlcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSB0ZXh0IHdpdGggdW5pZmllZCBzcGFjZXMuXG4gKi9cbnZhciB1bmlmeUFsbFNwYWNlcyA9IGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHR0ZXh0ID0gdW5pZnlOb25CcmVha2luZ1NwYWNlKCB0ZXh0ICk7XG5cdHJldHVybiB1bmlmeVdoaXRlU3BhY2UoIHRleHQgKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHR1bmlmeU5vbkJyZWFraW5nU3BhY2U6IHVuaWZ5Tm9uQnJlYWtpbmdTcGFjZSxcblx0dW5pZnlXaGl0ZVNwYWNlOiB1bmlmeVdoaXRlU3BhY2UsXG5cdHVuaWZ5QWxsU3BhY2VzOiB1bmlmeUFsbFNwYWNlcyxcbn07XG4iLCJ2YXIgZnVuY3Rpb25Xb3JkcyA9IHJlcXVpcmUoIFwiLi4vcmVzZWFyY2hlcy9lbmdsaXNoL2Z1bmN0aW9uV29yZHNcIiApKCkuYWxsO1xudmFyIGZvckVhY2ggPSByZXF1aXJlKCBcImxvZGFzaC9mb3JFYWNoXCIgKTtcbnZhciBoYXMgPSByZXF1aXJlKCBcImxvZGFzaC9oYXNcIiApO1xuXG4vKipcbiAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIGdpdmVuIHdvcmQgaXMgYSBmdW5jdGlvbiB3b3JkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB3b3JkIFRoZSB3b3JkIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoZSB3b3JkIGlzIGEgZnVuY3Rpb24gd29yZC5cbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbldvcmQoIHdvcmQgKSB7XG5cdHJldHVybiAtMSAhPT0gZnVuY3Rpb25Xb3Jkcy5pbmRleE9mKCB3b3JkLnRvTG9jYWxlTG93ZXJDYXNlKCkgKTtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgd29yZCBjb21iaW5hdGlvbiBpbiB0aGUgY29udGV4dCBvZiByZWxldmFudCB3b3Jkcy5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB3b3JkcyBUaGUgbGlzdCBvZiB3b3JkcyB0aGF0IHRoaXMgY29tYmluYXRpb24gY29uc2lzdHMgb2YuXG4gKiBAcGFyYW0ge251bWJlcn0gW29jY3VycmVuY2VzXSBUaGUgbnVtYmVyIG9mIG9jY3VycmVuY2VzLCBkZWZhdWx0cyB0byAwLlxuICovXG5mdW5jdGlvbiBXb3JkQ29tYmluYXRpb24oIHdvcmRzLCBvY2N1cnJlbmNlcyApIHtcblx0dGhpcy5fd29yZHMgPSB3b3Jkcztcblx0dGhpcy5fbGVuZ3RoID0gd29yZHMubGVuZ3RoO1xuXHR0aGlzLl9vY2N1cnJlbmNlcyA9IG9jY3VycmVuY2VzIHx8IDA7XG59XG5cbldvcmRDb21iaW5hdGlvbi5sZW5ndGhCb251cyA9IHtcblx0MjogMyxcblx0MzogNyxcblx0NDogMTIsXG5cdDU6IDE4LFxufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBiYXNlIHJlbGV2YW5jZSBiYXNlZCBvbiB0aGUgbGVuZ3RoIG9mIHRoaXMgY29tYmluYXRpb24uXG4gKlxuICogQHJldHVybnMge251bWJlcn0gVGhlIGJhc2UgcmVsZXZhbmNlIGJhc2VkIG9uIHRoZSBsZW5ndGguXG4gKi9cbldvcmRDb21iaW5hdGlvbi5wcm90b3R5cGUuZ2V0TGVuZ3RoQm9udXMgPSBmdW5jdGlvbigpIHtcblx0aWYgKCBoYXMoIFdvcmRDb21iaW5hdGlvbi5sZW5ndGhCb251cywgdGhpcy5fbGVuZ3RoICkgKSB7XG5cdFx0cmV0dXJuIFdvcmRDb21iaW5hdGlvbi5sZW5ndGhCb251c1sgdGhpcy5fbGVuZ3RoIF07XG5cdH1cblxuXHRyZXR1cm4gMDtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbGlzdCB3aXRoIHdvcmRzLlxuICpcbiAqIEByZXR1cm5zIHthcnJheX0gVGhlIGxpc3Qgd2l0aCB3b3Jkcy5cbiAqL1xuV29yZENvbWJpbmF0aW9uLnByb3RvdHlwZS5nZXRXb3JkcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5fd29yZHM7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIHdvcmQgY29tYmluYXRpb24gbGVuZ3RoLlxuICpcbiAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSB3b3JkIGNvbWJpbmF0aW9uIGxlbmd0aC5cbiAqL1xuV29yZENvbWJpbmF0aW9uLnByb3RvdHlwZS5nZXRMZW5ndGggPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuX2xlbmd0aDtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgY29tYmluYXRpb24gYXMgaXQgb2NjdXJzIGluIHRoZSB0ZXh0LlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjb21iaW5hdGlvbi5cbiAqL1xuV29yZENvbWJpbmF0aW9uLnByb3RvdHlwZS5nZXRDb21iaW5hdGlvbiA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5fd29yZHMuam9pbiggXCIgXCIgKTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgYW1vdW50IG9mIG9jY3VycmVuY2VzIG9mIHRoaXMgd29yZCBjb21iaW5hdGlvbi5cbiAqXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgYW1vdW50IG9mIG9jY3VycmVuY2VzLlxuICovXG5Xb3JkQ29tYmluYXRpb24ucHJvdG90eXBlLmdldE9jY3VycmVuY2VzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLl9vY2N1cnJlbmNlcztcbn07XG5cbi8qKlxuICogSW5jcmVtZW50cyB0aGUgb2NjdXJyZW5jZXMuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbldvcmRDb21iaW5hdGlvbi5wcm90b3R5cGUuaW5jcmVtZW50T2NjdXJyZW5jZXMgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5fb2NjdXJyZW5jZXMgKz0gMTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgcmVsZXZhbmNlIG9mIHRoZSBsZW5ndGguXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IHJlbGV2YW50V29yZFBlcmNlbnRhZ2UgVGhlIHJlbGV2YW5jZSBvZiB0aGUgd29yZHMgd2l0aGluIHRoZSBjb21iaW5hdGlvbi5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSByZWxldmFuY2UgYmFzZWQgb24gdGhlIGxlbmd0aCBhbmQgdGhlIHdvcmQgcmVsZXZhbmNlLlxuICovXG5Xb3JkQ29tYmluYXRpb24ucHJvdG90eXBlLmdldE11bHRpcGxpZXIgPSBmdW5jdGlvbiggcmVsZXZhbnRXb3JkUGVyY2VudGFnZSApIHtcblx0dmFyIGxlbmd0aEJvbnVzID0gdGhpcy5nZXRMZW5ndGhCb251cygpO1xuXG5cdC8vIFRoZSByZWxldmFuY2Ugc2NhbGVzIGxpbmVhcmx5IGZyb20gdGhlIHJlbGV2YW5jZSBvZiBvbmUgd29yZCB0byB0aGUgbWF4aW11bS5cblx0cmV0dXJuIDEgKyByZWxldmFudFdvcmRQZXJjZW50YWdlICogbGVuZ3RoQm9udXM7XG59O1xuXG4vKipcbiAqIFJldHVybnMgaWYgdGhlIGdpdmVuIHdvcmQgaXMgYSByZWxldmFudCB3b3JkIGJhc2VkIG9uIHRoZSBnaXZlbiB3b3JkIHJlbGV2YW5jZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gd29yZCBUaGUgd29yZCB0byBjaGVjayBpZiBpdCBpcyByZWxldmFudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCBpdCBpcyByZWxldmFudC5cbiAqL1xuV29yZENvbWJpbmF0aW9uLnByb3RvdHlwZS5pc1JlbGV2YW50V29yZCA9IGZ1bmN0aW9uKCB3b3JkICkge1xuXHRyZXR1cm4gaGFzKCB0aGlzLl9yZWxldmFudFdvcmRzLCB3b3JkICk7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIHJlbGV2YW5jZSBvZiB0aGUgd29yZHMgd2l0aGluIHRoaXMgY29tYmluYXRpb24uXG4gKlxuICogQHJldHVybnMge251bWJlcn0gVGhlIHBlcmNlbnRhZ2Ugb2YgcmVsZXZhbnQgd29yZHMgaW5zaWRlIHRoaXMgY29tYmluYXRpb24uXG4gKi9cbldvcmRDb21iaW5hdGlvbi5wcm90b3R5cGUuZ2V0UmVsZXZhbnRXb3JkUGVyY2VudGFnZSA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgcmVsZXZhbnRXb3JkQ291bnQgPSAwLCB3b3JkUmVsZXZhbmNlID0gMTtcblxuXHRpZiAoIHRoaXMuX2xlbmd0aCA+IDEgKSB7XG5cdFx0Zm9yRWFjaCggdGhpcy5fd29yZHMsIGZ1bmN0aW9uKCB3b3JkICkge1xuXHRcdFx0aWYgKCB0aGlzLmlzUmVsZXZhbnRXb3JkKCB3b3JkICkgKSB7XG5cdFx0XHRcdHJlbGV2YW50V29yZENvdW50ICs9IDE7XG5cdFx0XHR9XG5cdFx0fS5iaW5kKCB0aGlzICkgKTtcblxuXHRcdHdvcmRSZWxldmFuY2UgPSByZWxldmFudFdvcmRDb3VudCAvIHRoaXMuX2xlbmd0aDtcblx0fVxuXG5cdHJldHVybiB3b3JkUmVsZXZhbmNlO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSByZWxldmFuY2UgZm9yIHRoaXMgd29yZCBjb21iaW5hdGlvbi5cbiAqXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgcmVsZXZhbmNlIG9mIHRoaXMgd29yZCBjb21iaW5hdGlvbi5cbiAqL1xuV29yZENvbWJpbmF0aW9uLnByb3RvdHlwZS5nZXRSZWxldmFuY2UgPSBmdW5jdGlvbigpIHtcblx0aWYgKCB0aGlzLl93b3Jkcy5sZW5ndGggPT09IDEgJiYgaXNGdW5jdGlvbldvcmQoIHRoaXMuX3dvcmRzWyAwIF0gKSApIHtcblx0XHRyZXR1cm4gMDtcblx0fVxuXG5cdHZhciB3b3JkUmVsZXZhbmNlID0gdGhpcy5nZXRSZWxldmFudFdvcmRQZXJjZW50YWdlKCk7XG5cdGlmICggd29yZFJlbGV2YW5jZSA9PT0gMCApIHtcblx0XHRyZXR1cm4gMDtcblx0fVxuXG5cdHJldHVybiB0aGlzLmdldE11bHRpcGxpZXIoIHdvcmRSZWxldmFuY2UgKSAqIHRoaXMuX29jY3VycmVuY2VzO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSByZWxldmFuY2Ugb2Ygc2luZ2xlIHdvcmRzXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHJlbGV2YW50V29yZHMgQSBtYXBwaW5nIGZyb20gYSB3b3JkIHRvIGEgcmVsZXZhbmNlLlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbldvcmRDb21iaW5hdGlvbi5wcm90b3R5cGUuc2V0UmVsZXZhbnRXb3JkcyA9IGZ1bmN0aW9uKCByZWxldmFudFdvcmRzICkge1xuXHR0aGlzLl9yZWxldmFudFdvcmRzID0gcmVsZXZhbnRXb3Jkcztcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZGVuc2l0eSBvZiB0aGlzIGNvbWJpbmF0aW9uIHdpdGhpbiB0aGUgdGV4dC5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gd29yZENvdW50IFRoZSB3b3JkIGNvdW50IG9mIHRoZSB0ZXh0IHRoaXMgY29tYmluYXRpb24gd2FzIGZvdW5kIGluLlxuICogQHJldHVybnMge251bWJlcn0gVGhlIGRlbnNpdHkgb2YgdGhpcyBjb21iaW5hdGlvbi5cbiAqL1xuV29yZENvbWJpbmF0aW9uLnByb3RvdHlwZS5nZXREZW5zaXR5ID0gZnVuY3Rpb24oIHdvcmRDb3VudCApIHtcblx0cmV0dXJuIHRoaXMuX29jY3VycmVuY2VzIC8gd29yZENvdW50O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBXb3JkQ29tYmluYXRpb247XG4iXX0=
