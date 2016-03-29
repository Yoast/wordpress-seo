;(function() {
  var undefined;

  var objectTypes = {
    'function': true,
    'object': true
  };

  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global && global.Object && global;

  var freeSelf = objectTypes[typeof self] && self && self.Object && self;

  var freeWindow = objectTypes[typeof window] && window && window.Object && window;

  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  var root = freeGlobal || ((freeWindow !== (this && this.window)) && freeWindow) || freeSelf || this;

  var VERSION = '3.10.1';

  /** Used to match HTML entities and HTML characters. */
  var reUnescapedHtml = /[&<>"'`]/g,
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;'
  };

  /*--------------------------------------------------------------------------*/

  /**
   * Converts `value` to a string if it's not one. An empty string is returned
   * for `null` or `undefined` values.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    return value == null ? '' : (value + '');
  }

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeHtmlChar(chr) {
    return htmlEscapes[chr];
  }

  /*------------------------------------------------------------------------*/

  /**
   * Converts the characters "&", "<", ">", '"', "'", and "\`", in `string` to
   * their corresponding HTML entities.
   *
   * **Note:** No other characters are escaped. To escape additional characters
   * use a third-party library like [_he_](https://mths.be/he).
   *
   * Though the ">" character is escaped for symmetry, characters like
   * ">" and "/" don't need escaping in HTML and have no special meaning
   * unless they're part of a tag or unquoted attribute value.
   * See [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
   * (under "semi-related fun fact") for more details.
   *
   * Backticks are escaped because in Internet Explorer < 9, they can break out
   * of attribute values or HTML comments. See [#59](https://html5sec.org/#59),
   * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
   * [#133](https://html5sec.org/#133) of the [HTML5 Security Cheatsheet](https://html5sec.org/)
   * for more details.
   *
   * When working with HTML you should always [quote attribute values](http://wonko.com/post/html-escaping)
   * to reduce XSS vectors.
   *
   * @static
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
    // Reset `lastIndex` because in IE < 9 `String#replace` does not.
    string = baseToString(string);
    return (string && reHasUnescapedHtml.test(string))
      ? string.replace(reUnescapedHtml, escapeHtmlChar)
      : string;
  }

  var _ = { 'escape': escape };

  /*----------------------------------------------------------------------------*/

  var templates = {
    'snippetEditor': {}
  };

  templates['snippetEditor'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {
    __p += '<div id="snippet_preview">\n    <h3 class="snippet-editor__heading snippet-editor__heading-icon-eye">' +
    __e( i18n.snippetPreview ) +
    '</h3>\n\n    <section class="snippet-editor__preview">\n        <div class="snippet_container snippet-editor__container" id="title_container">\n            <span class="title" id="snippet_title">\n                ' +
    __e( rendered.title ) +
    '\n            </span>\n            <span class="title" id="snippet_sitename"></span>\n        </div>\n        <div class="snippet_container snippet-editor__container" id="url_container">\n            <cite class="url urlBase" id="snippet_citeBase">\n                ' +
    __e( rendered.baseUrl ) +
    '\n            </cite>\n            <cite class="url" id="snippet_cite">\n                ' +
    __e( rendered.snippetCite ) +
    '\n            </cite>\n        </div>\n        <div class="snippet_container snippet-editor__container" id="meta_container">\n            ';
     if ( "" !== metaDescriptionDate ) {
    __p += '\n                <span class="snippet-editor__date">\n                    ' +
    __e( metaDescriptionDate ) +
    ' -\n                </span>\n            ';
     }
    __p += '\n            <span class="desc" id="snippet_meta">\n                ' +
    __e( rendered.meta ) +
    '\n            </span>\n        </div>\n\n        <button class="snippet-editor__button snippet-editor__edit-button" type="button" aria-expanded="false">\n            ' +
    __e( i18n.edit ) +
    '\n        </button>\n    </section>\n\n    <div class="snippet-editor__form snippet-editor--hidden">\n        <label for="snippet-editor-title" class="snippet-editor__label">\n            ' +
    __e( i18n.title ) +
    '\n            <input type="text" class="snippet-editor__input snippet-editor__title js-snippet-editor-title" id="snippet-editor-title" value="' +
    __e( raw.title ) +
    '" placeholder="' +
    __e( placeholder.title ) +
    '" />\n            <progress value="0.0" class="snippet-editor__progress snippet-editor__progress-title">\n                <div class="snippet-editor__progress-bar"></div>\n            </progress>\n        </label>\n        <label for="snippet-editor-slug" class="snippet-editor__label">\n            ' +
    __e( i18n.slug ) +
    '\n            <input type="text" class="snippet-editor__input snippet-editor__slug js-snippet-editor-slug" id="snippet-editor-slug" value="' +
    __e( raw.snippetCite ) +
    '" placeholder="' +
    __e( placeholder.urlPath ) +
    '" />\n        </label>\n        <label for="snippet-editor-meta-description" class="snippet-editor__label">\n            ' +
    __e( i18n.metaDescription ) +
    '\n            <textarea class="snippet-editor__input snippet-editor__meta-description js-snippet-editor-meta-description" id="snippet-editor-meta-description" placeholder="' +
    __e( placeholder.metaDesc ) +
    '">' +
    __e( raw.meta ) +
    '</textarea>\n            <progress value="0.0" class="snippet-editor__progress snippet-editor__progress-meta-description">\n                <div class="snippet-editor__progress-bar"></div>\n            </progress>\n        </label>\n\n        <button class="snippet-editor__submit snippet-editor__button" type="button">' +
    __e( i18n.save ) +
    '</button>\n    </div>\n</div>\n';

    }
    return __p
  };

  /*----------------------------------------------------------------------------*/

  if (freeExports && freeModule) {
    if (moduleExports) {
      (freeModule.exports = templates).templates = templates;
    }
  }
  else {
    root.templates = templates;
  }
}.call(this));
