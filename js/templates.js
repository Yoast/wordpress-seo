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
    'facebookPreview': {},
    'twitterPreview': {}
  };

  templates['facebookPreview'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape;
    with (obj) {
    __p += '<div id="facebook_preview">\n	<h4 class="snippet-editor__heading snippet-editor__heading-icon-eye">' +
    __e( i18n.snippetPreview ) +
    '</h4>\n\n	<section class="facebook-preview">\n		<div class="snippet-editor__container facebook-preview__image snippet_container" id="facebook_image_container">\n			<img class="image" id="facebook_image" src="' +
    __e( rendered.imageUrl ) +
    '" />\n		</div>\n		<div class="facebook-preview__text-keeper">\n			<div class="snippet-editor__container facebook-preview__title snippet_container" id="facebook_title_container">\n				<span id="facebook_title">\n					' +
    __e( rendered.title ) +
    '\n				</span>\n			</div>\n			<div class="snippet-editor__container facebook-preview__description snippet_container" id="facebook_description_container">\n				<span id="facebook_description">\n					' +
    __e( rendered.description ) +
    '\n				</span>\n			</div>\n			<div class="snippet-editor__container facebook-preview__website snippet_container" id="base_url_container">\n				<span id="facebook_base_url">\n					' +
    __e( rendered.baseUrl ) +
    '\n				</span>\n			</div>\n		</div>\n	</section>\n\n	<button class="snippet-editor__button snippet-editor__edit-button" type="button">\n		' +
    __e( i18n.edit ) +
    '\n	</button>\n\n	<h4 class="snippet-editor__heading snippet-editor__heading-editor snippet-editor__heading-icon-edit snippet-editor--hidden">' +
    __e( i18n.snippetEditor ) +
    '</h4>\n\n	<div class="snippet-editor__form snippet-editor--hidden">\n		<label for="facebook-editor-title" class="snippet-editor__label">\n			' +
    __e( i18n.title ) +
    '\n			<input type="text" class="snippet-editor__input snippet-editor__title js-snippet-editor-title" id="facebook-editor-title" value="' +
    __e( raw.title ) +
    '" placeholder="' +
    __e( placeholder.title ) +
    '" />\n		</label>\n		<label for="facebook-editor-description" class="snippet-editor__label">\n			' +
    __e( i18n.description ) +
    '\n			<textarea class="snippet-editor__input snippet-editor__description js-snippet-editor-description" id="facebook-editor-description" placeholder="' +
    __e( placeholder.description ) +
    '">' +
    __e( raw.meta ) +
    '</textarea>\n		</label>\n		<label for="facebook-editor-imageUrl" class="snippet-editor__label">\n			' +
    __e( i18n.imageUrl ) +
    '\n			<input type="text" class="snippet-editor__input snippet-editor__slug js-snippet-editor-imageUrl" id="facebook-editor-imageUrl" value="' +
    __e( raw.imageUrl ) +
    '" placeholder="' +
    __e( placeholder.imageUrl ) +
    '" />\n		</label>\n\n		<button class="snippet-editor__submit snippet-editor__button" type="button">' +
    __e( i18n.save ) +
    '</button>\n	</div>\n</div>\n';

    }
    return __p
  };

  templates['twitterPreview'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape;
    with (obj) {
    __p += '<div id="twitter_preview">\n	<h4 class="snippet-editor__heading snippet-editor__heading-icon-eye">' +
    __e( i18n.snippetPreview ) +
    '</h4>\n\n	<section class="twitter-preview">\n		<div class="snippet-editor__container twitter-preview__image snippet_container" id="twitter_image_container">\n			<img class="image" id="twitter_image" src="' +
    __e( rendered.imageUrl ) +
    '" />\n		</div>\n		<div class="twitter-preview__text-keeper">\n			<div class="snippet-editor__container twitter-preview__title snippet_container" id="twitter_title_container">\n				<span id="twitter_title">\n					' +
    __e( rendered.title ) +
    '\n				</span>\n			</div>\n			<div class="snippet-editor__container twitter-preview__description snippet_container" id="twitter_description_container">\n				<span id="twitter_description">\n					' +
    __e( rendered.description ) +
    '\n				</span>\n			</div>\n			<div class="snippet-editor__container twitter-preview__website snippet_container" id="base_url_container">\n				<span id="twitter_base_url">\n					' +
    __e( rendered.baseUrl ) +
    '\n				</span>\n			</div>\n		</div>\n	</section>\n\n	<button class="snippet-editor__button snippet-editor__edit-button" type="button">\n		' +
    __e( i18n.edit ) +
    '\n	</button>\n\n	<h4 class="snippet-editor__heading snippet-editor__heading-editor snippet-editor__heading-icon-edit snippet-editor--hidden">' +
    __e( i18n.snippetEditor ) +
    '</h4>\n\n	<div class="snippet-editor__form snippet-editor--hidden">\n		<label for="twitter-editor-title" class="snippet-editor__label">\n			' +
    __e( i18n.title ) +
    '\n			<input type="text" class="snippet-editor__input snippet-editor__title js-snippet-editor-title" id="twitter-editor-title" value="' +
    __e( raw.title ) +
    '" placeholder="' +
    __e( placeholder.title ) +
    '" />\n		</label>\n		<label for="twitter-editor-description" class="snippet-editor__label">\n			' +
    __e( i18n.description ) +
    '\n			<textarea class="snippet-editor__input snippet-editor__description js-snippet-editor-description" id="twitter-editor-description" placeholder="' +
    __e( placeholder.description ) +
    '">' +
    __e( raw.meta ) +
    '</textarea>\n		</label>\n		<label for="twitter-editor-imageUrl" class="snippet-editor__label">\n			' +
    __e( i18n.imageUrl ) +
    '\n			<input type="text" class="snippet-editor__input snippet-editor__slug js-snippet-editor-imageUrl" id="twitter-editor-imageUrl" value="' +
    __e( raw.imageUrl ) +
    '" placeholder="' +
    __e( placeholder.imageUrl ) +
    '" />\n		</label>\n\n		<button class="snippet-editor__submit snippet-editor__button" type="button">' +
    __e( i18n.save ) +
    '</button>\n	</div>\n</div>\n';

    }
    return __p
  };

  /*----------------------------------------------------------------------------*/

  if (freeExports && freeModule) {
    if (moduleExports) {
      (freeModule.exports = templates).templates = templates;
    } else {
      freeExports.templates = templates;
    }
  }
  else {
    root.templates = templates;
  }
}.call(this));
