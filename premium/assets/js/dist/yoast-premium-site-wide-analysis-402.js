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

},{"lodash/unescape":183}],4:[function(require,module,exports){
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

},{"./ProminentWordCache":2,"events":8,"lodash/isEqual":159}],5:[function(require,module,exports){
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

			var prominentWords = (0, _relevantWords.getRelevantWords)(content, wpseoAdminL10n.contentLocale);

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

},{"./ProminentWordCache":2,"./ProminentWordStorage":4,"events":8,"yoastseo/js/stringProcessing/relevantWords":205}],6:[function(require,module,exports){
"use strict";

var _siteWideCalculation = require("./keywordSuggestions/siteWideCalculation");

var _siteWideCalculation2 = _interopRequireDefault(_siteWideCalculation);

var _ProminentWordCache = require("./keywordSuggestions/ProminentWordCache");

var _ProminentWordCache2 = _interopRequireDefault(_ProminentWordCache);

var _ProminentWordCachePopulator = require("./keywordSuggestions/ProminentWordCachePopulator");

var _ProminentWordCachePopulator2 = _interopRequireDefault(_ProminentWordCachePopulator);

var _restApi = require("./helpers/restApi");

var _restApi2 = _interopRequireDefault(_restApi);

var _a11ySpeak = require("a11y-speak");

var _a11ySpeak2 = _interopRequireDefault(_a11ySpeak);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var settings = yoastSiteWideAnalysisData.data; /* global yoastSiteWideAnalysisData */

var progressContainer = void 0,
    completedContainer = void 0,
    infoContainer = void 0;
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
	(0, _a11ySpeak2.default)(settings.l10n.calculationCompleted);
}

/**
 * Start recalculating.
 *
 * @returns {void}
 */
function startRecalculating() {
	infoContainer.hide();
	progressContainer.show();

	(0, _a11ySpeak2.default)(settings.l10n.calculationInProgress);

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

	infoContainer = jQuery(".yoast-js-prominent-words-info");

	progressContainer = jQuery(".yoast-js-prominent-words-progress");
	progressContainer.hide();

	completedContainer = jQuery(".yoast-js-prominent-words-completed");
	completedContainer.hide();
}

jQuery(init);

},{"./helpers/restApi":1,"./keywordSuggestions/ProminentWordCache":2,"./keywordSuggestions/ProminentWordCachePopulator":3,"./keywordSuggestions/siteWideCalculation":5,"a11y-speak":7}],7:[function(require,module,exports){
var containerPolite, containerAssertive;

/**
 * Build the live regions markup.
 *
 * @param {String} ariaLive Optional. Value for the "aria-live" attribute, default "polite".
 *
 * @returns {Object} $container The ARIA live region jQuery object.
 */
var addContainer = function( ariaLive ) {
	ariaLive = ariaLive || "polite";

	var container = document.createElement( "div" );
	container.id = "a11y-speak-" + ariaLive;
	container.className = "a11y-speak-region";

	var screenReaderTextStyle = "clip: rect(1px, 1px, 1px, 1px); position: absolute; height: 1px; width: 1px; overflow: hidden;";
	container.setAttribute( "style", screenReaderTextStyle );

	container.setAttribute( "aria-live", ariaLive );
	container.setAttribute( "aria-relevant", "additions text" );
	container.setAttribute( "aria-atomic", "true" );

	document.querySelector( "body" ).appendChild( container );
	return container;
};

/**
 * Specify a function to execute when the DOM is fully loaded.
 *
 * @param {Function} callback A function to execute after the DOM is ready.
 *
 * @returns {void}
 */
var domReady = function( callback ) {
	if ( document.readyState === "complete" || ( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {
		return callback();
	}

	document.addEventListener( "DOMContentLoaded", callback );
};

/**
 * Create the live regions when the DOM is fully loaded.
 */
domReady( function() {
	containerPolite = document.getElementById( "a11y-speak-polite" );
	containerAssertive = document.getElementById( "a11y-speak-assertive" );

	if ( containerPolite === null ) {
		containerPolite = addContainer( "polite" );
	}
	if ( containerAssertive === null ) {
		containerAssertive = addContainer( "assertive" );
	}
} );

/**
 * Clear the live regions.
 */
var clear = function() {
	var regions = document.querySelectorAll( ".a11y-speak-region" );
	for ( var i = 0; i < regions.length; i++ ) {
		regions[ i ].textContent = "";
	}
};

/**
 * Update the ARIA live notification area text node.
 *
 * @param {String} message  The message to be announced by Assistive Technologies.
 * @param {String} ariaLive Optional. The politeness level for aria-live. Possible values:
 *                          polite or assertive. Default polite.
 */
var A11ySpeak = function( message, ariaLive ) {
	// Clear previous messages to allow repeated strings being read out.
	clear();

	/*
	 * Strip HTML tags (if any) from the message string. Ideally, messages should
	 * be simple strings, carefully crafted for specific use with A11ySpeak.
	 * When re-using already existing strings this will ensure simple HTML to be
	 * stripped out and replaced with a space. Browsers will collapse multiple
	 * spaces natively.
	 */
	message = message.replace( /<[^<>]+>/g, " " );

	if ( containerAssertive && "assertive" === ariaLive ) {
		containerAssertive.textContent = message;
	} else if ( containerPolite ) {
		containerPolite.textContent = message;
	}
};

module.exports = A11ySpeak;

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":87,"./_root":123}],10:[function(require,module,exports){
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

},{"./_hashClear":92,"./_hashDelete":93,"./_hashGet":94,"./_hashHas":95,"./_hashSet":96}],11:[function(require,module,exports){
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

},{"./_listCacheClear":104,"./_listCacheDelete":105,"./_listCacheGet":106,"./_listCacheHas":107,"./_listCacheSet":108}],12:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":87,"./_root":123}],13:[function(require,module,exports){
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

},{"./_mapCacheClear":109,"./_mapCacheDelete":110,"./_mapCacheGet":111,"./_mapCacheHas":112,"./_mapCacheSet":113}],14:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":87,"./_root":123}],15:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":87,"./_root":123}],16:[function(require,module,exports){
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

},{"./_MapCache":13,"./_setCacheAdd":124,"./_setCacheHas":125}],17:[function(require,module,exports){
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

},{"./_ListCache":11,"./_stackClear":129,"./_stackDelete":130,"./_stackGet":131,"./_stackHas":132,"./_stackSet":133}],18:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":123}],19:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":123}],20:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":87,"./_root":123}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{"./_baseIndexOf":43}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
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

},{"./_baseTimes":67,"./_isIndex":98,"./isArguments":153,"./isArray":154,"./isBuffer":157,"./isTypedArray":168}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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

},{}],30:[function(require,module,exports){
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

},{"./_baseAssignValue":32,"./eq":140}],31:[function(require,module,exports){
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

},{"./eq":140}],32:[function(require,module,exports){
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

},{"./_defineProperty":79}],33:[function(require,module,exports){
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

},{"./_baseForOwn":38,"./_createBaseEach":76}],34:[function(require,module,exports){
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

},{"./_baseEach":33}],35:[function(require,module,exports){
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

},{}],36:[function(require,module,exports){
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

},{"./_arrayPush":28,"./_isFlattenable":97}],37:[function(require,module,exports){
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

},{"./_createBaseFor":77}],38:[function(require,module,exports){
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

},{"./_baseFor":37,"./keys":170}],39:[function(require,module,exports){
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

},{"./_castPath":74,"./_toKey":136}],40:[function(require,module,exports){
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

},{"./_Symbol":18,"./_getRawTag":88,"./_objectToString":120}],41:[function(require,module,exports){
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

},{}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
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

},{"./_baseFindIndex":35,"./_baseIsNaN":49,"./_strictIndexOf":134}],44:[function(require,module,exports){
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

},{"./_SetCache":16,"./_arrayIncludes":24,"./_arrayIncludesWith":25,"./_arrayMap":27,"./_baseUnary":69,"./_cacheHas":71}],45:[function(require,module,exports){
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

},{"./_baseGetTag":40,"./isObjectLike":165}],46:[function(require,module,exports){
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

},{"./_baseIsEqualDeep":47,"./isObject":164,"./isObjectLike":165}],47:[function(require,module,exports){
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

},{"./_Stack":17,"./_equalArrays":80,"./_equalByTag":81,"./_equalObjects":82,"./_getTag":89,"./isArray":154,"./isBuffer":157,"./isTypedArray":168}],48:[function(require,module,exports){
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

},{"./_Stack":17,"./_baseIsEqual":46}],49:[function(require,module,exports){
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

},{}],50:[function(require,module,exports){
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

},{"./_isMasked":101,"./_toSource":137,"./isFunction":160,"./isObject":164}],51:[function(require,module,exports){
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

},{"./_baseGetTag":40,"./isLength":161,"./isObjectLike":165}],52:[function(require,module,exports){
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

},{"./_baseMatches":55,"./_baseMatchesProperty":56,"./identity":150,"./isArray":154,"./property":175}],53:[function(require,module,exports){
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

},{"./_isPrototype":102,"./_nativeKeys":118}],54:[function(require,module,exports){
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

},{"./_baseEach":33,"./isArrayLike":155}],55:[function(require,module,exports){
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

},{"./_baseIsMatch":48,"./_getMatchData":86,"./_matchesStrictComparable":115}],56:[function(require,module,exports){
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

},{"./_baseIsEqual":46,"./_isKey":99,"./_isStrictComparable":103,"./_matchesStrictComparable":115,"./_toKey":136,"./get":147,"./hasIn":149}],57:[function(require,module,exports){
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

},{"./_basePickBy":58,"./hasIn":149}],58:[function(require,module,exports){
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

},{"./_baseGet":39,"./_baseSet":63,"./_castPath":74}],59:[function(require,module,exports){
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

},{}],60:[function(require,module,exports){
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

},{"./_baseGet":39}],61:[function(require,module,exports){
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

},{}],62:[function(require,module,exports){
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

},{"./_overRest":122,"./_setToString":127,"./identity":150}],63:[function(require,module,exports){
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

},{"./_assignValue":30,"./_castPath":74,"./_isIndex":98,"./_toKey":136,"./isObject":164}],64:[function(require,module,exports){
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

},{"./_defineProperty":79,"./constant":139,"./identity":150}],65:[function(require,module,exports){
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

},{}],66:[function(require,module,exports){
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

},{}],67:[function(require,module,exports){
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

},{}],68:[function(require,module,exports){
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

},{"./_Symbol":18,"./_arrayMap":27,"./isArray":154,"./isSymbol":167}],69:[function(require,module,exports){
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

},{}],70:[function(require,module,exports){
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

},{"./_arrayMap":27}],71:[function(require,module,exports){
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

},{}],72:[function(require,module,exports){
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

},{"./isArrayLikeObject":156}],73:[function(require,module,exports){
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

},{"./identity":150}],74:[function(require,module,exports){
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

},{"./_isKey":99,"./_stringToPath":135,"./isArray":154,"./toString":182}],75:[function(require,module,exports){
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":123}],76:[function(require,module,exports){
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

},{"./isArrayLike":155}],77:[function(require,module,exports){
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

},{}],78:[function(require,module,exports){
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

},{"./_baseIteratee":52,"./isArrayLike":155,"./keys":170}],79:[function(require,module,exports){
var getNative = require('./_getNative');

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;

},{"./_getNative":87}],80:[function(require,module,exports){
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

},{"./_SetCache":16,"./_arraySome":29,"./_cacheHas":71}],81:[function(require,module,exports){
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

},{"./_Symbol":18,"./_Uint8Array":19,"./_equalArrays":80,"./_mapToArray":114,"./_setToArray":126,"./eq":140}],82:[function(require,module,exports){
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

},{"./keys":170}],83:[function(require,module,exports){
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

},{"./_overRest":122,"./_setToString":127,"./flatten":145}],84:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],85:[function(require,module,exports){
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

},{"./_isKeyable":100}],86:[function(require,module,exports){
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

},{"./_isStrictComparable":103,"./keys":170}],87:[function(require,module,exports){
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

},{"./_baseIsNative":50,"./_getValue":90}],88:[function(require,module,exports){
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

},{"./_Symbol":18}],89:[function(require,module,exports){
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

},{"./_DataView":9,"./_Map":12,"./_Promise":14,"./_Set":15,"./_WeakMap":20,"./_baseGetTag":40,"./_toSource":137}],90:[function(require,module,exports){
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

},{}],91:[function(require,module,exports){
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

},{"./_castPath":74,"./_isIndex":98,"./_toKey":136,"./isArguments":153,"./isArray":154,"./isLength":161}],92:[function(require,module,exports){
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

},{"./_nativeCreate":117}],93:[function(require,module,exports){
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

},{}],94:[function(require,module,exports){
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

},{"./_nativeCreate":117}],95:[function(require,module,exports){
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

},{"./_nativeCreate":117}],96:[function(require,module,exports){
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

},{"./_nativeCreate":117}],97:[function(require,module,exports){
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

},{"./_Symbol":18,"./isArguments":153,"./isArray":154}],98:[function(require,module,exports){
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

},{}],99:[function(require,module,exports){
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

},{"./isArray":154,"./isSymbol":167}],100:[function(require,module,exports){
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

},{}],101:[function(require,module,exports){
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

},{"./_coreJsData":75}],102:[function(require,module,exports){
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

},{}],103:[function(require,module,exports){
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

},{"./isObject":164}],104:[function(require,module,exports){
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

},{}],105:[function(require,module,exports){
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

},{"./_assocIndexOf":31}],106:[function(require,module,exports){
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

},{"./_assocIndexOf":31}],107:[function(require,module,exports){
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

},{"./_assocIndexOf":31}],108:[function(require,module,exports){
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

},{"./_assocIndexOf":31}],109:[function(require,module,exports){
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

},{"./_Hash":10,"./_ListCache":11,"./_Map":12}],110:[function(require,module,exports){
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

},{"./_getMapData":85}],111:[function(require,module,exports){
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

},{"./_getMapData":85}],112:[function(require,module,exports){
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

},{"./_getMapData":85}],113:[function(require,module,exports){
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

},{"./_getMapData":85}],114:[function(require,module,exports){
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

},{}],115:[function(require,module,exports){
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

},{}],116:[function(require,module,exports){
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

},{"./memoize":172}],117:[function(require,module,exports){
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":87}],118:[function(require,module,exports){
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":121}],119:[function(require,module,exports){
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

},{"./_freeGlobal":84}],120:[function(require,module,exports){
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

},{}],121:[function(require,module,exports){
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

},{}],122:[function(require,module,exports){
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

},{"./_apply":21}],123:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":84}],124:[function(require,module,exports){
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

},{}],125:[function(require,module,exports){
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

},{}],126:[function(require,module,exports){
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

},{}],127:[function(require,module,exports){
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

},{"./_baseSetToString":64,"./_shortOut":128}],128:[function(require,module,exports){
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

},{}],129:[function(require,module,exports){
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

},{"./_ListCache":11}],130:[function(require,module,exports){
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

},{}],131:[function(require,module,exports){
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

},{}],132:[function(require,module,exports){
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

},{}],133:[function(require,module,exports){
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

},{"./_ListCache":11,"./_Map":12,"./_MapCache":13}],134:[function(require,module,exports){
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

},{}],135:[function(require,module,exports){
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

},{"./_memoizeCapped":116}],136:[function(require,module,exports){
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

},{"./isSymbol":167}],137:[function(require,module,exports){
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

},{}],138:[function(require,module,exports){
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

},{"./_basePropertyOf":61}],139:[function(require,module,exports){
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

},{}],140:[function(require,module,exports){
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

},{}],141:[function(require,module,exports){
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

},{"./_arrayFilter":23,"./_baseFilter":34,"./_baseIteratee":52,"./isArray":154}],142:[function(require,module,exports){
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

},{"./_createFind":78,"./findIndex":143}],143:[function(require,module,exports){
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

},{"./_baseFindIndex":35,"./_baseIteratee":52,"./toInteger":180}],144:[function(require,module,exports){
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

},{"./_baseFlatten":36,"./map":171}],145:[function(require,module,exports){
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

},{"./_baseFlatten":36}],146:[function(require,module,exports){
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

},{"./_arrayEach":22,"./_baseEach":33,"./_castFunction":73,"./isArray":154}],147:[function(require,module,exports){
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

},{"./_baseGet":39}],148:[function(require,module,exports){
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

},{"./_baseHas":41,"./_hasPath":91}],149:[function(require,module,exports){
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

},{"./_baseHasIn":42,"./_hasPath":91}],150:[function(require,module,exports){
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

},{}],151:[function(require,module,exports){
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

},{"./_baseIndexOf":43,"./isArrayLike":155,"./isString":166,"./toInteger":180,"./values":184}],152:[function(require,module,exports){
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

},{"./_arrayMap":27,"./_baseIntersection":44,"./_baseRest":62,"./_castArrayLikeObject":72}],153:[function(require,module,exports){
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

},{"./_baseIsArguments":45,"./isObjectLike":165}],154:[function(require,module,exports){
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

},{}],155:[function(require,module,exports){
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

},{"./isFunction":160,"./isLength":161}],156:[function(require,module,exports){
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

},{"./isArrayLike":155,"./isObjectLike":165}],157:[function(require,module,exports){
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

},{"./_root":123,"./stubFalse":176}],158:[function(require,module,exports){
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

},{"./_baseKeys":53,"./_getTag":89,"./_isPrototype":102,"./isArguments":153,"./isArray":154,"./isArrayLike":155,"./isBuffer":157,"./isTypedArray":168}],159:[function(require,module,exports){
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

},{"./_baseIsEqual":46}],160:[function(require,module,exports){
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

},{"./_baseGetTag":40,"./isObject":164}],161:[function(require,module,exports){
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

},{}],162:[function(require,module,exports){
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

},{"./isNumber":163}],163:[function(require,module,exports){
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

},{"./_baseGetTag":40,"./isObjectLike":165}],164:[function(require,module,exports){
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

},{}],165:[function(require,module,exports){
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

},{}],166:[function(require,module,exports){
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

},{"./_baseGetTag":40,"./isArray":154,"./isObjectLike":165}],167:[function(require,module,exports){
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

},{"./_baseGetTag":40,"./isObjectLike":165}],168:[function(require,module,exports){
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

},{"./_baseIsTypedArray":51,"./_baseUnary":69,"./_nodeUtil":119}],169:[function(require,module,exports){
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

},{}],170:[function(require,module,exports){
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

},{"./_arrayLikeKeys":26,"./_baseKeys":53,"./isArrayLike":155}],171:[function(require,module,exports){
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

},{"./_arrayMap":27,"./_baseIteratee":52,"./_baseMap":54,"./isArray":154}],172:[function(require,module,exports){
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

},{"./_MapCache":13}],173:[function(require,module,exports){
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

},{}],174:[function(require,module,exports){
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

},{"./_basePick":57,"./_flatRest":83}],175:[function(require,module,exports){
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

},{"./_baseProperty":59,"./_basePropertyDeep":60,"./_isKey":99,"./_toKey":136}],176:[function(require,module,exports){
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

},{}],177:[function(require,module,exports){
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

},{"./_baseSum":66,"./identity":150}],178:[function(require,module,exports){
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

},{"./_baseSlice":65,"./toInteger":180}],179:[function(require,module,exports){
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

},{"./toNumber":181}],180:[function(require,module,exports){
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

},{"./toFinite":179}],181:[function(require,module,exports){
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

},{"./isObject":164,"./isSymbol":167}],182:[function(require,module,exports){
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

},{"./_baseToString":68}],183:[function(require,module,exports){
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

},{"./_unescapeHtmlChar":138,"./toString":182}],184:[function(require,module,exports){
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

},{"./_baseValues":70,"./keys":170}],185:[function(require,module,exports){
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

},{}],186:[function(require,module,exports){
"use strict";

/** @module config/syllables */

var getLanguage = require("../helpers/getLanguage.js");
var isUndefined = require("lodash/isUndefined");

var de = require("./syllables/de.json");
var en = require('./syllables/en.json');
var nl = require('./syllables/nl.json');

module.exports = function (locale) {
	if (isUndefined(locale)) {
		locale = "en_US";
	}

	switch (getLanguage(locale)) {
		case "de":
			return de;
		case "nl":
			return nl;
		case "en":
		default:
			return en;
	}
};

},{"../helpers/getLanguage.js":190,"./syllables/de.json":187,"./syllables/en.json":188,"./syllables/nl.json":189,"lodash/isUndefined":169}],187:[function(require,module,exports){
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

},{}],188:[function(require,module,exports){
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

},{}],189:[function(require,module,exports){
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

},{}],190:[function(require,module,exports){
"use strict";

/**
 * The function getting the language part of the locale.
 *
 * @param {string} locale The locale.
 * @returns {string} The language part of the locale.
 */
module.exports = function (locale) {
  return locale.split("_")[0];
};

},{}],191:[function(require,module,exports){
"use strict";

var blockElements = ["address", "article", "aside", "blockquote", "canvas", "dd", "div", "dl", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "li", "main", "nav", "noscript", "ol", "output", "p", "pre", "section", "table", "tfoot", "ul", "video"];
var inlineElements = ["b", "big", "i", "small", "tt", "abbr", "acronym", "cite", "code", "dfn", "em", "kbd", "strong", "samp", "time", "var", "a", "bdo", "br", "img", "map", "object", "q", "script", "span", "sub", "sup", "button", "input", "label", "select", "textarea"];

var blockElementsRegex = new RegExp("^(" + blockElements.join("|") + ")$", "i");
var inlineElementsRegex = new RegExp("^(" + inlineElements.join("|") + ")$", "i");

var blockElementStartRegex = new RegExp("^<(" + blockElements.join("|") + ")[^>]*?>$", "i");
var blockElementEndRegex = new RegExp("^</(" + blockElements.join("|") + ")[^>]*?>$", "i");

var inlineElementStartRegex = new RegExp("^<(" + inlineElements.join("|") + ")[^>]*>$", "i");
var inlineElementEndRegex = new RegExp("^</(" + inlineElements.join("|") + ")[^>]*>$", "i");

var otherElementStartRegex = /^<([^>\s\/]+)[^>]*>$/;
var otherElementEndRegex = /^<\/([^>\s]+)[^>]*>$/;

var contentRegex = /^[^<]+$/;
var greaterThanContentRegex = /^<[^><]*$/;

var commentRegex = /<!--(.|[\r\n])*?-->/g;

var core = require("tokenizer2/core");
var forEach = require("lodash/forEach");
var memoize = require("lodash/memoize");

var tokens = [];
var htmlBlockTokenizer;

/**
 * Creates a tokenizer to tokenize HTML into blocks.
 *
 * @returns {void}
 */
function createTokenizer() {
	tokens = [];

	htmlBlockTokenizer = core(function (token) {
		tokens.push(token);
	});

	htmlBlockTokenizer.addRule(contentRegex, "content");
	htmlBlockTokenizer.addRule(greaterThanContentRegex, "greater-than-sign-content");

	htmlBlockTokenizer.addRule(blockElementStartRegex, "block-start");
	htmlBlockTokenizer.addRule(blockElementEndRegex, "block-end");
	htmlBlockTokenizer.addRule(inlineElementStartRegex, "inline-start");
	htmlBlockTokenizer.addRule(inlineElementEndRegex, "inline-end");

	htmlBlockTokenizer.addRule(otherElementStartRegex, "other-element-start");
	htmlBlockTokenizer.addRule(otherElementEndRegex, "other-element-end");
}

/**
 * Returns whether or not the given element name is a block element.
 *
 * @param {string} htmlElementName The name of the HTML element.
 * @returns {boolean} Whether or not it is a block element.
 */
function isBlockElement(htmlElementName) {
	return blockElementsRegex.test(htmlElementName);
}

/**
 * Returns whether or not the given element name is an inline element.
 *
 * @param {string} htmlElementName The name of the HTML element.
 * @returns {boolean} Whether or not it is an inline element.
 */
function isInlineElement(htmlElementName) {
	return inlineElementsRegex.test(htmlElementName);
}

/**
 * Splits a text into blocks based on HTML block elements.
 *
 * @param {string} text The text to split.
 * @returns {Array} A list of blocks based on HTML block elements.
 */
function getBlocks(text) {
	var blocks = [],
	    depth = 0,
	    blockStartTag = "",
	    currentBlock = "",
	    blockEndTag = "";

	// Remove all comments because it is very hard to tokenize them.
	text = text.replace(commentRegex, "");

	createTokenizer();
	htmlBlockTokenizer.onText(text);

	htmlBlockTokenizer.end();

	forEach(tokens, function (token, i) {
		var nextToken = tokens[i + 1];

		switch (token.type) {

			case "content":
			case "greater-than-sign-content":
			case "inline-start":
			case "inline-end":
			case "other-tag":
			case "other-element-start":
			case "other-element-end":
			case "greater than sign":
				if (!nextToken || depth === 0 && (nextToken.type === "block-start" || nextToken.type === "block-end")) {
					currentBlock += token.src;

					blocks.push(currentBlock);
					blockStartTag = "";
					currentBlock = "";
					blockEndTag = "";
				} else {
					currentBlock += token.src;
				}
				break;

			case "block-start":
				if (depth !== 0) {
					if (currentBlock.trim() !== "") {
						blocks.push(currentBlock);
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
				if ("" !== blockStartTag && "" !== blockEndTag) {
					blocks.push(blockStartTag + currentBlock + blockEndTag);
				} else if ("" !== currentBlock.trim()) {
					blocks.push(currentBlock);
				}
				blockStartTag = "";
				currentBlock = "";
				blockEndTag = "";
				break;
		}

		// Handles HTML with too many closing tags.
		if (depth < 0) {
			depth = 0;
		}
	});

	return blocks;
}

module.exports = {
	blockElements: blockElements,
	inlineElements: inlineElements,
	isBlockElement: isBlockElement,
	isInlineElement: isInlineElement,
	getBlocks: memoize(getBlocks)
};

},{"lodash/forEach":146,"lodash/memoize":172,"tokenizer2/core":185}],192:[function(require,module,exports){
"use strict";

var SyllableCountStep = require("./syllableCountStep.js");

var isUndefined = require("lodash/isUndefined");
var forEach = require("lodash/forEach");

/**
 * Creates a syllable count iterator.
 *
 * @param {object} config The config object containing an array with syllable exclusions.
 * @constructor
 */
var SyllableCountIterator = function SyllableCountIterator(config) {
  this.countSteps = [];
  if (!isUndefined(config)) {
    this.createSyllableCountSteps(config.deviations.vowels);
  }
};

/**
 * Creates a syllable count step object for each exclusion.
 *
 * @param {object} syllableCounts The object containing all exclusion syllables including the multipliers.
 * @returns {void}
 */
SyllableCountIterator.prototype.createSyllableCountSteps = function (syllableCounts) {
  forEach(syllableCounts, function (syllableCountStep) {
    this.countSteps.push(new SyllableCountStep(syllableCountStep));
  }.bind(this));
};

/**
 * Returns all available count steps.
 *
 * @returns {Array} All available count steps.
 */
SyllableCountIterator.prototype.getAvailableSyllableCountSteps = function () {
  return this.countSteps;
};

/**
 * Counts the syllables for all the steps and returns the total syllable count.
 *
 * @param {String} word The word to count syllables in.
 * @returns {number} The number of syllables found based on exclusions.
 */
SyllableCountIterator.prototype.countSyllables = function (word) {
  var syllableCount = 0;
  forEach(this.countSteps, function (step) {
    syllableCount += step.countSyllables(word);
  });
  return syllableCount;
};

module.exports = SyllableCountIterator;

},{"./syllableCountStep.js":193,"lodash/forEach":146,"lodash/isUndefined":169}],193:[function(require,module,exports){
"use strict";

var isUndefined = require("lodash/isUndefined");

var arrayToRegex = require("../stringProcessing/createRegexFromArray.js");

/**
 * Constructs a language syllable regex that contains a regex for matching syllable exclusion.
 *
 * @param {object} syllableRegex The object containing the syllable exclusions.
 * @constructor
 */
var SyllableCountStep = function SyllableCountStep(syllableRegex) {
  this._hasRegex = false;
  this._regex = "";
  this._multiplier = "";
  this.createRegex(syllableRegex);
};

/**
 * Returns if a valid regex has been set.
 *
 * @returns {boolean} True if a regex has been set, false if not.
 */
SyllableCountStep.prototype.hasRegex = function () {
  return this._hasRegex;
};

/**
 * Creates a regex based on the given syllable exclusions, and sets the multiplier to use.
 *
 * @param {object} syllableRegex The object containing the syllable exclusions and multiplier.
 * @returns {void}
 */
SyllableCountStep.prototype.createRegex = function (syllableRegex) {
  if (!isUndefined(syllableRegex) && !isUndefined(syllableRegex.fragments)) {
    this._hasRegex = true;
    this._regex = arrayToRegex(syllableRegex.fragments, true);
    this._multiplier = syllableRegex.countModifier;
  }
};

/**
 * Returns the stored regular expression.
 *
 * @returns {RegExp} The stored regular expression.
 */
SyllableCountStep.prototype.getRegex = function () {
  return this._regex;
};

/**
 * Matches syllable exclusions in a given word and the returns the number found multiplied with the
 * given multiplier.
 *
 * @param {String} word The word to match for syllable exclusions.
 * @returns {number} The amount of syllables found.
 */
SyllableCountStep.prototype.countSyllables = function (word) {
  if (this._hasRegex) {
    var match = word.match(this._regex) || [];
    return match.length * this._multiplier;
  }
  return 0;
};

module.exports = SyllableCountStep;

},{"../stringProcessing/createRegexFromArray.js":201,"lodash/isUndefined":169}],194:[function(require,module,exports){
"use strict";

var filteredPassiveAuxiliaries = require("./passivevoice/auxiliaries.js")().filteredAuxiliaries;
var notFilteredPassiveAuxiliaries = require("./passivevoice/auxiliaries.js")().notFilteredAuxiliaries;
var transitionWords = require("./transitionWords.js")().singleWords;

/**
 * Returns an array with exceptions for the keyword suggestion researcher.
 * @returns {Array} The array filled with exceptions.
 */

var articles = ["the", "an", "a"];
var numerals = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth", "twentieth", "hundred", "hundreds", "thousand", "thousands", "million", "million", "billion", "billions"];
var personalPronounsNominative = ["i", "you", "he", "she", "it", "we", "they"];
var personalPronounsAccusative = ["me", "him", "her", "us", "them"];
var demonstrativePronouns = ["this", "that", "these", "those"];
var possessivePronouns = ["my", "your", "his", "her", "its", "their", "our", "mine", "yours", "hers", "theirs", "ours"];
var quantifiers = ["all", "some", "many", "few", "lot", "lots", "tons", "bit", "no", "every", "enough", "little", "less", "much", "more", "most", "plenty", "several", "few", "fewer", "many", "kind"];
var reflexivePronouns = ["myself", "yourself", "himself", "herself", "itself", "oneself", "ourselves", "yourselves", "themselves"];
var indefinitePronouns = ["none", "nobody", "everyone", "everybody", "someone", "somebody", "anyone", "anybody", "nothing", "everything", "something", "anything", "each", "another", "other", "whatever", "whichever", "whoever", "whomever", "whomsoever", "whosoever", "others", "neither", "both", "either", "any", "such"];
var indefinitePronounsPossessive = ["one's", "nobody's", "everyone's", "everybody's", "someone's", "somebody's", "anyone's", "anybody's", "nothing's", "everything's", "something's", "anything's", "whoever's", "others'", "other's", "another's", "neither's", "either's"];

var interrogativeDeterminers = ["which", "what", "whose"];
var interrogativePronouns = ["who", "whom"];
var interrogativeProAdverbs = ["where", "whither", "whence", "how", "why", "whether", "wherever", "whomever", "whenever", "however", "whyever", "whoever", "whatever", "wheresoever", "whomsoever", "whensoever", "howsoever", "whysoever", "whosoever", "whatsoever", "whereso", "whomso", "whenso", "howso", "whyso", "whoso", "whatso"];
var pronominalAdverbs = ["therefor", "therein", "hereby", "hereto", "wherein", "therewith", "herewith", "wherewith", "thereby"];
var locativeAdverbs = ["there", "here", "whither", "thither", "hither", "whence", "thence", "hence"];
var adverbialGenitives = ["always", "afterwards", "towards", "once", "twice", "thrice", "amidst", "amongst", "midst", "whilst"];
var otherAuxiliaries = ["can", "cannot", "can't", "could", "couldn't", "could've", "dare", "dares", "dared", "daring", "do", "don't", "does", "doesn't", "did", "didn't", "doing", "done", "have", "haven't", "had", "hadn't", "has", "hasn't", "having", "i've", "you've", "we've", "they've", "i'd", "you'd", "he'd", "she'd", "it'd", "we'd", "they'd", "would", "wouldn't", "would've", "may", "might", "must", "need", "needn't", "needs", "ought", "shall", "shalln't", "shan't", "should", "shouldn't", "will", "won't", "i'll", "you'll", "he'll", "she'll", "it'll", "we'll", "they'll", "there's", "there're", "there'll", "here's", "here're", "there'll"];
var copula = ["appear", "appears", "appearing", "appeared", "become", "becomes", "becoming", "became", "come", "comes", "coming", "came", "keep", "keeps", "kept", "keeping", "remain", "remains", "remaining", "remained", "stay", "stays", "stayed", "staying", "turn", "turns", "turned"];

var prepositions = ["in", "from", "with", "under", "throughout", "atop", "for", "on", "until", "of", "to", "aboard", "about", "above", "abreast", "absent", "across", "adjacent", "after", "against", "along", "alongside", "amid", "midst", "mid", "among", "apropos", "apud", "around", "as", "astride", "at", "ontop", "before", "afore", "tofore", "behind", "ahind", "below", "ablow", "beneath", "neath", "beside", "besides", "between", "atween", "beyond", "ayond", "but", "by", "chez", "circa", "come", "despite", "spite", "down", "during", "except", "into", "less", "like", "minus", "near", "nearer", "nearest", "anear", "notwithstanding", "off", "onto", "opposite", "out", "outen", "over", "past", "per", "pre", "qua", "sans", "sauf", "since", "sithence", "than", "through", "thru", "truout", "toward", "underneath", "unlike", "until", "up", "upon", "upside", "versus", "via", "vis-à-vis", "without", "ago", "apart", "aside", "aslant", "away", "withal"];

// Many prepositional adverbs are already listed as preposition.
var prepositionalAdverbs = ["back", "within", "forward", "backward", "ahead"];

var coordinatingConjunctions = ["so", "and", "nor", "but", "or", "yet", "for"];

// 'Rather' is part of 'rather...than', 'sooner' is part of 'no sooner...than', 'just' is part of 'just as...so',
// 'Only' is part of 'not only...but also'.
var correlativeConjunctions = ["rather", "sooner", "just", "only"];
var subordinatingConjunctions = ["after", "although", "when", "as", "if", "though", "because", "before", "even", "since", "unless", "whereas", "while"];

// These verbs are frequently used in interviews to indicate questions and answers.
// 'Claim','claims', 'state' and 'states' are not included, because these words are also nouns.
var interviewVerbs = ["say", "says", "said", "saying", "claimed", "ask", "asks", "asked", "asking", "stated", "stating", "explain", "explains", "explained", "think", "thinks"];

// These transition words were not included in the list for the transition word assessment for various reasons.
var additionalTransitionWords = ["and", "or", "about", "absolutely", "again", "definitely", "eternally", "expressively", "expressly", "extremely", "immediately", "including", "instantly", "namely", "naturally", "next", "notably", "now", "nowadays", "ordinarily", "positively", "truly", "ultimately", "uniquely", "usually", "almost", "first", "second", "third", "maybe", "probably", "granted", "initially", "overall", "too", "actually", "already", "e.g", "i.e", "often", "regularly", "simply", "optionally", "perhaps", "sometimes", "likely", "never", "ever", "else", "inasmuch", "provided", "currently", "incidentally", "elsewhere", "following", "particular", "recently", "relatively", "f.i", "clearly", "apparently"];

var intensifiers = ["highly", "very", "really", "extremely", "absolutely", "completely", "totally", "utterly", "quite", "somewhat", "seriously", "fairly", "fully", "amazingly"];

// These verbs convey little meaning. 'Show', 'shows', 'uses', "meaning" are not included, because these words could be relevant nouns.
var delexicalisedVerbs = ["seem", "seems", "seemed", "seeming", "let", "let's", "lets", "letting", "make", "making", "makes", "made", "want", "showing", "showed", "shown", "go", "goes", "going", "went", "gone", "take", "takes", "took", "taken", "set", "sets", "setting", "put", "puts", "putting", "use", "using", "used", "try", "tries", "tried", "trying", "mean", "means", "meant", "called", "based", "add", "adds", "adding", "added", "contain", "contains", "containing", "contained"];

// These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
// Keyword combinations containing these adjectives/adverbs are fine.
var generalAdjectivesAdverbs = ["new", "newer", "newest", "old", "older", "oldest", "previous", "good", "well", "better", "best", "big", "bigger", "biggest", "easy", "easier", "easiest", "fast", "faster", "fastest", "far", "hard", "harder", "hardest", "least", "own", "large", "larger", "largest", "long", "longer", "longest", "low", "lower", "lowest", "high", "higher", "highest", "regular", "simple", "simpler", "simplest", "small", "smaller", "smallest", "tiny", "tinier", "tiniest", "short", "shorter", "shortest", "main", "actual", "nice", "nicer", "nicest", "real", "same", "able", "certain", "usual", "so-called", "mainly", "mostly", "recent", "anymore", "complete", "lately", "possible", "commonly", "constantly", "continually", "directly", "easily", "nearly", "slightly", "somewhere", "estimated", "latest", "different", "similar", "widely", "bad", "worse", "worst", "great"];

var interjections = ["oh", "wow", "tut-tut", "tsk-tsk", "ugh", "whew", "phew", "yeah", "yea", "shh", "oops", "ouch", "aha", "yikes"];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
var recipeWords = ["tbs", "tbsp", "spk", "lb", "qt", "pk", "bu", "oz", "pt", "mod", "doz", "hr", "f.g", "ml", "dl", "cl", "l", "mg", "g", "kg", "quart"];

// 'People' should only be removed in combination with 'some', 'many' and 'few' (and is therefore not yet included in the list below).
var vagueNouns = ["thing", "things", "way", "ways", "matter", "case", "likelihood", "ones", "piece", "pieces", "stuff", "times", "part", "parts", "percent", "instance", "instances", "aspect", "aspects", "item", "items", "idea", "theme", "person"];

// 'No' is already included in the quantifier list.
var miscellaneous = ["not", "yes", "rid", "sure", "top", "bottom", "ok", "okay", "amen", "aka", "%"];

module.exports = function () {
	return {
		articles: articles,
		personalPronouns: personalPronounsNominative.concat(personalPronounsAccusative, possessivePronouns),
		prepositions: prepositions,
		demonstrativePronouns: demonstrativePronouns,
		conjunctions: coordinatingConjunctions.concat(subordinatingConjunctions),
		verbs: filteredPassiveAuxiliaries.concat(notFilteredPassiveAuxiliaries, otherAuxiliaries, copula, interviewVerbs, delexicalisedVerbs),
		quantifiers: quantifiers,
		relativePronouns: interrogativeDeterminers.concat(interrogativePronouns, interrogativeProAdverbs),
		passiveAuxiliaries: filteredPassiveAuxiliaries,
		transitionWords: transitionWords.concat(additionalTransitionWords),
		miscellaneous: miscellaneous,
		pronominalAdverbs: pronominalAdverbs,
		interjections: interjections,
		reflexivePronouns: reflexivePronouns,
		all: articles.concat(numerals, demonstrativePronouns, possessivePronouns, reflexivePronouns, personalPronounsNominative, personalPronounsAccusative, quantifiers, indefinitePronouns, indefinitePronounsPossessive, interrogativeDeterminers, interrogativePronouns, interrogativeProAdverbs, pronominalAdverbs, locativeAdverbs, adverbialGenitives, prepositionalAdverbs, filteredPassiveAuxiliaries, notFilteredPassiveAuxiliaries, otherAuxiliaries, copula, prepositions, coordinatingConjunctions, correlativeConjunctions, subordinatingConjunctions, interviewVerbs, transitionWords, additionalTransitionWords, intensifiers, delexicalisedVerbs, interjections, generalAdjectivesAdverbs, recipeWords, vagueNouns, miscellaneous)
	};
};

},{"./passivevoice/auxiliaries.js":195,"./transitionWords.js":196}],195:[function(require,module,exports){
"use strict";

// These auxiliaries are filtered from the beginning of word combinations in the prominent words.
var filteredAuxiliaries = ["am", "is", "are", "was", "were", "been", "get", "gets", "got", "gotten", "be", "she's", "he's", "it's", "i'm", "we're", "they're", "you're", "isn't", "weren't", "wasn't", "that's", "aren't"];

// These auxiliaries are not filtered from the beginning of word combinations in the prominent words.
var notFilteredAuxiliaries = ["being", "getting", "having", "what's"];

module.exports = function () {
	return {
		filteredAuxiliaries: filteredAuxiliaries,
		notFilteredAuxiliaries: notFilteredAuxiliaries,
		all: filteredAuxiliaries.concat(notFilteredAuxiliaries)
	};
};

},{}],196:[function(require,module,exports){
"use strict";

/** @module config/transitionWords */

var singleWords = ["accordingly", "additionally", "afterward", "afterwards", "albeit", "also", "although", "altogether", "another", "basically", "because", "before", "besides", "but", "certainly", "chiefly", "comparatively", "concurrently", "consequently", "contrarily", "conversely", "correspondingly", "despite", "doubtedly", "during", "e.g.", "earlier", "emphatically", "equally", "especially", "eventually", "evidently", "explicitly", "finally", "firstly", "following", "formerly", "forthwith", "fourthly", "further", "furthermore", "generally", "hence", "henceforth", "however", "i.e.", "identically", "indeed", "instead", "last", "lastly", "later", "lest", "likewise", "markedly", "meanwhile", "moreover", "nevertheless", "nonetheless", "nor", "notwithstanding", "obviously", "occasionally", "otherwise", "overall", "particularly", "presently", "previously", "rather", "regardless", "secondly", "shortly", "significantly", "similarly", "simultaneously", "since", "so", "soon", "specifically", "still", "straightaway", "subsequently", "surely", "surprisingly", "than", "then", "thereafter", "therefore", "thereupon", "thirdly", "though", "thus", "till", "too", "undeniably", "undoubtedly", "unless", "unlike", "unquestionably", "until", "when", "whenever", "whereas", "while"];
var multipleWords = ["above all", "after all", "after that", "all in all", "all of a sudden", "all things considered", "analogous to", "although this may be true", "analogous to", "another key point", "as a matter of fact", "as a result", "as an illustration", "as can be seen", "as has been noted", "as I have noted", "as I have said", "as I have shown", "as long as", "as much as", "as shown above", "as soon as", "as well as", "at any rate", "at first", "at last", "at least", "at length", "at the present time", "at the same time", "at this instant", "at this point", "at this time", "balanced against", "being that", "by all means", "by and large", "by comparison", "by the same token", "by the time", "compared to", "be that as it may", "coupled with", "different from", "due to", "equally important", "even if", "even more", "even so", "even though", "first thing to remember", "for example", "for fear that", "for instance", "for one thing", "for that reason", "for the most part", "for the purpose of", "for the same reason", "for this purpose", "for this reason", "from time to time", "given that", "given these points", "important to realize", "in a word", "in addition", "in another case", "in any case", "in any event", "in brief", "in case", "in conclusion", "in contrast", "in detail", "in due time", "in effect", "in either case", "in essence", "in fact", "in general", "in light of", "in like fashion", "in like manner", "in order that", "in order to", "in other words", "in particular", "in reality", "in short", "in similar fashion", "in spite of", "in sum", "in summary", "in that case", "in the event that", "in the final analysis", "in the first place", "in the fourth place", "in the hope that", "in the light of", "in the long run", "in the meantime", "in the same fashion", "in the same way", "in the second place", "in the third place", "in this case", "in this situation", "in time", "in truth", "in view of", "inasmuch as", "most compelling evidence", "most important", "must be remembered", "not to mention", "now that", "of course", "on account of", "on balance", "on condition that", "on one hand", "on the condition that", "on the contrary", "on the negative side", "on the other hand", "on the positive side", "on the whole", "on this occasion", "once", "once in a while", "only if", "owing to", "point often overlooked", "prior to", "provided that", "seeing that", "so as to", "so far", "so long as", "so that", "sooner or later", "such as", "summing up", "take the case of", "that is", "that is to say", "then again", "this time", "to be sure", "to begin with", "to clarify", "to conclude", "to demonstrate", "to emphasize", "to enumerate", "to explain", "to illustrate", "to list", "to point out", "to put it another way", "to put it differently", "to repeat", "to rephrase it", "to say nothing of", "to sum up", "to summarize", "to that end", "to the end that", "to this end", "together with", "under those circumstances", "until now", "up against", "up to the present time", "vis a vis", "what's more", "while it may be true", "while this may be true", "with attention to", "with the result that", "with this in mind", "with this intention", "with this purpose in mind", "without a doubt", "without delay", "without doubt", "without reservation"];

/**
 * Returns lists with transition words to be used by the assessments.
 * @returns {Object} The object with transition word lists.
 */
module.exports = function () {
	return {
		singleWords: singleWords,
		multipleWords: multipleWords,
		allWords: singleWords.concat(multipleWords)
	};
};

},{}],197:[function(require,module,exports){
"use strict";

var filteredPassiveAuxiliaries = require("./passivevoice/auxiliaries.js")().filteredAuxiliaries;
var notFilteredPassiveAuxiliaries = require("./passivevoice/auxiliaries.js")().infinitiveAuxiliaries;
var transitionWords = require("./transitionWords.js")().singleWords;

/**
 * Returns an array with exceptions for the keyword suggestion researcher.
 * @returns {Array} The array filled with exceptions.
 */

var articles = ["das", "dem", "den", "der", "des", "die", "ein", "eine", "einem", "einen", "einer", "eines"];

var numerals = ["eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf", "zwoelf", "dreizehn", "vierzehn", "fünfzehn", "fuenfzehn", "sechzehn", "siebzehn", "achtzehn", "neunzehn", "zwanzig", "erste", "erster", "ersten", "erstem", "erstes", "zweite", "zweites", "zweiter", "zweitem", "zweiten", "dritte", "dritter", "drittes", "dritten", "drittem", "vierter", "vierten", "viertem", "viertes", "vierte", "fünfte", "fünfter", "fünfted", "fünften", "fünftem", "fuenfte", "fuenfter", "fuenftem", "fuenften", "fuenftes", "sechste", "sechster", "sechstes", "sechsten", "sechstem", "siebte", "siebter", "siebten", "siebtem", "siebtes", "achte", "achter", "achten", "achtem", "achtes", "neunte", "neunter", "neuntes", "neunten", "neuntem", "zehnte", "zehnter", "zehnten", "zehntem", "zehntes", "elfte", "elfter", "elftes", "elften", "elftem", "zwölfte", "zwölfter", "zwölften", "zwölftem", "zwölftes", "zwoelfte", "zwoelfter", "zwoelften", "zwoelftem", "zwoelftes", "dreizehnte", "dreizehnter", "dreizehntes", "dreizehnten", "dreizehntem", "vierzehnte", "vierzehnter", "vierzehntes", "vierzehnten", "vierzehntem", "fünfzehnte", "fünfzehnten", "fünfzehntem", "fünfzehnter", "fünfzehntes", "fuenfzehnte", "fuenfzehnten", "fuenfzehntem", "fuenfzehnter", "fuenfzehntes", "sechzehnte", "sechzehnter", "sechzehnten", "sechzehntes", "sechzehntem", "siebzehnte", "siebzehnter", "siebzehntes", "siebzehntem", "siebzehnten", "achtzehnter", "achtzehnten", "achtzehntem", "achtzehntes", "achtzehnte", "nehnzehnte", "nehnzehnter", "nehnzehntem", "nehnzehnten", "nehnzehntes", "zwanzigste", "zwanzigster", "zwanzigstem", "zwanzigsten", "zwanzigstes", "hundert", "einhundert", "zweihundert", "zweihundert", "dreihundert", "vierhundert", "fünfhundert", "fuenfhundert", "sechshundert", "siebenhundert", "achthundert", "neunhundert", "tausend", "million", "milliarde", "billion", "billiarde"];

var personalPronounsNominative = ["ich", "du", "er", "sie", "es", "wir", "ihr", "sie"];

var personalPronounsAccusative = ["mich", "dich", "ihn", "sie", "es", "uns", "euch"];

var personalPronounsDative = ["mir", "dir", "ihm", "ihr", "uns", "euch", "ihnen"];

var demonstrativePronouns = ["denen", "deren", "derer", "dessen", "diese", "diesem", "diesen", "dieser", "dieses", "jene", "jenem", "jenen", "jener", "jenes", "welch", "welcher", "welches", "derjenige", "desjenigen", "demjenigen", "denjenigen", "diejenige", "derjenigen", "dasjenige", "diejenigen"];

var possessivePronouns = ["mein", "meine", "meinem", "meiner", "meines", "dein", "deine", "deinem", "deiner", "deines", "deinen", "sein", "seine", "seinem", "seiner", "seines", "ihr", "ihre", "ihrem", "ihren", "ihrer", "ihres", "unser", "unsere", "unserem", "unseren", "unserer", "unseres", "euer", "eure", "eurem", "euren", "eurer", "eures"];

var quantifiers = ["manche", "manch", "viele", "viel", "vieler", "vielen", "vielem", "all", "alle", "aller", "alles", "allen", "allem", "allerlei", "solcherlei", "einige", "etliche", "manch", "wenige", "weniger", "wenigen", "wenigem", "weniges", "wenig", "wenigerer", "wenigeren", "wenigerem", "wenigere", "wenigeres", "wenig", "bisschen", "paar", "kein", "keines", "keinem", "keinen", "keine", "mehr", "mehrere", "nichts", "genug", "mehrere", "mehrerer", "mehreren", "mehrerem", "mehreres", "verschiedene", "verschiedener", "verschiedenen", "verschiedenem", "verschiedenes", "verschiedne", "verschiedner", "verschiednen", "verschiednem", "verschiednes", "art", "arten", "sorte", "sorten"];

var reflexivePronouns = ["mich", "mir", "dich", "dir", "sich", "uns", "euch"];

// "Welch", "welcher", and "welches" are already included in the demonstrativePronouns.
var indefinitePronouns = ["andere", "anderer", "anderem", "anderen", "anderes", "andren", "andern", "andrem", "anderm", "andre", "andrer", "andres", "beide", "beides", "beidem", "beider", "beiden", "etwas", "irgendetwas", "irgendein", "irgendeinen", "irgendeinem", "irgendeines", "irgendeine", "irgendeiner", "irgendwas", "irgendwessen", "irgendwer", "irgendwen", "irgendwem", "irgendwessen", "irgendwelche", "irgendwelcher", "irgendwelchem", "irgendwelchen", "irgendwelches", "irgendjemand", "irgendjemanden", "irgendjemandem", "irgendjemandes", "irgendwie", "wer", "wen", "wem", "wessen", "was", "wessen", "welchen", "welchem", "welche", "jeder", "jedes", "jedem", "jeden", "jede", "jedweder", "jedweden", "jedwedem", "jedwedes", "jedwede", "jeglicher", "jeglichen", "jeglichem", "jegliches", "jegliche", "jedermann", "jedermanns", "jemand", "jemanden", "jemandem", "jemands", "jemandes", "man", "meinesgleichen", "niemanden", "niemandem", "niemands", "niemandes", "niemand", "sämtlich", "saemtlich", "sämtlicher", "saemtlicher", "sämtlichen", "saemtlichen", "sämtlichem", "saemtlichem", "sämtliches", "saemtliches", "sämtliche", "saemtliche", "solche", "solcher", "solchen", "solchem", "solches", "niemand", "niemanden", "niemandem", "niemandes", "niemands", "nichts", "jeglicher", "jeglichen", "jeglichem", "jegliches", "jegliche", "zweiter"];

var relativePronouns = ["dessen", "deren", "derer", "denen", "wes"];

var interrogativeProAdverbs = ["warum", "wie", "wo", "woher", "wohin", "wann"];

var pronominalAdverbs = ["dabei", "dadurch", "dafür", "dafuer", "dagegen", "dahinter", "damit", "danach", "daneben", "daran", "darauf", "daraus", "darin", "darum", "darunter", "darüber", "darueber", "davon", "davor", "dazu", "dazwischen", "hieran", "hierauf", "hieraus", "hierbei", "hierdurch", "hierfuer", "hierfür", "hiergegen", "hierhinter", "hierin", "hiermit", "hiernach", "hierum", "hierunter", "hierueber", "hierüber", "hiervor", "hierzu", "hierzwischen", "hierneben", "hiervon", "wobei", "wodurch", "worin", "worauf", "wobei", "wofür", "wofuer", "wogegen", "wohinter", "womit", "wonach", "woneben", "woran", "worauf", "woraus", "worin", "worum", "worunter", "worüber", "worueber", "wovon", "wovor", "wozu", "wozwischen"];

var locativeAdverbs = ["da", "hier", "dorthin", "hierher", "whence", "dorther", "daher"];

var adverbialGenitives = ["allenfalls", "keinesfalls", "anderenfalls", "andernfalls", "andrenfalls", "äußerstenfalls", "bejahendenfalls", "bestenfalls", "ebenfalls", "eintretendenfalls", "entgegengesetztenfalls", "erforderlichenfalls", "gegebenenfalls", "geringstenfalls", "gleichfalls", "günstigenfalls", "günstigstenfalls", "höchstenfalls", "jedenfalls", "möglichenfalls", "notfalls", "nötigenfalls", "notwendigenfalls", "schlimmstenfalls", "vorkommendenfalls", "widrigenfalls", "zutreffendenfalls", "angesichts", "morgens", "mittags", "abends", "nachts", "keineswegs", "durchwegs", "geradenwegs", "geradeswegs", "geradewegs", "gradenwegs", "halbwegs", "mittwegs", "unterwegs"];

var otherAuxiliaries = ["habe", "hast", "hat", "habt", "habest", "habet", "hatte", "hattest", "hatten", "hätte", "haette", "hättest", "haettest", "hätten", "haetten", "haettet", "hättet", "hab", "bin", "bist", "ist", "sind", "sei", "seiest", "seien", "seiet", "war", "warst", "waren", "wart", "wäre", "waere", "wärest", "waerest", "wärst", "waerst", "wären", "waeren", "wäret", "waeret", "wärt", "waert", "seid", "darf", "darfst", "dürft", "duerft", "dürfe", "duerfe", "dürfest", "duerfest", "dürfet", "duerfet", "durfte", "durftest", "durften", "durftet", "dürfte", "duerfte", "dürftest", "duerftest", "dürften", "duerften", "dürftet", "duerftet", "kann", "kannst", "könnt", "koennt", "könne", "koenne", "könnest", "koennest", "könnet", "koennet", "konnte", "konntest", "konnten", "konntet", "könnte", "koennte", "könntest", "koenntest", "könnten", "koennten", "könntet", "koenntet", "mag", "magst", "mögt", "moegt", "möge", "moege", "mögest", "moegest", "möget", "moeget", "mochte", "mochtest", "mochten", "mochtet", "möchte", "moechte", "möchtest", "moechtest", "möchten", "moechten", "möchtet", "moechtet", "muss", "muß", "musst", "mußt", "müsst", "muesst", "müßt", "mueßt", "müsse", "muesse", "müssest", "muessest", "müsset", "muesset", "musste", "mußte", "musstest", "mußtest", "mussten", "mußten", "musstet", "mußtet", "müsste", "muesste", "müßte", "mueßte", "müsstest", "muesstest", "müßtest", "mueßtest", "müssten", "muessten", "müßten", "mueßten", "müsstet", "muesstet", "müßtet", "mueßtet", "soll", "sollst", "sollt", "solle", "sollest", "sollet", "sollte", "solltest", "sollten", "solltet", "will", "willst", "wollt", "wolle", "wollest", "wollet", "wollte", "wolltest", "wollten", "wolltet", "lasse", "lässt", "laesst", "läßt", "laeßt", "lasst", "laßt", "lassest", "lasset", "ließ", "ließest", "ließt", "ließen", "ließe", "ließet", "liess", "liessest", "liesst", "liessen", "liesse", "liesset"];

var otherAuxiliariesInfinitive = ["haben", "sein", "dürfen", "duerfen", "können", "koennen", "mögen", "moegen", "müssen", "muessen", "sollen", "wollen", "lassen"];

// Forms from 'aussehen' with two parts, like 'sehe aus', are not included, because we remove words on an single word basis.
var copula = ["bleibe", "bleibst", "bleibt", "bleibest", "bleibet", "blieb", "bliebst", "bliebt", "blieben", "bliebe", "bliebest", "bliebet", "heiße", "heißt", "heißest", "heißet", "heisse", "heisst", "heissest", "heisset", "hieß", "hießest", "hießt", "hießen", "hieße", "hießet", "hiess", "hiessest", "hiesst", "hiessen", "hiesse", "hiesset", "gelte", "giltst", "gilt", "geltet", "gelte", "geltest", "galt", "galtest", "galtst", "galten", "galtet", "gälte", "gaelte", "gölte", "goelte", "gältest", "gaeltest", "göltest", "goeltest", "gälten", "gaelten", "gölten", "goelten", "gältet", "gaeltet", "göltet", "goeltet", "aussehe", "aussiehst", "aussieht", "ausseht", "aussehest", "aussehet", "aussah", "aussahst", "aussah", "aussahen", "aussaht", "aussähe", "aussaehe", "aussähest", "aussaehest", "aussähst", "aussaehst", "aussähet", "aussaehet", "aussäht", "aussaeht", "aussähen", "aussaehen", "scheine", "scheinst", "scheint", "scheinest", "scheinet", "schien", "schienst", "schienen", "schient", "schiene", "schienest", "schienet", "erscheine", "erscheinst", "erscheint", "erscheinest", "erscheinet", "erschien", "erschienst", "erschienen", "erschient", "erschiene", "erschienest", "erschienet"];

var copulaInfinitive = ["bleiben", "heißen", "heissen", "gelten", "aussehen", "scheinen", "erscheinen"];

var prepositions = ["a", "à", "ab", "abseits", "abzüglich", "abzueglich", "als", "am", "an", "anfangs", "angelegentlich", "angesichts", "anhand", "anlässlich", "anlaesslich", "ans", "anstatt", "anstelle", "auf", "aufgrund", "aufs", "aufseiten", "aus", "ausgangs", "ausgenommen", "ausschließlich", "ausschliesslich", "ausser", "außer", "außerhalb", "ausserhalb", "ausweislich", "bar", "behufs", "bei", "beidseits", "beiderseits", "beim", "betreffs", "bezüglich", "bezueglich", "binnen", "bis", "contra", "dank", "diesseits", "durch", "einbezüglich", "einbezueglich", "eingangs", "eingedenk", "einschließlich", "einschliesslich", "entgegen", "entlang", "entsprechend", "exklusive", "fern", "fernab", "fuer", "für", "fuers", "fürs", "gegen", "gegenüber", "gegenueber", "gelegentlich", "gemäß", "gemaeß", "gen", "getreu", "gleich", "halber", "hinsichtlich", "hinter", "hinterm", "hinters", "im", "in", "infolge", "inklusive", "inmitten", "innerhalb", "innert", "ins", "je", "jenseits", "kontra", "kraft", "lang", "längs", "laengs", "längsseits", "laengsseits", "laut", "links", "mangels", "minus", "mit", "mithilfe", "mitsamt", "mittels", "nach", "nächst", "naechst", "nah", "namens", "neben", "nebst", "nördlich", "noerdlich", "nordöstlich", "nordoestlich", "nordwestlich", "ob", "oberhalb", "ohne", "östlich", "oestlich", "per", "plus", "pro", "quer", "rechts", "rücksichtlich", "ruecksichtlich", "samt", "seit", "seitens", "seitlich", "seitwärts", "seitwaerts", "statt", "südlich", "suedlich", "südöstlich", "suedoestlich", "südwestlich", "suedwestlich", "trotz", "über", "ueber", "überm", "ueberm", "übern", "uebern", "übers", "uebers", "um", "ums", "unbeschadet", "unerachtet", "unfern", "ungeachtet", "unter", "unterhalb", "unterm", "untern", "unters", "unweit", "vermittels", "vermittelst", "vermöge", "vermoege", "via", "vom", "von", "vonseiten", "vor", "vorbehaltlich", "wegen", "wider", "während", "waehrend", "zeit", "zu", "zufolge", "zugunsten", "zulieb", "zuliebe", "zum", "zur", "zusätzlich", "zusaetzlich", "zuungunsten", "zuwider", "zuzüglich", "zuzueglich", "zwecks", "zwischen"];

// Many coordinating conjunctions are already included in the transition words list.
var coordinatingConjunctions = ["und", "oder", "als", "umso"];

/*
'Entweder' is part of 'wntweder...oder', 'sowohl', 'auch' is part of 'sowohl als...auch', 'weder' and 'noch' are part of 'weder...noch',
 'nur' is part of 'nicht nur...sondern auch'.
 */
var correlativeConjunctions = ["entweder", "sowohl", "auch", "weder", "noch", "nur"];

// Many subordinating conjunctions are already included in the prepositions list, transition words list or pronominal adverbs list.
var subordinatingConjunctions = ["nun", "so", "gleichwohl"];

/*
These verbs are frequently used in interviews to indicate questions and answers. 'Frage' and 'fragen' are not included,
because those words are also nouns.
 */
var interviewVerbs = ["sage", "sagst", "sagt", "sagest", "saget", "sagte", "sagtest", "sagte", "sagten", "sagtet", "gesagt", "fragst", "fragt", "fragest", "fraget", "fragte", "fragtest", "fragten", "fragtet", "gefragt", "erkläre", "erklärst", "erklärt", "erklaere", "erklaerst", "erklaert", "erklärte", "erklärtest", "erklärte", "erklärtet", "erklärten", "erklaerte", "erklaertest", "erklaerte", "erklaertet", "erklaerten", "denke", "denkst", "denkt", "denkest", "denket", "dachte", "dachtest", "dachten", "dachtet", "dächte", "dächtest", "dächten", "dächtet", "daechte", "daechtest", "daechten", "daechtet", "finde", "findest", "findet", "gefunden"];

var interviewVerbsInfinitive = ["sagen", "erklären", "erklaeren", "denken", "finden"];

// These transition words were not included in the list for the transition word assessment for various reasons.
var additionalTransitionWords = ["etwa", "absolut", "unbedingt", "wieder", "definitiv", "bestimmt", "immer", "äußerst", "aeußerst", "höchst", "hoechst", "sofort", "augenblicklich", "umgehend", "direkt", "unmittelbar", "nämlich", "naemlich", "natürlich", "natuerlich", "besonders", "hauptsächlich", "hauptsaechlich", "jetzt", "eben", "heute", "heutzutage", "positiv", "eindeutig", "wirklich", "echt", "wahrhaft", "ehrlich", "aufrichtig", "wahrhaft", "wahrheitsgemäß", "treu", "letztlich", "einmalig", "unübertrefflich", "normalerweise", "gewöhnlich", "gewoehnlich", "üblicherweise", "ueblicherweise", "sonst", "fast", "nahezu", "beinahe", "knapp", "annähernd", "annaehernd", "geradezu", "ziemlich", "bald", "vielleicht", "wahrscheinlich", "wohl", "voraussichtlich", "zugegeben", "ursprünglich", "insgesamt", "tatsächlich", "eigentlich", "wahrhaftig", "bereits", "schon", "oft", "häufig", "haeufig", "regelmäßig", "regelmaeßig", "gleichmäßig", "gleichmaeßig", "einfach", "einfach", "nur", "lediglich", "bloß", "bloss", "eben", "halt", "wahlweise", "eventuell", "manchmal", "teilweise", "nie", "niemals", "nimmer", "jemals", "allzeit", "irgendeinmal", "anders", "vorausgesetzt", "momentan", "gegenwärtig", "gegenwärtig", "nebenbei", "übrigens", "uebrigens", "anderswo", "woanders", "anderswohin", "anderorts", "besonders", "insbesondere", "namentlich", "sonderlich", "ausdrücklich", "ausdruecklich", "vollends", "kürzlich", "kuerzlich", "jüngst", "juengst", "unlängst", "unlaengst", "neuerdings", "neulich", "letztens", "neuerlich", "relativ", "verhältnismäßig", "verhaeltnismaessig", "deutlich", "klar", "eindeutig", "offenbar", "anscheinend", "genau", "u.a", "damals", "zumindest"];

var intensifiers = ["sehr", "recht", "überaus", "ueberaus", "ungemein", "weitaus", "einigermaßen", "einigermassen", "ganz", "schampar", "schwer", "stief", "tierisch", "ungleich", "voll", "ziemlich", "übelst", "uebelst", "stark", "volkommen", "durchaus", "gar"];

// These verbs convey little meaning.
var delexicalisedVerbs = ["geschienen", "meine", "meinst", "meint", "meinen", "meinest", "meinet", "meinte", "meintest", "meinten", "meintet", "gemeint", "stehe", "stehst", "steht"];

var delexicalisedVerbsInfinitive = ["geschienen", "meinen", "tun", "machen", "stehen", "wissen", "gehen", "kommen"];

// These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
// Keyword combinations containing these adjectives/adverbs are fine.
var generalAdjectivesAdverbs = ["einerlei", "egal", "neu", "neue", "neuer", "neuen", "neues", "neuem", "neuerer", "neueren", "neuerem", "neueres", "neuere", "neuester", "neuster", "neuesten", "neusten", "neuestem", "neustem", "neuestes", "neustes", "neueste", "neuste", "alt", "alter", "alten", "altem", "altes", "alte", "ältere", "älteren", "älterer", "älteres", "ältester", "ältesten", "ältestem", "ältestes", "älteste", "aeltere", "aelteren", "aelterer", "aelteres", "aeltester", "aeltesten", "aeltestem", "aeltestes", "aelteste", "gut", "guter", "gutem", "guten", "gutes", "gute", "besser", "besserer", "besseren", "besserem", "besseres", "bester", "besten", "bestem", "bestes", "beste", "größte", "grösste", "groß", "großer", "großen", "großem", "großes", "große", "großerer", "großerem", "großeren", "großeres", "großere", "großter", "großten", "großtem", "großtes", "großte", "gross", "grosser", "grossen", "grossem", "grosses", "grosse", "grosserer", "grosserem", "grosseren", "grosseres", "grossere", "grosster", "grossten", "grosstem", "grosstes", "grosste", "einfach", "einfacher", "einfachen", "einfachem", "einfaches", "einfache", "einfacherer", "einfacheren", "einfacherem", "einfacheres", "einfachere", "einfachste", "einfachster", "einfachsten", "einfachstes", "einfachstem", "schnell", "schneller", "schnellen", "schnellem", "schnelles", "schnelle", "schnellere", "schnellerer", "schnelleren", "schnelleres", "schnellerem", "schnellster", "schnellste", "schnellsten", "schnellstem", "schnellstes", "weiter", "weit", "weiten", "weitem", "weites", "weiterer", "weiteren", "weiterem", "weiteres", "weitere", "weitester", "weitesten", "weitestem", "weitestes", "weiteste", "eigen", "eigener", "eigenen", "eigenes", "eigenem", "eigene", "eigenerer", "eignerer", "eigeneren", "eigneren", "eigenerem", "eignerem", "eigeneres", "eigneres", "eigenere", "eignere", "eigenster", "eigensten", "eigenstem", "eigenstes", "eigenste", "wenig", "weniger", "wenigen", "wenigem", "weniges", "wenigerer", "wenigeres", "wenigerem", "wenigeren", "wenigere", "wenigster", "wenigsten", "wenigstem", "wenigstes", "wenigste", "minderer", "minderen", "minderem", "mindere", "minderes", "mindester", "mindesten", "mindestes", "mindestem", "mindeste", "lang", "langer", "langen", "langem", "langes", "längerer", "längeren", "längerem", "längeres", "längere", "längster", "längsten", "längstem", "längstes", "längste", "laengerer", "laengeren", "laengerem", "laengeres", "laengere", "laengster", "laengsten", "laengstem", "laengstes", "laengste", "tief", "tiefer", "tiefen", "tiefem", "tiefes", "tiefe", "tieferer", "tieferen", "tieferem", "tieferes", "tiefere", "tiefster", "tiefsten", "tiefstem", "tiefste", "tiefstes", "hoch", "hoher", "hohen", "hohem", "hohes", "hohe", "höherer", "höhere", "höheren", "höherem", "höheres", "hoeherer", "hoehere", "hoeheren", "hoeherem", "hoeheres", "höchster", "höchste", "höchsten", "höchstem", "höchstes", "hoechster", "hoechste", "hoechsten", "hoechstem", "hoechstes", "regulär", "regulärer", "regulären", "regulärem", "reguläres", "reguläre", "regulaer", "regulaerer", "regulaeren", "regulaerem", "regulaeres", "regulaere", "regulärerer", "reguläreren", "regulärerem", "reguläreres", "regulärere", "regulaererer", "regulaereren", "regulaererem", "regulaereres", "regulaerere", "regulärster", "regulärsten", "regulärstem", "regulärstes", "regulärste", "regulaerster", "regulaersten", "regulaerstem", "regulaerstes", "regulaerste", "normal", "normaler", "normalen", "normalem", "normales", "normale", "normalerer", "normaleren", "normalerem", "normaleres", "normalere", "normalster", "normalsten", "normalstem", "normalstes", "normalste", "einfach", "einfacher", "einfachen", "einfachem", "einfaches", "einfache", "einfacherer", "einfacheren", "einfacherem", "einfacheres", "einfachere", "einfachster", "einfachsten", "einfachstem", "einfachstes", "einfachste", "klein", "kleiner", "kleinen", "kleinem", "kleines", "kleine", "kleinerer", "kleineres", "kleineren", "kleinerem", "kleinere", "kleinster", "kleinsten", "kleinstem", "kleinstes", "kleinste", "winzig", "winziger", "winzigen", "winzigem", "winziges", "winzigerer", "winzigeren", "winzigerem", "winzigeres", "winzigere", "winzigster", "winzigsten", "winzigstem", "winzigste", "winzigstes", "sogenannt", "sogenannter", "sogenannten", "sogenanntem", "sogenanntes", "sogenannte", "kurz", "kurzer", "kurzen", "kurzem", "kurzes", "kurze", "kürzerer", "kürzeres", "kürzeren", "kürzerem", "kürzere", "kuerzerer", "kuerzeres", "kuerzeren", "kuerzerem", "kuerzere", "kürzester", "kürzesten", "kürzestem", "kürzestes", "kürzeste", "kuerzester", "kuerzesten", "kuerzestem", "kuerzestes", "kuerzeste", "wirklicher", "wirklichen", "wirklichem", "wirkliches", "wirkliche", "wirklicherer", "wirklicheren", "wirklicherem", "wirklicheres", "wirklichere", "wirklichster", "wirklichsten", "wirklichstes", "wirklichstem", "wirklichste", "eigentlich", "eigentlicher", "eigentlichen", "eigentlichem", "eigentliches", "eigentliche", "schön", "schöner", "schönen", "schönem", "schönes", "schöne", "schönerer", "schöneren", "schönerem", "schöneres", "schönere", "schönster", "schönsten", "schönstem", "schönstes", "schönste", "real", "realer", "realen", "realem", "reales", "realerer", "realeren", "realerem", "realeres", "realere", "realster", "realsten", "realstem", "realstes", "realste", "derselbe", "denselben", "demselben", "desselben", "dasselbe", "dieselbe", "derselben", "dieselben", "gleich", "gleicher", "gleichen", "gleichem", "gleiches", "gleiche", "gleicherer", "gleicheren", "gleicherem", "gleicheres", "gleichere", "gleichster", "gleichsten", "gleichstem", "gleichstes", "gleichste", "bestimmter", "bestimmten", "bestimmtem", "bestimmtes", "bestimmte", "bestimmtere", "bestimmterer", "bestimmterem", "bestimmteren", "bestimmteres", "bestimmtester", "bestimmtesten", "bestimmtestem", "bestimmtestes", "bestimmteste", "hauptsächlich", "hauptsaechlich", "überwiegend", "ueberwiegend", "zumeist", "meistens", "meisten", "kürzlich", "kuerzlich", "großenteils", "grossenteils", "meistenteils", "gewöhnlich", "gewoehnlich", "häufig", "haeufig", "weithin", "ständig", "staendig", "laufend", "dauernd", "andauernd", "immerfort", "irgendwo", "irgendwann", "ähnlicher", "ähnlichen", "ähnlichem", "ähnliches", "ähnliche", "ähnlich", "ähnlicherer", "ähnlicheren", "ähnlicherem", "ähnlicheres", "ähnlichere", "ähnlichster", "ähnlichsten", "ähnlichstem", "ähnlichstes", "ähnlichste", "schlecht", "schlechter", "schlechten", "schlechtem", "schlechtes", "schlechte", "schlechterer", "schlechteren", "schlechterem", "schlechteres", "schlechtere", "schlechtester", "schlechtesten", "schlechtestem", "schlechtestes", "schlechteste", "schlimm", "schlimmer", "schlimmen", "schlimmem", "schlimmes", "schlimme", "schlimmerer", "schlimmeren", "schlimmerem", "schlimmeres", "schlimmere", "schlimmster", "schlimmsten", "schlimmstem", "schlimmstes", "schlimmste", "toll", "toller", "tollen", "tollem", "tolles", "tolle", "tollerer", "tolleren", "tollerem", "tollere", "tolleres", "tollster", "tollsten", "tollstem", "tollstes", "tollste", "super", "mögliche", "möglicher", "mögliches", "möglichen", "möglichem", "möglich", "moegliche", "moeglicher", "moegliches", "moeglichen", "moeglichem", "moeglich", "nächsten", "naechsten", "voll", "voller", "vollen", "vollem", "volle", "volles", "vollerer", "volleren", "vollerem", "vollere", "volleres", "vollster", "vollsten", "vollstem", "vollste", "vollstes", "außen", "ganzer", "ganzen", "ganzem", "ganze", "ganzes", "gerne", "oben", "unten", "zurück", "zurueck"];

var interjections = ["ach", "aha", "oh", "au", "bäh", "baeh", "igitt", "huch", "hurra", "hoppla", "nanu", "oha", "olala", "pfui", "tja", "uups", "wow", "grr", "äh", "aeh", "ähm", "aeh", "öhm", "oehm", "hm", "mei", "nun", "tja", "mhm", "okay", "richtig", "eijeijeijei"];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
var recipeWords = ["g", "el", "es", "tl", "wg", "be", "bd", "cl", "dl", "dag", "do", "gl", "gr", "kg", "kl", "cb", "ccm", "l", "ms", "mg", "ml", "mi", "pk", "pr", "pp", "sc", "sp", "st", "sk", "ta", "tr", "cm", "mass"];

var timeWords = ["sekunde", "sekunden", "minute", "minuten", "uhr", "uhren", "tag", "tages", "tags", "tage", "tagen", "woche", "wochen", "jahr", "jahres", "jahrs", "jahre", "jahren"];

var vagueNouns = ["ding", "dinge", "dinges", "dinger", "dingern", "dingen", "sache", "sachen", "weise", "weisen", "wahrscheinlichkeit", "zeug", "zeuge", "zeuges", "zeugen", "mal", "einmal", "teil", "teile", "teiles", "teilen", "prozent", "prozents", "prozentes", "prozente", "prozenten", "beispiel", "beispiele", "beispieles", "beispiels", "beispielen", "aspekt", "aspekte", "aspektes", "aspekts", "aspekten", "idee", "ideen", "ahnung", "ahnungen", "thema", "themas", "themata", "themen", "fall", "falle", "falles", "falls", "fälle", "fällen", "faelle", "faellen", "mensch", "menschen", "leute"];

var miscellaneous = ["nix", "nixe", "nixes", "nixen", "usw.", "%", "nicht", "amen", "ja", "nein", "euro", "prozent", "was"];

module.exports = function () {
	return {
		articles: articles,
		personalPronouns: personalPronounsNominative.concat(personalPronounsAccusative, personalPronounsDative, possessivePronouns),
		prepositions: prepositions,
		demonstrativePronouns: demonstrativePronouns,
		conjunctions: coordinatingConjunctions.concat(subordinatingConjunctions, correlativeConjunctions),
		verbs: copula.concat(interviewVerbs, otherAuxiliaries, filteredPassiveAuxiliaries),
		quantifiers: quantifiers,
		relativePronouns: relativePronouns,
		interrogativeProAdverbs: interrogativeProAdverbs,
		transitionWords: transitionWords.concat(additionalTransitionWords),
		// These verbs that should be filtered at the beginning of prominent word combinations.
		beginningVerbs: otherAuxiliariesInfinitive.concat(notFilteredPassiveAuxiliaries, delexicalisedVerbsInfinitive, copulaInfinitive, interviewVerbsInfinitive),
		miscellaneous: miscellaneous,
		interjections: interjections,
		pronominalAdverbs: pronominalAdverbs,
		reflexivePronouns: reflexivePronouns,
		all: articles.concat(numerals, demonstrativePronouns, possessivePronouns, reflexivePronouns, personalPronounsNominative, personalPronounsAccusative, relativePronouns, quantifiers, indefinitePronouns, interrogativeProAdverbs, pronominalAdverbs, locativeAdverbs, adverbialGenitives, filteredPassiveAuxiliaries, notFilteredPassiveAuxiliaries, otherAuxiliaries, otherAuxiliariesInfinitive, copula, copulaInfinitive, prepositions, coordinatingConjunctions, correlativeConjunctions, subordinatingConjunctions, interviewVerbs, interviewVerbsInfinitive, transitionWords, additionalTransitionWords, intensifiers, delexicalisedVerbs, delexicalisedVerbsInfinitive, interjections, generalAdjectivesAdverbs, recipeWords, vagueNouns, miscellaneous, timeWords)
	};
};

},{"./passivevoice/auxiliaries.js":198,"./transitionWords.js":199}],198:[function(require,module,exports){
"use strict";

// These passive auxiliaries start with be-, ge- or er- en and with -t, and therefore look like a participle.
var participleLike = ["bekommst", "bekommt", "bekamst", "bekommest", "bekommet", "bekämest", "bekämst", "bekämet", "bekämt", "gekriegt", "gehörst", "gehört", "gehörtest", "gehörtet", "gehörest", "gehöret", "erhältst", "erhält", "erhaltet", "erhielt", "erhieltest", "erhieltst", "erhieltet", "erhaltest"];

// These are all other passive auxiliaries.
var otherAuxiliaries = ["werde", "wirst", "wird", "werden", "werdet", "wurde", "ward", "wurdest", "wardst", "wurden", "wurdet", "worden", "werdest", "würde", "würdest", "würden", "würdet", "bekomme", "bekommen", "bekam", "bekamen", "bekäme", "bekämen", "kriege", "kriegst", "kriegt", "kriegen", "kriegte", "kriegtest", "kriegten", "kriegtet", "kriegest", "krieget", "gehöre", "gehören", "gehörte", "gehörten", "erhalte", "erhalten", "erhielten", "erhielte"];

// These first person plural auxiliaries also function as an infinitive.
var infinitiveAuxiliaries = ["werden", "bekommen", "kriegen", "gehören", "erhalten"];
/**
 * Returns lists with auxiliaries.
 * @returns {Array} The lists with auxiliaries.
 */
module.exports = function () {
	return {
		participleLike: participleLike,
		otherAuxiliaries: otherAuxiliaries.concat(infinitiveAuxiliaries),
		// These auxiliaries are filtered from the beginning and end of word combinations in the prominent words.
		filteredAuxiliaries: participleLike.concat(otherAuxiliaries),
		// These auxiliaries are not filtered from the beginning of word combinations in the prominent words.
		infinitiveAuxiliaries: infinitiveAuxiliaries,
		allAuxiliaries: participleLike.concat(otherAuxiliaries, infinitiveAuxiliaries)
	};
};

},{}],199:[function(require,module,exports){
"use strict";

/** @module config/transitionWords */

var singleWords = ["aber", "abschließend", "abschliessend", "alldieweil", "allerdings", "also", "anderenteils", "andererseits", "andernteils", "anfaenglich", "anfänglich", "anfangs", "angenommen", "anschliessend", "anschließend", "aufgrund", "ausgenommen", "ausser", "außer", "ausserdem", "außerdem", "beispielsweise", "bevor", "beziehungsweise", "bspw", "bzw", "d.h", "da", "dabei", "dadurch", "dafuer", "dafür", "dagegen", "daher", "dahingegen", "danach", "dann", "darauf", "darum", "dass", "davor", "dazu", "dementgegen", "dementsprechend", "demgegenüber", "demgegenueber", "demgemaess", "demgemäß", "demzufolge", "denn", "dennoch", "dergestalt", "desto", "deshalb", "desungeachtet", "deswegen", "doch", "dort", "drittens", "ebenfalls", "ebenso", "endlich", "ehe", "einerseits", "einesteils", "entsprechend", "entweder", "erst", "erstens", "falls", "ferner", "folgerichtig", "folglich", "fürderhin", "fuerderhin", "genauso", "hierdurch", "hierzu", "hingegen", "immerhin", "indem", "indes", "indessen", "infolge", "infolgedessen", "insofern", "insoweit", "inzwischen", "jedenfalls", "jedoch", "kurzum", "m.a.w", "mitnichten", "mitunter", "möglicherweise", "moeglicherweise", "nachdem", "nebenher", "nichtsdestotrotz", "nichtsdestoweniger", "ob", "obenrein", "obgleich", "obschon", "obwohl", "obzwar", "ohnehin", "richtigerweise", "schliesslich", "schließlich", "seit", "seitdem", "sobald", "sodass", "so dass", "sofern", "sogar", "solang", "solange", "somit", "sondern", "sooft", "soviel", "soweit", "sowie", "sowohl", "statt", "stattdessen", "trotz", "trotzdem", "überdies", "übrigens", "ueberdies", "uebrigens", "ungeachtet", "vielmehr", "vorausgesetzt", "vorher", "waehrend", "während", "währenddessen", "waehrenddessen", "weder", "wegen", "weil", "weiter", "weiterhin", "wenn", "wenngleich", "wennschon", "wennzwar", "weshalb", "widrigenfalls", "wiewohl", "wobei", "wohingegen", "z.b", "zudem", "zuerst", "zufolge", "zuletzt", "zumal", "zuvor", "zwar", "zweitens"];
var multipleWords = ["abgesehen von", "abgesehen davon", "als dass", "als wenn", "anders ausgedrückt", "anders ausgedrueckt", "anders formuliert", "anders gefasst", "anders gefragt", "anders gesagt", "anders gesprochen", "anstatt dass", "auch wenn", "auf grund", "auf jeden fall", "aus diesem grund", "ausser dass", "außer dass", "ausser wenn", "außer wenn", "besser ausgedrückt", "besser ausgedrueckt", "besser formuliert", "besser gesagt", "besser gesprochen", "bloss dass", "bloß dass", "das heisst", "das heißt", "des weiteren", "dessen ungeachtet", "ebenso wie", "genauso wie", "geschweige denn", "im fall", "im falle", "im folgenden", "im gegensatz dazu", "im grunde genommen", "in diesem sinne", "je nachdem", "kurz gesagt", "mit anderen worten", "ohne dass", "so dass", "umso mehr als", "umso weniger als", "umso mehr, als", "umso weniger, als", "unbeschadet dessen", "und zwar", "ungeachtet dessen", "unter dem strich", "zum beispiel"];

/**
 * Returns lists with transition words to be used by the assessments.
 * @returns {Object} The object with transition word lists.
 */
module.exports = function () {
	return {
		singleWords: singleWords,
		multipleWords: multipleWords,
		allWords: singleWords.concat(multipleWords)
	};
};

},{}],200:[function(require,module,exports){
"use strict";

/** @module stringProcessing/addWordboundary */

/**
 * Returns a string that can be used in a regex to match a matchString with word boundaries.
 *
 * @param {string} matchString The string to generate a regex string for.
 * @param {string} [extraWordBoundary] Extra characters to match a word boundary on.
 * @returns {string} A regex string that matches the matchString with word boundaries.
 */
module.exports = function (matchString, extraWordBoundary) {
  var wordBoundary, wordBoundaryStart, wordBoundaryEnd;
  var _extraWordBoundary = extraWordBoundary || "";

  wordBoundary = "[ \\n\\r\\t\.,'\(\)\"\+\-;!?:\/»«‹›" + _extraWordBoundary + "<>]";
  wordBoundaryStart = "(^|" + wordBoundary + ")";
  wordBoundaryEnd = "($|" + wordBoundary + ")";

  return wordBoundaryStart + matchString + wordBoundaryEnd;
};

},{}],201:[function(require,module,exports){
"use strict";

/** @module stringProcessing/createRegexFromArray */

var addWordBoundary = require("../stringProcessing/addWordboundary.js");
var map = require("lodash/map");

/**
 * Creates a regex of combined strings from the input array.
 *
 * @param {array} array The array with strings
 * @param {boolean} [disableWordBoundary] Boolean indicating whether or not to disable word boundaries
 * @returns {RegExp} regex The regex created from the array.
 */
module.exports = function (array, disableWordBoundary) {
	var regexString;
	var _disableWordBoundary = disableWordBoundary || false;

	var boundedArray = map(array, function (string) {
		if (_disableWordBoundary) {
			return string;
		}
		return addWordBoundary(string);
	});

	regexString = "(" + boundedArray.join(")|(") + ")";

	return new RegExp(regexString, "ig");
};

},{"../stringProcessing/addWordboundary.js":200,"lodash/map":171}],202:[function(require,module,exports){
"use strict";

var map = require("lodash/map");
var isUndefined = require("lodash/isUndefined");
var forEach = require("lodash/forEach");
var isNaN = require("lodash/isNaN");
var filter = require("lodash/filter");
var flatMap = require("lodash/flatMap");
var isEmpty = require("lodash/isEmpty");
var negate = require("lodash/negate");
var memoize = require("lodash/memoize");

var core = require("tokenizer2/core");

var getBlocks = require("../helpers/html.js").getBlocks;
var normalizeQuotes = require("../stringProcessing/quotes.js").normalize;

var unifyWhitespace = require("../stringProcessing/unifyWhitespace.js").unifyNonBreakingSpace;

// All characters that indicate a sentence delimiter.
var fullStop = ".";
// The \u2026 character is an ellipsis
var sentenceDelimiters = "?!;\u2026";
var newLines = "\n\r|\n|\r";

var fullStopRegex = new RegExp("^[" + fullStop + "]$");
var sentenceDelimiterRegex = new RegExp("^[" + sentenceDelimiters + "]$");
var sentenceRegex = new RegExp("^[^" + fullStop + sentenceDelimiters + "<\\(\\)\\[\\]]+$");
var htmlStartRegex = /^<([^>\s\/]+)[^>]*>$/mi;
var htmlEndRegex = /^<\/([^>\s]+)[^>]*>$/mi;
var newLineRegex = new RegExp(newLines);

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

	sentenceTokenizer = core(function (token) {
		tokens.push(token);
	});

	sentenceTokenizer.addRule(htmlStartRegex, "html-start");
	sentenceTokenizer.addRule(htmlEndRegex, "html-end");
	sentenceTokenizer.addRule(blockStartRegex, "block-start");
	sentenceTokenizer.addRule(blockEndRegex, "block-end");
	sentenceTokenizer.addRule(fullStopRegex, "full-stop");
	sentenceTokenizer.addRule(sentenceDelimiterRegex, "sentence-delimiter");
	sentenceTokenizer.addRule(sentenceRegex, "sentence");
}

/**
 * Returns whether or not a certain character is a capital letter.
 *
 * @param {string} character The character to check.
 * @returns {boolean} Whether or not the character is a capital letter.
 */
function isCapitalLetter(character) {
	return character !== character.toLocaleLowerCase();
}

/**
 * Returns whether or not a certain character is a number.
 *
 * @param {string} character The character to check.
 * @returns {boolean} Whether or not the character is a capital letter.
 */
function isNumber(character) {
	return !isNaN(parseInt(character, 10));
}

/**
 * Returns whether or not a given HTML tag is a break tag.
 *
 * @param {string} htmlTag The HTML tag to check.
 * @returns {boolean} Whether or not the given HTML tag is a break tag.
 */
function isBreakTag(htmlTag) {
	return (/<br/.test(htmlTag)
	);
}

/**
 * Returns whether or not a given character is quotation mark.
 *
 * @param {string} character The character to check.
 * @returns {boolean} Whether or not the given character is a quotation mark.
 */
function isQuotation(character) {
	character = normalizeQuotes(character);

	return "'" === character || "\"" === character;
}

/**
 * Returns whether or not a given character is a punctuation mark that can be at the beginning
 * of a sentence, like ¿ and ¡ used in Spanish.
 *
 * @param {string} character The character to check.
 * @returns {boolean} Whether or not the given character is a punctuation mark.
 */
function isPunctuation(character) {
	return "¿" === character || "¡" === character;
}

/**
 * Tokenizes a sentence, assumes that the text has already been split into blocks.
 *
 * @param {string} text The text to tokenize.
 * @returns {Array} An array of tokens.
 */
function tokenizeSentences(text) {
	createTokenizer();
	sentenceTokenizer.onText(text);

	sentenceTokenizer.end();

	return tokens;
}

/**
 * Removes duplicate whitespace from a given text.
 *
 * @param {string} text The text with duplicate whitespace.
 * @returns {string} The text without duplicate whitespace.
 */
function removeDuplicateWhitespace(text) {
	return text.replace(/\s+/, " ");
}

/**
 * Retrieves the next two characters from an array with the two next tokens.
 *
 * @param {Array} nextTokens The two next tokens. Might be undefined.
 * @returns {string} The next two characters.
 */
function getNextTwoCharacters(nextTokens) {
	var next = "";

	if (!isUndefined(nextTokens[0])) {
		next += nextTokens[0].src;
	}

	if (!isUndefined(nextTokens[1])) {
		next += nextTokens[1].src;
	}

	next = removeDuplicateWhitespace(next);

	return next;
}

/**
 * Checks if the sentenceBeginning beginning is a valid beginning.
 *
 * @param {string} sentenceBeginning The beginning of the sentence to validate.
 * @returns {boolean} Returns true if it is a valid beginning, false if it is not.
 */
function isValidSentenceBeginning(sentenceBeginning) {
	return isCapitalLetter(sentenceBeginning) || isNumber(sentenceBeginning) || isQuotation(sentenceBeginning) || isPunctuation(sentenceBeginning);
}

/**
 * Checks if the token is a valid sentence ending.
 *
 * @param {Object} token The token to validate.
 * @returns {boolean} Returns true if the token is valid ending, false if it is not.
 */
function isSentenceStart(token) {
	return !isUndefined(token) && ("html-start" === token.type || "html-end" === token.type || "block-start" === token.type);
}

/**
 * Returns an array of sentences for a given array of tokens, assumes that the text has already been split into blocks.
 *
 * @param {Array} tokens The tokens from the sentence tokenizer.
 * @returns {Array<string>} A list of sentences.
 */
function getSentencesFromTokens(tokens) {
	var tokenSentences = [],
	    currentSentence = "",
	    nextSentenceStart;

	var sliced;

	// Drop the first and last HTML tag if both are present.
	do {
		sliced = false;
		var firstToken = tokens[0];
		var lastToken = tokens[tokens.length - 1];

		if (firstToken.type === "html-start" && lastToken.type === "html-end") {
			tokens = tokens.slice(1, tokens.length - 1);

			sliced = true;
		}
	} while (sliced && tokens.length > 1);

	forEach(tokens, function (token, i) {
		var hasNextSentence;
		var nextToken = tokens[i + 1];
		var secondToNextToken = tokens[i + 2];
		var nextCharacters;

		switch (token.type) {

			case "html-start":
			case "html-end":
				if (isBreakTag(token.src)) {
					tokenSentences.push(currentSentence);
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

				if (!isUndefined(nextToken) && "block-end" !== nextToken.type) {
					tokenSentences.push(currentSentence);
					currentSentence = "";
				}
				break;

			case "full-stop":
				currentSentence += token.src;

				nextCharacters = getNextTwoCharacters([nextToken, secondToNextToken]);

				// For a new sentence we need to check the next two characters.
				hasNextSentence = nextCharacters.length >= 2;
				nextSentenceStart = hasNextSentence ? nextCharacters[1] : "";
				// If the next character is a number, never split. For example: IPv4-numbers.
				if (hasNextSentence && isNumber(nextCharacters[0])) {
					break;
				}
				// Only split on sentence delimiters when the next sentence looks like the start of a sentence.
				if (hasNextSentence && isValidSentenceBeginning(nextSentenceStart) || isSentenceStart(nextToken)) {
					tokenSentences.push(currentSentence);
					currentSentence = "";
				}
				break;

			case "newline":
				tokenSentences.push(currentSentence);
				currentSentence = "";
				break;

			case "block-start":
				currentSentence += token.src;
				break;

			case "block-end":
				currentSentence += token.src;

				nextCharacters = getNextTwoCharacters([nextToken, secondToNextToken]);

				// For a new sentence we need to check the next two characters.
				hasNextSentence = nextCharacters.length >= 2;
				nextSentenceStart = hasNextSentence ? nextCharacters[0] : "";
				// If the next character is a number, never split. For example: IPv4-numbers.
				if (hasNextSentence && isNumber(nextCharacters[0])) {
					break;
				}

				if (hasNextSentence && isValidSentenceBeginning(nextSentenceStart) || isSentenceStart(nextToken)) {
					tokenSentences.push(currentSentence);
					currentSentence = "";
				}
				break;
		}
	});

	if ("" !== currentSentence) {
		tokenSentences.push(currentSentence);
	}

	tokenSentences = map(tokenSentences, function (sentence) {
		return sentence.trim();
	});

	return tokenSentences;
}

/**
 * Returns the sentences from a certain block.
 *
 * @param {string} block The HTML inside a HTML block.
 * @returns {Array<string>} The list of sentences in the block.
 */
function getSentencesFromBlock(block) {
	var tokens = tokenizeSentences(block);

	return tokens.length === 0 ? [] : getSentencesFromTokens(tokens);
}

var getSentencesFromBlockCached = memoize(getSentencesFromBlock);

/**
 * Returns sentences in a string.
 *
 * @param {String} text The string to count sentences in.
 * @returns {Array} Sentences found in the text.
 */
module.exports = function (text) {
	text = unifyWhitespace(text);
	var sentences,
	    blocks = getBlocks(text);

	// Split each block on newlines.
	blocks = flatMap(blocks, function (block) {
		return block.split(newLineRegex);
	});

	sentences = flatMap(blocks, getSentencesFromBlockCached);

	return filter(sentences, negate(isEmpty));
};

},{"../helpers/html.js":191,"../stringProcessing/quotes.js":204,"../stringProcessing/unifyWhitespace.js":211,"lodash/filter":141,"lodash/flatMap":144,"lodash/forEach":146,"lodash/isEmpty":158,"lodash/isNaN":162,"lodash/isUndefined":169,"lodash/map":171,"lodash/memoize":172,"lodash/negate":173,"tokenizer2/core":185}],203:[function(require,module,exports){
"use strict";

/** @module stringProcessing/countWords */

var stripTags = require("./stripHTMLTags.js").stripFullTags;
var stripSpaces = require("./stripSpaces.js");
var removePunctuation = require("./removePunctuation.js");
var map = require("lodash/map");
var filter = require("lodash/filter");

/**
 * Returns an array with words used in the text.
 *
 * @param {string} text The text to be counted.
 * @returns {Array} The array with all words.
 */
module.exports = function (text) {
	text = stripSpaces(stripTags(text));
	if (text === "") {
		return [];
	}

	var words = text.split(/\s/g);

	words = map(words, function (word) {
		return removePunctuation(word);
	});

	return filter(words, function (word) {
		return word.trim() !== "";
	});
};

},{"./removePunctuation.js":206,"./stripHTMLTags.js":207,"./stripSpaces.js":208,"lodash/filter":141,"lodash/map":171}],204:[function(require,module,exports){
"use strict";

/**
 * Normalizes single quotes to 'regular' quotes.
 *
 * @param {string} text Text to normalize.
 * @returns {string} The normalized text.
 */
function normalizeSingleQuotes(text) {
  return text.replace(/[‘’‛`]/g, "'");
}

/**
 * Normalizes double quotes to 'regular' quotes.
 *
 * @param {string} text Text to normalize.
 * @returns {string} The normalized text.
 */
function normalizeDoubleQuotes(text) {
  return text.replace(/[“”〝〞〟‟„]/g, "\"");
}

/**
 * Normalizes quotes to 'regular' quotes.
 *
 * @param {string} text Text to normalize.
 * @returns {string} The normalized text.
 */
function normalizeQuotes(text) {
  return normalizeDoubleQuotes(normalizeSingleQuotes(text));
}

module.exports = {
  normalizeSingle: normalizeSingleQuotes,
  normalizeDouble: normalizeDoubleQuotes,
  normalize: normalizeQuotes
};

},{}],205:[function(require,module,exports){
"use strict";

var getWords = require("../stringProcessing/getWords");
var getSentences = require("../stringProcessing/getSentences");
var WordCombination = require("../values/WordCombination");
var normalizeQuotes = require("../stringProcessing/quotes.js").normalize;
var germanFunctionWords = require("../researches/german/functionWords.js");
var englishFunctionWords = require("../researches/english/functionWords.js");
var countSyllables = require("../stringProcessing/syllables/count.js");
var getLanguage = require("../helpers/getLanguage.js");

var filter = require("lodash/filter");
var map = require("lodash/map");
var forEach = require("lodash/forEach");
var has = require("lodash/has");
var flatMap = require("lodash/flatMap");
var values = require("lodash/values");
var take = require("lodash/take");
var includes = require("lodash/includes");
var intersection = require("lodash/intersection");
var isEmpty = require("lodash/isEmpty");

var densityLowerLimit = 0;
var densityUpperLimit = 0.03;
var relevantWordLimit = 100;
var wordCountLowerLimit = 200;

// En dash, em dash, hyphen-minus, and hash.
var specialCharacters = ["–", "—", "-", "#"];

/**
 * Returns the word combinations for the given text based on the combination size.
 *
 * @param {string} text The text to retrieve combinations for.
 * @param {number} combinationSize The size of the combinations to retrieve.
 * @param {Function} functionWords The function containing the lists of function words.
 * @returns {WordCombination[]} All word combinations for the given text.
 */
function getWordCombinations(text, combinationSize, functionWords) {
	var sentences = getSentences(text);

	var words, combination;

	return flatMap(sentences, function (sentence) {
		sentence = sentence.toLocaleLowerCase();
		sentence = normalizeQuotes(sentence);
		words = getWords(sentence);

		return filter(map(words, function (word, i) {
			// If there are still enough words in the sentence to slice of.
			if (i + combinationSize - 1 < words.length) {
				combination = words.slice(i, i + combinationSize);
				return new WordCombination(combination, 0, functionWords);
			}

			return false;
		}));
	});
}

/**
 * Calculates occurrences for a list of word combinations.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to calculate occurrences for.
 * @returns {WordCombination[]} Word combinations with their respective occurrences.
 */
function calculateOccurrences(wordCombinations) {
	var occurrences = {};

	forEach(wordCombinations, function (wordCombination) {
		var combination = wordCombination.getCombination();

		if (!has(occurrences, combination)) {
			occurrences[combination] = wordCombination;
		}

		occurrences[combination].incrementOccurrences();
	});

	return values(occurrences);
}

/**
 * Returns only the relevant combinations from a list of word combinations. Assumes
 * occurrences have already been calculated.
 *
 * @param {WordCombination[]} wordCombinations A list of word combinations.
 * @returns {WordCombination[]} Only relevant word combinations.
 */
function getRelevantCombinations(wordCombinations) {
	wordCombinations = wordCombinations.filter(function (combination) {
		return combination.getOccurrences() !== 1 && combination.getRelevance() !== 0;
	});
	return wordCombinations;
}

/**
 * Sorts combinations based on their relevance and length.
 *
 * @param {WordCombination[]} wordCombinations The combinations to sort.
 * @returns {void}
 */
function sortCombinations(wordCombinations) {
	wordCombinations.sort(function (combinationA, combinationB) {
		var difference = combinationB.getRelevance() - combinationA.getRelevance();
		// The combination with the highest relevance comes first.
		if (difference !== 0) {
			return difference;
		}
		// In case of a tie on relevance, the longest combination comes first.
		return combinationB.getLength() - combinationA.getLength();
	});
}

/**
 * Filters word combinations beginning with certain function words.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {array} functionWords The list of function words.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterFunctionWordsAtBeginning(wordCombinations, functionWords) {
	return wordCombinations.filter(function (combination) {
		return !includes(functionWords, combination.getWords()[0]);
	});
}

/**
 * Filters word combinations ending with certain function words.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {array} functionWords The list of function words.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterFunctionWordsAtEnding(wordCombinations, functionWords) {
	return wordCombinations.filter(function (combination) {
		var words = combination.getWords();
		var lastWordIndex = words.length - 1;
		return !includes(functionWords, words[lastWordIndex]);
	});
}

/**
 * Filters word combinations beginning and ending with certain function words.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {Array} functionWords The list of function words.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterFunctionWords(wordCombinations, functionWords) {
	wordCombinations = filterFunctionWordsAtBeginning(wordCombinations, functionWords);
	wordCombinations = filterFunctionWordsAtEnding(wordCombinations, functionWords);
	return wordCombinations;
}

/**
 * Filters word combinations containing a special character.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {array} specialCharacters The list of special characters.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterSpecialCharacters(wordCombinations, specialCharacters) {
	return wordCombinations.filter(function (combination) {
		return isEmpty(intersection(specialCharacters, combination.getWords()));
	});
}
/**
 * Filters word combinations with a length of one and a given syllable count.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {number} syllableCount The number of syllables to use for filtering.
 * @param {string} locale The paper's locale.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterOnSyllableCount(wordCombinations, syllableCount, locale) {
	return wordCombinations.filter(function (combination) {
		return !(combination.getLength() === 1 && countSyllables(combination.getWords()[0], locale) <= syllableCount);
	});
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
function filterOnDensity(wordCombinations, wordCount, densityLowerLimit, densityUpperLimit) {
	return wordCombinations.filter(function (combination) {
		return combination.getDensity(wordCount) >= densityLowerLimit && combination.getDensity(wordCount) < densityUpperLimit;
	});
}

/**
 * Filters the list of word combination objects.
 * Word combinations with specific parts of speech at the beginning and/or end, as well as one-syllable single words, are removed.
 *
 * @param {Array} combinations The list of word combination objects.
 * @param {Function} functionWords The function containing the lists of function words.
 * @param {string} locale The paper's locale.
 * @returns {Array} The filtered list of word combination objects.
 */
function filterCombinations(combinations, functionWords, locale) {
	combinations = filterFunctionWords(combinations, specialCharacters);
	combinations = filterFunctionWords(combinations, functionWords().articles);
	combinations = filterFunctionWords(combinations, functionWords().personalPronouns);
	combinations = filterFunctionWords(combinations, functionWords().prepositions);
	combinations = filterFunctionWords(combinations, functionWords().conjunctions);
	combinations = filterFunctionWords(combinations, functionWords().quantifiers);
	combinations = filterFunctionWords(combinations, functionWords().demonstrativePronouns);
	combinations = filterFunctionWords(combinations, functionWords().transitionWords);
	combinations = filterFunctionWords(combinations, functionWords().pronominalAdverbs);
	combinations = filterFunctionWords(combinations, functionWords().interjections);
	combinations = filterFunctionWordsAtEnding(combinations, functionWords().relativePronouns);
	combinations = filterFunctionWordsAtEnding(combinations, functionWords().miscellaneous);
	combinations = filterOnSyllableCount(combinations, 1, locale);
	switch (getLanguage(locale)) {
		case "en":
			combinations = filterFunctionWordsAtBeginning(combinations, functionWords().passiveAuxiliaries);
			combinations = filterFunctionWordsAtBeginning(combinations, functionWords().reflexivePronouns);
			combinations = filterFunctionWordsAtEnding(combinations, functionWords().verbs);
			break;
		case "de":
			combinations = filterFunctionWords(combinations, functionWords().verbs);
			combinations = filterFunctionWordsAtBeginning(combinations, functionWords().beginningVerbs);
			combinations = filterFunctionWordsAtEnding(combinations, functionWords().reflexivePronouns);
			combinations = filterFunctionWordsAtEnding(combinations, functionWords().interrogativeProAdverbs);
			break;
	}
	return combinations;
}
/**
 * Returns the relevant words in a given text.
 *
 * @param {string} text The text to retrieve the relevant words of.
 * @param {string} locale The paper's locale.
 * @returns {WordCombination[]} All relevant words sorted and filtered for this text.
 */
function getRelevantWords(text, locale) {
	var functionWords;
	switch (getLanguage(locale)) {
		case "de":
			functionWords = germanFunctionWords;
			break;
		default:
		case "en":
			functionWords = englishFunctionWords;
			break;
	}

	var words = getWordCombinations(text, 1, functionWords().all);
	var wordCount = words.length;

	var oneWordCombinations = getRelevantCombinations(calculateOccurrences(words));

	sortCombinations(oneWordCombinations);
	oneWordCombinations = take(oneWordCombinations, 100);

	var oneWordRelevanceMap = {};

	forEach(oneWordCombinations, function (combination) {
		oneWordRelevanceMap[combination.getCombination()] = combination.getRelevance(functionWords);
	});

	var twoWordCombinations = calculateOccurrences(getWordCombinations(text, 2, functionWords().all));
	var threeWordCombinations = calculateOccurrences(getWordCombinations(text, 3, functionWords().all));
	var fourWordCombinations = calculateOccurrences(getWordCombinations(text, 4, functionWords().all));
	var fiveWordCombinations = calculateOccurrences(getWordCombinations(text, 5, functionWords().all));

	var combinations = oneWordCombinations.concat(twoWordCombinations, threeWordCombinations, fourWordCombinations, fiveWordCombinations);

	combinations = filterCombinations(combinations, functionWords, locale);

	forEach(combinations, function (combination) {
		combination.setRelevantWords(oneWordRelevanceMap);
	});

	combinations = getRelevantCombinations(combinations, wordCount);
	sortCombinations(combinations);

	if (wordCount >= wordCountLowerLimit) {
		combinations = filterOnDensity(combinations, wordCount, densityLowerLimit, densityUpperLimit);
	}

	return take(combinations, relevantWordLimit);
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
	filterOnDensity: filterOnDensity
};

},{"../helpers/getLanguage.js":190,"../researches/english/functionWords.js":194,"../researches/german/functionWords.js":197,"../stringProcessing/getSentences":202,"../stringProcessing/getWords":203,"../stringProcessing/quotes.js":204,"../stringProcessing/syllables/count.js":210,"../values/WordCombination":212,"lodash/filter":141,"lodash/flatMap":144,"lodash/forEach":146,"lodash/has":148,"lodash/includes":151,"lodash/intersection":152,"lodash/isEmpty":158,"lodash/map":171,"lodash/take":178,"lodash/values":184}],206:[function(require,module,exports){
"use strict";

// Replace all other punctuation characters at the beginning or at the end of a word.
var punctuationRegexString = "[\\\u2013\\-\\(\\)_\\[\\]\u2019\u201C\u201D\"'.?!:;,\xBF\xA1\xAB\xBB\u2014\xD7+&]+";
var punctuationRegexStart = new RegExp("^" + punctuationRegexString);
var punctuationRegexEnd = new RegExp(punctuationRegexString + "$");

/**
 * Replaces punctuation characters from the given text string.
 *
 * @param {String} text The text to remove the punctuation characters for.
 *
 * @returns {String} The sanitized text.
 */
module.exports = function (text) {
  text = text.replace(punctuationRegexStart, "");
  text = text.replace(punctuationRegexEnd, "");

  return text;
};

},{}],207:[function(require,module,exports){
"use strict";

/** @module stringProcessing/stripHTMLTags */

var stripSpaces = require("../stringProcessing/stripSpaces.js");

var blockElements = require("../helpers/html.js").blockElements;

var blockElementStartRegex = new RegExp("^<(" + blockElements.join("|") + ")[^>]*?>", "i");
var blockElementEndRegex = new RegExp("</(" + blockElements.join("|") + ")[^>]*?>$", "i");

/**
 * Strip incomplete tags within a text. Strips an endtag at the beginning of a string and the start tag at the end of a
 * start of a string.
 * @param {String} text The text to strip the HTML-tags from at the begin and end.
 * @returns {String} The text without HTML-tags at the begin and end.
 */
var stripIncompleteTags = function stripIncompleteTags(text) {
  text = text.replace(/^(<\/([^>]+)>)+/i, "");
  text = text.replace(/(<([^\/>]+)>)+$/i, "");
  return text;
};

/**
 * Removes the block element tags at the beginning and end of a string and returns this string.
 *
 * @param {string} text The unformatted string.
 * @returns {string} The text with removed HTML begin and end block elements
 */
var stripBlockTagsAtStartEnd = function stripBlockTagsAtStartEnd(text) {
  text = text.replace(blockElementStartRegex, "");
  text = text.replace(blockElementEndRegex, "");
  return text;
};

/**
 * Strip HTML-tags from text
 *
 * @param {String} text The text to strip the HTML-tags from.
 * @returns {String} The text without HTML-tags.
 */
var stripFullTags = function stripFullTags(text) {
  text = text.replace(/(<([^>]+)>)/ig, " ");
  text = stripSpaces(text);
  return text;
};

module.exports = {
  stripFullTags: stripFullTags,
  stripIncompleteTags: stripIncompleteTags,
  stripBlockTagsAtStartEnd: stripBlockTagsAtStartEnd
};

},{"../helpers/html.js":191,"../stringProcessing/stripSpaces.js":208}],208:[function(require,module,exports){
"use strict";

/** @module stringProcessing/stripSpaces */

/**
 * Strip double spaces from text
 *
 * @param {String} text The text to strip spaces from.
 * @returns {String} The text without double spaces
 */
module.exports = function (text) {
	// Replace multiple spaces with single space
	text = text.replace(/\s{2,}/g, " ");

	// Replace spaces followed by periods with only the period.
	text = text.replace(/\s\./g, ".");

	// Remove first/last character if space
	text = text.replace(/^\s+|\s+$/g, "");

	return text;
};

},{}],209:[function(require,module,exports){
"use strict";

var isUndefined = require("lodash/isUndefined");
var pick = require("lodash/pick");

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
function DeviationFragment(options) {
	this._location = options.location;
	this._fragment = options.word;
	this._syllables = options.syllables;
	this._regex = null;

	this._options = pick(options, ["notFollowedBy", "alsoFollowedBy"]);
}

/**
 * Creates a regex that matches this fragment inside a word.
 *
 * @returns {void}
 */
DeviationFragment.prototype.createRegex = function () {
	var regexString = "";
	var options = this._options;

	var fragment = this._fragment;

	if (!isUndefined(options.notFollowedBy)) {
		fragment += "(?![" + options.notFollowedBy.join("") + "])";
	}

	if (!isUndefined(options.alsoFollowedBy)) {
		fragment += "[" + options.alsoFollowedBy.join("") + "]?";
	}

	switch (this._location) {
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

	this._regex = new RegExp(regexString);
};

/**
 * Returns the regex that matches this fragment inside a word.
 *
 * @returns {RegExp} The regexp that matches this fragment.
 */
DeviationFragment.prototype.getRegex = function () {
	if (null === this._regex) {
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
DeviationFragment.prototype.occursIn = function (word) {
	var regex = this.getRegex();

	return regex.test(word);
};

/**
 * Removes this fragment from the given word.
 *
 * @param {string} word The word to remove this fragment from.
 * @returns {string} The modified word.
 */
DeviationFragment.prototype.removeFrom = function (word) {
	// Replace by a space to keep the remaining parts separated.
	return word.replace(this._fragment, " ");
};

/**
 * Returns the amount of syllables for this fragment.
 *
 * @returns {number} The amount of syllables for this fragment.
 */
DeviationFragment.prototype.getSyllables = function () {
	return this._syllables;
};

module.exports = DeviationFragment;

},{"lodash/isUndefined":169,"lodash/pick":174}],210:[function(require,module,exports){
"use strict";

/** @module stringProcessing/countSyllables */

var syllableMatchers = require("../../config/syllables.js");

var getWords = require("../getWords.js");

var forEach = require("lodash/forEach");
var filter = require("lodash/filter");
var find = require("lodash/find");
var isUndefined = require("lodash/isUndefined");
var map = require("lodash/map");
var sum = require("lodash/sum");
var memoize = require("lodash/memoize");
var flatMap = require("lodash/flatMap");

var SyllableCountIterator = require("../../helpers/syllableCountIterator.js");
var DeviationFragment = require("./DeviationFragment");

/**
 * Counts vowel groups inside a word.
 *
 * @param {string} word A text with words to count syllables.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {number} the syllable count.
 */
var countVowelGroups = function countVowelGroups(word, locale) {
	var numberOfSyllables = 0;
	var vowelRegex = new RegExp("[^" + syllableMatchers(locale).vowels + "]", "ig");
	var foundVowels = word.split(vowelRegex);
	var filteredWords = filter(foundVowels, function (vowel) {
		return vowel !== "";
	});
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
var countVowelDeviations = function countVowelDeviations(word, locale) {
	var syllableCountIterator = new SyllableCountIterator(syllableMatchers(locale));
	return syllableCountIterator.countSyllables(word);
};

/**
 * Returns the number of syllables for the word if it is in the list of full word deviations.
 *
 * @param {String} word The word to retrieve the syllables for.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {number} The number of syllables found.
 */
var countFullWordDeviations = function countFullWordDeviations(word, locale) {
	var fullWordDeviations = syllableMatchers(locale).deviations.words.full;

	var deviation = find(fullWordDeviations, function (fullWordDeviation) {
		return fullWordDeviation.word === word;
	});

	if (!isUndefined(deviation)) {
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
function createDeviationFragments(syllableConfig) {
	var deviationFragments = [];

	var deviations = syllableConfig.deviations;

	if (!isUndefined(deviations.words) && !isUndefined(deviations.words.fragments)) {
		deviationFragments = flatMap(deviations.words.fragments, function (fragments, fragmentLocation) {
			return map(fragments, function (fragment) {
				fragment.location = fragmentLocation;

				return new DeviationFragment(fragment);
			});
		});
	}

	return deviationFragments;
}

var createDeviationFragmentsMemoized = memoize(createDeviationFragments);

/**
 * Counts syllables in partial exclusions. If these are found, returns the number of syllables  found, and the modified word.
 * The word is modified so the excluded part isn't counted by the normal syllable counter.
 *
 * @param {String} word The word to count syllables of.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {object} The number of syllables found and the modified word.
 */
var countPartialWordDeviations = function countPartialWordDeviations(word, locale) {
	var deviationFragments = createDeviationFragmentsMemoized(syllableMatchers(locale));
	var remainingParts = word;
	var syllableCount = 0;

	forEach(deviationFragments, function (deviationFragment) {
		if (deviationFragment.occursIn(remainingParts)) {
			remainingParts = deviationFragment.removeFrom(remainingParts);
			syllableCount += deviationFragment.getSyllables();
		}
	});

	return { word: remainingParts, syllableCount: syllableCount };
};

/**
 * Count the number of syllables in a word, using vowels and exceptions.
 *
 * @param {String} word The word to count the number of syllables of.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {number} The number of syllables found in a word.
 */
var countUsingVowels = function countUsingVowels(word, locale) {
	var syllableCount = 0;

	syllableCount += countVowelGroups(word, locale);
	syllableCount += countVowelDeviations(word, locale);

	return syllableCount;
};

/**
 * Counts the number of syllables in a word.
 *
 * @param {string} word The word to count syllables of.
 * @param {string} locale The locale of the word.
 * @returns {number} The syllable count for the word.
 */
var countSyllablesInWord = function countSyllablesInWord(word, locale) {
	var syllableCount = 0;

	var fullWordExclusion = countFullWordDeviations(word, locale);
	if (fullWordExclusion !== 0) {
		return fullWordExclusion;
	}

	var partialExclusions = countPartialWordDeviations(word, locale);
	word = partialExclusions.word;
	syllableCount += partialExclusions.syllableCount;
	syllableCount += countUsingVowels(word, locale);

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
var countSyllablesInText = function countSyllablesInText(text, locale) {
	text = text.toLocaleLowerCase();
	var words = getWords(text);

	var syllableCounts = map(words, function (word) {
		return countSyllablesInWord(word, locale);
	});

	return sum(syllableCounts);
};

module.exports = countSyllablesInText;

},{"../../config/syllables.js":186,"../../helpers/syllableCountIterator.js":192,"../getWords.js":203,"./DeviationFragment":209,"lodash/filter":141,"lodash/find":142,"lodash/flatMap":144,"lodash/forEach":146,"lodash/isUndefined":169,"lodash/map":171,"lodash/memoize":172,"lodash/sum":177}],211:[function(require,module,exports){
"use strict";

/** @module stringProcessing/unifyWhitespace */

/**
 * Replaces a non breaking space with a normal space
 * @param {string} text The string to replace the non breaking space in.
 * @returns {string} The text with unified spaces.
 */
var unifyNonBreakingSpace = function unifyNonBreakingSpace(text) {
  return text.replace(/&nbsp;/g, " ");
};

/**
 * Replaces all whitespaces with a normal space
 * @param {string} text The string to replace the non breaking space in.
 * @returns {string} The text with unified spaces.
 */
var unifyWhiteSpace = function unifyWhiteSpace(text) {
  return text.replace(/\s/g, " ");
};

/**
 * Converts all whitespace to spaces.
 *
 * @param {string} text The text to replace spaces.
 * @returns {string} The text with unified spaces.
 */
var unifyAllSpaces = function unifyAllSpaces(text) {
  text = unifyNonBreakingSpace(text);
  return unifyWhiteSpace(text);
};

module.exports = {
  unifyNonBreakingSpace: unifyNonBreakingSpace,
  unifyWhiteSpace: unifyWhiteSpace,
  unifyAllSpaces: unifyAllSpaces
};

},{}],212:[function(require,module,exports){
"use strict";

var forEach = require("lodash/forEach");
var has = require("lodash/has");

/**
 * Returns whether or not the given word is a function word.
 *
 * @param {string} word The word to check.
 * @param {Function} functionWords The function containing the lists of function words.
 * @returns {boolean} Whether or not the word is a function word.
 */
function isFunctionWord(word, functionWords) {
  return -1 !== functionWords.indexOf(word.toLocaleLowerCase());
}

/**
 * Represents a word combination in the context of relevant words.
 *
 * @constructor
 *
 * @param {string[]} words The list of words that this combination consists of.
 * @param {number} [occurrences] The number of occurrences, defaults to 0.
 * @param {Function} functionWords The function containing the lists of function words.
 */
function WordCombination(words, occurrences, functionWords) {
  this._words = words;
  this._length = words.length;
  this._occurrences = occurrences || 0;
  this._functionWords = functionWords;
}

WordCombination.lengthBonus = {
  2: 3,
  3: 7,
  4: 12,
  5: 18
};

/**
 * Returns the base relevance based on the length of this combination.
 *
 * @returns {number} The base relevance based on the length.
 */
WordCombination.prototype.getLengthBonus = function () {
  if (has(WordCombination.lengthBonus, this._length)) {
    return WordCombination.lengthBonus[this._length];
  }

  return 0;
};

/**
 * Returns the list with words.
 *
 * @returns {array} The list with words.
 */
WordCombination.prototype.getWords = function () {
  return this._words;
};

/**
 * Returns the word combination length.
 *
 * @returns {number} The word combination length.
 */
WordCombination.prototype.getLength = function () {
  return this._length;
};

/**
 * Returns the combination as it occurs in the text.
 *
 * @returns {string} The combination.
 */
WordCombination.prototype.getCombination = function () {
  return this._words.join(" ");
};

/**
 * Returns the amount of occurrences of this word combination.
 *
 * @returns {number} The amount of occurrences.
 */
WordCombination.prototype.getOccurrences = function () {
  return this._occurrences;
};

/**
 * Increments the occurrences.
 *
 * @returns {void}
 */
WordCombination.prototype.incrementOccurrences = function () {
  this._occurrences += 1;
};

/**
 * Returns the relevance of the length.
 *
 * @param {number} relevantWordPercentage The relevance of the words within the combination.
 * @returns {number} The relevance based on the length and the word relevance.
 */
WordCombination.prototype.getMultiplier = function (relevantWordPercentage) {
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
WordCombination.prototype.isRelevantWord = function (word) {
  return has(this._relevantWords, word);
};

/**
 * Returns the relevance of the words within this combination.
 *
 * @returns {number} The percentage of relevant words inside this combination.
 */
WordCombination.prototype.getRelevantWordPercentage = function () {
  var relevantWordCount = 0,
      wordRelevance = 1;

  if (this._length > 1) {
    forEach(this._words, function (word) {
      if (this.isRelevantWord(word)) {
        relevantWordCount += 1;
      }
    }.bind(this));

    wordRelevance = relevantWordCount / this._length;
  }

  return wordRelevance;
};

/**
 * Returns the relevance for this word combination.
 *
 * @returns {number} The relevance of this word combination.
 */
WordCombination.prototype.getRelevance = function () {
  if (this._words.length === 1 && isFunctionWord(this._words[0], this._functionWords)) {
    return 0;
  }

  var wordRelevance = this.getRelevantWordPercentage();
  if (wordRelevance === 0) {
    return 0;
  }

  return this.getMultiplier(wordRelevance) * this._occurrences;
};

/**
 * Sets the relevance of single words
 *
 * @param {Object} relevantWords A mapping from a word to a relevance.
 * @returns {void}
 */
WordCombination.prototype.setRelevantWords = function (relevantWords) {
  this._relevantWords = relevantWords;
};

/**
 * Returns the density of this combination within the text.
 *
 * @param {number} wordCount The word count of the text this combination was found in.
 * @returns {number} The density of this combination.
 */
WordCombination.prototype.getDensity = function (wordCount) {
  return this._occurrences / wordCount;
};

module.exports = WordCombination;

},{"lodash/forEach":146,"lodash/has":148}]},{},[6])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvanMvc3JjL2hlbHBlcnMvcmVzdEFwaS5qcyIsImFzc2V0cy9qcy9zcmMva2V5d29yZFN1Z2dlc3Rpb25zL1Byb21pbmVudFdvcmRDYWNoZS5qcyIsImFzc2V0cy9qcy9zcmMva2V5d29yZFN1Z2dlc3Rpb25zL1Byb21pbmVudFdvcmRDYWNoZVBvcHVsYXRvci5qcyIsImFzc2V0cy9qcy9zcmMva2V5d29yZFN1Z2dlc3Rpb25zL1Byb21pbmVudFdvcmRTdG9yYWdlLmpzIiwiYXNzZXRzL2pzL3NyYy9rZXl3b3JkU3VnZ2VzdGlvbnMvc2l0ZVdpZGVDYWxjdWxhdGlvbi5qcyIsImFzc2V0cy9qcy9zcmMvc2l0ZS13aWRlLWFuYWx5c2lzLmpzIiwibm9kZV9tb2R1bGVzL2ExMXktc3BlYWsvYTExeS1zcGVhay5qcyIsIm5vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fRGF0YVZpZXcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19IYXNoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fTGlzdENhY2hlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fTWFwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fTWFwQ2FjaGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19Qcm9taXNlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fU2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fU2V0Q2FjaGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19TdGFjay5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1N5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1VpbnQ4QXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19XZWFrTWFwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXBwbHkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUVhY2guanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUZpbHRlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5SW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUluY2x1ZGVzV2l0aC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5TGlrZUtleXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheU1hcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5UHVzaC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FycmF5U29tZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Fzc2lnblZhbHVlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNzb2NJbmRleE9mLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUFzc2lnblZhbHVlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUVhY2guanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRmlsdGVyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUZpbmRJbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGbGF0dGVuLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUZvci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VGb3JPd24uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldFRhZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VIYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSGFzSW4uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSW5kZXhPZi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJbnRlcnNlY3Rpb24uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNBcmd1bWVudHMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNFcXVhbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc0VxdWFsRGVlcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJc01hdGNoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzTmFOLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzTmF0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUlzVHlwZWRBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VJdGVyYXRlZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VLZXlzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZU1hcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VNYXRjaGVzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZU1hdGNoZXNQcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VQaWNrLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVBpY2tCeS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VQcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VQcm9wZXJ0eURlZXAuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlUHJvcGVydHlPZi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VSZXN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVNldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VTZXRUb1N0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VTbGljZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VTdW0uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVGltZXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVG9TdHJpbmcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVW5hcnkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVmFsdWVzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY2FjaGVIYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jYXN0QXJyYXlMaWtlT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY2FzdEZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY2FzdFBhdGguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jb3JlSnNEYXRhLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlQmFzZUVhY2guanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVCYXNlRm9yLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlRmluZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2RlZmluZVByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZXF1YWxBcnJheXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19lcXVhbEJ5VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZXF1YWxPYmplY3RzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZmxhdFJlc3QuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0TWFwRGF0YS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldE1hdGNoRGF0YS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldE5hdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFJhd1RhZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFRhZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFZhbHVlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzUGF0aC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hDbGVhci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hEZWxldGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoR2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaEhhcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hTZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc0ZsYXR0ZW5hYmxlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faXNJbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzS2V5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faXNLZXlhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faXNNYXNrZWQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pc1Byb3RvdHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2lzU3RyaWN0Q29tcGFyYWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2xpc3RDYWNoZUNsZWFyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlRGVsZXRlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlR2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlU2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVDbGVhci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlRGVsZXRlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVHZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZUhhcy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlU2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwVG9BcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX21hdGNoZXNTdHJpY3RDb21wYXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWVtb2l6ZUNhcHBlZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX25hdGl2ZUNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX25hdGl2ZUtleXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19ub2RlVXRpbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX29iamVjdFRvU3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fb3ZlckFyZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX292ZXJSZXN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fcm9vdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3NldENhY2hlQWRkLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc2V0Q2FjaGVIYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zZXRUb0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc2V0VG9TdHJpbmcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zaG9ydE91dC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrQ2xlYXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0RlbGV0ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrR2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tIYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja1NldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0cmljdEluZGV4T2YuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zdHJpbmdUb1BhdGguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL190b0tleS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3RvU291cmNlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fdW5lc2NhcGVIdG1sQ2hhci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvY29uc3RhbnQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2VxLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9maWx0ZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ZpbmQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ZpbmRJbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvZmxhdE1hcC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvZmxhdHRlbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvZm9yRWFjaC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvZ2V0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9oYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2hhc0luLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pZGVudGl0eS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2ludGVyc2VjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNBcmd1bWVudHMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJyYXlMaWtlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5TGlrZU9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNCdWZmZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzRW1wdHkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzRXF1YWwuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzRnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzTGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc05hTi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNOdW1iZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdExpa2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzU3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc1N5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvaXNUeXBlZEFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9pc1VuZGVmaW5lZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gva2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvbWFwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9tZW1vaXplLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9uZWdhdGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3BpY2suanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3Byb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9zdHViRmFsc2UuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3N1bS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvdGFrZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvdG9GaW5pdGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3RvSW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvdG9OdW1iZXIuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL3RvU3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC91bmVzY2FwZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvdmFsdWVzLmpzIiwibm9kZV9tb2R1bGVzL3Rva2VuaXplcjIvY29yZS5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9jb25maWcvc3lsbGFibGVzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL2NvbmZpZy9zeWxsYWJsZXMvZGUuanNvbiIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9jb25maWcvc3lsbGFibGVzL2VuLmpzb24iLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvY29uZmlnL3N5bGxhYmxlcy9ubC5qc29uIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL2hlbHBlcnMvZ2V0TGFuZ3VhZ2UuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvaGVscGVycy9odG1sLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL2hlbHBlcnMvc3lsbGFibGVDb3VudEl0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL2hlbHBlcnMvc3lsbGFibGVDb3VudFN0ZXAuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvcmVzZWFyY2hlcy9lbmdsaXNoL2Z1bmN0aW9uV29yZHMuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvcmVzZWFyY2hlcy9lbmdsaXNoL3Bhc3NpdmV2b2ljZS9hdXhpbGlhcmllcy5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9yZXNlYXJjaGVzL2VuZ2xpc2gvdHJhbnNpdGlvbldvcmRzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3Jlc2VhcmNoZXMvZ2VybWFuL2Z1bmN0aW9uV29yZHMuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvcmVzZWFyY2hlcy9nZXJtYW4vcGFzc2l2ZXZvaWNlL2F1eGlsaWFyaWVzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3Jlc2VhcmNoZXMvZ2VybWFuL3RyYW5zaXRpb25Xb3Jkcy5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9zdHJpbmdQcm9jZXNzaW5nL2FkZFdvcmRib3VuZGFyeS5qcyIsIm5vZGVfbW9kdWxlcy95b2FzdHNlby9qcy9zdHJpbmdQcm9jZXNzaW5nL2NyZWF0ZVJlZ2V4RnJvbUFycmF5LmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3NpbmcvZ2V0U2VudGVuY2VzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3NpbmcvZ2V0V29yZHMuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy9xdW90ZXMuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy9yZWxldmFudFdvcmRzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3NpbmcvcmVtb3ZlUHVuY3R1YXRpb24uanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy9zdHJpcEhUTUxUYWdzLmpzIiwibm9kZV9tb2R1bGVzL3lvYXN0c2VvL2pzL3N0cmluZ1Byb2Nlc3Npbmcvc3RyaXBTcGFjZXMuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy9zeWxsYWJsZXMvRGV2aWF0aW9uRnJhZ21lbnQuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy9zeWxsYWJsZXMvY291bnQuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy91bmlmeVdoaXRlc3BhY2UuanMiLCJub2RlX21vZHVsZXMveW9hc3RzZW8vanMvdmFsdWVzL1dvcmRDb21iaW5hdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7QUNBQTs7O0lBR00sTzs7QUFFTDs7Ozs7O0FBTUEsd0JBQWtDO0FBQUEsTUFBbkIsT0FBbUIsUUFBbkIsT0FBbUI7QUFBQSxNQUFWLEtBQVUsUUFBVixLQUFVOztBQUFBOztBQUNqQyxPQUFLLFFBQUwsR0FBZ0IsT0FBaEI7QUFDQSxPQUFLLE1BQUwsR0FBYyxLQUFkO0FBQ0E7O0FBRUQ7Ozs7Ozs7Ozs7O3NCQU9LLEksRUFBTSxNLEVBQVM7QUFDbkIsWUFBUyxPQUFPLE1BQVAsQ0FBZSxNQUFmLEVBQXVCO0FBQy9CLFVBQU0sS0FEeUI7QUFFL0IsU0FBSyxLQUFLLFFBQUwsR0FBZ0I7QUFGVSxJQUF2QixDQUFUOztBQUtBLFVBQU8sS0FBSyxPQUFMLENBQWMsTUFBZCxDQUFQO0FBQ0E7O0FBRUQ7Ozs7Ozs7Ozs7dUJBT00sSSxFQUFNLE0sRUFBUztBQUNwQixZQUFTLE9BQU8sTUFBUCxDQUFlLE1BQWYsRUFBdUI7QUFDL0IsVUFBTSxNQUR5QjtBQUUvQixTQUFLLEtBQUssUUFBTCxHQUFnQjtBQUZVLElBQXZCLENBQVQ7O0FBS0EsVUFBTyxLQUFLLE9BQUwsQ0FBYyxNQUFkLENBQVA7QUFDQTs7QUFFRDs7Ozs7Ozs7OzBCQU1TLE0sRUFBUztBQUFBOztBQUNqQixVQUFPLElBQUksT0FBSixDQUFhLFVBQUUsT0FBRixFQUFXLE1BQVgsRUFBdUI7QUFDMUMsYUFBUyxPQUFPLE1BQVAsQ0FBZSxNQUFmLEVBQXVCO0FBQy9CLGlCQUFZLG9CQUFFLEdBQUYsRUFBVztBQUN0QixVQUFJLGdCQUFKLENBQXNCLFlBQXRCLEVBQW9DLE1BQUssTUFBekM7QUFDQSxNQUg4QjtBQUkvQixjQUFTLE9BSnNCO0FBSy9CLFlBQU87QUFMd0IsS0FBdkIsQ0FBVDs7QUFRQSxXQUFPLElBQVAsQ0FBYSxNQUFiO0FBQ0EsSUFWTSxDQUFQO0FBV0E7Ozs7OztrQkFHYSxPOzs7Ozs7Ozs7Ozs7O0FDckVmOzs7SUFHTSxrQjs7QUFFTDs7O0FBR0EsK0JBQWM7QUFBQTs7QUFDYixPQUFLLE1BQUwsR0FBYyxFQUFkO0FBQ0E7O0FBRUQ7Ozs7Ozs7Ozs7d0JBTU8sSSxFQUFPO0FBQ2IsT0FBSyxLQUFLLE1BQUwsQ0FBWSxjQUFaLENBQTRCLElBQTVCLENBQUwsRUFBMEM7QUFDekMsV0FBTyxLQUFLLE1BQUwsQ0FBYSxJQUFiLENBQVA7QUFDQTs7QUFFRCxVQUFPLENBQVA7QUFDQTs7QUFFRDs7Ozs7Ozs7Ozt3QkFPTyxJLEVBQU0sRSxFQUFLO0FBQ2pCLFFBQUssTUFBTCxDQUFhLElBQWIsSUFBc0IsRUFBdEI7QUFDQTs7Ozs7O2tCQUdhLGtCOzs7Ozs7Ozs7OztBQ3RDZjs7Ozs7Ozs7QUFFQTs7O0lBR00sMkI7O0FBRUw7Ozs7OztBQU1BLDRDQUFrQztBQUFBLE1BQW5CLEtBQW1CLFFBQW5CLEtBQW1CO0FBQUEsTUFBWixPQUFZLFFBQVosT0FBWTs7QUFBQTs7QUFDakMsT0FBSyxNQUFMLEdBQWMsS0FBZDtBQUNBLE9BQUssUUFBTCxHQUFnQixPQUFoQjtBQUNBLE9BQUssWUFBTCxHQUFvQixDQUFwQjs7QUFFQSxPQUFLLG9CQUFMLEdBQTRCLEtBQUssb0JBQUwsQ0FBMEIsSUFBMUIsQ0FBZ0MsSUFBaEMsQ0FBNUI7QUFDQTs7QUFFRDs7Ozs7Ozs7OzZCQUtXO0FBQUE7O0FBQ1YsT0FBSSxPQUFPO0FBQ1YsY0FBVSxHQURBO0FBRVYsVUFBTSxLQUFLO0FBRkQsSUFBWDs7QUFLQSxVQUFPLEtBQUssUUFBTCxDQUFjLEdBQWQsQ0FBbUIsMkJBQW5CLEVBQWdELEVBQUUsVUFBRixFQUFoRCxFQUEyRCxJQUEzRCxDQUFpRSxVQUFFLE1BQUYsRUFBYztBQUNyRixRQUFLLE9BQU8sTUFBUCxLQUFrQixDQUF2QixFQUEyQjtBQUMxQjtBQUNBOztBQUVELFdBQU8sT0FBUCxDQUFnQixNQUFLLG9CQUFyQjs7QUFFQSxVQUFLLFlBQUwsSUFBcUIsQ0FBckI7O0FBRUEsV0FBTyxNQUFLLFFBQUwsRUFBUDtBQUNBLElBVk0sQ0FBUDtBQVdBOztBQUVEOzs7Ozs7Ozs7dUNBTXNCLGEsRUFBZ0I7QUFDckMsT0FBSSxPQUFPLHdCQUFVLGNBQWMsSUFBeEIsQ0FBWDs7QUFFQSxRQUFLLE1BQUwsQ0FBWSxLQUFaLENBQW1CLElBQW5CLEVBQXlCLGNBQWMsRUFBdkM7QUFDQTs7Ozs7O2tCQUdhLDJCOzs7Ozs7Ozs7OztBQzFEZjs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBOzs7SUFHTSxvQjs7O0FBQ0w7Ozs7Ozs7O0FBUUEscUNBQW9HO0FBQUEsTUFBckYsTUFBcUYsUUFBckYsTUFBcUY7QUFBQSxNQUE3RSxPQUE2RSxRQUE3RSxPQUE2RTtBQUFBLE1BQXBFLEtBQW9FLFFBQXBFLEtBQW9FO0FBQUEsbUNBQTdELGdCQUE2RDtBQUFBLE1BQTdELGdCQUE2RCx5Q0FBMUMsRUFBMEM7QUFBQSwrQkFBdEMsWUFBc0M7QUFBQSxNQUF0QyxZQUFzQyxxQ0FBdkIsSUFBdUI7QUFBQSx3QkFBakIsS0FBaUI7QUFBQSxNQUFqQixLQUFpQiw4QkFBVCxJQUFTOztBQUFBOztBQUFBOztBQUduRyxRQUFLLFFBQUwsR0FBZ0IsT0FBaEI7QUFDQSxRQUFLLE1BQUwsR0FBYyxLQUFkO0FBQ0EsUUFBSyxPQUFMLEdBQWUsTUFBZjtBQUNBLFFBQUsscUJBQUwsR0FBNkIsS0FBN0I7QUFDQSxRQUFLLHVCQUFMLEdBQStCLElBQS9COztBQUVBLFFBQUssaUJBQUwsR0FBeUIsZ0JBQXpCO0FBQ0EsTUFBSyxpQkFBaUIsSUFBdEIsRUFBNkI7QUFDNUIsU0FBSyxpQkFBTCxHQUF5QixNQUFLLFFBQUwsR0FBZ0IsUUFBaEIsR0FBMkIsWUFBM0IsR0FBMEMsR0FBMUMsR0FBZ0QsTUFBSyxPQUE5RTtBQUNBOztBQUVELE1BQUssVUFBVSxJQUFmLEVBQXNCO0FBQ3JCLFdBQVEsa0NBQVI7QUFDQTtBQUNELFFBQUssTUFBTCxHQUFjLEtBQWQ7O0FBRUEsUUFBSyx1QkFBTCxHQUErQixNQUFLLHVCQUFMLENBQTZCLElBQTdCLE9BQS9CO0FBbkJtRztBQW9Cbkc7O0FBRUQ7Ozs7Ozs7Ozs7cUNBTW9CLGMsRUFBaUI7QUFBQTs7QUFDcEM7QUFDQSxPQUFLLEtBQUsscUJBQVYsRUFBa0M7QUFDakM7QUFDQTtBQUNELFFBQUsscUJBQUwsR0FBNkIsSUFBN0I7O0FBRUEsT0FBSSxtQkFBbUIsZUFBZSxLQUFmLENBQXNCLENBQXRCLEVBQXlCLEVBQXpCLENBQXZCOztBQUVBO0FBQ0EsT0FBSSxtQkFBbUIsaUJBQWlCLE1BQWpCLENBQXlCLFVBQUUsZUFBRixFQUFtQixhQUFuQixFQUFzQztBQUNyRixXQUFPLGdCQUFnQixJQUFoQixDQUFzQixVQUFFLEdBQUYsRUFBVztBQUN2QyxZQUFPLE9BQUssdUJBQUwsQ0FBOEIsYUFBOUIsRUFBOEMsSUFBOUMsQ0FBb0QsVUFBRSxLQUFGLEVBQWE7QUFDdkUsVUFBSSxJQUFKLENBQVUsS0FBVjs7QUFFQSxhQUFPLEdBQVA7O0FBRUQ7QUFDQyxNQU5NLEVBTUosWUFBTTtBQUNSLGFBQU8sR0FBUDtBQUNBLE1BUk0sQ0FBUDtBQVNBLEtBVk0sQ0FBUDtBQVdBLElBWnNCLEVBWXBCLFFBQVEsT0FBUixDQUFpQixFQUFqQixDQVpvQixDQUF2Qjs7QUFjQSxVQUFPLGlCQUFpQixJQUFqQixDQUF1QixVQUFFLGNBQUYsRUFBc0I7QUFDbkQsUUFBSyx1QkFBUyxjQUFULEVBQXlCLE9BQUssdUJBQTlCLENBQUwsRUFBK0Q7QUFDOUQsWUFBSyxxQkFBTCxHQUE2QixLQUE3QjtBQUNBLFlBQU8sUUFBUSxPQUFSLEVBQVA7QUFDQTtBQUNELFdBQUssdUJBQUwsR0FBK0IsY0FBL0I7O0FBRUEsV0FBTyxJQUFJLE9BQUosQ0FBYSxVQUFFLE9BQUYsRUFBVyxNQUFYLEVBQXVCO0FBQzFDLFlBQU8sSUFBUCxDQUFhO0FBQ1osWUFBTSxNQURNO0FBRVosV0FBSyxPQUFLLGlCQUZFO0FBR1osa0JBQVksb0JBQUUsR0FBRixFQUFXO0FBQ3RCLFdBQUksZ0JBQUosQ0FBc0IsWUFBdEIsRUFBb0MsT0FBSyxNQUF6QztBQUNBLE9BTFc7QUFNWixZQUFNO0FBQ0w7QUFDQSw0QkFBcUI7QUFGaEIsT0FOTTtBQVVaLGdCQUFVLE1BVkU7QUFXWixlQUFTLE9BWEc7QUFZWixhQUFPO0FBWkssTUFBYixFQWFJLE1BYkosQ0FhWSxZQUFNO0FBQ2pCLGFBQUssSUFBTCxDQUFXLHFCQUFYLEVBQWtDLGNBQWxDOztBQUVBLGFBQUsscUJBQUwsR0FBNkIsS0FBN0I7QUFDQSxNQWpCRDtBQWtCQSxLQW5CTSxDQUFQO0FBb0JBLElBM0JNLEVBMkJILEtBM0JHLENBMkJJLFVBQUMsQ0FBRCxFQUFPLENBQUUsQ0EzQmIsQ0FBUDtBQTRCQTs7QUFFRDs7Ozs7Ozs7OzBDQU15QixhLEVBQWdCO0FBQUE7O0FBQ3hDLE9BQUksV0FBVyxLQUFLLE1BQUwsQ0FBWSxLQUFaLENBQW1CLGNBQWMsY0FBZCxFQUFuQixDQUFmO0FBQ0EsT0FBSyxNQUFNLFFBQVgsRUFBc0I7QUFDckIsV0FBTyxRQUFRLE9BQVIsQ0FBaUIsUUFBakIsQ0FBUDtBQUNBOztBQUVELE9BQUkscUJBQXFCLElBQUksT0FBSixDQUFhLFVBQUUsT0FBRixFQUFXLE1BQVgsRUFBdUI7QUFDNUQsV0FBTyxJQUFQLENBQWE7QUFDWixXQUFNLEtBRE07QUFFWixVQUFLLE9BQUssUUFBTCxHQUFnQiwwQkFGVDtBQUdaLGlCQUFZLG9CQUFFLEdBQUYsRUFBVztBQUN0QixVQUFJLGdCQUFKLENBQXNCLFlBQXRCLEVBQW9DLE9BQUssTUFBekM7QUFDQSxNQUxXO0FBTVosV0FBTTtBQUNMLFlBQU0sY0FBYyxjQUFkO0FBREQsTUFOTTtBQVNaLGVBQVUsTUFURTtBQVVaLGNBQVMsaUJBQVUsUUFBVixFQUFxQjtBQUM3QixjQUFTLFFBQVQ7QUFDQSxNQVpXO0FBYVosWUFBTyxlQUFVLFFBQVYsRUFBcUI7QUFDM0IsYUFBUSxRQUFSO0FBQ0E7QUFmVyxLQUFiO0FBaUJBLElBbEJ3QixDQUF6Qjs7QUFvQkEsT0FBSSx1QkFBdUIsbUJBQW1CLElBQW5CLENBQXlCLFVBQUUsaUJBQUYsRUFBeUI7QUFDNUUsUUFBSyxzQkFBc0IsSUFBM0IsRUFBa0M7QUFDakMsWUFBTyxPQUFLLHVCQUFMLENBQThCLGFBQTlCLENBQVA7QUFDQTs7QUFFRCxXQUFPLGlCQUFQO0FBQ0EsSUFOMEIsQ0FBM0I7O0FBUUEsVUFBTyxxQkFBcUIsSUFBckIsQ0FBMkIsVUFBRSxpQkFBRixFQUF5QjtBQUMxRCxXQUFLLE1BQUwsQ0FBWSxLQUFaLENBQW1CLGNBQWMsY0FBZCxFQUFuQixFQUFtRCxrQkFBa0IsRUFBckU7O0FBRUEsV0FBTyxrQkFBa0IsRUFBekI7QUFDQSxJQUpNLENBQVA7QUFLQTs7QUFFRDs7Ozs7Ozs7OzBDQU15QixhLEVBQWdCO0FBQUE7O0FBQ3hDLFVBQU8sSUFBSSxPQUFKLENBQWEsVUFBRSxPQUFGLEVBQVcsTUFBWCxFQUF1QjtBQUMxQyxXQUFPLElBQVAsQ0FBYTtBQUNaLFdBQU0sTUFETTtBQUVaLFVBQUssT0FBSyxRQUFMLEdBQWdCLDJCQUZUO0FBR1osaUJBQVksb0JBQUUsR0FBRixFQUFXO0FBQ3RCLFVBQUksZ0JBQUosQ0FBc0IsWUFBdEIsRUFBb0MsT0FBSyxNQUF6QztBQUNBLE1BTFc7QUFNWixXQUFNO0FBQ0wsWUFBTSxjQUFjLGNBQWQ7QUFERCxNQU5NO0FBU1osZUFBVSxNQVRFO0FBVVosY0FBUyxpQkFBVSxRQUFWLEVBQXFCO0FBQzdCLGNBQVMsUUFBVDtBQUNBLE1BWlc7QUFhWixZQUFPLGVBQVUsUUFBVixFQUFxQjtBQUMzQixhQUFRLFFBQVI7QUFDQTtBQWZXLEtBQWI7QUFpQkEsSUFsQk0sQ0FBUDtBQW1CQTs7Ozs7O2tCQUdhLG9COzs7Ozs7Ozs7OztBQzlLZjs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLElBQUksZUFBZSxDQUFFLFFBQUYsRUFBWSxPQUFaLEVBQXFCLFNBQXJCLEVBQWdDLFNBQWhDLEVBQTJDLFNBQTNDLEVBQXVELElBQXZELENBQTZELEdBQTdELENBQW5COztBQUVBOzs7O0lBR00sbUI7OztBQUVMOzs7Ozs7Ozs7OztBQVdBLG9DQUFvSTtBQUFBLE1BQXJILFVBQXFILFFBQXJILFVBQXFIO0FBQUEsTUFBekcsT0FBeUcsUUFBekcsT0FBeUc7QUFBQSxNQUFoRyxLQUFnRyxRQUFoRyxLQUFnRztBQUFBLE1BQXpGLG1CQUF5RixRQUF6RixtQkFBeUY7QUFBQSxNQUFwRSxZQUFvRSxRQUFwRSxZQUFvRTtBQUFBLG1DQUF0RCxrQkFBc0Q7QUFBQSxNQUF0RCxrQkFBc0QseUNBQWpDLElBQWlDO0FBQUEsaUNBQTNCLGNBQTJCO0FBQUEsTUFBM0IsY0FBMkIsdUNBQVYsS0FBVTs7QUFBQTs7QUFBQTs7QUFHbkksUUFBSyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0EsUUFBSyxXQUFMLEdBQW1CLFVBQW5CO0FBQ0EsUUFBSyxXQUFMLEdBQW1CLEtBQUssSUFBTCxDQUFXLGFBQWEsTUFBSyxRQUE3QixDQUFuQjtBQUNBLFFBQUssZUFBTCxHQUF1QixDQUF2QjtBQUNBLFFBQUssWUFBTCxHQUFvQixDQUFwQjtBQUNBLFFBQUssUUFBTCxHQUFnQixPQUFoQjtBQUNBLFFBQUssTUFBTCxHQUFjLEtBQWQ7QUFDQSxRQUFLLGVBQUwsR0FBdUIsY0FBdkI7QUFDQSxRQUFLLG9CQUFMLEdBQTRCLG1CQUE1QjtBQUNBLFFBQUssYUFBTCxHQUFxQixZQUFyQjs7QUFFQSxNQUFLLHVCQUF1QixJQUE1QixFQUFtQztBQUNsQyx3QkFBcUIsa0NBQXJCO0FBQ0E7QUFDRCxRQUFLLG1CQUFMLEdBQTJCLGtCQUEzQjs7QUFFQSxRQUFLLFdBQUwsR0FBbUIsTUFBSyxXQUFMLENBQWlCLElBQWpCLE9BQW5CO0FBQ0EsUUFBSyxrQkFBTCxHQUEwQixNQUFLLGtCQUFMLENBQXdCLElBQXhCLE9BQTFCO0FBQ0EsUUFBSyxlQUFMLEdBQXVCLE1BQUssZUFBTCxDQUFxQixJQUFyQixPQUF2QjtBQUNBLFFBQUssdUJBQUwsR0FBK0IsTUFBSyx1QkFBTCxDQUE2QixJQUE3QixPQUEvQjtBQUNBLFFBQUssU0FBTCxHQUFpQixNQUFLLFNBQUwsQ0FBZSxJQUFmLE9BQWpCO0FBdkJtSTtBQXdCbkk7O0FBRUQ7Ozs7Ozs7OzswQkFLUTtBQUNQLFFBQUssU0FBTDtBQUNBOztBQUVEOzs7Ozs7Ozs4QkFLWTtBQUFBOztBQUNYLE9BQUksT0FBTztBQUNWLFVBQU0sS0FBSyxZQUREO0FBRVY7QUFDQSxjQUFVLEtBQUssUUFITDtBQUlWLFlBQVE7QUFKRSxJQUFYOztBQU9BLE9BQUssQ0FBRSxLQUFLLGVBQVosRUFBOEI7QUFDN0I7QUFDQSxTQUFLLG1CQUFMLEdBQTJCLEtBQUssb0JBQWhDO0FBQ0E7O0FBRUQsVUFBTyxJQUFQLENBQWE7QUFDWixVQUFNLEtBRE07QUFFWixTQUFLLEtBQUssYUFGRTtBQUdaLGdCQUFZLG9CQUFFLEdBQUYsRUFBVztBQUN0QixTQUFJLGdCQUFKLENBQXNCLFlBQXRCLEVBQW9DLE9BQUssTUFBekM7QUFDQSxLQUxXO0FBTVosVUFBTSxJQU5NO0FBT1osY0FBVSxNQVBFO0FBUVosYUFBUyxLQUFLO0FBUkYsSUFBYjtBQVVBOztBQUVEOzs7Ozs7Ozs7a0NBTWlCLFEsRUFBVztBQUFBOztBQUMzQixPQUFJLGtCQUFrQixTQUFTLE1BQVQsQ0FBaUIsVUFBRSxlQUFGLEVBQW1CLElBQW5CLEVBQTZCO0FBQ25FLFdBQU8sZ0JBQWdCLElBQWhCLENBQXNCLFlBQU07QUFDbEMsWUFBTyxPQUFLLFdBQUwsQ0FBa0IsSUFBbEIsQ0FBUDtBQUNBLEtBRk0sQ0FBUDtBQUdBLElBSnFCLEVBSW5CLFFBQVEsT0FBUixFQUptQixDQUF0Qjs7QUFNQSxtQkFBZ0IsSUFBaEIsQ0FBc0IsS0FBSyxrQkFBM0IsRUFBZ0QsS0FBaEQsQ0FBdUQsS0FBSyxrQkFBNUQ7QUFDQTs7QUFFRDs7Ozs7Ozs7dUNBS3FCO0FBQ3BCLFFBQUssSUFBTCxDQUFXLGVBQVgsRUFBNEIsS0FBSyxZQUFqQyxFQUErQyxLQUFLLFdBQXBEOztBQUVBLE9BQUssS0FBSyxZQUFMLEdBQW9CLEtBQUssV0FBOUIsRUFBNEM7QUFDM0MsU0FBSyxZQUFMLElBQXFCLENBQXJCO0FBQ0EsU0FBSyxTQUFMO0FBQ0EsSUFIRCxNQUdPO0FBQ04sU0FBSyxJQUFMLENBQVcsVUFBWDtBQUNBO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs4QkFNYSxJLEVBQU87QUFDbkIsT0FBSSxVQUFVLEtBQUssT0FBTCxDQUFhLFFBQTNCOztBQUVBLE9BQUksaUJBQWlCLHFDQUFrQixPQUFsQixFQUEyQixlQUFlLGFBQTFDLENBQXJCOztBQUVBLE9BQUksdUJBQXVCLG1DQUEwQjtBQUNwRCxZQUFRLEtBQUssRUFEdUM7QUFFcEQsYUFBUyxLQUFLLFFBRnNDO0FBR3BELFdBQU8sS0FBSyxNQUh3QztBQUlwRCxXQUFPLEtBQUssbUJBSndDO0FBS3BELHNCQUFrQixLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLENBQWpCLEVBQW9CO0FBTGMsSUFBMUIsQ0FBM0I7O0FBUUEsVUFBTyxxQkFBcUIsa0JBQXJCLENBQXlDLGNBQXpDLEVBQTBELElBQTFELENBQWdFLEtBQUssdUJBQXJFLEVBQThGLEtBQUssdUJBQW5HLENBQVA7QUFDQTs7QUFFRDs7Ozs7Ozs7NENBSzBCO0FBQ3pCLFFBQUssZUFBTCxJQUF3QixDQUF4Qjs7QUFFQSxRQUFLLElBQUwsQ0FBVyxlQUFYLEVBQTRCLEtBQUssZUFBakMsRUFBa0QsS0FBSyxXQUF2RDtBQUNBOzs7Ozs7a0JBR2EsbUI7Ozs7O0FDeEpmOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQUksV0FBVywwQkFBMEIsSUFBekMsQyxDQVJBOztBQVVBLElBQUksMEJBQUo7QUFBQSxJQUF1QiwyQkFBdkI7QUFBQSxJQUEyQyxzQkFBM0M7QUFDQSxJQUFJLDJCQUFKOztBQUVBOzs7OztBQUtBLFNBQVMsZ0JBQVQsR0FBNEI7QUFDM0IsS0FBSSxrQkFBa0IsT0FBUSw0Q0FBUixDQUF0QjtBQUNBLEtBQUksVUFBVSxTQUFTLE9BQVQsQ0FBaUIsSUFBL0I7O0FBRUEsUUFBTyxJQUFJLE9BQUosQ0FBYSxVQUFFLE9BQUYsRUFBZTtBQUNsQyxNQUFJLG1CQUFtQixrQ0FBOEI7QUFDcEQsZUFBWSxTQUFTLE1BQVQsQ0FBZ0IsS0FEd0I7QUFFcEQsbUJBQWdCLElBRm9DO0FBR3BELFlBQVMsT0FIMkM7QUFJcEQsVUFBTyxTQUFTLE9BQVQsQ0FBaUIsS0FKNEI7QUFLcEQsd0JBQXFCLFNBQVMsUUFMc0I7QUFNcEQsaUJBQWMsVUFBVSxjQU40QjtBQU9wRDtBQVBvRCxHQUE5QixDQUF2Qjs7QUFVQSxtQkFBaUIsRUFBakIsQ0FBcUIsZUFBckIsRUFBc0MsVUFBRSxTQUFGLEVBQWlCO0FBQ3RELG1CQUFnQixJQUFoQixDQUFzQixTQUF0QjtBQUNBLEdBRkQ7O0FBSUEsbUJBQWlCLEtBQWpCOztBQUVBO0FBQ0EsbUJBQWlCLEVBQWpCLENBQXFCLFVBQXJCLEVBQWlDLE9BQWpDO0FBQ0EsRUFuQk0sQ0FBUDtBQW9CQTs7QUFFRDs7Ozs7QUFLQSxTQUFTLGdCQUFULEdBQTRCO0FBQzNCLEtBQUksa0JBQWtCLE9BQVEsa0RBQVIsQ0FBdEI7QUFDQSxLQUFJLFVBQVUsU0FBUyxPQUFULENBQWlCLElBQS9COztBQUVBLFFBQU8sSUFBSSxPQUFKLENBQWEsVUFBRSxPQUFGLEVBQWU7QUFDbEMsTUFBSSxtQkFBbUIsa0NBQThCO0FBQ3BELGVBQVksU0FBUyxXQUFULENBQXFCLEtBRG1CO0FBRXBELG1CQUFnQixJQUZvQztBQUdwRCxZQUFTLE9BSDJDO0FBSXBELFVBQU8sU0FBUyxPQUFULENBQWlCLEtBSjRCO0FBS3BELHdCQUFxQixTQUFTLFFBTHNCO0FBTXBELGlCQUFjLFVBQVUsY0FONEI7QUFPcEQ7QUFQb0QsR0FBOUIsQ0FBdkI7O0FBVUEsbUJBQWlCLEVBQWpCLENBQXFCLGVBQXJCLEVBQXNDLFVBQUUsU0FBRixFQUFpQjtBQUN0RCxtQkFBZ0IsSUFBaEIsQ0FBc0IsU0FBdEI7QUFDQSxHQUZEOztBQUlBLG1CQUFpQixLQUFqQjs7QUFFQTtBQUNBLG1CQUFpQixFQUFqQixDQUFxQixVQUFyQixFQUFpQyxPQUFqQztBQUNBLEVBbkJNLENBQVA7QUFvQkE7O0FBRUQ7Ozs7O0FBS0EsU0FBUyxjQUFULEdBQTBCO0FBQ3pCLG1CQUFrQixJQUFsQjtBQUNBLG9CQUFtQixJQUFuQjtBQUNBLDBCQUFXLFNBQVMsSUFBVCxDQUFjLG9CQUF6QjtBQUNBOztBQUVEOzs7OztBQUtBLFNBQVMsa0JBQVQsR0FBOEI7QUFDN0IsZUFBYyxJQUFkO0FBQ0EsbUJBQWtCLElBQWxCOztBQUVBLDBCQUFXLFNBQVMsSUFBVCxDQUFjLHFCQUF6Qjs7QUFFQSxLQUFJLFVBQVUsc0JBQWEsRUFBRSxTQUFTLFNBQVMsT0FBVCxDQUFpQixJQUE1QixFQUFrQyxPQUFPLFNBQVMsT0FBVCxDQUFpQixLQUExRCxFQUFiLENBQWQ7O0FBRUEsc0JBQXFCLGtDQUFyQjtBQUNBLEtBQUksWUFBWSwwQ0FBaUMsRUFBRSxPQUFPLGtCQUFULEVBQTZCLFNBQVMsT0FBdEMsRUFBakMsQ0FBaEI7O0FBRUEsV0FBVSxRQUFWLEdBQ0UsSUFERixDQUNRLGdCQURSLEVBRUUsSUFGRixDQUVRLGdCQUZSLEVBR0UsSUFIRixDQUdRLGNBSFI7QUFJQTs7QUFFRDs7Ozs7QUFLQSxTQUFTLElBQVQsR0FBZ0I7QUFDZixRQUFRLDBDQUFSLEVBQXFELEVBQXJELENBQXlELE9BQXpELEVBQWtFLFlBQVc7QUFDNUU7O0FBRUEsU0FBUSxJQUFSLEVBQWUsSUFBZjtBQUNBLEVBSkQ7O0FBTUEsaUJBQWdCLE9BQVEsZ0NBQVIsQ0FBaEI7O0FBRUEscUJBQW9CLE9BQVEsb0NBQVIsQ0FBcEI7QUFDQSxtQkFBa0IsSUFBbEI7O0FBRUEsc0JBQXFCLE9BQVEscUNBQVIsQ0FBckI7QUFDQSxvQkFBbUIsSUFBbkI7QUFDQTs7QUFFRCxPQUFRLElBQVI7OztBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDekVBOztBQUVBLElBQUksY0FBYyxRQUFTLDJCQUFULENBQWxCO0FBQ0EsSUFBSSxjQUFjLFFBQVMsb0JBQVQsQ0FBbEI7O0FBRUEsSUFBSSxLQUFLLFFBQVMscUJBQVQsQ0FBVDtBQUNBLElBQUksS0FBSyxRQUFTLHFCQUFULENBQVQ7QUFDQSxJQUFJLEtBQUssUUFBUyxxQkFBVCxDQUFUOztBQUVBLE9BQU8sT0FBUCxHQUFpQixVQUFVLE1BQVYsRUFBbUI7QUFDbkMsS0FBSyxZQUFhLE1BQWIsQ0FBTCxFQUE2QjtBQUM1QixXQUFTLE9BQVQ7QUFDQTs7QUFFRCxTQUFRLFlBQWEsTUFBYixDQUFSO0FBQ0MsT0FBSyxJQUFMO0FBQ0MsVUFBTyxFQUFQO0FBQ0QsT0FBSyxJQUFMO0FBQ0MsVUFBTyxFQUFQO0FBQ0QsT0FBSyxJQUFMO0FBQ0E7QUFDQyxVQUFPLEVBQVA7QUFQRjtBQVNBLENBZEQ7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Y0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Q0QsS0FKcUIsQ0FJcEIsSUFKb0IsQ0FJZCxJQUpjLENBQXRCOztBQU1BLG9CQUFnQixvQkFBb0IsS0FBSyxPQUF6QztBQUNBOztBQUVELFNBQU8sYUFBUDtBQUNBLENBZEQ7O0FBZ0JBOzs7OztBQUtBLGdCQUFnQixTQUFoQixDQUEwQixZQUExQixHQUF5QyxZQUFXO0FBQ25ELE1BQUssS0FBSyxNQUFMLENBQVksTUFBWixLQUF1QixDQUF2QixJQUE0QixlQUFnQixLQUFLLE1BQUwsQ0FBYSxDQUFiLENBQWhCLEVBQWtDLEtBQUssY0FBdkMsQ0FBakMsRUFBMkY7QUFDMUYsV0FBTyxDQUFQO0FBQ0E7O0FBRUQsTUFBSSxnQkFBZ0IsS0FBSyx5QkFBTCxFQUFwQjtBQUNBLE1BQUssa0JBQWtCLENBQXZCLEVBQTJCO0FBQzFCLFdBQU8sQ0FBUDtBQUNBOztBQUVELFNBQU8sS0FBSyxhQUFMLENBQW9CLGFBQXBCLElBQXNDLEtBQUssWUFBbEQ7QUFDQSxDQVhEOztBQWFBOzs7Ozs7QUFNQSxnQkFBZ0IsU0FBaEIsQ0FBMEIsZ0JBQTFCLEdBQTZDLFVBQVUsYUFBVixFQUEwQjtBQUN0RSxPQUFLLGNBQUwsR0FBc0IsYUFBdEI7QUFDQSxDQUZEOztBQUlBOzs7Ozs7QUFNQSxnQkFBZ0IsU0FBaEIsQ0FBMEIsVUFBMUIsR0FBdUMsVUFBVSxTQUFWLEVBQXNCO0FBQzVELFNBQU8sS0FBSyxZQUFMLEdBQW9CLFNBQTNCO0FBQ0EsQ0FGRDs7QUFJQSxPQUFPLE9BQVAsR0FBaUIsZUFBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBBIGhlbHBlciBjbGFzcyB0byBkbyBBSkFYIHJlcXVlc3RzIHRvIHRoZSBSRVNUIEFQSS5cbiAqL1xuY2xhc3MgUmVzdEFwaSB7XG5cblx0LyoqXG5cdCAqIENvbnN0cnVjdHMgYSBSZXN0QXBpIHJlcXVlc3QgaGVscGVyIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHJvb3RVcmwgVGhlIHJvb3QgVVJMIG9mIHRoZSBSRVNUIEFQSS5cblx0ICogQHBhcmFtIHtzdHJpbmd9IG5vbmNlIFRoZSBub25jZSB0byBhdXRoZW50aWNhdGUgdG8gdGhlIFJFU1QgQVBJIHVzaW5nIGNvb2tpZXMuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvciggeyByb290VXJsLCBub25jZSB9ICkge1xuXHRcdHRoaXMuX3Jvb3RVcmwgPSByb290VXJsO1xuXHRcdHRoaXMuX25vbmNlID0gbm9uY2U7XG5cdH1cblxuXHQvKipcblx0ICogRG9lcyBhIEdFVCByZXF1ZXN0IHRvIHRoZSBSRVNUIEFQSVxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCBUaGUgcGF0aCB0byBkbyB0aGUgcmVxdWVzdCB0by5cblx0ICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyBUaGUgcGFyYW1ldGVycyB0byB1c2UgZm9yIGpRdWVyeS5cblx0ICogQHJldHVybnMge1Byb21pc2V9IFJlc29sdmVzIHdoZW4gdGhlIEFKQVggcmVxdWVzdCBpcyBjb21wbGV0ZS5cblx0ICovXG5cdGdldCggcGF0aCwgcGFyYW1zICkge1xuXHRcdHBhcmFtcyA9IE9iamVjdC5hc3NpZ24oIHBhcmFtcywge1xuXHRcdFx0dHlwZTogXCJHRVRcIixcblx0XHRcdHVybDogdGhpcy5fcm9vdFVybCArIHBhdGgsXG5cdFx0fSApO1xuXG5cdFx0cmV0dXJuIHRoaXMucmVxdWVzdCggcGFyYW1zICk7XG5cdH1cblxuXHQvKipcblx0ICogRG9lcyBhIFBPU1QgcmVxdWVzdCB0byB0aGUgUkVTVCBBUElcblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHBhdGggVGhlIHBhdGggdG8gZG8gdGhlIHJlcXVlc3QgdG8uXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgVGhlIHBhcmFtZXRlcnMgdG8gdXNlIGZvciBqUXVlcnkuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBSZXNvbHZlcyB3aGVuIHRoZSBBSkFYIHJlcXVlc3QgaXMgY29tcGxldGUuXG5cdCAqL1xuXHRwb3N0KCBwYXRoLCBwYXJhbXMgKSB7XG5cdFx0cGFyYW1zID0gT2JqZWN0LmFzc2lnbiggcGFyYW1zLCB7XG5cdFx0XHR0eXBlOiBcIlBPU1RcIixcblx0XHRcdHVybDogdGhpcy5fcm9vdFVybCArIHBhdGgsXG5cdFx0fSApO1xuXG5cdFx0cmV0dXJuIHRoaXMucmVxdWVzdCggcGFyYW1zICk7XG5cdH1cblxuXHQvKipcblx0ICogRG8gYSByZXF1ZXN0IHRvIHRoZSBSRVNUIEFQSVxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIFRoZSBwYXJhbXMgdG8gdXNlIGZvciBqUXVlcnkuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBSZXNvbHZlcyB3aGVuIHRoZSBBSkFYIHJlcXVlc3QgaXMgY29tcGxldGUuXG5cdCAqL1xuXHRyZXF1ZXN0KCBwYXJhbXMgKSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcblx0XHRcdHBhcmFtcyA9IE9iamVjdC5hc3NpZ24oIHBhcmFtcywge1xuXHRcdFx0XHRiZWZvcmVTZW5kOiAoIHhociApID0+IHtcblx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggXCJYLVdQLU5vbmNlXCIsIHRoaXMuX25vbmNlICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHN1Y2Nlc3M6IHJlc29sdmUsXG5cdFx0XHRcdGVycm9yOiByZWplY3QsXG5cdFx0XHR9ICk7XG5cblx0XHRcdGpRdWVyeS5hamF4KCBwYXJhbXMgKTtcblx0XHR9ICk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVzdEFwaTtcblxuXG4iLCIvKipcbiAqIEEga2V5IHZhbHVlIHN0b3JlIGZvciBwcm9taW5lbnQgd29yZHMgdG8gdGhlaXIgcmVzcGVjdGl2ZSBJRHMuXG4gKi9cbmNsYXNzIFByb21pbmVudFdvcmRDYWNoZSB7XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIGluaXRpYWwgY2FjaGUuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLl9jYWNoZSA9IHt9O1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIElEIGdpdmVuIHRoZSBuYW1lLCBvciAwIGlmIG5vdCBmb3VuZCBpbiB0aGUgY2FjaGUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBwcm9taW5lbnQgd29yZC5cblx0ICogQHJldHVybnMge251bWJlcn0gVGhlIElEIG9mIHRoZSBwcm9taW5lbnQgd29yZC5cblx0ICovXG5cdGdldElEKCBuYW1lICkge1xuXHRcdGlmICggdGhpcy5fY2FjaGUuaGFzT3duUHJvcGVydHkoIG5hbWUgKSApIHtcblx0XHRcdHJldHVybiB0aGlzLl9jYWNoZVsgbmFtZSBdO1xuXHRcdH1cblxuXHRcdHJldHVybiAwO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIElEIGZvciBhIGdpdmVuIG5hbWUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBwcm9taW5lbnQgd29yZC5cblx0ICogQHBhcmFtIHtudW1iZXJ9IGlkIFRoZSBJRCBvZiB0aGUgcHJvbWluZW50IHdvcmQuXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0c2V0SUQoIG5hbWUsIGlkICkge1xuXHRcdHRoaXMuX2NhY2hlWyBuYW1lIF0gPSBpZDtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBQcm9taW5lbnRXb3JkQ2FjaGU7XG4iLCJpbXBvcnQgdW5lc2NhcGUgZnJvbSBcImxvZGFzaC91bmVzY2FwZVwiO1xuXG4vKipcbiAqIFBvcHVsYXRlcyBhIHByb21pbmVudCB3b3JkIGNhY2hlIHdpdGggZGF0YSBmcm9tIHRoZSBzZXJ2ZXIuXG4gKi9cbmNsYXNzIFByb21pbmVudFdvcmRDYWNoZVBvcHVsYXRvciB7XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIGluc3RhbmNlIGF0dHJpYnV0ZXMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7UHJvbWluZW50V29yZENhY2hlfSBjYWNoZSBUaGUgY2FjaGUgdG8gcG9wdWxhdGUuXG5cdCAqIEBwYXJhbSB7UmVzdEFwaX0gcmVzdEFwaSBUaGUgUkVTVCBBUEkgb2JqZWN0IHRvIGRvIHJlcXVlc3RzIHdpdGguXG5cdCAqL1xuXHRjb25zdHJ1Y3RvciggeyBjYWNoZSwgcmVzdEFwaSB9ICkge1xuXHRcdHRoaXMuX2NhY2hlID0gY2FjaGU7XG5cdFx0dGhpcy5fcmVzdEFwaSA9IHJlc3RBcGk7XG5cdFx0dGhpcy5fY3VycmVudFBhZ2UgPSAxO1xuXG5cdFx0dGhpcy5wcm9jZXNzUHJvbWluZW50V29yZCA9IHRoaXMucHJvY2Vzc1Byb21pbmVudFdvcmQuYmluZCggdGhpcyApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFBvcHVsYXRlcyB0aGUgcHJvbWluZW50IHdvcmQgY2FjaGUgd2l0aCBkYXRhIGZyb20gdGhlIHNlcnZlci5cblx0ICpcblx0ICogQHJldHVybnMge1Byb21pc2V9IFJlc29sdmVzIHdoZW4gdGhlIGNhY2hlIGhhcyBiZWVuIHBvcHVsYXRlZC5cblx0ICovXG5cdHBvcHVsYXRlKCkge1xuXHRcdGxldCBkYXRhID0ge1xuXHRcdFx0cGVyX3BhZ2U6IDEwMCxcblx0XHRcdHBhZ2U6IHRoaXMuX2N1cnJlbnRQYWdlLFxuXHRcdH07XG5cblx0XHRyZXR1cm4gdGhpcy5fcmVzdEFwaS5nZXQoIFwid3AvdjIveXN0X3Byb21pbmVudF93b3Jkc1wiLCB7IGRhdGEgfSApLnRoZW4oICggcmVzdWx0ICkgPT4ge1xuXHRcdFx0aWYgKCByZXN1bHQubGVuZ3RoID09PSAwICkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHJlc3VsdC5mb3JFYWNoKCB0aGlzLnByb2Nlc3NQcm9taW5lbnRXb3JkICk7XG5cblx0XHRcdHRoaXMuX2N1cnJlbnRQYWdlICs9IDE7XG5cblx0XHRcdHJldHVybiB0aGlzLnBvcHVsYXRlKCk7XG5cdFx0fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNhdmVzIGEgcHJvbWluZW50IHdvcmQgdG8gdGhlIGNhY2hlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcHJvbWluZW50V29yZCBUaGUgcHJvbWluZW50IHdvcmQgdG8gc2F2ZSB0byB0aGUgY2FjaGUuXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0cHJvY2Vzc1Byb21pbmVudFdvcmQoIHByb21pbmVudFdvcmQgKSB7XG5cdFx0bGV0IG5hbWUgPSB1bmVzY2FwZSggcHJvbWluZW50V29yZC5uYW1lICk7XG5cblx0XHR0aGlzLl9jYWNoZS5zZXRJRCggbmFtZSwgcHJvbWluZW50V29yZC5pZCApO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFByb21pbmVudFdvcmRDYWNoZVBvcHVsYXRvcjtcbiIsImltcG9ydCBQcm9taW5lbnRXb3JkQ2FjaGUgZnJvbSBcIi4vUHJvbWluZW50V29yZENhY2hlXCI7XG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gXCJldmVudHNcIjtcbmltcG9ydCBpc0VxdWFsIGZyb20gXCJsb2Rhc2gvaXNFcXVhbFwiO1xuXG4vKipcbiAqIEhhbmRsZXMgdGhlIHJldHJpZXZhbCBhbmQgc3RvcmFnZSBvZiBmb2N1cyBrZXl3b3JkIHN1Z2dlc3Rpb25zXG4gKi9cbmNsYXNzIFByb21pbmVudFdvcmRTdG9yYWdlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblx0LyoqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSByb290VXJsIFRoZSByb290IFVSTCBvZiB0aGUgV1AgUkVTVCBBUEkuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBub25jZSBUaGUgV29yZFByZXNzIG5vbmNlIHJlcXVpcmVkIHRvIHNhdmUgYW55dGhpbmcgdG8gdGhlIFJFU1QgQVBJIGVuZHBvaW50cy5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHBvc3RTYXZlRW5kcG9pbnQgVGhlIGVuZHBvaW50IHRvIHVzZSB0byBzYXZlIHRoZSBwb3N0LlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gcG9zdFR5cGVCYXNlIFRoZSBiYXNlIG9mIHRoZSBwb3N0IHR5cGUgdG8gdXNlIGluIHRoZSBSRVNUIEFQSSBVUkwuXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBwb3N0SUQgVGhlIHBvc3RJRCBvZiB0aGUgcG9zdCB0byBzYXZlIHByb21pbmVudCB3b3JkcyBmb3IuXG5cdCAqIEBwYXJhbSB7UHJvbWluZW50V29yZENhY2hlfSBjYWNoZSBUaGUgY2FjaGUgdG8gdXNlIGZvciB0aGUgcHJvbWluZW50IHdvcmQgdGVybSBJRHMuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvciggeyBwb3N0SUQsIHJvb3RVcmwsIG5vbmNlLCBwb3N0U2F2ZUVuZHBvaW50ID0gXCJcIiwgcG9zdFR5cGVCYXNlID0gbnVsbCwgY2FjaGUgPSBudWxsIH0gKSB7XG5cdFx0c3VwZXIoKTtcblxuXHRcdHRoaXMuX3Jvb3RVcmwgPSByb290VXJsO1xuXHRcdHRoaXMuX25vbmNlID0gbm9uY2U7XG5cdFx0dGhpcy5fcG9zdElEID0gcG9zdElEO1xuXHRcdHRoaXMuX3NhdmluZ1Byb21pbmVudFdvcmRzID0gZmFsc2U7XG5cdFx0dGhpcy5fcHJldmlvdXNQcm9taW5lbnRXb3JkcyA9IG51bGw7XG5cblx0XHR0aGlzLl9wb3N0U2F2ZUVuZHBvaW50ID0gcG9zdFNhdmVFbmRwb2ludDtcblx0XHRpZiAoIHBvc3RUeXBlQmFzZSAhPT0gbnVsbCApIHtcblx0XHRcdHRoaXMuX3Bvc3RTYXZlRW5kcG9pbnQgPSB0aGlzLl9yb290VXJsICsgXCJ3cC92Mi9cIiArIHBvc3RUeXBlQmFzZSArIFwiL1wiICsgdGhpcy5fcG9zdElEO1xuXHRcdH1cblxuXHRcdGlmICggY2FjaGUgPT09IG51bGwgKSB7XG5cdFx0XHRjYWNoZSA9IG5ldyBQcm9taW5lbnRXb3JkQ2FjaGUoKTtcblx0XHR9XG5cdFx0dGhpcy5fY2FjaGUgPSBjYWNoZTtcblxuXHRcdHRoaXMucmV0cmlldmVQcm9taW5lbnRXb3JkSWQgPSB0aGlzLnJldHJpZXZlUHJvbWluZW50V29yZElkLmJpbmQoIHRoaXMgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTYXZlcyBwcm9taW5lbnQgd29yZHMgdG8gdGhlIGRhdGFiYXNlIHVzaW5nIEFKQVhcblx0ICpcblx0ICogQHBhcmFtIHtXb3JkQ29tYmluYXRpb25bXX0gcHJvbWluZW50V29yZHMgVGhlIHByb21pbmVudCB3b3JkcyB0byBzYXZlLlxuXHQgKiBAcmV0dXJucyB7UHJvbWlzZX0gUmVzb2x2ZXMgd2hlbiB0aGUgcHJvbWluZW50IHdvcmRzIGFyZSBzYXZlZC5cblx0ICovXG5cdHNhdmVQcm9taW5lbnRXb3JkcyggcHJvbWluZW50V29yZHMgKSB7XG5cdFx0Ly8gSWYgdGhlcmUgaXMgYWxyZWFkeSBhIHNhdmUgc2VxdWVuY2UgaW4gcHJvZ3Jlc3MsIGRvbid0IGRvIGl0IGFnYWluLlxuXHRcdGlmICggdGhpcy5fc2F2aW5nUHJvbWluZW50V29yZHMgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMuX3NhdmluZ1Byb21pbmVudFdvcmRzID0gdHJ1ZTtcblxuXHRcdGxldCBmaXJzdFR3ZW50eVdvcmRzID0gcHJvbWluZW50V29yZHMuc2xpY2UoIDAsIDIwICk7XG5cblx0XHQvLyBSZXRyaWV2ZSBJRHMgb2YgYWxsIHByb21pbmVudCB3b3JkIHRlcm1zLCBidXQgZG8gaXQgaW4gc2VxdWVuY2UgdG8gcHJldmVudCBvdmVybG9hZGluZyBzZXJ2ZXJzLlxuXHRcdGxldCBwcm9taW5lbnRXb3JkSWRzID0gZmlyc3RUd2VudHlXb3Jkcy5yZWR1Y2UoICggcHJldmlvdXNQcm9taXNlLCBwcm9taW5lbnRXb3JkICkgPT4ge1xuXHRcdFx0cmV0dXJuIHByZXZpb3VzUHJvbWlzZS50aGVuKCAoIGlkcyApID0+IHtcblx0XHRcdFx0cmV0dXJuIHRoaXMucmV0cmlldmVQcm9taW5lbnRXb3JkSWQoIHByb21pbmVudFdvcmQgKS50aGVuKCAoIG5ld0lkICkgPT4ge1xuXHRcdFx0XHRcdGlkcy5wdXNoKCBuZXdJZCApO1xuXG5cdFx0XHRcdFx0cmV0dXJuIGlkcztcblxuXHRcdFx0XHQvLyBPbiBlcnJvciwganVzdCBjb250aW51ZSB3aXRoIHRoZSBvdGhlciB0ZXJtcy5cblx0XHRcdFx0fSwgKCkgPT4ge1xuXHRcdFx0XHRcdHJldHVybiBpZHM7XG5cdFx0XHRcdH0gKTtcblx0XHRcdH0gKTtcblx0XHR9LCBQcm9taXNlLnJlc29sdmUoIFtdICkgKTtcblxuXHRcdHJldHVybiBwcm9taW5lbnRXb3JkSWRzLnRoZW4oICggcHJvbWluZW50V29yZHMgKSA9PiB7XG5cdFx0XHRpZiAoIGlzRXF1YWwoIHByb21pbmVudFdvcmRzLCB0aGlzLl9wcmV2aW91c1Byb21pbmVudFdvcmRzICkgKSB7XG5cdFx0XHRcdHRoaXMuX3NhdmluZ1Byb21pbmVudFdvcmRzID0gZmFsc2U7XG5cdFx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblx0XHRcdH1cblx0XHRcdHRoaXMuX3ByZXZpb3VzUHJvbWluZW50V29yZHMgPSBwcm9taW5lbnRXb3JkcztcblxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcblx0XHRcdFx0alF1ZXJ5LmFqYXgoIHtcblx0XHRcdFx0XHR0eXBlOiBcIlBPU1RcIixcblx0XHRcdFx0XHR1cmw6IHRoaXMuX3Bvc3RTYXZlRW5kcG9pbnQsXG5cdFx0XHRcdFx0YmVmb3JlU2VuZDogKCB4aHIgKSA9PiB7XG5cdFx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggXCJYLVdQLU5vbmNlXCIsIHRoaXMuX25vbmNlICk7XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlXG5cdFx0XHRcdFx0XHR5c3RfcHJvbWluZW50X3dvcmRzOiBwcm9taW5lbnRXb3Jkcyxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGRhdGFUeXBlOiBcImpzb25cIixcblx0XHRcdFx0XHRzdWNjZXNzOiByZXNvbHZlLFxuXHRcdFx0XHRcdGVycm9yOiByZWplY3QsXG5cdFx0XHRcdH0gKS5hbHdheXMoICgpID0+IHtcblx0XHRcdFx0XHR0aGlzLmVtaXQoIFwic2F2ZWRQcm9taW5lbnRXb3Jkc1wiLCBwcm9taW5lbnRXb3JkcyApO1xuXG5cdFx0XHRcdFx0dGhpcy5fc2F2aW5nUHJvbWluZW50V29yZHMgPSBmYWxzZTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fSApO1xuXHRcdH0gKS5jYXRjaCggKGUpID0+IHt9ICk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBJRCBvZiBhIHByb21pc2Vcblx0ICpcblx0ICogQHBhcmFtIHtXb3JkQ29tYmluYXRpb259IHByb21pbmVudFdvcmQgVGhlIHByb21pbmVudCB3b3JkIHRvIHJldHJpZXZlIHRoZSBJRCBmb3IuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBSZXNvbHZlcyB0byB0aGUgSUQgb2YgdGhlIHByb21pbmVudCB3b3JkIHRlcm0uXG5cdCAqL1xuXHRyZXRyaWV2ZVByb21pbmVudFdvcmRJZCggcHJvbWluZW50V29yZCApIHtcblx0XHRsZXQgY2FjaGVkSWQgPSB0aGlzLl9jYWNoZS5nZXRJRCggcHJvbWluZW50V29yZC5nZXRDb21iaW5hdGlvbigpICk7XG5cdFx0aWYgKCAwICE9PSBjYWNoZWRJZCApIHtcblx0XHRcdHJldHVybiBQcm9taXNlLnJlc29sdmUoIGNhY2hlZElkICk7XG5cdFx0fVxuXG5cdFx0bGV0IGZvdW5kUHJvbWluZW50V29yZCA9IG5ldyBQcm9taXNlKCAoIHJlc29sdmUsIHJlamVjdCApID0+IHtcblx0XHRcdGpRdWVyeS5hamF4KCB7XG5cdFx0XHRcdHR5cGU6IFwiR0VUXCIsXG5cdFx0XHRcdHVybDogdGhpcy5fcm9vdFVybCArIFwieW9hc3QvdjEvcHJvbWluZW50X3dvcmRzXCIsXG5cdFx0XHRcdGJlZm9yZVNlbmQ6ICggeGhyICkgPT4ge1xuXHRcdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCBcIlgtV1AtTm9uY2VcIiwgdGhpcy5fbm9uY2UgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdHdvcmQ6IHByb21pbmVudFdvcmQuZ2V0Q29tYmluYXRpb24oKSxcblx0XHRcdFx0fSxcblx0XHRcdFx0ZGF0YVR5cGU6IFwianNvblwiLFxuXHRcdFx0XHRzdWNjZXNzOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHRcdFx0cmVzb2x2ZSggcmVzcG9uc2UgKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZXJyb3I6IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdFx0XHRyZWplY3QoIHJlc3BvbnNlICk7XG5cdFx0XHRcdH0sXG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdFx0bGV0IGNyZWF0ZWRQcm9taW5lbnRXb3JkID0gZm91bmRQcm9taW5lbnRXb3JkLnRoZW4oICggcHJvbWluZW50V29yZFRlcm0gKSA9PiB7XG5cdFx0XHRpZiAoIHByb21pbmVudFdvcmRUZXJtID09PSBudWxsICkge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5jcmVhdGVQcm9taW5lbnRXb3JkVGVybSggcHJvbWluZW50V29yZCApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcHJvbWluZW50V29yZFRlcm07XG5cdFx0fSApO1xuXG5cdFx0cmV0dXJuIGNyZWF0ZWRQcm9taW5lbnRXb3JkLnRoZW4oICggcHJvbWluZW50V29yZFRlcm0gKSA9PiB7XG5cdFx0XHR0aGlzLl9jYWNoZS5zZXRJRCggcHJvbWluZW50V29yZC5nZXRDb21iaW5hdGlvbigpLCBwcm9taW5lbnRXb3JkVGVybS5pZCApO1xuXG5cdFx0XHRyZXR1cm4gcHJvbWluZW50V29yZFRlcm0uaWQ7XG5cdFx0fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSB0ZXJtIGZvciBhIHByb21pbmVudCB3b3JkXG5cdCAqXG5cdCAqIEBwYXJhbSB7V29yZENvbWJpbmF0aW9ufSBwcm9taW5lbnRXb3JkIFRoZSBwcm9taW5lbnQgd29yZCB0byBjcmVhdGUgYSB0ZXJtIGZvci5cblx0ICogQHJldHVybnMge1Byb21pc2V9IEEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHdoZW4gYSB0ZXJtIGhhcyBiZWVuIGNyZWF0ZWQgYW5kIHJlc29sdmVzIHdpdGggdGhlIElEIG9mIHRoZSBuZXdseSBjcmVhdGVkIHRlcm0uXG5cdCAqL1xuXHRjcmVhdGVQcm9taW5lbnRXb3JkVGVybSggcHJvbWluZW50V29yZCApIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoICggcmVzb2x2ZSwgcmVqZWN0ICkgPT4ge1xuXHRcdFx0alF1ZXJ5LmFqYXgoIHtcblx0XHRcdFx0dHlwZTogXCJQT1NUXCIsXG5cdFx0XHRcdHVybDogdGhpcy5fcm9vdFVybCArIFwid3AvdjIveXN0X3Byb21pbmVudF93b3Jkc1wiLFxuXHRcdFx0XHRiZWZvcmVTZW5kOiAoIHhociApID0+IHtcblx0XHRcdFx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlciggXCJYLVdQLU5vbmNlXCIsIHRoaXMuX25vbmNlICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRuYW1lOiBwcm9taW5lbnRXb3JkLmdldENvbWJpbmF0aW9uKCksXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGRhdGFUeXBlOiBcImpzb25cIixcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0XHRcdHJlc29sdmUoIHJlc3BvbnNlICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGVycm9yOiBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XHRcdFx0cmVqZWN0KCByZXNwb25zZSApO1xuXHRcdFx0XHR9LFxuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBQcm9taW5lbnRXb3JkU3RvcmFnZTtcbiIsImltcG9ydCB7IGdldFJlbGV2YW50V29yZHMgfSBmcm9tIFwieW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy9yZWxldmFudFdvcmRzXCI7XG5pbXBvcnQgUHJvbWluZW50V29yZFN0b3JhZ2UgZnJvbSBcIi4vUHJvbWluZW50V29yZFN0b3JhZ2VcIjtcbmltcG9ydCBQcm9taW5lbnRXb3JkQ2FjaGUgZnJvbSBcIi4vUHJvbWluZW50V29yZENhY2hlXCI7XG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gXCJldmVudHNcIjtcblxubGV0IHBvc3RTdGF0dXNlcyA9IFsgXCJmdXR1cmVcIiwgXCJkcmFmdFwiLCBcInBlbmRpbmdcIiwgXCJwcml2YXRlXCIsIFwicHVibGlzaFwiIF0uam9pbiggXCIsXCIgKTtcblxuLyoqXG4gKiBDYWxjdWxhdGVzIHByb21pbmVudCB3b3JkcyBmb3IgYWxsIHBvc3RzIG9uIHRoZSBzaXRlLlxuICovXG5jbGFzcyBTaXRlV2lkZUNhbGN1bGF0aW9uIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuXHQvKipcblx0ICogQ29uc3RydWN0cyBhIGNhbGN1bGF0aW9uIG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHtib29sZWFufSByZWNhbGN1bGF0ZUFsbCBXaGV0aGVyIHRvIGNhbGN1bGF0ZSBhbGwgcG9zdHMgb3Igb25seSBwb3N0cyB3aXRob3V0IHByb21pbmVudCB3b3Jkcy5cblx0ICogQHBhcmFtIHtudW1iZXJ9IHRvdGFsUG9zdHMgVGhlIGFtb3VudCBvZiBwb3N0cyB0byBjYWxjdWxhdGUgcHJvbWluZW50IHdvcmRzIGZvci5cblx0ICogQHBhcmFtIHtzdHJpbmd9IHJvb3RVcmwgVGhlIHJvb3QgUkVTVCBBUEkgVVJMLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbm9uY2UgVGhlIG5vbmNlIHRvIHVzZSB3aGVuIHVzaW5nIHRoZSBSRVNUIEFQSS5cblx0ICogQHBhcmFtIHtudW1iZXJbXX0gYWxsUHJvbWluZW50V29yZElkcyBBIGxpc3Qgb2YgYWxsIHByb21pbmVudCB3b3JkIElEcyBwcmVzZW50IG9uIHRoZSBzaXRlLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gbGlzdEVuZHBvaW50IFRoZSBlbmRwb2ludCB0byBjYWxsIHdoZW4gcmV0cmlldmluZyBwb3N0cyBvciBwYWdlcy5cblx0ICogQHBhcmFtIHtQcm9taW5lbnRXb3JkQ2FjaGV9IHByb21pbmVudFdvcmRDYWNoZSBUaGUgY2FjaGUgZm9yIHByb21pbmVudCB3b3Jkcy5cblx0ICovXG5cdGNvbnN0cnVjdG9yKCB7IHRvdGFsUG9zdHMsIHJvb3RVcmwsIG5vbmNlLCBhbGxQcm9taW5lbnRXb3JkSWRzLCBsaXN0RW5kcG9pbnQsIHByb21pbmVudFdvcmRDYWNoZSA9IG51bGwsIHJlY2FsY3VsYXRlQWxsID0gZmFsc2UgfSApIHtcblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy5fcGVyUGFnZSA9IDEwO1xuXHRcdHRoaXMuX3RvdGFsUG9zdHMgPSB0b3RhbFBvc3RzO1xuXHRcdHRoaXMuX3RvdGFsUGFnZXMgPSBNYXRoLmNlaWwoIHRvdGFsUG9zdHMgLyB0aGlzLl9wZXJQYWdlICk7XG5cdFx0dGhpcy5fcHJvY2Vzc2VkUG9zdHMgPSAwO1xuXHRcdHRoaXMuX2N1cnJlbnRQYWdlID0gMTtcblx0XHR0aGlzLl9yb290VXJsID0gcm9vdFVybDtcblx0XHR0aGlzLl9ub25jZSA9IG5vbmNlO1xuXHRcdHRoaXMuX3JlY2FsY3VsYXRlQWxsID0gcmVjYWxjdWxhdGVBbGw7XG5cdFx0dGhpcy5fYWxsUHJvbWluZW50V29yZElkcyA9IGFsbFByb21pbmVudFdvcmRJZHM7XG5cdFx0dGhpcy5fbGlzdEVuZHBvaW50ID0gbGlzdEVuZHBvaW50O1xuXG5cdFx0aWYgKCBwcm9taW5lbnRXb3JkQ2FjaGUgPT09IG51bGwgKSB7XG5cdFx0XHRwcm9taW5lbnRXb3JkQ2FjaGUgPSBuZXcgUHJvbWluZW50V29yZENhY2hlKCk7XG5cdFx0fVxuXHRcdHRoaXMuX3Byb21pbmVudFdvcmRDYWNoZSA9IHByb21pbmVudFdvcmRDYWNoZTtcblxuXHRcdHRoaXMucHJvY2Vzc1Bvc3QgPSB0aGlzLnByb2Nlc3NQb3N0LmJpbmQoIHRoaXMgKTtcblx0XHR0aGlzLmNvbnRpbnVlUHJvY2Vzc2luZyA9IHRoaXMuY29udGludWVQcm9jZXNzaW5nLmJpbmQoIHRoaXMgKTtcblx0XHR0aGlzLnByb2Nlc3NSZXNwb25zZSA9IHRoaXMucHJvY2Vzc1Jlc3BvbnNlLmJpbmQoIHRoaXMgKTtcblx0XHR0aGlzLmluY3JlbWVudFByb2Nlc3NlZFBvc3RzID0gdGhpcy5pbmNyZW1lbnRQcm9jZXNzZWRQb3N0cy5iaW5kKCB0aGlzICk7XG5cdFx0dGhpcy5jYWxjdWxhdGUgPSB0aGlzLmNhbGN1bGF0ZS5iaW5kKCB0aGlzICk7XG5cdH1cblxuXHQvKipcblx0ICogU3RhcnRzIGNhbGN1bGF0aW5nIHByb21pbmVudCB3b3Jkcy5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRzdGFydCgpIHtcblx0XHR0aGlzLmNhbGN1bGF0ZSgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIERvZXMgYSBjYWxjdWxhdGlvbiBzdGVwIGZvciB0aGUgY3VycmVudCBwYWdlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGNhbGN1bGF0ZSgpIHtcblx0XHRsZXQgZGF0YSA9IHtcblx0XHRcdHBhZ2U6IHRoaXMuX2N1cnJlbnRQYWdlLFxuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNhbWVsY2FzZVxuXHRcdFx0cGVyX3BhZ2U6IHRoaXMuX3BlclBhZ2UsXG5cdFx0XHRzdGF0dXM6IHBvc3RTdGF0dXNlcyxcblx0XHR9O1xuXG5cdFx0aWYgKCAhIHRoaXMuX3JlY2FsY3VsYXRlQWxsICkge1xuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGNhbWVsY2FzZVxuXHRcdFx0ZGF0YS55c3RfcHJvbWluZW50X3dvcmRzID0gdGhpcy5fYWxsUHJvbWluZW50V29yZElkcztcblx0XHR9XG5cblx0XHRqUXVlcnkuYWpheCgge1xuXHRcdFx0dHlwZTogXCJHRVRcIixcblx0XHRcdHVybDogdGhpcy5fbGlzdEVuZHBvaW50LFxuXHRcdFx0YmVmb3JlU2VuZDogKCB4aHIgKSA9PiB7XG5cdFx0XHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCBcIlgtV1AtTm9uY2VcIiwgdGhpcy5fbm9uY2UgKTtcblx0XHRcdH0sXG5cdFx0XHRkYXRhOiBkYXRhLFxuXHRcdFx0ZGF0YVR5cGU6IFwianNvblwiLFxuXHRcdFx0c3VjY2VzczogdGhpcy5wcm9jZXNzUmVzcG9uc2UsXG5cdFx0fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIFByb2Nlc3MgcmVzcG9uc2UgZnJvbSB0aGUgaW5kZXggcmVxdWVzdCBmb3IgcG9zdHMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7QXJyYXl9IHJlc3BvbnNlIFRoZSBsaXN0IG9mIGZvdW5kIHBvc3RzIGZyb20gdGhlIHNlcnZlci5cblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRwcm9jZXNzUmVzcG9uc2UoIHJlc3BvbnNlICkge1xuXHRcdGxldCBwcm9jZXNzUHJvbWlzZXMgPSByZXNwb25zZS5yZWR1Y2UoICggcHJldmlvdXNQcm9taXNlLCBwb3N0ICkgPT4ge1xuXHRcdFx0cmV0dXJuIHByZXZpb3VzUHJvbWlzZS50aGVuKCAoKSA9PiB7XG5cdFx0XHRcdHJldHVybiB0aGlzLnByb2Nlc3NQb3N0KCBwb3N0ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSwgUHJvbWlzZS5yZXNvbHZlKCkgKTtcblxuXHRcdHByb2Nlc3NQcm9taXNlcy50aGVuKCB0aGlzLmNvbnRpbnVlUHJvY2Vzc2luZyApLmNhdGNoKCB0aGlzLmNvbnRpbnVlUHJvY2Vzc2luZyApO1xuXHR9XG5cblx0LyoqXG5cdCAqIENvbnRpbnVlcyBwcm9jZXNzaW5nIGJ5IGdvaW5nIHRvIHRoZSBuZXh0IHBhZ2UgaWYgdGhlcmUgaXMgb25lLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGNvbnRpbnVlUHJvY2Vzc2luZygpIHtcblx0XHR0aGlzLmVtaXQoIFwicHJvY2Vzc2VkUGFnZVwiLCB0aGlzLl9jdXJyZW50UGFnZSwgdGhpcy5fdG90YWxQYWdlcyApO1xuXG5cdFx0aWYgKCB0aGlzLl9jdXJyZW50UGFnZSA8IHRoaXMuX3RvdGFsUGFnZXMgKSB7XG5cdFx0XHR0aGlzLl9jdXJyZW50UGFnZSArPSAxO1xuXHRcdFx0dGhpcy5jYWxjdWxhdGUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5lbWl0KCBcImNvbXBsZXRlXCIgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogUHJvY2Vzc2VzIGEgcG9zdCByZXR1cm5lZCBmcm9tIHRoZSBSRVNUIEFQSS5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHBvc3QgQSBwb3N0IG9iamVjdCB3aXRoIHJlbmRlcmVkIGNvbnRlbnQuXG5cdCAqIEByZXR1cm5zIHtQcm9taXNlfSBSZXNvbHZlcyB3aGVuIHRoZSBwcm9taW5lbnQgd29yZHMgYXJlIHNhdmVkIGZvciB0aGUgcG9zdC5cblx0ICovXG5cdHByb2Nlc3NQb3N0KCBwb3N0ICkge1xuXHRcdGxldCBjb250ZW50ID0gcG9zdC5jb250ZW50LnJlbmRlcmVkO1xuXG5cdFx0bGV0IHByb21pbmVudFdvcmRzID0gZ2V0UmVsZXZhbnRXb3JkcyggY29udGVudCwgd3BzZW9BZG1pbkwxMG4uY29udGVudExvY2FsZSApO1xuXG5cdFx0bGV0IHByb21pbmVudFdvcmRTdG9yYWdlID0gbmV3IFByb21pbmVudFdvcmRTdG9yYWdlKCB7XG5cdFx0XHRwb3N0SUQ6IHBvc3QuaWQsXG5cdFx0XHRyb290VXJsOiB0aGlzLl9yb290VXJsLFxuXHRcdFx0bm9uY2U6IHRoaXMuX25vbmNlLFxuXHRcdFx0Y2FjaGU6IHRoaXMuX3Byb21pbmVudFdvcmRDYWNoZSxcblx0XHRcdHBvc3RTYXZlRW5kcG9pbnQ6IHBvc3QuX2xpbmtzLnNlbGZbMF0uaHJlZixcblx0XHR9ICk7XG5cblx0XHRyZXR1cm4gcHJvbWluZW50V29yZFN0b3JhZ2Uuc2F2ZVByb21pbmVudFdvcmRzKCBwcm9taW5lbnRXb3JkcyApLnRoZW4oIHRoaXMuaW5jcmVtZW50UHJvY2Vzc2VkUG9zdHMsIHRoaXMuaW5jcmVtZW50UHJvY2Vzc2VkUG9zdHMgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbmNyZW1lbnRzIHRoZSBhbW91bnQgb2YgcHJvY2Vzc2VkIHBvc3RzIGJ5IG9uZS5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRpbmNyZW1lbnRQcm9jZXNzZWRQb3N0cygpIHtcblx0XHR0aGlzLl9wcm9jZXNzZWRQb3N0cyArPSAxO1xuXG5cdFx0dGhpcy5lbWl0KCBcInByb2Nlc3NlZFBvc3RcIiwgdGhpcy5fcHJvY2Vzc2VkUG9zdHMsIHRoaXMuX3RvdGFsUG9zdHMgKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaXRlV2lkZUNhbGN1bGF0aW9uO1xuIiwiLyogZ2xvYmFsIHlvYXN0U2l0ZVdpZGVBbmFseXNpc0RhdGEgKi9cblxuaW1wb3J0IFByb21pbmVudFdvcmRDYWxjdWxhdGlvbiBmcm9tIFwiLi9rZXl3b3JkU3VnZ2VzdGlvbnMvc2l0ZVdpZGVDYWxjdWxhdGlvblwiO1xuaW1wb3J0IFByb21pbmVudFdvcmRDYWNoZSBmcm9tIFwiLi9rZXl3b3JkU3VnZ2VzdGlvbnMvUHJvbWluZW50V29yZENhY2hlXCI7XG5pbXBvcnQgUHJvbWluZW50V29yZENhY2hlUG9wdWxhdG9yIGZyb20gXCIuL2tleXdvcmRTdWdnZXN0aW9ucy9Qcm9taW5lbnRXb3JkQ2FjaGVQb3B1bGF0b3JcIjtcbmltcG9ydCBSZXN0QXBpIGZyb20gXCIuL2hlbHBlcnMvcmVzdEFwaVwiO1xuaW1wb3J0IGExMXlTcGVhayBmcm9tIFwiYTExeS1zcGVha1wiO1xuXG5sZXQgc2V0dGluZ3MgPSB5b2FzdFNpdGVXaWRlQW5hbHlzaXNEYXRhLmRhdGE7XG5cbmxldCBwcm9ncmVzc0NvbnRhaW5lciwgY29tcGxldGVkQ29udGFpbmVyLCBpbmZvQ29udGFpbmVyO1xubGV0IHByb21pbmVudFdvcmRDYWNoZTtcblxuLyoqXG4gKiBSZWNhbGN1bGF0ZXMgcG9zdHNcbiAqXG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gUmVzb2x2ZXMgd2hlbiB3ZSBoYXZlIHJlY2FsY3VsYXRlZCBwb3N0cy5cbiAqL1xuZnVuY3Rpb24gcmVjYWxjdWxhdGVQb3N0cygpIHtcblx0bGV0IHByb2dyZXNzRWxlbWVudCA9IGpRdWVyeSggXCIueW9hc3QtanMtcHJvbWluZW50LXdvcmRzLXByb2dyZXNzLWN1cnJlbnRcIiApO1xuXHRsZXQgcm9vdFVybCA9IHNldHRpbmdzLnJlc3RBcGkucm9vdDtcblxuXHRyZXR1cm4gbmV3IFByb21pc2UoICggcmVzb2x2ZSApID0+IHtcblx0XHRsZXQgcG9zdHNDYWxjdWxhdGlvbiA9IG5ldyBQcm9taW5lbnRXb3JkQ2FsY3VsYXRpb24oIHtcblx0XHRcdHRvdGFsUG9zdHM6IHNldHRpbmdzLmFtb3VudC50b3RhbCxcblx0XHRcdHJlY2FsY3VsYXRlQWxsOiB0cnVlLFxuXHRcdFx0cm9vdFVybDogcm9vdFVybCxcblx0XHRcdG5vbmNlOiBzZXR0aW5ncy5yZXN0QXBpLm5vbmNlLFxuXHRcdFx0YWxsUHJvbWluZW50V29yZElkczogc2V0dGluZ3MuYWxsV29yZHMsXG5cdFx0XHRsaXN0RW5kcG9pbnQ6IHJvb3RVcmwgKyBcIndwL3YyL3Bvc3RzL1wiLFxuXHRcdFx0cHJvbWluZW50V29yZENhY2hlLFxuXHRcdH0gKTtcblxuXHRcdHBvc3RzQ2FsY3VsYXRpb24ub24oIFwicHJvY2Vzc2VkUG9zdFwiLCAoIHBvc3RDb3VudCApID0+IHtcblx0XHRcdHByb2dyZXNzRWxlbWVudC5odG1sKCBwb3N0Q291bnQgKTtcblx0XHR9ICk7XG5cblx0XHRwb3N0c0NhbGN1bGF0aW9uLnN0YXJ0KCk7XG5cblx0XHQvLyBGcmVlIHVwIHRoZSB2YXJpYWJsZSB0byBzdGFydCBhbm90aGVyIHJlY2FsY3VsYXRpb24uXG5cdFx0cG9zdHNDYWxjdWxhdGlvbi5vbiggXCJjb21wbGV0ZVwiLCByZXNvbHZlICk7XG5cdH0gKTtcbn1cblxuLyoqXG4gKiBSZWNhbGN1bGF0ZXMgcGFnZXNcbiAqXG4gKiBAcmV0dXJucyB7UHJvbWlzZX0gUmVzb2x2ZXMgd2hlbiB3ZSBoYXZlIHJlY2FsY3VsYXRlZCBwYWdlcy5cbiAqL1xuZnVuY3Rpb24gcmVjYWxjdWxhdGVQYWdlcygpIHtcblx0bGV0IHByb2dyZXNzRWxlbWVudCA9IGpRdWVyeSggXCIueW9hc3QtanMtcHJvbWluZW50LXdvcmRzLXBhZ2VzLXByb2dyZXNzLWN1cnJlbnRcIiApO1xuXHRsZXQgcm9vdFVybCA9IHNldHRpbmdzLnJlc3RBcGkucm9vdDtcblxuXHRyZXR1cm4gbmV3IFByb21pc2UoICggcmVzb2x2ZSApID0+IHtcblx0XHRsZXQgcGFnZXNDYWxjdWxhdGlvbiA9IG5ldyBQcm9taW5lbnRXb3JkQ2FsY3VsYXRpb24oIHtcblx0XHRcdHRvdGFsUG9zdHM6IHNldHRpbmdzLmFtb3VudFBhZ2VzLnRvdGFsLFxuXHRcdFx0cmVjYWxjdWxhdGVBbGw6IHRydWUsXG5cdFx0XHRyb290VXJsOiByb290VXJsLFxuXHRcdFx0bm9uY2U6IHNldHRpbmdzLnJlc3RBcGkubm9uY2UsXG5cdFx0XHRhbGxQcm9taW5lbnRXb3JkSWRzOiBzZXR0aW5ncy5hbGxXb3Jkcyxcblx0XHRcdGxpc3RFbmRwb2ludDogcm9vdFVybCArIFwid3AvdjIvcGFnZXMvXCIsXG5cdFx0XHRwcm9taW5lbnRXb3JkQ2FjaGUsXG5cdFx0fSApO1xuXG5cdFx0cGFnZXNDYWxjdWxhdGlvbi5vbiggXCJwcm9jZXNzZWRQb3N0XCIsICggcG9zdENvdW50ICkgPT4ge1xuXHRcdFx0cHJvZ3Jlc3NFbGVtZW50Lmh0bWwoIHBvc3RDb3VudCApO1xuXHRcdH0gKTtcblxuXHRcdHBhZ2VzQ2FsY3VsYXRpb24uc3RhcnQoKTtcblxuXHRcdC8vIEZyZWUgdXAgdGhlIHZhcmlhYmxlIHRvIHN0YXJ0IGFub3RoZXIgcmVjYWxjdWxhdGlvbi5cblx0XHRwYWdlc0NhbGN1bGF0aW9uLm9uKCBcImNvbXBsZXRlXCIsIHJlc29sdmUgKTtcblx0fSApO1xufVxuXG4vKipcbiAqIFNob3dzIGNvbXBsZXRpb24gdG8gdGhlIHVzZXJcbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gc2hvd0NvbXBsZXRpb24oKSB7XG5cdHByb2dyZXNzQ29udGFpbmVyLmhpZGUoKTtcblx0Y29tcGxldGVkQ29udGFpbmVyLnNob3coKTtcblx0YTExeVNwZWFrKCBzZXR0aW5ncy5sMTBuLmNhbGN1bGF0aW9uQ29tcGxldGVkICk7XG59XG5cbi8qKlxuICogU3RhcnQgcmVjYWxjdWxhdGluZy5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gc3RhcnRSZWNhbGN1bGF0aW5nKCkge1xuXHRpbmZvQ29udGFpbmVyLmhpZGUoKTtcblx0cHJvZ3Jlc3NDb250YWluZXIuc2hvdygpO1xuXG5cdGExMXlTcGVhayggc2V0dGluZ3MubDEwbi5jYWxjdWxhdGlvbkluUHJvZ3Jlc3MgKTtcblxuXHRsZXQgcmVzdEFwaSA9IG5ldyBSZXN0QXBpKCB7IHJvb3RVcmw6IHNldHRpbmdzLnJlc3RBcGkucm9vdCwgbm9uY2U6IHNldHRpbmdzLnJlc3RBcGkubm9uY2UgfSApO1xuXG5cdHByb21pbmVudFdvcmRDYWNoZSA9IG5ldyBQcm9taW5lbnRXb3JkQ2FjaGUoKTtcblx0bGV0IHBvcHVsYXRvciA9IG5ldyBQcm9taW5lbnRXb3JkQ2FjaGVQb3B1bGF0b3IoIHsgY2FjaGU6IHByb21pbmVudFdvcmRDYWNoZSwgcmVzdEFwaTogcmVzdEFwaSB9ICk7XG5cblx0cG9wdWxhdG9yLnBvcHVsYXRlKClcblx0XHQudGhlbiggcmVjYWxjdWxhdGVQb3N0cyApXG5cdFx0LnRoZW4oIHJlY2FsY3VsYXRlUGFnZXMgKVxuXHRcdC50aGVuKCBzaG93Q29tcGxldGlvbiApO1xufVxuXG4vKipcbiAqIEluaXRpYWxpemVzIHRoZSBzaXRlIHdpZGUgYW5hbHlzaXMgdGFiLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5mdW5jdGlvbiBpbml0KCkge1xuXHRqUXVlcnkoIFwiLnlvYXN0LWpzLWNhbGN1bGF0ZS1wcm9taW5lbnQtd29yZHMtLWFsbFwiICkub24oIFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG5cdFx0c3RhcnRSZWNhbGN1bGF0aW5nKCk7XG5cblx0XHRqUXVlcnkoIHRoaXMgKS5oaWRlKCk7XG5cdH0gKTtcblxuXHRpbmZvQ29udGFpbmVyID0galF1ZXJ5KCBcIi55b2FzdC1qcy1wcm9taW5lbnQtd29yZHMtaW5mb1wiICk7XG5cblx0cHJvZ3Jlc3NDb250YWluZXIgPSBqUXVlcnkoIFwiLnlvYXN0LWpzLXByb21pbmVudC13b3Jkcy1wcm9ncmVzc1wiICk7XG5cdHByb2dyZXNzQ29udGFpbmVyLmhpZGUoKTtcblxuXHRjb21wbGV0ZWRDb250YWluZXIgPSBqUXVlcnkoIFwiLnlvYXN0LWpzLXByb21pbmVudC13b3Jkcy1jb21wbGV0ZWRcIiApO1xuXHRjb21wbGV0ZWRDb250YWluZXIuaGlkZSgpO1xufVxuXG5qUXVlcnkoIGluaXQgKTtcbiIsInZhciBjb250YWluZXJQb2xpdGUsIGNvbnRhaW5lckFzc2VydGl2ZTtcblxuLyoqXG4gKiBCdWlsZCB0aGUgbGl2ZSByZWdpb25zIG1hcmt1cC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYXJpYUxpdmUgT3B0aW9uYWwuIFZhbHVlIGZvciB0aGUgXCJhcmlhLWxpdmVcIiBhdHRyaWJ1dGUsIGRlZmF1bHQgXCJwb2xpdGVcIi5cbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSAkY29udGFpbmVyIFRoZSBBUklBIGxpdmUgcmVnaW9uIGpRdWVyeSBvYmplY3QuXG4gKi9cbnZhciBhZGRDb250YWluZXIgPSBmdW5jdGlvbiggYXJpYUxpdmUgKSB7XG5cdGFyaWFMaXZlID0gYXJpYUxpdmUgfHwgXCJwb2xpdGVcIjtcblxuXHR2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuXHRjb250YWluZXIuaWQgPSBcImExMXktc3BlYWstXCIgKyBhcmlhTGl2ZTtcblx0Y29udGFpbmVyLmNsYXNzTmFtZSA9IFwiYTExeS1zcGVhay1yZWdpb25cIjtcblxuXHR2YXIgc2NyZWVuUmVhZGVyVGV4dFN0eWxlID0gXCJjbGlwOiByZWN0KDFweCwgMXB4LCAxcHgsIDFweCk7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgaGVpZ2h0OiAxcHg7IHdpZHRoOiAxcHg7IG92ZXJmbG93OiBoaWRkZW47XCI7XG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwic3R5bGVcIiwgc2NyZWVuUmVhZGVyVGV4dFN0eWxlICk7XG5cblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJhcmlhLWxpdmVcIiwgYXJpYUxpdmUgKTtcblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJhcmlhLXJlbGV2YW50XCIsIFwiYWRkaXRpb25zIHRleHRcIiApO1xuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcImFyaWEtYXRvbWljXCIsIFwidHJ1ZVwiICk7XG5cblx0ZG9jdW1lbnQucXVlcnlTZWxlY3RvciggXCJib2R5XCIgKS5hcHBlbmRDaGlsZCggY29udGFpbmVyICk7XG5cdHJldHVybiBjb250YWluZXI7XG59O1xuXG4vKipcbiAqIFNwZWNpZnkgYSBmdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gdGhlIERPTSBpcyBmdWxseSBsb2FkZWQuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgQSBmdW5jdGlvbiB0byBleGVjdXRlIGFmdGVyIHRoZSBET00gaXMgcmVhZHkuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbnZhciBkb21SZWFkeSA9IGZ1bmN0aW9uKCBjYWxsYmFjayApIHtcblx0aWYgKCBkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIgfHwgKCBkb2N1bWVudC5yZWFkeVN0YXRlICE9PSBcImxvYWRpbmdcIiAmJiAhZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmRvU2Nyb2xsICkgKSB7XG5cdFx0cmV0dXJuIGNhbGxiYWNrKCk7XG5cdH1cblxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCBcIkRPTUNvbnRlbnRMb2FkZWRcIiwgY2FsbGJhY2sgKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlIHRoZSBsaXZlIHJlZ2lvbnMgd2hlbiB0aGUgRE9NIGlzIGZ1bGx5IGxvYWRlZC5cbiAqL1xuZG9tUmVhZHkoIGZ1bmN0aW9uKCkge1xuXHRjb250YWluZXJQb2xpdGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggXCJhMTF5LXNwZWFrLXBvbGl0ZVwiICk7XG5cdGNvbnRhaW5lckFzc2VydGl2ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBcImExMXktc3BlYWstYXNzZXJ0aXZlXCIgKTtcblxuXHRpZiAoIGNvbnRhaW5lclBvbGl0ZSA9PT0gbnVsbCApIHtcblx0XHRjb250YWluZXJQb2xpdGUgPSBhZGRDb250YWluZXIoIFwicG9saXRlXCIgKTtcblx0fVxuXHRpZiAoIGNvbnRhaW5lckFzc2VydGl2ZSA9PT0gbnVsbCApIHtcblx0XHRjb250YWluZXJBc3NlcnRpdmUgPSBhZGRDb250YWluZXIoIFwiYXNzZXJ0aXZlXCIgKTtcblx0fVxufSApO1xuXG4vKipcbiAqIENsZWFyIHRoZSBsaXZlIHJlZ2lvbnMuXG4gKi9cbnZhciBjbGVhciA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgcmVnaW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoIFwiLmExMXktc3BlYWstcmVnaW9uXCIgKTtcblx0Zm9yICggdmFyIGkgPSAwOyBpIDwgcmVnaW9ucy5sZW5ndGg7IGkrKyApIHtcblx0XHRyZWdpb25zWyBpIF0udGV4dENvbnRlbnQgPSBcIlwiO1xuXHR9XG59O1xuXG4vKipcbiAqIFVwZGF0ZSB0aGUgQVJJQSBsaXZlIG5vdGlmaWNhdGlvbiBhcmVhIHRleHQgbm9kZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSAgVGhlIG1lc3NhZ2UgdG8gYmUgYW5ub3VuY2VkIGJ5IEFzc2lzdGl2ZSBUZWNobm9sb2dpZXMuXG4gKiBAcGFyYW0ge1N0cmluZ30gYXJpYUxpdmUgT3B0aW9uYWwuIFRoZSBwb2xpdGVuZXNzIGxldmVsIGZvciBhcmlhLWxpdmUuIFBvc3NpYmxlIHZhbHVlczpcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICBwb2xpdGUgb3IgYXNzZXJ0aXZlLiBEZWZhdWx0IHBvbGl0ZS5cbiAqL1xudmFyIEExMXlTcGVhayA9IGZ1bmN0aW9uKCBtZXNzYWdlLCBhcmlhTGl2ZSApIHtcblx0Ly8gQ2xlYXIgcHJldmlvdXMgbWVzc2FnZXMgdG8gYWxsb3cgcmVwZWF0ZWQgc3RyaW5ncyBiZWluZyByZWFkIG91dC5cblx0Y2xlYXIoKTtcblxuXHQvKlxuXHQgKiBTdHJpcCBIVE1MIHRhZ3MgKGlmIGFueSkgZnJvbSB0aGUgbWVzc2FnZSBzdHJpbmcuIElkZWFsbHksIG1lc3NhZ2VzIHNob3VsZFxuXHQgKiBiZSBzaW1wbGUgc3RyaW5ncywgY2FyZWZ1bGx5IGNyYWZ0ZWQgZm9yIHNwZWNpZmljIHVzZSB3aXRoIEExMXlTcGVhay5cblx0ICogV2hlbiByZS11c2luZyBhbHJlYWR5IGV4aXN0aW5nIHN0cmluZ3MgdGhpcyB3aWxsIGVuc3VyZSBzaW1wbGUgSFRNTCB0byBiZVxuXHQgKiBzdHJpcHBlZCBvdXQgYW5kIHJlcGxhY2VkIHdpdGggYSBzcGFjZS4gQnJvd3NlcnMgd2lsbCBjb2xsYXBzZSBtdWx0aXBsZVxuXHQgKiBzcGFjZXMgbmF0aXZlbHkuXG5cdCAqL1xuXHRtZXNzYWdlID0gbWVzc2FnZS5yZXBsYWNlKCAvPFtePD5dKz4vZywgXCIgXCIgKTtcblxuXHRpZiAoIGNvbnRhaW5lckFzc2VydGl2ZSAmJiBcImFzc2VydGl2ZVwiID09PSBhcmlhTGl2ZSApIHtcblx0XHRjb250YWluZXJBc3NlcnRpdmUudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuXHR9IGVsc2UgaWYgKCBjb250YWluZXJQb2xpdGUgKSB7XG5cdFx0Y29udGFpbmVyUG9saXRlLnRleHRDb250ZW50ID0gbWVzc2FnZTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBMTF5U3BlYWs7XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfVxuICAgICAgdGhyb3cgVHlwZUVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LicpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGVuOyBpKyspXG4gICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBhcmdzID0gbmV3IEFycmF5KGxlbiAtIDEpO1xuICAgIGZvciAoaSA9IDE7IGkgPCBsZW47IGkrKylcbiAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuXG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgdmFyIG07XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCFlbWl0dGVyLl9ldmVudHMgfHwgIWVtaXR0ZXIuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSAwO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKGVtaXR0ZXIuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gMTtcbiAgZWxzZVxuICAgIHJldCA9IGVtaXR0ZXIuX2V2ZW50c1t0eXBlXS5sZW5ndGg7XG4gIHJldHVybiByZXQ7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIERhdGFWaWV3ID0gZ2V0TmF0aXZlKHJvb3QsICdEYXRhVmlldycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IERhdGFWaWV3O1xuIiwidmFyIGhhc2hDbGVhciA9IHJlcXVpcmUoJy4vX2hhc2hDbGVhcicpLFxuICAgIGhhc2hEZWxldGUgPSByZXF1aXJlKCcuL19oYXNoRGVsZXRlJyksXG4gICAgaGFzaEdldCA9IHJlcXVpcmUoJy4vX2hhc2hHZXQnKSxcbiAgICBoYXNoSGFzID0gcmVxdWlyZSgnLi9faGFzaEhhcycpLFxuICAgIGhhc2hTZXQgPSByZXF1aXJlKCcuL19oYXNoU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhhc2ggb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBIYXNoKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYEhhc2hgLlxuSGFzaC5wcm90b3R5cGUuY2xlYXIgPSBoYXNoQ2xlYXI7XG5IYXNoLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBoYXNoRGVsZXRlO1xuSGFzaC5wcm90b3R5cGUuZ2V0ID0gaGFzaEdldDtcbkhhc2gucHJvdG90eXBlLmhhcyA9IGhhc2hIYXM7XG5IYXNoLnByb3RvdHlwZS5zZXQgPSBoYXNoU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhhc2g7XG4iLCJ2YXIgbGlzdENhY2hlQ2xlYXIgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVDbGVhcicpLFxuICAgIGxpc3RDYWNoZURlbGV0ZSA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZURlbGV0ZScpLFxuICAgIGxpc3RDYWNoZUdldCA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZUdldCcpLFxuICAgIGxpc3RDYWNoZUhhcyA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZUhhcycpLFxuICAgIGxpc3RDYWNoZVNldCA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZVNldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gbGlzdCBjYWNoZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIExpc3RDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBMaXN0Q2FjaGVgLlxuTGlzdENhY2hlLnByb3RvdHlwZS5jbGVhciA9IGxpc3RDYWNoZUNsZWFyO1xuTGlzdENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBsaXN0Q2FjaGVEZWxldGU7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmdldCA9IGxpc3RDYWNoZUdldDtcbkxpc3RDYWNoZS5wcm90b3R5cGUuaGFzID0gbGlzdENhY2hlSGFzO1xuTGlzdENhY2hlLnByb3RvdHlwZS5zZXQgPSBsaXN0Q2FjaGVTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gTGlzdENhY2hlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBNYXAgPSBnZXROYXRpdmUocm9vdCwgJ01hcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcDtcbiIsInZhciBtYXBDYWNoZUNsZWFyID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVDbGVhcicpLFxuICAgIG1hcENhY2hlRGVsZXRlID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVEZWxldGUnKSxcbiAgICBtYXBDYWNoZUdldCA9IHJlcXVpcmUoJy4vX21hcENhY2hlR2V0JyksXG4gICAgbWFwQ2FjaGVIYXMgPSByZXF1aXJlKCcuL19tYXBDYWNoZUhhcycpLFxuICAgIG1hcENhY2hlU2V0ID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbWFwIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIE1hcENhY2hlKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYE1hcENhY2hlYC5cbk1hcENhY2hlLnByb3RvdHlwZS5jbGVhciA9IG1hcENhY2hlQ2xlYXI7XG5NYXBDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbWFwQ2FjaGVEZWxldGU7XG5NYXBDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbWFwQ2FjaGVHZXQ7XG5NYXBDYWNoZS5wcm90b3R5cGUuaGFzID0gbWFwQ2FjaGVIYXM7XG5NYXBDYWNoZS5wcm90b3R5cGUuc2V0ID0gbWFwQ2FjaGVTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gTWFwQ2FjaGU7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFByb21pc2UgPSBnZXROYXRpdmUocm9vdCwgJ1Byb21pc2UnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBTZXQgPSBnZXROYXRpdmUocm9vdCwgJ1NldCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNldDtcbiIsInZhciBNYXBDYWNoZSA9IHJlcXVpcmUoJy4vX01hcENhY2hlJyksXG4gICAgc2V0Q2FjaGVBZGQgPSByZXF1aXJlKCcuL19zZXRDYWNoZUFkZCcpLFxuICAgIHNldENhY2hlSGFzID0gcmVxdWlyZSgnLi9fc2V0Q2FjaGVIYXMnKTtcblxuLyoqXG4gKlxuICogQ3JlYXRlcyBhbiBhcnJheSBjYWNoZSBvYmplY3QgdG8gc3RvcmUgdW5pcXVlIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbdmFsdWVzXSBUaGUgdmFsdWVzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBTZXRDYWNoZSh2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMgPT0gbnVsbCA/IDAgOiB2YWx1ZXMubGVuZ3RoO1xuXG4gIHRoaXMuX19kYXRhX18gPSBuZXcgTWFwQ2FjaGU7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdGhpcy5hZGQodmFsdWVzW2luZGV4XSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYFNldENhY2hlYC5cblNldENhY2hlLnByb3RvdHlwZS5hZGQgPSBTZXRDYWNoZS5wcm90b3R5cGUucHVzaCA9IHNldENhY2hlQWRkO1xuU2V0Q2FjaGUucHJvdG90eXBlLmhhcyA9IHNldENhY2hlSGFzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNldENhY2hlO1xuIiwidmFyIExpc3RDYWNoZSA9IHJlcXVpcmUoJy4vX0xpc3RDYWNoZScpLFxuICAgIHN0YWNrQ2xlYXIgPSByZXF1aXJlKCcuL19zdGFja0NsZWFyJyksXG4gICAgc3RhY2tEZWxldGUgPSByZXF1aXJlKCcuL19zdGFja0RlbGV0ZScpLFxuICAgIHN0YWNrR2V0ID0gcmVxdWlyZSgnLi9fc3RhY2tHZXQnKSxcbiAgICBzdGFja0hhcyA9IHJlcXVpcmUoJy4vX3N0YWNrSGFzJyksXG4gICAgc3RhY2tTZXQgPSByZXF1aXJlKCcuL19zdGFja1NldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBzdGFjayBjYWNoZSBvYmplY3QgdG8gc3RvcmUga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBTdGFjayhlbnRyaWVzKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGUoZW50cmllcyk7XG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYFN0YWNrYC5cblN0YWNrLnByb3RvdHlwZS5jbGVhciA9IHN0YWNrQ2xlYXI7XG5TdGFjay5wcm90b3R5cGVbJ2RlbGV0ZSddID0gc3RhY2tEZWxldGU7XG5TdGFjay5wcm90b3R5cGUuZ2V0ID0gc3RhY2tHZXQ7XG5TdGFjay5wcm90b3R5cGUuaGFzID0gc3RhY2tIYXM7XG5TdGFjay5wcm90b3R5cGUuc2V0ID0gc3RhY2tTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gU3RhY2s7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgU3ltYm9sID0gcm9vdC5TeW1ib2w7XG5cbm1vZHVsZS5leHBvcnRzID0gU3ltYm9sO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFVpbnQ4QXJyYXkgPSByb290LlVpbnQ4QXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gVWludDhBcnJheTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgV2Vha01hcCA9IGdldE5hdGl2ZShyb290LCAnV2Vha01hcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdlYWtNYXA7XG4iLCIvKipcbiAqIEEgZmFzdGVyIGFsdGVybmF0aXZlIHRvIGBGdW5jdGlvbiNhcHBseWAsIHRoaXMgZnVuY3Rpb24gaW52b2tlcyBgZnVuY2BcbiAqIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIGB0aGlzQXJnYCBhbmQgdGhlIGFyZ3VtZW50cyBvZiBgYXJnc2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGludm9rZS5cbiAqIEBwYXJhbSB7Kn0gdGhpc0FyZyBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHtBcnJheX0gYXJncyBUaGUgYXJndW1lbnRzIHRvIGludm9rZSBgZnVuY2Agd2l0aC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXN1bHQgb2YgYGZ1bmNgLlxuICovXG5mdW5jdGlvbiBhcHBseShmdW5jLCB0aGlzQXJnLCBhcmdzKSB7XG4gIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZyk7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gIH1cbiAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXBwbHk7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5mb3JFYWNoYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3JcbiAqIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlFYWNoKGFycmF5LCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgaWYgKGl0ZXJhdGVlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSA9PT0gZmFsc2UpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlFYWNoO1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uZmlsdGVyYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3JcbiAqIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZmlsdGVyZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGFycmF5RmlsdGVyKGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aCxcbiAgICAgIHJlc0luZGV4ID0gMCxcbiAgICAgIHJlc3VsdCA9IFtdO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIHZhbHVlID0gYXJyYXlbaW5kZXhdO1xuICAgIGlmIChwcmVkaWNhdGUodmFsdWUsIGluZGV4LCBhcnJheSkpIHtcbiAgICAgIHJlc3VsdFtyZXNJbmRleCsrXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5RmlsdGVyO1xuIiwidmFyIGJhc2VJbmRleE9mID0gcmVxdWlyZSgnLi9fYmFzZUluZGV4T2YnKTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uaW5jbHVkZXNgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogc3BlY2lmeWluZyBhbiBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdGFyZ2V0IFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB0YXJnZXRgIGlzIGZvdW5kLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5SW5jbHVkZXMoYXJyYXksIHZhbHVlKSB7XG4gIHZhciBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcbiAgcmV0dXJuICEhbGVuZ3RoICYmIGJhc2VJbmRleE9mKGFycmF5LCB2YWx1ZSwgMCkgPiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUluY2x1ZGVzO1xuIiwiLyoqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIGxpa2UgYGFycmF5SW5jbHVkZXNgIGV4Y2VwdCB0aGF0IGl0IGFjY2VwdHMgYSBjb21wYXJhdG9yLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSB0YXJnZXQgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb21wYXJhdG9yIFRoZSBjb21wYXJhdG9yIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHRhcmdldGAgaXMgZm91bmQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlJbmNsdWRlc1dpdGgoYXJyYXksIHZhbHVlLCBjb21wYXJhdG9yKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoY29tcGFyYXRvcih2YWx1ZSwgYXJyYXlbaW5kZXhdKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUluY2x1ZGVzV2l0aDtcbiIsInZhciBiYXNlVGltZXMgPSByZXF1aXJlKCcuL19iYXNlVGltZXMnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgdGhlIGFycmF5LWxpa2UgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluaGVyaXRlZCBTcGVjaWZ5IHJldHVybmluZyBpbmhlcml0ZWQgcHJvcGVydHkgbmFtZXMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBhcnJheUxpa2VLZXlzKHZhbHVlLCBpbmhlcml0ZWQpIHtcbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSksXG4gICAgICBpc0FyZyA9ICFpc0FyciAmJiBpc0FyZ3VtZW50cyh2YWx1ZSksXG4gICAgICBpc0J1ZmYgPSAhaXNBcnIgJiYgIWlzQXJnICYmIGlzQnVmZmVyKHZhbHVlKSxcbiAgICAgIGlzVHlwZSA9ICFpc0FyciAmJiAhaXNBcmcgJiYgIWlzQnVmZiAmJiBpc1R5cGVkQXJyYXkodmFsdWUpLFxuICAgICAgc2tpcEluZGV4ZXMgPSBpc0FyciB8fCBpc0FyZyB8fCBpc0J1ZmYgfHwgaXNUeXBlLFxuICAgICAgcmVzdWx0ID0gc2tpcEluZGV4ZXMgPyBiYXNlVGltZXModmFsdWUubGVuZ3RoLCBTdHJpbmcpIDogW10sXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmICgoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpICYmXG4gICAgICAgICEoc2tpcEluZGV4ZXMgJiYgKFxuICAgICAgICAgICAvLyBTYWZhcmkgOSBoYXMgZW51bWVyYWJsZSBgYXJndW1lbnRzLmxlbmd0aGAgaW4gc3RyaWN0IG1vZGUuXG4gICAgICAgICAgIGtleSA9PSAnbGVuZ3RoJyB8fFxuICAgICAgICAgICAvLyBOb2RlLmpzIDAuMTAgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gYnVmZmVycy5cbiAgICAgICAgICAgKGlzQnVmZiAmJiAoa2V5ID09ICdvZmZzZXQnIHx8IGtleSA9PSAncGFyZW50JykpIHx8XG4gICAgICAgICAgIC8vIFBoYW50b21KUyAyIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIHR5cGVkIGFycmF5cy5cbiAgICAgICAgICAgKGlzVHlwZSAmJiAoa2V5ID09ICdidWZmZXInIHx8IGtleSA9PSAnYnl0ZUxlbmd0aCcgfHwga2V5ID09ICdieXRlT2Zmc2V0JykpIHx8XG4gICAgICAgICAgIC8vIFNraXAgaW5kZXggcHJvcGVydGllcy5cbiAgICAgICAgICAgaXNJbmRleChrZXksIGxlbmd0aClcbiAgICAgICAgKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlMaWtlS2V5cztcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLm1hcGAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlXG4gKiBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgbWFwcGVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBhcnJheU1hcChhcnJheSwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlNYXA7XG4iLCIvKipcbiAqIEFwcGVuZHMgdGhlIGVsZW1lbnRzIG9mIGB2YWx1ZXNgIHRvIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byBhcHBlbmQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlQdXNoKGFycmF5LCB2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMubGVuZ3RoLFxuICAgICAgb2Zmc2V0ID0gYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbb2Zmc2V0ICsgaW5kZXhdID0gdmFsdWVzW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlQdXNoO1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uc29tZWAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlXG4gKiBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbnkgZWxlbWVudCBwYXNzZXMgdGhlIHByZWRpY2F0ZSBjaGVjayxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5U29tZShhcnJheSwgcHJlZGljYXRlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAocHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheVNvbWU7XG4iLCJ2YXIgYmFzZUFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnblZhbHVlJyksXG4gICAgZXEgPSByZXF1aXJlKCcuL2VxJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQXNzaWducyBgdmFsdWVgIHRvIGBrZXlgIG9mIGBvYmplY3RgIGlmIHRoZSBleGlzdGluZyB2YWx1ZSBpcyBub3QgZXF1aXZhbGVudFxuICogdXNpbmcgW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGZvciBlcXVhbGl0eSBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduLlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYXNzaWduLlxuICovXG5mdW5jdGlvbiBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV07XG4gIGlmICghKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGVxKG9ialZhbHVlLCB2YWx1ZSkpIHx8XG4gICAgICAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiAhKGtleSBpbiBvYmplY3QpKSkge1xuICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzaWduVmFsdWU7XG4iLCJ2YXIgZXEgPSByZXF1aXJlKCcuL2VxJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGBrZXlgIGlzIGZvdW5kIGluIGBhcnJheWAgb2Yga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0ga2V5IFRoZSBrZXkgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGFzc29jSW5kZXhPZihhcnJheSwga2V5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIGlmIChlcShhcnJheVtsZW5ndGhdWzBdLCBrZXkpKSB7XG4gICAgICByZXR1cm4gbGVuZ3RoO1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzb2NJbmRleE9mO1xuIiwidmFyIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fZGVmaW5lUHJvcGVydHknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgYXNzaWduVmFsdWVgIGFuZCBgYXNzaWduTWVyZ2VWYWx1ZWAgd2l0aG91dFxuICogdmFsdWUgY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBhc3NpZ24uXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBhc3NpZ24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgaWYgKGtleSA9PSAnX19wcm90b19fJyAmJiBkZWZpbmVQcm9wZXJ0eSkge1xuICAgIGRlZmluZVByb3BlcnR5KG9iamVjdCwga2V5LCB7XG4gICAgICAnY29uZmlndXJhYmxlJzogdHJ1ZSxcbiAgICAgICdlbnVtZXJhYmxlJzogdHJ1ZSxcbiAgICAgICd2YWx1ZSc6IHZhbHVlLFxuICAgICAgJ3dyaXRhYmxlJzogdHJ1ZVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQXNzaWduVmFsdWU7XG4iLCJ2YXIgYmFzZUZvck93biA9IHJlcXVpcmUoJy4vX2Jhc2VGb3JPd24nKSxcbiAgICBjcmVhdGVCYXNlRWFjaCA9IHJlcXVpcmUoJy4vX2NyZWF0ZUJhc2VFYWNoJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZm9yRWFjaGAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdH0gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKi9cbnZhciBiYXNlRWFjaCA9IGNyZWF0ZUJhc2VFYWNoKGJhc2VGb3JPd24pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VFYWNoO1xuIiwidmFyIGJhc2VFYWNoID0gcmVxdWlyZSgnLi9fYmFzZUVhY2gnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5maWx0ZXJgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBmaWx0ZXJlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYmFzZUZpbHRlcihjb2xsZWN0aW9uLCBwcmVkaWNhdGUpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBiYXNlRWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICBpZiAocHJlZGljYXRlKHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbikpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGaWx0ZXI7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZpbmRJbmRleGAgYW5kIGBfLmZpbmRMYXN0SW5kZXhgIHdpdGhvdXRcbiAqIHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUZpbmRJbmRleChhcnJheSwgcHJlZGljYXRlLCBmcm9tSW5kZXgsIGZyb21SaWdodCkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgaW5kZXggPSBmcm9tSW5kZXggKyAoZnJvbVJpZ2h0ID8gMSA6IC0xKTtcblxuICB3aGlsZSAoKGZyb21SaWdodCA/IGluZGV4LS0gOiArK2luZGV4IDwgbGVuZ3RoKSkge1xuICAgIGlmIChwcmVkaWNhdGUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpKSB7XG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRmluZEluZGV4O1xuIiwidmFyIGFycmF5UHVzaCA9IHJlcXVpcmUoJy4vX2FycmF5UHVzaCcpLFxuICAgIGlzRmxhdHRlbmFibGUgPSByZXF1aXJlKCcuL19pc0ZsYXR0ZW5hYmxlJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZmxhdHRlbmAgd2l0aCBzdXBwb3J0IGZvciByZXN0cmljdGluZyBmbGF0dGVuaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gZmxhdHRlbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBkZXB0aCBUaGUgbWF4aW11bSByZWN1cnNpb24gZGVwdGguXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtwcmVkaWNhdGU9aXNGbGF0dGVuYWJsZV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzU3RyaWN0XSBSZXN0cmljdCB0byB2YWx1ZXMgdGhhdCBwYXNzIGBwcmVkaWNhdGVgIGNoZWNrcy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtyZXN1bHQ9W11dIFRoZSBpbml0aWFsIHJlc3VsdCB2YWx1ZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZsYXR0ZW5lZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYmFzZUZsYXR0ZW4oYXJyYXksIGRlcHRoLCBwcmVkaWNhdGUsIGlzU3RyaWN0LCByZXN1bHQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgcHJlZGljYXRlIHx8IChwcmVkaWNhdGUgPSBpc0ZsYXR0ZW5hYmxlKTtcbiAgcmVzdWx0IHx8IChyZXN1bHQgPSBbXSk7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgaWYgKGRlcHRoID4gMCAmJiBwcmVkaWNhdGUodmFsdWUpKSB7XG4gICAgICBpZiAoZGVwdGggPiAxKSB7XG4gICAgICAgIC8vIFJlY3Vyc2l2ZWx5IGZsYXR0ZW4gYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgICAgIGJhc2VGbGF0dGVuKHZhbHVlLCBkZXB0aCAtIDEsIHByZWRpY2F0ZSwgaXNTdHJpY3QsIHJlc3VsdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcnJheVB1c2gocmVzdWx0LCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghaXNTdHJpY3QpIHtcbiAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoXSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGbGF0dGVuO1xuIiwidmFyIGNyZWF0ZUJhc2VGb3IgPSByZXF1aXJlKCcuL19jcmVhdGVCYXNlRm9yJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGJhc2VGb3JPd25gIHdoaWNoIGl0ZXJhdGVzIG92ZXIgYG9iamVjdGBcbiAqIHByb3BlcnRpZXMgcmV0dXJuZWQgYnkgYGtleXNGdW5jYCBhbmQgaW52b2tlcyBgaXRlcmF0ZWVgIGZvciBlYWNoIHByb3BlcnR5LlxuICogSXRlcmF0ZWUgZnVuY3Rpb25zIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseSBieSBleHBsaWNpdGx5IHJldHVybmluZyBgZmFsc2VgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGtleXNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIGtleXMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG52YXIgYmFzZUZvciA9IGNyZWF0ZUJhc2VGb3IoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRm9yO1xuIiwidmFyIGJhc2VGb3IgPSByZXF1aXJlKCcuL19iYXNlRm9yJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZvck93bmAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VGb3JPd24ob2JqZWN0LCBpdGVyYXRlZSkge1xuICByZXR1cm4gb2JqZWN0ICYmIGJhc2VGb3Iob2JqZWN0LCBpdGVyYXRlZSwga2V5cyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZvck93bjtcbiIsInZhciBjYXN0UGF0aCA9IHJlcXVpcmUoJy4vX2Nhc3RQYXRoJyksXG4gICAgdG9LZXkgPSByZXF1aXJlKCcuL190b0tleScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmdldGAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWZhdWx0IHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXNvbHZlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldChvYmplY3QsIHBhdGgpIHtcbiAgcGF0aCA9IGNhc3RQYXRoKHBhdGgsIG9iamVjdCk7XG5cbiAgdmFyIGluZGV4ID0gMCxcbiAgICAgIGxlbmd0aCA9IHBhdGgubGVuZ3RoO1xuXG4gIHdoaWxlIChvYmplY3QgIT0gbnVsbCAmJiBpbmRleCA8IGxlbmd0aCkge1xuICAgIG9iamVjdCA9IG9iamVjdFt0b0tleShwYXRoW2luZGV4KytdKV07XG4gIH1cbiAgcmV0dXJuIChpbmRleCAmJiBpbmRleCA9PSBsZW5ndGgpID8gb2JqZWN0IDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXQ7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgZ2V0UmF3VGFnID0gcmVxdWlyZSgnLi9fZ2V0UmF3VGFnJyksXG4gICAgb2JqZWN0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19vYmplY3RUb1N0cmluZycpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbnVsbFRhZyA9ICdbb2JqZWN0IE51bGxdJyxcbiAgICB1bmRlZmluZWRUYWcgPSAnW29iamVjdCBVbmRlZmluZWRdJztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldFRhZ2Agd2l0aG91dCBmYWxsYmFja3MgZm9yIGJ1Z2d5IGVudmlyb25tZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0VGFnKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWRUYWcgOiBudWxsVGFnO1xuICB9XG4gIHZhbHVlID0gT2JqZWN0KHZhbHVlKTtcbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiB2YWx1ZSlcbiAgICA/IGdldFJhd1RhZyh2YWx1ZSlcbiAgICA6IG9iamVjdFRvU3RyaW5nKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlR2V0VGFnO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5oYXNgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30ga2V5IFRoZSBrZXkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VIYXMob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIG9iamVjdCAhPSBudWxsICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VIYXM7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmhhc0luYCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IGtleSBUaGUga2V5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSGFzSW4ob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIG9iamVjdCAhPSBudWxsICYmIGtleSBpbiBPYmplY3Qob2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSGFzSW47XG4iLCJ2YXIgYmFzZUZpbmRJbmRleCA9IHJlcXVpcmUoJy4vX2Jhc2VGaW5kSW5kZXgnKSxcbiAgICBiYXNlSXNOYU4gPSByZXF1aXJlKCcuL19iYXNlSXNOYU4nKSxcbiAgICBzdHJpY3RJbmRleE9mID0gcmVxdWlyZSgnLi9fc3RyaWN0SW5kZXhPZicpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmluZGV4T2ZgIHdpdGhvdXQgYGZyb21JbmRleGAgYm91bmRzIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBiYXNlSW5kZXhPZihhcnJheSwgdmFsdWUsIGZyb21JbmRleCkge1xuICByZXR1cm4gdmFsdWUgPT09IHZhbHVlXG4gICAgPyBzdHJpY3RJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KVxuICAgIDogYmFzZUZpbmRJbmRleChhcnJheSwgYmFzZUlzTmFOLCBmcm9tSW5kZXgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJbmRleE9mO1xuIiwidmFyIFNldENhY2hlID0gcmVxdWlyZSgnLi9fU2V0Q2FjaGUnKSxcbiAgICBhcnJheUluY2x1ZGVzID0gcmVxdWlyZSgnLi9fYXJyYXlJbmNsdWRlcycpLFxuICAgIGFycmF5SW5jbHVkZXNXaXRoID0gcmVxdWlyZSgnLi9fYXJyYXlJbmNsdWRlc1dpdGgnKSxcbiAgICBhcnJheU1hcCA9IHJlcXVpcmUoJy4vX2FycmF5TWFwJyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgY2FjaGVIYXMgPSByZXF1aXJlKCcuL19jYWNoZUhhcycpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgbWV0aG9kcyBsaWtlIGBfLmludGVyc2VjdGlvbmAsIHdpdGhvdXQgc3VwcG9ydFxuICogZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMsIHRoYXQgYWNjZXB0cyBhbiBhcnJheSBvZiBhcnJheXMgdG8gaW5zcGVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXlzIFRoZSBhcnJheXMgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZV0gVGhlIGl0ZXJhdGVlIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY29tcGFyYXRvcl0gVGhlIGNvbXBhcmF0b3IgaW52b2tlZCBwZXIgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5IG9mIHNoYXJlZCB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJbnRlcnNlY3Rpb24oYXJyYXlzLCBpdGVyYXRlZSwgY29tcGFyYXRvcikge1xuICB2YXIgaW5jbHVkZXMgPSBjb21wYXJhdG9yID8gYXJyYXlJbmNsdWRlc1dpdGggOiBhcnJheUluY2x1ZGVzLFxuICAgICAgbGVuZ3RoID0gYXJyYXlzWzBdLmxlbmd0aCxcbiAgICAgIG90aExlbmd0aCA9IGFycmF5cy5sZW5ndGgsXG4gICAgICBvdGhJbmRleCA9IG90aExlbmd0aCxcbiAgICAgIGNhY2hlcyA9IEFycmF5KG90aExlbmd0aCksXG4gICAgICBtYXhMZW5ndGggPSBJbmZpbml0eSxcbiAgICAgIHJlc3VsdCA9IFtdO1xuXG4gIHdoaWxlIChvdGhJbmRleC0tKSB7XG4gICAgdmFyIGFycmF5ID0gYXJyYXlzW290aEluZGV4XTtcbiAgICBpZiAob3RoSW5kZXggJiYgaXRlcmF0ZWUpIHtcbiAgICAgIGFycmF5ID0gYXJyYXlNYXAoYXJyYXksIGJhc2VVbmFyeShpdGVyYXRlZSkpO1xuICAgIH1cbiAgICBtYXhMZW5ndGggPSBuYXRpdmVNaW4oYXJyYXkubGVuZ3RoLCBtYXhMZW5ndGgpO1xuICAgIGNhY2hlc1tvdGhJbmRleF0gPSAhY29tcGFyYXRvciAmJiAoaXRlcmF0ZWUgfHwgKGxlbmd0aCA+PSAxMjAgJiYgYXJyYXkubGVuZ3RoID49IDEyMCkpXG4gICAgICA/IG5ldyBTZXRDYWNoZShvdGhJbmRleCAmJiBhcnJheSlcbiAgICAgIDogdW5kZWZpbmVkO1xuICB9XG4gIGFycmF5ID0gYXJyYXlzWzBdO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgc2VlbiA9IGNhY2hlc1swXTtcblxuICBvdXRlcjpcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGggJiYgcmVzdWx0Lmxlbmd0aCA8IG1heExlbmd0aCkge1xuICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XSxcbiAgICAgICAgY29tcHV0ZWQgPSBpdGVyYXRlZSA/IGl0ZXJhdGVlKHZhbHVlKSA6IHZhbHVlO1xuXG4gICAgdmFsdWUgPSAoY29tcGFyYXRvciB8fCB2YWx1ZSAhPT0gMCkgPyB2YWx1ZSA6IDA7XG4gICAgaWYgKCEoc2VlblxuICAgICAgICAgID8gY2FjaGVIYXMoc2VlbiwgY29tcHV0ZWQpXG4gICAgICAgICAgOiBpbmNsdWRlcyhyZXN1bHQsIGNvbXB1dGVkLCBjb21wYXJhdG9yKVxuICAgICAgICApKSB7XG4gICAgICBvdGhJbmRleCA9IG90aExlbmd0aDtcbiAgICAgIHdoaWxlICgtLW90aEluZGV4KSB7XG4gICAgICAgIHZhciBjYWNoZSA9IGNhY2hlc1tvdGhJbmRleF07XG4gICAgICAgIGlmICghKGNhY2hlXG4gICAgICAgICAgICAgID8gY2FjaGVIYXMoY2FjaGUsIGNvbXB1dGVkKVxuICAgICAgICAgICAgICA6IGluY2x1ZGVzKGFycmF5c1tvdGhJbmRleF0sIGNvbXB1dGVkLCBjb21wYXJhdG9yKSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgIGNvbnRpbnVlIG91dGVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc2Vlbikge1xuICAgICAgICBzZWVuLnB1c2goY29tcHV0ZWQpO1xuICAgICAgfVxuICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJbnRlcnNlY3Rpb247XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzQXJndW1lbnRzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBhcmdzVGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc0FyZ3VtZW50cztcbiIsInZhciBiYXNlSXNFcXVhbERlZXAgPSByZXF1aXJlKCcuL19iYXNlSXNFcXVhbERlZXAnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzRXF1YWxgIHdoaWNoIHN1cHBvcnRzIHBhcnRpYWwgY29tcGFyaXNvbnNcbiAqIGFuZCB0cmFja3MgdHJhdmVyc2VkIG9iamVjdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0geyp9IG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtib29sZWFufSBiaXRtYXNrIFRoZSBiaXRtYXNrIGZsYWdzLlxuICogIDEgLSBVbm9yZGVyZWQgY29tcGFyaXNvblxuICogIDIgLSBQYXJ0aWFsIGNvbXBhcmlzb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBgdmFsdWVgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNFcXVhbCh2YWx1ZSwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKSB7XG4gIGlmICh2YWx1ZSA9PT0gb3RoZXIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAodmFsdWUgPT0gbnVsbCB8fCBvdGhlciA9PSBudWxsIHx8ICghaXNPYmplY3QodmFsdWUpICYmICFpc09iamVjdExpa2Uob3RoZXIpKSkge1xuICAgIHJldHVybiB2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyO1xuICB9XG4gIHJldHVybiBiYXNlSXNFcXVhbERlZXAodmFsdWUsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBiYXNlSXNFcXVhbCwgc3RhY2spO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc0VxdWFsO1xuIiwidmFyIFN0YWNrID0gcmVxdWlyZSgnLi9fU3RhY2snKSxcbiAgICBlcXVhbEFycmF5cyA9IHJlcXVpcmUoJy4vX2VxdWFsQXJyYXlzJyksXG4gICAgZXF1YWxCeVRhZyA9IHJlcXVpcmUoJy4vX2VxdWFsQnlUYWcnKSxcbiAgICBlcXVhbE9iamVjdHMgPSByZXF1aXJlKCcuL19lcXVhbE9iamVjdHMnKSxcbiAgICBnZXRUYWcgPSByZXF1aXJlKCcuL19nZXRUYWcnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi9pc1R5cGVkQXJyYXknKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgdmFsdWUgY29tcGFyaXNvbnMuICovXG52YXIgQ09NUEFSRV9QQVJUSUFMX0ZMQUcgPSAxO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJztcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsYCBmb3IgYXJyYXlzIGFuZCBvYmplY3RzIHdoaWNoIHBlcmZvcm1zXG4gKiBkZWVwIGNvbXBhcmlzb25zIGFuZCB0cmFja3MgdHJhdmVyc2VkIG9iamVjdHMgZW5hYmxpbmcgb2JqZWN0cyB3aXRoIGNpcmN1bGFyXG4gKiByZWZlcmVuY2VzIHRvIGJlIGNvbXBhcmVkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RhY2tdIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNFcXVhbERlZXAob2JqZWN0LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaykge1xuICB2YXIgb2JqSXNBcnIgPSBpc0FycmF5KG9iamVjdCksXG4gICAgICBvdGhJc0FyciA9IGlzQXJyYXkob3RoZXIpLFxuICAgICAgb2JqVGFnID0gYXJyYXlUYWcsXG4gICAgICBvdGhUYWcgPSBhcnJheVRhZztcblxuICBpZiAoIW9iaklzQXJyKSB7XG4gICAgb2JqVGFnID0gZ2V0VGFnKG9iamVjdCk7XG4gICAgb2JqVGFnID0gb2JqVGFnID09IGFyZ3NUYWcgPyBvYmplY3RUYWcgOiBvYmpUYWc7XG4gIH1cbiAgaWYgKCFvdGhJc0Fycikge1xuICAgIG90aFRhZyA9IGdldFRhZyhvdGhlcik7XG4gICAgb3RoVGFnID0gb3RoVGFnID09IGFyZ3NUYWcgPyBvYmplY3RUYWcgOiBvdGhUYWc7XG4gIH1cbiAgdmFyIG9iaklzT2JqID0gb2JqVGFnID09IG9iamVjdFRhZyxcbiAgICAgIG90aElzT2JqID0gb3RoVGFnID09IG9iamVjdFRhZyxcbiAgICAgIGlzU2FtZVRhZyA9IG9ialRhZyA9PSBvdGhUYWc7XG5cbiAgaWYgKGlzU2FtZVRhZyAmJiBpc0J1ZmZlcihvYmplY3QpKSB7XG4gICAgaWYgKCFpc0J1ZmZlcihvdGhlcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgb2JqSXNBcnIgPSB0cnVlO1xuICAgIG9iaklzT2JqID0gZmFsc2U7XG4gIH1cbiAgaWYgKGlzU2FtZVRhZyAmJiAhb2JqSXNPYmopIHtcbiAgICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICAgIHJldHVybiAob2JqSXNBcnIgfHwgaXNUeXBlZEFycmF5KG9iamVjdCkpXG4gICAgICA/IGVxdWFsQXJyYXlzKG9iamVjdCwgb3RoZXIsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGVxdWFsRnVuYywgc3RhY2spXG4gICAgICA6IGVxdWFsQnlUYWcob2JqZWN0LCBvdGhlciwgb2JqVGFnLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKTtcbiAgfVxuICBpZiAoIShiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUcpKSB7XG4gICAgdmFyIG9iaklzV3JhcHBlZCA9IG9iaklzT2JqICYmIGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCAnX193cmFwcGVkX18nKSxcbiAgICAgICAgb3RoSXNXcmFwcGVkID0gb3RoSXNPYmogJiYgaGFzT3duUHJvcGVydHkuY2FsbChvdGhlciwgJ19fd3JhcHBlZF9fJyk7XG5cbiAgICBpZiAob2JqSXNXcmFwcGVkIHx8IG90aElzV3JhcHBlZCkge1xuICAgICAgdmFyIG9ialVud3JhcHBlZCA9IG9iaklzV3JhcHBlZCA/IG9iamVjdC52YWx1ZSgpIDogb2JqZWN0LFxuICAgICAgICAgIG90aFVud3JhcHBlZCA9IG90aElzV3JhcHBlZCA/IG90aGVyLnZhbHVlKCkgOiBvdGhlcjtcblxuICAgICAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgICAgIHJldHVybiBlcXVhbEZ1bmMob2JqVW53cmFwcGVkLCBvdGhVbndyYXBwZWQsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIHN0YWNrKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFpc1NhbWVUYWcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgcmV0dXJuIGVxdWFsT2JqZWN0cyhvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNFcXVhbERlZXA7XG4iLCJ2YXIgU3RhY2sgPSByZXF1aXJlKCcuL19TdGFjaycpLFxuICAgIGJhc2VJc0VxdWFsID0gcmVxdWlyZSgnLi9fYmFzZUlzRXF1YWwnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgdmFsdWUgY29tcGFyaXNvbnMuICovXG52YXIgQ09NUEFSRV9QQVJUSUFMX0ZMQUcgPSAxLFxuICAgIENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcgPSAyO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTWF0Y2hgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3Qgb2YgcHJvcGVydHkgdmFsdWVzIHRvIG1hdGNoLlxuICogQHBhcmFtIHtBcnJheX0gbWF0Y2hEYXRhIFRoZSBwcm9wZXJ0eSBuYW1lcywgdmFsdWVzLCBhbmQgY29tcGFyZSBmbGFncyB0byBtYXRjaC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBvYmplY3RgIGlzIGEgbWF0Y2gsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTWF0Y2gob2JqZWN0LCBzb3VyY2UsIG1hdGNoRGF0YSwgY3VzdG9taXplcikge1xuICB2YXIgaW5kZXggPSBtYXRjaERhdGEubGVuZ3RoLFxuICAgICAgbGVuZ3RoID0gaW5kZXgsXG4gICAgICBub0N1c3RvbWl6ZXIgPSAhY3VzdG9taXplcjtcblxuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICByZXR1cm4gIWxlbmd0aDtcbiAgfVxuICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICB2YXIgZGF0YSA9IG1hdGNoRGF0YVtpbmRleF07XG4gICAgaWYgKChub0N1c3RvbWl6ZXIgJiYgZGF0YVsyXSlcbiAgICAgICAgICA/IGRhdGFbMV0gIT09IG9iamVjdFtkYXRhWzBdXVxuICAgICAgICAgIDogIShkYXRhWzBdIGluIG9iamVjdClcbiAgICAgICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgZGF0YSA9IG1hdGNoRGF0YVtpbmRleF07XG4gICAgdmFyIGtleSA9IGRhdGFbMF0sXG4gICAgICAgIG9ialZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgIHNyY1ZhbHVlID0gZGF0YVsxXTtcblxuICAgIGlmIChub0N1c3RvbWl6ZXIgJiYgZGF0YVsyXSkge1xuICAgICAgaWYgKG9ialZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzdGFjayA9IG5ldyBTdGFjaztcbiAgICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBjdXN0b21pemVyKG9ialZhbHVlLCBzcmNWYWx1ZSwga2V5LCBvYmplY3QsIHNvdXJjZSwgc3RhY2spO1xuICAgICAgfVxuICAgICAgaWYgKCEocmVzdWx0ID09PSB1bmRlZmluZWRcbiAgICAgICAgICAgID8gYmFzZUlzRXF1YWwoc3JjVmFsdWUsIG9ialZhbHVlLCBDT01QQVJFX1BBUlRJQUxfRkxBRyB8IENPTVBBUkVfVU5PUkRFUkVEX0ZMQUcsIGN1c3RvbWl6ZXIsIHN0YWNrKVxuICAgICAgICAgICAgOiByZXN1bHRcbiAgICAgICAgICApKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzTWF0Y2g7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmFOYCB3aXRob3V0IHN1cHBvcnQgZm9yIG51bWJlciBvYmplY3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGBOYU5gLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc05hTih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IHZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc05hTjtcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNNYXNrZWQgPSByZXF1aXJlKCcuL19pc01hc2tlZCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIHRvU291cmNlID0gcmVxdWlyZSgnLi9fdG9Tb3VyY2UnKTtcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgXG4gKiBbc3ludGF4IGNoYXJhY3RlcnNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXBhdHRlcm5zKS5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGUsXG4gICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZnVuY1RvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmF0aXZlYCB3aXRob3V0IGJhZCBzaGltIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbixcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSB8fCBpc01hc2tlZCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHBhdHRlcm4gPSBpc0Z1bmN0aW9uKHZhbHVlKSA/IHJlSXNOYXRpdmUgOiByZUlzSG9zdEN0b3I7XG4gIHJldHVybiBwYXR0ZXJuLnRlc3QodG9Tb3VyY2UodmFsdWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNOYXRpdmU7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBvZiB0eXBlZCBhcnJheXMuICovXG52YXIgdHlwZWRBcnJheVRhZ3MgPSB7fTtcbnR5cGVkQXJyYXlUYWdzW2Zsb2F0MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbZmxvYXQ2NFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50OFRhZ10gPSB0eXBlZEFycmF5VGFnc1tpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDhUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xudHlwZWRBcnJheVRhZ3NbYXJnc1RhZ10gPSB0eXBlZEFycmF5VGFnc1thcnJheVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gdHlwZWRBcnJheVRhZ3NbYm9vbFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZGF0YVZpZXdUYWddID0gdHlwZWRBcnJheVRhZ3NbZGF0ZVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZXJyb3JUYWddID0gdHlwZWRBcnJheVRhZ3NbZnVuY1RhZ10gPVxudHlwZWRBcnJheVRhZ3NbbWFwVGFnXSA9IHR5cGVkQXJyYXlUYWdzW251bWJlclRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbb2JqZWN0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3JlZ2V4cFRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbc2V0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3N0cmluZ1RhZ10gPVxudHlwZWRBcnJheVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc1R5cGVkQXJyYXlgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJlxuICAgIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgISF0eXBlZEFycmF5VGFnc1tiYXNlR2V0VGFnKHZhbHVlKV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzVHlwZWRBcnJheTtcbiIsInZhciBiYXNlTWF0Y2hlcyA9IHJlcXVpcmUoJy4vX2Jhc2VNYXRjaGVzJyksXG4gICAgYmFzZU1hdGNoZXNQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2Jhc2VNYXRjaGVzUHJvcGVydHknKSxcbiAgICBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgcHJvcGVydHkgPSByZXF1aXJlKCcuL3Byb3BlcnR5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXRlcmF0ZWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IFt2YWx1ZT1fLmlkZW50aXR5XSBUaGUgdmFsdWUgdG8gY29udmVydCB0byBhbiBpdGVyYXRlZS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgaXRlcmF0ZWUuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJdGVyYXRlZSh2YWx1ZSkge1xuICAvLyBEb24ndCBzdG9yZSB0aGUgYHR5cGVvZmAgcmVzdWx0IGluIGEgdmFyaWFibGUgdG8gYXZvaWQgYSBKSVQgYnVnIGluIFNhZmFyaSA5LlxuICAvLyBTZWUgaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTE1NjAzNCBmb3IgbW9yZSBkZXRhaWxzLlxuICBpZiAodHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gaWRlbnRpdHk7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBpc0FycmF5KHZhbHVlKVxuICAgICAgPyBiYXNlTWF0Y2hlc1Byb3BlcnR5KHZhbHVlWzBdLCB2YWx1ZVsxXSlcbiAgICAgIDogYmFzZU1hdGNoZXModmFsdWUpO1xuICB9XG4gIHJldHVybiBwcm9wZXJ0eSh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUl0ZXJhdGVlO1xuIiwidmFyIGlzUHJvdG90eXBlID0gcmVxdWlyZSgnLi9faXNQcm90b3R5cGUnKSxcbiAgICBuYXRpdmVLZXlzID0gcmVxdWlyZSgnLi9fbmF0aXZlS2V5cycpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmtleXNgIHdoaWNoIGRvZXNuJ3QgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUtleXMob2JqZWN0KSB7XG4gIGlmICghaXNQcm90b3R5cGUob2JqZWN0KSkge1xuICAgIHJldHVybiBuYXRpdmVLZXlzKG9iamVjdCk7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gT2JqZWN0KG9iamVjdCkpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkgJiYga2V5ICE9ICdjb25zdHJ1Y3RvcicpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUtleXM7XG4iLCJ2YXIgYmFzZUVhY2ggPSByZXF1aXJlKCcuL19iYXNlRWFjaCcpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLm1hcGAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgbWFwcGVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBiYXNlTWFwKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gaXNBcnJheUxpa2UoY29sbGVjdGlvbikgPyBBcnJheShjb2xsZWN0aW9uLmxlbmd0aCkgOiBbXTtcblxuICBiYXNlRWFjaChjb2xsZWN0aW9uLCBmdW5jdGlvbih2YWx1ZSwga2V5LCBjb2xsZWN0aW9uKSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gaXRlcmF0ZWUodmFsdWUsIGtleSwgY29sbGVjdGlvbik7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VNYXA7XG4iLCJ2YXIgYmFzZUlzTWF0Y2ggPSByZXF1aXJlKCcuL19iYXNlSXNNYXRjaCcpLFxuICAgIGdldE1hdGNoRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hdGNoRGF0YScpLFxuICAgIG1hdGNoZXNTdHJpY3RDb21wYXJhYmxlID0gcmVxdWlyZSgnLi9fbWF0Y2hlc1N0cmljdENvbXBhcmFibGUnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5tYXRjaGVzYCB3aGljaCBkb2Vzbid0IGNsb25lIGBzb3VyY2VgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3Qgb2YgcHJvcGVydHkgdmFsdWVzIHRvIG1hdGNoLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc3BlYyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZU1hdGNoZXMoc291cmNlKSB7XG4gIHZhciBtYXRjaERhdGEgPSBnZXRNYXRjaERhdGEoc291cmNlKTtcbiAgaWYgKG1hdGNoRGF0YS5sZW5ndGggPT0gMSAmJiBtYXRjaERhdGFbMF1bMl0pIHtcbiAgICByZXR1cm4gbWF0Y2hlc1N0cmljdENvbXBhcmFibGUobWF0Y2hEYXRhWzBdWzBdLCBtYXRjaERhdGFbMF1bMV0pO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09PSBzb3VyY2UgfHwgYmFzZUlzTWF0Y2gob2JqZWN0LCBzb3VyY2UsIG1hdGNoRGF0YSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU1hdGNoZXM7XG4iLCJ2YXIgYmFzZUlzRXF1YWwgPSByZXF1aXJlKCcuL19iYXNlSXNFcXVhbCcpLFxuICAgIGdldCA9IHJlcXVpcmUoJy4vZ2V0JyksXG4gICAgaGFzSW4gPSByZXF1aXJlKCcuL2hhc0luJyksXG4gICAgaXNLZXkgPSByZXF1aXJlKCcuL19pc0tleScpLFxuICAgIGlzU3RyaWN0Q29tcGFyYWJsZSA9IHJlcXVpcmUoJy4vX2lzU3RyaWN0Q29tcGFyYWJsZScpLFxuICAgIG1hdGNoZXNTdHJpY3RDb21wYXJhYmxlID0gcmVxdWlyZSgnLi9fbWF0Y2hlc1N0cmljdENvbXBhcmFibGUnKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHZhbHVlIGNvbXBhcmlzb25zLiAqL1xudmFyIENPTVBBUkVfUEFSVElBTF9GTEFHID0gMSxcbiAgICBDT01QQVJFX1VOT1JERVJFRF9GTEFHID0gMjtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5tYXRjaGVzUHJvcGVydHlgIHdoaWNoIGRvZXNuJ3QgY2xvbmUgYHNyY1ZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEBwYXJhbSB7Kn0gc3JjVmFsdWUgVGhlIHZhbHVlIHRvIG1hdGNoLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc3BlYyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZU1hdGNoZXNQcm9wZXJ0eShwYXRoLCBzcmNWYWx1ZSkge1xuICBpZiAoaXNLZXkocGF0aCkgJiYgaXNTdHJpY3RDb21wYXJhYmxlKHNyY1ZhbHVlKSkge1xuICAgIHJldHVybiBtYXRjaGVzU3RyaWN0Q29tcGFyYWJsZSh0b0tleShwYXRoKSwgc3JjVmFsdWUpO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIgb2JqVmFsdWUgPSBnZXQob2JqZWN0LCBwYXRoKTtcbiAgICByZXR1cm4gKG9ialZhbHVlID09PSB1bmRlZmluZWQgJiYgb2JqVmFsdWUgPT09IHNyY1ZhbHVlKVxuICAgICAgPyBoYXNJbihvYmplY3QsIHBhdGgpXG4gICAgICA6IGJhc2VJc0VxdWFsKHNyY1ZhbHVlLCBvYmpWYWx1ZSwgQ09NUEFSRV9QQVJUSUFMX0ZMQUcgfCBDT01QQVJFX1VOT1JERVJFRF9GTEFHKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlTWF0Y2hlc1Byb3BlcnR5O1xuIiwidmFyIGJhc2VQaWNrQnkgPSByZXF1aXJlKCcuL19iYXNlUGlja0J5JyksXG4gICAgaGFzSW4gPSByZXF1aXJlKCcuL2hhc0luJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucGlja2Agd2l0aG91dCBzdXBwb3J0IGZvciBpbmRpdmlkdWFsXG4gKiBwcm9wZXJ0eSBpZGVudGlmaWVycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nW119IHBhdGhzIFRoZSBwcm9wZXJ0eSBwYXRocyB0byBwaWNrLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gYmFzZVBpY2sob2JqZWN0LCBwYXRocykge1xuICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgcmV0dXJuIGJhc2VQaWNrQnkob2JqZWN0LCBwYXRocywgZnVuY3Rpb24odmFsdWUsIHBhdGgpIHtcbiAgICByZXR1cm4gaGFzSW4ob2JqZWN0LCBwYXRoKTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVBpY2s7XG4iLCJ2YXIgYmFzZUdldCA9IHJlcXVpcmUoJy4vX2Jhc2VHZXQnKSxcbiAgICBiYXNlU2V0ID0gcmVxdWlyZSgnLi9fYmFzZVNldCcpLFxuICAgIGNhc3RQYXRoID0gcmVxdWlyZSgnLi9fY2FzdFBhdGgnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiAgYF8ucGlja0J5YCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBwYXRocyBUaGUgcHJvcGVydHkgcGF0aHMgdG8gcGljay5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgcHJvcGVydHkuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBiYXNlUGlja0J5KG9iamVjdCwgcGF0aHMsIHByZWRpY2F0ZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHBhdGhzLmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IHt9O1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIHBhdGggPSBwYXRoc1tpbmRleF0sXG4gICAgICAgIHZhbHVlID0gYmFzZUdldChvYmplY3QsIHBhdGgpO1xuXG4gICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSwgcGF0aCkpIHtcbiAgICAgIGJhc2VTZXQocmVzdWx0LCBjYXN0UGF0aChwYXRoLCBvYmplY3QpLCB2YWx1ZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVBpY2tCeTtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHJvcGVydHlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBhY2Nlc3NvciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVByb3BlcnR5KGtleSkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVByb3BlcnR5O1xuIiwidmFyIGJhc2VHZXQgPSByZXF1aXJlKCcuL19iYXNlR2V0Jyk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlUHJvcGVydHlgIHdoaWNoIHN1cHBvcnRzIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBhY2Nlc3NvciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVByb3BlcnR5RGVlcChwYXRoKSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gYmFzZUdldChvYmplY3QsIHBhdGgpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VQcm9wZXJ0eURlZXA7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnByb3BlcnR5T2ZgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYWNjZXNzb3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VQcm9wZXJ0eU9mKG9iamVjdCkge1xuICByZXR1cm4gZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVByb3BlcnR5T2Y7XG4iLCJ2YXIgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5JyksXG4gICAgb3ZlclJlc3QgPSByZXF1aXJlKCcuL19vdmVyUmVzdCcpLFxuICAgIHNldFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fc2V0VG9TdHJpbmcnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5yZXN0YCB3aGljaCBkb2Vzbid0IHZhbGlkYXRlIG9yIGNvZXJjZSBhcmd1bWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PWZ1bmMubGVuZ3RoLTFdIFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcmVzdCBwYXJhbWV0ZXIuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVJlc3QoZnVuYywgc3RhcnQpIHtcbiAgcmV0dXJuIHNldFRvU3RyaW5nKG92ZXJSZXN0KGZ1bmMsIHN0YXJ0LCBpZGVudGl0eSksIGZ1bmMgKyAnJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVJlc3Q7XG4iLCJ2YXIgYXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19hc3NpZ25WYWx1ZScpLFxuICAgIGNhc3RQYXRoID0gcmVxdWlyZSgnLi9fY2FzdFBhdGgnKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi9faXNJbmRleCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIHRvS2V5ID0gcmVxdWlyZSgnLi9fdG9LZXknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5zZXRgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIHBhdGggY3JlYXRpb24uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlU2V0KG9iamVjdCwgcGF0aCwgdmFsdWUsIGN1c3RvbWl6ZXIpIHtcbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfVxuICBwYXRoID0gY2FzdFBhdGgocGF0aCwgb2JqZWN0KTtcblxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHBhdGgubGVuZ3RoLFxuICAgICAgbGFzdEluZGV4ID0gbGVuZ3RoIC0gMSxcbiAgICAgIG5lc3RlZCA9IG9iamVjdDtcblxuICB3aGlsZSAobmVzdGVkICE9IG51bGwgJiYgKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSB0b0tleShwYXRoW2luZGV4XSksXG4gICAgICAgIG5ld1ZhbHVlID0gdmFsdWU7XG5cbiAgICBpZiAoaW5kZXggIT0gbGFzdEluZGV4KSB7XG4gICAgICB2YXIgb2JqVmFsdWUgPSBuZXN0ZWRba2V5XTtcbiAgICAgIG5ld1ZhbHVlID0gY3VzdG9taXplciA/IGN1c3RvbWl6ZXIob2JqVmFsdWUsIGtleSwgbmVzdGVkKSA6IHVuZGVmaW5lZDtcbiAgICAgIGlmIChuZXdWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gaXNPYmplY3Qob2JqVmFsdWUpXG4gICAgICAgICAgPyBvYmpWYWx1ZVxuICAgICAgICAgIDogKGlzSW5kZXgocGF0aFtpbmRleCArIDFdKSA/IFtdIDoge30pO1xuICAgICAgfVxuICAgIH1cbiAgICBhc3NpZ25WYWx1ZShuZXN0ZWQsIGtleSwgbmV3VmFsdWUpO1xuICAgIG5lc3RlZCA9IG5lc3RlZFtrZXldO1xuICB9XG4gIHJldHVybiBvYmplY3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVNldDtcbiIsInZhciBjb25zdGFudCA9IHJlcXVpcmUoJy4vY29uc3RhbnQnKSxcbiAgICBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2RlZmluZVByb3BlcnR5JyksXG4gICAgaWRlbnRpdHkgPSByZXF1aXJlKCcuL2lkZW50aXR5Jyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYHNldFRvU3RyaW5nYCB3aXRob3V0IHN1cHBvcnQgZm9yIGhvdCBsb29wIHNob3J0aW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdHJpbmcgVGhlIGB0b1N0cmluZ2AgcmVzdWx0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGBmdW5jYC5cbiAqL1xudmFyIGJhc2VTZXRUb1N0cmluZyA9ICFkZWZpbmVQcm9wZXJ0eSA/IGlkZW50aXR5IDogZnVuY3Rpb24oZnVuYywgc3RyaW5nKSB7XG4gIHJldHVybiBkZWZpbmVQcm9wZXJ0eShmdW5jLCAndG9TdHJpbmcnLCB7XG4gICAgJ2NvbmZpZ3VyYWJsZSc6IHRydWUsXG4gICAgJ2VudW1lcmFibGUnOiBmYWxzZSxcbiAgICAndmFsdWUnOiBjb25zdGFudChzdHJpbmcpLFxuICAgICd3cml0YWJsZSc6IHRydWVcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VTZXRUb1N0cmluZztcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uc2xpY2VgIHdpdGhvdXQgYW4gaXRlcmF0ZWUgY2FsbCBndWFyZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIHNsaWNlLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD0wXSBUaGUgc3RhcnQgcG9zaXRpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gW2VuZD1hcnJheS5sZW5ndGhdIFRoZSBlbmQgcG9zaXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHNsaWNlIG9mIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VTbGljZShhcnJheSwgc3RhcnQsIGVuZCkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcblxuICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgPSAtc3RhcnQgPiBsZW5ndGggPyAwIDogKGxlbmd0aCArIHN0YXJ0KTtcbiAgfVxuICBlbmQgPSBlbmQgPiBsZW5ndGggPyBsZW5ndGggOiBlbmQ7XG4gIGlmIChlbmQgPCAwKSB7XG4gICAgZW5kICs9IGxlbmd0aDtcbiAgfVxuICBsZW5ndGggPSBzdGFydCA+IGVuZCA/IDAgOiAoKGVuZCAtIHN0YXJ0KSA+Pj4gMCk7XG4gIHN0YXJ0ID4+Pj0gMDtcblxuICB2YXIgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICByZXN1bHRbaW5kZXhdID0gYXJyYXlbaW5kZXggKyBzdGFydF07XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlU2xpY2U7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnN1bWAgYW5kIGBfLnN1bUJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHN1bS5cbiAqL1xuZnVuY3Rpb24gYmFzZVN1bShhcnJheSwgaXRlcmF0ZWUpIHtcbiAgdmFyIHJlc3VsdCxcbiAgICAgIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgY3VycmVudCA9IGl0ZXJhdGVlKGFycmF5W2luZGV4XSk7XG4gICAgaWYgKGN1cnJlbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0ID09PSB1bmRlZmluZWQgPyBjdXJyZW50IDogKHJlc3VsdCArIGN1cnJlbnQpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VTdW07XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRpbWVzYCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHNcbiAqIG9yIG1heCBhcnJheSBsZW5ndGggY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge251bWJlcn0gbiBUaGUgbnVtYmVyIG9mIHRpbWVzIHRvIGludm9rZSBgaXRlcmF0ZWVgLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcmVzdWx0cy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRpbWVzKG4sIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobik7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBuKSB7XG4gICAgcmVzdWx0W2luZGV4XSA9IGl0ZXJhdGVlKGluZGV4KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VUaW1lcztcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBhcnJheU1hcCA9IHJlcXVpcmUoJy4vX2FycmF5TWFwJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzU3ltYm9sID0gcmVxdWlyZSgnLi9pc1N5bWJvbCcpO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBJTkZJTklUWSA9IDEgLyAwO1xuXG4vKiogVXNlZCB0byBjb252ZXJ0IHN5bWJvbHMgdG8gcHJpbWl0aXZlcyBhbmQgc3RyaW5ncy4gKi9cbnZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG4gICAgc3ltYm9sVG9TdHJpbmcgPSBzeW1ib2xQcm90byA/IHN5bWJvbFByb3RvLnRvU3RyaW5nIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRvU3RyaW5nYCB3aGljaCBkb2Vzbid0IGNvbnZlcnQgbnVsbGlzaFxuICogdmFsdWVzIHRvIGVtcHR5IHN0cmluZ3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUb1N0cmluZyh2YWx1ZSkge1xuICAvLyBFeGl0IGVhcmx5IGZvciBzdHJpbmdzIHRvIGF2b2lkIGEgcGVyZm9ybWFuY2UgaGl0IGluIHNvbWUgZW52aXJvbm1lbnRzLlxuICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbnZlcnQgdmFsdWVzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgcmV0dXJuIGFycmF5TWFwKHZhbHVlLCBiYXNlVG9TdHJpbmcpICsgJyc7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBzeW1ib2xUb1N0cmluZyA/IHN5bWJvbFRvU3RyaW5nLmNhbGwodmFsdWUpIDogJyc7XG4gIH1cbiAgdmFyIHJlc3VsdCA9ICh2YWx1ZSArICcnKTtcbiAgcmV0dXJuIChyZXN1bHQgPT0gJzAnICYmICgxIC8gdmFsdWUpID09IC1JTkZJTklUWSkgPyAnLTAnIDogcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VUb1N0cmluZztcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udW5hcnlgIHdpdGhvdXQgc3VwcG9ydCBmb3Igc3RvcmluZyBtZXRhZGF0YS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2FwIGFyZ3VtZW50cyBmb3IuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjYXBwZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VVbmFyeShmdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jKHZhbHVlKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVW5hcnk7XG4iLCJ2YXIgYXJyYXlNYXAgPSByZXF1aXJlKCcuL19hcnJheU1hcCcpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnZhbHVlc2AgYW5kIGBfLnZhbHVlc0luYCB3aGljaCBjcmVhdGVzIGFuXG4gKiBhcnJheSBvZiBgb2JqZWN0YCBwcm9wZXJ0eSB2YWx1ZXMgY29ycmVzcG9uZGluZyB0byB0aGUgcHJvcGVydHkgbmFtZXNcbiAqIG9mIGBwcm9wc2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHByb3BzIFRoZSBwcm9wZXJ0eSBuYW1lcyB0byBnZXQgdmFsdWVzIGZvci5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gYmFzZVZhbHVlcyhvYmplY3QsIHByb3BzKSB7XG4gIHJldHVybiBhcnJheU1hcChwcm9wcywgZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIG9iamVjdFtrZXldO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVmFsdWVzO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYSBgY2FjaGVgIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBjYWNoZSBUaGUgY2FjaGUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gY2FjaGVIYXMoY2FjaGUsIGtleSkge1xuICByZXR1cm4gY2FjaGUuaGFzKGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2FjaGVIYXM7XG4iLCJ2YXIgaXNBcnJheUxpa2VPYmplY3QgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlT2JqZWN0Jyk7XG5cbi8qKlxuICogQ2FzdHMgYHZhbHVlYCB0byBhbiBlbXB0eSBhcnJheSBpZiBpdCdzIG5vdCBhbiBhcnJheSBsaWtlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R9IFJldHVybnMgdGhlIGNhc3QgYXJyYXktbGlrZSBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGNhc3RBcnJheUxpa2VPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlT2JqZWN0KHZhbHVlKSA/IHZhbHVlIDogW107XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2FzdEFycmF5TGlrZU9iamVjdDtcbiIsInZhciBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKTtcblxuLyoqXG4gKiBDYXN0cyBgdmFsdWVgIHRvIGBpZGVudGl0eWAgaWYgaXQncyBub3QgYSBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyBjYXN0IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjYXN0RnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nID8gdmFsdWUgOiBpZGVudGl0eTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjYXN0RnVuY3Rpb247XG4iLCJ2YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzS2V5ID0gcmVxdWlyZSgnLi9faXNLZXknKSxcbiAgICBzdHJpbmdUb1BhdGggPSByZXF1aXJlKCcuL19zdHJpbmdUb1BhdGgnKSxcbiAgICB0b1N0cmluZyA9IHJlcXVpcmUoJy4vdG9TdHJpbmcnKTtcblxuLyoqXG4gKiBDYXN0cyBgdmFsdWVgIHRvIGEgcGF0aCBhcnJheSBpZiBpdCdzIG5vdCBvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeSBrZXlzIG9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBjYXN0IHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGNhc3RQYXRoKHZhbHVlLCBvYmplY3QpIHtcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHJldHVybiBpc0tleSh2YWx1ZSwgb2JqZWN0KSA/IFt2YWx1ZV0gOiBzdHJpbmdUb1BhdGgodG9TdHJpbmcodmFsdWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjYXN0UGF0aDtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb3ZlcnJlYWNoaW5nIGNvcmUtanMgc2hpbXMuICovXG52YXIgY29yZUpzRGF0YSA9IHJvb3RbJ19fY29yZS1qc19zaGFyZWRfXyddO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcmVKc0RhdGE7XG4iLCJ2YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGBiYXNlRWFjaGAgb3IgYGJhc2VFYWNoUmlnaHRgIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlYWNoRnVuYyBUaGUgZnVuY3Rpb24gdG8gaXRlcmF0ZSBvdmVyIGEgY29sbGVjdGlvbi5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmFzZUVhY2goZWFjaEZ1bmMsIGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24oY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgICBpZiAoY29sbGVjdGlvbiA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICB9XG4gICAgaWYgKCFpc0FycmF5TGlrZShjb2xsZWN0aW9uKSkge1xuICAgICAgcmV0dXJuIGVhY2hGdW5jKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKTtcbiAgICB9XG4gICAgdmFyIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoLFxuICAgICAgICBpbmRleCA9IGZyb21SaWdodCA/IGxlbmd0aCA6IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChjb2xsZWN0aW9uKTtcblxuICAgIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVbaW5kZXhdLCBpbmRleCwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmFzZUVhY2g7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSBiYXNlIGZ1bmN0aW9uIGZvciBtZXRob2RzIGxpa2UgYF8uZm9ySW5gIGFuZCBgXy5mb3JPd25gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJhc2UgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VGb3IoZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzRnVuYykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChvYmplY3QpLFxuICAgICAgICBwcm9wcyA9IGtleXNGdW5jKG9iamVjdCksXG4gICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgdmFyIGtleSA9IHByb3BzW2Zyb21SaWdodCA/IGxlbmd0aCA6ICsraW5kZXhdO1xuICAgICAgaWYgKGl0ZXJhdGVlKGl0ZXJhYmxlW2tleV0sIGtleSwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCYXNlRm9yO1xuIiwidmFyIGJhc2VJdGVyYXRlZSA9IHJlcXVpcmUoJy4vX2Jhc2VJdGVyYXRlZScpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgYF8uZmluZGAgb3IgYF8uZmluZExhc3RgIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmaW5kSW5kZXhGdW5jIFRoZSBmdW5jdGlvbiB0byBmaW5kIHRoZSBjb2xsZWN0aW9uIGluZGV4LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZmluZCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlRmluZChmaW5kSW5kZXhGdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbihjb2xsZWN0aW9uLCBwcmVkaWNhdGUsIGZyb21JbmRleCkge1xuICAgIHZhciBpdGVyYWJsZSA9IE9iamVjdChjb2xsZWN0aW9uKTtcbiAgICBpZiAoIWlzQXJyYXlMaWtlKGNvbGxlY3Rpb24pKSB7XG4gICAgICB2YXIgaXRlcmF0ZWUgPSBiYXNlSXRlcmF0ZWUocHJlZGljYXRlLCAzKTtcbiAgICAgIGNvbGxlY3Rpb24gPSBrZXlzKGNvbGxlY3Rpb24pO1xuICAgICAgcHJlZGljYXRlID0gZnVuY3Rpb24oa2V5KSB7IHJldHVybiBpdGVyYXRlZShpdGVyYWJsZVtrZXldLCBrZXksIGl0ZXJhYmxlKTsgfTtcbiAgICB9XG4gICAgdmFyIGluZGV4ID0gZmluZEluZGV4RnVuYyhjb2xsZWN0aW9uLCBwcmVkaWNhdGUsIGZyb21JbmRleCk7XG4gICAgcmV0dXJuIGluZGV4ID4gLTEgPyBpdGVyYWJsZVtpdGVyYXRlZSA/IGNvbGxlY3Rpb25baW5kZXhdIDogaW5kZXhdIDogdW5kZWZpbmVkO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUZpbmQ7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyk7XG5cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IChmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICB2YXIgZnVuYyA9IGdldE5hdGl2ZShPYmplY3QsICdkZWZpbmVQcm9wZXJ0eScpO1xuICAgIGZ1bmMoe30sICcnLCB7fSk7XG4gICAgcmV0dXJuIGZ1bmM7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmluZVByb3BlcnR5O1xuIiwidmFyIFNldENhY2hlID0gcmVxdWlyZSgnLi9fU2V0Q2FjaGUnKSxcbiAgICBhcnJheVNvbWUgPSByZXF1aXJlKCcuL19hcnJheVNvbWUnKSxcbiAgICBjYWNoZUhhcyA9IHJlcXVpcmUoJy4vX2NhY2hlSGFzJyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIHZhbHVlIGNvbXBhcmlzb25zLiAqL1xudmFyIENPTVBBUkVfUEFSVElBTF9GTEFHID0gMSxcbiAgICBDT01QQVJFX1VOT1JERVJFRF9GTEFHID0gMjtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VJc0VxdWFsRGVlcGAgZm9yIGFycmF5cyB3aXRoIHN1cHBvcnQgZm9yXG4gKiBwYXJ0aWFsIGRlZXAgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtBcnJheX0gb3RoZXIgVGhlIG90aGVyIGFycmF5IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge251bWJlcn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBhcnJheWAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJyYXlzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsQXJyYXlzKGFycmF5LCBvdGhlciwgYml0bWFzaywgY3VzdG9taXplciwgZXF1YWxGdW5jLCBzdGFjaykge1xuICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIENPTVBBUkVfUEFSVElBTF9GTEFHLFxuICAgICAgYXJyTGVuZ3RoID0gYXJyYXkubGVuZ3RoLFxuICAgICAgb3RoTGVuZ3RoID0gb3RoZXIubGVuZ3RoO1xuXG4gIGlmIChhcnJMZW5ndGggIT0gb3RoTGVuZ3RoICYmICEoaXNQYXJ0aWFsICYmIG90aExlbmd0aCA+IGFyckxlbmd0aCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gQXNzdW1lIGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldChhcnJheSk7XG4gIGlmIChzdGFja2VkICYmIHN0YWNrLmdldChvdGhlcikpIHtcbiAgICByZXR1cm4gc3RhY2tlZCA9PSBvdGhlcjtcbiAgfVxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IHRydWUsXG4gICAgICBzZWVuID0gKGJpdG1hc2sgJiBDT01QQVJFX1VOT1JERVJFRF9GTEFHKSA/IG5ldyBTZXRDYWNoZSA6IHVuZGVmaW5lZDtcblxuICBzdGFjay5zZXQoYXJyYXksIG90aGVyKTtcbiAgc3RhY2suc2V0KG90aGVyLCBhcnJheSk7XG5cbiAgLy8gSWdub3JlIG5vbi1pbmRleCBwcm9wZXJ0aWVzLlxuICB3aGlsZSAoKytpbmRleCA8IGFyckxlbmd0aCkge1xuICAgIHZhciBhcnJWYWx1ZSA9IGFycmF5W2luZGV4XSxcbiAgICAgICAgb3RoVmFsdWUgPSBvdGhlcltpbmRleF07XG5cbiAgICBpZiAoY3VzdG9taXplcikge1xuICAgICAgdmFyIGNvbXBhcmVkID0gaXNQYXJ0aWFsXG4gICAgICAgID8gY3VzdG9taXplcihvdGhWYWx1ZSwgYXJyVmFsdWUsIGluZGV4LCBvdGhlciwgYXJyYXksIHN0YWNrKVxuICAgICAgICA6IGN1c3RvbWl6ZXIoYXJyVmFsdWUsIG90aFZhbHVlLCBpbmRleCwgYXJyYXksIG90aGVyLCBzdGFjayk7XG4gICAgfVxuICAgIGlmIChjb21wYXJlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoY29tcGFyZWQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIGFycmF5cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGlmIChzZWVuKSB7XG4gICAgICBpZiAoIWFycmF5U29tZShvdGhlciwgZnVuY3Rpb24ob3RoVmFsdWUsIG90aEluZGV4KSB7XG4gICAgICAgICAgICBpZiAoIWNhY2hlSGFzKHNlZW4sIG90aEluZGV4KSAmJlxuICAgICAgICAgICAgICAgIChhcnJWYWx1ZSA9PT0gb3RoVmFsdWUgfHwgZXF1YWxGdW5jKGFyclZhbHVlLCBvdGhWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spKSkge1xuICAgICAgICAgICAgICByZXR1cm4gc2Vlbi5wdXNoKG90aEluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSkge1xuICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghKFxuICAgICAgICAgIGFyclZhbHVlID09PSBvdGhWYWx1ZSB8fFxuICAgICAgICAgICAgZXF1YWxGdW5jKGFyclZhbHVlLCBvdGhWYWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwgc3RhY2spXG4gICAgICAgICkpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHN0YWNrWydkZWxldGUnXShhcnJheSk7XG4gIHN0YWNrWydkZWxldGUnXShvdGhlcik7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXF1YWxBcnJheXM7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgVWludDhBcnJheSA9IHJlcXVpcmUoJy4vX1VpbnQ4QXJyYXknKSxcbiAgICBlcSA9IHJlcXVpcmUoJy4vZXEnKSxcbiAgICBlcXVhbEFycmF5cyA9IHJlcXVpcmUoJy4vX2VxdWFsQXJyYXlzJyksXG4gICAgbWFwVG9BcnJheSA9IHJlcXVpcmUoJy4vX21hcFRvQXJyYXknKSxcbiAgICBzZXRUb0FycmF5ID0gcmVxdWlyZSgnLi9fc2V0VG9BcnJheScpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB2YWx1ZSBjb21wYXJpc29ucy4gKi9cbnZhciBDT01QQVJFX1BBUlRJQUxfRkxBRyA9IDEsXG4gICAgQ09NUEFSRV9VTk9SREVSRURfRkxBRyA9IDI7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJztcblxuLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG52YXIgc3ltYm9sUHJvdG8gPSBTeW1ib2wgPyBTeW1ib2wucHJvdG90eXBlIDogdW5kZWZpbmVkLFxuICAgIHN5bWJvbFZhbHVlT2YgPSBzeW1ib2xQcm90byA/IHN5bWJvbFByb3RvLnZhbHVlT2YgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBjb21wYXJpbmcgb2JqZWN0cyBvZlxuICogdGhlIHNhbWUgYHRvU3RyaW5nVGFnYC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBmdW5jdGlvbiBvbmx5IHN1cHBvcnRzIGNvbXBhcmluZyB2YWx1ZXMgd2l0aCB0YWdzIG9mXG4gKiBgQm9vbGVhbmAsIGBEYXRlYCwgYEVycm9yYCwgYE51bWJlcmAsIGBSZWdFeHBgLCBvciBgU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtzdHJpbmd9IHRhZyBUaGUgYHRvU3RyaW5nVGFnYCBvZiB0aGUgb2JqZWN0cyB0byBjb21wYXJlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhY2sgVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsQnlUYWcob2JqZWN0LCBvdGhlciwgdGFnLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHN3aXRjaCAodGFnKSB7XG4gICAgY2FzZSBkYXRhVmlld1RhZzpcbiAgICAgIGlmICgob2JqZWN0LmJ5dGVMZW5ndGggIT0gb3RoZXIuYnl0ZUxlbmd0aCkgfHxcbiAgICAgICAgICAob2JqZWN0LmJ5dGVPZmZzZXQgIT0gb3RoZXIuYnl0ZU9mZnNldCkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgb2JqZWN0ID0gb2JqZWN0LmJ1ZmZlcjtcbiAgICAgIG90aGVyID0gb3RoZXIuYnVmZmVyO1xuXG4gICAgY2FzZSBhcnJheUJ1ZmZlclRhZzpcbiAgICAgIGlmICgob2JqZWN0LmJ5dGVMZW5ndGggIT0gb3RoZXIuYnl0ZUxlbmd0aCkgfHxcbiAgICAgICAgICAhZXF1YWxGdW5jKG5ldyBVaW50OEFycmF5KG9iamVjdCksIG5ldyBVaW50OEFycmF5KG90aGVyKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICBjYXNlIGJvb2xUYWc6XG4gICAgY2FzZSBkYXRlVGFnOlxuICAgIGNhc2UgbnVtYmVyVGFnOlxuICAgICAgLy8gQ29lcmNlIGJvb2xlYW5zIHRvIGAxYCBvciBgMGAgYW5kIGRhdGVzIHRvIG1pbGxpc2Vjb25kcy5cbiAgICAgIC8vIEludmFsaWQgZGF0ZXMgYXJlIGNvZXJjZWQgdG8gYE5hTmAuXG4gICAgICByZXR1cm4gZXEoK29iamVjdCwgK290aGVyKTtcblxuICAgIGNhc2UgZXJyb3JUYWc6XG4gICAgICByZXR1cm4gb2JqZWN0Lm5hbWUgPT0gb3RoZXIubmFtZSAmJiBvYmplY3QubWVzc2FnZSA9PSBvdGhlci5tZXNzYWdlO1xuXG4gICAgY2FzZSByZWdleHBUYWc6XG4gICAgY2FzZSBzdHJpbmdUYWc6XG4gICAgICAvLyBDb2VyY2UgcmVnZXhlcyB0byBzdHJpbmdzIGFuZCB0cmVhdCBzdHJpbmdzLCBwcmltaXRpdmVzIGFuZCBvYmplY3RzLFxuICAgICAgLy8gYXMgZXF1YWwuIFNlZSBodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtcmVnZXhwLnByb3RvdHlwZS50b3N0cmluZ1xuICAgICAgLy8gZm9yIG1vcmUgZGV0YWlscy5cbiAgICAgIHJldHVybiBvYmplY3QgPT0gKG90aGVyICsgJycpO1xuXG4gICAgY2FzZSBtYXBUYWc6XG4gICAgICB2YXIgY29udmVydCA9IG1hcFRvQXJyYXk7XG5cbiAgICBjYXNlIHNldFRhZzpcbiAgICAgIHZhciBpc1BhcnRpYWwgPSBiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUc7XG4gICAgICBjb252ZXJ0IHx8IChjb252ZXJ0ID0gc2V0VG9BcnJheSk7XG5cbiAgICAgIGlmIChvYmplY3Quc2l6ZSAhPSBvdGhlci5zaXplICYmICFpc1BhcnRpYWwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgLy8gQXNzdW1lIGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICAgICAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQob2JqZWN0KTtcbiAgICAgIGlmIChzdGFja2VkKSB7XG4gICAgICAgIHJldHVybiBzdGFja2VkID09IG90aGVyO1xuICAgICAgfVxuICAgICAgYml0bWFzayB8PSBDT01QQVJFX1VOT1JERVJFRF9GTEFHO1xuXG4gICAgICAvLyBSZWN1cnNpdmVseSBjb21wYXJlIG9iamVjdHMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICAgIHN0YWNrLnNldChvYmplY3QsIG90aGVyKTtcbiAgICAgIHZhciByZXN1bHQgPSBlcXVhbEFycmF5cyhjb252ZXJ0KG9iamVjdCksIGNvbnZlcnQob3RoZXIpLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKTtcbiAgICAgIHN0YWNrWydkZWxldGUnXShvYmplY3QpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcblxuICAgIGNhc2Ugc3ltYm9sVGFnOlxuICAgICAgaWYgKHN5bWJvbFZhbHVlT2YpIHtcbiAgICAgICAgcmV0dXJuIHN5bWJvbFZhbHVlT2YuY2FsbChvYmplY3QpID09IHN5bWJvbFZhbHVlT2YuY2FsbChvdGhlcik7XG4gICAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxdWFsQnlUYWc7XG4iLCJ2YXIga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciB2YWx1ZSBjb21wYXJpc29ucy4gKi9cbnZhciBDT01QQVJFX1BBUlRJQUxfRkxBRyA9IDE7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBvYmplY3RzIHdpdGggc3VwcG9ydCBmb3JcbiAqIHBhcnRpYWwgZGVlcCBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdXN0b21pemVyIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29tcGFyaXNvbnMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcXVhbEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRldGVybWluZSBlcXVpdmFsZW50cyBvZiB2YWx1ZXMuXG4gKiBAcGFyYW0ge09iamVjdH0gc3RhY2sgVHJhY2tzIHRyYXZlcnNlZCBgb2JqZWN0YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsT2JqZWN0cyhvYmplY3QsIG90aGVyLCBiaXRtYXNrLCBjdXN0b21pemVyLCBlcXVhbEZ1bmMsIHN0YWNrKSB7XG4gIHZhciBpc1BhcnRpYWwgPSBiaXRtYXNrICYgQ09NUEFSRV9QQVJUSUFMX0ZMQUcsXG4gICAgICBvYmpQcm9wcyA9IGtleXMob2JqZWN0KSxcbiAgICAgIG9iakxlbmd0aCA9IG9ialByb3BzLmxlbmd0aCxcbiAgICAgIG90aFByb3BzID0ga2V5cyhvdGhlciksXG4gICAgICBvdGhMZW5ndGggPSBvdGhQcm9wcy5sZW5ndGg7XG5cbiAgaWYgKG9iakxlbmd0aCAhPSBvdGhMZW5ndGggJiYgIWlzUGFydGlhbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgaW5kZXggPSBvYmpMZW5ndGg7XG4gIHdoaWxlIChpbmRleC0tKSB7XG4gICAgdmFyIGtleSA9IG9ialByb3BzW2luZGV4XTtcbiAgICBpZiAoIShpc1BhcnRpYWwgPyBrZXkgaW4gb3RoZXIgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG90aGVyLCBrZXkpKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KG9iamVjdCk7XG4gIGlmIChzdGFja2VkICYmIHN0YWNrLmdldChvdGhlcikpIHtcbiAgICByZXR1cm4gc3RhY2tlZCA9PSBvdGhlcjtcbiAgfVxuICB2YXIgcmVzdWx0ID0gdHJ1ZTtcbiAgc3RhY2suc2V0KG9iamVjdCwgb3RoZXIpO1xuICBzdGFjay5zZXQob3RoZXIsIG9iamVjdCk7XG5cbiAgdmFyIHNraXBDdG9yID0gaXNQYXJ0aWFsO1xuICB3aGlsZSAoKytpbmRleCA8IG9iakxlbmd0aCkge1xuICAgIGtleSA9IG9ialByb3BzW2luZGV4XTtcbiAgICB2YXIgb2JqVmFsdWUgPSBvYmplY3Rba2V5XSxcbiAgICAgICAgb3RoVmFsdWUgPSBvdGhlcltrZXldO1xuXG4gICAgaWYgKGN1c3RvbWl6ZXIpIHtcbiAgICAgIHZhciBjb21wYXJlZCA9IGlzUGFydGlhbFxuICAgICAgICA/IGN1c3RvbWl6ZXIob3RoVmFsdWUsIG9ialZhbHVlLCBrZXksIG90aGVyLCBvYmplY3QsIHN0YWNrKVxuICAgICAgICA6IGN1c3RvbWl6ZXIob2JqVmFsdWUsIG90aFZhbHVlLCBrZXksIG9iamVjdCwgb3RoZXIsIHN0YWNrKTtcbiAgICB9XG4gICAgLy8gUmVjdXJzaXZlbHkgY29tcGFyZSBvYmplY3RzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgaWYgKCEoY29tcGFyZWQgPT09IHVuZGVmaW5lZFxuICAgICAgICAgID8gKG9ialZhbHVlID09PSBvdGhWYWx1ZSB8fCBlcXVhbEZ1bmMob2JqVmFsdWUsIG90aFZhbHVlLCBiaXRtYXNrLCBjdXN0b21pemVyLCBzdGFjaykpXG4gICAgICAgICAgOiBjb21wYXJlZFxuICAgICAgICApKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBza2lwQ3RvciB8fCAoc2tpcEN0b3IgPSBrZXkgPT0gJ2NvbnN0cnVjdG9yJyk7XG4gIH1cbiAgaWYgKHJlc3VsdCAmJiAhc2tpcEN0b3IpIHtcbiAgICB2YXIgb2JqQ3RvciA9IG9iamVjdC5jb25zdHJ1Y3RvcixcbiAgICAgICAgb3RoQ3RvciA9IG90aGVyLmNvbnN0cnVjdG9yO1xuXG4gICAgLy8gTm9uIGBPYmplY3RgIG9iamVjdCBpbnN0YW5jZXMgd2l0aCBkaWZmZXJlbnQgY29uc3RydWN0b3JzIGFyZSBub3QgZXF1YWwuXG4gICAgaWYgKG9iakN0b3IgIT0gb3RoQ3RvciAmJlxuICAgICAgICAoJ2NvbnN0cnVjdG9yJyBpbiBvYmplY3QgJiYgJ2NvbnN0cnVjdG9yJyBpbiBvdGhlcikgJiZcbiAgICAgICAgISh0eXBlb2Ygb2JqQ3RvciA9PSAnZnVuY3Rpb24nICYmIG9iakN0b3IgaW5zdGFuY2VvZiBvYmpDdG9yICYmXG4gICAgICAgICAgdHlwZW9mIG90aEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBvdGhDdG9yIGluc3RhbmNlb2Ygb3RoQ3RvcikpIHtcbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICBzdGFja1snZGVsZXRlJ10ob2JqZWN0KTtcbiAgc3RhY2tbJ2RlbGV0ZSddKG90aGVyKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlcXVhbE9iamVjdHM7XG4iLCJ2YXIgZmxhdHRlbiA9IHJlcXVpcmUoJy4vZmxhdHRlbicpLFxuICAgIG92ZXJSZXN0ID0gcmVxdWlyZSgnLi9fb3ZlclJlc3QnKSxcbiAgICBzZXRUb1N0cmluZyA9IHJlcXVpcmUoJy4vX3NldFRvU3RyaW5nJyk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlUmVzdGAgd2hpY2ggZmxhdHRlbnMgdGhlIHJlc3QgYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gZmxhdFJlc3QoZnVuYykge1xuICByZXR1cm4gc2V0VG9TdHJpbmcob3ZlclJlc3QoZnVuYywgdW5kZWZpbmVkLCBmbGF0dGVuKSwgZnVuYyArICcnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmbGF0UmVzdDtcbiIsIi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbm1vZHVsZS5leHBvcnRzID0gZnJlZUdsb2JhbDtcbiIsInZhciBpc0tleWFibGUgPSByZXF1aXJlKCcuL19pc0tleWFibGUnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBkYXRhIGZvciBgbWFwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUgcmVmZXJlbmNlIGtleS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBtYXAgZGF0YS5cbiAqL1xuZnVuY3Rpb24gZ2V0TWFwRGF0YShtYXAsIGtleSkge1xuICB2YXIgZGF0YSA9IG1hcC5fX2RhdGFfXztcbiAgcmV0dXJuIGlzS2V5YWJsZShrZXkpXG4gICAgPyBkYXRhW3R5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyAnc3RyaW5nJyA6ICdoYXNoJ11cbiAgICA6IGRhdGEubWFwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldE1hcERhdGE7XG4iLCJ2YXIgaXNTdHJpY3RDb21wYXJhYmxlID0gcmVxdWlyZSgnLi9faXNTdHJpY3RDb21wYXJhYmxlJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIEdldHMgdGhlIHByb3BlcnR5IG5hbWVzLCB2YWx1ZXMsIGFuZCBjb21wYXJlIGZsYWdzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG1hdGNoIGRhdGEgb2YgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGdldE1hdGNoRGF0YShvYmplY3QpIHtcbiAgdmFyIHJlc3VsdCA9IGtleXMob2JqZWN0KSxcbiAgICAgIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGg7XG5cbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgdmFyIGtleSA9IHJlc3VsdFtsZW5ndGhdLFxuICAgICAgICB2YWx1ZSA9IG9iamVjdFtrZXldO1xuXG4gICAgcmVzdWx0W2xlbmd0aF0gPSBba2V5LCB2YWx1ZSwgaXNTdHJpY3RDb21wYXJhYmxlKHZhbHVlKV07XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRNYXRjaERhdGE7XG4iLCJ2YXIgYmFzZUlzTmF0aXZlID0gcmVxdWlyZSgnLi9fYmFzZUlzTmF0aXZlJyksXG4gICAgZ2V0VmFsdWUgPSByZXF1aXJlKCcuL19nZXRWYWx1ZScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gZ2V0VmFsdWUob2JqZWN0LCBrZXkpO1xuICByZXR1cm4gYmFzZUlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldE5hdGl2ZTtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUdldFRhZ2Agd2hpY2ggaWdub3JlcyBgU3ltYm9sLnRvU3RyaW5nVGFnYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgcmF3IGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGdldFJhd1RhZyh2YWx1ZSkge1xuICB2YXIgaXNPd24gPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyksXG4gICAgICB0YWcgPSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG5cbiAgdHJ5IHtcbiAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB1bmRlZmluZWQ7XG4gICAgdmFyIHVubWFza2VkID0gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge31cblxuICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIGlmICh1bm1hc2tlZCkge1xuICAgIGlmIChpc093bikge1xuICAgICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdGFnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFJhd1RhZztcbiIsInZhciBEYXRhVmlldyA9IHJlcXVpcmUoJy4vX0RhdGFWaWV3JyksXG4gICAgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyksXG4gICAgUHJvbWlzZSA9IHJlcXVpcmUoJy4vX1Byb21pc2UnKSxcbiAgICBTZXQgPSByZXF1aXJlKCcuL19TZXQnKSxcbiAgICBXZWFrTWFwID0gcmVxdWlyZSgnLi9fV2Vha01hcCcpLFxuICAgIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgdG9Tb3VyY2UgPSByZXF1aXJlKCcuL190b1NvdXJjZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcHJvbWlzZVRhZyA9ICdbb2JqZWN0IFByb21pc2VdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWFwcywgc2V0cywgYW5kIHdlYWttYXBzLiAqL1xudmFyIGRhdGFWaWV3Q3RvclN0cmluZyA9IHRvU291cmNlKERhdGFWaWV3KSxcbiAgICBtYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoTWFwKSxcbiAgICBwcm9taXNlQ3RvclN0cmluZyA9IHRvU291cmNlKFByb21pc2UpLFxuICAgIHNldEN0b3JTdHJpbmcgPSB0b1NvdXJjZShTZXQpLFxuICAgIHdlYWtNYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoV2Vha01hcCk7XG5cbi8qKlxuICogR2V0cyB0aGUgYHRvU3RyaW5nVGFnYCBvZiBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbnZhciBnZXRUYWcgPSBiYXNlR2V0VGFnO1xuXG4vLyBGYWxsYmFjayBmb3IgZGF0YSB2aWV3cywgbWFwcywgc2V0cywgYW5kIHdlYWsgbWFwcyBpbiBJRSAxMSBhbmQgcHJvbWlzZXMgaW4gTm9kZS5qcyA8IDYuXG5pZiAoKERhdGFWaWV3ICYmIGdldFRhZyhuZXcgRGF0YVZpZXcobmV3IEFycmF5QnVmZmVyKDEpKSkgIT0gZGF0YVZpZXdUYWcpIHx8XG4gICAgKE1hcCAmJiBnZXRUYWcobmV3IE1hcCkgIT0gbWFwVGFnKSB8fFxuICAgIChQcm9taXNlICYmIGdldFRhZyhQcm9taXNlLnJlc29sdmUoKSkgIT0gcHJvbWlzZVRhZykgfHxcbiAgICAoU2V0ICYmIGdldFRhZyhuZXcgU2V0KSAhPSBzZXRUYWcpIHx8XG4gICAgKFdlYWtNYXAgJiYgZ2V0VGFnKG5ldyBXZWFrTWFwKSAhPSB3ZWFrTWFwVGFnKSkge1xuICBnZXRUYWcgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciByZXN1bHQgPSBiYXNlR2V0VGFnKHZhbHVlKSxcbiAgICAgICAgQ3RvciA9IHJlc3VsdCA9PSBvYmplY3RUYWcgPyB2YWx1ZS5jb25zdHJ1Y3RvciA6IHVuZGVmaW5lZCxcbiAgICAgICAgY3RvclN0cmluZyA9IEN0b3IgPyB0b1NvdXJjZShDdG9yKSA6ICcnO1xuXG4gICAgaWYgKGN0b3JTdHJpbmcpIHtcbiAgICAgIHN3aXRjaCAoY3RvclN0cmluZykge1xuICAgICAgICBjYXNlIGRhdGFWaWV3Q3RvclN0cmluZzogcmV0dXJuIGRhdGFWaWV3VGFnO1xuICAgICAgICBjYXNlIG1hcEN0b3JTdHJpbmc6IHJldHVybiBtYXBUYWc7XG4gICAgICAgIGNhc2UgcHJvbWlzZUN0b3JTdHJpbmc6IHJldHVybiBwcm9taXNlVGFnO1xuICAgICAgICBjYXNlIHNldEN0b3JTdHJpbmc6IHJldHVybiBzZXRUYWc7XG4gICAgICAgIGNhc2Ugd2Vha01hcEN0b3JTdHJpbmc6IHJldHVybiB3ZWFrTWFwVGFnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFRhZztcbiIsIi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcHJvcGVydHkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGdldFZhbHVlKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFZhbHVlO1xuIiwidmFyIGNhc3RQYXRoID0gcmVxdWlyZSgnLi9fY2FzdFBhdGgnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBwYXRoYCBleGlzdHMgb24gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIHRvIGNoZWNrLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFzRnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2sgcHJvcGVydGllcy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgcGF0aGAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc1BhdGgob2JqZWN0LCBwYXRoLCBoYXNGdW5jKSB7XG4gIHBhdGggPSBjYXN0UGF0aChwYXRoLCBvYmplY3QpO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBmYWxzZTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSB0b0tleShwYXRoW2luZGV4XSk7XG4gICAgaWYgKCEocmVzdWx0ID0gb2JqZWN0ICE9IG51bGwgJiYgaGFzRnVuYyhvYmplY3QsIGtleSkpKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgb2JqZWN0ID0gb2JqZWN0W2tleV07XG4gIH1cbiAgaWYgKHJlc3VsdCB8fCArK2luZGV4ICE9IGxlbmd0aCkge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgbGVuZ3RoID0gb2JqZWN0ID09IG51bGwgPyAwIDogb2JqZWN0Lmxlbmd0aDtcbiAgcmV0dXJuICEhbGVuZ3RoICYmIGlzTGVuZ3RoKGxlbmd0aCkgJiYgaXNJbmRleChrZXksIGxlbmd0aCkgJiZcbiAgICAoaXNBcnJheShvYmplY3QpIHx8IGlzQXJndW1lbnRzKG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc1BhdGg7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKi9cbmZ1bmN0aW9uIGhhc2hDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5hdGl2ZUNyZWF0ZSA/IG5hdGl2ZUNyZWF0ZShudWxsKSA6IHt9O1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hDbGVhcjtcbiIsIi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gdGhpcy5oYXMoa2V5KSAmJiBkZWxldGUgdGhpcy5fX2RhdGFfX1trZXldO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaERlbGV0ZTtcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEdldHMgdGhlIGhhc2ggdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gaGFzaEdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAobmF0aXZlQ3JlYXRlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGRhdGFba2V5XTtcbiAgICByZXR1cm4gcmVzdWx0ID09PSBIQVNIX1VOREVGSU5FRCA/IHVuZGVmaW5lZCA6IHJlc3VsdDtcbiAgfVxuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpID8gZGF0YVtrZXldIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hHZXQ7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgaGFzaCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaEhhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICByZXR1cm4gbmF0aXZlQ3JlYXRlID8gZGF0YVtrZXldICE9PSB1bmRlZmluZWQgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaEhhcztcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKipcbiAqIFNldHMgdGhlIGhhc2ggYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBoYXNoIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBoYXNoU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICB0aGlzLnNpemUgKz0gdGhpcy5oYXMoa2V5KSA/IDAgOiAxO1xuICBkYXRhW2tleV0gPSAobmF0aXZlQ3JlYXRlICYmIHZhbHVlID09PSB1bmRlZmluZWQpID8gSEFTSF9VTkRFRklORUQgOiB2YWx1ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaFNldDtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHNwcmVhZGFibGVTeW1ib2wgPSBTeW1ib2wgPyBTeW1ib2wuaXNDb25jYXRTcHJlYWRhYmxlIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgZmxhdHRlbmFibGUgYGFyZ3VtZW50c2Agb2JqZWN0IG9yIGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGZsYXR0ZW5hYmxlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzRmxhdHRlbmFibGUodmFsdWUpIHtcbiAgcmV0dXJuIGlzQXJyYXkodmFsdWUpIHx8IGlzQXJndW1lbnRzKHZhbHVlKSB8fFxuICAgICEhKHNwcmVhZGFibGVTeW1ib2wgJiYgdmFsdWUgJiYgdmFsdWVbc3ByZWFkYWJsZVN5bWJvbF0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRmxhdHRlbmFibGU7XG4iLCIvKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IHVuc2lnbmVkIGludGVnZXIgdmFsdWVzLiAqL1xudmFyIHJlSXNVaW50ID0gL14oPzowfFsxLTldXFxkKikkLztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgaW5kZXguXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHBhcmFtIHtudW1iZXJ9IFtsZW5ndGg9TUFYX1NBRkVfSU5URUdFUl0gVGhlIHVwcGVyIGJvdW5kcyBvZiBhIHZhbGlkIGluZGV4LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBpbmRleCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0luZGV4KHZhbHVlLCBsZW5ndGgpIHtcbiAgbGVuZ3RoID0gbGVuZ3RoID09IG51bGwgPyBNQVhfU0FGRV9JTlRFR0VSIDogbGVuZ3RoO1xuICByZXR1cm4gISFsZW5ndGggJiZcbiAgICAodHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8IHJlSXNVaW50LnRlc3QodmFsdWUpKSAmJlxuICAgICh2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDwgbGVuZ3RoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0luZGV4O1xuIiwidmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgdG8gbWF0Y2ggcHJvcGVydHkgbmFtZXMgd2l0aGluIHByb3BlcnR5IHBhdGhzLiAqL1xudmFyIHJlSXNEZWVwUHJvcCA9IC9cXC58XFxbKD86W15bXFxdXSp8KFtcIiddKSg/Oig/IVxcMSlbXlxcXFxdfFxcXFwuKSo/XFwxKVxcXS8sXG4gICAgcmVJc1BsYWluUHJvcCA9IC9eXFx3KiQvO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgcHJvcGVydHkgbmFtZSBhbmQgbm90IGEgcHJvcGVydHkgcGF0aC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeSBrZXlzIG9uLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm9wZXJ0eSBuYW1lLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzS2V5KHZhbHVlLCBvYmplY3QpIHtcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICBpZiAodHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nIHx8XG4gICAgICB2YWx1ZSA9PSBudWxsIHx8IGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiByZUlzUGxhaW5Qcm9wLnRlc3QodmFsdWUpIHx8ICFyZUlzRGVlcFByb3AudGVzdCh2YWx1ZSkgfHxcbiAgICAob2JqZWN0ICE9IG51bGwgJiYgdmFsdWUgaW4gT2JqZWN0KG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzS2V5O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSBmb3IgdXNlIGFzIHVuaXF1ZSBvYmplY3Qga2V5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzS2V5YWJsZSh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICh0eXBlID09ICdzdHJpbmcnIHx8IHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnc3ltYm9sJyB8fCB0eXBlID09ICdib29sZWFuJylcbiAgICA/ICh2YWx1ZSAhPT0gJ19fcHJvdG9fXycpXG4gICAgOiAodmFsdWUgPT09IG51bGwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzS2V5YWJsZTtcbiIsInZhciBjb3JlSnNEYXRhID0gcmVxdWlyZSgnLi9fY29yZUpzRGF0YScpO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWV0aG9kcyBtYXNxdWVyYWRpbmcgYXMgbmF0aXZlLiAqL1xudmFyIG1hc2tTcmNLZXkgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciB1aWQgPSAvW14uXSskLy5leGVjKGNvcmVKc0RhdGEgJiYgY29yZUpzRGF0YS5rZXlzICYmIGNvcmVKc0RhdGEua2V5cy5JRV9QUk9UTyB8fCAnJyk7XG4gIHJldHVybiB1aWQgPyAoJ1N5bWJvbChzcmMpXzEuJyArIHVpZCkgOiAnJztcbn0oKSk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBmdW5jYCBoYXMgaXRzIHNvdXJjZSBtYXNrZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBmdW5jYCBpcyBtYXNrZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNNYXNrZWQoZnVuYykge1xuICByZXR1cm4gISFtYXNrU3JjS2V5ICYmIChtYXNrU3JjS2V5IGluIGZ1bmMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTWFza2VkO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYSBwcm90b3R5cGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcHJvdG90eXBlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzUHJvdG90eXBlKHZhbHVlKSB7XG4gIHZhciBDdG9yID0gdmFsdWUgJiYgdmFsdWUuY29uc3RydWN0b3IsXG4gICAgICBwcm90byA9ICh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlKSB8fCBvYmplY3RQcm90bztcblxuICByZXR1cm4gdmFsdWUgPT09IHByb3RvO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzUHJvdG90eXBlO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciBzdHJpY3QgZXF1YWxpdHkgY29tcGFyaXNvbnMsIGkuZS4gYD09PWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaWYgc3VpdGFibGUgZm9yIHN0cmljdFxuICogIGVxdWFsaXR5IGNvbXBhcmlzb25zLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaWN0Q29tcGFyYWJsZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgPT09IHZhbHVlICYmICFpc09iamVjdCh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNTdHJpY3RDb21wYXJhYmxlO1xuIiwiLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IFtdO1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZUNsZWFyO1xuIiwidmFyIGFzc29jSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Fzc29jSW5kZXhPZicpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgYXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2U7XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBsYXN0SW5kZXggPSBkYXRhLmxlbmd0aCAtIDE7XG4gIGlmIChpbmRleCA9PSBsYXN0SW5kZXgpIHtcbiAgICBkYXRhLnBvcCgpO1xuICB9IGVsc2Uge1xuICAgIHNwbGljZS5jYWxsKGRhdGEsIGluZGV4LCAxKTtcbiAgfVxuICAtLXRoaXMuc2l6ZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlRGVsZXRlO1xuIiwidmFyIGFzc29jSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Fzc29jSW5kZXhPZicpO1xuXG4vKipcbiAqIEdldHMgdGhlIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgcmV0dXJuIGluZGV4IDwgMCA/IHVuZGVmaW5lZCA6IGRhdGFbaW5kZXhdWzFdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZUdldDtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGFzc29jSW5kZXhPZih0aGlzLl9fZGF0YV9fLCBrZXkpID4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlSGFzO1xuIiwidmFyIGFzc29jSW5kZXhPZiA9IHJlcXVpcmUoJy4vX2Fzc29jSW5kZXhPZicpO1xuXG4vKipcbiAqIFNldHMgdGhlIGxpc3QgY2FjaGUgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGxpc3QgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgICsrdGhpcy5zaXplO1xuICAgIGRhdGEucHVzaChba2V5LCB2YWx1ZV0pO1xuICB9IGVsc2Uge1xuICAgIGRhdGFbaW5kZXhdWzFdID0gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGlzdENhY2hlU2V0O1xuIiwidmFyIEhhc2ggPSByZXF1aXJlKCcuL19IYXNoJyksXG4gICAgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyksXG4gICAgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuc2l6ZSA9IDA7XG4gIHRoaXMuX19kYXRhX18gPSB7XG4gICAgJ2hhc2gnOiBuZXcgSGFzaCxcbiAgICAnbWFwJzogbmV3IChNYXAgfHwgTGlzdENhY2hlKSxcbiAgICAnc3RyaW5nJzogbmV3IEhhc2hcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZUNsZWFyO1xuIiwidmFyIGdldE1hcERhdGEgPSByZXF1aXJlKCcuL19nZXRNYXBEYXRhJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIHJlc3VsdCA9IGdldE1hcERhdGEodGhpcywga2V5KVsnZGVsZXRlJ10oa2V5KTtcbiAgdGhpcy5zaXplIC09IHJlc3VsdCA/IDEgOiAwO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlRGVsZXRlO1xuIiwidmFyIGdldE1hcERhdGEgPSByZXF1aXJlKCcuL19nZXRNYXBEYXRhJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbWFwIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUdldChrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5nZXQoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZUdldDtcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBhIG1hcCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpLmhhcyhrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcENhY2hlSGFzO1xuIiwidmFyIGdldE1hcERhdGEgPSByZXF1aXJlKCcuL19nZXRNYXBEYXRhJyk7XG5cbi8qKlxuICogU2V0cyB0aGUgbWFwIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG1hcCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IGdldE1hcERhdGEodGhpcywga2V5KSxcbiAgICAgIHNpemUgPSBkYXRhLnNpemU7XG5cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSArPSBkYXRhLnNpemUgPT0gc2l6ZSA/IDAgOiAxO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZVNldDtcbiIsIi8qKlxuICogQ29udmVydHMgYG1hcGAgdG8gaXRzIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGtleS12YWx1ZSBwYWlycy5cbiAqL1xuZnVuY3Rpb24gbWFwVG9BcnJheShtYXApIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShtYXAuc2l6ZSk7XG5cbiAgbWFwLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgIHJlc3VsdFsrK2luZGV4XSA9IFtrZXksIHZhbHVlXTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwVG9BcnJheTtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBtYXRjaGVzUHJvcGVydHlgIGZvciBzb3VyY2UgdmFsdWVzIHN1aXRhYmxlXG4gKiBmb3Igc3RyaWN0IGVxdWFsaXR5IGNvbXBhcmlzb25zLCBpLmUuIGA9PT1gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEBwYXJhbSB7Kn0gc3JjVmFsdWUgVGhlIHZhbHVlIHRvIG1hdGNoLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc3BlYyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gbWF0Y2hlc1N0cmljdENvbXBhcmFibGUoa2V5LCBzcmNWYWx1ZSkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgaWYgKG9iamVjdCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Rba2V5XSA9PT0gc3JjVmFsdWUgJiZcbiAgICAgIChzcmNWYWx1ZSAhPT0gdW5kZWZpbmVkIHx8IChrZXkgaW4gT2JqZWN0KG9iamVjdCkpKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXRjaGVzU3RyaWN0Q29tcGFyYWJsZTtcbiIsInZhciBtZW1vaXplID0gcmVxdWlyZSgnLi9tZW1vaXplJyk7XG5cbi8qKiBVc2VkIGFzIHRoZSBtYXhpbXVtIG1lbW9pemUgY2FjaGUgc2l6ZS4gKi9cbnZhciBNQVhfTUVNT0laRV9TSVpFID0gNTAwO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5tZW1vaXplYCB3aGljaCBjbGVhcnMgdGhlIG1lbW9pemVkIGZ1bmN0aW9uJ3NcbiAqIGNhY2hlIHdoZW4gaXQgZXhjZWVkcyBgTUFYX01FTU9JWkVfU0laRWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGhhdmUgaXRzIG91dHB1dCBtZW1vaXplZC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IG1lbW9pemVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBtZW1vaXplQ2FwcGVkKGZ1bmMpIHtcbiAgdmFyIHJlc3VsdCA9IG1lbW9pemUoZnVuYywgZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKGNhY2hlLnNpemUgPT09IE1BWF9NRU1PSVpFX1NJWkUpIHtcbiAgICAgIGNhY2hlLmNsZWFyKCk7XG4gICAgfVxuICAgIHJldHVybiBrZXk7XG4gIH0pO1xuXG4gIHZhciBjYWNoZSA9IHJlc3VsdC5jYWNoZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtZW1vaXplQ2FwcGVkO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgbmF0aXZlQ3JlYXRlID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2NyZWF0ZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdGl2ZUNyZWF0ZTtcbiIsInZhciBvdmVyQXJnID0gcmVxdWlyZSgnLi9fb3ZlckFyZycpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlS2V5cyA9IG92ZXJBcmcoT2JqZWN0LmtleXMsIE9iamVjdCk7XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlS2V5cztcbiIsInZhciBmcmVlR2xvYmFsID0gcmVxdWlyZSgnLi9fZnJlZUdsb2JhbCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgcHJvY2Vzc2AgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVQcm9jZXNzID0gbW9kdWxlRXhwb3J0cyAmJiBmcmVlR2xvYmFsLnByb2Nlc3M7XG5cbi8qKiBVc2VkIHRvIGFjY2VzcyBmYXN0ZXIgTm9kZS5qcyBoZWxwZXJzLiAqL1xudmFyIG5vZGVVdGlsID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIHJldHVybiBmcmVlUHJvY2VzcyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcoJ3V0aWwnKTtcbiAgfSBjYXRjaCAoZSkge31cbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbm9kZVV0aWw7XG4iLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvYmplY3RUb1N0cmluZztcbiIsIi8qKlxuICogQ3JlYXRlcyBhIHVuYXJ5IGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCBpdHMgYXJndW1lbnQgdHJhbnNmb3JtZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIGFyZ3VtZW50IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyQXJnKGZ1bmMsIHRyYW5zZm9ybSkge1xuICByZXR1cm4gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGZ1bmModHJhbnNmb3JtKGFyZykpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG92ZXJBcmc7XG4iLCJ2YXIgYXBwbHkgPSByZXF1aXJlKCcuL19hcHBseScpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlUmVzdGAgd2hpY2ggdHJhbnNmb3JtcyB0aGUgcmVzdCBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgcmVzdCBhcnJheSB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gb3ZlclJlc3QoZnVuYywgc3RhcnQsIHRyYW5zZm9ybSkge1xuICBzdGFydCA9IG5hdGl2ZU1heChzdGFydCA9PT0gdW5kZWZpbmVkID8gKGZ1bmMubGVuZ3RoIC0gMSkgOiBzdGFydCwgMCk7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KGFyZ3MubGVuZ3RoIC0gc3RhcnQsIDApLFxuICAgICAgICBhcnJheSA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgYXJyYXlbaW5kZXhdID0gYXJnc1tzdGFydCArIGluZGV4XTtcbiAgICB9XG4gICAgaW5kZXggPSAtMTtcbiAgICB2YXIgb3RoZXJBcmdzID0gQXJyYXkoc3RhcnQgKyAxKTtcbiAgICB3aGlsZSAoKytpbmRleCA8IHN0YXJ0KSB7XG4gICAgICBvdGhlckFyZ3NbaW5kZXhdID0gYXJnc1tpbmRleF07XG4gICAgfVxuICAgIG90aGVyQXJnc1tzdGFydF0gPSB0cmFuc2Zvcm0oYXJyYXkpO1xuICAgIHJldHVybiBhcHBseShmdW5jLCB0aGlzLCBvdGhlckFyZ3MpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG92ZXJSZXN0O1xuIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxubW9kdWxlLmV4cG9ydHMgPSByb290O1xuIiwiLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKipcbiAqIEFkZHMgYHZhbHVlYCB0byB0aGUgYXJyYXkgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGFkZFxuICogQG1lbWJlck9mIFNldENhY2hlXG4gKiBAYWxpYXMgcHVzaFxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2FjaGUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gc2V0Q2FjaGVBZGQodmFsdWUpIHtcbiAgdGhpcy5fX2RhdGFfXy5zZXQodmFsdWUsIEhBU0hfVU5ERUZJTkVEKTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0Q2FjaGVBZGQ7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGluIHRoZSBhcnJheSBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgU2V0Q2FjaGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGZvdW5kLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHNldENhY2hlSGFzKHZhbHVlKSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmhhcyh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0Q2FjaGVIYXM7XG4iLCIvKipcbiAqIENvbnZlcnRzIGBzZXRgIHRvIGFuIGFycmF5IG9mIGl0cyB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXQgVGhlIHNldCB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIHNldFRvQXJyYXkoc2V0KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkoc2V0LnNpemUpO1xuXG4gIHNldC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gdmFsdWU7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldFRvQXJyYXk7XG4iLCJ2YXIgYmFzZVNldFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fYmFzZVNldFRvU3RyaW5nJyksXG4gICAgc2hvcnRPdXQgPSByZXF1aXJlKCcuL19zaG9ydE91dCcpO1xuXG4vKipcbiAqIFNldHMgdGhlIGB0b1N0cmluZ2AgbWV0aG9kIG9mIGBmdW5jYCB0byByZXR1cm4gYHN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN0cmluZyBUaGUgYHRvU3RyaW5nYCByZXN1bHQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgYGZ1bmNgLlxuICovXG52YXIgc2V0VG9TdHJpbmcgPSBzaG9ydE91dChiYXNlU2V0VG9TdHJpbmcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNldFRvU3RyaW5nO1xuIiwiLyoqIFVzZWQgdG8gZGV0ZWN0IGhvdCBmdW5jdGlvbnMgYnkgbnVtYmVyIG9mIGNhbGxzIHdpdGhpbiBhIHNwYW4gb2YgbWlsbGlzZWNvbmRzLiAqL1xudmFyIEhPVF9DT1VOVCA9IDgwMCxcbiAgICBIT1RfU1BBTiA9IDE2O1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTm93ID0gRGF0ZS5ub3c7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQnbGwgc2hvcnQgb3V0IGFuZCBpbnZva2UgYGlkZW50aXR5YCBpbnN0ZWFkXG4gKiBvZiBgZnVuY2Agd2hlbiBpdCdzIGNhbGxlZCBgSE9UX0NPVU5UYCBvciBtb3JlIHRpbWVzIGluIGBIT1RfU1BBTmBcbiAqIG1pbGxpc2Vjb25kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcmVzdHJpY3QuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBzaG9ydGFibGUgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIHNob3J0T3V0KGZ1bmMpIHtcbiAgdmFyIGNvdW50ID0gMCxcbiAgICAgIGxhc3RDYWxsZWQgPSAwO1xuXG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RhbXAgPSBuYXRpdmVOb3coKSxcbiAgICAgICAgcmVtYWluaW5nID0gSE9UX1NQQU4gLSAoc3RhbXAgLSBsYXN0Q2FsbGVkKTtcblxuICAgIGxhc3RDYWxsZWQgPSBzdGFtcDtcbiAgICBpZiAocmVtYWluaW5nID4gMCkge1xuICAgICAgaWYgKCsrY291bnQgPj0gSE9UX0NPVU5UKSB7XG4gICAgICAgIHJldHVybiBhcmd1bWVudHNbMF07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvdW50ID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmMuYXBwbHkodW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3J0T3V0O1xuIiwidmFyIExpc3RDYWNoZSA9IHJlcXVpcmUoJy4vX0xpc3RDYWNoZScpO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIFN0YWNrXG4gKi9cbmZ1bmN0aW9uIHN0YWNrQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlO1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrQ2xlYXI7XG4iLCIvKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBzdGFjay5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0RlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgcmVzdWx0ID0gZGF0YVsnZGVsZXRlJ10oa2V5KTtcblxuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tEZWxldGU7XG4iLCIvKipcbiAqIEdldHMgdGhlIHN0YWNrIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBzdGFja0dldChrZXkpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uZ2V0KGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tHZXQ7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBhIHN0YWNrIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tIYXMoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmhhcyhrZXkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0YWNrSGFzO1xuIiwidmFyIExpc3RDYWNoZSA9IHJlcXVpcmUoJy4vX0xpc3RDYWNoZScpLFxuICAgIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpLFxuICAgIE1hcENhY2hlID0gcmVxdWlyZSgnLi9fTWFwQ2FjaGUnKTtcblxuLyoqIFVzZWQgYXMgdGhlIHNpemUgdG8gZW5hYmxlIGxhcmdlIGFycmF5IG9wdGltaXphdGlvbnMuICovXG52YXIgTEFSR0VfQVJSQVlfU0laRSA9IDIwMDtcblxuLyoqXG4gKiBTZXRzIHRoZSBzdGFjayBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBzdGFjayBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChkYXRhIGluc3RhbmNlb2YgTGlzdENhY2hlKSB7XG4gICAgdmFyIHBhaXJzID0gZGF0YS5fX2RhdGFfXztcbiAgICBpZiAoIU1hcCB8fCAocGFpcnMubGVuZ3RoIDwgTEFSR0VfQVJSQVlfU0laRSAtIDEpKSB7XG4gICAgICBwYWlycy5wdXNoKFtrZXksIHZhbHVlXSk7XG4gICAgICB0aGlzLnNpemUgPSArK2RhdGEuc2l6ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBkYXRhID0gdGhpcy5fX2RhdGFfXyA9IG5ldyBNYXBDYWNoZShwYWlycyk7XG4gIH1cbiAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tTZXQ7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5pbmRleE9mYCB3aGljaCBwZXJmb3JtcyBzdHJpY3QgZXF1YWxpdHlcbiAqIGNvbXBhcmlzb25zIG9mIHZhbHVlcywgaS5lLiBgPT09YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBzdHJpY3RJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KSB7XG4gIHZhciBpbmRleCA9IGZyb21JbmRleCAtIDEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoYXJyYXlbaW5kZXhdID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RyaWN0SW5kZXhPZjtcbiIsInZhciBtZW1vaXplQ2FwcGVkID0gcmVxdWlyZSgnLi9fbWVtb2l6ZUNhcHBlZCcpO1xuXG4vKiogVXNlZCB0byBtYXRjaCBwcm9wZXJ0eSBuYW1lcyB3aXRoaW4gcHJvcGVydHkgcGF0aHMuICovXG52YXIgcmVMZWFkaW5nRG90ID0gL15cXC4vLFxuICAgIHJlUHJvcE5hbWUgPSAvW14uW1xcXV0rfFxcWyg/OigtP1xcZCsoPzpcXC5cXGQrKT8pfChbXCInXSkoKD86KD8hXFwyKVteXFxcXF18XFxcXC4pKj8pXFwyKVxcXXwoPz0oPzpcXC58XFxbXFxdKSg/OlxcLnxcXFtcXF18JCkpL2c7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGJhY2tzbGFzaGVzIGluIHByb3BlcnR5IHBhdGhzLiAqL1xudmFyIHJlRXNjYXBlQ2hhciA9IC9cXFxcKFxcXFwpPy9nO1xuXG4vKipcbiAqIENvbnZlcnRzIGBzdHJpbmdgIHRvIGEgcHJvcGVydHkgcGF0aCBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKi9cbnZhciBzdHJpbmdUb1BhdGggPSBtZW1vaXplQ2FwcGVkKGZ1bmN0aW9uKHN0cmluZykge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIGlmIChyZUxlYWRpbmdEb3QudGVzdChzdHJpbmcpKSB7XG4gICAgcmVzdWx0LnB1c2goJycpO1xuICB9XG4gIHN0cmluZy5yZXBsYWNlKHJlUHJvcE5hbWUsIGZ1bmN0aW9uKG1hdGNoLCBudW1iZXIsIHF1b3RlLCBzdHJpbmcpIHtcbiAgICByZXN1bHQucHVzaChxdW90ZSA/IHN0cmluZy5yZXBsYWNlKHJlRXNjYXBlQ2hhciwgJyQxJykgOiAobnVtYmVyIHx8IG1hdGNoKSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gc3RyaW5nVG9QYXRoO1xuIiwidmFyIGlzU3ltYm9sID0gcmVxdWlyZSgnLi9pc1N5bWJvbCcpO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBJTkZJTklUWSA9IDEgLyAwO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcga2V5IGlmIGl0J3Mgbm90IGEgc3RyaW5nIG9yIHN5bWJvbC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtzdHJpbmd8c3ltYm9sfSBSZXR1cm5zIHRoZSBrZXkuXG4gKi9cbmZ1bmN0aW9uIHRvS2V5KHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycgfHwgaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHZhciByZXN1bHQgPSAodmFsdWUgKyAnJyk7XG4gIHJldHVybiAocmVzdWx0ID09ICcwJyAmJiAoMSAvIHZhbHVlKSA9PSAtSU5GSU5JVFkpID8gJy0wJyA6IHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b0tleTtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYGZ1bmNgIHRvIGl0cyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHNvdXJjZSBjb2RlLlxuICovXG5mdW5jdGlvbiB0b1NvdXJjZShmdW5jKSB7XG4gIGlmIChmdW5jICE9IG51bGwpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZ1bmNUb1N0cmluZy5jYWxsKGZ1bmMpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoZnVuYyArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiAnJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b1NvdXJjZTtcbiIsInZhciBiYXNlUHJvcGVydHlPZiA9IHJlcXVpcmUoJy4vX2Jhc2VQcm9wZXJ0eU9mJyk7XG5cbi8qKiBVc2VkIHRvIG1hcCBIVE1MIGVudGl0aWVzIHRvIGNoYXJhY3RlcnMuICovXG52YXIgaHRtbFVuZXNjYXBlcyA9IHtcbiAgJyZhbXA7JzogJyYnLFxuICAnJmx0Oyc6ICc8JyxcbiAgJyZndDsnOiAnPicsXG4gICcmcXVvdDsnOiAnXCInLFxuICAnJiMzOTsnOiBcIidcIlxufTtcblxuLyoqXG4gKiBVc2VkIGJ5IGBfLnVuZXNjYXBlYCB0byBjb252ZXJ0IEhUTUwgZW50aXRpZXMgdG8gY2hhcmFjdGVycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGNociBUaGUgbWF0Y2hlZCBjaGFyYWN0ZXIgdG8gdW5lc2NhcGUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSB1bmVzY2FwZWQgY2hhcmFjdGVyLlxuICovXG52YXIgdW5lc2NhcGVIdG1sQ2hhciA9IGJhc2VQcm9wZXJ0eU9mKGh0bWxVbmVzY2FwZXMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHVuZXNjYXBlSHRtbENoYXI7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYHZhbHVlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcmV0dXJuIGZyb20gdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGNvbnN0YW50IGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0cyA9IF8udGltZXMoMiwgXy5jb25zdGFudCh7ICdhJzogMSB9KSk7XG4gKlxuICogY29uc29sZS5sb2cob2JqZWN0cyk7XG4gKiAvLyA9PiBbeyAnYSc6IDEgfSwgeyAnYSc6IDEgfV1cbiAqXG4gKiBjb25zb2xlLmxvZyhvYmplY3RzWzBdID09PSBvYmplY3RzWzFdKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gY29uc3RhbnQodmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjb25zdGFudDtcbiIsIi8qKlxuICogUGVyZm9ybXMgYVxuICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZSBlcXVpdmFsZW50LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKCdhJywgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKE5hTiwgTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gb3RoZXIgfHwgKHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxO1xuIiwidmFyIGFycmF5RmlsdGVyID0gcmVxdWlyZSgnLi9fYXJyYXlGaWx0ZXInKSxcbiAgICBiYXNlRmlsdGVyID0gcmVxdWlyZSgnLi9fYmFzZUZpbHRlcicpLFxuICAgIGJhc2VJdGVyYXRlZSA9IHJlcXVpcmUoJy4vX2Jhc2VJdGVyYXRlZScpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcblxuLyoqXG4gKiBJdGVyYXRlcyBvdmVyIGVsZW1lbnRzIG9mIGBjb2xsZWN0aW9uYCwgcmV0dXJuaW5nIGFuIGFycmF5IG9mIGFsbCBlbGVtZW50c1xuICogYHByZWRpY2F0ZWAgcmV0dXJucyB0cnV0aHkgZm9yLiBUaGUgcHJlZGljYXRlIGlzIGludm9rZWQgd2l0aCB0aHJlZVxuICogYXJndW1lbnRzOiAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuXG4gKlxuICogKipOb3RlOioqIFVubGlrZSBgXy5yZW1vdmVgLCB0aGlzIG1ldGhvZCByZXR1cm5zIGEgbmV3IGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcHJlZGljYXRlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBmaWx0ZXJlZCBhcnJheS5cbiAqIEBzZWUgXy5yZWplY3RcbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHVzZXJzID0gW1xuICogICB7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNiwgJ2FjdGl2ZSc6IHRydWUgfSxcbiAqICAgeyAndXNlcic6ICdmcmVkJywgICAnYWdlJzogNDAsICdhY3RpdmUnOiBmYWxzZSB9XG4gKiBdO1xuICpcbiAqIF8uZmlsdGVyKHVzZXJzLCBmdW5jdGlvbihvKSB7IHJldHVybiAhby5hY3RpdmU7IH0pO1xuICogLy8gPT4gb2JqZWN0cyBmb3IgWydmcmVkJ11cbiAqXG4gKiAvLyBUaGUgYF8ubWF0Y2hlc2AgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maWx0ZXIodXNlcnMsIHsgJ2FnZSc6IDM2LCAnYWN0aXZlJzogdHJ1ZSB9KTtcbiAqIC8vID0+IG9iamVjdHMgZm9yIFsnYmFybmV5J11cbiAqXG4gKiAvLyBUaGUgYF8ubWF0Y2hlc1Byb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gKiBfLmZpbHRlcih1c2VycywgWydhY3RpdmUnLCBmYWxzZV0pO1xuICogLy8gPT4gb2JqZWN0cyBmb3IgWydmcmVkJ11cbiAqXG4gKiAvLyBUaGUgYF8ucHJvcGVydHlgIGl0ZXJhdGVlIHNob3J0aGFuZC5cbiAqIF8uZmlsdGVyKHVzZXJzLCAnYWN0aXZlJyk7XG4gKiAvLyA9PiBvYmplY3RzIGZvciBbJ2Jhcm5leSddXG4gKi9cbmZ1bmN0aW9uIGZpbHRlcihjb2xsZWN0aW9uLCBwcmVkaWNhdGUpIHtcbiAgdmFyIGZ1bmMgPSBpc0FycmF5KGNvbGxlY3Rpb24pID8gYXJyYXlGaWx0ZXIgOiBiYXNlRmlsdGVyO1xuICByZXR1cm4gZnVuYyhjb2xsZWN0aW9uLCBiYXNlSXRlcmF0ZWUocHJlZGljYXRlLCAzKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZmlsdGVyO1xuIiwidmFyIGNyZWF0ZUZpbmQgPSByZXF1aXJlKCcuL19jcmVhdGVGaW5kJyksXG4gICAgZmluZEluZGV4ID0gcmVxdWlyZSgnLi9maW5kSW5kZXgnKTtcblxuLyoqXG4gKiBJdGVyYXRlcyBvdmVyIGVsZW1lbnRzIG9mIGBjb2xsZWN0aW9uYCwgcmV0dXJuaW5nIHRoZSBmaXJzdCBlbGVtZW50XG4gKiBgcHJlZGljYXRlYCByZXR1cm5zIHRydXRoeSBmb3IuIFRoZSBwcmVkaWNhdGUgaXMgaW52b2tlZCB3aXRoIHRocmVlXG4gKiBhcmd1bWVudHM6ICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IGNvbGxlY3Rpb24gVGhlIGNvbGxlY3Rpb24gdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtwcmVkaWNhdGU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbZnJvbUluZGV4PTBdIFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBtYXRjaGVkIGVsZW1lbnQsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciB1c2VycyA9IFtcbiAqICAgeyAndXNlcic6ICdiYXJuZXknLCAgJ2FnZSc6IDM2LCAnYWN0aXZlJzogdHJ1ZSB9LFxuICogICB7ICd1c2VyJzogJ2ZyZWQnLCAgICAnYWdlJzogNDAsICdhY3RpdmUnOiBmYWxzZSB9LFxuICogICB7ICd1c2VyJzogJ3BlYmJsZXMnLCAnYWdlJzogMSwgICdhY3RpdmUnOiB0cnVlIH1cbiAqIF07XG4gKlxuICogXy5maW5kKHVzZXJzLCBmdW5jdGlvbihvKSB7IHJldHVybiBvLmFnZSA8IDQwOyB9KTtcbiAqIC8vID0+IG9iamVjdCBmb3IgJ2Jhcm5leSdcbiAqXG4gKiAvLyBUaGUgYF8ubWF0Y2hlc2AgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maW5kKHVzZXJzLCB7ICdhZ2UnOiAxLCAnYWN0aXZlJzogdHJ1ZSB9KTtcbiAqIC8vID0+IG9iamVjdCBmb3IgJ3BlYmJsZXMnXG4gKlxuICogLy8gVGhlIGBfLm1hdGNoZXNQcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maW5kKHVzZXJzLCBbJ2FjdGl2ZScsIGZhbHNlXSk7XG4gKiAvLyA9PiBvYmplY3QgZm9yICdmcmVkJ1xuICpcbiAqIC8vIFRoZSBgXy5wcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maW5kKHVzZXJzLCAnYWN0aXZlJyk7XG4gKiAvLyA9PiBvYmplY3QgZm9yICdiYXJuZXknXG4gKi9cbnZhciBmaW5kID0gY3JlYXRlRmluZChmaW5kSW5kZXgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmQ7XG4iLCJ2YXIgYmFzZUZpbmRJbmRleCA9IHJlcXVpcmUoJy4vX2Jhc2VGaW5kSW5kZXgnKSxcbiAgICBiYXNlSXRlcmF0ZWUgPSByZXF1aXJlKCcuL19iYXNlSXRlcmF0ZWUnKSxcbiAgICB0b0ludGVnZXIgPSByZXF1aXJlKCcuL3RvSW50ZWdlcicpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXg7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5maW5kYCBleGNlcHQgdGhhdCBpdCByZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgZmlyc3RcbiAqIGVsZW1lbnQgYHByZWRpY2F0ZWAgcmV0dXJucyB0cnV0aHkgZm9yIGluc3RlYWQgb2YgdGhlIGVsZW1lbnQgaXRzZWxmLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMS4xLjBcbiAqIEBjYXRlZ29yeSBBcnJheVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcHJlZGljYXRlPV8uaWRlbnRpdHldIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0ge251bWJlcn0gW2Zyb21JbmRleD0wXSBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgZm91bmQgZWxlbWVudCwgZWxzZSBgLTFgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgdXNlcnMgPSBbXG4gKiAgIHsgJ3VzZXInOiAnYmFybmV5JywgICdhY3RpdmUnOiBmYWxzZSB9LFxuICogICB7ICd1c2VyJzogJ2ZyZWQnLCAgICAnYWN0aXZlJzogZmFsc2UgfSxcbiAqICAgeyAndXNlcic6ICdwZWJibGVzJywgJ2FjdGl2ZSc6IHRydWUgfVxuICogXTtcbiAqXG4gKiBfLmZpbmRJbmRleCh1c2VycywgZnVuY3Rpb24obykgeyByZXR1cm4gby51c2VyID09ICdiYXJuZXknOyB9KTtcbiAqIC8vID0+IDBcbiAqXG4gKiAvLyBUaGUgYF8ubWF0Y2hlc2AgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maW5kSW5kZXgodXNlcnMsIHsgJ3VzZXInOiAnZnJlZCcsICdhY3RpdmUnOiBmYWxzZSB9KTtcbiAqIC8vID0+IDFcbiAqXG4gKiAvLyBUaGUgYF8ubWF0Y2hlc1Byb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gKiBfLmZpbmRJbmRleCh1c2VycywgWydhY3RpdmUnLCBmYWxzZV0pO1xuICogLy8gPT4gMFxuICpcbiAqIC8vIFRoZSBgXy5wcm9wZXJ0eWAgaXRlcmF0ZWUgc2hvcnRoYW5kLlxuICogXy5maW5kSW5kZXgodXNlcnMsICdhY3RpdmUnKTtcbiAqIC8vID0+IDJcbiAqL1xuZnVuY3Rpb24gZmluZEluZGV4KGFycmF5LCBwcmVkaWNhdGUsIGZyb21JbmRleCkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIHZhciBpbmRleCA9IGZyb21JbmRleCA9PSBudWxsID8gMCA6IHRvSW50ZWdlcihmcm9tSW5kZXgpO1xuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgaW5kZXggPSBuYXRpdmVNYXgobGVuZ3RoICsgaW5kZXgsIDApO1xuICB9XG4gIHJldHVybiBiYXNlRmluZEluZGV4KGFycmF5LCBiYXNlSXRlcmF0ZWUocHJlZGljYXRlLCAzKSwgaW5kZXgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZpbmRJbmRleDtcbiIsInZhciBiYXNlRmxhdHRlbiA9IHJlcXVpcmUoJy4vX2Jhc2VGbGF0dGVuJyksXG4gICAgbWFwID0gcmVxdWlyZSgnLi9tYXAnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZmxhdHRlbmVkIGFycmF5IG9mIHZhbHVlcyBieSBydW5uaW5nIGVhY2ggZWxlbWVudCBpbiBgY29sbGVjdGlvbmBcbiAqIHRocnUgYGl0ZXJhdGVlYCBhbmQgZmxhdHRlbmluZyB0aGUgbWFwcGVkIHJlc3VsdHMuIFRoZSBpdGVyYXRlZSBpcyBpbnZva2VkXG4gKiB3aXRoIHRocmVlIGFyZ3VtZW50czogKHZhbHVlLCBpbmRleHxrZXksIGNvbGxlY3Rpb24pLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZsYXR0ZW5lZCBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gZHVwbGljYXRlKG4pIHtcbiAqICAgcmV0dXJuIFtuLCBuXTtcbiAqIH1cbiAqXG4gKiBfLmZsYXRNYXAoWzEsIDJdLCBkdXBsaWNhdGUpO1xuICogLy8gPT4gWzEsIDEsIDIsIDJdXG4gKi9cbmZ1bmN0aW9uIGZsYXRNYXAoY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgcmV0dXJuIGJhc2VGbGF0dGVuKG1hcChjb2xsZWN0aW9uLCBpdGVyYXRlZSksIDEpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZsYXRNYXA7XG4iLCJ2YXIgYmFzZUZsYXR0ZW4gPSByZXF1aXJlKCcuL19iYXNlRmxhdHRlbicpO1xuXG4vKipcbiAqIEZsYXR0ZW5zIGBhcnJheWAgYSBzaW5nbGUgbGV2ZWwgZGVlcC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBmbGF0dGVuLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZmxhdHRlbmVkIGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmZsYXR0ZW4oWzEsIFsyLCBbMywgWzRdXSwgNV1dKTtcbiAqIC8vID0+IFsxLCAyLCBbMywgWzRdXSwgNV1cbiAqL1xuZnVuY3Rpb24gZmxhdHRlbihhcnJheSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkgPT0gbnVsbCA/IDAgOiBhcnJheS5sZW5ndGg7XG4gIHJldHVybiBsZW5ndGggPyBiYXNlRmxhdHRlbihhcnJheSwgMSkgOiBbXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmbGF0dGVuO1xuIiwidmFyIGFycmF5RWFjaCA9IHJlcXVpcmUoJy4vX2FycmF5RWFjaCcpLFxuICAgIGJhc2VFYWNoID0gcmVxdWlyZSgnLi9fYmFzZUVhY2gnKSxcbiAgICBjYXN0RnVuY3Rpb24gPSByZXF1aXJlKCcuL19jYXN0RnVuY3Rpb24nKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5Jyk7XG5cbi8qKlxuICogSXRlcmF0ZXMgb3ZlciBlbGVtZW50cyBvZiBgY29sbGVjdGlvbmAgYW5kIGludm9rZXMgYGl0ZXJhdGVlYCBmb3IgZWFjaCBlbGVtZW50LlxuICogVGhlIGl0ZXJhdGVlIGlzIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM6ICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS5cbiAqIEl0ZXJhdGVlIGZ1bmN0aW9ucyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHkgYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAqXG4gKiAqKk5vdGU6KiogQXMgd2l0aCBvdGhlciBcIkNvbGxlY3Rpb25zXCIgbWV0aG9kcywgb2JqZWN0cyB3aXRoIGEgXCJsZW5ndGhcIlxuICogcHJvcGVydHkgYXJlIGl0ZXJhdGVkIGxpa2UgYXJyYXlzLiBUbyBhdm9pZCB0aGlzIGJlaGF2aW9yIHVzZSBgXy5mb3JJbmBcbiAqIG9yIGBfLmZvck93bmAgZm9yIG9iamVjdCBpdGVyYXRpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGFsaWFzIGVhY2hcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICogQHNlZSBfLmZvckVhY2hSaWdodFxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmZvckVhY2goWzEsIDJdLCBmdW5jdGlvbih2YWx1ZSkge1xuICogICBjb25zb2xlLmxvZyh2YWx1ZSk7XG4gKiB9KTtcbiAqIC8vID0+IExvZ3MgYDFgIHRoZW4gYDJgLlxuICpcbiAqIF8uZm9yRWFjaCh7ICdhJzogMSwgJ2InOiAyIH0sIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAqICAgY29uc29sZS5sb2coa2V5KTtcbiAqIH0pO1xuICogLy8gPT4gTG9ncyAnYScgdGhlbiAnYicgKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZCkuXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2goY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGZ1bmMgPSBpc0FycmF5KGNvbGxlY3Rpb24pID8gYXJyYXlFYWNoIDogYmFzZUVhY2g7XG4gIHJldHVybiBmdW5jKGNvbGxlY3Rpb24sIGNhc3RGdW5jdGlvbihpdGVyYXRlZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvckVhY2g7XG4iLCJ2YXIgYmFzZUdldCA9IHJlcXVpcmUoJy4vX2Jhc2VHZXQnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBgcGF0aGAgb2YgYG9iamVjdGAuIElmIHRoZSByZXNvbHZlZCB2YWx1ZSBpc1xuICogYHVuZGVmaW5lZGAsIHRoZSBgZGVmYXVsdFZhbHVlYCBpcyByZXR1cm5lZCBpbiBpdHMgcGxhY2UuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAzLjcuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEBwYXJhbSB7Kn0gW2RlZmF1bHRWYWx1ZV0gVGhlIHZhbHVlIHJldHVybmVkIGZvciBgdW5kZWZpbmVkYCByZXNvbHZlZCB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcmVzb2x2ZWQgdmFsdWUuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogW3sgJ2InOiB7ICdjJzogMyB9IH1dIH07XG4gKlxuICogXy5nZXQob2JqZWN0LCAnYVswXS5iLmMnKTtcbiAqIC8vID0+IDNcbiAqXG4gKiBfLmdldChvYmplY3QsIFsnYScsICcwJywgJ2InLCAnYyddKTtcbiAqIC8vID0+IDNcbiAqXG4gKiBfLmdldChvYmplY3QsICdhLmIuYycsICdkZWZhdWx0Jyk7XG4gKiAvLyA9PiAnZGVmYXVsdCdcbiAqL1xuZnVuY3Rpb24gZ2V0KG9iamVjdCwgcGF0aCwgZGVmYXVsdFZhbHVlKSB7XG4gIHZhciByZXN1bHQgPSBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IGJhc2VHZXQob2JqZWN0LCBwYXRoKTtcbiAgcmV0dXJuIHJlc3VsdCA9PT0gdW5kZWZpbmVkID8gZGVmYXVsdFZhbHVlIDogcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldDtcbiIsInZhciBiYXNlSGFzID0gcmVxdWlyZSgnLi9fYmFzZUhhcycpLFxuICAgIGhhc1BhdGggPSByZXF1aXJlKCcuL19oYXNQYXRoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBwYXRoYCBpcyBhIGRpcmVjdCBwcm9wZXJ0eSBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgcGF0aGAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogeyAnYic6IDIgfSB9O1xuICogdmFyIG90aGVyID0gXy5jcmVhdGUoeyAnYSc6IF8uY3JlYXRlKHsgJ2InOiAyIH0pIH0pO1xuICpcbiAqIF8uaGFzKG9iamVjdCwgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmhhcyhvYmplY3QsICdhLmInKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmhhcyhvYmplY3QsIFsnYScsICdiJ10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzKG90aGVyLCAnYScpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaGFzKG9iamVjdCwgcGF0aCkge1xuICByZXR1cm4gb2JqZWN0ICE9IG51bGwgJiYgaGFzUGF0aChvYmplY3QsIHBhdGgsIGJhc2VIYXMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhcztcbiIsInZhciBiYXNlSGFzSW4gPSByZXF1aXJlKCcuL19iYXNlSGFzSW4nKSxcbiAgICBoYXNQYXRoID0gcmVxdWlyZSgnLi9faGFzUGF0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgcGF0aGAgaXMgYSBkaXJlY3Qgb3IgaW5oZXJpdGVkIHByb3BlcnR5IG9mIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBwYXRoYCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IF8uY3JlYXRlKHsgJ2EnOiBfLmNyZWF0ZSh7ICdiJzogMiB9KSB9KTtcbiAqXG4gKiBfLmhhc0luKG9iamVjdCwgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmhhc0luKG9iamVjdCwgJ2EuYicpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzSW4ob2JqZWN0LCBbJ2EnLCAnYiddKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmhhc0luKG9iamVjdCwgJ2InKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGhhc0luKG9iamVjdCwgcGF0aCkge1xuICByZXR1cm4gb2JqZWN0ICE9IG51bGwgJiYgaGFzUGF0aChvYmplY3QsIHBhdGgsIGJhc2VIYXNJbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzSW47XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGZpcnN0IGFyZ3VtZW50IGl0IHJlY2VpdmVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIEFueSB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIGB2YWx1ZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICpcbiAqIGNvbnNvbGUubG9nKF8uaWRlbnRpdHkob2JqZWN0KSA9PT0gb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaWRlbnRpdHkodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlkZW50aXR5O1xuIiwidmFyIGJhc2VJbmRleE9mID0gcmVxdWlyZSgnLi9fYmFzZUluZGV4T2YnKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKSxcbiAgICBpc1N0cmluZyA9IHJlcXVpcmUoJy4vaXNTdHJpbmcnKSxcbiAgICB0b0ludGVnZXIgPSByZXF1aXJlKCcuL3RvSW50ZWdlcicpLFxuICAgIHZhbHVlcyA9IHJlcXVpcmUoJy4vdmFsdWVzJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBpbiBgY29sbGVjdGlvbmAuIElmIGBjb2xsZWN0aW9uYCBpcyBhIHN0cmluZywgaXQnc1xuICogY2hlY2tlZCBmb3IgYSBzdWJzdHJpbmcgb2YgYHZhbHVlYCwgb3RoZXJ3aXNlXG4gKiBbYFNhbWVWYWx1ZVplcm9gXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1zYW1ldmFsdWV6ZXJvKVxuICogaXMgdXNlZCBmb3IgZXF1YWxpdHkgY29tcGFyaXNvbnMuIElmIGBmcm9tSW5kZXhgIGlzIG5lZ2F0aXZlLCBpdCdzIHVzZWQgYXNcbiAqIHRoZSBvZmZzZXQgZnJvbSB0aGUgZW5kIG9mIGBjb2xsZWN0aW9uYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIHtudW1iZXJ9IFtmcm9tSW5kZXg9MF0gVGhlIGluZGV4IHRvIHNlYXJjaCBmcm9tLlxuICogQHBhcmFtLSB7T2JqZWN0fSBbZ3VhcmRdIEVuYWJsZXMgdXNlIGFzIGFuIGl0ZXJhdGVlIGZvciBtZXRob2RzIGxpa2UgYF8ucmVkdWNlYC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGZvdW5kLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaW5jbHVkZXMoWzEsIDIsIDNdLCAxKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmluY2x1ZGVzKFsxLCAyLCAzXSwgMSwgMik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaW5jbHVkZXMoeyAnYSc6IDEsICdiJzogMiB9LCAxKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmluY2x1ZGVzKCdhYmNkJywgJ2JjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGluY2x1ZGVzKGNvbGxlY3Rpb24sIHZhbHVlLCBmcm9tSW5kZXgsIGd1YXJkKSB7XG4gIGNvbGxlY3Rpb24gPSBpc0FycmF5TGlrZShjb2xsZWN0aW9uKSA/IGNvbGxlY3Rpb24gOiB2YWx1ZXMoY29sbGVjdGlvbik7XG4gIGZyb21JbmRleCA9IChmcm9tSW5kZXggJiYgIWd1YXJkKSA/IHRvSW50ZWdlcihmcm9tSW5kZXgpIDogMDtcblxuICB2YXIgbGVuZ3RoID0gY29sbGVjdGlvbi5sZW5ndGg7XG4gIGlmIChmcm9tSW5kZXggPCAwKSB7XG4gICAgZnJvbUluZGV4ID0gbmF0aXZlTWF4KGxlbmd0aCArIGZyb21JbmRleCwgMCk7XG4gIH1cbiAgcmV0dXJuIGlzU3RyaW5nKGNvbGxlY3Rpb24pXG4gICAgPyAoZnJvbUluZGV4IDw9IGxlbmd0aCAmJiBjb2xsZWN0aW9uLmluZGV4T2YodmFsdWUsIGZyb21JbmRleCkgPiAtMSlcbiAgICA6ICghIWxlbmd0aCAmJiBiYXNlSW5kZXhPZihjb2xsZWN0aW9uLCB2YWx1ZSwgZnJvbUluZGV4KSA+IC0xKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbmNsdWRlcztcbiIsInZhciBhcnJheU1hcCA9IHJlcXVpcmUoJy4vX2FycmF5TWFwJyksXG4gICAgYmFzZUludGVyc2VjdGlvbiA9IHJlcXVpcmUoJy4vX2Jhc2VJbnRlcnNlY3Rpb24nKSxcbiAgICBiYXNlUmVzdCA9IHJlcXVpcmUoJy4vX2Jhc2VSZXN0JyksXG4gICAgY2FzdEFycmF5TGlrZU9iamVjdCA9IHJlcXVpcmUoJy4vX2Nhc3RBcnJheUxpa2VPYmplY3QnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHVuaXF1ZSB2YWx1ZXMgdGhhdCBhcmUgaW5jbHVkZWQgaW4gYWxsIGdpdmVuIGFycmF5c1xuICogdXNpbmcgW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGZvciBlcXVhbGl0eSBjb21wYXJpc29ucy4gVGhlIG9yZGVyIGFuZCByZWZlcmVuY2VzIG9mIHJlc3VsdCB2YWx1ZXMgYXJlXG4gKiBkZXRlcm1pbmVkIGJ5IHRoZSBmaXJzdCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7Li4uQXJyYXl9IFthcnJheXNdIFRoZSBhcnJheXMgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5IG9mIGludGVyc2VjdGluZyB2YWx1ZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaW50ZXJzZWN0aW9uKFsyLCAxXSwgWzIsIDNdKTtcbiAqIC8vID0+IFsyXVxuICovXG52YXIgaW50ZXJzZWN0aW9uID0gYmFzZVJlc3QoZnVuY3Rpb24oYXJyYXlzKSB7XG4gIHZhciBtYXBwZWQgPSBhcnJheU1hcChhcnJheXMsIGNhc3RBcnJheUxpa2VPYmplY3QpO1xuICByZXR1cm4gKG1hcHBlZC5sZW5ndGggJiYgbWFwcGVkWzBdID09PSBhcnJheXNbMF0pXG4gICAgPyBiYXNlSW50ZXJzZWN0aW9uKG1hcHBlZClcbiAgICA6IFtdO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gaW50ZXJzZWN0aW9uO1xuIiwidmFyIGJhc2VJc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vX2Jhc2VJc0FyZ3VtZW50cycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FyZ3VtZW50cyA9IGJhc2VJc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA/IGJhc2VJc0FyZ3VtZW50cyA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJndW1lbnRzO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheTtcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFycmF5LWxpa2UgaWYgaXQnc1xuICogbm90IGEgZnVuY3Rpb24gYW5kIGhhcyBhIGB2YWx1ZS5sZW5ndGhgIHRoYXQncyBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvclxuICogZXF1YWwgdG8gYDBgIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlO1xuIiwidmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5pc0FycmF5TGlrZWAgZXhjZXB0IHRoYXQgaXQgYWxzbyBjaGVja3MgaWYgYHZhbHVlYFxuICogaXMgYW4gb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LWxpa2Ugb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGlzQXJyYXlMaWtlKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5TGlrZU9iamVjdDtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpLFxuICAgIHN0dWJGYWxzZSA9IHJlcXVpcmUoJy4vc3R1YkZhbHNlJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgQnVmZmVyID0gbW9kdWxlRXhwb3J0cyA/IHJvb3QuQnVmZmVyIDogdW5kZWZpbmVkO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlSXNCdWZmZXIgPSBCdWZmZXIgPyBCdWZmZXIuaXNCdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjMuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBidWZmZXIsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0J1ZmZlcihuZXcgQnVmZmVyKDIpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBVaW50OEFycmF5KDIpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0J1ZmZlciA9IG5hdGl2ZUlzQnVmZmVyIHx8IHN0dWJGYWxzZTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0J1ZmZlcjtcbiIsInZhciBiYXNlS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VLZXlzJyksXG4gICAgZ2V0VGFnID0gcmVxdWlyZSgnLi9fZ2V0VGFnJyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzQnVmZmVyID0gcmVxdWlyZSgnLi9pc0J1ZmZlcicpLFxuICAgIGlzUHJvdG90eXBlID0gcmVxdWlyZSgnLi9faXNQcm90b3R5cGUnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XSc7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYW4gZW1wdHkgb2JqZWN0LCBjb2xsZWN0aW9uLCBtYXAsIG9yIHNldC5cbiAqXG4gKiBPYmplY3RzIGFyZSBjb25zaWRlcmVkIGVtcHR5IGlmIHRoZXkgaGF2ZSBubyBvd24gZW51bWVyYWJsZSBzdHJpbmcga2V5ZWRcbiAqIHByb3BlcnRpZXMuXG4gKlxuICogQXJyYXktbGlrZSB2YWx1ZXMgc3VjaCBhcyBgYXJndW1lbnRzYCBvYmplY3RzLCBhcnJheXMsIGJ1ZmZlcnMsIHN0cmluZ3MsIG9yXG4gKiBqUXVlcnktbGlrZSBjb2xsZWN0aW9ucyBhcmUgY29uc2lkZXJlZCBlbXB0eSBpZiB0aGV5IGhhdmUgYSBgbGVuZ3RoYCBvZiBgMGAuXG4gKiBTaW1pbGFybHksIG1hcHMgYW5kIHNldHMgYXJlIGNvbnNpZGVyZWQgZW1wdHkgaWYgdGhleSBoYXZlIGEgYHNpemVgIG9mIGAwYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBlbXB0eSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRW1wdHkobnVsbCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0VtcHR5KHRydWUpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNFbXB0eSgxKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRW1wdHkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0VtcHR5KHsgJ2EnOiAxIH0pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChpc0FycmF5TGlrZSh2YWx1ZSkgJiZcbiAgICAgIChpc0FycmF5KHZhbHVlKSB8fCB0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycgfHwgdHlwZW9mIHZhbHVlLnNwbGljZSA9PSAnZnVuY3Rpb24nIHx8XG4gICAgICAgIGlzQnVmZmVyKHZhbHVlKSB8fCBpc1R5cGVkQXJyYXkodmFsdWUpIHx8IGlzQXJndW1lbnRzKHZhbHVlKSkpIHtcbiAgICByZXR1cm4gIXZhbHVlLmxlbmd0aDtcbiAgfVxuICB2YXIgdGFnID0gZ2V0VGFnKHZhbHVlKTtcbiAgaWYgKHRhZyA9PSBtYXBUYWcgfHwgdGFnID09IHNldFRhZykge1xuICAgIHJldHVybiAhdmFsdWUuc2l6ZTtcbiAgfVxuICBpZiAoaXNQcm90b3R5cGUodmFsdWUpKSB7XG4gICAgcmV0dXJuICFiYXNlS2V5cyh2YWx1ZSkubGVuZ3RoO1xuICB9XG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrZXkpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRW1wdHk7XG4iLCJ2YXIgYmFzZUlzRXF1YWwgPSByZXF1aXJlKCcuL19iYXNlSXNFcXVhbCcpO1xuXG4vKipcbiAqIFBlcmZvcm1zIGEgZGVlcCBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmVcbiAqIGVxdWl2YWxlbnQuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIHN1cHBvcnRzIGNvbXBhcmluZyBhcnJheXMsIGFycmF5IGJ1ZmZlcnMsIGJvb2xlYW5zLFxuICogZGF0ZSBvYmplY3RzLCBlcnJvciBvYmplY3RzLCBtYXBzLCBudW1iZXJzLCBgT2JqZWN0YCBvYmplY3RzLCByZWdleGVzLFxuICogc2V0cywgc3RyaW5ncywgc3ltYm9scywgYW5kIHR5cGVkIGFycmF5cy4gYE9iamVjdGAgb2JqZWN0cyBhcmUgY29tcGFyZWRcbiAqIGJ5IHRoZWlyIG93biwgbm90IGluaGVyaXRlZCwgZW51bWVyYWJsZSBwcm9wZXJ0aWVzLiBGdW5jdGlvbnMgYW5kIERPTVxuICogbm9kZXMgYXJlICoqbm90Kiogc3VwcG9ydGVkLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmlzRXF1YWwob2JqZWN0LCBvdGhlcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogb2JqZWN0ID09PSBvdGhlcjtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRXF1YWwodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiBiYXNlSXNFcXVhbCh2YWx1ZSwgb3RoZXIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRXF1YWw7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFzeW5jVGFnID0gJ1tvYmplY3QgQXN5bmNGdW5jdGlvbl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgcHJveHlUYWcgPSAnW29iamVjdCBQcm94eV0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDkgd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXlzIGFuZCBvdGhlciBjb25zdHJ1Y3RvcnMuXG4gIHZhciB0YWcgPSBiYXNlR2V0VGFnKHZhbHVlKTtcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWcgfHwgdGFnID09IGFzeW5jVGFnIHx8IHRhZyA9PSBwcm94eVRhZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0Z1bmN0aW9uO1xuIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTGVuZ3RoKDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNMZW5ndGgoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoSW5maW5pdHkpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKCczJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmXG4gICAgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzTGVuZ3RoO1xuIiwidmFyIGlzTnVtYmVyID0gcmVxdWlyZSgnLi9pc051bWJlcicpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGBOYU5gLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBpcyBiYXNlZCBvblxuICogW2BOdW1iZXIuaXNOYU5gXShodHRwczovL21kbi5pby9OdW1iZXIvaXNOYU4pIGFuZCBpcyBub3QgdGhlIHNhbWUgYXNcbiAqIGdsb2JhbCBbYGlzTmFOYF0oaHR0cHM6Ly9tZG4uaW8vaXNOYU4pIHdoaWNoIHJldHVybnMgYHRydWVgIGZvclxuICogYHVuZGVmaW5lZGAgYW5kIG90aGVyIG5vbi1udW1iZXIgdmFsdWVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGBOYU5gLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNOYU4oTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTmFOKG5ldyBOdW1iZXIoTmFOKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogaXNOYU4odW5kZWZpbmVkKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTmFOKHVuZGVmaW5lZCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc05hTih2YWx1ZSkge1xuICAvLyBBbiBgTmFOYCBwcmltaXRpdmUgaXMgdGhlIG9ubHkgdmFsdWUgdGhhdCBpcyBub3QgZXF1YWwgdG8gaXRzZWxmLlxuICAvLyBQZXJmb3JtIHRoZSBgdG9TdHJpbmdUYWdgIGNoZWNrIGZpcnN0IHRvIGF2b2lkIGVycm9ycyB3aXRoIHNvbWVcbiAgLy8gQWN0aXZlWCBvYmplY3RzIGluIElFLlxuICByZXR1cm4gaXNOdW1iZXIodmFsdWUpICYmIHZhbHVlICE9ICt2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc05hTjtcbiIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYE51bWJlcmAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiAqKk5vdGU6KiogVG8gZXhjbHVkZSBgSW5maW5pdHlgLCBgLUluZmluaXR5YCwgYW5kIGBOYU5gLCB3aGljaCBhcmVcbiAqIGNsYXNzaWZpZWQgYXMgbnVtYmVycywgdXNlIHRoZSBgXy5pc0Zpbml0ZWAgbWV0aG9kLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbnVtYmVyLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNOdW1iZXIoMyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTnVtYmVyKEluZmluaXR5KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTnVtYmVyKCczJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc051bWJlcih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gbnVtYmVyVGFnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc051bWJlcjtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3RMaWtlO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN0cmluZ2AgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN0cmluZywgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3RyaW5nKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3RyaW5nKDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fFxuICAgICghaXNBcnJheSh2YWx1ZSkgJiYgaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBzdHJpbmdUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3RyaW5nO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3ltYm9sO1xuIiwidmFyIGJhc2VJc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL19iYXNlSXNUeXBlZEFycmF5JyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgbm9kZVV0aWwgPSByZXF1aXJlKCcuL19ub2RlVXRpbCcpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1R5cGVkQXJyYXkgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIHR5cGVkIGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkobmV3IFVpbnQ4QXJyYXkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KFtdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc1R5cGVkQXJyYXkgPSBub2RlSXNUeXBlZEFycmF5ID8gYmFzZVVuYXJ5KG5vZGVJc1R5cGVkQXJyYXkpIDogYmFzZUlzVHlwZWRBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc1R5cGVkQXJyYXk7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGB1bmRlZmluZWRgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGB1bmRlZmluZWRgLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNVbmRlZmluZWQodm9pZCAwKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzVW5kZWZpbmVkKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNVbmRlZmluZWQ7XG4iLCJ2YXIgYXJyYXlMaWtlS2V5cyA9IHJlcXVpcmUoJy4vX2FycmF5TGlrZUtleXMnKSxcbiAgICBiYXNlS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VLZXlzJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuIFNlZSB0aGVcbiAqIFtFUyBzcGVjXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIF8ua2V5cygnaGknKTtcbiAqIC8vID0+IFsnMCcsICcxJ11cbiAqL1xuZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iamVjdCkgPyBhcnJheUxpa2VLZXlzKG9iamVjdCkgOiBiYXNlS2V5cyhvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXM7XG4iLCJ2YXIgYXJyYXlNYXAgPSByZXF1aXJlKCcuL19hcnJheU1hcCcpLFxuICAgIGJhc2VJdGVyYXRlZSA9IHJlcXVpcmUoJy4vX2Jhc2VJdGVyYXRlZScpLFxuICAgIGJhc2VNYXAgPSByZXF1aXJlKCcuL19iYXNlTWFwJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdmFsdWVzIGJ5IHJ1bm5pbmcgZWFjaCBlbGVtZW50IGluIGBjb2xsZWN0aW9uYCB0aHJ1XG4gKiBgaXRlcmF0ZWVgLiBUaGUgaXRlcmF0ZWUgaXMgaW52b2tlZCB3aXRoIHRocmVlIGFyZ3VtZW50czpcbiAqICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS5cbiAqXG4gKiBNYW55IGxvZGFzaCBtZXRob2RzIGFyZSBndWFyZGVkIHRvIHdvcmsgYXMgaXRlcmF0ZWVzIGZvciBtZXRob2RzIGxpa2VcbiAqIGBfLmV2ZXJ5YCwgYF8uZmlsdGVyYCwgYF8ubWFwYCwgYF8ubWFwVmFsdWVzYCwgYF8ucmVqZWN0YCwgYW5kIGBfLnNvbWVgLlxuICpcbiAqIFRoZSBndWFyZGVkIG1ldGhvZHMgYXJlOlxuICogYGFyeWAsIGBjaHVua2AsIGBjdXJyeWAsIGBjdXJyeVJpZ2h0YCwgYGRyb3BgLCBgZHJvcFJpZ2h0YCwgYGV2ZXJ5YCxcbiAqIGBmaWxsYCwgYGludmVydGAsIGBwYXJzZUludGAsIGByYW5kb21gLCBgcmFuZ2VgLCBgcmFuZ2VSaWdodGAsIGByZXBlYXRgLFxuICogYHNhbXBsZVNpemVgLCBgc2xpY2VgLCBgc29tZWAsIGBzb3J0QnlgLCBgc3BsaXRgLCBgdGFrZWAsIGB0YWtlUmlnaHRgLFxuICogYHRlbXBsYXRlYCwgYHRyaW1gLCBgdHJpbUVuZGAsIGB0cmltU3RhcnRgLCBhbmQgYHdvcmRzYFxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IG1hcHBlZCBhcnJheS5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gc3F1YXJlKG4pIHtcbiAqICAgcmV0dXJuIG4gKiBuO1xuICogfVxuICpcbiAqIF8ubWFwKFs0LCA4XSwgc3F1YXJlKTtcbiAqIC8vID0+IFsxNiwgNjRdXG4gKlxuICogXy5tYXAoeyAnYSc6IDQsICdiJzogOCB9LCBzcXVhcmUpO1xuICogLy8gPT4gWzE2LCA2NF0gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqXG4gKiB2YXIgdXNlcnMgPSBbXG4gKiAgIHsgJ3VzZXInOiAnYmFybmV5JyB9LFxuICogICB7ICd1c2VyJzogJ2ZyZWQnIH1cbiAqIF07XG4gKlxuICogLy8gVGhlIGBfLnByb3BlcnR5YCBpdGVyYXRlZSBzaG9ydGhhbmQuXG4gKiBfLm1hcCh1c2VycywgJ3VzZXInKTtcbiAqIC8vID0+IFsnYmFybmV5JywgJ2ZyZWQnXVxuICovXG5mdW5jdGlvbiBtYXAoY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGZ1bmMgPSBpc0FycmF5KGNvbGxlY3Rpb24pID8gYXJyYXlNYXAgOiBiYXNlTWFwO1xuICByZXR1cm4gZnVuYyhjb2xsZWN0aW9uLCBiYXNlSXRlcmF0ZWUoaXRlcmF0ZWUsIDMpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXA7XG4iLCJ2YXIgTWFwQ2FjaGUgPSByZXF1aXJlKCcuL19NYXBDYWNoZScpO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IG1lbW9pemVzIHRoZSByZXN1bHQgb2YgYGZ1bmNgLiBJZiBgcmVzb2x2ZXJgIGlzXG4gKiBwcm92aWRlZCwgaXQgZGV0ZXJtaW5lcyB0aGUgY2FjaGUga2V5IGZvciBzdG9yaW5nIHRoZSByZXN1bHQgYmFzZWQgb24gdGhlXG4gKiBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIG1lbW9pemVkIGZ1bmN0aW9uLiBCeSBkZWZhdWx0LCB0aGUgZmlyc3QgYXJndW1lbnRcbiAqIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbiBpcyB1c2VkIGFzIHRoZSBtYXAgY2FjaGUga2V5LiBUaGUgYGZ1bmNgXG4gKiBpcyBpbnZva2VkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBtZW1vaXplZCBmdW5jdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogVGhlIGNhY2hlIGlzIGV4cG9zZWQgYXMgdGhlIGBjYWNoZWAgcHJvcGVydHkgb24gdGhlIG1lbW9pemVkXG4gKiBmdW5jdGlvbi4gSXRzIGNyZWF0aW9uIG1heSBiZSBjdXN0b21pemVkIGJ5IHJlcGxhY2luZyB0aGUgYF8ubWVtb2l6ZS5DYWNoZWBcbiAqIGNvbnN0cnVjdG9yIHdpdGggb25lIHdob3NlIGluc3RhbmNlcyBpbXBsZW1lbnQgdGhlXG4gKiBbYE1hcGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXByb3BlcnRpZXMtb2YtdGhlLW1hcC1wcm90b3R5cGUtb2JqZWN0KVxuICogbWV0aG9kIGludGVyZmFjZSBvZiBgY2xlYXJgLCBgZGVsZXRlYCwgYGdldGAsIGBoYXNgLCBhbmQgYHNldGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBoYXZlIGl0cyBvdXRwdXQgbWVtb2l6ZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcmVzb2x2ZXJdIFRoZSBmdW5jdGlvbiB0byByZXNvbHZlIHRoZSBjYWNoZSBrZXkuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBtZW1vaXplZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxLCAnYic6IDIgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2MnOiAzLCAnZCc6IDQgfTtcbiAqXG4gKiB2YXIgdmFsdWVzID0gXy5tZW1vaXplKF8udmFsdWVzKTtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogdmFsdWVzKG90aGVyKTtcbiAqIC8vID0+IFszLCA0XVxuICpcbiAqIG9iamVjdC5hID0gMjtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogLy8gTW9kaWZ5IHRoZSByZXN1bHQgY2FjaGUuXG4gKiB2YWx1ZXMuY2FjaGUuc2V0KG9iamVjdCwgWydhJywgJ2InXSk7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsnYScsICdiJ11cbiAqXG4gKiAvLyBSZXBsYWNlIGBfLm1lbW9pemUuQ2FjaGVgLlxuICogXy5tZW1vaXplLkNhY2hlID0gV2Vha01hcDtcbiAqL1xuZnVuY3Rpb24gbWVtb2l6ZShmdW5jLCByZXNvbHZlcikge1xuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJyB8fCAocmVzb2x2ZXIgIT0gbnVsbCAmJiB0eXBlb2YgcmVzb2x2ZXIgIT0gJ2Z1bmN0aW9uJykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgdmFyIG1lbW9pemVkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGtleSA9IHJlc29sdmVyID8gcmVzb2x2ZXIuYXBwbHkodGhpcywgYXJncykgOiBhcmdzWzBdLFxuICAgICAgICBjYWNoZSA9IG1lbW9pemVkLmNhY2hlO1xuXG4gICAgaWYgKGNhY2hlLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gY2FjaGUuZ2V0KGtleSk7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIG1lbW9pemVkLmNhY2hlID0gY2FjaGUuc2V0KGtleSwgcmVzdWx0KSB8fCBjYWNoZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBtZW1vaXplZC5jYWNoZSA9IG5ldyAobWVtb2l6ZS5DYWNoZSB8fCBNYXBDYWNoZSk7XG4gIHJldHVybiBtZW1vaXplZDtcbn1cblxuLy8gRXhwb3NlIGBNYXBDYWNoZWAuXG5tZW1vaXplLkNhY2hlID0gTWFwQ2FjaGU7XG5cbm1vZHVsZS5leHBvcnRzID0gbWVtb2l6ZTtcbiIsIi8qKiBFcnJvciBtZXNzYWdlIGNvbnN0YW50cy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgbmVnYXRlcyB0aGUgcmVzdWx0IG9mIHRoZSBwcmVkaWNhdGUgYGZ1bmNgLiBUaGVcbiAqIGBmdW5jYCBwcmVkaWNhdGUgaXMgaW52b2tlZCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBhbmQgYXJndW1lbnRzIG9mIHRoZVxuICogY3JlYXRlZCBmdW5jdGlvbi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgcHJlZGljYXRlIHRvIG5lZ2F0ZS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IG5lZ2F0ZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIGlzRXZlbihuKSB7XG4gKiAgIHJldHVybiBuICUgMiA9PSAwO1xuICogfVxuICpcbiAqIF8uZmlsdGVyKFsxLCAyLCAzLCA0LCA1LCA2XSwgXy5uZWdhdGUoaXNFdmVuKSk7XG4gKiAvLyA9PiBbMSwgMywgNV1cbiAqL1xuZnVuY3Rpb24gbmVnYXRlKHByZWRpY2F0ZSkge1xuICBpZiAodHlwZW9mIHByZWRpY2F0ZSAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6IHJldHVybiAhcHJlZGljYXRlLmNhbGwodGhpcyk7XG4gICAgICBjYXNlIDE6IHJldHVybiAhcHJlZGljYXRlLmNhbGwodGhpcywgYXJnc1swXSk7XG4gICAgICBjYXNlIDI6IHJldHVybiAhcHJlZGljYXRlLmNhbGwodGhpcywgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICBjYXNlIDM6IHJldHVybiAhcHJlZGljYXRlLmNhbGwodGhpcywgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgfVxuICAgIHJldHVybiAhcHJlZGljYXRlLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5lZ2F0ZTtcbiIsInZhciBiYXNlUGljayA9IHJlcXVpcmUoJy4vX2Jhc2VQaWNrJyksXG4gICAgZmxhdFJlc3QgPSByZXF1aXJlKCcuL19mbGF0UmVzdCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gb2JqZWN0IGNvbXBvc2VkIG9mIHRoZSBwaWNrZWQgYG9iamVjdGAgcHJvcGVydGllcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHsuLi4oc3RyaW5nfHN0cmluZ1tdKX0gW3BhdGhzXSBUaGUgcHJvcGVydHkgcGF0aHMgdG8gcGljay5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSwgJ2InOiAnMicsICdjJzogMyB9O1xuICpcbiAqIF8ucGljayhvYmplY3QsIFsnYScsICdjJ10pO1xuICogLy8gPT4geyAnYSc6IDEsICdjJzogMyB9XG4gKi9cbnZhciBwaWNrID0gZmxhdFJlc3QoZnVuY3Rpb24ob2JqZWN0LCBwYXRocykge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB7fSA6IGJhc2VQaWNrKG9iamVjdCwgcGF0aHMpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gcGljaztcbiIsInZhciBiYXNlUHJvcGVydHkgPSByZXF1aXJlKCcuL19iYXNlUHJvcGVydHknKSxcbiAgICBiYXNlUHJvcGVydHlEZWVwID0gcmVxdWlyZSgnLi9fYmFzZVByb3BlcnR5RGVlcCcpLFxuICAgIGlzS2V5ID0gcmVxdWlyZSgnLi9faXNLZXknKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgdmFsdWUgYXQgYHBhdGhgIG9mIGEgZ2l2ZW4gb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYWNjZXNzb3IgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3RzID0gW1xuICogICB7ICdhJzogeyAnYic6IDIgfSB9LFxuICogICB7ICdhJzogeyAnYic6IDEgfSB9XG4gKiBdO1xuICpcbiAqIF8ubWFwKG9iamVjdHMsIF8ucHJvcGVydHkoJ2EuYicpKTtcbiAqIC8vID0+IFsyLCAxXVxuICpcbiAqIF8ubWFwKF8uc29ydEJ5KG9iamVjdHMsIF8ucHJvcGVydHkoWydhJywgJ2InXSkpLCAnYS5iJyk7XG4gKiAvLyA9PiBbMSwgMl1cbiAqL1xuZnVuY3Rpb24gcHJvcGVydHkocGF0aCkge1xuICByZXR1cm4gaXNLZXkocGF0aCkgPyBiYXNlUHJvcGVydHkodG9LZXkocGF0aCkpIDogYmFzZVByb3BlcnR5RGVlcChwYXRoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwcm9wZXJ0eTtcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBgZmFsc2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50aW1lcygyLCBfLnN0dWJGYWxzZSk7XG4gKiAvLyA9PiBbZmFsc2UsIGZhbHNlXVxuICovXG5mdW5jdGlvbiBzdHViRmFsc2UoKSB7XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHViRmFsc2U7XG4iLCJ2YXIgYmFzZVN1bSA9IHJlcXVpcmUoJy4vX2Jhc2VTdW0nKSxcbiAgICBpZGVudGl0eSA9IHJlcXVpcmUoJy4vaWRlbnRpdHknKTtcblxuLyoqXG4gKiBDb21wdXRlcyB0aGUgc3VtIG9mIHRoZSB2YWx1ZXMgaW4gYGFycmF5YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuNC4wXG4gKiBAY2F0ZWdvcnkgTWF0aFxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHN1bS5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5zdW0oWzQsIDIsIDgsIDZdKTtcbiAqIC8vID0+IDIwXG4gKi9cbmZ1bmN0aW9uIHN1bShhcnJheSkge1xuICByZXR1cm4gKGFycmF5ICYmIGFycmF5Lmxlbmd0aClcbiAgICA/IGJhc2VTdW0oYXJyYXksIGlkZW50aXR5KVxuICAgIDogMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdW07XG4iLCJ2YXIgYmFzZVNsaWNlID0gcmVxdWlyZSgnLi9fYmFzZVNsaWNlJyksXG4gICAgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi90b0ludGVnZXInKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgc2xpY2Ugb2YgYGFycmF5YCB3aXRoIGBuYCBlbGVtZW50cyB0YWtlbiBmcm9tIHRoZSBiZWdpbm5pbmcuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge251bWJlcn0gW249MV0gVGhlIG51bWJlciBvZiBlbGVtZW50cyB0byB0YWtlLlxuICogQHBhcmFtLSB7T2JqZWN0fSBbZ3VhcmRdIEVuYWJsZXMgdXNlIGFzIGFuIGl0ZXJhdGVlIGZvciBtZXRob2RzIGxpa2UgYF8ubWFwYC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgc2xpY2Ugb2YgYGFycmF5YC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50YWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBbMV1cbiAqXG4gKiBfLnRha2UoWzEsIDIsIDNdLCAyKTtcbiAqIC8vID0+IFsxLCAyXVxuICpcbiAqIF8udGFrZShbMSwgMiwgM10sIDUpO1xuICogLy8gPT4gWzEsIDIsIDNdXG4gKlxuICogXy50YWtlKFsxLCAyLCAzXSwgMCk7XG4gKiAvLyA9PiBbXVxuICovXG5mdW5jdGlvbiB0YWtlKGFycmF5LCBuLCBndWFyZCkge1xuICBpZiAoIShhcnJheSAmJiBhcnJheS5sZW5ndGgpKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIG4gPSAoZ3VhcmQgfHwgbiA9PT0gdW5kZWZpbmVkKSA/IDEgOiB0b0ludGVnZXIobik7XG4gIHJldHVybiBiYXNlU2xpY2UoYXJyYXksIDAsIG4gPCAwID8gMCA6IG4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRha2U7XG4iLCJ2YXIgdG9OdW1iZXIgPSByZXF1aXJlKCcuL3RvTnVtYmVyJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDAsXG4gICAgTUFYX0lOVEVHRVIgPSAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwODtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgZmluaXRlIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTIuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvRmluaXRlKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvRmluaXRlKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b0Zpbml0ZShJbmZpbml0eSk7XG4gKiAvLyA9PiAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwOFxuICpcbiAqIF8udG9GaW5pdGUoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvRmluaXRlKHZhbHVlKSB7XG4gIGlmICghdmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6IDA7XG4gIH1cbiAgdmFsdWUgPSB0b051bWJlcih2YWx1ZSk7XG4gIGlmICh2YWx1ZSA9PT0gSU5GSU5JVFkgfHwgdmFsdWUgPT09IC1JTkZJTklUWSkge1xuICAgIHZhciBzaWduID0gKHZhbHVlIDwgMCA/IC0xIDogMSk7XG4gICAgcmV0dXJuIHNpZ24gKiBNQVhfSU5URUdFUjtcbiAgfVxuICByZXR1cm4gdmFsdWUgPT09IHZhbHVlID8gdmFsdWUgOiAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvRmluaXRlO1xuIiwidmFyIHRvRmluaXRlID0gcmVxdWlyZSgnLi90b0Zpbml0ZScpO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYW4gaW50ZWdlci5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0ludGVnZXJgXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtdG9pbnRlZ2VyKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBpbnRlZ2VyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvSW50ZWdlcigzLjIpO1xuICogLy8gPT4gM1xuICpcbiAqIF8udG9JbnRlZ2VyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gMFxuICpcbiAqIF8udG9JbnRlZ2VyKEluZmluaXR5KTtcbiAqIC8vID0+IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4XG4gKlxuICogXy50b0ludGVnZXIoJzMuMicpO1xuICogLy8gPT4gM1xuICovXG5mdW5jdGlvbiB0b0ludGVnZXIodmFsdWUpIHtcbiAgdmFyIHJlc3VsdCA9IHRvRmluaXRlKHZhbHVlKSxcbiAgICAgIHJlbWFpbmRlciA9IHJlc3VsdCAlIDE7XG5cbiAgcmV0dXJuIHJlc3VsdCA9PT0gcmVzdWx0ID8gKHJlbWFpbmRlciA/IHJlc3VsdCAtIHJlbWFpbmRlciA6IHJlc3VsdCkgOiAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvSW50ZWdlcjtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltID0gL15cXHMrfFxccyskL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JhZEhleCA9IC9eWy0rXTB4WzAtOWEtZl0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JpbmFyeSA9IC9eMGJbMDFdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc09jdGFsID0gL14wb1swLTddKyQvaTtcblxuLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi9cbnZhciBmcmVlUGFyc2VJbnQgPSBwYXJzZUludDtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTnVtYmVyKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IHR5cGVvZiB2YWx1ZS52YWx1ZU9mID09ICdmdW5jdGlvbicgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVUcmltLCAnJyk7XG4gIHZhciBpc0JpbmFyeSA9IHJlSXNCaW5hcnkudGVzdCh2YWx1ZSk7XG4gIHJldHVybiAoaXNCaW5hcnkgfHwgcmVJc09jdGFsLnRlc3QodmFsdWUpKVxuICAgID8gZnJlZVBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCBpc0JpbmFyeSA/IDIgOiA4KVxuICAgIDogKHJlSXNCYWRIZXgudGVzdCh2YWx1ZSkgPyBOQU4gOiArdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvTnVtYmVyO1xuIiwidmFyIGJhc2VUb1N0cmluZyA9IHJlcXVpcmUoJy4vX2Jhc2VUb1N0cmluZycpO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcuIEFuIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZCBmb3IgYG51bGxgXG4gKiBhbmQgYHVuZGVmaW5lZGAgdmFsdWVzLiBUaGUgc2lnbiBvZiBgLTBgIGlzIHByZXNlcnZlZC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9TdHJpbmcobnVsbCk7XG4gKiAvLyA9PiAnJ1xuICpcbiAqIF8udG9TdHJpbmcoLTApO1xuICogLy8gPT4gJy0wJ1xuICpcbiAqIF8udG9TdHJpbmcoWzEsIDIsIDNdKTtcbiAqIC8vID0+ICcxLDIsMydcbiAqL1xuZnVuY3Rpb24gdG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09IG51bGwgPyAnJyA6IGJhc2VUb1N0cmluZyh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9TdHJpbmc7XG4iLCJ2YXIgdG9TdHJpbmcgPSByZXF1aXJlKCcuL3RvU3RyaW5nJyksXG4gICAgdW5lc2NhcGVIdG1sQ2hhciA9IHJlcXVpcmUoJy4vX3VuZXNjYXBlSHRtbENoYXInKTtcblxuLyoqIFVzZWQgdG8gbWF0Y2ggSFRNTCBlbnRpdGllcyBhbmQgSFRNTCBjaGFyYWN0ZXJzLiAqL1xudmFyIHJlRXNjYXBlZEh0bWwgPSAvJig/OmFtcHxsdHxndHxxdW90fCMzOSk7L2csXG4gICAgcmVIYXNFc2NhcGVkSHRtbCA9IFJlZ0V4cChyZUVzY2FwZWRIdG1sLnNvdXJjZSk7XG5cbi8qKlxuICogVGhlIGludmVyc2Ugb2YgYF8uZXNjYXBlYDsgdGhpcyBtZXRob2QgY29udmVydHMgdGhlIEhUTUwgZW50aXRpZXNcbiAqIGAmYW1wO2AsIGAmbHQ7YCwgYCZndDtgLCBgJnF1b3Q7YCwgYW5kIGAmIzM5O2AgaW4gYHN0cmluZ2AgdG9cbiAqIHRoZWlyIGNvcnJlc3BvbmRpbmcgY2hhcmFjdGVycy5cbiAqXG4gKiAqKk5vdGU6KiogTm8gb3RoZXIgSFRNTCBlbnRpdGllcyBhcmUgdW5lc2NhcGVkLiBUbyB1bmVzY2FwZSBhZGRpdGlvbmFsXG4gKiBIVE1MIGVudGl0aWVzIHVzZSBhIHRoaXJkLXBhcnR5IGxpYnJhcnkgbGlrZSBbX2hlX10oaHR0cHM6Ly9tdGhzLmJlL2hlKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuNi4wXG4gKiBAY2F0ZWdvcnkgU3RyaW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gW3N0cmluZz0nJ10gVGhlIHN0cmluZyB0byB1bmVzY2FwZS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHVuZXNjYXBlZCBzdHJpbmcuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udW5lc2NhcGUoJ2ZyZWQsIGJhcm5leSwgJmFtcDsgcGViYmxlcycpO1xuICogLy8gPT4gJ2ZyZWQsIGJhcm5leSwgJiBwZWJibGVzJ1xuICovXG5mdW5jdGlvbiB1bmVzY2FwZShzdHJpbmcpIHtcbiAgc3RyaW5nID0gdG9TdHJpbmcoc3RyaW5nKTtcbiAgcmV0dXJuIChzdHJpbmcgJiYgcmVIYXNFc2NhcGVkSHRtbC50ZXN0KHN0cmluZykpXG4gICAgPyBzdHJpbmcucmVwbGFjZShyZUVzY2FwZWRIdG1sLCB1bmVzY2FwZUh0bWxDaGFyKVxuICAgIDogc3RyaW5nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHVuZXNjYXBlO1xuIiwidmFyIGJhc2VWYWx1ZXMgPSByZXF1aXJlKCcuL19iYXNlVmFsdWVzJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHN0cmluZyBrZXllZCBwcm9wZXJ0eSB2YWx1ZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSB2YWx1ZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8udmFsdWVzKG5ldyBGb28pO1xuICogLy8gPT4gWzEsIDJdIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy52YWx1ZXMoJ2hpJyk7XG4gKiAvLyA9PiBbJ2gnLCAnaSddXG4gKi9cbmZ1bmN0aW9uIHZhbHVlcyhvYmplY3QpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gW10gOiBiYXNlVmFsdWVzKG9iamVjdCwga2V5cyhvYmplY3QpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB2YWx1ZXM7XG4iLCJ2YXIgZmluZE1hdGNoaW5nUnVsZSA9IGZ1bmN0aW9uKHJ1bGVzLCB0ZXh0KXtcbiAgdmFyIGk7XG4gIGZvcihpPTA7IGk8cnVsZXMubGVuZ3RoOyBpKyspXG4gICAgaWYocnVsZXNbaV0ucmVnZXgudGVzdCh0ZXh0KSlcbiAgICAgIHJldHVybiBydWxlc1tpXTtcbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbnZhciBmaW5kTWF4SW5kZXhBbmRSdWxlID0gZnVuY3Rpb24ocnVsZXMsIHRleHQpe1xuICB2YXIgaSwgcnVsZSwgbGFzdF9tYXRjaGluZ19ydWxlO1xuICBmb3IoaT0wOyBpPHRleHQubGVuZ3RoOyBpKyspe1xuICAgIHJ1bGUgPSBmaW5kTWF0Y2hpbmdSdWxlKHJ1bGVzLCB0ZXh0LnN1YnN0cmluZygwLCBpICsgMSkpO1xuICAgIGlmKHJ1bGUpXG4gICAgICBsYXN0X21hdGNoaW5nX3J1bGUgPSBydWxlO1xuICAgIGVsc2UgaWYobGFzdF9tYXRjaGluZ19ydWxlKVxuICAgICAgcmV0dXJuIHttYXhfaW5kZXg6IGksIHJ1bGU6IGxhc3RfbWF0Y2hpbmdfcnVsZX07XG4gIH1cbiAgcmV0dXJuIGxhc3RfbWF0Y2hpbmdfcnVsZSA/IHttYXhfaW5kZXg6IHRleHQubGVuZ3RoLCBydWxlOiBsYXN0X21hdGNoaW5nX3J1bGV9IDogdW5kZWZpbmVkO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvblRva2VuX29yaWcpe1xuICB2YXIgYnVmZmVyID0gXCJcIjtcbiAgdmFyIHJ1bGVzID0gW107XG4gIHZhciBsaW5lID0gMTtcbiAgdmFyIGNvbCA9IDE7XG5cbiAgdmFyIG9uVG9rZW4gPSBmdW5jdGlvbihzcmMsIHR5cGUpe1xuICAgIG9uVG9rZW5fb3JpZyh7XG4gICAgICB0eXBlOiB0eXBlLFxuICAgICAgc3JjOiBzcmMsXG4gICAgICBsaW5lOiBsaW5lLFxuICAgICAgY29sOiBjb2xcbiAgICB9KTtcbiAgICB2YXIgbGluZXMgPSBzcmMuc3BsaXQoXCJcXG5cIik7XG4gICAgbGluZSArPSBsaW5lcy5sZW5ndGggLSAxO1xuICAgIGNvbCA9IChsaW5lcy5sZW5ndGggPiAxID8gMSA6IGNvbCkgKyBsaW5lc1tsaW5lcy5sZW5ndGggLSAxXS5sZW5ndGg7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBhZGRSdWxlOiBmdW5jdGlvbihyZWdleCwgdHlwZSl7XG4gICAgICBydWxlcy5wdXNoKHtyZWdleDogcmVnZXgsIHR5cGU6IHR5cGV9KTtcbiAgICB9LFxuICAgIG9uVGV4dDogZnVuY3Rpb24odGV4dCl7XG4gICAgICB2YXIgc3RyID0gYnVmZmVyICsgdGV4dDtcbiAgICAgIHZhciBtID0gZmluZE1heEluZGV4QW5kUnVsZShydWxlcywgc3RyKTtcbiAgICAgIHdoaWxlKG0gJiYgbS5tYXhfaW5kZXggIT09IHN0ci5sZW5ndGgpe1xuICAgICAgICBvblRva2VuKHN0ci5zdWJzdHJpbmcoMCwgbS5tYXhfaW5kZXgpLCBtLnJ1bGUudHlwZSk7XG5cbiAgICAgICAgLy9ub3cgZmluZCB0aGUgbmV4dCB0b2tlblxuICAgICAgICBzdHIgPSBzdHIuc3Vic3RyaW5nKG0ubWF4X2luZGV4KTtcbiAgICAgICAgbSA9IGZpbmRNYXhJbmRleEFuZFJ1bGUocnVsZXMsIHN0cik7XG4gICAgICB9XG4gICAgICBidWZmZXIgPSBzdHI7XG4gICAgfSxcbiAgICBlbmQ6IGZ1bmN0aW9uKCl7XG4gICAgICBpZihidWZmZXIubGVuZ3RoID09PSAwKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIHZhciBydWxlID0gZmluZE1hdGNoaW5nUnVsZShydWxlcywgYnVmZmVyKTtcbiAgICAgIGlmKCFydWxlKXtcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcihcInVuYWJsZSB0byB0b2tlbml6ZVwiKTtcbiAgICAgICAgZXJyLnRva2VuaXplcjIgPSB7XG4gICAgICAgICAgYnVmZmVyOiBidWZmZXIsXG4gICAgICAgICAgbGluZTogbGluZSxcbiAgICAgICAgICBjb2w6IGNvbFxuICAgICAgICB9O1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG5cbiAgICAgIG9uVG9rZW4oYnVmZmVyLCBydWxlLnR5cGUpO1xuICAgIH1cbiAgfTtcbn07XG4iLCIvKiogQG1vZHVsZSBjb25maWcvc3lsbGFibGVzICovXG5cbnZhciBnZXRMYW5ndWFnZSA9IHJlcXVpcmUoIFwiLi4vaGVscGVycy9nZXRMYW5ndWFnZS5qc1wiICk7XG52YXIgaXNVbmRlZmluZWQgPSByZXF1aXJlKCBcImxvZGFzaC9pc1VuZGVmaW5lZFwiICk7XG5cbnZhciBkZSA9IHJlcXVpcmUoIFwiLi9zeWxsYWJsZXMvZGUuanNvblwiICk7XG52YXIgZW4gPSByZXF1aXJlKCAnLi9zeWxsYWJsZXMvZW4uanNvbicgKTtcbnZhciBubCA9IHJlcXVpcmUoICcuL3N5bGxhYmxlcy9ubC5qc29uJyApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBsb2NhbGUgKSB7XG5cdGlmICggaXNVbmRlZmluZWQoIGxvY2FsZSApICkge1xuXHRcdGxvY2FsZSA9IFwiZW5fVVNcIlxuXHR9XG5cblx0c3dpdGNoKCBnZXRMYW5ndWFnZSggbG9jYWxlICkgKSB7XG5cdFx0Y2FzZSBcImRlXCI6XG5cdFx0XHRyZXR1cm4gZGU7XG5cdFx0Y2FzZSBcIm5sXCI6XG5cdFx0XHRyZXR1cm4gbmw7XG5cdFx0Y2FzZSBcImVuXCI6XG5cdFx0ZGVmYXVsdDpcblx0XHRcdHJldHVybiBlbjtcblx0fVxufTtcbiIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJ2b3dlbHNcIjogXCJhZWlvdXnDpMO2w7zDocOpw6LDoMOow67DqsOiw7vDtMWTXCIsXG5cdFwiZGV2aWF0aW9uc1wiOiB7XG5cdFx0XCJ2b3dlbHNcIjogW1xuXHRcdFx0e1xuXHRcdFx0XHRcImZyYWdtZW50c1wiOiBbIFwib3VpbFwiLCBcImRlYXV4XCIsIFwiZGVhdSRcIiwgXCJvYXJkXCIsIFwiw6R0aGlvcFwiLCBcImV1aWxcIiwgXCJ2ZWF1XCIsIFwiZWF1JFwiLCBcInVldWVcIiwgXCJsaWVuaXNjaFwiLCBcImFuY2UkXCIsIFwiZW5jZSRcIiwgXCJ0aW1lJFwiLFxuXHRcdFx0XHRcdFwib25jZSRcIiwgXCJ6aWF0XCIsIFwiZ3VldHRlXCIsIFwiw6p0ZVwiLCBcIsO0dGUkXCIsIFwiW2hwXW9tbWUkXCIsIFwiW3Fkc2NuXXVlJFwiLCBcImFpcmUkXCIsIFwidHVyZSRcIiwgXCLDqnBlJFwiLCBcIltecV11aSRcIiwgXCJ0aWNoZSRcIixcblx0XHRcdFx0XHRcInZpY2UkXCIsIFwib2lsZSRcIiwgXCJ6aWFsXCIsIFwiY3J1aXNcIiwgXCJsZWFzXCIsIFwiY29hW2N0XVwiLCBcIlteaV1kZWFsXCIsIFwiW2Z3XWVhdFwiLCBcIltsc3hdZWQkXCIgXSxcblx0XHRcdFx0XCJjb3VudE1vZGlmaWVyXCI6IC0xXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRcImZyYWdtZW50c1wiOiBbIFwiYWF1XCIsIFwiYVvDpMO2w7xvXVwiLCBcIsOkdWVcIiwgXCLDpGV1XCIsIFwiYWVpXCIsIFwiYXVlXCIsIFwiYWV1XCIsIFwiYWVsXCIsIFwiYWlbYWVvXVwiLCBcInNhaWtcIiwgXCJhaXNtdXNcIiwgXCLDpFthZW9pXVwiLCBcImF1w6RcIiwgXCLDqWFcIixcblx0XHRcdFx0XHRcImVbw6Rhb8O2XVwiLCBcImVpW2VvXVwiLCBcImVlW2FlaW91XVwiLCBcImV1W2HDpGVdXCIsIFwiZXVtJFwiLCBcImXDvFwiLCBcIm9bYcOkw7bDvF1cIiwgXCJwb2V0XCIsIFwib29bZW9dXCIsIFwib2llXCIsIFwib2VpW15sXVwiLCBcIm9ldVteZl1cIiwgXCLDtmFcIiwgXCJbZmdyel1pZXVcIixcblx0XHRcdFx0XHRcIm1pZXVuXCIsIFwidGlldXJcIiwgXCJpZXVtXCIsIFwiaVthaXXDvF1cIiwgXCJbXmxdacOkXCIsIFwiW15zXWNoaWVuXCIsIFwiaW9bYmNkZmhqa21wcXR1dnd4XVwiLCBcIltiZGhtcHJ2XWlvblwiLCBcIltscl1pb3JcIixcblx0XHRcdFx0XHRcIlteZ11pb1tnc11cIiwgXCJbZHJdaW96XCIsIFwiZWxpb3pcIiwgXCJ6aW9uaVwiLCBcImJpb1tsbm9yel1cIiwgXCJpw7ZbXnNdXCIsIFwiaWVbZWldXCIsIFwicmllciRcIiwgXCLDtmlbZWddXCIsIFwiW15yXcO2aXNjaFwiLFxuXHRcdFx0XHRcdFwiW15ncXZddVthZcOpaW/DtnXDvF1cIiwgXCJxdWllJFwiLCBcInF1aWVbXnNdXCIsIFwidcOkdVwiLCBcIl51cy1cIiwgXCJeaXQtXCIsIFwiw7xlXCIsIFwibmFpdlwiLCBcImFpc2NoJFwiLCBcImFpc2NoZSRcIiwgXCJhaXNjaGVbbnJzXSRcIiwgXCJbbHN0XWllblwiLFxuXHRcdFx0XHRcdFwiZGllbiRcIiwgXCJnb2lzXCIsIFwiW15nXXJpZW50XCIsIFwiW2FlaW91XXlbYWVpb3VdXCIsIFwiYnlpXCIsIFwiecOkXCIsIFwiW2Etel15W2FvXVwiLCBcInlhdVwiLCBcImtvb3JcIiwgXCJzY2llbnRcIiwgXCJlcmllbFwiLCBcIltkZ11vaW5nXCIgXSxcblx0XHRcdFx0XCJjb3VudE1vZGlmaWVyXCI6IDFcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdFwiZnJhZ21lbnRzXCI6IFsgXCJlYXXDvFwiLCBcImlvaVwiLCBcImlvb1wiLCBcImlvYVwiLCBcImlpaVwiLCBcIm9haVwiLCBcImV1ZXVcIiBdLFxuXHRcdFx0XHRcImNvdW50TW9kaWZpZXJcIjogMVxuXHRcdFx0fVxuXHRcdF0sXG5cdFx0XCJ3b3Jkc1wiOiB7XG5cdFx0XHRcImZ1bGxcIjogW1xuXHRcdFx0XHR7IFwid29yZFwiOiBcImJlYWNoXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJiZWF0XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJiZWF1XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJiZWF1bmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImJlbGxlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJib3VjaGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImJyYWtlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJjYWNoZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2FjaGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImNoYWlzZWxvbmd1ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2hva2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImNvcmRpYWxlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJjb3JlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJkb3BlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJlYXRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImV5ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmFrZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmFtZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmF0aWd1ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmVtbWVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImZvcmNlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJnYW1lXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJnYW1lc1wiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2F0ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ3JhbmRlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJpY2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImlvblwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiam9rZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwianVwZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWFpc2NoXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJtYWlzY2hlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJtb3ZlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJuYXRpdmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcIm5pY2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcIm9uZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGlwZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwicHJpbWVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInJhdGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInJoeXRobVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmlkZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmlkZXNcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInJpZW5cIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInNhdmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInNjaWVuY2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInNpw6hjbGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInNpdGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInN1aXRlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJ0YWtlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJ0YXVwZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwidW5pdmVyc2VcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInZvZ3VlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJ3YXZlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJ6aW9uXCIsIFwic3lsbGFibGVzXCI6IDJ9XG5cdFx0XHRdLFxuXHRcdFx0XCJmcmFnbWVudHNcIjoge1xuXHRcdFx0XHRcImdsb2JhbFwiOiBbXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhYnJlYWt0aW9uXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImFkd2FyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhZmZhaXJlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImFpZ3Vpw6hyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhbmlzZXR0ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhcHBlYWxcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmFja3N0YWdlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJhbmtyYXRlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJhc2ViYWxsXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJhc2VqdW1wXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJlYWNoY29tYmVyXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJlYWNodm9sbGV5YmFsbFwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiZWFnbGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmVhbWVyXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJlYW1lclwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiw6lhcm5haXNlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJlYXVmb3J0XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJlYXVqb2xhaXNcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmVhdXTDqVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiZWF1dHlcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmVsZ2llclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiZXN0aWVuXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJpc2t1aXRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmxlYWNoXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJsdWVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYm9hcmRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYm9hdFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJib2R5c3VpdFwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJib3JkZWxhaXNlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJyZWFrXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJ1aWxkXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJ1cmVhdVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJidXNpbmVzc1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYWJyaW9cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2FicmlvbGV0XCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNhY2hlc2V4ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYW1haWV1XCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNhbnlvblwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYXNlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNhdHN1aXRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2VudGltZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjaGFpc2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2hhbXBpb25cIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2hhbXBpb25hdFwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjaGFwaXRlYXVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2hhdGVhdVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjaMOidGVhdVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjaGVhdFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjaGVlc2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2hpaHVhaHVhXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNob2ljZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjaXJjb25mbGV4ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjbGVhblwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjbG9jaGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2xvc2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2xvdGhlc1wiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjb21tZXJjZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjcmltZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjcm9zc3JhdGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY3Vpc2luZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjdWxvdHRlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImRlYXRoXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImRlZmVuc2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZMOpdGVudGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZHJlYWRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZHJlYW1cIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZHJlc3Njb2RlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImR1bmdlb25cIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZWFzeVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJlbmdhZ2VtZW50XCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImVudGVudGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZXllLWNhdGNoZXJcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZXllY2F0Y2hlclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJleWVsaW5lclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJleWV3b3JkXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZhc2hpb25cIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmVhdHVyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmZXJpZW5cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmluZWxpbmVyXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZpc2hleWVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmxha2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmxhbWJlYXVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmxhdHJhdGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmxlZWNlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZyYcOuY2hlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZyZWFrXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZyaXRlc1wiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmdXR1cmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2FlbGljXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdhbWUtc2hvd1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnYW1lYm95XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdhbWVwYWRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2FtZXBsYXlcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2FtZXBvcnRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2FtZXNob3dcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2FyaWd1ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnYXJyaWd1ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnYXRlZm9sZFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnYXRld2F5XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdlZmxhc2hlZFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnZW9yZ2llclwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJnb2FsXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdyYXBlZnJ1aXRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ3JlYXRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ3JvdXB3YXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImd1ZXVsZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJndWlkZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJndWlsbG9jaGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ3luw6R6ZWVuXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImd5bsO2emVlblwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoYWlyY2FyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoYXJkY29yZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoYXJkd2FyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoZWFkXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhlYXJpbmdcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaGVhcnRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaGVhdnlcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaGVkZ2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaGVyb2luXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImluY2x1c2l2ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJpbml0aWF0aXZlXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImluc2lkZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJqYWd1YXJcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiamFsb3VzZXR0ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJqZWFuc1wiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJqZXVuZXNzZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJqdWljZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJqdWtlYm94XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImp1bXBzdWl0XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImthbmFyaWVuXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImthcHJpb2xlXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImthcm9zc2VyaWVsaW5pZVwiLCBcInN5bGxhYmxlc1wiOiA2IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJrb25vcGVlblwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsYWNyb3NzZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsYXBsYWNlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxhdGUtXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxlYWRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibGVhZ3VlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxlYXJuXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImzDqWdpw6hyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsaXplbnppYXRcIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibG9hZFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsb3R0ZXJpZWxvc1wiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsb3VuZ2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibHl6ZWVuXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1hZGFtZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtYWRlbW9pc2VsbGVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWFnaWVyXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1ha2UtdXBcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWFsd2FyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtYW5hZ2VtZW50XCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1hbnRlYXVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWF1c29sZWVuXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1hdXZlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1lZGllblwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtZXNkYW1lc1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtZXNvcG90YW1pZW5cIiwgXCJzeWxsYWJsZXNcIjogNiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWlsbGlhcmRlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1pc3NpbGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWlzemVsbGFuZWVuXCIsIFwic3lsbGFibGVzXCI6IDUgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1vdXNzZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtb3Vzc2VsaW5lXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm11c2VlblwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtdXNldHRlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm5haHVhdGxcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibm9pc2V0dGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibm90ZWJvb2tcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibnVhbmNlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm51a2xlYXNlXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm9kZWVuXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm9mZmxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwib2Zmc2lkZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJvbGVhc3RlclwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJvbi1zdGFnZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJvbmxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwib3JwaGVlblwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwYXJmb3JjZXJpdHRcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGF0aWVuc1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwYXRpZW50XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBlYWNlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBlYWNlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBlYW51dHNcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGVvcGxlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBlcmluZWVuXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBlcml0b25lZW5cIiwgXCJzeWxsYWJsZXNcIjogNSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGljdHVyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwaWVjZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwaXBlbGluZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwbGF0ZWF1XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBvZXNpZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwb2xlcG9zaXRpb25cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicG9ydGVtYW50ZWF1XCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBvcnRlbW9ubmFpZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwcmltZXJhdGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicHJpbWVyYXRlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInByaW1ldGltZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwcm90ZWFzZVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwcm90ZWluXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInByeXRhbmVlblwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJxdW90aWVudFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyYWRpb1wiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyZWFkZXJcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmVhZHlcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmVhbGxpZmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmVwZWF0XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJldGFrZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyaWdvbGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmlzb2xsZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyb2FkXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJvYW1pbmdcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicm9xdWVmb3J0XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNhZmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2F2b25ldHRlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNjaWVuY2VmaWN0aW9uXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNlYXJjaFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzZWxmbWFkZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzZXB0aW1lXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNlcmFwZWVuXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNlcnZpY2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2VydmlldHRlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNoYXJlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNoYXZlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNob3JlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNpZGViYXJcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2lkZWJvYXJkXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNpZGVraWNrXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNpbGhvdWV0dGVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2l0ZW1hcFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzbGlkZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzbmVha1wiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzb2FwXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNvZnRjb3JlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNvZnR3YXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNvdXRhbmVsbGVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3BlYWtcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3BlY2lhbFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzcHJhY2hlaW5zdGVsbHVuZ1wiLCBcInN5bGxhYmxlc1wiOiA1IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzcHl3YXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNxdWFyZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdGFnZWRpdmluZ1wiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdGFrZWhvbGRlclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdGF0ZW1lbnRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RlYWR5XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0ZWFrXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0ZWFsdGhcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RlYW1cIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RvbmVkXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0cmFjY2lhdGVsbGFcIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RyZWFtXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0cmlkZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdHJpa2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3VpdGNhc2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3dlZXBzdGFrZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0LWJvbmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidC1zaGlydFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0YWlsZ2F0ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0YWtlLW9mZlwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0YWtlLW92ZXJcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGFrZWF3YXlcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGFrZW9mZlwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0YWtlb3ZlclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0aHJvYXRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGltZS1vdXRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGltZWxhZ1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0aW1lbGluZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0aW1lc2hhcmluZ1wiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0b2FzdFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0cmF1YmVubWFpc2NoZVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0cmlzdGVzc2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidXNlbmV0XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInZhcmlldMOkdFwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ2YXJpZXTDqVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ2aW5haWdyZXR0ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ2aW50YWdlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInZpb2xldHRcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidm9pY2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwid2FrZWJvYXJkXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIndhc2hlZFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ3YXZlYm9hcmRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwid2VhclwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ3ZWFyXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIndlYnNpdGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwid2hpdGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwid2lkZXNjcmVlblwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ3aXJlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInlhY2h0XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInlvcmtzaGlyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCLDqXByb3V2ZXR0ZVwiLCBcInN5bGxhYmxlc1wiOiAzLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2FsZXR0ZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2lndWVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdyb292ZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibW9yZ3VlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwYWlsbGV0dGVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJhY2xldHRlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyb3VsZXR0ZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3Bpa2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0eWxlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0YWJsZXR0ZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ3J1bmdlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzaXplXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ2YWx1ZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicXVpY2hlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJzXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJob3VzZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNhdWNlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwic1wiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3BhY2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJzXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhaXJsaW5lXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYXV0b3NhdmVcIiwgXCJzeWxsYWJsZXNcIjogMywgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiYWdwaXBlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmlrZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImRhbmNlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZGVhZGxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoYWxmcGlwZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhlYWRsaW5lXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaG9tZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhvcm5waXBlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaG90bGluZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImluZm9saW5lXCIsIFwic3lsbGFibGVzXCI6IDMsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaW5saW5lXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwia2l0ZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJvbGxlcmJsYWRlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2NvcmVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJza3lsaW5lXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2xhY2tsaW5lXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2xpY2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCIsIFwic1wiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic25vb3plXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RvcnlsaW5lXCIsIFwic3lsbGFibGVzXCI6IDMsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwib2ZmaWNlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJzXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3BhY2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJzXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGVhc2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJzXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2FjaGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcInRcIl0gfVxuXHRcdFx0XHRdLFxuXHRcdFx0XHRcImF0QmVnaW5uaW5nT3JFbmRcIjogW1xuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2FzZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsaWZlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRlYWtcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGVhbVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjcmVtZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNyw6htZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wiblwiLCBcInJcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImRyaXZlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2thdGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ1cGRhdGVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFtcIm5cIiwgXCJyXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ1cGdyYWRlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCIsIFwiclwiXSB9XG5cdFx0XHRcdF0sXG5cdFx0XHRcdFwiYXRCZWdpbm5pbmdcIjogW1xuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYW5pb25cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmFjZWxpZnRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaml1XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBhY2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic2hha2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGVhXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRyYWRlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImRlYWxcIiwgXCJzeWxsYWJsZXNcIjogMSB9XG5cdFx0XHRcdF0sXG5cdFx0XHRcdFwiYXRFbmRcIjogW1xuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmFjZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmaWxlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1vdXNzZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwbGF0ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0YXBlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJ5dGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbXCJzXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYXBlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwiYWxzb0ZvbGxvd2VkQnlcIjogW1wic1wiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZml2ZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcImFsc29Gb2xsb3dlZEJ5XCI6IFtcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImh5cGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbXCJzXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsZWFrXCIsIFwic3lsbGFibGVzXCI6IDEsIFwiYWxzb0ZvbGxvd2VkQnlcIjogW1wic1wiXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibGlrZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcImFsc29Gb2xsb3dlZEJ5XCI6IFtcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1ha2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbXCJzXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwaG9uZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcImFsc29Gb2xsb3dlZEJ5XCI6IFtcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJhdmVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbXCJzXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyZWdpbWVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbXCJzXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdGF0dWVcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbXCJzXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdG9yZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcImFsc29Gb2xsb3dlZEJ5XCI6IFtcInNcIl0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIndhdmVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbXCJzXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJkYXRlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbXCJuXCJdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJpbWFnZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogW1wic1wiXSB9XG5cdFx0XHRcdF1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzPXtcblx0XCJ2b3dlbHNcIjogXCJhZWlvdXlcIixcblx0XCJkZXZpYXRpb25zXCI6IHtcblx0XHRcInZvd2Vsc1wiOiBbXG5cdFx0XHR7XG5cdFx0XHRcdFwiZnJhZ21lbnRzXCI6IFsgXCJjaWFsXCIsIFwidGlhXCIsIFwiY2l1c1wiLCBcImdpdVwiLCBcImlvblwiLFxuXHRcdFx0XHRcdFwiW15iZG5wcnZdaW91XCIsIFwic2lhJFwiLCBcIlteYWVpdW90XXsyLH1lZCRcIiwgXCJbYWVpb3V5XVteYWVpdW95dHNdezEsfWUkXCIsXG5cdFx0XHRcdFx0XCJbYS16XWVseSRcIiwgXCJbY2d5XWVkJFwiLCBcInJ2ZWQkXCIsIFwiW2FlaW91eV1bZHRdZXM/JFwiLCBcImVhdVwiLCBcImlldVwiLFxuXHRcdFx0XHRcdFwib2V1XCIsIFwiW2FlaW91eV1bXmFlaW91eWR0XWVbc2RdPyRcIiwgXCJbYWVvdXldcnNlJFwiLCBcIl5leWVcIiBdLFxuXHRcdFx0XHRcImNvdW50TW9kaWZpZXJcIjogLTFcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdFwiZnJhZ21lbnRzXCI6IFsgXCJpYVwiLCBcIml1XCIsIFwiaWlcIiwgXCJpb1wiLCBcIlthZWlvXVthZWlvdV17Mn1cIiwgXCJbYWVpb3VdaW5nXCIsIFwiW15hZWlvdV15aW5nXCIsIFwidWlbYWVvdV1cIiBdLFxuXHRcdFx0XHRcImNvdW50TW9kaWZpZXJcIjogMVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0XCJmcmFnbWVudHNcIjogWyBcIl5yZWVbam1ucHFyc3hdXCIsIFwiXnJlZWxlXCIsIFwiXnJlZXZhXCIsIFwicmlldFwiLFxuXHRcdFx0XHRcdFwiZGllblwiLCBcIlthZWlvdXltXVtiZHBdbGUkXCIsIFwidWVpXCIsIFwidW91XCIsXG5cdFx0XHRcdFx0XCJebWNcIiwgXCJpc20kXCIsIFwiW15sXWxpZW5cIiwgXCJeY29hW2RnbHhdLlwiLFxuXHRcdFx0XHRcdFwiW15ncWF1aWVvXXVhW15hdWllb11cIiwgXCJkbid0JFwiLCBcInVpdHkkXCIsIFwiaWUocnxzdClcIixcblx0XHRcdFx0XHRcIlthZWlvdXddeVthZWlvdV1cIiwgXCJbXmFvXWlyZVtkc11cIiwgXCJbXmFvXWlyZSRcIiBdLFxuXHRcdFx0XHRcImNvdW50TW9kaWZpZXJcIjogMVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0XCJmcmFnbWVudHNcIjogWyBcImVvYVwiLCBcImVvb1wiLCBcImlvYVwiLCBcImlvZVwiLCBcImlvb1wiIF0sXG5cdFx0XHRcdFwiY291bnRNb2RpZmllclwiOiAxXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRcIndvcmRzXCI6IHtcblx0XHRcdFwiZnVsbFwiOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRcIndvcmRcIjogXCJidXNpbmVzc1wiLFxuXHRcdFx0XHRcdFwic3lsbGFibGVzXCI6IDJcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFwid29yZFwiOiBcImNvaGVpcmVzc1wiLFxuXHRcdFx0XHRcdFwic3lsbGFibGVzXCI6IDNcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdFwid29yZFwiOiBcImNvbG9uZWxcIixcblx0XHRcdFx0XHRcInN5bGxhYmxlc1wiOiAyXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRcIndvcmRcIjogXCJoZWlyZXNzXCIsXG5cdFx0XHRcdFx0XCJzeWxsYWJsZXNcIjogMlxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0XCJ3b3JkXCI6IFwiaS5lXCIsXG5cdFx0XHRcdFx0XCJzeWxsYWJsZXNcIjogMlxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0XCJ3b3JkXCI6IFwic2hvcmVsaW5lXCIsXG5cdFx0XHRcdFx0XCJzeWxsYWJsZXNcIjogMlxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0XCJ3b3JkXCI6IFwic2ltaWxlXCIsXG5cdFx0XHRcdFx0XCJzeWxsYWJsZXNcIjogM1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0XCJ3b3JkXCI6IFwidW5oZWlyZWRcIixcblx0XHRcdFx0XHRcInN5bGxhYmxlc1wiOiAyXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRcIndvcmRcIjogXCJ3ZWRuZXNkYXlcIixcblx0XHRcdFx0XHRcInN5bGxhYmxlc1wiOiAyXG5cdFx0XHRcdH1cblx0XHRcdF0sXG5cdFx0XHRcImZyYWdtZW50c1wiOiB7XG5cdFx0XHRcdFwiZ2xvYmFsXCI6IFtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcIndvcmRcIjogXCJjb3lvdGVcIixcblx0XHRcdFx0XHRcdFwic3lsbGFibGVzXCI6IDNcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFwid29yZFwiOiBcImdyYXZleWFyZFwiLFxuXHRcdFx0XHRcdFx0XCJzeWxsYWJsZXNcIjogMlxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XCJ3b3JkXCI6IFwibGF3eWVyXCIsXG5cdFx0XHRcdFx0XHRcInN5bGxhYmxlc1wiOiAyXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRdXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG4iLCJtb2R1bGUuZXhwb3J0cz17XG5cdFwidm93ZWxzXCI6IFwiYcOhw6TDomXDqcOrw6ppw63Dr8Oub8Ozw7bDtHXDusO8w7t5XCIsXG5cdFwiZGV2aWF0aW9uc1wiOiB7XG5cdFx0XCJ2b3dlbHNcIjogW1xuXHRcdFx0e1xuXHRcdFx0XHRcImZyYWdtZW50c1wiOiBbIFwidWUkXCIsIFwiZGdlJFwiLCBcIlt0Y3BdacOrbnRcIixcblx0XHRcdFx0XHRcImFjZSRcIiwgXCJbYnJdZWFjaFwiLCBcIlthaW5wcl10aWFhbFwiLCBcIltpb110aWFhblwiLFxuXHRcdFx0XHRcdFwiZ3VhW3ljXVwiLCBcIlteaV1kZWFsXCIsIFwidGl2ZSRcIiwgXCJsb2FkXCIsIFwiW15lXWNva2VcIixcblx0XHRcdFx0XHRcIltec11jb3JlJFwiIF0sXG5cdFx0XHRcdFwiY291bnRNb2RpZmllclwiOiAtMVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0XCJmcmFnbWVudHNcIjogWyBcImHDpFwiLCBcImFldVwiLCBcImFpZVwiLCBcImFvXCIsIFwiw6tcIiwgXCJlb1wiLFxuXHRcdFx0XHRcdFwiZcO6XCIsIFwiaWVhdVwiLCBcImVhJFwiLCBcImVhW151XVwiLCBcImVpW2VqXVwiLFxuXHRcdFx0XHRcdFwiZXVbaXVdXCIsIFwiw69cIiwgXCJpZWlcIiwgXCJpZW5uZVwiLCBcIltebF1pZXVbXnddXCIsXG5cdFx0XHRcdFx0XCJbXmxdaWV1JFwiLCBcImlbYXVpeV1cIiwgXCJzdGlvblwiLFxuXHRcdFx0XHRcdFwiW15jc3R4XWlvXCIsIFwiXnNpb25cIiwgXCJyacOoXCIsIFwib8O2XCIsIFwib2FcIiwgXCJvZWluZ1wiLFxuXHRcdFx0XHRcdFwib2llXCIsIFwiW2V1XcO8XCIsIFwiW15xXXVbYWXDqG9dXCIsIFwidWllXCIsXG5cdFx0XHRcdFx0XCJbYmhucHJdaWVlbFwiLCBcIltiaG5wcl1pw6tsXCIgXSxcblx0XHRcdFx0XCJjb3VudE1vZGlmaWVyXCI6IDFcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdFwiZnJhZ21lbnRzXCI6IFsgXCJbYWVvbHVdeVthZcOpw6hvw7N1XVwiIF0sXG5cdFx0XHRcdFwiY291bnRNb2RpZmllclwiOiAxXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRcIndvcmRzXCI6IHtcblx0XHRcdFwiZnVsbFwiOiBbXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYnllXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJjb3JlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJjdXJlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJkZWlcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImRvcGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImR1ZGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImZha2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImZhbWVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImZpdmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImhvbGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcImxlYXN0XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJsb25lXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJtaW51dGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcIm1vdmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcIm5pY2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcIm9uZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RhdGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHR7IFwid29yZFwiOiBcInN1cnBsYWNlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJ0YWtlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0eyBcIndvcmRcIjogXCJ0cmFkZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdHsgXCJ3b3JkXCI6IFwid2lkZVwiLCBcInN5bGxhYmxlc1wiOiAxIH1cblx0XHRcdF0sXG5cdFx0XHRcImZyYWdtZW50c1wiOiB7XG5cdFx0XHRcdFwiZ2xvYmFsXCI6IFtcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImFkaWV1XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImFpcmxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYWlybWlsZXNcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYWxpZW5cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYW1iaWVudFwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhbm5vdW5jZW1lbnRcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYXBwZWFyYW5jZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhcHBlYXNlbWVudFwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhdGhlbmV1bVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJhd2Vzb21lXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJhY2NhbGF1cmVpXCIsIFwic3lsbGFibGVzXCI6IDUgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJhY2NhbGF1cmV1c1wiLCBcInN5bGxhYmxlc1wiOiA1IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiYXNlYmFsbFwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiYXNlanVtcFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiYW5saWV1ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiYXBhb1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiYXJiZWN1ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJiZWFtZXJcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmVhbmllXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJlYXRcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmVsbGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYsOqdGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmluZ2V3YXRjaFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJibG9jbm90ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJibHVlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJvYXJkXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJyZWFrXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJyb2FkXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImJ1bGxzLWV5ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJidXNpbmVzc1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJieWVieWVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2FjYW9cIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2Flc2FyXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNhbWFpZXVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2FvdXRjaG91Y1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYXJib2xpbmV1bVwiLCBcInN5bGxhYmxlc1wiOiA1IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYXRjaHBocmFzZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYXJyaWVyXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNoZWF0XCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNoZWVzZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjaXJjb25mbGV4ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjbGVhblwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjbG9ha1wiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjb2J1eWluZ1wiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjb21lYmFja1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjb21mb3J0em9uZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjb21tdW5pcXXDqVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjb25vcGV1bVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjb25zb2xlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNvcnBvcmF0ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjb8O7dGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY3JlYW1lclwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjcmltZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjcnVlc2xpXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImRlYWRsaW5lXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImRlYXV0b3Jpc2VyZW5cIiwgXCJzeWxsYWJsZXNcIjogNiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZGV1Y2VcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZGV1bVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJkaXJuZGxcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZHJlYWRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZHJlYW10ZWFtXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImRyb25lXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImVucXXDqnRlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImVzY2FwZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJleHBvc3VyZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJleHRyYW5laVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJleHRyYW5ldXNcIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZXllY2F0Y2hlclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJleWVsaW5lclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJleWVvcGVuZXJcIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZXlldHJhY2tlclwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJleWV0cmFja2luZ1wiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmYWlydHJhZGVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmF1dGV1aWxcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmVhdHVyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmZXVpbGxldGVlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZldWlsbGV0b25cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmlzaGV5ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmaW5lbGluZXJcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZmluZXR1bmVuXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZvcmVoYW5kXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZyZWFrXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZ1c2lvbmVyZW5cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2F5cGFyYWRlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdheXByaWRlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdvYWxcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ3JhcGVmcnVpdFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJncnV5w6hyZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJndWVsZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJndWVycmlsbGFcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ3Vlc3RcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaGFyZHdhcmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaGF1dGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaGVhbGluZ1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoZWF0ZXJcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaGVhdnlcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaG9heFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJob3RsaW5lXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImlkZWUtZml4ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJpbmNsdXNpdmVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaW5saW5lXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImludGFrZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJpbnRlbnNpdmVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiamVhbnNcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiSm9uZXNcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwianViaWxldW1cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwia2FsZnNyaWJleWVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwia3JhYWllbm5lc3RcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibGFzdG1pbnV0ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsZWFybmluZ1wiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsZWFndWVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibGluZS11cFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsaW5vbGV1bVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsb2FkXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImxvYWZlclwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsb25ncmVhZFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsb29rYWxpa2VcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibG91aXNcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibHljZXVtXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1hZ2F6aW5lXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1haW5zdHJlYW1cIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWFrZS1vdmVyXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1ha2UtdXBcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWFsd2FyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtYXJtb2xldW1cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWF1c29sZXVtXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1lZGVhdXRldXJcIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWlkbGlmZWNyaXNpc1wiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtaWdyYWluZWF1cmFcIiwgXCJzeWxsYWJsZXNcIjogNSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibWlsa3NoYWtlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm1pbGxlZmV1aWxsZVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtaXhlZFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtdWVzbGlcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibXVzZXVtXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm11c3QtaGF2ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtdXN0LXJlYWRcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibm90ZWJvb2tcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibm9uc2Vuc2VcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibm93aGVyZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJudXJ0dXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm9mZmxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwib25lbGluZXJcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwib25lc2llXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm9ubGluZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJvcGluaW9uXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBhZWxsYVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwYWNlbWFrZXJcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGFuYWNoZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwYXBlZ2FhaWVubmV1c1wiLCBcInN5bGxhYmxlc1wiOiA1IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwYXNzZS1wYXJ0b3V0XCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBlYW51dHNcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGVyaWdldW1cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGVyaW5ldW1cIiwgXCJzeWxsYWJsZXNcIjogNCB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicGVycGV0dXVtXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBldHJvbGV1bVwiLCBcInN5bGxhYmxlc1wiOiA0IH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwaG9uZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJwaWN0dXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBsYWNlbWF0XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBvcnRlLW1hbnRlYXVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicG9ydGVmZXVpbGxlXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInByZXNzZS1wYXBpZXJcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicHJpbWV0aW1lXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInF1ZWVuXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInF1ZXN0aW9ubmFpcmVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicXVldWVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmVhZGVyXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJlYWxpdHlcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmVhbGxpZmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmVtYWtlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJlcGVhdFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyZXBlcnRvaXJlXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJlc2VhcmNoXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJldmVyZW5jZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyaWJleWVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmluZ3RvbmVcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicm9hZFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyb2FtaW5nXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNjaWVuY2VmaWN0aW9uXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNlbGZtYWRlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNpZGVraWNrXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNpZ2h0c2VlaW5nXCIsIFwic3lsbGFibGVzXCI6IDMgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNreWxpbmVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic21pbGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic25lYWt5XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNvZnR3YXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNwYXJlcmliXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNwZWFrZXJcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3ByZWFkXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0YXRlbWVudFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdGVha1wiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdGVlcGxlY2hhc2VcIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RvbmV3YXNoXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0b3JlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0cmVha2VuXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN0cmVhbVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdHJlZXR3YXJlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN1cGVyc29ha2VyXCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN1cnByaXNlLXBhcnR5XCIsIFwic3lsbGFibGVzXCI6IDQgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInN3ZWF0ZXJcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidGVhc2VyXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRlbnVlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRlbXBsYXRlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRpbWVsaW5lXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRpc3N1ZVwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0b2FzdFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0w6p0ZS3DoC10w6p0ZVwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0eXBlY2FzdFwiLCBcInN5bGxhYmxlc1wiOiAyIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ1bmlxdWVcIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidXJldW1cIiwgXCJzeWxsYWJsZXNcIjogMyB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwidmliZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ2aWV1eFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ2aWxsZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ2aW50YWdlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIndhbmRlbHl1cFwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ3aXNlZ3V5XCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIndha2UtdXAtY2FsbFwiLCBcInN5bGxhYmxlc1wiOiAzIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ3ZWJjYXJlXCIsIFwic3lsbGFibGVzXCI6IDIgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIndpbmVndW1cIiwgXCJzeWxsYWJsZXNcIjogMiB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYmFzZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcImVcIiwgXCJuXCIsIFwiclwiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImdhbWVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwibFwiLCBcInJcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzdHlsZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZG91Y2hlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzcGFjZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic3RyaXB0ZWFzZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiaml2ZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJyXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwia2V5bm90ZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJyXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibW91bnRhaW5iaWtlXCIsIFwic3lsbGFibGVzXCI6IDMsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInJcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJmYWNlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInRcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjaGFsbGVuZ2VcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjcnVpc2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJob3VzZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJyXCIsIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImRhbmNlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInJcIiwgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZnJhbmNoaXNlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInJcIiwgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZnJlZWxhbmNlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInJcIiwgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibGVhc2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsaW5lZGFuY2VcIiwgXCJzeWxsYWJsZXNcIjogMiwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJsb3VuZ2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiLCBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJtZXJjaGFuZGlzZVwiLCBcInN5bGxhYmxlc1wiOiAzLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJyXCIsIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInBlcmZvcm1hbmNlXCIsIFwic3lsbGFibGVzXCI6IDMsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInJcIiwgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwicmVsZWFzZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcIm5cIiwgXCJyXCIsIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInJlc291cmNlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInJcIiwgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2FjaGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJjXCIsIFwibFwiLCBcIm5cIiwgXCJ0XCIsIFwieFwiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcIm9mZmljZVwiLCBcInN5bGxhYmxlc1wiOiAyLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcInJcIiwgXCJzXCIgXSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY2xvc2VcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJyXCIsIFwidFwiIF0gfVxuXHRcdFx0XHRdLFxuXHRcdFx0XHRcImF0QmVnaW5uaW5nT3JFbmRcIjogW1xuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiYnl0ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYWtlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImNhcmVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY29hY2hcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY29hdFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJlYXJsXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZvYW1cIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiZ2F0ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJoZWFkXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImhvbWVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwibGl2ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzYWZlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNpdGVcIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwic29hcFwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0ZWFrXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRlYW1cIiwgXCJzeWxsYWJsZXNcIjogMSB9LFxuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwid2F2ZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJicmFjZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJjYXNlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZsZWVjZVwiLCBcInN5bGxhYmxlc1wiOiAxLCBcIm5vdEZvbGxvd2VkQnlcIjogWyBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJzZXJ2aWNlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInZvaWNlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImtpdGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJub3RGb2xsb3dlZEJ5XCI6IFsgXCJuXCIsIFwiclwiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInNrYXRlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInJcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJyYWNlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwiblwiLCBcInJcIiwgXCJzXCIgXSB9XG5cdFx0XHRcdF0sXG5cdFx0XHRcdFwiYXRCZWdpbm5pbmdcIjogW1xuXHRcdFx0XHRcdHsgXCJ3b3JkXCI6IFwiY29rZVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJkZWFsXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImltYWdlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwibm90Rm9sbG93ZWRCeVwiOiBbIFwic1wiIF0gfVxuXHRcdFx0XHRdLFxuXHRcdFx0XHRcImF0RW5kXCI6IFtcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImZvcmNlXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInRlYVwiLCBcInN5bGxhYmxlc1wiOiAxIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0aW1lXCIsIFwic3lsbGFibGVzXCI6IDEgfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImRhdGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcImh5cGVcIiwgXCJzeWxsYWJsZXNcIjogMSwgXCJhbHNvRm9sbG93ZWRCeVwiOiBbIFwic1wiIF0gfSxcblx0XHRcdFx0XHR7IFwid29yZFwiOiBcInF1b3RlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwiYWxzb0ZvbGxvd2VkQnlcIjogWyBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ0YXBlXCIsIFwic3lsbGFibGVzXCI6IDEsIFwiYWxzb0ZvbGxvd2VkQnlcIjogWyBcInNcIiBdIH0sXG5cdFx0XHRcdFx0eyBcIndvcmRcIjogXCJ1cGdyYWRlXCIsIFwic3lsbGFibGVzXCI6IDIsIFwiYWxzb0ZvbGxvd2VkQnlcIjogWyBcInNcIiBdIH1cblx0XHRcdFx0XVxuXHRcdFx0fVxuXHRcdH1cblx0fVxufVxuIiwiLyoqXG4gKiBUaGUgZnVuY3Rpb24gZ2V0dGluZyB0aGUgbGFuZ3VhZ2UgcGFydCBvZiB0aGUgbG9jYWxlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhbGUgVGhlIGxvY2FsZS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBsYW5ndWFnZSBwYXJ0IG9mIHRoZSBsb2NhbGUuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGxvY2FsZSApIHtcblx0cmV0dXJuIGxvY2FsZS5zcGxpdCggXCJfXCIgKVsgMCBdO1xufTtcbiIsInZhciBibG9ja0VsZW1lbnRzID0gWyBcImFkZHJlc3NcIiwgXCJhcnRpY2xlXCIsIFwiYXNpZGVcIiwgXCJibG9ja3F1b3RlXCIsIFwiY2FudmFzXCIsIFwiZGRcIiwgXCJkaXZcIiwgXCJkbFwiLCBcImZpZWxkc2V0XCIsIFwiZmlnY2FwdGlvblwiLFxuXHRcImZpZ3VyZVwiLCBcImZvb3RlclwiLCBcImZvcm1cIiwgXCJoMVwiLCBcImgyXCIsIFwiaDNcIiwgXCJoNFwiLCBcImg1XCIsIFwiaDZcIiwgXCJoZWFkZXJcIiwgXCJoZ3JvdXBcIiwgXCJoclwiLCBcImxpXCIsIFwibWFpblwiLCBcIm5hdlwiLFxuXHRcIm5vc2NyaXB0XCIsIFwib2xcIiwgXCJvdXRwdXRcIiwgXCJwXCIsIFwicHJlXCIsIFwic2VjdGlvblwiLCBcInRhYmxlXCIsIFwidGZvb3RcIiwgXCJ1bFwiLCBcInZpZGVvXCIgXTtcbnZhciBpbmxpbmVFbGVtZW50cyA9IFsgXCJiXCIsIFwiYmlnXCIsIFwiaVwiLCBcInNtYWxsXCIsIFwidHRcIiwgXCJhYmJyXCIsIFwiYWNyb255bVwiLCBcImNpdGVcIiwgXCJjb2RlXCIsIFwiZGZuXCIsIFwiZW1cIiwgXCJrYmRcIiwgXCJzdHJvbmdcIixcblx0XCJzYW1wXCIsIFwidGltZVwiLCBcInZhclwiLCBcImFcIiwgXCJiZG9cIiwgXCJiclwiLCBcImltZ1wiLCBcIm1hcFwiLCBcIm9iamVjdFwiLCBcInFcIiwgXCJzY3JpcHRcIiwgXCJzcGFuXCIsIFwic3ViXCIsIFwic3VwXCIsIFwiYnV0dG9uXCIsXG5cdFwiaW5wdXRcIiwgXCJsYWJlbFwiLCBcInNlbGVjdFwiLCBcInRleHRhcmVhXCIgXTtcblxudmFyIGJsb2NrRWxlbWVudHNSZWdleCA9IG5ldyBSZWdFeHAoIFwiXihcIiArIGJsb2NrRWxlbWVudHMuam9pbiggXCJ8XCIgKSArIFwiKSRcIiwgXCJpXCIgKTtcbnZhciBpbmxpbmVFbGVtZW50c1JlZ2V4ID0gbmV3IFJlZ0V4cCggXCJeKFwiICsgaW5saW5lRWxlbWVudHMuam9pbiggXCJ8XCIgKSArIFwiKSRcIiwgXCJpXCIgKTtcblxudmFyIGJsb2NrRWxlbWVudFN0YXJ0UmVnZXggPSBuZXcgUmVnRXhwKCBcIl48KFwiICsgYmxvY2tFbGVtZW50cy5qb2luKCBcInxcIiApICsgXCIpW14+XSo/PiRcIiwgXCJpXCIgKTtcbnZhciBibG9ja0VsZW1lbnRFbmRSZWdleCA9IG5ldyBSZWdFeHAoIFwiXjwvKFwiICsgYmxvY2tFbGVtZW50cy5qb2luKCBcInxcIiApICsgXCIpW14+XSo/PiRcIiwgXCJpXCIgKTtcblxudmFyIGlubGluZUVsZW1lbnRTdGFydFJlZ2V4ID0gbmV3IFJlZ0V4cCggXCJePChcIiArIGlubGluZUVsZW1lbnRzLmpvaW4oIFwifFwiICkgKyBcIilbXj5dKj4kXCIsIFwiaVwiICk7XG52YXIgaW5saW5lRWxlbWVudEVuZFJlZ2V4ID0gbmV3IFJlZ0V4cCggXCJePC8oXCIgKyBpbmxpbmVFbGVtZW50cy5qb2luKCBcInxcIiApICsgXCIpW14+XSo+JFwiLCBcImlcIiApO1xuXG52YXIgb3RoZXJFbGVtZW50U3RhcnRSZWdleCA9IC9ePChbXj5cXHNcXC9dKylbXj5dKj4kLztcbnZhciBvdGhlckVsZW1lbnRFbmRSZWdleCA9IC9ePFxcLyhbXj5cXHNdKylbXj5dKj4kLztcblxudmFyIGNvbnRlbnRSZWdleCA9IC9eW148XSskLztcbnZhciBncmVhdGVyVGhhbkNvbnRlbnRSZWdleCA9IC9ePFtePjxdKiQvO1xuXG52YXIgY29tbWVudFJlZ2V4ID0gLzwhLS0oLnxbXFxyXFxuXSkqPy0tPi9nO1xuXG52YXIgY29yZSA9IHJlcXVpcmUoIFwidG9rZW5pemVyMi9jb3JlXCIgKTtcbnZhciBmb3JFYWNoID0gcmVxdWlyZSggXCJsb2Rhc2gvZm9yRWFjaFwiICk7XG52YXIgbWVtb2l6ZSA9IHJlcXVpcmUoIFwibG9kYXNoL21lbW9pemVcIiApO1xuXG52YXIgdG9rZW5zID0gW107XG52YXIgaHRtbEJsb2NrVG9rZW5pemVyO1xuXG4vKipcbiAqIENyZWF0ZXMgYSB0b2tlbml6ZXIgdG8gdG9rZW5pemUgSFRNTCBpbnRvIGJsb2Nrcy5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gY3JlYXRlVG9rZW5pemVyKCkge1xuXHR0b2tlbnMgPSBbXTtcblxuXHRodG1sQmxvY2tUb2tlbml6ZXIgPSBjb3JlKCBmdW5jdGlvbiggdG9rZW4gKSB7XG5cdFx0dG9rZW5zLnB1c2goIHRva2VuICk7XG5cdH0gKTtcblxuXHRodG1sQmxvY2tUb2tlbml6ZXIuYWRkUnVsZSggY29udGVudFJlZ2V4LCBcImNvbnRlbnRcIiApO1xuXHRodG1sQmxvY2tUb2tlbml6ZXIuYWRkUnVsZSggZ3JlYXRlclRoYW5Db250ZW50UmVnZXgsIFwiZ3JlYXRlci10aGFuLXNpZ24tY29udGVudFwiICk7XG5cblx0aHRtbEJsb2NrVG9rZW5pemVyLmFkZFJ1bGUoIGJsb2NrRWxlbWVudFN0YXJ0UmVnZXgsIFwiYmxvY2stc3RhcnRcIiApO1xuXHRodG1sQmxvY2tUb2tlbml6ZXIuYWRkUnVsZSggYmxvY2tFbGVtZW50RW5kUmVnZXgsIFwiYmxvY2stZW5kXCIgKTtcblx0aHRtbEJsb2NrVG9rZW5pemVyLmFkZFJ1bGUoIGlubGluZUVsZW1lbnRTdGFydFJlZ2V4LCBcImlubGluZS1zdGFydFwiICk7XG5cdGh0bWxCbG9ja1Rva2VuaXplci5hZGRSdWxlKCBpbmxpbmVFbGVtZW50RW5kUmVnZXgsIFwiaW5saW5lLWVuZFwiICk7XG5cblx0aHRtbEJsb2NrVG9rZW5pemVyLmFkZFJ1bGUoIG90aGVyRWxlbWVudFN0YXJ0UmVnZXgsIFwib3RoZXItZWxlbWVudC1zdGFydFwiICk7XG5cdGh0bWxCbG9ja1Rva2VuaXplci5hZGRSdWxlKCBvdGhlckVsZW1lbnRFbmRSZWdleCwgXCJvdGhlci1lbGVtZW50LWVuZFwiICk7XG59XG5cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gZWxlbWVudCBuYW1lIGlzIGEgYmxvY2sgZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaHRtbEVsZW1lbnROYW1lIFRoZSBuYW1lIG9mIHRoZSBIVE1MIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgaXQgaXMgYSBibG9jayBlbGVtZW50LlxuICovXG5mdW5jdGlvbiBpc0Jsb2NrRWxlbWVudCggaHRtbEVsZW1lbnROYW1lICkge1xuXHRyZXR1cm4gYmxvY2tFbGVtZW50c1JlZ2V4LnRlc3QoIGh0bWxFbGVtZW50TmFtZSApO1xufVxuXG4vKipcbiAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIGdpdmVuIGVsZW1lbnQgbmFtZSBpcyBhbiBpbmxpbmUgZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaHRtbEVsZW1lbnROYW1lIFRoZSBuYW1lIG9mIHRoZSBIVE1MIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgaXQgaXMgYW4gaW5saW5lIGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIGlzSW5saW5lRWxlbWVudCggaHRtbEVsZW1lbnROYW1lICkge1xuXHRyZXR1cm4gaW5saW5lRWxlbWVudHNSZWdleC50ZXN0KCBodG1sRWxlbWVudE5hbWUgKTtcbn1cblxuLyoqXG4gKiBTcGxpdHMgYSB0ZXh0IGludG8gYmxvY2tzIGJhc2VkIG9uIEhUTUwgYmxvY2sgZWxlbWVudHMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gc3BsaXQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IEEgbGlzdCBvZiBibG9ja3MgYmFzZWQgb24gSFRNTCBibG9jayBlbGVtZW50cy5cbiAqL1xuZnVuY3Rpb24gZ2V0QmxvY2tzKCB0ZXh0ICkge1xuXHR2YXIgYmxvY2tzID0gW10sIGRlcHRoID0gMCxcblx0XHRibG9ja1N0YXJ0VGFnID0gXCJcIixcblx0XHRjdXJyZW50QmxvY2sgPSBcIlwiLFxuXHRcdGJsb2NrRW5kVGFnID0gXCJcIjtcblxuXHQvLyBSZW1vdmUgYWxsIGNvbW1lbnRzIGJlY2F1c2UgaXQgaXMgdmVyeSBoYXJkIHRvIHRva2VuaXplIHRoZW0uXG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoIGNvbW1lbnRSZWdleCwgXCJcIiApO1xuXG5cdGNyZWF0ZVRva2VuaXplcigpO1xuXHRodG1sQmxvY2tUb2tlbml6ZXIub25UZXh0KCB0ZXh0ICk7XG5cblx0aHRtbEJsb2NrVG9rZW5pemVyLmVuZCgpO1xuXG5cdGZvckVhY2goIHRva2VucywgZnVuY3Rpb24oIHRva2VuLCBpICkge1xuXHRcdHZhciBuZXh0VG9rZW4gPSB0b2tlbnNbIGkgKyAxIF07XG5cblx0XHRzd2l0Y2ggKCB0b2tlbi50eXBlICkge1xuXG5cdFx0XHRjYXNlIFwiY29udGVudFwiOlxuXHRcdFx0Y2FzZSBcImdyZWF0ZXItdGhhbi1zaWduLWNvbnRlbnRcIjpcblx0XHRcdGNhc2UgXCJpbmxpbmUtc3RhcnRcIjpcblx0XHRcdGNhc2UgXCJpbmxpbmUtZW5kXCI6XG5cdFx0XHRjYXNlIFwib3RoZXItdGFnXCI6XG5cdFx0XHRjYXNlIFwib3RoZXItZWxlbWVudC1zdGFydFwiOlxuXHRcdFx0Y2FzZSBcIm90aGVyLWVsZW1lbnQtZW5kXCI6XG5cdFx0XHRjYXNlIFwiZ3JlYXRlciB0aGFuIHNpZ25cIjpcblx0XHRcdFx0aWYgKCAhIG5leHRUb2tlbiB8fCAoIGRlcHRoID09PSAwICYmICggbmV4dFRva2VuLnR5cGUgPT09IFwiYmxvY2stc3RhcnRcIiB8fCBuZXh0VG9rZW4udHlwZSA9PT0gXCJibG9jay1lbmRcIiApICkgKSB7XG5cdFx0XHRcdFx0Y3VycmVudEJsb2NrICs9IHRva2VuLnNyYztcblxuXHRcdFx0XHRcdGJsb2Nrcy5wdXNoKCBjdXJyZW50QmxvY2sgKTtcblx0XHRcdFx0XHRibG9ja1N0YXJ0VGFnID0gXCJcIjtcblx0XHRcdFx0XHRjdXJyZW50QmxvY2sgPSBcIlwiO1xuXHRcdFx0XHRcdGJsb2NrRW5kVGFnID0gXCJcIjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjdXJyZW50QmxvY2sgKz0gdG9rZW4uc3JjO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFwiYmxvY2stc3RhcnRcIjpcblx0XHRcdFx0aWYgKCBkZXB0aCAhPT0gMCApIHtcblx0XHRcdFx0XHRpZiAoIGN1cnJlbnRCbG9jay50cmltKCkgIT09IFwiXCIgKSB7XG5cdFx0XHRcdFx0XHRibG9ja3MucHVzaCggY3VycmVudEJsb2NrICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGN1cnJlbnRCbG9jayA9IFwiXCI7XG5cdFx0XHRcdFx0YmxvY2tFbmRUYWcgPSBcIlwiO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZGVwdGgrKztcblx0XHRcdFx0YmxvY2tTdGFydFRhZyA9IHRva2VuLnNyYztcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgXCJibG9jay1lbmRcIjpcblx0XHRcdFx0ZGVwdGgtLTtcblx0XHRcdFx0YmxvY2tFbmRUYWcgPSB0b2tlbi5zcmM7XG5cblx0XHRcdFx0Lypcblx0XHRcdFx0ICogV2UgdHJ5IHRvIG1hdGNoIHRoZSBtb3N0IGRlZXAgYmxvY2tzIHNvIGRpc2NhcmQgYW55IG90aGVyIGJsb2NrcyB0aGF0IGhhdmUgYmVlbiBzdGFydGVkIGJ1dCBub3Rcblx0XHRcdFx0ICogZmluaXNoZWQuXG5cdFx0XHRcdCAqL1xuXHRcdFx0XHRpZiAoIFwiXCIgIT09IGJsb2NrU3RhcnRUYWcgJiYgXCJcIiAhPT0gYmxvY2tFbmRUYWcgKSB7XG5cdFx0XHRcdFx0YmxvY2tzLnB1c2goIGJsb2NrU3RhcnRUYWcgKyBjdXJyZW50QmxvY2sgKyBibG9ja0VuZFRhZyApO1xuXHRcdFx0XHR9IGVsc2UgaWYgKCBcIlwiICE9PSBjdXJyZW50QmxvY2sudHJpbSgpICkge1xuXHRcdFx0XHRcdGJsb2Nrcy5wdXNoKCBjdXJyZW50QmxvY2sgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRibG9ja1N0YXJ0VGFnID0gXCJcIjtcblx0XHRcdFx0Y3VycmVudEJsb2NrID0gXCJcIjtcblx0XHRcdFx0YmxvY2tFbmRUYWcgPSBcIlwiO1xuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cblx0XHQvLyBIYW5kbGVzIEhUTUwgd2l0aCB0b28gbWFueSBjbG9zaW5nIHRhZ3MuXG5cdFx0aWYgKCBkZXB0aCA8IDAgKSB7XG5cdFx0XHRkZXB0aCA9IDA7XG5cdFx0fVxuXHR9ICk7XG5cblx0cmV0dXJuIGJsb2Nrcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGJsb2NrRWxlbWVudHM6IGJsb2NrRWxlbWVudHMsXG5cdGlubGluZUVsZW1lbnRzOiBpbmxpbmVFbGVtZW50cyxcblx0aXNCbG9ja0VsZW1lbnQ6IGlzQmxvY2tFbGVtZW50LFxuXHRpc0lubGluZUVsZW1lbnQ6IGlzSW5saW5lRWxlbWVudCxcblx0Z2V0QmxvY2tzOiBtZW1vaXplKCBnZXRCbG9ja3MgKSxcbn07XG4iLCJ2YXIgU3lsbGFibGVDb3VudFN0ZXAgPSByZXF1aXJlKCBcIi4vc3lsbGFibGVDb3VudFN0ZXAuanNcIiApO1xuXG52YXIgaXNVbmRlZmluZWQgPSByZXF1aXJlKCBcImxvZGFzaC9pc1VuZGVmaW5lZFwiICk7XG52YXIgZm9yRWFjaCA9IHJlcXVpcmUoIFwibG9kYXNoL2ZvckVhY2hcIiApO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBzeWxsYWJsZSBjb3VudCBpdGVyYXRvci5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gY29uZmlnIFRoZSBjb25maWcgb2JqZWN0IGNvbnRhaW5pbmcgYW4gYXJyYXkgd2l0aCBzeWxsYWJsZSBleGNsdXNpb25zLlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbnZhciBTeWxsYWJsZUNvdW50SXRlcmF0b3IgPSBmdW5jdGlvbiggY29uZmlnICkge1xuXHR0aGlzLmNvdW50U3RlcHMgPSBbXTtcblx0aWYgKCAhIGlzVW5kZWZpbmVkKCBjb25maWcgKSApIHtcblx0XHR0aGlzLmNyZWF0ZVN5bGxhYmxlQ291bnRTdGVwcyggY29uZmlnLmRldmlhdGlvbnMudm93ZWxzICk7XG5cdH1cbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN5bGxhYmxlIGNvdW50IHN0ZXAgb2JqZWN0IGZvciBlYWNoIGV4Y2x1c2lvbi5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gc3lsbGFibGVDb3VudHMgVGhlIG9iamVjdCBjb250YWluaW5nIGFsbCBleGNsdXNpb24gc3lsbGFibGVzIGluY2x1ZGluZyB0aGUgbXVsdGlwbGllcnMuXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuU3lsbGFibGVDb3VudEl0ZXJhdG9yLnByb3RvdHlwZS5jcmVhdGVTeWxsYWJsZUNvdW50U3RlcHMgPSBmdW5jdGlvbiggc3lsbGFibGVDb3VudHMgKSB7XG5cdGZvckVhY2goIHN5bGxhYmxlQ291bnRzLCBmdW5jdGlvbiggc3lsbGFibGVDb3VudFN0ZXAgKSB7XG5cdFx0dGhpcy5jb3VudFN0ZXBzLnB1c2goIG5ldyBTeWxsYWJsZUNvdW50U3RlcCggc3lsbGFibGVDb3VudFN0ZXAgKSApO1xuXHR9LmJpbmQoIHRoaXMgKSApO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGFsbCBhdmFpbGFibGUgY291bnQgc3RlcHMuXG4gKlxuICogQHJldHVybnMge0FycmF5fSBBbGwgYXZhaWxhYmxlIGNvdW50IHN0ZXBzLlxuICovXG5TeWxsYWJsZUNvdW50SXRlcmF0b3IucHJvdG90eXBlLmdldEF2YWlsYWJsZVN5bGxhYmxlQ291bnRTdGVwcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5jb3VudFN0ZXBzO1xufTtcblxuLyoqXG4gKiBDb3VudHMgdGhlIHN5bGxhYmxlcyBmb3IgYWxsIHRoZSBzdGVwcyBhbmQgcmV0dXJucyB0aGUgdG90YWwgc3lsbGFibGUgY291bnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHdvcmQgVGhlIHdvcmQgdG8gY291bnQgc3lsbGFibGVzIGluLlxuICogQHJldHVybnMge251bWJlcn0gVGhlIG51bWJlciBvZiBzeWxsYWJsZXMgZm91bmQgYmFzZWQgb24gZXhjbHVzaW9ucy5cbiAqL1xuU3lsbGFibGVDb3VudEl0ZXJhdG9yLnByb3RvdHlwZS5jb3VudFN5bGxhYmxlcyA9IGZ1bmN0aW9uKCB3b3JkICkge1xuXHR2YXIgc3lsbGFibGVDb3VudCA9IDA7XG5cdGZvckVhY2goIHRoaXMuY291bnRTdGVwcywgZnVuY3Rpb24oIHN0ZXAgKSB7XG5cdFx0c3lsbGFibGVDb3VudCArPSBzdGVwLmNvdW50U3lsbGFibGVzKCB3b3JkICk7XG5cdH0gKTtcblx0cmV0dXJuIHN5bGxhYmxlQ291bnQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bGxhYmxlQ291bnRJdGVyYXRvcjtcbiIsInZhciBpc1VuZGVmaW5lZCA9IHJlcXVpcmUoIFwibG9kYXNoL2lzVW5kZWZpbmVkXCIgKTtcblxudmFyIGFycmF5VG9SZWdleCA9IHJlcXVpcmUoIFwiLi4vc3RyaW5nUHJvY2Vzc2luZy9jcmVhdGVSZWdleEZyb21BcnJheS5qc1wiICk7XG5cbi8qKlxuICogQ29uc3RydWN0cyBhIGxhbmd1YWdlIHN5bGxhYmxlIHJlZ2V4IHRoYXQgY29udGFpbnMgYSByZWdleCBmb3IgbWF0Y2hpbmcgc3lsbGFibGUgZXhjbHVzaW9uLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBzeWxsYWJsZVJlZ2V4IFRoZSBvYmplY3QgY29udGFpbmluZyB0aGUgc3lsbGFibGUgZXhjbHVzaW9ucy5cbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgU3lsbGFibGVDb3VudFN0ZXAgPSBmdW5jdGlvbiggc3lsbGFibGVSZWdleCApIHtcblx0dGhpcy5faGFzUmVnZXggPSBmYWxzZTtcblx0dGhpcy5fcmVnZXggPSBcIlwiO1xuXHR0aGlzLl9tdWx0aXBsaWVyID0gXCJcIjtcblx0dGhpcy5jcmVhdGVSZWdleCggc3lsbGFibGVSZWdleCApO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGlmIGEgdmFsaWQgcmVnZXggaGFzIGJlZW4gc2V0LlxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIGEgcmVnZXggaGFzIGJlZW4gc2V0LCBmYWxzZSBpZiBub3QuXG4gKi9cblN5bGxhYmxlQ291bnRTdGVwLnByb3RvdHlwZS5oYXNSZWdleCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5faGFzUmVnZXg7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSByZWdleCBiYXNlZCBvbiB0aGUgZ2l2ZW4gc3lsbGFibGUgZXhjbHVzaW9ucywgYW5kIHNldHMgdGhlIG11bHRpcGxpZXIgdG8gdXNlLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBzeWxsYWJsZVJlZ2V4IFRoZSBvYmplY3QgY29udGFpbmluZyB0aGUgc3lsbGFibGUgZXhjbHVzaW9ucyBhbmQgbXVsdGlwbGllci5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5TeWxsYWJsZUNvdW50U3RlcC5wcm90b3R5cGUuY3JlYXRlUmVnZXggPSBmdW5jdGlvbiggc3lsbGFibGVSZWdleCApIHtcblx0aWYgKCAhIGlzVW5kZWZpbmVkKCBzeWxsYWJsZVJlZ2V4ICkgJiYgISBpc1VuZGVmaW5lZCggc3lsbGFibGVSZWdleC5mcmFnbWVudHMgKSApIHtcblx0XHR0aGlzLl9oYXNSZWdleCA9IHRydWU7XG5cdFx0dGhpcy5fcmVnZXggPSBhcnJheVRvUmVnZXgoIHN5bGxhYmxlUmVnZXguZnJhZ21lbnRzLCB0cnVlICk7XG5cdFx0dGhpcy5fbXVsdGlwbGllciA9IHN5bGxhYmxlUmVnZXguY291bnRNb2RpZmllcjtcblx0fVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBzdG9yZWQgcmVndWxhciBleHByZXNzaW9uLlxuICpcbiAqIEByZXR1cm5zIHtSZWdFeHB9IFRoZSBzdG9yZWQgcmVndWxhciBleHByZXNzaW9uLlxuICovXG5TeWxsYWJsZUNvdW50U3RlcC5wcm90b3R5cGUuZ2V0UmVnZXggPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuX3JlZ2V4O1xufTtcblxuLyoqXG4gKiBNYXRjaGVzIHN5bGxhYmxlIGV4Y2x1c2lvbnMgaW4gYSBnaXZlbiB3b3JkIGFuZCB0aGUgcmV0dXJucyB0aGUgbnVtYmVyIGZvdW5kIG11bHRpcGxpZWQgd2l0aCB0aGVcbiAqIGdpdmVuIG11bHRpcGxpZXIuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHdvcmQgVGhlIHdvcmQgdG8gbWF0Y2ggZm9yIHN5bGxhYmxlIGV4Y2x1c2lvbnMuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgYW1vdW50IG9mIHN5bGxhYmxlcyBmb3VuZC5cbiAqL1xuU3lsbGFibGVDb3VudFN0ZXAucHJvdG90eXBlLmNvdW50U3lsbGFibGVzID0gZnVuY3Rpb24oIHdvcmQgKSB7XG5cdGlmICggdGhpcy5faGFzUmVnZXggKSB7XG5cdFx0dmFyIG1hdGNoID0gd29yZC5tYXRjaCggdGhpcy5fcmVnZXggKSB8fCBbXTtcblx0XHRyZXR1cm4gbWF0Y2gubGVuZ3RoICogdGhpcy5fbXVsdGlwbGllcjtcblx0fVxuXHRyZXR1cm4gMDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3lsbGFibGVDb3VudFN0ZXA7XG4iLCJ2YXIgZmlsdGVyZWRQYXNzaXZlQXV4aWxpYXJpZXMgPSByZXF1aXJlKCBcIi4vcGFzc2l2ZXZvaWNlL2F1eGlsaWFyaWVzLmpzXCIgKSgpLmZpbHRlcmVkQXV4aWxpYXJpZXM7XG52YXIgbm90RmlsdGVyZWRQYXNzaXZlQXV4aWxpYXJpZXMgPSByZXF1aXJlKCBcIi4vcGFzc2l2ZXZvaWNlL2F1eGlsaWFyaWVzLmpzXCIgKSgpLm5vdEZpbHRlcmVkQXV4aWxpYXJpZXM7XG52YXIgdHJhbnNpdGlvbldvcmRzID0gcmVxdWlyZSggXCIuL3RyYW5zaXRpb25Xb3Jkcy5qc1wiICkoKS5zaW5nbGVXb3JkcztcblxuLyoqXG4gKiBSZXR1cm5zIGFuIGFycmF5IHdpdGggZXhjZXB0aW9ucyBmb3IgdGhlIGtleXdvcmQgc3VnZ2VzdGlvbiByZXNlYXJjaGVyLlxuICogQHJldHVybnMge0FycmF5fSBUaGUgYXJyYXkgZmlsbGVkIHdpdGggZXhjZXB0aW9ucy5cbiAqL1xuXG52YXIgYXJ0aWNsZXMgPSBbIFwidGhlXCIsIFwiYW5cIiwgXCJhXCIgXTtcbnZhciBudW1lcmFscyA9IFsgXCJvbmVcIiwgXCJ0d29cIiwgXCJ0aHJlZVwiLCBcImZvdXJcIiwgXCJmaXZlXCIsIFwic2l4XCIsIFwic2V2ZW5cIiwgXCJlaWdodFwiLCBcIm5pbmVcIiwgXCJ0ZW5cIiwgXCJlbGV2ZW5cIiwgXCJ0d2VsdmVcIiwgXCJ0aGlydGVlblwiLFxuXHRcImZvdXJ0ZWVuXCIsIFwiZmlmdGVlblwiLCBcInNpeHRlZW5cIiwgXCJzZXZlbnRlZW5cIiwgXCJlaWdodGVlblwiLCBcIm5pbmV0ZWVuXCIsIFwidHdlbnR5XCIsIFwiZmlyc3RcIiwgXCJzZWNvbmRcIiwgXCJ0aGlyZFwiLCBcImZvdXJ0aFwiLFxuXHRcImZpZnRoXCIsIFwic2l4dGhcIiwgXCJzZXZlbnRoXCIsIFwiZWlnaHRoXCIsIFwibmludGhcIiwgXCJ0ZW50aFwiLCBcImVsZXZlbnRoXCIsIFwidHdlbGZ0aFwiLCBcInRoaXJ0ZWVudGhcIiwgXCJmb3VydGVlbnRoXCIsIFwiZmlmdGVlbnRoXCIsXG5cdFwic2l4dGVlbnRoXCIsIFwic2V2ZW50ZWVudGhcIiwgXCJlaWdodGVlbnRoXCIsIFwibmluZXRlZW50aFwiLCBcInR3ZW50aWV0aFwiLCBcImh1bmRyZWRcIiwgXCJodW5kcmVkc1wiLCBcInRob3VzYW5kXCIsIFwidGhvdXNhbmRzXCIsXG5cdFwibWlsbGlvblwiLCBcIm1pbGxpb25cIiwgXCJiaWxsaW9uXCIsIFwiYmlsbGlvbnNcIiBdO1xudmFyIHBlcnNvbmFsUHJvbm91bnNOb21pbmF0aXZlID0gWyBcImlcIiwgXCJ5b3VcIiwgXCJoZVwiLCBcInNoZVwiLCBcIml0XCIsIFwid2VcIiwgXCJ0aGV5XCIgXTtcbnZhciBwZXJzb25hbFByb25vdW5zQWNjdXNhdGl2ZSA9IFsgXCJtZVwiLCBcImhpbVwiLCBcImhlclwiLCBcInVzXCIsIFwidGhlbVwiIF07XG52YXIgZGVtb25zdHJhdGl2ZVByb25vdW5zID0gWyBcInRoaXNcIiwgXCJ0aGF0XCIsIFwidGhlc2VcIiwgXCJ0aG9zZVwiIF07XG52YXIgcG9zc2Vzc2l2ZVByb25vdW5zID0gWyBcIm15XCIsIFwieW91clwiLCBcImhpc1wiLCBcImhlclwiLCBcIml0c1wiLCBcInRoZWlyXCIsIFwib3VyXCIsIFwibWluZVwiLCBcInlvdXJzXCIsIFwiaGVyc1wiLCBcInRoZWlyc1wiLCBcIm91cnNcIiBdO1xudmFyIHF1YW50aWZpZXJzID0gWyBcImFsbFwiLCBcInNvbWVcIiwgXCJtYW55XCIsIFwiZmV3XCIsIFwibG90XCIsIFwibG90c1wiLCBcInRvbnNcIiwgXCJiaXRcIiwgXCJub1wiLCBcImV2ZXJ5XCIsIFwiZW5vdWdoXCIsIFwibGl0dGxlXCIsIFwibGVzc1wiLCBcIm11Y2hcIiwgXCJtb3JlXCIsIFwibW9zdFwiLFxuXHRcInBsZW50eVwiLCBcInNldmVyYWxcIiwgXCJmZXdcIiwgXCJmZXdlclwiLCBcIm1hbnlcIiwgXCJraW5kXCIgXTtcbnZhciByZWZsZXhpdmVQcm9ub3VucyA9IFsgXCJteXNlbGZcIiwgXCJ5b3Vyc2VsZlwiLCBcImhpbXNlbGZcIiwgXCJoZXJzZWxmXCIsIFwiaXRzZWxmXCIsIFwib25lc2VsZlwiLCBcIm91cnNlbHZlc1wiLCBcInlvdXJzZWx2ZXNcIiwgXCJ0aGVtc2VsdmVzXCIgXTtcbnZhciBpbmRlZmluaXRlUHJvbm91bnMgPSBbIFwibm9uZVwiLCBcIm5vYm9keVwiLCBcImV2ZXJ5b25lXCIsIFwiZXZlcnlib2R5XCIsIFwic29tZW9uZVwiLCBcInNvbWVib2R5XCIsIFwiYW55b25lXCIsIFwiYW55Ym9keVwiLCBcIm5vdGhpbmdcIixcblx0XCJldmVyeXRoaW5nXCIsIFwic29tZXRoaW5nXCIsIFwiYW55dGhpbmdcIiwgXCJlYWNoXCIsIFwiYW5vdGhlclwiLCBcIm90aGVyXCIsIFwid2hhdGV2ZXJcIiwgXCJ3aGljaGV2ZXJcIiwgXCJ3aG9ldmVyXCIsIFwid2hvbWV2ZXJcIixcblx0XCJ3aG9tc29ldmVyXCIsIFwid2hvc29ldmVyXCIsIFwib3RoZXJzXCIsIFwibmVpdGhlclwiLCBcImJvdGhcIiwgXCJlaXRoZXJcIiwgXCJhbnlcIiwgXCJzdWNoXCIgXTtcbnZhciBpbmRlZmluaXRlUHJvbm91bnNQb3NzZXNzaXZlICA9IFsgXCJvbmUnc1wiLCBcIm5vYm9keSdzXCIsIFwiZXZlcnlvbmUnc1wiLCBcImV2ZXJ5Ym9keSdzXCIsIFwic29tZW9uZSdzXCIsIFwic29tZWJvZHknc1wiLCBcImFueW9uZSdzXCIsXG5cdFwiYW55Ym9keSdzXCIsIFwibm90aGluZydzXCIsIFwiZXZlcnl0aGluZydzXCIsIFwic29tZXRoaW5nJ3NcIiwgXCJhbnl0aGluZydzXCIsIFwid2hvZXZlcidzXCIsIFwib3RoZXJzJ1wiLCBcIm90aGVyJ3NcIiwgXCJhbm90aGVyJ3NcIixcblx0XCJuZWl0aGVyJ3NcIiwgXCJlaXRoZXInc1wiIF07XG5cbnZhciBpbnRlcnJvZ2F0aXZlRGV0ZXJtaW5lcnMgPSBbIFwid2hpY2hcIiwgXCJ3aGF0XCIsIFwid2hvc2VcIiBdO1xudmFyIGludGVycm9nYXRpdmVQcm9ub3VucyA9IFsgXCJ3aG9cIiwgXCJ3aG9tXCIgXTtcbnZhciBpbnRlcnJvZ2F0aXZlUHJvQWR2ZXJicyA9IFsgXCJ3aGVyZVwiLCBcIndoaXRoZXJcIiwgXCJ3aGVuY2VcIiwgXCJob3dcIiwgXCJ3aHlcIiwgXCJ3aGV0aGVyXCIsIFwid2hlcmV2ZXJcIiwgXCJ3aG9tZXZlclwiLCBcIndoZW5ldmVyXCIsXG5cdFwiaG93ZXZlclwiLCBcIndoeWV2ZXJcIiwgXCJ3aG9ldmVyXCIsIFwid2hhdGV2ZXJcIiwgXCJ3aGVyZXNvZXZlclwiLCBcIndob21zb2V2ZXJcIiwgXCJ3aGVuc29ldmVyXCIsIFwiaG93c29ldmVyXCIsIFwid2h5c29ldmVyXCIsIFwid2hvc29ldmVyXCIsXG5cdFwid2hhdHNvZXZlclwiLCBcIndoZXJlc29cIiwgXCJ3aG9tc29cIiwgXCJ3aGVuc29cIiwgXCJob3dzb1wiLCBcIndoeXNvXCIsIFwid2hvc29cIiwgXCJ3aGF0c29cIiBdO1xudmFyIHByb25vbWluYWxBZHZlcmJzID0gWyBcInRoZXJlZm9yXCIsIFwidGhlcmVpblwiLCBcImhlcmVieVwiLCBcImhlcmV0b1wiLCBcIndoZXJlaW5cIiwgXCJ0aGVyZXdpdGhcIiwgXCJoZXJld2l0aFwiLCBcIndoZXJld2l0aFwiLCBcInRoZXJlYnlcIiBdO1xudmFyIGxvY2F0aXZlQWR2ZXJicyA9IFsgXCJ0aGVyZVwiLCBcImhlcmVcIiwgXCJ3aGl0aGVyXCIsIFwidGhpdGhlclwiLCBcImhpdGhlclwiLCBcIndoZW5jZVwiLCBcInRoZW5jZVwiLCBcImhlbmNlXCIgXTtcbnZhciBhZHZlcmJpYWxHZW5pdGl2ZXMgPSBbIFwiYWx3YXlzXCIsIFwiYWZ0ZXJ3YXJkc1wiLCBcInRvd2FyZHNcIiwgXCJvbmNlXCIsIFwidHdpY2VcIiwgXCJ0aHJpY2VcIiwgXCJhbWlkc3RcIiwgXCJhbW9uZ3N0XCIsIFwibWlkc3RcIiwgXCJ3aGlsc3RcIiBdO1xudmFyIG90aGVyQXV4aWxpYXJpZXMgPSBbIFwiY2FuXCIsIFwiY2Fubm90XCIsIFwiY2FuJ3RcIiwgXCJjb3VsZFwiLCBcImNvdWxkbid0XCIsIFwiY291bGQndmVcIiwgXCJkYXJlXCIsIFwiZGFyZXNcIiwgXCJkYXJlZFwiLCBcImRhcmluZ1wiLCBcImRvXCIsXG5cdFwiZG9uJ3RcIiwgXCJkb2VzXCIsIFwiZG9lc24ndFwiLCBcImRpZFwiLCBcImRpZG4ndFwiLCBcImRvaW5nXCIsIFwiZG9uZVwiLCBcImhhdmVcIiwgXCJoYXZlbid0XCIsIFwiaGFkXCIsIFwiaGFkbid0XCIsIFwiaGFzXCIsIFwiaGFzbid0XCIsIFwiaGF2aW5nXCIsXG5cdFwiaSd2ZVwiLCBcInlvdSd2ZVwiLCBcIndlJ3ZlXCIsIFwidGhleSd2ZVwiLCBcImknZFwiLCBcInlvdSdkXCIsIFwiaGUnZFwiLCBcInNoZSdkXCIsIFwiaXQnZFwiLCBcIndlJ2RcIiwgXCJ0aGV5J2RcIiwgXCJ3b3VsZFwiLCBcIndvdWxkbid0XCIsXG5cdFwid291bGQndmVcIiwgXCJtYXlcIiwgXCJtaWdodFwiLCBcIm11c3RcIiwgXCJuZWVkXCIsIFwibmVlZG4ndFwiLCBcIm5lZWRzXCIsIFwib3VnaHRcIiwgXCJzaGFsbFwiLCBcInNoYWxsbid0XCIsIFwic2hhbid0XCIsIFwic2hvdWxkXCIsXG5cdFwic2hvdWxkbid0XCIsIFwid2lsbFwiLCBcIndvbid0XCIsIFwiaSdsbFwiLCBcInlvdSdsbFwiLCBcImhlJ2xsXCIsIFwic2hlJ2xsXCIsIFwiaXQnbGxcIiwgXCJ3ZSdsbFwiLCBcInRoZXknbGxcIiwgXCJ0aGVyZSdzXCIsIFwidGhlcmUncmVcIixcblx0XCJ0aGVyZSdsbFwiLCBcImhlcmUnc1wiLCBcImhlcmUncmVcIiwgXCJ0aGVyZSdsbFwiIF07XG52YXIgY29wdWxhID0gWyBcImFwcGVhclwiLCBcImFwcGVhcnNcIiwgXCJhcHBlYXJpbmdcIiwgXCJhcHBlYXJlZFwiLCBcImJlY29tZVwiLCBcImJlY29tZXNcIiwgXCJiZWNvbWluZ1wiLCBcImJlY2FtZVwiLCBcImNvbWVcIiwgXCJjb21lc1wiLFxuXHRcImNvbWluZ1wiLCBcImNhbWVcIiwgXCJrZWVwXCIsIFwia2VlcHNcIiwgXCJrZXB0XCIsIFwia2VlcGluZ1wiLCBcInJlbWFpblwiLCBcInJlbWFpbnNcIiwgXCJyZW1haW5pbmdcIiwgXCJyZW1haW5lZFwiLCBcInN0YXlcIixcblx0XCJzdGF5c1wiLCBcInN0YXllZFwiLCBcInN0YXlpbmdcIiwgXCJ0dXJuXCIsIFwidHVybnNcIiwgXCJ0dXJuZWRcIiBdO1xuXG52YXIgcHJlcG9zaXRpb25zID0gWyBcImluXCIsIFwiZnJvbVwiLCBcIndpdGhcIiwgXCJ1bmRlclwiLCBcInRocm91Z2hvdXRcIiwgXCJhdG9wXCIsIFwiZm9yXCIsIFwib25cIiwgXCJ1bnRpbFwiLCBcIm9mXCIsIFwidG9cIiwgXCJhYm9hcmRcIiwgXCJhYm91dFwiLFxuXHRcImFib3ZlXCIsIFwiYWJyZWFzdFwiLCBcImFic2VudFwiLCBcImFjcm9zc1wiLCBcImFkamFjZW50XCIsIFwiYWZ0ZXJcIiwgXCJhZ2FpbnN0XCIsIFwiYWxvbmdcIiwgXCJhbG9uZ3NpZGVcIiwgXCJhbWlkXCIsIFwibWlkc3RcIiwgXCJtaWRcIixcblx0XCJhbW9uZ1wiLCBcImFwcm9wb3NcIiwgXCJhcHVkXCIsIFwiYXJvdW5kXCIsIFwiYXNcIiwgXCJhc3RyaWRlXCIsIFwiYXRcIiwgXCJvbnRvcFwiLCBcImJlZm9yZVwiLCBcImFmb3JlXCIsIFwidG9mb3JlXCIsIFwiYmVoaW5kXCIsIFwiYWhpbmRcIixcblx0XCJiZWxvd1wiLCBcImFibG93XCIsIFwiYmVuZWF0aFwiLCBcIm5lYXRoXCIsIFwiYmVzaWRlXCIsIFwiYmVzaWRlc1wiLCBcImJldHdlZW5cIiwgXCJhdHdlZW5cIiwgXCJiZXlvbmRcIiwgXCJheW9uZFwiLCBcImJ1dFwiLCBcImJ5XCIsIFwiY2hlelwiLFxuXHRcImNpcmNhXCIsIFwiY29tZVwiLCBcImRlc3BpdGVcIiwgXCJzcGl0ZVwiLCBcImRvd25cIiwgXCJkdXJpbmdcIiwgXCJleGNlcHRcIiwgXCJpbnRvXCIsIFwibGVzc1wiLCBcImxpa2VcIiwgXCJtaW51c1wiLCBcIm5lYXJcIiwgXCJuZWFyZXJcIixcblx0XCJuZWFyZXN0XCIsIFwiYW5lYXJcIiwgXCJub3R3aXRoc3RhbmRpbmdcIiwgXCJvZmZcIiwgXCJvbnRvXCIsIFwib3Bwb3NpdGVcIiwgXCJvdXRcIiwgXCJvdXRlblwiLCBcIm92ZXJcIiwgXCJwYXN0XCIsIFwicGVyXCIsIFwicHJlXCIsIFwicXVhXCIsXG5cdFwic2Fuc1wiLCBcInNhdWZcIiwgXCJzaW5jZVwiLCBcInNpdGhlbmNlXCIsIFwidGhhblwiLCBcInRocm91Z2hcIiwgXCJ0aHJ1XCIsIFwidHJ1b3V0XCIsIFwidG93YXJkXCIsIFwidW5kZXJuZWF0aFwiLCBcInVubGlrZVwiLCBcInVudGlsXCIsXG5cdFwidXBcIiwgXCJ1cG9uXCIsIFwidXBzaWRlXCIsIFwidmVyc3VzXCIsIFwidmlhXCIsIFwidmlzLcOgLXZpc1wiLCBcIndpdGhvdXRcIiwgXCJhZ29cIiwgXCJhcGFydFwiLCBcImFzaWRlXCIsIFwiYXNsYW50XCIsIFwiYXdheVwiLCBcIndpdGhhbFwiIF07XG5cbi8vIE1hbnkgcHJlcG9zaXRpb25hbCBhZHZlcmJzIGFyZSBhbHJlYWR5IGxpc3RlZCBhcyBwcmVwb3NpdGlvbi5cbnZhciBwcmVwb3NpdGlvbmFsQWR2ZXJicyA9IFsgXCJiYWNrXCIsIFwid2l0aGluXCIsIFwiZm9yd2FyZFwiLCBcImJhY2t3YXJkXCIsIFwiYWhlYWRcIiBdO1xuXG52YXIgY29vcmRpbmF0aW5nQ29uanVuY3Rpb25zID0gWyBcInNvXCIsIFwiYW5kXCIsIFwibm9yXCIsIFwiYnV0XCIsIFwib3JcIiwgXCJ5ZXRcIiwgXCJmb3JcIiBdO1xuXG4vLyAnUmF0aGVyJyBpcyBwYXJ0IG9mICdyYXRoZXIuLi50aGFuJywgJ3Nvb25lcicgaXMgcGFydCBvZiAnbm8gc29vbmVyLi4udGhhbicsICdqdXN0JyBpcyBwYXJ0IG9mICdqdXN0IGFzLi4uc28nLFxuLy8gJ09ubHknIGlzIHBhcnQgb2YgJ25vdCBvbmx5Li4uYnV0IGFsc28nLlxudmFyIGNvcnJlbGF0aXZlQ29uanVuY3Rpb25zID0gWyBcInJhdGhlclwiLCBcInNvb25lclwiLCBcImp1c3RcIiwgXCJvbmx5XCIgXTtcbnZhciBzdWJvcmRpbmF0aW5nQ29uanVuY3Rpb25zID0gWyBcImFmdGVyXCIsIFwiYWx0aG91Z2hcIiwgXCJ3aGVuXCIsIFwiYXNcIiwgXCJpZlwiLCBcInRob3VnaFwiLCBcImJlY2F1c2VcIiwgXCJiZWZvcmVcIiwgXCJldmVuXCIsIFwic2luY2VcIiwgXCJ1bmxlc3NcIixcblx0XCJ3aGVyZWFzXCIsIFwid2hpbGVcIiBdO1xuXG4vLyBUaGVzZSB2ZXJicyBhcmUgZnJlcXVlbnRseSB1c2VkIGluIGludGVydmlld3MgdG8gaW5kaWNhdGUgcXVlc3Rpb25zIGFuZCBhbnN3ZXJzLlxuLy8gJ0NsYWltJywnY2xhaW1zJywgJ3N0YXRlJyBhbmQgJ3N0YXRlcycgYXJlIG5vdCBpbmNsdWRlZCwgYmVjYXVzZSB0aGVzZSB3b3JkcyBhcmUgYWxzbyBub3Vucy5cbnZhciBpbnRlcnZpZXdWZXJicyA9IFsgXCJzYXlcIiwgXCJzYXlzXCIsIFwic2FpZFwiLCBcInNheWluZ1wiLCBcImNsYWltZWRcIiwgXCJhc2tcIiwgXCJhc2tzXCIsIFwiYXNrZWRcIiwgXCJhc2tpbmdcIiwgXCJzdGF0ZWRcIiwgXCJzdGF0aW5nXCIsXG5cdFwiZXhwbGFpblwiLCBcImV4cGxhaW5zXCIsIFwiZXhwbGFpbmVkXCIsIFwidGhpbmtcIiwgXCJ0aGlua3NcIiBdO1xuXG4vLyBUaGVzZSB0cmFuc2l0aW9uIHdvcmRzIHdlcmUgbm90IGluY2x1ZGVkIGluIHRoZSBsaXN0IGZvciB0aGUgdHJhbnNpdGlvbiB3b3JkIGFzc2Vzc21lbnQgZm9yIHZhcmlvdXMgcmVhc29ucy5cbnZhciBhZGRpdGlvbmFsVHJhbnNpdGlvbldvcmRzID0gWyBcImFuZFwiLCBcIm9yXCIsIFwiYWJvdXRcIiwgXCJhYnNvbHV0ZWx5XCIsIFwiYWdhaW5cIiwgXCJkZWZpbml0ZWx5XCIsIFwiZXRlcm5hbGx5XCIsIFwiZXhwcmVzc2l2ZWx5XCIsXG5cdFwiZXhwcmVzc2x5XCIsIFwiZXh0cmVtZWx5XCIsIFwiaW1tZWRpYXRlbHlcIiwgXCJpbmNsdWRpbmdcIiwgXCJpbnN0YW50bHlcIiwgXCJuYW1lbHlcIiwgXCJuYXR1cmFsbHlcIiwgXCJuZXh0XCIsIFwibm90YWJseVwiLCBcIm5vd1wiLCBcIm5vd2FkYXlzXCIsXG5cdFwib3JkaW5hcmlseVwiLCBcInBvc2l0aXZlbHlcIiwgXCJ0cnVseVwiLCBcInVsdGltYXRlbHlcIiwgXCJ1bmlxdWVseVwiLCBcInVzdWFsbHlcIiwgXCJhbG1vc3RcIiwgXCJmaXJzdFwiLCBcInNlY29uZFwiLCBcInRoaXJkXCIsIFwibWF5YmVcIixcblx0XCJwcm9iYWJseVwiLCBcImdyYW50ZWRcIiwgXCJpbml0aWFsbHlcIiwgXCJvdmVyYWxsXCIsIFwidG9vXCIsIFwiYWN0dWFsbHlcIiwgXCJhbHJlYWR5XCIsIFwiZS5nXCIsIFwiaS5lXCIsIFwib2Z0ZW5cIiwgXCJyZWd1bGFybHlcIiwgXCJzaW1wbHlcIixcblx0XCJvcHRpb25hbGx5XCIsIFwicGVyaGFwc1wiLCBcInNvbWV0aW1lc1wiLCBcImxpa2VseVwiLCBcIm5ldmVyXCIsIFwiZXZlclwiLCBcImVsc2VcIiwgXCJpbmFzbXVjaFwiLCBcInByb3ZpZGVkXCIsIFwiY3VycmVudGx5XCIsIFwiaW5jaWRlbnRhbGx5XCIsXG5cdFwiZWxzZXdoZXJlXCIsIFwiZm9sbG93aW5nXCIsIFwicGFydGljdWxhclwiLCBcInJlY2VudGx5XCIsIFwicmVsYXRpdmVseVwiLCBcImYuaVwiLCBcImNsZWFybHlcIiwgXCJhcHBhcmVudGx5XCIgXTtcblxudmFyIGludGVuc2lmaWVycyA9IFsgXCJoaWdobHlcIiwgXCJ2ZXJ5XCIsIFwicmVhbGx5XCIsIFwiZXh0cmVtZWx5XCIsIFwiYWJzb2x1dGVseVwiLCBcImNvbXBsZXRlbHlcIiwgXCJ0b3RhbGx5XCIsIFwidXR0ZXJseVwiLCBcInF1aXRlXCIsXG5cdFwic29tZXdoYXRcIiwgXCJzZXJpb3VzbHlcIiwgXCJmYWlybHlcIiwgXCJmdWxseVwiLCBcImFtYXppbmdseVwiIF07XG5cbi8vIFRoZXNlIHZlcmJzIGNvbnZleSBsaXR0bGUgbWVhbmluZy4gJ1Nob3cnLCAnc2hvd3MnLCAndXNlcycsIFwibWVhbmluZ1wiIGFyZSBub3QgaW5jbHVkZWQsIGJlY2F1c2UgdGhlc2Ugd29yZHMgY291bGQgYmUgcmVsZXZhbnQgbm91bnMuXG52YXIgZGVsZXhpY2FsaXNlZFZlcmJzID0gWyBcInNlZW1cIiwgXCJzZWVtc1wiLCBcInNlZW1lZFwiLCBcInNlZW1pbmdcIiwgXCJsZXRcIiwgXCJsZXQnc1wiLCBcImxldHNcIiwgXCJsZXR0aW5nXCIsIFwibWFrZVwiLCBcIm1ha2luZ1wiLCBcIm1ha2VzXCIsXG5cdFwibWFkZVwiLCBcIndhbnRcIiwgXCJzaG93aW5nXCIsIFwic2hvd2VkXCIsIFwic2hvd25cIiwgXCJnb1wiLCBcImdvZXNcIiwgXCJnb2luZ1wiLCBcIndlbnRcIiwgXCJnb25lXCIsIFwidGFrZVwiLCBcInRha2VzXCIsIFwidG9va1wiLCBcInRha2VuXCIsIFwic2V0XCIsIFwic2V0c1wiLFxuXHRcInNldHRpbmdcIiwgXCJwdXRcIiwgXCJwdXRzXCIsIFwicHV0dGluZ1wiLCBcInVzZVwiLCBcInVzaW5nXCIsIFwidXNlZFwiLCBcInRyeVwiLCBcInRyaWVzXCIsIFwidHJpZWRcIiwgXCJ0cnlpbmdcIiwgXCJtZWFuXCIsIFwibWVhbnNcIiwgXCJtZWFudFwiLFxuXHRcImNhbGxlZFwiLCBcImJhc2VkXCIsIFwiYWRkXCIsIFwiYWRkc1wiLCBcImFkZGluZ1wiLCBcImFkZGVkXCIsIFwiY29udGFpblwiLCBcImNvbnRhaW5zXCIsIFwiY29udGFpbmluZ1wiLCBcImNvbnRhaW5lZFwiIF07XG5cbi8vIFRoZXNlIGFkamVjdGl2ZXMgYW5kIGFkdmVyYnMgYXJlIHNvIGdlbmVyYWwsIHRoZXkgc2hvdWxkIG5ldmVyIGJlIHN1Z2dlc3RlZCBhcyBhIChzaW5nbGUpIGtleXdvcmQuXG4vLyBLZXl3b3JkIGNvbWJpbmF0aW9ucyBjb250YWluaW5nIHRoZXNlIGFkamVjdGl2ZXMvYWR2ZXJicyBhcmUgZmluZS5cbnZhciBnZW5lcmFsQWRqZWN0aXZlc0FkdmVyYnMgPSBbIFwibmV3XCIsIFwibmV3ZXJcIiwgXCJuZXdlc3RcIiwgXCJvbGRcIiwgXCJvbGRlclwiLCBcIm9sZGVzdFwiLCBcInByZXZpb3VzXCIsIFwiZ29vZFwiLCBcIndlbGxcIiwgXCJiZXR0ZXJcIiwgXCJiZXN0XCIsXG5cdFwiYmlnXCIsIFwiYmlnZ2VyXCIsIFwiYmlnZ2VzdFwiLCBcImVhc3lcIiwgXCJlYXNpZXJcIiwgXCJlYXNpZXN0XCIsIFwiZmFzdFwiLCBcImZhc3RlclwiLCBcImZhc3Rlc3RcIiwgXCJmYXJcIiwgXCJoYXJkXCIsIFwiaGFyZGVyXCIsIFwiaGFyZGVzdFwiLFxuXHRcImxlYXN0XCIsIFwib3duXCIsIFwibGFyZ2VcIiwgXCJsYXJnZXJcIiwgXCJsYXJnZXN0XCIsIFwibG9uZ1wiLCBcImxvbmdlclwiLCBcImxvbmdlc3RcIiwgXCJsb3dcIiwgXCJsb3dlclwiLCBcImxvd2VzdFwiLCBcImhpZ2hcIiwgXCJoaWdoZXJcIixcblx0XCJoaWdoZXN0XCIsIFwicmVndWxhclwiLCBcInNpbXBsZVwiLCBcInNpbXBsZXJcIiwgXCJzaW1wbGVzdFwiLCBcInNtYWxsXCIsIFwic21hbGxlclwiLCBcInNtYWxsZXN0XCIsIFwidGlueVwiLCBcInRpbmllclwiLCBcInRpbmllc3RcIixcblx0XCJzaG9ydFwiLCBcInNob3J0ZXJcIiwgXCJzaG9ydGVzdFwiLCBcIm1haW5cIiwgXCJhY3R1YWxcIiwgXCJuaWNlXCIsIFwibmljZXJcIiwgXCJuaWNlc3RcIiwgXCJyZWFsXCIsIFwic2FtZVwiLCBcImFibGVcIiwgXCJjZXJ0YWluXCIsIFwidXN1YWxcIixcblx0XCJzby1jYWxsZWRcIiwgXCJtYWlubHlcIiwgXCJtb3N0bHlcIiwgXCJyZWNlbnRcIiwgXCJhbnltb3JlXCIsIFwiY29tcGxldGVcIiwgXCJsYXRlbHlcIiwgXCJwb3NzaWJsZVwiLCBcImNvbW1vbmx5XCIsIFwiY29uc3RhbnRseVwiLFxuXHRcImNvbnRpbnVhbGx5XCIsIFwiZGlyZWN0bHlcIiwgXCJlYXNpbHlcIiwgXCJuZWFybHlcIiwgXCJzbGlnaHRseVwiLCBcInNvbWV3aGVyZVwiLCBcImVzdGltYXRlZFwiLCBcImxhdGVzdFwiLCBcImRpZmZlcmVudFwiLCBcInNpbWlsYXJcIixcblx0XCJ3aWRlbHlcIiwgXCJiYWRcIiwgXCJ3b3JzZVwiLCBcIndvcnN0XCIsIFwiZ3JlYXRcIiBdO1xuXG52YXIgaW50ZXJqZWN0aW9ucyA9IFsgXCJvaFwiLCBcIndvd1wiLCBcInR1dC10dXRcIiwgXCJ0c2stdHNrXCIsIFwidWdoXCIsIFwid2hld1wiLCBcInBoZXdcIiwgXCJ5ZWFoXCIsIFwieWVhXCIsIFwic2hoXCIsIFwib29wc1wiLCBcIm91Y2hcIiwgXCJhaGFcIixcblx0XCJ5aWtlc1wiIF07XG5cbi8vIFRoZXNlIHdvcmRzIGFuZCBhYmJyZXZpYXRpb25zIGFyZSBmcmVxdWVudGx5IHVzZWQgaW4gcmVjaXBlcyBpbiBsaXN0cyBvZiBpbmdyZWRpZW50cy5cbnZhciByZWNpcGVXb3JkcyA9IFsgXCJ0YnNcIiwgXCJ0YnNwXCIsIFwic3BrXCIsIFwibGJcIiwgXCJxdFwiLCBcInBrXCIsIFwiYnVcIiwgXCJvelwiLCBcInB0XCIsIFwibW9kXCIsIFwiZG96XCIsIFwiaHJcIiwgXCJmLmdcIiwgXCJtbFwiLCBcImRsXCIsIFwiY2xcIixcblx0XCJsXCIsIFwibWdcIiwgXCJnXCIsIFwia2dcIiwgXCJxdWFydFwiIF07XG5cbi8vICdQZW9wbGUnIHNob3VsZCBvbmx5IGJlIHJlbW92ZWQgaW4gY29tYmluYXRpb24gd2l0aCAnc29tZScsICdtYW55JyBhbmQgJ2ZldycgKGFuZCBpcyB0aGVyZWZvcmUgbm90IHlldCBpbmNsdWRlZCBpbiB0aGUgbGlzdCBiZWxvdykuXG52YXIgdmFndWVOb3VucyA9IFsgXCJ0aGluZ1wiLCBcInRoaW5nc1wiLCBcIndheVwiLCBcIndheXNcIiwgXCJtYXR0ZXJcIiwgXCJjYXNlXCIsIFwibGlrZWxpaG9vZFwiLCBcIm9uZXNcIiwgXCJwaWVjZVwiLCBcInBpZWNlc1wiLCBcInN0dWZmXCIsIFwidGltZXNcIixcblx0XCJwYXJ0XCIsIFwicGFydHNcIiwgXCJwZXJjZW50XCIsIFwiaW5zdGFuY2VcIiwgXCJpbnN0YW5jZXNcIiwgXCJhc3BlY3RcIiwgXCJhc3BlY3RzXCIsIFwiaXRlbVwiLCBcIml0ZW1zXCIsIFwiaWRlYVwiLCBcInRoZW1lXCIsXG5cdFwicGVyc29uXCIgXTtcblxuLy8gJ05vJyBpcyBhbHJlYWR5IGluY2x1ZGVkIGluIHRoZSBxdWFudGlmaWVyIGxpc3QuXG52YXIgbWlzY2VsbGFuZW91cyA9IFsgXCJub3RcIiwgXCJ5ZXNcIiwgXCJyaWRcIiwgXCJzdXJlXCIsIFwidG9wXCIsIFwiYm90dG9tXCIsIFwib2tcIiwgXCJva2F5XCIsIFwiYW1lblwiLCBcImFrYVwiLCBcIiVcIiBdO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdGFydGljbGVzOiBhcnRpY2xlcyxcblx0XHRwZXJzb25hbFByb25vdW5zOiBwZXJzb25hbFByb25vdW5zTm9taW5hdGl2ZS5jb25jYXQoIHBlcnNvbmFsUHJvbm91bnNBY2N1c2F0aXZlLCBwb3NzZXNzaXZlUHJvbm91bnMgKSxcblx0XHRwcmVwb3NpdGlvbnM6IHByZXBvc2l0aW9ucyxcblx0XHRkZW1vbnN0cmF0aXZlUHJvbm91bnM6IGRlbW9uc3RyYXRpdmVQcm9ub3Vucyxcblx0XHRjb25qdW5jdGlvbnM6IGNvb3JkaW5hdGluZ0Nvbmp1bmN0aW9ucy5jb25jYXQoIHN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbnMgKSxcblx0XHR2ZXJiczogZmlsdGVyZWRQYXNzaXZlQXV4aWxpYXJpZXMuY29uY2F0KCBub3RGaWx0ZXJlZFBhc3NpdmVBdXhpbGlhcmllcywgb3RoZXJBdXhpbGlhcmllcywgY29wdWxhLCBpbnRlcnZpZXdWZXJicywgZGVsZXhpY2FsaXNlZFZlcmJzICksXG5cdFx0cXVhbnRpZmllcnM6IHF1YW50aWZpZXJzLFxuXHRcdHJlbGF0aXZlUHJvbm91bnM6IGludGVycm9nYXRpdmVEZXRlcm1pbmVycy5jb25jYXQoIGludGVycm9nYXRpdmVQcm9ub3VucywgaW50ZXJyb2dhdGl2ZVByb0FkdmVyYnMgKSxcblx0XHRwYXNzaXZlQXV4aWxpYXJpZXM6IGZpbHRlcmVkUGFzc2l2ZUF1eGlsaWFyaWVzLFxuXHRcdHRyYW5zaXRpb25Xb3JkczogdHJhbnNpdGlvbldvcmRzLmNvbmNhdCggYWRkaXRpb25hbFRyYW5zaXRpb25Xb3JkcyApLFxuXHRcdG1pc2NlbGxhbmVvdXM6IG1pc2NlbGxhbmVvdXMsXG5cdFx0cHJvbm9taW5hbEFkdmVyYnM6IHByb25vbWluYWxBZHZlcmJzLFxuXHRcdGludGVyamVjdGlvbnM6IGludGVyamVjdGlvbnMsXG5cdFx0cmVmbGV4aXZlUHJvbm91bnM6IHJlZmxleGl2ZVByb25vdW5zLFxuXHRcdGFsbDogYXJ0aWNsZXMuY29uY2F0KCBudW1lcmFscywgZGVtb25zdHJhdGl2ZVByb25vdW5zLCBwb3NzZXNzaXZlUHJvbm91bnMsIHJlZmxleGl2ZVByb25vdW5zLFxuXHRcdFx0cGVyc29uYWxQcm9ub3Vuc05vbWluYXRpdmUsIHBlcnNvbmFsUHJvbm91bnNBY2N1c2F0aXZlLCBxdWFudGlmaWVycywgaW5kZWZpbml0ZVByb25vdW5zLFxuXHRcdFx0aW5kZWZpbml0ZVByb25vdW5zUG9zc2Vzc2l2ZSwgaW50ZXJyb2dhdGl2ZURldGVybWluZXJzLCBpbnRlcnJvZ2F0aXZlUHJvbm91bnMsIGludGVycm9nYXRpdmVQcm9BZHZlcmJzLFxuXHRcdFx0cHJvbm9taW5hbEFkdmVyYnMsIGxvY2F0aXZlQWR2ZXJicywgYWR2ZXJiaWFsR2VuaXRpdmVzLCBwcmVwb3NpdGlvbmFsQWR2ZXJicywgZmlsdGVyZWRQYXNzaXZlQXV4aWxpYXJpZXMsIG5vdEZpbHRlcmVkUGFzc2l2ZUF1eGlsaWFyaWVzLFxuXHRcdFx0b3RoZXJBdXhpbGlhcmllcywgY29wdWxhLCBwcmVwb3NpdGlvbnMsIGNvb3JkaW5hdGluZ0Nvbmp1bmN0aW9ucywgY29ycmVsYXRpdmVDb25qdW5jdGlvbnMsIHN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbnMsIGludGVydmlld1ZlcmJzLFxuXHRcdFx0dHJhbnNpdGlvbldvcmRzLCBhZGRpdGlvbmFsVHJhbnNpdGlvbldvcmRzLCBpbnRlbnNpZmllcnMsIGRlbGV4aWNhbGlzZWRWZXJicywgaW50ZXJqZWN0aW9ucywgZ2VuZXJhbEFkamVjdGl2ZXNBZHZlcmJzLFxuXHRcdFx0cmVjaXBlV29yZHMsIHZhZ3VlTm91bnMsIG1pc2NlbGxhbmVvdXMgKSxcblx0fTtcbn07XG4iLCIvLyBUaGVzZSBhdXhpbGlhcmllcyBhcmUgZmlsdGVyZWQgZnJvbSB0aGUgYmVnaW5uaW5nIG9mIHdvcmQgY29tYmluYXRpb25zIGluIHRoZSBwcm9taW5lbnQgd29yZHMuXG52YXIgZmlsdGVyZWRBdXhpbGlhcmllcyA9ICBbXG5cdFwiYW1cIixcblx0XCJpc1wiLFxuXHRcImFyZVwiLFxuXHRcIndhc1wiLFxuXHRcIndlcmVcIixcblx0XCJiZWVuXCIsXG5cdFwiZ2V0XCIsXG5cdFwiZ2V0c1wiLFxuXHRcImdvdFwiLFxuXHRcImdvdHRlblwiLFxuXHRcImJlXCIsXG5cdFwic2hlJ3NcIixcblx0XCJoZSdzXCIsXG5cdFwiaXQnc1wiLFxuXHRcImknbVwiLFxuXHRcIndlJ3JlXCIsXG5cdFwidGhleSdyZVwiLFxuXHRcInlvdSdyZVwiLFxuXHRcImlzbid0XCIsXG5cdFwid2VyZW4ndFwiLFxuXHRcIndhc24ndFwiLFxuXHRcInRoYXQnc1wiLFxuXHRcImFyZW4ndFwiLFxuXTtcblxuLy8gVGhlc2UgYXV4aWxpYXJpZXMgYXJlIG5vdCBmaWx0ZXJlZCBmcm9tIHRoZSBiZWdpbm5pbmcgb2Ygd29yZCBjb21iaW5hdGlvbnMgaW4gdGhlIHByb21pbmVudCB3b3Jkcy5cbnZhciBub3RGaWx0ZXJlZEF1eGlsaWFyaWVzID0gW1xuXHRcImJlaW5nXCIsXG5cdFwiZ2V0dGluZ1wiLFxuXHRcImhhdmluZ1wiLFxuXHRcIndoYXQnc1wiLFxuXTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHRmaWx0ZXJlZEF1eGlsaWFyaWVzOiBmaWx0ZXJlZEF1eGlsaWFyaWVzLFxuXHRcdG5vdEZpbHRlcmVkQXV4aWxpYXJpZXM6IG5vdEZpbHRlcmVkQXV4aWxpYXJpZXMsXG5cdFx0YWxsOiBmaWx0ZXJlZEF1eGlsaWFyaWVzLmNvbmNhdCggbm90RmlsdGVyZWRBdXhpbGlhcmllcyApLFxuXHR9O1xufTtcbiIsIi8qKiBAbW9kdWxlIGNvbmZpZy90cmFuc2l0aW9uV29yZHMgKi9cblxudmFyIHNpbmdsZVdvcmRzID0gWyBcImFjY29yZGluZ2x5XCIsIFwiYWRkaXRpb25hbGx5XCIsIFwiYWZ0ZXJ3YXJkXCIsIFwiYWZ0ZXJ3YXJkc1wiLCBcImFsYmVpdFwiLCBcImFsc29cIiwgXCJhbHRob3VnaFwiLCBcImFsdG9nZXRoZXJcIixcblx0XCJhbm90aGVyXCIsIFwiYmFzaWNhbGx5XCIsIFwiYmVjYXVzZVwiLCBcImJlZm9yZVwiLCBcImJlc2lkZXNcIiwgXCJidXRcIiwgXCJjZXJ0YWlubHlcIiwgXCJjaGllZmx5XCIsIFwiY29tcGFyYXRpdmVseVwiLFxuXHRcImNvbmN1cnJlbnRseVwiLCBcImNvbnNlcXVlbnRseVwiLCBcImNvbnRyYXJpbHlcIiwgXCJjb252ZXJzZWx5XCIsIFwiY29ycmVzcG9uZGluZ2x5XCIsIFwiZGVzcGl0ZVwiLCBcImRvdWJ0ZWRseVwiLCBcImR1cmluZ1wiLFxuXHRcImUuZy5cIiwgXCJlYXJsaWVyXCIsIFwiZW1waGF0aWNhbGx5XCIsIFwiZXF1YWxseVwiLCBcImVzcGVjaWFsbHlcIiwgXCJldmVudHVhbGx5XCIsIFwiZXZpZGVudGx5XCIsIFwiZXhwbGljaXRseVwiLCBcImZpbmFsbHlcIixcblx0XCJmaXJzdGx5XCIsIFwiZm9sbG93aW5nXCIsIFwiZm9ybWVybHlcIiwgXCJmb3J0aHdpdGhcIiwgXCJmb3VydGhseVwiLCBcImZ1cnRoZXJcIiwgXCJmdXJ0aGVybW9yZVwiLCBcImdlbmVyYWxseVwiLCBcImhlbmNlXCIsXG5cdFwiaGVuY2Vmb3J0aFwiLCBcImhvd2V2ZXJcIiwgXCJpLmUuXCIsIFwiaWRlbnRpY2FsbHlcIiwgXCJpbmRlZWRcIiwgXCJpbnN0ZWFkXCIsIFwibGFzdFwiLCBcImxhc3RseVwiLCBcImxhdGVyXCIsIFwibGVzdFwiLCBcImxpa2V3aXNlXCIsXG5cdFwibWFya2VkbHlcIiwgXCJtZWFud2hpbGVcIiwgXCJtb3Jlb3ZlclwiLCBcIm5ldmVydGhlbGVzc1wiLCBcIm5vbmV0aGVsZXNzXCIsIFwibm9yXCIsICBcIm5vdHdpdGhzdGFuZGluZ1wiLCBcIm9idmlvdXNseVwiLFxuXHRcIm9jY2FzaW9uYWxseVwiLCBcIm90aGVyd2lzZVwiLCBcIm92ZXJhbGxcIiwgXCJwYXJ0aWN1bGFybHlcIiwgXCJwcmVzZW50bHlcIiwgXCJwcmV2aW91c2x5XCIsIFwicmF0aGVyXCIsIFwicmVnYXJkbGVzc1wiLCBcInNlY29uZGx5XCIsXG5cdFwic2hvcnRseVwiLCBcInNpZ25pZmljYW50bHlcIiwgXCJzaW1pbGFybHlcIiwgXCJzaW11bHRhbmVvdXNseVwiLCBcInNpbmNlXCIsIFwic29cIiwgXCJzb29uXCIsIFwic3BlY2lmaWNhbGx5XCIsIFwic3RpbGxcIiwgXCJzdHJhaWdodGF3YXlcIixcblx0XCJzdWJzZXF1ZW50bHlcIiwgXCJzdXJlbHlcIiwgXCJzdXJwcmlzaW5nbHlcIiwgXCJ0aGFuXCIsIFwidGhlblwiLCBcInRoZXJlYWZ0ZXJcIiwgXCJ0aGVyZWZvcmVcIiwgXCJ0aGVyZXVwb25cIiwgXCJ0aGlyZGx5XCIsIFwidGhvdWdoXCIsXG5cdFwidGh1c1wiLCBcInRpbGxcIiwgXCJ0b29cIiwgXCJ1bmRlbmlhYmx5XCIsIFwidW5kb3VidGVkbHlcIiwgXCJ1bmxlc3NcIiwgXCJ1bmxpa2VcIiwgXCJ1bnF1ZXN0aW9uYWJseVwiLCBcInVudGlsXCIsIFwid2hlblwiLCBcIndoZW5ldmVyXCIsXG5cdFwid2hlcmVhc1wiLCBcIndoaWxlXCIgXTtcbnZhciBtdWx0aXBsZVdvcmRzID0gWyBcImFib3ZlIGFsbFwiLCBcImFmdGVyIGFsbFwiLCBcImFmdGVyIHRoYXRcIiwgXCJhbGwgaW4gYWxsXCIsIFwiYWxsIG9mIGEgc3VkZGVuXCIsIFwiYWxsIHRoaW5ncyBjb25zaWRlcmVkXCIsXG5cdFwiYW5hbG9nb3VzIHRvXCIsIFwiYWx0aG91Z2ggdGhpcyBtYXkgYmUgdHJ1ZVwiLCBcImFuYWxvZ291cyB0b1wiLCBcImFub3RoZXIga2V5IHBvaW50XCIsIFwiYXMgYSBtYXR0ZXIgb2YgZmFjdFwiLCBcImFzIGEgcmVzdWx0XCIsXG5cdFwiYXMgYW4gaWxsdXN0cmF0aW9uXCIsIFx0XCJhcyBjYW4gYmUgc2VlblwiLCBcImFzIGhhcyBiZWVuIG5vdGVkXCIsIFwiYXMgSSBoYXZlIG5vdGVkXCIsIFwiYXMgSSBoYXZlIHNhaWRcIiwgXCJhcyBJIGhhdmUgc2hvd25cIixcblx0XCJhcyBsb25nIGFzXCIsIFwiYXMgbXVjaCBhc1wiLCBcImFzIHNob3duIGFib3ZlXCIsIFwiYXMgc29vbiBhc1wiLCBcImFzIHdlbGwgYXNcIiwgXCJhdCBhbnkgcmF0ZVwiLCBcImF0IGZpcnN0XCIsIFwiYXQgbGFzdFwiLFxuXHRcImF0IGxlYXN0XCIsIFwiYXQgbGVuZ3RoXCIsIFwiYXQgdGhlIHByZXNlbnQgdGltZVwiLCBcImF0IHRoZSBzYW1lIHRpbWVcIiwgXCJhdCB0aGlzIGluc3RhbnRcIiwgXCJhdCB0aGlzIHBvaW50XCIsIFwiYXQgdGhpcyB0aW1lXCIsXG5cdFwiYmFsYW5jZWQgYWdhaW5zdFwiLCBcImJlaW5nIHRoYXRcIiwgXCJieSBhbGwgbWVhbnNcIiwgXCJieSBhbmQgbGFyZ2VcIiwgXCJieSBjb21wYXJpc29uXCIsIFwiYnkgdGhlIHNhbWUgdG9rZW5cIiwgXCJieSB0aGUgdGltZVwiLFxuXHRcImNvbXBhcmVkIHRvXCIsIFwiYmUgdGhhdCBhcyBpdCBtYXlcIiwgXCJjb3VwbGVkIHdpdGhcIiwgXCJkaWZmZXJlbnQgZnJvbVwiLCBcImR1ZSB0b1wiLCBcImVxdWFsbHkgaW1wb3J0YW50XCIsIFwiZXZlbiBpZlwiLFxuXHRcImV2ZW4gbW9yZVwiLCBcImV2ZW4gc29cIiwgXCJldmVuIHRob3VnaFwiLCBcImZpcnN0IHRoaW5nIHRvIHJlbWVtYmVyXCIsIFwiZm9yIGV4YW1wbGVcIiwgXCJmb3IgZmVhciB0aGF0XCIsIFwiZm9yIGluc3RhbmNlXCIsXG5cdFwiZm9yIG9uZSB0aGluZ1wiLCBcImZvciB0aGF0IHJlYXNvblwiLCBcImZvciB0aGUgbW9zdCBwYXJ0XCIsIFwiZm9yIHRoZSBwdXJwb3NlIG9mXCIsIFwiZm9yIHRoZSBzYW1lIHJlYXNvblwiLCBcImZvciB0aGlzIHB1cnBvc2VcIixcblx0XCJmb3IgdGhpcyByZWFzb25cIiwgXCJmcm9tIHRpbWUgdG8gdGltZVwiLCBcImdpdmVuIHRoYXRcIiwgXCJnaXZlbiB0aGVzZSBwb2ludHNcIiwgXCJpbXBvcnRhbnQgdG8gcmVhbGl6ZVwiLCBcImluIGEgd29yZFwiLCBcImluIGFkZGl0aW9uXCIsXG5cdFwiaW4gYW5vdGhlciBjYXNlXCIsIFwiaW4gYW55IGNhc2VcIiwgXCJpbiBhbnkgZXZlbnRcIiwgXCJpbiBicmllZlwiLCBcImluIGNhc2VcIiwgXCJpbiBjb25jbHVzaW9uXCIsIFwiaW4gY29udHJhc3RcIixcblx0XCJpbiBkZXRhaWxcIiwgXCJpbiBkdWUgdGltZVwiLCBcImluIGVmZmVjdFwiLCBcImluIGVpdGhlciBjYXNlXCIsIFwiaW4gZXNzZW5jZVwiLCBcImluIGZhY3RcIiwgXCJpbiBnZW5lcmFsXCIsIFwiaW4gbGlnaHQgb2ZcIixcblx0XCJpbiBsaWtlIGZhc2hpb25cIiwgXCJpbiBsaWtlIG1hbm5lclwiLCBcImluIG9yZGVyIHRoYXRcIiwgXCJpbiBvcmRlciB0b1wiLCBcImluIG90aGVyIHdvcmRzXCIsIFwiaW4gcGFydGljdWxhclwiLCBcImluIHJlYWxpdHlcIixcblx0XCJpbiBzaG9ydFwiLCBcImluIHNpbWlsYXIgZmFzaGlvblwiLCBcImluIHNwaXRlIG9mXCIsIFwiaW4gc3VtXCIsIFwiaW4gc3VtbWFyeVwiLCBcImluIHRoYXQgY2FzZVwiLCBcImluIHRoZSBldmVudCB0aGF0XCIsXG5cdFwiaW4gdGhlIGZpbmFsIGFuYWx5c2lzXCIsIFwiaW4gdGhlIGZpcnN0IHBsYWNlXCIsIFwiaW4gdGhlIGZvdXJ0aCBwbGFjZVwiLCBcImluIHRoZSBob3BlIHRoYXRcIiwgXCJpbiB0aGUgbGlnaHQgb2ZcIixcblx0XCJpbiB0aGUgbG9uZyBydW5cIiwgXCJpbiB0aGUgbWVhbnRpbWVcIiwgXCJpbiB0aGUgc2FtZSBmYXNoaW9uXCIsIFwiaW4gdGhlIHNhbWUgd2F5XCIsIFwiaW4gdGhlIHNlY29uZCBwbGFjZVwiLFxuXHRcImluIHRoZSB0aGlyZCBwbGFjZVwiLCBcImluIHRoaXMgY2FzZVwiLCBcImluIHRoaXMgc2l0dWF0aW9uXCIsIFwiaW4gdGltZVwiLCBcImluIHRydXRoXCIsIFwiaW4gdmlldyBvZlwiLCBcImluYXNtdWNoIGFzXCIsXG5cdFwibW9zdCBjb21wZWxsaW5nIGV2aWRlbmNlXCIsIFwibW9zdCBpbXBvcnRhbnRcIiwgXCJtdXN0IGJlIHJlbWVtYmVyZWRcIiwgXCJub3QgdG8gbWVudGlvblwiLCBcIm5vdyB0aGF0XCIsIFwib2YgY291cnNlXCIsXG5cdFwib24gYWNjb3VudCBvZlwiLCBcIm9uIGJhbGFuY2VcIiwgXCJvbiBjb25kaXRpb24gdGhhdFwiLCBcIm9uIG9uZSBoYW5kXCIsIFwib24gdGhlIGNvbmRpdGlvbiB0aGF0XCIsIFwib24gdGhlIGNvbnRyYXJ5XCIsXG5cdFwib24gdGhlIG5lZ2F0aXZlIHNpZGVcIiwgXCJvbiB0aGUgb3RoZXIgaGFuZFwiLCBcIm9uIHRoZSBwb3NpdGl2ZSBzaWRlXCIsIFwib24gdGhlIHdob2xlXCIsIFwib24gdGhpcyBvY2Nhc2lvblwiLCBcIm9uY2VcIixcblx0XCJvbmNlIGluIGEgd2hpbGVcIiwgXHRcIm9ubHkgaWZcIiwgXCJvd2luZyB0b1wiLCBcInBvaW50IG9mdGVuIG92ZXJsb29rZWRcIiwgXCJwcmlvciB0b1wiLCBcInByb3ZpZGVkIHRoYXRcIiwgXCJzZWVpbmcgdGhhdFwiLFxuXHRcInNvIGFzIHRvXCIsIFwic28gZmFyXCIsIFwic28gbG9uZyBhc1wiLCBcInNvIHRoYXRcIiwgXCJzb29uZXIgb3IgbGF0ZXJcIiwgXCJzdWNoIGFzXCIsIFwic3VtbWluZyB1cFwiLCBcInRha2UgdGhlIGNhc2Ugb2ZcIixcblx0XCJ0aGF0IGlzXCIsIFwidGhhdCBpcyB0byBzYXlcIiwgXCJ0aGVuIGFnYWluXCIsIFwidGhpcyB0aW1lXCIsIFwidG8gYmUgc3VyZVwiLCBcInRvIGJlZ2luIHdpdGhcIiwgXCJ0byBjbGFyaWZ5XCIsIFwidG8gY29uY2x1ZGVcIixcblx0XCJ0byBkZW1vbnN0cmF0ZVwiLCBcInRvIGVtcGhhc2l6ZVwiLCBcInRvIGVudW1lcmF0ZVwiLCBcInRvIGV4cGxhaW5cIiwgXCJ0byBpbGx1c3RyYXRlXCIsIFwidG8gbGlzdFwiLCBcInRvIHBvaW50IG91dFwiLFxuXHRcInRvIHB1dCBpdCBhbm90aGVyIHdheVwiLCBcInRvIHB1dCBpdCBkaWZmZXJlbnRseVwiLCBcInRvIHJlcGVhdFwiLCBcInRvIHJlcGhyYXNlIGl0XCIsIFwidG8gc2F5IG5vdGhpbmcgb2ZcIiwgXCJ0byBzdW0gdXBcIixcblx0XCJ0byBzdW1tYXJpemVcIiwgXCJ0byB0aGF0IGVuZFwiLCBcInRvIHRoZSBlbmQgdGhhdFwiLCBcInRvIHRoaXMgZW5kXCIsIFwidG9nZXRoZXIgd2l0aFwiLCBcInVuZGVyIHRob3NlIGNpcmN1bXN0YW5jZXNcIiwgXCJ1bnRpbCBub3dcIixcblx0XCJ1cCBhZ2FpbnN0XCIsIFwidXAgdG8gdGhlIHByZXNlbnQgdGltZVwiLCBcInZpcyBhIHZpc1wiLCBcIndoYXQncyBtb3JlXCIsIFwid2hpbGUgaXQgbWF5IGJlIHRydWVcIiwgXCJ3aGlsZSB0aGlzIG1heSBiZSB0cnVlXCIsXG5cdFwid2l0aCBhdHRlbnRpb24gdG9cIiwgXCJ3aXRoIHRoZSByZXN1bHQgdGhhdFwiLCBcIndpdGggdGhpcyBpbiBtaW5kXCIsIFwid2l0aCB0aGlzIGludGVudGlvblwiLCBcIndpdGggdGhpcyBwdXJwb3NlIGluIG1pbmRcIixcblx0XCJ3aXRob3V0IGEgZG91YnRcIiwgXCJ3aXRob3V0IGRlbGF5XCIsIFwid2l0aG91dCBkb3VidFwiLCBcIndpdGhvdXQgcmVzZXJ2YXRpb25cIiBdO1xuXG4vKipcbiAqIFJldHVybnMgbGlzdHMgd2l0aCB0cmFuc2l0aW9uIHdvcmRzIHRvIGJlIHVzZWQgYnkgdGhlIGFzc2Vzc21lbnRzLlxuICogQHJldHVybnMge09iamVjdH0gVGhlIG9iamVjdCB3aXRoIHRyYW5zaXRpb24gd29yZCBsaXN0cy5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHtcblx0XHRzaW5nbGVXb3Jkczogc2luZ2xlV29yZHMsXG5cdFx0bXVsdGlwbGVXb3JkczogbXVsdGlwbGVXb3Jkcyxcblx0XHRhbGxXb3Jkczogc2luZ2xlV29yZHMuY29uY2F0KCBtdWx0aXBsZVdvcmRzICksXG5cdH07XG59O1xuIiwidmFyIGZpbHRlcmVkUGFzc2l2ZUF1eGlsaWFyaWVzID0gcmVxdWlyZSggXCIuL3Bhc3NpdmV2b2ljZS9hdXhpbGlhcmllcy5qc1wiICkoKS5maWx0ZXJlZEF1eGlsaWFyaWVzO1xudmFyIG5vdEZpbHRlcmVkUGFzc2l2ZUF1eGlsaWFyaWVzID0gcmVxdWlyZSggXCIuL3Bhc3NpdmV2b2ljZS9hdXhpbGlhcmllcy5qc1wiICkoKS5pbmZpbml0aXZlQXV4aWxpYXJpZXM7XG52YXIgdHJhbnNpdGlvbldvcmRzID0gcmVxdWlyZSggXCIuL3RyYW5zaXRpb25Xb3Jkcy5qc1wiICkoKS5zaW5nbGVXb3JkcztcblxuLyoqXG4gKiBSZXR1cm5zIGFuIGFycmF5IHdpdGggZXhjZXB0aW9ucyBmb3IgdGhlIGtleXdvcmQgc3VnZ2VzdGlvbiByZXNlYXJjaGVyLlxuICogQHJldHVybnMge0FycmF5fSBUaGUgYXJyYXkgZmlsbGVkIHdpdGggZXhjZXB0aW9ucy5cbiAqL1xuXG52YXIgYXJ0aWNsZXMgPSBbIFwiZGFzXCIsIFwiZGVtXCIsIFwiZGVuXCIsIFwiZGVyXCIsIFwiZGVzXCIsIFwiZGllXCIsIFwiZWluXCIsIFwiZWluZVwiLCBcImVpbmVtXCIsIFwiZWluZW5cIiwgXCJlaW5lclwiLCBcImVpbmVzXCIgXTtcblxudmFyIG51bWVyYWxzID0gWyBcImVpbnNcIiwgXCJ6d2VpXCIsIFwiZHJlaVwiLCBcInZpZXJcIiwgXCJmw7xuZlwiLCBcInNlY2hzXCIsIFwic2llYmVuXCIsIFwiYWNodFwiLCBcIm5ldW5cIiwgXCJ6ZWhuXCIsIFwiZWxmXCIsIFwienfDtmxmXCIsXG5cdFwiendvZWxmXCIsIFwiZHJlaXplaG5cIiwgXCJ2aWVyemVoblwiLCBcImbDvG5memVoblwiLCBcImZ1ZW5memVoblwiLCBcInNlY2h6ZWhuXCIsIFwic2llYnplaG5cIiwgXCJhY2h0emVoblwiLCBcIm5ldW56ZWhuXCIsXG5cdFwiendhbnppZ1wiLCBcImVyc3RlXCIsIFwiZXJzdGVyXCIsIFwiZXJzdGVuXCIsIFwiZXJzdGVtXCIsIFwiZXJzdGVzXCIsIFwiendlaXRlXCIsIFwiendlaXRlc1wiLCBcInp3ZWl0ZXJcIiwgXCJ6d2VpdGVtXCIsIFwiendlaXRlblwiLFxuXHRcImRyaXR0ZVwiLCBcImRyaXR0ZXJcIiwgXCJkcml0dGVzXCIsIFwiZHJpdHRlblwiLCBcImRyaXR0ZW1cIiwgXCJ2aWVydGVyXCIsIFwidmllcnRlblwiLCBcInZpZXJ0ZW1cIiwgXCJ2aWVydGVzXCIsIFwidmllcnRlXCIsXG5cdFwiZsO8bmZ0ZVwiLCBcImbDvG5mdGVyXCIsIFwiZsO8bmZ0ZWRcIiwgXCJmw7xuZnRlblwiLCBcImbDvG5mdGVtXCIsIFwiZnVlbmZ0ZVwiLCBcImZ1ZW5mdGVyXCIsIFwiZnVlbmZ0ZW1cIiwgXCJmdWVuZnRlblwiLCBcImZ1ZW5mdGVzXCIsXG5cdFwic2VjaHN0ZVwiLCBcInNlY2hzdGVyXCIsIFwic2VjaHN0ZXNcIiwgXCJzZWNoc3RlblwiLCBcInNlY2hzdGVtXCIsIFwic2llYnRlXCIsIFwic2llYnRlclwiLCBcInNpZWJ0ZW5cIiwgXCJzaWVidGVtXCIsIFwic2llYnRlc1wiLFxuXHRcImFjaHRlXCIsIFwiYWNodGVyXCIsIFwiYWNodGVuXCIsIFwiYWNodGVtXCIsIFwiYWNodGVzXCIsIFwibmV1bnRlXCIsIFwibmV1bnRlclwiLCBcIm5ldW50ZXNcIiwgXCJuZXVudGVuXCIsIFwibmV1bnRlbVwiLCBcInplaG50ZVwiLFxuXHRcInplaG50ZXJcIiwgXCJ6ZWhudGVuXCIsIFwiemVobnRlbVwiLCBcInplaG50ZXNcIiwgIFwiZWxmdGVcIiwgXCJlbGZ0ZXJcIiwgXCJlbGZ0ZXNcIiwgXCJlbGZ0ZW5cIiwgXCJlbGZ0ZW1cIiwgXCJ6d8O2bGZ0ZVwiLCBcInp3w7ZsZnRlclwiLFxuXHRcInp3w7ZsZnRlblwiLCBcInp3w7ZsZnRlbVwiLCBcInp3w7ZsZnRlc1wiLCBcInp3b2VsZnRlXCIsIFwiendvZWxmdGVyXCIsIFwiendvZWxmdGVuXCIsIFwiendvZWxmdGVtXCIsIFwiendvZWxmdGVzXCIsIFwiZHJlaXplaG50ZVwiLFxuXHRcImRyZWl6ZWhudGVyXCIsIFwiZHJlaXplaG50ZXNcIiwgXCJkcmVpemVobnRlblwiLCBcImRyZWl6ZWhudGVtXCIsIFwidmllcnplaG50ZVwiLCBcInZpZXJ6ZWhudGVyXCIsIFwidmllcnplaG50ZXNcIiwgXCJ2aWVyemVobnRlblwiLFxuXHRcInZpZXJ6ZWhudGVtXCIsIFwiZsO8bmZ6ZWhudGVcIiwgXCJmw7xuZnplaG50ZW5cIiwgXCJmw7xuZnplaG50ZW1cIiwgXCJmw7xuZnplaG50ZXJcIiwgXCJmw7xuZnplaG50ZXNcIiwgXCJmdWVuZnplaG50ZVwiLCBcImZ1ZW5memVobnRlblwiLFxuXHRcImZ1ZW5memVobnRlbVwiLCBcImZ1ZW5memVobnRlclwiLCBcImZ1ZW5memVobnRlc1wiLCBcInNlY2h6ZWhudGVcIiwgXCJzZWNoemVobnRlclwiLCBcInNlY2h6ZWhudGVuXCIsIFwic2VjaHplaG50ZXNcIiwgXCJzZWNoemVobnRlbVwiLFxuXHRcInNpZWJ6ZWhudGVcIiwgXCJzaWViemVobnRlclwiLCBcInNpZWJ6ZWhudGVzXCIsIFwic2llYnplaG50ZW1cIiwgXCJzaWViemVobnRlblwiLCBcImFjaHR6ZWhudGVyXCIsIFwiYWNodHplaG50ZW5cIiwgXCJhY2h0emVobnRlbVwiLFxuXHRcImFjaHR6ZWhudGVzXCIsIFwiYWNodHplaG50ZVwiLCBcIm5laG56ZWhudGVcIiwgXCJuZWhuemVobnRlclwiLCBcIm5laG56ZWhudGVtXCIsIFwibmVobnplaG50ZW5cIiwgXCJuZWhuemVobnRlc1wiLCBcInp3YW56aWdzdGVcIixcblx0XCJ6d2Fuemlnc3RlclwiLCBcInp3YW56aWdzdGVtXCIsIFwiendhbnppZ3N0ZW5cIiwgXCJ6d2Fuemlnc3Rlc1wiLCBcImh1bmRlcnRcIiwgXCJlaW5odW5kZXJ0XCIsIFwiendlaWh1bmRlcnRcIiwgXCJ6d2VpaHVuZGVydFwiLFxuXHRcImRyZWlodW5kZXJ0XCIsXHRcInZpZXJodW5kZXJ0XCIsIFwiZsO8bmZodW5kZXJ0XCIsIFwiZnVlbmZodW5kZXJ0XCIsIFwic2VjaHNodW5kZXJ0XCIsIFwic2llYmVuaHVuZGVydFwiLCBcImFjaHRodW5kZXJ0XCIsIFwibmV1bmh1bmRlcnRcIixcblx0XCJ0YXVzZW5kXCIsIFwibWlsbGlvblwiLCBcIm1pbGxpYXJkZVwiLCBcImJpbGxpb25cIiwgXCJiaWxsaWFyZGVcIiBdO1xuXG52YXIgcGVyc29uYWxQcm9ub3Vuc05vbWluYXRpdmUgPSBbIFwiaWNoXCIsIFwiZHVcIiwgXCJlclwiLCBcInNpZVwiLCBcImVzXCIsIFwid2lyXCIsIFwiaWhyXCIsIFwic2llXCIgXTtcblxudmFyIHBlcnNvbmFsUHJvbm91bnNBY2N1c2F0aXZlID0gWyBcIm1pY2hcIiwgXCJkaWNoXCIsIFwiaWhuXCIsIFwic2llXCIsIFwiZXNcIiwgXCJ1bnNcIiwgXCJldWNoXCIgXTtcblxudmFyIHBlcnNvbmFsUHJvbm91bnNEYXRpdmUgPSBbIFwibWlyXCIsIFwiZGlyXCIsIFwiaWhtXCIsIFwiaWhyXCIsIFwidW5zXCIsIFwiZXVjaFwiLCBcImlobmVuXCIgXTtcblxudmFyIGRlbW9uc3RyYXRpdmVQcm9ub3VucyA9IFsgXCJkZW5lblwiLCBcImRlcmVuXCIsIFwiZGVyZXJcIiwgXCJkZXNzZW5cIiwgXCJkaWVzZVwiLCBcImRpZXNlbVwiLCBcImRpZXNlblwiLCBcImRpZXNlclwiLCBcImRpZXNlc1wiLFxuXHRcImplbmVcIixcdFwiamVuZW1cIiwgXCJqZW5lblwiLCBcImplbmVyXCIsIFwiamVuZXNcIiwgXCJ3ZWxjaFwiLCBcIndlbGNoZXJcIiwgXCJ3ZWxjaGVzXCIsIFwiZGVyamVuaWdlXCIsIFwiZGVzamVuaWdlblwiLCBcImRlbWplbmlnZW5cIixcblx0XCJkZW5qZW5pZ2VuXCIsIFwiZGllamVuaWdlXCIsIFwiZGVyamVuaWdlblwiLCBcImRhc2plbmlnZVwiLCBcImRpZWplbmlnZW5cIiBdO1xuXG52YXIgcG9zc2Vzc2l2ZVByb25vdW5zID0gWyBcIm1laW5cIiwgXCJtZWluZVwiLCBcIm1laW5lbVwiLCBcIm1laW5lclwiLCBcIm1laW5lc1wiLCBcImRlaW5cIiwgXCJkZWluZVwiLCBcImRlaW5lbVwiLCBcImRlaW5lclwiLFxuXHRcImRlaW5lc1wiLCBcImRlaW5lblwiLCBcInNlaW5cIiwgXCJzZWluZVwiLCBcInNlaW5lbVwiLCBcInNlaW5lclwiLCBcInNlaW5lc1wiLCBcImloclwiLCBcImlocmVcIiwgXCJpaHJlbVwiLCBcImlocmVuXCIsIFwiaWhyZXJcIiwgXCJpaHJlc1wiLFxuXHRcInVuc2VyXCIsIFwidW5zZXJlXCIsIFwidW5zZXJlbVwiLCBcInVuc2VyZW5cIiwgXCJ1bnNlcmVyXCIsIFwidW5zZXJlc1wiLCBcImV1ZXJcIiwgXCJldXJlXCIsIFwiZXVyZW1cIiwgXCJldXJlblwiLCBcImV1cmVyXCIsXG5cdFwiZXVyZXNcIiBdO1xuXG52YXIgcXVhbnRpZmllcnMgPSBbIFwibWFuY2hlXCIsIFwibWFuY2hcIiwgXCJ2aWVsZVwiLCBcInZpZWxcIiwgXCJ2aWVsZXJcIiwgXCJ2aWVsZW5cIiwgXCJ2aWVsZW1cIiwgXCJhbGxcIiwgXCJhbGxlXCIsIFwiYWxsZXJcIiwgXCJhbGxlc1wiLFxuXHRcImFsbGVuXCIsIFwiYWxsZW1cIiwgXCJhbGxlcmxlaVwiLCBcInNvbGNoZXJsZWlcIiwgXCJlaW5pZ2VcIiwgXCJldGxpY2hlXCIsIFwibWFuY2hcIiwgXCJ3ZW5pZ2VcIiwgXCJ3ZW5pZ2VyXCIsIFwid2VuaWdlblwiLFxuXHRcIndlbmlnZW1cIiwgXCJ3ZW5pZ2VzXCIsIFwid2VuaWdcIiwgXCJ3ZW5pZ2VyZXJcIiwgXCJ3ZW5pZ2VyZW5cIiwgXCJ3ZW5pZ2VyZW1cIiwgXCJ3ZW5pZ2VyZVwiLCBcIndlbmlnZXJlc1wiLCBcIndlbmlnXCIsXG5cdFwiYmlzc2NoZW5cIiwgXCJwYWFyXCIsIFwia2VpblwiLCBcImtlaW5lc1wiLCBcImtlaW5lbVwiLCBcImtlaW5lblwiLCBcImtlaW5lXCIsIFwibWVoclwiLCBcIm1laHJlcmVcIiwgXCJuaWNodHNcIixcblx0XCJnZW51Z1wiLCBcIm1laHJlcmVcIiwgXCJtZWhyZXJlclwiLCBcIm1laHJlcmVuXCIsIFwibWVocmVyZW1cIiwgXCJtZWhyZXJlc1wiLCBcInZlcnNjaGllZGVuZVwiLCBcInZlcnNjaGllZGVuZXJcIixcblx0XCJ2ZXJzY2hpZWRlbmVuXCIsIFwidmVyc2NoaWVkZW5lbVwiLCBcInZlcnNjaGllZGVuZXNcIiwgXCJ2ZXJzY2hpZWRuZVwiLCBcInZlcnNjaGllZG5lclwiLCBcInZlcnNjaGllZG5lblwiLCBcInZlcnNjaGllZG5lbVwiLFxuXHRcInZlcnNjaGllZG5lc1wiLCBcImFydFwiLCBcImFydGVuXCIsIFwic29ydGVcIiwgXCJzb3J0ZW5cIiBdO1xuXG52YXIgcmVmbGV4aXZlUHJvbm91bnMgPSBbIFwibWljaFwiLCBcIm1pclwiLCBcImRpY2hcIiwgXCJkaXJcIiwgXCJzaWNoXCIsIFwidW5zXCIsIFwiZXVjaFwiIF07XG5cbi8vIFwiV2VsY2hcIiwgXCJ3ZWxjaGVyXCIsIGFuZCBcIndlbGNoZXNcIiBhcmUgYWxyZWFkeSBpbmNsdWRlZCBpbiB0aGUgZGVtb25zdHJhdGl2ZVByb25vdW5zLlxudmFyIGluZGVmaW5pdGVQcm9ub3VucyA9IFsgXCJhbmRlcmVcIiwgXCJhbmRlcmVyXCIsIFwiYW5kZXJlbVwiLCBcImFuZGVyZW5cIiwgXCJhbmRlcmVzXCIsIFwiYW5kcmVuXCIsIFwiYW5kZXJuXCIsIFwiYW5kcmVtXCIsXG5cdFwiYW5kZXJtXCIsIFwiYW5kcmVcIiwgXCJhbmRyZXJcIiwgXCJhbmRyZXNcIiwgXCJiZWlkZVwiLCBcImJlaWRlc1wiLCBcImJlaWRlbVwiLCBcImJlaWRlclwiLCBcImJlaWRlblwiLCBcImV0d2FzXCIsIFwiaXJnZW5kZXR3YXNcIixcblx0XCJpcmdlbmRlaW5cIiwgXCJpcmdlbmRlaW5lblwiLCBcImlyZ2VuZGVpbmVtXCIsIFwiaXJnZW5kZWluZXNcIiwgXCJpcmdlbmRlaW5lXCIsIFwiaXJnZW5kZWluZXJcIiwgXCJpcmdlbmR3YXNcIiwgXCJpcmdlbmR3ZXNzZW5cIixcblx0XCJpcmdlbmR3ZXJcIiwgXCJpcmdlbmR3ZW5cIiwgXCJpcmdlbmR3ZW1cIiwgXCJpcmdlbmR3ZXNzZW5cIiwgXCJpcmdlbmR3ZWxjaGVcIiwgXCJpcmdlbmR3ZWxjaGVyXCIsIFwiaXJnZW5kd2VsY2hlbVwiLFxuXHRcImlyZ2VuZHdlbGNoZW5cIiwgXCJpcmdlbmR3ZWxjaGVzXCIsIFwiaXJnZW5kamVtYW5kXCIsIFwiaXJnZW5kamVtYW5kZW5cIiwgXCJpcmdlbmRqZW1hbmRlbVwiLCBcImlyZ2VuZGplbWFuZGVzXCIsIFwiaXJnZW5kd2llXCIsXG5cdFwid2VyXCIsIFwid2VuXCIsIFwid2VtXCIsIFwid2Vzc2VuXCIsIFwid2FzXCIsIFwid2Vzc2VuXCIsIFwid2VsY2hlblwiLCBcIndlbGNoZW1cIiwgXCJ3ZWxjaGVcIiwgXCJqZWRlclwiLCBcImplZGVzXCIsIFwiamVkZW1cIiwgXCJqZWRlblwiLFxuXHRcImplZGVcIiwgXCJqZWR3ZWRlclwiLCBcImplZHdlZGVuXCIsIFwiamVkd2VkZW1cIiwgXCJqZWR3ZWRlc1wiLCBcImplZHdlZGVcIiwgXCJqZWdsaWNoZXJcIiwgXCJqZWdsaWNoZW5cIiwgXCJqZWdsaWNoZW1cIixcblx0XCJqZWdsaWNoZXNcIiwgXCJqZWdsaWNoZVwiLCBcImplZGVybWFublwiLCBcImplZGVybWFubnNcIiwgXCJqZW1hbmRcIiwgXCJqZW1hbmRlblwiLCBcImplbWFuZGVtXCIsIFwiamVtYW5kc1wiLCAgXCJqZW1hbmRlc1wiLFxuXHRcIm1hblwiLCBcIm1laW5lc2dsZWljaGVuXCIsIFwibmllbWFuZGVuXCIsIFwibmllbWFuZGVtXCIsIFwibmllbWFuZHNcIiwgXCJuaWVtYW5kZXNcIiwgXCJuaWVtYW5kXCIsIFwic8OkbXRsaWNoXCIsIFwic2FlbXRsaWNoXCIsXG5cdFwic8OkbXRsaWNoZXJcIiwgXCJzYWVtdGxpY2hlclwiLCBcInPDpG10bGljaGVuXCIsIFwic2FlbXRsaWNoZW5cIiwgXCJzw6RtdGxpY2hlbVwiLFx0XCJzYWVtdGxpY2hlbVwiLCBcInPDpG10bGljaGVzXCIsXG5cdFwic2FlbXRsaWNoZXNcIiwgXCJzw6RtdGxpY2hlXCIsIFwic2FlbXRsaWNoZVwiLCBcInNvbGNoZVwiLCBcInNvbGNoZXJcIiwgXCJzb2xjaGVuXCIsIFwic29sY2hlbVwiLCBcInNvbGNoZXNcIiwgXCJuaWVtYW5kXCIsXG5cdFwibmllbWFuZGVuXCIsIFwibmllbWFuZGVtXCIsIFwibmllbWFuZGVzXCIsIFwibmllbWFuZHNcIiwgXCJuaWNodHNcIiwgXCJqZWdsaWNoZXJcIiwgXCJqZWdsaWNoZW5cIiwgXHRcImplZ2xpY2hlbVwiLCBcImplZ2xpY2hlc1wiLFxuXHRcImplZ2xpY2hlXCIsIFwiendlaXRlclwiIF07XG5cbnZhciByZWxhdGl2ZVByb25vdW5zID0gWyBcImRlc3NlblwiLCBcImRlcmVuXCIsIFwiZGVyZXJcIiwgXCJkZW5lblwiLCBcIndlc1wiIF07XG5cbnZhciBpbnRlcnJvZ2F0aXZlUHJvQWR2ZXJicyA9ICBbIFwid2FydW1cIiwgXCJ3aWVcIiwgXCJ3b1wiLCBcIndvaGVyXCIsIFwid29oaW5cIiwgXCJ3YW5uXCIgXTtcblxudmFyIHByb25vbWluYWxBZHZlcmJzID0gWyBcImRhYmVpXCIsIFwiZGFkdXJjaFwiLCBcImRhZsO8clwiLCBcImRhZnVlclwiLCBcImRhZ2VnZW5cIiwgXCJkYWhpbnRlclwiLCBcImRhbWl0XCIsIFwiZGFuYWNoXCIsIFwiZGFuZWJlblwiLFxuXHRcImRhcmFuXCIsIFwiZGFyYXVmXCIsIFwiZGFyYXVzXCIsIFwiZGFyaW5cIiwgXCJkYXJ1bVwiLCBcImRhcnVudGVyXCIsIFwiZGFyw7xiZXJcIiwgXCJkYXJ1ZWJlclwiLCBcImRhdm9uXCIsIFwiZGF2b3JcIiwgXCJkYXp1XCIsXG5cdFwiZGF6d2lzY2hlblwiLCBcImhpZXJhblwiLFx0XCJoaWVyYXVmXCIsIFwiaGllcmF1c1wiLCBcImhpZXJiZWlcIiwgXCJoaWVyZHVyY2hcIiwgXCJoaWVyZnVlclwiLCBcImhpZXJmw7xyXCIsIFwiaGllcmdlZ2VuXCIsXG5cdFwiaGllcmhpbnRlclwiLCBcImhpZXJpblwiLFx0XCJoaWVybWl0XCIsIFwiaGllcm5hY2hcIiwgXCJoaWVydW1cIiwgXCJoaWVydW50ZXJcIiwgXCJoaWVydWViZXJcIiwgXCJoaWVyw7xiZXJcIiwgXCJoaWVydm9yXCIsXG5cdFwiaGllcnp1XCIsIFwiaGllcnp3aXNjaGVuXCIsIFwiaGllcm5lYmVuXCIsIFwiaGllcnZvblwiLCBcIndvYmVpXCIsIFwid29kdXJjaFwiLCBcIndvcmluXCIsIFwid29yYXVmXCIsIFwid29iZWlcIiwgXCJ3b2bDvHJcIiwgXCJ3b2Z1ZXJcIixcblx0XCJ3b2dlZ2VuXCIsIFwid29oaW50ZXJcIiwgXCJ3b21pdFwiLCBcIndvbmFjaFwiLCBcIndvbmViZW5cIiwgXCJ3b3JhblwiLCBcIndvcmF1ZlwiLCBcIndvcmF1c1wiLCBcIndvcmluXCIsXHRcIndvcnVtXCIsIFwid29ydW50ZXJcIixcblx0XCJ3b3LDvGJlclwiLCBcIndvcnVlYmVyXCIsIFwid292b25cIiwgXCJ3b3ZvclwiLCBcIndvenVcIiwgXCJ3b3p3aXNjaGVuXCIgXTtcblxudmFyIGxvY2F0aXZlQWR2ZXJicyA9IFsgXCJkYVwiLCBcImhpZXJcIiwgXCJkb3J0aGluXCIsIFwiaGllcmhlclwiLCBcIndoZW5jZVwiLCBcImRvcnRoZXJcIiwgXCJkYWhlclwiIF07XG5cbnZhciBhZHZlcmJpYWxHZW5pdGl2ZXMgPSBbIFwiYWxsZW5mYWxsc1wiLCBcImtlaW5lc2ZhbGxzXCIsIFwiYW5kZXJlbmZhbGxzXCIsIFwiYW5kZXJuZmFsbHNcIiwgXCJhbmRyZW5mYWxsc1wiLFxuXHRcIsOkdcOfZXJzdGVuZmFsbHNcIiwgXCJiZWphaGVuZGVuZmFsbHNcIiwgXCJiZXN0ZW5mYWxsc1wiLCBcImViZW5mYWxsc1wiLCBcImVpbnRyZXRlbmRlbmZhbGxzXCIsIFwiZW50Z2VnZW5nZXNldHp0ZW5mYWxsc1wiLFxuXHRcImVyZm9yZGVybGljaGVuZmFsbHNcIiwgXCJnZWdlYmVuZW5mYWxsc1wiLCBcImdlcmluZ3N0ZW5mYWxsc1wiLCBcImdsZWljaGZhbGxzXCIsIFwiZ8O8bnN0aWdlbmZhbGxzXCIsIFwiZ8O8bnN0aWdzdGVuZmFsbHNcIixcblx0XCJow7ZjaHN0ZW5mYWxsc1wiLCBcImplZGVuZmFsbHNcIiwgXCJtw7ZnbGljaGVuZmFsbHNcIiwgXCJub3RmYWxsc1wiLCBcIm7DtnRpZ2VuZmFsbHNcIiwgXCJub3R3ZW5kaWdlbmZhbGxzXCIsXG5cdFwic2NobGltbXN0ZW5mYWxsc1wiLCBcInZvcmtvbW1lbmRlbmZhbGxzXCIsIFwid2lkcmlnZW5mYWxsc1wiLCBcInp1dHJlZmZlbmRlbmZhbGxzXCIsIFwiYW5nZXNpY2h0c1wiLCBcIm1vcmdlbnNcIiwgXCJtaXR0YWdzXCIsXG5cdFwiYWJlbmRzXCIsIFwibmFjaHRzXCIsIFwia2VpbmVzd2Vnc1wiLCBcImR1cmNod2Vnc1wiLCBcImdlcmFkZW53ZWdzXCIsIFwiZ2VyYWRlc3dlZ3NcIiwgXCJnZXJhZGV3ZWdzXCIsIFwiZ3JhZGVud2Vnc1wiLFxuXHRcImhhbGJ3ZWdzXCIsIFwibWl0dHdlZ3NcIiwgXCJ1bnRlcndlZ3NcIiBdO1xuXG52YXIgb3RoZXJBdXhpbGlhcmllcyA9IFsgXCJoYWJlXCIsIFwiaGFzdFwiLCBcImhhdFwiLCBcImhhYnRcIiwgXCJoYWJlc3RcIiwgXCJoYWJldFwiLCBcImhhdHRlXCIsIFwiaGF0dGVzdFwiLCBcImhhdHRlblwiLCBcImjDpHR0ZVwiLCBcImhhZXR0ZVwiLFxuXHRcImjDpHR0ZXN0XCIsIFwiaGFldHRlc3RcIiwgXCJow6R0dGVuXCIsIFwiaGFldHRlblwiLCBcImhhZXR0ZXRcIiwgXCJow6R0dGV0XCIsIFwiaGFiXCIsIFwiYmluXCIsIFwiYmlzdFwiLCBcImlzdFwiLCBcInNpbmRcIiwgXCJzZWlcIiwgXCJzZWllc3RcIixcblx0XCJzZWllblwiLCBcInNlaWV0XCIsIFwid2FyXCIsIFwid2Fyc3RcIiwgXCJ3YXJlblwiLCBcIndhcnRcIiwgXCJ3w6RyZVwiLCBcIndhZXJlXCIsIFwid8OkcmVzdFwiLCBcIndhZXJlc3RcIiwgXCJ3w6Ryc3RcIiwgXCJ3YWVyc3RcIiwgXCJ3w6RyZW5cIixcblx0XCJ3YWVyZW5cIiwgXCJ3w6RyZXRcIiwgXCJ3YWVyZXRcIiwgXCJ3w6RydFwiLCBcIndhZXJ0XCIsIFwic2VpZFwiLCBcImRhcmZcIiwgXCJkYXJmc3RcIiwgXCJkw7xyZnRcIiwgXCJkdWVyZnRcIiwgXCJkw7xyZmVcIiwgXCJkdWVyZmVcIiwgXCJkw7xyZmVzdFwiLFxuXHRcImR1ZXJmZXN0XCIsIFwiZMO8cmZldFwiLCBcImR1ZXJmZXRcIiwgXCJkdXJmdGVcIiwgXCJkdXJmdGVzdFwiLCBcImR1cmZ0ZW5cIiwgXCJkdXJmdGV0XCIsIFwiZMO8cmZ0ZVwiLCBcImR1ZXJmdGVcIiwgXCJkw7xyZnRlc3RcIiwgXCJkdWVyZnRlc3RcIixcblx0XCJkw7xyZnRlblwiLCBcImR1ZXJmdGVuXCIsIFwiZMO8cmZ0ZXRcIiwgXCJkdWVyZnRldFwiLCBcImthbm5cIiwgXCJrYW5uc3RcIixcdFwia8O2bm50XCIsIFwia29lbm50XCIsIFwia8O2bm5lXCIsIFwia29lbm5lXCIsIFwia8O2bm5lc3RcIiwgXCJrb2VubmVzdFwiLFxuXHRcImvDtm5uZXRcIiwgXCJrb2VubmV0XCIsIFwia29ubnRlXCIsIFwia29ubnRlc3RcIiwgXCJrb25udGVuXCIsIFwia29ubnRldFwiLCBcImvDtm5udGVcIiwgXCJrb2VubnRlXCIsIFwia8O2bm50ZXN0XCIsIFwia29lbm50ZXN0XCIsIFwia8O2bm50ZW5cIixcblx0XCJrb2VubnRlblwiLCBcImvDtm5udGV0XCIsIFwia29lbm50ZXRcIiwgXCJtYWdcIiwgXCJtYWdzdFwiLCBcIm3Dtmd0XCIsIFwibW9lZ3RcIiwgXCJtw7ZnZVwiLCBcIm1vZWdlXCIsIFwibcO2Z2VzdFwiLCBcIm1vZWdlc3RcIiwgXCJtw7ZnZXRcIiwgXCJtb2VnZXRcIixcblx0XCJtb2NodGVcIiwgXCJtb2NodGVzdFwiLCBcIm1vY2h0ZW5cIiwgXCJtb2NodGV0XCIsIFwibcO2Y2h0ZVwiLCBcIm1vZWNodGVcIiwgXCJtw7ZjaHRlc3RcIiwgXCJtb2VjaHRlc3RcIiwgXCJtw7ZjaHRlblwiLCBcIm1vZWNodGVuXCIsIFwibcO2Y2h0ZXRcIixcblx0XCJtb2VjaHRldFwiLCBcIm11c3NcIiwgXCJtdcOfXCIsIFwibXVzc3RcIiwgXCJtdcOfdFwiLCBcIm3DvHNzdFwiLCBcIm11ZXNzdFwiLCBcIm3DvMOfdFwiLCBcIm11ZcOfdFwiLCBcIm3DvHNzZVwiLCBcIm11ZXNzZVwiLCBcIm3DvHNzZXN0XCIsIFwibXVlc3Nlc3RcIixcblx0XCJtw7xzc2V0XCIsIFwibXVlc3NldFwiLCBcIm11c3N0ZVwiLCBcIm11w590ZVwiLCBcIm11c3N0ZXN0XCIsIFwibXXDn3Rlc3RcIiwgXCJtdXNzdGVuXCIsIFwibXXDn3RlblwiLFx0XCJtdXNzdGV0XCIsIFwibXXDn3RldFwiLCBcIm3DvHNzdGVcIiwgXCJtdWVzc3RlXCIsXG5cdFwibcO8w590ZVwiLCBcIm11ZcOfdGVcIiwgXCJtw7xzc3Rlc3RcIiwgXCJtdWVzc3Rlc3RcIiwgXCJtw7zDn3Rlc3RcIiwgXCJtdWXDn3Rlc3RcIiwgXCJtw7xzc3RlblwiLCBcIm11ZXNzdGVuXCIsIFwibcO8w590ZW5cIiwgXCJtdWXDn3RlblwiLCBcIm3DvHNzdGV0XCIsXG5cdFwibXVlc3N0ZXRcIiwgXCJtw7zDn3RldFwiLCBcIm11ZcOfdGV0XCIsIFwic29sbFwiLCBcInNvbGxzdFwiLCBcInNvbGx0XCIsIFwic29sbGVcIiwgXCJzb2xsZXN0XCIsIFwic29sbGV0XCIsIFwic29sbHRlXCIsIFwic29sbHRlc3RcIiwgXCJzb2xsdGVuXCIsXG5cdFwic29sbHRldFwiLCBcIndpbGxcIiwgXCJ3aWxsc3RcIiwgXCJ3b2xsdFwiLCBcIndvbGxlXCIsIFwid29sbGVzdFwiLCBcIndvbGxldFwiLCBcIndvbGx0ZVwiLCBcIndvbGx0ZXN0XCIsIFwid29sbHRlblwiLCBcIndvbGx0ZXRcIiwgXCJsYXNzZVwiLFxuXHRcImzDpHNzdFwiLCBcImxhZXNzdFwiLCBcImzDpMOfdFwiLCBcImxhZcOfdFwiLCBcImxhc3N0XCIsIFwibGHDn3RcIiwgXCJsYXNzZXN0XCIsIFwibGFzc2V0XCIsIFwibGllw59cIiwgXCJsaWXDn2VzdFwiLCBcImxpZcOfdFwiLCBcImxpZcOfZW5cIiwgXCJsaWXDn2VcIixcblx0XCJsaWXDn2V0XCIsIFwibGllc3NcIiwgXCJsaWVzc2VzdFwiLCBcImxpZXNzdFwiLCBcImxpZXNzZW5cIiwgXCJsaWVzc2VcIiwgXCJsaWVzc2V0XCIgXTtcblxudmFyIG90aGVyQXV4aWxpYXJpZXNJbmZpbml0aXZlID0gWyBcImhhYmVuXCIsIFwic2VpblwiLCBcImTDvHJmZW5cIiwgXCJkdWVyZmVuXCIsIFwia8O2bm5lblwiLCBcImtvZW5uZW5cIiwgXCJtw7ZnZW5cIiwgXCJtb2VnZW5cIiwgXCJtw7xzc2VuXCIsIFwibXVlc3NlblwiLFxuXHRcInNvbGxlblwiLCBcIndvbGxlblwiLCBcImxhc3NlblwiIF07XG5cbi8vIEZvcm1zIGZyb20gJ2F1c3NlaGVuJyB3aXRoIHR3byBwYXJ0cywgbGlrZSAnc2VoZSBhdXMnLCBhcmUgbm90IGluY2x1ZGVkLCBiZWNhdXNlIHdlIHJlbW92ZSB3b3JkcyBvbiBhbiBzaW5nbGUgd29yZCBiYXNpcy5cbnZhciBjb3B1bGEgPSBbIFwiYmxlaWJlXCIsIFwiYmxlaWJzdFwiLCBcImJsZWlidFwiLCBcImJsZWliZXN0XCIsIFwiYmxlaWJldFwiLCBcImJsaWViXCIsIFwiYmxpZWJzdFwiLCBcImJsaWVidFwiLCBcImJsaWViZW5cIiwgXCJibGllYmVcIixcblx0XCJibGllYmVzdFwiLCBcImJsaWViZXRcIiwgXCJoZWnDn2VcIiwgXCJoZWnDn3RcIiwgXCJoZWnDn2VzdFwiLCBcImhlacOfZXRcIiwgXCJoZWlzc2VcIiwgXCJoZWlzc3RcIiwgXCJoZWlzc2VzdFwiLCBcImhlaXNzZXRcIiwgXCJoaWXDn1wiLCBcImhpZcOfZXN0XCIsXG5cdFwiaGllw590XCIsIFwiaGllw59lblwiLCBcImhpZcOfZVwiLCBcImhpZcOfZXRcIiwgXCJoaWVzc1wiLCBcImhpZXNzZXN0XCIsIFwiaGllc3N0XCIsIFwiaGllc3NlblwiLFx0XCJoaWVzc2VcIiwgXCJoaWVzc2V0XCIsIFwiZ2VsdGVcIiwgXCJnaWx0c3RcIixcblx0XCJnaWx0XCIsIFwiZ2VsdGV0XCIsIFwiZ2VsdGVcIiwgXCJnZWx0ZXN0XCIsIFwiZ2FsdFwiLCBcImdhbHRlc3RcIiwgXCJnYWx0c3RcIiwgXCJnYWx0ZW5cIiwgXCJnYWx0ZXRcIiwgXCJnw6RsdGVcIiwgXCJnYWVsdGVcIiwgXCJnw7ZsdGVcIiwgXCJnb2VsdGVcIixcblx0XCJnw6RsdGVzdFwiLCBcImdhZWx0ZXN0XCIsIFwiZ8O2bHRlc3RcIiwgXCJnb2VsdGVzdFwiLCBcImfDpGx0ZW5cIiwgXCJnYWVsdGVuXCIsIFwiZ8O2bHRlblwiLCBcImdvZWx0ZW5cIiwgXCJnw6RsdGV0XCIsIFwiZ2FlbHRldFwiLCBcImfDtmx0ZXRcIixcblx0XCJnb2VsdGV0XCIsIFwiYXVzc2VoZVwiLCBcImF1c3NpZWhzdFwiLCBcImF1c3NpZWh0XCIsIFwiYXVzc2VodFwiLCBcImF1c3NlaGVzdFwiLCBcImF1c3NlaGV0XCIsIFwiYXVzc2FoXCIsIFwiYXVzc2Foc3RcIiwgXCJhdXNzYWhcIiwgXCJhdXNzYWhlblwiLFxuXHRcImF1c3NhaHRcIiwgXCJhdXNzw6RoZVwiLCBcImF1c3NhZWhlXCIsIFwiYXVzc8OkaGVzdFwiLCBcImF1c3NhZWhlc3RcIiwgXCJhdXNzw6Roc3RcIiwgXCJhdXNzYWVoc3RcIiwgXCJhdXNzw6RoZXRcIiwgXCJhdXNzYWVoZXRcIiwgXCJhdXNzw6RodFwiLFxuXHRcImF1c3NhZWh0XCIsIFwiYXVzc8OkaGVuXCIsXHRcImF1c3NhZWhlblwiLCBcInNjaGVpbmVcIiwgXCJzY2hlaW5zdFwiLCBcInNjaGVpbnRcIiwgXCJzY2hlaW5lc3RcIiwgXCJzY2hlaW5ldFwiLCBcInNjaGllblwiLCBcInNjaGllbnN0XCIsIFwic2NoaWVuZW5cIixcblx0XCJzY2hpZW50XCIsIFwic2NoaWVuZVwiLCBcInNjaGllbmVzdFwiLCBcInNjaGllbmV0XCIsIFwiZXJzY2hlaW5lXCIsIFwiZXJzY2hlaW5zdFwiLCBcImVyc2NoZWludFwiLCBcImVyc2NoZWluZXN0XCIsXG5cdFwiZXJzY2hlaW5ldFwiLCBcImVyc2NoaWVuXCIsIFwiZXJzY2hpZW5zdFwiLCBcImVyc2NoaWVuZW5cIiwgXCJlcnNjaGllbnRcIiwgXCJlcnNjaGllbmVcIiwgXCJlcnNjaGllbmVzdFwiLCBcImVyc2NoaWVuZXRcIiBdO1xuXG52YXIgY29wdWxhSW5maW5pdGl2ZSA9IFsgXCJibGVpYmVuXCIsIFwiaGVpw59lblwiLCBcImhlaXNzZW5cIiwgXCJnZWx0ZW5cIiwgXCJhdXNzZWhlblwiLCBcInNjaGVpbmVuXCIsIFwiZXJzY2hlaW5lblwiIF07XG5cbnZhciBwcmVwb3NpdGlvbnMgPSBbIFwiYVwiLCBcIsOgXCIsIFwiYWJcIiwgXCJhYnNlaXRzXCIsIFwiYWJ6w7xnbGljaFwiLCBcImFienVlZ2xpY2hcIiwgXCJhbHNcIiwgXCJhbVwiLCBcImFuXCIsIFwiYW5mYW5nc1wiLCBcImFuZ2VsZWdlbnRsaWNoXCIsXG5cdFwiYW5nZXNpY2h0c1wiLCBcImFuaGFuZFwiLCBcImFubMOkc3NsaWNoXCIsIFwiYW5sYWVzc2xpY2hcIiwgXCJhbnNcIiwgXCJhbnN0YXR0XCIsIFwiYW5zdGVsbGVcIiwgXCJhdWZcIiwgXCJhdWZncnVuZFwiLCBcImF1ZnNcIiwgXCJhdWZzZWl0ZW5cIixcblx0XCJhdXNcIiwgXCJhdXNnYW5nc1wiLCBcImF1c2dlbm9tbWVuXCIsIFwiYXVzc2NobGllw59saWNoXCIsIFwiYXVzc2NobGllc3NsaWNoXCIsIFwiYXVzc2VyXCIsIFwiYXXDn2VyXCIsIFwiYXXDn2VyaGFsYlwiLCBcImF1c3NlcmhhbGJcIiwgXCJhdXN3ZWlzbGljaFwiLFxuXHRcImJhclwiLCBcImJlaHVmc1wiLCBcImJlaVwiLCBcImJlaWRzZWl0c1wiLCBcImJlaWRlcnNlaXRzXCIsIFwiYmVpbVwiLCBcImJldHJlZmZzXCIsIFwiYmV6w7xnbGljaFwiLCBcImJlenVlZ2xpY2hcIiwgXCJiaW5uZW5cIiwgXCJiaXNcIiwgXCJjb250cmFcIixcblx0XCJkYW5rXCIsIFwiZGllc3NlaXRzXCIsIFwiZHVyY2hcIiwgXCJlaW5iZXrDvGdsaWNoXCIsIFwiZWluYmV6dWVnbGljaFwiLCBcImVpbmdhbmdzXCIsIFwiZWluZ2VkZW5rXCIsIFwiZWluc2NobGllw59saWNoXCIsIFwiZWluc2NobGllc3NsaWNoXCIsXG5cdFwiZW50Z2VnZW5cIiwgXCJlbnRsYW5nXCIsIFwiZW50c3ByZWNoZW5kXCIsIFwiZXhrbHVzaXZlXCIsIFwiZmVyblwiLCBcImZlcm5hYlwiLCBcImZ1ZXJcIiwgXCJmw7xyXCIsIFwiZnVlcnNcIiwgXCJmw7xyc1wiLCBcImdlZ2VuXCIsIFwiZ2VnZW7DvGJlclwiLFxuXHRcImdlZ2VudWViZXJcIiwgXCJnZWxlZ2VudGxpY2hcIiwgXCJnZW3DpMOfXCIsIFwiZ2VtYWXDn1wiLCBcImdlblwiLCBcImdldHJldVwiLCBcImdsZWljaFwiLCBcImhhbGJlclwiLCBcImhpbnNpY2h0bGljaFwiLCBcImhpbnRlclwiLCBcImhpbnRlcm1cIiwgXCJoaW50ZXJzXCIsXG5cdFwiaW1cIiwgXCJpblwiLCBcImluZm9sZ2VcIiwgXCJpbmtsdXNpdmVcIiwgXCJpbm1pdHRlblwiLCBcImlubmVyaGFsYlwiLCBcImlubmVydFwiLCBcImluc1wiLCBcImplXCIsIFwiamVuc2VpdHNcIiwgXCJrb250cmFcIiwgXCJrcmFmdFwiLFxuXHRcImxhbmdcIiwgXCJsw6RuZ3NcIiwgXCJsYWVuZ3NcIiwgXCJsw6RuZ3NzZWl0c1wiLCBcImxhZW5nc3NlaXRzXCIsIFwibGF1dFwiLCBcImxpbmtzXCIsIFwibWFuZ2Vsc1wiLCBcIm1pbnVzXCIsIFwibWl0XCIsIFwibWl0aGlsZmVcIiwgXCJtaXRzYW10XCIsIFwibWl0dGVsc1wiLFxuXHRcIm5hY2hcIixcdFwibsOkY2hzdFwiLCBcIm5hZWNoc3RcIiwgXCJuYWhcIiwgXCJuYW1lbnNcIiwgXCJuZWJlblwiLCBcIm5lYnN0XCIsIFwibsO2cmRsaWNoXCIsIFwibm9lcmRsaWNoXCIsIFwibm9yZMO2c3RsaWNoXCIsIFwibm9yZG9lc3RsaWNoXCIsIFwibm9yZHdlc3RsaWNoXCIsXG5cdFwib2JcIiwgXCJvYmVyaGFsYlwiLCBcIm9obmVcIiwgXCLDtnN0bGljaFwiLCBcIm9lc3RsaWNoXCIsIFwicGVyXCIsIFwicGx1c1wiLCBcInByb1wiLCBcInF1ZXJcIiwgXCJyZWNodHNcIiwgXCJyw7xja3NpY2h0bGljaFwiLCBcInJ1ZWNrc2ljaHRsaWNoXCIsXG5cdFwic2FtdFwiLCBcInNlaXRcIiwgXCJzZWl0ZW5zXCIsIFwic2VpdGxpY2hcIiwgXCJzZWl0d8OkcnRzXCIsIFwic2VpdHdhZXJ0c1wiLCBcInN0YXR0XCIsIFwic8O8ZGxpY2hcIiwgXCJzdWVkbGljaFwiLCBcInPDvGTDtnN0bGljaFwiLCBcInN1ZWRvZXN0bGljaFwiLFxuXHRcInPDvGR3ZXN0bGljaFwiLCBcInN1ZWR3ZXN0bGljaFwiLCBcInRyb3R6XCIsIFwiw7xiZXJcIiwgXCJ1ZWJlclwiLCBcIsO8YmVybVwiLCBcInVlYmVybVwiLCBcIsO8YmVyblwiLCBcInVlYmVyblwiLCBcIsO8YmVyc1wiLCBcInVlYmVyc1wiLCBcInVtXCIsIFwidW1zXCIsXG5cdFwidW5iZXNjaGFkZXRcIiwgXCJ1bmVyYWNodGV0XCIsIFwidW5mZXJuXCIsIFwidW5nZWFjaHRldFwiLCBcInVudGVyXCIsIFwidW50ZXJoYWxiXCIsIFwidW50ZXJtXCIsIFwidW50ZXJuXCIsIFwidW50ZXJzXCIsIFwidW53ZWl0XCIsIFwidmVybWl0dGVsc1wiLFxuXHRcInZlcm1pdHRlbHN0XCIsIFwidmVybcO2Z2VcIiwgXCJ2ZXJtb2VnZVwiLCBcInZpYVwiLCBcInZvbVwiLCBcInZvblwiLCBcInZvbnNlaXRlblwiLCBcInZvclwiLCBcInZvcmJlaGFsdGxpY2hcIiwgXCJ3ZWdlblwiLCBcIndpZGVyXCIsIFwid8OkaHJlbmRcIixcblx0XCJ3YWVocmVuZFwiLCBcInplaXRcIiwgXCJ6dVwiLCBcInp1Zm9sZ2VcIiwgXCJ6dWd1bnN0ZW5cIiwgXCJ6dWxpZWJcIiwgXCJ6dWxpZWJlXCIsIFwienVtXCIsIFwienVyXCIsIFwienVzw6R0emxpY2hcIiwgXCJ6dXNhZXR6bGljaFwiLCBcInp1dW5ndW5zdGVuXCIsXG5cdFwienV3aWRlclwiLCBcInp1esO8Z2xpY2hcIixcdFwienV6dWVnbGljaFwiLCBcInp3ZWNrc1wiLCBcInp3aXNjaGVuXCIgXTtcblxuLy8gTWFueSBjb29yZGluYXRpbmcgY29uanVuY3Rpb25zIGFyZSBhbHJlYWR5IGluY2x1ZGVkIGluIHRoZSB0cmFuc2l0aW9uIHdvcmRzIGxpc3QuXG52YXIgY29vcmRpbmF0aW5nQ29uanVuY3Rpb25zID0gWyBcInVuZFwiLCBcIm9kZXJcIiwgXCJhbHNcIiwgXCJ1bXNvXCIgXTtcblxuLypcbidFbnR3ZWRlcicgaXMgcGFydCBvZiAnd250d2VkZXIuLi5vZGVyJywgJ3Nvd29obCcsICdhdWNoJyBpcyBwYXJ0IG9mICdzb3dvaGwgYWxzLi4uYXVjaCcsICd3ZWRlcicgYW5kICdub2NoJyBhcmUgcGFydCBvZiAnd2VkZXIuLi5ub2NoJyxcbiAnbnVyJyBpcyBwYXJ0IG9mICduaWNodCBudXIuLi5zb25kZXJuIGF1Y2gnLlxuICovXG52YXIgY29ycmVsYXRpdmVDb25qdW5jdGlvbnMgPSBbIFwiZW50d2VkZXJcIiwgXCJzb3dvaGxcIiwgXCJhdWNoXCIsIFwid2VkZXJcIiwgXCJub2NoXCIsIFwibnVyXCIgXTtcblxuLy8gTWFueSBzdWJvcmRpbmF0aW5nIGNvbmp1bmN0aW9ucyBhcmUgYWxyZWFkeSBpbmNsdWRlZCBpbiB0aGUgcHJlcG9zaXRpb25zIGxpc3QsIHRyYW5zaXRpb24gd29yZHMgbGlzdCBvciBwcm9ub21pbmFsIGFkdmVyYnMgbGlzdC5cbnZhciBzdWJvcmRpbmF0aW5nQ29uanVuY3Rpb25zID0gWyBcIm51blwiLCBcInNvXCIsIFwiZ2xlaWNod29obFwiIF07XG5cbi8qXG5UaGVzZSB2ZXJicyBhcmUgZnJlcXVlbnRseSB1c2VkIGluIGludGVydmlld3MgdG8gaW5kaWNhdGUgcXVlc3Rpb25zIGFuZCBhbnN3ZXJzLiAnRnJhZ2UnIGFuZCAnZnJhZ2VuJyBhcmUgbm90IGluY2x1ZGVkLFxuYmVjYXVzZSB0aG9zZSB3b3JkcyBhcmUgYWxzbyBub3Vucy5cbiAqL1xudmFyIGludGVydmlld1ZlcmJzID0gWyBcInNhZ2VcIiwgXCJzYWdzdFwiLCBcInNhZ3RcIiwgXCJzYWdlc3RcIiwgXCJzYWdldFwiLCBcInNhZ3RlXCIsIFwic2FndGVzdFwiLCBcInNhZ3RlXCIsIFwic2FndGVuXCIsIFwic2FndGV0XCIsIFwiZ2VzYWd0XCIsXG5cdFwiZnJhZ3N0XCIsIFwiZnJhZ3RcIiwgXCJmcmFnZXN0XCIsIFwiZnJhZ2V0XCIsIFwiZnJhZ3RlXCIsIFwiZnJhZ3Rlc3RcIiwgXCJmcmFndGVuXCIsIFwiZnJhZ3RldFwiLCBcImdlZnJhZ3RcIiwgXCJlcmtsw6RyZVwiLCBcImVya2zDpHJzdFwiLCBcImVya2zDpHJ0XCIsXG5cdFwiZXJrbGFlcmVcIiwgXCJlcmtsYWVyc3RcIiwgXCJlcmtsYWVydFwiLCBcImVya2zDpHJ0ZVwiLCBcImVya2zDpHJ0ZXN0XCIsIFwiZXJrbMOkcnRlXCIsXHRcImVya2zDpHJ0ZXRcIiwgXCJlcmtsw6RydGVuXCIsXG5cdFwiZXJrbGFlcnRlXCIsIFwiZXJrbGFlcnRlc3RcIiwgXCJlcmtsYWVydGVcIiwgXCJlcmtsYWVydGV0XCIsIFwiZXJrbGFlcnRlblwiLCBcImRlbmtlXCIsIFwiZGVua3N0XCIsIFwiZGVua3RcIiwgXCJkZW5rZXN0XCIsIFwiZGVua2V0XCIsXG5cdFwiZGFjaHRlXCIsIFwiZGFjaHRlc3RcIiwgXCJkYWNodGVuXCIsIFwiZGFjaHRldFwiLCBcImTDpGNodGVcIiwgXCJkw6RjaHRlc3RcIiwgXCJkw6RjaHRlblwiLCBcImTDpGNodGV0XCIsIFwiZGFlY2h0ZVwiLCBcImRhZWNodGVzdFwiLCBcImRhZWNodGVuXCIsXG5cdFwiZGFlY2h0ZXRcIiwgXCJmaW5kZVwiLCBcImZpbmRlc3RcIiwgXCJmaW5kZXRcIiwgXCJnZWZ1bmRlblwiIF07XG5cbnZhciBpbnRlcnZpZXdWZXJic0luZmluaXRpdmUgPSBbIFwic2FnZW5cIiwgXCJlcmtsw6RyZW5cIiwgXCJlcmtsYWVyZW5cIiwgXCJkZW5rZW5cIiwgXCJmaW5kZW5cIiBdO1xuXG4vLyBUaGVzZSB0cmFuc2l0aW9uIHdvcmRzIHdlcmUgbm90IGluY2x1ZGVkIGluIHRoZSBsaXN0IGZvciB0aGUgdHJhbnNpdGlvbiB3b3JkIGFzc2Vzc21lbnQgZm9yIHZhcmlvdXMgcmVhc29ucy5cbnZhciBhZGRpdGlvbmFsVHJhbnNpdGlvbldvcmRzID0gWyBcImV0d2FcIiwgXCJhYnNvbHV0XCIsIFwidW5iZWRpbmd0XCIsIFwid2llZGVyXCIsIFwiZGVmaW5pdGl2XCIsIFwiYmVzdGltbXRcIiwgXCJpbW1lclwiLCBcIsOkdcOfZXJzdFwiLCBcImFldcOfZXJzdFwiLFxuXHRcImjDtmNoc3RcIiwgXCJob2VjaHN0XCIsIFwic29mb3J0XCIsIFwiYXVnZW5ibGlja2xpY2hcIiwgXCJ1bWdlaGVuZFwiLCBcImRpcmVrdFwiLCBcInVubWl0dGVsYmFyXCIsIFwibsOkbWxpY2hcIiwgXCJuYWVtbGljaFwiLCBcIm5hdMO8cmxpY2hcIiwgXCJuYXR1ZXJsaWNoXCIsXG5cdFwiYmVzb25kZXJzXCIsIFwiaGF1cHRzw6RjaGxpY2hcIiwgXCJoYXVwdHNhZWNobGljaFwiLCBcImpldHp0XCIsIFwiZWJlblwiLCBcImhldXRlXCIsIFwiaGV1dHp1dGFnZVwiLCBcInBvc2l0aXZcIiwgXCJlaW5kZXV0aWdcIiwgXCJ3aXJrbGljaFwiLCBcImVjaHRcIixcblx0XCJ3YWhyaGFmdFwiLCBcImVocmxpY2hcIiwgXCJhdWZyaWNodGlnXCIsIFwid2FocmhhZnRcIiwgXCJ3YWhyaGVpdHNnZW3DpMOfXCIsIFwidHJldVwiLCBcImxldHp0bGljaFwiLCBcImVpbm1hbGlnXCIsIFwidW7DvGJlcnRyZWZmbGljaFwiLCBcIm5vcm1hbGVyd2Vpc2VcIixcblx0XCJnZXfDtmhubGljaFwiLCBcImdld29laG5saWNoXCIsIFwiw7xibGljaGVyd2Vpc2VcIiwgXCJ1ZWJsaWNoZXJ3ZWlzZVwiLCBcInNvbnN0XCIsIFwiZmFzdFwiLCBcIm5haGV6dVwiLCBcImJlaW5haGVcIiwgXCJrbmFwcFwiLCBcImFubsOkaGVybmRcIiwgXCJhbm5hZWhlcm5kXCIsXG5cdFwiZ2VyYWRlenVcIiwgXCJ6aWVtbGljaFwiLCBcImJhbGRcIiwgXCJ2aWVsbGVpY2h0XCIsIFwid2FocnNjaGVpbmxpY2hcIiwgXCJ3b2hsXCIsIFwidm9yYXVzc2ljaHRsaWNoXCIsICBcInp1Z2VnZWJlblwiLCBcInVyc3Byw7xuZ2xpY2hcIiwgXCJpbnNnZXNhbXRcIixcblx0XCJ0YXRzw6RjaGxpY2hcIiwgXCJlaWdlbnRsaWNoXCIsIFwid2FocmhhZnRpZ1wiLCBcImJlcmVpdHNcIiwgXCJzY2hvblwiLCBcIm9mdFwiLCBcImjDpHVmaWdcIiwgXCJoYWV1ZmlnXCIsIFwicmVnZWxtw6TDn2lnXCIsIFwicmVnZWxtYWXDn2lnXCIsIFwiZ2xlaWNobcOkw59pZ1wiLFxuXHRcImdsZWljaG1hZcOfaWdcIiwgXCJlaW5mYWNoXCIsIFwiZWluZmFjaFwiLCBcIm51clwiLCBcImxlZGlnbGljaFwiLCBcImJsb8OfXCIsIFwiYmxvc3NcIiwgXCJlYmVuXCIsIFwiaGFsdFwiLCBcIndhaGx3ZWlzZVwiLCBcImV2ZW50dWVsbFwiLCBcIm1hbmNobWFsXCIsXG5cdFwidGVpbHdlaXNlXCIsIFwibmllXCIsIFwibmllbWFsc1wiLCBcIm5pbW1lclwiLCBcImplbWFsc1wiLCBcImFsbHplaXRcIiwgXCJpcmdlbmRlaW5tYWxcIiwgXCJhbmRlcnNcIiwgXCJ2b3JhdXNnZXNldHp0XCIsIFwibW9tZW50YW5cIiwgXCJnZWdlbnfDpHJ0aWdcIixcblx0XCJnZWdlbnfDpHJ0aWdcIiwgXCJuZWJlbmJlaVwiLCBcIsO8YnJpZ2Vuc1wiLCBcInVlYnJpZ2Vuc1wiLCBcImFuZGVyc3dvXCIsIFwid29hbmRlcnNcIiwgXCJhbmRlcnN3b2hpblwiLCBcImFuZGVyb3J0c1wiLCBcImJlc29uZGVyc1wiLCBcImluc2Jlc29uZGVyZVwiLFxuXHRcIm5hbWVudGxpY2hcIiwgXCJzb25kZXJsaWNoXCIsIFwiYXVzZHLDvGNrbGljaFwiLCBcImF1c2RydWVja2xpY2hcIiwgXCJ2b2xsZW5kc1wiLCBcImvDvHJ6bGljaFwiLCBcImt1ZXJ6bGljaFwiLCBcImrDvG5nc3RcIiwgXCJqdWVuZ3N0XCIsIFwidW5sw6RuZ3N0XCIsXG5cdFwidW5sYWVuZ3N0XCIsIFwibmV1ZXJkaW5nc1wiLCBcIm5ldWxpY2hcIiwgXCJsZXR6dGVuc1wiLCBcIm5ldWVybGljaFwiLCBcInJlbGF0aXZcIiwgXCJ2ZXJow6RsdG5pc23DpMOfaWdcIiwgXCJ2ZXJoYWVsdG5pc21hZXNzaWdcIiwgXCJkZXV0bGljaFwiLCBcImtsYXJcIixcblx0XCJlaW5kZXV0aWdcIiwgXCJvZmZlbmJhclwiLCBcImFuc2NoZWluZW5kXCIsIFwiZ2VuYXVcIiwgXCJ1LmFcIiwgXCJkYW1hbHNcIiwgXCJ6dW1pbmRlc3RcIiBdO1xuXG52YXIgaW50ZW5zaWZpZXJzID0gWyBcInNlaHJcIiwgXCJyZWNodFwiLCBcIsO8YmVyYXVzXCIsIFwidWViZXJhdXNcIiwgXCJ1bmdlbWVpblwiLCBcIndlaXRhdXNcIiwgXCJlaW5pZ2VybWHDn2VuXCIsIFwiZWluaWdlcm1hc3NlblwiLCBcImdhbnpcIiwgXCJzY2hhbXBhclwiLFxuXHRcInNjaHdlclwiLCBcInN0aWVmXCIsIFwidGllcmlzY2hcIiwgXCJ1bmdsZWljaFwiLCBcInZvbGxcIiwgXCJ6aWVtbGljaFwiLCBcIsO8YmVsc3RcIiwgXCJ1ZWJlbHN0XCIsIFwic3RhcmtcIiwgXCJ2b2xrb21tZW5cIiwgXCJkdXJjaGF1c1wiLCBcImdhclwiIF07XG5cbi8vIFRoZXNlIHZlcmJzIGNvbnZleSBsaXR0bGUgbWVhbmluZy5cbnZhciBkZWxleGljYWxpc2VkVmVyYnMgPSBbIFwiZ2VzY2hpZW5lblwiLCBcIm1laW5lXCIsIFwibWVpbnN0XCIsIFwibWVpbnRcIiwgXCJtZWluZW5cIiwgXCJtZWluZXN0XCIsIFwibWVpbmV0XCIsIFwibWVpbnRlXCIsIFwibWVpbnRlc3RcIiwgXCJtZWludGVuXCIsIFwibWVpbnRldFwiLFxuXHRcImdlbWVpbnRcIiwgXCJzdGVoZVwiLCBcInN0ZWhzdFwiLCBcInN0ZWh0XCIgXTtcblxudmFyIGRlbGV4aWNhbGlzZWRWZXJic0luZmluaXRpdmUgPSBbIFwiZ2VzY2hpZW5lblwiLCBcIm1laW5lblwiLCBcInR1blwiLCBcIm1hY2hlblwiLCBcInN0ZWhlblwiLCBcIndpc3NlblwiLCBcImdlaGVuXCIsIFwia29tbWVuXCIgXTtcblxuLy8gVGhlc2UgYWRqZWN0aXZlcyBhbmQgYWR2ZXJicyBhcmUgc28gZ2VuZXJhbCwgdGhleSBzaG91bGQgbmV2ZXIgYmUgc3VnZ2VzdGVkIGFzIGEgKHNpbmdsZSkga2V5d29yZC5cbi8vIEtleXdvcmQgY29tYmluYXRpb25zIGNvbnRhaW5pbmcgdGhlc2UgYWRqZWN0aXZlcy9hZHZlcmJzIGFyZSBmaW5lLlxudmFyIGdlbmVyYWxBZGplY3RpdmVzQWR2ZXJicyA9IFsgXCJlaW5lcmxlaVwiLCBcImVnYWxcIiwgXCJuZXVcIiwgXCJuZXVlXCIsIFwibmV1ZXJcIiwgXCJuZXVlblwiLCBcIm5ldWVzXCIsIFwibmV1ZW1cIiwgXCJuZXVlcmVyXCIsIFwibmV1ZXJlblwiLCBcIm5ldWVyZW1cIiwgXCJuZXVlcmVzXCIsXG5cdFwibmV1ZXJlXCIsIFwibmV1ZXN0ZXJcIiwgXCJuZXVzdGVyXCIsIFwibmV1ZXN0ZW5cIiwgXCJuZXVzdGVuXCIsIFwibmV1ZXN0ZW1cIiwgXCJuZXVzdGVtXCIsIFwibmV1ZXN0ZXNcIiwgXCJuZXVzdGVzXCIsIFwibmV1ZXN0ZVwiLCBcIm5ldXN0ZVwiLCBcImFsdFwiLFxuXHRcImFsdGVyXCIsIFwiYWx0ZW5cIiwgXCJhbHRlbVwiLCBcImFsdGVzXCIsIFwiYWx0ZVwiLCBcIsOkbHRlcmVcIiwgXCLDpGx0ZXJlblwiLCBcIsOkbHRlcmVyXCIsIFwiw6RsdGVyZXNcIiwgXCLDpGx0ZXN0ZXJcIiwgXCLDpGx0ZXN0ZW5cIiwgXCLDpGx0ZXN0ZW1cIiwgXCLDpGx0ZXN0ZXNcIixcblx0XCLDpGx0ZXN0ZVwiLCBcImFlbHRlcmVcIiwgXCJhZWx0ZXJlblwiLCBcImFlbHRlcmVyXCIsIFwiYWVsdGVyZXNcIiwgXCJhZWx0ZXN0ZXJcIiwgXCJhZWx0ZXN0ZW5cIiwgXCJhZWx0ZXN0ZW1cIiwgXCJhZWx0ZXN0ZXNcIiwgXCJhZWx0ZXN0ZVwiLCBcImd1dFwiLCBcImd1dGVyXCIsXG5cdFwiZ3V0ZW1cIiwgXCJndXRlblwiLCBcImd1dGVzXCIsIFwiZ3V0ZVwiLCBcImJlc3NlclwiLCBcImJlc3NlcmVyXCIsIFwiYmVzc2VyZW5cIiwgXCJiZXNzZXJlbVwiLCBcImJlc3NlcmVzXCIsIFwiYmVzdGVyXCIsIFwiYmVzdGVuXCIsIFwiYmVzdGVtXCIsIFwiYmVzdGVzXCIsXG5cdFwiYmVzdGVcIiwgXCJncsO2w590ZVwiLCBcImdyw7Zzc3RlXCIsIFwiZ3Jvw59cIiwgXCJncm/Dn2VyXCIsIFwiZ3Jvw59lblwiLCBcImdyb8OfZW1cIiwgXCJncm/Dn2VzXCIsIFwiZ3Jvw59lXCIsIFwiZ3Jvw59lcmVyXCIsIFwiZ3Jvw59lcmVtXCIsIFwiZ3Jvw59lcmVuXCIsIFwiZ3Jvw59lcmVzXCIsIFwiZ3Jvw59lcmVcIixcblx0XCJncm/Dn3RlclwiLCBcImdyb8OfdGVuXCIsIFwiZ3Jvw590ZW1cIiwgXCJncm/Dn3Rlc1wiLCBcImdyb8OfdGVcIiwgXCJncm9zc1wiLCBcImdyb3NzZXJcIiwgXCJncm9zc2VuXCIsIFwiZ3Jvc3NlbVwiLCBcImdyb3NzZXNcIiwgXCJncm9zc2VcIiwgXCJncm9zc2VyZXJcIiwgXCJncm9zc2VyZW1cIixcblx0XCJncm9zc2VyZW5cIixcdFwiZ3Jvc3NlcmVzXCIsIFwiZ3Jvc3NlcmVcIiwgXCJncm9zc3RlclwiLCBcImdyb3NzdGVuXCIsIFwiZ3Jvc3N0ZW1cIiwgXCJncm9zc3Rlc1wiLCBcImdyb3NzdGVcIiwgXCJlaW5mYWNoXCIsIFwiZWluZmFjaGVyXCIsIFwiZWluZmFjaGVuXCIsXG5cdFwiZWluZmFjaGVtXCIsXHRcImVpbmZhY2hlc1wiLCBcImVpbmZhY2hlXCIsIFwiZWluZmFjaGVyZXJcIiwgXCJlaW5mYWNoZXJlblwiLCBcImVpbmZhY2hlcmVtXCIsIFwiZWluZmFjaGVyZXNcIiwgXCJlaW5mYWNoZXJlXCIsIFwiZWluZmFjaHN0ZVwiLCBcImVpbmZhY2hzdGVyXCIsXG5cdFwiZWluZmFjaHN0ZW5cIiwgXCJlaW5mYWNoc3Rlc1wiLCBcImVpbmZhY2hzdGVtXCIsIFwic2NobmVsbFwiLCBcInNjaG5lbGxlclwiLCBcInNjaG5lbGxlblwiLCBcInNjaG5lbGxlbVwiLCBcInNjaG5lbGxlc1wiLCBcInNjaG5lbGxlXCIsIFwic2NobmVsbGVyZVwiLFxuXHRcInNjaG5lbGxlcmVyXCIsIFwic2NobmVsbGVyZW5cIiwgXCJzY2huZWxsZXJlc1wiLCBcInNjaG5lbGxlcmVtXCIsIFwic2NobmVsbHN0ZXJcIiwgXCJzY2huZWxsc3RlXCIsIFwic2NobmVsbHN0ZW5cIiwgXCJzY2huZWxsc3RlbVwiLCBcInNjaG5lbGxzdGVzXCIsXG5cdFwid2VpdGVyXCIsIFwid2VpdFwiLCBcIndlaXRlblwiLCBcIndlaXRlbVwiLCBcIndlaXRlc1wiLCBcIndlaXRlcmVyXCIsIFwid2VpdGVyZW5cIiwgXCJ3ZWl0ZXJlbVwiLCBcIndlaXRlcmVzXCIsIFwid2VpdGVyZVwiLCBcIndlaXRlc3RlclwiLCBcIndlaXRlc3RlblwiLFxuXHRcIndlaXRlc3RlbVwiLCBcIndlaXRlc3Rlc1wiLCBcIndlaXRlc3RlXCIsIFwiZWlnZW5cIiwgXCJlaWdlbmVyXCIsIFwiZWlnZW5lblwiLCBcImVpZ2VuZXNcIiwgXCJlaWdlbmVtXCIsIFwiZWlnZW5lXCIsIFwiZWlnZW5lcmVyXCIsIFwiZWlnbmVyZXJcIiwgXCJlaWdlbmVyZW5cIixcblx0XCJlaWduZXJlblwiLCBcImVpZ2VuZXJlbVwiLCBcImVpZ25lcmVtXCIsIFwiZWlnZW5lcmVzXCIsIFwiZWlnbmVyZXNcIiwgXCJlaWdlbmVyZVwiLCBcImVpZ25lcmVcIiwgXCJlaWdlbnN0ZXJcIiwgXCJlaWdlbnN0ZW5cIiwgXCJlaWdlbnN0ZW1cIiwgXCJlaWdlbnN0ZXNcIixcblx0XCJlaWdlbnN0ZVwiLCBcIndlbmlnXCIsIFwid2VuaWdlclwiLCBcIndlbmlnZW5cIiwgXCJ3ZW5pZ2VtXCIsIFwid2VuaWdlc1wiLCBcIndlbmlnZXJlclwiLCBcIndlbmlnZXJlc1wiLCBcIndlbmlnZXJlbVwiLCBcIndlbmlnZXJlblwiLCBcIndlbmlnZXJlXCIsXG5cdFwid2VuaWdzdGVyXCIsIFwid2VuaWdzdGVuXCIsIFwid2VuaWdzdGVtXCIsIFwid2VuaWdzdGVzXCIsIFwid2VuaWdzdGVcIiwgXCJtaW5kZXJlclwiLCBcIm1pbmRlcmVuXCIsIFwibWluZGVyZW1cIiwgXCJtaW5kZXJlXCIsIFwibWluZGVyZXNcIiwgXCJtaW5kZXN0ZXJcIixcblx0XCJtaW5kZXN0ZW5cIiwgXCJtaW5kZXN0ZXNcIiwgXCJtaW5kZXN0ZW1cIiwgXCJtaW5kZXN0ZVwiLCBcImxhbmdcIiwgXCJsYW5nZXJcIiwgXCJsYW5nZW5cIiwgXCJsYW5nZW1cIiwgXCJsYW5nZXNcIiwgXCJsw6RuZ2VyZXJcIiwgXCJsw6RuZ2VyZW5cIiwgXCJsw6RuZ2VyZW1cIixcblx0XCJsw6RuZ2VyZXNcIiwgXCJsw6RuZ2VyZVwiLCBcImzDpG5nc3RlclwiLCBcImzDpG5nc3RlblwiLCBcImzDpG5nc3RlbVwiLCBcImzDpG5nc3Rlc1wiLCBcImzDpG5nc3RlXCIsIFwibGFlbmdlcmVyXCIsIFwibGFlbmdlcmVuXCIsIFwibGFlbmdlcmVtXCIsXG5cdFwibGFlbmdlcmVzXCIsIFwibGFlbmdlcmVcIiwgXCJsYWVuZ3N0ZXJcIiwgXCJsYWVuZ3N0ZW5cIiwgXCJsYWVuZ3N0ZW1cIiwgXCJsYWVuZ3N0ZXNcIiwgXCJsYWVuZ3N0ZVwiLCBcInRpZWZcIiwgXCJ0aWVmZXJcIiwgXCJ0aWVmZW5cIiwgXCJ0aWVmZW1cIiwgXCJ0aWVmZXNcIixcblx0XCJ0aWVmZVwiLCBcInRpZWZlcmVyXCIsIFwidGllZmVyZW5cIiwgXCJ0aWVmZXJlbVwiLCBcInRpZWZlcmVzXCIsIFwidGllZmVyZVwiLCBcInRpZWZzdGVyXCIsIFwidGllZnN0ZW5cIiwgXCJ0aWVmc3RlbVwiLCBcInRpZWZzdGVcIiwgXCJ0aWVmc3Rlc1wiLCBcImhvY2hcIixcblx0XCJob2hlclwiLCBcImhvaGVuXCIsIFwiaG9oZW1cIiwgXCJob2hlc1wiLCBcImhvaGVcIiwgXCJow7ZoZXJlclwiLCBcImjDtmhlcmVcIiwgXCJow7ZoZXJlblwiLCBcImjDtmhlcmVtXCIsIFwiaMO2aGVyZXNcIiwgXCJob2VoZXJlclwiLCBcImhvZWhlcmVcIiwgXCJob2VoZXJlblwiLFxuXHRcImhvZWhlcmVtXCIsIFwiaG9laGVyZXNcIiwgXCJow7ZjaHN0ZXJcIiwgXCJow7ZjaHN0ZVwiLCBcImjDtmNoc3RlblwiLCBcImjDtmNoc3RlbVwiLCBcImjDtmNoc3Rlc1wiLCBcImhvZWNoc3RlclwiLCBcImhvZWNoc3RlXCIsIFwiaG9lY2hzdGVuXCIsIFwiaG9lY2hzdGVtXCIsXG5cdFwiaG9lY2hzdGVzXCIsIFwicmVndWzDpHJcIiwgXCJyZWd1bMOkcmVyXCIsIFwicmVndWzDpHJlblwiLCBcInJlZ3Vsw6RyZW1cIiwgXCJyZWd1bMOkcmVzXCIsIFwicmVndWzDpHJlXCIsIFwicmVndWxhZXJcIiwgXCJyZWd1bGFlcmVyXCIsIFwicmVndWxhZXJlblwiLFxuXHRcInJlZ3VsYWVyZW1cIiwgXCJyZWd1bGFlcmVzXCIsIFwicmVndWxhZXJlXCIsIFwicmVndWzDpHJlcmVyXCIsIFwicmVndWzDpHJlcmVuXCIsIFwicmVndWzDpHJlcmVtXCIsIFwicmVndWzDpHJlcmVzXCIsIFwicmVndWzDpHJlcmVcIiwgXCJyZWd1bGFlcmVyZXJcIixcblx0XCJyZWd1bGFlcmVyZW5cIiwgXCJyZWd1bGFlcmVyZW1cIiwgXCJyZWd1bGFlcmVyZXNcIiwgXCJyZWd1bGFlcmVyZVwiLCBcInJlZ3Vsw6Ryc3RlclwiLCBcInJlZ3Vsw6Ryc3RlblwiLCBcInJlZ3Vsw6Ryc3RlbVwiLCBcInJlZ3Vsw6Ryc3Rlc1wiLCBcInJlZ3Vsw6Ryc3RlXCIsXG5cdFwicmVndWxhZXJzdGVyXCIsIFwicmVndWxhZXJzdGVuXCIsIFwicmVndWxhZXJzdGVtXCIsIFwicmVndWxhZXJzdGVzXCIsIFwicmVndWxhZXJzdGVcIiwgXCJub3JtYWxcIiwgXCJub3JtYWxlclwiLCBcIm5vcm1hbGVuXCIsIFwibm9ybWFsZW1cIiwgXCJub3JtYWxlc1wiLFxuXHRcIm5vcm1hbGVcIiwgXCJub3JtYWxlcmVyXCIsIFwibm9ybWFsZXJlblwiLCBcIm5vcm1hbGVyZW1cIiwgXCJub3JtYWxlcmVzXCIsIFwibm9ybWFsZXJlXCIsIFwibm9ybWFsc3RlclwiLCBcIm5vcm1hbHN0ZW5cIiwgXCJub3JtYWxzdGVtXCIsIFwibm9ybWFsc3Rlc1wiLFxuXHRcIm5vcm1hbHN0ZVwiLCBcImVpbmZhY2hcIiwgXCJlaW5mYWNoZXJcIiwgXCJlaW5mYWNoZW5cIiwgXCJlaW5mYWNoZW1cIiwgXCJlaW5mYWNoZXNcIiwgXCJlaW5mYWNoZVwiLCBcImVpbmZhY2hlcmVyXCIsIFwiZWluZmFjaGVyZW5cIiwgXCJlaW5mYWNoZXJlbVwiLFxuXHRcImVpbmZhY2hlcmVzXCIsIFwiZWluZmFjaGVyZVwiLCBcImVpbmZhY2hzdGVyXCIsIFwiZWluZmFjaHN0ZW5cIiwgXCJlaW5mYWNoc3RlbVwiLCBcImVpbmZhY2hzdGVzXCIsIFwiZWluZmFjaHN0ZVwiLCBcImtsZWluXCIsIFwia2xlaW5lclwiLCBcImtsZWluZW5cIixcblx0XCJrbGVpbmVtXCIsIFwia2xlaW5lc1wiLCBcImtsZWluZVwiLCBcImtsZWluZXJlclwiLCBcImtsZWluZXJlc1wiLCBcImtsZWluZXJlblwiLCBcImtsZWluZXJlbVwiLCBcImtsZWluZXJlXCIsIFwia2xlaW5zdGVyXCIsIFwia2xlaW5zdGVuXCIsIFwia2xlaW5zdGVtXCIsXG5cdFwia2xlaW5zdGVzXCIsIFwia2xlaW5zdGVcIiwgXCJ3aW56aWdcIiwgXCJ3aW56aWdlclwiLCBcIndpbnppZ2VuXCIsIFwid2luemlnZW1cIiwgXCJ3aW56aWdlc1wiLCBcIndpbnppZ2VyZXJcIiwgXCJ3aW56aWdlcmVuXCIsIFwid2luemlnZXJlbVwiLCBcIndpbnppZ2VyZXNcIixcblx0XCJ3aW56aWdlcmVcIiwgXCJ3aW56aWdzdGVyXCIsIFwid2luemlnc3RlblwiLCBcIndpbnppZ3N0ZW1cIiwgXCJ3aW56aWdzdGVcIiwgXCJ3aW56aWdzdGVzXCIsIFwic29nZW5hbm50XCIsIFwic29nZW5hbm50ZXJcIiwgXCJzb2dlbmFubnRlblwiLFxuXHRcInNvZ2VuYW5udGVtXCIsIFwic29nZW5hbm50ZXNcIiwgXCJzb2dlbmFubnRlXCIsIFwia3VyelwiLCBcImt1cnplclwiLCBcImt1cnplblwiLCBcImt1cnplbVwiLCBcImt1cnplc1wiLCBcImt1cnplXCIsIFwia8O8cnplcmVyXCIsIFwia8O8cnplcmVzXCIsIFwia8O8cnplcmVuXCIsXG5cdFwia8O8cnplcmVtXCIsIFwia8O8cnplcmVcIiwgXCJrdWVyemVyZXJcIiwgXCJrdWVyemVyZXNcIiwgXCJrdWVyemVyZW5cIiwgXCJrdWVyemVyZW1cIiwgXCJrdWVyemVyZVwiLCBcImvDvHJ6ZXN0ZXJcIiwgXCJrw7xyemVzdGVuXCIsIFwia8O8cnplc3RlbVwiLCBcImvDvHJ6ZXN0ZXNcIixcblx0XCJrw7xyemVzdGVcIiwgXCJrdWVyemVzdGVyXCIsIFwia3Vlcnplc3RlblwiLCBcImt1ZXJ6ZXN0ZW1cIiwgXCJrdWVyemVzdGVzXCIsIFwia3Vlcnplc3RlXCIsIFwid2lya2xpY2hlclwiLCBcIndpcmtsaWNoZW5cIiwgXCJ3aXJrbGljaGVtXCIsIFwid2lya2xpY2hlc1wiLFxuXHRcIndpcmtsaWNoZVwiLCBcIndpcmtsaWNoZXJlclwiLCBcIndpcmtsaWNoZXJlblwiLCBcIndpcmtsaWNoZXJlbVwiLCBcIndpcmtsaWNoZXJlc1wiLCBcIndpcmtsaWNoZXJlXCIsIFwid2lya2xpY2hzdGVyXCIsIFwid2lya2xpY2hzdGVuXCIsXG5cdFwid2lya2xpY2hzdGVzXCIsIFwid2lya2xpY2hzdGVtXCIsIFwid2lya2xpY2hzdGVcIiwgXCJlaWdlbnRsaWNoXCIsIFwiZWlnZW50bGljaGVyXCIsIFwiZWlnZW50bGljaGVuXCIsIFwiZWlnZW50bGljaGVtXCIsIFwiZWlnZW50bGljaGVzXCIsIFwiZWlnZW50bGljaGVcIixcblx0XCJzY2jDtm5cIiwgXCJzY2jDtm5lclwiLCBcInNjaMO2bmVuXCIsIFwic2Now7ZuZW1cIiwgXCJzY2jDtm5lc1wiLCBcInNjaMO2bmVcIiwgXCJzY2jDtm5lcmVyXCIsIFwic2Now7ZuZXJlblwiLCBcInNjaMO2bmVyZW1cIiwgXCJzY2jDtm5lcmVzXCIsIFwic2Now7ZuZXJlXCIsIFwic2Now7Zuc3RlclwiLFxuXHRcInNjaMO2bnN0ZW5cIiwgXCJzY2jDtm5zdGVtXCIsIFwic2Now7Zuc3Rlc1wiLCBcInNjaMO2bnN0ZVwiLCBcInJlYWxcIiwgXCJyZWFsZXJcIiwgXCJyZWFsZW5cIiwgXCJyZWFsZW1cIiwgXCJyZWFsZXNcIiwgXCJyZWFsZXJlclwiLCBcInJlYWxlcmVuXCIsIFwicmVhbGVyZW1cIixcblx0XCJyZWFsZXJlc1wiLCBcInJlYWxlcmVcIiwgXCJyZWFsc3RlclwiLCBcInJlYWxzdGVuXCIsIFwicmVhbHN0ZW1cIiwgXCJyZWFsc3Rlc1wiLCBcInJlYWxzdGVcIiwgXCJkZXJzZWxiZVwiLCBcImRlbnNlbGJlblwiLCBcImRlbXNlbGJlblwiLCBcImRlc3NlbGJlblwiLFxuXHRcImRhc3NlbGJlXCIsIFwiZGllc2VsYmVcIiwgXCJkZXJzZWxiZW5cIiwgXCJkaWVzZWxiZW5cIiwgXCJnbGVpY2hcIiwgXCJnbGVpY2hlclwiLCBcImdsZWljaGVuXCIsIFwiZ2xlaWNoZW1cIiwgXCJnbGVpY2hlc1wiLCBcImdsZWljaGVcIiwgXCJnbGVpY2hlcmVyXCIsXG5cdFwiZ2xlaWNoZXJlblwiLCBcImdsZWljaGVyZW1cIiwgXCJnbGVpY2hlcmVzXCIsIFwiZ2xlaWNoZXJlXCIsIFwiZ2xlaWNoc3RlclwiLCBcImdsZWljaHN0ZW5cIiwgXCJnbGVpY2hzdGVtXCIsIFwiZ2xlaWNoc3Rlc1wiLCBcImdsZWljaHN0ZVwiLCBcImJlc3RpbW10ZXJcIixcblx0XCJiZXN0aW1tdGVuXCIsIFwiYmVzdGltbXRlbVwiLCBcImJlc3RpbW10ZXNcIiwgXCJiZXN0aW1tdGVcIiwgXCJiZXN0aW1tdGVyZVwiLCBcImJlc3RpbW10ZXJlclwiLCBcImJlc3RpbW10ZXJlbVwiLCBcImJlc3RpbW10ZXJlblwiLCBcImJlc3RpbW10ZXJlc1wiLFxuXHRcImJlc3RpbW10ZXN0ZXJcIiwgXCJiZXN0aW1tdGVzdGVuXCIsIFwiYmVzdGltbXRlc3RlbVwiLCBcImJlc3RpbW10ZXN0ZXNcIiwgXCJiZXN0aW1tdGVzdGVcIiwgXCJoYXVwdHPDpGNobGljaFwiLCBcImhhdXB0c2FlY2hsaWNoXCIsIFwiw7xiZXJ3aWVnZW5kXCIsXG5cdFwidWViZXJ3aWVnZW5kXCIsIFwienVtZWlzdFwiLCBcIm1laXN0ZW5zXCIsIFwibWVpc3RlblwiLCBcImvDvHJ6bGljaFwiLCBcImt1ZXJ6bGljaFwiLCBcImdyb8OfZW50ZWlsc1wiLCBcImdyb3NzZW50ZWlsc1wiLCBcIm1laXN0ZW50ZWlsc1wiLCBcImdld8O2aG5saWNoXCIsXG5cdFwiZ2V3b2VobmxpY2hcIiwgXCJow6R1ZmlnXCIsIFwiaGFldWZpZ1wiLCBcIndlaXRoaW5cIiwgXCJzdMOkbmRpZ1wiLCBcInN0YWVuZGlnXCIsIFwibGF1ZmVuZFwiLCBcImRhdWVybmRcIiwgXCJhbmRhdWVybmRcIiwgXCJpbW1lcmZvcnRcIiwgXCJpcmdlbmR3b1wiLCBcImlyZ2VuZHdhbm5cIixcblx0XCLDpGhubGljaGVyXCIsIFwiw6RobmxpY2hlblwiLCBcIsOkaG5saWNoZW1cIiwgXCLDpGhubGljaGVzXCIsIFwiw6RobmxpY2hlXCIsIFwiw6RobmxpY2hcIiwgXCLDpGhubGljaGVyZXJcIiwgXCLDpGhubGljaGVyZW5cIiwgXCLDpGhubGljaGVyZW1cIiwgXCLDpGhubGljaGVyZXNcIixcblx0XCLDpGhubGljaGVyZVwiLCBcIsOkaG5saWNoc3RlclwiLCBcIsOkaG5saWNoc3RlblwiLCBcIsOkaG5saWNoc3RlbVwiLCBcIsOkaG5saWNoc3Rlc1wiLCBcIsOkaG5saWNoc3RlXCIsIFwic2NobGVjaHRcIiwgXCJzY2hsZWNodGVyXCIsIFwic2NobGVjaHRlblwiLFxuXHRcInNjaGxlY2h0ZW1cIiwgXCJzY2hsZWNodGVzXCIsIFwic2NobGVjaHRlXCIsIFwic2NobGVjaHRlcmVyXCIsIFwic2NobGVjaHRlcmVuXCIsIFwic2NobGVjaHRlcmVtXCIsIFwic2NobGVjaHRlcmVzXCIsIFwic2NobGVjaHRlcmVcIiwgXCJzY2hsZWNodGVzdGVyXCIsXG5cdFwic2NobGVjaHRlc3RlblwiLCBcInNjaGxlY2h0ZXN0ZW1cIiwgXCJzY2hsZWNodGVzdGVzXCIsIFwic2NobGVjaHRlc3RlXCIsIFwic2NobGltbVwiLCBcInNjaGxpbW1lclwiLCBcInNjaGxpbW1lblwiLCBcInNjaGxpbW1lbVwiLCBcInNjaGxpbW1lc1wiLFxuXHRcInNjaGxpbW1lXCIsIFwic2NobGltbWVyZXJcIiwgXCJzY2hsaW1tZXJlblwiLCBcInNjaGxpbW1lcmVtXCIsIFwic2NobGltbWVyZXNcIiwgXCJzY2hsaW1tZXJlXCIsIFwic2NobGltbXN0ZXJcIiwgXCJzY2hsaW1tc3RlblwiLCBcInNjaGxpbW1zdGVtXCIsXG5cdFwic2NobGltbXN0ZXNcIiwgXCJzY2hsaW1tc3RlXCIsIFwidG9sbFwiLCBcInRvbGxlclwiLCBcInRvbGxlblwiLCBcInRvbGxlbVwiLCBcInRvbGxlc1wiLCBcInRvbGxlXCIsIFwidG9sbGVyZXJcIiwgXCJ0b2xsZXJlblwiLCBcInRvbGxlcmVtXCIsIFwidG9sbGVyZVwiLFxuXHRcInRvbGxlcmVzXCIsIFwidG9sbHN0ZXJcIiwgXCJ0b2xsc3RlblwiLCBcInRvbGxzdGVtXCIsIFwidG9sbHN0ZXNcIiwgXCJ0b2xsc3RlXCIsIFwic3VwZXJcIiwgXCJtw7ZnbGljaGVcIiwgXCJtw7ZnbGljaGVyXCIsIFwibcO2Z2xpY2hlc1wiLCBcIm3DtmdsaWNoZW5cIixcblx0XCJtw7ZnbGljaGVtXCIsIFwibcO2Z2xpY2hcIiwgXCJtb2VnbGljaGVcIiwgXCJtb2VnbGljaGVyXCIsIFwibW9lZ2xpY2hlc1wiLCBcIm1vZWdsaWNoZW5cIiwgXCJtb2VnbGljaGVtXCIsIFwibW9lZ2xpY2hcIiwgXCJuw6RjaHN0ZW5cIiwgXCJuYWVjaHN0ZW5cIixcblx0XCJ2b2xsXCIsIFwidm9sbGVyXCIsIFwidm9sbGVuXCIsIFwidm9sbGVtXCIsIFwidm9sbGVcIiwgXCJ2b2xsZXNcIiwgXCJ2b2xsZXJlclwiLCBcInZvbGxlcmVuXCIsIFwidm9sbGVyZW1cIiwgXCJ2b2xsZXJlXCIsIFwidm9sbGVyZXNcIiwgXCJ2b2xsc3RlclwiLFxuXHRcInZvbGxzdGVuXCIsIFwidm9sbHN0ZW1cIiwgXCJ2b2xsc3RlXCIsIFwidm9sbHN0ZXNcIiwgXCJhdcOfZW5cIiwgXCJnYW56ZXJcIiwgXCJnYW56ZW5cIiwgXCJnYW56ZW1cIiwgXCJnYW56ZVwiLCBcImdhbnplc1wiLCBcImdlcm5lXCIsIFwib2JlblwiLCBcInVudGVuXCIsIFwienVyw7xja1wiLFxuXHRcInp1cnVlY2tcIiBdO1xuXG52YXIgaW50ZXJqZWN0aW9ucyA9IFsgIFwiYWNoXCIsIFwiYWhhXCIsIFwib2hcIiwgXCJhdVwiLCBcImLDpGhcIiwgXCJiYWVoXCIsIFwiaWdpdHRcIiwgXCJodWNoXCIsIFwiaHVycmFcIiwgXCJob3BwbGFcIiwgXCJuYW51XCIsIFwib2hhXCIsIFwib2xhbGFcIiwgXCJwZnVpXCIsIFwidGphXCIsXG5cdFwidXVwc1wiLCBcIndvd1wiLCBcImdyclwiLCBcIsOkaFwiLCBcImFlaFwiLCBcIsOkaG1cIiwgXCJhZWhcIiwgXCLDtmhtXCIsIFwib2VobVwiLCBcImhtXCIsIFwibWVpXCIsIFwibnVuXCIsIFwidGphXCIsIFwibWhtXCIsIFwib2theVwiLCBcInJpY2h0aWdcIiwgXCJlaWplaWplaWplaVwiIF07XG5cbi8vIFRoZXNlIHdvcmRzIGFuZCBhYmJyZXZpYXRpb25zIGFyZSBmcmVxdWVudGx5IHVzZWQgaW4gcmVjaXBlcyBpbiBsaXN0cyBvZiBpbmdyZWRpZW50cy5cbnZhciByZWNpcGVXb3JkcyA9IFsgXCJnXCIsIFwiZWxcIiwgXCJlc1wiLCBcInRsXCIsIFwid2dcIiwgXCJiZVwiLCBcImJkXCIsIFwiY2xcIiwgXCJkbFwiLCBcImRhZ1wiLCBcImRvXCIsIFwiZ2xcIiwgXCJnclwiLCBcImtnXCIsIFwia2xcIiwgXCJjYlwiLCBcImNjbVwiLCBcImxcIiwgXCJtc1wiLCBcIm1nXCIsXG5cdFwibWxcIiwgXCJtaVwiLCBcInBrXCIsIFwicHJcIiwgXCJwcFwiLCBcInNjXCIsIFwic3BcIiwgXCJzdFwiLCBcInNrXCIsIFwidGFcIiwgXCJ0clwiLCBcImNtXCIsIFwibWFzc1wiIF07XG5cbnZhciB0aW1lV29yZHMgPSBbIFwic2VrdW5kZVwiLCBcInNla3VuZGVuXCIsIFwibWludXRlXCIsIFwibWludXRlblwiLCBcInVoclwiLCBcInVocmVuXCIsIFwidGFnXCIsIFwidGFnZXNcIiwgXCJ0YWdzXCIsIFwidGFnZVwiLCBcInRhZ2VuXCIsIFwid29jaGVcIiwgXCJ3b2NoZW5cIixcblx0XCJqYWhyXCIsIFwiamFocmVzXCIsIFwiamFocnNcIiwgXCJqYWhyZVwiLCBcImphaHJlblwiIF07XG5cbnZhciB2YWd1ZU5vdW5zID0gWyBcImRpbmdcIiwgXCJkaW5nZVwiLCBcImRpbmdlc1wiLCBcImRpbmdlclwiLCBcImRpbmdlcm5cIiwgXCJkaW5nZW5cIiwgXCJzYWNoZVwiLCBcInNhY2hlblwiLCBcIndlaXNlXCIsIFwid2Vpc2VuXCIsIFwid2FocnNjaGVpbmxpY2hrZWl0XCIsXG5cdFwiemV1Z1wiLCBcInpldWdlXCIsIFwiemV1Z2VzXCIsIFwiemV1Z2VuXCIsIFwibWFsXCIsIFwiZWlubWFsXCIsIFwidGVpbFwiLCBcInRlaWxlXCIsIFwidGVpbGVzXCIsIFwidGVpbGVuXCIsIFwicHJvemVudFwiLCBcInByb3plbnRzXCIsIFwicHJvemVudGVzXCIsIFwicHJvemVudGVcIixcblx0XCJwcm96ZW50ZW5cIiwgXCJiZWlzcGllbFwiLCBcImJlaXNwaWVsZVwiLCBcImJlaXNwaWVsZXNcIiwgXCJiZWlzcGllbHNcIiwgXCJiZWlzcGllbGVuXCIsIFwiYXNwZWt0XCIsIFwiYXNwZWt0ZVwiLCBcImFzcGVrdGVzXCIsIFwiYXNwZWt0c1wiLCBcImFzcGVrdGVuXCIsXG5cdFwiaWRlZVwiLCBcImlkZWVuXCIsIFwiYWhudW5nXCIsIFwiYWhudW5nZW5cIiwgXCJ0aGVtYVwiLCBcInRoZW1hc1wiLCBcInRoZW1hdGFcIiwgXCJ0aGVtZW5cIiwgXCJmYWxsXCIsIFwiZmFsbGVcIiwgXCJmYWxsZXNcIiwgXCJmYWxsc1wiLCBcImbDpGxsZVwiLCBcImbDpGxsZW5cIixcblx0XCJmYWVsbGVcIiwgXCJmYWVsbGVuXCIsIFwibWVuc2NoXCIsIFwibWVuc2NoZW5cIiwgXCJsZXV0ZVwiIF07XG5cbnZhciBtaXNjZWxsYW5lb3VzID0gWyBcIm5peFwiLCBcIm5peGVcIiwgXCJuaXhlc1wiLCBcIm5peGVuXCIsIFwidXN3LlwiLCBcIiVcIiwgXCJuaWNodFwiLCBcImFtZW5cIiwgXCJqYVwiLCBcIm5laW5cIiwgXCJldXJvXCIsIFwicHJvemVudFwiLCBcIndhc1wiIF07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0YXJ0aWNsZXM6IGFydGljbGVzLFxuXHRcdHBlcnNvbmFsUHJvbm91bnM6IHBlcnNvbmFsUHJvbm91bnNOb21pbmF0aXZlLmNvbmNhdCggcGVyc29uYWxQcm9ub3Vuc0FjY3VzYXRpdmUsIHBlcnNvbmFsUHJvbm91bnNEYXRpdmUsXG5cdFx0XHRwb3NzZXNzaXZlUHJvbm91bnMgKSxcblx0XHRwcmVwb3NpdGlvbnM6IHByZXBvc2l0aW9ucyxcblx0XHRkZW1vbnN0cmF0aXZlUHJvbm91bnM6IGRlbW9uc3RyYXRpdmVQcm9ub3Vucyxcblx0XHRjb25qdW5jdGlvbnM6IGNvb3JkaW5hdGluZ0Nvbmp1bmN0aW9ucy5jb25jYXQoIHN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbnMsIGNvcnJlbGF0aXZlQ29uanVuY3Rpb25zICksXG5cdFx0dmVyYnM6IGNvcHVsYS5jb25jYXQoIGludGVydmlld1ZlcmJzLCBvdGhlckF1eGlsaWFyaWVzLCBmaWx0ZXJlZFBhc3NpdmVBdXhpbGlhcmllcyApLFxuXHRcdHF1YW50aWZpZXJzOiBxdWFudGlmaWVycyxcblx0XHRyZWxhdGl2ZVByb25vdW5zOiByZWxhdGl2ZVByb25vdW5zLFxuXHRcdGludGVycm9nYXRpdmVQcm9BZHZlcmJzOiBpbnRlcnJvZ2F0aXZlUHJvQWR2ZXJicyxcblx0XHR0cmFuc2l0aW9uV29yZHM6IHRyYW5zaXRpb25Xb3Jkcy5jb25jYXQoIGFkZGl0aW9uYWxUcmFuc2l0aW9uV29yZHMgKSxcblx0XHQvLyBUaGVzZSB2ZXJicyB0aGF0IHNob3VsZCBiZSBmaWx0ZXJlZCBhdCB0aGUgYmVnaW5uaW5nIG9mIHByb21pbmVudCB3b3JkIGNvbWJpbmF0aW9ucy5cblx0XHRiZWdpbm5pbmdWZXJiczogb3RoZXJBdXhpbGlhcmllc0luZmluaXRpdmUuY29uY2F0KCBub3RGaWx0ZXJlZFBhc3NpdmVBdXhpbGlhcmllcyxcblx0XHRcdGRlbGV4aWNhbGlzZWRWZXJic0luZmluaXRpdmUsIGNvcHVsYUluZmluaXRpdmUsIGludGVydmlld1ZlcmJzSW5maW5pdGl2ZSApLFxuXHRcdG1pc2NlbGxhbmVvdXM6IG1pc2NlbGxhbmVvdXMsXG5cdFx0aW50ZXJqZWN0aW9uczogaW50ZXJqZWN0aW9ucyxcblx0XHRwcm9ub21pbmFsQWR2ZXJiczogcHJvbm9taW5hbEFkdmVyYnMsXG5cdFx0cmVmbGV4aXZlUHJvbm91bnM6IHJlZmxleGl2ZVByb25vdW5zLFxuXHRcdGFsbDogYXJ0aWNsZXMuY29uY2F0KCBudW1lcmFscywgZGVtb25zdHJhdGl2ZVByb25vdW5zLCBwb3NzZXNzaXZlUHJvbm91bnMsIHJlZmxleGl2ZVByb25vdW5zLCBwZXJzb25hbFByb25vdW5zTm9taW5hdGl2ZSxcblx0XHRcdHBlcnNvbmFsUHJvbm91bnNBY2N1c2F0aXZlLCByZWxhdGl2ZVByb25vdW5zLCBxdWFudGlmaWVycywgaW5kZWZpbml0ZVByb25vdW5zLCBpbnRlcnJvZ2F0aXZlUHJvQWR2ZXJicyxcdHByb25vbWluYWxBZHZlcmJzLFxuXHRcdFx0bG9jYXRpdmVBZHZlcmJzLCBhZHZlcmJpYWxHZW5pdGl2ZXMsIGZpbHRlcmVkUGFzc2l2ZUF1eGlsaWFyaWVzLCBub3RGaWx0ZXJlZFBhc3NpdmVBdXhpbGlhcmllcywgb3RoZXJBdXhpbGlhcmllcyxcblx0XHRcdG90aGVyQXV4aWxpYXJpZXNJbmZpbml0aXZlLCBjb3B1bGEsIGNvcHVsYUluZmluaXRpdmUsIHByZXBvc2l0aW9ucywgY29vcmRpbmF0aW5nQ29uanVuY3Rpb25zLCBjb3JyZWxhdGl2ZUNvbmp1bmN0aW9ucyxcblx0XHRcdHN1Ym9yZGluYXRpbmdDb25qdW5jdGlvbnMsIGludGVydmlld1ZlcmJzLCBpbnRlcnZpZXdWZXJic0luZmluaXRpdmUsIHRyYW5zaXRpb25Xb3JkcywgYWRkaXRpb25hbFRyYW5zaXRpb25Xb3JkcywgaW50ZW5zaWZpZXJzLFxuXHRcdFx0ZGVsZXhpY2FsaXNlZFZlcmJzLCBkZWxleGljYWxpc2VkVmVyYnNJbmZpbml0aXZlLCBpbnRlcmplY3Rpb25zLCBnZW5lcmFsQWRqZWN0aXZlc0FkdmVyYnMsIHJlY2lwZVdvcmRzLCB2YWd1ZU5vdW5zLCBtaXNjZWxsYW5lb3VzLFxuXHRcdFx0dGltZVdvcmRzICksXG5cdH07XG59O1xuIiwiLy8gVGhlc2UgcGFzc2l2ZSBhdXhpbGlhcmllcyBzdGFydCB3aXRoIGJlLSwgZ2UtIG9yIGVyLSBlbiBhbmQgd2l0aCAtdCwgYW5kIHRoZXJlZm9yZSBsb29rIGxpa2UgYSBwYXJ0aWNpcGxlLlxudmFyIHBhcnRpY2lwbGVMaWtlID0gW1xuXHRcImJla29tbXN0XCIsXG5cdFwiYmVrb21tdFwiLFxuXHRcImJla2Ftc3RcIixcblx0XCJiZWtvbW1lc3RcIixcblx0XCJiZWtvbW1ldFwiLFxuXHRcImJla8OkbWVzdFwiLFxuXHRcImJla8OkbXN0XCIsXG5cdFwiYmVrw6RtZXRcIixcblx0XCJiZWvDpG10XCIsXG5cdFwiZ2VrcmllZ3RcIixcblx0XCJnZWjDtnJzdFwiLFxuXHRcImdlaMO2cnRcIixcblx0XCJnZWjDtnJ0ZXN0XCIsXG5cdFwiZ2Vow7ZydGV0XCIsXG5cdFwiZ2Vow7ZyZXN0XCIsXG5cdFwiZ2Vow7ZyZXRcIixcblx0XCJlcmjDpGx0c3RcIixcblx0XCJlcmjDpGx0XCIsXG5cdFwiZXJoYWx0ZXRcIixcblx0XCJlcmhpZWx0XCIsXG5cdFwiZXJoaWVsdGVzdFwiLFxuXHRcImVyaGllbHRzdFwiLFxuXHRcImVyaGllbHRldFwiLFxuXHRcImVyaGFsdGVzdFwiLFxuXTtcblxuLy8gVGhlc2UgYXJlIGFsbCBvdGhlciBwYXNzaXZlIGF1eGlsaWFyaWVzLlxudmFyIG90aGVyQXV4aWxpYXJpZXMgPSBbXG5cdFwid2VyZGVcIixcblx0XCJ3aXJzdFwiLFxuXHRcIndpcmRcIixcblx0XCJ3ZXJkZW5cIixcblx0XCJ3ZXJkZXRcIixcblx0XCJ3dXJkZVwiLFxuXHRcIndhcmRcIixcblx0XCJ3dXJkZXN0XCIsXG5cdFwid2FyZHN0XCIsXG5cdFwid3VyZGVuXCIsXG5cdFwid3VyZGV0XCIsXG5cdFwid29yZGVuXCIsXG5cdFwid2VyZGVzdFwiLFxuXHRcInfDvHJkZVwiLFxuXHRcInfDvHJkZXN0XCIsXG5cdFwid8O8cmRlblwiLFxuXHRcInfDvHJkZXRcIixcblx0XCJiZWtvbW1lXCIsXG5cdFwiYmVrb21tZW5cIixcblx0XCJiZWthbVwiLFxuXHRcImJla2FtZW5cIixcblx0XCJiZWvDpG1lXCIsXG5cdFwiYmVrw6RtZW5cIixcblx0XCJrcmllZ2VcIixcblx0XCJrcmllZ3N0XCIsXG5cdFwia3JpZWd0XCIsXG5cdFwia3JpZWdlblwiLFxuXHRcImtyaWVndGVcIixcblx0XCJrcmllZ3Rlc3RcIixcblx0XCJrcmllZ3RlblwiLFxuXHRcImtyaWVndGV0XCIsXG5cdFwia3JpZWdlc3RcIixcblx0XCJrcmllZ2V0XCIsXG5cdFwiZ2Vow7ZyZVwiLFxuXHRcImdlaMO2cmVuXCIsXG5cdFwiZ2Vow7ZydGVcIixcblx0XCJnZWjDtnJ0ZW5cIixcblx0XCJlcmhhbHRlXCIsXG5cdFwiZXJoYWx0ZW5cIixcblx0XCJlcmhpZWx0ZW5cIixcblx0XCJlcmhpZWx0ZVwiLFxuXTtcblxuLy8gVGhlc2UgZmlyc3QgcGVyc29uIHBsdXJhbCBhdXhpbGlhcmllcyBhbHNvIGZ1bmN0aW9uIGFzIGFuIGluZmluaXRpdmUuXG52YXIgaW5maW5pdGl2ZUF1eGlsaWFyaWVzID0gW1xuXHRcIndlcmRlblwiLFxuXHRcImJla29tbWVuXCIsXG5cdFwia3JpZWdlblwiLFxuXHRcImdlaMO2cmVuXCIsXG5cdFwiZXJoYWx0ZW5cIixcbl07XG4vKipcbiAqIFJldHVybnMgbGlzdHMgd2l0aCBhdXhpbGlhcmllcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gVGhlIGxpc3RzIHdpdGggYXV4aWxpYXJpZXMuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0cGFydGljaXBsZUxpa2U6IHBhcnRpY2lwbGVMaWtlLFxuXHRcdG90aGVyQXV4aWxpYXJpZXM6IG90aGVyQXV4aWxpYXJpZXMuY29uY2F0KCBpbmZpbml0aXZlQXV4aWxpYXJpZXMgKSxcblx0XHQvLyBUaGVzZSBhdXhpbGlhcmllcyBhcmUgZmlsdGVyZWQgZnJvbSB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2Ygd29yZCBjb21iaW5hdGlvbnMgaW4gdGhlIHByb21pbmVudCB3b3Jkcy5cblx0XHRmaWx0ZXJlZEF1eGlsaWFyaWVzOiBwYXJ0aWNpcGxlTGlrZS5jb25jYXQoIG90aGVyQXV4aWxpYXJpZXMgKSxcblx0XHQvLyBUaGVzZSBhdXhpbGlhcmllcyBhcmUgbm90IGZpbHRlcmVkIGZyb20gdGhlIGJlZ2lubmluZyBvZiB3b3JkIGNvbWJpbmF0aW9ucyBpbiB0aGUgcHJvbWluZW50IHdvcmRzLlxuXHRcdGluZmluaXRpdmVBdXhpbGlhcmllczogaW5maW5pdGl2ZUF1eGlsaWFyaWVzLFxuXHRcdGFsbEF1eGlsaWFyaWVzOiBwYXJ0aWNpcGxlTGlrZS5jb25jYXQoIG90aGVyQXV4aWxpYXJpZXMsIGluZmluaXRpdmVBdXhpbGlhcmllcyApLFxuXHR9O1xufTtcblxuIiwiLyoqIEBtb2R1bGUgY29uZmlnL3RyYW5zaXRpb25Xb3JkcyAqL1xuXG52YXIgc2luZ2xlV29yZHMgPSBbIFwiYWJlclwiLCBcImFic2NobGllw59lbmRcIiwgXCJhYnNjaGxpZXNzZW5kXCIsIFwiYWxsZGlld2VpbFwiLCBcImFsbGVyZGluZ3NcIiwgXCJhbHNvXCIsIFwiYW5kZXJlbnRlaWxzXCIsIFwiYW5kZXJlcnNlaXRzXCIsIFwiYW5kZXJudGVpbHNcIixcblx0XCJhbmZhZW5nbGljaFwiLCBcImFuZsOkbmdsaWNoXCIsIFwiYW5mYW5nc1wiLCBcImFuZ2Vub21tZW5cIiwgXCJhbnNjaGxpZXNzZW5kXCIsIFwiYW5zY2hsaWXDn2VuZFwiLFx0XCJhdWZncnVuZFwiLFx0XCJhdXNnZW5vbW1lblwiLCBcImF1c3NlclwiLCBcImF1w59lclwiLFxuXHRcImF1c3NlcmRlbVwiLCBcImF1w59lcmRlbVwiLCBcImJlaXNwaWVsc3dlaXNlXCIsIFwiYmV2b3JcIiwgXCJiZXppZWh1bmdzd2Vpc2VcIiwgXCJic3B3XCIsIFwiYnp3XCIsIFwiZC5oXCIsIFwiZGFcIiwgXCJkYWJlaVwiLCBcImRhZHVyY2hcIiwgXCJkYWZ1ZXJcIiwgXCJkYWbDvHJcIixcblx0XCJkYWdlZ2VuXCIsIFwiZGFoZXJcIiwgXCJkYWhpbmdlZ2VuXCIsIFwiZGFuYWNoXCIsIFwiZGFublwiLCBcImRhcmF1ZlwiLCBcImRhcnVtXCIsIFwiZGFzc1wiLCBcImRhdm9yXCIsIFwiZGF6dVwiLCBcImRlbWVudGdlZ2VuXCIsIFwiZGVtZW50c3ByZWNoZW5kXCIsIFwiZGVtZ2VnZW7DvGJlclwiLFxuXHRcImRlbWdlZ2VudWViZXJcIiwgXCJkZW1nZW1hZXNzXCIsIFwiZGVtZ2Vtw6TDn1wiLCBcImRlbXp1Zm9sZ2VcIiwgXCJkZW5uXCIsIFwiZGVubm9jaFwiLCBcImRlcmdlc3RhbHRcIiwgXCJkZXN0b1wiLCBcImRlc2hhbGJcIiwgXCJkZXN1bmdlYWNodGV0XCIsXG5cdFwiZGVzd2VnZW5cIiwgXCJkb2NoXCIsIFwiZG9ydFwiLCBcImRyaXR0ZW5zXCIsXHRcImViZW5mYWxsc1wiLCBcImViZW5zb1wiLCBcImVuZGxpY2hcIiwgXCJlaGVcIiwgXCJlaW5lcnNlaXRzXCIsIFwiZWluZXN0ZWlsc1wiLCBcImVudHNwcmVjaGVuZFwiLFxuXHRcImVudHdlZGVyXCIsIFwiZXJzdFwiLCBcImVyc3RlbnNcIiwgXCJmYWxsc1wiLCBcImZlcm5lclwiLCBcImZvbGdlcmljaHRpZ1wiLCBcImZvbGdsaWNoXCIsIFwiZsO8cmRlcmhpblwiLCBcImZ1ZXJkZXJoaW5cIiwgXCJnZW5hdXNvXCIsXG5cdFwiaGllcmR1cmNoXCIsIFwiaGllcnp1XCIsIFwiaGluZ2VnZW5cIiwgXCJpbW1lcmhpblwiLCBcImluZGVtXCIsIFwiaW5kZXNcIiwgXCJpbmRlc3NlblwiLCBcImluZm9sZ2VcIixcdFwiaW5mb2xnZWRlc3NlblwiLCBcImluc29mZXJuXCIsIFwiaW5zb3dlaXRcIiwgXCJpbnp3aXNjaGVuXCIsXG5cdFwiamVkZW5mYWxsc1wiLCBcImplZG9jaFwiLCBcImt1cnp1bVwiLCBcIm0uYS53XCIsIFwibWl0bmljaHRlblwiLCBcIm1pdHVudGVyXCIsIFwibcO2Z2xpY2hlcndlaXNlXCIsIFwibW9lZ2xpY2hlcndlaXNlXCIsIFwibmFjaGRlbVwiLCBcIm5lYmVuaGVyXCIsXG5cdFwibmljaHRzZGVzdG90cm90elwiLCBcIm5pY2h0c2Rlc3Rvd2VuaWdlclwiLCBcIm9iXCIsIFwib2JlbnJlaW5cIiwgXCJvYmdsZWljaFwiLCBcIm9ic2Nob25cIiwgXCJvYndvaGxcIiwgXCJvYnp3YXJcIiwgXCJvaG5laGluXCIsIFwicmljaHRpZ2Vyd2Vpc2VcIixcblx0XCJzY2hsaWVzc2xpY2hcIiwgXCJzY2hsaWXDn2xpY2hcIiwgXCJzZWl0XCIsIFwic2VpdGRlbVwiLCBcInNvYmFsZFwiLCBcInNvZGFzc1wiLCBcInNvIGRhc3NcIiwgXCJzb2Zlcm5cIiwgXCJzb2dhclwiLCBcInNvbGFuZ1wiLCBcInNvbGFuZ2VcIiwgXCJzb21pdFwiLFxuXHRcInNvbmRlcm5cIiwgXCJzb29mdFwiLCBcInNvdmllbFwiLCBcInNvd2VpdFwiLCBcInNvd2llXCIsIFwic293b2hsXCIsIFwic3RhdHRcIiwgXCJzdGF0dGRlc3NlblwiLCBcInRyb3R6XCIsXHRcInRyb3R6ZGVtXCIsIFwiw7xiZXJkaWVzXCIsIFwiw7xicmlnZW5zXCIsXG5cdFwidWViZXJkaWVzXCIsIFwidWVicmlnZW5zXCIsIFwidW5nZWFjaHRldFwiLCBcInZpZWxtZWhyXCIsIFwidm9yYXVzZ2VzZXR6dFwiLCBcInZvcmhlclwiLCBcIndhZWhyZW5kXCIsIFwid8OkaHJlbmRcIiwgXCJ3w6RocmVuZGRlc3NlblwiLFxuXHRcIndhZWhyZW5kZGVzc2VuXCIsIFwid2VkZXJcIiwgXCJ3ZWdlblwiLCBcIndlaWxcIiwgXCJ3ZWl0ZXJcIiwgXCJ3ZWl0ZXJoaW5cIiwgXCJ3ZW5uXCIsIFwid2VubmdsZWljaFwiLCBcIndlbm5zY2hvblwiLCBcIndlbm56d2FyXCIsIFwid2VzaGFsYlwiLCBcIndpZHJpZ2VuZmFsbHNcIixcblx0XCJ3aWV3b2hsXCIsIFwid29iZWlcIiwgXCJ3b2hpbmdlZ2VuXCIsIFwiei5iXCIsIFwienVkZW1cIiwgXCJ6dWVyc3RcIiwgXCJ6dWZvbGdlXCIsIFwienVsZXR6dFwiLCBcInp1bWFsXCIsIFwienV2b3JcIiwgXCJ6d2FyXCIsIFwiendlaXRlbnNcIiBdO1xudmFyIG11bHRpcGxlV29yZHMgPSBbIFwiYWJnZXNlaGVuIHZvblwiLCBcImFiZ2VzZWhlbiBkYXZvblwiLCBcImFscyBkYXNzXCIsIFwiYWxzIHdlbm5cIiwgXCJhbmRlcnMgYXVzZ2VkcsO8Y2t0XCIsIFwiYW5kZXJzIGF1c2dlZHJ1ZWNrdFwiLFxuXHRcImFuZGVycyBmb3JtdWxpZXJ0XCIsIFwiYW5kZXJzIGdlZmFzc3RcIiwgXCJhbmRlcnMgZ2VmcmFndFwiLCBcImFuZGVycyBnZXNhZ3RcIiwgXCJhbmRlcnMgZ2VzcHJvY2hlblwiLCBcImFuc3RhdHQgZGFzc1wiLCBcImF1Y2ggd2VublwiLFxuXHRcImF1ZiBncnVuZFwiLCBcImF1ZiBqZWRlbiBmYWxsXCIsIFwiYXVzIGRpZXNlbSBncnVuZFwiLCBcImF1c3NlciBkYXNzXCIsIFwiYXXDn2VyIGRhc3NcIiwgXCJhdXNzZXIgd2VublwiLCBcImF1w59lciB3ZW5uXCIsIFwiYmVzc2VyIGF1c2dlZHLDvGNrdFwiLFxuXHRcImJlc3NlciBhdXNnZWRydWVja3RcIiwgXCJiZXNzZXIgZm9ybXVsaWVydFwiLCBcImJlc3NlciBnZXNhZ3RcIiwgXCJiZXNzZXIgZ2VzcHJvY2hlblwiLCBcImJsb3NzIGRhc3NcIiwgXCJibG/DnyBkYXNzXCIsIFwiZGFzIGhlaXNzdFwiLCBcImRhcyBoZWnDn3RcIixcblx0XCJkZXMgd2VpdGVyZW5cIiwgXCJkZXNzZW4gdW5nZWFjaHRldFwiLCBcImViZW5zbyB3aWVcIiwgXCJnZW5hdXNvIHdpZVwiLCBcImdlc2Nod2VpZ2UgZGVublwiLCBcImltIGZhbGxcIiwgXCJpbSBmYWxsZVwiLCBcImltIGZvbGdlbmRlblwiLFxuXHRcImltIGdlZ2Vuc2F0eiBkYXp1XCIsIFwiaW0gZ3J1bmRlIGdlbm9tbWVuXCIsIFwiaW4gZGllc2VtIHNpbm5lXCIsIFwiamUgbmFjaGRlbVwiLCBcImt1cnogZ2VzYWd0XCIsIFwibWl0IGFuZGVyZW4gd29ydGVuXCIsIFwib2huZSBkYXNzXCIsXG5cdFwic28gZGFzc1wiLCBcInVtc28gbWVociBhbHNcIiwgXCJ1bXNvIHdlbmlnZXIgYWxzXCIsIFwidW1zbyBtZWhyLCBhbHNcIiwgXCJ1bXNvIHdlbmlnZXIsIGFsc1wiLCBcInVuYmVzY2hhZGV0IGRlc3NlblwiLCBcInVuZCB6d2FyXCIsXG5cdFwidW5nZWFjaHRldCBkZXNzZW5cIiwgXCJ1bnRlciBkZW0gc3RyaWNoXCIsIFwienVtIGJlaXNwaWVsXCIgXTtcblxuLyoqXG4gKiBSZXR1cm5zIGxpc3RzIHdpdGggdHJhbnNpdGlvbiB3b3JkcyB0byBiZSB1c2VkIGJ5IHRoZSBhc3Nlc3NtZW50cy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFRoZSBvYmplY3Qgd2l0aCB0cmFuc2l0aW9uIHdvcmQgbGlzdHMuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0c2luZ2xlV29yZHM6IHNpbmdsZVdvcmRzLFxuXHRcdG11bHRpcGxlV29yZHM6IG11bHRpcGxlV29yZHMsXG5cdFx0YWxsV29yZHM6IHNpbmdsZVdvcmRzLmNvbmNhdCggbXVsdGlwbGVXb3JkcyApLFxuXHR9O1xufTtcbiIsIi8qKiBAbW9kdWxlIHN0cmluZ1Byb2Nlc3NpbmcvYWRkV29yZGJvdW5kYXJ5ICovXG5cbi8qKlxuICogUmV0dXJucyBhIHN0cmluZyB0aGF0IGNhbiBiZSB1c2VkIGluIGEgcmVnZXggdG8gbWF0Y2ggYSBtYXRjaFN0cmluZyB3aXRoIHdvcmQgYm91bmRhcmllcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbWF0Y2hTdHJpbmcgVGhlIHN0cmluZyB0byBnZW5lcmF0ZSBhIHJlZ2V4IHN0cmluZyBmb3IuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2V4dHJhV29yZEJvdW5kYXJ5XSBFeHRyYSBjaGFyYWN0ZXJzIHRvIG1hdGNoIGEgd29yZCBib3VuZGFyeSBvbi5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IEEgcmVnZXggc3RyaW5nIHRoYXQgbWF0Y2hlcyB0aGUgbWF0Y2hTdHJpbmcgd2l0aCB3b3JkIGJvdW5kYXJpZXMuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIG1hdGNoU3RyaW5nLCBleHRyYVdvcmRCb3VuZGFyeSApIHtcblx0dmFyIHdvcmRCb3VuZGFyeSwgd29yZEJvdW5kYXJ5U3RhcnQsIHdvcmRCb3VuZGFyeUVuZDtcblx0dmFyIF9leHRyYVdvcmRCb3VuZGFyeSA9IGV4dHJhV29yZEJvdW5kYXJ5IHx8IFwiXCI7XG5cblx0d29yZEJvdW5kYXJ5ID0gXCJbIFxcXFxuXFxcXHJcXFxcdFxcLiwnXFwoXFwpXFxcIlxcK1xcLTshPzpcXC/Cu8Kr4oC54oC6XCIgKyBfZXh0cmFXb3JkQm91bmRhcnkgKyBcIjw+XVwiO1xuXHR3b3JkQm91bmRhcnlTdGFydCA9IFwiKF58XCIgKyB3b3JkQm91bmRhcnkgKyBcIilcIjtcblx0d29yZEJvdW5kYXJ5RW5kID0gXCIoJHxcIiArIHdvcmRCb3VuZGFyeSArIFwiKVwiO1xuXG5cdHJldHVybiB3b3JkQm91bmRhcnlTdGFydCArIG1hdGNoU3RyaW5nICsgd29yZEJvdW5kYXJ5RW5kO1xufTtcbiIsIi8qKiBAbW9kdWxlIHN0cmluZ1Byb2Nlc3NpbmcvY3JlYXRlUmVnZXhGcm9tQXJyYXkgKi9cblxudmFyIGFkZFdvcmRCb3VuZGFyeSA9IHJlcXVpcmUoIFwiLi4vc3RyaW5nUHJvY2Vzc2luZy9hZGRXb3JkYm91bmRhcnkuanNcIiApO1xudmFyIG1hcCA9IHJlcXVpcmUoIFwibG9kYXNoL21hcFwiICk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHJlZ2V4IG9mIGNvbWJpbmVkIHN0cmluZ3MgZnJvbSB0aGUgaW5wdXQgYXJyYXkuXG4gKlxuICogQHBhcmFtIHthcnJheX0gYXJyYXkgVGhlIGFycmF5IHdpdGggc3RyaW5nc1xuICogQHBhcmFtIHtib29sZWFufSBbZGlzYWJsZVdvcmRCb3VuZGFyeV0gQm9vbGVhbiBpbmRpY2F0aW5nIHdoZXRoZXIgb3Igbm90IHRvIGRpc2FibGUgd29yZCBib3VuZGFyaWVzXG4gKiBAcmV0dXJucyB7UmVnRXhwfSByZWdleCBUaGUgcmVnZXggY3JlYXRlZCBmcm9tIHRoZSBhcnJheS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggYXJyYXksIGRpc2FibGVXb3JkQm91bmRhcnkgKSB7XG5cdHZhciByZWdleFN0cmluZztcblx0dmFyIF9kaXNhYmxlV29yZEJvdW5kYXJ5ID0gZGlzYWJsZVdvcmRCb3VuZGFyeSB8fCBmYWxzZTtcblxuXHR2YXIgYm91bmRlZEFycmF5ID0gbWFwKCBhcnJheSwgZnVuY3Rpb24oIHN0cmluZyApIHtcblx0XHRpZiAoIF9kaXNhYmxlV29yZEJvdW5kYXJ5ICkge1xuXHRcdFx0cmV0dXJuIHN0cmluZztcblx0XHR9XG5cdFx0cmV0dXJuIGFkZFdvcmRCb3VuZGFyeSggc3RyaW5nICk7XG5cdH0gKTtcblxuXHRyZWdleFN0cmluZyA9IFwiKFwiICsgYm91bmRlZEFycmF5LmpvaW4oIFwiKXwoXCIgKSArIFwiKVwiO1xuXG5cdHJldHVybiBuZXcgUmVnRXhwKCByZWdleFN0cmluZywgXCJpZ1wiICk7XG59O1xuIiwidmFyIG1hcCA9IHJlcXVpcmUoIFwibG9kYXNoL21hcFwiICk7XG52YXIgaXNVbmRlZmluZWQgPSByZXF1aXJlKCBcImxvZGFzaC9pc1VuZGVmaW5lZFwiICk7XG52YXIgZm9yRWFjaCA9IHJlcXVpcmUoIFwibG9kYXNoL2ZvckVhY2hcIiApO1xudmFyIGlzTmFOID0gcmVxdWlyZSggXCJsb2Rhc2gvaXNOYU5cIiApO1xudmFyIGZpbHRlciA9IHJlcXVpcmUoIFwibG9kYXNoL2ZpbHRlclwiICk7XG52YXIgZmxhdE1hcCA9IHJlcXVpcmUoIFwibG9kYXNoL2ZsYXRNYXBcIiApO1xudmFyIGlzRW1wdHkgPSByZXF1aXJlKCBcImxvZGFzaC9pc0VtcHR5XCIgKTtcbnZhciBuZWdhdGUgPSByZXF1aXJlKCBcImxvZGFzaC9uZWdhdGVcIiApO1xudmFyIG1lbW9pemUgPSByZXF1aXJlKCBcImxvZGFzaC9tZW1vaXplXCIgKTtcblxudmFyIGNvcmUgPSByZXF1aXJlKCBcInRva2VuaXplcjIvY29yZVwiICk7XG5cbnZhciBnZXRCbG9ja3MgPSByZXF1aXJlKCBcIi4uL2hlbHBlcnMvaHRtbC5qc1wiICkuZ2V0QmxvY2tzO1xudmFyIG5vcm1hbGl6ZVF1b3RlcyA9IHJlcXVpcmUoIFwiLi4vc3RyaW5nUHJvY2Vzc2luZy9xdW90ZXMuanNcIiApLm5vcm1hbGl6ZTtcblxudmFyIHVuaWZ5V2hpdGVzcGFjZSA9IHJlcXVpcmUoIFwiLi4vc3RyaW5nUHJvY2Vzc2luZy91bmlmeVdoaXRlc3BhY2UuanNcIiApLnVuaWZ5Tm9uQnJlYWtpbmdTcGFjZTtcblxuLy8gQWxsIGNoYXJhY3RlcnMgdGhhdCBpbmRpY2F0ZSBhIHNlbnRlbmNlIGRlbGltaXRlci5cbnZhciBmdWxsU3RvcCA9IFwiLlwiO1xuLy8gVGhlIFxcdTIwMjYgY2hhcmFjdGVyIGlzIGFuIGVsbGlwc2lzXG52YXIgc2VudGVuY2VEZWxpbWl0ZXJzID0gXCI/ITtcXHUyMDI2XCI7XG52YXIgbmV3TGluZXMgPSBcIlxcblxccnxcXG58XFxyXCI7XG5cbnZhciBmdWxsU3RvcFJlZ2V4ID0gbmV3IFJlZ0V4cCggXCJeW1wiICsgZnVsbFN0b3AgKyBcIl0kXCIgKTtcbnZhciBzZW50ZW5jZURlbGltaXRlclJlZ2V4ID0gbmV3IFJlZ0V4cCggXCJeW1wiICsgc2VudGVuY2VEZWxpbWl0ZXJzICsgXCJdJFwiICk7XG52YXIgc2VudGVuY2VSZWdleCA9IG5ldyBSZWdFeHAoIFwiXlteXCIgKyBmdWxsU3RvcCArIHNlbnRlbmNlRGVsaW1pdGVycyArIFwiPFxcXFwoXFxcXClcXFxcW1xcXFxdXSskXCIgKTtcbnZhciBodG1sU3RhcnRSZWdleCA9IC9ePChbXj5cXHNcXC9dKylbXj5dKj4kL21pO1xudmFyIGh0bWxFbmRSZWdleCA9IC9ePFxcLyhbXj5cXHNdKylbXj5dKj4kL21pO1xudmFyIG5ld0xpbmVSZWdleCA9IG5ldyBSZWdFeHAoIG5ld0xpbmVzICk7XG5cbnZhciBibG9ja1N0YXJ0UmVnZXggPSAvXlxccypbXFxbXFwoXFx7XVxccyokLztcbnZhciBibG9ja0VuZFJlZ2V4ID0gL15cXHMqW1xcXVxcKX1dXFxzKiQvO1xuXG52YXIgdG9rZW5zID0gW107XG52YXIgc2VudGVuY2VUb2tlbml6ZXI7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHRva2VuaXplciB0byBjcmVhdGUgdG9rZW5zIGZyb20gYSBzZW50ZW5jZS5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuZnVuY3Rpb24gY3JlYXRlVG9rZW5pemVyKCkge1xuXHR0b2tlbnMgPSBbXTtcblxuXHRzZW50ZW5jZVRva2VuaXplciA9IGNvcmUoIGZ1bmN0aW9uKCB0b2tlbiApIHtcblx0XHR0b2tlbnMucHVzaCggdG9rZW4gKTtcblx0fSApO1xuXG5cdHNlbnRlbmNlVG9rZW5pemVyLmFkZFJ1bGUoIGh0bWxTdGFydFJlZ2V4LCBcImh0bWwtc3RhcnRcIiApO1xuXHRzZW50ZW5jZVRva2VuaXplci5hZGRSdWxlKCBodG1sRW5kUmVnZXgsIFwiaHRtbC1lbmRcIiApO1xuXHRzZW50ZW5jZVRva2VuaXplci5hZGRSdWxlKCBibG9ja1N0YXJ0UmVnZXgsIFwiYmxvY2stc3RhcnRcIiApO1xuXHRzZW50ZW5jZVRva2VuaXplci5hZGRSdWxlKCBibG9ja0VuZFJlZ2V4LCBcImJsb2NrLWVuZFwiICk7XG5cdHNlbnRlbmNlVG9rZW5pemVyLmFkZFJ1bGUoIGZ1bGxTdG9wUmVnZXgsIFwiZnVsbC1zdG9wXCIgKTtcblx0c2VudGVuY2VUb2tlbml6ZXIuYWRkUnVsZSggc2VudGVuY2VEZWxpbWl0ZXJSZWdleCwgXCJzZW50ZW5jZS1kZWxpbWl0ZXJcIiApO1xuXHRzZW50ZW5jZVRva2VuaXplci5hZGRSdWxlKCBzZW50ZW5jZVJlZ2V4LCBcInNlbnRlbmNlXCIgKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IGEgY2VydGFpbiBjaGFyYWN0ZXIgaXMgYSBjYXBpdGFsIGxldHRlci5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY2hhcmFjdGVyIFRoZSBjaGFyYWN0ZXIgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhlIGNoYXJhY3RlciBpcyBhIGNhcGl0YWwgbGV0dGVyLlxuICovXG5mdW5jdGlvbiBpc0NhcGl0YWxMZXR0ZXIoIGNoYXJhY3RlciApIHtcblx0cmV0dXJuIGNoYXJhY3RlciAhPT0gY2hhcmFjdGVyLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG59XG5cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCBhIGNlcnRhaW4gY2hhcmFjdGVyIGlzIGEgbnVtYmVyLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjaGFyYWN0ZXIgVGhlIGNoYXJhY3RlciB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgY2hhcmFjdGVyIGlzIGEgY2FwaXRhbCBsZXR0ZXIuXG4gKi9cbmZ1bmN0aW9uIGlzTnVtYmVyKCBjaGFyYWN0ZXIgKSB7XG5cdHJldHVybiAhIGlzTmFOKCBwYXJzZUludCggY2hhcmFjdGVyLCAxMCApICk7XG59XG5cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCBhIGdpdmVuIEhUTUwgdGFnIGlzIGEgYnJlYWsgdGFnLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBodG1sVGFnIFRoZSBIVE1MIHRhZyB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gSFRNTCB0YWcgaXMgYSBicmVhayB0YWcuXG4gKi9cbmZ1bmN0aW9uIGlzQnJlYWtUYWcoIGh0bWxUYWcgKSB7XG5cdHJldHVybiAvPGJyLy50ZXN0KCBodG1sVGFnICk7XG59XG5cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCBhIGdpdmVuIGNoYXJhY3RlciBpcyBxdW90YXRpb24gbWFyay5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY2hhcmFjdGVyIFRoZSBjaGFyYWN0ZXIgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhlIGdpdmVuIGNoYXJhY3RlciBpcyBhIHF1b3RhdGlvbiBtYXJrLlxuICovXG5mdW5jdGlvbiBpc1F1b3RhdGlvbiggY2hhcmFjdGVyICkge1xuXHRjaGFyYWN0ZXIgPSBub3JtYWxpemVRdW90ZXMoIGNoYXJhY3RlciApO1xuXG5cdHJldHVybiBcIidcIiA9PT0gY2hhcmFjdGVyIHx8XG5cdFx0XCJcXFwiXCIgPT09IGNoYXJhY3Rlcjtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IGEgZ2l2ZW4gY2hhcmFjdGVyIGlzIGEgcHVuY3R1YXRpb24gbWFyayB0aGF0IGNhbiBiZSBhdCB0aGUgYmVnaW5uaW5nXG4gKiBvZiBhIHNlbnRlbmNlLCBsaWtlIMK/IGFuZCDCoSB1c2VkIGluIFNwYW5pc2guXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGNoYXJhY3RlciBUaGUgY2hhcmFjdGVyIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBjaGFyYWN0ZXIgaXMgYSBwdW5jdHVhdGlvbiBtYXJrLlxuICovXG5mdW5jdGlvbiBpc1B1bmN0dWF0aW9uKCBjaGFyYWN0ZXIgKSB7XG5cdHJldHVybiBcIsK/XCIgPT09IGNoYXJhY3RlciB8fFxuXHRcdFwiwqFcIiA9PT0gY2hhcmFjdGVyO1xufVxuXG4vKipcbiAqIFRva2VuaXplcyBhIHNlbnRlbmNlLCBhc3N1bWVzIHRoYXQgdGhlIHRleHQgaGFzIGFscmVhZHkgYmVlbiBzcGxpdCBpbnRvIGJsb2Nrcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byB0b2tlbml6ZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gQW4gYXJyYXkgb2YgdG9rZW5zLlxuICovXG5mdW5jdGlvbiB0b2tlbml6ZVNlbnRlbmNlcyggdGV4dCApIHtcblx0Y3JlYXRlVG9rZW5pemVyKCk7XG5cdHNlbnRlbmNlVG9rZW5pemVyLm9uVGV4dCggdGV4dCApO1xuXG5cdHNlbnRlbmNlVG9rZW5pemVyLmVuZCgpO1xuXG5cdHJldHVybiB0b2tlbnM7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBkdXBsaWNhdGUgd2hpdGVzcGFjZSBmcm9tIGEgZ2l2ZW4gdGV4dC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdGV4dCB3aXRoIGR1cGxpY2F0ZSB3aGl0ZXNwYWNlLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIHRleHQgd2l0aG91dCBkdXBsaWNhdGUgd2hpdGVzcGFjZS5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlRHVwbGljYXRlV2hpdGVzcGFjZSggdGV4dCApIHtcblx0cmV0dXJuIHRleHQucmVwbGFjZSggL1xccysvLCBcIiBcIiApO1xufVxuXG4vKipcbiAqIFJldHJpZXZlcyB0aGUgbmV4dCB0d28gY2hhcmFjdGVycyBmcm9tIGFuIGFycmF5IHdpdGggdGhlIHR3byBuZXh0IHRva2Vucy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBuZXh0VG9rZW5zIFRoZSB0d28gbmV4dCB0b2tlbnMuIE1pZ2h0IGJlIHVuZGVmaW5lZC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBuZXh0IHR3byBjaGFyYWN0ZXJzLlxuICovXG5mdW5jdGlvbiBnZXROZXh0VHdvQ2hhcmFjdGVycyggbmV4dFRva2VucyApIHtcblx0dmFyIG5leHQgPSBcIlwiO1xuXG5cdGlmICggISBpc1VuZGVmaW5lZCggbmV4dFRva2Vuc1sgMCBdICkgKSB7XG5cdFx0bmV4dCArPSBuZXh0VG9rZW5zWyAwIF0uc3JjO1xuXHR9XG5cblx0aWYgKCAhIGlzVW5kZWZpbmVkKCBuZXh0VG9rZW5zWyAxIF0gKSApIHtcblx0XHRuZXh0ICs9IG5leHRUb2tlbnNbIDEgXS5zcmM7XG5cdH1cblxuXHRuZXh0ID0gcmVtb3ZlRHVwbGljYXRlV2hpdGVzcGFjZSggbmV4dCApO1xuXG5cdHJldHVybiBuZXh0O1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgc2VudGVuY2VCZWdpbm5pbmcgYmVnaW5uaW5nIGlzIGEgdmFsaWQgYmVnaW5uaW5nLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZW50ZW5jZUJlZ2lubmluZyBUaGUgYmVnaW5uaW5nIG9mIHRoZSBzZW50ZW5jZSB0byB2YWxpZGF0ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIHRydWUgaWYgaXQgaXMgYSB2YWxpZCBiZWdpbm5pbmcsIGZhbHNlIGlmIGl0IGlzIG5vdC5cbiAqL1xuZnVuY3Rpb24gaXNWYWxpZFNlbnRlbmNlQmVnaW5uaW5nKCBzZW50ZW5jZUJlZ2lubmluZyApIHtcblx0cmV0dXJuIChcblx0XHRpc0NhcGl0YWxMZXR0ZXIoIHNlbnRlbmNlQmVnaW5uaW5nICkgfHxcblx0XHRpc051bWJlciggc2VudGVuY2VCZWdpbm5pbmcgKSB8fFxuXHRcdGlzUXVvdGF0aW9uKCBzZW50ZW5jZUJlZ2lubmluZyApIHx8XG5cdFx0aXNQdW5jdHVhdGlvbiggc2VudGVuY2VCZWdpbm5pbmcgKVxuXHQpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgdG9rZW4gaXMgYSB2YWxpZCBzZW50ZW5jZSBlbmRpbmcuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHRva2VuIFRoZSB0b2tlbiB0byB2YWxpZGF0ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIHRydWUgaWYgdGhlIHRva2VuIGlzIHZhbGlkIGVuZGluZywgZmFsc2UgaWYgaXQgaXMgbm90LlxuICovXG5mdW5jdGlvbiBpc1NlbnRlbmNlU3RhcnQoIHRva2VuICkge1xuXHRyZXR1cm4gKCAhIGlzVW5kZWZpbmVkKCB0b2tlbiApICYmIChcblx0XHRcImh0bWwtc3RhcnRcIiA9PT0gdG9rZW4udHlwZSB8fFxuXHRcdFwiaHRtbC1lbmRcIiA9PT0gdG9rZW4udHlwZSB8fFxuXHRcdFwiYmxvY2stc3RhcnRcIiA9PT0gdG9rZW4udHlwZVxuXHQpICk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhbiBhcnJheSBvZiBzZW50ZW5jZXMgZm9yIGEgZ2l2ZW4gYXJyYXkgb2YgdG9rZW5zLCBhc3N1bWVzIHRoYXQgdGhlIHRleHQgaGFzIGFscmVhZHkgYmVlbiBzcGxpdCBpbnRvIGJsb2Nrcy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSB0b2tlbnMgVGhlIHRva2VucyBmcm9tIHRoZSBzZW50ZW5jZSB0b2tlbml6ZXIuXG4gKiBAcmV0dXJucyB7QXJyYXk8c3RyaW5nPn0gQSBsaXN0IG9mIHNlbnRlbmNlcy5cbiAqL1xuZnVuY3Rpb24gZ2V0U2VudGVuY2VzRnJvbVRva2VucyggdG9rZW5zICkge1xuXHR2YXIgdG9rZW5TZW50ZW5jZXMgPSBbXSwgY3VycmVudFNlbnRlbmNlID0gXCJcIiwgbmV4dFNlbnRlbmNlU3RhcnQ7XG5cblx0dmFyIHNsaWNlZDtcblxuXHQvLyBEcm9wIHRoZSBmaXJzdCBhbmQgbGFzdCBIVE1MIHRhZyBpZiBib3RoIGFyZSBwcmVzZW50LlxuXHRkbyB7XG5cdFx0c2xpY2VkID0gZmFsc2U7XG5cdFx0dmFyIGZpcnN0VG9rZW4gPSB0b2tlbnNbIDAgXTtcblx0XHR2YXIgbGFzdFRva2VuID0gdG9rZW5zWyB0b2tlbnMubGVuZ3RoIC0gMSBdO1xuXG5cdFx0aWYgKCBmaXJzdFRva2VuLnR5cGUgPT09IFwiaHRtbC1zdGFydFwiICYmIGxhc3RUb2tlbi50eXBlID09PSBcImh0bWwtZW5kXCIgKSB7XG5cdFx0XHR0b2tlbnMgPSB0b2tlbnMuc2xpY2UoIDEsIHRva2Vucy5sZW5ndGggLSAxICk7XG5cblx0XHRcdHNsaWNlZCA9IHRydWU7XG5cdFx0fVxuXHR9IHdoaWxlICggc2xpY2VkICYmIHRva2Vucy5sZW5ndGggPiAxICk7XG5cblx0Zm9yRWFjaCggdG9rZW5zLCBmdW5jdGlvbiggdG9rZW4sIGkgKSB7XG5cdFx0dmFyIGhhc05leHRTZW50ZW5jZTtcblx0XHR2YXIgbmV4dFRva2VuID0gdG9rZW5zWyBpICsgMSBdO1xuXHRcdHZhciBzZWNvbmRUb05leHRUb2tlbiA9IHRva2Vuc1sgaSArIDIgXTtcblx0XHR2YXIgbmV4dENoYXJhY3RlcnM7XG5cblx0XHRzd2l0Y2ggKCB0b2tlbi50eXBlICkge1xuXG5cdFx0XHRjYXNlIFwiaHRtbC1zdGFydFwiOlxuXHRcdFx0Y2FzZSBcImh0bWwtZW5kXCI6XG5cdFx0XHRcdGlmICggaXNCcmVha1RhZyggdG9rZW4uc3JjICkgKSB7XG5cdFx0XHRcdFx0dG9rZW5TZW50ZW5jZXMucHVzaCggY3VycmVudFNlbnRlbmNlICk7XG5cdFx0XHRcdFx0Y3VycmVudFNlbnRlbmNlID0gXCJcIjtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjdXJyZW50U2VudGVuY2UgKz0gdG9rZW4uc3JjO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFwic2VudGVuY2VcIjpcblx0XHRcdFx0Y3VycmVudFNlbnRlbmNlICs9IHRva2VuLnNyYztcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgXCJzZW50ZW5jZS1kZWxpbWl0ZXJcIjpcblx0XHRcdFx0Y3VycmVudFNlbnRlbmNlICs9IHRva2VuLnNyYztcblxuXHRcdFx0XHRpZiAoICEgaXNVbmRlZmluZWQoIG5leHRUb2tlbiApICYmIFwiYmxvY2stZW5kXCIgIT09IG5leHRUb2tlbi50eXBlICkge1xuXHRcdFx0XHRcdHRva2VuU2VudGVuY2VzLnB1c2goIGN1cnJlbnRTZW50ZW5jZSApO1xuXHRcdFx0XHRcdGN1cnJlbnRTZW50ZW5jZSA9IFwiXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgXCJmdWxsLXN0b3BcIjpcblx0XHRcdFx0Y3VycmVudFNlbnRlbmNlICs9IHRva2VuLnNyYztcblxuXHRcdFx0XHRuZXh0Q2hhcmFjdGVycyA9IGdldE5leHRUd29DaGFyYWN0ZXJzKCBbIG5leHRUb2tlbiwgc2Vjb25kVG9OZXh0VG9rZW4gXSApO1xuXG5cdFx0XHRcdC8vIEZvciBhIG5ldyBzZW50ZW5jZSB3ZSBuZWVkIHRvIGNoZWNrIHRoZSBuZXh0IHR3byBjaGFyYWN0ZXJzLlxuXHRcdFx0XHRoYXNOZXh0U2VudGVuY2UgPSBuZXh0Q2hhcmFjdGVycy5sZW5ndGggPj0gMjtcblx0XHRcdFx0bmV4dFNlbnRlbmNlU3RhcnQgPSBoYXNOZXh0U2VudGVuY2UgPyBuZXh0Q2hhcmFjdGVyc1sgMSBdIDogXCJcIjtcblx0XHRcdFx0Ly8gSWYgdGhlIG5leHQgY2hhcmFjdGVyIGlzIGEgbnVtYmVyLCBuZXZlciBzcGxpdC4gRm9yIGV4YW1wbGU6IElQdjQtbnVtYmVycy5cblx0XHRcdFx0aWYgKCBoYXNOZXh0U2VudGVuY2UgJiYgaXNOdW1iZXIoIG5leHRDaGFyYWN0ZXJzWyAwIF0gKSApIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBPbmx5IHNwbGl0IG9uIHNlbnRlbmNlIGRlbGltaXRlcnMgd2hlbiB0aGUgbmV4dCBzZW50ZW5jZSBsb29rcyBsaWtlIHRoZSBzdGFydCBvZiBhIHNlbnRlbmNlLlxuXHRcdFx0XHRpZiAoICggaGFzTmV4dFNlbnRlbmNlICYmIGlzVmFsaWRTZW50ZW5jZUJlZ2lubmluZyggbmV4dFNlbnRlbmNlU3RhcnQgKSApIHx8IGlzU2VudGVuY2VTdGFydCggbmV4dFRva2VuICkgKSB7XG5cdFx0XHRcdFx0dG9rZW5TZW50ZW5jZXMucHVzaCggY3VycmVudFNlbnRlbmNlICk7XG5cdFx0XHRcdFx0Y3VycmVudFNlbnRlbmNlID0gXCJcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBcIm5ld2xpbmVcIjpcblx0XHRcdFx0dG9rZW5TZW50ZW5jZXMucHVzaCggY3VycmVudFNlbnRlbmNlICk7XG5cdFx0XHRcdGN1cnJlbnRTZW50ZW5jZSA9IFwiXCI7XG5cdFx0XHRcdGJyZWFrO1xuXG5cdFx0XHRjYXNlIFwiYmxvY2stc3RhcnRcIjpcblx0XHRcdFx0Y3VycmVudFNlbnRlbmNlICs9IHRva2VuLnNyYztcblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgXCJibG9jay1lbmRcIjpcblx0XHRcdFx0Y3VycmVudFNlbnRlbmNlICs9IHRva2VuLnNyYztcblxuXHRcdFx0XHRuZXh0Q2hhcmFjdGVycyA9IGdldE5leHRUd29DaGFyYWN0ZXJzKCBbIG5leHRUb2tlbiwgc2Vjb25kVG9OZXh0VG9rZW4gXSApO1xuXG5cdFx0XHRcdC8vIEZvciBhIG5ldyBzZW50ZW5jZSB3ZSBuZWVkIHRvIGNoZWNrIHRoZSBuZXh0IHR3byBjaGFyYWN0ZXJzLlxuXHRcdFx0XHRoYXNOZXh0U2VudGVuY2UgPSBuZXh0Q2hhcmFjdGVycy5sZW5ndGggPj0gMjtcblx0XHRcdFx0bmV4dFNlbnRlbmNlU3RhcnQgPSBoYXNOZXh0U2VudGVuY2UgPyBuZXh0Q2hhcmFjdGVyc1sgMCBdIDogXCJcIjtcblx0XHRcdFx0Ly8gSWYgdGhlIG5leHQgY2hhcmFjdGVyIGlzIGEgbnVtYmVyLCBuZXZlciBzcGxpdC4gRm9yIGV4YW1wbGU6IElQdjQtbnVtYmVycy5cblx0XHRcdFx0aWYgKCBoYXNOZXh0U2VudGVuY2UgJiYgaXNOdW1iZXIoIG5leHRDaGFyYWN0ZXJzWyAwIF0gKSApIHtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggKCBoYXNOZXh0U2VudGVuY2UgJiYgaXNWYWxpZFNlbnRlbmNlQmVnaW5uaW5nKCBuZXh0U2VudGVuY2VTdGFydCApICkgfHwgaXNTZW50ZW5jZVN0YXJ0KCBuZXh0VG9rZW4gKSApIHtcblx0XHRcdFx0XHR0b2tlblNlbnRlbmNlcy5wdXNoKCBjdXJyZW50U2VudGVuY2UgKTtcblx0XHRcdFx0XHRjdXJyZW50U2VudGVuY2UgPSBcIlwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fSApO1xuXG5cdGlmICggXCJcIiAhPT0gY3VycmVudFNlbnRlbmNlICkge1xuXHRcdHRva2VuU2VudGVuY2VzLnB1c2goIGN1cnJlbnRTZW50ZW5jZSApO1xuXHR9XG5cblx0dG9rZW5TZW50ZW5jZXMgPSBtYXAoIHRva2VuU2VudGVuY2VzLCBmdW5jdGlvbiggc2VudGVuY2UgKSB7XG5cdFx0cmV0dXJuIHNlbnRlbmNlLnRyaW0oKTtcblx0fSApO1xuXG5cdHJldHVybiB0b2tlblNlbnRlbmNlcztcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBzZW50ZW5jZXMgZnJvbSBhIGNlcnRhaW4gYmxvY2suXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJsb2NrIFRoZSBIVE1MIGluc2lkZSBhIEhUTUwgYmxvY2suXG4gKiBAcmV0dXJucyB7QXJyYXk8c3RyaW5nPn0gVGhlIGxpc3Qgb2Ygc2VudGVuY2VzIGluIHRoZSBibG9jay5cbiAqL1xuZnVuY3Rpb24gZ2V0U2VudGVuY2VzRnJvbUJsb2NrKCBibG9jayApIHtcblx0dmFyIHRva2VucyA9IHRva2VuaXplU2VudGVuY2VzKCBibG9jayApO1xuXG5cdHJldHVybiB0b2tlbnMubGVuZ3RoID09PSAwID8gW10gOiBnZXRTZW50ZW5jZXNGcm9tVG9rZW5zKCB0b2tlbnMgKTtcbn1cblxudmFyIGdldFNlbnRlbmNlc0Zyb21CbG9ja0NhY2hlZCA9IG1lbW9pemUoIGdldFNlbnRlbmNlc0Zyb21CbG9jayApO1xuXG4vKipcbiAqIFJldHVybnMgc2VudGVuY2VzIGluIGEgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0IFRoZSBzdHJpbmcgdG8gY291bnQgc2VudGVuY2VzIGluLlxuICogQHJldHVybnMge0FycmF5fSBTZW50ZW5jZXMgZm91bmQgaW4gdGhlIHRleHQuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHRleHQgKSB7XG5cdHRleHQgPSB1bmlmeVdoaXRlc3BhY2UoIHRleHQgKTtcblx0dmFyIHNlbnRlbmNlcywgYmxvY2tzID0gZ2V0QmxvY2tzKCB0ZXh0ICk7XG5cblx0Ly8gU3BsaXQgZWFjaCBibG9jayBvbiBuZXdsaW5lcy5cblx0YmxvY2tzID0gZmxhdE1hcCggYmxvY2tzLCBmdW5jdGlvbiggYmxvY2sgKSB7XG5cdFx0cmV0dXJuIGJsb2NrLnNwbGl0KCBuZXdMaW5lUmVnZXggKTtcblx0fSApO1xuXG5cdHNlbnRlbmNlcyA9IGZsYXRNYXAoIGJsb2NrcywgZ2V0U2VudGVuY2VzRnJvbUJsb2NrQ2FjaGVkICk7XG5cblx0cmV0dXJuIGZpbHRlciggc2VudGVuY2VzLCBuZWdhdGUoIGlzRW1wdHkgKSApO1xufTtcbiIsIi8qKiBAbW9kdWxlIHN0cmluZ1Byb2Nlc3NpbmcvY291bnRXb3JkcyAqL1xuXG52YXIgc3RyaXBUYWdzID0gcmVxdWlyZSggXCIuL3N0cmlwSFRNTFRhZ3MuanNcIiApLnN0cmlwRnVsbFRhZ3M7XG52YXIgc3RyaXBTcGFjZXMgPSByZXF1aXJlKCBcIi4vc3RyaXBTcGFjZXMuanNcIiApO1xudmFyIHJlbW92ZVB1bmN0dWF0aW9uID0gcmVxdWlyZSggXCIuL3JlbW92ZVB1bmN0dWF0aW9uLmpzXCIgKTtcbnZhciBtYXAgPSByZXF1aXJlKCBcImxvZGFzaC9tYXBcIiApO1xudmFyIGZpbHRlciA9IHJlcXVpcmUoIFwibG9kYXNoL2ZpbHRlclwiICk7XG5cbi8qKlxuICogUmV0dXJucyBhbiBhcnJheSB3aXRoIHdvcmRzIHVzZWQgaW4gdGhlIHRleHQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gYmUgY291bnRlZC5cbiAqIEByZXR1cm5zIHtBcnJheX0gVGhlIGFycmF5IHdpdGggYWxsIHdvcmRzLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHR0ZXh0ID0gc3RyaXBTcGFjZXMoIHN0cmlwVGFncyggdGV4dCApICk7XG5cdGlmICggdGV4dCA9PT0gXCJcIiApIHtcblx0XHRyZXR1cm4gW107XG5cdH1cblxuXHR2YXIgd29yZHMgPSB0ZXh0LnNwbGl0KCAvXFxzL2cgKTtcblxuXHR3b3JkcyA9IG1hcCggd29yZHMsIGZ1bmN0aW9uKCB3b3JkICkge1xuXHRcdHJldHVybiByZW1vdmVQdW5jdHVhdGlvbiggd29yZCApO1xuXHR9ICk7XG5cblx0cmV0dXJuIGZpbHRlciggd29yZHMsIGZ1bmN0aW9uKCB3b3JkICkge1xuXHRcdHJldHVybiB3b3JkLnRyaW0oKSAhPT0gXCJcIjtcblx0fSApO1xufTtcblxuIiwiLyoqXG4gKiBOb3JtYWxpemVzIHNpbmdsZSBxdW90ZXMgdG8gJ3JlZ3VsYXInIHF1b3Rlcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUZXh0IHRvIG5vcm1hbGl6ZS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBub3JtYWxpemVkIHRleHQuXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZVNpbmdsZVF1b3RlcyggdGV4dCApIHtcblx0cmV0dXJuIHRleHQucmVwbGFjZSggL1vigJjigJnigJtgXS9nLCBcIidcIiApO1xufVxuXG4vKipcbiAqIE5vcm1hbGl6ZXMgZG91YmxlIHF1b3RlcyB0byAncmVndWxhcicgcXVvdGVzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRleHQgdG8gbm9ybWFsaXplLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIG5vcm1hbGl6ZWQgdGV4dC5cbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplRG91YmxlUXVvdGVzKCB0ZXh0ICkge1xuXHRyZXR1cm4gdGV4dC5yZXBsYWNlKCAvW+KAnOKAneOAneOAnuOAn+KAn+KAnl0vZywgXCJcXFwiXCIgKTtcbn1cblxuLyoqXG4gKiBOb3JtYWxpemVzIHF1b3RlcyB0byAncmVndWxhcicgcXVvdGVzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRleHQgdG8gbm9ybWFsaXplLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIG5vcm1hbGl6ZWQgdGV4dC5cbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplUXVvdGVzKCB0ZXh0ICkge1xuXHRyZXR1cm4gbm9ybWFsaXplRG91YmxlUXVvdGVzKCBub3JtYWxpemVTaW5nbGVRdW90ZXMoIHRleHQgKSApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0bm9ybWFsaXplU2luZ2xlOiBub3JtYWxpemVTaW5nbGVRdW90ZXMsXG5cdG5vcm1hbGl6ZURvdWJsZTogbm9ybWFsaXplRG91YmxlUXVvdGVzLFxuXHRub3JtYWxpemU6IG5vcm1hbGl6ZVF1b3Rlcyxcbn07XG4iLCJ2YXIgZ2V0V29yZHMgPSByZXF1aXJlKCBcIi4uL3N0cmluZ1Byb2Nlc3NpbmcvZ2V0V29yZHNcIiApO1xudmFyIGdldFNlbnRlbmNlcyA9IHJlcXVpcmUoIFwiLi4vc3RyaW5nUHJvY2Vzc2luZy9nZXRTZW50ZW5jZXNcIiApO1xudmFyIFdvcmRDb21iaW5hdGlvbiA9IHJlcXVpcmUoIFwiLi4vdmFsdWVzL1dvcmRDb21iaW5hdGlvblwiICk7XG52YXIgbm9ybWFsaXplUXVvdGVzID0gcmVxdWlyZSggXCIuLi9zdHJpbmdQcm9jZXNzaW5nL3F1b3Rlcy5qc1wiICkubm9ybWFsaXplO1xudmFyIGdlcm1hbkZ1bmN0aW9uV29yZHMgPSByZXF1aXJlKCBcIi4uL3Jlc2VhcmNoZXMvZ2VybWFuL2Z1bmN0aW9uV29yZHMuanNcIiApO1xudmFyIGVuZ2xpc2hGdW5jdGlvbldvcmRzID0gcmVxdWlyZSggXCIuLi9yZXNlYXJjaGVzL2VuZ2xpc2gvZnVuY3Rpb25Xb3Jkcy5qc1wiICk7XG52YXIgY291bnRTeWxsYWJsZXMgPSByZXF1aXJlKCBcIi4uL3N0cmluZ1Byb2Nlc3Npbmcvc3lsbGFibGVzL2NvdW50LmpzXCIgKTtcbnZhciBnZXRMYW5ndWFnZSA9IHJlcXVpcmUoIFwiLi4vaGVscGVycy9nZXRMYW5ndWFnZS5qc1wiICk7XG5cbnZhciBmaWx0ZXIgPSByZXF1aXJlKCBcImxvZGFzaC9maWx0ZXJcIiApO1xudmFyIG1hcCA9IHJlcXVpcmUoIFwibG9kYXNoL21hcFwiICk7XG52YXIgZm9yRWFjaCA9IHJlcXVpcmUoIFwibG9kYXNoL2ZvckVhY2hcIiApO1xudmFyIGhhcyA9IHJlcXVpcmUoIFwibG9kYXNoL2hhc1wiICk7XG52YXIgZmxhdE1hcCA9IHJlcXVpcmUoIFwibG9kYXNoL2ZsYXRNYXBcIiApO1xudmFyIHZhbHVlcyA9IHJlcXVpcmUoIFwibG9kYXNoL3ZhbHVlc1wiICk7XG52YXIgdGFrZSA9IHJlcXVpcmUoIFwibG9kYXNoL3Rha2VcIiApO1xudmFyIGluY2x1ZGVzID0gcmVxdWlyZSggXCJsb2Rhc2gvaW5jbHVkZXNcIiApO1xudmFyIGludGVyc2VjdGlvbiA9IHJlcXVpcmUoIFwibG9kYXNoL2ludGVyc2VjdGlvblwiICk7XG52YXIgaXNFbXB0eSA9IHJlcXVpcmUoIFwibG9kYXNoL2lzRW1wdHlcIiApO1xuXG52YXIgZGVuc2l0eUxvd2VyTGltaXQgPSAwO1xudmFyIGRlbnNpdHlVcHBlckxpbWl0ID0gMC4wMztcbnZhciByZWxldmFudFdvcmRMaW1pdCA9IDEwMDtcbnZhciB3b3JkQ291bnRMb3dlckxpbWl0ID0gMjAwO1xuXG4vLyBFbiBkYXNoLCBlbSBkYXNoLCBoeXBoZW4tbWludXMsIGFuZCBoYXNoLlxudmFyIHNwZWNpYWxDaGFyYWN0ZXJzID0gWyBcIuKAk1wiLCBcIuKAlFwiLCBcIi1cIiwgXCIjXCIgXTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSB3b3JkIGNvbWJpbmF0aW9ucyBmb3IgdGhlIGdpdmVuIHRleHQgYmFzZWQgb24gdGhlIGNvbWJpbmF0aW9uIHNpemUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gcmV0cmlldmUgY29tYmluYXRpb25zIGZvci5cbiAqIEBwYXJhbSB7bnVtYmVyfSBjb21iaW5hdGlvblNpemUgVGhlIHNpemUgb2YgdGhlIGNvbWJpbmF0aW9ucyB0byByZXRyaWV2ZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmN0aW9uV29yZHMgVGhlIGZ1bmN0aW9uIGNvbnRhaW5pbmcgdGhlIGxpc3RzIG9mIGZ1bmN0aW9uIHdvcmRzLlxuICogQHJldHVybnMge1dvcmRDb21iaW5hdGlvbltdfSBBbGwgd29yZCBjb21iaW5hdGlvbnMgZm9yIHRoZSBnaXZlbiB0ZXh0LlxuICovXG5mdW5jdGlvbiBnZXRXb3JkQ29tYmluYXRpb25zKCB0ZXh0LCBjb21iaW5hdGlvblNpemUsIGZ1bmN0aW9uV29yZHMgKSB7XG5cdHZhciBzZW50ZW5jZXMgPSBnZXRTZW50ZW5jZXMoIHRleHQgKTtcblxuXHR2YXIgd29yZHMsIGNvbWJpbmF0aW9uO1xuXG5cdHJldHVybiBmbGF0TWFwKCBzZW50ZW5jZXMsIGZ1bmN0aW9uKCBzZW50ZW5jZSApIHtcblx0XHRzZW50ZW5jZSA9IHNlbnRlbmNlLnRvTG9jYWxlTG93ZXJDYXNlKCk7XG5cdFx0c2VudGVuY2UgPSBub3JtYWxpemVRdW90ZXMoIHNlbnRlbmNlICk7XG5cdFx0d29yZHMgPSBnZXRXb3Jkcyggc2VudGVuY2UgKTtcblxuXHRcdHJldHVybiBmaWx0ZXIoIG1hcCggd29yZHMsIGZ1bmN0aW9uKCB3b3JkLCBpICkge1xuXHRcdFx0Ly8gSWYgdGhlcmUgYXJlIHN0aWxsIGVub3VnaCB3b3JkcyBpbiB0aGUgc2VudGVuY2UgdG8gc2xpY2Ugb2YuXG5cdFx0XHRpZiAoIGkgKyBjb21iaW5hdGlvblNpemUgLSAxIDwgd29yZHMubGVuZ3RoICkge1xuXHRcdFx0XHRjb21iaW5hdGlvbiA9IHdvcmRzLnNsaWNlKCBpLCBpICsgY29tYmluYXRpb25TaXplICk7XG5cdFx0XHRcdHJldHVybiBuZXcgV29yZENvbWJpbmF0aW9uKCBjb21iaW5hdGlvbiwgMCwgZnVuY3Rpb25Xb3JkcyApO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSApICk7XG5cdH0gKTtcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGVzIG9jY3VycmVuY2VzIGZvciBhIGxpc3Qgb2Ygd29yZCBjb21iaW5hdGlvbnMuXG4gKlxuICogQHBhcmFtIHtXb3JkQ29tYmluYXRpb25bXX0gd29yZENvbWJpbmF0aW9ucyBUaGUgd29yZCBjb21iaW5hdGlvbnMgdG8gY2FsY3VsYXRlIG9jY3VycmVuY2VzIGZvci5cbiAqIEByZXR1cm5zIHtXb3JkQ29tYmluYXRpb25bXX0gV29yZCBjb21iaW5hdGlvbnMgd2l0aCB0aGVpciByZXNwZWN0aXZlIG9jY3VycmVuY2VzLlxuICovXG5mdW5jdGlvbiBjYWxjdWxhdGVPY2N1cnJlbmNlcyggd29yZENvbWJpbmF0aW9ucyApIHtcblx0dmFyIG9jY3VycmVuY2VzID0ge307XG5cblx0Zm9yRWFjaCggd29yZENvbWJpbmF0aW9ucywgZnVuY3Rpb24oIHdvcmRDb21iaW5hdGlvbiApIHtcblx0XHR2YXIgY29tYmluYXRpb24gPSB3b3JkQ29tYmluYXRpb24uZ2V0Q29tYmluYXRpb24oKTtcblxuXHRcdGlmICggISBoYXMoIG9jY3VycmVuY2VzLCBjb21iaW5hdGlvbiApICkge1xuXHRcdFx0b2NjdXJyZW5jZXNbIGNvbWJpbmF0aW9uIF0gPSB3b3JkQ29tYmluYXRpb247XG5cdFx0fVxuXG5cdFx0b2NjdXJyZW5jZXNbIGNvbWJpbmF0aW9uIF0uaW5jcmVtZW50T2NjdXJyZW5jZXMoKTtcblx0fSApO1xuXG5cdHJldHVybiB2YWx1ZXMoIG9jY3VycmVuY2VzICk7XG59XG5cbi8qKlxuICogUmV0dXJucyBvbmx5IHRoZSByZWxldmFudCBjb21iaW5hdGlvbnMgZnJvbSBhIGxpc3Qgb2Ygd29yZCBjb21iaW5hdGlvbnMuIEFzc3VtZXNcbiAqIG9jY3VycmVuY2VzIGhhdmUgYWxyZWFkeSBiZWVuIGNhbGN1bGF0ZWQuXG4gKlxuICogQHBhcmFtIHtXb3JkQ29tYmluYXRpb25bXX0gd29yZENvbWJpbmF0aW9ucyBBIGxpc3Qgb2Ygd29yZCBjb21iaW5hdGlvbnMuXG4gKiBAcmV0dXJucyB7V29yZENvbWJpbmF0aW9uW119IE9ubHkgcmVsZXZhbnQgd29yZCBjb21iaW5hdGlvbnMuXG4gKi9cbmZ1bmN0aW9uIGdldFJlbGV2YW50Q29tYmluYXRpb25zKCB3b3JkQ29tYmluYXRpb25zICkge1xuXHR3b3JkQ29tYmluYXRpb25zID0gd29yZENvbWJpbmF0aW9ucy5maWx0ZXIoIGZ1bmN0aW9uKCBjb21iaW5hdGlvbiApIHtcblx0XHRyZXR1cm4gY29tYmluYXRpb24uZ2V0T2NjdXJyZW5jZXMoKSAhPT0gMSAmJlxuXHRcdFx0Y29tYmluYXRpb24uZ2V0UmVsZXZhbmNlKCkgIT09IDA7XG5cdH0gKTtcblx0cmV0dXJuIHdvcmRDb21iaW5hdGlvbnM7XG59XG5cbi8qKlxuICogU29ydHMgY29tYmluYXRpb25zIGJhc2VkIG9uIHRoZWlyIHJlbGV2YW5jZSBhbmQgbGVuZ3RoLlxuICpcbiAqIEBwYXJhbSB7V29yZENvbWJpbmF0aW9uW119IHdvcmRDb21iaW5hdGlvbnMgVGhlIGNvbWJpbmF0aW9ucyB0byBzb3J0LlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIHNvcnRDb21iaW5hdGlvbnMoIHdvcmRDb21iaW5hdGlvbnMgKSB7XG5cdHdvcmRDb21iaW5hdGlvbnMuc29ydCggZnVuY3Rpb24oIGNvbWJpbmF0aW9uQSwgY29tYmluYXRpb25CICkge1xuXHRcdHZhciBkaWZmZXJlbmNlID0gY29tYmluYXRpb25CLmdldFJlbGV2YW5jZSgpIC0gY29tYmluYXRpb25BLmdldFJlbGV2YW5jZSgpO1xuXHRcdC8vIFRoZSBjb21iaW5hdGlvbiB3aXRoIHRoZSBoaWdoZXN0IHJlbGV2YW5jZSBjb21lcyBmaXJzdC5cblx0XHRpZiAoIGRpZmZlcmVuY2UgIT09IDAgKSB7XG5cdFx0XHRyZXR1cm4gZGlmZmVyZW5jZTtcblx0XHR9XG5cdFx0Ly8gSW4gY2FzZSBvZiBhIHRpZSBvbiByZWxldmFuY2UsIHRoZSBsb25nZXN0IGNvbWJpbmF0aW9uIGNvbWVzIGZpcnN0LlxuXHRcdHJldHVybiBjb21iaW5hdGlvbkIuZ2V0TGVuZ3RoKCkgLSBjb21iaW5hdGlvbkEuZ2V0TGVuZ3RoKCk7XG5cdH0gKTtcbn1cblxuLyoqXG4gKiBGaWx0ZXJzIHdvcmQgY29tYmluYXRpb25zIGJlZ2lubmluZyB3aXRoIGNlcnRhaW4gZnVuY3Rpb24gd29yZHMuXG4gKlxuICogQHBhcmFtIHtXb3JkQ29tYmluYXRpb25bXX0gd29yZENvbWJpbmF0aW9ucyBUaGUgd29yZCBjb21iaW5hdGlvbnMgdG8gZmlsdGVyLlxuICogQHBhcmFtIHthcnJheX0gZnVuY3Rpb25Xb3JkcyBUaGUgbGlzdCBvZiBmdW5jdGlvbiB3b3Jkcy5cbiAqIEByZXR1cm5zIHtXb3JkQ29tYmluYXRpb25bXX0gRmlsdGVyZWQgd29yZCBjb21iaW5hdGlvbnMuXG4gKi9cbmZ1bmN0aW9uIGZpbHRlckZ1bmN0aW9uV29yZHNBdEJlZ2lubmluZyggd29yZENvbWJpbmF0aW9ucywgZnVuY3Rpb25Xb3JkcyApIHtcblx0cmV0dXJuIHdvcmRDb21iaW5hdGlvbnMuZmlsdGVyKCBmdW5jdGlvbiggY29tYmluYXRpb24gKSB7XG5cdFx0cmV0dXJuICEgaW5jbHVkZXMoIGZ1bmN0aW9uV29yZHMsIGNvbWJpbmF0aW9uLmdldFdvcmRzKClbIDAgXSApO1xuXHR9ICk7XG59XG5cbi8qKlxuICogRmlsdGVycyB3b3JkIGNvbWJpbmF0aW9ucyBlbmRpbmcgd2l0aCBjZXJ0YWluIGZ1bmN0aW9uIHdvcmRzLlxuICpcbiAqIEBwYXJhbSB7V29yZENvbWJpbmF0aW9uW119IHdvcmRDb21iaW5hdGlvbnMgVGhlIHdvcmQgY29tYmluYXRpb25zIHRvIGZpbHRlci5cbiAqIEBwYXJhbSB7YXJyYXl9IGZ1bmN0aW9uV29yZHMgVGhlIGxpc3Qgb2YgZnVuY3Rpb24gd29yZHMuXG4gKiBAcmV0dXJucyB7V29yZENvbWJpbmF0aW9uW119IEZpbHRlcmVkIHdvcmQgY29tYmluYXRpb25zLlxuICovXG5mdW5jdGlvbiBmaWx0ZXJGdW5jdGlvbldvcmRzQXRFbmRpbmcoIHdvcmRDb21iaW5hdGlvbnMsIGZ1bmN0aW9uV29yZHMgKSB7XG5cdHJldHVybiB3b3JkQ29tYmluYXRpb25zLmZpbHRlciggZnVuY3Rpb24oIGNvbWJpbmF0aW9uICkge1xuXHRcdHZhciB3b3JkcyA9IGNvbWJpbmF0aW9uLmdldFdvcmRzKCk7XG5cdFx0dmFyIGxhc3RXb3JkSW5kZXggPSB3b3Jkcy5sZW5ndGggLSAxO1xuXHRcdHJldHVybiAhIGluY2x1ZGVzKCBmdW5jdGlvbldvcmRzLCB3b3Jkc1sgbGFzdFdvcmRJbmRleCBdICk7XG5cdH0gKTtcbn1cblxuLyoqXG4gKiBGaWx0ZXJzIHdvcmQgY29tYmluYXRpb25zIGJlZ2lubmluZyBhbmQgZW5kaW5nIHdpdGggY2VydGFpbiBmdW5jdGlvbiB3b3Jkcy5cbiAqXG4gKiBAcGFyYW0ge1dvcmRDb21iaW5hdGlvbltdfSB3b3JkQ29tYmluYXRpb25zIFRoZSB3b3JkIGNvbWJpbmF0aW9ucyB0byBmaWx0ZXIuXG4gKiBAcGFyYW0ge0FycmF5fSBmdW5jdGlvbldvcmRzIFRoZSBsaXN0IG9mIGZ1bmN0aW9uIHdvcmRzLlxuICogQHJldHVybnMge1dvcmRDb21iaW5hdGlvbltdfSBGaWx0ZXJlZCB3b3JkIGNvbWJpbmF0aW9ucy5cbiAqL1xuZnVuY3Rpb24gZmlsdGVyRnVuY3Rpb25Xb3Jkcyggd29yZENvbWJpbmF0aW9ucywgZnVuY3Rpb25Xb3JkcyApIHtcblx0d29yZENvbWJpbmF0aW9ucyA9IGZpbHRlckZ1bmN0aW9uV29yZHNBdEJlZ2lubmluZyggd29yZENvbWJpbmF0aW9ucywgZnVuY3Rpb25Xb3JkcyApO1xuXHR3b3JkQ29tYmluYXRpb25zID0gZmlsdGVyRnVuY3Rpb25Xb3Jkc0F0RW5kaW5nKCB3b3JkQ29tYmluYXRpb25zLCBmdW5jdGlvbldvcmRzICk7XG5cdHJldHVybiB3b3JkQ29tYmluYXRpb25zO1xufVxuXG4vKipcbiAqIEZpbHRlcnMgd29yZCBjb21iaW5hdGlvbnMgY29udGFpbmluZyBhIHNwZWNpYWwgY2hhcmFjdGVyLlxuICpcbiAqIEBwYXJhbSB7V29yZENvbWJpbmF0aW9uW119IHdvcmRDb21iaW5hdGlvbnMgVGhlIHdvcmQgY29tYmluYXRpb25zIHRvIGZpbHRlci5cbiAqIEBwYXJhbSB7YXJyYXl9IHNwZWNpYWxDaGFyYWN0ZXJzIFRoZSBsaXN0IG9mIHNwZWNpYWwgY2hhcmFjdGVycy5cbiAqIEByZXR1cm5zIHtXb3JkQ29tYmluYXRpb25bXX0gRmlsdGVyZWQgd29yZCBjb21iaW5hdGlvbnMuXG4gKi9cbmZ1bmN0aW9uIGZpbHRlclNwZWNpYWxDaGFyYWN0ZXJzKCB3b3JkQ29tYmluYXRpb25zLCBzcGVjaWFsQ2hhcmFjdGVycyApIHtcblx0cmV0dXJuIHdvcmRDb21iaW5hdGlvbnMuZmlsdGVyKCBmdW5jdGlvbiggY29tYmluYXRpb24gKSB7XG5cdFx0cmV0dXJuIGlzRW1wdHkoXG5cdFx0XHRpbnRlcnNlY3Rpb24oIHNwZWNpYWxDaGFyYWN0ZXJzLCBjb21iaW5hdGlvbi5nZXRXb3JkcygpIClcblx0XHQpO1xuXHR9ICk7XG59XG4vKipcbiAqIEZpbHRlcnMgd29yZCBjb21iaW5hdGlvbnMgd2l0aCBhIGxlbmd0aCBvZiBvbmUgYW5kIGEgZ2l2ZW4gc3lsbGFibGUgY291bnQuXG4gKlxuICogQHBhcmFtIHtXb3JkQ29tYmluYXRpb25bXX0gd29yZENvbWJpbmF0aW9ucyBUaGUgd29yZCBjb21iaW5hdGlvbnMgdG8gZmlsdGVyLlxuICogQHBhcmFtIHtudW1iZXJ9IHN5bGxhYmxlQ291bnQgVGhlIG51bWJlciBvZiBzeWxsYWJsZXMgdG8gdXNlIGZvciBmaWx0ZXJpbmcuXG4gKiBAcGFyYW0ge3N0cmluZ30gbG9jYWxlIFRoZSBwYXBlcidzIGxvY2FsZS5cbiAqIEByZXR1cm5zIHtXb3JkQ29tYmluYXRpb25bXX0gRmlsdGVyZWQgd29yZCBjb21iaW5hdGlvbnMuXG4gKi9cbmZ1bmN0aW9uIGZpbHRlck9uU3lsbGFibGVDb3VudCggd29yZENvbWJpbmF0aW9ucywgc3lsbGFibGVDb3VudCwgbG9jYWxlICkge1xuXHRyZXR1cm4gd29yZENvbWJpbmF0aW9ucy5maWx0ZXIoIGZ1bmN0aW9uKCBjb21iaW5hdGlvbiApICB7XG5cdFx0cmV0dXJuICEgKCBjb21iaW5hdGlvbi5nZXRMZW5ndGgoKSA9PT0gMSAmJiBjb3VudFN5bGxhYmxlcyggY29tYmluYXRpb24uZ2V0V29yZHMoKVsgMCBdLCBsb2NhbGUgKSA8PSBzeWxsYWJsZUNvdW50ICk7XG5cdH0gKTtcbn1cblxuLyoqXG4gKiBGaWx0ZXJzIHdvcmQgY29tYmluYXRpb25zIGJhc2VkIG9uIGtleXdvcmQgZGVuc2l0eSBpZiB0aGUgd29yZCBjb3VudCBpcyAyMDAgb3Igb3Zlci5cbiAqXG4gKiBAcGFyYW0ge1dvcmRDb21iaW5hdGlvbltdfSB3b3JkQ29tYmluYXRpb25zIFRoZSB3b3JkIGNvbWJpbmF0aW9ucyB0byBmaWx0ZXIuXG4gKiBAcGFyYW0ge251bWJlcn0gd29yZENvdW50IFRoZSBudW1iZXIgb2Ygd29yZHMgaW4gdGhlIHRvdGFsIHRleHQuXG4gKiBAcGFyYW0ge251bWJlcn0gZGVuc2l0eUxvd2VyTGltaXQgVGhlIGxvd2VyIGxpbWl0IG9mIGtleXdvcmQgZGVuc2l0eS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBkZW5zaXR5VXBwZXJMaW1pdCBUaGUgdXBwZXIgbGltaXQgb2Yga2V5d29yZCBkZW5zaXR5LlxuICogQHJldHVybnMge1dvcmRDb21iaW5hdGlvbltdfSBGaWx0ZXJlZCB3b3JkIGNvbWJpbmF0aW9ucy5cbiAqL1xuZnVuY3Rpb24gZmlsdGVyT25EZW5zaXR5KCB3b3JkQ29tYmluYXRpb25zLCB3b3JkQ291bnQsIGRlbnNpdHlMb3dlckxpbWl0LCBkZW5zaXR5VXBwZXJMaW1pdCApIHtcblx0cmV0dXJuIHdvcmRDb21iaW5hdGlvbnMuZmlsdGVyKCBmdW5jdGlvbiggY29tYmluYXRpb24gKSB7XG5cdFx0cmV0dXJuICggY29tYmluYXRpb24uZ2V0RGVuc2l0eSggd29yZENvdW50ICkgPj0gZGVuc2l0eUxvd2VyTGltaXQgJiYgY29tYmluYXRpb24uZ2V0RGVuc2l0eSggd29yZENvdW50ICkgPCBkZW5zaXR5VXBwZXJMaW1pdFxuXHRcdCk7XG5cdH0gKTtcbn1cblxuLyoqXG4gKiBGaWx0ZXJzIHRoZSBsaXN0IG9mIHdvcmQgY29tYmluYXRpb24gb2JqZWN0cy5cbiAqIFdvcmQgY29tYmluYXRpb25zIHdpdGggc3BlY2lmaWMgcGFydHMgb2Ygc3BlZWNoIGF0IHRoZSBiZWdpbm5pbmcgYW5kL29yIGVuZCwgYXMgd2VsbCBhcyBvbmUtc3lsbGFibGUgc2luZ2xlIHdvcmRzLCBhcmUgcmVtb3ZlZC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBjb21iaW5hdGlvbnMgVGhlIGxpc3Qgb2Ygd29yZCBjb21iaW5hdGlvbiBvYmplY3RzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuY3Rpb25Xb3JkcyBUaGUgZnVuY3Rpb24gY29udGFpbmluZyB0aGUgbGlzdHMgb2YgZnVuY3Rpb24gd29yZHMuXG4gKiBAcGFyYW0ge3N0cmluZ30gbG9jYWxlIFRoZSBwYXBlcidzIGxvY2FsZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gVGhlIGZpbHRlcmVkIGxpc3Qgb2Ygd29yZCBjb21iaW5hdGlvbiBvYmplY3RzLlxuICovXG5mdW5jdGlvbiBmaWx0ZXJDb21iaW5hdGlvbnMoIGNvbWJpbmF0aW9ucywgZnVuY3Rpb25Xb3JkcywgbG9jYWxlICkge1xuXHRjb21iaW5hdGlvbnMgPSBmaWx0ZXJGdW5jdGlvbldvcmRzKCBjb21iaW5hdGlvbnMsIHNwZWNpYWxDaGFyYWN0ZXJzICk7XG5cdGNvbWJpbmF0aW9ucyA9IGZpbHRlckZ1bmN0aW9uV29yZHMoIGNvbWJpbmF0aW9ucywgZnVuY3Rpb25Xb3JkcygpLmFydGljbGVzICk7XG5cdGNvbWJpbmF0aW9ucyA9IGZpbHRlckZ1bmN0aW9uV29yZHMoIGNvbWJpbmF0aW9ucywgZnVuY3Rpb25Xb3JkcygpLnBlcnNvbmFsUHJvbm91bnMgKTtcblx0Y29tYmluYXRpb25zID0gZmlsdGVyRnVuY3Rpb25Xb3JkcyggY29tYmluYXRpb25zLCBmdW5jdGlvbldvcmRzKCkucHJlcG9zaXRpb25zICk7XG5cdGNvbWJpbmF0aW9ucyA9IGZpbHRlckZ1bmN0aW9uV29yZHMoIGNvbWJpbmF0aW9ucywgZnVuY3Rpb25Xb3JkcygpLmNvbmp1bmN0aW9ucyApO1xuXHRjb21iaW5hdGlvbnMgPSBmaWx0ZXJGdW5jdGlvbldvcmRzKCBjb21iaW5hdGlvbnMsIGZ1bmN0aW9uV29yZHMoKS5xdWFudGlmaWVycyApO1xuXHRjb21iaW5hdGlvbnMgPSBmaWx0ZXJGdW5jdGlvbldvcmRzKCBjb21iaW5hdGlvbnMsIGZ1bmN0aW9uV29yZHMoKS5kZW1vbnN0cmF0aXZlUHJvbm91bnMgKTtcblx0Y29tYmluYXRpb25zID0gZmlsdGVyRnVuY3Rpb25Xb3JkcyggY29tYmluYXRpb25zLCBmdW5jdGlvbldvcmRzKCkudHJhbnNpdGlvbldvcmRzICk7XG5cdGNvbWJpbmF0aW9ucyA9IGZpbHRlckZ1bmN0aW9uV29yZHMoIGNvbWJpbmF0aW9ucywgZnVuY3Rpb25Xb3JkcygpLnByb25vbWluYWxBZHZlcmJzICk7XG5cdGNvbWJpbmF0aW9ucyA9IGZpbHRlckZ1bmN0aW9uV29yZHMoIGNvbWJpbmF0aW9ucywgZnVuY3Rpb25Xb3JkcygpLmludGVyamVjdGlvbnMgKTtcblx0Y29tYmluYXRpb25zID0gZmlsdGVyRnVuY3Rpb25Xb3Jkc0F0RW5kaW5nKCBjb21iaW5hdGlvbnMsIGZ1bmN0aW9uV29yZHMoKS5yZWxhdGl2ZVByb25vdW5zICk7XG5cdGNvbWJpbmF0aW9ucyA9IGZpbHRlckZ1bmN0aW9uV29yZHNBdEVuZGluZyggY29tYmluYXRpb25zLCBmdW5jdGlvbldvcmRzKCkubWlzY2VsbGFuZW91cyApO1xuXHRjb21iaW5hdGlvbnMgPSBmaWx0ZXJPblN5bGxhYmxlQ291bnQoIGNvbWJpbmF0aW9ucywgMSwgbG9jYWxlICk7XG5cdHN3aXRjaCggZ2V0TGFuZ3VhZ2UoIGxvY2FsZSApICkge1xuXHRcdGNhc2UgXCJlblwiOlxuXHRcdFx0Y29tYmluYXRpb25zID0gZmlsdGVyRnVuY3Rpb25Xb3Jkc0F0QmVnaW5uaW5nKCBjb21iaW5hdGlvbnMsIGZ1bmN0aW9uV29yZHMoKS5wYXNzaXZlQXV4aWxpYXJpZXMgKTtcblx0XHRcdGNvbWJpbmF0aW9ucyA9IGZpbHRlckZ1bmN0aW9uV29yZHNBdEJlZ2lubmluZyggY29tYmluYXRpb25zLCBmdW5jdGlvbldvcmRzKCkucmVmbGV4aXZlUHJvbm91bnMgKTtcblx0XHRcdGNvbWJpbmF0aW9ucyA9IGZpbHRlckZ1bmN0aW9uV29yZHNBdEVuZGluZyggY29tYmluYXRpb25zLCBmdW5jdGlvbldvcmRzKCkudmVyYnMgKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJkZVwiOlxuXHRcdFx0Y29tYmluYXRpb25zID0gZmlsdGVyRnVuY3Rpb25Xb3JkcyggY29tYmluYXRpb25zLCBmdW5jdGlvbldvcmRzKCkudmVyYnMgKTtcblx0XHRcdGNvbWJpbmF0aW9ucyA9IGZpbHRlckZ1bmN0aW9uV29yZHNBdEJlZ2lubmluZyggY29tYmluYXRpb25zLCBmdW5jdGlvbldvcmRzKCkuYmVnaW5uaW5nVmVyYnMgKTtcblx0XHRcdGNvbWJpbmF0aW9ucyA9IGZpbHRlckZ1bmN0aW9uV29yZHNBdEVuZGluZyggY29tYmluYXRpb25zLCBmdW5jdGlvbldvcmRzKCkucmVmbGV4aXZlUHJvbm91bnMgKTtcblx0XHRcdGNvbWJpbmF0aW9ucyA9IGZpbHRlckZ1bmN0aW9uV29yZHNBdEVuZGluZyggY29tYmluYXRpb25zLCBmdW5jdGlvbldvcmRzKCkuaW50ZXJyb2dhdGl2ZVByb0FkdmVyYnMgKTtcblx0XHRcdGJyZWFrO1xuXHR9XG5cdHJldHVybiBjb21iaW5hdGlvbnM7XG59XG4vKipcbiAqIFJldHVybnMgdGhlIHJlbGV2YW50IHdvcmRzIGluIGEgZ2l2ZW4gdGV4dC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byByZXRyaWV2ZSB0aGUgcmVsZXZhbnQgd29yZHMgb2YuXG4gKiBAcGFyYW0ge3N0cmluZ30gbG9jYWxlIFRoZSBwYXBlcidzIGxvY2FsZS5cbiAqIEByZXR1cm5zIHtXb3JkQ29tYmluYXRpb25bXX0gQWxsIHJlbGV2YW50IHdvcmRzIHNvcnRlZCBhbmQgZmlsdGVyZWQgZm9yIHRoaXMgdGV4dC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmVsZXZhbnRXb3JkcyggdGV4dCwgbG9jYWxlICkge1xuXHR2YXIgZnVuY3Rpb25Xb3Jkcztcblx0c3dpdGNoKCBnZXRMYW5ndWFnZSggbG9jYWxlICkgKSB7XG5cdFx0Y2FzZSBcImRlXCI6XG5cdFx0XHRmdW5jdGlvbldvcmRzID0gZ2VybWFuRnVuY3Rpb25Xb3Jkcztcblx0XHRcdGJyZWFrO1xuXHRcdGRlZmF1bHQ6XG5cdFx0Y2FzZSBcImVuXCI6XG5cdFx0XHRmdW5jdGlvbldvcmRzID0gZW5nbGlzaEZ1bmN0aW9uV29yZHM7XG5cdFx0XHRicmVhaztcblx0fVxuXG5cdHZhciB3b3JkcyA9IGdldFdvcmRDb21iaW5hdGlvbnMoIHRleHQsIDEsIGZ1bmN0aW9uV29yZHMoKS5hbGwgKTtcblx0dmFyIHdvcmRDb3VudCA9IHdvcmRzLmxlbmd0aDtcblxuXHR2YXIgb25lV29yZENvbWJpbmF0aW9ucyA9IGdldFJlbGV2YW50Q29tYmluYXRpb25zKFxuXHRcdGNhbGN1bGF0ZU9jY3VycmVuY2VzKCB3b3JkcyApXG5cdCk7XG5cblx0c29ydENvbWJpbmF0aW9ucyggb25lV29yZENvbWJpbmF0aW9ucyApO1xuXHRvbmVXb3JkQ29tYmluYXRpb25zID0gdGFrZSggb25lV29yZENvbWJpbmF0aW9ucywgMTAwICk7XG5cblx0dmFyIG9uZVdvcmRSZWxldmFuY2VNYXAgPSB7fTtcblxuXHRmb3JFYWNoKCBvbmVXb3JkQ29tYmluYXRpb25zLCBmdW5jdGlvbiggY29tYmluYXRpb24gKSB7XG5cdFx0b25lV29yZFJlbGV2YW5jZU1hcFsgY29tYmluYXRpb24uZ2V0Q29tYmluYXRpb24oKSBdID0gY29tYmluYXRpb24uZ2V0UmVsZXZhbmNlKCBmdW5jdGlvbldvcmRzICk7XG5cdH0gKTtcblxuXHR2YXIgdHdvV29yZENvbWJpbmF0aW9ucyA9IGNhbGN1bGF0ZU9jY3VycmVuY2VzKCBnZXRXb3JkQ29tYmluYXRpb25zKCB0ZXh0LCAyLCBmdW5jdGlvbldvcmRzKCkuYWxsICkgKTtcblx0dmFyIHRocmVlV29yZENvbWJpbmF0aW9ucyA9IGNhbGN1bGF0ZU9jY3VycmVuY2VzKCBnZXRXb3JkQ29tYmluYXRpb25zKCB0ZXh0LCAzLCBmdW5jdGlvbldvcmRzKCkuYWxsICkgKTtcblx0dmFyIGZvdXJXb3JkQ29tYmluYXRpb25zID0gY2FsY3VsYXRlT2NjdXJyZW5jZXMoIGdldFdvcmRDb21iaW5hdGlvbnMoIHRleHQsIDQsIGZ1bmN0aW9uV29yZHMoKS5hbGwgKSApO1xuXHR2YXIgZml2ZVdvcmRDb21iaW5hdGlvbnMgPSBjYWxjdWxhdGVPY2N1cnJlbmNlcyggZ2V0V29yZENvbWJpbmF0aW9ucyggdGV4dCwgNSwgZnVuY3Rpb25Xb3JkcygpLmFsbCApICk7XG5cblx0dmFyIGNvbWJpbmF0aW9ucyA9IG9uZVdvcmRDb21iaW5hdGlvbnMuY29uY2F0KFxuXHRcdHR3b1dvcmRDb21iaW5hdGlvbnMsXG5cdFx0dGhyZWVXb3JkQ29tYmluYXRpb25zLFxuXHRcdGZvdXJXb3JkQ29tYmluYXRpb25zLFxuXHRcdGZpdmVXb3JkQ29tYmluYXRpb25zXG5cdCk7XG5cblx0Y29tYmluYXRpb25zID0gZmlsdGVyQ29tYmluYXRpb25zKCBjb21iaW5hdGlvbnMsIGZ1bmN0aW9uV29yZHMsIGxvY2FsZSApO1xuXG5cdGZvckVhY2goIGNvbWJpbmF0aW9ucywgZnVuY3Rpb24oIGNvbWJpbmF0aW9uICkge1xuXHRcdGNvbWJpbmF0aW9uLnNldFJlbGV2YW50V29yZHMoIG9uZVdvcmRSZWxldmFuY2VNYXAgKTtcblx0fSApO1xuXG5cdGNvbWJpbmF0aW9ucyA9IGdldFJlbGV2YW50Q29tYmluYXRpb25zKCBjb21iaW5hdGlvbnMsIHdvcmRDb3VudCApO1xuXHRzb3J0Q29tYmluYXRpb25zKCBjb21iaW5hdGlvbnMgKTtcblxuXHRpZiAoIHdvcmRDb3VudCA+PSB3b3JkQ291bnRMb3dlckxpbWl0ICkge1xuXHRcdGNvbWJpbmF0aW9ucyA9IGZpbHRlck9uRGVuc2l0eSggY29tYmluYXRpb25zLCB3b3JkQ291bnQsIGRlbnNpdHlMb3dlckxpbWl0LCBkZW5zaXR5VXBwZXJMaW1pdCApO1xuXHR9XG5cblx0cmV0dXJuIHRha2UoIGNvbWJpbmF0aW9ucywgcmVsZXZhbnRXb3JkTGltaXQgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGdldFdvcmRDb21iaW5hdGlvbnM6IGdldFdvcmRDb21iaW5hdGlvbnMsXG5cdGdldFJlbGV2YW50V29yZHM6IGdldFJlbGV2YW50V29yZHMsXG5cdGNhbGN1bGF0ZU9jY3VycmVuY2VzOiBjYWxjdWxhdGVPY2N1cnJlbmNlcyxcblx0Z2V0UmVsZXZhbnRDb21iaW5hdGlvbnM6IGdldFJlbGV2YW50Q29tYmluYXRpb25zLFxuXHRzb3J0Q29tYmluYXRpb25zOiBzb3J0Q29tYmluYXRpb25zLFxuXHRmaWx0ZXJGdW5jdGlvbldvcmRzQXRCZWdpbm5pbmc6IGZpbHRlckZ1bmN0aW9uV29yZHNBdEJlZ2lubmluZyxcblx0ZmlsdGVyRnVuY3Rpb25Xb3JkczogZmlsdGVyRnVuY3Rpb25Xb3Jkcyxcblx0ZmlsdGVyU3BlY2lhbENoYXJhY3RlcnM6IGZpbHRlclNwZWNpYWxDaGFyYWN0ZXJzLFxuXHRmaWx0ZXJPblN5bGxhYmxlQ291bnQ6IGZpbHRlck9uU3lsbGFibGVDb3VudCxcblx0ZmlsdGVyT25EZW5zaXR5OiBmaWx0ZXJPbkRlbnNpdHksXG59O1xuIiwiLy8gUmVwbGFjZSBhbGwgb3RoZXIgcHVuY3R1YXRpb24gY2hhcmFjdGVycyBhdCB0aGUgYmVnaW5uaW5nIG9yIGF0IHRoZSBlbmQgb2YgYSB3b3JkLlxudmFyIHB1bmN0dWF0aW9uUmVnZXhTdHJpbmcgPSBcIltcXFxc4oCTXFxcXC1cXFxcKFxcXFwpX1xcXFxbXFxcXF3igJnigJzigJ1cXFwiJy4/ITo7LMK/wqHCq8K7XFx1MjAxNFxcdTAwZDdcXHUwMDJiXFx1MDAyNl0rXCI7XG52YXIgcHVuY3R1YXRpb25SZWdleFN0YXJ0ID0gbmV3IFJlZ0V4cCggXCJeXCIgKyBwdW5jdHVhdGlvblJlZ2V4U3RyaW5nICk7XG52YXIgcHVuY3R1YXRpb25SZWdleEVuZCA9IG5ldyBSZWdFeHAoIHB1bmN0dWF0aW9uUmVnZXhTdHJpbmcgKyBcIiRcIiApO1xuXG4vKipcbiAqIFJlcGxhY2VzIHB1bmN0dWF0aW9uIGNoYXJhY3RlcnMgZnJvbSB0aGUgZ2l2ZW4gdGV4dCBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gcmVtb3ZlIHRoZSBwdW5jdHVhdGlvbiBjaGFyYWN0ZXJzIGZvci5cbiAqXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgc2FuaXRpemVkIHRleHQuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHRleHQgKSB7XG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoIHB1bmN0dWF0aW9uUmVnZXhTdGFydCwgXCJcIiApO1xuXHR0ZXh0ID0gdGV4dC5yZXBsYWNlKCBwdW5jdHVhdGlvblJlZ2V4RW5kLCBcIlwiICk7XG5cblx0cmV0dXJuIHRleHQ7XG59O1xuIiwiLyoqIEBtb2R1bGUgc3RyaW5nUHJvY2Vzc2luZy9zdHJpcEhUTUxUYWdzICovXG5cbnZhciBzdHJpcFNwYWNlcyA9IHJlcXVpcmUoIFwiLi4vc3RyaW5nUHJvY2Vzc2luZy9zdHJpcFNwYWNlcy5qc1wiICk7XG5cbnZhciBibG9ja0VsZW1lbnRzID0gcmVxdWlyZSggXCIuLi9oZWxwZXJzL2h0bWwuanNcIiApLmJsb2NrRWxlbWVudHM7XG5cbnZhciBibG9ja0VsZW1lbnRTdGFydFJlZ2V4ID0gbmV3IFJlZ0V4cCggXCJePChcIiArIGJsb2NrRWxlbWVudHMuam9pbiggXCJ8XCIgKSArIFwiKVtePl0qPz5cIiwgXCJpXCIgKTtcbnZhciBibG9ja0VsZW1lbnRFbmRSZWdleCA9IG5ldyBSZWdFeHAoIFwiPC8oXCIgKyBibG9ja0VsZW1lbnRzLmpvaW4oIFwifFwiICkgKyBcIilbXj5dKj8+JFwiLCBcImlcIiApO1xuXG4vKipcbiAqIFN0cmlwIGluY29tcGxldGUgdGFncyB3aXRoaW4gYSB0ZXh0LiBTdHJpcHMgYW4gZW5kdGFnIGF0IHRoZSBiZWdpbm5pbmcgb2YgYSBzdHJpbmcgYW5kIHRoZSBzdGFydCB0YWcgYXQgdGhlIGVuZCBvZiBhXG4gKiBzdGFydCBvZiBhIHN0cmluZy5cbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHRvIHN0cmlwIHRoZSBIVE1MLXRhZ3MgZnJvbSBhdCB0aGUgYmVnaW4gYW5kIGVuZC5cbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSB0ZXh0IHdpdGhvdXQgSFRNTC10YWdzIGF0IHRoZSBiZWdpbiBhbmQgZW5kLlxuICovXG52YXIgc3RyaXBJbmNvbXBsZXRlVGFncyA9IGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHR0ZXh0ID0gdGV4dC5yZXBsYWNlKCAvXig8XFwvKFtePl0rKT4pKy9pLCBcIlwiICk7XG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoIC8oPChbXlxcLz5dKyk+KSskL2ksIFwiXCIgKTtcblx0cmV0dXJuIHRleHQ7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgdGhlIGJsb2NrIGVsZW1lbnQgdGFncyBhdCB0aGUgYmVnaW5uaW5nIGFuZCBlbmQgb2YgYSBzdHJpbmcgYW5kIHJldHVybnMgdGhpcyBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGhlIHVuZm9ybWF0dGVkIHN0cmluZy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSB0ZXh0IHdpdGggcmVtb3ZlZCBIVE1MIGJlZ2luIGFuZCBlbmQgYmxvY2sgZWxlbWVudHNcbiAqL1xudmFyIHN0cmlwQmxvY2tUYWdzQXRTdGFydEVuZCA9IGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHR0ZXh0ID0gdGV4dC5yZXBsYWNlKCBibG9ja0VsZW1lbnRTdGFydFJlZ2V4LCBcIlwiICk7XG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoIGJsb2NrRWxlbWVudEVuZFJlZ2V4LCBcIlwiICk7XG5cdHJldHVybiB0ZXh0O1xufTtcblxuLyoqXG4gKiBTdHJpcCBIVE1MLXRhZ3MgZnJvbSB0ZXh0XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gc3RyaXAgdGhlIEhUTUwtdGFncyBmcm9tLlxuICogQHJldHVybnMge1N0cmluZ30gVGhlIHRleHQgd2l0aG91dCBIVE1MLXRhZ3MuXG4gKi9cbnZhciBzdHJpcEZ1bGxUYWdzID0gZnVuY3Rpb24oIHRleHQgKSB7XG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoIC8oPChbXj5dKyk+KS9pZywgXCIgXCIgKTtcblx0dGV4dCA9IHN0cmlwU3BhY2VzKCB0ZXh0ICk7XG5cdHJldHVybiB0ZXh0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdHN0cmlwRnVsbFRhZ3M6IHN0cmlwRnVsbFRhZ3MsXG5cdHN0cmlwSW5jb21wbGV0ZVRhZ3M6IHN0cmlwSW5jb21wbGV0ZVRhZ3MsXG5cdHN0cmlwQmxvY2tUYWdzQXRTdGFydEVuZDogc3RyaXBCbG9ja1RhZ3NBdFN0YXJ0RW5kLFxufTtcbiIsIi8qKiBAbW9kdWxlIHN0cmluZ1Byb2Nlc3Npbmcvc3RyaXBTcGFjZXMgKi9cblxuLyoqXG4gKiBTdHJpcCBkb3VibGUgc3BhY2VzIGZyb20gdGV4dFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0IFRoZSB0ZXh0IHRvIHN0cmlwIHNwYWNlcyBmcm9tLlxuICogQHJldHVybnMge1N0cmluZ30gVGhlIHRleHQgd2l0aG91dCBkb3VibGUgc3BhY2VzXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIHRleHQgKSB7XG5cdC8vIFJlcGxhY2UgbXVsdGlwbGUgc3BhY2VzIHdpdGggc2luZ2xlIHNwYWNlXG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoIC9cXHN7Mix9L2csIFwiIFwiICk7XG5cblx0Ly8gUmVwbGFjZSBzcGFjZXMgZm9sbG93ZWQgYnkgcGVyaW9kcyB3aXRoIG9ubHkgdGhlIHBlcmlvZC5cblx0dGV4dCA9IHRleHQucmVwbGFjZSggL1xcc1xcLi9nLCBcIi5cIiApO1xuXG5cdC8vIFJlbW92ZSBmaXJzdC9sYXN0IGNoYXJhY3RlciBpZiBzcGFjZVxuXHR0ZXh0ID0gdGV4dC5yZXBsYWNlKCAvXlxccyt8XFxzKyQvZywgXCJcIiApO1xuXG5cdHJldHVybiB0ZXh0O1xufTtcbiIsInZhciBpc1VuZGVmaW5lZCA9IHJlcXVpcmUoIFwibG9kYXNoL2lzVW5kZWZpbmVkXCIgKTtcbnZhciBwaWNrID0gcmVxdWlyZSggXCJsb2Rhc2gvcGlja1wiICk7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIHBhcnRpYWwgZGV2aWF0aW9uIHdoZW4gY291bnRpbmcgc3lsbGFibGVzXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgRXh0cmEgb3B0aW9ucyBhYm91dCBob3cgdG8gbWF0Y2ggdGhpcyBmcmFnbWVudC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBvcHRpb25zLmxvY2F0aW9uIFRoZSBsb2NhdGlvbiBpbiB0aGUgd29yZCB3aGVyZSB0aGlzIGRldmlhdGlvbiBjYW4gb2NjdXIuXG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy53b3JkIFRoZSBhY3R1YWwgc3RyaW5nIHRoYXQgc2hvdWxkIGJlIGNvdW50ZWQgZGlmZmVyZW50bHkuXG4gKiBAcGFyYW0ge251bWJlcn0gb3B0aW9ucy5zeWxsYWJsZXMgVGhlIGFtb3VudCBvZiBzeWxsYWJsZXMgdGhpcyBmcmFnbWVudCBoYXMuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBbb3B0aW9ucy5ub3RGb2xsb3dlZEJ5XSBBIGxpc3Qgb2YgY2hhcmFjdGVycyB0aGF0IHRoaXMgZnJhZ21lbnQgc2hvdWxkbid0IGJlIGZvbGxvd2VkIHdpdGguXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBbb3B0aW9ucy5hbHNvRm9sbG93ZWRCeV0gQSBsaXN0IG9mIGNoYXJhY3RlcnMgdGhhdCB0aGlzIGZyYWdtZW50IGNvdWxkIGJlIGZvbGxvd2VkIHdpdGguXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIERldmlhdGlvbkZyYWdtZW50KCBvcHRpb25zICkge1xuXHR0aGlzLl9sb2NhdGlvbiA9IG9wdGlvbnMubG9jYXRpb247XG5cdHRoaXMuX2ZyYWdtZW50ID0gb3B0aW9ucy53b3JkO1xuXHR0aGlzLl9zeWxsYWJsZXMgPSBvcHRpb25zLnN5bGxhYmxlcztcblx0dGhpcy5fcmVnZXggPSBudWxsO1xuXG5cdHRoaXMuX29wdGlvbnMgPSBwaWNrKCBvcHRpb25zLCBbIFwibm90Rm9sbG93ZWRCeVwiLCBcImFsc29Gb2xsb3dlZEJ5XCIgXSApO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSByZWdleCB0aGF0IG1hdGNoZXMgdGhpcyBmcmFnbWVudCBpbnNpZGUgYSB3b3JkLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5EZXZpYXRpb25GcmFnbWVudC5wcm90b3R5cGUuY3JlYXRlUmVnZXggPSBmdW5jdGlvbigpIHtcblx0dmFyIHJlZ2V4U3RyaW5nID0gXCJcIjtcblx0dmFyIG9wdGlvbnMgPSB0aGlzLl9vcHRpb25zO1xuXG5cdHZhciBmcmFnbWVudCA9IHRoaXMuX2ZyYWdtZW50O1xuXG5cdGlmICggISBpc1VuZGVmaW5lZCggb3B0aW9ucy5ub3RGb2xsb3dlZEJ5ICkgKSB7XG5cdFx0ZnJhZ21lbnQgKz0gXCIoPyFbXCIgKyBvcHRpb25zLm5vdEZvbGxvd2VkQnkuam9pbiggXCJcIiApICsgXCJdKVwiO1xuXHR9XG5cblx0aWYgKCAhIGlzVW5kZWZpbmVkKCBvcHRpb25zLmFsc29Gb2xsb3dlZEJ5ICkgKSB7XG5cdFx0ZnJhZ21lbnQgKz0gXCJbXCIgKyBvcHRpb25zLmFsc29Gb2xsb3dlZEJ5LmpvaW4oIFwiXCIgKSArIFwiXT9cIjtcblx0fVxuXG5cdHN3aXRjaCAoIHRoaXMuX2xvY2F0aW9uICkge1xuXHRcdGNhc2UgXCJhdEJlZ2lubmluZ1wiOlxuXHRcdFx0cmVnZXhTdHJpbmcgPSBcIl5cIiArIGZyYWdtZW50O1xuXHRcdFx0YnJlYWs7XG5cblx0XHRjYXNlIFwiYXRFbmRcIjpcblx0XHRcdHJlZ2V4U3RyaW5nID0gZnJhZ21lbnQgKyBcIiRcIjtcblx0XHRcdGJyZWFrO1xuXG5cdFx0Y2FzZSBcImF0QmVnaW5uaW5nT3JFbmRcIjpcblx0XHRcdHJlZ2V4U3RyaW5nID0gXCIoXlwiICsgZnJhZ21lbnQgKyBcIil8KFwiICsgZnJhZ21lbnQgKyBcIiQpXCI7XG5cdFx0XHRicmVhaztcblxuXHRcdGRlZmF1bHQ6XG5cdFx0XHRyZWdleFN0cmluZyA9IGZyYWdtZW50O1xuXHRcdFx0YnJlYWs7XG5cdH1cblxuXHR0aGlzLl9yZWdleCA9IG5ldyBSZWdFeHAoIHJlZ2V4U3RyaW5nICk7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIHJlZ2V4IHRoYXQgbWF0Y2hlcyB0aGlzIGZyYWdtZW50IGluc2lkZSBhIHdvcmQuXG4gKlxuICogQHJldHVybnMge1JlZ0V4cH0gVGhlIHJlZ2V4cCB0aGF0IG1hdGNoZXMgdGhpcyBmcmFnbWVudC5cbiAqL1xuRGV2aWF0aW9uRnJhZ21lbnQucHJvdG90eXBlLmdldFJlZ2V4ID0gZnVuY3Rpb24oKSB7XG5cdGlmICggbnVsbCA9PT0gdGhpcy5fcmVnZXggKSB7XG5cdFx0dGhpcy5jcmVhdGVSZWdleCgpO1xuXHR9XG5cblx0cmV0dXJuIHRoaXMuX3JlZ2V4O1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoaXMgZnJhZ21lbnQgb2NjdXJzIGluIGEgd29yZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gd29yZCBUaGUgd29yZCB0byBtYXRjaCB0aGUgZnJhZ21lbnQgaW4uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhpcyBmcmFnbWVudCBvY2N1cnMgaW4gYSB3b3JkLlxuICovXG5EZXZpYXRpb25GcmFnbWVudC5wcm90b3R5cGUub2NjdXJzSW4gPSBmdW5jdGlvbiggd29yZCApIHtcblx0dmFyIHJlZ2V4ID0gdGhpcy5nZXRSZWdleCgpO1xuXG5cdHJldHVybiByZWdleC50ZXN0KCB3b3JkICk7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgdGhpcyBmcmFnbWVudCBmcm9tIHRoZSBnaXZlbiB3b3JkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB3b3JkIFRoZSB3b3JkIHRvIHJlbW92ZSB0aGlzIGZyYWdtZW50IGZyb20uXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgbW9kaWZpZWQgd29yZC5cbiAqL1xuRGV2aWF0aW9uRnJhZ21lbnQucHJvdG90eXBlLnJlbW92ZUZyb20gPSBmdW5jdGlvbiggd29yZCApIHtcblx0Ly8gUmVwbGFjZSBieSBhIHNwYWNlIHRvIGtlZXAgdGhlIHJlbWFpbmluZyBwYXJ0cyBzZXBhcmF0ZWQuXG5cdHJldHVybiB3b3JkLnJlcGxhY2UoIHRoaXMuX2ZyYWdtZW50LCBcIiBcIiApO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBhbW91bnQgb2Ygc3lsbGFibGVzIGZvciB0aGlzIGZyYWdtZW50LlxuICpcbiAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBhbW91bnQgb2Ygc3lsbGFibGVzIGZvciB0aGlzIGZyYWdtZW50LlxuICovXG5EZXZpYXRpb25GcmFnbWVudC5wcm90b3R5cGUuZ2V0U3lsbGFibGVzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLl9zeWxsYWJsZXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERldmlhdGlvbkZyYWdtZW50O1xuIiwiLyoqIEBtb2R1bGUgc3RyaW5nUHJvY2Vzc2luZy9jb3VudFN5bGxhYmxlcyAqL1xuXG52YXIgc3lsbGFibGVNYXRjaGVycyA9IHJlcXVpcmUoIFwiLi4vLi4vY29uZmlnL3N5bGxhYmxlcy5qc1wiICk7XG5cbnZhciBnZXRXb3JkcyA9IHJlcXVpcmUoIFwiLi4vZ2V0V29yZHMuanNcIiApO1xuXG52YXIgZm9yRWFjaCA9IHJlcXVpcmUoIFwibG9kYXNoL2ZvckVhY2hcIiApO1xudmFyIGZpbHRlciA9IHJlcXVpcmUoIFwibG9kYXNoL2ZpbHRlclwiICk7XG52YXIgZmluZCA9IHJlcXVpcmUoIFwibG9kYXNoL2ZpbmRcIiApO1xudmFyIGlzVW5kZWZpbmVkID0gcmVxdWlyZSggXCJsb2Rhc2gvaXNVbmRlZmluZWRcIiApO1xudmFyIG1hcCA9IHJlcXVpcmUoIFwibG9kYXNoL21hcFwiICk7XG52YXIgc3VtID0gcmVxdWlyZSggXCJsb2Rhc2gvc3VtXCIgKTtcbnZhciBtZW1vaXplID0gcmVxdWlyZSggXCJsb2Rhc2gvbWVtb2l6ZVwiICk7XG52YXIgZmxhdE1hcCA9IHJlcXVpcmUoIFwibG9kYXNoL2ZsYXRNYXBcIiApO1xuXG52YXIgU3lsbGFibGVDb3VudEl0ZXJhdG9yID0gcmVxdWlyZSggXCIuLi8uLi9oZWxwZXJzL3N5bGxhYmxlQ291bnRJdGVyYXRvci5qc1wiICk7XG52YXIgRGV2aWF0aW9uRnJhZ21lbnQgPSByZXF1aXJlKCBcIi4vRGV2aWF0aW9uRnJhZ21lbnRcIiApO1xuXG4vKipcbiAqIENvdW50cyB2b3dlbCBncm91cHMgaW5zaWRlIGEgd29yZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gd29yZCBBIHRleHQgd2l0aCB3b3JkcyB0byBjb3VudCBzeWxsYWJsZXMuXG4gKiBAcGFyYW0ge1N0cmluZ30gbG9jYWxlIFRoZSBsb2NhbGUgdG8gdXNlIGZvciBjb3VudGluZyBzeWxsYWJsZXMuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgc3lsbGFibGUgY291bnQuXG4gKi9cbnZhciBjb3VudFZvd2VsR3JvdXBzID0gZnVuY3Rpb24oIHdvcmQsIGxvY2FsZSApIHtcblx0dmFyIG51bWJlck9mU3lsbGFibGVzID0gMDtcblx0dmFyIHZvd2VsUmVnZXggPSBuZXcgUmVnRXhwKCBcIlteXCIgKyBzeWxsYWJsZU1hdGNoZXJzKCBsb2NhbGUgKS52b3dlbHMgKyBcIl1cIiwgXCJpZ1wiICk7XG5cdHZhciBmb3VuZFZvd2VscyA9IHdvcmQuc3BsaXQoIHZvd2VsUmVnZXggKTtcblx0dmFyIGZpbHRlcmVkV29yZHMgPSBmaWx0ZXIoIGZvdW5kVm93ZWxzLCBmdW5jdGlvbiggdm93ZWwgKSB7XG5cdFx0cmV0dXJuIHZvd2VsICE9PSBcIlwiO1xuXHR9ICk7XG5cdG51bWJlck9mU3lsbGFibGVzICs9IGZpbHRlcmVkV29yZHMubGVuZ3RoO1xuXG5cdHJldHVybiBudW1iZXJPZlN5bGxhYmxlcztcbn07XG5cbi8qKlxuICogQ291bnRzIHRoZSBzeWxsYWJsZXMgdXNpbmcgdm93ZWwgZXhjbHVzaW9ucy4gVGhlc2UgYXJlIHVzZWQgZm9yIGdyb3VwcyBvZiB2b3dlbHMgdGhhdCBhcmUgbW9yZSBvciBsZXNzXG4gKiB0aGFuIDEgc3lsbGFibGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHdvcmQgVGhlIHdvcmQgdG8gY291bnQgc3lsbGFibGVzIG9mLlxuICogQHBhcmFtIHtTdHJpbmd9IGxvY2FsZSBUaGUgbG9jYWxlIHRvIHVzZSBmb3IgY291bnRpbmcgc3lsbGFibGVzLlxuICogQHJldHVybnMge251bWJlcn0gVGhlIG51bWJlciBvZiBzeWxsYWJsZXMgZm91bmQgaW4gdGhlIGdpdmVuIHdvcmQuXG4gKi9cbnZhciBjb3VudFZvd2VsRGV2aWF0aW9ucyA9IGZ1bmN0aW9uKCB3b3JkLCBsb2NhbGUgKSB7XG5cdHZhciBzeWxsYWJsZUNvdW50SXRlcmF0b3IgPSBuZXcgU3lsbGFibGVDb3VudEl0ZXJhdG9yKCBzeWxsYWJsZU1hdGNoZXJzKCBsb2NhbGUgKSApO1xuXHRyZXR1cm4gc3lsbGFibGVDb3VudEl0ZXJhdG9yLmNvdW50U3lsbGFibGVzKCB3b3JkICk7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIG51bWJlciBvZiBzeWxsYWJsZXMgZm9yIHRoZSB3b3JkIGlmIGl0IGlzIGluIHRoZSBsaXN0IG9mIGZ1bGwgd29yZCBkZXZpYXRpb25zLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB3b3JkIFRoZSB3b3JkIHRvIHJldHJpZXZlIHRoZSBzeWxsYWJsZXMgZm9yLlxuICogQHBhcmFtIHtTdHJpbmd9IGxvY2FsZSBUaGUgbG9jYWxlIHRvIHVzZSBmb3IgY291bnRpbmcgc3lsbGFibGVzLlxuICogQHJldHVybnMge251bWJlcn0gVGhlIG51bWJlciBvZiBzeWxsYWJsZXMgZm91bmQuXG4gKi9cbnZhciBjb3VudEZ1bGxXb3JkRGV2aWF0aW9ucyA9IGZ1bmN0aW9uKCB3b3JkLCBsb2NhbGUgKSB7XG5cdHZhciBmdWxsV29yZERldmlhdGlvbnMgPSBzeWxsYWJsZU1hdGNoZXJzKCBsb2NhbGUgKS5kZXZpYXRpb25zLndvcmRzLmZ1bGw7XG5cblx0dmFyIGRldmlhdGlvbiA9IGZpbmQoIGZ1bGxXb3JkRGV2aWF0aW9ucywgZnVuY3Rpb24oIGZ1bGxXb3JkRGV2aWF0aW9uICkge1xuXHRcdHJldHVybiBmdWxsV29yZERldmlhdGlvbi53b3JkID09PSB3b3JkO1xuXHR9ICk7XG5cblx0aWYgKCAhIGlzVW5kZWZpbmVkKCBkZXZpYXRpb24gKSApIHtcblx0XHRyZXR1cm4gZGV2aWF0aW9uLnN5bGxhYmxlcztcblx0fVxuXG5cdHJldHVybiAwO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIGRldmlhdGlvbiBmcmFnbWVudHMgZm9yIGEgY2VydGFpbiBsb2NhbGUuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHN5bGxhYmxlQ29uZmlnIFN5bGxhYmxlIGNvbmZpZyBmb3IgYSBjZXJ0YWluIGxvY2FsZS5cbiAqIEByZXR1cm5zIHtEZXZpYXRpb25GcmFnbWVudFtdfSBBIGxpc3Qgb2YgZGV2aWF0aW9uIGZyYWdtZW50c1xuICovXG5mdW5jdGlvbiBjcmVhdGVEZXZpYXRpb25GcmFnbWVudHMoIHN5bGxhYmxlQ29uZmlnICkge1xuXHR2YXIgZGV2aWF0aW9uRnJhZ21lbnRzID0gW107XG5cblx0dmFyIGRldmlhdGlvbnMgPSBzeWxsYWJsZUNvbmZpZy5kZXZpYXRpb25zO1xuXG5cdGlmICggISBpc1VuZGVmaW5lZCggZGV2aWF0aW9ucy53b3JkcyApICYmICEgaXNVbmRlZmluZWQoIGRldmlhdGlvbnMud29yZHMuZnJhZ21lbnRzICkgKSB7XG5cdFx0ZGV2aWF0aW9uRnJhZ21lbnRzID0gZmxhdE1hcCggZGV2aWF0aW9ucy53b3Jkcy5mcmFnbWVudHMsIGZ1bmN0aW9uKCBmcmFnbWVudHMsIGZyYWdtZW50TG9jYXRpb24gKSB7XG5cdFx0XHRyZXR1cm4gbWFwKCBmcmFnbWVudHMsIGZ1bmN0aW9uKCBmcmFnbWVudCApIHtcblx0XHRcdFx0ZnJhZ21lbnQubG9jYXRpb24gPSBmcmFnbWVudExvY2F0aW9uO1xuXG5cdFx0XHRcdHJldHVybiBuZXcgRGV2aWF0aW9uRnJhZ21lbnQoIGZyYWdtZW50ICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXHR9XG5cblx0cmV0dXJuIGRldmlhdGlvbkZyYWdtZW50cztcbn1cblxudmFyIGNyZWF0ZURldmlhdGlvbkZyYWdtZW50c01lbW9pemVkID0gbWVtb2l6ZSggY3JlYXRlRGV2aWF0aW9uRnJhZ21lbnRzICk7XG5cbi8qKlxuICogQ291bnRzIHN5bGxhYmxlcyBpbiBwYXJ0aWFsIGV4Y2x1c2lvbnMuIElmIHRoZXNlIGFyZSBmb3VuZCwgcmV0dXJucyB0aGUgbnVtYmVyIG9mIHN5bGxhYmxlcyAgZm91bmQsIGFuZCB0aGUgbW9kaWZpZWQgd29yZC5cbiAqIFRoZSB3b3JkIGlzIG1vZGlmaWVkIHNvIHRoZSBleGNsdWRlZCBwYXJ0IGlzbid0IGNvdW50ZWQgYnkgdGhlIG5vcm1hbCBzeWxsYWJsZSBjb3VudGVyLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB3b3JkIFRoZSB3b3JkIHRvIGNvdW50IHN5bGxhYmxlcyBvZi5cbiAqIEBwYXJhbSB7U3RyaW5nfSBsb2NhbGUgVGhlIGxvY2FsZSB0byB1c2UgZm9yIGNvdW50aW5nIHN5bGxhYmxlcy5cbiAqIEByZXR1cm5zIHtvYmplY3R9IFRoZSBudW1iZXIgb2Ygc3lsbGFibGVzIGZvdW5kIGFuZCB0aGUgbW9kaWZpZWQgd29yZC5cbiAqL1xudmFyIGNvdW50UGFydGlhbFdvcmREZXZpYXRpb25zID0gZnVuY3Rpb24oIHdvcmQsIGxvY2FsZSApIHtcblx0dmFyIGRldmlhdGlvbkZyYWdtZW50cyA9IGNyZWF0ZURldmlhdGlvbkZyYWdtZW50c01lbW9pemVkKCBzeWxsYWJsZU1hdGNoZXJzKCBsb2NhbGUgKSApO1xuXHR2YXIgcmVtYWluaW5nUGFydHMgPSB3b3JkO1xuXHR2YXIgc3lsbGFibGVDb3VudCA9IDA7XG5cblx0Zm9yRWFjaCggZGV2aWF0aW9uRnJhZ21lbnRzLCBmdW5jdGlvbiggZGV2aWF0aW9uRnJhZ21lbnQgKSB7XG5cdFx0aWYgKCBkZXZpYXRpb25GcmFnbWVudC5vY2N1cnNJbiggcmVtYWluaW5nUGFydHMgKSApIHtcblx0XHRcdHJlbWFpbmluZ1BhcnRzID0gZGV2aWF0aW9uRnJhZ21lbnQucmVtb3ZlRnJvbSggcmVtYWluaW5nUGFydHMgKTtcblx0XHRcdHN5bGxhYmxlQ291bnQgKz0gZGV2aWF0aW9uRnJhZ21lbnQuZ2V0U3lsbGFibGVzKCk7XG5cdFx0fVxuXHR9ICk7XG5cblx0cmV0dXJuIHsgd29yZDogcmVtYWluaW5nUGFydHMsIHN5bGxhYmxlQ291bnQ6IHN5bGxhYmxlQ291bnQgfTtcbn07XG5cbi8qKlxuICogQ291bnQgdGhlIG51bWJlciBvZiBzeWxsYWJsZXMgaW4gYSB3b3JkLCB1c2luZyB2b3dlbHMgYW5kIGV4Y2VwdGlvbnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHdvcmQgVGhlIHdvcmQgdG8gY291bnQgdGhlIG51bWJlciBvZiBzeWxsYWJsZXMgb2YuXG4gKiBAcGFyYW0ge1N0cmluZ30gbG9jYWxlIFRoZSBsb2NhbGUgdG8gdXNlIGZvciBjb3VudGluZyBzeWxsYWJsZXMuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgbnVtYmVyIG9mIHN5bGxhYmxlcyBmb3VuZCBpbiBhIHdvcmQuXG4gKi9cbnZhciBjb3VudFVzaW5nVm93ZWxzID0gZnVuY3Rpb24oIHdvcmQsIGxvY2FsZSApIHtcblx0dmFyIHN5bGxhYmxlQ291bnQgPSAwO1xuXG5cdHN5bGxhYmxlQ291bnQgKz0gY291bnRWb3dlbEdyb3Vwcyggd29yZCwgbG9jYWxlICk7XG5cdHN5bGxhYmxlQ291bnQgKz0gY291bnRWb3dlbERldmlhdGlvbnMoIHdvcmQsIGxvY2FsZSApO1xuXG5cdHJldHVybiBzeWxsYWJsZUNvdW50O1xufTtcblxuLyoqXG4gKiBDb3VudHMgdGhlIG51bWJlciBvZiBzeWxsYWJsZXMgaW4gYSB3b3JkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB3b3JkIFRoZSB3b3JkIHRvIGNvdW50IHN5bGxhYmxlcyBvZi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhbGUgVGhlIGxvY2FsZSBvZiB0aGUgd29yZC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBzeWxsYWJsZSBjb3VudCBmb3IgdGhlIHdvcmQuXG4gKi9cbnZhciBjb3VudFN5bGxhYmxlc0luV29yZCA9IGZ1bmN0aW9uKCB3b3JkLCBsb2NhbGUgKSB7XG5cdHZhciBzeWxsYWJsZUNvdW50ID0gMDtcblxuXHR2YXIgZnVsbFdvcmRFeGNsdXNpb24gPSBjb3VudEZ1bGxXb3JkRGV2aWF0aW9ucyggd29yZCwgbG9jYWxlICk7XG5cdGlmICggZnVsbFdvcmRFeGNsdXNpb24gIT09IDAgKSB7XG5cdFx0cmV0dXJuIGZ1bGxXb3JkRXhjbHVzaW9uO1xuXHR9XG5cblx0dmFyIHBhcnRpYWxFeGNsdXNpb25zID0gY291bnRQYXJ0aWFsV29yZERldmlhdGlvbnMoIHdvcmQsIGxvY2FsZSApO1xuXHR3b3JkID0gcGFydGlhbEV4Y2x1c2lvbnMud29yZDtcblx0c3lsbGFibGVDb3VudCArPSBwYXJ0aWFsRXhjbHVzaW9ucy5zeWxsYWJsZUNvdW50O1xuXHRzeWxsYWJsZUNvdW50ICs9IGNvdW50VXNpbmdWb3dlbHMoIHdvcmQsIGxvY2FsZSApO1xuXG5cdHJldHVybiBzeWxsYWJsZUNvdW50O1xufTtcblxuLyoqXG4gKiBDb3VudHMgdGhlIG51bWJlciBvZiBzeWxsYWJsZXMgaW4gYSB0ZXh0IHBlciB3b3JkIGJhc2VkIG9uIHZvd2Vscy5cbiAqIFVzZXMgZXhjbHVzaW9uIHdvcmRzIGZvciB3b3JkcyB0aGF0IGNhbm5vdCBiZSBtYXRjaGVkIHdpdGggdm93ZWwgbWF0Y2hpbmcuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gY291bnQgdGhlIHN5bGxhYmxlcyBvZi5cbiAqIEBwYXJhbSB7U3RyaW5nfSBsb2NhbGUgVGhlIGxvY2FsZSB0byB1c2UgZm9yIGNvdW50aW5nIHN5bGxhYmxlcy5cbiAqIEByZXR1cm5zIHtpbnR9IFRoZSB0b3RhbCBudW1iZXIgb2Ygc3lsbGFibGVzIGZvdW5kIGluIHRoZSB0ZXh0LlxuICovXG52YXIgY291bnRTeWxsYWJsZXNJblRleHQgPSBmdW5jdGlvbiggdGV4dCwgbG9jYWxlICkge1xuXHR0ZXh0ID0gdGV4dC50b0xvY2FsZUxvd2VyQ2FzZSgpO1xuXHR2YXIgd29yZHMgPSBnZXRXb3JkcyggdGV4dCApO1xuXG5cdHZhciBzeWxsYWJsZUNvdW50cyA9IG1hcCggd29yZHMsICBmdW5jdGlvbiggd29yZCApIHtcblx0XHRyZXR1cm4gY291bnRTeWxsYWJsZXNJbldvcmQoIHdvcmQsIGxvY2FsZSApO1xuXHR9ICk7XG5cblx0cmV0dXJuIHN1bSggc3lsbGFibGVDb3VudHMgKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY291bnRTeWxsYWJsZXNJblRleHQ7XG4iLCIvKiogQG1vZHVsZSBzdHJpbmdQcm9jZXNzaW5nL3VuaWZ5V2hpdGVzcGFjZSAqL1xuXG4vKipcbiAqIFJlcGxhY2VzIGEgbm9uIGJyZWFraW5nIHNwYWNlIHdpdGggYSBub3JtYWwgc3BhY2VcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRoZSBzdHJpbmcgdG8gcmVwbGFjZSB0aGUgbm9uIGJyZWFraW5nIHNwYWNlIGluLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIHRleHQgd2l0aCB1bmlmaWVkIHNwYWNlcy5cbiAqL1xudmFyIHVuaWZ5Tm9uQnJlYWtpbmdTcGFjZSA9IGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHRyZXR1cm4gdGV4dC5yZXBsYWNlKCAvJm5ic3A7L2csIFwiIFwiICk7XG59O1xuXG4vKipcbiAqIFJlcGxhY2VzIGFsbCB3aGl0ZXNwYWNlcyB3aXRoIGEgbm9ybWFsIHNwYWNlXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgc3RyaW5nIHRvIHJlcGxhY2UgdGhlIG5vbiBicmVha2luZyBzcGFjZSBpbi5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSB0ZXh0IHdpdGggdW5pZmllZCBzcGFjZXMuXG4gKi9cbnZhciB1bmlmeVdoaXRlU3BhY2UgPSBmdW5jdGlvbiggdGV4dCApIHtcblx0cmV0dXJuIHRleHQucmVwbGFjZSggL1xccy9nLCBcIiBcIiApO1xufTtcblxuLyoqXG4gKiBDb252ZXJ0cyBhbGwgd2hpdGVzcGFjZSB0byBzcGFjZXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gcmVwbGFjZSBzcGFjZXMuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgdGV4dCB3aXRoIHVuaWZpZWQgc3BhY2VzLlxuICovXG52YXIgdW5pZnlBbGxTcGFjZXMgPSBmdW5jdGlvbiggdGV4dCApIHtcblx0dGV4dCA9IHVuaWZ5Tm9uQnJlYWtpbmdTcGFjZSggdGV4dCApO1xuXHRyZXR1cm4gdW5pZnlXaGl0ZVNwYWNlKCB0ZXh0ICk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0dW5pZnlOb25CcmVha2luZ1NwYWNlOiB1bmlmeU5vbkJyZWFraW5nU3BhY2UsXG5cdHVuaWZ5V2hpdGVTcGFjZTogdW5pZnlXaGl0ZVNwYWNlLFxuXHR1bmlmeUFsbFNwYWNlczogdW5pZnlBbGxTcGFjZXMsXG59O1xuIiwidmFyIGZvckVhY2ggPSByZXF1aXJlKCBcImxvZGFzaC9mb3JFYWNoXCIgKTtcbnZhciBoYXMgPSByZXF1aXJlKCBcImxvZGFzaC9oYXNcIiApO1xuXG4vKipcbiAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIGdpdmVuIHdvcmQgaXMgYSBmdW5jdGlvbiB3b3JkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB3b3JkIFRoZSB3b3JkIHRvIGNoZWNrLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuY3Rpb25Xb3JkcyBUaGUgZnVuY3Rpb24gY29udGFpbmluZyB0aGUgbGlzdHMgb2YgZnVuY3Rpb24gd29yZHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciBvciBub3QgdGhlIHdvcmQgaXMgYSBmdW5jdGlvbiB3b3JkLlxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uV29yZCggd29yZCwgZnVuY3Rpb25Xb3JkcyApIHtcblx0cmV0dXJuIC0xICE9PSBmdW5jdGlvbldvcmRzLmluZGV4T2YoIHdvcmQudG9Mb2NhbGVMb3dlckNhc2UoKSApO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSB3b3JkIGNvbWJpbmF0aW9uIGluIHRoZSBjb250ZXh0IG9mIHJlbGV2YW50IHdvcmRzLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICpcbiAqIEBwYXJhbSB7c3RyaW5nW119IHdvcmRzIFRoZSBsaXN0IG9mIHdvcmRzIHRoYXQgdGhpcyBjb21iaW5hdGlvbiBjb25zaXN0cyBvZi5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb2NjdXJyZW5jZXNdIFRoZSBudW1iZXIgb2Ygb2NjdXJyZW5jZXMsIGRlZmF1bHRzIHRvIDAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jdGlvbldvcmRzIFRoZSBmdW5jdGlvbiBjb250YWluaW5nIHRoZSBsaXN0cyBvZiBmdW5jdGlvbiB3b3Jkcy5cbiAqL1xuZnVuY3Rpb24gV29yZENvbWJpbmF0aW9uKCB3b3Jkcywgb2NjdXJyZW5jZXMsIGZ1bmN0aW9uV29yZHMgKSB7XG5cdHRoaXMuX3dvcmRzID0gd29yZHM7XG5cdHRoaXMuX2xlbmd0aCA9IHdvcmRzLmxlbmd0aDtcblx0dGhpcy5fb2NjdXJyZW5jZXMgPSBvY2N1cnJlbmNlcyB8fCAwO1xuXHR0aGlzLl9mdW5jdGlvbldvcmRzID0gZnVuY3Rpb25Xb3Jkcztcbn1cblxuV29yZENvbWJpbmF0aW9uLmxlbmd0aEJvbnVzID0ge1xuXHQyOiAzLFxuXHQzOiA3LFxuXHQ0OiAxMixcblx0NTogMTgsXG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGJhc2UgcmVsZXZhbmNlIGJhc2VkIG9uIHRoZSBsZW5ndGggb2YgdGhpcyBjb21iaW5hdGlvbi5cbiAqXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgYmFzZSByZWxldmFuY2UgYmFzZWQgb24gdGhlIGxlbmd0aC5cbiAqL1xuV29yZENvbWJpbmF0aW9uLnByb3RvdHlwZS5nZXRMZW5ndGhCb251cyA9IGZ1bmN0aW9uKCkge1xuXHRpZiAoIGhhcyggV29yZENvbWJpbmF0aW9uLmxlbmd0aEJvbnVzLCB0aGlzLl9sZW5ndGggKSApIHtcblx0XHRyZXR1cm4gV29yZENvbWJpbmF0aW9uLmxlbmd0aEJvbnVzWyB0aGlzLl9sZW5ndGggXTtcblx0fVxuXG5cdHJldHVybiAwO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBsaXN0IHdpdGggd29yZHMuXG4gKlxuICogQHJldHVybnMge2FycmF5fSBUaGUgbGlzdCB3aXRoIHdvcmRzLlxuICovXG5Xb3JkQ29tYmluYXRpb24ucHJvdG90eXBlLmdldFdvcmRzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLl93b3Jkcztcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgd29yZCBjb21iaW5hdGlvbiBsZW5ndGguXG4gKlxuICogQHJldHVybnMge251bWJlcn0gVGhlIHdvcmQgY29tYmluYXRpb24gbGVuZ3RoLlxuICovXG5Xb3JkQ29tYmluYXRpb24ucHJvdG90eXBlLmdldExlbmd0aCA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5fbGVuZ3RoO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBjb21iaW5hdGlvbiBhcyBpdCBvY2N1cnMgaW4gdGhlIHRleHQuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmF0aW9uLlxuICovXG5Xb3JkQ29tYmluYXRpb24ucHJvdG90eXBlLmdldENvbWJpbmF0aW9uID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLl93b3Jkcy5qb2luKCBcIiBcIiApO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBhbW91bnQgb2Ygb2NjdXJyZW5jZXMgb2YgdGhpcyB3b3JkIGNvbWJpbmF0aW9uLlxuICpcbiAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBhbW91bnQgb2Ygb2NjdXJyZW5jZXMuXG4gKi9cbldvcmRDb21iaW5hdGlvbi5wcm90b3R5cGUuZ2V0T2NjdXJyZW5jZXMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuX29jY3VycmVuY2VzO1xufTtcblxuLyoqXG4gKiBJbmNyZW1lbnRzIHRoZSBvY2N1cnJlbmNlcy5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuV29yZENvbWJpbmF0aW9uLnByb3RvdHlwZS5pbmNyZW1lbnRPY2N1cnJlbmNlcyA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLl9vY2N1cnJlbmNlcyArPSAxO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSByZWxldmFuY2Ugb2YgdGhlIGxlbmd0aC5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gcmVsZXZhbnRXb3JkUGVyY2VudGFnZSBUaGUgcmVsZXZhbmNlIG9mIHRoZSB3b3JkcyB3aXRoaW4gdGhlIGNvbWJpbmF0aW9uLlxuICogQHJldHVybnMge251bWJlcn0gVGhlIHJlbGV2YW5jZSBiYXNlZCBvbiB0aGUgbGVuZ3RoIGFuZCB0aGUgd29yZCByZWxldmFuY2UuXG4gKi9cbldvcmRDb21iaW5hdGlvbi5wcm90b3R5cGUuZ2V0TXVsdGlwbGllciA9IGZ1bmN0aW9uKCByZWxldmFudFdvcmRQZXJjZW50YWdlICkge1xuXHR2YXIgbGVuZ3RoQm9udXMgPSB0aGlzLmdldExlbmd0aEJvbnVzKCk7XG5cblx0Ly8gVGhlIHJlbGV2YW5jZSBzY2FsZXMgbGluZWFybHkgZnJvbSB0aGUgcmVsZXZhbmNlIG9mIG9uZSB3b3JkIHRvIHRoZSBtYXhpbXVtLlxuXHRyZXR1cm4gMSArIHJlbGV2YW50V29yZFBlcmNlbnRhZ2UgKiBsZW5ndGhCb251cztcbn07XG5cbi8qKlxuICogUmV0dXJucyBpZiB0aGUgZ2l2ZW4gd29yZCBpcyBhIHJlbGV2YW50IHdvcmQgYmFzZWQgb24gdGhlIGdpdmVuIHdvcmQgcmVsZXZhbmNlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB3b3JkIFRoZSB3b3JkIHRvIGNoZWNrIGlmIGl0IGlzIHJlbGV2YW50LlxuICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgb3Igbm90IGl0IGlzIHJlbGV2YW50LlxuICovXG5Xb3JkQ29tYmluYXRpb24ucHJvdG90eXBlLmlzUmVsZXZhbnRXb3JkID0gZnVuY3Rpb24oIHdvcmQgKSB7XG5cdHJldHVybiBoYXMoIHRoaXMuX3JlbGV2YW50V29yZHMsIHdvcmQgKTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgcmVsZXZhbmNlIG9mIHRoZSB3b3JkcyB3aXRoaW4gdGhpcyBjb21iaW5hdGlvbi5cbiAqXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgcGVyY2VudGFnZSBvZiByZWxldmFudCB3b3JkcyBpbnNpZGUgdGhpcyBjb21iaW5hdGlvbi5cbiAqL1xuV29yZENvbWJpbmF0aW9uLnByb3RvdHlwZS5nZXRSZWxldmFudFdvcmRQZXJjZW50YWdlID0gZnVuY3Rpb24oKSB7XG5cdHZhciByZWxldmFudFdvcmRDb3VudCA9IDAsIHdvcmRSZWxldmFuY2UgPSAxO1xuXG5cdGlmICggdGhpcy5fbGVuZ3RoID4gMSApIHtcblx0XHRmb3JFYWNoKCB0aGlzLl93b3JkcywgZnVuY3Rpb24oIHdvcmQgKSB7XG5cdFx0XHRpZiAoIHRoaXMuaXNSZWxldmFudFdvcmQoIHdvcmQgKSApIHtcblx0XHRcdFx0cmVsZXZhbnRXb3JkQ291bnQgKz0gMTtcblx0XHRcdH1cblx0XHR9LmJpbmQoIHRoaXMgKSApO1xuXG5cdFx0d29yZFJlbGV2YW5jZSA9IHJlbGV2YW50V29yZENvdW50IC8gdGhpcy5fbGVuZ3RoO1xuXHR9XG5cblx0cmV0dXJuIHdvcmRSZWxldmFuY2U7XG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIHJlbGV2YW5jZSBmb3IgdGhpcyB3b3JkIGNvbWJpbmF0aW9uLlxuICpcbiAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSByZWxldmFuY2Ugb2YgdGhpcyB3b3JkIGNvbWJpbmF0aW9uLlxuICovXG5Xb3JkQ29tYmluYXRpb24ucHJvdG90eXBlLmdldFJlbGV2YW5jZSA9IGZ1bmN0aW9uKCkge1xuXHRpZiAoIHRoaXMuX3dvcmRzLmxlbmd0aCA9PT0gMSAmJiBpc0Z1bmN0aW9uV29yZCggdGhpcy5fd29yZHNbIDAgXSwgdGhpcy5fZnVuY3Rpb25Xb3JkcyApICkge1xuXHRcdHJldHVybiAwO1xuXHR9XG5cblx0dmFyIHdvcmRSZWxldmFuY2UgPSB0aGlzLmdldFJlbGV2YW50V29yZFBlcmNlbnRhZ2UoKTtcblx0aWYgKCB3b3JkUmVsZXZhbmNlID09PSAwICkge1xuXHRcdHJldHVybiAwO1xuXHR9XG5cblx0cmV0dXJuIHRoaXMuZ2V0TXVsdGlwbGllciggd29yZFJlbGV2YW5jZSApICogdGhpcy5fb2NjdXJyZW5jZXM7XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIHJlbGV2YW5jZSBvZiBzaW5nbGUgd29yZHNcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gcmVsZXZhbnRXb3JkcyBBIG1hcHBpbmcgZnJvbSBhIHdvcmQgdG8gYSByZWxldmFuY2UuXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuV29yZENvbWJpbmF0aW9uLnByb3RvdHlwZS5zZXRSZWxldmFudFdvcmRzID0gZnVuY3Rpb24oIHJlbGV2YW50V29yZHMgKSB7XG5cdHRoaXMuX3JlbGV2YW50V29yZHMgPSByZWxldmFudFdvcmRzO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBkZW5zaXR5IG9mIHRoaXMgY29tYmluYXRpb24gd2l0aGluIHRoZSB0ZXh0LlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSB3b3JkQ291bnQgVGhlIHdvcmQgY291bnQgb2YgdGhlIHRleHQgdGhpcyBjb21iaW5hdGlvbiB3YXMgZm91bmQgaW4uXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgZGVuc2l0eSBvZiB0aGlzIGNvbWJpbmF0aW9uLlxuICovXG5Xb3JkQ29tYmluYXRpb24ucHJvdG90eXBlLmdldERlbnNpdHkgPSBmdW5jdGlvbiggd29yZENvdW50ICkge1xuXHRyZXR1cm4gdGhpcy5fb2NjdXJyZW5jZXMgLyB3b3JkQ291bnQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdvcmRDb21iaW5hdGlvbjtcbiJdfQ==
