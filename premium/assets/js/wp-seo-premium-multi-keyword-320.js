(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global YoastSEO: true, wp, wpseoPostScraperL10n, _ */
var scoreToRating = require( "yoastseo/js/interpreters/scoreToRating" );
var indicatorsFactory = require( "yoastseo/js/config/presenter" );
var Paper = require( "yoastseo/js/values/paper" );
var _isUndefined = require( "lodash/isUndefined" );

var indicators;

window.YoastSEO = ( 'undefined' === typeof window.YoastSEO ) ? {} : window.YoastSEO;
(function( $ ) {
	'use strict';

	var maxKeywords = 5;
	var keywordTabTemplate;

	var YoastMultiKeyword = function() {};

	YoastMultiKeyword.prototype.initDOM = function() {
		window.YoastSEO.multiKeyword = true;

		keywordTabTemplate = wp.template( 'keyword_tab' );

		indicators = indicatorsFactory( YoastSEO.app.i18n );

		this.setTextInput();
		this.insertElements();

		this.bindKeywordField();
		this.bindKeywordAdd();
		this.bindScore();
		this.bindKeywordTab();
		this.bindKeywordRemove();

		this.updateInactiveKeywords();
	};

	/**
	 * Determines the default values based on the state of the loaded edit page.
	 */
	YoastMultiKeyword.prototype.setTextInput = function() {
		$( '#yoast_wpseo_focuskw_text_input' ).val( $( '#yoast_wpseo_focuskw' ).val() );
	};

	/**
	 * Update keyword tabs and saves this information to the hidden field.
	 *
	 * @param {number} score The score calculated by the analyzer for the current tab.
	 */
	YoastMultiKeyword.prototype.updateKeywords = function( score ) {
		var firstKeyword, keywords;

		this.updateActiveKeywordTab( score );
		this.updateInactiveKeywords();
		this.updateOverallScore();

		keywords = $( '.wpseo_keyword_tab' ).map( function( i, keywordTab ) {
			keywordTab = $( keywordTab ).find( '.wpseo_tablink' );

			return {
				// Convert to string to prevent errors if the keyword is "null".
				keyword: keywordTab.data( 'keyword' ) + '',
				score: keywordTab.data( 'score' )
			};
		} ).get();

		// Exclude empty keywords.
		keywords = _.filter( keywords, function( item ) {
			return item.keyword.length > 0;
		});

		if ( 0 === keywords.length ) {
			keywords.push({ keyword: '', score: 0 });
		}

		if ( keywords.length > 0 ) {
			firstKeyword = keywords.splice( 0, 1 ).shift();

			$( '#yoast_wpseo_focuskw' ).val( firstKeyword.keyword );
		}

		// Save keyword information to the hidden field.
		$( '#yoast_wpseo_focuskeywords' ).val( JSON.stringify( keywords ) );
	};

	/**
	 * Inserts multi keyword elements into the DOM
	 */
	YoastMultiKeyword.prototype.insertElements = function() {
		this.addKeywordTabs();
	};

	/**
	 * Adds an event handler when the score updates
	 */
	YoastMultiKeyword.prototype.bindScore = function() {
		$( window ).on( 'YoastSEO:numericScore', this.handleUpdatedScore.bind( this ) );
	};

	/**
	 * Handles an update of the score thrown by the post scraper.
	 *
	 * @param {jQuery.Event} ev The event triggered.
	 * @param {number}       score The scores calculated by the analyzer.
	 */
	YoastMultiKeyword.prototype.handleUpdatedScore = function( ev, score ) {
		this.updateKeywords( score );
	};

	/**
	 * Adds event handler to keyword tabs to change current keyword
	 */
	YoastMultiKeyword.prototype.bindKeywordTab = function() {
		$( '.wpseo-metabox-tabs' ).on( 'click', '.wpseo_keyword_tab > .wpseo_tablink', function() {
			// Convert to string to prevent errors if the keyword is "null".
			var keyword = $( this ).data( 'keyword' ) + '';
			$( '#yoast_wpseo_focuskw_text_input' ).val( keyword ).focus();
			YoastSEO.app.refresh();
		} );
	};

	/**
	 * Adds event handler to tab removal links
	 */
	YoastMultiKeyword.prototype.bindKeywordRemove = function() {
		$( '.wpseo-metabox-tabs' ).on( 'click', '.remove-keyword', function( ev ) {
			var previousTab, currentTab;

			ev.preventDefault();
			currentTab = $( ev.currentTarget ).parent( 'li' );
			previousTab = currentTab.prev();
			currentTab.remove();

			// If the removed tab was active we should make a different one active.
			if ( currentTab.hasClass( 'active' ) ) {
				previousTab.find( '.wpseo_tablink' ).click();
			}

			this.updateUI();
		}.bind( this ) );
	};

	/**
	 * Adds event handler to updates of the keyword field
	 */
	YoastMultiKeyword.prototype.bindKeywordField = function() {
		$( '#yoast_wpseo_focuskw_text_input' ).on( 'input', function( ev ) {
			var currentTabLink, focusKeyword;

			focusKeyword = $( ev.currentTarget ).val();
			currentTabLink = $( 'li.active > .wpseo_tablink' );
			currentTabLink.data( 'keyword', focusKeyword );
			currentTabLink.find( 'span.wpseo_keyword' ).text( focusKeyword || '...' );
		}.bind( this ) );
	};

	/**
	 * Adds event handler to the keyword add button
	 */
	YoastMultiKeyword.prototype.bindKeywordAdd = function() {
		$( '.wpseo-add-keyword' ).click( function() {
			if ( ! this.canAddTab() ) {
				return;
			}

			this.addKeywordTab( null, 'na', true );
		}.bind( this ) );
	};

	/**
	 * Adds keyword tabs to the DOM
	 */
	YoastMultiKeyword.prototype.addKeywordTabs = function() {
		var keywords = JSON.parse( $( '#yoast_wpseo_focuskeywords' ).val() || '[]' );

		keywords.unshift({
			keyword: $( '#yoast_wpseo_focuskw' ).val(),
			score:   $( '#yoast_wpseo_linkdex' ).val()
		});

		// Clear the container
		$( '#wpseo-metabox-tabs' ).find( '.wpseo_keyword_tab' ).remove();

		if ( keywords.length > 0 ) {
			for( var i in keywords ) {
				var keyword = keywords[i].keyword;
				var score = keywords[i].score;
				this.addKeywordTab( keyword, score );
			}
		}

		// On page load the first tab is always active.
		$( '.wpseo_keyword_tab' ).first().addClass( 'active' );
	};

	/**
	 * Adds a single keyword to the DOM
	 *
	 * @param {string} keyword The keyword for this tab.
	 * @param {string} score The score class for this tab.
	 * @param {boolean} focus Whether this tab should be currently focused.
	 */
	YoastMultiKeyword.prototype.addKeywordTab = function( keyword, score, focus ) {
		var placeholder, html, templateArgs;

		// Insert a new keyword tab.
		keyword = keyword || '';
		placeholder = keyword.length > 0 ? keyword : '...';

		templateArgs = {
			keyword: keyword,
			placeholder: placeholder,
			score: score
		};

		// If this is the first keyword we add we want to add the "Content:" prefix
		if ( 0 === $( '.wpseo_keyword_tab' ).length ) {
			templateArgs.prefix = wpseoPostScraperL10n.contentTab;
			templateArgs.hideRemove = true;
		}

		html = keywordTabTemplate( templateArgs );
		$( '.wpseo-tab-add-keyword' ).before( html );

		this.updateUI();

		// Open the newly created tab.
		if ( focus === true ) {
			$( '.wpseo_keyword_tab:last > .wpseo_tablink' ).click();
		}
	};

	/**
	 * Updates UI based on the current state.
	 */
	YoastMultiKeyword.prototype.updateUI = function() {
		var $addKeywordButton = $( '.wpseo-add-keyword' );

		if ( this.canAddTab() ) {
			$addKeywordButton
				.prop( 'disabled', false )
				.attr( 'aria-disabled', 'false' );
		}
		else {
			$addKeywordButton
				.prop( 'disabled', true )
				.attr( 'aria-disabled', 'true' );
		}
	};

	/**
	 * Updates active keyword tab
	 *
	 * @param {number} score Score as returned by the analyzer.
	 */
	YoastMultiKeyword.prototype.updateActiveKeywordTab = function( score ) {
		var keyword, tab;

		tab     = $( '.wpseo_keyword_tab.active' );
		keyword = $( '#yoast_wpseo_focuskw_text_input').val();

		this.renderKeywordTab( keyword, score, tab, true );
	};

	/**
	 * Updates all keywords tabs that are currently inactive.
	 */
	YoastMultiKeyword.prototype.updateInactiveKeywords = _.debounce( function() {
		var inactiveKeywords;

		inactiveKeywords = $( '.wpseo_keyword_tab:not( .active )' );

		inactiveKeywords.each( function( i, tab ) {
			this.updateKeywordTab( tab );
		}.bind( this ) );
	}, 300 );

	/**
	 * Update one keyword tab.
	 *
	 * @param {Object} tab The tab to update.
	 */
	YoastMultiKeyword.prototype.updateKeywordTab = function( tab ) {
		var keyword, link, score;

		tab = $( tab );

		link    = tab.find( '.wpseo_tablink' );
		keyword = link.data( 'keyword' ) + '';
		score   = this.analyzeKeyword( keyword );

		this.renderKeywordTab( keyword, score, tab );
	};

	/**
	 * Retrieves the indicators for a certain score and keyword
	 *
	 * @param {number} score
	 * @param {string} keyword The keyword for this score.
	 */
	YoastMultiKeyword.prototype.getIndicator = function( score, keyword ) {
		var rating;

		score /= 10;

		rating = scoreToRating( score );

		if ( '' === keyword ) {
			rating = 'feedback';
		}

		return indicators[ rating ];
	};

	/**
	 * Renders a keyword tab
	 *
	 * @param {string}  keyword The keyword to render.
	 * @param {number}  score The score for this given keyword.
	 * @param {Object}  tabElement A DOM Element of a tab.
	 * @param {boolean} [active=false] Whether or not the rendered tab should be active.
	 *
	 * @returns {string} The HTML for the keyword tab.
	 */
	YoastMultiKeyword.prototype.renderKeywordTab = function( keyword, score, tabElement, active ) {
		var html, templateArgs, placeholder;

		tabElement = $( tabElement );

		placeholder = keyword.length > 0 ? keyword : '...';

		var indicators = this.getIndicator( score, keyword );

		templateArgs = {
			keyword: keyword,
			placeholder: placeholder,
			score: indicators.className
		};

		// The first tab isn't deletable
		if ( 0 === tabElement.index() ) {
			templateArgs.hideRemove = true;
			templateArgs.prefix = wpseoPostScraperL10n.contentTab;
		}

		if ( true === active ) {
			templateArgs.active = true;
		}

		html = keywordTabTemplate( templateArgs );

		// Add an extra class if the tab should be active.
		if ( true === active ) {
			html = html.replace( 'class="wpseo_keyword_tab', 'class="wpseo_keyword_tab active' );
		}

		tabElement.replaceWith( html );
	};

	/**
	 * Analyzes a certain keyword with an ad-hoc analyzer
	 *
	 * @param {string} keyword The keyword to analyze.
	 *
	 * @return {number} Total score.
	 */
	YoastMultiKeyword.prototype.analyzeKeyword = function( keyword ) {
		var paper;
		var assessor = YoastSEO.app.assessor;
		var currentPaper;

		currentPaper = YoastSEO.app.paper;

		if ( _isUndefined( currentPaper ) ) {
			return 0;
		}

		// Re-use the data already present in the page.
		paper = new Paper( currentPaper.getText(), {
			keyword: keyword,
			description: currentPaper.getDescription(),
			title: currentPaper.getTitle(),
			url: currentPaper.getUrl(),
			locale: currentPaper.getLocale()
		} );

		assessor.assess( paper );

		return assessor.calculateOverallScore();
	};

	/**
	 * Makes sure the overall score is always correct even if we switch to different tabs.
	 */
	YoastMultiKeyword.prototype.updateOverallScore = function() {
		var score;
		var mainKeywordField, currentKeywordField;

		mainKeywordField = $( '#yoast_wpseo_focuskw' );
		currentKeywordField = $( '#yoast_wpseo_focuskw_text_input' );

		if ( mainKeywordField.val() !== currentKeywordField.val() ) {
			score = $( '#yoast_wpseo_linkdex' ).val();
			score = parseInt( score, 10 );

			score = indicators[ scoreToRating( score ) ];
			score = score.className;

			if ( '' === mainKeywordField.val() ) {
				score = 'na';
			}

			$( '.overallScore' )
				.removeClass( 'na bad ok good' )
				.addClass( score );
		}
	};

	/**
	 * Returns whether or not a new tab can be added
	 *
	 * @returns {boolean}
	 */
	YoastMultiKeyword.prototype.canAddTab = function() {
		var tabAmount;

		tabAmount = $( '.wpseo_keyword_tab' ).length;

		return tabAmount < maxKeywords;
	};

	var multiKeyword = new YoastMultiKeyword();
	$( window ).on( 'YoastSEO:ready', multiKeyword.initDOM.bind( multiKeyword ) );

	window.YoastSEO.multiKeyword = true;
}( jQuery ));

},{"lodash/isUndefined":32,"yoastseo/js/config/presenter":37,"yoastseo/js/interpreters/scoreToRating":38,"yoastseo/js/values/paper":42}],2:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Reflect = root.Reflect;

module.exports = Reflect;

},{"./_root":18}],3:[function(require,module,exports){
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
  var length = args.length;
  switch (length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;

},{}],4:[function(require,module,exports){
var eq = require('./eq');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used by `_.defaults` to customize its `_.assignIn` use.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to assign.
 * @param {Object} object The parent object of `objValue`.
 * @returns {*} Returns the value to assign.
 */
function assignInDefaults(objValue, srcValue, key, object) {
  if (objValue === undefined ||
      (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
    return srcValue;
  }
  return objValue;
}

module.exports = assignInDefaults;

},{"./eq":21}],5:[function(require,module,exports){
var eq = require('./eq');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
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
    object[key] = value;
  }
}

module.exports = assignValue;

},{"./eq":21}],6:[function(require,module,exports){
var Reflect = require('./_Reflect'),
    iteratorToArray = require('./_iteratorToArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var enumerate = Reflect ? Reflect.enumerate : undefined,
    propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * The base implementation of `_.keysIn` which doesn't skip the constructor
 * property of prototypes or treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  object = object == null ? object : Object(object);

  var result = [];
  for (var key in object) {
    result.push(key);
  }
  return result;
}

// Fallback for IE < 9 with es6-shim.
if (enumerate && !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf')) {
  baseKeysIn = function(object) {
    return iteratorToArray(enumerate(object));
  };
}

module.exports = baseKeysIn;

},{"./_Reflect":2,"./_iteratorToArray":17}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
/**
 * Checks if `value` is a global object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {null|Object} Returns `value` if it's a global object, else `null`.
 */
function checkGlobal(value) {
  return (value && value.Object === Object) ? value : null;
}

module.exports = checkGlobal;

},{}],10:[function(require,module,exports){
var assignValue = require('./_assignValue');

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
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : source[key];

    assignValue(object, key, newValue);
  }
  return object;
}

module.exports = copyObject;

},{"./_assignValue":5}],11:[function(require,module,exports){
var isIterateeCall = require('./_isIterateeCall'),
    rest = require('./rest');

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return rest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = typeof customizer == 'function'
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

},{"./_isIterateeCall":15,"./rest":34}],12:[function(require,module,exports){
var baseProperty = require('./_baseProperty');

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a
 * [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792) that affects
 * Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

module.exports = getLength;

},{"./_baseProperty":7}],13:[function(require,module,exports){
var baseTimes = require('./_baseTimes'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isLength = require('./isLength'),
    isString = require('./isString');

/**
 * Creates an array of index keys for `object` values of arrays,
 * `arguments` objects, and strings, otherwise `null` is returned.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array|null} Returns index keys, else `null`.
 */
function indexKeys(object) {
  var length = object ? object.length : undefined;
  if (isLength(length) &&
      (isArray(object) || isString(object) || isArguments(object))) {
    return baseTimes(length, String);
  }
  return null;
}

module.exports = indexKeys;

},{"./_baseTimes":8,"./isArguments":22,"./isArray":23,"./isLength":27,"./isString":30}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
var eq = require('./eq'),
    isArrayLike = require('./isArrayLike'),
    isIndex = require('./_isIndex'),
    isObject = require('./isObject');

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

},{"./_isIndex":14,"./eq":21,"./isArrayLike":24,"./isObject":28}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
/**
 * Converts `iterator` to an array.
 *
 * @private
 * @param {Object} iterator The iterator to convert.
 * @returns {Array} Returns the converted array.
 */
function iteratorToArray(iterator) {
  var data,
      result = [];

  while (!(data = iterator.next()).done) {
    result.push(data.value);
  }
  return result;
}

module.exports = iteratorToArray;

},{}],18:[function(require,module,exports){
(function (global){
var checkGlobal = require('./_checkGlobal');

/** Used to determine if values are of the language type `Object`. */
var objectTypes = {
  'function': true,
  'object': true
};

/** Detect free variable `exports`. */
var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
  ? exports
  : undefined;

/** Detect free variable `module`. */
var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
  ? module
  : undefined;

/** Detect free variable `global` from Node.js. */
var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);

/** Detect free variable `self`. */
var freeSelf = checkGlobal(objectTypes[typeof self] && self);

/** Detect free variable `window`. */
var freeWindow = checkGlobal(objectTypes[typeof window] && window);

/** Detect `this` as the global object. */
var thisGlobal = checkGlobal(objectTypes[typeof this] && this);

/**
 * Used as a reference to the global object.
 *
 * The `this` value is used if it's the global object to avoid Greasemonkey's
 * restricted `window` object, otherwise the `window` object is used.
 */
var root = freeGlobal ||
  ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
    freeSelf || thisGlobal || Function('return this')();

module.exports = root;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./_checkGlobal":9}],19:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    createAssigner = require('./_createAssigner'),
    keysIn = require('./keysIn');

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

},{"./_copyObject":10,"./_createAssigner":11,"./keysIn":33}],20:[function(require,module,exports){
var apply = require('./_apply'),
    assignInDefaults = require('./_assignInDefaults'),
    assignInWith = require('./assignInWith'),
    rest = require('./rest');

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
 * _.defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
 * // => { 'user': 'barney', 'age': 36 }
 */
var defaults = rest(function(args) {
  args.push(undefined, assignInDefaults);
  return apply(assignInWith, undefined, args);
});

module.exports = defaults;

},{"./_apply":3,"./_assignInDefaults":4,"./assignInWith":19,"./rest":34}],21:[function(require,module,exports){
/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
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
 * var object = { 'user': 'fred' };
 * var other = { 'user': 'fred' };
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

},{}],22:[function(require,module,exports){
var isArrayLikeObject = require('./isArrayLikeObject');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

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
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

module.exports = isArguments;

},{"./isArrayLikeObject":25}],23:[function(require,module,exports){
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @type {Function}
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
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

},{}],24:[function(require,module,exports){
var getLength = require('./_getLength'),
    isFunction = require('./isFunction'),
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
  return value != null && isLength(getLength(value)) && !isFunction(value);
}

module.exports = isArrayLike;

},{"./_getLength":12,"./isFunction":26,"./isLength":27}],25:[function(require,module,exports){
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

},{"./isArrayLike":24,"./isObjectLike":29}],26:[function(require,module,exports){
var isObject = require('./isObject');

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
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
  // in Safari 8 which returns 'object' for typed array and weak map constructors,
  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

module.exports = isFunction;

},{"./isObject":28}],27:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length,
 *  else `false`.
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

},{}],28:[function(require,module,exports){
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
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
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],29:[function(require,module,exports){
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
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],30:[function(require,module,exports){
var isArray = require('./isArray'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var stringTag = '[object String]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
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
    (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
}

module.exports = isString;

},{"./isArray":23,"./isObjectLike":29}],31:[function(require,module,exports){
var isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified,
 *  else `false`.
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
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

module.exports = isSymbol;

},{"./isObjectLike":29}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
var baseKeysIn = require('./_baseKeysIn'),
    indexKeys = require('./_indexKeys'),
    isIndex = require('./_isIndex'),
    isPrototype = require('./_isPrototype');

/** Used for built-in method references. */
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
  var index = -1,
      isProto = isPrototype(object),
      props = baseKeysIn(object),
      propsLength = props.length,
      indexes = indexKeys(object),
      skipIndexes = !!indexes,
      result = indexes || [],
      length = result.length;

  while (++index < propsLength) {
    var key = props[index];
    if (!(skipIndexes && (key == 'length' || isIndex(key, length))) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keysIn;

},{"./_baseKeysIn":6,"./_indexKeys":13,"./_isIndex":14,"./_isPrototype":16}],34:[function(require,module,exports){
var apply = require('./_apply'),
    toInteger = require('./toInteger');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * created function and arguments from `start` and beyond provided as
 * an array.
 *
 * **Note:** This method is based on the
 * [rest parameter](https://mdn.io/rest_parameters).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Function
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.rest(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
 *
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, & pebbles'
 */
function rest(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  start = nativeMax(start === undefined ? (func.length - 1) : toInteger(start), 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    switch (start) {
      case 0: return func.call(this, array);
      case 1: return func.call(this, args[0], array);
      case 2: return func.call(this, args[0], args[1], array);
    }
    var otherArgs = Array(start + 1);
    index = -1;
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply(func, this, otherArgs);
  };
}

module.exports = rest;

},{"./_apply":3,"./toInteger":35}],35:[function(require,module,exports){
var toNumber = require('./toNumber');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to an integer.
 *
 * **Note:** This function is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3');
 * // => 3
 */
function toInteger(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  var remainder = value % 1;
  return value === value ? (remainder ? value - remainder : value) : 0;
}

module.exports = toInteger;

},{"./toNumber":36}],36:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isObject = require('./isObject'),
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
 * _.toNumber(3);
 * // => 3
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3');
 * // => 3
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = isFunction(value.valueOf) ? value.valueOf() : value;
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

},{"./isFunction":26,"./isObject":28,"./isSymbol":31}],37:[function(require,module,exports){
/**
 * Returns the configuration used for score ratings and the AssessorPresenter.
 * @param {Jed} i18n The translator object.
 * @returns {Object} The config object.
 */
module.exports = function ( i18n ) {
	return {
		feedback: {
			className: "na",
			screenReaderText: i18n.dgettext( "js-text-analysis", "Feedback")
		},
		bad: {
			className: "bad",
			screenReaderText: i18n.dgettext( "js-text-analysis", "Bad SEO score")
		},
		ok: {
			className: "ok",
			screenReaderText: i18n.dgettext( "js-text-analysis", "Ok SEO score")
		},
		good: {
			className: "good",
			screenReaderText: i18n.dgettext( "js-text-analysis", "Good SEO score")
		}
	};
};

},{}],38:[function(require,module,exports){
/**
 * Interpreters a score and gives it a particular rating.
 *
 * @param {Number} score The score to interpreter.
 * @returns {string} The rating, given based on the score.
 */
var ScoreToRating = function( score ) {

	if ( score === 0 ) {
		return "feedback";
	}

	if ( score <= 4 ) {
		return "bad";
	}

	if ( score > 4 && score <= 7 ) {
		return "ok";
	}

	if ( score > 7 ) {
		return "good";
	}

	return "";
};

module.exports = ScoreToRating;

},{}],39:[function(require,module,exports){
/** @module stringProcessing/sanitizeString */

var stripTags = require( "../stringProcessing/stripHTMLTags.js" );
var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

/**
 * Strip HTMLtags characters from string that break regex
 *
 * @param {String} text The text to strip the characters from.
 * @returns {String} The text without characters.
 */
module.exports = function( text ) {
	text = text.replace( /[\[\]\/\{\}\(\)\*\+\?\\\^\$\|]/g, "" );
	text = stripTags( text );
	text = stripSpaces( text );

	return text;
};

},{"../stringProcessing/stripHTMLTags.js":40,"../stringProcessing/stripSpaces.js":41}],40:[function(require,module,exports){
/** @module stringProcessing/stripHTMLTags */

var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

/**
 * Strip HTML-tags from text
 *
 * @param {String} text The text to strip the HTML-tags from.
 * @returns {String} The text without HTML-tags.
 */
module.exports = function( text ) {
	text = text.replace( /(<([^>]+)>)/ig, " " );
	text = stripSpaces( text );
	return text;
};

},{"../stringProcessing/stripSpaces.js":41}],41:[function(require,module,exports){
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

},{}],42:[function(require,module,exports){
var defaults = require( "lodash/defaults" );
var sanitizeString = require( "../stringProcessing/sanitizeString.js" );

/**
 * Default attributes to be used by the Paper if they are left undefined.
 * @type {{keyword: string, description: string, title: string, url: string}}
 */
var defaultAttributes = {
	keyword: "",
	description: "",
	title: "",
	url: "",
	locale: "en_US"
};

/**
 * Sanitize attributes before they are assigned to the Paper.
 * @param {object} attributes The attributes that need sanitizing.
 * @returns {object} The attributes passed to the Paper.
 */
var sanitizeAttributes = function( attributes ) {
	attributes.keyword = sanitizeString( attributes.keyword );

	return attributes;
};

/**
 * Construct the Paper object and set the keyword property.
 * @param {string} text The text to use in the analysis.
 * @param {object} attributes The object containing all attributes.
 * @constructor
 */
var Paper = function( text, attributes ) {
	this._text = text || "";

	attributes = attributes || {};
	defaults( attributes, defaultAttributes );
	this._attributes = sanitizeAttributes( attributes );
};

/**
 * Check whether a keyword is available.
 * @returns {boolean} Returns true if the Paper has a keyword.
 */
Paper.prototype.hasKeyword = function() {
	return this._attributes.keyword !== "";
};

/**
 * Return the associated keyword or an empty string if no keyword is available.
 * @returns {string} Returns Keyword
 */
Paper.prototype.getKeyword = function() {
	return this._attributes.keyword;
};

/**
 * Check whether the text is available.
 * @returns {boolean} Returns true if the paper has a text.
 */
Paper.prototype.hasText = function() {
	return this._text !== "";
};

/**
 * Return the associated text or am empty string if no text is available.
 * @returns {string} Returns text
 */
Paper.prototype.getText = function() {
	return this._text;
};

/**
 * Check whether a description is available.
 * @returns {boolean} Returns true if the paper has a description.
 */
Paper.prototype.hasDescription = function() {
	return this._attributes.description !== "";
};

/**
 * Return the description or an empty string if no description is available.
 * @returns {string} Returns the description.
 */
Paper.prototype.getDescription = function() {
	return this._attributes.description;
};

/**
 * Check whether an title is available
 * @returns {boolean} Returns true if the Paper has a title.
 */
Paper.prototype.hasTitle = function() {
	return this._attributes.title !== "";
};

/**
 * Return the title, or an empty string of no title is available.
 * @returns {string} Returns the title
 */
Paper.prototype.getTitle = function() {
	return this._attributes.title;
};

/**
 * Check whether an url is available
 * @returns {boolean} Returns true if the Paper has an Url.
 */
Paper.prototype.hasUrl = function() {
	return this._attributes.url !== "";
};

/**
 * Return the url, or an empty string of no url is available.
 * @returns {string} Returns the url
 */
Paper.prototype.getUrl = function() {
	return this._attributes.url;
};

/**
 * Check whether a locale is available
 * @returns {boolean} Returns true if the paper has a locale
 */
Paper.prototype.hasLocale = function() {
	return this._attributes.locale !== "";
};

/**
 * Return the locale or an empty string if no locale is available
 * @returns {string} Returns the locale
 */
Paper.prototype.getLocale = function() {
	return this._attributes.locale;
};

module.exports = Paper;

},{"../stringProcessing/sanitizeString.js":39,"lodash/defaults":20}]},{},[1]);
