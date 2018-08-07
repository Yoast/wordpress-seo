yoastWebpackJsonp([6],{

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

/***/ 1096:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 1097:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* jslint esnext: true */


var src$core$$ = __webpack_require__(1098), src$en$$ = __webpack_require__(1103);

src$core$$["default"].__addLocaleData(src$en$$["default"]);
src$core$$["default"].defaultLocale = 'en';

exports["default"] = src$core$$["default"];

//# sourceMappingURL=main.js.map

/***/ }),

/***/ 1098:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */


var src$utils$$ = __webpack_require__(527), src$es5$$ = __webpack_require__(1099), src$compiler$$ = __webpack_require__(1100), intl$messageformat$parser$$ = __webpack_require__(1101);
exports["default"] = MessageFormat;

// -- MessageFormat --------------------------------------------------------

function MessageFormat(message, locales, formats) {
    // Parse string messages into an AST.
    var ast = typeof message === 'string' ?
            MessageFormat.__parse(message) : message;

    if (!(ast && ast.type === 'messageFormatPattern')) {
        throw new TypeError('A message must be provided as a String or AST.');
    }

    // Creates a new object with the specified `formats` merged with the default
    // formats.
    formats = this._mergeFormats(MessageFormat.formats, formats);

    // Defined first because it's used to build the format pattern.
    src$es5$$.defineProperty(this, '_locale',  {value: this._resolveLocale(locales)});

    // Compile the `ast` to a pattern that is highly optimized for repeated
    // `format()` invocations. **Note:** This passes the `locales` set provided
    // to the constructor instead of just the resolved locale.
    var pluralFn = this._findPluralRuleFunction(this._locale);
    var pattern  = this._compilePattern(ast, locales, formats, pluralFn);

    // "Bind" `format()` method to `this` so it can be passed by reference like
    // the other `Intl` APIs.
    var messageFormat = this;
    this.format = function (values) {
      try {
        return messageFormat._format(pattern, values);
      } catch (e) {
        if (e.variableId) {
          throw new Error(
            'The intl string context variable \'' + e.variableId + '\'' +
            ' was not provided to the string \'' + message + '\''
          );
        } else {
          throw e;
        }
      }
    };
}

// Default format options used as the prototype of the `formats` provided to the
// constructor. These are used when constructing the internal Intl.NumberFormat
// and Intl.DateTimeFormat instances.
src$es5$$.defineProperty(MessageFormat, 'formats', {
    enumerable: true,

    value: {
        number: {
            'currency': {
                style: 'currency'
            },

            'percent': {
                style: 'percent'
            }
        },

        date: {
            'short': {
                month: 'numeric',
                day  : 'numeric',
                year : '2-digit'
            },

            'medium': {
                month: 'short',
                day  : 'numeric',
                year : 'numeric'
            },

            'long': {
                month: 'long',
                day  : 'numeric',
                year : 'numeric'
            },

            'full': {
                weekday: 'long',
                month  : 'long',
                day    : 'numeric',
                year   : 'numeric'
            }
        },

        time: {
            'short': {
                hour  : 'numeric',
                minute: 'numeric'
            },

            'medium':  {
                hour  : 'numeric',
                minute: 'numeric',
                second: 'numeric'
            },

            'long': {
                hour        : 'numeric',
                minute      : 'numeric',
                second      : 'numeric',
                timeZoneName: 'short'
            },

            'full': {
                hour        : 'numeric',
                minute      : 'numeric',
                second      : 'numeric',
                timeZoneName: 'short'
            }
        }
    }
});

// Define internal private properties for dealing with locale data.
src$es5$$.defineProperty(MessageFormat, '__localeData__', {value: src$es5$$.objCreate(null)});
src$es5$$.defineProperty(MessageFormat, '__addLocaleData', {value: function (data) {
    if (!(data && data.locale)) {
        throw new Error(
            'Locale data provided to IntlMessageFormat is missing a ' +
            '`locale` property'
        );
    }

    MessageFormat.__localeData__[data.locale.toLowerCase()] = data;
}});

// Defines `__parse()` static method as an exposed private.
src$es5$$.defineProperty(MessageFormat, '__parse', {value: intl$messageformat$parser$$["default"].parse});

// Define public `defaultLocale` property which defaults to English, but can be
// set by the developer.
src$es5$$.defineProperty(MessageFormat, 'defaultLocale', {
    enumerable: true,
    writable  : true,
    value     : undefined
});

MessageFormat.prototype.resolvedOptions = function () {
    // TODO: Provide anything else?
    return {
        locale: this._locale
    };
};

MessageFormat.prototype._compilePattern = function (ast, locales, formats, pluralFn) {
    var compiler = new src$compiler$$["default"](locales, formats, pluralFn);
    return compiler.compile(ast);
};

MessageFormat.prototype._findPluralRuleFunction = function (locale) {
    var localeData = MessageFormat.__localeData__;
    var data       = localeData[locale.toLowerCase()];

    // The locale data is de-duplicated, so we have to traverse the locale's
    // hierarchy until we find a `pluralRuleFunction` to return.
    while (data) {
        if (data.pluralRuleFunction) {
            return data.pluralRuleFunction;
        }

        data = data.parentLocale && localeData[data.parentLocale.toLowerCase()];
    }

    throw new Error(
        'Locale data added to IntlMessageFormat is missing a ' +
        '`pluralRuleFunction` for :' + locale
    );
};

MessageFormat.prototype._format = function (pattern, values) {
    var result = '',
        i, len, part, id, value, err;

    for (i = 0, len = pattern.length; i < len; i += 1) {
        part = pattern[i];

        // Exist early for string parts.
        if (typeof part === 'string') {
            result += part;
            continue;
        }

        id = part.id;

        // Enforce that all required values are provided by the caller.
        if (!(values && src$utils$$.hop.call(values, id))) {
          err = new Error('A value must be provided for: ' + id);
          err.variableId = id;
          throw err;
        }

        value = values[id];

        // Recursively format plural and select parts' option — which can be a
        // nested pattern structure. The choosing of the option to use is
        // abstracted-by and delegated-to the part helper object.
        if (part.options) {
            result += this._format(part.getOption(value), values);
        } else {
            result += part.format(value);
        }
    }

    return result;
};

MessageFormat.prototype._mergeFormats = function (defaults, formats) {
    var mergedFormats = {},
        type, mergedType;

    for (type in defaults) {
        if (!src$utils$$.hop.call(defaults, type)) { continue; }

        mergedFormats[type] = mergedType = src$es5$$.objCreate(defaults[type]);

        if (formats && src$utils$$.hop.call(formats, type)) {
            src$utils$$.extend(mergedType, formats[type]);
        }
    }

    return mergedFormats;
};

MessageFormat.prototype._resolveLocale = function (locales) {
    if (typeof locales === 'string') {
        locales = [locales];
    }

    // Create a copy of the array so we can push on the default locale.
    locales = (locales || []).concat(MessageFormat.defaultLocale);

    var localeData = MessageFormat.__localeData__;
    var i, len, localeParts, data;

    // Using the set of locales + the default locale, we look for the first one
    // which that has been registered. When data does not exist for a locale, we
    // traverse its ancestors to find something that's been registered within
    // its hierarchy of locales. Since we lack the proper `parentLocale` data
    // here, we must take a naive approach to traversal.
    for (i = 0, len = locales.length; i < len; i += 1) {
        localeParts = locales[i].toLowerCase().split('-');

        while (localeParts.length) {
            data = localeData[localeParts.join('-')];
            if (data) {
                // Return the normalized locale string; e.g., we return "en-US",
                // instead of "en-us".
                return data.locale;
            }

            localeParts.pop();
        }
    }

    var defaultLocale = locales.pop();
    throw new Error(
        'No locale data has been added to IntlMessageFormat for: ' +
        locales.join(', ') + ', or the default locale: ' + defaultLocale
    );
};

//# sourceMappingURL=core.js.map

/***/ }),

/***/ 1099:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */


var src$utils$$ = __webpack_require__(527);

// Purposely using the same implementation as the Intl.js `Intl` polyfill.
// Copyright 2013 Andy Earnshaw, MIT License

var realDefineProp = (function () {
    try { return !!Object.defineProperty({}, 'a', {}); }
    catch (e) { return false; }
})();

var es3 = !realDefineProp && !Object.prototype.__defineGetter__;

var defineProperty = realDefineProp ? Object.defineProperty :
        function (obj, name, desc) {

    if ('get' in desc && obj.__defineGetter__) {
        obj.__defineGetter__(name, desc.get);
    } else if (!src$utils$$.hop.call(obj, name) || 'value' in desc) {
        obj[name] = desc.value;
    }
};

var objCreate = Object.create || function (proto, props) {
    var obj, k;

    function F() {}
    F.prototype = proto;
    obj = new F();

    for (k in props) {
        if (src$utils$$.hop.call(props, k)) {
            defineProperty(obj, k, props[k]);
        }
    }

    return obj;
};

exports.defineProperty = defineProperty, exports.objCreate = objCreate;

//# sourceMappingURL=es5.js.map

/***/ }),

/***/ 1100:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */


exports["default"] = Compiler;

function Compiler(locales, formats, pluralFn) {
    this.locales  = locales;
    this.formats  = formats;
    this.pluralFn = pluralFn;
}

Compiler.prototype.compile = function (ast) {
    this.pluralStack        = [];
    this.currentPlural      = null;
    this.pluralNumberFormat = null;

    return this.compileMessage(ast);
};

Compiler.prototype.compileMessage = function (ast) {
    if (!(ast && ast.type === 'messageFormatPattern')) {
        throw new Error('Message AST is not of type: "messageFormatPattern"');
    }

    var elements = ast.elements,
        pattern  = [];

    var i, len, element;

    for (i = 0, len = elements.length; i < len; i += 1) {
        element = elements[i];

        switch (element.type) {
            case 'messageTextElement':
                pattern.push(this.compileMessageText(element));
                break;

            case 'argumentElement':
                pattern.push(this.compileArgument(element));
                break;

            default:
                throw new Error('Message element does not have a valid type');
        }
    }

    return pattern;
};

Compiler.prototype.compileMessageText = function (element) {
    // When this `element` is part of plural sub-pattern and its value contains
    // an unescaped '#', use a `PluralOffsetString` helper to properly output
    // the number with the correct offset in the string.
    if (this.currentPlural && /(^|[^\\])#/g.test(element.value)) {
        // Create a cache a NumberFormat instance that can be reused for any
        // PluralOffsetString instance in this message.
        if (!this.pluralNumberFormat) {
            this.pluralNumberFormat = new Intl.NumberFormat(this.locales);
        }

        return new PluralOffsetString(
                this.currentPlural.id,
                this.currentPlural.format.offset,
                this.pluralNumberFormat,
                element.value);
    }

    // Unescape the escaped '#'s in the message text.
    return element.value.replace(/\\#/g, '#');
};

Compiler.prototype.compileArgument = function (element) {
    var format = element.format;

    if (!format) {
        return new StringFormat(element.id);
    }

    var formats  = this.formats,
        locales  = this.locales,
        pluralFn = this.pluralFn,
        options;

    switch (format.type) {
        case 'numberFormat':
            options = formats.number[format.style];
            return {
                id    : element.id,
                format: new Intl.NumberFormat(locales, options).format
            };

        case 'dateFormat':
            options = formats.date[format.style];
            return {
                id    : element.id,
                format: new Intl.DateTimeFormat(locales, options).format
            };

        case 'timeFormat':
            options = formats.time[format.style];
            return {
                id    : element.id,
                format: new Intl.DateTimeFormat(locales, options).format
            };

        case 'pluralFormat':
            options = this.compileOptions(element);
            return new PluralFormat(
                element.id, format.ordinal, format.offset, options, pluralFn
            );

        case 'selectFormat':
            options = this.compileOptions(element);
            return new SelectFormat(element.id, options);

        default:
            throw new Error('Message element does not have a valid format type');
    }
};

Compiler.prototype.compileOptions = function (element) {
    var format      = element.format,
        options     = format.options,
        optionsHash = {};

    // Save the current plural element, if any, then set it to a new value when
    // compiling the options sub-patterns. This conforms the spec's algorithm
    // for handling `"#"` syntax in message text.
    this.pluralStack.push(this.currentPlural);
    this.currentPlural = format.type === 'pluralFormat' ? element : null;

    var i, len, option;

    for (i = 0, len = options.length; i < len; i += 1) {
        option = options[i];

        // Compile the sub-pattern and save it under the options's selector.
        optionsHash[option.selector] = this.compileMessage(option.value);
    }

    // Pop the plural stack to put back the original current plural value.
    this.currentPlural = this.pluralStack.pop();

    return optionsHash;
};

// -- Compiler Helper Classes --------------------------------------------------

function StringFormat(id) {
    this.id = id;
}

StringFormat.prototype.format = function (value) {
    if (!value && typeof value !== 'number') {
        return '';
    }

    return typeof value === 'string' ? value : String(value);
};

function PluralFormat(id, useOrdinal, offset, options, pluralFn) {
    this.id         = id;
    this.useOrdinal = useOrdinal;
    this.offset     = offset;
    this.options    = options;
    this.pluralFn   = pluralFn;
}

PluralFormat.prototype.getOption = function (value) {
    var options = this.options;

    var option = options['=' + value] ||
            options[this.pluralFn(value - this.offset, this.useOrdinal)];

    return option || options.other;
};

function PluralOffsetString(id, offset, numberFormat, string) {
    this.id           = id;
    this.offset       = offset;
    this.numberFormat = numberFormat;
    this.string       = string;
}

PluralOffsetString.prototype.format = function (value) {
    var number = this.numberFormat.format(value - this.offset);

    return this.string
            .replace(/(^|[^\\])#/g, '$1' + number)
            .replace(/\\#/g, '#');
};

function SelectFormat(id, options) {
    this.id      = id;
    this.options = options;
}

SelectFormat.prototype.getOption = function (value) {
    var options = this.options;
    return options[value] || options.other;
};

//# sourceMappingURL=compiler.js.map

/***/ }),

/***/ 1101:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports = module.exports = __webpack_require__(1102)['default'];
exports['default'] = exports;


/***/ }),

/***/ 1102:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports["default"] = (function() {
  "use strict";

  /*
   * Generated by PEG.js 0.9.0.
   *
   * http://pegjs.org/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.location = location;
    this.name     = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  function peg$parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},
        parser  = this,

        peg$FAILED = {},

        peg$startRuleFunctions = { start: peg$parsestart },
        peg$startRuleFunction  = peg$parsestart,

        peg$c0 = function(elements) {
                return {
                    type    : 'messageFormatPattern',
                    elements: elements,
                    location: location()
                };
            },
        peg$c1 = function(text) {
                var string = '',
                    i, j, outerLen, inner, innerLen;

                for (i = 0, outerLen = text.length; i < outerLen; i += 1) {
                    inner = text[i];

                    for (j = 0, innerLen = inner.length; j < innerLen; j += 1) {
                        string += inner[j];
                    }
                }

                return string;
            },
        peg$c2 = function(messageText) {
                return {
                    type : 'messageTextElement',
                    value: messageText,
                    location: location()
                };
            },
        peg$c3 = /^[^ \t\n\r,.+={}#]/,
        peg$c4 = { type: "class", value: "[^ \\t\\n\\r,.+={}#]", description: "[^ \\t\\n\\r,.+={}#]" },
        peg$c5 = "{",
        peg$c6 = { type: "literal", value: "{", description: "\"{\"" },
        peg$c7 = ",",
        peg$c8 = { type: "literal", value: ",", description: "\",\"" },
        peg$c9 = "}",
        peg$c10 = { type: "literal", value: "}", description: "\"}\"" },
        peg$c11 = function(id, format) {
                return {
                    type  : 'argumentElement',
                    id    : id,
                    format: format && format[2],
                    location: location()
                };
            },
        peg$c12 = "number",
        peg$c13 = { type: "literal", value: "number", description: "\"number\"" },
        peg$c14 = "date",
        peg$c15 = { type: "literal", value: "date", description: "\"date\"" },
        peg$c16 = "time",
        peg$c17 = { type: "literal", value: "time", description: "\"time\"" },
        peg$c18 = function(type, style) {
                return {
                    type : type + 'Format',
                    style: style && style[2],
                    location: location()
                };
            },
        peg$c19 = "plural",
        peg$c20 = { type: "literal", value: "plural", description: "\"plural\"" },
        peg$c21 = function(pluralStyle) {
                return {
                    type   : pluralStyle.type,
                    ordinal: false,
                    offset : pluralStyle.offset || 0,
                    options: pluralStyle.options,
                    location: location()
                };
            },
        peg$c22 = "selectordinal",
        peg$c23 = { type: "literal", value: "selectordinal", description: "\"selectordinal\"" },
        peg$c24 = function(pluralStyle) {
                return {
                    type   : pluralStyle.type,
                    ordinal: true,
                    offset : pluralStyle.offset || 0,
                    options: pluralStyle.options,
                    location: location()
                }
            },
        peg$c25 = "select",
        peg$c26 = { type: "literal", value: "select", description: "\"select\"" },
        peg$c27 = function(options) {
                return {
                    type   : 'selectFormat',
                    options: options,
                    location: location()
                };
            },
        peg$c28 = "=",
        peg$c29 = { type: "literal", value: "=", description: "\"=\"" },
        peg$c30 = function(selector, pattern) {
                return {
                    type    : 'optionalFormatPattern',
                    selector: selector,
                    value   : pattern,
                    location: location()
                };
            },
        peg$c31 = "offset:",
        peg$c32 = { type: "literal", value: "offset:", description: "\"offset:\"" },
        peg$c33 = function(number) {
                return number;
            },
        peg$c34 = function(offset, options) {
                return {
                    type   : 'pluralFormat',
                    offset : offset,
                    options: options,
                    location: location()
                };
            },
        peg$c35 = { type: "other", description: "whitespace" },
        peg$c36 = /^[ \t\n\r]/,
        peg$c37 = { type: "class", value: "[ \\t\\n\\r]", description: "[ \\t\\n\\r]" },
        peg$c38 = { type: "other", description: "optionalWhitespace" },
        peg$c39 = /^[0-9]/,
        peg$c40 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c41 = /^[0-9a-f]/i,
        peg$c42 = { type: "class", value: "[0-9a-f]i", description: "[0-9a-f]i" },
        peg$c43 = "0",
        peg$c44 = { type: "literal", value: "0", description: "\"0\"" },
        peg$c45 = /^[1-9]/,
        peg$c46 = { type: "class", value: "[1-9]", description: "[1-9]" },
        peg$c47 = function(digits) {
            return parseInt(digits, 10);
        },
        peg$c48 = /^[^{}\\\0-\x1F \t\n\r]/,
        peg$c49 = { type: "class", value: "[^{}\\\\\\0-\\x1F\\x7f \\t\\n\\r]", description: "[^{}\\\\\\0-\\x1F\\x7f \\t\\n\\r]" },
        peg$c50 = "\\\\",
        peg$c51 = { type: "literal", value: "\\\\", description: "\"\\\\\\\\\"" },
        peg$c52 = function() { return '\\'; },
        peg$c53 = "\\#",
        peg$c54 = { type: "literal", value: "\\#", description: "\"\\\\#\"" },
        peg$c55 = function() { return '\\#'; },
        peg$c56 = "\\{",
        peg$c57 = { type: "literal", value: "\\{", description: "\"\\\\{\"" },
        peg$c58 = function() { return '\u007B'; },
        peg$c59 = "\\}",
        peg$c60 = { type: "literal", value: "\\}", description: "\"\\\\}\"" },
        peg$c61 = function() { return '\u007D'; },
        peg$c62 = "\\u",
        peg$c63 = { type: "literal", value: "\\u", description: "\"\\\\u\"" },
        peg$c64 = function(digits) {
                return String.fromCharCode(parseInt(digits, 16));
            },
        peg$c65 = function(chars) { return chars.join(''); },

        peg$currPos          = 0,
        peg$savedPos         = 0,
        peg$posDetailsCache  = [{ line: 1, column: 1, seenCR: false }],
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function error(message) {
      throw peg$buildException(
        message,
        null,
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos],
          p, ch;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line:   details.line,
          column: details.column,
          seenCR: details.seenCR
        };

        while (p < pos) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails   = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line:   startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line:   endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, found, location) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0100-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1000-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new peg$SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        location
      );
    }

    function peg$parsestart() {
      var s0;

      s0 = peg$parsemessageFormatPattern();

      return s0;
    }

    function peg$parsemessageFormatPattern() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsemessageFormatElement();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsemessageFormatElement();
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c0(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsemessageFormatElement() {
      var s0;

      s0 = peg$parsemessageTextElement();
      if (s0 === peg$FAILED) {
        s0 = peg$parseargumentElement();
      }

      return s0;
    }

    function peg$parsemessageText() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$currPos;
      s3 = peg$parse_();
      if (s3 !== peg$FAILED) {
        s4 = peg$parsechars();
        if (s4 !== peg$FAILED) {
          s5 = peg$parse_();
          if (s5 !== peg$FAILED) {
            s3 = [s3, s4, s5];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$currPos;
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsechars();
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s3 = [s3, s4, s5];
                s2 = s3;
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c1(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsews();
        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }
      }

      return s0;
    }

    function peg$parsemessageTextElement() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parsemessageText();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c2(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseargument() {
      var s0, s1, s2;

      s0 = peg$parsenumber();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = [];
        if (peg$c3.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c4); }
        }
        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            if (peg$c3.test(input.charAt(peg$currPos))) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c4); }
            }
          }
        } else {
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }
      }

      return s0;
    }

    function peg$parseargumentElement() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 123) {
        s1 = peg$c5;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c6); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseargument();
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 44) {
                s6 = peg$c7;
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c8); }
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parse_();
                if (s7 !== peg$FAILED) {
                  s8 = peg$parseelementFormat();
                  if (s8 !== peg$FAILED) {
                    s6 = [s6, s7, s8];
                    s5 = s6;
                  } else {
                    peg$currPos = s5;
                    s5 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s5;
                  s5 = peg$FAILED;
                }
              } else {
                peg$currPos = s5;
                s5 = peg$FAILED;
              }
              if (s5 === peg$FAILED) {
                s5 = null;
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 125) {
                    s7 = peg$c9;
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c10); }
                  }
                  if (s7 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c11(s3, s5);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseelementFormat() {
      var s0;

      s0 = peg$parsesimpleFormat();
      if (s0 === peg$FAILED) {
        s0 = peg$parsepluralFormat();
        if (s0 === peg$FAILED) {
          s0 = peg$parseselectOrdinalFormat();
          if (s0 === peg$FAILED) {
            s0 = peg$parseselectFormat();
          }
        }
      }

      return s0;
    }

    function peg$parsesimpleFormat() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c12) {
        s1 = peg$c12;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c13); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 4) === peg$c14) {
          s1 = peg$c14;
          peg$currPos += 4;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c15); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 4) === peg$c16) {
            s1 = peg$c16;
            peg$currPos += 4;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c17); }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 44) {
            s4 = peg$c7;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s6 = peg$parsechars();
              if (s6 !== peg$FAILED) {
                s4 = [s4, s5, s6];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c18(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsepluralFormat() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c19) {
        s1 = peg$c19;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c20); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s3 = peg$c7;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsepluralStyle();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c21(s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseselectOrdinalFormat() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 13) === peg$c22) {
        s1 = peg$c22;
        peg$currPos += 13;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c23); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s3 = peg$c7;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsepluralStyle();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c24(s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseselectFormat() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c25) {
        s1 = peg$c25;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c26); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s3 = peg$c7;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parseoptionalFormatPattern();
              if (s6 !== peg$FAILED) {
                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  s6 = peg$parseoptionalFormatPattern();
                }
              } else {
                s5 = peg$FAILED;
              }
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c27(s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseselector() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 61) {
        s2 = peg$c28;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c29); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsenumber();
        if (s3 !== peg$FAILED) {
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s0 = input.substring(s0, peg$currPos);
      } else {
        s0 = s1;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parsechars();
      }

      return s0;
    }

    function peg$parseoptionalFormatPattern() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseselector();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 123) {
              s4 = peg$c5;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c6); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s6 = peg$parsemessageFormatPattern();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 125) {
                      s8 = peg$c9;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c10); }
                    }
                    if (s8 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c30(s2, s6);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseoffset() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 7) === peg$c31) {
        s1 = peg$c31;
        peg$currPos += 7;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c32); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsenumber();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c33(s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsepluralStyle() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseoffset();
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseoptionalFormatPattern();
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parseoptionalFormatPattern();
            }
          } else {
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c34(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsews() {
      var s0, s1;

      peg$silentFails++;
      s0 = [];
      if (peg$c36.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c37); }
      }
      if (s1 !== peg$FAILED) {
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          if (peg$c36.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c37); }
          }
        }
      } else {
        s0 = peg$FAILED;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c35); }
      }

      return s0;
    }

    function peg$parse_() {
      var s0, s1, s2;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsews();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsews();
      }
      if (s1 !== peg$FAILED) {
        s0 = input.substring(s0, peg$currPos);
      } else {
        s0 = s1;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c38); }
      }

      return s0;
    }

    function peg$parsedigit() {
      var s0;

      if (peg$c39.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c40); }
      }

      return s0;
    }

    function peg$parsehexDigit() {
      var s0;

      if (peg$c41.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c42); }
      }

      return s0;
    }

    function peg$parsenumber() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 48) {
        s1 = peg$c43;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c44); }
      }
      if (s1 === peg$FAILED) {
        s1 = peg$currPos;
        s2 = peg$currPos;
        if (peg$c45.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c46); }
        }
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$parsedigit();
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$parsedigit();
          }
          if (s4 !== peg$FAILED) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s1 = input.substring(s1, peg$currPos);
        } else {
          s1 = s2;
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c47(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsechar() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      if (peg$c48.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c49); }
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c50) {
          s1 = peg$c50;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c51); }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c52();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 2) === peg$c53) {
            s1 = peg$c53;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c54); }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c55();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c56) {
              s1 = peg$c56;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c57); }
            }
            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c58();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.substr(peg$currPos, 2) === peg$c59) {
                s1 = peg$c59;
                peg$currPos += 2;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c60); }
              }
              if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c61();
              }
              s0 = s1;
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 2) === peg$c62) {
                  s1 = peg$c62;
                  peg$currPos += 2;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c63); }
                }
                if (s1 !== peg$FAILED) {
                  s2 = peg$currPos;
                  s3 = peg$currPos;
                  s4 = peg$parsehexDigit();
                  if (s4 !== peg$FAILED) {
                    s5 = peg$parsehexDigit();
                    if (s5 !== peg$FAILED) {
                      s6 = peg$parsehexDigit();
                      if (s6 !== peg$FAILED) {
                        s7 = peg$parsehexDigit();
                        if (s7 !== peg$FAILED) {
                          s4 = [s4, s5, s6, s7];
                          s3 = s4;
                        } else {
                          peg$currPos = s3;
                          s3 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s3;
                      s3 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                  if (s3 !== peg$FAILED) {
                    s2 = input.substring(s2, peg$currPos);
                  } else {
                    s2 = s3;
                  }
                  if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c64(s2);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parsechars() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsechar();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parsechar();
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c65(s1);
      }
      s0 = s1;

      return s0;
    }

    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(
        null,
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
      );
    }
  }

  return {
    SyntaxError: peg$SyntaxError,
    parse:       peg$parse
  };
})();

//# sourceMappingURL=parser.js.map

/***/ }),

/***/ 1103:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// GENERATED FILE

exports["default"] = {"locale":"en","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return n10==1&&n100!=11?"one":n10==2&&n100!=12?"two":n10==3&&n100!=13?"few":"other";return n==1&&v0?"one":"other"}};

//# sourceMappingURL=en.js.map

/***/ }),

/***/ 1104:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 1105:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* jshint node:true */



var IntlRelativeFormat = __webpack_require__(1106)['default'];

// Add all locale data to `IntlRelativeFormat`. This module will be ignored when
// bundling for the browser with Browserify/Webpack.
__webpack_require__(1111);

// Re-export `IntlRelativeFormat` as the CommonJS default exports with all the
// locale data registered, and with English set as the default locale. Define
// the `default` prop for use with other compiled ES6 Modules.
exports = module.exports = IntlRelativeFormat;
exports['default'] = exports;


/***/ }),

/***/ 1106:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* jslint esnext: true */


var src$core$$ = __webpack_require__(1107), src$en$$ = __webpack_require__(1110);

src$core$$["default"].__addLocaleData(src$en$$["default"]);
src$core$$["default"].defaultLocale = 'en';

exports["default"] = src$core$$["default"];

//# sourceMappingURL=main.js.map

/***/ }),

/***/ 1107:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */


var intl$messageformat$$ = __webpack_require__(526), src$diff$$ = __webpack_require__(1108), src$es5$$ = __webpack_require__(1109);
exports["default"] = RelativeFormat;

// -----------------------------------------------------------------------------

var FIELDS = [
    'second', 'second-short',
    'minute', 'minute-short',
    'hour', 'hour-short',
    'day', 'day-short',
    'month', 'month-short',
    'year', 'year-short'
];
var STYLES = ['best fit', 'numeric'];

// -- RelativeFormat -----------------------------------------------------------

function RelativeFormat(locales, options) {
    options = options || {};

    // Make a copy of `locales` if it's an array, so that it doesn't change
    // since it's used lazily.
    if (src$es5$$.isArray(locales)) {
        locales = locales.concat();
    }

    src$es5$$.defineProperty(this, '_locale', {value: this._resolveLocale(locales)});
    src$es5$$.defineProperty(this, '_options', {value: {
        style: this._resolveStyle(options.style),
        units: this._isValidUnits(options.units) && options.units
    }});

    src$es5$$.defineProperty(this, '_locales', {value: locales});
    src$es5$$.defineProperty(this, '_fields', {value: this._findFields(this._locale)});
    src$es5$$.defineProperty(this, '_messages', {value: src$es5$$.objCreate(null)});

    // "Bind" `format()` method to `this` so it can be passed by reference like
    // the other `Intl` APIs.
    var relativeFormat = this;
    this.format = function format(date, options) {
        return relativeFormat._format(date, options);
    };
}

// Define internal private properties for dealing with locale data.
src$es5$$.defineProperty(RelativeFormat, '__localeData__', {value: src$es5$$.objCreate(null)});
src$es5$$.defineProperty(RelativeFormat, '__addLocaleData', {value: function (data) {
    if (!(data && data.locale)) {
        throw new Error(
            'Locale data provided to IntlRelativeFormat is missing a ' +
            '`locale` property value'
        );
    }

    RelativeFormat.__localeData__[data.locale.toLowerCase()] = data;

    // Add data to IntlMessageFormat.
    intl$messageformat$$["default"].__addLocaleData(data);
}});

// Define public `defaultLocale` property which can be set by the developer, or
// it will be set when the first RelativeFormat instance is created by
// leveraging the resolved locale from `Intl`.
src$es5$$.defineProperty(RelativeFormat, 'defaultLocale', {
    enumerable: true,
    writable  : true,
    value     : undefined
});

// Define public `thresholds` property which can be set by the developer, and
// defaults to relative time thresholds from moment.js.
src$es5$$.defineProperty(RelativeFormat, 'thresholds', {
    enumerable: true,

    value: {
        second: 45, 'second-short': 45,  // seconds to minute
        minute: 45, 'minute-short': 45, // minutes to hour
        hour  : 22, 'hour-short': 22, // hours to day
        day   : 26, 'day-short': 26, // days to month
        month : 11, 'month-short': 11 // months to year
    }
});

RelativeFormat.prototype.resolvedOptions = function () {
    return {
        locale: this._locale,
        style : this._options.style,
        units : this._options.units
    };
};

RelativeFormat.prototype._compileMessage = function (units) {
    // `this._locales` is the original set of locales the user specified to the
    // constructor, while `this._locale` is the resolved root locale.
    var locales        = this._locales;
    var resolvedLocale = this._locale;

    var field        = this._fields[units];
    var relativeTime = field.relativeTime;
    var future       = '';
    var past         = '';
    var i;

    for (i in relativeTime.future) {
        if (relativeTime.future.hasOwnProperty(i)) {
            future += ' ' + i + ' {' +
                relativeTime.future[i].replace('{0}', '#') + '}';
        }
    }

    for (i in relativeTime.past) {
        if (relativeTime.past.hasOwnProperty(i)) {
            past += ' ' + i + ' {' +
                relativeTime.past[i].replace('{0}', '#') + '}';
        }
    }

    var message = '{when, select, future {{0, plural, ' + future + '}}' +
                                 'past {{0, plural, ' + past + '}}}';

    // Create the synthetic IntlMessageFormat instance using the original
    // locales value specified by the user when constructing the the parent
    // IntlRelativeFormat instance.
    return new intl$messageformat$$["default"](message, locales);
};

RelativeFormat.prototype._getMessage = function (units) {
    var messages = this._messages;

    // Create a new synthetic message based on the locale data from CLDR.
    if (!messages[units]) {
        messages[units] = this._compileMessage(units);
    }

    return messages[units];
};

RelativeFormat.prototype._getRelativeUnits = function (diff, units) {
    var field = this._fields[units];

    if (field.relative) {
        return field.relative[diff];
    }
};

RelativeFormat.prototype._findFields = function (locale) {
    var localeData = RelativeFormat.__localeData__;
    var data       = localeData[locale.toLowerCase()];

    // The locale data is de-duplicated, so we have to traverse the locale's
    // hierarchy until we find `fields` to return.
    while (data) {
        if (data.fields) {
            return data.fields;
        }

        data = data.parentLocale && localeData[data.parentLocale.toLowerCase()];
    }

    throw new Error(
        'Locale data added to IntlRelativeFormat is missing `fields` for :' +
        locale
    );
};

RelativeFormat.prototype._format = function (date, options) {
    var now = options && options.now !== undefined ? options.now : src$es5$$.dateNow();

    if (date === undefined) {
        date = now;
    }

    // Determine if the `date` and optional `now` values are valid, and throw a
    // similar error to what `Intl.DateTimeFormat#format()` would throw.
    if (!isFinite(now)) {
        throw new RangeError(
            'The `now` option provided to IntlRelativeFormat#format() is not ' +
            'in valid range.'
        );
    }

    if (!isFinite(date)) {
        throw new RangeError(
            'The date value provided to IntlRelativeFormat#format() is not ' +
            'in valid range.'
        );
    }

    var diffReport  = src$diff$$["default"](now, date);
    var units       = this._options.units || this._selectUnits(diffReport);
    var diffInUnits = diffReport[units];

    if (this._options.style !== 'numeric') {
        var relativeUnits = this._getRelativeUnits(diffInUnits, units);
        if (relativeUnits) {
            return relativeUnits;
        }
    }

    return this._getMessage(units).format({
        '0' : Math.abs(diffInUnits),
        when: diffInUnits < 0 ? 'past' : 'future'
    });
};

RelativeFormat.prototype._isValidUnits = function (units) {
    if (!units || src$es5$$.arrIndexOf.call(FIELDS, units) >= 0) {
        return true;
    }

    if (typeof units === 'string') {
        var suggestion = /s$/.test(units) && units.substr(0, units.length - 1);
        if (suggestion && src$es5$$.arrIndexOf.call(FIELDS, suggestion) >= 0) {
            throw new Error(
                '"' + units + '" is not a valid IntlRelativeFormat `units` ' +
                'value, did you mean: ' + suggestion
            );
        }
    }

    throw new Error(
        '"' + units + '" is not a valid IntlRelativeFormat `units` value, it ' +
        'must be one of: "' + FIELDS.join('", "') + '"'
    );
};

RelativeFormat.prototype._resolveLocale = function (locales) {
    if (typeof locales === 'string') {
        locales = [locales];
    }

    // Create a copy of the array so we can push on the default locale.
    locales = (locales || []).concat(RelativeFormat.defaultLocale);

    var localeData = RelativeFormat.__localeData__;
    var i, len, localeParts, data;

    // Using the set of locales + the default locale, we look for the first one
    // which that has been registered. When data does not exist for a locale, we
    // traverse its ancestors to find something that's been registered within
    // its hierarchy of locales. Since we lack the proper `parentLocale` data
    // here, we must take a naive approach to traversal.
    for (i = 0, len = locales.length; i < len; i += 1) {
        localeParts = locales[i].toLowerCase().split('-');

        while (localeParts.length) {
            data = localeData[localeParts.join('-')];
            if (data) {
                // Return the normalized locale string; e.g., we return "en-US",
                // instead of "en-us".
                return data.locale;
            }

            localeParts.pop();
        }
    }

    var defaultLocale = locales.pop();
    throw new Error(
        'No locale data has been added to IntlRelativeFormat for: ' +
        locales.join(', ') + ', or the default locale: ' + defaultLocale
    );
};

RelativeFormat.prototype._resolveStyle = function (style) {
    // Default to "best fit" style.
    if (!style) {
        return STYLES[0];
    }

    if (src$es5$$.arrIndexOf.call(STYLES, style) >= 0) {
        return style;
    }

    throw new Error(
        '"' + style + '" is not a valid IntlRelativeFormat `style` value, it ' +
        'must be one of: "' + STYLES.join('", "') + '"'
    );
};

RelativeFormat.prototype._selectUnits = function (diffReport) {
    var i, l, units;
    var fields = FIELDS.filter(function(field) {
        return field.indexOf('-short') < 1;
    });

    for (i = 0, l = fields.length; i < l; i += 1) {
        units = fields[i];

        if (Math.abs(diffReport[units]) < RelativeFormat.thresholds[units]) {
            break;
        }
    }

    return units;
};

//# sourceMappingURL=core.js.map

/***/ }),

/***/ 1108:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */



var round = Math.round;

function daysToYears(days) {
    // 400 years have 146097 days (taking into account leap year rules)
    return days * 400 / 146097;
}

exports["default"] = function (from, to) {
    // Convert to ms timestamps.
    from = +from;
    to   = +to;

    var millisecond = round(to - from),
        second      = round(millisecond / 1000),
        minute      = round(second / 60),
        hour        = round(minute / 60),
        day         = round(hour / 24),
        week        = round(day / 7);

    var rawYears = daysToYears(day),
        month    = round(rawYears * 12),
        year     = round(rawYears);

    return {
        millisecond    : millisecond,
        second         : second,
        'second-short' : second,
        minute         : minute,
        'minute-short' : minute,
        hour           : hour,
        'hour-short'   : hour,
        day            : day,
        'day-short'    : day,
        week           : week,
        'week-short'   : week,
        month          : month,
        'month-short'  : month,
        year           : year,
        'year-short'   : year
    };
};

//# sourceMappingURL=diff.js.map

/***/ }),

/***/ 1109:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

// Purposely using the same implementation as the Intl.js `Intl` polyfill.
// Copyright 2013 Andy Earnshaw, MIT License



var hop = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

var realDefineProp = (function () {
    try { return !!Object.defineProperty({}, 'a', {}); }
    catch (e) { return false; }
})();

var es3 = !realDefineProp && !Object.prototype.__defineGetter__;

var defineProperty = realDefineProp ? Object.defineProperty :
        function (obj, name, desc) {

    if ('get' in desc && obj.__defineGetter__) {
        obj.__defineGetter__(name, desc.get);
    } else if (!hop.call(obj, name) || 'value' in desc) {
        obj[name] = desc.value;
    }
};

var objCreate = Object.create || function (proto, props) {
    var obj, k;

    function F() {}
    F.prototype = proto;
    obj = new F();

    for (k in props) {
        if (hop.call(props, k)) {
            defineProperty(obj, k, props[k]);
        }
    }

    return obj;
};

var arrIndexOf = Array.prototype.indexOf || function (search, fromIndex) {
    /*jshint validthis:true */
    var arr = this;
    if (!arr.length) {
        return -1;
    }

    for (var i = fromIndex || 0, max = arr.length; i < max; i++) {
        if (arr[i] === search) {
            return i;
        }
    }

    return -1;
};

var isArray = Array.isArray || function (obj) {
    return toString.call(obj) === '[object Array]';
};

var dateNow = Date.now || function () {
    return new Date().getTime();
};

exports.defineProperty = defineProperty, exports.objCreate = objCreate, exports.arrIndexOf = arrIndexOf, exports.isArray = isArray, exports.dateNow = dateNow;

//# sourceMappingURL=es5.js.map

/***/ }),

/***/ 111:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __webpack_require__(465);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = Object({"NODE_ENV":"production"}).DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(92)))

/***/ }),

/***/ 1110:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// GENERATED FILE

exports["default"] = {"locale":"en","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return n10==1&&n100!=11?"one":n10==2&&n100!=12?"two":n10==3&&n100!=13?"few":"other";return n==1&&v0?"one":"other"},"fields":{"year":{"displayName":"year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"one":"in {0} year","other":"in {0} years"},"past":{"one":"{0} year ago","other":"{0} years ago"}}},"year-short":{"displayName":"yr.","relative":{"0":"this yr.","1":"next yr.","-1":"last yr."},"relativeTime":{"future":{"one":"in {0} yr.","other":"in {0} yr."},"past":{"one":"{0} yr. ago","other":"{0} yr. ago"}}},"month":{"displayName":"month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"one":"in {0} month","other":"in {0} months"},"past":{"one":"{0} month ago","other":"{0} months ago"}}},"month-short":{"displayName":"mo.","relative":{"0":"this mo.","1":"next mo.","-1":"last mo."},"relativeTime":{"future":{"one":"in {0} mo.","other":"in {0} mo."},"past":{"one":"{0} mo. ago","other":"{0} mo. ago"}}},"day":{"displayName":"day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"one":"in {0} day","other":"in {0} days"},"past":{"one":"{0} day ago","other":"{0} days ago"}}},"day-short":{"displayName":"day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"one":"in {0} day","other":"in {0} days"},"past":{"one":"{0} day ago","other":"{0} days ago"}}},"hour":{"displayName":"hour","relative":{"0":"this hour"},"relativeTime":{"future":{"one":"in {0} hour","other":"in {0} hours"},"past":{"one":"{0} hour ago","other":"{0} hours ago"}}},"hour-short":{"displayName":"hr.","relative":{"0":"this hour"},"relativeTime":{"future":{"one":"in {0} hr.","other":"in {0} hr."},"past":{"one":"{0} hr. ago","other":"{0} hr. ago"}}},"minute":{"displayName":"minute","relative":{"0":"this minute"},"relativeTime":{"future":{"one":"in {0} minute","other":"in {0} minutes"},"past":{"one":"{0} minute ago","other":"{0} minutes ago"}}},"minute-short":{"displayName":"min.","relative":{"0":"this minute"},"relativeTime":{"future":{"one":"in {0} min.","other":"in {0} min."},"past":{"one":"{0} min. ago","other":"{0} min. ago"}}},"second":{"displayName":"second","relative":{"0":"now"},"relativeTime":{"future":{"one":"in {0} second","other":"in {0} seconds"},"past":{"one":"{0} second ago","other":"{0} seconds ago"}}},"second-short":{"displayName":"sec.","relative":{"0":"now"},"relativeTime":{"future":{"one":"in {0} sec.","other":"in {0} sec."},"past":{"one":"{0} sec. ago","other":"{0} sec. ago"}}}}};

//# sourceMappingURL=en.js.map

/***/ }),

/***/ 1111:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 1112:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports = module.exports = __webpack_require__(1113)['default'];
exports['default'] = exports;


/***/ }),

/***/ 1113:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jshint esnext: true */


var src$es5$$ = __webpack_require__(1114);
exports["default"] = createFormatCache;

// -----------------------------------------------------------------------------

function createFormatCache(FormatConstructor) {
    var cache = src$es5$$.objCreate(null);

    return function () {
        var args    = Array.prototype.slice.call(arguments);
        var cacheId = getCacheId(args);
        var format  = cacheId && cache[cacheId];

        if (!format) {
            format = new (src$es5$$.bind.apply(FormatConstructor, [null].concat(args)))();

            if (cacheId) {
                cache[cacheId] = format;
            }
        }

        return format;
    };
}

// -- Utilities ----------------------------------------------------------------

function getCacheId(inputs) {
    // When JSON is not available in the runtime, we will not create a cache id.
    if (typeof JSON === 'undefined') { return; }

    var cacheId = [];

    var i, len, input;

    for (i = 0, len = inputs.length; i < len; i += 1) {
        input = inputs[i];

        if (input && typeof input === 'object') {
            cacheId.push(orderedProps(input));
        } else {
            cacheId.push(input);
        }
    }

    return JSON.stringify(cacheId);
}

function orderedProps(obj) {
    var props = [],
        keys  = [];

    var key, i, len, prop;

    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            keys.push(key);
        }
    }

    var orderedKeys = keys.sort();

    for (i = 0, len = orderedKeys.length; i < len; i += 1) {
        key  = orderedKeys[i];
        prop = {};

        prop[key] = obj[key];
        props[i]  = prop;
    }

    return props;
}

//# sourceMappingURL=memoizer.js.map

/***/ }),

/***/ 1114:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

// Function.prototype.bind implementation from Mozilla Developer Network:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Polyfill



var bind = Function.prototype.bind || function (oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    if (this.prototype) {
      // native functions don't have a prototype
      fNOP.prototype = this.prototype;
    }
    fBound.prototype = new fNOP();

    return fBound;
};

// Purposely using the same implementation as the Intl.js `Intl` polyfill.
// Copyright 2013 Andy Earnshaw, MIT License

var hop = Object.prototype.hasOwnProperty;

var realDefineProp = (function () {
    try { return !!Object.defineProperty({}, 'a', {}); }
    catch (e) { return false; }
})();

var es3 = !realDefineProp && !Object.prototype.__defineGetter__;

var defineProperty = realDefineProp ? Object.defineProperty :
        function (obj, name, desc) {

    if ('get' in desc && obj.__defineGetter__) {
        obj.__defineGetter__(name, desc.get);
    } else if (!hop.call(obj, name) || 'value' in desc) {
        obj[name] = desc.value;
    }
};

var objCreate = Object.create || function (proto, props) {
    var obj, k;

    function F() {}
    F.prototype = proto;
    obj = new F();

    for (k in props) {
        if (hop.call(props, k)) {
            defineProperty(obj, k, props[k]);
        }
    }

    return obj;
};

exports.bind = bind, exports.defineProperty = defineProperty, exports.objCreate = objCreate;

//# sourceMappingURL=es5.js.map

/***/ }),

/***/ 112:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = isTab;
/* harmony export (immutable) */ __webpack_exports__["c"] = isTabPanel;
/* harmony export (immutable) */ __webpack_exports__["b"] = isTabList;
function isTab(el) {
  return el.type && el.type.tabsRole === 'Tab';
}
function isTabPanel(el) {
  return el.type && el.type.tabsRole === 'TabPanel';
}
function isTabList(el) {
  return el.type && el.type.tabsRole === 'TabList';
}

/***/ }),

/***/ 113:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {
		window.classNames = classNames;
	}
}());


/***/ }),

/***/ 115:
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

/***/ 116:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.makeOutboundLink = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _i18n = __webpack_require__(9);

var _A11yNotice = __webpack_require__(452);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* External dependencies */


/* Internal dependencies */


/**
 * Makes an anchor component into an outbound link that opens in a new tab.
 *
 * @param {ReactElement} Component The anchor component to be wrapped.
 *
 * @returns {ReactElement} The OutboundLink component.
 */
var makeOutboundLink = exports.makeOutboundLink = function makeOutboundLink() {
	var Component = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "a";

	var OutboundLink = function (_React$Component) {
		_inherits(OutboundLink, _React$Component);

		function OutboundLink() {
			_classCallCheck(this, OutboundLink);

			return _possibleConstructorReturn(this, (OutboundLink.__proto__ || Object.getPrototypeOf(OutboundLink)).apply(this, arguments));
		}

		_createClass(OutboundLink, [{
			key: "render",
			value: function render() {
				var newProps = Object.assign({
					target: "_blank",
					rel: "noopener noreferrer"
				}, this.props);
				// Use React.createElement instead of JSX because it can accept a string as a component parameter.
				return _react2.default.createElement(Component, newProps, this.props.children, _react2.default.createElement(_A11yNotice.A11yNotice, null, (0, _i18n.__)("(Opens in a new browser tab)", "yoast-components")));
			}
		}]);

		return OutboundLink;
	}(_react2.default.Component);

	OutboundLink.propTypes = {
		children: _propTypes2.default.oneOfType([_propTypes2.default.node])
	};

	return OutboundLink;
};

/***/ }),

/***/ 118:
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(39),
    isObjectLike = __webpack_require__(22);

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

/***/ 119:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.rgba = rgba;
/**
 * Converts a hexadecimal color notation in a RGB notation.
 *
 * @param {string} hexColor The color in hex notation: ‘#’ followed by either three or six hexadecimal characters.
 *
 * @returns {string} The color in RGB notation.
 */
function parseToRgb(hexColor) {
	if (typeof hexColor !== "string") {
		throw new Error("Please pass a string representation of a color in hex notation.");
	}

	var hexRegex = /^#[a-fA-F0-9]{6}$/;
	var shortHexRegex = /^#[a-fA-F0-9]{3}$/;

	if (hexColor.match(hexRegex)) {
		return parseInt("" + hexColor[1] + hexColor[2], 16) + ", " + parseInt("" + hexColor[3] + hexColor[4], 16) + ", " + parseInt("" + hexColor[5] + hexColor[6], 16);
	}

	if (hexColor.match(shortHexRegex)) {
		return parseInt("" + hexColor[1] + hexColor[1], 16) + ", " + parseInt("" + hexColor[2] + hexColor[2], 16) + ", " + parseInt(" " + hexColor[3] + hexColor[3], 16);
	}

	throw new Error("Couldn't parse the color string. Please provide the color as a string in hex notation.");
}

/**
 * Returns a CSS color in RGBA format.
 *
 * @param {string}        hexColor The color in hex notation: ‘#’ followed by either three or six hexadecimal characters.
 * @param {string|number} alpha    The alpha opacity value for the color, in a range from 0.0 to 1.0.
 *
 * @returns {string} The CSS color formatted as a RGBA value.
 */
function rgba(hexColor, alpha) {
	return "rgba( " + parseToRgb(hexColor) + ", " + alpha + " )";
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

/***/ 145:
/***/ (function(module, exports) {

module.exports = function deprecate(fn, message) {
  var warned = false;

  function deprecated() {
    if (!warned) {
      /* eslint no-console:0 */
      console.warn(message);
      warned = true;
    }

    return fn.apply(this, arguments);
  }

  return deprecated;
};


/***/ }),

/***/ 146:
/***/ (function(module, exports) {

module.exports = function deprecatedMessage(previousUsage, newUsage) {
  var githubAnchorLink = previousUsage.toLowerCase()
    .replace(/[\.\(\)]/g, '');

  return 'algoliasearch: `' + previousUsage + '` was replaced by `' + newUsage +
    '`. Please see https://github.com/algolia/algoliasearch-client-javascript/wiki/Deprecated#' + githubAnchorLink;
};


/***/ }),

/***/ 147:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = deepMap;
/* harmony export (immutable) */ __webpack_exports__["a"] = deepForEach;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_elementTypes__ = __webpack_require__(112);
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




function isTabChild(child) {
  return Object(__WEBPACK_IMPORTED_MODULE_1__helpers_elementTypes__["a" /* isTab */])(child) || Object(__WEBPACK_IMPORTED_MODULE_1__helpers_elementTypes__["b" /* isTabList */])(child) || Object(__WEBPACK_IMPORTED_MODULE_1__helpers_elementTypes__["c" /* isTabPanel */])(child);
}

function deepMap(children, callback) {
  return __WEBPACK_IMPORTED_MODULE_0_react__["Children"].map(children, function (child) {
    // null happens when conditionally rendering TabPanel/Tab
    // see https://github.com/reactjs/react-tabs/issues/37
    if (child === null) return null;

    if (isTabChild(child)) {
      return callback(child);
    }

    if (child.props && child.props.children && typeof child.props.children === 'object') {
      // Clone the child that has children and map them too
      return Object(__WEBPACK_IMPORTED_MODULE_0_react__["cloneElement"])(child, _objectSpread({}, child.props, {
        children: deepMap(child.props.children, callback)
      }));
    }

    return child;
  });
}
function deepForEach(children, callback) {
  return __WEBPACK_IMPORTED_MODULE_0_react__["Children"].forEach(children, function (child) {
    // null happens when conditionally rendering TabPanel/Tab
    // see https://github.com/reactjs/react-tabs/issues/37
    if (child === null) return;

    if (Object(__WEBPACK_IMPORTED_MODULE_1__helpers_elementTypes__["a" /* isTab */])(child) || Object(__WEBPACK_IMPORTED_MODULE_1__helpers_elementTypes__["c" /* isTabPanel */])(child)) {
      callback(child);
    } else if (child.props && child.props.children && typeof child.props.children === 'object') {
      if (Object(__WEBPACK_IMPORTED_MODULE_1__helpers_elementTypes__["b" /* isTabList */])(child)) callback(child);
      deepForEach(child.props.children, callback);
    }
  });
}

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

/***/ 158:
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(26),
    now = __webpack_require__(445),
    toNumber = __webpack_require__(258);

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
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
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

/***/ 160:
/***/ (function(module, exports, __webpack_require__) {

var getNative = __webpack_require__(52),
    root = __webpack_require__(36);

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;


/***/ }),

/***/ 19:
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ 1994:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(24);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = __webpack_require__(25);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _get = __webpack_require__(148);

var _get2 = _interopRequireDefault(_get);

var _reactIntl = __webpack_require__(525);

var _IntlProvider = __webpack_require__(417);

var _IntlProvider2 = _interopRequireDefault(_IntlProvider);

var _i18n = __webpack_require__(514);

__webpack_require__(91);

var _VideoTutorial = __webpack_require__(1995);

var _VideoTutorial2 = _interopRequireDefault(_VideoTutorial);

var _AlgoliaSearcher = __webpack_require__(456);

var _AlgoliaSearcher2 = _interopRequireDefault(_AlgoliaSearcher);

var _HelpCenter = __webpack_require__(504);

var _HelpCenter2 = _interopRequireDefault(_HelpCenter);

var _colors = __webpack_require__(4);

var _colors2 = _interopRequireDefault(_colors);

var _YoastButton = __webpack_require__(69);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global wpseoHelpCenterData jQuery */

/* External dependencies */


/* Internal dependencies */


/**
 * Executes an action with an argument.
 */
var ContactSupport = function (_React$Component) {
	_inherits(ContactSupport, _React$Component);

	function ContactSupport() {
		_classCallCheck(this, ContactSupport);

		return _possibleConstructorReturn(this, (ContactSupport.__proto__ || Object.getPrototypeOf(ContactSupport)).apply(this, arguments));
	}

	_createClass(ContactSupport, [{
		key: "execute",

		/**
   * Execute the contact support callback.
   *
   * @returns {void}
   */
		value: function execute() {
			if (this.props.do) {
				this.props.do(this.props.with);
			}
		}

		/**
   * Render the component.
   *
   * @returns {ReactElement} ContactSupport component.
   */

	}, {
		key: "render",
		value: function render() {
			return yoast._wp.element.createElement(
				"div",
				{ className: "contact-premium-support" },
				this.props.paragraphs.map(function (paragraph, index) {
					var image = paragraph.image,
					    content = paragraph.content;

					return yoast._wp.element.createElement(
						"p",
						{ key: index, className: "contact-premium-support__content" },
						image ? yoast._wp.element.createElement("img", { src: image.src, width: image.width, height: image.height, alt: image.alt }) : null,
						content
					);
				}),
				yoast._wp.element.createElement(
					_YoastButton.YoastButton,
					{
						className: "contact-premium-support__button",
						onClick: this.execute.bind(this) },
					this.props.buttonText
				)
			);
		}
	}]);

	return ContactSupport;
}(_react2.default.Component);

ContactSupport.propTypes = {
	buttonText: _propTypes2.default.string,
	"do": _propTypes2.default.func,
	"with": _propTypes2.default.any,
	paragraphs: _propTypes2.default.array.isRequired
};

/**
 * The help center component.
 */

var HelpCenter = function (_React$Component2) {
	_inherits(HelpCenter, _React$Component2);

	function HelpCenter(props) {
		_classCallCheck(this, HelpCenter);

		var _this2 = _possibleConstructorReturn(this, (HelpCenter.__proto__ || Object.getPrototypeOf(HelpCenter)).call(this, props));

		var initialTab = _this2.getTabIdFromUrlHash() || props.initialTab;
		_this2.state = {
			videoUrl: _this2.getVideoUrl(initialTab),
			usedQueries: {}
		};

		window.addEventListener("hashchange", _this2.tabChanged.bind(_this2));
		return _this2;
	}

	/**
  * Callback called when the user switches tabs.
  *
  * @returns {void}
  */


	_createClass(HelpCenter, [{
		key: "tabChanged",
		value: function tabChanged() {
			var tabId = this.getTabIdFromUrlHash();
			var videoUrl = this.getVideoUrl(tabId);
			this.setState({ videoUrl: videoUrl });
		}

		/**
   * Get the video URL based on the given tab id.
   *
   * @param {string} tabId The tab id.
   *
   * @returns {string} The video URL.
   */

	}, {
		key: "getVideoUrl",
		value: function getVideoUrl(tabId) {
			return (0, _get2.default)(this.props.adminTabsData, tabId + ".videoUrl");
		}

		/**
   * Parses the tab id from the URL hash.
   *
   * @returns {string} The tab id.
   */

	}, {
		key: "getTabIdFromUrlHash",
		value: function getTabIdFromUrlHash() {
			return location.hash.replace("#top#", "");
		}

		/**
   * Stores the search queries done by the AlgoliaSearcher in state.
   *
   * @param {object} usedQueries A key value object containing search queries.
   *
   * @returns {void}
   */

	}, {
		key: "updateUsedQueries",
		value: function updateUsedQueries(usedQueries) {
			var queries = Object.assign({}, this.state.usedQueries, usedQueries);
			this.setState({ usedQueries: queries });
		}

		/**
   * Create a formatted array of tabs for the HelpCenter component.
   *
   * @returns {Array} Help center tab data.
   */

	}, {
		key: "getTabs",
		value: function getTabs() {
			var formatMessage = this.props.intl.formatMessage;
			var tabs = [];

			// Video tab
			if (this.state.videoUrl) {
				tabs.push({
					id: "video-tutorial",
					label: formatMessage({ id: "videoTutorial" }),
					content: yoast._wp.element.createElement(_VideoTutorial2.default, {
						src: this.state.videoUrl,
						title: "",
						paragraphs: this.props.videoTutorialParagraphs })
				});
			}

			// Knowledge base
			tabs.push({
				id: "knowledge-base",
				label: formatMessage({ id: "knowledgeBase" }),
				content: yoast._wp.element.createElement(_AlgoliaSearcher2.default, {
					onQueryChange: this.updateUsedQueries.bind(this) })
			});

			// Additional tabs
			Array.prototype.push.apply(tabs, this.getAdditionalTabs());

			return tabs;
		}

		/**
   * Create a formatted array of tabs for all additional tabs passed via props.additionalHelpCenterTabs.
   *
   * @returns {Array} {Array} Help center tab data.
   */

	}, {
		key: "getAdditionalTabs",
		value: function getAdditionalTabs() {
			var _this3 = this;

			var additionalTabs = [];

			if (!this.props.additionalHelpCenterTabs) {
				return additionalTabs;
			}

			this.props.additionalHelpCenterTabs.map(function (tab) {
				var content = void 0;
				if (_this3.props.shouldDisplayContactForm === "1" && tab.identifier === "contact-support") {
					var supportButton = _this3.props.intl.formatMessage({ id: "contactSupport.button" });
					content = yoast._wp.element.createElement(ContactSupport, {
						paragraphs: _this3.props.contactFormParagraphs,
						buttonText: supportButton,
						"do": _this3.props.onPremiumSupport,
						"with": _this3.state.usedQueries });
				}
				additionalTabs.push({
					id: tab.identifier,
					label: tab.label,
					content: content ? content : yoast._wp.element.createElement("div", { dangerouslySetInnerHTML: { __html: tab.content } })
				});
			});

			return additionalTabs;
		}

		/**
   * Renders the HelpCenter.
   *
   * @returns {ReactElement} The HelpCenter component.
   */

	}, {
		key: "render",
		value: function render() {
			return yoast._wp.element.createElement(_HelpCenter2.default, {
				buttonBackgroundColor: _colors2.default.$color_white,
				buttonTextColor: _colors2.default.$color_pink_dark,
				buttonIconColor: _colors2.default.$color_pink_dark,
				buttonWithTextShadow: false,
				onHelpCenterToggle: this.props.onHelpCenterToggle,
				onTabSelect: this.props.onTabSelect,
				onTabsMounted: this.props.onTabsMounted,
				items: this.getTabs()
			});
		}
	}]);

	return HelpCenter;
}(_react2.default.Component);

HelpCenter.propTypes = {
	onHelpCenterToggle: _propTypes2.default.func,
	onTabSelect: _propTypes2.default.func,
	onTabsMounted: _propTypes2.default.func,
	onPremiumSupport: _propTypes2.default.func,
	adminTabsData: _propTypes2.default.object.isRequired,
	additionalHelpCenterTabs: _propTypes2.default.array,
	videoTutorialParagraphs: _propTypes2.default.array,
	shouldDisplayContactForm: _propTypes2.default.string,
	contactFormParagraphs: _propTypes2.default.array,
	initialTab: _propTypes2.default.string,
	intl: _reactIntl.intlShape.isRequired
};

var HelpCenterIntl = (0, _reactIntl.injectIntl)(HelpCenter);

/**
 * Premium support callback.
 *
 * @param {object} usedQueries AlgoliaSearcher queries.
 *
 * @returns {void}
 */
function onPremiumSupport(usedQueries) {
	jQuery(window).trigger("YoastSEO:ContactSupport", { usedQueries: usedQueries });
}

/**
 * Toggle the sidebar if it's visible.
 *
 * @param {bool} expanded Help center state.
 *
 * @returns {void}
 */
function toggleSidebar(expanded) {
	jQuery(".wpseo_content_wrapper").toggleClass("yoast-help-center-open", expanded);
}

/**
 * Triggers a custom DOM event when the react tabs gets mounted.
 *
 * By default only the current active tab panel content will be rendered. The
 * other tab panels will be empty. If the react-tabs prop `forceRenderTabPanel`
 * is set to true the content of all the panels will be always rendered.
 *
 * @returns {void}
 */
function handleTabsMounted() {
	jQuery(window).trigger("Yoast:YoastTabsMounted");
}

/**
 * Triggers a custom DOM event when a react tabs gets selected.
 *
 * @returns {void}
 */
function handleTabSelect() {
	jQuery(window).trigger("Yoast:YoastTabsSelected");
}

if (window.wpseoHelpCenterData) {
	(0, _i18n.setYoastComponentsL10n)();

	_reactDom2.default.render(yoast._wp.element.createElement(
		_IntlProvider2.default,
		{
			messages: wpseoHelpCenterData.translations },
		yoast._wp.element.createElement(HelpCenterIntl, {
			onHelpCenterToggle: toggleSidebar,
			onTabSelect: handleTabSelect,
			onTabsMounted: handleTabsMounted,
			onPremiumSupport: onPremiumSupport,
			initialTab: wpseoHelpCenterData.initialTab,
			adminTabsData: wpseoHelpCenterData.tabs,
			additionalHelpCenterTabs: wpseoHelpCenterData.extraTabs,
			videoTutorialParagraphs: wpseoHelpCenterData.videoDescriptions,
			shouldDisplayContactForm: wpseoHelpCenterData.shouldDisplayContactForm,
			contactFormParagraphs: wpseoHelpCenterData.contactSupportParagraphs
		})
	), document.getElementById(wpseoHelpCenterData.mountId));
}

/***/ }),

/***/ 1995:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = VideoTutorial;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _styledComponents = __webpack_require__(2);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _YouTubeVideo = __webpack_require__(1996);

var _YouTubeVideo2 = _interopRequireDefault(_YouTubeVideo);

var _colors = __webpack_require__(4);

var _colors2 = _interopRequireDefault(_colors);

var _responsiveBreakpoints = __webpack_require__(95);

var _responsiveBreakpoints2 = _interopRequireDefault(_responsiveBreakpoints);

var _makeOutboundLink = __webpack_require__(116);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Used to align the video and the description next to each other.
var VIDEO_WIDTH = "560px";

var VideoTutorialContainer = _styledComponents2.default.div.withConfig({
	displayName: "VideoTutorial__VideoTutorialContainer"
})(["overflow:hidden;"]);

var VideoContainer = _styledComponents2.default.div.withConfig({
	displayName: "VideoTutorial__VideoContainer"
})(["", " width:", ";@media screen and ( max-width:", " ){float:none;max-width:100%;margin:0 auto;}"], function (props) {
	return props.hasParagraphs ? "float: left;" : "margin: 0 auto;";
}, VIDEO_WIDTH, _responsiveBreakpoints2.default.tablet);

VideoContainer.propTypes = {
	hasParagraphs: _propTypes2.default.bool.isRequired
};

var VideoDescriptions = _styledComponents2.default.div.withConfig({
	displayName: "VideoTutorial__VideoDescriptions"
})(["margin-left:", ";padding:0 16px;max-width:", ";@media screen and ( max-width:", " ){margin:0 auto;padding:0;}"], VIDEO_WIDTH, VIDEO_WIDTH, _responsiveBreakpoints2.default.tablet);

var VideoDescription = _styledComponents2.default.div.withConfig({
	displayName: "VideoTutorial__VideoDescription"
})(["padding:16px 0;:not(:last-child ){border-bottom:2px solid ", ";padding-bottom:16px;}"], _colors2.default.$color_grey);

var VideoDescriptionTitle = _styledComponents2.default.p.withConfig({
	displayName: "VideoTutorial__VideoDescriptionTitle"
})(["margin-top:0;font-weight:600;"]);

var VideoDescriptionLink = (0, _makeOutboundLink.makeOutboundLink)(_styledComponents2.default.a.withConfig({
	displayName: "VideoTutorial__VideoDescriptionLink"
})(["color:", ";"], _colors2.default.$color_pink_dark));

/**
 * Creates a VideoDescription component, to be displayed next to the video.
 *
 * @param {Object} props The props to use for the component.
 *
 * @returns {ReactElement} The VideoDescription component.
 */
var VideoDescriptionItem = function VideoDescriptionItem(props) {
	return _react2.default.createElement(
		VideoDescription,
		{ className: props.className },
		_react2.default.createElement(
			VideoDescriptionTitle,
			null,
			props.title
		),
		_react2.default.createElement(
			"p",
			null,
			props.description
		),
		_react2.default.createElement(
			VideoDescriptionLink,
			{ href: props.link },
			props.linkText
		)
	);
};

VideoDescriptionItem.propTypes = {
	title: _propTypes2.default.string.isRequired,
	description: _propTypes2.default.string.isRequired,
	link: _propTypes2.default.string.isRequired,
	linkText: _propTypes2.default.string.isRequired,
	className: _propTypes2.default.string
};

VideoDescriptionItem.defaultProps = {
	className: "yoast-video-tutorial"
};

/**
 * Creates a VideoTutorial component that displays a YouTube video.
 *
 * The passed YouTube URLs must be of type "embed", e.g.:
 * https://www.youtube.com/embed/bIgcj_pPIbw
 *
 * @param {Object} props The props to use for the component.
 *
 * @returns {ReactElement} The VideoTutorial component.
 */
function VideoTutorial(props) {
	var hasParagraphs = props.paragraphs.length > 0;

	return _react2.default.createElement(
		VideoTutorialContainer,
		{ className: props.className + "__container" },
		_react2.default.createElement(
			VideoContainer,
			{
				className: props.className + "__video-container",
				hasParagraphs: hasParagraphs
			},
			_react2.default.createElement(_YouTubeVideo2.default, {
				src: props.src,
				title: props.title
			})
		),
		hasParagraphs && _react2.default.createElement(
			VideoDescriptions,
			{ className: props.className + "__descriptions" },
			props.paragraphs.map(function (paragraph) {
				return _react2.default.createElement(VideoDescriptionItem, _extends({ className: props.className + "__description",
					key: paragraph.link
				}, paragraph));
			})
		)
	);
}

VideoTutorial.propTypes = {
	src: _propTypes2.default.string.isRequired,
	title: _propTypes2.default.string.isRequired,
	paragraphs: _propTypes2.default.arrayOf(_propTypes2.default.shape(VideoDescriptionItem.propTypes)),
	className: _propTypes2.default.string
};

VideoTutorial.defaultProps = {
	className: "yoast-video-tutorial",
	paragraphs: []
};

/***/ }),

/***/ 1996:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = YouTubeVideo;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__(2);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _IFrame = __webpack_require__(426);

var _IFrame2 = _interopRequireDefault(_IFrame);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Responsive videos. */
/* Other common aspect ratios: 75% = 4:3, 66.66% = 3:2, 62.5% = 8:5 */
var YoutubeVideoContainer = _styledComponents2.default.div.withConfig({
	displayName: "YouTubeVideo__YoutubeVideoContainer"
})(["position:relative;padding-bottom:56.25%;height:0;overflow:hidden;iframe{position:absolute;top:0;left:0;width:100%;height:100%;}"]);

/**
 * Creates a YouTubeVideo component.
 *
 * @param {Object} props The props to use for the component.
 *
 * @returns {ReactElement} The YouTubeVideo component.
 */
function YouTubeVideo(props) {
	return _react2.default.createElement(
		YoutubeVideoContainer,
		null,
		_react2.default.createElement(_IFrame2.default, props)
	);
}

YouTubeVideo.propTypes = {
	width: _propTypes2.default.number,
	height: _propTypes2.default.number,
	src: _propTypes2.default.string.isRequired,
	title: _propTypes2.default.string.isRequired,
	frameBorder: _propTypes2.default.number,
	allowFullScreen: _propTypes2.default.bool
};

YouTubeVideo.defaultProps = {
	width: 560,
	height: 315,
	frameBorder: 0,
	allowFullScreen: true
};

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

module.exports = window.yoast.styledComponents;

/***/ }),

/***/ 22:
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

/***/ 238:
/***/ (function(module, exports, __webpack_require__) {

var buildSearchMethod = __webpack_require__(239);
var deprecate = __webpack_require__(145);
var deprecatedMessage = __webpack_require__(146);

module.exports = IndexCore;

/*
* Index class constructor.
* You should not use this method directly but use initIndex() function
*/
function IndexCore(algoliasearch, indexName) {
  this.indexName = indexName;
  this.as = algoliasearch;
  this.typeAheadArgs = null;
  this.typeAheadValueOption = null;

  // make sure every index instance has it's own cache
  this.cache = {};
}

/*
* Clear all queries in cache
*/
IndexCore.prototype.clearCache = function() {
  this.cache = {};
};

/*
* Search inside the index using XMLHttpRequest request (Using a POST query to
* minimize number of OPTIONS queries: Cross-Origin Resource Sharing).
*
* @param {string} [query] the full text query
* @param {object} [args] (optional) if set, contains an object with query parameters:
* - page: (integer) Pagination parameter used to select the page to retrieve.
*                   Page is zero-based and defaults to 0. Thus,
*                   to retrieve the 10th page you need to set page=9
* - hitsPerPage: (integer) Pagination parameter used to select the number of hits per page. Defaults to 20.
* - attributesToRetrieve: a string that contains the list of object attributes
* you want to retrieve (let you minimize the answer size).
*   Attributes are separated with a comma (for example "name,address").
*   You can also use an array (for example ["name","address"]).
*   By default, all attributes are retrieved. You can also use '*' to retrieve all
*   values when an attributesToRetrieve setting is specified for your index.
* - attributesToHighlight: a string that contains the list of attributes you
*   want to highlight according to the query.
*   Attributes are separated by a comma. You can also use an array (for example ["name","address"]).
*   If an attribute has no match for the query, the raw value is returned.
*   By default all indexed text attributes are highlighted.
*   You can use `*` if you want to highlight all textual attributes.
*   Numerical attributes are not highlighted.
*   A matchLevel is returned for each highlighted attribute and can contain:
*      - full: if all the query terms were found in the attribute,
*      - partial: if only some of the query terms were found,
*      - none: if none of the query terms were found.
* - attributesToSnippet: a string that contains the list of attributes to snippet alongside
* the number of words to return (syntax is `attributeName:nbWords`).
*    Attributes are separated by a comma (Example: attributesToSnippet=name:10,content:10).
*    You can also use an array (Example: attributesToSnippet: ['name:10','content:10']).
*    By default no snippet is computed.
* - minWordSizefor1Typo: the minimum number of characters in a query word to accept one typo in this word.
* Defaults to 3.
* - minWordSizefor2Typos: the minimum number of characters in a query word
* to accept two typos in this word. Defaults to 7.
* - getRankingInfo: if set to 1, the result hits will contain ranking
* information in _rankingInfo attribute.
* - aroundLatLng: search for entries around a given
* latitude/longitude (specified as two floats separated by a comma).
*   For example aroundLatLng=47.316669,5.016670).
*   You can specify the maximum distance in meters with the aroundRadius parameter (in meters)
*   and the precision for ranking with aroundPrecision
*   (for example if you set aroundPrecision=100, two objects that are distant of
*   less than 100m will be considered as identical for "geo" ranking parameter).
*   At indexing, you should specify geoloc of an object with the _geoloc attribute
*   (in the form {"_geoloc":{"lat":48.853409, "lng":2.348800}})
* - insideBoundingBox: search entries inside a given area defined by the two extreme points
* of a rectangle (defined by 4 floats: p1Lat,p1Lng,p2Lat,p2Lng).
*   For example insideBoundingBox=47.3165,4.9665,47.3424,5.0201).
*   At indexing, you should specify geoloc of an object with the _geoloc attribute
*   (in the form {"_geoloc":{"lat":48.853409, "lng":2.348800}})
* - numericFilters: a string that contains the list of numeric filters you want to
* apply separated by a comma.
*   The syntax of one filter is `attributeName` followed by `operand` followed by `value`.
*   Supported operands are `<`, `<=`, `=`, `>` and `>=`.
*   You can have multiple conditions on one attribute like for example numericFilters=price>100,price<1000.
*   You can also use an array (for example numericFilters: ["price>100","price<1000"]).
* - tagFilters: filter the query by a set of tags. You can AND tags by separating them by commas.
*   To OR tags, you must add parentheses. For example, tags=tag1,(tag2,tag3) means tag1 AND (tag2 OR tag3).
*   You can also use an array, for example tagFilters: ["tag1",["tag2","tag3"]]
*   means tag1 AND (tag2 OR tag3).
*   At indexing, tags should be added in the _tags** attribute
*   of objects (for example {"_tags":["tag1","tag2"]}).
* - facetFilters: filter the query by a list of facets.
*   Facets are separated by commas and each facet is encoded as `attributeName:value`.
*   For example: `facetFilters=category:Book,author:John%20Doe`.
*   You can also use an array (for example `["category:Book","author:John%20Doe"]`).
* - facets: List of object attributes that you want to use for faceting.
*   Comma separated list: `"category,author"` or array `['category','author']`
*   Only attributes that have been added in **attributesForFaceting** index setting
*   can be used in this parameter.
*   You can also use `*` to perform faceting on all attributes specified in **attributesForFaceting**.
* - queryType: select how the query words are interpreted, it can be one of the following value:
*    - prefixAll: all query words are interpreted as prefixes,
*    - prefixLast: only the last word is interpreted as a prefix (default behavior),
*    - prefixNone: no query word is interpreted as a prefix. This option is not recommended.
* - optionalWords: a string that contains the list of words that should
* be considered as optional when found in the query.
*   Comma separated and array are accepted.
* - distinct: If set to 1, enable the distinct feature (disabled by default)
* if the attributeForDistinct index setting is set.
*   This feature is similar to the SQL "distinct" keyword: when enabled
*   in a query with the distinct=1 parameter,
*   all hits containing a duplicate value for the attributeForDistinct attribute are removed from results.
*   For example, if the chosen attribute is show_name and several hits have
*   the same value for show_name, then only the best
*   one is kept and others are removed.
* - restrictSearchableAttributes: List of attributes you want to use for
* textual search (must be a subset of the attributesToIndex index setting)
* either comma separated or as an array
* @param {function} [callback] the result callback called with two arguments:
*  error: null or Error('message'). If false, the content contains the error.
*  content: the server answer that contains the list of results.
*/
IndexCore.prototype.search = buildSearchMethod('query');

/*
* -- BETA --
* Search a record similar to the query inside the index using XMLHttpRequest request (Using a POST query to
* minimize number of OPTIONS queries: Cross-Origin Resource Sharing).
*
* @param {string} [query] the similar query
* @param {object} [args] (optional) if set, contains an object with query parameters.
*   All search parameters are supported (see search function), restrictSearchableAttributes and facetFilters
*   are the two most useful to restrict the similar results and get more relevant content
*/
IndexCore.prototype.similarSearch = buildSearchMethod('similarQuery');

/*
* Browse index content. The response content will have a `cursor` property that you can use
* to browse subsequent pages for this query. Use `index.browseFrom(cursor)` when you want.
*
* @param {string} query - The full text query
* @param {Object} [queryParameters] - Any search query parameter
* @param {Function} [callback] - The result callback called with two arguments
*   error: null or Error('message')
*   content: the server answer with the browse result
* @return {Promise|undefined} Returns a promise if no callback given
* @example
* index.browse('cool songs', {
*   tagFilters: 'public,comments',
*   hitsPerPage: 500
* }, callback);
* @see {@link https://www.algolia.com/doc/rest_api#Browse|Algolia REST API Documentation}
*/
IndexCore.prototype.browse = function(query, queryParameters, callback) {
  var merge = __webpack_require__(240);

  var indexObj = this;

  var page;
  var hitsPerPage;

  // we check variadic calls that are not the one defined
  // .browse()/.browse(fn)
  // => page = 0
  if (arguments.length === 0 || arguments.length === 1 && typeof arguments[0] === 'function') {
    page = 0;
    callback = arguments[0];
    query = undefined;
  } else if (typeof arguments[0] === 'number') {
    // .browse(2)/.browse(2, 10)/.browse(2, fn)/.browse(2, 10, fn)
    page = arguments[0];
    if (typeof arguments[1] === 'number') {
      hitsPerPage = arguments[1];
    } else if (typeof arguments[1] === 'function') {
      callback = arguments[1];
      hitsPerPage = undefined;
    }
    query = undefined;
    queryParameters = undefined;
  } else if (typeof arguments[0] === 'object') {
    // .browse(queryParameters)/.browse(queryParameters, cb)
    if (typeof arguments[1] === 'function') {
      callback = arguments[1];
    }
    queryParameters = arguments[0];
    query = undefined;
  } else if (typeof arguments[0] === 'string' && typeof arguments[1] === 'function') {
    // .browse(query, cb)
    callback = arguments[1];
    queryParameters = undefined;
  }

  // otherwise it's a .browse(query)/.browse(query, queryParameters)/.browse(query, queryParameters, cb)

  // get search query parameters combining various possible calls
  // to .browse();
  queryParameters = merge({}, queryParameters || {}, {
    page: page,
    hitsPerPage: hitsPerPage,
    query: query
  });

  var params = this.as._getSearchParams(queryParameters, '');

  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/browse',
    body: {params: params},
    hostType: 'read',
    callback: callback
  });
};

/*
* Continue browsing from a previous position (cursor), obtained via a call to `.browse()`.
*
* @param {string} query - The full text query
* @param {Object} [queryParameters] - Any search query parameter
* @param {Function} [callback] - The result callback called with two arguments
*   error: null or Error('message')
*   content: the server answer with the browse result
* @return {Promise|undefined} Returns a promise if no callback given
* @example
* index.browseFrom('14lkfsakl32', callback);
* @see {@link https://www.algolia.com/doc/rest_api#Browse|Algolia REST API Documentation}
*/
IndexCore.prototype.browseFrom = function(cursor, callback) {
  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/browse',
    body: {cursor: cursor},
    hostType: 'read',
    callback: callback
  });
};

/*
* Search for facet values
* https://www.algolia.com/doc/rest-api/search#search-for-facet-values
*
* @param {string} params.facetName Facet name, name of the attribute to search for values in.
* Must be declared as a facet
* @param {string} params.facetQuery Query for the facet search
* @param {string} [params.*] Any search parameter of Algolia,
* see https://www.algolia.com/doc/api-client/javascript/search#search-parameters
* Pagination is not supported. The page and hitsPerPage parameters will be ignored.
* @param callback (optional)
*/
IndexCore.prototype.searchForFacetValues = function(params, callback) {
  var clone = __webpack_require__(38);
  var omit = __webpack_require__(241);
  var usage = 'Usage: index.searchForFacetValues({facetName, facetQuery, ...params}[, callback])';

  if (params.facetName === undefined || params.facetQuery === undefined) {
    throw new Error(usage);
  }

  var facetName = params.facetName;
  var filteredParams = omit(clone(params), function(keyName) {
    return keyName === 'facetName';
  });
  var searchParameters = this.as._getSearchParams(filteredParams, '');

  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' +
      encodeURIComponent(this.indexName) + '/facets/' + encodeURIComponent(facetName) + '/query',
    hostType: 'read',
    body: {params: searchParameters},
    callback: callback
  });
};

IndexCore.prototype.searchFacet = deprecate(function(params, callback) {
  return this.searchForFacetValues(params, callback);
}, deprecatedMessage(
  'index.searchFacet(params[, callback])',
  'index.searchForFacetValues(params[, callback])'
));

IndexCore.prototype._search = function(params, url, callback, additionalUA) {
  return this.as._jsonRequest({
    cache: this.cache,
    method: 'POST',
    url: url || '/1/indexes/' + encodeURIComponent(this.indexName) + '/query',
    body: {params: params},
    hostType: 'read',
    fallback: {
      method: 'GET',
      url: '/1/indexes/' + encodeURIComponent(this.indexName),
      body: {params: params}
    },
    callback: callback,
    additionalUA: additionalUA
  });
};

/*
* Get an object from this index
*
* @param objectID the unique identifier of the object to retrieve
* @param attrs (optional) if set, contains the array of attribute names to retrieve
* @param callback (optional) the result callback called with two arguments
*  error: null or Error('message')
*  content: the object to retrieve or the error message if a failure occured
*/
IndexCore.prototype.getObject = function(objectID, attrs, callback) {
  var indexObj = this;

  if (arguments.length === 1 || typeof attrs === 'function') {
    callback = attrs;
    attrs = undefined;
  }

  var params = '';
  if (attrs !== undefined) {
    params = '?attributes=';
    for (var i = 0; i < attrs.length; ++i) {
      if (i !== 0) {
        params += ',';
      }
      params += attrs[i];
    }
  }

  return this.as._jsonRequest({
    method: 'GET',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/' + encodeURIComponent(objectID) + params,
    hostType: 'read',
    callback: callback
  });
};

/*
* Get several objects from this index
*
* @param objectIDs the array of unique identifier of objects to retrieve
*/
IndexCore.prototype.getObjects = function(objectIDs, attributesToRetrieve, callback) {
  var isArray = __webpack_require__(19);
  var map = __webpack_require__(51);

  var usage = 'Usage: index.getObjects(arrayOfObjectIDs[, callback])';

  if (!isArray(objectIDs)) {
    throw new Error(usage);
  }

  var indexObj = this;

  if (arguments.length === 1 || typeof attributesToRetrieve === 'function') {
    callback = attributesToRetrieve;
    attributesToRetrieve = undefined;
  }

  var body = {
    requests: map(objectIDs, function prepareRequest(objectID) {
      var request = {
        indexName: indexObj.indexName,
        objectID: objectID
      };

      if (attributesToRetrieve) {
        request.attributesToRetrieve = attributesToRetrieve.join(',');
      }

      return request;
    })
  };

  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/*/objects',
    hostType: 'read',
    body: body,
    callback: callback
  });
};

IndexCore.prototype.as = null;
IndexCore.prototype.indexName = null;
IndexCore.prototype.typeAheadArgs = null;
IndexCore.prototype.typeAheadValueOption = null;


/***/ }),

/***/ 239:
/***/ (function(module, exports, __webpack_require__) {

module.exports = buildSearchMethod;

var errors = __webpack_require__(49);

/**
 * Creates a search method to be used in clients
 * @param {string} queryParam the name of the attribute used for the query
 * @param {string} url the url
 * @return {function} the search method
 */
function buildSearchMethod(queryParam, url) {
  /**
   * The search method. Prepares the data and send the query to Algolia.
   * @param {string} query the string used for query search
   * @param {object} args additional parameters to send with the search
   * @param {function} [callback] the callback to be called with the client gets the answer
   * @return {undefined|Promise} If the callback is not provided then this methods returns a Promise
   */
  return function search(query, args, callback) {
    // warn V2 users on how to search
    if (typeof query === 'function' && typeof args === 'object' ||
      typeof callback === 'object') {
      // .search(query, params, cb)
      // .search(cb, params)
      throw new errors.AlgoliaSearchError('index.search usage is index.search(query, params, cb)');
    }

    // Normalizing the function signature
    if (arguments.length === 0 || typeof query === 'function') {
      // Usage : .search(), .search(cb)
      callback = query;
      query = '';
    } else if (arguments.length === 1 || typeof args === 'function') {
      // Usage : .search(query/args), .search(query, cb)
      callback = args;
      args = undefined;
    }
    // At this point we have 3 arguments with values

    // Usage : .search(args) // careful: typeof null === 'object'
    if (typeof query === 'object' && query !== null) {
      args = query;
      query = undefined;
    } else if (query === undefined || query === null) { // .search(undefined/null)
      query = '';
    }

    var params = '';

    if (query !== undefined) {
      params += queryParam + '=' + encodeURIComponent(query);
    }

    var additionalUA;
    if (args !== undefined) {
      if (args.additionalUA) {
        additionalUA = args.additionalUA;
        delete args.additionalUA;
      }
      // `_getSearchParams` will augment params, do not be fooled by the = versus += from previous if
      params = this.as._getSearchParams(args, params);
    }


    return this._search(params, url, callback, additionalUA);
  };
}


/***/ }),

/***/ 24:
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
  module.exports = __webpack_require__(386)();
}


/***/ }),

/***/ 240:
/***/ (function(module, exports, __webpack_require__) {

var foreach = __webpack_require__(50);

module.exports = function merge(destination/* , sources */) {
  var sources = Array.prototype.slice.call(arguments);

  foreach(sources, function(source) {
    for (var keyName in source) {
      if (source.hasOwnProperty(keyName)) {
        if (typeof destination[keyName] === 'object' && typeof source[keyName] === 'object') {
          destination[keyName] = merge({}, destination[keyName], source[keyName]);
        } else if (source[keyName] !== undefined) {
          destination[keyName] = source[keyName];
        }
      }
    }
  });

  return destination;
};


/***/ }),

/***/ 241:
/***/ (function(module, exports, __webpack_require__) {

module.exports = function omit(obj, test) {
  var keys = __webpack_require__(460);
  var foreach = __webpack_require__(50);

  var filtered = {};

  foreach(keys(obj), function doFilter(keyName) {
    if (test(keyName) !== true) {
      filtered[keyName] = obj[keyName];
    }
  });

  return filtered;
};


/***/ }),

/***/ 242:
/***/ (function(module, exports) {

// Parse cloud does not supports setTimeout
// We do not store a setTimeout reference in the client everytime
// We only fallback to a fake setTimeout when not available
// setTimeout cannot be override globally sadly
module.exports = function exitPromise(fn, _setTimeout) {
  _setTimeout(fn, 0);
};


/***/ }),

/***/ 243:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* jshint node:true */



var IntlMessageFormat = __webpack_require__(480)['default'];

// Add all locale data to `IntlMessageFormat`. This module will be ignored when
// bundling for the browser with Browserify/Webpack.
__webpack_require__(487);

// Re-export `IntlMessageFormat` as the CommonJS default exports with all the
// locale data registered, and with English set as the default locale. Define
// the `default` prop for use with other compiled ES6 Modules.
exports = module.exports = IntlMessageFormat;
exports['default'] = exports;


/***/ }),

/***/ 244:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */


exports.extend = extend;
var hop = Object.prototype.hasOwnProperty;

function extend(obj) {
    var sources = Array.prototype.slice.call(arguments, 1),
        i, len, source, key;

    for (i = 0, len = sources.length; i < len; i += 1) {
        source = sources[i];
        if (!source) { continue; }

        for (key in source) {
            if (hop.call(source, key)) {
                obj[key] = source[key];
            }
        }
    }

    return obj;
}
exports.hop = hop;

//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 245:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export childrenPropType */
/* unused harmony export onSelectPropType */
/* unused harmony export selectedIndexPropType */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_childrenDeepMap__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helpers_elementTypes__ = __webpack_require__(112);


function childrenPropType(props, propName, componentName) {
  var error;
  var tabsCount = 0;
  var panelsCount = 0;
  var tabListFound = false;
  var listTabs = [];
  var children = props[propName];
  Object(__WEBPACK_IMPORTED_MODULE_0__helpers_childrenDeepMap__["a" /* deepForEach */])(children, function (child) {
    if (Object(__WEBPACK_IMPORTED_MODULE_1__helpers_elementTypes__["b" /* isTabList */])(child)) {
      if (child.props && child.props.children && typeof child.props.children === 'object') {
        Object(__WEBPACK_IMPORTED_MODULE_0__helpers_childrenDeepMap__["a" /* deepForEach */])(child.props.children, function (listChild) {
          return listTabs.push(listChild);
        });
      }

      if (tabListFound) {
        error = new Error("Found multiple 'TabList' components inside 'Tabs'. Only one is allowed.");
      }

      tabListFound = true;
    }

    if (Object(__WEBPACK_IMPORTED_MODULE_1__helpers_elementTypes__["a" /* isTab */])(child)) {
      if (!tabListFound || listTabs.indexOf(child) === -1) {
        error = new Error("Found a 'Tab' component outside of the 'TabList' component. 'Tab' components " + "have to be inside the 'TabList' component.");
      }

      tabsCount++;
    } else if (Object(__WEBPACK_IMPORTED_MODULE_1__helpers_elementTypes__["c" /* isTabPanel */])(child)) {
      panelsCount++;
    }
  });

  if (!error && tabsCount !== panelsCount) {
    error = new Error("There should be an equal number of 'Tab' and 'TabPanel' in `" + componentName + "`. " + ("Received " + tabsCount + " 'Tab' and " + panelsCount + " 'TabPanel'."));
  }

  return error;
}
function onSelectPropType(props, propName, componentName, location, propFullName) {
  var prop = props[propName];
  var name = propFullName || propName;
  var error = null;

  if (prop && typeof prop !== 'function') {
    error = new Error("Invalid " + location + " `" + name + "` of type `" + typeof prop + "` supplied " + ("to `" + componentName + "`, expected `function`."));
  } else if (props.selectedIndex != null && prop == null) {
    error = new Error("The " + location + " `" + name + "` is marked as required in `" + componentName + "`, but " + "its value is `undefined` or `null`.\n" + "`onSelect` is required when `selectedIndex` is also set. Not doing so will " + "make the tabs not do anything, as `selectedIndex` indicates that you want to " + "handle the selected tab yourself.\n" + "If you only want to set the inital tab replace `selectedIndex` with `defaultIndex`.");
  }

  return error;
}
function selectedIndexPropType(props, propName, componentName, location, propFullName) {
  var prop = props[propName];
  var name = propFullName || propName;
  var error = null;

  if (prop != null && typeof prop !== 'number') {
    error = new Error("Invalid " + location + " `" + name + "` of type `" + typeof prop + "` supplied to " + ("`" + componentName + "`, expected `number`."));
  } else if (props.defaultIndex != null && prop != null) {
    return new Error("The " + location + " `" + name + "` cannot be used together with `defaultIndex` " + ("in `" + componentName + "`.\n") + ("Either remove `" + name + "` to let `" + componentName + "` handle the selected ") + "tab internally or remove `defaultIndex` to handle it yourself.");
  }

  return error;
}

/***/ }),

/***/ 246:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = uuid;
/* harmony export (immutable) */ __webpack_exports__["b"] = reset;
// Get a universally unique identifier
var count = 0;
function uuid() {
  return "react-tabs-" + count++;
}
function reset() {
  count = 0;
}

/***/ }),

/***/ 247:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = getTabsCount;
/* harmony export (immutable) */ __webpack_exports__["a"] = getPanelsCount;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helpers_childrenDeepMap__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__elementTypes__ = __webpack_require__(112);


function getTabsCount(children) {
  var tabCount = 0;
  Object(__WEBPACK_IMPORTED_MODULE_0__helpers_childrenDeepMap__["a" /* deepForEach */])(children, function (child) {
    if (Object(__WEBPACK_IMPORTED_MODULE_1__elementTypes__["a" /* isTab */])(child)) tabCount++;
  });
  return tabCount;
}
function getPanelsCount(children) {
  var panelCount = 0;
  Object(__WEBPACK_IMPORTED_MODULE_0__helpers_childrenDeepMap__["a" /* deepForEach */])(children, function (child) {
    if (Object(__WEBPACK_IMPORTED_MODULE_1__elementTypes__["c" /* isTabPanel */])(child)) panelCount++;
  });
  return panelCount;
}

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

/***/ 256:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),

/***/ 258:
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(26),
    isSymbol = __webpack_require__(118);

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

/***/ 26:
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

/***/ 261:
/***/ (function(module, exports) {

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
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
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
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
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
  } else if (listeners) {
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

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
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


/***/ }),

/***/ 27:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.icons = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__(2);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_VIEWBOX = "0 0 1792 1792";
/* eslint-disable max-len, quote-props */
var icons = exports.icons = {
	"angle-down": { viewbox: DEFAULT_VIEWBOX, path: "M1395 736q0 13-10 23l-466 466q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l393 393 393-393q10-10 23-10t23 10l50 50q10 10 10 23z" },
	"angle-left": { viewbox: DEFAULT_VIEWBOX, path: "M1203 544q0 13-10 23l-393 393 393 393q10 10 10 23t-10 23l-50 50q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l50 50q10 10 10 23z" },
	"angle-right": { viewbox: DEFAULT_VIEWBOX, path: "M1171 960q0 13-10 23l-466 466q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l393-393-393-393q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l466 466q10 10 10 23z" },
	"angle-up": { viewbox: DEFAULT_VIEWBOX, path: "M1395 1184q0 13-10 23l-50 50q-10 10-23 10t-23-10l-393-393-393 393q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l466 466q10 10 10 23z" },
	"arrow-down": { viewbox: DEFAULT_VIEWBOX, path: "M896 1791L120.91 448.5L1671.09 448.5z" },
	"arrow-left": { viewbox: DEFAULT_VIEWBOX, path: "M1343.5 1671.09L1 896L1343.5 120.91z" },
	"arrow-right": { viewbox: DEFAULT_VIEWBOX, path: "M1791 896L448.5 1671.09L448.5 120.91z" },
	"arrow-up": { viewbox: DEFAULT_VIEWBOX, path: "M1671.09 1343.5L120.91 1343.5L896 1z" },
	"circle": { viewbox: DEFAULT_VIEWBOX, path: "M1664 896q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z" },
	"desktop": { viewbox: DEFAULT_VIEWBOX, path: "M1728 992v-832q0-13-9.5-22.5t-22.5-9.5h-1600q-13 0-22.5 9.5t-9.5 22.5v832q0 13 9.5 22.5t22.5 9.5h1600q13 0 22.5-9.5t9.5-22.5zm128-832v1088q0 66-47 113t-113 47h-544q0 37 16 77.5t32 71 16 43.5q0 26-19 45t-45 19h-512q-26 0-45-19t-19-45q0-14 16-44t32-70 16-78h-544q-66 0-113-47t-47-113v-1088q0-66 47-113t113-47h1600q66 0 113 47t47 113z" },
	"edit": { viewbox: DEFAULT_VIEWBOX, path: "M491 1536l91-91-235-235-91 91v107h128v128h107zm523-928q0-22-22-22-10 0-17 7l-542 542q-7 7-7 17 0 22 22 22 10 0 17-7l542-542q7-7 7-17zm-54-192l416 416-832 832h-416v-416zm683 96q0 53-37 90l-166 166-416-416 166-165q36-38 90-38 53 0 91 38l235 234q37 39 37 91z" },
	"eye": { viewbox: DEFAULT_VIEWBOX, path: "M1664 960q-152-236-381-353 61 104 61 225 0 185-131.5 316.5t-316.5 131.5-316.5-131.5-131.5-316.5q0-121 61-225-229 117-381 353 133 205 333.5 326.5t434.5 121.5 434.5-121.5 333.5-326.5zm-720-384q0-20-14-34t-34-14q-125 0-214.5 89.5t-89.5 214.5q0 20 14 34t34 14 34-14 14-34q0-86 61-147t147-61q20 0 34-14t14-34zm848 384q0 34-20 69-140 230-376.5 368.5t-499.5 138.5-499.5-139-376.5-368q-20-35-20-69t20-69q140-229 376.5-368t499.5-139 499.5 139 376.5 368q20 35 20 69z" },
	"file-text": { viewbox: DEFAULT_VIEWBOX, path: "M1596 380q28 28 48 76t20 88v1152q0 40-28 68t-68 28h-1344q-40 0-68-28t-28-68v-1600q0-40 28-68t68-28h896q40 0 88 20t76 48zm-444-244v376h376q-10-29-22-41l-313-313q-12-12-41-22zm384 1528v-1024h-416q-40 0-68-28t-28-68v-416h-768v1536h1280zm-1024-864q0-14 9-23t23-9h704q14 0 23 9t9 23v64q0 14-9 23t-23 9h-704q-14 0-23-9t-9-23v-64zm736 224q14 0 23 9t9 23v64q0 14-9 23t-23 9h-704q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h704zm0 256q14 0 23 9t9 23v64q0 14-9 23t-23 9h-704q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h704z" },
	"gear": { viewbox: DEFAULT_VIEWBOX, path: "M1800 800h-218q-26 -107 -81 -193l154 -154l-210 -210l-154 154q-88 -55 -191 -79v-218h-300v218q-103 24 -191 79l-154 -154l-212 212l154 154q-55 88 -79 191h-218v297h217q23 101 80 194l-154 154l210 210l154 -154q85 54 193 81v218h300v-218q103 -24 191 -79 l154 154l212 -212l-154 -154q57 -93 80 -194h217v-297zM950 650q124 0 212 88t88 212t-88 212t-212 88t-212 -88t-88 -212t88 -212t212 -88z" },
	"key": { viewbox: DEFAULT_VIEWBOX, path: "M832 512q0-80-56-136t-136-56-136 56-56 136q0 42 19 83-41-19-83-19-80 0-136 56t-56 136 56 136 136 56 136-56 56-136q0-42-19-83 41 19 83 19 80 0 136-56t56-136zm851 704q0 17-49 66t-66 49q-9 0-28.5-16t-36.5-33-38.5-40-24.5-26l-96 96 220 220q28 28 28 68 0 42-39 81t-81 39q-40 0-68-28l-671-671q-176 131-365 131-163 0-265.5-102.5t-102.5-265.5q0-160 95-313t248-248 313-95q163 0 265.5 102.5t102.5 265.5q0 189-131 365l355 355 96-96q-3-3-26-24.5t-40-38.5-33-36.5-16-28.5q0-17 49-66t66-49q13 0 23 10 6 6 46 44.5t82 79.5 86.5 86 73 78 28.5 41z" },
	"list": { viewbox: DEFAULT_VIEWBOX, path: "M384 1408q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm0-512q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm1408 416v192q0 13-9.5 22.5t-22.5 9.5h-1216q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h1216q13 0 22.5 9.5t9.5 22.5zm-1408-928q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm1408 416v192q0 13-9.5 22.5t-22.5 9.5h-1216q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h1216q13 0 22.5 9.5t9.5 22.5zm0-512v192q0 13-9.5 22.5t-22.5 9.5h-1216q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h1216q13 0 22.5 9.5t9.5 22.5z" },
	"mobile": { viewbox: DEFAULT_VIEWBOX, path: "M976 1408q0-33-23.5-56.5t-56.5-23.5-56.5 23.5-23.5 56.5 23.5 56.5 56.5 23.5 56.5-23.5 23.5-56.5zm208-160v-704q0-13-9.5-22.5t-22.5-9.5h-512q-13 0-22.5 9.5t-9.5 22.5v704q0 13 9.5 22.5t22.5 9.5h512q13 0 22.5-9.5t9.5-22.5zm-192-848q0-16-16-16h-160q-16 0-16 16t16 16h160q16 0 16-16zm288-16v1024q0 52-38 90t-90 38h-512q-52 0-90-38t-38-90v-1024q0-52 38-90t90-38h512q52 0 90 38t38 90z" },
	"plus": { viewbox: DEFAULT_VIEWBOX, path: "M1600 736v192q0 40-28 68t-68 28h-416v416q0 40-28 68t-68 28h-192q-40 0-68-28t-28-68v-416h-416q-40 0-68-28t-28-68v-192q0-40 28-68t68-28h416v-416q0-40 28-68t68-28h192q40 0 68 28t28 68v416h416q40 0 68 28t28 68z" },
	"plus-circle": { viewbox: DEFAULT_VIEWBOX, path: "M1344 960v-128q0-26-19-45t-45-19h-256v-256q0-26-19-45t-45-19h-128q-26 0-45 19t-19 45v256h-256q-26 0-45 19t-19 45v128q0 26 19 45t45 19h256v256q0 26 19 45t45 19h128q26 0 45-19t19-45v-256h256q26 0 45-19t19-45zm320-64q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z" },
	"question-circle": { viewbox: DEFAULT_VIEWBOX, path: "M1024 1376v-192q0-14-9-23t-23-9h-192q-14 0-23 9t-9 23v192q0 14 9 23t23 9h192q14 0 23-9t9-23zm256-672q0-88-55.5-163t-138.5-116-170-41q-243 0-371 213-15 24 8 42l132 100q7 6 19 6 16 0 25-12 53-68 86-92 34-24 86-24 48 0 85.5 26t37.5 59q0 38-20 61t-68 45q-63 28-115.5 86.5t-52.5 125.5v36q0 14 9 23t23 9h192q14 0 23-9t9-23q0-19 21.5-49.5t54.5-49.5q32-18 49-28.5t46-35 44.5-48 28-60.5 12.5-81zm384 192q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z" },
	"search": { viewbox: DEFAULT_VIEWBOX, path: "M1216 832q0-185-131.5-316.5t-316.5-131.5-316.5 131.5-131.5 316.5 131.5 316.5 316.5 131.5 316.5-131.5 131.5-316.5zm512 832q0 52-38 90t-90 38q-54 0-90-38l-343-342q-179 124-399 124-143 0-273.5-55.5t-225-150-150-225-55.5-273.5 55.5-273.5 150-225 225-150 273.5-55.5 273.5 55.5 225 150 150 225 55.5 273.5q0 220-124 399l343 343q37 37 37 90z" },
	"seo-score-bad": { viewbox: "0 0 496 512", path: "M248 8C111 8 0 119 0 256s111 248 248 248s248-111 248-248S385 8 248 8z M328 176c17.7 0 32 14.3 32 32 s-14.3 32-32 32s-32-14.3-32-32S310.3 176 328 176z M168 176c17.7 0 32 14.3 32 32s-14.3 32-32 32s-32-14.3-32-32S150.3 176 168 176 z M338.2 394.2C315.8 367.4 282.9 352 248 352s-67.8 15.4-90.2 42.2c-13.5 16.3-38.1-4.2-24.6-20.5C161.7 339.6 203.6 320 248 320 s86.3 19.6 114.7 53.8C376.3 390 351.7 410.5 338.2 394.2L338.2 394.2z" },
	"seo-score-good": { viewbox: "0 0 496 512", path: "M248 8C111 8 0 119 0 256s111 248 248 248s248-111 248-248S385 8 248 8z M328 176c17.7 0 32 14.3 32 32 s-14.3 32-32 32s-32-14.3-32-32S310.3 176 328 176z M168 176c17.7 0 32 14.3 32 32s-14.3 32-32 32s-32-14.3-32-32S150.3 176 168 176 z M362.8 346.2C334.3 380.4 292.5 400 248 400s-86.3-19.6-114.8-53.8c-13.6-16.3 11-36.7 24.6-20.5c22.4 26.9 55.2 42.2 90.2 42.2 s67.8-15.4 90.2-42.2C351.6 309.5 376.3 329.9 362.8 346.2L362.8 346.2z" },
	"seo-score-none": { viewbox: "0 0 496 512", path: "M248 8C111 8 0 119 0 256s111 248 248 248s248-111 248-248S385 8 248 8z" },
	"seo-score-ok": { viewbox: "0 0 496 512", path: "M248 8C111 8 0 119 0 256s111 248 248 248s248-111 248-248S385 8 248 8z M168 176c17.7 0 32 14.3 32 32 s-14.3 32-32 32s-32-14.3-32-32S150.3 176 168 176z M344 368H152c-21.2 0-21.2-32 0-32h192C365.2 336 365.2 368 344 368z M328 240 c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32S345.7 240 328 240z" },
	"times": { viewbox: DEFAULT_VIEWBOX, path: "M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z" },
	"times-circle": { viewbox: "0 0 20 20", path: "M10 2c4.42 0 8 3.58 8 8s-3.58 8-8 8-8-3.58-8-8 3.58-8 8-8zm5 11l-3-3 3-3-2-2-3 3-3-3-2 2 3 3-3 3 2 2 3-3 3 3z" }
};
/* eslint-enable */

/**
 * Returns the SvgIcon component.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} SvgIcon component.
 */

var SvgIcon = function (_React$Component) {
	_inherits(SvgIcon, _React$Component);

	function SvgIcon() {
		_classCallCheck(this, SvgIcon);

		return _possibleConstructorReturn(this, (SvgIcon.__proto__ || Object.getPrototypeOf(SvgIcon)).apply(this, arguments));
	}

	_createClass(SvgIcon, [{
		key: "render",

		/**
   * Renders an SVG icon.
   *
   * @returns {ReactElement|null} The rendered SVG icon.
   */
		value: function render() {
			var _props = this.props,
			    icon = _props.icon,
			    className = _props.className,
			    color = _props.color,
			    size = _props.size;

			var iconName = icons[icon];

			if (!iconName) {
				console.warn("Invalid icon name passed to the SvgIcon component.");
				return null;
			}

			var path = iconName.path;
			var viewbox = iconName.viewbox;

			var iconClass = ["yoast-svg-icon", "yoast-svg-icon-" + icon, className].filter(Boolean).join(" ");

			var StyledSvg = _styledComponents2.default.svg.withConfig({
				displayName: "SvgIcon__StyledSvg"
			})(["width:", ";height:", ";flex:none;"], function (props) {
				return props.size;
			}, function (props) {
				return props.size;
			});

			return _react2.default.createElement(
				StyledSvg,
				{
					"aria-hidden": true,
					role: "img",
					focusable: "false",
					size: size,
					className: iconClass,
					xmlns: "http://www.w3.org/2000/svg",
					viewBox: viewbox,
					fill: color
				},
				_react2.default.createElement("path", { d: path })
			);
		}
	}]);

	return SvgIcon;
}(_react2.default.Component);

exports.default = SvgIcon;


SvgIcon.propTypes = {
	icon: _propTypes2.default.string.isRequired,
	color: _propTypes2.default.string,
	size: _propTypes2.default.string,
	className: _propTypes2.default.string
};

SvgIcon.defaultProps = {
	size: "16px"
};

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

/***/ 33:
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(256);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


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

/***/ 38:
/***/ (function(module, exports) {

module.exports = function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
};


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

/***/ 386:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var emptyFunction = __webpack_require__(548);
var invariant = __webpack_require__(1017);
var ReactPropTypesSecret = __webpack_require__(387);

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

/***/ 387:
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

/***/ 39:
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(65),
    getRawTag = __webpack_require__(436),
    objectToString = __webpack_require__(437);

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

/***/ 417:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(24);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactIntl = __webpack_require__(525);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The component that will be wrapped by the Higher Order component.
 *
 * This component will render an IntlProvider when the locale-data promise is resolved.
 */
var IntlProvider = function (_React$Component) {
	_inherits(IntlProvider, _React$Component);

	function IntlProvider() {
		_classCallCheck(this, IntlProvider);

		return _possibleConstructorReturn(this, (IntlProvider.__proto__ || Object.getPrototypeOf(IntlProvider)).apply(this, arguments));
	}

	_createClass(IntlProvider, [{
		key: "render",


		/**
   * Renders the provider component.
   *
   * @returns {IntlProviderOriginal|string} String if Intl is missing, IntlProviderOriginal if not.
   */
		value: function render() {
			if (typeof window.Intl === "undefined") {
				return yoast._wp.element.createElement(
					"div",
					{ className: "notice notice-error" },
					yoast._wp.element.createElement(
						"p",
						null,
						"Yoast SEO detected that you are using a browser that doesn't support all the features we require. Please try using a different browser."
					)
				);
			}

			return yoast._wp.element.createElement(
				_reactIntl.IntlProvider,
				{
					locale: "en",
					messages: this.props.messages
				},
				this.props.children
			);
		}
	}]);

	return IntlProvider;
}(_react2.default.Component);

IntlProvider.propTypes = {
	messages: _propTypes2.default.object.isRequired,
	children: _propTypes2.default.node.isRequired
};

exports.default = IntlProvider;

/***/ }),

/***/ 426:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = IFrame;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates an IFrame component.
 *
 * @param {Object} props The props to use with the component.
 *
 * @returns {ReactElement} The rendered IFrame component.
 *
 * @constructor
 */
function IFrame(props) {
  return _react2.default.createElement("iframe", _extends({ title: props.title }, props));
}

IFrame.propTypes = {
  title: _propTypes2.default.string.isRequired
};

/***/ }),

/***/ 436:
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(65);

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

/***/ 437:
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

/***/ 445:
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(33);

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

/***/ 448:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * Build the live regions markup.
 *
 * @param {String} ariaLive Optional. Value for the 'aria-live' attribute, default 'polite'.
 *
 * @returns {Object} $container The ARIA live region jQuery object.
 */
var addContainer = function addContainer(ariaLive) {
	ariaLive = ariaLive || 'polite';

	var container = document.createElement('div');
	container.id = 'a11y-speak-' + ariaLive;
	container.className = 'a11y-speak-region';

	container.setAttribute('style', 'position: absolute;' + 'margin: -1px;' + 'padding: 0;' + 'height: 1px;' + 'width: 1px;' + 'overflow: hidden;' + 'clip: rect(1px, 1px, 1px, 1px);' + '-webkit-clip-path: inset(50%);' + 'clip-path: inset(50%);' + 'border: 0;' + 'word-wrap: normal !important;');
	container.setAttribute('aria-live', ariaLive);
	container.setAttribute('aria-relevant', 'additions text');
	container.setAttribute('aria-atomic', 'true');

	document.querySelector('body').appendChild(container);
	return container;
};

exports.default = addContainer;

/***/ }),

/***/ 449:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * Clear the a11y-speak-region elements.
 */
var clear = function clear() {
	var regions = document.querySelectorAll('.a11y-speak-region');
	for (var i = 0; i < regions.length; i++) {
		regions[i].textContent = '';
	}
};

exports.default = clear;

/***/ }),

/***/ 450:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Specify a function to execute when the DOM is fully loaded.
 *
 * @param {Function} callback A function to execute after the DOM is ready.
 *
 * @returns {void}
 */
var domReady = function domReady(callback) {
  if (document.readyState === 'complete') {
    return callback();
  }

  document.addEventListener('DOMContentLoaded', callback);
};

exports.default = domReady;

/***/ }),

/***/ 451:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var previousMessage = '';

/**
 * Filter the message to be announced to the screenreader.
 *
 * @param {String} message The message to be announced.
 *
 * @returns {String}
 */
var filterMessage = function filterMessage(message) {

  /*
   * Strip HTML tags (if any) from the message string. Ideally, messages should
   * be simple strings, carefully crafted for specific use with A11ySpeak.
   * When re-using already existing strings this will ensure simple HTML to be
   * stripped out and replaced with a space. Browsers will collapse multiple
   * spaces natively.
   */
  message = message.replace(/<[^<>]+>/g, ' ');

  if (previousMessage === message) {
    message += '\xA0';
  }

  previousMessage = message;

  return message;
};

exports.default = filterMessage;

/***/ }),

/***/ 452:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.A11yNotice = undefined;

var _styledComponents = __webpack_require__(2);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * A span tag invisible to the user, but not to screen readers.
 *
 * If you need a different element then a span, you can use styled-component's .withComponent function.
 */
var A11yNotice = exports.A11yNotice = _styledComponents2.default.span.withConfig({
	displayName: "A11yNotice"
})(["border:0;clip:rect(1px,1px,1px,1px);clip-path:inset(50%);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute !important;width:1px;word-wrap:normal !important;transform:translateY(1em);"]);

/***/ }),

/***/ 456:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _algoliasearch = __webpack_require__(457);

var _algoliasearch2 = _interopRequireDefault(_algoliasearch);

var _isUndefined = __webpack_require__(115);

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _a11y = __webpack_require__(86);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__(2);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _i18n = __webpack_require__(9);

var _Loading = __webpack_require__(475);

var _Loading2 = _interopRequireDefault(_Loading);

var _SearchBar = __webpack_require__(476);

var _SearchBar2 = _interopRequireDefault(_SearchBar);

var _SearchResultDetail = __webpack_require__(477);

var _SearchResultDetail2 = _interopRequireDefault(_SearchResultDetail);

var _SearchResults = __webpack_require__(501);

var _SearchResults2 = _interopRequireDefault(_SearchResults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* External dependencies */


/* Internal dependencies */


var AlgoliaSearchWrapper = _styledComponents2.default.div.withConfig({
	displayName: "AlgoliaSearcher__AlgoliaSearchWrapper"
})(["margin:0 auto 20px auto;box-sizing:border-box;"]);

var VIEW = {
	SEARCH: "SEARCH",
	DETAIL: "DETAIL"
};

var AlgoliaSearcher = function (_React$Component) {
	_inherits(AlgoliaSearcher, _React$Component);

	/**
  * AlgoliaSearcher constructor.
  *
  * @constructor
  * @param {object} props Properties of the AlgoliaSearcher component.
  *
  * @returns {void}
  */
	function AlgoliaSearcher(props) {
		_classCallCheck(this, AlgoliaSearcher);

		var _this = _possibleConstructorReturn(this, (AlgoliaSearcher.__proto__ || Object.getPrototypeOf(AlgoliaSearcher)).call(this, props));

		_this.state = {
			searchString: "",
			searching: false,
			results: [],
			errorMessage: "",
			usedQueries: {},
			currentDetailViewIndex: -1,
			currentView: VIEW.SEARCH
		};

		_this.initAlgoliaClient();
		return _this;
	}

	/**
  * Initializes the algolia client and index variables.
  *
  * @returns {void}
  */


	_createClass(AlgoliaSearcher, [{
		key: "initAlgoliaClient",
		value: function initAlgoliaClient() {
			this.client = (0, _algoliasearch2.default)(this.props.algoliaApplicationId, this.props.algoliaApiKey);
			this.index = this.client.initIndex(this.props.algoliaIndexName);
		}

		/**
   * Handles the form submit event. Stores the search string and performs a search.
   *
   * @param {string} searchString The entered search string.
   *
   * @returns {void}
   */

	}, {
		key: "onSearch",
		value: function onSearch(searchString) {
			if (searchString === "") {
				return;
			}
			var usedQueries = this.addUsedQuery(searchString);

			if (this.props.onQueryChange) {
				this.props.onQueryChange(usedQueries);
			}

			// Updating the state will re-render the whole component.
			this.setState({
				searchString: searchString,
				usedQueries: usedQueries,
				searching: true
			}, this.updateSearchResults);
		}

		/**
   * Adds a search string to the list of used queries.
   *
   * @param {string} searchString The search string that was used in the last search.
   *
   * @returns {Object} The usedQueries state object.
   */

	}, {
		key: "addUsedQuery",
		value: function addUsedQuery(searchString) {
			var usedQueries = this.state.usedQueries;

			if ((0, _isUndefined2.default)(usedQueries[searchString])) {
				usedQueries[searchString] = {};
			}

			return usedQueries;
		}

		/**
   * Processes the passed search error.
   *
   * @param {object} error The search error to process.
   *
   * @returns {void}
   */

	}, {
		key: "processSearchError",
		value: function processSearchError(error) {
			this.setState({
				errorMessage: error.message,
				searching: false
			});
		}

		/**
   * Processes the search results.
   *
   * @param {object} results The results to process.
   *
   * @returns {void}
   */

	}, {
		key: "processResults",
		value: function processResults(results) {
			this.setState({
				results: results,
				errorMessage: "",
				searching: false
			});
		}

		/**
   * Performs a search with the search string saved in the state.
   *
   * @returns {void}
   */

	}, {
		key: "updateSearchResults",
		value: function updateSearchResults() {
			this.performSearch(this.state.searchString).then(this.processResults.bind(this)).catch(this.processSearchError.bind(this));
		}

		/**
   * Performs a search with the given search string within the Algolia index.
   *
   * @param {string} searchString The words or sentence to get the results for.
   *
   * @returns {Promise} The promise that is performing the search.
   */

	}, {
		key: "performSearch",
		value: function performSearch(searchString) {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				_this2.index.search(searchString, function (err, data) {
					if (err) {
						reject(err);
						return;
					}

					resolve(data.hits);
				});
			});
		}

		/**
   * Adds the data from the clicked result to the information associated with the current search string.
   *
   * @param {number} currentDetailViewIndex The current detail view index.
   *
   * @returns {Object} Object containing the currently used queries with additional post data.
   */

	}, {
		key: "addResultToUsedQueries",
		value: function addResultToUsedQueries(currentDetailViewIndex) {
			var post = this.state.results[currentDetailViewIndex];
			var usedQueries = this.state.usedQueries;

			usedQueries[this.state.searchString][post.objectID] = {
				title: post.post_title, // eslint-disable-line
				link: post.permalink
			};

			return usedQueries;
		}

		/**
   * Sets the current view to the detail view and set the article index.
   *
   * @param {number} currentDetailViewIndex The index of the article you want to show in the state.results array.
   *
   * @returns {void}
   */

	}, {
		key: "showDetailView",
		value: function showDetailView(currentDetailViewIndex) {
			var usedQueries = this.addResultToUsedQueries(currentDetailViewIndex);

			this.setState({
				currentDetailViewIndex: currentDetailViewIndex,
				usedQueries: usedQueries,
				currentView: VIEW.DETAIL
			});
		}

		/**
   * Sets the current view to the search view.
   *
   * @returns {void}
   */

	}, {
		key: "hideDetailView",
		value: function hideDetailView() {
			this.setState({ currentView: VIEW.SEARCH });
		}

		/**
   * Creates the Search Bar component, unless you are in the detail view.
   *
   * @returns {ReactElement} Searchbar component.
   */

	}, {
		key: "createSearchBar",
		value: function createSearchBar() {
			return _react2.default.createElement(_SearchBar2.default, {
				submitAction: this.onSearch.bind(this),
				searchString: this.state.searchString,
				enableLiveSearch: this.props.enableLiveSearch
			});
		}

		/**
   * Gets the error message.
   *
   * @returns {ReactElement} Error component.
   */

	}, {
		key: "getErrorMessage",
		value: function getErrorMessage() {
			var errorMessage = (0, _i18n.__)("Something went wrong. Please try again later.", "yoast-components");

			(0, _a11y.speak)(errorMessage);

			return _react2.default.createElement(
				"p",
				null,
				errorMessage
			);
		}

		/**
   * Gets the loading indicator.
   *
   * @returns {ReactElement} Loader component.
   */

	}, {
		key: "getLoadingIndicator",
		value: function getLoadingIndicator() {
			var loadingPlaceholder = (0, _i18n.__)("Loading...", "yoast-components");

			return _react2.default.createElement(_Loading2.default, { placeholder: loadingPlaceholder });
		}

		/**
   * Gets the search results.
   *
   * @returns {ReactElement} Search results component.
   */

	}, {
		key: "getSearchResults",
		value: function getSearchResults() {
			return _react2.default.createElement(_SearchResults2.default, _extends({}, this.props, {
				searchString: this.state.searchString,
				results: this.state.results,
				onClick: this.showDetailView.bind(this)
			}));
		}

		/**
   * Determines what the search results view needs to look like.
   *
   * @returns {ReactElement} Returns a specific search result component based on state.
   */

	}, {
		key: "determineSearchResultsView",
		value: function determineSearchResultsView() {
			// Show error when a error message is set.
			if (this.state.errorMessage) {
				return this.getErrorMessage();
			}

			// Show loading indicator when search results are being fetched and no results are present.
			if (this.state.searching && !this.state.results) {
				return this.getLoadingIndicator();
			}

			// Show the list of search results if the postId for the detail view isn't set.
			return this.getSearchResults();
		}

		/**
   * Gets a specific post from the list of results.
   *
   * @param {number} index The index of the post to retrieve.
   *
   * @returns {Object} The post object associated with the index.
   */

	}, {
		key: "getPostFromResults",
		value: function getPostFromResults(index) {
			return this.state.results[index];
		}

		/**
   * Gets the search view.
   *
   * @returns {ReactElement} Search view component.
   */

	}, {
		key: "getSearchView",
		value: function getSearchView() {
			var _this3 = this;

			return _react2.default.createElement(
				AlgoliaSearchWrapper,
				{
					innerRef: function innerRef(el) {
						_this3.searchViewWrapper = el;
					} },
				this.createSearchBar(),
				this.determineSearchResultsView()
			);
		}

		/**
   * Gets the search result detail.
   *
   * @returns {ReactElement} Detail view component.
   */

	}, {
		key: "getDetailView",
		value: function getDetailView() {
			return _react2.default.createElement(
				AlgoliaSearchWrapper,
				null,
				_react2.default.createElement(_SearchResultDetail2.default, _extends({}, this.props, {
					post: this.getPostFromResults(this.state.currentDetailViewIndex),
					onBackButtonClicked: this.hideDetailView.bind(this)
				}))
			);
		}

		/**
   * Move focus back to the clicked link when going back from Detail to Search view.
   *
   * Call this function on componentDidUpdate() to avoid it runs on first rendering.
   *
   * @returns {void}
   */

	}, {
		key: "moveFocusBackToClickedSearchResult",
		value: function moveFocusBackToClickedSearchResult() {
			var clickedLinkIndex = this.state.currentDetailViewIndex;
			// When is search view and a search results has been previously clicked.
			if (this.state.currentView === "SEARCH" && clickedLinkIndex >= 0) {
				var resultLinks = this.searchViewWrapper.querySelectorAll("ul a");

				if (!resultLinks.length) {
					return;
				}

				resultLinks[clickedLinkIndex].focus();
			}
		}

		/**
   * Renders the React component.
   *
   * Called upon each state/props change. Determines and renders the view to render.
   *
   * @returns {ReactElement} The content of the component.
   */

	}, {
		key: "render",
		value: function render() {
			switch (this.state.currentView) {
				case VIEW.SEARCH:
					return this.getSearchView();
				case VIEW.DETAIL:
					return this.getDetailView();
			}
		}

		/**
   * Moves focus back to the clicked search results if this component updates.
   *
   * Prevents focus loss.
   *
   * @returns {void}
   */

	}, {
		key: "componentDidUpdate",
		value: function componentDidUpdate() {
			this.moveFocusBackToClickedSearchResult();
		}
	}]);

	return AlgoliaSearcher;
}(_react2.default.Component);

AlgoliaSearcher.propTypes = {
	algoliaApplicationId: _propTypes2.default.string,
	algoliaApiKey: _propTypes2.default.string,
	algoliaIndexName: _propTypes2.default.string,
	onQueryChange: _propTypes2.default.func,
	enableLiveSearch: _propTypes2.default.bool
};

AlgoliaSearcher.defaultProps = {
	algoliaApplicationId: "RC8G2UCWJK",
	algoliaApiKey: "459903434a7963f83e7d4cd9bfe89c0d",
	algoliaIndexName: "knowledge_base_all",
	enableLiveSearch: false
};

exports.default = AlgoliaSearcher;

/***/ }),

/***/ 457:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var AlgoliaSearch = __webpack_require__(458);
var createAlgoliasearch = __webpack_require__(467);

module.exports = createAlgoliasearch(AlgoliaSearch);


/***/ }),

/***/ 458:
/***/ (function(module, exports, __webpack_require__) {

module.exports = AlgoliaSearch;

var Index = __webpack_require__(459);
var deprecate = __webpack_require__(145);
var deprecatedMessage = __webpack_require__(146);
var AlgoliaSearchCore = __webpack_require__(463);
var inherits = __webpack_require__(68);
var errors = __webpack_require__(49);

function AlgoliaSearch() {
  AlgoliaSearchCore.apply(this, arguments);
}

inherits(AlgoliaSearch, AlgoliaSearchCore);

/*
 * Delete an index
 *
 * @param indexName the name of index to delete
 * @param callback the result callback called with two arguments
 *  error: null or Error('message')
 *  content: the server answer that contains the task ID
 */
AlgoliaSearch.prototype.deleteIndex = function(indexName, callback) {
  return this._jsonRequest({
    method: 'DELETE',
    url: '/1/indexes/' + encodeURIComponent(indexName),
    hostType: 'write',
    callback: callback
  });
};

/**
 * Move an existing index.
 * @param srcIndexName the name of index to copy.
 * @param dstIndexName the new index name that will contains a copy of
 * srcIndexName (destination will be overriten if it already exist).
 * @param callback the result callback called with two arguments
 *  error: null or Error('message')
 *  content: the server answer that contains the task ID
 */
AlgoliaSearch.prototype.moveIndex = function(srcIndexName, dstIndexName, callback) {
  var postObj = {
    operation: 'move', destination: dstIndexName
  };
  return this._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(srcIndexName) + '/operation',
    body: postObj,
    hostType: 'write',
    callback: callback
  });
};

/**
 * Copy an existing index.
 * @param srcIndexName the name of index to copy.
 * @param dstIndexName the new index name that will contains a copy
 * of srcIndexName (destination will be overriten if it already exist).
 * @param scope an array of scopes to copy: ['settings', 'synonyms', 'rules']
 * @param callback the result callback called with two arguments
 *  error: null or Error('message')
 *  content: the server answer that contains the task ID
 */
AlgoliaSearch.prototype.copyIndex = function(srcIndexName, dstIndexName, scopeOrCallback, _callback) {
  var postObj = {
    operation: 'copy',
    destination: dstIndexName
  };
  var callback = _callback;
  if (typeof scopeOrCallback === 'function') {
    // oops, old behaviour of third argument being a function
    callback = scopeOrCallback;
  } else if (Array.isArray(scopeOrCallback) && scopeOrCallback.length > 0) {
    postObj.scope = scopeOrCallback;
  } else if (typeof scopeOrCallback !== 'undefined') {
    throw new Error('the scope given to `copyIndex` was not an array with settings, synonyms or rules');
  }
  return this._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(srcIndexName) + '/operation',
    body: postObj,
    hostType: 'write',
    callback: callback
  });
};

/**
 * Return last log entries.
 * @param offset Specify the first entry to retrieve (0-based, 0 is the most recent log entry).
 * @param length Specify the maximum number of entries to retrieve starting
 * at offset. Maximum allowed value: 1000.
 * @param type Specify the maximum number of entries to retrieve starting
 * at offset. Maximum allowed value: 1000.
 * @param callback the result callback called with two arguments
 *  error: null or Error('message')
 *  content: the server answer that contains the task ID
 */
AlgoliaSearch.prototype.getLogs = function(offset, length, callback) {
  var clone = __webpack_require__(38);
  var params = {};
  if (typeof offset === 'object') {
    // getLogs(params)
    params = clone(offset);
    callback = length;
  } else if (arguments.length === 0 || typeof offset === 'function') {
    // getLogs([cb])
    callback = offset;
  } else if (arguments.length === 1 || typeof length === 'function') {
    // getLogs(1, [cb)]
    callback = length;
    params.offset = offset;
  } else {
    // getLogs(1, 2, [cb])
    params.offset = offset;
    params.length = length;
  }

  if (params.offset === undefined) params.offset = 0;
  if (params.length === undefined) params.length = 10;

  return this._jsonRequest({
    method: 'GET',
    url: '/1/logs?' + this._getSearchParams(params, ''),
    hostType: 'read',
    callback: callback
  });
};

/*
 * List all existing indexes (paginated)
 *
 * @param page The page to retrieve, starting at 0.
 * @param callback the result callback called with two arguments
 *  error: null or Error('message')
 *  content: the server answer with index list
 */
AlgoliaSearch.prototype.listIndexes = function(page, callback) {
  var params = '';

  if (page === undefined || typeof page === 'function') {
    callback = page;
  } else {
    params = '?page=' + page;
  }

  return this._jsonRequest({
    method: 'GET',
    url: '/1/indexes' + params,
    hostType: 'read',
    callback: callback
  });
};

/*
 * Get the index object initialized
 *
 * @param indexName the name of index
 * @param callback the result callback with one argument (the Index instance)
 */
AlgoliaSearch.prototype.initIndex = function(indexName) {
  return new Index(this, indexName);
};

/*
 * @deprecated use client.listApiKeys
 */
AlgoliaSearch.prototype.listUserKeys = deprecate(function(callback) {
  return this.listApiKeys(callback);
}, deprecatedMessage('client.listUserKeys()', 'client.listApiKeys()'));

/*
 * List all existing api keys with their associated ACLs
 *
 * @param callback the result callback called with two arguments
 *  error: null or Error('message')
 *  content: the server answer with api keys list
 */
AlgoliaSearch.prototype.listApiKeys = function(callback) {
  return this._jsonRequest({
    method: 'GET',
    url: '/1/keys',
    hostType: 'read',
    callback: callback
  });
};

/*
 * @deprecated see client.getApiKey
 */
AlgoliaSearch.prototype.getUserKeyACL = deprecate(function(key, callback) {
  return this.getApiKey(key, callback);
}, deprecatedMessage('client.getUserKeyACL()', 'client.getApiKey()'));

/*
 * Get an API key
 *
 * @param key
 * @param callback the result callback called with two arguments
 *  error: null or Error('message')
 *  content: the server answer with the right API key
 */
AlgoliaSearch.prototype.getApiKey = function(key, callback) {
  return this._jsonRequest({
    method: 'GET',
    url: '/1/keys/' + key,
    hostType: 'read',
    callback: callback
  });
};

/*
 * @deprecated see client.deleteApiKey
 */
AlgoliaSearch.prototype.deleteUserKey = deprecate(function(key, callback) {
  return this.deleteApiKey(key, callback);
}, deprecatedMessage('client.deleteUserKey()', 'client.deleteApiKey()'));

/*
 * Delete an existing API key
 * @param key
 * @param callback the result callback called with two arguments
 *  error: null or Error('message')
 *  content: the server answer with the date of deletion
 */
AlgoliaSearch.prototype.deleteApiKey = function(key, callback) {
  return this._jsonRequest({
    method: 'DELETE',
    url: '/1/keys/' + key,
    hostType: 'write',
    callback: callback
  });
};

/*
 @deprecated see client.addApiKey
 */
AlgoliaSearch.prototype.addUserKey = deprecate(function(acls, params, callback) {
  return this.addApiKey(acls, params, callback);
}, deprecatedMessage('client.addUserKey()', 'client.addApiKey()'));

/*
 * Add a new global API key
 *
 * @param {string[]} acls - The list of ACL for this key. Defined by an array of strings that
 *   can contains the following values:
 *     - search: allow to search (https and http)
 *     - addObject: allows to add/update an object in the index (https only)
 *     - deleteObject : allows to delete an existing object (https only)
 *     - deleteIndex : allows to delete index content (https only)
 *     - settings : allows to get index settings (https only)
 *     - editSettings : allows to change index settings (https only)
 * @param {Object} [params] - Optionnal parameters to set for the key
 * @param {number} params.validity - Number of seconds after which the key will be automatically removed (0 means no time limit for this key)
 * @param {number} params.maxQueriesPerIPPerHour - Number of API calls allowed from an IP address per hour
 * @param {number} params.maxHitsPerQuery - Number of hits this API key can retrieve in one call
 * @param {string[]} params.indexes - Allowed targeted indexes for this key
 * @param {string} params.description - A description for your key
 * @param {string[]} params.referers - A list of authorized referers
 * @param {Object} params.queryParameters - Force the key to use specific query parameters
 * @param {Function} callback - The result callback called with two arguments
 *   error: null or Error('message')
 *   content: the server answer with the added API key
 * @return {Promise|undefined} Returns a promise if no callback given
 * @example
 * client.addApiKey(['search'], {
 *   validity: 300,
 *   maxQueriesPerIPPerHour: 2000,
 *   maxHitsPerQuery: 3,
 *   indexes: ['fruits'],
 *   description: 'Eat three fruits',
 *   referers: ['*.algolia.com'],
 *   queryParameters: {
 *     tagFilters: ['public'],
 *   }
 * })
 * @see {@link https://www.algolia.com/doc/rest_api#AddKey|Algolia REST API Documentation}
 */
AlgoliaSearch.prototype.addApiKey = function(acls, params, callback) {
  var isArray = __webpack_require__(19);
  var usage = 'Usage: client.addApiKey(arrayOfAcls[, params, callback])';

  if (!isArray(acls)) {
    throw new Error(usage);
  }

  if (arguments.length === 1 || typeof params === 'function') {
    callback = params;
    params = null;
  }

  var postObj = {
    acl: acls
  };

  if (params) {
    postObj.validity = params.validity;
    postObj.maxQueriesPerIPPerHour = params.maxQueriesPerIPPerHour;
    postObj.maxHitsPerQuery = params.maxHitsPerQuery;
    postObj.indexes = params.indexes;
    postObj.description = params.description;

    if (params.queryParameters) {
      postObj.queryParameters = this._getSearchParams(params.queryParameters, '');
    }

    postObj.referers = params.referers;
  }

  return this._jsonRequest({
    method: 'POST',
    url: '/1/keys',
    body: postObj,
    hostType: 'write',
    callback: callback
  });
};

/**
 * @deprecated Please use client.addApiKey()
 */
AlgoliaSearch.prototype.addUserKeyWithValidity = deprecate(function(acls, params, callback) {
  return this.addApiKey(acls, params, callback);
}, deprecatedMessage('client.addUserKeyWithValidity()', 'client.addApiKey()'));

/**
 * @deprecated Please use client.updateApiKey()
 */
AlgoliaSearch.prototype.updateUserKey = deprecate(function(key, acls, params, callback) {
  return this.updateApiKey(key, acls, params, callback);
}, deprecatedMessage('client.updateUserKey()', 'client.updateApiKey()'));

/**
 * Update an existing API key
 * @param {string} key - The key to update
 * @param {string[]} acls - The list of ACL for this key. Defined by an array of strings that
 *   can contains the following values:
 *     - search: allow to search (https and http)
 *     - addObject: allows to add/update an object in the index (https only)
 *     - deleteObject : allows to delete an existing object (https only)
 *     - deleteIndex : allows to delete index content (https only)
 *     - settings : allows to get index settings (https only)
 *     - editSettings : allows to change index settings (https only)
 * @param {Object} [params] - Optionnal parameters to set for the key
 * @param {number} params.validity - Number of seconds after which the key will be automatically removed (0 means no time limit for this key)
 * @param {number} params.maxQueriesPerIPPerHour - Number of API calls allowed from an IP address per hour
 * @param {number} params.maxHitsPerQuery - Number of hits this API key can retrieve in one call
 * @param {string[]} params.indexes - Allowed targeted indexes for this key
 * @param {string} params.description - A description for your key
 * @param {string[]} params.referers - A list of authorized referers
 * @param {Object} params.queryParameters - Force the key to use specific query parameters
 * @param {Function} callback - The result callback called with two arguments
 *   error: null or Error('message')
 *   content: the server answer with the modified API key
 * @return {Promise|undefined} Returns a promise if no callback given
 * @example
 * client.updateApiKey('APIKEY', ['search'], {
 *   validity: 300,
 *   maxQueriesPerIPPerHour: 2000,
 *   maxHitsPerQuery: 3,
 *   indexes: ['fruits'],
 *   description: 'Eat three fruits',
 *   referers: ['*.algolia.com'],
 *   queryParameters: {
 *     tagFilters: ['public'],
 *   }
 * })
 * @see {@link https://www.algolia.com/doc/rest_api#UpdateIndexKey|Algolia REST API Documentation}
 */
AlgoliaSearch.prototype.updateApiKey = function(key, acls, params, callback) {
  var isArray = __webpack_require__(19);
  var usage = 'Usage: client.updateApiKey(key, arrayOfAcls[, params, callback])';

  if (!isArray(acls)) {
    throw new Error(usage);
  }

  if (arguments.length === 2 || typeof params === 'function') {
    callback = params;
    params = null;
  }

  var putObj = {
    acl: acls
  };

  if (params) {
    putObj.validity = params.validity;
    putObj.maxQueriesPerIPPerHour = params.maxQueriesPerIPPerHour;
    putObj.maxHitsPerQuery = params.maxHitsPerQuery;
    putObj.indexes = params.indexes;
    putObj.description = params.description;

    if (params.queryParameters) {
      putObj.queryParameters = this._getSearchParams(params.queryParameters, '');
    }

    putObj.referers = params.referers;
  }

  return this._jsonRequest({
    method: 'PUT',
    url: '/1/keys/' + key,
    body: putObj,
    hostType: 'write',
    callback: callback
  });
};

/**
 * Initialize a new batch of search queries
 * @deprecated use client.search()
 */
AlgoliaSearch.prototype.startQueriesBatch = deprecate(function startQueriesBatchDeprecated() {
  this._batch = [];
}, deprecatedMessage('client.startQueriesBatch()', 'client.search()'));

/**
 * Add a search query in the batch
 * @deprecated use client.search()
 */
AlgoliaSearch.prototype.addQueryInBatch = deprecate(function addQueryInBatchDeprecated(indexName, query, args) {
  this._batch.push({
    indexName: indexName,
    query: query,
    params: args
  });
}, deprecatedMessage('client.addQueryInBatch()', 'client.search()'));

/**
 * Launch the batch of queries using XMLHttpRequest.
 * @deprecated use client.search()
 */
AlgoliaSearch.prototype.sendQueriesBatch = deprecate(function sendQueriesBatchDeprecated(callback) {
  return this.search(this._batch, callback);
}, deprecatedMessage('client.sendQueriesBatch()', 'client.search()'));

/**
 * Perform write operations accross multiple indexes.
 *
 * To reduce the amount of time spent on network round trips,
 * you can create, update, or delete several objects in one call,
 * using the batch endpoint (all operations are done in the given order).
 *
 * Available actions:
 *   - addObject
 *   - updateObject
 *   - partialUpdateObject
 *   - partialUpdateObjectNoCreate
 *   - deleteObject
 *
 * https://www.algolia.com/doc/rest_api#Indexes
 * @param  {Object[]} operations An array of operations to perform
 * @return {Promise|undefined} Returns a promise if no callback given
 * @example
 * client.batch([{
 *   action: 'addObject',
 *   indexName: 'clients',
 *   body: {
 *     name: 'Bill'
 *   }
 * }, {
 *   action: 'udpateObject',
 *   indexName: 'fruits',
 *   body: {
 *     objectID: '29138',
 *     name: 'banana'
 *   }
 * }], cb)
 */
AlgoliaSearch.prototype.batch = function(operations, callback) {
  var isArray = __webpack_require__(19);
  var usage = 'Usage: client.batch(operations[, callback])';

  if (!isArray(operations)) {
    throw new Error(usage);
  }

  return this._jsonRequest({
    method: 'POST',
    url: '/1/indexes/*/batch',
    body: {
      requests: operations
    },
    hostType: 'write',
    callback: callback
  });
};

/**
 * Assign or Move a userID to a cluster
 *
 * @param {string} data.userID The userID to assign to a new cluster
 * @param {string} data.cluster The cluster to assign the user to
 * @return {Promise|undefined} Returns a promise if no callback given
 * @example
 * client.assignUserID({ cluster: 'c1-test', userID: 'some-user' });
 */
AlgoliaSearch.prototype.assignUserID = function(data, callback) {
  if (!data.userID || !data.cluster) {
    throw new errors.AlgoliaSearchError('You have to provide both a userID and cluster', data);
  }
  return this._jsonRequest({
    method: 'POST',
    url: '/1/clusters/mapping',
    hostType: 'write',
    body: {cluster: data.cluster},
    callback: callback,
    headers: {
      'X-Algolia-User-ID': data.userID
    }
  });
};

/**
 * Get the top userIDs
 *
 * (the callback is the second argument)
 *
 * @return {Promise|undefined} Returns a promise if no callback given
 * @example
 * client.getTopUserID();
 */
AlgoliaSearch.prototype.getTopUserID = function(callback) {
  return this._jsonRequest({
    method: 'GET',
    url: '/1/clusters/mapping/top',
    hostType: 'read',
    callback: callback
  });
};

/**
 * Get userID
 *
 * @param {string} data.userID The userID to get info about
 * @return {Promise|undefined} Returns a promise if no callback given
 * @example
 * client.getUserID({ userID: 'some-user' });
 */
AlgoliaSearch.prototype.getUserID = function(data, callback) {
  if (!data.userID) {
    throw new errors.AlgoliaSearchError('You have to provide a userID', {debugData: data});
  }
  return this._jsonRequest({
    method: 'GET',
    url: '/1/clusters/mapping/' + data.userID,
    hostType: 'read',
    callback: callback
  });
};

/**
 * List all the clusters
 *
 * (the callback is the second argument)
 *
 * @return {Promise|undefined} Returns a promise if no callback given
 * @example
 * client.listClusters();
 */
AlgoliaSearch.prototype.listClusters = function(callback) {
  return this._jsonRequest({
    method: 'GET',
    url: '/1/clusters',
    hostType: 'read',
    callback: callback
  });
};

/**
 * List the userIDs
 *
 * (the callback is the second argument)
 *
 * @param {string} data.hitsPerPage How many hits on every page
 * @param {string} data.page The page to retrieve
 * @return {Promise|undefined} Returns a promise if no callback given
 * @example
 * client.listClusters();
 * client.listClusters({ page: 3, hitsPerPage: 30});
 */
AlgoliaSearch.prototype.listUserIDs = function(data, callback) {
  return this._jsonRequest({
    method: 'GET',
    url: '/1/clusters/mapping',
    body: data,
    hostType: 'read',
    callback: callback
  });
};

/**
 * Remove an userID
 *
 * @param {string} data.userID The userID to assign to a new cluster
 * @return {Promise|undefined} Returns a promise if no callback given
 * @example
 * client.removeUserID({ userID: 'some-user' });
 */
AlgoliaSearch.prototype.removeUserID = function(data, callback) {
  if (!data.userID) {
    throw new errors.AlgoliaSearchError('You have to provide a userID', {debugData: data});
  }
  return this._jsonRequest({
    method: 'DELETE',
    url: '/1/clusters/mapping',
    hostType: 'write',
    callback: callback,
    headers: {
      'X-Algolia-User-ID': data.userID
    }
  });
};

/**
 * Search for userIDs
 *
 * @param {string} data.cluster The cluster to target
 * @param {string} data.query The query to execute
 * @param {string} data.hitsPerPage How many hits on every page
 * @param {string} data.page The page to retrieve
 * @return {Promise|undefined} Returns a promise if no callback given
 * @example
 * client.searchUserIDs({ cluster: 'c1-test', query: 'some-user' });
 * client.searchUserIDs({
 *   cluster: "c1-test",
 *   query: "some-user",
 *   page: 3,
 *   hitsPerPage: 2
 * });
 */
AlgoliaSearch.prototype.searchUserIDs = function(data, callback) {
  return this._jsonRequest({
    method: 'POST',
    url: '/1/clusters/mapping/search',
    body: data,
    hostType: 'read',
    callback: callback
  });
};

// environment specific methods
AlgoliaSearch.prototype.destroy = notImplemented;
AlgoliaSearch.prototype.enableRateLimitForward = notImplemented;
AlgoliaSearch.prototype.disableRateLimitForward = notImplemented;
AlgoliaSearch.prototype.useSecuredAPIKey = notImplemented;
AlgoliaSearch.prototype.disableSecuredAPIKey = notImplemented;
AlgoliaSearch.prototype.generateSecuredApiKey = notImplemented;

function notImplemented() {
  var message = 'Not implemented in this environment.\n' +
    'If you feel this is a mistake, write to support@algolia.com';

  throw new errors.AlgoliaSearchError(message);
}


/***/ }),

/***/ 459:
/***/ (function(module, exports, __webpack_require__) {

var inherits = __webpack_require__(68);
var IndexCore = __webpack_require__(238);
var deprecate = __webpack_require__(145);
var deprecatedMessage = __webpack_require__(146);
var exitPromise = __webpack_require__(242);
var errors = __webpack_require__(49);

var deprecateForwardToSlaves = deprecate(
  function() {},
  deprecatedMessage('forwardToSlaves', 'forwardToReplicas')
);

module.exports = Index;

function Index() {
  IndexCore.apply(this, arguments);
}

inherits(Index, IndexCore);

/*
* Add an object in this index
*
* @param content contains the javascript object to add inside the index
* @param objectID (optional) an objectID you want to attribute to this object
* (if the attribute already exist the old object will be overwrite)
* @param callback (optional) the result callback called with two arguments:
*  error: null or Error('message')
*  content: the server answer that contains 3 elements: createAt, taskId and objectID
*/
Index.prototype.addObject = function(content, objectID, callback) {
  var indexObj = this;

  if (arguments.length === 1 || typeof objectID === 'function') {
    callback = objectID;
    objectID = undefined;
  }

  return this.as._jsonRequest({
    method: objectID !== undefined ?
    'PUT' : // update or create
    'POST', // create (API generates an objectID)
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + // create
    (objectID !== undefined ? '/' + encodeURIComponent(objectID) : ''), // update or create
    body: content,
    hostType: 'write',
    callback: callback
  });
};

/*
* Add several objects
*
* @param objects contains an array of objects to add
* @param callback (optional) the result callback called with two arguments:
*  error: null or Error('message')
*  content: the server answer that updateAt and taskID
*/
Index.prototype.addObjects = function(objects, callback) {
  var isArray = __webpack_require__(19);
  var usage = 'Usage: index.addObjects(arrayOfObjects[, callback])';

  if (!isArray(objects)) {
    throw new Error(usage);
  }

  var indexObj = this;
  var postObj = {
    requests: []
  };
  for (var i = 0; i < objects.length; ++i) {
    var request = {
      action: 'addObject',
      body: objects[i]
    };
    postObj.requests.push(request);
  }
  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/batch',
    body: postObj,
    hostType: 'write',
    callback: callback
  });
};

/*
* Update partially an object (only update attributes passed in argument)
*
* @param partialObject contains the javascript attributes to override, the
*  object must contains an objectID attribute
* @param createIfNotExists (optional) if false, avoid an automatic creation of the object
* @param callback (optional) the result callback called with two arguments:
*  error: null or Error('message')
*  content: the server answer that contains 3 elements: createAt, taskId and objectID
*/
Index.prototype.partialUpdateObject = function(partialObject, createIfNotExists, callback) {
  if (arguments.length === 1 || typeof createIfNotExists === 'function') {
    callback = createIfNotExists;
    createIfNotExists = undefined;
  }

  var indexObj = this;
  var url = '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/' + encodeURIComponent(partialObject.objectID) + '/partial';
  if (createIfNotExists === false) {
    url += '?createIfNotExists=false';
  }

  return this.as._jsonRequest({
    method: 'POST',
    url: url,
    body: partialObject,
    hostType: 'write',
    callback: callback
  });
};

/*
* Partially Override the content of several objects
*
* @param objects contains an array of objects to update (each object must contains a objectID attribute)
* @param callback (optional) the result callback called with two arguments:
*  error: null or Error('message')
*  content: the server answer that updateAt and taskID
*/
Index.prototype.partialUpdateObjects = function(objects, createIfNotExists, callback) {
  if (arguments.length === 1 || typeof createIfNotExists === 'function') {
    callback = createIfNotExists;
    createIfNotExists = true;
  }

  var isArray = __webpack_require__(19);
  var usage = 'Usage: index.partialUpdateObjects(arrayOfObjects[, callback])';

  if (!isArray(objects)) {
    throw new Error(usage);
  }

  var indexObj = this;
  var postObj = {
    requests: []
  };
  for (var i = 0; i < objects.length; ++i) {
    var request = {
      action: createIfNotExists === true ? 'partialUpdateObject' : 'partialUpdateObjectNoCreate',
      objectID: objects[i].objectID,
      body: objects[i]
    };
    postObj.requests.push(request);
  }
  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/batch',
    body: postObj,
    hostType: 'write',
    callback: callback
  });
};

/*
* Override the content of object
*
* @param object contains the javascript object to save, the object must contains an objectID attribute
* @param callback (optional) the result callback called with two arguments:
*  error: null or Error('message')
*  content: the server answer that updateAt and taskID
*/
Index.prototype.saveObject = function(object, callback) {
  var indexObj = this;
  return this.as._jsonRequest({
    method: 'PUT',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/' + encodeURIComponent(object.objectID),
    body: object,
    hostType: 'write',
    callback: callback
  });
};

/*
* Override the content of several objects
*
* @param objects contains an array of objects to update (each object must contains a objectID attribute)
* @param callback (optional) the result callback called with two arguments:
*  error: null or Error('message')
*  content: the server answer that updateAt and taskID
*/
Index.prototype.saveObjects = function(objects, callback) {
  var isArray = __webpack_require__(19);
  var usage = 'Usage: index.saveObjects(arrayOfObjects[, callback])';

  if (!isArray(objects)) {
    throw new Error(usage);
  }

  var indexObj = this;
  var postObj = {
    requests: []
  };
  for (var i = 0; i < objects.length; ++i) {
    var request = {
      action: 'updateObject',
      objectID: objects[i].objectID,
      body: objects[i]
    };
    postObj.requests.push(request);
  }
  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/batch',
    body: postObj,
    hostType: 'write',
    callback: callback
  });
};

/*
* Delete an object from the index
*
* @param objectID the unique identifier of object to delete
* @param callback (optional) the result callback called with two arguments:
*  error: null or Error('message')
*  content: the server answer that contains 3 elements: createAt, taskId and objectID
*/
Index.prototype.deleteObject = function(objectID, callback) {
  if (typeof objectID === 'function' || typeof objectID !== 'string' && typeof objectID !== 'number') {
    var err = new errors.AlgoliaSearchError('Cannot delete an object without an objectID');
    callback = objectID;
    if (typeof callback === 'function') {
      return callback(err);
    }

    return this.as._promise.reject(err);
  }

  var indexObj = this;
  return this.as._jsonRequest({
    method: 'DELETE',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/' + encodeURIComponent(objectID),
    hostType: 'write',
    callback: callback
  });
};

/*
* Delete several objects from an index
*
* @param objectIDs contains an array of objectID to delete
* @param callback (optional) the result callback called with two arguments:
*  error: null or Error('message')
*  content: the server answer that contains 3 elements: createAt, taskId and objectID
*/
Index.prototype.deleteObjects = function(objectIDs, callback) {
  var isArray = __webpack_require__(19);
  var map = __webpack_require__(51);

  var usage = 'Usage: index.deleteObjects(arrayOfObjectIDs[, callback])';

  if (!isArray(objectIDs)) {
    throw new Error(usage);
  }

  var indexObj = this;
  var postObj = {
    requests: map(objectIDs, function prepareRequest(objectID) {
      return {
        action: 'deleteObject',
        objectID: objectID,
        body: {
          objectID: objectID
        }
      };
    })
  };

  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/batch',
    body: postObj,
    hostType: 'write',
    callback: callback
  });
};

/*
* Delete all objects matching a query
*
* @param query the query string
* @param params the optional query parameters
* @param callback (optional) the result callback called with one argument
*  error: null or Error('message')
* @deprecated see index.deleteBy
*/
Index.prototype.deleteByQuery = deprecate(function(query, params, callback) {
  var clone = __webpack_require__(38);
  var map = __webpack_require__(51);

  var indexObj = this;
  var client = indexObj.as;

  if (arguments.length === 1 || typeof params === 'function') {
    callback = params;
    params = {};
  } else {
    params = clone(params);
  }

  params.attributesToRetrieve = 'objectID';
  params.hitsPerPage = 1000;
  params.distinct = false;

  // when deleting, we should never use cache to get the
  // search results
  this.clearCache();

  // there's a problem in how we use the promise chain,
  // see how waitTask is done
  var promise = this
  .search(query, params)
  .then(stopOrDelete);

  function stopOrDelete(searchContent) {
    // stop here
    if (searchContent.nbHits === 0) {
      // return indexObj.as._request.resolve();
      return searchContent;
    }

    // continue and do a recursive call
    var objectIDs = map(searchContent.hits, function getObjectID(object) {
      return object.objectID;
    });

    return indexObj
    .deleteObjects(objectIDs)
    .then(waitTask)
    .then(doDeleteByQuery);
  }

  function waitTask(deleteObjectsContent) {
    return indexObj.waitTask(deleteObjectsContent.taskID);
  }

  function doDeleteByQuery() {
    return indexObj.deleteByQuery(query, params);
  }

  if (!callback) {
    return promise;
  }

  promise.then(success, failure);

  function success() {
    exitPromise(function exit() {
      callback(null);
    }, client._setTimeout || setTimeout);
  }

  function failure(err) {
    exitPromise(function exit() {
      callback(err);
    }, client._setTimeout || setTimeout);
  }
}, deprecatedMessage('index.deleteByQuery()', 'index.deleteBy()'));

/**
* Delete all objects matching a query
*
* the query parameters that can be used are:
* - filters (numeric, facet, tag)
* - geo
*
* you can not send an empty query or filters
*
* @param params the optional query parameters
* @param callback (optional) the result callback called with one argument
*  error: null or Error('message')
*/
Index.prototype.deleteBy = function(params, callback) {
  var indexObj = this;
  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/deleteByQuery',
    body: {params: indexObj.as._getSearchParams(params, '')},
    hostType: 'write',
    callback: callback
  });
};

/*
* Browse all content from an index using events. Basically this will do
* .browse() -> .browseFrom -> .browseFrom -> .. until all the results are returned
*
* @param {string} query - The full text query
* @param {Object} [queryParameters] - Any search query parameter
* @return {EventEmitter}
* @example
* var browser = index.browseAll('cool songs', {
*   tagFilters: 'public,comments',
*   hitsPerPage: 500
* });
*
* browser.on('result', function resultCallback(content) {
*   console.log(content.hits);
* });
*
* // if any error occurs, you get it
* browser.on('error', function(err) {
*   throw err;
* });
*
* // when you have browsed the whole index, you get this event
* browser.on('end', function() {
*   console.log('finished');
* });
*
* // at any point if you want to stop the browsing process, you can stop it manually
* // otherwise it will go on and on
* browser.stop();
*
* @see {@link https://www.algolia.com/doc/rest_api#Browse|Algolia REST API Documentation}
*/
Index.prototype.browseAll = function(query, queryParameters) {
  if (typeof query === 'object') {
    queryParameters = query;
    query = undefined;
  }

  var merge = __webpack_require__(240);

  var IndexBrowser = __webpack_require__(462);

  var browser = new IndexBrowser();
  var client = this.as;
  var index = this;
  var params = client._getSearchParams(
    merge({}, queryParameters || {}, {
      query: query
    }), ''
  );

  // start browsing
  browseLoop();

  function browseLoop(cursor) {
    if (browser._stopped) {
      return;
    }

    var body;

    if (cursor !== undefined) {
      body = {
        cursor: cursor
      };
    } else {
      body = {
        params: params
      };
    }

    client._jsonRequest({
      method: 'POST',
      url: '/1/indexes/' + encodeURIComponent(index.indexName) + '/browse',
      hostType: 'read',
      body: body,
      callback: browseCallback
    });
  }

  function browseCallback(err, content) {
    if (browser._stopped) {
      return;
    }

    if (err) {
      browser._error(err);
      return;
    }

    browser._result(content);

    // no cursor means we are finished browsing
    if (content.cursor === undefined) {
      browser._end();
      return;
    }

    browseLoop(content.cursor);
  }

  return browser;
};

/*
* Get a Typeahead.js adapter
* @param searchParams contains an object with query parameters (see search for details)
*/
Index.prototype.ttAdapter = deprecate(function(params) {
  var self = this;
  return function ttAdapter(query, syncCb, asyncCb) {
    var cb;

    if (typeof asyncCb === 'function') {
      // typeahead 0.11
      cb = asyncCb;
    } else {
      // pre typeahead 0.11
      cb = syncCb;
    }

    self.search(query, params, function searchDone(err, content) {
      if (err) {
        cb(err);
        return;
      }

      cb(content.hits);
    });
  };
},
'ttAdapter is not necessary anymore and will be removed in the next version,\n' +
'have a look at autocomplete.js (https://github.com/algolia/autocomplete.js)');

/*
* Wait the publication of a task on the server.
* All server task are asynchronous and you can check with this method that the task is published.
*
* @param taskID the id of the task returned by server
* @param callback the result callback with with two arguments:
*  error: null or Error('message')
*  content: the server answer that contains the list of results
*/
Index.prototype.waitTask = function(taskID, callback) {
  // wait minimum 100ms before retrying
  var baseDelay = 100;
  // wait maximum 5s before retrying
  var maxDelay = 5000;
  var loop = 0;

  // waitTask() must be handled differently from other methods,
  // it's a recursive method using a timeout
  var indexObj = this;
  var client = indexObj.as;

  var promise = retryLoop();

  function retryLoop() {
    return client._jsonRequest({
      method: 'GET',
      hostType: 'read',
      url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/task/' + taskID
    }).then(function success(content) {
      loop++;
      var delay = baseDelay * loop * loop;
      if (delay > maxDelay) {
        delay = maxDelay;
      }

      if (content.status !== 'published') {
        return client._promise.delay(delay).then(retryLoop);
      }

      return content;
    });
  }

  if (!callback) {
    return promise;
  }

  promise.then(successCb, failureCb);

  function successCb(content) {
    exitPromise(function exit() {
      callback(null, content);
    }, client._setTimeout || setTimeout);
  }

  function failureCb(err) {
    exitPromise(function exit() {
      callback(err);
    }, client._setTimeout || setTimeout);
  }
};

/*
* This function deletes the index content. Settings and index specific API keys are kept untouched.
*
* @param callback (optional) the result callback called with two arguments
*  error: null or Error('message')
*  content: the settings object or the error message if a failure occured
*/
Index.prototype.clearIndex = function(callback) {
  var indexObj = this;
  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/clear',
    hostType: 'write',
    callback: callback
  });
};

/*
* Get settings of this index
*
* @param opts an object of options to add
* @param opts.advanced get more settings like nbShards (useful for Enterprise)
* @param callback (optional) the result callback called with two arguments
*  error: null or Error('message')
*  content: the settings object or the error message if a failure occurred
*/
Index.prototype.getSettings = function(opts, callback) {
  if (arguments.length === 1 && typeof opts === 'function') {
    callback = opts;
    opts = {};
  }
  opts = opts || {};

  var indexName = encodeURIComponent(this.indexName);
  return this.as._jsonRequest({
    method: 'GET',
    url:
      '/1/indexes/' +
      indexName +
      '/settings?getVersion=2' +
      (opts.advanced ? '&advanced=' + opts.advanced : ''),
    hostType: 'read',
    callback: callback
  });
};

Index.prototype.searchSynonyms = function(params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = {};
  } else if (params === undefined) {
    params = {};
  }

  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/synonyms/search',
    body: params,
    hostType: 'read',
    callback: callback
  });
};

function exportData(method, _hitsPerPage, callback) {
  function search(page, _previous) {
    var options = {
      page: page || 0,
      hitsPerPage: _hitsPerPage || 100
    };
    var previous = _previous || [];

    return method(options).then(function(result) {
      var hits = result.hits;
      var nbHits = result.nbHits;
      var current = hits.map(function(s) {
        delete s._highlightResult;
        return s;
      });
      var synonyms = previous.concat(current);
      if (synonyms.length < nbHits) {
        return search(options.page + 1, synonyms);
      }
      return synonyms;
    });
  }
  return search().then(function(data) {
    if (typeof callback === 'function') {
      callback(data);
      return undefined;
    }
    return data;
  });
}

/**
 * Retrieve all the synonyms in an index
 * @param [number=100] hitsPerPage The amount of synonyms to retrieve per batch
 * @param [function] callback will be called after all synonyms are retrieved
 */
Index.prototype.exportSynonyms = function(hitsPerPage, callback) {
  return exportData(this.searchSynonyms.bind(this), hitsPerPage, callback);
};

Index.prototype.saveSynonym = function(synonym, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  } else if (opts === undefined) {
    opts = {};
  }

  if (opts.forwardToSlaves !== undefined) deprecateForwardToSlaves();
  var forwardToReplicas = (opts.forwardToSlaves || opts.forwardToReplicas) ? 'true' : 'false';

  return this.as._jsonRequest({
    method: 'PUT',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/synonyms/' + encodeURIComponent(synonym.objectID) +
      '?forwardToReplicas=' + forwardToReplicas,
    body: synonym,
    hostType: 'write',
    callback: callback
  });
};

Index.prototype.getSynonym = function(objectID, callback) {
  return this.as._jsonRequest({
    method: 'GET',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/synonyms/' + encodeURIComponent(objectID),
    hostType: 'read',
    callback: callback
  });
};

Index.prototype.deleteSynonym = function(objectID, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  } else if (opts === undefined) {
    opts = {};
  }

  if (opts.forwardToSlaves !== undefined) deprecateForwardToSlaves();
  var forwardToReplicas = (opts.forwardToSlaves || opts.forwardToReplicas) ? 'true' : 'false';

  return this.as._jsonRequest({
    method: 'DELETE',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/synonyms/' + encodeURIComponent(objectID) +
      '?forwardToReplicas=' + forwardToReplicas,
    hostType: 'write',
    callback: callback
  });
};

Index.prototype.clearSynonyms = function(opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  } else if (opts === undefined) {
    opts = {};
  }

  if (opts.forwardToSlaves !== undefined) deprecateForwardToSlaves();
  var forwardToReplicas = (opts.forwardToSlaves || opts.forwardToReplicas) ? 'true' : 'false';

  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/synonyms/clear' +
      '?forwardToReplicas=' + forwardToReplicas,
    hostType: 'write',
    callback: callback
  });
};

Index.prototype.batchSynonyms = function(synonyms, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  } else if (opts === undefined) {
    opts = {};
  }

  if (opts.forwardToSlaves !== undefined) deprecateForwardToSlaves();
  var forwardToReplicas = (opts.forwardToSlaves || opts.forwardToReplicas) ? 'true' : 'false';

  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/synonyms/batch' +
      '?forwardToReplicas=' + forwardToReplicas +
      '&replaceExistingSynonyms=' + (opts.replaceExistingSynonyms ? 'true' : 'false'),
    hostType: 'write',
    body: synonyms,
    callback: callback
  });
};

Index.prototype.searchRules = function(params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = {};
  } else if (params === undefined) {
    params = {};
  }

  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/rules/search',
    body: params,
    hostType: 'read',
    callback: callback
  });
};
/**
 * Retrieve all the query rules in an index
 * @param [number=100] hitsPerPage The amount of query rules to retrieve per batch
 * @param [function] callback will be called after all query rules are retrieved
 *  error: null or Error('message')
 */
Index.prototype.exportRules = function(hitsPerPage, callback) {
  return exportData(this.searchRules.bind(this), hitsPerPage, callback);
};

Index.prototype.saveRule = function(rule, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  } else if (opts === undefined) {
    opts = {};
  }

  if (!rule.objectID) {
    throw new errors.AlgoliaSearchError('Missing or empty objectID field for rule');
  }

  var forwardToReplicas = opts.forwardToReplicas === true ? 'true' : 'false';

  return this.as._jsonRequest({
    method: 'PUT',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/rules/' + encodeURIComponent(rule.objectID) +
      '?forwardToReplicas=' + forwardToReplicas,
    body: rule,
    hostType: 'write',
    callback: callback
  });
};

Index.prototype.getRule = function(objectID, callback) {
  return this.as._jsonRequest({
    method: 'GET',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/rules/' + encodeURIComponent(objectID),
    hostType: 'read',
    callback: callback
  });
};

Index.prototype.deleteRule = function(objectID, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  } else if (opts === undefined) {
    opts = {};
  }

  var forwardToReplicas = opts.forwardToReplicas === true ? 'true' : 'false';

  return this.as._jsonRequest({
    method: 'DELETE',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/rules/' + encodeURIComponent(objectID) +
      '?forwardToReplicas=' + forwardToReplicas,
    hostType: 'write',
    callback: callback
  });
};

Index.prototype.clearRules = function(opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  } else if (opts === undefined) {
    opts = {};
  }

  var forwardToReplicas = opts.forwardToReplicas === true ? 'true' : 'false';

  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/rules/clear' +
      '?forwardToReplicas=' + forwardToReplicas,
    hostType: 'write',
    callback: callback
  });
};

Index.prototype.batchRules = function(rules, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  } else if (opts === undefined) {
    opts = {};
  }

  var forwardToReplicas = opts.forwardToReplicas === true ? 'true' : 'false';

  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/rules/batch' +
      '?forwardToReplicas=' + forwardToReplicas +
      '&clearExistingRules=' + (opts.clearExistingRules === true ? 'true' : 'false'),
    hostType: 'write',
    body: rules,
    callback: callback
  });
};

/*
* Set settings for this index
*
* @param settigns the settings object that can contains :
* - minWordSizefor1Typo: (integer) the minimum number of characters to accept one typo (default = 3).
* - minWordSizefor2Typos: (integer) the minimum number of characters to accept two typos (default = 7).
* - hitsPerPage: (integer) the number of hits per page (default = 10).
* - attributesToRetrieve: (array of strings) default list of attributes to retrieve in objects.
*   If set to null, all attributes are retrieved.
* - attributesToHighlight: (array of strings) default list of attributes to highlight.
*   If set to null, all indexed attributes are highlighted.
* - attributesToSnippet**: (array of strings) default list of attributes to snippet alongside the number
* of words to return (syntax is attributeName:nbWords).
*   By default no snippet is computed. If set to null, no snippet is computed.
* - attributesToIndex: (array of strings) the list of fields you want to index.
*   If set to null, all textual and numerical attributes of your objects are indexed,
*   but you should update it to get optimal results.
*   This parameter has two important uses:
*     - Limit the attributes to index: For example if you store a binary image in base64,
*     you want to store it and be able to
*       retrieve it but you don't want to search in the base64 string.
*     - Control part of the ranking*: (see the ranking parameter for full explanation)
*     Matches in attributes at the beginning of
*       the list will be considered more important than matches in attributes further down the list.
*       In one attribute, matching text at the beginning of the attribute will be
*       considered more important than text after, you can disable
*       this behavior if you add your attribute inside `unordered(AttributeName)`,
*       for example attributesToIndex: ["title", "unordered(text)"].
* - attributesForFaceting: (array of strings) The list of fields you want to use for faceting.
*   All strings in the attribute selected for faceting are extracted and added as a facet.
*   If set to null, no attribute is used for faceting.
* - attributeForDistinct: (string) The attribute name used for the Distinct feature.
* This feature is similar to the SQL "distinct" keyword: when enabled
*   in query with the distinct=1 parameter, all hits containing a duplicate
*   value for this attribute are removed from results.
*   For example, if the chosen attribute is show_name and several hits have
*   the same value for show_name, then only the best one is kept and others are removed.
* - ranking: (array of strings) controls the way results are sorted.
*   We have six available criteria:
*    - typo: sort according to number of typos,
*    - geo: sort according to decreassing distance when performing a geo-location based search,
*    - proximity: sort according to the proximity of query words in hits,
*    - attribute: sort according to the order of attributes defined by attributesToIndex,
*    - exact:
*        - if the user query contains one word: sort objects having an attribute
*        that is exactly the query word before others.
*          For example if you search for the "V" TV show, you want to find it
*          with the "V" query and avoid to have all popular TV
*          show starting by the v letter before it.
*        - if the user query contains multiple words: sort according to the
*        number of words that matched exactly (and not as a prefix).
*    - custom: sort according to a user defined formula set in **customRanking** attribute.
*   The standard order is ["typo", "geo", "proximity", "attribute", "exact", "custom"]
* - customRanking: (array of strings) lets you specify part of the ranking.
*   The syntax of this condition is an array of strings containing attributes
*   prefixed by asc (ascending order) or desc (descending order) operator.
*   For example `"customRanking" => ["desc(population)", "asc(name)"]`
* - queryType: Select how the query words are interpreted, it can be one of the following value:
*   - prefixAll: all query words are interpreted as prefixes,
*   - prefixLast: only the last word is interpreted as a prefix (default behavior),
*   - prefixNone: no query word is interpreted as a prefix. This option is not recommended.
* - highlightPreTag: (string) Specify the string that is inserted before
* the highlighted parts in the query result (default to "<em>").
* - highlightPostTag: (string) Specify the string that is inserted after
* the highlighted parts in the query result (default to "</em>").
* - optionalWords: (array of strings) Specify a list of words that should
* be considered as optional when found in the query.
* @param callback (optional) the result callback called with two arguments
*  error: null or Error('message')
*  content: the server answer or the error message if a failure occured
*/
Index.prototype.setSettings = function(settings, opts, callback) {
  if (arguments.length === 1 || typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  if (opts.forwardToSlaves !== undefined) deprecateForwardToSlaves();
  var forwardToReplicas = (opts.forwardToSlaves || opts.forwardToReplicas) ? 'true' : 'false';

  var indexObj = this;
  return this.as._jsonRequest({
    method: 'PUT',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/settings?forwardToReplicas='
      + forwardToReplicas,
    hostType: 'write',
    body: settings,
    callback: callback
  });
};

/*
* @deprecated see client.listApiKeys()
*/
Index.prototype.listUserKeys = deprecate(function(callback) {
  return this.listApiKeys(callback);
}, deprecatedMessage('index.listUserKeys()', 'client.listApiKeys()'));

/*
* List all existing API keys to this index
*
* @param callback the result callback called with two arguments
*  error: null or Error('message')
*  content: the server answer with API keys belonging to the index
*
* @deprecated see client.listApiKeys()
*/
Index.prototype.listApiKeys = deprecate(function(callback) {
  var indexObj = this;
  return this.as._jsonRequest({
    method: 'GET',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/keys',
    hostType: 'read',
    callback: callback
  });
}, deprecatedMessage('index.listApiKeys()', 'client.listApiKeys()'));

/*
* @deprecated see client.getApiKey()
*/
Index.prototype.getUserKeyACL = deprecate(function(key, callback) {
  return this.getApiKey(key, callback);
}, deprecatedMessage('index.getUserKeyACL()', 'client.getApiKey()'));


/*
* Get an API key from this index
*
* @param key
* @param callback the result callback called with two arguments
*  error: null or Error('message')
*  content: the server answer with the right API key
*
* @deprecated see client.getApiKey()
*/
Index.prototype.getApiKey = deprecate(function(key, callback) {
  var indexObj = this;
  return this.as._jsonRequest({
    method: 'GET',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/keys/' + key,
    hostType: 'read',
    callback: callback
  });
}, deprecatedMessage('index.getApiKey()', 'client.getApiKey()'));

/*
* @deprecated see client.deleteApiKey()
*/
Index.prototype.deleteUserKey = deprecate(function(key, callback) {
  return this.deleteApiKey(key, callback);
}, deprecatedMessage('index.deleteUserKey()', 'client.deleteApiKey()'));

/*
* Delete an existing API key associated to this index
*
* @param key
* @param callback the result callback called with two arguments
*  error: null or Error('message')
*  content: the server answer with the deletion date
*
* @deprecated see client.deleteApiKey()
*/
Index.prototype.deleteApiKey = deprecate(function(key, callback) {
  var indexObj = this;
  return this.as._jsonRequest({
    method: 'DELETE',
    url: '/1/indexes/' + encodeURIComponent(indexObj.indexName) + '/keys/' + key,
    hostType: 'write',
    callback: callback
  });
}, deprecatedMessage('index.deleteApiKey()', 'client.deleteApiKey()'));

/*
* @deprecated see client.addApiKey()
*/
Index.prototype.addUserKey = deprecate(function(acls, params, callback) {
  return this.addApiKey(acls, params, callback);
}, deprecatedMessage('index.addUserKey()', 'client.addApiKey()'));

/*
* Add a new API key to this index
*
* @param {string[]} acls - The list of ACL for this key. Defined by an array of strings that
*   can contains the following values:
*     - search: allow to search (https and http)
*     - addObject: allows to add/update an object in the index (https only)
*     - deleteObject : allows to delete an existing object (https only)
*     - deleteIndex : allows to delete index content (https only)
*     - settings : allows to get index settings (https only)
*     - editSettings : allows to change index settings (https only)
* @param {Object} [params] - Optionnal parameters to set for the key
* @param {number} params.validity - Number of seconds after which the key will
* be automatically removed (0 means no time limit for this key)
* @param {number} params.maxQueriesPerIPPerHour - Number of API calls allowed from an IP address per hour
* @param {number} params.maxHitsPerQuery - Number of hits this API key can retrieve in one call
* @param {string} params.description - A description for your key
* @param {string[]} params.referers - A list of authorized referers
* @param {Object} params.queryParameters - Force the key to use specific query parameters
* @param {Function} callback - The result callback called with two arguments
*   error: null or Error('message')
*   content: the server answer with the added API key
* @return {Promise|undefined} Returns a promise if no callback given
* @example
* index.addUserKey(['search'], {
*   validity: 300,
*   maxQueriesPerIPPerHour: 2000,
*   maxHitsPerQuery: 3,
*   description: 'Eat three fruits',
*   referers: ['*.algolia.com'],
*   queryParameters: {
*     tagFilters: ['public'],
*   }
* })
* @see {@link https://www.algolia.com/doc/rest_api#AddIndexKey|Algolia REST API Documentation}
*
* @deprecated see client.addApiKey()
*/
Index.prototype.addApiKey = deprecate(function(acls, params, callback) {
  var isArray = __webpack_require__(19);
  var usage = 'Usage: index.addApiKey(arrayOfAcls[, params, callback])';

  if (!isArray(acls)) {
    throw new Error(usage);
  }

  if (arguments.length === 1 || typeof params === 'function') {
    callback = params;
    params = null;
  }

  var postObj = {
    acl: acls
  };

  if (params) {
    postObj.validity = params.validity;
    postObj.maxQueriesPerIPPerHour = params.maxQueriesPerIPPerHour;
    postObj.maxHitsPerQuery = params.maxHitsPerQuery;
    postObj.description = params.description;

    if (params.queryParameters) {
      postObj.queryParameters = this.as._getSearchParams(params.queryParameters, '');
    }

    postObj.referers = params.referers;
  }

  return this.as._jsonRequest({
    method: 'POST',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/keys',
    body: postObj,
    hostType: 'write',
    callback: callback
  });
}, deprecatedMessage('index.addApiKey()', 'client.addApiKey()'));

/**
* @deprecated use client.addApiKey()
*/
Index.prototype.addUserKeyWithValidity = deprecate(function deprecatedAddUserKeyWithValidity(acls, params, callback) {
  return this.addApiKey(acls, params, callback);
}, deprecatedMessage('index.addUserKeyWithValidity()', 'client.addApiKey()'));

/*
* @deprecated see client.updateApiKey()
*/
Index.prototype.updateUserKey = deprecate(function(key, acls, params, callback) {
  return this.updateApiKey(key, acls, params, callback);
}, deprecatedMessage('index.updateUserKey()', 'client.updateApiKey()'));

/**
* Update an existing API key of this index
* @param {string} key - The key to update
* @param {string[]} acls - The list of ACL for this key. Defined by an array of strings that
*   can contains the following values:
*     - search: allow to search (https and http)
*     - addObject: allows to add/update an object in the index (https only)
*     - deleteObject : allows to delete an existing object (https only)
*     - deleteIndex : allows to delete index content (https only)
*     - settings : allows to get index settings (https only)
*     - editSettings : allows to change index settings (https only)
* @param {Object} [params] - Optionnal parameters to set for the key
* @param {number} params.validity - Number of seconds after which the key will
* be automatically removed (0 means no time limit for this key)
* @param {number} params.maxQueriesPerIPPerHour - Number of API calls allowed from an IP address per hour
* @param {number} params.maxHitsPerQuery - Number of hits this API key can retrieve in one call
* @param {string} params.description - A description for your key
* @param {string[]} params.referers - A list of authorized referers
* @param {Object} params.queryParameters - Force the key to use specific query parameters
* @param {Function} callback - The result callback called with two arguments
*   error: null or Error('message')
*   content: the server answer with user keys list
* @return {Promise|undefined} Returns a promise if no callback given
* @example
* index.updateApiKey('APIKEY', ['search'], {
*   validity: 300,
*   maxQueriesPerIPPerHour: 2000,
*   maxHitsPerQuery: 3,
*   description: 'Eat three fruits',
*   referers: ['*.algolia.com'],
*   queryParameters: {
*     tagFilters: ['public'],
*   }
* })
* @see {@link https://www.algolia.com/doc/rest_api#UpdateIndexKey|Algolia REST API Documentation}
*
* @deprecated see client.updateApiKey()
*/
Index.prototype.updateApiKey = deprecate(function(key, acls, params, callback) {
  var isArray = __webpack_require__(19);
  var usage = 'Usage: index.updateApiKey(key, arrayOfAcls[, params, callback])';

  if (!isArray(acls)) {
    throw new Error(usage);
  }

  if (arguments.length === 2 || typeof params === 'function') {
    callback = params;
    params = null;
  }

  var putObj = {
    acl: acls
  };

  if (params) {
    putObj.validity = params.validity;
    putObj.maxQueriesPerIPPerHour = params.maxQueriesPerIPPerHour;
    putObj.maxHitsPerQuery = params.maxHitsPerQuery;
    putObj.description = params.description;

    if (params.queryParameters) {
      putObj.queryParameters = this.as._getSearchParams(params.queryParameters, '');
    }

    putObj.referers = params.referers;
  }

  return this.as._jsonRequest({
    method: 'PUT',
    url: '/1/indexes/' + encodeURIComponent(this.indexName) + '/keys/' + key,
    body: putObj,
    hostType: 'write',
    callback: callback
  });
}, deprecatedMessage('index.updateApiKey()', 'client.updateApiKey()'));


/***/ }),

/***/ 460:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// modified from https://github.com/es-shims/es5-shim
var has = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var slice = Array.prototype.slice;
var isArgs = __webpack_require__(461);
var isEnumerable = Object.prototype.propertyIsEnumerable;
var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
var dontEnums = [
	'toString',
	'toLocaleString',
	'valueOf',
	'hasOwnProperty',
	'isPrototypeOf',
	'propertyIsEnumerable',
	'constructor'
];
var equalsConstructorPrototype = function (o) {
	var ctor = o.constructor;
	return ctor && ctor.prototype === o;
};
var excludedKeys = {
	$console: true,
	$external: true,
	$frame: true,
	$frameElement: true,
	$frames: true,
	$innerHeight: true,
	$innerWidth: true,
	$outerHeight: true,
	$outerWidth: true,
	$pageXOffset: true,
	$pageYOffset: true,
	$parent: true,
	$scrollLeft: true,
	$scrollTop: true,
	$scrollX: true,
	$scrollY: true,
	$self: true,
	$webkitIndexedDB: true,
	$webkitStorageInfo: true,
	$window: true
};
var hasAutomationEqualityBug = (function () {
	/* global window */
	if (typeof window === 'undefined') { return false; }
	for (var k in window) {
		try {
			if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
				try {
					equalsConstructorPrototype(window[k]);
				} catch (e) {
					return true;
				}
			}
		} catch (e) {
			return true;
		}
	}
	return false;
}());
var equalsConstructorPrototypeIfNotBuggy = function (o) {
	/* global window */
	if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
		return equalsConstructorPrototype(o);
	}
	try {
		return equalsConstructorPrototype(o);
	} catch (e) {
		return false;
	}
};

var keysShim = function keys(object) {
	var isObject = object !== null && typeof object === 'object';
	var isFunction = toStr.call(object) === '[object Function]';
	var isArguments = isArgs(object);
	var isString = isObject && toStr.call(object) === '[object String]';
	var theKeys = [];

	if (!isObject && !isFunction && !isArguments) {
		throw new TypeError('Object.keys called on a non-object');
	}

	var skipProto = hasProtoEnumBug && isFunction;
	if (isString && object.length > 0 && !has.call(object, 0)) {
		for (var i = 0; i < object.length; ++i) {
			theKeys.push(String(i));
		}
	}

	if (isArguments && object.length > 0) {
		for (var j = 0; j < object.length; ++j) {
			theKeys.push(String(j));
		}
	} else {
		for (var name in object) {
			if (!(skipProto && name === 'prototype') && has.call(object, name)) {
				theKeys.push(String(name));
			}
		}
	}

	if (hasDontEnumBug) {
		var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

		for (var k = 0; k < dontEnums.length; ++k) {
			if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
				theKeys.push(dontEnums[k]);
			}
		}
	}
	return theKeys;
};

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			return (Object.keys(arguments) || '').length === 2;
		}(1, 2));
		if (!keysWorksWithArguments) {
			var originalKeys = Object.keys;
			Object.keys = function keys(object) {
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				} else {
					return originalKeys(object);
				}
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;


/***/ }),

/***/ 461:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};


/***/ }),

/***/ 462:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// This is the object returned by the `index.browseAll()` method

module.exports = IndexBrowser;

var inherits = __webpack_require__(68);
var EventEmitter = __webpack_require__(261).EventEmitter;

function IndexBrowser() {
}

inherits(IndexBrowser, EventEmitter);

IndexBrowser.prototype.stop = function() {
  this._stopped = true;
  this._clean();
};

IndexBrowser.prototype._end = function() {
  this.emit('end');
  this._clean();
};

IndexBrowser.prototype._error = function(err) {
  this.emit('error', err);
  this._clean();
};

IndexBrowser.prototype._result = function(content) {
  this.emit('result', content);
};

IndexBrowser.prototype._clean = function() {
  this.removeAllListeners('stop');
  this.removeAllListeners('end');
  this.removeAllListeners('error');
  this.removeAllListeners('result');
};


/***/ }),

/***/ 463:
/***/ (function(module, exports, __webpack_require__) {

module.exports = AlgoliaSearchCore;

var errors = __webpack_require__(49);
var exitPromise = __webpack_require__(242);
var IndexCore = __webpack_require__(238);
var store = __webpack_require__(464);

// We will always put the API KEY in the JSON body in case of too long API KEY,
// to avoid query string being too long and failing in various conditions (our server limit, browser limit,
// proxies limit)
var MAX_API_KEY_LENGTH = 500;
var RESET_APP_DATA_TIMER =
  Object({"NODE_ENV":"production"}).RESET_APP_DATA_TIMER && parseInt(Object({"NODE_ENV":"production"}).RESET_APP_DATA_TIMER, 10) ||
  60 * 2 * 1000; // after 2 minutes reset to first host

/*
 * Algolia Search library initialization
 * https://www.algolia.com/
 *
 * @param {string} applicationID - Your applicationID, found in your dashboard
 * @param {string} apiKey - Your API key, found in your dashboard
 * @param {Object} [opts]
 * @param {number} [opts.timeout=2000] - The request timeout set in milliseconds,
 * another request will be issued after this timeout
 * @param {string} [opts.protocol='https:'] - The protocol used to query Algolia Search API.
 *                                        Set to 'http:' to force using http.
 * @param {Object|Array} [opts.hosts={
 *           read: [this.applicationID + '-dsn.algolia.net'].concat([
 *             this.applicationID + '-1.algolianet.com',
 *             this.applicationID + '-2.algolianet.com',
 *             this.applicationID + '-3.algolianet.com']
 *           ]),
 *           write: [this.applicationID + '.algolia.net'].concat([
 *             this.applicationID + '-1.algolianet.com',
 *             this.applicationID + '-2.algolianet.com',
 *             this.applicationID + '-3.algolianet.com']
 *           ]) - The hosts to use for Algolia Search API.
 *           If you provide them, you will less benefit from our HA implementation
 */
function AlgoliaSearchCore(applicationID, apiKey, opts) {
  var debug = __webpack_require__(111)('algoliasearch');

  var clone = __webpack_require__(38);
  var isArray = __webpack_require__(19);
  var map = __webpack_require__(51);

  var usage = 'Usage: algoliasearch(applicationID, apiKey, opts)';

  if (opts._allowEmptyCredentials !== true && !applicationID) {
    throw new errors.AlgoliaSearchError('Please provide an application ID. ' + usage);
  }

  if (opts._allowEmptyCredentials !== true && !apiKey) {
    throw new errors.AlgoliaSearchError('Please provide an API key. ' + usage);
  }

  this.applicationID = applicationID;
  this.apiKey = apiKey;

  this.hosts = {
    read: [],
    write: []
  };

  opts = opts || {};

  this._timeouts = opts.timeouts || {
    connect: 1 * 1000, // 500ms connect is GPRS latency
    read: 2 * 1000,
    write: 30 * 1000
  };

  // backward compat, if opts.timeout is passed, we use it to configure all timeouts like before
  if (opts.timeout) {
    this._timeouts.connect = this._timeouts.read = this._timeouts.write = opts.timeout;
  }

  var protocol = opts.protocol || 'https:';
  // while we advocate for colon-at-the-end values: 'http:' for `opts.protocol`
  // we also accept `http` and `https`. It's a common error.
  if (!/:$/.test(protocol)) {
    protocol = protocol + ':';
  }

  if (protocol !== 'http:' && protocol !== 'https:') {
    throw new errors.AlgoliaSearchError('protocol must be `http:` or `https:` (was `' + opts.protocol + '`)');
  }

  this._checkAppIdData();

  if (!opts.hosts) {
    var defaultHosts = map(this._shuffleResult, function(hostNumber) {
      return applicationID + '-' + hostNumber + '.algolianet.com';
    });

    // no hosts given, compute defaults
    var mainSuffix = (opts.dsn === false ? '' : '-dsn') + '.algolia.net';
    this.hosts.read = [this.applicationID + mainSuffix].concat(defaultHosts);
    this.hosts.write = [this.applicationID + '.algolia.net'].concat(defaultHosts);
  } else if (isArray(opts.hosts)) {
    // when passing custom hosts, we need to have a different host index if the number
    // of write/read hosts are different.
    this.hosts.read = clone(opts.hosts);
    this.hosts.write = clone(opts.hosts);
  } else {
    this.hosts.read = clone(opts.hosts.read);
    this.hosts.write = clone(opts.hosts.write);
  }

  // add protocol and lowercase hosts
  this.hosts.read = map(this.hosts.read, prepareHost(protocol));
  this.hosts.write = map(this.hosts.write, prepareHost(protocol));

  this.extraHeaders = {};

  // In some situations you might want to warm the cache
  this.cache = opts._cache || {};

  this._ua = opts._ua;
  this._useCache = opts._useCache === undefined || opts._cache ? true : opts._useCache;
  this._useFallback = opts.useFallback === undefined ? true : opts.useFallback;

  this._setTimeout = opts._setTimeout;

  debug('init done, %j', this);
}

/*
 * Get the index object initialized
 *
 * @param indexName the name of index
 * @param callback the result callback with one argument (the Index instance)
 */
AlgoliaSearchCore.prototype.initIndex = function(indexName) {
  return new IndexCore(this, indexName);
};

/**
* Add an extra field to the HTTP request
*
* @param name the header field name
* @param value the header field value
*/
AlgoliaSearchCore.prototype.setExtraHeader = function(name, value) {
  this.extraHeaders[name.toLowerCase()] = value;
};

/**
* Get the value of an extra HTTP header
*
* @param name the header field name
*/
AlgoliaSearchCore.prototype.getExtraHeader = function(name) {
  return this.extraHeaders[name.toLowerCase()];
};

/**
* Remove an extra field from the HTTP request
*
* @param name the header field name
*/
AlgoliaSearchCore.prototype.unsetExtraHeader = function(name) {
  delete this.extraHeaders[name.toLowerCase()];
};

/**
* Augment sent x-algolia-agent with more data, each agent part
* is automatically separated from the others by a semicolon;
*
* @param algoliaAgent the agent to add
*/
AlgoliaSearchCore.prototype.addAlgoliaAgent = function(algoliaAgent) {
  if (this._ua.indexOf(';' + algoliaAgent) === -1) {
    this._ua += ';' + algoliaAgent;
  }
};

/*
 * Wrapper that try all hosts to maximize the quality of service
 */
AlgoliaSearchCore.prototype._jsonRequest = function(initialOpts) {
  this._checkAppIdData();

  var requestDebug = __webpack_require__(111)('algoliasearch:' + initialOpts.url);

  var body;
  var additionalUA = initialOpts.additionalUA || '';
  var cache = initialOpts.cache;
  var client = this;
  var tries = 0;
  var usingFallback = false;
  var hasFallback = client._useFallback && client._request.fallback && initialOpts.fallback;
  var headers;

  if (
    this.apiKey.length > MAX_API_KEY_LENGTH &&
    initialOpts.body !== undefined &&
    (initialOpts.body.params !== undefined || // index.search()
    initialOpts.body.requests !== undefined) // client.search()
  ) {
    initialOpts.body.apiKey = this.apiKey;
    headers = this._computeRequestHeaders({
      additionalUA: additionalUA,
      withApiKey: false,
      headers: initialOpts.headers
    });
  } else {
    headers = this._computeRequestHeaders({
      additionalUA: additionalUA,
      headers: initialOpts.headers
    });
  }

  if (initialOpts.body !== undefined) {
    body = safeJSONStringify(initialOpts.body);
  }

  requestDebug('request start');
  var debugData = [];

  function doRequest(requester, reqOpts) {
    client._checkAppIdData();

    var startTime = new Date();
    var cacheID;

    if (client._useCache) {
      cacheID = initialOpts.url;
    }

    // as we sometime use POST requests to pass parameters (like query='aa'),
    // the cacheID must also include the body to be different between calls
    if (client._useCache && body) {
      cacheID += '_body_' + reqOpts.body;
    }

    // handle cache existence
    if (client._useCache && cache && cache[cacheID] !== undefined) {
      requestDebug('serving response from cache');
      return client._promise.resolve(JSON.parse(cache[cacheID]));
    }

    // if we reached max tries
    if (tries >= client.hosts[initialOpts.hostType].length) {
      if (!hasFallback || usingFallback) {
        requestDebug('could not get any response');
        // then stop
        return client._promise.reject(new errors.AlgoliaSearchError(
          'Cannot connect to the AlgoliaSearch API.' +
          ' Send an email to support@algolia.com to report and resolve the issue.' +
          ' Application id was: ' + client.applicationID, {debugData: debugData}
        ));
      }

      requestDebug('switching to fallback');

      // let's try the fallback starting from here
      tries = 0;

      // method, url and body are fallback dependent
      reqOpts.method = initialOpts.fallback.method;
      reqOpts.url = initialOpts.fallback.url;
      reqOpts.jsonBody = initialOpts.fallback.body;
      if (reqOpts.jsonBody) {
        reqOpts.body = safeJSONStringify(reqOpts.jsonBody);
      }
      // re-compute headers, they could be omitting the API KEY
      headers = client._computeRequestHeaders({
        additionalUA: additionalUA,
        headers: initialOpts.headers
      });

      reqOpts.timeouts = client._getTimeoutsForRequest(initialOpts.hostType);
      client._setHostIndexByType(0, initialOpts.hostType);
      usingFallback = true; // the current request is now using fallback
      return doRequest(client._request.fallback, reqOpts);
    }

    var currentHost = client._getHostByType(initialOpts.hostType);

    var url = currentHost + reqOpts.url;
    var options = {
      body: reqOpts.body,
      jsonBody: reqOpts.jsonBody,
      method: reqOpts.method,
      headers: headers,
      timeouts: reqOpts.timeouts,
      debug: requestDebug
    };

    requestDebug('method: %s, url: %s, headers: %j, timeouts: %d',
      options.method, url, options.headers, options.timeouts);

    if (requester === client._request.fallback) {
      requestDebug('using fallback');
    }

    // `requester` is any of this._request or this._request.fallback
    // thus it needs to be called using the client as context
    return requester.call(client, url, options).then(success, tryFallback);

    function success(httpResponse) {
      // compute the status of the response,
      //
      // When in browser mode, using XDR or JSONP, we have no statusCode available
      // So we rely on our API response `status` property.
      // But `waitTask` can set a `status` property which is not the statusCode (it's the task status)
      // So we check if there's a `message` along `status` and it means it's an error
      //
      // That's the only case where we have a response.status that's not the http statusCode
      var status = httpResponse && httpResponse.body && httpResponse.body.message && httpResponse.body.status ||

        // this is important to check the request statusCode AFTER the body eventual
        // statusCode because some implementations (jQuery XDomainRequest transport) may
        // send statusCode 200 while we had an error
        httpResponse.statusCode ||

        // When in browser mode, using XDR or JSONP
        // we default to success when no error (no response.status && response.message)
        // If there was a JSON.parse() error then body is null and it fails
        httpResponse && httpResponse.body && 200;

      requestDebug('received response: statusCode: %s, computed statusCode: %d, headers: %j',
        httpResponse.statusCode, status, httpResponse.headers);

      var httpResponseOk = Math.floor(status / 100) === 2;

      var endTime = new Date();
      debugData.push({
        currentHost: currentHost,
        headers: removeCredentials(headers),
        content: body || null,
        contentLength: body !== undefined ? body.length : null,
        method: reqOpts.method,
        timeouts: reqOpts.timeouts,
        url: reqOpts.url,
        startTime: startTime,
        endTime: endTime,
        duration: endTime - startTime,
        statusCode: status
      });

      if (httpResponseOk) {
        if (client._useCache && cache) {
          cache[cacheID] = httpResponse.responseText;
        }

        return httpResponse.body;
      }

      var shouldRetry = Math.floor(status / 100) !== 4;

      if (shouldRetry) {
        tries += 1;
        return retryRequest();
      }

      requestDebug('unrecoverable error');

      // no success and no retry => fail
      var unrecoverableError = new errors.AlgoliaSearchError(
        httpResponse.body && httpResponse.body.message, {debugData: debugData, statusCode: status}
      );

      return client._promise.reject(unrecoverableError);
    }

    function tryFallback(err) {
      // error cases:
      //  While not in fallback mode:
      //    - CORS not supported
      //    - network error
      //  While in fallback mode:
      //    - timeout
      //    - network error
      //    - badly formatted JSONP (script loaded, did not call our callback)
      //  In both cases:
      //    - uncaught exception occurs (TypeError)
      requestDebug('error: %s, stack: %s', err.message, err.stack);

      var endTime = new Date();
      debugData.push({
        currentHost: currentHost,
        headers: removeCredentials(headers),
        content: body || null,
        contentLength: body !== undefined ? body.length : null,
        method: reqOpts.method,
        timeouts: reqOpts.timeouts,
        url: reqOpts.url,
        startTime: startTime,
        endTime: endTime,
        duration: endTime - startTime
      });

      if (!(err instanceof errors.AlgoliaSearchError)) {
        err = new errors.Unknown(err && err.message, err);
      }

      tries += 1;

      // stop the request implementation when:
      if (
        // we did not generate this error,
        // it comes from a throw in some other piece of code
        err instanceof errors.Unknown ||

        // server sent unparsable JSON
        err instanceof errors.UnparsableJSON ||

        // max tries and already using fallback or no fallback
        tries >= client.hosts[initialOpts.hostType].length &&
        (usingFallback || !hasFallback)) {
        // stop request implementation for this command
        err.debugData = debugData;
        return client._promise.reject(err);
      }

      // When a timeout occured, retry by raising timeout
      if (err instanceof errors.RequestTimeout) {
        return retryRequestWithHigherTimeout();
      }

      return retryRequest();
    }

    function retryRequest() {
      requestDebug('retrying request');
      client._incrementHostIndex(initialOpts.hostType);
      return doRequest(requester, reqOpts);
    }

    function retryRequestWithHigherTimeout() {
      requestDebug('retrying request with higher timeout');
      client._incrementHostIndex(initialOpts.hostType);
      client._incrementTimeoutMultipler();
      reqOpts.timeouts = client._getTimeoutsForRequest(initialOpts.hostType);
      return doRequest(requester, reqOpts);
    }
  }

  var promise = doRequest(
    client._request, {
      url: initialOpts.url,
      method: initialOpts.method,
      body: body,
      jsonBody: initialOpts.body,
      timeouts: client._getTimeoutsForRequest(initialOpts.hostType)
    }
  );

  // either we have a callback
  // either we are using promises
  if (typeof initialOpts.callback === 'function') {
    promise.then(function okCb(content) {
      exitPromise(function() {
        initialOpts.callback(null, content);
      }, client._setTimeout || setTimeout);
    }, function nookCb(err) {
      exitPromise(function() {
        initialOpts.callback(err);
      }, client._setTimeout || setTimeout);
    });
  } else {
    return promise;
  }
};

/*
* Transform search param object in query string
* @param {object} args arguments to add to the current query string
* @param {string} params current query string
* @return {string} the final query string
*/
AlgoliaSearchCore.prototype._getSearchParams = function(args, params) {
  if (args === undefined || args === null) {
    return params;
  }
  for (var key in args) {
    if (key !== null && args[key] !== undefined && args.hasOwnProperty(key)) {
      params += params === '' ? '' : '&';
      params += key + '=' + encodeURIComponent(Object.prototype.toString.call(args[key]) === '[object Array]' ? safeJSONStringify(args[key]) : args[key]);
    }
  }
  return params;
};

/**
 * Compute the headers for a request
 *
 * @param [string] options.additionalUA semi-colon separated string with other user agents to add
 * @param [boolean=true] options.withApiKey Send the api key as a header
 * @param [Object] options.headers Extra headers to send
 */
AlgoliaSearchCore.prototype._computeRequestHeaders = function(options) {
  var forEach = __webpack_require__(50);

  var ua = options.additionalUA ?
    this._ua + ';' + options.additionalUA :
    this._ua;

  var requestHeaders = {
    'x-algolia-agent': ua,
    'x-algolia-application-id': this.applicationID
  };

  // browser will inline headers in the url, node.js will use http headers
  // but in some situations, the API KEY will be too long (big secured API keys)
  // so if the request is a POST and the KEY is very long, we will be asked to not put
  // it into headers but in the JSON body
  if (options.withApiKey !== false) {
    requestHeaders['x-algolia-api-key'] = this.apiKey;
  }

  if (this.userToken) {
    requestHeaders['x-algolia-usertoken'] = this.userToken;
  }

  if (this.securityTags) {
    requestHeaders['x-algolia-tagfilters'] = this.securityTags;
  }

  forEach(this.extraHeaders, function addToRequestHeaders(value, key) {
    requestHeaders[key] = value;
  });

  if (options.headers) {
    forEach(options.headers, function addToRequestHeaders(value, key) {
      requestHeaders[key] = value;
    });
  }

  return requestHeaders;
};

/**
 * Search through multiple indices at the same time
 * @param  {Object[]}   queries  An array of queries you want to run.
 * @param {string} queries[].indexName The index name you want to target
 * @param {string} [queries[].query] The query to issue on this index. Can also be passed into `params`
 * @param {Object} queries[].params Any search param like hitsPerPage, ..
 * @param  {Function} callback Callback to be called
 * @return {Promise|undefined} Returns a promise if no callback given
 */
AlgoliaSearchCore.prototype.search = function(queries, opts, callback) {
  var isArray = __webpack_require__(19);
  var map = __webpack_require__(51);

  var usage = 'Usage: client.search(arrayOfQueries[, callback])';

  if (!isArray(queries)) {
    throw new Error(usage);
  }

  if (typeof opts === 'function') {
    callback = opts;
    opts = {};
  } else if (opts === undefined) {
    opts = {};
  }

  var client = this;

  var postObj = {
    requests: map(queries, function prepareRequest(query) {
      var params = '';

      // allow query.query
      // so we are mimicing the index.search(query, params) method
      // {indexName:, query:, params:}
      if (query.query !== undefined) {
        params += 'query=' + encodeURIComponent(query.query);
      }

      return {
        indexName: query.indexName,
        params: client._getSearchParams(query.params, params)
      };
    })
  };

  var JSONPParams = map(postObj.requests, function prepareJSONPParams(request, requestId) {
    return requestId + '=' +
      encodeURIComponent(
        '/1/indexes/' + encodeURIComponent(request.indexName) + '?' +
        request.params
      );
  }).join('&');

  var url = '/1/indexes/*/queries';

  if (opts.strategy !== undefined) {
    url += '?strategy=' + opts.strategy;
  }

  return this._jsonRequest({
    cache: this.cache,
    method: 'POST',
    url: url,
    body: postObj,
    hostType: 'read',
    fallback: {
      method: 'GET',
      url: '/1/indexes/*',
      body: {
        params: JSONPParams
      }
    },
    callback: callback
  });
};

/**
* Search for facet values
* https://www.algolia.com/doc/rest-api/search#search-for-facet-values
* This is the top-level API for SFFV.
*
* @param {object[]} queries An array of queries to run.
* @param {string} queries[].indexName Index name, name of the index to search.
* @param {object} queries[].params Query parameters.
* @param {string} queries[].params.facetName Facet name, name of the attribute to search for values in.
* Must be declared as a facet
* @param {string} queries[].params.facetQuery Query for the facet search
* @param {string} [queries[].params.*] Any search parameter of Algolia,
* see https://www.algolia.com/doc/api-client/javascript/search#search-parameters
* Pagination is not supported. The page and hitsPerPage parameters will be ignored.
*/
AlgoliaSearchCore.prototype.searchForFacetValues = function(queries) {
  var isArray = __webpack_require__(19);
  var map = __webpack_require__(51);

  var usage = 'Usage: client.searchForFacetValues([{indexName, params: {facetName, facetQuery, ...params}}, ...queries])'; // eslint-disable-line max-len

  if (!isArray(queries)) {
    throw new Error(usage);
  }

  var client = this;

  return client._promise.all(map(queries, function performQuery(query) {
    if (
      !query ||
      query.indexName === undefined ||
      query.params.facetName === undefined ||
      query.params.facetQuery === undefined
    ) {
      throw new Error(usage);
    }

    var clone = __webpack_require__(38);
    var omit = __webpack_require__(241);

    var indexName = query.indexName;
    var params = query.params;

    var facetName = params.facetName;
    var filteredParams = omit(clone(params), function(keyName) {
      return keyName === 'facetName';
    });
    var searchParameters = client._getSearchParams(filteredParams, '');

    return client._jsonRequest({
      cache: client.cache,
      method: 'POST',
      url:
        '/1/indexes/' +
        encodeURIComponent(indexName) +
        '/facets/' +
        encodeURIComponent(facetName) +
        '/query',
      hostType: 'read',
      body: {params: searchParameters}
    });
  }));
};

/**
 * Set the extra security tagFilters header
 * @param {string|array} tags The list of tags defining the current security filters
 */
AlgoliaSearchCore.prototype.setSecurityTags = function(tags) {
  if (Object.prototype.toString.call(tags) === '[object Array]') {
    var strTags = [];
    for (var i = 0; i < tags.length; ++i) {
      if (Object.prototype.toString.call(tags[i]) === '[object Array]') {
        var oredTags = [];
        for (var j = 0; j < tags[i].length; ++j) {
          oredTags.push(tags[i][j]);
        }
        strTags.push('(' + oredTags.join(',') + ')');
      } else {
        strTags.push(tags[i]);
      }
    }
    tags = strTags.join(',');
  }

  this.securityTags = tags;
};

/**
 * Set the extra user token header
 * @param {string} userToken The token identifying a uniq user (used to apply rate limits)
 */
AlgoliaSearchCore.prototype.setUserToken = function(userToken) {
  this.userToken = userToken;
};

/**
 * Clear all queries in client's cache
 * @return undefined
 */
AlgoliaSearchCore.prototype.clearCache = function() {
  this.cache = {};
};

/**
* Set the number of milliseconds a request can take before automatically being terminated.
* @deprecated
* @param {Number} milliseconds
*/
AlgoliaSearchCore.prototype.setRequestTimeout = function(milliseconds) {
  if (milliseconds) {
    this._timeouts.connect = this._timeouts.read = this._timeouts.write = milliseconds;
  }
};

/**
* Set the three different (connect, read, write) timeouts to be used when requesting
* @param {Object} timeouts
*/
AlgoliaSearchCore.prototype.setTimeouts = function(timeouts) {
  this._timeouts = timeouts;
};

/**
* Get the three different (connect, read, write) timeouts to be used when requesting
* @param {Object} timeouts
*/
AlgoliaSearchCore.prototype.getTimeouts = function() {
  return this._timeouts;
};

AlgoliaSearchCore.prototype._getAppIdData = function() {
  var data = store.get(this.applicationID);
  if (data !== null) this._cacheAppIdData(data);
  return data;
};

AlgoliaSearchCore.prototype._setAppIdData = function(data) {
  data.lastChange = (new Date()).getTime();
  this._cacheAppIdData(data);
  return store.set(this.applicationID, data);
};

AlgoliaSearchCore.prototype._checkAppIdData = function() {
  var data = this._getAppIdData();
  var now = (new Date()).getTime();
  if (data === null || now - data.lastChange > RESET_APP_DATA_TIMER) {
    return this._resetInitialAppIdData(data);
  }

  return data;
};

AlgoliaSearchCore.prototype._resetInitialAppIdData = function(data) {
  var newData = data || {};
  newData.hostIndexes = {read: 0, write: 0};
  newData.timeoutMultiplier = 1;
  newData.shuffleResult = newData.shuffleResult || shuffle([1, 2, 3]);
  return this._setAppIdData(newData);
};

AlgoliaSearchCore.prototype._cacheAppIdData = function(data) {
  this._hostIndexes = data.hostIndexes;
  this._timeoutMultiplier = data.timeoutMultiplier;
  this._shuffleResult = data.shuffleResult;
};

AlgoliaSearchCore.prototype._partialAppIdDataUpdate = function(newData) {
  var foreach = __webpack_require__(50);
  var currentData = this._getAppIdData();
  foreach(newData, function(value, key) {
    currentData[key] = value;
  });

  return this._setAppIdData(currentData);
};

AlgoliaSearchCore.prototype._getHostByType = function(hostType) {
  return this.hosts[hostType][this._getHostIndexByType(hostType)];
};

AlgoliaSearchCore.prototype._getTimeoutMultiplier = function() {
  return this._timeoutMultiplier;
};

AlgoliaSearchCore.prototype._getHostIndexByType = function(hostType) {
  return this._hostIndexes[hostType];
};

AlgoliaSearchCore.prototype._setHostIndexByType = function(hostIndex, hostType) {
  var clone = __webpack_require__(38);
  var newHostIndexes = clone(this._hostIndexes);
  newHostIndexes[hostType] = hostIndex;
  this._partialAppIdDataUpdate({hostIndexes: newHostIndexes});
  return hostIndex;
};

AlgoliaSearchCore.prototype._incrementHostIndex = function(hostType) {
  return this._setHostIndexByType(
    (this._getHostIndexByType(hostType) + 1) % this.hosts[hostType].length, hostType
  );
};

AlgoliaSearchCore.prototype._incrementTimeoutMultipler = function() {
  var timeoutMultiplier = Math.max(this._timeoutMultiplier + 1, 4);
  return this._partialAppIdDataUpdate({timeoutMultiplier: timeoutMultiplier});
};

AlgoliaSearchCore.prototype._getTimeoutsForRequest = function(hostType) {
  return {
    connect: this._timeouts.connect * this._timeoutMultiplier,
    complete: this._timeouts[hostType] * this._timeoutMultiplier
  };
};

function prepareHost(protocol) {
  return function prepare(host) {
    return protocol + '//' + host.toLowerCase();
  };
}

// Prototype.js < 1.7, a widely used library, defines a weird
// Array.prototype.toJSON function that will fail to stringify our content
// appropriately
// refs:
//   - https://groups.google.com/forum/#!topic/prototype-core/E-SAVvV_V9Q
//   - https://github.com/sstephenson/prototype/commit/038a2985a70593c1a86c230fadbdfe2e4898a48c
//   - http://stackoverflow.com/a/3148441/147079
function safeJSONStringify(obj) {
  /* eslint no-extend-native:0 */

  if (Array.prototype.toJSON === undefined) {
    return JSON.stringify(obj);
  }

  var toJSON = Array.prototype.toJSON;
  delete Array.prototype.toJSON;
  var out = JSON.stringify(obj);
  Array.prototype.toJSON = toJSON;

  return out;
}

function shuffle(array) {
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function removeCredentials(headers) {
  var newHeaders = {};

  for (var headerName in headers) {
    if (Object.prototype.hasOwnProperty.call(headers, headerName)) {
      var value;

      if (headerName === 'x-algolia-api-key' || headerName === 'x-algolia-application-id') {
        value = '**hidden for security purposes**';
      } else {
        value = headers[headerName];
      }

      newHeaders[headerName] = value;
    }
  }

  return newHeaders;
}


/***/ }),

/***/ 464:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var debug = __webpack_require__(111)('algoliasearch:src/hostIndexState.js');
var localStorageNamespace = 'algoliasearch-client-js';

var store;
var moduleStore = {
  state: {},
  set: function(key, data) {
    this.state[key] = data;
    return this.state[key];
  },
  get: function(key) {
    return this.state[key] || null;
  }
};

var localStorageStore = {
  set: function(key, data) {
    moduleStore.set(key, data); // always replicate localStorageStore to moduleStore in case of failure

    try {
      var namespace = JSON.parse(global.localStorage[localStorageNamespace]);
      namespace[key] = data;
      global.localStorage[localStorageNamespace] = JSON.stringify(namespace);
      return namespace[key];
    } catch (e) {
      return localStorageFailure(key, e);
    }
  },
  get: function(key) {
    try {
      return JSON.parse(global.localStorage[localStorageNamespace])[key] || null;
    } catch (e) {
      return localStorageFailure(key, e);
    }
  }
};

function localStorageFailure(key, e) {
  debug('localStorage failed with', e);
  cleanup();
  store = moduleStore;
  return store.get(key);
}

store = supportsLocalStorage() ? localStorageStore : moduleStore;

module.exports = {
  get: getOrSet,
  set: getOrSet,
  supportsLocalStorage: supportsLocalStorage
};

function getOrSet(key, data) {
  if (arguments.length === 1) {
    return store.get(key);
  }

  return store.set(key, data);
}

function supportsLocalStorage() {
  try {
    if ('localStorage' in global &&
      global.localStorage !== null) {
      if (!global.localStorage[localStorageNamespace]) {
        // actual creation of the namespace
        global.localStorage.setItem(localStorageNamespace, JSON.stringify({}));
      }
      return true;
    }

    return false;
  } catch (_) {
    return false;
  }
}

// In case of any error on localStorage, we clean our own namespace, this should handle
// quota errors when a lot of keys + data are used
function cleanup() {
  try {
    global.localStorage.removeItem(localStorageNamespace);
  } catch (_) {
    // nothing to do
  }
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),

/***/ 465:
/***/ (function(module, exports, __webpack_require__) {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __webpack_require__(466);

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),

/***/ 466:
/***/ (function(module, exports) {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}


/***/ }),

/***/ 467:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var global = __webpack_require__(468);
var Promise = global.Promise || __webpack_require__(469).Promise;

// This is the standalone browser build entry point
// Browser implementation of the Algolia Search JavaScript client,
// using XMLHttpRequest, XDomainRequest and JSONP as fallback
module.exports = function createAlgoliasearch(AlgoliaSearch, uaSuffix) {
  var inherits = __webpack_require__(68);
  var errors = __webpack_require__(49);
  var inlineHeaders = __webpack_require__(470);
  var jsonpRequest = __webpack_require__(472);
  var places = __webpack_require__(473);
  uaSuffix = uaSuffix || '';

  if (false) {
    require('debug').enable('algoliasearch*');
  }

  function algoliasearch(applicationID, apiKey, opts) {
    var cloneDeep = __webpack_require__(38);

    opts = cloneDeep(opts || {});

    opts._ua = opts._ua || algoliasearch.ua;

    return new AlgoliaSearchBrowser(applicationID, apiKey, opts);
  }

  algoliasearch.version = __webpack_require__(474);
  algoliasearch.ua = 'Algolia for vanilla JavaScript ' + uaSuffix + algoliasearch.version;
  algoliasearch.initPlaces = places(algoliasearch);

  // we expose into window no matter how we are used, this will allow
  // us to easily debug any website running algolia
  global.__algolia = {
    debug: __webpack_require__(111),
    algoliasearch: algoliasearch
  };

  var support = {
    hasXMLHttpRequest: 'XMLHttpRequest' in global,
    hasXDomainRequest: 'XDomainRequest' in global
  };

  if (support.hasXMLHttpRequest) {
    support.cors = 'withCredentials' in new XMLHttpRequest();
  }

  function AlgoliaSearchBrowser() {
    // call AlgoliaSearch constructor
    AlgoliaSearch.apply(this, arguments);
  }

  inherits(AlgoliaSearchBrowser, AlgoliaSearch);

  AlgoliaSearchBrowser.prototype._request = function request(url, opts) {
    return new Promise(function wrapRequest(resolve, reject) {
      // no cors or XDomainRequest, no request
      if (!support.cors && !support.hasXDomainRequest) {
        // very old browser, not supported
        reject(new errors.Network('CORS not supported'));
        return;
      }

      url = inlineHeaders(url, opts.headers);

      var body = opts.body;
      var req = support.cors ? new XMLHttpRequest() : new XDomainRequest();
      var reqTimeout;
      var timedOut;
      var connected = false;

      reqTimeout = setTimeout(onTimeout, opts.timeouts.connect);
      // we set an empty onprogress listener
      // so that XDomainRequest on IE9 is not aborted
      // refs:
      //  - https://github.com/algolia/algoliasearch-client-js/issues/76
      //  - https://social.msdn.microsoft.com/Forums/ie/en-US/30ef3add-767c-4436-b8a9-f1ca19b4812e/ie9-rtm-xdomainrequest-issued-requests-may-abort-if-all-event-handlers-not-specified?forum=iewebdevelopment
      req.onprogress = onProgress;
      if ('onreadystatechange' in req) req.onreadystatechange = onReadyStateChange;
      req.onload = onLoad;
      req.onerror = onError;

      // do not rely on default XHR async flag, as some analytics code like hotjar
      // breaks it and set it to false by default
      if (req instanceof XMLHttpRequest) {
        req.open(opts.method, url, true);
      } else {
        req.open(opts.method, url);
      }

      // headers are meant to be sent after open
      if (support.cors) {
        if (body) {
          if (opts.method === 'POST') {
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS#Simple_requests
            req.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
          } else {
            req.setRequestHeader('content-type', 'application/json');
          }
        }
        req.setRequestHeader('accept', 'application/json');
      }

      req.send(body);

      // event object not received in IE8, at least
      // but we do not use it, still important to note
      function onLoad(/* event */) {
        // When browser does not supports req.timeout, we can
        // have both a load and timeout event, since handled by a dumb setTimeout
        if (timedOut) {
          return;
        }

        clearTimeout(reqTimeout);

        var out;

        try {
          out = {
            body: JSON.parse(req.responseText),
            responseText: req.responseText,
            statusCode: req.status,
            // XDomainRequest does not have any response headers
            headers: req.getAllResponseHeaders && req.getAllResponseHeaders() || {}
          };
        } catch (e) {
          out = new errors.UnparsableJSON({
            more: req.responseText
          });
        }

        if (out instanceof errors.UnparsableJSON) {
          reject(out);
        } else {
          resolve(out);
        }
      }

      function onError(event) {
        if (timedOut) {
          return;
        }

        clearTimeout(reqTimeout);

        // error event is trigerred both with XDR/XHR on:
        //   - DNS error
        //   - unallowed cross domain request
        reject(
          new errors.Network({
            more: event
          })
        );
      }

      function onTimeout() {
        timedOut = true;
        req.abort();

        reject(new errors.RequestTimeout());
      }

      function onConnect() {
        connected = true;
        clearTimeout(reqTimeout);
        reqTimeout = setTimeout(onTimeout, opts.timeouts.complete);
      }

      function onProgress() {
        if (!connected) onConnect();
      }

      function onReadyStateChange() {
        if (!connected && req.readyState > 1) onConnect();
      }
    });
  };

  AlgoliaSearchBrowser.prototype._request.fallback = function requestFallback(url, opts) {
    url = inlineHeaders(url, opts.headers);

    return new Promise(function wrapJsonpRequest(resolve, reject) {
      jsonpRequest(url, opts, function jsonpRequestDone(err, content) {
        if (err) {
          reject(err);
          return;
        }

        resolve(content);
      });
    });
  };

  AlgoliaSearchBrowser.prototype._promise = {
    reject: function rejectPromise(val) {
      return Promise.reject(val);
    },
    resolve: function resolvePromise(val) {
      return Promise.resolve(val);
    },
    delay: function delayPromise(ms) {
      return new Promise(function resolveOnTimeout(resolve/* , reject*/) {
        setTimeout(resolve, ms);
      });
    },
    all: function all(promises) {
      return Promise.all(promises);
    }
  };

  return algoliasearch;
};


/***/ }),

/***/ 468:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

module.exports = win;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),

/***/ 469:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   v4.2.4+314e4831
 */

(function (global, factory) {
	 true ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function isFunction(x) {
  return typeof x === 'function';
}



var _isArray = void 0;
if (Array.isArray) {
  _isArray = Array.isArray;
} else {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
}

var isArray = _isArray;

var len = 0;
var vertxNext = void 0;
var customSchedulerFn = void 0;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var vertx = Function('return this')().require('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = void 0;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && "function" === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;


  if (_state) {
    var callback = arguments[_state - 1];
    asap(function () {
      return invokeCallback(_state, child, callback, parent._result);
    });
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$1(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(2);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var TRY_CATCH_ERROR = { error: null };

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    TRY_CATCH_ERROR.error = error;
    return TRY_CATCH_ERROR;
  }
}

function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
  try {
    then$$1.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then$$1) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then$$1, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return resolve(promise, value);
    }, function (reason) {
      return reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$1) {
  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$1 === TRY_CATCH_ERROR) {
      reject(promise, TRY_CATCH_ERROR.error);
      TRY_CATCH_ERROR.error = null;
    } else if (then$$1 === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$1)) {
      handleForeignThenable(promise, maybeThenable, then$$1);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;


  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = void 0,
      callback = void 0,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = void 0,
      error = void 0,
      succeeded = void 0,
      failed = void 0;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value.error = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (failed) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    fulfill(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      resolve(promise, value);
    }, function rejectPromise(reason) {
      reject(promise, reason);
    });
  } catch (e) {
    reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

var Enumerator = function () {
  function Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this.length = input.length;
      this._remaining = input.length;

      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate(input);
        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      reject(this.promise, validationError());
    }
  }

  Enumerator.prototype._enumerate = function _enumerate(input) {
    for (var i = 0; this._state === PENDING && i < input.length; i++) {
      this._eachEntry(input[i], i);
    }
  };

  Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
    var c = this._instanceConstructor;
    var resolve$$1 = c.resolve;


    if (resolve$$1 === resolve$1) {
      var _then = getThen(entry);

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise$1) {
        var promise = new c(noop);
        handleMaybeThenable(promise, entry, _then);
        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$1) {
          return resolve$$1(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$1(entry), i);
    }
  };

  Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
    var promise = this.promise;


    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
    var enumerator = this;

    subscribe(promise, undefined, function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }, function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    });
  };

  return Enumerator;
}();

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {Function} resolver
  Useful for tooling.
  @constructor
*/

var Promise$1 = function () {
  function Promise(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
    }
  }

  /**
  The primary way of interacting with a promise is through its `then` method,
  which registers callbacks to receive either a promise's eventual value or the
  reason why the promise cannot be fulfilled.
   ```js
  findUser().then(function(user){
    // user is available
  }, function(reason){
    // user is unavailable, and you are given the reason why
  });
  ```
   Chaining
  --------
   The return value of `then` is itself a promise.  This second, 'downstream'
  promise is resolved with the return value of the first promise's fulfillment
  or rejection handler, or rejected if the handler throws an exception.
   ```js
  findUser().then(function (user) {
    return user.name;
  }, function (reason) {
    return 'default name';
  }).then(function (userName) {
    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
    // will be `'default name'`
  });
   findUser().then(function (user) {
    throw new Error('Found user, but still unhappy');
  }, function (reason) {
    throw new Error('`findUser` rejected and we're unhappy');
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
  });
  ```
  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
   ```js
  findUser().then(function (user) {
    throw new PedagogicalException('Upstream error');
  }).then(function (value) {
    // never reached
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // The `PedgagocialException` is propagated all the way down to here
  });
  ```
   Assimilation
  ------------
   Sometimes the value you want to propagate to a downstream promise can only be
  retrieved asynchronously. This can be achieved by returning a promise in the
  fulfillment or rejection handler. The downstream promise will then be pending
  until the returned promise is settled. This is called *assimilation*.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // The user's comments are now available
  });
  ```
   If the assimliated promise rejects, then the downstream promise will also reject.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // If `findCommentsByAuthor` fulfills, we'll have the value here
  }, function (reason) {
    // If `findCommentsByAuthor` rejects, we'll have the reason here
  });
  ```
   Simple Example
  --------------
   Synchronous Example
   ```javascript
  let result;
   try {
    result = findResult();
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
  findResult(function(result, err){
    if (err) {
      // failure
    } else {
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findResult().then(function(result){
    // success
  }, function(reason){
    // failure
  });
  ```
   Advanced Example
  --------------
   Synchronous Example
   ```javascript
  let author, books;
   try {
    author = findAuthor();
    books  = findBooksByAuthor(author);
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
   function foundBooks(books) {
   }
   function failure(reason) {
   }
   findAuthor(function(author, err){
    if (err) {
      failure(err);
      // failure
    } else {
      try {
        findBoooksByAuthor(author, function(books, err) {
          if (err) {
            failure(err);
          } else {
            try {
              foundBooks(books);
            } catch(reason) {
              failure(reason);
            }
          }
        });
      } catch(error) {
        failure(err);
      }
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findAuthor().
    then(findBooksByAuthor).
    then(function(books){
      // found books
  }).catch(function(reason){
    // something went wrong
  });
  ```
   @method then
  @param {Function} onFulfilled
  @param {Function} onRejected
  Useful for tooling.
  @return {Promise}
  */

  /**
  `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
  as the catch block of a try/catch statement.
  ```js
  function findAuthor(){
  throw new Error('couldn't find that author');
  }
  // synchronous
  try {
  findAuthor();
  } catch(reason) {
  // something went wrong
  }
  // async with promises
  findAuthor().catch(function(reason){
  // something went wrong
  });
  ```
  @method catch
  @param {Function} onRejection
  Useful for tooling.
  @return {Promise}
  */


  Promise.prototype.catch = function _catch(onRejection) {
    return this.then(null, onRejection);
  };

  /**
    `finally` will be invoked regardless of the promise's fate just as native
    try/catch/finally behaves
  
    Synchronous example:
  
    ```js
    findAuthor() {
      if (Math.random() > 0.5) {
        throw new Error();
      }
      return new Author();
    }
  
    try {
      return findAuthor(); // succeed or fail
    } catch(error) {
      return findOtherAuther();
    } finally {
      // always runs
      // doesn't affect the return value
    }
    ```
  
    Asynchronous example:
  
    ```js
    findAuthor().catch(function(reason){
      return findOtherAuther();
    }).finally(function(){
      // author was either found, or not
    });
    ```
  
    @method finally
    @param {Function} callback
    @return {Promise}
  */


  Promise.prototype.finally = function _finally(callback) {
    var promise = this;
    var constructor = promise.constructor;

    return promise.then(function (value) {
      return constructor.resolve(callback()).then(function () {
        return value;
      });
    }, function (reason) {
      return constructor.resolve(callback()).then(function () {
        throw reason;
      });
    });
  };

  return Promise;
}();

Promise$1.prototype.then = then;
Promise$1.all = all;
Promise$1.race = race;
Promise$1.resolve = resolve$1;
Promise$1.reject = reject$1;
Promise$1._setScheduler = setScheduler;
Promise$1._setAsap = setAsap;
Promise$1._asap = asap;

/*global self*/
function polyfill() {
  var local = void 0;

  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      throw new Error('polyfill failed because global object is unavailable in this environment');
    }
  }

  var P = local.Promise;

  if (P) {
    var promiseToString = null;
    try {
      promiseToString = Object.prototype.toString.call(P.resolve());
    } catch (e) {
      // silently ignored
    }

    if (promiseToString === '[object Promise]' && !P.cast) {
      return;
    }
  }

  local.Promise = Promise$1;
}

// Strange compat..
Promise$1.polyfill = polyfill;
Promise$1.Promise = Promise$1;

return Promise$1;

})));



//# sourceMappingURL=es6-promise.map

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(92), __webpack_require__(8)))

/***/ }),

/***/ 470:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = inlineHeaders;

var encode = __webpack_require__(471);

function inlineHeaders(url, headers) {
  if (/\?/.test(url)) {
    url += '&';
  } else {
    url += '?';
  }

  return url + encode(headers);
}


/***/ }),

/***/ 471:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),

/***/ 472:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = jsonpRequest;

var errors = __webpack_require__(49);

var JSONPCounter = 0;

function jsonpRequest(url, opts, cb) {
  if (opts.method !== 'GET') {
    cb(new Error('Method ' + opts.method + ' ' + url + ' is not supported by JSONP.'));
    return;
  }

  opts.debug('JSONP: start');

  var cbCalled = false;
  var timedOut = false;

  JSONPCounter += 1;
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  var cbName = 'algoliaJSONP_' + JSONPCounter;
  var done = false;

  window[cbName] = function(data) {
    removeGlobals();

    if (timedOut) {
      opts.debug('JSONP: Late answer, ignoring');
      return;
    }

    cbCalled = true;

    clean();

    cb(null, {
      body: data/* ,
      // We do not send the statusCode, there's no statusCode in JSONP, it will be
      // computed using data.status && data.message like with XDR
      statusCode*/
    });
  };

  // add callback by hand
  url += '&callback=' + cbName;

  // add body params manually
  if (opts.jsonBody && opts.jsonBody.params) {
    url += '&' + opts.jsonBody.params;
  }

  var ontimeout = setTimeout(timeout, opts.timeouts.complete);

  // script onreadystatechange needed only for
  // <= IE8
  // https://github.com/angular/angular.js/issues/4523
  script.onreadystatechange = readystatechange;
  script.onload = success;
  script.onerror = error;

  script.async = true;
  script.defer = true;
  script.src = url;
  head.appendChild(script);

  function success() {
    opts.debug('JSONP: success');

    if (done || timedOut) {
      return;
    }

    done = true;

    // script loaded but did not call the fn => script loading error
    if (!cbCalled) {
      opts.debug('JSONP: Fail. Script loaded but did not call the callback');
      clean();
      cb(new errors.JSONPScriptFail());
    }
  }

  function readystatechange() {
    if (this.readyState === 'loaded' || this.readyState === 'complete') {
      success();
    }
  }

  function clean() {
    clearTimeout(ontimeout);
    script.onload = null;
    script.onreadystatechange = null;
    script.onerror = null;
    head.removeChild(script);
  }

  function removeGlobals() {
    try {
      delete window[cbName];
      delete window[cbName + '_loaded'];
    } catch (e) {
      window[cbName] = window[cbName + '_loaded'] = undefined;
    }
  }

  function timeout() {
    opts.debug('JSONP: Script timeout');
    timedOut = true;
    clean();
    cb(new errors.RequestTimeout());
  }

  function error() {
    opts.debug('JSONP: Script error');

    if (done || timedOut) {
      return;
    }

    clean();
    cb(new errors.JSONPScriptError());
  }
}


/***/ }),

/***/ 473:
/***/ (function(module, exports, __webpack_require__) {

module.exports = createPlacesClient;

var buildSearchMethod = __webpack_require__(239);

function createPlacesClient(algoliasearch) {
  return function places(appID, apiKey, opts) {
    var cloneDeep = __webpack_require__(38);

    opts = opts && cloneDeep(opts) || {};
    opts.hosts = opts.hosts || [
      'places-dsn.algolia.net',
      'places-1.algolianet.com',
      'places-2.algolianet.com',
      'places-3.algolianet.com'
    ];

    // allow initPlaces() no arguments => community rate limited
    if (arguments.length === 0 || typeof appID === 'object' || appID === undefined) {
      appID = '';
      apiKey = '';
      opts._allowEmptyCredentials = true;
    }

    var client = algoliasearch(appID, apiKey, opts);
    var index = client.initIndex('places');
    index.search = buildSearchMethod('query', '/1/places/query');
    index.getObject = function(objectID, callback) {
      return this.as._jsonRequest({
        method: 'GET',
        url: '/1/places/' + encodeURIComponent(objectID),
        hostType: 'read',
        callback: callback
      });
    };
    return index;
  };
}


/***/ }),

/***/ 474:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = '3.27.1';


/***/ }),

/***/ 475:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates the JSX to render a loading indicator.
 *
 * @param {object} props The React props.
 *
 * @returns {ReactElement} A div with a loading indicator.
 */
var Loading = function Loading(props) {
  return _react2.default.createElement(
    "div",
    { className: "wpseo-kb-loader" },
    props.placeholder
  );
};

Loading.propTypes = {
  placeholder: _propTypes2.default.string.isRequired
};

exports.default = Loading;

/***/ }),

/***/ 476:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__(2);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _debounce = __webpack_require__(158);

var _debounce2 = _interopRequireDefault(_debounce);

var _i18n = __webpack_require__(9);

var _colors = __webpack_require__(4);

var _colors2 = _interopRequireDefault(_colors);

var _YoastButton = __webpack_require__(69);

var _responsiveBreakpoints = __webpack_require__(95);

var _responsiveBreakpoints2 = _interopRequireDefault(_responsiveBreakpoints);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* External dependencies */


/* Internal dependencies */


var SearchBarWrapper = _styledComponents2.default.div.withConfig({
	displayName: "SearchBar__SearchBarWrapper"
})(["form{display:flex;flex-wrap:wrap;}@media screen and ( max-width:", " ){button{min-width:100%;margin-top:1em;}}"], _responsiveBreakpoints2.default.mobile);

var SearchLabel = _styledComponents2.default.label.withConfig({
	displayName: "SearchBar__SearchLabel"
})(["flex:0 1 100%;font-size:1em;margin:0.5em 16px;font-weight:600;"]);

var SearchBarInput = _styledComponents2.default.input.withConfig({
	displayName: "SearchBar__SearchBarInput"
})(["&&{flex:1 1 auto;box-sizing:border-box;height:48px;box-shadow:inset 0 2px 8px 0px rgba( 0,0,0,0.3 );background:", ";border:1px solid transparent;font-size:1em;margin-right:24px;padding:0 8px 0 15px;:focus{box-shadow:inset 0 2px 8px 0px rgba( 0,0,0,0.3 ),0 0 2px rgba( 30,140,190,0.8 );}@media screen and ( max-width:", " ){margin-right:0;}}"], _colors2.default.$color_grey_light, _responsiveBreakpoints2.default.mobile);

/**
 * Create the JSX to render the search bar.
 *
 * @param {object} props The React props.
 *
 * @returns {ReactElement} The SearchBar component.
 */

var SearchBar = function (_React$Component) {
	_inherits(SearchBar, _React$Component);

	/**
  * Constructs the component and sets its initial state.
  *
  * @param {Object} props The props to use for this component.
  */
	function SearchBar(props) {
		_classCallCheck(this, SearchBar);

		var _this = _possibleConstructorReturn(this, (SearchBar.__proto__ || Object.getPrototypeOf(SearchBar)).call(this, props));

		_this.state = {
			doRequest: false,
			searchString: ""
		};

		_this.doFormSubmission = (0, _debounce2.default)(function (searchString) {
			_this.props.submitAction(searchString);
		}, 1000);
		return _this;
	}

	/**
  * Cancel form submission on unmount.
  *
  * @returns {void}
  */


	_createClass(SearchBar, [{
		key: "componentWillUnmount",
		value: function componentWillUnmount() {
			this.doFormSubmission.cancel();
		}

		/**
   * Handles the change event on the SearchBar.
   *
   * @param {object} event React SyntheticEvent.
   *
   * @returns {void}
   */

	}, {
		key: "onSearchChange",
		value: function onSearchChange(event) {
			var _this2 = this;

			/*
    * Manual search: the form already handles the submit event taking the
    * search string from the state so the state needs to be updated.
    */
			if (!this.props.enableLiveSearch) {
				this.setState({ searchString: event.target.value });
				return;
			}

			/*
    * Live search "while typing": update the state searchString and
    * debounce the form submission.
    */
			event.persist();
			this.setState({ searchString: event.target.value }, function () {
				_this2.doFormSubmission(_this2.state.searchString);
			});
		}

		/**
   * Handles the submit event on the SearchBar.
   *
   * @param {object} event React SyntheticEvent.
   *
   * @returns {void}
   */

	}, {
		key: "onSubmit",
		value: function onSubmit(event) {
			event.preventDefault();
			this.doFormSubmission.cancel();
			this.props.submitAction(this.state.searchString);
		}

		/**
   * Renders the SearchBar component.
   *
   * @returns {ReactElement} The SearchBar component.
   */

	}, {
		key: "render",
		value: function render() {
			var headingText = (0, _i18n.__)("Search the Yoast Knowledge Base for answers to your questions:", "yoast-components");
			var placeholderText = (0, _i18n.__)("Type here to search...", "yoast-components");

			return _react2.default.createElement(
				SearchBarWrapper,
				{ role: "search" },
				_react2.default.createElement(
					"form",
					{ onSubmit: this.onSubmit.bind(this) },
					_react2.default.createElement(
						SearchLabel,
						{ htmlFor: "kb-search-input" },
						headingText
					),
					_react2.default.createElement(SearchBarInput, {
						onChange: this.onSearchChange.bind(this),
						type: "text",
						id: "kb-search-input",
						name: "search-input",
						defaultValue: this.props.searchString,
						autoComplete: "off",
						autoCorrect: "off",
						autoCapitalize: "none",
						spellCheck: "false",
						placeholder: placeholderText
					}),
					!this.props.enableLiveSearch && _react2.default.createElement(
						_YoastButton.YoastButton,
						{ type: "submit" },
						(0, _i18n.__)("Search", "yoast-components")
					)
				)
			);
		}
	}]);

	return SearchBar;
}(_react2.default.Component);

SearchBar.propTypes = {
	searchString: _propTypes2.default.string,
	submitAction: _propTypes2.default.func,
	enableLiveSearch: _propTypes2.default.bool
};

SearchBar.defaultProps = {};

exports.default = SearchBar;

/***/ }),

/***/ 477:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__(2);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _reactIntl = __webpack_require__(478);

var _ArticleContent = __webpack_require__(499);

var _ArticleContent2 = _interopRequireDefault(_ArticleContent);

var _YoastButton = __webpack_require__(69);

var _YoastLinkButton = __webpack_require__(500);

var _SvgIcon = __webpack_require__(27);

var _SvgIcon2 = _interopRequireDefault(_SvgIcon);

var _makeOutboundLink = __webpack_require__(116);

var _responsiveBreakpoints = __webpack_require__(95);

var _responsiveBreakpoints2 = _interopRequireDefault(_responsiveBreakpoints);

var _colors = __webpack_require__(4);

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var messages = (0, _reactIntl.defineMessages)({
	searchResult: {
		id: "searchResultDetail.searchResult",
		defaultMessage: "Search result"
	},
	openButton: {
		id: "searchResultDetail.openButton",
		defaultMessage: "View in KB"
	},
	openButtonLabel: {
		id: "searchResultDetail.openButtonLabel",
		defaultMessage: "Open the knowledge base article in a new window or read it in the iframe below"
	},
	backButton: {
		id: "searchResultDetail.backButton",
		defaultMessage: "Go back"
	},
	backButtonLabel: {
		id: "searchResultDetail.backButtonLabel",
		defaultMessage: "Go back to the search results"
	},
	iframeTitle: {
		id: "searchResultDetail.iframeTitle",
		defaultMessage: "Knowledge base article"
	}
});

var Detail = _styledComponents2.default.section.withConfig({
	displayName: "SearchResultDetail__Detail"
})(["outline:none;@media screen and ( max-width:", " ){margin:0 -16px;}"], _responsiveBreakpoints2.default.mobile);

var Nav = _styledComponents2.default.nav.withConfig({
	displayName: "SearchResultDetail__Nav"
})(["padding:0 16px 16px;"]);

var RightYoastLinkButton = (0, _makeOutboundLink.makeOutboundLink)((0, _styledComponents2.default)(_YoastLinkButton.YoastLinkButton).withConfig({
	displayName: "SearchResultDetail__RightYoastLinkButton"
})(["float:right;"]));

/**
 * Create the JSX to render the SearchResultDetail component.
 *
 * @param {object} props The React props.
 *
 * @returns {ReactElement} A SearchResultDetail component.
 */

var SearchResultDetail = function (_React$Component) {
	_inherits(SearchResultDetail, _React$Component);

	function SearchResultDetail() {
		_classCallCheck(this, SearchResultDetail);

		return _possibleConstructorReturn(this, (SearchResultDetail.__proto__ || Object.getPrototypeOf(SearchResultDetail)).apply(this, arguments));
	}

	_createClass(SearchResultDetail, [{
		key: "createNavigation",

		/**
   * Creates navigational elements.
   *
   * @returns {ReactElement} The rendered element.
   */
		value: function createNavigation() {
			var formatMessage = this.props.intl.formatMessage;
			var openButtonText = formatMessage(messages.openButton);
			var openButtonLabel = formatMessage(messages.openButtonLabel);
			var backButtonText = formatMessage(messages.backButton);
			var backButtonLabel = formatMessage(messages.backButtonLabel);
			return _react2.default.createElement(
				Nav,
				null,
				_react2.default.createElement(
					_YoastButton.YoastButton,
					{ "aria-label": backButtonLabel, onClick: this.props.onBackButtonClicked },
					_react2.default.createElement(_SvgIcon2.default, {
						size: "24px",
						color: _colors2.default.$color_white,
						icon: "angle-left"
					}),
					backButtonText
				),
				_react2.default.createElement(
					RightYoastLinkButton,
					{
						href: this.props.post.permalink,
						"aria-label": openButtonLabel,
						target: "_blank",
						rel: "noopener noreferrer"
					},
					openButtonText,
					_react2.default.createElement(_SvgIcon2.default, {
						size: "24px",
						color: _colors2.default.$color_white,
						icon: "angle-right"
					})
				)
			);
		}

		/**
   * Renders the search result detail.
   *
   * @returns {ReactElement} The rendered element.
   */

	}, {
		key: "render",
		value: function render() {
			var _this2 = this;

			var formatMessage = this.props.intl.formatMessage;
			var searchResulLabel = formatMessage(messages.searchResult);
			var iframeTitle = formatMessage(messages.iframeTitle);
			return _react2.default.createElement(
				Detail,
				{
					"aria-label": searchResulLabel,
					tabIndex: "-1",
					innerRef: function innerRef(el) {
						_this2.detailWrapper = el;
					}
				},
				this.createNavigation(),
				_react2.default.createElement(_ArticleContent2.default, { post: this.props.post, title: iframeTitle })
			);
		}

		/**
   * When the component mounts, set focus on the search detail wrapper.
   *
   * @returns {void}
   */

	}, {
		key: "componentDidMount",
		value: function componentDidMount() {
			if (this.detailWrapper !== null) {
				this.detailWrapper.focus();
			}
		}
	}]);

	return SearchResultDetail;
}(_react2.default.Component);

SearchResultDetail.propTypes = {
	post: _propTypes2.default.object.isRequired,
	onBackButtonClicked: _propTypes2.default.func.isRequired,
	intl: _reactIntl.intlShape.isRequired
};

exports.default = (0, _reactIntl.injectIntl)(SearchResultDetail);

/***/ }),

/***/ 478:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addLocaleData", function() { return addLocaleData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "intlShape", function() { return intlShape; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "injectIntl", function() { return injectIntl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defineMessages", function() { return defineMessages; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IntlProvider", function() { return IntlProvider; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormattedDate", function() { return FormattedDate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormattedTime", function() { return FormattedTime; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormattedRelative", function() { return FormattedRelative; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormattedNumber", function() { return FormattedNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormattedPlural", function() { return FormattedPlural; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormattedMessage", function() { return FormattedMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormattedHTMLMessage", function() { return FormattedHTMLMessage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__locale_data_index_js__ = __webpack_require__(479);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__locale_data_index_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__locale_data_index_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_intl_messageformat__ = __webpack_require__(243);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_intl_messageformat___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_intl_messageformat__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_intl_relativeformat__ = __webpack_require__(488);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_intl_relativeformat___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_intl_relativeformat__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_invariant__ = __webpack_require__(495);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_invariant___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_invariant__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_intl_format_cache__ = __webpack_require__(496);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_intl_format_cache___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_intl_format_cache__);
/*
 * Copyright 2017, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */









// GENERATED FILE
var defaultLocaleData = { "locale": "en", "pluralRuleFunction": function pluralRuleFunction(n, ord) {
    var s = String(n).split("."),
        v0 = !s[1],
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2);if (ord) return n10 == 1 && n100 != 11 ? "one" : n10 == 2 && n100 != 12 ? "two" : n10 == 3 && n100 != 13 ? "few" : "other";return n == 1 && v0 ? "one" : "other";
  }, "fields": { "year": { "displayName": "year", "relative": { "0": "this year", "1": "next year", "-1": "last year" }, "relativeTime": { "future": { "one": "in {0} year", "other": "in {0} years" }, "past": { "one": "{0} year ago", "other": "{0} years ago" } } }, "month": { "displayName": "month", "relative": { "0": "this month", "1": "next month", "-1": "last month" }, "relativeTime": { "future": { "one": "in {0} month", "other": "in {0} months" }, "past": { "one": "{0} month ago", "other": "{0} months ago" } } }, "day": { "displayName": "day", "relative": { "0": "today", "1": "tomorrow", "-1": "yesterday" }, "relativeTime": { "future": { "one": "in {0} day", "other": "in {0} days" }, "past": { "one": "{0} day ago", "other": "{0} days ago" } } }, "hour": { "displayName": "hour", "relative": { "0": "this hour" }, "relativeTime": { "future": { "one": "in {0} hour", "other": "in {0} hours" }, "past": { "one": "{0} hour ago", "other": "{0} hours ago" } } }, "minute": { "displayName": "minute", "relative": { "0": "this minute" }, "relativeTime": { "future": { "one": "in {0} minute", "other": "in {0} minutes" }, "past": { "one": "{0} minute ago", "other": "{0} minutes ago" } } }, "second": { "displayName": "second", "relative": { "0": "now" }, "relativeTime": { "future": { "one": "in {0} second", "other": "in {0} seconds" }, "past": { "one": "{0} second ago", "other": "{0} seconds ago" } } } } };

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

function addLocaleData() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var locales = Array.isArray(data) ? data : [data];

  locales.forEach(function (localeData) {
    if (localeData && localeData.locale) {
      __WEBPACK_IMPORTED_MODULE_1_intl_messageformat___default.a.__addLocaleData(localeData);
      __WEBPACK_IMPORTED_MODULE_2_intl_relativeformat___default.a.__addLocaleData(localeData);
    }
  });
}

function hasLocaleData(locale) {
  var localeParts = (locale || '').split('-');

  while (localeParts.length > 0) {
    if (hasIMFAndIRFLocaleData(localeParts.join('-'))) {
      return true;
    }

    localeParts.pop();
  }

  return false;
}

function hasIMFAndIRFLocaleData(locale) {
  var normalizedLocale = locale && locale.toLowerCase();

  return !!(__WEBPACK_IMPORTED_MODULE_1_intl_messageformat___default.a.__localeData__[normalizedLocale] && __WEBPACK_IMPORTED_MODULE_2_intl_relativeformat___default.a.__localeData__[normalizedLocale]);
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
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



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};









var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var bool = __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.bool;
var number = __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.number;
var string = __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.string;
var func = __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.func;
var object = __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.object;
var oneOf = __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.oneOf;
var shape = __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.shape;
var any = __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.any;
var oneOfType = __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.oneOfType;

var localeMatcher = oneOf(['best fit', 'lookup']);
var narrowShortLong = oneOf(['narrow', 'short', 'long']);
var numeric2digit = oneOf(['numeric', '2-digit']);
var funcReq = func.isRequired;

var intlConfigPropTypes = {
  locale: string,
  formats: object,
  messages: object,
  textComponent: any,

  defaultLocale: string,
  defaultFormats: object
};

var intlFormatPropTypes = {
  formatDate: funcReq,
  formatTime: funcReq,
  formatRelative: funcReq,
  formatNumber: funcReq,
  formatPlural: funcReq,
  formatMessage: funcReq,
  formatHTMLMessage: funcReq
};

var intlShape = shape(_extends({}, intlConfigPropTypes, intlFormatPropTypes, {
  formatters: object,
  now: funcReq
}));

var messageDescriptorPropTypes = {
  id: string.isRequired,
  description: oneOfType([string, object]),
  defaultMessage: string
};

var dateTimeFormatPropTypes = {
  localeMatcher: localeMatcher,
  formatMatcher: oneOf(['basic', 'best fit']),

  timeZone: string,
  hour12: bool,

  weekday: narrowShortLong,
  era: narrowShortLong,
  year: numeric2digit,
  month: oneOf(['numeric', '2-digit', 'narrow', 'short', 'long']),
  day: numeric2digit,
  hour: numeric2digit,
  minute: numeric2digit,
  second: numeric2digit,
  timeZoneName: oneOf(['short', 'long'])
};

var numberFormatPropTypes = {
  localeMatcher: localeMatcher,

  style: oneOf(['decimal', 'currency', 'percent']),
  currency: string,
  currencyDisplay: oneOf(['symbol', 'code', 'name']),
  useGrouping: bool,

  minimumIntegerDigits: number,
  minimumFractionDigits: number,
  maximumFractionDigits: number,
  minimumSignificantDigits: number,
  maximumSignificantDigits: number
};

var relativeFormatPropTypes = {
  style: oneOf(['best fit', 'numeric']),
  units: oneOf(['second', 'minute', 'hour', 'day', 'month', 'year'])
};

var pluralFormatPropTypes = {
  style: oneOf(['cardinal', 'ordinal'])
};

/*
HTML escaping and shallow-equals implementations are the same as React's
(on purpose.) Therefore, it has the following Copyright and Licensing:

Copyright 2013-2014, Facebook, Inc.
All rights reserved.

This source code is licensed under the BSD-style license found in the LICENSE
file in the root directory of React's source tree.
*/

var intlConfigPropNames = Object.keys(intlConfigPropTypes);

var ESCAPED_CHARS = {
  '&': '&amp;',
  '>': '&gt;',
  '<': '&lt;',
  '"': '&quot;',
  "'": '&#x27;'
};

var UNSAFE_CHARS_REGEX = /[&><"']/g;

function escape(str) {
  return ('' + str).replace(UNSAFE_CHARS_REGEX, function (match) {
    return ESCAPED_CHARS[match];
  });
}

function filterProps(props, whitelist) {
  var defaults$$1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  return whitelist.reduce(function (filtered, name) {
    if (props.hasOwnProperty(name)) {
      filtered[name] = props[name];
    } else if (defaults$$1.hasOwnProperty(name)) {
      filtered[name] = defaults$$1[name];
    }

    return filtered;
  }, {});
}

function invariantIntlContext() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      intl = _ref.intl;

  __WEBPACK_IMPORTED_MODULE_5_invariant___default()(intl, '[React Intl] Could not find required `intl` object. ' + '<IntlProvider> needs to exist in the component ancestry.');
}

function shallowEquals(objA, objB) {
  if (objA === objB) {
    return true;
  }

  if ((typeof objA === 'undefined' ? 'undefined' : _typeof(objA)) !== 'object' || objA === null || (typeof objB === 'undefined' ? 'undefined' : _typeof(objB)) !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}

function shouldIntlComponentUpdate(_ref2, nextProps, nextState) {
  var props = _ref2.props,
      state = _ref2.state,
      _ref2$context = _ref2.context,
      context = _ref2$context === undefined ? {} : _ref2$context;
  var nextContext = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _context$intl = context.intl,
      intl = _context$intl === undefined ? {} : _context$intl;
  var _nextContext$intl = nextContext.intl,
      nextIntl = _nextContext$intl === undefined ? {} : _nextContext$intl;


  return !shallowEquals(nextProps, props) || !shallowEquals(nextState, state) || !(nextIntl === intl || shallowEquals(filterProps(nextIntl, intlConfigPropNames), filterProps(intl, intlConfigPropNames)));
}

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

// Inspired by react-redux's `connect()` HOC factory function implementation:
// https://github.com/rackt/react-redux

function getDisplayName(Component$$1) {
  return Component$$1.displayName || Component$$1.name || 'Component';
}

function injectIntl(WrappedComponent) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$intlPropName = options.intlPropName,
      intlPropName = _options$intlPropName === undefined ? 'intl' : _options$intlPropName,
      _options$withRef = options.withRef,
      withRef = _options$withRef === undefined ? false : _options$withRef;

  var InjectIntl = function (_Component) {
    inherits(InjectIntl, _Component);

    function InjectIntl(props, context) {
      classCallCheck(this, InjectIntl);

      var _this = possibleConstructorReturn(this, (InjectIntl.__proto__ || Object.getPrototypeOf(InjectIntl)).call(this, props, context));

      invariantIntlContext(context);
      return _this;
    }

    createClass(InjectIntl, [{
      key: 'getWrappedInstance',
      value: function getWrappedInstance() {
        __WEBPACK_IMPORTED_MODULE_5_invariant___default()(withRef, '[React Intl] To access the wrapped instance, ' + 'the `{withRef: true}` option must be set when calling: ' + '`injectIntl()`');

        return this.refs.wrappedInstance;
      }
    }, {
      key: 'render',
      value: function render() {
        return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(WrappedComponent, _extends({}, this.props, defineProperty({}, intlPropName, this.context.intl), {
          ref: withRef ? 'wrappedInstance' : null
        }));
      }
    }]);
    return InjectIntl;
  }(__WEBPACK_IMPORTED_MODULE_4_react__["Component"]);

  InjectIntl.displayName = 'InjectIntl(' + getDisplayName(WrappedComponent) + ')';
  InjectIntl.contextTypes = {
    intl: intlShape
  };
  InjectIntl.WrappedComponent = WrappedComponent;


  return InjectIntl;
}

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

function defineMessages(messageDescriptors) {
  // This simply returns what's passed-in because it's meant to be a hook for
  // babel-plugin-react-intl.
  return messageDescriptors;
}

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

// This is a "hack" until a proper `intl-pluralformat` package is created.

function resolveLocale(locales) {
  // IntlMessageFormat#_resolveLocale() does not depend on `this`.
  return __WEBPACK_IMPORTED_MODULE_1_intl_messageformat___default.a.prototype._resolveLocale(locales);
}

function findPluralFunction(locale) {
  // IntlMessageFormat#_findPluralFunction() does not depend on `this`.
  return __WEBPACK_IMPORTED_MODULE_1_intl_messageformat___default.a.prototype._findPluralRuleFunction(locale);
}

var IntlPluralFormat = function IntlPluralFormat(locales) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  classCallCheck(this, IntlPluralFormat);

  var useOrdinal = options.style === 'ordinal';
  var pluralFn = findPluralFunction(resolveLocale(locales));

  this.format = function (value) {
    return pluralFn(value, useOrdinal);
  };
};

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var DATE_TIME_FORMAT_OPTIONS = Object.keys(dateTimeFormatPropTypes);
var NUMBER_FORMAT_OPTIONS = Object.keys(numberFormatPropTypes);
var RELATIVE_FORMAT_OPTIONS = Object.keys(relativeFormatPropTypes);
var PLURAL_FORMAT_OPTIONS = Object.keys(pluralFormatPropTypes);

var RELATIVE_FORMAT_THRESHOLDS = {
  second: 60, // seconds to minute
  minute: 60, // minutes to hour
  hour: 24, // hours to day
  day: 30, // days to month
  month: 12 // months to year
};

function updateRelativeFormatThresholds(newThresholds) {
  var thresholds = __WEBPACK_IMPORTED_MODULE_2_intl_relativeformat___default.a.thresholds;
  thresholds.second = newThresholds.second;
  thresholds.minute = newThresholds.minute;
  thresholds.hour = newThresholds.hour;
  thresholds.day = newThresholds.day;
  thresholds.month = newThresholds.month;
}

function getNamedFormat(formats, type, name) {
  var format = formats && formats[type] && formats[type][name];
  if (format) {
    return format;
  }

  if (false) {
    console.error('[React Intl] No ' + type + ' format named: ' + name);
  }
}

function formatDate(config, state, value) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var locale = config.locale,
      formats = config.formats;
  var format = options.format;


  var date = new Date(value);
  var defaults$$1 = format && getNamedFormat(formats, 'date', format);
  var filteredOptions = filterProps(options, DATE_TIME_FORMAT_OPTIONS, defaults$$1);

  try {
    return state.getDateTimeFormat(locale, filteredOptions).format(date);
  } catch (e) {
    if (false) {
      console.error('[React Intl] Error formatting date.\n' + e);
    }
  }

  return String(date);
}

function formatTime(config, state, value) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var locale = config.locale,
      formats = config.formats;
  var format = options.format;


  var date = new Date(value);
  var defaults$$1 = format && getNamedFormat(formats, 'time', format);
  var filteredOptions = filterProps(options, DATE_TIME_FORMAT_OPTIONS, defaults$$1);

  if (!filteredOptions.hour && !filteredOptions.minute && !filteredOptions.second) {
    // Add default formatting options if hour, minute, or second isn't defined.
    filteredOptions = _extends({}, filteredOptions, { hour: 'numeric', minute: 'numeric' });
  }

  try {
    return state.getDateTimeFormat(locale, filteredOptions).format(date);
  } catch (e) {
    if (false) {
      console.error('[React Intl] Error formatting time.\n' + e);
    }
  }

  return String(date);
}

function formatRelative(config, state, value) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var locale = config.locale,
      formats = config.formats;
  var format = options.format;


  var date = new Date(value);
  var now = new Date(options.now);
  var defaults$$1 = format && getNamedFormat(formats, 'relative', format);
  var filteredOptions = filterProps(options, RELATIVE_FORMAT_OPTIONS, defaults$$1);

  // Capture the current threshold values, then temporarily override them with
  // specific values just for this render.
  var oldThresholds = _extends({}, __WEBPACK_IMPORTED_MODULE_2_intl_relativeformat___default.a.thresholds);
  updateRelativeFormatThresholds(RELATIVE_FORMAT_THRESHOLDS);

  try {
    return state.getRelativeFormat(locale, filteredOptions).format(date, {
      now: isFinite(now) ? now : state.now()
    });
  } catch (e) {
    if (false) {
      console.error('[React Intl] Error formatting relative time.\n' + e);
    }
  } finally {
    updateRelativeFormatThresholds(oldThresholds);
  }

  return String(date);
}

function formatNumber(config, state, value) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var locale = config.locale,
      formats = config.formats;
  var format = options.format;


  var defaults$$1 = format && getNamedFormat(formats, 'number', format);
  var filteredOptions = filterProps(options, NUMBER_FORMAT_OPTIONS, defaults$$1);

  try {
    return state.getNumberFormat(locale, filteredOptions).format(value);
  } catch (e) {
    if (false) {
      console.error('[React Intl] Error formatting number.\n' + e);
    }
  }

  return String(value);
}

function formatPlural(config, state, value) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var locale = config.locale;


  var filteredOptions = filterProps(options, PLURAL_FORMAT_OPTIONS);

  try {
    return state.getPluralFormat(locale, filteredOptions).format(value);
  } catch (e) {
    if (false) {
      console.error('[React Intl] Error formatting plural.\n' + e);
    }
  }

  return 'other';
}

function formatMessage(config, state) {
  var messageDescriptor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var values = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var locale = config.locale,
      formats = config.formats,
      messages = config.messages,
      defaultLocale = config.defaultLocale,
      defaultFormats = config.defaultFormats;
  var id = messageDescriptor.id,
      defaultMessage = messageDescriptor.defaultMessage;

  // `id` is a required field of a Message Descriptor.

  __WEBPACK_IMPORTED_MODULE_5_invariant___default()(id, '[React Intl] An `id` must be provided to format a message.');

  var message = messages && messages[id];
  var hasValues = Object.keys(values).length > 0;

  // Avoid expensive message formatting for simple messages without values. In
  // development messages will always be formatted in case of missing values.
  if (!hasValues && "production" === 'production') {
    return message || defaultMessage || id;
  }

  var formattedMessage = void 0;

  if (message) {
    try {
      var formatter = state.getMessageFormat(message, locale, formats);

      formattedMessage = formatter.format(values);
    } catch (e) {
      if (false) {
        console.error('[React Intl] Error formatting message: "' + id + '" for locale: "' + locale + '"' + (defaultMessage ? ', using default message as fallback.' : '') + ('\n' + e));
      }
    }
  } else {
    if (false) {
      // This prevents warnings from littering the console in development
      // when no `messages` are passed into the <IntlProvider> for the
      // default locale, and a default message is in the source.
      if (!defaultMessage || locale && locale.toLowerCase() !== defaultLocale.toLowerCase()) {
        console.error('[React Intl] Missing message: "' + id + '" for locale: "' + locale + '"' + (defaultMessage ? ', using default message as fallback.' : ''));
      }
    }
  }

  if (!formattedMessage && defaultMessage) {
    try {
      var _formatter = state.getMessageFormat(defaultMessage, defaultLocale, defaultFormats);

      formattedMessage = _formatter.format(values);
    } catch (e) {
      if (false) {
        console.error('[React Intl] Error formatting the default message for: "' + id + '"' + ('\n' + e));
      }
    }
  }

  if (!formattedMessage) {
    if (false) {
      console.error('[React Intl] Cannot format message: "' + id + '", ' + ('using message ' + (message || defaultMessage ? 'source' : 'id') + ' as fallback.'));
    }
  }

  return formattedMessage || message || defaultMessage || id;
}

function formatHTMLMessage(config, state, messageDescriptor) {
  var rawValues = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  // Process all the values before they are used when formatting the ICU
  // Message string. Since the formatted message might be injected via
  // `innerHTML`, all String-based values need to be HTML-escaped.
  var escapedValues = Object.keys(rawValues).reduce(function (escaped, name) {
    var value = rawValues[name];
    escaped[name] = typeof value === 'string' ? escape(value) : value;
    return escaped;
  }, {});

  return formatMessage(config, state, messageDescriptor, escapedValues);
}



var format = Object.freeze({
	formatDate: formatDate,
	formatTime: formatTime,
	formatRelative: formatRelative,
	formatNumber: formatNumber,
	formatPlural: formatPlural,
	formatMessage: formatMessage,
	formatHTMLMessage: formatHTMLMessage
});

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var intlConfigPropNames$1 = Object.keys(intlConfigPropTypes);
var intlFormatPropNames = Object.keys(intlFormatPropTypes);

// These are not a static property on the `IntlProvider` class so the intl
// config values can be inherited from an <IntlProvider> ancestor.
var defaultProps = {
  formats: {},
  messages: {},
  textComponent: 'span',

  defaultLocale: 'en',
  defaultFormats: {}
};

var IntlProvider = function (_Component) {
  inherits(IntlProvider, _Component);

  function IntlProvider(props) {
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, IntlProvider);

    var _this = possibleConstructorReturn(this, (IntlProvider.__proto__ || Object.getPrototypeOf(IntlProvider)).call(this, props, context));

    __WEBPACK_IMPORTED_MODULE_5_invariant___default()(typeof Intl !== 'undefined', '[React Intl] The `Intl` APIs must be available in the runtime, ' + 'and do not appear to be built-in. An `Intl` polyfill should be loaded.\n' + 'See: http://formatjs.io/guides/runtime-environments/');

    var intlContext = context.intl;

    // Used to stabilize time when performing an initial rendering so that
    // all relative times use the same reference "now" time.

    var initialNow = void 0;
    if (isFinite(props.initialNow)) {
      initialNow = Number(props.initialNow);
    } else {
      // When an `initialNow` isn't provided via `props`, look to see an
      // <IntlProvider> exists in the ancestry and call its `now()`
      // function to propagate its value for "now".
      initialNow = intlContext ? intlContext.now() : Date.now();
    }

    // Creating `Intl*` formatters is expensive. If there's a parent
    // `<IntlProvider>`, then its formatters will be used. Otherwise, this
    // memoize the `Intl*` constructors and cache them for the lifecycle of
    // this IntlProvider instance.

    var _ref = intlContext || {},
        _ref$formatters = _ref.formatters,
        formatters = _ref$formatters === undefined ? {
      getDateTimeFormat: __WEBPACK_IMPORTED_MODULE_6_intl_format_cache___default()(Intl.DateTimeFormat),
      getNumberFormat: __WEBPACK_IMPORTED_MODULE_6_intl_format_cache___default()(Intl.NumberFormat),
      getMessageFormat: __WEBPACK_IMPORTED_MODULE_6_intl_format_cache___default()(__WEBPACK_IMPORTED_MODULE_1_intl_messageformat___default.a),
      getRelativeFormat: __WEBPACK_IMPORTED_MODULE_6_intl_format_cache___default()(__WEBPACK_IMPORTED_MODULE_2_intl_relativeformat___default.a),
      getPluralFormat: __WEBPACK_IMPORTED_MODULE_6_intl_format_cache___default()(IntlPluralFormat)
    } : _ref$formatters;

    _this.state = _extends({}, formatters, {

      // Wrapper to provide stable "now" time for initial render.
      now: function now() {
        return _this._didDisplay ? Date.now() : initialNow;
      }
    });
    return _this;
  }

  createClass(IntlProvider, [{
    key: 'getConfig',
    value: function getConfig() {
      var intlContext = this.context.intl;

      // Build a whitelisted config object from `props`, defaults, and
      // `context.intl`, if an <IntlProvider> exists in the ancestry.

      var config = filterProps(this.props, intlConfigPropNames$1, intlContext);

      // Apply default props. This must be applied last after the props have
      // been resolved and inherited from any <IntlProvider> in the ancestry.
      // This matches how React resolves `defaultProps`.
      for (var propName in defaultProps) {
        if (config[propName] === undefined) {
          config[propName] = defaultProps[propName];
        }
      }

      if (!hasLocaleData(config.locale)) {
        var _config = config,
            locale = _config.locale,
            defaultLocale = _config.defaultLocale,
            defaultFormats = _config.defaultFormats;


        if (false) {
          console.error('[React Intl] Missing locale data for locale: "' + locale + '". ' + ('Using default locale: "' + defaultLocale + '" as fallback.'));
        }

        // Since there's no registered locale data for `locale`, this will
        // fallback to the `defaultLocale` to make sure things can render.
        // The `messages` are overridden to the `defaultProps` empty object
        // to maintain referential equality across re-renders. It's assumed
        // each <FormattedMessage> contains a `defaultMessage` prop.
        config = _extends({}, config, {
          locale: defaultLocale,
          formats: defaultFormats,
          messages: defaultProps.messages
        });
      }

      return config;
    }
  }, {
    key: 'getBoundFormatFns',
    value: function getBoundFormatFns(config, state) {
      return intlFormatPropNames.reduce(function (boundFormatFns, name) {
        boundFormatFns[name] = format[name].bind(null, config, state);
        return boundFormatFns;
      }, {});
    }
  }, {
    key: 'getChildContext',
    value: function getChildContext() {
      var config = this.getConfig();

      // Bind intl factories and current config to the format functions.
      var boundFormatFns = this.getBoundFormatFns(config, this.state);

      var _state = this.state,
          now = _state.now,
          formatters = objectWithoutProperties(_state, ['now']);


      return {
        intl: _extends({}, config, boundFormatFns, {
          formatters: formatters,
          now: now
        })
      };
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      for (var _len = arguments.length, next = Array(_len), _key = 0; _key < _len; _key++) {
        next[_key] = arguments[_key];
      }

      return shouldIntlComponentUpdate.apply(undefined, [this].concat(next));
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._didDisplay = true;
    }
  }, {
    key: 'render',
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_4_react__["Children"].only(this.props.children);
    }
  }]);
  return IntlProvider;
}(__WEBPACK_IMPORTED_MODULE_4_react__["Component"]);

IntlProvider.displayName = 'IntlProvider';
IntlProvider.contextTypes = {
  intl: intlShape
};
IntlProvider.childContextTypes = {
  intl: intlShape.isRequired
};
 false ? IntlProvider.propTypes = _extends({}, intlConfigPropTypes, {
  children: PropTypes.element.isRequired,
  initialNow: PropTypes.any
}) : void 0;

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var FormattedDate = function (_Component) {
  inherits(FormattedDate, _Component);

  function FormattedDate(props, context) {
    classCallCheck(this, FormattedDate);

    var _this = possibleConstructorReturn(this, (FormattedDate.__proto__ || Object.getPrototypeOf(FormattedDate)).call(this, props, context));

    invariantIntlContext(context);
    return _this;
  }

  createClass(FormattedDate, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      for (var _len = arguments.length, next = Array(_len), _key = 0; _key < _len; _key++) {
        next[_key] = arguments[_key];
      }

      return shouldIntlComponentUpdate.apply(undefined, [this].concat(next));
    }
  }, {
    key: 'render',
    value: function render() {
      var _context$intl = this.context.intl,
          formatDate = _context$intl.formatDate,
          Text = _context$intl.textComponent;
      var _props = this.props,
          value = _props.value,
          children = _props.children;


      var formattedDate = formatDate(value, this.props);

      if (typeof children === 'function') {
        return children(formattedDate);
      }

      return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
        Text,
        null,
        formattedDate
      );
    }
  }]);
  return FormattedDate;
}(__WEBPACK_IMPORTED_MODULE_4_react__["Component"]);

FormattedDate.displayName = 'FormattedDate';
FormattedDate.contextTypes = {
  intl: intlShape
};
 false ? FormattedDate.propTypes = _extends({}, dateTimeFormatPropTypes, {
  value: PropTypes.any.isRequired,
  format: PropTypes.string,
  children: PropTypes.func
}) : void 0;

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var FormattedTime = function (_Component) {
  inherits(FormattedTime, _Component);

  function FormattedTime(props, context) {
    classCallCheck(this, FormattedTime);

    var _this = possibleConstructorReturn(this, (FormattedTime.__proto__ || Object.getPrototypeOf(FormattedTime)).call(this, props, context));

    invariantIntlContext(context);
    return _this;
  }

  createClass(FormattedTime, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      for (var _len = arguments.length, next = Array(_len), _key = 0; _key < _len; _key++) {
        next[_key] = arguments[_key];
      }

      return shouldIntlComponentUpdate.apply(undefined, [this].concat(next));
    }
  }, {
    key: 'render',
    value: function render() {
      var _context$intl = this.context.intl,
          formatTime = _context$intl.formatTime,
          Text = _context$intl.textComponent;
      var _props = this.props,
          value = _props.value,
          children = _props.children;


      var formattedTime = formatTime(value, this.props);

      if (typeof children === 'function') {
        return children(formattedTime);
      }

      return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
        Text,
        null,
        formattedTime
      );
    }
  }]);
  return FormattedTime;
}(__WEBPACK_IMPORTED_MODULE_4_react__["Component"]);

FormattedTime.displayName = 'FormattedTime';
FormattedTime.contextTypes = {
  intl: intlShape
};
 false ? FormattedTime.propTypes = _extends({}, dateTimeFormatPropTypes, {
  value: PropTypes.any.isRequired,
  format: PropTypes.string,
  children: PropTypes.func
}) : void 0;

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var SECOND = 1000;
var MINUTE = 1000 * 60;
var HOUR = 1000 * 60 * 60;
var DAY = 1000 * 60 * 60 * 24;

// The maximum timer delay value is a 32-bit signed integer.
// See: https://mdn.io/setTimeout
var MAX_TIMER_DELAY = 2147483647;

function selectUnits(delta) {
  var absDelta = Math.abs(delta);

  if (absDelta < MINUTE) {
    return 'second';
  }

  if (absDelta < HOUR) {
    return 'minute';
  }

  if (absDelta < DAY) {
    return 'hour';
  }

  // The maximum scheduled delay will be measured in days since the maximum
  // timer delay is less than the number of milliseconds in 25 days.
  return 'day';
}

function getUnitDelay(units) {
  switch (units) {
    case 'second':
      return SECOND;
    case 'minute':
      return MINUTE;
    case 'hour':
      return HOUR;
    case 'day':
      return DAY;
    default:
      return MAX_TIMER_DELAY;
  }
}

function isSameDate(a, b) {
  if (a === b) {
    return true;
  }

  var aTime = new Date(a).getTime();
  var bTime = new Date(b).getTime();

  return isFinite(aTime) && isFinite(bTime) && aTime === bTime;
}

var FormattedRelative = function (_Component) {
  inherits(FormattedRelative, _Component);

  function FormattedRelative(props, context) {
    classCallCheck(this, FormattedRelative);

    var _this = possibleConstructorReturn(this, (FormattedRelative.__proto__ || Object.getPrototypeOf(FormattedRelative)).call(this, props, context));

    invariantIntlContext(context);

    var now = isFinite(props.initialNow) ? Number(props.initialNow) : context.intl.now();

    // `now` is stored as state so that `render()` remains a function of
    // props + state, instead of accessing `Date.now()` inside `render()`.
    _this.state = { now: now };
    return _this;
  }

  createClass(FormattedRelative, [{
    key: 'scheduleNextUpdate',
    value: function scheduleNextUpdate(props, state) {
      var _this2 = this;

      // Cancel and pending update because we're scheduling a new update.
      clearTimeout(this._timer);

      var value = props.value,
          units = props.units,
          updateInterval = props.updateInterval;

      var time = new Date(value).getTime();

      // If the `updateInterval` is falsy, including `0` or we don't have a
      // valid date, then auto updates have been turned off, so we bail and
      // skip scheduling an update.
      if (!updateInterval || !isFinite(time)) {
        return;
      }

      var delta = time - state.now;
      var unitDelay = getUnitDelay(units || selectUnits(delta));
      var unitRemainder = Math.abs(delta % unitDelay);

      // We want the largest possible timer delay which will still display
      // accurate information while reducing unnecessary re-renders. The delay
      // should be until the next "interesting" moment, like a tick from
      // "1 minute ago" to "2 minutes ago" when the delta is 120,000ms.
      var delay = delta < 0 ? Math.max(updateInterval, unitDelay - unitRemainder) : Math.max(updateInterval, unitRemainder);

      this._timer = setTimeout(function () {
        _this2.setState({ now: _this2.context.intl.now() });
      }, delay);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.scheduleNextUpdate(this.props, this.state);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(_ref) {
      var nextValue = _ref.value;

      // When the `props.value` date changes, `state.now` needs to be updated,
      // and the next update can be rescheduled.
      if (!isSameDate(nextValue, this.props.value)) {
        this.setState({ now: this.context.intl.now() });
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      for (var _len = arguments.length, next = Array(_len), _key = 0; _key < _len; _key++) {
        next[_key] = arguments[_key];
      }

      return shouldIntlComponentUpdate.apply(undefined, [this].concat(next));
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      this.scheduleNextUpdate(nextProps, nextState);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearTimeout(this._timer);
    }
  }, {
    key: 'render',
    value: function render() {
      var _context$intl = this.context.intl,
          formatRelative = _context$intl.formatRelative,
          Text = _context$intl.textComponent;
      var _props = this.props,
          value = _props.value,
          children = _props.children;


      var formattedRelative = formatRelative(value, _extends({}, this.props, this.state));

      if (typeof children === 'function') {
        return children(formattedRelative);
      }

      return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
        Text,
        null,
        formattedRelative
      );
    }
  }]);
  return FormattedRelative;
}(__WEBPACK_IMPORTED_MODULE_4_react__["Component"]);

FormattedRelative.displayName = 'FormattedRelative';
FormattedRelative.contextTypes = {
  intl: intlShape
};
FormattedRelative.defaultProps = {
  updateInterval: 1000 * 10
};
 false ? FormattedRelative.propTypes = _extends({}, relativeFormatPropTypes, {
  value: PropTypes.any.isRequired,
  format: PropTypes.string,
  updateInterval: PropTypes.number,
  initialNow: PropTypes.any,
  children: PropTypes.func
}) : void 0;

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var FormattedNumber = function (_Component) {
  inherits(FormattedNumber, _Component);

  function FormattedNumber(props, context) {
    classCallCheck(this, FormattedNumber);

    var _this = possibleConstructorReturn(this, (FormattedNumber.__proto__ || Object.getPrototypeOf(FormattedNumber)).call(this, props, context));

    invariantIntlContext(context);
    return _this;
  }

  createClass(FormattedNumber, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      for (var _len = arguments.length, next = Array(_len), _key = 0; _key < _len; _key++) {
        next[_key] = arguments[_key];
      }

      return shouldIntlComponentUpdate.apply(undefined, [this].concat(next));
    }
  }, {
    key: 'render',
    value: function render() {
      var _context$intl = this.context.intl,
          formatNumber = _context$intl.formatNumber,
          Text = _context$intl.textComponent;
      var _props = this.props,
          value = _props.value,
          children = _props.children;


      var formattedNumber = formatNumber(value, this.props);

      if (typeof children === 'function') {
        return children(formattedNumber);
      }

      return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
        Text,
        null,
        formattedNumber
      );
    }
  }]);
  return FormattedNumber;
}(__WEBPACK_IMPORTED_MODULE_4_react__["Component"]);

FormattedNumber.displayName = 'FormattedNumber';
FormattedNumber.contextTypes = {
  intl: intlShape
};
 false ? FormattedNumber.propTypes = _extends({}, numberFormatPropTypes, {
  value: PropTypes.any.isRequired,
  format: PropTypes.string,
  children: PropTypes.func
}) : void 0;

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var FormattedPlural = function (_Component) {
  inherits(FormattedPlural, _Component);

  function FormattedPlural(props, context) {
    classCallCheck(this, FormattedPlural);

    var _this = possibleConstructorReturn(this, (FormattedPlural.__proto__ || Object.getPrototypeOf(FormattedPlural)).call(this, props, context));

    invariantIntlContext(context);
    return _this;
  }

  createClass(FormattedPlural, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      for (var _len = arguments.length, next = Array(_len), _key = 0; _key < _len; _key++) {
        next[_key] = arguments[_key];
      }

      return shouldIntlComponentUpdate.apply(undefined, [this].concat(next));
    }
  }, {
    key: 'render',
    value: function render() {
      var _context$intl = this.context.intl,
          formatPlural = _context$intl.formatPlural,
          Text = _context$intl.textComponent;
      var _props = this.props,
          value = _props.value,
          other = _props.other,
          children = _props.children;


      var pluralCategory = formatPlural(value, this.props);
      var formattedPlural = this.props[pluralCategory] || other;

      if (typeof children === 'function') {
        return children(formattedPlural);
      }

      return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
        Text,
        null,
        formattedPlural
      );
    }
  }]);
  return FormattedPlural;
}(__WEBPACK_IMPORTED_MODULE_4_react__["Component"]);

FormattedPlural.displayName = 'FormattedPlural';
FormattedPlural.contextTypes = {
  intl: intlShape
};
FormattedPlural.defaultProps = {
  style: 'cardinal'
};
 false ? FormattedPlural.propTypes = _extends({}, pluralFormatPropTypes, {
  value: PropTypes.any.isRequired,

  other: PropTypes.node.isRequired,
  zero: PropTypes.node,
  one: PropTypes.node,
  two: PropTypes.node,
  few: PropTypes.node,
  many: PropTypes.node,

  children: PropTypes.func
}) : void 0;

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var FormattedMessage = function (_Component) {
  inherits(FormattedMessage, _Component);

  function FormattedMessage(props, context) {
    classCallCheck(this, FormattedMessage);

    var _this = possibleConstructorReturn(this, (FormattedMessage.__proto__ || Object.getPrototypeOf(FormattedMessage)).call(this, props, context));

    invariantIntlContext(context);
    return _this;
  }

  createClass(FormattedMessage, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var values = this.props.values;
      var nextValues = nextProps.values;


      if (!shallowEquals(nextValues, values)) {
        return true;
      }

      // Since `values` has already been checked, we know they're not
      // different, so the current `values` are carried over so the shallow
      // equals comparison on the other props isn't affected by the `values`.
      var nextPropsToCheck = _extends({}, nextProps, {
        values: values
      });

      for (var _len = arguments.length, next = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        next[_key - 1] = arguments[_key];
      }

      return shouldIntlComponentUpdate.apply(undefined, [this, nextPropsToCheck].concat(next));
    }
  }, {
    key: 'render',
    value: function render() {
      var _context$intl = this.context.intl,
          formatMessage = _context$intl.formatMessage,
          Text = _context$intl.textComponent;
      var _props = this.props,
          id = _props.id,
          description = _props.description,
          defaultMessage = _props.defaultMessage,
          values = _props.values,
          _props$tagName = _props.tagName,
          Component$$1 = _props$tagName === undefined ? Text : _props$tagName,
          children = _props.children;


      var tokenDelimiter = void 0;
      var tokenizedValues = void 0;
      var elements = void 0;

      var hasValues = values && Object.keys(values).length > 0;
      if (hasValues) {
        // Creates a token with a random UID that should not be guessable or
        // conflict with other parts of the `message` string.
        var uid = Math.floor(Math.random() * 0x10000000000).toString(16);

        var generateToken = function () {
          var counter = 0;
          return function () {
            return 'ELEMENT-' + uid + '-' + (counter += 1);
          };
        }();

        // Splitting with a delimiter to support IE8. When using a regex
        // with a capture group IE8 does not include the capture group in
        // the resulting array.
        tokenDelimiter = '@__' + uid + '__@';
        tokenizedValues = {};
        elements = {};

        // Iterates over the `props` to keep track of any React Element
        // values so they can be represented by the `token` as a placeholder
        // when the `message` is formatted. This allows the formatted
        // message to then be broken-up into parts with references to the
        // React Elements inserted back in.
        Object.keys(values).forEach(function (name) {
          var value = values[name];

          if (Object(__WEBPACK_IMPORTED_MODULE_4_react__["isValidElement"])(value)) {
            var token = generateToken();
            tokenizedValues[name] = tokenDelimiter + token + tokenDelimiter;
            elements[token] = value;
          } else {
            tokenizedValues[name] = value;
          }
        });
      }

      var descriptor = { id: id, description: description, defaultMessage: defaultMessage };
      var formattedMessage = formatMessage(descriptor, tokenizedValues || values);

      var nodes = void 0;

      var hasElements = elements && Object.keys(elements).length > 0;
      if (hasElements) {
        // Split the message into parts so the React Element values captured
        // above can be inserted back into the rendered message. This
        // approach allows messages to render with React Elements while
        // keeping React's virtual diffing working properly.
        nodes = formattedMessage.split(tokenDelimiter).filter(function (part) {
          return !!part;
        }).map(function (part) {
          return elements[part] || part;
        });
      } else {
        nodes = [formattedMessage];
      }

      if (typeof children === 'function') {
        return children.apply(undefined, toConsumableArray(nodes));
      }

      // Needs to use `createElement()` instead of JSX, otherwise React will
      // warn about a missing `key` prop with rich-text message formatting.
      return __WEBPACK_IMPORTED_MODULE_4_react__["createElement"].apply(undefined, [Component$$1, null].concat(toConsumableArray(nodes)));
    }
  }]);
  return FormattedMessage;
}(__WEBPACK_IMPORTED_MODULE_4_react__["Component"]);

FormattedMessage.displayName = 'FormattedMessage';
FormattedMessage.contextTypes = {
  intl: intlShape
};
FormattedMessage.defaultProps = {
  values: {}
};
 false ? FormattedMessage.propTypes = _extends({}, messageDescriptorPropTypes, {
  values: PropTypes.object,
  tagName: PropTypes.string,
  children: PropTypes.func
}) : void 0;

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var FormattedHTMLMessage = function (_Component) {
  inherits(FormattedHTMLMessage, _Component);

  function FormattedHTMLMessage(props, context) {
    classCallCheck(this, FormattedHTMLMessage);

    var _this = possibleConstructorReturn(this, (FormattedHTMLMessage.__proto__ || Object.getPrototypeOf(FormattedHTMLMessage)).call(this, props, context));

    invariantIntlContext(context);
    return _this;
  }

  createClass(FormattedHTMLMessage, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var values = this.props.values;
      var nextValues = nextProps.values;


      if (!shallowEquals(nextValues, values)) {
        return true;
      }

      // Since `values` has already been checked, we know they're not
      // different, so the current `values` are carried over so the shallow
      // equals comparison on the other props isn't affected by the `values`.
      var nextPropsToCheck = _extends({}, nextProps, {
        values: values
      });

      for (var _len = arguments.length, next = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        next[_key - 1] = arguments[_key];
      }

      return shouldIntlComponentUpdate.apply(undefined, [this, nextPropsToCheck].concat(next));
    }
  }, {
    key: 'render',
    value: function render() {
      var _context$intl = this.context.intl,
          formatHTMLMessage = _context$intl.formatHTMLMessage,
          Text = _context$intl.textComponent;
      var _props = this.props,
          id = _props.id,
          description = _props.description,
          defaultMessage = _props.defaultMessage,
          rawValues = _props.values,
          _props$tagName = _props.tagName,
          Component$$1 = _props$tagName === undefined ? Text : _props$tagName,
          children = _props.children;


      var descriptor = { id: id, description: description, defaultMessage: defaultMessage };
      var formattedHTMLMessage = formatHTMLMessage(descriptor, rawValues);

      if (typeof children === 'function') {
        return children(formattedHTMLMessage);
      }

      // Since the message presumably has HTML in it, we need to set
      // `innerHTML` in order for it to be rendered and not escaped by React.
      // To be safe, all string prop values were escaped when formatting the
      // message. It is assumed that the message is not UGC, and came from the
      // developer making it more like a template.
      //
      // Note: There's a perf impact of using this component since there's no
      // way for React to do its virtual DOM diffing.
      var html = { __html: formattedHTMLMessage };
      return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(Component$$1, { dangerouslySetInnerHTML: html });
    }
  }]);
  return FormattedHTMLMessage;
}(__WEBPACK_IMPORTED_MODULE_4_react__["Component"]);

FormattedHTMLMessage.displayName = 'FormattedHTMLMessage';
FormattedHTMLMessage.contextTypes = {
  intl: intlShape
};
FormattedHTMLMessage.defaultProps = {
  values: {}
};
 false ? FormattedHTMLMessage.propTypes = _extends({}, messageDescriptorPropTypes, {
  values: PropTypes.object,
  tagName: PropTypes.string,
  children: PropTypes.func
}) : void 0;

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

addLocaleData(defaultLocaleData);

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

addLocaleData(__WEBPACK_IMPORTED_MODULE_0__locale_data_index_js___default.a);




/***/ }),

/***/ 479:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 480:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* jslint esnext: true */


var src$core$$ = __webpack_require__(481), src$en$$ = __webpack_require__(486);

src$core$$["default"].__addLocaleData(src$en$$["default"]);
src$core$$["default"].defaultLocale = 'en';

exports["default"] = src$core$$["default"];

//# sourceMappingURL=main.js.map

/***/ }),

/***/ 481:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */


var src$utils$$ = __webpack_require__(244), src$es5$$ = __webpack_require__(482), src$compiler$$ = __webpack_require__(483), intl$messageformat$parser$$ = __webpack_require__(484);
exports["default"] = MessageFormat;

// -- MessageFormat --------------------------------------------------------

function MessageFormat(message, locales, formats) {
    // Parse string messages into an AST.
    var ast = typeof message === 'string' ?
            MessageFormat.__parse(message) : message;

    if (!(ast && ast.type === 'messageFormatPattern')) {
        throw new TypeError('A message must be provided as a String or AST.');
    }

    // Creates a new object with the specified `formats` merged with the default
    // formats.
    formats = this._mergeFormats(MessageFormat.formats, formats);

    // Defined first because it's used to build the format pattern.
    src$es5$$.defineProperty(this, '_locale',  {value: this._resolveLocale(locales)});

    // Compile the `ast` to a pattern that is highly optimized for repeated
    // `format()` invocations. **Note:** This passes the `locales` set provided
    // to the constructor instead of just the resolved locale.
    var pluralFn = this._findPluralRuleFunction(this._locale);
    var pattern  = this._compilePattern(ast, locales, formats, pluralFn);

    // "Bind" `format()` method to `this` so it can be passed by reference like
    // the other `Intl` APIs.
    var messageFormat = this;
    this.format = function (values) {
      try {
        return messageFormat._format(pattern, values);
      } catch (e) {
        if (e.variableId) {
          throw new Error(
            'The intl string context variable \'' + e.variableId + '\'' +
            ' was not provided to the string \'' + message + '\''
          );
        } else {
          throw e;
        }
      }
    };
}

// Default format options used as the prototype of the `formats` provided to the
// constructor. These are used when constructing the internal Intl.NumberFormat
// and Intl.DateTimeFormat instances.
src$es5$$.defineProperty(MessageFormat, 'formats', {
    enumerable: true,

    value: {
        number: {
            'currency': {
                style: 'currency'
            },

            'percent': {
                style: 'percent'
            }
        },

        date: {
            'short': {
                month: 'numeric',
                day  : 'numeric',
                year : '2-digit'
            },

            'medium': {
                month: 'short',
                day  : 'numeric',
                year : 'numeric'
            },

            'long': {
                month: 'long',
                day  : 'numeric',
                year : 'numeric'
            },

            'full': {
                weekday: 'long',
                month  : 'long',
                day    : 'numeric',
                year   : 'numeric'
            }
        },

        time: {
            'short': {
                hour  : 'numeric',
                minute: 'numeric'
            },

            'medium':  {
                hour  : 'numeric',
                minute: 'numeric',
                second: 'numeric'
            },

            'long': {
                hour        : 'numeric',
                minute      : 'numeric',
                second      : 'numeric',
                timeZoneName: 'short'
            },

            'full': {
                hour        : 'numeric',
                minute      : 'numeric',
                second      : 'numeric',
                timeZoneName: 'short'
            }
        }
    }
});

// Define internal private properties for dealing with locale data.
src$es5$$.defineProperty(MessageFormat, '__localeData__', {value: src$es5$$.objCreate(null)});
src$es5$$.defineProperty(MessageFormat, '__addLocaleData', {value: function (data) {
    if (!(data && data.locale)) {
        throw new Error(
            'Locale data provided to IntlMessageFormat is missing a ' +
            '`locale` property'
        );
    }

    MessageFormat.__localeData__[data.locale.toLowerCase()] = data;
}});

// Defines `__parse()` static method as an exposed private.
src$es5$$.defineProperty(MessageFormat, '__parse', {value: intl$messageformat$parser$$["default"].parse});

// Define public `defaultLocale` property which defaults to English, but can be
// set by the developer.
src$es5$$.defineProperty(MessageFormat, 'defaultLocale', {
    enumerable: true,
    writable  : true,
    value     : undefined
});

MessageFormat.prototype.resolvedOptions = function () {
    // TODO: Provide anything else?
    return {
        locale: this._locale
    };
};

MessageFormat.prototype._compilePattern = function (ast, locales, formats, pluralFn) {
    var compiler = new src$compiler$$["default"](locales, formats, pluralFn);
    return compiler.compile(ast);
};

MessageFormat.prototype._findPluralRuleFunction = function (locale) {
    var localeData = MessageFormat.__localeData__;
    var data       = localeData[locale.toLowerCase()];

    // The locale data is de-duplicated, so we have to traverse the locale's
    // hierarchy until we find a `pluralRuleFunction` to return.
    while (data) {
        if (data.pluralRuleFunction) {
            return data.pluralRuleFunction;
        }

        data = data.parentLocale && localeData[data.parentLocale.toLowerCase()];
    }

    throw new Error(
        'Locale data added to IntlMessageFormat is missing a ' +
        '`pluralRuleFunction` for :' + locale
    );
};

MessageFormat.prototype._format = function (pattern, values) {
    var result = '',
        i, len, part, id, value, err;

    for (i = 0, len = pattern.length; i < len; i += 1) {
        part = pattern[i];

        // Exist early for string parts.
        if (typeof part === 'string') {
            result += part;
            continue;
        }

        id = part.id;

        // Enforce that all required values are provided by the caller.
        if (!(values && src$utils$$.hop.call(values, id))) {
          err = new Error('A value must be provided for: ' + id);
          err.variableId = id;
          throw err;
        }

        value = values[id];

        // Recursively format plural and select parts' option — which can be a
        // nested pattern structure. The choosing of the option to use is
        // abstracted-by and delegated-to the part helper object.
        if (part.options) {
            result += this._format(part.getOption(value), values);
        } else {
            result += part.format(value);
        }
    }

    return result;
};

MessageFormat.prototype._mergeFormats = function (defaults, formats) {
    var mergedFormats = {},
        type, mergedType;

    for (type in defaults) {
        if (!src$utils$$.hop.call(defaults, type)) { continue; }

        mergedFormats[type] = mergedType = src$es5$$.objCreate(defaults[type]);

        if (formats && src$utils$$.hop.call(formats, type)) {
            src$utils$$.extend(mergedType, formats[type]);
        }
    }

    return mergedFormats;
};

MessageFormat.prototype._resolveLocale = function (locales) {
    if (typeof locales === 'string') {
        locales = [locales];
    }

    // Create a copy of the array so we can push on the default locale.
    locales = (locales || []).concat(MessageFormat.defaultLocale);

    var localeData = MessageFormat.__localeData__;
    var i, len, localeParts, data;

    // Using the set of locales + the default locale, we look for the first one
    // which that has been registered. When data does not exist for a locale, we
    // traverse its ancestors to find something that's been registered within
    // its hierarchy of locales. Since we lack the proper `parentLocale` data
    // here, we must take a naive approach to traversal.
    for (i = 0, len = locales.length; i < len; i += 1) {
        localeParts = locales[i].toLowerCase().split('-');

        while (localeParts.length) {
            data = localeData[localeParts.join('-')];
            if (data) {
                // Return the normalized locale string; e.g., we return "en-US",
                // instead of "en-us".
                return data.locale;
            }

            localeParts.pop();
        }
    }

    var defaultLocale = locales.pop();
    throw new Error(
        'No locale data has been added to IntlMessageFormat for: ' +
        locales.join(', ') + ', or the default locale: ' + defaultLocale
    );
};

//# sourceMappingURL=core.js.map

/***/ }),

/***/ 482:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */


var src$utils$$ = __webpack_require__(244);

// Purposely using the same implementation as the Intl.js `Intl` polyfill.
// Copyright 2013 Andy Earnshaw, MIT License

var realDefineProp = (function () {
    try { return !!Object.defineProperty({}, 'a', {}); }
    catch (e) { return false; }
})();

var es3 = !realDefineProp && !Object.prototype.__defineGetter__;

var defineProperty = realDefineProp ? Object.defineProperty :
        function (obj, name, desc) {

    if ('get' in desc && obj.__defineGetter__) {
        obj.__defineGetter__(name, desc.get);
    } else if (!src$utils$$.hop.call(obj, name) || 'value' in desc) {
        obj[name] = desc.value;
    }
};

var objCreate = Object.create || function (proto, props) {
    var obj, k;

    function F() {}
    F.prototype = proto;
    obj = new F();

    for (k in props) {
        if (src$utils$$.hop.call(props, k)) {
            defineProperty(obj, k, props[k]);
        }
    }

    return obj;
};

exports.defineProperty = defineProperty, exports.objCreate = objCreate;

//# sourceMappingURL=es5.js.map

/***/ }),

/***/ 483:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */


exports["default"] = Compiler;

function Compiler(locales, formats, pluralFn) {
    this.locales  = locales;
    this.formats  = formats;
    this.pluralFn = pluralFn;
}

Compiler.prototype.compile = function (ast) {
    this.pluralStack        = [];
    this.currentPlural      = null;
    this.pluralNumberFormat = null;

    return this.compileMessage(ast);
};

Compiler.prototype.compileMessage = function (ast) {
    if (!(ast && ast.type === 'messageFormatPattern')) {
        throw new Error('Message AST is not of type: "messageFormatPattern"');
    }

    var elements = ast.elements,
        pattern  = [];

    var i, len, element;

    for (i = 0, len = elements.length; i < len; i += 1) {
        element = elements[i];

        switch (element.type) {
            case 'messageTextElement':
                pattern.push(this.compileMessageText(element));
                break;

            case 'argumentElement':
                pattern.push(this.compileArgument(element));
                break;

            default:
                throw new Error('Message element does not have a valid type');
        }
    }

    return pattern;
};

Compiler.prototype.compileMessageText = function (element) {
    // When this `element` is part of plural sub-pattern and its value contains
    // an unescaped '#', use a `PluralOffsetString` helper to properly output
    // the number with the correct offset in the string.
    if (this.currentPlural && /(^|[^\\])#/g.test(element.value)) {
        // Create a cache a NumberFormat instance that can be reused for any
        // PluralOffsetString instance in this message.
        if (!this.pluralNumberFormat) {
            this.pluralNumberFormat = new Intl.NumberFormat(this.locales);
        }

        return new PluralOffsetString(
                this.currentPlural.id,
                this.currentPlural.format.offset,
                this.pluralNumberFormat,
                element.value);
    }

    // Unescape the escaped '#'s in the message text.
    return element.value.replace(/\\#/g, '#');
};

Compiler.prototype.compileArgument = function (element) {
    var format = element.format;

    if (!format) {
        return new StringFormat(element.id);
    }

    var formats  = this.formats,
        locales  = this.locales,
        pluralFn = this.pluralFn,
        options;

    switch (format.type) {
        case 'numberFormat':
            options = formats.number[format.style];
            return {
                id    : element.id,
                format: new Intl.NumberFormat(locales, options).format
            };

        case 'dateFormat':
            options = formats.date[format.style];
            return {
                id    : element.id,
                format: new Intl.DateTimeFormat(locales, options).format
            };

        case 'timeFormat':
            options = formats.time[format.style];
            return {
                id    : element.id,
                format: new Intl.DateTimeFormat(locales, options).format
            };

        case 'pluralFormat':
            options = this.compileOptions(element);
            return new PluralFormat(
                element.id, format.ordinal, format.offset, options, pluralFn
            );

        case 'selectFormat':
            options = this.compileOptions(element);
            return new SelectFormat(element.id, options);

        default:
            throw new Error('Message element does not have a valid format type');
    }
};

Compiler.prototype.compileOptions = function (element) {
    var format      = element.format,
        options     = format.options,
        optionsHash = {};

    // Save the current plural element, if any, then set it to a new value when
    // compiling the options sub-patterns. This conforms the spec's algorithm
    // for handling `"#"` syntax in message text.
    this.pluralStack.push(this.currentPlural);
    this.currentPlural = format.type === 'pluralFormat' ? element : null;

    var i, len, option;

    for (i = 0, len = options.length; i < len; i += 1) {
        option = options[i];

        // Compile the sub-pattern and save it under the options's selector.
        optionsHash[option.selector] = this.compileMessage(option.value);
    }

    // Pop the plural stack to put back the original current plural value.
    this.currentPlural = this.pluralStack.pop();

    return optionsHash;
};

// -- Compiler Helper Classes --------------------------------------------------

function StringFormat(id) {
    this.id = id;
}

StringFormat.prototype.format = function (value) {
    if (!value && typeof value !== 'number') {
        return '';
    }

    return typeof value === 'string' ? value : String(value);
};

function PluralFormat(id, useOrdinal, offset, options, pluralFn) {
    this.id         = id;
    this.useOrdinal = useOrdinal;
    this.offset     = offset;
    this.options    = options;
    this.pluralFn   = pluralFn;
}

PluralFormat.prototype.getOption = function (value) {
    var options = this.options;

    var option = options['=' + value] ||
            options[this.pluralFn(value - this.offset, this.useOrdinal)];

    return option || options.other;
};

function PluralOffsetString(id, offset, numberFormat, string) {
    this.id           = id;
    this.offset       = offset;
    this.numberFormat = numberFormat;
    this.string       = string;
}

PluralOffsetString.prototype.format = function (value) {
    var number = this.numberFormat.format(value - this.offset);

    return this.string
            .replace(/(^|[^\\])#/g, '$1' + number)
            .replace(/\\#/g, '#');
};

function SelectFormat(id, options) {
    this.id      = id;
    this.options = options;
}

SelectFormat.prototype.getOption = function (value) {
    var options = this.options;
    return options[value] || options.other;
};

//# sourceMappingURL=compiler.js.map

/***/ }),

/***/ 484:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports = module.exports = __webpack_require__(485)['default'];
exports['default'] = exports;


/***/ }),

/***/ 485:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports["default"] = (function() {
  "use strict";

  /*
   * Generated by PEG.js 0.9.0.
   *
   * http://pegjs.org/
   */

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.location = location;
    this.name     = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  function peg$parse(input) {
    var options = arguments.length > 1 ? arguments[1] : {},
        parser  = this,

        peg$FAILED = {},

        peg$startRuleFunctions = { start: peg$parsestart },
        peg$startRuleFunction  = peg$parsestart,

        peg$c0 = function(elements) {
                return {
                    type    : 'messageFormatPattern',
                    elements: elements,
                    location: location()
                };
            },
        peg$c1 = function(text) {
                var string = '',
                    i, j, outerLen, inner, innerLen;

                for (i = 0, outerLen = text.length; i < outerLen; i += 1) {
                    inner = text[i];

                    for (j = 0, innerLen = inner.length; j < innerLen; j += 1) {
                        string += inner[j];
                    }
                }

                return string;
            },
        peg$c2 = function(messageText) {
                return {
                    type : 'messageTextElement',
                    value: messageText,
                    location: location()
                };
            },
        peg$c3 = /^[^ \t\n\r,.+={}#]/,
        peg$c4 = { type: "class", value: "[^ \\t\\n\\r,.+={}#]", description: "[^ \\t\\n\\r,.+={}#]" },
        peg$c5 = "{",
        peg$c6 = { type: "literal", value: "{", description: "\"{\"" },
        peg$c7 = ",",
        peg$c8 = { type: "literal", value: ",", description: "\",\"" },
        peg$c9 = "}",
        peg$c10 = { type: "literal", value: "}", description: "\"}\"" },
        peg$c11 = function(id, format) {
                return {
                    type  : 'argumentElement',
                    id    : id,
                    format: format && format[2],
                    location: location()
                };
            },
        peg$c12 = "number",
        peg$c13 = { type: "literal", value: "number", description: "\"number\"" },
        peg$c14 = "date",
        peg$c15 = { type: "literal", value: "date", description: "\"date\"" },
        peg$c16 = "time",
        peg$c17 = { type: "literal", value: "time", description: "\"time\"" },
        peg$c18 = function(type, style) {
                return {
                    type : type + 'Format',
                    style: style && style[2],
                    location: location()
                };
            },
        peg$c19 = "plural",
        peg$c20 = { type: "literal", value: "plural", description: "\"plural\"" },
        peg$c21 = function(pluralStyle) {
                return {
                    type   : pluralStyle.type,
                    ordinal: false,
                    offset : pluralStyle.offset || 0,
                    options: pluralStyle.options,
                    location: location()
                };
            },
        peg$c22 = "selectordinal",
        peg$c23 = { type: "literal", value: "selectordinal", description: "\"selectordinal\"" },
        peg$c24 = function(pluralStyle) {
                return {
                    type   : pluralStyle.type,
                    ordinal: true,
                    offset : pluralStyle.offset || 0,
                    options: pluralStyle.options,
                    location: location()
                }
            },
        peg$c25 = "select",
        peg$c26 = { type: "literal", value: "select", description: "\"select\"" },
        peg$c27 = function(options) {
                return {
                    type   : 'selectFormat',
                    options: options,
                    location: location()
                };
            },
        peg$c28 = "=",
        peg$c29 = { type: "literal", value: "=", description: "\"=\"" },
        peg$c30 = function(selector, pattern) {
                return {
                    type    : 'optionalFormatPattern',
                    selector: selector,
                    value   : pattern,
                    location: location()
                };
            },
        peg$c31 = "offset:",
        peg$c32 = { type: "literal", value: "offset:", description: "\"offset:\"" },
        peg$c33 = function(number) {
                return number;
            },
        peg$c34 = function(offset, options) {
                return {
                    type   : 'pluralFormat',
                    offset : offset,
                    options: options,
                    location: location()
                };
            },
        peg$c35 = { type: "other", description: "whitespace" },
        peg$c36 = /^[ \t\n\r]/,
        peg$c37 = { type: "class", value: "[ \\t\\n\\r]", description: "[ \\t\\n\\r]" },
        peg$c38 = { type: "other", description: "optionalWhitespace" },
        peg$c39 = /^[0-9]/,
        peg$c40 = { type: "class", value: "[0-9]", description: "[0-9]" },
        peg$c41 = /^[0-9a-f]/i,
        peg$c42 = { type: "class", value: "[0-9a-f]i", description: "[0-9a-f]i" },
        peg$c43 = "0",
        peg$c44 = { type: "literal", value: "0", description: "\"0\"" },
        peg$c45 = /^[1-9]/,
        peg$c46 = { type: "class", value: "[1-9]", description: "[1-9]" },
        peg$c47 = function(digits) {
            return parseInt(digits, 10);
        },
        peg$c48 = /^[^{}\\\0-\x1F \t\n\r]/,
        peg$c49 = { type: "class", value: "[^{}\\\\\\0-\\x1F\\x7f \\t\\n\\r]", description: "[^{}\\\\\\0-\\x1F\\x7f \\t\\n\\r]" },
        peg$c50 = "\\\\",
        peg$c51 = { type: "literal", value: "\\\\", description: "\"\\\\\\\\\"" },
        peg$c52 = function() { return '\\'; },
        peg$c53 = "\\#",
        peg$c54 = { type: "literal", value: "\\#", description: "\"\\\\#\"" },
        peg$c55 = function() { return '\\#'; },
        peg$c56 = "\\{",
        peg$c57 = { type: "literal", value: "\\{", description: "\"\\\\{\"" },
        peg$c58 = function() { return '\u007B'; },
        peg$c59 = "\\}",
        peg$c60 = { type: "literal", value: "\\}", description: "\"\\\\}\"" },
        peg$c61 = function() { return '\u007D'; },
        peg$c62 = "\\u",
        peg$c63 = { type: "literal", value: "\\u", description: "\"\\\\u\"" },
        peg$c64 = function(digits) {
                return String.fromCharCode(parseInt(digits, 16));
            },
        peg$c65 = function(chars) { return chars.join(''); },

        peg$currPos          = 0,
        peg$savedPos         = 0,
        peg$posDetailsCache  = [{ line: 1, column: 1, seenCR: false }],
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function expected(description) {
      throw peg$buildException(
        null,
        [{ type: "other", description: description }],
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function error(message) {
      throw peg$buildException(
        message,
        null,
        input.substring(peg$savedPos, peg$currPos),
        peg$computeLocation(peg$savedPos, peg$currPos)
      );
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos],
          p, ch;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line:   details.line,
          column: details.column,
          seenCR: details.seenCR
        };

        while (p < pos) {
          ch = input.charAt(p);
          if (ch === "\n") {
            if (!details.seenCR) { details.line++; }
            details.column = 1;
            details.seenCR = false;
          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
            details.line++;
            details.column = 1;
            details.seenCR = true;
          } else {
            details.column++;
            details.seenCR = false;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails   = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line:   startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line:   endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildException(message, expected, found, location) {
      function cleanupExpected(expected) {
        var i = 1;

        expected.sort(function(a, b) {
          if (a.description < b.description) {
            return -1;
          } else if (a.description > b.description) {
            return 1;
          } else {
            return 0;
          }
        });

        while (i < expected.length) {
          if (expected[i - 1] === expected[i]) {
            expected.splice(i, 1);
          } else {
            i++;
          }
        }
      }

      function buildMessage(expected, found) {
        function stringEscape(s) {
          function hex(ch) { return ch.charCodeAt(0).toString(16).toUpperCase(); }

          return s
            .replace(/\\/g,   '\\\\')
            .replace(/"/g,    '\\"')
            .replace(/\x08/g, '\\b')
            .replace(/\t/g,   '\\t')
            .replace(/\n/g,   '\\n')
            .replace(/\f/g,   '\\f')
            .replace(/\r/g,   '\\r')
            .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x80-\xFF]/g,    function(ch) { return '\\x'  + hex(ch); })
            .replace(/[\u0100-\u0FFF]/g,         function(ch) { return '\\u0' + hex(ch); })
            .replace(/[\u1000-\uFFFF]/g,         function(ch) { return '\\u'  + hex(ch); });
        }

        var expectedDescs = new Array(expected.length),
            expectedDesc, foundDesc, i;

        for (i = 0; i < expected.length; i++) {
          expectedDescs[i] = expected[i].description;
        }

        expectedDesc = expected.length > 1
          ? expectedDescs.slice(0, -1).join(", ")
              + " or "
              + expectedDescs[expected.length - 1]
          : expectedDescs[0];

        foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";

        return "Expected " + expectedDesc + " but " + foundDesc + " found.";
      }

      if (expected !== null) {
        cleanupExpected(expected);
      }

      return new peg$SyntaxError(
        message !== null ? message : buildMessage(expected, found),
        expected,
        found,
        location
      );
    }

    function peg$parsestart() {
      var s0;

      s0 = peg$parsemessageFormatPattern();

      return s0;
    }

    function peg$parsemessageFormatPattern() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsemessageFormatElement();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsemessageFormatElement();
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c0(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsemessageFormatElement() {
      var s0;

      s0 = peg$parsemessageTextElement();
      if (s0 === peg$FAILED) {
        s0 = peg$parseargumentElement();
      }

      return s0;
    }

    function peg$parsemessageText() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$currPos;
      s3 = peg$parse_();
      if (s3 !== peg$FAILED) {
        s4 = peg$parsechars();
        if (s4 !== peg$FAILED) {
          s5 = peg$parse_();
          if (s5 !== peg$FAILED) {
            s3 = [s3, s4, s5];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$currPos;
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsechars();
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s3 = [s3, s4, s5];
                s2 = s3;
              } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
              }
            } else {
              peg$currPos = s2;
              s2 = peg$FAILED;
            }
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c1(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parsews();
        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }
      }

      return s0;
    }

    function peg$parsemessageTextElement() {
      var s0, s1;

      s0 = peg$currPos;
      s1 = peg$parsemessageText();
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c2(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseargument() {
      var s0, s1, s2;

      s0 = peg$parsenumber();
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = [];
        if (peg$c3.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c4); }
        }
        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            if (peg$c3.test(input.charAt(peg$currPos))) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c4); }
            }
          }
        } else {
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          s0 = input.substring(s0, peg$currPos);
        } else {
          s0 = s1;
        }
      }

      return s0;
    }

    function peg$parseargumentElement() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 123) {
        s1 = peg$c5;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c6); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseargument();
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$currPos;
              if (input.charCodeAt(peg$currPos) === 44) {
                s6 = peg$c7;
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c8); }
              }
              if (s6 !== peg$FAILED) {
                s7 = peg$parse_();
                if (s7 !== peg$FAILED) {
                  s8 = peg$parseelementFormat();
                  if (s8 !== peg$FAILED) {
                    s6 = [s6, s7, s8];
                    s5 = s6;
                  } else {
                    peg$currPos = s5;
                    s5 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s5;
                  s5 = peg$FAILED;
                }
              } else {
                peg$currPos = s5;
                s5 = peg$FAILED;
              }
              if (s5 === peg$FAILED) {
                s5 = null;
              }
              if (s5 !== peg$FAILED) {
                s6 = peg$parse_();
                if (s6 !== peg$FAILED) {
                  if (input.charCodeAt(peg$currPos) === 125) {
                    s7 = peg$c9;
                    peg$currPos++;
                  } else {
                    s7 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c10); }
                  }
                  if (s7 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c11(s3, s5);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseelementFormat() {
      var s0;

      s0 = peg$parsesimpleFormat();
      if (s0 === peg$FAILED) {
        s0 = peg$parsepluralFormat();
        if (s0 === peg$FAILED) {
          s0 = peg$parseselectOrdinalFormat();
          if (s0 === peg$FAILED) {
            s0 = peg$parseselectFormat();
          }
        }
      }

      return s0;
    }

    function peg$parsesimpleFormat() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c12) {
        s1 = peg$c12;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c13); }
      }
      if (s1 === peg$FAILED) {
        if (input.substr(peg$currPos, 4) === peg$c14) {
          s1 = peg$c14;
          peg$currPos += 4;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c15); }
        }
        if (s1 === peg$FAILED) {
          if (input.substr(peg$currPos, 4) === peg$c16) {
            s1 = peg$c16;
            peg$currPos += 4;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c17); }
          }
        }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$currPos;
          if (input.charCodeAt(peg$currPos) === 44) {
            s4 = peg$c7;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parse_();
            if (s5 !== peg$FAILED) {
              s6 = peg$parsechars();
              if (s6 !== peg$FAILED) {
                s4 = [s4, s5, s6];
                s3 = s4;
              } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
              }
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c18(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsepluralFormat() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c19) {
        s1 = peg$c19;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c20); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s3 = peg$c7;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsepluralStyle();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c21(s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseselectOrdinalFormat() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 13) === peg$c22) {
        s1 = peg$c22;
        peg$currPos += 13;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c23); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s3 = peg$c7;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = peg$parsepluralStyle();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c24(s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseselectFormat() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c25) {
        s1 = peg$c25;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c26); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 44) {
            s3 = peg$c7;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              s5 = [];
              s6 = peg$parseoptionalFormatPattern();
              if (s6 !== peg$FAILED) {
                while (s6 !== peg$FAILED) {
                  s5.push(s6);
                  s6 = peg$parseoptionalFormatPattern();
                }
              } else {
                s5 = peg$FAILED;
              }
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c27(s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseselector() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 61) {
        s2 = peg$c28;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c29); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parsenumber();
        if (s3 !== peg$FAILED) {
          s2 = [s2, s3];
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s0 = input.substring(s0, peg$currPos);
      } else {
        s0 = s1;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$parsechars();
      }

      return s0;
    }

    function peg$parseoptionalFormatPattern() {
      var s0, s1, s2, s3, s4, s5, s6, s7, s8;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseselector();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 123) {
              s4 = peg$c5;
              peg$currPos++;
            } else {
              s4 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c6); }
            }
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s6 = peg$parsemessageFormatPattern();
                if (s6 !== peg$FAILED) {
                  s7 = peg$parse_();
                  if (s7 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 125) {
                      s8 = peg$c9;
                      peg$currPos++;
                    } else {
                      s8 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c10); }
                    }
                    if (s8 !== peg$FAILED) {
                      peg$savedPos = s0;
                      s1 = peg$c30(s2, s6);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseoffset() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 7) === peg$c31) {
        s1 = peg$c31;
        peg$currPos += 7;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c32); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsenumber();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c33(s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsepluralStyle() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parseoffset();
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = [];
          s4 = peg$parseoptionalFormatPattern();
          if (s4 !== peg$FAILED) {
            while (s4 !== peg$FAILED) {
              s3.push(s4);
              s4 = peg$parseoptionalFormatPattern();
            }
          } else {
            s3 = peg$FAILED;
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c34(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsews() {
      var s0, s1;

      peg$silentFails++;
      s0 = [];
      if (peg$c36.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c37); }
      }
      if (s1 !== peg$FAILED) {
        while (s1 !== peg$FAILED) {
          s0.push(s1);
          if (peg$c36.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c37); }
          }
        }
      } else {
        s0 = peg$FAILED;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c35); }
      }

      return s0;
    }

    function peg$parse_() {
      var s0, s1, s2;

      peg$silentFails++;
      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsews();
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsews();
      }
      if (s1 !== peg$FAILED) {
        s0 = input.substring(s0, peg$currPos);
      } else {
        s0 = s1;
      }
      peg$silentFails--;
      if (s0 === peg$FAILED) {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c38); }
      }

      return s0;
    }

    function peg$parsedigit() {
      var s0;

      if (peg$c39.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c40); }
      }

      return s0;
    }

    function peg$parsehexDigit() {
      var s0;

      if (peg$c41.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c42); }
      }

      return s0;
    }

    function peg$parsenumber() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 48) {
        s1 = peg$c43;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c44); }
      }
      if (s1 === peg$FAILED) {
        s1 = peg$currPos;
        s2 = peg$currPos;
        if (peg$c45.test(input.charAt(peg$currPos))) {
          s3 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c46); }
        }
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$parsedigit();
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$parsedigit();
          }
          if (s4 !== peg$FAILED) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s1 = input.substring(s1, peg$currPos);
        } else {
          s1 = s2;
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c47(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parsechar() {
      var s0, s1, s2, s3, s4, s5, s6, s7;

      if (peg$c48.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c49); }
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 2) === peg$c50) {
          s1 = peg$c50;
          peg$currPos += 2;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c51); }
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c52();
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 2) === peg$c53) {
            s1 = peg$c53;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c54); }
          }
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c55();
          }
          s0 = s1;
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 2) === peg$c56) {
              s1 = peg$c56;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c57); }
            }
            if (s1 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c58();
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
              s0 = peg$currPos;
              if (input.substr(peg$currPos, 2) === peg$c59) {
                s1 = peg$c59;
                peg$currPos += 2;
              } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c60); }
              }
              if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c61();
              }
              s0 = s1;
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.substr(peg$currPos, 2) === peg$c62) {
                  s1 = peg$c62;
                  peg$currPos += 2;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c63); }
                }
                if (s1 !== peg$FAILED) {
                  s2 = peg$currPos;
                  s3 = peg$currPos;
                  s4 = peg$parsehexDigit();
                  if (s4 !== peg$FAILED) {
                    s5 = peg$parsehexDigit();
                    if (s5 !== peg$FAILED) {
                      s6 = peg$parsehexDigit();
                      if (s6 !== peg$FAILED) {
                        s7 = peg$parsehexDigit();
                        if (s7 !== peg$FAILED) {
                          s4 = [s4, s5, s6, s7];
                          s3 = s4;
                        } else {
                          peg$currPos = s3;
                          s3 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s3;
                      s3 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                  }
                  if (s3 !== peg$FAILED) {
                    s2 = input.substring(s2, peg$currPos);
                  } else {
                    s2 = s3;
                  }
                  if (s2 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c64(s2);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              }
            }
          }
        }
      }

      return s0;
    }

    function peg$parsechars() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      s2 = peg$parsechar();
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          s2 = peg$parsechar();
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c65(s1);
      }
      s0 = s1;

      return s0;
    }

    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail({ type: "end", description: "end of input" });
      }

      throw peg$buildException(
        null,
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
      );
    }
  }

  return {
    SyntaxError: peg$SyntaxError,
    parse:       peg$parse
  };
})();

//# sourceMappingURL=parser.js.map

/***/ }),

/***/ 486:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// GENERATED FILE

exports["default"] = {"locale":"en","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return n10==1&&n100!=11?"one":n10==2&&n100!=12?"two":n10==3&&n100!=13?"few":"other";return n==1&&v0?"one":"other"}};

//# sourceMappingURL=en.js.map

/***/ }),

/***/ 487:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 488:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* jshint node:true */



var IntlRelativeFormat = __webpack_require__(489)['default'];

// Add all locale data to `IntlRelativeFormat`. This module will be ignored when
// bundling for the browser with Browserify/Webpack.
__webpack_require__(494);

// Re-export `IntlRelativeFormat` as the CommonJS default exports with all the
// locale data registered, and with English set as the default locale. Define
// the `default` prop for use with other compiled ES6 Modules.
exports = module.exports = IntlRelativeFormat;
exports['default'] = exports;


/***/ }),

/***/ 489:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* jslint esnext: true */


var src$core$$ = __webpack_require__(490), src$en$$ = __webpack_require__(493);

src$core$$["default"].__addLocaleData(src$en$$["default"]);
src$core$$["default"].defaultLocale = 'en';

exports["default"] = src$core$$["default"];

//# sourceMappingURL=main.js.map

/***/ }),

/***/ 49:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// This file hosts our error definitions
// We use custom error "types" so that we can act on them when we need it
// e.g.: if error instanceof errors.UnparsableJSON then..

var inherits = __webpack_require__(68);

function AlgoliaSearchError(message, extraProperties) {
  var forEach = __webpack_require__(50);

  var error = this;

  // try to get a stacktrace
  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(this, this.constructor);
  } else {
    error.stack = (new Error()).stack || 'Cannot get a stacktrace, browser is too old';
  }

  this.name = 'AlgoliaSearchError';
  this.message = message || 'Unknown error';

  if (extraProperties) {
    forEach(extraProperties, function addToErrorObject(value, key) {
      error[key] = value;
    });
  }
}

inherits(AlgoliaSearchError, Error);

function createCustomError(name, message) {
  function AlgoliaSearchCustomError() {
    var args = Array.prototype.slice.call(arguments, 0);

    // custom message not set, use default
    if (typeof args[0] !== 'string') {
      args.unshift(message);
    }

    AlgoliaSearchError.apply(this, args);
    this.name = 'AlgoliaSearch' + name + 'Error';
  }

  inherits(AlgoliaSearchCustomError, AlgoliaSearchError);

  return AlgoliaSearchCustomError;
}

// late exports to let various fn defs and inherits take place
module.exports = {
  AlgoliaSearchError: AlgoliaSearchError,
  UnparsableJSON: createCustomError(
    'UnparsableJSON',
    'Could not parse the incoming response as JSON, see err.more for details'
  ),
  RequestTimeout: createCustomError(
    'RequestTimeout',
    'Request timedout before getting a response'
  ),
  Network: createCustomError(
    'Network',
    'Network issue, see err.more for details'
  ),
  JSONPScriptFail: createCustomError(
    'JSONPScriptFail',
    '<script> was loaded but did not call our provided callback'
  ),
  JSONPScriptError: createCustomError(
    'JSONPScriptError',
    '<script> unable to load due to an `error` event on it'
  ),
  Unknown: createCustomError(
    'Unknown',
    'Unknown error occured'
  )
};


/***/ }),

/***/ 490:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */


var intl$messageformat$$ = __webpack_require__(243), src$diff$$ = __webpack_require__(491), src$es5$$ = __webpack_require__(492);
exports["default"] = RelativeFormat;

// -----------------------------------------------------------------------------

var FIELDS = [
    'second', 'second-short',
    'minute', 'minute-short',
    'hour', 'hour-short',
    'day', 'day-short',
    'month', 'month-short',
    'year', 'year-short'
];
var STYLES = ['best fit', 'numeric'];

// -- RelativeFormat -----------------------------------------------------------

function RelativeFormat(locales, options) {
    options = options || {};

    // Make a copy of `locales` if it's an array, so that it doesn't change
    // since it's used lazily.
    if (src$es5$$.isArray(locales)) {
        locales = locales.concat();
    }

    src$es5$$.defineProperty(this, '_locale', {value: this._resolveLocale(locales)});
    src$es5$$.defineProperty(this, '_options', {value: {
        style: this._resolveStyle(options.style),
        units: this._isValidUnits(options.units) && options.units
    }});

    src$es5$$.defineProperty(this, '_locales', {value: locales});
    src$es5$$.defineProperty(this, '_fields', {value: this._findFields(this._locale)});
    src$es5$$.defineProperty(this, '_messages', {value: src$es5$$.objCreate(null)});

    // "Bind" `format()` method to `this` so it can be passed by reference like
    // the other `Intl` APIs.
    var relativeFormat = this;
    this.format = function format(date, options) {
        return relativeFormat._format(date, options);
    };
}

// Define internal private properties for dealing with locale data.
src$es5$$.defineProperty(RelativeFormat, '__localeData__', {value: src$es5$$.objCreate(null)});
src$es5$$.defineProperty(RelativeFormat, '__addLocaleData', {value: function (data) {
    if (!(data && data.locale)) {
        throw new Error(
            'Locale data provided to IntlRelativeFormat is missing a ' +
            '`locale` property value'
        );
    }

    RelativeFormat.__localeData__[data.locale.toLowerCase()] = data;

    // Add data to IntlMessageFormat.
    intl$messageformat$$["default"].__addLocaleData(data);
}});

// Define public `defaultLocale` property which can be set by the developer, or
// it will be set when the first RelativeFormat instance is created by
// leveraging the resolved locale from `Intl`.
src$es5$$.defineProperty(RelativeFormat, 'defaultLocale', {
    enumerable: true,
    writable  : true,
    value     : undefined
});

// Define public `thresholds` property which can be set by the developer, and
// defaults to relative time thresholds from moment.js.
src$es5$$.defineProperty(RelativeFormat, 'thresholds', {
    enumerable: true,

    value: {
        second: 45, 'second-short': 45,  // seconds to minute
        minute: 45, 'minute-short': 45, // minutes to hour
        hour  : 22, 'hour-short': 22, // hours to day
        day   : 26, 'day-short': 26, // days to month
        month : 11, 'month-short': 11 // months to year
    }
});

RelativeFormat.prototype.resolvedOptions = function () {
    return {
        locale: this._locale,
        style : this._options.style,
        units : this._options.units
    };
};

RelativeFormat.prototype._compileMessage = function (units) {
    // `this._locales` is the original set of locales the user specified to the
    // constructor, while `this._locale` is the resolved root locale.
    var locales        = this._locales;
    var resolvedLocale = this._locale;

    var field        = this._fields[units];
    var relativeTime = field.relativeTime;
    var future       = '';
    var past         = '';
    var i;

    for (i in relativeTime.future) {
        if (relativeTime.future.hasOwnProperty(i)) {
            future += ' ' + i + ' {' +
                relativeTime.future[i].replace('{0}', '#') + '}';
        }
    }

    for (i in relativeTime.past) {
        if (relativeTime.past.hasOwnProperty(i)) {
            past += ' ' + i + ' {' +
                relativeTime.past[i].replace('{0}', '#') + '}';
        }
    }

    var message = '{when, select, future {{0, plural, ' + future + '}}' +
                                 'past {{0, plural, ' + past + '}}}';

    // Create the synthetic IntlMessageFormat instance using the original
    // locales value specified by the user when constructing the the parent
    // IntlRelativeFormat instance.
    return new intl$messageformat$$["default"](message, locales);
};

RelativeFormat.prototype._getMessage = function (units) {
    var messages = this._messages;

    // Create a new synthetic message based on the locale data from CLDR.
    if (!messages[units]) {
        messages[units] = this._compileMessage(units);
    }

    return messages[units];
};

RelativeFormat.prototype._getRelativeUnits = function (diff, units) {
    var field = this._fields[units];

    if (field.relative) {
        return field.relative[diff];
    }
};

RelativeFormat.prototype._findFields = function (locale) {
    var localeData = RelativeFormat.__localeData__;
    var data       = localeData[locale.toLowerCase()];

    // The locale data is de-duplicated, so we have to traverse the locale's
    // hierarchy until we find `fields` to return.
    while (data) {
        if (data.fields) {
            return data.fields;
        }

        data = data.parentLocale && localeData[data.parentLocale.toLowerCase()];
    }

    throw new Error(
        'Locale data added to IntlRelativeFormat is missing `fields` for :' +
        locale
    );
};

RelativeFormat.prototype._format = function (date, options) {
    var now = options && options.now !== undefined ? options.now : src$es5$$.dateNow();

    if (date === undefined) {
        date = now;
    }

    // Determine if the `date` and optional `now` values are valid, and throw a
    // similar error to what `Intl.DateTimeFormat#format()` would throw.
    if (!isFinite(now)) {
        throw new RangeError(
            'The `now` option provided to IntlRelativeFormat#format() is not ' +
            'in valid range.'
        );
    }

    if (!isFinite(date)) {
        throw new RangeError(
            'The date value provided to IntlRelativeFormat#format() is not ' +
            'in valid range.'
        );
    }

    var diffReport  = src$diff$$["default"](now, date);
    var units       = this._options.units || this._selectUnits(diffReport);
    var diffInUnits = diffReport[units];

    if (this._options.style !== 'numeric') {
        var relativeUnits = this._getRelativeUnits(diffInUnits, units);
        if (relativeUnits) {
            return relativeUnits;
        }
    }

    return this._getMessage(units).format({
        '0' : Math.abs(diffInUnits),
        when: diffInUnits < 0 ? 'past' : 'future'
    });
};

RelativeFormat.prototype._isValidUnits = function (units) {
    if (!units || src$es5$$.arrIndexOf.call(FIELDS, units) >= 0) {
        return true;
    }

    if (typeof units === 'string') {
        var suggestion = /s$/.test(units) && units.substr(0, units.length - 1);
        if (suggestion && src$es5$$.arrIndexOf.call(FIELDS, suggestion) >= 0) {
            throw new Error(
                '"' + units + '" is not a valid IntlRelativeFormat `units` ' +
                'value, did you mean: ' + suggestion
            );
        }
    }

    throw new Error(
        '"' + units + '" is not a valid IntlRelativeFormat `units` value, it ' +
        'must be one of: "' + FIELDS.join('", "') + '"'
    );
};

RelativeFormat.prototype._resolveLocale = function (locales) {
    if (typeof locales === 'string') {
        locales = [locales];
    }

    // Create a copy of the array so we can push on the default locale.
    locales = (locales || []).concat(RelativeFormat.defaultLocale);

    var localeData = RelativeFormat.__localeData__;
    var i, len, localeParts, data;

    // Using the set of locales + the default locale, we look for the first one
    // which that has been registered. When data does not exist for a locale, we
    // traverse its ancestors to find something that's been registered within
    // its hierarchy of locales. Since we lack the proper `parentLocale` data
    // here, we must take a naive approach to traversal.
    for (i = 0, len = locales.length; i < len; i += 1) {
        localeParts = locales[i].toLowerCase().split('-');

        while (localeParts.length) {
            data = localeData[localeParts.join('-')];
            if (data) {
                // Return the normalized locale string; e.g., we return "en-US",
                // instead of "en-us".
                return data.locale;
            }

            localeParts.pop();
        }
    }

    var defaultLocale = locales.pop();
    throw new Error(
        'No locale data has been added to IntlRelativeFormat for: ' +
        locales.join(', ') + ', or the default locale: ' + defaultLocale
    );
};

RelativeFormat.prototype._resolveStyle = function (style) {
    // Default to "best fit" style.
    if (!style) {
        return STYLES[0];
    }

    if (src$es5$$.arrIndexOf.call(STYLES, style) >= 0) {
        return style;
    }

    throw new Error(
        '"' + style + '" is not a valid IntlRelativeFormat `style` value, it ' +
        'must be one of: "' + STYLES.join('", "') + '"'
    );
};

RelativeFormat.prototype._selectUnits = function (diffReport) {
    var i, l, units;
    var fields = FIELDS.filter(function(field) {
        return field.indexOf('-short') < 1;
    });

    for (i = 0, l = fields.length; i < l; i += 1) {
        units = fields[i];

        if (Math.abs(diffReport[units]) < RelativeFormat.thresholds[units]) {
            break;
        }
    }

    return units;
};

//# sourceMappingURL=core.js.map

/***/ }),

/***/ 491:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */



var round = Math.round;

function daysToYears(days) {
    // 400 years have 146097 days (taking into account leap year rules)
    return days * 400 / 146097;
}

exports["default"] = function (from, to) {
    // Convert to ms timestamps.
    from = +from;
    to   = +to;

    var millisecond = round(to - from),
        second      = round(millisecond / 1000),
        minute      = round(second / 60),
        hour        = round(minute / 60),
        day         = round(hour / 24),
        week        = round(day / 7);

    var rawYears = daysToYears(day),
        month    = round(rawYears * 12),
        year     = round(rawYears);

    return {
        millisecond    : millisecond,
        second         : second,
        'second-short' : second,
        minute         : minute,
        'minute-short' : minute,
        hour           : hour,
        'hour-short'   : hour,
        day            : day,
        'day-short'    : day,
        week           : week,
        'week-short'   : week,
        month          : month,
        'month-short'  : month,
        year           : year,
        'year-short'   : year
    };
};

//# sourceMappingURL=diff.js.map

/***/ }),

/***/ 492:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

// Purposely using the same implementation as the Intl.js `Intl` polyfill.
// Copyright 2013 Andy Earnshaw, MIT License



var hop = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

var realDefineProp = (function () {
    try { return !!Object.defineProperty({}, 'a', {}); }
    catch (e) { return false; }
})();

var es3 = !realDefineProp && !Object.prototype.__defineGetter__;

var defineProperty = realDefineProp ? Object.defineProperty :
        function (obj, name, desc) {

    if ('get' in desc && obj.__defineGetter__) {
        obj.__defineGetter__(name, desc.get);
    } else if (!hop.call(obj, name) || 'value' in desc) {
        obj[name] = desc.value;
    }
};

var objCreate = Object.create || function (proto, props) {
    var obj, k;

    function F() {}
    F.prototype = proto;
    obj = new F();

    for (k in props) {
        if (hop.call(props, k)) {
            defineProperty(obj, k, props[k]);
        }
    }

    return obj;
};

var arrIndexOf = Array.prototype.indexOf || function (search, fromIndex) {
    /*jshint validthis:true */
    var arr = this;
    if (!arr.length) {
        return -1;
    }

    for (var i = fromIndex || 0, max = arr.length; i < max; i++) {
        if (arr[i] === search) {
            return i;
        }
    }

    return -1;
};

var isArray = Array.isArray || function (obj) {
    return toString.call(obj) === '[object Array]';
};

var dateNow = Date.now || function () {
    return new Date().getTime();
};

exports.defineProperty = defineProperty, exports.objCreate = objCreate, exports.arrIndexOf = arrIndexOf, exports.isArray = isArray, exports.dateNow = dateNow;

//# sourceMappingURL=es5.js.map

/***/ }),

/***/ 493:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// GENERATED FILE

exports["default"] = {"locale":"en","pluralRuleFunction":function (n,ord){var s=String(n).split("."),v0=!s[1],t0=Number(s[0])==n,n10=t0&&s[0].slice(-1),n100=t0&&s[0].slice(-2);if(ord)return n10==1&&n100!=11?"one":n10==2&&n100!=12?"two":n10==3&&n100!=13?"few":"other";return n==1&&v0?"one":"other"},"fields":{"year":{"displayName":"year","relative":{"0":"this year","1":"next year","-1":"last year"},"relativeTime":{"future":{"one":"in {0} year","other":"in {0} years"},"past":{"one":"{0} year ago","other":"{0} years ago"}}},"year-short":{"displayName":"yr.","relative":{"0":"this yr.","1":"next yr.","-1":"last yr."},"relativeTime":{"future":{"one":"in {0} yr.","other":"in {0} yr."},"past":{"one":"{0} yr. ago","other":"{0} yr. ago"}}},"month":{"displayName":"month","relative":{"0":"this month","1":"next month","-1":"last month"},"relativeTime":{"future":{"one":"in {0} month","other":"in {0} months"},"past":{"one":"{0} month ago","other":"{0} months ago"}}},"month-short":{"displayName":"mo.","relative":{"0":"this mo.","1":"next mo.","-1":"last mo."},"relativeTime":{"future":{"one":"in {0} mo.","other":"in {0} mo."},"past":{"one":"{0} mo. ago","other":"{0} mo. ago"}}},"day":{"displayName":"day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"one":"in {0} day","other":"in {0} days"},"past":{"one":"{0} day ago","other":"{0} days ago"}}},"day-short":{"displayName":"day","relative":{"0":"today","1":"tomorrow","-1":"yesterday"},"relativeTime":{"future":{"one":"in {0} day","other":"in {0} days"},"past":{"one":"{0} day ago","other":"{0} days ago"}}},"hour":{"displayName":"hour","relative":{"0":"this hour"},"relativeTime":{"future":{"one":"in {0} hour","other":"in {0} hours"},"past":{"one":"{0} hour ago","other":"{0} hours ago"}}},"hour-short":{"displayName":"hr.","relative":{"0":"this hour"},"relativeTime":{"future":{"one":"in {0} hr.","other":"in {0} hr."},"past":{"one":"{0} hr. ago","other":"{0} hr. ago"}}},"minute":{"displayName":"minute","relative":{"0":"this minute"},"relativeTime":{"future":{"one":"in {0} minute","other":"in {0} minutes"},"past":{"one":"{0} minute ago","other":"{0} minutes ago"}}},"minute-short":{"displayName":"min.","relative":{"0":"this minute"},"relativeTime":{"future":{"one":"in {0} min.","other":"in {0} min."},"past":{"one":"{0} min. ago","other":"{0} min. ago"}}},"second":{"displayName":"second","relative":{"0":"now"},"relativeTime":{"future":{"one":"in {0} second","other":"in {0} seconds"},"past":{"one":"{0} second ago","other":"{0} seconds ago"}}},"second-short":{"displayName":"sec.","relative":{"0":"now"},"relativeTime":{"future":{"one":"in {0} sec.","other":"in {0} sec."},"past":{"one":"{0} sec. ago","other":"{0} sec. ago"}}}}};

//# sourceMappingURL=en.js.map

/***/ }),

/***/ 494:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 495:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
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

/***/ 496:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports = module.exports = __webpack_require__(497)['default'];
exports['default'] = exports;


/***/ }),

/***/ 497:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jshint esnext: true */


var src$es5$$ = __webpack_require__(498);
exports["default"] = createFormatCache;

// -----------------------------------------------------------------------------

function createFormatCache(FormatConstructor) {
    var cache = src$es5$$.objCreate(null);

    return function () {
        var args    = Array.prototype.slice.call(arguments);
        var cacheId = getCacheId(args);
        var format  = cacheId && cache[cacheId];

        if (!format) {
            format = new (src$es5$$.bind.apply(FormatConstructor, [null].concat(args)))();

            if (cacheId) {
                cache[cacheId] = format;
            }
        }

        return format;
    };
}

// -- Utilities ----------------------------------------------------------------

function getCacheId(inputs) {
    // When JSON is not available in the runtime, we will not create a cache id.
    if (typeof JSON === 'undefined') { return; }

    var cacheId = [];

    var i, len, input;

    for (i = 0, len = inputs.length; i < len; i += 1) {
        input = inputs[i];

        if (input && typeof input === 'object') {
            cacheId.push(orderedProps(input));
        } else {
            cacheId.push(input);
        }
    }

    return JSON.stringify(cacheId);
}

function orderedProps(obj) {
    var props = [],
        keys  = [];

    var key, i, len, prop;

    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            keys.push(key);
        }
    }

    var orderedKeys = keys.sort();

    for (i = 0, len = orderedKeys.length; i < len; i += 1) {
        key  = orderedKeys[i];
        prop = {};

        prop[key] = obj[key];
        props[i]  = prop;
    }

    return props;
}

//# sourceMappingURL=memoizer.js.map

/***/ }),

/***/ 498:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */

// Function.prototype.bind implementation from Mozilla Developer Network:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Polyfill



var bind = Function.prototype.bind || function (oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    if (this.prototype) {
      // native functions don't have a prototype
      fNOP.prototype = this.prototype;
    }
    fBound.prototype = new fNOP();

    return fBound;
};

// Purposely using the same implementation as the Intl.js `Intl` polyfill.
// Copyright 2013 Andy Earnshaw, MIT License

var hop = Object.prototype.hasOwnProperty;

var realDefineProp = (function () {
    try { return !!Object.defineProperty({}, 'a', {}); }
    catch (e) { return false; }
})();

var es3 = !realDefineProp && !Object.prototype.__defineGetter__;

var defineProperty = realDefineProp ? Object.defineProperty :
        function (obj, name, desc) {

    if ('get' in desc && obj.__defineGetter__) {
        obj.__defineGetter__(name, desc.get);
    } else if (!hop.call(obj, name) || 'value' in desc) {
        obj[name] = desc.value;
    }
};

var objCreate = Object.create || function (proto, props) {
    var obj, k;

    function F() {}
    F.prototype = proto;
    obj = new F();

    for (k in props) {
        if (hop.call(props, k)) {
            defineProperty(obj, k, props[k]);
        }
    }

    return obj;
};

exports.bind = bind, exports.defineProperty = defineProperty, exports.objCreate = objCreate;

//# sourceMappingURL=es5.js.map

/***/ }),

/***/ 499:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _IFrame = __webpack_require__(426);

var _IFrame2 = _interopRequireDefault(_IFrame);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__(2);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ArticleContentFullWidth = (0, _styledComponents2.default)(_IFrame2.default).withConfig({
	displayName: "ArticleContent__ArticleContentFullWidth"
})(["width:100%;height:600px;border:none;"]);

/**
 * Creates the JSX to render the content of the selected article.
 *
 * @param {object} props The React props.
 * @returns {ReactElement} An iFrame with the content of the selected article.
 * @constructor
 */

var ArticleContent = function (_React$Component) {
	_inherits(ArticleContent, _React$Component);

	/**
  * Constructs the article content.
  *
  * @param {Object} props The props for the article content.
  */
	function ArticleContent(props) {
		_classCallCheck(this, ArticleContent);

		return _possibleConstructorReturn(this, (ArticleContent.__proto__ || Object.getPrototypeOf(ArticleContent)).call(this, props));
	}

	/**
  * Transforms a given URL to an AMP URL.
  *
  * @param {string} originalUrl The original URL.
  *
  * @returns {string} The AMP URL.
  */


	_createClass(ArticleContent, [{
		key: "toAmp",
		value: function toAmp(originalUrl) {
			return originalUrl + "amp/?source=wpseo-kb-search";
		}

		/**
   * Renders the article content with the AMP URL.
   *
   * @returns {ReactElement} The rendered element.
   */

	}, {
		key: "render",
		value: function render() {
			return _react2.default.createElement(ArticleContentFullWidth, {
				src: this.toAmp(this.props.post.permalink),
				className: "kb-search-content-frame",
				title: this.props.title });
		}
	}]);

	return ArticleContent;
}(_react2.default.Component);

ArticleContent.propTypes = {
	post: _propTypes2.default.object.isRequired,
	title: _propTypes2.default.string
};

ArticleContent.defaultProps = {
	title: "Knowledge base article"
};

exports.default = ArticleContent;

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

/***/ 50:
/***/ (function(module, exports) {


var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

module.exports = function forEach (obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};



/***/ }),

/***/ 500:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.YoastLinkButton = undefined;

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__(2);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _colors = __webpack_require__(4);

var _colors2 = _interopRequireDefault(_colors);

var _YoastButton = __webpack_require__(69);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns a Link with the Yoast button style.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} styled link.
 */
var YoastLinkButton = exports.YoastLinkButton = (0, _YoastButton.addButtonStyles)(_styledComponents2.default.a.withConfig({
	displayName: "YoastLinkButton"
})(["text-decoration:none;color:", ";background:", ";min-width:152px;", ";"], function (props) {
	return props.textColor;
}, function (props) {
	return props.backgroundColor;
}, function (props) {
	return props.withTextShadow ? "text-shadow: 0 0 2px " + _colors2.default.$color_black : "";
}));

YoastLinkButton.propTypes = {
	backgroundColor: _propTypes2.default.string,
	textColor: _propTypes2.default.string,
	withTextShadow: _propTypes2.default.bool
};

YoastLinkButton.defaultProps = {
	backgroundColor: _colors2.default.$color_green_medium_light,
	textColor: _colors2.default.$color_white,
	withTextShadow: true
};

/***/ }),

/***/ 501:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.SearchResult = SearchResult;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _a11y = __webpack_require__(86);

var _styledComponents = __webpack_require__(2);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _i18n = __webpack_require__(9);

var _ListTable = __webpack_require__(502);

var _Row = __webpack_require__(503);

var _colors = __webpack_require__(4);

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* External dependencies */


/* Internal dependencies */


/**
 * The title of the search result item.
 */
var SearchResultTitle = _styledComponents2.default.p.withConfig({
	displayName: "SearchResults__SearchResultTitle"
})(["margin:0;font-size:1em;font-weight:normal;"]);

/**
 * The link to the search result.
 */
var SearchResultLink = _styledComponents2.default.a.withConfig({
	displayName: "SearchResults__SearchResultLink"
})(["color:", ";padding:8px 16px;&:hover,&:focus{color:", ";}"], _colors2.default.$color_black, _colors2.default.$color_pink_dark);

/**
 * Returns a single search result item.
 *
 * @param {Object} props Properties of the SearchResult component.
 * @returns {ReactElement} The rendered search result.
 */
function SearchResult(props) {
	var post = props.post;

	return _react2.default.createElement(
		_Row.Row,
		props,
		_react2.default.createElement(
			SearchResultLink,
			{ href: post.permalink, onClick: props.onClick },
			_react2.default.createElement(
				SearchResultTitle,
				null,
				post.post_title
			)
		)
	);
}

SearchResult.propTypes = {
	onClick: _propTypes2.default.func.isRequired,
	post: _propTypes2.default.object.isRequired
};

/**
 * Wraps the search results.
 */
var SearchResultsWrapper = _styledComponents2.default.div.withConfig({
	displayName: "SearchResults__SearchResultsWrapper"
})(["margin-top:20px;clear:both;"]);

/**
 * The no results text paragraph.
 */
var NoResults = _styledComponents2.default.p.withConfig({
	displayName: "SearchResults__NoResults"
})(["margin-left:10px;"]);

/**
 * Creates the SearchResults component to render a list of search results.
 *
 * @param {object} props The React props.
 *
 * @returns {ReactElement} The SearchResults component.
 */

var SearchResults = function (_React$Component) {
	_inherits(SearchResults, _React$Component);

	/**
  * Constructs the component and sets its initial state.
  *
  * @param {Object} props The props to use for this component.
  *
  * @constructor
  */
	function SearchResults(props) {
		_classCallCheck(this, SearchResults);

		var _this = _possibleConstructorReturn(this, (SearchResults.__proto__ || Object.getPrototypeOf(SearchResults)).call(this, props));

		_this.state = {
			results: props.results
		};
		return _this;
	}

	/**
  * Handles the situation that there are zero results.
  *
  * @returns {ReactElement|null} A message stating that no results were found or null if no search term was provided.
  */


	_createClass(SearchResults, [{
		key: "handleZeroResults",
		value: function handleZeroResults() {
			if (this.props.searchString !== "") {
				return this.renderNoResultsFound();
			}

			return null;
		}

		/**
   * Renders a no results found text.
   *
   * @returns {ReactElement} The no results found text.
   */

	}, {
		key: "renderNoResultsFound",
		value: function renderNoResultsFound() {
			var noResultsText = (0, _i18n.__)("No results found.", "yoast-components");

			(0, _a11y.speak)(noResultsText);

			return _react2.default.createElement(
				NoResults,
				null,
				noResultsText
			);
		}

		/**
   * Maps the results to SearchResult components.
   *
   * @param {Object} results The results returned by Algolia.
   *
   * @returns {Array} Array containing the mapped search results.
   */

	}, {
		key: "resultsToSearchItem",
		value: function resultsToSearchItem(results) {
			var _this2 = this;

			return results.map(function (result, index) {
				return _react2.default.createElement(SearchResult, {
					rowHeight: "32px",
					key: result.objectID,
					post: result
					// Note: this passes the onClick but actually also attaches a click event on the LI element.
					, onClick: function onClick(event) {
						event.preventDefault();
						event.stopPropagation();
						_this2.props.onClick(index);
					}
				});
			});
		}

		/**
   * Renders the search results list.
   *
   * @returns {ReactElement} Either returns the search results, or a message that no results were found.
   */

	}, {
		key: "render",
		value: function render() {
			var resultsCount = this.props.results.length;

			// Check whether no results are returned.
			if (resultsCount <= 0) {
				return this.handleZeroResults();
			}

			var foundResultsText = (0, _i18n.sprintf)((0, _i18n.__)("Number of results found: %d", "yoast-components"), resultsCount);

			(0, _a11y.speak)(foundResultsText);

			return _react2.default.createElement(
				SearchResultsWrapper,
				null,
				_react2.default.createElement(
					"h2",
					{ className: "screen-reader-text" },
					(0, _i18n.__)("Search results", "yoast-components")
				),
				_react2.default.createElement(
					_ListTable.ZebrafiedListTable,
					null,
					this.resultsToSearchItem(this.props.results)
				)
			);
		}
	}]);

	return SearchResults;
}(_react2.default.Component);

SearchResults.propTypes = {
	onClick: _propTypes2.default.func.isRequired,
	searchString: _propTypes2.default.string,
	results: _propTypes2.default.array
};

SearchResults.defaultProps = {
	searchString: "",
	results: []
};

exports.default = SearchResults;

/***/ }),

/***/ 502:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ZebrafiedListTable = exports.ListTable = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.makeFullWidth = makeFullWidth;

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _styledComponents = __webpack_require__(2);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _colors = __webpack_require__(4);

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var List = _styledComponents2.default.ul.withConfig({
	displayName: "ListTable__List"
})(["margin:0;padding:0;list-style:none;position:relative;width:100%;li:first-child{& > span::before{left:auto;}}"]);

List.propTypes = {
	children: _propTypes2.default.any
};

/**
 * Makes an element full-width in the mobile responsive view.
 *
 * @param {ReactElement} component The original element.
 * @returns {ReactElement} The element with full width responsive style.
 */
function makeFullWidth(component) {
	return (0, _styledComponents2.default)(component).withConfig({
		displayName: "ListTable"
	})(["@media screen and ( max-width:800px ){min-width:100%;margin-top:1em;padding-right:0;padding-left:0;}"]);
}

/**
 * Creates a list table component.
 */

var ListTable = function (_React$Component) {
	_inherits(ListTable, _React$Component);

	/**
  * Constructor for the component.
  *
  * @param {Object} props The props to assign to the current component.
  *
  * @constructor
  */
	function ListTable(props) {
		_classCallCheck(this, ListTable);

		return _possibleConstructorReturn(this, (ListTable.__proto__ || Object.getPrototypeOf(ListTable)).call(this, props));
	}

	/**
  * Retrieves the child nodes of the ListTable and ensures that single results are wrapped in an array.
  *
  * @returns {Array} The children to use within the ListTable.
  */


	_createClass(ListTable, [{
		key: "getChildren",
		value: function getChildren() {
			if (this.props.children === 1) {
				return [this.props.children];
			}

			return this.props.children;
		}

		/**
   * Renders the ListTable.
   *
   * @returns {ReactElement} The ListTable component.
   */

	}, {
		key: "render",
		value: function render() {
			var children = this.getChildren();

			return _react2.default.createElement(
				List,
				{ role: "list" },
				children
			);
		}
	}]);

	return ListTable;
}(_react2.default.Component);

/**
 * A zebrafied variant of the ListTable component.
 */


var ZebrafiedListTable = function (_ListTable) {
	_inherits(ZebrafiedListTable, _ListTable);

	/**
  * Constructor for the component. Also makes a shadow copy of the props that we can manipulate.
  * @param {Object} props The props to assign to the current component.
  *
  * @constructor
  */
	function ZebrafiedListTable(props) {
		_classCallCheck(this, ZebrafiedListTable);

		var _this2 = _possibleConstructorReturn(this, (ZebrafiedListTable.__proto__ || Object.getPrototypeOf(ZebrafiedListTable)).call(this, props));

		_this2.zebraProps = Object.assign({}, props);
		return _this2;
	}

	/**
  * Zebrafies the child items of the ListTable.
  *
  * @returns {Array} Array containing the zebrafied rows.
  */


	_createClass(ZebrafiedListTable, [{
		key: "zebrafyChildren",
		value: function zebrafyChildren() {
			var children = this.props.children;

			// If there is only one child, there is no array, meaning there is no map method.
			if (!this.props.children.map) {
				children = [children];
			}

			this.zebraProps.children = children.map(function (child, index) {
				return _react2.default.cloneElement(child, {
					background: index % 2 === 1 ? _colors2.default.$color_white : _colors2.default.$color_background_light,
					key: index
				});
			});
		}

		/**
   * Renders the zebrafied ListTable.
   *
   * @returns {ReactElement} The zebrafied ListTable.
   */

	}, {
		key: "render",
		value: function render() {
			this.zebrafyChildren();

			return _react2.default.createElement(List, _extends({ role: "list" }, this.zebraProps));
		}
	}]);

	return ZebrafiedListTable;
}(ListTable);

ListTable.propTypes = {
	children: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.node), _propTypes2.default.node])
};

exports.ListTable = ListTable;
exports.ZebrafiedListTable = ZebrafiedListTable;

/***/ }),

/***/ 503:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.RowResponsiveWrap = exports.Row = undefined;

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__(2);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _colors = __webpack_require__(4);

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// The Rows are flex containers.
var Row = exports.Row = _styledComponents2.default.li.withConfig({
	displayName: "Row"
})(["background:", ";display:flex;min-height:", ";align-items:center;justify-content:space-between;"], function (props) {
	return props.background;
}, function (props) {
	return props.rowHeight;
});

Row.propTypes = {
	background: _propTypes2.default.string,
	hasHeaderLabels: _propTypes2.default.bool,
	rowHeight: _propTypes2.default.string
};

Row.defaultProps = {
	background: _colors2.default.$color_white,
	hasHeaderLabels: true
};

/*
 * A row with responsive wrap allows children to wrap in new lines in the responsive view.
 * If the columns have headers, they're displayed as labels inside the column
 * content.
 */
var RowResponsiveWrap = exports.RowResponsiveWrap = (0, _styledComponents2.default)(Row).withConfig({
	displayName: "Row__RowResponsiveWrap"
})(["@media screen and ( max-width:800px ){flex-wrap:wrap;align-items:flex-start;&:first-child{margin-top:", ";}& > span::before{position:static;display:inline-block;padding-right:0.5em;font-size:inherit;}& > span{padding-left:0;}}"], function (props) {
	return props.hasHeaderLabels ? "24px" : "0";
});

/***/ }),

/***/ 504:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.HelpCenterContainer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__(2);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _i18n = __webpack_require__(9);

var _HelpCenterButton = __webpack_require__(505);

var _Paper = __webpack_require__(506);

var _Paper2 = _interopRequireDefault(_Paper);

var _colors = __webpack_require__(4);

var _colors2 = _interopRequireDefault(_colors);

var _YoastTabs = __webpack_require__(507);

var _YoastTabs2 = _interopRequireDefault(_YoastTabs);

var _responsiveBreakpoints = __webpack_require__(95);

var _responsiveBreakpoints2 = _interopRequireDefault(_responsiveBreakpoints);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* External dependencies */


/* Internal dependencies */


var HelpCenterContainer = exports.HelpCenterContainer = _styledComponents2.default.div.withConfig({
	displayName: "HelpCenter__HelpCenterContainer"
})(["margin:0;@media screen and ( max-width:", " ){margin:0 0 1em;}"], _responsiveBreakpoints2.default.mobile);

var HelpCenterPaper = (0, _styledComponents2.default)(_Paper2.default).withConfig({
	displayName: "HelpCenter__HelpCenterPaper"
})(["margin-top:16px;"]);

/**
 * Returns the HelpCenter component.
 *
 * @param {Object} props The props to use for the component.
 *
 * @returns {ReactElement} The HelpCenter component.
 */

var HelpCenter = function (_React$Component) {
	_inherits(HelpCenter, _React$Component);

	/**
  * Constructor for the component.
  *
  * @param {Object} props The props to assign to the current component.
  *
  * @constructor
  */
	function HelpCenter(props) {
		_classCallCheck(this, HelpCenter);

		var _this = _possibleConstructorReturn(this, (HelpCenter.__proto__ || Object.getPrototypeOf(HelpCenter)).call(this, props));

		_this.state = {
			isExpanded: false
		};
		return _this;
	}

	/**
  * Handles the onButtonClick event.
  *
  * @returns {void}
  */


	_createClass(HelpCenter, [{
		key: "onButtonClick",
		value: function onButtonClick() {
			var _this2 = this;

			this.setState({ isExpanded: !this.state.isExpanded }, function () {
				if (_this2.props.onHelpCenterToggle) {
					_this2.props.onHelpCenterToggle(_this2.state.isExpanded);
				}
			});
		}

		/**
   * Renders the HelpCenter.
   *
   * @returns {ReactElement} The HelpCenter component.
   */

	}, {
		key: "render",
		value: function render() {
			return _react2.default.createElement(
				HelpCenterContainer,
				{
					className: "" + this.props.className },
				_react2.default.createElement(
					_HelpCenterButton.HelpCenterButton,
					{
						className: this.props.className + "__button",
						onClick: this.onButtonClick.bind(this),
						isExpanded: this.state.isExpanded,
						backgroundColor: this.props.buttonBackgroundColor,
						textColor: this.props.buttonTextColor,
						iconColor: this.props.buttonIconColor,
						withTextShadow: this.props.buttonWithTextShadow
					},
					(0, _i18n.__)("Need help?", "yoast-components")
				),
				this.state.isExpanded && _react2.default.createElement(
					HelpCenterPaper,
					{ minHeight: "432px" },
					_react2.default.createElement(_YoastTabs2.default, {
						items: this.props.items,
						tabsTextColor: this.props.tabsTextColor,
						tabsTextTransform: this.props.tabsTextTransform,
						tabsFontSize: this.props.tabsFontSize,
						tabsFontWeight: this.props.tabsFontWeight,
						tabsBaseWidth: this.props.tabsBaseWidth,
						onTabSelect: this.props.onTabSelect,
						onTabsMounted: this.props.onTabsMounted
					})
				)
			);
		}
	}]);

	return HelpCenter;
}(_react2.default.Component);

HelpCenter.propTypes = {
	className: _propTypes2.default.string,
	items: _propTypes2.default.array.isRequired,
	buttonBackgroundColor: _propTypes2.default.string,
	buttonTextColor: _propTypes2.default.string,
	buttonIconColor: _propTypes2.default.string,
	buttonWithTextShadow: _propTypes2.default.bool,
	tabsTextColor: _propTypes2.default.string,
	tabsTextTransform: _propTypes2.default.string,
	tabsFontSize: _propTypes2.default.string,
	tabsFontWeight: _propTypes2.default.string,
	tabsBaseWidth: _propTypes2.default.string,
	onHelpCenterToggle: _propTypes2.default.func,
	onTabSelect: _propTypes2.default.func,
	onTabsMounted: _propTypes2.default.func
};

HelpCenter.defaultProps = {
	buttonBackgroundColor: _colors2.default.$color_green_medium_light,
	buttonTextColor: _colors2.default.$color_white,
	buttonIconColor: _colors2.default.$color_white,
	buttonWithTextShadow: true,
	tabsTextColor: _colors2.default.$color_grey_dark,
	tabsTextTransform: "none",
	tabsFontSize: "1.5em",
	tabsFontWeight: "200",
	tabsBaseWidth: "200px",
	className: "yoast-help-center"
};

exports.default = HelpCenter;

/***/ }),

/***/ 505:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.HelpCenterButton = undefined;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__(2);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _colors = __webpack_require__(4);

var _colors2 = _interopRequireDefault(_colors);

var _YoastButton = __webpack_require__(69);

var _SvgIcon = __webpack_require__(27);

var _SvgIcon2 = _interopRequireDefault(_SvgIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns an icon button that can optionally contain text.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} styled icon button.
 */
var HelpCenterButtonBase = function HelpCenterButtonBase(props) {
	return _react2.default.createElement(
		_YoastButton.YoastButton,
		props,
		_react2.default.createElement(_SvgIcon2.default, { icon: "question-circle", color: props.iconColor }),
		props.children,
		_react2.default.createElement(_SvgIcon2.default, { icon: props.isExpanded ? "angle-up" : "angle-down", color: props.iconColor })
	);
};

var HelpCenterButton = exports.HelpCenterButton = (0, _styledComponents2.default)(HelpCenterButtonBase).withConfig({
	displayName: "HelpCenterButton"
})(["display:flex;margin:0;min-width:0;padding:0 2px;min-height:32px;svg{margin:0 16px;}"]);

HelpCenterButtonBase.propTypes = {
	iconColor: _propTypes2.default.string,
	isExpanded: _propTypes2.default.bool,
	children: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.node), _propTypes2.default.node])
};

HelpCenterButtonBase.defaultProps = {
	iconColor: _colors2.default.$color_white,
	isExpanded: false
};

/***/ }),

/***/ 506:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__(2);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _colors = __webpack_require__(4);

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Returns a Div with a paper style.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} The paper-styled div.
 */
var Paper = _styledComponents2.default.div.withConfig({
	displayName: "Paper"
})(["box-shadow:0 1px 2px rgba(0,0,0,0.2);background-color:", ";min-height:", ";"], function (props) {
	return props.backgroundColor;
}, function (props) {
	return props.minHeight;
});

Paper.propTypes = {
	backgroundColor: _propTypes2.default.string,
	minHeight: _propTypes2.default.string
};

Paper.defaultProps = {
	backgroundColor: _colors2.default.$color_white,
	minHeight: "0"
};

exports.default = Paper;

/***/ }),

/***/ 507:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _styledComponents = __webpack_require__(2);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactTabs = __webpack_require__(508);

var _colors = __webpack_require__(4);

var _colors2 = _interopRequireDefault(_colors);

var _responsiveBreakpoints = __webpack_require__(95);

var _responsiveBreakpoints2 = _interopRequireDefault(_responsiveBreakpoints);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var YoastTabsContainer = _styledComponents2.default.div.withConfig({
	displayName: "YoastTabs__YoastTabsContainer"
})(["font-size:1em;.react-tabs__tab-list{display:flex;flex-wrap:wrap;justify-content:center;list-style:none;padding:0;margin:0;border-bottom:4px solid ", ";}.react-tabs__tab{flex:0 1 ", ";text-align:center;margin:0 16px;padding:16px 0;cursor:pointer;font-family:\"Open Sans\",sans-serif;font-size:", ";line-height:1.33333333;font-weight:", ";color:", ";text-transform:", ";&.react-tabs__tab--selected{box-shadow:0 4px 0 0 ", ";}}.react-tabs__tab-panel{display:none;padding:24px 40px;@media screen and ( max-width:", " ){padding:16px 16px;}:focus{outline:none;}&.react-tabs__tab-panel--selected{display:block;}}"], _colors2.default.$color_grey_light, function (props) {
	return props.tabsBaseWidth;
}, function (props) {
	return props.tabsFontSize;
}, function (props) {
	return props.tabsFontWeight;
}, function (props) {
	return props.tabsTextColor;
}, function (props) {
	return props.tabsTextTransform;
}, _colors2.default.$color_pink_dark, _responsiveBreakpoints2.default.mobile);

YoastTabsContainer.propTypes = {
	tabsTextColor: _propTypes2.default.string,
	tabsTextTransform: _propTypes2.default.string,
	tabsFontSize: _propTypes2.default.string,
	tabsFontWeight: _propTypes2.default.string,
	tabsBaseWidth: _propTypes2.default.string
};

/**
 * Creates a Yoast styled ARIA tabs widget.
 */

var YoastTabs = function (_React$Component) {
	_inherits(YoastTabs, _React$Component);

	function YoastTabs() {
		_classCallCheck(this, YoastTabs);

		return _possibleConstructorReturn(this, (YoastTabs.__proto__ || Object.getPrototypeOf(YoastTabs)).apply(this, arguments));
	}

	_createClass(YoastTabs, [{
		key: "getTabs",

		/**
   * Gets all the defined tabs and returns an array of Tab components.
   *
   * @returns {Array} Array containing a Tab component for each item in the props.
   */
		value: function getTabs() {
			return this.props.items.map(function (item) {
				return _react2.default.createElement(
					_reactTabs.Tab,
					{ key: item.id },
					item.label
				);
			});
		}

		/**
   * Gets all the defined tabpanels and returns an array of TabPanel components.
   *
   * @returns {Array} Array containing a Tabpanel component for each item in the props.
   */

	}, {
		key: "getTabPanels",
		value: function getTabPanels() {
			return this.props.items.map(function (item) {
				return _react2.default.createElement(
					_reactTabs.TabPanel,
					{
						key: item.id,
						tabIndex: "0" },
					item.content
				);
			});
		}

		/**
   * Renders the ARIA tabs widget.
   *
   * @returns {ReactElement} The ARIA tabs widget.
   */

	}, {
		key: "render",
		value: function render() {
			return _react2.default.createElement(
				YoastTabsContainer,
				{
					tabsTextColor: this.props.tabsTextColor,
					tabsTextTransform: this.props.tabsTextTransform,
					tabsFontSize: this.props.tabsFontSize,
					tabsFontWeight: this.props.tabsFontWeight,
					tabsBaseWidth: this.props.tabsBaseWidth
				},
				_react2.default.createElement(
					_reactTabs.Tabs,
					{ onSelect: this.props.onTabSelect },
					_react2.default.createElement(
						_reactTabs.TabList,
						null,
						this.getTabs()
					),
					this.getTabPanels()
				)
			);
		}

		/**
   * Calls a callback after this component has been mounted.
   *
   * @returns {void}
   */

	}, {
		key: "componentDidMount",
		value: function componentDidMount() {
			this.props.onTabsMounted();
		}
	}]);

	return YoastTabs;
}(_react2.default.Component);

YoastTabs.propTypes = {
	items: _propTypes2.default.arrayOf(_propTypes2.default.shape({
		id: _propTypes2.default.string.isRequired,
		label: _propTypes2.default.string.isRequired,
		content: _propTypes2.default.object.isRequired
	})),
	tabsTextColor: _propTypes2.default.string,
	tabsTextTransform: _propTypes2.default.string,
	tabsFontSize: _propTypes2.default.string,
	tabsFontWeight: _propTypes2.default.string,
	tabsBaseWidth: _propTypes2.default.string,
	onTabSelect: _propTypes2.default.func,
	onTabsMounted: _propTypes2.default.func
};

YoastTabs.defaultProps = {
	items: [],
	tabsTextColor: _colors2.default.$color_grey_dark,
	tabsTextTransform: "none",
	tabsFontSize: "1.5em",
	tabsFontWeight: "200",
	tabsBaseWidth: "200px",
	onTabsMounted: function onTabsMounted() {}
};

exports.default = YoastTabs;

/***/ }),

/***/ 508:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Tabs__ = __webpack_require__(509);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Tabs", function() { return __WEBPACK_IMPORTED_MODULE_0__components_Tabs__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_TabList__ = __webpack_require__(511);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "TabList", function() { return __WEBPACK_IMPORTED_MODULE_1__components_TabList__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_Tab__ = __webpack_require__(512);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Tab", function() { return __WEBPACK_IMPORTED_MODULE_2__components_Tab__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_TabPanel__ = __webpack_require__(513);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "TabPanel", function() { return __WEBPACK_IMPORTED_MODULE_3__components_TabPanel__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__helpers_uuid__ = __webpack_require__(246);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "resetIdCounter", function() { return __WEBPACK_IMPORTED_MODULE_4__helpers_uuid__["b"]; });






/***/ }),

/***/ 509:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Tabs; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__helpers_propTypes__ = __webpack_require__(245);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__UncontrolledTabs__ = __webpack_require__(510);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__helpers_count__ = __webpack_require__(247);
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }







var Tabs =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(Tabs, _Component);

  function Tabs(props) {
    var _this;

    _this = _Component.call(this, props) || this;

    _this.handleSelected = function (index, last, event) {
      // Call change event handler
      if (typeof _this.props.onSelect === 'function') {
        // Check if the change event handler cancels the tab change
        if (_this.props.onSelect(index, last, event) === false) return;
      }

      var state = {
        // Set focus if the change was triggered from the keyboard
        focus: event.type === 'keydown'
      };

      if (Tabs.inUncontrolledMode(_this.props)) {
        // Update selected index
        state.selectedIndex = index;
      }

      _this.setState(state);
    };

    _this.state = Tabs.copyPropsToState(_this.props, {}, _this.props.defaultFocus);
    return _this;
  }

  var _proto = Tabs.prototype;

  _proto.componentWillReceiveProps = function componentWillReceiveProps(newProps) {
    if (false) {
      throw new Error("Switching between controlled mode (by using `selectedIndex`) and uncontrolled mode is not supported in `Tabs`.\nFor more information about controlled and uncontrolled mode of react-tabs see the README.");
    } // Use a transactional update to prevent race conditions
    // when reading the state in copyPropsToState
    // See https://github.com/reactjs/react-tabs/issues/51


    this.setState(function (state) {
      return Tabs.copyPropsToState(newProps, state);
    });
  };

  Tabs.inUncontrolledMode = function inUncontrolledMode(props) {
    return props.selectedIndex === null;
  };

  // preserve the existing selectedIndex from state.
  // If the state has not selectedIndex, default to the defaultIndex or 0
  Tabs.copyPropsToState = function copyPropsToState(props, state, focus) {
    if (focus === void 0) {
      focus = false;
    }

    var newState = {
      focus: focus
    };

    if (Tabs.inUncontrolledMode(props)) {
      var maxTabIndex = Object(__WEBPACK_IMPORTED_MODULE_4__helpers_count__["b" /* getTabsCount */])(props.children) - 1;
      var selectedIndex = null;

      if (state.selectedIndex != null) {
        selectedIndex = Math.min(state.selectedIndex, maxTabIndex);
      } else {
        selectedIndex = props.defaultIndex || 0;
      }

      newState.selectedIndex = selectedIndex;
    }

    return newState;
  };

  _proto.render = function render() {
    var _props = this.props,
        children = _props.children,
        defaultIndex = _props.defaultIndex,
        defaultFocus = _props.defaultFocus,
        props = _objectWithoutProperties(_props, ["children", "defaultIndex", "defaultFocus"]);

    props.focus = this.state.focus;
    props.onSelect = this.handleSelected;

    if (this.state.selectedIndex != null) {
      props.selectedIndex = this.state.selectedIndex;
    }

    return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__UncontrolledTabs__["a" /* default */], props, children);
  };

  return Tabs;
}(__WEBPACK_IMPORTED_MODULE_1_react__["Component"]);

Tabs.defaultProps = {
  defaultFocus: false,
  forceRenderTabPanel: false,
  selectedIndex: null,
  defaultIndex: null
};

Tabs.propTypes =  false ? {
  children: childrenPropType,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  defaultFocus: PropTypes.bool,
  defaultIndex: PropTypes.number,
  disabledTabClassName: PropTypes.string,
  domRef: PropTypes.func,
  forceRenderTabPanel: PropTypes.bool,
  onSelect: onSelectPropType,
  selectedIndex: selectedIndexPropType,
  selectedTabClassName: PropTypes.string,
  selectedTabPanelClassName: PropTypes.string
} : {};
Tabs.tabsRole = 'Tabs';

/***/ }),

/***/ 51:
/***/ (function(module, exports, __webpack_require__) {

var foreach = __webpack_require__(50);

module.exports = function map(arr, fn) {
  var newArr = [];
  foreach(arr, function(item, itemIndex) {
    newArr.push(fn(item, itemIndex, arr));
  });
  return newArr;
};


/***/ }),

/***/ 510:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UncontrolledTabs; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_classnames__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__helpers_uuid__ = __webpack_require__(246);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__helpers_propTypes__ = __webpack_require__(245);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__helpers_count__ = __webpack_require__(247);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__helpers_childrenDeepMap__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__helpers_elementTypes__ = __webpack_require__(112);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }








 // Determine if a node from event.target is a Tab element

function isTabNode(node) {
  return 'getAttribute' in node && node.getAttribute('role') === 'tab';
} // Determine if a tab node is disabled


function isTabDisabled(node) {
  return node.getAttribute('aria-disabled') === 'true';
}

var canUseActiveElement;

try {
  canUseActiveElement = !!(typeof window !== 'undefined' && window.document && window.document.activeElement);
} catch (e) {
  // Work around for IE bug when accessing document.activeElement in an iframe
  // Refer to the following resources:
  // http://stackoverflow.com/a/10982960/369687
  // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12733599
  canUseActiveElement = false;
}

var UncontrolledTabs =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(UncontrolledTabs, _Component);

  function UncontrolledTabs() {
    var _temp, _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (_temp = _this = _Component.call.apply(_Component, [this].concat(args)) || this, _this.tabNodes = [], _this.handleKeyDown = function (e) {
      if (_this.isTabFromContainer(e.target)) {
        var index = _this.props.selectedIndex;
        var preventDefault = false;
        var useSelectedIndex = false;

        if (e.keyCode === 32 || e.keyCode === 13) {
          preventDefault = true;
          useSelectedIndex = false;

          _this.handleClick(e);
        }

        if (e.keyCode === 37 || e.keyCode === 38) {
          // Select next tab to the left
          index = _this.getPrevTab(index);
          preventDefault = true;
          useSelectedIndex = true;
        } else if (e.keyCode === 39 || e.keyCode === 40) {
          // Select next tab to the right
          index = _this.getNextTab(index);
          preventDefault = true;
          useSelectedIndex = true;
        } // This prevents scrollbars from moving around


        if (preventDefault) {
          e.preventDefault();
        } // Only use the selected index in the state if we're not using the tabbed index


        if (useSelectedIndex) {
          _this.setSelected(index, e);
        }
      }
    }, _this.handleClick = function (e) {
      var node = e.target; // eslint-disable-next-line no-cond-assign

      do {
        if (_this.isTabFromContainer(node)) {
          if (isTabDisabled(node)) {
            return;
          }

          var index = [].slice.call(node.parentNode.children).filter(isTabNode).indexOf(node);

          _this.setSelected(index, e);

          return;
        }
      } while ((node = node.parentNode) !== null);
    }, _temp) || _assertThisInitialized(_this);
  }

  var _proto = UncontrolledTabs.prototype;

  _proto.setSelected = function setSelected(index, event) {
    // Check index boundary
    if (index < 0 || index >= this.getTabsCount()) return; // Call change event handler

    this.props.onSelect(index, this.props.selectedIndex, event);
  };

  _proto.getNextTab = function getNextTab(index) {
    var count = this.getTabsCount(); // Look for non-disabled tab from index to the last tab on the right

    for (var i = index + 1; i < count; i++) {
      if (!isTabDisabled(this.getTab(i))) {
        return i;
      }
    } // If no tab found, continue searching from first on left to index


    for (var _i = 0; _i < index; _i++) {
      if (!isTabDisabled(this.getTab(_i))) {
        return _i;
      }
    } // No tabs are disabled, return index


    return index;
  };

  _proto.getPrevTab = function getPrevTab(index) {
    var i = index; // Look for non-disabled tab from index to first tab on the left

    while (i--) {
      if (!isTabDisabled(this.getTab(i))) {
        return i;
      }
    } // If no tab found, continue searching from last tab on right to index


    i = this.getTabsCount();

    while (i-- > index) {
      if (!isTabDisabled(this.getTab(i))) {
        return i;
      }
    } // No tabs are disabled, return index


    return index;
  };

  _proto.getTabsCount = function getTabsCount() {
    return Object(__WEBPACK_IMPORTED_MODULE_5__helpers_count__["b" /* getTabsCount */])(this.props.children);
  };

  _proto.getPanelsCount = function getPanelsCount() {
    return Object(__WEBPACK_IMPORTED_MODULE_5__helpers_count__["a" /* getPanelsCount */])(this.props.children);
  };

  _proto.getTab = function getTab(index) {
    return this.tabNodes["tabs-" + index];
  };

  _proto.getChildren = function getChildren() {
    var _this2 = this;

    var index = 0;
    var _props = this.props,
        children = _props.children,
        disabledTabClassName = _props.disabledTabClassName,
        focus = _props.focus,
        forceRenderTabPanel = _props.forceRenderTabPanel,
        selectedIndex = _props.selectedIndex,
        selectedTabClassName = _props.selectedTabClassName,
        selectedTabPanelClassName = _props.selectedTabPanelClassName;
    this.tabIds = this.tabIds || [];
    this.panelIds = this.panelIds || [];
    var diff = this.tabIds.length - this.getTabsCount(); // Add ids if new tabs have been added
    // Don't bother removing ids, just keep them in case they are added again
    // This is more efficient, and keeps the uuid counter under control

    while (diff++ < 0) {
      this.tabIds.push(Object(__WEBPACK_IMPORTED_MODULE_3__helpers_uuid__["a" /* default */])());
      this.panelIds.push(Object(__WEBPACK_IMPORTED_MODULE_3__helpers_uuid__["a" /* default */])());
    } // Map children to dynamically setup refs


    return Object(__WEBPACK_IMPORTED_MODULE_6__helpers_childrenDeepMap__["b" /* deepMap */])(children, function (child) {
      var result = child; // Clone TabList and Tab components to have refs

      if (Object(__WEBPACK_IMPORTED_MODULE_7__helpers_elementTypes__["b" /* isTabList */])(child)) {
        var listIndex = 0; // Figure out if the current focus in the DOM is set on a Tab
        // If it is we should keep the focus on the next selected tab

        var wasTabFocused = false;

        if (canUseActiveElement) {
          wasTabFocused = __WEBPACK_IMPORTED_MODULE_1_react___default.a.Children.toArray(child.props.children).filter(__WEBPACK_IMPORTED_MODULE_7__helpers_elementTypes__["a" /* isTab */]).some(function (tab, i) {
            return document.activeElement === _this2.getTab(i);
          });
        }

        result = Object(__WEBPACK_IMPORTED_MODULE_1_react__["cloneElement"])(child, {
          children: Object(__WEBPACK_IMPORTED_MODULE_6__helpers_childrenDeepMap__["b" /* deepMap */])(child.props.children, function (tab) {
            var key = "tabs-" + listIndex;
            var selected = selectedIndex === listIndex;
            var props = {
              tabRef: function tabRef(node) {
                _this2.tabNodes[key] = node;
              },
              id: _this2.tabIds[listIndex],
              panelId: _this2.panelIds[listIndex],
              selected: selected,
              focus: selected && (focus || wasTabFocused)
            };
            if (selectedTabClassName) props.selectedClassName = selectedTabClassName;
            if (disabledTabClassName) props.disabledClassName = disabledTabClassName;
            listIndex++;
            return Object(__WEBPACK_IMPORTED_MODULE_1_react__["cloneElement"])(tab, props);
          })
        });
      } else if (Object(__WEBPACK_IMPORTED_MODULE_7__helpers_elementTypes__["c" /* isTabPanel */])(child)) {
        var props = {
          id: _this2.panelIds[index],
          tabId: _this2.tabIds[index],
          selected: selectedIndex === index
        };
        if (forceRenderTabPanel) props.forceRender = forceRenderTabPanel;
        if (selectedTabPanelClassName) props.selectedClassName = selectedTabPanelClassName;
        index++;
        result = Object(__WEBPACK_IMPORTED_MODULE_1_react__["cloneElement"])(child, props);
      }

      return result;
    });
  };

  /**
   * Determine if a node from event.target is a Tab element for the current Tabs container.
   * If the clicked element is not a Tab, it returns false.
   * If it finds another Tabs container between the Tab and `this`, it returns false.
   */
  _proto.isTabFromContainer = function isTabFromContainer(node) {
    // return immediately if the clicked element is not a Tab.
    if (!isTabNode(node)) {
      return false;
    } // Check if the first occurrence of a Tabs container is `this` one.


    var nodeAncestor = node.parentElement;

    do {
      if (nodeAncestor === this.node) return true;else if (nodeAncestor.getAttribute('data-tabs')) break;
      nodeAncestor = nodeAncestor.parentElement;
    } while (nodeAncestor);

    return false;
  };

  _proto.render = function render() {
    var _this3 = this;

    // Delete all known props, so they don't get added to DOM
    var _props2 = this.props,
        children = _props2.children,
        className = _props2.className,
        disabledTabClassName = _props2.disabledTabClassName,
        domRef = _props2.domRef,
        focus = _props2.focus,
        forceRenderTabPanel = _props2.forceRenderTabPanel,
        onSelect = _props2.onSelect,
        selectedIndex = _props2.selectedIndex,
        selectedTabClassName = _props2.selectedTabClassName,
        selectedTabPanelClassName = _props2.selectedTabPanelClassName,
        attributes = _objectWithoutProperties(_props2, ["children", "className", "disabledTabClassName", "domRef", "focus", "forceRenderTabPanel", "onSelect", "selectedIndex", "selectedTabClassName", "selectedTabPanelClassName"]);

    return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement("div", _extends({}, attributes, {
      className: __WEBPACK_IMPORTED_MODULE_2_classnames___default()(className),
      onClick: this.handleClick,
      onKeyDown: this.handleKeyDown,
      ref: function ref(node) {
        _this3.node = node;
        if (domRef) domRef(node);
      },
      "data-tabs": true
    }), this.getChildren());
  };

  return UncontrolledTabs;
}(__WEBPACK_IMPORTED_MODULE_1_react__["Component"]);

UncontrolledTabs.defaultProps = {
  className: 'react-tabs',
  focus: false
};

UncontrolledTabs.propTypes =  false ? {
  children: childrenPropType,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  disabledTabClassName: PropTypes.string,
  domRef: PropTypes.func,
  focus: PropTypes.bool,
  forceRenderTabPanel: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  selectedIndex: PropTypes.number.isRequired,
  selectedTabClassName: PropTypes.string,
  selectedTabPanelClassName: PropTypes.string
} : {};

/***/ }),

/***/ 511:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabList; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_classnames__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_classnames__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }





var TabList =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(TabList, _Component);

  function TabList() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = TabList.prototype;

  _proto.render = function render() {
    var _props = this.props,
        children = _props.children,
        className = _props.className,
        attributes = _objectWithoutProperties(_props, ["children", "className"]);

    return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement("ul", _extends({}, attributes, {
      className: __WEBPACK_IMPORTED_MODULE_2_classnames___default()(className),
      role: "tablist"
    }), children);
  };

  return TabList;
}(__WEBPACK_IMPORTED_MODULE_1_react__["Component"]);

TabList.defaultProps = {
  className: 'react-tabs__tab-list'
};

TabList.propTypes =  false ? {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object])
} : {};
TabList.tabsRole = 'TabList';

/***/ }),

/***/ 512:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Tab; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_classnames__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_classnames__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }




var DEFAULT_CLASS = 'react-tabs__tab';

var Tab =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(Tab, _Component);

  function Tab() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = Tab.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.checkFocus();
  };

  _proto.componentDidUpdate = function componentDidUpdate() {
    this.checkFocus();
  };

  _proto.checkFocus = function checkFocus() {
    if (this.props.selected && this.props.focus) {
      this.node.focus();
    }
  };

  _proto.render = function render() {
    var _cx,
        _this = this;

    var _props = this.props,
        children = _props.children,
        className = _props.className,
        disabled = _props.disabled,
        disabledClassName = _props.disabledClassName,
        focus = _props.focus,
        id = _props.id,
        panelId = _props.panelId,
        selected = _props.selected,
        selectedClassName = _props.selectedClassName,
        tabIndex = _props.tabIndex,
        tabRef = _props.tabRef,
        attributes = _objectWithoutProperties(_props, ["children", "className", "disabled", "disabledClassName", "focus", "id", "panelId", "selected", "selectedClassName", "tabIndex", "tabRef"]);

    return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement("li", _extends({}, attributes, {
      className: __WEBPACK_IMPORTED_MODULE_2_classnames___default()(className, (_cx = {}, _cx[selectedClassName] = selected, _cx[disabledClassName] = disabled, _cx)),
      ref: function ref(node) {
        _this.node = node;
        if (tabRef) tabRef(node);
      },
      role: "tab",
      id: id,
      "aria-selected": selected ? 'true' : 'false',
      "aria-disabled": disabled ? 'true' : 'false',
      "aria-controls": panelId,
      tabIndex: tabIndex || (selected ? '0' : null)
    }), children);
  };

  return Tab;
}(__WEBPACK_IMPORTED_MODULE_1_react__["Component"]);

Tab.defaultProps = {
  className: DEFAULT_CLASS,
  disabledClassName: DEFAULT_CLASS + "--disabled",
  focus: false,
  id: null,
  panelId: null,
  selected: false,
  selectedClassName: DEFAULT_CLASS + "--selected"
};

Tab.propTypes =  false ? {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  disabled: PropTypes.bool,
  tabIndex: PropTypes.string,
  disabledClassName: PropTypes.string,
  focus: PropTypes.bool,
  // private
  id: PropTypes.string,
  // private
  panelId: PropTypes.string,
  // private
  selected: PropTypes.bool,
  // private
  selectedClassName: PropTypes.string,
  tabRef: PropTypes.func // private

} : {};
Tab.tabsRole = 'Tab';

/***/ }),

/***/ 513:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabPanel; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_prop_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_classnames__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_classnames__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }




var DEFAULT_CLASS = 'react-tabs__tab-panel';

var TabPanel =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(TabPanel, _Component);

  function TabPanel() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = TabPanel.prototype;

  _proto.render = function render() {
    var _cx;

    var _props = this.props,
        children = _props.children,
        className = _props.className,
        forceRender = _props.forceRender,
        id = _props.id,
        selected = _props.selected,
        selectedClassName = _props.selectedClassName,
        tabId = _props.tabId,
        attributes = _objectWithoutProperties(_props, ["children", "className", "forceRender", "id", "selected", "selectedClassName", "tabId"]);

    return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement("div", _extends({}, attributes, {
      className: __WEBPACK_IMPORTED_MODULE_2_classnames___default()(className, (_cx = {}, _cx[selectedClassName] = selected, _cx)),
      role: "tabpanel",
      id: id,
      "aria-labelledby": tabId
    }), forceRender || selected ? children : null);
  };

  return TabPanel;
}(__WEBPACK_IMPORTED_MODULE_1_react__["Component"]);

TabPanel.defaultProps = {
  className: DEFAULT_CLASS,
  forceRender: false,
  selectedClassName: DEFAULT_CLASS + "--selected"
};

TabPanel.propTypes =  false ? {
  children: PropTypes.node,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
  forceRender: PropTypes.bool,
  id: PropTypes.string,
  // private
  selected: PropTypes.bool,
  // private
  selectedClassName: PropTypes.string,
  tabId: PropTypes.string // private

} : {};
TabPanel.tabsRole = 'TabPanel';

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

/***/ 517:
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

/***/ 525:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addLocaleData", function() { return addLocaleData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "intlShape", function() { return intlShape; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "injectIntl", function() { return injectIntl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defineMessages", function() { return defineMessages; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IntlProvider", function() { return IntlProvider; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormattedDate", function() { return FormattedDate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormattedTime", function() { return FormattedTime; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormattedRelative", function() { return FormattedRelative; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormattedNumber", function() { return FormattedNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormattedPlural", function() { return FormattedPlural; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormattedMessage", function() { return FormattedMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormattedHTMLMessage", function() { return FormattedHTMLMessage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__locale_data_index_js__ = __webpack_require__(1096);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__locale_data_index_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__locale_data_index_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_intl_messageformat__ = __webpack_require__(526);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_intl_messageformat___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_intl_messageformat__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_intl_relativeformat__ = __webpack_require__(1105);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_intl_relativeformat___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_intl_relativeformat__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_prop_types__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_prop_types__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_invariant__ = __webpack_require__(517);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_invariant___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_invariant__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_intl_format_cache__ = __webpack_require__(1112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_intl_format_cache___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_intl_format_cache__);
/*
 * Copyright 2017, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */









// GENERATED FILE
var defaultLocaleData = { "locale": "en", "pluralRuleFunction": function pluralRuleFunction(n, ord) {
    var s = String(n).split("."),
        v0 = !s[1],
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2);if (ord) return n10 == 1 && n100 != 11 ? "one" : n10 == 2 && n100 != 12 ? "two" : n10 == 3 && n100 != 13 ? "few" : "other";return n == 1 && v0 ? "one" : "other";
  }, "fields": { "year": { "displayName": "year", "relative": { "0": "this year", "1": "next year", "-1": "last year" }, "relativeTime": { "future": { "one": "in {0} year", "other": "in {0} years" }, "past": { "one": "{0} year ago", "other": "{0} years ago" } } }, "month": { "displayName": "month", "relative": { "0": "this month", "1": "next month", "-1": "last month" }, "relativeTime": { "future": { "one": "in {0} month", "other": "in {0} months" }, "past": { "one": "{0} month ago", "other": "{0} months ago" } } }, "day": { "displayName": "day", "relative": { "0": "today", "1": "tomorrow", "-1": "yesterday" }, "relativeTime": { "future": { "one": "in {0} day", "other": "in {0} days" }, "past": { "one": "{0} day ago", "other": "{0} days ago" } } }, "hour": { "displayName": "hour", "relative": { "0": "this hour" }, "relativeTime": { "future": { "one": "in {0} hour", "other": "in {0} hours" }, "past": { "one": "{0} hour ago", "other": "{0} hours ago" } } }, "minute": { "displayName": "minute", "relative": { "0": "this minute" }, "relativeTime": { "future": { "one": "in {0} minute", "other": "in {0} minutes" }, "past": { "one": "{0} minute ago", "other": "{0} minutes ago" } } }, "second": { "displayName": "second", "relative": { "0": "now" }, "relativeTime": { "future": { "one": "in {0} second", "other": "in {0} seconds" }, "past": { "one": "{0} second ago", "other": "{0} seconds ago" } } } } };

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

function addLocaleData() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var locales = Array.isArray(data) ? data : [data];

  locales.forEach(function (localeData) {
    if (localeData && localeData.locale) {
      __WEBPACK_IMPORTED_MODULE_1_intl_messageformat___default.a.__addLocaleData(localeData);
      __WEBPACK_IMPORTED_MODULE_2_intl_relativeformat___default.a.__addLocaleData(localeData);
    }
  });
}

function hasLocaleData(locale) {
  var localeParts = (locale || '').split('-');

  while (localeParts.length > 0) {
    if (hasIMFAndIRFLocaleData(localeParts.join('-'))) {
      return true;
    }

    localeParts.pop();
  }

  return false;
}

function hasIMFAndIRFLocaleData(locale) {
  var normalizedLocale = locale && locale.toLowerCase();

  return !!(__WEBPACK_IMPORTED_MODULE_1_intl_messageformat___default.a.__localeData__[normalizedLocale] && __WEBPACK_IMPORTED_MODULE_2_intl_relativeformat___default.a.__localeData__[normalizedLocale]);
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
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



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};









var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var bool = __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.bool;
var number = __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.number;
var string = __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.string;
var func = __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.func;
var object = __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.object;
var oneOf = __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.oneOf;
var shape = __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.shape;
var any = __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.any;
var oneOfType = __WEBPACK_IMPORTED_MODULE_3_prop_types___default.a.oneOfType;

var localeMatcher = oneOf(['best fit', 'lookup']);
var narrowShortLong = oneOf(['narrow', 'short', 'long']);
var numeric2digit = oneOf(['numeric', '2-digit']);
var funcReq = func.isRequired;

var intlConfigPropTypes = {
  locale: string,
  formats: object,
  messages: object,
  textComponent: any,

  defaultLocale: string,
  defaultFormats: object
};

var intlFormatPropTypes = {
  formatDate: funcReq,
  formatTime: funcReq,
  formatRelative: funcReq,
  formatNumber: funcReq,
  formatPlural: funcReq,
  formatMessage: funcReq,
  formatHTMLMessage: funcReq
};

var intlShape = shape(_extends({}, intlConfigPropTypes, intlFormatPropTypes, {
  formatters: object,
  now: funcReq
}));

var messageDescriptorPropTypes = {
  id: string.isRequired,
  description: oneOfType([string, object]),
  defaultMessage: string
};

var dateTimeFormatPropTypes = {
  localeMatcher: localeMatcher,
  formatMatcher: oneOf(['basic', 'best fit']),

  timeZone: string,
  hour12: bool,

  weekday: narrowShortLong,
  era: narrowShortLong,
  year: numeric2digit,
  month: oneOf(['numeric', '2-digit', 'narrow', 'short', 'long']),
  day: numeric2digit,
  hour: numeric2digit,
  minute: numeric2digit,
  second: numeric2digit,
  timeZoneName: oneOf(['short', 'long'])
};

var numberFormatPropTypes = {
  localeMatcher: localeMatcher,

  style: oneOf(['decimal', 'currency', 'percent']),
  currency: string,
  currencyDisplay: oneOf(['symbol', 'code', 'name']),
  useGrouping: bool,

  minimumIntegerDigits: number,
  minimumFractionDigits: number,
  maximumFractionDigits: number,
  minimumSignificantDigits: number,
  maximumSignificantDigits: number
};

var relativeFormatPropTypes = {
  style: oneOf(['best fit', 'numeric']),
  units: oneOf(['second', 'minute', 'hour', 'day', 'month', 'year'])
};

var pluralFormatPropTypes = {
  style: oneOf(['cardinal', 'ordinal'])
};

/*
HTML escaping and shallow-equals implementations are the same as React's
(on purpose.) Therefore, it has the following Copyright and Licensing:

Copyright 2013-2014, Facebook, Inc.
All rights reserved.

This source code is licensed under the BSD-style license found in the LICENSE
file in the root directory of React's source tree.
*/

var intlConfigPropNames = Object.keys(intlConfigPropTypes);

var ESCAPED_CHARS = {
  '&': '&amp;',
  '>': '&gt;',
  '<': '&lt;',
  '"': '&quot;',
  "'": '&#x27;'
};

var UNSAFE_CHARS_REGEX = /[&><"']/g;

function escape(str) {
  return ('' + str).replace(UNSAFE_CHARS_REGEX, function (match) {
    return ESCAPED_CHARS[match];
  });
}

function filterProps(props, whitelist) {
  var defaults$$1 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  return whitelist.reduce(function (filtered, name) {
    if (props.hasOwnProperty(name)) {
      filtered[name] = props[name];
    } else if (defaults$$1.hasOwnProperty(name)) {
      filtered[name] = defaults$$1[name];
    }

    return filtered;
  }, {});
}

function invariantIntlContext() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      intl = _ref.intl;

  __WEBPACK_IMPORTED_MODULE_5_invariant___default()(intl, '[React Intl] Could not find required `intl` object. ' + '<IntlProvider> needs to exist in the component ancestry.');
}

function shallowEquals(objA, objB) {
  if (objA === objB) {
    return true;
  }

  if ((typeof objA === 'undefined' ? 'undefined' : _typeof(objA)) !== 'object' || objA === null || (typeof objB === 'undefined' ? 'undefined' : _typeof(objB)) !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}

function shouldIntlComponentUpdate(_ref2, nextProps, nextState) {
  var props = _ref2.props,
      state = _ref2.state,
      _ref2$context = _ref2.context,
      context = _ref2$context === undefined ? {} : _ref2$context;
  var nextContext = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _context$intl = context.intl,
      intl = _context$intl === undefined ? {} : _context$intl;
  var _nextContext$intl = nextContext.intl,
      nextIntl = _nextContext$intl === undefined ? {} : _nextContext$intl;


  return !shallowEquals(nextProps, props) || !shallowEquals(nextState, state) || !(nextIntl === intl || shallowEquals(filterProps(nextIntl, intlConfigPropNames), filterProps(intl, intlConfigPropNames)));
}

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

// Inspired by react-redux's `connect()` HOC factory function implementation:
// https://github.com/rackt/react-redux

function getDisplayName(Component$$1) {
  return Component$$1.displayName || Component$$1.name || 'Component';
}

function injectIntl(WrappedComponent) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$intlPropName = options.intlPropName,
      intlPropName = _options$intlPropName === undefined ? 'intl' : _options$intlPropName,
      _options$withRef = options.withRef,
      withRef = _options$withRef === undefined ? false : _options$withRef;

  var InjectIntl = function (_Component) {
    inherits(InjectIntl, _Component);

    function InjectIntl(props, context) {
      classCallCheck(this, InjectIntl);

      var _this = possibleConstructorReturn(this, (InjectIntl.__proto__ || Object.getPrototypeOf(InjectIntl)).call(this, props, context));

      invariantIntlContext(context);
      return _this;
    }

    createClass(InjectIntl, [{
      key: 'getWrappedInstance',
      value: function getWrappedInstance() {
        __WEBPACK_IMPORTED_MODULE_5_invariant___default()(withRef, '[React Intl] To access the wrapped instance, ' + 'the `{withRef: true}` option must be set when calling: ' + '`injectIntl()`');

        return this.refs.wrappedInstance;
      }
    }, {
      key: 'render',
      value: function render() {
        return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(WrappedComponent, _extends({}, this.props, defineProperty({}, intlPropName, this.context.intl), {
          ref: withRef ? 'wrappedInstance' : null
        }));
      }
    }]);
    return InjectIntl;
  }(__WEBPACK_IMPORTED_MODULE_4_react__["Component"]);

  InjectIntl.displayName = 'InjectIntl(' + getDisplayName(WrappedComponent) + ')';
  InjectIntl.contextTypes = {
    intl: intlShape
  };
  InjectIntl.WrappedComponent = WrappedComponent;


  return InjectIntl;
}

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

function defineMessages(messageDescriptors) {
  // This simply returns what's passed-in because it's meant to be a hook for
  // babel-plugin-react-intl.
  return messageDescriptors;
}

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

// This is a "hack" until a proper `intl-pluralformat` package is created.

function resolveLocale(locales) {
  // IntlMessageFormat#_resolveLocale() does not depend on `this`.
  return __WEBPACK_IMPORTED_MODULE_1_intl_messageformat___default.a.prototype._resolveLocale(locales);
}

function findPluralFunction(locale) {
  // IntlMessageFormat#_findPluralFunction() does not depend on `this`.
  return __WEBPACK_IMPORTED_MODULE_1_intl_messageformat___default.a.prototype._findPluralRuleFunction(locale);
}

var IntlPluralFormat = function IntlPluralFormat(locales) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  classCallCheck(this, IntlPluralFormat);

  var useOrdinal = options.style === 'ordinal';
  var pluralFn = findPluralFunction(resolveLocale(locales));

  this.format = function (value) {
    return pluralFn(value, useOrdinal);
  };
};

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var DATE_TIME_FORMAT_OPTIONS = Object.keys(dateTimeFormatPropTypes);
var NUMBER_FORMAT_OPTIONS = Object.keys(numberFormatPropTypes);
var RELATIVE_FORMAT_OPTIONS = Object.keys(relativeFormatPropTypes);
var PLURAL_FORMAT_OPTIONS = Object.keys(pluralFormatPropTypes);

var RELATIVE_FORMAT_THRESHOLDS = {
  second: 60, // seconds to minute
  minute: 60, // minutes to hour
  hour: 24, // hours to day
  day: 30, // days to month
  month: 12 // months to year
};

function updateRelativeFormatThresholds(newThresholds) {
  var thresholds = __WEBPACK_IMPORTED_MODULE_2_intl_relativeformat___default.a.thresholds;
  thresholds.second = newThresholds.second;
  thresholds.minute = newThresholds.minute;
  thresholds.hour = newThresholds.hour;
  thresholds.day = newThresholds.day;
  thresholds.month = newThresholds.month;
}

function getNamedFormat(formats, type, name) {
  var format = formats && formats[type] && formats[type][name];
  if (format) {
    return format;
  }

  if (false) {
    console.error('[React Intl] No ' + type + ' format named: ' + name);
  }
}

function formatDate(config, state, value) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var locale = config.locale,
      formats = config.formats;
  var format = options.format;


  var date = new Date(value);
  var defaults$$1 = format && getNamedFormat(formats, 'date', format);
  var filteredOptions = filterProps(options, DATE_TIME_FORMAT_OPTIONS, defaults$$1);

  try {
    return state.getDateTimeFormat(locale, filteredOptions).format(date);
  } catch (e) {
    if (false) {
      console.error('[React Intl] Error formatting date.\n' + e);
    }
  }

  return String(date);
}

function formatTime(config, state, value) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var locale = config.locale,
      formats = config.formats;
  var format = options.format;


  var date = new Date(value);
  var defaults$$1 = format && getNamedFormat(formats, 'time', format);
  var filteredOptions = filterProps(options, DATE_TIME_FORMAT_OPTIONS, defaults$$1);

  if (!filteredOptions.hour && !filteredOptions.minute && !filteredOptions.second) {
    // Add default formatting options if hour, minute, or second isn't defined.
    filteredOptions = _extends({}, filteredOptions, { hour: 'numeric', minute: 'numeric' });
  }

  try {
    return state.getDateTimeFormat(locale, filteredOptions).format(date);
  } catch (e) {
    if (false) {
      console.error('[React Intl] Error formatting time.\n' + e);
    }
  }

  return String(date);
}

function formatRelative(config, state, value) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var locale = config.locale,
      formats = config.formats;
  var format = options.format;


  var date = new Date(value);
  var now = new Date(options.now);
  var defaults$$1 = format && getNamedFormat(formats, 'relative', format);
  var filteredOptions = filterProps(options, RELATIVE_FORMAT_OPTIONS, defaults$$1);

  // Capture the current threshold values, then temporarily override them with
  // specific values just for this render.
  var oldThresholds = _extends({}, __WEBPACK_IMPORTED_MODULE_2_intl_relativeformat___default.a.thresholds);
  updateRelativeFormatThresholds(RELATIVE_FORMAT_THRESHOLDS);

  try {
    return state.getRelativeFormat(locale, filteredOptions).format(date, {
      now: isFinite(now) ? now : state.now()
    });
  } catch (e) {
    if (false) {
      console.error('[React Intl] Error formatting relative time.\n' + e);
    }
  } finally {
    updateRelativeFormatThresholds(oldThresholds);
  }

  return String(date);
}

function formatNumber(config, state, value) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var locale = config.locale,
      formats = config.formats;
  var format = options.format;


  var defaults$$1 = format && getNamedFormat(formats, 'number', format);
  var filteredOptions = filterProps(options, NUMBER_FORMAT_OPTIONS, defaults$$1);

  try {
    return state.getNumberFormat(locale, filteredOptions).format(value);
  } catch (e) {
    if (false) {
      console.error('[React Intl] Error formatting number.\n' + e);
    }
  }

  return String(value);
}

function formatPlural(config, state, value) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var locale = config.locale;


  var filteredOptions = filterProps(options, PLURAL_FORMAT_OPTIONS);

  try {
    return state.getPluralFormat(locale, filteredOptions).format(value);
  } catch (e) {
    if (false) {
      console.error('[React Intl] Error formatting plural.\n' + e);
    }
  }

  return 'other';
}

function formatMessage(config, state) {
  var messageDescriptor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var values = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var locale = config.locale,
      formats = config.formats,
      messages = config.messages,
      defaultLocale = config.defaultLocale,
      defaultFormats = config.defaultFormats;
  var id = messageDescriptor.id,
      defaultMessage = messageDescriptor.defaultMessage;

  // `id` is a required field of a Message Descriptor.

  __WEBPACK_IMPORTED_MODULE_5_invariant___default()(id, '[React Intl] An `id` must be provided to format a message.');

  var message = messages && messages[id];
  var hasValues = Object.keys(values).length > 0;

  // Avoid expensive message formatting for simple messages without values. In
  // development messages will always be formatted in case of missing values.
  if (!hasValues && "production" === 'production') {
    return message || defaultMessage || id;
  }

  var formattedMessage = void 0;

  if (message) {
    try {
      var formatter = state.getMessageFormat(message, locale, formats);

      formattedMessage = formatter.format(values);
    } catch (e) {
      if (false) {
        console.error('[React Intl] Error formatting message: "' + id + '" for locale: "' + locale + '"' + (defaultMessage ? ', using default message as fallback.' : '') + ('\n' + e));
      }
    }
  } else {
    if (false) {
      // This prevents warnings from littering the console in development
      // when no `messages` are passed into the <IntlProvider> for the
      // default locale, and a default message is in the source.
      if (!defaultMessage || locale && locale.toLowerCase() !== defaultLocale.toLowerCase()) {
        console.error('[React Intl] Missing message: "' + id + '" for locale: "' + locale + '"' + (defaultMessage ? ', using default message as fallback.' : ''));
      }
    }
  }

  if (!formattedMessage && defaultMessage) {
    try {
      var _formatter = state.getMessageFormat(defaultMessage, defaultLocale, defaultFormats);

      formattedMessage = _formatter.format(values);
    } catch (e) {
      if (false) {
        console.error('[React Intl] Error formatting the default message for: "' + id + '"' + ('\n' + e));
      }
    }
  }

  if (!formattedMessage) {
    if (false) {
      console.error('[React Intl] Cannot format message: "' + id + '", ' + ('using message ' + (message || defaultMessage ? 'source' : 'id') + ' as fallback.'));
    }
  }

  return formattedMessage || message || defaultMessage || id;
}

function formatHTMLMessage(config, state, messageDescriptor) {
  var rawValues = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  // Process all the values before they are used when formatting the ICU
  // Message string. Since the formatted message might be injected via
  // `innerHTML`, all String-based values need to be HTML-escaped.
  var escapedValues = Object.keys(rawValues).reduce(function (escaped, name) {
    var value = rawValues[name];
    escaped[name] = typeof value === 'string' ? escape(value) : value;
    return escaped;
  }, {});

  return formatMessage(config, state, messageDescriptor, escapedValues);
}



var format = Object.freeze({
	formatDate: formatDate,
	formatTime: formatTime,
	formatRelative: formatRelative,
	formatNumber: formatNumber,
	formatPlural: formatPlural,
	formatMessage: formatMessage,
	formatHTMLMessage: formatHTMLMessage
});

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var intlConfigPropNames$1 = Object.keys(intlConfigPropTypes);
var intlFormatPropNames = Object.keys(intlFormatPropTypes);

// These are not a static property on the `IntlProvider` class so the intl
// config values can be inherited from an <IntlProvider> ancestor.
var defaultProps = {
  formats: {},
  messages: {},
  textComponent: 'span',

  defaultLocale: 'en',
  defaultFormats: {}
};

var IntlProvider = function (_Component) {
  inherits(IntlProvider, _Component);

  function IntlProvider(props) {
    var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, IntlProvider);

    var _this = possibleConstructorReturn(this, (IntlProvider.__proto__ || Object.getPrototypeOf(IntlProvider)).call(this, props, context));

    __WEBPACK_IMPORTED_MODULE_5_invariant___default()(typeof Intl !== 'undefined', '[React Intl] The `Intl` APIs must be available in the runtime, ' + 'and do not appear to be built-in. An `Intl` polyfill should be loaded.\n' + 'See: http://formatjs.io/guides/runtime-environments/');

    var intlContext = context.intl;

    // Used to stabilize time when performing an initial rendering so that
    // all relative times use the same reference "now" time.

    var initialNow = void 0;
    if (isFinite(props.initialNow)) {
      initialNow = Number(props.initialNow);
    } else {
      // When an `initialNow` isn't provided via `props`, look to see an
      // <IntlProvider> exists in the ancestry and call its `now()`
      // function to propagate its value for "now".
      initialNow = intlContext ? intlContext.now() : Date.now();
    }

    // Creating `Intl*` formatters is expensive. If there's a parent
    // `<IntlProvider>`, then its formatters will be used. Otherwise, this
    // memoize the `Intl*` constructors and cache them for the lifecycle of
    // this IntlProvider instance.

    var _ref = intlContext || {},
        _ref$formatters = _ref.formatters,
        formatters = _ref$formatters === undefined ? {
      getDateTimeFormat: __WEBPACK_IMPORTED_MODULE_6_intl_format_cache___default()(Intl.DateTimeFormat),
      getNumberFormat: __WEBPACK_IMPORTED_MODULE_6_intl_format_cache___default()(Intl.NumberFormat),
      getMessageFormat: __WEBPACK_IMPORTED_MODULE_6_intl_format_cache___default()(__WEBPACK_IMPORTED_MODULE_1_intl_messageformat___default.a),
      getRelativeFormat: __WEBPACK_IMPORTED_MODULE_6_intl_format_cache___default()(__WEBPACK_IMPORTED_MODULE_2_intl_relativeformat___default.a),
      getPluralFormat: __WEBPACK_IMPORTED_MODULE_6_intl_format_cache___default()(IntlPluralFormat)
    } : _ref$formatters;

    _this.state = _extends({}, formatters, {

      // Wrapper to provide stable "now" time for initial render.
      now: function now() {
        return _this._didDisplay ? Date.now() : initialNow;
      }
    });
    return _this;
  }

  createClass(IntlProvider, [{
    key: 'getConfig',
    value: function getConfig() {
      var intlContext = this.context.intl;

      // Build a whitelisted config object from `props`, defaults, and
      // `context.intl`, if an <IntlProvider> exists in the ancestry.

      var config = filterProps(this.props, intlConfigPropNames$1, intlContext);

      // Apply default props. This must be applied last after the props have
      // been resolved and inherited from any <IntlProvider> in the ancestry.
      // This matches how React resolves `defaultProps`.
      for (var propName in defaultProps) {
        if (config[propName] === undefined) {
          config[propName] = defaultProps[propName];
        }
      }

      if (!hasLocaleData(config.locale)) {
        var _config = config,
            locale = _config.locale,
            defaultLocale = _config.defaultLocale,
            defaultFormats = _config.defaultFormats;


        if (false) {
          console.error('[React Intl] Missing locale data for locale: "' + locale + '". ' + ('Using default locale: "' + defaultLocale + '" as fallback.'));
        }

        // Since there's no registered locale data for `locale`, this will
        // fallback to the `defaultLocale` to make sure things can render.
        // The `messages` are overridden to the `defaultProps` empty object
        // to maintain referential equality across re-renders. It's assumed
        // each <FormattedMessage> contains a `defaultMessage` prop.
        config = _extends({}, config, {
          locale: defaultLocale,
          formats: defaultFormats,
          messages: defaultProps.messages
        });
      }

      return config;
    }
  }, {
    key: 'getBoundFormatFns',
    value: function getBoundFormatFns(config, state) {
      return intlFormatPropNames.reduce(function (boundFormatFns, name) {
        boundFormatFns[name] = format[name].bind(null, config, state);
        return boundFormatFns;
      }, {});
    }
  }, {
    key: 'getChildContext',
    value: function getChildContext() {
      var config = this.getConfig();

      // Bind intl factories and current config to the format functions.
      var boundFormatFns = this.getBoundFormatFns(config, this.state);

      var _state = this.state,
          now = _state.now,
          formatters = objectWithoutProperties(_state, ['now']);


      return {
        intl: _extends({}, config, boundFormatFns, {
          formatters: formatters,
          now: now
        })
      };
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      for (var _len = arguments.length, next = Array(_len), _key = 0; _key < _len; _key++) {
        next[_key] = arguments[_key];
      }

      return shouldIntlComponentUpdate.apply(undefined, [this].concat(next));
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._didDisplay = true;
    }
  }, {
    key: 'render',
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_4_react__["Children"].only(this.props.children);
    }
  }]);
  return IntlProvider;
}(__WEBPACK_IMPORTED_MODULE_4_react__["Component"]);

IntlProvider.displayName = 'IntlProvider';
IntlProvider.contextTypes = {
  intl: intlShape
};
IntlProvider.childContextTypes = {
  intl: intlShape.isRequired
};
 false ? IntlProvider.propTypes = _extends({}, intlConfigPropTypes, {
  children: PropTypes.element.isRequired,
  initialNow: PropTypes.any
}) : void 0;

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var FormattedDate = function (_Component) {
  inherits(FormattedDate, _Component);

  function FormattedDate(props, context) {
    classCallCheck(this, FormattedDate);

    var _this = possibleConstructorReturn(this, (FormattedDate.__proto__ || Object.getPrototypeOf(FormattedDate)).call(this, props, context));

    invariantIntlContext(context);
    return _this;
  }

  createClass(FormattedDate, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      for (var _len = arguments.length, next = Array(_len), _key = 0; _key < _len; _key++) {
        next[_key] = arguments[_key];
      }

      return shouldIntlComponentUpdate.apply(undefined, [this].concat(next));
    }
  }, {
    key: 'render',
    value: function render() {
      var _context$intl = this.context.intl,
          formatDate = _context$intl.formatDate,
          Text = _context$intl.textComponent;
      var _props = this.props,
          value = _props.value,
          children = _props.children;


      var formattedDate = formatDate(value, this.props);

      if (typeof children === 'function') {
        return children(formattedDate);
      }

      return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
        Text,
        null,
        formattedDate
      );
    }
  }]);
  return FormattedDate;
}(__WEBPACK_IMPORTED_MODULE_4_react__["Component"]);

FormattedDate.displayName = 'FormattedDate';
FormattedDate.contextTypes = {
  intl: intlShape
};
 false ? FormattedDate.propTypes = _extends({}, dateTimeFormatPropTypes, {
  value: PropTypes.any.isRequired,
  format: PropTypes.string,
  children: PropTypes.func
}) : void 0;

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var FormattedTime = function (_Component) {
  inherits(FormattedTime, _Component);

  function FormattedTime(props, context) {
    classCallCheck(this, FormattedTime);

    var _this = possibleConstructorReturn(this, (FormattedTime.__proto__ || Object.getPrototypeOf(FormattedTime)).call(this, props, context));

    invariantIntlContext(context);
    return _this;
  }

  createClass(FormattedTime, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      for (var _len = arguments.length, next = Array(_len), _key = 0; _key < _len; _key++) {
        next[_key] = arguments[_key];
      }

      return shouldIntlComponentUpdate.apply(undefined, [this].concat(next));
    }
  }, {
    key: 'render',
    value: function render() {
      var _context$intl = this.context.intl,
          formatTime = _context$intl.formatTime,
          Text = _context$intl.textComponent;
      var _props = this.props,
          value = _props.value,
          children = _props.children;


      var formattedTime = formatTime(value, this.props);

      if (typeof children === 'function') {
        return children(formattedTime);
      }

      return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
        Text,
        null,
        formattedTime
      );
    }
  }]);
  return FormattedTime;
}(__WEBPACK_IMPORTED_MODULE_4_react__["Component"]);

FormattedTime.displayName = 'FormattedTime';
FormattedTime.contextTypes = {
  intl: intlShape
};
 false ? FormattedTime.propTypes = _extends({}, dateTimeFormatPropTypes, {
  value: PropTypes.any.isRequired,
  format: PropTypes.string,
  children: PropTypes.func
}) : void 0;

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var SECOND = 1000;
var MINUTE = 1000 * 60;
var HOUR = 1000 * 60 * 60;
var DAY = 1000 * 60 * 60 * 24;

// The maximum timer delay value is a 32-bit signed integer.
// See: https://mdn.io/setTimeout
var MAX_TIMER_DELAY = 2147483647;

function selectUnits(delta) {
  var absDelta = Math.abs(delta);

  if (absDelta < MINUTE) {
    return 'second';
  }

  if (absDelta < HOUR) {
    return 'minute';
  }

  if (absDelta < DAY) {
    return 'hour';
  }

  // The maximum scheduled delay will be measured in days since the maximum
  // timer delay is less than the number of milliseconds in 25 days.
  return 'day';
}

function getUnitDelay(units) {
  switch (units) {
    case 'second':
      return SECOND;
    case 'minute':
      return MINUTE;
    case 'hour':
      return HOUR;
    case 'day':
      return DAY;
    default:
      return MAX_TIMER_DELAY;
  }
}

function isSameDate(a, b) {
  if (a === b) {
    return true;
  }

  var aTime = new Date(a).getTime();
  var bTime = new Date(b).getTime();

  return isFinite(aTime) && isFinite(bTime) && aTime === bTime;
}

var FormattedRelative = function (_Component) {
  inherits(FormattedRelative, _Component);

  function FormattedRelative(props, context) {
    classCallCheck(this, FormattedRelative);

    var _this = possibleConstructorReturn(this, (FormattedRelative.__proto__ || Object.getPrototypeOf(FormattedRelative)).call(this, props, context));

    invariantIntlContext(context);

    var now = isFinite(props.initialNow) ? Number(props.initialNow) : context.intl.now();

    // `now` is stored as state so that `render()` remains a function of
    // props + state, instead of accessing `Date.now()` inside `render()`.
    _this.state = { now: now };
    return _this;
  }

  createClass(FormattedRelative, [{
    key: 'scheduleNextUpdate',
    value: function scheduleNextUpdate(props, state) {
      var _this2 = this;

      // Cancel and pending update because we're scheduling a new update.
      clearTimeout(this._timer);

      var value = props.value,
          units = props.units,
          updateInterval = props.updateInterval;

      var time = new Date(value).getTime();

      // If the `updateInterval` is falsy, including `0` or we don't have a
      // valid date, then auto updates have been turned off, so we bail and
      // skip scheduling an update.
      if (!updateInterval || !isFinite(time)) {
        return;
      }

      var delta = time - state.now;
      var unitDelay = getUnitDelay(units || selectUnits(delta));
      var unitRemainder = Math.abs(delta % unitDelay);

      // We want the largest possible timer delay which will still display
      // accurate information while reducing unnecessary re-renders. The delay
      // should be until the next "interesting" moment, like a tick from
      // "1 minute ago" to "2 minutes ago" when the delta is 120,000ms.
      var delay = delta < 0 ? Math.max(updateInterval, unitDelay - unitRemainder) : Math.max(updateInterval, unitRemainder);

      this._timer = setTimeout(function () {
        _this2.setState({ now: _this2.context.intl.now() });
      }, delay);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.scheduleNextUpdate(this.props, this.state);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(_ref) {
      var nextValue = _ref.value;

      // When the `props.value` date changes, `state.now` needs to be updated,
      // and the next update can be rescheduled.
      if (!isSameDate(nextValue, this.props.value)) {
        this.setState({ now: this.context.intl.now() });
      }
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      for (var _len = arguments.length, next = Array(_len), _key = 0; _key < _len; _key++) {
        next[_key] = arguments[_key];
      }

      return shouldIntlComponentUpdate.apply(undefined, [this].concat(next));
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      this.scheduleNextUpdate(nextProps, nextState);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearTimeout(this._timer);
    }
  }, {
    key: 'render',
    value: function render() {
      var _context$intl = this.context.intl,
          formatRelative = _context$intl.formatRelative,
          Text = _context$intl.textComponent;
      var _props = this.props,
          value = _props.value,
          children = _props.children;


      var formattedRelative = formatRelative(value, _extends({}, this.props, this.state));

      if (typeof children === 'function') {
        return children(formattedRelative);
      }

      return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
        Text,
        null,
        formattedRelative
      );
    }
  }]);
  return FormattedRelative;
}(__WEBPACK_IMPORTED_MODULE_4_react__["Component"]);

FormattedRelative.displayName = 'FormattedRelative';
FormattedRelative.contextTypes = {
  intl: intlShape
};
FormattedRelative.defaultProps = {
  updateInterval: 1000 * 10
};
 false ? FormattedRelative.propTypes = _extends({}, relativeFormatPropTypes, {
  value: PropTypes.any.isRequired,
  format: PropTypes.string,
  updateInterval: PropTypes.number,
  initialNow: PropTypes.any,
  children: PropTypes.func
}) : void 0;

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var FormattedNumber = function (_Component) {
  inherits(FormattedNumber, _Component);

  function FormattedNumber(props, context) {
    classCallCheck(this, FormattedNumber);

    var _this = possibleConstructorReturn(this, (FormattedNumber.__proto__ || Object.getPrototypeOf(FormattedNumber)).call(this, props, context));

    invariantIntlContext(context);
    return _this;
  }

  createClass(FormattedNumber, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      for (var _len = arguments.length, next = Array(_len), _key = 0; _key < _len; _key++) {
        next[_key] = arguments[_key];
      }

      return shouldIntlComponentUpdate.apply(undefined, [this].concat(next));
    }
  }, {
    key: 'render',
    value: function render() {
      var _context$intl = this.context.intl,
          formatNumber = _context$intl.formatNumber,
          Text = _context$intl.textComponent;
      var _props = this.props,
          value = _props.value,
          children = _props.children;


      var formattedNumber = formatNumber(value, this.props);

      if (typeof children === 'function') {
        return children(formattedNumber);
      }

      return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
        Text,
        null,
        formattedNumber
      );
    }
  }]);
  return FormattedNumber;
}(__WEBPACK_IMPORTED_MODULE_4_react__["Component"]);

FormattedNumber.displayName = 'FormattedNumber';
FormattedNumber.contextTypes = {
  intl: intlShape
};
 false ? FormattedNumber.propTypes = _extends({}, numberFormatPropTypes, {
  value: PropTypes.any.isRequired,
  format: PropTypes.string,
  children: PropTypes.func
}) : void 0;

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var FormattedPlural = function (_Component) {
  inherits(FormattedPlural, _Component);

  function FormattedPlural(props, context) {
    classCallCheck(this, FormattedPlural);

    var _this = possibleConstructorReturn(this, (FormattedPlural.__proto__ || Object.getPrototypeOf(FormattedPlural)).call(this, props, context));

    invariantIntlContext(context);
    return _this;
  }

  createClass(FormattedPlural, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      for (var _len = arguments.length, next = Array(_len), _key = 0; _key < _len; _key++) {
        next[_key] = arguments[_key];
      }

      return shouldIntlComponentUpdate.apply(undefined, [this].concat(next));
    }
  }, {
    key: 'render',
    value: function render() {
      var _context$intl = this.context.intl,
          formatPlural = _context$intl.formatPlural,
          Text = _context$intl.textComponent;
      var _props = this.props,
          value = _props.value,
          other = _props.other,
          children = _props.children;


      var pluralCategory = formatPlural(value, this.props);
      var formattedPlural = this.props[pluralCategory] || other;

      if (typeof children === 'function') {
        return children(formattedPlural);
      }

      return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(
        Text,
        null,
        formattedPlural
      );
    }
  }]);
  return FormattedPlural;
}(__WEBPACK_IMPORTED_MODULE_4_react__["Component"]);

FormattedPlural.displayName = 'FormattedPlural';
FormattedPlural.contextTypes = {
  intl: intlShape
};
FormattedPlural.defaultProps = {
  style: 'cardinal'
};
 false ? FormattedPlural.propTypes = _extends({}, pluralFormatPropTypes, {
  value: PropTypes.any.isRequired,

  other: PropTypes.node.isRequired,
  zero: PropTypes.node,
  one: PropTypes.node,
  two: PropTypes.node,
  few: PropTypes.node,
  many: PropTypes.node,

  children: PropTypes.func
}) : void 0;

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var FormattedMessage = function (_Component) {
  inherits(FormattedMessage, _Component);

  function FormattedMessage(props, context) {
    classCallCheck(this, FormattedMessage);

    var _this = possibleConstructorReturn(this, (FormattedMessage.__proto__ || Object.getPrototypeOf(FormattedMessage)).call(this, props, context));

    invariantIntlContext(context);
    return _this;
  }

  createClass(FormattedMessage, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var values = this.props.values;
      var nextValues = nextProps.values;


      if (!shallowEquals(nextValues, values)) {
        return true;
      }

      // Since `values` has already been checked, we know they're not
      // different, so the current `values` are carried over so the shallow
      // equals comparison on the other props isn't affected by the `values`.
      var nextPropsToCheck = _extends({}, nextProps, {
        values: values
      });

      for (var _len = arguments.length, next = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        next[_key - 1] = arguments[_key];
      }

      return shouldIntlComponentUpdate.apply(undefined, [this, nextPropsToCheck].concat(next));
    }
  }, {
    key: 'render',
    value: function render() {
      var _context$intl = this.context.intl,
          formatMessage = _context$intl.formatMessage,
          Text = _context$intl.textComponent;
      var _props = this.props,
          id = _props.id,
          description = _props.description,
          defaultMessage = _props.defaultMessage,
          values = _props.values,
          _props$tagName = _props.tagName,
          Component$$1 = _props$tagName === undefined ? Text : _props$tagName,
          children = _props.children;


      var tokenDelimiter = void 0;
      var tokenizedValues = void 0;
      var elements = void 0;

      var hasValues = values && Object.keys(values).length > 0;
      if (hasValues) {
        // Creates a token with a random UID that should not be guessable or
        // conflict with other parts of the `message` string.
        var uid = Math.floor(Math.random() * 0x10000000000).toString(16);

        var generateToken = function () {
          var counter = 0;
          return function () {
            return 'ELEMENT-' + uid + '-' + (counter += 1);
          };
        }();

        // Splitting with a delimiter to support IE8. When using a regex
        // with a capture group IE8 does not include the capture group in
        // the resulting array.
        tokenDelimiter = '@__' + uid + '__@';
        tokenizedValues = {};
        elements = {};

        // Iterates over the `props` to keep track of any React Element
        // values so they can be represented by the `token` as a placeholder
        // when the `message` is formatted. This allows the formatted
        // message to then be broken-up into parts with references to the
        // React Elements inserted back in.
        Object.keys(values).forEach(function (name) {
          var value = values[name];

          if (Object(__WEBPACK_IMPORTED_MODULE_4_react__["isValidElement"])(value)) {
            var token = generateToken();
            tokenizedValues[name] = tokenDelimiter + token + tokenDelimiter;
            elements[token] = value;
          } else {
            tokenizedValues[name] = value;
          }
        });
      }

      var descriptor = { id: id, description: description, defaultMessage: defaultMessage };
      var formattedMessage = formatMessage(descriptor, tokenizedValues || values);

      var nodes = void 0;

      var hasElements = elements && Object.keys(elements).length > 0;
      if (hasElements) {
        // Split the message into parts so the React Element values captured
        // above can be inserted back into the rendered message. This
        // approach allows messages to render with React Elements while
        // keeping React's virtual diffing working properly.
        nodes = formattedMessage.split(tokenDelimiter).filter(function (part) {
          return !!part;
        }).map(function (part) {
          return elements[part] || part;
        });
      } else {
        nodes = [formattedMessage];
      }

      if (typeof children === 'function') {
        return children.apply(undefined, toConsumableArray(nodes));
      }

      // Needs to use `createElement()` instead of JSX, otherwise React will
      // warn about a missing `key` prop with rich-text message formatting.
      return __WEBPACK_IMPORTED_MODULE_4_react__["createElement"].apply(undefined, [Component$$1, null].concat(toConsumableArray(nodes)));
    }
  }]);
  return FormattedMessage;
}(__WEBPACK_IMPORTED_MODULE_4_react__["Component"]);

FormattedMessage.displayName = 'FormattedMessage';
FormattedMessage.contextTypes = {
  intl: intlShape
};
FormattedMessage.defaultProps = {
  values: {}
};
 false ? FormattedMessage.propTypes = _extends({}, messageDescriptorPropTypes, {
  values: PropTypes.object,
  tagName: PropTypes.string,
  children: PropTypes.func
}) : void 0;

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

var FormattedHTMLMessage = function (_Component) {
  inherits(FormattedHTMLMessage, _Component);

  function FormattedHTMLMessage(props, context) {
    classCallCheck(this, FormattedHTMLMessage);

    var _this = possibleConstructorReturn(this, (FormattedHTMLMessage.__proto__ || Object.getPrototypeOf(FormattedHTMLMessage)).call(this, props, context));

    invariantIntlContext(context);
    return _this;
  }

  createClass(FormattedHTMLMessage, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var values = this.props.values;
      var nextValues = nextProps.values;


      if (!shallowEquals(nextValues, values)) {
        return true;
      }

      // Since `values` has already been checked, we know they're not
      // different, so the current `values` are carried over so the shallow
      // equals comparison on the other props isn't affected by the `values`.
      var nextPropsToCheck = _extends({}, nextProps, {
        values: values
      });

      for (var _len = arguments.length, next = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        next[_key - 1] = arguments[_key];
      }

      return shouldIntlComponentUpdate.apply(undefined, [this, nextPropsToCheck].concat(next));
    }
  }, {
    key: 'render',
    value: function render() {
      var _context$intl = this.context.intl,
          formatHTMLMessage = _context$intl.formatHTMLMessage,
          Text = _context$intl.textComponent;
      var _props = this.props,
          id = _props.id,
          description = _props.description,
          defaultMessage = _props.defaultMessage,
          rawValues = _props.values,
          _props$tagName = _props.tagName,
          Component$$1 = _props$tagName === undefined ? Text : _props$tagName,
          children = _props.children;


      var descriptor = { id: id, description: description, defaultMessage: defaultMessage };
      var formattedHTMLMessage = formatHTMLMessage(descriptor, rawValues);

      if (typeof children === 'function') {
        return children(formattedHTMLMessage);
      }

      // Since the message presumably has HTML in it, we need to set
      // `innerHTML` in order for it to be rendered and not escaped by React.
      // To be safe, all string prop values were escaped when formatting the
      // message. It is assumed that the message is not UGC, and came from the
      // developer making it more like a template.
      //
      // Note: There's a perf impact of using this component since there's no
      // way for React to do its virtual DOM diffing.
      var html = { __html: formattedHTMLMessage };
      return __WEBPACK_IMPORTED_MODULE_4_react___default.a.createElement(Component$$1, { dangerouslySetInnerHTML: html });
    }
  }]);
  return FormattedHTMLMessage;
}(__WEBPACK_IMPORTED_MODULE_4_react__["Component"]);

FormattedHTMLMessage.displayName = 'FormattedHTMLMessage';
FormattedHTMLMessage.contextTypes = {
  intl: intlShape
};
FormattedHTMLMessage.defaultProps = {
  values: {}
};
 false ? FormattedHTMLMessage.propTypes = _extends({}, messageDescriptorPropTypes, {
  values: PropTypes.object,
  tagName: PropTypes.string,
  children: PropTypes.func
}) : void 0;

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

addLocaleData(defaultLocaleData);

/*
 * Copyright 2015, Yahoo Inc.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

addLocaleData(__WEBPACK_IMPORTED_MODULE_0__locale_data_index_js___default.a);




/***/ }),

/***/ 526:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* jshint node:true */



var IntlMessageFormat = __webpack_require__(1097)['default'];

// Add all locale data to `IntlMessageFormat`. This module will be ignored when
// bundling for the browser with Browserify/Webpack.
__webpack_require__(1104);

// Re-export `IntlMessageFormat` as the CommonJS default exports with all the
// locale data registered, and with English set as the default locale. Define
// the `default` prop for use with other compiled ES6 Modules.
exports = module.exports = IntlMessageFormat;
exports['default'] = exports;


/***/ }),

/***/ 527:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jslint esnext: true */


exports.extend = extend;
var hop = Object.prototype.hasOwnProperty;

function extend(obj) {
    var sources = Array.prototype.slice.call(arguments, 1),
        i, len, source, key;

    for (i = 0, len = sources.length; i < len; i += 1) {
        source = sources[i];
        if (!source) { continue; }

        for (key in source) {
            if (hop.call(source, key)) {
                obj[key] = source[key];
            }
        }
    }

    return obj;
}
exports.hop = hop;

//# sourceMappingURL=utils.js.map

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

/***/ 65:
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(33);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


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

/***/ 68:
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ }),

/***/ 69:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.YoastButton = undefined;
exports.addButtonStyles = addButtonStyles;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = __webpack_require__(2);

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _colors = __webpack_require__(4);

var _colors2 = _interopRequireDefault(_colors);

var _helpers = __webpack_require__(119);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var settings = {
	minHeight: 48,
	verticalPadding: 0,
	borderWidth: 0
};

var ieMinHeight = settings.minHeight - settings.verticalPadding * 2 - settings.borderWidth * 2;

/**
 * Returns a component with a Yoast button-like style.
 *
 * The styles provided here are meant to be applied to both button and link
 * elements that need to look like styled buttons.
 *
 * @param {ReactElement} component The original component.
 *
 * @returns {ReactElement} Component with applied button styles.
 */
function addButtonStyles(component) {
	return (0, _styledComponents2.default)(component).withConfig({
		displayName: "YoastButton"
	})(["display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;min-height:", ";margin:0;padding:0 16px;padding:", " 16px;border:0;border-radius:4px;box-sizing:border-box;font:400 14px/24px \"Open Sans\",sans-serif;text-transform:uppercase;box-shadow:0 2px 8px 0 ", ";transition:box-shadow 150ms ease-out;&:hover,&:focus,&:active{box-shadow:0 4px 10px 0 ", ",inset 0 0 0 100px ", ";color:", ";}&:active{transform:translateY( 1px );box-shadow:none;}@media all and (-ms-high-contrast:none),(-ms-high-contrast:active){::after{display:inline-block;content:\"\";min-height:", ";}}"], settings.minHeight + "px", settings.verticalPadding + "px", (0, _helpers.rgba)(_colors2.default.$color_black, 0.3), (0, _helpers.rgba)(_colors2.default.$color_black, 0.2), (0, _helpers.rgba)(_colors2.default.$color_black, 0.1), function (props) {
		return props.textColor;
	}, ieMinHeight + "px");
}

/**
 * Returns a component with a button and an inner span element.
 *
 * The inner span is only needed to fix a Safari 10 bug with flexbox and button
 * elements. This bug is fixed in Safari Technology Previs and in the future it
 * will be possible to remove this component and directly style a button element.
 * See https://github.com/philipwalton/flexbugs#9-some-html-elements-cant-be-flex-containers
 *
 * @returns {ReactElement} The button with inner span.
 */
var YoastButtonBase = function YoastButtonBase(_ref) {
	var className = _ref.className,
	    onClick = _ref.onClick,
	    type = _ref.type,
	    children = _ref.children,
	    isExpanded = _ref.isExpanded;
	return _react2.default.createElement(
		"button",
		{ className: className, onClick: onClick, type: type, "aria-expanded": isExpanded },
		_react2.default.createElement(
			"span",
			null,
			children
		)
	);
};

YoastButtonBase.propTypes = {
	className: _propTypes2.default.string,
	onClick: _propTypes2.default.func,
	type: _propTypes2.default.string,
	isExpanded: _propTypes2.default.bool,
	children: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.node), _propTypes2.default.node, _propTypes2.default.string])
};

YoastButtonBase.defaultProps = {
	type: "button"
};

/**
 * Returns a Button with the Yoast button style.
 *
 * See the Safari 10 bug description in the YoastButtonBase JSDoc.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} styled button.
 */
var YoastButton = exports.YoastButton = addButtonStyles((0, _styledComponents2.default)(YoastButtonBase).withConfig({
	displayName: "YoastButton"
})(["color:", ";background:", ";min-width:152px;", ";overflow:visible;cursor:pointer;&::-moz-focus-inner{border-width:0;}span{display:inherit;align-items:inherit;justify-content:inherit;width:100%;}"], function (props) {
	return props.textColor;
}, function (props) {
	return props.backgroundColor;
}, function (props) {
	return props.withTextShadow ? "text-shadow: 0 0 2px " + _colors2.default.$color_black : "";
}));

YoastButton.propTypes = {
	backgroundColor: _propTypes2.default.string,
	textColor: _propTypes2.default.string,
	withTextShadow: _propTypes2.default.bool
};

YoastButton.defaultProps = {
	backgroundColor: _colors2.default.$color_green_medium_light,
	textColor: _colors2.default.$color_white,
	withTextShadow: true
};

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

/***/ 86:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.speak = exports.setup = undefined;

var _addContainer = __webpack_require__(448);

var _addContainer2 = _interopRequireDefault(_addContainer);

var _clear = __webpack_require__(449);

var _clear2 = _interopRequireDefault(_clear);

var _domReady = __webpack_require__(450);

var _domReady2 = _interopRequireDefault(_domReady);

var _filterMessage = __webpack_require__(451);

var _filterMessage2 = _interopRequireDefault(_filterMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Create the live regions.
 */
var setup = exports.setup = function setup() {
	var containerPolite = document.getElementById('a11y-speak-polite');
	var containerAssertive = document.getElementById('a11y-speak-assertive');

	if (containerPolite === null) {
		containerPolite = (0, _addContainer2.default)('polite');
	}
	if (containerAssertive === null) {
		containerAssertive = (0, _addContainer2.default)('assertive');
	}
};

/**
 * Run setup on domReady.
 */
(0, _domReady2.default)(setup);

/**
 * Update the ARIA live notification area text node.
 *
 * @param {String} message  The message to be announced by Assistive Technologies.
 * @param {String} ariaLive Optional. The politeness level for aria-live. Possible values:
 *                          polite or assertive. Default polite.
 */
var speak = exports.speak = function speak(message, ariaLive) {
	// Clear previous messages to allow repeated strings being read out.
	(0, _clear2.default)();

	message = (0, _filterMessage2.default)(message);

	var containerPolite = document.getElementById('a11y-speak-polite');
	var containerAssertive = document.getElementById('a11y-speak-assertive');

	if (containerAssertive && 'assertive' === ariaLive) {
		containerAssertive.textContent = message;
	} else if (containerPolite) {
		containerPolite.textContent = message;
	}
};

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

/***/ 92:
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


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


/***/ }),

/***/ 95:
/***/ (function(module, exports) {

module.exports = {"mobile":"768px","tablet":"1224px"}

/***/ })

},[1994]);