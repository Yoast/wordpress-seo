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
  module.exports = __webpack_require__(344)();
}


/***/ }),

/***/ 100:
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(31),
    root = __webpack_require__(18);

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),

/***/ 109:
/***/ (function(module, exports, __webpack_require__) {

var mapCacheClear = __webpack_require__(257),
    mapCacheDelete = __webpack_require__(264),
    mapCacheGet = __webpack_require__(266),
    mapCacheHas = __webpack_require__(267),
    mapCacheSet = __webpack_require__(268);

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

/***/ 11:
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

/***/ 112:
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(133);

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

/***/ 116:
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

/***/ 117:
/***/ (function(module, exports) {

module.exports = true;


/***/ }),

/***/ 118:
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ 119:
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ 121:
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(11),
    isSymbol = __webpack_require__(64);

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

/***/ 125:
/***/ (function(module, exports, __webpack_require__) {

var baseToString = __webpack_require__(173);

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

/***/ 130:
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ 131:
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ 132:
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(30),
    isObject = __webpack_require__(23);

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

/***/ 133:
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(91),
    toKey = __webpack_require__(70);

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

/***/ 155:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ }),

/***/ 158:
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(352);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ 159:
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(54);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ 160:
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ 161:
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(162)('keys');
var uid = __webpack_require__(118);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ 162:
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(19);
var global = __webpack_require__(37);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(117) ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ 163:
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ 164:
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ 1645:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(24);

var _reactDom2 = _interopRequireDefault(_reactDom);

__webpack_require__(85);

var _SeoAssessment = __webpack_require__(656);

var _SeoAssessment2 = _interopRequireDefault(_SeoAssessment);

var _ScoreAssessments = __webpack_require__(327);

var _ScoreAssessments2 = _interopRequireDefault(_ScoreAssessments);

var _getFeed2 = __webpack_require__(1646);

var _getFeed3 = _interopRequireDefault(_getFeed2);

var _WordpressFeed = __webpack_require__(658);

var _WordpressFeed2 = _interopRequireDefault(_WordpressFeed);

var _colors = __webpack_require__(4);

var _colors2 = _interopRequireDefault(_colors);

var _i18n = __webpack_require__(504);

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

/***/ 1646:
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

/***/ 165:
/***/ (function(module, exports, __webpack_require__) {

/**
 * @preserve jed.js https://github.com/SlexAxton/Jed
 */
/*
-----------
A gettext compatible i18n library for modern JavaScript Applications

by Alex Sexton - AlexSexton [at] gmail - @SlexAxton

MIT License

A jQuery Foundation project - requires CLA to contribute -
https://contribute.jquery.org/CLA/



Jed offers the entire applicable GNU gettext spec'd set of
functions, but also offers some nicer wrappers around them.
The api for gettext was written for a language with no function
overloading, so Jed allows a little more of that.

Many thanks to Joshua I. Miller - unrtst@cpan.org - who wrote
gettext.js back in 2008. I was able to vet a lot of my ideas
against his. I also made sure Jed passed against his tests
in order to offer easy upgrades -- jsgettext.berlios.de
*/
(function (root, undef) {

  // Set up some underscore-style functions, if you already have
  // underscore, feel free to delete this section, and use it
  // directly, however, the amount of functions used doesn't
  // warrant having underscore as a full dependency.
  // Underscore 1.3.0 was used to port and is licensed
  // under the MIT License by Jeremy Ashkenas.
  var ArrayProto    = Array.prototype,
      ObjProto      = Object.prototype,
      slice         = ArrayProto.slice,
      hasOwnProp    = ObjProto.hasOwnProperty,
      nativeForEach = ArrayProto.forEach,
      breaker       = {};

  // We're not using the OOP style _ so we don't need the
  // extra level of indirection. This still means that you
  // sub out for real `_` though.
  var _ = {
    forEach : function( obj, iterator, context ) {
      var i, l, key;
      if ( obj === null ) {
        return;
      }

      if ( nativeForEach && obj.forEach === nativeForEach ) {
        obj.forEach( iterator, context );
      }
      else if ( obj.length === +obj.length ) {
        for ( i = 0, l = obj.length; i < l; i++ ) {
          if ( i in obj && iterator.call( context, obj[i], i, obj ) === breaker ) {
            return;
          }
        }
      }
      else {
        for ( key in obj) {
          if ( hasOwnProp.call( obj, key ) ) {
            if ( iterator.call (context, obj[key], key, obj ) === breaker ) {
              return;
            }
          }
        }
      }
    },
    extend : function( obj ) {
      this.forEach( slice.call( arguments, 1 ), function ( source ) {
        for ( var prop in source ) {
          obj[prop] = source[prop];
        }
      });
      return obj;
    }
  };
  // END Miniature underscore impl

  // Jed is a constructor function
  var Jed = function ( options ) {
    // Some minimal defaults
    this.defaults = {
      "locale_data" : {
        "messages" : {
          "" : {
            "domain"       : "messages",
            "lang"         : "en",
            "plural_forms" : "nplurals=2; plural=(n != 1);"
          }
          // There are no default keys, though
        }
      },
      // The default domain if one is missing
      "domain" : "messages",
      // enable debug mode to log untranslated strings to the console
      "debug" : false
    };

    // Mix in the sent options with the default options
    this.options = _.extend( {}, this.defaults, options );
    this.textdomain( this.options.domain );

    if ( options.domain && ! this.options.locale_data[ this.options.domain ] ) {
      throw new Error('Text domain set to non-existent domain: `' + options.domain + '`');
    }
  };

  // The gettext spec sets this character as the default
  // delimiter for context lookups.
  // e.g.: context\u0004key
  // If your translation company uses something different,
  // just change this at any time and it will use that instead.
  Jed.context_delimiter = String.fromCharCode( 4 );

  function getPluralFormFunc ( plural_form_string ) {
    return Jed.PF.compile( plural_form_string || "nplurals=2; plural=(n != 1);");
  }

  function Chain( key, i18n ){
    this._key = key;
    this._i18n = i18n;
  }

  // Create a chainable api for adding args prettily
  _.extend( Chain.prototype, {
    onDomain : function ( domain ) {
      this._domain = domain;
      return this;
    },
    withContext : function ( context ) {
      this._context = context;
      return this;
    },
    ifPlural : function ( num, pkey ) {
      this._val = num;
      this._pkey = pkey;
      return this;
    },
    fetch : function ( sArr ) {
      if ( {}.toString.call( sArr ) != '[object Array]' ) {
        sArr = [].slice.call(arguments, 0);
      }
      return ( sArr && sArr.length ? Jed.sprintf : function(x){ return x; } )(
        this._i18n.dcnpgettext(this._domain, this._context, this._key, this._pkey, this._val),
        sArr
      );
    }
  });

  // Add functions to the Jed prototype.
  // These will be the functions on the object that's returned
  // from creating a `new Jed()`
  // These seem redundant, but they gzip pretty well.
  _.extend( Jed.prototype, {
    // The sexier api start point
    translate : function ( key ) {
      return new Chain( key, this );
    },

    textdomain : function ( domain ) {
      if ( ! domain ) {
        return this._textdomain;
      }
      this._textdomain = domain;
    },

    gettext : function ( key ) {
      return this.dcnpgettext.call( this, undef, undef, key );
    },

    dgettext : function ( domain, key ) {
     return this.dcnpgettext.call( this, domain, undef, key );
    },

    dcgettext : function ( domain , key /*, category */ ) {
      // Ignores the category anyways
      return this.dcnpgettext.call( this, domain, undef, key );
    },

    ngettext : function ( skey, pkey, val ) {
      return this.dcnpgettext.call( this, undef, undef, skey, pkey, val );
    },

    dngettext : function ( domain, skey, pkey, val ) {
      return this.dcnpgettext.call( this, domain, undef, skey, pkey, val );
    },

    dcngettext : function ( domain, skey, pkey, val/*, category */) {
      return this.dcnpgettext.call( this, domain, undef, skey, pkey, val );
    },

    pgettext : function ( context, key ) {
      return this.dcnpgettext.call( this, undef, context, key );
    },

    dpgettext : function ( domain, context, key ) {
      return this.dcnpgettext.call( this, domain, context, key );
    },

    dcpgettext : function ( domain, context, key/*, category */) {
      return this.dcnpgettext.call( this, domain, context, key );
    },

    npgettext : function ( context, skey, pkey, val ) {
      return this.dcnpgettext.call( this, undef, context, skey, pkey, val );
    },

    dnpgettext : function ( domain, context, skey, pkey, val ) {
      return this.dcnpgettext.call( this, domain, context, skey, pkey, val );
    },

    // The most fully qualified gettext function. It has every option.
    // Since it has every option, we can use it from every other method.
    // This is the bread and butter.
    // Technically there should be one more argument in this function for 'Category',
    // but since we never use it, we might as well not waste the bytes to define it.
    dcnpgettext : function ( domain, context, singular_key, plural_key, val ) {
      // Set some defaults

      plural_key = plural_key || singular_key;

      // Use the global domain default if one
      // isn't explicitly passed in
      domain = domain || this._textdomain;

      var fallback;

      // Handle special cases

      // No options found
      if ( ! this.options ) {
        // There's likely something wrong, but we'll return the correct key for english
        // We do this by instantiating a brand new Jed instance with the default set
        // for everything that could be broken.
        fallback = new Jed();
        return fallback.dcnpgettext.call( fallback, undefined, undefined, singular_key, plural_key, val );
      }

      // No translation data provided
      if ( ! this.options.locale_data ) {
        throw new Error('No locale data provided.');
      }

      if ( ! this.options.locale_data[ domain ] ) {
        throw new Error('Domain `' + domain + '` was not found.');
      }

      if ( ! this.options.locale_data[ domain ][ "" ] ) {
        throw new Error('No locale meta information provided.');
      }

      // Make sure we have a truthy key. Otherwise we might start looking
      // into the empty string key, which is the options for the locale
      // data.
      if ( ! singular_key ) {
        throw new Error('No translation key found.');
      }

      var key  = context ? context + Jed.context_delimiter + singular_key : singular_key,
          locale_data = this.options.locale_data,
          dict = locale_data[ domain ],
          defaultConf = (locale_data.messages || this.defaults.locale_data.messages)[""],
          pluralForms = dict[""].plural_forms || dict[""]["Plural-Forms"] || dict[""]["plural-forms"] || defaultConf.plural_forms || defaultConf["Plural-Forms"] || defaultConf["plural-forms"],
          val_list,
          res;

      var val_idx;
      if (val === undefined) {
        // No value passed in; assume singular key lookup.
        val_idx = 0;

      } else {
        // Value has been passed in; use plural-forms calculations.

        // Handle invalid numbers, but try casting strings for good measure
        if ( typeof val != 'number' ) {
          val = parseInt( val, 10 );

          if ( isNaN( val ) ) {
            throw new Error('The number that was passed in is not a number.');
          }
        }

        val_idx = getPluralFormFunc(pluralForms)(val);
      }

      // Throw an error if a domain isn't found
      if ( ! dict ) {
        throw new Error('No domain named `' + domain + '` could be found.');
      }

      val_list = dict[ key ];

      // If there is no match, then revert back to
      // english style singular/plural with the keys passed in.
      if ( ! val_list || val_idx > val_list.length ) {
        if (this.options.missing_key_callback) {
          this.options.missing_key_callback(key, domain);
        }
        res = [ singular_key, plural_key ];

        // collect untranslated strings
        if (this.options.debug===true) {
          console.log(res[ getPluralFormFunc(pluralForms)( val ) ]);
        }
        return res[ getPluralFormFunc()( val ) ];
      }

      res = val_list[ val_idx ];

      // This includes empty strings on purpose
      if ( ! res  ) {
        res = [ singular_key, plural_key ];
        return res[ getPluralFormFunc()( val ) ];
      }
      return res;
    }
  });


  // We add in sprintf capabilities for post translation value interolation
  // This is not internally used, so you can remove it if you have this
  // available somewhere else, or want to use a different system.

  // We _slightly_ modify the normal sprintf behavior to more gracefully handle
  // undefined values.

  /**
   sprintf() for JavaScript 0.7-beta1
   http://www.diveintojavascript.com/projects/javascript-sprintf

   Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
   All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:
       * Redistributions of source code must retain the above copyright
         notice, this list of conditions and the following disclaimer.
       * Redistributions in binary form must reproduce the above copyright
         notice, this list of conditions and the following disclaimer in the
         documentation and/or other materials provided with the distribution.
       * Neither the name of sprintf() for JavaScript nor the
         names of its contributors may be used to endorse or promote products
         derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   DISCLAIMED. IN NO EVENT SHALL Alexandru Marasteanu BE LIABLE FOR ANY
   DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
   (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
   LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
   ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  */
  var sprintf = (function() {
    function get_type(variable) {
      return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
    }
    function str_repeat(input, multiplier) {
      for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
      return output.join('');
    }

    var str_format = function() {
      if (!str_format.cache.hasOwnProperty(arguments[0])) {
        str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
      }
      return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
    };

    str_format.format = function(parse_tree, argv) {
      var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
      for (i = 0; i < tree_length; i++) {
        node_type = get_type(parse_tree[i]);
        if (node_type === 'string') {
          output.push(parse_tree[i]);
        }
        else if (node_type === 'array') {
          match = parse_tree[i]; // convenience purposes only
          if (match[2]) { // keyword argument
            arg = argv[cursor];
            for (k = 0; k < match[2].length; k++) {
              if (!arg.hasOwnProperty(match[2][k])) {
                throw(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
              }
              arg = arg[match[2][k]];
            }
          }
          else if (match[1]) { // positional argument (explicit)
            arg = argv[match[1]];
          }
          else { // positional argument (implicit)
            arg = argv[cursor++];
          }

          if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
            throw(sprintf('[sprintf] expecting number but found %s', get_type(arg)));
          }

          // Jed EDIT
          if ( typeof arg == 'undefined' || arg === null ) {
            arg = '';
          }
          // Jed EDIT

          switch (match[8]) {
            case 'b': arg = arg.toString(2); break;
            case 'c': arg = String.fromCharCode(arg); break;
            case 'd': arg = parseInt(arg, 10); break;
            case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
            case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
            case 'o': arg = arg.toString(8); break;
            case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
            case 'u': arg = Math.abs(arg); break;
            case 'x': arg = arg.toString(16); break;
            case 'X': arg = arg.toString(16).toUpperCase(); break;
          }
          arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
          pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
          pad_length = match[6] - String(arg).length;
          pad = match[6] ? str_repeat(pad_character, pad_length) : '';
          output.push(match[5] ? arg + pad : pad + arg);
        }
      }
      return output.join('');
    };

    str_format.cache = {};

    str_format.parse = function(fmt) {
      var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
      while (_fmt) {
        if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
          parse_tree.push(match[0]);
        }
        else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
          parse_tree.push('%');
        }
        else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
          if (match[2]) {
            arg_names |= 1;
            var field_list = [], replacement_field = match[2], field_match = [];
            if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
              field_list.push(field_match[1]);
              while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else {
                  throw('[sprintf] huh?');
                }
              }
            }
            else {
              throw('[sprintf] huh?');
            }
            match[2] = field_list;
          }
          else {
            arg_names |= 2;
          }
          if (arg_names === 3) {
            throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
          }
          parse_tree.push(match);
        }
        else {
          throw('[sprintf] huh?');
        }
        _fmt = _fmt.substring(match[0].length);
      }
      return parse_tree;
    };

    return str_format;
  })();

  var vsprintf = function(fmt, argv) {
    argv.unshift(fmt);
    return sprintf.apply(null, argv);
  };

  Jed.parse_plural = function ( plural_forms, n ) {
    plural_forms = plural_forms.replace(/n/g, n);
    return Jed.parse_expression(plural_forms);
  };

  Jed.sprintf = function ( fmt, args ) {
    if ( {}.toString.call( args ) == '[object Array]' ) {
      return vsprintf( fmt, [].slice.call(args) );
    }
    return sprintf.apply(this, [].slice.call(arguments) );
  };

  Jed.prototype.sprintf = function () {
    return Jed.sprintf.apply(this, arguments);
  };
  // END sprintf Implementation

  // Start the Plural forms section
  // This is a full plural form expression parser. It is used to avoid
  // running 'eval' or 'new Function' directly against the plural
  // forms.
  //
  // This can be important if you get translations done through a 3rd
  // party vendor. I encourage you to use this instead, however, I
  // also will provide a 'precompiler' that you can use at build time
  // to output valid/safe function representations of the plural form
  // expressions. This means you can build this code out for the most
  // part.
  Jed.PF = {};

  Jed.PF.parse = function ( p ) {
    var plural_str = Jed.PF.extractPluralExpr( p );
    return Jed.PF.parser.parse.call(Jed.PF.parser, plural_str);
  };

  Jed.PF.compile = function ( p ) {
    // Handle trues and falses as 0 and 1
    function imply( val ) {
      return (val === true ? 1 : val ? val : 0);
    }

    var ast = Jed.PF.parse( p );
    return function ( n ) {
      return imply( Jed.PF.interpreter( ast )( n ) );
    };
  };

  Jed.PF.interpreter = function ( ast ) {
    return function ( n ) {
      var res;
      switch ( ast.type ) {
        case 'GROUP':
          return Jed.PF.interpreter( ast.expr )( n );
        case 'TERNARY':
          if ( Jed.PF.interpreter( ast.expr )( n ) ) {
            return Jed.PF.interpreter( ast.truthy )( n );
          }
          return Jed.PF.interpreter( ast.falsey )( n );
        case 'OR':
          return Jed.PF.interpreter( ast.left )( n ) || Jed.PF.interpreter( ast.right )( n );
        case 'AND':
          return Jed.PF.interpreter( ast.left )( n ) && Jed.PF.interpreter( ast.right )( n );
        case 'LT':
          return Jed.PF.interpreter( ast.left )( n ) < Jed.PF.interpreter( ast.right )( n );
        case 'GT':
          return Jed.PF.interpreter( ast.left )( n ) > Jed.PF.interpreter( ast.right )( n );
        case 'LTE':
          return Jed.PF.interpreter( ast.left )( n ) <= Jed.PF.interpreter( ast.right )( n );
        case 'GTE':
          return Jed.PF.interpreter( ast.left )( n ) >= Jed.PF.interpreter( ast.right )( n );
        case 'EQ':
          return Jed.PF.interpreter( ast.left )( n ) == Jed.PF.interpreter( ast.right )( n );
        case 'NEQ':
          return Jed.PF.interpreter( ast.left )( n ) != Jed.PF.interpreter( ast.right )( n );
        case 'MOD':
          return Jed.PF.interpreter( ast.left )( n ) % Jed.PF.interpreter( ast.right )( n );
        case 'VAR':
          return n;
        case 'NUM':
          return ast.val;
        default:
          throw new Error("Invalid Token found.");
      }
    };
  };

  Jed.PF.extractPluralExpr = function ( p ) {
    // trim first
    p = p.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

    if (! /;\s*$/.test(p)) {
      p = p.concat(';');
    }

    var nplurals_re = /nplurals\=(\d+);/,
        plural_re = /plural\=(.*);/,
        nplurals_matches = p.match( nplurals_re ),
        res = {},
        plural_matches;

    // Find the nplurals number
    if ( nplurals_matches.length > 1 ) {
      res.nplurals = nplurals_matches[1];
    }
    else {
      throw new Error('nplurals not found in plural_forms string: ' + p );
    }

    // remove that data to get to the formula
    p = p.replace( nplurals_re, "" );
    plural_matches = p.match( plural_re );

    if (!( plural_matches && plural_matches.length > 1 ) ) {
      throw new Error('`plural` expression not found: ' + p);
    }
    return plural_matches[ 1 ];
  };

  /* Jison generated parser */
  Jed.PF.parser = (function(){

var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"expressions":3,"e":4,"EOF":5,"?":6,":":7,"||":8,"&&":9,"<":10,"<=":11,">":12,">=":13,"!=":14,"==":15,"%":16,"(":17,")":18,"n":19,"NUMBER":20,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",6:"?",7:":",8:"||",9:"&&",10:"<",11:"<=",12:">",13:">=",14:"!=",15:"==",16:"%",17:"(",18:")",19:"n",20:"NUMBER"},
productions_: [0,[3,2],[4,5],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,1],[4,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return { type : 'GROUP', expr: $$[$0-1] };
break;
case 2:this.$ = { type: 'TERNARY', expr: $$[$0-4], truthy : $$[$0-2], falsey: $$[$0] };
break;
case 3:this.$ = { type: "OR", left: $$[$0-2], right: $$[$0] };
break;
case 4:this.$ = { type: "AND", left: $$[$0-2], right: $$[$0] };
break;
case 5:this.$ = { type: 'LT', left: $$[$0-2], right: $$[$0] };
break;
case 6:this.$ = { type: 'LTE', left: $$[$0-2], right: $$[$0] };
break;
case 7:this.$ = { type: 'GT', left: $$[$0-2], right: $$[$0] };
break;
case 8:this.$ = { type: 'GTE', left: $$[$0-2], right: $$[$0] };
break;
case 9:this.$ = { type: 'NEQ', left: $$[$0-2], right: $$[$0] };
break;
case 10:this.$ = { type: 'EQ', left: $$[$0-2], right: $$[$0] };
break;
case 11:this.$ = { type: 'MOD', left: $$[$0-2], right: $$[$0] };
break;
case 12:this.$ = { type: 'GROUP', expr: $$[$0-1] };
break;
case 13:this.$ = { type: 'VAR' };
break;
case 14:this.$ = { type: 'NUM', val: Number(yytext) };
break;
}
},
table: [{3:1,4:2,17:[1,3],19:[1,4],20:[1,5]},{1:[3]},{5:[1,6],6:[1,7],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16]},{4:17,17:[1,3],19:[1,4],20:[1,5]},{5:[2,13],6:[2,13],7:[2,13],8:[2,13],9:[2,13],10:[2,13],11:[2,13],12:[2,13],13:[2,13],14:[2,13],15:[2,13],16:[2,13],18:[2,13]},{5:[2,14],6:[2,14],7:[2,14],8:[2,14],9:[2,14],10:[2,14],11:[2,14],12:[2,14],13:[2,14],14:[2,14],15:[2,14],16:[2,14],18:[2,14]},{1:[2,1]},{4:18,17:[1,3],19:[1,4],20:[1,5]},{4:19,17:[1,3],19:[1,4],20:[1,5]},{4:20,17:[1,3],19:[1,4],20:[1,5]},{4:21,17:[1,3],19:[1,4],20:[1,5]},{4:22,17:[1,3],19:[1,4],20:[1,5]},{4:23,17:[1,3],19:[1,4],20:[1,5]},{4:24,17:[1,3],19:[1,4],20:[1,5]},{4:25,17:[1,3],19:[1,4],20:[1,5]},{4:26,17:[1,3],19:[1,4],20:[1,5]},{4:27,17:[1,3],19:[1,4],20:[1,5]},{6:[1,7],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[1,28]},{6:[1,7],7:[1,29],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16]},{5:[2,3],6:[2,3],7:[2,3],8:[2,3],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[2,3]},{5:[2,4],6:[2,4],7:[2,4],8:[2,4],9:[2,4],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[2,4]},{5:[2,5],6:[2,5],7:[2,5],8:[2,5],9:[2,5],10:[2,5],11:[2,5],12:[2,5],13:[2,5],14:[2,5],15:[2,5],16:[1,16],18:[2,5]},{5:[2,6],6:[2,6],7:[2,6],8:[2,6],9:[2,6],10:[2,6],11:[2,6],12:[2,6],13:[2,6],14:[2,6],15:[2,6],16:[1,16],18:[2,6]},{5:[2,7],6:[2,7],7:[2,7],8:[2,7],9:[2,7],10:[2,7],11:[2,7],12:[2,7],13:[2,7],14:[2,7],15:[2,7],16:[1,16],18:[2,7]},{5:[2,8],6:[2,8],7:[2,8],8:[2,8],9:[2,8],10:[2,8],11:[2,8],12:[2,8],13:[2,8],14:[2,8],15:[2,8],16:[1,16],18:[2,8]},{5:[2,9],6:[2,9],7:[2,9],8:[2,9],9:[2,9],10:[2,9],11:[2,9],12:[2,9],13:[2,9],14:[2,9],15:[2,9],16:[1,16],18:[2,9]},{5:[2,10],6:[2,10],7:[2,10],8:[2,10],9:[2,10],10:[2,10],11:[2,10],12:[2,10],13:[2,10],14:[2,10],15:[2,10],16:[1,16],18:[2,10]},{5:[2,11],6:[2,11],7:[2,11],8:[2,11],9:[2,11],10:[2,11],11:[2,11],12:[2,11],13:[2,11],14:[2,11],15:[2,11],16:[2,11],18:[2,11]},{5:[2,12],6:[2,12],7:[2,12],8:[2,12],9:[2,12],10:[2,12],11:[2,12],12:[2,12],13:[2,12],14:[2,12],15:[2,12],16:[2,12],18:[2,12]},{4:30,17:[1,3],19:[1,4],20:[1,5]},{5:[2,2],6:[1,7],7:[2,2],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[2,2]}],
defaultActions: {6:[2,1]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this,
        stack = [0],
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    //this.reductionCount = this.shiftCount = 0;

    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == 'undefined')
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);

    if (typeof this.yy.parseError === 'function')
        this.parseError = this.yy.parseError;

    function popStack (n) {
        stack.length = stack.length - 2*n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

    function lex() {
        var token;
        token = self.lexer.lex() || 1; // $end = 1
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }

    var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length-1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

        // handle parse error
        _handle_error:
        if (typeof action === 'undefined' || !action.length || !action[0]) {

            if (!recovering) {
                // Report error
                expected = [];
                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                    expected.push("'"+this.terminals_[p]+"'");
                }
                var errStr = '';
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + this.terminals_[symbol]+ "'";
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == 1 /*EOF*/ ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr,
                    {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol == EOF) {
                    throw new Error(errStr || 'Parsing halted.');
                }

                // discard current lookahead and grab another
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            while (1) {
                // check for error recovery rule in this state
                if ((TERROR.toString()) in table[state]) {
                    break;
                }
                if (state == 0) {
                    throw new Error(errStr || 'Parsing halted.');
                }
                popStack(1);
                state = stack[stack.length-1];
            }

            preErrorSymbol = symbol; // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {

            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(this.lexer.yytext);
                lstack.push(this.lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = this.lexer.yyleng;
                    yytext = this.lexer.yytext;
                    yylineno = this.lexer.yylineno;
                    yyloc = this.lexer.yylloc;
                    if (recovering > 0)
                        recovering--;
                } else { // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2: // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3: // accept
                return true;
        }

    }

    return true;
}};/* Jison generated lexer */
var lexer = (function(){

var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parseError) {
            this.yy.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext+=ch;
        this.yyleng++;
        this.match+=ch;
        this.matched+=ch;
        var lines = ch.match(/\n/);
        if (lines) this.yylineno++;
        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        this._input = ch + this._input;
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            match = this._input.match(this.rules[rules[i]]);
            if (match) {
                lines = match[0].match(/\n.*/g);
                if (lines) this.yylineno += lines.length;
                this.yylloc = {first_line: this.yylloc.last_line,
                               last_line: this.yylineno+1,
                               first_column: this.yylloc.last_column,
                               last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match[0].length}
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                this._more = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, rules[i],this.conditionStack[this.conditionStack.length-1]);
                if (token) return token;
                else return;
            }
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:return 20
break;
case 2:return 19
break;
case 3:return 8
break;
case 4:return 9
break;
case 5:return 6
break;
case 6:return 7
break;
case 7:return 11
break;
case 8:return 13
break;
case 9:return 10
break;
case 10:return 12
break;
case 11:return 14
break;
case 12:return 15
break;
case 13:return 16
break;
case 14:return 17
break;
case 15:return 18
break;
case 16:return 5
break;
case 17:return 'INVALID'
break;
}
};
lexer.rules = [/^\s+/,/^[0-9]+(\.[0-9]+)?\b/,/^n\b/,/^\|\|/,/^&&/,/^\?/,/^:/,/^<=/,/^>=/,/^</,/^>/,/^!=/,/^==/,/^%/,/^\(/,/^\)/,/^$/,/^./];
lexer.conditions = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],"inclusive":true}};return lexer;})()
parser.lexer = lexer;
return parser;
})();
// End parser

  // Handle node, amd, and global systems
  if (true) {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Jed;
    }
    exports.Jed = Jed;
  }
  else {
    if (typeof define === 'function' && define.amd) {
      define(function() {
        return Jed;
      });
    }
    // Leak a global regardless of module system
    root['Jed'] = Jed;
  }

})(this);


/***/ }),

/***/ 167:
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

/***/ 173:
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(40),
    arrayMap = __webpack_require__(116),
    isArray = __webpack_require__(11),
    isSymbol = __webpack_require__(64);

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

/***/ 176:
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(160);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ 18:
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(155);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),

/***/ 19:
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ 2:
/***/ (function(module, exports) {

module.exports = window.yoast.styledComponents;

/***/ }),

/***/ 202:
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(350), __esModule: true };

/***/ }),

/***/ 203:
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(45) && !__webpack_require__(55)(function () {
  return Object.defineProperty(__webpack_require__(204)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ 204:
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(54);
var document = __webpack_require__(37).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ 205:
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(52);
var toIObject = __webpack_require__(68);
var arrayIndexOf = __webpack_require__(354)(false);
var IE_PROTO = __webpack_require__(161)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ 206:
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(131);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ 228:
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(40);

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

/***/ 229:
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

/***/ 23:
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

/***/ 246:
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(132),
    isMasked = __webpack_require__(247),
    isObject = __webpack_require__(23),
    toSource = __webpack_require__(167);

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

/***/ 247:
/***/ (function(module, exports, __webpack_require__) {

var coreJsData = __webpack_require__(248);

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

/***/ 248:
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(18);

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),

/***/ 249:
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

/***/ 252:
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

/***/ 253:
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(56);

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

/***/ 254:
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(56);

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

/***/ 255:
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(56);

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

/***/ 256:
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(56);

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

/***/ 257:
/***/ (function(module, exports, __webpack_require__) {

var Hash = __webpack_require__(258),
    ListCache = __webpack_require__(78),
    Map = __webpack_require__(100);

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

/***/ 258:
/***/ (function(module, exports, __webpack_require__) {

var hashClear = __webpack_require__(259),
    hashDelete = __webpack_require__(260),
    hashGet = __webpack_require__(261),
    hashHas = __webpack_require__(262),
    hashSet = __webpack_require__(263);

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

/***/ 259:
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(57);

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

/***/ 260:
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

/***/ 261:
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(57);

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

/***/ 262:
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(57);

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

/***/ 263:
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(57);

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

/***/ 264:
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(58);

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

/***/ 265:
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

/***/ 266:
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(58);

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

/***/ 267:
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(58);

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

/***/ 268:
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(58);

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

/***/ 27:
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

/***/ 273:
/***/ (function(module, exports, __webpack_require__) {

var memoizeCapped = __webpack_require__(274);

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

/***/ 274:
/***/ (function(module, exports, __webpack_require__) {

var memoize = __webpack_require__(275);

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

/***/ 275:
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(109);

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

/***/ 30:
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(40),
    getRawTag = __webpack_require__(228),
    objectToString = __webpack_require__(229);

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

/***/ 31:
/***/ (function(module, exports, __webpack_require__) {

var baseIsNative = __webpack_require__(246),
    getValue = __webpack_require__(249);

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

/***/ 327:
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

/***/ 344:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = __webpack_require__(345);

function emptyFunction() {}

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
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

/***/ 345:
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

/***/ 350:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(351);
module.exports = __webpack_require__(19).Object.assign;


/***/ }),

/***/ 351:
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(47);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(353) });


/***/ }),

/***/ 352:
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ 353:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(93);
var gOPS = __webpack_require__(164);
var pIE = __webpack_require__(119);
var toObject = __webpack_require__(94);
var IObject = __webpack_require__(176);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(55)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),

/***/ 354:
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(68);
var toLength = __webpack_require__(206);
var toAbsoluteIndex = __webpack_require__(355);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ 355:
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(131);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ 356:
/***/ (function(module, exports, __webpack_require__) {

module.exports = function memize( fn, options ) {
	var size = 0,
		maxSize, head, tail;

	if ( options && options.maxSize ) {
		maxSize = options.maxSize;
	}

	function memoized( /* ...args */ ) {
		var node = head,
			len = arguments.length,
			args, i;

		searchCache: while ( node ) {
			// Perform a shallow equality test to confirm that whether the node
			// under test is a candidate for the arguments passed. Two arrays
			// are shallowly equal if their length matches and each entry is
			// strictly equal between the two sets. Avoid abstracting to a
			// function which could incur an arguments leaking deoptimization.

			// Check whether node arguments match arguments length
			if ( node.args.length !== arguments.length ) {
				node = node.next;
				continue;
			}

			// Check whether node arguments match arguments values
			for ( i = 0; i < len; i++ ) {
				if ( node.args[ i ] !== arguments[ i ] ) {
					node = node.next;
					continue searchCache;
				}
			}

			// At this point we can assume we've found a match

			// Surface matched node to head if not already
			if ( node !== head ) {
				// As tail, shift to previous. Must only shift if not also
				// head, since if both head and tail, there is no previous.
				if ( node === tail ) {
					tail = node.prev;
				}

				// Adjust siblings to point to each other. If node was tail,
				// this also handles new tail's empty `next` assignment.
				node.prev.next = node.next;
				if ( node.next ) {
					node.next.prev = node.prev;
				}

				node.next = head;
				node.prev = null;
				head.prev = node;
				head = node;
			}

			// Return immediately
			return node.val;
		}

		// No cached value found. Continue to insertion phase:

		// Create a copy of arguments (avoid leaking deoptimization)
		args = new Array( len );
		for ( i = 0; i < len; i++ ) {
			args[ i ] = arguments[ i ];
		}

		node = {
			args: args,

			// Generate the result from original function
			val: fn.apply( null, args )
		};

		// Don't need to check whether node is already head, since it would
		// have been returned above already if it was

		// Shift existing head down list
		if ( head ) {
			head.prev = node;
			node.next = head;
		} else {
			// If no head, follows that there's no tail (at initial or reset)
			tail = node;
		}

		// Trim tail if we're reached max size and are pending cache insertion
		if ( size === maxSize ) {
			tail = tail.prev;
			tail.next = null;
		} else {
			size++;
		}

		head = node;

		return node.val;
	}

	memoized.clear = function() {
		head = null;
		tail = null;
		size = 0;
	};

	if ( false ) {
		// Cache is not exposed in the public API, but used in tests to ensure
		// expected list progression
		memoized.getCache = function() {
			return [ head, tail, size ];
		};
	}

	return memoized;
};


/***/ }),

/***/ 37:
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ 4:
/***/ (function(module, exports) {

module.exports = {"$palette_white":"#fff","$palette_grey_ultra_light":"#f7f7f7","$palette_grey_light":"#f1f1f1","$palette_grey":"#ddd","$palette_grey_medium":"#ccc","$palette_grey_disabled":"#a0a5aa","$palette_grey_medium_dark":"#888","$palette_grey_text":"#646464","$palette_grey_dark":"#555","$palette_black":"#000","$palette_purple":"#5d237a","$palette_purple_dark":"#6c2548","$palette_pink":"#d73763","$palette_pink_light":"#e1bee7","$palette_pink_dark":"#a4286a","$palette_blue":"#0066cd","$palette_blue_light":"#a9a9ce","$palette_blue_medium":"#1e8cbe","$palette_blue_dark":"#084a67","$palette_green":"#77b227","$palette_green_light":"#7ad03a","$palette_green_medium_light":"#64a60a","$palette_green_medium":"#008a00","$palette_green_blue":"#009288","$palette_orange":"#dc5c04","$palette_orange_light":"#ee7c1b","$palette_red":"#dc3232","$palette_red_light":"#f9bdbd","$palette_yellow":"#ffeb3b","$palette_yellow_score":"#f5c819","$color_bad":"#dc3232","$color_ok":"#ee7c1b","$color_good":"#7ad03a","$color_noindex":"#1e8cbe","$color_score_icon":"#888","$color_white":"#fff","$color_black":"#000","$color_green":"#77b227","$color_green_medium":"#008a00","$color_green_blue":"#009288","$color_grey":"#ddd","$color_grey_dark":"#555","$color_purple":"#5d237a","$color_purple_dark":"#6c2548","$color_pink":"#d73763","$color_pink_light":"#e1bee7","$color_pink_dark":"#a4286a","$color_blue":"#0066cd","$color_blue_light":"#a9a9ce","$color_blue_dark":"#084a67","$color_red":"#dc3232","$color_border_light":"#f7f7f7","$color_border":"#ccc","$color_input_border":"#ddd","$color_background_light":"#f7f7f7","$color_button":"#f7f7f7","$color_button_text":"#555","$color_button_border":"#ccc","$color_button_hover":"#fff","$color_button_border_hover":"#888","$color_button_text_hover":"#000","$color_button_border_active":"#000","$color_headings":"#555","$color_marker_inactive":"#555","$color_marker_active":"#fff","$color_marker_disabled":"#a0a5aa","$color_error":"#dc3232","$color_orange":"#dc5c04","$color_orange_hover":"#c35204","$color_grey_hover":"#cecece","$color_pink_hover":"#cc2956","$color_grey_cta":"#ddd","$color_grey_line":"#ddd","$color_grey_quote":"#646464","$color_grey_text":"#646464","$color_snippet_focus":"#1e8cbe","$color_snippet_hover":"#ccc","$color_snippet_active":"#555","$color_grey_medium_dark":"#888","$color_green_medium_light":"#64a60a","$color_grey_disabled":"#a0a5aa","$color_grey_medium":"#ccc","$color_grey_light":"#f1f1f1","$color_yellow":"#ffeb3b","$color_yellow_score":"#f5c819","$color_error_message":"#f9bdbd"}

/***/ }),

/***/ 40:
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(18);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),

/***/ 45:
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(55)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ 47:
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(37);
var core = __webpack_require__(19);
var ctx = __webpack_require__(158);
var hide = __webpack_require__(77);
var has = __webpack_require__(52);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ 48:
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(65);
var IE8_DOM_DEFINE = __webpack_require__(203);
var toPrimitive = __webpack_require__(159);
var dP = Object.defineProperty;

exports.f = __webpack_require__(45) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ 504:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setTextdomainL10n = setTextdomainL10n;
exports.setYoastComponentsL10n = setYoastComponentsL10n;
exports.setWordPressSeoL10n = setWordPressSeoL10n;

var _i18n = __webpack_require__(9);

var _get = __webpack_require__(112);

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
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ 54:
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ 55:
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ 56:
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(79);

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

/***/ 57:
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(31);

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),

/***/ 58:
/***/ (function(module, exports, __webpack_require__) {

var isKeyable = __webpack_require__(265);

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

/***/ 64:
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(30),
    isObjectLike = __webpack_require__(27);

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


/***/ }),

/***/ 65:
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(54);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ 656:
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

var _StackedProgressBar = __webpack_require__(657);

var _StackedProgressBar2 = _interopRequireDefault(_StackedProgressBar);

var _ScoreAssessments = __webpack_require__(327);

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

/***/ 657:
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

/***/ 658:
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

/***/ 68:
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(176);
var defined = __webpack_require__(130);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ 70:
/***/ (function(module, exports, __webpack_require__) {

var isSymbol = __webpack_require__(64);

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

/***/ 77:
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(48);
var createDesc = __webpack_require__(92);
module.exports = __webpack_require__(45) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ 78:
/***/ (function(module, exports, __webpack_require__) {

var listCacheClear = __webpack_require__(252),
    listCacheDelete = __webpack_require__(253),
    listCacheGet = __webpack_require__(254),
    listCacheHas = __webpack_require__(255),
    listCacheSet = __webpack_require__(256);

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

/***/ 79:
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

/***/ 85:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// The babel polyfill sets the _babelPolyfill to true. So only load it ourselves if the variable is undefined or false.
if (typeof window._babelPolyfill === "undefined" || !window._babelPolyfill) {
	// eslint-disable-next-line global-require
	__webpack_require__(198);
}

/***/ }),

/***/ 9:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dcnpgettext = undefined;
exports.setLocaleData = setLocaleData;
exports.getI18n = getI18n;
exports.__ = __;
exports._x = _x;
exports._n = _n;
exports._nx = _nx;
exports.sprintf = sprintf;

var _assign = __webpack_require__(202);

var _assign2 = _interopRequireDefault(_assign);

var _jed = __webpack_require__(165);

var _jed2 = _interopRequireDefault(_jed);

var _memize = __webpack_require__(356);

var _memize2 = _interopRequireDefault(_memize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * External dependencies
 */
var i18n = void 0;

/**
 * Log to console, once per message; or more precisely, per referentially equal
 * argument set. Because Jed throws errors, we log these to the console instead
 * to avoid crashing the application.
 *
 * @param {...*} args Arguments to pass to `console.error`
 */
var logErrorOnce = (0, _memize2.default)(console.error); // eslint-disable-line no-console

/**
 * Merges locale data into the Jed instance by domain. Creates a new Jed
 * instance if one has not yet been assigned.
 *
 * @see http://messageformat.github.io/Jed/
 *
 * @param {?Object} localeData Locale data configuration.
 * @param {?string} domain     Domain for which configuration applies.
 */
function setLocaleData() {
  var localeData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { '': {} };
  var domain = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';

  if (!i18n) {
    i18n = new _jed2.default({
      domain: 'default',
      locale_data: {
        default: {}
      }
    });
  }

  i18n.options.locale_data[domain] = (0, _assign2.default)({}, i18n.options.locale_data[domain], localeData);
}

/**
 * Returns the current Jed instance, initializing with a default configuration
 * if not already assigned.
 *
 * @return {Jed} Jed instance.
 */
function getI18n() {
  if (!i18n) {
    setLocaleData();
  }

  return i18n;
}

/**
 * Wrapper for Jed's `dcnpgettext`, its most qualified function. Absorbs errors
 * which are thrown as the result of invalid translation.
 *
 * @param {?string} domain  Domain to retrieve the translated text.
 * @param {?string} context Context information for the translators.
 * @param {string}  single  Text to translate if non-plural. Used as fallback
 *                          return value on a caught error.
 * @param {?string} plural  The text to be used if the number is plural.
 * @param {?number} number  The number to compare against to use either the
 *                          singular or plural form.
 *
 * @return {string} The translated string.
 */
var dcnpgettext = exports.dcnpgettext = (0, _memize2.default)(function () {
  var domain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'default';
  var context = arguments[1];
  var single = arguments[2];
  var plural = arguments[3];
  var number = arguments[4];

  try {
    return getI18n().dcnpgettext(domain, context, single, plural, number);
  } catch (error) {
    logErrorOnce('Jed localization error: \n\n' + error.toString());

    return single;
  }
});

/**
 * Retrieve the translation of text.
 *
 * @see https://developer.wordpress.org/reference/functions/__/
 *
 * @param {string}  text   Text to translate.
 * @param {?string} domain Domain to retrieve the translated text.
 *
 * @return {string} Translated text.
 */
function __(text, domain) {
  return dcnpgettext(domain, undefined, text);
}

/**
 * Retrieve translated string with gettext context.
 *
 * @see https://developer.wordpress.org/reference/functions/_x/
 *
 * @param {string}  text    Text to translate.
 * @param {string}  context Context information for the translators.
 * @param {?string} domain  Domain to retrieve the translated text.
 *
 * @return {string} Translated context string without pipe.
 */
function _x(text, context, domain) {
  return dcnpgettext(domain, context, text);
}

/**
 * Translates and retrieves the singular or plural form based on the supplied
 * number.
 *
 * @see https://developer.wordpress.org/reference/functions/_n/
 *
 * @param {string}  single The text to be used if the number is singular.
 * @param {string}  plural The text to be used if the number is plural.
 * @param {number}  number The number to compare against to use either the
 *                         singular or plural form.
 * @param {?string} domain Domain to retrieve the translated text.
 *
 * @return {string} The translated singular or plural form.
 */
function _n(single, plural, number, domain) {
  return dcnpgettext(domain, undefined, single, plural, number);
}

/**
 * Translates and retrieves the singular or plural form based on the supplied
 * number, with gettext context.
 *
 * @see https://developer.wordpress.org/reference/functions/_nx/
 *
 * @param {string}  single  The text to be used if the number is singular.
 * @param {string}  plural  The text to be used if the number is plural.
 * @param {number}  number  The number to compare against to use either the
 *                          singular or plural form.
 * @param {string}  context Context information for the translators.
 * @param {?string} domain  Domain to retrieve the translated text.
 *
 * @return {string} The translated singular or plural form.
 */
function _nx(single, plural, number, context, domain) {
  return dcnpgettext(domain, context, single, plural, number);
}

/**
 * Returns a formatted string. If an error occurs in applying the format, the
 * original format string is returned.
 *
 * @param {string}   format  The format of the string to generate.
 * @param {string[]} ...args Arguments to apply to the format.
 *
 * @see http://www.diveintojavascript.com/projects/javascript-sprintf
 *
 * @return {string} The formatted string.
 */
function sprintf(format) {
  try {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return _jed2.default.sprintf.apply(_jed2.default, [format].concat(args));
  } catch (error) {
    logErrorOnce('Jed sprintf error: \n\n' + error.toString());

    return format;
  }
}

/***/ }),

/***/ 91:
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(11),
    isKey = __webpack_require__(121),
    stringToPath = __webpack_require__(273),
    toString = __webpack_require__(125);

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

/***/ 92:
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ 93:
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(205);
var enumBugKeys = __webpack_require__(163);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ 94:
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(130);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ })

},[1645]);