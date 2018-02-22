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

},{"lodash/unescape":174}],4:[function(require,module,exports){
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
  * @param {string} rootUrl             The root URL of the WP REST API.
  * @param {string} nonce               The WordPress nonce required to save anything to the REST API endpoints.
  * @param {number} postID              The postID of the post to save prominent words for.
  * @param {number} prominentWordsLimit The limit of prominent words.
  * @param {ProminentWordCache} cache   The cache to use for the prominent word term IDs.
  */
	function ProminentWordStorage(_ref) {
		var postID = _ref.postID,
		    rootUrl = _ref.rootUrl,
		    nonce = _ref.nonce,
		    _ref$prominentWordsLi = _ref.prominentWordsLimit,
		    prominentWordsLimit = _ref$prominentWordsLi === undefined ? 20 : _ref$prominentWordsLi,
		    _ref$cache = _ref.cache,
		    cache = _ref$cache === undefined ? null : _ref$cache;

		_classCallCheck(this, ProminentWordStorage);

		var _this = _possibleConstructorReturn(this, (ProminentWordStorage.__proto__ || Object.getPrototypeOf(ProminentWordStorage)).call(this));

		_this._rootUrl = rootUrl;
		_this._nonce = nonce;
		_this._postID = postID;
		_this._savingProminentWords = false;
		_this._previousProminentWords = null;

		_this._postSaveEndpoint = _this._rootUrl + "yoast/v1/prominent_words_link/" + _this._postID;

		if (cache === null) {
			cache = new _ProminentWordCache2.default();
		}
		_this._cache = cache;

		_this.setProminentWordsLimit(prominentWordsLimit);

		_this.retrieveProminentWordId = _this.retrieveProminentWordId.bind(_this);
		return _this;
	}

	/**
  * Sets the prominent words limit.
  *
  * @param {number} limit The limit to set.
  *
  * @returns {void}
  */


	_createClass(ProminentWordStorage, [{
		key: "setProminentWordsLimit",
		value: function setProminentWordsLimit(limit) {
			this._prominentWordsLimit = limit;
		}

		/**
   * Saves prominent words to the database using AJAX
   *
   * @param {WordCombination[]} prominentWords The prominent words to save.
   * @returns {Promise} Resolves when the prominent words are saved.
   */

	}, {
		key: "saveProminentWords",
		value: function saveProminentWords(prominentWords) {
			var _this2 = this;

			// If there is already a save sequence in progress, don't do it again.
			if (this._savingProminentWords) {
				return;
			}
			this._savingProminentWords = true;

			var prominentWordsToSave = prominentWords.slice(0, this._prominentWordsLimit);

			// Retrieve IDs of all prominent word terms, but do it in sequence to prevent overloading servers.
			var prominentWordIds = prominentWordsToSave.reduce(function (previousPromise, prominentWord) {
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
			}).catch(function (e) {
				// eslint-disable-next-line
				window.console && console.log(e);
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

},{"./ProminentWordCache":2,"events":8,"lodash/isEqual":151}],5:[function(require,module,exports){
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

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global yoastSiteWideAnalysisData */

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
  * @param {string} postTypeRestBase The post type REST base that specifies the post type.
  * @param {ProminentWordCache} prominentWordCache The cache for prominent words.
  */
	function SiteWideCalculation(_ref) {
		var totalPosts = _ref.totalPosts,
		    rootUrl = _ref.rootUrl,
		    nonce = _ref.nonce,
		    allProminentWordIds = _ref.allProminentWordIds,
		    listEndpoint = _ref.listEndpoint,
		    postTypeRestBase = _ref.postTypeRestBase,
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
		_this._postTypeRestBase = postTypeRestBase;

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
				/* eslint-disable camelcase */
				per_page: this._perPage,
				status: postStatuses,
				yst_prominent_words_is_unindexed: true
				/* eslint-enable camelcase */
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
				}).catch(function (err) {
					// eslint-disable-next-line
					window.console && console.log(err);

					return _this3.saveProminentWords(post, []);
				});
			}, Promise.resolve());

			processPromises.then(this.continueProcessing).catch(function (err) {
				// eslint-disable-next-line
				window.console && console.log(err);

				_this3.continueProcessing();
			});
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

			var prominentWords = (0, _relevantWords.getRelevantWords)(content, yoastSiteWideAnalysisData.data.l10n.contentLocale);

			return this.saveProminentWords(post, prominentWords);
		}

		/**
   * Saves the prominent words.
   *
   * @param {Object} post A post object with rendered content.
   * @param {Array} prominentWords The prominent words to save.
   * @returns {Promise} Resolves when the prominent words are saved for the post.
   */

	}, {
		key: "saveProminentWords",
		value: function saveProminentWords(post, prominentWords) {
			var prominentWordStorage = new _ProminentWordStorage2.default({
				postID: post.id,
				rootUrl: this._rootUrl,
				nonce: this._nonce,
				cache: this._prominentWordCache
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

			this.emit("processedPost", this._processedPosts, this._totalPosts, this._postTypeRestBase);
		}
	}]);

	return SiteWideCalculation;
}(_events2.default);

exports.default = SiteWideCalculation;

},{"./ProminentWordCache":2,"./ProminentWordStorage":4,"events":8,"yoastseo/js/stringProcessing/relevantWords":196}],6:[function(require,module,exports){
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

var settings = yoastSiteWideAnalysisData.data; /* global yoastSiteWideAnalysisData, tb_remove */

var infoContainer = void 0;
var prominentWordCache = void 0;
var prominentWordsCalculated = false;

/**
 * Recalculates all unindexed posts, pages and custom post types.
 *
 * @returns {Promise} Promise containing the resolved calculation Promises.
 */
function recalculateUnindexed() {
	var progressElement = jQuery("#wpseo_count_items");
	var progress = jQuery("#wpseo_internal_links_unindexed_progressbar").progressbar({ value: 0 });

	var calculations = [];
	var processed = {};
	var totalProcessed = 0;

	Object.keys(settings.allItems).forEach(function (key) {
		var postTypeItems = settings.allItems[key];

		settings.totalPostTypeItems = postTypeItems;

		var calculationPromise = new Promise(function (resolve) {
			var prominentWordsCalculation = createProminentWordsCalculation(settings, key);

			prominentWordsCalculation.on("processedPost", function (postCount, total, postType) {
				// Increment the total processed for the current postType.
				processed[postType] = postCount;

				totalProcessed = sumValues(processed);

				// Update the progress bar.
				updateProgress(progress, progressElement, totalProcessed, settings.totalItems);
			});

			prominentWordsCalculation.start();

			// Free up the variable to start another recalculation.
			prominentWordsCalculation.on("complete", resolve);
		});

		calculations.push(calculationPromise);
	});

	return Promise.all(calculations);
}

/**
 * Sums up the values of the passed object.
 *
 * @param {Object} values The values to sum up.
 *
 * @returns {Number} The total sum of the object values.
 */
function sumValues(values) {
	return Object.values(values).reduce(function (a, b) {
		return a + b;
	});
}

/**
 * Creates a new ProminentWordCalculation object.
 *
 * @param {Object} settings         The settings to use for the calculation.
 * @param {string} postTypeRestBase The endpoint to use for the REST API request.
 *
 * @returns {SiteWideCalculation} The SiteWideCalculation object.
 */
function createProminentWordsCalculation(settings, postTypeRestBase) {
	return new _siteWideCalculation2.default({
		nonce: settings.restApi.nonce,
		rootUrl: settings.restApi.root,
		totalPosts: settings.totalPostTypeItems,
		listEndpoint: settings.restApi.root + "wp/v2/" + postTypeRestBase,
		postTypeRestBase: postTypeRestBase,
		recalculateAll: true,
		allProminentWordIds: settings.allWords,
		prominentWordCache: prominentWordCache
	});
}

/**
 * Updates the progressbar and progress counter.
 *
 * @param {HTMLElement} bar     The progress bar element.
 * @param {HTMLElement} counter The progress counter element.
 * @param {Number}      current The current progress value.
 * @param {Number}      total   The total amount of items.
 *
 * @returns {void}
 */
function updateProgress(bar, counter, current, total) {
	var barWidth = current * (100 / total);

	bar.progressbar("value", Math.round(barWidth));

	counter.html(current);
}

/**
 * Shows the recalculation completion to the user.
 *
 * @returns {void}
 */
function showCompletion() {
	(0, _a11ySpeak2.default)(settings.l10n.calculationCompleted);

	jQuery.get({
		url: settings.restApi.root + "yoast/v1/complete_recalculation/",
		beforeSend: function beforeSend(xhr) {
			xhr.setRequestHeader("X-WP-Nonce", settings.restApi.nonce);
		},
		success: function success() {
			prominentWordsCalculated = true;
			jQuery("#internalLinksCalculation").html(settings.message.analysisCompleted);

			tb_remove();
		}
	});
}

/**
 * Starts the recalculating process.
 *
 * @returns {void}
 */
function startRecalculating() {
	(0, _a11ySpeak2.default)(settings.l10n.calculationInProgress);

	var restApi = new _restApi2.default({ rootUrl: settings.restApi.root, nonce: settings.restApi.nonce });

	prominentWordCache = new _ProminentWordCache2.default();
	var populator = new _ProminentWordCachePopulator2.default({ cache: prominentWordCache, restApi: restApi });

	populator.populate().then(recalculateUnindexed).then(showCompletion);
}

/**
 * Opens the internal link calculation modal.
 *
 * @returns {void}
 */
function openInternalLinkCalculation() {
	if (prominentWordsCalculated === false) {
		jQuery("#openInternalLinksCalculation").click();
	}
}

/**
 * Initializes the site wide analysis tab.
 *
 * @returns {void}
 */
function init() {
	var recalculating = false;
	jQuery(".yoast-js-calculate-prominent-words--all").on("click", function () {
		if (recalculating === false) {
			startRecalculating();

			recalculating = true;
		}
	});

	if (document.location.hash === "#open-internal-links-calculation") {
		setTimeout(openInternalLinkCalculation, 0);
	}

	infoContainer = jQuery(".yoast-js-prominent-words-info");
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

},{"./_getNative":81,"./_root":118}],10:[function(require,module,exports){
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

},{"./_hashClear":87,"./_hashDelete":88,"./_hashGet":89,"./_hashHas":90,"./_hashSet":91}],11:[function(require,module,exports){
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

},{"./_listCacheClear":99,"./_listCacheDelete":100,"./_listCacheGet":101,"./_listCacheHas":102,"./_listCacheSet":103}],12:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":81,"./_root":118}],13:[function(require,module,exports){
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

},{"./_mapCacheClear":104,"./_mapCacheDelete":105,"./_mapCacheGet":106,"./_mapCacheHas":107,"./_mapCacheSet":108}],14:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":81,"./_root":118}],15:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":81,"./_root":118}],16:[function(require,module,exports){
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

},{"./_MapCache":13,"./_setCacheAdd":119,"./_setCacheHas":120}],17:[function(require,module,exports){
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

},{"./_ListCache":11,"./_stackClear":124,"./_stackDelete":125,"./_stackGet":126,"./_stackHas":127,"./_stackSet":128}],18:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":118}],19:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":118}],20:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":81,"./_root":118}],21:[function(require,module,exports){
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

},{"./_baseIndexOf":42}],25:[function(require,module,exports){
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

},{"./_baseTimes":62,"./_isIndex":93,"./isArguments":145,"./isArray":146,"./isBuffer":149,"./isTypedArray":160}],27:[function(require,module,exports){
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

},{"./eq":135}],31:[function(require,module,exports){
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

},{"./_baseForOwn":36,"./_createBaseEach":71}],32:[function(require,module,exports){
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

},{"./_baseEach":31}],33:[function(require,module,exports){
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

},{}],34:[function(require,module,exports){
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

},{"./_arrayPush":28,"./_isFlattenable":92}],35:[function(require,module,exports){
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

},{"./_createBaseFor":72}],36:[function(require,module,exports){
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

},{"./_baseFor":35,"./keys":162}],37:[function(require,module,exports){
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

},{"./_castPath":69,"./_toKey":131}],38:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    isArray = require('./isArray');

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;

},{"./_arrayPush":28,"./isArray":146}],39:[function(require,module,exports){
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
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

},{"./_Symbol":18,"./_getRawTag":82,"./_objectToString":115}],40:[function(require,module,exports){
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

},{"./_baseFindIndex":33,"./_baseIsNaN":48,"./_strictIndexOf":129}],43:[function(require,module,exports){
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

},{"./_SetCache":16,"./_arrayIncludes":24,"./_arrayIncludesWith":25,"./_arrayMap":27,"./_baseUnary":64,"./_cacheHas":66}],44:[function(require,module,exports){
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

},{"./_baseGetTag":39,"./isObjectLike":157}],45:[function(require,module,exports){
var baseIsEqualDeep = require('./_baseIsEqualDeep'),
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
  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}

module.exports = baseIsEqual;

},{"./_baseIsEqualDeep":46,"./isObjectLike":157}],46:[function(require,module,exports){
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
      objTag = objIsArr ? arrayTag : getTag(object),
      othTag = othIsArr ? arrayTag : getTag(other);

  objTag = objTag == argsTag ? objectTag : objTag;
  othTag = othTag == argsTag ? objectTag : othTag;

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

},{"./_Stack":17,"./_equalArrays":74,"./_equalByTag":75,"./_equalObjects":76,"./_getTag":84,"./isArray":146,"./isBuffer":149,"./isTypedArray":160}],47:[function(require,module,exports){
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

},{"./_Stack":17,"./_baseIsEqual":45}],48:[function(require,module,exports){
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

},{"./_isMasked":96,"./_toSource":132,"./isFunction":152,"./isObject":156}],50:[function(require,module,exports){
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

},{"./_baseGetTag":39,"./isLength":153,"./isObjectLike":157}],51:[function(require,module,exports){
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

},{"./_baseMatches":54,"./_baseMatchesProperty":55,"./identity":142,"./isArray":146,"./property":166}],52:[function(require,module,exports){
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

},{"./_isPrototype":97,"./_nativeKeys":113}],53:[function(require,module,exports){
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

},{"./_baseEach":31,"./isArrayLike":147}],54:[function(require,module,exports){
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

},{"./_baseIsMatch":47,"./_getMatchData":80,"./_matchesStrictComparable":110}],55:[function(require,module,exports){
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

},{"./_baseIsEqual":45,"./_isKey":94,"./_isStrictComparable":98,"./_matchesStrictComparable":110,"./_toKey":131,"./get":139,"./hasIn":141}],56:[function(require,module,exports){
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

},{"./_baseGet":37}],58:[function(require,module,exports){
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

},{}],59:[function(require,module,exports){
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

},{"./_overRest":117,"./_setToString":122,"./identity":142}],60:[function(require,module,exports){
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

},{"./_defineProperty":73,"./constant":134,"./identity":142}],61:[function(require,module,exports){
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

},{}],63:[function(require,module,exports){
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

},{"./_Symbol":18,"./_arrayMap":27,"./isArray":146,"./isSymbol":159}],64:[function(require,module,exports){
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

},{}],65:[function(require,module,exports){
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

},{"./_arrayMap":27}],66:[function(require,module,exports){
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

},{}],67:[function(require,module,exports){
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

},{"./isArrayLikeObject":148}],68:[function(require,module,exports){
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

},{"./identity":142}],69:[function(require,module,exports){
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

},{"./_isKey":94,"./_stringToPath":130,"./isArray":146,"./toString":173}],70:[function(require,module,exports){
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":118}],71:[function(require,module,exports){
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

},{"./isArrayLike":147}],72:[function(require,module,exports){
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

},{}],73:[function(require,module,exports){
var getNative = require('./_getNative');

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;

},{"./_getNative":81}],74:[function(require,module,exports){
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

},{"./_SetCache":16,"./_arraySome":29,"./_cacheHas":66}],75:[function(require,module,exports){
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

},{"./_Symbol":18,"./_Uint8Array":19,"./_equalArrays":74,"./_mapToArray":109,"./_setToArray":121,"./eq":135}],76:[function(require,module,exports){
var getAllKeys = require('./_getAllKeys');

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
      objProps = getAllKeys(object),
      objLength = objProps.length,
      othProps = getAllKeys(other),
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

},{"./_getAllKeys":78}],77:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],78:[function(require,module,exports){
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbols = require('./_getSymbols'),
    keys = require('./keys');

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;

},{"./_baseGetAllKeys":38,"./_getSymbols":83,"./keys":162}],79:[function(require,module,exports){
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

},{"./_isKeyable":95}],80:[function(require,module,exports){
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

},{"./_isStrictComparable":98,"./keys":162}],81:[function(require,module,exports){
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

},{"./_baseIsNative":49,"./_getValue":85}],82:[function(require,module,exports){
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

},{"./_Symbol":18}],83:[function(require,module,exports){
var arrayFilter = require('./_arrayFilter'),
    stubArray = require('./stubArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable.call(object, symbol);
  });
};

module.exports = getSymbols;

},{"./_arrayFilter":23,"./stubArray":167}],84:[function(require,module,exports){
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

},{"./_DataView":9,"./_Map":12,"./_Promise":14,"./_Set":15,"./_WeakMap":20,"./_baseGetTag":39,"./_toSource":132}],85:[function(require,module,exports){
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

},{}],86:[function(require,module,exports){
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

},{"./_castPath":69,"./_isIndex":93,"./_toKey":131,"./isArguments":145,"./isArray":146,"./isLength":153}],87:[function(require,module,exports){
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

},{"./_nativeCreate":112}],88:[function(require,module,exports){
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

},{}],89:[function(require,module,exports){
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

},{"./_nativeCreate":112}],90:[function(require,module,exports){
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
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

module.exports = hashHas;

},{"./_nativeCreate":112}],91:[function(require,module,exports){
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

},{"./_nativeCreate":112}],92:[function(require,module,exports){
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

},{"./_Symbol":18,"./isArguments":145,"./isArray":146}],93:[function(require,module,exports){
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

},{}],94:[function(require,module,exports){
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

},{"./isArray":146,"./isSymbol":159}],95:[function(require,module,exports){
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

},{}],96:[function(require,module,exports){
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

},{"./_coreJsData":70}],97:[function(require,module,exports){
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

},{}],98:[function(require,module,exports){
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

},{"./isObject":156}],99:[function(require,module,exports){
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

},{}],100:[function(require,module,exports){
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

},{"./_assocIndexOf":30}],101:[function(require,module,exports){
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

},{"./_assocIndexOf":30}],102:[function(require,module,exports){
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

},{"./_assocIndexOf":30}],103:[function(require,module,exports){
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

},{"./_assocIndexOf":30}],104:[function(require,module,exports){
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

},{"./_Hash":10,"./_ListCache":11,"./_Map":12}],105:[function(require,module,exports){
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

},{"./_getMapData":79}],106:[function(require,module,exports){
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

},{"./_getMapData":79}],107:[function(require,module,exports){
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

},{"./_getMapData":79}],108:[function(require,module,exports){
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

},{"./_getMapData":79}],109:[function(require,module,exports){
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

},{}],110:[function(require,module,exports){
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

},{}],111:[function(require,module,exports){
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

},{"./memoize":164}],112:[function(require,module,exports){
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":81}],113:[function(require,module,exports){
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":116}],114:[function(require,module,exports){
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

},{"./_freeGlobal":77}],115:[function(require,module,exports){
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

},{}],116:[function(require,module,exports){
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

},{}],117:[function(require,module,exports){
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

},{"./_apply":21}],118:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":77}],119:[function(require,module,exports){
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

},{}],120:[function(require,module,exports){
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

},{}],121:[function(require,module,exports){
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

},{}],122:[function(require,module,exports){
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

},{"./_baseSetToString":60,"./_shortOut":123}],123:[function(require,module,exports){
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

},{}],124:[function(require,module,exports){
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

},{"./_ListCache":11}],125:[function(require,module,exports){
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

},{}],126:[function(require,module,exports){
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

},{}],127:[function(require,module,exports){
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

},{}],128:[function(require,module,exports){
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

},{"./_ListCache":11,"./_Map":12,"./_MapCache":13}],129:[function(require,module,exports){
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

},{}],130:[function(require,module,exports){
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

},{"./_memoizeCapped":111}],131:[function(require,module,exports){
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

},{"./isSymbol":159}],132:[function(require,module,exports){
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

},{}],133:[function(require,module,exports){
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

},{"./_basePropertyOf":58}],134:[function(require,module,exports){
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

},{"./_arrayFilter":23,"./_baseFilter":32,"./_baseIteratee":51,"./isArray":146}],137:[function(require,module,exports){
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

},{"./_baseFlatten":34,"./map":163}],138:[function(require,module,exports){
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

},{"./_arrayEach":22,"./_baseEach":31,"./_castFunction":68,"./isArray":146}],139:[function(require,module,exports){
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

},{"./_baseGet":37}],140:[function(require,module,exports){
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

},{"./_baseHas":40,"./_hasPath":86}],141:[function(require,module,exports){
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

},{"./_baseHasIn":41,"./_hasPath":86}],142:[function(require,module,exports){
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

},{}],143:[function(require,module,exports){
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

},{"./_baseIndexOf":42,"./isArrayLike":147,"./isString":158,"./toInteger":171,"./values":175}],144:[function(require,module,exports){
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

},{"./_arrayMap":27,"./_baseIntersection":43,"./_baseRest":59,"./_castArrayLikeObject":67}],145:[function(require,module,exports){
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

},{"./_baseIsArguments":44,"./isObjectLike":157}],146:[function(require,module,exports){
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

},{}],147:[function(require,module,exports){
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

},{"./isFunction":152,"./isLength":153}],148:[function(require,module,exports){
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

},{"./isArrayLike":147,"./isObjectLike":157}],149:[function(require,module,exports){
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

},{"./_root":118,"./stubFalse":168}],150:[function(require,module,exports){
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

},{"./_baseKeys":52,"./_getTag":84,"./_isPrototype":97,"./isArguments":145,"./isArray":146,"./isArrayLike":147,"./isBuffer":149,"./isTypedArray":160}],151:[function(require,module,exports){
var baseIsEqual = require('./_baseIsEqual');

/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
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

},{"./_baseIsEqual":45}],152:[function(require,module,exports){
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

},{"./_baseGetTag":39,"./isObject":156}],153:[function(require,module,exports){
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

},{}],154:[function(require,module,exports){
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

},{"./isNumber":155}],155:[function(require,module,exports){
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

},{"./_baseGetTag":39,"./isObjectLike":157}],156:[function(require,module,exports){
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

},{}],157:[function(require,module,exports){
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

},{}],158:[function(require,module,exports){
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

},{"./_baseGetTag":39,"./isArray":146,"./isObjectLike":157}],159:[function(require,module,exports){
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

},{"./_baseGetTag":39,"./isObjectLike":157}],160:[function(require,module,exports){
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

},{"./_baseIsTypedArray":50,"./_baseUnary":64,"./_nodeUtil":114}],161:[function(require,module,exports){
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

},{}],162:[function(require,module,exports){
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

},{"./_arrayLikeKeys":26,"./_baseKeys":52,"./isArrayLike":147}],163:[function(require,module,exports){
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

},{"./_arrayMap":27,"./_baseIteratee":51,"./_baseMap":53,"./isArray":146}],164:[function(require,module,exports){
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

},{"./_MapCache":13}],165:[function(require,module,exports){
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

},{}],166:[function(require,module,exports){
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

},{"./_baseProperty":56,"./_basePropertyDeep":57,"./_isKey":94,"./_toKey":131}],167:[function(require,module,exports){
/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;

},{}],168:[function(require,module,exports){
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

},{}],169:[function(require,module,exports){
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

},{"./_baseSlice":61,"./toInteger":171}],170:[function(require,module,exports){
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

},{"./toNumber":172}],171:[function(require,module,exports){
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

},{"./toFinite":170}],172:[function(require,module,exports){
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

},{"./isObject":156,"./isSymbol":159}],173:[function(require,module,exports){
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

},{"./_baseToString":63}],174:[function(require,module,exports){
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

},{"./_unescapeHtmlChar":133,"./toString":173}],175:[function(require,module,exports){
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

},{"./_baseValues":65,"./keys":162}],176:[function(require,module,exports){
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

},{}],177:[function(require,module,exports){
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



},{}],178:[function(require,module,exports){
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



},{"lodash/forEach":138,"lodash/memoize":164,"tokenizer2/core":176}],179:[function(require,module,exports){
"use strict";

var transitionWords = require("./transitionWords.js")().singleWords;
/**
 * Returns an array with exceptions for the prominent words researcher.
 * @returns {Array} The array filled with exceptions.
 */
var articles = ["de", "het", "een", "der", "des", "den"];
var cardinalNumerals = ["eén", "één", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien", "elf", "twaalf", "dertien", "veertien", "vijftien", "zestien", "zeventien", "achttien", "negentien", "twintig", "honderd", "honderden", "duizend", "duizenden", "miljoen", "miljoenen", "biljoen", "biljoenen"];
var ordinalNumerals = ["eerste", "tweede", "derde", "vierde", "vijfde", "zesde", "zevende", "achtste", "negende", "tiende", "elfde", "twaalfde", "dertiende", "veertiende", "vijftiende", "zestiende", "zeventiende", "achttiende", "negentiende", "twinstigste"];
// 'Het' is already included in the list of articles.
var personalPronounsNominative = ["ik", "je", "jij", "hij", "ze", "we", "wij", "jullie", "zij", "u", "ge", "gij", "men"];
var personalPronounsAccusative = ["mij", "jou", "hem", "haar", "hen", "hun", "uw"];
var demonstrativePronouns = ["dit", "dat", "deze", "die", "zelf"];
// What to do with 'zijn', since it is also a verb?
var possessivePronouns = ["mijn", "mijne", "jouw", "jouwe", "zijne", "hare", "ons", "onze", "hunne", "uwe", "elkaars", "elkanders"];
var quantifiers = ["alle", "sommige", "sommigen", "weinig", "weinige", "weinigen", "veel", "vele", "velen", "geen", "beetje", "elke", "elk", "genoeg", "meer", "meest", "meeste", "meesten", "paar", "zoveel", "enkele", "enkelen", "zoveelste", "hoeveelste", "laatste", "laatsten", "iedere", "allemaal", "zekere", "ander", "andere", "gene", "enig", "enige", "verscheidene", "verschillende", "voldoende", "allerlei", "allerhande", "enerlei", "enerhande", "beiderlei", "beiderhande", "tweeërlei", "tweeërhande", "drieërlei", "drieërhande", "velerlei", "velerhande", "menigerlei", "menigerhande", "enigerlei", "enigerhande", "generlei", "generhande"];
var reflexivePronouns = ["mezelf", "mijzelf", "jezelf", "jouzelf", "zichzelf", "haarzelf", "hemzelf", "onszelf", "julliezelf", "henzelf", "hunzelf", "uzelf", "zich"];
var reciprocalPronouns = ["mekaar", "elkaar", "elkander", "mekander"];
var indefinitePronouns = ["iedereen", "ieder", "eenieder", "alleman", "allen", "alles", "iemand", "niemand", "iets", "niets", "menigeen"];
var indefinitePronounsPossessive = ["ieders", "aller", "iedereens", "eenieders"];
var relativePronouns = ["welke", "welk", "wat", "wie", "wiens", "wier"];
var interrogativeProAdverbs = ["hoe", "waarom", "waar", "hoezo", "hoeveel"];
var pronominalAdverbs = ["daaraan", "daarachter", "daaraf", "daarbij", "daarbinnen", "daarboven", "daarbuiten", "daardoorheen", "daarheen", "daarin", "daarjegens", "daarmede", "daarnaar", "daarnaartoe", "daaromtrent", "daaronder", "daarop", "daarover", "daaroverheen", "daarrond", "daartegen", "daartussen", "daartussenuit", "daaruit", "daarvan", "daarvandaan", "eraan", "erachter", "erachteraan", "eraf", "erbij", "erbinnen", "erboven", "erbuiten", "erdoor", "erdoorheen", "erheen", "erin", "erjegens", "ermede", "ermee", "erna", "ernaar", "ernaartoe", "ernaast", "erom", "eromtrent", "eronder", "eronderdoor", "erop", "eropaf", "eropuit", "erover", "eroverheen", "errond", "ertegen", "ertegenaan", "ertoe", "ertussen", "ertussenuit", "eruit", "ervan", "ervandaan", "ervandoor", "ervoor", "hieraan", "hierachter", "hieraf", "hierbij", "hierbinnen", "hierboven", "hierbuiten", "hierdoor", "hierdoorheen", "hierheen", "hierin", "hierjegens", "hierlangs", "hiermede", "hiermee", "hierna", "hiernaar", "hiernaartoe", "hiernaast", "hieromheen", "hieromtrent", "hieronder", "hierop", "hierover", "hieroverheen", "hierrond", "hiertegen", "hiertoe", "hiertussen", "hiertussenuit", "hieruit", "hiervan", "hiervandaan", "hiervoor", "vandaan", "waaraan", "waarachter", "waaraf", "waarbij", "waarboven", "waarbuiten", "waardoorheen", "waarheen", "waarin", "waarjegens", "waarmede", "waarna", "waarnaar", "waarnaartoe", "waarnaast", "waarop", "waarover", "waaroverheen", "waarrond", "waartegen", "waartegenin", "waartoe", "waartussen", "waartussenuit", "waaruit", "waarvan", "waarvandaan", "waarvoor"];
var locativeAdverbs = ["daar", "hier", "ginder", "daarginds", "ginds", "ver", "veraf", "ergens", "nergens", "overal", "dichtbij", "kortbij"];
var filteredPassiveAuxiliaries = ["word", "wordt", "werd", "werden", "ben", "bent", "is", "was", "waren"];
var passiveAuxiliariesInfinitive = ["worden", "zijn"];
var otherAuxiliaries = ["heb", "hebt", "heeft", "hadden", "had", "kun", "kan", "kunt", "kon", "konden", "mag", "mocht", "mochten", "dien", "dient", "diende", "dienden", "moet", "moest", "moesten", "ga", "gaat", "ging", "gingen"];
var otherAuxiliariesInfinitive = ["hebben", "kunnen", "mogen", "dienen", "moeten", "gaan"];
// 'Vóórkomen' (appear) is not included, because we don't want to filter out 'voorkómen' (prevent).
var copula = ["blijkt", "blijk", "bleek", "bleken", "gebleken", "dunkt", "dunk", "dunkte", "dunkten", "gedunkt", "heet", "heette", "heetten", "geheten", "lijkt", "lijk", "geleken", "leek", "leken", "schijn", "schijnt", "scheen", "schenen", "toescheen", "toeschijnt", "toeschijn", "toeschenen"];
var copulaInfinitive = ["blijken", "dunken", "heten", "lijken", "schijnen", "toeschijnen"];
var prepositions = ["à", "aan", "aangaande", "achter", "behalve", "behoudens", "beneden", "benevens", "benoorden", "benoordoosten", "benoordwesten", "beoosten", "betreffende", "bewesten", "bezijden", "bezuiden", "bezuidoosten", "bezuidwesten", "bij", "binnen", "blijkens", "boven", "bovenaan", "buiten", "circa", "conform", "contra", "cum", "dankzij", "door", "gedurende", "gezien", "in", "ingevolge", "inzake", "jegens", "krachtens", "langs", "luidens", "met", "middels", "na", "naar", "naast", "nabij", "namens", "nevens", "niettegenstaande", "nopens", "om", "omstreeks", "omtrent", "onder", "onderaan", "ongeacht", "onverminderd", "op", "over", "overeenkomstig", "per", "plus", "post", "richting", "rond", "rondom", "spijts", "staande", "te", "tegen", "tegenover", "ten", "ter", "tijdens", "tot", "tussen", "uit", "van", "vanaf", "vanuit", "versus", "via", "vis-à-vis", "volgens", "voor", "voorbij", "wegens", "zijdens", "zonder"];
// Many prepositional adverbs are already listed as preposition.
var prepositionalAdverbs = ["af", "heen", "mee", "toe", "achterop", "onderin", "voorin", "bovenop", "buitenop", "achteraan", "onderop", "binnenin", "tevoren"];
var coordinatingConjunctions = ["en", "alsmede", "of", "ofwel", "en/of"];
/* 'Zowel' and 'als' are part of 'zowel...als', 'evenmin' is part of 'evenmin...als', 'zomin' is part of 'zomin...als',
 'hetzij' is part of 'hetzij...hetzij'. */
var correlativeConjunctions = ["zowel", "evenmin", "zomin", "hetzij"];
var subordinatingConjunctions = ["vermits", "dewijl", "dorodien", "naardien", "nademaal", "overmits", "wijl", "eer", "eerdat", "aleer", "vooraleer", "alvorens", "totdat", "zolang", "sinds", "sedert", "ingeval", "tenware", "alhoewel", "hoezeer", "uitgezonderd", "zoverre", "zover", "naargelang", "naarmate", "alsof"];
// These verbs are frequently used in interviews to indicate questions and answers.
var interviewVerbs = ["zegt", "zei", "vraagt", "vroeg", "denkt", "dacht", "stelt", "pleit", "pleitte"];
// These transition words were not included in the list for the transition word assessment for various reasons.
var additionalTransitionWords = ["absoluut", "zeker", "ongetwijfeld", "sowieso", "onmiddelijk", "meteen", "inclusief", "direct", "ogenblikkelijk", "terstond", "natuurlijk", "vanzelfsprekend", "gewoonlijk", "normaliter", "doorgaans", "werkelijk", "daadwerkelijk", "inderdaad", "waarachtig", "oprecht", "bijna", "meestal", "misschien", "waarschijnlijk", "wellicht", "mogelijk", "vermoedelijk", "allicht", "aannemelijk", "oorspronkelijk", "aanvankelijk", "initieel", "eigenlijk", "feitelijk", "wezenlijk", "juist", "reeds", "alvast", "bijv.", "vaak", "dikwijls", "veelal", "geregeld", "menigmaal", "regelmatig", "veelvuldig", "eenvoudigweg", "simpelweg", "louter", "kortweg", "stomweg", "domweg", "zomaar", "eventueel", "mogelijkerwijs", "eens", "weleens", "nooit", "ooit", "anders", "momenteel", "thans", "incidenteel", "trouwens", "elders", "volgend", "recent", "onlangs", "recentelijk", "laatst", "zojuist", "relatief", "duidelijk", "overduidelijk", "klaarblijkelijk", "nadrukkelijk", "ogenschijnlijk", "kennelijk", "schijnbaar", "alweer", "continu", "herhaaldelijk", "nog", "steeds", "nu"];
// 'vrij' is not included because it also means 'free'.
var intensifiers = ["zeer", "erg", "redelijk", "flink", "tikkeltje", "bijzonder", "ernstig", "enigszins", "zo", "tamelijk", "nogal", "behoorlijk", "zwaar", "heel", "hele", "reuze", "buitengewoon", "ontzettend", "vreselijk"];
// These verbs convey little meaning.
var delexicalizedVerbs = ["laat", "liet", "lieten", "kom", "komt", "kwam", "kwamen", "maakt", "maak", "maakte", "maakten", "doe", "doet", "deed", "deden", "vindt", "vind", "vond", "vonden"];
var delexicalizedVerbsInfinitive = ["laten", "komen", "maken", "doen", "vinden"];
/* These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
Keyword combinations containing these adjectives/adverbs are fine. */
var generalAdjectivesAdverbs = ["nieuw", "nieuwe", "nieuwer", "nieuwere", "nieuwst", "nieuwste", "oud", "oude", "ouder", "oudere", "oudst", "oudste", "vorig", "vorige", "goed", "goede", "beter", "betere", "best", "beste", "groot", "grote", "groter", "grotere", "grootst", "grootste", "makkelijk", "makkelijke", "makkelijker", "makkelijkere", "makkelijkst", "makkelijste", "gemakkelijk", "gemakkelijke", "gemakkelijker", "gemakkelijkere", "gemakkelijkst", "gemakkelijste", "simpel", "simpele", "simpeler", "simpelere", "simpelst", "simpelste", "snel", "snelle", "sneller", "snellere", "snelst", "snelste", "verre", "verder", "verdere", "verst", "verste", "lang", "lange", "langer", "langere", "langst", "langste", "hard", "harde", "harder", "hardere", "hardst", "hardste", "minder", "mindere", "minst", "minste", "eigen", "laag", "lage", "lager", "lagere", "laagst", "laagste", "hoog", "hoge", "hoger", "hogere", "hoogst", "hoogste", "klein", "kleine", "kleiner", "kleinere", "kleinst", "kleinste", "kort", "korte", "korter", "kortere", "kortst", "kortste", "herhaaldelijke", "directe", "ongeveer", "slecht", "slechte", "slechter", "slechtere", "slechtst", "slechtste", "zulke", "zulk", "zo'n", "zulks", "er", "extreem", "extreme", "bijbehorende", "bijbehorend", "niet"];
var interjections = ["oh", "wauw", "hèhè", "hè", "hé", "au", "ai", "jaja", "welja", "jawel", "ssst", "heremijntijd", "hemeltjelief", "aha", "foei", "hmm", "nou", "nee", "tja", "nja", "okido", "ho", "halt", "komaan", "komop", "verrek", "nietwaar", "brr", "oef", "ach", "och", "bah", "enfin", "afijn", "haha", "hihi", "hatsjie", "hatsjoe", "hm", "tring", "vroem", "boem", "hopla"];
// These words and abbreviations are frequently used in recipes in lists of ingredients.
var recipeWords = ["ml", "cl", "dl", "l", "tl", "el", "mg", "g", "gr", "kg", "ca", "theel", "min", "sec", "uur"];
var timeWords = ["seconde", "secondes", "seconden", "minuut", "minuten", "uur", "uren", "dag", "dagen", "week", "weken", "maand", "maanden", "jaar", "jaren", "vandaag", "morgen", "overmorgen", "gisteren", "eergisteren", "'s", "morgens", "avonds", "middags", "nachts"];
var vagueNouns = ["ding", "dingen", "manier", "manieren", "item", "items", "keer", "maal", "procent", "geval", "aspect", "persoon", "personen", "deel"];
var miscellaneous = ["wel", "ja", "neen", "oké", "oke", "okee", "ok", "zoiets", "€", "euro"];
var titlesPreceding = ["mevr", "dhr", "mr", "dr", "prof"];
var titlesFollowing = ["jr", "sr"];
/*
Exports all function words concatenated, and specific word categories and category combinations
to be used as filters for the prominent words.
 */
module.exports = function () {
  return {
    // These word categories are filtered at the ending of word combinations.
    filteredAtBeginning: [].concat(passiveAuxiliariesInfinitive, otherAuxiliariesInfinitive, copulaInfinitive, delexicalizedVerbsInfinitive),
    // These word categories are filtered at the ending of word combinations.
    filteredAtEnding: [].concat(ordinalNumerals, generalAdjectivesAdverbs),
    // These word categories are filtered at the beginning and ending of word combinations.
    filteredAtBeginningAndEnding: [].concat(articles, prepositions, coordinatingConjunctions, demonstrativePronouns, intensifiers, quantifiers),
    // These word categories are filtered everywhere within word combinations.
    filteredAnywhere: [].concat(transitionWords, personalPronounsNominative, personalPronounsAccusative, reflexivePronouns, interjections, cardinalNumerals, filteredPassiveAuxiliaries, otherAuxiliaries, copula, interviewVerbs, delexicalizedVerbs, indefinitePronouns, correlativeConjunctions, subordinatingConjunctions, interrogativeProAdverbs, relativePronouns, locativeAdverbs, miscellaneous, prepositionalAdverbs, pronominalAdverbs, recipeWords, timeWords, vagueNouns, reciprocalPronouns, possessivePronouns),
    // This export contains all of the above words.
    all: [].concat(articles, cardinalNumerals, ordinalNumerals, demonstrativePronouns, possessivePronouns, reflexivePronouns, reciprocalPronouns, personalPronounsNominative, personalPronounsAccusative, quantifiers, indefinitePronouns, indefinitePronounsPossessive, relativePronouns, interrogativeProAdverbs, pronominalAdverbs, locativeAdverbs, prepositionalAdverbs, filteredPassiveAuxiliaries, passiveAuxiliariesInfinitive, otherAuxiliaries, otherAuxiliariesInfinitive, copula, copulaInfinitive, prepositions, coordinatingConjunctions, correlativeConjunctions, subordinatingConjunctions, interviewVerbs, transitionWords, additionalTransitionWords, intensifiers, delexicalizedVerbs, delexicalizedVerbsInfinitive, interjections, generalAdjectivesAdverbs, recipeWords, vagueNouns, miscellaneous, titlesPreceding, titlesFollowing)
  };
};



},{"./transitionWords.js":180}],180:[function(require,module,exports){
"use strict";

var singleWords = ["aangezien", "al", "aldus", "allereerst", "als", "alsook", "anderzijds", "bijgevolg", "bijvoorbeeld", "bovendien", "concluderend", "daardoor", "daarentegen", "daarmee", "daarna", "daarnaast", "daarom", "daartoe", "daarvoor", "dadelijk", "dan", "desondanks", "dienovereenkomstig", "dientegevolge", "doch", "doordat", "dus", "echter", "eerst", "evenals", "eveneens", "evenzeer", "hierom", "hoewel", "immers", "indien", "integendeel", "intussen", "kortom", "later", "maar", "mits", "nadat", "namelijk", "net als", "niettemin", "noch", "ofschoon", "omdat", "ondanks", "ondertussen", "ook", "opdat", "resumerend", "samengevat", "samenvattend", "tegenwoordig", "teneinde", "tenzij", "terwijl", "tevens", "toch", "toen", "uiteindelijk", "vanwege", "vervolgens", "voorafgaand", "vooralsnog", "voordat", "voorts", "vroeger", "waardoor", "waarmee", "waaronder", "wanneer", "want", "zoals", "zodat", "zodoende", "zodra"];
var multipleWords = ["aan de andere kant", "aan de ene kant", "aangenomen dat", "al met al", "alles afwegend", "alles bij elkaar", "alles in aanmerking nemend", "als gevolg van", "anders gezegd", "daar staat tegenover", "daarbij komt", "daaruit volgt", "dat betekent", "dat blijkt uit", "de oorzaak daarvan is", "de oorzaak hiervan is", "door middel van", "een voorbeeld hiervan", "een voorbeeld van", "gesteld dat", "hetzelfde als", "hieruit kunnen we afleiden", "hieruit volgt", "hoe het ook zij", "in de derde plaats", "in de eerste plaats", "in de tweede plaats", "in één woord", "in het bijzonder", "in het geval dat", "in plaats van", "in tegenstelling tot", "in vergelijking met", "maar ook", "met als doel", "met andere woorden", "met behulp van", "met de bedoeling", "neem nou", "net als", "om kort te gaan", "onder andere", "op dezelfde wijze", "stel dat", "te danken aan", "te wijten aan", "ten derde", "ten eerste", "ten gevolge van", "ten slotte", "ten tweede", "ter conclusie", "ter illustratie", "ter verduidelijking", "tot nog toe", "tot slot", "vandaar dat", "vergeleken met", "voor het geval dat"];
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



},{}],181:[function(require,module,exports){
"use strict";

var filteredPassiveAuxiliaries = require("./passiveVoice/auxiliaries.js")().filteredAuxiliaries;
var notFilteredPassiveAuxiliaries = require("./passiveVoice/auxiliaries.js")().notFilteredAuxiliaries;
var transitionWords = require("./transitionWords.js")().singleWords;
/**
 * Returns an object with exceptions for the prominent words researcher
 * @returns {Object} The object filled with exception arrays.
 */
var articles = ["the", "an", "a"];
var cardinalNumerals = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty", "hundred", "hundreds", "thousand", "thousands", "million", "millions", "billion", "billions"];
var ordinalNumerals = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth", "twentieth"];
var personalPronounsNominative = ["i", "you", "he", "she", "it", "we", "they"];
var personalPronounsAccusative = ["me", "him", "us", "them"];
var demonstrativePronouns = ["this", "that", "these", "those"];
var possessivePronouns = ["my", "your", "his", "her", "its", "their", "our", "mine", "yours", "hers", "theirs", "ours"];
var quantifiers = ["all", "some", "many", "lot", "lots", "ton", "tons", "bit", "no", "every", "enough", "little", "much", "more", "most", "plenty", "several", "few", "fewer", "kind", "kinds"];
var reflexivePronouns = ["myself", "yourself", "himself", "herself", "itself", "oneself", "ourselves", "yourselves", "themselves"];
var indefinitePronouns = ["none", "nobody", "everyone", "everybody", "someone", "somebody", "anyone", "anybody", "nothing", "everything", "something", "anything", "each", "other", "whatever", "whichever", "whoever", "whomever", "whomsoever", "whosoever", "others", "neither", "both", "either", "any", "such"];
var indefinitePronounsPossessive = ["one's", "nobody's", "everyone's", "everybody's", "someone's", "somebody's", "anyone's", "anybody's", "nothing's", "everything's", "something's", "anything's", "whoever's", "others'", "other's", "another's", "neither's", "either's"];
var interrogativeDeterminers = ["which", "what", "whose"];
var interrogativePronouns = ["who", "whom"];
var interrogativeProAdverbs = ["where", "how", "why", "whether", "wherever", "whyever", "wheresoever", "whensoever", "howsoever", "whysoever", "whatsoever", "whereso", "whomso", "whenso", "howso", "whyso", "whoso", "whatso"];
var pronominalAdverbs = ["therefor", "therein", "hereby", "hereto", "wherein", "therewith", "herewith", "wherewith", "thereby"];
var locativeAdverbs = ["there", "here", "whither", "thither", "hither", "whence", "thence"];
var adverbialGenitives = ["always", "once", "twice", "thrice"];
var otherAuxiliaries = ["can", "cannot", "can't", "could", "couldn't", "could've", "dare", "dares", "dared", "do", "don't", "does", "doesn't", "did", "didn't", "done", "have", "haven't", "had", "hadn't", "has", "hasn't", "i've", "you've", "we've", "they've", "i'd", "you'd", "he'd", "she'd", "it'd", "we'd", "they'd", "would", "wouldn't", "would've", "may", "might", "must", "need", "needn't", "needs", "ought", "shall", "shalln't", "shan't", "should", "shouldn't", "will", "won't", "i'll", "you'll", "he'll", "she'll", "it'll", "we'll", "they'll", "there's", "there're", "there'll", "here's", "here're", "there'll"];
var copula = ["appear", "appears", "appeared", "become", "becomes", "became", "come", "comes", "came", "keep", "keeps", "kept", "remain", "remains", "remained", "stay", "stays", "stayed", "turn", "turns", "turned"];
// These verbs should only be included at the beginning of combinations.
var continuousVerbs = ["doing", "daring", "having", "appearing", "becoming", "coming", "keeping", "remaining", "staying", "saying", "asking", "stating", "seeming", "letting", "making", "setting", "showing", "putting", "adding", "going", "using", "trying", "containing"];
var prepositions = ["in", "from", "with", "under", "throughout", "atop", "for", "on", "of", "to", "aboard", "about", "above", "abreast", "absent", "across", "adjacent", "after", "against", "along", "alongside", "amid", "mid", "among", "apropos", "apud", "around", "as", "astride", "at", "ontop", "afore", "tofore", "behind", "ahind", "below", "ablow", "beneath", "neath", "beside", "between", "atween", "beyond", "ayond", "by", "chez", "circa", "spite", "down", "except", "into", "less", "like", "minus", "near", "nearer", "nearest", "anear", "notwithstanding", "off", "onto", "opposite", "out", "outen", "over", "past", "per", "pre", "qua", "sans", "sauf", "sithence", "through", "thru", "truout", "toward", "underneath", "up", "upon", "upside", "versus", "via", "vis-à-vis", "without", "ago", "apart", "aside", "aslant", "away", "withal", "towards", "amidst", "amongst", "midst", "whilst"];
// Many prepositional adverbs are already listed as preposition.
var prepositionalAdverbs = ["back", "within", "forward", "backward", "ahead"];
var coordinatingConjunctions = ["and", "or", "and/or", "yet"];
// 'sooner' is part of 'no sooner...than', 'just' is part of 'just as...so',
// 'Only' is part of 'not only...but also'.
var correlativeConjunctions = ["sooner", "just", "only"];
var subordinatingConjunctions = ["if", "even"];
// These verbs are frequently used in interviews to indicate questions and answers.
// 'Claim','claims', 'state' and 'states' are not included, because these words are also nouns.
var interviewVerbs = ["say", "says", "said", "claimed", "ask", "asks", "asked", "stated", "explain", "explains", "explained", "think", "thinks", "talks", "talked", "announces", "announced", "tells", "told", "discusses", "discussed", "suggests", "suggested", "understands", "understood"];
// These transition words were not included in the list for the transition word assessment for various reasons.
var additionalTransitionWords = ["again", "definitely", "eternally", "expressively", "instead", "expressly", "immediately", "including", "instantly", "namely", "naturally", "next", "notably", "now", "nowadays", "ordinarily", "positively", "truly", "ultimately", "uniquely", "usually", "almost", "maybe", "probably", "granted", "initially", "too", "actually", "already", "e.g", "i.e", "often", "regularly", "simply", "optionally", "perhaps", "sometimes", "likely", "never", "ever", "else", "inasmuch", "provided", "currently", "incidentally", "elsewhere", "particular", "recently", "relatively", "f.i", "clearly", "apparently"];
var intensifiers = ["highly", "very", "really", "extremely", "absolutely", "completely", "totally", "utterly", "quite", "somewhat", "seriously", "fairly", "fully", "amazingly"];
/* These verbs convey little meaning. 'Show', 'shows', 'uses', 'meaning', 'set', 'sets'
 are not included, because these words could be relevant nouns.

 */
var delexicalizedVerbs = ["seem", "seems", "seemed", "let", "let's", "lets", "make", "makes", "made", "want", "showed", "shown", "go", "goes", "went", "gone", "take", "takes", "took", "taken", "put", "puts", "use", "used", "try", "tries", "tried", "mean", "means", "meant", "called", "based", "add", "adds", "added", "contain", "contains", "contained", "consist", "consists", "consisted", "ensure", "ensures", "ensured"];
// These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
// Keyword combinations containing these adjectives/adverbs are fine.
var generalAdjectivesAdverbs = ["new", "newer", "newest", "old", "older", "oldest", "previous", "good", "well", "better", "best", "big", "bigger", "biggest", "easy", "easier", "easiest", "fast", "faster", "fastest", "far", "hard", "harder", "hardest", "least", "own", "large", "larger", "largest", "long", "longer", "longest", "low", "lower", "lowest", "high", "higher", "highest", "regular", "simple", "simpler", "simplest", "small", "smaller", "smallest", "tiny", "tinier", "tiniest", "short", "shorter", "shortest", "main", "actual", "nice", "nicer", "nicest", "real", "same", "able", "certain", "usual", "so-called", "mainly", "mostly", "recent", "anymore", "complete", "lately", "possible", "commonly", "constantly", "continually", "directly", "easily", "nearly", "slightly", "somewhere", "estimated", "latest", "different", "similar", "widely", "bad", "worse", "worst", "great", "specific", "available", "average", "awful", "awesome", "basic", "beautiful", "busy", "current", "entire", "everywhere", "important", "major", "multiple", "normal", "necessary", "obvious", "partly", "special", "last", "early", "earlier", "earliest", "young", "younger", "youngest", ""];
var interjections = ["oh", "wow", "tut-tut", "tsk-tsk", "ugh", "whew", "phew", "yeah", "yea", "shh", "oops", "ouch", "aha", "yikes"];
// These words and abbreviations are frequently used in recipes in lists of ingredients.
var recipeWords = ["tbs", "tbsp", "spk", "lb", "qt", "pk", "bu", "oz", "pt", "mod", "doz", "hr", "f.g", "ml", "dl", "cl", "l", "mg", "g", "kg", "quart"];
var timeWords = ["seconds", "minute", "minutes", "hour", "hours", "day", "days", "week", "weeks", "month", "months", "year", "years", "today", "tomorrow", "yesterday"];
// 'People' should only be removed in combination with 'some', 'many' and 'few' (and is therefore not yet included in the list below).
var vagueNouns = ["thing", "things", "way", "ways", "matter", "case", "likelihood", "ones", "piece", "pieces", "stuff", "times", "part", "parts", "percent", "instance", "instances", "aspect", "aspects", "item", "items", "idea", "theme", "person", "instance", "instances", "detail", "details", "factor", "factors", "difference", "differences"];
// 'No' is already included in the quantifier list.
var miscellaneous = ["not", "yes", "sure", "top", "bottom", "ok", "okay", "amen", "aka", "etc", "etcetera", "sorry", "please"];
var titlesPreceding = ["ms", "mss", "mrs", "mr", "dr", "prof"];
var titlesFollowing = ["jr", "sr"];
module.exports = function () {
    return {
        // These word categories are filtered at the ending of word combinations.
        filteredAtEnding: [].concat(ordinalNumerals, continuousVerbs, generalAdjectivesAdverbs),
        // These word categories are filtered at the beginning and ending of word combinations.
        filteredAtBeginningAndEnding: [].concat(articles, prepositions, coordinatingConjunctions, demonstrativePronouns, intensifiers, quantifiers, possessivePronouns),
        // These word categories are filtered everywhere within word combinations.
        filteredAnywhere: [].concat(transitionWords, adverbialGenitives, personalPronounsNominative, personalPronounsAccusative, reflexivePronouns, interjections, cardinalNumerals, filteredPassiveAuxiliaries, otherAuxiliaries, copula, interviewVerbs, delexicalizedVerbs, indefinitePronouns, correlativeConjunctions, subordinatingConjunctions, interrogativeDeterminers, interrogativePronouns, interrogativeProAdverbs, locativeAdverbs, miscellaneous, prepositionalAdverbs, pronominalAdverbs, recipeWords, timeWords, vagueNouns),
        // These categories are used in the passive voice assessment. If they directly precede a participle, the sentence part is not passive.
        cannotDirectlyPrecedePassiveParticiple: [].concat(articles, prepositions, demonstrativePronouns, possessivePronouns, ordinalNumerals, continuousVerbs, quantifiers),
        /*
        These categories are used in the passive voice assessment. If they appear between an auxiliary and a participle,
        the sentence part is not passive.
        */
        cannotBeBetweenPassiveAuxiliaryAndParticiple: [].concat(otherAuxiliaries, copula, interviewVerbs, delexicalizedVerbs),
        // This export contains all of the above words.
        all: [].concat(articles, cardinalNumerals, ordinalNumerals, demonstrativePronouns, possessivePronouns, reflexivePronouns, personalPronounsNominative, personalPronounsAccusative, quantifiers, indefinitePronouns, continuousVerbs, indefinitePronounsPossessive, interrogativeDeterminers, interrogativePronouns, interrogativeProAdverbs, pronominalAdverbs, locativeAdverbs, adverbialGenitives, prepositionalAdverbs, filteredPassiveAuxiliaries, notFilteredPassiveAuxiliaries, otherAuxiliaries, copula, prepositions, coordinatingConjunctions, correlativeConjunctions, subordinatingConjunctions, interviewVerbs, transitionWords, additionalTransitionWords, intensifiers, delexicalizedVerbs, interjections, generalAdjectivesAdverbs, recipeWords, vagueNouns, miscellaneous, titlesPreceding, titlesFollowing)
    };
};



},{"./passiveVoice/auxiliaries.js":182,"./transitionWords.js":183}],182:[function(require,module,exports){
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



},{}],183:[function(require,module,exports){
"use strict";
/** @module config/transitionWords */

var singleWords = ["accordingly", "additionally", "afterward", "afterwards", "albeit", "also", "although", "altogether", "another", "basically", "because", "before", "besides", "but", "certainly", "chiefly", "comparatively", "concurrently", "consequently", "contrarily", "conversely", "correspondingly", "despite", "doubtedly", "during", "e.g.", "earlier", "emphatically", "equally", "especially", "eventually", "evidently", "explicitly", "finally", "firstly", "following", "formerly", "forthwith", "fourthly", "further", "furthermore", "generally", "hence", "henceforth", "however", "i.e.", "identically", "indeed", "instead", "last", "lastly", "later", "lest", "likewise", "markedly", "meanwhile", "moreover", "nevertheless", "nonetheless", "nor", "notwithstanding", "obviously", "occasionally", "otherwise", "overall", "particularly", "presently", "previously", "rather", "regardless", "secondly", "shortly", "significantly", "similarly", "simultaneously", "since", "so", "soon", "specifically", "still", "straightaway", "subsequently", "surely", "surprisingly", "than", "then", "thereafter", "therefore", "thereupon", "thirdly", "though", "thus", "till", "undeniably", "undoubtedly", "unless", "unlike", "unquestionably", "until", "when", "whenever", "whereas", "while"];
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



},{}],184:[function(require,module,exports){
"use strict";

var transitionWords = require("./transitionWords.js")().singleWords;
/**
 * Returns an object with exceptions for the prominent words researcher
 * @returns {Object} The object filled with exception arrays.
 */
var articles = ["le", "la", "les", "un", "une", "des", "aux", "du", "au", "d'un", "d'une"];
var cardinalNumerals = ["deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix", "quatre-vingt", "quatre-vingt-dix", "cent", "mille", "million", "milliard"];
// 'premier' and 'première' are not included because of their secondary meanings ('prime minister', '[movie] premiere')
var ordinalNumerals = ["second", "secondes", "deuxième", "deuxièmes", "troisième", "troisièmes", "quatrième", "quatrièmes", "cinquième", "cinquièmes", "sixième", "sixièmes", "septième", "septièmes", "huitième", "huitièmes", "neuvième", "neuvièmes", "dixième", "dixièmes", "onzième", "onzièmes", "douzième", "douzièmes", "treizième", "treizièmes", "quatorzième", "quatorzièmes", "quinzième", "quinzièmes", "seizième", "seizièmes", "dix-septième", "dix-septièmes", "dix-huitième", "dix-huitièmes", "dix-neuvième", "dix-neuvièmes", "vingtième", "vingtièmes"];
var personalPronounsNominative = ["je", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles"];
var personalPronounsStressed = ["moi", "toi", "lui", "soi", "eux"];
// Le, la, les are already included in the articles list.
var personalPronounsAccusative = ["me", "te"];
var demonstrativePronouns = ["celui", "celle", "ceux", "celles", "ce", "celui-ci", "celui-là", "celle-ci", "celle-là", "ceux-ci", "ceux-là", "celles-ci", "celles-là", "ceci", "cela", "ça", "cette", "cet", "ces"];
var possessivePronouns = ["mon", "ton", "son", "ma", "ta", "sa", "mes", "tes", "ses", "notre", "votre", "leur", "nos", "vos", "leurs"];
var quantifiers = ["beaucoup", "peu", "quelque", "quelques", "tous", "tout", "toute", "toutes", "plusieurs", "plein", "chaque", "suffisant", "suffisante", "suffisantes", "suffisants", "faible", "moins", "tant", "plus", "divers", "diverse", "diverses"];
// The remaining reflexive personal pronouns are already included in other pronoun lists.
var reflexivePronouns = ["se"];
var indefinitePronouns = ["aucun", "aucune", "autre", "autres", "certain", "certaine", "certaines", "certains", "chacun", "chacune", "même", "mêmes", "quelqu'un", "quelqu'une", "quelques'uns", "quelques'unes", "autrui", "nul", "personne", "quiconque", "rien", "d'aucunes", "d'aucuns", "nuls", "nules", "l'autre", "l'autres", "tel", "telle", "tels", "telles"];
var relativePronouns = ["qui", "que", "lequel", "laquelle", "auquel", "auxquels", "auxquelles", "duquel", "desquels", "desquelles", "dont", "où", "quoi"];
var interrogativeProAdverbs = ["combien", "comment", "pourquoi", "d'où"];
var interrogativeAdjectives = ["quel", "quels", "quelle"];
var pronominalAdverbs = ["y"];
var locativeAdverbs = ["là", "ici", "voici"];
// 'Vins' is not included because it also means 'wines'.
var otherAuxiliaries = ["a", "a-t-elle", "a-t-il", "a-t-on", "ai", "ai-je", "aie", "as", "as-tu", "aura", "aurai", "auraient", "aurais", "aurait", "auras", "aurez", "auriez", "aurons", "auront", "avaient", "avais", "avait", "avez", "avez-vous", "aviez", "avions", "avons", "avons-nous", "ayez", "ayons", "eu", "eûmes", "eurent", "eus", "eut", "eûtes", "j'ai", "j'aurai", "j'avais", "j'eus", "ont", "ont-elles", "ont-ils", "vais", "vas", "va", "allons", "allez", "vont", "vais-je", "vas-tu", "va-t-il", "va-t-elle", "va-t-on", "allons-nous", "allez-vous", "vont-elles", "vont-ils", "allé", "allés", "j'allai", "allai", "allas", "alla", "allâmes", "allâtes", "allèrent", "j'allais", "allais", "allait", "allions", "alliez", "allaient", "j'irai", "iras", "ira", "irons", "irez", "iront", "j'aille", "aille", "ailles", "aillent", "j'allasse", "allasse", "allasses", "allât", "allassions", "allassiez", "allassent", "j'irais", "irais", "irait", "irions", "iriez", "iraient", "allant", "viens", "vient", "venons", "venez", "viennent", "viens-je", "viens-de", "vient-il", "vient-elle", "vient-on", "venons-nous", "venez-vous", "viennent-elles", "viennent-ils", "vins", "vint", "vînmes", "vîntes", "vinrent", "venu", "venus", "venais", "venait", "venions", "veniez", "venaient", "viendrai", "viendras", "viendra", "viendrons", "viendrez", "viendront", "vienne", "viennes", "vinsse", "vinsses", "vînt", "vinssions", "vinssiez", "vinssent", "viendrais", "viendrait", "viendrions", "viendriez", "viendraient", "venant", "dois", "doit", "devons", "devez", "doivent", "dois-je", "dois-tu", "doit-il", "doit-elle", "doit-on", "devons-nous", "devez-vous", "doivent-elles", "doivent-ils", "dus", "dut", "dûmes", "dûtes", "durent", "dû", "devais", "devait", "devions", "deviez", "devaient", "devrai", "devras", "devra", "devrons", "devrez", "devront", "doive", "doives", "dusse", "dusses", "dût", "dussions", "dussiez", "dussent", "devrais", "devrait", "devrions", "devriez", "devraient", "peux", "peut", "pouvons", "pouvez", "peuvent", "peux-je", "peux-tu", "peut-il", "peut-elle", "peut-on", "pouvons-nous", "pouvez-vous", "peuvent-ils", "peuvent-elles", "pus", "put", "pûmes", "pûtes", "purent", "pu", "pouvais", "pouvait", "pouvions", "pouviez", "pouvaient", "pourrai", "pourras", "pourra", "pourrons", "pourrez", "pourront", "puisse", "puisses", "puissions", "puissiez", "puissent", "pusse", "pusses", "pût", "pussions", "pussiez", "pussent", "pourrais", "pourrait", "pourrions", "pourriez", "pourraient", "pouvant", "semble", "sembles", "semblons", "semblez", "semblent", "semble-je", "sembles-il", "sembles-elle", "sembles-on", "semblons-nous", "semblez-vous", "semblent-ils", "semblent-elles", "semblai", "semblas", "sembla", "semblâmes", "semblâtes", "semblèrent", "semblais", "semblait", "semblions", "sembliez", "semblaient", "semblerai", "sembleras", "semblera", "semblerons", "semblerez", "sembleront", "semblé", "semblasse", "semblasses", "semblât", "semblassions", "semblassiez", "semblassent", "semblerais", "semblerait", "semblerions", "sembleriez", "sembleraient", "parais", "paraît", "ait", "paraissons", "paraissez", "paraissent", "parais-je", "parais-tu", "paraît-il", "paraît-elle", "paraît-on", "ait-il", "ait-elle", "ait-on", "paraissons-nous", "paraissez-vous", "paraissent-ils", "paraissent-elles", "parus", "parut", "parûmes", "parûtes", "parurent", "paraissais", "paraissait", "paraissions", "paraissiez", "paraissaient", "paraîtrai", "paraîtras", "paraîtra", "paraîtrons", "paraîtrez", "paraîtront", "aitrai", "aitras", "aitra", "aitrons", "aitrez", "aitront", "paru", "paraisse", "paraisses", "parusse", "parusses", "parût", "parussions", "parussiez", "parussent", "paraîtrais", "paraîtrait", "paraîtrions", "paraîtriez", "paraîtraient", "paraitrais", "paraitrait", "paraitrions", "paraitriez", "paraitraient", "paraissant", "mets", "met", "mettons", "mettez", "mettent", "mets-je", "mets-tu", "met-il", "met-elle", "met-on", "mettons-nous", "mettez-vous", "mettent-ils", "mettent-elles", "mis", "mit", "mîmes", "mîtes", "mirent", "mettais", "mettait", "mettions", "mettiez", "mettaient", "mettrai", "mettras", "mettra", "mettrons", "mettrez", "mettront", "mette", "mettes", "misse", "misses", "mît", "missions", "missiez", "missent", "mettrais", "mettrait", "mettrions", "mettriez", "mettraient", "mettant", "finis", "finit", "finissons", "finissez", "finissent", "finis-je", "finis-tu", "finit-il", "finit-elle", "finit-on", "finissons-nous", "finissez-vous", "finissent-ils", "finissent-elles", "finîmes", "finîtes", "finirent", "finissais", "finissait", "finissions", "finissiez", "finissaient", "finirai", "finiras", "finira", "finirons", "finirez", "finiront", "fini", "finisse", "finisses", "finît", "finirais", "finirait", "finirions", "finiriez", "finiraient", "finissant"];
var otherAuxiliariesInfinitive = ["avoir", "aller", "venir", "devoir", "pouvoir", "sembler", "paraître", "paraitre", "mettre", "finir"];
var copula = ["suis", "es", "est", "est-ce", "n'est", "sommes", "êtes", "sont", "suis-je", "es-tu", "est-il", "est-elle", "est-on", "sommes-nous", "êtes-vous", "sont-ils", "sont-elles", "étais", "était", "étions", "étiez", "étaient", "serai", "seras", "sera", "serons", "serez", "seront", "serais", "serait", "serions", "seriez", "seraient", "sois", "soit", "soyons", "soyez", "soient", "été"];
var copulaInfinitive = ["être"];
/*
’Excepté' not filtered because might also be participle of 'excepter', 'concernant' not filtered because might also be present participle
of 'concerner'.
Not filtered because of primary meaning: 'grâce à' ('grace'), 'en face' ('face'), 'en dehors' ('outside'), 'à côté' ('side'),
'à droite' ('right'), 'à gauche' ('left'). 'voici' already included in the locative pronoun list.
'hors' for 'hors de', 'quant' for 'quant à'. ‘travers’ is part of 'à travers.'
 */
var prepositions = ["à", "après", "au-delà", "au-dessous", "au-dessus", "avant", "avec", "concernant", "chez", "contre", "dans", "de", "depuis", "derrière", "dès", "devant", "durant", "en", "entre", "envers", "environ", "hormis", "hors", "jusque", "jusqu'à", "jusqu'au", "jusqu'aux", "loin", "moyennant", "outre", "par", "parmi", "pendant", "pour", "près", "quant", "sans", "sous", "sur", "travers", "vers", "voilà"];
var coordinatingConjunctions = ["et", "ni", "or", "ou"];
/*
Et...et, ou...ou, ni...ni – in their simple forms already in other lists. 'd'une', 'd'autre' are part of 'd'une part…d'autre part'.
'sinon' is part of 'sinon…du moins'.
*/
var correlativeConjunctions = ["non", "pas", "seulement", "sitôt", "aussitôt", "d'autre"];
/*
Many subordinating conjunctions are already included in the prepositions list, transition words list or pronominal adverbs list.
'autant', 'd'autant', 'd'ici', 'tandis' part of the complex form with 'que', 'lors' as a part of 'lors même que',
'parce' as a part of 'parce que'
 */
var subordinatingConjunctions = ["afin", "autant", "comme", "d'autant", "d'ici", "quand", "lors", "parce", "si", "tandis"];
/*
 These verbs are frequently used in interviews to indicate questions and answers.
'Dire' ('to say'), 'demander' ('to ask'), 'penser' ('to think')– 16 forms; more specific verbs – 4 forms
'affirmer', 'ajouter' ('to add'), 'analyser', 'avancer', 'écrire' ('to write'), 'indiquer', 'poursuivre' ('to pursue'), 'préciser', 'résumer',
 'souvenir' ('to remember'), 'témoigner' ('to witness') – only VS forms (due to their more general nature)
 */
var interviewVerbs = ["dit", "disent", "dit-il", "dit-elle", "disent-ils", "disent-elles", "disait", "disait-il", "disait-elle", "disaient-ils", "disaient-elles", "dirent", "demande", "demandent", "demande-t-il", "demande-t-elle", "demandent-ils", "demandent-elles", "demandait", "demandaient", "demandait-il", "demandait-elle", "demandaient-ils", "demandaient-elles", "demanda", "demanda-t-il", "demanda-t-elle", "demandé", "pense", "pensent", "pense-t-il", "pense-t-elle", "pensent-ils", "pensent-elles", "pensait", "pensaient", "pensait-il", "pensait-elle", "pensaient-ils", "pensaient-elles", "pensa", "pensa-t-il", "pensa-t-elle", "pensé", "affirme", "affirme-t-il", "affirme-t-elle", "affirmé", "avoue", "avoue-t-il", "avoue-t-elle", "avoué", "concède", "concède-t-il", "concède-t-elle", "concédé", "confie", "confie-t-il", "confie-t-elle", "confié", "continue", "continue-t-il", "continue-t-elle", "continué", "déclame", "déclame-t-il", "déclame-t-elle", "déclamé", "déclare", "déclare-t-il", "déclare-t-elle", "déclaré", "déplore", "déplore-t-il", "déplore-t-elle", "déploré", "explique", "explique-t-il", "explique-t-elle", "expliqué", "lance", "lance-t-il", "lance-t-elle", "lancé", "narre", "narre-t-il", "narre-t-elle", "narré", "raconte", "raconte-t-il", "raconte-t-elle", "raconté", "rappelle", "rappelle-t-il", "rappelle-t-elle", "rappelé", "réagit", "réagit-il", "réagit-elle", "réagi", "répond", "répond-il", "répond-elle", "répondu", "rétorque", "rétorque-t-il", "rétorque-t-elle", "rétorqué", "souligne", "souligne-t-il", "souligne-t-elle", "souligné", "affirme-t-il", "affirme-t-elle", "ajoute-t-il", "ajoute-t-elle", "analyse-t-il", "analyse-t-elle", "avance-t-il", "avance-t-elle", "écrit-il", "écrit-elle", "indique-t-il", "indique-t-elle", "poursuit-il", "poursuit-elle", "précise-t-il", "précise-t-elle", "résume-t-il", "résume-t-elle", "souvient-il", "souvient-elle", "témoigne-t-il", "témoigne-t-elle"];
var interviewVerbsInfinitive = ["dire", "penser", "demander", "concéder", "continuer", "confier", "déclamer", "déclarer", "déplorer", "expliquer", "lancer", "narrer", "raconter", "rappeler", "réagir", "répondre", "rétorquer", "souligner", "affirmer", "ajouter", "analyser", "avancer", "écrire", "indiquer", "poursuivre", "préciser", "résumer", "témoigner"];
// These transition words were not included in the list for the transition word assessment for various reasons.
var additionalTransitionWords = ["encore", "éternellement", "immédiatement", "compris", "comprenant", "inclus", "naturellement", "particulièrement", "notablement", "actuellement", "maintenant", "ordinairement", "généralement", "habituellement", "d'habitude", "vraiment", "finalement", "uniquement", "peut-être", "initialement", "déjà", "c.-à-d", "souvent", "fréquemment", "régulièrement", "simplement", "éventuellement", "quelquefois", "parfois", "probable", "plausible", "jamais", "toujours", "incidemment", "accidentellement", "récemment", "dernièrement", "relativement", "clairement", "évidemment", "apparemment", "pourvu"];
var intensifiers = ["assez", "trop", "tellement", "presque", "très", "absolument", "extrêmement", "quasi", "quasiment", "fort"];
// These verbs convey little meaning.
var delexicalizedVerbs = ["fais", "fait", "faisons", "faites", "font", "fais-je", "fait-il", "fait-elle", "fait-on", "faisons-nous", "faites-vous", "font-ils", "font-elles", "fis", "fit", "fîmes", "fîtes", "firent", "faisais", "faisait", "faisions", "faisiez", "faisaient", "ferai", "feras", "fera", "ferons", "ferez", "feront", "veux", "veut", "voulons", "voulez", "veulent", "voulus", "voulut", "voulûmes", "voulûtes", "voulurent", "voulais", "voulait", "voulions", "vouliez", "voulaient", "voudrai", "voudras", "voudra", "voudrons", "voudrez", "voudront", "voulu", "veux-je", "veux-tu", "veut-il", "veut-elle", "veut-on", "voulons-nous", "voulez-vous", "veulent-ils", "veulent-elles", "voudrais", "voudrait", "voudrions", "voudriez", "voudraient", "voulant"];
var delexicalizedVerbsInfinitive = ["faire", "vouloir"];
/* These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
 Keyword combinations containing these adjectives/adverbs are fine.
 'Dernier' is also included in generalAdjectivesAdverbsPreceding because it can be used both before and after a noun,
 and it should be filtered out either way.
 */
var generalAdjectivesAdverbs = ["antérieur", "antérieures", "antérieurs", "antérieure", "précédent", "précédents", "précédente", "précédentes", "facile", "faciles", "simple", "simples", "vite", "vites", "vitesse", "vitesses", "difficile", "difficiles", "propre", "propres", "long", "longe", "longs", "longes", "longue", "longues", "bas", "basse", "basses", "ordinaire", "ordinaires", "bref", "brefs", "brève", "brèves", "sûr", "sûrs", "sûre", "sûres", "sure", "sures", "surs", "habituel", "habituels", "habituelle", "habituelles", "soi-disant", "surtout", "récent", "récents", "récente", "récentes", "total", "totaux", "totale", "totales", "complet", "complets", "complète", "complètes", "possible", "possibles", "communément", "constamment", "facilement", "continuellement", "directement", "légèrement", "dernier", "derniers", "dernière", "dernières", "différent", "différents", "différente", "différentes", "similaire", "similaires", "pareil", "pareils", "pareille", "pareilles", "largement", "mal", "super", "bien", "pire", "pires", "suivants", "suivante", "suivantes", "prochain", "prochaine", "prochains", "prochaines", "proche", "proches", "fur"];
/*
 'Dernier' is also included in generalAdjectivesAdverbs because it can be used both before and after a noun,
 and it should be filtered out either way.
 */
var generalAdjectivesAdverbsPreceding = ["nouveau", "nouvel", "nouvelle", "nouveaux", "nouvelles", "vieux", "vieil", "vieille", "vieilles", "beau", "bel", "belle", "belles", "bon", "bons", "bonne", "bonnes", "grand", "grande", "grands", "grandes", "haut", "hauts", "haute", "hautes", "petit", "petite", "petits", "petites", "meilleur", "meilleurs", "meilleure", "meilleures", "joli", "jolis", "jolie", "jolies", "gros", "grosse", "grosses", "mauvais", "mauvaise", "mauvaises", "dernier", "derniers", "dernière", "dernières"];
var interjections = ["ah", "ha", "oh", "ho", "bis", "plouf", "vlan", "ciel", "pouf", "paf", "crac", "hurrah", "allo", "stop", "bravo", "ô", "eh", "hé", "aïe", "oef", "ahi", "fi", "zest", "hem", "holà", "chut"];
// These words and abbreviations are frequently used in recipes in lists of ingredients.
var recipeWords = ["mg", "g", "kg", "ml", "dl", "cl", "l", "grammes", "gram", "once", "onces", "oz", "lbs", "càc", "cc", "càd", "càs", "càt", "cd", "cs", "ct"];
var timeWords = ["minute", "minutes", "heure", "heures", "journée", "journées", "semaine", "semaines", "mois", "année", "années", "aujourd'hui", "demain", "hier", "après-demain", "avant-hier"];
var vagueNouns = ["chose", "choses", "façon", "façons", "pièce", "pièces", "truc", "trucs", "fois", "cas", "aspect", "aspects", "objet", "objets", "idée", "idées", "thème", "thèmes", "sujet", "sujets", "personnes", "manière", "manières", "sorte", "sortes"];
var miscellaneous = ["ne", "oui", "d'accord", "amen", "euro", "euros", "etc"];
var titlesPreceding = ["mme", "mmes", "mlle", "mlles", "mm", "dr", "pr"];
var titlesFollowing = ["jr", "sr"];
module.exports = function () {
  return {
    // These word categories are filtered at the ending of word combinations.
    filteredAtEnding: [].concat(ordinalNumerals, otherAuxiliariesInfinitive, delexicalizedVerbsInfinitive, copulaInfinitive, interviewVerbsInfinitive, generalAdjectivesAdverbsPreceding),
    // These word categories are filtered at the beginning of word combinations.
    filteredAtBeginning: generalAdjectivesAdverbs,
    // These word categories are filtered at the beginning and ending of word combinations.
    filteredAtBeginningAndEnding: [].concat(articles, prepositions, coordinatingConjunctions, demonstrativePronouns, intensifiers, quantifiers, possessivePronouns),
    // These word categories are filtered everywhere within word combinations.
    filteredAnywhere: [].concat(transitionWords, personalPronounsNominative, personalPronounsAccusative, personalPronounsStressed, reflexivePronouns, interjections, cardinalNumerals, copula, interviewVerbs, otherAuxiliaries, delexicalizedVerbs, indefinitePronouns, correlativeConjunctions, subordinatingConjunctions, interrogativeAdjectives, relativePronouns, locativeAdverbs, miscellaneous, pronominalAdverbs, recipeWords, timeWords, vagueNouns),
    // These word categories cannot directly precede a passive participle.
    cannotDirectlyPrecedePassiveParticiple: [].concat(articles, prepositions, personalPronounsStressed, personalPronounsAccusative, possessivePronouns, reflexivePronouns, indefinitePronouns, interrogativeProAdverbs, interrogativeAdjectives, cardinalNumerals, ordinalNumerals, delexicalizedVerbs, interviewVerbs, delexicalizedVerbsInfinitive),
    // These word categories cannot intervene between an auxiliary and a corresponding passive participle.
    cannotBeBetweenPassiveAuxiliaryAndParticiple: [].concat(otherAuxiliaries, otherAuxiliariesInfinitive),
    // This export contains all of the above words.
    all: [].concat(articles, cardinalNumerals, ordinalNumerals, demonstrativePronouns, possessivePronouns, reflexivePronouns, personalPronounsNominative, personalPronounsAccusative, relativePronouns, quantifiers, indefinitePronouns, interrogativeProAdverbs, pronominalAdverbs, locativeAdverbs, otherAuxiliaries, otherAuxiliariesInfinitive, interrogativeAdjectives, copula, copulaInfinitive, prepositions, coordinatingConjunctions, correlativeConjunctions, subordinatingConjunctions, interviewVerbs, interviewVerbsInfinitive, transitionWords, additionalTransitionWords, intensifiers, delexicalizedVerbs, delexicalizedVerbsInfinitive, interjections, generalAdjectivesAdverbs, generalAdjectivesAdverbsPreceding, recipeWords, vagueNouns, miscellaneous, timeWords, titlesPreceding, titlesFollowing)
  };
};



},{"./transitionWords.js":185}],185:[function(require,module,exports){
"use strict";
/** @module config/transitionWords */

var singleWords = ["ainsi", "alors", "aussi", "car", "cependant", "certainement", "certes", "conséquemment", "d'abord", "d'ailleurs", "d'après", "davantage", "désormais", "deuxièmement", "donc", "dorénavant", "effectivement", "également", "enfin", "ensuite", "entre-temps", "essentiellement", "excepté", "finalement", "globalement", "jusqu'ici", "là-dessus", "lorsque", "mais", "malgré", "néanmoins", "notamment", "partant", "plutôt", "pourtant", "précédemment", "premièrement", "probablement", "puis", "puisque", "quoique", "sauf", "selon", "semblablement", "sinon", "suivant", "toutefois", "troisièmement"];
var multipleWords = ["à cause de", "à ce jour", "à ce propos", "à ce sujet", "à cet égard", "à cette fin", "à compter de", "à condition que", "à défaut de", "à force de", "à juste titre", "à la lumière de", "à la suite de", "à l'aide de", "à l'appui de", "à l'encontre de", "à l'époque actuelle", "à l'exception de", "à l'exclusion de", "à l'heure actuelle", "à l'image de", "à l'instar de", "à l'inverse", "à l'inverse de", "à l'opposé", "à la condition que", "à mesure que", "à moins que", "à nouveau", "à partir de", "à première vue", "à savoir", "à seule fin que", "à supposer que", "à tel point que", "à tout prendre", "à vrai dire", "afin de", "afin d'attirer l'attention sur", "afin que", "ainsi donc", "ainsi que", "alors que", "antérieurement", "apès réflexion", "après cela", "après quoi", "après que", "après réflexion", "après tout", "attendu que", "au cas où", "au contraire", "au fond", "au fur et à mesure", "au lieu de", "au même temps", "au moment où", "au moyen de", "au point que", "au risque de", "au surplus", "au total", "aussi bien que", "aussitôt que", "autant que", "autrement dit", "avant que", "avant tout", "ayant fini", "bien que", "c'est à dire que", "c'est ainsi que", "c'est dans ce but que", "c'est dire", "c'est le cas de", "c'est pour cela que", "c'est la raison pour laquelle", "c'est pourquoi", "c'est qu'en effet", "c'est-à-dire", "ça confirme que", "ça montre que", "ça prouve que", "cela étant", "cela dit", "cependant que", "compte tenu", "comme l'illustre", "comme le souligne", "comme on pouvait s'y attendre", "comme quoi", "comme si", "commençons par examiner", "comparativement à", "conformément à", "contrairement à", "considérons par exemple", "d'autant plus", "d'autant que", "d'autre part", "d'ici là", "d'où", "d'un autre côté", "d'un côté", "d'une façon générale", "dans ce cas", "dans ces conditions", "dans cet esprit", "dans l'ensemble", "dans l'état actuel des choses", "dans l'éventualité où", "dans l'hypothèse où", "dans la mesure où", "dans le but de", "dans le cadre de", "dans le cas où", "dans les circonstances actuelles", "dans les grandes lignes", "dans un autre ordre d'idée", "dans un délai de", "de ce fait", "de cette façon", "de crainte que", "de façon à", "de façon à ce que", "de façon que", "de fait", "de l'autre côté", "de la même manière", "de la même façon que", "de manière que", "de même", "de même qu'à", "de même que", "de nos jours", "de peur que", "de prime abord", "de sorte que", "de surcroît", "de telle manière que", "de telle sorte que", "de toute évidence", "de toute façon", "de toute manière", "depuis que", "dès lors que", "dès maintenant", "dès qua", "dès que", "du fait que", "du moins", "du moment que", "du point de vue de", "du reste", "d'ici là", "d'ores et déjà", "en admettant que", "en attendant que", "en bref", "en cas de", "en cas que", "en ce cas", "en ce domaine", "en ce moment", "en ce qui a trait à", "en ce qui concerne", "en ce sens", "en cela", "en concequence", "en comparaison de", "en concequence", "en conclusion", "en conformité avec", "en conséquence", "en d'autres termes", "en définitive", "en dépit de", "en dernier lieu", "en deuxième lieu", "en effet", "en face de", "en fait", "en fin de compte", "en général", "en guise de conclusion", "en matière de", "en même temps que", "en outre", "en particulier", "en plus", "en premier lieu", "en principe", "en raison de", "en réalité", "en règle générale", "en résumé", "en revanche", "en second lieu", "en somme", "en sorte que", "en supposant que", "en tant que", "en terminant", "en théorie", "en tout cas", "en tout premier lieu", "en troisième lieu", "en un mot", "en vérité", "en vue que", "encore que", "encore une fois", "entre autres", "et même", "et puis", "étant donné qu'a", "étant donné qua", "étant donné que", "face à", "grâce à", "il est à noter que", "il est indéniable que", "il est question de", "il est vrai que", "il faut dire aussi que", "il faut reconnaître que", "il faut souligner que", "il ne faut pas oublier que", "il s'ensuit que", "il suffit de prendre pour exemple", "jusqu'ici", "il y a aussi", "jusqu'à ce que", "jusqu'à ce jour", "jusqu'à maintenant", "jusqu'à présent", "jusqu'au moment où", "jusqu'ici", "l'aspect le plus important de", "l'exemple le plus significatif", "jusqu'au moment où", "la preuve c'est que", "loin que", "mais en réalité", "malgré cela", "malgré tout", "même si", "mentionnons que", "mis à part le fait que", "notons que", "nul doute que", "ou bien", "outre cela", "où que", "par ailleurs", "par conséquent", "par contre", "par exception", "par exemple", "par la suite", "par l'entremise de", "par l'intermédiaire de", "par rapport à", "par suite", "par suite de", "par surcroît", "parce que", "pareillement", "partant de ce fait", "pas du tout", "pendant que", "plus précisément", "plus tard", "pour ainsi dire", "pour autant que", "pour ce qui est de", "pour ces motifs", "pour ces raisons", "pour cette raison", "pour commencer", "pour conclure", "pour le moment", "pour marquer la causalité", "pour l'instant", "pour peu que", "pour prendre un autre exemple", "pour que", "pour résumé", "pour terminer", "pour tout dire", "pour toutes ces raisons", "pourvu que", "prenons le cas de", "quand bien même que", "quand même", "quant à", "quel que soit", "qui plus est", "qui que", "quitte à", "quoi qu'il en soit", "quoi que", "quoiqu'il en soit", "sans délai", "sans doute", "sans parler de", "sans préjuger", "sans tarder", "sauf si", "selon que", "si bien que", "si ce n'est que", "si l'on songe que", "sitôt que", "somme toute", "sous cette réserve", "sous prétexte que", "sous réserve de", "sous réserve que", "suivant que", "supposé que", "sur le plan de", "tandis que", "tant et si bien que", "tant que", "tel que", "tellement que", "touchant à", "tout à fait", "tout bien pesé", "tout compte fait", "tout d'abord", "tout d'abord examinons", "tout d'abord il faut dire que", "tout de même", "tout en reconnaissant que", "une fois de plus", "vu que"];
/**
 * Returns an list with transition words to be used by the assessments.
 * @returns {Object} The list filled with transition word lists.
 */
module.exports = function () {
    return {
        singleWords: singleWords,
        multipleWords: multipleWords,
        allWords: singleWords.concat(multipleWords)
    };
};



},{}],186:[function(require,module,exports){
"use strict";

var filteredPassiveAuxiliaries = require("./passiveVoice/auxiliaries.js")().filteredAuxiliaries;
var passiveAuxiliariesInfinitive = require("./passiveVoice/auxiliaries.js")().infinitiveAuxiliaries;
var transitionWords = require("./transitionWords.js")().singleWords;
/**
 * Returns an object with exceptions for the prominent words researcher
 * @returns {Object} The object filled with exception arrays.
 */
var articles = ["das", "dem", "den", "der", "des", "die", "ein", "eine", "einem", "einen", "einer", "eines"];
var cardinalNumerals = ["eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf", "zwoelf", "dreizehn", "vierzehn", "fünfzehn", "fuenfzehn", "sechzehn", "siebzehn", "achtzehn", "neunzehn", "zwanzig", "hundert", "einhundert", "zweihundert", "dreihundert", "vierhundert", "fünfhundert", "fuenfhundert", "sechshundert", "siebenhundert", "achthundert", "neunhundert", "tausend", "million", "milliarde", "billion", "billiarde"];
var ordinalNumerals = ["erste", "erster", "ersten", "erstem", "erstes", "zweite", "zweites", "zweiter", "zweitem", "zweiten", "dritte", "dritter", "drittes", "dritten", "drittem", "vierter", "vierten", "viertem", "viertes", "vierte", "fünfte", "fünfter", "fünftes", "fünften", "fünftem", "fuenfte", "fuenfter", "fuenftem", "fuenften", "fuenftes", "sechste", "sechster", "sechstes", "sechsten", "sechstem", "siebte", "siebter", "siebten", "siebtem", "siebtes", "achte", "achter", "achten", "achtem", "achtes", "neunte", "neunter", "neuntes", "neunten", "neuntem", "zehnte", "zehnter", "zehnten", "zehntem", "zehntes", "elfte", "elfter", "elftes", "elften", "elftem", "zwölfte", "zwölfter", "zwölften", "zwölftem", "zwölftes", "zwoelfte", "zwoelfter", "zwoelften", "zwoelftem", "zwoelftes", "dreizehnte", "dreizehnter", "dreizehntes", "dreizehnten", "dreizehntem", "vierzehnte", "vierzehnter", "vierzehntes", "vierzehnten", "vierzehntem", "fünfzehnte", "fünfzehnten", "fünfzehntem", "fünfzehnter", "fünfzehntes", "fuenfzehnte", "fuenfzehnten", "fuenfzehntem", "fuenfzehnter", "fuenfzehntes", "sechzehnte", "sechzehnter", "sechzehnten", "sechzehntes", "sechzehntem", "siebzehnte", "siebzehnter", "siebzehntes", "siebzehntem", "siebzehnten", "achtzehnter", "achtzehnten", "achtzehntem", "achtzehntes", "achtzehnte", "nehnzehnte", "nehnzehnter", "nehnzehntem", "nehnzehnten", "nehnzehntes", "zwanzigste", "zwanzigster", "zwanzigstem", "zwanzigsten", "zwanzigstes"];
var personalPronounsNominative = ["ich", "du", "er", "sie", "es", "wir", "ihr"];
var personalPronounsAccusative = ["mich", "dich", "ihn", "uns", "euch"];
var personalPronounsDative = ["mir", "dir", "ihm", "ihnen"];
var demonstrativePronouns = ["denen", "deren", "derer", "dessen", "diese", "diesem", "diesen", "dieser", "dieses", "jene", "jenem", "jenen", "jener", "jenes", "welch", "welcher", "welches", "derjenige", "desjenigen", "demjenigen", "denjenigen", "diejenige", "derjenigen", "dasjenige", "diejenigen"];
var possessivePronouns = ["mein", "meine", "meinem", "meiner", "meines", "meinen", "dein", "deine", "deinem", "deiner", "deines", "deinen", "sein", "seine", "seinem", "seiner", "seines", "ihre", "ihrem", "ihren", "ihrer", "ihres", "unser", "unsere", "unserem", "unseren", "unserer", "unseres", "euer", "eure", "eurem", "euren", "eurer", "eures", "einanders"];
var quantifiers = ["manche", "manch", "viele", "viel", "vieler", "vielen", "vielem", "all", "alle", "aller", "alles", "allen", "allem", "allerlei", "solcherlei", "einige", "etliche", "wenige", "weniger", "wenigen", "wenigem", "weniges", "wenig", "wenigerer", "wenigeren", "wenigerem", "wenigere", "wenigeres", "wenig", "bisschen", "paar", "kein", "keines", "keinem", "keinen", "keine", "mehr", "genug", "mehrere", "mehrerer", "mehreren", "mehrerem", "mehreres", "verschiedene", "verschiedener", "verschiedenen", "verschiedenem", "verschiedenes", "verschiedne", "verschiedner", "verschiednen", "verschiednem", "verschiednes", "art", "arten", "sorte", "sorten"];
var reflexivePronouns = ["sich"];
var reciprocalPronouns = ["einander"];
// "Welch", "welcher", and "welches" are already included in the demonstrativePronouns.
var indefinitePronouns = ["andere", "anderer", "anderem", "anderen", "anderes", "andren", "andern", "andrem", "anderm", "andre", "andrer", "andres", "beide", "beides", "beidem", "beider", "beiden", "etwas", "irgendetwas", "irgendein", "irgendeinen", "irgendeinem", "irgendeines", "irgendeine", "irgendeiner", "irgendwas", "irgendwessen", "irgendwer", "irgendwen", "irgendwem", "irgendwelche", "irgendwelcher", "irgendwelchem", "irgendwelchen", "irgendwelches", "irgendjemand", "irgendjemanden", "irgendjemandem", "irgendjemandes", "irgendwie", "wer", "wen", "wem", "wessen", "was", "welchen", "welchem", "welche", "jeder", "jedes", "jedem", "jeden", "jede", "jedweder", "jedweden", "jedwedem", "jedwedes", "jedwede", "jeglicher", "jeglichen", "jeglichem", "jegliches", "jegliche", "jedermann", "jedermanns", "jemand", "jemanden", "jemandem", "jemands", "jemandes", "man", "meinesgleichen", "sämtlich", "saemtlich", "sämtlicher", "saemtlicher", "sämtlichen", "saemtlichen", "sämtlichem", "saemtlichem", "sämtliches", "saemtliches", "sämtliche", "saemtliche", "solche", "solcher", "solchen", "solchem", "solches", "niemand", "niemanden", "niemandem", "niemandes", "niemands", "nichts", "zweiter"];
var interrogativeProAdverbs = ["warum", "wie", "wo", "woher", "wohin", "wann"];
var pronominalAdverbs = ["dahinter", "damit", "daneben", "daran", "daraus", "darin", "darunter", "darüber", "darueber", "davon", "dazwischen", "hieran", "hierauf", "hieraus", "hierbei", "hierfuer", "hierfür", "hiergegen", "hierhinter", "hierin", "hiermit", "hiernach", "hierum", "hierunter", "hierueber", "hierüber", "hiervor", "hierzwischen", "hierneben", "hiervon", "wodurch", "wofür", "wofuer", "wogegen", "wohinter", "womit", "wonach", "woneben", "woran", "worauf", "woraus", "worin", "worum", "worunter", "worüber", "worueber", "wovon", "wovor", "wozu", "wozwischen"];
var locativeAdverbs = ["hier", "dorthin", "hierher", "dorther"];
var adverbialGenitives = ["allenfalls", "keinesfalls", "anderenfalls", "andernfalls", "andrenfalls", "äußerstenfalls", "bejahendenfalls", "bestenfalls", "eintretendenfalls", "entgegengesetztenfalls", "erforderlichenfalls", "gegebenenfalls", "geringstenfalls", "gleichfalls", "günstigenfalls", "günstigstenfalls", "höchstenfalls", "möglichenfalls", "notfalls", "nötigenfalls", "notwendigenfalls", "schlimmstenfalls", "vorkommendenfalls", "zutreffendenfalls", "keineswegs", "durchwegs", "geradenwegs", "geradeswegs", "geradewegs", "gradenwegs", "halbwegs", "mittwegs", "unterwegs"];
var otherAuxiliaries = ["habe", "hast", "hat", "habt", "habest", "habet", "hatte", "hattest", "hatten", "hätte", "haette", "hättest", "haettest", "hätten", "haetten", "haettet", "hättet", "hab", "bin", "bist", "ist", "sind", "sei", "seiest", "seien", "seiet", "war", "warst", "waren", "wart", "wäre", "waere", "wärest", "waerest", "wärst", "waerst", "wären", "waeren", "wäret", "waeret", "wärt", "waert", "seid", "darf", "darfst", "dürft", "duerft", "dürfe", "duerfe", "dürfest", "duerfest", "dürfet", "duerfet", "durfte", "durftest", "durften", "durftet", "dürfte", "duerfte", "dürftest", "duerftest", "dürften", "duerften", "dürftet", "duerftet", "kann", "kannst", "könnt", "koennt", "könne", "koenne", "könnest", "koennest", "könnet", "koennet", "konnte", "konntest", "konnten", "konntet", "könnte", "koennte", "könntest", "koenntest", "könnten", "koennten", "könntet", "koenntet", "mag", "magst", "mögt", "moegt", "möge", "moege", "mögest", "moegest", "möget", "moeget", "mochte", "mochtest", "mochten", "mochtet", "möchte", "moechte", "möchtest", "moechtest", "möchten", "moechten", "möchtet", "moechtet", "muss", "muß", "musst", "mußt", "müsst", "muesst", "müßt", "mueßt", "müsse", "muesse", "müssest", "muessest", "müsset", "muesset", "musste", "mußte", "musstest", "mußtest", "mussten", "mußten", "musstet", "mußtet", "müsste", "muesste", "müßte", "mueßte", "müsstest", "muesstest", "müßtest", "mueßtest", "müssten", "muessten", "müßten", "mueßten", "müsstet", "muesstet", "müßtet", "mueßtet", "soll", "sollst", "sollt", "solle", "sollest", "sollet", "sollte", "solltest", "sollten", "solltet", "will", "willst", "wollt", "wolle", "wollest", "wollet", "wollte", "wolltest", "wollten", "wolltet", "lasse", "lässt", "laesst", "läßt", "laeßt", "lasst", "laßt", "lassest", "lasset", "ließ", "ließest", "ließt", "ließen", "ließe", "ließet", "liess", "liessest", "liesst", "liessen", "liesse", "liesset"];
var otherAuxiliariesInfinitive = ["haben", "dürfen", "duerfen", "können", "koennen", "mögen", "moegen", "müssen", "muessen", "sollen", "wollen", "lassen"];
// Forms from 'aussehen' with two parts, like 'sehe aus', are not included, because we remove words on an single word basis.
var copula = ["bleibe", "bleibst", "bleibt", "bleibest", "bleibet", "blieb", "bliebst", "bliebt", "blieben", "bliebe", "bliebest", "bliebet", "heiße", "heißt", "heißest", "heißet", "heisse", "heisst", "heissest", "heisset", "hieß", "hießest", "hießt", "hießen", "hieße", "hießet", "hiess", "hiessest", "hiesst", "hiessen", "hiesse", "hiesset", "giltst", "gilt", "geltet", "gelte", "geltest", "galt", "galtest", "galtst", "galten", "galtet", "gälte", "gaelte", "gölte", "goelte", "gältest", "gaeltest", "göltest", "goeltest", "gälten", "gaelten", "gölten", "goelten", "gältet", "gaeltet", "göltet", "goeltet", "aussehe", "aussiehst", "aussieht", "ausseht", "aussehest", "aussehet", "aussah", "aussahst", "aussahen", "aussaht", "aussähe", "aussaehe", "aussähest", "aussaehest", "aussähst", "aussaehst", "aussähet", "aussaehet", "aussäht", "aussaeht", "aussähen", "aussaehen", "scheine", "scheinst", "scheint", "scheinest", "scheinet", "schien", "schienst", "schienen", "schient", "schiene", "schienest", "schienet", "erscheine", "erscheinst", "erscheint", "erscheinest", "erscheinet", "erschien", "erschienst", "erschienen", "erschient", "erschiene", "erschienest", "erschienet"];
var copulaInfinitive = ["bleiben", "heißen", "heissen", "gelten", "aussehen", "scheinen", "erscheinen"];
var prepositions = ["a", "à", "ab", "abseits", "abzüglich", "abzueglich", "als", "am", "an", "angelegentlich", "angesichts", "anhand", "anlässlich", "anlaesslich", "ans", "anstatt", "anstelle", "auf", "aufs", "aufseiten", "aus", "ausgangs", "ausschließlich", "ausschliesslich", "außerhalb", "ausserhalb", "ausweislich", "bar", "behufs", "bei", "beidseits", "beiderseits", "beim", "betreffs", "bezüglich", "bezueglich", "binnen", "bis", "contra", "dank", "diesseits", "durch", "einbezüglich", "einbezueglich", "eingangs", "eingedenk", "einschließlich", "einschliesslich", "entgegen", "entlang", "exklusive", "fern", "fernab", "fuer", "für", "fuers", "fürs", "gegen", "gegenüber", "gegenueber", "gelegentlich", "gemäß", "gemaeß", "gen", "getreu", "gleich", "halber", "hinsichtlich", "hinter", "hinterm", "hinters", "im", "in", "inklusive", "inmitten", "innerhalb", "innert", "ins", "je", "jenseits", "kontra", "kraft", "längs", "laengs", "längsseits", "laengsseits", "laut", "links", "mangels", "minus", "mit", "mithilfe", "mitsamt", "mittels", "nach", "nächst", "naechst", "nah", "namens", "neben", "nebst", "nördlich", "noerdlich", "nordöstlich", "nordoestlich", "nordwestlich", "oberhalb", "ohne", "östlich", "oestlich", "per", "plus", "pro", "quer", "rechts", "rücksichtlich", "ruecksichtlich", "samt", "seitens", "seitlich", "seitwärts", "seitwaerts", "südlich", "suedlich", "südöstlich", "suedoestlich", "südwestlich", "suedwestlich", "über", "ueber", "überm", "ueberm", "übern", "uebern", "übers", "uebers", "um", "ums", "unbeschadet", "unerachtet", "unfern", "unter", "unterhalb", "unterm", "untern", "unters", "unweit", "vermittels", "vermittelst", "vermöge", "vermoege", "via", "vom", "von", "vonseiten", "vor", "vorbehaltlich", "wegen", "wider", "zeit", "zu", "zugunsten", "zulieb", "zuliebe", "zum", "zur", "zusätzlich", "zusaetzlich", "zuungunsten", "zuwider", "zuzüglich", "zuzueglich", "zwecks", "zwischen"];
// Many coordinating conjunctions are already included in the transition words list.
var coordinatingConjunctions = ["und", "oder", "umso"];
// 'noch' is part of 'weder...noch', 'nur' is part of 'nicht nur...sondern auch'.
var correlativeConjunctions = ["auch", "noch", "nur"];
// Many subordinating conjunctions are already included in the prepositions list, transition words list or pronominal adverbs list.
var subordinatingConjunctions = ["nun", "so", "gleichwohl"];
/*
These verbs are frequently used in interviews to indicate questions and answers. 'Frage' and 'fragen' are not included,
because those words are also nouns.
 */
var interviewVerbs = ["sage", "sagst", "sagt", "sagest", "saget", "sagte", "sagtest", "sagten", "sagtet", "gesagt", "fragst", "fragt", "fragest", "fraget", "fragte", "fragtest", "fragten", "fragtet", "gefragt", "erkläre", "erklärst", "erklärt", "erklaere", "erklaerst", "erklaert", "erklärte", "erklärtest", "erklärtet", "erklärten", "erklaerte", "erklaertest", "erklaertet", "erklaerten", "denke", "denkst", "denkt", "denkest", "denket", "dachte", "dachtest", "dachten", "dachtet", "dächte", "dächtest", "dächten", "dächtet", "daechte", "daechtest", "daechten", "daechtet", "finde", "findest", "findet", "gefunden"];
var interviewVerbsInfinitive = ["sagen", "erklären", "erklaeren", "denken", "finden"];
// These transition words were not included in the list for the transition word assessment for various reasons.
var additionalTransitionWords = ["etwa", "absolut", "unbedingt", "wieder", "definitiv", "bestimmt", "immer", "äußerst", "aeußerst", "höchst", "hoechst", "sofort", "augenblicklich", "umgehend", "direkt", "unmittelbar", "nämlich", "naemlich", "natürlich", "natuerlich", "besonders", "hauptsächlich", "hauptsaechlich", "jetzt", "eben", "heutzutage", "eindeutig", "wirklich", "echt", "wahrhaft", "ehrlich", "aufrichtig", "wahrheitsgemäß", "letztlich", "einmalig", "unübertrefflich", "normalerweise", "gewöhnlich", "gewoehnlich", "üblicherweise", "ueblicherweise", "sonst", "fast", "nahezu", "beinahe", "knapp", "annähernd", "annaehernd", "geradezu", "bald", "vielleicht", "wahrscheinlich", "wohl", "voraussichtlich", "zugegeben", "ursprünglich", "insgesamt", "tatsächlich", "eigentlich", "wahrhaftig", "bereits", "schon", "oft", "häufig", "haeufig", "regelmäßig", "regelmaeßig", "gleichmäßig", "gleichmaeßig", "einfach", "lediglich", "bloß", "bloss", "halt", "wahlweise", "eventuell", "manchmal", "teilweise", "nie", "niemals", "nimmer", "jemals", "allzeit", "irgendeinmal", "anders", "momentan", "gegenwärtig", "gegenwaertig", "nebenbei", "anderswo", "woanders", "anderswohin", "anderorts", "insbesondere", "namentlich", "sonderlich", "ausdrücklich", "ausdruecklich", "vollends", "kürzlich", "kuerzlich", "jüngst", "juengst", "unlängst", "unlaengst", "neuerdings", "neulich", "letztens", "neuerlich", "verhältnismäßig", "verhaeltnismaessig", "deutlich", "klar", "offenbar", "anscheinend", "genau", "u.a", "damals", "zumindest"];
var intensifiers = ["sehr", "recht", "überaus", "ueberaus", "ungemein", "weitaus", "einigermaßen", "einigermassen", "ganz", "schwer", "tierisch", "ungleich", "ziemlich", "übelst", "uebelst", "stark", "volkommen", "durchaus", "gar"];
// These verbs convey little meaning.
var delexicalizedVerbs = ["geschienen", "meinst", "meint", "meinest", "meinet", "meinte", "meintest", "meinten", "meintet", "gemeint", "stehe", "stehst", "steht", "gehe", "gehst", "geht", "gegangen", "ging", "gingst", "gingen", "gingt"];
var delexicalizedVerbsInfinitive = ["tun", "machen", "stehen", "wissen", "gehen", "kommen"];
// These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
// Keyword combinations containing these adjectives/adverbs are fine.
var generalAdjectivesAdverbs = ["einerlei", "egal", "neu", "neue", "neuer", "neuen", "neues", "neuem", "neuerer", "neueren", "neuerem", "neueres", "neuere", "neuester", "neuster", "neuesten", "neusten", "neuestem", "neustem", "neuestes", "neustes", "neueste", "neuste", "alt", "alter", "alten", "altem", "altes", "alte", "ältere", "älteren", "älterer", "älteres", "ältester", "ältesten", "ältestem", "ältestes", "älteste", "aeltere", "aelteren", "aelterer", "aelteres", "aeltester", "aeltesten", "aeltestem", "aeltestes", "aelteste", "gut", "guter", "gutem", "guten", "gutes", "gute", "besser", "besserer", "besseren", "besserem", "besseres", "bester", "besten", "bestem", "bestes", "beste", "größte", "grösste", "groß", "großer", "großen", "großem", "großes", "große", "großerer", "großerem", "großeren", "großeres", "großere", "großter", "großten", "großtem", "großtes", "großte", "gross", "grosser", "grossen", "grossem", "grosses", "grosse", "grosserer", "grosserem", "grosseren", "grosseres", "grossere", "grosster", "grossten", "grosstem", "grosstes", "grosste", "einfacher", "einfachen", "einfachem", "einfaches", "einfache", "einfacherer", "einfacheren", "einfacherem", "einfacheres", "einfachere", "einfachste", "einfachster", "einfachsten", "einfachstes", "einfachstem", "schnell", "schneller", "schnellen", "schnellem", "schnelles", "schnelle", "schnellere", "schnellerer", "schnelleren", "schnelleres", "schnellerem", "schnellster", "schnellste", "schnellsten", "schnellstem", "schnellstes", "weit", "weiten", "weitem", "weites", "weiterer", "weiteren", "weiterem", "weiteres", "weitere", "weitester", "weitesten", "weitestem", "weitestes", "weiteste", "eigen", "eigener", "eigenen", "eigenes", "eigenem", "eigene", "eigenerer", "eignerer", "eigeneren", "eigneren", "eigenerem", "eignerem", "eigeneres", "eigneres", "eigenere", "eignere", "eigenster", "eigensten", "eigenstem", "eigenstes", "eigenste", "wenigster", "wenigsten", "wenigstem", "wenigstes", "wenigste", "minderer", "minderen", "minderem", "mindere", "minderes", "mindester", "mindesten", "mindestes", "mindestem", "mindeste", "lang", "langer", "langen", "langem", "langes", "längerer", "längeren", "längerem", "längeres", "längere", "längster", "längsten", "längstem", "längstes", "längste", "laengerer", "laengeren", "laengerem", "laengeres", "laengere", "laengster", "laengsten", "laengstem", "laengstes", "laengste", "tief", "tiefer", "tiefen", "tiefem", "tiefes", "tiefe", "tieferer", "tieferen", "tieferem", "tieferes", "tiefere", "tiefster", "tiefsten", "tiefstem", "tiefste", "tiefstes", "hoch", "hoher", "hohen", "hohem", "hohes", "hohe", "höherer", "höhere", "höheren", "höherem", "höheres", "hoeherer", "hoehere", "hoeheren", "hoeherem", "hoeheres", "höchster", "höchste", "höchsten", "höchstem", "höchstes", "hoechster", "hoechste", "hoechsten", "hoechstem", "hoechstes", "regulär", "regulärer", "regulären", "regulärem", "reguläres", "reguläre", "regulaer", "regulaerer", "regulaeren", "regulaerem", "regulaeres", "regulaere", "regulärerer", "reguläreren", "regulärerem", "reguläreres", "regulärere", "regulaererer", "regulaereren", "regulaererem", "regulaereres", "regulaerere", "regulärster", "regulärsten", "regulärstem", "regulärstes", "regulärste", "regulaerster", "regulaersten", "regulaerstem", "regulaerstes", "regulaerste", "normal", "normaler", "normalen", "normalem", "normales", "normale", "normalerer", "normaleren", "normalerem", "normaleres", "normalere", "normalster", "normalsten", "normalstem", "normalstes", "normalste", "klein", "kleiner", "kleinen", "kleinem", "kleines", "kleine", "kleinerer", "kleineres", "kleineren", "kleinerem", "kleinere", "kleinster", "kleinsten", "kleinstem", "kleinstes", "kleinste", "winzig", "winziger", "winzigen", "winzigem", "winziges", "winzigerer", "winzigeren", "winzigerem", "winzigeres", "winzigere", "winzigster", "winzigsten", "winzigstem", "winzigste", "winzigstes", "sogenannt", "sogenannter", "sogenannten", "sogenanntem", "sogenanntes", "sogenannte", "kurz", "kurzer", "kurzen", "kurzem", "kurzes", "kurze", "kürzerer", "kürzeres", "kürzeren", "kürzerem", "kürzere", "kuerzerer", "kuerzeres", "kuerzeren", "kuerzerem", "kuerzere", "kürzester", "kürzesten", "kürzestem", "kürzestes", "kürzeste", "kuerzester", "kuerzesten", "kuerzestem", "kuerzestes", "kuerzeste", "wirklicher", "wirklichen", "wirklichem", "wirkliches", "wirkliche", "wirklicherer", "wirklicheren", "wirklicherem", "wirklicheres", "wirklichere", "wirklichster", "wirklichsten", "wirklichstes", "wirklichstem", "wirklichste", "eigentlicher", "eigentlichen", "eigentlichem", "eigentliches", "eigentliche", "schön", "schöner", "schönen", "schönem", "schönes", "schöne", "schönerer", "schöneren", "schönerem", "schöneres", "schönere", "schönster", "schönsten", "schönstem", "schönstes", "schönste", "real", "realer", "realen", "realem", "reales", "realerer", "realeren", "realerem", "realeres", "realere", "realster", "realsten", "realstem", "realstes", "realste", "derselbe", "denselben", "demselben", "desselben", "dasselbe", "dieselbe", "derselben", "dieselben", "gleicher", "gleichen", "gleichem", "gleiches", "gleiche", "gleicherer", "gleicheren", "gleicherem", "gleicheres", "gleichere", "gleichster", "gleichsten", "gleichstem", "gleichstes", "gleichste", "bestimmter", "bestimmten", "bestimmtem", "bestimmtes", "bestimmte", "bestimmtere", "bestimmterer", "bestimmterem", "bestimmteren", "bestimmteres", "bestimmtester", "bestimmtesten", "bestimmtestem", "bestimmtestes", "bestimmteste", "überwiegend", "ueberwiegend", "zumeist", "meistens", "meisten", "großenteils", "grossenteils", "meistenteils", "weithin", "ständig", "staendig", "laufend", "dauernd", "andauernd", "immerfort", "irgendwo", "irgendwann", "ähnlicher", "ähnlichen", "ähnlichem", "ähnliches", "ähnliche", "ähnlich", "ähnlicherer", "ähnlicheren", "ähnlicherem", "ähnlicheres", "ähnlichere", "ähnlichster", "ähnlichsten", "ähnlichstem", "ähnlichstes", "ähnlichste", "schlecht", "schlechter", "schlechten", "schlechtem", "schlechtes", "schlechte", "schlechterer", "schlechteren", "schlechterem", "schlechteres", "schlechtere", "schlechtester", "schlechtesten", "schlechtestem", "schlechtestes", "schlechteste", "schlimm", "schlimmer", "schlimmen", "schlimmem", "schlimmes", "schlimme", "schlimmerer", "schlimmeren", "schlimmerem", "schlimmeres", "schlimmere", "schlimmster", "schlimmsten", "schlimmstem", "schlimmstes", "schlimmste", "toll", "toller", "tollen", "tollem", "tolles", "tolle", "tollerer", "tolleren", "tollerem", "tollere", "tolleres", "tollster", "tollsten", "tollstem", "tollstes", "tollste", "super", "mögliche", "möglicher", "mögliches", "möglichen", "möglichem", "möglich", "moegliche", "moeglicher", "moegliches", "moeglichen", "moeglichem", "moeglich", "nächsten", "naechsten", "voll", "voller", "vollen", "vollem", "volle", "volles", "vollerer", "volleren", "vollerem", "vollere", "volleres", "vollster", "vollsten", "vollstem", "vollste", "vollstes", "außen", "ganzer", "ganzen", "ganzem", "ganze", "ganzes", "gerne", "oben", "unten", "zurück", "zurueck", "nicht"];
var interjections = ["ach", "aha", "oh", "au", "bäh", "baeh", "igitt", "huch", "hurra", "hoppla", "nanu", "oha", "olala", "pfui", "tja", "uups", "wow", "grr", "äh", "aeh", "ähm", "aehm", "öhm", "oehm", "hm", "mei", "mhm", "okay", "richtig", "eijeijeijei"];
// These words and abbreviations are frequently used in recipes in lists of ingredients.
var recipeWords = ["g", "el", "tl", "wg", "be", "bd", "cl", "dl", "dag", "do", "gl", "gr", "kg", "kl", "cb", "ccm", "l", "ms", "mg", "ml", "mi", "pk", "pr", "pp", "sc", "sp", "st", "sk", "ta", "tr", "cm", "mass"];
var timeWords = ["sekunde", "sekunden", "minute", "minuten", "stunde", "stunden", "uhr", "tag", "tages", "tags", "tage", "tagen", "woche", "wochen", "monat", "monate", "monates", "monats", "monaten", "jahr", "jahres", "jahrs", "jahre", "jahren", "morgens", "mittags", "abends", "nachts", "heute", "gestern", "morgen", "vorgestern", "übermorgen", "uebermorgen"];
var vagueNouns = ["ding", "dinge", "dinges", "dinger", "dingern", "dingen", "sache", "sachen", "weise", "weisen", "wahrscheinlichkeit", "zeug", "zeuge", "zeuges", "zeugen", "mal", "einmal", "teil", "teile", "teiles", "teilen", "prozent", "prozents", "prozentes", "prozente", "prozenten", "beispiel", "beispiele", "beispieles", "beispiels", "beispielen", "aspekt", "aspekte", "aspektes", "aspekts", "aspekten", "idee", "ideen", "ahnung", "ahnungen", "thema", "themas", "themata", "themen", "fall", "falle", "falles", "fälle", "fällen", "faelle", "faellen", "mensch", "menschen", "leute"];
var miscellaneous = ["nix", "nixe", "nixes", "nixen", "usw.", "amen", "ja", "nein", "euro"];
var titlesPreceding = ["fr", "hr", "dr", "prof"];
var titlesFollowing = ["jr", "jun", "sen", "sr"];
module.exports = function () {
    return {
        // These word categories are filtered at the beginning of word combinations.
        filteredAtBeginning: [].concat(otherAuxiliariesInfinitive, passiveAuxiliariesInfinitive, delexicalizedVerbsInfinitive, copulaInfinitive, interviewVerbsInfinitive),
        // These word categories are filtered at the ending of word combinations.
        filteredAtEnding: [].concat(ordinalNumerals, generalAdjectivesAdverbs),
        // These word categories are filtered at the beginning and ending of word combinations.
        filteredAtBeginningAndEnding: [].concat(articles, prepositions, coordinatingConjunctions, demonstrativePronouns, intensifiers, quantifiers),
        // These word categories are filtered everywhere within word combinations.
        filteredAnywhere: [].concat(transitionWords, adverbialGenitives, personalPronounsNominative, personalPronounsAccusative, personalPronounsDative, reflexivePronouns, interjections, cardinalNumerals, copula, interviewVerbs, otherAuxiliaries, filteredPassiveAuxiliaries, delexicalizedVerbs, indefinitePronouns, correlativeConjunctions, subordinatingConjunctions, interrogativeProAdverbs, locativeAdverbs, miscellaneous, pronominalAdverbs, recipeWords, timeWords, vagueNouns, reciprocalPronouns, possessivePronouns),
        // This export contains all of the above words.
        all: [].concat(articles, cardinalNumerals, ordinalNumerals, demonstrativePronouns, possessivePronouns, reflexivePronouns, reciprocalPronouns, personalPronounsNominative, personalPronounsAccusative, quantifiers, indefinitePronouns, interrogativeProAdverbs, pronominalAdverbs, locativeAdverbs, adverbialGenitives, filteredPassiveAuxiliaries, passiveAuxiliariesInfinitive, otherAuxiliaries, otherAuxiliariesInfinitive, copula, copulaInfinitive, prepositions, coordinatingConjunctions, correlativeConjunctions, subordinatingConjunctions, interviewVerbs, interviewVerbsInfinitive, transitionWords, additionalTransitionWords, intensifiers, delexicalizedVerbs, delexicalizedVerbsInfinitive, interjections, generalAdjectivesAdverbs, recipeWords, vagueNouns, miscellaneous, timeWords, titlesPreceding, titlesFollowing)
    };
};



},{"./passiveVoice/auxiliaries.js":187,"./transitionWords.js":188}],187:[function(require,module,exports){
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



},{}],188:[function(require,module,exports){
"use strict";
/** @module config/transitionWords */

var singleWords = ["aber", "abschließend", "abschliessend", "alldieweil", "allerdings", "also", "anderenteils", "andererseits", "andernteils", "anfaenglich", "anfänglich", "anfangs", "angenommen", "anschliessend", "anschließend", "aufgrund", "ausgenommen", "ausserdem", "außerdem", "beispielsweise", "bevor", "beziehungsweise", "bspw", "bzw", "d.h", "da", "dabei", "dadurch", "dafuer", "dafür", "dagegen", "daher", "dahingegen", "danach", "dann", "darauf", "darum", "dass", "davor", "dazu", "dementgegen", "dementsprechend", "demgegenüber", "demgegenueber", "demgemaess", "demgemäß", "demzufolge", "denn", "dennoch", "dergestalt", "desto", "deshalb", "desungeachtet", "deswegen", "doch", "dort", "drittens", "ebenfalls", "ebenso", "endlich", "ehe", "einerseits", "einesteils", "entsprechend", "entweder", "erst", "erstens", "falls", "ferner", "folgerichtig", "folglich", "fürderhin", "fuerderhin", "genauso", "hierdurch", "hierzu", "hingegen", "immerhin", "indem", "indes", "indessen", "infolge", "infolgedessen", "insofern", "insoweit", "inzwischen", "jedenfalls", "jedoch", "kurzum", "m.a.w", "mitnichten", "mitunter", "möglicherweise", "moeglicherweise", "nachdem", "nebenher", "nichtsdestotrotz", "nichtsdestoweniger", "ob", "obenrein", "obgleich", "obschon", "obwohl", "obzwar", "ohnehin", "richtigerweise", "schliesslich", "schließlich", "seit", "seitdem", "sobald", "sodass", "so dass", "sofern", "sogar", "solang", "solange", "somit", "sondern", "sooft", "soviel", "soweit", "sowie", "sowohl", "statt", "stattdessen", "trotz", "trotzdem", "überdies", "übrigens", "ueberdies", "uebrigens", "ungeachtet", "vielmehr", "vorausgesetzt", "vorher", "waehrend", "während", "währenddessen", "waehrenddessen", "weder", "wegen", "weil", "weiter", "weiterhin", "wenn", "wenngleich", "wennschon", "wennzwar", "weshalb", "widrigenfalls", "wiewohl", "wobei", "wohingegen", "z.b", "zudem", "zuerst", "zufolge", "zuletzt", "zumal", "zuvor", "zwar", "zweitens"];
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



},{}],189:[function(require,module,exports){
"use strict";

var transitionWords = require("./transitionWords.js")().singleWords;
/**
 * Returns an object with exceptions for the prominent words researcher.
 * @returns {Object} The object filled with exception arrays.
 */
var articles = ["il", "i", "la", "le", "lo", "gli", "un", "uno", "una"];
var cardinalNumerals = ["due", "tre", "quattro", "cinque", "sette", "otto", "nove", "dieci", "undici", "dodici", "tredici", "quattordici", "quindici", "sedici", "diciassette", "diciotto", "diciannove", "venti", "cento", "mille", "mila", "duemila", "tremila", "quattromila", "cinquemila", "seimila", "settemila", "ottomila", "novemila", "diecimila", "milione", "milioni", "miliardo", "miliardi"];
var ordinalNumerals = ["prima", "primi", "prime", "secondo", "seconda", "secondi", "seconde", "terzo", "terza", "terzi", "terze", "quarto", "quarta", "quarti", "quarte", "quinto", "quinta", "quinti", "quinte", "sesto", "sesta", "sesti", "seste", "settimo", "settima", "settimi", "settime", "ottavo", "ottava", "ottavi", "ottave", "nono", "nona", "noni", "none", "decimo", "decima", "decimi", "decime", "undicesimo", "undicesima", "undicesimi", "undicesime", "dodicesimo", "dodicesima", "dodicesimi", "dodicesime", "tredicesimo", "tredicesima", "tredicesimi", "tredicesime", "quattordicesimo", "quattordicesima", "quattordicesimi", "quattordicesime", "quindicesimo", "quindicesima", "quindicesimi", "quindicesime", "sedicesimo", "sedicesima", "sedicesimi", "sedicesime", "diciassettesimo", "diciassettesima", "diciassettesimi", "diciassettesime", "diciannovesimo", "diciannovesima", "diciannovesimi", "diciannovesime", "ventesimo", "ventesima", "ventesimi", "ventesime"];
var personalPronounsNominative = ["io", "tu", "egli", "esso", "lui", "ella", "essa", "lei", "noi", "voi", "essi", "esse", "loro"];
// 'La' and 'le' are already included in the list of articles.
var personalPronounsAccusative = ["mi", "ti", "si", "ci", "vi", "li", "me", "te", "se", "glie", "glielo", "gliela", "glieli", "gliele", "gliene", "ce", "ve"];
var personalPronounsPrepositional = ["sé"];
var demonstrativePronouns = ["ciò", "codesto", "codesta", "codesti", "codeste", "colei", "colui", "coloro", "costei", "costui", "costoro", "medesimo", "medesima", "medesimi", "medesime", "questo", "questa", "questi", "queste", "quello", "quella", "quelli", "quelle", "quel", "quei", "quegli"];
var possessivePronouns = ["mio", "mia", "miei", "mie", "tuo", "tua", "tuoi", "tue", "suo", "sua", "suoi", "sue", "nostro", "nostra", "nostri", "nostre", "vostro", "vostra", "vostri", "vostre"];
// Already in the list of transition words: appena.
var quantifiers = ["affatto", "alcun", "alcuna", "alcune", "alcuni", "alcuno", "bastantemente", "grandemente", "massimamente", "meno", "minimamente", "molta", "molte", "molti", "moltissimo", "molto", "nessun", "nessuna", "nessuno", "niente", "nulla", "ogni", "più", "po'", "poca", "poche", "pochi", "poco", "pochissime", "pochissimi", "qualche", "qualsiasi", "qualunque", "quintali", "rara", "rarissima", "rarissimo", "raro", "spesso", "spessissimo", "sufficientemente", "taluno", "taluna", "taluni", "talune", "tanta", "tante", "tanti", "tantissime", "tantissimi", "tanto", "tonnellate", "troppa", "troppe", "troppi", "troppo", "tutta", "tutte", "tutti", "tutto"];
// Already in the quantifier list: alcuno, molto, nessuno, poco, taluno tanto, troppo, tutto, nulla, niente.
var indefinitePronouns = ["alcunché", "alcunchè", "altro", "altra", "altri", "altre", "certa", "certi", "certe", "checché", "checchè", "chicchessia", "chiunque", "ciascuno", "ciascuna", "ciascun", "diverso", "diversa", "diversi", "diverse", "parecchio", "parecchia", "parecchi", "parecchie", "qualcosa", "qualcuno", "qualcuna", "vario", "varia", "vari", "varie"];
var interrogativeDeterminers = ["che", "cosa", "cui", "qual", "quale", "quali"];
var interrogativePronouns = ["chi", "quanta", "quante", "quanti", "quanto"];
var interrogativeAdverbs = ["com'è", "com'era", "com'erano", "donde", "d'onde", "dove", "dov'è", "dov'era", "dov'erano", "dovunque"];
// 'Ci' and 'vi' are already part of the list of personal pronouns.
var pronominalAdverbs = ["ne"];
// 'Via' not included because of primary meaning 'street'.
var locativeAdverbs = ["accanto", "altrove", "attorno", "dappertutto", "giù", "là", "laggiù", "lassù", "lì", "ovunque", "qua", "quaggiù", "quassù", "qui"];
// 'Essere' is already part of the otherAuxiliaries list.
var filteredPassiveAuxiliaries = ["vengano", "vengo", "vengono", "veniamo", "veniate", "venimmo", "venisse", "venissero", "venissi", "venissimo", "veniste", "venisti", "venite", "veniva", "venivamo", "venivano", "venivate", "venivi", "venivo", "venne", "vennero", "venni", "verrà", "verrai", "verranno", "verrebbe", "verrebbero", "verrei", "verremmo", "verremo", "verreste", "verresti", "verrete", "verrò", "viene", "vieni"];
var passiveAuxiliariesInfinitive = ["venire", "venir"];
var otherAuxiliaries = ["abbi", "abbia", "abbiamo", "abbiano", "abbiate", "abbiente", "avemmo", "avendo", "avente", "avesse", "avessero", "avessi", "avessimo", "aveste", "avesti", "avete", "aveva", "avevamo", "avevano", "avevate", "avevi", "avevo", "avrà", "avrai", "avranno", "avrebbe", "avrebbero", "avrei", "avremmo", "avremo", "avreste", "avresti", "avrete", "avrò", "avuto", "ebbe", "ebbero", "ebbi", "ha", "hai", "hanno", "ho", "possa", "possano", "possiamo", "possiate", "posso", "possono", "poté", "potei", "potemmo", "potendo", "potente", "poterono", "potesse", "potessero", "potessi", "potessimo", "poteste", "potesti", "potete", "potette", "potettero", "potetti", "poteva", "potevamo", "potevano", "potevate", "potevi", "potevo", "potrà", "potrai", "potranno", "potrebbe", "potrebbero", "potrei", "potremmo", "potremo", "potreste", "potresti", "potrete", "potrò", "potuto", "può", "puoi", "voglia", "vogliamo", "vogliano", "vogliate", "voglio", "vogliono", "volemmo", "volendo", "volente", "volesse", "volessero", "volessi", "volessimo", "voleste", "volesti", "volete", "voleva", "volevamo", "volevano", "volevate", "volevi", "volevo", "volle", "vollero", "volli", "voluto", "vorrà", "vorrai", "vorranno", "vorrebbe", "vorrebbero", "vorrei", "vorremmo", "vorremo", "vorreste", "vorresti", "vorrete", "vorrò", "vuoi", "vuole", "debba", "debbano", "debbono", "deva", "deve", "devi", "devo", "devono", "dobbiamo", "dobbiate", "dové", "dovei", "dovemmo", "dovendo", "doverono", "dovesse", "dovessero", "dovessi", "dovessimo", "doveste", "dovesti", "dovete", "dovette", "dovettero", "dovetti", "doveva", "dovevamo", "dovevano", "dovevate", "dovevi", "dovevo", "dovrà", "dovrai", "dovranno", "dovrebbe", "dovrebbero", "dovrei", "dovremmo", "dovremo", "dovreste", "dovresti", "dovrete", "dovrò", "dovuto", "sa", "sai", "sanno", "sapemmo", "sapendo", "sapesse", "sapessero", "sapessi", "sapessimo", "sapeste", "sapesti", "sapete", "sapeva", "sapevamo", "sapevano", "sapevate", "sapevi", "sapevo", "sappi", "sappia", "sappiamo", "sappiano", "sappiate", "saprà", "saprai", "sapranno", "saprebbe", "saprebbero", "saprei", "sapremmo", "sapremo", "sapreste", "sapresti", "saprete", "saprò", "saputo", "seppe", "seppero", "seppi", "so", "soglia", "sogliamo", "sogliano", "sogliate", "soglio", "sogliono", "solesse", "solessero", "solessi", "solessimo", "soleste", "solete", "soleva", "solevamo", "solevano", "solevate", "solevi", "solevo", "suoli", "sta", "stai", "stando", "stanno", "stante", "starà", "starai", "staranno", "staremo", "starete", "starò", "stava", "stavamo", "stavano", "stavate", "stavi", "stavo", "stemmo", "stessero", "stessimo", "steste", "stesti", "stette", "stettero", "stetti", "stia", "stiamo", "stiano", "stiate", "sto"];
var otherAuxiliariesInfinitive = ["avere", "aver", "potere", "poter", "volere", "voler", "dovere", "dover", "sapere", "saper", "solere", "stare", "star"];
var copula = ["è", "e'", "era", "erano", "eravamo", "eravate", "eri", "ero", "essendo", "essente", "fosse", "fossero", "fossi", "fossimo", "foste", "fosti", "fu", "fui", "fummo", "furono", "sarà", "sarai", "saranno", "sarebbe", "sarebbero", "sarei", "saremmo", "saremo", "sareste", "saresti", "sarete", "sarò", "sei", "sia", "siamo", "siano", "siate", "siete", "sii", "sono", "stata", "state", "stati", "stato"];
var copulaInfinitive = ["essere", "esser"];
/*
'Verso' ('towards') not included because it can also mean 'verse'.
Already in other lists: malgrado, nonostante.
 */
var prepositions = ["di", "del", "dello", "della", "dei", "degli", "delle", "a", "ad", "al", "allo", "alla", "ai", "agli", "alle", "da", "dal", "dallo", "dalla", "dai", "dagli", "dalle", "in", "nel", "nello", "nella", "nei", "negli", "nelle", "con", "col", "collo", "colla", "coi", "cogli", "colle", "su", "sul", "sullo", "sulla", "sui", "sugli", "sulle", "per", "pel", "pello", "pella", "pei", "pegli", "tra", "fra", "attraverso", "circa", "contro", "davanti", "dentro", "dietro", "entro", "escluso", "fuori", "insieme", "intorno", "lontano", "lungo", "mediante", "oltre", "presso", "rasente", "riguardo", "senza", "sopra", "sotto", "tramite", "vicino"];
var coordinatingConjunctions = ["e", "ed", "o", "oppure"];
/* '
Tale' from 'tale ... quale'.
'Dall'altra' from 'da una parte... dall'altra'.
Already in other lists: vuoi...vuoi, tanto...quanto, quanto...quanto, ora...ora, non solo...ma anche, sia...sia, o...o,
più...meno, né...né, altrettanto...così, così...come.
 */
var correlativeConjunctions = ["tale", "l'uno", "l'altro", "tali", "dall'altra"];
/*
Already in another list (transition words, interrogative adverbs, numerals, prepositions):
perché, quando, mentre, appena [che], sebbene, fino, affinché, finché, dato [che], visto [che], benché,
come, prima [che], dopo, per, senza [che], di, sempre, nonostante, malgrado, così [che], in modo...da,
tanto...da, con, dove, quanto, più...che, meno, peggio...che, meglio...di, se, che, di, a meno che, siccome,
ogni volta [che], anche se, cosicché, invece, bensì, [al] punto [che].
'Modo' from 'in modgiacché o che'.
'Volta' from 'una volta che.
Excluded because of primary meaning: dal momento che, allo scopo di, a furia di ('fury', 'haste', 'rage'),
a forza di ('force'), a condizione che ('condition').
*/
var subordinatingConjunctions = ["anziché", "anzichè", "fuorché", "fuorchè", "giacché", "giacchè", "laddove", "modo", "ove", "qualora", "quantunque", "volta"];
/*
These verbs are frequently used in interviews to indicate questions and answers.
Not included: 'legge' ('reads', but also: 'law'), 'letto' ('(has) read', but also: bed), 'precisa' ('states', but also: 'precise').
 */
var interviewVerbs = ["dice", "dicono", "diceva", "dicevano", "disse", "dissero", "detto", "domanda", "domandano", "domandava", "domandavano", "domandò", "domandarono", "domandato", "afferma", "affermato", "aggiunge", "aggiunto", "ammette", "ammesso", "annuncia", "annunciato", "assicura", "assicurato", "chiede", "chiesto", "commentato", "conclude", "concluso", "continua", "continuato", "denuncia", "denunciato", "dichiara", "dichiarato", "esordisce", "esordito", "inizia", "iniziato", "precisato", "prosegue", "proseguito", "racconta", "raccontato", "recita", "recitato", "replica", "replicato", "risponde", "risposto", "rimarca", "rimarcato", "rivela", "rivelato", "scandisce", "scandito", "scrive", "scritto", "segnala", "segnalato", "sottolinea", "sottolineato", "spiega", "spiegato"];
var interviewVerbsInfinitive = ["affermare", "aggiungere", "ammettere", "annunciare", "assicurare", "chiedere", "commentare", "concludere", "continuare", "denunciare", "dichiarare", "esordire", "iniziare", "precisare", "proseguire", "raccontare", "recitare", "replicare", "rispondere", "rimarcare", "rivelare", "scandire", "scrivere", "segnalare", "sottolineare", "spiegare"];
/*
These transition words were not included in the list for the transition word assessment for various reasons.
'Appunto' ('just', 'exactly') not included for the second meaning of 'note'.
*/
var additionalTransitionWords = ["eventualmente", "forse", "mai", "probabilmente"];
var intensifiers = ["addirittura", "assolutamente", "ben", "estremamente", "mica", "nemmeno", "quasi"];
// These verbs convey little meaning.
var delexicalizedVerbs = ["fa", "fa'", "faccia", "facciamo", "facciano", "facciate", "faccio", "facemmo", "facendo", "facente", "facesse", "facessero", "facessi", "facessimo", "faceste", "facesti", "faceva", "facevamo", "facevano", "facevate", "facevi", "facevo", "fai", "fanno", "farà", "farai", "faranno", "farebbe", "farebbero", "farei", "faremmo", "faremo", "fareste", "faresti", "farete", "farò", "fate", "fatto", "fece", "fecero", "feci", "fo"];
var delexicalizedVerbsInfinitive = ["fare"];
/*
These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
 Keyword combinations containing these adjectives/adverbs are fine.
 */
var generalAdjectivesAdverbs = ["anteriore", "anteriori", "precedente", "precedenti", "facile", "facili", "facilissimo", "facilissima", "facilissimi", "facilissime", "semplice", "semplici", "semplicissima", "semplicissimo", "semplicissimi", "semplicissime", "semplicemente", "rapido", "rapida", "rapidi", "rapide", "veloce", "veloci", "differente", "difficile", "difficili", "difficilissimo", "difficilissima", "difficilissimi", "difficilissime", "basso", "bassa", "bassi", "basse", "alto", "alta", "alti", "alte", "normale", "normali", "normalmente", "corto", "corta", "corti", "corte", "breve", "brevi", "recente", "recenti", "totale", "totali", "completo", "completa", "completi", "complete", "possibile", "possibili", "ultimo", "ultima", "ultimi", "ultime", "differenti", "simile", "simili", "prossimo", "prossima", "prossimi", "prossime", "giusto", "giusta", "giusti", "giuste", "giustamente", "cosiddetto", "bene", "meglio", "benissimo", "male", "peggio", "malissimo", "comunemente", "constantemente", "direttamente", "esattamente", "facilmente", "generalmente", "leggermente", "personalmente", "recentemente", "sinceramente", "solamente", "avanti", "indietro"];
var generalAdjectivesAdverbsPreceding = ["nuovo", "nuova", "nuovi", "nuove", "vecchio", "vecchia", "vecchi", "vecchie", "bello", "bella", "belli", "belle", "bellissimo", "bellissima", "bellissimi", "bellissime", "buono", "buona", "buoni", "buone", "buonissimo", "buonissima", "buonissimi", "buonissime", "grande", "grandi", "grandissimo", "grandissima", "grandissimi", "grandissime", "lunga", "lunghi", "lunghe", "piccolo", "piccola", "piccoli", "piccole", "piccolissimo", "piccolissima", "piccolissimi", "piccolissime", "proprio", "propria", "propri", "proprie", "solito", "solita", "soliti", "solite", "stesso", "stessa", "stessi", "stesse"];
var interjections = ["accidenti", "acciderba", "ah", "aah", "ahi", "ahia", "ahimé", "bah", "beh", "boh", "ca", "caspita", "chissà", "de'", "diamine", "ecco", "eh", "ehi", "eeh", "ehilà", "ehm", "gna", "ih", "magari", "macché", "macchè", "mah", "mhm", "nca", "neh", "oibò", "oh", "ohe", "ohé", "ohilá", "ohibò", "ohimé", "okay", "ok", "olà", "poh", "pota", "puah", "sorbole", "to'", "toh", "ts", "uff", "uffa", "uh", "uhi"];
// These words and abbreviations are frequently used in recipes in lists of ingredients.
var recipeWords = ["cc", "g", "hg", "hl", "kg", "l", "prs", "pz", "q.b.", "qb", "ta", "tz"];
var timeWords = ["minuto", "minuti", "ora", "ore", "giorno", "giorni", "giornata", "giornate", "settimana", "settimane", "mese", "mesi", "anno", "anni", "oggi", "domani", "ieri", "stamattina", "stanotte", "stasera", "tardi"];
// Already included in other lists.
var vagueNouns = ["aspetto", "aspetti", "caso", "casi", "cose", "idea", "idee", "istanza", "maniera", "oggetto", "oggetti", "parte", "parti", "persona", "persone", "pezzo", "pezzi", "punto", "punti", "sorta", "sorte", "tema", "temi", "volte"];
var miscellaneous = ["sì", "no", "non", "€", "euro", "euros", "ecc", "eccetera"];
var titlesPreceding = ["sig.na", "sig.ra", "sig", "sigg", "dr", "dr.ssa", "dott", "dott.ssa", "prof", "prof.ssa", "gent", "gent.mo", "gent.mi", "gent.ma", "gent.me", "egr", "egr.i", "egr.ia", "egr.ie", "preg.mo", "preg.mo", "preg.ma", "preg.me", "ill", "ill.mo", "ill.mi", "ill.ma", "ill.me", "cav", "on", "spett"];
/*
 Exports all function words concatenated, and specific word categories and category combinations
 to be used as filters for the prominent words.
 */
module.exports = function () {
  return {
    // These word categories are filtered at the beginning of word combinations.
    filteredAtBeginning: generalAdjectivesAdverbs,
    // These word categories are filtered at the ending of word combinations.
    filteredAtEnding: [].concat(ordinalNumerals, interviewVerbsInfinitive, passiveAuxiliariesInfinitive, otherAuxiliariesInfinitive, copulaInfinitive, delexicalizedVerbsInfinitive, generalAdjectivesAdverbsPreceding),
    // These word categories are filtered at the beginning and ending of word combinations.
    filteredAtBeginningAndEnding: [].concat(articles, prepositions, coordinatingConjunctions, demonstrativePronouns, intensifiers, quantifiers, possessivePronouns),
    // These word categories are filtered everywhere within word combinations.
    filteredAnywhere: [].concat(transitionWords, personalPronounsNominative, personalPronounsAccusative, personalPronounsPrepositional, interjections, cardinalNumerals, filteredPassiveAuxiliaries, otherAuxiliaries, copula, interviewVerbs, delexicalizedVerbs, indefinitePronouns, correlativeConjunctions, subordinatingConjunctions, interrogativeDeterminers, interrogativePronouns, interrogativeAdverbs, locativeAdverbs, miscellaneous, pronominalAdverbs, recipeWords, timeWords, vagueNouns),
    // This export contains all of the above words.
    all: [].concat(articles, cardinalNumerals, ordinalNumerals, demonstrativePronouns, possessivePronouns, personalPronounsNominative, personalPronounsAccusative, personalPronounsPrepositional, quantifiers, indefinitePronouns, interrogativePronouns, interrogativeAdverbs, interrogativeDeterminers, pronominalAdverbs, locativeAdverbs, filteredPassiveAuxiliaries, passiveAuxiliariesInfinitive, otherAuxiliaries, otherAuxiliariesInfinitive, copula, copulaInfinitive, prepositions, coordinatingConjunctions, correlativeConjunctions, subordinatingConjunctions, interviewVerbs, interviewVerbsInfinitive, transitionWords, additionalTransitionWords, intensifiers, delexicalizedVerbs, delexicalizedVerbsInfinitive, interjections, generalAdjectivesAdverbs, generalAdjectivesAdverbsPreceding, recipeWords, vagueNouns, miscellaneous, timeWords, titlesPreceding)
  };
};



},{"./transitionWords.js":190}],190:[function(require,module,exports){
"use strict";
/** @module config/transitionWords */

var singleWords = ["abbastanza", "acciocché", "acciocchè", "adesso", "affinché", "affinchè", "allora", "almeno", "alquanto", "altrettanto", "altrimenti", "analogamente", "anche", "ancora", "antecedentemente", "anzi", "anzitutto", "apertamente", "appena", "assai", "attualmente", "benché", "benchè", "beninteso", "bensì", "brevemente", "bruscamente", "casomai", "celermente", "certamente", "certo", "chiaramente", "ciononostante", "cioé", "cioè", "comparabilmente", "come", "complessivamente", "completamente", "comunque", "concisamente", "concludendo", "conformemente", "congiuntamente", "conseguentemente", "considerando", "considerato", "considerevolmente", "contemporaneamente", "continuamente", "contrariamente", "controbilanciato", "così", "cosicché", "cosicchè", "dapprima", "dato", "davvero", "definitivamente", "dettagliatamente", "differentemente", "diversamente", "dopo", "dopodiché", "dopodichè", "durante", "dunque", "eccetto", "eccome", "effettivamente", "egualmente", "elencando", "enfaticamente", "eppure", "esaurientemente", "esplicitamente", "espressamente", "estesamente", "evidentemente", "finalmente", "finché", "finchè", "fino", "finora", "fintanto", "fintanto che", "fintantoché", "fintantochè", "fondamentalmente", "frattanto", "frequentemente", "generalmente", "già", "gradualmente", "illustrando", "immantinente", "immediatamente", "importantissimo", "incontestabilmente", "incredibilmente", "indipendentemente", "indiscutibilmente", "indubbiamente", "infatti", "infine", "innanzitutto", "innegabilmente", "inoltre", "insomma", "intanto", "interamente", "istantaneamente", "invece", "logicamente", "lentamente", "ma", "malgrado", "marcatamente", "memorabile", "mentre", "motivatamente", "naturalmente", "né", "nè", "neanche", "neppure", "nonché", "nonchè", "nondimeno", "nonostante", "notevolmente", "occasionalmente", "oltretutto", "onde", "onestamente", "ossia", "ostinatamente", "ovvero", "ovviamente", "parimenti", "particolarmente", "peraltro", "perché", "perchè", "perciò", "perlomeno", "però", "pertanto", "pesantemente", "piuttosto", "poi", "poiché", "poichè", "praticamente", "precedentemente", "preferibilmente", "precisamente", "prematuramente", "presto", "prima", "primariamente", "primo", "principalmente", "prontamente", "proporzionalmente", "pure", "purché", "purchè", "quando", "quanto", "quantomeno", "quindi", "raramente", "realmente", "relativamente", "riassumendo", "riformulando", "ripetutamente", "saltuariamente", "schiettamente", "sebbene", "secondariamente", "secondo", "sempre", "sennò", "seguente", "sensibilmente", "seppure", "seriamente", "siccome", "sicuramente", "significativamente", "similmente", "simultaneamente", "singolarmente", "sinteticamente", "solitamente", "solo", "soltanto", "soprattutto", "sopravvalutato", "sorprendentemente", "sostanzialmente", "sottolineando", "sottovalutato", "specialmente", "specificamente", "specificatamente", "subitamente", "subito", "successivamente", "successivo", "talmente", "terzo", "totalmente", "tranne", "tuttavia", "ugualmente", "ulteriormente", "ultimamente", "veramente", "verosimilmente", "visto"];
var multipleWords = ["a breve", "a causa", "a causa di", "a condizione che", "a conseguenza", "a conti fatti", "a differenza di", "a differenza del", "a differenza della", "a differenza dei", "a differenza degli", "a differenza delle", "a dire il vero", "a dire la verità", "a dirla tutta", "a dispetto di", "a lungo", "a lungo termine", "a maggior ragione", "a meno che non", "a parte", "a patto che", "a prescindere", "a prima vista", "a proposito", "a qualunque costo", "a quanto", "a quel proposito", "a quel tempo", "a quell'epoca", "a questo fine", "a questo proposito", "a questo punto", "a questo riguardo", "a questo scopo", "a riguardo", "a seguire", "a seguito", "a sottolineare", "a tal fine", "a tal proposito", "a tempo debito", "a tutti gli effetti", "a tutti i costi", "a una prima occhiata", "ad eccezione di", "ad esempio", "ad essere maliziosi", "ad essere sinceri", "ad ogni buon conto", "ad ogni costo", "ad ogni modo", "ad una prima occhiata", "adesso che", "al che", "al contrario", "al contrario di", "al fine di", "al fine di fare", "al giorno d'oggi", "al momento", "al momento giusto", "al momento opportuno", "al più presto", "al posto di", "al suo posto", "al termine", "all'epoca", "all'infuori di", "all'inizio", "all'opposto", "all'ultimo", "alla fine", "alla fine della fiera", "alla luce", "alla luce di", "alla lunga", "alla moda", "alla stessa maniera", "allo scopo di", "allo stesso modo", "allo stesso tempo", "anch'esso", "anch'io", "anche se", "ancora più", "ancora di più", "assumendo che", "bisogna chiarire che", "bisogna considerare che", "causato da", "ciò nondimeno", "ciò nonostante", "col tempo", "con il tempo", "come a dire", "come abbiamo dimostrato", "come è stato notato", "come è stato detto", "come è stato dimostrato", "come hanno detto", "come ho detto", "come ho dimostrato", "come ho notato", "come potete notare", "come potete vedere", "come puoi notare", "come puoi vedere", "come si è dimostrato", "come si può vedere", "come si può notare", "come sopra indicato", "comunque sia", "con attenzione", "con enfasi", "con il risultato che", "con l'obiettivo di", "con ostinazione", "con questa intenzione", "con questa idea", "con queste idee", "con questo in testa", "con questo scopo", "così che", "così da", "d'altra parte", "d'altro canto", "d'altro lato", "d'altronde", "d'ora in avanti", "d'ora in poi", "da allora", "da quando", "da quanto", "da quel momento", "da quella volta", "da questo momento in poi", "da questo momento", "da qui", "da ultimo", "da un certo punto di vista", "da un lato", "da una parte", "dall'altro lato", "dall'epoca", "dal che", "dato che", "dato per assunto che", "davanti a", "del tutto", "dell'epoca", "detto questo", "di certo", "di colpo", "di conseguenza", "di fatto", "di fronte", "di fronte a", "di lì a poco", "di punto in bianco", "di quando in quando", "di quanto non sia", "di quel tempo", "di qui a", "di rado", "di seguito", "di si", "di sicuro", "di solito", "di tanto in tanto", "di tutt'altra pasta", "di quando in quando", "differente da", "diversamente da", "diverso da", "dopotutto", "dovuto a", "e anche", "e inoltre", "entro breve", "fermo restando che", "faccia a faccia", "fin da", "fin dall'inizio", "fin quando", "finché non", "finchè non", "fin dal primo momento", "fin dall'inizio", "fino a", "fino a questo momento", "fino ad oggi", "fino ai giorni nostri", "fino adesso", "fino a un certo punto", "fino adesso", "fra quanto", "il prima possibile", "in aggiunta", "in altre parole", "in altri termini", "in ambo i casi", "in breve", "in caso di", "in conclusione", "in conformità", "in confronto", "in confronto a", "in conseguenza", "in considerazione", "in considerazione di", "in definitiva", "in dettaglio", "importante rendersi conto", "in effetti", "in entrambi i casi", "in fin dei conti", "in generale", "in genere", "in linea di massima", "in poche parole", "il più possibile", "in maggior parte", "in maniera analoga", "in maniera convincente", "in maniera esauriente", "in maniera esaustiva", "in maniera esplicita", "in maniera evidente", "in maniera incontestabile", "in maniera indiscutibile", "in maniera innegabile", "in maniera significativa", "in maniera simile", "in modo allusivo", "in modo analogo", "in modo che", "in modo convincente", "in modo da", "in modo identico", "in modo notevole", "in modo significativo", "in modo significativo", "in modo simile", "in ogni caso", "in ogni modo", "in ogni momento", "in parte considerevole", "in parti uguali", "in particolare", "in particolare per", "in particolare", "in più", "in pratica", "in precedenza", "in prima battuta", "in prima istanza", "in primo luogo", "in rapporto", "in qualche modo", "in qualsiasi modo", "in qualsiasi momento", "in qualunque modo", "in qualunque momento", "in quarta battuta", "in quarta istanza", "in quarto luogo", "in quel caso", "in quelle circostanze", "in questa occasione", "in questa situazione", "in questo caso", "in questo caso particolare", "in questo istante", "in questo momento", "in rare occasioni", "in realtà", "in seconda battuta", "in seconda istanza", "in secondo luogo", "in seguito", "in sintesi", "in sostanza", "in tempo", "in terza battuta", "in terza istanza", "in terzo luogo", "in totale", "in tutto", "in ugual maniera", "in ugual misura", "in ugual modo", "in ultima analisi", "in ultima istanza", "in un altro caso", "in una parola", "in verità", "insieme a", "insieme con", "invece che", "invece di", "la prima cosa da considerare", "la prima cosa da tenere a mente", "lo stesso", "mentre potrebbe essere vero", "motivo per cui", "motivo per il quale", "ne consegue che", "ne deriva che", "nei dettagli", "nel caso", "nel caso che", "nel caso in cui", "nel complesso", "nel corso del", "nel corso di", "nel frattempo", "nel lungo periodo", "nel mentre", "nell'eventualità che", "nella misura in cui", "nella speranza che", "nella stessa maniera", "nella stessa misura", "nello specifico", "nello stesso modo", "nello stesso momento", "nello stesso stile", "non appena", "non per essere maliziosi", "non più da", "nonostante ciò", "nonostante tutto", "ogni qualvolta", "ogni tanto", "ogni volta", "oltre a", "oltre a ciò", "ora che", "passo dopo passo", "per causa di", "per certo", "per chiarezza", "per chiarire", "per come", "per concludere", "per conto di", "per contro", "per cui", "per davvero", "per di più", "per dirla in altro modo", "per dirla meglio", "per dirla tutta", "per es.", "per esempio", "per essere sinceri", "per far vedere", "per farla breve", "per finire", "per l'avvenire", "per l'ultima volta", "per la maggior parte", "per la stessa ragione", "per la verità", "per lo più", "per mettere in luce", "per metterla in altro modo", "per non dire di", "per non parlare di", "per ora", "per ovvi motivi", "per paura di", "per paura dei", "per paura delle", "per paura degli", "per prima cosa", "per quanto", "per questa ragione", "per questo motivo", "per riassumere", "per sottolineare", "per timore", "per trarre le conclusioni", "per ultima", "per ultime", "per ultimi", "per ultimo", "per via di", "perché si", "perchè si", "perfino se", "piano piano", "più di ogni altra cosa", "più di tutto", "più facilmente", "più importante", "più tardi", "poco a poco", "poco dopo", "prendiamo il caso di", "presto o tardi", "prima che", "prima di", "prima di ogni cosa", "prima di tutto", "prima o dopo", "prima o poi", "questo è probabilmente vero", "questo potrebbe essere vero", "restando inteso che", "riassumendo", "quanto prima", "questa volta", "se confrontato con", "se e solo se", "se no", "seduta stante", "sempreché", "semprechè", "sempre che", "senz'altro", "senza alcun riguardo", "senza dubbio", "senz'ombra di dubbio", "senza ombra di dubbio", "senza riguardo per", "senza tregua", "senza ulteriore ritardo", "sia quel che sia", "solo se", "sotto questa luce", "sperando che", "sta volta", "su tutto", "subito dopo", "sul serio", "tanto per cominciare", "tanto quanto", "tra breve", "tra l'altro", "tra poco", "tra quanto", "tutte le volte", "tutti insieme", "tutto a un tratto", "tutto ad un tratto", "tutto d'un tratto", "tutto considerato", "tutto sommato", "un passo alla volta", "un tempo", "una volta", "una volta ogni tanto", "unito a", "va chiarito che", "va considerato che", "vada come vada", "vale a dire", "visto che"];
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



},{}],191:[function(require,module,exports){
"use strict";

var transitionWords = require("./transitionWords.js")().singleWords;
/**
 * Returns an array with exceptions for the prominent words researcher
 * @returns {Array} The array filled with exceptions.
 */
var articles = ["el", "la", "los", "las", "un", "una", "unos", "unas"];
// "Uno" is already included in the articles.
var cardinalNumerals = ["dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciseis", "diecisiete", "dieciocho", "diecinueve", "veinte", "cien", "centena", "mil", "millon", "millones"];
var ordinalNumerals = ["primera", "segunda", "tercera", "cuarto", "cuarta", "quinto", "quinta", "sexto", "sexta", "septimo", "septima", "octavo", "octava", "noveno", "novena", "décimo", "décima", "vigésimo", "vigésima", "primeros", "primeras", "segundos", "segundas", "terceros", "terceras", "cuartos", "cuartas", "quintos", "quintas", "sextos", "sextas", "septimos", "septimas", "octavos", "octavas", "novenos", "novenas", "décimos", "décimas", "vigésimos", "vigésimas"];
var personalPronounsNominative = ["yo", "tú", "él", "ella", "ello", "nosotros", "nosotras", "vosotros", "vosotras", "ustedes", "ellos", "ellas"];
var personalPronounsAccusative = ["me", "te", "lo", "se", "nos", "os", "les"];
var personalPronounsPrepositional = ["mí", "ti", "ud", "uds", "usted", "sí"];
var personalPronounsComitative = ["conmigo", "contigo", "consigo"];
var demonstrativePronouns = ["este", "ese", "aquel", "esta", "esa", "aquella", "estos", "esos", "aquellos", "estas", "esas", "aquellas", "esto", "eso", "aquello"];
var possessivePronouns = ["mi", "mis", "mío", "míos", "mía", "mías", "nuestro", "nuestros", "nuestra", "nuestras", "tuyo", "tuyos", "tuya", "tuyas", "tu", "tus", "vuestro", "vuestros", "vuestra", "vuestras", "suyo", "suyos", "suya", "suyas", "su", "sus"];
var quantifiers = ["bastante", "bastantes", "mucho", "muchas", "mucha", "muchos", "demasiado", "demasiada", "demasiados", "demasiadas", "poco", "poca", "pocos", "pocas", "demás", "otros", "otras", "todo", "toda", "todos", "todas"];
var indefinitePronouns = ["alguien", "algo", "algún", "alguno", "alguna", "algunos", "algunas", "nadie", "nada", "ningún", "ninguno", "ninguna", "ningunos", "ningunas", "tanto", "tantos", "tanta", "tantas"];
var interrogativeDeterminers = ["cuyas", "cual"];
var interrogativePronouns = ["cuyo"];
/*
'Qué' is part of 'por qué' ('why'). The combination 'quien sea' ('whoever') is separated into two entries: 'quien' and 'sea'.
'quira' is part of 'cuando quiera' ('whenever').
 */
var interrogativeProAdverbs = ["comoquiera", "cualesquiera", "cualquier", "cuanta", "cuantas", "cuanto", "cuantos", "cuál", "cuáles", "cuánta", "cuántas", "cuánto", "cuántos", "cómo", "dondequiera", "dónde", "quien", "quienes", "quienquiera", "quién", "quiénes", "qué"];
var locativeAdverbs = ["allí", "ahí", "allá", "aquí", "acá", "adónde", "delante", "detrás", "debajo", "adelante", "atrás", "adentro", "afuera"];
var otherAuxiliaries = ["he", "has", "ha", "hay", "hemos", "habéis", "han", "hube", "hubiste", "hubo", "hubimos", "hubisteis", "hubieron", "había", "habías", "habíamos", "habíais", "habían", "habría", "habrías", "habríais", "habrían", "habré", "habrás", "habrá", "habremos", "habréis", "habrán", "haya", "hayas", "hayamos", "hayáis", "hayan", "hubiera", "hubieras", "hubiéramos", "hubierais", "hubieran", "hubiese", "hubieses", "hubiésemos", "hubieseis", "hubiesen", "hubiere", "hubieres", "hubiéremos", "hubiereis", "hubieren", "habed", "habido", "debo", "debes", "debe", "debemos", "debéis", "deben", "debí", "debiste", "debió", "debimos", "debisteis", "debieron", "debía", "debías", "debíamos", "debíais", "debían", "debería", "deberías", "deberíamos", "deberíais", "deberían", "deberé", "deberás", "deberá", "deberemos", "deberéis", "deberán", "deba", "debas", "debamos", "debáis", "deban", "debiera", "debieras", "debiéramos", "debierais", "debieran", "debiese", "debieses", "debiésemos", "debieseis", "debiesen", "debiere", "debieres", "debiéremos", "debiereis", "debieren", "debed", "debido", "empiezo", "empiezas", "empieza", "empezáis", "empiezan", "empecé", "empezaste", "empezó", "empezamos", "empezasteis", "empezaron", "empezaba", "empezabas", "empezábamos", "empezabais", "empezaban", "empezaría", "empezarías", "empezaríamos", "empezaríais", "empezarían", "empezaré", "empezarás", "empezará", "empezaremos", "empezaréis", "empezarán", "empiece", "empieces", "empecemos", "empecéis", "empiecen", "empezara", "empezaras", "empezáramos", "empezarais", "empezaran", "empezase", "empezases", "empezásemos", "empezaseis", "empezasen", "empezare", "empezares", "empezáremos", "empezareis", "empezaren", "empezad", "empezado", "comienzo", "comienzas", "comienza", "comenzamos", "comenzáis", "comienzan", "comencé", "comenzaste", "comenzó", "comenzasteis", "comenzaron", "comenzaba", "comenzabas", "comenzábamos", "comenzabais", "comenzaban", "comenzaría", "comenzarías", "comenzaríamos", "comenzaríais", "comenzarían", "comenzaré", "comenzarás", "comenzará", "comenzaremos", "comenzaréis", "comenzarán", "comience", "comiences", "comencemos", "comencéis", "comiencen", "comenzara", "comenzaras", "comenzáramos", "comenzarais", "comenzaran", "comenzase", "comenzases", "comenzásemos", "comenzaseis", "comenzasen", "comenzare", "comenzares", "comenzáremos", "comenzareis", "comenzaren", "comenzad", "comenzado", "sigo", "sigues", "sigue", "seguimos", "seguis", "siguen", "seguí", "seguiste", "siguió", "seguisteis", "siguieron", "seguía", "seguías", "seguíamos", "seguíais", "seguían", "seguiría", "seguirías", "seguiríamos", "seguiríais", "seguirían", "seguiré", "seguirás", "seguirá", "seguiremos", "seguiréis", "seguirán", "siga", "sigas", "sigamos", "sigáis", "sigan", "siguiera", "siguieras", "siguiéramos", "siguierais", "siguieran", "siguiese", "siguieses", "siguiésemos", "siguieseis", "siguiesen", "siguiere", "siguieres", "siguiéremos", "siguiereis", "siguieren", "seguid", "seguido", "tengo", "tienes", "tiene", "tenemos", "tenéis", "tienen", "tuve", "tuviste", "tuvo", "tuvimos", "tuvisteis", "tuvieron", "tenía", "tenías", "teníamos", "teníais", "tenían", "tendría", "tendrías", "tendríamos", "tendríais", "tendrían", "tendré", "tendrás", "tendrá", "tendremos", "tendréis", "tendrán", "tenga", "tengas", "tengamos", "tengáis", "tengan", "tuviera", "tuvieras", "tuviéramos", "tuvierais", "tuvieran", "tuviese", "tuvieses", "tuviésemos", "tuvieseis", "tuviesen", "tuviere", "tuvieres", "tuviéremos", "tuviereis", "tuvieren", "ten", "tened", "tenido", "ando", "andas", "andamos", "andáis", "andan", "anduve", "anduviste", "anduvo", "anduvimos", "anduvisteis", "anduvieron", "andaba", "andabas", "andábamos", "andabais", "andaban", "andaría", "andarías", "andaríamos", "andaríais", "andarían", "andaré", "andarás", "andará", "andaremos", "andaréis", "andarán", "ande", "andes", "andemos", "andéis", "anden", "anduviera", "anduvieras", "anduviéramos", "anduvierais", "anduvieran", "anduviese", "anduvieses", "anduviésemos", "anduvieseis", "anduviesen", "anduviere", "anduvieres", "anduviéremos", "anduviereis", "anduvieren", "andad", "andado", "quedo", "quedas", "queda", "quedamos", "quedáis", "quedan", "quedé", "quedasteis", "quedaron", "quedaba", "quedabas", "quedábamos", "quedabais", "quedaban", "quedaría", "quedarías", "quedaríamos", "quedaríais", "quedarían", "quedaré", "quedarás", "quedará", "quedaremos", "quedaréis", "quedarán", "quede", "quedes", "quedemos", "quedéis", "queden", "quedara", "quedaras", "quedáramos", "quedarais", "quedaran", "quedase", "quedases", "quedásemos", "quedaseis", "quedasen", "quedare", "quedares", "quedáremos", "quedareis", "quedaren", "quedad", "quedado", "hallo", "hallas", "halla", "hallamos", "halláis", "hallan", "hallé", "hallaste", "halló", "hallasteis", "hallaron", "hallaba", "hallabas", "hallábamos", "hallabais", "hallaban", "hallaría", "hallarías", "hallaríamos", "hallaríais", "hallarían", "hallaré", "hallarás", "hallará", "hallaremos", "hallaréis", "hallarán", "halle", "halles", "hallemos", "halléis", "hallen", "hallara", "hallaras", "halláramos", "hallarais", "hallaran", "hallase", "hallases", "hallásemos", "hallaseis", "hallasen", "hallare", "hallares", "halláremos", "hallareis", "hallaren", "hallad", "hallado", "vengo", "vienes", "viene", "venimos", "venis", "vienen", "vine", "viniste", "vino", "vinimos", "vinisteis", "vinieron", "venía", "vanías", "verníamos", "veníais", "venían", "vendría", "vendrías", "vendríamos", "vendíais", "vendrían", "vendré", "vendrás", "vendrá", "vendremos", "vendréis", "vendrán", "venga", "vengas", "vengamos", "vengáis", "vengan", "viniera", "vinieras", "viniéramos", "vinierais", "vinieran", "viniese", "vinieses", "viniésemos", "vinieseis", "viniesen", "viniere", "vinieres", "viniéremos", "viniereis", "vinieren", "ven", "venid", "venido", "abro", "abres", "abre", "abrismos", "abrís", "abren", "abrí", "abriste", "abrió", "abristeis", "abrieron", "abría", "abrías", "abríais", "abrían", "abriría", "abrirías", "abriríamos", "abriríais", "abrirían", "abriré", "abrirás", "abrirá", "abriremos", "abriréis", "abrirán", "abra", "abras", "abramos", "abráis", "abran", "abriera", "abrieras", "abriéramos", "abrierais", "abrieran", "abriese", "abrieses", "abriésemos", "abrieseis", "abriesen", "abriere", "abrieres", "abriéremos", "abriereis", "abrieren", "abrid", "abierto", "voy", "vas", "va", "vamos", "vais", "van", "iba", "ibas", "íbamos", "ibais", "iban", "iría", "irías", "iríamos", "iríais", "irían", "iré", "irás", "irá", "iremos", "iréis", "irán", "vaya", "vayas", "vayamos", "vayáis", "vayan", "ve", "id", "ido", "acabo", "acabas", "acaba", "acabamos", "acabáis", "acaban", "acabé", "acabaste", "acabó", "acabasteis", "acabaron", "acababa", "acababas", "acabábamos", "acababais", "acababan", "acabaría", "acabarías", "acabaríamos", "acabaríais", "acabarían", "acabaré", "acabarás", "acabará", "acabaremos", "acabaréis", "acabarán", "acabe", "acabes", "acabemos", "acabéis", "acaben", "acabara", "acabaras", "acabáramos", "acabarais", "acabaran", "acabase", "acabases", "acabásemos", "acabaseis", "acabasen", "acabare", "acabares", "acabáremos", "acabareis", "acabaren", "acabad", "acabado", "llevo", "llevas", "lleva", "llevamos", "lleváis", "llevan", "llevé", "llevaste", "llevó", "llevasteis", "llevaron", "llevaba", "llevabas", "llevábamos", "llevabais", "llevaban", "llevaría", "llevarías", "llevaríamos", "llevaríais", "llevarían", "llevaré", "llevarás", "llevará", "llevaremos", "llevaréis", "llevarán", "lleve", "lleves", "llevemos", "llevéis", "lleven", "llevara", "llevaras", "lleváramos", "llevarais", "llevaran", "llevase", "llevases", "llevásemos", "llevaseis", "llevasen", "llevare", "llevares", "lleváremos", "llevareis", "llevaren", "llevad", "llevado", "alcanzo", "alcanzas", "alcanza", "alcanzamos", "alcanzáis", "alcanzan", "alcancé", "alcanzaste", "alcanzó", "alcanzasteis", "alcanzaron", "alcanzaba", "alcanzabas", "alcanzábamos", "alcanzabais", "alcanzaban", "alcanzaría", "alcanzarías", "alcanzaríamos", "alcanzaríais", "alcanzarían", "alcanzaré", "alcanzarás", "alcanzará", "alcanzaremos", "alcanzaréis", "alcanzarán", "alcance", "alcances", "alcancemos", "alcancéis", "alcancen", "alcanzara", "alcanzaras", "alcanzáramos", "alcanzarais", "alcanzaran", "alcanzase", "alcanzases", "alcanzásemos", "alcanzaseis", "alcanzasen", "alcanzare", "alcanzares", "alcanzáremos", "alcanzareis", "alcanzaren", "alcanzad", "alcanzado", "digo", "dices", "dice", "decimos", "decís", "dicen", "dije", "dijiste", "dijo", "dijimos", "dijisteis", "dijeron", "decía", "decías", "decíamos", "decíais", "decían", "diría", "dirías", "diríamos", "diríais", "dirían", "diré", "dirás", "dirá", "diremos", "diréis", "dirán", "diga", "digas", "digamos", "digáis", "digan", "dijera", "dijeras", "dijéramos", "dijerais", "dijeran", "dijese", "dijeses", "dijésemos", "dijeseis", "dijesen", "dijere", "dijeres", "dijéremos", "dijereis", "dijeren", "di", "decid", "dicho", "continúo", "continúas", "continúa", "continuamos", "continuáis", "continúan", "continué", "continuaste", "continuó", "continuasteis", "continuaron", "continuaba", "continuabas", "continuábamos", "continuabais", "continuaban", "continuaría", "continuarías", "continuaríamos", "continuaríais", "continuarían", "continuaré", "continuarás", "continuará", "continuaremos", "continuaréis", "continuarán", "continúe", "continúes", "continuemos", "continuéis", "continúen", "continuara", "continuaras", "continuáramos", "continuarais", "continuaran", "continuase", "continuases", "continuásemos", "continuaseis", "continuasen", "continuare", "continuares", "continuáremos", "continuareis", "continuaren", "continuad", "continuado", "resulto", "resultas", "resulta", "resultamos", "resultáis", "resultan", "resulté", "resultaste", "resultó", "resultasteis", "resultaron", "resultaba", "resultabas", "resultábamos", "resultabais", "resultaban", "resultaría", "resultarías", "resultaríamos", "resultaríais", "resultarían", "resultaré", "resultarás", "resultará", "resultaremos", "resultaréis", "resultarán", "resulte", "resultes", "resultemos", "resultéis", "resulten", "resultara", "resultaras", "resultáramos", "resultarais", "resultaran", "resultase", "resultases", "resultásemos", "resultaseis", "resultasen", "resultare", "resultares", "resultáremos", "resultareis", "resultaren", "resultad", "resultado", "puedo", "puedes", "puede", "podemos", "podéis", "pueden", "pude", "pudiste", "pudo", "pudimos", "pudisteis", "pudieron", "podía", "podías", "podíamos", "podíais", "podían", "podría", "podrías", "podríamos", "podríais", "podrían", "podré", "podrás", "podrá", "podremos", "podréis", "podrán", "pueda", "puedas", "podamos", "podáis", "puedan", "pudiera", "pudieras", "pudiéramos", "pudierais", "pudieran", "pudiese", "pudieses", "pudiésemos", "pudieseis", "pudiesen", "pudiere", "pudieres", "pudiéremos", "pudiereis", "pudieren", "poded", "podido", "quiero", "quieres", "quiere", "queremos", "queréis", "quieren", "quise", "quisiste", "quiso", "quisimos", "quisisteis", "quisieron", "quería", "querías", "queríamos", "queríais", "querían", "querría", "querrías", "querríamos", "querríais", "querrían", "querré", "querrás", "querrá", "querremos", "querréis", "querrán", "quiera", "quieras", "queramos", "queráis", "quieran", "quisiera", "quisieras", "quisiéramos", "quisierais", "quisieran", "quisiese", "quisieses", "quisiésemos", "quisieseis", "quisiesen", "quisiere", "quisieres", "quisiéremos", "quisiereis", "quisieren", "quered", "querido", "sabes", "sabe", "sabemos", "sabéis", "saben", "supe", "supiste", "supo", "supimos", "supisteis", "supieron", "sabía", "sabías", "sabíamos", "sabíais", "sabían", "sabría", "sabrías", "sabríamos", "sabríais", "sabrían", "sabré", "sabrás", "sabrá", "sabremos", "sabréis", "sabrán", "sepa", "sepas", "sepamos", "sepáis", "sepan", "supiera", "supieras", "supiéramos", "supierais", "supieran", "supiese", "supieses", "supiésemos", "supieseis", "supiesen", "supiere", "supieres", "supiéremos", "supiereis", "supieren", "sabed", "sabido", "suelo", "sueles", "suele", "solemos", "soléis", "suelen", "solí", "soliste", "solió", "solimos", "solisteis", "solieron", "solía", "solías", "solíamos", "solíais", "solían", "solería", "solerías", "soleríamos", "soleríais", "solerían", "soleré", "solerás", "solerá", "soleremos", "soleréis", "solerán", "suela", "suelas", "solamos", "soláis", "suelan", "soliera", "solieras", "soliéramos", "solierais", "solieran", "soliese", "solieses", "soliésemos", "solieseis", "soliesen", "soliere", "solieres", "soliéremos", "soliereis", "solieren", "soled", "solido", "necesito", "necesitas", "necesitamos", "necesitáis", "necesitan", "necesité", "necesitaste", "necesitó", "necesitasteis", "necesitaron", "necesitaba", "necesitabas", "necesitábamos", "necesitabais", "necesitaban", "necesitaría", "necesitarías", "necesitaríamos", "necesitaríais", "necesitarían", "necesitaré", "necesitarás", "necesitará", "necesitaremos", "necesitaréis", "necesitarán", "necesite", "necesites", "necesitemos", "necesitéis", "necesiten", "necesitara", "necesitaras", "necesitáramos", "necesitarais", "necesitaran", "necesitase", "necesitases", "necesitásemos", "necesitaseis", "necesitasen", "necesitare", "necesitares", "necesitáremos", "necesitareis", "necesitaren", "necesita", "necesitad", "necesitado"];
var otherAuxiliariesInfinitive = ["haber", "deber", "empezar", "comenzar", "seguir", "tener", "andar", "quedar", "hallar", "venir", "abrir", "ir", "acabar", "llevar", "alcanzar", "decir", "continuar", "resultar", "poder", "querer", "saber", "soler", "necesitar"];
var copula = ["estoy", "estás", "está", "estamos", "estáis", "están", "estuve", "estuviste", "estuvo", "estuvimos", "estuvisteis", "estuvieron", "estuba", "estabas", "estábamos", "estabais", "estaban", "estraría", "estarías", "estaríamos", "estaríais", "estarían", "estaré", "estarás", "estará", "estaremos", "estaréis", "estarán", "esté", "estés", "estemos", "estéis", "estén", "estuviera", "estuviese", "estuvieras", "estuviéramos", "estuvierais", "estuvieran", "estuvieses", "estuviésemos", "estuvieseis", "estuviesen", "estuviere", "estuvieres", "estuviéremos", "estuviereis", "estuvieren", "estad", "estado", "soy", "eres", "es", "somos", "sois", "son", "fui", "fuiste", "fuimos", "fuisteis", "fueron", "era", "eras", "éramos", "erais", "eran", "sería", "serías", "seríamos", "seríais", "serían", "seré", "serás", "seremos", "seréis", "serán", "sea", "seas", "seamos", "seáis", "sean", "fueras", "fuéramos", "fuerais", "fueran", "fuese", "fueses", "fuésemos", "fueseis", "fuesen", "fuere", "fueres", "fuéremos", "fuereis", "fueren", "sé", "sed", "sido"];
var copulaInfinitive = ["estar", "ser"];
var prepositions = ["a", "ante", "abajo", "adonde", "al", "allende", "alrededor", "amén", "antes", "arriba", "aun", "bajo", "cabe", "cabo", "con", "contigo", "contra", "de", "dejante", "del", "dentro", "desde", "donde", "durante", "en", "encima", "entre", "excepto", "fuera", "hacia", "hasta", "incluso", "mediante", "más", "opuesto", "par", "para", "próximo", "salvo", "según", "sin", "so", "sobre", "tras", "versus", "vía"];
var prepositionalAdverbs = ["cerca"];
var coordinatingConjunctions = ["o", "y", "entonces", "e", "u", "ni", "bien", "ora"];
// 'Igual' is part of 'igual...que'.
var correlativeConjunctions = ["igual"];
var subordinatingConjunctions = ["apenas", "segun", "que"];
// These verbs are frequently used in interviews to indicate questions and answers.
// 'Dijo' is already included in the otherAuxiliaries category.
var interviewVerbs = ["apunto", "apunta", "confieso", "confiesa", "confesaba", "revelado", "revelo", "revela", "revelaba", "declarado", "declaro", "declara", "declaba", "señalo", "señala", "señalaba", "declaraba", "comento", "comenta"];
// These transition words were not included in the list for the transition word assessment for various reasons.
var additionalTransitionWords = ["básicamente", "esencialmente", "primeramente", "siempre", "nunca", "ahora", "quizá", "acaso", "inclusive", "probablemente", "verdaderamente", "seguramente", "jamás", "obviamente", "indiscutiblement", "inmediatamente", "previamente"];
var intensifiers = ["muy", "tan", "completamente", "suficiente", "tal", "tales"];
// These verbs convey little meaning.
var delexicalizedVerbs = ["hago", "haces", "hace", "hacemos", "hacéis", "hacen", "hice", "hiciste", "hizo", "hicimos", "hicisteis", "hicieron", "hacía", "hacías", "hacíamos", "hacíais", "hacían", "haría,", "harías", "haríamos", "haríais", "harían", "haré", "harás", "hará", "haremos", "haréis", "harán", "haga", "hagas", "hagamos", "hagáis", "hagan", "hiciera", "hicieras", "hiciéramos", "hicierais", "hicieran", "hiciese", "hicieses", "hiciésemos", "hicieseis", "hiciesen", "hiciere", "hicieres", "hiciéremos", "hiciereis", "hicieren", "haz", "haced", "hecho", "parezco", "pareces", "parece", "parecemos", "parecéis", "parecen", "parecí", "pareciste", "pareció", "parecimos", "parecisteis", "parecieron", "parecía", "parecías", "parecíamos", "parecíais", "parecían", "parecería", "parecerías", "pareceríamos", "pareceríais", "parecerían", "pareceré", "parecerás", "parecerá", "pareceremos", "pareceréis", "parecerán", "parezca", "parezcas", "parezcamos", "parezcáis", "parezcan", "pareciera", "parecieras", "pareciéramos", "parecierais", "parecieran", "pareciese", "parecieses", "pareciésemos", "parecieseis", "pareciesen", "pareciere", "parecieres", "pareciéremos", "pareciereis", "parecieren", "pareced", "parecido"];
var delexicalizedVerbsInfinitive = ["hacer", "parecer"];
// These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
// Keyword combinations containing these adjectives/adverbs are fine.
var generalAdjectivesAdverbs = ["enfrente", "mejor", "peor", "menos", "claro", "bueno", "nuevo", "nueva", "nuevos", "nuevas", "viejo", "viejos", "vieja", "viejas", "anterior", "grande", "gran", "grandes", "mayores", "fácil", "fáciles", "rápido", "rápida", "rápidos", "rápidas", "lejos", "lejas", "difícil", "difíciles", "propio", "propios", "propia", "propias", "largo", "larga", "largos", "largas", "bajos", "baja", "bajas", "alto", "alta", "altos", "altas", "regular", "regulares", "normal", "pequeño", "pequeña", "pequeños", "pequeñas", "diminuta", "diminuto", "diminutas", "diminutos", "chiquitito", "chiquititos", "chiquitita", "chiquititas", "corta", "corto", "cortas", "cortos", "principal", "principales", "mismo", "mismos", "misma", "mismas", "capaz", "capaces", "cierta", "cierto", "ciertas", "ciertos", "llamado", "llamada", "llamados", "llamadas", "mayormente", "reciente", "recientes", "completa", "completo", "completas", "completos", "absoluta", "absoluto", "absolutas", "absolutos", "últimamente", "posible", "común", "comúnes", "comúnmente", "constantemente", "continuamente", "directamente", "fácilmente", "casi", "ligeramente", "estima", "estimada", "estimado", "aproximada", "aproximadamente", "última", "últimas", "último", "últimos", "diferente", "diferentes", "similar", "mal", "malo", "malos", "mala", "malas", "perfectamente", "excelente", "final", "general"];
var interjections = ["ah", "eh", "ejem", "ele", "achís", "adiós", "agur", "ajá", "ajajá", "ala", "alá", "albricias", "aleluya", "alerta", "alirón", "aló", "amalaya", "ar", "aro", "arrarray", "arre", "arsa", "atatay", "aúpa", "ax", "ay", "ayayay", "bah", "banzai", "barajo", "bla", "bravo", "buf", "bum", "ca", "caguendiós", "canastos", "caracho", "caracoles", "carajo", "caramba", "carape", "caray", "cáscaras", "cáspita", "cataplum", "ce", "chao", "chau", "che", "chis", "chist", "chitón", "cho", "chucho", "chus", "cielos", "clo", "coche", "cochi", "cojones", "concho", "coño", "córcholis", "cuchí", "cuidado", "cuz", "demonio", "demontre", "despacio", "diablo", "diantre", "dios", "ea", "epa", "equilicuá", "estúpido", "eureka", "evohé", "exacto", "fantástico", "firmes", "fo", "forte", "gua", "gualá", "guarte", "guay", "hala", "hale", "he", "hi", "hin", "hola", "hopo", "huesque", "huiche", "huichó", "huifa", "hurra", "huy", "ja", "jajajá", "jajay", "jaque", "jau", "jo", "jobar", "joder", "jolín", "jopo", "leñe", "listo", "malhayas", "mamola", "mecachis", "miéchica", "mondo", "moste", "mutis", "nanay", "narices", "oh", "ojalá", "ojo", "okay", "ole", "olé", "órdiga", "oste", "ostras", "ox", "oxte", "paf", "pardiez", "paso", "pucha", "puf", "puff", "pumba", "puñeta", "quia", "quiúbole", "recórcholis", "rediez", "rediós", "salve", "sanseacabó", "sniff", "socorro", "ta", "tararira", "tate", "tururú", "uf", "uh", "ui", "upa", "uste", "uy", "victoria", "vítor", "viva", "za", "zambomba", "zapateta", "zape", "zas"];
// These words and abbreviations are frequently used in recipes in lists of ingredients.
var recipeWords = ["kg", "mg", "gr", "g", "km", "m", "l", "ml", "cl"];
var timeWords = ["minuto", "minutos", "hora", "horas", "día", "días", "semana", "semanas", "mes", "meses", "año", "años", "hoy", "mañana", "ayer"];
// 'People' should only be removed in combination with 'some', 'many' and 'few' (and is therefore not yet included in the list below).
var vagueNouns = ["cosa", "cosas", "manera", "maneras", "caso", "casos", "pieza", "piezas", "vez", "veces", "parte", "partes", "porcentaje", "instancia", "aspecto", "aspectos", "punto", "puntos", "objeto", "objectos", "persona", "personas"];
var miscellaneous = ["no", "euros"];
var titlesPreceding = ["sra", "sras", "srta", "sr", "sres", "dra", "dr", "profa", "prof"];
var titlesFollowing = ["jr", "sr"];
module.exports = function () {
    return {
        // These word categories are filtered at the beginning of word combinations.
        filteredAtBeginning: generalAdjectivesAdverbs,
        // These word categories are filtered at the ending of word combinations.
        filteredAtEnding: [].concat(ordinalNumerals, otherAuxiliariesInfinitive, copulaInfinitive, delexicalizedVerbsInfinitive),
        // These word categories are filtered at the beginning and ending of word combinations.
        filteredAtBeginningAndEnding: [].concat(articles, prepositions, coordinatingConjunctions, demonstrativePronouns, intensifiers, quantifiers, possessivePronouns),
        // These word categories are filtered everywhere within word combinations.
        filteredAnywhere: [].concat(transitionWords, personalPronounsNominative, personalPronounsAccusative, personalPronounsPrepositional, personalPronounsComitative, interjections, cardinalNumerals, otherAuxiliaries, copula, interviewVerbs, delexicalizedVerbs, indefinitePronouns, correlativeConjunctions, subordinatingConjunctions, interrogativeDeterminers, interrogativePronouns, interrogativeProAdverbs, locativeAdverbs, miscellaneous, prepositionalAdverbs, recipeWords, timeWords, vagueNouns),
        // These word categories cannot directly precede a passive participle.
        cannotDirectlyPrecedePassiveParticiple: [].concat(articles, prepositions, personalPronounsAccusative, possessivePronouns, indefinitePronouns, interrogativeProAdverbs, cardinalNumerals, ordinalNumerals, delexicalizedVerbs, delexicalizedVerbsInfinitive, interviewVerbs),
        // This export contains all of the above words.
        all: [].concat(articles, cardinalNumerals, ordinalNumerals, demonstrativePronouns, possessivePronouns, personalPronounsNominative, personalPronounsComitative, personalPronounsPrepositional, personalPronounsAccusative, quantifiers, indefinitePronouns, interrogativeDeterminers, interrogativePronouns, interrogativeProAdverbs, locativeAdverbs, prepositionalAdverbs, otherAuxiliaries, otherAuxiliariesInfinitive, copula, copulaInfinitive, prepositions, coordinatingConjunctions, correlativeConjunctions, subordinatingConjunctions, interviewVerbs, transitionWords, additionalTransitionWords, intensifiers, delexicalizedVerbs, delexicalizedVerbsInfinitive, interjections, generalAdjectivesAdverbs, recipeWords, vagueNouns, miscellaneous, titlesPreceding, titlesFollowing)
    };
};



},{"./transitionWords.js":192}],192:[function(require,module,exports){
"use strict";
/** @module config/transitionWords */

var singleWords = ["además", "adicional", "así", "asimismo", "aún", "aunque", "ciertamente", "como", "concluyendo", "conque", "contrariamente", "cuando", "decididamente", "decisivamente", "después", "diferentemente", "efectivamente", "entonces", "especialmente", "específicamente", "eventualmente", "evidentemente", "finalmente", "frecuentemente", "generalmente", "igualmente", "lógicamente", "luego", "mas", "mientras", "pero", "por", "porque", "posteriormente", "primero", "principalmente", "pronto", "próximamente", "pues", "raramente", "realmente", "seguidamente", "segundo", "semejantemente", "si", "siguiente", "sino", "súbitamente", "supongamos", "también", "tampoco", "tercero", "verbigracia", "vice-versa", "ya"];
var multipleWords = ["a causa de", "a continuación", "a diferencia de", "a fin de cuentas", "a la inversa", "a la misma vez", "a más de", "a más de esto", "a menos que", "a no ser que", "a pesar de", "a pesar de eso", "a pesar de todo", "a peser de", "a propósito", "a saber", "a todo esto", "ahora bien", "al contrario", "al fin y al cabo", "al final", "al inicio", "al mismo tiempo", "al principio", "ante todo", "antes bien", "antes de", "antes de nada", "antes que nada", "aparte de", "as así como", "así como", "así mismo", "así pues", "así que", "así y todo", "aún así", "claro está que", "claro que", "claro que sí", "como caso típico", "como decíamos", "como era de esperar", "como es de esperar", "como muestra", "como resultado", "como se ha notado", "como sigue", "comparado con", "con el objeto de", "con el propósito de", "con que", "con relación a", "con tal de que", "con todo", "dado que", "de ahí", "de cierta manera", "de cualquier manera", "de cualquier modo", "de ello resulta que", "de este modo", "de golpe", "de hecho", "de igual manera", "de igual modo", "de igualmanera", "de la manera siguiente", "de la misma forma", "de la misma manera", "de manera semejante", "del mismo modo", "de modo que", "de nuevo", "de otra manera", "de otro modo", "de pronto", "de qualquier manera", "de repente", "de suerte que", "de tal modo", "de todas formas", "de todas maneras", "de todos modos", "de veras", "debido a", "debido a que", "del mismo modo", "dentro de poco", "desde entonces", "después de", "después de todo", "ejemplo de esto", "el caso es que", "en aquel tiempo", "en cambio", "en cierto modo", "en comparación con", "en conclusión", "en concreto", "en conformidad con", "en consecuencia", "en consiguiente", "en contraste con", "en cualquier caso", "en cuanto", "en cuanto a", "en definitiva", "en efecto", "en el caso de que", "en este sentido", "en fin", "en fin de cuentas", "en general", "en lugar de", "en otras palabras", "en otro orden", "en otros términos", "en particular", "en primer lugar", "en primer término", "en primera instancia", "en realidad", "en relación a", "en relación con", "en representación de", "en resumen", "en resumidas cuentas", "en segundo lugar", "en seguida", "en síntesis", "en suma", "en todo caso", "en último término", "en verdad", "en vez de", "en virtud de", "entre ellas figura", "entre ellos figura", "es cierto que", "es decir", "es evidente que", "es incuestionable", "es indudable", "es más", "está claro que", "esto indica", "excepto si", "generalmente por ejemplo", "gracias a", "hasta aquí", "hasta cierto punto", "hasta el momento", "hay que añadir", "igual que", "la mayor parte del tiempo", "la mayoría del tiempo", "lo que es peor", "más tarde", "mejor dicho", "mientras tanto", "mirándolo todo", "nadie puede ignorar", "no faltaría más", "no obstante", "o sea", "otra vez", "otro aspecto", "par ilustrar", "para concluir", "para conclusión", "para continuar", "para empezar", "para finalizar", "para mencionar una cosa", "para que", "para resumir", "para terminar", "pongamos por caso", "por añadidura", "por cierto", "por consiguiente", "por ejemplo", "por el consiguiente", "por el contrario", "por el hecho que", "por eso", "por esta razón", "por esto", "por fin", "por la mayor parte", "por lo general", "por lo que", "por lo tanto", "por otro lado", "por otra parte", "por otro lado", "por supuesto", "por tanto", "por último", "por un lado", "por una parte", "primero que nada", "primero que todo", "pues bien", "puesto que", "rara vez", "resulta que", "sea como sea", "seguidamente entre tanto", "si bien", "siempre que", "siempre y cuando", "sigue que", "sin duda", "sin embargo", "sin ir más lejos", "sobre todo", "supuesto que", "tal como", "tales como", "tan pronto como", "tanto como", "una vez", "ya que"];
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



},{}],193:[function(require,module,exports){
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



},{"../helpers/html.js":178,"../stringProcessing/quotes.js":195,"../stringProcessing/unifyWhitespace.js":200,"lodash/filter":136,"lodash/flatMap":137,"lodash/forEach":138,"lodash/isEmpty":150,"lodash/isNaN":154,"lodash/isUndefined":161,"lodash/map":163,"lodash/memoize":164,"lodash/negate":165,"tokenizer2/core":176}],194:[function(require,module,exports){
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



},{"./removePunctuation.js":197,"./stripHTMLTags.js":198,"./stripSpaces.js":199,"lodash/filter":136,"lodash/map":163}],195:[function(require,module,exports){
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



},{}],196:[function(require,module,exports){
"use strict";

var getWords = require("../stringProcessing/getWords.js");
var getSentences = require("../stringProcessing/getSentences.js");
var WordCombination = require("../values/WordCombination.js");
var normalizeQuotes = require("../stringProcessing/quotes.js").normalize;
var germanFunctionWords = require("../researches/german/functionWords.js");
var englishFunctionWords = require("../researches/english/functionWords.js");
var dutchFunctionWords = require("../researches/dutch/functionWords.js");
var spanishFunctionWords = require("../researches/spanish/functionWords.js");
var italianFunctionWords = require("../researches/italian/functionWords.js");
var frenchFunctionWords = require("../researches/french/functionWords.js");
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
// First four characters: en dash, em dash, hyphen-minus, and copyright sign.
var specialCharacters = ["–", "—", "-", "\xA9", "#", "%", "/", "\\", "$", "€", "£", "*", "•", "|", "→", "←", "}", "{", "//", "||", "\u200B"];
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
    var words = void 0,
        combination = void 0;
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
 * Filters word combinations that consist of a single one-character word.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterOneCharacterWordCombinations(wordCombinations) {
    return wordCombinations.filter(function (combination) {
        return !(combination.getLength() === 1 && combination.getWords()[0].length <= 1);
    });
}
/**
 * Filters word combinations containing certain function words at any position.
 *
 * @param {WordCombination[]} wordCombinations The word combinations to filter.
 * @param {array} functionWords The list of function words.
 * @returns {WordCombination[]} Filtered word combinations.
 */
function filterFunctionWordsAnywhere(wordCombinations, functionWords) {
    return wordCombinations.filter(function (combination) {
        return isEmpty(intersection(functionWords, combination.getWords()));
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
function filterFunctionWordsAtBeginningAndEnding(wordCombinations, functionWords) {
    wordCombinations = filterFunctionWordsAtBeginning(wordCombinations, functionWords);
    wordCombinations = filterFunctionWordsAtEnding(wordCombinations, functionWords);
    return wordCombinations;
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
 * Filters the list of word combination objects based on the language-specific function word filters.
 * Word combinations with specific parts of speech are removed.
 *
 * @param {Array} combinations The list of word combination objects.
 * @param {Function} functionWords The function containing the lists of function words.
 * @returns {Array} The filtered list of word combination objects.
 */
function filterFunctionWords(combinations, functionWords) {
    combinations = filterFunctionWordsAnywhere(combinations, functionWords().filteredAnywhere);
    combinations = filterFunctionWordsAtBeginningAndEnding(combinations, functionWords().filteredAtBeginningAndEnding);
    combinations = filterFunctionWordsAtEnding(combinations, functionWords().filteredAtEnding);
    combinations = filterFunctionWordsAtBeginning(combinations, functionWords().filteredAtBeginning);
    return combinations;
}
/**
 * Filters the list of word combination objects based on function word filters, a special character filter and
 * a one-character filter.
 *
 * @param {Array} combinations The list of word combination objects.
 * @param {Function} functionWords The function containing the lists of function words.
 * @returns {Array} The filtered list of word combination objects.
 */
function filterCombinations(combinations, functionWords) {
    combinations = filterFunctionWordsAnywhere(combinations, specialCharacters);
    combinations = filterOneCharacterWordCombinations(combinations);
    combinations = filterFunctionWords(combinations, functionWords);
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
    var functionWords = void 0;
    switch (getLanguage(locale)) {
        case "de":
            functionWords = germanFunctionWords;
            break;
        case "nl":
            functionWords = dutchFunctionWords;
            break;
        case "fr":
            functionWords = frenchFunctionWords;
            break;
        case "es":
            functionWords = spanishFunctionWords;
            break;
        case "it":
            functionWords = italianFunctionWords;
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
    combinations = filterCombinations(combinations, functionWords);
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
    filterFunctionWordsAtEnding: filterFunctionWordsAtEnding,
    filterFunctionWordsAtBeginning: filterFunctionWordsAtBeginning,
    filterFunctionWords: filterFunctionWordsAtBeginningAndEnding,
    filterFunctionWordsAnywhere: filterFunctionWordsAnywhere,
    filterOnDensity: filterOnDensity,
    filterOneCharacterWordCombinations: filterOneCharacterWordCombinations
};



},{"../helpers/getLanguage.js":177,"../researches/dutch/functionWords.js":179,"../researches/english/functionWords.js":181,"../researches/french/functionWords.js":184,"../researches/german/functionWords.js":186,"../researches/italian/functionWords.js":189,"../researches/spanish/functionWords.js":191,"../stringProcessing/getSentences.js":193,"../stringProcessing/getWords.js":194,"../stringProcessing/quotes.js":195,"../values/WordCombination.js":201,"lodash/filter":136,"lodash/flatMap":137,"lodash/forEach":138,"lodash/has":140,"lodash/includes":143,"lodash/intersection":144,"lodash/isEmpty":150,"lodash/map":163,"lodash/take":169,"lodash/values":175}],197:[function(require,module,exports){
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



},{}],198:[function(require,module,exports){
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



},{"../helpers/html.js":178,"../stringProcessing/stripSpaces.js":199}],199:[function(require,module,exports){
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



},{}],200:[function(require,module,exports){
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



},{}],201:[function(require,module,exports){
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



},{"lodash/forEach":138,"lodash/has":140}]},{},[6]);
