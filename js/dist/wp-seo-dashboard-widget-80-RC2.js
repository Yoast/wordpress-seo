yoastWebpackJsonp([8],{

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (false) {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = require('./factoryWithTypeCheckers')(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(384)();
}


/***/ }),

/***/ 121:
/***/ (function(module, exports, __webpack_require__) {

var listCacheClear = __webpack_require__(404),
    listCacheDelete = __webpack_require__(405),
    listCacheGet = __webpack_require__(406),
    listCacheHas = __webpack_require__(407),
    listCacheSet = __webpack_require__(408);

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


/***/ }),

/***/ 143:
/***/ (function(module, exports, __webpack_require__) {

var isSymbol = __webpack_require__(93);

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


/***/ }),

/***/ 148:
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(233);

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


/***/ }),

/***/ 149:
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(32),
    isKey = __webpack_require__(248),
    stringToPath = __webpack_require__(390),
    toString = __webpack_require__(379);

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


/***/ }),

/***/ 150:
/***/ (function(module, exports) {

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


/***/ }),

/***/ 160:
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(52),
    root = __webpack_require__(36);

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),

/***/ 1992:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(25);

var _reactDom2 = _interopRequireDefault(_reactDom);

__webpack_require__(91);

var _SeoAssessment = __webpack_require__(453);

var _SeoAssessment2 = _interopRequireDefault(_SeoAssessment);

var _ScoreAssessments = __webpack_require__(237);

var _ScoreAssessments2 = _interopRequireDefault(_ScoreAssessments);

var _getFeed2 = __webpack_require__(1993);

var _getFeed3 = _interopRequireDefault(_getFeed2);

var _WordpressFeed = __webpack_require__(455);

var _WordpressFeed2 = _interopRequireDefault(_WordpressFeed);

var _colors = __webpack_require__(4);

var _colors2 = _interopRequireDefault(_colors);

var _i18n = __webpack_require__(514);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global wpseoDashboardWidgetL10n, wpseoApi, jQuery */

var DashboardWidget = function (_React$Component) {
	_inherits(DashboardWidget, _React$Component);

	/**
  * Creates the components and initializes its state.
  */
	function DashboardWidget() {
		_classCallCheck(this, DashboardWidget);

		var _this = _possibleConstructorReturn(this, (DashboardWidget.__proto__ || Object.getPrototypeOf(DashboardWidget)).call(this));

		_this.state = {
			statistics: null,
			ryte: null,
			feed: null
		};

		_this.getStatistics();
		_this.getRyte();
		_this.getFeed();
		return _this;
	}

	/**
  * Returns a color to be used for a given score.
  *
  * @param {string} score The score, expected to be 'na', 'bad', 'ok', 'good' or 'noindex'.
  *
  * @returns {string} The color to use for this score. Defaults to grey if no such color exists.
  */


	_createClass(DashboardWidget, [{
		key: "getStatistics",


		/**
   * Fetches data from the statistics endpoint, parses it and sets it to the state.
   *
   * @returns {void}
   */
		value: function getStatistics() {
			var _this2 = this;

			wpseoApi.get("statistics", function (response) {
				var statistics = {};

				statistics.seoScores = response.seo_scores.map(function (score) {
					return {
						value: parseInt(score.count, 10),
						color: DashboardWidget.getColorFromScore(score.seo_rank),
						html: "<a href=\"" + score.link + "\">" + score.label + "</a>"
					};
				});

				// Wrap in a div and get the text to HTML decode.
				statistics.header = jQuery("<div>" + response.header + "</div>").text();

				_this2.setState({ statistics: statistics });
			});
		}

		/**
   * Fetches data from the Ryte endpoint, parses it and sets it to the state.
   *
   * @returns {void}
   */

	}, {
		key: "getRyte",
		value: function getRyte() {
			var _this3 = this;

			wpseoApi.get("ryte", function (response) {
				if (!response.ryte) {
					return;
				}

				var ryte = {
					scores: [{
						color: DashboardWidget.getColorFromScore(response.ryte.score),
						html: response.ryte.label
					}],
					canFetch: response.ryte.can_fetch
				};

				_this3.setState({ ryte: ryte });
			});
		}

		/**
   * Fetches data from the yoast.com feed, parses it and sets it to the state.
   *
   * @returns {void}
   */

	}, {
		key: "getFeed",
		value: function getFeed() {
			var _this4 = this;

			// Developer note: this link should -not- be converted to a shortlink.
			(0, _getFeed3.default)("https://yoast.com/feed/widget/", 2).then(function (feed) {
				feed.items = feed.items.map(function (item) {
					item.description = jQuery("<div>" + item.description + "</div>").text();
					item.description = item.description.replace("The post " + item.title + " appeared first on Yoast.", "").trim();
					item.content = jQuery("<div>" + item.content + "</div>").text();

					return item;
				});

				_this4.setState({ feed: feed });
			}).catch(function (error) {
				return console.log(error);
			});
		}

		/**
   * Returns the SEO Assessment sub-component.
   *
   * @returns {ReactElement} The SEO Assessment component.
   */

	}, {
		key: "getSeoAssessment",
		value: function getSeoAssessment() {
			if (this.state.statistics === null) {
				return null;
			}

			return yoast._wp.element.createElement(_SeoAssessment2.default, { key: "yoast-seo-posts-assessment",
				seoAssessmentText: this.state.statistics.header,
				seoAssessmentItems: this.state.statistics.seoScores });
		}

		/**
   * Returns the Ryte Assessment sub-component.
   *
   * @returns {ReactElement} The Ryte Assessment component.
   */

	}, {
		key: "getRyteAssessment",
		value: function getRyteAssessment() {
			if (this.state.ryte === null) {
				return null;
			}

			return yoast._wp.element.createElement(
				"div",
				{ id: "yoast-seo-ryte-assessment", key: "yoast-seo-ryte-assessment" },
				yoast._wp.element.createElement(
					"h3",
					null,
					wpseoDashboardWidgetL10n.ryte_header
				),
				yoast._wp.element.createElement(_ScoreAssessments2.default, { items: this.state.ryte.scores }),
				yoast._wp.element.createElement(
					"div",
					null,
					this.state.ryte.canFetch && yoast._wp.element.createElement(
						"a",
						{ className: "fetch-status button", href: wpseoDashboardWidgetL10n.ryte_fetch_url },
						wpseoDashboardWidgetL10n.ryte_fetch
					),
					yoast._wp.element.createElement(
						"a",
						{ className: "landing-page button", href: wpseoDashboardWidgetL10n.ryte_landing_url, target: "_blank" },
						wpseoDashboardWidgetL10n.ryte_analyze
					)
				)
			);
		}

		/**
   * Returns the yoast.com feed sub-component.
   *
   * @returns {ReactElement} The yoast.com feed component.
   */

	}, {
		key: "getYoastFeed",
		value: function getYoastFeed() {
			if (this.state.feed === null) {
				return null;
			}

			return yoast._wp.element.createElement(_WordpressFeed2.default, {
				key: "yoast-seo-blog-feed",
				title: wpseoDashboardWidgetL10n.feed_header,
				feed: this.state.feed,
				footerHtml: wpseoDashboardWidgetL10n.feed_footer });
		}

		/**
   * Renders the component.
   *
   * @returns {ReactElement} The component.
   */

	}, {
		key: "render",
		value: function render() {
			var contents = [this.getSeoAssessment(), this.getRyteAssessment(), this.getYoastFeed()].filter(function (item) {
				return item !== null;
			});

			if (contents.length === 0) {
				return null;
			}

			return yoast._wp.element.createElement(
				"div",
				null,
				contents
			);
		}
	}], [{
		key: "getColorFromScore",
		value: function getColorFromScore(score) {
			return _colors2.default["$color_" + score] || _colors2.default.$color_grey;
		}
	}]);

	return DashboardWidget;
}(_react2.default.Component);

var element = document.getElementById("yoast-seo-dashboard-widget");

if (element) {
	(0, _i18n.setYoastComponentsL10n)();

	_reactDom2.default.render(yoast._wp.element.createElement(DashboardWidget, null), element);
}

/***/ }),

/***/ 1993:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseFeed = parseFeed;
exports.default = getFeed;
/**
 * @typedef  {Object}     Feed
 * @property {string}     title       The title of the website.
 * @property {string}     description A description of the website.
 * @property {string}     link        A link to the website.
 * @property {FeedItem[]} items     The items in the feed.
 */

/**
 * @typedef  {Object} FeedItem
 * @property {string} title       The title of the item.
 * @property {string} content     The content of the item, will be HTML encoded.
 * @property {string} description A summary of the content, will be HTML encoded.
 * @property {string} link        A link to the item.
 * @property {string} creator     The creator of the item.
 * @property {string} date        The publication date of the item.
 */

/**
 * Parses a RSS Feed.
 *
 * @param {string} raw      The raw XML of the feed.
 * @param {number} maxItems The maximum amount of items to parse, 0 for all items.
 *
 * @returns {Promise.<Feed>} A promise which resolves with the parsed Feed.
 */
function parseFeed(raw) {
  var maxItems = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  return new Promise(function (resolve, reject) {
    try {
      var parser = new DOMParser();
      var parsed = parser.parseFromString(raw, 'application/xml');
      var nsResolver = parsed.createNSResolver(parsed.documentElement);

      var result = getFeedMeta(parsed);
      result.items = getFeedItems(parsed, nsResolver, maxItems);

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Returns the feed meta from a parsed Feed.
 *
 * @param {Document} parsed A parsed XML document.
 *
 * @returns {Feed} A Feed object containing only the meta attributes.
 */
function getFeedMeta(parsed) {
  var result = {};

  result.title = getXPathText('/rss/channel/title', parsed);
  result.description = getXPathText('/rss/channel/description', parsed);
  result.link = getXPathText('/rss/channel/link', parsed);

  return result;
}

/**
 * Returns the feed items from a parsed Feed.
 *
 * @param {Document}        parsed     A parsed XML document.
 * @param {XPathNSResolver} nsResolver A namespace resolver for the parsed document.
 * @param {number}          maxItems   The maximum amount of items to return, 0 for all items.
 *
 * @returns {FeedItem[]} An array of FeedItem objects.
 */
function getFeedItems(parsed, nsResolver, maxItems) {
  var snapshots = getXPathSnapshots('/rss/channel/item', parsed);
  var count = snapshots.snapshotLength;
  var items = [];

  if (maxItems !== 0) {
    count = Math.min(count, maxItems);
  }

  for (var i = 0; i < count; i++) {
    var snapshot = snapshots.snapshotItem(i);
    items.push(getFeedItem(parsed, snapshot, nsResolver));
  }

  return items;
}

/**
 * Returns a single feed item from a snapshot.
 *
 * @param {Document}        parsed     A parsed XML document.
 * @param {Node}            snapshot   A snapshot returned from the snapshotItem method of a XPathResult.
 * @param {XPathNSResolver} nsResolver A namespace resolver for the parsed document.
 *
 * @returns {FeedItem} The FeedItem representing the provided snapshot.
 */
function getFeedItem(parsed, snapshot, nsResolver) {
  var item = {};

  item.title = getXPathText('child::title', parsed, snapshot);
  item.link = getXPathText('child::link', parsed, snapshot);
  item.content = getXPathText('child::content:encoded', parsed, snapshot, nsResolver);
  item.description = getXPathText('child::description', parsed, snapshot);
  item.creator = getXPathText('child::dc:creator', parsed, snapshot, nsResolver);
  item.date = getXPathText('child::pubDate', parsed, snapshot);

  return item;
}

/**
 * Returns the string contents of the given xpath query on the provided document.
 *
 * @param {string}          xpath      The xpath query to run.
 * @param {Document}        document   A parsed XML document.
 * @param {Node}            context    A Node in the document to use as context for the query.
 * @param {XPathNSResolver} nsResolver A namespace resolver for the parsed document.
 *
 * @returns {string|undefined} The string result of the xpath query.
 */
function getXPathText(xpath, document) {
  var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var nsResolver = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  var result = document.evaluate(xpath, context || document, nsResolver, XPathResult.STRING_TYPE, null);

  if (result.stringValue) {
    return result.stringValue;
  }

  return undefined;
}

/**
 * Returns a ORDERED_NODE_SNAPSHOT_TYPE XpathResult for the given xpath query on the provided document.
 *
 * @param {string}          xpath      The xpath query to run.
 * @param {Document}        document   A parsed XML document.
 * @param {Node}            context    A Node in the document to use as context for the query.
 * @param {XPathNSResolver} nsResolver A namespace resolver for the parsed document.
 *
 * @returns {XPathResult} The result of the xpath query.
 */
function getXPathSnapshots(xpath, document) {
  var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var nsResolver = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  return document.evaluate(xpath, context || document, nsResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
}

/**
 * Grabs an RSS feed from the requested URL and parses it.
 *
 * @param {string} url      The URL the feed is located at.
 * @param {int}    maxItems The amount of items you wish returned, 0 for all items.
 *
 * @returns {Promise.<Feed>} The retrieved feed.
 */
function getFeed(url) {
  var maxItems = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  return fetch(url).then(function (response) {
    return response.text();
  }).then(function (raw) {
    return parseFeed(raw, maxItems);
  });
}

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

module.exports = window.yoast.styledComponents;

/***/ }),

/***/ 229:
/***/ (function(module, exports, __webpack_require__) {

var mapCacheClear = __webpack_require__(393),
    mapCacheDelete = __webpack_require__(409),
    mapCacheGet = __webpack_require__(411),
    mapCacheHas = __webpack_require__(412),
    mapCacheSet = __webpack_require__(413);

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


/***/ }),

/***/ 230:
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(67),
    isObject = __webpack_require__(53);

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


/***/ }),

/***/ 233:
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(149),
    toKey = __webpack_require__(143);

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


/***/ }),

/***/ 234:
/***/ (function(module, exports) {

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


/***/ }),

/***/ 237:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__(2);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ScoreAssessmentItem = _styledComponents2.default.li.withConfig({
	displayName: "ScoreAssessments__ScoreAssessmentItem"
})(["display:table-row;font-size:14px;"]);

var ScoreAssessmentPart = _styledComponents2.default.span.withConfig({
	displayName: "ScoreAssessments__ScoreAssessmentPart"
})(["display:table-cell;padding:2px;"]);

var ScoreAssessmentBullet = (0, _styledComponents2.default)(ScoreAssessmentPart).withConfig({
	displayName: "ScoreAssessments__ScoreAssessmentBullet"
})(["position:relative;top:1px;display:inline-block;height:8px;width:8px;border-radius:50%;background-color:", ";"], function (props) {
	return props.scoreColor;
});

ScoreAssessmentBullet.propTypes = {
	scoreColor: _propTypes2.default.string.isRequired
};

var ScoreAssessmentText = (0, _styledComponents2.default)(ScoreAssessmentPart).withConfig({
	displayName: "ScoreAssessments__ScoreAssessmentText"
})(["padding-left:8px;width:100%;"]);

var ScoreAssessmentScore = (0, _styledComponents2.default)(ScoreAssessmentPart).withConfig({
	displayName: "ScoreAssessments__ScoreAssessmentScore"
})(["font-weight:600;text-align:right;padding-left:16px;"]);

var ScoreAssessment = function ScoreAssessment(props) {
	return _react2.default.createElement(
		ScoreAssessmentItem,
		{
			className: "" + props.className },
		_react2.default.createElement(ScoreAssessmentBullet, {
			className: props.className + "-bullet",
			scoreColor: props.scoreColor }),
		_react2.default.createElement(ScoreAssessmentText, {
			className: props.className + "-text",
			dangerouslySetInnerHTML: { __html: props.html } }),
		props.value && _react2.default.createElement(
			ScoreAssessmentScore,
			{
				className: props.className + "-score" },
			props.value
		)
	);
};

ScoreAssessment.propTypes = {
	className: _propTypes2.default.string.isRequired,
	scoreColor: _propTypes2.default.string.isRequired,
	html: _propTypes2.default.string.isRequired,
	value: _propTypes2.default.number
};

var ScoreAssessmentList = _styledComponents2.default.ul.withConfig({
	displayName: "ScoreAssessments__ScoreAssessmentList"
})(["display:table;box-sizing:border-box;list-style:none;max-width:100%;min-width:200px;margin:8px 0;padding:0 8px;"]);

var ScoreAssessments = function ScoreAssessments(props) {
	return _react2.default.createElement(
		ScoreAssessmentList,
		{
			className: props.className,
			role: "list" },
		props.items.map(function (item, index) {
			return _react2.default.createElement(ScoreAssessment, {
				className: props.className + "__item",
				key: index,
				scoreColor: item.color,
				html: item.html,
				value: item.value });
		})
	);
};

ScoreAssessments.propTypes = {
	className: _propTypes2.default.string,
	items: _propTypes2.default.arrayOf(_propTypes2.default.shape({
		color: _propTypes2.default.string.isRequired,
		html: _propTypes2.default.string.isRequired,
		value: _propTypes2.default.number
	}))
};

ScoreAssessments.defaultProps = {
	className: "score-assessments"
};

exports.default = ScoreAssessments;

/***/ }),

/***/ 248:
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(32),
    isSymbol = __webpack_require__(93);

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


/***/ }),

/***/ 249:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),

/***/ 250:
/***/ (function(module, exports) {

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


/***/ }),

/***/ 32:
/***/ (function(module, exports) {

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


/***/ }),

/***/ 36:
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(249);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ 379:
/***/ (function(module, exports, __webpack_require__) {

var baseToString = __webpack_require__(380);

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


/***/ }),

/***/ 380:
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(70),
    arrayMap = __webpack_require__(234),
    isArray = __webpack_require__(32),
    isSymbol = __webpack_require__(93);

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


/***/ }),

/***/ 384:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var emptyFunction = __webpack_require__(64);
var invariant = __webpack_require__(5);
var ReactPropTypesSecret = __webpack_require__(385);

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    invariant(
      false,
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),

/***/ 385:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ 388:
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(70);

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


/***/ }),

/***/ 389:
/***/ (function(module, exports) {

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


/***/ }),

/***/ 390:
/***/ (function(module, exports, __webpack_require__) {

var memoizeCapped = __webpack_require__(391);

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


/***/ }),

/***/ 391:
/***/ (function(module, exports, __webpack_require__) {

var memoize = __webpack_require__(392);

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


/***/ }),

/***/ 392:
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(229);

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


/***/ }),

/***/ 393:
/***/ (function(module, exports, __webpack_require__) {

var Hash = __webpack_require__(394),
    ListCache = __webpack_require__(121),
    Map = __webpack_require__(160);

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


/***/ }),

/***/ 394:
/***/ (function(module, exports, __webpack_require__) {

var hashClear = __webpack_require__(395),
    hashDelete = __webpack_require__(400),
    hashGet = __webpack_require__(401),
    hashHas = __webpack_require__(402),
    hashSet = __webpack_require__(403);

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


/***/ }),

/***/ 395:
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(83);

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


/***/ }),

/***/ 396:
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(230),
    isMasked = __webpack_require__(397),
    isObject = __webpack_require__(53),
    toSource = __webpack_require__(250);

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


/***/ }),

/***/ 397:
/***/ (function(module, exports, __webpack_require__) {

var coreJsData = __webpack_require__(398);

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


/***/ }),

/***/ 398:
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(36);

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),

/***/ 399:
/***/ (function(module, exports) {

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


/***/ }),

/***/ 4:
/***/ (function(module, exports) {

module.exports = {"$palette_white":"#fff","$palette_grey_ultra_light":"#f7f7f7","$palette_grey_light":"#f1f1f1","$palette_grey":"#ddd","$palette_grey_medium":"#ccc","$palette_grey_disabled":"#a0a5aa","$palette_grey_medium_dark":"#888","$palette_grey_text":"#646464","$palette_grey_dark":"#555","$palette_black":"#000","$palette_purple":"#5d237a","$palette_purple_dark":"#6c2548","$palette_pink":"#d73763","$palette_pink_light":"#e1bee7","$palette_pink_dark":"#a4286a","$palette_blue":"#0066cd","$palette_blue_light":"#a9a9ce","$palette_blue_medium":"#1e8cbe","$palette_blue_dark":"#084a67","$palette_green":"#77b227","$palette_green_light":"#7ad03a","$palette_green_medium_light":"#64a60a","$palette_green_medium":"#008a00","$palette_green_blue":"#009288","$palette_orange":"#dc5c04","$palette_orange_light":"#ee7c1b","$palette_red":"#dc3232","$palette_red_light":"#f9bdbd","$palette_yellow":"#ffeb3b","$palette_yellow_score":"#f5c819","$color_bad":"#dc3232","$color_ok":"#ee7c1b","$color_good":"#7ad03a","$color_noindex":"#1e8cbe","$color_score_icon":"#888","$color_white":"#fff","$color_black":"#000","$color_green":"#77b227","$color_green_medium":"#008a00","$color_green_blue":"#009288","$color_grey":"#ddd","$color_grey_dark":"#555","$color_purple":"#5d237a","$color_purple_dark":"#6c2548","$color_pink":"#d73763","$color_pink_light":"#e1bee7","$color_pink_dark":"#a4286a","$color_blue":"#0066cd","$color_blue_light":"#a9a9ce","$color_blue_dark":"#084a67","$color_red":"#dc3232","$color_border_light":"#f7f7f7","$color_border":"#ccc","$color_input_border":"#ddd","$color_background_light":"#f7f7f7","$color_button":"#f7f7f7","$color_button_text":"#555","$color_button_border":"#ccc","$color_button_hover":"#fff","$color_button_border_hover":"#888","$color_button_text_hover":"#000","$color_button_border_active":"#000","$color_headings":"#555","$color_marker_inactive":"#555","$color_marker_active":"#fff","$color_marker_disabled":"#a0a5aa","$color_error":"#dc3232","$color_orange":"#dc5c04","$color_orange_hover":"#c35204","$color_grey_hover":"#cecece","$color_pink_hover":"#cc2956","$color_grey_cta":"#ddd","$color_grey_line":"#ddd","$color_grey_quote":"#646464","$color_grey_text":"#646464","$color_snippet_focus":"#1e8cbe","$color_snippet_hover":"#ccc","$color_snippet_active":"#555","$color_grey_medium_dark":"#888","$color_green_medium_light":"#64a60a","$color_grey_disabled":"#a0a5aa","$color_grey_medium":"#ccc","$color_grey_light":"#f1f1f1","$color_yellow":"#ffeb3b","$color_yellow_score":"#f5c819","$color_error_message":"#f9bdbd"}

/***/ }),

/***/ 400:
/***/ (function(module, exports) {

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


/***/ }),

/***/ 401:
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(83);

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


/***/ }),

/***/ 402:
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(83);

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


/***/ }),

/***/ 403:
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(83);

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


/***/ }),

/***/ 404:
/***/ (function(module, exports) {

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


/***/ }),

/***/ 405:
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(84);

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


/***/ }),

/***/ 406:
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(84);

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


/***/ }),

/***/ 407:
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(84);

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


/***/ }),

/***/ 408:
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(84);

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


/***/ }),

/***/ 409:
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(85);

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


/***/ }),

/***/ 410:
/***/ (function(module, exports) {

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


/***/ }),

/***/ 411:
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(85);

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


/***/ }),

/***/ 412:
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(85);

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


/***/ }),

/***/ 413:
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(85);

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


/***/ }),

/***/ 453:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__(2);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _StackedProgressBar = __webpack_require__(454);

var _StackedProgressBar2 = _interopRequireDefault(_StackedProgressBar);

var _ScoreAssessments = __webpack_require__(237);

var _ScoreAssessments2 = _interopRequireDefault(_ScoreAssessments);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * SeoAssessment container.
 */
var SeoAssessmentContainer = _styledComponents2.default.div.withConfig({
	displayName: "SeoAssessment__SeoAssessmentContainer"
})([""]);

/**
 * SeoAssessment top text.
 */
var SeoAssessmentText = _styledComponents2.default.p.withConfig({
	displayName: "SeoAssessment__SeoAssessmentText"
})(["font-size:14px;"]);

/**
 * The Dashboard Seo Assessment component.
 *
 * @param {object} props The component props.
 *
 * @returns {ReactElement} The react component.
 */
var SeoAssessment = function SeoAssessment(props) {
	return _react2.default.createElement(
		SeoAssessmentContainer,
		{
			className: props.className },
		_react2.default.createElement(
			SeoAssessmentText,
			{
				className: props.className + "__text" },
			props.seoAssessmentText
		),
		_react2.default.createElement(_StackedProgressBar2.default, {
			className: "progress",
			items: props.seoAssessmentItems,
			barHeight: props.barHeight
		}),
		_react2.default.createElement(_ScoreAssessments2.default, {
			className: "assessments",
			items: props.seoAssessmentItems
		})
	);
};

SeoAssessment.propTypes = {
	className: _propTypes2.default.string,
	seoAssessmentText: _propTypes2.default.string,
	seoAssessmentItems: _propTypes2.default.arrayOf(_propTypes2.default.shape({
		value: _propTypes2.default.number.isRequired,
		color: _propTypes2.default.string.isRequired
	})),
	barHeight: _propTypes2.default.string
};

SeoAssessment.defaultProps = {
	className: "seo-assessment"
};

exports.default = SeoAssessment;

/***/ }),

/***/ 454:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__(2);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StackedProgressBarContainer = _styledComponents2.default.div.withConfig({
	displayName: "StackedProgressBar__StackedProgressBarContainer"
})(["margin:8px 0;height:", ";overflow:hidden;"], function (props) {
	return props.barHeight;
});

var StackedProgressBarProgress = _styledComponents2.default.span.withConfig({
	displayName: "StackedProgressBar__StackedProgressBarProgress"
})(["display:inline-block;vertical-align:top;width:", ";background-color:", ";height:100%;"], function (props) {
	return props.progressWidth + "%";
}, function (props) {
	return props.progressColor;
});

StackedProgressBarProgress.propTypes = {
	progressWidth: _propTypes2.default.number.isRequired,
	progressColor: _propTypes2.default.string.isRequired
};

var StackedProgressBar = function StackedProgressBar(props) {
	var totalValue = 0;
	for (var i = 0; i < props.items.length; i++) {
		props.items[i].value = Math.max(props.items[i].value, 0);
		totalValue += props.items[i].value;
	}

	if (totalValue <= 0) {
		return null;
	}

	return _react2.default.createElement(
		StackedProgressBarContainer,
		{
			className: props.className,
			barHeight: props.barHeight },
		props.items.map(function (item, index) {
			return _react2.default.createElement(StackedProgressBarProgress, {
				className: props.className + "__part",
				key: index,
				progressColor: item.color,
				progressWidth: item.value / totalValue * 100 });
		})
	);
};

StackedProgressBar.propTypes = {
	className: _propTypes2.default.string,
	items: _propTypes2.default.arrayOf(_propTypes2.default.shape({
		value: _propTypes2.default.number.isRequired,
		color: _propTypes2.default.string.isRequired
	})),
	barHeight: _propTypes2.default.string
};

StackedProgressBar.defaultProps = {
	className: "stacked-progress-bar",
	barHeight: "24px"
};

exports.default = StackedProgressBar;

/***/ }),

/***/ 455:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__(2);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef  {Object}     Feed
 * @property {string}     title       The title of the website.
 * @property {string}     description A description of the website.
 * @property {string}     link        A link to the website.
 * @property {FeedItem[]} items       The items in the feed.
 */

/**
 * @typedef  {Object} FeedItem
 * @property {string} title       The title of the item.
 * @property {string} content     The content of the item, will be HTML encoded.
 * @property {string} description A summary of the content, will be HTML encoded.
 * @property {string} link        A link to the item.
 * @property {string} creator     The creator of the item.
 * @property {string} date        The publication date of the item.
 */

var WordpressFeedContainer = _styledComponents2.default.div.withConfig({
	displayName: "WordpressFeed__WordpressFeedContainer"
})(["box-sizing:border-box;p,a{font-size:14px;margin:0;}"]);

var WordpressFeedHeader = _styledComponents2.default.h3.withConfig({
	displayName: "WordpressFeed__WordpressFeedHeader"
})(["margin:8px 0;font-size:1em;"]);

var WordpressFeedList = _styledComponents2.default.ul.withConfig({
	displayName: "WordpressFeed__WordpressFeedList"
})(["margin:0;list-style:none;padding:0;"]);

var WordpressFeedLink = _styledComponents2.default.a.withConfig({
	displayName: "WordpressFeed__WordpressFeedLink"
})(["display:inline-block;padding-bottom:4px;"]);

var A11yNotice = _styledComponents2.default.span.withConfig({
	displayName: "WordpressFeed__A11yNotice"
})(["border:0;clip:rect(1px,1px,1px,1px);clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute !important;width:1px;word-wrap:normal !important;"]);

var WordpressFeedListItemContainer = _styledComponents2.default.li.withConfig({
	displayName: "WordpressFeed__WordpressFeedListItemContainer"
})(["margin:8px 0;overflow:hidden;"]);

var WordpressFeedFooter = _styledComponents2.default.div.withConfig({
	displayName: "WordpressFeed__WordpressFeedFooter"
})(["a{margin:8px 0 0;}"]);

var WordpressFeedListItem = function WordpressFeedListItem(props) {
	return _react2.default.createElement(
		WordpressFeedListItemContainer,
		{
			className: props.className },
		_react2.default.createElement(
			WordpressFeedLink,
			{
				className: props.className + "-link",
				href: props.link,
				target: "_blank",
				rel: "noopener noreferrer" },
			props.title,
			_react2.default.createElement(
				A11yNotice,
				null,
				"( Opens in a new browser tab )"
			)
		),
		_react2.default.createElement(
			"p",
			{ className: props.className + "-description" },
			props.description
		)
	);
};

WordpressFeedListItem.propTypes = {
	className: _propTypes2.default.string.isRequired,
	title: _propTypes2.default.string.isRequired,
	link: _propTypes2.default.string.isRequired,
	description: _propTypes2.default.string.isRequired
};

/**
 * Displays a parsed wordpress feed.
 *
 * @param {Object} props            The component props.
 * @param {Feed} props.feed         The feed object.
 * @param {string} props.title      The title. Defaults to feed title.
 * @param {string} props.footerHtml The footer HTML contents.
 * @param {string} props.feedLink   The footer link. Defaults to feed link.
 *
 * @returns {ReactElement} The WordpressFeed component.
 */
var WordpressFeed = function WordpressFeed(props) {
	return _react2.default.createElement(
		WordpressFeedContainer,
		{
			className: props.className },
		_react2.default.createElement(
			WordpressFeedHeader,
			{
				className: props.className + "__header" },
			props.title ? props.title : props.feed.title
		),
		_react2.default.createElement(
			WordpressFeedList,
			{
				className: props.className + "__posts",
				role: "list" },
			props.feed.items.map(function (item) {
				return _react2.default.createElement(WordpressFeedListItem, {
					className: props.className + "__post",
					key: item.link,
					title: item.title,
					link: item.link,
					description: item.description });
			})
		),
		props.footerHtml && _react2.default.createElement(
			WordpressFeedFooter,
			{
				className: props.className + "__footer" },
			_react2.default.createElement(WordpressFeedLink, {
				className: props.className + "__footer-link",
				href: props.feedLink ? props.feedLink : props.feed.link,
				target: "_blank",
				rel: "noopener noreferrer",
				dangerouslySetInnerHTML: { __html: props.footerHtml } })
		)
	);
};

WordpressFeed.propTypes = {
	className: _propTypes2.default.string,
	feed: _propTypes2.default.object.isRequired,
	title: _propTypes2.default.string,
	footerHtml: _propTypes2.default.string,
	feedLink: _propTypes2.default.string
};

WordpressFeed.defaultProps = {
	className: "wordpress-feed"
};

exports.default = WordpressFeed;

/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (false) {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;

/***/ }),

/***/ 514:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setTextdomainL10n = setTextdomainL10n;
exports.setYoastComponentsL10n = setYoastComponentsL10n;
exports.setWordPressSeoL10n = setWordPressSeoL10n;

var _i18n = __webpack_require__(9);

var _get = __webpack_require__(148);

var _get2 = _interopRequireDefault(_get);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Sets the l10n for the given textdomain in Jed.
 *
 * All the locale data should be available in the l10nNamespace.
 *
 * @param {string} textdomain      The textdomain to set the locale data for.
 * @param {string} [l10nNamespace] The global namespace to get the localization
 *                                 data from.
 *
 * @returns {void}
 */
function setTextdomainL10n(textdomain) {
  var l10nNamespace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "wpseoYoastJSL10n";

  var jed = (0, _i18n.getI18n)();
  var currentTranslations = (0, _get2.default)(jed, ["options", "locale_data", textdomain], false);

  if (currentTranslations === false) {
    var translations = (0, _get2.default)(window, [l10nNamespace, textdomain, "locale_data", textdomain], false);

    if (translations === false) {
      // Jed needs to have meta information in the object keyed by an empty string.
      (0, _i18n.setLocaleData)({ "": {} }, textdomain);
    } else {
      (0, _i18n.setLocaleData)(translations, textdomain);
    }
  }
}

/**
 * Configures the i18n for yoast-components.
 *
 * We call translation functions using `@wordpress/i18n` so we need to register
 * all our strings there too. This function does that.
 *
 * @returns {void}
 */
function setYoastComponentsL10n() {
  setTextdomainL10n("yoast-components");
}

/**
 * Configures the l10n for wordpress-seo-js.
 *
 * We call translation functions using `@wordpress/i18n` so we need to register
 * all our strings there too. This function does that.
 *
 * @returns {void}
 */
function setWordPressSeoL10n() {
  setTextdomainL10n("wordpress-seo");
}

/***/ }),

/***/ 52:
/***/ (function(module, exports, __webpack_require__) {

var baseIsNative = __webpack_require__(396),
    getValue = __webpack_require__(399);

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


/***/ }),

/***/ 53:
/***/ (function(module, exports) {

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


/***/ }),

/***/ 64:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;

/***/ }),

/***/ 67:
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(70),
    getRawTag = __webpack_require__(388),
    objectToString = __webpack_require__(389);

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


/***/ }),

/***/ 70:
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(36);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ 83:
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(52);

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),

/***/ 84:
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(150);

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


/***/ }),

/***/ 85:
/***/ (function(module, exports, __webpack_require__) {

var isKeyable = __webpack_require__(410);

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


/***/ }),

/***/ 87:
/***/ (function(module, exports) {

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


/***/ }),

/***/ 9:
/***/ (function(module, exports) {

module.exports = window.yoast._wp.i18n;

/***/ }),

/***/ 91:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// The babel polyfill sets the _babelPolyfill to true. So only load it ourselves if the variable is undefined or false.
if (typeof window._babelPolyfill === "undefined" || !window._babelPolyfill) {
	// eslint-disable-next-line global-require
	__webpack_require__(236);
}

/***/ }),

/***/ 93:
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(67),
    isObjectLike = __webpack_require__(87);

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


/***/ })

},[1992]);