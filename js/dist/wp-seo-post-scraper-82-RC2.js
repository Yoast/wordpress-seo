yoastWebpackJsonp([2],[
/* 0 */,
/* 1 */,
/* 2 */
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
  module.exports = __webpack_require__(114)();
}


/***/ }),
/* 3 */
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
/* 4 */
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
  module.exports = __webpack_require__(547)();
}


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = window.yoast.styledComponents;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(73);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),
/* 7 */
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
/* 8 */
/***/ (function(module, exports) {

module.exports = window.yoast._wp.i18n;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = window.yoast.components;

/***/ }),
/* 10 */
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
/* 11 */,
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(13),
    getRawTag = __webpack_require__(102),
    objectToString = __webpack_require__(103);

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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(6);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsNative = __webpack_require__(123),
    getValue = __webpack_require__(126);

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
/* 15 */
/***/ (function(module, exports) {

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


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(14);

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(27);

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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var isKeyable = __webpack_require__(137);

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
/* 19 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(12),
    isObjectLike = __webpack_require__(10);

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
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var isSymbol = __webpack_require__(20);

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
/* 25 */,
/* 26 */,
/* 27 */
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
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(53);

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
/* 29 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(47),
    isLength = __webpack_require__(93);

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


/***/ }),
/* 31 */,
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(3),
    isKey = __webpack_require__(58),
    stringToPath = __webpack_require__(117),
    toString = __webpack_require__(84);

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
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(152),
    baseKeys = __webpack_require__(168),
    isArrayLike = __webpack_require__(30);

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


/***/ }),
/* 34 */,
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// The babel polyfill sets the _babelPolyfill to true. So only load it ourselves if the variable is undefined or false.
if (typeof window._babelPolyfill === "undefined" || !window._babelPolyfill) {
	// eslint-disable-next-line global-require
	__webpack_require__(100);
}

/***/ }),
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var listCacheClear = __webpack_require__(131),
    listCacheDelete = __webpack_require__(132),
    listCacheGet = __webpack_require__(133),
    listCacheHas = __webpack_require__(134),
    listCacheSet = __webpack_require__(135);

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
/* 44 */
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
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(110),
    baseAssignValue = __webpack_require__(111);

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

module.exports = copyObject;


/***/ }),
/* 46 */,
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(12),
    isObject = __webpack_require__(7);

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
/* 48 */,
/* 49 */,
/* 50 */
/***/ (function(module, exports) {

module.exports = window.yoast._wp.element;

/***/ }),
/* 51 */,
/* 52 */,
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(32),
    toKey = __webpack_require__(24);

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
/* 54 */,
/* 55 */,
/* 56 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 57 */,
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(3),
    isSymbol = __webpack_require__(20);

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
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var mapCacheClear = __webpack_require__(120),
    mapCacheDelete = __webpack_require__(136),
    mapCacheGet = __webpack_require__(138),
    mapCacheHas = __webpack_require__(139),
    mapCacheSet = __webpack_require__(140);

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
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(14),
    root = __webpack_require__(6);

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.REFRESH = exports.REMOVE_REPLACEMENT_VARIABLE = exports.UPDATE_REPLACEMENT_VARIABLE = exports.UPDATE_DATA = exports.SWITCH_MODE = undefined;
exports.switchMode = switchMode;
exports.updateData = updateData;
exports.updateReplacementVariable = updateReplacementVariable;
exports.removeReplacementVariable = removeReplacementVariable;
exports.refreshSnippetEditor = refreshSnippetEditor;

var _yoastComponents = __webpack_require__(9);

var SWITCH_MODE = exports.SWITCH_MODE = "SNIPPET_EDITOR_SWITCH_MODE";
var UPDATE_DATA = exports.UPDATE_DATA = "SNIPPET_EDITOR_UPDATE_DATA";
var UPDATE_REPLACEMENT_VARIABLE = exports.UPDATE_REPLACEMENT_VARIABLE = "SNIPPET_EDITOR_UPDATE_REPLACEMENT_VARIABLE";
var REMOVE_REPLACEMENT_VARIABLE = exports.REMOVE_REPLACEMENT_VARIABLE = "SNIPPET_EDITOR_REMOVE_REPLACEMENT_VARIABLE";
var REFRESH = exports.REFRESH = "SNIPPET_EDITOR_REFRESH";

/**
 * Switches mode of the snippet editor.
 *
 * @param {string} mode The mode the snippet editor should be in.
 *
 * @returns {Object} An action for redux.
 */
function switchMode(mode) {
  return {
    type: SWITCH_MODE,
    mode: mode
  };
}

/**
 * Updates the data of the snippet editor.
 *
 * @param {Object} data               The snippet editor data.
 * @param {string} [data.title]       The title in the snippet editor.
 * @param {string} [data.slug]        The slug in the snippet editor.
 * @param {string} [data.description] The description in the snippet editor.
 *
 * @returns {Object} An action for redux.
 */
function updateData(data) {
  return {
    type: UPDATE_DATA,
    data: data
  };
}

/**
 * Updates replacement variables in redux.
 *
 * @param {string} name  The name of the replacement variable.
 * @param {string} value The value of the replacement variable.
 * @param {string} label The label of the replacement variable (optional).
 *
 * @returns {Object} An action for redux.
 */
function updateReplacementVariable(name, value) {
  var label = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

  var unescapedValue = typeof value === "string" ? (0, _yoastComponents.decodeHTML)(value) : value;
  return {
    type: UPDATE_REPLACEMENT_VARIABLE,
    name: name,
    value: unescapedValue,
    label: label
  };
}

/**
 * Removes a replacement variable in redux.
 *
 * @param {string} name  The name of the replacement variable.
 *
 * @returns {Object} An action for redux.
 */
function removeReplacementVariable(name) {
  return {
    type: REMOVE_REPLACEMENT_VARIABLE,
    name: name
  };
}

/**
 * Sets the time in redux, so that the snippet editor will refresh.
 *
 * @returns {Object} An action for redux.
 */
function refreshSnippetEditor() {
  return {
    type: REFRESH,
    time: new Date().getMilliseconds()
  };
}

/***/ }),
/* 62 */,
/* 63 */,
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsArguments = __webpack_require__(276),
    isObjectLike = __webpack_require__(10);

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


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(6),
    stubFalse = __webpack_require__(277);

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(29)(module)))

/***/ }),
/* 66 */
/***/ (function(module, exports) {

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


/***/ }),
/* 67 */,
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(81)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 69 */
/***/ (function(module, exports) {

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


/***/ }),
/* 70 */
/***/ (function(module, exports) {

module.exports = window.yoast.analysis;

/***/ }),
/* 71 */,
/* 72 */,
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 74 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Provider__ = __webpack_require__(492);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_connectAdvanced__ = __webpack_require__(343);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__connect_connect__ = __webpack_require__(495);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Provider", function() { return __WEBPACK_IMPORTED_MODULE_0__components_Provider__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "createProvider", function() { return __WEBPACK_IMPORTED_MODULE_0__components_Provider__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "connectAdvanced", function() { return __WEBPACK_IMPORTED_MODULE_1__components_connectAdvanced__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "connect", function() { return __WEBPACK_IMPORTED_MODULE_2__connect_connect__["a"]; });






/***/ }),
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(56);
var core = __webpack_require__(19);
var ctx = __webpack_require__(213);
var hide = __webpack_require__(101);
var has = __webpack_require__(82);
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
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(97);
var IE8_DOM_DEFINE = __webpack_require__(265);
var toPrimitive = __webpack_require__(214);
var dP = Object.defineProperty;

exports.f = __webpack_require__(68) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
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
/* 80 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 81 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 82 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 83 */
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
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var baseToString = __webpack_require__(92);

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
/* 85 */
/***/ (function(module, exports) {

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


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsTypedArray = __webpack_require__(278),
    baseUnary = __webpack_require__(197),
    nodeUtil = __webpack_require__(250);

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


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(43),
    stackClear = __webpack_require__(285),
    stackDelete = __webpack_require__(286),
    stackGet = __webpack_require__(287),
    stackHas = __webpack_require__(288),
    stackSet = __webpack_require__(289);

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


/***/ }),
/* 88 */,
/* 89 */,
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(268);
var defined = __webpack_require__(163);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 91 */,
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(13),
    arrayMap = __webpack_require__(44),
    isArray = __webpack_require__(3),
    isSymbol = __webpack_require__(20);

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
/* 93 */
/***/ (function(module, exports) {

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


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeKeys = __webpack_require__(152),
    baseKeysIn = __webpack_require__(307),
    isArrayLike = __webpack_require__(30);

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
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
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = keysIn;


/***/ }),
/* 95 */,
/* 96 */,
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(80);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

var arrayEach = __webpack_require__(196),
    baseEach = __webpack_require__(167),
    castFunction = __webpack_require__(382),
    isArray = __webpack_require__(3);

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


/***/ }),
/* 99 */,
/* 100 */,
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(79);
var createDesc = __webpack_require__(116);
module.exports = __webpack_require__(68) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(13);

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
/* 103 */
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
/* 104 */
/***/ (function(module, exports) {

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


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

var arrayFilter = __webpack_require__(230),
    stubArray = __webpack_require__(175);

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


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

var DataView = __webpack_require__(296),
    Map = __webpack_require__(60),
    Promise = __webpack_require__(297),
    Set = __webpack_require__(298),
    WeakMap = __webpack_require__(231),
    baseGetTag = __webpack_require__(12),
    toSource = __webpack_require__(83);

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


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

__webpack_require__(683);

var _lodash = __webpack_require__(236);

/**
 * Given a function mapping a component to an enhanced component and modifier
 * name, returns the enhanced component augmented with a generated displayName.
 *
 * @param {Function} mapComponentToEnhancedComponent Function mapping component
 *                                                   to enhanced component.
 * @param {string}   modifierName                    Seed name from which to
 *                                                   generated display name.
 *
 * @return {WPComponent} Component class with generated display name assigned.
 */

function createHigherOrderComponent(mapComponentToEnhancedComponent, modifierName) {
  return function (OriginalComponent) {
    var EnhancedComponent = mapComponentToEnhancedComponent(OriginalComponent);
    var _OriginalComponent$di = OriginalComponent.displayName,
        displayName = _OriginalComponent$di === void 0 ? OriginalComponent.name || 'Component' : _OriginalComponent$di;
    EnhancedComponent.displayName = "".concat((0, _lodash.upperFirst)((0, _lodash.camelCase)(modifierName)), "(").concat(displayName, ")");
    return EnhancedComponent;
  };
}

/**
 * External dependencies
 */
exports.default = createHigherOrderComponent;

/***/ }),
/* 108 */,
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsEqualDeep = __webpack_require__(290),
    isObjectLike = __webpack_require__(10);

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


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

var baseAssignValue = __webpack_require__(111),
    eq = __webpack_require__(27);

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


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

var defineProperty = __webpack_require__(157);

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


/***/ }),
/* 112 */,
/* 113 */,
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var emptyFunction = __webpack_require__(248);
var invariant = __webpack_require__(264);
var ReactPropTypesSecret = __webpack_require__(115);

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
/* 115 */
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
/* 116 */
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
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

var memoizeCapped = __webpack_require__(118);

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
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

var memoize = __webpack_require__(119);

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
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(59);

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
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

var Hash = __webpack_require__(121),
    ListCache = __webpack_require__(43),
    Map = __webpack_require__(60);

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
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

var hashClear = __webpack_require__(122),
    hashDelete = __webpack_require__(127),
    hashGet = __webpack_require__(128),
    hashHas = __webpack_require__(129),
    hashSet = __webpack_require__(130);

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
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(16);

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
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(47),
    isMasked = __webpack_require__(124),
    isObject = __webpack_require__(7),
    toSource = __webpack_require__(83);

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
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

var coreJsData = __webpack_require__(125);

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
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(6);

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;


/***/ }),
/* 126 */
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
/* 127 */
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
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(16);

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
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(16);

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
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

var nativeCreate = __webpack_require__(16);

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
/* 131 */
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
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(17);

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
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(17);

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
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(17);

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
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

var assocIndexOf = __webpack_require__(17);

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
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(18);

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
/* 137 */
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
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(18);

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
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(18);

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
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

var getMapData = __webpack_require__(18);

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
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(169);

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;


/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

var Uint8Array = __webpack_require__(170);

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;


/***/ }),
/* 143 */
/***/ (function(module, exports) {

module.exports = window.yoast._wp.components;

/***/ }),
/* 144 */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;

/***/ }),
/* 145 */
/***/ (function(module, exports) {

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;

/***/ }),
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(267);
var enumBugKeys = __webpack_require__(218);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(163);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

var baseTimes = __webpack_require__(275),
    isArguments = __webpack_require__(64),
    isArray = __webpack_require__(3),
    isBuffer = __webpack_require__(65),
    isIndex = __webpack_require__(85),
    isTypedArray = __webpack_require__(86);

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


/***/ }),
/* 153 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__baseGetTag_js__ = __webpack_require__(383);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__getPrototype_js__ = __webpack_require__(388);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__isObjectLike_js__ = __webpack_require__(390);




/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!Object(__WEBPACK_IMPORTED_MODULE_2__isObjectLike_js__["a" /* default */])(value) || Object(__WEBPACK_IMPORTED_MODULE_0__baseGetTag_js__["a" /* default */])(value) != objectTag) {
    return false;
  }
  var proto = Object(__WEBPACK_IMPORTED_MODULE_1__getPrototype_js__["a" /* default */])(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

/* harmony default export */ __webpack_exports__["a"] = (isPlainObject);


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

var SetCache = __webpack_require__(228),
    arraySome = __webpack_require__(293),
    cacheHas = __webpack_require__(229);

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


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(7);

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


/***/ }),
/* 156 */
/***/ (function(module, exports) {

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


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(14);

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * External Dependencies
                                                                                                                                                                                                                                                                               */


/**
 * Internal Dependencies
 */


var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactAddonsCreateFragment = __webpack_require__(540);

var _reactAddonsCreateFragment2 = _interopRequireDefault(_reactAddonsCreateFragment);

var _tokenize = __webpack_require__(543);

var _tokenize2 = _interopRequireDefault(_tokenize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var currentMixedString = void 0;

function getCloseIndex(openIndex, tokens) {
	var openToken = tokens[openIndex],
	    nestLevel = 0,
	    token,
	    i;
	for (i = openIndex + 1; i < tokens.length; i++) {
		token = tokens[i];
		if (token.value === openToken.value) {
			if (token.type === 'componentOpen') {
				nestLevel++;
				continue;
			}
			if (token.type === 'componentClose') {
				if (nestLevel === 0) {
					return i;
				}
				nestLevel--;
			}
		}
	}
	// if we get this far, there was no matching close token
	throw new Error('Missing closing component token `' + openToken.value + '`');
}

function buildChildren(tokens, components) {
	var children = [],
	    childrenObject = {},
	    openComponent,
	    clonedOpenComponent,
	    openIndex,
	    closeIndex,
	    token,
	    i,
	    grandChildTokens,
	    grandChildren,
	    siblingTokens,
	    siblings;

	for (i = 0; i < tokens.length; i++) {
		token = tokens[i];
		if (token.type === 'string') {
			children.push(token.value);
			continue;
		}
		// component node should at least be set
		if (!components.hasOwnProperty(token.value) || typeof components[token.value] === 'undefined') {
			throw new Error('Invalid interpolation, missing component node: `' + token.value + '`');
		}
		// should be either ReactElement or null (both type "object"), all other types deprecated
		if (_typeof(components[token.value]) !== 'object') {
			throw new Error('Invalid interpolation, component node must be a ReactElement or null: `' + token.value + '`', '\n> ' + currentMixedString);
		}
		// we should never see a componentClose token in this loop
		if (token.type === 'componentClose') {
			throw new Error('Missing opening component token: `' + token.value + '`');
		}
		if (token.type === 'componentOpen') {
			openComponent = components[token.value];
			openIndex = i;
			break;
		}
		// componentSelfClosing token
		children.push(components[token.value]);
		continue;
	}

	if (openComponent) {
		closeIndex = getCloseIndex(openIndex, tokens);
		grandChildTokens = tokens.slice(openIndex + 1, closeIndex);
		grandChildren = buildChildren(grandChildTokens, components);
		clonedOpenComponent = _react2.default.cloneElement(openComponent, {}, grandChildren);
		children.push(clonedOpenComponent);

		if (closeIndex < tokens.length - 1) {
			siblingTokens = tokens.slice(closeIndex + 1);
			siblings = buildChildren(siblingTokens, components);
			children = children.concat(siblings);
		}
	}

	if (children.length === 1) {
		return children[0];
	}

	children.forEach(function (child, index) {
		if (child) {
			childrenObject['interpolation-child-' + index] = child;
		}
	});

	return (0, _reactAddonsCreateFragment2.default)(childrenObject);
}

function interpolate(options) {
	var mixedString = options.mixedString,
	    components = options.components,
	    throwErrors = options.throwErrors;


	currentMixedString = mixedString;

	if (!components) {
		return mixedString;
	}

	if ((typeof components === 'undefined' ? 'undefined' : _typeof(components)) !== 'object') {
		if (throwErrors) {
			throw new Error('Interpolation Error: unable to process `' + mixedString + '` because components is not an object');
		}

		return mixedString;
	}

	var tokens = (0, _tokenize2.default)(mixedString);

	try {
		return buildChildren(tokens, components);
	} catch (error) {
		if (throwErrors) {
			throw new Error('Interpolation Error: unable to process `' + mixedString + '` because of error `' + error.message + '`');
		}

		return mixedString;
	}
};

exports.default = interpolate;
//# sourceMappingURL=index.js.map

/***/ }),
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 164 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 165 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 166 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

var baseForOwn = __webpack_require__(273),
    createBaseEach = __webpack_require__(280);

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


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

var isPrototype = __webpack_require__(69),
    nativeKeys = __webpack_require__(279);

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


/***/ }),
/* 169 */
/***/ (function(module, exports) {

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


/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(6);

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;


/***/ }),
/* 171 */
/***/ (function(module, exports) {

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


/***/ }),
/* 172 */
/***/ (function(module, exports) {

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


/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetAllKeys = __webpack_require__(174),
    getSymbols = __webpack_require__(105),
    keys = __webpack_require__(33);

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


/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(104),
    isArray = __webpack_require__(3);

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


/***/ }),
/* 175 */
/***/ (function(module, exports) {

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


/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetAllKeys = __webpack_require__(174),
    getSymbolsIn = __webpack_require__(234),
    keysIn = __webpack_require__(94);

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

module.exports = getAllKeysIn;


/***/ }),
/* 177 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array == null ? 0 : array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayReduce;


/***/ }),
/* 178 */
/***/ (function(module, exports) {

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = noop;


/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(7),
    now = __webpack_require__(526),
    toNumber = __webpack_require__(253);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;


/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isUndefined = __webpack_require__(15);

/**
 * Returns the l10n object for the current page, either term or post.
 *
 * @returns {Object} The l10n object for the current page.
 */
function getL10nObject() {
	var l10nObject = null;

	if (!isUndefined(window.wpseoPostScraperL10n)) {
		l10nObject = window.wpseoPostScraperL10n;
	} else if (!isUndefined(window.wpseoTermScraperL10n)) {
		l10nObject = window.wpseoTermScraperL10n;
	}

	return l10nObject;
}

module.exports = getL10nObject;

/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(811);

var assertThisInitialized = __webpack_require__(325);

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;

/***/ }),
/* 182 */
/***/ (function(module, exports) {

function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;

/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

var setPrototypeOf = __webpack_require__(812);

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits;

/***/ }),
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */
/***/ (function(module, exports) {

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


/***/ }),
/* 197 */
/***/ (function(module, exports) {

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


/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

var baseMatches = __webpack_require__(283),
    baseMatchesProperty = __webpack_require__(300),
    identity = __webpack_require__(66),
    isArray = __webpack_require__(3),
    property = __webpack_require__(303);

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


/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(44),
    baseClone = __webpack_require__(306),
    baseUnset = __webpack_require__(414),
    castPath = __webpack_require__(32),
    copyObject = __webpack_require__(45),
    customOmitClone = __webpack_require__(417),
    flatRest = __webpack_require__(313),
    getAllKeysIn = __webpack_require__(176);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * The opposite of `_.pick`; this method creates an object composed of the
 * own and inherited enumerable property paths of `object` that are not omitted.
 *
 * **Note:** This method is considerably slower than `_.pick`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to omit.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.omit(object, ['a', 'c']);
 * // => { 'b': '2' }
 */
var omit = flatRest(function(object, paths) {
  var result = {};
  if (object == null) {
    return result;
  }
  var isDeep = false;
  paths = arrayMap(paths, function(path) {
    path = castPath(path, object);
    isDeep || (isDeep = path.length > 1);
    return path;
  });
  copyObject(object, getAllKeysIn(object), result);
  if (isDeep) {
    result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
  }
  var length = paths.length;
  while (length--) {
    baseUnset(result, paths[length]);
  }
  return result;
});

module.exports = omit;


/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

var apply = __webpack_require__(201);

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


/***/ }),
/* 201 */
/***/ (function(module, exports) {

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


/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

var baseSetToString = __webpack_require__(316),
    shortOut = __webpack_require__(318);

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


/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

var identity = __webpack_require__(66),
    overRest = __webpack_require__(200),
    setToString = __webpack_require__(202);

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


/***/ }),
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */,
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(372);
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
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(80);
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
/* 215 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(217)('keys');
var uid = __webpack_require__(166);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(19);
var global = __webpack_require__(56);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(165) ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 218 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setTextdomainL10n = setTextdomainL10n;
exports.setYoastComponentsL10n = setYoastComponentsL10n;
exports.setWordPressSeoL10n = setWordPressSeoL10n;

var _i18n = __webpack_require__(8);

var _get = __webpack_require__(28);

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
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

var createBaseFor = __webpack_require__(274);

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


/***/ }),
/* 221 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = warning;
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}

/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
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

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (false) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;


/***/ }),
/* 223 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActionTypes; });
/* harmony export (immutable) */ __webpack_exports__["b"] = createStore;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_es_isPlainObject__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_symbol_observable__ = __webpack_require__(391);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_symbol_observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_symbol_observable__);



/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = {
  INIT: '@@redux/INIT'

  /**
   * Creates a Redux store that holds the state tree.
   * The only way to change the data in the store is to call `dispatch()` on it.
   *
   * There should only be a single store in your app. To specify how different
   * parts of the state tree respond to actions, you may combine several reducers
   * into a single reducer function by using `combineReducers`.
   *
   * @param {Function} reducer A function that returns the next state tree, given
   * the current state tree and the action to handle.
   *
   * @param {any} [preloadedState] The initial state. You may optionally specify it
   * to hydrate the state from the server in universal apps, or to restore a
   * previously serialized user session.
   * If you use `combineReducers` to produce the root reducer function, this must be
   * an object with the same shape as `combineReducers` keys.
   *
   * @param {Function} [enhancer] The store enhancer. You may optionally specify it
   * to enhance the store with third-party capabilities such as middleware,
   * time travel, persistence, etc. The only store enhancer that ships with Redux
   * is `applyMiddleware()`.
   *
   * @returns {Store} A Redux store that lets you read the state, dispatch actions
   * and subscribe to changes.
   */
};function createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!Object(__WEBPACK_IMPORTED_MODULE_0_lodash_es_isPlainObject__["a" /* default */])(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */
  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return { unsubscribe: unsubscribe };
      }
    }, _ref[__WEBPACK_IMPORTED_MODULE_1_symbol_observable___default.a] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[__WEBPACK_IMPORTED_MODULE_1_symbol_observable___default.a] = observable, _ref2;
}

/***/ }),
/* 224 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__root_js__ = __webpack_require__(384);


/** Built-in value references. */
var Symbol = __WEBPACK_IMPORTED_MODULE_0__root_js__["a" /* default */].Symbol;

/* harmony default export */ __webpack_exports__["a"] = (Symbol);


/***/ }),
/* 225 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}

/***/ }),
/* 226 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = compose;
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(undefined, arguments));
    };
  });
}

/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

var baseFindIndex = __webpack_require__(252),
    baseIsNaN = __webpack_require__(281),
    strictIndexOf = __webpack_require__(282);

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


/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

var MapCache = __webpack_require__(59),
    setCacheAdd = __webpack_require__(291),
    setCacheHas = __webpack_require__(292);

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


/***/ }),
/* 229 */
/***/ (function(module, exports) {

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


/***/ }),
/* 230 */
/***/ (function(module, exports) {

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


/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(14),
    root = __webpack_require__(6);

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;


/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(32),
    isArguments = __webpack_require__(64),
    isArray = __webpack_require__(3),
    isIndex = __webpack_require__(85),
    isLength = __webpack_require__(93),
    toKey = __webpack_require__(24);

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


/***/ }),
/* 233 */
/***/ (function(module, exports) {

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;


/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(104),
    getPrototype = __webpack_require__(141),
    getSymbols = __webpack_require__(105),
    stubArray = __webpack_require__(175);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

module.exports = getSymbolsIn;


/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(7);

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

module.exports = baseCreate;


/***/ }),
/* 236 */
/***/ (function(module, exports) {

module.exports = window.lodash;

/***/ }),
/* 237 */
/***/ (function(module, exports) {

function _extends() {
  module.exports = _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

module.exports = _extends;

/***/ }),
/* 238 */,
/* 239 */,
/* 240 */,
/* 241 */,
/* 242 */,
/* 243 */,
/* 244 */,
/* 245 */,
/* 246 */,
/* 247 */,
/* 248 */,
/* 249 */,
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var freeGlobal = __webpack_require__(73);

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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(29)(module)))

/***/ }),
/* 251 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createStore__ = __webpack_require__(223);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__combineReducers__ = __webpack_require__(394);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__bindActionCreators__ = __webpack_require__(395);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__applyMiddleware__ = __webpack_require__(396);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__compose__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_warning__ = __webpack_require__(225);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "createStore", function() { return __WEBPACK_IMPORTED_MODULE_0__createStore__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "combineReducers", function() { return __WEBPACK_IMPORTED_MODULE_1__combineReducers__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "bindActionCreators", function() { return __WEBPACK_IMPORTED_MODULE_2__bindActionCreators__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "applyMiddleware", function() { return __WEBPACK_IMPORTED_MODULE_3__applyMiddleware__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "compose", function() { return __WEBPACK_IMPORTED_MODULE_4__compose__["a"]; });







/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed() {}

if (false) {
  warning('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}



/***/ }),
/* 252 */
/***/ (function(module, exports) {

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


/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(7),
    isSymbol = __webpack_require__(20);

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


/***/ }),
/* 254 */
/***/ (function(module, exports) {

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


/***/ }),
/* 255 */
/***/ (function(module, exports) {

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


/***/ }),
/* 256 */,
/* 257 */,
/* 258 */,
/* 259 */,
/* 260 */,
/* 261 */,
/* 262 */,
/* 263 */,
/* 264 */,
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(68) && !__webpack_require__(81)(function () {
  return Object.defineProperty(__webpack_require__(266)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(80);
var document = __webpack_require__(56).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 267 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(82);
var toIObject = __webpack_require__(90);
var arrayIndexOf = __webpack_require__(373)(false);
var IE_PROTO = __webpack_require__(216)('IE_PROTO');

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
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(215);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 269 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(164);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 270 */,
/* 271 */,
/* 272 */,
/* 273 */
/***/ (function(module, exports, __webpack_require__) {

var baseFor = __webpack_require__(220),
    keys = __webpack_require__(33);

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


/***/ }),
/* 274 */
/***/ (function(module, exports) {

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


/***/ }),
/* 275 */
/***/ (function(module, exports) {

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


/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(12),
    isObjectLike = __webpack_require__(10);

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


/***/ }),
/* 277 */
/***/ (function(module, exports) {

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


/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(12),
    isLength = __webpack_require__(93),
    isObjectLike = __webpack_require__(10);

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


/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

var overArg = __webpack_require__(169);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;


/***/ }),
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

var isArrayLike = __webpack_require__(30);

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


/***/ }),
/* 281 */
/***/ (function(module, exports) {

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


/***/ }),
/* 282 */
/***/ (function(module, exports) {

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


/***/ }),
/* 283 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsMatch = __webpack_require__(284),
    getMatchData = __webpack_require__(299),
    matchesStrictComparable = __webpack_require__(156);

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


/***/ }),
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(87),
    baseIsEqual = __webpack_require__(109);

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


/***/ }),
/* 285 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(43);

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


/***/ }),
/* 286 */
/***/ (function(module, exports) {

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


/***/ }),
/* 287 */
/***/ (function(module, exports) {

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


/***/ }),
/* 288 */
/***/ (function(module, exports) {

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


/***/ }),
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

var ListCache = __webpack_require__(43),
    Map = __webpack_require__(60),
    MapCache = __webpack_require__(59);

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


/***/ }),
/* 290 */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(87),
    equalArrays = __webpack_require__(154),
    equalByTag = __webpack_require__(294),
    equalObjects = __webpack_require__(295),
    getTag = __webpack_require__(106),
    isArray = __webpack_require__(3),
    isBuffer = __webpack_require__(65),
    isTypedArray = __webpack_require__(86);

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


/***/ }),
/* 291 */
/***/ (function(module, exports) {

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


/***/ }),
/* 292 */
/***/ (function(module, exports) {

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


/***/ }),
/* 293 */
/***/ (function(module, exports) {

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


/***/ }),
/* 294 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(13),
    Uint8Array = __webpack_require__(170),
    eq = __webpack_require__(27),
    equalArrays = __webpack_require__(154),
    mapToArray = __webpack_require__(171),
    setToArray = __webpack_require__(172);

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


/***/ }),
/* 295 */
/***/ (function(module, exports, __webpack_require__) {

var getAllKeys = __webpack_require__(173);

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


/***/ }),
/* 296 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(14),
    root = __webpack_require__(6);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;


/***/ }),
/* 297 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(14),
    root = __webpack_require__(6);

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;


/***/ }),
/* 298 */
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(14),
    root = __webpack_require__(6);

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;


/***/ }),
/* 299 */
/***/ (function(module, exports, __webpack_require__) {

var isStrictComparable = __webpack_require__(155),
    keys = __webpack_require__(33);

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


/***/ }),
/* 300 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsEqual = __webpack_require__(109),
    get = __webpack_require__(28),
    hasIn = __webpack_require__(301),
    isKey = __webpack_require__(58),
    isStrictComparable = __webpack_require__(155),
    matchesStrictComparable = __webpack_require__(156),
    toKey = __webpack_require__(24);

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


/***/ }),
/* 301 */
/***/ (function(module, exports, __webpack_require__) {

var baseHasIn = __webpack_require__(302),
    hasPath = __webpack_require__(232);

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


/***/ }),
/* 302 */
/***/ (function(module, exports) {

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


/***/ }),
/* 303 */
/***/ (function(module, exports, __webpack_require__) {

var baseProperty = __webpack_require__(254),
    basePropertyDeep = __webpack_require__(304),
    isKey = __webpack_require__(58),
    toKey = __webpack_require__(24);

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


/***/ }),
/* 304 */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(53);

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


/***/ }),
/* 305 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.nonReplaceVars = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* External dependencies */


/* Internal dependencies */


exports.fillReplacementVariables = fillReplacementVariables;
exports.handlePrefixes = handlePrefixes;
exports.createLabelFromName = createLabelFromName;
exports.pushNewReplaceVar = pushNewReplaceVar;
exports.replaceSpaces = replaceSpaces;
exports.prepareCustomFieldForDispatch = prepareCustomFieldForDispatch;
exports.prepareCustomTaxonomyForDispatch = prepareCustomTaxonomyForDispatch;
exports.mapCustomTaxonomies = mapCustomTaxonomies;
exports.mapCustomFields = mapCustomFields;

var _forEach = __webpack_require__(98);

var _forEach2 = _interopRequireDefault(_forEach);

var _omit = __webpack_require__(199);

var _omit2 = _interopRequireDefault(_omit);

var _snippetEditor = __webpack_require__(61);

var _stringHelpers = __webpack_require__(346);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nonReplaceVars = exports.nonReplaceVars = ["slug", "content"];

/**
 * Fills the redux store with the newly acquired data.
 *
 * @param {Object} data  The data object.
 * @param {Object} store The redux store.
 *
 * @returns {void}
 */
function fillReplacementVariables(data, store) {
	(0, _forEach2.default)(data, function (value, name) {
		if (nonReplaceVars.includes(name)) {
			return;
		}
		store.dispatch((0, _snippetEditor.updateReplacementVariable)(name, value));
	});
}

/**
 * Handles ct_, cf_, and pt_ prefixes (and their desc_ variants).
 * It strips the prefix, and adds it in full-word form at the end of the name.
 *
 * @param {string} name The name for which the prefix should be handled.
 *
 * @returns {string} The handled name, stripped from prefixes.
 */
function handlePrefixes(name) {
	var prefixes = ["ct_", "cf_", "pt_"];

	// If there are no prefixes, replace underscores by spaces and return.
	if (!prefixes.includes(name.substr(0, 3))) {
		return name.replace(/_/g, " ");
	}

	// Strip "ct_", "cf_", or "pt_", and save it for the switch statement.
	var prefix = name.slice(0, 3);
	name = name.slice(3);

	// Remove "desc_" and append " description".
	if (name.indexOf("desc_") !== -1) {
		name = name.slice(5) + " description";
	}

	// Appends the prefix in full-word form at the end of the name.
	switch (prefix) {
		case "ct_":
			name += " (custom taxonomy)";
			break;
		case "cf_":
			name += " (custom field)";
			break;
		case "pt_":
			name = name.replace("single", "singular");
			name = "Post type (" + name + ")";
			break;
		default:
			break;
	}
	return name;
}

/**
 * Creates a "nicename" label from a replacementVariable name.
 *
 * @param {string} name The name from which a label should be created
 *
 * @returns {string} The label that was created for the replacementVariable.
 */
function createLabelFromName(name) {
	name = handlePrefixes(name);

	// Capitalize first letter
	return (0, _stringHelpers.firstToUpperCase)(name);
}

/**
 * Pushes a new replacement variable from an action into the replacementVariables array.
 * Creates a label from the replacement variable name when no label is supplied.
 *
 * @param {array}  replacementVariables The current replacement variable list
 * @param {Object} action               The UPDATE_REPLACEMENT_VARIABLE action.
 * @param {string} action.name          The name of the replacement variable.
 * @param {string} [action.label]       The label of the replacement variable (optional).
 * @param {*}      action.value         The value of the replacement variable.
 *
 * @returns {array} The extended list of replacement variables.
 */
function pushNewReplaceVar(replacementVariables, action) {
	replacementVariables.push({
		name: action.name,
		label: action.label || createLabelFromName(action.name),
		value: action.value
	});
	return replacementVariables;
}

/**
 * Replace spaces in a string with an underscore (default) or some other symbol/string.
 *
 * @param {string} string      The string in which to replace spaces.
 * @param {string} replacement The symbol or string to replace the spaces with (underscore by default).
 *
 * @returns {string} The string without spaces.
 */
function replaceSpaces(string) {
	var replacement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "_";

	// Replace whitespaces with the replacement.
	return string.replace(/\s/g, replacement);
}

/**
 * Prepare the custom field for dispatch to the redux store.
 * The main use here is to have control over the label, which needs to be created before spaces are replaced.
 *
 * @param {string} name The name of the custom field.
 * @returns {Object}    An object containing the replacement variable name and nice label.
 */
function prepareCustomFieldForDispatch(name) {
	return {
		name: "cf_" + replaceSpaces(name),
		label: (0, _stringHelpers.firstToUpperCase)(name + " (custom field)")
	};
}

/**
 * Prepare the custom taxonomy for dispatch to the redux store.
 * The main use here is to have control over the label, which needs to be created before spaces are replaced.
 *
 * @param {string} name The name of the custom taxonomy.
 * @returns {Object}    An object containing the replacement variable name and nice label, also for the description.
 */
function prepareCustomTaxonomyForDispatch(name) {
	var protoName = replaceSpaces(name);
	return {
		name: "ct_" + protoName,
		label: (0, _stringHelpers.firstToUpperCase)(name + " (custom taxonomy)"),
		descriptionName: "ct_desc_" + protoName,
		descriptionLabel: (0, _stringHelpers.firstToUpperCase)(name + " description (custom taxonomy)")
	};
}

/**
 * Map the custom_taxonomies field in the replacevars to a format suited for redux.
 *
 * @param {Object} replaceVars       The original replacevars.
 * @param {Object} store             The redux store.
 *
 * @returns {Object}                 The restructured replacevars object without custom_taxonomies.
 */
function mapCustomTaxonomies(replaceVars, store) {
	if (!replaceVars.custom_taxonomies) {
		return replaceVars;
	}

	(0, _forEach2.default)(replaceVars.custom_taxonomies, function (value, key) {
		var _prepareCustomTaxonom = prepareCustomTaxonomyForDispatch(key),
		    name = _prepareCustomTaxonom.name,
		    label = _prepareCustomTaxonom.label,
		    descriptionName = _prepareCustomTaxonom.descriptionName,
		    descriptionLabel = _prepareCustomTaxonom.descriptionLabel;

		store.dispatch((0, _snippetEditor.updateReplacementVariable)(name, value.name, label));
		store.dispatch((0, _snippetEditor.updateReplacementVariable)(descriptionName, value.description, descriptionLabel));
	});

	return (0, _omit2.default)(_extends({}, replaceVars), "custom_taxonomies");
}

/**
 * Map the custom_fields field in the replacevars to a format suited for redux.
 *
 * @param {Object} replaceVars       The original replacevars.
 * @param {Object} store             The redux store.
 *
 * @returns {Object}                 The restructured replacevars object without custom_fields.
 */
function mapCustomFields(replaceVars, store) {
	if (!replaceVars.custom_fields) {
		return replaceVars;
	}

	(0, _forEach2.default)(replaceVars.custom_fields, function (value, key) {
		var _prepareCustomFieldFo = prepareCustomFieldForDispatch(key),
		    name = _prepareCustomFieldFo.name,
		    label = _prepareCustomFieldFo.label;

		store.dispatch((0, _snippetEditor.updateReplacementVariable)(name, value, label));
	});

	return (0, _omit2.default)(_extends({}, replaceVars), "custom_fields");
}

/***/ }),
/* 306 */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(87),
    arrayEach = __webpack_require__(196),
    assignValue = __webpack_require__(110),
    baseAssign = __webpack_require__(401),
    baseAssignIn = __webpack_require__(402),
    cloneBuffer = __webpack_require__(309),
    copyArray = __webpack_require__(233),
    copySymbols = __webpack_require__(403),
    copySymbolsIn = __webpack_require__(404),
    getAllKeys = __webpack_require__(173),
    getAllKeysIn = __webpack_require__(176),
    getTag = __webpack_require__(106),
    initCloneArray = __webpack_require__(405),
    initCloneByTag = __webpack_require__(406),
    initCloneObject = __webpack_require__(311),
    isArray = __webpack_require__(3),
    isBuffer = __webpack_require__(65),
    isObject = __webpack_require__(7),
    keys = __webpack_require__(33);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
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

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = (isFlat || isFunc) ? {} : initCloneObject(value);
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, baseAssignIn(result, value))
          : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  var keysFunc = isFull
    ? (isFlat ? getAllKeysIn : getAllKeys)
    : (isFlat ? keysIn : keys);

  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;


/***/ }),
/* 307 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(7),
    isPrototype = __webpack_require__(69),
    nativeKeysIn = __webpack_require__(308);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = baseKeysIn;


/***/ }),
/* 308 */
/***/ (function(module, exports) {

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = nativeKeysIn;


/***/ }),
/* 309 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var root = __webpack_require__(6);

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(29)(module)))

/***/ }),
/* 310 */
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(142);

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;


/***/ }),
/* 311 */
/***/ (function(module, exports, __webpack_require__) {

var baseCreate = __webpack_require__(235),
    getPrototype = __webpack_require__(141),
    isPrototype = __webpack_require__(69);

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;


/***/ }),
/* 312 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(12),
    getPrototype = __webpack_require__(141),
    isObjectLike = __webpack_require__(10);

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

module.exports = isPlainObject;


/***/ }),
/* 313 */
/***/ (function(module, exports, __webpack_require__) {

var flatten = __webpack_require__(314),
    overRest = __webpack_require__(200),
    setToString = __webpack_require__(202);

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


/***/ }),
/* 314 */
/***/ (function(module, exports, __webpack_require__) {

var baseFlatten = __webpack_require__(315);

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


/***/ }),
/* 315 */
/***/ (function(module, exports, __webpack_require__) {

var arrayPush = __webpack_require__(104),
    isFlattenable = __webpack_require__(418);

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


/***/ }),
/* 316 */
/***/ (function(module, exports, __webpack_require__) {

var constant = __webpack_require__(317),
    defineProperty = __webpack_require__(157),
    identity = __webpack_require__(66);

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


/***/ }),
/* 317 */
/***/ (function(module, exports) {

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


/***/ }),
/* 318 */
/***/ (function(module, exports) {

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


/***/ }),
/* 319 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var PREFIX = "WPSEO_";

var SET_FOCUS_KEYWORD = exports.SET_FOCUS_KEYWORD = PREFIX + "SET_FOCUS_KEYWORD";

/**
 * An action creator for setting the focus keyword.
 *
 * @param {string} keyword The focus keyword.
 *
 * @returns {Object} Action.
 */
var setFocusKeyword = exports.setFocusKeyword = function setFocusKeyword(keyword) {
  return {
    type: SET_FOCUS_KEYWORD,
    keyword: keyword
  };
};

/***/ }),
/* 320 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getL10nObject = __webpack_require__(180);

var isUndefined = __webpack_require__(15);

/**
 * Returns whether or not the keyword analysis is active
 *
 * @returns {boolean} Whether or not the keyword analysis is active.
 */
function isKeywordAnalysisActive() {
  var l10nObject = getL10nObject();

  return !isUndefined(l10nObject) && l10nObject.keywordAnalysisActive === "1";
}

module.exports = isKeywordAnalysisActive;

/***/ }),
/* 321 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _compatibilityHelper = __webpack_require__(620);

var _compatibilityHelper2 = _interopRequireDefault(_compatibilityHelper);

var _markerButtons = __webpack_require__(350);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var forEach = __webpack_require__(98); /* global tinyMCE, require, YoastSEO */

var isUndefined = __webpack_require__(15);
var editorHasMarks = __webpack_require__(425).editorHasMarks;
var editorRemoveMarks = __webpack_require__(425).editorRemoveMarks;

var store = void 0;

/**
 * The HTML 'id' attribute for the TinyMCE editor.
 *
 * @type {string}
 */
var tmceId = "content";

/**
 * The HTML 'id' attribute for the tinyMCE editor on the edit term page.
 *
 * @type {string}
 */
var termsTmceId = "description";

(function () {
	/**
  * Sets the store.
  *
  * @param {Object} newStore The store to set.
  * @returns {void}
  */
	function setStore(newStore) {
		store = newStore;
	}

	/**
  * Gets content from the content field by element id.
  *
  * @param {String} contentID The (HTML) id attribute for the TinyMCE field.
  *
  * @returns {String} The tinyMCE content.
  */
	function tinyMCEElementContent(contentID) {
		return document.getElementById(contentID) && document.getElementById(contentID).value || "";
	}

	/**
  * Returns whether or not the tinyMCE script is available on the page.
  *
  * @returns {boolean} True when tinyMCE is loaded.
  */
	function isTinyMCELoaded() {
		return typeof tinyMCE !== "undefined" && typeof tinyMCE.editors !== "undefined" && tinyMCE.editors.length !== 0;
	}

	/**
  * Checks if the TinyMCE iframe is available. TinyMCE needs this for getContent to be working.
  * If this element isn't loaded yet, it will let tinyMCE crash when calling getContent. Since tinyMCE
  * itself doesn't have a check for this and simply assumes the element is always there, we need
  * to do this check ourselves.
  *
  * @param {string} editorID The ID of the tinyMCE editor.
  *
  * @returns {boolean} Whether the element is found or not.
  */
	function isTinyMCEBodyAvailable(editorID) {
		return document.getElementById(editorID + "_ifr") !== null;
	}

	/**
  * Returns whether or not a tinyMCE editor with the given ID is available.
  *
  * @param {string} editorID The ID of the tinyMCE editor.
  *
  * @returns {void}
  */
	function isTinyMCEAvailable(editorID) {
		if (!isTinyMCELoaded()) {
			return false;
		}

		var editor = tinyMCE.get(editorID);

		return editor !== null && !editor.isHidden();
	}

	/**
  * Converts the html entities for symbols back to the original symbol. For now this only converts the & symbol.
  * @param {String} text The text to replace the '&amp;' entities.
  * @returns {String} text Text with html entities replaced by the symbol.
  */
	function convertHtmlEntities(text) {
		// Create regular expression, this searches for the html entity '&amp;', the 'g' param is for searching the whole text.
		var regularExpression = new RegExp("&amp;", "g");
		return text.replace(regularExpression, "&");
	}

	/**
  * Returns the value of the content field via TinyMCE object, or ff tinyMCE isn't initialized via the content element id.
  * Also converts 'amp;' to & in the content.
  * @param {String} contentID The (HTML) id attribute for the TinyMCE field.
  * @returns {String} Content from the TinyMCE editor.
  */
	function getContentTinyMce(contentID) {
		// If no TinyMCE object available
		var content = "";
		if (isTinyMCEAvailable(contentID) === false || isTinyMCEBodyAvailable(contentID) === false) {
			content = tinyMCEElementContent(contentID);
		} else {
			content = tinyMCE.get(contentID).getContent();
		}

		return convertHtmlEntities(content);
	}
	/**
  * Adds an event handler to certain tinyMCE events.
  *
  * @param {string} editorId The ID for the tinyMCE editor.
  * @param {Array<string>} events The events to bind to.
  * @param {Function} callback The function to call when an event occurs.
  *
  * @returns {void}
  */
	function addEventHandler(editorId, events, callback) {
		if (typeof tinyMCE === "undefined" || typeof tinyMCE.on !== "function") {
			return;
		}

		tinyMCE.on("addEditor", function (evt) {
			var editor = evt.editor;

			if (editor.id !== editorId) {
				return;
			}

			forEach(events, function (eventName) {
				editor.on(eventName, callback);
			});
		});
	}

	/**
  * Calls the function in the YoastSEO.js app that disables the marker (eye)icons.
  *
  * @returns {void}
  */
	function disableMarkerButtons() {
		if (!isUndefined(store)) {
			store.dispatch((0, _markerButtons.setMarkerStatus)("disabled"));
		}
	}

	/**
  * Calls the function in the YoastSEO.js app that enables the marker (eye)icons.
  *
  * @returns {void}
  */
	function enableMarkerButtons() {
		if (!isUndefined(store)) {
			store.dispatch((0, _markerButtons.setMarkerStatus)("enabled"));
		}
	}

	/**
  * If #wp-content-wrap has the 'html-active' class, text view is enabled in WordPress.
  * TMCE is not available, the text cannot be marked and so the marker buttons are disabled.
  *
  * @returns {boolean} Whether the text view is active.
  */
	function isTextViewActive() {
		var contentWrapElement = document.getElementById("wp-content-wrap");
		if (!contentWrapElement) {
			return false;
		}
		return contentWrapElement.classList.contains("html-active");
	}

	/**
  * Check if the TinyMCE editor is created in the DOM. If it doesn't exist yet an on create event created.
  * This enables the marker buttons, when TinyMCE is created.
  *
  * @returns {void}
  */
	function wpTextViewOnInitCheck() {
		if (!isTextViewActive()) {
			return;
		}

		disableMarkerButtons();

		if (isTinyMCELoaded()) {
			tinyMCE.on("AddEditor", function () {
				enableMarkerButtons();
			});
		}
	}

	/**
  * Binds the renewData functionality to the TinyMCE content field on the change of input elements.
  *
  * @param {App} app YoastSeo application.
  * @param {String} tmceId The ID of the tinyMCE editor.
  *
  * @returns {void}
  */
	function tinyMceEventBinder(app, tmceId) {
		addEventHandler(tmceId, ["input", "change", "cut", "paste"], app.refresh.bind(app));

		addEventHandler(tmceId, ["hide"], disableMarkerButtons);

		var enableEvents = ["show"];
		var compatibilityHelper = new _compatibilityHelper2.default();
		if (!compatibilityHelper.isPageBuilderActive()) {
			enableEvents.push("init");
		}

		addEventHandler(tmceId, enableEvents, enableMarkerButtons);

		addEventHandler("content", ["focus"], function (evt) {
			var editor = evt.target;

			if (editorHasMarks(editor)) {
				editorRemoveMarks(editor);

				YoastSEO.app.disableMarkers();
			}
		});
	}

	module.exports = {
		addEventHandler: addEventHandler,
		tinyMceEventBinder: tinyMceEventBinder,
		getContentTinyMce: getContentTinyMce,
		isTinyMCEAvailable: isTinyMCEAvailable,
		isTinyMCELoaded: isTinyMCELoaded,
		disableMarkerButtons: disableMarkerButtons,
		enableMarkerButtons: enableMarkerButtons,
		wpTextViewOnInitCheck: wpTextViewOnInitCheck,
		isTextViewActive: isTextViewActive,
		tmceId: tmceId,
		termsTmceId: termsTmceId,
		setStore: setStore
	};
})(jQuery);

/***/ }),
/* 322 */
/***/ (function(module, exports, __webpack_require__) {

var baseRest = __webpack_require__(203),
    isIterateeCall = __webpack_require__(424);

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;


/***/ }),
/* 323 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _yoastComponents = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Sidebar Collapsible component with default padding and separator
 *
 * @param {Object} props The properties for the component.
 *
 * @returns {ReactElement} The Collapsible component.
 */
var SidebarCollapsible = function SidebarCollapsible(props) {
  return yoast._wp.element.createElement(_yoastComponents.Collapsible, _extends({ hasPadding: true, hasSeparator: true }, props));
};

exports.default = SidebarCollapsible;

/***/ }),
/* 324 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _isUndefined = __webpack_require__(15);

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _yoastseo = __webpack_require__(70);

var _isNil = __webpack_require__(536);

var _isNil2 = _interopRequireDefault(_isNil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scoreToRating = _yoastseo.helpers.scoreToRating;

/**
 * Returns whether or not the current page has presenters.
 *
 * @returns {boolean} Whether or not the page has presenters.
 */
/* global YoastSEO */

var hasPresenter = function hasPresenter() {
	var app = YoastSEO.app;

	return !(0, _isUndefined2.default)(app.seoAssessorPresenter) || !(0, _isUndefined2.default)(app.contentAssessorPresenter);
};

/**
 * Returns the presenter that is currently present on the page. Prevent errors if one of the analyses is disabled.
 *
 * @returns {AssessorPresenter} An active assessor presenter.
 */
var getPresenter = function getPresenter() {
	var app = YoastSEO.app;

	if (!(0, _isUndefined2.default)(app.seoAssessorPresenter)) {
		return app.seoAssessorPresenter;
	}

	if (!(0, _isUndefined2.default)(app.contentAssessorPresenter)) {
		return app.contentAssessorPresenter;
	}
};

/**
 * Simple helper function that returns the indicator for a given total score
 *
 * @param {number} score The score from 0 to 100.
 * @returns {Object} The indicator for the given score.
 */
function getIndicatorForScore(score) {
	var indicator = {
		className: "",
		screenReaderText: "",
		fullText: "",
		screenReaderReadabilityText: ""
	};

	if (!hasPresenter()) {
		return indicator;
	}

	if ((0, _isNil2.default)(score)) {
		indicator.className = "loading";

		return indicator;
	}

	// Scale because scoreToRating works from 0 to 10.
	score /= 10;

	var presenter = getPresenter();

	return presenter.getIndicator(scoreToRating(score));
}

module.exports = getIndicatorForScore;

/***/ }),
/* 325 */
/***/ (function(module, exports) {

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;

/***/ }),
/* 326 */,
/* 327 */,
/* 328 */,
/* 329 */,
/* 330 */,
/* 331 */,
/* 332 */,
/* 333 */,
/* 334 */,
/* 335 */,
/* 336 */,
/* 337 */,
/* 338 */,
/* 339 */,
/* 340 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(78);
var core = __webpack_require__(19);
var fails = __webpack_require__(81);
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),
/* 341 */,
/* 342 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return subscriptionShape; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return storeShape; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_prop_types__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_prop_types__);


var subscriptionShape = __WEBPACK_IMPORTED_MODULE_0_prop_types___default.a.shape({
  trySubscribe: __WEBPACK_IMPORTED_MODULE_0_prop_types___default.a.func.isRequired,
  tryUnsubscribe: __WEBPACK_IMPORTED_MODULE_0_prop_types___default.a.func.isRequired,
  notifyNestedSubs: __WEBPACK_IMPORTED_MODULE_0_prop_types___default.a.func.isRequired,
  isSubscribed: __WEBPACK_IMPORTED_MODULE_0_prop_types___default.a.func.isRequired
});

var storeShape = __WEBPACK_IMPORTED_MODULE_0_prop_types___default.a.shape({
  subscribe: __WEBPACK_IMPORTED_MODULE_0_prop_types___default.a.func.isRequired,
  dispatch: __WEBPACK_IMPORTED_MODULE_0_prop_types___default.a.func.isRequired,
  getState: __WEBPACK_IMPORTED_MODULE_0_prop_types___default.a.func.isRequired
});

/***/ }),
/* 343 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = connectAdvanced;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_hoist_non_react_statics__ = __webpack_require__(493);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_hoist_non_react_statics___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_hoist_non_react_statics__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_invariant__ = __webpack_require__(222);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_invariant___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_invariant__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_Subscription__ = __webpack_require__(494);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utils_PropTypes__ = __webpack_require__(342);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }








var hotReloadingVersion = 0;
var dummyState = {};
function noop() {}
function makeSelectorStateful(sourceSelector, store) {
  // wrap the selector in an object that tracks its results between runs.
  var selector = {
    run: function runComponentSelector(props) {
      try {
        var nextProps = sourceSelector(store.getState(), props);
        if (nextProps !== selector.props || selector.error) {
          selector.shouldComponentUpdate = true;
          selector.props = nextProps;
          selector.error = null;
        }
      } catch (error) {
        selector.shouldComponentUpdate = true;
        selector.error = error;
      }
    }
  };

  return selector;
}

function connectAdvanced(
/*
  selectorFactory is a func that is responsible for returning the selector function used to
  compute new props from state, props, and dispatch. For example:
     export default connectAdvanced((dispatch, options) => (state, props) => ({
      thing: state.things[props.thingId],
      saveThing: fields => dispatch(actionCreators.saveThing(props.thingId, fields)),
    }))(YourComponent)
   Access to dispatch is provided to the factory so selectorFactories can bind actionCreators
  outside of their selector as an optimization. Options passed to connectAdvanced are passed to
  the selectorFactory, along with displayName and WrappedComponent, as the second argument.
   Note that selectorFactory is responsible for all caching/memoization of inbound and outbound
  props. Do not use connectAdvanced directly without memoizing results between calls to your
  selector, otherwise the Connect component will re-render on every state or props change.
*/
selectorFactory) {
  var _contextTypes, _childContextTypes;

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$getDisplayName = _ref.getDisplayName,
      getDisplayName = _ref$getDisplayName === undefined ? function (name) {
    return 'ConnectAdvanced(' + name + ')';
  } : _ref$getDisplayName,
      _ref$methodName = _ref.methodName,
      methodName = _ref$methodName === undefined ? 'connectAdvanced' : _ref$methodName,
      _ref$renderCountProp = _ref.renderCountProp,
      renderCountProp = _ref$renderCountProp === undefined ? undefined : _ref$renderCountProp,
      _ref$shouldHandleStat = _ref.shouldHandleStateChanges,
      shouldHandleStateChanges = _ref$shouldHandleStat === undefined ? true : _ref$shouldHandleStat,
      _ref$storeKey = _ref.storeKey,
      storeKey = _ref$storeKey === undefined ? 'store' : _ref$storeKey,
      _ref$withRef = _ref.withRef,
      withRef = _ref$withRef === undefined ? false : _ref$withRef,
      connectOptions = _objectWithoutProperties(_ref, ['getDisplayName', 'methodName', 'renderCountProp', 'shouldHandleStateChanges', 'storeKey', 'withRef']);

  var subscriptionKey = storeKey + 'Subscription';
  var version = hotReloadingVersion++;

  var contextTypes = (_contextTypes = {}, _contextTypes[storeKey] = __WEBPACK_IMPORTED_MODULE_4__utils_PropTypes__["a" /* storeShape */], _contextTypes[subscriptionKey] = __WEBPACK_IMPORTED_MODULE_4__utils_PropTypes__["b" /* subscriptionShape */], _contextTypes);
  var childContextTypes = (_childContextTypes = {}, _childContextTypes[subscriptionKey] = __WEBPACK_IMPORTED_MODULE_4__utils_PropTypes__["b" /* subscriptionShape */], _childContextTypes);

  return function wrapWithConnect(WrappedComponent) {
    __WEBPACK_IMPORTED_MODULE_1_invariant___default()(typeof WrappedComponent == 'function', 'You must pass a component to the function returned by ' + ('connect. Instead received ' + JSON.stringify(WrappedComponent)));

    var wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

    var displayName = getDisplayName(wrappedComponentName);

    var selectorFactoryOptions = _extends({}, connectOptions, {
      getDisplayName: getDisplayName,
      methodName: methodName,
      renderCountProp: renderCountProp,
      shouldHandleStateChanges: shouldHandleStateChanges,
      storeKey: storeKey,
      withRef: withRef,
      displayName: displayName,
      wrappedComponentName: wrappedComponentName,
      WrappedComponent: WrappedComponent
    });

    var Connect = function (_Component) {
      _inherits(Connect, _Component);

      function Connect(props, context) {
        _classCallCheck(this, Connect);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

        _this.version = version;
        _this.state = {};
        _this.renderCount = 0;
        _this.store = props[storeKey] || context[storeKey];
        _this.propsMode = Boolean(props[storeKey]);
        _this.setWrappedInstance = _this.setWrappedInstance.bind(_this);

        __WEBPACK_IMPORTED_MODULE_1_invariant___default()(_this.store, 'Could not find "' + storeKey + '" in either the context or props of ' + ('"' + displayName + '". Either wrap the root component in a <Provider>, ') + ('or explicitly pass "' + storeKey + '" as a prop to "' + displayName + '".'));

        _this.initSelector();
        _this.initSubscription();
        return _this;
      }

      Connect.prototype.getChildContext = function getChildContext() {
        var _ref2;

        // If this component received store from props, its subscription should be transparent
        // to any descendants receiving store+subscription from context; it passes along
        // subscription passed to it. Otherwise, it shadows the parent subscription, which allows
        // Connect to control ordering of notifications to flow top-down.
        var subscription = this.propsMode ? null : this.subscription;
        return _ref2 = {}, _ref2[subscriptionKey] = subscription || this.context[subscriptionKey], _ref2;
      };

      Connect.prototype.componentDidMount = function componentDidMount() {
        if (!shouldHandleStateChanges) return;

        // componentWillMount fires during server side rendering, but componentDidMount and
        // componentWillUnmount do not. Because of this, trySubscribe happens during ...didMount.
        // Otherwise, unsubscription would never take place during SSR, causing a memory leak.
        // To handle the case where a child component may have triggered a state change by
        // dispatching an action in its componentWillMount, we have to re-run the select and maybe
        // re-render.
        this.subscription.trySubscribe();
        this.selector.run(this.props);
        if (this.selector.shouldComponentUpdate) this.forceUpdate();
      };

      Connect.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        this.selector.run(nextProps);
      };

      Connect.prototype.shouldComponentUpdate = function shouldComponentUpdate() {
        return this.selector.shouldComponentUpdate;
      };

      Connect.prototype.componentWillUnmount = function componentWillUnmount() {
        if (this.subscription) this.subscription.tryUnsubscribe();
        this.subscription = null;
        this.notifyNestedSubs = noop;
        this.store = null;
        this.selector.run = noop;
        this.selector.shouldComponentUpdate = false;
      };

      Connect.prototype.getWrappedInstance = function getWrappedInstance() {
        __WEBPACK_IMPORTED_MODULE_1_invariant___default()(withRef, 'To access the wrapped instance, you need to specify ' + ('{ withRef: true } in the options argument of the ' + methodName + '() call.'));
        return this.wrappedInstance;
      };

      Connect.prototype.setWrappedInstance = function setWrappedInstance(ref) {
        this.wrappedInstance = ref;
      };

      Connect.prototype.initSelector = function initSelector() {
        var sourceSelector = selectorFactory(this.store.dispatch, selectorFactoryOptions);
        this.selector = makeSelectorStateful(sourceSelector, this.store);
        this.selector.run(this.props);
      };

      Connect.prototype.initSubscription = function initSubscription() {
        if (!shouldHandleStateChanges) return;

        // parentSub's source should match where store came from: props vs. context. A component
        // connected to the store via props shouldn't use subscription from context, or vice versa.
        var parentSub = (this.propsMode ? this.props : this.context)[subscriptionKey];
        this.subscription = new __WEBPACK_IMPORTED_MODULE_3__utils_Subscription__["a" /* default */](this.store, parentSub, this.onStateChange.bind(this));

        // `notifyNestedSubs` is duplicated to handle the case where the component is  unmounted in
        // the middle of the notification loop, where `this.subscription` will then be null. An
        // extra null check every change can be avoided by copying the method onto `this` and then
        // replacing it with a no-op on unmount. This can probably be avoided if Subscription's
        // listeners logic is changed to not call listeners that have been unsubscribed in the
        // middle of the notification loop.
        this.notifyNestedSubs = this.subscription.notifyNestedSubs.bind(this.subscription);
      };

      Connect.prototype.onStateChange = function onStateChange() {
        this.selector.run(this.props);

        if (!this.selector.shouldComponentUpdate) {
          this.notifyNestedSubs();
        } else {
          this.componentDidUpdate = this.notifyNestedSubsOnComponentDidUpdate;
          this.setState(dummyState);
        }
      };

      Connect.prototype.notifyNestedSubsOnComponentDidUpdate = function notifyNestedSubsOnComponentDidUpdate() {
        // `componentDidUpdate` is conditionally implemented when `onStateChange` determines it
        // needs to notify nested subs. Once called, it unimplements itself until further state
        // changes occur. Doing it this way vs having a permanent `componentDidUpdate` that does
        // a boolean check every time avoids an extra method call most of the time, resulting
        // in some perf boost.
        this.componentDidUpdate = undefined;
        this.notifyNestedSubs();
      };

      Connect.prototype.isSubscribed = function isSubscribed() {
        return Boolean(this.subscription) && this.subscription.isSubscribed();
      };

      Connect.prototype.addExtraProps = function addExtraProps(props) {
        if (!withRef && !renderCountProp && !(this.propsMode && this.subscription)) return props;
        // make a shallow copy so that fields added don't leak to the original selector.
        // this is especially important for 'ref' since that's a reference back to the component
        // instance. a singleton memoized selector would then be holding a reference to the
        // instance, preventing the instance from being garbage collected, and that would be bad
        var withExtras = _extends({}, props);
        if (withRef) withExtras.ref = this.setWrappedInstance;
        if (renderCountProp) withExtras[renderCountProp] = this.renderCount++;
        if (this.propsMode && this.subscription) withExtras[subscriptionKey] = this.subscription;
        return withExtras;
      };

      Connect.prototype.render = function render() {
        var selector = this.selector;
        selector.shouldComponentUpdate = false;

        if (selector.error) {
          throw selector.error;
        } else {
          return Object(__WEBPACK_IMPORTED_MODULE_2_react__["createElement"])(WrappedComponent, this.addExtraProps(selector.props));
        }
      };

      return Connect;
    }(__WEBPACK_IMPORTED_MODULE_2_react__["Component"]);

    Connect.WrappedComponent = WrappedComponent;
    Connect.displayName = displayName;
    Connect.childContextTypes = childContextTypes;
    Connect.contextTypes = contextTypes;
    Connect.propTypes = contextTypes;

    if (false) {
      Connect.prototype.componentWillUpdate = function componentWillUpdate() {
        var _this2 = this;

        // We are hot reloading!
        if (this.version !== version) {
          this.version = version;
          this.initSelector();

          // If any connected descendants don't hot reload (and resubscribe in the process), their
          // listeners will be lost when we unsubscribe. Unfortunately, by copying over all
          // listeners, this does mean that the old versions of connected descendants will still be
          // notified of state changes; however, their onStateChange function is a no-op so this
          // isn't a huge deal.
          var oldListeners = [];

          if (this.subscription) {
            oldListeners = this.subscription.listeners.get();
            this.subscription.tryUnsubscribe();
          }
          this.initSubscription();
          if (shouldHandleStateChanges) {
            this.subscription.trySubscribe();
            oldListeners.forEach(function (listener) {
              return _this2.subscription.listeners.subscribe(listener);
            });
          }
        }
      };
    }

    return __WEBPACK_IMPORTED_MODULE_0_hoist_non_react_statics___default()(Connect, WrappedComponent);
  };
}

/***/ }),
/* 344 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = wrapMapToPropsConstant;
/* unused harmony export getDependsOnOwnProps */
/* harmony export (immutable) */ __webpack_exports__["b"] = wrapMapToPropsFunc;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_verifyPlainObject__ = __webpack_require__(345);


function wrapMapToPropsConstant(getConstant) {
  return function initConstantSelector(dispatch, options) {
    var constant = getConstant(dispatch, options);

    function constantSelector() {
      return constant;
    }
    constantSelector.dependsOnOwnProps = false;
    return constantSelector;
  };
}

// dependsOnOwnProps is used by createMapToPropsProxy to determine whether to pass props as args
// to the mapToProps function being wrapped. It is also used by makePurePropsSelector to determine
// whether mapToProps needs to be invoked when props have changed.
// 
// A length of one signals that mapToProps does not depend on props from the parent component.
// A length of zero is assumed to mean mapToProps is getting args via arguments or ...args and
// therefore not reporting its length accurately..
function getDependsOnOwnProps(mapToProps) {
  return mapToProps.dependsOnOwnProps !== null && mapToProps.dependsOnOwnProps !== undefined ? Boolean(mapToProps.dependsOnOwnProps) : mapToProps.length !== 1;
}

// Used by whenMapStateToPropsIsFunction and whenMapDispatchToPropsIsFunction,
// this function wraps mapToProps in a proxy function which does several things:
// 
//  * Detects whether the mapToProps function being called depends on props, which
//    is used by selectorFactory to decide if it should reinvoke on props changes.
//    
//  * On first call, handles mapToProps if returns another function, and treats that
//    new function as the true mapToProps for subsequent calls.
//    
//  * On first call, verifies the first result is a plain object, in order to warn
//    the developer that their mapToProps function is not returning a valid result.
//    
function wrapMapToPropsFunc(mapToProps, methodName) {
  return function initProxySelector(dispatch, _ref) {
    var displayName = _ref.displayName;

    var proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
      return proxy.dependsOnOwnProps ? proxy.mapToProps(stateOrDispatch, ownProps) : proxy.mapToProps(stateOrDispatch);
    };

    // allow detectFactoryAndVerify to get ownProps
    proxy.dependsOnOwnProps = true;

    proxy.mapToProps = function detectFactoryAndVerify(stateOrDispatch, ownProps) {
      proxy.mapToProps = mapToProps;
      proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps);
      var props = proxy(stateOrDispatch, ownProps);

      if (typeof props === 'function') {
        proxy.mapToProps = props;
        proxy.dependsOnOwnProps = getDependsOnOwnProps(props);
        props = proxy(stateOrDispatch, ownProps);
      }

      if (false) verifyPlainObject(props, displayName, methodName);

      return props;
    };

    return proxy;
  };
}

/***/ }),
/* 345 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_es_isPlainObject__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__warning__ = __webpack_require__(221);



function verifyPlainObject(value, displayName, methodName) {
  if (!Object(__WEBPACK_IMPORTED_MODULE_0_lodash_es_isPlainObject__["a" /* default */])(value)) {
    Object(__WEBPACK_IMPORTED_MODULE_1__warning__["a" /* default */])(methodName + '() in ' + displayName + ' must return a plain object. Instead received ' + value + '.');
  }
}

/***/ }),
/* 346 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.firstToUpperCase = firstToUpperCase;
exports.stripHTML = stripHTML;
/**
 * Capitalize the first letter of a string.
 *
 * @param   {string} string The string to capitalize.
 *
 * @returns {string}        The string with the first letter capitalized.
 */
function firstToUpperCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Strips HTML from a string.
 *
 * @param {string} string  The string to strip HTML from.
 *
 * @returns {string} The string with HTML stripped.
 */
function stripHTML(string) {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = string;
  return tmp.textContent || tmp.innerText || "";
}

/***/ }),
/* 347 */,
/* 348 */,
/* 349 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var PREFIX = "WPSEO_";

var TOGGLE_CORNERSTONE_CONTENT = exports.TOGGLE_CORNERSTONE_CONTENT = PREFIX + "TOGGLE_CORNERSTONE_CONTENT";
var SET_CORNERSTONE_CONTENT = exports.SET_CORNERSTONE_CONTENT = PREFIX + "SET_CORNERSTONE_CONTENT";

/**
 * An action creator for setting the cornerstone content toggle.
 *
 * @param {boolean} isCornerstone Whether or not the article is a cornerstone article.
 *
 * @returns {Object} The set cornerstone content action.
 */
var setCornerstoneContent = exports.setCornerstoneContent = function setCornerstoneContent(isCornerstone) {
  return {
    type: SET_CORNERSTONE_CONTENT,
    isCornerstone: isCornerstone
  };
};

/**
 * An action creator for toggling whether the current item is cornerstone content or not.
 *
 * @returns {Object} The toggle cornerstone content action.
 */
var toggleCornerstoneContent = exports.toggleCornerstoneContent = function toggleCornerstoneContent() {
  return {
    type: TOGGLE_CORNERSTONE_CONTENT
  };
};

/***/ }),
/* 350 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var SET_MARKER_STATUS = exports.SET_MARKER_STATUS = "WPSEO_SET_MARKER_STATUS";

/**
 * An action creator for setting the marks button status.
 *
 * @param {string} marksButtonStatus The marksButtonStatus.
 *
 * @returns {Object} The setting marks button state action.
 */
var setMarkerStatus = exports.setMarkerStatus = function setMarkerStatus(marksButtonStatus) {
  return {
    type: SET_MARKER_STATUS,
    marksButtonStatus: marksButtonStatus
  };
};

/***/ }),
/* 351 */
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
/* 352 */,
/* 353 */,
/* 354 */,
/* 355 */,
/* 356 */,
/* 357 */,
/* 358 */,
/* 359 */,
/* 360 */,
/* 361 */,
/* 362 */,
/* 363 */,
/* 364 */,
/* 365 */,
/* 366 */,
/* 367 */,
/* 368 */,
/* 369 */,
/* 370 */,
/* 371 */,
/* 372 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 373 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(90);
var toLength = __webpack_require__(269);
var toAbsoluteIndex = __webpack_require__(374);
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
/* 374 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(164);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 375 */,
/* 376 */,
/* 377 */,
/* 378 */,
/* 379 */,
/* 380 */,
/* 381 */,
/* 382 */
/***/ (function(module, exports, __webpack_require__) {

var identity = __webpack_require__(66);

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


/***/ }),
/* 383 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Symbol_js__ = __webpack_require__(224);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__getRawTag_js__ = __webpack_require__(386);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__objectToString_js__ = __webpack_require__(387);




/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */] ? __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */].toStringTag : undefined;

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
    ? Object(__WEBPACK_IMPORTED_MODULE_1__getRawTag_js__["a" /* default */])(value)
    : Object(__WEBPACK_IMPORTED_MODULE_2__objectToString_js__["a" /* default */])(value);
}

/* harmony default export */ __webpack_exports__["a"] = (baseGetTag);


/***/ }),
/* 384 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__freeGlobal_js__ = __webpack_require__(385);


/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = __WEBPACK_IMPORTED_MODULE_0__freeGlobal_js__["a" /* default */] || freeSelf || Function('return this')();

/* harmony default export */ __webpack_exports__["a"] = (root);


/***/ }),
/* 385 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/* harmony default export */ __webpack_exports__["a"] = (freeGlobal);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(11)))

/***/ }),
/* 386 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Symbol_js__ = __webpack_require__(224);


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
var symToStringTag = __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */] ? __WEBPACK_IMPORTED_MODULE_0__Symbol_js__["a" /* default */].toStringTag : undefined;

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

/* harmony default export */ __webpack_exports__["a"] = (getRawTag);


/***/ }),
/* 387 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/* harmony default export */ __webpack_exports__["a"] = (objectToString);


/***/ }),
/* 388 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__overArg_js__ = __webpack_require__(389);


/** Built-in value references. */
var getPrototype = Object(__WEBPACK_IMPORTED_MODULE_0__overArg_js__["a" /* default */])(Object.getPrototypeOf, Object);

/* harmony default export */ __webpack_exports__["a"] = (getPrototype);


/***/ }),
/* 389 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/* harmony default export */ __webpack_exports__["a"] = (overArg);


/***/ }),
/* 390 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/* harmony default export */ __webpack_exports__["a"] = (isObjectLike);


/***/ }),
/* 391 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(392);


/***/ }),
/* 392 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, module) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ponyfill = __webpack_require__(393);

var _ponyfill2 = _interopRequireDefault(_ponyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var root; /* global window */


if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (true) {
  root = module;
} else {
  root = Function('return this')();
}

var result = (0, _ponyfill2['default'])(root);
exports['default'] = result;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11), __webpack_require__(29)(module)))

/***/ }),
/* 393 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports['default'] = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
	var result;
	var _Symbol = root.Symbol;

	if (typeof _Symbol === 'function') {
		if (_Symbol.observable) {
			result = _Symbol.observable;
		} else {
			result = _Symbol('observable');
			_Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};

/***/ }),
/* 394 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = combineReducers;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__createStore__ = __webpack_require__(223);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_es_isPlainObject__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_warning__ = __webpack_require__(225);




function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state. ' + 'If you want this reducer to hold no value, you can return null instead of undefined.';
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === __WEBPACK_IMPORTED_MODULE_0__createStore__["a" /* ActionTypes */].INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!Object(__WEBPACK_IMPORTED_MODULE_1_lodash_es_isPlainObject__["a" /* default */])(inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });

  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });

  if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: __WEBPACK_IMPORTED_MODULE_0__createStore__["a" /* ActionTypes */].INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined. If you don\'t want to set a value for this reducer, ' + 'you can use null instead of undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + __WEBPACK_IMPORTED_MODULE_0__createStore__["a" /* ActionTypes */].INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined, but can be null.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (false) {
      if (typeof reducers[key] === 'undefined') {
        warning('No reducer provided for key "' + key + '"');
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);

  var unexpectedKeyCache = void 0;
  if (false) {
    unexpectedKeyCache = {};
  }

  var shapeAssertionError = void 0;
  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    if (false) {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
      if (warningMessage) {
        warning(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};
    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }
      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}

/***/ }),
/* 395 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = bindActionCreators;
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}

/***/ }),
/* 396 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = applyMiddleware;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__compose__ = __webpack_require__(226);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function (reducer, preloadedState, enhancer) {
      var store = createStore(reducer, preloadedState, enhancer);
      var _dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = __WEBPACK_IMPORTED_MODULE_0__compose__["a" /* default */].apply(undefined, chain)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

/***/ }),
/* 397 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(12),
    isArray = __webpack_require__(3),
    isObjectLike = __webpack_require__(10);

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


/***/ }),
/* 398 */,
/* 399 */
/***/ (function(module, exports, __webpack_require__) {

var baseValues = __webpack_require__(400),
    keys = __webpack_require__(33);

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


/***/ }),
/* 400 */
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(44);

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


/***/ }),
/* 401 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(45),
    keys = __webpack_require__(33);

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;


/***/ }),
/* 402 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(45),
    keysIn = __webpack_require__(94);

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn(source), object);
}

module.exports = baseAssignIn;


/***/ }),
/* 403 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(45),
    getSymbols = __webpack_require__(105);

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;


/***/ }),
/* 404 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(45),
    getSymbolsIn = __webpack_require__(234);

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

module.exports = copySymbolsIn;


/***/ }),
/* 405 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;


/***/ }),
/* 406 */
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(142),
    cloneDataView = __webpack_require__(407),
    cloneMap = __webpack_require__(408),
    cloneRegExp = __webpack_require__(410),
    cloneSet = __webpack_require__(411),
    cloneSymbol = __webpack_require__(413),
    cloneTypedArray = __webpack_require__(310);

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

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

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;


/***/ }),
/* 407 */
/***/ (function(module, exports, __webpack_require__) {

var cloneArrayBuffer = __webpack_require__(142);

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;


/***/ }),
/* 408 */
/***/ (function(module, exports, __webpack_require__) {

var addMapEntry = __webpack_require__(409),
    arrayReduce = __webpack_require__(177),
    mapToArray = __webpack_require__(171);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1;

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), CLONE_DEEP_FLAG) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

module.exports = cloneMap;


/***/ }),
/* 409 */
/***/ (function(module, exports) {

/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `map.set` because it's not chainable in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

module.exports = addMapEntry;


/***/ }),
/* 410 */
/***/ (function(module, exports) {

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;


/***/ }),
/* 411 */
/***/ (function(module, exports, __webpack_require__) {

var addSetEntry = __webpack_require__(412),
    arrayReduce = __webpack_require__(177),
    setToArray = __webpack_require__(172);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1;

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), CLONE_DEEP_FLAG) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

module.exports = cloneSet;


/***/ }),
/* 412 */
/***/ (function(module, exports) {

/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set;
}

module.exports = addSetEntry;


/***/ }),
/* 413 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(13);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;


/***/ }),
/* 414 */
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(32),
    last = __webpack_require__(415),
    parent = __webpack_require__(416),
    toKey = __webpack_require__(24);

/**
 * The base implementation of `_.unset`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The property path to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 */
function baseUnset(object, path) {
  path = castPath(path, object);
  object = parent(object, path);
  return object == null || delete object[toKey(last(path))];
}

module.exports = baseUnset;


/***/ }),
/* 415 */
/***/ (function(module, exports) {

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

module.exports = last;


/***/ }),
/* 416 */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(53),
    baseSlice = __webpack_require__(255);

/**
 * Gets the parent value at `path` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path to get the parent value of.
 * @returns {*} Returns the parent value.
 */
function parent(object, path) {
  return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
}

module.exports = parent;


/***/ }),
/* 417 */
/***/ (function(module, exports, __webpack_require__) {

var isPlainObject = __webpack_require__(312);

/**
 * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
 * objects.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {string} key The key of the property to inspect.
 * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
 */
function customOmitClone(value) {
  return isPlainObject(value) ? undefined : value;
}

module.exports = customOmitClone;


/***/ }),
/* 418 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(13),
    isArguments = __webpack_require__(64),
    isArray = __webpack_require__(3);

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


/***/ }),
/* 419 */,
/* 420 */,
/* 421 */,
/* 422 */
/***/ (function(module, exports) {

module.exports = window.yoast._wp.data;

/***/ }),
/* 423 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getL10nObject = __webpack_require__(180);

var isUndefined = __webpack_require__(15);

/**
 * Returns whether or not the content analysis is active
 *
 * @returns {boolean} Whether or not the content analysis is active.
 */
function isContentAnalysisActive() {
  var l10nObject = getL10nObject();

  return !isUndefined(l10nObject) && l10nObject.contentAnalysisActive === "1";
}

module.exports = isContentAnalysisActive;

/***/ }),
/* 424 */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(27),
    isArrayLike = __webpack_require__(30),
    isIndex = __webpack_require__(85),
    isObject = __webpack_require__(7);

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;


/***/ }),
/* 425 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _yoastseo = __webpack_require__(70);

var _yoastseo2 = _interopRequireDefault(_yoastseo);

var _forEach2 = __webpack_require__(98);

var _forEach3 = _interopRequireDefault(_forEach2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var removeMarks = _yoastseo2.default.markers.removeMarks;


var MARK_TAG = "yoastmark";

/**
 * Cleans the editor of any invalid marks. Invalid marks are marks where < and > are converted to
 * html entities by tinyMCE so these can be filtered out to keep the output text clean.
 *
 * @param {tinyMCE.Editor} editor The editor to remove invalid marks from.
 *
 * @returns {void}
 */
function removeInvalidMarks(editor) {
	var html = editor.getContent();

	html = html.replace(new RegExp("&lt;yoastmark.+?&gt;", "g"), "").replace(new RegExp("&lt;/yoastmark&gt;", "g"), "");

	editor.setContent(html);
}

/**
 * Puts a list of marks into the given tinyMCE editor
 *
 * @param {tinyMCE.Editor} editor The editor to apply the marks to.
 * @param {Paper} paper The paper for which the marks have been generated.
 * @param {Array.<Mark>} marks The marks to show in the editor.
 *
 * @returns {void}
 */
function markTinyMCE(editor, paper, marks) {
	var dom = editor.dom;
	var html = editor.getContent();
	html = removeMarks(html);

	// Generate marked HTML.
	(0, _forEach3.default)(marks, function (mark) {
		html = mark.applyWithReplace(html);
	});

	// Replace the contents in the editor with the marked HTML.
	editor.setContent(html);

	removeInvalidMarks(editor);

	var markElements = dom.select(MARK_TAG);
	/*
  * The `mce-bogus` data is an internal tinyMCE indicator that the elements themselves shouldn't be saved.
  * Add data-mce-bogus after the elements have been inserted because setContent strips elements with data-mce-bogus.
  */
	(0, _forEach3.default)(markElements, function (markElement) {
		markElement.setAttribute("data-mce-bogus", "1");
	});
}

/**
 * Returns a function that can decorate a tinyMCE editor
 *
 * @param {tinyMCE.Editor} editor The editor to return a function for.
 * @returns {Function} The function that can be called to decorate the editor.
 */
function tinyMCEDecorator(editor) {
	window.test = editor;

	return markTinyMCE.bind(null, editor);
}

/**
 * Returns whether or not the editor has marks
 *
 * @param {tinyMCE.Editor} editor The editor.
 * @returns {boolean} Whether or not there are marks inside the editor.
 */
function editorHasMarks(editor) {
	var content = editor.getContent({ format: "raw" });

	return -1 !== content.indexOf("<" + MARK_TAG);
}

/**
 * Removes marks currently in the given editor
 *
 * @param {tinyMCE.Editor} editor The editor to remove all marks for.
 *
 * @returns {void}
 */
function editorRemoveMarks(editor) {
	// Create a decorator with the given editor.
	var decorator = tinyMCEDecorator(editor);

	// Calling the decorator with an empty array of marks will clear the editor of marks.
	decorator(null, []);
}

module.exports = {
	tinyMCEDecorator: tinyMCEDecorator,

	editorHasMarks: editorHasMarks,
	editorRemoveMarks: editorRemoveMarks
};

/***/ }),
/* 426 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getIconForScore = getIconForScore;
exports.default = mapResults;

var _yoastseo = __webpack_require__(70);

var _yoastseo2 = _interopRequireDefault(_yoastseo);

var _yoastComponents = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scoreToRating = _yoastseo2.default.helpers.scoreToRating;

/**
 * Mapped result definition.
 * @typedef {Object} MappedResult
 * @property {string} rating
 * @property {bool} hasMarks
 * @property {string} text
 * @property {string} id
 * @property {func} marker
 * @property {number} score
 */

/**
 * Mapped results definition.
 * @typedef {Object} MappedResults
 * @property {Array<MappedResult>} errorsResults
 * @property {Array<MappedResult>} problemsResults
 * @property {Array<MappedResult>} improvementsResults
 * @property {Array<MappedResult>} goodResults
 * @property {Array<MappedResult>} considerationsResults
 */

/**
 * Maps a single results to a result that can be interpreted by yoast-component's ContentAnalysis.
 *
 * @param {object} result Result provided by YoastSEO.js.
 *
 * @returns {MappedResult} The mapped result.
 */

function mapResult(result) {
	var mappedResult = {
		score: result.score,
		rating: scoreToRating(result.score),
		hasMarks: result.hasMarks(),
		marker: result.getMarker(),
		id: result.getIdentifier(),
		text: result.text
	};

	// Because of inconsistency between YoastSEO and yoast-components.
	if (mappedResult.rating === "ok") {
		mappedResult.rating = "OK";
	}

	return mappedResult;
}

/**
 * Adds a mapped results to the appropriate array in the mapped results object.
 *
 * @param {MappedResult} mappedResult The mapped result.
 * @param {MappedResults} mappedResults The mapped results.
 *
 * @returns {MappedResults} The mapped results object with the added result.
 */
function processResult(mappedResult, mappedResults) {
	switch (mappedResult.rating) {
		case "error":
			mappedResults.errorsResults.push(mappedResult);
			break;
		case "feedback":
			mappedResults.considerationsResults.push(mappedResult);
			break;
		case "bad":
			mappedResults.problemsResults.push(mappedResult);
			break;
		case "OK":
			mappedResults.improvementsResults.push(mappedResult);
			break;
		case "good":
			mappedResults.goodResults.push(mappedResult);
			break;
	}
	return mappedResults;
}

/**
 * Retrieves the icons and colors for the icon for a certain result.
 *
 * @param {string} score The score for which to return the icon and color.
 *
 * @returns {Object} The icon and color for the score.
 */
function getIconForScore(score) {
	var icon = { icon: "seo-score-none", color: _yoastComponents.colors.$color_grey_disabled };

	switch (score) {
		case "loading":
			icon = { icon: "loading-spinner", color: _yoastComponents.colors.$color_green_medium_light };
			break;
		case "good":
			icon = { icon: "seo-score-good", color: _yoastComponents.colors.$color_green_medium };
			break;
		case "ok":
			icon = { icon: "seo-score-ok", color: _yoastComponents.colors.$color_ok };
			break;
		case "bad":
			icon = { icon: "seo-score-bad", color: _yoastComponents.colors.$color_red };
			break;
	}

	return icon;
}

/**
 * Maps results to object, to be used by the ContentAnalysis component.
 *
 * Takes in the YoastSEO.js results and maps them to the appropriate objects, so they can be used by the
 * ContentAnalysis component from yoast-components.
 *
 * @param {object} results Results provided by YoastSEO.js.
 *
 * @returns {MappedResults} The mapped results.
 */
function mapResults(results) {
	var mappedResults = {
		errorsResults: [],
		problemsResults: [],
		improvementsResults: [],
		goodResults: [],
		considerationsResults: []
	};
	if (!results) {
		return mappedResults;
	}
	for (var i = 0; i < results.length; i++) {
		var result = results[i];
		if (!result.text) {
			continue;
		}
		var mappedResult = mapResult(result);
		mappedResults = processResult(mappedResult, mappedResults);
	}
	return mappedResults;
}

/***/ }),
/* 427 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(4);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__(5);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _omit2 = __webpack_require__(199);

var _omit3 = _interopRequireDefault(_omit2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns the Icon component.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Icon component.
 */
var Icon = function Icon(props) {
	var IconComponent = (0, _styledComponents2.default)(props.icon).withConfig({
		displayName: "Icon__IconComponent"
	})(["width:", ";height:", ";", " flex:0 0 auto;"], props.width, props.height, props.color ? "fill: " + props.color + ";" : "");

	// Remove the props that are no longer needed.
	var newProps = (0, _omit3.default)(props, ["icon", "width", "height", "color"]);

	return _react2.default.createElement(IconComponent, _extends({ role: "img", "aria-hidden": "true", focusable: "false" }, newProps));
};

Icon.propTypes = {
	icon: _propTypes2.default.func.isRequired,
	width: _propTypes2.default.string,
	height: _propTypes2.default.string,
	color: _propTypes2.default.string
};

Icon.defaultProps = {
	width: "16px",
	height: "16px"
};

exports.default = Icon;

/***/ }),
/* 428 */
/***/ (function(module, exports, __webpack_require__) {

var baseMerge = __webpack_require__(833),
    createAssigner = __webpack_require__(322);

/**
 * This method is like `_.assign` except that it recursively merges own and
 * inherited enumerable string keyed properties of source objects into the
 * destination object. Source properties that resolve to `undefined` are
 * skipped if a destination value exists. Array and plain object properties
 * are merged recursively. Other objects and value types are overridden by
 * assignment. Source objects are applied from left to right. Subsequent
 * sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {
 *   'a': [{ 'b': 2 }, { 'd': 4 }]
 * };
 *
 * var other = {
 *   'a': [{ 'c': 3 }, { 'e': 5 }]
 * };
 *
 * _.merge(object, other);
 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
 */
var merge = createAssigner(function(object, source, srcIndex) {
  baseMerge(object, source, srcIndex);
});

module.exports = merge;


/***/ }),
/* 429 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setSeoResultsForKeyword = setSeoResultsForKeyword;
exports.setSeoResults = setSeoResults;
exports.updateSeoResult = updateSeoResult;
exports.removeKeyword = removeKeyword;
exports.setReadabilityResults = setReadabilityResults;
exports.updateReadabilityResult = updateReadabilityResult;
exports.setOverallReadabilityScore = setOverallReadabilityScore;
exports.setOverallSeoScore = setOverallSeoScore;
/*
 * Action types
 */
var prefix = "CONTENT_ANALYSIS_";

var SET_SEO_RESULTS = exports.SET_SEO_RESULTS = prefix + "SET_SEO_RESULTS";
var SET_SEO_RESULTS_FOR_KEYWORD = exports.SET_SEO_RESULTS_FOR_KEYWORD = prefix + "SET_SEO_RESULTS_FOR_KEYWORD";
var UPDATE_SEO_RESULT = exports.UPDATE_SEO_RESULT = prefix + "UPDATE_SEO_RESULT";
var REMOVE_KEYWORD = exports.REMOVE_KEYWORD = prefix + "REMOVE_KEYWORD";

var SET_READABILITY_RESULTS = exports.SET_READABILITY_RESULTS = prefix + "SET_READABILITY_RESULTS";
var UPDATE_READABILITY_RESULT = exports.UPDATE_READABILITY_RESULT = prefix + "UPDATE_READABILITY_RESULT";

var SET_OVERALL_READABILITY_SCORE = exports.SET_OVERALL_READABILITY_SCORE = prefix + "SET_OVERALL_READABILITY_SCORE";
var SET_OVERALL_SEO_SCORE = exports.SET_OVERALL_SEO_SCORE = prefix + "SET_OVERALL_SEO_SCORE";

/*
 * Action creators
 */

/**
 * An action creator for setting the SEO results for a keyword.
 *
 * @param {string} keyword The keyword.
 * @param {Array} results The SEO results for the keyword.
 *
 * @returns {Object} A set SEO results for keyword action.
 */
function setSeoResultsForKeyword(keyword, results) {
  return {
    type: SET_SEO_RESULTS_FOR_KEYWORD,
    keyword: keyword,
    results: results
  };
}

/**
 * An action creator for setting the SEO results.
 *
 * @param {Array} resultsPerKeyword The SEO results per keyword.
 *
 * @returns {Object} A set SEO results action.
 */
function setSeoResults(resultsPerKeyword) {
  return {
    type: SET_SEO_RESULTS,
    resultsPerKeyword: resultsPerKeyword
  };
}

/**
 * An action creator for updating a single SEO result.
 *
 * @param {string} keyword The focus keyword.
 * @param {Object} result The SEO result.
 *
 * @returns {Object} An update SEO result action.
 */
function updateSeoResult(keyword, result) {
  return {
    type: UPDATE_SEO_RESULT,
    keyword: keyword,
    result: result
  };
}

/**
 * An action creator for removing a keyword and its results.
 *
 * @param {string} keyword The focus keyword.
 *
 * @returns {Object} A remove keyword action.
 */
function removeKeyword(keyword) {
  return {
    type: REMOVE_KEYWORD,
    keyword: keyword
  };
}

/**
 * An action creator for setting the readability results.
 *
 * @param {Object} results The readability results.
 *
 * @returns {Object} A set readability results action.
 */
function setReadabilityResults(results) {
  return {
    type: SET_READABILITY_RESULTS,
    results: results
  };
}

/**
 * An action creator for updating a single readability result.
 *
 * @param {Object} result The readability result.
 *
 * @returns {Object} An update readability result action.
 */
function updateReadabilityResult(result) {
  return {
    type: UPDATE_READABILITY_RESULT,
    result: result
  };
}

/**
 * An action creator for setting the overall score for a readability result.
 *
 * @param {Object} overallScore The overall score.
 *
 * @returns {Object} A set overall score action.
 */
function setOverallReadabilityScore(overallScore) {
  return {
    type: SET_OVERALL_READABILITY_SCORE,
    overallScore: overallScore
  };
}

/**
* An action creator for setting the overall score result.
*
* @param {Object} overallScore The overall score.
* @param {Object} keyword The keyword the overall score is for.
*
* @returns {Object} A set overall score action.
*/
function setOverallSeoScore(overallScore, keyword) {
  return {
    type: SET_OVERALL_SEO_SCORE,
    keyword: keyword,
    overallScore: overallScore
  };
}

/***/ }),
/* 430 */
/***/ (function(module, exports, __webpack_require__) {

var baseKeys = __webpack_require__(168),
    getTag = __webpack_require__(106),
    isArguments = __webpack_require__(64),
    isArray = __webpack_require__(3),
    isArrayLike = __webpack_require__(30),
    isBuffer = __webpack_require__(65),
    isPrototype = __webpack_require__(69),
    isTypedArray = __webpack_require__(86);

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


/***/ }),
/* 431 */,
/* 432 */,
/* 433 */,
/* 434 */,
/* 435 */,
/* 436 */,
/* 437 */,
/* 438 */,
/* 439 */,
/* 440 */,
/* 441 */,
/* 442 */,
/* 443 */,
/* 444 */,
/* 445 */,
/* 446 */,
/* 447 */,
/* 448 */,
/* 449 */,
/* 450 */,
/* 451 */,
/* 452 */,
/* 453 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = getDefaultReplacementVariables;

var _i18n = __webpack_require__(8);

/**
 * Returns the default replacement variables.
 *
 * This const was created to populate the redux store with the default replace
 * variables, while keeping the reducer clean.
 *
 * @returns {Object[]} The default replacement variables.
 */
function getDefaultReplacementVariables() {
	return [{
		name: "date",
		label: (0, _i18n.__)("Date", "wordpress-seo"),
		value: ""
	}, {
		name: "id",
		label: (0, _i18n.__)("ID", "wordpress-seo"),
		value: ""
	}, {
		name: "page",
		label: (0, _i18n.__)("Page", "wordpress-seo"),
		value: ""
	}, {
		name: "searchphrase",
		label: (0, _i18n.__)("Search phrase", "wordpress-seo"),
		value: ""
	}, {
		name: "sitedesc",
		label: (0, _i18n.__)("Tagline", "wordpress-seo"),
		value: ""
	}, {
		name: "sitename",
		label: (0, _i18n.__)("Site title", "wordpress-seo"),
		value: ""
	}, {
		name: "category",
		label: (0, _i18n.__)("Category", "wordpress-seo"),
		value: ""
	}, {
		name: "focuskw",
		label: (0, _i18n.__)("Focus keyword", "wordpress-seo"),
		value: ""
	}, {
		name: "title",
		label: (0, _i18n.__)("Title", "wordpress-seo"),
		value: ""
	}, {
		name: "parent_title",
		label: (0, _i18n.__)("Parent title", "wordpress-seo"),
		value: ""
	}, {
		name: "excerpt",
		label: (0, _i18n.__)("Excerpt", "wordpress-seo"),
		value: ""
	}, {
		name: "primary_category",
		label: (0, _i18n.__)("Primary category", "wordpress-seo"),
		value: ""
	}, {
		name: "sep",
		label: (0, _i18n.__)("Separator", "wordpress-seo"),
		value: ""
	}, {
		name: "excerpt_only",
		label: (0, _i18n.__)("Excerpt only", "wordpress-seo"),
		value: ""
	}, {
		name: "category_description",
		label: (0, _i18n.__)("Category description", "wordpress-seo"),
		value: ""
	}, {
		name: "tag_description",
		label: (0, _i18n.__)("Tag description", "wordpress-seo"),
		value: ""
	}, {
		name: "term_description",
		label: (0, _i18n.__)("Term description", "wordpress-seo"),
		value: ""
	}, {
		name: "currentyear",
		label: (0, _i18n.__)("Current year", "wordpress-seo"),
		value: ""
	}];
}

/***/ }),
/* 454 */,
/* 455 */,
/* 456 */,
/* 457 */,
/* 458 */,
/* 459 */,
/* 460 */,
/* 461 */,
/* 462 */,
/* 463 */,
/* 464 */,
/* 465 */,
/* 466 */,
/* 467 */,
/* 468 */,
/* 469 */,
/* 470 */,
/* 471 */,
/* 472 */,
/* 473 */,
/* 474 */,
/* 475 */,
/* 476 */,
/* 477 */,
/* 478 */,
/* 479 */,
/* 480 */,
/* 481 */,
/* 482 */,
/* 483 */,
/* 484 */,
/* 485 */,
/* 486 */,
/* 487 */,
/* 488 */,
/* 489 */,
/* 490 */,
/* 491 */,
/* 492 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = createProvider;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_PropTypes__ = __webpack_require__(342);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_warning__ = __webpack_require__(221);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






var didWarnAboutReceivingStore = false;
function warnAboutReceivingStore() {
  if (didWarnAboutReceivingStore) {
    return;
  }
  didWarnAboutReceivingStore = true;

  Object(__WEBPACK_IMPORTED_MODULE_3__utils_warning__["a" /* default */])('<Provider> does not support changing `store` on the fly. ' + 'It is most likely that you see this error because you updated to ' + 'Redux 2.x and React Redux 2.x which no longer hot reload reducers ' + 'automatically. See https://github.com/reactjs/react-redux/releases/' + 'tag/v2.0.0 for the migration instructions.');
}

function createProvider() {
  var _Provider$childContex;

  var storeKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'store';
  var subKey = arguments[1];

  var subscriptionKey = subKey || storeKey + 'Subscription';

  var Provider = function (_Component) {
    _inherits(Provider, _Component);

    Provider.prototype.getChildContext = function getChildContext() {
      var _ref;

      return _ref = {}, _ref[storeKey] = this[storeKey], _ref[subscriptionKey] = null, _ref;
    };

    function Provider(props, context) {
      _classCallCheck(this, Provider);

      var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

      _this[storeKey] = props.store;
      return _this;
    }

    Provider.prototype.render = function render() {
      return __WEBPACK_IMPORTED_MODULE_0_react__["Children"].only(this.props.children);
    };

    return Provider;
  }(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

  if (false) {
    Provider.prototype.componentWillReceiveProps = function (nextProps) {
      if (this[storeKey] !== nextProps.store) {
        warnAboutReceivingStore();
      }
    };
  }

  Provider.propTypes = {
    store: __WEBPACK_IMPORTED_MODULE_2__utils_PropTypes__["a" /* storeShape */].isRequired,
    children: __WEBPACK_IMPORTED_MODULE_1_prop_types___default.a.element.isRequired
  };
  Provider.childContextTypes = (_Provider$childContex = {}, _Provider$childContex[storeKey] = __WEBPACK_IMPORTED_MODULE_2__utils_PropTypes__["a" /* storeShape */].isRequired, _Provider$childContex[subscriptionKey] = __WEBPACK_IMPORTED_MODULE_2__utils_PropTypes__["b" /* subscriptionShape */], _Provider$childContex);

  return Provider;
}

/* harmony default export */ __webpack_exports__["b"] = (createProvider());

/***/ }),
/* 493 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */


var REACT_STATICS = {
    childContextTypes: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    mixins: true,
    propTypes: true,
    type: true
};

var KNOWN_STATICS = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  callee: true,
  arguments: true,
  arity: true
};

var defineProperty = Object.defineProperty;
var getOwnPropertyNames = Object.getOwnPropertyNames;
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = getPrototypeOf && getPrototypeOf(Object);

module.exports = function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
    if (typeof sourceComponent !== 'string') { // don't hoist over string (html) components

        if (objectPrototype) {
            var inheritedComponent = getPrototypeOf(sourceComponent);
            if (inheritedComponent && inheritedComponent !== objectPrototype) {
                hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
            }
        }

        var keys = getOwnPropertyNames(sourceComponent);

        if (getOwnPropertySymbols) {
            keys = keys.concat(getOwnPropertySymbols(sourceComponent));
        }

        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (!REACT_STATICS[key] && !KNOWN_STATICS[key] && (!blacklist || !blacklist[key])) {
                var descriptor = getOwnPropertyDescriptor(sourceComponent, key);
                try { // Avoid failures from read-only properties
                    defineProperty(targetComponent, key, descriptor);
                } catch (e) {}
            }
        }

        return targetComponent;
    }

    return targetComponent;
};


/***/ }),
/* 494 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Subscription; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// encapsulates the subscription logic for connecting a component to the redux store, as
// well as nesting subscriptions of descendant components, so that we can ensure the
// ancestor components re-render before descendants

var CLEARED = null;
var nullListeners = {
  notify: function notify() {}
};

function createListenerCollection() {
  // the current/next pattern is copied from redux's createStore code.
  // TODO: refactor+expose that code to be reusable here?
  var current = [];
  var next = [];

  return {
    clear: function clear() {
      next = CLEARED;
      current = CLEARED;
    },
    notify: function notify() {
      var listeners = current = next;
      for (var i = 0; i < listeners.length; i++) {
        listeners[i]();
      }
    },
    get: function get() {
      return next;
    },
    subscribe: function subscribe(listener) {
      var isSubscribed = true;
      if (next === current) next = current.slice();
      next.push(listener);

      return function unsubscribe() {
        if (!isSubscribed || current === CLEARED) return;
        isSubscribed = false;

        if (next === current) next = current.slice();
        next.splice(next.indexOf(listener), 1);
      };
    }
  };
}

var Subscription = function () {
  function Subscription(store, parentSub, onStateChange) {
    _classCallCheck(this, Subscription);

    this.store = store;
    this.parentSub = parentSub;
    this.onStateChange = onStateChange;
    this.unsubscribe = null;
    this.listeners = nullListeners;
  }

  Subscription.prototype.addNestedSub = function addNestedSub(listener) {
    this.trySubscribe();
    return this.listeners.subscribe(listener);
  };

  Subscription.prototype.notifyNestedSubs = function notifyNestedSubs() {
    this.listeners.notify();
  };

  Subscription.prototype.isSubscribed = function isSubscribed() {
    return Boolean(this.unsubscribe);
  };

  Subscription.prototype.trySubscribe = function trySubscribe() {
    if (!this.unsubscribe) {
      this.unsubscribe = this.parentSub ? this.parentSub.addNestedSub(this.onStateChange) : this.store.subscribe(this.onStateChange);

      this.listeners = createListenerCollection();
    }
  };

  Subscription.prototype.tryUnsubscribe = function tryUnsubscribe() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
      this.listeners.clear();
      this.listeners = nullListeners;
    }
  };

  return Subscription;
}();



/***/ }),
/* 495 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export createConnect */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_connectAdvanced__ = __webpack_require__(343);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils_shallowEqual__ = __webpack_require__(496);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mapDispatchToProps__ = __webpack_require__(497);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__mapStateToProps__ = __webpack_require__(498);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__mergeProps__ = __webpack_require__(499);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__selectorFactory__ = __webpack_require__(500);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }








/*
  connect is a facade over connectAdvanced. It turns its args into a compatible
  selectorFactory, which has the signature:

    (dispatch, options) => (nextState, nextOwnProps) => nextFinalProps
  
  connect passes its args to connectAdvanced as options, which will in turn pass them to
  selectorFactory each time a Connect component instance is instantiated or hot reloaded.

  selectorFactory returns a final props selector from its mapStateToProps,
  mapStateToPropsFactories, mapDispatchToProps, mapDispatchToPropsFactories, mergeProps,
  mergePropsFactories, and pure args.

  The resulting final props selector is called by the Connect component instance whenever
  it receives new props or store state.
 */

function match(arg, factories, name) {
  for (var i = factories.length - 1; i >= 0; i--) {
    var result = factories[i](arg);
    if (result) return result;
  }

  return function (dispatch, options) {
    throw new Error('Invalid value of type ' + typeof arg + ' for ' + name + ' argument when connecting component ' + options.wrappedComponentName + '.');
  };
}

function strictEqual(a, b) {
  return a === b;
}

// createConnect with default args builds the 'official' connect behavior. Calling it with
// different options opens up some testing and extensibility scenarios
function createConnect() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$connectHOC = _ref.connectHOC,
      connectHOC = _ref$connectHOC === undefined ? __WEBPACK_IMPORTED_MODULE_0__components_connectAdvanced__["a" /* default */] : _ref$connectHOC,
      _ref$mapStateToPropsF = _ref.mapStateToPropsFactories,
      mapStateToPropsFactories = _ref$mapStateToPropsF === undefined ? __WEBPACK_IMPORTED_MODULE_3__mapStateToProps__["a" /* default */] : _ref$mapStateToPropsF,
      _ref$mapDispatchToPro = _ref.mapDispatchToPropsFactories,
      mapDispatchToPropsFactories = _ref$mapDispatchToPro === undefined ? __WEBPACK_IMPORTED_MODULE_2__mapDispatchToProps__["a" /* default */] : _ref$mapDispatchToPro,
      _ref$mergePropsFactor = _ref.mergePropsFactories,
      mergePropsFactories = _ref$mergePropsFactor === undefined ? __WEBPACK_IMPORTED_MODULE_4__mergeProps__["a" /* default */] : _ref$mergePropsFactor,
      _ref$selectorFactory = _ref.selectorFactory,
      selectorFactory = _ref$selectorFactory === undefined ? __WEBPACK_IMPORTED_MODULE_5__selectorFactory__["a" /* default */] : _ref$selectorFactory;

  return function connect(mapStateToProps, mapDispatchToProps, mergeProps) {
    var _ref2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
        _ref2$pure = _ref2.pure,
        pure = _ref2$pure === undefined ? true : _ref2$pure,
        _ref2$areStatesEqual = _ref2.areStatesEqual,
        areStatesEqual = _ref2$areStatesEqual === undefined ? strictEqual : _ref2$areStatesEqual,
        _ref2$areOwnPropsEqua = _ref2.areOwnPropsEqual,
        areOwnPropsEqual = _ref2$areOwnPropsEqua === undefined ? __WEBPACK_IMPORTED_MODULE_1__utils_shallowEqual__["a" /* default */] : _ref2$areOwnPropsEqua,
        _ref2$areStatePropsEq = _ref2.areStatePropsEqual,
        areStatePropsEqual = _ref2$areStatePropsEq === undefined ? __WEBPACK_IMPORTED_MODULE_1__utils_shallowEqual__["a" /* default */] : _ref2$areStatePropsEq,
        _ref2$areMergedPropsE = _ref2.areMergedPropsEqual,
        areMergedPropsEqual = _ref2$areMergedPropsE === undefined ? __WEBPACK_IMPORTED_MODULE_1__utils_shallowEqual__["a" /* default */] : _ref2$areMergedPropsE,
        extraOptions = _objectWithoutProperties(_ref2, ['pure', 'areStatesEqual', 'areOwnPropsEqual', 'areStatePropsEqual', 'areMergedPropsEqual']);

    var initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, 'mapStateToProps');
    var initMapDispatchToProps = match(mapDispatchToProps, mapDispatchToPropsFactories, 'mapDispatchToProps');
    var initMergeProps = match(mergeProps, mergePropsFactories, 'mergeProps');

    return connectHOC(selectorFactory, _extends({
      // used in error messages
      methodName: 'connect',

      // used to compute Connect's displayName from the wrapped component's displayName.
      getDisplayName: function getDisplayName(name) {
        return 'Connect(' + name + ')';
      },

      // if mapStateToProps is falsy, the Connect component doesn't subscribe to store state changes
      shouldHandleStateChanges: Boolean(mapStateToProps),

      // passed through to selectorFactory
      initMapStateToProps: initMapStateToProps,
      initMapDispatchToProps: initMapDispatchToProps,
      initMergeProps: initMergeProps,
      pure: pure,
      areStatesEqual: areStatesEqual,
      areOwnPropsEqual: areOwnPropsEqual,
      areStatePropsEqual: areStatePropsEqual,
      areMergedPropsEqual: areMergedPropsEqual

    }, extraOptions));
  };
}

/* harmony default export */ __webpack_exports__["a"] = (createConnect());

/***/ }),
/* 496 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = shallowEqual;
var hasOwn = Object.prototype.hasOwnProperty;

function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}

function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true;

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

/***/ }),
/* 497 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export whenMapDispatchToPropsIsFunction */
/* unused harmony export whenMapDispatchToPropsIsMissing */
/* unused harmony export whenMapDispatchToPropsIsObject */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(251);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__wrapMapToProps__ = __webpack_require__(344);



function whenMapDispatchToPropsIsFunction(mapDispatchToProps) {
  return typeof mapDispatchToProps === 'function' ? Object(__WEBPACK_IMPORTED_MODULE_1__wrapMapToProps__["b" /* wrapMapToPropsFunc */])(mapDispatchToProps, 'mapDispatchToProps') : undefined;
}

function whenMapDispatchToPropsIsMissing(mapDispatchToProps) {
  return !mapDispatchToProps ? Object(__WEBPACK_IMPORTED_MODULE_1__wrapMapToProps__["a" /* wrapMapToPropsConstant */])(function (dispatch) {
    return { dispatch: dispatch };
  }) : undefined;
}

function whenMapDispatchToPropsIsObject(mapDispatchToProps) {
  return mapDispatchToProps && typeof mapDispatchToProps === 'object' ? Object(__WEBPACK_IMPORTED_MODULE_1__wrapMapToProps__["a" /* wrapMapToPropsConstant */])(function (dispatch) {
    return Object(__WEBPACK_IMPORTED_MODULE_0_redux__["bindActionCreators"])(mapDispatchToProps, dispatch);
  }) : undefined;
}

/* harmony default export */ __webpack_exports__["a"] = ([whenMapDispatchToPropsIsFunction, whenMapDispatchToPropsIsMissing, whenMapDispatchToPropsIsObject]);

/***/ }),
/* 498 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export whenMapStateToPropsIsFunction */
/* unused harmony export whenMapStateToPropsIsMissing */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__wrapMapToProps__ = __webpack_require__(344);


function whenMapStateToPropsIsFunction(mapStateToProps) {
  return typeof mapStateToProps === 'function' ? Object(__WEBPACK_IMPORTED_MODULE_0__wrapMapToProps__["b" /* wrapMapToPropsFunc */])(mapStateToProps, 'mapStateToProps') : undefined;
}

function whenMapStateToPropsIsMissing(mapStateToProps) {
  return !mapStateToProps ? Object(__WEBPACK_IMPORTED_MODULE_0__wrapMapToProps__["a" /* wrapMapToPropsConstant */])(function () {
    return {};
  }) : undefined;
}

/* harmony default export */ __webpack_exports__["a"] = ([whenMapStateToPropsIsFunction, whenMapStateToPropsIsMissing]);

/***/ }),
/* 499 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export defaultMergeProps */
/* unused harmony export wrapMergePropsFunc */
/* unused harmony export whenMergePropsIsFunction */
/* unused harmony export whenMergePropsIsOmitted */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_verifyPlainObject__ = __webpack_require__(345);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



function defaultMergeProps(stateProps, dispatchProps, ownProps) {
  return _extends({}, ownProps, stateProps, dispatchProps);
}

function wrapMergePropsFunc(mergeProps) {
  return function initMergePropsProxy(dispatch, _ref) {
    var displayName = _ref.displayName,
        pure = _ref.pure,
        areMergedPropsEqual = _ref.areMergedPropsEqual;

    var hasRunOnce = false;
    var mergedProps = void 0;

    return function mergePropsProxy(stateProps, dispatchProps, ownProps) {
      var nextMergedProps = mergeProps(stateProps, dispatchProps, ownProps);

      if (hasRunOnce) {
        if (!pure || !areMergedPropsEqual(nextMergedProps, mergedProps)) mergedProps = nextMergedProps;
      } else {
        hasRunOnce = true;
        mergedProps = nextMergedProps;

        if (false) verifyPlainObject(mergedProps, displayName, 'mergeProps');
      }

      return mergedProps;
    };
  };
}

function whenMergePropsIsFunction(mergeProps) {
  return typeof mergeProps === 'function' ? wrapMergePropsFunc(mergeProps) : undefined;
}

function whenMergePropsIsOmitted(mergeProps) {
  return !mergeProps ? function () {
    return defaultMergeProps;
  } : undefined;
}

/* harmony default export */ __webpack_exports__["a"] = ([whenMergePropsIsFunction, whenMergePropsIsOmitted]);

/***/ }),
/* 500 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export impureFinalPropsSelectorFactory */
/* unused harmony export pureFinalPropsSelectorFactory */
/* harmony export (immutable) */ __webpack_exports__["a"] = finalPropsSelectorFactory;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__verifySubselectors__ = __webpack_require__(501);
function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }



function impureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch) {
  return function impureFinalPropsSelector(state, ownProps) {
    return mergeProps(mapStateToProps(state, ownProps), mapDispatchToProps(dispatch, ownProps), ownProps);
  };
}

function pureFinalPropsSelectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, _ref) {
  var areStatesEqual = _ref.areStatesEqual,
      areOwnPropsEqual = _ref.areOwnPropsEqual,
      areStatePropsEqual = _ref.areStatePropsEqual;

  var hasRunAtLeastOnce = false;
  var state = void 0;
  var ownProps = void 0;
  var stateProps = void 0;
  var dispatchProps = void 0;
  var mergedProps = void 0;

  function handleFirstCall(firstState, firstOwnProps) {
    state = firstState;
    ownProps = firstOwnProps;
    stateProps = mapStateToProps(state, ownProps);
    dispatchProps = mapDispatchToProps(dispatch, ownProps);
    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    hasRunAtLeastOnce = true;
    return mergedProps;
  }

  function handleNewPropsAndNewState() {
    stateProps = mapStateToProps(state, ownProps);

    if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);

    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }

  function handleNewProps() {
    if (mapStateToProps.dependsOnOwnProps) stateProps = mapStateToProps(state, ownProps);

    if (mapDispatchToProps.dependsOnOwnProps) dispatchProps = mapDispatchToProps(dispatch, ownProps);

    mergedProps = mergeProps(stateProps, dispatchProps, ownProps);
    return mergedProps;
  }

  function handleNewState() {
    var nextStateProps = mapStateToProps(state, ownProps);
    var statePropsChanged = !areStatePropsEqual(nextStateProps, stateProps);
    stateProps = nextStateProps;

    if (statePropsChanged) mergedProps = mergeProps(stateProps, dispatchProps, ownProps);

    return mergedProps;
  }

  function handleSubsequentCalls(nextState, nextOwnProps) {
    var propsChanged = !areOwnPropsEqual(nextOwnProps, ownProps);
    var stateChanged = !areStatesEqual(nextState, state);
    state = nextState;
    ownProps = nextOwnProps;

    if (propsChanged && stateChanged) return handleNewPropsAndNewState();
    if (propsChanged) return handleNewProps();
    if (stateChanged) return handleNewState();
    return mergedProps;
  }

  return function pureFinalPropsSelector(nextState, nextOwnProps) {
    return hasRunAtLeastOnce ? handleSubsequentCalls(nextState, nextOwnProps) : handleFirstCall(nextState, nextOwnProps);
  };
}

// TODO: Add more comments

// If pure is true, the selector returned by selectorFactory will memoize its results,
// allowing connectAdvanced's shouldComponentUpdate to return false if final
// props have not changed. If false, the selector will always return a new
// object and shouldComponentUpdate will always return true.

function finalPropsSelectorFactory(dispatch, _ref2) {
  var initMapStateToProps = _ref2.initMapStateToProps,
      initMapDispatchToProps = _ref2.initMapDispatchToProps,
      initMergeProps = _ref2.initMergeProps,
      options = _objectWithoutProperties(_ref2, ['initMapStateToProps', 'initMapDispatchToProps', 'initMergeProps']);

  var mapStateToProps = initMapStateToProps(dispatch, options);
  var mapDispatchToProps = initMapDispatchToProps(dispatch, options);
  var mergeProps = initMergeProps(dispatch, options);

  if (false) {
    verifySubselectors(mapStateToProps, mapDispatchToProps, mergeProps, options.displayName);
  }

  var selectorFactory = options.pure ? pureFinalPropsSelectorFactory : impureFinalPropsSelectorFactory;

  return selectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, options);
}

/***/ }),
/* 501 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils_warning__ = __webpack_require__(221);


function verify(selector, methodName, displayName) {
  if (!selector) {
    throw new Error('Unexpected value for ' + methodName + ' in ' + displayName + '.');
  } else if (methodName === 'mapStateToProps' || methodName === 'mapDispatchToProps') {
    if (!selector.hasOwnProperty('dependsOnOwnProps')) {
      Object(__WEBPACK_IMPORTED_MODULE_0__utils_warning__["a" /* default */])('The selector for ' + methodName + ' of ' + displayName + ' did not specify a value for dependsOnOwnProps.');
    }
  }
}

function verifySubselectors(mapStateToProps, mapDispatchToProps, mergeProps, displayName) {
  verify(mapStateToProps, 'mapStateToProps', displayName);
  verify(mapDispatchToProps, 'mapDispatchToProps', displayName);
  verify(mergeProps, 'mergeProps', displayName);
}

/***/ }),
/* 502 */,
/* 503 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__(5);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _yoastComponents = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Section = (0, _styledComponents2.default)(_yoastComponents.StyledSection).withConfig({
	displayName: "SnippetPreviewSection__Section"
})(["max-width:640px;&", "{padding-left:0;padding-right:0;& ", "{", ":20px;margin-left:", ";}}"], _yoastComponents.StyledSectionBase, _yoastComponents.StyledHeading, (0, _yoastComponents.getRtlStyle)("padding-left", "padding-right"), (0, _yoastComponents.getRtlStyle)("0", "20px"));

/**
 * Creates the Snippet Preview Section.
 *
 * @param {Object}         props               The component props.
 * @param {ReactComponent} props.children      The component's children.
 * @param {string}         props.title         The heading title.
 * @param {string}         props.icon          The heading icon.
 * @param {bool}           props.hasPaperStyle Whether the section should have a paper style.
 *
 * @returns {ReactElement} Snippet Preview Section.
 */
// External dependencies.
var SnippetPreviewSection = function SnippetPreviewSection(_ref) {
	var children = _ref.children,
	    title = _ref.title,
	    icon = _ref.icon,
	    hasPaperStyle = _ref.hasPaperStyle;

	return yoast._wp.element.createElement(
		Section,
		{
			headingLevel: 3,
			headingText: title,
			headingIcon: icon,
			headingIconColor: "#555",
			hasPaperStyle: hasPaperStyle
		},
		children
	);
};

SnippetPreviewSection.propTypes = {
	children: _propTypes2.default.element,
	title: _propTypes2.default.string,
	icon: _propTypes2.default.string,
	hasPaperStyle: _propTypes2.default.bool
};

SnippetPreviewSection.defaultProps = {
	hasPaperStyle: true
};

exports.default = SnippetPreviewSection;

/***/ }),
/* 504 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _yoastComponents = __webpack_require__(9);

var _defaultReplaceVariables = __webpack_require__(453);

var _defaultReplaceVariables2 = _interopRequireDefault(_defaultReplaceVariables);

var _snippetEditor = __webpack_require__(61);

var _replacementVariableHelpers = __webpack_require__(305);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns the initial state for the snippetEditorReducer.
 *
 * @returns {Object} The initial state.
 */
function getInitialState() {
	return {
		mode: _yoastComponents.DEFAULT_MODE,
		data: {
			title: "",
			slug: "",
			description: ""
		},
		replacementVariables: (0, _defaultReplaceVariables2.default)(),
		uniqueRefreshValue: ""
	};
}

/**
 * Reduces the dispatched action for the snippet editor state.
 *
 * @param {Object} state The current state.
 * @param {Object} action The action that was just dispatched.
 *
 * @returns {Object} The new state.
 */
function snippetEditorReducer() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getInitialState();
	var action = arguments[1];

	switch (action.type) {
		case _snippetEditor.SWITCH_MODE:
			return _extends({}, state, {
				mode: action.mode
			});

		case _snippetEditor.UPDATE_DATA:
			return _extends({}, state, {
				data: _extends({}, state.data, action.data)
			});

		case _snippetEditor.UPDATE_REPLACEMENT_VARIABLE:
			{
				var isNewReplaceVar = true;
				var nextReplacementVariables = state.replacementVariables.map(function (replaceVar) {
					if (replaceVar.name === action.name) {
						isNewReplaceVar = false;
						return {
							name: action.name,
							label: action.label || replaceVar.label,
							value: action.value
						};
					}
					return replaceVar;
				});

				if (isNewReplaceVar) {
					nextReplacementVariables = (0, _replacementVariableHelpers.pushNewReplaceVar)(nextReplacementVariables, action);
				}

				return _extends({}, state, {
					replacementVariables: nextReplacementVariables
				});
			}

		case _snippetEditor.REMOVE_REPLACEMENT_VARIABLE:
			{
				return _extends({}, state, {
					replacementVariables: state.replacementVariables.filter(function (replacementVariable) {
						return replacementVariable.name !== action.name;
					})
				});
			}

		case _snippetEditor.REFRESH:
			{
				return _extends({}, state, {
					uniqueRefreshValue: action.time
				});
			}
	}

	return state;
}

exports.default = snippetEditorReducer;

/***/ }),
/* 505 */,
/* 506 */,
/* 507 */,
/* 508 */,
/* 509 */,
/* 510 */,
/* 511 */,
/* 512 */,
/* 513 */,
/* 514 */,
/* 515 */,
/* 516 */,
/* 517 */,
/* 518 */,
/* 519 */,
/* 520 */,
/* 521 */,
/* 522 */,
/* 523 */,
/* 524 */,
/* 525 */,
/* 526 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(6);

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

module.exports = now;


/***/ }),
/* 527 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAnalysisData = updateAnalysisData;
var UPDATE_SNIPPET_DATA = exports.UPDATE_SNIPPET_DATA = "SNIPPET_EDITOR_UPDATE_ANALYSIS_DATA";

/**
 * Updates the analysis data in redux.
 *
 * @param {Object} data The analysis data, consisting of a title and a description.
 *
 * @returns {Object} An action for redux.
 */
function updateAnalysisData(data) {
  return {
    type: UPDATE_SNIPPET_DATA,
    data: data
  };
}

/***/ }),
/* 528 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var SET_SETTINGS = exports.SET_SETTINGS = "SET_SETTINGS";

/**
 * An action creator for settings.
 *
 * @param {Object} settings The settings to pass along.
 *
 * @returns {Object} The set settings action.
 */
var setSettings = exports.setSettings = function setSettings(settings) {
  return {
    type: SET_SETTINGS,
    settings: settings
  };
};

/***/ }),
/* 529 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var PREFIX = "WPSEO_";

var SET_PRIMARY_TAXONOMY = exports.SET_PRIMARY_TAXONOMY = PREFIX + "SET_PRIMARY_TAXONOMY";

var setPrimaryTaxonomyId = exports.setPrimaryTaxonomyId = function setPrimaryTaxonomyId(taxonomy, termId) {
	return {
		type: SET_PRIMARY_TAXONOMY,
		taxonomy: taxonomy,
		termId: termId
	};
};

/***/ }),
/* 530 */
/***/ (function(module, exports, __webpack_require__) {

var apply = __webpack_require__(201),
    assignInWith = __webpack_require__(531),
    baseRest = __webpack_require__(203),
    customDefaultsAssignIn = __webpack_require__(532);

/**
 * Assigns own and inherited enumerable string keyed properties of source
 * objects to the destination object for all destination properties that
 * resolve to `undefined`. Source objects are applied from left to right.
 * Once a property is set, additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaultsDeep
 * @example
 *
 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var defaults = baseRest(function(args) {
  args.push(undefined, customDefaultsAssignIn);
  return apply(assignInWith, undefined, args);
});

module.exports = defaults;


/***/ }),
/* 531 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(45),
    createAssigner = __webpack_require__(322),
    keysIn = __webpack_require__(94);

/**
 * This method is like `_.assignIn` except that it accepts `customizer`
 * which is invoked to produce the assigned values. If `customizer` returns
 * `undefined`, assignment is handled by the method instead. The `customizer`
 * is invoked with five arguments: (objValue, srcValue, key, object, source).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias extendWith
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @see _.assignWith
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   return _.isUndefined(objValue) ? srcValue : objValue;
 * }
 *
 * var defaults = _.partialRight(_.assignInWith, customizer);
 *
 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
  copyObject(source, keysIn(source), object, customizer);
});

module.exports = assignInWith;


/***/ }),
/* 532 */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(27);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used by `_.defaults` to customize its `_.assignIn` use to assign properties
 * of source objects to the destination object for all destination properties
 * that resolve to `undefined`.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to assign.
 * @param {Object} object The parent object of `objValue`.
 * @returns {*} Returns the value to assign.
 */
function customDefaultsAssignIn(objValue, srcValue, key, object) {
  if (objValue === undefined ||
      (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
    return srcValue;
  }
  return objValue;
}

module.exports = customDefaultsAssignIn;


/***/ }),
/* 533 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _isUndefined = __webpack_require__(15);

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _isFunction = __webpack_require__(47);

var _isFunction2 = _interopRequireDefault(_isFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Checks if the data API from Gutenberg is available.
 *
 * @returns {boolean} True if the data API is available.
 */
/* global wp */

var isGutenbergDataAvailable = function isGutenbergDataAvailable() {
	return !(0, _isUndefined2.default)(window.wp) && !(0, _isUndefined2.default)(wp.data) && !(0, _isUndefined2.default)(wp.data.select("core/editor")) && (0, _isFunction2.default)(wp.data.select("core/editor").getEditedPostAttribute);
};

exports.default = isGutenbergDataAvailable;

/***/ }),
/* 534 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _withYoastSidebarPriority = __webpack_require__(793);

var _withYoastSidebarPriority2 = _interopRequireDefault(_withYoastSidebarPriority);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* External dependencies */
var SidebarItem = (0, _withYoastSidebarPriority2.default)(function (_ref) {
	var children = _ref.children;

	return yoast._wp.element.createElement(
		"div",
		null,
		children
	);
});

/* Internal dependencies */
exports.default = SidebarItem;

/***/ }),
/* 535 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = __webpack_require__(74);

var _styledComponents = __webpack_require__(5);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _i18n = __webpack_require__(8);

var _isNil = __webpack_require__(536);

var _isNil2 = _interopRequireDefault(_isNil);

var _Results = __webpack_require__(537);

var _Results2 = _interopRequireDefault(_Results);

var _SidebarCollapsible = __webpack_require__(323);

var _SidebarCollapsible2 = _interopRequireDefault(_SidebarCollapsible);

var _getIndicatorForScore = __webpack_require__(324);

var _getIndicatorForScore2 = _interopRequireDefault(_getIndicatorForScore);

var _mapResults = __webpack_require__(426);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global wpseoPostScraperL10n wpseoTermScraperL10n */

var AnalysisHeader = _styledComponents2.default.span.withConfig({
	displayName: "ReadabilityAnalysis__AnalysisHeader"
})(["font-size:1em;font-weight:bold;margin:0 0 8px;display:block;"]);

var localizedData = {};
if (window.wpseoPostScraperL10n) {
	localizedData = wpseoPostScraperL10n;
} else if (window.wpseoTermScraperL10n) {
	localizedData = wpseoTermScraperL10n;
}

/**
 * Redux container for the readability analysis.
 */

var ReadabilityAnalysis = function (_React$Component) {
	_inherits(ReadabilityAnalysis, _React$Component);

	function ReadabilityAnalysis() {
		_classCallCheck(this, ReadabilityAnalysis);

		return _possibleConstructorReturn(this, (ReadabilityAnalysis.__proto__ || Object.getPrototypeOf(ReadabilityAnalysis)).apply(this, arguments));
	}

	_createClass(ReadabilityAnalysis, [{
		key: "render",
		value: function render() {
			var score = (0, _getIndicatorForScore2.default)(this.props.overallScore);

			if ((0, _isNil2.default)(this.props.overallScore)) {
				score.className = "loading";
			}

			return yoast._wp.element.createElement(
				_SidebarCollapsible2.default,
				{
					title: (0, _i18n.__)("Readability", "wordpress-seo"),
					titleScreenReaderText: score.screenReaderReadabilityText,
					prefixIcon: (0, _mapResults.getIconForScore)(score.className),
					prefixIconCollapsed: (0, _mapResults.getIconForScore)(score.className)
				},
				yoast._wp.element.createElement(
					AnalysisHeader,
					null,
					"Analysis results"
				),
				yoast._wp.element.createElement(_Results2.default, {
					canChangeLanguage: !(localizedData.settings_link === ""),
					showLanguageNotice: true,
					changeLanguageLink: localizedData.settings_link,
					language: localizedData.language,
					results: this.props.results,
					marksButtonClassName: "yoast-tooltip yoast-tooltip-s",
					marksButtonStatus: this.props.marksButtonStatus
				})
			);
		}
	}]);

	return ReadabilityAnalysis;
}(_react2.default.Component);

ReadabilityAnalysis.propTypes = {
	results: _propTypes2.default.array,
	marksButtonStatus: _propTypes2.default.string,
	hideMarksButtons: _propTypes2.default.bool,
	overallScore: _propTypes2.default.number
};

/**
 * Maps redux state to ContentAnalysis props.
 *
 * @param {Object} state The redux state.
 * @param {Object} ownProps The component's props.
 *
 * @returns {Object} Props that should be passed to ContentAnalysis.
 */
function mapStateToProps(state, ownProps) {
	var marksButtonStatus = ownProps.hideMarksButtons ? "disabled" : state.marksButtonStatus;

	return {
		results: state.analysis.readability.results,
		marksButtonStatus: marksButtonStatus,
		overallScore: state.analysis.readability.overallScore
	};
}

exports.default = (0, _reactRedux.connect)(mapStateToProps)(ReadabilityAnalysis);

/***/ }),
/* 536 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is `null` or `undefined`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is nullish, else `false`.
 * @example
 *
 * _.isNil(null);
 * // => true
 *
 * _.isNil(void 0);
 * // => true
 *
 * _.isNil(NaN);
 * // => false
 */
function isNil(value) {
  return value == null;
}

module.exports = isNil;


/***/ }),
/* 537 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _yoastComponents = __webpack_require__(9);

var _element = __webpack_require__(50);

var _yoastseo = __webpack_require__(70);

var _mapResults = __webpack_require__(426);

var _mapResults2 = _interopRequireDefault(_mapResults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Wrapper to provide functionality to the ContentAnalysis component.
 */
var Results = function (_React$Component) {
	_inherits(Results, _React$Component);

	function Results(props) {
		_classCallCheck(this, Results);

		var _this = _possibleConstructorReturn(this, (Results.__proto__ || Object.getPrototypeOf(Results)).call(this, props));

		_this.state = {
			mappedResults: (0, _mapResults2.default)(_this.props.results)
		};
		return _this;
	}

	_createClass(Results, [{
		key: "componentWillReceiveProps",
		value: function componentWillReceiveProps(nextProps) {
			/*
    * Check if there are new results.
    * When the new results are null, we presume we are loading the analysis.
    * Only update the mappedResults when we have new and non-null results.
    */
			if (nextProps.results !== null && nextProps.results !== this.props.results) {
				this.setState({
					mappedResults: (0, _mapResults2.default)(nextProps.results)
				});
			}
		}

		/**
   * Handles a click on a marker button, to mark the text in the editor.
   *
   * @param {string} id Result id, empty if a marker is deselected.
   * @param {object} marker The marker function.
   *
   * @returns {void}
   */

	}, {
		key: "handleMarkButtonClick",
		value: function handleMarkButtonClick(id, marker) {
			if (id) {
				marker();
			} else {
				this.removeMarkers();
			}
		}

		/**
   * Removes all markers.
   *
   * @returns {void}
   */

	}, {
		key: "removeMarkers",
		value: function removeMarkers() {
			window.YoastSEO.analysis.applyMarks(new _yoastseo.Paper("", {}), []);
		}

		/**
   * Renders the Results component.
   *
   * @returns {ReactElement} The react element.
   */

	}, {
		key: "render",
		value: function render() {
			var mappedResults = this.state.mappedResults;
			var errorsResults = mappedResults.errorsResults,
			    improvementsResults = mappedResults.improvementsResults,
			    goodResults = mappedResults.goodResults,
			    considerationsResults = mappedResults.considerationsResults,
			    problemsResults = mappedResults.problemsResults;

			return yoast._wp.element.createElement(
				_element.Fragment,
				null,
				yoast._wp.element.createElement(_yoastComponents.LanguageNotice, {
					changeLanguageLink: this.props.changeLanguageLink,
					language: this.props.language,
					showLanguageNotice: this.props.showLanguageNotice,
					canChangeLanguage: this.props.canChangeLanguage
				}),
				yoast._wp.element.createElement(_yoastComponents.ContentAnalysis, {
					errorsResults: errorsResults,
					problemsResults: problemsResults,
					improvementsResults: improvementsResults,
					considerationsResults: considerationsResults,
					goodResults: goodResults,
					onMarkButtonClick: this.handleMarkButtonClick.bind(this),
					marksButtonClassName: this.props.marksButtonClassName,
					marksButtonStatus: this.props.marksButtonStatus
				})
			);
		}
	}]);

	return Results;
}(_react2.default.Component);

Results.propTypes = {
	results: _propTypes2.default.array,
	language: _propTypes2.default.string,
	changeLanguageLink: _propTypes2.default.string,
	showLanguageNotice: _propTypes2.default.bool.isRequired,
	canChangeLanguage: _propTypes2.default.bool,
	marksButtonClassName: _propTypes2.default.string,
	marksButtonStatus: _propTypes2.default.string
};

Results.defaultProps = {
	language: "",
	changeLanguageLink: "#",
	canChangeLanguage: false,
	marksButtonStatus: "enabled"
};

exports.default = Results;

/***/ }),
/* 538 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = __webpack_require__(74);

var _CollapsibleCornerstone = __webpack_require__(794);

var _CollapsibleCornerstone2 = _interopRequireDefault(_CollapsibleCornerstone);

var _cornerstoneContent = __webpack_require__(349);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Maps the state to props.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The props for the CollapsibleCornerstone component.
 */


/* Internal dependencies */
function mapStateToProps(state) {
  return {
    isCornerstone: state.isCornerstone
  };
}

/**
 * Maps the dispatch to props.
 *
 * @param {function} dispatch The dispatch function.
 *
 * @returns {Object} The dispatch props.
 */
/* External dependencies */
function mapDispatchToProps(dispatch) {
  return {
    onChange: function onChange() {
      dispatch((0, _cornerstoneContent.toggleCornerstoneContent)());
    }
  };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_CollapsibleCornerstone2.default);

/***/ }),
/* 539 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = __webpack_require__(74);

var _styledComponents = __webpack_require__(5);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _components = __webpack_require__(143);

var _i18n = __webpack_require__(8);

var _yoastComponents = __webpack_require__(9);

var _SidebarCollapsible = __webpack_require__(323);

var _SidebarCollapsible2 = _interopRequireDefault(_SidebarCollapsible);

var _Results = __webpack_require__(537);

var _Results2 = _interopRequireDefault(_Results);

var _focusKeyword = __webpack_require__(319);

var _getIndicatorForScore = __webpack_require__(324);

var _getIndicatorForScore2 = _interopRequireDefault(_getIndicatorForScore);

var _mapResults = __webpack_require__(426);

var _KeywordSynonyms = __webpack_require__(795);

var _KeywordSynonyms2 = _interopRequireDefault(_KeywordSynonyms);

var _Modal = __webpack_require__(545);

var _Modal2 = _interopRequireDefault(_Modal);

var _MultipleKeywords = __webpack_require__(796);

var _MultipleKeywords2 = _interopRequireDefault(_MultipleKeywords);

var _YoastSeoIcon = __webpack_require__(546);

var _YoastSeoIcon2 = _interopRequireDefault(_YoastSeoIcon);

var _Icon = __webpack_require__(427);

var _Icon2 = _interopRequireDefault(_Icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* globals wpseoAdminL10n */


var AnalysisHeader = _styledComponents2.default.span.withConfig({
	displayName: "SeoAnalysis__AnalysisHeader"
})(["font-size:1em;font-weight:bold;margin:1.5em 0 1em;display:block;"]);

var FocusKeywordLink = _yoastComponents.utils.makeOutboundLink();

var StyledContainer = _styledComponents2.default.div.withConfig({
	displayName: "SeoAnalysis__StyledContainer"
})(["min-width:600px;@media screen and ( max-width:680px ){min-width:0;width:86vw;}"]);

var StyledIcon = (0, _styledComponents2.default)(_Icon2.default).withConfig({
	displayName: "SeoAnalysis__StyledIcon"
})(["float:", ";margin:", ";&&{width:150px;height:150px;@media screen and ( max-width:680px ){width:80px;height:80px;}}"], (0, _yoastComponents.getRtlStyle)("right", "left"), (0, _yoastComponents.getRtlStyle)("0 0 16px 16px", "0 16px 16px 0"));

/**
 * Redux container for the seo analysis.
 */

var SeoAnalysis = function (_React$Component) {
	_inherits(SeoAnalysis, _React$Component);

	function SeoAnalysis() {
		_classCallCheck(this, SeoAnalysis);

		return _possibleConstructorReturn(this, (SeoAnalysis.__proto__ || Object.getPrototypeOf(SeoAnalysis)).apply(this, arguments));
	}

	_createClass(SeoAnalysis, [{
		key: "renderSynonymsUpsell",


		/**
   * Renders the keyword synonyms upsell modal.
   *
   * @param {string} location The location of the upsell component. Used to determine the shortlinks in the component.
   *
   * @returns {ReactElement} A modalButtonContainer component with the modal for a keyword synonyms upsell.
   */
		value: function renderSynonymsUpsell(location) {
			var modalProps = {
				appElement: "#wpwrap",
				openButtonIcon: "",
				classes: {
					openButton: "wpseo-keyword-synonyms button-link"
				},
				labels: {
					open: "+ " + (0, _i18n.__)("Add synonyms", "wordpress-seo"),
					a11yNotice: {
						opensInNewTab: (0, _i18n.__)("(Opens in a new browser tab!)", "wordpress-seo")
					},
					modalAriaLabel: (0, _i18n.sprintf)(
					/* translators: %s expands to 'Yoast SEO Premium'. */
					(0, _i18n.__)("Get %s now!", "wordpress-seo"), "Yoast SEO Premium"),
					heading: (0, _i18n.sprintf)(
					/* translators: %s expands to 'Yoast SEO Premium'. */
					(0, _i18n.__)("Get %s now!", "wordpress-seo"), "Yoast SEO Premium")
				}
			};

			// Defaults to metabox.
			var link = wpseoAdminL10n["shortlinks.upsell.metabox.focus_keyword_synonyms_link"];
			var buyLink = wpseoAdminL10n["shortlinks.upsell.metabox.focus_keyword_synonyms_button"];

			if (location.toLowerCase() === "sidebar") {
				link = wpseoAdminL10n["shortlinks.upsell.sidebar.focus_keyword_synonyms_link"];
				buyLink = wpseoAdminL10n["shortlinks.upsell.sidebar.focus_keyword_synonyms_button"];
			}

			return yoast._wp.element.createElement(
				_Modal2.default,
				modalProps,
				yoast._wp.element.createElement(
					StyledContainer,
					null,
					yoast._wp.element.createElement(StyledIcon, { icon: _YoastSeoIcon2.default }),
					yoast._wp.element.createElement(
						"h2",
						null,
						(0, _i18n.__)("Would you like to add keyword synonyms?", "wordpress-seo")
					),
					yoast._wp.element.createElement(_KeywordSynonyms2.default, { link: link, buyLink: buyLink })
				)
			);
		}

		/**
   * Renders the multiple keywords upsell modal.
   *
   * @param {string} location The location of the upsell component. Used to determine the shortlinks in the component.
   *
   * @returns {ReactElement} A modalButtonContainer component with the modal for a multiple keywords upsell.
   */

	}, {
		key: "renderMultipleKeywordsUpsell",
		value: function renderMultipleKeywordsUpsell(location) {
			var modalProps = {
				appElement: "#wpwrap",
				openButtonIcon: "",
				classes: {
					openButton: "wpseo-multiple-keywords button-link"
				},
				labels: {
					open: "+ " + (0, _i18n.__)("Add additional keyword", "wordpress-seo"),
					a11yNotice: {
						opensInNewTab: (0, _i18n.__)("(Opens in a new browser tab!)", "wordpress-seo")
					},
					modalAriaLabel: (0, _i18n.sprintf)(
					/* translators: %s expands to 'Yoast SEO Premium'. */
					(0, _i18n.__)("Get %s now!", "wordpress-seo"), "Yoast SEO Premium"),
					heading: (0, _i18n.sprintf)(
					/* translators: %s expands to 'Yoast SEO Premium'. */
					(0, _i18n.__)("Get %s now!", "wordpress-seo"), "Yoast SEO Premium")
				}
			};

			// Defaults to metabox
			var link = wpseoAdminL10n["shortlinks.upsell.metabox.focus_keyword_additional_link"];
			var buyLink = wpseoAdminL10n["shortlinks.upsell.metabox.focus_keyword_additional_button"];

			if (location.toLowerCase() === "sidebar") {
				link = wpseoAdminL10n["shortlinks.upsell.sidebar.focus_keyword_additional_link"];
				buyLink = wpseoAdminL10n["shortlinks.upsell.sidebar.focus_keyword_additional_button"];
			}

			return yoast._wp.element.createElement(
				_Modal2.default,
				modalProps,
				yoast._wp.element.createElement(
					StyledContainer,
					null,
					yoast._wp.element.createElement(StyledIcon, { icon: _YoastSeoIcon2.default }),
					yoast._wp.element.createElement(
						"h2",
						null,
						(0, _i18n.__)("Would you like to add another keyword?", "wordpress-seo")
					),
					yoast._wp.element.createElement(_MultipleKeywords2.default, {
						link: link,
						buyLink: buyLink
					})
				)
			);
		}

		/**
   * Renders the UpsellBox component.
   *
   * @param {string} location The location of the upsell component. Used to determine the shortlinks in the component.
   *
   * @returns {ReactElement} The UpsellBox component.
   */

	}, {
		key: "renderKeywordUpsell",
		value: function renderKeywordUpsell(location) {
			// Default to metabox.
			var link = wpseoAdminL10n["shortlinks.upsell.metabox.additional_link"];
			var buyLink = wpseoAdminL10n["shortlinks.upsell.metabox.additional_button"];

			if (location.toLowerCase() === "sidebar") {
				link = wpseoAdminL10n["shortlinks.upsell.sidebar.additional_link"];
				buyLink = wpseoAdminL10n["shortlinks.upsell.sidebar.additional_button"];
			}

			return yoast._wp.element.createElement(
				_SidebarCollapsible2.default,
				{
					prefixIcon: { icon: "plus", color: _yoastComponents.colors.$color_grey_medium_dark },
					prefixIconCollapsed: { icon: "plus", color: _yoastComponents.colors.$color_grey_medium_dark },
					title: (0, _i18n.__)("Add additional keyword", "wordpress-seo")
				},
				yoast._wp.element.createElement(_MultipleKeywords2.default, {
					link: link,
					buyLink: buyLink
				})
			);
		}

		/**
   * Renders the SEO Analysis component.
   *
   * @returns {ReactElement} The SEO Analysis component.
   */

	}, {
		key: "render",
		value: function render() {
			var score = (0, _getIndicatorForScore2.default)(this.props.overallScore);

			if (score.className !== "loading" && this.props.keyword === "") {
				score.className = "na";
				score.screenReaderReadabilityText = (0, _i18n.__)("Enter a focus keyword to calculate the SEO score", "wordpress-seo");
			}

			return yoast._wp.element.createElement(
				_react2.default.Fragment,
				null,
				yoast._wp.element.createElement(
					_SidebarCollapsible2.default,
					{
						title: (0, _i18n.__)("Focus keyword", "wordpress-seo"),
						titleScreenReaderText: score.screenReaderReadabilityText,
						prefixIcon: (0, _mapResults.getIconForScore)(score.className),
						prefixIconCollapsed: (0, _mapResults.getIconForScore)(score.className),
						subTitle: this.props.keyword
					},
					yoast._wp.element.createElement(
						_yoastComponents.HelpText,
						null,
						(0, _i18n.__)("A focus keyword is the term (or phrase) you'd like to be found with, in search engines. " + "Enter it below to see how you can improve your text for this term.", "wordpress-seo") + " ",
						yoast._wp.element.createElement(
							FocusKeywordLink,
							{ href: wpseoAdminL10n["shortlinks.focus_keyword_info"], rel: null },
							(0, _i18n.__)("Learn more about the Keyword Analysis.", "wordpress-seo")
						)
					),
					yoast._wp.element.createElement(_yoastComponents.KeywordInput, {
						id: "focus-keyword-input",
						onChange: this.props.onFocusKeywordChange,
						keyword: this.props.keyword
					}),
					yoast._wp.element.createElement(_components.Slot, { name: "YoastSynonyms" }),
					this.props.shouldUpsell && this.renderSynonymsUpsell(this.props.location),
					this.props.shouldUpsell && this.renderMultipleKeywordsUpsell(this.props.location),
					yoast._wp.element.createElement(
						AnalysisHeader,
						null,
						(0, _i18n.__)("Analysis results:", "wordpress-seo")
					),
					yoast._wp.element.createElement(_Results2.default, {
						showLanguageNotice: false,
						results: this.props.results,
						marksButtonClassName: "yoast-tooltip yoast-tooltip-s",
						marksButtonStatus: this.props.marksButtonStatus
					})
				),
				this.props.shouldUpsell && this.renderKeywordUpsell(this.props.location)
			);
		}
	}]);

	return SeoAnalysis;
}(_react2.default.Component);

SeoAnalysis.propTypes = {
	results: _propTypes2.default.array,
	marksButtonStatus: _propTypes2.default.string,
	hideMarksButtons: _propTypes2.default.bool,
	keyword: _propTypes2.default.string,
	onFocusKeywordChange: _propTypes2.default.func,
	shouldUpsell: _propTypes2.default.bool,
	overallScore: _propTypes2.default.number,
	location: _propTypes2.default.string
};

/**
 * Maps redux state to SeoAnalysis props.
 *
 * @param {Object} state The redux state.
 * @param {Object} ownProps The component's props.
 *
 * @returns {Object} Props that should be passed to SeoAnalysis.
 */
function mapStateToProps(state, ownProps) {
	var marksButtonStatus = ownProps.hideMarksButtons ? "disabled" : state.marksButtonStatus;

	var keyword = state.focusKeyword;

	var results = null;
	var overallScore = null;
	if (state.analysis.seo[keyword]) {
		results = state.analysis.seo[keyword].results;
		overallScore = state.analysis.seo[keyword].overallScore;
	}
	return {
		results: results,
		marksButtonStatus: marksButtonStatus,
		keyword: keyword,
		overallScore: overallScore
	};
}

/**
 * Maps the redux dispatch to KeywordInput props.
 *
 * @param {Function} dispatch The dispatch function that will dispatch a redux action.
 *
 * @returns {Object} Props for the `KeywordInput` component.
 */
function mapDispatchToProps(dispatch) {
	return {
		onFocusKeywordChange: function onFocusKeywordChange(value) {
			dispatch((0, _focusKeyword.setFocusKeyword)(value));
		}
	};
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(SeoAnalysis);

/***/ }),
/* 540 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var React = __webpack_require__(0);

var REACT_ELEMENT_TYPE =
  (typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element')) ||
  0xeac7;

var emptyFunction = __webpack_require__(351);
var invariant = __webpack_require__(541);
var warning = __webpack_require__(542);

var SEPARATOR = '.';
var SUBSEPARATOR = ':';

var didWarnAboutMaps = false;

var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

function getIteratorFn(maybeIterable) {
  var iteratorFn =
    maybeIterable &&
    ((ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL]) ||
      maybeIterable[FAUX_ITERATOR_SYMBOL]);
  if (typeof iteratorFn === 'function') {
    return iteratorFn;
  }
}

function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = ('' + key).replace(escapeRegex, function(match) {
    return escaperLookup[match];
  });

  return '$' + escapedString;
}

function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (component && typeof component === 'object' && component.key != null) {
    // Explicit key
    return escape(component.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36);
}

function traverseAllChildrenImpl(
  children,
  nameSoFar,
  callback,
  traverseContext
) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  if (
    children === null ||
    type === 'string' ||
    type === 'number' ||
    // The following is inlined from ReactElement. This means we can optimize
    // some checks. React Fiber also inlines this logic for similar purposes.
    (type === 'object' && children.$$typeof === REACT_ELEMENT_TYPE)
  ) {
    callback(
      traverseContext,
      children,
      // If it's the only child, treat the name as if it was wrapped in an array
      // so that it's consistent if the number of children grows.
      nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar
    );
    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // Count of children found in the current subtree.
  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(
        child,
        nextName,
        callback,
        traverseContext
      );
    }
  } else {
    var iteratorFn = getIteratorFn(children);
    if (iteratorFn) {
      if (false) {
        // Warn about using Maps as children
        if (iteratorFn === children.entries) {
          warning(
            didWarnAboutMaps,
            'Using Maps as children is unsupported and will likely yield ' +
              'unexpected results. Convert it to a sequence/iterable of keyed ' +
              'ReactElements instead.'
          );
          didWarnAboutMaps = true;
        }
      }

      var iterator = iteratorFn.call(children);
      var step;
      var ii = 0;
      while (!(step = iterator.next()).done) {
        child = step.value;
        nextName = nextNamePrefix + getComponentKey(child, ii++);
        subtreeCount += traverseAllChildrenImpl(
          child,
          nextName,
          callback,
          traverseContext
        );
      }
    } else if (type === 'object') {
      var addendum = '';
      if (false) {
        addendum =
          ' If you meant to render a collection of children, use an array ' +
          'instead or wrap the object using createFragment(object) from the ' +
          'React add-ons.';
      }
      var childrenString = '' + children;
      invariant(
        false,
        'Objects are not valid as a React child (found: %s).%s',
        childrenString === '[object Object]'
          ? 'object with keys {' + Object.keys(children).join(', ') + '}'
          : childrenString,
        addendum
      );
    }
  }

  return subtreeCount;
}

function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}

var userProvidedKeyEscapeRegex = /\/+/g;
function escapeUserProvidedKey(text) {
  return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
}

function cloneAndReplaceKey(oldElement, newKey) {
  return React.cloneElement(
    oldElement,
    {key: newKey},
    oldElement.props !== undefined ? oldElement.props.children : undefined
  );
}

var DEFAULT_POOL_SIZE = 10;
var DEFAULT_POOLER = oneArgumentPooler;

var oneArgumentPooler = function(copyFieldsFrom) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, copyFieldsFrom);
    return instance;
  } else {
    return new Klass(copyFieldsFrom);
  }
};

var addPoolingTo = function addPoolingTo(CopyConstructor, pooler) {
  // Casting as any so that flow ignores the actual implementation and trusts
  // it to match the type we declared
  var NewKlass = CopyConstructor;
  NewKlass.instancePool = [];
  NewKlass.getPooled = pooler || DEFAULT_POOLER;
  if (!NewKlass.poolSize) {
    NewKlass.poolSize = DEFAULT_POOL_SIZE;
  }
  NewKlass.release = standardReleaser;
  return NewKlass;
};

var standardReleaser = function standardReleaser(instance) {
  var Klass = this;
  invariant(
    instance instanceof Klass,
    'Trying to release an instance into a pool of a different type.'
  );
  instance.destructor();
  if (Klass.instancePool.length < Klass.poolSize) {
    Klass.instancePool.push(instance);
  }
};

var fourArgumentPooler = function fourArgumentPooler(a1, a2, a3, a4) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3, a4);
    return instance;
  } else {
    return new Klass(a1, a2, a3, a4);
  }
};

function MapBookKeeping(mapResult, keyPrefix, mapFunction, mapContext) {
  this.result = mapResult;
  this.keyPrefix = keyPrefix;
  this.func = mapFunction;
  this.context = mapContext;
  this.count = 0;
}
MapBookKeeping.prototype.destructor = function() {
  this.result = null;
  this.keyPrefix = null;
  this.func = null;
  this.context = null;
  this.count = 0;
};
addPoolingTo(MapBookKeeping, fourArgumentPooler);

function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  var result = bookKeeping.result;
  var keyPrefix = bookKeeping.keyPrefix;
  var func = bookKeeping.func;
  var context = bookKeeping.context;

  var mappedChild = func.call(context, child, bookKeeping.count++);
  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(
      mappedChild,
      result,
      childKey,
      emptyFunction.thatReturnsArgument
    );
  } else if (mappedChild != null) {
    if (React.isValidElement(mappedChild)) {
      mappedChild = cloneAndReplaceKey(
        mappedChild,
        // Keep both the (mapped) and old keys if they differ, just as
        // traverseAllChildren used to do for objects as children
        keyPrefix +
          (mappedChild.key && (!child || child.key !== mappedChild.key)
            ? escapeUserProvidedKey(mappedChild.key) + '/'
            : '') +
          childKey
      );
    }
    result.push(mappedChild);
  }
}

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  var escapedPrefix = '';
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }
  var traverseContext = MapBookKeeping.getPooled(
    array,
    escapedPrefix,
    func,
    context
  );
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  MapBookKeeping.release(traverseContext);
}

var numericPropertyRegex = /^\d+$/;

var warnedAboutNumeric = false;

function createReactFragment(object) {
  if (typeof object !== 'object' || !object || Array.isArray(object)) {
    warning(
      false,
      'React.addons.createFragment only accepts a single object. Got: %s',
      object
    );
    return object;
  }
  if (React.isValidElement(object)) {
    warning(
      false,
      'React.addons.createFragment does not accept a ReactElement ' +
        'without a wrapper object.'
    );
    return object;
  }

  invariant(
    object.nodeType !== 1,
    'React.addons.createFragment(...): Encountered an invalid child; DOM ' +
      'elements are not valid children of React components.'
  );

  var result = [];

  for (var key in object) {
    if (false) {
      if (!warnedAboutNumeric && numericPropertyRegex.test(key)) {
        warning(
          false,
          'React.addons.createFragment(...): Child objects should have ' +
            'non-numeric keys so ordering is preserved.'
        );
        warnedAboutNumeric = true;
      }
    }
    mapIntoWithKeyPrefixInternal(
      object[key],
      result,
      key,
      emptyFunction.thatReturnsArgument
    );
  }

  return result;
}

module.exports = createReactFragment;


/***/ }),
/* 541 */
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
/* 542 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var emptyFunction = __webpack_require__(351);

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (false) {
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

module.exports = warning;

/***/ }),
/* 543 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function identifyToken(item) {
	// {{/example}}
	if (item.match(/^\{\{\//)) {
		return {
			type: 'componentClose',
			value: item.replace(/\W/g, '')
		};
	}
	// {{example /}}
	if (item.match(/\/\}\}$/)) {
		return {
			type: 'componentSelfClosing',
			value: item.replace(/\W/g, '')
		};
	}
	// {{example}}
	if (item.match(/^\{\{/)) {
		return {
			type: 'componentOpen',
			value: item.replace(/\W/g, '')
		};
	}
	return {
		type: 'string',
		value: item
	};
}

module.exports = function (mixedString) {
	var tokenStrings = mixedString.split(/(\{\{\/?\s*\w+\s*\/?\}\})/g); // split to components and strings
	return tokenStrings.map(identifyToken);
};
//# sourceMappingURL=tokenize.js.map

/***/ }),
/* 544 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _interpolateComponents = __webpack_require__(158);

var _interpolateComponents2 = _interopRequireDefault(_interpolateComponents);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__(5);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _yoastComponents = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* External dependencies */


var makeOutboundLink = _yoastComponents.utils.makeOutboundLink;


var StyledList = _styledComponents2.default.ul.withConfig({
	displayName: "UpsellBox__StyledList"
})(["list-style:none;margin:0 0 16px;padding:0;li{margin:5px 0 0 0;padding-left:16px;}span[aria-hidden=\"true\"]:before{margin:0 8px 0 -16px;font-weight:bold;content:\"+\";}"]);

var ButtonLabel = _styledComponents2.default.small.withConfig({
	displayName: "UpsellBox__ButtonLabel"
})(["display:block;"]);

var UpsellButton = makeOutboundLink();

/**
 * Returns the UpsellBox component.
 *
 * @returns {ReactElement} The UpsellBox component.
 */

var UpsellBox = function (_React$Component) {
	_inherits(UpsellBox, _React$Component);

	/**
  * The constructor.
  *
  * @param {object} props The component props.
  *
  * @returns {void}
  */
	function UpsellBox(props) {
		_classCallCheck(this, UpsellBox);

		return _possibleConstructorReturn(this, (UpsellBox.__proto__ || Object.getPrototypeOf(UpsellBox)).call(this, props));
	}

	/**
  * Creates the HTML for the benefits list.
  *
  * @param {array} benefits The list of benefits to be rendered.
  *
  * @returns {*} HTML for the list of benefits.
  */


	_createClass(UpsellBox, [{
		key: "createBenefitsList",
		value: function createBenefitsList(benefits) {
			return benefits.length > 0 && yoast._wp.element.createElement(
				StyledList,
				{ role: "list" },
				benefits.map(function (benefit, index) {
					return yoast._wp.element.createElement(
						"li",
						{ key: index },
						yoast._wp.element.createElement("span", { "aria-hidden": "true" }),
						(0, _interpolateComponents2.default)({
							mixedString: benefit.replace("<strong>", "{{strong}}").replace("</strong>", "{{/strong}}"),
							components: { strong: yoast._wp.element.createElement("strong", null) }
						})
					);
				})
			);
		}

		/**
   * Creates the HTML for the info paragraphs.
   *
   * @param {array} paragraphs The paragraphs to be rendered.
   *
   * @returns {*} The HTML for the info paragraphs.
   */

	}, {
		key: "createInfoParagraphs",
		value: function createInfoParagraphs(paragraphs) {
			return paragraphs.map(function (paragraph, index) {
				return yoast._wp.element.createElement(
					"p",
					{ key: index },
					paragraph
				);
			});
		}

		/**
   * Renders a UpsellBox component.
   *
   * @returns {ReactElement} The rendered UpsellBox component.
   */

	}, {
		key: "render",
		value: function render() {
			return yoast._wp.element.createElement(
				"div",
				null,
				this.createInfoParagraphs(this.props.infoParagraphs),
				this.createBenefitsList(this.props.benefits),
				yoast._wp.element.createElement(
					UpsellButton,
					this.props.upsellButton,
					this.props.upsellButtonText
				),
				yoast._wp.element.createElement(
					ButtonLabel,
					{ id: this.props.upsellButton["aria-describedby"] },
					this.props.upsellButtonLabel
				)
			);
		}
	}]);

	return UpsellBox;
}(_react2.default.Component);

UpsellBox.propTypes = {
	benefits: _propTypes2.default.array,
	infoParagraphs: _propTypes2.default.array,
	upsellButton: _propTypes2.default.object,
	upsellButtonText: _propTypes2.default.string.isRequired,
	upsellButtonLabel: _propTypes2.default.string
};

UpsellBox.defaultProps = {
	infoParagraphs: [],
	benefits: [],
	upsellButton: {
		href: "",
		className: "button button-primary"
	},
	upsellButtonLabel: ""
};

exports.default = UpsellBox;

/***/ }),
/* 545 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__(5);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _yoastComponents = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StyledButton = _styledComponents2.default.button.withConfig({
	displayName: "Modal__StyledButton"
})(["&&{display:flex;align-items:center;}.yoast-svg-icon{margin:1px 7px 0 0;fill:currentColor;}"]);

var Modal = function (_React$Component) {
	_inherits(Modal, _React$Component);

	function Modal(props) {
		_classCallCheck(this, Modal);

		var _this = _possibleConstructorReturn(this, (Modal.__proto__ || Object.getPrototypeOf(Modal)).call(this, props));

		_this.state = {
			modalIsOpen: false
		};

		_this.openModal = _this.openModal.bind(_this);
		_this.closeModal = _this.closeModal.bind(_this);

		_this.appElement = document.querySelector(_this.props.appElement);
		return _this;
	}

	_createClass(Modal, [{
		key: "openModal",
		value: function openModal() {
			this.setState({
				modalIsOpen: true
			});
		}
	}, {
		key: "closeModal",
		value: function closeModal() {
			this.setState({
				modalIsOpen: false
			});
		}

		/**
   * Returns the rendered html.
   *
   * @returns {ReactElement} The rendered html.
   */

	}, {
		key: "render",
		value: function render() {
			return yoast._wp.element.createElement(
				_react2.default.Fragment,
				null,
				yoast._wp.element.createElement(
					StyledButton,
					{
						type: "button",
						onClick: this.openModal,
						className: this.props.classes.openButton + " yoast-modal__button-open"
					},
					this.props.openButtonIcon && yoast._wp.element.createElement(_yoastComponents.SvgIcon, { icon: this.props.openButtonIcon, size: "13px" }),
					this.props.labels.open
				),
				yoast._wp.element.createElement(
					_yoastComponents.YoastModal,
					{
						isOpen: this.state.modalIsOpen,
						onClose: this.closeModal,
						modalAriaLabel: this.props.labels.modalAriaLabel,
						appElement: this.appElement,
						heading: this.props.labels.heading,
						closeIconButton: this.props.labels.closeIconButton,
						closeIconButtonClassName: this.props.classes.closeIconButton,
						closeButton: this.props.labels.closeButton,
						closeButtonClassName: this.props.classes.closeButton
					},
					this.props.children
				)
			);
		}
	}]);

	return Modal;
}(_react2.default.Component);

Modal.propTypes = {
	className: _propTypes2.default.string,
	appElement: _propTypes2.default.string.isRequired,
	openButtonIcon: _propTypes2.default.string,
	labels: _propTypes2.default.object,
	classes: _propTypes2.default.object
};

exports.default = Modal;

/***/ }),
/* 546 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The Yoast SEO traffic light icon.
 *
 * @param {object} props The props object.
 *
 * @returns {ReactElement} The svg icon.
 */
var YoastSeoIcon = function YoastSeoIcon(props) {
	return _react2.default.createElement(
		"svg",
		_extends({}, props, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 500 488.22" }),
		_react2.default.createElement("path", { d: "M436.82 4.06A90 90 0 0 0 410 0H90A90 90 0 0 0 0 90v270a90 90 0 0 0 90 90h410V90a90 90 0 0 0-63.18-85.94z", fill: "#a4286a" }),
		_react2.default.createElement("path", { d: "M436.82 4.06L184.15 450H500V90a90 90 0 0 0-63.18-85.94z", fill: "#6c2548" }),
		_react2.default.createElement("path", { d: "M74.4 339.22v34.93c21.63-.85 38.51-8 52.84-22.46 14.76-14.83 27.45-38 39.93-72.85l92.53-248H215l-74.6 207.07-37.09-116.15h-41l54.42 139.79a57.49 57.49 0 0 1 0 41.84c-5.52 14.2-15.35 30.88-42.33 35.83z", fill: "#fff" }),
		_react2.default.createElement("circle", { cx: "368.33", cy: "124.68", r: "97.34", transform: "rotate(-45 368.335 124.68)", fill: "#9fda4f" }),
		_react2.default.createElement("path", { d: "M416.2 39.93l-95.74 169.51A97.34 97.34 0 1 0 416.2 39.93z", fill: "#77b227" }),
		_react2.default.createElement("path", { d: "M294.78 254.75l-.15-.08-.13-.07a63.6 63.6 0 0 0-62.56 110.76h.13a63.6 63.6 0 0 0 62.71-110.67z", fill: "#fec228" }),
		_react2.default.createElement("path", { d: "M294.5 254.59l-62.56 110.76a63.6 63.6 0 1 0 62.56-110.76z", fill: "#f49a00" }),
		_react2.default.createElement("path", { d: "M222.31 450.07A38.16 38.16 0 0 0 203 416.83a38.18 38.18 0 1 0 19.41 33.27z", fill: "#ff4e47" }),
		_react2.default.createElement("path", { d: "M202.9 416.8l-37.54 66.48a38.17 38.17 0 0 0 37.54-66.48z", fill: "#ed261f" })
	);
};

exports.default = YoastSeoIcon;

/***/ }),
/* 547 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = __webpack_require__(548);

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
/* 548 */
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
/* 549 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.mapEditorDataToPreview = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /* globals wpseoAdminL10n */


exports.mapStateToProps = mapStateToProps;
exports.mapDispatchToProps = mapDispatchToProps;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(74);

var _yoastComponents = __webpack_require__(9);

var _identity = __webpack_require__(66);

var _identity2 = _interopRequireDefault(_identity);

var _get = __webpack_require__(28);

var _get2 = _interopRequireDefault(_get);

var _i18n = __webpack_require__(8);

var _data = __webpack_require__(422);

var _yoastseo = __webpack_require__(70);

var _yoastseo2 = _interopRequireDefault(_yoastseo);

var _snippetEditor = __webpack_require__(61);

var _analysisData = __webpack_require__(527);

var _SnippetPreviewSection = __webpack_require__(503);

var _SnippetPreviewSection2 = _interopRequireDefault(_SnippetPreviewSection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var stripFullTags = _yoastseo2.default.string.stripHTMLTags;


var ExplanationLink = _yoastComponents.utils.makeOutboundLink();

/**
 * Runs the legacy replaceVariables function on the data in the snippet preview.
 *
 * @param {Object} data             The snippet preview data object.
 * @param {string} data.title       The snippet preview title.
 * @param {string} data.url         The snippet preview url: baseUrl with the slug.
 * @param {string} data.description The snippet preview description.
 *
 * @returns {Object} Returns the data object in which the placeholders have been replaced.
 */
var legacyReplaceUsingPlugin = function legacyReplaceUsingPlugin(data) {
	var replaceVariables = (0, _get2.default)(window, ["YoastSEO", "wp", "replaceVarsPlugin", "replaceVariables"], _identity2.default);

	return {
		url: data.url,
		title: stripFullTags(replaceVariables(data.title)),
		description: stripFullTags(replaceVariables(data.description))
	};
};

/**
 * Apply replaceVariables function on the data in the snippet preview.
 *
 * @param {Object} data             The snippet preview data object.
 * @param {string} data.title       The snippet preview title.
 * @param {string} data.url         The snippet preview url: baseUrl with the slug.
 * @param {string} data.description The snippet preview description.
 *
 * @returns {Object} Returns the data object in which the placeholders have been replaced.
 */
var applyReplaceUsingPlugin = function applyReplaceUsingPlugin(data) {
	// If we do not have pluggable loaded, apply just our own replace variables.
	var pluggable = (0, _get2.default)(window, ["YoastSEO", "app", "pluggable"], false);
	if (!pluggable || !(0, _get2.default)(window, ["YoastSEO", "app", "pluggable", "loaded"], false)) {
		return legacyReplaceUsingPlugin(data);
	}

	var applyModifications = pluggable._applyModifications.bind(pluggable);

	return {
		url: data.url,
		title: stripFullTags(applyModifications("data_page_title", data.title)),
		description: stripFullTags(applyModifications("data_meta_desc", data.description))
	};
};

/**
 * Process the snippet editor form data before it's being displayed in the snippet preview.
 *
 * @param {Object} data                     The snippet preview data object.
 * @param {string} data.title               The snippet preview title.
 * @param {string} data.url                 The snippet preview url: baseUrl with the slug.
 * @param {string} data.description         The snippet preview description.
 * @param {Object} context                  The context surrounding the snippet editor form data.
 * @param {string} context.shortenedBaseUrl The baseUrl of the snippet preview url.
 *
 * @returns {Object} The snippet preview data object.
 */
var mapEditorDataToPreview = exports.mapEditorDataToPreview = function mapEditorDataToPreview(data, context) {
	var baseUrlLength = 0;

	if (context.shortenedBaseUrl && typeof context.shortenedBaseUrl === "string") {
		baseUrlLength = context.shortenedBaseUrl.length;
	}

	// Replace whitespaces in the url with dashes.
	data.url = data.url.replace(/\s+/g, "-");
	if (data.url[data.url.length - 1] === "-") {
		data.url = data.url.slice(0, -1);
	}
	// If the first symbol after the baseUrl is a hyphen, remove that hyphen.
	// This hyphen is removed because it is usually the result of the regex replacing a space it shouldn't.
	if (data.url[baseUrlLength] === "-") {
		data.url = data.url.slice(0, baseUrlLength) + data.url.slice(baseUrlLength + 1);
	}

	return applyReplaceUsingPlugin(data);
};

var SnippetEditorWrapper = function SnippetEditorWrapper(props) {
	return yoast._wp.element.createElement(
		_react2.default.Fragment,
		null,
		yoast._wp.element.createElement(
			_yoastComponents.HelpText,
			null,
			(0, _i18n.__)("This is a rendering of what this post might look like in Google's search results.", "wordpress-seo") + " ",
			yoast._wp.element.createElement(
				ExplanationLink,
				{ href: wpseoAdminL10n["shortlinks.snippet_preview_info"], rel: null },
				(0, _i18n.__)("Learn more about the Snippet Preview.", "wordpress-seo")
			)
		),
		yoast._wp.element.createElement(
			_SnippetPreviewSection2.default,
			{
				icon: "eye",
				hasPaperStyle: props.hasPaperStyle
			},
			yoast._wp.element.createElement(_yoastComponents.SnippetEditor, _extends({}, props, {
				descriptionPlaceholder: (0, _i18n.__)("Please provide a meta description by editing the snippet below."),
				mapEditorDataToPreview: mapEditorDataToPreview
			}))
		)
	);
};

/**
 * Maps the redux state to the snippet editor component.
 *
 * @param {Object} state The current state.
 * @param {Object} state.snippetEditor The state for the snippet editor.
 *
 * @returns {Object} Data for the `SnippetEditor` component.
 */
function mapStateToProps(state) {
	var replacementVariables = state.snippetEditor.replacementVariables;

	// Replace all empty values with %%replaceVarName%% so the replacement variables plugin can do its job.
	replacementVariables.forEach(function (replaceVariable) {
		if (replaceVariable.value === "" && !["title", "excerpt", "excerpt_only"].includes(replaceVariable.name)) {
			replaceVariable.value = "%%" + replaceVariable.name + "%%";
		}
	});

	return _extends({}, state.snippetEditor, {
		keyword: state.focusKeyword,
		baseUrl: state.settings.snippetEditor.baseUrl,
		date: state.settings.snippetEditor.date,
		recommendedReplacementVariables: state.settings.snippetEditor.recommendedReplacementVariables
	});
}

/**
 * Maps dispatch function to props for the snippet editor component.
 *
 * @param {Function} dispatch The dispatch function that will dispatch a redux action.
 *
 * @returns {Object} Props for the `SnippetEditor` component.
 */
function mapDispatchToProps(dispatch) {
	return {
		onChange: function onChange(key, value) {
			var action = (0, _snippetEditor.updateData)(_defineProperty({}, key, value));

			if (key === "mode") {
				action = (0, _snippetEditor.switchMode)(value);
			}

			dispatch(action);

			/*
    * Update the gutenberg store with the new slug, after updating our own store,
    * to make sure our store isn't updated twice.
    */
			if (key === "slug") {
				var coreEditorDispatch = (0, _data.dispatch)("core/editor");
				if (coreEditorDispatch) {
					coreEditorDispatch.editPost({ slug: value });
				}
			}
		},
		onChangeAnalysisData: function onChangeAnalysisData(analysisData) {
			dispatch((0, _analysisData.updateAnalysisData)(analysisData));
		}
	};
}

exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(SnippetEditorWrapper);

/***/ }),
/* 550 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = MetaboxPortal;

var _components = __webpack_require__(143);

var _element = __webpack_require__(50);

var _Metabox = __webpack_require__(798);

var _Metabox2 = _interopRequireDefault(_Metabox);

var _sortComponentsByRenderPriority = __webpack_require__(551);

var _sortComponentsByRenderPriority2 = _interopRequireDefault(_sortComponentsByRenderPriority);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Renders the metabox portal.
 *
 * @param {string} target A target element ID in which to render the portal.
 * @param {Object} store  The Redux store.
 * @param {Object} theme  The theme to use.
 *
 * @returns {null|ReactElement} The element.
 */
function MetaboxPortal(_ref) {
	var target = _ref.target,
	    store = _ref.store,
	    theme = _ref.theme;

	var metaboxElement = document.getElementById(target);

	if (!metaboxElement) {
		return null;
	}

	return (0, _element.createPortal)(yoast._wp.element.createElement(
		_element.Fragment,
		null,
		yoast._wp.element.createElement(
			_components.Slot,
			{ name: "YoastMetabox" },
			function (fills) {
				return (0, _sortComponentsByRenderPriority2.default)(fills);
			}
		),
		yoast._wp.element.createElement(_Metabox2.default, { store: store, theme: theme })
	), metaboxElement);
}

/***/ }),
/* 551 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sortComponentsByRenderPriority;

var _flatten = __webpack_require__(314);

var _flatten2 = _interopRequireDefault(_flatten);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Sorts components by a prop `renderPriority`.
 *
 * The array is flattened before sorting to make sure that components inside of
 * a collection are also included. This is to allow sorting multiple fills of
 * which at least one includes an array of components.
 *
 * @param {ReactElement|array} components The component(s) to be sorted.
 *
 * @returns {ReactElement|array} The sorted component(s).
 */
function sortComponentsByRenderPriority(components) {
  if (typeof components.length === "undefined") {
    return components;
  }

  return (0, _flatten2.default)(components).sort(function (a, b) {
    if (typeof a.props.renderPriority === "undefined") {
      return 1;
    }
    return a.props.renderPriority - b.props.renderPriority;
  });
}

/***/ }),
/* 552 */
/***/ (function(module, exports, __webpack_require__) {

var baseHas = __webpack_require__(805),
    hasPath = __webpack_require__(232);

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


/***/ }),
/* 553 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(554);
module.exports = __webpack_require__(19).Object.keys;


/***/ }),
/* 554 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(151);
var $keys = __webpack_require__(150);

__webpack_require__(340)('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),
/* 555 */
/***/ (function(module, exports, __webpack_require__) {

var isArrayLike = __webpack_require__(30),
    isObjectLike = __webpack_require__(10);

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


/***/ }),
/* 556 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Updates the traffic light present on the page
 *
 * @param {Object} indicator The indicator for the keyword score.
 *
 * @returns {void}
 */
function updateTrafficLight(indicator) {
	var trafficLight = jQuery(".yst-traffic-light");
	var trafficLightLink = trafficLight.closest(".wpseo-meta-section-link");
	var trafficLightDesc = jQuery("#wpseo-traffic-light-desc");

	// Update the traffic light image.
	trafficLight.attr("class", "yst-traffic-light " + indicator.className);

	// Update the traffic light link.
	trafficLightLink.attr("aria-describedby", "wpseo-traffic-light-desc");

	if (trafficLightDesc.length > 0) {
		trafficLightDesc.text(indicator.screenReaderText);
	} else {
		trafficLightLink.closest("li").append("<span id='wpseo-traffic-light-desc' class='screen-reader-text'>" + indicator.screenReaderText + "</span>");
	}
}

module.exports = {
	update: updateTrafficLight
};

/***/ }),
/* 557 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Updates the traffic light present on the page
 *
 * @param {Object} indicator The indicator for the keyword score.
 *
 * @returns {void}
 */
function updateAdminBar(indicator) {
  jQuery(".adminbar-seo-score").attr("class", "wpseo-score-icon adminbar-seo-score " + indicator.className).find(".adminbar-seo-score-text").text(indicator.screenReaderText);
}

module.exports = {
  update: updateAdminBar
};

/***/ }),
/* 558 */
/***/ (function(module, exports, __webpack_require__) {

var baseAssignValue = __webpack_require__(111),
    eq = __webpack_require__(27);

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq(object[key], value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

module.exports = assignMergeValue;


/***/ }),
/* 559 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getContentLocale;

var _get = __webpack_require__(28);

var _get2 = _interopRequireDefault(_get);

var _getL10nObject = __webpack_require__(180);

var _getL10nObject2 = _interopRequireDefault(_getL10nObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Retrieves the content locale for the current page.
 *
 * @returns {string} The content locale. Defaults to en_US.
 */
// External dependencies.
function getContentLocale() {
  var l10nObject = (0, _getL10nObject2.default)();

  return (0, _get2.default)(l10nObject, "contentLocale", "en_US");
}

// Internal dependencies.

/***/ }),
/* 560 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = getTranslations;

var _get = __webpack_require__(28);

var _get2 = _interopRequireDefault(_get);

var _isUndefined = __webpack_require__(15);

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _getL10nObject = __webpack_require__(180);

var _getL10nObject2 = _interopRequireDefault(_getL10nObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Retrieves translations for YoastSEO.js for the current page, either term or post.
 *
 * @returns {Object} The translations object for the current page.
 */
function getTranslations() {
	var l10nObject = (0, _getL10nObject2.default)();

	// Retrieve the translations from the localization object.
	var translations = (0, _get2.default)(l10nObject, "translations", {
		domain: "js-text-analysis",
		locale_data: { // eslint-disable-line camelcase, yoast/comment-starting-capital
			"js-text-analysis": {
				"": {}
			}
		}
	});

	// Move the `wordpress-seo` translations domain to `js-text-analysis`.
	if (translations.domain === "wordpress-seo" && !(0, _isUndefined2.default)(translations.locale_data["wordpress-seo"])) {
		translations.domain = "js-text-analysis";
		translations.locale_data["js-text-analysis"] = translations.locale_data["wordpress-seo"];
		translations.locale_data["js-text-analysis"][""].domain = "js-text-analysis";
		delete translations.locale_data["wordpress-seo"];
	}

	return translations;
}

// Internal dependencies.
// External dependencies.

/***/ }),
/* 561 */,
/* 562 */,
/* 563 */,
/* 564 */,
/* 565 */,
/* 566 */,
/* 567 */,
/* 568 */,
/* 569 */,
/* 570 */,
/* 571 */,
/* 572 */,
/* 573 */,
/* 574 */,
/* 575 */,
/* 576 */,
/* 577 */,
/* 578 */,
/* 579 */,
/* 580 */,
/* 581 */,
/* 582 */,
/* 583 */,
/* 584 */,
/* 585 */,
/* 586 */,
/* 587 */,
/* 588 */,
/* 589 */,
/* 590 */,
/* 591 */,
/* 592 */,
/* 593 */,
/* 594 */,
/* 595 */,
/* 596 */,
/* 597 */,
/* 598 */,
/* 599 */,
/* 600 */,
/* 601 */,
/* 602 */,
/* 603 */,
/* 604 */,
/* 605 */,
/* 606 */,
/* 607 */,
/* 608 */,
/* 609 */,
/* 610 */,
/* 611 */,
/* 612 */,
/* 613 */,
/* 614 */,
/* 615 */,
/* 616 */,
/* 617 */,
/* 618 */,
/* 619 */,
/* 620 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* External dependencies */


/* Internal dependencies */


var _defaults = __webpack_require__(530);

var _defaults2 = _interopRequireDefault(_defaults);

var _noop = __webpack_require__(178);

var _noop2 = _interopRequireDefault(_noop);

var _diviHelper = __webpack_require__(789);

var _diviHelper2 = _interopRequireDefault(_diviHelper);

var _visualComposerHelper = __webpack_require__(790);

var _visualComposerHelper2 = _interopRequireDefault(_visualComposerHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULTS = {
	classicEditorHidden: _noop2.default,
	classicEditorShown: _noop2.default,
	pageBuilderLoaded: _noop2.default
};

/**
 * Adds support (compatibility) for Page builders.
 */

var CompatibilityHelper = function () {
	/**
  * The CompatibilityHelper constructor.
  *
  * Determines what (supported) page builder is active.
  */
	function CompatibilityHelper() {
		_classCallCheck(this, CompatibilityHelper);

		this.determineActivePageBuilders();
	}

	/**
  * Determines what supported page builder is active.
  *
  * @returns {void}
  */


	_createClass(CompatibilityHelper, [{
		key: "determineActivePageBuilders",
		value: function determineActivePageBuilders() {
			if (_diviHelper2.default.isActive()) {
				this.diviActive = true;
			}
			if (_visualComposerHelper2.default.isActive()) {
				this.vcActive = true;
			}
		}

		/**
   * Determines if a page builder is active.
   *
   * @returns {boolean} True whether a page is active.
   */

	}, {
		key: "isPageBuilderActive",
		value: function isPageBuilderActive() {
			return this.diviActive || this.vcActive;
		}

		/**
   * Initializes listeners for page builder events regarding the classic editor.
   *
   * @param {Object}   callbacks                     The listener callbacks.
   * @param {Function} callbacks.classicEditorHidden Callback called when TinyMCE is hidden.
   * @param {Function} callbacks.classicEditorShown  Callback called when TinyMCE is shown.
   *
   * @returns {void}
   */

	}, {
		key: "listen",
		value: function listen(callbacks) {
			this.callbacks = (0, _defaults2.default)(callbacks, DEFAULTS);

			if (this.diviActive) {
				var diviHelper = new _diviHelper2.default();
				diviHelper.listen(callbacks);
			}
		}

		/**
   * Returns whether the classic editor is hidden.
   *
   * @returns {boolean} Whether the classic editor is hidden.
   */

	}, {
		key: "isClassicEditorHidden",
		value: function isClassicEditorHidden() {
			return !!(this.diviActive && _diviHelper2.default.isTinyMCEHidden());
		}
	}]);

	return CompatibilityHelper;
}();

exports.default = CompatibilityHelper;

/***/ }),
/* 621 */,
/* 622 */,
/* 623 */,
/* 624 */,
/* 625 */,
/* 626 */,
/* 627 */,
/* 628 */,
/* 629 */,
/* 630 */,
/* 631 */,
/* 632 */,
/* 633 */,
/* 634 */,
/* 635 */,
/* 636 */,
/* 637 */,
/* 638 */,
/* 639 */,
/* 640 */,
/* 641 */,
/* 642 */,
/* 643 */,
/* 644 */,
/* 645 */,
/* 646 */,
/* 647 */,
/* 648 */,
/* 649 */,
/* 650 */,
/* 651 */,
/* 652 */,
/* 653 */,
/* 654 */,
/* 655 */,
/* 656 */,
/* 657 */,
/* 658 */,
/* 659 */,
/* 660 */,
/* 661 */,
/* 662 */,
/* 663 */,
/* 664 */,
/* 665 */,
/* 666 */,
/* 667 */,
/* 668 */,
/* 669 */,
/* 670 */,
/* 671 */,
/* 672 */,
/* 673 */,
/* 674 */,
/* 675 */,
/* 676 */,
/* 677 */,
/* 678 */,
/* 679 */,
/* 680 */,
/* 681 */,
/* 682 */,
/* 683 */,
/* 684 */,
/* 685 */,
/* 686 */,
/* 687 */,
/* 688 */,
/* 689 */,
/* 690 */,
/* 691 */,
/* 692 */,
/* 693 */,
/* 694 */,
/* 695 */,
/* 696 */,
/* 697 */,
/* 698 */,
/* 699 */,
/* 700 */,
/* 701 */,
/* 702 */,
/* 703 */,
/* 704 */,
/* 705 */,
/* 706 */,
/* 707 */,
/* 708 */,
/* 709 */,
/* 710 */,
/* 711 */,
/* 712 */,
/* 713 */,
/* 714 */,
/* 715 */,
/* 716 */,
/* 717 */,
/* 718 */,
/* 719 */,
/* 720 */,
/* 721 */,
/* 722 */,
/* 723 */,
/* 724 */,
/* 725 */,
/* 726 */,
/* 727 */,
/* 728 */,
/* 729 */,
/* 730 */,
/* 731 */,
/* 732 */,
/* 733 */,
/* 734 */,
/* 735 */,
/* 736 */,
/* 737 */,
/* 738 */,
/* 739 */,
/* 740 */,
/* 741 */,
/* 742 */,
/* 743 */,
/* 744 */,
/* 745 */,
/* 746 */,
/* 747 */,
/* 748 */,
/* 749 */,
/* 750 */,
/* 751 */,
/* 752 */,
/* 753 */,
/* 754 */,
/* 755 */,
/* 756 */,
/* 757 */,
/* 758 */,
/* 759 */,
/* 760 */,
/* 761 */,
/* 762 */,
/* 763 */,
/* 764 */,
/* 765 */,
/* 766 */,
/* 767 */,
/* 768 */,
/* 769 */,
/* 770 */,
/* 771 */,
/* 772 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var keys = Object.keys;

/**
 * Returns true if the two objects are shallow equal, or false otherwise.
 *
 * @param {Object} a First object to compare.
 * @param {Object} b Second object to compare.
 *
 * @return {Boolean} Whether the two objects are shallow equal.
 */
function isShallowEqualObjects(a, b) {
	var aKeys, bKeys, i, key;

	if (a === b) {
		return true;
	}

	aKeys = keys(a);
	bKeys = keys(b);

	if (aKeys.length !== bKeys.length) {
		return false;
	}

	i = 0;

	while (i < aKeys.length) {
		key = aKeys[i];
		if (a[key] !== b[key]) {
			return false;
		}

		i++;
	}

	return true;
};

module.exports = isShallowEqualObjects;

/***/ }),
/* 773 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global window process wp */
/* External dependencies */


/* Internal dependencies */


var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(74);

var _styledComponents = __webpack_require__(5);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _element = __webpack_require__(50);

var _components = __webpack_require__(143);

var _data = __webpack_require__(422);

var _get = __webpack_require__(28);

var _get2 = _interopRequireDefault(_get);

var _values = __webpack_require__(399);

var _values2 = _interopRequireDefault(_values);

var _pickBy = __webpack_require__(774);

var _pickBy2 = _interopRequireDefault(_pickBy);

var _noop = __webpack_require__(178);

var _noop2 = _interopRequireDefault(_noop);

var _data2 = __webpack_require__(777);

var _data3 = _interopRequireDefault(_data2);

var _reducers = __webpack_require__(778);

var _reducers2 = _interopRequireDefault(_reducers);

var _Yoast_icon_kader = __webpack_require__(787);

var _Yoast_icon_kader2 = _interopRequireDefault(_Yoast_icon_kader);

var _classicEditorData = __webpack_require__(788);

var _classicEditorData2 = _interopRequireDefault(_classicEditorData);

var _isGutenbergDataAvailable = __webpack_require__(533);

var _isGutenbergDataAvailable2 = _interopRequireDefault(_isGutenbergDataAvailable);

var _Sidebar = __webpack_require__(791);

var _Sidebar2 = _interopRequireDefault(_Sidebar);

var _MetaboxPortal = __webpack_require__(550);

var _MetaboxPortal2 = _interopRequireDefault(_MetaboxPortal);

var _sortComponentsByRenderPriority = __webpack_require__(551);

var _sortComponentsByRenderPriority2 = _interopRequireDefault(_sortComponentsByRenderPriority);

var _selectors = __webpack_require__(800);

var selectors = _interopRequireWildcard(_selectors);

var _actions = __webpack_require__(803);

var actions = _interopRequireWildcard(_actions);

var _settings = __webpack_require__(528);

var _usedKeywords = __webpack_require__(804);

var _usedKeywords2 = _interopRequireDefault(_usedKeywords);

var _PrimaryTaxonomyPicker = __webpack_require__(807);

var _PrimaryTaxonomyPicker2 = _interopRequireDefault(_PrimaryTaxonomyPicker);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PLUGIN_NAMESPACE = "yoast-seo";

var PinnedPluginIcon = (0, _styledComponents2.default)(_Yoast_icon_kader2.default).withConfig({
	displayName: "edit__PinnedPluginIcon"
})(["width:20px;height:20px;"]);

var Edit = function () {
	/**
  * @param {Object}   args                                 Edit initialize arguments.
  * @param {Function} args.onRefreshRequest                The function to refresh the analysis.
  * @param {Object}   args.replaceVars                     The replaceVars object.
  * @param {string}   args.snippetEditorBaseUrl            Base URL of the site the user is editing.
  * @param {string}   args.snippetEditorDate               The date for the snippet editor.
  * @param {array}    args.recommendedReplacementVariables The recommended replacement variables for this context.
  * @param {Object}   args.classicEditorDataSettings       Settings for the ClassicEditorData object.
  */
	function Edit(args) {
		_classCallCheck(this, Edit);

		this._localizedData = this.getLocalizedData();
		this._args = args;

		this._init();
	}

	/**
  * Get the localized data from the global namespace.
  *
  * @returns {Object} Localized data.
  */


	_createClass(Edit, [{
		key: "getLocalizedData",
		value: function getLocalizedData() {
			return window.wpseoPostScraperL10n || window.wpseoTermScraperL10n || { intl: {}, isRtl: false };
		}
	}, {
		key: "_init",
		value: function _init() {
			this._store = this._registerStoreInGutenberg();

			this._registerCategorySelectorFilter();

			this._registerPlugin();

			this._data = this._initializeData();

			this._store.dispatch((0, _settings.setSettings)({
				snippetEditor: {
					baseUrl: this._args.snippetEditorBaseUrl,
					date: this._args.snippetEditorDate,
					recommendedReplacementVariables: this._args.recommendedReplaceVars
				}
			}));
		}

		/**
   * Registers a redux store in Gutenberg.
   *
   * @returns {Object} The store.
   */

	}, {
		key: "_registerStoreInGutenberg",
		value: function _registerStoreInGutenberg() {
			return (0, _data.registerStore)("yoast-seo/editor", {
				reducer: (0, _data.combineReducers)(_reducers2.default),
				selectors: selectors,
				actions: (0, _pickBy2.default)(actions, function (x) {
					return typeof x === "function";
				})
			});
		}
	}, {
		key: "_registerCategorySelectorFilter",
		value: function _registerCategorySelectorFilter() {
			if (!(0, _isGutenbergDataAvailable2.default)()) {
				return;
			}

			var addFilter = (0, _get2.default)(window, "wp.hooks.addFilter", _noop2.default);

			var taxonomies = (0, _get2.default)(window.wpseoPrimaryCategoryL10n, "taxonomies", {});

			var primaryTaxonomies = (0, _values2.default)(taxonomies).map(function (taxonomy) {
				return taxonomy.name;
			});

			addFilter("editor.PostTaxonomyType", PLUGIN_NAMESPACE, function (OriginalComponent) {
				/**
     * A component that renders the PrimaryTaxonomyPicker under Gutenberg's
     * taxonomy picker if the taxonomy has primary term enabled.
     *
     * @param {Object} props      The component's props.
     * @param {string} props.slug The taxonomy's slug.
     *
     * @returns {ReactElement} Rendered TaxonomySelectorFilter component.
     */
				var TaxonomySelectorFilter = function TaxonomySelectorFilter(props) {
					if (!primaryTaxonomies.includes(props.slug)) {
						return yoast._wp.element.createElement(OriginalComponent, props);
					}

					var taxonomy = taxonomies[props.slug];

					return yoast._wp.element.createElement(
						_element.Fragment,
						null,
						yoast._wp.element.createElement(OriginalComponent, props),
						yoast._wp.element.createElement(_PrimaryTaxonomyPicker2.default, { taxonomy: taxonomy })
					);
				};
				return TaxonomySelectorFilter;
			});
		}

		/**
   * Registers the plugin into the gutenberg editor, creates a sidebar entry for the plugin,
   * and creates that sidebar's content.
   *
   * @returns {void}
   **/

	}, {
		key: "_registerPlugin",
		value: function _registerPlugin() {
			if (!(0, _isGutenbergDataAvailable2.default)()) {
				return;
			}

			var _wp$editPost = wp.editPost,
			    PluginSidebar = _wp$editPost.PluginSidebar,
			    PluginSidebarMoreMenuItem = _wp$editPost.PluginSidebarMoreMenuItem;
			var registerPlugin = wp.plugins.registerPlugin;

			var store = this._store;

			var theme = {
				isRtl: this._localizedData.isRtl
			};

			var YoastSidebar = function YoastSidebar() {
				return yoast._wp.element.createElement(
					_element.Fragment,
					null,
					yoast._wp.element.createElement(
						PluginSidebarMoreMenuItem,
						{
							target: "seo-sidebar",
							icon: yoast._wp.element.createElement(_Yoast_icon_kader2.default, null)
						},
						"Yoast SEO"
					),
					yoast._wp.element.createElement(
						PluginSidebar,
						{
							name: "seo-sidebar",
							title: "Yoast SEO"
						},
						yoast._wp.element.createElement(
							_components.Slot,
							{ name: "YoastSidebar" },
							function (fills) {
								return (0, _sortComponentsByRenderPriority2.default)(fills);
							}
						)
					),
					yoast._wp.element.createElement(
						_reactRedux.Provider,
						{ store: store },
						yoast._wp.element.createElement(
							_element.Fragment,
							null,
							yoast._wp.element.createElement(_Sidebar2.default, { store: store, theme: theme }),
							yoast._wp.element.createElement(_MetaboxPortal2.default, { target: "wpseo-metabox-root", store: store, theme: theme })
						)
					)
				);
			};

			registerPlugin(PLUGIN_NAMESPACE, {
				render: YoastSidebar,
				icon: yoast._wp.element.createElement(PinnedPluginIcon, null)
			});
		}

		/**
   * Initialize the appropriate data class.
   *
   * @returns {Object} The instantiated data class.
   */

	}, {
		key: "_initializeData",
		value: function _initializeData() {
			var store = this._store;
			var args = this._args;
			var wpData = (0, _get2.default)(window, "wp.data");

			// Only use Gutenberg's data if Gutenberg is available.
			if ((0, _isGutenbergDataAvailable2.default)()) {
				var gutenbergData = new _data3.default(wpData, args.onRefreshRequest, store);
				gutenbergData.initialize(args.replaceVars);
				return gutenbergData;
			}

			var classicEditorData = new _classicEditorData2.default(args.onRefreshRequest, store, args.classicEditorDataSettings);
			classicEditorData.initialize(args.replaceVars);
			return classicEditorData;
		}

		/**
   * Initialize used keyword analysis.
   *
   * @param {App}    app        YoastSEO.js app.
   * @param {string} ajaxAction The ajax action to use when retrieving the used keywords data.
   *
   * @returns {void}
   */

	}, {
		key: "initializeUsedKeywords",
		value: function initializeUsedKeywords(app, ajaxAction) {
			var store = this._store;
			var localizedData = this._localizedData;
			var scriptUrl = (0, _get2.default)(global, ["wpseoAnalysisWorkerL10n", "keywords_assessment_url"], "wp-seo-used-keywords-assessment.js");

			var usedKeywords = new _usedKeywords2.default(ajaxAction, localizedData, app, scriptUrl);
			usedKeywords.init();

			var lastData = {};
			store.subscribe(function () {
				var state = store.getState() || {};
				if (state.focusKeyword === lastData.focusKeyword) {
					return;
				}
				lastData = state;
				usedKeywords.setKeyword(state.focusKeyword);
			});
		}

		/**
   * Returns the store.
   *
   * @returns {Object} The redux store.
   */

	}, {
		key: "getStore",
		value: function getStore() {
			return this._store;
		}

		/**
   * Returns the data object.
   *
   * @returns {Object} The data object.
   */

	}, {
		key: "getData",
		value: function getData() {
			return this._data;
		}
	}]);

	return Edit;
}();

exports.default = Edit;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 774 */
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(44),
    baseIteratee = __webpack_require__(198),
    basePickBy = __webpack_require__(775),
    getAllKeysIn = __webpack_require__(176);

/**
 * Creates an object composed of the `object` properties `predicate` returns
 * truthy for. The predicate is invoked with two arguments: (value, key).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The source object.
 * @param {Function} [predicate=_.identity] The function invoked per property.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pickBy(object, _.isNumber);
 * // => { 'a': 1, 'c': 3 }
 */
function pickBy(object, predicate) {
  if (object == null) {
    return {};
  }
  var props = arrayMap(getAllKeysIn(object), function(prop) {
    return [prop];
  });
  predicate = baseIteratee(predicate);
  return basePickBy(object, props, function(value, path) {
    return predicate(value, path[0]);
  });
}

module.exports = pickBy;


/***/ }),
/* 775 */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(53),
    baseSet = __webpack_require__(776),
    castPath = __webpack_require__(32);

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


/***/ }),
/* 776 */
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(110),
    castPath = __webpack_require__(32),
    isIndex = __webpack_require__(85),
    isObject = __webpack_require__(7),
    toKey = __webpack_require__(24);

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


/***/ }),
/* 777 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _debounce = __webpack_require__(179);

var _debounce2 = _interopRequireDefault(_debounce);

var _snippetEditor = __webpack_require__(61);

var _replacementVariableHelpers = __webpack_require__(305);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Represents the data.
 */
var Data = function () {
	/**
  * Sets the wp data, Yoast SEO refresh function and data object.
  *
  * @param {Object} wpData    The Gutenberg data API.
  * @param {Function} refresh The YoastSEO refresh function.
  * @param {Object} store     The YoastSEO Redux store.
  * @returns {void}
  */
	function Data(wpData, refresh, store) {
		_classCallCheck(this, Data);

		this._wpData = wpData;
		this._refresh = refresh;
		this._store = store;
		this._data = {};
		this.getPostAttribute = this.getPostAttribute.bind(this);
		this.refreshYoastSEO = this.refreshYoastSEO.bind(this);
	}

	_createClass(Data, [{
		key: "initialize",
		value: function initialize(replaceVars) {
			// Fill data object on page load.
			this._data = this.getInitialData(replaceVars);
			(0, _replacementVariableHelpers.fillReplacementVariables)(this._data, this._store);
			this.subscribeToGutenberg();
		}
	}, {
		key: "getInitialData",
		value: function getInitialData(replaceVars) {
			var gutenbergData = this.collectGutenbergData(this.getPostAttribute);

			// Custom_fields and custom_taxonomies are objects instead of strings, which causes console errors.
			replaceVars = (0, _replacementVariableHelpers.mapCustomFields)(replaceVars, this._store);
			replaceVars = (0, _replacementVariableHelpers.mapCustomTaxonomies)(replaceVars, this._store);

			return _extends({}, replaceVars, gutenbergData);
		}

		/**
   * Sets the refresh function.
   *
   * @param {Function} refresh The refresh function.
   *
   * @returns {void}
   */

	}, {
		key: "setRefresh",
		value: function setRefresh(refresh) {
			this._refresh = refresh;
		}

		/**
   * Checks whether the current data and the Gutenberg data are the same.
   *
   * @param {Object} currentData The current data.
   * @param {Object} gutenbergData The data from Gutenberg.
   * @returns {boolean} Whether the current data and the gutenbergData is the same.
   */

	}, {
		key: "isShallowEqual",
		value: function isShallowEqual(currentData, gutenbergData) {
			if (Object.keys(currentData).length !== Object.keys(gutenbergData).length) {
				return false;
			}

			for (var dataPoint in currentData) {
				if (currentData.hasOwnProperty(dataPoint)) {
					if (!(dataPoint in gutenbergData) || currentData[dataPoint] !== gutenbergData[dataPoint]) {
						return false;
					}
				}
			}
			return true;
		}

		/**
   * Retrieves the Gutenberg data for the passed post attribute.
   *
   * @param {string} attribute The post attribute you'd like to retrieve.
   *
   * @returns {string} The post attribute.
   */

	}, {
		key: "getPostAttribute",
		value: function getPostAttribute(attribute) {
			if (!this._coreEditorSelect) {
				this._coreEditorSelect = this._wpData.select("core/editor");
			}

			return this._coreEditorSelect.getEditedPostAttribute(attribute);
		}

		/**
   * Get the post's slug.
   *
   * @returns {string} The post's slug.
   */

	}, {
		key: "getSlug",
		value: function getSlug() {
			/**
    * Before the post has been saved for the first time, the generated_slug is "auto-draft".
    *
    * Before the post is saved the post status is "auto-draft", so when this is the case the slug
    * should be empty.
    */
			if (this.getPostAttribute("status") === "auto-draft") {
				return "";
			}

			var generatedSlug = this.getPostAttribute("generated_slug");

			/**
    * This should be removed when the following issue is resolved:
    *
    * https://github.com/WordPress/gutenberg/issues/8770
    */
			if (generatedSlug === "auto-draft") {
				generatedSlug = "";
			}

			// When no custom slug is provided we should use the generated_slug attribute.
			return this.getPostAttribute("slug") || generatedSlug;
		}

		/**
   * Collects the content, title, slug and excerpt of a post from Gutenberg.
   *
   * @returns {{content: string, title: string, slug: string, excerpt: string}} The content, title, slug and excerpt.
   */

	}, {
		key: "collectGutenbergData",
		value: function collectGutenbergData() {
			return {
				content: this.getPostAttribute("content"),
				title: this.getPostAttribute("title"),
				slug: this.getSlug(),
				excerpt: this.getPostAttribute("excerpt")
			};
		}

		/**
   * Updates the redux store with the changed data.
   *
   * @param {Object} newData The changed data.
   *
   * @returns {void}
   */

	}, {
		key: "handleEditorChange",
		value: function handleEditorChange(newData) {
			// Handle title change
			if (this._data.title !== newData.title) {
				this._store.dispatch((0, _snippetEditor.updateReplacementVariable)("title", newData.title));
			}
			// Handle excerpt change
			if (this._data.excerpt !== newData.excerpt) {
				this._store.dispatch((0, _snippetEditor.updateReplacementVariable)("excerpt", newData.excerpt));
				this._store.dispatch((0, _snippetEditor.updateReplacementVariable)("excerpt_only", newData.excerpt));
			}
			// Handle slug change
			if (this._data.slug !== newData.slug) {
				this._store.dispatch((0, _snippetEditor.updateData)({ slug: newData.slug }));
			}
		}

		/**
   * Refreshes YoastSEO's app when the Gutenberg data is dirty.
   *
   * @returns {void}
   */

	}, {
		key: "refreshYoastSEO",
		value: function refreshYoastSEO() {
			var gutenbergData = this.collectGutenbergData();

			// Set isDirty to true if the current data and Gutenberg data are unequal.
			var isDirty = !this.isShallowEqual(this._data, gutenbergData);

			if (isDirty) {
				this.handleEditorChange(gutenbergData);
				this._data = gutenbergData;
				this._refresh();
			}
		}

		/**
   * Listens to the Gutenberg data.
   *
   * @returns {void}
   */

	}, {
		key: "subscribeToGutenberg",
		value: function subscribeToGutenberg() {
			this.subscriber = (0, _debounce2.default)(this.refreshYoastSEO, 500);
			this._wpData.subscribe(this.subscriber);
		}

		/**
   * Returns the data and whether the data is dirty.
   *
   * @returns {Object} The data and whether the data is dirty.
   */

	}, {
		key: "getData",
		value: function getData() {
			return this._data;
		}
	}]);

	return Data;
}();

module.exports = Data;

/***/ }),
/* 778 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _yoastComponents = __webpack_require__(9);

var _cornerstoneContent = __webpack_require__(779);

var _cornerstoneContent2 = _interopRequireDefault(_cornerstoneContent);

var _focusKeyword = __webpack_require__(780);

var _focusKeyword2 = _interopRequireDefault(_focusKeyword);

var _markerButtons = __webpack_require__(781);

var _markerButtons2 = _interopRequireDefault(_markerButtons);

var _snippetEditor = __webpack_require__(504);

var _snippetEditor2 = _interopRequireDefault(_snippetEditor);

var _analysisData = __webpack_require__(782);

var _analysisData2 = _interopRequireDefault(_analysisData);

var _preferences = __webpack_require__(783);

var _preferences2 = _interopRequireDefault(_preferences);

var _settings = __webpack_require__(785);

var _settings2 = _interopRequireDefault(_settings);

var _primaryTaxonomies = __webpack_require__(786);

var _primaryTaxonomies2 = _interopRequireDefault(_primaryTaxonomies);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
	analysis: _yoastComponents.analysis,
	isCornerstone: _cornerstoneContent2.default,
	focusKeyword: _focusKeyword2.default,
	marksButtonStatus: _markerButtons2.default,
	snippetEditor: _snippetEditor2.default,
	analysisData: _analysisData2.default,
	preferences: _preferences2.default,
	settings: _settings2.default,
	primaryTaxonomies: _primaryTaxonomies2.default
};

/***/ }),
/* 779 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _cornerstoneContent = __webpack_require__(349);

var INITIAL_STATE = false;

/**
 * A reducer for the active keyword.
 *
 * @param {boolean} state The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {boolean} The state.
 */
function cornerstoneContentReducer() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
	var action = arguments[1];

	switch (action.type) {
		case _cornerstoneContent.TOGGLE_CORNERSTONE_CONTENT:
			return !state;

		case _cornerstoneContent.SET_CORNERSTONE_CONTENT:
			return action.isCornerstone;

		default:
			return state;
	}
}

exports.default = cornerstoneContentReducer;

/***/ }),
/* 780 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _focusKeyword = __webpack_require__(319);

var INITIAL_STATE = "";

/**
 * A reducer for the focus keyword.
 *
 * @param {string} state The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {string} The state.
 */
function focusKeywordReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
  var action = arguments[1];

  switch (action.type) {
    case _focusKeyword.SET_FOCUS_KEYWORD:
      return action.keyword;
    default:
      return state;
  }
}

exports.default = focusKeywordReducer;

/***/ }),
/* 781 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _markerButtons = __webpack_require__(350);

var INITIAL_STATE = null;

/**
 * Sets the marker status.
 *
 * @param {Object} state The state.
 * @param {Object} action The action.
 *
 * @returns {Object} The SEO results per keyword.
 */
function setMarkerStatus(state, action) {
  return action.marksButtonStatus;
}

/**
 * A reducer for the active keyword.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The received action .
 *
 * @returns {Object} The state.
 */
function markerStatusReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
  var action = arguments[1];

  switch (action.type) {
    case _markerButtons.SET_MARKER_STATUS:
      return setMarkerStatus(state, action);
    default:
      return state;
  }
}

exports.default = markerStatusReducer;

/***/ }),
/* 782 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _analysisData = __webpack_require__(527);

var INITIAL_STATE = {
	snippet: {}
};

/**
 * Reduces the dispatched action for the snippet editor state.
 *
 * @param {Object} state The current state.
 * @param {Object} action The action that was just dispatched.
 *
 * @returns {Object} The new state.
 */
function analysisDataReducer() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
	var action = arguments[1];

	switch (action.type) {
		case _analysisData.UPDATE_SNIPPET_DATA:
			return _extends({}, state, {
				snippet: action.data
			});
	}
	return state;
}

exports.default = analysisDataReducer;

/***/ }),
/* 783 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isUndefined = __webpack_require__(15);

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _isContentAnalysisActive = __webpack_require__(423);

var _isContentAnalysisActive2 = _interopRequireDefault(_isContentAnalysisActive);

var _isKeywordAnalysisActive = __webpack_require__(320);

var _isKeywordAnalysisActive2 = _interopRequireDefault(_isKeywordAnalysisActive);

var _isCornerstoneContentActive = __webpack_require__(784);

var _isCornerstoneContentActive2 = _interopRequireDefault(_isCornerstoneContentActive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets the default state.
 *
 * @returns {Object} The default state.
 */
function getDefaultState() {
  return {
    isContentAnalysisActive: (0, _isContentAnalysisActive2.default)(),
    isKeywordAnalysisActive: (0, _isKeywordAnalysisActive2.default)(),
    isCornerstoneActive: (0, _isCornerstoneContentActive2.default)() && (0, _isUndefined2.default)(window.wpseoTermScraperL10n),
    shouldUpsell: (0, _isUndefined2.default)(window.wpseoPremiumMetaboxData) && (0, _isUndefined2.default)(window.wpseoTermScraperL10n)
  };
}

/**
 * A reducer for the preferences.
 *
 * @param {Object} state  The current state of the object.
 *
 * @returns {Object} The state.
 */
function preferencesReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getDefaultState();

  return state;
}

exports.default = preferencesReducer;

/***/ }),
/* 784 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getL10nObject = __webpack_require__(180);

var isUndefined = __webpack_require__(15);

/**
 * Returns whether or not the cornerstone content is active
 *
 * @returns {boolean} Whether or not the cornerstone content is active.
 */
function isCornerstoneContentActive() {
  var l10nObject = getL10nObject();

  return !isUndefined(l10nObject) && l10nObject.cornerstoneActive === "1";
}

module.exports = isCornerstoneContentActive;

/***/ }),
/* 785 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = settingsReducer;

var _settings = __webpack_require__(528);

/**
 * A reducer for settings.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The state.
 */
function settingsReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  if (action.type === _settings.SET_SETTINGS) {
    return action.settings;
  }

  return state;
}

/***/ }),
/* 786 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _primaryTaxonomies = __webpack_require__(529);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var INITIAL_STATE = {};

/**
 * A reducer for the primary taxonomies.
 *
 * @param {string} state The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {string} The state.
 */
function focusKeywordReducer() {
	var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
	var action = arguments[1];

	switch (action.type) {
		case _primaryTaxonomies.SET_PRIMARY_TAXONOMY:
			return _extends({}, state, _defineProperty({}, action.taxonomy, action.termId));
		default:
			return state;
	}
}

exports.default = focusKeywordReducer;

/***/ }),
/* 787 */
/***/ (function(module, exports, __webpack_require__) {

var React = __webpack_require__(0);

function YoastIconKader (props) {
    return React.createElement("svg",props,[React.createElement("title",{"key":0},"Yoast_icon_kader"),React.createElement("path",{"d":"M73 405.26a66.79 66.79 0 0 1-6.54-1.7 64.75 64.75 0 0 1-6.28-2.31c-1-.42-2-.89-3-1.37-1.49-.72-3-1.56-4.77-2.56-1.5-.88-2.71-1.64-3.83-2.39-.9-.61-1.8-1.26-2.68-1.92a70.154 70.154 0 0 1-5.08-4.19 69.21 69.21 0 0 1-8.4-9.17c-.92-1.2-1.68-2.25-2.35-3.24a70.747 70.747 0 0 1-3.44-5.64 68.29 68.29 0 0 1-8.29-32.55V142.13a68.26 68.26 0 0 1 8.29-32.55c1-1.92 2.21-3.82 3.44-5.64s2.55-3.58 4-5.27a69.26 69.26 0 0 1 14.49-13.25C50.37 84.19 52.27 83 54.2 82A67.59 67.59 0 0 1 73 75.09a68.75 68.75 0 0 1 13.75-1.39h169.66L263 55.39H86.75A86.84 86.84 0 0 0 0 142.13v196.09A86.84 86.84 0 0 0 86.75 425h11.32v-18.35H86.75A68.75 68.75 0 0 1 73 405.26zM368.55 60.85l-1.41-.53-6.41 17.18 1.41.53a68.06 68.06 0 0 1 8.66 4c1.93 1 3.82 2.2 5.65 3.43A69.19 69.19 0 0 1 391 98.67c1.4 1.68 2.72 3.46 3.95 5.27s2.39 3.72 3.44 5.64a68.29 68.29 0 0 1 8.29 32.55v264.52H233.55l-.44.76c-3.07 5.37-6.26 10.48-9.49 15.19L222 425h203V142.13a87.2 87.2 0 0 0-56.45-81.28z","key":1}),React.createElement("path",{"d":"M119.8 408.28v46c28.49-1.12 50.73-10.6 69.61-29.58 19.45-19.55 36.17-50 52.61-96L363.94 1.9H305l-98.25 272.89-48.86-153h-54l71.7 184.18a75.67 75.67 0 0 1 0 55.12c-7.3 18.68-20.25 40.66-55.79 47.19z","stroke":"#000","strokeMiterlimit":"10","strokeWidth":"3.81","key":2})]);
}

YoastIconKader.displayName = "YoastIconKader";

YoastIconKader.defaultProps = {"viewBox":"0 0 425 456.27"};

module.exports = YoastIconKader;

YoastIconKader.default = YoastIconKader;


/***/ }),
/* 788 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* External dependencies */


var _yoastseo = __webpack_require__(70);

var _yoastseo2 = _interopRequireDefault(_yoastseo);

var _snippetEditor = __webpack_require__(61);

var _replacementVariableHelpers = __webpack_require__(305);

var _wpSeoTinymce = __webpack_require__(321);

var _wpSeoTinymce2 = _interopRequireDefault(_wpSeoTinymce);

var _debounce = __webpack_require__(179);

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var removeMarks = _yoastseo2.default.markers.removeMarks;

/* Internal dependencies */

/**
 * Represents the classic editor data.
 */
var ClassicEditorData = function () {
	/**
  * Sets the wp data, Yoast SEO refresh function and data object.
  *
  * @param {Function} refresh          The YoastSEO refresh function.
  * @param {Object} store              The YoastSEO Redux store.
  * @param {Object} settings           The settings for this classic editor data
  *                                    object.
  * @param {string} settings.tinyMceId The ID of the tinyMCE editor.
  *
  * @returns {void}
  */
	function ClassicEditorData(refresh, store) {
		var settings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { tinyMceId: "" };

		_classCallCheck(this, ClassicEditorData);

		this._refresh = refresh;
		this._store = store;
		this._data = {};
		// This will be used for the comparison whether the title, description and slug are dirty.
		this._previousData = {};
		this._settings = settings;
		this.updateReplacementData = this.updateReplacementData.bind(this);
		this.refreshYoastSEO = this.refreshYoastSEO.bind(this);
	}

	/**
  * Initializes the class by filling this._data and subscribing to relevant elements.
  *
  * @param {Object} replaceVars The replacement variables passed in the wp-seo-post-scraper args.
  *
  * @returns {void}
  */


	_createClass(ClassicEditorData, [{
		key: "initialize",
		value: function initialize(replaceVars) {
			this._data = this.getInitialData(replaceVars);
			(0, _replacementVariableHelpers.fillReplacementVariables)(this._data, this._store);
			this.subscribeToElements();
			this.subscribeToStore();
		}

		/**
   * Gets the title from the document.
   *
   * @returns {string} The title or an empty string.
   */

	}, {
		key: "getTitle",
		value: function getTitle() {
			var titleElement = document.getElementById("title");
			return titleElement && titleElement.value || "";
		}

		/**
   * Gets the excerpt from the document.
   *
   * @returns {string} The excerpt or an empty string.
   */

	}, {
		key: "getExcerpt",
		value: function getExcerpt() {
			var excerptElement = document.getElementById("excerpt");
			return excerptElement && excerptElement.value || "";
		}

		/**
   * Gets the slug from the document.
   *
   * @returns {string} The slug or an empty string.
   */

	}, {
		key: "getSlug",
		value: function getSlug() {
			var slug = "";

			var newPostSlug = document.getElementById("new-post-slug");

			if (newPostSlug) {
				slug = newPostSlug.value;
			} else if (document.getElementById("editable-post-name-full") !== null) {
				slug = document.getElementById("editable-post-name-full").textContent;
			}

			return slug;
		}

		/**
   * Gets the content of the document after removing marks.
   *
   * @returns {string} The content of the document.
   */

	}, {
		key: "getContent",
		value: function getContent() {
			var tinyMceId = this._settings.tinyMceId;

			if (tinyMceId === "") {
				tinyMceId = _wpSeoTinymce.tmceId;
			}

			return removeMarks(_wpSeoTinymce2.default.getContentTinyMce(tinyMceId));
		}

		/**
   * Subscribes to input elements.
   *
   * @returns {void}
   */

	}, {
		key: "subscribeToElements",
		value: function subscribeToElements() {
			this.subscribeToInputElement("title", "title");
			this.subscribeToInputElement("excerpt", "excerpt");
			this.subscribeToInputElement("excerpt", "excerpt_only");
		}

		/**
   * Subscribes to an element via its id, and sets a callback.
   *
   * @param {string}  elementId       The id of the element to subscribe to.
   * @param {string}  targetField     The name of the field the value should be sent to.
   *
   * @returns {void}
   */

	}, {
		key: "subscribeToInputElement",
		value: function subscribeToInputElement(elementId, targetField) {
			var _this = this;

			var element = document.getElementById(elementId);

			/*
    * On terms some elements don't exist in the DOM, such as the title element.
    * We return early if the element was not found.
    */
			if (!element) {
				return;
			}

			element.addEventListener("input", function (event) {
				_this.updateReplacementData(event, targetField);
			});
		}

		/**
   * Sets the event target value in the data and dispatches to the store.
   *
   * @param {Object} event            An event object.
   * @param {string} targetReplaceVar The replacevar the event's value belongs to.
   *
   * @returns {void}
   */

	}, {
		key: "updateReplacementData",
		value: function updateReplacementData(event, targetReplaceVar) {
			var replaceValue = event.target.value;
			this._data[targetReplaceVar] = replaceValue;
			this._store.dispatch((0, _snippetEditor.updateReplacementVariable)(targetReplaceVar, replaceValue));
		}

		/**
   * Checks whether the current data and the data from the updated state are the same.
   *
   * @param {Object} currentData The current data.
   * @param {Object} newData     The data from the updated state.
   * @returns {boolean}          Whether the current data and the newData is the same.
   */

	}, {
		key: "isShallowEqual",
		value: function isShallowEqual(currentData, newData) {
			if (Object.keys(currentData).length !== Object.keys(newData).length) {
				return false;
			}

			for (var dataPoint in currentData) {
				if (currentData.hasOwnProperty(dataPoint)) {
					if (!(dataPoint in newData) || currentData[dataPoint] !== newData[dataPoint]) {
						return false;
					}
				}
			}
			return true;
		}

		/**
   * Refreshes YoastSEO's app when the data is dirty.
   *
   * @returns {void}
   */

	}, {
		key: "refreshYoastSEO",
		value: function refreshYoastSEO() {
			var newData = this._store.getState().snippetEditor.data;

			// Set isDirty to true if the current data and Gutenberg data are unequal.
			var isDirty = !this.isShallowEqual(this._previousData, newData);

			if (isDirty) {
				this._previousData = newData;
				if (window.YoastSEO && window.YoastSEO.app) {
					window.YoastSEO.app.refresh();
				}
			}
		}

		/**
   * Listens to the store.
   *
   * @returns {void}
   */

	}, {
		key: "subscribeToStore",
		value: function subscribeToStore() {
			this.subscriber = (0, _debounce2.default)(this.refreshYoastSEO, 500);
			this._store.subscribe(this.subscriber);
		}

		/**
   * Gets the initial data from the replacevars and document.
   *
   * @param {Object} replaceVars The replaceVars object.
   *
   * @returns {Object} The data.
   */

	}, {
		key: "getInitialData",
		value: function getInitialData(replaceVars) {
			replaceVars = (0, _replacementVariableHelpers.mapCustomFields)(replaceVars, this._store);
			replaceVars = (0, _replacementVariableHelpers.mapCustomTaxonomies)(replaceVars, this._store);
			return _extends({}, replaceVars, {
				title: this.getTitle(),
				excerpt: this.getExcerpt(),
				// eslint-disable-next-line
				excerpt_only: this.getExcerpt(),
				slug: this.getSlug(),
				content: this.getContent()
			});
		}

		/**
   * Add the latest content to the data object, and return the data object.
   *
   * @returns {Object} The data.
   */

	}, {
		key: "getData",
		value: function getData() {
			this._data.content = this.getContent();

			return this._data;
		}
	}]);

	return ClassicEditorData;
}();

module.exports = ClassicEditorData;

/***/ }),
/* 789 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _forEach = __webpack_require__(98);

var _forEach2 = _interopRequireDefault(_forEach);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DIVI_EDITOR_WRAPPER_ID = "et_pb_main_editor_wrap";
var DIVI_CLASSIC_EDITOR_HIDDEN_CLASS = "et_pb_hidden";

var DiviHelper = function () {
	function DiviHelper() {
		_classCallCheck(this, DiviHelper);
	}

	_createClass(DiviHelper, [{
		key: "listen",


		/**
   * Listen for changes to the TinyMCE editor when the Divi page builder is active.
   *
   * @param {Object}   callbacks                     The listener callbacks.
   * @param {Function} callbacks.classicEditorHidden Callback called when TinyMCE is hidden.
   * @param {Function} callbacks.classicEditorShown  Callback called when TinyMCE is shown.
   *
   * @returns {void}
   */
		value: function listen(callbacks) {
			this.classicEditorContainer = document.getElementById(DIVI_EDITOR_WRAPPER_ID);
			if (!this.classicEditorContainer) {
				return;
			}
			var observer = new MutationObserver(function (mutationsList) {
				(0, _forEach2.default)(mutationsList, function (mutation) {
					if (mutation.type === "attributes" && mutation.attributeName === "class") {
						if (mutation.target.classList.contains("et_pb_hidden")) {
							callbacks.classicEditorHidden();
						} else {
							callbacks.classicEditorShown();
						}
					}
				});
			});
			observer.observe(this.classicEditorContainer, {
				attributes: true
			});
		}
	}], [{
		key: "isActive",

		/**
   * Checks whether the Divi page builder is active on the page.
   *
   * @returns {boolean} Whether the Divi page buyilder is active.
   */
		value: function isActive() {
			return !!document.getElementById(DIVI_EDITOR_WRAPPER_ID);
		}

		/**
   * Checks whether the classic editor is hidden when the Divi page builder is active.
   *
   * @returns {boolean} Whether the TinyMCE editor is hidden.
   */

	}, {
		key: "isTinyMCEHidden",
		value: function isTinyMCEHidden() {
			var classicEditorContainer = document.getElementById(DIVI_EDITOR_WRAPPER_ID);
			if (!classicEditorContainer) {
				return false;
			}
			return classicEditorContainer.classList.contains(DIVI_CLASSIC_EDITOR_HIDDEN_CLASS);
		}
	}]);

	return DiviHelper;
}();

exports.default = DiviHelper;

/***/ }),
/* 790 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VisualComposerHelper = function () {
	function VisualComposerHelper() {
		_classCallCheck(this, VisualComposerHelper);
	}

	_createClass(VisualComposerHelper, null, [{
		key: "isActive",
		value: function isActive() {
			return !!window.VCV_I18N;
		}
	}]);

	return VisualComposerHelper;
}();

exports.default = VisualComposerHelper;

/***/ }),
/* 791 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Sidebar = __webpack_require__(792);

var _Sidebar2 = _interopRequireDefault(_Sidebar);

var _reactRedux = __webpack_require__(74);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Maps the state to props.
 *
 * @param {Object} state The Redux state.
 * @param {Object} ownProps The props passed.
 *
 * @returns {Object} The props for the Sidebar component.
 */
function mapStateToProps(state, ownProps) {
  return {
    settings: state.preferences,
    store: ownProps.store
  };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps)(_Sidebar2.default);

/***/ }),
/* 792 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = Sidebar;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = __webpack_require__(74);

var _styledComponents = __webpack_require__(5);

var _element = __webpack_require__(50);

var _components = __webpack_require__(143);

var _SidebarItem = __webpack_require__(534);

var _SidebarItem2 = _interopRequireDefault(_SidebarItem);

var _ReadabilityAnalysis = __webpack_require__(535);

var _ReadabilityAnalysis2 = _interopRequireDefault(_ReadabilityAnalysis);

var _CollapsibleCornerstone = __webpack_require__(538);

var _CollapsibleCornerstone2 = _interopRequireDefault(_CollapsibleCornerstone);

var _SeoAnalysis = __webpack_require__(539);

var _SeoAnalysis2 = _interopRequireDefault(_SeoAnalysis);

var _SnippetPreviewModal = __webpack_require__(797);

var _SnippetPreviewModal2 = _interopRequireDefault(_SnippetPreviewModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates the Sidebar component.
 *
 * @param {Object} settings The feature toggles.
 * @param {Object} store    The Redux store.
 * @param {Object} theme    The theme to use.
 *
 * @returns {ReactElement} The Sidebar component.
 *
 * @constructor
 */
function Sidebar(_ref) {
	var settings = _ref.settings,
	    store = _ref.store,
	    theme = _ref.theme;

	return yoast._wp.element.createElement(
		_element.Fragment,
		null,
		yoast._wp.element.createElement(
			_components.Fill,
			{ name: "YoastSidebar" },
			yoast._wp.element.createElement(
				_SidebarItem2.default,
				{ renderPriority: 5 },
				yoast._wp.element.createElement(
					_styledComponents.ThemeProvider,
					{ theme: theme },
					yoast._wp.element.createElement(
						_reactRedux.Provider,
						{ store: store },
						yoast._wp.element.createElement(_SnippetPreviewModal2.default, null)
					)
				)
			),
			settings.isContentAnalysisActive && yoast._wp.element.createElement(
				_SidebarItem2.default,
				{ renderPriority: 10 },
				yoast._wp.element.createElement(
					_styledComponents.ThemeProvider,
					{ theme: theme },
					yoast._wp.element.createElement(
						_reactRedux.Provider,
						{ store: store },
						yoast._wp.element.createElement(_ReadabilityAnalysis2.default, null)
					)
				)
			),
			settings.isKeywordAnalysisActive && yoast._wp.element.createElement(
				_SidebarItem2.default,
				{ renderPriority: 20 },
				yoast._wp.element.createElement(
					_styledComponents.ThemeProvider,
					{ theme: theme },
					yoast._wp.element.createElement(
						_reactRedux.Provider,
						{ store: store },
						yoast._wp.element.createElement(_SeoAnalysis2.default, {
							shouldUpsell: settings.shouldUpsell,
							location: "sidebar"
						})
					)
				)
			),
			settings.isCornerstoneActive && yoast._wp.element.createElement(
				_SidebarItem2.default,
				{ renderPriority: 30 },
				yoast._wp.element.createElement(
					_styledComponents.ThemeProvider,
					{ theme: theme },
					yoast._wp.element.createElement(
						_reactRedux.Provider,
						{ store: store },
						yoast._wp.element.createElement(_CollapsibleCornerstone2.default, null)
					)
				)
			)
		)
	);
}

Sidebar.propTypes = {
	settings: _propTypes2.default.object,
	store: _propTypes2.default.object,
	theme: _propTypes2.default.object
};

/***/ }),
/* 793 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /* External dependencies */


var withYoastSidebarPriority = function withYoastSidebarPriority(WrappedComponent) {
	var YoastSidebarPriority = function YoastSidebarPriority(props) {
		var renderPriority = props.renderPriority,
		    otherProps = _objectWithoutProperties(props, ["renderPriority"]);

		return yoast._wp.element.createElement(WrappedComponent, otherProps);
	};
	YoastSidebarPriority.propTypes = {
		renderPriority: _propTypes2.default.number
	};
	return YoastSidebarPriority;
};

exports.default = withYoastSidebarPriority;

/***/ }),
/* 794 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = CollapsibleCornerstone;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _i18n = __webpack_require__(8);

var _yoastComponents = __webpack_require__(9);

var _SidebarCollapsible = __webpack_require__(323);

var _SidebarCollapsible2 = _interopRequireDefault(_SidebarCollapsible);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* globals wpseoAdminL10n */
var LearnMoreLink = _yoastComponents.utils.makeOutboundLink();

/**
 * Renders the collapsible cornerstone toggle.
 *
 * @returns {ReactElement} The collapsible cornerstone toggle component.
 * @constructor
 */
function CollapsibleCornerstone(_ref) {
	var isCornerstone = _ref.isCornerstone,
	    onChange = _ref.onChange;

	return yoast._wp.element.createElement(
		_SidebarCollapsible2.default,
		{ title: (0, _i18n.__)("Cornerstone content", "wordpress-seo") },
		yoast._wp.element.createElement(
			_yoastComponents.HelpText,
			null,
			(0, _i18n.__)("Cornerstone content should be the most important and extensive articles on your site.", "wordpress-seo") + " ",
			yoast._wp.element.createElement(
				LearnMoreLink,
				{ href: wpseoAdminL10n["shortlinks.cornerstone_content_info"], rel: null },
				(0, _i18n.__)("Learn more about Cornerstone Content.", "wordpress-seo")
			)
		),
		yoast._wp.element.createElement(_yoastComponents.CornerstoneToggle, {
			isEnabled: isCornerstone,
			onToggle: onChange
		})
	);
}

CollapsibleCornerstone.propTypes = {
	isCornerstone: _propTypes2.default.bool,
	onChange: _propTypes2.default.func
};

/***/ }),
/* 795 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _interpolateComponents = __webpack_require__(158);

var _interpolateComponents2 = _interopRequireDefault(_interpolateComponents);

var _i18n = __webpack_require__(8);

var _yoastComponents = __webpack_require__(9);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _UpsellBox = __webpack_require__(544);

var _UpsellBox2 = _interopRequireDefault(_UpsellBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var makeOutboundLink = _yoastComponents.utils.makeOutboundLink;

var PremiumLandingPageLink = makeOutboundLink();

/**
 * Creates the content for a keyword synonyms upsell modal.
 *
 * @param {Object} props The props for the component.
 *
 * @returns {ReactElement} The Keyword Synonyms upsell component.
 */
var KeywordSynonyms = function KeywordSynonyms(props) {
	var intro = (0, _i18n.sprintf)(
	/* translators: %s expands to a 'Yoast SEO Premium' text linked to the yoast.com website. */
	(0, _i18n.__)("Great news: you can, with %s!", "wordpress-seo"), "{{link}}Yoast SEO Premium{{/link}}");

	var interpolated = (0, _interpolateComponents2.default)({
		mixedString: intro,
		components: { link: yoast._wp.element.createElement(PremiumLandingPageLink, { href: props.link }) }
	});

	var benefits = ["<strong>" + (0, _i18n.__)("Rank for up to 5 focus keywords per page", "wordpress-seo") + "</strong>", (0, _i18n.sprintf)(
	/* translators: %1$s expands to a 'strong' start tag, %2$s to a 'strong' end tag. */
	(0, _i18n.__)("%1$sNo more dead links%2$s: easy redirect manager", "wordpress-seo"), "<strong>", "</strong>"), "<strong>" + (0, _i18n.__)("Superfast internal links suggestions", "wordpress-seo") + "</strong>", (0, _i18n.sprintf)(
	/* translators: %1$s expands to a 'strong' start tag, %2$s to a 'strong' end tag. */
	(0, _i18n.__)("%1$sSocial media preview%2$s: Facebook & Twitter", "wordpress-seo"), "<strong>", "</strong>"), "<strong>" + (0, _i18n.__)("24/7 support", "wordpress-seo") + "</strong>", "<strong>" + (0, _i18n.__)("No ads!", "wordpress-seo") + "</strong>"];

	var otherBenefits = (0, _i18n.sprintf)(
	/* translators: %s expands to 'Yoast SEO Premium'. */
	(0, _i18n.__)("Other benefits of %s for you:", "wordpress-seo"), "Yoast SEO Premium");

	return yoast._wp.element.createElement(_UpsellBox2.default, {
		infoParagraphs: [interpolated, otherBenefits],
		benefits: benefits,
		upsellButtonText: (0, _i18n.sprintf)(
		/* translators: %s expands to 'Yoast SEO Premium'. */
		(0, _i18n.__)("Get %s now!", "wordpress-seo"), "Yoast SEO Premium"),
		upsellButton: {
			href: props.buyLink,
			className: "button button-primary",
			rel: null
		},
		upsellButtonLabel: (0, _i18n.__)("1 year free updates and upgrades included!", "wordpress-seo")
	});
};

KeywordSynonyms.propTypes = {
	link: _propTypes2.default.string.isRequired,
	buyLink: _propTypes2.default.string.isRequired
};

exports.default = KeywordSynonyms;

/***/ }),
/* 796 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _interpolateComponents = __webpack_require__(158);

var _interpolateComponents2 = _interopRequireDefault(_interpolateComponents);

var _yoastComponents = __webpack_require__(9);

var _i18n = __webpack_require__(8);

var _UpsellBox = __webpack_require__(544);

var _UpsellBox2 = _interopRequireDefault(_UpsellBox);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var makeOutboundLink = _yoastComponents.utils.makeOutboundLink;


var PremiumLandingPageLink = makeOutboundLink();

/**
 * Creates the content for a Multiple Keywords upsell modal.
 *
 * @param {Object} props The props for the component.
 *
 * @returns {ReactElement} The Multiple Keywords upsell component.
 */
var MultipleKeywords = function MultipleKeywords(props) {
	var intro = (0, _i18n.sprintf)(
	/* translators: %1$s expands to a 'Yoast SEO Premium' text linked to the yoast.com website. */
	(0, _i18n.__)("Great news: you can, with %1$s!", "wordpress-seo"), "{{link}}Yoast SEO Premium{{/link}}");

	var benefits = [(0, _i18n.sprintf)(
	/* translators: %1$s expands to a 'strong' start tag, %2$s to a 'strong' end tag. */
	(0, _i18n.__)("%1$sNo more dead links%2$s: easy redirect manager", "wordpress-seo"), "<strong>", "</strong>"), "<strong>" + (0, _i18n.__)("Superfast internal links suggestions", "wordpress-seo") + "</strong>", (0, _i18n.sprintf)(
	/* translators: %1$s expands to a 'strong' start tag, %2$s to a 'strong' end tag. */
	(0, _i18n.__)("%1$sSocial media preview%2$s: Facebook & Twitter", "wordpress-seo"), "<strong>", "</strong>"), "<strong>" + (0, _i18n.__)("24/7 support", "wordpress-seo") + "</strong>", "<strong>" + (0, _i18n.__)("No ads!", "wordpress-seo") + "</strong>"];

	// Interpolate links
	var interpolated = (0, _interpolateComponents2.default)({
		mixedString: intro,
		components: { link: yoast._wp.element.createElement(PremiumLandingPageLink, { href: props.link }) }
	});

	var otherBenefits = (0, _i18n.sprintf)(
	/* translators: %s expands to 'Yoast SEO Premium'. */
	(0, _i18n.__)("Other benefits of %s for you:", "wordpress-seo"), "Yoast SEO Premium");

	return yoast._wp.element.createElement(_UpsellBox2.default, {
		infoParagraphs: [interpolated, otherBenefits],
		benefits: benefits,
		upsellButtonText: (0, _i18n.sprintf)(
		/* translators: %s expands to 'Yoast SEO Premium'. */
		(0, _i18n.__)("Get %s now!", "wordpress-seo"), "Yoast SEO Premium"),
		upsellButton: {
			href: props.buyLink,
			className: "button button-primary",
			rel: null
		},
		upsellButtonLabel: (0, _i18n.__)("1 year free updates and upgrades included!", "wordpress-seo")
	});
};

MultipleKeywords.propTypes = {
	link: _propTypes2.default.string.isRequired,
	buyLink: _propTypes2.default.string.isRequired
};

exports.default = MultipleKeywords;

/***/ }),
/* 797 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _yoastComponents = __webpack_require__(9);

var _components = __webpack_require__(143);

var _i18n = __webpack_require__(8);

var _SnippetEditor = __webpack_require__(549);

var _SnippetEditor2 = _interopRequireDefault(_SnippetEditor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SnippetPreviewModal = function (_React$Component) {
	_inherits(SnippetPreviewModal, _React$Component);

	function SnippetPreviewModal(props) {
		_classCallCheck(this, SnippetPreviewModal);

		var _this = _possibleConstructorReturn(this, (SnippetPreviewModal.__proto__ || Object.getPrototypeOf(SnippetPreviewModal)).call(this, props));

		_this.state = {
			isOpen: false
		};

		_this.openModal = _this.openModal.bind(_this);
		_this.closeModal = _this.closeModal.bind(_this);
		return _this;
	}

	_createClass(SnippetPreviewModal, [{
		key: "openModal",
		value: function openModal() {
			this.setState({ isOpen: true });
		}
	}, {
		key: "closeModal",
		value: function closeModal() {
			this.setState({ isOpen: false });
		}
	}, {
		key: "render",
		value: function render() {
			return yoast._wp.element.createElement(
				_react2.default.Fragment,
				null,
				yoast._wp.element.createElement(_yoastComponents.ButtonSection, _extends({
					title: (0, _i18n.__)("Snippet preview", "wordpress-seo"),
					suffixIcon: { size: "20px", icon: "pencil-square" },
					hasSeparator: true,
					onClick: this.openModal
				}, this.props)),
				this.state.isOpen && yoast._wp.element.createElement(
					_components.Modal,
					{
						title: (0, _i18n.__)("Snippet preview", "wordpress-seo"),
						style: { height: "initial", minHeight: "50px" },
						onRequestClose: this.closeModal },
					yoast._wp.element.createElement(_SnippetEditor2.default, { showCloseButton: false, hasPaperStyle: false }),
					yoast._wp.element.createElement(
						_components.Button,
						{ isDefault: true, onClick: this.closeModal },
						(0, _i18n.__)("Close", "wordpress-seo")
					)
				)
			);
		}
	}]);

	return SnippetPreviewModal;
}(_react2.default.Component);

exports.default = SnippetPreviewModal;

/***/ }),
/* 798 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Metabox = __webpack_require__(799);

var _Metabox2 = _interopRequireDefault(_Metabox);

var _reactRedux = __webpack_require__(74);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Maps the state to props.
 *
 * @param {Object} state The Redux state.
 * @param {Object} ownProps The props passed.
 *
 * @returns {Object} The props for the Metabox component.
 */
function mapStateToProps(state, ownProps) {
  return {
    settings: state.preferences,
    store: ownProps.store
  };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps)(_Metabox2.default);

/***/ }),
/* 799 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = Metabox;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = __webpack_require__(74);

var _styledComponents = __webpack_require__(5);

var _element = __webpack_require__(50);

var _components = __webpack_require__(143);

var _SidebarItem = __webpack_require__(534);

var _SidebarItem2 = _interopRequireDefault(_SidebarItem);

var _SnippetEditor = __webpack_require__(549);

var _SnippetEditor2 = _interopRequireDefault(_SnippetEditor);

var _SeoAnalysis = __webpack_require__(539);

var _SeoAnalysis2 = _interopRequireDefault(_SeoAnalysis);

var _ReadabilityAnalysis = __webpack_require__(535);

var _ReadabilityAnalysis2 = _interopRequireDefault(_ReadabilityAnalysis);

var _CollapsibleCornerstone = __webpack_require__(538);

var _CollapsibleCornerstone2 = _interopRequireDefault(_CollapsibleCornerstone);

var _i18n = __webpack_require__(8);

var _SidebarCollapsible = __webpack_require__(323);

var _SidebarCollapsible2 = _interopRequireDefault(_SidebarCollapsible);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates the Metabox component.
 *
 * @param {Object} settings The feature toggles.
 * @param {Object} store    The Redux store.
 * @param {Object} theme    The theme to use.
 *
 * @returns {ReactElement} The Metabox component.
 */
function Metabox(_ref) {
	var settings = _ref.settings,
	    store = _ref.store,
	    theme = _ref.theme;

	return yoast._wp.element.createElement(
		_element.Fragment,
		null,
		yoast._wp.element.createElement(
			_components.Fill,
			{ name: "YoastMetabox" },
			yoast._wp.element.createElement(
				_SidebarItem2.default,
				{ renderPriority: 9 },
				yoast._wp.element.createElement(
					_styledComponents.ThemeProvider,
					{ theme: theme },
					yoast._wp.element.createElement(
						_reactRedux.Provider,
						{ store: store },
						yoast._wp.element.createElement(
							_SidebarCollapsible2.default,
							{ title: (0, _i18n.__)("Snippet Preview", "wordpress-seo"), initialIsOpen: true },
							yoast._wp.element.createElement(_SnippetEditor2.default, { hasPaperStyle: false })
						)
					)
				)
			),
			settings.isContentAnalysisActive && yoast._wp.element.createElement(
				_SidebarItem2.default,
				{ renderPriority: 10 },
				yoast._wp.element.createElement(
					_styledComponents.ThemeProvider,
					{ theme: theme },
					yoast._wp.element.createElement(
						_reactRedux.Provider,
						{ store: store },
						yoast._wp.element.createElement(_ReadabilityAnalysis2.default, null)
					)
				)
			),
			settings.isKeywordAnalysisActive && yoast._wp.element.createElement(
				_SidebarItem2.default,
				{ renderPriority: 20 },
				yoast._wp.element.createElement(
					_styledComponents.ThemeProvider,
					{ theme: theme },
					yoast._wp.element.createElement(
						_reactRedux.Provider,
						{ store: store },
						yoast._wp.element.createElement(_SeoAnalysis2.default, {
							shouldUpsell: settings.shouldUpsell,
							location: "metabox"
						})
					)
				)
			),
			settings.isCornerstoneActive && yoast._wp.element.createElement(
				_SidebarItem2.default,
				{ renderPriority: 30 },
				yoast._wp.element.createElement(
					_styledComponents.ThemeProvider,
					{ theme: theme },
					yoast._wp.element.createElement(
						_reactRedux.Provider,
						{ store: store },
						yoast._wp.element.createElement(_CollapsibleCornerstone2.default, null)
					)
				)
			)
		)
	);
}

Metabox.propTypes = {
	settings: _propTypes2.default.object,
	store: _propTypes2.default.object,
	theme: _propTypes2.default.object
};

/***/ }),
/* 800 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _results = __webpack_require__(801);

Object.keys(_results).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _results[key];
    }
  });
});

var _primaryTaxonomies = __webpack_require__(802);

Object.keys(_primaryTaxonomies).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _primaryTaxonomies[key];
    }
  });
});

/***/ }),
/* 801 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSeoResults = getSeoResults;
exports.getResultsForKeyword = getResultsForKeyword;
exports.getMarkButtonStatus = getMarkButtonStatus;

var _get = __webpack_require__(28);

var _get2 = _interopRequireDefault(_get);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets the SEO results.
 *
 * @param {Object} state The state.
 * @returns {Object} The SEO results.
 */
function getSeoResults(state) {
  return (0, _get2.default)(state, ["analysis", "seo"], {});
}

/**
 * Gets the SEO results for a specific keywords.
 *
 * @param {Object} state The state.
 * @param {string} keyword The keyword to get the results for.
 * @returns {Array} The SEO results for the keyword.
 */
function getResultsForKeyword(state, keyword) {
  var seoResults = getSeoResults(state);

  return (0, _get2.default)(seoResults, keyword, []);
}

/**
 * Returns the marks button status.
 *
 * @param {object} state The state.
 *
 * @returns {string} The status of the mark buttons.
 */
function getMarkButtonStatus(state) {
  return state.marksButtonStatus;
}

/***/ }),
/* 802 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPrimaryTaxonomyId = getPrimaryTaxonomyId;
/**
 * Gets the primary taxonomy term id for the give taxonomy.
 *
 * @param {Object} state    The state.
 * @param {string} taxonomy The primary taxonomy to retrieve.
 *
 * @returns {number} Primary taxonomy term id.
 */
function getPrimaryTaxonomyId(state, taxonomy) {
  return state.primaryTaxonomies[taxonomy];
}

/***/ }),
/* 803 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _focusKeyword = __webpack_require__(319);

Object.keys(_focusKeyword).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _focusKeyword[key];
    }
  });
});

var _cornerstoneContent = __webpack_require__(349);

Object.keys(_cornerstoneContent).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _cornerstoneContent[key];
    }
  });
});

var _markerButtons = __webpack_require__(350);

Object.keys(_markerButtons).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _markerButtons[key];
    }
  });
});

var _primaryTaxonomies = __webpack_require__(529);

Object.keys(_primaryTaxonomies).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _primaryTaxonomies[key];
    }
  });
});

var _snippetEditor = __webpack_require__(61);

Object.keys(_snippetEditor).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _snippetEditor[key];
    }
  });
});

/***/ }),
/* 804 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _has = __webpack_require__(552);

var _has2 = _interopRequireDefault(_has);

var _debounce = __webpack_require__(179);

var _debounce2 = _interopRequireDefault(_debounce);

var _isArray = __webpack_require__(3);

var _isArray2 = _interopRequireDefault(_isArray);

var _isEqual = __webpack_require__(806);

var _isEqual2 = _interopRequireDefault(_isEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global jQuery, ajaxurl */

var $ = jQuery;

/**
 * Object that handles keeping track if the current keyword has been used before and retrieves this usage from the
 * server.
 *
 * @param {string} ajaxAction The ajax action to use when retrieving the used keywords data.
 * @param {Object} options The options for the used keywords assessment plugin.
 * @param {Object} options.keyword_usage An object that contains the keyword usage when instantiating.
 * @param {Object} options.search_url The URL to link the user to if the keyword has been used multiple times.
 * @param {Object} options.post_edit_url The URL to link the user to if the keyword has been used a single time.
 * @param {App} app The app for which to keep track of the used keywords.
 * @param {string} scriptUrl The URL to the used keywords assessment script.
 *
 * @returns {void}
 */
function UsedKeywords(ajaxAction, options, app, scriptUrl) {
	this._scriptUrl = scriptUrl;
	this._options = {
		usedKeywords: options.keyword_usage,
		searchUrl: options.search_url,
		postUrl: options.post_edit_url
	};
	this._keywordUsage = options.keyword_usage;
	this._postID = $("#post_ID, [name=tag_ID]").val();
	this._taxonomy = $("[name=taxonomy]").val() || "";
	this._ajaxAction = ajaxAction;
	this._app = app;
	this._initialized = false;
}

/**
 * Initializes everything necessary for used keywords
 *
 * @returns {void}
 */
UsedKeywords.prototype.init = function () {
	var _this = this;

	var worker = window.YoastSEO.analysis.worker;


	this.requestKeywordUsage = (0, _debounce2.default)(this.requestKeywordUsage.bind(this), 500);

	worker.loadScript(this._scriptUrl).then(function () {
		worker.sendMessage("initialize", _this._options, "used-keywords-assessment");
	}).then(function () {
		_this._initialized = true;

		if ((0, _isEqual2.default)(_this._options.usedKeywords, _this._keywordUsage)) {
			_this._app.refresh();
			return;
		}

		worker.sendMessage("updateKeywordUsage", _this._keywordUsage, "used-keywords-assessment").then(function () {
			return _this._app.refresh();
		});
	}).catch(function (error) {
		return console.error(error);
	});
};

/**
 * Handles an event of the keyword input field
 *
 * @param {string} keyword The keyword to request the usage for.
 *
 * @returns {void}
 */
UsedKeywords.prototype.setKeyword = function (keyword) {
	if (!(0, _has2.default)(this._keywordUsage, keyword)) {
		this.requestKeywordUsage(keyword);
	}
};

/**
 * Request keyword usage from the server
 *
 * @param {string} keyword The keyword to request the usage for.
 *
 * @returns {void}
 */
UsedKeywords.prototype.requestKeywordUsage = function (keyword) {
	$.post(ajaxurl, {
		action: this._ajaxAction,
		post_id: this._postID,
		keyword: keyword,
		taxonomy: this._taxonomy
	}, this.updateKeywordUsage.bind(this, keyword), "json");
};

/**
 * Updates the keyword usage based on the response of the ajax request
 *
 * @param {string} keyword The keyword for which the usage was requested.
 * @param {*} response The response retrieved from the server.
 *
 * @returns {void}
 */
UsedKeywords.prototype.updateKeywordUsage = function (keyword, response) {
	var _this2 = this;

	var worker = window.YoastSEO.analysis.worker;


	if (response && (0, _isArray2.default)(response)) {
		this._keywordUsage[keyword] = response;

		if (this._initialized) {
			worker.sendMessage("updateKeywordUsage", this._keywordUsage, "used-keywords-assessment").then(function () {
				return _this2._app.refresh();
			});
		}
	}
};

module.exports = UsedKeywords;

/***/ }),
/* 805 */
/***/ (function(module, exports) {

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


/***/ }),
/* 806 */
/***/ (function(module, exports, __webpack_require__) {

var baseIsEqual = __webpack_require__(109);

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


/***/ }),
/* 807 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _data = __webpack_require__(422);

var _compose = __webpack_require__(808);

var _i18n = __webpack_require__(8);

var _styledComponents = __webpack_require__(5);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _difference = __webpack_require__(823);

var _difference2 = _interopRequireDefault(_difference);

var _TaxonomyPicker = __webpack_require__(827);

var _TaxonomyPicker2 = _interopRequireDefault(_TaxonomyPicker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global wp */
/* External dependencies */


/* Internal dependencies */


var PrimaryTaxonomyPickerLabel = _styledComponents2.default.label.withConfig({
	displayName: "PrimaryTaxonomyPicker__PrimaryTaxonomyPickerLabel"
})(["padding-top:16px;"]);

/**
 * A component for selecting a primary taxonomy term.
 */

var PrimaryTaxonomyPicker = function (_React$Component) {
	_inherits(PrimaryTaxonomyPicker, _React$Component);

	function PrimaryTaxonomyPicker(props) {
		_classCallCheck(this, PrimaryTaxonomyPicker);

		var _this = _possibleConstructorReturn(this, (PrimaryTaxonomyPicker.__proto__ || Object.getPrototypeOf(PrimaryTaxonomyPicker)).call(this, props));

		_this.onChange = _this.onChange.bind(_this);
		_this.updateReplacementVariable = _this.updateReplacementVariable.bind(_this);

		var _props$taxonomy = props.taxonomy,
		    fieldId = _props$taxonomy.fieldId,
		    name = _props$taxonomy.name;

		_this.input = document.getElementById(fieldId);
		props.setPrimaryTaxonomyId(name, parseInt(_this.input.value, 10));

		_this.state = {
			selectedTerms: [],
			terms: []
		};
		return _this;
	}

	/**
  * Fetches the terms for the given taxonomy.
  *
  * @returns {void}
  */


	_createClass(PrimaryTaxonomyPicker, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			this.fetchTerms();
		}

		/**
   * Handle prop changes when needed.
   *
   * @param {Object} prevProps The previous props.
   * @param {Object} prevState The previous state.
   *
   * @returns {void}
   */

	}, {
		key: "componentDidUpdate",
		value: function componentDidUpdate(prevProps, prevState) {
			// Check if a term has been added and retrieve new terms if so.
			if (prevProps.selectedTermIds.length < this.props.selectedTermIds.length) {
				var newId = (0, _difference2.default)(this.props.selectedTermIds, prevProps.selectedTermIds)[0];
				if (!this.termIsAvailable(newId)) {
					this.fetchTerms();
					return;
				}
			}
			// Check if the selected terms have changed.
			if (prevProps.selectedTermIds !== this.props.selectedTermIds) {
				this.updateSelectedTerms(this.state.terms, this.props.selectedTermIds);
			}
			// Handle terms change.
			if (prevState.selectedTerms !== this.state.selectedTerms) {
				this.handleSelectedTermsChange();
			}
		}

		/**
   * Checks if the current value still has a corresponding option, and if not changes
   * the value to the first term's id.
   *
   * @returns {void}
   */

	}, {
		key: "handleSelectedTermsChange",
		value: function handleSelectedTermsChange() {
			var selectedTerms = this.state.selectedTerms;
			var primaryTaxonomyId = this.props.primaryTaxonomyId;

			var selectedTerm = selectedTerms.find(function (term) {
				return term.id === primaryTaxonomyId;
			});
			if (!selectedTerm) {
				/**
     * If the selected term is no longer available, set the primary term id to
     * the first term, and to -1 if no term is available.
    	 */
				this.onChange(selectedTerms.length ? selectedTerms[0].id : -1);
			}
		}

		/**
   * Determines whether the term with the given id is among the retrieved terms.
   *
   * @param {number} termId The term's id.
   *
   * @returns {boolean} Whther the term is available.
   */

	}, {
		key: "termIsAvailable",
		value: function termIsAvailable(termId) {
			return !!this.state.terms.find(function (term) {
				return term.id === termId;
			});
		}

		/**
   * Fetches the terms from the WordPress API.
   *
   * @returns {void}
   */

	}, {
		key: "fetchTerms",
		value: function fetchTerms() {
			var _this2 = this;

			var TaxonomyCollection = wp.api.getCollectionByRoute("/wp/v2/" + this.props.taxonomy.restBase);
			if (!TaxonomyCollection) {
				return;
			}
			var collection = new TaxonomyCollection();
			collection.fetch({
				data: {
					per_page: -1,
					orderby: "count",
					order: "desc",
					_fields: ["id", "name"]
				}
			}).then(function (terms) {
				var oldState = _this2.state;
				_this2.setState({
					terms: terms,
					selectedTerms: _this2.getSelectedTerms(terms, _this2.props.selectedTermIds)
				}, function () {
					if (oldState.terms.length === 0 && _this2.state.terms.length > 0) {
						_this2.updateReplacementVariable(_this2.props.primaryTaxonomyId);
					}
				});
			});
		}

		/**
   * Determines what terms are selected.
   *
   * @param {Array} terms           The available terms.
   * @param {Array} selectedTermIds The ids of the selected terms.
   *
   * @returns {Array} The selected terms.
   */

	}, {
		key: "getSelectedTerms",
		value: function getSelectedTerms(terms, selectedTermIds) {
			return terms.filter(function (term) {
				return selectedTermIds.includes(term.id);
			});
		}

		/**
   * Updates the state with the selected terms.
   *
   * @param {Array} terms           The available terms.
   * @param {Array} selectedTermIds The ids of the selected terms.
   *
   * @returns {void}
   */

	}, {
		key: "updateSelectedTerms",
		value: function updateSelectedTerms(terms, selectedTermIds) {
			var selectedTerms = this.getSelectedTerms(terms, selectedTermIds);
			this.setState({
				selectedTerms: selectedTerms
			});
		}

		/**
   * Handles an onChange event.
   *
   * Updates the primary taxonomy in the store, as well as the replacement variable and the hidden field.
   *
   * @param {number} termId The term's id.
   *
   * @returns {void}
   */

	}, {
		key: "onChange",
		value: function onChange(termId) {
			var name = this.props.taxonomy.name;


			this.updateReplacementVariable(termId);

			this.props.setPrimaryTaxonomyId(name, termId);

			this.input.value = termId === -1 ? "" : termId;
		}

		/**
   * Updates the primary taxonomy replacement variable.
   *
   * @param {number} termId The term's id.
   *
   * @returns {void}
   */

	}, {
		key: "updateReplacementVariable",
		value: function updateReplacementVariable(termId) {
			/**
    * We only use the primary category replacement variable, therefore only do this for the
    * category taxonomy.
    */
			if (this.props.taxonomy.name !== "category") {
				return;
			}
			var primaryTerm = this.state.selectedTerms.find(function (term) {
				return term.id === termId;
			});
			this.props.updateReplacementVariable("primary_" + this.props.taxonomy.name, primaryTerm ? primaryTerm.name : "");
		}

		/**
   * Renders the PrimaryTaxonomyPicker component.
   *
   * @returns {ReactElement} The rendered component.
   */

	}, {
		key: "render",
		value: function render() {
			var _props = this.props,
			    primaryTaxonomyId = _props.primaryTaxonomyId,
			    taxonomy = _props.taxonomy;


			if (this.state.selectedTerms.length < 2) {
				return null;
			}

			var fieldId = "yoast-primary-" + taxonomy.name + "-picker";

			return yoast._wp.element.createElement(
				"div",
				{ className: "components-base-control__field" },
				yoast._wp.element.createElement(
					PrimaryTaxonomyPickerLabel,
					{
						htmlFor: fieldId,
						className: "components-base-control__label" },
					(0, _i18n.sprintf)(
					/* Translators: %s expands to the taxonomy name */
					(0, _i18n.__)("Select the primary %s"), taxonomy.singularLabel.toLowerCase())
				),
				yoast._wp.element.createElement(_TaxonomyPicker2.default, {
					value: primaryTaxonomyId,
					onChange: this.onChange,
					id: fieldId,
					terms: this.state.selectedTerms })
			);
		}
	}]);

	return PrimaryTaxonomyPicker;
}(_react2.default.Component);

PrimaryTaxonomyPicker.propTypes = {
	selectedTermIds: _propTypes2.default.arrayOf(_propTypes2.default.number),
	primaryTaxonomyId: _propTypes2.default.number,
	setPrimaryTaxonomyId: _propTypes2.default.func,
	updateReplacementVariable: _propTypes2.default.func,
	receiveEntityRecords: _propTypes2.default.func,
	taxonomy: _propTypes2.default.shape({
		name: _propTypes2.default.string,
		fieldId: _propTypes2.default.string,
		restBase: _propTypes2.default.string,
		singularLabel: _propTypes2.default.string
	})
};

exports.default = (0, _compose.compose)([(0, _data.withSelect)(function (select, props) {
	var editorData = select("core/editor");
	var yoastData = select("yoast-seo/editor");

	var taxonomy = props.taxonomy;


	var selectedTermIds = editorData.getEditedPostAttribute(taxonomy.restBase) || [];

	return {
		selectedTermIds: selectedTermIds,
		primaryTaxonomyId: yoastData.getPrimaryTaxonomyId(taxonomy.name)
	};
}), (0, _data.withDispatch)(function (dispatch) {
	var _dispatch = dispatch("yoast-seo/editor"),
	    setPrimaryTaxonomyId = _dispatch.setPrimaryTaxonomyId,
	    updateReplacementVariable = _dispatch.updateReplacementVariable;

	return {
		setPrimaryTaxonomyId: setPrimaryTaxonomyId,
		updateReplacementVariable: updateReplacementVariable
	};
})])(PrimaryTaxonomyPicker);

/***/ }),
/* 808 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compose = exports.withState = exports.withSafeTimeout = exports.withInstanceId = exports.withGlobalEvents = exports.remountOnPropChange = exports.pure = exports.ifCondition = exports.createHigherOrderComponent = undefined;

var _createHigherOrderComponent = __webpack_require__(107);

Object.defineProperty(exports, 'createHigherOrderComponent', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_createHigherOrderComponent).default;
  }
});

var _ifCondition = __webpack_require__(809);

Object.defineProperty(exports, 'ifCondition', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ifCondition).default;
  }
});

var _pure = __webpack_require__(810);

Object.defineProperty(exports, 'pure', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_pure).default;
  }
});

var _remountOnPropChange = __webpack_require__(817);

Object.defineProperty(exports, 'remountOnPropChange', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_remountOnPropChange).default;
  }
});

var _withGlobalEvents = __webpack_require__(818);

Object.defineProperty(exports, 'withGlobalEvents', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_withGlobalEvents).default;
  }
});

var _withInstanceId = __webpack_require__(820);

Object.defineProperty(exports, 'withInstanceId', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_withInstanceId).default;
  }
});

var _withSafeTimeout = __webpack_require__(821);

Object.defineProperty(exports, 'withSafeTimeout', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_withSafeTimeout).default;
  }
});

var _withState = __webpack_require__(822);

Object.defineProperty(exports, 'withState', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_withState).default;
  }
});

var _lodash = __webpack_require__(236);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Composes multiple higher-order components into a single higher-order component. Performs right-to-left function
 * composition, where each successive invocation is supplied the return value of the previous.
 *
 * @param {...Function} hocs The HOC functions to invoke.
 *
 * @return {Function} Returns the new composite function.
 */

exports.compose = _lodash.flowRight;

/***/ }),
/* 809 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _element = __webpack_require__(50);

var _createHigherOrderComponent = __webpack_require__(107);

var _createHigherOrderComponent2 = _interopRequireDefault(_createHigherOrderComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Higher-order component creator, creating a new component which renders if
 * the given condition is satisfied or with the given optional prop name.
 *
 * @param {Function} predicate Function to test condition.
 *
 * @return {Function} Higher-order component.
 */

var ifCondition = function ifCondition(predicate) {
  return (0, _createHigherOrderComponent2.default)(function (WrappedComponent) {
    return function (props) {
      if (!predicate(props)) {
        return null;
      }

      return (0, _element.createElement)(WrappedComponent, props);
    };
  }, 'ifCondition');
};

/**
 * Internal dependencies
 */
exports.default = ifCondition;

/***/ }),
/* 810 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(144);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(145);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(181);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _getPrototypeOf2 = __webpack_require__(182);

var _getPrototypeOf3 = _interopRequireDefault(_getPrototypeOf2);

var _inherits2 = __webpack_require__(183);

var _inherits3 = _interopRequireDefault(_inherits2);

var _element = __webpack_require__(50);

var _isShallowEqual = __webpack_require__(813);

var _isShallowEqual2 = _interopRequireDefault(_isShallowEqual);

var _createHigherOrderComponent = __webpack_require__(107);

var _createHigherOrderComponent2 = _interopRequireDefault(_createHigherOrderComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Given a component returns the enhanced component augmented with a component
 * only rerendering when its props/state change
 *
 * @param {Function} mapComponentToEnhancedComponent Function mapping component
 *                                                   to enhanced component.
 * @param {string}   modifierName                    Seed name from which to
 *                                                   generated display name.
 *
 * @return {WPComponent} Component class with generated display name assigned.
 */

var pure = (0, _createHigherOrderComponent2.default)(function (Wrapped) {
  if (Wrapped.prototype instanceof _element.Component) {
    return (
      /*#__PURE__*/
      function (_Wrapped) {
        (0, _inherits3.default)(_class, _Wrapped);

        function _class() {
          (0, _classCallCheck3.default)(this, _class);

          return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf3.default)(_class).apply(this, arguments));
        }

        (0, _createClass3.default)(_class, [{
          key: "shouldComponentUpdate",
          value: function shouldComponentUpdate(nextProps, nextState) {
            return !(0, _isShallowEqual2.default)(nextProps, this.props) || !(0, _isShallowEqual2.default)(nextState, this.state);
          }
        }]);

        return _class;
      }(Wrapped)
    );
  }

  return (
    /*#__PURE__*/
    function (_Component) {
      (0, _inherits3.default)(_class2, _Component);

      function _class2() {
        (0, _classCallCheck3.default)(this, _class2);

        return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf3.default)(_class2).apply(this, arguments));
      }

      (0, _createClass3.default)(_class2, [{
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate(nextProps) {
          return !(0, _isShallowEqual2.default)(nextProps, this.props);
        }
      }, {
        key: "render",
        value: function render() {
          return (0, _element.createElement)(Wrapped, this.props);
        }
      }]);

      return _class2;
    }(_element.Component)
  );
}, 'pure');
/**
 * Internal dependencies
 */

/**
 * WordPress dependencies
 */
exports.default = pure;

/***/ }),
/* 811 */
/***/ (function(module, exports) {

function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

function _typeof(obj) {
  if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return _typeof2(obj);
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;

/***/ }),
/* 812 */
/***/ (function(module, exports) {

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;

/***/ }),
/* 813 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objects = __webpack_require__(814);

var _objects2 = _interopRequireDefault(_objects);

var _arrays = __webpack_require__(816);

var _arrays2 = _interopRequireDefault(_arrays);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Local variables
 */

/**
 * Internal dependencies
 */
var isArray = Array.isArray;
/**
 * Returns true if the two arrays or objects are shallow equal, or false
 * otherwise.
 *
 * @param {(Array|Object)} a First object or array to compare.
 * @param {(Array|Object)} b Second object or array to compare.
 *
 * @return {boolean} Whether the two values are shallow equal.
 */

function isShallowEqual(a, b) {
  if (a && b) {
    if (a.constructor === Object && b.constructor === Object) {
      return (0, _objects2.default)(a, b);
    } else if (isArray(a) && isArray(b)) {
      return (0, _arrays2.default)(a, b);
    }
  }

  return a === b;
}

exports.default = isShallowEqual;

/***/ }),
/* 814 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = __webpack_require__(815);

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Local variables
 */
var keys = _keys2.default;
/**
 * Returns true if the two objects are shallow equal, or false otherwise.
 *
 * @param {Object} a First object to compare.
 * @param {Object} b Second object to compare.
 *
 * @return {boolean} Whether the two objects are shallow equal.
 */

function isShallowEqualObjects(a, b) {
  if (a === b) {
    return true;
  }

  var aKeys = keys(a);
  var bKeys = keys(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  var i = 0;

  while (i < aKeys.length) {
    var key = aKeys[i];

    if (a[key] !== b[key]) {
      return false;
    }

    i++;
  }

  return true;
}

exports.default = isShallowEqualObjects;

/***/ }),
/* 815 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(553);

/***/ }),
/* 816 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Returns true if the two arrays are shallow equal, or false otherwise.
 *
 * @param {Array} a First array to compare.
 * @param {Array} b Second array to compare.
 *
 * @return {boolean} Whether the two arrays are shallow equal.
 */
function isShallowEqualArrays(a, b) {
  if (a === b) {
    return true;
  }

  if (a.length !== b.length) {
    return false;
  }

  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

exports.default = isShallowEqualArrays;

/***/ }),
/* 817 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(237);

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = __webpack_require__(144);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(145);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(181);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _getPrototypeOf2 = __webpack_require__(182);

var _getPrototypeOf3 = _interopRequireDefault(_getPrototypeOf2);

var _inherits2 = __webpack_require__(183);

var _inherits3 = _interopRequireDefault(_inherits2);

var _element = __webpack_require__(50);

var _createHigherOrderComponent = __webpack_require__(107);

var _createHigherOrderComponent2 = _interopRequireDefault(_createHigherOrderComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Higher-order component creator, creating a new component that remounts
 * the wrapped component each time a given prop value changes.
 *
 * @param {string} propName Prop name to monitor.
 *
 * @return {Function} Higher-order component.
 */

/**
 * WordPress dependencies
 */
var remountOnPropChange = function remountOnPropChange(propName) {
  return (0, _createHigherOrderComponent2.default)(function (WrappedComponent) {
    return (
      /*#__PURE__*/
      function (_Component) {
        (0, _inherits3.default)(_class, _Component);

        function _class(props) {
          var _this;

          (0, _classCallCheck3.default)(this, _class);

          _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf3.default)(_class).apply(this, arguments));
          _this.state = {
            propChangeId: 0,
            propValue: props[propName]
          };
          return _this;
        }

        (0, _createClass3.default)(_class, [{
          key: "render",
          value: function render() {
            return (0, _element.createElement)(WrappedComponent, (0, _extends3.default)({
              key: this.state.propChangeId
            }, this.props));
          }
        }], [{
          key: "getDerivedStateFromProps",
          value: function getDerivedStateFromProps(props, state) {
            if (props[propName] === state.propValue) {
              return null;
            }

            return {
              propChangeId: state.propChangeId + 1,
              propValue: props[propName]
            };
          }
        }]);

        return _class;
      }(_element.Component)
    );
  }, 'remountOnPropChange');
};
/**
 * Internal dependencies
 */

exports.default = remountOnPropChange;

/***/ }),
/* 818 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(237);

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = __webpack_require__(144);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(145);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(181);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _getPrototypeOf2 = __webpack_require__(182);

var _getPrototypeOf3 = _interopRequireDefault(_getPrototypeOf2);

var _inherits2 = __webpack_require__(183);

var _inherits3 = _interopRequireDefault(_inherits2);

var _assertThisInitialized2 = __webpack_require__(325);

var _assertThisInitialized3 = _interopRequireDefault(_assertThisInitialized2);

var _element = __webpack_require__(50);

var _lodash = __webpack_require__(236);

var _createHigherOrderComponent = __webpack_require__(107);

var _createHigherOrderComponent2 = _interopRequireDefault(_createHigherOrderComponent);

var _listener = __webpack_require__(819);

var _listener2 = _interopRequireDefault(_listener);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Listener instance responsible for managing document event handling.
 *
 * @type {Listener}
 */

/**
 * Internal dependencies
 */

/**
 * External dependencies
 */
var listener = new _listener2.default();
/**
 * WordPress dependencies
 */

function withGlobalEvents(eventTypesToHandlers) {
  return (0, _createHigherOrderComponent2.default)(function (WrappedComponent) {
    var Wrapper =
    /*#__PURE__*/
    function (_Component) {
      (0, _inherits3.default)(Wrapper, _Component);

      function Wrapper() {
        var _this;

        (0, _classCallCheck3.default)(this, Wrapper);

        _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf3.default)(Wrapper).apply(this, arguments));
        _this.handleEvent = _this.handleEvent.bind((0, _assertThisInitialized3.default)((0, _assertThisInitialized3.default)(_this)));
        _this.handleRef = _this.handleRef.bind((0, _assertThisInitialized3.default)((0, _assertThisInitialized3.default)(_this)));
        return _this;
      }

      (0, _createClass3.default)(Wrapper, [{
        key: "componentDidMount",
        value: function componentDidMount() {
          var _this2 = this;

          (0, _lodash.forEach)(eventTypesToHandlers, function (handler, eventType) {
            listener.add(eventType, _this2);
          });
        }
      }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          var _this3 = this;

          (0, _lodash.forEach)(eventTypesToHandlers, function (handler, eventType) {
            listener.remove(eventType, _this3);
          });
        }
      }, {
        key: "handleEvent",
        value: function handleEvent(event) {
          var handler = eventTypesToHandlers[event.type];

          if (typeof this.wrappedRef[handler] === 'function') {
            this.wrappedRef[handler](event);
          }
        }
      }, {
        key: "handleRef",
        value: function handleRef(el) {
          this.wrappedRef = el; // Any component using `withGlobalEvents` that is not setting a `ref`
          // will cause `this.props.forwardedRef` to be `null`, so we need this
          // check.

          if (this.props.forwardedRef) {
            this.props.forwardedRef(el);
          }
        }
      }, {
        key: "render",
        value: function render() {
          return (0, _element.createElement)(WrappedComponent, (0, _extends3.default)({}, this.props, {
            ref: this.handleRef
          }));
        }
      }]);

      return Wrapper;
    }(_element.Component);

    return (0, _element.forwardRef)(function (props, ref) {
      return (0, _element.createElement)(Wrapper, (0, _extends3.default)({}, props, {
        forwardedRef: ref
      }));
    });
  }, 'withGlobalEvents');
}

exports.default = withGlobalEvents;

/***/ }),
/* 819 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(144);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(145);

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = __webpack_require__(236);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Class responsible for orchestrating event handling on the global window,
 * binding a single event to be shared across all handling instances, and
 * removing the handler when no instances are listening for the event.
 */

var Listener =
/*#__PURE__*/
function () {
  function Listener() {
    (0, _classCallCheck3.default)(this, Listener);

    this.listeners = {};
    this.handleEvent = this.handleEvent.bind(this);
  }

  (0, _createClass3.default)(Listener, [{
    key: "add",
    value: function add(eventType, instance) {
      if (!this.listeners[eventType]) {
        // Adding first listener for this type, so bind event.
        window.addEventListener(eventType, this.handleEvent);
        this.listeners[eventType] = [];
      }

      this.listeners[eventType].push(instance);
    }
  }, {
    key: "remove",
    value: function remove(eventType, instance) {
      this.listeners[eventType] = (0, _lodash.without)(this.listeners[eventType], instance);

      if (!this.listeners[eventType].length) {
        // Removing last listener for this type, so unbind event.
        window.removeEventListener(eventType, this.handleEvent);
        delete this.listeners[eventType];
      }
    }
  }, {
    key: "handleEvent",
    value: function handleEvent(event) {
      (0, _lodash.forEach)(this.listeners[event.type], function (instance) {
        instance.handleEvent(event);
      });
    }
  }]);

  return Listener;
}();

/**
 * External dependencies
 */
exports.default = Listener;

/***/ }),
/* 820 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(237);

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = __webpack_require__(144);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(145);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(181);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _getPrototypeOf2 = __webpack_require__(182);

var _getPrototypeOf3 = _interopRequireDefault(_getPrototypeOf2);

var _inherits2 = __webpack_require__(183);

var _inherits3 = _interopRequireDefault(_inherits2);

var _element = __webpack_require__(50);

var _createHigherOrderComponent = __webpack_require__(107);

var _createHigherOrderComponent2 = _interopRequireDefault(_createHigherOrderComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A Higher Order Component used to be provide a unique instance ID by
 * component.
 *
 * @param {WPElement} WrappedComponent The wrapped component.
 *
 * @return {Component} Component with an instanceId prop.
 */

/**
 * WordPress dependencies
 */
exports.default = (0, _createHigherOrderComponent2.default)(function (WrappedComponent) {
  var instances = 0;
  return (
    /*#__PURE__*/
    function (_Component) {
      (0, _inherits3.default)(_class, _Component);

      function _class() {
        var _this;

        (0, _classCallCheck3.default)(this, _class);

        _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf3.default)(_class).apply(this, arguments));
        _this.instanceId = instances++;
        return _this;
      }

      (0, _createClass3.default)(_class, [{
        key: "render",
        value: function render() {
          return (0, _element.createElement)(WrappedComponent, (0, _extends3.default)({}, this.props, {
            instanceId: this.instanceId
          }));
        }
      }]);

      return _class;
    }(_element.Component)
  );
}, 'withInstanceId');
/**
 * Internal dependencies
 */

/***/ }),
/* 821 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(237);

var _extends3 = _interopRequireDefault(_extends2);

__webpack_require__(704);

var _classCallCheck2 = __webpack_require__(144);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(145);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(181);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _getPrototypeOf2 = __webpack_require__(182);

var _getPrototypeOf3 = _interopRequireDefault(_getPrototypeOf2);

var _inherits2 = __webpack_require__(183);

var _inherits3 = _interopRequireDefault(_inherits2);

var _assertThisInitialized2 = __webpack_require__(325);

var _assertThisInitialized3 = _interopRequireDefault(_assertThisInitialized2);

var _element = __webpack_require__(50);

var _lodash = __webpack_require__(236);

var _createHigherOrderComponent = __webpack_require__(107);

var _createHigherOrderComponent2 = _interopRequireDefault(_createHigherOrderComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Browser dependencies
 */

/**
 * WordPress dependencies
 */

var _window = window,
    _clearTimeout = _window.clearTimeout,
    _setTimeout = _window.setTimeout;
/**
 * A higher-order component used to provide and manage delayed function calls
 * that ought to be bound to a component's lifecycle.
 *
 * @param {Component} OriginalComponent Component requiring setTimeout
 *
 * @return {Component}                  Wrapped component.
 */

/**
 * Internal dependencies
 */

/**
 * External dependencies
 */
var withSafeTimeout = (0, _createHigherOrderComponent2.default)(function (OriginalComponent) {
  return (
    /*#__PURE__*/
    function (_Component) {
      (0, _inherits3.default)(WrappedComponent, _Component);

      function WrappedComponent() {
        var _this;

        (0, _classCallCheck3.default)(this, WrappedComponent);

        _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf3.default)(WrappedComponent).apply(this, arguments));
        _this.timeouts = [];
        _this.setTimeout = _this.setTimeout.bind((0, _assertThisInitialized3.default)((0, _assertThisInitialized3.default)(_this)));
        _this.clearTimeout = _this.clearTimeout.bind((0, _assertThisInitialized3.default)((0, _assertThisInitialized3.default)(_this)));
        return _this;
      }

      (0, _createClass3.default)(WrappedComponent, [{
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
          this.timeouts.forEach(_clearTimeout);
        }
      }, {
        key: "setTimeout",
        value: function setTimeout(fn, delay) {
          var _this2 = this;

          var id = _setTimeout(function () {
            fn();

            _this2.clearTimeout(id);
          }, delay);

          this.timeouts.push(id);
          return id;
        }
      }, {
        key: "clearTimeout",
        value: function clearTimeout(id) {
          _clearTimeout(id);

          this.timeouts = (0, _lodash.without)(this.timeouts, id);
        }
      }, {
        key: "render",
        value: function render() {
          return (0, _element.createElement)(OriginalComponent, (0, _extends3.default)({}, this.props, {
            setTimeout: this.setTimeout,
            clearTimeout: this.clearTimeout
          }));
        }
      }]);

      return WrappedComponent;
    }(_element.Component)
  );
}, 'withSafeTimeout');
exports.default = withSafeTimeout;

/***/ }),
/* 822 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = withState;

var _extends2 = __webpack_require__(237);

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = __webpack_require__(144);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(145);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(181);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _getPrototypeOf2 = __webpack_require__(182);

var _getPrototypeOf3 = _interopRequireDefault(_getPrototypeOf2);

var _inherits2 = __webpack_require__(183);

var _inherits3 = _interopRequireDefault(_inherits2);

var _assertThisInitialized2 = __webpack_require__(325);

var _assertThisInitialized3 = _interopRequireDefault(_assertThisInitialized2);

var _element = __webpack_require__(50);

var _createHigherOrderComponent = __webpack_require__(107);

var _createHigherOrderComponent2 = _interopRequireDefault(_createHigherOrderComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A Higher Order Component used to provide and manage internal component state
 * via props.
 *
 * @param {?Object} initialState Optional initial state of the component.
 *
 * @return {Component} Wrapped component.
 */

/**
 * WordPress dependencies
 */
function withState() {
  var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _createHigherOrderComponent2.default)(function (OriginalComponent) {
    return (
      /*#__PURE__*/
      function (_Component) {
        (0, _inherits3.default)(WrappedComponent, _Component);

        function WrappedComponent() {
          var _this;

          (0, _classCallCheck3.default)(this, WrappedComponent);

          _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf3.default)(WrappedComponent).apply(this, arguments));
          _this.setState = _this.setState.bind((0, _assertThisInitialized3.default)((0, _assertThisInitialized3.default)(_this)));
          _this.state = initialState;
          return _this;
        }

        (0, _createClass3.default)(WrappedComponent, [{
          key: "render",
          value: function render() {
            return (0, _element.createElement)(OriginalComponent, (0, _extends3.default)({}, this.props, this.state, {
              setState: this.setState
            }));
          }
        }]);

        return WrappedComponent;
      }(_element.Component)
    );
  }, 'withState');
}
/**
 * Internal dependencies
 */

/***/ }),
/* 823 */
/***/ (function(module, exports, __webpack_require__) {

var baseDifference = __webpack_require__(824),
    baseFlatten = __webpack_require__(315),
    baseRest = __webpack_require__(203),
    isArrayLikeObject = __webpack_require__(555);

/**
 * Creates an array of `array` values not included in the other given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order and references of result values are
 * determined by the first array.
 *
 * **Note:** Unlike `_.pullAll`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.without, _.xor
 * @example
 *
 * _.difference([2, 1], [2, 3]);
 * // => [1]
 */
var difference = baseRest(function(array, values) {
  return isArrayLikeObject(array)
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
    : [];
});

module.exports = difference;


/***/ }),
/* 824 */
/***/ (function(module, exports, __webpack_require__) {

var SetCache = __webpack_require__(228),
    arrayIncludes = __webpack_require__(825),
    arrayIncludesWith = __webpack_require__(826),
    arrayMap = __webpack_require__(44),
    baseUnary = __webpack_require__(197),
    cacheHas = __webpack_require__(229);

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of methods like `_.difference` without support
 * for excluding multiple arrays or iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 */
function baseDifference(array, values, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      isCommon = true,
      length = array.length,
      result = [],
      valuesLength = values.length;

  if (!length) {
    return result;
  }
  if (iteratee) {
    values = arrayMap(values, baseUnary(iteratee));
  }
  if (comparator) {
    includes = arrayIncludesWith;
    isCommon = false;
  }
  else if (values.length >= LARGE_ARRAY_SIZE) {
    includes = cacheHas;
    isCommon = false;
    values = new SetCache(values);
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee == null ? value : iteratee(value);

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === computed) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (!includes(values, computed, comparator)) {
      result.push(value);
    }
  }
  return result;
}

module.exports = baseDifference;


/***/ }),
/* 825 */
/***/ (function(module, exports, __webpack_require__) {

var baseIndexOf = __webpack_require__(227);

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


/***/ }),
/* 826 */
/***/ (function(module, exports) {

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


/***/ }),
/* 827 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A select box for selecting a taxonomy.
 *
 * @param {Object} props The component's props.
 *
 * @returns {ReactElement} The rendered TaxonomyPicker component.
 */
/* External dependencies */
var TaxonomyPicker = function TaxonomyPicker(props) {
	var value = props.value,
	    id = props.id,
	    terms = props.terms,
	    _onChange = props.onChange;


	return yoast._wp.element.createElement(
		"select",
		{
			className: "components-select-control__input",
			id: id,
			value: value,
			onChange: function onChange(e) {
				_onChange(parseInt(e.target.value, 10));
			} },
		terms.map(function (term) {
			return yoast._wp.element.createElement(
				"option",
				{
					key: term.id,
					value: term.id },
				term.name
			);
		})
	);
};

TaxonomyPicker.propTypes = {
	terms: _propTypes2.default.arrayOf(_propTypes2.default.shape({
		id: _propTypes2.default.string.isRequired,
		name: _propTypes2.default.string.isRequired
	})),
	onChange: _propTypes2.default.func.isRequired,
	id: _propTypes2.default.string,
	value: _propTypes2.default.string
};

exports.default = TaxonomyPicker;

/***/ }),
/* 828 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var forEach = __webpack_require__(98);
var isArray = __webpack_require__(3);
var isFunction = __webpack_require__(47);
var isNumber = __webpack_require__(829);
var isObject = __webpack_require__(7);
var isString = __webpack_require__(397);
var isUndefined = __webpack_require__(15);
var reduce = __webpack_require__(830);

/**
 * The plugins object takes care of plugin registrations, preloading and managing data modifications.
 *
 * A plugin for YoastSEO.js is basically a piece of JavaScript that hooks into YoastSEO.js by registering modifications.
 * In order to do so, it must first register itself as a plugin with YoastSEO.js. To keep our content analysis fast, we
 * don't allow asynchronous modifications. That's why we require plugins to preload all data they need in order to modify
 * the content. If plugins need to preload data, they can first register, then preload using AJAX and call `ready` once
 * preloaded.
 *
 * To minimize client side memory usage, we request plugins to preload as little data as possible. If you need to dynamically
 * fetch more data in the process of content creation, you can reload your data set and let YoastSEO.js know you've reloaded
 * by calling `reloaded`.
 *
 * @todo: add list of supported modifications and compare on registration of modification
 */

var Pluggable = function () {
	/**
  * Setup Pluggable and set its default values.
  *
  * @param {Function} refresh The function that refreshes the analyses.
  *
  * @property {boolean} loaded           Whether the plugins are loaded.
  * @property {number}  preloadThreshold The maximum time plugins are allowed
  *                                      to preload before we load our
  *                                      content analysis.
  * @property {Object}  plugins          The plugins that have been
  *                                      registered.
  * @property {Object}  modifications    The modifications that have been
  *                                      registered. Every modification
  *                                      contains an array with callables.
  */
	function Pluggable(refresh) {
		_classCallCheck(this, Pluggable);

		this.refresh = refresh;
		this.loaded = false;
		this.preloadThreshold = 3000;
		this.plugins = {};
		this.modifications = {};

		this._registerPlugin = this._registerPlugin.bind(this);
		this._ready = this._ready.bind(this);
		this._reloaded = this._reloaded.bind(this);
		this._registerModification = this._registerModification.bind(this);
		this._registerAssessment = this._registerAssessment.bind(this);
		this._applyModifications = this._applyModifications.bind(this);

		// Allow plugins 1500 ms to register before we start polling them.
		setTimeout(this._pollLoadingPlugins.bind(this), 1500);
	}

	/**
  * Register a plugin with YoastSEO.
  *
  * A plugin can be declared "ready" right at registration or later
  * using `this.ready`.
  *
  * @param {string} pluginName     The name of the plugin to be registered.
  * @param {object} options        The options passed by the plugin.
  * @param {string} options.status The status of the plugin being registered.
  *                                Can either be "loading" or "ready".
  *
  * @returns {boolean} Whether or not the plugin was successfully registered.
  */


	_createClass(Pluggable, [{
		key: "_registerPlugin",
		value: function _registerPlugin(pluginName, options) {
			if (!isString(pluginName)) {
				console.error("Failed to register plugin. Expected parameter `pluginName` to be a string.");
				return false;
			}

			if (!isUndefined(options) && !isObject(options)) {
				console.error("Failed to register plugin " + pluginName + ". Expected parameters `options` to be a object.");
				return false;
			}

			if (this._validateUniqueness(pluginName) === false) {
				console.error("Failed to register plugin. Plugin with name " + pluginName + " already exists");
				return false;
			}

			this.plugins[pluginName] = options;

			return true;
		}

		/**
   * Declare a plugin "ready".
   *
   * Use this if you need to preload data with AJAX.
   *
   * @param {string} pluginName The name of the plugin to be declared as
   *                            ready.
   *
   * @returns {boolean} Whether or not the plugin was successfully declared
   *                    ready.
   */

	}, {
		key: "_ready",
		value: function _ready(pluginName) {
			if (!isString(pluginName)) {
				console.error("Failed to modify status for plugin " + pluginName + ". Expected parameter `pluginName` to be a string.");
				return false;
			}

			if (isUndefined(this.plugins[pluginName])) {
				console.error("Failed to modify status for plugin " + pluginName + ". The plugin was not properly registered.");
				return false;
			}

			this.plugins[pluginName].status = "ready";

			return true;
		}

		/**
   * Declares a plugin has been reloaded.
   *
   * If an analysis is currently running. We will reset it to ensure running
   * the latest modifications.
   *
   * @param {string} pluginName The name of the plugin to be declared as
   *                            reloaded.
   *
   * @returns {boolean} Whether or not the plugin was successfully declared as
   *                    reloaded.
   */

	}, {
		key: "_reloaded",
		value: function _reloaded(pluginName) {
			if (!isString(pluginName)) {
				console.error("Failed to reload Content Analysis for " + pluginName + ". Expected parameter `pluginName` to be a string.");
				return false;
			}

			if (isUndefined(this.plugins[pluginName])) {
				console.error("Failed to reload Content Analysis for plugin " + pluginName + ". The plugin was not properly registered.");
				return false;
			}

			this.refresh();
			return true;
		}

		/**
   * Registers a callable for a specific data filter supported by YoastSEO.
   *
   * Can only be performed for plugins that have finished loading.
   *
   * @param {string}   modification The name of the filter.
   * @param {Function} callable     The callable.
   * @param {string}   pluginName   The plugin that is registering the
   *                                modification.
   * @param {number}   [priority]   Used to specify the order in which the
   *                                callables associated with a particular
   *                                filter are called. Lower numbers
   *                                correspond with earlier execution.
   *
   * @returns {boolean} Whether or not applying the hook was successful.
   */

	}, {
		key: "_registerModification",
		value: function _registerModification(modification, callable, pluginName, priority) {
			if (!isString(modification)) {
				console.error("Failed to register modification for plugin " + pluginName + ". Expected parameter `modification` to be a string.");
				return false;
			}
			if (!isFunction(callable)) {
				console.error("Failed to register modification for plugin " + pluginName + ". Expected parameter `callable` to be a function.");
				return false;
			}
			if (!isString(pluginName)) {
				console.error("Failed to register modification for plugin " + pluginName + ". Expected parameter `pluginName` to be a string.");
				return false;
			}
			if (this._validateOrigin(pluginName) === false) {
				console.error("Failed to register modification for plugin " + pluginName + ". The integration has not finished loading yet.");
				return false;
			}

			// Default priority to 10.
			var prio = isNumber(priority) ? priority : 10;
			var callableObject = {
				callable: callable,
				origin: pluginName,
				priority: prio
			};

			// Make sure modification is defined on modifications object.
			if (isUndefined(this.modifications[modification])) {
				this.modifications[modification] = [];
			}
			this.modifications[modification].push(callableObject);

			return true;
		}

		/**
   * Register an assessment for a specific plugin.
   *
   * @param {Object}   assessor   The assessor to add the assessments to.
   * @param {string}   name       The name of the assessment.
   * @param {Function} assessment The function to run as an assessment.
   * @param {string}   pluginName The name of the plugin associated with the
   *                              assessment.
   *
   * @returns {boolean} Whether registering the assessment was successful.
   */

	}, {
		key: "_registerAssessment",
		value: function _registerAssessment(assessor, name, assessment, pluginName) {
			if (!isString(name)) {
				console.error("Failed to register test for plugin " + pluginName + ". Expected parameter `name` to be a string.");
				return false;
			}

			if (!isObject(assessment)) {
				console.error("Failed to register assessment for plugin " + pluginName + ". Expected parameter `assessment` to be a function.");
				return false;
			}

			if (!isString(pluginName)) {
				console.error("Failed to register assessment for plugin " + pluginName + ". Expected parameter `pluginName` to be a string.");
				return false;
			}

			// Prefix the name with the pluginName so the test name is always unique.
			name = pluginName + "-" + name;

			assessor.addAssessment(name, assessment);

			return true;
		}

		/**
   * Calls the callables added to a modification hook.
   *
   * See the YoastSEO.js Readme for a list of supported modification hooks.
   *
   * @param {string} modification The name of the filter.
   * @param {*}      data         The data to filter.
   * @param {Object} [context]    Object for passing context parameters to the
   *                              callable.
   *
   * @returns {*} The filtered data.
   */

	}, {
		key: "_applyModifications",
		value: function _applyModifications(modification, data, context) {
			var callChain = this.modifications[modification];

			if (!isArray(callChain) || callChain.length < 1) {
				return data;
			}

			callChain = this._stripIllegalModifications(callChain);
			callChain.sort(function (a, b) {
				return a.priority - b.priority;
			});

			forEach(callChain, function (callableObject) {
				var newData = callableObject.callable(data, context);
				if ((typeof newData === "undefined" ? "undefined" : _typeof(newData)) !== (typeof data === "undefined" ? "undefined" : _typeof(data))) {
					console.error("Modification with name " + modification + " performed by plugin with name " + callableObject.origin + " was ignored because the data that was returned by it was of a different" + " type than the data we had passed it.");
					return;
				}
				data = newData;
			});

			return data;
		}

		/**
   * Poller to handle loading of plugins.
   *
   * Plugins can register with our app to let us know they are going to hook
   * into our Javascript. They are allowed 5 seconds of pre-loading time to
   * fetch all the data they need to be able to perform their data
   * modifications. We will only apply data modifications from plugins that
   * have declared ready within the pre-loading time in order to safeguard UX
   * and data integrity.
   *
   * @param {number} [pollTime] The accumulated time to compare with the
   *                            pre-load threshold.
   *
   * @returns {void}
   */

	}, {
		key: "_pollLoadingPlugins",
		value: function _pollLoadingPlugins(pollTime) {
			pollTime = isUndefined(pollTime) ? 0 : pollTime;
			if (this._allReady() === true) {
				this.loaded = true;
				this.refresh();
			} else if (pollTime >= this.preloadThreshold) {
				this._pollTimeExceeded();
				this.loaded = true;
				this.refresh();
			} else {
				pollTime += 50;
				setTimeout(this._pollLoadingPlugins.bind(this, pollTime), 50);
			}
		}

		/**
   * Checks if all registered plugins have finished loading.
   *
   * @returns {boolean} Whether or not all registered plugins are loaded.
   */

	}, {
		key: "_allReady",
		value: function _allReady() {
			return reduce(this.plugins, function (allReady, plugin) {
				return allReady && plugin.status === "ready";
			}, true);
		}

		/**
   * Removes the plugins that were not loaded within time.
   *
   * @returns {void}
   */

	}, {
		key: "_pollTimeExceeded",
		value: function _pollTimeExceeded() {
			forEach(this.plugins, function (plugin, pluginName) {
				if (!isUndefined(plugin.options) && plugin.options.status !== "ready") {
					console.error("Error: Plugin " + pluginName + ". did not finish loading in time.");
					delete this.plugins[pluginName];
				}
			});
		}

		/**
   * Checks the origin of the modifications from a callChain.
   *
   * @param {Array} callChain The callChain that contains items with possible
   *                          invalid origins.
   *
   * @returns {Array} callChain The stripped version of the callChain.
   */

	}, {
		key: "_stripIllegalModifications",
		value: function _stripIllegalModifications(callChain) {
			var _this = this;

			forEach(callChain, function (callableObject, index) {
				if (_this._validateOrigin(callableObject.origin) === false) {
					delete callChain[index];
				}
			});

			return callChain;
		}

		/**
   * Checks if the plugin status is ready.
   *
   * Which means a modification has been registered and finished preloading.
   *
   * @param {string} pluginName The name of the plugin that needs to be
   *                            validated.
   *
   * @returns {boolean} Whether or not the origin is valid.
   */

	}, {
		key: "_validateOrigin",
		value: function _validateOrigin(pluginName) {
			return this.plugins[pluginName].status === "ready";
		}

		/**
   * Validates if registered plugin has a unique name.
   *
   * @param {string} pluginName The name of the plugin that needs to be
   *                            validated for uniqueness.
   *
   * @returns {boolean} Whether or not the plugin has a unique name.
   */

	}, {
		key: "_validateUniqueness",
		value: function _validateUniqueness(pluginName) {
			return isUndefined(this.plugins[pluginName]);
		}
	}]);

	return Pluggable;
}();

exports.default = Pluggable;

/***/ }),
/* 829 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(12),
    isObjectLike = __webpack_require__(10);

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


/***/ }),
/* 830 */
/***/ (function(module, exports, __webpack_require__) {

var arrayReduce = __webpack_require__(177),
    baseEach = __webpack_require__(167),
    baseIteratee = __webpack_require__(198),
    baseReduce = __webpack_require__(831),
    isArray = __webpack_require__(3);

/**
 * Reduces `collection` to a value which is the accumulated result of running
 * each element in `collection` thru `iteratee`, where each successive
 * invocation is supplied the return value of the previous. If `accumulator`
 * is not given, the first element of `collection` is used as the initial
 * value. The iteratee is invoked with four arguments:
 * (accumulator, value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.reduce`, `_.reduceRight`, and `_.transform`.
 *
 * The guarded methods are:
 * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
 * and `sortBy`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @returns {*} Returns the accumulated value.
 * @see _.reduceRight
 * @example
 *
 * _.reduce([1, 2], function(sum, n) {
 *   return sum + n;
 * }, 0);
 * // => 3
 *
 * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
 *   (result[value] || (result[value] = [])).push(key);
 *   return result;
 * }, {});
 * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
 */
function reduce(collection, iteratee, accumulator) {
  var func = isArray(collection) ? arrayReduce : baseReduce,
      initAccum = arguments.length < 3;

  return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);
}

module.exports = reduce;


/***/ }),
/* 831 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.reduce` and `_.reduceRight`, without support
 * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} accumulator The initial value.
 * @param {boolean} initAccum Specify using the first or last element of
 *  `collection` as the initial value.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @returns {*} Returns the accumulated value.
 */
function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
  eachFunc(collection, function(value, index, collection) {
    accumulator = initAccum
      ? (initAccum = false, value)
      : iteratee(accumulator, value, index, collection);
  });
  return accumulator;
}

module.exports = baseReduce;


/***/ }),
/* 832 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.createAnalysisWorker = createAnalysisWorker;
exports.getAnalysisConfiguration = getAnalysisConfiguration;

var _yoastseo = __webpack_require__(70);

var _get = __webpack_require__(28);

var _get2 = _interopRequireDefault(_get);

var _isUndefined = __webpack_require__(15);

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _merge = __webpack_require__(428);

var _merge2 = _interopRequireDefault(_merge);

var _getContentLocale = __webpack_require__(559);

var _getContentLocale2 = _interopRequireDefault(_getContentLocale);

var _getTranslations = __webpack_require__(560);

var _getTranslations2 = _interopRequireDefault(_getTranslations);

var _isContentAnalysisActive = __webpack_require__(423);

var _isContentAnalysisActive2 = _interopRequireDefault(_isContentAnalysisActive);

var _isKeywordAnalysisActive = __webpack_require__(320);

var _isKeywordAnalysisActive2 = _interopRequireDefault(_isKeywordAnalysisActive);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Instantiates an analysis worker (wrapper).
 *
 * @returns {AnalysisWorkerWrapper} The analysis worker.
 */


// Internal dependencies.
// External dependencies.
function createAnalysisWorker() {
	var url = (0, _get2.default)(global, ["wpseoAnalysisWorkerL10n", "url"], "wp-seo-analysis-worker.js");
	return new _yoastseo.AnalysisWorkerWrapper((0, _yoastseo.createWorker)(url));
}

/**
 * Retrieves the analysis configuration for the worker.
 *
 * @param {Object} [customConfiguration] The custom configuration to use.
 *
 * @returns {Object} The analysis configuration.
 */
function getAnalysisConfiguration() {
	var customConfiguration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	var configuration = {
		locale: (0, _getContentLocale2.default)(),
		contentAnalysisActive: (0, _isContentAnalysisActive2.default)(),
		keywordAnalysisActive: (0, _isKeywordAnalysisActive2.default)()
	};

	configuration = (0, _merge2.default)(configuration, customConfiguration);

	var translations = (0, _getTranslations2.default)();
	if (!(0, _isUndefined2.default)(translations) && !(0, _isUndefined2.default)(translations.domain)) {
		configuration.translations = translations;
	}

	return configuration;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 833 */
/***/ (function(module, exports, __webpack_require__) {

var Stack = __webpack_require__(87),
    assignMergeValue = __webpack_require__(558),
    baseFor = __webpack_require__(220),
    baseMergeDeep = __webpack_require__(834),
    isObject = __webpack_require__(7),
    keysIn = __webpack_require__(94);

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor(source, function(srcValue, key) {
    if (isObject(srcValue)) {
      stack || (stack = new Stack);
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(object[key], srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  }, keysIn);
}

module.exports = baseMerge;


/***/ }),
/* 834 */
/***/ (function(module, exports, __webpack_require__) {

var assignMergeValue = __webpack_require__(558),
    cloneBuffer = __webpack_require__(309),
    cloneTypedArray = __webpack_require__(310),
    copyArray = __webpack_require__(233),
    initCloneObject = __webpack_require__(311),
    isArguments = __webpack_require__(64),
    isArray = __webpack_require__(3),
    isArrayLikeObject = __webpack_require__(555),
    isBuffer = __webpack_require__(65),
    isFunction = __webpack_require__(47),
    isObject = __webpack_require__(7),
    isPlainObject = __webpack_require__(312),
    isTypedArray = __webpack_require__(86),
    toPlainObject = __webpack_require__(835);

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = object[key],
      srcValue = source[key],
      stacked = stack.get(srcValue);

  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = isArray(srcValue),
        isBuff = !isArr && isBuffer(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray(srcValue);

    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      newValue = objValue;
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      }
      else if (!isObject(objValue) || (srcIndex && isFunction(objValue))) {
        newValue = initCloneObject(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  assignMergeValue(object, key, newValue);
}

module.exports = baseMergeDeep;


/***/ }),
/* 835 */
/***/ (function(module, exports, __webpack_require__) {

var copyObject = __webpack_require__(45),
    keysIn = __webpack_require__(94);

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}

module.exports = toPlainObject;


/***/ }),
/* 836 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = refreshAnalysis;
exports.initializationDone = initializationDone;

var _contentAnalysis = __webpack_require__(429);

var _snippetEditor = __webpack_require__(61);

var isInitialized = false;

/**
 * Refreshes the analysis.
 *
 * @param {AnalysisWorkerWrapper}               worker        The analysis worker to request the analysis from.
 * @param {Function}                            collectData   Function that collects the analysis data.
 * @param {Function}                            applyMarks    Function that applies the marks in the content.
 * @param {Object}                              store         The store.
 * @param {PostDataCollector|TermDataCollector} dataCollector The data collector to update the score of the results.
 *
 * @returns {void}
 */
function refreshAnalysis(worker, collectData, applyMarks, store, dataCollector) {
	var paper = collectData();

	if (!isInitialized) {
		return;
	}

	worker.analyze(paper).then(function (_ref) {
		var _ref$result = _ref.result,
		    seo = _ref$result.seo,
		    readability = _ref$result.readability;

		if (seo) {
			// Only update the main results, which are located under the empty string key.
			var seoResults = seo[""];

			// Recreate the getMarker function after the worker is done.
			seoResults.results.forEach(function (result) {
				result.getMarker = function () {
					return function () {
						return applyMarks(paper, result.marks);
					};
				};
			});

			store.dispatch((0, _contentAnalysis.setSeoResultsForKeyword)(paper.getKeyword(), seoResults.results));
			store.dispatch((0, _contentAnalysis.setOverallSeoScore)(seoResults.score, paper.getKeyword()));
			store.dispatch((0, _snippetEditor.refreshSnippetEditor)());

			dataCollector.saveScores(seoResults.score, paper.getKeyword());
		}

		if (readability) {
			// Recreate the getMarker function after the worker is done.
			readability.results.forEach(function (result) {
				result.getMarker = function () {
					return function () {
						return applyMarks(paper, result.marks);
					};
				};
			});

			store.dispatch((0, _contentAnalysis.setReadabilityResults)(readability.results));
			store.dispatch((0, _contentAnalysis.setOverallReadabilityScore)(readability.score));
			store.dispatch((0, _snippetEditor.refreshSnippetEditor)());

			dataCollector.saveContentScore(readability.score);
		}
	}).catch(function (error) {
		return console.warn(error);
	});
}

/**
 * Sets isInitialized to true.
 *
 * @returns {void}
 */
function initializationDone() {
	isInitialized = true;
}

/***/ }),
/* 837 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = collectAnalysisData;

var _cloneDeep = __webpack_require__(838);

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _merge = __webpack_require__(428);

var _merge2 = _interopRequireDefault(_merge);

var _measureTextWidth = __webpack_require__(839);

var _measureTextWidth2 = _interopRequireDefault(_measureTextWidth);

var _getContentLocale = __webpack_require__(559);

var _getContentLocale2 = _interopRequireDefault(_getContentLocale);

var _yoastseo = __webpack_require__(70);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Retrieves the data needed for the analyses.
 *
 * We use the following data sources:
 * 1. Redux Store.
 * 2. Custom data callbacks.
 * 3. Pluggable modifications.
 *
 * @param {Edit}               edit               The edit instance.
 * @param {Object}             store              The redux store.
 * @param {CustomAnalysisData} customAnalysisData The custom analysis data.
 * @param {Pluggable}          pluggable          The Pluggable.
 *
 * @returns {Paper} The paper data used for the analyses.
 */
function collectAnalysisData(edit, store, customAnalysisData, pluggable) {
	var storeData = (0, _cloneDeep2.default)(store.getState());
	(0, _merge2.default)(storeData, customAnalysisData.getData());
	var editData = edit.getData().getData();

	// Make a data structure for the paper data.
	var data = {
		text: editData.content,
		keyword: storeData.focusKeyword,
		synonyms: storeData.synonyms,
		/*
   * The analysis data is provided by the snippet editor. The snippet editor transforms the title and the
   * description on change only. Therefore, we have to use the original data when the analysis data isn't
   * available. This data is transformed by the replacevar plugin via pluggable.
   */
		description: storeData.analysisData.snippet.description || storeData.snippetEditor.data.description,
		title: storeData.analysisData.snippet.title || storeData.snippetEditor.data.title,
		url: storeData.snippetEditor.data.slug,
		permalink: storeData.settings.snippetEditor.baseUrl + storeData.snippetEditor.data.slug
	};

	// Modify the data through pluggable.
	if (pluggable.loaded) {
		data.title = pluggable._applyModifications("data_page_title", data.title);
		data.title = pluggable._applyModifications("title", data.title);
		data.description = pluggable._applyModifications("data_meta_desc", data.description);
		data.text = pluggable._applyModifications("content", data.text);
	}

	data.titleWidth = (0, _measureTextWidth2.default)(data.title);
	data.locale = (0, _getContentLocale2.default)();

	return _yoastseo.Paper.parse(data);
}

/***/ }),
/* 838 */
/***/ (function(module, exports, __webpack_require__) {

var baseClone = __webpack_require__(306);

/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1,
    CLONE_SYMBOLS_FLAG = 4;

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}

module.exports = cloneDeep;


/***/ }),
/* 839 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = measureTextWidth;
var elementId = "yoast-measurement-element";

/**
 * Creates an hidden element with the purpose to calculate the sizes of elements and adds these elements to the body.
 *
 * @returns {HTMLElement} The created hidden element.
 */
function createMeasurementElement() {
	var hiddenElement = document.createElement("div");

	hiddenElement.id = elementId;

	// Styles to prevent unintended scrolling in Gutenberg.
	hiddenElement.style.position = "absolute";
	hiddenElement.style.left = "-9999em";
	hiddenElement.style.top = 0;
	hiddenElement.style.height = 0;
	hiddenElement.style.overflow = "hidden";
	hiddenElement.style.fontFamily = "Arial";
	hiddenElement.style.fontSize = "16px";
	hiddenElement.style.fontWeight = "400";

	document.body.appendChild(hiddenElement);
	return hiddenElement;
}

/**
 * Measures the width of the text using a hidden element.
 *
 * @param {string} text The text to measure the width for.
 * @returns {number} The width in pixels.
 */
function measureTextWidth(text) {
	var element = document.getElementById(elementId);
	if (!element) {
		element = createMeasurementElement();
	}
	element.innerHTML = text;
	return element.offsetWidth;
}

/***/ }),
/* 840 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getDataWithoutTemplates = getDataWithoutTemplates;

var _has = __webpack_require__(552);

var _has2 = _interopRequireDefault(_has);

var _forEach = __webpack_require__(98);

var _forEach2 = _interopRequireDefault(_forEach);

var _isEmpty = __webpack_require__(430);

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _isUndefined = __webpack_require__(15);

var _isUndefined2 = _interopRequireDefault(_isUndefined);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Gets the snippet editor data from a data collector.
 *
 * @param {PostDataCollector|TermDataCollector} collector The collector to get the data from.
 *
 * @returns {Object} The snippet editor data object.
 */
function getDataFromCollector(collector) {
	return {
		title: collector.getSnippetTitle(),
		slug: collector.getSnippetCite(),
		description: collector.getSnippetMeta()
	};
}

/**
 * Gets the snippet editor data from the redux store.
 *
 * @param {Object} store The redux store to get the data from.
 *
 * @returns {Object} The snippet editor data object.
 */
function getDataFromStore(store) {
	var state = store.getState();
	var data = state.snippetEditor.data;

	return {
		title: data.title,
		slug: data.slug,
		description: data.description
	};
}

/**
 * Gets the templates from the localization object.
 *
 * @param {Object} l10nObject The localization object.
 *
 * @returns {Object} The templates object.
 */
function getTemplatesFromL10n(l10nObject) {
	var templates = {};

	if ((0, _isUndefined2.default)(l10nObject)) {
		return templates;
	}

	templates.title = l10nObject.title_template;

	var description = l10nObject.metadesc_template;
	if (!(0, _isEmpty2.default)(description)) {
		templates.description = description;
	}

	return templates;
}

/**
 * Add templates to the snippet editor data.
 *
 * @param {Object} data      The data object.
 * @param {Object} templates The templates object.
 *
 * @returns {Object} A copy of the data with the templates applied.
 */
function getDataWithTemplates(data, templates) {
	var dataWithTemplates = _extends({}, data);

	(0, _forEach2.default)(templates, function (template, key) {
		if ((0, _has2.default)(data, key) && data[key] === "") {
			dataWithTemplates[key] = template;
		}
	});

	return dataWithTemplates;
}

/**
 * Remove the templates from the snippet editor data.
 *
 * @param {Object} data      The data object.
 * @param {Object} templates The templates object.

 * @returns {Object} A copy of the data without the templates.
 */
function getDataWithoutTemplates(data, templates) {
	var dataWithoutTemplates = _extends({}, data);

	(0, _forEach2.default)(templates, function (template, key) {
		if (!(0, _has2.default)(data, key)) {
			return;
		}

		// Trim spaces from the beginning and end of the data to make a fair comparison with the template.
		var trimmedData = data[key].trim();

		if (trimmedData === template) {
			dataWithoutTemplates[key] = "";
		}
	});

	return dataWithoutTemplates;
}

exports.default = {
	getDataFromCollector: getDataFromCollector,
	getDataFromStore: getDataFromStore,
	getTemplatesFromL10n: getTemplatesFromL10n,
	getDataWithTemplates: getDataWithTemplates,
	getDataWithoutTemplates: getDataWithoutTemplates
};

/***/ }),
/* 841 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _isFunction = __webpack_require__(47);

var _isFunction2 = _interopRequireDefault(_isFunction);

var _merge = __webpack_require__(428);

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Gets data from custom callback functions.
 */
var CustomAnalysisData = function () {
	/**
  * Initializes the CustomAnalysisData class.
  */
	function CustomAnalysisData() {
		_classCallCheck(this, CustomAnalysisData);

		this._callbacks = [];
		this.register = this.register.bind(this);
	}

	/**
  * Registers a function as custom analysis data retriever.
  *
  * Checks whether the callback is a function and if so, adds it to the array
  * of callbacks. Each callback should return a data object.
  *
  * @param {Function} callback The callback function to add.
  *
  * @returns {void}
  */


	_createClass(CustomAnalysisData, [{
		key: "register",
		value: function register(callback) {
			if ((0, _isFunction2.default)(callback)) {
				this._callbacks.push(callback);
			}
		}

		/**
   * Merges the data of all callback functions.
   *
   * @returns {Object} The combined data of all callback functions.
   */

	}, {
		key: "getData",
		value: function getData() {
			var data = {};
			this._callbacks.forEach(function (fetchData) {
				data = (0, _merge2.default)(data, fetchData());
			});
			return data;
		}
	}]);

	return CustomAnalysisData;
}();

exports.default = CustomAnalysisData;

/***/ }),
/* 842 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getApplyMarks;

var _noop = __webpack_require__(178);

var _noop2 = _interopRequireDefault(_noop);

var _wpSeoTinymce = __webpack_require__(321);

var _wpSeoTinymce2 = _interopRequireDefault(_wpSeoTinymce);

var _tinyMCE = __webpack_require__(425);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var decorator = null;

/**
 * Applies the given marks to the content.
 *
 * @param {Paper}    paper The paper.
 * @param {Object[]} marks The marks.
 *
 * @returns {void}
 */
/* global tinyMCE */

function applyMarks(paper, marks) {
  if (_wpSeoTinymce2.default.isTinyMCEAvailable(_wpSeoTinymce2.default.tmceId)) {
    if (null === decorator) {
      decorator = (0, _tinyMCE.tinyMCEDecorator)(tinyMCE.get(_wpSeoTinymce2.default.tmceId));
    }

    decorator(paper, marks);
  }
}

/**
 * Gets the applyMarks or empty function depending on the marksButtonStatus.
 *
 * @param {Object} store The store.
 *
 * @returns {Function} The marker function or an empty function.
 */
function getApplyMarks(store) {
  var showMarkers = store.getState().marksButtonStatus === "enabled";

  if (!showMarkers) {
    return _noop2.default;
  }

  return applyMarks;
}

/***/ }),
/* 843 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var refreshDelay = exports.refreshDelay = 500;

/***/ }),
/* 844 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.renderClassicEditorMetabox = renderClassicEditorMetabox;
exports.registerReactComponent = registerReactComponent;

var _element = __webpack_require__(50);

var _components = __webpack_require__(143);

var _MetaboxPortal = __webpack_require__(550);

var _MetaboxPortal2 = _interopRequireDefault(_MetaboxPortal);

var _getL10nObject = __webpack_require__(180);

var _getL10nObject2 = _interopRequireDefault(_getL10nObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var registeredComponents = [];
var containerRef = null;

var RegisteredComponentsContainer = function (_Component) {
	_inherits(RegisteredComponentsContainer, _Component);

	/**
  * Constructs a container for registered components.
  *
  * @param {Object} props Props for this component.
  */
	function RegisteredComponentsContainer(props) {
		_classCallCheck(this, RegisteredComponentsContainer);

		var _this = _possibleConstructorReturn(this, (RegisteredComponentsContainer.__proto__ || Object.getPrototypeOf(RegisteredComponentsContainer)).call(this, props));

		_this.state = {
			registeredComponents: []
		};
		return _this;
	}

	/**
  * Registers a react component to be rendered within the metabox slot-fill
  * provider.
  *
  * @param {string}          key       Unique key to give to React to render
  *                                    within a list of components.
  * @param {React.Component} Component A valid React component to render.
  *
  * @returns {void}
  */


	_createClass(RegisteredComponentsContainer, [{
		key: "registerComponent",
		value: function registerComponent(key, Component) {
			this.setState({
				registeredComponents: [].concat(_toConsumableArray(this.state.registeredComponents), [{
					key: key,
					Component: Component
				}])
			});
		}

		/**
   * Renders all the registered components.
   *
   * @returns {React.Element[]} The rendered components in an array.
   */

	}, {
		key: "render",
		value: function render() {
			return this.state.registeredComponents.map(function (_ref) {
				var Component = _ref.Component,
				    key = _ref.key;

				return yoast._wp.element.createElement(Component, { key: key });
			});
		}
	}]);

	return RegisteredComponentsContainer;
}(_element.Component);

/**
 * Renders a React tree for the classic editor.
 *
 * @param {Object} store The active redux store.
 *
 * @returns {void}
 */


function renderClassicEditorMetabox(store) {
	var localizedData = (0, _getL10nObject2.default)();
	containerRef = (0, _element.createRef)();

	var theme = {
		isRtl: localizedData.isRtl
	};

	(0, _element.render)(yoast._wp.element.createElement(
		_components.SlotFillProvider,
		null,
		yoast._wp.element.createElement(_MetaboxPortal2.default, {
			target: "wpseo-metabox-root",
			store: store,
			theme: theme
		}),
		yoast._wp.element.createElement(RegisteredComponentsContainer, { ref: containerRef })
	), document.getElementById("wpseo-metabox-root"));

	registeredComponents.forEach(function (registered) {
		containerRef.current.registerComponent(registered.key, registered.Component);
	});
}

/**
 * Registers a react component to be rendered within the metabox slot-fill
 * provider.
 *
 * @param {string}          key       Unique key to give to React to render
 *                                    within a list of components.
 * @param {React.Component} Component A valid React component to render.
 *
 * @returns {void}
 */
function registerReactComponent(key, Component) {
	if (containerRef === null || containerRef.current === null) {
		registeredComponents.push({ key: key, Component: Component });
	} else {
		containerRef.current.registerComponent(key, Component);
	}
}

/***/ }),
/* 845 */,
/* 846 */,
/* 847 */,
/* 848 */,
/* 849 */,
/* 850 */,
/* 851 */,
/* 852 */,
/* 853 */,
/* 854 */,
/* 855 */,
/* 856 */,
/* 857 */,
/* 858 */,
/* 859 */,
/* 860 */,
/* 861 */,
/* 862 */,
/* 863 */,
/* 864 */,
/* 865 */,
/* 866 */,
/* 867 */,
/* 868 */,
/* 869 */,
/* 870 */,
/* 871 */,
/* 872 */,
/* 873 */,
/* 874 */,
/* 875 */,
/* 876 */,
/* 877 */,
/* 878 */,
/* 879 */,
/* 880 */,
/* 881 */,
/* 882 */,
/* 883 */,
/* 884 */,
/* 885 */,
/* 886 */,
/* 887 */,
/* 888 */,
/* 889 */,
/* 890 */,
/* 891 */,
/* 892 */,
/* 893 */,
/* 894 */,
/* 895 */,
/* 896 */,
/* 897 */,
/* 898 */,
/* 899 */,
/* 900 */,
/* 901 */,
/* 902 */,
/* 903 */,
/* 904 */,
/* 905 */,
/* 906 */,
/* 907 */,
/* 908 */,
/* 909 */,
/* 910 */,
/* 911 */,
/* 912 */,
/* 913 */,
/* 914 */,
/* 915 */,
/* 916 */,
/* 917 */,
/* 918 */,
/* 919 */,
/* 920 */,
/* 921 */,
/* 922 */,
/* 923 */,
/* 924 */,
/* 925 */,
/* 926 */,
/* 927 */,
/* 928 */,
/* 929 */,
/* 930 */,
/* 931 */,
/* 932 */,
/* 933 */,
/* 934 */,
/* 935 */,
/* 936 */,
/* 937 */,
/* 938 */,
/* 939 */,
/* 940 */,
/* 941 */,
/* 942 */,
/* 943 */,
/* 944 */,
/* 945 */,
/* 946 */,
/* 947 */,
/* 948 */,
/* 949 */,
/* 950 */,
/* 951 */,
/* 952 */,
/* 953 */,
/* 954 */,
/* 955 */,
/* 956 */,
/* 957 */,
/* 958 */,
/* 959 */,
/* 960 */,
/* 961 */,
/* 962 */,
/* 963 */,
/* 964 */,
/* 965 */,
/* 966 */,
/* 967 */,
/* 968 */,
/* 969 */,
/* 970 */,
/* 971 */,
/* 972 */,
/* 973 */,
/* 974 */,
/* 975 */,
/* 976 */,
/* 977 */,
/* 978 */,
/* 979 */,
/* 980 */,
/* 981 */,
/* 982 */,
/* 983 */,
/* 984 */,
/* 985 */,
/* 986 */,
/* 987 */,
/* 988 */,
/* 989 */,
/* 990 */,
/* 991 */,
/* 992 */,
/* 993 */,
/* 994 */,
/* 995 */,
/* 996 */,
/* 997 */,
/* 998 */,
/* 999 */,
/* 1000 */,
/* 1001 */,
/* 1002 */,
/* 1003 */,
/* 1004 */,
/* 1005 */,
/* 1006 */,
/* 1007 */,
/* 1008 */,
/* 1009 */,
/* 1010 */,
/* 1011 */,
/* 1012 */,
/* 1013 */,
/* 1014 */,
/* 1015 */,
/* 1016 */,
/* 1017 */,
/* 1018 */,
/* 1019 */,
/* 1020 */,
/* 1021 */,
/* 1022 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* global wpseoPostScraperL10n */

var scoreDescriptionClass = "score-text";
var imageScoreClass = "image yoast-logo svg";

(function ($) {
	/* eslint-disable no-extend-native */
	/**
  * Converts the first letter to uppercase in a string.
  *
  * @returns {string} The string with the first letter uppercased.
  */
	String.prototype.ucfirst = function () {
		return this.charAt(0).toUpperCase() + this.substr(1);
	};
	/* eslint-enable no-extend-native */

	/**
  * Creates a text with the label and description for a seo score.
  *
  * @param {String} scoreType The type of score, this is used for the label.
  * @param {String} status The status for the score, this is the descriptive status text.
  * @returns {String} A string with label and description with correct text decoration.
  */
	function createSEOScoreLabel(scoreType, status) {
		var label = wpseoPostScraperL10n.publish_box.labels[scoreType][status] || "";
		return label;
	}

	/**
  * Updates a score type in the publish box.
  *
  * @param {String} type The score type to update (content or seo).
  * @param {String} status The status is the class name that is used to update the image.
  *
  * @returns {void}
  */
	function updateScoreInPublishBox(type, status) {
		var publishSection = $("#" + type + "-score");

		var imageClass = imageScoreClass + " " + status;
		publishSection.children(".image").attr("class", imageClass);

		var text = createSEOScoreLabel(type, status);
		publishSection.children("." + scoreDescriptionClass).html(text);
	}

	/**
  * Creates a new item in the publish box for an yoast-seo score.
  *
  * @param {String} type The score type, for example content score or keyword score.
  * @param {String} status The status for the score initialisation.
  *
  * @returns {void}
  */
	function createScoresInPublishBox(type, status) {
		var publishSection = $("<div />", {
			"class": "misc-pub-section yoast yoast-seo-score " + type + "-score",
			id: type + "-score"
		});

		var spanElem = $("<span />", {
			"class": scoreDescriptionClass,
			html: createSEOScoreLabel(type, status)
		});

		var imgElem = $("<span>").attr("class", imageScoreClass + " na");

		publishSection.append(imgElem).append(spanElem);
		$("#misc-publishing-actions").append(publishSection);
	}

	/**
  * Initializes the publish box score indicators.
  *
  * @returns {void}
  */
	function initialize() {
		var notAvailableStatus = "na";

		if (wpseoPostScraperL10n.contentAnalysisActive === "1") {
			createScoresInPublishBox("content", notAvailableStatus);
		}

		if (wpseoPostScraperL10n.keywordAnalysisActive === "1") {
			createScoresInPublishBox("keyword", notAvailableStatus);
		}
	}

	module.exports = {
		initialize: initialize,
		updateScore: updateScoreInPublishBox
	};
})(jQuery);

/***/ }),
/* 1023 */,
/* 1024 */,
/* 1025 */,
/* 1026 */,
/* 1027 */,
/* 1028 */,
/* 1029 */,
/* 1030 */,
/* 1031 */,
/* 1032 */,
/* 1033 */,
/* 1034 */,
/* 1035 */,
/* 1036 */,
/* 1037 */,
/* 1038 */,
/* 1039 */,
/* 1040 */,
/* 1041 */,
/* 1042 */,
/* 1043 */,
/* 1044 */,
/* 1045 */,
/* 1046 */,
/* 1047 */,
/* 1048 */,
/* 1049 */,
/* 1050 */,
/* 1051 */,
/* 1052 */,
/* 1053 */,
/* 1054 */,
/* 1055 */,
/* 1056 */,
/* 1057 */,
/* 1058 */,
/* 1059 */,
/* 1060 */,
/* 1061 */,
/* 1062 */,
/* 1063 */,
/* 1064 */,
/* 1065 */,
/* 1066 */,
/* 1067 */,
/* 1068 */,
/* 1069 */,
/* 1070 */,
/* 1071 */,
/* 1072 */,
/* 1073 */,
/* 1074 */,
/* 1075 */,
/* 1076 */,
/* 1077 */,
/* 1078 */,
/* 1079 */,
/* 1080 */,
/* 1081 */,
/* 1082 */,
/* 1083 */,
/* 1084 */,
/* 1085 */,
/* 1086 */,
/* 1087 */,
/* 1088 */,
/* 1089 */,
/* 1090 */,
/* 1091 */,
/* 1092 */,
/* 1093 */,
/* 1094 */,
/* 1095 */,
/* 1096 */,
/* 1097 */,
/* 1098 */,
/* 1099 */,
/* 1100 */,
/* 1101 */,
/* 1102 */,
/* 1103 */,
/* 1104 */,
/* 1105 */,
/* 1106 */,
/* 1107 */,
/* 1108 */,
/* 1109 */,
/* 1110 */,
/* 1111 */,
/* 1112 */,
/* 1113 */,
/* 1114 */,
/* 1115 */,
/* 1116 */,
/* 1117 */,
/* 1118 */,
/* 1119 */,
/* 1120 */,
/* 1121 */,
/* 1122 */,
/* 1123 */,
/* 1124 */,
/* 1125 */,
/* 1126 */,
/* 1127 */,
/* 1128 */,
/* 1129 */,
/* 1130 */,
/* 1131 */,
/* 1132 */,
/* 1133 */,
/* 1134 */,
/* 1135 */,
/* 1136 */,
/* 1137 */,
/* 1138 */,
/* 1139 */,
/* 1140 */,
/* 1141 */,
/* 1142 */,
/* 1143 */,
/* 1144 */,
/* 1145 */,
/* 1146 */,
/* 1147 */,
/* 1148 */,
/* 1149 */,
/* 1150 */,
/* 1151 */,
/* 1152 */,
/* 1153 */,
/* 1154 */,
/* 1155 */,
/* 1156 */,
/* 1157 */,
/* 1158 */,
/* 1159 */,
/* 1160 */,
/* 1161 */,
/* 1162 */,
/* 1163 */,
/* 1164 */,
/* 1165 */,
/* 1166 */,
/* 1167 */,
/* 1168 */,
/* 1169 */,
/* 1170 */,
/* 1171 */,
/* 1172 */,
/* 1173 */,
/* 1174 */,
/* 1175 */,
/* 1176 */,
/* 1177 */,
/* 1178 */,
/* 1179 */,
/* 1180 */,
/* 1181 */,
/* 1182 */,
/* 1183 */,
/* 1184 */,
/* 1185 */,
/* 1186 */,
/* 1187 */,
/* 1188 */,
/* 1189 */,
/* 1190 */,
/* 1191 */,
/* 1192 */,
/* 1193 */,
/* 1194 */,
/* 1195 */,
/* 1196 */,
/* 1197 */,
/* 1198 */,
/* 1199 */,
/* 1200 */,
/* 1201 */,
/* 1202 */,
/* 1203 */,
/* 1204 */,
/* 1205 */,
/* 1206 */,
/* 1207 */,
/* 1208 */,
/* 1209 */,
/* 1210 */,
/* 1211 */,
/* 1212 */,
/* 1213 */,
/* 1214 */,
/* 1215 */,
/* 1216 */,
/* 1217 */,
/* 1218 */,
/* 1219 */,
/* 1220 */,
/* 1221 */,
/* 1222 */,
/* 1223 */,
/* 1224 */,
/* 1225 */,
/* 1226 */,
/* 1227 */,
/* 1228 */,
/* 1229 */,
/* 1230 */,
/* 1231 */,
/* 1232 */,
/* 1233 */,
/* 1234 */,
/* 1235 */,
/* 1236 */,
/* 1237 */,
/* 1238 */,
/* 1239 */,
/* 1240 */,
/* 1241 */,
/* 1242 */,
/* 1243 */,
/* 1244 */,
/* 1245 */,
/* 1246 */,
/* 1247 */,
/* 1248 */,
/* 1249 */,
/* 1250 */,
/* 1251 */,
/* 1252 */,
/* 1253 */,
/* 1254 */,
/* 1255 */,
/* 1256 */,
/* 1257 */,
/* 1258 */,
/* 1259 */,
/* 1260 */,
/* 1261 */,
/* 1262 */,
/* 1263 */,
/* 1264 */,
/* 1265 */,
/* 1266 */,
/* 1267 */,
/* 1268 */,
/* 1269 */,
/* 1270 */,
/* 1271 */,
/* 1272 */,
/* 1273 */,
/* 1274 */,
/* 1275 */,
/* 1276 */,
/* 1277 */,
/* 1278 */,
/* 1279 */,
/* 1280 */,
/* 1281 */,
/* 1282 */,
/* 1283 */,
/* 1284 */,
/* 1285 */,
/* 1286 */,
/* 1287 */,
/* 1288 */,
/* 1289 */,
/* 1290 */,
/* 1291 */,
/* 1292 */,
/* 1293 */,
/* 1294 */,
/* 1295 */,
/* 1296 */,
/* 1297 */,
/* 1298 */,
/* 1299 */,
/* 1300 */,
/* 1301 */,
/* 1302 */,
/* 1303 */,
/* 1304 */,
/* 1305 */,
/* 1306 */,
/* 1307 */,
/* 1308 */,
/* 1309 */,
/* 1310 */,
/* 1311 */,
/* 1312 */,
/* 1313 */,
/* 1314 */,
/* 1315 */,
/* 1316 */,
/* 1317 */,
/* 1318 */,
/* 1319 */,
/* 1320 */,
/* 1321 */,
/* 1322 */,
/* 1323 */,
/* 1324 */,
/* 1325 */,
/* 1326 */,
/* 1327 */,
/* 1328 */,
/* 1329 */,
/* 1330 */,
/* 1331 */,
/* 1332 */,
/* 1333 */,
/* 1334 */,
/* 1335 */,
/* 1336 */,
/* 1337 */,
/* 1338 */,
/* 1339 */,
/* 1340 */,
/* 1341 */,
/* 1342 */,
/* 1343 */,
/* 1344 */,
/* 1345 */,
/* 1346 */,
/* 1347 */,
/* 1348 */,
/* 1349 */,
/* 1350 */,
/* 1351 */,
/* 1352 */,
/* 1353 */,
/* 1354 */,
/* 1355 */,
/* 1356 */,
/* 1357 */,
/* 1358 */,
/* 1359 */,
/* 1360 */,
/* 1361 */,
/* 1362 */,
/* 1363 */,
/* 1364 */,
/* 1365 */,
/* 1366 */,
/* 1367 */,
/* 1368 */,
/* 1369 */,
/* 1370 */,
/* 1371 */,
/* 1372 */,
/* 1373 */,
/* 1374 */,
/* 1375 */,
/* 1376 */,
/* 1377 */,
/* 1378 */,
/* 1379 */,
/* 1380 */,
/* 1381 */,
/* 1382 */,
/* 1383 */,
/* 1384 */,
/* 1385 */,
/* 1386 */,
/* 1387 */,
/* 1388 */,
/* 1389 */,
/* 1390 */,
/* 1391 */,
/* 1392 */,
/* 1393 */,
/* 1394 */,
/* 1395 */,
/* 1396 */,
/* 1397 */,
/* 1398 */,
/* 1399 */,
/* 1400 */,
/* 1401 */,
/* 1402 */,
/* 1403 */,
/* 1404 */,
/* 1405 */,
/* 1406 */,
/* 1407 */,
/* 1408 */,
/* 1409 */,
/* 1410 */,
/* 1411 */,
/* 1412 */,
/* 1413 */,
/* 1414 */,
/* 1415 */,
/* 1416 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _yoastseo = __webpack_require__(70);

var _isUndefined = __webpack_require__(15);

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _debounce = __webpack_require__(179);

var _debounce2 = _interopRequireDefault(_debounce);

var _yoastComponents = __webpack_require__(9);

var _objects = __webpack_require__(772);

var _objects2 = _interopRequireDefault(_objects);

var _edit = __webpack_require__(773);

var _edit2 = _interopRequireDefault(_edit);

var _wpSeoMarkdownPlugin = __webpack_require__(1417);

var _wpSeoMarkdownPlugin2 = _interopRequireDefault(_wpSeoMarkdownPlugin);

var _wpSeoTinymce = __webpack_require__(321);

var _wpSeoTinymce2 = _interopRequireDefault(_wpSeoTinymce);

var _compatibilityHelper = __webpack_require__(620);

var _compatibilityHelper2 = _interopRequireDefault(_compatibilityHelper);

var _Pluggable = __webpack_require__(828);

var _Pluggable2 = _interopRequireDefault(_Pluggable);

var _publishBox = __webpack_require__(1022);

var _publishBox2 = _interopRequireDefault(_publishBox);

var _trafficLight = __webpack_require__(556);

var _adminBar = __webpack_require__(557);

var _worker = __webpack_require__(832);

var _refreshAnalysis = __webpack_require__(836);

var _refreshAnalysis2 = _interopRequireDefault(_refreshAnalysis);

var _collectAnalysisData = __webpack_require__(837);

var _collectAnalysisData2 = _interopRequireDefault(_collectAnalysisData);

var _PostDataCollector = __webpack_require__(1419);

var _PostDataCollector2 = _interopRequireDefault(_PostDataCollector);

var _getIndicatorForScore = __webpack_require__(324);

var _getIndicatorForScore2 = _interopRequireDefault(_getIndicatorForScore);

var _getTranslations = __webpack_require__(560);

var _getTranslations2 = _interopRequireDefault(_getTranslations);

var _isKeywordAnalysisActive = __webpack_require__(320);

var _isKeywordAnalysisActive2 = _interopRequireDefault(_isKeywordAnalysisActive);

var _isContentAnalysisActive = __webpack_require__(423);

var _isContentAnalysisActive2 = _interopRequireDefault(_isContentAnalysisActive);

var _snippetEditor = __webpack_require__(840);

var _snippetEditor2 = _interopRequireDefault(_snippetEditor);

var _CustomAnalysisData = __webpack_require__(841);

var _CustomAnalysisData2 = _interopRequireDefault(_CustomAnalysisData);

var _getApplyMarks = __webpack_require__(842);

var _getApplyMarks2 = _interopRequireDefault(_getApplyMarks);

var _constants = __webpack_require__(843);

var _focusKeyword = __webpack_require__(319);

var _markerButtons = __webpack_require__(350);

var _snippetEditor3 = __webpack_require__(61);

var _i18n = __webpack_require__(219);

var _cornerstoneContent = __webpack_require__(349);

var _snippetEditor4 = __webpack_require__(61);

__webpack_require__(35);

var _classicEditor = __webpack_require__(844);

var _isGutenbergDataAvailable = __webpack_require__(533);

var _isGutenbergDataAvailable2 = _interopRequireDefault(_isGutenbergDataAvailable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// UI dependencies.
/* global YoastSEO: true, tinyMCE, wpseoReplaceVarsL10n, wpseoPostScraperL10n, YoastShortcodePlugin, YoastReplaceVarPlugin, console, require */

// External dependencies.
(0, _i18n.setYoastComponentsL10n)();

// Helper dependencies.


// Redux dependencies.


// Analysis dependencies.


// Internal dependencies.

(0, _i18n.setWordPressSeoL10n)();

(function ($) {
	"use strict"; // eslint-disable-line

	if (typeof wpseoPostScraperL10n === "undefined") {
		return;
	}

	var metaboxContainer = void 0;
	var titleElement = void 0;
	var app = void 0;
	var postDataCollector = void 0;
	var customAnalysisData = new _CustomAnalysisData2.default();

	var editStore = void 0;
	var edit = void 0;

	/**
  * Retrieves either a generated slug or the page title as slug for the preview.
  *
  * @param {Object} response The AJAX response object.
  *
  * @returns {String} The url path.
  */
	function getUrlPathFromResponse(response) {
		if (response.responseText === "") {
			return titleElement.val();
		}
		// Added divs to the response text, otherwise jQuery won't parse to HTML, but an array.
		return jQuery("<div>" + response.responseText + "</div>").find("#editable-post-name-full").text();
	}

	/**
  * Binds to the WordPress jQuery function to put the permalink on the page.
  * If the response matches with permalink string, the snippet can be rendered.
  */
	jQuery(document).on("ajaxComplete", function (ev, response, ajaxOptions) {
		var ajaxEndPoint = "/admin-ajax.php";
		if (ajaxEndPoint !== ajaxOptions.url.substr(0 - ajaxEndPoint.length)) {
			return;
		}

		if ("string" === typeof ajaxOptions.data && -1 !== ajaxOptions.data.indexOf("action=sample-permalink")) {
			/*
    * WordPress do not update post name for auto-generated slug, so we should leave this field untouched.
    */
			postDataCollector.leavePostNameUntouched = true;

			var snippetEditorData = {
				slug: getUrlPathFromResponse(response)
			};

			editStore.dispatch((0, _snippetEditor3.updateData)(snippetEditorData));
		}
	});

	/**
  * Determines if markers should be shown.
  *
  * @returns {boolean} True when markers should be shown.
  */
	function displayMarkers() {
		return !(0, _isGutenbergDataAvailable2.default)() && wpseoPostScraperL10n.show_markers === "1";
	}

	/**
  * Updates the store to indicate if the markers should be hidden.
  *
  * @param {Object} store The store.
  *
  * @returns {void}
  */
	function updateMarkerStatus(store) {
		// Only add markers when tinyMCE is loaded and show_markers is enabled (can be disabled by a WordPress hook).
		// Only check for the tinyMCE object because the actual editor isn't loaded at this moment yet.
		if (typeof tinyMCE === "undefined" || !displayMarkers()) {
			store.dispatch((0, _markerButtons.setMarkerStatus)("hidden"));
		}
	}

	/**
  * Initializes keyword analysis.
  *
  * @param {Object} publishBox             The publish box object.
  *
  * @returns {void}
  */
	function initializeKeywordAnalysis(publishBox) {
		var savedKeywordScore = $("#yoast_wpseo_linkdex").val();

		var indicator = (0, _getIndicatorForScore2.default)(savedKeywordScore);

		(0, _trafficLight.update)(indicator);
		(0, _adminBar.update)(indicator);

		publishBox.updateScore("keyword", indicator.className);
	}

	/**
  * Initializes content analysis
  *
  * @param {Object} publishBox The publish box object.
  *
  * @returns {void}
  */
	function initializeContentAnalysis(publishBox) {
		var savedContentScore = $("#yoast_wpseo_content_score").val();

		var indicator = (0, _getIndicatorForScore2.default)(savedContentScore);

		(0, _adminBar.update)(indicator);

		publishBox.updateScore("content", indicator.className);
	}

	/**
  * Retrieves the target to be passed to the App.
  *
  * @returns {Object} The targets object for the App.
  */
	function retrieveTargets() {
		var targets = {};

		if ((0, _isKeywordAnalysisActive2.default)()) {
			targets.output = "does-not-really-exist-but-it-needs-something";
		}

		if ((0, _isContentAnalysisActive2.default)()) {
			targets.contentOutput = "also-does-not-really-exist-but-it-needs-something";
		}

		return targets;
	}

	/**
  * Initializes post data collector.
  *
  * @param {Object} data The data.
  *
  * @returns {PostDataCollector} The initialized post data collector.
  */
	function initializePostDataCollector(data) {
		var postDataCollector = new _PostDataCollector2.default({
			data: data,
			store: editStore
		});

		/*
   * Initially any change on the slug needs to be persisted as post name.
   *
   * This value will change whenever an AJAX call is being detected that
   * populates the slug with a generated value based on the Title (or ID if no title is set).
   *
   * See bind event on "ajaxComplete" in this file.
   */
		postDataCollector.leavePostNameUntouched = false;

		return postDataCollector;
	}

	/**
  * Returns the arguments necessary to initialize the app.
  *
  * @param {Object} store The store.
  *
  * @returns {Object} The arguments to initialize the app
  */
	function getAppArgs(store) {
		updateMarkerStatus(store);
		var args = {
			// ID's of elements that need to trigger updating the analyzer.
			elementTarget: [_wpSeoTinymce2.default.tmceId, "yoast_wpseo_focuskw_text_input", "yoast_wpseo_metadesc", "excerpt", "editable-post-name", "editable-post-name-full"],
			targets: retrieveTargets(),
			callbacks: {
				getData: postDataCollector.getData.bind(postDataCollector)
			},
			locale: wpseoPostScraperL10n.contentLocale,
			marker: (0, _getApplyMarks2.default)(store),
			contentAnalysisActive: (0, _isContentAnalysisActive2.default)(),
			keywordAnalysisActive: (0, _isKeywordAnalysisActive2.default)(),
			hasSnippetPreview: false,
			debouncedRefresh: false
		};

		if ((0, _isKeywordAnalysisActive2.default)()) {
			store.dispatch((0, _focusKeyword.setFocusKeyword)($("#yoast_wpseo_focuskw").val()));

			args.callbacks.saveScores = postDataCollector.saveScores.bind(postDataCollector);
			args.callbacks.updatedKeywordsResults = function (results) {
				var keyword = store.getState().focusKeyword;

				store.dispatch((0, _yoastComponents.setSeoResultsForKeyword)(keyword, results));
				store.dispatch((0, _snippetEditor4.refreshSnippetEditor)());
			};
		}

		if ((0, _isContentAnalysisActive2.default)()) {
			args.callbacks.saveContentScore = postDataCollector.saveContentScore.bind(postDataCollector);
			args.callbacks.updatedContentResults = function (results) {
				store.dispatch((0, _yoastComponents.setReadabilityResults)(results));
				store.dispatch((0, _snippetEditor4.refreshSnippetEditor)());
			};
		}

		titleElement = $("#title");

		var translations = (0, _getTranslations2.default)();
		if (!(0, _isUndefined2.default)(translations) && !(0, _isUndefined2.default)(translations.domain)) {
			args.translations = translations;
		}
		return args;
	}

	/**
  * Exposes globals necessary for functionality of plugins integrating.
  *
  * @param {YoastReplaceVarPlugin} replaceVarsPlugin The replace vars plugin to expose.
  * @param {YoastShortcodePlugin} shortcodePlugin The shortcode plugin to expose.
  *
  * @returns {void}
  */
	function exposeGlobals(replaceVarsPlugin, shortcodePlugin) {
		// Init Plugins.
		window.YoastSEO.wp = {};
		window.YoastSEO.wp.replaceVarsPlugin = replaceVarsPlugin;
		window.YoastSEO.wp.shortcodePlugin = shortcodePlugin;

		window.YoastSEO.wp._tinyMCEHelper = _wpSeoTinymce2.default;
	}

	/**
  * Activates the correct analysis and tab based on which analyses are enabled.
  *
  * @returns {void}
  */
	function activateEnabledAnalysis() {
		if ((0, _isKeywordAnalysisActive2.default)()) {
			initializeKeywordAnalysis(_publishBox2.default);
		}

		if ((0, _isContentAnalysisActive2.default)()) {
			initializeContentAnalysis(_publishBox2.default);
		}
	}

	/**
  * Overwrites YoastSEO.js' app renderers.
  *
  * @param {Object} app YoastSEO.js app.
  *
  * @returns {void}
  */
	function disableYoastSEORenderers(app) {
		if (!(0, _isUndefined2.default)(app.seoAssessorPresenter)) {
			app.seoAssessorPresenter.render = function () {};
		}
		if (!(0, _isUndefined2.default)(app.contentAssessorPresenter)) {
			app.contentAssessorPresenter.render = function () {};
			app.contentAssessorPresenter.renderIndividualRatings = function () {};
		}
	}

	var currentAnalysisData = void 0;

	/**
  * Rerun the analysis when the title or metadescription in the snippet changes.
  *
  * @param {Object} store The store.
  * @param {Object} app The YoastSEO app.
  *
  * @returns {void}
  */
	function handleStoreChange(store, app) {
		var previousAnalysisData = currentAnalysisData || "";
		currentAnalysisData = store.getState().analysisData.snippet;

		var isDirty = !(0, _objects2.default)(previousAnalysisData, currentAnalysisData);
		if (isDirty) {
			app.refresh();
		}
	}

	/**
  * Handles page builder compatibility, regarding the marker buttons.
  *
  * @returns {void}
  */
	function handlePageBuilderCompatibility() {
		var compatibilityHelper = new _compatibilityHelper2.default();

		if (compatibilityHelper.isClassicEditorHidden()) {
			_wpSeoTinymce2.default.disableMarkerButtons();
		}

		if (compatibilityHelper.vcActive) {
			_wpSeoTinymce2.default.disableMarkerButtons();
		} else {
			compatibilityHelper.listen({
				classicEditorHidden: function classicEditorHidden() {
					_wpSeoTinymce2.default.disableMarkerButtons();
				},
				classicEditorShown: function classicEditorShown() {
					if (!_wpSeoTinymce2.default.isTextViewActive()) {
						_wpSeoTinymce2.default.enableMarkerButtons();
					}
				}
			});
		}
	}

	/**
  * Initializes analysis for the post edit screen.
  *
  * @returns {void}
  */
	function initializePostAnalysis() {
		var editArgs = {
			onRefreshRequest: function onRefreshRequest() {},
			snippetEditorBaseUrl: wpseoPostScraperL10n.base_url,
			snippetEditorDate: wpseoPostScraperL10n.metaDescriptionDate,
			replaceVars: wpseoReplaceVarsL10n.replace_vars,
			recommendedReplaceVars: wpseoReplaceVarsL10n.recommended_replace_vars
		};
		edit = new _edit2.default(editArgs);

		editStore = edit.getStore();
		var data = edit.getData();

		metaboxContainer = $("#wpseo_meta");

		_wpSeoTinymce2.default.setStore(editStore);
		_wpSeoTinymce2.default.wpTextViewOnInitCheck();
		handlePageBuilderCompatibility();

		// Avoid error when snippet metabox is not rendered.
		if (metaboxContainer.length === 0) {
			return;
		}

		postDataCollector = initializePostDataCollector(data);
		_publishBox2.default.initialize();

		var appArgs = getAppArgs(editStore);
		app = new _yoastseo.App(appArgs);

		// Expose globals.
		window.YoastSEO = {};
		window.YoastSEO.app = app;
		window.YoastSEO.store = editStore;
		window.YoastSEO.analysis = {};
		window.YoastSEO.analysis.worker = (0, _worker.createAnalysisWorker)();
		window.YoastSEO.analysis.collectData = function () {
			return (0, _collectAnalysisData2.default)(edit, YoastSEO.store, customAnalysisData, YoastSEO.app.pluggable);
		};
		window.YoastSEO.analysis.applyMarks = function (paper, marks) {
			return (0, _getApplyMarks2.default)(YoastSEO.store)(paper, marks);
		};

		// YoastSEO.app overwrites.
		YoastSEO.app.refresh = (0, _debounce2.default)(function () {
			return (0, _refreshAnalysis2.default)(YoastSEO.analysis.worker, YoastSEO.analysis.collectData, YoastSEO.analysis.applyMarks, YoastSEO.store, postDataCollector);
		}, _constants.refreshDelay);
		YoastSEO.app.registerCustomDataCallback = customAnalysisData.register;
		YoastSEO.app.pluggable = new _Pluggable2.default(YoastSEO.app.refresh);
		YoastSEO.app.registerPlugin = YoastSEO.app.pluggable._registerPlugin;
		YoastSEO.app.pluginReady = YoastSEO.app.pluggable._ready;
		YoastSEO.app.pluginReloaded = YoastSEO.app.pluggable._reloaded;
		YoastSEO.app.registerModification = YoastSEO.app.pluggable._registerModification;
		YoastSEO.app.registerAssessment = function (name, assessment, pluginName) {
			if (!(0, _isUndefined2.default)(YoastSEO.app.seoAssessor)) {
				return YoastSEO.app.pluggable._registerAssessment(YoastSEO.app.defaultSeoAssessor, name, assessment, pluginName) && YoastSEO.app.pluggable._registerAssessment(YoastSEO.app.cornerStoneSeoAssessor, name, assessment, pluginName);
			}
		};
		YoastSEO.app.changeAssessorOptions = function (assessorOptions) {
			YoastSEO.analysis.worker.initialize(assessorOptions);
			YoastSEO.app.refresh();
		};

		edit.initializeUsedKeywords(app, "get_focus_keyword_usage");

		postDataCollector.app = app;

		editStore.subscribe(handleStoreChange.bind(null, editStore, app));

		var replaceVarsPlugin = new YoastReplaceVarPlugin(app, editStore);
		var shortcodePlugin = new YoastShortcodePlugin(app);

		if (wpseoPostScraperL10n.markdownEnabled) {
			var markdownPlugin = new _wpSeoMarkdownPlugin2.default(app);
			markdownPlugin.register();
		}

		exposeGlobals(replaceVarsPlugin, shortcodePlugin);

		activateEnabledAnalysis();

		YoastSEO._registerReactComponent = _classicEditor.registerReactComponent;

		// Initialize the analysis worker.
		YoastSEO.analysis.worker.initialize((0, _worker.getAnalysisConfiguration)()).then(function () {
			jQuery(window).trigger("YoastSEO:ready");
		}).catch(function (error) {
			return console.warn(error);
		});

		// Backwards compatibility.
		YoastSEO.analyzerArgs = appArgs;

		postDataCollector.bindElementEvents(app);

		// Hack needed to make sure Publish box and traffic light are still updated.
		disableYoastSEORenderers(app);
		var originalInitAssessorPresenters = app.initAssessorPresenters.bind(app);
		app.initAssessorPresenters = function () {
			originalInitAssessorPresenters();
			disableYoastSEORenderers(app);
		};

		// Set refresh function. data.setRefresh is only defined when Gutenberg is available.
		if (data.setRefresh) {
			data.setRefresh(app.refresh);
		}

		// Initialize the snippet editor data.
		var snippetEditorData = _snippetEditor2.default.getDataFromCollector(postDataCollector);
		var snippetEditorTemplates = _snippetEditor2.default.getTemplatesFromL10n(wpseoPostScraperL10n);
		snippetEditorData = _snippetEditor2.default.getDataWithTemplates(snippetEditorData, snippetEditorTemplates);

		// Set the initial snippet editor data.
		editStore.dispatch((0, _snippetEditor3.updateData)(snippetEditorData));
		// This used to be a checkbox, then became a hidden input. For consistency, we set the value to '1'.
		editStore.dispatch((0, _cornerstoneContent.setCornerstoneContent)(document.getElementById("yoast_wpseo_is_cornerstone").value === "1"));

		// Save the keyword, in order to compare it to store changes.
		var focusKeyword = editStore.getState().focusKeyword;

		var refreshAfterFocusKeywordChange = (0, _debounce2.default)(function () {
			app.refresh();
		}, 50);

		var previousCornerstoneValue = null;

		editStore.subscribe(function () {
			// Verify whether the focusKeyword changed. If so, trigger refresh:
			var newFocusKeyword = editStore.getState().focusKeyword;

			if (focusKeyword !== newFocusKeyword) {
				focusKeyword = newFocusKeyword;

				$("#yoast_wpseo_focuskw").val(focusKeyword);
				refreshAfterFocusKeywordChange();
			}

			var data = _snippetEditor2.default.getDataFromStore(editStore);
			var dataWithoutTemplates = _snippetEditor2.default.getDataWithoutTemplates(data, snippetEditorTemplates);

			if (snippetEditorData.title !== data.title) {
				postDataCollector.setDataFromSnippet(dataWithoutTemplates.title, "snippet_title");
			}

			if (snippetEditorData.slug !== data.slug) {
				postDataCollector.setDataFromSnippet(dataWithoutTemplates.slug, "snippet_cite");
			}

			if (snippetEditorData.description !== data.description) {
				postDataCollector.setDataFromSnippet(dataWithoutTemplates.description, "snippet_meta");
			}

			var currentState = editStore.getState();

			if (previousCornerstoneValue !== currentState.isCornerstone) {
				previousCornerstoneValue = currentState.isCornerstone;
				document.getElementById("yoast_wpseo_is_cornerstone").value = currentState.isCornerstone;

				app.changeAssessorOptions({
					useCornerstone: currentState.isCornerstone
				});
			}

			snippetEditorData.title = data.title;
			snippetEditorData.slug = data.slug;
			snippetEditorData.description = data.description;
		});

		if (!(0, _isGutenbergDataAvailable2.default)()) {
			(0, _classicEditor.renderClassicEditorMetabox)(editStore);
		}

		(0, _refreshAnalysis.initializationDone)();
		YoastSEO.app.refresh();
	}

	jQuery(document).ready(initializePostAnalysis);
})(jQuery);

/***/ }),
/* 1417 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _marked = __webpack_require__(1418);

var _marked2 = _interopRequireDefault(_marked);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Plugin to parse markdown in the content before it is analyzed.
 */
var YoastMarkdownPlugin = function () {
	function YoastMarkdownPlugin(app) {
		_classCallCheck(this, YoastMarkdownPlugin);

		this._app = app;
	}

	/**
  * Registers the plugin and modification with YoastSEO.js
  *
  * @returns {void}
  */


	_createClass(YoastMarkdownPlugin, [{
		key: "register",
		value: function register() {
			this._app.registerPlugin("YoastMarkdownPlugin", { status: "ready" });
			this._app.registerModification("content", this.parseMarkdown.bind(this), "YoastMarkdownPlugin", 1);
		}

		/**
   * The modification that parses the markdown in the content.
   *
   * @param {string} content The content to parse.
   *
  	 * @returns {string} The parsed content
   */

	}, {
		key: "parseMarkdown",
		value: function parseMarkdown(content) {
			return (0, _marked2.default)(content);
		}
	}]);

	return YoastMarkdownPlugin;
}();

exports.default = YoastMarkdownPlugin;

/***/ }),
/* 1418 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
  ('def', '\\n+(?=' + block.def.source + ')')
  ();

block.blockquote = replace(block.blockquote)
  ('def', block.def)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/,
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top, bq) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3] || ''
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top, true);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false, bq);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: !this.options.sanitizer
          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
        text: cap[0]
      });
      continue;
    }

    // def
    if ((!bq && top) && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;
  this.renderer.options = this.options;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? this.options.sanitizer
          ? this.options.sanitizer(cap[0])
          : escape(cap[0])
        : cap[0]
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this.inLink = true;
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2], true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.text(escape(this.smartypants(cap[0])));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/---/g, '\u2014')
    // en-dashes
    .replace(/--/g, '\u2013')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  if (!this.options.mangle) return text;
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
      return '';
    }
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

Renderer.prototype.text = function(text) {
  return text;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this.token.align[i] };
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
	// explicitly match decimal, hex, and named HTML entities 
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (err) return done(err);
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  sanitizer: null,
  mangle: true,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer,
  xhtml: false
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (true) {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ }),
/* 1419 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /* global jQuery, wpseoPostScraperL10n */

/* External dependencies */


var _get = __webpack_require__(28);

var _get2 = _interopRequireDefault(_get);

var _yoastseo = __webpack_require__(70);

var _yoastseo2 = _interopRequireDefault(_yoastseo);

var _isKeywordAnalysisActive = __webpack_require__(320);

var _isKeywordAnalysisActive2 = _interopRequireDefault(_isKeywordAnalysisActive);

var _wpSeoTinymce = __webpack_require__(321);

var _wpSeoTinymce2 = _interopRequireDefault(_wpSeoTinymce);

var _getIndicatorForScore = __webpack_require__(324);

var _getIndicatorForScore2 = _interopRequireDefault(_getIndicatorForScore);

var _trafficLight = __webpack_require__(556);

var _adminBar = __webpack_require__(557);

var _publishBox = __webpack_require__(1022);

var _publishBox2 = _interopRequireDefault(_publishBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var measureTextWidth = _yoastseo2.default.helpers.measureTextWidth;
var removeMarks = _yoastseo2.default.markers.removeMarks;

/* Internal dependencies */

var $ = jQuery;

/**
 * Show warning in console when the unsupported CkEditor is used
 *
 * @param {Object} args The arguments for the post scraper.
 * @param {Object} args.data The data.
 *
 * @constructor
 */
var PostDataCollector = function PostDataCollector(args) {
	if ((typeof CKEDITOR === "undefined" ? "undefined" : _typeof(CKEDITOR)) === "object") {
		console.warn("YoastSEO currently doesn't support ckEditor. The content analysis currently only works with the HTML editor or TinyMCE.");
	}

	this._data = args.data;
	this._store = args.store;
};

/**
 * Get data from input fields and store them in an analyzerData object. This object will be used to fill
 * the analyzer and the snippet preview. If Gutenberg data is available, use it.
 *
 * @returns {Object} The data.
 */
PostDataCollector.prototype.getData = function () {
	var data = this._data.getData();
	var state = this._store.getState();

	var otherData = {
		keyword: (0, _isKeywordAnalysisActive2.default)() ? this.getKeyword() : "",
		meta: this.getMeta(),
		text: data.content,
		title: data.title,
		url: data.slug,
		excerpt: data.excerpt,
		snippetTitle: this.getSnippetTitle(),
		snippetMeta: this.getSnippetMeta(),
		snippetCite: this.getSnippetCite(),
		primaryCategory: this.getPrimaryCategory(),
		searchUrl: this.getSearchUrl(),
		postUrl: this.getPostUrl(),
		permalink: this.getPermalink(),
		titleWidth: measureTextWidth(this.getSnippetTitle())
	};

	var snippetData = {
		metaTitle: (0, _get2.default)(state, ["analysisData", "snippet", "title"], this.getSnippetTitle()),
		url: (0, _get2.default)(state, ["snippetEditor", "data", "slug"], data.slug),
		meta: this.getMetaDescForAnalysis(state)
	};

	return _extends({}, otherData, snippetData);
};

/**
 * Returns the keyword from the DOM.
 *
 * @returns {string} The keyword.
 */
PostDataCollector.prototype.getKeyword = function () {
	var val = document.getElementById("yoast_wpseo_focuskw") && document.getElementById("yoast_wpseo_focuskw").value || "";

	return val;
};

/**
 * Returns the full meta description including any prefixed date.
 *
 * @param {Object} state The state containing the meta description.
 *
 * @returns {string} The full meta description.
 */
PostDataCollector.prototype.getMetaDescForAnalysis = function (state) {
	var metaDesc = (0, _get2.default)(state, ["analysisData", "snippet", "description"], this.getSnippetMeta());
	if (wpseoPostScraperL10n.metaDescriptionDate !== "") {
		metaDesc = wpseoPostScraperL10n.metaDescriptionDate + " - " + metaDesc;
	}
	return metaDesc;
};

/**
 * Returns the Meta from the DOM.
 *
 * @returns {string} The meta description.
 */
PostDataCollector.prototype.getMeta = function () {
	return document.getElementById("yoast_wpseo_metadesc") && document.getElementById("yoast_wpseo_metadesc").value || "";
};

/**
 * Returns the Text from the DOM.
 *
 * @returns {string} The text.
 */
PostDataCollector.prototype.getText = function () {
	return removeMarks(_wpSeoTinymce2.default.getContentTinyMce(_wpSeoTinymce.tmceId));
};

/**
 * Returns the Title from the DOM.
 *
 * @returns {string} The title.
 */
PostDataCollector.prototype.getTitle = function () {
	return document.getElementById("title") && document.getElementById("title").value || "";
};

/**
 * Returns the Url from the DOM.
 *
 * @returns {string} The url.
 */
PostDataCollector.prototype.getUrl = function () {
	var url = "";

	var newPostSlug = $("#new-post-slug");
	if (0 < newPostSlug.length) {
		url = newPostSlug.val();
	} else if (document.getElementById("editable-post-name-full") !== null) {
		url = document.getElementById("editable-post-name-full").textContent;
	}

	return url;
};

/**
 * Returns the Excerpt from the DOM.
 *
 * @returns {string} The excerpt.
 */
PostDataCollector.prototype.getExcerpt = function () {
	var val = "";

	if (document.getElementById("excerpt") !== null) {
		val = document.getElementById("excerpt") && document.getElementById("excerpt").value || "";
	}

	return val;
};

/**
 * Returns the SnippetTitle from the DOM.
 *
 * @returns {string} The snippet title.
 */
PostDataCollector.prototype.getSnippetTitle = function () {
	return document.getElementById("yoast_wpseo_title") && document.getElementById("yoast_wpseo_title").value || "";
};

/**
 * Returns the SnippetMeta from the DOM.
 *
 * @returns {string} The snippet meta.
 */
PostDataCollector.prototype.getSnippetMeta = function () {
	return document.getElementById("yoast_wpseo_metadesc") && document.getElementById("yoast_wpseo_metadesc").value || "";
};

/**
 * Returns the SnippetCite from the DOM.
 *
 * @returns {string} The snippet cite.
 */
PostDataCollector.prototype.getSnippetCite = function () {
	return this.getUrl();
};

/**
 * Returns the PrimaryCategory from the DOM.
 *
 * @returns {string} The primary category.
 */
PostDataCollector.prototype.getPrimaryCategory = function () {
	var val = "";
	var categoryBase = $("#category-all").find("ul.categorychecklist");

	// If only one is visible than that item is the primary category.
	var checked = categoryBase.find("li input:checked");

	if (checked.length === 1) {
		val = this.getCategoryName(checked.parent());

		return val;
	}

	var primaryTerm = categoryBase.find(".wpseo-primary-term > label");

	if (primaryTerm.length) {
		val = this.getCategoryName(primaryTerm);

		return val;
	}

	return val;
};

/**
 * Returns the SearchUrl from the DOM.
 *
 * @returns {string} The search url.
 */
PostDataCollector.prototype.getSearchUrl = function () {
	return wpseoPostScraperL10n.search_url;
};

/**
 * Returns the PostUrl from the DOM.
 *
 * @returns {string} The post url.
 */
PostDataCollector.prototype.getPostUrl = function () {
	return wpseoPostScraperL10n.post_edit_url;
};

/**
 * Returns the Permalink from the DOM.
 *
 * @returns {string} The permalink.
 */
PostDataCollector.prototype.getPermalink = function () {
	var url = this.getUrl();

	return wpseoPostScraperL10n.base_url + url;
};

/**
 * Get the category name from the list item.
 *
 * @param {Object} li Item which contains the category.
 *
 * @returns {String}  Name of the category.
 */
PostDataCollector.prototype.getCategoryName = function (li) {
	var clone = li.clone();
	clone.children().remove();
	return $.trim(clone.text());
};

/**
 * When the snippet is updated, update the (hidden) fields on the page.
 *
 * @param {Object} value The value to set.
 * @param {String} type  The type to set the value for.
 *
 * @returns {void}
 */
PostDataCollector.prototype.setDataFromSnippet = function (value, type) {
	switch (type) {
		case "snippet_meta":
			document.getElementById("yoast_wpseo_metadesc").value = value;
			break;
		case "snippet_cite":

			/*
    * WordPress leaves the post name empty to signify that it should be generated from the title once the
    * post is saved. So when we receive an auto generated slug from WordPress we should be
    * able to not save this to the UI. This conditional makes that possible.
    */
			if (this.leavePostNameUntouched) {
				this.leavePostNameUntouched = false;
				return;
			}
			if (document.getElementById("post_name") !== null) {
				document.getElementById("post_name").value = value;
			}
			if (document.getElementById("editable-post-name") !== null && document.getElementById("editable-post-name-full") !== null) {
				document.getElementById("editable-post-name").textContent = value;
				document.getElementById("editable-post-name-full").textContent = value;
			}
			break;
		case "snippet_title":
			document.getElementById("yoast_wpseo_title").value = value;
			break;
		default:
			break;
	}
};

/**
 * The data passed from the snippet editor.
 *
 * @param {Object} data          Object with data value.
 * @param {string} data.title    The title.
 * @param {string} data.urlPath  The url.
 * @param {string} data.metaDesc The meta description.
 *
 * @returns {void}
 */
PostDataCollector.prototype.saveSnippetData = function (data) {
	this.setDataFromSnippet(data.title, "snippet_title");
	this.setDataFromSnippet(data.urlPath, "snippet_cite");
	this.setDataFromSnippet(data.metaDesc, "snippet_meta");
};

/**
 * Calls the event binders.
 *
 * @param {app} app The app object.
 *
 * @returns {void}
 */
PostDataCollector.prototype.bindElementEvents = function (app) {
	this.inputElementEventBinder(app);
	this.changeElementEventBinder(app);
};

/**
 * Binds the reanalyze timer on change of dom element.
 *
 * @param {app} app The app object.
 *
 * @returns {void}
 */
PostDataCollector.prototype.changeElementEventBinder = function (app) {
	var elems = ["#yoast-wpseo-primary-category", '.categorychecklist input[name="post_category[]"]'];
	for (var i = 0; i < elems.length; i++) {
		$(elems[i]).on("change", app.refresh.bind(app));
	}
};

/**
 * Binds the renewData function on the change of input elements.
 *
 * @param {app} app The app object.
 *
 * @returns {void}
 */
PostDataCollector.prototype.inputElementEventBinder = function (app) {
	var elems = ["excerpt", "content", "title"];
	for (var i = 0; i < elems.length; i++) {
		var elem = document.getElementById(elems[i]);
		if (elem !== null) {
			document.getElementById(elems[i]).addEventListener("input", app.refresh.bind(app));
		}
	}

	_wpSeoTinymce2.default.tinyMceEventBinder(app, _wpSeoTinymce.tmceId);
};

/**
 * Saves the score to the linkdex.
 * Outputs the score in the overall target.
 *
 * @param {string} score The score to save.
 * @param {string} keyword The keyword for the score.
 *
 * @returns {void}
 */
PostDataCollector.prototype.saveScores = function (score, keyword) {
	var indicator = (0, _getIndicatorForScore2.default)(score);

	_publishBox2.default.updateScore("content", indicator.className);

	document.getElementById("yoast_wpseo_linkdex").value = score;

	if ("" === keyword) {
		indicator.className = "na";
		indicator.screenReaderText = this.app.i18n.dgettext("js-text-analysis", "Enter a focus keyword to calculate the SEO score");
		indicator.fullText = this.app.i18n.dgettext("js-text-analysis", "Content optimization: Enter a focus keyword to calculate the SEO score");
	}

	(0, _trafficLight.update)(indicator);
	(0, _adminBar.update)(indicator);

	_publishBox2.default.updateScore("keyword", indicator.className);

	jQuery(window).trigger("YoastSEO:numericScore", score);
};

/**
 * Saves the content score to a hidden field.
 *
 * @param {number} score The score to save.
 *
 * @returns {void}
 */
PostDataCollector.prototype.saveContentScore = function (score) {
	var indicator = (0, _getIndicatorForScore2.default)(score);
	_publishBox2.default.updateScore("content", indicator.className);

	if (!(0, _isKeywordAnalysisActive2.default)()) {
		(0, _trafficLight.update)(indicator);
		(0, _adminBar.update)(indicator);
	}

	$("#yoast_wpseo_content_score").val(score);
};

exports.default = PostDataCollector;

/***/ })
],[1416]);