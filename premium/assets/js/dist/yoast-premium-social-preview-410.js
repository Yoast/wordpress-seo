(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"lodash/forEach":60,"lodash/memoize":72,"tokenizer2/core":74}],2:[function(require,module,exports){
"use strict";

/** @module stringProcessing/imageInText */

var matchStringWithRegex = require("./matchStringWithRegex.js");

/**
 * Checks the text for images.
 *
 * @param {string} text The textstring to check for images
 * @returns {Array} Array containing all types of found images
 */
module.exports = function (text) {
  return matchStringWithRegex(text, "<img(?:[^>]+)?>");
};

},{"./matchStringWithRegex.js":3}],3:[function(require,module,exports){
"use strict";

/** @module stringProcessing/matchStringWithRegex */

/**
 * Checks a string with a regex, return all matches found with that regex.
 *
 * @param {String} text The text to match the
 * @param {String} regexString A string to use as regex.
 * @returns {Array} Array with matches, empty array if no matches found.
 */

module.exports = function (text, regexString) {
  var regex = new RegExp(regexString, "ig");
  var matches = text.match(regex);

  if (matches === null) {
    matches = [];
  }

  return matches;
};

},{}],4:[function(require,module,exports){
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

},{"../helpers/html.js":1,"../stringProcessing/stripSpaces.js":5}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"./_hashClear":33,"./_hashDelete":34,"./_hashGet":35,"./_hashHas":36,"./_hashSet":37}],7:[function(require,module,exports){
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

},{"./_listCacheClear":42,"./_listCacheDelete":43,"./_listCacheGet":44,"./_listCacheHas":45,"./_listCacheSet":46}],8:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":30,"./_root":57}],9:[function(require,module,exports){
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

},{"./_mapCacheClear":47,"./_mapCacheDelete":48,"./_mapCacheGet":49,"./_mapCacheHas":50,"./_mapCacheSet":51}],10:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":57}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{"./_baseTimes":22,"./_isIndex":38,"./isArguments":62,"./isArray":63,"./isBuffer":65,"./isTypedArray":70}],13:[function(require,module,exports){
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

},{"./eq":59}],14:[function(require,module,exports){
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

},{"./_baseForOwn":16,"./_createBaseEach":26}],15:[function(require,module,exports){
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

},{"./_createBaseFor":27}],16:[function(require,module,exports){
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

},{"./_baseFor":15,"./keys":71}],17:[function(require,module,exports){
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

},{"./_Symbol":10,"./_getRawTag":31,"./_objectToString":55}],18:[function(require,module,exports){
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

},{"./_baseGetTag":17,"./isObjectLike":69}],19:[function(require,module,exports){
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

},{"./_isMasked":40,"./_toSource":58,"./isFunction":66,"./isObject":68}],20:[function(require,module,exports){
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

},{"./_baseGetTag":17,"./isLength":67,"./isObjectLike":69}],21:[function(require,module,exports){
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

},{"./_isPrototype":41,"./_nativeKeys":53}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{"./identity":61}],25:[function(require,module,exports){
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":57}],26:[function(require,module,exports){
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

},{"./isArrayLike":64}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],29:[function(require,module,exports){
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

},{"./_isKeyable":39}],30:[function(require,module,exports){
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

},{"./_baseIsNative":19,"./_getValue":32}],31:[function(require,module,exports){
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

},{"./_Symbol":10}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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

},{"./_nativeCreate":52}],34:[function(require,module,exports){
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

},{}],35:[function(require,module,exports){
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

},{"./_nativeCreate":52}],36:[function(require,module,exports){
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

},{"./_nativeCreate":52}],37:[function(require,module,exports){
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

},{"./_nativeCreate":52}],38:[function(require,module,exports){
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

},{}],39:[function(require,module,exports){
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

},{}],40:[function(require,module,exports){
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

},{"./_coreJsData":25}],41:[function(require,module,exports){
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

},{}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
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

},{"./_assocIndexOf":13}],44:[function(require,module,exports){
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

},{"./_assocIndexOf":13}],45:[function(require,module,exports){
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

},{"./_assocIndexOf":13}],46:[function(require,module,exports){
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

},{"./_assocIndexOf":13}],47:[function(require,module,exports){
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

},{"./_Hash":6,"./_ListCache":7,"./_Map":8}],48:[function(require,module,exports){
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

},{"./_getMapData":29}],49:[function(require,module,exports){
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

},{"./_getMapData":29}],50:[function(require,module,exports){
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

},{"./_getMapData":29}],51:[function(require,module,exports){
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

},{"./_getMapData":29}],52:[function(require,module,exports){
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":30}],53:[function(require,module,exports){
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":56}],54:[function(require,module,exports){
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

},{"./_freeGlobal":28}],55:[function(require,module,exports){
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

},{}],56:[function(require,module,exports){
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

},{}],57:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":28}],58:[function(require,module,exports){
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

},{}],59:[function(require,module,exports){
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

},{}],60:[function(require,module,exports){
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

},{"./_arrayEach":11,"./_baseEach":14,"./_castFunction":24,"./isArray":63}],61:[function(require,module,exports){
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

},{}],62:[function(require,module,exports){
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

},{"./_baseIsArguments":18,"./isObjectLike":69}],63:[function(require,module,exports){
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

},{}],64:[function(require,module,exports){
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

},{"./isFunction":66,"./isLength":67}],65:[function(require,module,exports){
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

},{"./_root":57,"./stubFalse":73}],66:[function(require,module,exports){
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

},{"./_baseGetTag":17,"./isObject":68}],67:[function(require,module,exports){
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

},{}],68:[function(require,module,exports){
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

},{}],69:[function(require,module,exports){
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

},{}],70:[function(require,module,exports){
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

},{"./_baseIsTypedArray":20,"./_baseUnary":23,"./_nodeUtil":54}],71:[function(require,module,exports){
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

},{"./_arrayLikeKeys":12,"./_baseKeys":21,"./isArrayLike":64}],72:[function(require,module,exports){
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

},{"./_MapCache":9}],73:[function(require,module,exports){
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

},{}],74:[function(require,module,exports){
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

},{}],75:[function(require,module,exports){
"use strict";

var getL10nObject = require("./getL10nObject");

/**
 * Returns the description placeholder for use in the description forms.
 *
 * @returns {string} The description placeholder.
 */
function getDescriptionPlaceholder() {
	var descriptionPlaceholder = "";
	var l10nObject = getL10nObject();

	if (l10nObject) {
		descriptionPlaceholder = l10nObject.metadesc_template;
	}

	return descriptionPlaceholder;
}

module.exports = getDescriptionPlaceholder;

},{"./getL10nObject":76}],76:[function(require,module,exports){
"use strict";

var isUndefined = require("lodash/isUndefined");

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

},{"lodash/isUndefined":78}],77:[function(require,module,exports){
"use strict";

var getL10nObject = require("./getL10nObject");

/**
 * Returns the title placeholder for use in the title forms.
 *
 * @returns {string} The title placeholder.
 */
function getTitlePlaceholder() {
	var titlePlaceholder = "";
	var l10nObject = getL10nObject();

	if (l10nObject) {
		titlePlaceholder = l10nObject.title_template;
	}

	if (titlePlaceholder === "") {
		titlePlaceholder = "%%title%% - %%sitename%%";
	}

	return titlePlaceholder;
}

module.exports = getTitlePlaceholder;

},{"./getL10nObject":76}],78:[function(require,module,exports){
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

},{}],79:[function(require,module,exports){
'use strict';

/* jshint -W097 */

/**
 * Returns the HTML for a help button
 *
 * @param {string} text The text to put in the button.
 * @param {string} controls The HTML ID of the element this button controls.
 *
 * @returns {string} Generated HTML.
 */
function helpButton(text, controls) {
  return '<button type="button" class="yoast_help yoast-help-button dashicons" aria-expanded="false" ' + 'aria-controls="' + controls + '"><span class="screen-reader-text">' + text + '</span></button>';
}

/**
 * Returns the HTML for a help button
 *
 * @param {string} text The text to put in the button.
 * @param {string} id The HTML ID to give this button.
 *
 * @returns {string} The generated HTMl.
 */
function helpText(text, id) {
  return '<p id="' + id + '" class="yoast-help-panel">' + text + '</p>';
}

module.exports = {
  helpButton: helpButton,
  helpText: helpText
};

},{}],80:[function(require,module,exports){
"use strict";

/* global yoastSocialPreview, tinyMCE, require, wp, YoastSEO, ajaxurl  */
/* jshint -W097 */

var getImages = require("yoastseo/js/stringProcessing/imageInText");
var helpPanel = require("./helpPanel");
var getTitlePlaceholder = require("../../../../js/src/analysis/getTitlePlaceholder");
var getDescriptionPlaceholder = require("../../../../js/src/analysis/getDescriptionPlaceholder");

var _debounce = require("lodash/debounce");
var clone = require("lodash/clone");
var forEach = require("lodash/forEach");
var _has = require("lodash/has");
var isUndefined = require("lodash/isUndefined");

var Jed = require("jed");
var socialPreviews = require("yoast-social-previews");

(function ($) {
	/**
  * We want to store the fallbacks in an object, to have directly access to them.
  * @type {{content: string, featured: string}}
  */
	var imageFallBack = {
		content: "",
		featured: ""
	};

	var canReadFeaturedImage = true;

	var FacebookPreview = socialPreviews.FacebookPreview;
	var TwitterPreview = socialPreviews.TwitterPreview;

	var facebookPreview, twitterPreview;

	var translations = yoastSocialPreview.i18n;

	var i18n = new Jed(addLibraryTranslations(translations.library));
	var biggerImages = {};

	var postTitleInputId = "title";

	/**
  * Sets the events for opening the WP media library when pressing the button.
  *
  * @param {Object} imageUrl The image URL object.
  * @param {string} imageButton ID name for the image button.
  * @param {string} removeButton ID name for the remove button.
  * @param {function} onMediaSelect The event that will be ran when image is chosen.
  * @param {Object} imagePreviewElement The image preview element that can be clicked to update as well.
  *
  * @returns {void}
  */
	function bindUploadButtonEvents(imageUrl, imageButton, removeButton, onMediaSelect, imagePreviewElement) {
		var socialPreviewUploader = wp.media.frames.file_frame = wp.media({
			title: yoastSocialPreview.choose_image,
			button: { text: yoastSocialPreview.choose_image },
			multiple: false
		});

		socialPreviewUploader.on("select", function () {
			var attachment = socialPreviewUploader.state().get("selection").first().toJSON();

			// Set the image URL.
			imageUrl.val(attachment.url);

			onMediaSelect();

			$(removeButton).show();
		});

		$(removeButton).click(function (evt) {
			evt.preventDefault();

			// Clear the image URL
			imageUrl.val("");

			onMediaSelect();

			$(removeButton).hide();
		});

		$(imageButton).click(function (evt) {
			evt.preventDefault();
			socialPreviewUploader.open();
		});

		$(imagePreviewElement).on("click", function (eventObject) {
			socialPreviewUploader.open();
		});
	}

	/**
  * Adds the choose image button and hides the input field.
  *
  * @param {Object} preview The preview to add the upload button to.
  *
  * @returns {void}
  */
	function addUploadButton(preview) {
		if (typeof wp.media === "undefined") {
			return;
		}

		var imageUrl = $(preview.element.formContainer).find(".js-snippet-editor-imageUrl");

		var buttonDiv = $("<div></div>");
		buttonDiv.insertAfter(imageUrl);

		var uploadButtonText = getUploadButtonText(preview);

		var imageFieldId = jQuery(imageUrl).attr("id");
		var imageButtonId = imageFieldId + "_button";
		var imageButtonHtml = '<button id="' + imageButtonId + '" ' + 'class="button button-primary wpseo_preview_image_upload_button" type="button">' + uploadButtonText + '</button>';

		var removeButtonId = imageFieldId + "_remove_button";
		var removeButtonHtml = '<button id="' + removeButtonId + '" type="button" ' + 'class="button wpseo_preview_image_upload_button">' + yoastSocialPreview.removeImageButton + '</button>';

		$(buttonDiv).append(imageButtonHtml);
		$(buttonDiv).append(removeButtonHtml);

		imageUrl.hide();
		if (imageUrl.val() === "") {
			$("#" + removeButtonId).hide();
		}

		bindUploadButtonEvents(imageUrl, "#" + imageButtonId, "#" + removeButtonId, preview.updatePreview.bind(preview), $(preview.element.container).find(".editable-preview__image"));
	}

	/**
  * Returns the type of the current page: post or term.
  *
  * @returns {string} The current type.
  */
	function getCurrentType() {
		// When this field exists, it is a post.
		if ($("#post_ID").length > 0) {
			return "post";
		}

		// When this field is found, it is a term.
		if ($("input[name=tag_ID]").length > 0) {
			return "term";
		}

		return "";
	}

	/**
  * Returns the prefix for the fields, because of the fields for the post do have an othere prefix than the ones for
  * a taxonomy.
  *
  * @returns {*} The prefix to use.
  */
	function fieldPrefix() {
		switch (getCurrentType()) {
			case "post":
				return "yoast_wpseo";
			case "term":
				return "wpseo";
			default:
				return "";
		}
	}

	/**
  * Returns the name of the tinymce and textarea fields.
  *
  * @returns {string} The name for the content field.
  */
	function contentTextName() {
		switch (getCurrentType()) {
			case "post":
				return "content";
			case "term":
				return "description";
			default:
				return "";
		}
	}

	/**
  * Creates the social preview container and hides the old form table, to replace it.
  *
  * @param {Object} socialPreviewholder The holder element where the container will be append to.
  * @param {string} containerId The id the container will get
  * @returns {void}
  */
	function createSocialPreviewContainer(socialPreviewholder, containerId) {
		socialPreviewholder.append('<div id="' + containerId + '"></div>');
	}

	/**
  * Gets the meta description from the snippet editor
  * @returns {void}
  */
	function getMetaDescription() {
		return $("#yoast_wpseo_metadesc").val();
	}

	/**
  * Returns the placeholder for the meta description field.
  *
  * @returns {string} The placeholder for the meta description.
  */
	function getSocialDescriptionPlaceholder() {
		var description = getMetaDescription();

		if ("" === description) {
			description = getDescriptionPlaceholder();
		}

		return description;
	}

	/**
  * Returns the arguments for the social preview prototypes.
  *
  * @param {string} targetElement The element where the preview is loaded.
  * @param {string} fieldPrefix The prefix each form element has.
  *
  * @returns { {
  * 		targetElement: Element,
  *		data: {title: *, description: *, imageUrl: *},
  * 		baseURL: *,
  * 		callbacks: {updateSocialPreview: callbacks.updateSocialPreview}
  * } } The arguments for the social preview.
  */
	function getSocialPreviewArgs(targetElement, fieldPrefix) {
		var titlePlaceholder = getTitlePlaceholder();
		var descriptionPlaceholder = getSocialDescriptionPlaceholder();

		var args = {
			targetElement: $(targetElement).get(0),
			data: {
				title: $("#" + fieldPrefix + "-title").val(),
				description: $("#" + fieldPrefix + "-description").val(),
				imageUrl: $("#" + fieldPrefix + "-image").val()
			},
			baseURL: yoastSocialPreview.website,
			callbacks: {
				updateSocialPreview: function updateSocialPreview(data) {
					$("#" + fieldPrefix + "-title").val(data.title);
					$("#" + fieldPrefix + "-description").val(data.description);
					$("#" + fieldPrefix + "-image").val(data.imageUrl);

					// Make sure Twitter is updated if a Facebook image is set
					$(".editable-preview").trigger("imageUpdate");

					if (data.imageUrl !== "") {
						var buttonPrefix = targetElement.attr("id").replace("Preview", "");
						setUploadButtonValue(buttonPrefix, yoastSocialPreview.useOtherImage);
					}

					jQuery(targetElement).find(".editable-preview").trigger("titleUpdate");
					jQuery(targetElement).find(".editable-preview").trigger("descriptionUpdate");
				},
				modifyImageUrl: function modifyImageUrl(imageUrl) {
					if (imageUrl === "") {
						imageUrl = getFallbackImage("");
					}

					return imageUrl;
				},
				modifyTitle: function modifyTitle(title) {
					if (fieldPrefix.indexOf("twitter") > -1) {
						if (title === $("#twitter-editor-title").attr("placeholder")) {
							var facebookTitle = $("#facebook-editor-title").val();
							if (!isUndefined(facebookTitle) && facebookTitle !== "") {
								title = facebookTitle;
							}
						}
					}
					return YoastSEO.wp.replaceVarsPlugin.replaceVariables(title);
				},
				modifyDescription: function modifyDescription(description) {
					if (fieldPrefix.indexOf("twitter") > -1) {
						if (description === $("#twitter-editor-description").attr("placeholder")) {
							var facebookDescription = $("#facebook-editor-description").val();
							if (facebookDescription !== "") {
								description = facebookDescription;
							}
						}
						if (isUndefined(description)) {
							description = $('#twitter-editor-description').attr('placeholder');
						}
					}

					return YoastSEO.wp.replaceVarsPlugin.replaceVariables(description);
				}
			},
			placeholder: {
				title: titlePlaceholder
			},
			defaultValue: {
				title: titlePlaceholder
			}
		};

		if ("" !== descriptionPlaceholder) {
			args.placeholder.description = descriptionPlaceholder;
			args.defaultValue.description = descriptionPlaceholder;
		}

		return args;
	}

	/**
  * Try to get the Facebook author name via AJAX and put it to the Facebook preview.
  *
  * @param {FacebookPreview} facebookPreview The Facebook preview object
  * @returns {void}
  */
	function getFacebookAuthor(facebookPreview) {
		$.get(ajaxurl, {
			action: "wpseo_get_facebook_name",
			_ajax_nonce: yoastSocialPreview.facebookNonce,
			user_id: $("#post_author_override").val()
		}, function (author) {
			if (author !== 0) {
				facebookPreview.setAuthor(author);
			}
		});
	}

	/**
  * Initialize the Facebook preview.
  *
  * @param {Object} facebookHolder Target element for adding the Facebook preview.
  * @returns {void}
  */
	function initFacebook(facebookHolder) {
		createSocialPreviewContainer(facebookHolder, "facebookPreview");

		var facebookPreviewContainer = $("#facebookPreview");
		facebookPreview = new FacebookPreview(getSocialPreviewArgs(facebookPreviewContainer, fieldPrefix() + "_opengraph"), i18n);

		facebookPreviewContainer.on("imageUpdate", ".editable-preview", function () {
			setUploadButtonValue("facebook", getUploadButtonText(facebookPreview));
			setFallbackImage(facebookPreview);
		});

		facebookPreview.init();

		addUploadButton(facebookPreview);

		var postAuthorDropdown = $("#post_author_override");
		if (postAuthorDropdown.length > 0) {
			postAuthorDropdown.on("change", getFacebookAuthor.bind(this, facebookPreview));
			postAuthorDropdown.trigger("change");
		}

		$("#" + postTitleInputId).on("keydown keyup input focus blur", _debounce(facebookPreview.updatePreview.bind(facebookPreview), 500));
	}

	/**
  * Initialize the twitter preview.
  *
  * @param {Object} twitterHolder Target element for adding the twitter preview.
  * @returns {void}
  */
	function initTwitter(twitterHolder) {
		createSocialPreviewContainer(twitterHolder, "twitterPreview");

		var twitterPreviewContainer = $("#twitterPreview");
		twitterPreview = new TwitterPreview(getSocialPreviewArgs(twitterPreviewContainer, fieldPrefix() + "_twitter"), i18n);

		twitterPreviewContainer.on("imageUpdate", ".editable-preview", function () {
			setUploadButtonValue("twitter", getUploadButtonText(twitterPreview));
			setFallbackImage(twitterPreview);
		});

		var facebookPreviewContainer = $("#facebookPreview");
		facebookPreviewContainer.on("titleUpdate", ".editable-preview", twitterTitleFallback.bind(this, twitterPreview));

		facebookPreviewContainer.on("descriptionUpdate", ".editable-preview", twitterDescriptionFallback.bind(this, twitterPreview));

		twitterPreview.init();

		addUploadButton(twitterPreview);
		twitterTitleFallback(twitterPreview);
		twitterDescriptionFallback(twitterPreview);

		$("#" + postTitleInputId).on("keydown keyup input focus blur", _debounce(twitterTitleFallback.bind(this, twitterPreview), 500));
	}

	/**
  * When twitter title is empty, use the Facebook title
  *
  * @param {TwitterPreview} twitterPreview The twitter preview object
  * @returns {void}
  */
	function twitterTitleFallback(twitterPreview) {
		var $twitterTitle = $("#twitter-editor-title");
		var twitterTitle = $twitterTitle.val();
		if (twitterTitle !== "") {
			return;
		}

		var facebookTitle = $("#facebook-editor-title").val();
		if (!isUndefined(facebookTitle) && facebookTitle !== "") {
			twitterPreview.setTitle(facebookTitle);
		} else {
			twitterPreview.setTitle($twitterTitle.attr("placeholder"));
		}
	}

	/**
  * When twitter description is empty, use the description title
  *
  * @param {TwitterPreview} twitterPreview The twitter preview object
  * @returns {void}
  */
	function twitterDescriptionFallback(twitterPreview) {
		var $twitterDescription = $("#twitter-editor-description");
		var twitterDescription = $twitterDescription.val();
		if (twitterDescription !== "") {
			return;
		}

		var facebookDescription = $("#facebook-editor-description").val();
		if (facebookDescription !== "") {
			twitterPreview.setDescription(facebookDescription);
		} else {
			twitterPreview.setDescription($twitterDescription.attr("placeholder"));
		}
	}

	/**
  * Set the fallback image for the preview if no image has been set
  *
  * @param {Object} preview Preview to set fallback image on.
  * @returns {void}
     */
	function setFallbackImage(preview) {
		if (preview.data.imageUrl === "") {
			preview.setImage(getFallbackImage(""));
		}
	}

	/**
  * Changes the upload button value when there are fallback images present.
  *
  * @param {string} buttonPrefix The value before the id name.
  * @param {string} text The text on the button.
  * @returns {void}
  */
	function setUploadButtonValue(buttonPrefix, text) {
		$("#" + buttonPrefix + "-editor-imageUrl_button").html(text);
	}

	/**
  * Bind the image events to set the fallback and rendering the preview.
  *
  * @returns {void}
  */
	function bindImageEvents() {
		if (getCurrentType() === "post") {
			bindFeaturedImageEvents();
		}

		bindContentEvents();
	}

	/**
  * Get the text that the upload button needs to display
  *
  * @param {Object} preview Preview to read image from.
  * @returns {*} The text for the button.
     */
	function getUploadButtonText(preview) {
		return preview.data.imageUrl === "" ? yoastSocialPreview.uploadImage : yoastSocialPreview.useOtherImage;
	}

	/**
  * Binds the events for the featured image.
  *
  * @returns {void}
  */
	function bindFeaturedImageEvents() {
		if (isUndefined(wp.media) || isUndefined(wp.media.featuredImage)) {
			return;
		}

		// When the featured image is being changed
		var featuredImage = wp.media.featuredImage.frame();

		featuredImage.on("select", function () {
			var imageDetails = featuredImage.state().get("selection").first().attributes;

			canReadFeaturedImage = true;

			setFeaturedImage(imageDetails.url);
		});

		$("#postimagediv").on("click", "#remove-post-thumbnail", function () {
			canReadFeaturedImage = false;

			clearFeaturedImage();
		});
	}

	/**
  * Bind the events for the content.
  *
  * @returns {void}
  */
	function bindContentEvents() {
		// Bind the event when something changed in the text editor.
		var contentElement = $("#" + contentTextName());
		if (contentElement.length > 0) {
			contentElement.on("input", detectImageFallback);
		}

		// Bind the events when something changed in the tinyMCE editor.
		if (typeof tinyMCE !== "undefined" && typeof tinyMCE.on === "function") {
			var events = ["input", "change", "cut", "paste"];
			tinyMCE.on("addEditor", function (e) {
				for (var i = 0; i < events.length; i++) {
					e.editor.on(events[i], detectImageFallback);
				}
			});
		}
	}

	/**
  * Sets the featured image fallback value as an empty value and runs the fallback method.
  *
  * @returns {void}
  */
	function clearFeaturedImage() {
		setFeaturedImage("");
		detectImageFallback();
	}

	/**
  * Sets the image fallbacks like the featured image (in case of a post) and the content image.
  *
  * @returns {void}
  */
	function detectImageFallback() {
		// In case of a post: we want to have the featured image.
		if (getCurrentType() === "post") {
			var featuredImage = getFeaturedImage();
			setFeaturedImage(featuredImage);

			if (featuredImage !== "") {
				return;
			}
		}

		setContentImage(getContentImage(function (image) {
			setContentImage(image);
		}));
	}

	/**
  * Sets the featured image based on the given image URL.
  *
  * @param {string} featuredImage The image we want to set.
  * @returns {void}
  */
	function setFeaturedImage(featuredImage) {
		if (imageFallBack.featured !== featuredImage) {
			imageFallBack.featured = featuredImage;

			// Just refresh the image URL.
			$(".editable-preview").trigger("imageUpdate");
		}
	}

	/**
  * Sets the content image base on the given image URL
  *
  * @param {string} contentImage The image we want to set.
  * @returns {void}
  */
	function setContentImage(contentImage) {
		if (imageFallBack.content !== contentImage) {
			imageFallBack.content = contentImage;

			// Just refresh the image URL.
			$(".editable-preview").trigger("imageUpdate");
		}
	}

	/**
  * Gets the featured image source from the DOM.
  *
  * @returns {string} The url to the featured image.
  */
	function getFeaturedImage() {
		if (canReadFeaturedImage === false) {
			return "";
		}

		var postThumbnail = $(".attachment-post-thumbnail");
		if (postThumbnail.length > 0) {
			return $(postThumbnail.get(0)).attr("src");
		}

		return "";
	}

	/**
  * Returns the image from the content.
  *
  * @param {Function} callback function to call if a bigger size is available.
  *
  * @returns {string} The first image found in the content.
  */
	function getContentImage(callback) {
		var content = getContent();

		var images = getImages(content);
		var image = "";

		if (images.length === 0) {
			return image;
		}

		do {
			var currentImage = images.shift();
			currentImage = $(currentImage);

			var imageSource = currentImage.prop("src");

			if (imageSource) {
				image = imageSource;
			}
		} while ("" === image && images.length > 0);

		image = getBiggerImage(image, callback);

		return image;
	}

	/**
  * Try to retrieve a bigger image for a certain image found in the content.
  *
  * @param {string}   url      The URL to retrieve.
  * @param {Function} callback The callback to call if there is a bigger image.
  * @returns {string} Returns the bigger image url.
  */
	function getBiggerImage(url, callback) {
		if (_has(biggerImages, url)) {
			return biggerImages[url];
		}

		retrieveImageDataFromURL(url, function (imageUrl) {
			biggerImages[url] = imageUrl;

			callback(imageUrl);
		});

		return url;
	}

	/**
  * Retrieves the image metadata from an image url and saves it to the image manager afterwards
  *
  * @param {string} url The image URL to retrieve the metadata from.
  * @param {Function} callback Callback to call with the image URL result.
  * @returns {void}
  */
	function retrieveImageDataFromURL(url, callback) {
		$.getJSON(ajaxurl, {
			action: "retrieve_image_data_from_url",
			imageURL: url
		}, function (response) {
			if ("success" === response.status) {
				callback(response.result);
			}
		});
	}

	/**
  * Returns the content from current visible content editor
  *
  * @returns {string} The value of the tinymce box.
  */
	function getContent() {
		if (isTinyMCEAvailable()) {
			return tinyMCE.get(contentTextName()).getContent();
		}

		var contentElement = $("#" + contentTextName());
		if (contentElement.length > 0) {
			return contentElement.val();
		}

		return "";
	}

	/**
  * Check if tinymce is active on the current page.
  *
  * @returns {boolean} True when tinymce is available.
  * @private
  */
	function isTinyMCEAvailable() {
		if (typeof tinyMCE === "undefined" || typeof tinyMCE.editors === "undefined" || tinyMCE.editors.length === 0 || tinyMCE.get(contentTextName()) === null || tinyMCE.get(contentTextName()).isHidden()) {
			return false;
		}

		return true;
	}

	/**
  * Check if there is a fallback image like the featured image or the first image in the content.
  *
  * @param {string} defaultImage The default image when nothing has been found.
  * @returns {string} The image to use.
  */
	function getFallbackImage(defaultImage) {
		// Twitter always first falls back to Facebook
		if (!isUndefined(facebookPreview) && facebookPreview.data.imageUrl !== "") {
			return facebookPreview.data.imageUrl;
		}

		// In case of an post: we want to have the featured image.
		if (getCurrentType() === "post") {
			if (imageFallBack.featured !== "") {
				return imageFallBack.featured;
			}
		}

		// When the featured image is empty, try an image in the content
		if (imageFallBack.content !== "") {
			return imageFallBack.content;
		}

		if (defaultImage !== undefined) {
			return defaultImage;
		}

		return "";
	}

	/**
  * Adds the help panels to the social previews
  *
  * @returns {void}
  */
	function addHelpPanels() {
		var panels = [{
			beforeElement: "#facebook-editor-imageUrl__caret-hook",
			buttonText: translations.helpButton.facebookImage,
			descriptionText: translations.help.facebookImage,
			id: "facebook-editor-image-help"
		}, {
			beforeElement: "#facebook-editor-title__caret-hook",
			buttonText: translations.helpButton.facebookTitle,
			descriptionText: translations.help.facebookTitle,
			id: "facebook-editor-title-help"
		}, {
			beforeElement: "#facebook-editor-description__caret-hook",
			buttonText: translations.helpButton.facebookDescription,
			descriptionText: translations.help.facebookDescription,
			id: "facebook-editor-description-help"
		}, {
			beforeElement: "#twitter-editor-imageUrl__caret-hook",
			buttonText: translations.helpButton.twitterImage,
			descriptionText: translations.help.twitterImage,
			id: "twitter-editor-image-help"
		}, {
			beforeElement: "#twitter-editor-title__caret-hook",
			buttonText: translations.helpButton.twitterTitle,
			descriptionText: translations.help.twitterTitle,
			id: "twitter-editor-title-help"
		}, {
			beforeElement: "#twitter-editor-description__caret-hook",
			buttonText: translations.helpButton.twitterDescription,
			descriptionText: translations.help.twitterDescription,
			id: "twitter-editor-description-help"
		}];

		forEach(panels, function (panel) {
			$(panel.beforeElement).before(helpPanel.helpButton(panel.buttonText, panel.id) + helpPanel.helpText(panel.descriptionText, panel.id));
		});

		$(".snippet-editor__form").on("click", ".yoast-help-button", function () {
			var $button = $(this),
			    helpPanel = $("#" + $button.attr("aria-controls")),
			    isPanelVisible = helpPanel.is(":visible");

			$(helpPanel).slideToggle(200, function () {
				$button.attr("aria-expanded", !isPanelVisible);
			});
		});
	}

	/**
  * Adds library translations
  * @param {Object} translations The translations to use.
  * @returns {Object} translations mapped to the proper domain.
  */
	function addLibraryTranslations(translations) {
		if (typeof translations !== "undefined" && typeof translations.domain !== "undefined") {
			translations.domain = "yoast-social-previews";
			translations.locale_data["yoast-social-previews"] = clone(translations.locale_data["wordpress-seo-premium"]);

			delete translations.locale_data["wordpress-seo-premium"];

			return translations;
		}

		return {
			domain: "yoast-social-previews",
			locale_data: {
				"yoast-social-previews": {
					"": {}
				}
			}
		};
	}

	/**
  * Initialize the social previews.
  *
  * @returns {void}
  */
	function initYoastSocialPreviews() {
		var facebookHolder = $("#wpseo_facebook");
		var twitterHolder = $("#wpseo_twitter");

		if (facebookHolder.length > 0 || twitterHolder.length > 0) {
			jQuery(window).on("YoastSEO:ready", function () {
				detectImageFallback();

				if (facebookHolder.length > 0) {
					initFacebook(facebookHolder);
				}

				if (twitterHolder.length > 0) {
					initTwitter(twitterHolder);
				}

				addHelpPanels();
				bindImageEvents();
			});
		}
	}

	$(initYoastSocialPreviews);
})(jQuery);

},{"../../../../js/src/analysis/getDescriptionPlaceholder":75,"../../../../js/src/analysis/getTitlePlaceholder":77,"./helpPanel":79,"jed":81,"lodash/clone":192,"lodash/debounce":193,"lodash/forEach":195,"lodash/has":196,"lodash/isUndefined":208,"yoast-social-previews":217,"yoastseo/js/stringProcessing/imageInText":2}],81:[function(require,module,exports){
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
  if (typeof exports !== 'undefined') {
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

},{}],82:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":143,"./_root":182}],83:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"./_hashClear":151,"./_hashDelete":152,"./_hashGet":153,"./_hashHas":154,"./_hashSet":155,"dup":6}],84:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"./_listCacheClear":164,"./_listCacheDelete":165,"./_listCacheGet":166,"./_listCacheHas":167,"./_listCacheSet":168,"dup":7}],85:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"./_getNative":143,"./_root":182,"dup":8}],86:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"./_mapCacheClear":169,"./_mapCacheDelete":170,"./_mapCacheGet":171,"./_mapCacheHas":172,"./_mapCacheSet":173,"dup":9}],87:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":143,"./_root":182}],88:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":143,"./_root":182}],89:[function(require,module,exports){
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

},{"./_ListCache":84,"./_stackClear":184,"./_stackDelete":185,"./_stackGet":186,"./_stackHas":187,"./_stackSet":188}],90:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"./_root":182,"dup":10}],91:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":182}],92:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":143,"./_root":182}],93:[function(require,module,exports){
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

},{}],94:[function(require,module,exports){
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

},{}],95:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"dup":11}],96:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"./_baseTimes":118,"./_isIndex":159,"./isArguments":198,"./isArray":199,"./isBuffer":201,"./isTypedArray":207,"dup":12}],97:[function(require,module,exports){
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

},{}],98:[function(require,module,exports){
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

},{}],99:[function(require,module,exports){
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

},{}],100:[function(require,module,exports){
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

},{"./_baseAssignValue":104,"./eq":194}],101:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"./eq":194,"dup":13}],102:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    keys = require('./keys');

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

},{"./_copyObject":132,"./keys":209}],103:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    keysIn = require('./keysIn');

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

},{"./_copyObject":132,"./keysIn":210}],104:[function(require,module,exports){
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

},{"./_defineProperty":138}],105:[function(require,module,exports){
var Stack = require('./_Stack'),
    arrayEach = require('./_arrayEach'),
    assignValue = require('./_assignValue'),
    baseAssign = require('./_baseAssign'),
    baseAssignIn = require('./_baseAssignIn'),
    cloneBuffer = require('./_cloneBuffer'),
    copyArray = require('./_copyArray'),
    copySymbols = require('./_copySymbols'),
    copySymbolsIn = require('./_copySymbolsIn'),
    getAllKeys = require('./_getAllKeys'),
    getAllKeysIn = require('./_getAllKeysIn'),
    getTag = require('./_getTag'),
    initCloneArray = require('./_initCloneArray'),
    initCloneByTag = require('./_initCloneByTag'),
    initCloneObject = require('./_initCloneObject'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isObject = require('./isObject'),
    keys = require('./keys');

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

},{"./_Stack":89,"./_arrayEach":95,"./_assignValue":100,"./_baseAssign":102,"./_baseAssignIn":103,"./_cloneBuffer":124,"./_copyArray":131,"./_copySymbols":133,"./_copySymbolsIn":134,"./_getAllKeys":140,"./_getAllKeysIn":141,"./_getTag":148,"./_initCloneArray":156,"./_initCloneByTag":157,"./_initCloneObject":158,"./isArray":199,"./isBuffer":201,"./isObject":204,"./keys":209}],106:[function(require,module,exports){
var isObject = require('./isObject');

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

},{"./isObject":204}],107:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./_baseForOwn":109,"./_createBaseEach":136,"dup":14}],108:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"./_createBaseFor":137,"dup":15}],109:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"./_baseFor":108,"./keys":209,"dup":16}],110:[function(require,module,exports){
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

},{"./_arrayPush":98,"./isArray":199}],111:[function(require,module,exports){
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

},{"./_Symbol":90,"./_getRawTag":145,"./_objectToString":180}],112:[function(require,module,exports){
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

},{}],113:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"./_baseGetTag":111,"./isObjectLike":205,"dup":18}],114:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"./_isMasked":162,"./_toSource":191,"./isFunction":202,"./isObject":204,"dup":19}],115:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"./_baseGetTag":111,"./isLength":203,"./isObjectLike":205,"dup":20}],116:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"./_isPrototype":163,"./_nativeKeys":177,"dup":21}],117:[function(require,module,exports){
var isObject = require('./isObject'),
    isPrototype = require('./_isPrototype'),
    nativeKeysIn = require('./_nativeKeysIn');

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

},{"./_isPrototype":163,"./_nativeKeysIn":178,"./isObject":204}],118:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],119:[function(require,module,exports){
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

},{"./_Symbol":90,"./_arrayMap":97,"./isArray":199,"./isSymbol":206}],120:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],121:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"./identity":197,"dup":24}],122:[function(require,module,exports){
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

},{"./_isKey":160,"./_stringToPath":189,"./isArray":199,"./toString":216}],123:[function(require,module,exports){
var Uint8Array = require('./_Uint8Array');

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

},{"./_Uint8Array":91}],124:[function(require,module,exports){
var root = require('./_root');

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

},{"./_root":182}],125:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer');

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

},{"./_cloneArrayBuffer":123}],126:[function(require,module,exports){
var addMapEntry = require('./_addMapEntry'),
    arrayReduce = require('./_arrayReduce'),
    mapToArray = require('./_mapToArray');

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

},{"./_addMapEntry":93,"./_arrayReduce":99,"./_mapToArray":174}],127:[function(require,module,exports){
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

},{}],128:[function(require,module,exports){
var addSetEntry = require('./_addSetEntry'),
    arrayReduce = require('./_arrayReduce'),
    setToArray = require('./_setToArray');

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

},{"./_addSetEntry":94,"./_arrayReduce":99,"./_setToArray":183}],129:[function(require,module,exports){
var Symbol = require('./_Symbol');

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

},{"./_Symbol":90}],130:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer');

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

},{"./_cloneArrayBuffer":123}],131:[function(require,module,exports){
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

},{}],132:[function(require,module,exports){
var assignValue = require('./_assignValue'),
    baseAssignValue = require('./_baseAssignValue');

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

},{"./_assignValue":100,"./_baseAssignValue":104}],133:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    getSymbols = require('./_getSymbols');

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

},{"./_copyObject":132,"./_getSymbols":146}],134:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    getSymbolsIn = require('./_getSymbolsIn');

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

},{"./_copyObject":132,"./_getSymbolsIn":147}],135:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"./_root":182,"dup":25}],136:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"./isArrayLike":200,"dup":26}],137:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],138:[function(require,module,exports){
var getNative = require('./_getNative');

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;

},{"./_getNative":143}],139:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],140:[function(require,module,exports){
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

},{"./_baseGetAllKeys":110,"./_getSymbols":146,"./keys":209}],141:[function(require,module,exports){
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbolsIn = require('./_getSymbolsIn'),
    keysIn = require('./keysIn');

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

},{"./_baseGetAllKeys":110,"./_getSymbolsIn":147,"./keysIn":210}],142:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"./_isKeyable":161,"dup":29}],143:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"./_baseIsNative":114,"./_getValue":149,"dup":30}],144:[function(require,module,exports){
var overArg = require('./_overArg');

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;

},{"./_overArg":181}],145:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"./_Symbol":90,"dup":31}],146:[function(require,module,exports){
var overArg = require('./_overArg'),
    stubArray = require('./stubArray');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

module.exports = getSymbols;

},{"./_overArg":181,"./stubArray":213}],147:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    getPrototype = require('./_getPrototype'),
    getSymbols = require('./_getSymbols'),
    stubArray = require('./stubArray');

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

},{"./_arrayPush":98,"./_getPrototype":144,"./_getSymbols":146,"./stubArray":213}],148:[function(require,module,exports){
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

},{"./_DataView":82,"./_Map":85,"./_Promise":87,"./_Set":88,"./_WeakMap":92,"./_baseGetTag":111,"./_toSource":191}],149:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],150:[function(require,module,exports){
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

},{"./_castPath":122,"./_isIndex":159,"./_toKey":190,"./isArguments":198,"./isArray":199,"./isLength":203}],151:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"./_nativeCreate":176,"dup":33}],152:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],153:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"./_nativeCreate":176,"dup":35}],154:[function(require,module,exports){
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

},{"./_nativeCreate":176}],155:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"./_nativeCreate":176,"dup":37}],156:[function(require,module,exports){
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

},{}],157:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer'),
    cloneDataView = require('./_cloneDataView'),
    cloneMap = require('./_cloneMap'),
    cloneRegExp = require('./_cloneRegExp'),
    cloneSet = require('./_cloneSet'),
    cloneSymbol = require('./_cloneSymbol'),
    cloneTypedArray = require('./_cloneTypedArray');

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

},{"./_cloneArrayBuffer":123,"./_cloneDataView":125,"./_cloneMap":126,"./_cloneRegExp":127,"./_cloneSet":128,"./_cloneSymbol":129,"./_cloneTypedArray":130}],158:[function(require,module,exports){
var baseCreate = require('./_baseCreate'),
    getPrototype = require('./_getPrototype'),
    isPrototype = require('./_isPrototype');

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

},{"./_baseCreate":106,"./_getPrototype":144,"./_isPrototype":163}],159:[function(require,module,exports){
arguments[4][38][0].apply(exports,arguments)
},{"dup":38}],160:[function(require,module,exports){
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

},{"./isArray":199,"./isSymbol":206}],161:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],162:[function(require,module,exports){
arguments[4][40][0].apply(exports,arguments)
},{"./_coreJsData":135,"dup":40}],163:[function(require,module,exports){
arguments[4][41][0].apply(exports,arguments)
},{"dup":41}],164:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"dup":42}],165:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"./_assocIndexOf":101,"dup":43}],166:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"./_assocIndexOf":101,"dup":44}],167:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"./_assocIndexOf":101,"dup":45}],168:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"./_assocIndexOf":101,"dup":46}],169:[function(require,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"./_Hash":83,"./_ListCache":84,"./_Map":85,"dup":47}],170:[function(require,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"./_getMapData":142,"dup":48}],171:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"./_getMapData":142,"dup":49}],172:[function(require,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"./_getMapData":142,"dup":50}],173:[function(require,module,exports){
arguments[4][51][0].apply(exports,arguments)
},{"./_getMapData":142,"dup":51}],174:[function(require,module,exports){
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

},{}],175:[function(require,module,exports){
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

},{"./memoize":211}],176:[function(require,module,exports){
arguments[4][52][0].apply(exports,arguments)
},{"./_getNative":143,"dup":52}],177:[function(require,module,exports){
arguments[4][53][0].apply(exports,arguments)
},{"./_overArg":181,"dup":53}],178:[function(require,module,exports){
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

},{}],179:[function(require,module,exports){
arguments[4][54][0].apply(exports,arguments)
},{"./_freeGlobal":139,"dup":54}],180:[function(require,module,exports){
arguments[4][55][0].apply(exports,arguments)
},{"dup":55}],181:[function(require,module,exports){
arguments[4][56][0].apply(exports,arguments)
},{"dup":56}],182:[function(require,module,exports){
arguments[4][57][0].apply(exports,arguments)
},{"./_freeGlobal":139,"dup":57}],183:[function(require,module,exports){
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

},{}],184:[function(require,module,exports){
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

},{"./_ListCache":84}],185:[function(require,module,exports){
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

},{}],186:[function(require,module,exports){
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

},{}],187:[function(require,module,exports){
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

},{}],188:[function(require,module,exports){
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

},{"./_ListCache":84,"./_Map":85,"./_MapCache":86}],189:[function(require,module,exports){
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

},{"./_memoizeCapped":175}],190:[function(require,module,exports){
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

},{"./isSymbol":206}],191:[function(require,module,exports){
arguments[4][58][0].apply(exports,arguments)
},{"dup":58}],192:[function(require,module,exports){
var baseClone = require('./_baseClone');

/** Used to compose bitmasks for cloning. */
var CLONE_SYMBOLS_FLAG = 4;

/**
 * Creates a shallow clone of `value`.
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
 * and supports cloning arrays, array buffers, booleans, date objects, maps,
 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
 * arrays. The own enumerable properties of `arguments` objects are cloned
 * as plain objects. An empty object is returned for uncloneable values such
 * as error objects, functions, DOM nodes, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to clone.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeep
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var shallow = _.clone(objects);
 * console.log(shallow[0] === objects[0]);
 * // => true
 */
function clone(value) {
  return baseClone(value, CLONE_SYMBOLS_FLAG);
}

module.exports = clone;

},{"./_baseClone":105}],193:[function(require,module,exports){
var isObject = require('./isObject'),
    now = require('./now'),
    toNumber = require('./toNumber');

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

},{"./isObject":204,"./now":212,"./toNumber":215}],194:[function(require,module,exports){
arguments[4][59][0].apply(exports,arguments)
},{"dup":59}],195:[function(require,module,exports){
arguments[4][60][0].apply(exports,arguments)
},{"./_arrayEach":95,"./_baseEach":107,"./_castFunction":121,"./isArray":199,"dup":60}],196:[function(require,module,exports){
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

},{"./_baseHas":112,"./_hasPath":150}],197:[function(require,module,exports){
arguments[4][61][0].apply(exports,arguments)
},{"dup":61}],198:[function(require,module,exports){
arguments[4][62][0].apply(exports,arguments)
},{"./_baseIsArguments":113,"./isObjectLike":205,"dup":62}],199:[function(require,module,exports){
arguments[4][63][0].apply(exports,arguments)
},{"dup":63}],200:[function(require,module,exports){
arguments[4][64][0].apply(exports,arguments)
},{"./isFunction":202,"./isLength":203,"dup":64}],201:[function(require,module,exports){
arguments[4][65][0].apply(exports,arguments)
},{"./_root":182,"./stubFalse":214,"dup":65}],202:[function(require,module,exports){
arguments[4][66][0].apply(exports,arguments)
},{"./_baseGetTag":111,"./isObject":204,"dup":66}],203:[function(require,module,exports){
arguments[4][67][0].apply(exports,arguments)
},{"dup":67}],204:[function(require,module,exports){
arguments[4][68][0].apply(exports,arguments)
},{"dup":68}],205:[function(require,module,exports){
arguments[4][69][0].apply(exports,arguments)
},{"dup":69}],206:[function(require,module,exports){
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

},{"./_baseGetTag":111,"./isObjectLike":205}],207:[function(require,module,exports){
arguments[4][70][0].apply(exports,arguments)
},{"./_baseIsTypedArray":115,"./_baseUnary":120,"./_nodeUtil":179,"dup":70}],208:[function(require,module,exports){
arguments[4][78][0].apply(exports,arguments)
},{"dup":78}],209:[function(require,module,exports){
arguments[4][71][0].apply(exports,arguments)
},{"./_arrayLikeKeys":96,"./_baseKeys":116,"./isArrayLike":200,"dup":71}],210:[function(require,module,exports){
var arrayLikeKeys = require('./_arrayLikeKeys'),
    baseKeysIn = require('./_baseKeysIn'),
    isArrayLike = require('./isArrayLike');

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

},{"./_arrayLikeKeys":96,"./_baseKeysIn":117,"./isArrayLike":200}],211:[function(require,module,exports){
arguments[4][72][0].apply(exports,arguments)
},{"./_MapCache":86,"dup":72}],212:[function(require,module,exports){
var root = require('./_root');

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

},{"./_root":182}],213:[function(require,module,exports){
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

},{}],214:[function(require,module,exports){
arguments[4][73][0].apply(exports,arguments)
},{"dup":73}],215:[function(require,module,exports){
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

},{"./isObject":204,"./isSymbol":206}],216:[function(require,module,exports){
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

},{"./_baseToString":119}],217:[function(require,module,exports){
"use strict";

module.exports = {
	FacebookPreview: require("./js/facebookPreview"),
	TwitterPreview: require("./js/twitterPreview")
};

},{"./js/facebookPreview":220,"./js/twitterPreview":234}],218:[function(require,module,exports){
"use strict";

var placeholderTemplate = require("../templates").imagePlaceholder;

/**
 * Sets the placeholder with a given value.
 *
 * @param {Object} imageContainer The location to put the placeholder in.
 * @param {string} placeholder The value for the placeholder.
 * @param {boolean} isError When the placeholder should an error.
 * @param {string} modifier A css class modifier to change the styling.
 */
function setImagePlaceholder(imageContainer, placeholder, isError, modifier) {
	var classNames = ["social-image-placeholder"];
	isError = isError || false;
	modifier = modifier || "";

	if (isError) {
		classNames.push("social-image-placeholder--error");
	}

	if ("" !== modifier) {
		classNames.push("social-image-placeholder--" + modifier);
	}

	imageContainer.innerHTML = placeholderTemplate({
		className: classNames.join(" "),
		placeholder: placeholder
	});
}

module.exports = setImagePlaceholder;

},{"../templates":233}],219:[function(require,module,exports){
"use strict";

var isEmpty = require("lodash/lang/isEmpty");
var debounce = require("lodash/function/debounce");

var stripHTMLTags = require("yoastseo/js/stringProcessing/stripHTMLTags.js");
var stripSpaces = require("yoastseo/js/stringProcessing/stripSpaces.js");

/**
 * Represents a field and sets the events for that field.
 *
 * @param {Object} inputField The field to represent.
 * @param {Object} values The values to use.
 * @param {Object|undefined} callback The callback to executed after field change.
 * @constructor
 */
function InputElement(inputField, values, callback) {
	this.inputField = inputField;
	this.values = values;
	this._callback = callback;

	this.setValue(this.getInputValue());

	this.bindEvents();
}

/**
 * Binds the events
 */
InputElement.prototype.bindEvents = function () {
	// Set the events.
	this.inputField.addEventListener("keydown", this.changeEvent.bind(this));
	this.inputField.addEventListener("keyup", this.changeEvent.bind(this));

	this.inputField.addEventListener("input", this.changeEvent.bind(this));
	this.inputField.addEventListener("focus", this.changeEvent.bind(this));
	this.inputField.addEventListener("blur", this.changeEvent.bind(this));
};

/**
 * Do the change event
 *
 * @type {Function}
 */
InputElement.prototype.changeEvent = debounce(function () {
	// When there is a callback run it.
	if (typeof this._callback !== "undefined") {
		this._callback();
	}

	this.setValue(this.getInputValue());
}, 25);

/**
 *
 * @returns {string} The current field value
 */
InputElement.prototype.getInputValue = function () {
	return this.inputField.value;
};

/**
 * Formats the a value for the preview. If value is empty a sample value is used
 *
 * @returns {string} The formatted title, without html tags.
 */
InputElement.prototype.formatValue = function () {
	var value = this.getValue();

	value = stripHTMLTags(value);

	// As an ultimate fallback provide the user with a helpful message.
	if (isEmpty(value)) {
		value = this.values.fallback;
	}

	return stripSpaces(value);
};

/**
 * Get the value
 *
 * @returns {string} Return the value or get a fallback one.
 */
InputElement.prototype.getValue = function () {
	var value = this.values.currentValue;

	// Fallback to the default if value is empty.
	if (isEmpty(value)) {
		value = this.values.defaultValue;
	}

	// For rendering we can fallback to the placeholder as well.
	if (isEmpty(value)) {
		value = this.values.placeholder;
	}

	return value;
};

/**
 * Set the current value
 *
 * @param {string} value The value to set
 */
InputElement.prototype.setValue = function (value) {
	this.values.currentValue = value;
};

module.exports = InputElement;

},{"lodash/function/debounce":238,"lodash/lang/isEmpty":278,"yoastseo/js/stringProcessing/stripHTMLTags.js":4,"yoastseo/js/stringProcessing/stripSpaces.js":5}],220:[function(require,module,exports){
"use strict";

/* jshint browser: true */

var isElement = require("lodash/lang/isElement");
var clone = require("lodash/lang/clone");
var defaultsDeep = require("lodash/object/defaultsDeep");

var Jed = require("jed");

var imageDisplayMode = require("./helpers/imageDisplayMode");
var renderDescription = require("./helpers/renderDescription");
var imagePlaceholder = require("./element/imagePlaceholder");
var bemAddModifier = require("./helpers/bem/addModifier");
var bemRemoveModifier = require("./helpers/bem/removeModifier");

var TextField = require("./inputs/textInput");
var TextArea = require("./inputs/textarea");

var InputElement = require("./element/input");
var PreviewEvents = require("./preview/events");

var templates = require("./templates.js");
var facebookEditorTemplate = templates.facebookPreview;
var facebookAuthorTemplate = templates.facebookAuthor;

var facebookDefaults = {
	data: {
		title: "",
		description: "",
		imageUrl: ""
	},
	defaultValue: {
		title: "",
		description: "",
		imageUrl: ""
	},
	baseURL: "example.com",
	callbacks: {
		updateSocialPreview: function updateSocialPreview() {},
		modifyTitle: function modifyTitle(title) {
			return title;
		},
		modifyDescription: function modifyDescription(description) {
			return description;
		},
		modifyImageUrl: function modifyImageUrl(imageUrl) {
			return imageUrl;
		}
	}
};

var inputFacebookPreviewBindings = [{
	"preview": "editable-preview__title--facebook",
	"inputField": "title"
}, {
	"preview": "editable-preview__image--facebook",
	"inputField": "imageUrl"
}, {
	"preview": "editable-preview__description--facebook",
	"inputField": "description"
}];

var WIDTH_FACEBOOK_IMAGE_SMALL = 158;
var WIDTH_FACEBOOK_IMAGE_LARGE = 470;

var FACEBOOK_IMAGE_TOO_SMALL_WIDTH = 200;
var FACEBOOK_IMAGE_TOO_SMALL_HEIGHT = 200;

var FACEBOOK_IMAGE_THRESHOLD_WIDTH = 600;
var FACEBOOK_IMAGE_THRESHOLD_HEIGHT = 315;

/**
 * @module snippetPreview
 */

/**
 * Defines the config and outputTarget for the SnippetPreview
 *
 * @param {Object}         opts                           - Snippet preview options.
 * @param {Object}         opts.placeholder               - The placeholder values for the fields, will be shown as
 * actual placeholders in the inputs and as a fallback for the preview.
 * @param {string}         opts.placeholder.title         - Placeholder for the title field.
 * @param {string}         opts.placeholder.description   - Placeholder for the description field.
 * @param {string}         opts.placeholder.imageUrl      - Placeholder for the image url field.
 *
 * @param {Object}         opts.defaultValue              - The default value for the fields, if the user has not
 * changed a field, this value will be used for the analyzer, preview and the progress bars.
 * @param {string}         opts.defaultValue.title        - Default title.
 * @param {string}         opts.defaultValue.description  - Default description.
 * @param {string}         opts.defaultValue.imageUrl     - Default image url.
 * it.
 *
 * @param {string}         opts.baseURL                   - The basic URL as it will be displayed in Facebook.
 * @param {HTMLElement}    opts.targetElement             - The target element that contains this snippet editor.
 *
 * @param {Object}         opts.callbacks                 - Functions that are called on specific instances.
 * @param {Function}       opts.callbacks.updateSocialPreview - Function called when the social preview is updated.
 *
 * @param {Object}         i18n                           - The i18n object.
 *
 * @property {Object}      i18n                           - The translation object.
 *
 * @property {HTMLElement} targetElement                  - The target element that contains this snippet editor.
 *
 * @property {Object}      element                        - The elements for this snippet editor.
 * @property {Object}      element.rendered               - The rendered elements.
 * @property {HTMLElement} element.rendered.title         - The rendered title element.
 * @property {HTMLElement} element.rendered.imageUrl      - The rendered url path element.
 * @property {HTMLElement} element.rendered.description   - The rendered Facebook description element.
 *
 * @property {Object}      element.input                  - The input elements.
 * @property {HTMLElement} element.input.title            - The title input element.
 * @property {HTMLElement} element.input.imageUrl         - The url path input element.
 * @property {HTMLElement} element.input.description      - The meta description input element.
 *
 * @property {HTMLElement} element.container              - The main container element.
 * @property {HTMLElement} element.formContainer          - The form container element.
 * @property {HTMLElement} element.editToggle             - The button that toggles the editor form.
 *
 * @property {Object}      data                           - The data for this snippet editor.
 * @property {string}      data.title                     - The title.
 * @property {string}      data.imageUrl                  - The url path.
 * @property {string}      data.description               - The meta description.
 *
 * @property {string}      baseURL                        - The basic URL as it will be displayed in google.
 *
 * @constructor
 */
var FacebookPreview = function FacebookPreview(opts, i18n) {
	this.i18n = i18n || this.constructI18n();

	facebookDefaults.placeholder = {
		title: this.i18n.dgettext("yoast-social-previews", "This is an example title - edit by clicking here"),
		description: this.i18n.sprintf(
		/** translators: %1$s expands to Facebook */
		this.i18n.dgettext("yoast-social-previews", "Modify your %1$s description by editing it right here"), "Facebook"),
		imageUrl: ""
	};

	defaultsDeep(opts, facebookDefaults);

	if (!isElement(opts.targetElement)) {
		throw new Error("The Facebook preview requires a valid target element");
	}

	this.data = opts.data;
	this.opts = opts;

	this._currentFocus = null;
	this._currentHover = null;
};

/**
 * Initializes i18n object based on passed configuration
 *
 * @param {Object} translations - The values to translate.
 *
 * @returns {Jed} - The Jed translation object.
 */
FacebookPreview.prototype.constructI18n = function (translations) {
	var defaultTranslations = {
		"domain": "yoast-social-previews",
		"locale_data": {
			"yoast-social-previews": {
				"": {}
			}
		}
	};

	translations = translations || {};

	defaultsDeep(translations, defaultTranslations);

	return new Jed(translations);
};

/**
 * Renders the template and bind the events.
 *
 * @returns {void}
 */
FacebookPreview.prototype.init = function () {
	this.renderTemplate();
	this.bindEvents();
	this.updatePreview();
};

/**
 * Renders snippet editor and adds it to the targetElement.
 *
 * @returns {void}
 */
FacebookPreview.prototype.renderTemplate = function () {
	var targetElement = this.opts.targetElement;

	targetElement.innerHTML = facebookEditorTemplate({
		rendered: {
			title: "",
			description: "",
			imageUrl: "",
			baseUrl: this.opts.baseURL
		},
		placeholder: this.opts.placeholder,
		i18n: {
			/** translators: %1$s expands to Facebook */
			edit: this.i18n.sprintf(this.i18n.dgettext("yoast-social-previews", "Edit %1$s preview"), "Facebook"),
			/** translators: %1$s expands to Facebook */
			snippetPreview: this.i18n.sprintf(this.i18n.dgettext("yoast-social-previews", "%1$s preview"), "Facebook"),
			/** translators: %1$s expands to Facebook */
			snippetEditor: this.i18n.sprintf(this.i18n.dgettext("yoast-social-previews", "%1$s editor"), "Facebook")
		}
	});

	this.element = {
		rendered: {
			title: targetElement.getElementsByClassName("editable-preview__value--facebook-title")[0],
			description: targetElement.getElementsByClassName("editable-preview__value--facebook-description")[0]
		},
		fields: this.getFields(),
		container: targetElement.getElementsByClassName("editable-preview--facebook")[0],
		formContainer: targetElement.getElementsByClassName("snippet-editor__form")[0],
		editToggle: targetElement.getElementsByClassName("snippet-editor__edit-button")[0],
		formFields: targetElement.getElementsByClassName("snippet-editor__form-field"),
		headingEditor: targetElement.getElementsByClassName("snippet-editor__heading-editor")[0],
		authorContainer: targetElement.getElementsByClassName("editable-preview__value--facebook-author")[0]
	};

	this.element.formContainer.innerHTML = this.element.fields.imageUrl.render() + this.element.fields.title.render() + this.element.fields.description.render();

	this.element.input = {
		title: targetElement.getElementsByClassName("js-snippet-editor-title")[0],
		imageUrl: targetElement.getElementsByClassName("js-snippet-editor-imageUrl")[0],
		description: targetElement.getElementsByClassName("js-snippet-editor-description")[0]
	};

	this.element.fieldElements = this.getFieldElements();
	this.element.closeEditor = targetElement.getElementsByClassName("snippet-editor__submit")[0];

	this.element.caretHooks = {
		title: this.element.input.title.previousSibling,
		imageUrl: this.element.input.imageUrl.previousSibling,
		description: this.element.input.description.previousSibling
	};

	this.element.preview = {
		title: this.element.rendered.title.parentNode,
		imageUrl: targetElement.getElementsByClassName("editable-preview__image--facebook")[0],
		description: this.element.rendered.description.parentNode
	};
};

/**
 * Returns the form fields.
 *
 * @returns {{title: *, description: *, imageUrl: *, button: Button}} Object with the fields.
 */
FacebookPreview.prototype.getFields = function () {
	return {
		title: new TextField({
			className: "snippet-editor__input snippet-editor__title js-snippet-editor-title",
			id: "facebook-editor-title",
			value: this.data.title,
			placeholder: this.opts.placeholder.title,
			/** translators: %1$s expands to Facebook */
			title: this.i18n.sprintf(this.i18n.dgettext("yoast-social-previews", "%1$s title"), "Facebook"),
			labelClassName: "snippet-editor__label"
		}),
		description: new TextArea({
			className: "snippet-editor__input snippet-editor__description js-snippet-editor-description",
			id: "facebook-editor-description",
			value: this.data.description,
			placeholder: this.opts.placeholder.description,
			/** translators: %1$s expands to Facebook */
			title: this.i18n.sprintf(this.i18n.dgettext("yoast-social-previews", "%1$s description"), "Facebook"),
			labelClassName: "snippet-editor__label"
		}),
		imageUrl: new TextField({
			className: "snippet-editor__input snippet-editor__imageUrl js-snippet-editor-imageUrl",
			id: "facebook-editor-imageUrl",
			value: this.data.imageUrl,
			placeholder: this.opts.placeholder.imageUrl,
			/** translators: %1$s expands to Facebook */
			title: this.i18n.sprintf(this.i18n.dgettext("yoast-social-previews", "%1$s image"), "Facebook"),
			labelClassName: "snippet-editor__label"
		})
	};
};

/**
 * Returns all field elements.
 *
 * @returns {{title: InputElement, description: InputElement, imageUrl: InputElement}} The field elements.
 */
FacebookPreview.prototype.getFieldElements = function () {
	var targetElement = this.opts.targetElement;

	return {
		title: new InputElement(targetElement.getElementsByClassName("js-snippet-editor-title")[0], {
			currentValue: this.data.title,
			defaultValue: this.opts.defaultValue.title,
			placeholder: this.opts.placeholder.title,
			fallback: this.i18n.sprintf(
			/** translators: %1$s expands to Facebook */
			this.i18n.dgettext("yoast-social-previews", "Please provide a %1$s title by editing the snippet below."), "Facebook")
		}, this.updatePreview.bind(this)),
		description: new InputElement(targetElement.getElementsByClassName("js-snippet-editor-description")[0], {
			currentValue: this.data.description,
			defaultValue: this.opts.defaultValue.description,
			placeholder: this.opts.placeholder.description,
			fallback: this.i18n.sprintf(
			/** translators: %1$s expands to Facebook */
			this.i18n.dgettext("yoast-social-previews", "Please provide a %1$s description by editing the snippet below."), "Facebook")
		}, this.updatePreview.bind(this)),
		imageUrl: new InputElement(targetElement.getElementsByClassName("js-snippet-editor-imageUrl")[0], {
			currentValue: this.data.imageUrl,
			defaultValue: this.opts.defaultValue.imageUrl,
			placeholder: this.opts.placeholder.imageUrl,
			fallback: ""
		}, this.updatePreview.bind(this))
	};
};

/**
 * Updates the Facebook preview.
 */
FacebookPreview.prototype.updatePreview = function () {
	// Update the data.
	this.data.title = this.element.fieldElements.title.getInputValue();
	this.data.description = this.element.fieldElements.description.getInputValue();
	this.data.imageUrl = this.element.fieldElements.imageUrl.getInputValue();

	// Sets the title field
	this.setTitle(this.element.fieldElements.title.getValue());
	this.setTitle(this.element.fieldElements.title.getValue());

	// Set the description field and parse the styling of it.
	this.setDescription(this.element.fieldElements.description.getValue());

	// Sets the Image
	this.setImage(this.data.imageUrl);

	// Clone so the data isn't changeable.
	this.opts.callbacks.updateSocialPreview(clone(this.data));
};

/**
 * Sets the preview title.
 *
 * @param {string} title The title to set
 */
FacebookPreview.prototype.setTitle = function (title) {
	title = this.opts.callbacks.modifyTitle(title);

	this.element.rendered.title.innerHTML = title;
};

/**
 * Sets the preview description.
 *
 * @param {string} description The description to set
 */
FacebookPreview.prototype.setDescription = function (description) {
	description = this.opts.callbacks.modifyDescription(description);

	this.element.rendered.description.innerHTML = description;
	renderDescription(this.element.rendered.description, this.element.fieldElements.description.getInputValue());
};

/**
 * Gets the image container.
 * @returns {string} The container that will hold the image.
 */
FacebookPreview.prototype.getImageContainer = function () {
	return this.element.preview.imageUrl;
};

/**
 * Updates the image object with the new URL.
 *
 * @param {string} imageUrl The image path.
 * @returns {void}
 */
FacebookPreview.prototype.setImage = function (imageUrl) {
	imageUrl = this.opts.callbacks.modifyImageUrl(imageUrl);

	if (imageUrl === "" && this.data.imageUrl === "") {
		this.removeImageFromContainer();
		return this.noUrlSet();
	}

	var img = new Image();

	img.onload = function () {
		if (this.isTooSmallImage(img)) {
			this.removeImageFromContainer();
			return this.imageTooSmall();
		}

		this.setSizingClass(img);
		this.addImageToContainer(imageUrl);
	}.bind(this);

	img.onerror = function () {
		this.removeImageFromContainer();
		return this.imageError();
	}.bind(this);

	// Load image to trigger load or error event.
	img.src = imageUrl;
};

/**
 * Displays the No URL Set warning.
 * @returns {void}
 */
FacebookPreview.prototype.noUrlSet = function () {
	this.removeImageClasses();

	imagePlaceholder(this.getImageContainer(), this.i18n.dgettext("yoast-social-previews", "Please select an image by clicking here"), false, "facebook");

	return;
};

/**
 * Displays the Image Too Small error.
 * @returns {void}
 */
FacebookPreview.prototype.imageTooSmall = function () {
	var message;
	this.removeImageClasses();

	if (this.data.imageUrl === "") {
		message = this.i18n.sprintf(
		/* translators: %1$s expands to Facebook */
		this.i18n.dgettext("yoast-social-previews", "We are unable to detect an image " + "in your post that is large enough to be displayed on Facebook. We advise you " + "to select a %1$s image that fits the recommended image size."), "Facebook");
	} else {
		message = this.i18n.sprintf(
		/* translators: %1$s expands to Facebook */
		this.i18n.dgettext("yoast-social-previews", "The image you selected is too small for %1$s"), "Facebook");
	}

	imagePlaceholder(this.getImageContainer(), message, true, "facebook");

	return;
};

/**
 * Displays the Url Cannot Be Loaded error.
 * @returns {void}
 */
FacebookPreview.prototype.imageError = function () {
	this.removeImageClasses();

	imagePlaceholder(this.getImageContainer(), this.i18n.dgettext("yoast-social-previews", "The given image url cannot be loaded"), true, "facebook");
};

/**
 * Sets the image of the image container.
 * @param {string} image The image to use.
 */
FacebookPreview.prototype.addImageToContainer = function (image) {
	var container = this.getImageContainer();

	container.innerHTML = "";
	container.style.backgroundImage = "url(" + image + ")";
};

/**
 * Removes the image from the container.
 */
FacebookPreview.prototype.removeImageFromContainer = function () {
	var container = this.getImageContainer();

	container.style.backgroundImage = "";
};

/**
 * Sets the proper CSS class for the current image.
 * @param {Image} img The image to base the sizing class on.
 * @returns {void}
 */
FacebookPreview.prototype.setSizingClass = function (img) {
	this.removeImageClasses();

	if (imageDisplayMode(img) === "portrait") {
		this.setPortraitImageClasses();

		return;
	}

	if (this.isSmallImage(img)) {
		this.setSmallImageClasses();

		return;
	}

	this.setLargeImageClasses();

	return;
};

/**
 * Returns the max image width
 *
 * @param {Image} img The image object to use.
 * @returns {int} The calculated maxwidth
 */
FacebookPreview.prototype.getMaxImageWidth = function (img) {
	if (this.isSmallImage(img)) {
		return WIDTH_FACEBOOK_IMAGE_SMALL;
	}

	return WIDTH_FACEBOOK_IMAGE_LARGE;
};

/**
 * Detects if the Facebook preview should switch to small image mode
 *
 * @param {HTMLImageElement} image The image in question.
 *
 * @returns {boolean} Whether the image is small.
 */
FacebookPreview.prototype.isSmallImage = function (image) {
	return image.width < FACEBOOK_IMAGE_THRESHOLD_WIDTH || image.height < FACEBOOK_IMAGE_THRESHOLD_HEIGHT;
};

/**
 * Detects if the Facebook preview image is too small
 *
 * @param {HTMLImageElement} image The image in question.
 *
 * @returns {boolean} Whether the image is too small.
 */
FacebookPreview.prototype.isTooSmallImage = function (image) {
	return image.width < FACEBOOK_IMAGE_TOO_SMALL_WIDTH || image.height < FACEBOOK_IMAGE_TOO_SMALL_HEIGHT;
};

/**
 * Sets the classes on the Facebook preview so that it will display a small Facebook image preview
 */
FacebookPreview.prototype.setSmallImageClasses = function () {
	var targetElement = this.opts.targetElement;

	bemAddModifier("facebook-small", "social-preview__inner", targetElement);
	bemAddModifier("facebook-small", "editable-preview__image--facebook", targetElement);
	bemAddModifier("facebook-small", "editable-preview__text-keeper--facebook", targetElement);
};

/**
 * Removes the small image classes.
 */
FacebookPreview.prototype.removeSmallImageClasses = function () {
	var targetElement = this.opts.targetElement;

	bemRemoveModifier("facebook-small", "social-preview__inner", targetElement);
	bemRemoveModifier("facebook-small", "editable-preview__image--facebook", targetElement);
	bemRemoveModifier("facebook-small", "editable-preview__text-keeper--facebook", targetElement);
};

/**
 * Sets the classes on the facebook preview so that it will display a large facebook image preview
 */
FacebookPreview.prototype.setLargeImageClasses = function () {
	var targetElement = this.opts.targetElement;

	bemAddModifier("facebook-large", "social-preview__inner", targetElement);
	bemAddModifier("facebook-large", "editable-preview__image--facebook", targetElement);
	bemAddModifier("facebook-large", "editable-preview__text-keeper--facebook", targetElement);
};

/**
 * Removes the large image classes.
 */
FacebookPreview.prototype.removeLargeImageClasses = function () {
	var targetElement = this.opts.targetElement;

	bemRemoveModifier("facebook-large", "social-preview__inner", targetElement);
	bemRemoveModifier("facebook-large", "editable-preview__image--facebook", targetElement);
	bemRemoveModifier("facebook-large", "editable-preview__text-keeper--facebook", targetElement);
};

/**
 * Sets the classes on the Facebook preview so that it will display a portrait Facebook image preview
 */
FacebookPreview.prototype.setPortraitImageClasses = function () {
	var targetElement = this.opts.targetElement;

	bemAddModifier("facebook-portrait", "social-preview__inner", targetElement);
	bemAddModifier("facebook-portrait", "editable-preview__image--facebook", targetElement);
	bemAddModifier("facebook-portrait", "editable-preview__text-keeper--facebook", targetElement);
	bemAddModifier("facebook-bottom", "editable-preview__website--facebook", targetElement);
};

/**
 * Removes the portrait image classes.
 */
FacebookPreview.prototype.removePortraitImageClasses = function () {
	var targetElement = this.opts.targetElement;

	bemRemoveModifier("facebook-portrait", "social-preview__inner", targetElement);
	bemRemoveModifier("facebook-portrait", "editable-preview__image--facebook", targetElement);
	bemRemoveModifier("facebook-portrait", "editable-preview__text-keeper--facebook", targetElement);
	bemRemoveModifier("facebook-bottom", "editable-preview__website--facebook", targetElement);
};

/**
 * Removes all image classes.
 */
FacebookPreview.prototype.removeImageClasses = function () {
	this.removeSmallImageClasses();
	this.removeLargeImageClasses();
	this.removePortraitImageClasses();
};

/**
 * Binds the reloadSnippetText function to the blur of the snippet inputs.
 *
 * @returns {void}
 */
FacebookPreview.prototype.bindEvents = function () {
	var previewEvents = new PreviewEvents(inputFacebookPreviewBindings, this.element, true);
	previewEvents.bindEvents(this.element.editToggle, this.element.closeEditor);
};

/**
 * Sets the value of the Facebook author name.
 *
 * @param {string} authorName The name of the author to show.
 */
FacebookPreview.prototype.setAuthor = function (authorName) {
	var authorHtml = "";
	if (authorName !== "") {
		authorHtml = facebookAuthorTemplate({
			authorName: authorName,
			authorBy: this.i18n.dgettext("yoast-social-previews", "By")
		});
	}

	this.element.authorContainer.innerHTML = authorHtml;
};

module.exports = FacebookPreview;

},{"./element/imagePlaceholder":218,"./element/input":219,"./helpers/bem/addModifier":222,"./helpers/bem/removeModifier":224,"./helpers/imageDisplayMode":225,"./helpers/renderDescription":228,"./inputs/textInput":230,"./inputs/textarea":231,"./preview/events":232,"./templates.js":233,"jed":235,"lodash/lang/clone":274,"lodash/lang/isElement":277,"lodash/object/defaultsDeep":288}],221:[function(require,module,exports){
"use strict";

/**
 * Adds a class to an element
 *
 * @param {HTMLElement} element The element to add the class to.
 * @param {string} className The class to add.
 */
module.exports = function (element, className) {
  var classes = element.className.split(" ");

  if (-1 === classes.indexOf(className)) {
    classes.push(className);
  }

  element.className = classes.join(" ");
};

},{}],222:[function(require,module,exports){
"use strict";

var addClass = require("./../addClass");
var addModifierToClass = require("./addModifierToClass");

/**
 * Adds a BEM modifier to an element
 *
 * @param {string} modifier Modifier to add to the target
 * @param {string} targetClass The target to add the modifier to
 * @param {HTMLElement} targetParent The parent in which the target should be
 */
function addModifier(modifier, targetClass, targetParent) {
  var element = targetParent.getElementsByClassName(targetClass)[0];
  var newClass = addModifierToClass(modifier, targetClass);

  addClass(element, newClass);
}

module.exports = addModifier;

},{"./../addClass":221,"./addModifierToClass":223}],223:[function(require,module,exports){
"use strict";

/**
 * Adds a modifier to a class name, makes sure
 *
 * @param {string} modifier The modifier to add to the class name.
 * @param {string} className The class name to add the modifier to.
 *
 * @returns {string} The new class with the modifier.
 */
function addModifierToClass(modifier, className) {
  var baseClass = className.replace(/--.+/, "");

  return baseClass + "--" + modifier;
}

module.exports = addModifierToClass;

},{}],224:[function(require,module,exports){
"use strict";

var removeClass = require("./../removeClass");
var addModifierToClass = require("./addModifierToClass");

/**
 * Removes a BEM modifier from an element
 *
 * @param {string} modifier Modifier to add to the target
 * @param {string} targetClass The target to add the modifier to
 * @param {HTMLElement} targetParent The parent in which the target should be
 */
function removeModifier(modifier, targetClass, targetParent) {
  var element = targetParent.getElementsByClassName(targetClass)[0];
  var newClass = addModifierToClass(modifier, targetClass);

  removeClass(element, newClass);
}

module.exports = removeModifier;

},{"./../removeClass":227,"./addModifierToClass":223}],225:[function(require,module,exports){
"use strict";

/**
 * Retrieves the image display mode
 *
 * @param {Object} image The image object.
 * @returns {string} The display mode of the image.
 */
function imageDisplayMode(image) {
  if (image.height > image.width) {
    return "portrait";
  }

  return "landscape";
}

module.exports = imageDisplayMode;

},{}],226:[function(require,module,exports){
"use strict";

/**
 * Cleans spaces from the html.
 *
 * @param  {string} html The html to minimize.
 *
 * @returns {string} The minimized html string.
 */
function minimizeHtml(html) {
	html = html.replace(/(\s+)/g, " ");
	html = html.replace(/> </g, "><");
	html = html.replace(/ >/g, ">");
	html = html.replace(/> /g, ">");
	html = html.replace(/ </g, "<");
	html = html.replace(/ $/, "");

	return html;
}

module.exports = minimizeHtml;

},{}],227:[function(require,module,exports){
"use strict";

/**
 * Removes a class from an element
 *
 * @param {HTMLElement} element The element to remove the class from.
 * @param {string} className The class to remove.
 */
module.exports = function (element, className) {
	var classes = element.className.split(" ");
	var foundClass = classes.indexOf(className);

	if (-1 !== foundClass) {
		classes.splice(foundClass, 1);
	}

	element.className = classes.join(" ");
};

},{}],228:[function(require,module,exports){
"use strict";

var isEmpty = require("lodash/lang/isEmpty");

var addClass = require("./addClass");
var removeClass = require("./removeClass");

/**
 * Makes the rendered description gray if no description has been set by the user.
 *
 * @param {string} descriptionElement Target description element
 * @param {string} description Current description
 */
function renderDescription(descriptionElement, description) {
	if (isEmpty(description)) {
		addClass(descriptionElement, "desc-render");
		removeClass(descriptionElement, "desc-default");
	} else {
		addClass(descriptionElement, "desc-default");
		removeClass(descriptionElement, "desc-render");
	}
}

module.exports = renderDescription;

},{"./addClass":221,"./removeClass":227,"lodash/lang/isEmpty":278}],229:[function(require,module,exports){
"use strict";

var defaults = require("lodash/object/defaults");
var minimizeHtml = require("../helpers/minimizeHtml");

/**
 * Factory for the inputfield.
 *
 * @param {Object} template Template object to use.
 * @returns {TextField} The textfield object.
 */
function inputFieldFactory(template) {

	var defaultAttributes = {
		value: "",
		className: "",
		id: "",
		placeholder: "",
		name: "",
		title: "",
		labelClassName: ""
	};

	/**
  * Represents an HTML text field
  *
  * @param {Object} attributes The attributes to set on the HTML element
  * @param {string} attributes.value The value for this text field
  * @param {string} attributes.placeholder The placeholder for this text field
  * @param {string} attributes.name The name for this text field
  * @param {string} attributes.id The id for this text field
  * @param {string} attributes.className The class for this text field
  * @param {string} attributes.title The title that describes this text field
  *
  * @constructor
  */
	function TextField(attributes) {
		attributes = attributes || {};
		attributes = defaults(attributes, defaultAttributes);

		this._attributes = attributes;
	}

	/**
  * Returns the HTML attributes set for this text field
  *
  * @returns {Object} The HTML attributes
  */
	TextField.prototype.getAttributes = function () {
		return this._attributes;
	};

	/**
  * Renders the text field to HTML
  *
  * @returns {string} The rendered HTML
  */
	TextField.prototype.render = function () {
		var html = template(this.getAttributes());

		html = minimizeHtml(html);

		return html;
	};

	/**
  * Set the value of the input field
  *
  * @param {string} value The value to set on this input field
  */
	TextField.prototype.setValue = function (value) {
		this._attributes.value = value;
	};

	/**
  * Set the value of the input field
  *
  * @param {string} className The class to set on this input field
  */
	TextField.prototype.setClassName = function (className) {
		this._attributes.className = className;
	};

	return TextField;
}

module.exports = inputFieldFactory;

},{"../helpers/minimizeHtml":226,"lodash/object/defaults":287}],230:[function(require,module,exports){
"use strict";

var inputFieldFactory = require("./inputField");

module.exports = inputFieldFactory(require("../templates").fields.text);

},{"../templates":233,"./inputField":229}],231:[function(require,module,exports){
"use strict";

var inputFieldFactory = require("./inputField");

module.exports = inputFieldFactory(require("../templates").fields.textarea);

},{"../templates":233,"./inputField":229}],232:[function(require,module,exports){
"use strict";

var forEach = require("lodash/collection/forEach");

var addClass = require("../helpers/addClass.js");
var removeClass = require("../helpers/removeClass.js");

/**
 *
 * @param {Object} bindings The fields to bind.
 * @param {Object} element The element to bind the events to.
 * @param {boolean} alwaysOpen Whether the input form should always be open.
 * @constructor
 */
function PreviewEvents(bindings, element, alwaysOpen) {
	this._bindings = bindings;
	this.element = element;
	this._alwaysOpen = alwaysOpen;
}

/**
 * Bind the events.
 *
 * @param {Object} editToggle - The edit toggle element
 * @param {Object} closeEditor - The button to close the editor
 */
PreviewEvents.prototype.bindEvents = function (editToggle, closeEditor) {
	if (!this._alwaysOpen) {
		editToggle.addEventListener("click", this.toggleEditor.bind(this));
		closeEditor.addEventListener("click", this.closeEditor.bind(this));
	}

	// Loop through the bindings and bind a click handler to the click to focus the focus element.
	forEach(this._bindings, this.bindInputEvent.bind(this));
};

/**
 * Binds the event for the input
 *
 * @param {Object} binding The field to bind.
 */
PreviewEvents.prototype.bindInputEvent = function (binding) {
	var previewElement = document.getElementsByClassName(binding.preview)[0];
	var inputElement = this.element.input[binding.inputField];

	// Make the preview element click open the editor and focus the correct input.
	previewElement.addEventListener("click", function () {
		this.openEditor();
		inputElement.focus();
	}.bind(this));

	// Make focusing an input, update the carets.
	inputElement.addEventListener("focus", function () {
		this._currentFocus = binding.inputField;

		this._updateFocusCarets();
	}.bind(this));

	// Make removing focus from an element, update the carets.
	inputElement.addEventListener("blur", function () {
		this._currentFocus = null;

		this._updateFocusCarets();
	}.bind(this));

	previewElement.addEventListener("mouseover", function () {
		this._currentHover = binding.inputField;

		this._updateHoverCarets();
	}.bind(this));

	previewElement.addEventListener("mouseout", function () {
		this._currentHover = null;

		this._updateHoverCarets();
	}.bind(this));
};

/**
 * Opens the snippet editor.
 *
 * @returns {void}
 */
PreviewEvents.prototype.openEditor = function () {

	if (this._alwaysOpen) {
		return;
	}

	// Hide these elements.
	addClass(this.element.editToggle, "snippet-editor--hidden");

	// Show these elements.
	removeClass(this.element.formContainer, "snippet-editor--hidden");
	removeClass(this.element.headingEditor, "snippet-editor--hidden");

	this.opened = true;
};

/**
 * Closes the snippet editor.
 *
 * @returns {void}
 */
PreviewEvents.prototype.closeEditor = function () {

	if (this._alwaysOpen) {
		return;
	}

	// Hide these elements.
	addClass(this.element.formContainer, "snippet-editor--hidden");
	addClass(this.element.headingEditor, "snippet-editor--hidden");

	// Show these elements.
	removeClass(this.element.editToggle, "snippet-editor--hidden");

	this.opened = false;
};

/**
 * Toggles the snippet editor.
 *
 * @returns {void}
 */
PreviewEvents.prototype.toggleEditor = function () {
	if (this.opened) {
		this.closeEditor();
	} else {
		this.openEditor();
	}
};

/**
 * Updates carets before the preview and input fields.
 *
 * @private
 *
 * @returns {void}
 */
PreviewEvents.prototype._updateFocusCarets = function () {
	var focusedCaretHook, focusedPreview;

	// Disable all carets on the labels.
	forEach(this.element.caretHooks, function (element) {
		removeClass(element, "snippet-editor__caret-hook--focus");
	});

	// Disable all carets on the previews.
	forEach(this.element.preview, function (element) {
		removeClass(element, "snippet-editor__container--focus");
	});

	if (null !== this._currentFocus) {
		focusedCaretHook = this.element.caretHooks[this._currentFocus];
		focusedPreview = this.element.preview[this._currentFocus];

		addClass(focusedCaretHook, "snippet-editor__caret-hook--focus");
		addClass(focusedPreview, "snippet-editor__container--focus");
	}
};

/**
 * Updates hover carets before the input fields.
 *
 * @private
 *
 * @returns {void}
 */
PreviewEvents.prototype._updateHoverCarets = function () {
	var hoveredCaretHook;

	forEach(this.element.caretHooks, function (element) {
		removeClass(element, "snippet-editor__caret-hook--hover");
	});

	if (null !== this._currentHover) {
		hoveredCaretHook = this.element.caretHooks[this._currentHover];

		addClass(hoveredCaretHook, "snippet-editor__caret-hook--hover");
	}
};

module.exports = PreviewEvents;

},{"../helpers/addClass.js":221,"../helpers/removeClass.js":227,"lodash/collection/forEach":236}],233:[function(require,module,exports){
(function (global){
;(function() {
  var undefined;

  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  var root = freeGlobal || freeSelf || Function('return this')();

  var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

  var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '4.17.4';

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;

  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
      symbolTag = '[object Symbol]',
      undefinedTag = '[object Undefined]';

  /** Used to match HTML entities and HTML characters. */
  var reUnescapedHtml = /[&<>"']/g,
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /*--------------------------------------------------------------------------*/

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

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  var escapeHtmlChar = basePropertyOf(htmlEscapes);

  /*--------------------------------------------------------------------------*/

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
  var Symbol = root.Symbol,
      symToStringTag = Symbol ? Symbol.toStringTag : undefined;

  /** Used to lookup unminified function names. */
  var realNames = {};

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = Symbol ? Symbol.prototype : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;

  /*------------------------------------------------------------------------*/

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

  /*------------------------------------------------------------------------*/

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

  /*------------------------------------------------------------------------*/

  /**
   * Converts the characters "&", "<", ">", '"', and "'" in `string` to their
   * corresponding HTML entities.
   *
   * **Note:** No other characters are escaped. To escape additional
   * characters use a third-party library like [_he_](https://mths.be/he).
   *
   * Though the ">" character is escaped for symmetry, characters like
   * ">" and "/" don't need escaping in HTML and have no special meaning
   * unless they're part of a tag or unquoted attribute value. See
   * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
   * (under "semi-related fun fact") for more details.
   *
   * When working with HTML you should always
   * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
   * XSS vectors.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category String
   * @param {string} [string=''] The string to escape.
   * @returns {string} Returns the escaped string.
   * @example
   *
   * _.escape('fred, barney, & pebbles');
   * // => 'fred, barney, &amp; pebbles'
   */
  function escape(string) {
    string = toString(string);
    return (string && reHasUnescapedHtml.test(string))
      ? string.replace(reUnescapedHtml, escapeHtmlChar)
      : string;
  }

  var _ = { 'escape': escape };

  /*----------------------------------------------------------------------------*/

  var templates = {
    'facebookAuthor': {},
    'facebookPreview': {},
    'fields': {
        'button': {},
        'text': {},
        'textarea': {}
    },
    'imagePlaceholder': {},
    'twitterPreview': {}
  };

  templates['facebookAuthor'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape;
    with (obj) {
    __p += '<span class="editable-preview__website--facebook-pipe">|</span> ' +
    __e( authorBy ) +
    '\n<span class="editable-preview__author--facebook">' +
    __e( authorName ) +
    '</span>\n';

    }
    return __p
  };

  templates['facebookPreview'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape;
    with (obj) {
    __p += '<div class="editable-preview editable-preview--facebook">\n	<h3 class="snippet-editor__heading snippet-editor__heading-icon-eye editable-preview__heading ">' +
    __e( i18n.snippetPreview ) +
    '</h3>\n\n	<section class="editable-preview__inner editable-preview__inner--facebook">\n		<div class="social-preview__inner social-preview__inner--facebook">\n			<div class="snippet-editor__container editable-preview__image editable-preview__image--facebook snippet_container">\n\n			</div>\n			<div class="editable-preview__text-keeper editable-preview__text-keeper--facebook">\n				<div class="snippet-editor__container editable-preview__container--facebook editable-preview__title--facebook snippet_container">\n					<div class="editable-preview__value editable-preview__value--facebook-title">\n						' +
    __e( rendered.title ) +
    '\n					</div>\n				</div>\n				<div class="snippet-editor__container editable-preview__container--facebook editable-preview__description--facebook snippet_container">\n					<div class="editable-preview__value editable-preview__value--facebook-description">\n						' +
    __e( rendered.description ) +
    '\n					</div>\n				</div>\n				<div class="snippet-editor__container editable-preview__container--no-caret editable-preview__website--facebook snippet_container">\n					<div class="editable-preview__value editable-preview__value--facebook-url">\n						' +
    __e( rendered.baseUrl ) +
    '\n						<span class="editable-preview__value--facebook-author"></span>\n					</div>\n				</div>\n			</div>\n		</div>\n	</section>\n\n	<h3 class="snippet-editor__heading snippet-editor__heading-editor snippet-editor__heading-icon-edit editable-preview__heading">' +
    __e( i18n.snippetEditor ) +
    '</h3>\n\n	<div class="snippet-editor__form">\n\n	</div>\n</div>\n';

    }
    return __p
  };

  templates['fields']['button'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {
    __p += '<button\n	type="button"\n	';
     if (className) {
    __p += 'class="' +
    __e( className ) +
    '"';
     }
    __p += '\n>\n	' +
    __e( value ) +
    '\n</button>';

    }
    return __p
  };

  templates['fields']['text'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {
    __p += '<label';
     if ( id ) {
    __p += ' for="' +
    __e( id ) +
    '"';
     }

     if ( labelClassName ) {
    __p += ' class="' +
    __e( labelClassName ) +
    '"';
     }
    __p += '>';

    if ( id ) {
    __p +=
    __e( title ) +
    '</label>';
     } else {
    __p +=
    __e( title );
     }
    __p += '\n	<span class="snippet-editor__caret-hook"\n		';
     if ( id ) {
    __p += 'id="' +
    __e( id ) +
    '__caret-hook"';
     }
    __p += '\n	></span>\n	<input type="text"\n		';
     if ( value ) {
    __p += 'value="' +
    __e( value ) +
    '"';
     }
    __p += '\n		';
     if ( placeholder ) {
    __p += 'placeholder="' +
    __e( placeholder ) +
    '"';
     }
    __p += '\n		';
     if ( className ) {
    __p += 'class="' +
    __e( className ) +
    '"';
     }
    __p += '\n		';
     if ( id ) {
    __p += 'id="' +
    __e( id ) +
    '"';
     }
    __p += '\n		';
     if ( name ) {
    __p += 'name="' +
    __e( name ) +
    '"';
     }
    __p += '\n	/>\n';
     if ( ! id ) {
    __p += '</label>';
     }
    __p += '\n';

    }
    return __p
  };

  templates['fields']['textarea'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {
    __p += '<label';
     if ( id ) {
    __p += ' for="' +
    __e( id ) +
    '"';
     }

     if ( labelClassName ) {
    __p += ' class="' +
    __e( labelClassName ) +
    '"';
     }
    __p += '>';

    if ( id ) {
    __p +=
    __e( title ) +
    '</label>';
     } else {
    __p +=
    __e( title );
     }
    __p += '\n	<span class="snippet-editor__caret-hook"\n		';
     if ( id ) {
    __p += 'id="' +
    __e( id ) +
    '__caret-hook"';
     }
    __p += '\n	></span>\n	<textarea\n		';
     if ( placeholder ) {
    __p += 'placeholder="' +
    __e( placeholder ) +
    '"';
     }
    __p += '\n		';
     if ( className ) {
    __p += 'class="' +
    __e( className ) +
    '"';
     }
    __p += '\n		';
     if ( id ) {
    __p += 'id="' +
    __e( id ) +
    '"';
     }
    __p += '\n		';
     if ( name ) {
    __p += 'name="' +
    __e( name ) +
    '"';
     }
    __p += '\n	>\n		';
     if (value) {
    __p +=
    __e( value );
     }
    __p += '\n	</textarea>\n';
     if ( ! id ) {
    __p += '</label>';
     }
    __p += '\n';

    }
    return __p
  };

  templates['imagePlaceholder'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape;
    with (obj) {
    __p += '<div class=\'' +
    __e( className ) +
    '\'>' +
    __e( placeholder ) +
    '</div>';

    }
    return __p
  };

  templates['twitterPreview'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape;
    with (obj) {
    __p += '<div class="editable-preview editable-preview--twitter">\n	<h3 class="snippet-editor__heading snippet-editor__heading-icon-eye editable-preview__heading">' +
    __e( i18n.snippetPreview ) +
    '</h3>\n\n	<section class="editable-preview__inner editable-preview__inner--twitter">\n		<div class="social-preview__inner social-preview__inner--twitter">\n			<div class="snippet-editor__container editable-preview__image editable-preview__image--twitter snippet_container">\n\n			</div>\n			<div class="editable-preview__text-keeper editable-preview__text-keeper--twitter">\n				<div class="snippet-editor__container editable-preview__container--twitter editable-preview__title--twitter snippet_container" >\n					<div class="editable-preview__value editable-preview__value--twitter-title ">\n						' +
    __e( rendered.title ) +
    '\n					</div>\n				</div>\n				<div class="snippet-editor__container editable-preview__container--twitter editable-preview__description--twitter twitter-preview__description snippet_container">\n					<div class="editable-preview__value editable-preview__value--twitter-description">\n						' +
    __e( rendered.description ) +
    '\n					</div>\n				</div>\n				<div class="snippet-editor__container editable-preview__container--no-caret editable-preview__website--twitter snippet_container">\n					<div class="editable-preview__value ">\n						' +
    __e( rendered.baseUrl ) +
    '\n					</div>\n				</div>\n			</div>\n		</div>\n	</section>\n\n	<h3 class="snippet-editor__heading snippet-editor__heading-editor snippet-editor__heading-icon-edit editable-preview__heading">' +
    __e( i18n.snippetEditor ) +
    '</h3>\n\n	<div class="snippet-editor__form">\n\n	</div>\n</div>\n';

    }
    return __p
  };

  /*----------------------------------------------------------------------------*/

  if (freeModule) {
    (freeModule.exports = templates).templates = templates;
    freeExports.templates = templates;
  }
  else {
    root.templates = templates;
  }
}.call(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],234:[function(require,module,exports){
"use strict";

/* jshint browser: true */

var isElement = require("lodash/lang/isElement");
var clone = require("lodash/lang/clone");
var defaultsDeep = require("lodash/object/defaultsDeep");

var Jed = require("jed");

var renderDescription = require("./helpers/renderDescription");
var imagePlaceholder = require("./element/imagePlaceholder");
var bemAddModifier = require("./helpers/bem/addModifier");
var bemRemoveModifier = require("./helpers/bem/removeModifier");

var TextField = require("./inputs/textInput");
var TextArea = require("./inputs/textarea");

var InputElement = require("./element/input");
var PreviewEvents = require("./preview/events");

var twitterEditorTemplate = require("./templates").twitterPreview;

var twitterDefaults = {
	data: {
		title: "",
		description: "",
		imageUrl: ""
	},
	defaultValue: {
		title: "",
		description: "",
		imageUrl: ""
	},
	baseURL: "example.com",
	callbacks: {
		updateSocialPreview: function updateSocialPreview() {},
		modifyTitle: function modifyTitle(title) {
			return title;
		},
		modifyDescription: function modifyDescription(description) {
			return description;
		},
		modifyImageUrl: function modifyImageUrl(imageUrl) {
			return imageUrl;
		}
	}
};

var inputTwitterPreviewBindings = [{
	"preview": "editable-preview__title--twitter",
	"inputField": "title"
}, {
	"preview": "editable-preview__image--twitter",
	"inputField": "imageUrl"
}, {
	"preview": "editable-preview__description--twitter",
	"inputField": "description"
}];

var WIDTH_TWITTER_IMAGE_SMALL = 120;
var WIDTH_TWITTER_IMAGE_LARGE = 506;
var TWITTER_IMAGE_THRESHOLD_WIDTH = 280;
var TWITTER_IMAGE_THRESHOLD_HEIGHT = 150;

/**
 * @module snippetPreview
 */

/**
 * Defines the config and outputTarget for the SnippetPreview
 *
 * @param {Object}         opts                           - Snippet preview options.
 * @param {Object}         opts.placeholder               - The placeholder values for the fields, will be shown as
 * actual placeholders in the inputs and as a fallback for the preview.
 * @param {string}         opts.placeholder.title         - Placeholder for the title field.
 * @param {string}         opts.placeholder.description   - Placeholder for the description field.
 * @param {string}         opts.placeholder.imageUrl      - Placeholder for the image url field.
 *
 * @param {Object}         opts.defaultValue              - The default value for the fields, if the user has not
 * changed a field, this value will be used for the analyzer, preview and the progress bars.
 * @param {string}         opts.defaultValue.title        - Default title.
 * @param {string}         opts.defaultValue.description  - Default description.
 * @param {string}         opts.defaultValue.imageUrl     - Default image url.
 * it.
 *
 * @param {string}         opts.baseURL                   - The basic URL as it will be displayed in twitter.
 * @param {HTMLElement}    opts.targetElement             - The target element that contains this snippet editor.
 *
 * @param {Object}         opts.callbacks                 - Functions that are called on specific instances.
 * @param {Function}       opts.callbacks.updateSocialPreview - Function called when the social preview is updated.
 *
 * @param {Object}         i18n                           - The i18n object.
 *
 * @property {Object}      i18n                           - The translation object.
 *
 * @property {HTMLElement} targetElement                  - The target element that contains this snippet editor.
 *
 * @property {Object}      element                        - The elements for this snippet editor.
 * @property {Object}      element.rendered               - The rendered elements.
 * @property {HTMLElement} element.rendered.title         - The rendered title element.
 * @property {HTMLElement} element.rendered.imageUrl      - The rendered url path element.
 * @property {HTMLElement} element.rendered.description   - The rendered twitter description element.
 *
 * @property {Object}      element.input                  - The input elements.
 * @property {HTMLElement} element.input.title            - The title input element.
 * @property {HTMLElement} element.input.imageUrl         - The url path input element.
 * @property {HTMLElement} element.input.description      - The meta description input element.
 *
 * @property {HTMLElement} element.container              - The main container element.
 * @property {HTMLElement} element.formContainer          - The form container element.
 * @property {HTMLElement} element.editToggle             - The button that toggles the editor form.
 *
 * @property {Object}      data                           - The data for this snippet editor.
 * @property {string}      data.title                     - The title.
 * @property {string}      data.imageUrl                  - The url path.
 * @property {string}      data.description               - The meta description.
 *
 * @property {string}      baseURL                        - The basic URL as it will be displayed in google.
 *
 * @constructor
 */
var TwitterPreview = function TwitterPreview(opts, i18n) {
	this.i18n = i18n || this.constructI18n();

	twitterDefaults.placeholder = {
		title: this.i18n.dgettext("yoast-social-previews", "This is an example title - edit by clicking here"),
		description: this.i18n.sprintf(
		/** translators: %1$s expands to Twitter */
		this.i18n.dgettext("yoast-social-previews", "Modify your %1$s description by editing it right here"), "Twitter"),
		imageUrl: ""
	};

	defaultsDeep(opts, twitterDefaults);

	if (!isElement(opts.targetElement)) {
		throw new Error("The Twitter preview requires a valid target element");
	}

	this.data = opts.data;
	this.i18n = i18n || this.constructI18n();
	this.opts = opts;

	this._currentFocus = null;
	this._currentHover = null;
};

/**
 * Initializes i18n object based on passed configuration
 *
 * @param {Object} translations - The values to translate.
 *
 * @returns {Jed} - The Jed translation object.
 */
TwitterPreview.prototype.constructI18n = function (translations) {
	var defaultTranslations = {
		"domain": "yoast-social-previews",
		"locale_data": {
			"yoast-social-previews": {
				"": {}
			}
		}
	};

	translations = translations || {};

	defaultsDeep(translations, defaultTranslations);

	return new Jed(translations);
};

/**
 * Renders the template and bind the events.
 *
 * @returns {void}
 */
TwitterPreview.prototype.init = function () {
	this.renderTemplate();
	this.bindEvents();
	this.updatePreview();
};

/**
 * Renders snippet editor and adds it to the targetElement.
 *
 * @returns {void}
 */
TwitterPreview.prototype.renderTemplate = function () {
	var targetElement = this.opts.targetElement;

	targetElement.innerHTML = twitterEditorTemplate({
		rendered: {
			title: "",
			description: "",
			imageUrl: "",
			baseUrl: this.opts.baseURL
		},
		placeholder: this.opts.placeholder,
		i18n: {
			/** translators: %1$s expands to Twitter */
			edit: this.i18n.sprintf(this.i18n.dgettext("yoast-social-previews", "Edit %1$s preview"), "Twitter"),
			/** translators: %1$s expands to Twitter */
			snippetPreview: this.i18n.sprintf(this.i18n.dgettext("yoast-social-previews", "%1$s preview"), "Twitter"),
			/** translators: %1$s expands to Twitter */
			snippetEditor: this.i18n.sprintf(this.i18n.dgettext("yoast-social-previews", "%1$s editor"), "Twitter")
		}
	});

	this.element = {
		rendered: {
			title: targetElement.getElementsByClassName("editable-preview__value--twitter-title")[0],
			description: targetElement.getElementsByClassName("editable-preview__value--twitter-description")[0]
		},
		fields: this.getFields(),
		container: targetElement.getElementsByClassName("editable-preview--twitter")[0],
		formContainer: targetElement.getElementsByClassName("snippet-editor__form")[0],
		editToggle: targetElement.getElementsByClassName("snippet-editor__edit-button")[0],
		closeEditor: targetElement.getElementsByClassName("snippet-editor__submit")[0],
		formFields: targetElement.getElementsByClassName("snippet-editor__form-field"),
		headingEditor: targetElement.getElementsByClassName("snippet-editor__heading-editor")[0]
	};

	this.element.formContainer.innerHTML = this.element.fields.imageUrl.render() + this.element.fields.title.render() + this.element.fields.description.render();

	this.element.input = {
		title: targetElement.getElementsByClassName("js-snippet-editor-title")[0],
		imageUrl: targetElement.getElementsByClassName("js-snippet-editor-imageUrl")[0],
		description: targetElement.getElementsByClassName("js-snippet-editor-description")[0]
	};

	this.element.fieldElements = this.getFieldElements();
	this.element.closeEditor = targetElement.getElementsByClassName("snippet-editor__submit")[0];

	this.element.caretHooks = {
		title: this.element.input.title.previousSibling,
		imageUrl: this.element.input.imageUrl.previousSibling,
		description: this.element.input.description.previousSibling
	};

	this.element.preview = {
		title: this.element.rendered.title.parentNode,
		imageUrl: targetElement.getElementsByClassName("editable-preview__image--twitter")[0],
		description: this.element.rendered.description.parentNode
	};
};

/**
 * Returns the form fields.
 *
 * @returns {{title: *, description: *, imageUrl: *, button: Button}} Object with the fields.
 */
TwitterPreview.prototype.getFields = function () {
	return {
		title: new TextField({
			className: "snippet-editor__input snippet-editor__title js-snippet-editor-title",
			id: "twitter-editor-title",
			value: this.data.title,
			placeholder: this.opts.placeholder.title,
			title: this.i18n.sprintf(
			/** translators: %1$s expands to Twitter */
			this.i18n.dgettext("yoast-social-previews", "%1$s title"), "Twitter"),
			labelClassName: "snippet-editor__label"
		}),
		description: new TextArea({
			className: "snippet-editor__input snippet-editor__description js-snippet-editor-description",
			id: "twitter-editor-description",
			value: this.data.description,
			placeholder: this.opts.placeholder.description,
			title: this.i18n.sprintf(
			/** translators: %1$s expands to Twitter */
			this.i18n.dgettext("yoast-social-previews", "%1$s description"), "Twitter"),
			labelClassName: "snippet-editor__label"
		}),
		imageUrl: new TextField({
			className: "snippet-editor__input snippet-editor__imageUrl js-snippet-editor-imageUrl",
			id: "twitter-editor-imageUrl",
			value: this.data.imageUrl,
			placeholder: this.opts.placeholder.imageUrl,
			title: this.i18n.sprintf(
			/** translators: %1$s expands to Twitter */
			this.i18n.dgettext("yoast-social-previews", "%1$s image"), "Twitter"),
			labelClassName: "snippet-editor__label"
		})
	};
};

/**
 * Returns all field elements.
 *
 * @returns {{title: InputElement, description: InputElement, imageUrl: InputElement}} The field element.
 */
TwitterPreview.prototype.getFieldElements = function () {
	var targetElement = this.opts.targetElement;

	return {
		title: new InputElement(targetElement.getElementsByClassName("js-snippet-editor-title")[0], {
			currentValue: this.data.title,
			defaultValue: this.opts.defaultValue.title,
			placeholder: this.opts.placeholder.title,
			fallback: this.i18n.sprintf(
			/** translators: %1$s expands to Twitter */
			this.i18n.dgettext("yoast-social-previews", "Please provide a %1$s title by editing the snippet below."), "Twitter")
		}, this.updatePreview.bind(this)),
		description: new InputElement(targetElement.getElementsByClassName("js-snippet-editor-description")[0], {
			currentValue: this.data.description,
			defaultValue: this.opts.defaultValue.description,
			placeholder: this.opts.placeholder.description,
			fallback: this.i18n.sprintf(
			/** translators: %1$s expands to Twitter */
			this.i18n.dgettext("yoast-social-previews", "Please provide a %1$s description by editing the snippet below."), "Twitter")
		}, this.updatePreview.bind(this)),
		imageUrl: new InputElement(targetElement.getElementsByClassName("js-snippet-editor-imageUrl")[0], {
			currentValue: this.data.imageUrl,
			defaultValue: this.opts.defaultValue.imageUrl,
			placeholder: this.opts.placeholder.imageUrl,
			fallback: ""
		}, this.updatePreview.bind(this))
	};
};

/**
 * Updates the twitter preview.
 */
TwitterPreview.prototype.updatePreview = function () {
	// Update the data.
	this.data.title = this.element.fieldElements.title.getInputValue();
	this.data.description = this.element.fieldElements.description.getInputValue();
	this.data.imageUrl = this.element.fieldElements.imageUrl.getInputValue();

	// Sets the title field
	this.setTitle(this.element.fieldElements.title.getValue());

	// Set the description field and parse the styling of it.
	this.setDescription(this.element.fieldElements.description.getValue());

	// Sets the Image URL
	this.setImage(this.data.imageUrl);

	// Clone so the data isn't changeable.
	this.opts.callbacks.updateSocialPreview(clone(this.data));
};

/**
 * Sets the preview title.
 *
 * @param {string} title The new title.
 */
TwitterPreview.prototype.setTitle = function (title) {
	title = this.opts.callbacks.modifyTitle(title);

	this.element.rendered.title.innerHTML = title;
};

/**
 * Set the preview description.
 *
 * @param {string} description The description to set.
 */
TwitterPreview.prototype.setDescription = function (description) {
	description = this.opts.callbacks.modifyDescription(description);

	this.element.rendered.description.innerHTML = description;
	renderDescription(this.element.rendered.description, this.element.fieldElements.description.getInputValue());
};

/**
 * Gets the image container.
 * @returns {string} The container that will hold the image.
 */
TwitterPreview.prototype.getImageContainer = function () {
	return this.element.preview.imageUrl;
};

/**
 * Updates the image object with the new URL.
 *
 * @param {string} imageUrl The image path.
 */
TwitterPreview.prototype.setImage = function (imageUrl) {
	imageUrl = this.opts.callbacks.modifyImageUrl(imageUrl);

	if (imageUrl === "" && this.data.imageUrl === "") {
		this.removeImageFromContainer();
		this.removeImageClasses();
		this.setPlaceHolder();

		return;
	}

	var img = new Image();

	img.onload = function () {
		if (this.isTooSmallImage(img)) {
			this.removeImageFromContainer();
			this.removeImageClasses();
			this.setPlaceHolder();

			return;
		}

		this.setSizingClass(img);
		this.addImageToContainer(imageUrl);
	}.bind(this);

	img.onerror = function () {
		this.removeImageFromContainer();
		this.removeImageClasses();
		this.setPlaceHolder();
	}.bind(this);

	// Load image to trigger load or error event.
	img.src = imageUrl;
};

/**
 * Sets the image of the image container.
 * @param {string} image The image to use.
 */
TwitterPreview.prototype.addImageToContainer = function (image) {
	var container = this.getImageContainer();

	container.innerHTML = "";
	container.style.backgroundImage = "url(" + image + ")";
};

/**
 * Removes the image from the container.
 */
TwitterPreview.prototype.removeImageFromContainer = function () {
	var container = this.getImageContainer();

	container.style.backgroundImage = "";
};

/**
 * Sets the proper CSS class for the current image.
 * @param {Image} img The image to base the sizing class on.
 *
 * @returns {void}
 */
TwitterPreview.prototype.setSizingClass = function (img) {
	this.removeImageClasses();

	if (this.isSmallImage(img)) {
		this.setSmallImageClasses();

		return;
	}

	this.setLargeImageClasses();

	return;
};

/**
 * Returns the max image width
 *
 * @param {Image} img The image object to use.
 * @returns {int} The calculated max width.
 */
TwitterPreview.prototype.getMaxImageWidth = function (img) {
	if (this.isSmallImage(img)) {
		return WIDTH_TWITTER_IMAGE_SMALL;
	}

	return WIDTH_TWITTER_IMAGE_LARGE;
};
/**
 * Sets the default twitter placeholder
 */
TwitterPreview.prototype.setPlaceHolder = function () {
	this.setSmallImageClasses();

	imagePlaceholder(this.element.preview.imageUrl, "", false, "twitter");
};

/**
 * Detects if the twitter preview should switch to small image mode
 *
 * @param {HTMLImageElement} image The image in question.
 *
 * @returns {boolean} Whether the image is small.
 */
TwitterPreview.prototype.isSmallImage = function (image) {
	return image.width < TWITTER_IMAGE_THRESHOLD_WIDTH || image.height < TWITTER_IMAGE_THRESHOLD_HEIGHT;
};

/**
 * Detects if the twitter preview image is too small
 *
 * @param {HTMLImageElement} image The image in question.
 *
 * @returns {boolean} Whether the image is too small.
 */
TwitterPreview.prototype.isTooSmallImage = function (image) {
	return image.width < WIDTH_TWITTER_IMAGE_SMALL || image.height < WIDTH_TWITTER_IMAGE_SMALL;
};

/**
 * Sets the classes on the facebook preview so that it will display a small facebook image preview
 */
TwitterPreview.prototype.setSmallImageClasses = function () {
	var targetElement = this.opts.targetElement;

	bemAddModifier("twitter-small", "social-preview__inner", targetElement);
	bemAddModifier("twitter-small", "editable-preview__image--twitter", targetElement);
	bemAddModifier("twitter-small", "editable-preview__text-keeper--twitter", targetElement);
};

TwitterPreview.prototype.removeSmallImageClasses = function () {
	var targetElement = this.opts.targetElement;

	bemRemoveModifier("twitter-small", "social-preview__inner", targetElement);
	bemRemoveModifier("twitter-small", "editable-preview__image--twitter", targetElement);
	bemRemoveModifier("twitter-small", "editable-preview__text-keeper--twitter", targetElement);
};

/**
 * Sets the classes on the facebook preview so that it will display a large facebook image preview
 */
TwitterPreview.prototype.setLargeImageClasses = function () {
	var targetElement = this.opts.targetElement;

	bemAddModifier("twitter-large", "social-preview__inner", targetElement);
	bemAddModifier("twitter-large", "editable-preview__image--twitter", targetElement);
	bemAddModifier("twitter-large", "editable-preview__text-keeper--twitter", targetElement);
};

TwitterPreview.prototype.removeLargeImageClasses = function () {
	var targetElement = this.opts.targetElement;

	bemRemoveModifier("twitter-large", "social-preview__inner", targetElement);
	bemRemoveModifier("twitter-large", "editable-preview__image--twitter", targetElement);
	bemRemoveModifier("twitter-large", "editable-preview__text-keeper--twitter", targetElement);
};

/**
 * Removes all image classes.
 */
TwitterPreview.prototype.removeImageClasses = function () {
	this.removeSmallImageClasses();
	this.removeLargeImageClasses();
};

/**
 * Binds the reloadSnippetText function to the blur of the snippet inputs.
 */
TwitterPreview.prototype.bindEvents = function () {
	var previewEvents = new PreviewEvents(inputTwitterPreviewBindings, this.element, true);
	previewEvents.bindEvents(this.element.editToggle, this.element.closeEditor);
};

module.exports = TwitterPreview;

},{"./element/imagePlaceholder":218,"./element/input":219,"./helpers/bem/addModifier":222,"./helpers/bem/removeModifier":224,"./helpers/renderDescription":228,"./inputs/textInput":230,"./inputs/textarea":231,"./preview/events":232,"./templates":233,"jed":235,"lodash/lang/clone":274,"lodash/lang/isElement":277,"lodash/object/defaultsDeep":288}],235:[function(require,module,exports){
arguments[4][81][0].apply(exports,arguments)
},{"dup":81}],236:[function(require,module,exports){
var arrayEach = require('../internal/arrayEach'),
    baseEach = require('../internal/baseEach'),
    createForEach = require('../internal/createForEach');

/**
 * Iterates over elements of `collection` invoking `iteratee` for each element.
 * The `iteratee` is bound to `thisArg` and invoked with three arguments:
 * (value, index|key, collection). Iteratee functions may exit iteration early
 * by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length" property
 * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
 * may be used for object iteration.
 *
 * @static
 * @memberOf _
 * @alias each
 * @category Collection
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [thisArg] The `this` binding of `iteratee`.
 * @returns {Array|Object|string} Returns `collection`.
 * @example
 *
 * _([1, 2]).forEach(function(n) {
 *   console.log(n);
 * }).value();
 * // => logs each value from left to right and returns the array
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(n, key) {
 *   console.log(n, key);
 * });
 * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
 */
var forEach = createForEach(arrayEach, baseEach);

module.exports = forEach;

},{"../internal/arrayEach":241,"../internal/baseEach":247,"../internal/createForEach":260}],237:[function(require,module,exports){
var getNative = require('../internal/getNative');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeNow = getNative(Date, 'now');

/**
 * Gets the number of milliseconds that have elapsed since the Unix epoch
 * (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @category Date
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => logs the number of milliseconds it took for the deferred function to be invoked
 */
var now = nativeNow || function() {
  return new Date().getTime();
};

module.exports = now;

},{"../internal/getNative":262}],238:[function(require,module,exports){
var isObject = require('../lang/isObject'),
    now = require('../date/now');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed invocations. Provide an options object to indicate that `func`
 * should be invoked on the leading and/or trailing edge of the `wait` timeout.
 * Subsequent calls to the debounced function return the result of the last
 * `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
 * on the trailing edge of the timeout only if the the debounced function is
 * invoked more than once during the `wait` timeout.
 *
 * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options] The options object.
 * @param {boolean} [options.leading=false] Specify invoking on the leading
 *  edge of the timeout.
 * @param {number} [options.maxWait] The maximum time `func` is allowed to be
 *  delayed before it's invoked.
 * @param {boolean} [options.trailing=true] Specify invoking on the trailing
 *  edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // avoid costly calculations while the window size is in flux
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
 * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // ensure `batchLog` is invoked once after 1 second of debounced calls
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', _.debounce(batchLog, 250, {
 *   'maxWait': 1000
 * }));
 *
 * // cancel a debounced call
 * var todoChanges = _.debounce(batchLog, 1000);
 * Object.observe(models.todo, todoChanges);
 *
 * Object.observe(models, function(changes) {
 *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
 *     todoChanges.cancel();
 *   }
 * }, ['delete']);
 *
 * // ...at some point `models.todo` is changed
 * models.todo.completed = true;
 *
 * // ...before 1 second has passed `models.todo` is deleted
 * // which cancels the debounced `todoChanges` call
 * delete models.todo;
 */
function debounce(func, wait, options) {
  var args,
      maxTimeoutId,
      result,
      stamp,
      thisArg,
      timeoutId,
      trailingCall,
      lastCalled = 0,
      maxWait = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = wait < 0 ? 0 : (+wait || 0);
  if (options === true) {
    var leading = true;
    trailing = false;
  } else if (isObject(options)) {
    leading = !!options.leading;
    maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function cancel() {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (maxTimeoutId) {
      clearTimeout(maxTimeoutId);
    }
    lastCalled = 0;
    maxTimeoutId = timeoutId = trailingCall = undefined;
  }

  function complete(isCalled, id) {
    if (id) {
      clearTimeout(id);
    }
    maxTimeoutId = timeoutId = trailingCall = undefined;
    if (isCalled) {
      lastCalled = now();
      result = func.apply(thisArg, args);
      if (!timeoutId && !maxTimeoutId) {
        args = thisArg = undefined;
      }
    }
  }

  function delayed() {
    var remaining = wait - (now() - stamp);
    if (remaining <= 0 || remaining > wait) {
      complete(trailingCall, maxTimeoutId);
    } else {
      timeoutId = setTimeout(delayed, remaining);
    }
  }

  function maxDelayed() {
    complete(trailing, timeoutId);
  }

  function debounced() {
    args = arguments;
    stamp = now();
    thisArg = this;
    trailingCall = trailing && (timeoutId || !leading);

    if (maxWait === false) {
      var leadingCall = leading && !timeoutId;
    } else {
      if (!maxTimeoutId && !leading) {
        lastCalled = stamp;
      }
      var remaining = maxWait - (stamp - lastCalled),
          isCalled = remaining <= 0 || remaining > maxWait;

      if (isCalled) {
        if (maxTimeoutId) {
          maxTimeoutId = clearTimeout(maxTimeoutId);
        }
        lastCalled = stamp;
        result = func.apply(thisArg, args);
      }
      else if (!maxTimeoutId) {
        maxTimeoutId = setTimeout(maxDelayed, remaining);
      }
    }
    if (isCalled && timeoutId) {
      timeoutId = clearTimeout(timeoutId);
    }
    else if (!timeoutId && wait !== maxWait) {
      timeoutId = setTimeout(delayed, wait);
    }
    if (leadingCall) {
      isCalled = true;
      result = func.apply(thisArg, args);
    }
    if (isCalled && !timeoutId && !maxTimeoutId) {
      args = thisArg = undefined;
    }
    return result;
  }
  debounced.cancel = cancel;
  return debounced;
}

module.exports = debounce;

},{"../date/now":237,"../lang/isObject":281}],239:[function(require,module,exports){
/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * created function and arguments from `start` and beyond provided as an array.
 *
 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/Web/JavaScript/Reference/Functions/rest_parameters).
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.restParam(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
 *
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, & pebbles'
 */
function restParam(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        rest = Array(length);

    while (++index < length) {
      rest[index] = args[start + index];
    }
    switch (start) {
      case 0: return func.call(this, rest);
      case 1: return func.call(this, args[0], rest);
      case 2: return func.call(this, args[0], args[1], rest);
    }
    var otherArgs = Array(start + 1);
    index = -1;
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = rest;
    return func.apply(this, otherArgs);
  };
}

module.exports = restParam;

},{}],240:[function(require,module,exports){
/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function arrayCopy(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = arrayCopy;

},{}],241:[function(require,module,exports){
/**
 * A specialized version of `_.forEach` for arrays without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],242:[function(require,module,exports){
/**
 * Used by `_.defaults` to customize its `_.assign` use.
 *
 * @private
 * @param {*} objectValue The destination object property value.
 * @param {*} sourceValue The source object property value.
 * @returns {*} Returns the value to assign to the destination object.
 */
function assignDefaults(objectValue, sourceValue) {
  return objectValue === undefined ? sourceValue : objectValue;
}

module.exports = assignDefaults;

},{}],243:[function(require,module,exports){
var keys = require('../object/keys');

/**
 * A specialized version of `_.assign` for customizing assigned values without
 * support for argument juggling, multiple sources, and `this` binding `customizer`
 * functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Object} Returns `object`.
 */
function assignWith(object, source, customizer) {
  var index = -1,
      props = keys(source),
      length = props.length;

  while (++index < length) {
    var key = props[index],
        value = object[key],
        result = customizer(value, source[key], key, object, source);

    if ((result === result ? (result !== value) : (value === value)) ||
        (value === undefined && !(key in object))) {
      object[key] = result;
    }
  }
  return object;
}

module.exports = assignWith;

},{"../object/keys":289}],244:[function(require,module,exports){
var baseCopy = require('./baseCopy'),
    keys = require('../object/keys');

/**
 * The base implementation of `_.assign` without support for argument juggling,
 * multiple sources, and `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return source == null
    ? object
    : baseCopy(source, keys(source), object);
}

module.exports = baseAssign;

},{"../object/keys":289,"./baseCopy":246}],245:[function(require,module,exports){
var arrayCopy = require('./arrayCopy'),
    arrayEach = require('./arrayEach'),
    baseAssign = require('./baseAssign'),
    baseForOwn = require('./baseForOwn'),
    initCloneArray = require('./initCloneArray'),
    initCloneByTag = require('./initCloneByTag'),
    initCloneObject = require('./initCloneObject'),
    isArray = require('../lang/isArray'),
    isObject = require('../lang/isObject');

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
cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
cloneableTags[dateTag] = cloneableTags[float32Tag] =
cloneableTags[float64Tag] = cloneableTags[int8Tag] =
cloneableTags[int16Tag] = cloneableTags[int32Tag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[stringTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[mapTag] = cloneableTags[setTag] =
cloneableTags[weakMapTag] = false;

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * The base implementation of `_.clone` without support for argument juggling
 * and `this` binding `customizer` functions.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {Function} [customizer] The function to customize cloning values.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The object `value` belongs to.
 * @param {Array} [stackA=[]] Tracks traversed source objects.
 * @param {Array} [stackB=[]] Associates clones with source counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object) : customizer(value);
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
      return arrayCopy(value, result);
    }
  } else {
    var tag = objToString.call(value),
        isFunc = tag == funcTag;

    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return baseAssign(result, value);
      }
    } else {
      return cloneableTags[tag]
        ? initCloneByTag(value, tag, isDeep)
        : (object ? value : {});
    }
  }
  // Check for circular references and return its corresponding clone.
  stackA || (stackA = []);
  stackB || (stackB = []);

  var length = stackA.length;
  while (length--) {
    if (stackA[length] == value) {
      return stackB[length];
    }
  }
  // Add the source value to the stack of traversed objects and associate it with its clone.
  stackA.push(value);
  stackB.push(result);

  // Recursively populate clone (susceptible to call stack limits).
  (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
    result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
  });
  return result;
}

module.exports = baseClone;

},{"../lang/isArray":276,"../lang/isObject":281,"./arrayCopy":240,"./arrayEach":241,"./baseAssign":244,"./baseForOwn":250,"./initCloneArray":263,"./initCloneByTag":264,"./initCloneObject":265}],246:[function(require,module,exports){
/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property names to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @returns {Object} Returns `object`.
 */
function baseCopy(source, props, object) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];
    object[key] = source[key];
  }
  return object;
}

module.exports = baseCopy;

},{}],247:[function(require,module,exports){
var baseForOwn = require('./baseForOwn'),
    createBaseEach = require('./createBaseEach');

/**
 * The base implementation of `_.forEach` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Array|Object|string} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object|string} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;

},{"./baseForOwn":250,"./createBaseEach":257}],248:[function(require,module,exports){
var createBaseFor = require('./createBaseFor');

/**
 * The base implementation of `baseForIn` and `baseForOwn` which iterates
 * over `object` properties returned by `keysFunc` invoking `iteratee` for
 * each property. Iteratee functions may exit iteration early by explicitly
 * returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;

},{"./createBaseFor":258}],249:[function(require,module,exports){
var baseFor = require('./baseFor'),
    keysIn = require('../object/keysIn');

/**
 * The base implementation of `_.forIn` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForIn(object, iteratee) {
  return baseFor(object, iteratee, keysIn);
}

module.exports = baseForIn;

},{"../object/keysIn":290,"./baseFor":248}],250:[function(require,module,exports){
var baseFor = require('./baseFor'),
    keys = require('../object/keys');

/**
 * The base implementation of `_.forOwn` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;

},{"../object/keys":289,"./baseFor":248}],251:[function(require,module,exports){
var arrayEach = require('./arrayEach'),
    baseMergeDeep = require('./baseMergeDeep'),
    isArray = require('../lang/isArray'),
    isArrayLike = require('./isArrayLike'),
    isObject = require('../lang/isObject'),
    isObjectLike = require('./isObjectLike'),
    isTypedArray = require('../lang/isTypedArray'),
    keys = require('../object/keys');

/**
 * The base implementation of `_.merge` without support for argument juggling,
 * multiple sources, and `this` binding `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Array} [stackA=[]] Tracks traversed source objects.
 * @param {Array} [stackB=[]] Associates values with source counterparts.
 * @returns {Object} Returns `object`.
 */
function baseMerge(object, source, customizer, stackA, stackB) {
  if (!isObject(object)) {
    return object;
  }
  var isSrcArr = isArrayLike(source) && (isArray(source) || isTypedArray(source)),
      props = isSrcArr ? undefined : keys(source);

  arrayEach(props || source, function(srcValue, key) {
    if (props) {
      key = srcValue;
      srcValue = source[key];
    }
    if (isObjectLike(srcValue)) {
      stackA || (stackA = []);
      stackB || (stackB = []);
      baseMergeDeep(object, source, key, baseMerge, customizer, stackA, stackB);
    }
    else {
      var value = object[key],
          result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
          isCommon = result === undefined;

      if (isCommon) {
        result = srcValue;
      }
      if ((result !== undefined || (isSrcArr && !(key in object))) &&
          (isCommon || (result === result ? (result !== value) : (value === value)))) {
        object[key] = result;
      }
    }
  });
  return object;
}

module.exports = baseMerge;

},{"../lang/isArray":276,"../lang/isObject":281,"../lang/isTypedArray":284,"../object/keys":289,"./arrayEach":241,"./baseMergeDeep":252,"./isArrayLike":266,"./isObjectLike":270}],252:[function(require,module,exports){
var arrayCopy = require('./arrayCopy'),
    isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isArrayLike = require('./isArrayLike'),
    isPlainObject = require('../lang/isPlainObject'),
    isTypedArray = require('../lang/isTypedArray'),
    toPlainObject = require('../lang/toPlainObject');

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Array} [stackA=[]] Tracks traversed source objects.
 * @param {Array} [stackB=[]] Associates values with source counterparts.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseMergeDeep(object, source, key, mergeFunc, customizer, stackA, stackB) {
  var length = stackA.length,
      srcValue = source[key];

  while (length--) {
    if (stackA[length] == srcValue) {
      object[key] = stackB[length];
      return;
    }
  }
  var value = object[key],
      result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
      isCommon = result === undefined;

  if (isCommon) {
    result = srcValue;
    if (isArrayLike(srcValue) && (isArray(srcValue) || isTypedArray(srcValue))) {
      result = isArray(value)
        ? value
        : (isArrayLike(value) ? arrayCopy(value) : []);
    }
    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      result = isArguments(value)
        ? toPlainObject(value)
        : (isPlainObject(value) ? value : {});
    }
    else {
      isCommon = false;
    }
  }
  // Add the source value to the stack of traversed objects and associate
  // it with its merged value.
  stackA.push(srcValue);
  stackB.push(result);

  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    object[key] = mergeFunc(result, srcValue, customizer, stackA, stackB);
  } else if (result === result ? (result !== value) : (value === value)) {
    object[key] = result;
  }
}

module.exports = baseMergeDeep;

},{"../lang/isArguments":275,"../lang/isArray":276,"../lang/isPlainObject":282,"../lang/isTypedArray":284,"../lang/toPlainObject":285,"./arrayCopy":240,"./isArrayLike":266}],253:[function(require,module,exports){
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],254:[function(require,module,exports){
var identity = require('../utility/identity');

/**
 * A specialized version of `baseCallback` which only supports `this` binding
 * and specifying the number of arguments to provide to `func`.
 *
 * @private
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function bindCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  if (thisArg === undefined) {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
    case 5: return function(value, other, key, object, source) {
      return func.call(thisArg, value, other, key, object, source);
    };
  }
  return function() {
    return func.apply(thisArg, arguments);
  };
}

module.exports = bindCallback;

},{"../utility/identity":292}],255:[function(require,module,exports){
(function (global){
/** Native method references. */
var ArrayBuffer = global.ArrayBuffer,
    Uint8Array = global.Uint8Array;

/**
 * Creates a clone of the given array buffer.
 *
 * @private
 * @param {ArrayBuffer} buffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function bufferClone(buffer) {
  var result = new ArrayBuffer(buffer.byteLength),
      view = new Uint8Array(result);

  view.set(new Uint8Array(buffer));
  return result;
}

module.exports = bufferClone;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],256:[function(require,module,exports){
var bindCallback = require('./bindCallback'),
    isIterateeCall = require('./isIterateeCall'),
    restParam = require('../function/restParam');

/**
 * Creates a `_.assign`, `_.defaults`, or `_.merge` function.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return restParam(function(object, sources) {
    var index = -1,
        length = object == null ? 0 : sources.length,
        customizer = length > 2 ? sources[length - 2] : undefined,
        guard = length > 2 ? sources[2] : undefined,
        thisArg = length > 1 ? sources[length - 1] : undefined;

    if (typeof customizer == 'function') {
      customizer = bindCallback(customizer, thisArg, 5);
      length -= 2;
    } else {
      customizer = typeof thisArg == 'function' ? thisArg : undefined;
      length -= (customizer ? 1 : 0);
    }
    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;

},{"../function/restParam":239,"./bindCallback":254,"./isIterateeCall":268}],257:[function(require,module,exports){
var getLength = require('./getLength'),
    isLength = require('./isLength'),
    toObject = require('./toObject');

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
    var length = collection ? getLength(collection) : 0;
    if (!isLength(length)) {
      return eachFunc(collection, iteratee);
    }
    var index = fromRight ? length : -1,
        iterable = toObject(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;

},{"./getLength":261,"./isLength":269,"./toObject":273}],258:[function(require,module,exports){
var toObject = require('./toObject');

/**
 * Creates a base function for `_.forIn` or `_.forInRight`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var iterable = toObject(object),
        props = keysFunc(object),
        length = props.length,
        index = fromRight ? length : -1;

    while ((fromRight ? index-- : ++index < length)) {
      var key = props[index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;

},{"./toObject":273}],259:[function(require,module,exports){
var restParam = require('../function/restParam');

/**
 * Creates a `_.defaults` or `_.defaultsDeep` function.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Function} Returns the new defaults function.
 */
function createDefaults(assigner, customizer) {
  return restParam(function(args) {
    var object = args[0];
    if (object == null) {
      return object;
    }
    args.push(customizer);
    return assigner.apply(undefined, args);
  });
}

module.exports = createDefaults;

},{"../function/restParam":239}],260:[function(require,module,exports){
var bindCallback = require('./bindCallback'),
    isArray = require('../lang/isArray');

/**
 * Creates a function for `_.forEach` or `_.forEachRight`.
 *
 * @private
 * @param {Function} arrayFunc The function to iterate over an array.
 * @param {Function} eachFunc The function to iterate over a collection.
 * @returns {Function} Returns the new each function.
 */
function createForEach(arrayFunc, eachFunc) {
  return function(collection, iteratee, thisArg) {
    return (typeof iteratee == 'function' && thisArg === undefined && isArray(collection))
      ? arrayFunc(collection, iteratee)
      : eachFunc(collection, bindCallback(iteratee, thisArg, 3));
  };
}

module.exports = createForEach;

},{"../lang/isArray":276,"./bindCallback":254}],261:[function(require,module,exports){
var baseProperty = require('./baseProperty');

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

module.exports = getLength;

},{"./baseProperty":253}],262:[function(require,module,exports){
var isNative = require('../lang/isNative');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

module.exports = getNative;

},{"../lang/isNative":280}],263:[function(require,module,exports){
/** Used for native method references. */
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
      result = new array.constructor(length);

  // Add array properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;

},{}],264:[function(require,module,exports){
var bufferClone = require('./bufferClone');

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    stringTag = '[object String]';

var arrayBufferTag = '[object ArrayBuffer]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return bufferClone(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      var buffer = object.buffer;
      return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      var result = new Ctor(object.source, reFlags.exec(object));
      result.lastIndex = object.lastIndex;
  }
  return result;
}

module.exports = initCloneByTag;

},{"./bufferClone":255}],265:[function(require,module,exports){
/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  var Ctor = object.constructor;
  if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
    Ctor = Object;
  }
  return new Ctor;
}

module.exports = initCloneObject;

},{}],266:[function(require,module,exports){
var getLength = require('./getLength'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

module.exports = isArrayLike;

},{"./getLength":261,"./isLength":269}],267:[function(require,module,exports){
/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

module.exports = isIndex;

},{}],268:[function(require,module,exports){
var isArrayLike = require('./isArrayLike'),
    isIndex = require('./isIndex'),
    isObject = require('../lang/isObject');

/**
 * Checks if the provided arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
      ? (isArrayLike(object) && isIndex(index, object.length))
      : (type == 'string' && index in object)) {
    var other = object[index];
    return value === value ? (value === other) : (other !== other);
  }
  return false;
}

module.exports = isIterateeCall;

},{"../lang/isObject":281,"./isArrayLike":266,"./isIndex":267}],269:[function(require,module,exports){
/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],270:[function(require,module,exports){
/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],271:[function(require,module,exports){
var merge = require('../object/merge');

/**
 * Used by `_.defaultsDeep` to customize its `_.merge` use.
 *
 * @private
 * @param {*} objectValue The destination object property value.
 * @param {*} sourceValue The source object property value.
 * @returns {*} Returns the value to assign to the destination object.
 */
function mergeDefaults(objectValue, sourceValue) {
  return objectValue === undefined ? sourceValue : merge(objectValue, sourceValue, mergeDefaults);
}

module.exports = mergeDefaults;

},{"../object/merge":291}],272:[function(require,module,exports){
var isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isIndex = require('./isIndex'),
    isLength = require('./isLength'),
    keysIn = require('../object/keysIn');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A fallback implementation of `Object.keys` which creates an array of the
 * own enumerable property names of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function shimKeys(object) {
  var props = keysIn(object),
      propsLength = props.length,
      length = propsLength && object.length;

  var allowIndexes = !!length && isLength(length) &&
    (isArray(object) || isArguments(object));

  var index = -1,
      result = [];

  while (++index < propsLength) {
    var key = props[index];
    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
      result.push(key);
    }
  }
  return result;
}

module.exports = shimKeys;

},{"../lang/isArguments":275,"../lang/isArray":276,"../object/keysIn":290,"./isIndex":267,"./isLength":269}],273:[function(require,module,exports){
var isObject = require('../lang/isObject');

/**
 * Converts `value` to an object if it's not one.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {Object} Returns the object.
 */
function toObject(value) {
  return isObject(value) ? value : Object(value);
}

module.exports = toObject;

},{"../lang/isObject":281}],274:[function(require,module,exports){
var baseClone = require('../internal/baseClone'),
    bindCallback = require('../internal/bindCallback'),
    isIterateeCall = require('../internal/isIterateeCall');

/**
 * Creates a clone of `value`. If `isDeep` is `true` nested objects are cloned,
 * otherwise they are assigned by reference. If `customizer` is provided it's
 * invoked to produce the cloned values. If `customizer` returns `undefined`
 * cloning is handled by the method instead. The `customizer` is bound to
 * `thisArg` and invoked with up to three argument; (value [, index|key, object]).
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm).
 * The enumerable properties of `arguments` objects and objects created by
 * constructors other than `Object` are cloned to plain `Object` objects. An
 * empty object is returned for uncloneable values such as functions, DOM nodes,
 * Maps, Sets, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {Function} [customizer] The function to customize cloning values.
 * @param {*} [thisArg] The `this` binding of `customizer`.
 * @returns {*} Returns the cloned value.
 * @example
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * var shallow = _.clone(users);
 * shallow[0] === users[0];
 * // => true
 *
 * var deep = _.clone(users, true);
 * deep[0] === users[0];
 * // => false
 *
 * // using a customizer callback
 * var el = _.clone(document.body, function(value) {
 *   if (_.isElement(value)) {
 *     return value.cloneNode(false);
 *   }
 * });
 *
 * el === document.body
 * // => false
 * el.nodeName
 * // => BODY
 * el.childNodes.length;
 * // => 0
 */
function clone(value, isDeep, customizer, thisArg) {
  if (isDeep && typeof isDeep != 'boolean' && isIterateeCall(value, isDeep, customizer)) {
    isDeep = false;
  }
  else if (typeof isDeep == 'function') {
    thisArg = customizer;
    customizer = isDeep;
    isDeep = false;
  }
  return typeof customizer == 'function'
    ? baseClone(value, isDeep, bindCallback(customizer, thisArg, 3))
    : baseClone(value, isDeep);
}

module.exports = clone;

},{"../internal/baseClone":245,"../internal/bindCallback":254,"../internal/isIterateeCall":268}],275:[function(require,module,exports){
var isArrayLike = require('../internal/isArrayLike'),
    isObjectLike = require('../internal/isObjectLike');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Native method references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is classified as an `arguments` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  return isObjectLike(value) && isArrayLike(value) &&
    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
}

module.exports = isArguments;

},{"../internal/isArrayLike":266,"../internal/isObjectLike":270}],276:[function(require,module,exports){
var getNative = require('../internal/getNative'),
    isLength = require('../internal/isLength'),
    isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var arrayTag = '[object Array]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsArray = getNative(Array, 'isArray');

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(function() { return arguments; }());
 * // => false
 */
var isArray = nativeIsArray || function(value) {
  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
};

module.exports = isArray;

},{"../internal/getNative":262,"../internal/isLength":269,"../internal/isObjectLike":270}],277:[function(require,module,exports){
var isObjectLike = require('../internal/isObjectLike'),
    isPlainObject = require('./isPlainObject');

/**
 * Checks if `value` is a DOM element.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a DOM element, else `false`.
 * @example
 *
 * _.isElement(document.body);
 * // => true
 *
 * _.isElement('<body>');
 * // => false
 */
function isElement(value) {
  return !!value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value);
}

module.exports = isElement;

},{"../internal/isObjectLike":270,"./isPlainObject":282}],278:[function(require,module,exports){
var isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isArrayLike = require('../internal/isArrayLike'),
    isFunction = require('./isFunction'),
    isObjectLike = require('../internal/isObjectLike'),
    isString = require('./isString'),
    keys = require('../object/keys');

/**
 * Checks if `value` is empty. A value is considered empty unless it's an
 * `arguments` object, array, string, or jQuery-like collection with a length
 * greater than `0` or an object with own enumerable properties.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {Array|Object|string} value The value to inspect.
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
  if (isArrayLike(value) && (isArray(value) || isString(value) || isArguments(value) ||
      (isObjectLike(value) && isFunction(value.splice)))) {
    return !value.length;
  }
  return !keys(value).length;
}

module.exports = isEmpty;

},{"../internal/isArrayLike":266,"../internal/isObjectLike":270,"../object/keys":289,"./isArguments":275,"./isArray":276,"./isFunction":279,"./isString":283}],279:[function(require,module,exports){
var isObject = require('./isObject');

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 which returns 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

module.exports = isFunction;

},{"./isObject":281}],280:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isObjectLike = require('../internal/isObjectLike');

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = isNative;

},{"../internal/isObjectLike":270,"./isFunction":279}],281:[function(require,module,exports){
/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
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
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],282:[function(require,module,exports){
var baseForIn = require('../internal/baseForIn'),
    isArguments = require('./isArguments'),
    isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * **Note:** This method assumes objects created by the `Object` constructor
 * have no inherited enumerable properties.
 *
 * @static
 * @memberOf _
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
  var Ctor;

  // Exit early for non `Object` objects.
  if (!(isObjectLike(value) && objToString.call(value) == objectTag && !isArguments(value)) ||
      (!hasOwnProperty.call(value, 'constructor') && (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor)))) {
    return false;
  }
  // IE < 9 iterates inherited properties before own properties. If the first
  // iterated property is an object's own property then there are no inherited
  // enumerable properties.
  var result;
  // In most environments an object's own properties are iterated before
  // its inherited properties. If the last iterated property is an object's
  // own property then there are no inherited enumerable properties.
  baseForIn(value, function(subValue, key) {
    result = key;
  });
  return result === undefined || hasOwnProperty.call(value, result);
}

module.exports = isPlainObject;

},{"../internal/baseForIn":249,"../internal/isObjectLike":270,"./isArguments":275}],283:[function(require,module,exports){
var isObjectLike = require('../internal/isObjectLike');

/** `Object#toString` result references. */
var stringTag = '[object String]';

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag);
}

module.exports = isString;

},{"../internal/isObjectLike":270}],284:[function(require,module,exports){
var isLength = require('../internal/isLength'),
    isObjectLike = require('../internal/isObjectLike');

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
typedArrayTags[dateTag] = typedArrayTags[errorTag] =
typedArrayTags[funcTag] = typedArrayTags[mapTag] =
typedArrayTags[numberTag] = typedArrayTags[objectTag] =
typedArrayTags[regexpTag] = typedArrayTags[setTag] =
typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

/** Used for native method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
function isTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
}

module.exports = isTypedArray;

},{"../internal/isLength":269,"../internal/isObjectLike":270}],285:[function(require,module,exports){
var baseCopy = require('../internal/baseCopy'),
    keysIn = require('../object/keysIn');

/**
 * Converts `value` to a plain object flattening inherited enumerable
 * properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
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
  return baseCopy(value, keysIn(value));
}

module.exports = toPlainObject;

},{"../internal/baseCopy":246,"../object/keysIn":290}],286:[function(require,module,exports){
var assignWith = require('../internal/assignWith'),
    baseAssign = require('../internal/baseAssign'),
    createAssigner = require('../internal/createAssigner');

/**
 * Assigns own enumerable properties of source object(s) to the destination
 * object. Subsequent sources overwrite property assignments of previous sources.
 * If `customizer` is provided it's invoked to produce the assigned values.
 * The `customizer` is bound to `thisArg` and invoked with five arguments:
 * (objectValue, sourceValue, key, object, source).
 *
 * **Note:** This method mutates `object` and is based on
 * [`Object.assign`](http://ecma-international.org/ecma-262/6.0/#sec-object.assign).
 *
 * @static
 * @memberOf _
 * @alias extend
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {*} [thisArg] The `this` binding of `customizer`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
 * // => { 'user': 'fred', 'age': 40 }
 *
 * // using a customizer callback
 * var defaults = _.partialRight(_.assign, function(value, other) {
 *   return _.isUndefined(value) ? other : value;
 * });
 *
 * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
 * // => { 'user': 'barney', 'age': 36 }
 */
var assign = createAssigner(function(object, source, customizer) {
  return customizer
    ? assignWith(object, source, customizer)
    : baseAssign(object, source);
});

module.exports = assign;

},{"../internal/assignWith":243,"../internal/baseAssign":244,"../internal/createAssigner":256}],287:[function(require,module,exports){
var assign = require('./assign'),
    assignDefaults = require('../internal/assignDefaults'),
    createDefaults = require('../internal/createDefaults');

/**
 * Assigns own enumerable properties of source object(s) to the destination
 * object for all destination properties that resolve to `undefined`. Once a
 * property is set, additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
 * // => { 'user': 'barney', 'age': 36 }
 */
var defaults = createDefaults(assign, assignDefaults);

module.exports = defaults;

},{"../internal/assignDefaults":242,"../internal/createDefaults":259,"./assign":286}],288:[function(require,module,exports){
var createDefaults = require('../internal/createDefaults'),
    merge = require('./merge'),
    mergeDefaults = require('../internal/mergeDefaults');

/**
 * This method is like `_.defaults` except that it recursively assigns
 * default properties.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * _.defaultsDeep({ 'user': { 'name': 'barney' } }, { 'user': { 'name': 'fred', 'age': 36 } });
 * // => { 'user': { 'name': 'barney', 'age': 36 } }
 *
 */
var defaultsDeep = createDefaults(merge, mergeDefaults);

module.exports = defaultsDeep;

},{"../internal/createDefaults":259,"../internal/mergeDefaults":271,"./merge":291}],289:[function(require,module,exports){
var getNative = require('../internal/getNative'),
    isArrayLike = require('../internal/isArrayLike'),
    isObject = require('../lang/isObject'),
    shimKeys = require('../internal/shimKeys');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeKeys = getNative(Object, 'keys');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
 * for more details.
 *
 * @static
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
var keys = !nativeKeys ? shimKeys : function(object) {
  var Ctor = object == null ? undefined : object.constructor;
  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
      (typeof object != 'function' && isArrayLike(object))) {
    return shimKeys(object);
  }
  return isObject(object) ? nativeKeys(object) : [];
};

module.exports = keys;

},{"../internal/getNative":262,"../internal/isArrayLike":266,"../internal/shimKeys":272,"../lang/isObject":281}],290:[function(require,module,exports){
var isArguments = require('../lang/isArguments'),
    isArray = require('../lang/isArray'),
    isIndex = require('../internal/isIndex'),
    isLength = require('../internal/isLength'),
    isObject = require('../lang/isObject');

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
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
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  if (object == null) {
    return [];
  }
  if (!isObject(object)) {
    object = Object(object);
  }
  var length = object.length;
  length = (length && isLength(length) &&
    (isArray(object) || isArguments(object)) && length) || 0;

  var Ctor = object.constructor,
      index = -1,
      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
      result = Array(length),
      skipIndexes = length > 0;

  while (++index < length) {
    result[index] = (index + '');
  }
  for (var key in object) {
    if (!(skipIndexes && isIndex(key, length)) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keysIn;

},{"../internal/isIndex":267,"../internal/isLength":269,"../lang/isArguments":275,"../lang/isArray":276,"../lang/isObject":281}],291:[function(require,module,exports){
var baseMerge = require('../internal/baseMerge'),
    createAssigner = require('../internal/createAssigner');

/**
 * Recursively merges own enumerable properties of the source object(s), that
 * don't resolve to `undefined` into the destination object. Subsequent sources
 * overwrite property assignments of previous sources. If `customizer` is
 * provided it's invoked to produce the merged values of the destination and
 * source properties. If `customizer` returns `undefined` merging is handled
 * by the method instead. The `customizer` is bound to `thisArg` and invoked
 * with five arguments: (objectValue, sourceValue, key, object, source).
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {*} [thisArg] The `this` binding of `customizer`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var users = {
 *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
 * };
 *
 * var ages = {
 *   'data': [{ 'age': 36 }, { 'age': 40 }]
 * };
 *
 * _.merge(users, ages);
 * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
 *
 * // using a customizer callback
 * var object = {
 *   'fruits': ['apple'],
 *   'vegetables': ['beet']
 * };
 *
 * var other = {
 *   'fruits': ['banana'],
 *   'vegetables': ['carrot']
 * };
 *
 * _.merge(object, other, function(a, b) {
 *   if (_.isArray(a)) {
 *     return a.concat(b);
 *   }
 * });
 * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
 */
var merge = createAssigner(baseMerge);

module.exports = merge;

},{"../internal/baseMerge":251,"../internal/createAssigner":256}],292:[function(require,module,exports){
/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}]},{},[80])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9qcy9oZWxwZXJzL2h0bWwuanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9qcy9zdHJpbmdQcm9jZXNzaW5nL2ltYWdlSW5UZXh0LmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvanMvc3RyaW5nUHJvY2Vzc2luZy9tYXRjaFN0cmluZ1dpdGhSZWdleC5qcyIsIi4uLy4uL1lvYXN0U0VPLmpzL2pzL3N0cmluZ1Byb2Nlc3Npbmcvc3RyaXBIVE1MVGFncy5qcyIsIi4uLy4uL1lvYXN0U0VPLmpzL2pzL3N0cmluZ1Byb2Nlc3Npbmcvc3RyaXBTcGFjZXMuanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL19IYXNoLmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fTGlzdENhY2hlLmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fTWFwLmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fTWFwQ2FjaGUuanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL19TeW1ib2wuanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUVhY2guanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheUxpa2VLZXlzLmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYXNzb2NJbmRleE9mLmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUVhY2guanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlRm9yLmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUZvck93bi5qcyIsIi4uLy4uL1lvYXN0U0VPLmpzL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXRUYWcuanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNBcmd1bWVudHMuanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNOYXRpdmUuanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSXNUeXBlZEFycmF5LmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUtleXMuanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVGltZXMuanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVW5hcnkuanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL19jYXN0RnVuY3Rpb24uanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL19jb3JlSnNEYXRhLmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fY3JlYXRlQmFzZUVhY2guanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL19jcmVhdGVCYXNlRm9yLmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fZnJlZUdsb2JhbC5qcyIsIi4uLy4uL1lvYXN0U0VPLmpzL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldE1hcERhdGEuanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXROYXRpdmUuanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRSYXdUYWcuanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRWYWx1ZS5qcyIsIi4uLy4uL1lvYXN0U0VPLmpzL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hDbGVhci5qcyIsIi4uLy4uL1lvYXN0U0VPLmpzL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hEZWxldGUuanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL19oYXNoR2V0LmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzaEhhcy5qcyIsIi4uLy4uL1lvYXN0U0VPLmpzL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hTZXQuanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL19pc0luZGV4LmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNLZXlhYmxlLmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNNYXNrZWQuanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL19pc1Byb3RvdHlwZS5qcyIsIi4uLy4uL1lvYXN0U0VPLmpzL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2xpc3RDYWNoZUNsZWFyLmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlRGVsZXRlLmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlR2V0LmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlSGFzLmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbGlzdENhY2hlU2V0LmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVDbGVhci5qcyIsIi4uLy4uL1lvYXN0U0VPLmpzL25vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlRGVsZXRlLmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbWFwQ2FjaGVHZXQuanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL19tYXBDYWNoZUhhcy5qcyIsIi4uLy4uL1lvYXN0U0VPLmpzL25vZGVfbW9kdWxlcy9sb2Rhc2gvX21hcENhY2hlU2V0LmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlQ3JlYXRlLmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fbmF0aXZlS2V5cy5qcyIsIi4uLy4uL1lvYXN0U0VPLmpzL25vZGVfbW9kdWxlcy9sb2Rhc2gvX25vZGVVdGlsLmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fb2JqZWN0VG9TdHJpbmcuanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL19vdmVyQXJnLmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fcm9vdC5qcyIsIi4uLy4uL1lvYXN0U0VPLmpzL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3RvU291cmNlLmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9lcS5qcyIsIi4uLy4uL1lvYXN0U0VPLmpzL25vZGVfbW9kdWxlcy9sb2Rhc2gvZm9yRWFjaC5qcyIsIi4uLy4uL1lvYXN0U0VPLmpzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaWRlbnRpdHkuanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL2lzQXJndW1lbnRzLmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5LmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5TGlrZS5qcyIsIi4uLy4uL1lvYXN0U0VPLmpzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNCdWZmZXIuanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL2lzRnVuY3Rpb24uanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL2lzTGVuZ3RoLmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdC5qcyIsIi4uLy4uL1lvYXN0U0VPLmpzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3RMaWtlLmpzIiwiLi4vLi4vWW9hc3RTRU8uanMvbm9kZV9tb2R1bGVzL2xvZGFzaC9pc1R5cGVkQXJyYXkuanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL2tleXMuanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL21lbW9pemUuanMiLCIuLi8uLi9Zb2FzdFNFTy5qcy9ub2RlX21vZHVsZXMvbG9kYXNoL3N0dWJGYWxzZS5qcyIsIi4uLy4uL1lvYXN0U0VPLmpzL25vZGVfbW9kdWxlcy90b2tlbml6ZXIyL2NvcmUuanMiLCIuLi9qcy9zcmMvYW5hbHlzaXMvZ2V0RGVzY3JpcHRpb25QbGFjZWhvbGRlci5qcyIsIi4uL2pzL3NyYy9hbmFseXNpcy9nZXRMMTBuT2JqZWN0LmpzIiwiLi4vanMvc3JjL2FuYWx5c2lzL2dldFRpdGxlUGxhY2Vob2xkZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzVW5kZWZpbmVkLmpzIiwiYXNzZXRzL2pzL3NyYy9oZWxwUGFuZWwuanMiLCJhc3NldHMvanMvc3JjL3lvYXN0LXByZW1pdW0tc29jaWFsLXByZXZpZXcuanMiLCJub2RlX21vZHVsZXMvamVkL2plZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX0RhdGFWaWV3LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fUHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1NldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1N0YWNrLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fVWludDhBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX1dlYWtNYXAuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hZGRNYXBFbnRyeS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2FkZFNldEVudHJ5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYXJyYXlNYXAuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheVB1c2guanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19hcnJheVJlZHVjZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Fzc2lnblZhbHVlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VBc3NpZ25Jbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VBc3NpZ25WYWx1ZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VDbG9uZS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VDcmVhdGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0QWxsS2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXRUYWcuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUtleXNJbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUb1N0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nhc3RQYXRoLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVBcnJheUJ1ZmZlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lQnVmZmVyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVEYXRhVmlldy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lTWFwLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVSZWdFeHAuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19jbG9uZVNldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2Nsb25lU3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY2xvbmVUeXBlZEFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY29weUFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY29weU9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2NvcHlTeW1ib2xzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fY29weVN5bWJvbHNJbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2RlZmluZVByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZnJlZUdsb2JhbC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldEFsbEtleXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRBbGxLZXlzSW4uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRQcm90b3R5cGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19nZXRTeW1ib2xzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0U3ltYm9sc0luLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faGFzUGF0aC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2hhc2hIYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19pbml0Q2xvbmVBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX2luaXRDbG9uZUJ5VGFnLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faW5pdENsb25lT2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9faXNLZXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19tYXBUb0FycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fbWVtb2l6ZUNhcHBlZC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX25hdGl2ZUtleXNJbi5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3NldFRvQXJyYXkuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0NsZWFyLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tEZWxldGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zdGFja0dldC5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvX3N0YWNrSGFzLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9fc3RhY2tTZXQuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL19zdHJpbmdUb1BhdGguanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL190b0tleS5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvY2xvbmUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2RlYm91bmNlLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9oYXMuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL2lzU3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC9rZXlzSW4uanMiLCJub2RlX21vZHVsZXMvbG9kYXNoL25vdy5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvc3R1YkFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2xvZGFzaC90b051bWJlci5qcyIsIm5vZGVfbW9kdWxlcy9sb2Rhc2gvdG9TdHJpbmcuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3MvaW5kZXguanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvZWxlbWVudC9pbWFnZVBsYWNlaG9sZGVyLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL2VsZW1lbnQvaW5wdXQuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvZmFjZWJvb2tQcmV2aWV3LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL2hlbHBlcnMvYWRkQ2xhc3MuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvaGVscGVycy9iZW0vYWRkTW9kaWZpZXIuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvaGVscGVycy9iZW0vYWRkTW9kaWZpZXJUb0NsYXNzLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL2hlbHBlcnMvYmVtL3JlbW92ZU1vZGlmaWVyLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL2hlbHBlcnMvaW1hZ2VEaXNwbGF5TW9kZS5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9qcy9oZWxwZXJzL21pbmltaXplSHRtbC5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9qcy9oZWxwZXJzL3JlbW92ZUNsYXNzLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL2hlbHBlcnMvcmVuZGVyRGVzY3JpcHRpb24uanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvaW5wdXRzL2lucHV0RmllbGQuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvaW5wdXRzL3RleHRJbnB1dC5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9qcy9pbnB1dHMvdGV4dGFyZWEuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvcHJldmlldy9ldmVudHMuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3MvanMvdGVtcGxhdGVzLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL2pzL3R3aXR0ZXJQcmV2aWV3LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvY29sbGVjdGlvbi9mb3JFYWNoLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvZGF0ZS9ub3cuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9mdW5jdGlvbi9kZWJvdW5jZS5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2Z1bmN0aW9uL3Jlc3RQYXJhbS5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2FycmF5Q29weS5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2FycmF5RWFjaC5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2Fzc2lnbkRlZmF1bHRzLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYXNzaWduV2l0aC5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2Jhc2VBc3NpZ24uanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlQ2xvbmUuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlQ29weS5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2Jhc2VFYWNoLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZUZvci5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2Jhc2VGb3JJbi5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2Jhc2VGb3JPd24uanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlTWVyZ2UuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9iYXNlTWVyZ2VEZWVwLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmFzZVByb3BlcnR5LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYmluZENhbGxiYWNrLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvYnVmZmVyQ2xvbmUuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9jcmVhdGVBc3NpZ25lci5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2NyZWF0ZUJhc2VFYWNoLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvY3JlYXRlQmFzZUZvci5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2NyZWF0ZURlZmF1bHRzLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvY3JlYXRlRm9yRWFjaC5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2dldExlbmd0aC5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2dldE5hdGl2ZS5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2luaXRDbG9uZUFycmF5LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvaW5pdENsb25lQnlUYWcuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9pbml0Q2xvbmVPYmplY3QuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9pc0FycmF5TGlrZS5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2lzSW5kZXguanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9pbnRlcm5hbC9pc0l0ZXJhdGVlQ2FsbC5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL2lzTGVuZ3RoLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvaXNPYmplY3RMaWtlLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvbWVyZ2VEZWZhdWx0cy5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2ludGVybmFsL3NoaW1LZXlzLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaW50ZXJuYWwvdG9PYmplY3QuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9sYW5nL2Nsb25lLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy9pc0FyZ3VtZW50cy5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2xhbmcvaXNBcnJheS5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2xhbmcvaXNFbGVtZW50LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy9pc0VtcHR5LmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy9pc0Z1bmN0aW9uLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy9pc05hdGl2ZS5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL2xhbmcvaXNPYmplY3QuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9sYW5nL2lzUGxhaW5PYmplY3QuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9sYW5nL2lzU3RyaW5nLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvbGFuZy9pc1R5cGVkQXJyYXkuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9sYW5nL3RvUGxhaW5PYmplY3QuanMiLCIuLi8uLi95b2FzdC1zb2NpYWwtcHJldmlld3Mvbm9kZV9tb2R1bGVzL2xvZGFzaC9vYmplY3QvYXNzaWduLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvb2JqZWN0L2RlZmF1bHRzLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvb2JqZWN0L2RlZmF1bHRzRGVlcC5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL29iamVjdC9rZXlzLmpzIiwiLi4vLi4veW9hc3Qtc29jaWFsLXByZXZpZXdzL25vZGVfbW9kdWxlcy9sb2Rhc2gvb2JqZWN0L2tleXNJbi5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL29iamVjdC9tZXJnZS5qcyIsIi4uLy4uL3lvYXN0LXNvY2lhbC1wcmV2aWV3cy9ub2RlX21vZHVsZXMvbG9kYXNoL3V0aWxpdHkvaWRlbnRpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQUksZ0JBQWdCLENBQUEsQUFBRSxXQUFGLEFBQWEsV0FBYixBQUF3QixTQUF4QixBQUFpQyxjQUFqQyxBQUErQyxVQUEvQyxBQUF5RCxNQUF6RCxBQUErRCxPQUEvRCxBQUFzRSxNQUF0RSxBQUE0RSxZQUE1RSxBQUF3RixjQUF4RixBQUNuQixVQURtQixBQUNULFVBRFMsQUFDQyxRQURELEFBQ1MsTUFEVCxBQUNlLE1BRGYsQUFDcUIsTUFEckIsQUFDMkIsTUFEM0IsQUFDaUMsTUFEakMsQUFDdUMsTUFEdkMsQUFDNkMsVUFEN0MsQUFDdUQsVUFEdkQsQUFDaUUsTUFEakUsQUFDdUUsTUFEdkUsQUFDNkUsUUFEN0UsQUFDcUYsT0FEckYsQUFFbkIsWUFGbUIsQUFFUCxNQUZPLEFBRUQsVUFGQyxBQUVTLEtBRlQsQUFFYyxPQUZkLEFBRXFCLFdBRnJCLEFBRWdDLFNBRmhDLEFBRXlDLFNBRnpDLEFBRWtELE1BRnRFLEFBQW9CLEFBRXdEO0FBQzVFLElBQUksaUJBQWlCLENBQUEsQUFBRSxLQUFGLEFBQU8sT0FBUCxBQUFjLEtBQWQsQUFBbUIsU0FBbkIsQUFBNEIsTUFBNUIsQUFBa0MsUUFBbEMsQUFBMEMsV0FBMUMsQUFBcUQsUUFBckQsQUFBNkQsUUFBN0QsQUFBcUUsT0FBckUsQUFBNEUsTUFBNUUsQUFBa0YsT0FBbEYsQUFBeUYsVUFBekYsQUFDcEIsUUFEb0IsQUFDWixRQURZLEFB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QUEsQUFBSyxRQUFMLEFBQWMsY0FBckIsQUFBTyxBQUE0QixBQUVuQzs7UUFBQSxBQUFPLEFBQ1A7QUFYRDs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuZ0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDNUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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akI7Ozs7O0FDamxCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGJsb2NrRWxlbWVudHMgPSBbIFwiYWRkcmVzc1wiLCBcImFydGljbGVcIiwgXCJhc2lkZVwiLCBcImJsb2NrcXVvdGVcIiwgXCJjYW52YXNcIiwgXCJkZFwiLCBcImRpdlwiLCBcImRsXCIsIFwiZmllbGRzZXRcIiwgXCJmaWdjYXB0aW9uXCIsXG5cdFwiZmlndXJlXCIsIFwiZm9vdGVyXCIsIFwiZm9ybVwiLCBcImgxXCIsIFwiaDJcIiwgXCJoM1wiLCBcImg0XCIsIFwiaDVcIiwgXCJoNlwiLCBcImhlYWRlclwiLCBcImhncm91cFwiLCBcImhyXCIsIFwibGlcIiwgXCJtYWluXCIsIFwibmF2XCIsXG5cdFwibm9zY3JpcHRcIiwgXCJvbFwiLCBcIm91dHB1dFwiLCBcInBcIiwgXCJwcmVcIiwgXCJzZWN0aW9uXCIsIFwidGFibGVcIiwgXCJ0Zm9vdFwiLCBcInVsXCIsIFwidmlkZW9cIiBdO1xudmFyIGlubGluZUVsZW1lbnRzID0gWyBcImJcIiwgXCJiaWdcIiwgXCJpXCIsIFwic21hbGxcIiwgXCJ0dFwiLCBcImFiYnJcIiwgXCJhY3JvbnltXCIsIFwiY2l0ZVwiLCBcImNvZGVcIiwgXCJkZm5cIiwgXCJlbVwiLCBcImtiZFwiLCBcInN0cm9uZ1wiLFxuXHRcInNhbXBcIiwgXCJ0aW1lXCIsIFwidmFyXCIsIFwiYVwiLCBcImJkb1wiLCBcImJyXCIsIFwiaW1nXCIsIFwibWFwXCIsIFwib2JqZWN0XCIsIFwicVwiLCBcInNjcmlwdFwiLCBcInNwYW5cIiwgXCJzdWJcIiwgXCJzdXBcIiwgXCJidXR0b25cIixcblx0XCJpbnB1dFwiLCBcImxhYmVsXCIsIFwic2VsZWN0XCIsIFwidGV4dGFyZWFcIiBdO1xuXG52YXIgYmxvY2tFbGVtZW50c1JlZ2V4ID0gbmV3IFJlZ0V4cCggXCJeKFwiICsgYmxvY2tFbGVtZW50cy5qb2luKCBcInxcIiApICsgXCIpJFwiLCBcImlcIiApO1xudmFyIGlubGluZUVsZW1lbnRzUmVnZXggPSBuZXcgUmVnRXhwKCBcIl4oXCIgKyBpbmxpbmVFbGVtZW50cy5qb2luKCBcInxcIiApICsgXCIpJFwiLCBcImlcIiApO1xuXG52YXIgYmxvY2tFbGVtZW50U3RhcnRSZWdleCA9IG5ldyBSZWdFeHAoIFwiXjwoXCIgKyBibG9ja0VsZW1lbnRzLmpvaW4oIFwifFwiICkgKyBcIilbXj5dKj8+JFwiLCBcImlcIiApO1xudmFyIGJsb2NrRWxlbWVudEVuZFJlZ2V4ID0gbmV3IFJlZ0V4cCggXCJePC8oXCIgKyBibG9ja0VsZW1lbnRzLmpvaW4oIFwifFwiICkgKyBcIilbXj5dKj8+JFwiLCBcImlcIiApO1xuXG52YXIgaW5saW5lRWxlbWVudFN0YXJ0UmVnZXggPSBuZXcgUmVnRXhwKCBcIl48KFwiICsgaW5saW5lRWxlbWVudHMuam9pbiggXCJ8XCIgKSArIFwiKVtePl0qPiRcIiwgXCJpXCIgKTtcbnZhciBpbmxpbmVFbGVtZW50RW5kUmVnZXggPSBuZXcgUmVnRXhwKCBcIl48LyhcIiArIGlubGluZUVsZW1lbnRzLmpvaW4oIFwifFwiICkgKyBcIilbXj5dKj4kXCIsIFwiaVwiICk7XG5cbnZhciBvdGhlckVsZW1lbnRTdGFydFJlZ2V4ID0gL148KFtePlxcc1xcL10rKVtePl0qPiQvO1xudmFyIG90aGVyRWxlbWVudEVuZFJlZ2V4ID0gL148XFwvKFtePlxcc10rKVtePl0qPiQvO1xuXG52YXIgY29udGVudFJlZ2V4ID0gL15bXjxdKyQvO1xudmFyIGdyZWF0ZXJUaGFuQ29udGVudFJlZ2V4ID0gL148W14+PF0qJC87XG5cbnZhciBjb21tZW50UmVnZXggPSAvPCEtLSgufFtcXHJcXG5dKSo/LS0+L2c7XG5cbnZhciBjb3JlID0gcmVxdWlyZSggXCJ0b2tlbml6ZXIyL2NvcmVcIiApO1xudmFyIGZvckVhY2ggPSByZXF1aXJlKCBcImxvZGFzaC9mb3JFYWNoXCIgKTtcbnZhciBtZW1vaXplID0gcmVxdWlyZSggXCJsb2Rhc2gvbWVtb2l6ZVwiICk7XG5cbnZhciB0b2tlbnMgPSBbXTtcbnZhciBodG1sQmxvY2tUb2tlbml6ZXI7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHRva2VuaXplciB0byB0b2tlbml6ZSBIVE1MIGludG8gYmxvY2tzLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5mdW5jdGlvbiBjcmVhdGVUb2tlbml6ZXIoKSB7XG5cdHRva2VucyA9IFtdO1xuXG5cdGh0bWxCbG9ja1Rva2VuaXplciA9IGNvcmUoIGZ1bmN0aW9uKCB0b2tlbiApIHtcblx0XHR0b2tlbnMucHVzaCggdG9rZW4gKTtcblx0fSApO1xuXG5cdGh0bWxCbG9ja1Rva2VuaXplci5hZGRSdWxlKCBjb250ZW50UmVnZXgsIFwiY29udGVudFwiICk7XG5cdGh0bWxCbG9ja1Rva2VuaXplci5hZGRSdWxlKCBncmVhdGVyVGhhbkNvbnRlbnRSZWdleCwgXCJncmVhdGVyLXRoYW4tc2lnbi1jb250ZW50XCIgKTtcblxuXHRodG1sQmxvY2tUb2tlbml6ZXIuYWRkUnVsZSggYmxvY2tFbGVtZW50U3RhcnRSZWdleCwgXCJibG9jay1zdGFydFwiICk7XG5cdGh0bWxCbG9ja1Rva2VuaXplci5hZGRSdWxlKCBibG9ja0VsZW1lbnRFbmRSZWdleCwgXCJibG9jay1lbmRcIiApO1xuXHRodG1sQmxvY2tUb2tlbml6ZXIuYWRkUnVsZSggaW5saW5lRWxlbWVudFN0YXJ0UmVnZXgsIFwiaW5saW5lLXN0YXJ0XCIgKTtcblx0aHRtbEJsb2NrVG9rZW5pemVyLmFkZFJ1bGUoIGlubGluZUVsZW1lbnRFbmRSZWdleCwgXCJpbmxpbmUtZW5kXCIgKTtcblxuXHRodG1sQmxvY2tUb2tlbml6ZXIuYWRkUnVsZSggb3RoZXJFbGVtZW50U3RhcnRSZWdleCwgXCJvdGhlci1lbGVtZW50LXN0YXJ0XCIgKTtcblx0aHRtbEJsb2NrVG9rZW5pemVyLmFkZFJ1bGUoIG90aGVyRWxlbWVudEVuZFJlZ2V4LCBcIm90aGVyLWVsZW1lbnQtZW5kXCIgKTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBnaXZlbiBlbGVtZW50IG5hbWUgaXMgYSBibG9jayBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBodG1sRWxlbWVudE5hbWUgVGhlIG5hbWUgb2YgdGhlIEhUTUwgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCBpdCBpcyBhIGJsb2NrIGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIGlzQmxvY2tFbGVtZW50KCBodG1sRWxlbWVudE5hbWUgKSB7XG5cdHJldHVybiBibG9ja0VsZW1lbnRzUmVnZXgudGVzdCggaHRtbEVsZW1lbnROYW1lICk7XG59XG5cbi8qKlxuICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gZWxlbWVudCBuYW1lIGlzIGFuIGlubGluZSBlbGVtZW50LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBodG1sRWxlbWVudE5hbWUgVGhlIG5hbWUgb2YgdGhlIEhUTUwgZWxlbWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIG9yIG5vdCBpdCBpcyBhbiBpbmxpbmUgZWxlbWVudC5cbiAqL1xuZnVuY3Rpb24gaXNJbmxpbmVFbGVtZW50KCBodG1sRWxlbWVudE5hbWUgKSB7XG5cdHJldHVybiBpbmxpbmVFbGVtZW50c1JlZ2V4LnRlc3QoIGh0bWxFbGVtZW50TmFtZSApO1xufVxuXG4vKipcbiAqIFNwbGl0cyBhIHRleHQgaW50byBibG9ja3MgYmFzZWQgb24gSFRNTCBibG9jayBlbGVtZW50cy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byBzcGxpdC5cbiAqIEByZXR1cm5zIHtBcnJheX0gQSBsaXN0IG9mIGJsb2NrcyBiYXNlZCBvbiBIVE1MIGJsb2NrIGVsZW1lbnRzLlxuICovXG5mdW5jdGlvbiBnZXRCbG9ja3MoIHRleHQgKSB7XG5cdHZhciBibG9ja3MgPSBbXSwgZGVwdGggPSAwLFxuXHRcdGJsb2NrU3RhcnRUYWcgPSBcIlwiLFxuXHRcdGN1cnJlbnRCbG9jayA9IFwiXCIsXG5cdFx0YmxvY2tFbmRUYWcgPSBcIlwiO1xuXG5cdC8vIFJlbW92ZSBhbGwgY29tbWVudHMgYmVjYXVzZSBpdCBpcyB2ZXJ5IGhhcmQgdG8gdG9rZW5pemUgdGhlbS5cblx0dGV4dCA9IHRleHQucmVwbGFjZSggY29tbWVudFJlZ2V4LCBcIlwiICk7XG5cblx0Y3JlYXRlVG9rZW5pemVyKCk7XG5cdGh0bWxCbG9ja1Rva2VuaXplci5vblRleHQoIHRleHQgKTtcblxuXHRodG1sQmxvY2tUb2tlbml6ZXIuZW5kKCk7XG5cblx0Zm9yRWFjaCggdG9rZW5zLCBmdW5jdGlvbiggdG9rZW4sIGkgKSB7XG5cdFx0dmFyIG5leHRUb2tlbiA9IHRva2Vuc1sgaSArIDEgXTtcblxuXHRcdHN3aXRjaCAoIHRva2VuLnR5cGUgKSB7XG5cblx0XHRcdGNhc2UgXCJjb250ZW50XCI6XG5cdFx0XHRjYXNlIFwiZ3JlYXRlci10aGFuLXNpZ24tY29udGVudFwiOlxuXHRcdFx0Y2FzZSBcImlubGluZS1zdGFydFwiOlxuXHRcdFx0Y2FzZSBcImlubGluZS1lbmRcIjpcblx0XHRcdGNhc2UgXCJvdGhlci10YWdcIjpcblx0XHRcdGNhc2UgXCJvdGhlci1lbGVtZW50LXN0YXJ0XCI6XG5cdFx0XHRjYXNlIFwib3RoZXItZWxlbWVudC1lbmRcIjpcblx0XHRcdGNhc2UgXCJncmVhdGVyIHRoYW4gc2lnblwiOlxuXHRcdFx0XHRpZiAoICEgbmV4dFRva2VuIHx8ICggZGVwdGggPT09IDAgJiYgKCBuZXh0VG9rZW4udHlwZSA9PT0gXCJibG9jay1zdGFydFwiIHx8IG5leHRUb2tlbi50eXBlID09PSBcImJsb2NrLWVuZFwiICkgKSApIHtcblx0XHRcdFx0XHRjdXJyZW50QmxvY2sgKz0gdG9rZW4uc3JjO1xuXG5cdFx0XHRcdFx0YmxvY2tzLnB1c2goIGN1cnJlbnRCbG9jayApO1xuXHRcdFx0XHRcdGJsb2NrU3RhcnRUYWcgPSBcIlwiO1xuXHRcdFx0XHRcdGN1cnJlbnRCbG9jayA9IFwiXCI7XG5cdFx0XHRcdFx0YmxvY2tFbmRUYWcgPSBcIlwiO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGN1cnJlbnRCbG9jayArPSB0b2tlbi5zcmM7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cblx0XHRcdGNhc2UgXCJibG9jay1zdGFydFwiOlxuXHRcdFx0XHRpZiAoIGRlcHRoICE9PSAwICkge1xuXHRcdFx0XHRcdGlmICggY3VycmVudEJsb2NrLnRyaW0oKSAhPT0gXCJcIiApIHtcblx0XHRcdFx0XHRcdGJsb2Nrcy5wdXNoKCBjdXJyZW50QmxvY2sgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Y3VycmVudEJsb2NrID0gXCJcIjtcblx0XHRcdFx0XHRibG9ja0VuZFRhZyA9IFwiXCI7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRkZXB0aCsrO1xuXHRcdFx0XHRibG9ja1N0YXJ0VGFnID0gdG9rZW4uc3JjO1xuXHRcdFx0XHRicmVhaztcblxuXHRcdFx0Y2FzZSBcImJsb2NrLWVuZFwiOlxuXHRcdFx0XHRkZXB0aC0tO1xuXHRcdFx0XHRibG9ja0VuZFRhZyA9IHRva2VuLnNyYztcblxuXHRcdFx0XHQvKlxuXHRcdFx0XHQgKiBXZSB0cnkgdG8gbWF0Y2ggdGhlIG1vc3QgZGVlcCBibG9ja3Mgc28gZGlzY2FyZCBhbnkgb3RoZXIgYmxvY2tzIHRoYXQgaGF2ZSBiZWVuIHN0YXJ0ZWQgYnV0IG5vdFxuXHRcdFx0XHQgKiBmaW5pc2hlZC5cblx0XHRcdFx0ICovXG5cdFx0XHRcdGlmICggXCJcIiAhPT0gYmxvY2tTdGFydFRhZyAmJiBcIlwiICE9PSBibG9ja0VuZFRhZyApIHtcblx0XHRcdFx0XHRibG9ja3MucHVzaCggYmxvY2tTdGFydFRhZyArIGN1cnJlbnRCbG9jayArIGJsb2NrRW5kVGFnICk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoIFwiXCIgIT09IGN1cnJlbnRCbG9jay50cmltKCkgKSB7XG5cdFx0XHRcdFx0YmxvY2tzLnB1c2goIGN1cnJlbnRCbG9jayApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGJsb2NrU3RhcnRUYWcgPSBcIlwiO1xuXHRcdFx0XHRjdXJyZW50QmxvY2sgPSBcIlwiO1xuXHRcdFx0XHRibG9ja0VuZFRhZyA9IFwiXCI7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdC8vIEhhbmRsZXMgSFRNTCB3aXRoIHRvbyBtYW55IGNsb3NpbmcgdGFncy5cblx0XHRpZiAoIGRlcHRoIDwgMCApIHtcblx0XHRcdGRlcHRoID0gMDtcblx0XHR9XG5cdH0gKTtcblxuXHRyZXR1cm4gYmxvY2tzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0YmxvY2tFbGVtZW50czogYmxvY2tFbGVtZW50cyxcblx0aW5saW5lRWxlbWVudHM6IGlubGluZUVsZW1lbnRzLFxuXHRpc0Jsb2NrRWxlbWVudDogaXNCbG9ja0VsZW1lbnQsXG5cdGlzSW5saW5lRWxlbWVudDogaXNJbmxpbmVFbGVtZW50LFxuXHRnZXRCbG9ja3M6IG1lbW9pemUoIGdldEJsb2NrcyApLFxufTtcbiIsIi8qKiBAbW9kdWxlIHN0cmluZ1Byb2Nlc3NpbmcvaW1hZ2VJblRleHQgKi9cblxudmFyIG1hdGNoU3RyaW5nV2l0aFJlZ2V4ID0gcmVxdWlyZSggXCIuL21hdGNoU3RyaW5nV2l0aFJlZ2V4LmpzXCIgKTtcblxuLyoqXG4gKiBDaGVja3MgdGhlIHRleHQgZm9yIGltYWdlcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdGV4dHN0cmluZyB0byBjaGVjayBmb3IgaW1hZ2VzXG4gKiBAcmV0dXJucyB7QXJyYXl9IEFycmF5IGNvbnRhaW5pbmcgYWxsIHR5cGVzIG9mIGZvdW5kIGltYWdlc1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHRyZXR1cm4gbWF0Y2hTdHJpbmdXaXRoUmVnZXgoIHRleHQsIFwiPGltZyg/OltePl0rKT8+XCIgKTtcbn07XG4iLCIvKiogQG1vZHVsZSBzdHJpbmdQcm9jZXNzaW5nL21hdGNoU3RyaW5nV2l0aFJlZ2V4ICovXG5cbi8qKlxuICogQ2hlY2tzIGEgc3RyaW5nIHdpdGggYSByZWdleCwgcmV0dXJuIGFsbCBtYXRjaGVzIGZvdW5kIHdpdGggdGhhdCByZWdleC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byBtYXRjaCB0aGVcbiAqIEBwYXJhbSB7U3RyaW5nfSByZWdleFN0cmluZyBBIHN0cmluZyB0byB1c2UgYXMgcmVnZXguXG4gKiBAcmV0dXJucyB7QXJyYXl9IEFycmF5IHdpdGggbWF0Y2hlcywgZW1wdHkgYXJyYXkgaWYgbm8gbWF0Y2hlcyBmb3VuZC5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdGV4dCwgcmVnZXhTdHJpbmcgKSB7XG5cdHZhciByZWdleCA9IG5ldyBSZWdFeHAoIHJlZ2V4U3RyaW5nLCBcImlnXCIgKTtcblx0dmFyIG1hdGNoZXMgPSB0ZXh0Lm1hdGNoKCByZWdleCApO1xuXG5cdGlmICggbWF0Y2hlcyA9PT0gbnVsbCApIHtcblx0XHRtYXRjaGVzID0gW107XG5cdH1cblxuXHRyZXR1cm4gbWF0Y2hlcztcbn07XG4iLCIvKiogQG1vZHVsZSBzdHJpbmdQcm9jZXNzaW5nL3N0cmlwSFRNTFRhZ3MgKi9cblxudmFyIHN0cmlwU3BhY2VzID0gcmVxdWlyZSggXCIuLi9zdHJpbmdQcm9jZXNzaW5nL3N0cmlwU3BhY2VzLmpzXCIgKTtcblxudmFyIGJsb2NrRWxlbWVudHMgPSByZXF1aXJlKCBcIi4uL2hlbHBlcnMvaHRtbC5qc1wiICkuYmxvY2tFbGVtZW50cztcblxudmFyIGJsb2NrRWxlbWVudFN0YXJ0UmVnZXggPSBuZXcgUmVnRXhwKCBcIl48KFwiICsgYmxvY2tFbGVtZW50cy5qb2luKCBcInxcIiApICsgXCIpW14+XSo/PlwiLCBcImlcIiApO1xudmFyIGJsb2NrRWxlbWVudEVuZFJlZ2V4ID0gbmV3IFJlZ0V4cCggXCI8LyhcIiArIGJsb2NrRWxlbWVudHMuam9pbiggXCJ8XCIgKSArIFwiKVtePl0qPz4kXCIsIFwiaVwiICk7XG5cbi8qKlxuICogU3RyaXAgaW5jb21wbGV0ZSB0YWdzIHdpdGhpbiBhIHRleHQuIFN0cmlwcyBhbiBlbmR0YWcgYXQgdGhlIGJlZ2lubmluZyBvZiBhIHN0cmluZyBhbmQgdGhlIHN0YXJ0IHRhZyBhdCB0aGUgZW5kIG9mIGFcbiAqIHN0YXJ0IG9mIGEgc3RyaW5nLlxuICogQHBhcmFtIHtTdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gc3RyaXAgdGhlIEhUTUwtdGFncyBmcm9tIGF0IHRoZSBiZWdpbiBhbmQgZW5kLlxuICogQHJldHVybnMge1N0cmluZ30gVGhlIHRleHQgd2l0aG91dCBIVE1MLXRhZ3MgYXQgdGhlIGJlZ2luIGFuZCBlbmQuXG4gKi9cbnZhciBzdHJpcEluY29tcGxldGVUYWdzID0gZnVuY3Rpb24oIHRleHQgKSB7XG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoIC9eKDxcXC8oW14+XSspPikrL2ksIFwiXCIgKTtcblx0dGV4dCA9IHRleHQucmVwbGFjZSggLyg8KFteXFwvPl0rKT4pKyQvaSwgXCJcIiApO1xuXHRyZXR1cm4gdGV4dDtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgYmxvY2sgZWxlbWVudCB0YWdzIGF0IHRoZSBiZWdpbm5pbmcgYW5kIGVuZCBvZiBhIHN0cmluZyBhbmQgcmV0dXJucyB0aGlzIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdW5mb3JtYXR0ZWQgc3RyaW5nLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIHRleHQgd2l0aCByZW1vdmVkIEhUTUwgYmVnaW4gYW5kIGVuZCBibG9jayBlbGVtZW50c1xuICovXG52YXIgc3RyaXBCbG9ja1RhZ3NBdFN0YXJ0RW5kID0gZnVuY3Rpb24oIHRleHQgKSB7XG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoIGJsb2NrRWxlbWVudFN0YXJ0UmVnZXgsIFwiXCIgKTtcblx0dGV4dCA9IHRleHQucmVwbGFjZSggYmxvY2tFbGVtZW50RW5kUmVnZXgsIFwiXCIgKTtcblx0cmV0dXJuIHRleHQ7XG59O1xuXG4vKipcbiAqIFN0cmlwIEhUTUwtdGFncyBmcm9tIHRleHRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byBzdHJpcCB0aGUgSFRNTC10YWdzIGZyb20uXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgdGV4dCB3aXRob3V0IEhUTUwtdGFncy5cbiAqL1xudmFyIHN0cmlwRnVsbFRhZ3MgPSBmdW5jdGlvbiggdGV4dCApIHtcblx0dGV4dCA9IHRleHQucmVwbGFjZSggLyg8KFtePl0rKT4pL2lnLCBcIiBcIiApO1xuXHR0ZXh0ID0gc3RyaXBTcGFjZXMoIHRleHQgKTtcblx0cmV0dXJuIHRleHQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0c3RyaXBGdWxsVGFnczogc3RyaXBGdWxsVGFncyxcblx0c3RyaXBJbmNvbXBsZXRlVGFnczogc3RyaXBJbmNvbXBsZXRlVGFncyxcblx0c3RyaXBCbG9ja1RhZ3NBdFN0YXJ0RW5kOiBzdHJpcEJsb2NrVGFnc0F0U3RhcnRFbmQsXG59O1xuIiwiLyoqIEBtb2R1bGUgc3RyaW5nUHJvY2Vzc2luZy9zdHJpcFNwYWNlcyAqL1xuXG4vKipcbiAqIFN0cmlwIGRvdWJsZSBzcGFjZXMgZnJvbSB0ZXh0XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gc3RyaXAgc3BhY2VzIGZyb20uXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgdGV4dCB3aXRob3V0IGRvdWJsZSBzcGFjZXNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiggdGV4dCApIHtcblx0Ly8gUmVwbGFjZSBtdWx0aXBsZSBzcGFjZXMgd2l0aCBzaW5nbGUgc3BhY2Vcblx0dGV4dCA9IHRleHQucmVwbGFjZSggL1xcc3syLH0vZywgXCIgXCIgKTtcblxuXHQvLyBSZXBsYWNlIHNwYWNlcyBmb2xsb3dlZCBieSBwZXJpb2RzIHdpdGggb25seSB0aGUgcGVyaW9kLlxuXHR0ZXh0ID0gdGV4dC5yZXBsYWNlKCAvXFxzXFwuL2csIFwiLlwiICk7XG5cblx0Ly8gUmVtb3ZlIGZpcnN0L2xhc3QgY2hhcmFjdGVyIGlmIHNwYWNlXG5cdHRleHQgPSB0ZXh0LnJlcGxhY2UoIC9eXFxzK3xcXHMrJC9nLCBcIlwiICk7XG5cblx0cmV0dXJuIHRleHQ7XG59O1xuIiwidmFyIGhhc2hDbGVhciA9IHJlcXVpcmUoJy4vX2hhc2hDbGVhcicpLFxuICAgIGhhc2hEZWxldGUgPSByZXF1aXJlKCcuL19oYXNoRGVsZXRlJyksXG4gICAgaGFzaEdldCA9IHJlcXVpcmUoJy4vX2hhc2hHZXQnKSxcbiAgICBoYXNoSGFzID0gcmVxdWlyZSgnLi9faGFzaEhhcycpLFxuICAgIGhhc2hTZXQgPSByZXF1aXJlKCcuL19oYXNoU2V0Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhhc2ggb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBIYXNoKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYEhhc2hgLlxuSGFzaC5wcm90b3R5cGUuY2xlYXIgPSBoYXNoQ2xlYXI7XG5IYXNoLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBoYXNoRGVsZXRlO1xuSGFzaC5wcm90b3R5cGUuZ2V0ID0gaGFzaEdldDtcbkhhc2gucHJvdG90eXBlLmhhcyA9IGhhc2hIYXM7XG5IYXNoLnByb3RvdHlwZS5zZXQgPSBoYXNoU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhhc2g7XG4iLCJ2YXIgbGlzdENhY2hlQ2xlYXIgPSByZXF1aXJlKCcuL19saXN0Q2FjaGVDbGVhcicpLFxuICAgIGxpc3RDYWNoZURlbGV0ZSA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZURlbGV0ZScpLFxuICAgIGxpc3RDYWNoZUdldCA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZUdldCcpLFxuICAgIGxpc3RDYWNoZUhhcyA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZUhhcycpLFxuICAgIGxpc3RDYWNoZVNldCA9IHJlcXVpcmUoJy4vX2xpc3RDYWNoZVNldCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gbGlzdCBjYWNoZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIExpc3RDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA9PSBudWxsID8gMCA6IGVudHJpZXMubGVuZ3RoO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBMaXN0Q2FjaGVgLlxuTGlzdENhY2hlLnByb3RvdHlwZS5jbGVhciA9IGxpc3RDYWNoZUNsZWFyO1xuTGlzdENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBsaXN0Q2FjaGVEZWxldGU7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmdldCA9IGxpc3RDYWNoZUdldDtcbkxpc3RDYWNoZS5wcm90b3R5cGUuaGFzID0gbGlzdENhY2hlSGFzO1xuTGlzdENhY2hlLnByb3RvdHlwZS5zZXQgPSBsaXN0Q2FjaGVTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gTGlzdENhY2hlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBNYXAgPSBnZXROYXRpdmUocm9vdCwgJ01hcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcDtcbiIsInZhciBtYXBDYWNoZUNsZWFyID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVDbGVhcicpLFxuICAgIG1hcENhY2hlRGVsZXRlID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVEZWxldGUnKSxcbiAgICBtYXBDYWNoZUdldCA9IHJlcXVpcmUoJy4vX21hcENhY2hlR2V0JyksXG4gICAgbWFwQ2FjaGVIYXMgPSByZXF1aXJlKCcuL19tYXBDYWNoZUhhcycpLFxuICAgIG1hcENhY2hlU2V0ID0gcmVxdWlyZSgnLi9fbWFwQ2FjaGVTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbWFwIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIE1hcENhY2hlKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID09IG51bGwgPyAwIDogZW50cmllcy5sZW5ndGg7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYE1hcENhY2hlYC5cbk1hcENhY2hlLnByb3RvdHlwZS5jbGVhciA9IG1hcENhY2hlQ2xlYXI7XG5NYXBDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbWFwQ2FjaGVEZWxldGU7XG5NYXBDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbWFwQ2FjaGVHZXQ7XG5NYXBDYWNoZS5wcm90b3R5cGUuaGFzID0gbWFwQ2FjaGVIYXM7XG5NYXBDYWNoZS5wcm90b3R5cGUuc2V0ID0gbWFwQ2FjaGVTZXQ7XG5cbm1vZHVsZS5leHBvcnRzID0gTWFwQ2FjaGU7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgU3ltYm9sID0gcm9vdC5TeW1ib2w7XG5cbm1vZHVsZS5leHBvcnRzID0gU3ltYm9sO1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uZm9yRWFjaGAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yXG4gKiBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5RWFjaChhcnJheSwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkgPT09IGZhbHNlKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5RWFjaDtcbiIsInZhciBiYXNlVGltZXMgPSByZXF1aXJlKCcuL19iYXNlVGltZXMnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL2lzVHlwZWRBcnJheScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgdGhlIGFycmF5LWxpa2UgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluaGVyaXRlZCBTcGVjaWZ5IHJldHVybmluZyBpbmhlcml0ZWQgcHJvcGVydHkgbmFtZXMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBhcnJheUxpa2VLZXlzKHZhbHVlLCBpbmhlcml0ZWQpIHtcbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSksXG4gICAgICBpc0FyZyA9ICFpc0FyciAmJiBpc0FyZ3VtZW50cyh2YWx1ZSksXG4gICAgICBpc0J1ZmYgPSAhaXNBcnIgJiYgIWlzQXJnICYmIGlzQnVmZmVyKHZhbHVlKSxcbiAgICAgIGlzVHlwZSA9ICFpc0FyciAmJiAhaXNBcmcgJiYgIWlzQnVmZiAmJiBpc1R5cGVkQXJyYXkodmFsdWUpLFxuICAgICAgc2tpcEluZGV4ZXMgPSBpc0FyciB8fCBpc0FyZyB8fCBpc0J1ZmYgfHwgaXNUeXBlLFxuICAgICAgcmVzdWx0ID0gc2tpcEluZGV4ZXMgPyBiYXNlVGltZXModmFsdWUubGVuZ3RoLCBTdHJpbmcpIDogW10sXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmICgoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpICYmXG4gICAgICAgICEoc2tpcEluZGV4ZXMgJiYgKFxuICAgICAgICAgICAvLyBTYWZhcmkgOSBoYXMgZW51bWVyYWJsZSBgYXJndW1lbnRzLmxlbmd0aGAgaW4gc3RyaWN0IG1vZGUuXG4gICAgICAgICAgIGtleSA9PSAnbGVuZ3RoJyB8fFxuICAgICAgICAgICAvLyBOb2RlLmpzIDAuMTAgaGFzIGVudW1lcmFibGUgbm9uLWluZGV4IHByb3BlcnRpZXMgb24gYnVmZmVycy5cbiAgICAgICAgICAgKGlzQnVmZiAmJiAoa2V5ID09ICdvZmZzZXQnIHx8IGtleSA9PSAncGFyZW50JykpIHx8XG4gICAgICAgICAgIC8vIFBoYW50b21KUyAyIGhhcyBlbnVtZXJhYmxlIG5vbi1pbmRleCBwcm9wZXJ0aWVzIG9uIHR5cGVkIGFycmF5cy5cbiAgICAgICAgICAgKGlzVHlwZSAmJiAoa2V5ID09ICdidWZmZXInIHx8IGtleSA9PSAnYnl0ZUxlbmd0aCcgfHwga2V5ID09ICdieXRlT2Zmc2V0JykpIHx8XG4gICAgICAgICAgIC8vIFNraXAgaW5kZXggcHJvcGVydGllcy5cbiAgICAgICAgICAgaXNJbmRleChrZXksIGxlbmd0aClcbiAgICAgICAgKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlMaWtlS2V5cztcbiIsInZhciBlcSA9IHJlcXVpcmUoJy4vZXEnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBpbmRleCBhdCB3aGljaCB0aGUgYGtleWAgaXMgZm91bmQgaW4gYGFycmF5YCBvZiBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHsqfSBrZXkgVGhlIGtleSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIG1hdGNoZWQgdmFsdWUsIGVsc2UgYC0xYC5cbiAqL1xuZnVuY3Rpb24gYXNzb2NJbmRleE9mKGFycmF5LCBrZXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgaWYgKGVxKGFycmF5W2xlbmd0aF1bMF0sIGtleSkpIHtcbiAgICAgIHJldHVybiBsZW5ndGg7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NvY0luZGV4T2Y7XG4iLCJ2YXIgYmFzZUZvck93biA9IHJlcXVpcmUoJy4vX2Jhc2VGb3JPd24nKSxcbiAgICBjcmVhdGVCYXNlRWFjaCA9IHJlcXVpcmUoJy4vX2NyZWF0ZUJhc2VFYWNoJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZm9yRWFjaGAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdH0gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKi9cbnZhciBiYXNlRWFjaCA9IGNyZWF0ZUJhc2VFYWNoKGJhc2VGb3JPd24pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VFYWNoO1xuIiwidmFyIGNyZWF0ZUJhc2VGb3IgPSByZXF1aXJlKCcuL19jcmVhdGVCYXNlRm9yJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGJhc2VGb3JPd25gIHdoaWNoIGl0ZXJhdGVzIG92ZXIgYG9iamVjdGBcbiAqIHByb3BlcnRpZXMgcmV0dXJuZWQgYnkgYGtleXNGdW5jYCBhbmQgaW52b2tlcyBgaXRlcmF0ZWVgIGZvciBlYWNoIHByb3BlcnR5LlxuICogSXRlcmF0ZWUgZnVuY3Rpb25zIG1heSBleGl0IGl0ZXJhdGlvbiBlYXJseSBieSBleHBsaWNpdGx5IHJldHVybmluZyBgZmFsc2VgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGtleXNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIGtleXMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG52YXIgYmFzZUZvciA9IGNyZWF0ZUJhc2VGb3IoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRm9yO1xuIiwidmFyIGJhc2VGb3IgPSByZXF1aXJlKCcuL19iYXNlRm9yJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZvck93bmAgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VGb3JPd24ob2JqZWN0LCBpdGVyYXRlZSkge1xuICByZXR1cm4gb2JqZWN0ICYmIGJhc2VGb3Iob2JqZWN0LCBpdGVyYXRlZSwga2V5cyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUZvck93bjtcbiIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKSxcbiAgICBnZXRSYXdUYWcgPSByZXF1aXJlKCcuL19nZXRSYXdUYWcnKSxcbiAgICBvYmplY3RUb1N0cmluZyA9IHJlcXVpcmUoJy4vX29iamVjdFRvU3RyaW5nJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgIHVuZGVmaW5lZFRhZyA9ICdbb2JqZWN0IFVuZGVmaW5lZF0nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZFRhZyA6IG51bGxUYWc7XG4gIH1cbiAgcmV0dXJuIChzeW1Ub1N0cmluZ1RhZyAmJiBzeW1Ub1N0cmluZ1RhZyBpbiBPYmplY3QodmFsdWUpKVxuICAgID8gZ2V0UmF3VGFnKHZhbHVlKVxuICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRUYWc7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzQXJndW1lbnRzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc0FyZ3VtZW50cyh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBhcmdzVGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VJc0FyZ3VtZW50cztcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNNYXNrZWQgPSByZXF1aXJlKCcuL19pc01hc2tlZCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIHRvU291cmNlID0gcmVxdWlyZSgnLi9fdG9Tb3VyY2UnKTtcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgXG4gKiBbc3ludGF4IGNoYXJhY3RlcnNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXBhdHRlcm5zKS5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGUsXG4gICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZnVuY1RvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTmF0aXZlYCB3aXRob3V0IGJhZCBzaGltIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIG5hdGl2ZSBmdW5jdGlvbixcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSB8fCBpc01hc2tlZCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHBhdHRlcm4gPSBpc0Z1bmN0aW9uKHZhbHVlKSA/IHJlSXNOYXRpdmUgOiByZUlzSG9zdEN0b3I7XG4gIHJldHVybiBwYXR0ZXJuLnRlc3QodG9Tb3VyY2UodmFsdWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSXNOYXRpdmU7XG4iLCJ2YXIgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBhcnJheUJ1ZmZlclRhZyA9ICdbb2JqZWN0IEFycmF5QnVmZmVyXScsXG4gICAgZGF0YVZpZXdUYWcgPSAnW29iamVjdCBEYXRhVmlld10nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBvZiB0eXBlZCBhcnJheXMuICovXG52YXIgdHlwZWRBcnJheVRhZ3MgPSB7fTtcbnR5cGVkQXJyYXlUYWdzW2Zsb2F0MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbZmxvYXQ2NFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50OFRhZ10gPSB0eXBlZEFycmF5VGFnc1tpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDhUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xudHlwZWRBcnJheVRhZ3NbYXJnc1RhZ10gPSB0eXBlZEFycmF5VGFnc1thcnJheVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gdHlwZWRBcnJheVRhZ3NbYm9vbFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZGF0YVZpZXdUYWddID0gdHlwZWRBcnJheVRhZ3NbZGF0ZVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZXJyb3JUYWddID0gdHlwZWRBcnJheVRhZ3NbZnVuY1RhZ10gPVxudHlwZWRBcnJheVRhZ3NbbWFwVGFnXSA9IHR5cGVkQXJyYXlUYWdzW251bWJlclRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbb2JqZWN0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3JlZ2V4cFRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbc2V0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3N0cmluZ1RhZ10gPVxudHlwZWRBcnJheVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc1R5cGVkQXJyYXlgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJlxuICAgIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgISF0eXBlZEFycmF5VGFnc1tiYXNlR2V0VGFnKHZhbHVlKV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUlzVHlwZWRBcnJheTtcbiIsInZhciBpc1Byb3RvdHlwZSA9IHJlcXVpcmUoJy4vX2lzUHJvdG90eXBlJyksXG4gICAgbmF0aXZlS2V5cyA9IHJlcXVpcmUoJy4vX25hdGl2ZUtleXMnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzKG9iamVjdCkge1xuICBpZiAoIWlzUHJvdG90eXBlKG9iamVjdCkpIHtcbiAgICByZXR1cm4gbmF0aXZlS2V5cyhvYmplY3QpO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIE9iamVjdChvYmplY3QpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGtleSAhPSAnY29uc3RydWN0b3InKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VLZXlzO1xuIiwiLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50aW1lc2Agd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzXG4gKiBvciBtYXggYXJyYXkgbGVuZ3RoIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiB0aW1lcyB0byBpbnZva2UgYGl0ZXJhdGVlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHJlc3VsdHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUaW1lcyhuLCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG4pO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbikge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShpbmRleCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVGltZXM7XG4iLCIvKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnVuYXJ5YCB3aXRob3V0IHN1cHBvcnQgZm9yIHN0b3JpbmcgbWV0YWRhdGEuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNhcCBhcmd1bWVudHMgZm9yLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgY2FwcGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlVW5hcnkoZnVuYykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gZnVuYyh2YWx1ZSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVVuYXJ5O1xuIiwidmFyIGlkZW50aXR5ID0gcmVxdWlyZSgnLi9pZGVudGl0eScpO1xuXG4vKipcbiAqIENhc3RzIGB2YWx1ZWAgdG8gYGlkZW50aXR5YCBpZiBpdCdzIG5vdCBhIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIGNhc3QgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNhc3RGdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbicgPyB2YWx1ZSA6IGlkZW50aXR5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNhc3RGdW5jdGlvbjtcbiIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb3ZlcnJlYWNoaW5nIGNvcmUtanMgc2hpbXMuICovXG52YXIgY29yZUpzRGF0YSA9IHJvb3RbJ19fY29yZS1qc19zaGFyZWRfXyddO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcmVKc0RhdGE7XG4iLCJ2YXIgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGBiYXNlRWFjaGAgb3IgYGJhc2VFYWNoUmlnaHRgIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBlYWNoRnVuYyBUaGUgZnVuY3Rpb24gdG8gaXRlcmF0ZSBvdmVyIGEgY29sbGVjdGlvbi5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmFzZUVhY2goZWFjaEZ1bmMsIGZyb21SaWdodCkge1xuICByZXR1cm4gZnVuY3Rpb24oY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgICBpZiAoY29sbGVjdGlvbiA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICB9XG4gICAgaWYgKCFpc0FycmF5TGlrZShjb2xsZWN0aW9uKSkge1xuICAgICAgcmV0dXJuIGVhY2hGdW5jKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKTtcbiAgICB9XG4gICAgdmFyIGxlbmd0aCA9IGNvbGxlY3Rpb24ubGVuZ3RoLFxuICAgICAgICBpbmRleCA9IGZyb21SaWdodCA/IGxlbmd0aCA6IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChjb2xsZWN0aW9uKTtcblxuICAgIHdoaWxlICgoZnJvbVJpZ2h0ID8gaW5kZXgtLSA6ICsraW5kZXggPCBsZW5ndGgpKSB7XG4gICAgICBpZiAoaXRlcmF0ZWUoaXRlcmFibGVbaW5kZXhdLCBpbmRleCwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmFzZUVhY2g7XG4iLCIvKipcbiAqIENyZWF0ZXMgYSBiYXNlIGZ1bmN0aW9uIGZvciBtZXRob2RzIGxpa2UgYF8uZm9ySW5gIGFuZCBgXy5mb3JPd25gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJhc2UgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VGb3IoZnJvbVJpZ2h0KSB7XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QsIGl0ZXJhdGVlLCBrZXlzRnVuYykge1xuICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICBpdGVyYWJsZSA9IE9iamVjdChvYmplY3QpLFxuICAgICAgICBwcm9wcyA9IGtleXNGdW5jKG9iamVjdCksXG4gICAgICAgIGxlbmd0aCA9IHByb3BzLmxlbmd0aDtcblxuICAgIHdoaWxlIChsZW5ndGgtLSkge1xuICAgICAgdmFyIGtleSA9IHByb3BzW2Zyb21SaWdodCA/IGxlbmd0aCA6ICsraW5kZXhdO1xuICAgICAgaWYgKGl0ZXJhdGVlKGl0ZXJhYmxlW2tleV0sIGtleSwgaXRlcmFibGUpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVCYXNlRm9yO1xuIiwiLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxubW9kdWxlLmV4cG9ydHMgPSBmcmVlR2xvYmFsO1xuIiwidmFyIGlzS2V5YWJsZSA9IHJlcXVpcmUoJy4vX2lzS2V5YWJsZScpO1xuXG4vKipcbiAqIEdldHMgdGhlIGRhdGEgZm9yIGBtYXBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSByZWZlcmVuY2Uga2V5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIG1hcCBkYXRhLlxuICovXG5mdW5jdGlvbiBnZXRNYXBEYXRhKG1hcCwga2V5KSB7XG4gIHZhciBkYXRhID0gbWFwLl9fZGF0YV9fO1xuICByZXR1cm4gaXNLZXlhYmxlKGtleSlcbiAgICA/IGRhdGFbdHlwZW9mIGtleSA9PSAnc3RyaW5nJyA/ICdzdHJpbmcnIDogJ2hhc2gnXVxuICAgIDogZGF0YS5tYXA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TWFwRGF0YTtcbiIsInZhciBiYXNlSXNOYXRpdmUgPSByZXF1aXJlKCcuL19iYXNlSXNOYXRpdmUnKSxcbiAgICBnZXRWYWx1ZSA9IHJlcXVpcmUoJy4vX2dldFZhbHVlJyk7XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBnZXRWYWx1ZShvYmplY3QsIGtleSk7XG4gIHJldHVybiBiYXNlSXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0TmF0aXZlO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UmF3VGFnO1xuIiwiLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0VmFsdWUob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VmFsdWU7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKi9cbmZ1bmN0aW9uIGhhc2hDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5hdGl2ZUNyZWF0ZSA/IG5hdGl2ZUNyZWF0ZShudWxsKSA6IHt9O1xuICB0aGlzLnNpemUgPSAwO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hDbGVhcjtcbiIsIi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7T2JqZWN0fSBoYXNoIFRoZSBoYXNoIHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoRGVsZXRlKGtleSkge1xuICB2YXIgcmVzdWx0ID0gdGhpcy5oYXMoa2V5KSAmJiBkZWxldGUgdGhpcy5fX2RhdGFfX1trZXldO1xuICB0aGlzLnNpemUgLT0gcmVzdWx0ID8gMSA6IDA7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaERlbGV0ZTtcbiIsInZhciBuYXRpdmVDcmVhdGUgPSByZXF1aXJlKCcuL19uYXRpdmVDcmVhdGUnKTtcblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEdldHMgdGhlIGhhc2ggdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gaGFzaEdldChrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICBpZiAobmF0aXZlQ3JlYXRlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGRhdGFba2V5XTtcbiAgICByZXR1cm4gcmVzdWx0ID09PSBIQVNIX1VOREVGSU5FRCA/IHVuZGVmaW5lZCA6IHJlc3VsdDtcbiAgfVxuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBrZXkpID8gZGF0YVtrZXldIDogdW5kZWZpbmVkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc2hHZXQ7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgaGFzaCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaEhhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICByZXR1cm4gbmF0aXZlQ3JlYXRlID8gKGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkKSA6IGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoSGFzO1xuIiwidmFyIG5hdGl2ZUNyZWF0ZSA9IHJlcXVpcmUoJy4vX25hdGl2ZUNyZWF0ZScpO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKlxuICogU2V0cyB0aGUgaGFzaCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGhhc2ggaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGhhc2hTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHRoaXMuc2l6ZSArPSB0aGlzLmhhcyhrZXkpID8gMCA6IDE7XG4gIGRhdGFba2V5XSA9IChuYXRpdmVDcmVhdGUgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkgPyBIQVNIX1VOREVGSU5FRCA6IHZhbHVlO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBoYXNoU2V0O1xuIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eKD86MHxbMS05XVxcZCopJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcbiAgcmV0dXJuICEhbGVuZ3RoICYmXG4gICAgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fCByZUlzVWludC50ZXN0KHZhbHVlKSkgJiZcbiAgICAodmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNJbmRleDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUgZm9yIHVzZSBhcyB1bmlxdWUgb2JqZWN0IGtleS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0tleWFibGUodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAodHlwZSA9PSAnc3RyaW5nJyB8fCB0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicpXG4gICAgPyAodmFsdWUgIT09ICdfX3Byb3RvX18nKVxuICAgIDogKHZhbHVlID09PSBudWxsKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0tleWFibGU7XG4iLCJ2YXIgY29yZUpzRGF0YSA9IHJlcXVpcmUoJy4vX2NvcmVKc0RhdGEnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1ldGhvZHMgbWFzcXVlcmFkaW5nIGFzIG5hdGl2ZS4gKi9cbnZhciBtYXNrU3JjS2V5ID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgdWlkID0gL1teLl0rJC8uZXhlYyhjb3JlSnNEYXRhICYmIGNvcmVKc0RhdGEua2V5cyAmJiBjb3JlSnNEYXRhLmtleXMuSUVfUFJPVE8gfHwgJycpO1xuICByZXR1cm4gdWlkID8gKCdTeW1ib2woc3JjKV8xLicgKyB1aWQpIDogJyc7XG59KCkpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgZnVuY2AgaGFzIGl0cyBzb3VyY2UgbWFza2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgZnVuY2AgaXMgbWFza2VkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTWFza2VkKGZ1bmMpIHtcbiAgcmV0dXJuICEhbWFza1NyY0tleSAmJiAobWFza1NyY0tleSBpbiBmdW5jKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc01hc2tlZDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGEgcHJvdG90eXBlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3RvdHlwZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1Byb3RvdHlwZSh2YWx1ZSkge1xuICB2YXIgQ3RvciA9IHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yLFxuICAgICAgcHJvdG8gPSAodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSkgfHwgb2JqZWN0UHJvdG87XG5cbiAgcmV0dXJuIHZhbHVlID09PSBwcm90bztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1Byb3RvdHlwZTtcbiIsIi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBbXTtcbiAgdGhpcy5zaXplID0gMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVDbGVhcjtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBsaXN0IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmVtb3ZlLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBlbnRyeSB3YXMgcmVtb3ZlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgaWYgKGluZGV4IDwgMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgbGFzdEluZGV4ID0gZGF0YS5sZW5ndGggLSAxO1xuICBpZiAoaW5kZXggPT0gbGFzdEluZGV4KSB7XG4gICAgZGF0YS5wb3AoKTtcbiAgfSBlbHNlIHtcbiAgICBzcGxpY2UuY2FsbChkYXRhLCBpbmRleCwgMSk7XG4gIH1cbiAgLS10aGlzLnNpemU7XG4gIHJldHVybiB0cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZURlbGV0ZTtcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIHJldHVybiBpbmRleCA8IDAgPyB1bmRlZmluZWQgOiBkYXRhW2luZGV4XVsxXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0Q2FjaGVHZXQ7XG4iLCJ2YXIgYXNzb2NJbmRleE9mID0gcmVxdWlyZSgnLi9fYXNzb2NJbmRleE9mJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbGlzdCBjYWNoZSB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBhc3NvY0luZGV4T2YodGhpcy5fX2RhdGFfXywga2V5KSA+IC0xO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZUhhcztcbiIsInZhciBhc3NvY0luZGV4T2YgPSByZXF1aXJlKCcuL19hc3NvY0luZGV4T2YnKTtcblxuLyoqXG4gKiBTZXRzIHRoZSBsaXN0IGNhY2hlIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBsaXN0IGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICArK3RoaXMuc2l6ZTtcbiAgICBkYXRhLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgfSBlbHNlIHtcbiAgICBkYXRhW2luZGV4XVsxXSA9IHZhbHVlO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpc3RDYWNoZVNldDtcbiIsInZhciBIYXNoID0gcmVxdWlyZSgnLi9fSGFzaCcpLFxuICAgIExpc3RDYWNoZSA9IHJlcXVpcmUoJy4vX0xpc3RDYWNoZScpLFxuICAgIE1hcCA9IHJlcXVpcmUoJy4vX01hcCcpO1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIG1hcC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUNsZWFyKCkge1xuICB0aGlzLnNpemUgPSAwO1xuICB0aGlzLl9fZGF0YV9fID0ge1xuICAgICdoYXNoJzogbmV3IEhhc2gsXG4gICAgJ21hcCc6IG5ldyAoTWFwIHx8IExpc3RDYWNoZSksXG4gICAgJ3N0cmluZyc6IG5ldyBIYXNoXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVDbGVhcjtcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVEZWxldGUoa2V5KSB7XG4gIHZhciByZXN1bHQgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSlbJ2RlbGV0ZSddKGtleSk7XG4gIHRoaXMuc2l6ZSAtPSByZXN1bHQgPyAxIDogMDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZURlbGV0ZTtcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIEdldHMgdGhlIG1hcCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVHZXQoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuZ2V0KGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVHZXQ7XG4iLCJ2YXIgZ2V0TWFwRGF0YSA9IHJlcXVpcmUoJy4vX2dldE1hcERhdGEnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYSBtYXAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5oYXMoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBDYWNoZUhhcztcbiIsInZhciBnZXRNYXBEYXRhID0gcmVxdWlyZSgnLi9fZ2V0TWFwRGF0YScpO1xuXG4vKipcbiAqIFNldHMgdGhlIG1hcCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBtYXAgY2FjaGUgaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSBnZXRNYXBEYXRhKHRoaXMsIGtleSksXG4gICAgICBzaXplID0gZGF0YS5zaXplO1xuXG4gIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICB0aGlzLnNpemUgKz0gZGF0YS5zaXplID09IHNpemUgPyAwIDogMTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWFwQ2FjaGVTZXQ7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBuYXRpdmVDcmVhdGUgPSBnZXROYXRpdmUoT2JqZWN0LCAnY3JlYXRlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gbmF0aXZlQ3JlYXRlO1xuIiwidmFyIG92ZXJBcmcgPSByZXF1aXJlKCcuL19vdmVyQXJnJyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVLZXlzID0gb3ZlckFyZyhPYmplY3Qua2V5cywgT2JqZWN0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBuYXRpdmVLZXlzO1xuIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZXhwb3J0c2AuICovXG52YXIgZnJlZUV4cG9ydHMgPSB0eXBlb2YgZXhwb3J0cyA9PSAnb2JqZWN0JyAmJiBleHBvcnRzICYmICFleHBvcnRzLm5vZGVUeXBlICYmIGV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgbW9kdWxlYC4gKi9cbnZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbi8qKiBEZXRlY3QgdGhlIHBvcHVsYXIgQ29tbW9uSlMgZXh0ZW5zaW9uIGBtb2R1bGUuZXhwb3J0c2AuICovXG52YXIgbW9kdWxlRXhwb3J0cyA9IGZyZWVNb2R1bGUgJiYgZnJlZU1vZHVsZS5leHBvcnRzID09PSBmcmVlRXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBwcm9jZXNzYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZVByb2Nlc3MgPSBtb2R1bGVFeHBvcnRzICYmIGZyZWVHbG9iYWwucHJvY2VzcztcblxuLyoqIFVzZWQgdG8gYWNjZXNzIGZhc3RlciBOb2RlLmpzIGhlbHBlcnMuICovXG52YXIgbm9kZVV0aWwgPSAoZnVuY3Rpb24oKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGZyZWVQcm9jZXNzICYmIGZyZWVQcm9jZXNzLmJpbmRpbmcgJiYgZnJlZVByb2Nlc3MuYmluZGluZygndXRpbCcpO1xuICB9IGNhdGNoIChlKSB7fVxufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBub2RlVXRpbDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgdXNpbmcgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9iamVjdFRvU3RyaW5nO1xuIiwiLyoqXG4gKiBDcmVhdGVzIGEgdW5hcnkgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIGl0cyBhcmd1bWVudCB0cmFuc2Zvcm1lZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgYXJndW1lbnQgdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG92ZXJBcmcoZnVuYywgdHJhbnNmb3JtKSB7XG4gIHJldHVybiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gZnVuYyh0cmFuc2Zvcm0oYXJnKSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb3ZlckFyZztcbiIsInZhciBmcmVlR2xvYmFsID0gcmVxdWlyZSgnLi9fZnJlZUdsb2JhbCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gcm9vdDtcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYGZ1bmNgIHRvIGl0cyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHNvdXJjZSBjb2RlLlxuICovXG5mdW5jdGlvbiB0b1NvdXJjZShmdW5jKSB7XG4gIGlmIChmdW5jICE9IG51bGwpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZ1bmNUb1N0cmluZy5jYWxsKGZ1bmMpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoZnVuYyArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiAnJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b1NvdXJjZTtcbiIsIi8qKlxuICogUGVyZm9ybXMgYVxuICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZSBlcXVpdmFsZW50LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKCdhJywgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKE5hTiwgTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gb3RoZXIgfHwgKHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVxO1xuIiwidmFyIGFycmF5RWFjaCA9IHJlcXVpcmUoJy4vX2FycmF5RWFjaCcpLFxuICAgIGJhc2VFYWNoID0gcmVxdWlyZSgnLi9fYmFzZUVhY2gnKSxcbiAgICBjYXN0RnVuY3Rpb24gPSByZXF1aXJlKCcuL19jYXN0RnVuY3Rpb24nKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5Jyk7XG5cbi8qKlxuICogSXRlcmF0ZXMgb3ZlciBlbGVtZW50cyBvZiBgY29sbGVjdGlvbmAgYW5kIGludm9rZXMgYGl0ZXJhdGVlYCBmb3IgZWFjaCBlbGVtZW50LlxuICogVGhlIGl0ZXJhdGVlIGlzIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM6ICh2YWx1ZSwgaW5kZXh8a2V5LCBjb2xsZWN0aW9uKS5cbiAqIEl0ZXJhdGVlIGZ1bmN0aW9ucyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHkgYnkgZXhwbGljaXRseSByZXR1cm5pbmcgYGZhbHNlYC5cbiAqXG4gKiAqKk5vdGU6KiogQXMgd2l0aCBvdGhlciBcIkNvbGxlY3Rpb25zXCIgbWV0aG9kcywgb2JqZWN0cyB3aXRoIGEgXCJsZW5ndGhcIlxuICogcHJvcGVydHkgYXJlIGl0ZXJhdGVkIGxpa2UgYXJyYXlzLiBUbyBhdm9pZCB0aGlzIGJlaGF2aW9yIHVzZSBgXy5mb3JJbmBcbiAqIG9yIGBfLmZvck93bmAgZm9yIG9iamVjdCBpdGVyYXRpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGFsaWFzIGVhY2hcbiAqIEBjYXRlZ29yeSBDb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWU9Xy5pZGVudGl0eV0gVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheXxPYmplY3R9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICogQHNlZSBfLmZvckVhY2hSaWdodFxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmZvckVhY2goWzEsIDJdLCBmdW5jdGlvbih2YWx1ZSkge1xuICogICBjb25zb2xlLmxvZyh2YWx1ZSk7XG4gKiB9KTtcbiAqIC8vID0+IExvZ3MgYDFgIHRoZW4gYDJgLlxuICpcbiAqIF8uZm9yRWFjaCh7ICdhJzogMSwgJ2InOiAyIH0sIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAqICAgY29uc29sZS5sb2coa2V5KTtcbiAqIH0pO1xuICogLy8gPT4gTG9ncyAnYScgdGhlbiAnYicgKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZCkuXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2goY29sbGVjdGlvbiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGZ1bmMgPSBpc0FycmF5KGNvbGxlY3Rpb24pID8gYXJyYXlFYWNoIDogYmFzZUVhY2g7XG4gIHJldHVybiBmdW5jKGNvbGxlY3Rpb24sIGNhc3RGdW5jdGlvbihpdGVyYXRlZSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZvckVhY2g7XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGZpcnN0IGFyZ3VtZW50IGl0IHJlY2VpdmVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIEFueSB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIGB2YWx1ZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICpcbiAqIGNvbnNvbGUubG9nKF8uaWRlbnRpdHkob2JqZWN0KSA9PT0gb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaWRlbnRpdHkodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlkZW50aXR5O1xuIiwidmFyIGJhc2VJc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vX2Jhc2VJc0FyZ3VtZW50cycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FyZ3VtZW50cyA9IGJhc2VJc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA/IGJhc2VJc0FyZ3VtZW50cyA6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJndW1lbnRzO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5KF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheTtcbiIsInZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuL2lzTGVuZ3RoJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZS4gQSB2YWx1ZSBpcyBjb25zaWRlcmVkIGFycmF5LWxpa2UgaWYgaXQnc1xuICogbm90IGEgZnVuY3Rpb24gYW5kIGhhcyBhIGB2YWx1ZS5sZW5ndGhgIHRoYXQncyBhbiBpbnRlZ2VyIGdyZWF0ZXIgdGhhbiBvclxuICogZXF1YWwgdG8gYDBgIGFuZCBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gYE51bWJlci5NQVhfU0FGRV9JTlRFR0VSYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoJ2FiYycpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgIWlzRnVuY3Rpb24odmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQXJyYXlMaWtlO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290JyksXG4gICAgc3R1YkZhbHNlID0gcmVxdWlyZSgnLi9zdHViRmFsc2UnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQ7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVJc0J1ZmZlciA9IEJ1ZmZlciA/IEJ1ZmZlci5pc0J1ZmZlciA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMy4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGJ1ZmZlciwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQnVmZmVyKG5ldyBCdWZmZXIoMikpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNCdWZmZXIobmV3IFVpbnQ4QXJyYXkoMikpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQnVmZmVyID0gbmF0aXZlSXNCdWZmZXIgfHwgc3R1YkZhbHNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzQnVmZmVyO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBhc3luY1RhZyA9ICdbb2JqZWN0IEFzeW5jRnVuY3Rpb25dJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIHByb3h5VGFnID0gJ1tvYmplY3QgUHJveHldJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA5IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5cyBhbmQgb3RoZXIgY29uc3RydWN0b3JzLlxuICB2YXIgdGFnID0gYmFzZUdldFRhZyh2YWx1ZSk7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnIHx8IHRhZyA9PSBhc3luY1RhZyB8fCB0YWcgPT0gcHJveHlUYWc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGdW5jdGlvbjtcbiIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0xlbmd0aDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3RMaWtlO1xuIiwidmFyIGJhc2VJc1R5cGVkQXJyYXkgPSByZXF1aXJlKCcuL19iYXNlSXNUeXBlZEFycmF5JyksXG4gICAgYmFzZVVuYXJ5ID0gcmVxdWlyZSgnLi9fYmFzZVVuYXJ5JyksXG4gICAgbm9kZVV0aWwgPSByZXF1aXJlKCcuL19ub2RlVXRpbCcpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1R5cGVkQXJyYXkgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIHR5cGVkIGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1R5cGVkQXJyYXkobmV3IFVpbnQ4QXJyYXkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KFtdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc1R5cGVkQXJyYXkgPSBub2RlSXNUeXBlZEFycmF5ID8gYmFzZVVuYXJ5KG5vZGVJc1R5cGVkQXJyYXkpIDogYmFzZUlzVHlwZWRBcnJheTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc1R5cGVkQXJyYXk7XG4iLCJ2YXIgYXJyYXlMaWtlS2V5cyA9IHJlcXVpcmUoJy4vX2FycmF5TGlrZUtleXMnKSxcbiAgICBiYXNlS2V5cyA9IHJlcXVpcmUoJy4vX2Jhc2VLZXlzJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuL2lzQXJyYXlMaWtlJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIE5vbi1vYmplY3QgdmFsdWVzIGFyZSBjb2VyY2VkIHRvIG9iamVjdHMuIFNlZSB0aGVcbiAqIFtFUyBzcGVjXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3Qua2V5cylcbiAqIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIF8ua2V5cygnaGknKTtcbiAqIC8vID0+IFsnMCcsICcxJ11cbiAqL1xuZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iamVjdCkgPyBhcnJheUxpa2VLZXlzKG9iamVjdCkgOiBiYXNlS2V5cyhvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXM7XG4iLCJ2YXIgTWFwQ2FjaGUgPSByZXF1aXJlKCcuL19NYXBDYWNoZScpO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IG1lbW9pemVzIHRoZSByZXN1bHQgb2YgYGZ1bmNgLiBJZiBgcmVzb2x2ZXJgIGlzXG4gKiBwcm92aWRlZCwgaXQgZGV0ZXJtaW5lcyB0aGUgY2FjaGUga2V5IGZvciBzdG9yaW5nIHRoZSByZXN1bHQgYmFzZWQgb24gdGhlXG4gKiBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIG1lbW9pemVkIGZ1bmN0aW9uLiBCeSBkZWZhdWx0LCB0aGUgZmlyc3QgYXJndW1lbnRcbiAqIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbiBpcyB1c2VkIGFzIHRoZSBtYXAgY2FjaGUga2V5LiBUaGUgYGZ1bmNgXG4gKiBpcyBpbnZva2VkIHdpdGggdGhlIGB0aGlzYCBiaW5kaW5nIG9mIHRoZSBtZW1vaXplZCBmdW5jdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogVGhlIGNhY2hlIGlzIGV4cG9zZWQgYXMgdGhlIGBjYWNoZWAgcHJvcGVydHkgb24gdGhlIG1lbW9pemVkXG4gKiBmdW5jdGlvbi4gSXRzIGNyZWF0aW9uIG1heSBiZSBjdXN0b21pemVkIGJ5IHJlcGxhY2luZyB0aGUgYF8ubWVtb2l6ZS5DYWNoZWBcbiAqIGNvbnN0cnVjdG9yIHdpdGggb25lIHdob3NlIGluc3RhbmNlcyBpbXBsZW1lbnQgdGhlXG4gKiBbYE1hcGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXByb3BlcnRpZXMtb2YtdGhlLW1hcC1wcm90b3R5cGUtb2JqZWN0KVxuICogbWV0aG9kIGludGVyZmFjZSBvZiBgY2xlYXJgLCBgZGVsZXRlYCwgYGdldGAsIGBoYXNgLCBhbmQgYHNldGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBoYXZlIGl0cyBvdXRwdXQgbWVtb2l6ZWQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcmVzb2x2ZXJdIFRoZSBmdW5jdGlvbiB0byByZXNvbHZlIHRoZSBjYWNoZSBrZXkuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBtZW1vaXplZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiAxLCAnYic6IDIgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2MnOiAzLCAnZCc6IDQgfTtcbiAqXG4gKiB2YXIgdmFsdWVzID0gXy5tZW1vaXplKF8udmFsdWVzKTtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogdmFsdWVzKG90aGVyKTtcbiAqIC8vID0+IFszLCA0XVxuICpcbiAqIG9iamVjdC5hID0gMjtcbiAqIHZhbHVlcyhvYmplY3QpO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogLy8gTW9kaWZ5IHRoZSByZXN1bHQgY2FjaGUuXG4gKiB2YWx1ZXMuY2FjaGUuc2V0KG9iamVjdCwgWydhJywgJ2InXSk7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsnYScsICdiJ11cbiAqXG4gKiAvLyBSZXBsYWNlIGBfLm1lbW9pemUuQ2FjaGVgLlxuICogXy5tZW1vaXplLkNhY2hlID0gV2Vha01hcDtcbiAqL1xuZnVuY3Rpb24gbWVtb2l6ZShmdW5jLCByZXNvbHZlcikge1xuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJyB8fCAocmVzb2x2ZXIgIT0gbnVsbCAmJiB0eXBlb2YgcmVzb2x2ZXIgIT0gJ2Z1bmN0aW9uJykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgdmFyIG1lbW9pemVkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMsXG4gICAgICAgIGtleSA9IHJlc29sdmVyID8gcmVzb2x2ZXIuYXBwbHkodGhpcywgYXJncykgOiBhcmdzWzBdLFxuICAgICAgICBjYWNoZSA9IG1lbW9pemVkLmNhY2hlO1xuXG4gICAgaWYgKGNhY2hlLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gY2FjaGUuZ2V0KGtleSk7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIG1lbW9pemVkLmNhY2hlID0gY2FjaGUuc2V0KGtleSwgcmVzdWx0KSB8fCBjYWNoZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBtZW1vaXplZC5jYWNoZSA9IG5ldyAobWVtb2l6ZS5DYWNoZSB8fCBNYXBDYWNoZSk7XG4gIHJldHVybiBtZW1vaXplZDtcbn1cblxuLy8gRXhwb3NlIGBNYXBDYWNoZWAuXG5tZW1vaXplLkNhY2hlID0gTWFwQ2FjaGU7XG5cbm1vZHVsZS5leHBvcnRzID0gbWVtb2l6ZTtcbiIsIi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBgZmFsc2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50aW1lcygyLCBfLnN0dWJGYWxzZSk7XG4gKiAvLyA9PiBbZmFsc2UsIGZhbHNlXVxuICovXG5mdW5jdGlvbiBzdHViRmFsc2UoKSB7XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHViRmFsc2U7XG4iLCJ2YXIgZmluZE1hdGNoaW5nUnVsZSA9IGZ1bmN0aW9uKHJ1bGVzLCB0ZXh0KXtcbiAgdmFyIGk7XG4gIGZvcihpPTA7IGk8cnVsZXMubGVuZ3RoOyBpKyspXG4gICAgaWYocnVsZXNbaV0ucmVnZXgudGVzdCh0ZXh0KSlcbiAgICAgIHJldHVybiBydWxlc1tpXTtcbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn07XG5cbnZhciBmaW5kTWF4SW5kZXhBbmRSdWxlID0gZnVuY3Rpb24ocnVsZXMsIHRleHQpe1xuICB2YXIgaSwgcnVsZSwgbGFzdF9tYXRjaGluZ19ydWxlO1xuICBmb3IoaT0wOyBpPHRleHQubGVuZ3RoOyBpKyspe1xuICAgIHJ1bGUgPSBmaW5kTWF0Y2hpbmdSdWxlKHJ1bGVzLCB0ZXh0LnN1YnN0cmluZygwLCBpICsgMSkpO1xuICAgIGlmKHJ1bGUpXG4gICAgICBsYXN0X21hdGNoaW5nX3J1bGUgPSBydWxlO1xuICAgIGVsc2UgaWYobGFzdF9tYXRjaGluZ19ydWxlKVxuICAgICAgcmV0dXJuIHttYXhfaW5kZXg6IGksIHJ1bGU6IGxhc3RfbWF0Y2hpbmdfcnVsZX07XG4gIH1cbiAgcmV0dXJuIGxhc3RfbWF0Y2hpbmdfcnVsZSA/IHttYXhfaW5kZXg6IHRleHQubGVuZ3RoLCBydWxlOiBsYXN0X21hdGNoaW5nX3J1bGV9IDogdW5kZWZpbmVkO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvblRva2VuX29yaWcpe1xuICB2YXIgYnVmZmVyID0gXCJcIjtcbiAgdmFyIHJ1bGVzID0gW107XG4gIHZhciBsaW5lID0gMTtcbiAgdmFyIGNvbCA9IDE7XG5cbiAgdmFyIG9uVG9rZW4gPSBmdW5jdGlvbihzcmMsIHR5cGUpe1xuICAgIG9uVG9rZW5fb3JpZyh7XG4gICAgICB0eXBlOiB0eXBlLFxuICAgICAgc3JjOiBzcmMsXG4gICAgICBsaW5lOiBsaW5lLFxuICAgICAgY29sOiBjb2xcbiAgICB9KTtcbiAgICB2YXIgbGluZXMgPSBzcmMuc3BsaXQoXCJcXG5cIik7XG4gICAgbGluZSArPSBsaW5lcy5sZW5ndGggLSAxO1xuICAgIGNvbCA9IChsaW5lcy5sZW5ndGggPiAxID8gMSA6IGNvbCkgKyBsaW5lc1tsaW5lcy5sZW5ndGggLSAxXS5sZW5ndGg7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBhZGRSdWxlOiBmdW5jdGlvbihyZWdleCwgdHlwZSl7XG4gICAgICBydWxlcy5wdXNoKHtyZWdleDogcmVnZXgsIHR5cGU6IHR5cGV9KTtcbiAgICB9LFxuICAgIG9uVGV4dDogZnVuY3Rpb24odGV4dCl7XG4gICAgICB2YXIgc3RyID0gYnVmZmVyICsgdGV4dDtcbiAgICAgIHZhciBtID0gZmluZE1heEluZGV4QW5kUnVsZShydWxlcywgc3RyKTtcbiAgICAgIHdoaWxlKG0gJiYgbS5tYXhfaW5kZXggIT09IHN0ci5sZW5ndGgpe1xuICAgICAgICBvblRva2VuKHN0ci5zdWJzdHJpbmcoMCwgbS5tYXhfaW5kZXgpLCBtLnJ1bGUudHlwZSk7XG5cbiAgICAgICAgLy9ub3cgZmluZCB0aGUgbmV4dCB0b2tlblxuICAgICAgICBzdHIgPSBzdHIuc3Vic3RyaW5nKG0ubWF4X2luZGV4KTtcbiAgICAgICAgbSA9IGZpbmRNYXhJbmRleEFuZFJ1bGUocnVsZXMsIHN0cik7XG4gICAgICB9XG4gICAgICBidWZmZXIgPSBzdHI7XG4gICAgfSxcbiAgICBlbmQ6IGZ1bmN0aW9uKCl7XG4gICAgICBpZihidWZmZXIubGVuZ3RoID09PSAwKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIHZhciBydWxlID0gZmluZE1hdGNoaW5nUnVsZShydWxlcywgYnVmZmVyKTtcbiAgICAgIGlmKCFydWxlKXtcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcihcInVuYWJsZSB0byB0b2tlbml6ZVwiKTtcbiAgICAgICAgZXJyLnRva2VuaXplcjIgPSB7XG4gICAgICAgICAgYnVmZmVyOiBidWZmZXIsXG4gICAgICAgICAgbGluZTogbGluZSxcbiAgICAgICAgICBjb2w6IGNvbFxuICAgICAgICB9O1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG5cbiAgICAgIG9uVG9rZW4oYnVmZmVyLCBydWxlLnR5cGUpO1xuICAgIH1cbiAgfTtcbn07XG4iLCJ2YXIgZ2V0TDEwbk9iamVjdCA9IHJlcXVpcmUoIFwiLi9nZXRMMTBuT2JqZWN0XCIgKTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBkZXNjcmlwdGlvbiBwbGFjZWhvbGRlciBmb3IgdXNlIGluIHRoZSBkZXNjcmlwdGlvbiBmb3Jtcy5cbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZGVzY3JpcHRpb24gcGxhY2Vob2xkZXIuXG4gKi9cbmZ1bmN0aW9uIGdldERlc2NyaXB0aW9uUGxhY2Vob2xkZXIoKSB7XG5cdHZhciBkZXNjcmlwdGlvblBsYWNlaG9sZGVyID0gXCJcIjtcblx0dmFyIGwxMG5PYmplY3QgPSBnZXRMMTBuT2JqZWN0KCk7XG5cblx0aWYgKCBsMTBuT2JqZWN0ICkge1xuXHRcdGRlc2NyaXB0aW9uUGxhY2Vob2xkZXIgPSBsMTBuT2JqZWN0Lm1ldGFkZXNjX3RlbXBsYXRlO1xuXHR9XG5cblx0cmV0dXJuIGRlc2NyaXB0aW9uUGxhY2Vob2xkZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0RGVzY3JpcHRpb25QbGFjZWhvbGRlcjtcbiIsInZhciBpc1VuZGVmaW5lZCA9IHJlcXVpcmUoIFwibG9kYXNoL2lzVW5kZWZpbmVkXCIgKTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBsMTBuIG9iamVjdCBmb3IgdGhlIGN1cnJlbnQgcGFnZSwgZWl0aGVyIHRlcm0gb3IgcG9zdC5cbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBUaGUgbDEwbiBvYmplY3QgZm9yIHRoZSBjdXJyZW50IHBhZ2UuXG4gKi9cbmZ1bmN0aW9uIGdldEwxMG5PYmplY3QoKSB7XG5cdHZhciBsMTBuT2JqZWN0ID0gbnVsbDtcblxuXHRpZiAoICEgaXNVbmRlZmluZWQoIHdpbmRvdy53cHNlb1Bvc3RTY3JhcGVyTDEwbiApICkge1xuXHRcdGwxMG5PYmplY3QgPSB3aW5kb3cud3BzZW9Qb3N0U2NyYXBlckwxMG47XG5cdH0gZWxzZSBpZiAoICEgaXNVbmRlZmluZWQoIHdpbmRvdy53cHNlb1Rlcm1TY3JhcGVyTDEwbiApICkge1xuXHRcdGwxMG5PYmplY3QgPSB3aW5kb3cud3BzZW9UZXJtU2NyYXBlckwxMG47XG5cdH1cblxuXHRyZXR1cm4gbDEwbk9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRMMTBuT2JqZWN0O1xuIiwidmFyIGdldEwxMG5PYmplY3QgPSByZXF1aXJlKCBcIi4vZ2V0TDEwbk9iamVjdFwiICk7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgdGl0bGUgcGxhY2Vob2xkZXIgZm9yIHVzZSBpbiB0aGUgdGl0bGUgZm9ybXMuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIHRpdGxlIHBsYWNlaG9sZGVyLlxuICovXG5mdW5jdGlvbiBnZXRUaXRsZVBsYWNlaG9sZGVyKCkge1xuXHR2YXIgdGl0bGVQbGFjZWhvbGRlciA9IFwiXCI7XG5cdHZhciBsMTBuT2JqZWN0ID0gZ2V0TDEwbk9iamVjdCgpO1xuXG5cdGlmICggbDEwbk9iamVjdCApIHtcblx0XHR0aXRsZVBsYWNlaG9sZGVyID0gbDEwbk9iamVjdC50aXRsZV90ZW1wbGF0ZTtcblx0fVxuXG5cdGlmICggdGl0bGVQbGFjZWhvbGRlciA9PT0gXCJcIiApIHtcblx0XHR0aXRsZVBsYWNlaG9sZGVyID0gXCIlJXRpdGxlJSUgLSAlJXNpdGVuYW1lJSVcIjtcblx0fVxuXG5cdHJldHVybiB0aXRsZVBsYWNlaG9sZGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFRpdGxlUGxhY2Vob2xkZXI7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGB1bmRlZmluZWRgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGB1bmRlZmluZWRgLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNVbmRlZmluZWQodm9pZCAwKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzVW5kZWZpbmVkKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNVbmRlZmluZWQ7XG4iLCIvKiBqc2hpbnQgLVcwOTcgKi9cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBIVE1MIGZvciBhIGhlbHAgYnV0dG9uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGhlIHRleHQgdG8gcHV0IGluIHRoZSBidXR0b24uXG4gKiBAcGFyYW0ge3N0cmluZ30gY29udHJvbHMgVGhlIEhUTUwgSUQgb2YgdGhlIGVsZW1lbnQgdGhpcyBidXR0b24gY29udHJvbHMuXG4gKlxuICogQHJldHVybnMge3N0cmluZ30gR2VuZXJhdGVkIEhUTUwuXG4gKi9cbmZ1bmN0aW9uIGhlbHBCdXR0b24oIHRleHQsIGNvbnRyb2xzICkge1xuXHRyZXR1cm4gJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwieW9hc3RfaGVscCB5b2FzdC1oZWxwLWJ1dHRvbiBkYXNoaWNvbnNcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIiAnICtcblx0XHQnYXJpYS1jb250cm9scz1cIicgKyBjb250cm9scyArICdcIj48c3BhbiBjbGFzcz1cInNjcmVlbi1yZWFkZXItdGV4dFwiPicgKyB0ZXh0ICsgJzwvc3Bhbj48L2J1dHRvbj4nO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIEhUTUwgZm9yIGEgaGVscCBidXR0b25cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdGV4dCB0byBwdXQgaW4gdGhlIGJ1dHRvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBpZCBUaGUgSFRNTCBJRCB0byBnaXZlIHRoaXMgYnV0dG9uLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBnZW5lcmF0ZWQgSFRNbC5cbiAqL1xuZnVuY3Rpb24gaGVscFRleHQoIHRleHQsIGlkICkge1xuXHRyZXR1cm4gJzxwIGlkPVwiJyArIGlkICsgJ1wiIGNsYXNzPVwieW9hc3QtaGVscC1wYW5lbFwiPicgKyB0ZXh0ICsgJzwvcD4nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0aGVscEJ1dHRvbjogaGVscEJ1dHRvbixcblx0aGVscFRleHQ6IGhlbHBUZXh0LFxufTtcbiIsIi8qIGdsb2JhbCB5b2FzdFNvY2lhbFByZXZpZXcsIHRpbnlNQ0UsIHJlcXVpcmUsIHdwLCBZb2FzdFNFTywgYWpheHVybCAgKi9cbi8qIGpzaGludCAtVzA5NyAqL1xuXG52YXIgZ2V0SW1hZ2VzID0gcmVxdWlyZSggXCJ5b2FzdHNlby9qcy9zdHJpbmdQcm9jZXNzaW5nL2ltYWdlSW5UZXh0XCIgKTtcbnZhciBoZWxwUGFuZWwgPSByZXF1aXJlKCBcIi4vaGVscFBhbmVsXCIgKTtcbnZhciBnZXRUaXRsZVBsYWNlaG9sZGVyID0gcmVxdWlyZSggXCIuLi8uLi8uLi8uLi9qcy9zcmMvYW5hbHlzaXMvZ2V0VGl0bGVQbGFjZWhvbGRlclwiICk7XG52YXIgZ2V0RGVzY3JpcHRpb25QbGFjZWhvbGRlciA9IHJlcXVpcmUoIFwiLi4vLi4vLi4vLi4vanMvc3JjL2FuYWx5c2lzL2dldERlc2NyaXB0aW9uUGxhY2Vob2xkZXJcIiApO1xuXG52YXIgX2RlYm91bmNlID0gcmVxdWlyZShcImxvZGFzaC9kZWJvdW5jZVwiKTtcbnZhciBjbG9uZSA9IHJlcXVpcmUoIFwibG9kYXNoL2Nsb25lXCIgKTtcbnZhciBmb3JFYWNoID0gcmVxdWlyZSggXCJsb2Rhc2gvZm9yRWFjaFwiICk7XG52YXIgX2hhcyA9IHJlcXVpcmUoIFwibG9kYXNoL2hhc1wiICk7XG52YXIgaXNVbmRlZmluZWQgPSByZXF1aXJlKCBcImxvZGFzaC9pc1VuZGVmaW5lZFwiICk7XG5cbnZhciBKZWQgPSByZXF1aXJlKCBcImplZFwiICk7XG52YXIgc29jaWFsUHJldmlld3MgPSByZXF1aXJlKCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiICk7XG5cbiggZnVuY3Rpb24oICQgKSB7XG5cdC8qKlxuXHQgKiBXZSB3YW50IHRvIHN0b3JlIHRoZSBmYWxsYmFja3MgaW4gYW4gb2JqZWN0LCB0byBoYXZlIGRpcmVjdGx5IGFjY2VzcyB0byB0aGVtLlxuXHQgKiBAdHlwZSB7e2NvbnRlbnQ6IHN0cmluZywgZmVhdHVyZWQ6IHN0cmluZ319XG5cdCAqL1xuXHR2YXIgaW1hZ2VGYWxsQmFjayA9IHtcblx0XHRjb250ZW50OiBcIlwiLFxuXHRcdGZlYXR1cmVkOiBcIlwiLFxuXHR9O1xuXG5cdHZhciBjYW5SZWFkRmVhdHVyZWRJbWFnZSA9IHRydWU7XG5cblx0dmFyIEZhY2Vib29rUHJldmlldyA9IHNvY2lhbFByZXZpZXdzLkZhY2Vib29rUHJldmlldztcblx0dmFyIFR3aXR0ZXJQcmV2aWV3ID0gc29jaWFsUHJldmlld3MuVHdpdHRlclByZXZpZXc7XG5cblx0dmFyIGZhY2Vib29rUHJldmlldywgdHdpdHRlclByZXZpZXc7XG5cblx0dmFyIHRyYW5zbGF0aW9ucyA9IHlvYXN0U29jaWFsUHJldmlldy5pMThuO1xuXG5cdHZhciBpMThuID0gbmV3IEplZCggYWRkTGlicmFyeVRyYW5zbGF0aW9ucyggdHJhbnNsYXRpb25zLmxpYnJhcnkgKSApO1xuXHR2YXIgYmlnZ2VySW1hZ2VzID0ge307XG5cblx0bGV0IHBvc3RUaXRsZUlucHV0SWQgPSBcInRpdGxlXCI7XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIGV2ZW50cyBmb3Igb3BlbmluZyB0aGUgV1AgbWVkaWEgbGlicmFyeSB3aGVuIHByZXNzaW5nIHRoZSBidXR0b24uXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBpbWFnZVVybCBUaGUgaW1hZ2UgVVJMIG9iamVjdC5cblx0ICogQHBhcmFtIHtzdHJpbmd9IGltYWdlQnV0dG9uIElEIG5hbWUgZm9yIHRoZSBpbWFnZSBidXR0b24uXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSByZW1vdmVCdXR0b24gSUQgbmFtZSBmb3IgdGhlIHJlbW92ZSBidXR0b24uXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uTWVkaWFTZWxlY3QgVGhlIGV2ZW50IHRoYXQgd2lsbCBiZSByYW4gd2hlbiBpbWFnZSBpcyBjaG9zZW4uXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBpbWFnZVByZXZpZXdFbGVtZW50IFRoZSBpbWFnZSBwcmV2aWV3IGVsZW1lbnQgdGhhdCBjYW4gYmUgY2xpY2tlZCB0byB1cGRhdGUgYXMgd2VsbC5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBiaW5kVXBsb2FkQnV0dG9uRXZlbnRzKCBpbWFnZVVybCwgaW1hZ2VCdXR0b24sIHJlbW92ZUJ1dHRvbiwgb25NZWRpYVNlbGVjdCwgaW1hZ2VQcmV2aWV3RWxlbWVudCApIHtcblx0XHR2YXIgc29jaWFsUHJldmlld1VwbG9hZGVyID0gd3AubWVkaWEuZnJhbWVzLmZpbGVfZnJhbWUgPSB3cC5tZWRpYSgge1xuXHRcdFx0dGl0bGU6IHlvYXN0U29jaWFsUHJldmlldy5jaG9vc2VfaW1hZ2UsXG5cdFx0XHRidXR0b246IHsgdGV4dDogeW9hc3RTb2NpYWxQcmV2aWV3LmNob29zZV9pbWFnZSB9LFxuXHRcdFx0bXVsdGlwbGU6IGZhbHNlLFxuXHRcdH0gKTtcblxuXHRcdHNvY2lhbFByZXZpZXdVcGxvYWRlci5vbiggXCJzZWxlY3RcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgYXR0YWNobWVudCA9IHNvY2lhbFByZXZpZXdVcGxvYWRlci5zdGF0ZSgpLmdldCggXCJzZWxlY3Rpb25cIiApLmZpcnN0KCkudG9KU09OKCk7XG5cblx0XHRcdC8vIFNldCB0aGUgaW1hZ2UgVVJMLlxuXHRcdFx0aW1hZ2VVcmwudmFsKCBhdHRhY2htZW50LnVybCApO1xuXG5cdFx0XHRvbk1lZGlhU2VsZWN0KCk7XG5cblx0XHRcdCQoIHJlbW92ZUJ1dHRvbiApLnNob3coKTtcblx0XHR9ICk7XG5cblx0XHQkKCByZW1vdmVCdXR0b24gKS5jbGljayggZnVuY3Rpb24oIGV2dCApIHtcblx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHQvLyBDbGVhciB0aGUgaW1hZ2UgVVJMXG5cdFx0XHRpbWFnZVVybC52YWwoIFwiXCIgKTtcblxuXHRcdFx0b25NZWRpYVNlbGVjdCgpO1xuXG5cdFx0XHQkKCByZW1vdmVCdXR0b24gKS5oaWRlKCk7XG5cdFx0fSApO1xuXG5cdFx0JCggaW1hZ2VCdXR0b24gKS5jbGljayggZnVuY3Rpb24oIGV2dCApIHtcblx0XHRcdGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0c29jaWFsUHJldmlld1VwbG9hZGVyLm9wZW4oKTtcblx0XHR9ICk7XG5cblx0XHQkKCBpbWFnZVByZXZpZXdFbGVtZW50ICkub24oIFwiY2xpY2tcIiwgZnVuY3Rpb24oIGV2ZW50T2JqZWN0ICkge1xuXHRcdFx0c29jaWFsUHJldmlld1VwbG9hZGVyLm9wZW4oKTtcblx0XHR9ICk7XG5cdH1cblxuXHQvKipcblx0ICogQWRkcyB0aGUgY2hvb3NlIGltYWdlIGJ1dHRvbiBhbmQgaGlkZXMgdGhlIGlucHV0IGZpZWxkLlxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcHJldmlldyBUaGUgcHJldmlldyB0byBhZGQgdGhlIHVwbG9hZCBidXR0b24gdG8uXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gYWRkVXBsb2FkQnV0dG9uKCBwcmV2aWV3ICkge1xuXHRcdGlmICggdHlwZW9mIHdwLm1lZGlhID09PSBcInVuZGVmaW5lZFwiICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciBpbWFnZVVybCA9ICQoIHByZXZpZXcuZWxlbWVudC5mb3JtQ29udGFpbmVyICkuZmluZCggXCIuanMtc25pcHBldC1lZGl0b3ItaW1hZ2VVcmxcIiApO1xuXG5cdFx0dmFyIGJ1dHRvbkRpdiA9ICQoIFwiPGRpdj48L2Rpdj5cIiApO1xuXHRcdGJ1dHRvbkRpdi5pbnNlcnRBZnRlciggaW1hZ2VVcmwgKTtcblxuXHRcdHZhciB1cGxvYWRCdXR0b25UZXh0ID0gZ2V0VXBsb2FkQnV0dG9uVGV4dCggcHJldmlldyApO1xuXG5cdFx0dmFyIGltYWdlRmllbGRJZCAgICA9IGpRdWVyeSggaW1hZ2VVcmwgKS5hdHRyKCBcImlkXCIgKTtcblx0XHR2YXIgaW1hZ2VCdXR0b25JZCAgID0gaW1hZ2VGaWVsZElkICsgXCJfYnV0dG9uXCI7XG5cdFx0dmFyIGltYWdlQnV0dG9uSHRtbCA9ICc8YnV0dG9uIGlkPVwiJyArIGltYWdlQnV0dG9uSWQgKyAnXCIgJyArXG5cdFx0XHQnY2xhc3M9XCJidXR0b24gYnV0dG9uLXByaW1hcnkgd3BzZW9fcHJldmlld19pbWFnZV91cGxvYWRfYnV0dG9uXCIgdHlwZT1cImJ1dHRvblwiPicgKyB1cGxvYWRCdXR0b25UZXh0ICsgJzwvYnV0dG9uPic7XG5cblx0XHR2YXIgcmVtb3ZlQnV0dG9uSWQgICA9IGltYWdlRmllbGRJZCArIFwiX3JlbW92ZV9idXR0b25cIjtcblx0XHR2YXIgcmVtb3ZlQnV0dG9uSHRtbCA9ICc8YnV0dG9uIGlkPVwiJyArIHJlbW92ZUJ1dHRvbklkICsgJ1wiIHR5cGU9XCJidXR0b25cIiAnICtcblx0XHRcdCdjbGFzcz1cImJ1dHRvbiB3cHNlb19wcmV2aWV3X2ltYWdlX3VwbG9hZF9idXR0b25cIj4nICsgeW9hc3RTb2NpYWxQcmV2aWV3LnJlbW92ZUltYWdlQnV0dG9uICsgJzwvYnV0dG9uPic7XG5cblx0XHQkKCBidXR0b25EaXYgKS5hcHBlbmQoIGltYWdlQnV0dG9uSHRtbCApO1xuXHRcdCQoIGJ1dHRvbkRpdiApLmFwcGVuZCggcmVtb3ZlQnV0dG9uSHRtbCApO1xuXG5cdFx0aW1hZ2VVcmwuaGlkZSgpO1xuXHRcdGlmICggaW1hZ2VVcmwudmFsKCkgPT09IFwiXCIgKSB7XG5cdFx0XHQkKCBcIiNcIiArIHJlbW92ZUJ1dHRvbklkICkuaGlkZSgpO1xuXHRcdH1cblxuXHRcdGJpbmRVcGxvYWRCdXR0b25FdmVudHMoXG5cdFx0XHRpbWFnZVVybCxcblx0XHRcdFwiI1wiICsgaW1hZ2VCdXR0b25JZCxcblx0XHRcdFwiI1wiICsgcmVtb3ZlQnV0dG9uSWQsXG5cdFx0XHRwcmV2aWV3LnVwZGF0ZVByZXZpZXcuYmluZCggcHJldmlldyApLFxuXHRcdFx0JCggcHJldmlldy5lbGVtZW50LmNvbnRhaW5lciApLmZpbmQoIFwiLmVkaXRhYmxlLXByZXZpZXdfX2ltYWdlXCIgKVxuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgdHlwZSBvZiB0aGUgY3VycmVudCBwYWdlOiBwb3N0IG9yIHRlcm0uXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjdXJyZW50IHR5cGUuXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRDdXJyZW50VHlwZSgpIHtcblx0XHQvLyBXaGVuIHRoaXMgZmllbGQgZXhpc3RzLCBpdCBpcyBhIHBvc3QuXG5cdFx0aWYgKCAkKCBcIiNwb3N0X0lEXCIgKS5sZW5ndGggPiAwICkge1xuXHRcdFx0cmV0dXJuIFwicG9zdFwiO1xuXHRcdH1cblxuXHRcdC8vIFdoZW4gdGhpcyBmaWVsZCBpcyBmb3VuZCwgaXQgaXMgYSB0ZXJtLlxuXHRcdGlmICggJCggXCJpbnB1dFtuYW1lPXRhZ19JRF1cIiApLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRyZXR1cm4gXCJ0ZXJtXCI7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgcHJlZml4IGZvciB0aGUgZmllbGRzLCBiZWNhdXNlIG9mIHRoZSBmaWVsZHMgZm9yIHRoZSBwb3N0IGRvIGhhdmUgYW4gb3RoZXJlIHByZWZpeCB0aGFuIHRoZSBvbmVzIGZvclxuXHQgKiBhIHRheG9ub215LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7Kn0gVGhlIHByZWZpeCB0byB1c2UuXG5cdCAqL1xuXHRmdW5jdGlvbiBmaWVsZFByZWZpeCgpIHtcblx0XHRzd2l0Y2goIGdldEN1cnJlbnRUeXBlKCkgKSB7XG5cdFx0XHRjYXNlIFwicG9zdFwiOlxuXHRcdFx0XHRyZXR1cm4gXCJ5b2FzdF93cHNlb1wiO1xuXHRcdFx0Y2FzZSBcInRlcm1cIjpcblx0XHRcdFx0cmV0dXJuIFwid3BzZW9cIjtcblx0XHRcdGRlZmF1bHQgOlxuXHRcdFx0XHRyZXR1cm4gXCJcIjtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgbmFtZSBvZiB0aGUgdGlueW1jZSBhbmQgdGV4dGFyZWEgZmllbGRzLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgbmFtZSBmb3IgdGhlIGNvbnRlbnQgZmllbGQuXG5cdCAqL1xuXHRmdW5jdGlvbiBjb250ZW50VGV4dE5hbWUoKSB7XG5cdFx0c3dpdGNoICggZ2V0Q3VycmVudFR5cGUoKSApIHtcblx0XHRcdGNhc2UgXCJwb3N0XCIgOlxuXHRcdFx0XHRyZXR1cm4gXCJjb250ZW50XCI7XG5cdFx0XHRjYXNlIFwidGVybVwiIDpcblx0XHRcdFx0cmV0dXJuIFwiZGVzY3JpcHRpb25cIjtcblx0XHRcdGRlZmF1bHQgOlxuXHRcdFx0XHRyZXR1cm4gXCJcIjtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyB0aGUgc29jaWFsIHByZXZpZXcgY29udGFpbmVyIGFuZCBoaWRlcyB0aGUgb2xkIGZvcm0gdGFibGUsIHRvIHJlcGxhY2UgaXQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBzb2NpYWxQcmV2aWV3aG9sZGVyIFRoZSBob2xkZXIgZWxlbWVudCB3aGVyZSB0aGUgY29udGFpbmVyIHdpbGwgYmUgYXBwZW5kIHRvLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gY29udGFpbmVySWQgVGhlIGlkIHRoZSBjb250YWluZXIgd2lsbCBnZXRcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBjcmVhdGVTb2NpYWxQcmV2aWV3Q29udGFpbmVyKCBzb2NpYWxQcmV2aWV3aG9sZGVyLCBjb250YWluZXJJZCApIHtcblx0XHRzb2NpYWxQcmV2aWV3aG9sZGVyLmFwcGVuZCggJzxkaXYgaWQ9XCInICsgY29udGFpbmVySWQgKyAnXCI+PC9kaXY+JyApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIG1ldGEgZGVzY3JpcHRpb24gZnJvbSB0aGUgc25pcHBldCBlZGl0b3Jcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRNZXRhRGVzY3JpcHRpb24oKSB7XG5cdFx0cmV0dXJuICQoIFwiI3lvYXN0X3dwc2VvX21ldGFkZXNjXCIgKS52YWwoKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBwbGFjZWhvbGRlciBmb3IgdGhlIG1ldGEgZGVzY3JpcHRpb24gZmllbGQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBwbGFjZWhvbGRlciBmb3IgdGhlIG1ldGEgZGVzY3JpcHRpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRTb2NpYWxEZXNjcmlwdGlvblBsYWNlaG9sZGVyKCkge1xuXHRcdHZhciBkZXNjcmlwdGlvbiA9IGdldE1ldGFEZXNjcmlwdGlvbigpO1xuXG5cdFx0aWYgKCBcIlwiID09PSBkZXNjcmlwdGlvbiApIHtcblx0XHRcdGRlc2NyaXB0aW9uID0gZ2V0RGVzY3JpcHRpb25QbGFjZWhvbGRlcigpO1xuXHRcdH1cblxuXHRcdHJldHVybiBkZXNjcmlwdGlvbjtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBhcmd1bWVudHMgZm9yIHRoZSBzb2NpYWwgcHJldmlldyBwcm90b3R5cGVzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdGFyZ2V0RWxlbWVudCBUaGUgZWxlbWVudCB3aGVyZSB0aGUgcHJldmlldyBpcyBsb2FkZWQuXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBmaWVsZFByZWZpeCBUaGUgcHJlZml4IGVhY2ggZm9ybSBlbGVtZW50IGhhcy5cblx0ICpcblx0ICogQHJldHVybnMgeyB7XG5cdCAqIFx0XHR0YXJnZXRFbGVtZW50OiBFbGVtZW50LFxuXHQgKlx0XHRkYXRhOiB7dGl0bGU6ICosIGRlc2NyaXB0aW9uOiAqLCBpbWFnZVVybDogKn0sXG5cdCAqIFx0XHRiYXNlVVJMOiAqLFxuXHQgKiBcdFx0Y2FsbGJhY2tzOiB7dXBkYXRlU29jaWFsUHJldmlldzogY2FsbGJhY2tzLnVwZGF0ZVNvY2lhbFByZXZpZXd9XG5cdCAqIH0gfSBUaGUgYXJndW1lbnRzIGZvciB0aGUgc29jaWFsIHByZXZpZXcuXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRTb2NpYWxQcmV2aWV3QXJncyggdGFyZ2V0RWxlbWVudCwgZmllbGRQcmVmaXggKSB7XG5cdFx0dmFyIHRpdGxlUGxhY2Vob2xkZXIgPSBnZXRUaXRsZVBsYWNlaG9sZGVyKCk7XG5cdFx0dmFyIGRlc2NyaXB0aW9uUGxhY2Vob2xkZXIgPSBnZXRTb2NpYWxEZXNjcmlwdGlvblBsYWNlaG9sZGVyKCk7XG5cblx0XHR2YXIgYXJncyA9IHtcblx0XHRcdHRhcmdldEVsZW1lbnQ6ICQoIHRhcmdldEVsZW1lbnQgKS5nZXQoIDAgKSxcblx0XHRcdGRhdGE6IHtcblx0XHRcdFx0dGl0bGU6ICQoIFwiI1wiICsgZmllbGRQcmVmaXggKyBcIi10aXRsZVwiICkudmFsKCksXG5cdFx0XHRcdGRlc2NyaXB0aW9uOiAkKCBcIiNcIiArIGZpZWxkUHJlZml4ICsgXCItZGVzY3JpcHRpb25cIiApLnZhbCgpLFxuXHRcdFx0XHRpbWFnZVVybDogJCggXCIjXCIgKyBmaWVsZFByZWZpeCArIFwiLWltYWdlXCIgKS52YWwoKSxcblx0XHRcdH0sXG5cdFx0XHRiYXNlVVJMOiB5b2FzdFNvY2lhbFByZXZpZXcud2Vic2l0ZSxcblx0XHRcdGNhbGxiYWNrczoge1xuXHRcdFx0XHR1cGRhdGVTb2NpYWxQcmV2aWV3OiBmdW5jdGlvbiggZGF0YSApIHtcblx0XHRcdFx0XHQkKCBcIiNcIiArIGZpZWxkUHJlZml4ICsgXCItdGl0bGVcIiApLnZhbCggZGF0YS50aXRsZSApO1xuXHRcdFx0XHRcdCQoIFwiI1wiICsgZmllbGRQcmVmaXggKyBcIi1kZXNjcmlwdGlvblwiICkudmFsKCBkYXRhLmRlc2NyaXB0aW9uICk7XG5cdFx0XHRcdFx0JCggXCIjXCIgKyBmaWVsZFByZWZpeCArIFwiLWltYWdlXCIgKS52YWwoIGRhdGEuaW1hZ2VVcmwgKTtcblxuXHRcdFx0XHRcdC8vIE1ha2Ugc3VyZSBUd2l0dGVyIGlzIHVwZGF0ZWQgaWYgYSBGYWNlYm9vayBpbWFnZSBpcyBzZXRcblx0XHRcdFx0XHQkKCBcIi5lZGl0YWJsZS1wcmV2aWV3XCIgKS50cmlnZ2VyKCBcImltYWdlVXBkYXRlXCIgKTtcblxuXHRcdFx0XHRcdGlmICggZGF0YS5pbWFnZVVybCAhPT0gXCJcIiApIHtcblx0XHRcdFx0XHRcdHZhciBidXR0b25QcmVmaXggPSB0YXJnZXRFbGVtZW50LmF0dHIoIFwiaWRcIiApLnJlcGxhY2UoIFwiUHJldmlld1wiLCBcIlwiICk7XG5cdFx0XHRcdFx0XHRzZXRVcGxvYWRCdXR0b25WYWx1ZSggYnV0dG9uUHJlZml4LCB5b2FzdFNvY2lhbFByZXZpZXcudXNlT3RoZXJJbWFnZSApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGpRdWVyeSggdGFyZ2V0RWxlbWVudCApLmZpbmQoIFwiLmVkaXRhYmxlLXByZXZpZXdcIiApLnRyaWdnZXIoIFwidGl0bGVVcGRhdGVcIiApO1xuXHRcdFx0XHRcdGpRdWVyeSggdGFyZ2V0RWxlbWVudCApLmZpbmQoIFwiLmVkaXRhYmxlLXByZXZpZXdcIiApLnRyaWdnZXIoIFwiZGVzY3JpcHRpb25VcGRhdGVcIiApO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRtb2RpZnlJbWFnZVVybDogZnVuY3Rpb24oIGltYWdlVXJsICkge1xuXHRcdFx0XHRcdGlmICggaW1hZ2VVcmwgPT09IFwiXCIgKSB7XG5cdFx0XHRcdFx0XHRpbWFnZVVybCA9IGdldEZhbGxiYWNrSW1hZ2UoIFwiXCIgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gaW1hZ2VVcmw7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdG1vZGlmeVRpdGxlOiBmdW5jdGlvbiggdGl0bGUgKSB7XG5cdFx0XHRcdFx0aWYgKCBmaWVsZFByZWZpeC5pbmRleE9mKCBcInR3aXR0ZXJcIiApID4gLTEgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIHRpdGxlID09PSAkKCBcIiN0d2l0dGVyLWVkaXRvci10aXRsZVwiICkuYXR0ciggXCJwbGFjZWhvbGRlclwiICkgKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBmYWNlYm9va1RpdGxlID0gJCggXCIjZmFjZWJvb2stZWRpdG9yLXRpdGxlXCIgKS52YWwoKTtcblx0XHRcdFx0XHRcdFx0aWYgKCAhIGlzVW5kZWZpbmVkKCBmYWNlYm9va1RpdGxlICkgJiYgZmFjZWJvb2tUaXRsZSAhPT0gXCJcIiApIHtcblx0XHRcdFx0XHRcdFx0XHR0aXRsZSA9IGZhY2Vib29rVGl0bGU7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIFlvYXN0U0VPLndwLnJlcGxhY2VWYXJzUGx1Z2luLnJlcGxhY2VWYXJpYWJsZXMoIHRpdGxlICk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdG1vZGlmeURlc2NyaXB0aW9uOiBmdW5jdGlvbiggZGVzY3JpcHRpb24gKSB7XG5cdFx0XHRcdFx0aWYgKCBmaWVsZFByZWZpeC5pbmRleE9mKCBcInR3aXR0ZXJcIiApID4gLTEgKSB7XG5cdFx0XHRcdFx0XHRpZiAoIGRlc2NyaXB0aW9uID09PSAkKCBcIiN0d2l0dGVyLWVkaXRvci1kZXNjcmlwdGlvblwiICkuYXR0ciggXCJwbGFjZWhvbGRlclwiICkgKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBmYWNlYm9va0Rlc2NyaXB0aW9uID0gJCggXCIjZmFjZWJvb2stZWRpdG9yLWRlc2NyaXB0aW9uXCIgKS52YWwoKTtcblx0XHRcdFx0XHRcdFx0aWYgKCBmYWNlYm9va0Rlc2NyaXB0aW9uICE9PSBcIlwiICkge1xuXHRcdFx0XHRcdFx0XHRcdGRlc2NyaXB0aW9uID0gZmFjZWJvb2tEZXNjcmlwdGlvbjtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0aWYgKCBpc1VuZGVmaW5lZCggZGVzY3JpcHRpb24gKSApe1xuXHRcdFx0XHRcdFx0XHRkZXNjcmlwdGlvbiA9ICQoICcjdHdpdHRlci1lZGl0b3ItZGVzY3JpcHRpb24nICkuYXR0ciggJ3BsYWNlaG9sZGVyJyApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBZb2FzdFNFTy53cC5yZXBsYWNlVmFyc1BsdWdpbi5yZXBsYWNlVmFyaWFibGVzKCBkZXNjcmlwdGlvbiApO1xuXHRcdFx0XHR9LFxuXHRcdFx0fSxcblx0XHRcdHBsYWNlaG9sZGVyOiB7XG5cdFx0XHRcdHRpdGxlOiB0aXRsZVBsYWNlaG9sZGVyLFxuXHRcdFx0fSxcblx0XHRcdGRlZmF1bHRWYWx1ZToge1xuXHRcdFx0XHR0aXRsZTogdGl0bGVQbGFjZWhvbGRlcixcblx0XHRcdH0sXG5cdFx0fTtcblxuXHRcdGlmICggXCJcIiAhPT0gZGVzY3JpcHRpb25QbGFjZWhvbGRlciApIHtcblx0XHRcdGFyZ3MucGxhY2Vob2xkZXIuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvblBsYWNlaG9sZGVyO1xuXHRcdFx0YXJncy5kZWZhdWx0VmFsdWUuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvblBsYWNlaG9sZGVyO1xuXHRcdH1cblxuXHRcdHJldHVybiBhcmdzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRyeSB0byBnZXQgdGhlIEZhY2Vib29rIGF1dGhvciBuYW1lIHZpYSBBSkFYIGFuZCBwdXQgaXQgdG8gdGhlIEZhY2Vib29rIHByZXZpZXcuXG5cdCAqXG5cdCAqIEBwYXJhbSB7RmFjZWJvb2tQcmV2aWV3fSBmYWNlYm9va1ByZXZpZXcgVGhlIEZhY2Vib29rIHByZXZpZXcgb2JqZWN0XG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0RmFjZWJvb2tBdXRob3IoIGZhY2Vib29rUHJldmlldyApIHtcblx0XHQkLmdldChcblx0XHRcdGFqYXh1cmwsXG5cdFx0XHR7XG5cdFx0XHRcdGFjdGlvbjogXCJ3cHNlb19nZXRfZmFjZWJvb2tfbmFtZVwiLFxuXHRcdFx0XHRfYWpheF9ub25jZTogeW9hc3RTb2NpYWxQcmV2aWV3LmZhY2Vib29rTm9uY2UsXG5cdFx0XHRcdHVzZXJfaWQ6ICQoIFwiI3Bvc3RfYXV0aG9yX292ZXJyaWRlXCIgKS52YWwoKSxcblx0XHRcdH0sXG5cdFx0XHRmdW5jdGlvbiggYXV0aG9yICkge1xuXHRcdFx0XHRpZiAoIGF1dGhvciAhPT0gMCApIHtcblx0XHRcdFx0XHRmYWNlYm9va1ByZXZpZXcuc2V0QXV0aG9yKCBhdXRob3IgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCk7XG5cdH1cblxuXHQvKipcblx0ICogSW5pdGlhbGl6ZSB0aGUgRmFjZWJvb2sgcHJldmlldy5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IGZhY2Vib29rSG9sZGVyIFRhcmdldCBlbGVtZW50IGZvciBhZGRpbmcgdGhlIEZhY2Vib29rIHByZXZpZXcuXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gaW5pdEZhY2Vib29rKCBmYWNlYm9va0hvbGRlciApIHtcblx0XHRjcmVhdGVTb2NpYWxQcmV2aWV3Q29udGFpbmVyKCBmYWNlYm9va0hvbGRlciwgXCJmYWNlYm9va1ByZXZpZXdcIiApO1xuXG5cdFx0dmFyIGZhY2Vib29rUHJldmlld0NvbnRhaW5lciA9ICQoIFwiI2ZhY2Vib29rUHJldmlld1wiICk7XG5cdFx0ZmFjZWJvb2tQcmV2aWV3ID0gbmV3IEZhY2Vib29rUHJldmlldyhcblx0XHRcdGdldFNvY2lhbFByZXZpZXdBcmdzKCBmYWNlYm9va1ByZXZpZXdDb250YWluZXIsIGZpZWxkUHJlZml4KCkgKyBcIl9vcGVuZ3JhcGhcIiApLFxuXHRcdFx0aTE4blxuXHRcdCk7XG5cblx0XHRmYWNlYm9va1ByZXZpZXdDb250YWluZXIub24oXG5cdFx0XHRcImltYWdlVXBkYXRlXCIsXG5cdFx0XHRcIi5lZGl0YWJsZS1wcmV2aWV3XCIsXG5cdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0c2V0VXBsb2FkQnV0dG9uVmFsdWUoIFwiZmFjZWJvb2tcIiwgZ2V0VXBsb2FkQnV0dG9uVGV4dCggZmFjZWJvb2tQcmV2aWV3ICkgKTtcblx0XHRcdFx0c2V0RmFsbGJhY2tJbWFnZSggZmFjZWJvb2tQcmV2aWV3ICk7XG5cdFx0XHR9XG5cdFx0KTtcblxuXHRcdGZhY2Vib29rUHJldmlldy5pbml0KCk7XG5cblx0XHRhZGRVcGxvYWRCdXR0b24oIGZhY2Vib29rUHJldmlldyApO1xuXG5cdFx0dmFyIHBvc3RBdXRob3JEcm9wZG93biA9ICQoIFwiI3Bvc3RfYXV0aG9yX292ZXJyaWRlXCIgKTtcblx0XHRpZiggcG9zdEF1dGhvckRyb3Bkb3duLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRwb3N0QXV0aG9yRHJvcGRvd24ub24oIFwiY2hhbmdlXCIsIGdldEZhY2Vib29rQXV0aG9yLmJpbmQoIHRoaXMsIGZhY2Vib29rUHJldmlldyApICk7XG5cdFx0XHRwb3N0QXV0aG9yRHJvcGRvd24udHJpZ2dlciggXCJjaGFuZ2VcIiApO1xuXHRcdH1cblxuXHRcdCQoIFwiI1wiICsgcG9zdFRpdGxlSW5wdXRJZCApLm9uKFxuXHRcdFx0XCJrZXlkb3duIGtleXVwIGlucHV0IGZvY3VzIGJsdXJcIixcblx0XHRcdF9kZWJvdW5jZSggZmFjZWJvb2tQcmV2aWV3LnVwZGF0ZVByZXZpZXcuYmluZCggZmFjZWJvb2tQcmV2aWV3ICksIDUwMCApXG5cdFx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXplIHRoZSB0d2l0dGVyIHByZXZpZXcuXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB0d2l0dGVySG9sZGVyIFRhcmdldCBlbGVtZW50IGZvciBhZGRpbmcgdGhlIHR3aXR0ZXIgcHJldmlldy5cblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBpbml0VHdpdHRlciggdHdpdHRlckhvbGRlciApIHtcblx0XHRjcmVhdGVTb2NpYWxQcmV2aWV3Q29udGFpbmVyKCB0d2l0dGVySG9sZGVyLCBcInR3aXR0ZXJQcmV2aWV3XCIgKTtcblxuXHRcdHZhciB0d2l0dGVyUHJldmlld0NvbnRhaW5lciA9ICQoIFwiI3R3aXR0ZXJQcmV2aWV3XCIgKTtcblx0XHR0d2l0dGVyUHJldmlldyA9IG5ldyBUd2l0dGVyUHJldmlldyhcblx0XHRcdGdldFNvY2lhbFByZXZpZXdBcmdzKCB0d2l0dGVyUHJldmlld0NvbnRhaW5lciwgZmllbGRQcmVmaXgoKSArIFwiX3R3aXR0ZXJcIiApLFxuXHRcdFx0aTE4blxuXHRcdCk7XG5cblx0XHR0d2l0dGVyUHJldmlld0NvbnRhaW5lci5vbihcblx0XHRcdFwiaW1hZ2VVcGRhdGVcIixcblx0XHRcdFwiLmVkaXRhYmxlLXByZXZpZXdcIixcblx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRzZXRVcGxvYWRCdXR0b25WYWx1ZSggXCJ0d2l0dGVyXCIsIGdldFVwbG9hZEJ1dHRvblRleHQoIHR3aXR0ZXJQcmV2aWV3ICkgKTtcblx0XHRcdFx0c2V0RmFsbGJhY2tJbWFnZSggdHdpdHRlclByZXZpZXcgKTtcblx0XHRcdH1cblx0XHQpO1xuXG5cdFx0dmFyIGZhY2Vib29rUHJldmlld0NvbnRhaW5lciA9ICQoIFwiI2ZhY2Vib29rUHJldmlld1wiICk7XG5cdFx0ZmFjZWJvb2tQcmV2aWV3Q29udGFpbmVyLm9uKFxuXHRcdFx0XCJ0aXRsZVVwZGF0ZVwiLFxuXHRcdFx0XCIuZWRpdGFibGUtcHJldmlld1wiLFxuXHRcdFx0dHdpdHRlclRpdGxlRmFsbGJhY2suYmluZCggdGhpcywgdHdpdHRlclByZXZpZXcgKVxuXHRcdCk7XG5cblx0XHRmYWNlYm9va1ByZXZpZXdDb250YWluZXIub24oXG5cdFx0XHRcImRlc2NyaXB0aW9uVXBkYXRlXCIsXG5cdFx0XHRcIi5lZGl0YWJsZS1wcmV2aWV3XCIsXG5cdFx0XHR0d2l0dGVyRGVzY3JpcHRpb25GYWxsYmFjay5iaW5kKCB0aGlzLCB0d2l0dGVyUHJldmlldyApXG5cdFx0KTtcblxuXHRcdHR3aXR0ZXJQcmV2aWV3LmluaXQoKTtcblxuXHRcdGFkZFVwbG9hZEJ1dHRvbiggdHdpdHRlclByZXZpZXcgKTtcblx0XHR0d2l0dGVyVGl0bGVGYWxsYmFjayggdHdpdHRlclByZXZpZXcgKTtcblx0XHR0d2l0dGVyRGVzY3JpcHRpb25GYWxsYmFjayggdHdpdHRlclByZXZpZXcgKTtcblxuXHRcdCQoIFwiI1wiICsgcG9zdFRpdGxlSW5wdXRJZCApLm9uKFxuXHRcdFx0XCJrZXlkb3duIGtleXVwIGlucHV0IGZvY3VzIGJsdXJcIixcblx0XHRcdF9kZWJvdW5jZSggdHdpdHRlclRpdGxlRmFsbGJhY2suYmluZCggdGhpcywgdHdpdHRlclByZXZpZXcgKSwgNTAwIClcblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdoZW4gdHdpdHRlciB0aXRsZSBpcyBlbXB0eSwgdXNlIHRoZSBGYWNlYm9vayB0aXRsZVxuXHQgKlxuXHQgKiBAcGFyYW0ge1R3aXR0ZXJQcmV2aWV3fSB0d2l0dGVyUHJldmlldyBUaGUgdHdpdHRlciBwcmV2aWV3IG9iamVjdFxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHR3aXR0ZXJUaXRsZUZhbGxiYWNrKCB0d2l0dGVyUHJldmlldyApIHtcblx0XHR2YXIgJHR3aXR0ZXJUaXRsZSA9ICQoIFwiI3R3aXR0ZXItZWRpdG9yLXRpdGxlXCIgKTtcblx0XHR2YXIgdHdpdHRlclRpdGxlID0gJHR3aXR0ZXJUaXRsZS52YWwoKTtcblx0XHRpZiggdHdpdHRlclRpdGxlICE9PSBcIlwiICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHZhciBmYWNlYm9va1RpdGxlID0gJCggXCIjZmFjZWJvb2stZWRpdG9yLXRpdGxlXCIgKS52YWwoKTtcblx0XHRpZiAoICEgaXNVbmRlZmluZWQoIGZhY2Vib29rVGl0bGUgKSAmJiBmYWNlYm9va1RpdGxlICE9PSBcIlwiICkge1xuXHRcdFx0dHdpdHRlclByZXZpZXcuc2V0VGl0bGUoIGZhY2Vib29rVGl0bGUgKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dHdpdHRlclByZXZpZXcuc2V0VGl0bGUoICR0d2l0dGVyVGl0bGUuYXR0ciggXCJwbGFjZWhvbGRlclwiICkgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogV2hlbiB0d2l0dGVyIGRlc2NyaXB0aW9uIGlzIGVtcHR5LCB1c2UgdGhlIGRlc2NyaXB0aW9uIHRpdGxlXG5cdCAqXG5cdCAqIEBwYXJhbSB7VHdpdHRlclByZXZpZXd9IHR3aXR0ZXJQcmV2aWV3IFRoZSB0d2l0dGVyIHByZXZpZXcgb2JqZWN0XG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gdHdpdHRlckRlc2NyaXB0aW9uRmFsbGJhY2soIHR3aXR0ZXJQcmV2aWV3ICkge1xuXHRcdHZhciAkdHdpdHRlckRlc2NyaXB0aW9uID0gJCggXCIjdHdpdHRlci1lZGl0b3ItZGVzY3JpcHRpb25cIiApO1xuXHRcdHZhciB0d2l0dGVyRGVzY3JpcHRpb24gPSAkdHdpdHRlckRlc2NyaXB0aW9uLnZhbCgpO1xuXHRcdGlmKCB0d2l0dGVyRGVzY3JpcHRpb24gIT09IFwiXCIgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGZhY2Vib29rRGVzY3JpcHRpb24gPSAkKCBcIiNmYWNlYm9vay1lZGl0b3ItZGVzY3JpcHRpb25cIiApLnZhbCgpO1xuXHRcdGlmICggZmFjZWJvb2tEZXNjcmlwdGlvbiAhPT0gXCJcIiApIHtcblx0XHRcdHR3aXR0ZXJQcmV2aWV3LnNldERlc2NyaXB0aW9uKCBmYWNlYm9va0Rlc2NyaXB0aW9uICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHR3aXR0ZXJQcmV2aWV3LnNldERlc2NyaXB0aW9uKCAkdHdpdHRlckRlc2NyaXB0aW9uLmF0dHIoIFwicGxhY2Vob2xkZXJcIiApICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFNldCB0aGUgZmFsbGJhY2sgaW1hZ2UgZm9yIHRoZSBwcmV2aWV3IGlmIG5vIGltYWdlIGhhcyBiZWVuIHNldFxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcHJldmlldyBQcmV2aWV3IHRvIHNldCBmYWxsYmFjayBpbWFnZSBvbi5cblx0ICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG5cdGZ1bmN0aW9uIHNldEZhbGxiYWNrSW1hZ2UoIHByZXZpZXcgKSB7XG5cdFx0aWYgKCBwcmV2aWV3LmRhdGEuaW1hZ2VVcmwgPT09IFwiXCIgKSB7XG5cdFx0XHRwcmV2aWV3LnNldEltYWdlKCBnZXRGYWxsYmFja0ltYWdlKCBcIlwiICkgKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ2hhbmdlcyB0aGUgdXBsb2FkIGJ1dHRvbiB2YWx1ZSB3aGVuIHRoZXJlIGFyZSBmYWxsYmFjayBpbWFnZXMgcHJlc2VudC5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGJ1dHRvblByZWZpeCBUaGUgdmFsdWUgYmVmb3JlIHRoZSBpZCBuYW1lLlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCBUaGUgdGV4dCBvbiB0aGUgYnV0dG9uLlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHNldFVwbG9hZEJ1dHRvblZhbHVlKCBidXR0b25QcmVmaXgsIHRleHQgKSB7XG5cdFx0JCggXCIjXCIgICsgYnV0dG9uUHJlZml4ICsgXCItZWRpdG9yLWltYWdlVXJsX2J1dHRvblwiICkuaHRtbCggdGV4dCApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEJpbmQgdGhlIGltYWdlIGV2ZW50cyB0byBzZXQgdGhlIGZhbGxiYWNrIGFuZCByZW5kZXJpbmcgdGhlIHByZXZpZXcuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gYmluZEltYWdlRXZlbnRzKCkge1xuXHRcdGlmICggZ2V0Q3VycmVudFR5cGUoKSA9PT0gXCJwb3N0XCIgKSB7XG5cdFx0XHRiaW5kRmVhdHVyZWRJbWFnZUV2ZW50cygpO1xuXHRcdH1cblxuXHRcdGJpbmRDb250ZW50RXZlbnRzKCk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IHRoZSB0ZXh0IHRoYXQgdGhlIHVwbG9hZCBidXR0b24gbmVlZHMgdG8gZGlzcGxheVxuXHQgKlxuXHQgKiBAcGFyYW0ge09iamVjdH0gcHJldmlldyBQcmV2aWV3IHRvIHJlYWQgaW1hZ2UgZnJvbS5cblx0ICogQHJldHVybnMgeyp9IFRoZSB0ZXh0IGZvciB0aGUgYnV0dG9uLlxuICAgICAqL1xuXHRmdW5jdGlvbiBnZXRVcGxvYWRCdXR0b25UZXh0KCBwcmV2aWV3ICkge1xuXHRcdHJldHVybiBwcmV2aWV3LmRhdGEuaW1hZ2VVcmwgPT09IFwiXCIgPyB5b2FzdFNvY2lhbFByZXZpZXcudXBsb2FkSW1hZ2UgOiB5b2FzdFNvY2lhbFByZXZpZXcudXNlT3RoZXJJbWFnZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBCaW5kcyB0aGUgZXZlbnRzIGZvciB0aGUgZmVhdHVyZWQgaW1hZ2UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gYmluZEZlYXR1cmVkSW1hZ2VFdmVudHMoKSB7XG5cdFx0aWYgKCBpc1VuZGVmaW5lZCggd3AubWVkaWEgKSB8fCBpc1VuZGVmaW5lZCggd3AubWVkaWEuZmVhdHVyZWRJbWFnZSApICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIFdoZW4gdGhlIGZlYXR1cmVkIGltYWdlIGlzIGJlaW5nIGNoYW5nZWRcblx0XHR2YXIgZmVhdHVyZWRJbWFnZSA9IHdwLm1lZGlhLmZlYXR1cmVkSW1hZ2UuZnJhbWUoKTtcblxuXHRcdGZlYXR1cmVkSW1hZ2Uub24oIFwic2VsZWN0XCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGltYWdlRGV0YWlscyA9IGZlYXR1cmVkSW1hZ2Uuc3RhdGUoKS5nZXQoIFwic2VsZWN0aW9uXCIgKS5maXJzdCgpLmF0dHJpYnV0ZXM7XG5cblx0XHRcdGNhblJlYWRGZWF0dXJlZEltYWdlID0gdHJ1ZTtcblxuXHRcdFx0c2V0RmVhdHVyZWRJbWFnZSggaW1hZ2VEZXRhaWxzLnVybCApO1xuXHRcdH0gKTtcblxuXHRcdCQoIFwiI3Bvc3RpbWFnZWRpdlwiICkub24oIFwiY2xpY2tcIiwgXCIjcmVtb3ZlLXBvc3QtdGh1bWJuYWlsXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0Y2FuUmVhZEZlYXR1cmVkSW1hZ2UgPSBmYWxzZTtcblxuXHRcdFx0Y2xlYXJGZWF0dXJlZEltYWdlKCk7XG5cdFx0fSApO1xuXHR9XG5cblx0LyoqXG5cdCAqIEJpbmQgdGhlIGV2ZW50cyBmb3IgdGhlIGNvbnRlbnQuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gYmluZENvbnRlbnRFdmVudHMoKSB7XG5cdFx0Ly8gQmluZCB0aGUgZXZlbnQgd2hlbiBzb21ldGhpbmcgY2hhbmdlZCBpbiB0aGUgdGV4dCBlZGl0b3IuXG5cdFx0dmFyIGNvbnRlbnRFbGVtZW50ID0gJCggXCIjXCIgKyBjb250ZW50VGV4dE5hbWUoKSApO1xuXHRcdGlmICggY29udGVudEVsZW1lbnQubGVuZ3RoID4gMCApIHtcblx0XHRcdGNvbnRlbnRFbGVtZW50Lm9uKCBcImlucHV0XCIsIGRldGVjdEltYWdlRmFsbGJhY2sgKTtcblx0XHR9XG5cblx0XHQvLyBCaW5kIHRoZSBldmVudHMgd2hlbiBzb21ldGhpbmcgY2hhbmdlZCBpbiB0aGUgdGlueU1DRSBlZGl0b3IuXG5cdFx0aWYgKCB0eXBlb2YgdGlueU1DRSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgdGlueU1DRS5vbiA9PT0gXCJmdW5jdGlvblwiICkge1xuXHRcdFx0dmFyIGV2ZW50cyA9IFsgXCJpbnB1dFwiLCBcImNoYW5nZVwiLCBcImN1dFwiLCBcInBhc3RlXCIgXTtcblx0XHRcdHRpbnlNQ0Uub24oIFwiYWRkRWRpdG9yXCIsIGZ1bmN0aW9uKCBlICkge1xuXHRcdFx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyBpKysgKSB7XG5cdFx0XHRcdFx0ZS5lZGl0b3Iub24oIGV2ZW50c1sgaSBdLCBkZXRlY3RJbWFnZUZhbGxiYWNrICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyB0aGUgZmVhdHVyZWQgaW1hZ2UgZmFsbGJhY2sgdmFsdWUgYXMgYW4gZW1wdHkgdmFsdWUgYW5kIHJ1bnMgdGhlIGZhbGxiYWNrIG1ldGhvZC5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBjbGVhckZlYXR1cmVkSW1hZ2UoKSB7XG5cdFx0c2V0RmVhdHVyZWRJbWFnZSggXCJcIiApO1xuXHRcdGRldGVjdEltYWdlRmFsbGJhY2soKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSBpbWFnZSBmYWxsYmFja3MgbGlrZSB0aGUgZmVhdHVyZWQgaW1hZ2UgKGluIGNhc2Ugb2YgYSBwb3N0KSBhbmQgdGhlIGNvbnRlbnQgaW1hZ2UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gZGV0ZWN0SW1hZ2VGYWxsYmFjaygpIHtcblx0XHQvLyBJbiBjYXNlIG9mIGEgcG9zdDogd2Ugd2FudCB0byBoYXZlIHRoZSBmZWF0dXJlZCBpbWFnZS5cblx0XHRpZiAoIGdldEN1cnJlbnRUeXBlKCkgPT09IFwicG9zdFwiICkge1xuXHRcdFx0dmFyIGZlYXR1cmVkSW1hZ2UgPSBnZXRGZWF0dXJlZEltYWdlKCk7XG5cdFx0XHRzZXRGZWF0dXJlZEltYWdlKCBmZWF0dXJlZEltYWdlICk7XG5cblx0XHRcdGlmICggZmVhdHVyZWRJbWFnZSAhPT0gXCJcIiApIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHNldENvbnRlbnRJbWFnZSggZ2V0Q29udGVudEltYWdlKCBmdW5jdGlvbiggaW1hZ2UgKSB7XG5cdFx0XHRzZXRDb250ZW50SW1hZ2UoIGltYWdlICk7XG5cdFx0fSApICk7XG5cdH1cblxuXHQvKipcblx0ICogU2V0cyB0aGUgZmVhdHVyZWQgaW1hZ2UgYmFzZWQgb24gdGhlIGdpdmVuIGltYWdlIFVSTC5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGZlYXR1cmVkSW1hZ2UgVGhlIGltYWdlIHdlIHdhbnQgdG8gc2V0LlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHNldEZlYXR1cmVkSW1hZ2UoIGZlYXR1cmVkSW1hZ2UgKSB7XG5cdFx0aWYgKCBpbWFnZUZhbGxCYWNrLmZlYXR1cmVkICE9PSBmZWF0dXJlZEltYWdlICkge1xuXHRcdFx0aW1hZ2VGYWxsQmFjay5mZWF0dXJlZCA9IGZlYXR1cmVkSW1hZ2U7XG5cblx0XHRcdC8vIEp1c3QgcmVmcmVzaCB0aGUgaW1hZ2UgVVJMLlxuXHRcdFx0JCggXCIuZWRpdGFibGUtcHJldmlld1wiICkudHJpZ2dlciggXCJpbWFnZVVwZGF0ZVwiICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIFNldHMgdGhlIGNvbnRlbnQgaW1hZ2UgYmFzZSBvbiB0aGUgZ2l2ZW4gaW1hZ2UgVVJMXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50SW1hZ2UgVGhlIGltYWdlIHdlIHdhbnQgdG8gc2V0LlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHNldENvbnRlbnRJbWFnZSggY29udGVudEltYWdlICkge1xuXHRcdGlmICggaW1hZ2VGYWxsQmFjay5jb250ZW50ICE9PSBjb250ZW50SW1hZ2UgKSB7XG5cdFx0XHRpbWFnZUZhbGxCYWNrLmNvbnRlbnQgPSBjb250ZW50SW1hZ2U7XG5cblx0XHRcdC8vIEp1c3QgcmVmcmVzaCB0aGUgaW1hZ2UgVVJMLlxuXHRcdFx0JCggXCIuZWRpdGFibGUtcHJldmlld1wiICkudHJpZ2dlciggXCJpbWFnZVVwZGF0ZVwiICk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIGZlYXR1cmVkIGltYWdlIHNvdXJjZSBmcm9tIHRoZSBET00uXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSB1cmwgdG8gdGhlIGZlYXR1cmVkIGltYWdlLlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0RmVhdHVyZWRJbWFnZSgpIHtcblx0XHRpZiAoIGNhblJlYWRGZWF0dXJlZEltYWdlID09PSBmYWxzZSApIHtcblx0XHRcdHJldHVybiBcIlwiO1xuXHRcdH1cblxuXHRcdHZhciBwb3N0VGh1bWJuYWlsID0gJCggXCIuYXR0YWNobWVudC1wb3N0LXRodW1ibmFpbFwiICk7XG5cdFx0aWYgKCBwb3N0VGh1bWJuYWlsLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRyZXR1cm4gJCggcG9zdFRodW1ibmFpbC5nZXQoIDAgKSApLmF0dHIoIFwic3JjXCIgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gXCJcIjtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBpbWFnZSBmcm9tIHRoZSBjb250ZW50LlxuXHQgKlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBmdW5jdGlvbiB0byBjYWxsIGlmIGEgYmlnZ2VyIHNpemUgaXMgYXZhaWxhYmxlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZmlyc3QgaW1hZ2UgZm91bmQgaW4gdGhlIGNvbnRlbnQuXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRDb250ZW50SW1hZ2UoIGNhbGxiYWNrICkge1xuXHRcdHZhciBjb250ZW50ID0gZ2V0Q29udGVudCgpO1xuXG5cdFx0dmFyIGltYWdlcyA9IGdldEltYWdlcyggY29udGVudCApO1xuXHRcdHZhciBpbWFnZSAgPSBcIlwiO1xuXG5cdFx0aWYgKCBpbWFnZXMubGVuZ3RoID09PSAwICkge1xuXHRcdFx0cmV0dXJuIGltYWdlO1xuXHRcdH1cblxuXHRcdGRvIHtcblx0XHRcdHZhciBjdXJyZW50SW1hZ2UgPSBpbWFnZXMuc2hpZnQoKTtcblx0XHRcdGN1cnJlbnRJbWFnZSA9ICQoIGN1cnJlbnRJbWFnZSApO1xuXG5cdFx0XHR2YXIgaW1hZ2VTb3VyY2UgPSBjdXJyZW50SW1hZ2UucHJvcCggXCJzcmNcIiApO1xuXG5cdFx0XHRpZiAoIGltYWdlU291cmNlICkge1xuXHRcdFx0XHRpbWFnZSA9IGltYWdlU291cmNlO1xuXHRcdFx0fVxuXHRcdH0gd2hpbGUgKCBcIlwiID09PSBpbWFnZSAmJiBpbWFnZXMubGVuZ3RoID4gMCApO1xuXG5cdFx0aW1hZ2UgPSBnZXRCaWdnZXJJbWFnZSggaW1hZ2UsIGNhbGxiYWNrICk7XG5cblx0XHRyZXR1cm4gaW1hZ2U7XG5cdH1cblxuXHQvKipcblx0ICogVHJ5IHRvIHJldHJpZXZlIGEgYmlnZ2VyIGltYWdlIGZvciBhIGNlcnRhaW4gaW1hZ2UgZm91bmQgaW4gdGhlIGNvbnRlbnQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSAgIHVybCAgICAgIFRoZSBVUkwgdG8gcmV0cmlldmUuXG5cdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIFRoZSBjYWxsYmFjayB0byBjYWxsIGlmIHRoZXJlIGlzIGEgYmlnZ2VyIGltYWdlLlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBiaWdnZXIgaW1hZ2UgdXJsLlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0QmlnZ2VySW1hZ2UoIHVybCwgY2FsbGJhY2sgKSB7XG5cdFx0aWYgKCBfaGFzKCBiaWdnZXJJbWFnZXMsIHVybCApICkge1xuXHRcdFx0cmV0dXJuIGJpZ2dlckltYWdlc1sgdXJsIF07XG5cdFx0fVxuXG5cdFx0cmV0cmlldmVJbWFnZURhdGFGcm9tVVJMKCB1cmwsIGZ1bmN0aW9uKCBpbWFnZVVybCApIHtcblx0XHRcdGJpZ2dlckltYWdlc1sgdXJsIF0gPSBpbWFnZVVybDtcblxuXHRcdFx0Y2FsbGJhY2soIGltYWdlVXJsICk7XG5cdFx0fSApO1xuXG5cdFx0cmV0dXJuIHVybDtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIGltYWdlIG1ldGFkYXRhIGZyb20gYW4gaW1hZ2UgdXJsIGFuZCBzYXZlcyBpdCB0byB0aGUgaW1hZ2UgbWFuYWdlciBhZnRlcndhcmRzXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIGltYWdlIFVSTCB0byByZXRyaWV2ZSB0aGUgbWV0YWRhdGEgZnJvbS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGJhY2sgdG8gY2FsbCB3aXRoIHRoZSBpbWFnZSBVUkwgcmVzdWx0LlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIHJldHJpZXZlSW1hZ2VEYXRhRnJvbVVSTCggdXJsLCBjYWxsYmFjayApIHtcblx0XHQkLmdldEpTT04oIGFqYXh1cmwsIHtcblx0XHRcdGFjdGlvbjogXCJyZXRyaWV2ZV9pbWFnZV9kYXRhX2Zyb21fdXJsXCIsXG5cdFx0XHRpbWFnZVVSTDogdXJsLFxuXHRcdH0sIGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcdGlmICggXCJzdWNjZXNzXCIgPT09IHJlc3BvbnNlLnN0YXR1cyApIHtcblx0XHRcdFx0Y2FsbGJhY2soIHJlc3BvbnNlLnJlc3VsdCApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBjb250ZW50IGZyb20gY3VycmVudCB2aXNpYmxlIGNvbnRlbnQgZWRpdG9yXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSB2YWx1ZSBvZiB0aGUgdGlueW1jZSBib3guXG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRDb250ZW50KCkge1xuXHRcdGlmICggaXNUaW55TUNFQXZhaWxhYmxlKCkgKSB7XG5cdFx0XHRyZXR1cm4gdGlueU1DRS5nZXQoIGNvbnRlbnRUZXh0TmFtZSgpICkuZ2V0Q29udGVudCgpO1xuXHRcdH1cblxuXHRcdHZhciBjb250ZW50RWxlbWVudCA9ICQoIFwiI1wiICsgY29udGVudFRleHROYW1lKCkgKTtcblx0XHRpZiAoIGNvbnRlbnRFbGVtZW50Lmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRyZXR1cm4gY29udGVudEVsZW1lbnQudmFsKCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIFwiXCI7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2sgaWYgdGlueW1jZSBpcyBhY3RpdmUgb24gdGhlIGN1cnJlbnQgcGFnZS5cblx0ICpcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgd2hlbiB0aW55bWNlIGlzIGF2YWlsYWJsZS5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdGZ1bmN0aW9uIGlzVGlueU1DRUF2YWlsYWJsZSgpIHtcblx0XHRpZiAoIHR5cGVvZiB0aW55TUNFID09PSBcInVuZGVmaW5lZFwiIHx8XG5cdFx0XHR0eXBlb2YgdGlueU1DRS5lZGl0b3JzID09PSBcInVuZGVmaW5lZFwiIHx8XG5cdFx0XHR0aW55TUNFLmVkaXRvcnMubGVuZ3RoID09PSAwIHx8XG5cdFx0XHR0aW55TUNFLmdldCggY29udGVudFRleHROYW1lKCkgKSA9PT0gbnVsbCB8fFxuXHRcdFx0dGlueU1DRS5nZXQoIGNvbnRlbnRUZXh0TmFtZSgpICApLmlzSGlkZGVuKCkgKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2sgaWYgdGhlcmUgaXMgYSBmYWxsYmFjayBpbWFnZSBsaWtlIHRoZSBmZWF0dXJlZCBpbWFnZSBvciB0aGUgZmlyc3QgaW1hZ2UgaW4gdGhlIGNvbnRlbnQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBkZWZhdWx0SW1hZ2UgVGhlIGRlZmF1bHQgaW1hZ2Ugd2hlbiBub3RoaW5nIGhhcyBiZWVuIGZvdW5kLlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgaW1hZ2UgdG8gdXNlLlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0RmFsbGJhY2tJbWFnZSggZGVmYXVsdEltYWdlICkge1xuXHRcdC8vIFR3aXR0ZXIgYWx3YXlzIGZpcnN0IGZhbGxzIGJhY2sgdG8gRmFjZWJvb2tcblx0XHRpZiAoICEgaXNVbmRlZmluZWQoIGZhY2Vib29rUHJldmlldyApICYmIGZhY2Vib29rUHJldmlldy5kYXRhLmltYWdlVXJsICE9PSBcIlwiICkge1xuXHRcdFx0cmV0dXJuIGZhY2Vib29rUHJldmlldy5kYXRhLmltYWdlVXJsO1xuXHRcdH1cblxuXHRcdC8vIEluIGNhc2Ugb2YgYW4gcG9zdDogd2Ugd2FudCB0byBoYXZlIHRoZSBmZWF0dXJlZCBpbWFnZS5cblx0XHRpZiAoIGdldEN1cnJlbnRUeXBlKCkgPT09IFwicG9zdFwiICkge1xuXHRcdFx0aWYgKCBpbWFnZUZhbGxCYWNrLmZlYXR1cmVkICE9PSBcIlwiICkge1xuXHRcdFx0XHRyZXR1cm4gaW1hZ2VGYWxsQmFjay5mZWF0dXJlZDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBXaGVuIHRoZSBmZWF0dXJlZCBpbWFnZSBpcyBlbXB0eSwgdHJ5IGFuIGltYWdlIGluIHRoZSBjb250ZW50XG5cdFx0aWYgKCBpbWFnZUZhbGxCYWNrLmNvbnRlbnQgIT09IFwiXCIgKSB7XG5cdFx0XHRyZXR1cm4gaW1hZ2VGYWxsQmFjay5jb250ZW50O1xuXHRcdH1cblxuXHRcdGlmICggZGVmYXVsdEltYWdlICE9PSB1bmRlZmluZWQgKSB7XG5cdFx0XHRyZXR1cm4gZGVmYXVsdEltYWdlO1xuXHRcdH1cblxuXHRcdHJldHVybiBcIlwiO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFkZHMgdGhlIGhlbHAgcGFuZWxzIHRvIHRoZSBzb2NpYWwgcHJldmlld3Ncblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiBhZGRIZWxwUGFuZWxzKCkge1xuXHRcdHZhciBwYW5lbHMgPSBbXG5cdFx0XHR7XG5cdFx0XHRcdGJlZm9yZUVsZW1lbnQ6IFwiI2ZhY2Vib29rLWVkaXRvci1pbWFnZVVybF9fY2FyZXQtaG9va1wiLFxuXHRcdFx0XHRidXR0b25UZXh0OiB0cmFuc2xhdGlvbnMuaGVscEJ1dHRvbi5mYWNlYm9va0ltYWdlLFxuXHRcdFx0XHRkZXNjcmlwdGlvblRleHQ6IHRyYW5zbGF0aW9ucy5oZWxwLmZhY2Vib29rSW1hZ2UsXG5cdFx0XHRcdGlkOiBcImZhY2Vib29rLWVkaXRvci1pbWFnZS1oZWxwXCIsXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRiZWZvcmVFbGVtZW50OiBcIiNmYWNlYm9vay1lZGl0b3ItdGl0bGVfX2NhcmV0LWhvb2tcIixcblx0XHRcdFx0YnV0dG9uVGV4dDogdHJhbnNsYXRpb25zLmhlbHBCdXR0b24uZmFjZWJvb2tUaXRsZSxcblx0XHRcdFx0ZGVzY3JpcHRpb25UZXh0OiB0cmFuc2xhdGlvbnMuaGVscC5mYWNlYm9va1RpdGxlLFxuXHRcdFx0XHRpZDogXCJmYWNlYm9vay1lZGl0b3ItdGl0bGUtaGVscFwiLFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0YmVmb3JlRWxlbWVudDogXCIjZmFjZWJvb2stZWRpdG9yLWRlc2NyaXB0aW9uX19jYXJldC1ob29rXCIsXG5cdFx0XHRcdGJ1dHRvblRleHQ6IHRyYW5zbGF0aW9ucy5oZWxwQnV0dG9uLmZhY2Vib29rRGVzY3JpcHRpb24sXG5cdFx0XHRcdGRlc2NyaXB0aW9uVGV4dDogdHJhbnNsYXRpb25zLmhlbHAuZmFjZWJvb2tEZXNjcmlwdGlvbixcblx0XHRcdFx0aWQ6IFwiZmFjZWJvb2stZWRpdG9yLWRlc2NyaXB0aW9uLWhlbHBcIixcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGJlZm9yZUVsZW1lbnQ6IFwiI3R3aXR0ZXItZWRpdG9yLWltYWdlVXJsX19jYXJldC1ob29rXCIsXG5cdFx0XHRcdGJ1dHRvblRleHQ6IHRyYW5zbGF0aW9ucy5oZWxwQnV0dG9uLnR3aXR0ZXJJbWFnZSxcblx0XHRcdFx0ZGVzY3JpcHRpb25UZXh0OiB0cmFuc2xhdGlvbnMuaGVscC50d2l0dGVySW1hZ2UsXG5cdFx0XHRcdGlkOiBcInR3aXR0ZXItZWRpdG9yLWltYWdlLWhlbHBcIixcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGJlZm9yZUVsZW1lbnQ6IFwiI3R3aXR0ZXItZWRpdG9yLXRpdGxlX19jYXJldC1ob29rXCIsXG5cdFx0XHRcdGJ1dHRvblRleHQ6IHRyYW5zbGF0aW9ucy5oZWxwQnV0dG9uLnR3aXR0ZXJUaXRsZSxcblx0XHRcdFx0ZGVzY3JpcHRpb25UZXh0OiB0cmFuc2xhdGlvbnMuaGVscC50d2l0dGVyVGl0bGUsXG5cdFx0XHRcdGlkOiBcInR3aXR0ZXItZWRpdG9yLXRpdGxlLWhlbHBcIixcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGJlZm9yZUVsZW1lbnQ6IFwiI3R3aXR0ZXItZWRpdG9yLWRlc2NyaXB0aW9uX19jYXJldC1ob29rXCIsXG5cdFx0XHRcdGJ1dHRvblRleHQ6IHRyYW5zbGF0aW9ucy5oZWxwQnV0dG9uLnR3aXR0ZXJEZXNjcmlwdGlvbixcblx0XHRcdFx0ZGVzY3JpcHRpb25UZXh0OiB0cmFuc2xhdGlvbnMuaGVscC50d2l0dGVyRGVzY3JpcHRpb24sXG5cdFx0XHRcdGlkOiBcInR3aXR0ZXItZWRpdG9yLWRlc2NyaXB0aW9uLWhlbHBcIixcblx0XHRcdH0sXG5cdFx0XTtcblxuXHRcdGZvckVhY2goIHBhbmVscywgZnVuY3Rpb24oIHBhbmVsICkge1xuXHRcdFx0JCggcGFuZWwuYmVmb3JlRWxlbWVudCApLmJlZm9yZShcblx0XHRcdFx0aGVscFBhbmVsLmhlbHBCdXR0b24oIHBhbmVsLmJ1dHRvblRleHQsIHBhbmVsLmlkICkgK1xuXHRcdFx0XHRoZWxwUGFuZWwuaGVscFRleHQoIHBhbmVsLmRlc2NyaXB0aW9uVGV4dCwgcGFuZWwuaWQgKVxuXHRcdFx0KTtcblx0XHR9ICk7XG5cblx0XHQkKCBcIi5zbmlwcGV0LWVkaXRvcl9fZm9ybVwiICkub24oIFwiY2xpY2tcIiwgXCIueW9hc3QtaGVscC1idXR0b25cIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJGJ1dHRvbiA9ICQoIHRoaXMgKSxcblx0XHRcdFx0aGVscFBhbmVsID0gJCggXCIjXCIgKyAkYnV0dG9uLmF0dHIoIFwiYXJpYS1jb250cm9sc1wiICkgKSxcblx0XHRcdFx0aXNQYW5lbFZpc2libGUgPSBoZWxwUGFuZWwuaXMoIFwiOnZpc2libGVcIiApO1xuXG5cdFx0XHQkKCBoZWxwUGFuZWwgKS5zbGlkZVRvZ2dsZSggMjAwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0JGJ1dHRvbi5hdHRyKCBcImFyaWEtZXhwYW5kZWRcIiwgISBpc1BhbmVsVmlzaWJsZSApO1xuXHRcdFx0fSApO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGRzIGxpYnJhcnkgdHJhbnNsYXRpb25zXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSB0cmFuc2xhdGlvbnMgVGhlIHRyYW5zbGF0aW9ucyB0byB1c2UuXG5cdCAqIEByZXR1cm5zIHtPYmplY3R9IHRyYW5zbGF0aW9ucyBtYXBwZWQgdG8gdGhlIHByb3BlciBkb21haW4uXG5cdCAqL1xuXHRmdW5jdGlvbiBhZGRMaWJyYXJ5VHJhbnNsYXRpb25zKCB0cmFuc2xhdGlvbnMgKSB7XG5cdFx0aWYgKCB0eXBlb2YgdHJhbnNsYXRpb25zICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiB0cmFuc2xhdGlvbnMuZG9tYWluICE9PSBcInVuZGVmaW5lZFwiICkge1xuXHRcdFx0dHJhbnNsYXRpb25zLmRvbWFpbiA9IFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCI7XG5cdFx0XHR0cmFuc2xhdGlvbnMubG9jYWxlX2RhdGFbIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIgXSA9IGNsb25lKCB0cmFuc2xhdGlvbnMubG9jYWxlX2RhdGFbIFwid29yZHByZXNzLXNlby1wcmVtaXVtXCIgXSApO1xuXG5cdFx0XHRkZWxldGUoIHRyYW5zbGF0aW9ucy5sb2NhbGVfZGF0YVsgXCJ3b3JkcHJlc3Mtc2VvLXByZW1pdW1cIiBdICk7XG5cblx0XHRcdHJldHVybiB0cmFuc2xhdGlvbnM7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGRvbWFpbjogXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIixcblx0XHRcdGxvY2FsZV9kYXRhOiB7XG5cdFx0XHRcdFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCI6IHtcblx0XHRcdFx0XHRcIlwiOiB7fSxcblx0XHRcdFx0fSxcblx0XHRcdH0sXG5cdFx0fTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXplIHRoZSBzb2NpYWwgcHJldmlld3MuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gaW5pdFlvYXN0U29jaWFsUHJldmlld3MoKSB7XG5cdFx0dmFyIGZhY2Vib29rSG9sZGVyID0gJCggXCIjd3BzZW9fZmFjZWJvb2tcIiApO1xuXHRcdHZhciB0d2l0dGVySG9sZGVyID0gJCggXCIjd3BzZW9fdHdpdHRlclwiICk7XG5cblx0XHRpZiAoIGZhY2Vib29rSG9sZGVyLmxlbmd0aCA+IDAgfHwgdHdpdHRlckhvbGRlci5sZW5ndGggPiAwICkge1xuXHRcdFx0alF1ZXJ5KCB3aW5kb3cgKS5vbiggXCJZb2FzdFNFTzpyZWFkeVwiLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0ZGV0ZWN0SW1hZ2VGYWxsYmFjaygpO1xuXG5cdFx0XHRcdGlmICggZmFjZWJvb2tIb2xkZXIubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRpbml0RmFjZWJvb2soIGZhY2Vib29rSG9sZGVyICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoIHR3aXR0ZXJIb2xkZXIubGVuZ3RoID4gMCApIHtcblx0XHRcdFx0XHRpbml0VHdpdHRlciggdHdpdHRlckhvbGRlciApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0YWRkSGVscFBhbmVscygpO1xuXHRcdFx0XHRiaW5kSW1hZ2VFdmVudHMoKTtcblx0XHRcdH0gKTtcblx0XHR9XG5cdH1cblxuXHQkKCBpbml0WW9hc3RTb2NpYWxQcmV2aWV3cyApO1xufSggalF1ZXJ5ICkgKTtcbiIsIi8qKlxuICogQHByZXNlcnZlIGplZC5qcyBodHRwczovL2dpdGh1Yi5jb20vU2xleEF4dG9uL0plZFxuICovXG4vKlxuLS0tLS0tLS0tLS1cbkEgZ2V0dGV4dCBjb21wYXRpYmxlIGkxOG4gbGlicmFyeSBmb3IgbW9kZXJuIEphdmFTY3JpcHQgQXBwbGljYXRpb25zXG5cbmJ5IEFsZXggU2V4dG9uIC0gQWxleFNleHRvbiBbYXRdIGdtYWlsIC0gQFNsZXhBeHRvblxuXG5NSVQgTGljZW5zZVxuXG5BIGpRdWVyeSBGb3VuZGF0aW9uIHByb2plY3QgLSByZXF1aXJlcyBDTEEgdG8gY29udHJpYnV0ZSAtXG5odHRwczovL2NvbnRyaWJ1dGUuanF1ZXJ5Lm9yZy9DTEEvXG5cblxuXG5KZWQgb2ZmZXJzIHRoZSBlbnRpcmUgYXBwbGljYWJsZSBHTlUgZ2V0dGV4dCBzcGVjJ2Qgc2V0IG9mXG5mdW5jdGlvbnMsIGJ1dCBhbHNvIG9mZmVycyBzb21lIG5pY2VyIHdyYXBwZXJzIGFyb3VuZCB0aGVtLlxuVGhlIGFwaSBmb3IgZ2V0dGV4dCB3YXMgd3JpdHRlbiBmb3IgYSBsYW5ndWFnZSB3aXRoIG5vIGZ1bmN0aW9uXG5vdmVybG9hZGluZywgc28gSmVkIGFsbG93cyBhIGxpdHRsZSBtb3JlIG9mIHRoYXQuXG5cbk1hbnkgdGhhbmtzIHRvIEpvc2h1YSBJLiBNaWxsZXIgLSB1bnJ0c3RAY3Bhbi5vcmcgLSB3aG8gd3JvdGVcbmdldHRleHQuanMgYmFjayBpbiAyMDA4LiBJIHdhcyBhYmxlIHRvIHZldCBhIGxvdCBvZiBteSBpZGVhc1xuYWdhaW5zdCBoaXMuIEkgYWxzbyBtYWRlIHN1cmUgSmVkIHBhc3NlZCBhZ2FpbnN0IGhpcyB0ZXN0c1xuaW4gb3JkZXIgdG8gb2ZmZXIgZWFzeSB1cGdyYWRlcyAtLSBqc2dldHRleHQuYmVybGlvcy5kZVxuKi9cbihmdW5jdGlvbiAocm9vdCwgdW5kZWYpIHtcblxuICAvLyBTZXQgdXAgc29tZSB1bmRlcnNjb3JlLXN0eWxlIGZ1bmN0aW9ucywgaWYgeW91IGFscmVhZHkgaGF2ZVxuICAvLyB1bmRlcnNjb3JlLCBmZWVsIGZyZWUgdG8gZGVsZXRlIHRoaXMgc2VjdGlvbiwgYW5kIHVzZSBpdFxuICAvLyBkaXJlY3RseSwgaG93ZXZlciwgdGhlIGFtb3VudCBvZiBmdW5jdGlvbnMgdXNlZCBkb2Vzbid0XG4gIC8vIHdhcnJhbnQgaGF2aW5nIHVuZGVyc2NvcmUgYXMgYSBmdWxsIGRlcGVuZGVuY3kuXG4gIC8vIFVuZGVyc2NvcmUgMS4zLjAgd2FzIHVzZWQgdG8gcG9ydCBhbmQgaXMgbGljZW5zZWRcbiAgLy8gdW5kZXIgdGhlIE1JVCBMaWNlbnNlIGJ5IEplcmVteSBBc2hrZW5hcy5cbiAgdmFyIEFycmF5UHJvdG8gICAgPSBBcnJheS5wcm90b3R5cGUsXG4gICAgICBPYmpQcm90byAgICAgID0gT2JqZWN0LnByb3RvdHlwZSxcbiAgICAgIHNsaWNlICAgICAgICAgPSBBcnJheVByb3RvLnNsaWNlLFxuICAgICAgaGFzT3duUHJvcCAgICA9IE9ialByb3RvLmhhc093blByb3BlcnR5LFxuICAgICAgbmF0aXZlRm9yRWFjaCA9IEFycmF5UHJvdG8uZm9yRWFjaCxcbiAgICAgIGJyZWFrZXIgICAgICAgPSB7fTtcblxuICAvLyBXZSdyZSBub3QgdXNpbmcgdGhlIE9PUCBzdHlsZSBfIHNvIHdlIGRvbid0IG5lZWQgdGhlXG4gIC8vIGV4dHJhIGxldmVsIG9mIGluZGlyZWN0aW9uLiBUaGlzIHN0aWxsIG1lYW5zIHRoYXQgeW91XG4gIC8vIHN1YiBvdXQgZm9yIHJlYWwgYF9gIHRob3VnaC5cbiAgdmFyIF8gPSB7XG4gICAgZm9yRWFjaCA6IGZ1bmN0aW9uKCBvYmosIGl0ZXJhdG9yLCBjb250ZXh0ICkge1xuICAgICAgdmFyIGksIGwsIGtleTtcbiAgICAgIGlmICggb2JqID09PSBudWxsICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICggbmF0aXZlRm9yRWFjaCAmJiBvYmouZm9yRWFjaCA9PT0gbmF0aXZlRm9yRWFjaCApIHtcbiAgICAgICAgb2JqLmZvckVhY2goIGl0ZXJhdG9yLCBjb250ZXh0ICk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICggb2JqLmxlbmd0aCA9PT0gK29iai5sZW5ndGggKSB7XG4gICAgICAgIGZvciAoIGkgPSAwLCBsID0gb2JqLmxlbmd0aDsgaSA8IGw7IGkrKyApIHtcbiAgICAgICAgICBpZiAoIGkgaW4gb2JqICYmIGl0ZXJhdG9yLmNhbGwoIGNvbnRleHQsIG9ialtpXSwgaSwgb2JqICkgPT09IGJyZWFrZXIgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZm9yICgga2V5IGluIG9iaikge1xuICAgICAgICAgIGlmICggaGFzT3duUHJvcC5jYWxsKCBvYmosIGtleSApICkge1xuICAgICAgICAgICAgaWYgKCBpdGVyYXRvci5jYWxsIChjb250ZXh0LCBvYmpba2V5XSwga2V5LCBvYmogKSA9PT0gYnJlYWtlciApIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgZXh0ZW5kIDogZnVuY3Rpb24oIG9iaiApIHtcbiAgICAgIHRoaXMuZm9yRWFjaCggc2xpY2UuY2FsbCggYXJndW1lbnRzLCAxICksIGZ1bmN0aW9uICggc291cmNlICkge1xuICAgICAgICBmb3IgKCB2YXIgcHJvcCBpbiBzb3VyY2UgKSB7XG4gICAgICAgICAgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICB9O1xuICAvLyBFTkQgTWluaWF0dXJlIHVuZGVyc2NvcmUgaW1wbFxuXG4gIC8vIEplZCBpcyBhIGNvbnN0cnVjdG9yIGZ1bmN0aW9uXG4gIHZhciBKZWQgPSBmdW5jdGlvbiAoIG9wdGlvbnMgKSB7XG4gICAgLy8gU29tZSBtaW5pbWFsIGRlZmF1bHRzXG4gICAgdGhpcy5kZWZhdWx0cyA9IHtcbiAgICAgIFwibG9jYWxlX2RhdGFcIiA6IHtcbiAgICAgICAgXCJtZXNzYWdlc1wiIDoge1xuICAgICAgICAgIFwiXCIgOiB7XG4gICAgICAgICAgICBcImRvbWFpblwiICAgICAgIDogXCJtZXNzYWdlc1wiLFxuICAgICAgICAgICAgXCJsYW5nXCIgICAgICAgICA6IFwiZW5cIixcbiAgICAgICAgICAgIFwicGx1cmFsX2Zvcm1zXCIgOiBcIm5wbHVyYWxzPTI7IHBsdXJhbD0obiAhPSAxKTtcIlxuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBUaGVyZSBhcmUgbm8gZGVmYXVsdCBrZXlzLCB0aG91Z2hcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIFRoZSBkZWZhdWx0IGRvbWFpbiBpZiBvbmUgaXMgbWlzc2luZ1xuICAgICAgXCJkb21haW5cIiA6IFwibWVzc2FnZXNcIixcbiAgICAgIC8vIGVuYWJsZSBkZWJ1ZyBtb2RlIHRvIGxvZyB1bnRyYW5zbGF0ZWQgc3RyaW5ncyB0byB0aGUgY29uc29sZVxuICAgICAgXCJkZWJ1Z1wiIDogZmFsc2VcbiAgICB9O1xuXG4gICAgLy8gTWl4IGluIHRoZSBzZW50IG9wdGlvbnMgd2l0aCB0aGUgZGVmYXVsdCBvcHRpb25zXG4gICAgdGhpcy5vcHRpb25zID0gXy5leHRlbmQoIHt9LCB0aGlzLmRlZmF1bHRzLCBvcHRpb25zICk7XG4gICAgdGhpcy50ZXh0ZG9tYWluKCB0aGlzLm9wdGlvbnMuZG9tYWluICk7XG5cbiAgICBpZiAoIG9wdGlvbnMuZG9tYWluICYmICEgdGhpcy5vcHRpb25zLmxvY2FsZV9kYXRhWyB0aGlzLm9wdGlvbnMuZG9tYWluIF0gKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RleHQgZG9tYWluIHNldCB0byBub24tZXhpc3RlbnQgZG9tYWluOiBgJyArIG9wdGlvbnMuZG9tYWluICsgJ2AnKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gVGhlIGdldHRleHQgc3BlYyBzZXRzIHRoaXMgY2hhcmFjdGVyIGFzIHRoZSBkZWZhdWx0XG4gIC8vIGRlbGltaXRlciBmb3IgY29udGV4dCBsb29rdXBzLlxuICAvLyBlLmcuOiBjb250ZXh0XFx1MDAwNGtleVxuICAvLyBJZiB5b3VyIHRyYW5zbGF0aW9uIGNvbXBhbnkgdXNlcyBzb21ldGhpbmcgZGlmZmVyZW50LFxuICAvLyBqdXN0IGNoYW5nZSB0aGlzIGF0IGFueSB0aW1lIGFuZCBpdCB3aWxsIHVzZSB0aGF0IGluc3RlYWQuXG4gIEplZC5jb250ZXh0X2RlbGltaXRlciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoIDQgKTtcblxuICBmdW5jdGlvbiBnZXRQbHVyYWxGb3JtRnVuYyAoIHBsdXJhbF9mb3JtX3N0cmluZyApIHtcbiAgICByZXR1cm4gSmVkLlBGLmNvbXBpbGUoIHBsdXJhbF9mb3JtX3N0cmluZyB8fCBcIm5wbHVyYWxzPTI7IHBsdXJhbD0obiAhPSAxKTtcIik7XG4gIH1cblxuICBmdW5jdGlvbiBDaGFpbigga2V5LCBpMThuICl7XG4gICAgdGhpcy5fa2V5ID0ga2V5O1xuICAgIHRoaXMuX2kxOG4gPSBpMThuO1xuICB9XG5cbiAgLy8gQ3JlYXRlIGEgY2hhaW5hYmxlIGFwaSBmb3IgYWRkaW5nIGFyZ3MgcHJldHRpbHlcbiAgXy5leHRlbmQoIENoYWluLnByb3RvdHlwZSwge1xuICAgIG9uRG9tYWluIDogZnVuY3Rpb24gKCBkb21haW4gKSB7XG4gICAgICB0aGlzLl9kb21haW4gPSBkb21haW47XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIHdpdGhDb250ZXh0IDogZnVuY3Rpb24gKCBjb250ZXh0ICkge1xuICAgICAgdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGlmUGx1cmFsIDogZnVuY3Rpb24gKCBudW0sIHBrZXkgKSB7XG4gICAgICB0aGlzLl92YWwgPSBudW07XG4gICAgICB0aGlzLl9wa2V5ID0gcGtleTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG4gICAgZmV0Y2ggOiBmdW5jdGlvbiAoIHNBcnIgKSB7XG4gICAgICBpZiAoIHt9LnRvU3RyaW5nLmNhbGwoIHNBcnIgKSAhPSAnW29iamVjdCBBcnJheV0nICkge1xuICAgICAgICBzQXJyID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDApO1xuICAgICAgfVxuICAgICAgcmV0dXJuICggc0FyciAmJiBzQXJyLmxlbmd0aCA/IEplZC5zcHJpbnRmIDogZnVuY3Rpb24oeCl7IHJldHVybiB4OyB9ICkoXG4gICAgICAgIHRoaXMuX2kxOG4uZGNucGdldHRleHQodGhpcy5fZG9tYWluLCB0aGlzLl9jb250ZXh0LCB0aGlzLl9rZXksIHRoaXMuX3BrZXksIHRoaXMuX3ZhbCksXG4gICAgICAgIHNBcnJcbiAgICAgICk7XG4gICAgfVxuICB9KTtcblxuICAvLyBBZGQgZnVuY3Rpb25zIHRvIHRoZSBKZWQgcHJvdG90eXBlLlxuICAvLyBUaGVzZSB3aWxsIGJlIHRoZSBmdW5jdGlvbnMgb24gdGhlIG9iamVjdCB0aGF0J3MgcmV0dXJuZWRcbiAgLy8gZnJvbSBjcmVhdGluZyBhIGBuZXcgSmVkKClgXG4gIC8vIFRoZXNlIHNlZW0gcmVkdW5kYW50LCBidXQgdGhleSBnemlwIHByZXR0eSB3ZWxsLlxuICBfLmV4dGVuZCggSmVkLnByb3RvdHlwZSwge1xuICAgIC8vIFRoZSBzZXhpZXIgYXBpIHN0YXJ0IHBvaW50XG4gICAgdHJhbnNsYXRlIDogZnVuY3Rpb24gKCBrZXkgKSB7XG4gICAgICByZXR1cm4gbmV3IENoYWluKCBrZXksIHRoaXMgKTtcbiAgICB9LFxuXG4gICAgdGV4dGRvbWFpbiA6IGZ1bmN0aW9uICggZG9tYWluICkge1xuICAgICAgaWYgKCAhIGRvbWFpbiApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RleHRkb21haW47XG4gICAgICB9XG4gICAgICB0aGlzLl90ZXh0ZG9tYWluID0gZG9tYWluO1xuICAgIH0sXG5cbiAgICBnZXR0ZXh0IDogZnVuY3Rpb24gKCBrZXkgKSB7XG4gICAgICByZXR1cm4gdGhpcy5kY25wZ2V0dGV4dC5jYWxsKCB0aGlzLCB1bmRlZiwgdW5kZWYsIGtleSApO1xuICAgIH0sXG5cbiAgICBkZ2V0dGV4dCA6IGZ1bmN0aW9uICggZG9tYWluLCBrZXkgKSB7XG4gICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIGRvbWFpbiwgdW5kZWYsIGtleSApO1xuICAgIH0sXG5cbiAgICBkY2dldHRleHQgOiBmdW5jdGlvbiAoIGRvbWFpbiAsIGtleSAvKiwgY2F0ZWdvcnkgKi8gKSB7XG4gICAgICAvLyBJZ25vcmVzIHRoZSBjYXRlZ29yeSBhbnl3YXlzXG4gICAgICByZXR1cm4gdGhpcy5kY25wZ2V0dGV4dC5jYWxsKCB0aGlzLCBkb21haW4sIHVuZGVmLCBrZXkgKTtcbiAgICB9LFxuXG4gICAgbmdldHRleHQgOiBmdW5jdGlvbiAoIHNrZXksIHBrZXksIHZhbCApIHtcbiAgICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIHVuZGVmLCB1bmRlZiwgc2tleSwgcGtleSwgdmFsICk7XG4gICAgfSxcblxuICAgIGRuZ2V0dGV4dCA6IGZ1bmN0aW9uICggZG9tYWluLCBza2V5LCBwa2V5LCB2YWwgKSB7XG4gICAgICByZXR1cm4gdGhpcy5kY25wZ2V0dGV4dC5jYWxsKCB0aGlzLCBkb21haW4sIHVuZGVmLCBza2V5LCBwa2V5LCB2YWwgKTtcbiAgICB9LFxuXG4gICAgZGNuZ2V0dGV4dCA6IGZ1bmN0aW9uICggZG9tYWluLCBza2V5LCBwa2V5LCB2YWwvKiwgY2F0ZWdvcnkgKi8pIHtcbiAgICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIGRvbWFpbiwgdW5kZWYsIHNrZXksIHBrZXksIHZhbCApO1xuICAgIH0sXG5cbiAgICBwZ2V0dGV4dCA6IGZ1bmN0aW9uICggY29udGV4dCwga2V5ICkge1xuICAgICAgcmV0dXJuIHRoaXMuZGNucGdldHRleHQuY2FsbCggdGhpcywgdW5kZWYsIGNvbnRleHQsIGtleSApO1xuICAgIH0sXG5cbiAgICBkcGdldHRleHQgOiBmdW5jdGlvbiAoIGRvbWFpbiwgY29udGV4dCwga2V5ICkge1xuICAgICAgcmV0dXJuIHRoaXMuZGNucGdldHRleHQuY2FsbCggdGhpcywgZG9tYWluLCBjb250ZXh0LCBrZXkgKTtcbiAgICB9LFxuXG4gICAgZGNwZ2V0dGV4dCA6IGZ1bmN0aW9uICggZG9tYWluLCBjb250ZXh0LCBrZXkvKiwgY2F0ZWdvcnkgKi8pIHtcbiAgICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIGRvbWFpbiwgY29udGV4dCwga2V5ICk7XG4gICAgfSxcblxuICAgIG5wZ2V0dGV4dCA6IGZ1bmN0aW9uICggY29udGV4dCwgc2tleSwgcGtleSwgdmFsICkge1xuICAgICAgcmV0dXJuIHRoaXMuZGNucGdldHRleHQuY2FsbCggdGhpcywgdW5kZWYsIGNvbnRleHQsIHNrZXksIHBrZXksIHZhbCApO1xuICAgIH0sXG5cbiAgICBkbnBnZXR0ZXh0IDogZnVuY3Rpb24gKCBkb21haW4sIGNvbnRleHQsIHNrZXksIHBrZXksIHZhbCApIHtcbiAgICAgIHJldHVybiB0aGlzLmRjbnBnZXR0ZXh0LmNhbGwoIHRoaXMsIGRvbWFpbiwgY29udGV4dCwgc2tleSwgcGtleSwgdmFsICk7XG4gICAgfSxcblxuICAgIC8vIFRoZSBtb3N0IGZ1bGx5IHF1YWxpZmllZCBnZXR0ZXh0IGZ1bmN0aW9uLiBJdCBoYXMgZXZlcnkgb3B0aW9uLlxuICAgIC8vIFNpbmNlIGl0IGhhcyBldmVyeSBvcHRpb24sIHdlIGNhbiB1c2UgaXQgZnJvbSBldmVyeSBvdGhlciBtZXRob2QuXG4gICAgLy8gVGhpcyBpcyB0aGUgYnJlYWQgYW5kIGJ1dHRlci5cbiAgICAvLyBUZWNobmljYWxseSB0aGVyZSBzaG91bGQgYmUgb25lIG1vcmUgYXJndW1lbnQgaW4gdGhpcyBmdW5jdGlvbiBmb3IgJ0NhdGVnb3J5JyxcbiAgICAvLyBidXQgc2luY2Ugd2UgbmV2ZXIgdXNlIGl0LCB3ZSBtaWdodCBhcyB3ZWxsIG5vdCB3YXN0ZSB0aGUgYnl0ZXMgdG8gZGVmaW5lIGl0LlxuICAgIGRjbnBnZXR0ZXh0IDogZnVuY3Rpb24gKCBkb21haW4sIGNvbnRleHQsIHNpbmd1bGFyX2tleSwgcGx1cmFsX2tleSwgdmFsICkge1xuICAgICAgLy8gU2V0IHNvbWUgZGVmYXVsdHNcblxuICAgICAgcGx1cmFsX2tleSA9IHBsdXJhbF9rZXkgfHwgc2luZ3VsYXJfa2V5O1xuXG4gICAgICAvLyBVc2UgdGhlIGdsb2JhbCBkb21haW4gZGVmYXVsdCBpZiBvbmVcbiAgICAgIC8vIGlzbid0IGV4cGxpY2l0bHkgcGFzc2VkIGluXG4gICAgICBkb21haW4gPSBkb21haW4gfHwgdGhpcy5fdGV4dGRvbWFpbjtcblxuICAgICAgdmFyIGZhbGxiYWNrO1xuXG4gICAgICAvLyBIYW5kbGUgc3BlY2lhbCBjYXNlc1xuXG4gICAgICAvLyBObyBvcHRpb25zIGZvdW5kXG4gICAgICBpZiAoICEgdGhpcy5vcHRpb25zICkge1xuICAgICAgICAvLyBUaGVyZSdzIGxpa2VseSBzb21ldGhpbmcgd3JvbmcsIGJ1dCB3ZSdsbCByZXR1cm4gdGhlIGNvcnJlY3Qga2V5IGZvciBlbmdsaXNoXG4gICAgICAgIC8vIFdlIGRvIHRoaXMgYnkgaW5zdGFudGlhdGluZyBhIGJyYW5kIG5ldyBKZWQgaW5zdGFuY2Ugd2l0aCB0aGUgZGVmYXVsdCBzZXRcbiAgICAgICAgLy8gZm9yIGV2ZXJ5dGhpbmcgdGhhdCBjb3VsZCBiZSBicm9rZW4uXG4gICAgICAgIGZhbGxiYWNrID0gbmV3IEplZCgpO1xuICAgICAgICByZXR1cm4gZmFsbGJhY2suZGNucGdldHRleHQuY2FsbCggZmFsbGJhY2ssIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBzaW5ndWxhcl9rZXksIHBsdXJhbF9rZXksIHZhbCApO1xuICAgICAgfVxuXG4gICAgICAvLyBObyB0cmFuc2xhdGlvbiBkYXRhIHByb3ZpZGVkXG4gICAgICBpZiAoICEgdGhpcy5vcHRpb25zLmxvY2FsZV9kYXRhICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGxvY2FsZSBkYXRhIHByb3ZpZGVkLicpO1xuICAgICAgfVxuXG4gICAgICBpZiAoICEgdGhpcy5vcHRpb25zLmxvY2FsZV9kYXRhWyBkb21haW4gXSApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEb21haW4gYCcgKyBkb21haW4gKyAnYCB3YXMgbm90IGZvdW5kLicpO1xuICAgICAgfVxuXG4gICAgICBpZiAoICEgdGhpcy5vcHRpb25zLmxvY2FsZV9kYXRhWyBkb21haW4gXVsgXCJcIiBdICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGxvY2FsZSBtZXRhIGluZm9ybWF0aW9uIHByb3ZpZGVkLicpO1xuICAgICAgfVxuXG4gICAgICAvLyBNYWtlIHN1cmUgd2UgaGF2ZSBhIHRydXRoeSBrZXkuIE90aGVyd2lzZSB3ZSBtaWdodCBzdGFydCBsb29raW5nXG4gICAgICAvLyBpbnRvIHRoZSBlbXB0eSBzdHJpbmcga2V5LCB3aGljaCBpcyB0aGUgb3B0aW9ucyBmb3IgdGhlIGxvY2FsZVxuICAgICAgLy8gZGF0YS5cbiAgICAgIGlmICggISBzaW5ndWxhcl9rZXkgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gdHJhbnNsYXRpb24ga2V5IGZvdW5kLicpO1xuICAgICAgfVxuXG4gICAgICB2YXIga2V5ICA9IGNvbnRleHQgPyBjb250ZXh0ICsgSmVkLmNvbnRleHRfZGVsaW1pdGVyICsgc2luZ3VsYXJfa2V5IDogc2luZ3VsYXJfa2V5LFxuICAgICAgICAgIGxvY2FsZV9kYXRhID0gdGhpcy5vcHRpb25zLmxvY2FsZV9kYXRhLFxuICAgICAgICAgIGRpY3QgPSBsb2NhbGVfZGF0YVsgZG9tYWluIF0sXG4gICAgICAgICAgZGVmYXVsdENvbmYgPSAobG9jYWxlX2RhdGEubWVzc2FnZXMgfHwgdGhpcy5kZWZhdWx0cy5sb2NhbGVfZGF0YS5tZXNzYWdlcylbXCJcIl0sXG4gICAgICAgICAgcGx1cmFsRm9ybXMgPSBkaWN0W1wiXCJdLnBsdXJhbF9mb3JtcyB8fCBkaWN0W1wiXCJdW1wiUGx1cmFsLUZvcm1zXCJdIHx8IGRpY3RbXCJcIl1bXCJwbHVyYWwtZm9ybXNcIl0gfHwgZGVmYXVsdENvbmYucGx1cmFsX2Zvcm1zIHx8IGRlZmF1bHRDb25mW1wiUGx1cmFsLUZvcm1zXCJdIHx8IGRlZmF1bHRDb25mW1wicGx1cmFsLWZvcm1zXCJdLFxuICAgICAgICAgIHZhbF9saXN0LFxuICAgICAgICAgIHJlcztcblxuICAgICAgdmFyIHZhbF9pZHg7XG4gICAgICBpZiAodmFsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gTm8gdmFsdWUgcGFzc2VkIGluOyBhc3N1bWUgc2luZ3VsYXIga2V5IGxvb2t1cC5cbiAgICAgICAgdmFsX2lkeCA9IDA7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFZhbHVlIGhhcyBiZWVuIHBhc3NlZCBpbjsgdXNlIHBsdXJhbC1mb3JtcyBjYWxjdWxhdGlvbnMuXG5cbiAgICAgICAgLy8gSGFuZGxlIGludmFsaWQgbnVtYmVycywgYnV0IHRyeSBjYXN0aW5nIHN0cmluZ3MgZm9yIGdvb2QgbWVhc3VyZVxuICAgICAgICBpZiAoIHR5cGVvZiB2YWwgIT0gJ251bWJlcicgKSB7XG4gICAgICAgICAgdmFsID0gcGFyc2VJbnQoIHZhbCwgMTAgKTtcblxuICAgICAgICAgIGlmICggaXNOYU4oIHZhbCApICkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgbnVtYmVyIHRoYXQgd2FzIHBhc3NlZCBpbiBpcyBub3QgYSBudW1iZXIuJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFsX2lkeCA9IGdldFBsdXJhbEZvcm1GdW5jKHBsdXJhbEZvcm1zKSh2YWwpO1xuICAgICAgfVxuXG4gICAgICAvLyBUaHJvdyBhbiBlcnJvciBpZiBhIGRvbWFpbiBpc24ndCBmb3VuZFxuICAgICAgaWYgKCAhIGRpY3QgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gZG9tYWluIG5hbWVkIGAnICsgZG9tYWluICsgJ2AgY291bGQgYmUgZm91bmQuJyk7XG4gICAgICB9XG5cbiAgICAgIHZhbF9saXN0ID0gZGljdFsga2V5IF07XG5cbiAgICAgIC8vIElmIHRoZXJlIGlzIG5vIG1hdGNoLCB0aGVuIHJldmVydCBiYWNrIHRvXG4gICAgICAvLyBlbmdsaXNoIHN0eWxlIHNpbmd1bGFyL3BsdXJhbCB3aXRoIHRoZSBrZXlzIHBhc3NlZCBpbi5cbiAgICAgIGlmICggISB2YWxfbGlzdCB8fCB2YWxfaWR4ID4gdmFsX2xpc3QubGVuZ3RoICkge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLm1pc3Npbmdfa2V5X2NhbGxiYWNrKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLm1pc3Npbmdfa2V5X2NhbGxiYWNrKGtleSwgZG9tYWluKTtcbiAgICAgICAgfVxuICAgICAgICByZXMgPSBbIHNpbmd1bGFyX2tleSwgcGx1cmFsX2tleSBdO1xuXG4gICAgICAgIC8vIGNvbGxlY3QgdW50cmFuc2xhdGVkIHN0cmluZ3NcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5kZWJ1Zz09PXRydWUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXNbIGdldFBsdXJhbEZvcm1GdW5jKHBsdXJhbEZvcm1zKSggdmFsICkgXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc1sgZ2V0UGx1cmFsRm9ybUZ1bmMoKSggdmFsICkgXTtcbiAgICAgIH1cblxuICAgICAgcmVzID0gdmFsX2xpc3RbIHZhbF9pZHggXTtcblxuICAgICAgLy8gVGhpcyBpbmNsdWRlcyBlbXB0eSBzdHJpbmdzIG9uIHB1cnBvc2VcbiAgICAgIGlmICggISByZXMgICkge1xuICAgICAgICByZXMgPSBbIHNpbmd1bGFyX2tleSwgcGx1cmFsX2tleSBdO1xuICAgICAgICByZXR1cm4gcmVzWyBnZXRQbHVyYWxGb3JtRnVuYygpKCB2YWwgKSBdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlcztcbiAgICB9XG4gIH0pO1xuXG5cbiAgLy8gV2UgYWRkIGluIHNwcmludGYgY2FwYWJpbGl0aWVzIGZvciBwb3N0IHRyYW5zbGF0aW9uIHZhbHVlIGludGVyb2xhdGlvblxuICAvLyBUaGlzIGlzIG5vdCBpbnRlcm5hbGx5IHVzZWQsIHNvIHlvdSBjYW4gcmVtb3ZlIGl0IGlmIHlvdSBoYXZlIHRoaXNcbiAgLy8gYXZhaWxhYmxlIHNvbWV3aGVyZSBlbHNlLCBvciB3YW50IHRvIHVzZSBhIGRpZmZlcmVudCBzeXN0ZW0uXG5cbiAgLy8gV2UgX3NsaWdodGx5XyBtb2RpZnkgdGhlIG5vcm1hbCBzcHJpbnRmIGJlaGF2aW9yIHRvIG1vcmUgZ3JhY2VmdWxseSBoYW5kbGVcbiAgLy8gdW5kZWZpbmVkIHZhbHVlcy5cblxuICAvKipcbiAgIHNwcmludGYoKSBmb3IgSmF2YVNjcmlwdCAwLjctYmV0YTFcbiAgIGh0dHA6Ly93d3cuZGl2ZWludG9qYXZhc2NyaXB0LmNvbS9wcm9qZWN0cy9qYXZhc2NyaXB0LXNwcmludGZcblxuICAgQ29weXJpZ2h0IChjKSBBbGV4YW5kcnUgTWFyYXN0ZWFudSA8YWxleGFob2xpYyBbYXQpIGdtYWlsIChkb3RdIGNvbT5cbiAgIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG5cbiAgIFJlZGlzdHJpYnV0aW9uIGFuZCB1c2UgaW4gc291cmNlIGFuZCBiaW5hcnkgZm9ybXMsIHdpdGggb3Igd2l0aG91dFxuICAgbW9kaWZpY2F0aW9uLCBhcmUgcGVybWl0dGVkIHByb3ZpZGVkIHRoYXQgdGhlIGZvbGxvd2luZyBjb25kaXRpb25zIGFyZSBtZXQ6XG4gICAgICAgKiBSZWRpc3RyaWJ1dGlvbnMgb2Ygc291cmNlIGNvZGUgbXVzdCByZXRhaW4gdGhlIGFib3ZlIGNvcHlyaWdodFxuICAgICAgICAgbm90aWNlLCB0aGlzIGxpc3Qgb2YgY29uZGl0aW9ucyBhbmQgdGhlIGZvbGxvd2luZyBkaXNjbGFpbWVyLlxuICAgICAgICogUmVkaXN0cmlidXRpb25zIGluIGJpbmFyeSBmb3JtIG11c3QgcmVwcm9kdWNlIHRoZSBhYm92ZSBjb3B5cmlnaHRcbiAgICAgICAgIG5vdGljZSwgdGhpcyBsaXN0IG9mIGNvbmRpdGlvbnMgYW5kIHRoZSBmb2xsb3dpbmcgZGlzY2xhaW1lciBpbiB0aGVcbiAgICAgICAgIGRvY3VtZW50YXRpb24gYW5kL29yIG90aGVyIG1hdGVyaWFscyBwcm92aWRlZCB3aXRoIHRoZSBkaXN0cmlidXRpb24uXG4gICAgICAgKiBOZWl0aGVyIHRoZSBuYW1lIG9mIHNwcmludGYoKSBmb3IgSmF2YVNjcmlwdCBub3IgdGhlXG4gICAgICAgICBuYW1lcyBvZiBpdHMgY29udHJpYnV0b3JzIG1heSBiZSB1c2VkIHRvIGVuZG9yc2Ugb3IgcHJvbW90ZSBwcm9kdWN0c1xuICAgICAgICAgZGVyaXZlZCBmcm9tIHRoaXMgc29mdHdhcmUgd2l0aG91dCBzcGVjaWZpYyBwcmlvciB3cml0dGVuIHBlcm1pc3Npb24uXG5cbiAgIFRISVMgU09GVFdBUkUgSVMgUFJPVklERUQgQlkgVEhFIENPUFlSSUdIVCBIT0xERVJTIEFORCBDT05UUklCVVRPUlMgXCJBUyBJU1wiIEFORFxuICAgQU5ZIEVYUFJFU1MgT1IgSU1QTElFRCBXQVJSQU5USUVTLCBJTkNMVURJTkcsIEJVVCBOT1QgTElNSVRFRCBUTywgVEhFIElNUExJRURcbiAgIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZIEFORCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBUkVcbiAgIERJU0NMQUlNRUQuIElOIE5PIEVWRU5UIFNIQUxMIEFsZXhhbmRydSBNYXJhc3RlYW51IEJFIExJQUJMRSBGT1IgQU5ZXG4gICBESVJFQ1QsIElORElSRUNULCBJTkNJREVOVEFMLCBTUEVDSUFMLCBFWEVNUExBUlksIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFU1xuICAgKElOQ0xVRElORywgQlVUIE5PVCBMSU1JVEVEIFRPLCBQUk9DVVJFTUVOVCBPRiBTVUJTVElUVVRFIEdPT0RTIE9SIFNFUlZJQ0VTO1xuICAgTE9TUyBPRiBVU0UsIERBVEEsIE9SIFBST0ZJVFM7IE9SIEJVU0lORVNTIElOVEVSUlVQVElPTikgSE9XRVZFUiBDQVVTRUQgQU5EXG4gICBPTiBBTlkgVEhFT1JZIE9GIExJQUJJTElUWSwgV0hFVEhFUiBJTiBDT05UUkFDVCwgU1RSSUNUIExJQUJJTElUWSwgT1IgVE9SVFxuICAgKElOQ0xVRElORyBORUdMSUdFTkNFIE9SIE9USEVSV0lTRSkgQVJJU0lORyBJTiBBTlkgV0FZIE9VVCBPRiBUSEUgVVNFIE9GIFRISVNcbiAgIFNPRlRXQVJFLCBFVkVOIElGIEFEVklTRUQgT0YgVEhFIFBPU1NJQklMSVRZIE9GIFNVQ0ggREFNQUdFLlxuICAqL1xuICB2YXIgc3ByaW50ZiA9IChmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBnZXRfdHlwZSh2YXJpYWJsZSkge1xuICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YXJpYWJsZSkuc2xpY2UoOCwgLTEpLnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN0cl9yZXBlYXQoaW5wdXQsIG11bHRpcGxpZXIpIHtcbiAgICAgIGZvciAodmFyIG91dHB1dCA9IFtdOyBtdWx0aXBsaWVyID4gMDsgb3V0cHV0Wy0tbXVsdGlwbGllcl0gPSBpbnB1dCkgey8qIGRvIG5vdGhpbmcgKi99XG4gICAgICByZXR1cm4gb3V0cHV0LmpvaW4oJycpO1xuICAgIH1cblxuICAgIHZhciBzdHJfZm9ybWF0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXN0cl9mb3JtYXQuY2FjaGUuaGFzT3duUHJvcGVydHkoYXJndW1lbnRzWzBdKSkge1xuICAgICAgICBzdHJfZm9ybWF0LmNhY2hlW2FyZ3VtZW50c1swXV0gPSBzdHJfZm9ybWF0LnBhcnNlKGFyZ3VtZW50c1swXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RyX2Zvcm1hdC5mb3JtYXQuY2FsbChudWxsLCBzdHJfZm9ybWF0LmNhY2hlW2FyZ3VtZW50c1swXV0sIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIHN0cl9mb3JtYXQuZm9ybWF0ID0gZnVuY3Rpb24ocGFyc2VfdHJlZSwgYXJndikge1xuICAgICAgdmFyIGN1cnNvciA9IDEsIHRyZWVfbGVuZ3RoID0gcGFyc2VfdHJlZS5sZW5ndGgsIG5vZGVfdHlwZSA9ICcnLCBhcmcsIG91dHB1dCA9IFtdLCBpLCBrLCBtYXRjaCwgcGFkLCBwYWRfY2hhcmFjdGVyLCBwYWRfbGVuZ3RoO1xuICAgICAgZm9yIChpID0gMDsgaSA8IHRyZWVfbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbm9kZV90eXBlID0gZ2V0X3R5cGUocGFyc2VfdHJlZVtpXSk7XG4gICAgICAgIGlmIChub2RlX3R5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgb3V0cHV0LnB1c2gocGFyc2VfdHJlZVtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobm9kZV90eXBlID09PSAnYXJyYXknKSB7XG4gICAgICAgICAgbWF0Y2ggPSBwYXJzZV90cmVlW2ldOyAvLyBjb252ZW5pZW5jZSBwdXJwb3NlcyBvbmx5XG4gICAgICAgICAgaWYgKG1hdGNoWzJdKSB7IC8vIGtleXdvcmQgYXJndW1lbnRcbiAgICAgICAgICAgIGFyZyA9IGFyZ3ZbY3Vyc29yXTtcbiAgICAgICAgICAgIGZvciAoayA9IDA7IGsgPCBtYXRjaFsyXS5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICBpZiAoIWFyZy5oYXNPd25Qcm9wZXJ0eShtYXRjaFsyXVtrXSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyhzcHJpbnRmKCdbc3ByaW50Zl0gcHJvcGVydHkgXCIlc1wiIGRvZXMgbm90IGV4aXN0JywgbWF0Y2hbMl1ba10pKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBhcmcgPSBhcmdbbWF0Y2hbMl1ba11dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChtYXRjaFsxXSkgeyAvLyBwb3NpdGlvbmFsIGFyZ3VtZW50IChleHBsaWNpdClcbiAgICAgICAgICAgIGFyZyA9IGFyZ3ZbbWF0Y2hbMV1dO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHsgLy8gcG9zaXRpb25hbCBhcmd1bWVudCAoaW1wbGljaXQpXG4gICAgICAgICAgICBhcmcgPSBhcmd2W2N1cnNvcisrXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoL1tec10vLnRlc3QobWF0Y2hbOF0pICYmIChnZXRfdHlwZShhcmcpICE9ICdudW1iZXInKSkge1xuICAgICAgICAgICAgdGhyb3coc3ByaW50ZignW3NwcmludGZdIGV4cGVjdGluZyBudW1iZXIgYnV0IGZvdW5kICVzJywgZ2V0X3R5cGUoYXJnKSkpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEplZCBFRElUXG4gICAgICAgICAgaWYgKCB0eXBlb2YgYXJnID09ICd1bmRlZmluZWQnIHx8IGFyZyA9PT0gbnVsbCApIHtcbiAgICAgICAgICAgIGFyZyA9ICcnO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBKZWQgRURJVFxuXG4gICAgICAgICAgc3dpdGNoIChtYXRjaFs4XSkge1xuICAgICAgICAgICAgY2FzZSAnYic6IGFyZyA9IGFyZy50b1N0cmluZygyKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdjJzogYXJnID0gU3RyaW5nLmZyb21DaGFyQ29kZShhcmcpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2QnOiBhcmcgPSBwYXJzZUludChhcmcsIDEwKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdlJzogYXJnID0gbWF0Y2hbN10gPyBhcmcudG9FeHBvbmVudGlhbChtYXRjaFs3XSkgOiBhcmcudG9FeHBvbmVudGlhbCgpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2YnOiBhcmcgPSBtYXRjaFs3XSA/IHBhcnNlRmxvYXQoYXJnKS50b0ZpeGVkKG1hdGNoWzddKSA6IHBhcnNlRmxvYXQoYXJnKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdvJzogYXJnID0gYXJnLnRvU3RyaW5nKDgpOyBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ3MnOiBhcmcgPSAoKGFyZyA9IFN0cmluZyhhcmcpKSAmJiBtYXRjaFs3XSA/IGFyZy5zdWJzdHJpbmcoMCwgbWF0Y2hbN10pIDogYXJnKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd1JzogYXJnID0gTWF0aC5hYnMoYXJnKTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICd4JzogYXJnID0gYXJnLnRvU3RyaW5nKDE2KTsgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdYJzogYXJnID0gYXJnLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpOyBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgYXJnID0gKC9bZGVmXS8udGVzdChtYXRjaFs4XSkgJiYgbWF0Y2hbM10gJiYgYXJnID49IDAgPyAnKycrIGFyZyA6IGFyZyk7XG4gICAgICAgICAgcGFkX2NoYXJhY3RlciA9IG1hdGNoWzRdID8gbWF0Y2hbNF0gPT0gJzAnID8gJzAnIDogbWF0Y2hbNF0uY2hhckF0KDEpIDogJyAnO1xuICAgICAgICAgIHBhZF9sZW5ndGggPSBtYXRjaFs2XSAtIFN0cmluZyhhcmcpLmxlbmd0aDtcbiAgICAgICAgICBwYWQgPSBtYXRjaFs2XSA/IHN0cl9yZXBlYXQocGFkX2NoYXJhY3RlciwgcGFkX2xlbmd0aCkgOiAnJztcbiAgICAgICAgICBvdXRwdXQucHVzaChtYXRjaFs1XSA/IGFyZyArIHBhZCA6IHBhZCArIGFyZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBvdXRwdXQuam9pbignJyk7XG4gICAgfTtcblxuICAgIHN0cl9mb3JtYXQuY2FjaGUgPSB7fTtcblxuICAgIHN0cl9mb3JtYXQucGFyc2UgPSBmdW5jdGlvbihmbXQpIHtcbiAgICAgIHZhciBfZm10ID0gZm10LCBtYXRjaCA9IFtdLCBwYXJzZV90cmVlID0gW10sIGFyZ19uYW1lcyA9IDA7XG4gICAgICB3aGlsZSAoX2ZtdCkge1xuICAgICAgICBpZiAoKG1hdGNoID0gL15bXlxceDI1XSsvLmV4ZWMoX2ZtdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgcGFyc2VfdHJlZS5wdXNoKG1hdGNoWzBdKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgobWF0Y2ggPSAvXlxceDI1ezJ9Ly5leGVjKF9mbXQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgIHBhcnNlX3RyZWUucHVzaCgnJScpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKChtYXRjaCA9IC9eXFx4MjUoPzooWzEtOV1cXGQqKVxcJHxcXCgoW15cXCldKylcXCkpPyhcXCspPygwfCdbXiRdKT8oLSk/KFxcZCspPyg/OlxcLihcXGQrKSk/KFtiLWZvc3V4WF0pLy5leGVjKF9mbXQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgIGlmIChtYXRjaFsyXSkge1xuICAgICAgICAgICAgYXJnX25hbWVzIHw9IDE7XG4gICAgICAgICAgICB2YXIgZmllbGRfbGlzdCA9IFtdLCByZXBsYWNlbWVudF9maWVsZCA9IG1hdGNoWzJdLCBmaWVsZF9tYXRjaCA9IFtdO1xuICAgICAgICAgICAgaWYgKChmaWVsZF9tYXRjaCA9IC9eKFthLXpfXVthLXpfXFxkXSopL2kuZXhlYyhyZXBsYWNlbWVudF9maWVsZCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgIGZpZWxkX2xpc3QucHVzaChmaWVsZF9tYXRjaFsxXSk7XG4gICAgICAgICAgICAgIHdoaWxlICgocmVwbGFjZW1lbnRfZmllbGQgPSByZXBsYWNlbWVudF9maWVsZC5zdWJzdHJpbmcoZmllbGRfbWF0Y2hbMF0ubGVuZ3RoKSkgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgaWYgKChmaWVsZF9tYXRjaCA9IC9eXFwuKFthLXpfXVthLXpfXFxkXSopL2kuZXhlYyhyZXBsYWNlbWVudF9maWVsZCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICBmaWVsZF9saXN0LnB1c2goZmllbGRfbWF0Y2hbMV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICgoZmllbGRfbWF0Y2ggPSAvXlxcWyhcXGQrKVxcXS8uZXhlYyhyZXBsYWNlbWVudF9maWVsZCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICBmaWVsZF9saXN0LnB1c2goZmllbGRfbWF0Y2hbMV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIHRocm93KCdbc3ByaW50Zl0gaHVoPycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93KCdbc3ByaW50Zl0gaHVoPycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWF0Y2hbMl0gPSBmaWVsZF9saXN0O1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFyZ19uYW1lcyB8PSAyO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYXJnX25hbWVzID09PSAzKSB7XG4gICAgICAgICAgICB0aHJvdygnW3NwcmludGZdIG1peGluZyBwb3NpdGlvbmFsIGFuZCBuYW1lZCBwbGFjZWhvbGRlcnMgaXMgbm90ICh5ZXQpIHN1cHBvcnRlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwYXJzZV90cmVlLnB1c2gobWF0Y2gpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRocm93KCdbc3ByaW50Zl0gaHVoPycpO1xuICAgICAgICB9XG4gICAgICAgIF9mbXQgPSBfZm10LnN1YnN0cmluZyhtYXRjaFswXS5sZW5ndGgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHBhcnNlX3RyZWU7XG4gICAgfTtcblxuICAgIHJldHVybiBzdHJfZm9ybWF0O1xuICB9KSgpO1xuXG4gIHZhciB2c3ByaW50ZiA9IGZ1bmN0aW9uKGZtdCwgYXJndikge1xuICAgIGFyZ3YudW5zaGlmdChmbXQpO1xuICAgIHJldHVybiBzcHJpbnRmLmFwcGx5KG51bGwsIGFyZ3YpO1xuICB9O1xuXG4gIEplZC5wYXJzZV9wbHVyYWwgPSBmdW5jdGlvbiAoIHBsdXJhbF9mb3JtcywgbiApIHtcbiAgICBwbHVyYWxfZm9ybXMgPSBwbHVyYWxfZm9ybXMucmVwbGFjZSgvbi9nLCBuKTtcbiAgICByZXR1cm4gSmVkLnBhcnNlX2V4cHJlc3Npb24ocGx1cmFsX2Zvcm1zKTtcbiAgfTtcblxuICBKZWQuc3ByaW50ZiA9IGZ1bmN0aW9uICggZm10LCBhcmdzICkge1xuICAgIGlmICgge30udG9TdHJpbmcuY2FsbCggYXJncyApID09ICdbb2JqZWN0IEFycmF5XScgKSB7XG4gICAgICByZXR1cm4gdnNwcmludGYoIGZtdCwgW10uc2xpY2UuY2FsbChhcmdzKSApO1xuICAgIH1cbiAgICByZXR1cm4gc3ByaW50Zi5hcHBseSh0aGlzLCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykgKTtcbiAgfTtcblxuICBKZWQucHJvdG90eXBlLnNwcmludGYgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIEplZC5zcHJpbnRmLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG4gIC8vIEVORCBzcHJpbnRmIEltcGxlbWVudGF0aW9uXG5cbiAgLy8gU3RhcnQgdGhlIFBsdXJhbCBmb3JtcyBzZWN0aW9uXG4gIC8vIFRoaXMgaXMgYSBmdWxsIHBsdXJhbCBmb3JtIGV4cHJlc3Npb24gcGFyc2VyLiBJdCBpcyB1c2VkIHRvIGF2b2lkXG4gIC8vIHJ1bm5pbmcgJ2V2YWwnIG9yICduZXcgRnVuY3Rpb24nIGRpcmVjdGx5IGFnYWluc3QgdGhlIHBsdXJhbFxuICAvLyBmb3Jtcy5cbiAgLy9cbiAgLy8gVGhpcyBjYW4gYmUgaW1wb3J0YW50IGlmIHlvdSBnZXQgdHJhbnNsYXRpb25zIGRvbmUgdGhyb3VnaCBhIDNyZFxuICAvLyBwYXJ0eSB2ZW5kb3IuIEkgZW5jb3VyYWdlIHlvdSB0byB1c2UgdGhpcyBpbnN0ZWFkLCBob3dldmVyLCBJXG4gIC8vIGFsc28gd2lsbCBwcm92aWRlIGEgJ3ByZWNvbXBpbGVyJyB0aGF0IHlvdSBjYW4gdXNlIGF0IGJ1aWxkIHRpbWVcbiAgLy8gdG8gb3V0cHV0IHZhbGlkL3NhZmUgZnVuY3Rpb24gcmVwcmVzZW50YXRpb25zIG9mIHRoZSBwbHVyYWwgZm9ybVxuICAvLyBleHByZXNzaW9ucy4gVGhpcyBtZWFucyB5b3UgY2FuIGJ1aWxkIHRoaXMgY29kZSBvdXQgZm9yIHRoZSBtb3N0XG4gIC8vIHBhcnQuXG4gIEplZC5QRiA9IHt9O1xuXG4gIEplZC5QRi5wYXJzZSA9IGZ1bmN0aW9uICggcCApIHtcbiAgICB2YXIgcGx1cmFsX3N0ciA9IEplZC5QRi5leHRyYWN0UGx1cmFsRXhwciggcCApO1xuICAgIHJldHVybiBKZWQuUEYucGFyc2VyLnBhcnNlLmNhbGwoSmVkLlBGLnBhcnNlciwgcGx1cmFsX3N0cik7XG4gIH07XG5cbiAgSmVkLlBGLmNvbXBpbGUgPSBmdW5jdGlvbiAoIHAgKSB7XG4gICAgLy8gSGFuZGxlIHRydWVzIGFuZCBmYWxzZXMgYXMgMCBhbmQgMVxuICAgIGZ1bmN0aW9uIGltcGx5KCB2YWwgKSB7XG4gICAgICByZXR1cm4gKHZhbCA9PT0gdHJ1ZSA/IDEgOiB2YWwgPyB2YWwgOiAwKTtcbiAgICB9XG5cbiAgICB2YXIgYXN0ID0gSmVkLlBGLnBhcnNlKCBwICk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICggbiApIHtcbiAgICAgIHJldHVybiBpbXBseSggSmVkLlBGLmludGVycHJldGVyKCBhc3QgKSggbiApICk7XG4gICAgfTtcbiAgfTtcblxuICBKZWQuUEYuaW50ZXJwcmV0ZXIgPSBmdW5jdGlvbiAoIGFzdCApIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCBuICkge1xuICAgICAgdmFyIHJlcztcbiAgICAgIHN3aXRjaCAoIGFzdC50eXBlICkge1xuICAgICAgICBjYXNlICdHUk9VUCc6XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmV4cHIgKSggbiApO1xuICAgICAgICBjYXNlICdURVJOQVJZJzpcbiAgICAgICAgICBpZiAoIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmV4cHIgKSggbiApICkge1xuICAgICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LnRydXRoeSApKCBuICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5mYWxzZXkgKSggbiApO1xuICAgICAgICBjYXNlICdPUic6XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmxlZnQgKSggbiApIHx8IEplZC5QRi5pbnRlcnByZXRlciggYXN0LnJpZ2h0ICkoIG4gKTtcbiAgICAgICAgY2FzZSAnQU5EJzpcbiAgICAgICAgICByZXR1cm4gSmVkLlBGLmludGVycHJldGVyKCBhc3QubGVmdCApKCBuICkgJiYgSmVkLlBGLmludGVycHJldGVyKCBhc3QucmlnaHQgKSggbiApO1xuICAgICAgICBjYXNlICdMVCc6XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmxlZnQgKSggbiApIDwgSmVkLlBGLmludGVycHJldGVyKCBhc3QucmlnaHQgKSggbiApO1xuICAgICAgICBjYXNlICdHVCc6XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmxlZnQgKSggbiApID4gSmVkLlBGLmludGVycHJldGVyKCBhc3QucmlnaHQgKSggbiApO1xuICAgICAgICBjYXNlICdMVEUnOlxuICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5sZWZ0ICkoIG4gKSA8PSBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5yaWdodCApKCBuICk7XG4gICAgICAgIGNhc2UgJ0dURSc6XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmxlZnQgKSggbiApID49IEplZC5QRi5pbnRlcnByZXRlciggYXN0LnJpZ2h0ICkoIG4gKTtcbiAgICAgICAgY2FzZSAnRVEnOlxuICAgICAgICAgIHJldHVybiBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5sZWZ0ICkoIG4gKSA9PSBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5yaWdodCApKCBuICk7XG4gICAgICAgIGNhc2UgJ05FUSc6XG4gICAgICAgICAgcmV0dXJuIEplZC5QRi5pbnRlcnByZXRlciggYXN0LmxlZnQgKSggbiApICE9IEplZC5QRi5pbnRlcnByZXRlciggYXN0LnJpZ2h0ICkoIG4gKTtcbiAgICAgICAgY2FzZSAnTU9EJzpcbiAgICAgICAgICByZXR1cm4gSmVkLlBGLmludGVycHJldGVyKCBhc3QubGVmdCApKCBuICkgJSBKZWQuUEYuaW50ZXJwcmV0ZXIoIGFzdC5yaWdodCApKCBuICk7XG4gICAgICAgIGNhc2UgJ1ZBUic6XG4gICAgICAgICAgcmV0dXJuIG47XG4gICAgICAgIGNhc2UgJ05VTSc6XG4gICAgICAgICAgcmV0dXJuIGFzdC52YWw7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBUb2tlbiBmb3VuZC5cIik7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICBKZWQuUEYuZXh0cmFjdFBsdXJhbEV4cHIgPSBmdW5jdGlvbiAoIHAgKSB7XG4gICAgLy8gdHJpbSBmaXJzdFxuICAgIHAgPSBwLnJlcGxhY2UoL15cXHNcXHMqLywgJycpLnJlcGxhY2UoL1xcc1xccyokLywgJycpO1xuXG4gICAgaWYgKCEgLztcXHMqJC8udGVzdChwKSkge1xuICAgICAgcCA9IHAuY29uY2F0KCc7Jyk7XG4gICAgfVxuXG4gICAgdmFyIG5wbHVyYWxzX3JlID0gL25wbHVyYWxzXFw9KFxcZCspOy8sXG4gICAgICAgIHBsdXJhbF9yZSA9IC9wbHVyYWxcXD0oLiopOy8sXG4gICAgICAgIG5wbHVyYWxzX21hdGNoZXMgPSBwLm1hdGNoKCBucGx1cmFsc19yZSApLFxuICAgICAgICByZXMgPSB7fSxcbiAgICAgICAgcGx1cmFsX21hdGNoZXM7XG5cbiAgICAvLyBGaW5kIHRoZSBucGx1cmFscyBudW1iZXJcbiAgICBpZiAoIG5wbHVyYWxzX21hdGNoZXMubGVuZ3RoID4gMSApIHtcbiAgICAgIHJlcy5ucGx1cmFscyA9IG5wbHVyYWxzX21hdGNoZXNbMV07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCducGx1cmFscyBub3QgZm91bmQgaW4gcGx1cmFsX2Zvcm1zIHN0cmluZzogJyArIHAgKTtcbiAgICB9XG5cbiAgICAvLyByZW1vdmUgdGhhdCBkYXRhIHRvIGdldCB0byB0aGUgZm9ybXVsYVxuICAgIHAgPSBwLnJlcGxhY2UoIG5wbHVyYWxzX3JlLCBcIlwiICk7XG4gICAgcGx1cmFsX21hdGNoZXMgPSBwLm1hdGNoKCBwbHVyYWxfcmUgKTtcblxuICAgIGlmICghKCBwbHVyYWxfbWF0Y2hlcyAmJiBwbHVyYWxfbWF0Y2hlcy5sZW5ndGggPiAxICkgKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BwbHVyYWxgIGV4cHJlc3Npb24gbm90IGZvdW5kOiAnICsgcCk7XG4gICAgfVxuICAgIHJldHVybiBwbHVyYWxfbWF0Y2hlc1sgMSBdO1xuICB9O1xuXG4gIC8qIEppc29uIGdlbmVyYXRlZCBwYXJzZXIgKi9cbiAgSmVkLlBGLnBhcnNlciA9IChmdW5jdGlvbigpe1xuXG52YXIgcGFyc2VyID0ge3RyYWNlOiBmdW5jdGlvbiB0cmFjZSgpIHsgfSxcbnl5OiB7fSxcbnN5bWJvbHNfOiB7XCJlcnJvclwiOjIsXCJleHByZXNzaW9uc1wiOjMsXCJlXCI6NCxcIkVPRlwiOjUsXCI/XCI6NixcIjpcIjo3LFwifHxcIjo4LFwiJiZcIjo5LFwiPFwiOjEwLFwiPD1cIjoxMSxcIj5cIjoxMixcIj49XCI6MTMsXCIhPVwiOjE0LFwiPT1cIjoxNSxcIiVcIjoxNixcIihcIjoxNyxcIilcIjoxOCxcIm5cIjoxOSxcIk5VTUJFUlwiOjIwLFwiJGFjY2VwdFwiOjAsXCIkZW5kXCI6MX0sXG50ZXJtaW5hbHNfOiB7MjpcImVycm9yXCIsNTpcIkVPRlwiLDY6XCI/XCIsNzpcIjpcIiw4OlwifHxcIiw5OlwiJiZcIiwxMDpcIjxcIiwxMTpcIjw9XCIsMTI6XCI+XCIsMTM6XCI+PVwiLDE0OlwiIT1cIiwxNTpcIj09XCIsMTY6XCIlXCIsMTc6XCIoXCIsMTg6XCIpXCIsMTk6XCJuXCIsMjA6XCJOVU1CRVJcIn0sXG5wcm9kdWN0aW9uc186IFswLFszLDJdLFs0LDVdLFs0LDNdLFs0LDNdLFs0LDNdLFs0LDNdLFs0LDNdLFs0LDNdLFs0LDNdLFs0LDNdLFs0LDNdLFs0LDNdLFs0LDFdLFs0LDFdXSxcbnBlcmZvcm1BY3Rpb246IGZ1bmN0aW9uIGFub255bW91cyh5eXRleHQseXlsZW5nLHl5bGluZW5vLHl5LHl5c3RhdGUsJCQsXyQpIHtcblxudmFyICQwID0gJCQubGVuZ3RoIC0gMTtcbnN3aXRjaCAoeXlzdGF0ZSkge1xuY2FzZSAxOiByZXR1cm4geyB0eXBlIDogJ0dST1VQJywgZXhwcjogJCRbJDAtMV0gfTtcbmJyZWFrO1xuY2FzZSAyOnRoaXMuJCA9IHsgdHlwZTogJ1RFUk5BUlknLCBleHByOiAkJFskMC00XSwgdHJ1dGh5IDogJCRbJDAtMl0sIGZhbHNleTogJCRbJDBdIH07XG5icmVhaztcbmNhc2UgMzp0aGlzLiQgPSB7IHR5cGU6IFwiT1JcIiwgbGVmdDogJCRbJDAtMl0sIHJpZ2h0OiAkJFskMF0gfTtcbmJyZWFrO1xuY2FzZSA0OnRoaXMuJCA9IHsgdHlwZTogXCJBTkRcIiwgbGVmdDogJCRbJDAtMl0sIHJpZ2h0OiAkJFskMF0gfTtcbmJyZWFrO1xuY2FzZSA1OnRoaXMuJCA9IHsgdHlwZTogJ0xUJywgbGVmdDogJCRbJDAtMl0sIHJpZ2h0OiAkJFskMF0gfTtcbmJyZWFrO1xuY2FzZSA2OnRoaXMuJCA9IHsgdHlwZTogJ0xURScsIGxlZnQ6ICQkWyQwLTJdLCByaWdodDogJCRbJDBdIH07XG5icmVhaztcbmNhc2UgNzp0aGlzLiQgPSB7IHR5cGU6ICdHVCcsIGxlZnQ6ICQkWyQwLTJdLCByaWdodDogJCRbJDBdIH07XG5icmVhaztcbmNhc2UgODp0aGlzLiQgPSB7IHR5cGU6ICdHVEUnLCBsZWZ0OiAkJFskMC0yXSwgcmlnaHQ6ICQkWyQwXSB9O1xuYnJlYWs7XG5jYXNlIDk6dGhpcy4kID0geyB0eXBlOiAnTkVRJywgbGVmdDogJCRbJDAtMl0sIHJpZ2h0OiAkJFskMF0gfTtcbmJyZWFrO1xuY2FzZSAxMDp0aGlzLiQgPSB7IHR5cGU6ICdFUScsIGxlZnQ6ICQkWyQwLTJdLCByaWdodDogJCRbJDBdIH07XG5icmVhaztcbmNhc2UgMTE6dGhpcy4kID0geyB0eXBlOiAnTU9EJywgbGVmdDogJCRbJDAtMl0sIHJpZ2h0OiAkJFskMF0gfTtcbmJyZWFrO1xuY2FzZSAxMjp0aGlzLiQgPSB7IHR5cGU6ICdHUk9VUCcsIGV4cHI6ICQkWyQwLTFdIH07XG5icmVhaztcbmNhc2UgMTM6dGhpcy4kID0geyB0eXBlOiAnVkFSJyB9O1xuYnJlYWs7XG5jYXNlIDE0OnRoaXMuJCA9IHsgdHlwZTogJ05VTScsIHZhbDogTnVtYmVyKHl5dGV4dCkgfTtcbmJyZWFrO1xufVxufSxcbnRhYmxlOiBbezM6MSw0OjIsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHsxOlszXX0sezU6WzEsNl0sNjpbMSw3XSw4OlsxLDhdLDk6WzEsOV0sMTA6WzEsMTBdLDExOlsxLDExXSwxMjpbMSwxMl0sMTM6WzEsMTNdLDE0OlsxLDE0XSwxNTpbMSwxNV0sMTY6WzEsMTZdfSx7NDoxNywxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezU6WzIsMTNdLDY6WzIsMTNdLDc6WzIsMTNdLDg6WzIsMTNdLDk6WzIsMTNdLDEwOlsyLDEzXSwxMTpbMiwxM10sMTI6WzIsMTNdLDEzOlsyLDEzXSwxNDpbMiwxM10sMTU6WzIsMTNdLDE2OlsyLDEzXSwxODpbMiwxM119LHs1OlsyLDE0XSw2OlsyLDE0XSw3OlsyLDE0XSw4OlsyLDE0XSw5OlsyLDE0XSwxMDpbMiwxNF0sMTE6WzIsMTRdLDEyOlsyLDE0XSwxMzpbMiwxNF0sMTQ6WzIsMTRdLDE1OlsyLDE0XSwxNjpbMiwxNF0sMTg6WzIsMTRdfSx7MTpbMiwxXX0sezQ6MTgsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs0OjE5LDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NDoyMCwxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezQ6MjEsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs0OjIyLDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NDoyMywxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezQ6MjQsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs0OjI1LDE3OlsxLDNdLDE5OlsxLDRdLDIwOlsxLDVdfSx7NDoyNiwxNzpbMSwzXSwxOTpbMSw0XSwyMDpbMSw1XX0sezQ6MjcsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs2OlsxLDddLDg6WzEsOF0sOTpbMSw5XSwxMDpbMSwxMF0sMTE6WzEsMTFdLDEyOlsxLDEyXSwxMzpbMSwxM10sMTQ6WzEsMTRdLDE1OlsxLDE1XSwxNjpbMSwxNl0sMTg6WzEsMjhdfSx7NjpbMSw3XSw3OlsxLDI5XSw4OlsxLDhdLDk6WzEsOV0sMTA6WzEsMTBdLDExOlsxLDExXSwxMjpbMSwxMl0sMTM6WzEsMTNdLDE0OlsxLDE0XSwxNTpbMSwxNV0sMTY6WzEsMTZdfSx7NTpbMiwzXSw2OlsyLDNdLDc6WzIsM10sODpbMiwzXSw5OlsxLDldLDEwOlsxLDEwXSwxMTpbMSwxMV0sMTI6WzEsMTJdLDEzOlsxLDEzXSwxNDpbMSwxNF0sMTU6WzEsMTVdLDE2OlsxLDE2XSwxODpbMiwzXX0sezU6WzIsNF0sNjpbMiw0XSw3OlsyLDRdLDg6WzIsNF0sOTpbMiw0XSwxMDpbMSwxMF0sMTE6WzEsMTFdLDEyOlsxLDEyXSwxMzpbMSwxM10sMTQ6WzEsMTRdLDE1OlsxLDE1XSwxNjpbMSwxNl0sMTg6WzIsNF19LHs1OlsyLDVdLDY6WzIsNV0sNzpbMiw1XSw4OlsyLDVdLDk6WzIsNV0sMTA6WzIsNV0sMTE6WzIsNV0sMTI6WzIsNV0sMTM6WzIsNV0sMTQ6WzIsNV0sMTU6WzIsNV0sMTY6WzEsMTZdLDE4OlsyLDVdfSx7NTpbMiw2XSw2OlsyLDZdLDc6WzIsNl0sODpbMiw2XSw5OlsyLDZdLDEwOlsyLDZdLDExOlsyLDZdLDEyOlsyLDZdLDEzOlsyLDZdLDE0OlsyLDZdLDE1OlsyLDZdLDE2OlsxLDE2XSwxODpbMiw2XX0sezU6WzIsN10sNjpbMiw3XSw3OlsyLDddLDg6WzIsN10sOTpbMiw3XSwxMDpbMiw3XSwxMTpbMiw3XSwxMjpbMiw3XSwxMzpbMiw3XSwxNDpbMiw3XSwxNTpbMiw3XSwxNjpbMSwxNl0sMTg6WzIsN119LHs1OlsyLDhdLDY6WzIsOF0sNzpbMiw4XSw4OlsyLDhdLDk6WzIsOF0sMTA6WzIsOF0sMTE6WzIsOF0sMTI6WzIsOF0sMTM6WzIsOF0sMTQ6WzIsOF0sMTU6WzIsOF0sMTY6WzEsMTZdLDE4OlsyLDhdfSx7NTpbMiw5XSw2OlsyLDldLDc6WzIsOV0sODpbMiw5XSw5OlsyLDldLDEwOlsyLDldLDExOlsyLDldLDEyOlsyLDldLDEzOlsyLDldLDE0OlsyLDldLDE1OlsyLDldLDE2OlsxLDE2XSwxODpbMiw5XX0sezU6WzIsMTBdLDY6WzIsMTBdLDc6WzIsMTBdLDg6WzIsMTBdLDk6WzIsMTBdLDEwOlsyLDEwXSwxMTpbMiwxMF0sMTI6WzIsMTBdLDEzOlsyLDEwXSwxNDpbMiwxMF0sMTU6WzIsMTBdLDE2OlsxLDE2XSwxODpbMiwxMF19LHs1OlsyLDExXSw2OlsyLDExXSw3OlsyLDExXSw4OlsyLDExXSw5OlsyLDExXSwxMDpbMiwxMV0sMTE6WzIsMTFdLDEyOlsyLDExXSwxMzpbMiwxMV0sMTQ6WzIsMTFdLDE1OlsyLDExXSwxNjpbMiwxMV0sMTg6WzIsMTFdfSx7NTpbMiwxMl0sNjpbMiwxMl0sNzpbMiwxMl0sODpbMiwxMl0sOTpbMiwxMl0sMTA6WzIsMTJdLDExOlsyLDEyXSwxMjpbMiwxMl0sMTM6WzIsMTJdLDE0OlsyLDEyXSwxNTpbMiwxMl0sMTY6WzIsMTJdLDE4OlsyLDEyXX0sezQ6MzAsMTc6WzEsM10sMTk6WzEsNF0sMjA6WzEsNV19LHs1OlsyLDJdLDY6WzEsN10sNzpbMiwyXSw4OlsxLDhdLDk6WzEsOV0sMTA6WzEsMTBdLDExOlsxLDExXSwxMjpbMSwxMl0sMTM6WzEsMTNdLDE0OlsxLDE0XSwxNTpbMSwxNV0sMTY6WzEsMTZdLDE4OlsyLDJdfV0sXG5kZWZhdWx0QWN0aW9uczogezY6WzIsMV19LFxucGFyc2VFcnJvcjogZnVuY3Rpb24gcGFyc2VFcnJvcihzdHIsIGhhc2gpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3Ioc3RyKTtcbn0sXG5wYXJzZTogZnVuY3Rpb24gcGFyc2UoaW5wdXQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIHN0YWNrID0gWzBdLFxuICAgICAgICB2c3RhY2sgPSBbbnVsbF0sIC8vIHNlbWFudGljIHZhbHVlIHN0YWNrXG4gICAgICAgIGxzdGFjayA9IFtdLCAvLyBsb2NhdGlvbiBzdGFja1xuICAgICAgICB0YWJsZSA9IHRoaXMudGFibGUsXG4gICAgICAgIHl5dGV4dCA9ICcnLFxuICAgICAgICB5eWxpbmVubyA9IDAsXG4gICAgICAgIHl5bGVuZyA9IDAsXG4gICAgICAgIHJlY292ZXJpbmcgPSAwLFxuICAgICAgICBURVJST1IgPSAyLFxuICAgICAgICBFT0YgPSAxO1xuXG4gICAgLy90aGlzLnJlZHVjdGlvbkNvdW50ID0gdGhpcy5zaGlmdENvdW50ID0gMDtcblxuICAgIHRoaXMubGV4ZXIuc2V0SW5wdXQoaW5wdXQpO1xuICAgIHRoaXMubGV4ZXIueXkgPSB0aGlzLnl5O1xuICAgIHRoaXMueXkubGV4ZXIgPSB0aGlzLmxleGVyO1xuICAgIGlmICh0eXBlb2YgdGhpcy5sZXhlci55eWxsb2MgPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgIHRoaXMubGV4ZXIueXlsbG9jID0ge307XG4gICAgdmFyIHl5bG9jID0gdGhpcy5sZXhlci55eWxsb2M7XG4gICAgbHN0YWNrLnB1c2goeXlsb2MpO1xuXG4gICAgaWYgKHR5cGVvZiB0aGlzLnl5LnBhcnNlRXJyb3IgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIHRoaXMucGFyc2VFcnJvciA9IHRoaXMueXkucGFyc2VFcnJvcjtcblxuICAgIGZ1bmN0aW9uIHBvcFN0YWNrIChuKSB7XG4gICAgICAgIHN0YWNrLmxlbmd0aCA9IHN0YWNrLmxlbmd0aCAtIDIqbjtcbiAgICAgICAgdnN0YWNrLmxlbmd0aCA9IHZzdGFjay5sZW5ndGggLSBuO1xuICAgICAgICBsc3RhY2subGVuZ3RoID0gbHN0YWNrLmxlbmd0aCAtIG47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGV4KCkge1xuICAgICAgICB2YXIgdG9rZW47XG4gICAgICAgIHRva2VuID0gc2VsZi5sZXhlci5sZXgoKSB8fCAxOyAvLyAkZW5kID0gMVxuICAgICAgICAvLyBpZiB0b2tlbiBpc24ndCBpdHMgbnVtZXJpYyB2YWx1ZSwgY29udmVydFxuICAgICAgICBpZiAodHlwZW9mIHRva2VuICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdG9rZW4gPSBzZWxmLnN5bWJvbHNfW3Rva2VuXSB8fCB0b2tlbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgfVxuXG4gICAgdmFyIHN5bWJvbCwgcHJlRXJyb3JTeW1ib2wsIHN0YXRlLCBhY3Rpb24sIGEsIHIsIHl5dmFsPXt9LHAsbGVuLG5ld1N0YXRlLCBleHBlY3RlZDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAvLyByZXRyZWl2ZSBzdGF0ZSBudW1iZXIgZnJvbSB0b3Agb2Ygc3RhY2tcbiAgICAgICAgc3RhdGUgPSBzdGFja1tzdGFjay5sZW5ndGgtMV07XG5cbiAgICAgICAgLy8gdXNlIGRlZmF1bHQgYWN0aW9ucyBpZiBhdmFpbGFibGVcbiAgICAgICAgaWYgKHRoaXMuZGVmYXVsdEFjdGlvbnNbc3RhdGVdKSB7XG4gICAgICAgICAgICBhY3Rpb24gPSB0aGlzLmRlZmF1bHRBY3Rpb25zW3N0YXRlXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzeW1ib2wgPT0gbnVsbClcbiAgICAgICAgICAgICAgICBzeW1ib2wgPSBsZXgoKTtcbiAgICAgICAgICAgIC8vIHJlYWQgYWN0aW9uIGZvciBjdXJyZW50IHN0YXRlIGFuZCBmaXJzdCBpbnB1dFxuICAgICAgICAgICAgYWN0aW9uID0gdGFibGVbc3RhdGVdICYmIHRhYmxlW3N0YXRlXVtzeW1ib2xdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaGFuZGxlIHBhcnNlIGVycm9yXG4gICAgICAgIF9oYW5kbGVfZXJyb3I6XG4gICAgICAgIGlmICh0eXBlb2YgYWN0aW9uID09PSAndW5kZWZpbmVkJyB8fCAhYWN0aW9uLmxlbmd0aCB8fCAhYWN0aW9uWzBdKSB7XG5cbiAgICAgICAgICAgIGlmICghcmVjb3ZlcmluZykge1xuICAgICAgICAgICAgICAgIC8vIFJlcG9ydCBlcnJvclxuICAgICAgICAgICAgICAgIGV4cGVjdGVkID0gW107XG4gICAgICAgICAgICAgICAgZm9yIChwIGluIHRhYmxlW3N0YXRlXSkgaWYgKHRoaXMudGVybWluYWxzX1twXSAmJiBwID4gMikge1xuICAgICAgICAgICAgICAgICAgICBleHBlY3RlZC5wdXNoKFwiJ1wiK3RoaXMudGVybWluYWxzX1twXStcIidcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBlcnJTdHIgPSAnJztcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5sZXhlci5zaG93UG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyU3RyID0gJ1BhcnNlIGVycm9yIG9uIGxpbmUgJysoeXlsaW5lbm8rMSkrXCI6XFxuXCIrdGhpcy5sZXhlci5zaG93UG9zaXRpb24oKStcIlxcbkV4cGVjdGluZyBcIitleHBlY3RlZC5qb2luKCcsICcpICsgXCIsIGdvdCAnXCIgKyB0aGlzLnRlcm1pbmFsc19bc3ltYm9sXSsgXCInXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyU3RyID0gJ1BhcnNlIGVycm9yIG9uIGxpbmUgJysoeXlsaW5lbm8rMSkrXCI6IFVuZXhwZWN0ZWQgXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChzeW1ib2wgPT0gMSAvKkVPRiovID8gXCJlbmQgb2YgaW5wdXRcIiA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKFwiJ1wiKyh0aGlzLnRlcm1pbmFsc19bc3ltYm9sXSB8fCBzeW1ib2wpK1wiJ1wiKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucGFyc2VFcnJvcihlcnJTdHIsXG4gICAgICAgICAgICAgICAgICAgIHt0ZXh0OiB0aGlzLmxleGVyLm1hdGNoLCB0b2tlbjogdGhpcy50ZXJtaW5hbHNfW3N5bWJvbF0gfHwgc3ltYm9sLCBsaW5lOiB0aGlzLmxleGVyLnl5bGluZW5vLCBsb2M6IHl5bG9jLCBleHBlY3RlZDogZXhwZWN0ZWR9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8ganVzdCByZWNvdmVyZWQgZnJvbSBhbm90aGVyIGVycm9yXG4gICAgICAgICAgICBpZiAocmVjb3ZlcmluZyA9PSAzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN5bWJvbCA9PSBFT0YpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVyclN0ciB8fCAnUGFyc2luZyBoYWx0ZWQuJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gZGlzY2FyZCBjdXJyZW50IGxvb2thaGVhZCBhbmQgZ3JhYiBhbm90aGVyXG4gICAgICAgICAgICAgICAgeXlsZW5nID0gdGhpcy5sZXhlci55eWxlbmc7XG4gICAgICAgICAgICAgICAgeXl0ZXh0ID0gdGhpcy5sZXhlci55eXRleHQ7XG4gICAgICAgICAgICAgICAgeXlsaW5lbm8gPSB0aGlzLmxleGVyLnl5bGluZW5vO1xuICAgICAgICAgICAgICAgIHl5bG9jID0gdGhpcy5sZXhlci55eWxsb2M7XG4gICAgICAgICAgICAgICAgc3ltYm9sID0gbGV4KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHRyeSB0byByZWNvdmVyIGZyb20gZXJyb3JcbiAgICAgICAgICAgIHdoaWxlICgxKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgZm9yIGVycm9yIHJlY292ZXJ5IHJ1bGUgaW4gdGhpcyBzdGF0ZVxuICAgICAgICAgICAgICAgIGlmICgoVEVSUk9SLnRvU3RyaW5nKCkpIGluIHRhYmxlW3N0YXRlXSkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHN0YXRlID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVyclN0ciB8fCAnUGFyc2luZyBoYWx0ZWQuJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBvcFN0YWNrKDEpO1xuICAgICAgICAgICAgICAgIHN0YXRlID0gc3RhY2tbc3RhY2subGVuZ3RoLTFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwcmVFcnJvclN5bWJvbCA9IHN5bWJvbDsgLy8gc2F2ZSB0aGUgbG9va2FoZWFkIHRva2VuXG4gICAgICAgICAgICBzeW1ib2wgPSBURVJST1I7ICAgICAgICAgLy8gaW5zZXJ0IGdlbmVyaWMgZXJyb3Igc3ltYm9sIGFzIG5ldyBsb29rYWhlYWRcbiAgICAgICAgICAgIHN0YXRlID0gc3RhY2tbc3RhY2subGVuZ3RoLTFdO1xuICAgICAgICAgICAgYWN0aW9uID0gdGFibGVbc3RhdGVdICYmIHRhYmxlW3N0YXRlXVtURVJST1JdO1xuICAgICAgICAgICAgcmVjb3ZlcmluZyA9IDM7IC8vIGFsbG93IDMgcmVhbCBzeW1ib2xzIHRvIGJlIHNoaWZ0ZWQgYmVmb3JlIHJlcG9ydGluZyBhIG5ldyBlcnJvclxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGhpcyBzaG91bGRuJ3QgaGFwcGVuLCB1bmxlc3MgcmVzb2x2ZSBkZWZhdWx0cyBhcmUgb2ZmXG4gICAgICAgIGlmIChhY3Rpb25bMF0gaW5zdGFuY2VvZiBBcnJheSAmJiBhY3Rpb24ubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQYXJzZSBFcnJvcjogbXVsdGlwbGUgYWN0aW9ucyBwb3NzaWJsZSBhdCBzdGF0ZTogJytzdGF0ZSsnLCB0b2tlbjogJytzeW1ib2wpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoIChhY3Rpb25bMF0pIHtcblxuICAgICAgICAgICAgY2FzZSAxOiAvLyBzaGlmdFxuICAgICAgICAgICAgICAgIC8vdGhpcy5zaGlmdENvdW50Kys7XG5cbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKHN5bWJvbCk7XG4gICAgICAgICAgICAgICAgdnN0YWNrLnB1c2godGhpcy5sZXhlci55eXRleHQpO1xuICAgICAgICAgICAgICAgIGxzdGFjay5wdXNoKHRoaXMubGV4ZXIueXlsbG9jKTtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKGFjdGlvblsxXSk7IC8vIHB1c2ggc3RhdGVcbiAgICAgICAgICAgICAgICBzeW1ib2wgPSBudWxsO1xuICAgICAgICAgICAgICAgIGlmICghcHJlRXJyb3JTeW1ib2wpIHsgLy8gbm9ybWFsIGV4ZWN1dGlvbi9ubyBlcnJvclxuICAgICAgICAgICAgICAgICAgICB5eWxlbmcgPSB0aGlzLmxleGVyLnl5bGVuZztcbiAgICAgICAgICAgICAgICAgICAgeXl0ZXh0ID0gdGhpcy5sZXhlci55eXRleHQ7XG4gICAgICAgICAgICAgICAgICAgIHl5bGluZW5vID0gdGhpcy5sZXhlci55eWxpbmVubztcbiAgICAgICAgICAgICAgICAgICAgeXlsb2MgPSB0aGlzLmxleGVyLnl5bGxvYztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlY292ZXJpbmcgPiAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVjb3ZlcmluZy0tO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7IC8vIGVycm9yIGp1c3Qgb2NjdXJyZWQsIHJlc3VtZSBvbGQgbG9va2FoZWFkIGYvIGJlZm9yZSBlcnJvclxuICAgICAgICAgICAgICAgICAgICBzeW1ib2wgPSBwcmVFcnJvclN5bWJvbDtcbiAgICAgICAgICAgICAgICAgICAgcHJlRXJyb3JTeW1ib2wgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAyOiAvLyByZWR1Y2VcbiAgICAgICAgICAgICAgICAvL3RoaXMucmVkdWN0aW9uQ291bnQrKztcblxuICAgICAgICAgICAgICAgIGxlbiA9IHRoaXMucHJvZHVjdGlvbnNfW2FjdGlvblsxXV1bMV07XG5cbiAgICAgICAgICAgICAgICAvLyBwZXJmb3JtIHNlbWFudGljIGFjdGlvblxuICAgICAgICAgICAgICAgIHl5dmFsLiQgPSB2c3RhY2tbdnN0YWNrLmxlbmd0aC1sZW5dOyAvLyBkZWZhdWx0IHRvICQkID0gJDFcbiAgICAgICAgICAgICAgICAvLyBkZWZhdWx0IGxvY2F0aW9uLCB1c2VzIGZpcnN0IHRva2VuIGZvciBmaXJzdHMsIGxhc3QgZm9yIGxhc3RzXG4gICAgICAgICAgICAgICAgeXl2YWwuXyQgPSB7XG4gICAgICAgICAgICAgICAgICAgIGZpcnN0X2xpbmU6IGxzdGFja1tsc3RhY2subGVuZ3RoLShsZW58fDEpXS5maXJzdF9saW5lLFxuICAgICAgICAgICAgICAgICAgICBsYXN0X2xpbmU6IGxzdGFja1tsc3RhY2subGVuZ3RoLTFdLmxhc3RfbGluZSxcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RfY29sdW1uOiBsc3RhY2tbbHN0YWNrLmxlbmd0aC0obGVufHwxKV0uZmlyc3RfY29sdW1uLFxuICAgICAgICAgICAgICAgICAgICBsYXN0X2NvbHVtbjogbHN0YWNrW2xzdGFjay5sZW5ndGgtMV0ubGFzdF9jb2x1bW5cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHIgPSB0aGlzLnBlcmZvcm1BY3Rpb24uY2FsbCh5eXZhbCwgeXl0ZXh0LCB5eWxlbmcsIHl5bGluZW5vLCB0aGlzLnl5LCBhY3Rpb25bMV0sIHZzdGFjaywgbHN0YWNrKTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gcG9wIG9mZiBzdGFja1xuICAgICAgICAgICAgICAgIGlmIChsZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhY2sgPSBzdGFjay5zbGljZSgwLC0xKmxlbioyKTtcbiAgICAgICAgICAgICAgICAgICAgdnN0YWNrID0gdnN0YWNrLnNsaWNlKDAsIC0xKmxlbik7XG4gICAgICAgICAgICAgICAgICAgIGxzdGFjayA9IGxzdGFjay5zbGljZSgwLCAtMSpsZW4pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHN0YWNrLnB1c2godGhpcy5wcm9kdWN0aW9uc19bYWN0aW9uWzFdXVswXSk7ICAgIC8vIHB1c2ggbm9udGVybWluYWwgKHJlZHVjZSlcbiAgICAgICAgICAgICAgICB2c3RhY2sucHVzaCh5eXZhbC4kKTtcbiAgICAgICAgICAgICAgICBsc3RhY2sucHVzaCh5eXZhbC5fJCk7XG4gICAgICAgICAgICAgICAgLy8gZ290byBuZXcgc3RhdGUgPSB0YWJsZVtTVEFURV1bTk9OVEVSTUlOQUxdXG4gICAgICAgICAgICAgICAgbmV3U3RhdGUgPSB0YWJsZVtzdGFja1tzdGFjay5sZW5ndGgtMl1dW3N0YWNrW3N0YWNrLmxlbmd0aC0xXV07XG4gICAgICAgICAgICAgICAgc3RhY2sucHVzaChuZXdTdGF0ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgMzogLy8gYWNjZXB0XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufX07LyogSmlzb24gZ2VuZXJhdGVkIGxleGVyICovXG52YXIgbGV4ZXIgPSAoZnVuY3Rpb24oKXtcblxudmFyIGxleGVyID0gKHtFT0Y6MSxcbnBhcnNlRXJyb3I6ZnVuY3Rpb24gcGFyc2VFcnJvcihzdHIsIGhhc2gpIHtcbiAgICAgICAgaWYgKHRoaXMueXkucGFyc2VFcnJvcikge1xuICAgICAgICAgICAgdGhpcy55eS5wYXJzZUVycm9yKHN0ciwgaGFzaCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3Ioc3RyKTtcbiAgICAgICAgfVxuICAgIH0sXG5zZXRJbnB1dDpmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICAgICAgdGhpcy5faW5wdXQgPSBpbnB1dDtcbiAgICAgICAgdGhpcy5fbW9yZSA9IHRoaXMuX2xlc3MgPSB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy55eWxpbmVubyA9IHRoaXMueXlsZW5nID0gMDtcbiAgICAgICAgdGhpcy55eXRleHQgPSB0aGlzLm1hdGNoZWQgPSB0aGlzLm1hdGNoID0gJyc7XG4gICAgICAgIHRoaXMuY29uZGl0aW9uU3RhY2sgPSBbJ0lOSVRJQUwnXTtcbiAgICAgICAgdGhpcy55eWxsb2MgPSB7Zmlyc3RfbGluZToxLGZpcnN0X2NvbHVtbjowLGxhc3RfbGluZToxLGxhc3RfY29sdW1uOjB9O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuaW5wdXQ6ZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY2ggPSB0aGlzLl9pbnB1dFswXTtcbiAgICAgICAgdGhpcy55eXRleHQrPWNoO1xuICAgICAgICB0aGlzLnl5bGVuZysrO1xuICAgICAgICB0aGlzLm1hdGNoKz1jaDtcbiAgICAgICAgdGhpcy5tYXRjaGVkKz1jaDtcbiAgICAgICAgdmFyIGxpbmVzID0gY2gubWF0Y2goL1xcbi8pO1xuICAgICAgICBpZiAobGluZXMpIHRoaXMueXlsaW5lbm8rKztcbiAgICAgICAgdGhpcy5faW5wdXQgPSB0aGlzLl9pbnB1dC5zbGljZSgxKTtcbiAgICAgICAgcmV0dXJuIGNoO1xuICAgIH0sXG51bnB1dDpmdW5jdGlvbiAoY2gpIHtcbiAgICAgICAgdGhpcy5faW5wdXQgPSBjaCArIHRoaXMuX2lucHV0O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxubW9yZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX21vcmUgPSB0cnVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxucGFzdElucHV0OmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBhc3QgPSB0aGlzLm1hdGNoZWQuc3Vic3RyKDAsIHRoaXMubWF0Y2hlZC5sZW5ndGggLSB0aGlzLm1hdGNoLmxlbmd0aCk7XG4gICAgICAgIHJldHVybiAocGFzdC5sZW5ndGggPiAyMCA/ICcuLi4nOicnKSArIHBhc3Quc3Vic3RyKC0yMCkucmVwbGFjZSgvXFxuL2csIFwiXCIpO1xuICAgIH0sXG51cGNvbWluZ0lucHV0OmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5leHQgPSB0aGlzLm1hdGNoO1xuICAgICAgICBpZiAobmV4dC5sZW5ndGggPCAyMCkge1xuICAgICAgICAgICAgbmV4dCArPSB0aGlzLl9pbnB1dC5zdWJzdHIoMCwgMjAtbmV4dC5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAobmV4dC5zdWJzdHIoMCwyMCkrKG5leHQubGVuZ3RoID4gMjAgPyAnLi4uJzonJykpLnJlcGxhY2UoL1xcbi9nLCBcIlwiKTtcbiAgICB9LFxuc2hvd1Bvc2l0aW9uOmZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHByZSA9IHRoaXMucGFzdElucHV0KCk7XG4gICAgICAgIHZhciBjID0gbmV3IEFycmF5KHByZS5sZW5ndGggKyAxKS5qb2luKFwiLVwiKTtcbiAgICAgICAgcmV0dXJuIHByZSArIHRoaXMudXBjb21pbmdJbnB1dCgpICsgXCJcXG5cIiArIGMrXCJeXCI7XG4gICAgfSxcbm5leHQ6ZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5FT0Y7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLl9pbnB1dCkgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgICB2YXIgdG9rZW4sXG4gICAgICAgICAgICBtYXRjaCxcbiAgICAgICAgICAgIGNvbCxcbiAgICAgICAgICAgIGxpbmVzO1xuICAgICAgICBpZiAoIXRoaXMuX21vcmUpIHtcbiAgICAgICAgICAgIHRoaXMueXl0ZXh0ID0gJyc7XG4gICAgICAgICAgICB0aGlzLm1hdGNoID0gJyc7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJ1bGVzID0gdGhpcy5fY3VycmVudFJ1bGVzKCk7XG4gICAgICAgIGZvciAodmFyIGk9MDtpIDwgcnVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG1hdGNoID0gdGhpcy5faW5wdXQubWF0Y2godGhpcy5ydWxlc1tydWxlc1tpXV0pO1xuICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgbGluZXMgPSBtYXRjaFswXS5tYXRjaCgvXFxuLiovZyk7XG4gICAgICAgICAgICAgICAgaWYgKGxpbmVzKSB0aGlzLnl5bGluZW5vICs9IGxpbmVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB0aGlzLnl5bGxvYyA9IHtmaXJzdF9saW5lOiB0aGlzLnl5bGxvYy5sYXN0X2xpbmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdF9saW5lOiB0aGlzLnl5bGluZW5vKzEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RfY29sdW1uOiB0aGlzLnl5bGxvYy5sYXN0X2NvbHVtbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0X2NvbHVtbjogbGluZXMgPyBsaW5lc1tsaW5lcy5sZW5ndGgtMV0ubGVuZ3RoLTEgOiB0aGlzLnl5bGxvYy5sYXN0X2NvbHVtbiArIG1hdGNoWzBdLmxlbmd0aH1cbiAgICAgICAgICAgICAgICB0aGlzLnl5dGV4dCArPSBtYXRjaFswXTtcbiAgICAgICAgICAgICAgICB0aGlzLm1hdGNoICs9IG1hdGNoWzBdO1xuICAgICAgICAgICAgICAgIHRoaXMubWF0Y2hlcyA9IG1hdGNoO1xuICAgICAgICAgICAgICAgIHRoaXMueXlsZW5nID0gdGhpcy55eXRleHQubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHRoaXMuX21vcmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9pbnB1dCA9IHRoaXMuX2lucHV0LnNsaWNlKG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tYXRjaGVkICs9IG1hdGNoWzBdO1xuICAgICAgICAgICAgICAgIHRva2VuID0gdGhpcy5wZXJmb3JtQWN0aW9uLmNhbGwodGhpcywgdGhpcy55eSwgdGhpcywgcnVsZXNbaV0sdGhpcy5jb25kaXRpb25TdGFja1t0aGlzLmNvbmRpdGlvblN0YWNrLmxlbmd0aC0xXSk7XG4gICAgICAgICAgICAgICAgaWYgKHRva2VuKSByZXR1cm4gdG9rZW47XG4gICAgICAgICAgICAgICAgZWxzZSByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX2lucHV0ID09PSBcIlwiKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5FT0Y7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBhcnNlRXJyb3IoJ0xleGljYWwgZXJyb3Igb24gbGluZSAnKyh0aGlzLnl5bGluZW5vKzEpKycuIFVucmVjb2duaXplZCB0ZXh0LlxcbicrdGhpcy5zaG93UG9zaXRpb24oKSxcbiAgICAgICAgICAgICAgICAgICAge3RleHQ6IFwiXCIsIHRva2VuOiBudWxsLCBsaW5lOiB0aGlzLnl5bGluZW5vfSk7XG4gICAgICAgIH1cbiAgICB9LFxubGV4OmZ1bmN0aW9uIGxleCgpIHtcbiAgICAgICAgdmFyIHIgPSB0aGlzLm5leHQoKTtcbiAgICAgICAgaWYgKHR5cGVvZiByICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5sZXgoKTtcbiAgICAgICAgfVxuICAgIH0sXG5iZWdpbjpmdW5jdGlvbiBiZWdpbihjb25kaXRpb24pIHtcbiAgICAgICAgdGhpcy5jb25kaXRpb25TdGFjay5wdXNoKGNvbmRpdGlvbik7XG4gICAgfSxcbnBvcFN0YXRlOmZ1bmN0aW9uIHBvcFN0YXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb25TdGFjay5wb3AoKTtcbiAgICB9LFxuX2N1cnJlbnRSdWxlczpmdW5jdGlvbiBfY3VycmVudFJ1bGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25kaXRpb25zW3RoaXMuY29uZGl0aW9uU3RhY2tbdGhpcy5jb25kaXRpb25TdGFjay5sZW5ndGgtMV1dLnJ1bGVzO1xuICAgIH0sXG50b3BTdGF0ZTpmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvblN0YWNrW3RoaXMuY29uZGl0aW9uU3RhY2subGVuZ3RoLTJdO1xuICAgIH0sXG5wdXNoU3RhdGU6ZnVuY3Rpb24gYmVnaW4oY29uZGl0aW9uKSB7XG4gICAgICAgIHRoaXMuYmVnaW4oY29uZGl0aW9uKTtcbiAgICB9fSk7XG5sZXhlci5wZXJmb3JtQWN0aW9uID0gZnVuY3Rpb24gYW5vbnltb3VzKHl5LHl5XywkYXZvaWRpbmdfbmFtZV9jb2xsaXNpb25zLFlZX1NUQVJUKSB7XG5cbnZhciBZWVNUQVRFPVlZX1NUQVJUO1xuc3dpdGNoKCRhdm9pZGluZ19uYW1lX2NvbGxpc2lvbnMpIHtcbmNhc2UgMDovKiBza2lwIHdoaXRlc3BhY2UgKi9cbmJyZWFrO1xuY2FzZSAxOnJldHVybiAyMFxuYnJlYWs7XG5jYXNlIDI6cmV0dXJuIDE5XG5icmVhaztcbmNhc2UgMzpyZXR1cm4gOFxuYnJlYWs7XG5jYXNlIDQ6cmV0dXJuIDlcbmJyZWFrO1xuY2FzZSA1OnJldHVybiA2XG5icmVhaztcbmNhc2UgNjpyZXR1cm4gN1xuYnJlYWs7XG5jYXNlIDc6cmV0dXJuIDExXG5icmVhaztcbmNhc2UgODpyZXR1cm4gMTNcbmJyZWFrO1xuY2FzZSA5OnJldHVybiAxMFxuYnJlYWs7XG5jYXNlIDEwOnJldHVybiAxMlxuYnJlYWs7XG5jYXNlIDExOnJldHVybiAxNFxuYnJlYWs7XG5jYXNlIDEyOnJldHVybiAxNVxuYnJlYWs7XG5jYXNlIDEzOnJldHVybiAxNlxuYnJlYWs7XG5jYXNlIDE0OnJldHVybiAxN1xuYnJlYWs7XG5jYXNlIDE1OnJldHVybiAxOFxuYnJlYWs7XG5jYXNlIDE2OnJldHVybiA1XG5icmVhaztcbmNhc2UgMTc6cmV0dXJuICdJTlZBTElEJ1xuYnJlYWs7XG59XG59O1xubGV4ZXIucnVsZXMgPSBbL15cXHMrLywvXlswLTldKyhcXC5bMC05XSspP1xcYi8sL15uXFxiLywvXlxcfFxcfC8sL14mJi8sL15cXD8vLC9eOi8sL148PS8sL14+PS8sL148LywvXj4vLC9eIT0vLC9ePT0vLC9eJS8sL15cXCgvLC9eXFwpLywvXiQvLC9eLi9dO1xubGV4ZXIuY29uZGl0aW9ucyA9IHtcIklOSVRJQUxcIjp7XCJydWxlc1wiOlswLDEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzLDE0LDE1LDE2LDE3XSxcImluY2x1c2l2ZVwiOnRydWV9fTtyZXR1cm4gbGV4ZXI7fSkoKVxucGFyc2VyLmxleGVyID0gbGV4ZXI7XG5yZXR1cm4gcGFyc2VyO1xufSkoKTtcbi8vIEVuZCBwYXJzZXJcblxuICAvLyBIYW5kbGUgbm9kZSwgYW1kLCBhbmQgZ2xvYmFsIHN5c3RlbXNcbiAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gSmVkO1xuICAgIH1cbiAgICBleHBvcnRzLkplZCA9IEplZDtcbiAgfVxuICBlbHNlIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBKZWQ7XG4gICAgICB9KTtcbiAgICB9XG4gICAgLy8gTGVhayBhIGdsb2JhbCByZWdhcmRsZXNzIG9mIG1vZHVsZSBzeXN0ZW1cbiAgICByb290WydKZWQnXSA9IEplZDtcbiAgfVxuXG59KSh0aGlzKTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgRGF0YVZpZXcgPSBnZXROYXRpdmUocm9vdCwgJ0RhdGFWaWV3Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0YVZpZXc7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyksXG4gICAgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIFByb21pc2UgPSBnZXROYXRpdmUocm9vdCwgJ1Byb21pc2UnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9taXNlO1xuIiwidmFyIGdldE5hdGl2ZSA9IHJlcXVpcmUoJy4vX2dldE5hdGl2ZScpLFxuICAgIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHRoYXQgYXJlIHZlcmlmaWVkIHRvIGJlIG5hdGl2ZS4gKi9cbnZhciBTZXQgPSBnZXROYXRpdmUocm9vdCwgJ1NldCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNldDtcbiIsInZhciBMaXN0Q2FjaGUgPSByZXF1aXJlKCcuL19MaXN0Q2FjaGUnKSxcbiAgICBzdGFja0NsZWFyID0gcmVxdWlyZSgnLi9fc3RhY2tDbGVhcicpLFxuICAgIHN0YWNrRGVsZXRlID0gcmVxdWlyZSgnLi9fc3RhY2tEZWxldGUnKSxcbiAgICBzdGFja0dldCA9IHJlcXVpcmUoJy4vX3N0YWNrR2V0JyksXG4gICAgc3RhY2tIYXMgPSByZXF1aXJlKCcuL19zdGFja0hhcycpLFxuICAgIHN0YWNrU2V0ID0gcmVxdWlyZSgnLi9fc3RhY2tTZXQnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgc3RhY2sgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU3RhY2soZW50cmllcykge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTGlzdENhY2hlKGVudHJpZXMpO1xuICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTdGFja2AuXG5TdGFjay5wcm90b3R5cGUuY2xlYXIgPSBzdGFja0NsZWFyO1xuU3RhY2sucHJvdG90eXBlWydkZWxldGUnXSA9IHN0YWNrRGVsZXRlO1xuU3RhY2sucHJvdG90eXBlLmdldCA9IHN0YWNrR2V0O1xuU3RhY2sucHJvdG90eXBlLmhhcyA9IHN0YWNrSGFzO1xuU3RhY2sucHJvdG90eXBlLnNldCA9IHN0YWNrU2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0YWNrO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFVpbnQ4QXJyYXkgPSByb290LlVpbnQ4QXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gVWludDhBcnJheTtcbiIsInZhciBnZXROYXRpdmUgPSByZXF1aXJlKCcuL19nZXROYXRpdmUnKSxcbiAgICByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB0aGF0IGFyZSB2ZXJpZmllZCB0byBiZSBuYXRpdmUuICovXG52YXIgV2Vha01hcCA9IGdldE5hdGl2ZShyb290LCAnV2Vha01hcCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdlYWtNYXA7XG4iLCIvKipcbiAqIEFkZHMgdGhlIGtleS12YWx1ZSBgcGFpcmAgdG8gYG1hcGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fSBwYWlyIFRoZSBrZXktdmFsdWUgcGFpciB0byBhZGQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBtYXBgLlxuICovXG5mdW5jdGlvbiBhZGRNYXBFbnRyeShtYXAsIHBhaXIpIHtcbiAgLy8gRG9uJ3QgcmV0dXJuIGBtYXAuc2V0YCBiZWNhdXNlIGl0J3Mgbm90IGNoYWluYWJsZSBpbiBJRSAxMS5cbiAgbWFwLnNldChwYWlyWzBdLCBwYWlyWzFdKTtcbiAgcmV0dXJuIG1hcDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhZGRNYXBFbnRyeTtcbiIsIi8qKlxuICogQWRkcyBgdmFsdWVgIHRvIGBzZXRgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc2V0IFRoZSBzZXQgdG8gbW9kaWZ5LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYWRkLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgc2V0YC5cbiAqL1xuZnVuY3Rpb24gYWRkU2V0RW50cnkoc2V0LCB2YWx1ZSkge1xuICAvLyBEb24ndCByZXR1cm4gYHNldC5hZGRgIGJlY2F1c2UgaXQncyBub3QgY2hhaW5hYmxlIGluIElFIDExLlxuICBzZXQuYWRkKHZhbHVlKTtcbiAgcmV0dXJuIHNldDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhZGRTZXRFbnRyeTtcbiIsIi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLm1hcGAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlXG4gKiBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgbWFwcGVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBhcnJheU1hcChhcnJheSwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoYXJyYXlbaW5kZXhdLCBpbmRleCwgYXJyYXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlNYXA7XG4iLCIvKipcbiAqIEFwcGVuZHMgdGhlIGVsZW1lbnRzIG9mIGB2YWx1ZXNgIHRvIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byBhcHBlbmQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlQdXNoKGFycmF5LCB2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMubGVuZ3RoLFxuICAgICAgb2Zmc2V0ID0gYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgYXJyYXlbb2Zmc2V0ICsgaW5kZXhdID0gdmFsdWVzW2luZGV4XTtcbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlQdXNoO1xuIiwiLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8ucmVkdWNlYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3JcbiAqIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcGFyYW0geyp9IFthY2N1bXVsYXRvcl0gVGhlIGluaXRpYWwgdmFsdWUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtpbml0QWNjdW1dIFNwZWNpZnkgdXNpbmcgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYGFycmF5YCBhc1xuICogIHRoZSBpbml0aWFsIHZhbHVlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGFjY3VtdWxhdGVkIHZhbHVlLlxuICovXG5mdW5jdGlvbiBhcnJheVJlZHVjZShhcnJheSwgaXRlcmF0ZWUsIGFjY3VtdWxhdG9yLCBpbml0QWNjdW0pIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBhcnJheSA9PSBudWxsID8gMCA6IGFycmF5Lmxlbmd0aDtcblxuICBpZiAoaW5pdEFjY3VtICYmIGxlbmd0aCkge1xuICAgIGFjY3VtdWxhdG9yID0gYXJyYXlbKytpbmRleF07XG4gIH1cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhY2N1bXVsYXRvciA9IGl0ZXJhdGVlKGFjY3VtdWxhdG9yLCBhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSk7XG4gIH1cbiAgcmV0dXJuIGFjY3VtdWxhdG9yO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5UmVkdWNlO1xuIiwidmFyIGJhc2VBc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Jhc2VBc3NpZ25WYWx1ZScpLFxuICAgIGVxID0gcmVxdWlyZSgnLi9lcScpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIEFzc2lnbnMgYHZhbHVlYCB0byBga2V5YCBvZiBgb2JqZWN0YCBpZiB0aGUgZXhpc3RpbmcgdmFsdWUgaXMgbm90IGVxdWl2YWxlbnRcbiAqIHVzaW5nIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBmb3IgZXF1YWxpdHkgY29tcGFyaXNvbnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHZhciBvYmpWYWx1ZSA9IG9iamVjdFtrZXldO1xuICBpZiAoIShoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBlcShvYmpWYWx1ZSwgdmFsdWUpKSB8fFxuICAgICAgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkpIHtcbiAgICBiYXNlQXNzaWduVmFsdWUob2JqZWN0LCBrZXksIHZhbHVlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnblZhbHVlO1xuIiwidmFyIGNvcHlPYmplY3QgPSByZXF1aXJlKCcuL19jb3B5T2JqZWN0JyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmFzc2lnbmAgd2l0aG91dCBzdXBwb3J0IGZvciBtdWx0aXBsZSBzb3VyY2VzXG4gKiBvciBgY3VzdG9taXplcmAgZnVuY3Rpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnbihvYmplY3QsIHNvdXJjZSkge1xuICByZXR1cm4gb2JqZWN0ICYmIGNvcHlPYmplY3Qoc291cmNlLCBrZXlzKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUFzc2lnbjtcbiIsInZhciBjb3B5T2JqZWN0ID0gcmVxdWlyZSgnLi9fY29weU9iamVjdCcpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4va2V5c0luJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uYXNzaWduSW5gIHdpdGhvdXQgc3VwcG9ydCBmb3IgbXVsdGlwbGUgc291cmNlc1xuICogb3IgYGN1c3RvbWl6ZXJgIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VBc3NpZ25JbihvYmplY3QsIHNvdXJjZSkge1xuICByZXR1cm4gb2JqZWN0ICYmIGNvcHlPYmplY3Qoc291cmNlLCBrZXlzSW4oc291cmNlKSwgb2JqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQXNzaWduSW47XG4iLCJ2YXIgZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19kZWZpbmVQcm9wZXJ0eScpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBhc3NpZ25WYWx1ZWAgYW5kIGBhc3NpZ25NZXJnZVZhbHVlYCB3aXRob3V0XG4gKiB2YWx1ZSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGFzc2lnbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGFzc2lnbi5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnblZhbHVlKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBpZiAoa2V5ID09ICdfX3Byb3RvX18nICYmIGRlZmluZVByb3BlcnR5KSB7XG4gICAgZGVmaW5lUHJvcGVydHkob2JqZWN0LCBrZXksIHtcbiAgICAgICdjb25maWd1cmFibGUnOiB0cnVlLFxuICAgICAgJ2VudW1lcmFibGUnOiB0cnVlLFxuICAgICAgJ3ZhbHVlJzogdmFsdWUsXG4gICAgICAnd3JpdGFibGUnOiB0cnVlXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VBc3NpZ25WYWx1ZTtcbiIsInZhciBTdGFjayA9IHJlcXVpcmUoJy4vX1N0YWNrJyksXG4gICAgYXJyYXlFYWNoID0gcmVxdWlyZSgnLi9fYXJyYXlFYWNoJyksXG4gICAgYXNzaWduVmFsdWUgPSByZXF1aXJlKCcuL19hc3NpZ25WYWx1ZScpLFxuICAgIGJhc2VBc3NpZ24gPSByZXF1aXJlKCcuL19iYXNlQXNzaWduJyksXG4gICAgYmFzZUFzc2lnbkluID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnbkluJyksXG4gICAgY2xvbmVCdWZmZXIgPSByZXF1aXJlKCcuL19jbG9uZUJ1ZmZlcicpLFxuICAgIGNvcHlBcnJheSA9IHJlcXVpcmUoJy4vX2NvcHlBcnJheScpLFxuICAgIGNvcHlTeW1ib2xzID0gcmVxdWlyZSgnLi9fY29weVN5bWJvbHMnKSxcbiAgICBjb3B5U3ltYm9sc0luID0gcmVxdWlyZSgnLi9fY29weVN5bWJvbHNJbicpLFxuICAgIGdldEFsbEtleXMgPSByZXF1aXJlKCcuL19nZXRBbGxLZXlzJyksXG4gICAgZ2V0QWxsS2V5c0luID0gcmVxdWlyZSgnLi9fZ2V0QWxsS2V5c0luJyksXG4gICAgZ2V0VGFnID0gcmVxdWlyZSgnLi9fZ2V0VGFnJyksXG4gICAgaW5pdENsb25lQXJyYXkgPSByZXF1aXJlKCcuL19pbml0Q2xvbmVBcnJheScpLFxuICAgIGluaXRDbG9uZUJ5VGFnID0gcmVxdWlyZSgnLi9faW5pdENsb25lQnlUYWcnKSxcbiAgICBpbml0Q2xvbmVPYmplY3QgPSByZXF1aXJlKCcuL19pbml0Q2xvbmVPYmplY3QnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNCdWZmZXIgPSByZXF1aXJlKCcuL2lzQnVmZmVyJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4va2V5cycpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBjbG9uaW5nLiAqL1xudmFyIENMT05FX0RFRVBfRkxBRyA9IDEsXG4gICAgQ0xPTkVfRkxBVF9GTEFHID0gMixcbiAgICBDTE9ORV9TWU1CT0xTX0ZMQUcgPSA0O1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJnc1RhZyA9ICdbb2JqZWN0IEFyZ3VtZW50c10nLFxuICAgIGFycmF5VGFnID0gJ1tvYmplY3QgQXJyYXldJyxcbiAgICBib29sVGFnID0gJ1tvYmplY3QgQm9vbGVhbl0nLFxuICAgIGRhdGVUYWcgPSAnW29iamVjdCBEYXRlXScsXG4gICAgZXJyb3JUYWcgPSAnW29iamVjdCBFcnJvcl0nLFxuICAgIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXScsXG4gICAgbWFwVGFnID0gJ1tvYmplY3QgTWFwXScsXG4gICAgbnVtYmVyVGFnID0gJ1tvYmplY3QgTnVtYmVyXScsXG4gICAgb2JqZWN0VGFnID0gJ1tvYmplY3QgT2JqZWN0XScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIGlkZW50aWZ5IGB0b1N0cmluZ1RhZ2AgdmFsdWVzIHN1cHBvcnRlZCBieSBgXy5jbG9uZWAuICovXG52YXIgY2xvbmVhYmxlVGFncyA9IHt9O1xuY2xvbmVhYmxlVGFnc1thcmdzVGFnXSA9IGNsb25lYWJsZVRhZ3NbYXJyYXlUYWddID1cbmNsb25lYWJsZVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gY2xvbmVhYmxlVGFnc1tkYXRhVmlld1RhZ10gPVxuY2xvbmVhYmxlVGFnc1tib29sVGFnXSA9IGNsb25lYWJsZVRhZ3NbZGF0ZVRhZ10gPVxuY2xvbmVhYmxlVGFnc1tmbG9hdDMyVGFnXSA9IGNsb25lYWJsZVRhZ3NbZmxvYXQ2NFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tpbnQ4VGFnXSA9IGNsb25lYWJsZVRhZ3NbaW50MTZUYWddID1cbmNsb25lYWJsZVRhZ3NbaW50MzJUYWddID0gY2xvbmVhYmxlVGFnc1ttYXBUYWddID1cbmNsb25lYWJsZVRhZ3NbbnVtYmVyVGFnXSA9IGNsb25lYWJsZVRhZ3Nbb2JqZWN0VGFnXSA9XG5jbG9uZWFibGVUYWdzW3JlZ2V4cFRhZ10gPSBjbG9uZWFibGVUYWdzW3NldFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tzdHJpbmdUYWddID0gY2xvbmVhYmxlVGFnc1tzeW1ib2xUYWddID1cbmNsb25lYWJsZVRhZ3NbdWludDhUYWddID0gY2xvbmVhYmxlVGFnc1t1aW50OENsYW1wZWRUYWddID1cbmNsb25lYWJsZVRhZ3NbdWludDE2VGFnXSA9IGNsb25lYWJsZVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG5jbG9uZWFibGVUYWdzW2Vycm9yVGFnXSA9IGNsb25lYWJsZVRhZ3NbZnVuY1RhZ10gPVxuY2xvbmVhYmxlVGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmNsb25lYCBhbmQgYF8uY2xvbmVEZWVwYCB3aGljaCB0cmFja3NcbiAqIHRyYXZlcnNlZCBvYmplY3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYml0bWFzayBUaGUgYml0bWFzayBmbGFncy5cbiAqICAxIC0gRGVlcCBjbG9uZVxuICogIDIgLSBGbGF0dGVuIGluaGVyaXRlZCBwcm9wZXJ0aWVzXG4gKiAgNCAtIENsb25lIHN5bWJvbHNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNsb25pbmcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2tleV0gVGhlIGtleSBvZiBgdmFsdWVgLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBwYXJlbnQgb2JqZWN0IG9mIGB2YWx1ZWAuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIG9iamVjdHMgYW5kIHRoZWlyIGNsb25lIGNvdW50ZXJwYXJ0cy5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBjbG9uZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGJhc2VDbG9uZSh2YWx1ZSwgYml0bWFzaywgY3VzdG9taXplciwga2V5LCBvYmplY3QsIHN0YWNrKSB7XG4gIHZhciByZXN1bHQsXG4gICAgICBpc0RlZXAgPSBiaXRtYXNrICYgQ0xPTkVfREVFUF9GTEFHLFxuICAgICAgaXNGbGF0ID0gYml0bWFzayAmIENMT05FX0ZMQVRfRkxBRyxcbiAgICAgIGlzRnVsbCA9IGJpdG1hc2sgJiBDTE9ORV9TWU1CT0xTX0ZMQUc7XG5cbiAgaWYgKGN1c3RvbWl6ZXIpIHtcbiAgICByZXN1bHQgPSBvYmplY3QgPyBjdXN0b21pemVyKHZhbHVlLCBrZXksIG9iamVjdCwgc3RhY2spIDogY3VzdG9taXplcih2YWx1ZSk7XG4gIH1cbiAgaWYgKHJlc3VsdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKTtcbiAgaWYgKGlzQXJyKSB7XG4gICAgcmVzdWx0ID0gaW5pdENsb25lQXJyYXkodmFsdWUpO1xuICAgIGlmICghaXNEZWVwKSB7XG4gICAgICByZXR1cm4gY29weUFycmF5KHZhbHVlLCByZXN1bHQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgdGFnID0gZ2V0VGFnKHZhbHVlKSxcbiAgICAgICAgaXNGdW5jID0gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZztcblxuICAgIGlmIChpc0J1ZmZlcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjbG9uZUJ1ZmZlcih2YWx1ZSwgaXNEZWVwKTtcbiAgICB9XG4gICAgaWYgKHRhZyA9PSBvYmplY3RUYWcgfHwgdGFnID09IGFyZ3NUYWcgfHwgKGlzRnVuYyAmJiAhb2JqZWN0KSkge1xuICAgICAgcmVzdWx0ID0gKGlzRmxhdCB8fCBpc0Z1bmMpID8ge30gOiBpbml0Q2xvbmVPYmplY3QodmFsdWUpO1xuICAgICAgaWYgKCFpc0RlZXApIHtcbiAgICAgICAgcmV0dXJuIGlzRmxhdFxuICAgICAgICAgID8gY29weVN5bWJvbHNJbih2YWx1ZSwgYmFzZUFzc2lnbkluKHJlc3VsdCwgdmFsdWUpKVxuICAgICAgICAgIDogY29weVN5bWJvbHModmFsdWUsIGJhc2VBc3NpZ24ocmVzdWx0LCB2YWx1ZSkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIWNsb25lYWJsZVRhZ3NbdGFnXSkge1xuICAgICAgICByZXR1cm4gb2JqZWN0ID8gdmFsdWUgOiB7fTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IGluaXRDbG9uZUJ5VGFnKHZhbHVlLCB0YWcsIGJhc2VDbG9uZSwgaXNEZWVwKTtcbiAgICB9XG4gIH1cbiAgLy8gQ2hlY2sgZm9yIGNpcmN1bGFyIHJlZmVyZW5jZXMgYW5kIHJldHVybiBpdHMgY29ycmVzcG9uZGluZyBjbG9uZS5cbiAgc3RhY2sgfHwgKHN0YWNrID0gbmV3IFN0YWNrKTtcbiAgdmFyIHN0YWNrZWQgPSBzdGFjay5nZXQodmFsdWUpO1xuICBpZiAoc3RhY2tlZCkge1xuICAgIHJldHVybiBzdGFja2VkO1xuICB9XG4gIHN0YWNrLnNldCh2YWx1ZSwgcmVzdWx0KTtcblxuICB2YXIga2V5c0Z1bmMgPSBpc0Z1bGxcbiAgICA/IChpc0ZsYXQgPyBnZXRBbGxLZXlzSW4gOiBnZXRBbGxLZXlzKVxuICAgIDogKGlzRmxhdCA/IGtleXNJbiA6IGtleXMpO1xuXG4gIHZhciBwcm9wcyA9IGlzQXJyID8gdW5kZWZpbmVkIDoga2V5c0Z1bmModmFsdWUpO1xuICBhcnJheUVhY2gocHJvcHMgfHwgdmFsdWUsIGZ1bmN0aW9uKHN1YlZhbHVlLCBrZXkpIHtcbiAgICBpZiAocHJvcHMpIHtcbiAgICAgIGtleSA9IHN1YlZhbHVlO1xuICAgICAgc3ViVmFsdWUgPSB2YWx1ZVtrZXldO1xuICAgIH1cbiAgICAvLyBSZWN1cnNpdmVseSBwb3B1bGF0ZSBjbG9uZSAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGFzc2lnblZhbHVlKHJlc3VsdCwga2V5LCBiYXNlQ2xvbmUoc3ViVmFsdWUsIGJpdG1hc2ssIGN1c3RvbWl6ZXIsIGtleSwgdmFsdWUsIHN0YWNrKSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VDbG9uZTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0Q3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5jcmVhdGVgIHdpdGhvdXQgc3VwcG9ydCBmb3IgYXNzaWduaW5nXG4gKiBwcm9wZXJ0aWVzIHRvIHRoZSBjcmVhdGVkIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHByb3RvIFRoZSBvYmplY3QgdG8gaW5oZXJpdCBmcm9tLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbmV3IG9iamVjdC5cbiAqL1xudmFyIGJhc2VDcmVhdGUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIG9iamVjdCgpIHt9XG4gIHJldHVybiBmdW5jdGlvbihwcm90bykge1xuICAgIGlmICghaXNPYmplY3QocHJvdG8pKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGlmIChvYmplY3RDcmVhdGUpIHtcbiAgICAgIHJldHVybiBvYmplY3RDcmVhdGUocHJvdG8pO1xuICAgIH1cbiAgICBvYmplY3QucHJvdG90eXBlID0gcHJvdG87XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBvYmplY3Q7XG4gICAgb2JqZWN0LnByb3RvdHlwZSA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ3JlYXRlO1xuIiwidmFyIGFycmF5UHVzaCA9IHJlcXVpcmUoJy4vX2FycmF5UHVzaCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0QWxsS2V5c2AgYW5kIGBnZXRBbGxLZXlzSW5gIHdoaWNoIHVzZXNcbiAqIGBrZXlzRnVuY2AgYW5kIGBzeW1ib2xzRnVuY2AgdG8gZ2V0IHRoZSBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZFxuICogc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHN5bWJvbHNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0QWxsS2V5cyhvYmplY3QsIGtleXNGdW5jLCBzeW1ib2xzRnVuYykge1xuICB2YXIgcmVzdWx0ID0ga2V5c0Z1bmMob2JqZWN0KTtcbiAgcmV0dXJuIGlzQXJyYXkob2JqZWN0KSA/IHJlc3VsdCA6IGFycmF5UHVzaChyZXN1bHQsIHN5bWJvbHNGdW5jKG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VHZXRBbGxLZXlzO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGdldFJhd1RhZyA9IHJlcXVpcmUoJy4vX2dldFJhd1RhZycpLFxuICAgIG9iamVjdFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fb2JqZWN0VG9TdHJpbmcnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG51bGxUYWcgPSAnW29iamVjdCBOdWxsXScsXG4gICAgdW5kZWZpbmVkVGFnID0gJ1tvYmplY3QgVW5kZWZpbmVkXSc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgfVxuICB2YWx1ZSA9IE9iamVjdCh2YWx1ZSk7XG4gIHJldHVybiAoc3ltVG9TdHJpbmdUYWcgJiYgc3ltVG9TdHJpbmdUYWcgaW4gdmFsdWUpXG4gICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUdldFRhZztcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaGFzYCB3aXRob3V0IHN1cHBvcnQgZm9yIGRlZXAgcGF0aHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IGtleSBUaGUga2V5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSGFzKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlSGFzO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIGlzUHJvdG90eXBlID0gcmVxdWlyZSgnLi9faXNQcm90b3R5cGUnKSxcbiAgICBuYXRpdmVLZXlzSW4gPSByZXF1aXJlKCcuL19uYXRpdmVLZXlzSW4nKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzSW5gIHdoaWNoIGRvZXNuJ3QgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUtleXNJbihvYmplY3QpIHtcbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXNJbihvYmplY3QpO1xuICB9XG4gIHZhciBpc1Byb3RvID0gaXNQcm90b3R5cGUob2JqZWN0KSxcbiAgICAgIHJlc3VsdCA9IFtdO1xuXG4gIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICBpZiAoIShrZXkgPT0gJ2NvbnN0cnVjdG9yJyAmJiAoaXNQcm90byB8fCAhaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlS2V5c0luO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGFycmF5TWFwID0gcmVxdWlyZSgnLi9fYXJyYXlNYXAnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIElORklOSVRZID0gMSAvIDA7XG5cbi8qKiBVc2VkIHRvIGNvbnZlcnQgc3ltYm9scyB0byBwcmltaXRpdmVzIGFuZCBzdHJpbmdzLiAqL1xudmFyIHN5bWJvbFByb3RvID0gU3ltYm9sID8gU3ltYm9sLnByb3RvdHlwZSA6IHVuZGVmaW5lZCxcbiAgICBzeW1ib2xUb1N0cmluZyA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udG9TdHJpbmcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udG9TdHJpbmdgIHdoaWNoIGRvZXNuJ3QgY29udmVydCBudWxsaXNoXG4gKiB2YWx1ZXMgdG8gZW1wdHkgc3RyaW5ncy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRvU3RyaW5nKHZhbHVlKSB7XG4gIC8vIEV4aXQgZWFybHkgZm9yIHN0cmluZ3MgdG8gYXZvaWQgYSBwZXJmb3JtYW5jZSBoaXQgaW4gc29tZSBlbnZpcm9ubWVudHMuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgLy8gUmVjdXJzaXZlbHkgY29udmVydCB2YWx1ZXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICByZXR1cm4gYXJyYXlNYXAodmFsdWUsIGJhc2VUb1N0cmluZykgKyAnJztcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIHN5bWJvbFRvU3RyaW5nID8gc3ltYm9sVG9TdHJpbmcuY2FsbCh2YWx1ZSkgOiAnJztcbiAgfVxuICB2YXIgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICByZXR1cm4gKHJlc3VsdCA9PSAnMCcgJiYgKDEgLyB2YWx1ZSkgPT0gLUlORklOSVRZKSA/ICctMCcgOiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRvU3RyaW5nO1xuIiwidmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc0tleSA9IHJlcXVpcmUoJy4vX2lzS2V5JyksXG4gICAgc3RyaW5nVG9QYXRoID0gcmVxdWlyZSgnLi9fc3RyaW5nVG9QYXRoJyksXG4gICAgdG9TdHJpbmcgPSByZXF1aXJlKCcuL3RvU3RyaW5nJyk7XG5cbi8qKlxuICogQ2FzdHMgYHZhbHVlYCB0byBhIHBhdGggYXJyYXkgaWYgaXQncyBub3Qgb25lLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkga2V5cyBvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgY2FzdCBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICovXG5mdW5jdGlvbiBjYXN0UGF0aCh2YWx1ZSwgb2JqZWN0KSB7XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICByZXR1cm4gaXNLZXkodmFsdWUsIG9iamVjdCkgPyBbdmFsdWVdIDogc3RyaW5nVG9QYXRoKHRvU3RyaW5nKHZhbHVlKSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2FzdFBhdGg7XG4iLCJ2YXIgVWludDhBcnJheSA9IHJlcXVpcmUoJy4vX1VpbnQ4QXJyYXknKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYGFycmF5QnVmZmVyYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheUJ1ZmZlcn0gYXJyYXlCdWZmZXIgVGhlIGFycmF5IGJ1ZmZlciB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtBcnJheUJ1ZmZlcn0gUmV0dXJucyB0aGUgY2xvbmVkIGFycmF5IGJ1ZmZlci5cbiAqL1xuZnVuY3Rpb24gY2xvbmVBcnJheUJ1ZmZlcihhcnJheUJ1ZmZlcikge1xuICB2YXIgcmVzdWx0ID0gbmV3IGFycmF5QnVmZmVyLmNvbnN0cnVjdG9yKGFycmF5QnVmZmVyLmJ5dGVMZW5ndGgpO1xuICBuZXcgVWludDhBcnJheShyZXN1bHQpLnNldChuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcikpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lQXJyYXlCdWZmZXI7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBleHBvcnRzYC4gKi9cbnZhciBmcmVlRXhwb3J0cyA9IHR5cGVvZiBleHBvcnRzID09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgIWV4cG9ydHMubm9kZVR5cGUgJiYgZXhwb3J0cztcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBtb2R1bGVgLiAqL1xudmFyIGZyZWVNb2R1bGUgPSBmcmVlRXhwb3J0cyAmJiB0eXBlb2YgbW9kdWxlID09ICdvYmplY3QnICYmIG1vZHVsZSAmJiAhbW9kdWxlLm5vZGVUeXBlICYmIG1vZHVsZTtcblxuLyoqIERldGVjdCB0aGUgcG9wdWxhciBDb21tb25KUyBleHRlbnNpb24gYG1vZHVsZS5leHBvcnRzYC4gKi9cbnZhciBtb2R1bGVFeHBvcnRzID0gZnJlZU1vZHVsZSAmJiBmcmVlTW9kdWxlLmV4cG9ydHMgPT09IGZyZWVFeHBvcnRzO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBCdWZmZXIgPSBtb2R1bGVFeHBvcnRzID8gcm9vdC5CdWZmZXIgOiB1bmRlZmluZWQsXG4gICAgYWxsb2NVbnNhZmUgPSBCdWZmZXIgPyBCdWZmZXIuYWxsb2NVbnNhZmUgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mICBgYnVmZmVyYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtCdWZmZXJ9IGJ1ZmZlciBUaGUgYnVmZmVyIHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtCdWZmZXJ9IFJldHVybnMgdGhlIGNsb25lZCBidWZmZXIuXG4gKi9cbmZ1bmN0aW9uIGNsb25lQnVmZmVyKGJ1ZmZlciwgaXNEZWVwKSB7XG4gIGlmIChpc0RlZXApIHtcbiAgICByZXR1cm4gYnVmZmVyLnNsaWNlKCk7XG4gIH1cbiAgdmFyIGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBhbGxvY1Vuc2FmZSA/IGFsbG9jVW5zYWZlKGxlbmd0aCkgOiBuZXcgYnVmZmVyLmNvbnN0cnVjdG9yKGxlbmd0aCk7XG5cbiAgYnVmZmVyLmNvcHkocmVzdWx0KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZUJ1ZmZlcjtcbiIsInZhciBjbG9uZUFycmF5QnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVBcnJheUJ1ZmZlcicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgZGF0YVZpZXdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YVZpZXcgVGhlIGRhdGEgdmlldyB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgZGF0YSB2aWV3LlxuICovXG5mdW5jdGlvbiBjbG9uZURhdGFWaWV3KGRhdGFWaWV3LCBpc0RlZXApIHtcbiAgdmFyIGJ1ZmZlciA9IGlzRGVlcCA/IGNsb25lQXJyYXlCdWZmZXIoZGF0YVZpZXcuYnVmZmVyKSA6IGRhdGFWaWV3LmJ1ZmZlcjtcbiAgcmV0dXJuIG5ldyBkYXRhVmlldy5jb25zdHJ1Y3RvcihidWZmZXIsIGRhdGFWaWV3LmJ5dGVPZmZzZXQsIGRhdGFWaWV3LmJ5dGVMZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lRGF0YVZpZXc7XG4iLCJ2YXIgYWRkTWFwRW50cnkgPSByZXF1aXJlKCcuL19hZGRNYXBFbnRyeScpLFxuICAgIGFycmF5UmVkdWNlID0gcmVxdWlyZSgnLi9fYXJyYXlSZWR1Y2UnKSxcbiAgICBtYXBUb0FycmF5ID0gcmVxdWlyZSgnLi9fbWFwVG9BcnJheScpO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIGJpdG1hc2tzIGZvciBjbG9uaW5nLiAqL1xudmFyIENMT05FX0RFRVBfRkxBRyA9IDE7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGBtYXBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjbG9uZUZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNsb25lIHZhbHVlcy5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgbWFwLlxuICovXG5mdW5jdGlvbiBjbG9uZU1hcChtYXAsIGlzRGVlcCwgY2xvbmVGdW5jKSB7XG4gIHZhciBhcnJheSA9IGlzRGVlcCA/IGNsb25lRnVuYyhtYXBUb0FycmF5KG1hcCksIENMT05FX0RFRVBfRkxBRykgOiBtYXBUb0FycmF5KG1hcCk7XG4gIHJldHVybiBhcnJheVJlZHVjZShhcnJheSwgYWRkTWFwRW50cnksIG5ldyBtYXAuY29uc3RydWN0b3IpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lTWFwO1xuIiwiLyoqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGAgZmxhZ3MgZnJvbSB0aGVpciBjb2VyY2VkIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVGbGFncyA9IC9cXHcqJC87XG5cbi8qKlxuICogQ3JlYXRlcyBhIGNsb25lIG9mIGByZWdleHBgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gcmVnZXhwIFRoZSByZWdleHAgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgcmVnZXhwLlxuICovXG5mdW5jdGlvbiBjbG9uZVJlZ0V4cChyZWdleHApIHtcbiAgdmFyIHJlc3VsdCA9IG5ldyByZWdleHAuY29uc3RydWN0b3IocmVnZXhwLnNvdXJjZSwgcmVGbGFncy5leGVjKHJlZ2V4cCkpO1xuICByZXN1bHQubGFzdEluZGV4ID0gcmVnZXhwLmxhc3RJbmRleDtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZVJlZ0V4cDtcbiIsInZhciBhZGRTZXRFbnRyeSA9IHJlcXVpcmUoJy4vX2FkZFNldEVudHJ5JyksXG4gICAgYXJyYXlSZWR1Y2UgPSByZXF1aXJlKCcuL19hcnJheVJlZHVjZScpLFxuICAgIHNldFRvQXJyYXkgPSByZXF1aXJlKCcuL19zZXRUb0FycmF5Jyk7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGNsb25pbmcuICovXG52YXIgQ0xPTkVfREVFUF9GTEFHID0gMTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgY2xvbmUgb2YgYHNldGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXQgVGhlIHNldCB0byBjbG9uZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNsb25lRnVuYyBUaGUgZnVuY3Rpb24gdG8gY2xvbmUgdmFsdWVzLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNsb25lZCBzZXQuXG4gKi9cbmZ1bmN0aW9uIGNsb25lU2V0KHNldCwgaXNEZWVwLCBjbG9uZUZ1bmMpIHtcbiAgdmFyIGFycmF5ID0gaXNEZWVwID8gY2xvbmVGdW5jKHNldFRvQXJyYXkoc2V0KSwgQ0xPTkVfREVFUF9GTEFHKSA6IHNldFRvQXJyYXkoc2V0KTtcbiAgcmV0dXJuIGFycmF5UmVkdWNlKGFycmF5LCBhZGRTZXRFbnRyeSwgbmV3IHNldC5jb25zdHJ1Y3Rvcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2xvbmVTZXQ7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyk7XG5cbi8qKiBVc2VkIHRvIGNvbnZlcnQgc3ltYm9scyB0byBwcmltaXRpdmVzIGFuZCBzdHJpbmdzLiAqL1xudmFyIHN5bWJvbFByb3RvID0gU3ltYm9sID8gU3ltYm9sLnByb3RvdHlwZSA6IHVuZGVmaW5lZCxcbiAgICBzeW1ib2xWYWx1ZU9mID0gc3ltYm9sUHJvdG8gPyBzeW1ib2xQcm90by52YWx1ZU9mIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGUgYHN5bWJvbGAgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc3ltYm9sIFRoZSBzeW1ib2wgb2JqZWN0IHRvIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgY2xvbmVkIHN5bWJvbCBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGNsb25lU3ltYm9sKHN5bWJvbCkge1xuICByZXR1cm4gc3ltYm9sVmFsdWVPZiA/IE9iamVjdChzeW1ib2xWYWx1ZU9mLmNhbGwoc3ltYm9sKSkgOiB7fTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZVN5bWJvbDtcbiIsInZhciBjbG9uZUFycmF5QnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVBcnJheUJ1ZmZlcicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgdHlwZWRBcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSB0eXBlZEFycmF5IFRoZSB0eXBlZCBhcnJheSB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjbG9uZWQgdHlwZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGNsb25lVHlwZWRBcnJheSh0eXBlZEFycmF5LCBpc0RlZXApIHtcbiAgdmFyIGJ1ZmZlciA9IGlzRGVlcCA/IGNsb25lQXJyYXlCdWZmZXIodHlwZWRBcnJheS5idWZmZXIpIDogdHlwZWRBcnJheS5idWZmZXI7XG4gIHJldHVybiBuZXcgdHlwZWRBcnJheS5jb25zdHJ1Y3RvcihidWZmZXIsIHR5cGVkQXJyYXkuYnl0ZU9mZnNldCwgdHlwZWRBcnJheS5sZW5ndGgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsb25lVHlwZWRBcnJheTtcbiIsIi8qKlxuICogQ29waWVzIHRoZSB2YWx1ZXMgb2YgYHNvdXJjZWAgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gc291cmNlIFRoZSBhcnJheSB0byBjb3B5IHZhbHVlcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5PVtdXSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgdG8uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgYGFycmF5YC5cbiAqL1xuZnVuY3Rpb24gY29weUFycmF5KHNvdXJjZSwgYXJyYXkpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBzb3VyY2UubGVuZ3RoO1xuXG4gIGFycmF5IHx8IChhcnJheSA9IEFycmF5KGxlbmd0aCkpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGFycmF5W2luZGV4XSA9IHNvdXJjZVtpbmRleF07XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlBcnJheTtcbiIsInZhciBhc3NpZ25WYWx1ZSA9IHJlcXVpcmUoJy4vX2Fzc2lnblZhbHVlJyksXG4gICAgYmFzZUFzc2lnblZhbHVlID0gcmVxdWlyZSgnLi9fYmFzZUFzc2lnblZhbHVlJyk7XG5cbi8qKlxuICogQ29waWVzIHByb3BlcnRpZXMgb2YgYHNvdXJjZWAgdG8gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgZnJvbS5cbiAqIEBwYXJhbSB7QXJyYXl9IHByb3BzIFRoZSBwcm9wZXJ0eSBpZGVudGlmaWVycyB0byBjb3B5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIHRvLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgY29waWVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlPYmplY3Qoc291cmNlLCBwcm9wcywgb2JqZWN0LCBjdXN0b21pemVyKSB7XG4gIHZhciBpc05ldyA9ICFvYmplY3Q7XG4gIG9iamVjdCB8fCAob2JqZWN0ID0ge30pO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcblxuICAgIHZhciBuZXdWYWx1ZSA9IGN1c3RvbWl6ZXJcbiAgICAgID8gY3VzdG9taXplcihvYmplY3Rba2V5XSwgc291cmNlW2tleV0sIGtleSwgb2JqZWN0LCBzb3VyY2UpXG4gICAgICA6IHVuZGVmaW5lZDtcblxuICAgIGlmIChuZXdWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBuZXdWYWx1ZSA9IHNvdXJjZVtrZXldO1xuICAgIH1cbiAgICBpZiAoaXNOZXcpIHtcbiAgICAgIGJhc2VBc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhc3NpZ25WYWx1ZShvYmplY3QsIGtleSwgbmV3VmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlPYmplY3Q7XG4iLCJ2YXIgY29weU9iamVjdCA9IHJlcXVpcmUoJy4vX2NvcHlPYmplY3QnKSxcbiAgICBnZXRTeW1ib2xzID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9scycpO1xuXG4vKipcbiAqIENvcGllcyBvd24gc3ltYm9scyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyBmcm9tLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBzeW1ib2xzIHRvLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weVN5bWJvbHMoc291cmNlLCBvYmplY3QpIHtcbiAgcmV0dXJuIGNvcHlPYmplY3Qoc291cmNlLCBnZXRTeW1ib2xzKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY29weVN5bWJvbHM7XG4iLCJ2YXIgY29weU9iamVjdCA9IHJlcXVpcmUoJy4vX2NvcHlPYmplY3QnKSxcbiAgICBnZXRTeW1ib2xzSW4gPSByZXF1aXJlKCcuL19nZXRTeW1ib2xzSW4nKTtcblxuLyoqXG4gKiBDb3BpZXMgb3duIGFuZCBpbmhlcml0ZWQgc3ltYm9scyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgc3ltYm9scyBmcm9tLlxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3Q9e31dIFRoZSBvYmplY3QgdG8gY29weSBzeW1ib2xzIHRvLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gY29weVN5bWJvbHNJbihzb3VyY2UsIG9iamVjdCkge1xuICByZXR1cm4gY29weU9iamVjdChzb3VyY2UsIGdldFN5bWJvbHNJbihzb3VyY2UpLCBvYmplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNvcHlTeW1ib2xzSW47XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi9fZ2V0TmF0aXZlJyk7XG5cbnZhciBkZWZpbmVQcm9wZXJ0eSA9IChmdW5jdGlvbigpIHtcbiAgdHJ5IHtcbiAgICB2YXIgZnVuYyA9IGdldE5hdGl2ZShPYmplY3QsICdkZWZpbmVQcm9wZXJ0eScpO1xuICAgIGZ1bmMoe30sICcnLCB7fSk7XG4gICAgcmV0dXJuIGZ1bmM7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmluZVByb3BlcnR5O1xuIiwiLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxubW9kdWxlLmV4cG9ydHMgPSBmcmVlR2xvYmFsO1xuIiwidmFyIGJhc2VHZXRBbGxLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUdldEFsbEtleXMnKSxcbiAgICBnZXRTeW1ib2xzID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9scycpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuL2tleXMnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzIGFuZCBzeW1ib2xzLlxuICovXG5mdW5jdGlvbiBnZXRBbGxLZXlzKG9iamVjdCkge1xuICByZXR1cm4gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzLCBnZXRTeW1ib2xzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRBbGxLZXlzO1xuIiwidmFyIGJhc2VHZXRBbGxLZXlzID0gcmVxdWlyZSgnLi9fYmFzZUdldEFsbEtleXMnKSxcbiAgICBnZXRTeW1ib2xzSW4gPSByZXF1aXJlKCcuL19nZXRTeW1ib2xzSW4nKSxcbiAgICBrZXlzSW4gPSByZXF1aXJlKCcuL2tleXNJbicpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2Ygb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmRcbiAqIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgYW5kIHN5bWJvbHMuXG4gKi9cbmZ1bmN0aW9uIGdldEFsbEtleXNJbihvYmplY3QpIHtcbiAgcmV0dXJuIGJhc2VHZXRBbGxLZXlzKG9iamVjdCwga2V5c0luLCBnZXRTeW1ib2xzSW4pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEFsbEtleXNJbjtcbiIsInZhciBvdmVyQXJnID0gcmVxdWlyZSgnLi9fb3ZlckFyZycpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBnZXRQcm90b3R5cGUgPSBvdmVyQXJnKE9iamVjdC5nZXRQcm90b3R5cGVPZiwgT2JqZWN0KTtcblxubW9kdWxlLmV4cG9ydHMgPSBnZXRQcm90b3R5cGU7XG4iLCJ2YXIgb3ZlckFyZyA9IHJlcXVpcmUoJy4vX292ZXJBcmcnKSxcbiAgICBzdHViQXJyYXkgPSByZXF1aXJlKCcuL3N0dWJBcnJheScpO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlR2V0U3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBzeW1ib2xzLlxuICovXG52YXIgZ2V0U3ltYm9scyA9IG5hdGl2ZUdldFN5bWJvbHMgPyBvdmVyQXJnKG5hdGl2ZUdldFN5bWJvbHMsIE9iamVjdCkgOiBzdHViQXJyYXk7XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0U3ltYm9scztcbiIsInZhciBhcnJheVB1c2ggPSByZXF1aXJlKCcuL19hcnJheVB1c2gnKSxcbiAgICBnZXRQcm90b3R5cGUgPSByZXF1aXJlKCcuL19nZXRQcm90b3R5cGUnKSxcbiAgICBnZXRTeW1ib2xzID0gcmVxdWlyZSgnLi9fZ2V0U3ltYm9scycpLFxuICAgIHN0dWJBcnJheSA9IHJlcXVpcmUoJy4vc3R1YkFycmF5Jyk7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVHZXRTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2Ygc3ltYm9scy5cbiAqL1xudmFyIGdldFN5bWJvbHNJbiA9ICFuYXRpdmVHZXRTeW1ib2xzID8gc3R1YkFycmF5IDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgd2hpbGUgKG9iamVjdCkge1xuICAgIGFycmF5UHVzaChyZXN1bHQsIGdldFN5bWJvbHMob2JqZWN0KSk7XG4gICAgb2JqZWN0ID0gZ2V0UHJvdG90eXBlKG9iamVjdCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0U3ltYm9sc0luO1xuIiwidmFyIERhdGFWaWV3ID0gcmVxdWlyZSgnLi9fRGF0YVZpZXcnKSxcbiAgICBNYXAgPSByZXF1aXJlKCcuL19NYXAnKSxcbiAgICBQcm9taXNlID0gcmVxdWlyZSgnLi9fUHJvbWlzZScpLFxuICAgIFNldCA9IHJlcXVpcmUoJy4vX1NldCcpLFxuICAgIFdlYWtNYXAgPSByZXF1aXJlKCcuL19XZWFrTWFwJyksXG4gICAgYmFzZUdldFRhZyA9IHJlcXVpcmUoJy4vX2Jhc2VHZXRUYWcnKSxcbiAgICB0b1NvdXJjZSA9IHJlcXVpcmUoJy4vX3RvU291cmNlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICBwcm9taXNlVGFnID0gJ1tvYmplY3QgUHJvbWlzZV0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHdlYWtNYXBUYWcgPSAnW29iamVjdCBXZWFrTWFwXSc7XG5cbnZhciBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XSc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtYXBzLCBzZXRzLCBhbmQgd2Vha21hcHMuICovXG52YXIgZGF0YVZpZXdDdG9yU3RyaW5nID0gdG9Tb3VyY2UoRGF0YVZpZXcpLFxuICAgIG1hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShNYXApLFxuICAgIHByb21pc2VDdG9yU3RyaW5nID0gdG9Tb3VyY2UoUHJvbWlzZSksXG4gICAgc2V0Q3RvclN0cmluZyA9IHRvU291cmNlKFNldCksXG4gICAgd2Vha01hcEN0b3JTdHJpbmcgPSB0b1NvdXJjZShXZWFrTWFwKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBgdG9TdHJpbmdUYWdgIG9mIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xudmFyIGdldFRhZyA9IGJhc2VHZXRUYWc7XG5cbi8vIEZhbGxiYWNrIGZvciBkYXRhIHZpZXdzLCBtYXBzLCBzZXRzLCBhbmQgd2VhayBtYXBzIGluIElFIDExIGFuZCBwcm9taXNlcyBpbiBOb2RlLmpzIDwgNi5cbmlmICgoRGF0YVZpZXcgJiYgZ2V0VGFnKG5ldyBEYXRhVmlldyhuZXcgQXJyYXlCdWZmZXIoMSkpKSAhPSBkYXRhVmlld1RhZykgfHxcbiAgICAoTWFwICYmIGdldFRhZyhuZXcgTWFwKSAhPSBtYXBUYWcpIHx8XG4gICAgKFByb21pc2UgJiYgZ2V0VGFnKFByb21pc2UucmVzb2x2ZSgpKSAhPSBwcm9taXNlVGFnKSB8fFxuICAgIChTZXQgJiYgZ2V0VGFnKG5ldyBTZXQpICE9IHNldFRhZykgfHxcbiAgICAoV2Vha01hcCAmJiBnZXRUYWcobmV3IFdlYWtNYXApICE9IHdlYWtNYXBUYWcpKSB7XG4gIGdldFRhZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIHJlc3VsdCA9IGJhc2VHZXRUYWcodmFsdWUpLFxuICAgICAgICBDdG9yID0gcmVzdWx0ID09IG9iamVjdFRhZyA/IHZhbHVlLmNvbnN0cnVjdG9yIDogdW5kZWZpbmVkLFxuICAgICAgICBjdG9yU3RyaW5nID0gQ3RvciA/IHRvU291cmNlKEN0b3IpIDogJyc7XG5cbiAgICBpZiAoY3RvclN0cmluZykge1xuICAgICAgc3dpdGNoIChjdG9yU3RyaW5nKSB7XG4gICAgICAgIGNhc2UgZGF0YVZpZXdDdG9yU3RyaW5nOiByZXR1cm4gZGF0YVZpZXdUYWc7XG4gICAgICAgIGNhc2UgbWFwQ3RvclN0cmluZzogcmV0dXJuIG1hcFRhZztcbiAgICAgICAgY2FzZSBwcm9taXNlQ3RvclN0cmluZzogcmV0dXJuIHByb21pc2VUYWc7XG4gICAgICAgIGNhc2Ugc2V0Q3RvclN0cmluZzogcmV0dXJuIHNldFRhZztcbiAgICAgICAgY2FzZSB3ZWFrTWFwQ3RvclN0cmluZzogcmV0dXJuIHdlYWtNYXBUYWc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0VGFnO1xuIiwidmFyIGNhc3RQYXRoID0gcmVxdWlyZSgnLi9fY2FzdFBhdGgnKSxcbiAgICBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4vaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi9pc0FycmF5JyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vX2lzSW5kZXgnKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKSxcbiAgICB0b0tleSA9IHJlcXVpcmUoJy4vX3RvS2V5Jyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBwYXRoYCBleGlzdHMgb24gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIHRvIGNoZWNrLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFzRnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2sgcHJvcGVydGllcy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgcGF0aGAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc1BhdGgob2JqZWN0LCBwYXRoLCBoYXNGdW5jKSB7XG4gIHBhdGggPSBjYXN0UGF0aChwYXRoLCBvYmplY3QpO1xuXG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBmYWxzZTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSB0b0tleShwYXRoW2luZGV4XSk7XG4gICAgaWYgKCEocmVzdWx0ID0gb2JqZWN0ICE9IG51bGwgJiYgaGFzRnVuYyhvYmplY3QsIGtleSkpKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgb2JqZWN0ID0gb2JqZWN0W2tleV07XG4gIH1cbiAgaWYgKHJlc3VsdCB8fCArK2luZGV4ICE9IGxlbmd0aCkge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgbGVuZ3RoID0gb2JqZWN0ID09IG51bGwgPyAwIDogb2JqZWN0Lmxlbmd0aDtcbiAgcmV0dXJuICEhbGVuZ3RoICYmIGlzTGVuZ3RoKGxlbmd0aCkgJiYgaXNJbmRleChrZXksIGxlbmd0aCkgJiZcbiAgICAoaXNBcnJheShvYmplY3QpIHx8IGlzQXJndW1lbnRzKG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGhhc1BhdGg7XG4iLCJ2YXIgbmF0aXZlQ3JlYXRlID0gcmVxdWlyZSgnLi9fbmF0aXZlQ3JlYXRlJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgaGFzaCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaEhhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICByZXR1cm4gbmF0aXZlQ3JlYXRlID8gZGF0YVtrZXldICE9PSB1bmRlZmluZWQgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzaEhhcztcbiIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gYXJyYXkgY2xvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IFRoZSBhcnJheSB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZUFycmF5KGFycmF5KSB7XG4gIHZhciBsZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICByZXN1bHQgPSBhcnJheS5jb25zdHJ1Y3RvcihsZW5ndGgpO1xuXG4gIC8vIEFkZCBwcm9wZXJ0aWVzIGFzc2lnbmVkIGJ5IGBSZWdFeHAjZXhlY2AuXG4gIGlmIChsZW5ndGggJiYgdHlwZW9mIGFycmF5WzBdID09ICdzdHJpbmcnICYmIGhhc093blByb3BlcnR5LmNhbGwoYXJyYXksICdpbmRleCcpKSB7XG4gICAgcmVzdWx0LmluZGV4ID0gYXJyYXkuaW5kZXg7XG4gICAgcmVzdWx0LmlucHV0ID0gYXJyYXkuaW5wdXQ7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbml0Q2xvbmVBcnJheTtcbiIsInZhciBjbG9uZUFycmF5QnVmZmVyID0gcmVxdWlyZSgnLi9fY2xvbmVBcnJheUJ1ZmZlcicpLFxuICAgIGNsb25lRGF0YVZpZXcgPSByZXF1aXJlKCcuL19jbG9uZURhdGFWaWV3JyksXG4gICAgY2xvbmVNYXAgPSByZXF1aXJlKCcuL19jbG9uZU1hcCcpLFxuICAgIGNsb25lUmVnRXhwID0gcmVxdWlyZSgnLi9fY2xvbmVSZWdFeHAnKSxcbiAgICBjbG9uZVNldCA9IHJlcXVpcmUoJy4vX2Nsb25lU2V0JyksXG4gICAgY2xvbmVTeW1ib2wgPSByZXF1aXJlKCcuL19jbG9uZVN5bWJvbCcpLFxuICAgIGNsb25lVHlwZWRBcnJheSA9IHJlcXVpcmUoJy4vX2Nsb25lVHlwZWRBcnJheScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIHJlZ2V4cFRhZyA9ICdbb2JqZWN0IFJlZ0V4cF0nLFxuICAgIHNldFRhZyA9ICdbb2JqZWN0IFNldF0nLFxuICAgIHN0cmluZ1RhZyA9ICdbb2JqZWN0IFN0cmluZ10nLFxuICAgIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqXG4gKiBJbml0aWFsaXplcyBhbiBvYmplY3QgY2xvbmUgYmFzZWQgb24gaXRzIGB0b1N0cmluZ1RhZ2AuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gb25seSBzdXBwb3J0cyBjbG9uaW5nIHZhbHVlcyB3aXRoIHRhZ3Mgb2ZcbiAqIGBCb29sZWFuYCwgYERhdGVgLCBgRXJyb3JgLCBgTnVtYmVyYCwgYFJlZ0V4cGAsIG9yIGBTdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge3N0cmluZ30gdGFnIFRoZSBgdG9TdHJpbmdUYWdgIG9mIHRoZSBvYmplY3QgdG8gY2xvbmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjbG9uZUZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNsb25lIHZhbHVlcy5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lQnlUYWcob2JqZWN0LCB0YWcsIGNsb25lRnVuYywgaXNEZWVwKSB7XG4gIHZhciBDdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yO1xuICBzd2l0Y2ggKHRhZykge1xuICAgIGNhc2UgYXJyYXlCdWZmZXJUYWc6XG4gICAgICByZXR1cm4gY2xvbmVBcnJheUJ1ZmZlcihvYmplY3QpO1xuXG4gICAgY2FzZSBib29sVGFnOlxuICAgIGNhc2UgZGF0ZVRhZzpcbiAgICAgIHJldHVybiBuZXcgQ3Rvcigrb2JqZWN0KTtcblxuICAgIGNhc2UgZGF0YVZpZXdUYWc6XG4gICAgICByZXR1cm4gY2xvbmVEYXRhVmlldyhvYmplY3QsIGlzRGVlcCk7XG5cbiAgICBjYXNlIGZsb2F0MzJUYWc6IGNhc2UgZmxvYXQ2NFRhZzpcbiAgICBjYXNlIGludDhUYWc6IGNhc2UgaW50MTZUYWc6IGNhc2UgaW50MzJUYWc6XG4gICAgY2FzZSB1aW50OFRhZzogY2FzZSB1aW50OENsYW1wZWRUYWc6IGNhc2UgdWludDE2VGFnOiBjYXNlIHVpbnQzMlRhZzpcbiAgICAgIHJldHVybiBjbG9uZVR5cGVkQXJyYXkob2JqZWN0LCBpc0RlZXApO1xuXG4gICAgY2FzZSBtYXBUYWc6XG4gICAgICByZXR1cm4gY2xvbmVNYXAob2JqZWN0LCBpc0RlZXAsIGNsb25lRnVuYyk7XG5cbiAgICBjYXNlIG51bWJlclRhZzpcbiAgICBjYXNlIHN0cmluZ1RhZzpcbiAgICAgIHJldHVybiBuZXcgQ3RvcihvYmplY3QpO1xuXG4gICAgY2FzZSByZWdleHBUYWc6XG4gICAgICByZXR1cm4gY2xvbmVSZWdFeHAob2JqZWN0KTtcblxuICAgIGNhc2Ugc2V0VGFnOlxuICAgICAgcmV0dXJuIGNsb25lU2V0KG9iamVjdCwgaXNEZWVwLCBjbG9uZUZ1bmMpO1xuXG4gICAgY2FzZSBzeW1ib2xUYWc6XG4gICAgICByZXR1cm4gY2xvbmVTeW1ib2wob2JqZWN0KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXRDbG9uZUJ5VGFnO1xuIiwidmFyIGJhc2VDcmVhdGUgPSByZXF1aXJlKCcuL19iYXNlQ3JlYXRlJyksXG4gICAgZ2V0UHJvdG90eXBlID0gcmVxdWlyZSgnLi9fZ2V0UHJvdG90eXBlJyksXG4gICAgaXNQcm90b3R5cGUgPSByZXF1aXJlKCcuL19pc1Byb3RvdHlwZScpO1xuXG4vKipcbiAqIEluaXRpYWxpemVzIGFuIG9iamVjdCBjbG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNsb25lLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaW5pdGlhbGl6ZWQgY2xvbmUuXG4gKi9cbmZ1bmN0aW9uIGluaXRDbG9uZU9iamVjdChvYmplY3QpIHtcbiAgcmV0dXJuICh0eXBlb2Ygb2JqZWN0LmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgIWlzUHJvdG90eXBlKG9iamVjdCkpXG4gICAgPyBiYXNlQ3JlYXRlKGdldFByb3RvdHlwZShvYmplY3QpKVxuICAgIDoge307XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5pdENsb25lT2JqZWN0O1xuIiwidmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL2lzQXJyYXknKSxcbiAgICBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgdG8gbWF0Y2ggcHJvcGVydHkgbmFtZXMgd2l0aGluIHByb3BlcnR5IHBhdGhzLiAqL1xudmFyIHJlSXNEZWVwUHJvcCA9IC9cXC58XFxbKD86W15bXFxdXSp8KFtcIiddKSg/Oig/IVxcMSlbXlxcXFxdfFxcXFwuKSo/XFwxKVxcXS8sXG4gICAgcmVJc1BsYWluUHJvcCA9IC9eXFx3KiQvO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgcHJvcGVydHkgbmFtZSBhbmQgbm90IGEgcHJvcGVydHkgcGF0aC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeSBrZXlzIG9uLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwcm9wZXJ0eSBuYW1lLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzS2V5KHZhbHVlLCBvYmplY3QpIHtcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICBpZiAodHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nIHx8XG4gICAgICB2YWx1ZSA9PSBudWxsIHx8IGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiByZUlzUGxhaW5Qcm9wLnRlc3QodmFsdWUpIHx8ICFyZUlzRGVlcFByb3AudGVzdCh2YWx1ZSkgfHxcbiAgICAob2JqZWN0ICE9IG51bGwgJiYgdmFsdWUgaW4gT2JqZWN0KG9iamVjdCkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzS2V5O1xuIiwiLyoqXG4gKiBDb252ZXJ0cyBgbWFwYCB0byBpdHMga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUga2V5LXZhbHVlIHBhaXJzLlxuICovXG5mdW5jdGlvbiBtYXBUb0FycmF5KG1hcCkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG1hcC5zaXplKTtcblxuICBtYXAuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gW2tleSwgdmFsdWVdO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBtYXBUb0FycmF5O1xuIiwidmFyIG1lbW9pemUgPSByZXF1aXJlKCcuL21lbW9pemUnKTtcblxuLyoqIFVzZWQgYXMgdGhlIG1heGltdW0gbWVtb2l6ZSBjYWNoZSBzaXplLiAqL1xudmFyIE1BWF9NRU1PSVpFX1NJWkUgPSA1MDA7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLm1lbW9pemVgIHdoaWNoIGNsZWFycyB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24nc1xuICogY2FjaGUgd2hlbiBpdCBleGNlZWRzIGBNQVhfTUVNT0laRV9TSVpFYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaGF2ZSBpdHMgb3V0cHV0IG1lbW9pemVkLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG1lbW9pemVDYXBwZWQoZnVuYykge1xuICB2YXIgcmVzdWx0ID0gbWVtb2l6ZShmdW5jLCBmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoY2FjaGUuc2l6ZSA9PT0gTUFYX01FTU9JWkVfU0laRSkge1xuICAgICAgY2FjaGUuY2xlYXIoKTtcbiAgICB9XG4gICAgcmV0dXJuIGtleTtcbiAgfSk7XG5cbiAgdmFyIGNhY2hlID0gcmVzdWx0LmNhY2hlO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1lbW9pemVDYXBwZWQ7XG4iLCIvKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgbGlrZVxuICogW2BPYmplY3Qua2V5c2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5rZXlzKVxuICogZXhjZXB0IHRoYXQgaXQgaW5jbHVkZXMgaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydGllcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gbmF0aXZlS2V5c0luKG9iamVjdCkge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIGlmIChvYmplY3QgIT0gbnVsbCkge1xuICAgIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuYXRpdmVLZXlzSW47XG4iLCIvKipcbiAqIENvbnZlcnRzIGBzZXRgIHRvIGFuIGFycmF5IG9mIGl0cyB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXQgVGhlIHNldCB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIHNldFRvQXJyYXkoc2V0KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkoc2V0LnNpemUpO1xuXG4gIHNldC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gdmFsdWU7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldFRvQXJyYXk7XG4iLCJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyk7XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqL1xuZnVuY3Rpb24gc3RhY2tDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGU7XG4gIHRoaXMuc2l6ZSA9IDA7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tDbGVhcjtcbiIsIi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICByZXN1bHQgPSBkYXRhWydkZWxldGUnXShrZXkpO1xuXG4gIHRoaXMuc2l6ZSA9IGRhdGEuc2l6ZTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0RlbGV0ZTtcbiIsIi8qKlxuICogR2V0cyB0aGUgc3RhY2sgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrR2V0KGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5nZXQoa2V5KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja0dldDtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGEgc3RhY2sgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzdGFja0hhcyhrZXkpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uaGFzKGtleSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RhY2tIYXM7XG4iLCJ2YXIgTGlzdENhY2hlID0gcmVxdWlyZSgnLi9fTGlzdENhY2hlJyksXG4gICAgTWFwID0gcmVxdWlyZSgnLi9fTWFwJyksXG4gICAgTWFwQ2FjaGUgPSByZXF1aXJlKCcuL19NYXBDYWNoZScpO1xuXG4vKiogVXNlZCBhcyB0aGUgc2l6ZSB0byBlbmFibGUgbGFyZ2UgYXJyYXkgb3B0aW1pemF0aW9ucy4gKi9cbnZhciBMQVJHRV9BUlJBWV9TSVpFID0gMjAwO1xuXG4vKipcbiAqIFNldHMgdGhlIHN0YWNrIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIHN0YWNrIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzdGFja1NldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBMaXN0Q2FjaGUpIHtcbiAgICB2YXIgcGFpcnMgPSBkYXRhLl9fZGF0YV9fO1xuICAgIGlmICghTWFwIHx8IChwYWlycy5sZW5ndGggPCBMQVJHRV9BUlJBWV9TSVpFIC0gMSkpIHtcbiAgICAgIHBhaXJzLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgICAgIHRoaXMuc2l6ZSA9ICsrZGF0YS5zaXplO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGRhdGEgPSB0aGlzLl9fZGF0YV9fID0gbmV3IE1hcENhY2hlKHBhaXJzKTtcbiAgfVxuICBkYXRhLnNldChrZXksIHZhbHVlKTtcbiAgdGhpcy5zaXplID0gZGF0YS5zaXplO1xuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdGFja1NldDtcbiIsInZhciBtZW1vaXplQ2FwcGVkID0gcmVxdWlyZSgnLi9fbWVtb2l6ZUNhcHBlZCcpO1xuXG4vKiogVXNlZCB0byBtYXRjaCBwcm9wZXJ0eSBuYW1lcyB3aXRoaW4gcHJvcGVydHkgcGF0aHMuICovXG52YXIgcmVMZWFkaW5nRG90ID0gL15cXC4vLFxuICAgIHJlUHJvcE5hbWUgPSAvW14uW1xcXV0rfFxcWyg/OigtP1xcZCsoPzpcXC5cXGQrKT8pfChbXCInXSkoKD86KD8hXFwyKVteXFxcXF18XFxcXC4pKj8pXFwyKVxcXXwoPz0oPzpcXC58XFxbXFxdKSg/OlxcLnxcXFtcXF18JCkpL2c7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGJhY2tzbGFzaGVzIGluIHByb3BlcnR5IHBhdGhzLiAqL1xudmFyIHJlRXNjYXBlQ2hhciA9IC9cXFxcKFxcXFwpPy9nO1xuXG4vKipcbiAqIENvbnZlcnRzIGBzdHJpbmdgIHRvIGEgcHJvcGVydHkgcGF0aCBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKi9cbnZhciBzdHJpbmdUb1BhdGggPSBtZW1vaXplQ2FwcGVkKGZ1bmN0aW9uKHN0cmluZykge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIGlmIChyZUxlYWRpbmdEb3QudGVzdChzdHJpbmcpKSB7XG4gICAgcmVzdWx0LnB1c2goJycpO1xuICB9XG4gIHN0cmluZy5yZXBsYWNlKHJlUHJvcE5hbWUsIGZ1bmN0aW9uKG1hdGNoLCBudW1iZXIsIHF1b3RlLCBzdHJpbmcpIHtcbiAgICByZXN1bHQucHVzaChxdW90ZSA/IHN0cmluZy5yZXBsYWNlKHJlRXNjYXBlQ2hhciwgJyQxJykgOiAobnVtYmVyIHx8IG1hdGNoKSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gc3RyaW5nVG9QYXRoO1xuIiwidmFyIGlzU3ltYm9sID0gcmVxdWlyZSgnLi9pc1N5bWJvbCcpO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBJTkZJTklUWSA9IDEgLyAwO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcga2V5IGlmIGl0J3Mgbm90IGEgc3RyaW5nIG9yIHN5bWJvbC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtzdHJpbmd8c3ltYm9sfSBSZXR1cm5zIHRoZSBrZXkuXG4gKi9cbmZ1bmN0aW9uIHRvS2V5KHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycgfHwgaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHZhciByZXN1bHQgPSAodmFsdWUgKyAnJyk7XG4gIHJldHVybiAocmVzdWx0ID09ICcwJyAmJiAoMSAvIHZhbHVlKSA9PSAtSU5GSU5JVFkpID8gJy0wJyA6IHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b0tleTtcbiIsInZhciBiYXNlQ2xvbmUgPSByZXF1aXJlKCcuL19iYXNlQ2xvbmUnKTtcblxuLyoqIFVzZWQgdG8gY29tcG9zZSBiaXRtYXNrcyBmb3IgY2xvbmluZy4gKi9cbnZhciBDTE9ORV9TWU1CT0xTX0ZMQUcgPSA0O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBzaGFsbG93IGNsb25lIG9mIGB2YWx1ZWAuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb24gdGhlXG4gKiBbc3RydWN0dXJlZCBjbG9uZSBhbGdvcml0aG1dKGh0dHBzOi8vbWRuLmlvL1N0cnVjdHVyZWRfY2xvbmVfYWxnb3JpdGhtKVxuICogYW5kIHN1cHBvcnRzIGNsb25pbmcgYXJyYXlzLCBhcnJheSBidWZmZXJzLCBib29sZWFucywgZGF0ZSBvYmplY3RzLCBtYXBzLFxuICogbnVtYmVycywgYE9iamVjdGAgb2JqZWN0cywgcmVnZXhlcywgc2V0cywgc3RyaW5ncywgc3ltYm9scywgYW5kIHR5cGVkXG4gKiBhcnJheXMuIFRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIGBhcmd1bWVudHNgIG9iamVjdHMgYXJlIGNsb25lZFxuICogYXMgcGxhaW4gb2JqZWN0cy4gQW4gZW1wdHkgb2JqZWN0IGlzIHJldHVybmVkIGZvciB1bmNsb25lYWJsZSB2YWx1ZXMgc3VjaFxuICogYXMgZXJyb3Igb2JqZWN0cywgZnVuY3Rpb25zLCBET00gbm9kZXMsIGFuZCBXZWFrTWFwcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2xvbmUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgY2xvbmVkIHZhbHVlLlxuICogQHNlZSBfLmNsb25lRGVlcFxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0cyA9IFt7ICdhJzogMSB9LCB7ICdiJzogMiB9XTtcbiAqXG4gKiB2YXIgc2hhbGxvdyA9IF8uY2xvbmUob2JqZWN0cyk7XG4gKiBjb25zb2xlLmxvZyhzaGFsbG93WzBdID09PSBvYmplY3RzWzBdKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gY2xvbmUodmFsdWUpIHtcbiAgcmV0dXJuIGJhc2VDbG9uZSh2YWx1ZSwgQ0xPTkVfU1lNQk9MU19GTEFHKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBub3cgPSByZXF1aXJlKCcuL25vdycpLFxuICAgIHRvTnVtYmVyID0gcmVxdWlyZSgnLi90b051bWJlcicpO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXgsXG4gICAgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogQ3JlYXRlcyBhIGRlYm91bmNlZCBmdW5jdGlvbiB0aGF0IGRlbGF5cyBpbnZva2luZyBgZnVuY2AgdW50aWwgYWZ0ZXIgYHdhaXRgXG4gKiBtaWxsaXNlY29uZHMgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiB3YXNcbiAqIGludm9rZWQuIFRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgIG1ldGhvZCB0byBjYW5jZWxcbiAqIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLlxuICogUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2Agc2hvdWxkIGJlIGludm9rZWQgb24gdGhlXG4gKiBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGAgdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkXG4gKiB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50XG4gKiBjYWxscyB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYFxuICogaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIGRlYm91bmNlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy5kZWJvdW5jZWAgYW5kIGBfLnRocm90dGxlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlYm91bmNlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9ZmFsc2VdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgbGVhZGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1heFdhaXRdXG4gKiAgVGhlIG1heGltdW0gdGltZSBgZnVuY2AgaXMgYWxsb3dlZCB0byBiZSBkZWxheWVkIGJlZm9yZSBpdCdzIGludm9rZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGRlYm91bmNlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgY29zdGx5IGNhbGN1bGF0aW9ucyB3aGlsZSB0aGUgd2luZG93IHNpemUgaXMgaW4gZmx1eC5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdyZXNpemUnLCBfLmRlYm91bmNlKGNhbGN1bGF0ZUxheW91dCwgMTUwKSk7XG4gKlxuICogLy8gSW52b2tlIGBzZW5kTWFpbGAgd2hlbiBjbGlja2VkLCBkZWJvdW5jaW5nIHN1YnNlcXVlbnQgY2FsbHMuXG4gKiBqUXVlcnkoZWxlbWVudCkub24oJ2NsaWNrJywgXy5kZWJvdW5jZShzZW5kTWFpbCwgMzAwLCB7XG4gKiAgICdsZWFkaW5nJzogdHJ1ZSxcbiAqICAgJ3RyYWlsaW5nJzogZmFsc2VcbiAqIH0pKTtcbiAqXG4gKiAvLyBFbnN1cmUgYGJhdGNoTG9nYCBpcyBpbnZva2VkIG9uY2UgYWZ0ZXIgMSBzZWNvbmQgb2YgZGVib3VuY2VkIGNhbGxzLlxuICogdmFyIGRlYm91bmNlZCA9IF8uZGVib3VuY2UoYmF0Y2hMb2csIDI1MCwgeyAnbWF4V2FpdCc6IDEwMDAgfSk7XG4gKiB2YXIgc291cmNlID0gbmV3IEV2ZW50U291cmNlKCcvc3RyZWFtJyk7XG4gKiBqUXVlcnkoc291cmNlKS5vbignbWVzc2FnZScsIGRlYm91bmNlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyBkZWJvdW5jZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIGRlYm91bmNlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsYXN0QXJncyxcbiAgICAgIGxhc3RUaGlzLFxuICAgICAgbWF4V2FpdCxcbiAgICAgIHJlc3VsdCxcbiAgICAgIHRpbWVySWQsXG4gICAgICBsYXN0Q2FsbFRpbWUsXG4gICAgICBsYXN0SW52b2tlVGltZSA9IDAsXG4gICAgICBsZWFkaW5nID0gZmFsc2UsXG4gICAgICBtYXhpbmcgPSBmYWxzZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICB3YWl0ID0gdG9OdW1iZXIod2FpdCkgfHwgMDtcbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICEhb3B0aW9ucy5sZWFkaW5nO1xuICAgIG1heGluZyA9ICdtYXhXYWl0JyBpbiBvcHRpb25zO1xuICAgIG1heFdhaXQgPSBtYXhpbmcgPyBuYXRpdmVNYXgodG9OdW1iZXIob3B0aW9ucy5tYXhXYWl0KSB8fCAwLCB3YWl0KSA6IG1heFdhaXQ7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIGludm9rZUZ1bmModGltZSkge1xuICAgIHZhciBhcmdzID0gbGFzdEFyZ3MsXG4gICAgICAgIHRoaXNBcmcgPSBsYXN0VGhpcztcblxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlYWRpbmdFZGdlKHRpbWUpIHtcbiAgICAvLyBSZXNldCBhbnkgYG1heFdhaXRgIHRpbWVyLlxuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICAvLyBTdGFydCB0aGUgdGltZXIgZm9yIHRoZSB0cmFpbGluZyBlZGdlLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgLy8gSW52b2tlIHRoZSBsZWFkaW5nIGVkZ2UuXG4gICAgcmV0dXJuIGxlYWRpbmcgPyBpbnZva2VGdW5jKHRpbWUpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtYWluaW5nV2FpdCh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZSxcbiAgICAgICAgcmVzdWx0ID0gd2FpdCAtIHRpbWVTaW5jZUxhc3RDYWxsO1xuXG4gICAgcmV0dXJuIG1heGluZyA/IG5hdGl2ZU1pbihyZXN1bHQsIG1heFdhaXQgLSB0aW1lU2luY2VMYXN0SW52b2tlKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3VsZEludm9rZSh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZTtcblxuICAgIC8vIEVpdGhlciB0aGlzIGlzIHRoZSBmaXJzdCBjYWxsLCBhY3Rpdml0eSBoYXMgc3RvcHBlZCBhbmQgd2UncmUgYXQgdGhlXG4gICAgLy8gdHJhaWxpbmcgZWRnZSwgdGhlIHN5c3RlbSB0aW1lIGhhcyBnb25lIGJhY2t3YXJkcyBhbmQgd2UncmUgdHJlYXRpbmdcbiAgICAvLyBpdCBhcyB0aGUgdHJhaWxpbmcgZWRnZSwgb3Igd2UndmUgaGl0IHRoZSBgbWF4V2FpdGAgbGltaXQuXG4gICAgcmV0dXJuIChsYXN0Q2FsbFRpbWUgPT09IHVuZGVmaW5lZCB8fCAodGltZVNpbmNlTGFzdENhbGwgPj0gd2FpdCkgfHxcbiAgICAgICh0aW1lU2luY2VMYXN0Q2FsbCA8IDApIHx8IChtYXhpbmcgJiYgdGltZVNpbmNlTGFzdEludm9rZSA+PSBtYXhXYWl0KSk7XG4gIH1cblxuICBmdW5jdGlvbiB0aW1lckV4cGlyZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKTtcbiAgICBpZiAoc2hvdWxkSW52b2tlKHRpbWUpKSB7XG4gICAgICByZXR1cm4gdHJhaWxpbmdFZGdlKHRpbWUpO1xuICAgIH1cbiAgICAvLyBSZXN0YXJ0IHRoZSB0aW1lci5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHJlbWFpbmluZ1dhaXQodGltZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJhaWxpbmdFZGdlKHRpbWUpIHtcbiAgICB0aW1lcklkID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gT25seSBpbnZva2UgaWYgd2UgaGF2ZSBgbGFzdEFyZ3NgIHdoaWNoIG1lYW5zIGBmdW5jYCBoYXMgYmVlblxuICAgIC8vIGRlYm91bmNlZCBhdCBsZWFzdCBvbmNlLlxuICAgIGlmICh0cmFpbGluZyAmJiBsYXN0QXJncykge1xuICAgICAgcmV0dXJuIGludm9rZUZ1bmModGltZSk7XG4gICAgfVxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBpZiAodGltZXJJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XG4gICAgfVxuICAgIGxhc3RJbnZva2VUaW1lID0gMDtcbiAgICBsYXN0QXJncyA9IGxhc3RDYWxsVGltZSA9IGxhc3RUaGlzID0gdGltZXJJZCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHJldHVybiB0aW1lcklkID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiB0cmFpbGluZ0VkZ2Uobm93KCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCksXG4gICAgICAgIGlzSW52b2tpbmcgPSBzaG91bGRJbnZva2UodGltZSk7XG5cbiAgICBsYXN0QXJncyA9IGFyZ3VtZW50cztcbiAgICBsYXN0VGhpcyA9IHRoaXM7XG4gICAgbGFzdENhbGxUaW1lID0gdGltZTtcblxuICAgIGlmIChpc0ludm9raW5nKSB7XG4gICAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBsZWFkaW5nRWRnZShsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG1heGluZykge1xuICAgICAgICAvLyBIYW5kbGUgaW52b2NhdGlvbnMgaW4gYSB0aWdodCBsb29wLlxuICAgICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgICAgICByZXR1cm4gaW52b2tlRnVuYyhsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGRlYm91bmNlZC5jYW5jZWwgPSBjYW5jZWw7XG4gIGRlYm91bmNlZC5mbHVzaCA9IGZsdXNoO1xuICByZXR1cm4gZGVib3VuY2VkO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlYm91bmNlO1xuIiwidmFyIGJhc2VIYXMgPSByZXF1aXJlKCcuL19iYXNlSGFzJyksXG4gICAgaGFzUGF0aCA9IHJlcXVpcmUoJy4vX2hhc1BhdGgnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHBhdGhgIGlzIGEgZGlyZWN0IHByb3BlcnR5IG9mIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBwYXRoYCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiB7ICdiJzogMiB9IH07XG4gKiB2YXIgb3RoZXIgPSBfLmNyZWF0ZSh7ICdhJzogXy5jcmVhdGUoeyAnYic6IDIgfSkgfSk7XG4gKlxuICogXy5oYXMob2JqZWN0LCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzKG9iamVjdCwgJ2EuYicpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzKG9iamVjdCwgWydhJywgJ2InXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5oYXMob3RoZXIsICdhJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBoYXMob2JqZWN0LCBwYXRoKSB7XG4gIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJiBoYXNQYXRoKG9iamVjdCwgcGF0aCwgYmFzZUhhcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaGFzO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3ltYm9sO1xuIiwidmFyIGFycmF5TGlrZUtleXMgPSByZXF1aXJlKCcuL19hcnJheUxpa2VLZXlzJyksXG4gICAgYmFzZUtleXNJbiA9IHJlcXVpcmUoJy4vX2Jhc2VLZXlzSW4nKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMy4wLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5c0luKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InLCAnYyddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKi9cbmZ1bmN0aW9uIGtleXNJbihvYmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKG9iamVjdCkgPyBhcnJheUxpa2VLZXlzKG9iamVjdCwgdHJ1ZSkgOiBiYXNlS2V5c0luKG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5c0luO1xuIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKlxuICogR2V0cyB0aGUgdGltZXN0YW1wIG9mIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRoYXQgaGF2ZSBlbGFwc2VkIHNpbmNlXG4gKiB0aGUgVW5peCBlcG9jaCAoMSBKYW51YXJ5IDE5NzAgMDA6MDA6MDAgVVRDKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgRGF0ZVxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgdGltZXN0YW1wLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRlZmVyKGZ1bmN0aW9uKHN0YW1wKSB7XG4gKiAgIGNvbnNvbGUubG9nKF8ubm93KCkgLSBzdGFtcCk7XG4gKiB9LCBfLm5vdygpKTtcbiAqIC8vID0+IExvZ3MgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgaXQgdG9vayBmb3IgdGhlIGRlZmVycmVkIGludm9jYXRpb24uXG4gKi9cbnZhciBub3cgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHJvb3QuRGF0ZS5ub3coKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbm93O1xuIiwiLyoqXG4gKiBUaGlzIG1ldGhvZCByZXR1cm5zIGEgbmV3IGVtcHR5IGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4xMy4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgZW1wdHkgYXJyYXkuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBhcnJheXMgPSBfLnRpbWVzKDIsIF8uc3R1YkFycmF5KTtcbiAqXG4gKiBjb25zb2xlLmxvZyhhcnJheXMpO1xuICogLy8gPT4gW1tdLCBbXV1cbiAqXG4gKiBjb25zb2xlLmxvZyhhcnJheXNbMF0gPT09IGFycmF5c1sxXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBzdHViQXJyYXkoKSB7XG4gIHJldHVybiBbXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHViQXJyYXk7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE5BTiA9IDAgLyAwO1xuXG4vKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlLiAqL1xudmFyIHJlVHJpbSA9IC9eXFxzK3xcXHMrJC9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmFkIHNpZ25lZCBoZXhhZGVjaW1hbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCYWRIZXggPSAvXlstK10weFswLTlhLWZdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJpbmFyeSBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCaW5hcnkgPSAvXjBiWzAxXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvY3RhbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNPY3RhbCA9IC9eMG9bMC03XSskL2k7XG5cbi8qKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB3aXRob3V0IGEgZGVwZW5kZW5jeSBvbiBgcm9vdGAuICovXG52YXIgZnJlZVBhcnNlSW50ID0gcGFyc2VJbnQ7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b051bWJlcigzLjIpO1xuICogLy8gPT4gMy4yXG4gKlxuICogXy50b051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDVlLTMyNFxuICpcbiAqIF8udG9OdW1iZXIoSW5maW5pdHkpO1xuICogLy8gPT4gSW5maW5pdHlcbiAqXG4gKiBfLnRvTnVtYmVyKCczLjInKTtcbiAqIC8vID0+IDMuMlxuICovXG5mdW5jdGlvbiB0b051bWJlcih2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gTkFOO1xuICB9XG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICB2YXIgb3RoZXIgPSB0eXBlb2YgdmFsdWUudmFsdWVPZiA9PSAnZnVuY3Rpb24nID8gdmFsdWUudmFsdWVPZigpIDogdmFsdWU7XG4gICAgdmFsdWUgPSBpc09iamVjdChvdGhlcikgPyAob3RoZXIgKyAnJykgOiBvdGhlcjtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiArdmFsdWU7XG4gIH1cbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJlVHJpbSwgJycpO1xuICB2YXIgaXNCaW5hcnkgPSByZUlzQmluYXJ5LnRlc3QodmFsdWUpO1xuICByZXR1cm4gKGlzQmluYXJ5IHx8IHJlSXNPY3RhbC50ZXN0KHZhbHVlKSlcbiAgICA/IGZyZWVQYXJzZUludCh2YWx1ZS5zbGljZSgyKSwgaXNCaW5hcnkgPyAyIDogOClcbiAgICA6IChyZUlzQmFkSGV4LnRlc3QodmFsdWUpID8gTkFOIDogK3ZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b051bWJlcjtcbiIsInZhciBiYXNlVG9TdHJpbmcgPSByZXF1aXJlKCcuL19iYXNlVG9TdHJpbmcnKTtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nLiBBbiBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWQgZm9yIGBudWxsYFxuICogYW5kIGB1bmRlZmluZWRgIHZhbHVlcy4gVGhlIHNpZ24gb2YgYC0wYCBpcyBwcmVzZXJ2ZWQuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvU3RyaW5nKG51bGwpO1xuICogLy8gPT4gJydcbiAqXG4gKiBfLnRvU3RyaW5nKC0wKTtcbiAqIC8vID0+ICctMCdcbiAqXG4gKiBfLnRvU3RyaW5nKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiAnMSwyLDMnXG4gKi9cbmZ1bmN0aW9uIHRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PSBudWxsID8gJycgOiBiYXNlVG9TdHJpbmcodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvU3RyaW5nO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdEZhY2Vib29rUHJldmlldzogcmVxdWlyZSggXCIuL2pzL2ZhY2Vib29rUHJldmlld1wiICksXG5cdFR3aXR0ZXJQcmV2aWV3OiByZXF1aXJlKCBcIi4vanMvdHdpdHRlclByZXZpZXdcIiApXG59O1xuIiwidmFyIHBsYWNlaG9sZGVyVGVtcGxhdGUgPSByZXF1aXJlKCBcIi4uL3RlbXBsYXRlc1wiICkuaW1hZ2VQbGFjZWhvbGRlcjtcblxuLyoqXG4gKiBTZXRzIHRoZSBwbGFjZWhvbGRlciB3aXRoIGEgZ2l2ZW4gdmFsdWUuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGltYWdlQ29udGFpbmVyIFRoZSBsb2NhdGlvbiB0byBwdXQgdGhlIHBsYWNlaG9sZGVyIGluLlxuICogQHBhcmFtIHtzdHJpbmd9IHBsYWNlaG9sZGVyIFRoZSB2YWx1ZSBmb3IgdGhlIHBsYWNlaG9sZGVyLlxuICogQHBhcmFtIHtib29sZWFufSBpc0Vycm9yIFdoZW4gdGhlIHBsYWNlaG9sZGVyIHNob3VsZCBhbiBlcnJvci5cbiAqIEBwYXJhbSB7c3RyaW5nfSBtb2RpZmllciBBIGNzcyBjbGFzcyBtb2RpZmllciB0byBjaGFuZ2UgdGhlIHN0eWxpbmcuXG4gKi9cbmZ1bmN0aW9uIHNldEltYWdlUGxhY2Vob2xkZXIoIGltYWdlQ29udGFpbmVyLCBwbGFjZWhvbGRlciwgaXNFcnJvciwgbW9kaWZpZXIgKSB7XG5cdHZhciBjbGFzc05hbWVzID0gWyBcInNvY2lhbC1pbWFnZS1wbGFjZWhvbGRlclwiIF07XG5cdGlzRXJyb3IgPSBpc0Vycm9yIHx8IGZhbHNlO1xuXHRtb2RpZmllciA9IG1vZGlmaWVyIHx8IFwiXCI7XG5cblx0aWYgKCBpc0Vycm9yICkge1xuXHRcdGNsYXNzTmFtZXMucHVzaCggXCJzb2NpYWwtaW1hZ2UtcGxhY2Vob2xkZXItLWVycm9yXCIgKTtcblx0fVxuXG5cdGlmICggXCJcIiAhPT0gbW9kaWZpZXIgKSB7XG5cdFx0Y2xhc3NOYW1lcy5wdXNoKCBcInNvY2lhbC1pbWFnZS1wbGFjZWhvbGRlci0tXCIgKyBtb2RpZmllciApO1xuXHR9XG5cblx0aW1hZ2VDb250YWluZXIuaW5uZXJIVE1MID0gcGxhY2Vob2xkZXJUZW1wbGF0ZSgge1xuXHRcdGNsYXNzTmFtZTogY2xhc3NOYW1lcy5qb2luKCBcIiBcIiApLFxuXHRcdHBsYWNlaG9sZGVyOiBwbGFjZWhvbGRlclxuXHR9ICk7XG59XG5cbm1vZHVsZS5leHBvcnRzPSBzZXRJbWFnZVBsYWNlaG9sZGVyO1xuIiwidmFyIGlzRW1wdHkgPSByZXF1aXJlKCBcImxvZGFzaC9sYW5nL2lzRW1wdHlcIiApO1xudmFyIGRlYm91bmNlID0gcmVxdWlyZSggXCJsb2Rhc2gvZnVuY3Rpb24vZGVib3VuY2VcIiApO1xuXG52YXIgc3RyaXBIVE1MVGFncyA9IHJlcXVpcmUoIFwieW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy9zdHJpcEhUTUxUYWdzLmpzXCIgKTtcbnZhciBzdHJpcFNwYWNlcyA9IHJlcXVpcmUoIFwieW9hc3RzZW8vanMvc3RyaW5nUHJvY2Vzc2luZy9zdHJpcFNwYWNlcy5qc1wiICk7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIGZpZWxkIGFuZCBzZXRzIHRoZSBldmVudHMgZm9yIHRoYXQgZmllbGQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGlucHV0RmllbGQgVGhlIGZpZWxkIHRvIHJlcHJlc2VudC5cbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZXMgVGhlIHZhbHVlcyB0byB1c2UuXG4gKiBAcGFyYW0ge09iamVjdHx1bmRlZmluZWR9IGNhbGxiYWNrIFRoZSBjYWxsYmFjayB0byBleGVjdXRlZCBhZnRlciBmaWVsZCBjaGFuZ2UuXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gSW5wdXRFbGVtZW50KCBpbnB1dEZpZWxkLCB2YWx1ZXMsIGNhbGxiYWNrICkge1xuXHR0aGlzLmlucHV0RmllbGQgPSBpbnB1dEZpZWxkO1xuXHR0aGlzLnZhbHVlcyA9IHZhbHVlcztcblx0dGhpcy5fY2FsbGJhY2sgPSBjYWxsYmFjaztcblxuXHR0aGlzLnNldFZhbHVlKCB0aGlzLmdldElucHV0VmFsdWUoKSApO1xuXG5cdHRoaXMuYmluZEV2ZW50cygpO1xufVxuXG4vKipcbiAqIEJpbmRzIHRoZSBldmVudHNcbiAqL1xuSW5wdXRFbGVtZW50LnByb3RvdHlwZS5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdC8vIFNldCB0aGUgZXZlbnRzLlxuXHR0aGlzLmlucHV0RmllbGQuYWRkRXZlbnRMaXN0ZW5lciggXCJrZXlkb3duXCIsIHRoaXMuY2hhbmdlRXZlbnQuYmluZCggdGhpcyApICk7XG5cdHRoaXMuaW5wdXRGaWVsZC5hZGRFdmVudExpc3RlbmVyKCBcImtleXVwXCIsIHRoaXMuY2hhbmdlRXZlbnQuYmluZCggdGhpcyApICk7XG5cblx0dGhpcy5pbnB1dEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoIFwiaW5wdXRcIiwgdGhpcy5jaGFuZ2VFdmVudC5iaW5kKCB0aGlzICkgKTtcblx0dGhpcy5pbnB1dEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoIFwiZm9jdXNcIiwgdGhpcy5jaGFuZ2VFdmVudC5iaW5kKCB0aGlzICkgKTtcblx0dGhpcy5pbnB1dEZpZWxkLmFkZEV2ZW50TGlzdGVuZXIoIFwiYmx1clwiLCB0aGlzLmNoYW5nZUV2ZW50LmJpbmQoIHRoaXMgKSApO1xufTtcblxuLyoqXG4gKiBEbyB0aGUgY2hhbmdlIGV2ZW50XG4gKlxuICogQHR5cGUge0Z1bmN0aW9ufVxuICovXG5JbnB1dEVsZW1lbnQucHJvdG90eXBlLmNoYW5nZUV2ZW50ID0gZGVib3VuY2UoIGZ1bmN0aW9uKCkge1xuXHQvLyBXaGVuIHRoZXJlIGlzIGEgY2FsbGJhY2sgcnVuIGl0LlxuXHRpZiAoIHR5cGVvZiB0aGlzLl9jYWxsYmFjayAhPT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHR0aGlzLl9jYWxsYmFjaygpO1xuXHR9XG5cblx0dGhpcy5zZXRWYWx1ZSggdGhpcy5nZXRJbnB1dFZhbHVlKCkgKTtcbn0sIDI1ICk7XG5cbi8qKlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBjdXJyZW50IGZpZWxkIHZhbHVlXG4gKi9cbklucHV0RWxlbWVudC5wcm90b3R5cGUuZ2V0SW5wdXRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5pbnB1dEZpZWxkLnZhbHVlO1xufTtcblxuLyoqXG4gKiBGb3JtYXRzIHRoZSBhIHZhbHVlIGZvciB0aGUgcHJldmlldy4gSWYgdmFsdWUgaXMgZW1wdHkgYSBzYW1wbGUgdmFsdWUgaXMgdXNlZFxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBmb3JtYXR0ZWQgdGl0bGUsIHdpdGhvdXQgaHRtbCB0YWdzLlxuICovXG5JbnB1dEVsZW1lbnQucHJvdG90eXBlLmZvcm1hdFZhbHVlID0gZnVuY3Rpb24oKSB7XG5cdHZhciB2YWx1ZSA9IHRoaXMuZ2V0VmFsdWUoKTtcblxuXHR2YWx1ZSA9IHN0cmlwSFRNTFRhZ3MoIHZhbHVlICk7XG5cblx0Ly8gQXMgYW4gdWx0aW1hdGUgZmFsbGJhY2sgcHJvdmlkZSB0aGUgdXNlciB3aXRoIGEgaGVscGZ1bCBtZXNzYWdlLlxuXHRpZiAoIGlzRW1wdHkoIHZhbHVlICkgKSB7XG5cdFx0dmFsdWUgPSB0aGlzLnZhbHVlcy5mYWxsYmFjaztcblx0fVxuXG5cdHJldHVybiBzdHJpcFNwYWNlcyggdmFsdWUgKTtcbn07XG5cbi8qKlxuICogR2V0IHRoZSB2YWx1ZVxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybiB0aGUgdmFsdWUgb3IgZ2V0IGEgZmFsbGJhY2sgb25lLlxuICovXG5JbnB1dEVsZW1lbnQucHJvdG90eXBlLmdldFZhbHVlID0gZnVuY3Rpb24oKSB7XG5cdHZhciB2YWx1ZSA9IHRoaXMudmFsdWVzLmN1cnJlbnRWYWx1ZTtcblxuXHQvLyBGYWxsYmFjayB0byB0aGUgZGVmYXVsdCBpZiB2YWx1ZSBpcyBlbXB0eS5cblx0aWYgKCBpc0VtcHR5KCB2YWx1ZSApICkge1xuXHRcdHZhbHVlID0gdGhpcy52YWx1ZXMuZGVmYXVsdFZhbHVlO1xuXHR9XG5cblx0Ly8gRm9yIHJlbmRlcmluZyB3ZSBjYW4gZmFsbGJhY2sgdG8gdGhlIHBsYWNlaG9sZGVyIGFzIHdlbGwuXG5cdGlmICggaXNFbXB0eSggdmFsdWUgKSApIHtcblx0XHR2YWx1ZSA9IHRoaXMudmFsdWVzLnBsYWNlaG9sZGVyO1xuXHR9XG5cblx0cmV0dXJuIHZhbHVlO1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIGN1cnJlbnQgdmFsdWVcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgVGhlIHZhbHVlIHRvIHNldFxuICovXG5JbnB1dEVsZW1lbnQucHJvdG90eXBlLnNldFZhbHVlID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXHR0aGlzLnZhbHVlcy5jdXJyZW50VmFsdWUgPSB2YWx1ZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW5wdXRFbGVtZW50O1xuXG4iLCIvKiBqc2hpbnQgYnJvd3NlcjogdHJ1ZSAqL1xuXG52YXIgaXNFbGVtZW50ID0gcmVxdWlyZSggXCJsb2Rhc2gvbGFuZy9pc0VsZW1lbnRcIiApO1xudmFyIGNsb25lID0gcmVxdWlyZSggXCJsb2Rhc2gvbGFuZy9jbG9uZVwiICk7XG52YXIgZGVmYXVsdHNEZWVwID0gcmVxdWlyZSggXCJsb2Rhc2gvb2JqZWN0L2RlZmF1bHRzRGVlcFwiICk7XG5cbnZhciBKZWQgPSByZXF1aXJlKCBcImplZFwiICk7XG5cbnZhciBpbWFnZURpc3BsYXlNb2RlID0gcmVxdWlyZSggXCIuL2hlbHBlcnMvaW1hZ2VEaXNwbGF5TW9kZVwiICk7XG52YXIgcmVuZGVyRGVzY3JpcHRpb24gPSByZXF1aXJlKCBcIi4vaGVscGVycy9yZW5kZXJEZXNjcmlwdGlvblwiICk7XG52YXIgaW1hZ2VQbGFjZWhvbGRlciAgPSByZXF1aXJlKCBcIi4vZWxlbWVudC9pbWFnZVBsYWNlaG9sZGVyXCIgKTtcbnZhciBiZW1BZGRNb2RpZmllciA9IHJlcXVpcmUoIFwiLi9oZWxwZXJzL2JlbS9hZGRNb2RpZmllclwiICk7XG52YXIgYmVtUmVtb3ZlTW9kaWZpZXIgPSByZXF1aXJlKCBcIi4vaGVscGVycy9iZW0vcmVtb3ZlTW9kaWZpZXJcIiApO1xuXG52YXIgVGV4dEZpZWxkID0gcmVxdWlyZSggXCIuL2lucHV0cy90ZXh0SW5wdXRcIiApO1xudmFyIFRleHRBcmVhID0gcmVxdWlyZSggXCIuL2lucHV0cy90ZXh0YXJlYVwiICk7XG5cbnZhciBJbnB1dEVsZW1lbnQgPSByZXF1aXJlKCBcIi4vZWxlbWVudC9pbnB1dFwiICk7XG52YXIgUHJldmlld0V2ZW50cyA9IHJlcXVpcmUoIFwiLi9wcmV2aWV3L2V2ZW50c1wiICk7XG5cbnZhciB0ZW1wbGF0ZXMgPSByZXF1aXJlKCBcIi4vdGVtcGxhdGVzLmpzXCIgKTtcbnZhciBmYWNlYm9va0VkaXRvclRlbXBsYXRlID0gdGVtcGxhdGVzLmZhY2Vib29rUHJldmlldztcbnZhciBmYWNlYm9va0F1dGhvclRlbXBsYXRlID0gdGVtcGxhdGVzLmZhY2Vib29rQXV0aG9yO1xuXG52YXIgZmFjZWJvb2tEZWZhdWx0cyA9IHtcblx0ZGF0YToge1xuXHRcdHRpdGxlOiBcIlwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIlwiLFxuXHRcdGltYWdlVXJsOiBcIlwiXG5cdH0sXG5cdGRlZmF1bHRWYWx1ZToge1xuXHRcdHRpdGxlOiBcIlwiLFxuXHRcdGRlc2NyaXB0aW9uOiBcIlwiLFxuXHRcdGltYWdlVXJsOiBcIlwiXG5cdH0sXG5cdGJhc2VVUkw6IFwiZXhhbXBsZS5jb21cIixcblx0Y2FsbGJhY2tzOiB7XG5cdFx0dXBkYXRlU29jaWFsUHJldmlldzogZnVuY3Rpb24oKSB7fSxcblx0XHRtb2RpZnlUaXRsZTogZnVuY3Rpb24oIHRpdGxlICkge1xuXHRcdFx0cmV0dXJuIHRpdGxlO1xuXHRcdH0sXG5cdFx0bW9kaWZ5RGVzY3JpcHRpb246IGZ1bmN0aW9uKCBkZXNjcmlwdGlvbiApIHtcblx0XHRcdHJldHVybiBkZXNjcmlwdGlvbjtcblx0XHR9LFxuXHRcdG1vZGlmeUltYWdlVXJsOiBmdW5jdGlvbiggaW1hZ2VVcmwgKSB7XG5cdFx0XHRyZXR1cm4gaW1hZ2VVcmw7XG5cdFx0fVxuXHR9XG59O1xuXG52YXIgaW5wdXRGYWNlYm9va1ByZXZpZXdCaW5kaW5ncyA9IFtcblx0e1xuXHRcdFwicHJldmlld1wiOiBcImVkaXRhYmxlLXByZXZpZXdfX3RpdGxlLS1mYWNlYm9va1wiLFxuXHRcdFwiaW5wdXRGaWVsZFwiOiBcInRpdGxlXCJcblx0fSxcblx0e1xuXHRcdFwicHJldmlld1wiOiBcImVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS1mYWNlYm9va1wiLFxuXHRcdFwiaW5wdXRGaWVsZFwiOiBcImltYWdlVXJsXCJcblx0fSxcblx0e1xuXHRcdFwicHJldmlld1wiOiBcImVkaXRhYmxlLXByZXZpZXdfX2Rlc2NyaXB0aW9uLS1mYWNlYm9va1wiLFxuXHRcdFwiaW5wdXRGaWVsZFwiOiBcImRlc2NyaXB0aW9uXCJcblx0fVxuXTtcblxudmFyIFdJRFRIX0ZBQ0VCT09LX0lNQUdFX1NNQUxMID0gMTU4O1xudmFyIFdJRFRIX0ZBQ0VCT09LX0lNQUdFX0xBUkdFID0gNDcwO1xuXG52YXIgRkFDRUJPT0tfSU1BR0VfVE9PX1NNQUxMX1dJRFRIID0gMjAwO1xudmFyIEZBQ0VCT09LX0lNQUdFX1RPT19TTUFMTF9IRUlHSFQgPSAyMDA7XG5cbnZhciBGQUNFQk9PS19JTUFHRV9USFJFU0hPTERfV0lEVEggPSA2MDA7XG52YXIgRkFDRUJPT0tfSU1BR0VfVEhSRVNIT0xEX0hFSUdIVCA9IDMxNTtcblxuLyoqXG4gKiBAbW9kdWxlIHNuaXBwZXRQcmV2aWV3XG4gKi9cblxuLyoqXG4gKiBEZWZpbmVzIHRoZSBjb25maWcgYW5kIG91dHB1dFRhcmdldCBmb3IgdGhlIFNuaXBwZXRQcmV2aWV3XG4gKlxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgb3B0cyAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gU25pcHBldCBwcmV2aWV3IG9wdGlvbnMuXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgICBvcHRzLnBsYWNlaG9sZGVyICAgICAgICAgICAgICAgLSBUaGUgcGxhY2Vob2xkZXIgdmFsdWVzIGZvciB0aGUgZmllbGRzLCB3aWxsIGJlIHNob3duIGFzXG4gKiBhY3R1YWwgcGxhY2Vob2xkZXJzIGluIHRoZSBpbnB1dHMgYW5kIGFzIGEgZmFsbGJhY2sgZm9yIHRoZSBwcmV2aWV3LlxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgb3B0cy5wbGFjZWhvbGRlci50aXRsZSAgICAgICAgIC0gUGxhY2Vob2xkZXIgZm9yIHRoZSB0aXRsZSBmaWVsZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgIG9wdHMucGxhY2Vob2xkZXIuZGVzY3JpcHRpb24gICAtIFBsYWNlaG9sZGVyIGZvciB0aGUgZGVzY3JpcHRpb24gZmllbGQuXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICBvcHRzLnBsYWNlaG9sZGVyLmltYWdlVXJsICAgICAgLSBQbGFjZWhvbGRlciBmb3IgdGhlIGltYWdlIHVybCBmaWVsZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgICBvcHRzLmRlZmF1bHRWYWx1ZSAgICAgICAgICAgICAgLSBUaGUgZGVmYXVsdCB2YWx1ZSBmb3IgdGhlIGZpZWxkcywgaWYgdGhlIHVzZXIgaGFzIG5vdFxuICogY2hhbmdlZCBhIGZpZWxkLCB0aGlzIHZhbHVlIHdpbGwgYmUgdXNlZCBmb3IgdGhlIGFuYWx5emVyLCBwcmV2aWV3IGFuZCB0aGUgcHJvZ3Jlc3MgYmFycy5cbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgIG9wdHMuZGVmYXVsdFZhbHVlLnRpdGxlICAgICAgICAtIERlZmF1bHQgdGl0bGUuXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICBvcHRzLmRlZmF1bHRWYWx1ZS5kZXNjcmlwdGlvbiAgLSBEZWZhdWx0IGRlc2NyaXB0aW9uLlxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgb3B0cy5kZWZhdWx0VmFsdWUuaW1hZ2VVcmwgICAgIC0gRGVmYXVsdCBpbWFnZSB1cmwuXG4gKiBpdC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICBvcHRzLmJhc2VVUkwgICAgICAgICAgICAgICAgICAgLSBUaGUgYmFzaWMgVVJMIGFzIGl0IHdpbGwgYmUgZGlzcGxheWVkIGluIEZhY2Vib29rLlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gICAgb3B0cy50YXJnZXRFbGVtZW50ICAgICAgICAgICAgIC0gVGhlIHRhcmdldCBlbGVtZW50IHRoYXQgY29udGFpbnMgdGhpcyBzbmlwcGV0IGVkaXRvci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgICBvcHRzLmNhbGxiYWNrcyAgICAgICAgICAgICAgICAgLSBGdW5jdGlvbnMgdGhhdCBhcmUgY2FsbGVkIG9uIHNwZWNpZmljIGluc3RhbmNlcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259ICAgICAgIG9wdHMuY2FsbGJhY2tzLnVwZGF0ZVNvY2lhbFByZXZpZXcgLSBGdW5jdGlvbiBjYWxsZWQgd2hlbiB0aGUgc29jaWFsIHByZXZpZXcgaXMgdXBkYXRlZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgICBpMThuICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBUaGUgaTE4biBvYmplY3QuXG4gKlxuICogQHByb3BlcnR5IHtPYmplY3R9ICAgICAgaTE4biAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gVGhlIHRyYW5zbGF0aW9uIG9iamVjdC5cbiAqXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSB0YXJnZXRFbGVtZW50ICAgICAgICAgICAgICAgICAgLSBUaGUgdGFyZ2V0IGVsZW1lbnQgdGhhdCBjb250YWlucyB0aGlzIHNuaXBwZXQgZWRpdG9yLlxuICpcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSAgICAgIGVsZW1lbnQgICAgICAgICAgICAgICAgICAgICAgICAtIFRoZSBlbGVtZW50cyBmb3IgdGhpcyBzbmlwcGV0IGVkaXRvci5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSAgICAgIGVsZW1lbnQucmVuZGVyZWQgICAgICAgICAgICAgICAtIFRoZSByZW5kZXJlZCBlbGVtZW50cy5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQucmVuZGVyZWQudGl0bGUgICAgICAgICAtIFRoZSByZW5kZXJlZCB0aXRsZSBlbGVtZW50LlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5yZW5kZXJlZC5pbWFnZVVybCAgICAgIC0gVGhlIHJlbmRlcmVkIHVybCBwYXRoIGVsZW1lbnQuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LnJlbmRlcmVkLmRlc2NyaXB0aW9uICAgLSBUaGUgcmVuZGVyZWQgRmFjZWJvb2sgZGVzY3JpcHRpb24gZWxlbWVudC5cbiAqXG4gKiBAcHJvcGVydHkge09iamVjdH0gICAgICBlbGVtZW50LmlucHV0ICAgICAgICAgICAgICAgICAgLSBUaGUgaW5wdXQgZWxlbWVudHMuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LmlucHV0LnRpdGxlICAgICAgICAgICAgLSBUaGUgdGl0bGUgaW5wdXQgZWxlbWVudC5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQuaW5wdXQuaW1hZ2VVcmwgICAgICAgICAtIFRoZSB1cmwgcGF0aCBpbnB1dCBlbGVtZW50LlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5pbnB1dC5kZXNjcmlwdGlvbiAgICAgIC0gVGhlIG1ldGEgZGVzY3JpcHRpb24gaW5wdXQgZWxlbWVudC5cbiAqXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LmNvbnRhaW5lciAgICAgICAgICAgICAgLSBUaGUgbWFpbiBjb250YWluZXIgZWxlbWVudC5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQuZm9ybUNvbnRhaW5lciAgICAgICAgICAtIFRoZSBmb3JtIGNvbnRhaW5lciBlbGVtZW50LlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5lZGl0VG9nZ2xlICAgICAgICAgICAgIC0gVGhlIGJ1dHRvbiB0aGF0IHRvZ2dsZXMgdGhlIGVkaXRvciBmb3JtLlxuICpcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSAgICAgIGRhdGEgICAgICAgICAgICAgICAgICAgICAgICAgICAtIFRoZSBkYXRhIGZvciB0aGlzIHNuaXBwZXQgZWRpdG9yLlxuICogQHByb3BlcnR5IHtzdHJpbmd9ICAgICAgZGF0YS50aXRsZSAgICAgICAgICAgICAgICAgICAgIC0gVGhlIHRpdGxlLlxuICogQHByb3BlcnR5IHtzdHJpbmd9ICAgICAgZGF0YS5pbWFnZVVybCAgICAgICAgICAgICAgICAgIC0gVGhlIHVybCBwYXRoLlxuICogQHByb3BlcnR5IHtzdHJpbmd9ICAgICAgZGF0YS5kZXNjcmlwdGlvbiAgICAgICAgICAgICAgIC0gVGhlIG1ldGEgZGVzY3JpcHRpb24uXG4gKlxuICogQHByb3BlcnR5IHtzdHJpbmd9ICAgICAgYmFzZVVSTCAgICAgICAgICAgICAgICAgICAgICAgIC0gVGhlIGJhc2ljIFVSTCBhcyBpdCB3aWxsIGJlIGRpc3BsYXllZCBpbiBnb29nbGUuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbnZhciBGYWNlYm9va1ByZXZpZXcgPSBmdW5jdGlvbiggb3B0cywgaTE4biApIHtcblx0dGhpcy5pMThuID0gaTE4biB8fCB0aGlzLmNvbnN0cnVjdEkxOG4oKTtcblxuXHRmYWNlYm9va0RlZmF1bHRzLnBsYWNlaG9sZGVyID0ge1xuXHRcdHRpdGxlOiB0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiVGhpcyBpcyBhbiBleGFtcGxlIHRpdGxlIC0gZWRpdCBieSBjbGlja2luZyBoZXJlXCIgKSxcblx0XHRkZXNjcmlwdGlvbjogdGhpcy5pMThuLnNwcmludGYoXG5cdFx0XHQvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBGYWNlYm9vayAqL1xuXHRcdFx0dGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIk1vZGlmeSB5b3VyICUxJHMgZGVzY3JpcHRpb24gYnkgZWRpdGluZyBpdCByaWdodCBoZXJlXCIgKSxcblx0XHRcdFwiRmFjZWJvb2tcIlxuXHRcdCksXG5cdFx0aW1hZ2VVcmw6IFwiXCJcblx0fTtcblxuXHRkZWZhdWx0c0RlZXAoIG9wdHMsIGZhY2Vib29rRGVmYXVsdHMgKTtcblxuXHRpZiAoICFpc0VsZW1lbnQoIG9wdHMudGFyZ2V0RWxlbWVudCApICkge1xuXHRcdHRocm93IG5ldyBFcnJvciggXCJUaGUgRmFjZWJvb2sgcHJldmlldyByZXF1aXJlcyBhIHZhbGlkIHRhcmdldCBlbGVtZW50XCIgKTtcblx0fVxuXG5cdHRoaXMuZGF0YSA9IG9wdHMuZGF0YTtcblx0dGhpcy5vcHRzID0gb3B0cztcblxuXG5cdHRoaXMuX2N1cnJlbnRGb2N1cyA9IG51bGw7XG5cdHRoaXMuX2N1cnJlbnRIb3ZlciA9IG51bGw7XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemVzIGkxOG4gb2JqZWN0IGJhc2VkIG9uIHBhc3NlZCBjb25maWd1cmF0aW9uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHRyYW5zbGF0aW9ucyAtIFRoZSB2YWx1ZXMgdG8gdHJhbnNsYXRlLlxuICpcbiAqIEByZXR1cm5zIHtKZWR9IC0gVGhlIEplZCB0cmFuc2xhdGlvbiBvYmplY3QuXG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuY29uc3RydWN0STE4biA9IGZ1bmN0aW9uKCB0cmFuc2xhdGlvbnMgKSB7XG5cdHZhciBkZWZhdWx0VHJhbnNsYXRpb25zID0ge1xuXHRcdFwiZG9tYWluXCI6IFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsXG5cdFx0XCJsb2NhbGVfZGF0YVwiOiB7XG5cdFx0XHRcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiOiB7XG5cdFx0XHRcdFwiXCI6IHt9XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXG5cdHRyYW5zbGF0aW9ucyA9IHRyYW5zbGF0aW9ucyB8fCB7fTtcblxuXHRkZWZhdWx0c0RlZXAoIHRyYW5zbGF0aW9ucywgZGVmYXVsdFRyYW5zbGF0aW9ucyApO1xuXG5cdHJldHVybiBuZXcgSmVkKCB0cmFuc2xhdGlvbnMgKTtcbn07XG5cbi8qKlxuICogUmVuZGVycyB0aGUgdGVtcGxhdGUgYW5kIGJpbmQgdGhlIGV2ZW50cy5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMucmVuZGVyVGVtcGxhdGUoKTtcblx0dGhpcy5iaW5kRXZlbnRzKCk7XG5cdHRoaXMudXBkYXRlUHJldmlldygpO1xufTtcblxuLyoqXG4gKiBSZW5kZXJzIHNuaXBwZXQgZWRpdG9yIGFuZCBhZGRzIGl0IHRvIHRoZSB0YXJnZXRFbGVtZW50LlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnJlbmRlclRlbXBsYXRlID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0YXJnZXRFbGVtZW50ID0gdGhpcy5vcHRzLnRhcmdldEVsZW1lbnQ7XG5cblx0dGFyZ2V0RWxlbWVudC5pbm5lckhUTUwgPSBmYWNlYm9va0VkaXRvclRlbXBsYXRlKCB7XG5cdFx0cmVuZGVyZWQ6IHtcblx0XHRcdHRpdGxlOiBcIlwiLFxuXHRcdFx0ZGVzY3JpcHRpb246IFwiXCIsXG5cdFx0XHRpbWFnZVVybDogXCJcIixcblx0XHRcdGJhc2VVcmw6IHRoaXMub3B0cy5iYXNlVVJMXG5cdFx0fSxcblx0XHRwbGFjZWhvbGRlcjogdGhpcy5vcHRzLnBsYWNlaG9sZGVyLFxuXHRcdGkxOG46IHtcblx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIEZhY2Vib29rICovXG5cdFx0XHRlZGl0OiB0aGlzLmkxOG4uc3ByaW50ZiggdGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIkVkaXQgJTEkcyBwcmV2aWV3XCIgKSwgXCJGYWNlYm9va1wiICksXG5cdFx0XHQvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBGYWNlYm9vayAqL1xuXHRcdFx0c25pcHBldFByZXZpZXc6IHRoaXMuaTE4bi5zcHJpbnRmKCB0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiJTEkcyBwcmV2aWV3XCIgKSwgXCJGYWNlYm9va1wiICksXG5cdFx0XHQvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBGYWNlYm9vayAqL1xuXHRcdFx0c25pcHBldEVkaXRvcjogdGhpcy5pMThuLnNwcmludGYoIHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCIlMSRzIGVkaXRvclwiICksIFwiRmFjZWJvb2tcIiApXG5cdFx0fVxuXHR9ICk7XG5cblx0dGhpcy5lbGVtZW50ID0ge1xuXHRcdHJlbmRlcmVkOiB7XG5cdFx0XHR0aXRsZTogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImVkaXRhYmxlLXByZXZpZXdfX3ZhbHVlLS1mYWNlYm9vay10aXRsZVwiIClbMF0sXG5cdFx0XHRkZXNjcmlwdGlvbjogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImVkaXRhYmxlLXByZXZpZXdfX3ZhbHVlLS1mYWNlYm9vay1kZXNjcmlwdGlvblwiIClbMF1cblx0XHR9LFxuXHRcdGZpZWxkczogdGhpcy5nZXRGaWVsZHMoKSxcblx0XHRjb250YWluZXI6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJlZGl0YWJsZS1wcmV2aWV3LS1mYWNlYm9va1wiIClbMF0sXG5cdFx0Zm9ybUNvbnRhaW5lcjogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcInNuaXBwZXQtZWRpdG9yX19mb3JtXCIgKVswXSxcblx0XHRlZGl0VG9nZ2xlOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwic25pcHBldC1lZGl0b3JfX2VkaXQtYnV0dG9uXCIgKVswXSxcblx0XHRmb3JtRmllbGRzOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwic25pcHBldC1lZGl0b3JfX2Zvcm0tZmllbGRcIiApLFxuXHRcdGhlYWRpbmdFZGl0b3I6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJzbmlwcGV0LWVkaXRvcl9faGVhZGluZy1lZGl0b3JcIiApWzBdLFxuXHRcdGF1dGhvckNvbnRhaW5lcjogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImVkaXRhYmxlLXByZXZpZXdfX3ZhbHVlLS1mYWNlYm9vay1hdXRob3JcIiApWzBdXG5cdH07XG5cblx0dGhpcy5lbGVtZW50LmZvcm1Db250YWluZXIuaW5uZXJIVE1MID0gdGhpcy5lbGVtZW50LmZpZWxkcy5pbWFnZVVybC5yZW5kZXIoKVxuXHRcdCsgdGhpcy5lbGVtZW50LmZpZWxkcy50aXRsZS5yZW5kZXIoKVxuXHRcdCsgdGhpcy5lbGVtZW50LmZpZWxkcy5kZXNjcmlwdGlvbi5yZW5kZXIoKTtcblxuXHR0aGlzLmVsZW1lbnQuaW5wdXQgPSB7XG5cdFx0dGl0bGU6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJqcy1zbmlwcGV0LWVkaXRvci10aXRsZVwiIClbMF0sXG5cdFx0aW1hZ2VVcmw6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJqcy1zbmlwcGV0LWVkaXRvci1pbWFnZVVybFwiIClbMF0sXG5cdFx0ZGVzY3JpcHRpb246IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJqcy1zbmlwcGV0LWVkaXRvci1kZXNjcmlwdGlvblwiIClbMF1cblx0fTtcblxuXHR0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cyA9IHRoaXMuZ2V0RmllbGRFbGVtZW50cygpO1xuXHR0aGlzLmVsZW1lbnQuY2xvc2VFZGl0b3IgPSB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwic25pcHBldC1lZGl0b3JfX3N1Ym1pdFwiIClbMF07XG5cblx0dGhpcy5lbGVtZW50LmNhcmV0SG9va3MgPSB7XG5cdFx0dGl0bGU6IHRoaXMuZWxlbWVudC5pbnB1dC50aXRsZS5wcmV2aW91c1NpYmxpbmcsXG5cdFx0aW1hZ2VVcmw6IHRoaXMuZWxlbWVudC5pbnB1dC5pbWFnZVVybC5wcmV2aW91c1NpYmxpbmcsXG5cdFx0ZGVzY3JpcHRpb246IHRoaXMuZWxlbWVudC5pbnB1dC5kZXNjcmlwdGlvbi5wcmV2aW91c1NpYmxpbmdcblx0fTtcblxuXHR0aGlzLmVsZW1lbnQucHJldmlldyA9IHtcblx0XHR0aXRsZTogdGhpcy5lbGVtZW50LnJlbmRlcmVkLnRpdGxlLnBhcmVudE5vZGUsXG5cdFx0aW1hZ2VVcmw6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJlZGl0YWJsZS1wcmV2aWV3X19pbWFnZS0tZmFjZWJvb2tcIiApWzBdLFxuXHRcdGRlc2NyaXB0aW9uOiB0aGlzLmVsZW1lbnQucmVuZGVyZWQuZGVzY3JpcHRpb24ucGFyZW50Tm9kZVxuXHR9O1xuXG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGZvcm0gZmllbGRzLlxuICpcbiAqIEByZXR1cm5zIHt7dGl0bGU6ICosIGRlc2NyaXB0aW9uOiAqLCBpbWFnZVVybDogKiwgYnV0dG9uOiBCdXR0b259fSBPYmplY3Qgd2l0aCB0aGUgZmllbGRzLlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLmdldEZpZWxkcyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge1xuXHRcdHRpdGxlOiBuZXcgVGV4dEZpZWxkKCB7XG5cdFx0XHRjbGFzc05hbWU6IFwic25pcHBldC1lZGl0b3JfX2lucHV0IHNuaXBwZXQtZWRpdG9yX190aXRsZSBqcy1zbmlwcGV0LWVkaXRvci10aXRsZVwiLFxuXHRcdFx0aWQ6IFwiZmFjZWJvb2stZWRpdG9yLXRpdGxlXCIsXG5cdFx0XHR2YWx1ZTogdGhpcy5kYXRhLnRpdGxlLFxuXHRcdFx0cGxhY2Vob2xkZXI6IHRoaXMub3B0cy5wbGFjZWhvbGRlci50aXRsZSxcblx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIEZhY2Vib29rICovXG5cdFx0XHR0aXRsZTogdGhpcy5pMThuLnNwcmludGYoIHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCIlMSRzIHRpdGxlXCIgKSwgXCJGYWNlYm9va1wiICksXG5cdFx0XHRsYWJlbENsYXNzTmFtZTogXCJzbmlwcGV0LWVkaXRvcl9fbGFiZWxcIlxuXHRcdH0gKSxcblx0XHRkZXNjcmlwdGlvbjogbmV3IFRleHRBcmVhKCB7XG5cdFx0XHRjbGFzc05hbWU6IFwic25pcHBldC1lZGl0b3JfX2lucHV0IHNuaXBwZXQtZWRpdG9yX19kZXNjcmlwdGlvbiBqcy1zbmlwcGV0LWVkaXRvci1kZXNjcmlwdGlvblwiLFxuXHRcdFx0aWQ6IFwiZmFjZWJvb2stZWRpdG9yLWRlc2NyaXB0aW9uXCIsXG5cdFx0XHR2YWx1ZTogdGhpcy5kYXRhLmRlc2NyaXB0aW9uLFxuXHRcdFx0cGxhY2Vob2xkZXI6IHRoaXMub3B0cy5wbGFjZWhvbGRlci5kZXNjcmlwdGlvbixcblx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIEZhY2Vib29rICovXG5cdFx0XHR0aXRsZTogdGhpcy5pMThuLnNwcmludGYoIHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCIlMSRzIGRlc2NyaXB0aW9uXCIgKSwgXCJGYWNlYm9va1wiICksXG5cdFx0XHRsYWJlbENsYXNzTmFtZTogXCJzbmlwcGV0LWVkaXRvcl9fbGFiZWxcIlxuXHRcdH0gKSxcblx0XHRpbWFnZVVybDogbmV3IFRleHRGaWVsZCgge1xuXHRcdFx0Y2xhc3NOYW1lOiBcInNuaXBwZXQtZWRpdG9yX19pbnB1dCBzbmlwcGV0LWVkaXRvcl9faW1hZ2VVcmwganMtc25pcHBldC1lZGl0b3ItaW1hZ2VVcmxcIixcblx0XHRcdGlkOiBcImZhY2Vib29rLWVkaXRvci1pbWFnZVVybFwiLFxuXHRcdFx0dmFsdWU6IHRoaXMuZGF0YS5pbWFnZVVybCxcblx0XHRcdHBsYWNlaG9sZGVyOiB0aGlzLm9wdHMucGxhY2Vob2xkZXIuaW1hZ2VVcmwsXG5cdFx0XHQvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBGYWNlYm9vayAqL1xuXHRcdFx0dGl0bGU6IHRoaXMuaTE4bi5zcHJpbnRmKCB0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiJTEkcyBpbWFnZVwiICksIFwiRmFjZWJvb2tcIiApLFxuXHRcdFx0bGFiZWxDbGFzc05hbWU6IFwic25pcHBldC1lZGl0b3JfX2xhYmVsXCJcblx0XHR9IClcblx0fTtcbn07XG5cbi8qKlxuICogUmV0dXJucyBhbGwgZmllbGQgZWxlbWVudHMuXG4gKlxuICogQHJldHVybnMge3t0aXRsZTogSW5wdXRFbGVtZW50LCBkZXNjcmlwdGlvbjogSW5wdXRFbGVtZW50LCBpbWFnZVVybDogSW5wdXRFbGVtZW50fX0gVGhlIGZpZWxkIGVsZW1lbnRzLlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLmdldEZpZWxkRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHRyZXR1cm4ge1xuXHRcdHRpdGxlOiBuZXcgSW5wdXRFbGVtZW50KFxuXHRcdFx0dGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImpzLXNuaXBwZXQtZWRpdG9yLXRpdGxlXCIgKVswXSxcblx0XHRcdHtcblx0XHRcdFx0Y3VycmVudFZhbHVlOiB0aGlzLmRhdGEudGl0bGUsXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZTogdGhpcy5vcHRzLmRlZmF1bHRWYWx1ZS50aXRsZSxcblx0XHRcdFx0cGxhY2Vob2xkZXI6IHRoaXMub3B0cy5wbGFjZWhvbGRlci50aXRsZSxcblx0XHRcdFx0ZmFsbGJhY2s6IHRoaXMuaTE4bi5zcHJpbnRmKFxuXHRcdFx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIEZhY2Vib29rICovXG5cdFx0XHRcdFx0dGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIlBsZWFzZSBwcm92aWRlIGEgJTEkcyB0aXRsZSBieSBlZGl0aW5nIHRoZSBzbmlwcGV0IGJlbG93LlwiICksXG5cdFx0XHRcdFx0XCJGYWNlYm9va1wiXG5cdFx0XHRcdClcblx0XHRcdH0sXG5cdFx0XHR0aGlzLnVwZGF0ZVByZXZpZXcuYmluZCggdGhpcyApXG5cdFx0KSxcblx0XHRkZXNjcmlwdGlvbjogbmV3IElucHV0RWxlbWVudChcblx0XHRcdHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJqcy1zbmlwcGV0LWVkaXRvci1kZXNjcmlwdGlvblwiIClbMF0sXG5cdFx0XHR7XG5cdFx0XHRcdGN1cnJlbnRWYWx1ZTogdGhpcy5kYXRhLmRlc2NyaXB0aW9uLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IHRoaXMub3B0cy5kZWZhdWx0VmFsdWUuZGVzY3JpcHRpb24sXG5cdFx0XHRcdHBsYWNlaG9sZGVyOiB0aGlzLm9wdHMucGxhY2Vob2xkZXIuZGVzY3JpcHRpb24sXG5cdFx0XHRcdGZhbGxiYWNrOiB0aGlzLmkxOG4uc3ByaW50Zihcblx0XHRcdFx0XHQvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBGYWNlYm9vayAqL1xuXHRcdFx0XHRcdHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCJQbGVhc2UgcHJvdmlkZSBhICUxJHMgZGVzY3JpcHRpb24gYnkgZWRpdGluZyB0aGUgc25pcHBldCBiZWxvdy5cIiApLFxuXHRcdFx0XHRcdFwiRmFjZWJvb2tcIlxuXHRcdFx0XHQpXG5cdFx0XHR9LFxuXHRcdFx0dGhpcy51cGRhdGVQcmV2aWV3LmJpbmQoIHRoaXMgKVxuXHRcdCksXG5cdFx0aW1hZ2VVcmw6IG5ldyBJbnB1dEVsZW1lbnQoXG5cdFx0XHR0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwianMtc25pcHBldC1lZGl0b3ItaW1hZ2VVcmxcIiApWzBdLFxuXHRcdFx0e1xuXHRcdFx0XHRjdXJyZW50VmFsdWU6IHRoaXMuZGF0YS5pbWFnZVVybCxcblx0XHRcdFx0ZGVmYXVsdFZhbHVlOiB0aGlzLm9wdHMuZGVmYXVsdFZhbHVlLmltYWdlVXJsLFxuXHRcdFx0XHRwbGFjZWhvbGRlcjogdGhpcy5vcHRzLnBsYWNlaG9sZGVyLmltYWdlVXJsLFxuXHRcdFx0XHRmYWxsYmFjazogXCJcIlxuXHRcdFx0fSxcblx0XHRcdHRoaXMudXBkYXRlUHJldmlldy5iaW5kKCB0aGlzIClcblx0XHQpXG5cdH07XG59O1xuXG5cbi8qKlxuICogVXBkYXRlcyB0aGUgRmFjZWJvb2sgcHJldmlldy5cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS51cGRhdGVQcmV2aWV3ID0gZnVuY3Rpb24oKSB7XG5cdC8vIFVwZGF0ZSB0aGUgZGF0YS5cblx0dGhpcy5kYXRhLnRpdGxlID0gdGhpcy5lbGVtZW50LmZpZWxkRWxlbWVudHMudGl0bGUuZ2V0SW5wdXRWYWx1ZSgpO1xuXHR0aGlzLmRhdGEuZGVzY3JpcHRpb24gPSB0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cy5kZXNjcmlwdGlvbi5nZXRJbnB1dFZhbHVlKCk7XG5cdHRoaXMuZGF0YS5pbWFnZVVybCA9IHRoaXMuZWxlbWVudC5maWVsZEVsZW1lbnRzLmltYWdlVXJsLmdldElucHV0VmFsdWUoKTtcblxuXHQvLyBTZXRzIHRoZSB0aXRsZSBmaWVsZFxuXHR0aGlzLnNldFRpdGxlKCB0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cy50aXRsZS5nZXRWYWx1ZSgpICk7XG5cdHRoaXMuc2V0VGl0bGUoIHRoaXMuZWxlbWVudC5maWVsZEVsZW1lbnRzLnRpdGxlLmdldFZhbHVlKCkgKTtcblxuXHQvLyBTZXQgdGhlIGRlc2NyaXB0aW9uIGZpZWxkIGFuZCBwYXJzZSB0aGUgc3R5bGluZyBvZiBpdC5cblx0dGhpcy5zZXREZXNjcmlwdGlvbiggdGhpcy5lbGVtZW50LmZpZWxkRWxlbWVudHMuZGVzY3JpcHRpb24uZ2V0VmFsdWUoKSApO1xuXG5cdC8vIFNldHMgdGhlIEltYWdlXG5cdHRoaXMuc2V0SW1hZ2UoIHRoaXMuZGF0YS5pbWFnZVVybCApO1xuXG5cdC8vIENsb25lIHNvIHRoZSBkYXRhIGlzbid0IGNoYW5nZWFibGUuXG5cdHRoaXMub3B0cy5jYWxsYmFja3MudXBkYXRlU29jaWFsUHJldmlldyggY2xvbmUoIHRoaXMuZGF0YSApICk7XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIHByZXZpZXcgdGl0bGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRpdGxlIFRoZSB0aXRsZSB0byBzZXRcbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5zZXRUaXRsZSA9IGZ1bmN0aW9uKCB0aXRsZSApIHtcblx0dGl0bGUgPSB0aGlzLm9wdHMuY2FsbGJhY2tzLm1vZGlmeVRpdGxlKCB0aXRsZSApO1xuXG5cdHRoaXMuZWxlbWVudC5yZW5kZXJlZC50aXRsZS5pbm5lckhUTUwgPSB0aXRsZTtcbn07XG5cbi8qKlxuICogU2V0cyB0aGUgcHJldmlldyBkZXNjcmlwdGlvbi5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZGVzY3JpcHRpb24gVGhlIGRlc2NyaXB0aW9uIHRvIHNldFxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnNldERlc2NyaXB0aW9uID0gZnVuY3Rpb24oIGRlc2NyaXB0aW9uICkge1xuXHRkZXNjcmlwdGlvbiA9IHRoaXMub3B0cy5jYWxsYmFja3MubW9kaWZ5RGVzY3JpcHRpb24oIGRlc2NyaXB0aW9uICk7XG5cblx0dGhpcy5lbGVtZW50LnJlbmRlcmVkLmRlc2NyaXB0aW9uLmlubmVySFRNTCA9IGRlc2NyaXB0aW9uO1xuXHRyZW5kZXJEZXNjcmlwdGlvbiggdGhpcy5lbGVtZW50LnJlbmRlcmVkLmRlc2NyaXB0aW9uLCB0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cy5kZXNjcmlwdGlvbi5nZXRJbnB1dFZhbHVlKCkgKTtcbn07XG5cbi8qKlxuICogR2V0cyB0aGUgaW1hZ2UgY29udGFpbmVyLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbnRhaW5lciB0aGF0IHdpbGwgaG9sZCB0aGUgaW1hZ2UuXG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuZ2V0SW1hZ2VDb250YWluZXIgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMuZWxlbWVudC5wcmV2aWV3LmltYWdlVXJsO1xufTtcblxuLyoqXG4gKiBVcGRhdGVzIHRoZSBpbWFnZSBvYmplY3Qgd2l0aCB0aGUgbmV3IFVSTC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaW1hZ2VVcmwgVGhlIGltYWdlIHBhdGguXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5zZXRJbWFnZSA9IGZ1bmN0aW9uICggaW1hZ2VVcmwgKSB7XG5cdGltYWdlVXJsID0gdGhpcy5vcHRzLmNhbGxiYWNrcy5tb2RpZnlJbWFnZVVybCggaW1hZ2VVcmwgKTtcblxuXHRpZiAoIGltYWdlVXJsID09PSBcIlwiICYmIHRoaXMuZGF0YS5pbWFnZVVybCA9PT0gXCJcIiApIHtcblx0XHR0aGlzLnJlbW92ZUltYWdlRnJvbUNvbnRhaW5lcigpO1xuXHRcdHJldHVybiB0aGlzLm5vVXJsU2V0KCk7XG5cdH1cblxuXHR2YXIgaW1nID0gbmV3IEltYWdlKCk7XG5cblx0aW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICggdGhpcy5pc1Rvb1NtYWxsSW1hZ2UoIGltZyApICkge1xuXHRcdFx0dGhpcy5yZW1vdmVJbWFnZUZyb21Db250YWluZXIoKTtcblx0XHRcdHJldHVybiB0aGlzLmltYWdlVG9vU21hbGwoKTtcblx0XHR9XG5cblx0XHR0aGlzLnNldFNpemluZ0NsYXNzKCBpbWcgKTtcblx0XHR0aGlzLmFkZEltYWdlVG9Db250YWluZXIoIGltYWdlVXJsICk7XG5cdH0uYmluZCggdGhpcyApO1xuXG5cdGltZy5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5yZW1vdmVJbWFnZUZyb21Db250YWluZXIoKTtcblx0XHRyZXR1cm4gdGhpcy5pbWFnZUVycm9yKCk7XG5cdH0uYmluZCggdGhpcyApO1xuXG5cdC8vIExvYWQgaW1hZ2UgdG8gdHJpZ2dlciBsb2FkIG9yIGVycm9yIGV2ZW50LlxuXHRpbWcuc3JjID0gaW1hZ2VVcmw7XG59O1xuXG4vKipcbiAqIERpc3BsYXlzIHRoZSBObyBVUkwgU2V0IHdhcm5pbmcuXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5ub1VybFNldCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnJlbW92ZUltYWdlQ2xhc3NlcygpO1xuXG5cdGltYWdlUGxhY2Vob2xkZXIoXG5cdFx0dGhpcy5nZXRJbWFnZUNvbnRhaW5lcigpLFxuXHRcdHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCJQbGVhc2Ugc2VsZWN0IGFuIGltYWdlIGJ5IGNsaWNraW5nIGhlcmVcIiApLFxuXHRcdGZhbHNlLFxuXHRcdFwiZmFjZWJvb2tcIlxuXHQpO1xuXG5cdHJldHVybjtcbn07XG5cbi8qKlxuICogRGlzcGxheXMgdGhlIEltYWdlIFRvbyBTbWFsbCBlcnJvci5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLmltYWdlVG9vU21hbGwgPSBmdW5jdGlvbigpIHtcblx0dmFyIG1lc3NhZ2U7XG5cdHRoaXMucmVtb3ZlSW1hZ2VDbGFzc2VzKCk7XG5cblx0aWYgKCB0aGlzLmRhdGEuaW1hZ2VVcmwgPT09IFwiXCIgKSB7XG5cdFx0bWVzc2FnZSA9IHRoaXMuaTE4bi5zcHJpbnRmKFxuXHRcdFx0LyogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBGYWNlYm9vayAqL1xuXHRcdFx0dGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIldlIGFyZSB1bmFibGUgdG8gZGV0ZWN0IGFuIGltYWdlIFwiICtcblx0XHRcdFx0XCJpbiB5b3VyIHBvc3QgdGhhdCBpcyBsYXJnZSBlbm91Z2ggdG8gYmUgZGlzcGxheWVkIG9uIEZhY2Vib29rLiBXZSBhZHZpc2UgeW91IFwiICtcblx0XHRcdFx0XCJ0byBzZWxlY3QgYSAlMSRzIGltYWdlIHRoYXQgZml0cyB0aGUgcmVjb21tZW5kZWQgaW1hZ2Ugc2l6ZS5cIiApLFxuXHRcdFx0XCJGYWNlYm9va1wiXG5cdFx0KTtcblx0fSBlbHNlIHtcblx0XHRtZXNzYWdlID0gdGhpcy5pMThuLnNwcmludGYoXG5cdFx0XHQvKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIEZhY2Vib29rICovXG5cdFx0XHR0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiVGhlIGltYWdlIHlvdSBzZWxlY3RlZCBpcyB0b28gc21hbGwgZm9yICUxJHNcIiApLFxuXHRcdFx0XCJGYWNlYm9va1wiXG5cdFx0KTtcblx0fVxuXG5cdGltYWdlUGxhY2Vob2xkZXIoXG5cdFx0dGhpcy5nZXRJbWFnZUNvbnRhaW5lcigpLFxuXHRcdG1lc3NhZ2UsXG5cdFx0dHJ1ZSxcblx0XHRcImZhY2Vib29rXCJcblx0KTtcblxuXHRyZXR1cm47XG59O1xuXG4vKipcbiAqIERpc3BsYXlzIHRoZSBVcmwgQ2Fubm90IEJlIExvYWRlZCBlcnJvci5cbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLmltYWdlRXJyb3IgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5yZW1vdmVJbWFnZUNsYXNzZXMoKTtcblxuXHRpbWFnZVBsYWNlaG9sZGVyKFxuXHRcdHRoaXMuZ2V0SW1hZ2VDb250YWluZXIoKSxcblx0XHR0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiVGhlIGdpdmVuIGltYWdlIHVybCBjYW5ub3QgYmUgbG9hZGVkXCIgKSxcblx0XHR0cnVlLFxuXHRcdFwiZmFjZWJvb2tcIlxuXHQpO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBpbWFnZSBvZiB0aGUgaW1hZ2UgY29udGFpbmVyLlxuICogQHBhcmFtIHtzdHJpbmd9IGltYWdlIFRoZSBpbWFnZSB0byB1c2UuXG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuYWRkSW1hZ2VUb0NvbnRhaW5lciA9IGZ1bmN0aW9uKCBpbWFnZSApIHtcblx0dmFyIGNvbnRhaW5lciA9IHRoaXMuZ2V0SW1hZ2VDb250YWluZXIoKTtcblxuXHRjb250YWluZXIuaW5uZXJIVE1MID0gXCJcIjtcblx0Y29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKFwiICsgaW1hZ2UgKyBcIilcIjtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyB0aGUgaW1hZ2UgZnJvbSB0aGUgY29udGFpbmVyLlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnJlbW92ZUltYWdlRnJvbUNvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgY29udGFpbmVyID0gdGhpcy5nZXRJbWFnZUNvbnRhaW5lcigpO1xuXG5cdGNvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcIlwiO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBwcm9wZXIgQ1NTIGNsYXNzIGZvciB0aGUgY3VycmVudCBpbWFnZS5cbiAqIEBwYXJhbSB7SW1hZ2V9IGltZyBUaGUgaW1hZ2UgdG8gYmFzZSB0aGUgc2l6aW5nIGNsYXNzIG9uLlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuc2V0U2l6aW5nQ2xhc3MgPSBmdW5jdGlvbiAoIGltZyApIHtcblx0dGhpcy5yZW1vdmVJbWFnZUNsYXNzZXMoKTtcblxuXHRpZiAoIGltYWdlRGlzcGxheU1vZGUoIGltZyApID09PSBcInBvcnRyYWl0XCIgKSB7XG5cdFx0dGhpcy5zZXRQb3J0cmFpdEltYWdlQ2xhc3NlcygpO1xuXG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0aWYgKCB0aGlzLmlzU21hbGxJbWFnZSggaW1nICkgKSB7XG5cdFx0dGhpcy5zZXRTbWFsbEltYWdlQ2xhc3NlcygpO1xuXG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dGhpcy5zZXRMYXJnZUltYWdlQ2xhc3NlcygpO1xuXG5cdHJldHVybjtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbWF4IGltYWdlIHdpZHRoXG4gKlxuICogQHBhcmFtIHtJbWFnZX0gaW1nIFRoZSBpbWFnZSBvYmplY3QgdG8gdXNlLlxuICogQHJldHVybnMge2ludH0gVGhlIGNhbGN1bGF0ZWQgbWF4d2lkdGhcbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5nZXRNYXhJbWFnZVdpZHRoID0gZnVuY3Rpb24oIGltZyApIHtcblx0aWYgKCB0aGlzLmlzU21hbGxJbWFnZSggaW1nICkgKSB7XG5cdFx0cmV0dXJuIFdJRFRIX0ZBQ0VCT09LX0lNQUdFX1NNQUxMO1xuXHR9XG5cblx0cmV0dXJuIFdJRFRIX0ZBQ0VCT09LX0lNQUdFX0xBUkdFO1xufTtcblxuLyoqXG4gKiBEZXRlY3RzIGlmIHRoZSBGYWNlYm9vayBwcmV2aWV3IHNob3VsZCBzd2l0Y2ggdG8gc21hbGwgaW1hZ2UgbW9kZVxuICpcbiAqIEBwYXJhbSB7SFRNTEltYWdlRWxlbWVudH0gaW1hZ2UgVGhlIGltYWdlIGluIHF1ZXN0aW9uLlxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufSBXaGV0aGVyIHRoZSBpbWFnZSBpcyBzbWFsbC5cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5pc1NtYWxsSW1hZ2UgPSBmdW5jdGlvbiggaW1hZ2UgKSB7XG5cdHJldHVybiAoXG5cdFx0aW1hZ2Uud2lkdGggPCBGQUNFQk9PS19JTUFHRV9USFJFU0hPTERfV0lEVEggfHxcblx0XHRpbWFnZS5oZWlnaHQgPCBGQUNFQk9PS19JTUFHRV9USFJFU0hPTERfSEVJR0hUXG5cdCk7XG59O1xuXG4vKipcbiAqIERldGVjdHMgaWYgdGhlIEZhY2Vib29rIHByZXZpZXcgaW1hZ2UgaXMgdG9vIHNtYWxsXG4gKlxuICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50fSBpbWFnZSBUaGUgaW1hZ2UgaW4gcXVlc3Rpb24uXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgdGhlIGltYWdlIGlzIHRvbyBzbWFsbC5cbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5pc1Rvb1NtYWxsSW1hZ2UgPSBmdW5jdGlvbiggaW1hZ2UgKSB7XG5cdHJldHVybiAoXG5cdFx0aW1hZ2Uud2lkdGggPCBGQUNFQk9PS19JTUFHRV9UT09fU01BTExfV0lEVEggfHxcblx0XHRpbWFnZS5oZWlnaHQgPCBGQUNFQk9PS19JTUFHRV9UT09fU01BTExfSEVJR0hUXG5cdCk7XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIGNsYXNzZXMgb24gdGhlIEZhY2Vib29rIHByZXZpZXcgc28gdGhhdCBpdCB3aWxsIGRpc3BsYXkgYSBzbWFsbCBGYWNlYm9vayBpbWFnZSBwcmV2aWV3XG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUuc2V0U21hbGxJbWFnZUNsYXNzZXMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHRiZW1BZGRNb2RpZmllciggXCJmYWNlYm9vay1zbWFsbFwiLCBcInNvY2lhbC1wcmV2aWV3X19pbm5lclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbUFkZE1vZGlmaWVyKCBcImZhY2Vib29rLXNtYWxsXCIsIFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLWZhY2Vib29rXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtQWRkTW9kaWZpZXIoIFwiZmFjZWJvb2stc21hbGxcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlci0tZmFjZWJvb2tcIiwgdGFyZ2V0RWxlbWVudCApO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBzbWFsbCBpbWFnZSBjbGFzc2VzLlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnJlbW92ZVNtYWxsSW1hZ2VDbGFzc2VzID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0YXJnZXRFbGVtZW50ID0gdGhpcy5vcHRzLnRhcmdldEVsZW1lbnQ7XG5cblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwiZmFjZWJvb2stc21hbGxcIiwgXCJzb2NpYWwtcHJldmlld19faW5uZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1SZW1vdmVNb2RpZmllciggXCJmYWNlYm9vay1zbWFsbFwiLCBcImVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS1mYWNlYm9va1wiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbVJlbW92ZU1vZGlmaWVyKCBcImZhY2Vib29rLXNtYWxsXCIsIFwiZWRpdGFibGUtcHJldmlld19fdGV4dC1rZWVwZXItLWZhY2Vib29rXCIsIHRhcmdldEVsZW1lbnQgKTtcbn07XG5cbi8qKlxuICogU2V0cyB0aGUgY2xhc3NlcyBvbiB0aGUgZmFjZWJvb2sgcHJldmlldyBzbyB0aGF0IGl0IHdpbGwgZGlzcGxheSBhIGxhcmdlIGZhY2Vib29rIGltYWdlIHByZXZpZXdcbiAqL1xuRmFjZWJvb2tQcmV2aWV3LnByb3RvdHlwZS5zZXRMYXJnZUltYWdlQ2xhc3NlcyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgdGFyZ2V0RWxlbWVudCA9IHRoaXMub3B0cy50YXJnZXRFbGVtZW50O1xuXG5cdGJlbUFkZE1vZGlmaWVyKCBcImZhY2Vib29rLWxhcmdlXCIsIFwic29jaWFsLXByZXZpZXdfX2lubmVyXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtQWRkTW9kaWZpZXIoIFwiZmFjZWJvb2stbGFyZ2VcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X19pbWFnZS0tZmFjZWJvb2tcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1BZGRNb2RpZmllciggXCJmYWNlYm9vay1sYXJnZVwiLCBcImVkaXRhYmxlLXByZXZpZXdfX3RleHQta2VlcGVyLS1mYWNlYm9va1wiLCB0YXJnZXRFbGVtZW50ICk7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgdGhlIGxhcmdlIGltYWdlIGNsYXNzZXMuXG4gKi9cbkZhY2Vib29rUHJldmlldy5wcm90b3R5cGUucmVtb3ZlTGFyZ2VJbWFnZUNsYXNzZXMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHRiZW1SZW1vdmVNb2RpZmllciggXCJmYWNlYm9vay1sYXJnZVwiLCBcInNvY2lhbC1wcmV2aWV3X19pbm5lclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbVJlbW92ZU1vZGlmaWVyKCBcImZhY2Vib29rLWxhcmdlXCIsIFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLWZhY2Vib29rXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwiZmFjZWJvb2stbGFyZ2VcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlci0tZmFjZWJvb2tcIiwgdGFyZ2V0RWxlbWVudCApO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBjbGFzc2VzIG9uIHRoZSBGYWNlYm9vayBwcmV2aWV3IHNvIHRoYXQgaXQgd2lsbCBkaXNwbGF5IGEgcG9ydHJhaXQgRmFjZWJvb2sgaW1hZ2UgcHJldmlld1xuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnNldFBvcnRyYWl0SW1hZ2VDbGFzc2VzID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0YXJnZXRFbGVtZW50ID0gdGhpcy5vcHRzLnRhcmdldEVsZW1lbnQ7XG5cblx0YmVtQWRkTW9kaWZpZXIoIFwiZmFjZWJvb2stcG9ydHJhaXRcIiwgXCJzb2NpYWwtcHJldmlld19faW5uZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1BZGRNb2RpZmllciggXCJmYWNlYm9vay1wb3J0cmFpdFwiLCBcImVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS1mYWNlYm9va1wiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbUFkZE1vZGlmaWVyKCBcImZhY2Vib29rLXBvcnRyYWl0XCIsIFwiZWRpdGFibGUtcHJldmlld19fdGV4dC1rZWVwZXItLWZhY2Vib29rXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtQWRkTW9kaWZpZXIoIFwiZmFjZWJvb2stYm90dG9tXCIsIFwiZWRpdGFibGUtcHJldmlld19fd2Vic2l0ZS0tZmFjZWJvb2tcIiwgdGFyZ2V0RWxlbWVudCApO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBwb3J0cmFpdCBpbWFnZSBjbGFzc2VzLlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnJlbW92ZVBvcnRyYWl0SW1hZ2VDbGFzc2VzID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0YXJnZXRFbGVtZW50ID0gdGhpcy5vcHRzLnRhcmdldEVsZW1lbnQ7XG5cblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwiZmFjZWJvb2stcG9ydHJhaXRcIiwgXCJzb2NpYWwtcHJldmlld19faW5uZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1SZW1vdmVNb2RpZmllciggXCJmYWNlYm9vay1wb3J0cmFpdFwiLCBcImVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS1mYWNlYm9va1wiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbVJlbW92ZU1vZGlmaWVyKCBcImZhY2Vib29rLXBvcnRyYWl0XCIsIFwiZWRpdGFibGUtcHJldmlld19fdGV4dC1rZWVwZXItLWZhY2Vib29rXCIsIHRhcmdldEVsZW1lbnQgKTtcblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwiZmFjZWJvb2stYm90dG9tXCIsIFwiZWRpdGFibGUtcHJldmlld19fd2Vic2l0ZS0tZmFjZWJvb2tcIiwgdGFyZ2V0RWxlbWVudCApO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBpbWFnZSBjbGFzc2VzLlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnJlbW92ZUltYWdlQ2xhc3NlcyA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnJlbW92ZVNtYWxsSW1hZ2VDbGFzc2VzKCk7XG5cdHRoaXMucmVtb3ZlTGFyZ2VJbWFnZUNsYXNzZXMoKTtcblx0dGhpcy5yZW1vdmVQb3J0cmFpdEltYWdlQ2xhc3NlcygpO1xufTtcblxuLyoqXG4gKiBCaW5kcyB0aGUgcmVsb2FkU25pcHBldFRleHQgZnVuY3Rpb24gdG8gdGhlIGJsdXIgb2YgdGhlIHNuaXBwZXQgaW5wdXRzLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLmJpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHByZXZpZXdFdmVudHMgPSBuZXcgUHJldmlld0V2ZW50cyggaW5wdXRGYWNlYm9va1ByZXZpZXdCaW5kaW5ncywgdGhpcy5lbGVtZW50LCB0cnVlICk7XG5cdHByZXZpZXdFdmVudHMuYmluZEV2ZW50cyggdGhpcy5lbGVtZW50LmVkaXRUb2dnbGUsIHRoaXMuZWxlbWVudC5jbG9zZUVkaXRvciApO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgRmFjZWJvb2sgYXV0aG9yIG5hbWUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGF1dGhvck5hbWUgVGhlIG5hbWUgb2YgdGhlIGF1dGhvciB0byBzaG93LlxuICovXG5GYWNlYm9va1ByZXZpZXcucHJvdG90eXBlLnNldEF1dGhvciA9IGZ1bmN0aW9uKCBhdXRob3JOYW1lICkge1xuXHR2YXIgYXV0aG9ySHRtbCA9IFwiXCI7XG5cdGlmICggYXV0aG9yTmFtZSAhPT0gXCJcIiApIHtcblx0XHRhdXRob3JIdG1sID0gZmFjZWJvb2tBdXRob3JUZW1wbGF0ZShcblx0XHRcdHtcblx0XHRcdFx0YXV0aG9yTmFtZTogYXV0aG9yTmFtZSxcblx0XHRcdFx0YXV0aG9yQnk6IHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCJCeVwiIClcblx0XHRcdH1cblx0XHQpO1xuXHR9XG5cblx0dGhpcy5lbGVtZW50LmF1dGhvckNvbnRhaW5lci5pbm5lckhUTUwgPSBhdXRob3JIdG1sO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGYWNlYm9va1ByZXZpZXc7XG4iLCIvKipcbiAqIEFkZHMgYSBjbGFzcyB0byBhbiBlbGVtZW50XG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0byBhZGQgdGhlIGNsYXNzIHRvLlxuICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSBUaGUgY2xhc3MgdG8gYWRkLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCBlbGVtZW50LCBjbGFzc05hbWUgKSB7XG5cdHZhciBjbGFzc2VzID0gZWxlbWVudC5jbGFzc05hbWUuc3BsaXQoIFwiIFwiICk7XG5cblx0aWYgKCAtMSA9PT0gY2xhc3Nlcy5pbmRleE9mKCBjbGFzc05hbWUgKSApIHtcblx0XHRjbGFzc2VzLnB1c2goIGNsYXNzTmFtZSApO1xuXHR9XG5cblx0ZWxlbWVudC5jbGFzc05hbWUgPSBjbGFzc2VzLmpvaW4oIFwiIFwiICk7XG59O1xuIiwidmFyIGFkZENsYXNzID0gcmVxdWlyZSggXCIuLy4uL2FkZENsYXNzXCIgKTtcbnZhciBhZGRNb2RpZmllclRvQ2xhc3MgPSByZXF1aXJlKCBcIi4vYWRkTW9kaWZpZXJUb0NsYXNzXCIgKTtcblxuLyoqXG4gKiBBZGRzIGEgQkVNIG1vZGlmaWVyIHRvIGFuIGVsZW1lbnRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbW9kaWZpZXIgTW9kaWZpZXIgdG8gYWRkIHRvIHRoZSB0YXJnZXRcbiAqIEBwYXJhbSB7c3RyaW5nfSB0YXJnZXRDbGFzcyBUaGUgdGFyZ2V0IHRvIGFkZCB0aGUgbW9kaWZpZXIgdG9cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldFBhcmVudCBUaGUgcGFyZW50IGluIHdoaWNoIHRoZSB0YXJnZXQgc2hvdWxkIGJlXG4gKi9cbmZ1bmN0aW9uIGFkZE1vZGlmaWVyKCBtb2RpZmllciwgdGFyZ2V0Q2xhc3MsIHRhcmdldFBhcmVudCApIHtcblx0dmFyIGVsZW1lbnQgPSB0YXJnZXRQYXJlbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggdGFyZ2V0Q2xhc3MgKVswXTtcblx0dmFyIG5ld0NsYXNzID0gYWRkTW9kaWZpZXJUb0NsYXNzKCBtb2RpZmllciwgdGFyZ2V0Q2xhc3MgKTtcblxuXHRhZGRDbGFzcyggZWxlbWVudCwgbmV3Q2xhc3MgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhZGRNb2RpZmllcjtcbiIsIi8qKlxuICogQWRkcyBhIG1vZGlmaWVyIHRvIGEgY2xhc3MgbmFtZSwgbWFrZXMgc3VyZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtb2RpZmllciBUaGUgbW9kaWZpZXIgdG8gYWRkIHRvIHRoZSBjbGFzcyBuYW1lLlxuICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZSBUaGUgY2xhc3MgbmFtZSB0byBhZGQgdGhlIG1vZGlmaWVyIHRvLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBuZXcgY2xhc3Mgd2l0aCB0aGUgbW9kaWZpZXIuXG4gKi9cbmZ1bmN0aW9uIGFkZE1vZGlmaWVyVG9DbGFzcyggbW9kaWZpZXIsIGNsYXNzTmFtZSApIHtcblx0dmFyIGJhc2VDbGFzcyA9IGNsYXNzTmFtZS5yZXBsYWNlKCAvLS0uKy8sIFwiXCIgKTtcblxuXHRyZXR1cm4gYmFzZUNsYXNzICsgXCItLVwiICsgbW9kaWZpZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYWRkTW9kaWZpZXJUb0NsYXNzO1xuIiwidmFyIHJlbW92ZUNsYXNzID0gcmVxdWlyZSggXCIuLy4uL3JlbW92ZUNsYXNzXCIgKTtcbnZhciBhZGRNb2RpZmllclRvQ2xhc3MgPSByZXF1aXJlKCBcIi4vYWRkTW9kaWZpZXJUb0NsYXNzXCIgKTtcblxuLyoqXG4gKiBSZW1vdmVzIGEgQkVNIG1vZGlmaWVyIGZyb20gYW4gZWxlbWVudFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBtb2RpZmllciBNb2RpZmllciB0byBhZGQgdG8gdGhlIHRhcmdldFxuICogQHBhcmFtIHtzdHJpbmd9IHRhcmdldENsYXNzIFRoZSB0YXJnZXQgdG8gYWRkIHRoZSBtb2RpZmllciB0b1xuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gdGFyZ2V0UGFyZW50IFRoZSBwYXJlbnQgaW4gd2hpY2ggdGhlIHRhcmdldCBzaG91bGQgYmVcbiAqL1xuZnVuY3Rpb24gcmVtb3ZlTW9kaWZpZXIoIG1vZGlmaWVyLCB0YXJnZXRDbGFzcywgdGFyZ2V0UGFyZW50ICkge1xuXHR2YXIgZWxlbWVudCA9IHRhcmdldFBhcmVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCB0YXJnZXRDbGFzcyApWzBdO1xuXHR2YXIgbmV3Q2xhc3MgPSBhZGRNb2RpZmllclRvQ2xhc3MoIG1vZGlmaWVyLCB0YXJnZXRDbGFzcyApO1xuXG5cdHJlbW92ZUNsYXNzKCBlbGVtZW50LCBuZXdDbGFzcyApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlbW92ZU1vZGlmaWVyO1xuIiwiLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIGltYWdlIGRpc3BsYXkgbW9kZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbWFnZSBUaGUgaW1hZ2Ugb2JqZWN0LlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGRpc3BsYXkgbW9kZSBvZiB0aGUgaW1hZ2UuXG4gKi9cbmZ1bmN0aW9uIGltYWdlRGlzcGxheU1vZGUoIGltYWdlICkge1xuXHRpZiAoIGltYWdlLmhlaWdodCA+IGltYWdlLndpZHRoICkge1xuXHRcdHJldHVybiBcInBvcnRyYWl0XCI7XG5cdH1cblxuXHRyZXR1cm4gXCJsYW5kc2NhcGVcIjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbWFnZURpc3BsYXlNb2RlO1xuIiwiLyoqXG4gKiBDbGVhbnMgc3BhY2VzIGZyb20gdGhlIGh0bWwuXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSBodG1sIFRoZSBodG1sIHRvIG1pbmltaXplLlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSBtaW5pbWl6ZWQgaHRtbCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG1pbmltaXplSHRtbCggaHRtbCApIHtcblx0aHRtbCA9IGh0bWwucmVwbGFjZSggLyhcXHMrKS9nLCBcIiBcIiApO1xuXHRodG1sID0gaHRtbC5yZXBsYWNlKCAvPiA8L2csIFwiPjxcIiApO1xuXHRodG1sID0gaHRtbC5yZXBsYWNlKCAvID4vZywgXCI+XCIgKTtcblx0aHRtbCA9IGh0bWwucmVwbGFjZSggLz4gL2csIFwiPlwiICk7XG5cdGh0bWwgPSBodG1sLnJlcGxhY2UoIC8gPC9nLCBcIjxcIiApO1xuXHRodG1sID0gaHRtbC5yZXBsYWNlKCAvICQvLCBcIlwiICk7XG5cblx0cmV0dXJuIGh0bWw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWluaW1pemVIdG1sO1xuIiwiLyoqXG4gKiBSZW1vdmVzIGEgY2xhc3MgZnJvbSBhbiBlbGVtZW50XG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCBUaGUgZWxlbWVudCB0byByZW1vdmUgdGhlIGNsYXNzIGZyb20uXG4gKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIFRoZSBjbGFzcyB0byByZW1vdmUuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oIGVsZW1lbnQsIGNsYXNzTmFtZSApIHtcblx0dmFyIGNsYXNzZXMgPSBlbGVtZW50LmNsYXNzTmFtZS5zcGxpdCggXCIgXCIgKTtcblx0dmFyIGZvdW5kQ2xhc3MgPSBjbGFzc2VzLmluZGV4T2YoIGNsYXNzTmFtZSApO1xuXG5cdGlmICggLTEgIT09IGZvdW5kQ2xhc3MgKSB7XG5cdFx0Y2xhc3Nlcy5zcGxpY2UoIGZvdW5kQ2xhc3MsIDEgKTtcblx0fVxuXG5cdGVsZW1lbnQuY2xhc3NOYW1lID0gY2xhc3Nlcy5qb2luKCBcIiBcIiApO1xufTtcbiIsInZhciBpc0VtcHR5ID0gcmVxdWlyZSggXCJsb2Rhc2gvbGFuZy9pc0VtcHR5XCIgKTtcblxudmFyIGFkZENsYXNzID0gcmVxdWlyZSggXCIuL2FkZENsYXNzXCIgKTtcbnZhciByZW1vdmVDbGFzcyA9IHJlcXVpcmUoIFwiLi9yZW1vdmVDbGFzc1wiICk7XG5cbi8qKlxuICogTWFrZXMgdGhlIHJlbmRlcmVkIGRlc2NyaXB0aW9uIGdyYXkgaWYgbm8gZGVzY3JpcHRpb24gaGFzIGJlZW4gc2V0IGJ5IHRoZSB1c2VyLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBkZXNjcmlwdGlvbkVsZW1lbnQgVGFyZ2V0IGRlc2NyaXB0aW9uIGVsZW1lbnRcbiAqIEBwYXJhbSB7c3RyaW5nfSBkZXNjcmlwdGlvbiBDdXJyZW50IGRlc2NyaXB0aW9uXG4gKi9cbmZ1bmN0aW9uIHJlbmRlckRlc2NyaXB0aW9uKCBkZXNjcmlwdGlvbkVsZW1lbnQsIGRlc2NyaXB0aW9uICkge1xuXHRpZiAoIGlzRW1wdHkoIGRlc2NyaXB0aW9uICkgKSB7XG5cdFx0YWRkQ2xhc3MoIGRlc2NyaXB0aW9uRWxlbWVudCwgXCJkZXNjLXJlbmRlclwiICk7XG5cdFx0cmVtb3ZlQ2xhc3MoIGRlc2NyaXB0aW9uRWxlbWVudCwgXCJkZXNjLWRlZmF1bHRcIiApO1xuXHR9IGVsc2Uge1xuXHRcdGFkZENsYXNzKCBkZXNjcmlwdGlvbkVsZW1lbnQsIFwiZGVzYy1kZWZhdWx0XCIgKTtcblx0XHRyZW1vdmVDbGFzcyggZGVzY3JpcHRpb25FbGVtZW50LCBcImRlc2MtcmVuZGVyXCIgKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlbmRlckRlc2NyaXB0aW9uO1xuIiwidmFyIGRlZmF1bHRzID0gcmVxdWlyZSggXCJsb2Rhc2gvb2JqZWN0L2RlZmF1bHRzXCIgKTtcbnZhciBtaW5pbWl6ZUh0bWwgPSByZXF1aXJlKCBcIi4uL2hlbHBlcnMvbWluaW1pemVIdG1sXCIgKTtcblxuLyoqXG4gKiBGYWN0b3J5IGZvciB0aGUgaW5wdXRmaWVsZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdGVtcGxhdGUgVGVtcGxhdGUgb2JqZWN0IHRvIHVzZS5cbiAqIEByZXR1cm5zIHtUZXh0RmllbGR9IFRoZSB0ZXh0ZmllbGQgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBpbnB1dEZpZWxkRmFjdG9yeSggdGVtcGxhdGUgKSB7XG5cblx0dmFyIGRlZmF1bHRBdHRyaWJ1dGVzID0ge1xuXHRcdHZhbHVlOiBcIlwiLFxuXHRcdGNsYXNzTmFtZTogXCJcIixcblx0XHRpZDogXCJcIixcblx0XHRwbGFjZWhvbGRlcjogXCJcIixcblx0XHRuYW1lOiBcIlwiLFxuXHRcdHRpdGxlOiBcIlwiLFxuXHRcdGxhYmVsQ2xhc3NOYW1lOiBcIlwiXG5cdH07XG5cblx0LyoqXG5cdCAqIFJlcHJlc2VudHMgYW4gSFRNTCB0ZXh0IGZpZWxkXG5cdCAqXG5cdCAqIEBwYXJhbSB7T2JqZWN0fSBhdHRyaWJ1dGVzIFRoZSBhdHRyaWJ1dGVzIHRvIHNldCBvbiB0aGUgSFRNTCBlbGVtZW50XG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGVzLnZhbHVlIFRoZSB2YWx1ZSBmb3IgdGhpcyB0ZXh0IGZpZWxkXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGVzLnBsYWNlaG9sZGVyIFRoZSBwbGFjZWhvbGRlciBmb3IgdGhpcyB0ZXh0IGZpZWxkXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGVzLm5hbWUgVGhlIG5hbWUgZm9yIHRoaXMgdGV4dCBmaWVsZFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlcy5pZCBUaGUgaWQgZm9yIHRoaXMgdGV4dCBmaWVsZFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlcy5jbGFzc05hbWUgVGhlIGNsYXNzIGZvciB0aGlzIHRleHQgZmllbGRcblx0ICogQHBhcmFtIHtzdHJpbmd9IGF0dHJpYnV0ZXMudGl0bGUgVGhlIHRpdGxlIHRoYXQgZGVzY3JpYmVzIHRoaXMgdGV4dCBmaWVsZFxuXHQgKlxuXHQgKiBAY29uc3RydWN0b3Jcblx0ICovXG5cdGZ1bmN0aW9uIFRleHRGaWVsZCggYXR0cmlidXRlcyApIHtcblx0XHRhdHRyaWJ1dGVzID0gYXR0cmlidXRlcyB8fCB7fTtcblx0XHRhdHRyaWJ1dGVzID0gZGVmYXVsdHMoIGF0dHJpYnV0ZXMsIGRlZmF1bHRBdHRyaWJ1dGVzICk7XG5cblx0XHR0aGlzLl9hdHRyaWJ1dGVzID0gYXR0cmlidXRlcztcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBIVE1MIGF0dHJpYnV0ZXMgc2V0IGZvciB0aGlzIHRleHQgZmllbGRcblx0ICpcblx0ICogQHJldHVybnMge09iamVjdH0gVGhlIEhUTUwgYXR0cmlidXRlc1xuXHQgKi9cblx0VGV4dEZpZWxkLnByb3RvdHlwZS5nZXRBdHRyaWJ1dGVzID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2F0dHJpYnV0ZXM7XG5cdH07XG5cblx0LyoqXG5cdCAqIFJlbmRlcnMgdGhlIHRleHQgZmllbGQgdG8gSFRNTFxuXHQgKlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgcmVuZGVyZWQgSFRNTFxuXHQgKi9cblx0VGV4dEZpZWxkLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgaHRtbCA9IHRlbXBsYXRlKCB0aGlzLmdldEF0dHJpYnV0ZXMoKSApO1xuXG5cdFx0aHRtbCA9IG1pbmltaXplSHRtbCggaHRtbCApO1xuXG5cdFx0cmV0dXJuIGh0bWw7XG5cdH07XG5cblx0LyoqXG5cdCAqIFNldCB0aGUgdmFsdWUgb2YgdGhlIGlucHV0IGZpZWxkXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0IG9uIHRoaXMgaW5wdXQgZmllbGRcblx0ICovXG5cdFRleHRGaWVsZC5wcm90b3R5cGUuc2V0VmFsdWUgPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dGhpcy5fYXR0cmlidXRlcy52YWx1ZSA9IHZhbHVlO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBTZXQgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dCBmaWVsZFxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lIFRoZSBjbGFzcyB0byBzZXQgb24gdGhpcyBpbnB1dCBmaWVsZFxuXHQgKi9cblx0VGV4dEZpZWxkLnByb3RvdHlwZS5zZXRDbGFzc05hbWUgPSBmdW5jdGlvbiggY2xhc3NOYW1lICkge1xuXHRcdHRoaXMuX2F0dHJpYnV0ZXMuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuXHR9O1xuXG5cdHJldHVybiBUZXh0RmllbGQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5wdXRGaWVsZEZhY3Rvcnk7XG4iLCJ2YXIgaW5wdXRGaWVsZEZhY3RvcnkgPSByZXF1aXJlKCBcIi4vaW5wdXRGaWVsZFwiICk7XG5cbm1vZHVsZS5leHBvcnRzID0gaW5wdXRGaWVsZEZhY3RvcnkoIHJlcXVpcmUoIFwiLi4vdGVtcGxhdGVzXCIgKS5maWVsZHMudGV4dCApO1xuIiwidmFyIGlucHV0RmllbGRGYWN0b3J5ID0gcmVxdWlyZSggXCIuL2lucHV0RmllbGRcIiApO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlucHV0RmllbGRGYWN0b3J5KCByZXF1aXJlKCBcIi4uL3RlbXBsYXRlc1wiICkuZmllbGRzLnRleHRhcmVhICk7XG4iLCJ2YXIgZm9yRWFjaCA9IHJlcXVpcmUoIFwibG9kYXNoL2NvbGxlY3Rpb24vZm9yRWFjaFwiICk7XG5cbnZhciBhZGRDbGFzcyA9IHJlcXVpcmUoIFwiLi4vaGVscGVycy9hZGRDbGFzcy5qc1wiICk7XG52YXIgcmVtb3ZlQ2xhc3MgPSByZXF1aXJlKCBcIi4uL2hlbHBlcnMvcmVtb3ZlQ2xhc3MuanNcIiApO1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYmluZGluZ3MgVGhlIGZpZWxkcyB0byBiaW5kLlxuICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnQgVGhlIGVsZW1lbnQgdG8gYmluZCB0aGUgZXZlbnRzIHRvLlxuICogQHBhcmFtIHtib29sZWFufSBhbHdheXNPcGVuIFdoZXRoZXIgdGhlIGlucHV0IGZvcm0gc2hvdWxkIGFsd2F5cyBiZSBvcGVuLlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFByZXZpZXdFdmVudHMoIGJpbmRpbmdzLCBlbGVtZW50LCBhbHdheXNPcGVuICkge1xuXHR0aGlzLl9iaW5kaW5ncyA9IGJpbmRpbmdzO1xuXHR0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuXHR0aGlzLl9hbHdheXNPcGVuID0gYWx3YXlzT3Blbjtcbn1cblxuLyoqXG4gKiBCaW5kIHRoZSBldmVudHMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGVkaXRUb2dnbGUgLSBUaGUgZWRpdCB0b2dnbGUgZWxlbWVudFxuICogQHBhcmFtIHtPYmplY3R9IGNsb3NlRWRpdG9yIC0gVGhlIGJ1dHRvbiB0byBjbG9zZSB0aGUgZWRpdG9yXG4gKi9cblByZXZpZXdFdmVudHMucHJvdG90eXBlLmJpbmRFdmVudHMgPSBmdW5jdGlvbiggZWRpdFRvZ2dsZSwgY2xvc2VFZGl0b3IgKSB7XG5cdGlmICggIXRoaXMuX2Fsd2F5c09wZW4gKSB7XG5cdFx0ZWRpdFRvZ2dsZS5hZGRFdmVudExpc3RlbmVyKCBcImNsaWNrXCIsIHRoaXMudG9nZ2xlRWRpdG9yLmJpbmQoIHRoaXMgKSApO1xuXHRcdGNsb3NlRWRpdG9yLmFkZEV2ZW50TGlzdGVuZXIoIFwiY2xpY2tcIiwgdGhpcy5jbG9zZUVkaXRvci5iaW5kKCB0aGlzICkgKTtcblx0fVxuXG5cdC8vIExvb3AgdGhyb3VnaCB0aGUgYmluZGluZ3MgYW5kIGJpbmQgYSBjbGljayBoYW5kbGVyIHRvIHRoZSBjbGljayB0byBmb2N1cyB0aGUgZm9jdXMgZWxlbWVudC5cblx0Zm9yRWFjaCggdGhpcy5fYmluZGluZ3MsIHRoaXMuYmluZElucHV0RXZlbnQuYmluZCggdGhpcyApICk7XG59O1xuXG4vKipcbiAqIEJpbmRzIHRoZSBldmVudCBmb3IgdGhlIGlucHV0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGJpbmRpbmcgVGhlIGZpZWxkIHRvIGJpbmQuXG4gKi9cblByZXZpZXdFdmVudHMucHJvdG90eXBlLmJpbmRJbnB1dEV2ZW50ID0gZnVuY3Rpb24oIGJpbmRpbmcgKSB7XG5cdHZhciBwcmV2aWV3RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIGJpbmRpbmcucHJldmlldyApWzBdO1xuXHR2YXIgaW5wdXRFbGVtZW50ID0gdGhpcy5lbGVtZW50LmlucHV0WyBiaW5kaW5nLmlucHV0RmllbGQgXTtcblxuXHQvLyBNYWtlIHRoZSBwcmV2aWV3IGVsZW1lbnQgY2xpY2sgb3BlbiB0aGUgZWRpdG9yIGFuZCBmb2N1cyB0aGUgY29ycmVjdCBpbnB1dC5cblx0cHJldmlld0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcblx0XHR0aGlzLm9wZW5FZGl0b3IoKTtcblx0XHRpbnB1dEVsZW1lbnQuZm9jdXMoKTtcblx0fS5iaW5kKCB0aGlzICkgKTtcblxuXHQvLyBNYWtlIGZvY3VzaW5nIGFuIGlucHV0LCB1cGRhdGUgdGhlIGNhcmV0cy5cblx0aW5wdXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoIFwiZm9jdXNcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5fY3VycmVudEZvY3VzID0gYmluZGluZy5pbnB1dEZpZWxkO1xuXG5cdFx0dGhpcy5fdXBkYXRlRm9jdXNDYXJldHMoKTtcblx0fS5iaW5kKCB0aGlzICkgKTtcblxuXHQvLyBNYWtlIHJlbW92aW5nIGZvY3VzIGZyb20gYW4gZWxlbWVudCwgdXBkYXRlIHRoZSBjYXJldHMuXG5cdGlucHV0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCBcImJsdXJcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5fY3VycmVudEZvY3VzID0gbnVsbDtcblxuXHRcdHRoaXMuX3VwZGF0ZUZvY3VzQ2FyZXRzKCk7XG5cdH0uYmluZCggdGhpcyApICk7XG5cblx0cHJldmlld0VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggXCJtb3VzZW92ZXJcIiwgZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5fY3VycmVudEhvdmVyID0gYmluZGluZy5pbnB1dEZpZWxkO1xuXG5cdFx0dGhpcy5fdXBkYXRlSG92ZXJDYXJldHMoKTtcblx0fS5iaW5kKCB0aGlzICkgKTtcblxuXHRwcmV2aWV3RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCBcIm1vdXNlb3V0XCIsIGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX2N1cnJlbnRIb3ZlciA9IG51bGw7XG5cblx0XHR0aGlzLl91cGRhdGVIb3ZlckNhcmV0cygpO1xuXHR9LmJpbmQoIHRoaXMgKSApO1xufTtcblxuLyoqXG4gKiBPcGVucyB0aGUgc25pcHBldCBlZGl0b3IuXG4gKlxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cblByZXZpZXdFdmVudHMucHJvdG90eXBlLm9wZW5FZGl0b3IgPSBmdW5jdGlvbigpIHtcblxuXHRpZiAoIHRoaXMuX2Fsd2F5c09wZW4gKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gSGlkZSB0aGVzZSBlbGVtZW50cy5cblx0YWRkQ2xhc3MoIHRoaXMuZWxlbWVudC5lZGl0VG9nZ2xlLCAgICAgICBcInNuaXBwZXQtZWRpdG9yLS1oaWRkZW5cIiApO1xuXG5cdC8vIFNob3cgdGhlc2UgZWxlbWVudHMuXG5cdHJlbW92ZUNsYXNzKCB0aGlzLmVsZW1lbnQuZm9ybUNvbnRhaW5lciwgXCJzbmlwcGV0LWVkaXRvci0taGlkZGVuXCIgKTtcblx0cmVtb3ZlQ2xhc3MoIHRoaXMuZWxlbWVudC5oZWFkaW5nRWRpdG9yLCBcInNuaXBwZXQtZWRpdG9yLS1oaWRkZW5cIiApO1xuXG5cdHRoaXMub3BlbmVkID0gdHJ1ZTtcbn07XG5cbi8qKlxuICogQ2xvc2VzIHRoZSBzbmlwcGV0IGVkaXRvci5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuUHJldmlld0V2ZW50cy5wcm90b3R5cGUuY2xvc2VFZGl0b3IgPSBmdW5jdGlvbigpIHtcblxuXHRpZiAoIHRoaXMuX2Fsd2F5c09wZW4gKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Ly8gSGlkZSB0aGVzZSBlbGVtZW50cy5cblx0YWRkQ2xhc3MoIHRoaXMuZWxlbWVudC5mb3JtQ29udGFpbmVyLCAgICAgXCJzbmlwcGV0LWVkaXRvci0taGlkZGVuXCIgKTtcblx0YWRkQ2xhc3MoIHRoaXMuZWxlbWVudC5oZWFkaW5nRWRpdG9yLCAgICAgXCJzbmlwcGV0LWVkaXRvci0taGlkZGVuXCIgKTtcblxuXHQvLyBTaG93IHRoZXNlIGVsZW1lbnRzLlxuXHRyZW1vdmVDbGFzcyggdGhpcy5lbGVtZW50LmVkaXRUb2dnbGUsICAgICBcInNuaXBwZXQtZWRpdG9yLS1oaWRkZW5cIiApO1xuXG5cdHRoaXMub3BlbmVkID0gZmFsc2U7XG59O1xuXG4vKipcbiAqIFRvZ2dsZXMgdGhlIHNuaXBwZXQgZWRpdG9yLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5QcmV2aWV3RXZlbnRzLnByb3RvdHlwZS50b2dnbGVFZGl0b3IgPSBmdW5jdGlvbigpIHtcblx0aWYgKCB0aGlzLm9wZW5lZCApIHtcblx0XHR0aGlzLmNsb3NlRWRpdG9yKCk7XG5cdH0gZWxzZSB7XG5cdFx0dGhpcy5vcGVuRWRpdG9yKCk7XG5cdH1cbn07XG5cbi8qKlxuICogVXBkYXRlcyBjYXJldHMgYmVmb3JlIHRoZSBwcmV2aWV3IGFuZCBpbnB1dCBmaWVsZHMuXG4gKlxuICogQHByaXZhdGVcbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuUHJldmlld0V2ZW50cy5wcm90b3R5cGUuX3VwZGF0ZUZvY3VzQ2FyZXRzID0gZnVuY3Rpb24oKSB7XG5cdHZhciBmb2N1c2VkQ2FyZXRIb29rLCBmb2N1c2VkUHJldmlldztcblxuXHQvLyBEaXNhYmxlIGFsbCBjYXJldHMgb24gdGhlIGxhYmVscy5cblx0Zm9yRWFjaCggdGhpcy5lbGVtZW50LmNhcmV0SG9va3MsIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXHRcdHJlbW92ZUNsYXNzKCBlbGVtZW50LCBcInNuaXBwZXQtZWRpdG9yX19jYXJldC1ob29rLS1mb2N1c1wiICk7XG5cdH0gKTtcblxuXHQvLyBEaXNhYmxlIGFsbCBjYXJldHMgb24gdGhlIHByZXZpZXdzLlxuXHRmb3JFYWNoKCB0aGlzLmVsZW1lbnQucHJldmlldywgZnVuY3Rpb24oIGVsZW1lbnQgKSB7XG5cdFx0cmVtb3ZlQ2xhc3MoIGVsZW1lbnQsIFwic25pcHBldC1lZGl0b3JfX2NvbnRhaW5lci0tZm9jdXNcIiApO1xuXHR9ICk7XG5cblx0aWYgKCBudWxsICE9PSB0aGlzLl9jdXJyZW50Rm9jdXMgKSB7XG5cdFx0Zm9jdXNlZENhcmV0SG9vayA9IHRoaXMuZWxlbWVudC5jYXJldEhvb2tzWyB0aGlzLl9jdXJyZW50Rm9jdXMgXTtcblx0XHRmb2N1c2VkUHJldmlldyA9IHRoaXMuZWxlbWVudC5wcmV2aWV3WyB0aGlzLl9jdXJyZW50Rm9jdXMgXTtcblxuXHRcdGFkZENsYXNzKCBmb2N1c2VkQ2FyZXRIb29rLCBcInNuaXBwZXQtZWRpdG9yX19jYXJldC1ob29rLS1mb2N1c1wiICk7XG5cdFx0YWRkQ2xhc3MoIGZvY3VzZWRQcmV2aWV3LCBcInNuaXBwZXQtZWRpdG9yX19jb250YWluZXItLWZvY3VzXCIgKTtcblx0fVxufTtcblxuLyoqXG4gKiBVcGRhdGVzIGhvdmVyIGNhcmV0cyBiZWZvcmUgdGhlIGlucHV0IGZpZWxkcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5QcmV2aWV3RXZlbnRzLnByb3RvdHlwZS5fdXBkYXRlSG92ZXJDYXJldHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIGhvdmVyZWRDYXJldEhvb2s7XG5cblx0Zm9yRWFjaCggdGhpcy5lbGVtZW50LmNhcmV0SG9va3MsIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXHRcdHJlbW92ZUNsYXNzKCBlbGVtZW50LCBcInNuaXBwZXQtZWRpdG9yX19jYXJldC1ob29rLS1ob3ZlclwiICk7XG5cdH0gKTtcblxuXHRpZiAoIG51bGwgIT09IHRoaXMuX2N1cnJlbnRIb3ZlciApIHtcblx0XHRob3ZlcmVkQ2FyZXRIb29rID0gdGhpcy5lbGVtZW50LmNhcmV0SG9va3NbIHRoaXMuX2N1cnJlbnRIb3ZlciBdO1xuXG5cdFx0YWRkQ2xhc3MoIGhvdmVyZWRDYXJldEhvb2ssIFwic25pcHBldC1lZGl0b3JfX2NhcmV0LWhvb2stLWhvdmVyXCIgKTtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcmV2aWV3RXZlbnRzO1xuIiwiOyhmdW5jdGlvbigpIHtcbiAgdmFyIHVuZGVmaW5lZDtcblxuICB2YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbiAgdmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbiAgdmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbiAgdmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4gIHZhciBmcmVlTW9kdWxlID0gZnJlZUV4cG9ydHMgJiYgdHlwZW9mIG1vZHVsZSA9PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgIW1vZHVsZS5ub2RlVHlwZSAmJiBtb2R1bGU7XG5cbiAgLyoqIFVzZWQgYXMgYSBzYWZlIHJlZmVyZW5jZSBmb3IgYHVuZGVmaW5lZGAgaW4gcHJlLUVTNSBlbnZpcm9ubWVudHMuICovXG4gIHZhciB1bmRlZmluZWQ7XG5cbiAgLyoqIFVzZWQgYXMgdGhlIHNlbWFudGljIHZlcnNpb24gbnVtYmVyLiAqL1xuICB2YXIgVkVSU0lPTiA9ICc0LjE3LjQnO1xuXG4gIC8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xuICB2YXIgSU5GSU5JVFkgPSAxIC8gMDtcblxuICAvKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG4gIHZhciBudWxsVGFnID0gJ1tvYmplY3QgTnVsbF0nLFxuICAgICAgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXScsXG4gICAgICB1bmRlZmluZWRUYWcgPSAnW29iamVjdCBVbmRlZmluZWRdJztcblxuICAvKiogVXNlZCB0byBtYXRjaCBIVE1MIGVudGl0aWVzIGFuZCBIVE1MIGNoYXJhY3RlcnMuICovXG4gIHZhciByZVVuZXNjYXBlZEh0bWwgPSAvWyY8PlwiJ10vZyxcbiAgICAgIHJlSGFzVW5lc2NhcGVkSHRtbCA9IFJlZ0V4cChyZVVuZXNjYXBlZEh0bWwuc291cmNlKTtcblxuICAvKiogVXNlZCB0byBtYXAgY2hhcmFjdGVycyB0byBIVE1MIGVudGl0aWVzLiAqL1xuICB2YXIgaHRtbEVzY2FwZXMgPSB7XG4gICAgJyYnOiAnJmFtcDsnLFxuICAgICc8JzogJyZsdDsnLFxuICAgICc+JzogJyZndDsnLFxuICAgICdcIic6ICcmcXVvdDsnLFxuICAgIFwiJ1wiOiAnJiMzOTsnXG4gIH07XG5cbiAgLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbiAgdmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG4gIC8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG4gIHZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4gIC8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xuICB2YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAvKipcbiAgICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBfLm1hcGAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlXG4gICAqIHNob3J0aGFuZHMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7QXJyYXl9IFthcnJheV0gVGhlIGFycmF5IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBuZXcgbWFwcGVkIGFycmF5LlxuICAgKi9cbiAgZnVuY3Rpb24gYXJyYXlNYXAoYXJyYXksIGl0ZXJhdGVlKSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IGFycmF5ID09IG51bGwgPyAwIDogYXJyYXkubGVuZ3RoLFxuICAgICAgICByZXN1bHQgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHJvcGVydHlPZmAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gICAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFjY2Vzc29yIGZ1bmN0aW9uLlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZVByb3BlcnR5T2Yob2JqZWN0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2VkIGJ5IGBfLmVzY2FwZWAgdG8gY29udmVydCBjaGFyYWN0ZXJzIHRvIEhUTUwgZW50aXRpZXMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjaHIgVGhlIG1hdGNoZWQgY2hhcmFjdGVyIHRvIGVzY2FwZS5cbiAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgZXNjYXBlZCBjaGFyYWN0ZXIuXG4gICAqL1xuICB2YXIgZXNjYXBlSHRtbENoYXIgPSBiYXNlUHJvcGVydHlPZihodG1sRXNjYXBlcyk7XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xuICB2YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4gIC8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xuICB2YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuICAvKipcbiAgICogVXNlZCB0byByZXNvbHZlIHRoZVxuICAgKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAgICogb2YgdmFsdWVzLlxuICAgKi9cbiAgdmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbiAgLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG4gIHZhciBTeW1ib2wgPSByb290LlN5bWJvbCxcbiAgICAgIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4gIC8qKiBVc2VkIHRvIGxvb2t1cCB1bm1pbmlmaWVkIGZ1bmN0aW9uIG5hbWVzLiAqL1xuICB2YXIgcmVhbE5hbWVzID0ge307XG5cbiAgLyoqIFVzZWQgdG8gY29udmVydCBzeW1ib2xzIHRvIHByaW1pdGl2ZXMgYW5kIHN0cmluZ3MuICovXG4gIHZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG4gICAgICBzeW1ib2xUb1N0cmluZyA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udG9TdHJpbmcgOiB1bmRlZmluZWQ7XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYCB3aXRob3V0IGZhbGxiYWNrcyBmb3IgYnVnZ3kgZW52aXJvbm1lbnRzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAgICovXG4gIGZ1bmN0aW9uIGJhc2VHZXRUYWcodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWRUYWcgOiBudWxsVGFnO1xuICAgIH1cbiAgICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkpXG4gICAgICA/IGdldFJhd1RhZyh2YWx1ZSlcbiAgICAgIDogb2JqZWN0VG9TdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRvU3RyaW5nYCB3aGljaCBkb2Vzbid0IGNvbnZlcnQgbnVsbGlzaFxuICAgKiB2YWx1ZXMgdG8gZW1wdHkgc3RyaW5ncy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc3RyaW5nLlxuICAgKi9cbiAgZnVuY3Rpb24gYmFzZVRvU3RyaW5nKHZhbHVlKSB7XG4gICAgLy8gRXhpdCBlYXJseSBmb3Igc3RyaW5ncyB0byBhdm9pZCBhIHBlcmZvcm1hbmNlIGhpdCBpbiBzb21lIGVudmlyb25tZW50cy5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgLy8gUmVjdXJzaXZlbHkgY29udmVydCB2YWx1ZXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICAgIHJldHVybiBhcnJheU1hcCh2YWx1ZSwgYmFzZVRvU3RyaW5nKSArICcnO1xuICAgIH1cbiAgICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgICByZXR1cm4gc3ltYm9sVG9TdHJpbmcgPyBzeW1ib2xUb1N0cmluZy5jYWxsKHZhbHVlKSA6ICcnO1xuICAgIH1cbiAgICB2YXIgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICAgIHJldHVybiAocmVzdWx0ID09ICcwJyAmJiAoMSAvIHZhbHVlKSA9PSAtSU5GSU5JVFkpID8gJy0wJyA6IHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VHZXRUYWdgIHdoaWNoIGlnbm9yZXMgYFN5bWJvbC50b1N0cmluZ1RhZ2AgdmFsdWVzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgcmF3IGB0b1N0cmluZ1RhZ2AuXG4gICAqL1xuICBmdW5jdGlvbiBnZXRSYXdUYWcodmFsdWUpIHtcbiAgICB2YXIgaXNPd24gPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyksXG4gICAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICAgIHRyeSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB1bmRlZmluZWQ7XG4gICAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG5cbiAgICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gICAgaWYgKHVubWFza2VkKSB7XG4gICAgICBpZiAoaXNPd24pIHtcbiAgICAgICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdGFnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVsZXRlIHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAgICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAgICovXG4gIGZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gICAgcmV0dXJuIG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGFuIGBBcnJheWAgb2JqZWN0LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSAwLjEuMFxuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gICAqIC8vID0+IHRydWVcbiAgICpcbiAgICogXy5pc0FycmF5KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKlxuICAgKiBfLmlzQXJyYXkoJ2FiYycpO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKlxuICAgKiBfLmlzQXJyYXkoXy5ub29wKTtcbiAgICogLy8gPT4gZmFsc2VcbiAgICovXG4gIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gICAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAgICpcbiAgICogQHN0YXRpY1xuICAgKiBAbWVtYmVyT2YgX1xuICAgKiBAc2luY2UgNC4wLjBcbiAgICogQGNhdGVnb3J5IExhbmdcbiAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAgICogLy8gPT4gdHJ1ZVxuICAgKlxuICAgKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gICAqIC8vID0+IGZhbHNlXG4gICAqXG4gICAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKi9cbiAgZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSA0LjAuMFxuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzeW1ib2wsIGVsc2UgYGZhbHNlYC5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICAgKiAvLyA9PiB0cnVlXG4gICAqXG4gICAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICAgKiAvLyA9PiBmYWxzZVxuICAgKi9cbiAgZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcuIEFuIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZCBmb3IgYG51bGxgXG4gICAqIGFuZCBgdW5kZWZpbmVkYCB2YWx1ZXMuIFRoZSBzaWduIG9mIGAtMGAgaXMgcHJlc2VydmVkLlxuICAgKlxuICAgKiBAc3RhdGljXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBzaW5jZSA0LjAuMFxuICAgKiBAY2F0ZWdvcnkgTGFuZ1xuICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBfLnRvU3RyaW5nKG51bGwpO1xuICAgKiAvLyA9PiAnJ1xuICAgKlxuICAgKiBfLnRvU3RyaW5nKC0wKTtcbiAgICogLy8gPT4gJy0wJ1xuICAgKlxuICAgKiBfLnRvU3RyaW5nKFsxLCAyLCAzXSk7XG4gICAqIC8vID0+ICcxLDIsMydcbiAgICovXG4gIGZ1bmN0aW9uIHRvU3RyaW5nKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09IG51bGwgPyAnJyA6IGJhc2VUb1N0cmluZyh2YWx1ZSk7XG4gIH1cblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIHRoZSBjaGFyYWN0ZXJzIFwiJlwiLCBcIjxcIiwgXCI+XCIsICdcIicsIGFuZCBcIidcIiBpbiBgc3RyaW5nYCB0byB0aGVpclxuICAgKiBjb3JyZXNwb25kaW5nIEhUTUwgZW50aXRpZXMuXG4gICAqXG4gICAqICoqTm90ZToqKiBObyBvdGhlciBjaGFyYWN0ZXJzIGFyZSBlc2NhcGVkLiBUbyBlc2NhcGUgYWRkaXRpb25hbFxuICAgKiBjaGFyYWN0ZXJzIHVzZSBhIHRoaXJkLXBhcnR5IGxpYnJhcnkgbGlrZSBbX2hlX10oaHR0cHM6Ly9tdGhzLmJlL2hlKS5cbiAgICpcbiAgICogVGhvdWdoIHRoZSBcIj5cIiBjaGFyYWN0ZXIgaXMgZXNjYXBlZCBmb3Igc3ltbWV0cnksIGNoYXJhY3RlcnMgbGlrZVxuICAgKiBcIj5cIiBhbmQgXCIvXCIgZG9uJ3QgbmVlZCBlc2NhcGluZyBpbiBIVE1MIGFuZCBoYXZlIG5vIHNwZWNpYWwgbWVhbmluZ1xuICAgKiB1bmxlc3MgdGhleSdyZSBwYXJ0IG9mIGEgdGFnIG9yIHVucXVvdGVkIGF0dHJpYnV0ZSB2YWx1ZS4gU2VlXG4gICAqIFtNYXRoaWFzIEJ5bmVucydzIGFydGljbGVdKGh0dHBzOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9hbWJpZ3VvdXMtYW1wZXJzYW5kcylcbiAgICogKHVuZGVyIFwic2VtaS1yZWxhdGVkIGZ1biBmYWN0XCIpIGZvciBtb3JlIGRldGFpbHMuXG4gICAqXG4gICAqIFdoZW4gd29ya2luZyB3aXRoIEhUTUwgeW91IHNob3VsZCBhbHdheXNcbiAgICogW3F1b3RlIGF0dHJpYnV0ZSB2YWx1ZXNdKGh0dHA6Ly93b25rby5jb20vcG9zdC9odG1sLWVzY2FwaW5nKSB0byByZWR1Y2VcbiAgICogWFNTIHZlY3RvcnMuXG4gICAqXG4gICAqIEBzdGF0aWNcbiAgICogQHNpbmNlIDAuMS4wXG4gICAqIEBtZW1iZXJPZiBfXG4gICAqIEBjYXRlZ29yeSBTdHJpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtzdHJpbmc9JyddIFRoZSBzdHJpbmcgdG8gZXNjYXBlLlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBlc2NhcGVkIHN0cmluZy5cbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogXy5lc2NhcGUoJ2ZyZWQsIGJhcm5leSwgJiBwZWJibGVzJyk7XG4gICAqIC8vID0+ICdmcmVkLCBiYXJuZXksICZhbXA7IHBlYmJsZXMnXG4gICAqL1xuICBmdW5jdGlvbiBlc2NhcGUoc3RyaW5nKSB7XG4gICAgc3RyaW5nID0gdG9TdHJpbmcoc3RyaW5nKTtcbiAgICByZXR1cm4gKHN0cmluZyAmJiByZUhhc1VuZXNjYXBlZEh0bWwudGVzdChzdHJpbmcpKVxuICAgICAgPyBzdHJpbmcucmVwbGFjZShyZVVuZXNjYXBlZEh0bWwsIGVzY2FwZUh0bWxDaGFyKVxuICAgICAgOiBzdHJpbmc7XG4gIH1cblxuICB2YXIgXyA9IHsgJ2VzY2FwZSc6IGVzY2FwZSB9O1xuXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbiAgdmFyIHRlbXBsYXRlcyA9IHtcbiAgICAnZmFjZWJvb2tBdXRob3InOiB7fSxcbiAgICAnZmFjZWJvb2tQcmV2aWV3Jzoge30sXG4gICAgJ2ZpZWxkcyc6IHtcbiAgICAgICAgJ2J1dHRvbic6IHt9LFxuICAgICAgICAndGV4dCc6IHt9LFxuICAgICAgICAndGV4dGFyZWEnOiB7fVxuICAgIH0sXG4gICAgJ2ltYWdlUGxhY2Vob2xkZXInOiB7fSxcbiAgICAndHdpdHRlclByZXZpZXcnOiB7fVxuICB9O1xuXG4gIHRlbXBsYXRlc1snZmFjZWJvb2tBdXRob3InXSA9ICAgZnVuY3Rpb24ob2JqKSB7XG4gICAgb2JqIHx8IChvYmogPSB7fSk7XG4gICAgdmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlO1xuICAgIHdpdGggKG9iaikge1xuICAgIF9fcCArPSAnPHNwYW4gY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3X193ZWJzaXRlLS1mYWNlYm9vay1waXBlXCI+fDwvc3Bhbj4gJyArXG4gICAgX19lKCBhdXRob3JCeSApICtcbiAgICAnXFxuPHNwYW4gY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3X19hdXRob3ItLWZhY2Vib29rXCI+JyArXG4gICAgX19lKCBhdXRob3JOYW1lICkgK1xuICAgICc8L3NwYW4+XFxuJztcblxuICAgIH1cbiAgICByZXR1cm4gX19wXG4gIH07XG5cbiAgdGVtcGxhdGVzWydmYWNlYm9va1ByZXZpZXcnXSA9ICAgZnVuY3Rpb24ob2JqKSB7XG4gICAgb2JqIHx8IChvYmogPSB7fSk7XG4gICAgdmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlO1xuICAgIHdpdGggKG9iaikge1xuICAgIF9fcCArPSAnPGRpdiBjbGFzcz1cImVkaXRhYmxlLXByZXZpZXcgZWRpdGFibGUtcHJldmlldy0tZmFjZWJvb2tcIj5cXG5cdDxoMyBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19oZWFkaW5nIHNuaXBwZXQtZWRpdG9yX19oZWFkaW5nLWljb24tZXllIGVkaXRhYmxlLXByZXZpZXdfX2hlYWRpbmcgXCI+JyArXG4gICAgX19lKCBpMThuLnNuaXBwZXRQcmV2aWV3ICkgK1xuICAgICc8L2gzPlxcblxcblx0PHNlY3Rpb24gY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3X19pbm5lciBlZGl0YWJsZS1wcmV2aWV3X19pbm5lci0tZmFjZWJvb2tcIj5cXG5cdFx0PGRpdiBjbGFzcz1cInNvY2lhbC1wcmV2aWV3X19pbm5lciBzb2NpYWwtcHJldmlld19faW5uZXItLWZhY2Vib29rXCI+XFxuXHRcdFx0PGRpdiBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19jb250YWluZXIgZWRpdGFibGUtcHJldmlld19faW1hZ2UgZWRpdGFibGUtcHJldmlld19faW1hZ2UtLWZhY2Vib29rIHNuaXBwZXRfY29udGFpbmVyXCI+XFxuXFxuXHRcdFx0PC9kaXY+XFxuXHRcdFx0PGRpdiBjbGFzcz1cImVkaXRhYmxlLXByZXZpZXdfX3RleHQta2VlcGVyIGVkaXRhYmxlLXByZXZpZXdfX3RleHQta2VlcGVyLS1mYWNlYm9va1wiPlxcblx0XHRcdFx0PGRpdiBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19jb250YWluZXIgZWRpdGFibGUtcHJldmlld19fY29udGFpbmVyLS1mYWNlYm9vayBlZGl0YWJsZS1wcmV2aWV3X190aXRsZS0tZmFjZWJvb2sgc25pcHBldF9jb250YWluZXJcIj5cXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImVkaXRhYmxlLXByZXZpZXdfX3ZhbHVlIGVkaXRhYmxlLXByZXZpZXdfX3ZhbHVlLS1mYWNlYm9vay10aXRsZVwiPlxcblx0XHRcdFx0XHRcdCcgK1xuICAgIF9fZSggcmVuZGVyZWQudGl0bGUgKSArXG4gICAgJ1xcblx0XHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0PGRpdiBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19jb250YWluZXIgZWRpdGFibGUtcHJldmlld19fY29udGFpbmVyLS1mYWNlYm9vayBlZGl0YWJsZS1wcmV2aWV3X19kZXNjcmlwdGlvbi0tZmFjZWJvb2sgc25pcHBldF9jb250YWluZXJcIj5cXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImVkaXRhYmxlLXByZXZpZXdfX3ZhbHVlIGVkaXRhYmxlLXByZXZpZXdfX3ZhbHVlLS1mYWNlYm9vay1kZXNjcmlwdGlvblwiPlxcblx0XHRcdFx0XHRcdCcgK1xuICAgIF9fZSggcmVuZGVyZWQuZGVzY3JpcHRpb24gKSArXG4gICAgJ1xcblx0XHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0PGRpdiBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19jb250YWluZXIgZWRpdGFibGUtcHJldmlld19fY29udGFpbmVyLS1uby1jYXJldCBlZGl0YWJsZS1wcmV2aWV3X193ZWJzaXRlLS1mYWNlYm9vayBzbmlwcGV0X2NvbnRhaW5lclwiPlxcblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiZWRpdGFibGUtcHJldmlld19fdmFsdWUgZWRpdGFibGUtcHJldmlld19fdmFsdWUtLWZhY2Vib29rLXVybFwiPlxcblx0XHRcdFx0XHRcdCcgK1xuICAgIF9fZSggcmVuZGVyZWQuYmFzZVVybCApICtcbiAgICAnXFxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3X192YWx1ZS0tZmFjZWJvb2stYXV0aG9yXCI+PC9zcGFuPlxcblx0XHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdDwvZGl2Plxcblx0XHRcdDwvZGl2Plxcblx0XHQ8L2Rpdj5cXG5cdDwvc2VjdGlvbj5cXG5cXG5cdDxoMyBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19oZWFkaW5nIHNuaXBwZXQtZWRpdG9yX19oZWFkaW5nLWVkaXRvciBzbmlwcGV0LWVkaXRvcl9faGVhZGluZy1pY29uLWVkaXQgZWRpdGFibGUtcHJldmlld19faGVhZGluZ1wiPicgK1xuICAgIF9fZSggaTE4bi5zbmlwcGV0RWRpdG9yICkgK1xuICAgICc8L2gzPlxcblxcblx0PGRpdiBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19mb3JtXCI+XFxuXFxuXHQ8L2Rpdj5cXG48L2Rpdj5cXG4nO1xuXG4gICAgfVxuICAgIHJldHVybiBfX3BcbiAgfTtcblxuICB0ZW1wbGF0ZXNbJ2ZpZWxkcyddWydidXR0b24nXSA9ICAgZnVuY3Rpb24ob2JqKSB7XG4gICAgb2JqIHx8IChvYmogPSB7fSk7XG4gICAgdmFyIF9fdCwgX19wID0gJycsIF9fZSA9IF8uZXNjYXBlLCBfX2ogPSBBcnJheS5wcm90b3R5cGUuam9pbjtcbiAgICBmdW5jdGlvbiBwcmludCgpIHsgX19wICs9IF9fai5jYWxsKGFyZ3VtZW50cywgJycpIH1cbiAgICB3aXRoIChvYmopIHtcbiAgICBfX3AgKz0gJzxidXR0b25cXG5cdHR5cGU9XCJidXR0b25cIlxcblx0JztcbiAgICAgaWYgKGNsYXNzTmFtZSkge1xuICAgIF9fcCArPSAnY2xhc3M9XCInICtcbiAgICBfX2UoIGNsYXNzTmFtZSApICtcbiAgICAnXCInO1xuICAgICB9XG4gICAgX19wICs9ICdcXG4+XFxuXHQnICtcbiAgICBfX2UoIHZhbHVlICkgK1xuICAgICdcXG48L2J1dHRvbj4nO1xuXG4gICAgfVxuICAgIHJldHVybiBfX3BcbiAgfTtcblxuICB0ZW1wbGF0ZXNbJ2ZpZWxkcyddWyd0ZXh0J10gPSAgIGZ1bmN0aW9uKG9iaikge1xuICAgIG9iaiB8fCAob2JqID0ge30pO1xuICAgIHZhciBfX3QsIF9fcCA9ICcnLCBfX2UgPSBfLmVzY2FwZSwgX19qID0gQXJyYXkucHJvdG90eXBlLmpvaW47XG4gICAgZnVuY3Rpb24gcHJpbnQoKSB7IF9fcCArPSBfX2ouY2FsbChhcmd1bWVudHMsICcnKSB9XG4gICAgd2l0aCAob2JqKSB7XG4gICAgX19wICs9ICc8bGFiZWwnO1xuICAgICBpZiAoIGlkICkge1xuICAgIF9fcCArPSAnIGZvcj1cIicgK1xuICAgIF9fZSggaWQgKSArXG4gICAgJ1wiJztcbiAgICAgfVxuXG4gICAgIGlmICggbGFiZWxDbGFzc05hbWUgKSB7XG4gICAgX19wICs9ICcgY2xhc3M9XCInICtcbiAgICBfX2UoIGxhYmVsQ2xhc3NOYW1lICkgK1xuICAgICdcIic7XG4gICAgIH1cbiAgICBfX3AgKz0gJz4nO1xuXG4gICAgaWYgKCBpZCApIHtcbiAgICBfX3AgKz1cbiAgICBfX2UoIHRpdGxlICkgK1xuICAgICc8L2xhYmVsPic7XG4gICAgIH0gZWxzZSB7XG4gICAgX19wICs9XG4gICAgX19lKCB0aXRsZSApO1xuICAgICB9XG4gICAgX19wICs9ICdcXG5cdDxzcGFuIGNsYXNzPVwic25pcHBldC1lZGl0b3JfX2NhcmV0LWhvb2tcIlxcblx0XHQnO1xuICAgICBpZiAoIGlkICkge1xuICAgIF9fcCArPSAnaWQ9XCInICtcbiAgICBfX2UoIGlkICkgK1xuICAgICdfX2NhcmV0LWhvb2tcIic7XG4gICAgIH1cbiAgICBfX3AgKz0gJ1xcblx0Pjwvc3Bhbj5cXG5cdDxpbnB1dCB0eXBlPVwidGV4dFwiXFxuXHRcdCc7XG4gICAgIGlmICggdmFsdWUgKSB7XG4gICAgX19wICs9ICd2YWx1ZT1cIicgK1xuICAgIF9fZSggdmFsdWUgKSArXG4gICAgJ1wiJztcbiAgICAgfVxuICAgIF9fcCArPSAnXFxuXHRcdCc7XG4gICAgIGlmICggcGxhY2Vob2xkZXIgKSB7XG4gICAgX19wICs9ICdwbGFjZWhvbGRlcj1cIicgK1xuICAgIF9fZSggcGxhY2Vob2xkZXIgKSArXG4gICAgJ1wiJztcbiAgICAgfVxuICAgIF9fcCArPSAnXFxuXHRcdCc7XG4gICAgIGlmICggY2xhc3NOYW1lICkge1xuICAgIF9fcCArPSAnY2xhc3M9XCInICtcbiAgICBfX2UoIGNsYXNzTmFtZSApICtcbiAgICAnXCInO1xuICAgICB9XG4gICAgX19wICs9ICdcXG5cdFx0JztcbiAgICAgaWYgKCBpZCApIHtcbiAgICBfX3AgKz0gJ2lkPVwiJyArXG4gICAgX19lKCBpZCApICtcbiAgICAnXCInO1xuICAgICB9XG4gICAgX19wICs9ICdcXG5cdFx0JztcbiAgICAgaWYgKCBuYW1lICkge1xuICAgIF9fcCArPSAnbmFtZT1cIicgK1xuICAgIF9fZSggbmFtZSApICtcbiAgICAnXCInO1xuICAgICB9XG4gICAgX19wICs9ICdcXG5cdC8+XFxuJztcbiAgICAgaWYgKCAhIGlkICkge1xuICAgIF9fcCArPSAnPC9sYWJlbD4nO1xuICAgICB9XG4gICAgX19wICs9ICdcXG4nO1xuXG4gICAgfVxuICAgIHJldHVybiBfX3BcbiAgfTtcblxuICB0ZW1wbGF0ZXNbJ2ZpZWxkcyddWyd0ZXh0YXJlYSddID0gICBmdW5jdGlvbihvYmopIHtcbiAgICBvYmogfHwgKG9iaiA9IHt9KTtcbiAgICB2YXIgX190LCBfX3AgPSAnJywgX19lID0gXy5lc2NhcGUsIF9faiA9IEFycmF5LnByb3RvdHlwZS5qb2luO1xuICAgIGZ1bmN0aW9uIHByaW50KCkgeyBfX3AgKz0gX19qLmNhbGwoYXJndW1lbnRzLCAnJykgfVxuICAgIHdpdGggKG9iaikge1xuICAgIF9fcCArPSAnPGxhYmVsJztcbiAgICAgaWYgKCBpZCApIHtcbiAgICBfX3AgKz0gJyBmb3I9XCInICtcbiAgICBfX2UoIGlkICkgK1xuICAgICdcIic7XG4gICAgIH1cblxuICAgICBpZiAoIGxhYmVsQ2xhc3NOYW1lICkge1xuICAgIF9fcCArPSAnIGNsYXNzPVwiJyArXG4gICAgX19lKCBsYWJlbENsYXNzTmFtZSApICtcbiAgICAnXCInO1xuICAgICB9XG4gICAgX19wICs9ICc+JztcblxuICAgIGlmICggaWQgKSB7XG4gICAgX19wICs9XG4gICAgX19lKCB0aXRsZSApICtcbiAgICAnPC9sYWJlbD4nO1xuICAgICB9IGVsc2Uge1xuICAgIF9fcCArPVxuICAgIF9fZSggdGl0bGUgKTtcbiAgICAgfVxuICAgIF9fcCArPSAnXFxuXHQ8c3BhbiBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19jYXJldC1ob29rXCJcXG5cdFx0JztcbiAgICAgaWYgKCBpZCApIHtcbiAgICBfX3AgKz0gJ2lkPVwiJyArXG4gICAgX19lKCBpZCApICtcbiAgICAnX19jYXJldC1ob29rXCInO1xuICAgICB9XG4gICAgX19wICs9ICdcXG5cdD48L3NwYW4+XFxuXHQ8dGV4dGFyZWFcXG5cdFx0JztcbiAgICAgaWYgKCBwbGFjZWhvbGRlciApIHtcbiAgICBfX3AgKz0gJ3BsYWNlaG9sZGVyPVwiJyArXG4gICAgX19lKCBwbGFjZWhvbGRlciApICtcbiAgICAnXCInO1xuICAgICB9XG4gICAgX19wICs9ICdcXG5cdFx0JztcbiAgICAgaWYgKCBjbGFzc05hbWUgKSB7XG4gICAgX19wICs9ICdjbGFzcz1cIicgK1xuICAgIF9fZSggY2xhc3NOYW1lICkgK1xuICAgICdcIic7XG4gICAgIH1cbiAgICBfX3AgKz0gJ1xcblx0XHQnO1xuICAgICBpZiAoIGlkICkge1xuICAgIF9fcCArPSAnaWQ9XCInICtcbiAgICBfX2UoIGlkICkgK1xuICAgICdcIic7XG4gICAgIH1cbiAgICBfX3AgKz0gJ1xcblx0XHQnO1xuICAgICBpZiAoIG5hbWUgKSB7XG4gICAgX19wICs9ICduYW1lPVwiJyArXG4gICAgX19lKCBuYW1lICkgK1xuICAgICdcIic7XG4gICAgIH1cbiAgICBfX3AgKz0gJ1xcblx0Plxcblx0XHQnO1xuICAgICBpZiAodmFsdWUpIHtcbiAgICBfX3AgKz1cbiAgICBfX2UoIHZhbHVlICk7XG4gICAgIH1cbiAgICBfX3AgKz0gJ1xcblx0PC90ZXh0YXJlYT5cXG4nO1xuICAgICBpZiAoICEgaWQgKSB7XG4gICAgX19wICs9ICc8L2xhYmVsPic7XG4gICAgIH1cbiAgICBfX3AgKz0gJ1xcbic7XG5cbiAgICB9XG4gICAgcmV0dXJuIF9fcFxuICB9O1xuXG4gIHRlbXBsYXRlc1snaW1hZ2VQbGFjZWhvbGRlciddID0gICBmdW5jdGlvbihvYmopIHtcbiAgICBvYmogfHwgKG9iaiA9IHt9KTtcbiAgICB2YXIgX190LCBfX3AgPSAnJywgX19lID0gXy5lc2NhcGU7XG4gICAgd2l0aCAob2JqKSB7XG4gICAgX19wICs9ICc8ZGl2IGNsYXNzPVxcJycgK1xuICAgIF9fZSggY2xhc3NOYW1lICkgK1xuICAgICdcXCc+JyArXG4gICAgX19lKCBwbGFjZWhvbGRlciApICtcbiAgICAnPC9kaXY+JztcblxuICAgIH1cbiAgICByZXR1cm4gX19wXG4gIH07XG5cbiAgdGVtcGxhdGVzWyd0d2l0dGVyUHJldmlldyddID0gICBmdW5jdGlvbihvYmopIHtcbiAgICBvYmogfHwgKG9iaiA9IHt9KTtcbiAgICB2YXIgX190LCBfX3AgPSAnJywgX19lID0gXy5lc2NhcGU7XG4gICAgd2l0aCAob2JqKSB7XG4gICAgX19wICs9ICc8ZGl2IGNsYXNzPVwiZWRpdGFibGUtcHJldmlldyBlZGl0YWJsZS1wcmV2aWV3LS10d2l0dGVyXCI+XFxuXHQ8aDMgY2xhc3M9XCJzbmlwcGV0LWVkaXRvcl9faGVhZGluZyBzbmlwcGV0LWVkaXRvcl9faGVhZGluZy1pY29uLWV5ZSBlZGl0YWJsZS1wcmV2aWV3X19oZWFkaW5nXCI+JyArXG4gICAgX19lKCBpMThuLnNuaXBwZXRQcmV2aWV3ICkgK1xuICAgICc8L2gzPlxcblxcblx0PHNlY3Rpb24gY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3X19pbm5lciBlZGl0YWJsZS1wcmV2aWV3X19pbm5lci0tdHdpdHRlclwiPlxcblx0XHQ8ZGl2IGNsYXNzPVwic29jaWFsLXByZXZpZXdfX2lubmVyIHNvY2lhbC1wcmV2aWV3X19pbm5lci0tdHdpdHRlclwiPlxcblx0XHRcdDxkaXYgY2xhc3M9XCJzbmlwcGV0LWVkaXRvcl9fY29udGFpbmVyIGVkaXRhYmxlLXByZXZpZXdfX2ltYWdlIGVkaXRhYmxlLXByZXZpZXdfX2ltYWdlLS10d2l0dGVyIHNuaXBwZXRfY29udGFpbmVyXCI+XFxuXFxuXHRcdFx0PC9kaXY+XFxuXHRcdFx0PGRpdiBjbGFzcz1cImVkaXRhYmxlLXByZXZpZXdfX3RleHQta2VlcGVyIGVkaXRhYmxlLXByZXZpZXdfX3RleHQta2VlcGVyLS10d2l0dGVyXCI+XFxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwic25pcHBldC1lZGl0b3JfX2NvbnRhaW5lciBlZGl0YWJsZS1wcmV2aWV3X19jb250YWluZXItLXR3aXR0ZXIgZWRpdGFibGUtcHJldmlld19fdGl0bGUtLXR3aXR0ZXIgc25pcHBldF9jb250YWluZXJcIiA+XFxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3X192YWx1ZSBlZGl0YWJsZS1wcmV2aWV3X192YWx1ZS0tdHdpdHRlci10aXRsZSBcIj5cXG5cdFx0XHRcdFx0XHQnICtcbiAgICBfX2UoIHJlbmRlcmVkLnRpdGxlICkgK1xuICAgICdcXG5cdFx0XHRcdFx0PC9kaXY+XFxuXHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJzbmlwcGV0LWVkaXRvcl9fY29udGFpbmVyIGVkaXRhYmxlLXByZXZpZXdfX2NvbnRhaW5lci0tdHdpdHRlciBlZGl0YWJsZS1wcmV2aWV3X19kZXNjcmlwdGlvbi0tdHdpdHRlciB0d2l0dGVyLXByZXZpZXdfX2Rlc2NyaXB0aW9uIHNuaXBwZXRfY29udGFpbmVyXCI+XFxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3X192YWx1ZSBlZGl0YWJsZS1wcmV2aWV3X192YWx1ZS0tdHdpdHRlci1kZXNjcmlwdGlvblwiPlxcblx0XHRcdFx0XHRcdCcgK1xuICAgIF9fZSggcmVuZGVyZWQuZGVzY3JpcHRpb24gKSArXG4gICAgJ1xcblx0XHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdDwvZGl2Plxcblx0XHRcdFx0PGRpdiBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19jb250YWluZXIgZWRpdGFibGUtcHJldmlld19fY29udGFpbmVyLS1uby1jYXJldCBlZGl0YWJsZS1wcmV2aWV3X193ZWJzaXRlLS10d2l0dGVyIHNuaXBwZXRfY29udGFpbmVyXCI+XFxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJlZGl0YWJsZS1wcmV2aWV3X192YWx1ZSBcIj5cXG5cdFx0XHRcdFx0XHQnICtcbiAgICBfX2UoIHJlbmRlcmVkLmJhc2VVcmwgKSArXG4gICAgJ1xcblx0XHRcdFx0XHQ8L2Rpdj5cXG5cdFx0XHRcdDwvZGl2Plxcblx0XHRcdDwvZGl2Plxcblx0XHQ8L2Rpdj5cXG5cdDwvc2VjdGlvbj5cXG5cXG5cdDxoMyBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19oZWFkaW5nIHNuaXBwZXQtZWRpdG9yX19oZWFkaW5nLWVkaXRvciBzbmlwcGV0LWVkaXRvcl9faGVhZGluZy1pY29uLWVkaXQgZWRpdGFibGUtcHJldmlld19faGVhZGluZ1wiPicgK1xuICAgIF9fZSggaTE4bi5zbmlwcGV0RWRpdG9yICkgK1xuICAgICc8L2gzPlxcblxcblx0PGRpdiBjbGFzcz1cInNuaXBwZXQtZWRpdG9yX19mb3JtXCI+XFxuXFxuXHQ8L2Rpdj5cXG48L2Rpdj5cXG4nO1xuXG4gICAgfVxuICAgIHJldHVybiBfX3BcbiAgfTtcblxuICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4gIGlmIChmcmVlTW9kdWxlKSB7XG4gICAgKGZyZWVNb2R1bGUuZXhwb3J0cyA9IHRlbXBsYXRlcykudGVtcGxhdGVzID0gdGVtcGxhdGVzO1xuICAgIGZyZWVFeHBvcnRzLnRlbXBsYXRlcyA9IHRlbXBsYXRlcztcbiAgfVxuICBlbHNlIHtcbiAgICByb290LnRlbXBsYXRlcyA9IHRlbXBsYXRlcztcbiAgfVxufS5jYWxsKHRoaXMpKTtcbiIsIi8qIGpzaGludCBicm93c2VyOiB0cnVlICovXG5cbnZhciBpc0VsZW1lbnQgPSByZXF1aXJlKCBcImxvZGFzaC9sYW5nL2lzRWxlbWVudFwiICk7XG52YXIgY2xvbmUgPSByZXF1aXJlKCBcImxvZGFzaC9sYW5nL2Nsb25lXCIgKTtcbnZhciBkZWZhdWx0c0RlZXAgPSByZXF1aXJlKCBcImxvZGFzaC9vYmplY3QvZGVmYXVsdHNEZWVwXCIgKTtcblxudmFyIEplZCA9IHJlcXVpcmUoIFwiamVkXCIgKTtcblxudmFyIHJlbmRlckRlc2NyaXB0aW9uID0gcmVxdWlyZSggXCIuL2hlbHBlcnMvcmVuZGVyRGVzY3JpcHRpb25cIiApO1xudmFyIGltYWdlUGxhY2Vob2xkZXIgID0gcmVxdWlyZSggXCIuL2VsZW1lbnQvaW1hZ2VQbGFjZWhvbGRlclwiICk7XG52YXIgYmVtQWRkTW9kaWZpZXIgPSByZXF1aXJlKCBcIi4vaGVscGVycy9iZW0vYWRkTW9kaWZpZXJcIiApO1xudmFyIGJlbVJlbW92ZU1vZGlmaWVyID0gcmVxdWlyZSggXCIuL2hlbHBlcnMvYmVtL3JlbW92ZU1vZGlmaWVyXCIgKTtcblxudmFyIFRleHRGaWVsZCA9IHJlcXVpcmUoIFwiLi9pbnB1dHMvdGV4dElucHV0XCIgKTtcbnZhciBUZXh0QXJlYSA9IHJlcXVpcmUoIFwiLi9pbnB1dHMvdGV4dGFyZWFcIiApO1xuXG52YXIgSW5wdXRFbGVtZW50ID0gcmVxdWlyZSggXCIuL2VsZW1lbnQvaW5wdXRcIiApO1xudmFyIFByZXZpZXdFdmVudHMgPSByZXF1aXJlKCBcIi4vcHJldmlldy9ldmVudHNcIiApO1xuXG52YXIgdHdpdHRlckVkaXRvclRlbXBsYXRlID0gcmVxdWlyZSggXCIuL3RlbXBsYXRlc1wiICkudHdpdHRlclByZXZpZXc7XG5cbnZhciB0d2l0dGVyRGVmYXVsdHMgPSB7XG5cdGRhdGE6IHtcblx0XHR0aXRsZTogXCJcIixcblx0XHRkZXNjcmlwdGlvbjogXCJcIixcblx0XHRpbWFnZVVybDogXCJcIlxuXHR9LFxuXHRkZWZhdWx0VmFsdWU6IHtcblx0XHR0aXRsZTogXCJcIixcblx0XHRkZXNjcmlwdGlvbjogXCJcIixcblx0XHRpbWFnZVVybDogXCJcIlxuXHR9LFxuXHRiYXNlVVJMOiBcImV4YW1wbGUuY29tXCIsXG5cdGNhbGxiYWNrczoge1xuXHRcdHVwZGF0ZVNvY2lhbFByZXZpZXc6IGZ1bmN0aW9uKCkge30sXG5cdFx0bW9kaWZ5VGl0bGU6IGZ1bmN0aW9uKCB0aXRsZSApIHtcblx0XHRcdHJldHVybiB0aXRsZTtcblx0XHR9LFxuXHRcdG1vZGlmeURlc2NyaXB0aW9uOiBmdW5jdGlvbiggZGVzY3JpcHRpb24gKSB7XG5cdFx0XHRyZXR1cm4gZGVzY3JpcHRpb247XG5cdFx0fSxcblx0XHRtb2RpZnlJbWFnZVVybDogZnVuY3Rpb24oIGltYWdlVXJsICkge1xuXHRcdFx0cmV0dXJuIGltYWdlVXJsO1xuXHRcdH1cblx0fVxufTtcblxudmFyIGlucHV0VHdpdHRlclByZXZpZXdCaW5kaW5ncyA9IFtcblx0e1xuXHRcdFwicHJldmlld1wiOiBcImVkaXRhYmxlLXByZXZpZXdfX3RpdGxlLS10d2l0dGVyXCIsXG5cdFx0XCJpbnB1dEZpZWxkXCI6IFwidGl0bGVcIlxuXHR9LFxuXHR7XG5cdFx0XCJwcmV2aWV3XCI6IFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLXR3aXR0ZXJcIixcblx0XHRcImlucHV0RmllbGRcIjogXCJpbWFnZVVybFwiXG5cdH0sXG5cdHtcblx0XHRcInByZXZpZXdcIjogXCJlZGl0YWJsZS1wcmV2aWV3X19kZXNjcmlwdGlvbi0tdHdpdHRlclwiLFxuXHRcdFwiaW5wdXRGaWVsZFwiOiBcImRlc2NyaXB0aW9uXCJcblx0fVxuXTtcblxudmFyIFdJRFRIX1RXSVRURVJfSU1BR0VfU01BTEwgPSAxMjA7XG52YXIgV0lEVEhfVFdJVFRFUl9JTUFHRV9MQVJHRSA9IDUwNjtcbnZhciBUV0lUVEVSX0lNQUdFX1RIUkVTSE9MRF9XSURUSCA9IDI4MDtcbnZhciBUV0lUVEVSX0lNQUdFX1RIUkVTSE9MRF9IRUlHSFQgPSAxNTA7XG5cbi8qKlxuICogQG1vZHVsZSBzbmlwcGV0UHJldmlld1xuICovXG5cbi8qKlxuICogRGVmaW5lcyB0aGUgY29uZmlnIGFuZCBvdXRwdXRUYXJnZXQgZm9yIHRoZSBTbmlwcGV0UHJldmlld1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgIG9wdHMgICAgICAgICAgICAgICAgICAgICAgICAgICAtIFNuaXBwZXQgcHJldmlldyBvcHRpb25zLlxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgb3B0cy5wbGFjZWhvbGRlciAgICAgICAgICAgICAgIC0gVGhlIHBsYWNlaG9sZGVyIHZhbHVlcyBmb3IgdGhlIGZpZWxkcywgd2lsbCBiZSBzaG93biBhc1xuICogYWN0dWFsIHBsYWNlaG9sZGVycyBpbiB0aGUgaW5wdXRzIGFuZCBhcyBhIGZhbGxiYWNrIGZvciB0aGUgcHJldmlldy5cbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgIG9wdHMucGxhY2Vob2xkZXIudGl0bGUgICAgICAgICAtIFBsYWNlaG9sZGVyIGZvciB0aGUgdGl0bGUgZmllbGQuXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICBvcHRzLnBsYWNlaG9sZGVyLmRlc2NyaXB0aW9uICAgLSBQbGFjZWhvbGRlciBmb3IgdGhlIGRlc2NyaXB0aW9uIGZpZWxkLlxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgb3B0cy5wbGFjZWhvbGRlci5pbWFnZVVybCAgICAgIC0gUGxhY2Vob2xkZXIgZm9yIHRoZSBpbWFnZSB1cmwgZmllbGQuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9ICAgICAgICAgb3B0cy5kZWZhdWx0VmFsdWUgICAgICAgICAgICAgIC0gVGhlIGRlZmF1bHQgdmFsdWUgZm9yIHRoZSBmaWVsZHMsIGlmIHRoZSB1c2VyIGhhcyBub3RcbiAqIGNoYW5nZWQgYSBmaWVsZCwgdGhpcyB2YWx1ZSB3aWxsIGJlIHVzZWQgZm9yIHRoZSBhbmFseXplciwgcHJldmlldyBhbmQgdGhlIHByb2dyZXNzIGJhcnMuXG4gKiBAcGFyYW0ge3N0cmluZ30gICAgICAgICBvcHRzLmRlZmF1bHRWYWx1ZS50aXRsZSAgICAgICAgLSBEZWZhdWx0IHRpdGxlLlxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgb3B0cy5kZWZhdWx0VmFsdWUuZGVzY3JpcHRpb24gIC0gRGVmYXVsdCBkZXNjcmlwdGlvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgIG9wdHMuZGVmYXVsdFZhbHVlLmltYWdlVXJsICAgICAtIERlZmF1bHQgaW1hZ2UgdXJsLlxuICogaXQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9ICAgICAgICAgb3B0cy5iYXNlVVJMICAgICAgICAgICAgICAgICAgIC0gVGhlIGJhc2ljIFVSTCBhcyBpdCB3aWxsIGJlIGRpc3BsYXllZCBpbiB0d2l0dGVyLlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gICAgb3B0cy50YXJnZXRFbGVtZW50ICAgICAgICAgICAgIC0gVGhlIHRhcmdldCBlbGVtZW50IHRoYXQgY29udGFpbnMgdGhpcyBzbmlwcGV0IGVkaXRvci5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgICBvcHRzLmNhbGxiYWNrcyAgICAgICAgICAgICAgICAgLSBGdW5jdGlvbnMgdGhhdCBhcmUgY2FsbGVkIG9uIHNwZWNpZmljIGluc3RhbmNlcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259ICAgICAgIG9wdHMuY2FsbGJhY2tzLnVwZGF0ZVNvY2lhbFByZXZpZXcgLSBGdW5jdGlvbiBjYWxsZWQgd2hlbiB0aGUgc29jaWFsIHByZXZpZXcgaXMgdXBkYXRlZC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gICAgICAgICBpMThuICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBUaGUgaTE4biBvYmplY3QuXG4gKlxuICogQHByb3BlcnR5IHtPYmplY3R9ICAgICAgaTE4biAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gVGhlIHRyYW5zbGF0aW9uIG9iamVjdC5cbiAqXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSB0YXJnZXRFbGVtZW50ICAgICAgICAgICAgICAgICAgLSBUaGUgdGFyZ2V0IGVsZW1lbnQgdGhhdCBjb250YWlucyB0aGlzIHNuaXBwZXQgZWRpdG9yLlxuICpcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSAgICAgIGVsZW1lbnQgICAgICAgICAgICAgICAgICAgICAgICAtIFRoZSBlbGVtZW50cyBmb3IgdGhpcyBzbmlwcGV0IGVkaXRvci5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSAgICAgIGVsZW1lbnQucmVuZGVyZWQgICAgICAgICAgICAgICAtIFRoZSByZW5kZXJlZCBlbGVtZW50cy5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQucmVuZGVyZWQudGl0bGUgICAgICAgICAtIFRoZSByZW5kZXJlZCB0aXRsZSBlbGVtZW50LlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5yZW5kZXJlZC5pbWFnZVVybCAgICAgIC0gVGhlIHJlbmRlcmVkIHVybCBwYXRoIGVsZW1lbnQuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LnJlbmRlcmVkLmRlc2NyaXB0aW9uICAgLSBUaGUgcmVuZGVyZWQgdHdpdHRlciBkZXNjcmlwdGlvbiBlbGVtZW50LlxuICpcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSAgICAgIGVsZW1lbnQuaW5wdXQgICAgICAgICAgICAgICAgICAtIFRoZSBpbnB1dCBlbGVtZW50cy5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQuaW5wdXQudGl0bGUgICAgICAgICAgICAtIFRoZSB0aXRsZSBpbnB1dCBlbGVtZW50LlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5pbnB1dC5pbWFnZVVybCAgICAgICAgIC0gVGhlIHVybCBwYXRoIGlucHV0IGVsZW1lbnQuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LmlucHV0LmRlc2NyaXB0aW9uICAgICAgLSBUaGUgbWV0YSBkZXNjcmlwdGlvbiBpbnB1dCBlbGVtZW50LlxuICpcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQuY29udGFpbmVyICAgICAgICAgICAgICAtIFRoZSBtYWluIGNvbnRhaW5lciBlbGVtZW50LlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudC5mb3JtQ29udGFpbmVyICAgICAgICAgIC0gVGhlIGZvcm0gY29udGFpbmVyIGVsZW1lbnQuXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50LmVkaXRUb2dnbGUgICAgICAgICAgICAgLSBUaGUgYnV0dG9uIHRoYXQgdG9nZ2xlcyB0aGUgZWRpdG9yIGZvcm0uXG4gKlxuICogQHByb3BlcnR5IHtPYmplY3R9ICAgICAgZGF0YSAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gVGhlIGRhdGEgZm9yIHRoaXMgc25pcHBldCBlZGl0b3IuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICBkYXRhLnRpdGxlICAgICAgICAgICAgICAgICAgICAgLSBUaGUgdGl0bGUuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICBkYXRhLmltYWdlVXJsICAgICAgICAgICAgICAgICAgLSBUaGUgdXJsIHBhdGguXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICBkYXRhLmRlc2NyaXB0aW9uICAgICAgICAgICAgICAgLSBUaGUgbWV0YSBkZXNjcmlwdGlvbi5cbiAqXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICBiYXNlVVJMICAgICAgICAgICAgICAgICAgICAgICAgLSBUaGUgYmFzaWMgVVJMIGFzIGl0IHdpbGwgYmUgZGlzcGxheWVkIGluIGdvb2dsZS5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIFR3aXR0ZXJQcmV2aWV3ID0gZnVuY3Rpb24oIG9wdHMsIGkxOG4gKSB7XG5cdHRoaXMuaTE4biA9IGkxOG4gfHwgdGhpcy5jb25zdHJ1Y3RJMThuKCk7XG5cblx0dHdpdHRlckRlZmF1bHRzLnBsYWNlaG9sZGVyID0ge1xuXHRcdHRpdGxlOiB0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiVGhpcyBpcyBhbiBleGFtcGxlIHRpdGxlIC0gZWRpdCBieSBjbGlja2luZyBoZXJlXCIgKSxcblx0XHRkZXNjcmlwdGlvbjogdGhpcy5pMThuLnNwcmludGYoXG5cdFx0XHQvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBUd2l0dGVyICovXG5cdFx0XHR0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiTW9kaWZ5IHlvdXIgJTEkcyBkZXNjcmlwdGlvbiBieSBlZGl0aW5nIGl0IHJpZ2h0IGhlcmVcIiApLFxuXHRcdFx0XCJUd2l0dGVyXCJcblx0XHQpLFxuXHRcdGltYWdlVXJsOiBcIlwiXG5cdH07XG5cblx0ZGVmYXVsdHNEZWVwKCBvcHRzLCB0d2l0dGVyRGVmYXVsdHMgKTtcblxuXHRpZiAoICFpc0VsZW1lbnQoIG9wdHMudGFyZ2V0RWxlbWVudCApICkge1xuXHRcdHRocm93IG5ldyBFcnJvciggXCJUaGUgVHdpdHRlciBwcmV2aWV3IHJlcXVpcmVzIGEgdmFsaWQgdGFyZ2V0IGVsZW1lbnRcIiApO1xuXHR9XG5cblx0dGhpcy5kYXRhID0gb3B0cy5kYXRhO1xuXHR0aGlzLmkxOG4gPSBpMThuIHx8IHRoaXMuY29uc3RydWN0STE4bigpO1xuXHR0aGlzLm9wdHMgPSBvcHRzO1xuXG5cdHRoaXMuX2N1cnJlbnRGb2N1cyA9IG51bGw7XG5cdHRoaXMuX2N1cnJlbnRIb3ZlciA9IG51bGw7XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemVzIGkxOG4gb2JqZWN0IGJhc2VkIG9uIHBhc3NlZCBjb25maWd1cmF0aW9uXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHRyYW5zbGF0aW9ucyAtIFRoZSB2YWx1ZXMgdG8gdHJhbnNsYXRlLlxuICpcbiAqIEByZXR1cm5zIHtKZWR9IC0gVGhlIEplZCB0cmFuc2xhdGlvbiBvYmplY3QuXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5jb25zdHJ1Y3RJMThuID0gZnVuY3Rpb24oIHRyYW5zbGF0aW9ucyApIHtcblx0dmFyIGRlZmF1bHRUcmFuc2xhdGlvbnMgPSB7XG5cdFx0XCJkb21haW5cIjogXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIixcblx0XHRcImxvY2FsZV9kYXRhXCI6IHtcblx0XHRcdFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCI6IHtcblx0XHRcdFx0XCJcIjoge31cblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0dHJhbnNsYXRpb25zID0gdHJhbnNsYXRpb25zIHx8IHt9O1xuXG5cdGRlZmF1bHRzRGVlcCggdHJhbnNsYXRpb25zLCBkZWZhdWx0VHJhbnNsYXRpb25zICk7XG5cblx0cmV0dXJuIG5ldyBKZWQoIHRyYW5zbGF0aW9ucyApO1xufTtcblxuLyoqXG4gKiBSZW5kZXJzIHRoZSB0ZW1wbGF0ZSBhbmQgYmluZCB0aGUgZXZlbnRzLlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnJlbmRlclRlbXBsYXRlKCk7XG5cdHRoaXMuYmluZEV2ZW50cygpO1xuXHR0aGlzLnVwZGF0ZVByZXZpZXcoKTtcbn07XG5cbi8qKlxuICogUmVuZGVycyBzbmlwcGV0IGVkaXRvciBhbmQgYWRkcyBpdCB0byB0aGUgdGFyZ2V0RWxlbWVudC5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLnJlbmRlclRlbXBsYXRlID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0YXJnZXRFbGVtZW50ID0gdGhpcy5vcHRzLnRhcmdldEVsZW1lbnQ7XG5cblx0dGFyZ2V0RWxlbWVudC5pbm5lckhUTUwgPSB0d2l0dGVyRWRpdG9yVGVtcGxhdGUoIHtcblx0XHRyZW5kZXJlZDoge1xuXHRcdFx0dGl0bGU6IFwiXCIsXG5cdFx0XHRkZXNjcmlwdGlvbjogXCJcIixcblx0XHRcdGltYWdlVXJsOiBcIlwiLFxuXHRcdFx0YmFzZVVybDogdGhpcy5vcHRzLmJhc2VVUkxcblx0XHR9LFxuXHRcdHBsYWNlaG9sZGVyOiB0aGlzLm9wdHMucGxhY2Vob2xkZXIsXG5cdFx0aTE4bjoge1xuXHRcdFx0LyoqIHRyYW5zbGF0b3JzOiAlMSRzIGV4cGFuZHMgdG8gVHdpdHRlciAqL1xuXHRcdFx0ZWRpdDogdGhpcy5pMThuLnNwcmludGYoIHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCJFZGl0ICUxJHMgcHJldmlld1wiICksIFwiVHdpdHRlclwiICksXG5cdFx0XHQvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBUd2l0dGVyICovXG5cdFx0XHRzbmlwcGV0UHJldmlldzogdGhpcy5pMThuLnNwcmludGYoIHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCIlMSRzIHByZXZpZXdcIiApLCBcIlR3aXR0ZXJcIiApLFxuXHRcdFx0LyoqIHRyYW5zbGF0b3JzOiAlMSRzIGV4cGFuZHMgdG8gVHdpdHRlciAqL1xuXHRcdFx0c25pcHBldEVkaXRvcjogdGhpcy5pMThuLnNwcmludGYoIHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCIlMSRzIGVkaXRvclwiICksIFwiVHdpdHRlclwiIClcblx0XHR9XG5cdH0gKTtcblxuXHR0aGlzLmVsZW1lbnQgPSB7XG5cdFx0cmVuZGVyZWQ6IHtcblx0XHRcdHRpdGxlOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwiZWRpdGFibGUtcHJldmlld19fdmFsdWUtLXR3aXR0ZXItdGl0bGVcIiApWzBdLFxuXHRcdFx0ZGVzY3JpcHRpb246IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJlZGl0YWJsZS1wcmV2aWV3X192YWx1ZS0tdHdpdHRlci1kZXNjcmlwdGlvblwiIClbMF1cblx0XHR9LFxuXHRcdGZpZWxkczogdGhpcy5nZXRGaWVsZHMoKSxcblx0XHRjb250YWluZXI6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJlZGl0YWJsZS1wcmV2aWV3LS10d2l0dGVyXCIgKVswXSxcblx0XHRmb3JtQ29udGFpbmVyOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwic25pcHBldC1lZGl0b3JfX2Zvcm1cIiApWzBdLFxuXHRcdGVkaXRUb2dnbGU6IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJzbmlwcGV0LWVkaXRvcl9fZWRpdC1idXR0b25cIiApWzBdLFxuXHRcdGNsb3NlRWRpdG9yOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwic25pcHBldC1lZGl0b3JfX3N1Ym1pdFwiIClbMF0sXG5cdFx0Zm9ybUZpZWxkczogdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcInNuaXBwZXQtZWRpdG9yX19mb3JtLWZpZWxkXCIgKSxcblx0XHRoZWFkaW5nRWRpdG9yOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwic25pcHBldC1lZGl0b3JfX2hlYWRpbmctZWRpdG9yXCIgKVswXVxuXHR9O1xuXG5cdHRoaXMuZWxlbWVudC5mb3JtQ29udGFpbmVyLmlubmVySFRNTCA9IHRoaXMuZWxlbWVudC5maWVsZHMuaW1hZ2VVcmwucmVuZGVyKClcblx0XHQrIHRoaXMuZWxlbWVudC5maWVsZHMudGl0bGUucmVuZGVyKClcblx0XHQrIHRoaXMuZWxlbWVudC5maWVsZHMuZGVzY3JpcHRpb24ucmVuZGVyKCk7XG5cblx0dGhpcy5lbGVtZW50LmlucHV0ID0ge1xuXHRcdHRpdGxlOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwianMtc25pcHBldC1lZGl0b3ItdGl0bGVcIiApWzBdLFxuXHRcdGltYWdlVXJsOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwianMtc25pcHBldC1lZGl0b3ItaW1hZ2VVcmxcIiApWzBdLFxuXHRcdGRlc2NyaXB0aW9uOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwianMtc25pcHBldC1lZGl0b3ItZGVzY3JpcHRpb25cIiApWzBdXG5cdH07XG5cblx0dGhpcy5lbGVtZW50LmZpZWxkRWxlbWVudHMgPSB0aGlzLmdldEZpZWxkRWxlbWVudHMoKTtcblx0dGhpcy5lbGVtZW50LmNsb3NlRWRpdG9yID0gdGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcInNuaXBwZXQtZWRpdG9yX19zdWJtaXRcIiApWzBdO1xuXG5cdHRoaXMuZWxlbWVudC5jYXJldEhvb2tzID0ge1xuXHRcdHRpdGxlOiB0aGlzLmVsZW1lbnQuaW5wdXQudGl0bGUucHJldmlvdXNTaWJsaW5nLFxuXHRcdGltYWdlVXJsOiB0aGlzLmVsZW1lbnQuaW5wdXQuaW1hZ2VVcmwucHJldmlvdXNTaWJsaW5nLFxuXHRcdGRlc2NyaXB0aW9uOiB0aGlzLmVsZW1lbnQuaW5wdXQuZGVzY3JpcHRpb24ucHJldmlvdXNTaWJsaW5nXG5cdH07XG5cblx0dGhpcy5lbGVtZW50LnByZXZpZXcgPSB7XG5cdFx0dGl0bGU6IHRoaXMuZWxlbWVudC5yZW5kZXJlZC50aXRsZS5wYXJlbnROb2RlLFxuXHRcdGltYWdlVXJsOiB0YXJnZXRFbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoIFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLXR3aXR0ZXJcIiApWzBdLFxuXHRcdGRlc2NyaXB0aW9uOiB0aGlzLmVsZW1lbnQucmVuZGVyZWQuZGVzY3JpcHRpb24ucGFyZW50Tm9kZVxuXHR9O1xuXG59O1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGZvcm0gZmllbGRzLlxuICpcbiAqIEByZXR1cm5zIHt7dGl0bGU6ICosIGRlc2NyaXB0aW9uOiAqLCBpbWFnZVVybDogKiwgYnV0dG9uOiBCdXR0b259fSBPYmplY3Qgd2l0aCB0aGUgZmllbGRzLlxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUuZ2V0RmllbGRzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7XG5cdFx0dGl0bGU6IG5ldyBUZXh0RmllbGQoIHtcblx0XHRcdGNsYXNzTmFtZTogXCJzbmlwcGV0LWVkaXRvcl9faW5wdXQgc25pcHBldC1lZGl0b3JfX3RpdGxlIGpzLXNuaXBwZXQtZWRpdG9yLXRpdGxlXCIsXG5cdFx0XHRpZDogXCJ0d2l0dGVyLWVkaXRvci10aXRsZVwiLFxuXHRcdFx0dmFsdWU6IHRoaXMuZGF0YS50aXRsZSxcblx0XHRcdHBsYWNlaG9sZGVyOiB0aGlzLm9wdHMucGxhY2Vob2xkZXIudGl0bGUsXG5cdFx0XHR0aXRsZTogdGhpcy5pMThuLnNwcmludGYoXG5cdFx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIFR3aXR0ZXIgKi9cblx0XHRcdFx0dGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIiUxJHMgdGl0bGVcIiApLFxuXHRcdFx0XHRcIlR3aXR0ZXJcIlxuXHRcdFx0KSxcblx0XHRcdGxhYmVsQ2xhc3NOYW1lOiBcInNuaXBwZXQtZWRpdG9yX19sYWJlbFwiXG5cdFx0fSApLFxuXHRcdGRlc2NyaXB0aW9uOiBuZXcgVGV4dEFyZWEoIHtcblx0XHRcdGNsYXNzTmFtZTogXCJzbmlwcGV0LWVkaXRvcl9faW5wdXQgc25pcHBldC1lZGl0b3JfX2Rlc2NyaXB0aW9uIGpzLXNuaXBwZXQtZWRpdG9yLWRlc2NyaXB0aW9uXCIsXG5cdFx0XHRpZDogXCJ0d2l0dGVyLWVkaXRvci1kZXNjcmlwdGlvblwiLFxuXHRcdFx0dmFsdWU6IHRoaXMuZGF0YS5kZXNjcmlwdGlvbixcblx0XHRcdHBsYWNlaG9sZGVyOiB0aGlzLm9wdHMucGxhY2Vob2xkZXIuZGVzY3JpcHRpb24sXG5cdFx0XHR0aXRsZTogdGhpcy5pMThuLnNwcmludGYoXG5cdFx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIFR3aXR0ZXIgKi9cblx0XHRcdFx0dGhpcy5pMThuLmRnZXR0ZXh0KCBcInlvYXN0LXNvY2lhbC1wcmV2aWV3c1wiLCBcIiUxJHMgZGVzY3JpcHRpb25cIiApLFxuXHRcdFx0XHRcIlR3aXR0ZXJcIlxuXHRcdFx0KSxcblx0XHRcdGxhYmVsQ2xhc3NOYW1lOiBcInNuaXBwZXQtZWRpdG9yX19sYWJlbFwiXG5cdFx0fSApLFxuXHRcdGltYWdlVXJsOiBuZXcgVGV4dEZpZWxkKCB7XG5cdFx0XHRjbGFzc05hbWU6IFwic25pcHBldC1lZGl0b3JfX2lucHV0IHNuaXBwZXQtZWRpdG9yX19pbWFnZVVybCBqcy1zbmlwcGV0LWVkaXRvci1pbWFnZVVybFwiLFxuXHRcdFx0aWQ6IFwidHdpdHRlci1lZGl0b3ItaW1hZ2VVcmxcIixcblx0XHRcdHZhbHVlOiB0aGlzLmRhdGEuaW1hZ2VVcmwsXG5cdFx0XHRwbGFjZWhvbGRlcjogdGhpcy5vcHRzLnBsYWNlaG9sZGVyLmltYWdlVXJsLFxuXHRcdFx0dGl0bGU6IHRoaXMuaTE4bi5zcHJpbnRmKFxuXHRcdFx0XHQvKiogdHJhbnNsYXRvcnM6ICUxJHMgZXhwYW5kcyB0byBUd2l0dGVyICovXG5cdFx0XHRcdHRoaXMuaTE4bi5kZ2V0dGV4dCggXCJ5b2FzdC1zb2NpYWwtcHJldmlld3NcIiwgXCIlMSRzIGltYWdlXCIgKSxcblx0XHRcdFx0XCJUd2l0dGVyXCJcblx0XHRcdCksXG5cdFx0XHRsYWJlbENsYXNzTmFtZTogXCJzbmlwcGV0LWVkaXRvcl9fbGFiZWxcIlxuXHRcdH0gKVxuXHR9O1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGFsbCBmaWVsZCBlbGVtZW50cy5cbiAqXG4gKiBAcmV0dXJucyB7e3RpdGxlOiBJbnB1dEVsZW1lbnQsIGRlc2NyaXB0aW9uOiBJbnB1dEVsZW1lbnQsIGltYWdlVXJsOiBJbnB1dEVsZW1lbnR9fSBUaGUgZmllbGQgZWxlbWVudC5cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLmdldEZpZWxkRWxlbWVudHMgPSBmdW5jdGlvbigpIHtcblx0dmFyIHRhcmdldEVsZW1lbnQgPSB0aGlzLm9wdHMudGFyZ2V0RWxlbWVudDtcblxuXHRyZXR1cm4ge1xuXHRcdHRpdGxlOiBuZXcgSW5wdXRFbGVtZW50KFxuXHRcdFx0dGFyZ2V0RWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCBcImpzLXNuaXBwZXQtZWRpdG9yLXRpdGxlXCIgKVswXSxcblx0XHRcdHtcblx0XHRcdFx0Y3VycmVudFZhbHVlOiB0aGlzLmRhdGEudGl0bGUsXG5cdFx0XHRcdGRlZmF1bHRWYWx1ZTogdGhpcy5vcHRzLmRlZmF1bHRWYWx1ZS50aXRsZSxcblx0XHRcdFx0cGxhY2Vob2xkZXI6IHRoaXMub3B0cy5wbGFjZWhvbGRlci50aXRsZSxcblx0XHRcdFx0ZmFsbGJhY2s6IHRoaXMuaTE4bi5zcHJpbnRmKFxuXHRcdFx0XHRcdC8qKiB0cmFuc2xhdG9yczogJTEkcyBleHBhbmRzIHRvIFR3aXR0ZXIgKi9cblx0XHRcdFx0XHR0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiUGxlYXNlIHByb3ZpZGUgYSAlMSRzIHRpdGxlIGJ5IGVkaXRpbmcgdGhlIHNuaXBwZXQgYmVsb3cuXCIgKSxcblx0XHRcdFx0XHRcIlR3aXR0ZXJcIlxuXHRcdFx0XHQpXG5cdFx0XHR9LFxuXHRcdFx0dGhpcy51cGRhdGVQcmV2aWV3LmJpbmQoIHRoaXMgKVxuXHRcdCksXG5cdFx0IGRlc2NyaXB0aW9uOiBuZXcgSW5wdXRFbGVtZW50KFxuXHRcdFx0IHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJqcy1zbmlwcGV0LWVkaXRvci1kZXNjcmlwdGlvblwiIClbMF0sXG5cdFx0XHQge1xuXHRcdFx0XHQgY3VycmVudFZhbHVlOiB0aGlzLmRhdGEuZGVzY3JpcHRpb24sXG5cdFx0XHRcdCBkZWZhdWx0VmFsdWU6IHRoaXMub3B0cy5kZWZhdWx0VmFsdWUuZGVzY3JpcHRpb24sXG5cdFx0XHRcdCBwbGFjZWhvbGRlcjogdGhpcy5vcHRzLnBsYWNlaG9sZGVyLmRlc2NyaXB0aW9uLFxuXHRcdFx0XHQgZmFsbGJhY2s6IHRoaXMuaTE4bi5zcHJpbnRmKFxuXHRcdFx0XHQgICAgLyoqIHRyYW5zbGF0b3JzOiAlMSRzIGV4cGFuZHMgdG8gVHdpdHRlciAqL1xuXHRcdFx0XHRcdCB0aGlzLmkxOG4uZGdldHRleHQoIFwieW9hc3Qtc29jaWFsLXByZXZpZXdzXCIsIFwiUGxlYXNlIHByb3ZpZGUgYSAlMSRzIGRlc2NyaXB0aW9uIGJ5IGVkaXRpbmcgdGhlIHNuaXBwZXQgYmVsb3cuXCIgKSxcblx0XHRcdFx0XHQgXCJUd2l0dGVyXCJcblx0XHRcdFx0IClcblx0XHRcdCB9LFxuXHRcdFx0IHRoaXMudXBkYXRlUHJldmlldy5iaW5kKCB0aGlzIClcblx0XHQgKSxcblx0XHRpbWFnZVVybDogbmV3IElucHV0RWxlbWVudChcblx0XHRcdHRhcmdldEVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSggXCJqcy1zbmlwcGV0LWVkaXRvci1pbWFnZVVybFwiIClbMF0sXG5cdFx0XHR7XG5cdFx0XHRcdGN1cnJlbnRWYWx1ZTogdGhpcy5kYXRhLmltYWdlVXJsLFxuXHRcdFx0XHRkZWZhdWx0VmFsdWU6IHRoaXMub3B0cy5kZWZhdWx0VmFsdWUuaW1hZ2VVcmwsXG5cdFx0XHRcdHBsYWNlaG9sZGVyOiB0aGlzLm9wdHMucGxhY2Vob2xkZXIuaW1hZ2VVcmwsXG5cdFx0XHRcdGZhbGxiYWNrOiBcIlwiXG5cdFx0XHR9LFxuXHRcdFx0dGhpcy51cGRhdGVQcmV2aWV3LmJpbmQoIHRoaXMgKVxuXHRcdClcblx0fTtcbn07XG5cbi8qKlxuICogVXBkYXRlcyB0aGUgdHdpdHRlciBwcmV2aWV3LlxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUudXBkYXRlUHJldmlldyA9IGZ1bmN0aW9uKCkge1xuLy8gVXBkYXRlIHRoZSBkYXRhLlxuXHR0aGlzLmRhdGEudGl0bGUgPSB0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cy50aXRsZS5nZXRJbnB1dFZhbHVlKCk7XG5cdHRoaXMuZGF0YS5kZXNjcmlwdGlvbiA9IHRoaXMuZWxlbWVudC5maWVsZEVsZW1lbnRzLmRlc2NyaXB0aW9uLmdldElucHV0VmFsdWUoKTtcblx0dGhpcy5kYXRhLmltYWdlVXJsID0gdGhpcy5lbGVtZW50LmZpZWxkRWxlbWVudHMuaW1hZ2VVcmwuZ2V0SW5wdXRWYWx1ZSgpO1xuXG5cdC8vIFNldHMgdGhlIHRpdGxlIGZpZWxkXG5cdHRoaXMuc2V0VGl0bGUoIHRoaXMuZWxlbWVudC5maWVsZEVsZW1lbnRzLnRpdGxlLmdldFZhbHVlKCkgKTtcblxuXHQvLyBTZXQgdGhlIGRlc2NyaXB0aW9uIGZpZWxkIGFuZCBwYXJzZSB0aGUgc3R5bGluZyBvZiBpdC5cblx0dGhpcy5zZXREZXNjcmlwdGlvbiggdGhpcy5lbGVtZW50LmZpZWxkRWxlbWVudHMuZGVzY3JpcHRpb24uZ2V0VmFsdWUoKSApO1xuXG5cdC8vIFNldHMgdGhlIEltYWdlIFVSTFxuXHR0aGlzLnNldEltYWdlKCB0aGlzLmRhdGEuaW1hZ2VVcmwgKTtcblxuXHQvLyBDbG9uZSBzbyB0aGUgZGF0YSBpc24ndCBjaGFuZ2VhYmxlLlxuXHR0aGlzLm9wdHMuY2FsbGJhY2tzLnVwZGF0ZVNvY2lhbFByZXZpZXcoIGNsb25lKCB0aGlzLmRhdGEgKSApO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBwcmV2aWV3IHRpdGxlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0aXRsZSBUaGUgbmV3IHRpdGxlLlxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUuc2V0VGl0bGUgPSBmdW5jdGlvbiggdGl0bGUgKSB7XG5cdHRpdGxlID0gdGhpcy5vcHRzLmNhbGxiYWNrcy5tb2RpZnlUaXRsZSggdGl0bGUgKTtcblxuXHR0aGlzLmVsZW1lbnQucmVuZGVyZWQudGl0bGUuaW5uZXJIVE1MID0gdGl0bGU7XG59O1xuXG4vKipcbiAqIFNldCB0aGUgcHJldmlldyBkZXNjcmlwdGlvbi5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZGVzY3JpcHRpb24gVGhlIGRlc2NyaXB0aW9uIHRvIHNldC5cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLnNldERlc2NyaXB0aW9uID0gZnVuY3Rpb24oIGRlc2NyaXB0aW9uICkge1xuXHRkZXNjcmlwdGlvbiA9IHRoaXMub3B0cy5jYWxsYmFja3MubW9kaWZ5RGVzY3JpcHRpb24oIGRlc2NyaXB0aW9uICk7XG5cblx0dGhpcy5lbGVtZW50LnJlbmRlcmVkLmRlc2NyaXB0aW9uLmlubmVySFRNTCA9IGRlc2NyaXB0aW9uO1xuXHRyZW5kZXJEZXNjcmlwdGlvbiggdGhpcy5lbGVtZW50LnJlbmRlcmVkLmRlc2NyaXB0aW9uLCB0aGlzLmVsZW1lbnQuZmllbGRFbGVtZW50cy5kZXNjcmlwdGlvbi5nZXRJbnB1dFZhbHVlKCkgKTtcbn07XG5cbi8qKlxuICogR2V0cyB0aGUgaW1hZ2UgY29udGFpbmVyLlxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbnRhaW5lciB0aGF0IHdpbGwgaG9sZCB0aGUgaW1hZ2UuXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5nZXRJbWFnZUNvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5lbGVtZW50LnByZXZpZXcuaW1hZ2VVcmw7XG59O1xuXG4vKipcbiAqIFVwZGF0ZXMgdGhlIGltYWdlIG9iamVjdCB3aXRoIHRoZSBuZXcgVVJMLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBpbWFnZVVybCBUaGUgaW1hZ2UgcGF0aC5cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLnNldEltYWdlID0gZnVuY3Rpb24oIGltYWdlVXJsICkge1xuXHRpbWFnZVVybCA9IHRoaXMub3B0cy5jYWxsYmFja3MubW9kaWZ5SW1hZ2VVcmwoIGltYWdlVXJsICk7XG5cblx0aWYgKCBpbWFnZVVybCA9PT0gXCJcIiAmJiB0aGlzLmRhdGEuaW1hZ2VVcmwgPT09IFwiXCIgKSB7XG5cdFx0dGhpcy5yZW1vdmVJbWFnZUZyb21Db250YWluZXIoKTtcblx0XHR0aGlzLnJlbW92ZUltYWdlQ2xhc3NlcygpO1xuXHRcdHRoaXMuc2V0UGxhY2VIb2xkZXIoKTtcblxuXHRcdHJldHVybjtcblx0fVxuXG5cdHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcblxuXHRpbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKCB0aGlzLmlzVG9vU21hbGxJbWFnZSggaW1nICkgKSB7XG5cdFx0XHR0aGlzLnJlbW92ZUltYWdlRnJvbUNvbnRhaW5lcigpO1xuXHRcdFx0dGhpcy5yZW1vdmVJbWFnZUNsYXNzZXMoKTtcblx0XHRcdHRoaXMuc2V0UGxhY2VIb2xkZXIoKTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuc2V0U2l6aW5nQ2xhc3MoIGltZyApO1xuXHRcdHRoaXMuYWRkSW1hZ2VUb0NvbnRhaW5lciggaW1hZ2VVcmwgKTtcblx0fS5iaW5kKCB0aGlzICk7XG5cblx0aW1nLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnJlbW92ZUltYWdlRnJvbUNvbnRhaW5lcigpO1xuXHRcdHRoaXMucmVtb3ZlSW1hZ2VDbGFzc2VzKCk7XG5cdFx0dGhpcy5zZXRQbGFjZUhvbGRlcigpO1xuXHR9LmJpbmQoIHRoaXMgKTtcblxuXHQvLyBMb2FkIGltYWdlIHRvIHRyaWdnZXIgbG9hZCBvciBlcnJvciBldmVudC5cblx0aW1nLnNyYyA9IGltYWdlVXJsO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBpbWFnZSBvZiB0aGUgaW1hZ2UgY29udGFpbmVyLlxuICogQHBhcmFtIHtzdHJpbmd9IGltYWdlIFRoZSBpbWFnZSB0byB1c2UuXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5hZGRJbWFnZVRvQ29udGFpbmVyID0gZnVuY3Rpb24oIGltYWdlICkge1xuXHR2YXIgY29udGFpbmVyID0gdGhpcy5nZXRJbWFnZUNvbnRhaW5lcigpO1xuXG5cdGNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xuXHRjb250YWluZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoXCIgKyBpbWFnZSArIFwiKVwiO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBpbWFnZSBmcm9tIHRoZSBjb250YWluZXIuXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5yZW1vdmVJbWFnZUZyb21Db250YWluZXIgPSBmdW5jdGlvbigpIHtcblx0dmFyIGNvbnRhaW5lciA9IHRoaXMuZ2V0SW1hZ2VDb250YWluZXIoKTtcblxuXHRjb250YWluZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJcIjtcbn07XG5cbi8qKlxuICogU2V0cyB0aGUgcHJvcGVyIENTUyBjbGFzcyBmb3IgdGhlIGN1cnJlbnQgaW1hZ2UuXG4gKiBAcGFyYW0ge0ltYWdlfSBpbWcgVGhlIGltYWdlIHRvIGJhc2UgdGhlIHNpemluZyBjbGFzcyBvbi5cbiAqXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLnNldFNpemluZ0NsYXNzID0gZnVuY3Rpb24oIGltZyApIHtcblx0dGhpcy5yZW1vdmVJbWFnZUNsYXNzZXMoKTtcblxuXHRpZiAoIHRoaXMuaXNTbWFsbEltYWdlKCBpbWcgKSApIHtcblx0XHR0aGlzLnNldFNtYWxsSW1hZ2VDbGFzc2VzKCk7XG5cblx0XHRyZXR1cm47XG5cdH1cblxuXHR0aGlzLnNldExhcmdlSW1hZ2VDbGFzc2VzKCk7XG5cblx0cmV0dXJuO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBtYXggaW1hZ2Ugd2lkdGhcbiAqXG4gKiBAcGFyYW0ge0ltYWdlfSBpbWcgVGhlIGltYWdlIG9iamVjdCB0byB1c2UuXG4gKiBAcmV0dXJucyB7aW50fSBUaGUgY2FsY3VsYXRlZCBtYXggd2lkdGguXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5nZXRNYXhJbWFnZVdpZHRoID0gZnVuY3Rpb24oIGltZyApIHtcblx0aWYgKCB0aGlzLmlzU21hbGxJbWFnZSggaW1nICkgKSB7XG5cdFx0cmV0dXJuIFdJRFRIX1RXSVRURVJfSU1BR0VfU01BTEw7XG5cdH1cblxuXHRyZXR1cm4gV0lEVEhfVFdJVFRFUl9JTUFHRV9MQVJHRTtcbn07XG4vKipcbiAqIFNldHMgdGhlIGRlZmF1bHQgdHdpdHRlciBwbGFjZWhvbGRlclxuICovXG5Ud2l0dGVyUHJldmlldy5wcm90b3R5cGUuc2V0UGxhY2VIb2xkZXIgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5zZXRTbWFsbEltYWdlQ2xhc3NlcygpO1xuXG5cdGltYWdlUGxhY2Vob2xkZXIoXG5cdFx0dGhpcy5lbGVtZW50LnByZXZpZXcuaW1hZ2VVcmwsXG5cdFx0XCJcIixcblx0XHRmYWxzZSxcblx0XHRcInR3aXR0ZXJcIlxuXHQpO1xuXG59O1xuXG4vKipcbiAqIERldGVjdHMgaWYgdGhlIHR3aXR0ZXIgcHJldmlldyBzaG91bGQgc3dpdGNoIHRvIHNtYWxsIGltYWdlIG1vZGVcbiAqXG4gKiBAcGFyYW0ge0hUTUxJbWFnZUVsZW1lbnR9IGltYWdlIFRoZSBpbWFnZSBpbiBxdWVzdGlvbi5cbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gV2hldGhlciB0aGUgaW1hZ2UgaXMgc21hbGwuXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5pc1NtYWxsSW1hZ2UgPSBmdW5jdGlvbiggaW1hZ2UgKSB7XG5cdHJldHVybiAoXG5cdFx0aW1hZ2Uud2lkdGggPCBUV0lUVEVSX0lNQUdFX1RIUkVTSE9MRF9XSURUSCB8fFxuXHRcdGltYWdlLmhlaWdodCA8IFRXSVRURVJfSU1BR0VfVEhSRVNIT0xEX0hFSUdIVFxuXHQpO1xufTtcblxuLyoqXG4gKiBEZXRlY3RzIGlmIHRoZSB0d2l0dGVyIHByZXZpZXcgaW1hZ2UgaXMgdG9vIHNtYWxsXG4gKlxuICogQHBhcmFtIHtIVE1MSW1hZ2VFbGVtZW50fSBpbWFnZSBUaGUgaW1hZ2UgaW4gcXVlc3Rpb24uXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59IFdoZXRoZXIgdGhlIGltYWdlIGlzIHRvbyBzbWFsbC5cbiAqL1xuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLmlzVG9vU21hbGxJbWFnZSA9IGZ1bmN0aW9uKCBpbWFnZSApIHtcblx0cmV0dXJuIChcblx0XHRpbWFnZS53aWR0aCA8IFdJRFRIX1RXSVRURVJfSU1BR0VfU01BTEwgfHxcblx0XHRpbWFnZS5oZWlnaHQgPCBXSURUSF9UV0lUVEVSX0lNQUdFX1NNQUxMXG5cdCk7XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIGNsYXNzZXMgb24gdGhlIGZhY2Vib29rIHByZXZpZXcgc28gdGhhdCBpdCB3aWxsIGRpc3BsYXkgYSBzbWFsbCBmYWNlYm9vayBpbWFnZSBwcmV2aWV3XG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5zZXRTbWFsbEltYWdlQ2xhc3NlcyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgdGFyZ2V0RWxlbWVudCA9IHRoaXMub3B0cy50YXJnZXRFbGVtZW50O1xuXG5cdGJlbUFkZE1vZGlmaWVyKCBcInR3aXR0ZXItc21hbGxcIiwgXCJzb2NpYWwtcHJldmlld19faW5uZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1BZGRNb2RpZmllciggXCJ0d2l0dGVyLXNtYWxsXCIsIFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLXR3aXR0ZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1BZGRNb2RpZmllciggXCJ0d2l0dGVyLXNtYWxsXCIsIFwiZWRpdGFibGUtcHJldmlld19fdGV4dC1rZWVwZXItLXR3aXR0ZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xufTtcblxuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLnJlbW92ZVNtYWxsSW1hZ2VDbGFzc2VzID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0YXJnZXRFbGVtZW50ID0gdGhpcy5vcHRzLnRhcmdldEVsZW1lbnQ7XG5cblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwidHdpdHRlci1zbWFsbFwiLCBcInNvY2lhbC1wcmV2aWV3X19pbm5lclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbVJlbW92ZU1vZGlmaWVyKCBcInR3aXR0ZXItc21hbGxcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X19pbWFnZS0tdHdpdHRlclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbVJlbW92ZU1vZGlmaWVyKCBcInR3aXR0ZXItc21hbGxcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlci0tdHdpdHRlclwiLCB0YXJnZXRFbGVtZW50ICk7XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIGNsYXNzZXMgb24gdGhlIGZhY2Vib29rIHByZXZpZXcgc28gdGhhdCBpdCB3aWxsIGRpc3BsYXkgYSBsYXJnZSBmYWNlYm9vayBpbWFnZSBwcmV2aWV3XG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5zZXRMYXJnZUltYWdlQ2xhc3NlcyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgdGFyZ2V0RWxlbWVudCA9IHRoaXMub3B0cy50YXJnZXRFbGVtZW50O1xuXG5cdGJlbUFkZE1vZGlmaWVyKCBcInR3aXR0ZXItbGFyZ2VcIiwgXCJzb2NpYWwtcHJldmlld19faW5uZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1BZGRNb2RpZmllciggXCJ0d2l0dGVyLWxhcmdlXCIsIFwiZWRpdGFibGUtcHJldmlld19faW1hZ2UtLXR3aXR0ZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xuXHRiZW1BZGRNb2RpZmllciggXCJ0d2l0dGVyLWxhcmdlXCIsIFwiZWRpdGFibGUtcHJldmlld19fdGV4dC1rZWVwZXItLXR3aXR0ZXJcIiwgdGFyZ2V0RWxlbWVudCApO1xufTtcblxuVHdpdHRlclByZXZpZXcucHJvdG90eXBlLnJlbW92ZUxhcmdlSW1hZ2VDbGFzc2VzID0gZnVuY3Rpb24oKSB7XG5cdHZhciB0YXJnZXRFbGVtZW50ID0gdGhpcy5vcHRzLnRhcmdldEVsZW1lbnQ7XG5cblx0YmVtUmVtb3ZlTW9kaWZpZXIoIFwidHdpdHRlci1sYXJnZVwiLCBcInNvY2lhbC1wcmV2aWV3X19pbm5lclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbVJlbW92ZU1vZGlmaWVyKCBcInR3aXR0ZXItbGFyZ2VcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X19pbWFnZS0tdHdpdHRlclwiLCB0YXJnZXRFbGVtZW50ICk7XG5cdGJlbVJlbW92ZU1vZGlmaWVyKCBcInR3aXR0ZXItbGFyZ2VcIiwgXCJlZGl0YWJsZS1wcmV2aWV3X190ZXh0LWtlZXBlci0tdHdpdHRlclwiLCB0YXJnZXRFbGVtZW50ICk7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGltYWdlIGNsYXNzZXMuXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5yZW1vdmVJbWFnZUNsYXNzZXMgPSBmdW5jdGlvbigpIHtcblx0dGhpcy5yZW1vdmVTbWFsbEltYWdlQ2xhc3NlcygpO1xuXHR0aGlzLnJlbW92ZUxhcmdlSW1hZ2VDbGFzc2VzKCk7XG59O1xuXG4vKipcbiAqIEJpbmRzIHRoZSByZWxvYWRTbmlwcGV0VGV4dCBmdW5jdGlvbiB0byB0aGUgYmx1ciBvZiB0aGUgc25pcHBldCBpbnB1dHMuXG4gKi9cblR3aXR0ZXJQcmV2aWV3LnByb3RvdHlwZS5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG5cdHZhciBwcmV2aWV3RXZlbnRzID0gbmV3IFByZXZpZXdFdmVudHMoIGlucHV0VHdpdHRlclByZXZpZXdCaW5kaW5ncywgdGhpcy5lbGVtZW50LCB0cnVlICk7XG5cdHByZXZpZXdFdmVudHMuYmluZEV2ZW50cyggdGhpcy5lbGVtZW50LmVkaXRUb2dnbGUsIHRoaXMuZWxlbWVudC5jbG9zZUVkaXRvciApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUd2l0dGVyUHJldmlldztcbiIsInZhciBhcnJheUVhY2ggPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9hcnJheUVhY2gnKSxcbiAgICBiYXNlRWFjaCA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2Jhc2VFYWNoJyksXG4gICAgY3JlYXRlRm9yRWFjaCA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2NyZWF0ZUZvckVhY2gnKTtcblxuLyoqXG4gKiBJdGVyYXRlcyBvdmVyIGVsZW1lbnRzIG9mIGBjb2xsZWN0aW9uYCBpbnZva2luZyBgaXRlcmF0ZWVgIGZvciBlYWNoIGVsZW1lbnQuXG4gKiBUaGUgYGl0ZXJhdGVlYCBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM6XG4gKiAodmFsdWUsIGluZGV4fGtleSwgY29sbGVjdGlvbikuIEl0ZXJhdGVlIGZ1bmN0aW9ucyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHlcbiAqIGJ5IGV4cGxpY2l0bHkgcmV0dXJuaW5nIGBmYWxzZWAuXG4gKlxuICogKipOb3RlOioqIEFzIHdpdGggb3RoZXIgXCJDb2xsZWN0aW9uc1wiIG1ldGhvZHMsIG9iamVjdHMgd2l0aCBhIFwibGVuZ3RoXCIgcHJvcGVydHlcbiAqIGFyZSBpdGVyYXRlZCBsaWtlIGFycmF5cy4gVG8gYXZvaWQgdGhpcyBiZWhhdmlvciBgXy5mb3JJbmAgb3IgYF8uZm9yT3duYFxuICogbWF5IGJlIHVzZWQgZm9yIG9iamVjdCBpdGVyYXRpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBhbGlhcyBlYWNoXG4gKiBAY2F0ZWdvcnkgQ29sbGVjdGlvblxuICogQHBhcmFtIHtBcnJheXxPYmplY3R8c3RyaW5nfSBjb2xsZWN0aW9uIFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtpdGVyYXRlZT1fLmlkZW50aXR5XSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBpdGVyYXRlZWAuXG4gKiBAcmV0dXJucyB7QXJyYXl8T2JqZWN0fHN0cmluZ30gUmV0dXJucyBgY29sbGVjdGlvbmAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8oWzEsIDJdKS5mb3JFYWNoKGZ1bmN0aW9uKG4pIHtcbiAqICAgY29uc29sZS5sb2cobik7XG4gKiB9KS52YWx1ZSgpO1xuICogLy8gPT4gbG9ncyBlYWNoIHZhbHVlIGZyb20gbGVmdCB0byByaWdodCBhbmQgcmV0dXJucyB0aGUgYXJyYXlcbiAqXG4gKiBfLmZvckVhY2goeyAnYSc6IDEsICdiJzogMiB9LCBmdW5jdGlvbihuLCBrZXkpIHtcbiAqICAgY29uc29sZS5sb2cobiwga2V5KTtcbiAqIH0pO1xuICogLy8gPT4gbG9ncyBlYWNoIHZhbHVlLWtleSBwYWlyIGFuZCByZXR1cm5zIHRoZSBvYmplY3QgKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqL1xudmFyIGZvckVhY2ggPSBjcmVhdGVGb3JFYWNoKGFycmF5RWFjaCwgYmFzZUVhY2gpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZvckVhY2g7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvZ2V0TmF0aXZlJyk7XG5cbi8qIE5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTm93ID0gZ2V0TmF0aXZlKERhdGUsICdub3cnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRoYXQgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBVbml4IGVwb2NoXG4gKiAoMSBKYW51YXJ5IDE5NzAgMDA6MDA6MDAgVVRDKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IERhdGVcbiAqIEBleGFtcGxlXG4gKlxuICogXy5kZWZlcihmdW5jdGlvbihzdGFtcCkge1xuICogICBjb25zb2xlLmxvZyhfLm5vdygpIC0gc3RhbXApO1xuICogfSwgXy5ub3coKSk7XG4gKiAvLyA9PiBsb2dzIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGl0IHRvb2sgZm9yIHRoZSBkZWZlcnJlZCBmdW5jdGlvbiB0byBiZSBpbnZva2VkXG4gKi9cbnZhciBub3cgPSBuYXRpdmVOb3cgfHwgZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbm93O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vbGFuZy9pc09iamVjdCcpLFxuICAgIG5vdyA9IHJlcXVpcmUoJy4uL2RhdGUvbm93Jyk7XG5cbi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBkZWJvdW5jZWQgZnVuY3Rpb24gdGhhdCBkZWxheXMgaW52b2tpbmcgYGZ1bmNgIHVudGlsIGFmdGVyIGB3YWl0YFxuICogbWlsbGlzZWNvbmRzIGhhdmUgZWxhcHNlZCBzaW5jZSB0aGUgbGFzdCB0aW1lIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gd2FzXG4gKiBpbnZva2VkLiBUaGUgZGVib3VuY2VkIGZ1bmN0aW9uIGNvbWVzIHdpdGggYSBgY2FuY2VsYCBtZXRob2QgdG8gY2FuY2VsXG4gKiBkZWxheWVkIGludm9jYXRpb25zLiBQcm92aWRlIGFuIG9wdGlvbnMgb2JqZWN0IHRvIGluZGljYXRlIHRoYXQgYGZ1bmNgXG4gKiBzaG91bGQgYmUgaW52b2tlZCBvbiB0aGUgbGVhZGluZyBhbmQvb3IgdHJhaWxpbmcgZWRnZSBvZiB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKiBTdWJzZXF1ZW50IGNhbGxzIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIGxhc3RcbiAqIGBmdW5jYCBpbnZvY2F0aW9uLlxuICpcbiAqICoqTm90ZToqKiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgLCBgZnVuY2AgaXMgaW52b2tlZFxuICogb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiBpc1xuICogaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwOi8vZHJ1cGFsbW90aW9uLmNvbS9hcnRpY2xlL2RlYm91bmNlLWFuZC10aHJvdHRsZS12aXN1YWwtZXhwbGFuYXRpb24pXG4gKiBmb3IgZGV0YWlscyBvdmVyIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGBfLmRlYm91bmNlYCBhbmQgYF8udGhyb3R0bGVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlYm91bmNlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9ZmFsc2VdIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIGxlYWRpbmdcbiAqICBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1heFdhaXRdIFRoZSBtYXhpbXVtIHRpbWUgYGZ1bmNgIGlzIGFsbG93ZWQgdG8gYmVcbiAqICBkZWxheWVkIGJlZm9yZSBpdCdzIGludm9rZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIHRyYWlsaW5nXG4gKiAgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGRlYm91bmNlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gYXZvaWQgY29zdGx5IGNhbGN1bGF0aW9ucyB3aGlsZSB0aGUgd2luZG93IHNpemUgaXMgaW4gZmx1eFxuICogalF1ZXJ5KHdpbmRvdykub24oJ3Jlc2l6ZScsIF8uZGVib3VuY2UoY2FsY3VsYXRlTGF5b3V0LCAxNTApKTtcbiAqXG4gKiAvLyBpbnZva2UgYHNlbmRNYWlsYCB3aGVuIHRoZSBjbGljayBldmVudCBpcyBmaXJlZCwgZGVib3VuY2luZyBzdWJzZXF1ZW50IGNhbGxzXG4gKiBqUXVlcnkoJyNwb3N0Ym94Jykub24oJ2NsaWNrJywgXy5kZWJvdW5jZShzZW5kTWFpbCwgMzAwLCB7XG4gKiAgICdsZWFkaW5nJzogdHJ1ZSxcbiAqICAgJ3RyYWlsaW5nJzogZmFsc2VcbiAqIH0pKTtcbiAqXG4gKiAvLyBlbnN1cmUgYGJhdGNoTG9nYCBpcyBpbnZva2VkIG9uY2UgYWZ0ZXIgMSBzZWNvbmQgb2YgZGVib3VuY2VkIGNhbGxzXG4gKiB2YXIgc291cmNlID0gbmV3IEV2ZW50U291cmNlKCcvc3RyZWFtJyk7XG4gKiBqUXVlcnkoc291cmNlKS5vbignbWVzc2FnZScsIF8uZGVib3VuY2UoYmF0Y2hMb2csIDI1MCwge1xuICogICAnbWF4V2FpdCc6IDEwMDBcbiAqIH0pKTtcbiAqXG4gKiAvLyBjYW5jZWwgYSBkZWJvdW5jZWQgY2FsbFxuICogdmFyIHRvZG9DaGFuZ2VzID0gXy5kZWJvdW5jZShiYXRjaExvZywgMTAwMCk7XG4gKiBPYmplY3Qub2JzZXJ2ZShtb2RlbHMudG9kbywgdG9kb0NoYW5nZXMpO1xuICpcbiAqIE9iamVjdC5vYnNlcnZlKG1vZGVscywgZnVuY3Rpb24oY2hhbmdlcykge1xuICogICBpZiAoXy5maW5kKGNoYW5nZXMsIHsgJ3VzZXInOiAndG9kbycsICd0eXBlJzogJ2RlbGV0ZSd9KSkge1xuICogICAgIHRvZG9DaGFuZ2VzLmNhbmNlbCgpO1xuICogICB9XG4gKiB9LCBbJ2RlbGV0ZSddKTtcbiAqXG4gKiAvLyAuLi5hdCBzb21lIHBvaW50IGBtb2RlbHMudG9kb2AgaXMgY2hhbmdlZFxuICogbW9kZWxzLnRvZG8uY29tcGxldGVkID0gdHJ1ZTtcbiAqXG4gKiAvLyAuLi5iZWZvcmUgMSBzZWNvbmQgaGFzIHBhc3NlZCBgbW9kZWxzLnRvZG9gIGlzIGRlbGV0ZWRcbiAqIC8vIHdoaWNoIGNhbmNlbHMgdGhlIGRlYm91bmNlZCBgdG9kb0NoYW5nZXNgIGNhbGxcbiAqIGRlbGV0ZSBtb2RlbHMudG9kbztcbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgYXJncyxcbiAgICAgIG1heFRpbWVvdXRJZCxcbiAgICAgIHJlc3VsdCxcbiAgICAgIHN0YW1wLFxuICAgICAgdGhpc0FyZyxcbiAgICAgIHRpbWVvdXRJZCxcbiAgICAgIHRyYWlsaW5nQ2FsbCxcbiAgICAgIGxhc3RDYWxsZWQgPSAwLFxuICAgICAgbWF4V2FpdCA9IGZhbHNlLFxuICAgICAgdHJhaWxpbmcgPSB0cnVlO1xuXG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHdhaXQgPSB3YWl0IDwgMCA/IDAgOiAoK3dhaXQgfHwgMCk7XG4gIGlmIChvcHRpb25zID09PSB0cnVlKSB7XG4gICAgdmFyIGxlYWRpbmcgPSB0cnVlO1xuICAgIHRyYWlsaW5nID0gZmFsc2U7XG4gIH0gZWxzZSBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gISFvcHRpb25zLmxlYWRpbmc7XG4gICAgbWF4V2FpdCA9ICdtYXhXYWl0JyBpbiBvcHRpb25zICYmIG5hdGl2ZU1heCgrb3B0aW9ucy5tYXhXYWl0IHx8IDAsIHdhaXQpO1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgaWYgKHRpbWVvdXRJZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRJZCk7XG4gICAgfVxuICAgIGlmIChtYXhUaW1lb3V0SWQpIHtcbiAgICAgIGNsZWFyVGltZW91dChtYXhUaW1lb3V0SWQpO1xuICAgIH1cbiAgICBsYXN0Q2FsbGVkID0gMDtcbiAgICBtYXhUaW1lb3V0SWQgPSB0aW1lb3V0SWQgPSB0cmFpbGluZ0NhbGwgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBjb21wbGV0ZShpc0NhbGxlZCwgaWQpIHtcbiAgICBpZiAoaWQpIHtcbiAgICAgIGNsZWFyVGltZW91dChpZCk7XG4gICAgfVxuICAgIG1heFRpbWVvdXRJZCA9IHRpbWVvdXRJZCA9IHRyYWlsaW5nQ2FsbCA9IHVuZGVmaW5lZDtcbiAgICBpZiAoaXNDYWxsZWQpIHtcbiAgICAgIGxhc3RDYWxsZWQgPSBub3coKTtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgICBpZiAoIXRpbWVvdXRJZCAmJiAhbWF4VGltZW91dElkKSB7XG4gICAgICAgIGFyZ3MgPSB0aGlzQXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGRlbGF5ZWQoKSB7XG4gICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93KCkgLSBzdGFtcCk7XG4gICAgaWYgKHJlbWFpbmluZyA8PSAwIHx8IHJlbWFpbmluZyA+IHdhaXQpIHtcbiAgICAgIGNvbXBsZXRlKHRyYWlsaW5nQ2FsbCwgbWF4VGltZW91dElkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGltZW91dElkID0gc2V0VGltZW91dChkZWxheWVkLCByZW1haW5pbmcpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG1heERlbGF5ZWQoKSB7XG4gICAgY29tcGxldGUodHJhaWxpbmcsIHRpbWVvdXRJZCk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICBzdGFtcCA9IG5vdygpO1xuICAgIHRoaXNBcmcgPSB0aGlzO1xuICAgIHRyYWlsaW5nQ2FsbCA9IHRyYWlsaW5nICYmICh0aW1lb3V0SWQgfHwgIWxlYWRpbmcpO1xuXG4gICAgaWYgKG1heFdhaXQgPT09IGZhbHNlKSB7XG4gICAgICB2YXIgbGVhZGluZ0NhbGwgPSBsZWFkaW5nICYmICF0aW1lb3V0SWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghbWF4VGltZW91dElkICYmICFsZWFkaW5nKSB7XG4gICAgICAgIGxhc3RDYWxsZWQgPSBzdGFtcDtcbiAgICAgIH1cbiAgICAgIHZhciByZW1haW5pbmcgPSBtYXhXYWl0IC0gKHN0YW1wIC0gbGFzdENhbGxlZCksXG4gICAgICAgICAgaXNDYWxsZWQgPSByZW1haW5pbmcgPD0gMCB8fCByZW1haW5pbmcgPiBtYXhXYWl0O1xuXG4gICAgICBpZiAoaXNDYWxsZWQpIHtcbiAgICAgICAgaWYgKG1heFRpbWVvdXRJZCkge1xuICAgICAgICAgIG1heFRpbWVvdXRJZCA9IGNsZWFyVGltZW91dChtYXhUaW1lb3V0SWQpO1xuICAgICAgICB9XG4gICAgICAgIGxhc3RDYWxsZWQgPSBzdGFtcDtcbiAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKCFtYXhUaW1lb3V0SWQpIHtcbiAgICAgICAgbWF4VGltZW91dElkID0gc2V0VGltZW91dChtYXhEZWxheWVkLCByZW1haW5pbmcpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNDYWxsZWQgJiYgdGltZW91dElkKSB7XG4gICAgICB0aW1lb3V0SWQgPSBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoIXRpbWVvdXRJZCAmJiB3YWl0ICE9PSBtYXhXYWl0KSB7XG4gICAgICB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGRlbGF5ZWQsIHdhaXQpO1xuICAgIH1cbiAgICBpZiAobGVhZGluZ0NhbGwpIHtcbiAgICAgIGlzQ2FsbGVkID0gdHJ1ZTtcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgfVxuICAgIGlmIChpc0NhbGxlZCAmJiAhdGltZW91dElkICYmICFtYXhUaW1lb3V0SWQpIHtcbiAgICAgIGFyZ3MgPSB0aGlzQXJnID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGRlYm91bmNlZC5jYW5jZWwgPSBjYW5jZWw7XG4gIHJldHVybiBkZWJvdW5jZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVib3VuY2U7XG4iLCIvKiogVXNlZCBhcyB0aGUgYFR5cGVFcnJvcmAgbWVzc2FnZSBmb3IgXCJGdW5jdGlvbnNcIiBtZXRob2RzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiB0aGVcbiAqIGNyZWF0ZWQgZnVuY3Rpb24gYW5kIGFyZ3VtZW50cyBmcm9tIGBzdGFydGAgYW5kIGJleW9uZCBwcm92aWRlZCBhcyBhbiBhcnJheS5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgYmFzZWQgb24gdGhlIFtyZXN0IHBhcmFtZXRlcl0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0Z1bmN0aW9ucy9yZXN0X3BhcmFtZXRlcnMpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IGEgcmVzdCBwYXJhbWV0ZXIgdG8uXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PWZ1bmMubGVuZ3RoLTFdIFRoZSBzdGFydCBwb3NpdGlvbiBvZiB0aGUgcmVzdCBwYXJhbWV0ZXIuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHNheSA9IF8ucmVzdFBhcmFtKGZ1bmN0aW9uKHdoYXQsIG5hbWVzKSB7XG4gKiAgIHJldHVybiB3aGF0ICsgJyAnICsgXy5pbml0aWFsKG5hbWVzKS5qb2luKCcsICcpICtcbiAqICAgICAoXy5zaXplKG5hbWVzKSA+IDEgPyAnLCAmICcgOiAnJykgKyBfLmxhc3QobmFtZXMpO1xuICogfSk7XG4gKlxuICogc2F5KCdoZWxsbycsICdmcmVkJywgJ2Jhcm5leScsICdwZWJibGVzJyk7XG4gKiAvLyA9PiAnaGVsbG8gZnJlZCwgYmFybmV5LCAmIHBlYmJsZXMnXG4gKi9cbmZ1bmN0aW9uIHJlc3RQYXJhbShmdW5jLCBzdGFydCkge1xuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICBzdGFydCA9IG5hdGl2ZU1heChzdGFydCA9PT0gdW5kZWZpbmVkID8gKGZ1bmMubGVuZ3RoIC0gMSkgOiAoK3N0YXJ0IHx8IDApLCAwKTtcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAgICBpbmRleCA9IC0xLFxuICAgICAgICBsZW5ndGggPSBuYXRpdmVNYXgoYXJncy5sZW5ndGggLSBzdGFydCwgMCksXG4gICAgICAgIHJlc3QgPSBBcnJheShsZW5ndGgpO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHJlc3RbaW5kZXhdID0gYXJnc1tzdGFydCArIGluZGV4XTtcbiAgICB9XG4gICAgc3dpdGNoIChzdGFydCkge1xuICAgICAgY2FzZSAwOiByZXR1cm4gZnVuYy5jYWxsKHRoaXMsIHJlc3QpO1xuICAgICAgY2FzZSAxOiByZXR1cm4gZnVuYy5jYWxsKHRoaXMsIGFyZ3NbMF0sIHJlc3QpO1xuICAgICAgY2FzZSAyOiByZXR1cm4gZnVuYy5jYWxsKHRoaXMsIGFyZ3NbMF0sIGFyZ3NbMV0sIHJlc3QpO1xuICAgIH1cbiAgICB2YXIgb3RoZXJBcmdzID0gQXJyYXkoc3RhcnQgKyAxKTtcbiAgICBpbmRleCA9IC0xO1xuICAgIHdoaWxlICgrK2luZGV4IDwgc3RhcnQpIHtcbiAgICAgIG90aGVyQXJnc1tpbmRleF0gPSBhcmdzW2luZGV4XTtcbiAgICB9XG4gICAgb3RoZXJBcmdzW3N0YXJ0XSA9IHJlc3Q7XG4gICAgcmV0dXJuIGZ1bmMuYXBwbHkodGhpcywgb3RoZXJBcmdzKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXN0UGFyYW07XG4iLCIvKipcbiAqIENvcGllcyB0aGUgdmFsdWVzIG9mIGBzb3VyY2VgIHRvIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IHNvdXJjZSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgZnJvbS5cbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheT1bXV0gVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIHRvLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5Q29weShzb3VyY2UsIGFycmF5KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gc291cmNlLmxlbmd0aDtcblxuICBhcnJheSB8fCAoYXJyYXkgPSBBcnJheShsZW5ndGgpKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhcnJheVtpbmRleF0gPSBzb3VyY2VbaW5kZXhdO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhcnJheUNvcHk7XG4iLCIvKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5mb3JFYWNoYCBmb3IgYXJyYXlzIHdpdGhvdXQgc3VwcG9ydCBmb3IgY2FsbGJhY2tcbiAqIHNob3J0aGFuZHMgYW5kIGB0aGlzYCBiaW5kaW5nLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheUVhY2goYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgaWYgKGl0ZXJhdGVlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSA9PT0gZmFsc2UpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXJyYXlFYWNoO1xuIiwiLyoqXG4gKiBVc2VkIGJ5IGBfLmRlZmF1bHRzYCB0byBjdXN0b21pemUgaXRzIGBfLmFzc2lnbmAgdXNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IG9iamVjdFZhbHVlIFRoZSBkZXN0aW5hdGlvbiBvYmplY3QgcHJvcGVydHkgdmFsdWUuXG4gKiBAcGFyYW0geyp9IHNvdXJjZVZhbHVlIFRoZSBzb3VyY2Ugb2JqZWN0IHByb3BlcnR5IHZhbHVlLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHZhbHVlIHRvIGFzc2lnbiB0byB0aGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICovXG5mdW5jdGlvbiBhc3NpZ25EZWZhdWx0cyhvYmplY3RWYWx1ZSwgc291cmNlVmFsdWUpIHtcbiAgcmV0dXJuIG9iamVjdFZhbHVlID09PSB1bmRlZmluZWQgPyBzb3VyY2VWYWx1ZSA6IG9iamVjdFZhbHVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnbkRlZmF1bHRzO1xuIiwidmFyIGtleXMgPSByZXF1aXJlKCcuLi9vYmplY3Qva2V5cycpO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5hc3NpZ25gIGZvciBjdXN0b21pemluZyBhc3NpZ25lZCB2YWx1ZXMgd2l0aG91dFxuICogc3VwcG9ydCBmb3IgYXJndW1lbnQganVnZ2xpbmcsIG11bHRpcGxlIHNvdXJjZXMsIGFuZCBgdGhpc2AgYmluZGluZyBgY3VzdG9taXplcmBcbiAqIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBhc3NpZ25lZCB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBhc3NpZ25XaXRoKG9iamVjdCwgc291cmNlLCBjdXN0b21pemVyKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcHJvcHMgPSBrZXlzKHNvdXJjZSksXG4gICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdLFxuICAgICAgICB2YWx1ZSA9IG9iamVjdFtrZXldLFxuICAgICAgICByZXN1bHQgPSBjdXN0b21pemVyKHZhbHVlLCBzb3VyY2Vba2V5XSwga2V5LCBvYmplY3QsIHNvdXJjZSk7XG5cbiAgICBpZiAoKHJlc3VsdCA9PT0gcmVzdWx0ID8gKHJlc3VsdCAhPT0gdmFsdWUpIDogKHZhbHVlID09PSB2YWx1ZSkpIHx8XG4gICAgICAgICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmICEoa2V5IGluIG9iamVjdCkpKSB7XG4gICAgICBvYmplY3Rba2V5XSA9IHJlc3VsdDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3NpZ25XaXRoO1xuIiwidmFyIGJhc2VDb3B5ID0gcmVxdWlyZSgnLi9iYXNlQ29weScpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuLi9vYmplY3Qva2V5cycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmFzc2lnbmAgd2l0aG91dCBzdXBwb3J0IGZvciBhcmd1bWVudCBqdWdnbGluZyxcbiAqIG11bHRpcGxlIHNvdXJjZXMsIGFuZCBgY3VzdG9taXplcmAgZnVuY3Rpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUFzc2lnbihvYmplY3QsIHNvdXJjZSkge1xuICByZXR1cm4gc291cmNlID09IG51bGxcbiAgICA/IG9iamVjdFxuICAgIDogYmFzZUNvcHkoc291cmNlLCBrZXlzKHNvdXJjZSksIG9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUFzc2lnbjtcbiIsInZhciBhcnJheUNvcHkgPSByZXF1aXJlKCcuL2FycmF5Q29weScpLFxuICAgIGFycmF5RWFjaCA9IHJlcXVpcmUoJy4vYXJyYXlFYWNoJyksXG4gICAgYmFzZUFzc2lnbiA9IHJlcXVpcmUoJy4vYmFzZUFzc2lnbicpLFxuICAgIGJhc2VGb3JPd24gPSByZXF1aXJlKCcuL2Jhc2VGb3JPd24nKSxcbiAgICBpbml0Q2xvbmVBcnJheSA9IHJlcXVpcmUoJy4vaW5pdENsb25lQXJyYXknKSxcbiAgICBpbml0Q2xvbmVCeVRhZyA9IHJlcXVpcmUoJy4vaW5pdENsb25lQnlUYWcnKSxcbiAgICBpbml0Q2xvbmVPYmplY3QgPSByZXF1aXJlKCcuL2luaXRDbG9uZU9iamVjdCcpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuLi9sYW5nL2lzQXJyYXknKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2xhbmcvaXNPYmplY3QnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBzdXBwb3J0ZWQgYnkgYF8uY2xvbmVgLiAqL1xudmFyIGNsb25lYWJsZVRhZ3MgPSB7fTtcbmNsb25lYWJsZVRhZ3NbYXJnc1RhZ10gPSBjbG9uZWFibGVUYWdzW2FycmF5VGFnXSA9XG5jbG9uZWFibGVUYWdzW2FycmF5QnVmZmVyVGFnXSA9IGNsb25lYWJsZVRhZ3NbYm9vbFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tkYXRlVGFnXSA9IGNsb25lYWJsZVRhZ3NbZmxvYXQzMlRhZ10gPVxuY2xvbmVhYmxlVGFnc1tmbG9hdDY0VGFnXSA9IGNsb25lYWJsZVRhZ3NbaW50OFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tpbnQxNlRhZ10gPSBjbG9uZWFibGVUYWdzW2ludDMyVGFnXSA9XG5jbG9uZWFibGVUYWdzW251bWJlclRhZ10gPSBjbG9uZWFibGVUYWdzW29iamVjdFRhZ10gPVxuY2xvbmVhYmxlVGFnc1tyZWdleHBUYWddID0gY2xvbmVhYmxlVGFnc1tzdHJpbmdUYWddID1cbmNsb25lYWJsZVRhZ3NbdWludDhUYWddID0gY2xvbmVhYmxlVGFnc1t1aW50OENsYW1wZWRUYWddID1cbmNsb25lYWJsZVRhZ3NbdWludDE2VGFnXSA9IGNsb25lYWJsZVRhZ3NbdWludDMyVGFnXSA9IHRydWU7XG5jbG9uZWFibGVUYWdzW2Vycm9yVGFnXSA9IGNsb25lYWJsZVRhZ3NbZnVuY1RhZ10gPVxuY2xvbmVhYmxlVGFnc1ttYXBUYWddID0gY2xvbmVhYmxlVGFnc1tzZXRUYWddID1cbmNsb25lYWJsZVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9ialRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uY2xvbmVgIHdpdGhvdXQgc3VwcG9ydCBmb3IgYXJndW1lbnQganVnZ2xpbmdcbiAqIGFuZCBgdGhpc2AgYmluZGluZyBgY3VzdG9taXplcmAgZnVuY3Rpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjbG9uZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2lzRGVlcF0gU3BlY2lmeSBhIGRlZXAgY2xvbmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjbG9uaW5nIHZhbHVlcy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBba2V5XSBUaGUga2V5IG9mIGB2YWx1ZWAuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCBgdmFsdWVgIGJlbG9uZ3MgdG8uXG4gKiBAcGFyYW0ge0FycmF5fSBbc3RhY2tBPVtdXSBUcmFja3MgdHJhdmVyc2VkIHNvdXJjZSBvYmplY3RzLlxuICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQj1bXV0gQXNzb2NpYXRlcyBjbG9uZXMgd2l0aCBzb3VyY2UgY291bnRlcnBhcnRzLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGNsb25lZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gYmFzZUNsb25lKHZhbHVlLCBpc0RlZXAsIGN1c3RvbWl6ZXIsIGtleSwgb2JqZWN0LCBzdGFja0EsIHN0YWNrQikge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoY3VzdG9taXplcikge1xuICAgIHJlc3VsdCA9IG9iamVjdCA/IGN1c3RvbWl6ZXIodmFsdWUsIGtleSwgb2JqZWN0KSA6IGN1c3RvbWl6ZXIodmFsdWUpO1xuICB9XG4gIGlmIChyZXN1bHQgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgdmFyIGlzQXJyID0gaXNBcnJheSh2YWx1ZSk7XG4gIGlmIChpc0Fycikge1xuICAgIHJlc3VsdCA9IGluaXRDbG9uZUFycmF5KHZhbHVlKTtcbiAgICBpZiAoIWlzRGVlcCkge1xuICAgICAgcmV0dXJuIGFycmF5Q29weSh2YWx1ZSwgcmVzdWx0KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIHRhZyA9IG9ialRvU3RyaW5nLmNhbGwodmFsdWUpLFxuICAgICAgICBpc0Z1bmMgPSB0YWcgPT0gZnVuY1RhZztcblxuICAgIGlmICh0YWcgPT0gb2JqZWN0VGFnIHx8IHRhZyA9PSBhcmdzVGFnIHx8IChpc0Z1bmMgJiYgIW9iamVjdCkpIHtcbiAgICAgIHJlc3VsdCA9IGluaXRDbG9uZU9iamVjdChpc0Z1bmMgPyB7fSA6IHZhbHVlKTtcbiAgICAgIGlmICghaXNEZWVwKSB7XG4gICAgICAgIHJldHVybiBiYXNlQXNzaWduKHJlc3VsdCwgdmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY2xvbmVhYmxlVGFnc1t0YWddXG4gICAgICAgID8gaW5pdENsb25lQnlUYWcodmFsdWUsIHRhZywgaXNEZWVwKVxuICAgICAgICA6IChvYmplY3QgPyB2YWx1ZSA6IHt9KTtcbiAgICB9XG4gIH1cbiAgLy8gQ2hlY2sgZm9yIGNpcmN1bGFyIHJlZmVyZW5jZXMgYW5kIHJldHVybiBpdHMgY29ycmVzcG9uZGluZyBjbG9uZS5cbiAgc3RhY2tBIHx8IChzdGFja0EgPSBbXSk7XG4gIHN0YWNrQiB8fCAoc3RhY2tCID0gW10pO1xuXG4gIHZhciBsZW5ndGggPSBzdGFja0EubGVuZ3RoO1xuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICBpZiAoc3RhY2tBW2xlbmd0aF0gPT0gdmFsdWUpIHtcbiAgICAgIHJldHVybiBzdGFja0JbbGVuZ3RoXTtcbiAgICB9XG4gIH1cbiAgLy8gQWRkIHRoZSBzb3VyY2UgdmFsdWUgdG8gdGhlIHN0YWNrIG9mIHRyYXZlcnNlZCBvYmplY3RzIGFuZCBhc3NvY2lhdGUgaXQgd2l0aCBpdHMgY2xvbmUuXG4gIHN0YWNrQS5wdXNoKHZhbHVlKTtcbiAgc3RhY2tCLnB1c2gocmVzdWx0KTtcblxuICAvLyBSZWN1cnNpdmVseSBwb3B1bGF0ZSBjbG9uZSAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAoaXNBcnIgPyBhcnJheUVhY2ggOiBiYXNlRm9yT3duKSh2YWx1ZSwgZnVuY3Rpb24oc3ViVmFsdWUsIGtleSkge1xuICAgIHJlc3VsdFtrZXldID0gYmFzZUNsb25lKHN1YlZhbHVlLCBpc0RlZXAsIGN1c3RvbWl6ZXIsIGtleSwgdmFsdWUsIHN0YWNrQSwgc3RhY2tCKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUNsb25lO1xuIiwiLyoqXG4gKiBDb3BpZXMgcHJvcGVydGllcyBvZiBgc291cmNlYCB0byBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIGNvcHkgcHJvcGVydGllcyBmcm9tLlxuICogQHBhcmFtIHtBcnJheX0gcHJvcHMgVGhlIHByb3BlcnR5IG5hbWVzIHRvIGNvcHkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdD17fV0gVGhlIG9iamVjdCB0byBjb3B5IHByb3BlcnRpZXMgdG8uXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlQ29weShzb3VyY2UsIHByb3BzLCBvYmplY3QpIHtcbiAgb2JqZWN0IHx8IChvYmplY3QgPSB7fSk7XG5cbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuICAgIG9iamVjdFtrZXldID0gc291cmNlW2tleV07XG4gIH1cbiAgcmV0dXJuIG9iamVjdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlQ29weTtcbiIsInZhciBiYXNlRm9yT3duID0gcmVxdWlyZSgnLi9iYXNlRm9yT3duJyksXG4gICAgY3JlYXRlQmFzZUVhY2ggPSByZXF1aXJlKCcuL2NyZWF0ZUJhc2VFYWNoJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uZm9yRWFjaGAgd2l0aG91dCBzdXBwb3J0IGZvciBjYWxsYmFja1xuICogc2hvcnRoYW5kcyBhbmQgYHRoaXNgIGJpbmRpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gY29sbGVjdGlvbiBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fE9iamVjdHxzdHJpbmd9IFJldHVybnMgYGNvbGxlY3Rpb25gLlxuICovXG52YXIgYmFzZUVhY2ggPSBjcmVhdGVCYXNlRWFjaChiYXNlRm9yT3duKTtcblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRWFjaDtcbiIsInZhciBjcmVhdGVCYXNlRm9yID0gcmVxdWlyZSgnLi9jcmVhdGVCYXNlRm9yJyk7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGJhc2VGb3JJbmAgYW5kIGBiYXNlRm9yT3duYCB3aGljaCBpdGVyYXRlc1xuICogb3ZlciBgb2JqZWN0YCBwcm9wZXJ0aWVzIHJldHVybmVkIGJ5IGBrZXlzRnVuY2AgaW52b2tpbmcgYGl0ZXJhdGVlYCBmb3JcbiAqIGVhY2ggcHJvcGVydHkuIEl0ZXJhdGVlIGZ1bmN0aW9ucyBtYXkgZXhpdCBpdGVyYXRpb24gZWFybHkgYnkgZXhwbGljaXRseVxuICogcmV0dXJuaW5nIGBmYWxzZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5c0Z1bmMgVGhlIGZ1bmN0aW9uIHRvIGdldCB0aGUga2V5cyBvZiBgb2JqZWN0YC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKi9cbnZhciBiYXNlRm9yID0gY3JlYXRlQmFzZUZvcigpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGb3I7XG4iLCJ2YXIgYmFzZUZvciA9IHJlcXVpcmUoJy4vYmFzZUZvcicpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4uL29iamVjdC9rZXlzSW4nKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5mb3JJbmAgd2l0aG91dCBzdXBwb3J0IGZvciBjYWxsYmFja1xuICogc2hvcnRoYW5kcyBhbmQgYHRoaXNgIGJpbmRpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUZvckluKG9iamVjdCwgaXRlcmF0ZWUpIHtcbiAgcmV0dXJuIGJhc2VGb3Iob2JqZWN0LCBpdGVyYXRlZSwga2V5c0luKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlRm9ySW47XG4iLCJ2YXIgYmFzZUZvciA9IHJlcXVpcmUoJy4vYmFzZUZvcicpLFxuICAgIGtleXMgPSByZXF1aXJlKCcuLi9vYmplY3Qva2V5cycpO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmZvck93bmAgd2l0aG91dCBzdXBwb3J0IGZvciBjYWxsYmFja1xuICogc2hvcnRoYW5kcyBhbmQgYHRoaXNgIGJpbmRpbmcuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqL1xuZnVuY3Rpb24gYmFzZUZvck93bihvYmplY3QsIGl0ZXJhdGVlKSB7XG4gIHJldHVybiBiYXNlRm9yKG9iamVjdCwgaXRlcmF0ZWUsIGtleXMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VGb3JPd247XG4iLCJ2YXIgYXJyYXlFYWNoID0gcmVxdWlyZSgnLi9hcnJheUVhY2gnKSxcbiAgICBiYXNlTWVyZ2VEZWVwID0gcmVxdWlyZSgnLi9iYXNlTWVyZ2VEZWVwJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4uL2xhbmcvaXNBcnJheScpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vbGFuZy9pc09iamVjdCcpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyksXG4gICAgaXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi4vbGFuZy9pc1R5cGVkQXJyYXknKSxcbiAgICBrZXlzID0gcmVxdWlyZSgnLi4vb2JqZWN0L2tleXMnKTtcblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5tZXJnZWAgd2l0aG91dCBzdXBwb3J0IGZvciBhcmd1bWVudCBqdWdnbGluZyxcbiAqIG11bHRpcGxlIHNvdXJjZXMsIGFuZCBgdGhpc2AgYmluZGluZyBgY3VzdG9taXplcmAgZnVuY3Rpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgbWVyZ2VkIHZhbHVlcy5cbiAqIEBwYXJhbSB7QXJyYXl9IFtzdGFja0E9W11dIFRyYWNrcyB0cmF2ZXJzZWQgc291cmNlIG9iamVjdHMuXG4gKiBAcGFyYW0ge0FycmF5fSBbc3RhY2tCPVtdXSBBc3NvY2lhdGVzIHZhbHVlcyB3aXRoIHNvdXJjZSBjb3VudGVycGFydHMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBiYXNlTWVyZ2Uob2JqZWN0LCBzb3VyY2UsIGN1c3RvbWl6ZXIsIHN0YWNrQSwgc3RhY2tCKSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBvYmplY3Q7XG4gIH1cbiAgdmFyIGlzU3JjQXJyID0gaXNBcnJheUxpa2Uoc291cmNlKSAmJiAoaXNBcnJheShzb3VyY2UpIHx8IGlzVHlwZWRBcnJheShzb3VyY2UpKSxcbiAgICAgIHByb3BzID0gaXNTcmNBcnIgPyB1bmRlZmluZWQgOiBrZXlzKHNvdXJjZSk7XG5cbiAgYXJyYXlFYWNoKHByb3BzIHx8IHNvdXJjZSwgZnVuY3Rpb24oc3JjVmFsdWUsIGtleSkge1xuICAgIGlmIChwcm9wcykge1xuICAgICAga2V5ID0gc3JjVmFsdWU7XG4gICAgICBzcmNWYWx1ZSA9IHNvdXJjZVtrZXldO1xuICAgIH1cbiAgICBpZiAoaXNPYmplY3RMaWtlKHNyY1ZhbHVlKSkge1xuICAgICAgc3RhY2tBIHx8IChzdGFja0EgPSBbXSk7XG4gICAgICBzdGFja0IgfHwgKHN0YWNrQiA9IFtdKTtcbiAgICAgIGJhc2VNZXJnZURlZXAob2JqZWN0LCBzb3VyY2UsIGtleSwgYmFzZU1lcmdlLCBjdXN0b21pemVyLCBzdGFja0EsIHN0YWNrQik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgICAgcmVzdWx0ID0gY3VzdG9taXplciA/IGN1c3RvbWl6ZXIodmFsdWUsIHNyY1ZhbHVlLCBrZXksIG9iamVjdCwgc291cmNlKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICBpc0NvbW1vbiA9IHJlc3VsdCA9PT0gdW5kZWZpbmVkO1xuXG4gICAgICBpZiAoaXNDb21tb24pIHtcbiAgICAgICAgcmVzdWx0ID0gc3JjVmFsdWU7XG4gICAgICB9XG4gICAgICBpZiAoKHJlc3VsdCAhPT0gdW5kZWZpbmVkIHx8IChpc1NyY0FyciAmJiAhKGtleSBpbiBvYmplY3QpKSkgJiZcbiAgICAgICAgICAoaXNDb21tb24gfHwgKHJlc3VsdCA9PT0gcmVzdWx0ID8gKHJlc3VsdCAhPT0gdmFsdWUpIDogKHZhbHVlID09PSB2YWx1ZSkpKSkge1xuICAgICAgICBvYmplY3Rba2V5XSA9IHJlc3VsdDtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2JqZWN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VNZXJnZTtcbiIsInZhciBhcnJheUNvcHkgPSByZXF1aXJlKCcuL2FycmF5Q29weScpLFxuICAgIGlzQXJndW1lbnRzID0gcmVxdWlyZSgnLi4vbGFuZy9pc0FyZ3VtZW50cycpLFxuICAgIGlzQXJyYXkgPSByZXF1aXJlKCcuLi9sYW5nL2lzQXJyYXknKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKSxcbiAgICBpc1BsYWluT2JqZWN0ID0gcmVxdWlyZSgnLi4vbGFuZy9pc1BsYWluT2JqZWN0JyksXG4gICAgaXNUeXBlZEFycmF5ID0gcmVxdWlyZSgnLi4vbGFuZy9pc1R5cGVkQXJyYXknKSxcbiAgICB0b1BsYWluT2JqZWN0ID0gcmVxdWlyZSgnLi4vbGFuZy90b1BsYWluT2JqZWN0Jyk7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlTWVyZ2VgIGZvciBhcnJheXMgYW5kIG9iamVjdHMgd2hpY2ggcGVyZm9ybXNcbiAqIGRlZXAgbWVyZ2VzIGFuZCB0cmFja3MgdHJhdmVyc2VkIG9iamVjdHMgZW5hYmxpbmcgb2JqZWN0cyB3aXRoIGNpcmN1bGFyXG4gKiByZWZlcmVuY2VzIHRvIGJlIG1lcmdlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgc291cmNlIG9iamVjdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gbWVyZ2UuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBtZXJnZUZ1bmMgVGhlIGZ1bmN0aW9uIHRvIG1lcmdlIHZhbHVlcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIG1lcmdlZCB2YWx1ZXMuXG4gKiBAcGFyYW0ge0FycmF5fSBbc3RhY2tBPVtdXSBUcmFja3MgdHJhdmVyc2VkIHNvdXJjZSBvYmplY3RzLlxuICogQHBhcmFtIHtBcnJheX0gW3N0YWNrQj1bXV0gQXNzb2NpYXRlcyB2YWx1ZXMgd2l0aCBzb3VyY2UgY291bnRlcnBhcnRzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3RzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VNZXJnZURlZXAob2JqZWN0LCBzb3VyY2UsIGtleSwgbWVyZ2VGdW5jLCBjdXN0b21pemVyLCBzdGFja0EsIHN0YWNrQikge1xuICB2YXIgbGVuZ3RoID0gc3RhY2tBLmxlbmd0aCxcbiAgICAgIHNyY1ZhbHVlID0gc291cmNlW2tleV07XG5cbiAgd2hpbGUgKGxlbmd0aC0tKSB7XG4gICAgaWYgKHN0YWNrQVtsZW5ndGhdID09IHNyY1ZhbHVlKSB7XG4gICAgICBvYmplY3Rba2V5XSA9IHN0YWNrQltsZW5ndGhdO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICB2YXIgdmFsdWUgPSBvYmplY3Rba2V5XSxcbiAgICAgIHJlc3VsdCA9IGN1c3RvbWl6ZXIgPyBjdXN0b21pemVyKHZhbHVlLCBzcmNWYWx1ZSwga2V5LCBvYmplY3QsIHNvdXJjZSkgOiB1bmRlZmluZWQsXG4gICAgICBpc0NvbW1vbiA9IHJlc3VsdCA9PT0gdW5kZWZpbmVkO1xuXG4gIGlmIChpc0NvbW1vbikge1xuICAgIHJlc3VsdCA9IHNyY1ZhbHVlO1xuICAgIGlmIChpc0FycmF5TGlrZShzcmNWYWx1ZSkgJiYgKGlzQXJyYXkoc3JjVmFsdWUpIHx8IGlzVHlwZWRBcnJheShzcmNWYWx1ZSkpKSB7XG4gICAgICByZXN1bHQgPSBpc0FycmF5KHZhbHVlKVxuICAgICAgICA/IHZhbHVlXG4gICAgICAgIDogKGlzQXJyYXlMaWtlKHZhbHVlKSA/IGFycmF5Q29weSh2YWx1ZSkgOiBbXSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzUGxhaW5PYmplY3Qoc3JjVmFsdWUpIHx8IGlzQXJndW1lbnRzKHNyY1ZhbHVlKSkge1xuICAgICAgcmVzdWx0ID0gaXNBcmd1bWVudHModmFsdWUpXG4gICAgICAgID8gdG9QbGFpbk9iamVjdCh2YWx1ZSlcbiAgICAgICAgOiAoaXNQbGFpbk9iamVjdCh2YWx1ZSkgPyB2YWx1ZSA6IHt9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBpc0NvbW1vbiA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICAvLyBBZGQgdGhlIHNvdXJjZSB2YWx1ZSB0byB0aGUgc3RhY2sgb2YgdHJhdmVyc2VkIG9iamVjdHMgYW5kIGFzc29jaWF0ZVxuICAvLyBpdCB3aXRoIGl0cyBtZXJnZWQgdmFsdWUuXG4gIHN0YWNrQS5wdXNoKHNyY1ZhbHVlKTtcbiAgc3RhY2tCLnB1c2gocmVzdWx0KTtcblxuICBpZiAoaXNDb21tb24pIHtcbiAgICAvLyBSZWN1cnNpdmVseSBtZXJnZSBvYmplY3RzIGFuZCBhcnJheXMgKHN1c2NlcHRpYmxlIHRvIGNhbGwgc3RhY2sgbGltaXRzKS5cbiAgICBvYmplY3Rba2V5XSA9IG1lcmdlRnVuYyhyZXN1bHQsIHNyY1ZhbHVlLCBjdXN0b21pemVyLCBzdGFja0EsIHN0YWNrQik7XG4gIH0gZWxzZSBpZiAocmVzdWx0ID09PSByZXN1bHQgPyAocmVzdWx0ICE9PSB2YWx1ZSkgOiAodmFsdWUgPT09IHZhbHVlKSkge1xuICAgIG9iamVjdFtrZXldID0gcmVzdWx0O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZU1lcmdlRGVlcDtcbiIsIi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHJvcGVydHlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVByb3BlcnR5KGtleSkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVByb3BlcnR5O1xuIiwidmFyIGlkZW50aXR5ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9pZGVudGl0eScpO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUNhbGxiYWNrYCB3aGljaCBvbmx5IHN1cHBvcnRzIGB0aGlzYCBiaW5kaW5nXG4gKiBhbmQgc3BlY2lmeWluZyB0aGUgbnVtYmVyIG9mIGFyZ3VtZW50cyB0byBwcm92aWRlIHRvIGBmdW5jYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYmluZC5cbiAqIEBwYXJhbSB7Kn0gdGhpc0FyZyBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGZ1bmNgLlxuICogQHBhcmFtIHtudW1iZXJ9IFthcmdDb3VudF0gVGhlIG51bWJlciBvZiBhcmd1bWVudHMgdG8gcHJvdmlkZSB0byBgZnVuY2AuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIGNhbGxiYWNrLlxuICovXG5mdW5jdGlvbiBiaW5kQ2FsbGJhY2soZnVuYywgdGhpc0FyZywgYXJnQ291bnQpIHtcbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gaWRlbnRpdHk7XG4gIH1cbiAgaWYgKHRoaXNBcmcgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmdW5jO1xuICB9XG4gIHN3aXRjaCAoYXJnQ291bnQpIHtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCB2YWx1ZSk7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgdmFsdWUsIGluZGV4LCBjb2xsZWN0aW9uKTtcbiAgICB9O1xuICAgIGNhc2UgNDogcmV0dXJuIGZ1bmN0aW9uKGFjY3VtdWxhdG9yLCB2YWx1ZSwgaW5kZXgsIGNvbGxlY3Rpb24pIHtcbiAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYWNjdW11bGF0b3IsIHZhbHVlLCBpbmRleCwgY29sbGVjdGlvbik7XG4gICAgfTtcbiAgICBjYXNlIDU6IHJldHVybiBmdW5jdGlvbih2YWx1ZSwgb3RoZXIsIGtleSwgb2JqZWN0LCBzb3VyY2UpIHtcbiAgICAgIHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgdmFsdWUsIG90aGVyLCBrZXksIG9iamVjdCwgc291cmNlKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmd1bWVudHMpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJpbmRDYWxsYmFjaztcbiIsIi8qKiBOYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgQXJyYXlCdWZmZXIgPSBnbG9iYWwuQXJyYXlCdWZmZXIsXG4gICAgVWludDhBcnJheSA9IGdsb2JhbC5VaW50OEFycmF5O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGUgZ2l2ZW4gYXJyYXkgYnVmZmVyLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5QnVmZmVyfSBidWZmZXIgVGhlIGFycmF5IGJ1ZmZlciB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtBcnJheUJ1ZmZlcn0gUmV0dXJucyB0aGUgY2xvbmVkIGFycmF5IGJ1ZmZlci5cbiAqL1xuZnVuY3Rpb24gYnVmZmVyQ2xvbmUoYnVmZmVyKSB7XG4gIHZhciByZXN1bHQgPSBuZXcgQXJyYXlCdWZmZXIoYnVmZmVyLmJ5dGVMZW5ndGgpLFxuICAgICAgdmlldyA9IG5ldyBVaW50OEFycmF5KHJlc3VsdCk7XG5cbiAgdmlldy5zZXQobmV3IFVpbnQ4QXJyYXkoYnVmZmVyKSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYnVmZmVyQ2xvbmU7XG4iLCJ2YXIgYmluZENhbGxiYWNrID0gcmVxdWlyZSgnLi9iaW5kQ2FsbGJhY2snKSxcbiAgICBpc0l0ZXJhdGVlQ2FsbCA9IHJlcXVpcmUoJy4vaXNJdGVyYXRlZUNhbGwnKSxcbiAgICByZXN0UGFyYW0gPSByZXF1aXJlKCcuLi9mdW5jdGlvbi9yZXN0UGFyYW0nKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgYF8uYXNzaWduYCwgYF8uZGVmYXVsdHNgLCBvciBgXy5tZXJnZWAgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGFzc2lnbmVyIFRoZSBmdW5jdGlvbiB0byBhc3NpZ24gdmFsdWVzLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYXNzaWduZXIgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUFzc2lnbmVyKGFzc2lnbmVyKSB7XG4gIHJldHVybiByZXN0UGFyYW0oZnVuY3Rpb24ob2JqZWN0LCBzb3VyY2VzKSB7XG4gICAgdmFyIGluZGV4ID0gLTEsXG4gICAgICAgIGxlbmd0aCA9IG9iamVjdCA9PSBudWxsID8gMCA6IHNvdXJjZXMubGVuZ3RoLFxuICAgICAgICBjdXN0b21pemVyID0gbGVuZ3RoID4gMiA/IHNvdXJjZXNbbGVuZ3RoIC0gMl0gOiB1bmRlZmluZWQsXG4gICAgICAgIGd1YXJkID0gbGVuZ3RoID4gMiA/IHNvdXJjZXNbMl0gOiB1bmRlZmluZWQsXG4gICAgICAgIHRoaXNBcmcgPSBsZW5ndGggPiAxID8gc291cmNlc1tsZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcblxuICAgIGlmICh0eXBlb2YgY3VzdG9taXplciA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjdXN0b21pemVyID0gYmluZENhbGxiYWNrKGN1c3RvbWl6ZXIsIHRoaXNBcmcsIDUpO1xuICAgICAgbGVuZ3RoIC09IDI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1c3RvbWl6ZXIgPSB0eXBlb2YgdGhpc0FyZyA9PSAnZnVuY3Rpb24nID8gdGhpc0FyZyA6IHVuZGVmaW5lZDtcbiAgICAgIGxlbmd0aCAtPSAoY3VzdG9taXplciA/IDEgOiAwKTtcbiAgICB9XG4gICAgaWYgKGd1YXJkICYmIGlzSXRlcmF0ZWVDYWxsKHNvdXJjZXNbMF0sIHNvdXJjZXNbMV0sIGd1YXJkKSkge1xuICAgICAgY3VzdG9taXplciA9IGxlbmd0aCA8IDMgPyB1bmRlZmluZWQgOiBjdXN0b21pemVyO1xuICAgICAgbGVuZ3RoID0gMTtcbiAgICB9XG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciBzb3VyY2UgPSBzb3VyY2VzW2luZGV4XTtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgYXNzaWduZXIob2JqZWN0LCBzb3VyY2UsIGN1c3RvbWl6ZXIpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVBc3NpZ25lcjtcbiIsInZhciBnZXRMZW5ndGggPSByZXF1aXJlKCcuL2dldExlbmd0aCcpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpLFxuICAgIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi90b09iamVjdCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBgYmFzZUVhY2hgIG9yIGBiYXNlRWFjaFJpZ2h0YCBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZWFjaEZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGl0ZXJhdGUgb3ZlciBhIGNvbGxlY3Rpb24uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGJhc2UgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VFYWNoKGVhY2hGdW5jLCBmcm9tUmlnaHQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKSB7XG4gICAgdmFyIGxlbmd0aCA9IGNvbGxlY3Rpb24gPyBnZXRMZW5ndGgoY29sbGVjdGlvbikgOiAwO1xuICAgIGlmICghaXNMZW5ndGgobGVuZ3RoKSkge1xuICAgICAgcmV0dXJuIGVhY2hGdW5jKGNvbGxlY3Rpb24sIGl0ZXJhdGVlKTtcbiAgICB9XG4gICAgdmFyIGluZGV4ID0gZnJvbVJpZ2h0ID8gbGVuZ3RoIDogLTEsXG4gICAgICAgIGl0ZXJhYmxlID0gdG9PYmplY3QoY29sbGVjdGlvbik7XG5cbiAgICB3aGlsZSAoKGZyb21SaWdodCA/IGluZGV4LS0gOiArK2luZGV4IDwgbGVuZ3RoKSkge1xuICAgICAgaWYgKGl0ZXJhdGVlKGl0ZXJhYmxlW2luZGV4XSwgaW5kZXgsIGl0ZXJhYmxlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUJhc2VFYWNoO1xuIiwidmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi90b09iamVjdCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBiYXNlIGZ1bmN0aW9uIGZvciBgXy5mb3JJbmAgb3IgYF8uZm9ySW5SaWdodGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zyb21SaWdodF0gU3BlY2lmeSBpdGVyYXRpbmcgZnJvbSByaWdodCB0byBsZWZ0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgYmFzZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlQmFzZUZvcihmcm9tUmlnaHQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCwgaXRlcmF0ZWUsIGtleXNGdW5jKSB7XG4gICAgdmFyIGl0ZXJhYmxlID0gdG9PYmplY3Qob2JqZWN0KSxcbiAgICAgICAgcHJvcHMgPSBrZXlzRnVuYyhvYmplY3QpLFxuICAgICAgICBsZW5ndGggPSBwcm9wcy5sZW5ndGgsXG4gICAgICAgIGluZGV4ID0gZnJvbVJpZ2h0ID8gbGVuZ3RoIDogLTE7XG5cbiAgICB3aGlsZSAoKGZyb21SaWdodCA/IGluZGV4LS0gOiArK2luZGV4IDwgbGVuZ3RoKSkge1xuICAgICAgdmFyIGtleSA9IHByb3BzW2luZGV4XTtcbiAgICAgIGlmIChpdGVyYXRlZShpdGVyYWJsZVtrZXldLCBrZXksIGl0ZXJhYmxlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlQmFzZUZvcjtcbiIsInZhciByZXN0UGFyYW0gPSByZXF1aXJlKCcuLi9mdW5jdGlvbi9yZXN0UGFyYW0nKTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgYF8uZGVmYXVsdHNgIG9yIGBfLmRlZmF1bHRzRGVlcGAgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGFzc2lnbmVyIFRoZSBmdW5jdGlvbiB0byBhc3NpZ24gdmFsdWVzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGFzc2lnbmVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGRlZmF1bHRzIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVEZWZhdWx0cyhhc3NpZ25lciwgY3VzdG9taXplcikge1xuICByZXR1cm4gcmVzdFBhcmFtKGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICB2YXIgb2JqZWN0ID0gYXJnc1swXTtcbiAgICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfVxuICAgIGFyZ3MucHVzaChjdXN0b21pemVyKTtcbiAgICByZXR1cm4gYXNzaWduZXIuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlRGVmYXVsdHM7XG4iLCJ2YXIgYmluZENhbGxiYWNrID0gcmVxdWlyZSgnLi9iaW5kQ2FsbGJhY2snKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi4vbGFuZy9pc0FycmF5Jyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIGZvciBgXy5mb3JFYWNoYCBvciBgXy5mb3JFYWNoUmlnaHRgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBhcnJheUZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGl0ZXJhdGUgb3ZlciBhbiBhcnJheS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVhY2hGdW5jIFRoZSBmdW5jdGlvbiB0byBpdGVyYXRlIG92ZXIgYSBjb2xsZWN0aW9uLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZWFjaCBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlRm9yRWFjaChhcnJheUZ1bmMsIGVhY2hGdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbihjb2xsZWN0aW9uLCBpdGVyYXRlZSwgdGhpc0FyZykge1xuICAgIHJldHVybiAodHlwZW9mIGl0ZXJhdGVlID09ICdmdW5jdGlvbicgJiYgdGhpc0FyZyA9PT0gdW5kZWZpbmVkICYmIGlzQXJyYXkoY29sbGVjdGlvbikpXG4gICAgICA/IGFycmF5RnVuYyhjb2xsZWN0aW9uLCBpdGVyYXRlZSlcbiAgICAgIDogZWFjaEZ1bmMoY29sbGVjdGlvbiwgYmluZENhbGxiYWNrKGl0ZXJhdGVlLCB0aGlzQXJnLCAzKSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlRm9yRWFjaDtcbiIsInZhciBiYXNlUHJvcGVydHkgPSByZXF1aXJlKCcuL2Jhc2VQcm9wZXJ0eScpO1xuXG4vKipcbiAqIEdldHMgdGhlIFwibGVuZ3RoXCIgcHJvcGVydHkgdmFsdWUgb2YgYG9iamVjdGAuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBhdm9pZCBhIFtKSVQgYnVnXShodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTQyNzkyKVxuICogdGhhdCBhZmZlY3RzIFNhZmFyaSBvbiBhdCBsZWFzdCBpT1MgOC4xLTguMyBBUk02NC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIFwibGVuZ3RoXCIgdmFsdWUuXG4gKi9cbnZhciBnZXRMZW5ndGggPSBiYXNlUHJvcGVydHkoJ2xlbmd0aCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldExlbmd0aDtcbiIsInZhciBpc05hdGl2ZSA9IHJlcXVpcmUoJy4uL2xhbmcvaXNOYXRpdmUnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSBuYXRpdmUgZnVuY3Rpb24gYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgbWV0aG9kIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBpZiBpdCdzIG5hdGl2ZSwgZWxzZSBgdW5kZWZpbmVkYC5cbiAqL1xuZnVuY3Rpb24gZ2V0TmF0aXZlKG9iamVjdCwga2V5KSB7XG4gIHZhciB2YWx1ZSA9IG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIHJldHVybiBpc05hdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXROYXRpdmU7XG4iLCIvKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBJbml0aWFsaXplcyBhbiBhcnJheSBjbG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGNsb25lLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBpbml0aWFsaXplZCBjbG9uZS5cbiAqL1xuZnVuY3Rpb24gaW5pdENsb25lQXJyYXkoYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIHJlc3VsdCA9IG5ldyBhcnJheS5jb25zdHJ1Y3RvcihsZW5ndGgpO1xuXG4gIC8vIEFkZCBhcnJheSBwcm9wZXJ0aWVzIGFzc2lnbmVkIGJ5IGBSZWdFeHAjZXhlY2AuXG4gIGlmIChsZW5ndGggJiYgdHlwZW9mIGFycmF5WzBdID09ICdzdHJpbmcnICYmIGhhc093blByb3BlcnR5LmNhbGwoYXJyYXksICdpbmRleCcpKSB7XG4gICAgcmVzdWx0LmluZGV4ID0gYXJyYXkuaW5kZXg7XG4gICAgcmVzdWx0LmlucHV0ID0gYXJyYXkuaW5wdXQ7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbml0Q2xvbmVBcnJheTtcbiIsInZhciBidWZmZXJDbG9uZSA9IHJlcXVpcmUoJy4vYnVmZmVyQ2xvbmUnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGJvb2xUYWcgPSAnW29iamVjdCBCb29sZWFuXScsXG4gICAgZGF0ZVRhZyA9ICdbb2JqZWN0IERhdGVdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBmbG9hdDMyVGFnID0gJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgZmxvYXQ2NFRhZyA9ICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nLFxuICAgIGludDhUYWcgPSAnW29iamVjdCBJbnQ4QXJyYXldJyxcbiAgICBpbnQxNlRhZyA9ICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICBpbnQzMlRhZyA9ICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICB1aW50OFRhZyA9ICdbb2JqZWN0IFVpbnQ4QXJyYXldJyxcbiAgICB1aW50OENsYW1wZWRUYWcgPSAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgIHVpbnQxNlRhZyA9ICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgdWludDMyVGFnID0gJ1tvYmplY3QgVWludDMyQXJyYXldJztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggYFJlZ0V4cGAgZmxhZ3MgZnJvbSB0aGVpciBjb2VyY2VkIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVGbGFncyA9IC9cXHcqJC87XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgYW4gb2JqZWN0IGNsb25lIGJhc2VkIG9uIGl0cyBgdG9TdHJpbmdUYWdgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIG9ubHkgc3VwcG9ydHMgY2xvbmluZyB2YWx1ZXMgd2l0aCB0YWdzIG9mXG4gKiBgQm9vbGVhbmAsIGBEYXRlYCwgYEVycm9yYCwgYE51bWJlcmAsIGBSZWdFeHBgLCBvciBgU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNsb25lLlxuICogQHBhcmFtIHtzdHJpbmd9IHRhZyBUaGUgYHRvU3RyaW5nVGFnYCBvZiB0aGUgb2JqZWN0IHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGluaXRpYWxpemVkIGNsb25lLlxuICovXG5mdW5jdGlvbiBpbml0Q2xvbmVCeVRhZyhvYmplY3QsIHRhZywgaXNEZWVwKSB7XG4gIHZhciBDdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yO1xuICBzd2l0Y2ggKHRhZykge1xuICAgIGNhc2UgYXJyYXlCdWZmZXJUYWc6XG4gICAgICByZXR1cm4gYnVmZmVyQ2xvbmUob2JqZWN0KTtcblxuICAgIGNhc2UgYm9vbFRhZzpcbiAgICBjYXNlIGRhdGVUYWc6XG4gICAgICByZXR1cm4gbmV3IEN0b3IoK29iamVjdCk7XG5cbiAgICBjYXNlIGZsb2F0MzJUYWc6IGNhc2UgZmxvYXQ2NFRhZzpcbiAgICBjYXNlIGludDhUYWc6IGNhc2UgaW50MTZUYWc6IGNhc2UgaW50MzJUYWc6XG4gICAgY2FzZSB1aW50OFRhZzogY2FzZSB1aW50OENsYW1wZWRUYWc6IGNhc2UgdWludDE2VGFnOiBjYXNlIHVpbnQzMlRhZzpcbiAgICAgIHZhciBidWZmZXIgPSBvYmplY3QuYnVmZmVyO1xuICAgICAgcmV0dXJuIG5ldyBDdG9yKGlzRGVlcCA/IGJ1ZmZlckNsb25lKGJ1ZmZlcikgOiBidWZmZXIsIG9iamVjdC5ieXRlT2Zmc2V0LCBvYmplY3QubGVuZ3RoKTtcblxuICAgIGNhc2UgbnVtYmVyVGFnOlxuICAgIGNhc2Ugc3RyaW5nVGFnOlxuICAgICAgcmV0dXJuIG5ldyBDdG9yKG9iamVjdCk7XG5cbiAgICBjYXNlIHJlZ2V4cFRhZzpcbiAgICAgIHZhciByZXN1bHQgPSBuZXcgQ3RvcihvYmplY3Quc291cmNlLCByZUZsYWdzLmV4ZWMob2JqZWN0KSk7XG4gICAgICByZXN1bHQubGFzdEluZGV4ID0gb2JqZWN0Lmxhc3RJbmRleDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXRDbG9uZUJ5VGFnO1xuIiwiLyoqXG4gKiBJbml0aWFsaXplcyBhbiBvYmplY3QgY2xvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjbG9uZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGluaXRpYWxpemVkIGNsb25lLlxuICovXG5mdW5jdGlvbiBpbml0Q2xvbmVPYmplY3Qob2JqZWN0KSB7XG4gIHZhciBDdG9yID0gb2JqZWN0LmNvbnN0cnVjdG9yO1xuICBpZiAoISh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IgaW5zdGFuY2VvZiBDdG9yKSkge1xuICAgIEN0b3IgPSBPYmplY3Q7XG4gIH1cbiAgcmV0dXJuIG5ldyBDdG9yO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluaXRDbG9uZU9iamVjdDtcbiIsInZhciBnZXRMZW5ndGggPSByZXF1aXJlKCcuL2dldExlbmd0aCcpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aChnZXRMZW5ndGgodmFsdWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5TGlrZTtcbiIsIi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eXFxkKyQvO1xuXG4vKipcbiAqIFVzZWQgYXMgdGhlIFttYXhpbXVtIGxlbmd0aF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtbnVtYmVyLm1heF9zYWZlX2ludGVnZXIpXG4gKiBvZiBhbiBhcnJheS1saWtlIHZhbHVlLlxuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIHZhbHVlID0gKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fCByZUlzVWludC50ZXN0KHZhbHVlKSkgPyArdmFsdWUgOiAtMTtcbiAgbGVuZ3RoID0gbGVuZ3RoID09IG51bGwgPyBNQVhfU0FGRV9JTlRFR0VSIDogbGVuZ3RoO1xuICByZXR1cm4gdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0luZGV4O1xuIiwidmFyIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi9pc0FycmF5TGlrZScpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuL2lzSW5kZXgnKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2xhbmcvaXNPYmplY3QnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgdGhlIHByb3ZpZGVkIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgdmFsdWUgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IGluZGV4IFRoZSBwb3RlbnRpYWwgaXRlcmF0ZWUgaW5kZXggb3Iga2V5IGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfSBvYmplY3QgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBvYmplY3QgYXJndW1lbnQuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGFyZ3VtZW50cyBhcmUgZnJvbSBhbiBpdGVyYXRlZSBjYWxsLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSXRlcmF0ZWVDYWxsKHZhbHVlLCBpbmRleCwgb2JqZWN0KSB7XG4gIGlmICghaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgdHlwZSA9IHR5cGVvZiBpbmRleDtcbiAgaWYgKHR5cGUgPT0gJ251bWJlcidcbiAgICAgID8gKGlzQXJyYXlMaWtlKG9iamVjdCkgJiYgaXNJbmRleChpbmRleCwgb2JqZWN0Lmxlbmd0aCkpXG4gICAgICA6ICh0eXBlID09ICdzdHJpbmcnICYmIGluZGV4IGluIG9iamVjdCkpIHtcbiAgICB2YXIgb3RoZXIgPSBvYmplY3RbaW5kZXhdO1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgPyAodmFsdWUgPT09IG90aGVyKSA6IChvdGhlciAhPT0gb3RoZXIpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0l0ZXJhdGVlQ2FsbDtcbiIsIi8qKlxuICogVXNlZCBhcyB0aGUgW21heGltdW0gbGVuZ3RoXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1udW1iZXIubWF4X3NhZmVfaW50ZWdlcilcbiAqIG9mIGFuIGFycmF5LWxpa2UgdmFsdWUuXG4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGFycmF5LWxpa2UgbGVuZ3RoLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIGZ1bmN0aW9uIGlzIGJhc2VkIG9uIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJiB2YWx1ZSA+IC0xICYmIHZhbHVlICUgMSA9PSAwICYmIHZhbHVlIDw9IE1BWF9TQUZFX0lOVEVHRVI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNMZW5ndGg7XG4iLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3RMaWtlO1xuIiwidmFyIG1lcmdlID0gcmVxdWlyZSgnLi4vb2JqZWN0L21lcmdlJyk7XG5cbi8qKlxuICogVXNlZCBieSBgXy5kZWZhdWx0c0RlZXBgIHRvIGN1c3RvbWl6ZSBpdHMgYF8ubWVyZ2VgIHVzZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSBvYmplY3RWYWx1ZSBUaGUgZGVzdGluYXRpb24gb2JqZWN0IHByb3BlcnR5IHZhbHVlLlxuICogQHBhcmFtIHsqfSBzb3VyY2VWYWx1ZSBUaGUgc291cmNlIG9iamVjdCBwcm9wZXJ0eSB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSB2YWx1ZSB0byBhc3NpZ24gdG8gdGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gbWVyZ2VEZWZhdWx0cyhvYmplY3RWYWx1ZSwgc291cmNlVmFsdWUpIHtcbiAgcmV0dXJuIG9iamVjdFZhbHVlID09PSB1bmRlZmluZWQgPyBzb3VyY2VWYWx1ZSA6IG1lcmdlKG9iamVjdFZhbHVlLCBzb3VyY2VWYWx1ZSwgbWVyZ2VEZWZhdWx0cyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWVyZ2VEZWZhdWx0cztcbiIsInZhciBpc0FyZ3VtZW50cyA9IHJlcXVpcmUoJy4uL2xhbmcvaXNBcmd1bWVudHMnKSxcbiAgICBpc0FycmF5ID0gcmVxdWlyZSgnLi4vbGFuZy9pc0FycmF5JyksXG4gICAgaXNJbmRleCA9IHJlcXVpcmUoJy4vaXNJbmRleCcpLFxuICAgIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi9pc0xlbmd0aCcpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4uL29iamVjdC9rZXlzSW4nKTtcblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogQSBmYWxsYmFjayBpbXBsZW1lbnRhdGlvbiBvZiBgT2JqZWN0LmtleXNgIHdoaWNoIGNyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlXG4gKiBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gc2hpbUtleXMob2JqZWN0KSB7XG4gIHZhciBwcm9wcyA9IGtleXNJbihvYmplY3QpLFxuICAgICAgcHJvcHNMZW5ndGggPSBwcm9wcy5sZW5ndGgsXG4gICAgICBsZW5ndGggPSBwcm9wc0xlbmd0aCAmJiBvYmplY3QubGVuZ3RoO1xuXG4gIHZhciBhbGxvd0luZGV4ZXMgPSAhIWxlbmd0aCAmJiBpc0xlbmd0aChsZW5ndGgpICYmXG4gICAgKGlzQXJyYXkob2JqZWN0KSB8fCBpc0FyZ3VtZW50cyhvYmplY3QpKTtcblxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IFtdO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgcHJvcHNMZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdO1xuICAgIGlmICgoYWxsb3dJbmRleGVzICYmIGlzSW5kZXgoa2V5LCBsZW5ndGgpKSB8fCBoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzaGltS2V5cztcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2xhbmcvaXNPYmplY3QnKTtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGFuIG9iamVjdCBpZiBpdCdzIG5vdCBvbmUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdCh2YWx1ZSkgPyB2YWx1ZSA6IE9iamVjdCh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9PYmplY3Q7XG4iLCJ2YXIgYmFzZUNsb25lID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvYmFzZUNsb25lJyksXG4gICAgYmluZENhbGxiYWNrID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvYmluZENhbGxiYWNrJyksXG4gICAgaXNJdGVyYXRlZUNhbGwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc0l0ZXJhdGVlQ2FsbCcpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBjbG9uZSBvZiBgdmFsdWVgLiBJZiBgaXNEZWVwYCBpcyBgdHJ1ZWAgbmVzdGVkIG9iamVjdHMgYXJlIGNsb25lZCxcbiAqIG90aGVyd2lzZSB0aGV5IGFyZSBhc3NpZ25lZCBieSByZWZlcmVuY2UuIElmIGBjdXN0b21pemVyYCBpcyBwcm92aWRlZCBpdCdzXG4gKiBpbnZva2VkIHRvIHByb2R1Y2UgdGhlIGNsb25lZCB2YWx1ZXMuIElmIGBjdXN0b21pemVyYCByZXR1cm5zIGB1bmRlZmluZWRgXG4gKiBjbG9uaW5nIGlzIGhhbmRsZWQgYnkgdGhlIG1ldGhvZCBpbnN0ZWFkLiBUaGUgYGN1c3RvbWl6ZXJgIGlzIGJvdW5kIHRvXG4gKiBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCB1cCB0byB0aHJlZSBhcmd1bWVudDsgKHZhbHVlIFssIGluZGV4fGtleSwgb2JqZWN0XSkuXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb24gdGhlXG4gKiBbc3RydWN0dXJlZCBjbG9uZSBhbGdvcml0aG1dKGh0dHA6Ly93d3cudzMub3JnL1RSL2h0bWw1L2luZnJhc3RydWN0dXJlLmh0bWwjaW50ZXJuYWwtc3RydWN0dXJlZC1jbG9uaW5nLWFsZ29yaXRobSkuXG4gKiBUaGUgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIGBhcmd1bWVudHNgIG9iamVjdHMgYW5kIG9iamVjdHMgY3JlYXRlZCBieVxuICogY29uc3RydWN0b3JzIG90aGVyIHRoYW4gYE9iamVjdGAgYXJlIGNsb25lZCB0byBwbGFpbiBgT2JqZWN0YCBvYmplY3RzLiBBblxuICogZW1wdHkgb2JqZWN0IGlzIHJldHVybmVkIGZvciB1bmNsb25lYWJsZSB2YWx1ZXMgc3VjaCBhcyBmdW5jdGlvbnMsIERPTSBub2RlcyxcbiAqIE1hcHMsIFNldHMsIGFuZCBXZWFrTWFwcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNsb25lLlxuICogQHBhcmFtIHtib29sZWFufSBbaXNEZWVwXSBTcGVjaWZ5IGEgZGVlcCBjbG9uZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNsb25pbmcgdmFsdWVzLlxuICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjdXN0b21pemVyYC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBjbG9uZWQgdmFsdWUuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciB1c2VycyA9IFtcbiAqICAgeyAndXNlcic6ICdiYXJuZXknIH0sXG4gKiAgIHsgJ3VzZXInOiAnZnJlZCcgfVxuICogXTtcbiAqXG4gKiB2YXIgc2hhbGxvdyA9IF8uY2xvbmUodXNlcnMpO1xuICogc2hhbGxvd1swXSA9PT0gdXNlcnNbMF07XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogdmFyIGRlZXAgPSBfLmNsb25lKHVzZXJzLCB0cnVlKTtcbiAqIGRlZXBbMF0gPT09IHVzZXJzWzBdO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiAvLyB1c2luZyBhIGN1c3RvbWl6ZXIgY2FsbGJhY2tcbiAqIHZhciBlbCA9IF8uY2xvbmUoZG9jdW1lbnQuYm9keSwgZnVuY3Rpb24odmFsdWUpIHtcbiAqICAgaWYgKF8uaXNFbGVtZW50KHZhbHVlKSkge1xuICogICAgIHJldHVybiB2YWx1ZS5jbG9uZU5vZGUoZmFsc2UpO1xuICogICB9XG4gKiB9KTtcbiAqXG4gKiBlbCA9PT0gZG9jdW1lbnQuYm9keVxuICogLy8gPT4gZmFsc2VcbiAqIGVsLm5vZGVOYW1lXG4gKiAvLyA9PiBCT0RZXG4gKiBlbC5jaGlsZE5vZGVzLmxlbmd0aDtcbiAqIC8vID0+IDBcbiAqL1xuZnVuY3Rpb24gY2xvbmUodmFsdWUsIGlzRGVlcCwgY3VzdG9taXplciwgdGhpc0FyZykge1xuICBpZiAoaXNEZWVwICYmIHR5cGVvZiBpc0RlZXAgIT0gJ2Jvb2xlYW4nICYmIGlzSXRlcmF0ZWVDYWxsKHZhbHVlLCBpc0RlZXAsIGN1c3RvbWl6ZXIpKSB7XG4gICAgaXNEZWVwID0gZmFsc2U7XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIGlzRGVlcCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhpc0FyZyA9IGN1c3RvbWl6ZXI7XG4gICAgY3VzdG9taXplciA9IGlzRGVlcDtcbiAgICBpc0RlZXAgPSBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHlwZW9mIGN1c3RvbWl6ZXIgPT0gJ2Z1bmN0aW9uJ1xuICAgID8gYmFzZUNsb25lKHZhbHVlLCBpc0RlZXAsIGJpbmRDYWxsYmFjayhjdXN0b21pemVyLCB0aGlzQXJnLCAzKSlcbiAgICA6IGJhc2VDbG9uZSh2YWx1ZSwgaXNEZWVwKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjbG9uZTtcbiIsInZhciBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzQXJyYXlMaWtlJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKiogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgYXJndW1lbnRzYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoZnVuY3Rpb24oKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhbMSwgMiwgM10pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcmd1bWVudHModmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaXNBcnJheUxpa2UodmFsdWUpICYmXG4gICAgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpICYmICFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcmd1bWVudHM7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvZ2V0TmF0aXZlJyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc0xlbmd0aCcpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXJyYXlUYWcgPSAnW29iamVjdCBBcnJheV0nO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVJc0FycmF5ID0gZ2V0TmF0aXZlKEFycmF5LCAnaXNBcnJheScpO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYEFycmF5YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNBcnJheShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheShmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5ID0gbmF0aXZlSXNBcnJheSB8fCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmIG9ialRvU3RyaW5nLmNhbGwodmFsdWUpID09IGFycmF5VGFnO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpc0FycmF5O1xuIiwidmFyIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzT2JqZWN0TGlrZScpLFxuICAgIGlzUGxhaW5PYmplY3QgPSByZXF1aXJlKCcuL2lzUGxhaW5PYmplY3QnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIERPTSBlbGVtZW50LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIERPTSBlbGVtZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNFbGVtZW50KGRvY3VtZW50LmJvZHkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNFbGVtZW50KCc8Ym9keT4nKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRWxlbWVudCh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB2YWx1ZS5ub2RlVHlwZSA9PT0gMSAmJiBpc09iamVjdExpa2UodmFsdWUpICYmICFpc1BsYWluT2JqZWN0KHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0VsZW1lbnQ7XG4iLCJ2YXIgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4vaXNBcnJheScpLFxuICAgIGlzQXJyYXlMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNBcnJheUxpa2UnKSxcbiAgICBpc0Z1bmN0aW9uID0gcmVxdWlyZSgnLi9pc0Z1bmN0aW9uJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNPYmplY3RMaWtlJyksXG4gICAgaXNTdHJpbmcgPSByZXF1aXJlKCcuL2lzU3RyaW5nJyksXG4gICAga2V5cyA9IHJlcXVpcmUoJy4uL29iamVjdC9rZXlzJyk7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgZW1wdHkuIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBlbXB0eSB1bmxlc3MgaXQncyBhblxuICogYGFyZ3VtZW50c2Agb2JqZWN0LCBhcnJheSwgc3RyaW5nLCBvciBqUXVlcnktbGlrZSBjb2xsZWN0aW9uIHdpdGggYSBsZW5ndGhcbiAqIGdyZWF0ZXIgdGhhbiBgMGAgb3IgYW4gb2JqZWN0IHdpdGggb3duIGVudW1lcmFibGUgcHJvcGVydGllcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fHN0cmluZ30gdmFsdWUgVGhlIHZhbHVlIHRvIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBlbXB0eSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRW1wdHkobnVsbCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0VtcHR5KHRydWUpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNFbXB0eSgxKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRW1wdHkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0VtcHR5KHsgJ2EnOiAxIH0pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNFbXB0eSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChpc0FycmF5TGlrZSh2YWx1ZSkgJiYgKGlzQXJyYXkodmFsdWUpIHx8IGlzU3RyaW5nKHZhbHVlKSB8fCBpc0FyZ3VtZW50cyh2YWx1ZSkgfHxcbiAgICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIGlzRnVuY3Rpb24odmFsdWUuc3BsaWNlKSkpKSB7XG4gICAgcmV0dXJuICF2YWx1ZS5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuICFrZXlzKHZhbHVlKS5sZW5ndGg7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNFbXB0eTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gb2xkZXIgdmVyc2lvbnMgb2YgQ2hyb21lIGFuZCBTYWZhcmkgd2hpY2ggcmV0dXJuICdmdW5jdGlvbicgZm9yIHJlZ2V4ZXNcbiAgLy8gYW5kIFNhZmFyaSA4IHdoaWNoIHJldHVybnMgJ29iamVjdCcgZm9yIHR5cGVkIGFycmF5IGNvbnN0cnVjdG9ycy5cbiAgcmV0dXJuIGlzT2JqZWN0KHZhbHVlKSAmJiBvYmpUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBmdW5jVGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRnVuY3Rpb247XG4iLCJ2YXIgaXNGdW5jdGlvbiA9IHJlcXVpcmUoJy4vaXNGdW5jdGlvbicpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaG9zdCBjb25zdHJ1Y3RvcnMgKFNhZmFyaSA+IDUpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZm5Ub1N0cmluZyA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGZuVG9TdHJpbmcuY2FsbChoYXNPd25Qcm9wZXJ0eSkucmVwbGFjZSgvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2csICdcXFxcJCYnKVxuICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24uXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNOYXRpdmUoQXJyYXkucHJvdG90eXBlLnB1c2gpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNOYXRpdmUoXyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc05hdGl2ZSh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICByZXR1cm4gcmVJc05hdGl2ZS50ZXN0KGZuVG9TdHJpbmcuY2FsbCh2YWx1ZSkpO1xuICB9XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIHJlSXNIb3N0Q3Rvci50ZXN0KHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc05hdGl2ZTtcbiIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlIFtsYW5ndWFnZSB0eXBlXShodHRwczovL2VzNS5naXRodWIuaW8vI3g4KSBvZiBgT2JqZWN0YC5cbiAqIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoMSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICAvLyBBdm9pZCBhIFY4IEpJVCBidWcgaW4gQ2hyb21lIDE5LTIwLlxuICAvLyBTZWUgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTIyOTEgZm9yIG1vcmUgZGV0YWlscy5cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3Q7XG4iLCJ2YXIgYmFzZUZvckluID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvYmFzZUZvckluJyksXG4gICAgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuL2lzQXJndW1lbnRzJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJztcblxuLyoqIFVzZWQgZm9yIG5hdGl2ZSBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZSBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9ialRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBwbGFpbiBvYmplY3QsIHRoYXQgaXMsIGFuIG9iamVjdCBjcmVhdGVkIGJ5IHRoZVxuICogYE9iamVjdGAgY29uc3RydWN0b3Igb3Igb25lIHdpdGggYSBgW1tQcm90b3R5cGVdXWAgb2YgYG51bGxgLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBhc3N1bWVzIG9iamVjdHMgY3JlYXRlZCBieSB0aGUgYE9iamVjdGAgY29uc3RydWN0b3JcbiAqIGhhdmUgbm8gaW5oZXJpdGVkIGVudW1lcmFibGUgcHJvcGVydGllcy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBwbGFpbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogfVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdChuZXcgRm9vKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc1BsYWluT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdCh7ICd4JzogMCwgJ3knOiAwIH0pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNQbGFpbk9iamVjdChPYmplY3QuY3JlYXRlKG51bGwpKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaXNQbGFpbk9iamVjdCh2YWx1ZSkge1xuICB2YXIgQ3RvcjtcblxuICAvLyBFeGl0IGVhcmx5IGZvciBub24gYE9iamVjdGAgb2JqZWN0cy5cbiAgaWYgKCEoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmpUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBvYmplY3RUYWcgJiYgIWlzQXJndW1lbnRzKHZhbHVlKSkgfHxcbiAgICAgICghaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ2NvbnN0cnVjdG9yJykgJiYgKEN0b3IgPSB2YWx1ZS5jb25zdHJ1Y3RvciwgdHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiAhKEN0b3IgaW5zdGFuY2VvZiBDdG9yKSkpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIElFIDwgOSBpdGVyYXRlcyBpbmhlcml0ZWQgcHJvcGVydGllcyBiZWZvcmUgb3duIHByb3BlcnRpZXMuIElmIHRoZSBmaXJzdFxuICAvLyBpdGVyYXRlZCBwcm9wZXJ0eSBpcyBhbiBvYmplY3QncyBvd24gcHJvcGVydHkgdGhlbiB0aGVyZSBhcmUgbm8gaW5oZXJpdGVkXG4gIC8vIGVudW1lcmFibGUgcHJvcGVydGllcy5cbiAgdmFyIHJlc3VsdDtcbiAgLy8gSW4gbW9zdCBlbnZpcm9ubWVudHMgYW4gb2JqZWN0J3Mgb3duIHByb3BlcnRpZXMgYXJlIGl0ZXJhdGVkIGJlZm9yZVxuICAvLyBpdHMgaW5oZXJpdGVkIHByb3BlcnRpZXMuIElmIHRoZSBsYXN0IGl0ZXJhdGVkIHByb3BlcnR5IGlzIGFuIG9iamVjdCdzXG4gIC8vIG93biBwcm9wZXJ0eSB0aGVuIHRoZXJlIGFyZSBubyBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0aWVzLlxuICBiYXNlRm9ySW4odmFsdWUsIGZ1bmN0aW9uKHN1YlZhbHVlLCBrZXkpIHtcbiAgICByZXN1bHQgPSBrZXk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0ID09PSB1bmRlZmluZWQgfHwgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgcmVzdWx0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1BsYWluT2JqZWN0O1xuIiwidmFyIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2lzT2JqZWN0TGlrZScpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXSc7XG5cbi8qKiBVc2VkIGZvciBuYXRpdmUgbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmpUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3RyaW5nYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBjb3JyZWN0bHkgY2xhc3NpZmllZCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3RyaW5nKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3RyaW5nKDEpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJyB8fCAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmpUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBzdHJpbmdUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3RyaW5nO1xuIiwidmFyIGlzTGVuZ3RoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvaXNMZW5ndGgnKSxcbiAgICBpc09iamVjdExpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBtYXBUYWcgPSAnW29iamVjdCBNYXBdJyxcbiAgICBudW1iZXJUYWcgPSAnW29iamVjdCBOdW1iZXJdJyxcbiAgICBvYmplY3RUYWcgPSAnW29iamVjdCBPYmplY3RdJyxcbiAgICByZWdleHBUYWcgPSAnW29iamVjdCBSZWdFeHBdJyxcbiAgICBzZXRUYWcgPSAnW29iamVjdCBTZXRdJyxcbiAgICBzdHJpbmdUYWcgPSAnW29iamVjdCBTdHJpbmddJyxcbiAgICB3ZWFrTWFwVGFnID0gJ1tvYmplY3QgV2Vha01hcF0nO1xuXG52YXIgYXJyYXlCdWZmZXJUYWcgPSAnW29iamVjdCBBcnJheUJ1ZmZlcl0nLFxuICAgIGZsb2F0MzJUYWcgPSAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICBmbG9hdDY0VGFnID0gJ1tvYmplY3QgRmxvYXQ2NEFycmF5XScsXG4gICAgaW50OFRhZyA9ICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgIGludDE2VGFnID0gJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgIGludDMyVGFnID0gJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgIHVpbnQ4VGFnID0gJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgIHVpbnQ4Q2xhbXBlZFRhZyA9ICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgdWludDE2VGFnID0gJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICB1aW50MzJUYWcgPSAnW29iamVjdCBVaW50MzJBcnJheV0nO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBvZiB0eXBlZCBhcnJheXMuICovXG52YXIgdHlwZWRBcnJheVRhZ3MgPSB7fTtcbnR5cGVkQXJyYXlUYWdzW2Zsb2F0MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbZmxvYXQ2NFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50OFRhZ10gPSB0eXBlZEFycmF5VGFnc1tpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDhUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xudHlwZWRBcnJheVRhZ3NbYXJnc1RhZ10gPSB0eXBlZEFycmF5VGFnc1thcnJheVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gdHlwZWRBcnJheVRhZ3NbYm9vbFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZGF0ZVRhZ10gPSB0eXBlZEFycmF5VGFnc1tlcnJvclRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZnVuY1RhZ10gPSB0eXBlZEFycmF5VGFnc1ttYXBUYWddID1cbnR5cGVkQXJyYXlUYWdzW251bWJlclRhZ10gPSB0eXBlZEFycmF5VGFnc1tvYmplY3RUYWddID1cbnR5cGVkQXJyYXlUYWdzW3JlZ2V4cFRhZ10gPSB0eXBlZEFycmF5VGFnc1tzZXRUYWddID1cbnR5cGVkQXJyYXlUYWdzW3N0cmluZ1RhZ10gPSB0eXBlZEFycmF5VGFnc1t3ZWFrTWFwVGFnXSA9IGZhbHNlO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqVG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgdHlwZWQgYXJyYXkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGNvcnJlY3RseSBjbGFzc2lmaWVkLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KG5ldyBVaW50OEFycmF5KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShbXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1R5cGVkQXJyYXkodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhIXR5cGVkQXJyYXlUYWdzW29ialRvU3RyaW5nLmNhbGwodmFsdWUpXTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1R5cGVkQXJyYXk7XG4iLCJ2YXIgYmFzZUNvcHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9iYXNlQ29weScpLFxuICAgIGtleXNJbiA9IHJlcXVpcmUoJy4uL29iamVjdC9rZXlzSW4nKTtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgcGxhaW4gb2JqZWN0IGZsYXR0ZW5pbmcgaW5oZXJpdGVkIGVudW1lcmFibGVcbiAqIHByb3BlcnRpZXMgb2YgYHZhbHVlYCB0byBvd24gcHJvcGVydGllcyBvZiB0aGUgcGxhaW4gb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBwbGFpbiBvYmplY3QuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8uYXNzaWduKHsgJ2EnOiAxIH0sIG5ldyBGb28pO1xuICogLy8gPT4geyAnYSc6IDEsICdiJzogMiB9XG4gKlxuICogXy5hc3NpZ24oeyAnYSc6IDEgfSwgXy50b1BsYWluT2JqZWN0KG5ldyBGb28pKTtcbiAqIC8vID0+IHsgJ2EnOiAxLCAnYic6IDIsICdjJzogMyB9XG4gKi9cbmZ1bmN0aW9uIHRvUGxhaW5PYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIGJhc2VDb3B5KHZhbHVlLCBrZXlzSW4odmFsdWUpKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b1BsYWluT2JqZWN0O1xuIiwidmFyIGFzc2lnbldpdGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9hc3NpZ25XaXRoJyksXG4gICAgYmFzZUFzc2lnbiA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2Jhc2VBc3NpZ24nKSxcbiAgICBjcmVhdGVBc3NpZ25lciA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2NyZWF0ZUFzc2lnbmVyJyk7XG5cbi8qKlxuICogQXNzaWducyBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIHNvdXJjZSBvYmplY3QocykgdG8gdGhlIGRlc3RpbmF0aW9uXG4gKiBvYmplY3QuIFN1YnNlcXVlbnQgc291cmNlcyBvdmVyd3JpdGUgcHJvcGVydHkgYXNzaWdubWVudHMgb2YgcHJldmlvdXMgc291cmNlcy5cbiAqIElmIGBjdXN0b21pemVyYCBpcyBwcm92aWRlZCBpdCdzIGludm9rZWQgdG8gcHJvZHVjZSB0aGUgYXNzaWduZWQgdmFsdWVzLlxuICogVGhlIGBjdXN0b21pemVyYCBpcyBib3VuZCB0byBgdGhpc0FyZ2AgYW5kIGludm9rZWQgd2l0aCBmaXZlIGFyZ3VtZW50czpcbiAqIChvYmplY3RWYWx1ZSwgc291cmNlVmFsdWUsIGtleSwgb2JqZWN0LCBzb3VyY2UpLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBtdXRhdGVzIGBvYmplY3RgIGFuZCBpcyBiYXNlZCBvblxuICogW2BPYmplY3QuYXNzaWduYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtb2JqZWN0LmFzc2lnbikuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBhbGlhcyBleHRlbmRcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAqIEBwYXJhbSB7Li4uT2JqZWN0fSBbc291cmNlc10gVGhlIHNvdXJjZSBvYmplY3RzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2N1c3RvbWl6ZXJdIFRoZSBmdW5jdGlvbiB0byBjdXN0b21pemUgYXNzaWduZWQgdmFsdWVzLlxuICogQHBhcmFtIHsqfSBbdGhpc0FyZ10gVGhlIGB0aGlzYCBiaW5kaW5nIG9mIGBjdXN0b21pemVyYC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uYXNzaWduKHsgJ3VzZXInOiAnYmFybmV5JyB9LCB7ICdhZ2UnOiA0MCB9LCB7ICd1c2VyJzogJ2ZyZWQnIH0pO1xuICogLy8gPT4geyAndXNlcic6ICdmcmVkJywgJ2FnZSc6IDQwIH1cbiAqXG4gKiAvLyB1c2luZyBhIGN1c3RvbWl6ZXIgY2FsbGJhY2tcbiAqIHZhciBkZWZhdWx0cyA9IF8ucGFydGlhbFJpZ2h0KF8uYXNzaWduLCBmdW5jdGlvbih2YWx1ZSwgb3RoZXIpIHtcbiAqICAgcmV0dXJuIF8uaXNVbmRlZmluZWQodmFsdWUpID8gb3RoZXIgOiB2YWx1ZTtcbiAqIH0pO1xuICpcbiAqIGRlZmF1bHRzKHsgJ3VzZXInOiAnYmFybmV5JyB9LCB7ICdhZ2UnOiAzNiB9LCB7ICd1c2VyJzogJ2ZyZWQnIH0pO1xuICogLy8gPT4geyAndXNlcic6ICdiYXJuZXknLCAnYWdlJzogMzYgfVxuICovXG52YXIgYXNzaWduID0gY3JlYXRlQXNzaWduZXIoZnVuY3Rpb24ob2JqZWN0LCBzb3VyY2UsIGN1c3RvbWl6ZXIpIHtcbiAgcmV0dXJuIGN1c3RvbWl6ZXJcbiAgICA/IGFzc2lnbldpdGgob2JqZWN0LCBzb3VyY2UsIGN1c3RvbWl6ZXIpXG4gICAgOiBiYXNlQXNzaWduKG9iamVjdCwgc291cmNlKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFzc2lnbjtcbiIsInZhciBhc3NpZ24gPSByZXF1aXJlKCcuL2Fzc2lnbicpLFxuICAgIGFzc2lnbkRlZmF1bHRzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvYXNzaWduRGVmYXVsdHMnKSxcbiAgICBjcmVhdGVEZWZhdWx0cyA9IHJlcXVpcmUoJy4uL2ludGVybmFsL2NyZWF0ZURlZmF1bHRzJyk7XG5cbi8qKlxuICogQXNzaWducyBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIHNvdXJjZSBvYmplY3QocykgdG8gdGhlIGRlc3RpbmF0aW9uXG4gKiBvYmplY3QgZm9yIGFsbCBkZXN0aW5hdGlvbiBwcm9wZXJ0aWVzIHRoYXQgcmVzb2x2ZSB0byBgdW5kZWZpbmVkYC4gT25jZSBhXG4gKiBwcm9wZXJ0eSBpcyBzZXQsIGFkZGl0aW9uYWwgdmFsdWVzIG9mIHRoZSBzYW1lIHByb3BlcnR5IGFyZSBpZ25vcmVkLlxuICpcbiAqICoqTm90ZToqKiBUaGlzIG1ldGhvZCBtdXRhdGVzIGBvYmplY3RgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gKiBAcGFyYW0gey4uLk9iamVjdH0gW3NvdXJjZXNdIFRoZSBzb3VyY2Ugb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgYG9iamVjdGAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmYXVsdHMoeyAndXNlcic6ICdiYXJuZXknIH0sIHsgJ2FnZSc6IDM2IH0sIHsgJ3VzZXInOiAnZnJlZCcgfSk7XG4gKiAvLyA9PiB7ICd1c2VyJzogJ2Jhcm5leScsICdhZ2UnOiAzNiB9XG4gKi9cbnZhciBkZWZhdWx0cyA9IGNyZWF0ZURlZmF1bHRzKGFzc2lnbiwgYXNzaWduRGVmYXVsdHMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmF1bHRzO1xuIiwidmFyIGNyZWF0ZURlZmF1bHRzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvY3JlYXRlRGVmYXVsdHMnKSxcbiAgICBtZXJnZSA9IHJlcXVpcmUoJy4vbWVyZ2UnKSxcbiAgICBtZXJnZURlZmF1bHRzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvbWVyZ2VEZWZhdWx0cycpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGlzIGxpa2UgYF8uZGVmYXVsdHNgIGV4Y2VwdCB0aGF0IGl0IHJlY3Vyc2l2ZWx5IGFzc2lnbnNcbiAqIGRlZmF1bHQgcHJvcGVydGllcy5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgbXV0YXRlcyBgb2JqZWN0YC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHsuLi5PYmplY3R9IFtzb3VyY2VzXSBUaGUgc291cmNlIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIGBvYmplY3RgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRlZmF1bHRzRGVlcCh7ICd1c2VyJzogeyAnbmFtZSc6ICdiYXJuZXknIH0gfSwgeyAndXNlcic6IHsgJ25hbWUnOiAnZnJlZCcsICdhZ2UnOiAzNiB9IH0pO1xuICogLy8gPT4geyAndXNlcic6IHsgJ25hbWUnOiAnYmFybmV5JywgJ2FnZSc6IDM2IH0gfVxuICpcbiAqL1xudmFyIGRlZmF1bHRzRGVlcCA9IGNyZWF0ZURlZmF1bHRzKG1lcmdlLCBtZXJnZURlZmF1bHRzKTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWZhdWx0c0RlZXA7XG4iLCJ2YXIgZ2V0TmF0aXZlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvZ2V0TmF0aXZlJyksXG4gICAgaXNBcnJheUxpa2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc0FycmF5TGlrZScpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vbGFuZy9pc09iamVjdCcpLFxuICAgIHNoaW1LZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvc2hpbUtleXMnKTtcblxuLyogTmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVLZXlzID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2tleXMnKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy4gU2VlIHRoZVxuICogW0VTIHNwZWNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLW9iamVjdC5rZXlzKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqIEBleGFtcGxlXG4gKlxuICogZnVuY3Rpb24gRm9vKCkge1xuICogICB0aGlzLmEgPSAxO1xuICogICB0aGlzLmIgPSAyO1xuICogfVxuICpcbiAqIEZvby5wcm90b3R5cGUuYyA9IDM7XG4gKlxuICogXy5rZXlzKG5ldyBGb28pO1xuICogLy8gPT4gWydhJywgJ2InXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIF8ua2V5cygnaGknKTtcbiAqIC8vID0+IFsnMCcsICcxJ11cbiAqL1xudmFyIGtleXMgPSAhbmF0aXZlS2V5cyA/IHNoaW1LZXlzIDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBDdG9yID0gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3QuY29uc3RydWN0b3I7XG4gIGlmICgodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSA9PT0gb2JqZWN0KSB8fFxuICAgICAgKHR5cGVvZiBvYmplY3QgIT0gJ2Z1bmN0aW9uJyAmJiBpc0FycmF5TGlrZShvYmplY3QpKSkge1xuICAgIHJldHVybiBzaGltS2V5cyhvYmplY3QpO1xuICB9XG4gIHJldHVybiBpc09iamVjdChvYmplY3QpID8gbmF0aXZlS2V5cyhvYmplY3QpIDogW107XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleXM7XG4iLCJ2YXIgaXNBcmd1bWVudHMgPSByZXF1aXJlKCcuLi9sYW5nL2lzQXJndW1lbnRzJyksXG4gICAgaXNBcnJheSA9IHJlcXVpcmUoJy4uL2xhbmcvaXNBcnJheScpLFxuICAgIGlzSW5kZXggPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc0luZGV4JyksXG4gICAgaXNMZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9pc0xlbmd0aCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vbGFuZy9pc09iamVjdCcpO1xuXG4vKiogVXNlZCBmb3IgbmF0aXZlIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXNJbihuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJywgJ2MnXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICovXG5mdW5jdGlvbiBrZXlzSW4ob2JqZWN0KSB7XG4gIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgfVxuICB2YXIgbGVuZ3RoID0gb2JqZWN0Lmxlbmd0aDtcbiAgbGVuZ3RoID0gKGxlbmd0aCAmJiBpc0xlbmd0aChsZW5ndGgpICYmXG4gICAgKGlzQXJyYXkob2JqZWN0KSB8fCBpc0FyZ3VtZW50cyhvYmplY3QpKSAmJiBsZW5ndGgpIHx8IDA7XG5cbiAgdmFyIEN0b3IgPSBvYmplY3QuY29uc3RydWN0b3IsXG4gICAgICBpbmRleCA9IC0xLFxuICAgICAgaXNQcm90byA9IHR5cGVvZiBDdG9yID09ICdmdW5jdGlvbicgJiYgQ3Rvci5wcm90b3R5cGUgPT09IG9iamVjdCxcbiAgICAgIHJlc3VsdCA9IEFycmF5KGxlbmd0aCksXG4gICAgICBza2lwSW5kZXhlcyA9IGxlbmd0aCA+IDA7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICByZXN1bHRbaW5kZXhdID0gKGluZGV4ICsgJycpO1xuICB9XG4gIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICBpZiAoIShza2lwSW5kZXhlcyAmJiBpc0luZGV4KGtleSwgbGVuZ3RoKSkgJiZcbiAgICAgICAgIShrZXkgPT0gJ2NvbnN0cnVjdG9yJyAmJiAoaXNQcm90byB8fCAhaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBrZXlzSW47XG4iLCJ2YXIgYmFzZU1lcmdlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWwvYmFzZU1lcmdlJyksXG4gICAgY3JlYXRlQXNzaWduZXIgPSByZXF1aXJlKCcuLi9pbnRlcm5hbC9jcmVhdGVBc3NpZ25lcicpO1xuXG4vKipcbiAqIFJlY3Vyc2l2ZWx5IG1lcmdlcyBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIHRoZSBzb3VyY2Ugb2JqZWN0KHMpLCB0aGF0XG4gKiBkb24ndCByZXNvbHZlIHRvIGB1bmRlZmluZWRgIGludG8gdGhlIGRlc3RpbmF0aW9uIG9iamVjdC4gU3Vic2VxdWVudCBzb3VyY2VzXG4gKiBvdmVyd3JpdGUgcHJvcGVydHkgYXNzaWdubWVudHMgb2YgcHJldmlvdXMgc291cmNlcy4gSWYgYGN1c3RvbWl6ZXJgIGlzXG4gKiBwcm92aWRlZCBpdCdzIGludm9rZWQgdG8gcHJvZHVjZSB0aGUgbWVyZ2VkIHZhbHVlcyBvZiB0aGUgZGVzdGluYXRpb24gYW5kXG4gKiBzb3VyY2UgcHJvcGVydGllcy4gSWYgYGN1c3RvbWl6ZXJgIHJldHVybnMgYHVuZGVmaW5lZGAgbWVyZ2luZyBpcyBoYW5kbGVkXG4gKiBieSB0aGUgbWV0aG9kIGluc3RlYWQuIFRoZSBgY3VzdG9taXplcmAgaXMgYm91bmQgdG8gYHRoaXNBcmdgIGFuZCBpbnZva2VkXG4gKiB3aXRoIGZpdmUgYXJndW1lbnRzOiAob2JqZWN0VmFsdWUsIHNvdXJjZVZhbHVlLCBrZXksIG9iamVjdCwgc291cmNlKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICogQHBhcmFtIHsuLi5PYmplY3R9IFtzb3VyY2VzXSBUaGUgc291cmNlIG9iamVjdHMuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBhc3NpZ25lZCB2YWx1ZXMuXG4gKiBAcGFyYW0geyp9IFt0aGlzQXJnXSBUaGUgYHRoaXNgIGJpbmRpbmcgb2YgYGN1c3RvbWl6ZXJgLlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyBgb2JqZWN0YC5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIHVzZXJzID0ge1xuICogICAnZGF0YSc6IFt7ICd1c2VyJzogJ2Jhcm5leScgfSwgeyAndXNlcic6ICdmcmVkJyB9XVxuICogfTtcbiAqXG4gKiB2YXIgYWdlcyA9IHtcbiAqICAgJ2RhdGEnOiBbeyAnYWdlJzogMzYgfSwgeyAnYWdlJzogNDAgfV1cbiAqIH07XG4gKlxuICogXy5tZXJnZSh1c2VycywgYWdlcyk7XG4gKiAvLyA9PiB7ICdkYXRhJzogW3sgJ3VzZXInOiAnYmFybmV5JywgJ2FnZSc6IDM2IH0sIHsgJ3VzZXInOiAnZnJlZCcsICdhZ2UnOiA0MCB9XSB9XG4gKlxuICogLy8gdXNpbmcgYSBjdXN0b21pemVyIGNhbGxiYWNrXG4gKiB2YXIgb2JqZWN0ID0ge1xuICogICAnZnJ1aXRzJzogWydhcHBsZSddLFxuICogICAndmVnZXRhYmxlcyc6IFsnYmVldCddXG4gKiB9O1xuICpcbiAqIHZhciBvdGhlciA9IHtcbiAqICAgJ2ZydWl0cyc6IFsnYmFuYW5hJ10sXG4gKiAgICd2ZWdldGFibGVzJzogWydjYXJyb3QnXVxuICogfTtcbiAqXG4gKiBfLm1lcmdlKG9iamVjdCwgb3RoZXIsIGZ1bmN0aW9uKGEsIGIpIHtcbiAqICAgaWYgKF8uaXNBcnJheShhKSkge1xuICogICAgIHJldHVybiBhLmNvbmNhdChiKTtcbiAqICAgfVxuICogfSk7XG4gKiAvLyA9PiB7ICdmcnVpdHMnOiBbJ2FwcGxlJywgJ2JhbmFuYSddLCAndmVnZXRhYmxlcyc6IFsnYmVldCcsICdjYXJyb3QnXSB9XG4gKi9cbnZhciBtZXJnZSA9IGNyZWF0ZUFzc2lnbmVyKGJhc2VNZXJnZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbWVyZ2U7XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGZpcnN0IGFyZ3VtZW50IHByb3ZpZGVkIHRvIGl0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgVXRpbGl0eVxuICogQHBhcmFtIHsqfSB2YWx1ZSBBbnkgdmFsdWUuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyBgdmFsdWVgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAndXNlcic6ICdmcmVkJyB9O1xuICpcbiAqIF8uaWRlbnRpdHkob2JqZWN0KSA9PT0gb2JqZWN0O1xuICogLy8gPT4gdHJ1ZVxuICovXG5mdW5jdGlvbiBpZGVudGl0eSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaWRlbnRpdHk7XG4iXX0=
