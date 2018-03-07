/* eslint-disable */
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
    'assessmentPresenterResult': {},
    'hiddenSpan': {},
    'relevantWords': {},
    'snippetEditor': {}
  };

  templates['assessmentPresenterResult'] =   function(obj) {
    obj || (obj = {});
    const { scores, markerButtonsDisabled, i18n, activeMarker } = obj;
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    __p += '<ul class="wpseoanalysis assessment-results">\n    ';
     for (var i in scores) {
    __p += '\n        <li class="score">\n            <span class="assessment-results__mark-container">\n                ';
     if ( scores[ i ].marker ) {
    __p += '\n                    <button type="button" ';
     if ( markerButtonsDisabled ) {
    __p += ' disabled="disabled" ';
     }
    __p += '\n                        aria-label="';
     if ( markerButtonsDisabled ) {
    __p +=
    ((__t = ( i18n.disabledMarkText )) == null ? '' : __t);
     }
                                else if ( scores[ i ].identifier === activeMarker ) {
    __p +=
    ((__t = ( i18n.removeMarksInText )) == null ? '' : __t);
     }
                                else {
    __p +=
    ((__t = ( i18n.markInText )) == null ? '' : __t);
     }
    __p += '"\n                        class="assessment-results__mark ';

                            if ( markerButtonsDisabled ) {
    __p += ' icon-eye-disabled ';
     }
                            else if ( scores[ i ].identifier === activeMarker ) {
    __p += '\n                            icon-eye-active\n                        ';
     }
                            else {
    __p += '\n                            icon-eye-inactive\n                        ';
     }
    __p += '\n                        js-assessment-results__mark-' +
    ((__t = ( scores[ i ].identifier )) == null ? '' : __t) +
    ' yoast-tooltip yoast-tooltip-s">\n                        <span class="screen-reader-text">';
     if ( markerButtonsDisabled ) {
    __p +=
    ((__t = ( i18n.disabledMarkText )) == null ? '' : __t);
     }
                                else if ( scores[ i ].identifier === activeMarker ) {
    __p +=
    ((__t = ( i18n.removeMarksInText )) == null ? '' : __t);
     }
                                else {
    __p +=
    ((__t = ( i18n.markInText )) == null ? '' : __t);
     }
    __p += '\n                        </span></button>\n                ';
     }
    __p += '\n            </span>\n            <span class="wpseo-score-icon ' +
    __e( scores[ i ].className ) +
    '"></span>\n            <span class="screen-reader-text">' +
    ((__t = ( scores[ i ].screenReaderText )) == null ? '' : __t) +
    '</span>\n            <span class="wpseo-score-text">' +
    ((__t = ( scores[ i ].text )) == null ? '' : __t) +
    '</span>\n        </li>\n    ';
     }
    __p += '\n</ul>\n';
    return __p
  };

  templates['hiddenSpan'] =   function(obj) {
    obj || (obj = {});
    const { whiteSpace, width } = obj;
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    __p += '<span aria-hidden="true" style="width: ' +
    __e( width ) +
    '; height: auto; position: absolute; visibility: hidden; ';
     if ( "" !== whiteSpace ) {
    __p += 'white-space: ' +
    __e(whiteSpace );
       }
    __p += '">\n\n</span>\n';
    return __p
  };

  templates['relevantWords'] =   function(obj) {
    obj || (obj = {});
    const { words } = obj;
    var __t, __p = '', __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    __p += '<table>\n    <tr>\n        <th>Word</th>\n        <th>Density</th>\n        <th>Occurrences</th>\n        <th>Length</th>\n        <th>Relevant word percentage</th>\n        <th>Length bonus</th>\n        <th>Multiplier</th>\n        <th>Relevance</th>\n    </tr>\n    ';
     for (var i in words) {
    __p += '\n        <tr>\n            <td>' +
    ((__t = ( words[ i ].word )) == null ? '' : __t) +
    '</td>\n            <td>' +
    ((__t = ( words[ i ].density )) == null ? '' : __t) +
    '</td>\n            <td>' +
    ((__t = ( words[ i ].occurrences )) == null ? '' : __t) +
    '</td>\n            <td>' +
    ((__t = ( words[ i ].length )) == null ? '' : __t) +
    '</td>\n            <td>' +
    ((__t = ( words[ i ].relevantWordPercentage )) == null ? '' : __t) +
    '</td>\n            <td>' +
    ((__t = ( words[ i ].lengthBonus )) == null ? '' : __t) +
    '</td>\n            <td>' +
    ((__t = ( words[ i ].multiplier )) == null ? '' : __t) +
    '</td>\n            <td>' +
    ((__t = ( words[ i ].relevance )) == null ? '' : __t) +
    '</td>\n        </tr>\n    ';
     }
    __p += '\n</table>\n';
    return __p
  };

  templates['snippetEditor'] =   function(obj) {
    obj || (obj = {});
    const { i18n, rendered, metaDescriptionDate, raw, placeholder } = obj;
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    __p += '<div id="snippet_preview" class="yoast-section">\n	<section class="snippet-editor__preview">\n		<h3 class="snippet-editor__heading snippet-editor__heading-icon snippet-editor__heading-icon-eye">' +
    __e( i18n.snippetPreview ) +
    '</h3>\n	<p class="screen-reader-text">' +
    __e( i18n.snippetPreviewDescription ) +
    '</p>\n\n		<div id="snippet-preview-view" class="snippet-editor__view">\n			<div class="snippet_container snippet_container__title snippet-editor__container" id="title_container">\n				<span class="screen-reader-text">' +
    __e( i18n.titleLabel ) +
    '</span>\n				<span class="title" id="render_title_container">\n					<span id="snippet_title">\n						' +
    __e( rendered.title ) +
    '\n					</span>\n				</span>\n				<span class="title" id="snippet_sitename"></span>\n			</div>\n			<div class="snippet_container snippet_container__url snippet-editor__container" id="url_container">\n				<span class="screen-reader-text">' +
    __e( i18n.slugLabel ) +
    '</span>\n				<span class="urlFull">\n					<cite class="url urlBase" id="snippet_citeBase">\n						' +
    __e( rendered.baseUrl ) +
    '\n					</cite><cite class="url" id="snippet_cite">\n						' +
    __e( rendered.snippetCite ) +
    '\n					</cite>\n				</span><span class="down_arrow"></span>\n			</div>\n			<div class="snippet_container snippet_container__meta snippet-editor__container" id="meta_container">\n				<span class="screen-reader-text">' +
    __e( i18n.metaDescriptionLabel ) +
    '</span>\n				';
     if ( "" !== metaDescriptionDate ) {
    __p += '\n					<span class="snippet-editor__date">\n						' +
    __e( metaDescriptionDate ) +
    ' -\n					</span>\n				';
     }
    __p += '\n				<span class="desc" id="snippet_meta">\n					' +
    __e( rendered.meta ) +
    '\n				</span>\n			</div>\n		</div>\n\n		<div class="snippet-editor__is-scrollable-hintwrapper">\n			<span class=\'snippet-editor__is-scrollable-hint\' aria-hidden=\'true\'>' +
    __e( i18n.isScrollableHint ) +
    '</span>\n		</div>\n\n		<div class="snippet-editor__view-toggle">\n			<button class="snippet-editor__view-icon snippet-editor__view-icon-mobile yoast-tooltip yoast-tooltip-se" type="button" data-type="mobile" aria-label="' +
    __e( i18n.mobilePreviewMode ) +
    '" />\n			<button class="snippet-editor__view-icon snippet-editor__view-icon-desktop yoast-tooltip yoast-tooltip-se" type="button" data-type="desktop" aria-label="' +
    __e( i18n.desktopPreviewMode ) +
    '" />\n		</div>\n		<button class="snippet-editor__button snippet-editor__edit-button" type="button" aria-expanded="false">\n			' +
    __e( i18n.edit ) +
    '\n		</button>\n	</section>\n\n	<div class="snippet-editor__form snippet-editor--hidden">\n		<label for="snippet-editor-title" class="snippet-editor__label">\n			' +
    __e( i18n.title ) +
    '\n			<input type="text" class="snippet-editor__input snippet-editor__title js-snippet-editor-title" id="snippet-editor-title" value="' +
    __e( raw.title ) +
    '" placeholder="' +
    __e( placeholder.title ) +
    '" />\n		</label>\n		<progress value="0.0" class="snippet-editor__progress snippet-editor__progress-title" aria-hidden="true">\n			<div class="snippet-editor__progress-bar"></div>\n		</progress>\n		<label for="snippet-editor-slug" class="snippet-editor__label">\n			' +
    __e( i18n.slug ) +
    '\n			<input type="text" class="snippet-editor__input snippet-editor__slug js-snippet-editor-slug" id="snippet-editor-slug" value="' +
    __e( raw.snippetCite ) +
    '" placeholder="' +
    __e( placeholder.urlPath ) +
    '" />\n		</label>\n		<label for="snippet-editor-meta-description" class="snippet-editor__label">\n			' +
    __e( i18n.metaDescription ) +
    '\n			<textarea class="snippet-editor__input snippet-editor__meta-description js-snippet-editor-meta-description" id="snippet-editor-meta-description" placeholder="' +
    __e( placeholder.metaDesc ) +
    '">' +
    __e( raw.meta ) +
    '</textarea>\n		</label>\n		<progress value="0.0" class="snippet-editor__progress snippet-editor__progress-meta-description" aria-hidden="true">\n			<div class="snippet-editor__progress-bar"></div>\n		</progress>\n\n		<button class="snippet-editor__submit snippet-editor__button" type="button">' +
    __e( i18n.save ) +
    '</button>\n	</div>\n</div>\n';
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
