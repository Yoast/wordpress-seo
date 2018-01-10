(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Assessor = require("yoastseo/js/assessor.js");

var introductionKeyword = require("yoastseo/js/assessments/seo/introductionKeywordAssessment.js");
var keyphraseLength = require("yoastseo/js/assessments/seo/keyphraseLengthAssessment.js");
var keywordDensity = require("yoastseo/js/assessments/seo/keywordDensityAssessment.js");
var keywordStopWords = require("yoastseo/js/assessments/seo/keywordStopWordsAssessment.js");
var metaDescriptionKeyword = require("yoastseo/js/assessments/seo/metaDescriptionKeywordAssessment.js");
var MetaDescriptionLength = require("yoastseo/js/assessments/seo/metaDescriptionLengthAssessment.js");
var titleKeyword = require("yoastseo/js/assessments/seo/titleKeywordAssessment.js");
var TitleWidth = require("yoastseo/js/assessments/seo/pageTitleWidthAssessment.js");
var UrlKeyword = require("yoastseo/js/assessments/seo/urlKeywordAssessment.js");
var UrlLength = require("yoastseo/js/assessments/seo/urlLengthAssessment.js");
var urlStopWords = require("yoastseo/js/assessments/seo/urlStopWordsAssessment.js");
var taxonomyTextLength = require("yoastseo/js/assessments/seo/taxonomyTextLengthAssessment");

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @constructor
 */
var TaxonomyAssessor = function TaxonomyAssessor(i18n) {
	Assessor.call(this, i18n);

	this._assessments = [introductionKeyword, keyphraseLength, keywordDensity, keywordStopWords, metaDescriptionKeyword, new MetaDescriptionLength(), taxonomyTextLength, titleKeyword, new TitleWidth(), new UrlKeyword(), new UrlLength(), urlStopWords];
};

module.exports = TaxonomyAssessor;

require("util").inherits(module.exports, Assessor);

},{"util":224,"yoastseo/js/assessments/seo/introductionKeywordAssessment.js":227,"yoastseo/js/assessments/seo/keyphraseLengthAssessment.js":228,"yoastseo/js/assessments/seo/keywordDensityAssessment.js":229,"yoastseo/js/assessments/seo/keywordStopWordsAssessment.js":230,"yoastseo/js/assessments/seo/metaDescriptionKeywordAssessment.js":231,"yoastseo/js/assessments/seo/metaDescriptionLengthAssessment.js":232,"yoastseo/js/assessments/seo/pageTitleWidthAssessment.js":234,"yoastseo/js/assessments/seo/taxonomyTextLengthAssessment":236,"yoastseo/js/assessments/seo/titleKeywordAssessment.js":240,"yoastseo/js/assessments/seo/urlKeywordAssessment.js":241,"yoastseo/js/assessments/seo/urlLengthAssessment.js":242,"yoastseo/js/assessments/seo/urlStopWordsAssessment.js":243,"yoastseo/js/assessor.js":244}],2:[function(require,module,exports){
"use strict";

/* global wpseoAdminL10n */
/* global ajaxurl */
/* global require */

var Jed = require("jed");
var Paper = require("yoastseo/js/values/Paper");
var SEOAssessor = require("yoastseo/js/seoAssessor");
var TaxonomyAssessor = require("./assessors/taxonomyAssessor");
var isUndefined = require("lodash/isUndefined");

(function ($) {
	var i18n = new Jed({
		domain: "js-text-analysis",
		locale_data: {
			"js-text-analysis": {
				"": {}
			}
		}
	});

	/**
  * Constructs the recalculate score.
  *
  * @param {int} totalCount The total amount of items to calculate.
  *
  * @constructor
  */
	var YoastRecalculateScore = function YoastRecalculateScore(totalCount) {
		// Sets the total count
		this.totalCount = totalCount;
		this.oncomplete = false;

		this.setupAssessors();

		$("#wpseo_count_total").html(totalCount);

		jQuery("#wpseo_progressbar").progressbar({ value: 0 });
	};

	/**
  * Sets up the Assessors needed for the recalculation.
  *
  * @returns {void}
  */
	YoastRecalculateScore.prototype.setupAssessors = function () {
		var postAssessor = new SEOAssessor(i18n);
		var taxonomyAssessor = new TaxonomyAssessor(i18n);

		this.validAssessors = {
			post: postAssessor,
			term: taxonomyAssessor
		};
	};

	/**
  * Starts the recalculation
  *
  * @param {int} itemsToFetch     The amount of items to fetch.
  * @param {string} fetchType      The fetch type.
  * @param {string} idField        The ID field to extract from each item.
  * @param {Function|bool} callback Callback when calculating has been completed.
  *
  * @returns {void}
  */
	YoastRecalculateScore.prototype.start = function (itemsToFetch, fetchType, idField, callback) {
		if (!this.validAssessors.hasOwnProperty(fetchType)) {
			throw new Error("Unknown fetch type of " + fetchType + " given.");
		}

		this.fetchType = fetchType;
		this.itemsToFetch = itemsToFetch;
		this.idField = idField;
		this.oncomplete = callback;

		this.assessor = this.validAssessors[fetchType];

		this.getItemsToRecalculate(1);
	};

	/**
  * Updates the progressbar
  *
  * @param {int} totalPosts Total amount of posts.
  *
  * @returns {void}
  */
	YoastRecalculateScore.prototype.updateProgressBar = function (totalPosts) {
		var currentValue = jQuery("#wpseo_count").text();
		var newValue = parseInt(currentValue, 10) + totalPosts;
		var newWidth = newValue * (100 / this.totalCount);

		jQuery("#wpseo_progressbar").progressbar("value", newWidth);

		this.updateCountElement(newValue);
	};

	/**
  * Updates the element with the new count value
  *
  * @param {int} newValue The new value for count element.
  *
  * @returns {void}
  */
	YoastRecalculateScore.prototype.updateCountElement = function (newValue) {
		jQuery("#wpseo_count").html(newValue);
	};

	/**
  * Calculate the scores
  *
  * @param {int}   totalItems Total amount of items.
  * @param {array} items       The items to calculate the score for.
  *
  * @returns {array} The calculated scores
  */
	YoastRecalculateScore.prototype.calculateScores = function (totalItems, items) {
		var scores = [];
		for (var i = 0; i < totalItems; i++) {
			scores.push(this.getScore(items[i]));
		}

		return scores;
	};

	/**
  * Returns the score
  *
  * @param {json} item Item to get te score for.
  *
  * @returns {{item_id: int, score}} Object with score for item.
  */
	YoastRecalculateScore.prototype.getScore = function (item) {
		return {
			item_id: this.getItemID(item),
			taxonomy: item.taxonomy ? item.taxonomy : "",
			score: this.calculateItemScore(item)
		};
	};

	/**
  * Returns the item id
  *
  * @param {json} item Item to get the id from.
  *
  * @returns {int} The id from the item.
  */
	YoastRecalculateScore.prototype.getItemID = function (item) {
		this.itemsToFetch--;

		return item[this.idField];
	};

	/**
  * Pass the post to the analyzer to calculates it's core
  *
  * @param {Object} item Item to calculate the score for.
  *
  * @returns {void}
  */
	YoastRecalculateScore.prototype.calculateItemScore = function (item) {
		var tempPaper = new Paper(item.text, {
			keyword: item.keyword,
			url: item.url,
			locale: wpseoAdminL10n.contentLocale,
			description: item.meta,
			title: item.pageTitle
		});

		var tempAssessor = this.assessor;

		tempAssessor.assess(tempPaper);

		return tempAssessor.calculateOverallScore();
	};

	/**
  * Parse the response given by request in getItemsToRecalculate.
  *
  * @param {Object} response Response to parse.
  *
  * @returns {void}
  */
	YoastRecalculateScore.prototype.parseResponse = function (response) {
		if (response !== "" && response !== null) {
			if (!isUndefined(response.total_items)) {
				var scores = this.calculateScores(response.total_items, response.items);

				this.sendScores(scores);

				this.updateProgressBar(response.total_items);
			}

			if (isUndefined(response.next_page)) {
				this.onCompleteRequest();
			} else {
				this.getItemsToRecalculate(response.next_page);
			}

			return true;
		}

		this.onCompleteRequest();
	};

	/**
  * Run the oncomplete method when the process is done..
  *
  * @returns {void}
  */
	YoastRecalculateScore.prototype.onCompleteRequest = function () {
		// When there is nothing to do.
		if (this.oncomplete !== false) {
			this.oncomplete();
			this.oncomplete = false;
		}
	};

	/**
  * Sends the scores to the backend
  *
  * @param {array} scores Scores to send.
  *
  * @returns {void}
  */
	YoastRecalculateScore.prototype.sendScores = function (scores) {
		jQuery.post(ajaxurl, {
			action: "wpseo_update_score",
			nonce: jQuery("#wpseo_recalculate_nonce").val(),
			scores: scores,
			type: this.fetchType
		});
	};

	/**
  * Get the posts which have to be recalculated.
  *
  * @param {int} currentPage The current page.
  *
  * @returns {void}
  */
	YoastRecalculateScore.prototype.getItemsToRecalculate = function (currentPage) {
		jQuery.post(ajaxurl, {
			action: "wpseo_recalculate_scores",
			nonce: jQuery("#wpseo_recalculate_nonce").val(),
			paged: currentPage,
			type: this.fetchType
		}, this.parseResponse.bind(this), "json");
	};

	/**
  * Starting the recalculation process
  *
  * @param {object} response The response.
  *
  * @returns {void}
  */
	function startRecalculate(response) {
		var PostsToFetch = parseInt(response.posts, 10);
		var TermsToFetch = parseInt(response.terms, 10);

		var RecalculateScore = new YoastRecalculateScore(PostsToFetch + TermsToFetch);

		RecalculateScore.start(PostsToFetch, "post", "post_id", function () {
			RecalculateScore.start(TermsToFetch, "term", "term_id", false);
		});
	}

	/**
  * Initializes the event handler for the recalculate button.
  *
  * @returns {void}
  */
	function init() {
		var recalculateLink = jQuery("#wpseo_recalculate_link");

		if (!isUndefined(recalculateLink)) {
			recalculateLink.click(function () {
				// Reset the count element and the progressbar
				jQuery("#wpseo_count").text(0);

				$.post(ajaxurl, {
					action: "wpseo_recalculate_total",
					nonce: jQuery("#wpseo_recalculate_nonce").val()
				}, startRecalculate, "json");
			});

			if (recalculateLink.data("open")) {
				recalculateLink.trigger("click");
			}
		}
	}

	$(init);
})(jQuery);

},{"./assessors/taxonomyAssessor":1,"jed":3,"lodash/isUndefined":192,"yoastseo/js/seoAssessor":347,"yoastseo/js/values/Paper":389}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":100,"./_root":141}],5:[function(require,module,exports){
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

},{"./_hashClear":107,"./_hashDelete":108,"./_hashGet":109,"./_hashHas":110,"./_hashSet":111}],6:[function(require,module,exports){
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

},{"./_listCacheClear":121,"./_listCacheDelete":122,"./_listCacheGet":123,"./_listCacheHas":124,"./_listCacheSet":125}],7:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":100,"./_root":141}],8:[function(require,module,exports){
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

},{"./_mapCacheClear":126,"./_mapCacheDelete":127,"./_mapCacheGet":128,"./_mapCacheHas":129,"./_mapCacheSet":130}],9:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":100,"./_root":141}],10:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":100,"./_root":141}],11:[function(require,module,exports){
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

},{"./_MapCache":8,"./_setCacheAdd":142,"./_setCacheHas":143}],12:[function(require,module,exports){
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

},{"./_ListCache":6,"./_stackClear":147,"./_stackDelete":148,"./_stackGet":149,"./_stackHas":150,"./_stackSet":151}],13:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":141}],14:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":141}],15:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":100,"./_root":141}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
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

},{"./_baseIndexOf":42}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{"./_baseTimes":69,"./_isIndex":114,"./isArguments":176,"./isArray":177,"./isBuffer":180,"./isTypedArray":191}],22:[function(require,module,exports){
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

},{}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
var baseAssignValue = require('./_baseAssignValue'),
    eq = require('./eq');

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

},{"./_baseAssignValue":28,"./eq":159}],26:[function(require,module,exports){
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

},{"./_baseAssignValue":28,"./eq":159}],27:[function(require,module,exports){
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

},{"./eq":159}],28:[function(require,module,exports){
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

},{"./_defineProperty":90}],29:[function(require,module,exports){
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

},{"./isObject":186}],30:[function(require,module,exports){
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

},{"./_baseForOwn":35,"./_createBaseEach":85}],31:[function(require,module,exports){
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

},{"./_baseEach":30}],32:[function(require,module,exports){
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

},{}],33:[function(require,module,exports){
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

},{"./_arrayPush":23,"./_isFlattenable":113}],34:[function(require,module,exports){
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

},{"./_createBaseFor":86}],35:[function(require,module,exports){
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

},{"./_baseFor":34,"./keys":193}],36:[function(require,module,exports){
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

},{"./_castPath":77,"./_toKey":154}],37:[function(require,module,exports){
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

},{"./_arrayPush":23,"./isArray":177}],38:[function(require,module,exports){
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

},{"./_Symbol":13,"./_getRawTag":102,"./_objectToString":138}],39:[function(require,module,exports){
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

},{}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * The base implementation of `_.inRange` which doesn't coerce arguments.
 *
 * @private
 * @param {number} number The number to check.
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
function baseInRange(number, start, end) {
  return number >= nativeMin(start, end) && number < nativeMax(start, end);
}

module.exports = baseInRange;

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

},{"./_baseFindIndex":32,"./_baseIsNaN":48,"./_strictIndexOf":152}],43:[function(require,module,exports){
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

},{"./_SetCache":11,"./_arrayIncludes":19,"./_arrayIncludesWith":20,"./_arrayMap":22,"./_baseUnary":71,"./_cacheHas":74}],44:[function(require,module,exports){
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

},{"./_baseGetTag":38,"./isObjectLike":187}],45:[function(require,module,exports){
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

},{"./_baseIsEqualDeep":46,"./isObjectLike":187}],46:[function(require,module,exports){
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

},{"./_Stack":12,"./_equalArrays":91,"./_equalByTag":92,"./_equalObjects":93,"./_getTag":104,"./isArray":177,"./isBuffer":180,"./isTypedArray":191}],47:[function(require,module,exports){
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

},{"./_Stack":12,"./_baseIsEqual":45}],48:[function(require,module,exports){
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

},{"./_isMasked":118,"./_toSource":155,"./isFunction":182,"./isObject":186}],50:[function(require,module,exports){
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

},{"./_baseGetTag":38,"./isLength":183,"./isObjectLike":187}],51:[function(require,module,exports){
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

},{"./_baseMatches":55,"./_baseMatchesProperty":56,"./identity":171,"./isArray":177,"./property":201}],52:[function(require,module,exports){
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

},{"./_isPrototype":119,"./_nativeKeys":135}],53:[function(require,module,exports){
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

},{"./_isPrototype":119,"./_nativeKeysIn":136,"./isObject":186}],54:[function(require,module,exports){
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

},{"./_baseEach":30,"./isArrayLike":178}],55:[function(require,module,exports){
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

},{"./_baseIsMatch":47,"./_getMatchData":99,"./_matchesStrictComparable":132}],56:[function(require,module,exports){
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

},{"./_baseIsEqual":45,"./_isKey":116,"./_isStrictComparable":120,"./_matchesStrictComparable":132,"./_toKey":154,"./get":168,"./hasIn":170}],57:[function(require,module,exports){
var Stack = require('./_Stack'),
    assignMergeValue = require('./_assignMergeValue'),
    baseFor = require('./_baseFor'),
    baseMergeDeep = require('./_baseMergeDeep'),
    isObject = require('./isObject'),
    keysIn = require('./keysIn');

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

},{"./_Stack":12,"./_assignMergeValue":25,"./_baseFor":34,"./_baseMergeDeep":58,"./isObject":186,"./keysIn":194}],58:[function(require,module,exports){
var assignMergeValue = require('./_assignMergeValue'),
    cloneBuffer = require('./_cloneBuffer'),
    cloneTypedArray = require('./_cloneTypedArray'),
    copyArray = require('./_copyArray'),
    initCloneObject = require('./_initCloneObject'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isArrayLikeObject = require('./isArrayLikeObject'),
    isBuffer = require('./isBuffer'),
    isFunction = require('./isFunction'),
    isObject = require('./isObject'),
    isPlainObject = require('./isPlainObject'),
    isTypedArray = require('./isTypedArray'),
    toPlainObject = require('./toPlainObject');

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

},{"./_assignMergeValue":25,"./_cloneBuffer":79,"./_cloneTypedArray":80,"./_copyArray":81,"./_initCloneObject":112,"./isArguments":176,"./isArray":177,"./isArrayLikeObject":179,"./isBuffer":180,"./isFunction":182,"./isObject":186,"./isPlainObject":188,"./isTypedArray":191,"./toPlainObject":210}],59:[function(require,module,exports){
var basePickBy = require('./_basePickBy'),
    hasIn = require('./hasIn');

/**
 * The base implementation of `_.pick` without support for individual
 * property identifiers.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @returns {Object} Returns the new object.
 */
function basePick(object, paths) {
  return basePickBy(object, paths, function(value, path) {
    return hasIn(object, path);
  });
}

module.exports = basePick;

},{"./_basePickBy":60,"./hasIn":170}],60:[function(require,module,exports){
var baseGet = require('./_baseGet'),
    baseSet = require('./_baseSet'),
    castPath = require('./_castPath');

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

},{"./_baseGet":36,"./_baseSet":65,"./_castPath":77}],61:[function(require,module,exports){
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

},{}],62:[function(require,module,exports){
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

},{"./_baseGet":36}],63:[function(require,module,exports){
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

},{}],64:[function(require,module,exports){
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

},{"./_overRest":140,"./_setToString":145,"./identity":171}],65:[function(require,module,exports){
var assignValue = require('./_assignValue'),
    castPath = require('./_castPath'),
    isIndex = require('./_isIndex'),
    isObject = require('./isObject'),
    toKey = require('./_toKey');

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

},{"./_assignValue":26,"./_castPath":77,"./_isIndex":114,"./_toKey":154,"./isObject":186}],66:[function(require,module,exports){
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

},{"./_defineProperty":90,"./constant":157,"./identity":171}],67:[function(require,module,exports){
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

},{}],68:[function(require,module,exports){
/**
 * The base implementation of `_.sum` and `_.sumBy` without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {number} Returns the sum.
 */
function baseSum(array, iteratee) {
  var result,
      index = -1,
      length = array.length;

  while (++index < length) {
    var current = iteratee(array[index]);
    if (current !== undefined) {
      result = result === undefined ? current : (result + current);
    }
  }
  return result;
}

module.exports = baseSum;

},{}],69:[function(require,module,exports){
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

},{}],70:[function(require,module,exports){
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

},{"./_Symbol":13,"./_arrayMap":22,"./isArray":177,"./isSymbol":190}],71:[function(require,module,exports){
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

},{}],72:[function(require,module,exports){
var SetCache = require('./_SetCache'),
    arrayIncludes = require('./_arrayIncludes'),
    arrayIncludesWith = require('./_arrayIncludesWith'),
    cacheHas = require('./_cacheHas'),
    createSet = require('./_createSet'),
    setToArray = require('./_setToArray');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

module.exports = baseUniq;

},{"./_SetCache":11,"./_arrayIncludes":19,"./_arrayIncludesWith":20,"./_cacheHas":74,"./_createSet":88,"./_setToArray":144}],73:[function(require,module,exports){
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

},{"./_arrayMap":22}],74:[function(require,module,exports){
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

},{}],75:[function(require,module,exports){
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

},{"./isArrayLikeObject":179}],76:[function(require,module,exports){
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

},{"./identity":171}],77:[function(require,module,exports){
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

},{"./_isKey":116,"./_stringToPath":153,"./isArray":177,"./toString":211}],78:[function(require,module,exports){
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

},{"./_Uint8Array":14}],79:[function(require,module,exports){
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

},{"./_root":141}],80:[function(require,module,exports){
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

},{"./_cloneArrayBuffer":78}],81:[function(require,module,exports){
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

},{}],82:[function(require,module,exports){
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

},{"./_assignValue":26,"./_baseAssignValue":28}],83:[function(require,module,exports){
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":141}],84:[function(require,module,exports){
var baseRest = require('./_baseRest'),
    isIterateeCall = require('./_isIterateeCall');

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

},{"./_baseRest":64,"./_isIterateeCall":115}],85:[function(require,module,exports){
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

},{"./isArrayLike":178}],86:[function(require,module,exports){
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

},{}],87:[function(require,module,exports){
var baseIteratee = require('./_baseIteratee'),
    isArrayLike = require('./isArrayLike'),
    keys = require('./keys');

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} findIndexFunc The function to find the collection index.
 * @returns {Function} Returns the new find function.
 */
function createFind(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!isArrayLike(collection)) {
      var iteratee = baseIteratee(predicate, 3);
      collection = keys(collection);
      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
    }
    var index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
  };
}

module.exports = createFind;

},{"./_baseIteratee":51,"./isArrayLike":178,"./keys":193}],88:[function(require,module,exports){
var Set = require('./_Set'),
    noop = require('./noop'),
    setToArray = require('./_setToArray');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set(values);
};

module.exports = createSet;

},{"./_Set":10,"./_setToArray":144,"./noop":199}],89:[function(require,module,exports){
var eq = require('./eq');

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

},{"./eq":159}],90:[function(require,module,exports){
var getNative = require('./_getNative');

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

module.exports = defineProperty;

},{"./_getNative":100}],91:[function(require,module,exports){
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

},{"./_SetCache":11,"./_arraySome":24,"./_cacheHas":74}],92:[function(require,module,exports){
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

},{"./_Symbol":13,"./_Uint8Array":14,"./_equalArrays":91,"./_mapToArray":131,"./_setToArray":144,"./eq":159}],93:[function(require,module,exports){
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

},{"./_getAllKeys":97}],94:[function(require,module,exports){
var basePropertyOf = require('./_basePropertyOf');

/** Used to map characters to HTML entities. */
var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

/**
 * Used by `_.escape` to convert characters to HTML entities.
 *
 * @private
 * @param {string} chr The matched character to escape.
 * @returns {string} Returns the escaped character.
 */
var escapeHtmlChar = basePropertyOf(htmlEscapes);

module.exports = escapeHtmlChar;

},{"./_basePropertyOf":63}],95:[function(require,module,exports){
var flatten = require('./flatten'),
    overRest = require('./_overRest'),
    setToString = require('./_setToString');

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

},{"./_overRest":140,"./_setToString":145,"./flatten":166}],96:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],97:[function(require,module,exports){
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

},{"./_baseGetAllKeys":37,"./_getSymbols":103,"./keys":193}],98:[function(require,module,exports){
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

},{"./_isKeyable":117}],99:[function(require,module,exports){
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

},{"./_isStrictComparable":120,"./keys":193}],100:[function(require,module,exports){
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

},{"./_baseIsNative":49,"./_getValue":105}],101:[function(require,module,exports){
var overArg = require('./_overArg');

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

module.exports = getPrototype;

},{"./_overArg":139}],102:[function(require,module,exports){
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

},{"./_Symbol":13}],103:[function(require,module,exports){
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

},{"./_arrayFilter":18,"./stubArray":203}],104:[function(require,module,exports){
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

},{"./_DataView":4,"./_Map":7,"./_Promise":9,"./_Set":10,"./_WeakMap":15,"./_baseGetTag":38,"./_toSource":155}],105:[function(require,module,exports){
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

},{}],106:[function(require,module,exports){
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

},{"./_castPath":77,"./_isIndex":114,"./_toKey":154,"./isArguments":176,"./isArray":177,"./isLength":183}],107:[function(require,module,exports){
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

},{"./_nativeCreate":134}],108:[function(require,module,exports){
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

},{}],109:[function(require,module,exports){
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

},{"./_nativeCreate":134}],110:[function(require,module,exports){
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

},{"./_nativeCreate":134}],111:[function(require,module,exports){
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

},{"./_nativeCreate":134}],112:[function(require,module,exports){
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

},{"./_baseCreate":29,"./_getPrototype":101,"./_isPrototype":119}],113:[function(require,module,exports){
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

},{"./_Symbol":13,"./isArguments":176,"./isArray":177}],114:[function(require,module,exports){
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

},{}],115:[function(require,module,exports){
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

},{"./_isIndex":114,"./eq":159,"./isArrayLike":178,"./isObject":186}],116:[function(require,module,exports){
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

},{"./isArray":177,"./isSymbol":190}],117:[function(require,module,exports){
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

},{}],118:[function(require,module,exports){
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

},{"./_coreJsData":83}],119:[function(require,module,exports){
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

},{}],120:[function(require,module,exports){
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

},{"./isObject":186}],121:[function(require,module,exports){
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

},{}],122:[function(require,module,exports){
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

},{"./_assocIndexOf":27}],123:[function(require,module,exports){
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

},{"./_assocIndexOf":27}],124:[function(require,module,exports){
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

},{"./_assocIndexOf":27}],125:[function(require,module,exports){
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

},{"./_assocIndexOf":27}],126:[function(require,module,exports){
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

},{"./_Hash":5,"./_ListCache":6,"./_Map":7}],127:[function(require,module,exports){
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

},{"./_getMapData":98}],128:[function(require,module,exports){
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

},{"./_getMapData":98}],129:[function(require,module,exports){
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

},{"./_getMapData":98}],130:[function(require,module,exports){
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

},{"./_getMapData":98}],131:[function(require,module,exports){
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

},{}],132:[function(require,module,exports){
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

},{}],133:[function(require,module,exports){
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

},{"./memoize":196}],134:[function(require,module,exports){
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":100}],135:[function(require,module,exports){
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

module.exports = nativeKeys;

},{"./_overArg":139}],136:[function(require,module,exports){
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

},{}],137:[function(require,module,exports){
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

},{"./_freeGlobal":96}],138:[function(require,module,exports){
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

},{}],139:[function(require,module,exports){
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

},{}],140:[function(require,module,exports){
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

},{"./_apply":16}],141:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":96}],142:[function(require,module,exports){
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

},{}],143:[function(require,module,exports){
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

},{}],144:[function(require,module,exports){
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

},{}],145:[function(require,module,exports){
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

},{"./_baseSetToString":66,"./_shortOut":146}],146:[function(require,module,exports){
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

},{}],147:[function(require,module,exports){
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

},{"./_ListCache":6}],148:[function(require,module,exports){
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

},{}],149:[function(require,module,exports){
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

},{}],150:[function(require,module,exports){
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

},{}],151:[function(require,module,exports){
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

},{"./_ListCache":6,"./_Map":7,"./_MapCache":8}],152:[function(require,module,exports){
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

},{}],153:[function(require,module,exports){
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

},{"./_memoizeCapped":133}],154:[function(require,module,exports){
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

},{"./isSymbol":190}],155:[function(require,module,exports){
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

},{}],156:[function(require,module,exports){
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

},{"./_copyObject":82,"./_createAssigner":84,"./keysIn":194}],157:[function(require,module,exports){
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

},{}],158:[function(require,module,exports){
var apply = require('./_apply'),
    assignInWith = require('./assignInWith'),
    baseRest = require('./_baseRest'),
    customDefaultsAssignIn = require('./_customDefaultsAssignIn');

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

},{"./_apply":16,"./_baseRest":64,"./_customDefaultsAssignIn":89,"./assignInWith":156}],159:[function(require,module,exports){
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

},{}],160:[function(require,module,exports){
var escapeHtmlChar = require('./_escapeHtmlChar'),
    toString = require('./toString');

/** Used to match HTML entities and HTML characters. */
var reUnescapedHtml = /[&<>"']/g,
    reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

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

module.exports = escape;

},{"./_escapeHtmlChar":94,"./toString":211}],161:[function(require,module,exports){
var toString = require('./toString');

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
    reHasRegExpChar = RegExp(reRegExpChar.source);

/**
 * Escapes the `RegExp` special characters "^", "$", "\", ".", "*", "+",
 * "?", "(", ")", "[", "]", "{", "}", and "|" in `string`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escapeRegExp('[lodash](https://lodash.com/)');
 * // => '\[lodash\]\(https://lodash\.com/\)'
 */
function escapeRegExp(string) {
  string = toString(string);
  return (string && reHasRegExpChar.test(string))
    ? string.replace(reRegExpChar, '\\$&')
    : string;
}

module.exports = escapeRegExp;

},{"./toString":211}],162:[function(require,module,exports){
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

},{"./_arrayFilter":18,"./_baseFilter":31,"./_baseIteratee":51,"./isArray":177}],163:[function(require,module,exports){
var createFind = require('./_createFind'),
    findIndex = require('./findIndex');

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.find(users, function(o) { return o.age < 40; });
 * // => object for 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.find(users, { 'age': 1, 'active': true });
 * // => object for 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.find(users, ['active', false]);
 * // => object for 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.find(users, 'active');
 * // => object for 'barney'
 */
var find = createFind(findIndex);

module.exports = find;

},{"./_createFind":87,"./findIndex":164}],164:[function(require,module,exports){
var baseFindIndex = require('./_baseFindIndex'),
    baseIteratee = require('./_baseIteratee'),
    toInteger = require('./toInteger');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This method is like `_.find` except that it returns the index of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.findIndex(users, function(o) { return o.user == 'barney'; });
 * // => 0
 *
 * // The `_.matches` iteratee shorthand.
 * _.findIndex(users, { 'user': 'fred', 'active': false });
 * // => 1
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findIndex(users, ['active', false]);
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.findIndex(users, 'active');
 * // => 2
 */
function findIndex(array, predicate, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return baseFindIndex(array, baseIteratee(predicate, 3), index);
}

module.exports = findIndex;

},{"./_baseFindIndex":32,"./_baseIteratee":51,"./toInteger":208}],165:[function(require,module,exports){
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

},{"./_baseFlatten":33,"./map":195}],166:[function(require,module,exports){
var baseFlatten = require('./_baseFlatten');

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

},{"./_baseFlatten":33}],167:[function(require,module,exports){
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

},{"./_arrayEach":17,"./_baseEach":30,"./_castFunction":76,"./isArray":177}],168:[function(require,module,exports){
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

},{"./_baseGet":36}],169:[function(require,module,exports){
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

},{"./_baseHas":39,"./_hasPath":106}],170:[function(require,module,exports){
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

},{"./_baseHasIn":40,"./_hasPath":106}],171:[function(require,module,exports){
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

},{}],172:[function(require,module,exports){
var baseInRange = require('./_baseInRange'),
    toFinite = require('./toFinite'),
    toNumber = require('./toNumber');

/**
 * Checks if `n` is between `start` and up to, but not including, `end`. If
 * `end` is not specified, it's set to `start` with `start` then set to `0`.
 * If `start` is greater than `end` the params are swapped to support
 * negative ranges.
 *
 * @static
 * @memberOf _
 * @since 3.3.0
 * @category Number
 * @param {number} number The number to check.
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 * @see _.range, _.rangeRight
 * @example
 *
 * _.inRange(3, 2, 4);
 * // => true
 *
 * _.inRange(4, 8);
 * // => true
 *
 * _.inRange(4, 2);
 * // => false
 *
 * _.inRange(2, 2);
 * // => false
 *
 * _.inRange(1.2, 2);
 * // => true
 *
 * _.inRange(5.2, 4);
 * // => false
 *
 * _.inRange(-3, -2, -6);
 * // => true
 */
function inRange(number, start, end) {
  start = toFinite(start);
  if (end === undefined) {
    end = start;
    start = 0;
  } else {
    end = toFinite(end);
  }
  number = toNumber(number);
  return baseInRange(number, start, end);
}

module.exports = inRange;

},{"./_baseInRange":41,"./toFinite":207,"./toNumber":209}],173:[function(require,module,exports){
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

},{"./_baseIndexOf":42,"./isArrayLike":178,"./isString":189,"./toInteger":208,"./values":213}],174:[function(require,module,exports){
var baseIndexOf = require('./_baseIndexOf'),
    toInteger = require('./toInteger');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Gets the index at which the first occurrence of `value` is found in `array`
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. If `fromIndex` is negative, it's used as the
 * offset from the end of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 * @example
 *
 * _.indexOf([1, 2, 1, 2], 2);
 * // => 1
 *
 * // Search from the `fromIndex`.
 * _.indexOf([1, 2, 1, 2], 2, 2);
 * // => 3
 */
function indexOf(array, value, fromIndex) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return baseIndexOf(array, value, index);
}

module.exports = indexOf;

},{"./_baseIndexOf":42,"./toInteger":208}],175:[function(require,module,exports){
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

},{"./_arrayMap":22,"./_baseIntersection":43,"./_baseRest":64,"./_castArrayLikeObject":75}],176:[function(require,module,exports){
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

},{"./_baseIsArguments":44,"./isObjectLike":187}],177:[function(require,module,exports){
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

},{}],178:[function(require,module,exports){
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

},{"./isFunction":182,"./isLength":183}],179:[function(require,module,exports){
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

},{"./isArrayLike":178,"./isObjectLike":187}],180:[function(require,module,exports){
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

},{"./_root":141,"./stubFalse":204}],181:[function(require,module,exports){
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

},{"./_baseKeys":52,"./_getTag":104,"./_isPrototype":119,"./isArguments":176,"./isArray":177,"./isArrayLike":178,"./isBuffer":180,"./isTypedArray":191}],182:[function(require,module,exports){
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

},{"./_baseGetTag":38,"./isObject":186}],183:[function(require,module,exports){
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

},{}],184:[function(require,module,exports){
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

},{"./isNumber":185}],185:[function(require,module,exports){
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

},{"./_baseGetTag":38,"./isObjectLike":187}],186:[function(require,module,exports){
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

},{}],187:[function(require,module,exports){
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

},{}],188:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    getPrototype = require('./_getPrototype'),
    isObjectLike = require('./isObjectLike');

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

},{"./_baseGetTag":38,"./_getPrototype":101,"./isObjectLike":187}],189:[function(require,module,exports){
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

},{"./_baseGetTag":38,"./isArray":177,"./isObjectLike":187}],190:[function(require,module,exports){
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

},{"./_baseGetTag":38,"./isObjectLike":187}],191:[function(require,module,exports){
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

},{"./_baseIsTypedArray":50,"./_baseUnary":71,"./_nodeUtil":137}],192:[function(require,module,exports){
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

},{}],193:[function(require,module,exports){
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

},{"./_arrayLikeKeys":21,"./_baseKeys":52,"./isArrayLike":178}],194:[function(require,module,exports){
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

},{"./_arrayLikeKeys":21,"./_baseKeysIn":53,"./isArrayLike":178}],195:[function(require,module,exports){
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

},{"./_arrayMap":22,"./_baseIteratee":51,"./_baseMap":54,"./isArray":177}],196:[function(require,module,exports){
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

},{"./_MapCache":8}],197:[function(require,module,exports){
var baseMerge = require('./_baseMerge'),
    createAssigner = require('./_createAssigner');

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

},{"./_baseMerge":57,"./_createAssigner":84}],198:[function(require,module,exports){
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

},{}],199:[function(require,module,exports){
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

},{}],200:[function(require,module,exports){
var basePick = require('./_basePick'),
    flatRest = require('./_flatRest');

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to pick.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pick(object, ['a', 'c']);
 * // => { 'a': 1, 'c': 3 }
 */
var pick = flatRest(function(object, paths) {
  return object == null ? {} : basePick(object, paths);
});

module.exports = pick;

},{"./_basePick":59,"./_flatRest":95}],201:[function(require,module,exports){
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

},{"./_baseProperty":61,"./_basePropertyDeep":62,"./_isKey":116,"./_toKey":154}],202:[function(require,module,exports){
var arrayFilter = require('./_arrayFilter'),
    baseFilter = require('./_baseFilter'),
    baseIteratee = require('./_baseIteratee'),
    isArray = require('./isArray'),
    negate = require('./negate');

/**
 * The opposite of `_.filter`; this method returns the elements of `collection`
 * that `predicate` does **not** return truthy for.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 * @see _.filter
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': false },
 *   { 'user': 'fred',   'age': 40, 'active': true }
 * ];
 *
 * _.reject(users, function(o) { return !o.active; });
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.reject(users, { 'age': 40, 'active': true });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.reject(users, ['active', false]);
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.reject(users, 'active');
 * // => objects for ['barney']
 */
function reject(collection, predicate) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(collection, negate(baseIteratee(predicate, 3)));
}

module.exports = reject;

},{"./_arrayFilter":18,"./_baseFilter":31,"./_baseIteratee":51,"./isArray":177,"./negate":198}],203:[function(require,module,exports){
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

},{}],204:[function(require,module,exports){
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

},{}],205:[function(require,module,exports){
var baseSum = require('./_baseSum'),
    identity = require('./identity');

/**
 * Computes the sum of the values in `array`.
 *
 * @static
 * @memberOf _
 * @since 3.4.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {number} Returns the sum.
 * @example
 *
 * _.sum([4, 2, 8, 6]);
 * // => 20
 */
function sum(array) {
  return (array && array.length)
    ? baseSum(array, identity)
    : 0;
}

module.exports = sum;

},{"./_baseSum":68,"./identity":171}],206:[function(require,module,exports){
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

},{"./_baseSlice":67,"./toInteger":208}],207:[function(require,module,exports){
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

},{"./toNumber":209}],208:[function(require,module,exports){
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

},{"./toFinite":207}],209:[function(require,module,exports){
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

},{"./isObject":186,"./isSymbol":190}],210:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    keysIn = require('./keysIn');

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

},{"./_copyObject":82,"./keysIn":194}],211:[function(require,module,exports){
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

},{"./_baseToString":70}],212:[function(require,module,exports){
var baseIteratee = require('./_baseIteratee'),
    baseUniq = require('./_baseUniq');

/**
 * This method is like `_.uniq` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the criterion by which
 * uniqueness is computed. The order of result values is determined by the
 * order they occur in the array. The iteratee is invoked with one argument:
 * (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee=_.identity] The iteratee invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
 * // => [2.1, 1.2]
 *
 * // The `_.property` iteratee shorthand.
 * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }, { 'x': 2 }]
 */
function uniqBy(array, iteratee) {
  return (array && array.length) ? baseUniq(array, baseIteratee(iteratee, 2)) : [];
}

module.exports = uniqBy;

},{"./_baseIteratee":51,"./_baseUniq":72}],213:[function(require,module,exports){
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

},{"./_baseValues":73,"./keys":193}],214:[function(require,module,exports){
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

},{}],215:[function(require,module,exports){
(function (global){
/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],216:[function(require,module,exports){
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

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],217:[function(require,module,exports){
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

'use strict';

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

},{}],218:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":216,"./encode":217}],219:[function(require,module,exports){
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

},{}],220:[function(require,module,exports){
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

'use strict';

var punycode = require('punycode');
var util = require('./util');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

},{"./util":221,"punycode":215,"querystring":218}],221:[function(require,module,exports){
'use strict';

module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};

},{}],222:[function(require,module,exports){
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

},{}],223:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],224:[function(require,module,exports){
(function (process,global){
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

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":223,"_process":214,"inherits":222}],225:[function(require,module,exports){
"use strict";
/* eslint-disable no-unused-vars */
/**
 * Represents the defaults of an assessment.
 */

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Assessment = function () {
  function Assessment() {
    _classCallCheck(this, Assessment);
  }

  _createClass(Assessment, [{
    key: "getResult",

    /**
     * Executes the assessment and return its result.
     *
     * @param {Paper} paper The paper to run this assessment on.
     * @param {Researcher} researcher The researcher used for the assessment.
     * @param {object} i18n The i18n-object used for parsing translations.
     *
     * @returns {AssessmentResult} The result of the assessment.
     */
    value: function getResult(paper, researcher, i18n) {
      throw "The method getResult is not implemented";
    }
    /**
     * Checks whether the assessment is applicable
     *
     * @param {Paper} paper The paper to use for the assessment.
     *
     * @returns {boolean} True.
     */

  }, {
    key: "isApplicable",
    value: function isApplicable(paper) {
      return true;
    }
  }]);

  return Assessment;
}();
/* eslint-enable no-unused-vars */

module.exports = Assessment;



},{}],226:[function(require,module,exports){
"use strict";

var AssessmentResult = require("../../values/AssessmentResult.js");
var isEmpty = require("lodash/isEmpty");
/**
 * Returns a score and text based on the linkStatistics object.
 *
 * @param {object} linkStatistics The object with all linkstatistics.
 * @param {object} i18n The object used for translations
 * @returns {object} resultObject with score and text
 */
var calculateLinkStatisticsResult = function calculateLinkStatisticsResult(linkStatistics, i18n) {
    if (linkStatistics.internalTotal === 0) {
        return {
            score: 3,
            text: i18n.dgettext("js-text-analysis", "No internal links appear in this page, consider adding some as appropriate.")
        };
    }
    if (linkStatistics.internalNofollow === linkStatistics.total) {
        return {
            score: 7,
            /* Translators: %1$s expands the number of internal links */
            text: i18n.sprintf(i18n.dgettext("js-text-analysis", "This page has %1$s internal link(s), all nofollowed."), linkStatistics.internalNofollow)
        };
    }
    if (linkStatistics.internalNofollow < linkStatistics.internalTotal) {
        return {
            score: 8,
            /* Translators: %1$s expands to the number of nofollow links, %2$s to the number of internal links */
            text: i18n.sprintf(i18n.dgettext("js-text-analysis", "This page has %1$s nofollowed internal link(s) and %2$s normal internal link(s)."), linkStatistics.internalNofollow, linkStatistics.internalDofollow)
        };
    }
    if (linkStatistics.internalDofollow === linkStatistics.total) {
        return {
            score: 9,
            /* Translators: %1$s expands to the number of internal links */
            text: i18n.sprintf(i18n.dgettext("js-text-analysis", "This page has %1$s internal link(s)."), linkStatistics.internalTotal)
        };
    }
    return {};
};
/**
 * Runs the getLinkStatistics module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var textHasInternalLinksAssessment = function textHasInternalLinksAssessment(paper, researcher, i18n) {
    var linkStatistics = researcher.getResearch("getLinkStatistics");
    var assessmentResult = new AssessmentResult();
    if (!isEmpty(linkStatistics)) {
        var linkStatisticsResult = calculateLinkStatisticsResult(linkStatistics, i18n);
        assessmentResult.setScore(linkStatisticsResult.score);
        assessmentResult.setText(linkStatisticsResult.text);
    }
    return assessmentResult;
};
module.exports = {
    identifier: "internalLinks",
    getResult: textHasInternalLinksAssessment,
    isApplicable: function isApplicable(paper) {
        return paper.hasText();
    }
};



},{"../../values/AssessmentResult.js":387,"lodash/isEmpty":181}],227:[function(require,module,exports){
"use strict";

var AssessmentResult = require("../../values/AssessmentResult.js");
/**
 * Returns a score and text based on the firstParagraph object.
 *
 * @param {object} firstParagraphMatches The object with all firstParagraphMatches.
 * @param {object} i18n The object used for translations
 * @returns {object} resultObject with score and text
 */
var calculateFirstParagraphResult = function calculateFirstParagraphResult(firstParagraphMatches, i18n) {
    if (firstParagraphMatches > 0) {
        return {
            score: 9,
            text: i18n.dgettext("js-text-analysis", "The focus keyword appears in the first paragraph of the copy.")
        };
    }
    return {
        score: 3,
        text: i18n.dgettext("js-text-analysis", "The focus keyword doesn\'t appear in the first paragraph of the copy. " + "Make sure the topic is clear immediately.")
    };
};
/**
 * Runs the findKeywordInFirstParagraph module, based on this returns an assessment result with score.
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var introductionHasKeywordAssessment = function introductionHasKeywordAssessment(paper, researcher, i18n) {
    var firstParagraphMatches = researcher.getResearch("firstParagraph");
    var firstParagraphResult = calculateFirstParagraphResult(firstParagraphMatches, i18n);
    var assessmentResult = new AssessmentResult();
    assessmentResult.setScore(firstParagraphResult.score);
    assessmentResult.setText(firstParagraphResult.text);
    return assessmentResult;
};
module.exports = {
    identifier: "introductionKeyword",
    getResult: introductionHasKeywordAssessment,
    isApplicable: function isApplicable(paper) {
        return paper.hasKeyword();
    }
};



},{"../../values/AssessmentResult.js":387}],228:[function(require,module,exports){
"use strict";

var AssessmentResult = require("../../values/AssessmentResult.js");
/**
 * Assesses the keyphrase presence and length
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {Researcher} researcher The researcher used for calling research.
 * @param {Jed} i18n The object used for translations
 * @returns {AssessmentResult} The result of this assessment
*/
function keyphraseAssessment(paper, researcher, i18n) {
    var keyphraseLength = researcher.getResearch("keyphraseLength");
    var assessmentResult = new AssessmentResult();
    if (!paper.hasKeyword()) {
        assessmentResult.setScore(-999);
        assessmentResult.setText(i18n.dgettext("js-text-analysis", "No focus keyword was set for this page. " + "If you do not set a focus keyword, no score can be calculated."));
    } else if (keyphraseLength > 10) {
        assessmentResult.setScore(0);
        assessmentResult.setText(i18n.dgettext("js-text-analysis", "The keyphrase is over 10 words, a keyphrase should be shorter."));
    }
    return assessmentResult;
}
module.exports = {
    identifier: "keyphraseLength",
    getResult: keyphraseAssessment
};



},{"../../values/AssessmentResult.js":387}],229:[function(require,module,exports){
"use strict";

var AssessmentResult = require("../../values/AssessmentResult.js");
var matchWords = require("../../stringProcessing/matchTextWithWord.js");
var countWords = require("../../stringProcessing/countWords.js");
var formatNumber = require("../../helpers/formatNumber.js");
var inRange = require("../../helpers/inRange.js");
var inRangeEndInclusive = inRange.inRangeEndInclusive;
var inRangeStartInclusive = inRange.inRangeStartInclusive;
var inRangeStartEndInclusive = inRange.inRangeStartEndInclusive;
/**
 * Returns the scores and text for keyword density
 *
 * @param {string} keywordDensity The keyword density
 * @param {object} i18n The i18n object used for translations
 * @param {number} keywordCount The number of times the keyword has been found in the text.
 * @returns {{score: number, text: *}} The assessment result
 */
var calculateKeywordDensityResult = function calculateKeywordDensityResult(keywordDensity, i18n, keywordCount) {
    var score, text, max;
    var roundedKeywordDensity = formatNumber(keywordDensity);
    var keywordDensityPercentage = roundedKeywordDensity + "%";
    if (roundedKeywordDensity > 3.5) {
        score = -50;
        /* Translators: %1$s expands to the keyword density percentage, %2$d expands to the keyword count,
        %3$s expands to the maximum keyword density percentage. */
        text = i18n.dgettext("js-text-analysis", "The keyword density is %1$s," + " which is way over the advised %3$s maximum;" + " the focus keyword was found %2$d times.");
        max = "2.5%";
        text = i18n.sprintf(text, keywordDensityPercentage, keywordCount, max);
    }
    if (inRangeEndInclusive(roundedKeywordDensity, 2.5, 3.5)) {
        score = -10;
        /* Translators: %1$s expands to the keyword density percentage, %2$d expands to the keyword count,
        %3$s expands to the maximum keyword density percentage. */
        text = i18n.dgettext("js-text-analysis", "The keyword density is %1$s," + " which is over the advised %3$s maximum;" + " the focus keyword was found %2$d times.");
        max = "2.5%";
        text = i18n.sprintf(text, keywordDensityPercentage, keywordCount, max);
    }
    if (inRangeStartEndInclusive(roundedKeywordDensity, 0.5, 2.5)) {
        score = 9;
        /* Translators: %1$s expands to the keyword density percentage, %2$d expands to the keyword count. */
        text = i18n.dgettext("js-text-analysis", "The keyword density is %1$s, which is great;" + " the focus keyword was found %2$d times.");
        text = i18n.sprintf(text, keywordDensityPercentage, keywordCount);
    }
    if (inRangeStartInclusive(roundedKeywordDensity, 0, 0.5)) {
        score = 4;
        /* Translators: %1$s expands to the keyword density percentage, %2$d expands to the keyword count. */
        text = i18n.dgettext("js-text-analysis", "The keyword density is %1$s, which is too low;" + " the focus keyword was found %2$d times.");
        text = i18n.sprintf(text, keywordDensityPercentage, keywordCount);
    }
    return {
        score: score,
        text: text
    };
};
/**
 * Runs the getkeywordDensity module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var keywordDensityAssessment = function keywordDensityAssessment(paper, researcher, i18n) {
    var keywordDensity = researcher.getResearch("getKeywordDensity");
    var keywordCount = matchWords(paper.getText(), paper.getKeyword(), paper.getLocale());
    var keywordDensityResult = calculateKeywordDensityResult(keywordDensity, i18n, keywordCount);
    var assessmentResult = new AssessmentResult();
    assessmentResult.setScore(keywordDensityResult.score);
    assessmentResult.setText(keywordDensityResult.text);
    return assessmentResult;
};
module.exports = {
    identifier: "keywordDensity",
    getResult: keywordDensityAssessment,
    isApplicable: function isApplicable(paper) {
        return paper.hasText() && paper.hasKeyword() && countWords(paper.getText()) >= 100;
    }
};



},{"../../helpers/formatNumber.js":258,"../../helpers/inRange.js":264,"../../stringProcessing/countWords.js":351,"../../stringProcessing/matchTextWithWord.js":368,"../../values/AssessmentResult.js":387}],230:[function(require,module,exports){
"use strict";

var AssessmentResult = require("../../values/AssessmentResult.js");
var getLanguageAvailability = require("../../helpers/getLanguageAvailability.js");
var availableLanguages = ["en"];
/**
 * Calculate the score based on the amount of stop words in the keyword.
 * @param {number} stopWordCount The amount of stop words to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var calculateStopWordsCountResult = function calculateStopWordsCountResult(stopWordCount, i18n) {
    if (stopWordCount > 0) {
        return {
            score: 0,
            text: i18n.dngettext("js-text-analysis",
            /* Translators: %1$s opens a link to a Yoast article about stop words, %2$s closes the link */
            "The focus keyword contains a stop word. This may or may not be wise depending on the circumstances. " + "%1$sLearn more about the stop words%2$s.", "The focus keyword contains %3$d stop words. This may or may not be wise depending on the circumstances. " + "%1$sLearn more about the stop words%2$s.", stopWordCount)
        };
    }
    return {};
};
/**
 * Execute the Assessment and return a result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var keywordHasStopWordsAssessment = function keywordHasStopWordsAssessment(paper, researcher, i18n) {
    var stopWords = researcher.getResearch("stopWordsInKeyword");
    var stopWordsResult = calculateStopWordsCountResult(stopWords.length, i18n);
    var assessmentResult = new AssessmentResult();
    assessmentResult.setScore(stopWordsResult.score);
    assessmentResult.setText(i18n.sprintf(stopWordsResult.text, "<a href='https://yoa.st/stopwords/' target='_blank'>", "</a>", stopWords.length));
    return assessmentResult;
};
module.exports = {
    identifier: "keywordStopWords",
    getResult: keywordHasStopWordsAssessment,
    isApplicable: function isApplicable(paper) {
        var isLanguageAvailable = getLanguageAvailability(paper.getLocale(), availableLanguages);
        return paper.hasKeyword() && isLanguageAvailable;
    }
};



},{"../../helpers/getLanguageAvailability.js":261,"../../values/AssessmentResult.js":387}],231:[function(require,module,exports){
"use strict";

var AssessmentResult = require("../../values/AssessmentResult.js");
/**
 * Returns the score and text for the description keyword match.
 * @param {number} keywordMatches The number of keyword matches in the description.
 * @param {object} i18n The i18n object used for translations.
 * @returns {Object} An object with values for the assessment result.
 */
var calculateKeywordMatchesResult = function calculateKeywordMatchesResult(keywordMatches, i18n) {
    if (keywordMatches > 0) {
        return {
            score: 9,
            text: i18n.dgettext("js-text-analysis", "The meta description contains the focus keyword.")
        };
    }
    if (keywordMatches === 0) {
        return {
            score: 3,
            text: i18n.dgettext("js-text-analysis", "A meta description has been specified, but it does not contain the focus keyword.")
        };
    }
    return {};
};
/**
 * Runs the metaDescription keyword module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var metaDescriptionHasKeywordAssessment = function metaDescriptionHasKeywordAssessment(paper, researcher, i18n) {
    var keywordMatches = researcher.getResearch("metaDescriptionKeyword");
    var descriptionLengthResult = calculateKeywordMatchesResult(keywordMatches, i18n);
    var assessmentResult = new AssessmentResult();
    assessmentResult.setScore(descriptionLengthResult.score);
    assessmentResult.setText(descriptionLengthResult.text);
    return assessmentResult;
};
module.exports = {
    identifier: "metaDescriptionKeyword",
    getResult: metaDescriptionHasKeywordAssessment,
    isApplicable: function isApplicable(paper) {
        return paper.hasKeyword();
    }
};



},{"../../values/AssessmentResult.js":387}],232:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var AssessmentResult = require("../../values/AssessmentResult.js");
var Assessment = require("../../assessment.js");
var merge = require("lodash/merge");
/**
 * Assessment for calculating the length of the meta description.
 */

var MetaDescriptionLengthAssessment = function (_Assessment) {
    _inherits(MetaDescriptionLengthAssessment, _Assessment);

    /**
     * Sets the identifier and the config.
     *
     * @param {object} config The configuration to use.
     *
     * @returns {void}
     */
    function MetaDescriptionLengthAssessment() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, MetaDescriptionLengthAssessment);

        var _this = _possibleConstructorReturn(this, (MetaDescriptionLengthAssessment.__proto__ || Object.getPrototypeOf(MetaDescriptionLengthAssessment)).call(this));

        var defaultConfig = {
            recommendedMaximumLength: 120,
            maximumLength: 320,
            scores: {
                noMetaDescription: 1,
                tooLong: 6,
                tooShort: 6,
                correctLength: 9
            }
        };
        _this.identifier = "metaDescriptionLength";
        _this._config = merge(defaultConfig, config);
        return _this;
    }
    /**
     * Runs the metaDescriptionLength module, based on this returns an assessment result with score.
     *
     * @param {Paper} paper The paper to use for the assessment.
     * @param {Researcher} researcher The researcher used for calling research.
     * @param {object} i18n The object used for translations
     *
     * @returns {AssessmentResult} The assessment result.
     */

    _createClass(MetaDescriptionLengthAssessment, [{
        key: "getResult",
        value: function getResult(paper, researcher, i18n) {
            var descriptionLength = researcher.getResearch("metaDescriptionLength");
            var assessmentResult = new AssessmentResult();
            assessmentResult.setScore(this.calculateScore(descriptionLength));
            assessmentResult.setText(this.translateScore(descriptionLength, i18n));
            return assessmentResult;
        }
        /**
         * Returns the score for the descriptionLength.
         *
         * @param {number} descriptionLength The length of the metadescription.
         *
         * @returns {number} The calculated score.
         */

    }, {
        key: "calculateScore",
        value: function calculateScore(descriptionLength) {
            if (descriptionLength === 0) {
                return this._config.scores.noMetaDescription;
            }
            if (descriptionLength <= this._config.recommendedMaximumLength) {
                return this._config.scores.tooShort;
            }
            if (descriptionLength > this._config.maximumLength) {
                return this._config.scores.tooLong;
            }
            if (descriptionLength >= this._config.recommendedMaximumLength && descriptionLength <= this._config.maximumLength) {
                return this._config.scores.correctLength;
            }
            return 0;
        }
        /**
         * Translates the descriptionLength to a message the user can understand.
         *
         * @param {number} descriptionLength The length of the metadescription.
         * @param {object} i18n The object used for translations.
         *
         * @returns {string} The translated string.
         */

    }, {
        key: "translateScore",
        value: function translateScore(descriptionLength, i18n) {
            if (descriptionLength === 0) {
                return i18n.dgettext("js-text-analysis", "No meta description has been specified. " + "Search engines will display copy from the page instead.");
            }
            if (descriptionLength <= this._config.recommendedMaximumLength) {
                return i18n.sprintf(i18n.dgettext("js-text-analysis", "The meta description is under %1$d characters long. " + "However, up to %2$d characters are available."), this._config.recommendedMaximumLength, this._config.maximumLength);
            }
            if (descriptionLength > this._config.maximumLength) {
                return i18n.sprintf(i18n.dgettext("js-text-analysis", "The meta description is over %1$d characters. " + "Reducing the length will ensure the entire description will be visible."), this._config.maximumLength);
            }
            if (descriptionLength >= this._config.recommendedMaximumLength && descriptionLength <= this._config.maximumLength) {
                return i18n.dgettext("js-text-analysis", "The meta description has a nice length.");
            }
        }
    }]);

    return MetaDescriptionLengthAssessment;
}(Assessment);

module.exports = MetaDescriptionLengthAssessment;



},{"../../assessment.js":225,"../../values/AssessmentResult.js":387,"lodash/merge":197}],233:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var AssessmentResult = require("../../values/AssessmentResult.js");
var Assessment = require("../../assessment.js");
var isEmpty = require("lodash/isEmpty");
var merge = require("lodash/merge");
/**
 * Assessment for calculating the outbound links in the text.
 */

var OutboundLinksAssessment = function (_Assessment) {
    _inherits(OutboundLinksAssessment, _Assessment);

    /**
     * Sets the identifier and the config.
     *
     * @param {object} config The configuration to use.
     *
     * @returns {void}
     */
    function OutboundLinksAssessment() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, OutboundLinksAssessment);

        var _this = _possibleConstructorReturn(this, (OutboundLinksAssessment.__proto__ || Object.getPrototypeOf(OutboundLinksAssessment)).call(this));

        var defaultConfig = {
            scores: {
                noLinks: 6,
                allNofollowed: 7,
                moreNoFollowed: 8,
                allFollowed: 9
            }
        };
        _this.identifier = "externalLinks";
        _this._config = merge(defaultConfig, config);
        return _this;
    }
    /**
     * Runs the getLinkStatistics module, based on this returns an assessment result with score.
     *
     * @param {Paper} paper The paper to use for the assessment.
     * @param {Researcher} researcher The researcher used for calling research.
     * @param {object} i18n The object used for translations
     *
     * @returns {AssessmentResult} The assessment result.
     */

    _createClass(OutboundLinksAssessment, [{
        key: "getResult",
        value: function getResult(paper, researcher, i18n) {
            var linkStatistics = researcher.getResearch("getLinkStatistics");
            var assessmentResult = new AssessmentResult();
            if (!isEmpty(linkStatistics)) {
                assessmentResult.setScore(this.calculateScore(linkStatistics));
                assessmentResult.setText(this.translateScore(linkStatistics, i18n));
            }
            return assessmentResult;
        }
        /**
         * Checks whether paper has text.
         *
         * @param {Paper} paper The paper to use for the assessment.
         *
         * @returns {boolean} True when there is text.
         */

    }, {
        key: "isApplicable",
        value: function isApplicable(paper) {
            return paper.hasText();
        }
        /**
         * Returns a score based on the linkStatistics object.
         *
         * @param {object} linkStatistics The object with all link statistics.
         *
         * @returns {number|null} The calculated score.
         */

    }, {
        key: "calculateScore",
        value: function calculateScore(linkStatistics) {
            if (linkStatistics.externalTotal === 0) {
                return this._config.scores.noLinks;
            }
            if (linkStatistics.externalNofollow === linkStatistics.total) {
                return this._config.scores.allNofollowed;
            }
            if (linkStatistics.externalNofollow < linkStatistics.externalTotal) {
                return this._config.scores.moreNoFollowed;
            }
            if (linkStatistics.externalDofollow === linkStatistics.total) {
                return this._config.scores.allFollowed;
            }
            return null;
        }
        /**
         * Translates the score to a message the user can understand.
         *
         * @param {object} linkStatistics The object with all link statistics.
         * @param {object} i18n The object used for translations.
         *
         * @returns {string} The translated string.
         */

    }, {
        key: "translateScore",
        value: function translateScore(linkStatistics, i18n) {
            if (linkStatistics.externalTotal === 0) {
                return i18n.dgettext("js-text-analysis", "No outbound links appear in this page, consider adding some as appropriate.");
            }
            if (linkStatistics.externalNofollow === linkStatistics.total) {
                /* Translators: %1$s expands the number of outbound links */
                return i18n.sprintf(i18n.dgettext("js-text-analysis", "This page has %1$s outbound link(s), all nofollowed."), linkStatistics.externalNofollow);
            }
            if (linkStatistics.externalNofollow < linkStatistics.externalTotal) {
                /* Translators: %1$s expands to the number of nofollow links, %2$s to the number of outbound links */
                return i18n.sprintf(i18n.dgettext("js-text-analysis", "This page has %1$s nofollowed outbound link(s) and %2$s normal outbound link(s)."), linkStatistics.externalNofollow, linkStatistics.externalDofollow);
            }
            if (linkStatistics.externalDofollow === linkStatistics.total) {
                /* Translators: %1$s expands to the number of outbound links */
                return i18n.sprintf(i18n.dgettext("js-text-analysis", "This page has %1$s outbound link(s)."), linkStatistics.externalTotal);
            }
            return "";
        }
    }]);

    return OutboundLinksAssessment;
}(Assessment);

module.exports = OutboundLinksAssessment;



},{"../../assessment.js":225,"../../values/AssessmentResult.js":387,"lodash/isEmpty":181,"lodash/merge":197}],234:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var AssessmentResult = require("../../values/AssessmentResult.js");
var Assessment = require("../../assessment.js");
var inRange = require("../../helpers/inRange").inRangeEndInclusive;
var merge = require("lodash/merge");
/**
 * Represents the assessmenth that will calculate if the width of the page title is correct.
 */

var PageTitleWidthAssesment = function (_Assessment) {
    _inherits(PageTitleWidthAssesment, _Assessment);

    /**
     * Sets the identifier and the config.
     *
     * @param {object} config The configuration to use.
     *
     * @returns {void}
     */
    function PageTitleWidthAssesment() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, PageTitleWidthAssesment);

        var _this = _possibleConstructorReturn(this, (PageTitleWidthAssesment.__proto__ || Object.getPrototypeOf(PageTitleWidthAssesment)).call(this));

        var defaultConfig = {
            minLength: 400,
            maxLength: 600,
            scores: {
                noTitle: 1,
                widthTooShort: 6,
                widthTooLong: 6,
                widthCorrect: 9
            }
        };
        _this.identifier = "titleWidth";
        _this._config = merge(defaultConfig, config);
        return _this;
    }
    /**
     * Runs the pageTitleWidth module, based on this returns an assessment result with score.
     *
     * @param {Paper} paper The paper to use for the assessment.
     * @param {Researcher} researcher The researcher used for calling research.
     * @param {object} i18n The object used for translations
     *
     * @returns {AssessmentResult} The assessment result.
     */

    _createClass(PageTitleWidthAssesment, [{
        key: "getResult",
        value: function getResult(paper, researcher, i18n) {
            var pageTitleWidth = researcher.getResearch("pageTitleWidth");
            var assessmentResult = new AssessmentResult();
            assessmentResult.setScore(this.calculateScore(pageTitleWidth));
            assessmentResult.setText(this.translateScore(pageTitleWidth, i18n));
            return assessmentResult;
        }
        /**
         * Returns the score for the pageTitleWidth
         *
         * @param {number} pageTitleWidth The width of the pageTitle.
         *
         * @returns {number} The calculated score.
         */

    }, {
        key: "calculateScore",
        value: function calculateScore(pageTitleWidth) {
            if (inRange(pageTitleWidth, 1, 400)) {
                return this._config.scores.widthTooShort;
            }
            if (inRange(pageTitleWidth, this._config.minLength, this._config.maxLength)) {
                return this._config.scores.widthCorrect;
            }
            if (pageTitleWidth > this._config.maxLength) {
                return this._config.scores.widthTooLong;
            }
            return this._config.scores.noTitle;
        }
        /**
         * Translates the pageTitleWidth score to a message the user can understand.
         *
         * @param {number} pageTitleWidth The width of the pageTitle.
         * @param {object} i18n The object used for translations.
         *
         * @returns {string} The translated string.
         */

    }, {
        key: "translateScore",
        value: function translateScore(pageTitleWidth, i18n) {
            if (inRange(pageTitleWidth, 1, 400)) {
                return i18n.dgettext("js-text-analysis", "The SEO title is too short. Use the space to add keyword variations or create compelling call-to-action copy.");
            }
            if (inRange(pageTitleWidth, this._config.minLength, this._config.maxLength)) {
                return i18n.dgettext("js-text-analysis", "The SEO title has a nice length.");
            }
            if (pageTitleWidth > this._config.maxLength) {
                return i18n.dgettext("js-text-analysis", "The SEO title is wider than the viewable limit.");
            }
            return i18n.dgettext("js-text-analysis", "Please create an SEO title.");
        }
    }]);

    return PageTitleWidthAssesment;
}(Assessment);

module.exports = PageTitleWidthAssesment;



},{"../../assessment.js":225,"../../helpers/inRange":264,"../../values/AssessmentResult.js":387,"lodash/merge":197}],235:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var AssessmentResult = require("../../values/AssessmentResult.js");
var Assessment = require("../../assessment.js");
var merge = require("lodash/merge");
/**
 * Represents the assessment that checks if the keyword is present in one of the subheadings.
 */

var SubHeadingsKeywordAssessment = function (_Assessment) {
    _inherits(SubHeadingsKeywordAssessment, _Assessment);

    /**
     * Sets the identifier and the config.
     *
     * @param {object} config The configuration to use.
     *
     * @returns {void}
     */
    function SubHeadingsKeywordAssessment() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, SubHeadingsKeywordAssessment);

        var _this = _possibleConstructorReturn(this, (SubHeadingsKeywordAssessment.__proto__ || Object.getPrototypeOf(SubHeadingsKeywordAssessment)).call(this));

        var defaultConfig = {
            scores: {
                noMatches: 6,
                oneMatch: 9,
                multipleMatches: 9
            }
        };
        _this.identifier = "subheadingsKeyword";
        _this._config = merge(defaultConfig, config);
        return _this;
    }
    /**
     * Runs the match keyword in subheadings module, based on this returns an assessment result with score.
     *
     * @param {Paper} paper The paper to use for the assessment.
     * @param {Researcher} researcher The researcher used for calling research.
     * @param {object} i18n The object used for translations.
     *
     * @returns {AssessmentResult} The assessment result.
     */

    _createClass(SubHeadingsKeywordAssessment, [{
        key: "getResult",
        value: function getResult(paper, researcher, i18n) {
            var subHeadings = researcher.getResearch("matchKeywordInSubheadings");
            var assessmentResult = new AssessmentResult();
            var score = this.calculateScore(subHeadings);
            assessmentResult.setScore(score);
            assessmentResult.setText(this.translateScore(score, subHeadings, i18n));
            return assessmentResult;
        }
        /**
         * Checks whether the paper has a text and a keyword.
         *
         * @param {Paper} paper The paper to use for the assessment.
         *
         * @returns {boolean} True when there is text and a keyword.
         */

    }, {
        key: "isApplicable",
        value: function isApplicable(paper) {
            return paper.hasText() && paper.hasKeyword();
        }
        /**
         * Returns the score for the subheadings.
         *
         * @param {object} subHeadings The object with all subHeadings matches.
         *
         * @returns {number|null} The calculated score.
         */

    }, {
        key: "calculateScore",
        value: function calculateScore(subHeadings) {
            if (subHeadings.matches === 0) {
                return this._config.scores.noMatches;
            }
            if (subHeadings.matches === 1) {
                return this._config.scores.oneMatch;
            }
            if (subHeadings.matches > 1) {
                return this._config.scores.multipleMatches;
            }
            return null;
        }
        /**
         * Translates the score to a message the user can understand.
         *
         * @param {number} score The score for this assessment.
         * @param {object} subHeadings The object with all subHeadings matches.
         * @param {object} i18n The object used for translations.
         *
         * @returns {string} The translated string.
         */

    }, {
        key: "translateScore",
        value: function translateScore(score, subHeadings, i18n) {
            if (score === this._config.scores.multipleMatches || score === this._config.scores.oneMatch) {
                return i18n.sprintf(i18n.dgettext("js-text-analysis", "The focus keyword appears only in %2$d (out of %1$d) subheadings in your copy. " + "Try to use it in at least one more subheading."), subHeadings.count, subHeadings.matches);
            }
            if (score === this._config.scores.noMatches) {
                return i18n.dgettext("js-text-analysis", "You have not used the focus keyword in any subheading (such as an H2) in your copy.");
            }
            return "";
        }
    }]);

    return SubHeadingsKeywordAssessment;
}(Assessment);

module.exports = SubHeadingsKeywordAssessment;



},{"../../assessment.js":225,"../../values/AssessmentResult.js":387,"lodash/merge":197}],236:[function(require,module,exports){
"use strict";

var AssessmentResult = require("../../values/AssessmentResult.js");
var inRange = require("lodash/inRange");
var recommendedMinimum = 150;
/**
 * Calculate the score based on the current word count.
 * @param {number} wordCount The amount of words to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var calculateWordCountResult = function calculateWordCountResult(wordCount, i18n) {
    if (wordCount >= 150) {
        return {
            score: 9,
            text: i18n.dngettext("js-text-analysis",
            /* Translators: %1$d expands to the number of words in the text. */
            "The text contains %1$d word.", "The text contains %1$d words.", wordCount) + " " + i18n.dngettext("js-text-analysis",
            /* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words. */
            "This is more than or equal to the recommended minimum of %2$d word.", "This is more than or equal to the recommended minimum of %2$d words.", recommendedMinimum)
        };
    }
    if (inRange(wordCount, 125, 150)) {
        return {
            score: 7,
            text: i18n.dngettext("js-text-analysis",
            /* Translators: %1$d expands to the number of words in the text. */
            "The text contains %1$d word.", "The text contains %1$d words.", wordCount) + " " + i18n.dngettext("js-text-analysis",
            /* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words. */
            "This is slightly below the recommended minimum of %2$d word. Add a bit more copy.", "This is slightly below the recommended minimum of %2$d words. Add a bit more copy.", recommendedMinimum)
        };
    }
    if (inRange(wordCount, 100, 125)) {
        return {
            score: 5,
            text: i18n.dngettext("js-text-analysis",
            /* Translators: %1$d expands to the number of words in the text. */
            "The text contains %1$d word.", "The text contains %1$d words.", wordCount) + " " + i18n.dngettext("js-text-analysis",
            /* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words. */
            "This is below the recommended minimum of %2$d word. Add more content that is relevant for the topic.", "This is below the recommended minimum of %2$d words. Add more content that is relevant for the topic.", recommendedMinimum)
        };
    }
    if (inRange(wordCount, 50, 100)) {
        return {
            score: -10,
            text: i18n.dngettext("js-text-analysis",
            /* Translators: %1$d expands to the number of words in the text. */
            "The text contains %1$d word.", "The text contains %1$d words.", wordCount) + " " + i18n.dngettext("js-text-analysis",
            /* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words. */
            "This is below the recommended minimum of %2$d word. Add more content that is relevant for the topic.", "This is below the recommended minimum of %2$d words. Add more content that is relevant for the topic.", recommendedMinimum)
        };
    }
    if (inRange(wordCount, 0, 50)) {
        return {
            score: -20,
            text: i18n.dngettext("js-text-analysis",
            /* Translators: %1$d expands to the number of words in the text. */
            "The text contains %1$d word.", "The text contains %1$d words.", wordCount) + " " + i18n.dngettext("js-text-analysis",
            /* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words. */
            "This is far below the recommended minimum of %2$d word. Add more content that is relevant for the topic.", "This is far below the recommended minimum of %2$d words. Add more content that is relevant for the topic.", recommendedMinimum)
        };
    }
};
/**
 * Execute the Assessment and return a result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var taxonomyTextLengthAssessment = function taxonomyTextLengthAssessment(paper, researcher, i18n) {
    var wordCount = researcher.getResearch("wordCountInText");
    var wordCountResult = calculateWordCountResult(wordCount, i18n);
    var assessmentResult = new AssessmentResult();
    assessmentResult.setScore(wordCountResult.score);
    assessmentResult.setText(i18n.sprintf(wordCountResult.text, wordCount, recommendedMinimum));
    return assessmentResult;
};
module.exports = {
    identifier: "taxonomyTextLength",
    getResult: taxonomyTextLengthAssessment
};



},{"../../values/AssessmentResult.js":387,"lodash/inRange":172}],237:[function(require,module,exports){
"use strict";

var AssessmentResult = require("../../values/AssessmentResult.js");
var Mark = require("../../values/Mark.js");
var addMark = require("../../markers/addMark.js");
var map = require("lodash/map");
/**
 * Returns a score and text based on the number of links.
 *
 * @param {object} linkStatistics The object with all linkstatistics.
 * @param {object} i18n The object used for translations
 * @returns {object} resultObject with score and text
 */
var calculateLinkCountResult = function calculateLinkCountResult(linkStatistics, i18n) {
    if (linkStatistics.keyword.totalKeyword > 0) {
        return {
            score: 2,
            hasMarks: true,
            text: i18n.dgettext("js-text-analysis", "You\'re linking to another page with the focus keyword you want this page to rank for. " + "Consider changing that if you truly want this page to rank.")
        };
    }
    return {};
};
/**
 * Runs the linkCount module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var textHasCompetingLinksAssessment = function textHasCompetingLinksAssessment(paper, researcher, i18n) {
    var linkCount = researcher.getResearch("getLinkStatistics");
    var linkCountResult = calculateLinkCountResult(linkCount, i18n);
    var assessmentResult = new AssessmentResult();
    assessmentResult.setScore(linkCountResult.score);
    assessmentResult.setText(linkCountResult.text);
    assessmentResult.setHasMarks(linkCountResult.hasMarks);
    return assessmentResult;
};
/**
 * Mark the anchors.
 *
 * @param {Paper} paper The paper to use for the marking.
 * @param {Researcher} researcher The researcher to use.
 * @returns {Array} Array with all the marked anchors.
 */
var competingLinkMarker = function competingLinkMarker(paper, researcher) {
    var competingLinks = researcher.getResearch("getLinkStatistics");
    return map(competingLinks.keyword.matchedAnchors, function (matchedAnchor) {
        return new Mark({
            original: matchedAnchor,
            marked: addMark(matchedAnchor)
        });
    });
};
module.exports = {
    identifier: "textCompetingLinks",
    getResult: textHasCompetingLinksAssessment,
    isApplicable: function isApplicable(paper) {
        return paper.hasText() && paper.hasKeyword();
    },
    getMarks: competingLinkMarker
};



},{"../../markers/addMark.js":268,"../../values/AssessmentResult.js":387,"../../values/Mark.js":388,"lodash/map":195}],238:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var AssessmentResult = require("../../values/AssessmentResult.js");
var Assessment = require("../../assessment.js");
var merge = require("lodash/merge");
/**
 * Represents the assessment that will look if the images have alt-tags and checks if the keyword is present in one of them.
 */

var TextImagesAssessment = function (_Assessment) {
    _inherits(TextImagesAssessment, _Assessment);

    /**
     * Sets the identifier and the config.
     *
     * @param {object} config The configuration to use.
     *
     * @returns {void}
     */
    function TextImagesAssessment() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, TextImagesAssessment);

        var _this = _possibleConstructorReturn(this, (TextImagesAssessment.__proto__ || Object.getPrototypeOf(TextImagesAssessment)).call(this));

        var defaultConfig = {
            scores: {
                noImages: 3,
                withAltKeyword: 9,
                withAltNonKeyword: 6,
                withAlt: 6,
                noAlt: 6
            }
        };
        _this.identifier = "textImages";
        _this._config = merge(defaultConfig, config);
        return _this;
    }
    /**
     * Execute the Assessment and return a result.
     *
     * @param {Paper} paper The Paper object to assess.
     * @param {Researcher} researcher The Researcher object containing all available researches.
     * @param {object} i18n The locale object.
     *
     * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
     */

    _createClass(TextImagesAssessment, [{
        key: "getResult",
        value: function getResult(paper, researcher, i18n) {
            var assessmentResult = new AssessmentResult();
            var imageCount = researcher.getResearch("imageCount");
            var altProperties = researcher.getResearch("altTagCount");
            assessmentResult.setScore(this.calculateScore(imageCount, altProperties));
            assessmentResult.setText(this.translateScore(imageCount, altProperties, i18n));
            return assessmentResult;
        }
        /**
         * Checks whether the paper has text.
         *
         * @param {Paper} paper The paper to use for the assessment.
         *
         * @returns {boolean} True when there is text.
         */

    }, {
        key: "isApplicable",
        value: function isApplicable(paper) {
            return paper.hasText();
        }
        /**
         * Calculate the score based on the current image count and current image alt-tag count.
         *
         * @param {number} imageCount The amount of images to be checked against.
         * @param {object} altProperties An object containing the various alt-tags.
         *
         * @returns {number} The calculated score.
         */

    }, {
        key: "calculateScore",
        value: function calculateScore(imageCount, altProperties) {
            if (imageCount === 0) {
                return this._config.scores.noImages;
            }
            // Has alt-tag and keywords
            if (altProperties.withAltKeyword > 0) {
                return this._config.scores.withAltKeyword;
            }
            // Has alt-tag, but no keywords and it's not okay
            if (altProperties.withAltNonKeyword > 0) {
                return this._config.scores.withAltNonKeyword;
            }
            // Has alt-tag, but no keyword is set
            if (altProperties.withAlt > 0) {
                return this._config.scores.withAlt;
            }
            // Has no alt-tag
            if (altProperties.noAlt > 0) {
                return this._config.scores.noAlt;
            }
            return null;
        }
        /**
         * Translates the score to a message the user can understand.
         *
         * @param {number} imageCount The amount of images to be checked against.
         * @param {object} altProperties An object containing the various alt-tags.
         * @param {object} i18n The object used for translations.
         *
         * @returns {string} The translated string.
         */

    }, {
        key: "translateScore",
        value: function translateScore(imageCount, altProperties, i18n) {
            if (imageCount === 0) {
                return i18n.dgettext("js-text-analysis", "No images appear in this page, consider adding some as appropriate.");
            }
            // Has alt-tag and keywords
            if (altProperties.withAltKeyword > 0) {
                return i18n.dgettext("js-text-analysis", "The images on this page contain alt attributes with the focus keyword.");
            }
            // Has alt-tag, but no keywords and it's not okay
            if (altProperties.withAltNonKeyword > 0) {
                return i18n.dgettext("js-text-analysis", "The images on this page do not have alt attributes containing the focus keyword.");
            }
            // Has alt-tag, but no keyword is set
            if (altProperties.withAlt > 0) {
                return i18n.dgettext("js-text-analysis", "The images on this page contain alt attributes.");
            }
            // Has no alt-tag
            if (altProperties.noAlt > 0) {
                return i18n.dgettext("js-text-analysis", "The images on this page are missing alt attributes.");
            }
            return "";
        }
    }]);

    return TextImagesAssessment;
}(Assessment);

module.exports = TextImagesAssessment;



},{"../../assessment.js":225,"../../values/AssessmentResult.js":387,"lodash/merge":197}],239:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var AssessmentResult = require("../../values/AssessmentResult.js");
var Assessment = require("../../assessment.js");
var inRange = require("lodash/inRange");
var merge = require("lodash/merge");
/**
 * Assessment that will test if the text is long enough.
 */

var TextLengthAssessment = function (_Assessment) {
    _inherits(TextLengthAssessment, _Assessment);

    /**
     * Sets the identifier and the config.
     *
     * @param {object} config The configuration to use.
     *
     * @returns {void}
     */
    function TextLengthAssessment() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, TextLengthAssessment);

        var _this = _possibleConstructorReturn(this, (TextLengthAssessment.__proto__ || Object.getPrototypeOf(TextLengthAssessment)).call(this));

        var defaultConfig = {
            recommendedMinimum: 300,
            slightlyBelowMinimum: 250,
            belowMinimum: 200,
            veryFarBelowMinimum: 100,
            scores: {
                recommendedMinimum: 9,
                slightlyBelowMinimum: 6,
                belowMinimum: 3,
                farBelowMinimum: -10,
                veryFarBelowMinimum: -20
            }
        };
        _this.identifier = "textLength";
        _this._config = merge(defaultConfig, config);
        return _this;
    }
    /**
     * Execute the Assessment and return a result.
     *
     * @param {Paper} paper The Paper object to assess.
     * @param {Researcher} researcher The Researcher object containing all available researches.
     * @param {object} i18n The locale object.
     *
     * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
     */

    _createClass(TextLengthAssessment, [{
        key: "getResult",
        value: function getResult(paper, researcher, i18n) {
            var wordCount = researcher.getResearch("wordCountInText");
            var assessmentResult = new AssessmentResult();
            assessmentResult.setScore(this.calculateScore(wordCount));
            assessmentResult.setText(i18n.sprintf(this.translateScore(assessmentResult.getScore(), wordCount, i18n), wordCount, this._config.recommendedMinimum));
            return assessmentResult;
        }
        /**
         * Calculates the score based on the current word count.
         *
         * @param {number} wordCount The amount of words to be checked against.
          * @returns {number|null} The score.
         */

    }, {
        key: "calculateScore",
        value: function calculateScore(wordCount) {
            if (wordCount >= this._config.recommendedMinimum) {
                return this._config.scores.recommendedMinimum;
            }
            if (inRange(wordCount, this._config.slightlyBelowMinimum, this._config.recommendedMinimum)) {
                return this._config.scores.slightlyBelowMinimum;
            }
            if (inRange(wordCount, this._config.belowMinimum, this._config.slightlyBelowMinimum)) {
                return this._config.scores.belowMinimum;
            }
            if (inRange(wordCount, this._config.veryFarBelowMinimum, this._config.belowMinimum)) {
                return this._config.scores.farBelowMinimum;
            }
            if (inRange(wordCount, 0, this._config.veryFarBelowMinimum)) {
                return this._config.scores.veryFarBelowMinimum;
            }
            return null;
        }
        /**
         * Translates the score to a message the user can understand.
         *
         * @param {number} score The amount of words to be checked against.
         * @param {number} wordCount The amount of words.
         * @param {object} i18n The object used for translations.
         *
         * @returns {string} The translated string.
         */

    }, {
        key: "translateScore",
        value: function translateScore(score, wordCount, i18n) {
            if (score === this._config.scores.recommendedMinimum) {
                return i18n.dngettext("js-text-analysis",
                /* Translators: %1$d expands to the number of words in the text */
                "The text contains %1$d word.", "The text contains %1$d words.", wordCount) + " " + i18n.dngettext("js-text-analysis",
                /* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words. */
                "This is more than or equal to the recommended minimum of %2$d word.", "This is more than or equal to the recommended minimum of %2$d words.", this._config.recommendedMinimum);
            }
            if (score === this._config.scores.slightlyBelowMinimum) {
                return i18n.dngettext("js-text-analysis",
                /* Translators: %1$d expands to the number of words in the text */
                "The text contains %1$d word.", "The text contains %1$d words.", wordCount) + " " + i18n.dngettext("js-text-analysis",
                /* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words */
                "This is slightly below the recommended minimum of %2$d word. Add a bit more copy.", "This is slightly below the recommended minimum of %2$d words. Add a bit more copy.", this._config.recommendedMinimum);
            }
            if (score === this._config.scores.belowMinimum) {
                return i18n.dngettext("js-text-analysis",
                /* Translators: %1$d expands to the number of words in the text */
                "The text contains %1$d word.", "The text contains %1$d words.", wordCount) + " " + i18n.dngettext("js-text-analysis",
                /* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words */
                "This is below the recommended minimum of %2$d word. Add more content that is relevant for the topic.", "This is below the recommended minimum of %2$d words. Add more content that is relevant for the topic.", this._config.recommendedMinimum);
            }
            if (score === this._config.scores.farBelowMinimum || score === this._config.scores.veryFarBelowMinimum) {
                return i18n.dngettext("js-text-analysis",
                /* Translators: %1$d expands to the number of words in the text */
                "The text contains %1$d word.", "The text contains %1$d words.", wordCount) + " " + i18n.dngettext("js-text-analysis",
                /* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words */
                "This is far below the recommended minimum of %2$d word. Add more content that is relevant for the topic.", "This is far below the recommended minimum of %2$d words. Add more content that is relevant for the topic.", this._config.recommendedMinimum);
            }
            return "";
        }
    }]);

    return TextLengthAssessment;
}(Assessment);

module.exports = TextLengthAssessment;



},{"../../assessment.js":225,"../../values/AssessmentResult.js":387,"lodash/inRange":172,"lodash/merge":197}],240:[function(require,module,exports){
"use strict";

var AssessmentResult = require("../../values/AssessmentResult.js");
var escape = require("lodash/escape");
/**
 * Executes the pagetitle keyword assessment and returns an assessment result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment with text and score
 */
var titleHasKeywordAssessment = function titleHasKeywordAssessment(paper, researcher, i18n) {
    var keywordMatches = researcher.getResearch("findKeywordInPageTitle");
    var score, text;
    if (keywordMatches.matches === 0) {
        score = 2;
        text = i18n.sprintf(i18n.dgettext("js-text-analysis", "The focus keyword '%1$s' does " + "not appear in the SEO title."), escape(paper.getKeyword()));
    }
    if (keywordMatches.matches > 0 && keywordMatches.position === 0) {
        score = 9;
        text = i18n.dgettext("js-text-analysis", "The SEO title contains the focus keyword, at the beginning which is considered " + "to improve rankings.");
    }
    if (keywordMatches.matches > 0 && keywordMatches.position > 0) {
        score = 6;
        text = i18n.dgettext("js-text-analysis", "The SEO title contains the focus keyword, but it does not appear at the beginning;" + " try and move it to the beginning.");
    }
    var assessmentResult = new AssessmentResult();
    assessmentResult.setScore(score);
    assessmentResult.setText(text);
    return assessmentResult;
};
module.exports = {
    identifier: "titleKeyword",
    getResult: titleHasKeywordAssessment,
    isApplicable: function isApplicable(paper) {
        return paper.hasKeyword();
    }
};



},{"../../values/AssessmentResult.js":387,"lodash/escape":160}],241:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var AssessmentResult = require("../../values/AssessmentResult.js");
var Assessment = require("../../assessment.js");
var merge = require("lodash/merge");
/**
 * Represents the URL keyword assessments. This assessments will check if the keyword is present in the url.
 */

var UrlKeywordAssessment = function (_Assessment) {
    _inherits(UrlKeywordAssessment, _Assessment);

    /**
     * Sets the identifier and the config.
     *
     * @param {object} config The configuration to use.
     *
     * @returns {void}
     */
    function UrlKeywordAssessment() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, UrlKeywordAssessment);

        var _this = _possibleConstructorReturn(this, (UrlKeywordAssessment.__proto__ || Object.getPrototypeOf(UrlKeywordAssessment)).call(this));

        var defaultConfig = {
            scores: {
                noKeywordInUrl: 6
            }
        };
        _this.identifier = "urlKeyword";
        _this._config = merge(defaultConfig, config);
        return _this;
    }
    /**
     * Executes the Assessment and returns a result.
     *
     * @param {Paper} paper The Paper object to assess.
     * @param {Researcher} researcher The Researcher object containing all available researches.
     * @param {object} i18n The locale object.
     *
     * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
     */

    _createClass(UrlKeywordAssessment, [{
        key: "getResult",
        value: function getResult(paper, researcher, i18n) {
            var totalKeywords = researcher.getResearch("keywordCountInUrl");
            var assessmentResult = new AssessmentResult();
            assessmentResult.setScore(this.calculateScore(totalKeywords));
            assessmentResult.setText(this.translateScore(totalKeywords, i18n));
            return assessmentResult;
        }
        /**
         * Checks whether the paper has a keyword and a url.
         *
         * @param {Paper} paper The paper to use for the assessment.
         *
         * @returns {boolean} True when there is a keyword and an url.
         */

    }, {
        key: "isApplicable",
        value: function isApplicable(paper) {
            return paper.hasKeyword() && paper.hasUrl();
        }
        /**
         * Calculates the score based on whether or not there's a keyword in the url.
         *
         * @param {number} totalKeywords The amount of keywords to be checked against.
         *
         * @returns {number} The calculated score.
         */

    }, {
        key: "calculateScore",
        value: function calculateScore(totalKeywords) {
            if (totalKeywords === 0) {
                return this._config.scores.noKeywordInUrl;
            }
            return 9;
        }
        /**
         * Translates the score to a message the user can understand.
         *
         * @param {number} totalKeywords The amount of keywords to be checked against.
         * @param {object} i18n The object used for translations.
         *
         * @returns {string} The translated string.
         */

    }, {
        key: "translateScore",
        value: function translateScore(totalKeywords, i18n) {
            if (totalKeywords === 0) {
                return i18n.dgettext("js-text-analysis", "The focus keyword does not appear in the URL for this page. " + "If you decide to rename the URL be sure to check the old URL 301 redirects to the new one!");
            }
            return i18n.dgettext("js-text-analysis", "The focus keyword appears in the URL for this page.");
        }
    }]);

    return UrlKeywordAssessment;
}(Assessment);

module.exports = UrlKeywordAssessment;



},{"../../assessment.js":225,"../../values/AssessmentResult.js":387,"lodash/merge":197}],242:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var AssessmentResult = require("../../values/AssessmentResult.js");
var Assessment = require("../../assessment.js");
var merge = require("lodash/merge");
/**
 * Assessment that checks if the url is long enough.
 */

var UrlLengthAssessment = function (_Assessment) {
    _inherits(UrlLengthAssessment, _Assessment);

    /**
     * Sets the identifier and the config.
     *
     * @param {object} config The configuration to use.
     *
     * @returns {void}
     */
    function UrlLengthAssessment() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, UrlLengthAssessment);

        var _this = _possibleConstructorReturn(this, (UrlLengthAssessment.__proto__ || Object.getPrototypeOf(UrlLengthAssessment)).call(this));

        var defaultConfig = {
            scores: {
                tooLong: 6
            }
        };
        _this.identifier = "urlLength";
        _this._config = merge(defaultConfig, config);
        return _this;
    }
    /**
     * Checks the length of the url.
     *
     * @param {Paper} paper The paper to run this assessment on.
     * @param {Researcher} researcher The researcher used for the assessment.
     * @param {object} i18n The i18n-object used for parsing translations.
     *
     * @returns {AssessmentResult} an AssessmentResult with the score and the formatted text.
     */

    _createClass(UrlLengthAssessment, [{
        key: "getResult",
        value: function getResult(paper, researcher, i18n) {
            var urlIsTooLong = researcher.getResearch("urlLength");
            var assessmentResult = new AssessmentResult();
            assessmentResult.setScore(this.calculateScore(urlIsTooLong));
            assessmentResult.setText(this.translateScore(urlIsTooLong, i18n));
            return assessmentResult;
        }
        /**
         * Checks whether the paper has a url.
         *
         * @param {Paper} paper The paper to use for the assessment.
         *
         * @returns {boolean} True when there is text.
         */

    }, {
        key: "isApplicable",
        value: function isApplicable(paper) {
            return paper.hasUrl();
        }
        /**
         * Calculates the score based on the url length.
         *
         * @param {boolean} urlIsTooLong True when the URL is too long.
         *
         * @returns {number|null} The calculated score.
         */

    }, {
        key: "calculateScore",
        value: function calculateScore(urlIsTooLong) {
            if (urlIsTooLong) {
                return this._config.scores.tooLong;
            }
            return null;
        }
        /**
         * Translates the score to a message the user can understand.
         *
         * @param {boolean} urlIsTooLong True when the URL is too long.
         * @param {object} i18n The object used for translations.
         *
         * @returns {string} The translated string.
         */

    }, {
        key: "translateScore",
        value: function translateScore(urlIsTooLong, i18n) {
            if (urlIsTooLong) {
                return i18n.dgettext("js-text-analysis", "The slug for this page is a bit long, consider shortening it.");
            }
            return "";
        }
    }]);

    return UrlLengthAssessment;
}(Assessment);

module.exports = UrlLengthAssessment;



},{"../../assessment.js":225,"../../values/AssessmentResult.js":387,"lodash/merge":197}],243:[function(require,module,exports){
"use strict";

var AssessmentResult = require("../../values/AssessmentResult.js");
var getLanguageAvailability = require("../../helpers/getLanguageAvailability.js");
var availableLanguages = ["en"];
/**
 * Calculate the score based on the amount of stop words in the url.
 * @param {number} stopWordCount The amount of stop words to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var calculateUrlStopWordsCountResult = function calculateUrlStopWordsCountResult(stopWordCount, i18n) {
    if (stopWordCount > 0) {
        return {
            score: 5,
            text: i18n.dngettext("js-text-analysis",
            /* Translators: %1$s opens a link to a wikipedia article about stop words, %2$s closes the link */
            "The slug for this page contains a %1$sstop word%2$s, consider removing it.", "The slug for this page contains %1$sstop words%2$s, consider removing them.", stopWordCount)
        };
    }
    return {};
};
/**
 * Execute the Assessment and return a result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var urlHasStopWordsAssessment = function urlHasStopWordsAssessment(paper, researcher, i18n) {
    var stopWords = researcher.getResearch("stopWordsInUrl");
    var stopWordsResult = calculateUrlStopWordsCountResult(stopWords.length, i18n);
    var assessmentResult = new AssessmentResult();
    assessmentResult.setScore(stopWordsResult.score);
    assessmentResult.setText(i18n.sprintf(stopWordsResult.text,
    /* Translators: this link is referred to in the content analysis when a slug contains one or more stop words */
    "<a href='" + i18n.dgettext("js-text-analysis", "http://en.wikipedia.org/wiki/Stop_words") + "' target='_blank'>", "</a>"));
    return assessmentResult;
};
module.exports = {
    identifier: "urlStopWords",
    isApplicable: function isApplicable(paper) {
        return getLanguageAvailability(paper.getLocale(), availableLanguages);
    },
    getResult: urlHasStopWordsAssessment
};



},{"../../helpers/getLanguageAvailability.js":261,"../../values/AssessmentResult.js":387}],244:[function(require,module,exports){
"use strict";

var Researcher = require("./researcher.js");
var MissingArgument = require("./errors/missingArgument");
var removeDuplicateMarks = require("./markers/removeDuplicateMarks");
var AssessmentResult = require("./values/AssessmentResult.js");
var showTrace = require("./helpers/errors.js").showTrace;
var isUndefined = require("lodash/isUndefined");
var isFunction = require("lodash/isFunction");
var forEach = require("lodash/forEach");
var filter = require("lodash/filter");
var map = require("lodash/map");
var findIndex = require("lodash/findIndex");
var find = require("lodash/find");
var ScoreRating = 9;
/**
 * Creates the Assessor.
 *
 * @param {Object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
var Assessor = function Assessor(i18n, options) {
    this.setI18n(i18n);
    this._assessments = [];
    this._options = options || {};
};
/**
 * Checks if the i18n object is defined and sets it.
 *
 * @param {Object} i18n The i18n object used for translations.
 * @throws {MissingArgument} Parameter needs to be a valid i18n object.
 * @returns {void}
 */
Assessor.prototype.setI18n = function (i18n) {
    if (isUndefined(i18n)) {
        throw new MissingArgument("The assessor requires an i18n object.");
    }
    this.i18n = i18n;
};
/**
 * Gets all available assessments.
 * @returns {object} assessment
 */
Assessor.prototype.getAvailableAssessments = function () {
    return this._assessments;
};
/**
 * Checks whether or not the Assessment is applicable.
 *
 * @param {Object} assessment The Assessment object that needs to be checked.
 * @param {Paper} paper The Paper object to check against.
 * @param {Researcher} [researcher] The Researcher object containing additional information.
 * @returns {boolean} Whether or not the Assessment is applicable.
 */
Assessor.prototype.isApplicable = function (assessment, paper, researcher) {
    if (assessment.hasOwnProperty("isApplicable") || typeof assessment.isApplicable === "function") {
        return assessment.isApplicable(paper, researcher);
    }
    return true;
};
/**
 * Determines whether or not an assessment has a marker.
 *
 * @param {Object} assessment The assessment to check for.
 * @returns {boolean} Whether or not the assessment has a marker.
 */
Assessor.prototype.hasMarker = function (assessment) {
    if (!isUndefined(window) && !isUndefined(window.yoastHideMarkers) && window.yoastHideMarkers) {
        return false;
    }
    return isFunction(this._options.marker) && (assessment.hasOwnProperty("getMarks") || typeof assessment.getMarks === "function");
};
/**
 * Returns the specific marker for this assessor.
 *
 * @returns {Function} The specific marker for this assessor.
 */
Assessor.prototype.getSpecificMarker = function () {
    return this._options.marker;
};
/**
 * Returns the paper that was most recently assessed.
 *
 * @returns {Paper} The paper that was most recently assessed.
 */
Assessor.prototype.getPaper = function () {
    return this._lastPaper;
};
/**
 * Returns the marker for a given assessment, composes the specific marker with the assessment getMarks function.
 *
 * @param {Object} assessment The assessment for which we are retrieving the composed marker.
 * @param {Paper} paper The paper to retrieve the marker for.
 * @param {Researcher} researcher The researcher for the paper.
 * @returns {Function} A function that can mark the given paper according to the given assessment.
 */
Assessor.prototype.getMarker = function (assessment, paper, researcher) {
    var specificMarker = this._options.marker;
    return function () {
        var marks = assessment.getMarks(paper, researcher);
        marks = removeDuplicateMarks(marks);
        specificMarker(paper, marks);
    };
};
/**
 * Runs the researches defined in the tasklist or the default researches.
 *
 * @param {Paper} paper The paper to run assessments on.
 * @returns {void}
 */
Assessor.prototype.assess = function (paper) {
    var researcher = new Researcher(paper);
    var assessments = this.getAvailableAssessments();
    this.results = [];
    assessments = filter(assessments, function (assessment) {
        return this.isApplicable(assessment, paper, researcher);
    }.bind(this));
    this.setHasMarkers(false);
    this.results = map(assessments, this.executeAssessment.bind(this, paper, researcher));
    this._lastPaper = paper;
};
/**
 * Sets the value of has markers with a boolean to determine if there are markers.
 *
 * @param {boolean} hasMarkers True when there are markers, otherwise it is false.
 * @returns {void}
 */
Assessor.prototype.setHasMarkers = function (hasMarkers) {
    this._hasMarkers = hasMarkers;
};
/**
 * Returns true when there are markers.
 *
 * @returns {boolean} Are there markers
 */
Assessor.prototype.hasMarkers = function () {
    return this._hasMarkers;
};
/**
 * Executes an assessment and returns the AssessmentResult.
 *
 * @param {Paper} paper The paper to pass to the assessment.
 * @param {Researcher} researcher The researcher to pass to the assessment.
 * @param {Object} assessment The assessment to execute.
 * @returns {AssessmentResult} The result of the assessment.
 */
Assessor.prototype.executeAssessment = function (paper, researcher, assessment) {
    var result;
    try {
        result = assessment.getResult(paper, researcher, this.i18n);
        result.setIdentifier(assessment.identifier);
        if (result.hasMarks() && this.hasMarker(assessment)) {
            this.setHasMarkers(true);
            result.setMarker(this.getMarker(assessment, paper, researcher));
        }
    } catch (assessmentError) {
        showTrace(assessmentError);
        result = new AssessmentResult();
        result.setScore(-1);
        result.setText(this.i18n.sprintf(
        /* Translators: %1$s expands to the name of the assessment. */
        this.i18n.dgettext("js-text-analysis", "An error occurred in the '%1$s' assessment"), assessment.identifier, assessmentError));
    }
    return result;
};
/**
 * Filters out all assessmentresults that have no score and no text.
 *
 * @returns {Array<AssessmentResult>} The array with all the valid assessments.
 */
Assessor.prototype.getValidResults = function () {
    return filter(this.results, function (result) {
        return this.isValidResult(result);
    }.bind(this));
};
/**
 * Returns if an assessmentResult is valid.
 *
 * @param {object} assessmentResult The assessmentResult to validate.
 * @returns {boolean} whether or not the result is valid.
 */
Assessor.prototype.isValidResult = function (assessmentResult) {
    return assessmentResult.hasScore() && assessmentResult.hasText();
};
/**
 * Returns the overallscore. Calculates the totalscore by adding all scores and dividing these
 * by the number of results times the ScoreRating.
 *
 * @returns {number} The overallscore
 */
Assessor.prototype.calculateOverallScore = function () {
    var results = this.getValidResults();
    var totalScore = 0;
    forEach(results, function (assessmentResult) {
        totalScore += assessmentResult.getScore();
    });
    return Math.round(totalScore / (results.length * ScoreRating) * 100) || 0;
};
/**
 * Register an assessment to add it to the internal assessments object.
 *
 * @param {string} name The name of the assessment.
 * @param {object} assessment The object containing function to run as an assessment and it's requirements.
 * @returns {boolean} Whether registering the assessment was successful.
 * @private
 */
Assessor.prototype.addAssessment = function (name, assessment) {
    if (!assessment.hasOwnProperty("identifier")) {
        assessment.identifier = name;
    }
    this._assessments.push(assessment);
    return true;
};
/**
 * Remove a specific Assessment from the list of Assessments.
 *
 * @param {string} name The Assessment to remove from the list of assessments.
 * @returns {void}
 */
Assessor.prototype.removeAssessment = function (name) {
    var toDelete = findIndex(this._assessments, function (assessment) {
        return assessment.hasOwnProperty("identifier") && name === assessment.identifier;
    });
    if (-1 !== toDelete) {
        this._assessments.splice(toDelete, 1);
    }
};
/**
 * Returns an assessment by identifier
 *
 * @param {string} identifier The identifier of the assessment.
 * @returns {undefined|Object} The object if found, otherwise undefined.
 */
Assessor.prototype.getAssessment = function (identifier) {
    return find(this._assessments, function (assessment) {
        return assessment.hasOwnProperty("identifier") && identifier === assessment.identifier;
    });
};
/**
 * Checks which of the available assessments are applicable and returns an array with applicable assessments.
 *
 * @returns {Array} The array with applicable assessments.
 */
Assessor.prototype.getApplicableAssessments = function () {
    var availableAssessments = this.getAvailableAssessments();
    return filter(availableAssessments, function (availableAssessment) {
        return this.isApplicable(availableAssessment, this.getPaper());
    }.bind(this));
};
module.exports = Assessor;



},{"./errors/missingArgument":256,"./helpers/errors.js":257,"./markers/removeDuplicateMarks":269,"./researcher.js":270,"./values/AssessmentResult.js":387,"lodash/filter":162,"lodash/find":163,"lodash/findIndex":164,"lodash/forEach":167,"lodash/isFunction":182,"lodash/isUndefined":192,"lodash/map":195}],245:[function(require,module,exports){
"use strict";
/** @module config/diacritics */
/**
 * Returns the diacritics map
 *
 * @returns {array} diacritics map
 */

module.exports = function () {
    return [{
        base: "a",
        letters: /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g
    }, { base: "aa", letters: /[\uA733]/g }, { base: "ae", letters: /[\u00E6\u01FD\u01E3]/g }, { base: "ao", letters: /[\uA735]/g }, { base: "au", letters: /[\uA737]/g }, { base: "av", letters: /[\uA739\uA73B]/g }, { base: "ay", letters: /[\uA73D]/g }, { base: "b", letters: /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g }, {
        base: "c",
        letters: /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g
    }, {
        base: "d",
        letters: /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g
    }, { base: "dz", letters: /[\u01F3\u01C6]/g }, {
        base: "e",
        letters: /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g
    }, { base: "f", letters: /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g }, {
        base: "g",
        letters: /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g
    }, {
        base: "h",
        letters: /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g
    }, { base: "hv", letters: /[\u0195]/g }, {
        base: "i",
        letters: /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g
    }, { base: "j", letters: /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g }, {
        base: "k",
        letters: /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g
    }, {
        base: "l",
        letters: /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g
    }, { base: "lj", letters: /[\u01C9]/g }, { base: "m", letters: /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g }, {
        base: "n",
        letters: /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g
    }, { base: "nj", letters: /[\u01CC]/g }, {
        base: "o",
        letters: /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g
    }, { base: "oi", letters: /[\u01A3]/g }, { base: "ou", letters: /[\u0223]/g }, { base: "oo", letters: /[\uA74F]/g }, { base: "p", letters: /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g }, { base: "q", letters: /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g }, {
        base: "r",
        letters: /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g
    }, {
        base: "s",
        letters: /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g
    }, {
        base: "t",
        letters: /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g
    }, { base: "tz", letters: /[\uA729]/g }, {
        base: "u",
        letters: /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g
    }, { base: "v", letters: /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g }, { base: "vy", letters: /[\uA761]/g }, {
        base: "w",
        letters: /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g
    }, { base: "x", letters: /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g }, {
        base: "y",
        letters: /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g
    }, {
        base: "z",
        letters: /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g
    }];
};



},{}],246:[function(require,module,exports){
"use strict";
/** @module config/removalWords */
/**
 * Returns an array with words that need to be removed
 *
 * @returns {array} removalWords Returns an array with words.
 */

module.exports = function () {
  return [" a", " in", " an", " on", " for", " the", " and"];
};



},{}],247:[function(require,module,exports){
"use strict";
/** @module config/stopwords */
/**
 * Returns an array with stopwords to be used by the analyzer.
 *
 * @returns {Array} stopwords The array filled with stopwords.
 */

module.exports = function () {
  return ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from", "further", "had", "has", "have", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "it", "it's", "its", "itself", "let's", "me", "more", "most", "my", "myself", "nor", "of", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "she'd", "she'll", "she's", "should", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "we'd", "we'll", "we're", "we've", "were", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "would", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"];
};



},{}],248:[function(require,module,exports){
"use strict";
/** @module config/syllables */

var getLanguage = require("../helpers/getLanguage.js");
var isUndefined = require("lodash/isUndefined");
var de = require("./syllables/de.json");
var en = require('./syllables/en.json');
var nl = require('./syllables/nl.json');
var it = require('./syllables/it.json');
var languages = { de: de, nl: nl, en: en, it: it };
module.exports = function () {
    var locale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "en_US";

    var language = getLanguage(locale);
    if (languages.hasOwnProperty(language)) {
        return languages[language];
    }
    // If an unknown locale is used, default to English.
    return languages["en"];
};



},{"../helpers/getLanguage.js":260,"./syllables/de.json":249,"./syllables/en.json":250,"./syllables/it.json":251,"./syllables/nl.json":252,"lodash/isUndefined":192}],249:[function(require,module,exports){
module.exports={
	"vowels": "aeiouyäöüáéâàèîêâûôœ",
	"deviations": {
		"vowels": [
			{
				"fragments": [ "ouil", "deaux", "deau$", "oard", "äthiop", "euil", "veau", "eau$", "ueue", "lienisch", "ance$", "ence$", "time$",
					"once$", "ziat", "guette", "ête", "ôte$", "[hp]omme$", "[qdscn]ue$", "aire$", "ture$", "êpe$", "[^q]ui$", "tiche$",
					"vice$", "oile$", "zial", "cruis", "leas", "coa[ct]", "[^i]deal", "[fw]eat", "[lsx]ed$" ],
				"countModifier": -1
			},
			{
				"fragments": [ "aau", "a[äöüo]", "äue", "äeu", "aei", "aue", "aeu", "ael", "ai[aeo]", "saik", "aismus", "ä[aeoi]", "auä", "éa",
					"e[äaoö]", "ei[eo]", "ee[aeiou]", "eu[aäe]", "eum$", "eü", "o[aäöü]", "poet", "oo[eo]", "oie", "oei[^l]", "oeu[^f]", "öa", "[fgrz]ieu",
					"mieun", "tieur", "ieum", "i[aiuü]", "[^l]iä", "[^s]chien", "io[bcdfhjkmpqtuvwx]", "[bdhmprv]ion", "[lr]ior",
					"[^g]io[gs]", "[dr]ioz", "elioz", "zioni", "bio[lnorz]", "iö[^s]", "ie[ei]", "rier$", "öi[eg]", "[^r]öisch",
					"[^gqv]u[aeéioöuü]", "quie$", "quie[^s]", "uäu", "^us-", "^it-", "üe", "naiv", "aisch$", "aische$", "aische[nrs]$", "[lst]ien",
					"dien$", "gois", "[^g]rient", "[aeiou]y[aeiou]", "byi", "yä", "[a-z]y[ao]", "yau", "koor", "scient", "eriel", "[dg]oing" ],
				"countModifier": 1
			},
			{
				"fragments": [ "eauü", "ioi", "ioo", "ioa", "iii", "oai", "eueu" ],
				"countModifier": 1
			}
		],
		"words": {
			"full": [
				{ "word": "beach", "syllables": 1 },
				{ "word": "beat", "syllables": 1 },
				{ "word": "beau", "syllables": 1 },
				{ "word": "beaune", "syllables": 1 },
				{ "word": "belle", "syllables": 1 },
				{ "word": "bouche", "syllables": 1 },
				{ "word": "brake", "syllables": 1 },
				{ "word": "cache", "syllables": 1 },
				{ "word": "chaiselongue", "syllables": 2 },
				{ "word": "choke", "syllables": 1 },
				{ "word": "cordiale", "syllables": 3 },
				{ "word": "core", "syllables": 1 },
				{ "word": "dope", "syllables": 1 },
				{ "word": "eat", "syllables": 1 },
				{ "word": "eye", "syllables": 1 },
				{ "word": "fake", "syllables": 1 },
				{ "word": "fame", "syllables": 1 },
				{ "word": "fatigue", "syllables": 2 },
				{ "word": "femme", "syllables": 1 },
				{ "word": "force", "syllables": 1 },
				{ "word": "game", "syllables": 1 },
				{ "word": "games", "syllables": 1 },
				{ "word": "gate", "syllables": 1 },
				{ "word": "grande", "syllables": 1 },
				{ "word": "ice", "syllables": 1 },
				{ "word": "ion", "syllables": 2 },
				{ "word": "joke", "syllables": 1 },
				{ "word": "jupe", "syllables": 1 },
				{ "word": "maisch", "syllables": 1 },
				{ "word": "maische", "syllables": 2 },
				{ "word": "move", "syllables": 1 },
				{ "word": "native", "syllables": 2 },
				{ "word": "nice", "syllables": 1 },
				{ "word": "one", "syllables": 1 },
				{ "word": "pipe", "syllables": 1 },
				{ "word": "prime", "syllables": 1 },
				{ "word": "rate", "syllables": 1 },
				{ "word": "rhythm", "syllables": 2 },
				{ "word": "ride", "syllables": 1 },
				{ "word": "rides", "syllables": 1 },
				{ "word": "rien", "syllables": 2 },
				{ "word": "save", "syllables": 1 },
				{ "word": "science", "syllables": 2 },
				{ "word": "siècle", "syllables": 1 },
				{ "word": "site", "syllables": 1 },
				{ "word": "suite", "syllables": 1 },
				{ "word": "take", "syllables": 1 },
				{ "word": "taupe", "syllables": 1 },
				{ "word": "universe", "syllables": 3 },
				{ "word": "vogue", "syllables": 1 },
				{ "word": "wave", "syllables": 1 },
				{ "word": "zion", "syllables": 2}
			],
			"fragments": {
				"global": [
					{ "word": "abreaktion", "syllables": 4 },
					{ "word": "adware", "syllables": 2 },
					{ "word": "affaire", "syllables": 3 },
					{ "word": "aiguière", "syllables": 2 },
					{ "word": "anisette", "syllables": 3 },
					{ "word": "appeal", "syllables": 2 },
					{ "word": "backstage", "syllables": 2 },
					{ "word": "bankrate", "syllables": 2 },
					{ "word": "baseball", "syllables": 2 },
					{ "word": "basejump", "syllables": 2 },
					{ "word": "beachcomber", "syllables": 3 },
					{ "word": "beachvolleyball", "syllables": 4 },
					{ "word": "beagle", "syllables": 2 },
					{ "word": "beamer", "syllables": 2 },
					{ "word": "beamer", "syllables": 2 },
					{ "word": "béarnaise", "syllables": 3 },
					{ "word": "beaufort", "syllables": 2 },
					{ "word": "beaujolais", "syllables": 3 },
					{ "word": "beauté", "syllables": 2 },
					{ "word": "beauty", "syllables": 2 },
					{ "word": "belgier", "syllables": 3 },
					{ "word": "bestien", "syllables": 2 },
					{ "word": "biskuit", "syllables": 2 },
					{ "word": "bleach", "syllables": 1 },
					{ "word": "blue", "syllables": 1 },
					{ "word": "board", "syllables": 1 },
					{ "word": "boat", "syllables": 1 },
					{ "word": "bodysuit", "syllables": 3 },
					{ "word": "bordelaise", "syllables": 3 },
					{ "word": "break", "syllables": 1 },
					{ "word": "build", "syllables": 1 },
					{ "word": "bureau", "syllables": 2 },
					{ "word": "business", "syllables": 2 },
					{ "word": "cabrio", "syllables": 3 },
					{ "word": "cabriolet", "syllables": 4 },
					{ "word": "cachesexe", "syllables": 2 },
					{ "word": "camaieu", "syllables": 3 },
					{ "word": "canyon", "syllables": 2 },
					{ "word": "case", "syllables": 1 },
					{ "word": "catsuit", "syllables": 2 },
					{ "word": "centime", "syllables": 3 },
					{ "word": "chaise", "syllables": 2 },
					{ "word": "champion", "syllables": 2 },
					{ "word": "championat", "syllables": 3 },
					{ "word": "chapiteau", "syllables": 3 },
					{ "word": "chateau", "syllables": 2 },
					{ "word": "château", "syllables": 2 },
					{ "word": "cheat", "syllables": 1 },
					{ "word": "cheese", "syllables": 1 },
					{ "word": "chihuahua", "syllables": 3 },
					{ "word": "choice", "syllables": 1 },
					{ "word": "circonflexe", "syllables": 3 },
					{ "word": "clean", "syllables": 1 },
					{ "word": "cloche", "syllables": 1 },
					{ "word": "close", "syllables": 1 },
					{ "word": "clothes", "syllables": 1 },
					{ "word": "commerce", "syllables": 2 },
					{ "word": "crime", "syllables": 1 },
					{ "word": "crossrate", "syllables": 2 },
					{ "word": "cuisine", "syllables": 2 },
					{ "word": "culotte", "syllables": 2 },
					{ "word": "death", "syllables": 1 },
					{ "word": "defense", "syllables": 2 },
					{ "word": "détente", "syllables": 2 },
					{ "word": "dread", "syllables": 1 },
					{ "word": "dream", "syllables": 1 },
					{ "word": "dresscode", "syllables": 2 },
					{ "word": "dungeon", "syllables": 2 },
					{ "word": "easy", "syllables": 2 },
					{ "word": "engagement", "syllables": 3 },
					{ "word": "entente", "syllables": 2 },
					{ "word": "eye-catcher", "syllables": 3 },
					{ "word": "eyecatcher", "syllables": 3 },
					{ "word": "eyeliner", "syllables": 3 },
					{ "word": "eyeword", "syllables": 2 },
					{ "word": "fashion", "syllables": 2 },
					{ "word": "feature", "syllables": 2 },
					{ "word": "ferien", "syllables": 3 },
					{ "word": "fineliner", "syllables": 3 },
					{ "word": "fisheye", "syllables": 2 },
					{ "word": "flake", "syllables": 1 },
					{ "word": "flambeau", "syllables": 2 },
					{ "word": "flatrate", "syllables": 2 },
					{ "word": "fleece", "syllables": 1 },
					{ "word": "fraîche", "syllables": 1 },
					{ "word": "freak", "syllables": 1 },
					{ "word": "frites", "syllables": 1 },
					{ "word": "future", "syllables": 2 },
					{ "word": "gaelic", "syllables": 2 },
					{ "word": "game-show", "syllables": 2 },
					{ "word": "gameboy", "syllables": 2 },
					{ "word": "gamepad", "syllables": 2 },
					{ "word": "gameplay", "syllables": 2 },
					{ "word": "gameport", "syllables": 2 },
					{ "word": "gameshow", "syllables": 2 },
					{ "word": "garigue", "syllables": 2 },
					{ "word": "garrigue", "syllables": 2 },
					{ "word": "gatefold", "syllables": 2 },
					{ "word": "gateway", "syllables": 2 },
					{ "word": "geflashed", "syllables": 2 },
					{ "word": "georgier", "syllables": 4 },
					{ "word": "goal", "syllables": 1 },
					{ "word": "grapefruit", "syllables": 2 },
					{ "word": "great", "syllables": 1 },
					{ "word": "groupware", "syllables": 2 },
					{ "word": "gueule", "syllables": 1 },
					{ "word": "guide", "syllables": 1 },
					{ "word": "guilloche", "syllables": 2 },
					{ "word": "gynäzeen", "syllables": 4 },
					{ "word": "gynözeen", "syllables": 4 },
					{ "word": "haircare", "syllables": 2 },
					{ "word": "hardcore", "syllables": 2 },
					{ "word": "hardware", "syllables": 2 },
					{ "word": "head", "syllables": 1 },
					{ "word": "hearing", "syllables": 2 },
					{ "word": "heart", "syllables": 1 },
					{ "word": "heavy", "syllables": 2 },
					{ "word": "hedge", "syllables": 1 },
					{ "word": "heroin", "syllables": 3 },
					{ "word": "inclusive", "syllables": 3 },
					{ "word": "initiative", "syllables": 4 },
					{ "word": "inside", "syllables": 2 },
					{ "word": "jaguar", "syllables": 3 },
					{ "word": "jalousette", "syllables": 3 },
					{ "word": "jeans", "syllables": 1 },
					{ "word": "jeunesse", "syllables": 2 },
					{ "word": "juice", "syllables": 1 },
					{ "word": "jukebox", "syllables": 2 },
					{ "word": "jumpsuit", "syllables": 2 },
					{ "word": "kanarien", "syllables": 4 },
					{ "word": "kapriole", "syllables": 4 },
					{ "word": "karosserielinie", "syllables": 6 },
					{ "word": "konopeen", "syllables": 4 },
					{ "word": "lacrosse", "syllables": 2 },
					{ "word": "laplace", "syllables": 2 },
					{ "word": "late-", "syllables": 1 },
					{ "word": "lead", "syllables": 1 },
					{ "word": "league", "syllables": 1 },
					{ "word": "learn", "syllables": 1 },
					{ "word": "légière", "syllables": 2 },
					{ "word": "lizenziat", "syllables": 4 },
					{ "word": "load", "syllables": 1 },
					{ "word": "lotterielos", "syllables": 4 },
					{ "word": "lounge", "syllables": 1 },
					{ "word": "lyzeen", "syllables": 3 },
					{ "word": "madame", "syllables": 2 },
					{ "word": "mademoiselle", "syllables": 3 },
					{ "word": "magier", "syllables": 3 },
					{ "word": "make-up", "syllables": 2 },
					{ "word": "malware", "syllables": 2 },
					{ "word": "management", "syllables": 3 },
					{ "word": "manteau", "syllables": 2 },
					{ "word": "mausoleen", "syllables": 4 },
					{ "word": "mauve", "syllables": 1 },
					{ "word": "medien", "syllables": 3 },
					{ "word": "mesdames", "syllables": 2 },
					{ "word": "mesopotamien", "syllables": 6 },
					{ "word": "milliarde", "syllables": 3 },
					{ "word": "missile", "syllables": 2 },
					{ "word": "miszellaneen", "syllables": 5 },
					{ "word": "mousse", "syllables": 1 },
					{ "word": "mousseline", "syllables": 3 },
					{ "word": "museen", "syllables": 3 },
					{ "word": "musette", "syllables": 2 },
					{ "word": "nahuatl", "syllables": 2 },
					{ "word": "noisette", "syllables": 2 },
					{ "word": "notebook", "syllables": 2 },
					{ "word": "nuance", "syllables": 3 },
					{ "word": "nuklease", "syllables": 4 },
					{ "word": "odeen", "syllables": 3 },
					{ "word": "offline", "syllables": 2 },
					{ "word": "offside", "syllables": 2 },
					{ "word": "oleaster", "syllables": 4 },
					{ "word": "on-stage", "syllables": 2 },
					{ "word": "online", "syllables": 2 },
					{ "word": "orpheen", "syllables": 3 },
					{ "word": "parforceritt", "syllables": 3 },
					{ "word": "patiens", "syllables": 2 },
					{ "word": "patient", "syllables": 2 },
					{ "word": "peace", "syllables": 1 },
					{ "word": "peace", "syllables": 1 },
					{ "word": "peanuts", "syllables": 2 },
					{ "word": "people", "syllables": 2 },
					{ "word": "perineen", "syllables": 4 },
					{ "word": "peritoneen", "syllables": 5 },
					{ "word": "picture", "syllables": 2 },
					{ "word": "piece", "syllables": 1 },
					{ "word": "pipeline", "syllables": 2 },
					{ "word": "plateau", "syllables": 2 },
					{ "word": "poesie", "syllables": 3 },
					{ "word": "poleposition", "syllables": 4 },
					{ "word": "portemanteau", "syllables": 3 },
					{ "word": "portemonnaie", "syllables": 3 },
					{ "word": "primerate", "syllables": 2 },
					{ "word": "primerate", "syllables": 2 },
					{ "word": "primetime", "syllables": 2 },
					{ "word": "protease", "syllables": 4 },
					{ "word": "protein", "syllables": 3 },
					{ "word": "prytaneen", "syllables": 4 },
					{ "word": "quotient", "syllables": 2 },
					{ "word": "radio", "syllables": 3 },
					{ "word": "reader", "syllables": 2 },
					{ "word": "ready", "syllables": 2 },
					{ "word": "reallife", "syllables": 2 },
					{ "word": "repeat", "syllables": 2 },
					{ "word": "retake", "syllables": 2 },
					{ "word": "rigole", "syllables": 2 },
					{ "word": "risolle", "syllables": 2 },
					{ "word": "road", "syllables": 1 },
					{ "word": "roaming", "syllables": 2 },
					{ "word": "roquefort", "syllables": 2 },
					{ "word": "safe", "syllables": 1 },
					{ "word": "savonette", "syllables": 3 },
					{ "word": "sciencefiction", "syllables": 3 },
					{ "word": "search", "syllables": 1 },
					{ "word": "selfmade", "syllables": 2 },
					{ "word": "septime", "syllables": 3 },
					{ "word": "serapeen", "syllables": 4 },
					{ "word": "service", "syllables": 2 },
					{ "word": "serviette", "syllables": 2 },
					{ "word": "share", "syllables": 1 },
					{ "word": "shave", "syllables": 1 },
					{ "word": "shore", "syllables": 1 },
					{ "word": "sidebar", "syllables": 2 },
					{ "word": "sideboard", "syllables": 2 },
					{ "word": "sidekick", "syllables": 2 },
					{ "word": "silhouette", "syllables": 3 },
					{ "word": "sitemap", "syllables": 2 },
					{ "word": "slide", "syllables": 1 },
					{ "word": "sneak", "syllables": 1 },
					{ "word": "soap", "syllables": 1 },
					{ "word": "softcore", "syllables": 2 },
					{ "word": "software", "syllables": 2 },
					{ "word": "soutanelle", "syllables": 3 },
					{ "word": "speak", "syllables": 1 },
					{ "word": "special", "syllables": 2 },
					{ "word": "spracheinstellung", "syllables": 5 },
					{ "word": "spyware", "syllables": 2 },
					{ "word": "square", "syllables": 1 },
					{ "word": "stagediving", "syllables": 3 },
					{ "word": "stakeholder", "syllables": 3 },
					{ "word": "statement", "syllables": 2 },
					{ "word": "steady", "syllables": 2 },
					{ "word": "steak", "syllables": 1 },
					{ "word": "stealth", "syllables": 1 },
					{ "word": "steam", "syllables": 1 },
					{ "word": "stoned", "syllables": 1 },
					{ "word": "stracciatella", "syllables": 4 },
					{ "word": "stream", "syllables": 1 },
					{ "word": "stride", "syllables": 1 },
					{ "word": "strike", "syllables": 1 },
					{ "word": "suitcase", "syllables": 2 },
					{ "word": "sweepstake", "syllables": 2 },
					{ "word": "t-bone", "syllables": 2 },
					{ "word": "t-shirt", "syllables": 1 },
					{ "word": "tailgate", "syllables": 2 },
					{ "word": "take-off", "syllables": 2 },
					{ "word": "take-over", "syllables": 3 },
					{ "word": "takeaway", "syllables": 3 },
					{ "word": "takeoff", "syllables": 2 },
					{ "word": "takeover", "syllables": 3 },
					{ "word": "throat", "syllables": 1 },
					{ "word": "time-out", "syllables": 2 },
					{ "word": "timelag", "syllables": 2 },
					{ "word": "timeline", "syllables": 2 },
					{ "word": "timesharing", "syllables": 3 },
					{ "word": "toast", "syllables": 1 },
					{ "word": "traubenmaische", "syllables": 4 },
					{ "word": "tristesse", "syllables": 2 },
					{ "word": "usenet", "syllables": 2 },
					{ "word": "varietät", "syllables": 4 },
					{ "word": "varieté", "syllables": 4 },
					{ "word": "vinaigrette", "syllables": 3 },
					{ "word": "vintage", "syllables": 2 },
					{ "word": "violett", "syllables": 3 },
					{ "word": "voice", "syllables": 1 },
					{ "word": "wakeboard", "syllables": 2 },
					{ "word": "washed", "syllables": 1 },
					{ "word": "waveboard", "syllables": 2 },
					{ "word": "wear", "syllables": 1 },
					{ "word": "wear", "syllables": 1 },
					{ "word": "website", "syllables": 2 },
					{ "word": "white", "syllables": 1 },
					{ "word": "widescreen", "syllables": 2 },
					{ "word": "wire", "syllables": 1 },
					{ "word": "yacht", "syllables": 1 },
					{ "word": "yorkshire", "syllables": 2 },
					{ "word": "éprouvette", "syllables": 3, "notFollowedBy": ["n"] },
					{ "word": "galette", "syllables": 2, "notFollowedBy": ["n"] },
					{ "word": "gigue", "syllables": 1, "notFollowedBy": ["n"] },
					{ "word": "groove", "syllables": 1, "notFollowedBy": ["n"] },
					{ "word": "morgue", "syllables": 1, "notFollowedBy": ["n"] },
					{ "word": "paillette", "syllables": 2, "notFollowedBy": ["n"] },
					{ "word": "raclette", "syllables": 2, "notFollowedBy": ["n"] },
					{ "word": "roulette", "syllables": 2, "notFollowedBy": ["n"] },
					{ "word": "spike", "syllables": 1, "notFollowedBy": ["n"] },
					{ "word": "style", "syllables": 1, "notFollowedBy": ["n"] },
					{ "word": "tablette", "syllables": 2, "notFollowedBy": ["n"] },
					{ "word": "grunge", "syllables": 1, "notFollowedBy": ["r"] },
					{ "word": "size", "syllables": 1, "notFollowedBy": ["r"] },
					{ "word": "value", "syllables": 1, "notFollowedBy": ["r"] },
					{ "word": "quiche", "syllables": 1, "notFollowedBy": ["s"] },
					{ "word": "house", "syllables": 1, "notFollowedBy": ["n", "s"] },
					{ "word": "sauce", "syllables": 1, "notFollowedBy": ["n", "s"] },
					{ "word": "space", "syllables": 1, "notFollowedBy": ["n", "s"] },
					{ "word": "airline", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "autosave", "syllables": 3, "notFollowedBy": ["n", "r"] },
					{ "word": "bagpipe", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "bike", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "dance", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "deadline", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "halfpipe", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "headline", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "home", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "hornpipe", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "hotline", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "infoline", "syllables": 3, "notFollowedBy": ["n", "r"] },
					{ "word": "inline", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "kite", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "rollerblade", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "score", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "skyline", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "slackline", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "slice", "syllables": 1, "notFollowedBy": ["n", "r", "s"] },
					{ "word": "snooze", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "storyline", "syllables": 3, "notFollowedBy": ["n", "r"] },
					{ "word": "office", "syllables": 2, "notFollowedBy": ["s", "r"] },
					{ "word": "space", "syllables": 1, "notFollowedBy": ["n", "s", "r"] },
					{ "word": "tease", "syllables": 1, "notFollowedBy": ["n", "s", "r"] },
					{ "word": "cache", "syllables": 1, "notFollowedBy": ["t"] }
				],
				"atBeginningOrEnd": [
					{ "word": "case", "syllables": 1 },
					{ "word": "life", "syllables": 1 },
					{ "word": "teak", "syllables": 1 },
					{ "word": "team", "syllables": 1 },
					{ "word": "creme", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "crème", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "drive", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "skate", "syllables": 1, "notFollowedBy": ["n", "r"] },
					{ "word": "update", "syllables": 2, "notFollowedBy": ["n", "r"] },
					{ "word": "upgrade", "syllables": 2, "notFollowedBy": ["n", "r"] }
				],
				"atBeginning": [
					{ "word": "anion", "syllables": 3 },
					{ "word": "facelift", "syllables": 2 },
					{ "word": "jiu", "syllables": 1 },
					{ "word": "pace", "syllables": 1 },
					{ "word": "shake", "syllables": 1 },
					{ "word": "tea", "syllables": 1 },
					{ "word": "trade", "syllables": 1 },
					{ "word": "deal", "syllables": 1 }
				],
				"atEnd": [
					{ "word": "face", "syllables": 1 },
					{ "word": "file", "syllables": 1 },
					{ "word": "mousse", "syllables": 1 },
					{ "word": "plate", "syllables": 1 },
					{ "word": "tape", "syllables": 1 },
					{ "word": "byte", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "cape", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "five", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "hype", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "leak", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "like", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "make", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "phone", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "rave", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "regime", "syllables": 2, "alsoFollowedBy": ["s"] },
					{ "word": "statue", "syllables": 2, "alsoFollowedBy": ["s"] },
					{ "word": "store", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "wave", "syllables": 1, "alsoFollowedBy": ["s"] },
					{ "word": "date", "syllables": 1, "notFollowedBy": ["n"] },
					{ "word": "image", "syllables": 2, "notFollowedBy": ["s"] }
				]
			}
		}
	}
}

},{}],250:[function(require,module,exports){
module.exports={
	"vowels": "aeiouy",
	"deviations": {
		"vowels": [
			{
				"fragments": [ "cial", "tia", "cius", "giu", "ion",
					"[^bdnprv]iou", "sia$", "[^aeiuot]{2,}ed$", "[aeiouy][^aeiuoyts]{1,}e$",
					"[a-z]ely$", "[cgy]ed$", "rved$", "[aeiouy][dt]es?$", "eau", "ieu",
					"oeu", "[aeiouy][^aeiouydt]e[sd]?$", "[aeouy]rse$", "^eye" ],
				"countModifier": -1
			},
			{
				"fragments": [ "ia", "iu", "ii", "io", "[aeio][aeiou]{2}", "[aeiou]ing", "[^aeiou]ying", "ui[aeou]" ],
				"countModifier": 1
			},
			{
				"fragments": [ "^ree[jmnpqrsx]", "^reele", "^reeva", "riet",
					"dien", "[aeiouym][bdp]le$", "uei", "uou",
					"^mc", "ism$", "[^l]lien", "^coa[dglx].",
					"[^gqauieo]ua[^auieo]", "dn't$", "uity$", "ie(r|st)",
					"[aeiouw]y[aeiou]", "[^ao]ire[ds]", "[^ao]ire$" ],
				"countModifier": 1
			},
			{
				"fragments": [ "eoa", "eoo", "ioa", "ioe", "ioo" ],
				"countModifier": 1
			}
		],
		"words": {
			"full": [
				{
					"word": "business",
					"syllables": 2
				},
				{
					"word": "coheiress",
					"syllables": 3
				},
				{
					"word": "colonel",
					"syllables": 2
				},
				{
					"word": "heiress",
					"syllables": 2
				},
				{
					"word": "i.e",
					"syllables": 2
				},
				{
					"word": "shoreline",
					"syllables": 2
				},
				{
					"word": "simile",
					"syllables": 3
				},
				{
					"word": "unheired",
					"syllables": 2
				},
				{
					"word": "wednesday",
					"syllables": 2
				}
			],
			"fragments": {
				"global": [
					{
						"word": "coyote",
						"syllables": 3
					},
					{
						"word": "graveyard",
						"syllables": 2
					},
					{
						"word": "lawyer",
						"syllables": 2
					}
				]
			}
		}
	}
}

},{}],251:[function(require,module,exports){
module.exports={
	"vowels": "aeiouyàèéìîïòù",
	"deviations": {
		"vowels": [
			{
				"fragments": [ "a[íúeo]", "e[íúao]", "o[íúaeè]", "í[aeo]", "ú[aeo]", "ai[aeou]", "àii", "aiì", "au[eé]", "ei[aàeèé]", "èia", "ia[èiì]", "iài", "oi[aàeèo]", "òia", "óio", "uí", "ui[aàó]",
					"ùio", "ouï", "coo[cmnpr]", "lcool", "coòf", "[aeuioìùèéàò]y[aeuioíìùèàó]", "ìa$", "èa$" ],
				"countModifier": 1
			},
			{
				"fragments": [ "aoi", "aoì", "ioe", "riae", "ïa$" ],
				"countModifier": 1
			}
		],
		"words": {
			"full": [
				{
					"word": "via",
					"syllables": 2
				},
				{
					"word": "guaime",
					"syllables": 3
				},
				{
					"word": "guaina",
					"syllables": 3
				},
				{
					"word": "coke",
					"syllables": 1
				},
				{
					"word": "frame",
					"syllables": 1
				},
				{
					"word": "goal",
					"syllables": 1
				},
				{
					"word": "live",
					"syllables": 1
				},
				{
					"word": "mouse",
					"syllables": 1
				},
				{
					"word": "coon",
					"syllables": 1
				}
			],
			"fragments": {
				"global": [
					{
						"word": "mayoyào",
						"syllables": 4
					},
					{
						"word": "eye-liner",
						"syllables": 3
					},
					{
						"word": "scooner",
						"syllables": 2
					},
					{
						"word": "cocoon",
						"syllables": 2
					},
					{
						"word": "silhouette",
						"syllables": 4
					},
					{
						"word": "circuíto",
						"syllables": 4
					},
					{
						"word": "cruento",
						"syllables": 3
					},
					{
						"word": "cruènto",
						"syllables": 3
					},
					{
						"word": "rituale",
						"syllables": 4
					},
					{
						"word": "duello",
						"syllables": 3
					},
					{
						"word": "fuorviante",
						"syllables": 4
					},
					{
						"word": "league",
						"syllables": 1
					},
					{
						"word": "leader",
						"syllables": 2
					},
					{
						"word": "appeal",
						"syllables": 2
					},
					{
						"word": "backstage",
						"syllables": 2
					},
					{
						"word": "badge",
						"syllables": 1
					},
					{
						"word": "baseball",
						"syllables": 2
					},
					{
						"word": "beauty",
						"syllables": 2
					},
					{
						"word": "bondage",
						"syllables": 2,
						"notFollowedBy": ["s"]
					},
					{
						"word": "break",
						"syllables": 1
					},
					{
						"word": "brokerage",
						"syllables": 3
					},
					{
						"word": "business",
						"syllables": 2
					},
					{
						"word": "cache",
						"syllables": 2,
						"notFollowedBy": ["s", "r"]
					},
					{
						"word": "cashmere",
						"syllables": 2
					},
					{
						"word": "challenge",
						"syllables": 2,
						"notFollowedBy": ["s", "r"]
					},
					{
						"word": "charleston",
						"syllables": 2
					},
					{
						"word": "cheap",
						"syllables": 1
					},
					{
						"word": "cottage",
						"syllables": 2,
						"notFollowedBy": ["s"]

					},
					{
						"word": "cruise",
						"syllables": 1,
						"notFollowedBy": ["s", "r"]

					},
					{
						"word": "device",
						"syllables": 2,
						"notFollowedBy": ["s"]
					},
					{
						"word": "downgrade",
						"syllables": 2,
						"notFollowedBy": ["d"]
					},
					{
						"word": "download",
						"syllables": 2
					},
					{
						"word": "drive",
						"syllables": 1,
						"notFollowedBy": ["r"]
					},
					{
						"word": "endorsement",
						"syllables": 3
					},
					{
						"word": "drive",
						"syllables": 1,
						"notFollowedBy": ["r"]
					},
					{
						"word": "executive",
						"syllables": 4
					},
					{
						"word": "firmware",
						"syllables": 2
					},
					{
						"word": "fobia",
						"syllables": 3
					},
					{
						"word": "float",
						"syllables": 1
					},
					{
						"word": "freak",
						"syllables": 1
					},
					{
						"word": "game",
						"syllables": 1,
						"notFollowedBy": ["r"]
					},
					{
						"word": "guideline",
						"syllables": 2
					},
					{
						"word": "hardware",
						"syllables": 2
					},
					{
						"word": "homeless",
						"syllables": 2
					},
					{
						"word": "hardware",
						"syllables": 1,
						"notFollowedBy": ["r"]
					},
					{
						"word": "hardware",
						"syllables": 1,
						"notFollowedBy": ["r"]
					},
					{
						"word": "hardware",
						"syllables": 1,
						"notFollowedBy": ["r"]
					},
					{
						"word": "hospice",
						"syllables": 2,
						"notFollowedBy": ["s"]
					},
					{
						"word": "impeachment",
						"syllables": 3
					},
					{
						"word": "jeans",
						"syllables": 1
					},
					{
						"word": "jukebox",
						"syllables": 2
					},
					{
						"word": "leasing",
						"syllables": 2
					},
					{
						"word": "lease",
						"syllables": 1,
						"notFollowedBy": ["s"]
					},
					{
						"word": "lounge",
						"syllables": 1,
						"notFollowedBy": ["r", "s"]
					},
					{
						"word": "magazine",
						"syllables": 3
					},
					{
						"word": "notebook",
						"syllables": 2
					},
					{
						"word": "office",
						"syllables": 2,
						"notFollowedBy": ["r", "s"]
					},
					{
						"word": "online",
						"syllables": 2
					},
					{
						"word": "offline",
						"syllables": 2
					},
					{
						"word": "overcoat",
						"syllables": 3
					},
					{
						"word": "offside",
						"syllables": 2,
						"notFollowedBy": ["r"]
					},
					{
						"word": "overdrive",
						"syllables": 3
					},
					{
						"word": "oversize",
						"syllables": 3
					},
					{
						"word": "pacemaker",
						"syllables": 3
					},
					{
						"word": "package",
						"syllables": 2,
						"notFollowedBy": ["r", "s"]
					},
					{
						"word": "pancake",
						"syllables": 2
					},
					{
						"word": "performance",
						"syllables": 3
					},
					{
						"word": "premium",
						"syllables": 3
					},
					{
						"word": "ragtime",
						"syllables": 2
					},
					{
						"word": "reading",
						"syllables": 2
					},
					{
						"word": "residence",
						"syllables": 3,
						"notFollowedBy": ["s"]
					},
					{
						"word": "roaming",
						"syllables": 2
					},
					{
						"word": "rollerblade",
						"syllables": 3,
						"notFollowedBy": ["r"]
					},
					{
						"word": "royalty",
						"syllables": 3
					},
					{
						"word": "shake",
						"syllables": 1,
						"notFollowedBy": ["r"]
					},
					{
						"word": "shale",
						"syllables": 1
					},
					{
						"word": "shampooing",
						"syllables": 3
					},
					{
						"word": "shareware",
						"syllables": 2
					},
					{
						"word": "shearling",
						"syllables": 2
					},
					{
						"word": "sidecar",
						"syllables": 2
					},
					{
						"word": "hardware",
						"syllables": 1,
						"notFollowedBy": ["r"]
					},
					{
						"word": "skate",
						"syllables": 1,
						"notFollowedBy": [ "n", "r" ]
					},
					{
						"word": "trial",
						"syllables": 2
					},
					{
						"word": "toast",
						"syllables": 1
					},
					{
						"word": "texture",
						"syllables": 2
					},
					{
						"word": "testimonial",
						"syllables": 5
					},
					{
						"word": "teaser",
						"syllables": 2
					},
					{
						"word": "sweater",
						"syllables": 2
					},
					{
						"word": "suspense",
						"syllables": 2,
						"notFollowedBy": ["r"]
					},
					{
						"word": "subroutine",
						"syllables": 3
					},
					{
						"word": "steadicam",
						"syllables": 3
					},
					{
						"word": "spread",
						"syllables": 1
					},
					{
						"word": "speaker",
						"syllables": 2
					},
					{
						"word": "board",
						"syllables": 1
					},
					{
						"word": "sneaker",
						"syllables": 2
					},
					{
						"word": "smartphone",
						"syllables": 2
					},
					{
						"word": "slide",
						"syllables": 1,
						"notFollowedBy": ["r"]
					},
					{
						"word": "skyline",
						"syllables": 2
					},
					{
						"word": "skinhead",
						"syllables": 2
					},
					{
						"word": "update",
						"syllables": 2,
						"notFollowedBy": ["r"]
					},
					{
						"word": "upgrade",
						"syllables": 2,
						"notFollowedBy": ["r"]
					},
					{
						"word": "upload",
						"syllables": 2
					},
					{
						"word": "vintage",
						"syllables": 2
					},
					{
						"word": "wakeboard",
						"syllables": 2
					},
					{
						"word": "website",
						"syllables": 2
					},
					{
						"word": "welfare",
						"syllables": 2
					},
					{
						"word": "yeah",
						"syllables": 1
					},
					{
						"word": "yearling",
						"syllables": 2
					}
				],
				"atEnd": [
					{
						"word": "byte",
						"syllables": 1,
						"alsoFollowedBy": ["s"]
					},
					{
						"word": "bite",
						"syllables": 1,
						"alsoFollowedBy": ["s"]
					},
					{
						"word": "beat",
						"syllables": 1,
						"alsoFollowedBy": ["s"]
					},
					{
						"word": "coach",
						"syllables": 1
					},
					{
						"word": "line",
						"syllables": 1,
						"alsoFollowedBy": ["s"]
					}

				],
				"atBeginning": [
					{
						"word": "cheese",
						"syllables": 1
					},
					{
						"word": "head",
						"syllables": 1
					},
					{
						"word": "streak",
						"syllables": 1
					}
				],
				"atBeginningOrEnd": [
					{
						"word": "team",
						"syllables": 1
					},
					{
						"word": "stream",
						"syllables": 1
					}
				]
			}
		}
	}
}

},{}],252:[function(require,module,exports){
module.exports={
	"vowels": "aáäâeéëêiíïîoóöôuúüûy",
	"deviations": {
		"vowels": [
			{
				"fragments": [ "ue$", "dge$", "[tcp]iënt",
					"ace$", "[br]each", "[ainpr]tiaal", "[io]tiaan",
					"gua[yc]", "[^i]deal", "tive$", "load", "[^e]coke",
					"[^s]core$" ],
				"countModifier": -1
			},
			{
				"fragments": [ "aä", "aeu", "aie", "ao", "ë", "eo",
					"eú", "ieau", "ea$", "ea[^u]", "ei[ej]",
					"eu[iu]", "ï", "iei", "ienne", "[^l]ieu[^w]",
					"[^l]ieu$", "i[auiy]", "stion",
					"[^cstx]io", "^sion", "riè", "oö", "oa", "oeing",
					"oie", "[eu]ü", "[^q]u[aeèo]", "uie",
					"[bhnpr]ieel", "[bhnpr]iël" ],
				"countModifier": 1
			},
			{
				"fragments": [ "[aeolu]y[aeéèoóu]" ],
				"countModifier": 1
			}
		],
		"words": {
			"full": [
				{ "word": "bye", "syllables": 1 },
				{ "word": "core", "syllables": 1 },
				{ "word": "cure", "syllables": 1 },
				{ "word": "dei", "syllables": 2 },
				{ "word": "dope", "syllables": 1 },
				{ "word": "dude", "syllables": 1 },
				{ "word": "fake", "syllables": 1 },
				{ "word": "fame", "syllables": 1 },
				{ "word": "five", "syllables": 1 },
				{ "word": "hole", "syllables": 1 },
				{ "word": "least", "syllables": 1 },
				{ "word": "lone", "syllables": 1 },
				{ "word": "minute", "syllables": 2 },
				{ "word": "move", "syllables": 1 },
				{ "word": "nice", "syllables": 1 },
				{ "word": "one", "syllables": 1 },
				{ "word": "state", "syllables": 1 },
				{ "word": "surplace", "syllables": 2 },
				{ "word": "take", "syllables": 1 },
				{ "word": "trade", "syllables": 1 },
				{ "word": "wide", "syllables": 1 }
			],
			"fragments": {
				"global": [
					{ "word": "adieu", "syllables": 2 },
					{ "word": "airline", "syllables": 2 },
					{ "word": "airmiles", "syllables": 2 },
					{ "word": "alien", "syllables": 3 },
					{ "word": "ambient", "syllables": 3 },
					{ "word": "announcement", "syllables": 3 },
					{ "word": "appearance", "syllables": 3 },
					{ "word": "appeasement", "syllables": 3 },
					{ "word": "atheneum", "syllables": 4 },
					{ "word": "awesome", "syllables": 2 },
					{ "word": "baccalaurei", "syllables": 5 },
					{ "word": "baccalaureus", "syllables": 5 },
					{ "word": "baseball", "syllables": 3 },
					{ "word": "basejump", "syllables": 2 },
					{ "word": "banlieue", "syllables": 3 },
					{ "word": "bapao", "syllables": 2 },
					{ "word": "barbecue", "syllables": 3 },
					{ "word": "beamer", "syllables": 2 },
					{ "word": "beanie", "syllables": 2 },
					{ "word": "beat", "syllables": 1 },
					{ "word": "belle", "syllables": 2 },
					{ "word": "bête", "syllables": 1 },
					{ "word": "bingewatch", "syllables": 2 },
					{ "word": "blocnote", "syllables": 2 },
					{ "word": "blue", "syllables": 1 },
					{ "word": "board", "syllables": 1 },
					{ "word": "break", "syllables": 1 },
					{ "word": "broad", "syllables": 1 },
					{ "word": "bulls-eye", "syllables": 2 },
					{ "word": "business", "syllables": 2 },
					{ "word": "byebye", "syllables": 2 },
					{ "word": "cacao", "syllables": 2 },
					{ "word": "caesar", "syllables": 2 },
					{ "word": "camaieu", "syllables": 3 },
					{ "word": "caoutchouc", "syllables": 2 },
					{ "word": "carbolineum", "syllables": 5 },
					{ "word": "catchphrase", "syllables": 1 },
					{ "word": "carrier", "syllables": 3 },
					{ "word": "cheat", "syllables": 1 },
					{ "word": "cheese", "syllables": 1 },
					{ "word": "circonflexe", "syllables": 3 },
					{ "word": "clean", "syllables": 1 },
					{ "word": "cloak", "syllables": 1 },
					{ "word": "cobuying", "syllables": 3 },
					{ "word": "comeback", "syllables": 2 },
					{ "word": "comfortzone", "syllables": 3 },
					{ "word": "communiqué", "syllables": 4 },
					{ "word": "conopeum", "syllables": 4 },
					{ "word": "console", "syllables": 2 },
					{ "word": "corporate", "syllables": 3 },
					{ "word": "coûte", "syllables": 1 },
					{ "word": "creamer", "syllables": 2 },
					{ "word": "crime", "syllables": 1 },
					{ "word": "cruesli", "syllables": 2 },
					{ "word": "deadline", "syllables": 2 },
					{ "word": "deautoriseren", "syllables": 6 },
					{ "word": "deuce", "syllables": 1 },
					{ "word": "deum", "syllables": 2 },
					{ "word": "dirndl", "syllables": 2 },
					{ "word": "dread", "syllables": 2 },
					{ "word": "dreamteam", "syllables": 2 },
					{ "word": "drone", "syllables": 1 },
					{ "word": "enquête", "syllables": 3 },
					{ "word": "escape", "syllables": 2 },
					{ "word": "exposure", "syllables": 3 },
					{ "word": "extranei", "syllables": 4 },
					{ "word": "extraneus", "syllables": 4 },
					{ "word": "eyecatcher", "syllables": 3 },
					{ "word": "eyeliner", "syllables": 3 },
					{ "word": "eyeopener", "syllables": 4 },
					{ "word": "eyetracker", "syllables": 3 },
					{ "word": "eyetracking", "syllables": 3 },
					{ "word": "fairtrade", "syllables": 2 },
					{ "word": "fauteuil", "syllables": 2 },
					{ "word": "feature", "syllables": 2 },
					{ "word": "feuilletee", "syllables": 3 },
					{ "word": "feuilleton", "syllables": 3 },
					{ "word": "fisheye", "syllables": 2 },
					{ "word": "fineliner", "syllables": 3 },
					{ "word": "finetunen", "syllables": 3 },
					{ "word": "forehand", "syllables": 2 },
					{ "word": "freak", "syllables": 1 },
					{ "word": "fusioneren", "syllables": 4 },
					{ "word": "gayparade", "syllables": 3 },
					{ "word": "gaypride", "syllables": 2 },
					{ "word": "goal", "syllables": 1 },
					{ "word": "grapefruit", "syllables": 2 },
					{ "word": "gruyère", "syllables": 3 },
					{ "word": "guele", "syllables": 1 },
					{ "word": "guerrilla", "syllables": 3 },
					{ "word": "guest", "syllables": 1 },
					{ "word": "hardware", "syllables": 2 },
					{ "word": "haute", "syllables": 1 },
					{ "word": "healing", "syllables": 2 },
					{ "word": "heater", "syllables": 2 },
					{ "word": "heavy", "syllables": 2 },
					{ "word": "hoax", "syllables": 1 },
					{ "word": "hotline", "syllables": 2 },
					{ "word": "idee-fixe", "syllables": 3 },
					{ "word": "inclusive", "syllables": 3 },
					{ "word": "inline", "syllables": 2 },
					{ "word": "intake", "syllables": 2 },
					{ "word": "intensive", "syllables": 3 },
					{ "word": "jeans", "syllables": 1 },
					{ "word": "Jones", "syllables": 1 },
					{ "word": "jubileum", "syllables": 4 },
					{ "word": "kalfsribeye", "syllables": 3 },
					{ "word": "kraaiennest", "syllables": 3 },
					{ "word": "lastminute", "syllables": 3 },
					{ "word": "learning", "syllables": 2 },
					{ "word": "league", "syllables": 1 },
					{ "word": "line-up", "syllables": 2 },
					{ "word": "linoleum", "syllables": 4 },
					{ "word": "load", "syllables": 1 },
					{ "word": "loafer", "syllables": 2 },
					{ "word": "longread", "syllables": 2 },
					{ "word": "lookalike", "syllables": 3 },
					{ "word": "louis", "syllables": 3 },
					{ "word": "lyceum", "syllables": 3 },
					{ "word": "magazine", "syllables": 3 },
					{ "word": "mainstream", "syllables": 2 },
					{ "word": "make-over", "syllables": 3 },
					{ "word": "make-up", "syllables": 2 },
					{ "word": "malware", "syllables": 2 },
					{ "word": "marmoleum", "syllables": 4 },
					{ "word": "mausoleum", "syllables": 4 },
					{ "word": "medeauteur", "syllables": 4 },
					{ "word": "midlifecrisis", "syllables": 4 },
					{ "word": "migraineaura", "syllables": 5 },
					{ "word": "milkshake", "syllables": 2 },
					{ "word": "millefeuille", "syllables": 4 },
					{ "word": "mixed", "syllables": 1 },
					{ "word": "muesli", "syllables": 2 },
					{ "word": "museum", "syllables": 3 },
					{ "word": "must-have", "syllables": 2 },
					{ "word": "must-read", "syllables": 2 },
					{ "word": "notebook", "syllables": 2 },
					{ "word": "nonsense", "syllables": 2 },
					{ "word": "nowhere", "syllables": 2 },
					{ "word": "nurture", "syllables": 2 },
					{ "word": "offline", "syllables": 2 },
					{ "word": "oneliner", "syllables": 3 },
					{ "word": "onesie", "syllables": 2 },
					{ "word": "online", "syllables": 2 },
					{ "word": "opinion", "syllables": 3 },
					{ "word": "paella", "syllables": 3 },
					{ "word": "pacemaker", "syllables": 3 },
					{ "word": "panache", "syllables": 2 },
					{ "word": "papegaaienneus", "syllables": 5 },
					{ "word": "passe-partout", "syllables": 3 },
					{ "word": "peanuts", "syllables": 2 },
					{ "word": "perigeum", "syllables": 4 },
					{ "word": "perineum", "syllables": 4 },
					{ "word": "perpetuum", "syllables": 4 },
					{ "word": "petroleum", "syllables": 4 },
					{ "word": "phone", "syllables": 3 },
					{ "word": "picture", "syllables": 2 },
					{ "word": "placemat", "syllables": 2 },
					{ "word": "porte-manteau", "syllables": 3 },
					{ "word": "portefeuille", "syllables": 4 },
					{ "word": "presse-papier", "syllables": 3 },
					{ "word": "primetime", "syllables": 2 },
					{ "word": "queen", "syllables": 1 },
					{ "word": "questionnaire", "syllables": 3 },
					{ "word": "queue", "syllables": 1 },
					{ "word": "reader", "syllables": 2 },
					{ "word": "reality", "syllables": 3 },
					{ "word": "reallife", "syllables": 2 },
					{ "word": "remake", "syllables": 2 },
					{ "word": "repeat", "syllables": 2 },
					{ "word": "repertoire", "syllables": 3 },
					{ "word": "research", "syllables": 2 },
					{ "word": "reverence", "syllables": 3 },
					{ "word": "ribeye", "syllables": 2 },
					{ "word": "ringtone", "syllables": 3 },
					{ "word": "road", "syllables": 1 },
					{ "word": "roaming", "syllables": 2 },
					{ "word": "sciencefiction", "syllables": 4 },
					{ "word": "selfmade", "syllables": 2 },
					{ "word": "sidekick", "syllables": 2 },
					{ "word": "sightseeing", "syllables": 3 },
					{ "word": "skyline", "syllables": 2 },
					{ "word": "smile", "syllables": 1 },
					{ "word": "sneaky", "syllables": 2 },
					{ "word": "software", "syllables": 2 },
					{ "word": "sparerib", "syllables": 2 },
					{ "word": "speaker", "syllables": 2 },
					{ "word": "spread", "syllables": 1 },
					{ "word": "statement", "syllables": 2 },
					{ "word": "steak", "syllables": 1 },
					{ "word": "steeplechase", "syllables": 3 },
					{ "word": "stonewash", "syllables": 2 },
					{ "word": "store", "syllables": 1 },
					{ "word": "streaken", "syllables": 2 },
					{ "word": "stream", "syllables": 1 },
					{ "word": "streetware", "syllables": 1 },
					{ "word": "supersoaker", "syllables": 4 },
					{ "word": "surprise-party", "syllables": 4 },
					{ "word": "sweater", "syllables": 2 },
					{ "word": "teaser", "syllables": 2 },
					{ "word": "tenue", "syllables": 2 },
					{ "word": "template", "syllables": 2 },
					{ "word": "timeline", "syllables": 2 },
					{ "word": "tissue", "syllables": 2 },
					{ "word": "toast", "syllables": 1 },
					{ "word": "tête-à-tête", "syllables": 3 },
					{ "word": "typecast", "syllables": 2 },
					{ "word": "unique", "syllables": 2 },
					{ "word": "ureum", "syllables": 3 },
					{ "word": "vibe", "syllables": 1 },
					{ "word": "vieux", "syllables": 1 },
					{ "word": "ville", "syllables": 1 },
					{ "word": "vintage", "syllables": 2 },
					{ "word": "wandelyup", "syllables": 3 },
					{ "word": "wiseguy", "syllables": 2 },
					{ "word": "wake-up-call", "syllables": 3 },
					{ "word": "webcare", "syllables": 2 },
					{ "word": "winegum", "syllables": 2 },
					{ "word": "base", "syllables": 1, "notFollowedBy": [ "e", "n", "r" ] },
					{ "word": "game", "syllables": 1, "notFollowedBy": [ "n", "l", "r" ] },
					{ "word": "style", "syllables": 1, "notFollowedBy": [ "n", "s" ] },
					{ "word": "douche", "syllables": 1, "notFollowedBy": [ "n", "s" ] },
					{ "word": "space", "syllables": 1, "notFollowedBy": [ "n", "s" ] },
					{ "word": "striptease", "syllables": 2, "notFollowedBy": [ "n", "s" ] },
					{ "word": "jive", "syllables": 1, "notFollowedBy": [ "n", "r" ] },
					{ "word": "keynote", "syllables": 2, "notFollowedBy": [ "n", "r" ] },
					{ "word": "mountainbike", "syllables": 3, "notFollowedBy": [ "n", "r" ] },
					{ "word": "face", "syllables": 1, "notFollowedBy": [ "n", "t" ] },
					{ "word": "challenge", "syllables": 2, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "cruise", "syllables": 1, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "house", "syllables": 1, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "dance", "syllables": 1, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "franchise", "syllables": 2, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "freelance", "syllables": 2, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "lease", "syllables": 1, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "linedance", "syllables": 2, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "lounge", "syllables": 1, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "merchandise", "syllables": 3, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "performance", "syllables": 3, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "release", "syllables": 2, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "resource", "syllables": 2, "notFollowedBy": [ "n", "r", "s" ] },
					{ "word": "cache", "syllables": 1, "notFollowedBy": [ "c", "l", "n", "t", "x" ] },
					{ "word": "office", "syllables": 2, "notFollowedBy": [ "r", "s" ] },
					{ "word": "close", "syllables": 1, "notFollowedBy": [ "r", "t" ] }
				],
				"atBeginningOrEnd": [
					{ "word": "byte", "syllables": 1 },
					{ "word": "cake", "syllables": 1 },
					{ "word": "care", "syllables": 1 },
					{ "word": "coach", "syllables": 1 },
					{ "word": "coat", "syllables": 1 },
					{ "word": "earl", "syllables": 1 },
					{ "word": "foam", "syllables": 1 },
					{ "word": "gate", "syllables": 1 },
					{ "word": "head", "syllables": 1 },
					{ "word": "home", "syllables": 1 },
					{ "word": "live", "syllables": 1 },
					{ "word": "safe", "syllables": 1 },
					{ "word": "site", "syllables": 1 },
					{ "word": "soap", "syllables": 1 },
					{ "word": "teak", "syllables": 1 },
					{ "word": "team", "syllables": 1 },
					{ "word": "wave", "syllables": 1 },
					{ "word": "brace", "syllables": 1, "notFollowedBy": [ "s" ] },
					{ "word": "case", "syllables": 1, "notFollowedBy": [ "s" ] },
					{ "word": "fleece", "syllables": 1, "notFollowedBy": [ "s" ] },
					{ "word": "service", "syllables": 2, "notFollowedBy": [ "s" ] },
					{ "word": "voice", "syllables": 1, "notFollowedBy": [ "s" ] },
					{ "word": "kite", "syllables": 1, "notFollowedBy": [ "n", "r" ] },
					{ "word": "skate", "syllables": 1, "notFollowedBy": [ "n", "r" ] },
					{ "word": "race", "syllables": 1, "notFollowedBy": [ "n", "r", "s" ] }
				],
				"atBeginning": [
					{ "word": "coke", "syllables": 1 },
					{ "word": "deal", "syllables": 1 },
					{ "word": "image", "syllables": 2, "notFollowedBy": [ "s" ] }
				],
				"atEnd": [
					{ "word": "force", "syllables": 1 },
					{ "word": "tea", "syllables": 1 },
					{ "word": "time", "syllables": 1 },
					{ "word": "date", "syllables": 1, "alsoFollowedBy": [ "s" ] },
					{ "word": "hype", "syllables": 1, "alsoFollowedBy": [ "s" ] },
					{ "word": "quote", "syllables": 1, "alsoFollowedBy": [ "s" ] },
					{ "word": "tape", "syllables": 1, "alsoFollowedBy": [ "s" ] },
					{ "word": "upgrade", "syllables": 2, "alsoFollowedBy": [ "s" ] }
				]
			}
		}
	}
}

},{}],253:[function(require,module,exports){
"use strict";

var getLanguage = require("../helpers/getLanguage.js");
var isUndefined = require("lodash/isUndefined");
var transliterations = {
    // Language: Spanish.
    // Source: https://en.wikipedia.org/wiki/Spanish_orthography
    es: [{ letter: /[\u00F1]/g, alternative: "n" }, { letter: /[\u00D1]/g, alternative: "N" }, { letter: /[\u00E1]/g, alternative: "a" }, { letter: /[\u00C1]/g, alternative: "A" }, { letter: /[\u00E9]/g, alternative: "e" }, { letter: /[\u00C9]/g, alternative: "E" }, { letter: /[\u00ED]/g, alternative: "i" }, { letter: /[\u00CD]/g, alternative: "I" }, { letter: /[\u00F3]/g, alternative: "o" }, { letter: /[\u00D3]/g, alternative: "O" }, { letter: /[\u00FA\u00FC]/g, alternative: "u" }, { letter: /[\u00DA\u00DC]/g, alternative: "U" }],
    // Language: Polish.
    // Source: https://en.wikipedia.org/wiki/Polish_orthography
    pl: [{ letter: /[\u0105]/g, alternative: "a" }, { letter: /[\u0104]/g, alternative: "A" }, { letter: /[\u0107]/g, alternative: "c" }, { letter: /[\u0106]/g, alternative: "C" }, { letter: /[\u0119]/g, alternative: "e" }, { letter: /[\u0118]/g, alternative: "E" }, { letter: /[\u0142]/g, alternative: "l" }, { letter: /[\u0141]/g, alternative: "L" }, { letter: /[\u0144]/g, alternative: "n" }, { letter: /[\u0143]/g, alternative: "N" }, { letter: /[\u00F3]/g, alternative: "o" }, { letter: /[\u00D3]/g, alternative: "O" }, { letter: /[\u015B]/g, alternative: "s" }, { letter: /[\u015A]/g, alternative: "S" }, { letter: /[\u017A\u017C]/g, alternative: "z" }, { letter: /[\u0179\u017B]/g, alternative: "Z" }],
    // Language: German.
    // Source: https://en.wikipedia.org/wiki/German_orthography#Special_characters
    de: [{ letter: /[\u00E4]/g, alternative: "ae" }, { letter: /[\u00C4]/g, alternative: "Ae" }, { letter: /[\u00FC]/g, alternative: "ue" }, { letter: /[\u00DC]/g, alternative: "Ue" }, { letter: /[\u00F6]/g, alternative: "oe" }, { letter: /[\u00D6]/g, alternative: "Oe" }, { letter: /[\u00DF]/g, alternative: "ss" }, { letter: /[\u1E9E]/g, alternative: "SS" }],
    // Language Bokmål
    // Source: http://www.dagbladet.no/2011/12/30/tema/reise/reiseeksperter/forbrukerrettigheter/19494227/
    // Language Nynorks
    // Source: http://www.dagbladet.no/2011/12/30/tema/reise/reiseeksperter/forbrukerrettigheter/19494227/
    // Bokmål and Nynorks use the same transliterations
    nbnn: [{ letter: /[\u00E6\u04D5]/g, alternative: "ae" }, { letter: /[\u00C6\u04D4]/g, alternative: "Ae" }, { letter: /[\u00E5]/g, alternative: "aa" }, { letter: /[\u00C5]/g, alternative: "Aa" }, { letter: /[\u00F8]/g, alternative: "oe" }, { letter: /[\u00D8]/g, alternative: "Oe" }, { letter: /[\u00E9\u00E8\u00EA]/g, alternative: "e" }, { letter: /[\u00C9\u00C8\u00CA]/g, alternative: "E" }, { letter: /[\u00F3\u00F2\u00F4]/g, alternative: "o" }, { letter: /[\u00D3\u00D2\u00D4]/g, alternative: "O" }],
    // Language: Swedish.
    // Sources: https://sv.wikipedia.org/wiki/%C3%85#Historia
    // http://forum.wordreference.com/threads/swedish-%C3%A4-ae-%C3%B6-oe-acceptable.1451839/
    sv: [{ letter: /[\u00E5]/g, alternative: "aa" }, { letter: /[\u00C5]/g, alternative: "Aa" }, { letter: /[\u00E4]/g, alternative: "ae" }, { letter: /[\u00C4]/g, alternative: "Ae" }, { letter: /[\u00F6]/g, alternative: "oe" }, { letter: /[\u00D6]/g, alternative: "Oe" }, { letter: /[\u00E9]/g, alternative: "e" }, { letter: /[\u00C9]/g, alternative: "E" }, { letter: /[\u00E0]/g, alternative: "a" }, { letter: /[\u00C0]/g, alternative: "A" }],
    // Language: Finnish.
    // Sources: https://www.cs.tut.fi/~jkorpela/lang/finnish-letters.html
    // https://en.wikipedia.org/wiki/Finnish_orthography
    fi: [{ letter: /[\u00E5]/g, alternative: "aa" }, { letter: /[\u00C5]/g, alternative: "Aa" }, { letter: /[\u00E4]/g, alternative: "a" }, { letter: /[\u00C4]/g, alternative: "A" }, { letter: /[\u00F6]/g, alternative: "o" }, { letter: /[\u00D6]/g, alternative: "O" }, { letter: /[\u017E]/g, alternative: "zh" }, { letter: /[\u017D]/g, alternative: "Zh" }, { letter: /[\u0161]/g, alternative: "sh" }, { letter: /[\u0160]/g, alternative: "Sh" }],
    // Language: Danish.
    // Sources: https://sv.wikipedia.org/wiki/%C3%85#Historia
    // https://en.wikipedia.org/wiki/Danish_orthography
    da: [{ letter: /[\u00E5]/g, alternative: "aa" }, { letter: /[\u00C5]/g, alternative: "Aa" }, { letter: /[\u00E6\u04D5]/g, alternative: "ae" }, { letter: /[\u00C6\u04D4]/g, alternative: "Ae" }, { letter: /[\u00C4]/g, alternative: "Ae" }, { letter: /[\u00F8]/g, alternative: "oe" }, { letter: /[\u00D8]/g, alternative: "Oe" }, { letter: /[\u00E9]/g, alternative: "e" }, { letter: /[\u00C9]/g, alternative: "E" }],
    // Language: Turkish.
    // Source: https://en.wikipedia.org/wiki/Turkish_alphabet
    // ‘İ’ is the capital dotted ‘i’. Its lowercase counterpart is the ‘regular’ ‘i’.
    tr: [{ letter: /[\u00E7]/g, alternative: "c" }, { letter: /[\u00C7]/g, alternative: "C" }, { letter: /[\u011F]/g, alternative: "g" }, { letter: /[\u011E]/g, alternative: "G" }, { letter: /[\u00F6]/g, alternative: "o" }, { letter: /[\u00D6]/g, alternative: "O" }, { letter: /[\u015F]/g, alternative: "s" }, { letter: /[\u015E]/g, alternative: "S" }, { letter: /[\u00E2]/g, alternative: "a" }, { letter: /[\u00C2]/g, alternative: "A" }, { letter: /[\u0131\u00EE]/g, alternative: "i" }, { letter: /[\u0130\u00CE]/g, alternative: "I" }, { letter: /[\u00FC\u00FB]/g, alternative: "u" }, { letter: /[\u00DC\u00DB]/g, alternative: "U" }],
    // Language: Latvian.
    // Source: https://en.wikipedia.org/wiki/Latvian_orthography
    lv: [{ letter: /[\u0101]/g, alternative: "a" }, { letter: /[\u0100]/g, alternative: "A" }, { letter: /[\u010D]/g, alternative: "c" }, { letter: /[\u010C]/g, alternative: "C" }, { letter: /[\u0113]/g, alternative: "e" }, { letter: /[\u0112]/g, alternative: "E" }, { letter: /[\u0123]/g, alternative: "g" }, { letter: /[\u0122]/g, alternative: "G" }, { letter: /[\u012B]/g, alternative: "i" }, { letter: /[\u012A]/g, alternative: "I" }, { letter: /[\u0137]/g, alternative: "k" }, { letter: /[\u0136]/g, alternative: "K" }, { letter: /[\u013C]/g, alternative: "l" }, { letter: /[\u013B]/g, alternative: "L" }, { letter: /[\u0146]/g, alternative: "n" }, { letter: /[\u0145]/g, alternative: "N" }, { letter: /[\u0161]/g, alternative: "s" }, { letter: /[\u0160]/g, alternative: "S" }, { letter: /[\u016B]/g, alternative: "u" }, { letter: /[\u016A]/g, alternative: "U" }, { letter: /[\u017E]/g, alternative: "z" }, { letter: /[\u017D]/g, alternative: "Z" }],
    // Language: Icelandic.
    // Sources: https://en.wikipedia.org/wiki/Thorn_(letter),
    // https://en.wikipedia.org/wiki/Eth,  https://en.wikipedia.org/wiki/Icelandic_orthography
    is: [{ letter: /[\u00E1]/g, alternative: "a" }, { letter: /[\u00C1]/g, alternative: "A" }, { letter: /[\u00F0]/g, alternative: "d" }, { letter: /[\u00D0]/g, alternative: "D" }, { letter: /[\u00E9]/g, alternative: "e" }, { letter: /[\u00C9]/g, alternative: "E" }, { letter: /[\u00ED]/g, alternative: "i" }, { letter: /[\u00CD]/g, alternative: "I" }, { letter: /[\u00F3\u00F6]/g, alternative: "o" }, { letter: /[\u00D3\u00D6]/g, alternative: "O" }, { letter: /[\u00FA]/g, alternative: "u" }, { letter: /[\u00DA]/g, alternative: "U" }, { letter: /[\u00FD]/g, alternative: "y" }, { letter: /[\u00DD]/g, alternative: "Y" }, { letter: /[\u00FE]/g, alternative: "th" }, { letter: /[\u00DE]/g, alternative: "Th" }, { letter: /[\u00E6\u04D5]/g, alternative: "ae" }, { letter: /[\u00C6\u04D4]/g, alternative: "Ae" }],
    // Language: Faroese.
    // Source: https://www.facebook.com/groups/1557965757758234/permalink/1749847165236758/ (conversation in private Facebook Group ‘Faroese Language Learning Enthusiasts’)
    // depending on the word, ð can be d, g, j, v, ng or nothing. However, ‘d’ is most frequent.
    // when writing text messages or using a foreign keyboard, í is sometimes written as ij, ý as yj, ú as uv, ó as ov, ø as oe, and á as aa or oa.
    // However, in website URLs the alternatives mentioned below are by far the most common.
    fa: [{ letter: /[\u00E1]/g, alternative: "a" }, { letter: /[\u00C1]/g, alternative: "A" }, { letter: /[\u00F0]/g, alternative: "d" }, { letter: /[\u00D0]/g, alternative: "D" }, { letter: /[\u00ED]/g, alternative: "i" }, { letter: /[\u00CD]/g, alternative: "I" }, { letter: /[\u00FD]/g, alternative: "y" }, { letter: /[\u00DD]/g, alternative: "Y" }, { letter: /[\u00FA]/g, alternative: "u" }, { letter: /[\u00DA]/g, alternative: "U" }, { letter: /[\u00F3\u00F8]/g, alternative: "o" }, { letter: /[\u00D3\u00D8]/g, alternative: "O" }, { letter: /[\u00E6\u04D5]/g, alternative: "ae" }, { letter: /[\u00C6\u04D4]/g, alternative: "Ae" }],
    // Language: Czech.
    // Source: https://en.wikipedia.org/wiki/Czech_orthography
    cs: [{ letter: /[\u00E1]/g, alternative: "a" }, { letter: /[\u00C1]/g, alternative: "A" }, { letter: /[\u010D]/g, alternative: "c" }, { letter: /[\u010C]/g, alternative: "C" }, { letter: /[\u010F]/g, alternative: "d" }, { letter: /[\u010E]/g, alternative: "D" }, { letter: /[\u00ED]/g, alternative: "i" }, { letter: /[\u00CD]/g, alternative: "I" }, { letter: /[\u0148]/g, alternative: "n" }, { letter: /[\u0147]/g, alternative: "N" }, { letter: /[\u00F3]/g, alternative: "o" }, { letter: /[\u00D3]/g, alternative: "O" }, { letter: /[\u0159]/g, alternative: "r" }, { letter: /[\u0158]/g, alternative: "R" }, { letter: /[\u0161]/g, alternative: "s" }, { letter: /[\u0160]/g, alternative: "S" }, { letter: /[\u0165]/g, alternative: "t" }, { letter: /[\u0164]/g, alternative: "T" }, { letter: /[\u00FD]/g, alternative: "y" }, { letter: /[\u00DD]/g, alternative: "Y" }, { letter: /[\u017E]/g, alternative: "z" }, { letter: /[\u017D]/g, alternative: "Z" }, { letter: /[\u00E9\u011B]/g, alternative: "e" }, { letter: /[\u00C9\u011A]/g, alternative: "E" }, { letter: /[\u00FA\u016F]/g, alternative: "u" }, { letter: /[\u00DA\u016E]/g, alternative: "U" }],
    // Language: Russian.
    // Source:  Machine Readable Travel Documents, Doc 9303, Part 1, Volume 1 (PDF) (Sixth ed.).
    // ICAO. 2006. p. IV-50—IV-52. http://www.icao.int/publications/Documents/9303_p3_cons_en.pdf
    // ‘ь’ is the so-called soft sign, indicating a sound change (palatalization) of the preceding consonant.
    // In text it is transliterated to a character similar to an apostroph: ′.
    // I recommend omittance in slugs. (https://en.wikipedia.org/wiki/Romanization_of_Russian)
    ru: [{ letter: /[\u0430]/g, alternative: "a" }, { letter: /[\u0410]/g, alternative: "A" }, { letter: /[\u0431]/g, alternative: "b" }, { letter: /[\u0411]/g, alternative: "B" }, { letter: /[\u0432]/g, alternative: "v" }, { letter: /[\u0412]/g, alternative: "V" }, { letter: /[\u0433]/g, alternative: "g" }, { letter: /[\u0413]/g, alternative: "G" }, { letter: /[\u0434]/g, alternative: "d" }, { letter: /[\u0414]/g, alternative: "D" }, { letter: /[\u0435]/g, alternative: "e" }, { letter: /[\u0415]/g, alternative: "E" }, { letter: /[\u0436]/g, alternative: "zh" }, { letter: /[\u0416]/g, alternative: "Zh" }, { letter: /[\u0437]/g, alternative: "z" }, { letter: /[\u0417]/g, alternative: "Z" }, { letter: /[\u0456\u0438\u0439]/g, alternative: "i" }, { letter: /[\u0406\u0418\u0419]/g, alternative: "I" }, { letter: /[\u043A]/g, alternative: "k" }, { letter: /[\u041A]/g, alternative: "K" }, { letter: /[\u043B]/g, alternative: "l" }, { letter: /[\u041B]/g, alternative: "L" }, { letter: /[\u043C]/g, alternative: "m" }, { letter: /[\u041C]/g, alternative: "M" }, { letter: /[\u043D]/g, alternative: "n" }, { letter: /[\u041D]/g, alternative: "N" }, { letter: /[\u0440]/g, alternative: "r" }, { letter: /[\u0420]/g, alternative: "R" }, { letter: /[\u043E]/g, alternative: "o" }, { letter: /[\u041E]/g, alternative: "O" }, { letter: /[\u043F]/g, alternative: "p" }, { letter: /[\u041F]/g, alternative: "P" }, { letter: /[\u0441]/g, alternative: "s" }, { letter: /[\u0421]/g, alternative: "S" }, { letter: /[\u0442]/g, alternative: "t" }, { letter: /[\u0422]/g, alternative: "T" }, { letter: /[\u0443]/g, alternative: "u" }, { letter: /[\u0423]/g, alternative: "U" }, { letter: /[\u0444]/g, alternative: "f" }, { letter: /[\u0424]/g, alternative: "F" }, { letter: /[\u0445]/g, alternative: "kh" }, { letter: /[\u0425]/g, alternative: "Kh" }, { letter: /[\u0446]/g, alternative: "ts" }, { letter: /[\u0426]/g, alternative: "Ts" }, { letter: /[\u0447]/g, alternative: "ch" }, { letter: /[\u0427]/g, alternative: "Ch" }, { letter: /[\u0448]/g, alternative: "sh" }, { letter: /[\u0428]/g, alternative: "Sh" }, { letter: /[\u0449]/g, alternative: "shch" }, { letter: /[\u0429]/g, alternative: "Shch" }, { letter: /[\u044A]/g, alternative: "ie" }, { letter: /[\u042A]/g, alternative: "Ie" }, { letter: /[\u044B]/g, alternative: "y" }, { letter: /[\u042B]/g, alternative: "Y" }, { letter: /[\u044C]/g, alternative: "" }, { letter: /[\u042C]/g, alternative: "" }, { letter: /[\u0451\u044D]/g, alternative: "e" }, { letter: /[\u0401\u042D]/g, alternative: "E" }, { letter: /[\u044E]/g, alternative: "iu" }, { letter: /[\u042E]/g, alternative: "Iu" }, { letter: /[\u044F]/g, alternative: "ia" }, { letter: /[\u042F]/g, alternative: "Ia" }],
    // Language: Esperanto.
    // Source: https://en.wikipedia.org/wiki/Esperanto#Writing_diacritics
    eo: [{ letter: /[\u0109]/g, alternative: "ch" }, { letter: /[\u0108]/g, alternative: "Ch" }, { letter: /[\u011d]/g, alternative: "gh" }, { letter: /[\u011c]/g, alternative: "Gh" }, { letter: /[\u0125]/g, alternative: "hx" }, { letter: /[\u0124]/g, alternative: "Hx" }, { letter: /[\u0135]/g, alternative: "jx" }, { letter: /[\u0134]/g, alternative: "Jx" }, { letter: /[\u015d]/g, alternative: "sx" }, { letter: /[\u015c]/g, alternative: "Sx" }, { letter: /[\u016d]/g, alternative: "ux" }, { letter: /[\u016c]/g, alternative: "Ux" }],
    // Language: Afrikaans.
    // Source: https://en.wikipedia.org/wiki/Afrikaans#Orthography
    af: [{ letter: /[\u00E8\u00EA\u00EB]/g, alternative: "e" }, { letter: /[\u00CB\u00C8\u00CA]/g, alternative: "E" }, { letter: /[\u00EE\u00EF]/g, alternative: "i" }, { letter: /[\u00CE\u00CF]/g, alternative: "I" }, { letter: /[\u00F4\u00F6]/g, alternative: "o" }, { letter: /[\u00D4\u00D6]/g, alternative: "O" }, { letter: /[\u00FB\u00FC]/g, alternative: "u" }, { letter: /[\u00DB\u00DC]/g, alternative: "U" }],
    // Language: Catalan.
    // Source: https://en.wikipedia.org/wiki/Catalan_orthography
    ca: [{ letter: /[\u00E0]/g, alternative: "a" }, { letter: /[\u00C0]/g, alternative: "A" }, { letter: /[\u00E9|\u00E8]/g, alternative: "e" }, { letter: /[\u00C9|\u00C8]/g, alternative: "E" }, { letter: /[\u00ED|\u00EF]/g, alternative: "i" }, { letter: /[\u00CD|\u00CF]/g, alternative: "I" }, { letter: /[\u00F3|\u00F2]/g, alternative: "o" }, { letter: /[\u00D3|\u00D2]/g, alternative: "O" }, { letter: /[\u00FA|\u00FC]/g, alternative: "u" }, { letter: /[\u00DA|\u00DC]/g, alternative: "U" }, { letter: /[\u00E7]/g, alternative: "c" }, { letter: /[\u00C7]/g, alternative: "C" }],
    // Language: Asturian.
    // Source: http://www.orbilat.com/Languages/Asturian/Grammar/Asturian-Alphabet.html
    ast: [{ letter: /[\u00F1]/g, alternative: "n" }, { letter: /[\u00D1]/g, alternative: "N" }],
    // Language: Aragonese.
    // Source: https://en.wikipedia.org/wiki/Aragonese_language#Orthography
    an: [{ letter: /[\u00FC]/g, alternative: "u" }, { letter: /[\u00F1]/g, alternative: "ny" }, { letter: /[\u00E7]/g, alternative: "c" }, { letter: /[\u00ED]/g, alternative: "i" }, { letter: /[\u00F3]/g, alternative: "o" }, { letter: /[\u00E1]/g, alternative: "a" }, { letter: /[\u00DC]/g, alternative: "U" }, { letter: /[\u00D1]/g, alternative: "Ny" }, { letter: /[\u00C7]/g, alternative: "C" }, { letter: /[\u00CD]/g, alternative: "I" }, { letter: /[\u00D3]/g, alternative: "O" }, { letter: /[\u00C1]/g, alternative: "A" }],
    // Language: Aymara.
    // Source: http://www.omniglot.com/writing/aymara.htm
    ay: [{ letter: /(([\u00EF])|([\u00ED]))/g, alternative: "i" }, { letter: /(([\u00CF])|([\u00CD]))/g, alternative: "I" }, { letter: /[\u00E4]/g, alternative: "a" }, { letter: /[\u00C4]/g, alternative: "A" }, { letter: /[\u00FC]/g, alternative: "u" }, { letter: /[\u00DC]/g, alternative: "U" }, { letter: /[\u0027]/g, alternative: "" }, { letter: /[\u00F1]/g, alternative: "n" }, { letter: /[\u00D1]/g, alternative: "N" }],
    // Language: English.
    // Sources: https://en.wikipedia.org/wiki/English_terms_with_diacritical_marks https://en.wikipedia.org/wiki/English_orthography
    en: [{ letter: /[\u00E6\u04D5]/g, alternative: "ae" }, { letter: /[\u00C6\u04D4]/g, alternative: "Ae" }, { letter: /[\u0153]/g, alternative: "oe" }, { letter: /[\u0152]/g, alternative: "Oe" }, { letter: /[\u00EB\u00E9]/g, alternative: "e" }, { letter: /[\u00C9\u00CB]/g, alternative: "E" }, { letter: /[\u00F4\u00F6]/g, alternative: "o" }, { letter: /[\u00D4\u00D6]/g, alternative: "O" }, { letter: /[\u00EF]/g, alternative: "i" }, { letter: /[\u00CF]/g, alternative: "I" }, { letter: /[\u00E7]/g, alternative: "c" }, { letter: /[\u00C7]/g, alternative: "C" }, { letter: /[\u00F1]/g, alternative: "n" }, { letter: /[\u00D1]/g, alternative: "N" }, { letter: /[\u00FC]/g, alternative: "u" }, { letter: /[\u00DC]/g, alternative: "U" }, { letter: /[\u00E4]/g, alternative: "a" }, { letter: /[\u00C4]/g, alternative: "A" }],
    // Language: French.
    // Sources: https://en.wikipedia.org/wiki/French_orthography#Ligatures https://en.wikipedia.org/wiki/French_orthography#Diacritics
    fr: [{ letter: /[\u00E6\u04D5]/g, alternative: "ae" }, { letter: /[\u00C6\u04D4]/g, alternative: "Ae" }, { letter: /[\u0153]/g, alternative: "oe" }, { letter: /[\u0152]/g, alternative: "Oe" }, { letter: /[\u00E9\u00E8\u00EB\u00EA]/g, alternative: "e" }, { letter: /[\u00C9\u00C8\u00CB\u00CA]/g, alternative: "E" }, { letter: /[\u00E0\u00E2]/g, alternative: "a" }, { letter: /[\u00C0\u00C2]/g, alternative: "A" }, { letter: /[\u00EF\u00EE]/g, alternative: "i" }, { letter: /[\u00CF\u00CE]/g, alternative: "I" }, { letter: /[\u00F9\u00FB\u00FC]/g, alternative: "u" }, { letter: /[\u00D9\u00DB\u00DC]/g, alternative: "U" }, { letter: /[\u00F4]/g, alternative: "o" }, { letter: /[\u00D4]/g, alternative: "O" }, { letter: /[\u00FF]/g, alternative: "y" }, { letter: /[\u0178]/g, alternative: "Y" }, { letter: /[\u00E7]/g, alternative: "c" }, { letter: /[\u00C7]/g, alternative: "C" }, { letter: /[\u00F1]/g, alternative: "n" }, { letter: /[\u00D1]/g, alternative: "N" }],
    // Language: Italian.
    // Source: https://en.wikipedia.org/wiki/Italian_orthography
    it: [{ letter: /[\u00E0]/g, alternative: "a" }, { letter: /[\u00C0]/g, alternative: "A" }, { letter: /[\u00E9\u00E8]/g, alternative: "e" }, { letter: /[\u00C9\u00C8]/g, alternative: "E" }, { letter: /[\u00EC\u00ED\u00EE]/g, alternative: "i" }, { letter: /[\u00CC\u00CD\u00CE]/g, alternative: "I" }, { letter: /[\u00F3\u00F2]/g, alternative: "o" }, { letter: /[\u00D3\u00D2]/g, alternative: "O" }, { letter: /[\u00F9\u00FA]/g, alternative: "u" }, { letter: /[\u00D9\u00DA]/g, alternative: "U" }],
    // Language: Dutch.
    // Sources: https://en.wikipedia.org/wiki/Dutch_orthography https://nl.wikipedia.org/wiki/Trema_in_de_Nederlandse_spelling
    nl: [{ letter: /[\u00E7]/g, alternative: "c" }, { letter: /[\u00C7]/g, alternative: "C" }, { letter: /[\u00F1]/g, alternative: "n" }, { letter: /[\u00D1]/g, alternative: "N" }, { letter: /[\u00E9\u00E8\u00EA\u00EB]/g, alternative: "e" }, { letter: /[\u00C9\u00C8\u00CA\u00CB]/g, alternative: "E" }, { letter: /[\u00F4\u00F6]/g, alternative: "o" }, { letter: /[\u00D4\u00D6]/g, alternative: "O" }, { letter: /[\u00EF]/g, alternative: "i" }, { letter: /[\u00CF]/g, alternative: "I" }, { letter: /[\u00FC]/g, alternative: "u" }, { letter: /[\u00DC]/g, alternative: "U" }, { letter: /[\u00E4]/g, alternative: "a" }, { letter: /[\u00C4]/g, alternative: "A" }],
    // Language: Bambara.
    // Sources: http://www.omniglot.com/writing/bambara.htm https://en.wikipedia.org/wiki/Bambara_language
    bm: [{ letter: /[\u025B]/g, alternative: "e" }, { letter: /[\u0190]/g, alternative: "E" }, { letter: /[\u0272]/g, alternative: "ny" }, { letter: /[\u019D]/g, alternative: "Ny" }, { letter: /[\u014B]/g, alternative: "ng" }, { letter: /[\u014A]/g, alternative: "Ng" }, { letter: /[\u0254]/g, alternative: "o" }, { letter: /[\u0186]/g, alternative: "O" }],
    // Language: Ukrainian.
    // Source: Resolution no. 55 of the Cabinet of Ministers of Ukraine, January 27, 2010 http://zakon2.rada.gov.ua/laws/show/55-2010-%D0%BF
    // ‘ь’ is the so-called soft sign, indicating a sound change (palatalization) of the preceding consonant. In text it is sometimes transliterated
    // to a character similar to an apostroph: ′. Omittance is recommended in slugs (https://en.wikipedia.org/wiki/Romanization_of_Ukrainian).
    uk: [{ letter: /[\u0431]/g, alternative: "b" }, { letter: /[\u0411]/g, alternative: "B" }, { letter: /[\u0432]/g, alternative: "v" }, { letter: /[\u0412]/g, alternative: "V" }, { letter: /[\u0433]/g, alternative: "h" }, { letter: /[\u0413]/g, alternative: "H" }, { letter: /[\u0491]/g, alternative: "g" }, { letter: /[\u0490]/g, alternative: "G" }, { letter: /[\u0434]/g, alternative: "d" }, { letter: /[\u0414]/g, alternative: "D" }, { letter: /[\u043A]/g, alternative: "k" }, { letter: /[\u041A]/g, alternative: "K" }, { letter: /[\u043B]/g, alternative: "l" }, { letter: /[\u041B]/g, alternative: "L" }, { letter: /[\u043C]/g, alternative: "m" }, { letter: /[\u041C]/g, alternative: "M" }, { letter: /[\u0070]/g, alternative: "r" }, { letter: /[\u0050]/g, alternative: "R" }, { letter: /[\u043F]/g, alternative: "p" }, { letter: /[\u041F]/g, alternative: "P" }, { letter: /[\u0441]/g, alternative: "s" }, { letter: /[\u0421]/g, alternative: "S" }, { letter: /[\u0442]/g, alternative: "t" }, { letter: /[\u0422]/g, alternative: "T" }, { letter: /[\u0443]/g, alternative: "u" }, { letter: /[\u0423]/g, alternative: "U" }, { letter: /[\u0444]/g, alternative: "f" }, { letter: /[\u0424]/g, alternative: "F" }, { letter: /[\u0445]/g, alternative: "kh" }, { letter: /[\u0425]/g, alternative: "Kh" }, { letter: /[\u0446]/g, alternative: "ts" }, { letter: /[\u0426]/g, alternative: "Ts" }, { letter: /[\u0447]/g, alternative: "ch" }, { letter: /[\u0427]/g, alternative: "Ch" }, { letter: /[\u0448]/g, alternative: "sh" }, { letter: /[\u0428]/g, alternative: "Sh" }, { letter: /[\u0449]/g, alternative: "shch" }, { letter: /[\u0429]/g, alternative: "Shch" }, { letter: /[\u044C\u042C]/g, alternative: "" }, { letter: /[\u0436]/g, alternative: "zh" }, { letter: /[\u0416]/g, alternative: "Zh" }, { letter: /[\u0437]/g, alternative: "z" }, { letter: /[\u0417]/g, alternative: "Z" }, { letter: /[\u0438]/g, alternative: "y" }, { letter: /[\u0418]/g, alternative: "Y" }, { letter: /^[\u0454]/g, alternative: "ye" }, { letter: /[\s][\u0454]/g, alternative: " ye" }, { letter: /[\u0454]/g, alternative: "ie" }, { letter: /^[\u0404]/g, alternative: "Ye" }, { letter: /[\s][\u0404]/g, alternative: " Ye" }, { letter: /[\u0404]/g, alternative: "IE" }, { letter: /^[\u0457]/g, alternative: "yi" }, { letter: /[\s][\u0457]/g, alternative: " yi" }, { letter: /[\u0457]/g, alternative: "i" }, { letter: /^[\u0407]/g, alternative: "Yi" }, { letter: /[\s][\u0407]/g, alternative: " Yi" }, { letter: /[\u0407]/g, alternative: "I" }, { letter: /^[\u0439]/g, alternative: "y" }, { letter: /[\s][\u0439]/g, alternative: " y" }, { letter: /[\u0439]/g, alternative: "i" }, { letter: /^[\u0419]/g, alternative: "Y" }, { letter: /[\s][\u0419]/g, alternative: " Y" }, { letter: /[\u0419]/g, alternative: "I" }, { letter: /^[\u044E]/g, alternative: "yu" }, { letter: /[\s][\u044E]/g, alternative: " yu" }, { letter: /[\u044E]/g, alternative: "iu" }, { letter: /^[\u042E]/g, alternative: "Yu" }, { letter: /[\s][\u042E]/g, alternative: " Yu" }, { letter: /[\u042E]/g, alternative: "IU" }, { letter: /^[\u044F]/g, alternative: "ya" }, { letter: /[\s][\u044F]/g, alternative: " ya" }, { letter: /[\u044F]/g, alternative: "ia" }, { letter: /^[\u042F]/g, alternative: "Ya" }, { letter: /[\s][\u042F]/g, alternative: " Ya" }, { letter: /[\u042F]/g, alternative: "IA" }],
    // Language: Breton
    // Source: http://www.omniglot.com/writing/breton.htm
    br: [{ letter: /\u0063\u0027\u0068/g, alternative: "ch" }, { letter: /\u0043\u0027\u0048/g, alternative: "CH" }, { letter: /[\u00e2]/g, alternative: "a" }, { letter: /[\u00c2]/g, alternative: "A" }, { letter: /[\u00ea]/g, alternative: "e" }, { letter: /[\u00ca]/g, alternative: "E" }, { letter: /[\u00ee]/g, alternative: "i" }, { letter: /[\u00ce]/g, alternative: "I" }, { letter: /[\u00f4]/g, alternative: "o" }, { letter: /[\u00d4]/g, alternative: "O" }, { letter: /[\u00fb\u00f9\u00fc]/g, alternative: "u" }, { letter: /[\u00db\u00d9\u00dc]/g, alternative: "U" }, { letter: /[\u00f1]/g, alternative: "n" }, { letter: /[\u00d1]/g, alternative: "N" }],
    // Language: Chamorro
    // Source: http://www.omniglot.com/writing/chamorro.htm
    ch: [{ letter: /[\u0027]/g, alternative: "" }, { letter: /[\u00e5]/g, alternative: "a" }, { letter: /[\u00c5]/g, alternative: "A" }, { letter: /[\u00f1]/g, alternative: "n" }, { letter: /[\u00d1]/g, alternative: "N" }],
    // Language: Corsican
    // Sources: http://www.omniglot.com/writing/corsican.htm https://en.wikipedia.org/wiki/Corsican_alphabet
    co: [{ letter: /[\u00e2\u00e0]/g, alternative: "a" }, { letter: /[\u00c2\u00c0]/g, alternative: "A" }, { letter: /[\u00e6\u04d5]/g, alternative: "ae" }, { letter: /[\u00c6\u04d4]/g, alternative: "Ae" }, { letter: /[\u00e7]/g, alternative: "c" }, { letter: /[\u00c7]/g, alternative: "C" }, { letter: /[\u00e9\u00ea\u00e8\u00eb]/g, alternative: "e" }, { letter: /[\u00c9\u00ca\u00c8\u00cb]/g, alternative: "E" }, { letter: /[\u00ec\u00ee\u00ef]/g, alternative: "i" }, { letter: /[\u00cc\u00ce\u00cf]/g, alternative: "I" }, { letter: /[\u00f1]/g, alternative: "n" }, { letter: /[\u00d1]/g, alternative: "N" }, { letter: /[\u00f4\u00f2]/g, alternative: "o" }, { letter: /[\u00d4\u00d2]/g, alternative: "O" }, { letter: /[\u0153]/g, alternative: "oe" }, { letter: /[\u0152]]/g, alternative: "Oe" }, { letter: /[\u00f9\u00fc]/g, alternative: "u" }, { letter: /[\u00d9\u00dc]/g, alternative: "U" }, { letter: /[\u00ff]/g, alternative: "y" }, { letter: /[\u0178]/g, alternative: "Y" }],
    // Language: Kashubian
    // Sources: http://www.omniglot.com/writing/kashubian.htm https://en.wikipedia.org/wiki/Kashubian_language
    csb: [{ letter: /[\u0105\u00e3]/g, alternative: "a" }, { letter: /[\u0104\u00c3]/g, alternative: "A" }, { letter: /[\u00e9\u00eb]/g, alternative: "e" }, { letter: /[\u00c9\u00cb]/g, alternative: "E" }, { letter: /[\u0142]/g, alternative: "l" }, { letter: /[\u0141]/g, alternative: "L" }, { letter: /[\u0144]/g, alternative: "n" }, { letter: /[\u0143]/g, alternative: "N" }, { letter: /[\u00f2\u00f3\u00f4]/g, alternative: "o" }, { letter: /[\u00d2\u00d3\u00d4]/g, alternative: "O" }, { letter: /[\u00f9]/g, alternative: "u" }, { letter: /[\u00d9]/g, alternative: "U" }, { letter: /[\u017c]/g, alternative: "z" }, { letter: /[\u017b]/g, alternative: "Z" }],
    // Language: Welsh
    // Sources: http://www.omniglot.com/writing/welsh.htm https://en.wikipedia.org/wiki/Welsh_orthography#Diacritics
    cy: [{ letter: /[\u00e2]/g, alternative: "a" }, { letter: /[\u00c2]/g, alternative: "A" }, { letter: /[\u00ea]/g, alternative: "e" }, { letter: /[\u00ca]/g, alternative: "E" }, { letter: /[\u00ee]/g, alternative: "i" }, { letter: /[\u00ce]/g, alternative: "I" }, { letter: /[\u00f4]/g, alternative: "o" }, { letter: /[\u00d4]/g, alternative: "O" }, { letter: /[\u00fb]/g, alternative: "u" }, { letter: /[\u00db]/g, alternative: "U" }, { letter: /[\u0175]/g, alternative: "w" }, { letter: /[\u0174]/g, alternative: "W" }, { letter: /[\u0177]/g, alternative: "y" }, { letter: /[\u0176]/g, alternative: "Y" }],
    // Language: Ewe
    // Sources: http://www.omniglot.com/writing/ewe.htm https://en.wikipedia.org/wiki/Ewe_language#Writing_system
    ee: [{ letter: /[\u0256]/g, alternative: "d" }, { letter: /[\u0189]/g, alternative: "D" }, { letter: /[\u025b]/g, alternative: "e" }, { letter: /[\u0190]/g, alternative: "E" }, { letter: /[\u0192]/g, alternative: "f" }, { letter: /[\u0191]/g, alternative: "F" }, { letter: /[\u0263]/g, alternative: "g" }, { letter: /[\u0194]/g, alternative: "G" }, { letter: /[\u014b]/g, alternative: "ng" }, { letter: /[\u014a]/g, alternative: "Ng" }, { letter: /[\u0254]/g, alternative: "o" }, { letter: /[\u0186]/g, alternative: "O" }, { letter: /[\u028b]/g, alternative: "w" }, { letter: /[\u01b2]/g, alternative: "W" }, { letter: /\u0061\u0303/g, alternative: "a" }, { letter: /[\u00e1\u00e0\u01ce\u00e2\u00e3]/g, alternative: "a" }, { letter: /\u0041\u0303/g, alternative: "A" }, { letter: /[\u00c1\u00c0\u01cd\u00c2\u00c3]/g, alternative: "A" }, { letter: /[\u00e9\u00e8\u011b\u00ea]/g, alternative: "e" }, { letter: /[\u00c9\u00c8\u011a\u00ca]/g, alternative: "E" }, { letter: /[\u00f3\u00f2\u01d2\u00f4]/g, alternative: "o" }, { letter: /[\u00d3\u00d2\u01d1\u00d4]/g, alternative: "O" }, { letter: /[\u00fa\u00f9\u01d4\u00fb]/g, alternative: "u" }, { letter: /[\u00da\u00d9\u01d3\u00db]/g, alternative: "U" }, { letter: /[\u00ed\u00ec\u01d0\u00ee]/g, alternative: "i" }, { letter: /[\u00cd\u00cc\u01cf\u00ce]/g, alternative: "I" }],
    // Language: Estonian
    // Sources: http://www.omniglot.com/writing/estonian.htm https://en.wikipedia.org/wiki/Estonian_orthography https://en.wikipedia.org/wiki/%C5%BD https://en.wikipedia.org/wiki/%C5%A0
    et: [{ letter: /[\u0161]/g, alternative: "sh" }, { letter: /[\u0160]/g, alternative: "Sh" }, { letter: /[\u017e]/g, alternative: "zh" }, { letter: /[\u017d]/g, alternative: "Zh" }, { letter: /[\u00f5\u00f6]/g, alternative: "o" }, { letter: /[\u00d6\u00d5]/g, alternative: "O" }, { letter: /[\u00e4]/g, alternative: "a" }, { letter: /[\u00c4]/g, alternative: "A" }, { letter: /[\u00fc]/g, alternative: "u" }, { letter: /[\u00dc]/g, alternative: "U" }],
    // Language: Basque
    // Sources: http://www.omniglot.com/writing/basque.htm https://en.wikipedia.org/wiki/Basque_language#Writing_system https://en	.wikipedia.org/wiki/Basque_alphabet
    eu: [{ letter: /[\u00f1]/g, alternative: "n" }, { letter: /[\u00d1]/g, alternative: "N" }, { letter: /[\u00e7]/g, alternative: "c" }, { letter: /[\u00c7]/g, alternative: "C" }, { letter: /[\u00fc]/g, alternative: "u" }, { letter: /[\u00dc]/g, alternative: "U" }],
    // Language: Fulah
    // Sources: http://www.omniglot.com/writing/fula.htm https://en.wikipedia.org/wiki/Fula_language#Writing_systems
    fuc: [{ letter: /[\u0253]/g, alternative: "b" }, { letter: /[\u0181]/g, alternative: "B" }, { letter: /[\u0257]/g, alternative: "d" }, { letter: /[\u018a]/g, alternative: "D" }, { letter: /[\u014b]/g, alternative: "ng" }, { letter: /[\u014a]/g, alternative: "Ng" }, { letter: /[\u0272\u00f1]/g, alternative: "ny" }, { letter: /[\u019d\u00d1]/g, alternative: "Ny" }, { letter: /[\u01b4]/g, alternative: "y" }, { letter: /[\u01b3]/g, alternative: "Y" }, { letter: /[\u0260]/g, alternative: "g" }, { letter: /[\u0193]/g, alternative: "G" }],
    // Language: Fijian
    // Source: http://www.omniglot.com/writing/fijian.htm
    fj: [{ letter: /[\u0101]/g, alternative: "a" }, { letter: /[\u0100]/g, alternative: "A" }, { letter: /[\u0113]/g, alternative: "e" }, { letter: /[\u0112]/g, alternative: "E" }, { letter: /[\u012b]/g, alternative: "i" }, { letter: /[\u012a]/g, alternative: "I" }, { letter: /[\u016b]/g, alternative: "u" }, { letter: /[\u016a]/g, alternative: "U" }, { letter: /[\u014d]/g, alternative: "o" }, { letter: /[\u014c]/g, alternative: "O" }],
    // Language: Arpitan (Franco-Provençal language)
    // Source: http://www.omniglot.com/writing/francoprovencal.htm
    frp: [{ letter: /[\u00e2]/g, alternative: "a" }, { letter: /[\u00c2]/g, alternative: "A" }, { letter: /[\u00ea\u00e8\u00e9]/g, alternative: "e" }, { letter: /[\u00ca\u00c8\u00c9]/g, alternative: "E" }, { letter: /[\u00ee]/g, alternative: "i" }, { letter: /[\u00ce]/g, alternative: "I" }, { letter: /[\u00fb\u00fc]/g, alternative: "u" }, { letter: /[\u00db\u00dc]/g, alternative: "U" }, { letter: /[\u00f4]/g, alternative: "o" }, { letter: /[\u00d4]/g, alternative: "O" }],
    // Language: Friulian
    // Sources: https://en.wikipedia.org/wiki/Friulian_language https://en.wikipedia.org/wiki/Faggin-Nazzi_alphabet
    // http://www.omniglot.com/writing/friulian.htm
    fur: [{ letter: /[\u00E7]/g, alternative: "c" }, { letter: /[\u00C7]/g, alternative: "C" }, { letter: /[\u00e0\u00e2]/g, alternative: "a" }, { letter: /[\u00c0\u00c2]/g, alternative: "A" }, { letter: /[\u00e8\u00ea]/g, alternative: "e" }, { letter: /[\u00c8\u00ca]/g, alternative: "E" }, { letter: /[\u00ec\u00ee]/g, alternative: "i" }, { letter: /[\u00cc\u00ce]/g, alternative: "I" }, { letter: /[\u00f2\u00f4]/g, alternative: "o" }, { letter: /[\u00d2\u00d4]/g, alternative: "O" }, { letter: /[\u00f9\u00fb]/g, alternative: "u" }, { letter: /[\u00d9\u00db]/g, alternative: "U" }, { letter: /[\u010d]/g, alternative: "c" }, { letter: /[\u010c]/g, alternative: "C" }, { letter: /[\u011f]/g, alternative: "g" }, { letter: /[\u011e]/g, alternative: "G" }, { letter: /[\u0161]/g, alternative: "s" }, { letter: /[\u0160]/g, alternative: "S" }],
    // Language: Frisian
    // Sources: https://en.wikipedia.org/wiki/West_Frisian_alphabet http://www.omniglot.com/writing/frisian.htm
    fy: [{ letter: /[\u00e2\u0101\u00e4\u00e5]/g, alternative: "a" }, { letter: /[\u00c2\u0100\u00c4\u00c5]/g, alternative: "A" }, { letter: /[\u00ea\u00e9\u0113]/g, alternative: "e" }, { letter: /[\u00ca\u00c9\u0112]/g, alternative: "E" }, { letter: /[\u00f4\u00f6]/g, alternative: "o" }, { letter: /[\u00d4\u00d6]/g, alternative: "O" }, { letter: /[\u00fa\u00fb\u00fc]/g, alternative: "u" }, { letter: /[\u00da\u00db\u00dc]/g, alternative: "U" }, { letter: /[\u00ed]/g, alternative: "i" }, { letter: /[\u00cd]/g, alternative: "I" }, { letter: /[\u0111\u00f0]/g, alternative: "d" }, { letter: /[\u0110\u00d0]/g, alternative: "D" }],
    // Language: Irish
    // Source: https://en.wikipedia.org/wiki/Irish_orthography
    ga: [{ letter: /[\u00e1]/g, alternative: "a" }, { letter: /[\u00c1]/g, alternative: "A" }, { letter: /[\u00e9]/g, alternative: "e" }, { letter: /[\u00c9]/g, alternative: "E" }, { letter: /[\u00f3]/g, alternative: "o" }, { letter: /[\u00d3]/g, alternative: "O" }, { letter: /[\u00fa]/g, alternative: "u" }, { letter: /[\u00da]/g, alternative: "U" }, { letter: /[\u00ed]/g, alternative: "i" }, { letter: /[\u00cd]/g, alternative: "I" }],
    // Language: Scottish Gaelic
    // Sources: https://en.wikipedia.org/wiki/Scottish_Gaelic_orthography http://www.omniglot.com/writing/gaelic.htm
    gd: [{ letter: /[\u00e0]/g, alternative: "a" }, { letter: /[\u00c0]/g, alternative: "A" }, { letter: /[\u00e8]/g, alternative: "e" }, { letter: /[\u00c8]/g, alternative: "E" }, { letter: /[\u00f2]/g, alternative: "o" }, { letter: /[\u00d2]/g, alternative: "O" }, { letter: /[\u00f9]/g, alternative: "u" }, { letter: /[\u00d9]/g, alternative: "U" }, { letter: /[\u00ec]/g, alternative: "i" }, { letter: /[\u00cc]/g, alternative: "I" }],
    // Language: Galician
    // Sources: https://en.wikipedia.org/wiki/Diacritic https://en.wikipedia.org/wiki/Galician_Alphabet
    gl: [{ letter: /[\u00e1\u00e0]/g, alternative: "a" }, { letter: /[\u00c1\u00c0]/g, alternative: "A" }, { letter: /[\u00e9\u00ea]/g, alternative: "e" }, { letter: /[\u00c9\u00ca]/g, alternative: "E" }, { letter: /[\u00ed\u00ef]/g, alternative: "i" }, { letter: /[\u00cd\u00cf]/g, alternative: "I" }, { letter: /[\u00f3]/g, alternative: "o" }, { letter: /[\u00d3]/g, alternative: "O" }, { letter: /[\u00fa\u00fc]/g, alternative: "u" }, { letter: /[\u00da\u00dc]/g, alternative: "U" }, { letter: /[\u00e7]/g, alternative: "c" }, { letter: /[\u00c7]/g, alternative: "C" }, { letter: /[\u00f1]/g, alternative: "n" }, { letter: /[\u00d1]/g, alternative: "N" }],
    // Language: Guarani
    // Sources: https://en.wikipedia.org/wiki/Guarani_alphabet http://www.omniglot.com/writing/guarani.htm
    gn: [{ letter: /[\u2019]/g, alternative: "" }, { letter: /\u0067\u0303/g, alternative: "g" }, { letter: /\u0047\u0303/g, alternative: "G" }, { letter: /[\u00e3]/g, alternative: "a" }, { letter: /[\u00c3]/g, alternative: "A" }, { letter: /[\u1ebd]/g, alternative: "e" }, { letter: /[\u1ebc]/g, alternative: "E" }, { letter: /[\u0129]/g, alternative: "i" }, { letter: /[\u0128]/g, alternative: "I" }, { letter: /[\u00f5]/g, alternative: "o" }, { letter: /[\u00d5]/g, alternative: "O" }, { letter: /[\u00f1]/g, alternative: "n" }, { letter: /[\u00d1]/g, alternative: "N" }, { letter: /[\u0169]/g, alternative: "u" }, { letter: /[\u0168]/g, alternative: "U" }, { letter: /[\u1ef9]/g, alternative: "y" }, { letter: /[\u1ef8]/g, alternative: "Y" }],
    // Language: Swiss German
    // Source: http://www.omniglot.com/writing/swissgerman.htm
    gsw: [{ letter: /[\u00e4]/g, alternative: "a" }, { letter: /[\u00c4]/g, alternative: "A" }, { letter: /[\u00f6]/g, alternative: "o" }, { letter: /[\u00d6]/g, alternative: "O" }, { letter: /[\u00fc]/g, alternative: "u" }, { letter: /[\u00dc]/g, alternative: "U" }],
    // Language: Haitian Creole
    // Sources: https://en.wikipedia.org/wiki/Haitian_Creole http://www.omniglot.com/writing/haitiancreole.htm
    hat: [{ letter: /[\u00e8]/g, alternative: "e" }, { letter: /[\u00c8]/g, alternative: "E" }, { letter: /[\u00f2]/g, alternative: "o" }, { letter: /[\u00d2]/g, alternative: "O" }],
    // Language: Hawaiian
    // Sources: https://en.wikipedia.org/wiki/Hawaiian_language#Macron http://www.omniglot.com/writing/hawaiian.htm
    haw: [{ letter: /[\u02bb\u0027\u2019]/g, alternative: "" }, { letter: /[\u0101]/g, alternative: "a" }, { letter: /[\u0113]/g, alternative: "e" }, { letter: /[\u012b]/g, alternative: "i" }, { letter: /[\u014d]/g, alternative: "o" }, { letter: /[\u016b]/g, alternative: "u" }, { letter: /[\u0100]/g, alternative: "A" }, { letter: /[\u0112]/g, alternative: "E" }, { letter: /[\u012a]/g, alternative: "I" }, { letter: /[\u014c]/g, alternative: "O" }, { letter: /[\u016a]/g, alternative: "U" }],
    // Language: Croatian
    // Sources: https://en.wikipedia.org/wiki/Gaj%27s_Latin_alphabet https://en.wikipedia.org/wiki/D_with_stroke
    // http://www.omniglot.com/writing/croatian.htm
    hr: [{ letter: /[\u010d\u0107]/g, alternative: "c" }, { letter: /[\u010c\u0106]/g, alternative: "C" }, { letter: /[\u0111]/g, alternative: "dj" }, { letter: /[\u0110]/g, alternative: "Dj" }, { letter: /[\u0161]/g, alternative: "s" }, { letter: /[\u0160]/g, alternative: "S" }, { letter: /[\u017e]/g, alternative: "z" }, { letter: /[\u017d]/g, alternative: "Z" }, { letter: /[\u01c4]/g, alternative: "DZ" }, { letter: /[\u01c5]/g, alternative: "Dz" }, { letter: /[\u01c6]/g, alternative: "dz" }],
    // Language: Georgian
    // The Georgian language does not use capital letters.
    // Sources: https://en.wikipedia.org/wiki/Romanization_of_Georgian (national system)
    ka: [{ letter: /[\u10d0]/g, alternative: "a" }, { letter: /[\u10d1]/g, alternative: "b" }, { letter: /[\u10d2]/g, alternative: "g" }, { letter: /[\u10d3]/g, alternative: "d" }, { letter: /[\u10d4]/g, alternative: "e" }, { letter: /[\u10d5]/g, alternative: "v" }, { letter: /[\u10d6]/g, alternative: "z" }, { letter: /[\u10d7]/g, alternative: "t" }, { letter: /[\u10d8]/g, alternative: "i" }, { letter: /[\u10d9]/g, alternative: "k" }, { letter: /[\u10da]/g, alternative: "l" }, { letter: /[\u10db]/g, alternative: "m" }, { letter: /[\u10dc]/g, alternative: "n" }, { letter: /[\u10dd]/g, alternative: "o" }, { letter: /[\u10de]/g, alternative: "p" }, { letter: /[\u10df]/g, alternative: "zh" }, { letter: /[\u10e0]/g, alternative: "r" }, { letter: /[\u10e1]/g, alternative: "s" }, { letter: /[\u10e2]/g, alternative: "t" }, { letter: /[\u10e3]/g, alternative: "u" }, { letter: /[\u10e4]/g, alternative: "p" }, { letter: /[\u10e5]/g, alternative: "k" }, { letter: /[\u10e6]/g, alternative: "gh" }, { letter: /[\u10e7]/g, alternative: "q" }, { letter: /[\u10e8]/g, alternative: "sh" }, { letter: /[\u10e9]/g, alternative: "ch" }, { letter: /[\u10ea]/g, alternative: "ts" }, { letter: /[\u10eb]/g, alternative: "dz" }, { letter: /[\u10ec]/g, alternative: "ts" }, { letter: /[\u10ed]/g, alternative: "ch" }, { letter: /[\u10ee]/g, alternative: "kh" }, { letter: /[\u10ef]/g, alternative: "j" }, { letter: /[\u10f0]/g, alternative: "h" }],
    // Language: Greenlandic.
    // Source: https://en.wikipedia.org/wiki/Greenlandic_language#Orthography
    kal: [{ letter: /[\u00E5]/g, alternative: "aa" }, { letter: /[\u00C5]/g, alternative: "Aa" }, { letter: /[\u00E6\u04D5]/g, alternative: "ae" }, { letter: /[\u00C6\u04D4]/g, alternative: "Ae" }, { letter: /[\u00C4]/g, alternative: "Ae" }, { letter: /[\u00F8]/g, alternative: "oe" }, { letter: /[\u00D8]/g, alternative: "Oe" }],
    // Language: Kinyarwanda.
    // Source: https://en.wikipedia.org/wiki/Kinyarwanda
    kin: [{ letter: /[\u2019\u0027]/g, alternative: "" }],
    // Language: Luxembourgish.
    // Source: http://www.omniglot.com/writing/luxembourgish.htm
    lb: [{ letter: /[\u00e4]/g, alternative: "a" }, { letter: /[\u00c4]/g, alternative: "A" }, { letter: /[\u00eb\u00e9]/g, alternative: "e" }, { letter: /[\u00cb\u00c9]/g, alternative: "E" }],
    // Language: Limburgish.
    // Source: http://www.omniglot.com/writing/limburgish.htm
    li: [{ letter: /[\u00e1\u00e2\u00e0\u00e4]/g, alternative: "a" }, { letter: /[\u00c1\u00c2\u00c0\u00c4]/g, alternative: "A" }, { letter: /[\u00eb\u00e8\u00ea]/g, alternative: "e" }, { letter: /[\u00cb\u00c8\u00ca]/g, alternative: "E" }, { letter: /[\u00f6\u00f3]/g, alternative: "o" }, { letter: /[\u00d6\u00d3]/g, alternative: "O" }],
    // Language: Lingala.
    // Sources: https://en.wikipedia.org/wiki/Lingala#Writing_system http://www.omniglot.com/writing/lingala.htm
    lin: [{ letter: /[\u00e1\u00e2\u01ce]/g, alternative: "a" }, { letter: /[\u00c1\u00c2\u01cd]/g, alternative: "A" }, { letter: /\u025b\u0301/g, alternative: "e" }, { letter: /\u025b\u0302/g, alternative: "e" }, { letter: /\u025b\u030c/g, alternative: "e" }, { letter: /[\u00e9\u00ea\u011b\u025b]/g, alternative: "e" }, { letter: /\u0190\u0301/g, alternative: "E" }, { letter: /\u0190\u0302/g, alternative: "E" }, { letter: /\u0190\u030c/g, alternative: "E" }, { letter: /[\u00c9\u00ca\u011a\u0190]/g, alternative: "E" }, { letter: /[\u00ed\u00ee\u01d0]/g, alternative: "i" }, { letter: /[\u00cd\u00ce\u01cf]/g, alternative: "I" }, { letter: /\u0254\u0301/g, alternative: "o" }, { letter: /\u0254\u0302/g, alternative: "o" }, { letter: /\u0254\u030c/g, alternative: "o" }, { letter: /[\u00f3\u00f4\u01d2\u0254]/g, alternative: "o" }, { letter: /\u0186\u0301/g, alternative: "O" }, { letter: /\u0186\u0302/g, alternative: "O" }, { letter: /\u0186\u030c/g, alternative: "O" }, { letter: /[\u00d3\u00d4\u01d1\u0186]/g, alternative: "O" }, { letter: /[\u00fa]/g, alternative: "u" }, { letter: /[\u00da]/g, alternative: "U" }],
    // Language: Lithuanian.
    // Sources: https://en.wikipedia.org/wiki/Lithuanian_orthography http://www.omniglot.com/writing/lithuanian.htm
    lt: [{ letter: /[\u0105]/g, alternative: "a" }, { letter: /[\u0104]/g, alternative: "A" }, { letter: /[\u010d]/g, alternative: "c" }, { letter: /[\u010c]/g, alternative: "C" }, { letter: /[\u0119\u0117]/g, alternative: "e" }, { letter: /[\u0118\u0116]/g, alternative: "E" }, { letter: /[\u012f]/g, alternative: "i" }, { letter: /[\u012e]/g, alternative: "I" }, { letter: /[\u0161]/g, alternative: "s" }, { letter: /[\u0160]/g, alternative: "S" }, { letter: /[\u0173\u016b]/g, alternative: "u" }, { letter: /[\u0172\u016a]/g, alternative: "U" }, { letter: /[\u017e]/g, alternative: "z" }, { letter: /[\u017d]/g, alternative: "Z" }],
    // Language: Malagasy.
    // Source: http://www.omniglot.com/writing/malagasy.htm
    mg: [{ letter: /[\u00f4]/g, alternative: "ao" }, { letter: /[\u00d4]/g, alternative: "Ao" }],
    // Language: Macedonian.
    // Source: http://www.omniglot.com/writing/macedonian.htm
    mk: [{ letter: /[\u0430]/g, alternative: "a" }, { letter: /[\u0410]/g, alternative: "A" }, { letter: /[\u0431]/g, alternative: "b" }, { letter: /[\u0411]/g, alternative: "B" }, { letter: /[\u0432]/g, alternative: "v" }, { letter: /[\u0412]/g, alternative: "V" }, { letter: /[\u0433]/g, alternative: "g" }, { letter: /[\u0413]/g, alternative: "G" }, { letter: /[\u0434]/g, alternative: "d" }, { letter: /[\u0414]/g, alternative: "D" }, { letter: /[\u0453]/g, alternative: "gj" }, { letter: /[\u0403]/g, alternative: "Gj" }, { letter: /[\u0435]/g, alternative: "e" }, { letter: /[\u0415]/g, alternative: "E" }, { letter: /[\u0436]/g, alternative: "zh" }, { letter: /[\u0416]/g, alternative: "Zh" }, { letter: /[\u0437]/g, alternative: "z" }, { letter: /[\u0417]/g, alternative: "Z" }, { letter: /[\u0455]/g, alternative: "dz" }, { letter: /[\u0405]/g, alternative: "Dz" }, { letter: /[\u0438]/g, alternative: "i" }, { letter: /[\u0418]/g, alternative: "I" }, { letter: /[\u0458]/g, alternative: "j" }, { letter: /[\u0408]/g, alternative: "J" }, { letter: /[\u043A]/g, alternative: "k" }, { letter: /[\u041A]/g, alternative: "K" }, { letter: /[\u043B]/g, alternative: "l" }, { letter: /[\u041B]/g, alternative: "L" }, { letter: /[\u0459]/g, alternative: "lj" }, { letter: /[\u0409]/g, alternative: "Lj" }, { letter: /[\u043C]/g, alternative: "m" }, { letter: /[\u041C]/g, alternative: "M" }, { letter: /[\u043D]/g, alternative: "n" }, { letter: /[\u041D]/g, alternative: "N" }, { letter: /[\u045A]/g, alternative: "nj" }, { letter: /[\u040A]/g, alternative: "Nj" }, { letter: /[\u043E]/g, alternative: "o" }, { letter: /[\u041E]/g, alternative: "O" }, { letter: /[\u0440]/g, alternative: "r" }, { letter: /[\u0420]/g, alternative: "R" }, { letter: /[\u043F]/g, alternative: "p" }, { letter: /[\u041F]/g, alternative: "P" }, { letter: /[\u0441]/g, alternative: "s" }, { letter: /[\u0421]/g, alternative: "S" }, { letter: /[\u0442]/g, alternative: "t" }, { letter: /[\u0422]/g, alternative: "T" }, { letter: /[\u045C]/g, alternative: "kj" }, { letter: /[\u040C]/g, alternative: "Kj" }, { letter: /[\u0443]/g, alternative: "u" }, { letter: /[\u0423]/g, alternative: "U" }, { letter: /[\u0444]/g, alternative: "f" }, { letter: /[\u0424]/g, alternative: "F" }, { letter: /[\u0445]/g, alternative: "h" }, { letter: /[\u0425]/g, alternative: "H" }, { letter: /[\u0446]/g, alternative: "c" }, { letter: /[\u0426]/g, alternative: "C" }, { letter: /[\u0447]/g, alternative: "ch" }, { letter: /[\u0427]/g, alternative: "Ch" }, { letter: /[\u045F]/g, alternative: "dj" }, { letter: /[\u040F]/g, alternative: "Dj" }, { letter: /[\u0448]/g, alternative: "sh" }, { letter: /[\u0428]/g, alternative: "Sh" }],
    // Language: Maori.
    // Source: http://www.omniglot.com/writing/maori.htm
    mri: [{ letter: /[\u0101]/g, alternative: "aa" }, { letter: /[\u0100]/g, alternative: "Aa" }, { letter: /[\u0113]/g, alternative: "ee" }, { letter: /[\u0112]/g, alternative: "Ee" }, { letter: /[\u012b]/g, alternative: "ii" }, { letter: /[\u012a]/g, alternative: "Ii" }, { letter: /[\u014d]/g, alternative: "oo" }, { letter: /[\u014c]/g, alternative: "Oo" }, { letter: /[\u016b]/g, alternative: "uu" }, { letter: /[\u016a]/g, alternative: "Uu" }],
    // Language: Mirandese.
    // Source: http://www.omniglot.com/writing/mirandese.htm
    mwl: [{ letter: /[\u00e7]/g, alternative: "c" }, { letter: /[\u00c7]/g, alternative: "C" }, { letter: /[\u00e1]/g, alternative: "a" }, { letter: /[\u00c1]/g, alternative: "A" }, { letter: /[\u00e9\u00ea]/g, alternative: "e" }, { letter: /[\u00c9\u00ca]/g, alternative: "E" }, { letter: /[\u00ed]/g, alternative: "i" }, { letter: /[\u00cd]/g, alternative: "I" }, { letter: /[\u00f3\u00f4]/g, alternative: "o" }, { letter: /[\u00d3\u00d4]/g, alternative: "O" }, { letter: /[\u00fa\u0169]/g, alternative: "u" }, { letter: /[\u00da\u0168]/g, alternative: "U" }],
    // Language: Occitan.
    // Sources: http://www.omniglot.com/writing/oromo.htm https://en.wikipedia.org/wiki/Occitan_alphabet
    oci: [{ letter: /[\u00e7]/g, alternative: "c" }, { letter: /[\u00c7]/g, alternative: "C" }, { letter: /[\u00e0\u00e1]/g, alternative: "a" }, { letter: /[\u00c0\u00c1]/g, alternative: "A" }, { letter: /[\u00e8\u00e9]/g, alternative: "e" }, { letter: /[\u00c8\u00c9]/g, alternative: "E" }, { letter: /[\u00ed\u00ef]/g, alternative: "i" }, { letter: /[\u00cd\u00cf]/g, alternative: "I" }, { letter: /[\u00f2\u00f3]/g, alternative: "o" }, { letter: /[\u00d2\u00d3]/g, alternative: "O" }, { letter: /[\u00fa\u00fc]/g, alternative: "u" }, { letter: /[\u00da\u00dc]/g, alternative: "U" }, { letter: /[\u00b7]/g, alternative: "" }],
    // Language: Oromo.
    // Source: http://www.omniglot.com/writing/occitan.htm
    orm: [{ letter: /[\u0027]/g, alternative: "" }],
    // Language: Portuguese.
    // Source: https://en.wikipedia.org/wiki/Portuguese_orthography http://www.omniglot.com/writing/portuguese.htm
    pt: [{ letter: /[\u00e7]/g, alternative: "c" }, { letter: /[\u00c7]/g, alternative: "C" }, { letter: /[\u00e1\u00e2\u00e3\u00e0]/g, alternative: "a" }, { letter: /[\u00c1\u00c2\u00c3\u00c0]/g, alternative: "A" }, { letter: /[\u00e9\u00ea]/g, alternative: "e" }, { letter: /[\u00c9\u00ca]/g, alternative: "E" }, { letter: /[\u00ed]/g, alternative: "i" }, { letter: /[\u00cd]/g, alternative: "I" }, { letter: /[\u00f3\u00f4\u00f5]/g, alternative: "o" }, { letter: /[\u00d3\u00d4\u00d5]/g, alternative: "O" }, { letter: /[\u00fa]/g, alternative: "u" }, { letter: /[\u00da]/g, alternative: "U" }],
    // Language: Romansh Vallader.
    // Source: https://en.wikipedia.org/wiki/Romansh_language#Orthography http://www.omniglot.com/writing/romansh.htm
    roh: [{ letter: /[\u00e9\u00e8\u00ea]/g, alternative: "e" }, { letter: /[\u00c9\u00c8\u00ca]/g, alternative: "E" }, { letter: /[\u00ef]/g, alternative: "i" }, { letter: /[\u00cf]/g, alternative: "I" }, { letter: /[\u00f6]/g, alternative: "oe" }, { letter: /[\u00d6]/g, alternative: "Oe" }, { letter: /[\u00fc]/g, alternative: "ue" }, { letter: /[\u00dc]/g, alternative: "Ue" }, { letter: /[\u00e4]/g, alternative: "ae" }, { letter: /[\u00c4]/g, alternative: "Ae" }],
    // Language: Aromanian.
    // Sources: https://en.wikipedia.org/wiki/Aromanian_alphabet http://www.omniglot.com/writing/aromanian.htm
    rup: [{ letter: /[\u00e3]/g, alternative: "a" }, { letter: /[\u00c3]/g, alternative: "A" }],
    // Language: Romanian.
    // Sources: http://forum.wordreference.com/threads/romanian-transliteration.3193544/#post-16161251
    // https://en.wikipedia.org/wiki/Romanian_alphabet http://www.omniglot.com/writing/romanian.htm
    ro: [{ letter: /[\u0103\u00e2]/g, alternative: "a" }, { letter: /[\u0102\u00c2]/g, alternative: "A" }, { letter: /[\u00ee]/g, alternative: "i" }, { letter: /[\u00ce]/g, alternative: "I" }, { letter: /[\u0219\u015f]/g, alternative: "s" }, { letter: /[\u0218\u015e]/g, alternative: "S" }, { letter: /[\u021b\u0163]/g, alternative: "t" }, { letter: /[\u021a\u0162]/g, alternative: "T" }],
    // Language: Klingon.
    // Sources: http://www.omniglot.com/conscripts/klingon.htm https://en.wikipedia.org/wiki/Klingon_language#Writing_systems
    // This translation module only works for Klingon written in Latin characters. KLI PlqaD script is not supported yet.
    tlh: [{ letter: /[\u2019\u0027]/g, alternative: "" }],
    // Language: Slovak.
    // Sources: https://en.wikipedia.org/wiki/Dz_(digraph) https://en.wikipedia.org/wiki/Slovak_orthography
    // http://www.omniglot.com/writing/slovak.htm
    sk: [{ letter: /[\u01c4]/g, alternative: "DZ" }, { letter: /[\u01c5]/g, alternative: "Dz" }, { letter: /[\u01c6]/g, alternative: "dz" }, { letter: /[\u00e1\u00e4]/g, alternative: "a" }, { letter: /[\u00c1\u00c4]/g, alternative: "A" }, { letter: /[\u010d]/g, alternative: "c" }, { letter: /[\u010c]/g, alternative: "C" }, { letter: /[\u010f]/g, alternative: "d" }, { letter: /[\u010e]/g, alternative: "D" }, { letter: /[\u00e9]/g, alternative: "e" }, { letter: /[\u00c9]/g, alternative: "E" }, { letter: /[\u00ed]/g, alternative: "i" }, { letter: /[\u00cd]/g, alternative: "I" }, { letter: /[\u013e\u013a]/g, alternative: "l" }, { letter: /[\u013d\u0139]/g, alternative: "L" }, { letter: /[\u0148]/g, alternative: "n" }, { letter: /[\u0147]/g, alternative: "N" }, { letter: /[\u00f3\u00f4]/g, alternative: "o" }, { letter: /[\u00d3\u00d4]/g, alternative: "O" }, { letter: /[\u0155]/g, alternative: "r" }, { letter: /[\u0154]/g, alternative: "R" }, { letter: /[\u0161]/g, alternative: "s" }, { letter: /[\u0160]/g, alternative: "S" }, { letter: /[\u0165]/g, alternative: "t" }, { letter: /[\u0164]/g, alternative: "T" }, { letter: /[\u00fa]/g, alternative: "u" }, { letter: /[\u00da]/g, alternative: "U" }, { letter: /[\u00fd]/g, alternative: "y" }, { letter: /[\u00dd]/g, alternative: "Y" }, { letter: /[\u017e]/g, alternative: "z" }, { letter: /[\u017d]/g, alternative: "Z" }],
    // Language: Slovenian.
    // Sources: https://en.wikipedia.org/wiki/Slovene_alphabet http://www.omniglot.com/writing/slovene.htm
    sl: [{ letter: /[\u010d\u0107]/g, alternative: "c" }, { letter: /[\u010c\u0106]/g, alternative: "C" }, { letter: /[\u0111]/g, alternative: "d" }, { letter: /[\u0110]/g, alternative: "D" }, { letter: /[\u0161]/g, alternative: "s" }, { letter: /[\u0160]/g, alternative: "S" }, { letter: /[\u017e]/g, alternative: "z" }, { letter: /[\u017d]/g, alternative: "Z" }, { letter: /[\u00e0\u00e1\u0203\u0201]/g, alternative: "a" }, { letter: /[\u00c0\u00c1\u0202\u0200]/g, alternative: "A" }, { letter: /[\u00e8\u00e9\u0207\u0205]/g, alternative: "e" }, { letter: /\u01dd\u0300/g, alternative: "e" }, { letter: /\u01dd\u030f/g, alternative: "e" }, { letter: /\u1eb9\u0301/g, alternative: "e" }, { letter: /\u1eb9\u0311/g, alternative: "e" }, { letter: /[\u00c8\u00c9\u0206\u0204]/g, alternative: "E" }, { letter: /\u018e\u030f/g, alternative: "E" }, { letter: /\u018e\u0300/g, alternative: "E" }, { letter: /\u1eb8\u0311/g, alternative: "E" }, { letter: /\u1eb8\u0301/g, alternative: "E" }, { letter: /[\u00ec\u00ed\u020b\u0209]/g, alternative: "i" }, { letter: /[\u00cc\u00cd\u020a\u0208]/g, alternative: "I" }, { letter: /[\u00f2\u00f3\u020f\u020d]/g, alternative: "o" }, { letter: /\u1ecd\u0311/g, alternative: "o" }, { letter: /\u1ecd\u0301/g, alternative: "o" }, { letter: /\u1ecc\u0311/g, alternative: "O" }, { letter: /\u1ecc\u0301/g, alternative: "O" }, { letter: /[\u00d2\u00d3\u020e\u020c]/g, alternative: "O" }, { letter: /[\u00f9\u00fa\u0217\u0215]/g, alternative: "u" }, { letter: /[\u00d9\u00da\u0216\u0214]/g, alternative: "U" }, { letter: /[\u0155\u0213]/g, alternative: "r" }, { letter: /[\u0154\u0212]/g, alternative: "R" }],
    // Language: Albanian.
    // Sources: https://en.wikipedia.org/wiki/Albanian_alphabet http://www.omniglot.com/writing/albanian.htm
    sq: [{ letter: /[\u00e7]/g, alternative: "c" }, { letter: /[\u00c7]/g, alternative: "C" }, { letter: /[\u00eb]/g, alternative: "e" }, { letter: /[\u00cb]/g, alternative: "E" }],
    // Language: Hungarian.
    // Sources: http://forum.wordreference.com/threads/hungarian-transliteration.3193022/#post-16166901
    // http://www.omniglot.com/writing/hungarian.htm
    hu: [{ letter: /[\u00e1]/g, alternative: "a" }, { letter: /[\u00c1]/g, alternative: "A" }, { letter: /[\u00e9]/g, alternative: "e" }, { letter: /[\u00c9]/g, alternative: "E" }, { letter: /[\u00ed]/g, alternative: "i" }, { letter: /[\u00cd]/g, alternative: "I" }, { letter: /[\u00f3\u00f6\u0151]/g, alternative: "o" }, { letter: /[\u00d3\u00d6\u0150]/g, alternative: "O" }, { letter: /[\u00fa\u00fc\u0171]/g, alternative: "u" }, { letter: /[\u00da\u00dc\u0170]/g, alternative: "U" }],
    // Language: Sardinian.
    // Sources: http://www.omniglot.com/writing/sardinian.htm https://en.wikipedia.org/wiki/Sardinian_language
    srd: [{ letter: /[\u00e7]/g, alternative: "c" }, { letter: /[\u00c7]/g, alternative: "C" }, { letter: /[\u00e0\u00e1]/g, alternative: "a" }, { letter: /[\u00c0\u00c1]/g, alternative: "A" }, { letter: /[\u00e8\u00e9]/g, alternative: "e" }, { letter: /[\u00c8\u00c9]/g, alternative: "E" }, { letter: /[\u00ed\u00ef]/g, alternative: "i" }, { letter: /[\u00cd\u00cf]/g, alternative: "I" }, { letter: /[\u00f2\u00f3]/g, alternative: "o" }, { letter: /[\u00d2\u00d3]/g, alternative: "O" }, { letter: /[\u00fa\u00f9]/g, alternative: "u" }, { letter: /[\u00da\u00d9]/g, alternative: "U" }],
    // Language: Silesian.
    // Source: https://en.wikipedia.org/wiki/Silesian_language#Writing_system
    szl: [{ letter: /[\u0107]/g, alternative: "c" }, { letter: /[\u0106]/g, alternative: "C" }, { letter: /[\u00e3]/g, alternative: "a" }, { letter: /[\u00c3]/g, alternative: "A" }, { letter: /[\u0142]/g, alternative: "u" }, { letter: /[\u0141]/g, alternative: "U" }, { letter: /[\u006e]/g, alternative: "n" }, { letter: /[\u004e]/g, alternative: "N" }, { letter: /[\u014f\u014d\u00f4\u00f5]/g, alternative: "o" }, { letter: /[\u014e\u014c\u00d4\u00d5]/g, alternative: "O" }, { letter: /[\u015b]/g, alternative: "s" }, { letter: /[\u015a]/g, alternative: "S" }, { letter: /[\u017a\u017c\u017e]/g, alternative: "z" }, { letter: /[\u0179\u017b\u017d]/g, alternative: "Z" }, { letter: /[\u016f]/g, alternative: "u" }, { letter: /[\u016e]/g, alternative: "U" }, { letter: /[\u010d]/g, alternative: "cz" }, { letter: /[\u010c]/g, alternative: "Cz" }, { letter: /[\u0159]/g, alternative: "rz" }, { letter: /[\u0158]/g, alternative: "Rz" }, { letter: /[\u0161]/g, alternative: "sz" }, { letter: /[\u0160]/g, alternative: "Sz" }],
    // Language: Tahitian.
    // Sources: https://en.wikipedia.org/wiki/Tahitian_language#Phonology http://www.omniglot.com/writing/tahitian.htm
    tah: [{ letter: /[\u0101\u00e2\u00e0]/g, alternative: "a" }, { letter: /[\u0100\u00c2\u00c0]/g, alternative: "A" }, { letter: /[\u00ef\u00ee\u00ec]/g, alternative: "i" }, { letter: /[\u00cf\u00ce\u00cc]/g, alternative: "I" }, { letter: /[\u0113\u00ea\u00e9]/g, alternative: "e" }, { letter: /[\u0112\u00ca\u00c9]/g, alternative: "E" }, { letter: /[\u016b\u00fb\u00fa]/g, alternative: "u" }, { letter: /[\u016a\u00db\u00da]/g, alternative: "U" }, { letter: /[\u00e7]/g, alternative: "c" }, { letter: /[\u00c7]/g, alternative: "C" }, { letter: /[\u00f2\u00f4\u014d]/g, alternative: "o" }, { letter: /[\u00d2\u00d4\u014c]/g, alternative: "O" }, { letter: /[\u2019\u0027\u2018]/g, alternative: "" }],
    // Language: Venetian.
    // Sources: http://www.omniglot.com/writing/venetian.htm https://en.wikipedia.org/wiki/Venetian_language#Spelling_systems
    // http://www.venipedia.org/wiki/index.php?title=Venetian_Language
    vec: [{ letter: /\u0073\u002d\u0063/g, alternative: "sc" }, { letter: /\u0053\u002d\u0043/g, alternative: "SC" }, { letter: /\u0073\u0027\u0063/g, alternative: "sc" }, { letter: /\u0053\u0027\u0043/g, alternative: "SC" }, { letter: /\u0073\u2019\u0063/g, alternative: "sc" }, { letter: /\u0053\u2019\u0043/g, alternative: "SC" }, { letter: /\u0073\u2018\u0063/g, alternative: "sc" }, { letter: /\u0053\u2018\u0043/g, alternative: "SC" }, { letter: /\u0053\u002d\u0063/g, alternative: "Sc" }, { letter: /\u0053\u0027\u0063/g, alternative: "Sc" }, { letter: /\u0053\u2019\u0063/g, alternative: "Sc" }, { letter: /\u0053\u2018\u0063/g, alternative: "Sc" }, { letter: /\u0063\u2019/g, alternative: "c" }, { letter: /\u0043\u2019/g, alternative: "C" }, { letter: /\u0063\u2018/g, alternative: "c" }, { letter: /\u0043\u2018/g, alternative: "C" }, { letter: /\u0063\u0027/g, alternative: "c" }, { letter: /\u0043\u0027/g, alternative: "C" }, { letter: /[\u00e0\u00e1\u00e2]/g, alternative: "a" }, { letter: /[\u00c0\u00c1\u00c2]/g, alternative: "A" }, { letter: /[\u00e8\u00e9]/g, alternative: "e" }, { letter: /[\u00c8\u00c9]/g, alternative: "E" }, { letter: /[\u00f2\u00f3]/g, alternative: "o" }, { letter: /[\u00d2\u00d3]/g, alternative: "O" }, { letter: /[\u00f9\u00fa]/g, alternative: "u" }, { letter: /[\u00d9\u00da]/g, alternative: "U" }, { letter: /[\u00e7\u010d\u010b]/g, alternative: "c" }, { letter: /[\u00c7\u010c\u010a]/g, alternative: "C" }, { letter: /[\u0142]/g, alternative: "l" }, { letter: /[\u00a3\u0141]/g, alternative: "L" }, { letter: /\ud835\udeff/g, alternative: "dh" }, { letter: /[\u0111\u03b4]/g, alternative: "dh" }, { letter: /[\u0110\u0394]/g, alternative: "Dh" }],
    // Language: Walloon.
    // Sources: http://www.omniglot.com/writing/walloon.htm https://en.wikipedia.org/wiki/Walloon_alphabet
    wa: [{ letter: /[\u00e2\u00e5]/g, alternative: "a" }, { letter: /[\u00c2\u00c5]/g, alternative: "A" }, { letter: /[\u00e7]/g, alternative: "c" }, { letter: /[\u00c7]/g, alternative: "C" }, { letter: /\u0065\u030a/g, alternative: "e" }, { letter: /\u0045\u030a/g, alternative: "E" }, { letter: /[\u00eb\u00ea\u00e8\u00e9]/g, alternative: "e" }, { letter: /[\u00c9\u00c8\u00ca\u00cb]/g, alternative: "E" }, { letter: /[\u00ee]/g, alternative: "i" }, { letter: /[\u00ce]/g, alternative: "I" }, { letter: /[\u00f4\u00f6]/g, alternative: "o" }, { letter: /[\u00d6\u00d4]/g, alternative: "O" }, { letter: /[\u00fb]/g, alternative: "u" }, { letter: /[\u00db]/g, alternative: "U" }],
    // Language: Yoruba.
    // Sources: http://www.omniglot.com/writing/yoruba.htm https://en.wikipedia.org/wiki/Yoruba_language
    yor: [{ letter: /[\u00e1\u00e0]/g, alternative: "a" }, { letter: /[\u00c1\u00c0]/g, alternative: "A" }, { letter: /[\u00ec\u00ed]/g, alternative: "i" }, { letter: /[\u00cc\u00cd]/g, alternative: "I" }, { letter: /\u1ecd\u0301/g, alternative: "o" }, { letter: /\u1ecc\u0301/g, alternative: "O" }, { letter: /\u1ecd\u0300/g, alternative: "o" }, { letter: /\u1ecc\u0300/g, alternative: "O" }, { letter: /[\u00f3\u00f2\u1ecd]/g, alternative: "o" }, { letter: /[\u00d3\u00d2\u1ecc]/g, alternative: "O" }, { letter: /[\u00fa\u00f9]/g, alternative: "u" }, { letter: /[\u00da\u00d9]/g, alternative: "U" }, { letter: /\u1eb9\u0301/g, alternative: "e" }, { letter: /\u1eb8\u0301/g, alternative: "E" }, { letter: /\u1eb9\u0300/g, alternative: "e" }, { letter: /\u1eb8\u0300/g, alternative: "E" }, { letter: /[\u00e9\u00e8\u1eb9]/g, alternative: "e" }, { letter: /[\u00c9\u00c8\u1eb8]/g, alternative: "E" }, { letter: /[\u1e63]/g, alternative: "s" }, { letter: /[\u1e62]/g, alternative: "S" }]
};
/**
 * The function returning an array containing transliteration objects, based on the given locale.
 *
 * @param {string} locale The locale.
 * @returns {Array} An array containing transliteration objects.
 */
module.exports = function (locale) {
    if (isUndefined(locale)) {
        return [];
    }
    switch (getLanguage(locale)) {
        case "es":
            return transliterations.es;
        case "pl":
            return transliterations.pl;
        case "de":
            return transliterations.de;
        case "nb":
        case "nn":
            return transliterations.nbnn;
        case "sv":
            return transliterations.sv;
        case "fi":
            return transliterations.fi;
        case "da":
            return transliterations.da;
        case "tr":
            return transliterations.tr;
        case "lv":
            return transliterations.lv;
        case "is":
            return transliterations.is;
        case "fa":
            return transliterations.fa;
        case "cs":
            return transliterations.cs;
        case "ru":
            return transliterations.ru;
        case "eo":
            return transliterations.eo;
        case "af":
            return transliterations.af;
        case "bal":
        case "ca":
            return transliterations.ca;
        case "ast":
            return transliterations.ast;
        case "an":
            return transliterations.an;
        case "ay":
            return transliterations.ay;
        case "en":
            return transliterations.en;
        case "fr":
            return transliterations.fr;
        case "it":
            return transliterations.it;
        case "nl":
            return transliterations.nl;
        case "bm":
            return transliterations.bm;
        case "uk":
            return transliterations.uk;
        case "br":
            return transliterations.br;
        case "ch":
            return transliterations.ch;
        case "csb":
            return transliterations.csb;
        case "cy":
            return transliterations.cy;
        case "ee":
            return transliterations.ee;
        case "et":
            return transliterations.et;
        case "eu":
            return transliterations.eu;
        case "fuc":
            return transliterations.fuc;
        case "fj":
            return transliterations.fj;
        case "frp":
            return transliterations.frp;
        case "fur":
            return transliterations.fur;
        case "fy":
            return transliterations.fy;
        case "ga":
            return transliterations.ga;
        case "gd":
            return transliterations.gd;
        case "gl":
            return transliterations.gl;
        case "gn":
            return transliterations.gn;
        case "gsw":
            return transliterations.gsw;
        case "hat":
            return transliterations.hat;
        case "haw":
            return transliterations.haw;
        case "hr":
            return transliterations.hr;
        case "ka":
            return transliterations.ka;
        case "kal":
            return transliterations.kal;
        case "kin":
            return transliterations.kin;
        case "lb":
            return transliterations.lb;
        case "li":
            return transliterations.li;
        case "lin":
            return transliterations.lin;
        case "lt":
            return transliterations.lt;
        case "mg":
            return transliterations.mg;
        case "mk":
            return transliterations.mk;
        case "mri":
            return transliterations.mri;
        case "mwl":
            return transliterations.mwl;
        case "oci":
            return transliterations.oci;
        case "orm":
            return transliterations.orm;
        case "pt":
            return transliterations.pt;
        case "roh":
            return transliterations.roh;
        case "rup":
            return transliterations.rup;
        case "ro":
            return transliterations.ro;
        case "tlh":
            return transliterations.tlh;
        case "sk":
            return transliterations.sk;
        case "sl":
            return transliterations.sl;
        case "sq":
            return transliterations.sq;
        case "hu":
            return transliterations.hu;
        case "srd":
            return transliterations.srd;
        case "szl":
            return transliterations.szl;
        case "tah":
            return transliterations.tah;
        case "vec":
            return transliterations.vec;
        case "wa":
            return transliterations.wa;
        case "yor":
            return transliterations.yor;
        default:
            return [];
    }
};



},{"../helpers/getLanguage.js":260,"lodash/isUndefined":192}],254:[function(require,module,exports){
"use strict";

module.exports = function () {
    return [
    // Whitespace is always a word boundary.
    " ", "\\n", "\\r", "\\t",
    // NO-BREAK SPACE.
    "\xA0", " ", ".", ",", "'", "(", ")", "\"", "+", "-", ";", "!", "?", ":", "/", "»", "«", "‹", "›", "<", ">"];
};



},{}],255:[function(require,module,exports){
"use strict";
/**
 * Throws an invalid type error
 * @param {string} message The message to show when the error is thrown
 * @returns {void}
 */

module.exports = function InvalidTypeError(message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
};
require("util").inherits(module.exports, Error);



},{"util":224}],256:[function(require,module,exports){
"use strict";

module.exports = function MissingArgumentError(message) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
};
require("util").inherits(module.exports, Error);



},{"util":224}],257:[function(require,module,exports){
"use strict";

var isUndefined = require("lodash/isUndefined");
/**
 * Shows and error trace of the error message in the console if the console is available.
 *
 * @param {string} [errorMessage=""] The error message.
 * @returns {void}
 */
function showTrace(errorMessage) {
    if (isUndefined(errorMessage)) {
        errorMessage = "";
    }
    if (!isUndefined(console) && !isUndefined(console.trace)) {
        console.trace(errorMessage);
    }
}
module.exports = {
    showTrace: showTrace
};



},{"lodash/isUndefined":192}],258:[function(require,module,exports){
"use strict";
/**
 * Returns rounded number to fix floating point bug http://floating-point-gui.de
 * @param {number} number The unrounded number
 * @returns {number} Rounded number
 */

module.exports = function (number) {
    if (Math.round(number) === number) {
        return Math.round(number);
    }
    return Math.round(number * 10) / 10;
};



},{}],259:[function(require,module,exports){
"use strict";

var firstWordExceptionsEnglish = require("../researches/english/firstWordExceptions.js");
var firstWordExceptionsGerman = require("../researches/german/firstWordExceptions.js");
var firstWordExceptionsSpanish = require("../researches/spanish/firstWordExceptions.js");
var firstWordExceptionsFrench = require("../researches/french/firstWordExceptions.js");
var firstWordExceptionsDutch = require("../researches/dutch/firstWordExceptions.js");
var firstWordExceptionsItalian = require("../researches/italian/firstWordExceptions.js");
var getLanguage = require("./getLanguage.js");
module.exports = function (locale) {
    switch (getLanguage(locale)) {
        case "de":
            return firstWordExceptionsGerman;
        case "fr":
            return firstWordExceptionsFrench;
        case "es":
            return firstWordExceptionsSpanish;
        case "nl":
            return firstWordExceptionsDutch;
        case "it":
            return firstWordExceptionsItalian;
        default:
        case "en":
            return firstWordExceptionsEnglish;
    }
};



},{"../researches/dutch/firstWordExceptions.js":275,"../researches/english/firstWordExceptions.js":282,"../researches/french/firstWordExceptions.js":297,"../researches/german/firstWordExceptions.js":304,"../researches/italian/firstWordExceptions.js":325,"../researches/spanish/firstWordExceptions.js":338,"./getLanguage.js":260}],260:[function(require,module,exports){
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



},{}],261:[function(require,module,exports){
"use strict";

var indexOf = require("lodash/indexOf");
var getLanguage = require("./getLanguage.js");
/**
 * Checks whether the language of the locale is available.
 *
 * @param {string} locale The locale to get the language from.
 * @param {array} languages The list of languages to match.
 * @returns {boolean} Returns true if the language is found in the array.
 */
module.exports = function (locale, languages) {
  var language = getLanguage(locale);
  return indexOf(languages, language) > -1;
};



},{"./getLanguage.js":260,"lodash/indexOf":174}],262:[function(require,module,exports){
"use strict";

var transitionWordsEnglish = require("../researches/english/transitionWords.js")().allWords;
var twoPartTransitionWordsEnglish = require("../researches/english/twoPartTransitionWords.js");
var transitionWordsGerman = require("../researches/german/transitionWords.js")().allWords;
var twoPartTransitionWordsGerman = require("../researches/german/twoPartTransitionWords.js");
var transitionWordsFrench = require("../researches/french/transitionWords.js")().allWords;
var twoPartTransitionWordsFrench = require("../researches/french/twoPartTransitionWords.js");
var transitionWordsSpanish = require("../researches/spanish/transitionWords.js")().allWords;
var twoPartTransitionWordsSpanish = require("../researches/spanish/twoPartTransitionWords.js");
var transitionWordsDutch = require("../researches/dutch/transitionWords.js")().allWords;
var twoPartTransitionWordsDutch = require("../researches/dutch/twoPartTransitionWords.js");
var transitionWordsItalian = require("../researches/italian/transitionWords.js")().allWords;
var twoPartTransitionWordsItalian = require("../researches/italian/twoPartTransitionWords.js");
var getLanguage = require("./getLanguage.js");
module.exports = function (locale) {
    switch (getLanguage(locale)) {
        case "de":
            return {
                transitionWords: transitionWordsGerman,
                twoPartTransitionWords: twoPartTransitionWordsGerman
            };
        case "es":
            return {
                transitionWords: transitionWordsSpanish,
                twoPartTransitionWords: twoPartTransitionWordsSpanish
            };
        case "fr":
            return {
                transitionWords: transitionWordsFrench,
                twoPartTransitionWords: twoPartTransitionWordsFrench
            };
        case "nl":
            return {
                transitionWords: transitionWordsDutch,
                twoPartTransitionWords: twoPartTransitionWordsDutch
            };
        case "it":
            return {
                transitionWords: transitionWordsItalian,
                twoPartTransitionWords: twoPartTransitionWordsItalian
            };
        default:
        case "en":
            return {
                transitionWords: transitionWordsEnglish,
                twoPartTransitionWords: twoPartTransitionWordsEnglish
            };
    }
};



},{"../researches/dutch/transitionWords.js":277,"../researches/dutch/twoPartTransitionWords.js":278,"../researches/english/transitionWords.js":292,"../researches/english/twoPartTransitionWords.js":293,"../researches/french/transitionWords.js":299,"../researches/french/twoPartTransitionWords.js":300,"../researches/german/transitionWords.js":313,"../researches/german/twoPartTransitionWords.js":314,"../researches/italian/transitionWords.js":327,"../researches/italian/twoPartTransitionWords.js":328,"../researches/spanish/transitionWords.js":340,"../researches/spanish/twoPartTransitionWords.js":341,"./getLanguage.js":260}],263:[function(require,module,exports){
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



},{"lodash/forEach":167,"lodash/memoize":196,"tokenizer2/core":219}],264:[function(require,module,exports){
"use strict";
/**
 * Checks if `n` is between `start` and `end` but not including `start`.
 *
 * @param {number} number The number to check.
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */

function inRangeEndInclusive(number, start, end) {
    return number > start && number <= end;
}
/**
 * Checks if `n` is between `start` and up to, but not including, `end`.
 *
 * @param {number} number The number to check.
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
function inRangeStartInclusive(number, start, end) {
    return number >= start && number < end;
}
/**
 * Checks if `n` is between `start` and `end`, including both.
 *
 * @param {number} number The number to check.
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
function inRangeStartEndInclusive(number, start, end) {
    return number >= start && number <= end;
}
module.exports = {
    inRange: inRangeEndInclusive,
    inRangeStartInclusive: inRangeStartInclusive,
    inRangeEndInclusive: inRangeEndInclusive,
    inRangeStartEndInclusive: inRangeStartEndInclusive
};



},{}],265:[function(require,module,exports){
"use strict";

var SyllableCountStep = require("./syllableCountStep.js");
var isUndefined = require("lodash/isUndefined");
var forEach = require("lodash/forEach");
/**
 * Creates a syllable count iterator.
 *
 * @param {object} config The config object containing an array with syllable exclusions.
 * @constructor
 */
var SyllableCountIterator = function SyllableCountIterator(config) {
    this.countSteps = [];
    if (!isUndefined(config)) {
        this.createSyllableCountSteps(config.deviations.vowels);
    }
};
/**
 * Creates a syllable count step object for each exclusion.
 *
 * @param {object} syllableCounts The object containing all exclusion syllables including the multipliers.
 * @returns {void}
 */
SyllableCountIterator.prototype.createSyllableCountSteps = function (syllableCounts) {
    forEach(syllableCounts, function (syllableCountStep) {
        this.countSteps.push(new SyllableCountStep(syllableCountStep));
    }.bind(this));
};
/**
 * Returns all available count steps.
 *
 * @returns {Array} All available count steps.
 */
SyllableCountIterator.prototype.getAvailableSyllableCountSteps = function () {
    return this.countSteps;
};
/**
 * Counts the syllables for all the steps and returns the total syllable count.
 *
 * @param {String} word The word to count syllables in.
 * @returns {number} The number of syllables found based on exclusions.
 */
SyllableCountIterator.prototype.countSyllables = function (word) {
    var syllableCount = 0;
    forEach(this.countSteps, function (step) {
        syllableCount += step.countSyllables(word);
    });
    return syllableCount;
};
module.exports = SyllableCountIterator;



},{"./syllableCountStep.js":266,"lodash/forEach":167,"lodash/isUndefined":192}],266:[function(require,module,exports){
"use strict";

var isUndefined = require("lodash/isUndefined");
var arrayToRegex = require("../stringProcessing/createRegexFromArray.js");
/**
 * Constructs a language syllable regex that contains a regex for matching syllable exclusion.
 *
 * @param {object} syllableRegex The object containing the syllable exclusions.
 * @constructor
 */
var SyllableCountStep = function SyllableCountStep(syllableRegex) {
    this._hasRegex = false;
    this._regex = "";
    this._multiplier = "";
    this.createRegex(syllableRegex);
};
/**
 * Returns if a valid regex has been set.
 *
 * @returns {boolean} True if a regex has been set, false if not.
 */
SyllableCountStep.prototype.hasRegex = function () {
    return this._hasRegex;
};
/**
 * Creates a regex based on the given syllable exclusions, and sets the multiplier to use.
 *
 * @param {object} syllableRegex The object containing the syllable exclusions and multiplier.
 * @returns {void}
 */
SyllableCountStep.prototype.createRegex = function (syllableRegex) {
    if (!isUndefined(syllableRegex) && !isUndefined(syllableRegex.fragments)) {
        this._hasRegex = true;
        this._regex = arrayToRegex(syllableRegex.fragments, true);
        this._multiplier = syllableRegex.countModifier;
    }
};
/**
 * Returns the stored regular expression.
 *
 * @returns {RegExp} The stored regular expression.
 */
SyllableCountStep.prototype.getRegex = function () {
    return this._regex;
};
/**
 * Matches syllable exclusions in a given word and the returns the number found multiplied with the
 * given multiplier.
 *
 * @param {String} word The word to match for syllable exclusions.
 * @returns {number} The amount of syllables found.
 */
SyllableCountStep.prototype.countSyllables = function (word) {
    if (this._hasRegex) {
        var match = word.match(this._regex) || [];
        return match.length * this._multiplier;
    }
    return 0;
};
module.exports = SyllableCountStep;



},{"../stringProcessing/createRegexFromArray.js":352,"lodash/isUndefined":192}],267:[function(require,module,exports){
"use strict";
/**
 * Gets the parsed type name of subjects.
 *
 * @param {array|object|string|number} subject The subject to get the parsed type from.
 * @returns {string} The parsed type name.
 */

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

var getType = function getType(subject) {
    if (Array.isArray(subject)) {
        return "array";
    }
    return typeof subject === "undefined" ? "undefined" : _typeof(subject);
};
/**
 * Validates the type of subjects. Throws an error if the type is invalid.
 *
 * @param {object} subject The object containing all subjects.
 * @param {string} expectedType The expected type.
 * @returns {boolean} Returns true if types matches expected type. Otherwise returns false.
 */
var isSameType = function isSameType(subject, expectedType) {
    var passedType = getType(subject);
    return passedType === expectedType;
};
module.exports = {
    getType: getType,
    isSameType: isSameType
};



},{}],268:[function(require,module,exports){
"use strict";
/**
 * Marks a text with HTML tags
 *
 * @param {string} text The unmarked text.
 * @returns {string} The marked text.
 */

module.exports = function (text) {
  return "<yoastmark class='yoast-text-mark'>" + text + "</yoastmark>";
};



},{}],269:[function(require,module,exports){
"use strict";

var uniqBy = require("lodash/uniqBy");
/**
 * Removes duplicate marks from an array
 *
 * @param {Array} marks The marks to remove duplications from
 * @returns {Array} A list of de-duplicated marks.
 */
function removeDuplicateMarks(marks) {
    return uniqBy(marks, function (mark) {
        return mark.getOriginal();
    });
}
module.exports = removeDuplicateMarks;



},{"lodash/uniqBy":212}],270:[function(require,module,exports){
"use strict";

var _sentences = require("./researches/sentences");

var _sentences2 = _interopRequireDefault(_sentences);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var merge = require("lodash/merge");
var InvalidTypeError = require("./errors/invalidType");
var MissingArgument = require("./errors/missingArgument");
var isUndefined = require("lodash/isUndefined");
var isEmpty = require("lodash/isEmpty");
// Researches
var wordCountInText = require("./researches/wordCountInText.js");
var getLinkStatistics = require("./researches/getLinkStatistics.js");
var linkCount = require("./researches/countLinks.js");
var getLinks = require("./researches/getLinks.js");
var urlLength = require("./researches/urlIsTooLong.js");
var findKeywordInPageTitle = require("./researches/findKeywordInPageTitle.js");
var matchKeywordInSubheadings = require("./researches/matchKeywordInSubheadings.js");
var getKeywordDensity = require("./researches/getKeywordDensity.js");
var stopWordsInKeyword = require("./researches/stopWordsInKeyword");
var stopWordsInUrl = require("./researches/stopWordsInUrl");
var calculateFleschReading = require("./researches/calculateFleschReading.js");
var metaDescriptionLength = require("./researches/metaDescriptionLength.js");
var imageCount = require("./researches/imageCountInText.js");
var altTagCount = require("./researches/imageAltTags.js");
var keyphraseLength = require("./researches/keyphraseLength");
var metaDescriptionKeyword = require("./researches/metaDescriptionKeyword.js");
var keywordCountInUrl = require("./researches/keywordCountInUrl");
var findKeywordInFirstParagraph = require("./researches/findKeywordInFirstParagraph.js");
var pageTitleWidth = require("./researches/pageTitleWidth.js");
var wordComplexity = require("./researches/getWordComplexity.js");
var getParagraphLength = require("./researches/getParagraphLength.js");
var countSentencesFromText = require("./researches/countSentencesFromText.js");
var countSentencesFromDescription = require("./researches/countSentencesFromDescription.js");
var getSubheadingTextLengths = require("./researches/getSubheadingTextLengths.js");
var findTransitionWords = require("./researches/findTransitionWords.js");
var passiveVoice = require("./researches/getPassiveVoice.js");
var getSentenceBeginnings = require("./researches/getSentenceBeginnings.js");
var relevantWords = require("./researches/relevantWords");
/**
 * This contains all possible, default researches.
 * @param {Paper} paper The Paper object that is needed within the researches.
 * @constructor
 * @throws {InvalidTypeError} Parameter needs to be an instance of the Paper object.
 */
var Researcher = function Researcher(paper) {
    this.setPaper(paper);
    this.defaultResearches = {
        urlLength: urlLength,
        wordCountInText: wordCountInText,
        findKeywordInPageTitle: findKeywordInPageTitle,
        calculateFleschReading: calculateFleschReading,
        getLinkStatistics: getLinkStatistics,
        getLinks: getLinks,
        linkCount: linkCount,
        imageCount: imageCount,
        altTagCount: altTagCount,
        matchKeywordInSubheadings: matchKeywordInSubheadings,
        getKeywordDensity: getKeywordDensity,
        stopWordsInKeyword: stopWordsInKeyword,
        stopWordsInUrl: stopWordsInUrl,
        metaDescriptionLength: metaDescriptionLength,
        keyphraseLength: keyphraseLength,
        keywordCountInUrl: keywordCountInUrl,
        firstParagraph: findKeywordInFirstParagraph,
        metaDescriptionKeyword: metaDescriptionKeyword,
        pageTitleWidth: pageTitleWidth,
        wordComplexity: wordComplexity,
        getParagraphLength: getParagraphLength,
        countSentencesFromText: countSentencesFromText,
        countSentencesFromDescription: countSentencesFromDescription,
        getSubheadingTextLengths: getSubheadingTextLengths,
        findTransitionWords: findTransitionWords,
        passiveVoice: passiveVoice,
        getSentenceBeginnings: getSentenceBeginnings,
        relevantWords: relevantWords,
        sentences: _sentences2.default
    };
    this.customResearches = {};
};
/**
 * Set the Paper associated with the Researcher.
 * @param {Paper} paper The Paper to use within the Researcher
 * @throws {InvalidTypeError} Parameter needs to be an instance of the Paper object.
 * @returns {void}
 */
Researcher.prototype.setPaper = function (paper) {
    this.paper = paper;
};
/**
 * Add a custom research that will be available within the Researcher.
 * @param {string} name A name to reference the research by.
 * @param {function} research The function to be added to the Researcher.
 * @throws {MissingArgument} Research name cannot be empty.
 * @throws {InvalidTypeError} The research requires a valid Function callback.
 * @returns {void}
 */
Researcher.prototype.addResearch = function (name, research) {
    if (isUndefined(name) || isEmpty(name)) {
        throw new MissingArgument("Research name cannot be empty");
    }
    if (!(research instanceof Function)) {
        throw new InvalidTypeError("The research requires a Function callback.");
    }
    this.customResearches[name] = research;
};
/**
 * Check wheter or not the research is known by the Researcher.
 * @param {string} name The name to reference the research by.
 * @returns {boolean} Whether or not the research is known by the Researcher
 */
Researcher.prototype.hasResearch = function (name) {
    return Object.keys(this.getAvailableResearches()).filter(function (research) {
        return research === name;
    }).length > 0;
};
/**
 * Return all available researches.
 * @returns {Object} An object containing all available researches.
 */
Researcher.prototype.getAvailableResearches = function () {
    return merge(this.defaultResearches, this.customResearches);
};
/**
 * Return the Research by name.
 * @param {string} name The name to reference the research by.
 * @returns {*} Returns the result of the research or false if research does not exist.
 * @throws {MissingArgument} Research name cannot be empty.
 */
Researcher.prototype.getResearch = function (name) {
    if (isUndefined(name) || isEmpty(name)) {
        throw new MissingArgument("Research name cannot be empty");
    }
    if (!this.hasResearch(name)) {
        return false;
    }
    return this.getAvailableResearches()[name](this.paper, this);
};
module.exports = Researcher;



},{"./errors/invalidType":255,"./errors/missingArgument":256,"./researches/calculateFleschReading.js":271,"./researches/countLinks.js":272,"./researches/countSentencesFromDescription.js":273,"./researches/countSentencesFromText.js":274,"./researches/findKeywordInFirstParagraph.js":294,"./researches/findKeywordInPageTitle.js":295,"./researches/findTransitionWords.js":296,"./researches/getKeywordDensity.js":315,"./researches/getLinkStatistics.js":316,"./researches/getLinks.js":317,"./researches/getParagraphLength.js":318,"./researches/getPassiveVoice.js":319,"./researches/getSentenceBeginnings.js":320,"./researches/getSubheadingTextLengths.js":321,"./researches/getWordComplexity.js":322,"./researches/imageAltTags.js":323,"./researches/imageCountInText.js":324,"./researches/keyphraseLength":329,"./researches/keywordCountInUrl":330,"./researches/matchKeywordInSubheadings.js":331,"./researches/metaDescriptionKeyword.js":332,"./researches/metaDescriptionLength.js":333,"./researches/pageTitleWidth.js":334,"./researches/relevantWords":336,"./researches/sentences":337,"./researches/stopWordsInKeyword":342,"./researches/stopWordsInUrl":344,"./researches/urlIsTooLong.js":345,"./researches/wordCountInText.js":346,"lodash/isEmpty":181,"lodash/isUndefined":192,"lodash/merge":197}],271:[function(require,module,exports){
"use strict";
/** @module analyses/calculateFleschReading */

var stripNumbers = require("../stringProcessing/stripNumbers.js");
var countSentences = require("../stringProcessing/countSentences.js");
var countWords = require("../stringProcessing/countWords.js");
var countSyllables = require("../stringProcessing/syllables/count.js");
var formatNumber = require("../helpers/formatNumber.js");
var getLanguage = require("../helpers/getLanguage.js");
/**
 * Calculates an average from a total and an amount
 *
 * @param {number} total The total.
 * @param {number} amount The amount.
 * @returns {number} The average from the total and the amount.
 */
var getAverage = function getAverage(total, amount) {
    return total / amount;
};
/**
 * This calculates the flesch reading score for a given text.
 *
 * @param {object} paper The paper containing the text
 * @returns {number} The score of the flesch reading test
 */
module.exports = function (paper) {
    var score = void 0;
    var text = paper.getText();
    var locale = paper.getLocale();
    var language = getLanguage(locale);
    if (text === "") {
        return 0;
    }
    text = stripNumbers(text);
    var numberOfSentences = countSentences(text);
    var numberOfWords = countWords(text);
    // Prevent division by zero errors.
    if (numberOfSentences === 0 || numberOfWords === 0) {
        return 0;
    }
    var numberOfSyllables = countSyllables(text, locale);
    var averageWordsPerSentence = getAverage(numberOfWords, numberOfSentences);
    var syllablesPer100Words = numberOfSyllables * (100 / numberOfWords);
    switch (language) {
        case "nl":
            score = 206.84 - 0.77 * syllablesPer100Words - 0.93 * averageWordsPerSentence;
            break;
        case "de":
            score = 180 - averageWordsPerSentence - 58.5 * numberOfSyllables / numberOfWords;
            break;
        case "it":
            score = 217 - 1.3 * averageWordsPerSentence - 0.6 * syllablesPer100Words;
            break;
        case "en":
        default:
            score = 206.835 - 1.015 * averageWordsPerSentence - 84.6 * (numberOfSyllables / numberOfWords);
            break;
    }
    return formatNumber(score);
};



},{"../helpers/formatNumber.js":258,"../helpers/getLanguage.js":260,"../stringProcessing/countSentences.js":350,"../stringProcessing/countWords.js":351,"../stringProcessing/stripNumbers.js":379,"../stringProcessing/syllables/count.js":383}],272:[function(require,module,exports){
"use strict";
/** @module analyses/getLinkStatistics */

var getLinks = require("./getLinks");
/**
 * Checks a text for anchors and returns the number found.
 *
 * @param {object} paper The paper object containing text, keyword and url.
 * @returns {number} The number of links found in the text.
 */
module.exports = function (paper) {
  var anchors = getLinks(paper);
  return anchors.length;
};



},{"./getLinks":317}],273:[function(require,module,exports){
"use strict";

var getSentences = require("../stringProcessing/getSentences");
var sentencesLength = require("./../stringProcessing/sentencesLength.js");
/**
 * Counts sentences in the description..
 * @param {Paper} paper The Paper object to get description from.
 * @returns {Array} The sentences from the text.
 */
module.exports = function (paper) {
  var sentences = getSentences(paper.getDescription());
  return sentencesLength(sentences);
};



},{"../stringProcessing/getSentences":359,"./../stringProcessing/sentencesLength.js":376}],274:[function(require,module,exports){
"use strict";

var getSentences = require("../stringProcessing/getSentences");
var sentencesLength = require("./../stringProcessing/sentencesLength.js");
/**
 * Count sentences in the text.
 * @param {Paper} paper The Paper object to get text from.
 * @returns {Array} The sentences from the text.
 */
module.exports = function (paper) {
  var sentences = getSentences(paper.getText());
  return sentencesLength(sentences);
};



},{"../stringProcessing/getSentences":359,"./../stringProcessing/sentencesLength.js":376}],275:[function(require,module,exports){
"use strict";
/**
 * Returns an array with exceptions for the sentence beginning researcher.
 * @returns {Array} The array filled with exceptions.
 */

module.exports = function () {
    return [
    // Definite articles:
    "de", "het",
    // Indefinite articles:
    "een",
    // Numbers 1-10:
    "één", "eén", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien",
    // Demonstrative pronouns:
    "dit", "dat", "die", "deze"];
};



},{}],276:[function(require,module,exports){
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



},{"./transitionWords.js":277}],277:[function(require,module,exports){
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



},{}],278:[function(require,module,exports){
"use strict";
/**
 * Returns an array with two-part transition words to be used by the assessments.
 * @returns {Array} The array filled with two-part transition words.
 */

module.exports = function () {
  return [["aan de ene kant", "aan de andere kant"], ["enerzijds", "anderzijds"], ["natuurlijk", "maar"], ["niet alleen", "maar ook"], ["noch", "noch"], ["zowel", "als"]];
};



},{}],279:[function(require,module,exports){
"use strict";

var Participle = require("../../values/Participle.js");
var nonVerbsEndingEd = require("./passivevoice/non-verb-ending-ed.js")();
var getWordIndices = require("./passivevoice/getIndicesWithRegex.js");
var arrayToRegex = require("../../stringProcessing/createRegexFromArray.js");
var cannotDirectlyPrecedePassiveParticiple = require("./functionWords.js")().cannotDirectlyPrecedePassiveParticiple;
var cannotBeBetweenAuxiliaryAndParticiple = require("./functionWords.js")().cannotBeBetweenPassiveAuxiliaryAndParticiple;
var forEach = require("lodash/forEach");
var includes = require("lodash/includes");
var isEmpty = require("lodash/isEmpty");
var intersection = require("lodash/intersection");
var directPrecedenceExceptionRegex = arrayToRegex(cannotDirectlyPrecedePassiveParticiple);
var precedenceExceptionRegex = arrayToRegex(cannotBeBetweenAuxiliaryAndParticiple);
var irregularExclusionArray = ["get", "gets", "getting", "got", "gotten"];
/**
 * Checks whether a participle is directly preceded by a given word.
 *
 * @param {Array} precedingWords The array of objects with matches and indices.
 * @param {number} participleIndex The index of the participle.
 *
 * @returns {boolean} Returns true if the participle is preceded by a given word, otherwise returns false.
 */
var includesIndex = function includesIndex(precedingWords, participleIndex) {
    if (isEmpty(precedingWords)) {
        return false;
    }
    var precedingWordsEndIndices = [];
    forEach(precedingWords, function (precedingWord) {
        // + 1 because the end word boundary is not included in the match.
        var precedingWordsEndIndex = precedingWord.index + precedingWord.match.length + 1;
        precedingWordsEndIndices.push(precedingWordsEndIndex);
    });
    return includes(precedingWordsEndIndices, participleIndex);
};
/**
 * Checks whether a given word precedes a participle directly or indirectly.
 *
 * @param {Array} precedingWords The array of objects with matches and indices.
 * @param {number} participleIndex The index of the participle.
 *
 * @returns {boolean} Returns true if the participle is preceded by a given word, otherwise returns false.
 */
var precedesIndex = function precedesIndex(precedingWords, participleIndex) {
    if (isEmpty(precedingWords)) {
        return false;
    }
    var precedingWordsIndices = [];
    forEach(precedingWords, function (precedingWord) {
        var precedingWordsIndex = precedingWord.index;
        precedingWordsIndices.push(precedingWordsIndex);
    });
    var matches = [];
    forEach(precedingWordsIndices, function (precedingWordsIndex) {
        // + 1 because the beginning word boundary is not included in the passive participle match
        if (precedingWordsIndex + 1 < participleIndex) {
            matches.push(precedingWordsIndex);
        }
    });
    if (matches.length) {
        return true;
    }
    return false;
};
/**
 * Creates an Participle object for the English language.
 *
 * @param {string} participle The participle.
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {object} attributes  The attributes object.
 *
 * @constructor
 */
var EnglishParticiple = function EnglishParticiple(participle, sentencePart, attributes) {
    Participle.call(this, participle, sentencePart, attributes);
    this.checkException();
};
require("util").inherits(EnglishParticiple, Participle);
/**
 * Sets sentence part passiveness to passive if there is no exception.
 *
 * @returns {void}
 */
EnglishParticiple.prototype.checkException = function () {
    if (isEmpty(this.getParticiple())) {
        this.setSentencePartPassiveness(false);
        return;
    }
    this.setSentencePartPassiveness(this.isPassive());
};
/**
 * Checks if any exceptions are applicable to this participle that would result in the sentence part not being passive.
 * If no exceptions are found, the sentence part is passive.
 *
 * @returns {boolean} Returns true if no exception is found.
 */
EnglishParticiple.prototype.isPassive = function () {
    var sentencePart = this.getSentencePart();
    var participleIndex = sentencePart.indexOf(this.getParticiple());
    return !this.isNonVerbEndingEd() && !this.hasRidException() && !this.directPrecedenceException(sentencePart, participleIndex) && !this.precedenceException(sentencePart, participleIndex);
};
/**
 * Checks whether a found participle is in the nonVerbsEndingEd list.
 * If a word is in the nonVerbsEndingEd list, it isn't a participle.
 * Irregular participles do not end in -ed, and therefore cannot be in the nonVerbsEndingEd list.
 *
 * @returns {boolean} Returns true if it is in the nonVerbsEndingEd list, otherwise returns false.
 */
EnglishParticiple.prototype.isNonVerbEndingEd = function () {
    if (this.getType() === "irregular") {
        return false;
    }
    return includes(nonVerbsEndingEd, this.getParticiple());
};
/**
 * Checks whether the participle is 'rid' in combination with 'get', 'gets', 'getting', 'got' or 'gotten'.
 * If this is true, the participle is not passive.
 *
 * @returns {boolean} Returns true if 'rid' is found in combination with a form of 'get'
 * otherwise returns false.
 */
EnglishParticiple.prototype.hasRidException = function () {
    if (this.getParticiple() === "rid") {
        var auxiliaries = this.getAuxiliaries();
        return !isEmpty(intersection(irregularExclusionArray, auxiliaries));
    }
    return false;
};
/**
 * Checks whether the participle is directly preceded by a word from the direct precedence exception list.
 * If this is the case, the sentence part is not passive.
 *
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {number} participleIndex The index of the participle.
 *
 * @returns {boolean} Returns true if a word from the direct precedence exception list is directly preceding
 * the participle, otherwise returns false.
 */
EnglishParticiple.prototype.directPrecedenceException = function (sentencePart, participleIndex) {
    var directPrecedenceExceptionMatch = getWordIndices(sentencePart, directPrecedenceExceptionRegex);
    return includesIndex(directPrecedenceExceptionMatch, participleIndex);
};
/**
 * Checks whether a word from the precedence exception list occurs anywhere in the sentence part before the participle.
 * If this is the case, the sentence part is not passive.
 *
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {number} participleIndex The index of the participle.
 *
 * @returns {boolean} Returns true if a word from the precedence exception list occurs anywhere in the
 * sentence part before the participle, otherwise returns false.
 */
EnglishParticiple.prototype.precedenceException = function (sentencePart, participleIndex) {
    var precedenceExceptionMatch = getWordIndices(sentencePart, precedenceExceptionRegex);
    return precedesIndex(precedenceExceptionMatch, participleIndex);
};
module.exports = EnglishParticiple;



},{"../../stringProcessing/createRegexFromArray.js":352,"../../values/Participle.js":390,"./functionWords.js":283,"./passivevoice/getIndicesWithRegex.js":286,"./passivevoice/non-verb-ending-ed.js":290,"lodash/forEach":167,"lodash/includes":173,"lodash/intersection":175,"lodash/isEmpty":181,"util":224}],280:[function(require,module,exports){
"use strict";

var SentencePart = require("../../values/SentencePart.js");
var getParticiples = require("./passivevoice/getParticiples.js");
/**
 * Creates a English specific sentence part.
 *
 * @param {string} sentencePartText The text from the sentence part.
 * @param {Array} auxiliaries The list of auxiliaries from the sentence part.
 * @param {string} locale The locale used for this sentence part.
 * @constructor
 */
var EnglishSentencePart = function EnglishSentencePart(sentencePartText, auxiliaries, locale) {
  SentencePart.call(this, sentencePartText, auxiliaries, locale);
};
require("util").inherits(EnglishSentencePart, SentencePart);
/**
 * Returns the participle objects for the participles found in the sentence part.
 * @returns {Array} The list of participle objects.
 */
EnglishSentencePart.prototype.getParticiples = function () {
  return getParticiples(this.getSentencePartText(), this.getAuxiliaries());
};
module.exports = EnglishSentencePart;



},{"../../values/SentencePart.js":392,"./passivevoice/getParticiples.js":287,"util":224}],281:[function(require,module,exports){
"use strict";

var getParticiples = require("./passivevoice/getParticiples.js");
var determineSentencePartIsPassive = require("../passivevoice/determineSentencePartIsPassive.js");
/**
 * Determines whether a sentence part is passive.
 *
 * @param {string} sentencePart The sentence part to determine voice for.
 * @param {Array} auxiliaries The auxiliaries to be used for creating SentenceParts.
 * @returns {boolean} Returns true if passive, otherwise returns false.
 */
module.exports = function (sentencePart, auxiliaries) {
  var participles = getParticiples(sentencePart, auxiliaries);
  return determineSentencePartIsPassive(participles);
};



},{"../passivevoice/determineSentencePartIsPassive.js":335,"./passivevoice/getParticiples.js":287}],282:[function(require,module,exports){
"use strict";
/**
 * Returns an array with exceptions for the sentence beginning researcher.
 * @returns {Array} The array filled with exceptions.
 */

module.exports = function () {
    return [
    // Definite articles:
    "the",
    // Indefinite articles:
    "a", "an",
    // Numbers 1-10:
    "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    // Demonstrative pronouns:
    "this", "that", "these", "those"];
};



},{}],283:[function(require,module,exports){
"use strict";

var filteredPassiveAuxiliaries = require("./passivevoice/auxiliaries.js")().filteredAuxiliaries;
var notFilteredPassiveAuxiliaries = require("./passivevoice/auxiliaries.js")().notFilteredAuxiliaries;
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



},{"./passivevoice/auxiliaries.js":285,"./transitionWords.js":292}],284:[function(require,module,exports){
"use strict";

var verbEndingInIngRegex = /\w+ing(?=$|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig;
var stopCharacterRegex = /(?!([a-zA-Z]))([:,]|('ll)|('ve))(?=[ \n\r\t\'\"\+\-»«‹›<>])/ig;
var ingExclusionArray = ["king", "cling", "ring", "being", "thing", "something", "anything"];
var indices = require("../../stringProcessing/indices");
var getIndicesOfList = indices.getIndicesByWordList;
var filterIndices = indices.filterIndices;
var sortIndices = indices.sortIndices;
var stripSpaces = require("../../stringProcessing/stripSpaces.js");
var normalizeSingleQuotes = require("../../stringProcessing/quotes.js").normalizeSingle;
var arrayToRegex = require("../../stringProcessing/createRegexFromArray.js");
var auxiliaries = require("./passivevoice/auxiliaries.js")().all;
var SentencePart = require("./SentencePart.js");
var auxiliaryRegex = arrayToRegex(auxiliaries);
var stopwords = require("./passivevoice/stopwords.js")();
var filter = require("lodash/filter");
var isUndefined = require("lodash/isUndefined");
var includes = require("lodash/includes");
var map = require("lodash/map");
/**
 * Gets active verbs (ending in ing) to determine sentence breakers.
 *
 * @param {string} sentence The sentence to get the active verbs from.
 * @returns {Array} The array with valid matches.
 */
var getVerbsEndingInIng = function getVerbsEndingInIng(sentence) {
    // Matches the sentences with words ending in ing.
    var matches = sentence.match(verbEndingInIngRegex) || [];
    // Filters out words ending in -ing that aren't verbs.
    return filter(matches, function (match) {
        return !includes(ingExclusionArray, stripSpaces(match));
    });
};
/**
 * Gets stop characters to determine sentence breakers.
 *
 * @param {string} sentence The sentence to get the stop characters from.
 * @returns {Array} The array with valid matches.
 */
var getStopCharacters = function getStopCharacters(sentence) {
    var match;
    var matches = [];
    stopCharacterRegex.lastIndex = 0;
    while ((match = stopCharacterRegex.exec(sentence)) !== null) {
        matches.push({
            index: match.index,
            match: match[0]
        });
    }
    return matches;
};
/**
 * Gets the indexes of sentence breakers (auxiliaries, stopwords and active verbs) to determine sentence parts.
 * Indices are filtered because there could be duplicate matches, like "even though" and "though".
 * In addition, 'having' will be matched both as a -ing verb as well as an auxiliary.
 *
 * @param {string} sentence The sentence to check for indices of auxiliaries, stopwords and active verbs.
 * @returns {Array} The array with valid indices to use for determining sentence parts.
 */
var getSentenceBreakers = function getSentenceBreakers(sentence) {
    sentence = sentence.toLocaleLowerCase();
    var auxiliaryIndices = getIndicesOfList(auxiliaries, sentence);
    var stopwordIndices = getIndicesOfList(stopwords, sentence);
    var stopCharacterIndices = getStopCharacters(sentence);
    var ingVerbs = getVerbsEndingInIng(sentence);
    var ingVerbsIndices = getIndicesOfList(ingVerbs, sentence);
    // Concat all indices arrays, filter them and sort them.
    var indices = [].concat(auxiliaryIndices, stopwordIndices, ingVerbsIndices, stopCharacterIndices);
    indices = filterIndices(indices);
    return sortIndices(indices);
};
/**
 * Gets the matches with the auxiliaries in the sentence.
 *
 * @param {string} sentencePart The part of the sentence to match for auxiliaries.
 * @returns {Array} All formatted matches from the sentence part.
 */
var getAuxiliaryMatches = function getAuxiliaryMatches(sentencePart) {
    var auxiliaryMatches = sentencePart.match(auxiliaryRegex) || [];
    return map(auxiliaryMatches, function (auxiliaryMatch) {
        return stripSpaces(auxiliaryMatch);
    });
};
/**
 * Gets the sentence parts from a sentence by determining sentence breakers.
 *
 * @param {string} sentence The sentence to split up in sentence parts.
 * @returns {Array} The array with all parts of a sentence that have an auxiliary.
 */
var getSentenceParts = function getSentenceParts(sentence) {
    var sentenceParts = [];
    sentence = normalizeSingleQuotes(sentence);
    // First check if there is an auxiliary in the sentence.
    if (sentence.match(auxiliaryRegex) === null) {
        return sentenceParts;
    }
    var indices = getSentenceBreakers(sentence);
    // Get the words after the found auxiliary.
    for (var i = 0; i < indices.length; i++) {
        var endIndex = sentence.length;
        if (!isUndefined(indices[i + 1])) {
            endIndex = indices[i + 1].index;
        }
        // Cut the sentence from the current index to the endIndex (start of next breaker, of end of sentence).
        var sentencePart = stripSpaces(sentence.substr(indices[i].index, endIndex - indices[i].index));
        var auxiliaryMatches = getAuxiliaryMatches(sentencePart);
        // If a sentence part doesn't have an auxiliary, we don't need it, so it can be filtered out.
        if (auxiliaryMatches.length !== 0) {
            sentenceParts.push(new SentencePart(sentencePart, auxiliaryMatches));
        }
    }
    return sentenceParts;
};
/**
 * Split the sentence in sentence parts based on auxiliaries.
 *
 * @param {string} sentence The sentence to split in parts.
 * @returns {Array} A list with sentence parts.
 */
module.exports = function (sentence) {
    return getSentenceParts(sentence);
};



},{"../../stringProcessing/createRegexFromArray.js":352,"../../stringProcessing/indices":364,"../../stringProcessing/quotes.js":370,"../../stringProcessing/stripSpaces.js":380,"./SentencePart.js":280,"./passivevoice/auxiliaries.js":285,"./passivevoice/stopwords.js":291,"lodash/filter":162,"lodash/includes":173,"lodash/isUndefined":192,"lodash/map":195}],285:[function(require,module,exports){
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



},{}],286:[function(require,module,exports){
"use strict";
/**
 * Matches words from a list in sentence parts and returns them and their indices.
 *
 * @param {string} sentencePart The sentence part to match the words in.
 * @param {RegExp} regex The regex used for matching.
 * @returns {Array} The list of result objects.
 */

module.exports = function (sentencePart, regex) {
    var results = [];
    /* Decided to use a for loop here so that we could retrieve all matches while keeping result objects intact.
    For every match there is in the sentence part, an object with the match and its index will be pushed into
    the results array. */
    for (var match = regex.exec(sentencePart); match !== null; match = regex.exec(sentencePart)) {
        results.push({
            match: match[0],
            index: match.index
        });
    }
    return results;
};



},{}],287:[function(require,module,exports){
"use strict";

var getWords = require("../../../stringProcessing/getWords.js");
var regexFunction = require("../../../researches/english/passivevoice/matchParticiples")();
var regularParticiples = regexFunction.regularParticiples;
var irregularParticiples = regexFunction.irregularParticiples;
var EnglishParticiple = require("../EnglishParticiple.js");
var forEach = require("lodash/forEach");
/**
 * Creates English participle objects for the participles found in a sentence part.
 *
 * @param {string} sentencePartText The sentence part to find participles in.
 * @param {array} auxiliaries The list of auxiliaries from the sentence part.
 * @returns {Array} The list with English participle objects.
 */
module.exports = function (sentencePartText, auxiliaries) {
    var words = getWords(sentencePartText);
    var foundParticiples = [];
    forEach(words, function (word) {
        var type = "";
        if (regularParticiples(word).length !== 0) {
            type = "regular";
        }
        if (irregularParticiples(word).length !== 0) {
            type = "irregular";
        }
        if (type !== "") {
            foundParticiples.push(new EnglishParticiple(word, sentencePartText, { auxiliaries: auxiliaries, type: type }));
        }
    });
    return foundParticiples;
};



},{"../../../researches/english/passivevoice/matchParticiples":289,"../../../stringProcessing/getWords.js":362,"../EnglishParticiple.js":279,"lodash/forEach":167}],288:[function(require,module,exports){
"use strict";

module.exports = function () {
    return ["arisen", "awoken", "reawoken", "babysat", "backslid", "backslidden", "beat", "beaten", "become", "begun", "bent", "unbent", "bet", "bid", "outbid", "rebid", "underbid", "overbid", "bidden", "bitten", "blown", "bought", "overbought", "bound", "unbound", "rebound", "broadcast", "rebroadcast", "broken", "brought", "browbeat", "browbeaten", "built", "prebuilt", "rebuilt", "overbuilt", "burnt", "burst", "bust", "cast", "miscast", "recast", "caught", "chosen", "clung", "come", "overcome", "cost", "crept", "cut", "undercut", "recut", "daydreamt", "dealt", "misdealt", "redealt", "disproven", "done", "predone", "outdone", "misdone", "redone", "overdone", "undone", "drawn", "outdrawn", "redrawn", "overdrawn", "dreamt", "driven", "outdriven", "drunk", "outdrunk", "overdrunk", "dug", "dwelt", "eaten", "overeaten", "fallen", "felt", "fit", "refit", "retrofit", "flown", "outflown", "flung", "forbidden", "forecast", "foregone", "foreseen", "foretold", "forgiven", "forgotten", "forsaken", "fought", "outfought", "found", "frostbitten", "frozen", "unfrozen", "given", "gone", "undergone",
    //	Is also auxiliary: "got",
    "gotten", "ground", "reground", "grown", "outgrown", "regrown", "had", "handwritten", "heard", "reheard", "misheard", "overheard", "held", "hewn", "hidden", "unhidden", "hit", "hung", "rehung", "overhung", "unhung", "hurt", "inlaid", "input", "interwound", "interwoven", "jerry-built", "kept", "knelt", "knit", "reknit", "unknit", "known", "laid", "mislaid", "relaid", "overlaid", "lain", "underlain", "leant", "leapt", "outleapt", "learnt", "unlearnt", "relearnt", "mislearnt", "left", "lent", "let", "lip-read", "lit", "relit", "lost", "made", "premade", "remade", "meant", "met", "mown", "offset", "paid", "prepaid", "repaid", "overpaid", "partaken", "proofread", "proven", "put", "quick-frozen", "quit", "read", "misread", "reread", "retread", "rewaken", "rid", "ridden", "outridden", "overridden", "risen", "roughcast", "run", "outrun", "rerun", "overrun", "rung", "said", "sand-cast", "sat", "outsat", "sawn", "seen", "overseen", "sent", "resent", "set", "preset", "reset", "misset", "sewn", "resewn", "oversewn", "unsewn", "shaken", "shat", "shaven", "shit", "shone", "outshone", "shorn", "shot", "outshot", "overshot", "shown", "shrunk", "preshrunk", "shut", "sight-read", "slain", "slept", "outslept", "overslept", "slid", "slit", "slung", "unslung", "slunk", "smelt", "outsmelt", "snuck", "sold", "undersold", "presold", "outsold", "resold", "oversold", "sought", "sown", "spat", "spelt", "misspelt", "spent", "underspent", "outspent", "misspent", "overspent", "spilt", "overspilt", "spit", "split", "spoilt", "spoken", "outspoken", "misspoken", "overspoken", "spread", "sprung", "spun", "unspun", "stolen", "stood", "understood", "misunderstood", "strewn", "stricken", "stridden", "striven", "struck", "strung", "unstrung", "stuck", "unstuck", "stung", "stunk", "sublet", "sunburnt", "sung", "outsung", "sunk", "sweat", "swept", "swollen", "sworn", "outsworn", "swum", "outswum", "swung", "taken", "undertaken", "mistaken", "retaken", "overtaken", "taught", "mistaught", "retaught", "telecast", "test-driven", "test-flown", "thought", "outthought", "rethought", "overthought", "thrown", "outthrown", "overthrown", "thrust", "told", "retold", "torn", "retorn", "trod", "trodden", "typecast", "typeset", "upheld", "upset", "waylaid", "wept", "wet", "rewet", "withdrawn", "withheld", "withstood", "woken", "won", "rewon", "worn", "reworn", "wound", "rewound", "overwound", "unwound", "woven", "rewoven", "unwoven", "written", "typewritten", "underwritten", "outwritten", "miswritten", "rewritten", "overwritten", "wrung"];
};



},{}],289:[function(require,module,exports){
"use strict";

var find = require("lodash/find");
var irregulars = require("./irregulars")();
/**
 * Returns words that have been determined to be a regular participle.
 *
 * @param {string} word The word to check
 *
 * @returns {Array} A list with the matches.
 */
var regularParticiples = function regularParticiples(word) {
    // Matches all words ending in ed.
    var regularParticiplesRegex = /\w+ed($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig;
    return word.match(regularParticiplesRegex) || [];
};
/**
 * Returns the matches for a word in the list of irregulars.
 *
 * @param {string} word The word to match in the list.
 *
 * @returns {Array} A list with the matches.
 */
var irregularParticiples = function irregularParticiples(word) {
    var matches = [];
    find(irregulars, function (currentWord) {
        if (currentWord === word) {
            matches.push(currentWord);
        }
    });
    return matches;
};
module.exports = function () {
    return {
        regularParticiples: regularParticiples,
        irregularParticiples: irregularParticiples
    };
};



},{"./irregulars":288,"lodash/find":163}],290:[function(require,module,exports){
"use strict";

module.exports = function () {
    return ["ablebodied", "abovementioned", "absentminded", "accoladed", "accompanied", "acculturized", "accursed", "acerated", "acerbated", "acetylized", "achromatised", "achromatized", "acidified", "acned", "actualised", "adrenalised", "adulated", "adversed", "aestheticised", "affectioned", "affined", "affricated", "aforementioned", "agerelated", "aggrieved", "airbed", "aircooled", "airspeed", "alcoholized", "alcoved", "alkalised", "allianced", "aluminized", "alveolated", "ambered", "ammonified", "amplified", "anagrammatised", "anagrammatized", "anathematised", "aniseed", "ankled", "annualized", "anonymised", "anthologized", "antlered", "anucleated", "anviled", "anvilshaped", "apostrophised", "apostrophized", "appliqued", "apprized", "arbitrated", "armored", "articled", "ashamed", "assented", "atomised", "atrophied", "auricled", "auriculated", "aurified", "autopsied", "axled", "babied", "backhoed", "badmannered", "badtempered", "balustered", "baned", "barcoded", "bareboned", "barefooted", "barelegged", "barnacled", "based", "bayoneted", "beadyeyed", "beaked", "beaned", "beatified", "beautified", "beavered", "bed", "bedamned", "bedecked", "behoved", "belated", "bellbottomed", "bellshaped", "benighted", "bequeathed", "berried", "bespectacled", "bewhiskered", "bighearted", "bigmouthed", "bigoted", "bindweed", "binucleated", "biopsied", "bioturbed", "biped", "bipinnated", "birdfeed", "birdseed", "bisegmented", "bitterhearted", "blabbermouthed", "blackhearted", "bladed", "blankminded", "blearyeyed", "bleed", "blissed", "blobbed", "blondhaired", "bloodied", "bloodred", "bloodshed", "blueblooded", "boatshaped", "bobsled", "bodied", "boldhearted", "boogied", "boosed", "bosomed", "bottlefed", "bottlefeed", "bottlenecked", "bouldered", "bowlegged", "bowlshaped", "brandied", "bravehearted", "breastfed", "breastfeed", "breed", "brighteyed", "brindled", "broadhearted", "broadleaved", "broadminded", "brokenhearted", "broomed", "broomweed", "buccaned", "buckskinned", "bucktoothed", "buddied", "buffaloed", "bugeyed", "bugleweed", "bugweed", "bulletined", "bunked", "busied", "butterfingered", "cabbed", "caddied", "cairned", "calcified", "canalized", "candied", "cannulated", "canoed", "canopied", "canvased", "caped", "capsulated", "cassocked", "castellated", "catabolised", "catheterised", "caudated", "cellmediated", "cellulosed", "certified", "chagrined", "chambered", "chested", "chevroned", "chickenfeed", "chickenhearted", "chickweed", "chilblained", "childbed", "chinned", "chromatographed", "ciliated", "cindered", "cingulated", "circumstanced", "cisgendered", "citrullinated", "clappered", "clarified", "classified", "clawshaped", "claysized", "cleanhearted", "clearminded", "clearsighted", "cliched", "clodded", "cloistered", "closefisted", "closehearted", "closelipped", "closemouthed", "closeted", "cloudseed", "clubfooted", "clubshaped", "clued", "cockeyed", "codified", "coed", "coevolved", "coffined", "coiffed", "coinfected", "coldblooded", "coldhearted", "collateralised", "colonialised", "colorcoded", "colorised", "colourised", "columned", "commoditized", "compactified", "companioned", "complexioned", "conceited", "concerned", "concussed", "coneshaped", "congested", "contented", "convexed", "coralled", "corymbed", "cottonseed", "countrified", "countrybred", "courtmartialled", "coved", "coveralled", "cowshed", "cozied", "cragged", "crayoned", "credentialed", "creed", "crenulated", "crescentshaped", "cressweed", "crewed", "cricked", "crispated", "crossbarred", "crossbed", "crossbred", "crossbreed", "crossclassified", "crosseyed", "crossfertilised", "crossfertilized", "crossindexed", "crosslegged", "crossshaped", "crossstratified", "crossstriated", "crotched", "crucified", "cruelhearted", "crutched", "cubeshaped", "cubified", "cuckolded", "cucumbershaped", "cumbered", "cuminseed", "cupshaped", "curated", "curded", "curfewed", "curlicued", "curlycued", "curried", "curtsied", "cyclized", "cylindershaped", "damed", "dandified", "dangered", "darkhearted", "daybed", "daylighted", "deacidified", "deacylated", "deadhearted", "deadlined", "deaminized", "deathbed", "decalcified", "decertified", "deckbed", "declassified", "declutched", "decolourated", "decreed", "deed", "deeprooted", "deepseated", "defensed", "defied", "deflexed", "deglamorised", "degunkified", "dehumidified", "deified", "deled", "delegitimised", "demoded", "demystified", "denasalized", "denazified", "denied", "denitrified", "denticulated", "deseed", "desexualised", "desposited", "detoxified", "deuced", "devitrified", "dewlapped", "dezincified", "diagonalised", "dialogued", "died", "digitated", "dignified", "dilled", "dimwitted", "diphthonged", "disaffected", "disaggregated", "disarrayed", "discalced", "discolorated", "discolourated", "discshaped", "diseased", "disembodied", "disencumbered", "disfranchised", "diskshaped", "disproportionated", "disproportioned", "disqualified", "distempered", "districted", "diversified", "diverticulated", "divested", "divvied", "dizzied", "dogged", "dogsbodied", "dogsled", "domeshaped", "domiciled", "dormered", "doublebarrelled", "doublestranded", "doublewalled", "downhearted", "duckbilled", "eared", "echeloned", "eddied", "edified", "eggshaped", "elasticated", "electrified", "elegized", "embed", "embodied", "emceed", "empaneled", "empanelled", "emptyhearted", "emulsified", "engined", "ennobled", "envied", "enzymecatalysed", "enzymecatalyzed", "epitomised", "epoxidized", "epoxied", "etherised", "etherized", "evilhearted", "evilminded", "exceed", "excited", "exemplified", "exponentiated", "expurgated", "extravasated", "extraverted", "extroverted", "fabled", "facelifted", "facsimiled", "fainthearted", "falcated", "falsehearted", "falsified", "famed", "fancified", "fanged", "fanshaped", "fantasied", "farsighted", "fated", "fatted", "fazed", "featherbed", "fed", "federalized", "feeblehearted", "feebleminded", "feeblewitted", "feed", "fendered", "fenestrated", "ferried", "fevered", "fibered", "fibred", "ficklehearted", "fiercehearted", "figged", "filigreed", "filterfeed", "fireweed", "firmhearted", "fissured", "flanged", "flanneled", "flannelled", "flatbed", "flatfooted", "flatted", "flaxenhaired", "flaxseed", "flaxweed", "flighted", "floodgenerated", "flowerbed", "fluidised", "fluidized", "flurried", "fobbed", "fonded", "forcefeed", "foreshortened", "foresighted", "forkshaped", "formfeed", "fortified", "fortressed", "foulmouthed", "foureyed", "foxtailed", "fractionalised", "fractionalized", "frankhearted", "freed", "freehearted", "freespirited", "frenzied", "friezed", "frontiered", "fructified", "frumped", "fullblooded", "fullbodied", "fullfledged", "fullhearted", "funnelshaped", "furnaced", "gaitered", "galleried", "gangliated", "ganglionated", "gangrened", "gargoyled", "gasified", "gaunted", "gauntleted", "gauzed", "gavelled", "gelatinised", "gemmed", "genderized", "gentled", "gentlehearted", "gerrymandered", "gladhearted", "glamored", "globed", "gloried", "glorified", "glycosylated", "goateed", "gobletshaped", "godspeed", "goodhearted", "goodhumored", "goodhumoured", "goodnatured", "goodtempered", "goosed", "goosenecked", "goutweed", "grainfed", "grammaticalized", "grapeseed", "gratified", "graved", "gravelbed", "grayhaired", "greathearted", "greed", "greenweed", "grommeted", "groundspeed", "groved", "gruffed", "guiled", "gulled", "gumshoed", "gunkholed", "gussied", "guyed", "gyrostabilized", "hackneyed", "hagged", "haired", "halfcivilized", "halfhearted", "halfwitted", "haloed", "handballed", "handfed", "handfeed", "hardcoded", "hardhearted", "hardnosed", "hared", "harelipped", "hasted", "hatred", "haunched", "hawkeyed", "hayseed", "hayweed", "hearsed", "hearted", "heartshaped", "heavenlyminded", "heavyfooted", "heavyhearted", "heed", "heired", "heisted", "helicoptered", "helmed", "helmeted", "hemagglutinated", "hemolyzed", "hempseed", "hempweed", "heparinised", "heparinized", "herbed", "highheeled", "highminded", "highpriced", "highspeed", "highspirited", "hilled", "hipped", "hispanicised", "hocked", "hoed", "hogweed", "holstered", "homaged", "hoodooed", "hoofed", "hooknosed", "hooved", "horned", "horrified", "horseshoed", "horseweed", "hotbed", "hotblooded", "hothearted", "hotted", "hottempered", "hued", "humansized", "humidified", "humped", "hundred", "hutched", "hyperinflated", "hyperpigmented", "hyperstimulated", "hypertrophied", "hyphened", "hypophysectomised", "hypophysectomized", "hypopigmented", "hypostatised", "hysterectomized", "iconified", "iconised", "iconized", "ideologised", "illbred", "illconceived", "illdefined", "illdisposed", "illequipped", "illfated", "illfavored", "illfavoured", "illflavored", "illfurnished", "illhumored", "illhumoured", "illimited", "illmannered", "illnatured", "illomened", "illproportioned", "illqualified", "illscented", "illtempered", "illumed", "illusioned", "imbed", "imbossed", "imbued", "immatured", "impassioned", "impenetrated", "imperfected", "imperialised", "imperturbed", "impowered", "imputed", "inarticulated", "inbred", "inbreed", "incapsulated", "incased", "incrustated", "incrusted", "indebted", "indeed", "indemnified", "indentured", "indigested", "indisposed", "inexperienced", "infrared", "intensified", "intentioned", "interbedded", "interbred", "interbreed", "interluded", "introverted", "inured", "inventoried", "iodinated", "iodised", "irked", "ironfisted", "ironweed", "itchweed", "ivied", "ivyweed", "jagged", "jellified", "jerseyed", "jetlagged", "jetpropelled", "jeweled", "jewelled", "jewelweed", "jiggered", "jimmyweed", "jimsonweed", "jointweed", "joyweed", "jungled", "juried", "justiceweed", "justified", "karstified", "kerchiefed", "kettleshaped", "kibbled", "kidneyshaped", "kimonoed", "kindhearted", "kindred", "kingsized", "kirtled", "knacked", "knapweed", "kneed", "knobbed", "knobweed", "knopweed", "knotweed", "lakebed", "lakeweed", "lamed", "lamellated", "lanceshaped", "lanceted", "landbased", "lapeled", "lapelled", "largehearted", "lariated", "lased", "latticed", "lauded", "lavaged", "lavendered", "lawned", "led", "lefteyed", "legitimatised", "legitimatized", "leisured", "lensshaped", "leveed", "levied", "lichened", "lichenized", "lidded", "lifesized", "lightfingered", "lightfooted", "lighthearted", "lightminded", "lightspeed", "lignified", "likeminded", "lilylivered", "limbed", "linearised", "linearized", "linefeed", "linseed", "lionhearted", "liquefied", "liquified", "lithified", "liveried", "lobbied", "located", "locoweed", "longarmed", "longhaired", "longhorned", "longlegged", "longnecked", "longsighted", "longwinded", "lopsided", "loudmouthed", "louvered", "louvred", "lowbred", "lowpriced", "lowspirited", "lozenged", "lunated", "lyrated", "lysinated", "maced", "macroaggregated", "macrodissected", "maculated", "madweed", "magnified", "maidenweed", "maladapted", "maladjusted", "malnourished", "malrotated", "maned", "mannered", "manuevered", "manyhued", "manyshaped", "manysided", "masted", "mealymouthed", "meanspirited", "membered", "membraned", "metaled", "metalized", "metallised", "metallized", "metamerized", "metathesized", "meted", "methylated", "mettled", "microbrecciated", "microminiaturized", "microstratified", "middleaged", "midsized", "miffed", "mildhearted", "milkweed", "miniskirted", "misactivated", "misaligned", "mischiefed", "misclassified", "misdeed", "misdemeaned", "mismannered", "misnomered", "misproportioned", "miswired", "mitred", "mitted", "mittened", "moneyed", "monocled", "mononucleated", "monospaced", "monotoned", "monounsaturated", "mortified", "moseyed", "motorised", "motorized", "moussed", "moustached", "muddied", "mugweed", "multiarmed", "multibarreled", "multibladed", "multicelled", "multichambered", "multichanneled", "multichannelled", "multicoated", "multidirected", "multiengined", "multifaceted", "multilaminated", "multilaned", "multilayered", "multilobed", "multilobulated", "multinucleated", "multipronged", "multisegmented", "multisided", "multispeed", "multistemmed", "multistoried", "multitalented", "multitoned", "multitowered", "multivalued", "mummied", "mummified", "mustached", "mustachioed", "mutinied", "myelinated", "mystified", "mythicised", "naked", "narcotised", "narrowminded", "natured", "neaped", "nearsighted", "necrosed", "nectared", "need", "needleshaped", "newfangled", "newlywed", "nibbed", "nimblewitted", "nippled", "nixed", "nobled", "noduled", "noised", "nonaccented", "nonactivated", "nonadsorbed", "nonadulterated", "nonaerated", "nonaffiliated", "nonaliased", "nonalienated", "nonaligned", "nonarchived", "nonarmored", "nonassociated", "nonattenuated", "nonblackened", "nonbreastfed", "nonbrecciated", "nonbuffered", "nonbuttered", "noncarbonated", "noncarbonized", "noncatalogued", "noncatalyzed", "noncategorized", "noncertified", "nonchlorinated", "nonciliated", "noncircumcised", "noncivilized", "nonclassified", "noncoated", "noncodified", "noncoerced", "noncommercialized", "noncommissioned", "noncompacted", "noncompiled", "noncomplicated", "noncomposed", "noncomputed", "noncomputerized", "nonconcerted", "nonconditioned", "nonconfirmed", "noncongested", "nonconjugated", "noncooled", "noncorrugated", "noncoupled", "noncreated", "noncrowded", "noncultured", "noncurated", "noncushioned", "nondecoded", "nondecomposed", "nondedicated", "nondeferred", "nondeflated", "nondegenerated", "nondegraded", "nondelegated", "nondelimited", "nondelineated", "nondemarcated", "nondeodorized", "nondeployed", "nonderivatized", "nonderived", "nondetached", "nondetailed", "nondifferentiated", "nondigested", "nondigitized", "nondilapidated", "nondilated", "nondimensionalised", "nondimensionalized", "nondirected", "nondisabled", "nondisciplined", "nondispersed", "nondisputed", "nondisqualified", "nondisrupted", "nondisseminated", "nondissipated", "nondissolved", "nondistressed", "nondistributed", "nondiversified", "nondiverted", "nondocumented", "nondomesticated", "nondoped", "nondrafted", "nondrugged", "nondubbed", "nonducted", "nonearthed", "noneclipsed", "nonedged", "nonedited", "nonelasticized", "nonelectrified", "nonelectroplated", "nonelectroporated", "nonelevated", "noneliminated", "nonelongated", "nonembedded", "nonembodied", "nonemphasized", "nonencapsulated", "nonencoded", "nonencrypted", "nonendangered", "nonengraved", "nonenlarged", "nonenriched", "nonentangled", "nonentrenched", "nonepithelized", "nonequilibrated", "nonestablished", "nonetched", "nonethoxylated", "nonethylated", "nonetiolated", "nonexaggerated", "nonexcavated", "nonexhausted", "nonexperienced", "nonexpired", "nonfabricated", "nonfalsified", "nonfeathered", "nonfeatured", "nonfed", "nonfederated", "nonfeed", "nonfenestrated", "nonfertilized", "nonfilamented", "nonfinanced", "nonfinished", "nonfinned", "nonfissured", "nonflagellated", "nonflagged", "nonflared", "nonflavored", "nonfluidized", "nonfluorinated", "nonfluted", "nonforested", "nonformalized", "nonformatted", "nonfragmented", "nonfragranced", "nonfranchised", "nonfreckled", "nonfueled", "nonfumigated", "nonfunctionalized", "nonfunded", "nongalvanized", "nongated", "nongelatinized", "nongendered", "nongeneralized", "nongenerated", "nongifted", "nonglazed", "nonglucosated", "nonglucosylated", "nonglycerinated", "nongraded", "nongrounded", "nonhalogenated", "nonhandicapped", "nonhospitalised", "nonhospitalized", "nonhydrated", "nonincorporated", "nonindexed", "noninfected", "noninfested", "noninitialized", "noninitiated", "noninoculated", "noninseminated", "noninstitutionalized", "noninsured", "nonintensified", "noninterlaced", "noninterpreted", "nonintroverted", "noninvestigated", "noninvolved", "nonirrigated", "nonisolated", "nonisomerized", "nonissued", "nonitalicized", "nonitemized", "noniterated", "nonjaded", "nonlabelled", "nonlaminated", "nonlateralized", "nonlayered", "nonlegalized", "nonlegislated", "nonlesioned", "nonlexicalized", "nonliberated", "nonlichenized", "nonlighted", "nonlignified", "nonlimited", "nonlinearized", "nonlinked", "nonlobed", "nonlobotomized", "nonlocalized", "nonlysed", "nonmachined", "nonmalnourished", "nonmandated", "nonmarginalized", "nonmassaged", "nonmatriculated", "nonmatted", "nonmatured", "nonmechanized", "nonmedicated", "nonmedullated", "nonmentioned", "nonmetabolized", "nonmetallized", "nonmetastasized", "nonmetered", "nonmethoxylated", "nonmilled", "nonmineralized", "nonmirrored", "nonmodeled", "nonmoderated", "nonmodified", "nonmonetized", "nonmonitored", "nonmortgaged", "nonmotorized", "nonmottled", "nonmounted", "nonmultithreaded", "nonmutilated", "nonmyelinated", "nonnormalized", "nonnucleated", "nonobjectified", "nonobligated", "nonoccupied", "nonoiled", "nonopinionated", "nonoxygenated", "nonpaginated", "nonpaired", "nonparalyzed", "nonparameterized", "nonparasitized", "nonpasteurized", "nonpatterned", "nonphased", "nonphosphatized", "nonphosphorized", "nonpierced", "nonpigmented", "nonpiloted", "nonpipelined", "nonpitted", "nonplussed", "nonpuffed", "nonrandomized", "nonrated", "nonrefined", "nonregistered", "nonregulated", "nonrelated", "nonretarded", "nonsacred", "nonsalaried", "nonsanctioned", "nonsaturated", "nonscented", "nonscheduled", "nonseasoned", "nonsecluded", "nonsegmented", "nonsegregated", "nonselected", "nonsolidified", "nonspecialized", "nonspored", "nonstandardised", "nonstandardized", "nonstratified", "nonstressed", "nonstriated", "nonstriped", "nonstructured", "nonstylised", "nonstylized", "nonsubmerged", "nonsubscripted", "nonsubsidised", "nonsubsidized", "nonsubstituted", "nonsyndicated", "nonsynthesised", "nontabulated", "nontalented", "nonthreaded", "nontinted", "nontolerated", "nontranslated", "nontunnelled", "nonunified", "nonunionised", "nonupholstered", "nonutilised", "nonutilized", "nonvalued", "nonvaried", "nonverbalized", "nonvitrified", "nonvolatilised", "nonvolatilized", "normed", "nosebleed", "notated", "notified", "nuanced", "nullified", "numerated", "oarweed", "objectified", "obliqued", "obtunded", "occupied", "octupled", "odored", "oilseed", "oinked", "oldfashioned", "onesided", "oophorectomized", "opaqued", "openhearted", "openminded", "openmouthed", "opiated", "opinionated", "oracled", "oreweed", "ossified", "outbreed", "outmoded", "outrigged", "outriggered", "outsized", "outskated", "outspeed", "outtopped", "outtrumped", "outvoiced", "outweed", "ovated", "overadorned", "overaged", "overalled", "overassured", "overbred", "overbreed", "overcomplicated", "overdamped", "overdetailed", "overdiversified", "overdyed", "overequipped", "overfatigued", "overfed", "overfeed", "overindebted", "overintensified", "overinventoried", "overmagnified", "overmodified", "overpreoccupied", "overprivileged", "overproportionated", "overqualified", "overseed", "oversexed", "oversimplified", "oversized", "oversophisticated", "overstudied", "oversulfated", "ovicelled", "ovoidshaped", "ozonated", "pacified", "packeted", "palatalized", "paled", "palsied", "paned", "panicled", "parabled", "parallelepiped", "parallelized", "parallelopiped", "parenthesised", "parodied", "parqueted", "passioned", "paunched", "pauperised", "pedigreed", "pedimented", "pedunculated", "pegged", "peglegged", "penanced", "pencilshaped", "permineralized", "personified", "petrified", "photodissociated", "photoduplicated", "photoed", "photoinduced", "photolysed", "photolyzed", "pied", "pigeoned", "pigtailed", "pigweed", "pilastered", "pillared", "pilloried", "pimpled", "pinealectomised", "pinealectomized", "pinfeathered", "pinnacled", "pinstriped", "pixellated", "pixilated", "pixillated", "plainclothed", "plantarflexed", "pled", "plumaged", "pocked", "pokeweed", "polychlorinated", "polyunsaturated", "ponytailed", "pooched", "poorspirited", "popeyed", "poppyseed", "porcelainized", "porched", "poshed", "pottered", "poxed", "preachified", "precertified", "preclassified", "preconized", "preinoculated", "premed", "prenotified", "preoccupied", "preposed", "prequalified", "preshaped", "presignified", "prespecified", "prettified", "pried", "principled", "proceed", "prophesied", "propounded", "prosed", "protonated", "proudhearted", "proxied", "pulpified", "pumpkinseed", "puppied", "purebred", "pured", "pureed", "purified", "pustuled", "putrefied", "pyjamaed", "quadruped", "qualified", "quantified", "quantised", "quantized", "quarried", "queried", "questoned", "quicktempered", "quickwitted", "quiesced", "quietened", "quizzified", "racemed", "radiosensitised", "ragweed", "raindrenched", "ramped", "rapeseed", "rarefied", "rarified", "ratified", "razoredged", "reaccelerated", "reaccompanied", "reachieved", "reacknowledged", "readdicted", "readied", "reamplified", "reannealed", "reassociated", "rebadged", "rebiopsied", "recabled", "recategorised", "receipted", "recentred", "recertified", "rechoreographed", "reclarified", "reclassified", "reconferred", "recrystalized", "rectified", "recursed", "red", "redblooded", "redefied", "redenied", "rednecked", "redshifted", "redweed", "redyed", "reed", "reembodied", "reenlighted", "refeed", "refereed", "reflexed", "refortified", "refronted", "refuged", "reglorified", "reimpregnated", "reinitialized", "rejustified", "related", "reliquefied", "remedied", "remodified", "remonetized", "remythologized", "renotified", "renullified", "renumerated", "reoccupied", "repacified", "repurified", "reputed", "requalified", "rescinded", "reseed", "reshoed", "resolidified", "resorbed", "respecified", "restudied", "retabulated", "reticulated", "retinted", "retreed", "retroacted", "reunified", "reverified", "revested", "revivified", "rewed", "ridgepoled", "riffled", "rightminded", "rigidified", "rinded", "riped", "rited", "ritualised", "riverbed", "rivered", "roached", "roadbed", "robotised", "robotized", "romanized", "rosetted", "rosined", "roughhearted", "rubied", "ruddied", "runcinated", "russeted", "sabled", "sabred", "sabretoothed", "sacheted", "sacred", "saddlebred", "sainted", "salaried", "samoyed", "sanctified", "satellited", "savvied", "sawtoothed", "scandalled", "scarified", "scarped", "sceptred", "scissored", "screed", "screwshaped", "scrupled", "sculked", "scurried", "scuttled", "seabed", "seaweed", "seed", "seedbed", "selfassured", "selforganized", "semicivilized", "semidetached", "semidisassembled", "semidomesticated", "semipetrified", "semipronated", "semirefined", "semivitrified", "sentineled", "sepaled", "sepalled", "sequinned", "sexed", "shagged", "shaggycoated", "shaggyhaired", "shaled", "shammed", "sharpangled", "sharpclawed", "sharpcornered", "sharpeared", "sharpedged", "sharpeyed", "sharpflavored", "sharplimbed", "sharpnosed", "sharpsighted", "sharptailed", "sharptongued", "sharptoothed", "sharpwitted", "sharpworded", "shed", "shellbed", "shieldshaped", "shimmied", "shinned", "shirted", "shirtsleeved", "shoed", "shortbeaked", "shortbilled", "shortbodied", "shorthaired", "shortlegged", "shortlimbed", "shortnecked", "shortnosed", "shortsighted", "shortsleeved", "shortsnouted", "shortstaffed", "shorttailed", "shorttempered", "shorttoed", "shorttongued", "shortwinded", "shortwinged", "shotted", "shred", "shrewsized", "shrined", "shrinkproofed", "sickbed", "sickleshaped", "sickleweed", "signalised", "signified", "silicified", "siliconized", "silkweed", "siltsized", "silvertongued", "simpleminded", "simplified", "singlebarreled", "singlebarrelled", "singlebed", "singlebladed", "singlebreasted", "singlecelled", "singlefooted", "singlelayered", "singleminded", "singleseeded", "singleshelled", "singlestranded", "singlevalued", "sissified", "sistered", "sixgilled", "sixmembered", "sixsided", "sixstoried", "skulled", "slickered", "slipcased", "slowpaced", "slowwitted", "slurried", "smallminded", "smoothened", "smoothtongued", "snaggletoothed", "snouted", "snowballed", "snowcapped", "snowshed", "snowshoed", "snubnosed", "so-called", "sofabed", "softhearted", "sogged", "soled", "solidified", "soliped", "sorbed", "souled", "spearshaped", "specified", "spectacled", "sped", "speeched", "speechified", "speed", "spied", "spiffied", "spindleshaped", "spiritualised", "spirted", "splayfooted", "spoonfed", "spoonfeed", "spoonshaped", "spreadeagled", "squarejawed", "squareshaped", "squareshouldered", "squaretoed", "squeegeed", "staled", "starshaped", "starspangled", "starstudded", "statechartered", "statesponsored", "statued", "steadied", "steampowered", "steed", "steelhearted", "steepled", "sterned", "stiffnecked", "stilettoed", "stimied", "stinkweed", "stirrupshaped", "stockinged", "storeyed", "storied", "stouthearted", "straitlaced", "stratified", "strawberryflavored", "streambed", "stressinduced", "stretchered", "strictured", "strongbodied", "strongboned", "strongflavored", "stronghearted", "stronglimbed", "strongminded", "strongscented", "strongwilled", "stubbled", "studied", "stultified", "stupefied", "styed", "stymied", "subclassified", "subcommissioned", "subminiaturised", "subsaturated", "subulated", "suburbanised", "suburbanized", "suburbed", "succeed", "sueded", "sugarrelated", "sulfurized", "sunbed", "superhardened", "superinfected", "supersimplified", "surefooted", "sweetscented", "swifted", "swordshaped", "syllabified", "syphilized", "tabularized", "talented", "tarpapered", "tautomerized", "teated", "teed", "teenaged", "teetotaled", "tenderhearted", "tentacled", "tenured", "termed", "ternated", "testbed", "testified", "theatricalised", "theatricalized", "themed", "thicketed", "thickskinned", "thickwalled", "thighed", "thimbled", "thimblewitted", "thonged", "thoroughbred", "thralled", "threated", "throated", "throughbred", "thyroidectomised", "thyroidectomized", "tiaraed", "ticktocked", "tidied", "tightassed", "tightfisted", "tightlipped", "timehonoured", "tindered", "tined", "tinselled", "tippytoed", "tiptoed", "titled", "toed", "tomahawked", "tonged", "toolshed", "toothplated", "toplighted", "torchlighted", "toughhearted", "traditionalized", "trajected", "tranced", "transgendered", "transliterated", "translocated", "transmogrified", "treadled", "treed", "treelined", "tressed", "trialled", "triangled", "trifoliated", "trifoliolated", "trilobed", "trucklebed", "truehearted", "trumpetshaped", "trumpetweed", "tuberculated", "tumbleweed", "tunnelshaped", "turbaned", "turreted", "turtlenecked", "tuskshaped", "tweed", "twigged", "typified", "ulcered", "ultracivilised", "ultracivilized", "ultracooled", "ultradignified", "ultradispersed", "ultrafiltered", "ultrared", "ultrasimplified", "ultrasophisticated", "unabandoned", "unabashed", "unabbreviated", "unabetted", "unabolished", "unaborted", "unabraded", "unabridged", "unabsolved", "unabsorbed", "unaccelerated", "unaccented", "unaccentuated", "unacclimatised", "unacclimatized", "unaccompanied", "unaccomplished", "unaccosted", "unaccredited", "unaccrued", "unaccumulated", "unaccustomed", "unacidulated", "unacquainted", "unacquitted", "unactivated", "unactuated", "unadapted", "unaddicted", "unadjourned", "unadjudicated", "unadjusted", "unadmonished", "unadopted", "unadored", "unadorned", "unadsorbed", "unadulterated", "unadvertised", "unaerated", "unaffiliated", "unaggregated", "unagitated", "unaimed", "unaired", "unaliased", "unalienated", "unaligned", "unallocated", "unalloyed", "unalphabetized", "unamassed", "unamortized", "unamplified", "unanaesthetised", "unanaesthetized", "unaneled", "unanesthetised", "unanesthetized", "unangered", "unannealed", "unannexed", "unannihilated", "unannotated", "unanointed", "unanticipated", "unappareled", "unappendaged", "unapportioned", "unapprenticed", "unapproached", "unappropriated", "unarbitrated", "unarched", "unarchived", "unarmored", "unarmoured", "unarticulated", "unascertained", "unashamed", "unaspirated", "unassembled", "unasserted", "unassessed", "unassociated", "unassorted", "unassuaged", "unastonished", "unastounded", "unatoned", "unattained", "unattainted", "unattenuated", "unattributed", "unauctioned", "unaudited", "unauthenticated", "unautographed", "unaverted", "unawaked", "unawakened", "unawarded", "unawed", "unbaffled", "unbaited", "unbalconied", "unbanded", "unbanished", "unbaptised", "unbaptized", "unbarreled", "unbarrelled", "unbattered", "unbeaded", "unbearded", "unbeneficed", "unbesotted", "unbetrayed", "unbetrothed", "unbiased", "unbiassed", "unbigoted", "unbilled", "unblackened", "unblanketed", "unblasphemed", "unblazoned", "unblistered", "unblockaded", "unbloodied", "unbodied", "unbonded", "unbothered", "unbounded", "unbracketed", "unbranded", "unbreaded", "unbrewed", "unbridged", "unbridled", "unbroached", "unbudgeted", "unbuffed", "unbuffered", "unburnished", "unbutchered", "unbuttered", "uncached", "uncaked", "uncalcified", "uncalibrated", "uncamouflaged", "uncamphorated", "uncanceled", "uncancelled", "uncapitalized", "uncarbonated", "uncarpeted", "uncased", "uncashed", "uncastrated", "uncatalogued", "uncatalysed", "uncatalyzed", "uncategorised", "uncatered", "uncaulked", "uncelebrated", "uncensored", "uncensured", "uncertified", "unchambered", "unchanneled", "unchannelled", "unchaperoned", "uncharacterized", "uncharted", "unchartered", "unchastened", "unchastised", "unchelated", "uncherished", "unchilled", "unchristened", "unchronicled", "uncircumcised", "uncircumscribed", "uncited", "uncivilised", "uncivilized", "unclarified", "unclassed", "unclassified", "uncleaved", "unclimbed", "unclustered", "uncluttered", "uncoagulated", "uncoded", "uncodified", "uncoerced", "uncoined", "uncollapsed", "uncollated", "uncolonised", "uncolonized", "uncolumned", "uncombined", "uncommented", "uncommercialised", "uncommercialized", "uncommissioned", "uncommitted", "uncompacted", "uncompartmentalized", "uncompartmented", "uncompensated", "uncompiled", "uncomplicated", "uncompounded", "uncomprehened", "uncomputed", "unconcealed", "unconceded", "unconcluded", "uncondensed", "unconditioned", "unconfined", "unconfirmed", "uncongested", "unconglomerated", "uncongratulated", "unconjugated", "unconquered", "unconsecrated", "unconsoled", "unconsolidated", "unconstipated", "unconstricted", "unconstructed", "unconsumed", "uncontacted", "uncontracted", "uncontradicted", "uncontrived", "unconverted", "unconveyed", "unconvicted", "uncooked", "uncooled", "uncoordinated", "uncopyrighted", "uncored", "uncorrelated", "uncorroborated", "uncosted", "uncounseled", "uncounselled", "uncounterfeited", "uncoveted", "uncrafted", "uncramped", "uncrannied", "uncrazed", "uncreamed", "uncreased", "uncreated", "uncredentialled", "uncredited", "uncrested", "uncrevassed", "uncrippled", "uncriticised", "uncriticized", "uncropped", "uncrosslinked", "uncrowded", "uncrucified", "uncrumbled", "uncrystalized", "uncrystallised", "uncrystallized", "uncubed", "uncuddled", "uncued", "unculled", "uncultivated", "uncultured", "uncupped", "uncurated", "uncurbed", "uncurried", "uncurtained", "uncushioned", "undamped", "undampened", "undappled", "undarkened", "undated", "undaubed", "undazzled", "undeadened", "undeafened", "undebated", "undebunked", "undeceased", "undecimalized", "undeciphered", "undecked", "undeclared", "undecomposed", "undeconstructed", "undedicated", "undefeated", "undeferred", "undefied", "undefined", "undeflected", "undefrauded", "undefrayed", "undegassed", "undejected", "undelegated", "undeleted", "undelimited", "undelineated", "undemented", "undemolished", "undemonstrated", "undenatured", "undenied", "undented", "undeodorized", "undepicted", "undeputized", "underaged", "underarmed", "underassessed", "underbred", "underbudgeted", "undercapitalised", "undercapitalized", "underdiagnosed", "underdocumented", "underequipped", "underexploited", "underexplored", "underfed", "underfeed", "underfurnished", "undergoverned", "undergrazed", "underinflated", "underinsured", "underinvested", "underived", "undermaintained", "undermentioned", "undermotivated", "underperceived", "underpowered", "underprivileged", "underqualified", "underrehearsed", "underresourced", "underripened", "undersaturated", "undersexed", "undersized", "underspecified", "understaffed", "understocked", "understressed", "understudied", "underutilised", "underventilated", "undescaled", "undesignated", "undetached", "undetailed", "undetained", "undeteriorated", "undeterred", "undetonated", "undevised", "undevoted", "undevoured", "undiagnosed", "undialed", "undialysed", "undialyzed", "undiapered", "undiffracted", "undigested", "undignified", "undiluted", "undiminished", "undimmed", "undipped", "undirected", "undisciplined", "undiscouraged", "undiscussed", "undisfigured", "undisguised", "undisinfected", "undismayed", "undisposed", "undisproved", "undisputed", "undisrupted", "undissembled", "undissipated", "undissociated", "undissolved", "undistilled", "undistorted", "undistracted", "undistributed", "undisturbed", "undiversified", "undiverted", "undivulged", "undoctored", "undocumented", "undomesticated", "undosed", "undramatised", "undrilled", "undrugged", "undubbed", "unduplicated", "uneclipsed", "unedged", "unedited", "unejaculated", "unejected", "unelaborated", "unelapsed", "unelected", "unelectrified", "unelevated", "unelongated", "unelucidated", "unemaciated", "unemancipated", "unemasculated", "unembalmed", "unembed", "unembellished", "unembodied", "unemboldened", "unemerged", "unenacted", "unencoded", "unencrypted", "unencumbered", "unendangered", "unendorsed", "unenergized", "unenfranchised", "unengraved", "unenhanced", "unenlarged", "unenlivened", "unenraptured", "unenriched", "unentangled", "unentitled", "unentombed", "unentranced", "unentwined", "unenumerated", "unenveloped", "unenvied", "unequaled", "unequalised", "unequalized", "unequalled", "unequipped", "unerased", "unerected", "uneroded", "unerupted", "unescorted", "unestablished", "unevaluated", "unexaggerated", "unexampled", "unexcavated", "unexceeded", "unexcelled", "unexecuted", "unexerted", "unexhausted", "unexpensed", "unexperienced", "unexpired", "unexploited", "unexplored", "unexposed", "unexpurgated", "unextinguished", "unfabricated", "unfaceted", "unfanned", "unfashioned", "unfathered", "unfathomed", "unfattened", "unfavored", "unfavoured", "unfazed", "unfeathered", "unfed", "unfeigned", "unfermented", "unfertilised", "unfertilized", "unfilleted", "unfiltered", "unfinished", "unflavored", "unflavoured", "unflawed", "unfledged", "unfleshed", "unflurried", "unflushed", "unflustered", "unfluted", "unfocussed", "unforested", "unformatted", "unformulated", "unfortified", "unfractionated", "unfractured", "unfragmented", "unfrequented", "unfretted", "unfrosted", "unfueled", "unfunded", "unfurnished", "ungarbed", "ungarmented", "ungarnished", "ungeared", "ungerminated", "ungifted", "unglazed", "ungoverned", "ungraded", "ungrasped", "ungratified", "ungroomed", "ungrounded", "ungrouped", "ungummed", "ungusseted", "unhabituated", "unhampered", "unhandicapped", "unhardened", "unharvested", "unhasped", "unhatched", "unheralded", "unhindered", "unhomogenised", "unhomogenized", "unhonored", "unhonoured", "unhooded", "unhusked", "unhyphenated", "unified", "unillustrated", "unimpacted", "unimpaired", "unimpassioned", "unimpeached", "unimpelled", "unimplemented", "unimpregnated", "unimprisoned", "unimpugned", "unincorporated", "unincubated", "unincumbered", "unindemnified", "unindexed", "unindicted", "unindorsed", "uninduced", "unindustrialised", "unindustrialized", "uninebriated", "uninfected", "uninflated", "uninflected", "uninhabited", "uninhibited", "uninitialised", "uninitialized", "uninitiated", "uninoculated", "uninseminated", "uninsulated", "uninsured", "uninterpreted", "unintimidated", "unintoxicated", "unintroverted", "uninucleated", "uninverted", "uninvested", "uninvolved", "unissued", "unjaundiced", "unjointed", "unjustified", "unkeyed", "unkindled", "unlabelled", "unlacquered", "unlamented", "unlaminated", "unlarded", "unlaureled", "unlaurelled", "unleaded", "unleavened", "unled", "unlettered", "unlicenced", "unlighted", "unlimbered", "unlimited", "unlined", "unlipped", "unliquidated", "unlithified", "unlittered", "unliveried", "unlobed", "unlocalised", "unlocalized", "unlocated", "unlogged", "unlubricated", "unmagnified", "unmailed", "unmaimed", "unmaintained", "unmalted", "unmangled", "unmanifested", "unmanipulated", "unmannered", "unmanufactured", "unmapped", "unmarred", "unmastered", "unmatriculated", "unmechanised", "unmechanized", "unmediated", "unmedicated", "unmentioned", "unmerged", "unmerited", "unmetabolised", "unmetabolized", "unmetamorphosed", "unmethylated", "unmineralized", "unmitigated", "unmoderated", "unmodernised", "unmodernized", "unmodified", "unmodulated", "unmolded", "unmolested", "unmonitored", "unmortgaged", "unmotivated", "unmotorised", "unmotorized", "unmounted", "unmutated", "unmutilated", "unmyelinated", "unnaturalised", "unnaturalized", "unnotched", "unnourished", "unobligated", "unobstructed", "unoccupied", "unoiled", "unopposed", "unoptimised", "unordained", "unorganised", "unorganized", "unoriented", "unoriginated", "unornamented", "unoxidized", "unoxygenated", "unpacified", "unpackaged", "unpaired", "unparalleled", "unparallelled", "unparasitized", "unpardoned", "unparodied", "unpartitioned", "unpasteurised", "unpasteurized", "unpatented", "unpaved", "unpedigreed", "unpenetrated", "unpenned", "unperfected", "unperjured", "unpersonalised", "unpersuaded", "unperturbed", "unperverted", "unpestered", "unphosphorylated", "unphotographed", "unpigmented", "unpiloted", "unpledged", "unploughed", "unplumbed", "unpoised", "unpolarized", "unpoliced", "unpolled", "unpopulated", "unposed", "unpowered", "unprecedented", "unpredicted", "unprejudiced", "unpremeditated", "unprescribed", "unpressurised", "unpressurized", "unpriced", "unprimed", "unprincipled", "unprivileged", "unprized", "unprocessed", "unprofaned", "unprofessed", "unprohibited", "unprompted", "unpronounced", "unproposed", "unprospected", "unproved", "unpruned", "unpublicised", "unpublicized", "unpublished", "unpuckered", "unpunctuated", "unpurified", "unqualified", "unquantified", "unquenched", "unquoted", "unranked", "unrated", "unratified", "unrebuked", "unreckoned", "unrecompensed", "unreconciled", "unreconstructed", "unrectified", "unredeemed", "unrefined", "unrefreshed", "unrefrigerated", "unregarded", "unregimented", "unregistered", "unregulated", "unrehearsed", "unrelated", "unrelieved", "unrelinquished", "unrenewed", "unrented", "unrepealed", "unreplicated", "unreprimanded", "unrequited", "unrespected", "unrestricted", "unretained", "unretarded", "unrevised", "unrevived", "unrevoked", "unrifled", "unripened", "unrivaled", "unrivalled", "unroasted", "unroofed", "unrounded", "unruffled", "unsalaried", "unsalted", "unsanctified", "unsanctioned", "unsanded", "unsaponified", "unsated", "unsatiated", "unsatisfied", "unsaturated", "unscaled", "unscarred", "unscathed", "unscented", "unscheduled", "unschooled", "unscreened", "unscripted", "unseamed", "unseared", "unseasoned", "unseeded", "unsegmented", "unsegregated", "unselected", "unserviced", "unsexed", "unshamed", "unshaped", "unsharpened", "unsheared", "unshielded", "unshifted", "unshirted", "unshoed", "unshuttered", "unsifted", "unsighted", "unsilenced", "unsimplified", "unsized", "unskewed", "unskinned", "unslaked", "unsliced", "unsloped", "unsmoothed", "unsoiled", "unsoldered", "unsolicited", "unsolved", "unsophisticated", "unsorted", "unsourced", "unsoured", "unspaced", "unspanned", "unspecialised", "unspecialized", "unspecified", "unspiced", "unstaged", "unstandardised", "unstandardized", "unstapled", "unstarched", "unstarred", "unstated", "unsteadied", "unstemmed", "unsterilised", "unsterilized", "unstickered", "unstiffened", "unstifled", "unstigmatised", "unstigmatized", "unstilted", "unstippled", "unstipulated", "unstirred", "unstocked", "unstoked", "unstoppered", "unstratified", "unstressed", "unstriped", "unstructured", "unstudied", "unstumped", "unsubdued", "unsubmitted", "unsubsidised", "unsubsidized", "unsubstantiated", "unsubstituted", "unsugared", "unsummarized", "unsupervised", "unsuprised", "unsurveyed", "unswayed", "unsweetened", "unsyllabled", "unsymmetrized", "unsynchronised", "unsynchronized", "unsyncopated", "unsyndicated", "unsynthesized", "unsystematized", "untagged", "untainted", "untalented", "untanned", "untaped", "untapered", "untargeted", "untarnished", "untattooed", "untelevised", "untempered", "untenanted", "unterminated", "untextured", "unthickened", "unthinned", "unthrashed", "unthreaded", "unthrottled", "unticketed", "untiled", "untilled", "untilted", "untimbered", "untinged", "untinned", "untinted", "untitled", "untoasted", "untoggled", "untoothed", "untopped", "untoughened", "untracked", "untrammeled", "untrammelled", "untranscribed", "untransduced", "untransferred", "untranslated", "untransmitted", "untraumatized", "untraversed", "untufted", "untuned", "untutored", "unupgraded", "unupholstered", "unutilised", "unutilized", "unuttered", "unvaccinated", "unvacuumed", "unvalidated", "unvalued", "unvandalized", "unvaned", "unvanquished", "unvapourised", "unvapourized", "unvaried", "unvariegated", "unvarnished", "unvented", "unventilated", "unverbalised", "unverbalized", "unverified", "unversed", "unvetted", "unvictimized", "unviolated", "unvitrified", "unvocalized", "unvoiced", "unwaged", "unwarped", "unwarranted", "unwaxed", "unweakened", "unweaned", "unwearied", "unweathered", "unwebbed", "unwed", "unwedded", "unweeded", "unweighted", "unwelded", "unwinterized", "unwired", "unwitnessed", "unwonted", "unwooded", "unworshipped", "unwounded", "unzoned", "uprated", "uprighted", "upsized", "upswelled", "vacuolated", "valanced", "valueoriented", "varied", "vascularised", "vascularized", "vasectomised", "vaunted", "vectorised", "vectorized", "vegged", "verdured", "verified", "vermiculated", "vernacularized", "versified", "verticillated", "vesiculated", "vied", "vilified", "virtualised", "vitrified", "vivified", "volumed", "vulcanised", "wabbled", "wafered", "waisted", "walleyed", "wared", "warmblooded", "warmhearted", "warted", "waterbased", "waterbed", "watercooled", "watersaturated", "watershed", "wavegenerated", "waxweed", "weakhearted", "weakkneed", "weakminded", "wearied", "weatherised", "weatherstriped", "webfooted", "wedgeshaped", "weed", "weeviled", "welladapted", "welladjusted", "wellbred", "wellconducted", "welldefined", "welldisposed", "welldocumented", "wellequipped", "wellestablished", "wellfavored", "wellfed", "wellgrounded", "wellintentioned", "wellmannered", "wellminded", "wellorganised", "wellrounded", "wellshaped", "wellstructured", "whinged", "whinnied", "whiplashed", "whiskered", "wholehearted", "whorled", "widebased", "wideeyed", "widemeshed", "widemouthed", "widenecked", "widespaced", "wilded", "wildered", "wildeyed", "willinghearted", "windspeed", "winterfed", "winterfeed", "winterised", "wirehaired", "wised", "witchweed", "woaded", "wombed", "wooded", "woodshed", "wooled", "woolled", "woollyhaired", "woollystemmed", "woolyhaired", "woolyminded", "wormholed", "wormshaped", "wrappered", "wretched", "wronghearted", "ycleped", "yolked", "zincified", "zinckified", "zinkified", "zombified"];
};



},{}],291:[function(require,module,exports){
"use strict";

module.exports = function () {
    return ["to", "which", "who", "whom", "that", "whose", "after", "although", "as", "because", "before", "even if", "even though", "how", "if", "in order that", "inasmuch", "lest", "once", "provided", "since", "so that", "than", "though", "till", "unless", "until", "when", "whenever", "where", "whereas", "wherever", "whether", "while", "why", "by the time", "supposing", "no matter", "how", "what", "won't", "do", "does", "–", "and", "but", "or"];
};



},{}],292:[function(require,module,exports){
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



},{}],293:[function(require,module,exports){
"use strict";
/** @module config/twoPartTransitionWords */
/**
 * Returns an array with two-part transition words to be used by the assessments.
 * @returns {Array} The array filled with two-part transition words.
 */

module.exports = function () {
  return [["both", "and"], ["if", "then"], ["not only", "but also"], ["neither", "nor"], ["either", "or"], ["not", "but"], ["whether", "or"], ["no sooner", "than"]];
};



},{}],294:[function(require,module,exports){
"use strict";
/** @module analyses/findKeywordInFirstParagraph */

var matchParagraphs = require("../stringProcessing/matchParagraphs.js");
var wordMatch = require("../stringProcessing/matchTextWithWord.js");
var escapeRegExp = require("lodash/escapeRegExp");
var reject = require("lodash/reject");
var isEmpty = require("lodash/isEmpty");
/**
 * Counts the occurrences of the keyword in the first paragraph, returns 0 if it is not found,
 * if there is no paragraph tag or 0 hits, it checks for 2 newlines, otherwise returns the keyword
 * count of the complete text.
 *
 * @param {Paper} paper The text to check for paragraphs.
 * @returns {number} The number of occurrences of the keyword in the first paragraph.
 */
module.exports = function (paper) {
  var paragraphs = matchParagraphs(paper.getText());
  var keyword = escapeRegExp(paper.getKeyword().toLocaleLowerCase());
  var paragraph = reject(paragraphs, isEmpty)[0] || "";
  return wordMatch(paragraph, keyword, paper.getLocale());
};



},{"../stringProcessing/matchParagraphs.js":365,"../stringProcessing/matchTextWithWord.js":368,"lodash/escapeRegExp":161,"lodash/isEmpty":181,"lodash/reject":202}],295:[function(require,module,exports){
"use strict";
/** @module analyses/findKeywordInPageTitle */

var wordMatch = require("../stringProcessing/matchTextWithWord.js");
var escapeRegExp = require("lodash/escapeRegExp");
/**
 * Counts the occurrences of the keyword in the pagetitle. Returns the number of matches
 * and the position of the keyword.
 *
 * @param {object} paper The paper containing title and keyword.
 * @returns {object} result with the matches and position.
 */
module.exports = function (paper) {
    var title = paper.getTitle();
    var keyword = escapeRegExp(paper.getKeyword());
    var locale = paper.getLocale();
    var result = { matches: 0, position: -1 };
    result.matches = wordMatch(title, keyword, locale);
    result.position = title.toLocaleLowerCase().indexOf(keyword);
    return result;
};



},{"../stringProcessing/matchTextWithWord.js":368,"lodash/escapeRegExp":161}],296:[function(require,module,exports){
"use strict";

var createRegexFromDoubleArray = require("../stringProcessing/createRegexFromDoubleArray.js");
var getSentences = require("../stringProcessing/getSentences.js");
var normalizeSingleQuotes = require("../stringProcessing/quotes.js").normalizeSingle;
var getTransitionWords = require("../helpers/getTransitionWords.js");
var matchWordInSentence = require("../stringProcessing/matchWordInSentence.js").isWordInSentence;
var forEach = require("lodash/forEach");
var filter = require("lodash/filter");
var memoize = require("lodash/memoize");
var createRegexFromDoubleArrayCached = memoize(createRegexFromDoubleArray);
/**
 * Matches the sentence against two part transition words.
 *
 * @param {string} sentence The sentence to match against.
 * @param {Array} twoPartTransitionWords The array containing two-part transition words.
 * @returns {Array} The found transitional words.
 */
var matchTwoPartTransitionWords = function matchTwoPartTransitionWords(sentence, twoPartTransitionWords) {
    sentence = normalizeSingleQuotes(sentence);
    var twoPartTransitionWordsRegex = createRegexFromDoubleArrayCached(twoPartTransitionWords);
    return sentence.match(twoPartTransitionWordsRegex);
};
/**
 * Matches the sentence against transition words.
 *
 * @param {string} sentence The sentence to match against.
 * @param {Array} transitionWords The array containing transition words.
 * @returns {Array} The found transitional words.
 */
var matchTransitionWords = function matchTransitionWords(sentence, transitionWords) {
    sentence = normalizeSingleQuotes(sentence);
    var matchedTransitionWords = filter(transitionWords, function (word) {
        return matchWordInSentence(word, sentence);
    });
    return matchedTransitionWords;
};
/**
 * Checks the passed sentences to see if they contain transition words.
 *
 * @param {Array} sentences The sentences to match against.
 * @param {Object} transitionWords The object containing both transition words and two part transition words.
 * @returns {Array} Array of sentence objects containing the complete sentence and the transition words.
 */
var checkSentencesForTransitionWords = function checkSentencesForTransitionWords(sentences, transitionWords) {
    var results = [];
    forEach(sentences, function (sentence) {
        var twoPartMatches = matchTwoPartTransitionWords(sentence, transitionWords.twoPartTransitionWords());
        if (twoPartMatches !== null) {
            results.push({
                sentence: sentence,
                transitionWords: twoPartMatches
            });
            return;
        }
        var transitionWordMatches = matchTransitionWords(sentence, transitionWords.transitionWords);
        if (transitionWordMatches.length !== 0) {
            results.push({
                sentence: sentence,
                transitionWords: transitionWordMatches
            });
            return;
        }
    });
    return results;
};
/**
 * Checks how many sentences from a text contain at least one transition word or two-part transition word
 * that are defined in the transition words config and two part transition words config.
 *
 * @param {Paper} paper The Paper object to get text from.
 * @returns {object} An object with the total number of sentences in the text
 * and the total number of sentences containing one or more transition words.
 */
module.exports = function (paper) {
    var locale = paper.getLocale();
    var transitionWords = getTransitionWords(locale);
    var sentences = getSentences(paper.getText());
    var sentenceResults = checkSentencesForTransitionWords(sentences, transitionWords);
    return {
        totalSentences: sentences.length,
        sentenceResults: sentenceResults,
        transitionWordSentences: sentenceResults.length
    };
};



},{"../helpers/getTransitionWords.js":262,"../stringProcessing/createRegexFromDoubleArray.js":353,"../stringProcessing/getSentences.js":359,"../stringProcessing/matchWordInSentence.js":369,"../stringProcessing/quotes.js":370,"lodash/filter":162,"lodash/forEach":167,"lodash/memoize":196}],297:[function(require,module,exports){
"use strict";
/**
 * Returns an array with exceptions for the sentence beginning researcher.
 * @returns {Array} The array filled with exceptions.
 */

module.exports = function () {
    return [
    // Definite articles:
    "le", "la", "les",
    // Indefinite articles:
    "un", "une",
    // Numbers 2-10 ('une' is already included in the indefinite articles):
    "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix",
    // Demonstrative pronouns:
    "celui", "celle", "ceux", "celles", "celui-ci", "celle-là", "celui-là", "celle-ci"];
};



},{}],298:[function(require,module,exports){
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
    // This export contains all of the above words.
    all: [].concat(articles, cardinalNumerals, ordinalNumerals, demonstrativePronouns, possessivePronouns, reflexivePronouns, personalPronounsNominative, personalPronounsAccusative, relativePronouns, quantifiers, indefinitePronouns, interrogativeProAdverbs, pronominalAdverbs, locativeAdverbs, otherAuxiliaries, otherAuxiliariesInfinitive, interrogativeAdjectives, copula, copulaInfinitive, prepositions, coordinatingConjunctions, correlativeConjunctions, subordinatingConjunctions, interviewVerbs, interviewVerbsInfinitive, transitionWords, additionalTransitionWords, intensifiers, delexicalizedVerbs, delexicalizedVerbsInfinitive, interjections, generalAdjectivesAdverbs, generalAdjectivesAdverbsPreceding, recipeWords, vagueNouns, miscellaneous, timeWords, titlesPreceding, titlesFollowing)
  };
};



},{"./transitionWords.js":299}],299:[function(require,module,exports){
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



},{}],300:[function(require,module,exports){
"use strict";
/** @module config/twoPartTransitionWords */
/**
 * Returns an array with two-part transition words to be used by the assessments.
 * @returns {Array} The array filled with two-part transition words.
 */

module.exports = function () {
  return [["à première vue", "mais à bien considérer les choses"], ["à première vue", "mais toute réflexion faite"], ["aussi", "que"], ["autant de", "que"], ["certes", "mais"], ["d'un côté", "de l'autre côté"], ["d'un côté", "de l'autre"], ["d'un côté", "d'un autre côté"], ["d'une part", "d'autre part"], ["d'une parte", "de l'autre parte"], ["moins de", "que"], ["non seulement", "mais aussi"], ["non seulement", "mais en outre"], ["non seulement", "mais encore"], ["plus de", "que"], ["quelque", "que"], ["si", "que"], ["soit", "soit"], ["tantôt", "tantôt"], ["tout d'abord", "ensuite"], ["tout", "que"]];
};



},{}],301:[function(require,module,exports){
"use strict";

var Participle = require("../../values/Participle.js");
var getIndices = require("../../stringProcessing/indices.js").getIndicesByWord;
var getIndicesOfList = require("../../stringProcessing/indices.js").getIndicesByWordList;
var exceptionsParticiplesActive = require("./passivevoice/exceptionsParticiplesActive.js")();
var auxiliaries = require("./passivevoice/auxiliaries.js")().participleLike;
var exceptionsRegex = /\S+(apparat|arbeit|dienst|haft|halt|keit|kraft|not|pflicht|schaft|schrift|tät|wert|zeit)($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig;
var includes = require("lodash/includes");
var map = require("lodash/map");
/**
 * Creates an Participle object for the English language.
 *
 * @param {string} participle The participle.
 * @param {string} sentencePart The sentence part that contains the participle.
 * @param {object} attributes  The attributes object.
 *
 * @constructor
 */
var GermanParticiple = function GermanParticiple(participle, sentencePart, attributes) {
    Participle.call(this, participle, sentencePart, attributes);
    this.setSentencePartPassiveness(this.isPassive());
};
require("util").inherits(GermanParticiple, Participle);
/**
 * Checks if the text is passive based on the participle exceptions.
 *
 * @returns {boolean} Returns true if there is no exception, and the sentence is passive.
 */
GermanParticiple.prototype.isPassive = function () {
    return !this.hasNounSuffix() && !this.isInExceptionList() && !this.hasHabenSeinException() && !this.isAuxiliary();
};
/**
 * Checks whether a found participle is in the exception list.
 * If a word is in the exceptionsParticiplesActive list, it isn't a participle.
 *
 * @returns {boolean} Returns true if it is in the exception list, otherwise returns false.
 */
GermanParticiple.prototype.isInExceptionList = function () {
    return includes(exceptionsParticiplesActive, this.getParticiple());
};
/**
 * Checks whether a found participle ends in a noun suffix.
 * If a word ends in a noun suffix from the exceptionsRegex, it isn't a participle.
 *
 * @returns {boolean} Returns true if it ends in a noun suffix, otherwise returns false.
 */
GermanParticiple.prototype.hasNounSuffix = function () {
    return this.getParticiple().match(exceptionsRegex) !== null;
};
/**
 * Checks whether a participle is followed by 'haben' or 'sein'.
 * If a participle is followed by one of these, the sentence is not passive.
 *
 * @returns {boolean} Returns true if it is an exception, otherwise returns false.
 */
GermanParticiple.prototype.hasHabenSeinException = function () {
    var participleIndices = getIndices(this.getParticiple(), this.getSentencePart());
    var habenSeinIndices = getIndicesOfList(["haben", "sein"], this.getSentencePart());
    if (participleIndices.length > 0 && habenSeinIndices.length === 0) {
        return false;
    }
    habenSeinIndices = map(habenSeinIndices, "index");
    var currentParticiple = participleIndices[0];
    return includes(habenSeinIndices, currentParticiple.index + currentParticiple.match.length + 1);
};
/**
 * Checks whether a found participle is an auxiliary.
 * If a word is an auxiliary, it isn't a participle.
 *
 * @returns {boolean} Returns true if it is an auxiliary, otherwise returns false.
 */
GermanParticiple.prototype.isAuxiliary = function () {
    return includes(auxiliaries, this.getParticiple());
};
module.exports = GermanParticiple;



},{"../../stringProcessing/indices.js":364,"../../values/Participle.js":390,"./passivevoice/auxiliaries.js":307,"./passivevoice/exceptionsParticiplesActive.js":308,"lodash/includes":173,"lodash/map":195,"util":224}],302:[function(require,module,exports){
"use strict";

var SentencePart = require("../../values/SentencePart.js");
var getParticiples = require("./passivevoice/getParticiples.js");
/**
 * Creates a German specific sentence part.
 *
 * @param {string} sentencePartText The text from the sentence part.
 * @param {Array} auxiliaries The list with auxiliaries.
 * @constructor
 */
var GermanSentencePart = function GermanSentencePart(sentencePartText, auxiliaries) {
  SentencePart.call(this, sentencePartText, auxiliaries, "de_DE");
};
require("util").inherits(GermanSentencePart, SentencePart);
/**
 * Returns the participles found in the sentence part.
 *
 * @returns {Array} The array of Participle Objects.
 */
GermanSentencePart.prototype.getParticiples = function () {
  return getParticiples(this.getSentencePartText(), this.getAuxiliaries());
};
module.exports = GermanSentencePart;



},{"../../values/SentencePart.js":392,"./passivevoice/getParticiples.js":309,"util":224}],303:[function(require,module,exports){
"use strict";

var arrayToRegex = require("../../stringProcessing/createRegexFromArray.js");
var auxiliaries = require("./passivevoice/auxiliaries.js")().allAuxiliaries;
var getParticiples = require("./passivevoice/getParticiples.js");
var determineSentencePartIsPassive = require("../passivevoice/determineSentencePartIsPassive.js");
var auxiliaryRegex = arrayToRegex(auxiliaries);
/**
 * Determines whether a sentence part is passive.
 *
 * @param {string} sentencePartText The sentence part to determine voice for.
 * @param {Array} auxiliaries A list with auxiliaries in this sentence part.
 * @returns {boolean} Returns true if passive, otherwise returns false.
 */
module.exports = function (sentencePartText, auxiliaries) {
    var passive = false;
    var auxiliaryMatches = sentencePartText.match(auxiliaryRegex);
    if (auxiliaryMatches === null) {
        return passive;
    }
    var participles = getParticiples(sentencePartText, auxiliaries);
    return determineSentencePartIsPassive(participles);
};



},{"../../stringProcessing/createRegexFromArray.js":352,"../passivevoice/determineSentencePartIsPassive.js":335,"./passivevoice/auxiliaries.js":307,"./passivevoice/getParticiples.js":309}],304:[function(require,module,exports){
"use strict";
/**
 * Returns an array with exceptions for the sentence beginning researcher.
 * @returns {Array} The array filled with exceptions.
 */

module.exports = function () {
    return [
    // Definite articles:
    "das", "dem", "den", "der", "des", "die",
    // Indefinite articles:
    "ein", "eine", "einem", "einen", "einer", "eines",
    // Numbers 1-10:
    "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn",
    // Demonstrative pronouns:
    "denen", "deren", "derer", "dessen", "diese", "diesem", "diesen", "dieser", "dieses", "jene", "jenem", "jenen", "jener", "jenes", "welch", "welcher", "welches"];
};



},{}],305:[function(require,module,exports){
"use strict";

var filteredPassiveAuxiliaries = require("./passivevoice/auxiliaries.js")().filteredAuxiliaries;
var passiveAuxiliariesInfinitive = require("./passivevoice/auxiliaries.js")().infinitiveAuxiliaries;
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



},{"./passivevoice/auxiliaries.js":307,"./transitionWords.js":313}],306:[function(require,module,exports){
"use strict";

var stopwords = require("./passivevoice/stopwords.js")();
var arrayToRegex = require("../../stringProcessing/createRegexFromArray.js");
var stripSpaces = require("../../stringProcessing/stripSpaces.js");
var SentencePart = require("./SentencePart.js");
var auxiliaries = require("./passivevoice/auxiliaries.js")().allAuxiliaries;
var forEach = require("lodash/forEach");
var isEmpty = require("lodash/isEmpty");
var map = require("lodash/map");
var stopwordRegex = arrayToRegex(stopwords);
var auxiliaryRegex = arrayToRegex(auxiliaries);
/**
 * Strips spaces from the auxiliary matches.
 *
 * @param {Array} matches A list with matches of auxiliaries.
 * @returns {Array} A list with matches with spaces removed.
 */
function sanitizeMatches(matches) {
    return map(matches, function (match) {
        return stripSpaces(match);
    });
}
/**
 * Splits sentences into sentence parts based on stopwords.
 *
 * @param {string} sentence The sentence to split.
 * @param {Array} stopwords The array with matched stopwords.
 * @returns {Array} The array with sentence parts.
 */
function splitOnWords(sentence, stopwords) {
    var splitSentences = [];
    // Split the sentence on each found stopword and push this part in an array.
    forEach(stopwords, function (stopword) {
        var splitSentence = sentence.split(stopword);
        if (!isEmpty(splitSentence[0])) {
            splitSentences.push(splitSentence[0]);
        }
        var startIndex = sentence.indexOf(stopword);
        var endIndex = sentence.length;
        sentence = stripSpaces(sentence.substr(startIndex, endIndex));
    });
    // Push the remainder of the sentence in the sentence parts array.
    splitSentences.push(sentence);
    return splitSentences;
}
/**
 * Creates sentence parts based on split sentences.
 *
 * @param {Array} sentences The array with split sentences.
 * @returns {Array} The array with sentence parts.
 */
function createSentenceParts(sentences) {
    var sentenceParts = [];
    forEach(sentences, function (part) {
        var foundAuxiliaries = sanitizeMatches(part.match(auxiliaryRegex || []));
        sentenceParts.push(new SentencePart(part, foundAuxiliaries, "de_DE"));
    });
    return sentenceParts;
}
/**
 * Splits the sentence into sentence parts based on stopwords.
 *
 * @param {string} sentence The text to split into sentence parts.
 * @returns {Array} The array with sentence parts.
 */
function splitSentence(sentence) {
    var stopwords = sentence.match(stopwordRegex) || [];
    var splitSentences = splitOnWords(sentence, stopwords);
    return createSentenceParts(splitSentences);
}
/**
 * Splits up the sentence in parts based on German stopwords.
 *
 * @param {string} sentence The sentence to split up in parts.
 * @returns {Array} The array with the sentence parts.
 */
module.exports = function (sentence) {
    return splitSentence(sentence);
};



},{"../../stringProcessing/createRegexFromArray.js":352,"../../stringProcessing/stripSpaces.js":380,"./SentencePart.js":302,"./passivevoice/auxiliaries.js":307,"./passivevoice/stopwords.js":312,"lodash/forEach":167,"lodash/isEmpty":181,"lodash/map":195}],307:[function(require,module,exports){
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



},{}],308:[function(require,module,exports){
"use strict";
// This is a list of words that look like a participle, but aren't participles.

module.exports = function () {
    return ["geht", "gämsbart", "gemsbart", "geäst", "gebarungsbericht", "geähnelt", "geartet", "gebäudetrakt", "gebet", "gebiet", "gebietsrepräsentant", "gebildbrot", "gebirgsart", "gebirgsgrat", "gebirgskurort", "gebirgsluft", "gebirgsschlucht", "geblüt", "geblütsrecht", "gebohntkraut", "gebot", "gebrauchsgut", "gebrauchstext", "gebrauchsverlust", "gebrauchtgerät", "gebrauchtwagengeschäft", "gebrauchtwagenmarkt", "geburt", "geburtsakt", "geburtsgeschwulst", "geburtsgewicht", "geburtsort", "geburtsrecht", "geburtsstadt", "geburtstagsfest", "geckenart", "gedächtniskonzert", "gedächtniskunst", "gedächtnisverlust", "gedankenarmut", "gedankenexperiment", "gedankenflucht", "gedankengut", "gedankenschritt", "gedankenwelt", "gedenkkonzert", "gedicht", "geest", "gefahrengebiet", "gefahrenmoment", "gefahrenpunkt", "gefahrgut", "gefahrguttransport", "gefährt", "gefälligkeitsakzept", "gefallsucht", "gefangenenanstalt", "gefangenentransport", "gefängnisarzt", "gefängniskluft", "gefäßnaht", "gefecht", "gefechtsabschnitt", "gefechtsbereit", "gefechtsgebiet", "gefechtsgewicht", "gefechtshut", "gefechtsmast", "gefechtsmast", "geflecht", "geflügelaufzucht", "geflügelleberwurst", "geflügelmarkt", "geflügelmast", "geflügelpest", "geflügelsalat", "geflügelwurst", "geflügelzucht", "gefolgsleute", "gefrett", "gefriergerät", "gefriergut", "gefrierobst", "gefrierpunkt", "gefrierschnitt", "gefühlsarmut", "gefühlswelt", "gegenangebot", "gegenansicht", "gegenargument", "gegengeschäft", "gegengewalt", "gegengewicht", "gegenkandidat", "gegenkompliment", "gegenkonzept", "gegenlicht", "gegenmacht", "gegenpapst", "gegenpart", "gegensatzwort", "gegenstandpunkt", "gegenstandsgebiet", "gegenwart", "gegenwartskunst", "gegenwelt", "gegenwort", "gehaart", "gehandicapt", "gehandikapt", "geheimagent", "geheimbericht", "geheimdokument", "geheimfavorit", "geheimkontakt", "geheimkult", "geheimnisverrat", "geheimpolizist", "geheimrat", "geheimrezept", "geheimtext", "gehirnakrobat", "gehirngeschwulst", "gehirnhaut", "gehirnsandgeschwulst", "gehirntot", "gehirntrust", "gehöft", "gehörlosensport", "geigenkonzert", "geißbart", "geißblatt", "geißhirte", "geißhirt", "geist", "geisterfahrt", "geisterstadt", "geisterwelt", "geistesarmut", "geistesart", "geistesfürst", "geistesgegenwart", "geistesgestört", "geistesprodukt", "geistestat", "geistesverwandt", "geisteswelt", "geklüft", "geländefahrt", "geländeritt", "geländesport", "gelangweilt", "gelaut", "geläut", "gelblicht", "gelbrost", "gelbsucht", "gelbwurst", "gelcoat", "geldausgabeautomat", "geldautomat", "geldgeschäft", "geldheirat", "geldinstitut", "geldmarkt", "geldsurrogat", "geldtransport", "geldverlust", "gelehrtenstreit", "gelehrtenwelt", "geleit", "geleitboot", "geleitwort", "gelenkgicht", "gelenkwassersucht", "geleucht", "geltungssucht", "gelüst", "gemächt", "gemeindeamt", "gemeindebürgerrecht", "gemeindegut", "gemeindekirchenrat", "gemeindepräsident", "gemeinderat", "gemeingeist", "gemeingut", "gemeinschaftsgeist", "gemeinschaftsprojekt", "gemeinschaftsunterkunft", "gemengesaat", "gemüseart", "gemüsebeet", "gemüsegeschäft", "gemüsemarkt", "gemüsesaft", "gemüsesalat", "gemüsezucht", "gemüt", "gemütsarmut", "gemütsart", "gemütsathlet", "gemütskalt", "genausogut", "genausooft", "genausoweit", "gendefekt", "generalagent", "generalarzt", "generalat", "generalbassinstrument", "generalbaßinstrument", "generalbundesanwalt", "generalgouvernement", "generalintendant", "generalist", "generalkonsulat", "generalleutnant", "generaloberst", "generalresident", "generalsekretariat", "generalstaaten", "generalstaatsanwalt", "generalsuperintendent", "generalüberholt", "generalvikariat", "generalvollmacht", "generationenkonflikt", "generativist", "genist", "genitivattribut", "genitivobjekt", "genmanipuliert", "gennesaret", "genotzüchtigt", "gent", "genuasamt", "genussgift", "genußgift", "genusssucht", "genuss-sucht", "genußsucht", "genverändert", "geobiont", "geodät", "geografieunterricht", "geographieunterricht", "geokrat", "geophyt", "gepäckfracht", "geradeausfahrt", "geradesogut", "gefälligst", "gerant", "gerät", "gerätewart", "geräuschlaut", "gerbextrakt", "gericht", "gerichtsarzt", "gerichtsort", "gerichtspräsident", "germanisiert", "germanist", "germanistikstudent", "gerodelt", "geröllschicht", "geröllschutt", "geront", "gerontokrat", "gerstenbrot", "gerstensaft", "gerstenschrot", "gerücht", "gerüst", "gesamtansicht", "gesamtaspekt", "gesamtdurchschnitt", "gesamtgewicht", "gesamtgut", "gesamt", "gesamtklassement", "gesamtunterricht", "gesandtschaftsrat", "gesangskunst", "gesangspart", "gesangssolist", "gesangsunterricht", "gesangunterricht", "geschäft", "geschäftsaufsicht", "geschäftsbericht", "geschäftsgeist", "geschäftswelt", "geschenkpaket", "geschichtsunterricht", "geschicklichkeitstest", "geschicklichkeitstest", "geschlecht", "geschlechtsakt", "geschlechtslust", "geschlechtsprodukt", "geschlechtswort", "geschmackstest", "geschwindigkeitslimit", "geschworenengericht", "geschwulst", "gesellschaftsfahrt", "gesellschaftsschicht", "gesetzblatt", "gesetzespaket", "gesetzestext", "gesicht", "gesichtshaut", "gesichtspunkt", "gesichtsschnitt", "gesichtsverlust", "gespenst", "gespensterfurcht", "gespinst", "gespött", "gesprächstherapeut", "gestalt", "gestaltungselement", "gesteinsart", "gesteinschutt", "gesteinsschicht", "gestüt", "gestüthengst", "verantwortungsbewusst", "verantwortungsbewußt", "getast", "getränkeabholmarkt", "getränkeautomat", "getränkemarkt", "getreideart", "getreideaussaat", "getreideexport", "getreideimport", "getreideprodukt", "getreideschnitt", "getreidevorrat", "gewährfrist", "gewalt", "gewaltakt", "gewaltbereit", "gewalttat", "gesprächsbereit", "gewaltverbot", "gewaltverzicht", "gewässerbett", "gewässerwart", "gewebeschicht", "gewebsrest", "gewicht", "gewichtsprozent", "gewichtsverlust", "gewerbeamt", "gewerbearzt", "gewerbeaufsicht", "gewerbeaufsichtsamt", "gewerbegebiet", "gewerberecht", "gewerbsunzucht", "gewerkschaft", "gewerkschaftsjournalist", "gewindestift", "gewinnsucht", "gewinst", "gewissensangst", "gewissenskonflikt", "gewitterfront", "gewitterluft", "gewohnheitsrecht", "gewürzextrakt", "gewürzkraut", "gezücht", "erbbaurecht", "erbfolgerecht", "erbfolgestreit", "erbgut", "erbhofrecht", "erblast", "erbpacht", "erbrecht", "erbschaftsstreit", "erbsenkraut", "erbbedingt", "erbberechtigt", "erblasst", "erblaßt", "erbswurst", "erbverzicht", "erbwort", "erbzinsgut", "erdbebengebiet", "erdbeerjogurt", "erdbeerjoghurt", "erdbeeryoghurt", "erdbeerkompott", "erdbeerrot", "erdbeersaft", "erdbeersekt", "erdengut", "erdenlust", "erdfrucht", "erdgeist", "erdkundeunterricht", "erdlicht", "erdmittelpunkt", "erdnussfett", "erdölprodukt", "erdölproduzent", "erdsatellit", "erdschicht", "erdsicht", "erdtrabant", "erdverhaftet", "eremit", "erfahrungsbericht", "erfahrungshorizont", "erfahrungswelt", "erfindergeist", "erfolgsaussicht", "erfolgsorientiert", "erfolgsrezept", "erfolgsverwöhnt", "erfüllungsort", "erfurt", "ergänzungsheft", "ergänzungssport", "ergänzungstest", "ergostat", "ergotherapeut", "erholungsgebiet", "erholungsort", "erkundungsfahrt", "erlaucht", "erläuterungstext", "erlebnisbericht", "erlebnisorientiert", "erlebniswelt", "ernährungsamt", "ernst", "ernstgemeint", "ernteaussicht", "erntedankfest", "erntefest", "erntemonat", "ernteresultat", "eroberungsabsicht", "eroberungsgeist", "eroberungslust", "eroberungssucht", "eröffnungskonzert", "ersatzgeschwächt", "ersatzgut", "ersatzkandidat", "ersatzobjekt", "ersatzpräparat", "ersatzreservist", "ersatztorwart", "erscheinungsfest", "erscheinungsort", "erscheinungswelt", "erschließungsgebiet", "erst", "erstbundesligist", "erstfahrt", "erstgebot", "erstgeburt", "erstgeburtsrecht", "erstklassbillett", "erstklaßbillett", "erstkommunikant", "erstkonsument", "erstligist", "erstplatziert", "erstplaciert", "erstplaziert", "erstrecht", "ertragsaussicht", "erwartungsangst", "erwartungshorizont", "erwerbseinkünfte", "erythrit", "erythroblast", "erythrozyt", "erzählertalent", "erzählgut", "erzählkunst", "erzähltalent", "erzamt", "erzdemokrat", "erzeugungsschlacht", "erzfaschist", "erziehungsanstalt", "erziehungsberechtigt", "erziehungsinstitut", "erzkommunist", "erzprotestant", "veranlassungswort", "veranschaulicht", "veranschlagt", "verantwortungsbewusst", "verantwortungsbewußt", "veräußerungsverbot", "verbalist", "verbalkontrakt", "verbändestaat", "verbannungsort", "verbildlicht", "verbindungspunkt", "verbindungsstudent", "verbraucherkredit", "verbrauchermarkt", "verbrauchsgut", "verbrechernest", "verbrechersyndikat", "verbrecherwelt", "verbreitungsgebiet", "verbrennungsprodukt", "verdachtsmoment", "verdampfungsgerät", "verdauungstrakt", "verdikt", "veredelungsprodukt", "verehrerpost", "vereinspräsident", "vereinsrecht", "vereinssport", "verfahrensrecht", "verfassungsfahrt", "verfassungsgericht", "verfassungsrecht", "verfassungsstaat", "verfolgungsrecht", "verfremdungseffekt", "verfügungsgewalt", "verfügungsrecht", "verfügungsberechtigt", "verführungskunst", "vergegenständlicht", "vergegenwärtigt", "vergeltungsakt", "vergenossenschaftlicht", "vergissmeinnicht", "vergißmeinnicht", "vergleichsmonat", "vergleichsobjekt", "vergleichspunkt", "vergnügungsetablissement", "vergnügungsfahrt", "vergnügungssucht", "vergrößerungsgerät", "verhaltensgestört", "verhältniswahlrecht", "verhältniswort", "verhandlungsangebot", "verhandlungsbereit", "versandbereit", "verteidigungsbereit", "verhandlungsmandat", "verhandlungsort", "verhandlungspunkt", "verhöramt", "verist", "verjährungsfrist", "verkaufsagent", "verkaufsangebot", "verkaufsargument", "verkaufsautomat", "verkaufsfront", "verkaufshit", "verkaufsobjekt", "verkaufsorientiert", "verkaufspunkt", "verkehrsamt", "verkehrsdelikt", "verkehrsinfarkt", "verkehrsknotenpunkt", "verkehrslicht", "verkehrsnachricht", "verkehrspolizist", "verkehrsrecht", "verkehrsunterricht", "verkehrsverbot", "verklarungsbericht", "verknüpfungspunkt", "verkündungsblatt", "verlagsanstalt", "verlagsprospekt", "verlagsrecht", "verlagsrepräsentant", "verlagssignet", "verlust", "verlustgeschäft", "verlust", "verlustgeschäft", "verlustpunkt", "vermessungsamt", "vermittlungsamt", "vermögensrecht", "vermont", "vermummungsverbot", "verneinungswort", "vernichtungswut", "vernunft", "vernunftheirat", "verordnungsblatt", "verpackungsflut", "verpflichtungsgeschäft", "verrat", "versammlungsort", "versammlungsrecht", "versandgeschäft", "versandgut", "versart", "verschlusslaut", "verschnitt", "verschwendungssucht", "versehrtensport", "versicherungsagent", "versicherungsanstalt", "versicherungsrecht", "verskunst", "versöhnungsfest", "versorgungsamt", "versorgungsberechtigt", "versorgungsgebiet", "versorgungsgut", "versorgungsstaat", "verstakt", "verständigungsbereit", "verstellungskunst", "verstürznaht", "versuchsanstalt", "versuchsobjekt", "versuchsprojekt", "vertebrat", "verteidigungsbudget", "verteidigungsetat", "verteidigungspakt", "verteilungskonflikt", "verteilungszahlwort", "vertikalschnitt", "vertikutiergerät", "vertragsgerecht", "vertragspunkt", "vertragsrecht", "vertragsstaat", "vertragstext", "vertragswerkstatt", "vertrauensanwalt", "vertrauensarzt", "vertrauensverlust", "vertriebsrecht", "vervielfältigungsrecht", "vervielfältigungszahlwort", "verwaltungsakt", "verwaltungsgericht", "verwaltungsrat", "verwaltungsrecht", "verwundetentransport", "verzicht", "verzweiflungsakt", "verzweiflungstat", "entbindungsanstalt", "entdeckungsfahrt", "entenbrust", "entenfett", "entertainment", "enthusiast", "entlastungsmoment", "entlüftungsschacht", "entnazifizierungsgericht", "entoblast", "entoparasit", "entrechat", "entrefilet", "entrepot", "entscheidungsfurcht", "entscheidungsgewalt", "entscheidungsrecht", "entscheidungsschlacht", "entstehungsort", "entsteht", "entwässerungsschacht", "entwicklungsabschnitt", "entwicklungsinstitut", "entwicklungsprojekt", "entwicklungsschritt", "entziehungsanstalt", "zerat", "zerebrallaut", "zerfallsprodukt", "zergliederungskunst", "zerit", "zermatt", "zersetzungsprodukt", "zerstörungslust", "zerstörungswut", "zertifikat", "zerussit", "zervelat", "zervelatwurst", "beamtenrecht", "beamtenschicht", "beamtenstaat", "beat", "beatmungsgerät", "beaufort", "becherfrucht", "beckengurt", "becquereleffekt", "bedarfsgut", "bedenkfrist", "bedienungselement", "bedienungsgerät", "bedienungskomfort", "bedingtgut", "bedürfnisanstalt", "beeinflusst", "beeinflußt", "beerdigungsanstalt", "beerdigungsinstitut", "beerenfrucht", "beerenobst", "beerensaft", "beet", "befasst", "befaßt", "befehlsgewalt", "beförderungsentgelt", "beförderungsrecht", "begabungstest", "begegnungsort", "begleitinstrument", "begleittext", "begleitwort", "begnadigungsrecht", "begräbt", "begrenzungslicht", "begriffswelt", "begriffswort", "begrüßungswort", "behaviorist", "behebungsfrist", "behelfsausfahrt", "behelfsunterkunft", "behindertengerecht", "behindertensport", "behindertentransport", "behmlot", "beiblatt", "beiboot", "beignet", "beiheft", "beikost", "beilast", "beileidswort", "beinamputiert", "beinhaut", "beirat", "beirut", "beistandskredit", "beistandspakt", "beitritt", "beitrittsabsicht", "beitrittsgebiet", "beiwacht", "beiwort", "beizgerät", "bekehrungswut", "bekennergeist", "bekennermut", "bekleidungsamt", "bekommen", "belegarzt", "belegbett", "belegfrist", "belehrungssucht", "belemnit", "belesprit", "beleuchtungseffekt", "beleuchtungsgerät", "belfast", "belkantist", "belcantist", "belletrist", "bellizist", "belt", "benedikt", "benediktenkraut", "benefiziant", "benefiziat", "benefizkonzert", "beneluxstaat", "bentonit", "benzindunst", "beratungspunkt", "bereit", "bereicherungsabsicht", "bereitschaftsarzt", "bergamt", "bergeslast", "bergfahrt", "bergfest", "berggeist", "berggrat", "bergluft", "bergpredigt", "bergsport", "berg-und-Tal-Fahrt", "bergwacht", "bergwelt", "bericht", "berichtsmonat", "beritt", "bermudashort", "bernbiet", "berserkerwut", "berufsaussicht", "berufssoldat", "berufssport", "berufsstart", "berufstracht", "berufsverbot", "berufungsfrist", "berufungsgericht", "berufungsrecht", "berührungsangst", "berührungspunkt", "besanmast", "besatzungsgebiet", "besatzungsmacht", "besatzungsrecht", "besatzungssoldat", "besatzungsstatut", "beschaffungsamt", "beschäftigungstherapeut", "beschlächt", "beschlussrecht", "beschlußrecht", "beschmet", "beschneidungsfest", "beschlächt", "beschlussrecht", "beschlußrecht", "beschmet", "beschneidungsfest", "beschwerdefrist", "beschwerderecht", "beschwörungskunst", "beseitigungsanstalt", "besetzungsgebiet", "besetzungsmacht", "besetzungsstatut", "besichtigungsfahrt", "besitzrecht", "besoldungsrecht", "besprechungspunkt", "besserungsanstalt", "bestattungsinstitut", "bestimmungsort", "bestimmungswort", "bestinformiert", "bestqualifiziert", "bestrahlungsgerät", "bestrenommiert", "bestsituiert", "bestverkauft", "besucherrat", "besuchsrecht", "betpult", "betracht", "betreibungsamt", "betriebsarzt", "betriebsfest", "betriebsrat", "betriebswirt", "bett", "bettelmusikant", "bettelvogt", "bettstatt", "bettwurst", "beulenpest", "beutegut", "beutekunst", "beuterecht", "bevölkerungsschicht", "bewahranstalt", "bewährungsfrist", "bewegungsarmut", "beweislast", "bewußt", "bewusst", "beziehungsgeflecht", "bezirksamt", "bezirksarzt", "bezirksgericht", "bezirkskabinett", "bezirksschulrat", "bezirksstadt", "bezugspunkt", "bezugsrecht", "heraklit", "herat", "herbalist", "herbst", "herbstmonat", "herbstpunkt", "herdbuchzucht", "herdeninstinkt", "herfahrt", "heringsfilet", "heringssalat", "herkuleskraut", "herkunft", "herkunftsort", "hermaphrodit", "heroenkult", "heroinsucht", "heroldsamt", "heroldskunst", "herostrat", "herrenabfahrt", "herrenbrot", "herrendienst", "herrenfest", "herrenhut", "herrenrecht", "herrenschnitt", "herrenwelt", "herrgott", "herrnhut", "herrschaftsgebiet", "herrschaftsgewalt", "herrschaftsinstrument", "herrschergeschlecht", "herrscherkult", "herrschsucht", "herstellungsart", "herzacht", "herzangst", "herzblatt", "herzblut", "herzensangst", "herzensgut", "herzenslust", "herzenstrost", "herzgeliebt", "herzinfarkt", "herzinnenhaut", "herzklappendefekt", "herzogshut", "herzlichst", "herzpatient", "herzpunkt", "herzspezialist", "überbackt", "ueberbackt", "überbacktet", "ueberbacktet", "überbietet", "ueberbietet", "überbot", "ueberbot", "überbotet", "ueberbotet", "überbindet", "ueberbindet", "überbandet", "ueberbandet", "überbläst", "ueberblaest", "überbliest", "ueberbliest", "überbrät", "ueberbraet", "überbratet", "ueberbratet", "überbriet", "ueberbriet", "überbrietet", "ueberbrietet", "überbringt", "ueberbringt", "überbrachtet", "ueberbrachtet", "überbrücktet", "ueberbruecktet", "überbrühtet", "ueberbrühtet", "überbrülltet", "ueberbruelltet", "überbuchtet", "ueberbuchtet", "überbürdetet", "ueberbuerdetet", "überdecktet", "ueberdecktet", "überdehntet", "ueberdehntet", "überdenkt", "ueberdenkt", "überdachtet", "ueberdachtet", "überdosiertet", "ueberdosiertet", "überdrehtet", "ueberdrehtet", "überdrucktet", "ueberdrucktet", "überdüngtet", "ueberdüngtet", "übereignetet", "uebereignetet", "übereiltet", "uebereiltet", "übererfülltet", "uebererfuelltet", "überißt", "ueberisst", "ueberißt", "überisst", "überesst", "ueberesst", "übereßt", "uebereßt", "überaßt", "ueberaßt", "überesset", "ueberesset", "überäßet", "ueberaesset", "überfährt", "ueberfaehrt", "überfahrt", "ueberfahrt", "überfuhrt", "ueberfuhrt", "überfällt", "ueberfaellt", "überfallet", "ueberfallet", "überfielt", "ueberfielt", "überfielet", "ueberfielet", "überfängt", "ueberfaengt", "überfingt", "ueberfingt", "überfinget", "ueberfinget", "überfärbet", "ueberfaerbet", "überfettetet", "ueberfettetet", "überfirnisset", "ueberfirnisset", "überfirnißtet", "ueberfirnisstet", "überfischet", "ueberfischet", "überfischtet", "ueberfischtet", "überflanktet", "ueberflanktet", "überflanktet", "ueberflanktet", "überfliegt", "ueberfliegt", "überflieget", "ueberflieget", "überflöget", "ueberflöget", "überflösset", "ueberfloesset", "überflosst", "ueberflosst", "überfloßt", "ueberflosst", "überfließt", "ueberfliesst", "überflutetet", "ueberflutetet", "überformet", "ueberformet", "überformtet", "ueberformtet", "überfrachtetet", "ueberfrachtetet", "überfracht", "ueberfracht", "überfraget", "ueberfraget", "überfragtet", "ueberfragtet", "überfremdetet", "ueberfremdetet", "überfrisst", "ueberfrisst", "überfrißt", "ueberfrißt", "überfresst", "ueberfresst", "überfreßt", "ueberfreßt", "überfresset", "ueberfresset", "überfraßt", "ueberfraßt", "ueberfrasst", "überfräßet", "ueberfraesset", "überfriert", "ueberfriert", "überfrieret", "ueberfrieret", "überfrort", "ueberfrort", "überfröret", "ueberfroeret", "überfrört", "ueberfroert", "überführet", "ueberfuehret", "überführtet", "ueberfuehrtet", "überfüllet", "ueberfuellet", "übergibt", "uebergibt", "übergebt", "uebergebt", "übergebet", "uebergebet", "übergabt", "uebergabt", "übergäbet", "uebergaebet", "übergäbt", "uebergaebt", "übergeht", "uebergeht", "übergehet", "uebergehet", "übergingt", "uebergingt", "übergewichtetet", "uebergewichtetet", "übergießet", "uebergiesset", "übergießt", "uebergiesst", "übergösset", "uebergoesset", "übergosst", "uebergosst", "uebergoßt", "übergipset", "uebergipset", "übergipstet", "uebergipstet", "übergipset", "uebergipset", "übergipstet", "uebergipstet", "überglänzet", "ueberglaenzet", "überglänztet", "ueberglaenztet", "überglaset", "ueberglaset", "überglastet", "ueberglastet", "überglühet", "uebergluehet", "überglühtet", "uebergluehtet", "übergoldetet", "uebergoldetet", "übergraset", "uebergraset", "übergrastet", "uebergrastet", "übergrätschet", "uebergraetschet", "übergrätschtet", "uebergraetschtet", "übergreift", "uebergreift", "übergreifet", "uebergreifet", "übergrifft", "uebergrifft", "übergriffet", "uebergriffet", "übergreift", "uebergreift", "übergreifet", "uebergreifet", "übergriffet", "uebergriffet", "übergrifft", "uebergrifft", "übergrünet", "uebergruenet", "übergrüntet", "uebergruentet", "überhat", "ueberhat", "überhabt", "ueberhabt", "überhabet", "ueberhabet", "überhattet", "ueberhattet", "überhättet", "ueberhaettet", "überhält", "ueberhaelt", "überhaltet", "ueberhaltet", "überhielt", "ueberhielt", "überhieltet", "ueberhieltet", "überhändiget", "ueberhaendiget", "überhändigtet", "ueberhaendigtet", "überhängt", "ueberhaengt", "überhänget", "ueberhaenget", "überhingt", "ueberhingt", "überhinget", "ueberhinget", "überhängt", "ueberhaengt", "überhänget", "ueberhaenget", "überhängtet", "ueberhaengtet", "überhänget", "ueberhaenget", "überhängtet", "ueberhaengtet", "überhängt", "ueberhaengt", "überhänget", "ueberhaenget", "überhingt", "ueberhingt", "überhinget", "ueberhinget", "überhastetet", "ueberhastetet", "überhäufet", "ueberhaeufet", "überhäuftet", "ueberhaeuftet", "überhebt", "ueberhebt", "überhebet", "ueberhebet", "überhobt", "ueberhobt", "überhöbet", "ueberhoebet", "überhebt", "ueberhebt", "überhebet", "ueberhebet", "überhobt", "ueberhobt", "überheiztet", "ueberheiztet", "überheizet", "ueberheizet", "überhöhet", "ueberhoehet", "überhöhtet", "ueberhoehtet", "überhitzet", "ueberhitzet", "überhitztet", "ueberhitztet", "überholet", "ueberholet", "überholtet", "ueberholtet", "überhöret", "ueberhoeret", "überhörtet", "ueberhoertet", "überinterpretieret", "ueberinterpretieret", "überinterpretiertet", "ueberinterpretiertet", "überinterpretieret", "ueberinterpretieret", "überinterpretiertet", "ueberinterpretiertet", "überklebet", "ueberklebet", "überklebtet", "ueberklebtet", "überkleidetet", "ueberkleidetet", "überkochet", "ueberkochet", "überkochtet", "ueberkochtet", "überkommet", "ueberkommet", "überkamt", "ueberkamt", "überkämet", "ueberkaemet", "überkämt", "ueberkaemt", "überkompensieret", "ueberkompensieret", "überkompensiertet", "ueberkompensiertet", "überkreuzet", "ueberkreuzet", "überkreuztet", "ueberkreuztet", "überkronet", "ueberkronet", "überkrontet", "ueberkrontet", "überkrustetet", "ueberkrustetet", "überladet", "ueberladet", "überludet", "ueberludet", "überlüdet", "ueberluedet", "überlappet", "ueberlappet", "überlapptet", "ueberlapptet", "überlasset", "ueberlasset", "überlaßt", "ueberlaßt", "ueberlasst", "ueberlasst", "überlässt", "ueberlaesst", "überließt", "ueberließt", "ueberliesst", "überließet", "ueberließet", "ueberliesset", "überlastet", "ueberlastet", "überlastetet", "ueberlastetet", "überläuft", "ueberlaeuft", "überlaufet", "ueberlaufet", "überlieft", "ueberlieft", "überliefet", "ueberliefet", "überlebet", "ueberlebet", "überlebtet", "ueberlebtet", "überleget", "ueberleget", "überlegtet", "ueberlegtet", "überlegt", "ueberlegt", "überleget", "ueberleget", "überlegtet", "ueberlegtet", "überleitet", "ueberleitet", "überleitetet", "ueberleitetet", "überleset", "ueberleset", "überlast", "ueberlast", "überläset", "ueberlaeset", "überliegt", "ueberliegt", "überlieget", "ueberlieget", "überlagt", "ueberlagt", "überläget", "ueberlaeget", "überlägt", "ueberlaegt", "überlistetet", "ueberlistetet", "übermachet", "uebermachet", "übermachtet", "uebermachtet", "übermalet", "uebermalet", "übermaltet", "uebermaltet", "übermalet", "uebermalet", "übermaltet", "uebermaltet", "übermannet", "uebermannet", "übermanntet", "uebermanntet", "übermarchtet", "uebermarchtet", "übermarchet", "uebermarchet", "übermästetet", "uebermaestetet", "übermüdetet", "uebermuedetet", "übernächtiget", "uebernaechtiget", "übernächtigtet", "uebernaechtigtet", "übernimmt", "uebernimmt", "übernehmt", "uebernehmt", "übernehmet", "uebernehmet", "übernahmt", "uebernahmt", "übernähmet", "uebernaehmet", "übernähmt", "uebernaehmt", "übernutzet", "uebernutzet", "übernutztet", "uebernutztet", "überpflanzt", "ueberpflanzt", "überpflanzet", "ueberpflanzet", "überpflanztet", "ueberpflanztet", "überplanet", "ueberplanet", "überplantet", "ueberplantet", "überprüfet", "ueberpruefet", "überprüftet", "ueberprueftet", "überquillt", "ueberquillt", "überquellt", "ueberquellt", "überquellet", "ueberquellet", "überquollt", "ueberquollt", "überquöllet", "ueberquoellet", "ueberquöllt", "ueberquoellt", "überqueret", "ueberqueret", "überquertet", "ueberquertet", "überraget", "ueberraget", "überragtet", "ueberragtet", "überragt", "ueberragt", "überraget", "ueberraget", "überragtet", "ueberragtet", "überraschet", "ueberraschet", "überraschtet", "ueberraschtet", "überreagieret", "ueberreagieret", "überreagiertet", "ueberreagiertet", "überrechnetet", "ueberrechnetet", "überredetet", "ueberredetet", "überreglementieret", "ueberreglementieret", "überreglementiertet", "ueberreglementiertet", "überregulieret", "ueberregulieret", "überreguliertet", "ueberreguliertet", "überreichet", "ueberreichet", "überreichtet", "ueberreichtet", "überreißet", "ueberreisset", "überrisset", "ueberrisset", "überreitet", "ueberreitet", "überrittet", "ueberrittet", "überreizet", "ueberreizet", "überreiztet", "ueberreiztet", "überrennet", "ueberrennet", "überrenntet", "ueberrenntet", "überrollet", "ueberrollet", "überrolltet", "ueberrolltet", "überrundetet", "ueberrundetet", "übersäet", "uebersaeet", "übersätet", "uebersaetet", "übersättiget", "uebersaettiget", "uebersaettigtet", "übersättigtet", "überschattetet", "ueberschattetet", "überschätzet", "ueberschaetzet", "überschätztet", "ueberschaetztet", "überschauet", "ueberschauet", "überschautet", "ueberschautet", "überschäumt", "ueberschaeumt", "überschäumet", "ueberschaeumet", "überschäumtet", "ueberschaeumtet", "überschießt", "ueberschießt", "ueberschiesst", "überschießet", "ueberschiesset", "ueberschießet", "überschosst", "ueberschosst", "überschosst", "ueberschosst", "überschoßt", "ueberschoßt", "überschösset", "ueberschoesset", "überschlafet", "ueberschlafet", "überschliefet", "ueberschliefet", "überschlieft", "ueberschlieft", "überschlaget", "ueberschlaget", "überschlüget", "ueberschlueget", "überschlügt", "ueberschluegt", "überschlägt", "ueberschlaegt", "überschlagt", "ueberschlagt", "überschlaget", "ueberschlaget", "überschlugt", "ueberschlugt", "überschlüget", "ueberschlueget", "überschlügt", "ueberschluegt", "überschlägt", "ueberschlaegt", "überschlagt", "ueberschlagt", "überschlaget", "ueberschlaget", "überschlugt", "ueberschlugt", "überschlüget", "ueberschlueget", "ueberschluegt", "überschlügt", "überschließt", "ueberschließt", "ueberschliesst", "überschließet", "ueberschliesset", "überschlosst", "ueberschlosst", "überschloßt", "ueberschlosst", "überschlösset", "ueberschloesset", "überschmieret", "ueberschmieret", "überschmiertet", "ueberschmiertet", "überschminket", "ueberschminket", "überschminktet", "ueberschminktet", "überschnappt", "ueberschnappt", "überschnappet", "ueberschnappet", "überschnapptet", "ueberschnapptet", "überschneidet", "ueberschneidet", "überschnittet", "ueberschnittet", "überschneiet", "ueberschneiet", "überschneitet", "ueberschneitet", "überschreibet", "ueberschreibet", "überschriebet", "ueberschriebet", "überschriebt", "ueberschriebt", "überschreiet", "ueberschreiet", "überschrieet", "ueberschrieet", "überschriet", "ueberschriet", "überschriet", "ueberschriet", "überschreitet", "ueberschreitet", "überschritt", "ueberschritt", "überschrittet", "ueberschrittet", "überschuldetet", "ueberschuldetet", "überschüttet", "ueberschüttet", "überschüttetet", "ueberschüttetet", "überschüttetet", "ueberschuettetet", "überschwappt", "ueberschwappt", "überschwappet", "ueberschwappet", "überschwapptet", "ueberschwapptet", "überschwemmet", "ueberschwemmet", "überschwemmtet", "ueberschwemmtet", "überschwinget", "ueberschwinget", "überschwangt", "ueberschwangt", "überschwänget", "ueberschwaenget", "überschwängt", "ueberschwaengt", "übersieht", "uebersieht", "überseht", "ueberseht", "übersehet", "uebersehet", "übersaht", "uebersaht", "übersähet", "uebersaehet", "übersäht", "uebersaeht", "übersähet", "uebersaehet", "übersäht", "uebersaeht", "übersandtet", "uebersandtet", "übersendetet", "uebersendetet", "übersensibilisieret", "uebersensibilisieret", "übersensibilisiertet", "uebersensibilisiertet", "übersetzt", "uebersetzt", "übersetzet", "uebersetzet", "übersetztet", "uebersetztet", "übersetzet", "uebersetzet", "übersetztet", "uebersetztet", "übersiedet", "uebersiedet", "übersiedetet", "uebersiedetet", "übersott", "uebersott", "übersottet", "uebersottet", "übersöttet", "uebersoettet", "übersiedet", "uebersiedet", "übersiedetet", "uebersiedetet", "übersott", "uebersott", "übersottet", "uebersottet", "übersöttet", "uebersoettet", "überspannet", "ueberspannet", "überspanntet", "ueberspanntet", "überspielet", "ueberspielet", "überspieltet", "ueberspieltet", "überspinnet", "ueberspinnet", "überspännet", "ueberspaennet", "überspännt", "ueberspaennt", "überspönnet", "ueberspoennet", "überspönnt", "ueberspoennt", "überspitzet", "ueberspitzet", "überspitztet", "ueberspitztet", "übersprechet", "uebersprechet", "überspracht", "ueberspracht", "übersprächet", "ueberspraechet", "übersprächt", "ueberspraecht", "überspringt", "ueberspringt", "überspringet", "ueberspringet", "überspränget", "ueberspraenget", "übersprängt", "ueberspraengt", "überspringt", "ueberspringt", "überspringet", "ueberspringet", "übersprangt", "uebersprangt", "überspränget", "ueberspraenget", "übersprängt", "ueberspraengt", "übersprühet", "ueberspruehet", "übersprühtet", "ueberspruehtet", "übersprühet", "ueberspruehet", "übersprühtet", "ueberspruehtet", "überspület", "ueberspuelet", "überspültet", "überspueltet", "übersticht", "uebersticht", "überstecht", "ueberstecht", "überstechet", "ueberstechet", "überstacht", "ueberstacht", "überstächet", "ueberstaechet", "überstächt", "ueberstaecht", "übersticht", "uebersticht", "überstecht", "ueberstecht", "überstechet", "ueberstechet", "überstacht", "ueberstacht", "überstächet", "ueberstaechet", "überstächt", "ueberstaecht", "überstehet", "ueberstehet", "überstandet", "überstandet", "überständet", "überstaendet", "überstündet", "überstuendet", "übersteht", "uebersteht", "überstehet", "ueberstehet", "überstandet", "ueberstandet", "überständet", "ueberstaendet", "überstündet", "ueberstuendet", "übersteiget", "uebersteiget", "überstieget", "ueberstieget", "überstiegt", "ueberstiegt", "übersteigt", "uebersteigt", "übersteiget", "uebersteiget", "überstiegt", "ueberstiegt", "überstieget", "ueberstieget", "überstellet", "ueberstellet", "überstilisieret", "ueberstilisieret", "überstimmet", "ueberstimmet", "überstimmtet", "ueberstimmtet", "überstrahlet", "ueberstrahlet", "überstrahltet", "ueberstrahltet", "überstrapazieret", "ueberstrapazieret", "überstrapaziertet", "ueberstrapaziertet", "überstreicht", "ueberstreicht", "überstreichet", "ueberstreichet", "überstricht", "ueberstricht", "überstrichet", "ueberstrichet", "überstreichet", "ueberstreichet", "überstrichet", "ueberstrichet", "überstricht", "ueberstricht", "überstreift", "ueberstreift", "überstreifet", "ueberstreifet", "überstreiftet", "ueberstreiftet", "überstreuet", "ueberstreuet", "überstreutet", "ueberstreutet", "überströmet", "ueberstroemet", "überströmtet", "überstroemtet", "überstülpt", "überstuelpt", "ueberstuelpet", "überstülpet", "überstülptet", "ueberstuelptet", "überstürzet", "ueberstuerzet", "überstürztet", "ueberstuerztet", "übertäubet", "uebertaeubet", "übertäubtet", "uebertaeubtet", "übertauchet", "uebertauchet", "übertauchtet", "uebertauchtet", "übertippet", "uebertippet", "übertipptet", "uebertipptet", "übertönet", "uebertoenet", "übertöntet", "uebertoentet", "übertouret", "uebertouret", "übertourtet", "uebertourtet", "überträgt", "uebertraegt", "übertragt", "uebertragt", "übertraget", "uebertraget", "übertrugt", "uebertrugt", "übertrüget", "uebertrueget", "übertrügt", "uebertruegt", "übertrainieret", "uebertrainieret", "übertrainiertet", "uebertrainiertet", "übertreffet", "uebertreffet", "übertraft", "uebertraft", "überträfet", "uebertraefet", "überträft", "uebertraeft", "übertreibt", "uebertreibt", "übertreibet", "uebertreibet", "übertriebet", "uebertriebet", "übertriebt", "uebertriebt", "übertritt", "uebertritt", "übertretet", "uebertretet", "übertrat", "uebertrat", "übertratet", "uebertratet", "überträtet", "uebertraetet", "übertritt", "uebertritt", "übertretet", "uebertretet", "übertrat", "uebertrat", "übertratet", "uebertratet", "überträtet", "uebertraetet", "übertrumpfet", "uebertrumpfet", "übertrumpftet", "uebertrumpftet", "übertünchet", "uebertuenchet", "übertünchtet", "überversorget", "ueberversorget", "überversorgtet", "ueberversorgtet", "übervorteilet", "uebervorteilet", "übervorteiltet", "uebervorteiltet", "überwachet", "ueberwachet", "überwachtet", "ueberwachtet", "überwachset", "ueberwachset", "überwüchset", "ueberwuechset", "überwallt", "ueberwallt", "überwallet", "ueberwallet", "überwalltet", "ueberwalltet", "überwallet", "ueberwallet", "überwalltet", "ueberwalltet", "überwältiget", "ueberwaeltiget", "überwältigtet", "ueberwaeltigtet", "überwalzet", "ueberwalzet", "überwalztet", "ueberwalztet", "überwälzet", "ueberwaelzet", "überwälztet", "ueberwaelztet", "überwechtetet", "ueberwechtetet", "überwächtetet", "ueberwaechtetet", "überwehet", "ueberwehet", "überwehtet", "ueberwehtet", "überweidetet", "ueberweidetet", "überweist", "ueberweist", "überweiset", "ueberweiset", "überwiest", "ueberwiest", "überwieset", "ueberwieset", "überweißet", "ueberweisset", "überweißtet", "ueberweisstet", "überwirft", "ueberwirft", "überwerft", "ueberwerft", "überwerfet", "ueberwerfet", "überwarft", "ueberwarft", "überwürfet", "ueberwuerfet", "überwürft", "ueberwuerft", "überwirft", "ueberwirft", "überwerft", "ueberwerft", "überwerfet", "ueberwerfet", "überwarft", "ueberwarft", "überwürfet", "ueberwuerfet", "überwürft", "ueberwuerft", "überwertetet", "ueberwertetet", "überwiegt", "ueberwiegt", "überwieget", "ueberwieget", "überwogt", "ueberwogt", "überwöget", "ueberwoeget", "überwögt", "ueberwoegt", "überwindet", "ueberwindet", "überwandet", "ueberwandet", "überwändet", "ueberwaendet", "überwölbet", "ueberwoelbet", "überwölbtet", "ueberwoelbtet", "ueberwuerzet", "ueberwuerzet", "überwürztet", "ueberwuerztet", "überzahlet", "ueberzahlet", "überzahltet", "ueberzahltet", "überzahltet", "ueberzahltet", "überzeichnetet", "ueberzeichnetet", "überzeuget", "ueberzeuget", "überzeugtet", "ueberzeugtet", "überzieht", "ueberzieht", "überziehet", "ueberziehet", "überzogt", "ueberzogt", "überzöget", "ueberzoeget", "überzögt", "ueberzoegt", "überzüchtetet", "ueberzuechtetet", "überangebot", "ueberangebot", "überbrückungskredit", "ueberbrückungskredit", "übereinkunft", "uebereinkunft", "überfahrt", "ueberfahrt", "überflugverbot", "ueberflugverbot", "überflutungsgebiet", "ueberflutungsgebiet", "überfracht", "ueberfracht", "überfrucht", "ueberfrucht", "übergangslaut", "uebergangslaut", "übergebot", "uebergebot", "übergewicht", "uebergewicht", "überhangmandat", "ueberhangmandat", "überhangsrecht", "ueberhangsrecht", "überholverbot", "ueberholverbot", "überladenheit", "ueberladenheit", "überlandfahrt", "ueberlandfahrt", "überlast", "ueberlast", "überlegenheit", "ueberlegenheit", "übermacht", "uebermacht", "übermaßverbot", "uebermassverbot", "übermut", "uebermut", "überraschungseffekt", "ueberraschungseffekt", "überraschungsgast", "ueberraschungsgast", "überraschungsmoment", "ueberraschungsmoment", "überredungskunst", "ueberredungskunst", "überreiztheit", "ueberreiztheit", "überrest", "ueberrest", "überschicht", "ueberschicht", "überschnitt", "ueberschnitt", "überschrift", "ueberschrift", "überschwemmungsgebiet", "ueberschwemmungsgebiet", "überseegebiet", "ueberseegebiet", "überseegeschäft", "ueberseegeschaeft", "übersicht", "uebersicht", "überspanntheit", "ueberspanntheit", "überspitztheit", "ueberspitztheit", "übertragungsrecht", "uebertragungsrecht", "übertriebenheit", "uebertriebenheit", "übertritt", "uebertritt", "überwachungsdienst", "ueberwachungsdienst", "überwachungsstaat", "ueberwachungsstaat", "überwelt", "ueberwelt", "überwinterungsgebiet", "ueberwinterungsgebiet", "überzeugtheit", "ueberzeugtheit", "überzeugungstat", "ueberzeugungstat", "überziehungskredit", "ueberziehungskredit"];
};



},{}],309:[function(require,module,exports){
"use strict";

var getWords = require("../../../stringProcessing/getWords.js");
var regexFunction = require("./regex.js")();
var verbsBeginningWithErVerEntBeZerHerUber = regexFunction.verbsBeginningWithErVerEntBeZerHerUber;
var verbsBeginningWithGe = regexFunction.verbsBeginningWithGe;
var verbsWithGeInMiddle = regexFunction.verbsWithGeInMiddle;
var verbsWithErVerEntBeZerHerUberInMiddle = regexFunction.verbsWithErVerEntBeZerHerUberInMiddle;
var verbsEndingWithIert = regexFunction.verbsEndingWithIert;
var irregularParticiples = require("./irregulars.js")();
var GermanParticiple = require("../GermanParticiple.js");
var forEach = require("lodash/forEach");
var includes = require("lodash/includes");
/**
 * Creates GermanParticiple Objects for the participles found in a sentence.
 *
 * @param {string} sentencePartText The sentence to finds participles in.
 * @param {Array} auxiliaries The list of auxiliaries from the sentence part.
 * @returns {Array} The array with GermanParticiple Objects.
 */
module.exports = function (sentencePartText, auxiliaries) {
    var words = getWords(sentencePartText);
    var foundParticiples = [];
    forEach(words, function (word) {
        if (verbsBeginningWithGe(word).length !== 0) {
            foundParticiples.push(new GermanParticiple(word, sentencePartText, { auxiliaries: auxiliaries, type: "ge at beginning" }));
            return;
        }
        if (verbsWithGeInMiddle(word).length !== 0) {
            foundParticiples.push(new GermanParticiple(word, sentencePartText, { auxiliaries: auxiliaries, type: "ge in the middle" }));
            return;
        }
        if (verbsBeginningWithErVerEntBeZerHerUber(word).length !== 0) {
            foundParticiples.push(new GermanParticiple(word, sentencePartText, { auxiliaries: auxiliaries, type: "er/ver/ent/be/zer/her at beginning" }));
            return;
        }
        if (verbsWithErVerEntBeZerHerUberInMiddle(word).length !== 0) {
            foundParticiples.push(new GermanParticiple(word, sentencePartText, { auxiliaries: auxiliaries, type: "er/ver/ent/be/zer/her in the middle" }));
            return;
        }
        if (verbsEndingWithIert(word).length !== 0) {
            foundParticiples.push(new GermanParticiple(word, sentencePartText, { auxiliaries: auxiliaries, type: "iert at the end" }));
        }
        if (includes(irregularParticiples, word)) {
            foundParticiples.push(new GermanParticiple(word, sentencePartText, { auxiliaries: auxiliaries, type: "irregular" }));
        }
    });
    return foundParticiples;
};



},{"../../../stringProcessing/getWords.js":362,"../GermanParticiple.js":301,"./irregulars.js":310,"./regex.js":311,"lodash/forEach":167,"lodash/includes":173}],310:[function(require,module,exports){
"use strict";
// This is a list of irregular participles used in German.

module.exports = function () {
    return ["angefangen", "aufgerissen", "ausgesehen", "befohlen", "befunden", "begonnen", "bekommen", "bewiesen", "beworben", "empfohlen", "empfunden", "entschieden", "erschrocken", "erwogen", "gebacken", "gebeten", "gebissen", "geblasen", "geblieben", "gebogen", "geboren", "geborgen", "geboten", "gebraten", "gebrochen", "gebunden", "gediehen", "gedroschen", "gedrungen", "gefahren", "gefallen", "gefangen", "geflogen", "geflohen", "geflossen", "gefressen", "gefroren", "gefunden", "gegangen", "gegeben", "gegessen", "geglichen", "geglitten", "gelungen", "gegolten", "gegoren", "gegossen", "gegraben", "gegriffen", "gehalten", "gehangen", "gehauen", "geheissen", "geheißen", "gehoben", "geholfen", "geklungen", "gekniffen", "gekommen", "gekrochen", "geladen", "gelassen", "gelaufen", "gelegen", "gelesen", "geliehen", "gelitten", "gelogen", "gelungen", "gemessen", "gemieden", "genesen", "genommen", "genossen", "gepfiffen", "gepriesen", "gequollen", "geraten", "gerieben", "gerissen", "geritten", "gerochen", "geronnen", "gerufen", "gerungen", "geschaffen", "geschehen", "geschieden", "geschienen", "geschlafen", "geschlagen", "geschlichen", "geschliffen", "geschlossen", "geschlungen", "geschmissen", "geschmolzen", "geschnitten", "geschoben", "gescholten", "geschoren", "geschossen", "geschrieben", "geschrien", "geschritten", "geschunden", "geschwiegen", "geschwollen", "geschwommen", "geschworen", "geschwunden", "geschwungen", "gesehen", "gesessen", "gesoffen", "gesonnen", "gespien", "gesponnen", "gesprochen", "gesprossen", "gesprungen", "gestanden", "gestiegen", "gestochen", "gestohlen", "gestorben", "gestoßen", "gestossen", "gestrichen", "gestritten", "gesungen", "gesunken", "getan", "getragen", "getreten", "getrieben", "getroffen", "getrogen", "getrunken", "gewachsen", "gewaschen", "gewichen", "gewiesen", "gewoben", "gewogen", "gewonnen", "geworben", "geworfen", "gewrungen", "gezogen", "gezwungen", "misslungen", "überbacken", "ueberbacken", "überbehalten", "ueberbehalten", "überbekommen", "ueberbekommen", "überbelegen", "ueberbelegen", "überbezahlen", "ueberbezahlen", "überboten", "ueberboten", "übergebunden", "uebergebunden", "überbunden", "ueberbunden", "überblasen", "ueberblasen", "überbraten", "ueberbraten", "übergebraten", "uebergebraten",
    // Participles ending in -st are not found with the regex to avoid second person singular verbs.
    "überbremst", "ueberbremst", "übergeblieben", "uebergeblieben", "übereinandergelegen", "uebereinandergelegen", "übereinandergeschlagen", "uebereinandergeschlagen", "übereinandergesessen", "uebereinandergesessen", "übereinandergestanden", "uebereinandergestanden", "übereingefallen", "uebereingefallen", "übereingekommen", "uebereingekommen", "übereingetroffen", "uebereingetroffen", "übergefallen", "uebergefallen", "übergessen", "uebergessen", "überfahren", "ueberfahren", "übergefahren", "uebergefahren", "überfallen", "ueberfallen", "überfangen", "ueberfangen", "überflogen", "ueberflogen", "überflossen", "ueberflossen", "übergeflossen", "uebergeflossen", "überfressen", "ueberfressen", "überfroren", "ueberfroren", "übergegeben", "uebergegeben", "übergeben", "uebergeben", "übergegangen", "uebergegangen", "übergangen", "uebergangen", "übergangen", "uebergangen", "übergossen", "uebergossen", "übergriffen", "uebergriffen", "übergegriffen", "uebergegriffen", "übergehalten", "uebergehalten", "überhandgenommen", "ueberhandgenommen", "überhangen", "ueberhangen", "übergehangen", "uebergehangen", "übergehoben", "uebergehoben", "überhoben", "ueberhoben", "überkommen", "ueberkommen", "übergekommen", "uebergekommen", "überladen", "ueberladen", "übergeladen", "uebergeladen", "überlassen", "ueberlassen", "übergelassen", "uebergelassen", "überlaufen", "ueberlaufen", "übergelaufen", "uebergelaufen", "überlesen", "ueberlesen", "übergelegen", "uebergelegen", "übergenommen", "uebergenommen", "übernommen", "uebernommen", "übergequollen", "uebergequollen", "überrissen", "ueberrissen", "überritten", "ueberritten", "übergeschossen", "uebergeschossen", "überschlafen", "ueberschlafen", "überschlagen", "ueberschlagen", "übergeschlagen", "uebergeschlagen", "übergeschlossen", "uebergeschlossen", "überschnitten", "ueberschnitten", "überschrieben", "ueberschrieben", "überschrieen", "ueberschrieen", "überschrien", "ueberschrien", "überschritten", "ueberschritten", "überschwungen", "ueberschwungen", "übergesehen", "uebergesehen", "übersehen", "uebersehen", "übergesotten", "uebergesotten", "übergesotten", "uebergesotten", "übersponnen", "uebersponnen", "übersprochen", "uebersprochen", "übersprungen", "uebersprungen", "übergesprungen", "uebergesprungen", "überstochen", "ueberstochen", "übergestochen", "uebergestochen", "überstanden", "ueberstanden", "übergestanden", "uebergestanden", "überstiegen", "ueberstiegen", "übergestiegen", "uebergestiegen", "übergestrichen", "uebergestrichen", "überstrichen", "ueberstrichen", "übertragen", "uebertragen", "übertroffen", "uebertroffen", "übertrieben", "uebertrieben", "übertreten", "uebertreten", "übergetreten", "uebergetreten", "überwachsen", "ueberwachsen", "überwiesen", "ueberwiesen", "überworfen", "ueberworfen", "übergeworfen", "uebergeworfen", "überwogen", "ueberwogen", "überwunden", "ueberwunden", "überzogen", "ueberzogen", "übergezogen", "uebergezogen", "verdorben", "vergessen", "verglichen", "verloren", "verstanden", "verschwunden", "vorgeschlagen"];
};



},{}],311:[function(require,module,exports){
"use strict";

var verbsBeginningWithGeRegex = /^((ge)\S+t($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>]))/ig;
var verbsBeginningWithErVerEntBeZerHerUberRegex = /^(((be|ent|er|her|ver|zer|über|ueber)\S+([^s]t|sst))($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>]))/ig;
var verbsWithGeInMiddleRegex = /(ab|an|auf|aus|vor|wieder|zurück)(ge)\S+t($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig;
var verbsWithErVerEntBeZerHerUberInMiddleRegex = /((ab|an|auf|aus|vor|wieder|zurück)(be|ent|er|her|ver|zer|über|ueber)\S+([^s]t|sst))($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig;
var verbsEndingWithIertRegex = /\S+iert($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig;
var exceptionsRegex = /\S+(apparat|arbeit|dienst|haft|halt|kraft|not|pflicht|schaft|schrift|tät|wert|zeit)($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig;
/**
 * Checks if the word starts with 'ge'.
 *
 * @param {string} word The word to match.
 * @returns {Array} A list with matches.
 */
var verbsBeginningWithGe = function verbsBeginningWithGe(word) {
    return word.match(verbsBeginningWithGeRegex) || [];
};
/**
 * Checks if the word starts with 'er', 'ver', 'ent', 'be' or 'zer'.
 *
 * @param {string} word The word to match.
 * @returns {Array} A list with matches.
 */
var verbsBeginningWithErVerEntBeZerHerUber = function verbsBeginningWithErVerEntBeZerHerUber(word) {
    return word.match(verbsBeginningWithErVerEntBeZerHerUberRegex) || [];
};
/**
 * Checks if the word contains 'ge' following 'ab', 'an', 'auf', 'aus', 'vor', 'wieder' or 'zurück'.
 *
 * @param {string} word The word to match.
 * @returns {Array} A list with matches.
 */
var verbsWithGeInMiddle = function verbsWithGeInMiddle(word) {
    return word.match(verbsWithGeInMiddleRegex) || [];
};
/**
 * Checks if the word starts with 'er', 'ver', 'ent', 'be' or 'zer',
 * following  'ab', 'an', 'auf', 'aus', 'vor', 'wieder' or 'zurück'.
 *
 * @param {string} word The word to match.
 * @returns {Array} A list with matches.
 */
var verbsWithErVerEntBeZerHerUberInMiddle = function verbsWithErVerEntBeZerHerUberInMiddle(word) {
    return word.match(verbsWithErVerEntBeZerHerUberInMiddleRegex) || [];
};
/**
 * Checks if the word ends in 'iert'.
 *
 * @param {string} word The word to match.
 * @returns {Array} A list with matches.
 */
var verbsEndingWithIert = function verbsEndingWithIert(word) {
    return word.match(verbsEndingWithIertRegex) || [];
};
/**
 * Matches the word againts the exceptions regex.
 *
 * @param {string} word The word to match.
 * @returns {Array} A list with matches.
 */
var exceptions = function exceptions(word) {
    return word.match(exceptionsRegex) || [];
};
module.exports = function () {
    return {
        verbsBeginningWithGe: verbsBeginningWithGe,
        verbsBeginningWithErVerEntBeZerHerUber: verbsBeginningWithErVerEntBeZerHerUber,
        verbsWithGeInMiddle: verbsWithGeInMiddle,
        verbsWithErVerEntBeZerHerUberInMiddle: verbsWithErVerEntBeZerHerUberInMiddle,
        verbsEndingWithIert: verbsEndingWithIert,
        exceptions: exceptions
    };
};



},{}],312:[function(require,module,exports){
"use strict";
// This is a list with stopwords used in German.

module.exports = function () {
    return [":", "aber", "als", "bevor", "bis", "da", "damit", "daß", "dass", "denn", "doch", "ehe", "falls", "gleichwohl", "indem", "indes", "indessen", "insofern", "insoweit", "nachdem", "nun", "ob", "obgleich", "obschon", "obwohl", "obzwar", "oder", "seitdem", "sobald", "sodass", "sofern", "solange", "sondern", "sooft", "soviel", "soweit", "sowie", "trotz", "und", "ungeachtet", "waehrend", "während", "weil", "welche", "welchem", "welchen", "welcher", "welches", "wem", "wen", "wenn", "wenngleich", "wennschon", "wer", "wes", "wessen", "wie", "wiewohl", "wohingegen", "zumal"];
};



},{}],313:[function(require,module,exports){
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



},{}],314:[function(require,module,exports){
"use strict";
/** @module config/twoPartTransitionWords */
/**
 * Returns an array with two-part transition words to be used by the assessments.
 * @returns {Array} The array filled with two-part transition words.
 */

module.exports = function () {
  return [["anstatt", "dass"], ["bald", "bald"], ["dadurch", "dass"], ["dessen ungeachtet", "dass"], ["entweder", "oder"], ["einerseits", "andererseits"], ["erst", "wenn"], ["je", "desto"], ["je", "umsto"], ["nicht nur", "sondern auch"], ["ob", "oder"], ["ohne", "dass"], ["so", "dass"], ["sowohl", "als auch"], ["sowohl", "wie auch"], ["unbeschadet dessen", "dass"], ["weder", "noch"], ["wenn", "auch"], ["wenn", "schon"], ["nicht weil", "sondern"]];
};



},{}],315:[function(require,module,exports){
"use strict";
/** @module analyses/getKeywordDensity */

var countWords = require("../stringProcessing/countWords.js");
var matchWords = require("../stringProcessing/matchTextWithWord.js");
var escapeRegExp = require("lodash/escapeRegExp");
/**
 * Calculates the keyword density .
 *
 * @param {object} paper The paper containing keyword and text.
  * @returns {number} The keyword density.
 */
module.exports = function (paper) {
    var keyword = escapeRegExp(paper.getKeyword());
    var text = paper.getText();
    var locale = paper.getLocale();
    var wordCount = countWords(text);
    if (wordCount === 0) {
        return 0;
    }
    var keywordCount = matchWords(text, keyword, locale);
    return keywordCount / wordCount * 100;
};



},{"../stringProcessing/countWords.js":351,"../stringProcessing/matchTextWithWord.js":368,"lodash/escapeRegExp":161}],316:[function(require,module,exports){
"use strict";
/** @module analyses/getLinkStatistics */

var getAnchors = require("../stringProcessing/getAnchorsFromText.js");
var findKeywordInUrl = require("../stringProcessing/findKeywordInUrl.js");
var getLinkType = require("../stringProcessing/getLinkType.js");
var checkNofollow = require("../stringProcessing/checkNofollow.js");
var urlHelper = require("../stringProcessing/url.js");
var escapeRegExp = require("lodash/escapeRegExp");
/**
 * Checks whether or not an anchor contains the passed keyword.
 * @param {string} keyword The keyword to look for.
 * @param {string} anchor The anchor to check against.
 * @param {string} locale The locale used for transliteration.
 * @returns {boolean} Whether or not the keyword was found.
 */
var keywordInAnchor = function keywordInAnchor(keyword, anchor, locale) {
    if (keyword === "") {
        return false;
    }
    return findKeywordInUrl(anchor, keyword, locale);
};
/**
 * Counts the links found in the text.
 *
 * @param {object} paper The paper object containing text, keyword and url.
 * @returns {object} The object containing all linktypes.
 * total: the total number of links found.
 * totalNaKeyword: the total number of links if keyword is not available.
 * keyword: Object containing all the keyword related counts and matches.
 * keyword.totalKeyword: the total number of links with the keyword.
 * keyword.matchedAnchors: Array with the anchors that contain the keyword.
 * internalTotal: the total number of links that are internal.
 * internalDofollow: the internal links without a nofollow attribute.
 * internalNofollow: the internal links with a nofollow attribute.
 * externalTotal: the total number of links that are external.
 * externalDofollow: the external links without a nofollow attribute.
 * externalNofollow: the internal links with a dofollow attribute.
 * otherTotal: all links that are not HTTP or HTTPS.
 * otherDofollow: other links without a nofollow attribute.
 * otherNofollow: other links with a nofollow attribute.
 */
var countLinkTypes = function countLinkTypes(paper) {
    var keyword = escapeRegExp(paper.getKeyword());
    var locale = paper.getLocale();
    var anchors = getAnchors(paper.getText());
    var permalink = paper.getPermalink();
    var linkCount = {
        total: anchors.length,
        totalNaKeyword: 0,
        keyword: {
            totalKeyword: 0,
            matchedAnchors: []
        },
        internalTotal: 0,
        internalDofollow: 0,
        internalNofollow: 0,
        externalTotal: 0,
        externalDofollow: 0,
        externalNofollow: 0,
        otherTotal: 0,
        otherDofollow: 0,
        otherNofollow: 0
    };
    for (var i = 0; i < anchors.length; i++) {
        var currentAnchor = anchors[i];
        var anchorLink = urlHelper.getFromAnchorTag(currentAnchor);
        var linkToSelf = urlHelper.areEqual(anchorLink, permalink);
        if (keywordInAnchor(keyword, currentAnchor, locale) && !linkToSelf) {
            linkCount.keyword.totalKeyword++;
            linkCount.keyword.matchedAnchors.push(currentAnchor);
        }
        var linkType = getLinkType(currentAnchor, permalink);
        var linkFollow = checkNofollow(currentAnchor);
        linkCount[linkType + "Total"]++;
        linkCount[linkType + linkFollow]++;
    }
    return linkCount;
};
/**
 * Checks a text for anchors and returns an object with all linktypes found.
 *
 * @param {Paper} paper The paper object containing text, keyword and url.
 * @returns {Object} The object containing all linktypes.
 */
module.exports = function (paper) {
    return countLinkTypes(paper);
};



},{"../stringProcessing/checkNofollow.js":349,"../stringProcessing/findKeywordInUrl.js":355,"../stringProcessing/getAnchorsFromText.js":357,"../stringProcessing/getLinkType.js":358,"../stringProcessing/url.js":386,"lodash/escapeRegExp":161}],317:[function(require,module,exports){
"use strict";
/** @module analyses/getLinkStatistics */

var getAnchors = require("../stringProcessing/getAnchorsFromText.js");
var map = require("lodash/map");
var url = require("../stringProcessing/url.js");
/**
 * Checks a text for anchors and returns the number found.
 *
 * @param {Object} paper The paper to get the text from.
 * @returns {Array} An array with the anchors
 */
module.exports = function (paper) {
  var anchors = getAnchors(paper.getText());
  return map(anchors, url.getFromAnchorTag);
};



},{"../stringProcessing/getAnchorsFromText.js":357,"../stringProcessing/url.js":386,"lodash/map":195}],318:[function(require,module,exports){
"use strict";

var countWords = require("../stringProcessing/countWords.js");
var matchParagraphs = require("../stringProcessing/matchParagraphs.js");
var filter = require("lodash/filter");
/**
 * Gets all paragraphs and their word counts from the text.
 *
 * @param {Paper} paper The paper object to get the text from.
 * @returns {Array} The array containing an object with the paragraph word count and paragraph text.
 */
module.exports = function (paper) {
    var text = paper.getText();
    var paragraphs = matchParagraphs(text);
    var paragraphsLength = [];
    paragraphs.map(function (paragraph) {
        paragraphsLength.push({
            wordCount: countWords(paragraph),
            text: paragraph
        });
    });
    return filter(paragraphsLength, function (paragraphLength) {
        return paragraphLength.wordCount > 0;
    });
};



},{"../stringProcessing/countWords.js":351,"../stringProcessing/matchParagraphs.js":365,"lodash/filter":162}],319:[function(require,module,exports){
"use strict";

var getSentences = require("../stringProcessing/getSentences.js");
var stripHTMLTags = require("../stringProcessing/stripHTMLTags.js").stripFullTags;
var getLanguage = require("../helpers/getLanguage.js");
var Sentence = require("../values/Sentence.js");
// English.
var getSentencePartsEnglish = require("./english/getSentenceParts.js");
var determinePassivesEnglish = require("./english/determinePassives.js");
// German.
var getSentencePartsGerman = require("./german/getSentenceParts.js");
var determinePassivesGerman = require("./german/determinePassives.js");
var forEach = require("lodash/forEach");
/**
 * Gets the sentence parts from a sentence by determining sentence breakers.
 *
 * @param {string} sentence The sentence to split up in sentence parts.
 * @param {string} language The language to use for determining how to get sentence parts.
 * @returns {Array} The array with all parts of a sentence that have an auxiliary.
 */
var getSentenceParts = function getSentenceParts(sentence, language) {
    var sentenceParts = [];
    switch (language) {
        case "de":
            sentenceParts = getSentencePartsGerman(sentence);
            break;
        case "en":
        default:
            sentenceParts = getSentencePartsEnglish(sentence);
            break;
    }
    return sentenceParts;
};
/**
 * Checks the sentence part for any passive verb.
 *
 * @param {object} sentencePart The sentence part object to check for passives.
 * @param {string} language The language to use for finding passive verbs.
 * @returns {boolean} True if passive is found, false if no passive is found.
 */
var determinePassives = function determinePassives(sentencePart, language) {
    switch (language) {
        case "de":
            sentencePart.setPassive(determinePassivesGerman(sentencePart.getSentencePartText(), sentencePart.getAuxiliaries()));
            break;
        case "en":
        default:
            sentencePart.setPassive(determinePassivesEnglish(sentencePart.getSentencePartText(), sentencePart.getAuxiliaries()));
            break;
    }
};
/**
 * Determines the number of passive sentences in the text.
 *
 * @param {Paper} paper The paper object to get the text from.
 * @returns {object} The number of passives found in the text and the passive sentences.
 */
module.exports = function (paper) {
    var text = paper.getText();
    var locale = paper.getLocale();
    var language = getLanguage(locale);
    var sentences = getSentences(text);
    var sentenceObjects = [];
    forEach(sentences, function (sentence) {
        sentenceObjects.push(new Sentence(sentence, locale));
    });
    var passiveSentences = [];
    // Get sentence parts for each sentence.
    forEach(sentenceObjects, function (sentence) {
        var strippedSentence = stripHTMLTags(sentence.getSentenceText()).toLocaleLowerCase();
        var sentenceParts = getSentenceParts(strippedSentence, language);
        var passive = false;
        forEach(sentenceParts, function (sentencePart) {
            determinePassives(sentencePart, language);
            passive = passive || sentencePart.isPassive();
        });
        if (passive === true) {
            passiveSentences.push(sentence.getSentenceText());
        }
    });
    return {
        total: sentences.length,
        passives: passiveSentences
    };
};



},{"../helpers/getLanguage.js":260,"../stringProcessing/getSentences.js":359,"../stringProcessing/stripHTMLTags.js":377,"../values/Sentence.js":391,"./english/determinePassives.js":281,"./english/getSentenceParts.js":284,"./german/determinePassives.js":303,"./german/getSentenceParts.js":306,"lodash/forEach":167}],320:[function(require,module,exports){
"use strict";

var getWords = require("../stringProcessing/getWords.js");
var stripSpaces = require("../stringProcessing/stripSpaces.js");
var stripTags = require("../stringProcessing/stripHTMLTags.js").stripFullTags;
var getFirstWordExceptions = require("../helpers/getFirstWordExceptions.js");
var isEmpty = require("lodash/isEmpty");
var forEach = require("lodash/forEach");
var filter = require("lodash/filter");
/**
 * Compares the first word of each sentence with the first word of the following sentence.
 *
 * @param {string} currentSentenceBeginning The first word of the current sentence.
 * @param {string} nextSentenceBeginning The first word of the next sentence.
 * @returns {boolean} Returns true if sentence beginnings match.
 */
var startsWithSameWord = function startsWithSameWord(currentSentenceBeginning, nextSentenceBeginning) {
    if (!isEmpty(currentSentenceBeginning) && currentSentenceBeginning === nextSentenceBeginning) {
        return true;
    }
    return false;
};
/**
 * Counts the number of similar sentence beginnings.
 *
 * @param {Array} sentenceBeginnings The array containing the first word of each sentence.
 * @param {Array} sentences The array containing all sentences.
 * @returns {Array} The array containing the objects containing the first words and the corresponding counts.
 */
var compareFirstWords = function compareFirstWords(sentenceBeginnings, sentences) {
    var consecutiveFirstWords = [];
    var foundSentences = [];
    var sameBeginnings = 1;
    forEach(sentenceBeginnings, function (beginning, i) {
        var currentSentenceBeginning = beginning;
        var nextSentenceBeginning = sentenceBeginnings[i + 1];
        foundSentences.push(sentences[i]);
        if (startsWithSameWord(currentSentenceBeginning, nextSentenceBeginning)) {
            sameBeginnings++;
        } else {
            consecutiveFirstWords.push({ word: currentSentenceBeginning, count: sameBeginnings, sentences: foundSentences });
            sameBeginnings = 1;
            foundSentences = [];
        }
    });
    return consecutiveFirstWords;
};
/**
 * Sanitizes the sentence.
 *
 * @param {string} sentence The sentence to sanitize.
 * @returns {string} The sanitized sentence.
 */
function sanitizeSentence(sentence) {
    sentence = stripTags(sentence);
    sentence = sentence.replace(/^[^A-Za-z0-9]/, "");
    return sentence;
}
/**
 * Retrieves the first word from the sentence.
 *
 * @param {string} sentence The sentence to retrieve the first word from.
 * @param {Array} firstWordExceptions Exceptions to match against.
 * @returns {string} The first word of the sentence.
 */
function getSentenceBeginning(sentence, firstWordExceptions) {
    sentence = sanitizeSentence(sentence);
    var words = getWords(stripSpaces(sentence));
    if (words.length === 0) {
        return "";
    }
    var firstWord = words[0].toLocaleLowerCase();
    if (firstWordExceptions.indexOf(firstWord) > -1 && words.length > 1) {
        firstWord += " " + words[1];
    }
    return firstWord;
}
/**
 * Gets the first word of each sentence from the text, and returns an object containing the first word of each sentence and the corresponding counts.
 *
 * @param {Paper} paper The Paper object to get the text from.
 * @param {Researcher} researcher The researcher this research is a part of.
 * @returns {Object} The object containing the first word of each sentence and the corresponding counts.
 */
module.exports = function (paper, researcher) {
    var sentences = researcher.getResearch("sentences");
    var firstWordExceptions = getFirstWordExceptions(paper.getLocale())();
    var sentenceBeginnings = sentences.map(function (sentence) {
        return getSentenceBeginning(sentence, firstWordExceptions);
    });
    sentences = sentences.filter(function (sentence) {
        return getWords(stripSpaces(sentence)).length > 0;
    });
    sentenceBeginnings = filter(sentenceBeginnings);
    return compareFirstWords(sentenceBeginnings, sentences);
};



},{"../helpers/getFirstWordExceptions.js":259,"../stringProcessing/getWords.js":362,"../stringProcessing/stripHTMLTags.js":377,"../stringProcessing/stripSpaces.js":380,"lodash/filter":162,"lodash/forEach":167,"lodash/isEmpty":181}],321:[function(require,module,exports){
"use strict";

var getSubheadingTexts = require("../stringProcessing/getSubheadingTexts.js");
var countWords = require("../stringProcessing/countWords.js");
var forEach = require("lodash/forEach");
/**
 * Gets the subheadings from the text and returns the length of these subheading in an array.
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {Array} The array with the length of each subheading.
 */
module.exports = function (paper) {
    var text = paper.getText();
    var matches = getSubheadingTexts(text);
    var subHeadingTexts = [];
    forEach(matches, function (subHeading) {
        subHeadingTexts.push({
            text: subHeading,
            wordCount: countWords(subHeading)
        });
    });
    return subHeadingTexts;
};



},{"../stringProcessing/countWords.js":351,"../stringProcessing/getSubheadingTexts.js":360,"lodash/forEach":167}],322:[function(require,module,exports){
"use strict";

var getWords = require("../stringProcessing/getWords.js");
var countSyllables = require("../stringProcessing/syllables/count.js");
var getSentences = require("../stringProcessing/getSentences.js");
var map = require("lodash/map");
var forEach = require("lodash/forEach");
/**
 * Gets the complexity per word, along with the index for the sentence.
 * @param {string} sentence The sentence to get wordComplexity from.
 * @returns {Array} A list with words, the index and the complexity per word.
 */
var getWordComplexityForSentence = function getWordComplexityForSentence(sentence) {
    var words = getWords(sentence);
    var results = [];
    forEach(words, function (word, i) {
        results.push({
            word: word,
            wordIndex: i,
            complexity: countSyllables(word)
        });
    });
    return results;
};
/**
 * Calculates the complexity of words in a text, returns each words with their complexity.
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {Object} The words found in the text with the number of syllables.
 */
module.exports = function (paper) {
    var sentences = getSentences(paper.getText());
    return map(sentences, function (sentence) {
        return {
            sentence: sentence,
            words: getWordComplexityForSentence(sentence)
        };
    });
};



},{"../stringProcessing/getSentences.js":359,"../stringProcessing/getWords.js":362,"../stringProcessing/syllables/count.js":383,"lodash/forEach":167,"lodash/map":195}],323:[function(require,module,exports){
"use strict";
/** @module researches/imageAltTags */

var imageInText = require("../stringProcessing/imageInText");
var imageAlttag = require("../stringProcessing/getAlttagContent");
var wordMatch = require("../stringProcessing/matchTextWithWord");
var escapeRegExp = require("lodash/escapeRegExp");
/**
 * Matches the alt-tags in the images found in the text.
 * Returns an object with the totals and different alt-tags.
 *
 * @param {Array} imageMatches Array with all the matched images in the text
 * @param {string} keyword the keyword to check for.
 * @param {string} locale The locale used for transliteration.
 * @returns {object} altProperties Object with all alt-tags that were found.
 */
var matchAltProperties = function matchAltProperties(imageMatches, keyword, locale) {
    var altProperties = {
        noAlt: 0,
        withAlt: 0,
        withAltKeyword: 0,
        withAltNonKeyword: 0
    };
    for (var i = 0; i < imageMatches.length; i++) {
        var alttag = imageAlttag(imageMatches[i]);
        // If no alt-tag is set
        if (alttag === "") {
            altProperties.noAlt++;
            continue;
        }
        // If no keyword is set, but the alt-tag is
        if (keyword === "" && alttag !== "") {
            altProperties.withAlt++;
            continue;
        }
        if (wordMatch(alttag, keyword, locale) === 0 && alttag !== "") {
            // Match for keywords?
            altProperties.withAltNonKeyword++;
            continue;
        }
        if (wordMatch(alttag, keyword, locale) > 0) {
            altProperties.withAltKeyword++;
            continue;
        }
    }
    return altProperties;
};
/**
 * Checks the text for images, checks the type of each image and alt attributes for containing keywords
 *
 * @param {Paper} paper The paper to check for images
 * @returns {object} Object containing all types of found images
 */
module.exports = function (paper) {
    var keyword = escapeRegExp(paper.getKeyword().toLocaleLowerCase());
    return matchAltProperties(imageInText(paper.getText()), keyword, paper.getLocale());
};



},{"../stringProcessing/getAlttagContent":356,"../stringProcessing/imageInText":363,"../stringProcessing/matchTextWithWord":368,"lodash/escapeRegExp":161}],324:[function(require,module,exports){
"use strict";
/** @module researches/imageInText */

var imageInText = require("./../stringProcessing/imageInText");
/**
 * Checks the amount of images in the text.
 *
 * @param {Paper} paper The paper to check for images
 * @returns {number} The amount of found images
 */
module.exports = function (paper) {
  return imageInText(paper.getText()).length;
};



},{"./../stringProcessing/imageInText":363}],325:[function(require,module,exports){
"use strict";
/**
 * Returns an array with exceptions for the sentence beginning researcher.
 * @returns {Array} The array filled with exceptions.
 */

module.exports = function () {
    return [
    // Definite articles:
    "il", "lo", "la", "i", "gli", "le",
    // Indefinite articles:
    "uno", "un", "una",
    // Numbers 1-10 ('uno' is already included above):
    "due", "tre", "quattro", "cinque", "sei", "sette", "otto", "nove", "dieci",
    // Demonstrative pronouns:
    "questo", "questa", "quello", "quella", "questi", "queste", "quelli", "quelle", "codesto", "codesti", "codesta", "codeste"];
};



},{}],326:[function(require,module,exports){
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



},{"./transitionWords.js":327}],327:[function(require,module,exports){
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



},{}],328:[function(require,module,exports){
"use strict";
/**
 * Returns an array with two-part transition words to be used by the assessments.
 * @returns {Array} The array filled with two-part transition words.
 */

module.exports = function () {
  return [["né", "né"], ["non", "ma"], ["non prima", "che"], ["non prima", "di"], ["non solo", "ma anche"], ["o", "o"], ["se", "allora"], ["se", "o"], ["sia", "che"]];
};



},{}],329:[function(require,module,exports){
"use strict";

var countWords = require("../stringProcessing/countWords");
var sanitizeString = require("../stringProcessing/sanitizeString");
/**
 * Determines the length in words of a the keyphrase, the keyword is a keyphrase if it is more than one word.
 *
 * @param {Paper} paper The paper to research
 * @returns {number} The length of the keyphrase
 */
function keyphraseLengthResearch(paper) {
  var keyphrase = sanitizeString(paper.getKeyword());
  return countWords(keyphrase);
}
module.exports = keyphraseLengthResearch;



},{"../stringProcessing/countWords":351,"../stringProcessing/sanitizeString":375}],330:[function(require,module,exports){
"use strict";
/** @module researches/countKeywordInUrl */

var wordMatch = require("../stringProcessing/matchTextWithWord.js");
var escapeRegExp = require("lodash/escapeRegExp");
/**
 * Matches the keyword in the URL. Replaces whitespaces with dashes and uses dash as wordboundary.
 *
 * @param {Paper} paper the Paper object to use in this count.
 * @returns {int} Number of times the keyword is found.
 */
module.exports = function (paper) {
  var keyword = paper.getKeyword().replace("'", "").replace(/\s/ig, "-");
  keyword = escapeRegExp(keyword);
  return wordMatch(paper.getUrl(), keyword, paper.getLocale());
};



},{"../stringProcessing/matchTextWithWord.js":368,"lodash/escapeRegExp":161}],331:[function(require,module,exports){
"use strict";
/* @module analyses/matchKeywordInSubheadings */

var stripSomeTags = require("../stringProcessing/stripNonTextTags.js");
var subheadingMatch = require("../stringProcessing/subheadingsMatch.js");
var getSubheadingContents = require("../stringProcessing/getSubheadings.js").getSubheadingContents;
var escapeRegExp = require("lodash/escapeRegExp");
/**
 * Checks if there are any subheadings like h2 in the text
 * and if they have the keyword in them.
 *
 * @param {object} paper The paper object containing the text and keyword.
 * @returns {object} the result object.
 */
module.exports = function (paper) {
    var text = paper.getText();
    var keyword = escapeRegExp(paper.getKeyword());
    var locale = paper.getLocale();
    var result = { count: 0 };
    text = stripSomeTags(text);
    var matches = getSubheadingContents(text);
    if (0 !== matches.length) {
        result.count = matches.length;
        result.matches = subheadingMatch(matches, keyword, locale);
    }
    return result;
};



},{"../stringProcessing/getSubheadings.js":361,"../stringProcessing/stripNonTextTags.js":378,"../stringProcessing/subheadingsMatch.js":381,"lodash/escapeRegExp":161}],332:[function(require,module,exports){
"use strict";

var matchTextWithWord = require("../stringProcessing/matchTextWithWord.js");
var escapeRegExp = require("lodash/escapeRegExp");
/**
 * Matches the keyword in the description if a description and keyword are available.
 * default is -1 if no description and/or keyword is specified
 *
 * @param {Paper} paper The paper object containing the description.
 * @returns {number} The number of matches with the keyword
 */
module.exports = function (paper) {
    if (paper.getDescription() === "") {
        return -1;
    }
    var keyword = escapeRegExp(paper.getKeyword());
    return matchTextWithWord(paper.getDescription(), keyword, paper.getLocale());
};



},{"../stringProcessing/matchTextWithWord.js":368,"lodash/escapeRegExp":161}],333:[function(require,module,exports){
"use strict";
/**
 * Check the length of the description.
 * @param {Paper} paper The paper object containing the description.
 * @returns {number} The length of the description.
 */

module.exports = function (paper) {
  return paper.getDescription().length;
};



},{}],334:[function(require,module,exports){
"use strict";
/**
 * Check the width of the title in pixels
 * @param {Paper} paper The paper object containing the title width in pixels.
 * @returns {number} The width of the title in pixels
 */

module.exports = function (paper) {
    if (paper.hasTitle()) {
        return paper.getTitleWidth();
    }
    return 0;
};



},{}],335:[function(require,module,exports){
"use strict";

var forEach = require("lodash/forEach");
/**
 * Checks if the participles make the sentence part passive.
 *
 * @param {Array} participles A list of participles.
 * @returns {boolean} Returns true if the sentence part is passive.
 */
module.exports = function (participles) {
    var passive = false;
    forEach(participles, function (participle) {
        if (participle.determinesSentencePartIsPassive()) {
            passive = true;
            return;
        }
    });
    return passive;
};



},{"lodash/forEach":167}],336:[function(require,module,exports){
"use strict";

var getRelevantWords = require("../stringProcessing/relevantWords").getRelevantWords;
/**
 * Retrieves the relevant words from the given paper.
 *
 * @param {Paper} paper The paper to determine the relevant words of.
 * @returns {WordCombination[]} Relevant words for this paper, filtered and sorted.
 */
function relevantWords(paper) {
  return getRelevantWords(paper.getText(), paper.getLocale());
}
module.exports = relevantWords;



},{"../stringProcessing/relevantWords":371}],337:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (paper) {
  return getSentences(paper.getText());
};


var getSentences = require("../stringProcessing/getSentences");
/**
 * @param {Paper} paper The paper to analyze.
 */


},{"../stringProcessing/getSentences":359}],338:[function(require,module,exports){
"use strict";
/**
 * Returns an array with exceptions for the sentence beginning researcher.
 * @returns {Array} The array filled with exceptions.
 */

module.exports = function () {
    return [
    // Definite articles:
    "el", "los", "la", "las",
    // Indefinite articles:
    "un", "una", "unas", "unos",
    // Numbers 1-10:
    "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez",
    // Demonstrative pronouns:
    "este", "estos", "esta", "estas", "ese", "esos", "esa", "esas", "aquel", "aquellos", "aquella", "aquellas", "esto", "eso", "aquello"];
};



},{}],339:[function(require,module,exports){
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
        // This export contains all of the above words.
        all: [].concat(articles, cardinalNumerals, ordinalNumerals, demonstrativePronouns, possessivePronouns, personalPronounsNominative, personalPronounsComitative, personalPronounsPrepositional, personalPronounsAccusative, quantifiers, indefinitePronouns, interrogativeDeterminers, interrogativePronouns, interrogativeProAdverbs, locativeAdverbs, prepositionalAdverbs, otherAuxiliaries, otherAuxiliariesInfinitive, copula, copulaInfinitive, prepositions, coordinatingConjunctions, correlativeConjunctions, subordinatingConjunctions, interviewVerbs, transitionWords, additionalTransitionWords, intensifiers, delexicalizedVerbs, delexicalizedVerbsInfinitive, interjections, generalAdjectivesAdverbs, recipeWords, vagueNouns, miscellaneous, titlesPreceding, titlesFollowing)
    };
};



},{"./transitionWords.js":340}],340:[function(require,module,exports){
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



},{}],341:[function(require,module,exports){
"use strict";
/** @module config/twoPartTransitionWords */
/**
 * Returns an array with two-part transition words to be used by the assessments.
 * @returns {Array} The array filled with two-part transition words.
 */

module.exports = function () {
  return [["de un lado", "de otra parte"], ["de un lado", "de otro"], ["no", "sino que"], ["no", "sino"], ["por un lado", "por otro lado"], ["por una parte", "por otra parte"], ["por una parte", "por otra"], ["tanto", "como"], ["bien", "bien"]];
};



},{}],342:[function(require,module,exports){
"use strict";
/** @module researches/stopWordsInKeyword */

var stopWordsInText = require("./stopWordsInText.js");
var escapeRegExp = require("lodash/escapeRegExp");
/**
 * Checks for the amount of stop words in the keyword.
 * @param {Paper} paper The Paper object to be checked against.
 * @returns {Array} All the stopwords that were found in the keyword.
 */
module.exports = function (paper) {
  var keyword = escapeRegExp(paper.getKeyword());
  return stopWordsInText(keyword);
};



},{"./stopWordsInText.js":343,"lodash/escapeRegExp":161}],343:[function(require,module,exports){
"use strict";

var stopwords = require("../config/stopwords.js")();
var toRegex = require("../stringProcessing/createWordRegex.js");
/**
 * Checks a text to see if there are any stopwords, that are defined in the stopwords config.
 *
 * @param {string} text The input text to match stopwords.
 * @returns {Array} An array with all stopwords found in the text.
 */
module.exports = function (text) {
    var i,
        matches = [];
    for (i = 0; i < stopwords.length; i++) {
        if (text.match(toRegex(stopwords[i])) !== null) {
            matches.push(stopwords[i]);
        }
    }
    return matches;
};



},{"../config/stopwords.js":247,"../stringProcessing/createWordRegex.js":354}],344:[function(require,module,exports){
"use strict";
/** @module researches/stopWordsInUrl */

var stopWordsInText = require("./stopWordsInText.js");
/**
 * Matches stopwords in the URL. Replaces - and _ with whitespace.
 * @param {Paper} paper The Paper object to get the url from.
 * @returns {Array} stopwords found in URL
 */
module.exports = function (paper) {
  return stopWordsInText(paper.getUrl().replace(/[-_]/g, " "));
};



},{"./stopWordsInText.js":343}],345:[function(require,module,exports){
"use strict";
/** @module analyses/isUrlTooLong */
/**
 * Checks if an URL is too long, based on slug and relative to keyword length.
 *
 * @param {object} paper the paper to run this assessment on
 * @returns {boolean} true if the URL is too long, false if it isn't
 */

module.exports = function (paper) {
    var urlLength = paper.getUrl().length;
    var keywordLength = paper.getKeyword().length;
    var maxUrlLength = 40;
    var maxSlugLength = 20;
    if (urlLength > maxUrlLength && urlLength > keywordLength + maxSlugLength) {
        return true;
    }
    return false;
};



},{}],346:[function(require,module,exports){
"use strict";

var wordCount = require("../stringProcessing/countWords.js");
/**
 * Count the words in the text
 * @param {Paper} paper The Paper object who's
 * @returns {number} The amount of words found in the text.
 */
module.exports = function (paper) {
  return wordCount(paper.getText());
};



},{"../stringProcessing/countWords.js":351}],347:[function(require,module,exports){
"use strict";

var Assessor = require("./assessor.js");
var introductionKeyword = require("./assessments/seo/introductionKeywordAssessment.js");
var keyphraseLength = require("./assessments/seo/keyphraseLengthAssessment.js");
var keywordDensity = require("./assessments/seo/keywordDensityAssessment.js");
var keywordStopWords = require("./assessments/seo/keywordStopWordsAssessment.js");
var metaDescriptionKeyword = require("./assessments/seo/metaDescriptionKeywordAssessment.js");
var MetaDescriptionLength = require("./assessments/seo/metaDescriptionLengthAssessment.js");
var SubheadingsKeyword = require("./assessments/seo/subheadingsKeywordAssessment.js");
var textCompetingLinks = require("./assessments/seo/textCompetingLinksAssessment.js");
var TextImages = require("./assessments/seo/textImagesAssessment.js");
var TextLength = require("./assessments/seo/textLengthAssessment.js");
var OutboundLinks = require("./assessments/seo/outboundLinksAssessment.js");
var internalLinks = require("./assessments/seo/internalLinksAssessment");
var titleKeyword = require("./assessments/seo/titleKeywordAssessment.js");
var TitleWidth = require("./assessments/seo/pageTitleWidthAssessment.js");
var UrlKeyword = require("./assessments/seo/urlKeywordAssessment.js");
var UrlLength = require("./assessments/seo/urlLengthAssessment.js");
var urlStopWords = require("./assessments/seo/urlStopWordsAssessment.js");
/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
var SEOAssessor = function SEOAssessor(i18n, options) {
  Assessor.call(this, i18n, options);
  this._assessments = [introductionKeyword, keyphraseLength, keywordDensity, keywordStopWords, metaDescriptionKeyword, new MetaDescriptionLength(), new SubheadingsKeyword(), textCompetingLinks, new TextImages(), new TextLength(), new OutboundLinks(), internalLinks, titleKeyword, new TitleWidth(), new UrlKeyword(), new UrlLength(), urlStopWords];
};
require("util").inherits(SEOAssessor, Assessor);
module.exports = SEOAssessor;



},{"./assessments/seo/internalLinksAssessment":226,"./assessments/seo/introductionKeywordAssessment.js":227,"./assessments/seo/keyphraseLengthAssessment.js":228,"./assessments/seo/keywordDensityAssessment.js":229,"./assessments/seo/keywordStopWordsAssessment.js":230,"./assessments/seo/metaDescriptionKeywordAssessment.js":231,"./assessments/seo/metaDescriptionLengthAssessment.js":232,"./assessments/seo/outboundLinksAssessment.js":233,"./assessments/seo/pageTitleWidthAssessment.js":234,"./assessments/seo/subheadingsKeywordAssessment.js":235,"./assessments/seo/textCompetingLinksAssessment.js":237,"./assessments/seo/textImagesAssessment.js":238,"./assessments/seo/textLengthAssessment.js":239,"./assessments/seo/titleKeywordAssessment.js":240,"./assessments/seo/urlKeywordAssessment.js":241,"./assessments/seo/urlLengthAssessment.js":242,"./assessments/seo/urlStopWordsAssessment.js":243,"./assessor.js":244,"util":224}],348:[function(require,module,exports){
"use strict";
/** @module stringProcessing/addWordboundary */
/**
 * Returns a string that can be used in a regex to match a matchString with word boundaries.
 *
 * @param {string} matchString The string to generate a regex string for.
 * @param {boolean} [positiveLookAhead] Boolean indicating whether or not to include a positive look ahead
 * for the word boundaries at the end.
 * @param {string} [extraWordBoundary] Extra characters to match a word boundary on.
 * @returns {string} A regex string that matches the matchString with word boundaries.
 */

module.exports = function (matchString) {
    var positiveLookAhead = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var extraWordBoundary = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

    var wordBoundary, wordBoundaryStart, wordBoundaryEnd;
    wordBoundary = "[ \\u00a0\xA0\\n\\r\\t.,'()\"+-;!?:/\xBB\xAB\u2039\u203A" + extraWordBoundary + "<>]";
    wordBoundaryStart = "(^|" + wordBoundary + ")";
    if (positiveLookAhead) {
        wordBoundary = "(?=" + wordBoundary + ")";
    }
    wordBoundaryEnd = "($|" + wordBoundary + ")";
    return wordBoundaryStart + matchString + wordBoundaryEnd;
};



},{}],349:[function(require,module,exports){
"use strict";
/** @module stringProcessing/checkNofollow */
/**
 * Checks if a links has a nofollow attribute. If it has, returns Nofollow, otherwise Dofollow.
 *
 * @param {string} text The text to check against.
 * @returns {string} Returns Dofollow or Nofollow.
 */

module.exports = function (text) {
    var linkFollow = "Dofollow";
    // Matches all nofollow links, case insensitive and global
    if (text.match(/rel=([\'\"])nofollow\1/ig) !== null) {
        linkFollow = "Nofollow";
    }
    return linkFollow;
};



},{}],350:[function(require,module,exports){
"use strict";
/** @module stringProcessing/countSentences */

var getSentences = require("../stringProcessing/getSentences.js");
/**
 * Counts the number of sentences in a given string.
 *
 * @param {string} text The text used to count sentences.
 * @returns {number} The number of sentences in the text.
 */
module.exports = function (text) {
    var sentences = getSentences(text);
    var sentenceCount = 0;
    for (var i = 0; i < sentences.length; i++) {
        sentenceCount++;
    }
    return sentenceCount;
};



},{"../stringProcessing/getSentences.js":359}],351:[function(require,module,exports){
"use strict";
/** @module stringProcessing/countWords */

var getWords = require("../stringProcessing/getWords.js");
/**
 * Calculates the wordcount of a certain text.
 *
 * @param {string} text The text to be counted.
 * @returns {int} The word count of the given text.
 */
module.exports = function (text) {
  return getWords(text).length;
};



},{"../stringProcessing/getWords.js":362}],352:[function(require,module,exports){
"use strict";
/** @module stringProcessing/createRegexFromArray */

var addWordBoundary = require("../stringProcessing/addWordboundary.js");
var map = require("lodash/map");
/**
 * Creates a regex of combined strings from the input array.
 *
 * @param {array} array The array with strings
 * @param {boolean} [disableWordBoundary] Boolean indicating whether or not to disable word boundaries
 * @returns {RegExp} regex The regex created from the array.
 */
module.exports = function (array, disableWordBoundary) {
    var regexString;
    var _disableWordBoundary = disableWordBoundary || false;
    var boundedArray = map(array, function (string) {
        if (_disableWordBoundary) {
            return string;
        }
        return addWordBoundary(string, true);
    });
    regexString = "(" + boundedArray.join(")|(") + ")";
    return new RegExp(regexString, "ig");
};



},{"../stringProcessing/addWordboundary.js":348,"lodash/map":195}],353:[function(require,module,exports){
"use strict";
/** @module stringProcessing/createRegexFromDoubleArray */

var addWordBoundary = require("../stringProcessing/addWordboundary.js");
/**
 * Creates a regex string of combined strings from the input array.
 * @param {array} array The array containing the various parts of a transition word combination.
 * @returns {array} The array with replaced entries.
 */
var wordCombinationToRegexString = function wordCombinationToRegexString(array) {
    array = array.map(function (word) {
        return addWordBoundary(word);
    });
    return array.join("(.*?)");
};
/**
 * Creates a regex of combined strings from the input array, containing arrays with two entries.
 * @param {array} array The array containing arrays.
 * @returns {RegExp} The regex created from the array.
 */
module.exports = function (array) {
    array = array.map(function (wordCombination) {
        return wordCombinationToRegexString(wordCombination);
    });
    var regexString = "(" + array.join(")|(") + ")";
    return new RegExp(regexString, "ig");
};



},{"../stringProcessing/addWordboundary.js":348}],354:[function(require,module,exports){
"use strict";
/** @module stringProcessing/stringToRegex */

var isUndefined = require("lodash/isUndefined");
var replaceDiacritics = require("../stringProcessing/replaceDiacritics.js");
var addWordBoundary = require("../stringProcessing/addWordboundary.js");
var sanitizeString = require("../stringProcessing/sanitizeString");
var escapeRegExp = require("lodash/escapeRegExp");
var memoize = require("lodash/memoize");
/**
 * Creates a regex from a string so it can be matched everywhere in the same way.
 *
 * @param {string} string The string to make a regex from.
 * @param {string} [extraBoundary=""] A string that is used as extra boundary for the regex.
 * @param {boolean} [doReplaceDiacritics=true] If set to false, it doesn't replace diacritics. Defaults to true.
 * @returns {RegExp} regex The regex made from the keyword
 */
module.exports = memoize(function (string, extraBoundary, doReplaceDiacritics) {
    if (isUndefined(extraBoundary)) {
        extraBoundary = "";
    }
    if (isUndefined(doReplaceDiacritics) || doReplaceDiacritics === true) {
        string = replaceDiacritics(string);
    }
    string = sanitizeString(string);
    string = escapeRegExp(string);
    string = addWordBoundary(string, false, extraBoundary);
    return new RegExp(string, "ig");
});



},{"../stringProcessing/addWordboundary.js":348,"../stringProcessing/replaceDiacritics.js":373,"../stringProcessing/sanitizeString":375,"lodash/escapeRegExp":161,"lodash/isUndefined":192,"lodash/memoize":196}],355:[function(require,module,exports){
"use strict";
/** @module stringProcessing/findKeywordInUrl */

var matchTextWithTransliteration = require("./matchTextWithTransliteration.js");
var escapeRegExp = require("lodash/escapeRegExp");
/**
 * Matches the keyword in the URL.
 *
 * @param {string} url The url to check for keyword
 * @param {string} keyword The keyword to check if it is in the URL
 * @param {string} locale The locale used for transliteration.
 * @returns {boolean} If a keyword is found, returns true
 */
module.exports = function (url, keyword, locale) {
    var formatUrl = url.match(/>(.*)/ig);
    keyword = escapeRegExp(keyword);
    if (formatUrl !== null) {
        formatUrl = formatUrl[0].replace(/<.*?>\s?/ig, "");
        return matchTextWithTransliteration(formatUrl, keyword, locale).length > 0;
    }
    return false;
};



},{"./matchTextWithTransliteration.js":367,"lodash/escapeRegExp":161}],356:[function(require,module,exports){
"use strict";
/** @module stringProcessing/getAlttagContent */

var stripSpaces = require("../stringProcessing/stripSpaces.js");
var regexAltTag = /alt=(['"])(.*?)\1/i;
/**
 * Checks for an alttag in the image and returns its content
 *
 * @param {String} text Textstring to match alt
 * @returns {String} the contents of the alttag, empty if none is set.
 */
module.exports = function (text) {
    var alt = "";
    var matches = text.match(regexAltTag);
    if (matches !== null) {
        alt = stripSpaces(matches[2]);
        alt = alt.replace(/&quot;/g, "\"");
        alt = alt.replace(/&#039;/g, "'");
    }
    return alt;
};



},{"../stringProcessing/stripSpaces.js":380}],357:[function(require,module,exports){
"use strict";
/** @module stringProcessing/getAnchorsFromText */
/**
 * Check for anchors in the textstring and returns them in an array.
 *
 * @param {String} text The text to check for matches.
 * @returns {Array} The matched links in text.
 */

module.exports = function (text) {
    var matches;
    // Regex matches everything between <a> and </a>
    matches = text.match(/<a(?:[^>]+)?>(.*?)<\/a>/ig);
    if (matches === null) {
        matches = [];
    }
    return matches;
};



},{}],358:[function(require,module,exports){
"use strict";
/** @module stringProcess/getLinkType */

var urlHelper = require("./url");
/**
 * Determines the type of link.
 *
 * @param {string} text String with anchor tag.
 * @param {string} url Url to match against.
 * @returns {string} The link type (other, external or internal).
 */
module.exports = function (text, url) {
    var linkType = "other";
    var anchorUrl = urlHelper.getFromAnchorTag(text);
    // Matches all links that start with http:// and https://, case insensitive and global
    if (anchorUrl.match(/https?:\/\//ig) !== null) {
        linkType = "external";
        if (urlHelper.getHostname(anchorUrl) === urlHelper.getHostname(url)) {
            linkType = "internal";
        }
    }
    return linkType;
};



},{"./url":386}],359:[function(require,module,exports){
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



},{"../helpers/html.js":263,"../stringProcessing/quotes.js":370,"../stringProcessing/unifyWhitespace.js":385,"lodash/filter":162,"lodash/flatMap":165,"lodash/forEach":167,"lodash/isEmpty":181,"lodash/isNaN":184,"lodash/isUndefined":192,"lodash/map":195,"lodash/memoize":196,"lodash/negate":198,"tokenizer2/core":219}],360:[function(require,module,exports){
"use strict";
/**
 * Returns all texts per subheading.
 * @param {string} text The text to analyze from.
 * @returns {Array} an array with text blocks per subheading.
 */

module.exports = function (text) {
  /*
   Matching this in a regex is pretty hard, since we need to find a way for matching the text after a heading, and before the end of the text.
   The hard thing capturing this is with a capture, it captures the next subheading as well, so it skips the next part of the text,
   since the subheading is already matched.
   For now we use this method to be sure we capture the right blocks of text. We remove all | 's from text,
   then replace all headings with a | and split on a |.
   */
  text = text.replace(/\|/ig, "");
  text = text.replace(/<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/ig, "|");
  var subheadings = text.split("|");
  /*
   * We never need the first entry, if the text starts with a subheading it will be empty, and if the text doesn't start with a subheading,
   * the text doesnt't belong to a subheading, so it can be removed
   */
  subheadings.shift();
  return subheadings;
};



},{}],361:[function(require,module,exports){
"use strict";

var map = require("lodash/map");
/**
 * Gets all subheadings from the text and returns these in an array.
 *
 * @param {string} text The text to return the headings from.
 * @returns {Array} Matches of subheadings in the text, first key is everything including tags, second is the heading
 *                  level, third is the content of the subheading.
 */
function getSubheadings(text) {
    var subheadings = [];
    var regex = /<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/ig;
    var match;
    while ((match = regex.exec(text)) !== null) {
        subheadings.push(match);
    }
    return subheadings;
}
/**
 * Gets the content of subheadings in the text
 *
 * @param {string} text The text to get the subheading contents from.
 * @returns {Array<string>} A list of all the subheadings with their content.
 */
function getSubheadingContents(text) {
    var subheadings = getSubheadings(text);
    subheadings = map(subheadings, function (subheading) {
        return subheading[0];
    });
    return subheadings;
}
module.exports = {
    getSubheadings: getSubheadings,
    getSubheadingContents: getSubheadingContents
};



},{"lodash/map":195}],362:[function(require,module,exports){
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



},{"./removePunctuation.js":372,"./stripHTMLTags.js":377,"./stripSpaces.js":380,"lodash/filter":162,"lodash/map":195}],363:[function(require,module,exports){
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



},{"./matchStringWithRegex.js":366}],364:[function(require,module,exports){
"use strict";

var isUndefined = require("lodash/isUndefined");
var forEach = require("lodash/forEach");
var stripSpaces = require("../stringProcessing/stripSpaces.js");
var matchWordInSentence = require("../stringProcessing/matchWordInSentence.js").isWordInSentence;
var characterInBoundary = require("../stringProcessing/matchWordInSentence.js").characterInBoundary;
/**
 * Returns the indices of a string in a text. If it is found multiple times, it will return multiple indices.
 *
 * @param {string} word The word to find in the text.
 * @param {string} text The text to check for the given word.
 * @returns {Array} All indices found.
 */
function getIndicesByWord(word, text) {
    var startIndex = 0;
    var searchStringLength = word.length;
    var index,
        indices = [];
    while ((index = text.indexOf(word, startIndex)) > -1) {
        // Check if the previous and next character are word boundaries to determine if a complete word was detected
        var isPreviousCharacterWordBoundary = characterInBoundary(text[index - 1]) || index === 0;
        var isNextCharacterWordBoundary = characterInBoundary(text[index + searchStringLength]) || text.length === index + searchStringLength;
        if (isPreviousCharacterWordBoundary && isNextCharacterWordBoundary) {
            indices.push({
                index: index,
                match: word
            });
        }
        startIndex = index + searchStringLength;
    }
    return indices;
}
/**
 * Matches string with an array, returns the word and the index it was found on.
 *
 * @param {Array} words The array with strings to match.
 * @param {string} text The text to match the strings from the array to.
 * @returns {Array} The array with words, containing the index of the match and the matched string.
 * Returns an empty array if none are found.
 */
var getIndicesByWordList = function getIndicesByWordList(words, text) {
    var matchedWords = [];
    forEach(words, function (word) {
        word = stripSpaces(word);
        if (!matchWordInSentence(word, text)) {
            return;
        }
        matchedWords = matchedWords.concat(getIndicesByWord(word, text));
    });
    return matchedWords;
};
/**
 * Sorts the array on the index property of each entry.
 *
 * @param {Array} indices The array with indices.
 * @returns {Array} The sorted array with indices.
 */
var sortIndices = function sortIndices(indices) {
    return indices.sort(function (a, b) {
        return a.index > b.index;
    });
};
/**
 * Filters duplicate entries if the indices overlap.
 *
 * @param {Array} indices The array with indices to be filtered.
 * @returns {Array} The filtered array.
 */
var filterIndices = function filterIndices(indices) {
    indices = sortIndices(indices);
    var filtered = [];
    for (var i = 0; i < indices.length; i++) {
        // If the next index is within the range of the current index and the length of the word, remove it
        // This makes sure we don't match combinations twice, like "even though" and "though".
        if (!isUndefined(indices[i + 1]) && indices[i + 1].index < indices[i].index + indices[i].match.length) {
            filtered.push(indices[i]);
            // Adds 1 to i, so we skip the next index that is overlapping with the current index.
            i++;
            continue;
        }
        filtered.push(indices[i]);
    }
    return filtered;
};
module.exports = {
    getIndicesByWord: getIndicesByWord,
    getIndicesByWordList: getIndicesByWordList,
    filterIndices: filterIndices,
    sortIndices: sortIndices
};



},{"../stringProcessing/matchWordInSentence.js":369,"../stringProcessing/stripSpaces.js":380,"lodash/forEach":167,"lodash/isUndefined":192}],365:[function(require,module,exports){
"use strict";

var map = require("lodash/map");
var flatMap = require("lodash/flatMap");
var filter = require("lodash/filter");
var getBlocks = require("../helpers/html").getBlocks;
/**
 * Matches the paragraphs in <p>-tags and returns the text in them.
 * @param {string} text The text to match paragraph in.
 * @returns {array} An array containing all paragraphs texts.
 */
var getParagraphsInTags = function getParagraphsInTags(text) {
    var paragraphs = [];
    // Matches everything between the <p> and </p> tags.
    var regex = /<p(?:[^>]+)?>(.*?)<\/p>/ig;
    var match;
    while ((match = regex.exec(text)) !== null) {
        paragraphs.push(match);
    }
    // Returns only the text from within the paragraph tags.
    return map(paragraphs, function (paragraph) {
        return paragraph[1];
    });
};
/**
 * Returns an array with all paragraphs from the text.
 * @param {string} text The text to match paragraph in.
 * @returns {Array} The array containing all paragraphs from the text.
 */
module.exports = function (text) {
    var paragraphs = getParagraphsInTags(text);
    if (paragraphs.length > 0) {
        return paragraphs;
    }
    // If no <p> tags found, split on double linebreaks.
    var blocks = getBlocks(text);
    blocks = filter(blocks, function (block) {
        // Match explicit paragraph tags, or if a block has no HTML tags.
        return 0 !== block.indexOf("<h");
    });
    paragraphs = flatMap(blocks, function (block) {
        return block.split("\n\n");
    });
    if (paragraphs.length > 0) {
        return paragraphs;
    }
    // If no paragraphs are found, return an array containing the entire text.
    return [text];
};



},{"../helpers/html":263,"lodash/filter":162,"lodash/flatMap":165,"lodash/map":195}],366:[function(require,module,exports){
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



},{}],367:[function(require,module,exports){
"use strict";

var map = require("lodash/map");
var addWordBoundary = require("./addWordboundary.js");
var stripSpaces = require("./stripSpaces.js");
var transliterate = require("./transliterate.js");
/**
 * Creates a regex from the keyword with included wordboundaries.
 * @param {string} keyword The keyword to create a regex from.
 * @returns {RegExp} Regular expression of the keyword with wordboundaries.
 */
var toRegex = function toRegex(keyword) {
    keyword = addWordBoundary(keyword);
    return new RegExp(keyword, "ig");
};
/**
 * Matches a string with and without transliteration.
 * @param {string} text The text to match.
 * @param {string} keyword The keyword to match in the text.
 * @param {string} locale The locale used for transliteration.
 * @returns {Array} All matches from the original as the transliterated text and keyword.
 */
module.exports = function (text, keyword, locale) {
    var keywordRegex = toRegex(keyword);
    var matches = text.match(keywordRegex) || [];
    text = text.replace(keywordRegex, "");
    var transliterateKeyword = transliterate(keyword, locale);
    var transliterateKeywordRegex = toRegex(transliterateKeyword);
    var transliterateMatches = text.match(transliterateKeywordRegex) || [];
    var combinedArray = matches.concat(transliterateMatches);
    return map(combinedArray, function (keyword) {
        return stripSpaces(keyword);
    });
};



},{"./addWordboundary.js":348,"./stripSpaces.js":380,"./transliterate.js":384,"lodash/map":195}],368:[function(require,module,exports){
"use strict";
/** @module stringProcessing/matchTextWithWord */

var stripSomeTags = require("../stringProcessing/stripNonTextTags.js");
var unifyWhitespace = require("../stringProcessing/unifyWhitespace.js").unifyAllSpaces;
var matchStringWithTransliteration = require("../stringProcessing/matchTextWithTransliteration.js");
/**
 * Returns the number of matches in a given string
 *
 * @param {string} text The text to use for matching the wordToMatch.
 * @param {string} wordToMatch The word to match in the text
 * @param {string} locale The locale used for transliteration.
 * @param {string} [extraBoundary] An extra string that can be added to the wordboundary regex
 * @returns {number} The amount of matches found.
 */
module.exports = function (text, wordToMatch, locale, extraBoundary) {
  text = stripSomeTags(text);
  text = unifyWhitespace(text);
  var matches = matchStringWithTransliteration(text, wordToMatch, locale, extraBoundary);
  return matches.length;
};



},{"../stringProcessing/matchTextWithTransliteration.js":367,"../stringProcessing/stripNonTextTags.js":378,"../stringProcessing/unifyWhitespace.js":385}],369:[function(require,module,exports){
"use strict";

var wordBoundaries = require("../config/wordBoundaries.js")();
var includes = require("lodash/includes");
var addWordBoundary = require("./addWordboundary.js");
/**
 * Checks whether a character is present in the list of word boundaries.
 *
 * @param {string} character The character to look for.
 * @returns {boolean} Whether or not the character is present in the list of word boundaries.
 */
var characterInBoundary = function characterInBoundary(character) {
    return includes(wordBoundaries, character);
};
/**
 * Checks whether a word is present in a sentence.
 *
 * @param {string} word The word to search for in the sentence.
 * @param {string} sentence The sentence to look through.
 * @returns {boolean} Whether or not the word is present in the sentence.
 */
var isWordInSentence = function isWordInSentence(word, sentence) {
    // To ensure proper matching, make everything lowercase.
    word = word.toLocaleLowerCase();
    sentence = sentence.toLocaleLowerCase();
    var wordWithBoundaries = addWordBoundary(word);
    var occurrenceStart = sentence.search(new RegExp(wordWithBoundaries, "ig"));
    // Return false if no match has been found.
    if (occurrenceStart === -1) {
        return false;
    }
    /*
    If there is a word boundary before the matched word, the regex includes this word boundary in the match.
    This means that occurrenceStart is the index of the word boundary before the match. Therefore 1 has to
    be added to occurrenceStart, except when there is no word boundary before the match (i.e. at the start
    of a sentence).
     */
    if (occurrenceStart > 0) {
        occurrenceStart += 1;
    }
    var occurrenceEnd = occurrenceStart + word.length;
    // Check if the previous and next character are word boundaries to determine if a complete word was detected
    var previousCharacter = characterInBoundary(sentence[occurrenceStart - 1]) || occurrenceStart === 0;
    var nextCharacter = characterInBoundary(sentence[occurrenceEnd]) || occurrenceEnd === sentence.length;
    return previousCharacter && nextCharacter;
};
module.exports = {
    characterInBoundary: characterInBoundary,
    isWordInSentence: isWordInSentence
};



},{"../config/wordBoundaries.js":254,"./addWordboundary.js":348,"lodash/includes":173}],370:[function(require,module,exports){
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



},{}],371:[function(require,module,exports){
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



},{"../helpers/getLanguage.js":260,"../researches/dutch/functionWords.js":276,"../researches/english/functionWords.js":283,"../researches/french/functionWords.js":298,"../researches/german/functionWords.js":305,"../researches/italian/functionWords.js":326,"../researches/spanish/functionWords.js":339,"../stringProcessing/getSentences.js":359,"../stringProcessing/getWords.js":362,"../stringProcessing/quotes.js":370,"../values/WordCombination.js":393,"lodash/filter":162,"lodash/flatMap":165,"lodash/forEach":167,"lodash/has":169,"lodash/includes":173,"lodash/intersection":175,"lodash/isEmpty":181,"lodash/map":195,"lodash/take":206,"lodash/values":213}],372:[function(require,module,exports){
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



},{}],373:[function(require,module,exports){
"use strict";
/** @module stringProcessing/replaceDiacritics */

var diacriticsRemovalMap = require("../config/diacritics.js");
/**
 * Replaces all diacritics from the text based on the diacritics removal map.
 *
 * @param {string} text The text to remove diacritics from.
 * @returns {string} The text with all diacritics replaced.
 */
module.exports = function (text) {
    var map = diacriticsRemovalMap();
    for (var i = 0; i < map.length; i++) {
        text = text.replace(map[i].letters, map[i].base);
    }
    return text;
};



},{"../config/diacritics.js":245}],374:[function(require,module,exports){
"use strict";
/** @module stringProcessing/replaceString */
/**
 * Replaces string with a replacement in text
 *
 * @param {string} text The textstring to remove
 * @param {string} stringToReplace The string to replace
 * @param {string} replacement The replacement of the string
 * @returns {string} The text with the string replaced
 */

module.exports = function (text, stringToReplace, replacement) {
  text = text.replace(stringToReplace, replacement);
  return text;
};



},{}],375:[function(require,module,exports){
"use strict";
/** @module stringProcessing/sanitizeString */

var stripTags = require("../stringProcessing/stripHTMLTags.js").stripFullTags;
var stripSpaces = require("../stringProcessing/stripSpaces.js");
/**
 * Strip HTMLtags characters from string that break regex
 *
 * @param {String} text The text to strip the characters from.
 * @returns {String} The text without characters.
 */
module.exports = function (text) {
  text = stripTags(text);
  text = stripSpaces(text);
  return text;
};



},{"../stringProcessing/stripHTMLTags.js":377,"../stringProcessing/stripSpaces.js":380}],376:[function(require,module,exports){
"use strict";

var wordCount = require("./countWords.js");
var forEach = require("lodash/forEach");
var stripHTMLTags = require("./stripHTMLTags.js").stripFullTags;
/**
 * Returns an array with the number of words in a sentence.
 * @param {Array} sentences Array with sentences from text.
 * @returns {Array} Array with amount of words in each sentence.
 */
module.exports = function (sentences) {
    var sentencesWordCount = [];
    forEach(sentences, function (sentence) {
        // For counting words we want to omit the HTMLtags.
        var strippedSentence = stripHTMLTags(sentence);
        var length = wordCount(strippedSentence);
        if (length <= 0) {
            return;
        }
        sentencesWordCount.push({
            sentence: sentence,
            sentenceLength: wordCount(sentence)
        });
    });
    return sentencesWordCount;
};



},{"./countWords.js":351,"./stripHTMLTags.js":377,"lodash/forEach":167}],377:[function(require,module,exports){
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



},{"../helpers/html.js":263,"../stringProcessing/stripSpaces.js":380}],378:[function(require,module,exports){
"use strict";
/** @module stringProcessing/stripNonTextTags */

var stripSpaces = require("../stringProcessing/stripSpaces.js");
/**
 * Strips all tags from the text, except li, p, dd and h1-h6 tags from the text that contain content to check.
 *
 * @param {string} text The text to strip tags from
 * @returns {string} The text stripped of tags, except for li, p, dd and h1-h6 tags.
 */
module.exports = function (text) {
  text = text.replace(/<(?!li|\/li|p|\/p|h1|\/h1|h2|\/h2|h3|\/h3|h4|\/h4|h5|\/h5|h6|\/h6|dd).*?\>/g, "");
  text = stripSpaces(text);
  return text;
};



},{"../stringProcessing/stripSpaces.js":380}],379:[function(require,module,exports){
"use strict";
/** @module stringProcessing/stripNumbers */

var stripSpaces = require("../stringProcessing/stripSpaces.js");
/**
 * Removes all words comprised only of numbers.
 *
 * @param {string} text to remove words
 * @returns {string} The text with numberonly words removed.
 */
module.exports = function (text) {
    // Remove "words" comprised only of numbers
    text = text.replace(/\b[0-9]+\b/g, "");
    text = stripSpaces(text);
    if (text === ".") {
        text = "";
    }
    return text;
};



},{"../stringProcessing/stripSpaces.js":380}],380:[function(require,module,exports){
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



},{}],381:[function(require,module,exports){
"use strict";

var replaceString = require("../stringProcessing/replaceString.js");
var removalWords = require("../config/removalWords.js")();
var matchTextWithTransliteration = require("../stringProcessing/matchTextWithTransliteration.js");
/**
 * Matches the keyword in an array of strings
 *
 * @param {Array} matches The array with the matched headings.
 * @param {String} keyword The keyword to match
 * @param {string} locale The locale used for transliteration.
 * @returns {number} The number of occurrences of the keyword in the headings.
 */
module.exports = function (matches, keyword, locale) {
    var foundInHeader;
    if (matches === null) {
        foundInHeader = -1;
    } else {
        foundInHeader = 0;
        for (var i = 0; i < matches.length; i++) {
            // TODO: This replaceString call seemingly doesn't work, as no replacement value is being sent to the .replace method in replaceString
            var formattedHeaders = replaceString(matches[i], removalWords);
            if (matchTextWithTransliteration(formattedHeaders, keyword, locale).length > 0 || matchTextWithTransliteration(matches[i], keyword, locale).length > 0) {
                foundInHeader++;
            }
        }
    }
    return foundInHeader;
};



},{"../config/removalWords.js":246,"../stringProcessing/matchTextWithTransliteration.js":367,"../stringProcessing/replaceString.js":374}],382:[function(require,module,exports){
"use strict";

var isUndefined = require("lodash/isUndefined");
var pick = require("lodash/pick");
/**
 * Represents a partial deviation when counting syllables
 *
 * @param {Object} options Extra options about how to match this fragment.
 * @param {string} options.location The location in the word where this deviation can occur.
 * @param {string} options.word The actual string that should be counted differently.
 * @param {number} options.syllables The amount of syllables this fragment has.
 * @param {string[]} [options.notFollowedBy] A list of characters that this fragment shouldn't be followed with.
 * @param {string[]} [options.alsoFollowedBy] A list of characters that this fragment could be followed with.
 *
 * @constructor
 */
function DeviationFragment(options) {
    this._location = options.location;
    this._fragment = options.word;
    this._syllables = options.syllables;
    this._regex = null;
    this._options = pick(options, ["notFollowedBy", "alsoFollowedBy"]);
}
/**
 * Creates a regex that matches this fragment inside a word.
 *
 * @returns {void}
 */
DeviationFragment.prototype.createRegex = function () {
    var regexString = "";
    var options = this._options;
    var fragment = this._fragment;
    if (!isUndefined(options.notFollowedBy)) {
        fragment += "(?![" + options.notFollowedBy.join("") + "])";
    }
    if (!isUndefined(options.alsoFollowedBy)) {
        fragment += "[" + options.alsoFollowedBy.join("") + "]?";
    }
    switch (this._location) {
        case "atBeginning":
            regexString = "^" + fragment;
            break;
        case "atEnd":
            regexString = fragment + "$";
            break;
        case "atBeginningOrEnd":
            regexString = "(^" + fragment + ")|(" + fragment + "$)";
            break;
        default:
            regexString = fragment;
            break;
    }
    this._regex = new RegExp(regexString);
};
/**
 * Returns the regex that matches this fragment inside a word.
 *
 * @returns {RegExp} The regexp that matches this fragment.
 */
DeviationFragment.prototype.getRegex = function () {
    if (null === this._regex) {
        this.createRegex();
    }
    return this._regex;
};
/**
 * Returns whether or not this fragment occurs in a word.
 *
 * @param {string} word The word to match the fragment in.
 * @returns {boolean} Whether or not this fragment occurs in a word.
 */
DeviationFragment.prototype.occursIn = function (word) {
    var regex = this.getRegex();
    return regex.test(word);
};
/**
 * Removes this fragment from the given word.
 *
 * @param {string} word The word to remove this fragment from.
 * @returns {string} The modified word.
 */
DeviationFragment.prototype.removeFrom = function (word) {
    // Replace by a space to keep the remaining parts separated.
    return word.replace(this._fragment, " ");
};
/**
 * Returns the amount of syllables for this fragment.
 *
 * @returns {number} The amount of syllables for this fragment.
 */
DeviationFragment.prototype.getSyllables = function () {
    return this._syllables;
};
module.exports = DeviationFragment;



},{"lodash/isUndefined":192,"lodash/pick":200}],383:[function(require,module,exports){
"use strict";
/** @module stringProcessing/countSyllables */

var syllableMatchers = require("../../config/syllables.js");
var getWords = require("../getWords.js");
var forEach = require("lodash/forEach");
var filter = require("lodash/filter");
var find = require("lodash/find");
var isUndefined = require("lodash/isUndefined");
var map = require("lodash/map");
var sum = require("lodash/sum");
var memoize = require("lodash/memoize");
var flatMap = require("lodash/flatMap");
var SyllableCountIterator = require("../../helpers/syllableCountIterator.js");
var DeviationFragment = require("./DeviationFragment");
/**
 * Counts vowel groups inside a word.
 *
 * @param {string} word A text with words to count syllables.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {number} the syllable count.
 */
var countVowelGroups = function countVowelGroups(word, locale) {
    var numberOfSyllables = 0;
    var vowelRegex = new RegExp("[^" + syllableMatchers(locale).vowels + "]", "ig");
    var foundVowels = word.split(vowelRegex);
    var filteredWords = filter(foundVowels, function (vowel) {
        return vowel !== "";
    });
    numberOfSyllables += filteredWords.length;
    return numberOfSyllables;
};
/**
 * Counts the syllables using vowel exclusions. These are used for groups of vowels that are more or less
 * than 1 syllable.
 *
 * @param {String} word The word to count syllables of.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {number} The number of syllables found in the given word.
 */
var countVowelDeviations = function countVowelDeviations(word, locale) {
    var syllableCountIterator = new SyllableCountIterator(syllableMatchers(locale));
    return syllableCountIterator.countSyllables(word);
};
/**
 * Returns the number of syllables for the word if it is in the list of full word deviations.
 *
 * @param {String} word The word to retrieve the syllables for.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {number} The number of syllables found.
 */
var countFullWordDeviations = function countFullWordDeviations(word, locale) {
    var fullWordDeviations = syllableMatchers(locale).deviations.words.full;
    var deviation = find(fullWordDeviations, function (fullWordDeviation) {
        return fullWordDeviation.word === word;
    });
    if (!isUndefined(deviation)) {
        return deviation.syllables;
    }
    return 0;
};
/**
 * Creates an array of deviation fragments for a certain locale.
 *
 * @param {Object} syllableConfig Syllable config for a certain locale.
 * @returns {DeviationFragment[]} A list of deviation fragments
 */
function createDeviationFragments(syllableConfig) {
    var deviationFragments = [];
    var deviations = syllableConfig.deviations;
    if (!isUndefined(deviations.words) && !isUndefined(deviations.words.fragments)) {
        deviationFragments = flatMap(deviations.words.fragments, function (fragments, fragmentLocation) {
            return map(fragments, function (fragment) {
                fragment.location = fragmentLocation;
                return new DeviationFragment(fragment);
            });
        });
    }
    return deviationFragments;
}
var createDeviationFragmentsMemoized = memoize(createDeviationFragments);
/**
 * Counts syllables in partial exclusions. If these are found, returns the number of syllables  found, and the modified word.
 * The word is modified so the excluded part isn't counted by the normal syllable counter.
 *
 * @param {String} word The word to count syllables of.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {object} The number of syllables found and the modified word.
 */
var countPartialWordDeviations = function countPartialWordDeviations(word, locale) {
    var deviationFragments = createDeviationFragmentsMemoized(syllableMatchers(locale));
    var remainingParts = word;
    var syllableCount = 0;
    forEach(deviationFragments, function (deviationFragment) {
        if (deviationFragment.occursIn(remainingParts)) {
            remainingParts = deviationFragment.removeFrom(remainingParts);
            syllableCount += deviationFragment.getSyllables();
        }
    });
    return { word: remainingParts, syllableCount: syllableCount };
};
/**
 * Count the number of syllables in a word, using vowels and exceptions.
 *
 * @param {String} word The word to count the number of syllables of.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {number} The number of syllables found in a word.
 */
var countUsingVowels = function countUsingVowels(word, locale) {
    var syllableCount = 0;
    syllableCount += countVowelGroups(word, locale);
    syllableCount += countVowelDeviations(word, locale);
    return syllableCount;
};
/**
 * Counts the number of syllables in a word.
 *
 * @param {string} word The word to count syllables of.
 * @param {string} locale The locale of the word.
 * @returns {number} The syllable count for the word.
 */
var countSyllablesInWord = function countSyllablesInWord(word, locale) {
    var syllableCount = 0;
    var fullWordExclusion = countFullWordDeviations(word, locale);
    if (fullWordExclusion !== 0) {
        return fullWordExclusion;
    }
    var partialExclusions = countPartialWordDeviations(word, locale);
    word = partialExclusions.word;
    syllableCount += partialExclusions.syllableCount;
    syllableCount += countUsingVowels(word, locale);
    return syllableCount;
};
/**
 * Counts the number of syllables in a text per word based on vowels.
 * Uses exclusion words for words that cannot be matched with vowel matching.
 *
 * @param {String} text The text to count the syllables of.
 * @param {String} locale The locale to use for counting syllables.
 * @returns {int} The total number of syllables found in the text.
 */
var countSyllablesInText = function countSyllablesInText(text, locale) {
    text = text.toLocaleLowerCase();
    var words = getWords(text);
    var syllableCounts = map(words, function (word) {
        return countSyllablesInWord(word, locale);
    });
    return sum(syllableCounts);
};
module.exports = countSyllablesInText;



},{"../../config/syllables.js":248,"../../helpers/syllableCountIterator.js":265,"../getWords.js":362,"./DeviationFragment":382,"lodash/filter":162,"lodash/find":163,"lodash/flatMap":165,"lodash/forEach":167,"lodash/isUndefined":192,"lodash/map":195,"lodash/memoize":196,"lodash/sum":205}],384:[function(require,module,exports){
"use strict";
/** @module stringProcessing/replaceDiacritics */

var transliterationsMap = require("../config/transliterations.js");
/**
 * Replaces all special characters from the text based on the transliterations map.
 *
 * @param {string} text The text to remove special characters from.
 * @param {string} locale The locale.
 * @returns {string} The text with all special characters replaced.
 */
module.exports = function (text, locale) {
    var map = transliterationsMap(locale);
    for (var i = 0; i < map.length; i++) {
        text = text.replace(map[i].letter, map[i].alternative);
    }
    return text;
};



},{"../config/transliterations.js":253}],385:[function(require,module,exports){
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



},{}],386:[function(require,module,exports){
"use strict";

var urlFromAnchorRegex = /href=(["'])([^"']+)\1/i;
var urlMethods = require("url");
/**
 * Removes a hash from a URL, assumes a well formed URL.
 *
 * @param {string} url The URL to remove a hash from.
 * @returns {string} The URL without the hash.
 */
function removeHash(url) {
    return url.split("#")[0];
}
/**
 * Removes all query args from a URL, assumes a well formed URL.
 *
 * @param {string} url The URL to remove the query args from.
 * @returns {string} The URL without the query args.
 */
function removeQueryArgs(url) {
    return url.split("?")[0];
}
/**
 * Removes the trailing slash of a URL.
 *
 * @param {string} url The URL to remove the trailing slash from.
 * @returns {string} A URL without a trailing slash.
 */
function removeTrailingSlash(url) {
    return url.replace(/\/$/, "");
}
/**
 * Adds a trailing slash to a URL if it is not present.
 *
 * @param {string} url The URL to add a trailing slash to.
 * @returns {string} A URL with a trailing slash.
 */
function addTrailingSlash(url) {
    return removeTrailingSlash(url) + "/";
}
/**
 * Retrieves the URL from an anchor tag
 *
 * @param {string} anchorTag An anchor tag.
 * @returns {string} The URL in the anchor tag.
 */
function getFromAnchorTag(anchorTag) {
    var urlMatch = urlFromAnchorRegex.exec(anchorTag);
    return urlMatch === null ? "" : urlMatch[2];
}
/**
 * Returns whether or not the given URLs are equal
 *
 * @param {string} urlA The first URL to compare.
 * @param {string} urlB The second URL to compare.
 *
 * @returns {boolean} Whether or not the given URLs are equal.
 */
function areEqual(urlA, urlB) {
    // Make sure we are comparing URLs without query arguments and hashes.
    urlA = removeQueryArgs(removeHash(urlA));
    urlB = removeQueryArgs(removeHash(urlB));
    return addTrailingSlash(urlA) === addTrailingSlash(urlB);
}
/**
 * Returns the domain name of a URL
 *
 * @param {string} url The URL to retrieve the domain name of.
 * @returns {string} The domain name of the URL.
 */
function getHostname(url) {
    url = urlMethods.parse(url);
    return url.hostname;
}
module.exports = {
    removeHash: removeHash,
    removeQueryArgs: removeQueryArgs,
    removeTrailingSlash: removeTrailingSlash,
    addTrailingSlash: addTrailingSlash,
    getFromAnchorTag: getFromAnchorTag,
    areEqual: areEqual,
    getHostname: getHostname
};



},{"url":220}],387:[function(require,module,exports){
"use strict";

var isUndefined = require("lodash/isUndefined");
var isNumber = require("lodash/isNumber");
/**
 * A function that only returns an empty that can be used as an empty marker
 *
 * @returns {Array} A list of empty marks.
 */
var emptyMarker = function emptyMarker() {
    return [];
};
/**
 * Construct the AssessmentResult value object.
 *
 * @param {Object} [values] The values for this assessment result.
 *
 * @constructor
 */
var AssessmentResult = function AssessmentResult(values) {
    this._hasScore = false;
    this._identifier = "";
    this._hasMarks = false;
    this._marker = emptyMarker;
    this.score = 0;
    this.text = "";
    if (isUndefined(values)) {
        values = {};
    }
    if (!isUndefined(values.score)) {
        this.setScore(values.score);
    }
    if (!isUndefined(values.text)) {
        this.setText(values.text);
    }
};
/**
 * Check if a score is available.
 * @returns {boolean} Whether or not a score is available.
 */
AssessmentResult.prototype.hasScore = function () {
    return this._hasScore;
};
/**
 * Get the available score
 * @returns {number} The score associated with the AssessmentResult.
 */
AssessmentResult.prototype.getScore = function () {
    return this.score;
};
/**
 * Set the score for the assessment.
 * @param {number} score The score to be used for the score property
 * @returns {void}
 */
AssessmentResult.prototype.setScore = function (score) {
    if (isNumber(score)) {
        this.score = score;
        this._hasScore = true;
    }
};
/**
 * Check if a text is available.
 * @returns {boolean} Whether or not a text is available.
 */
AssessmentResult.prototype.hasText = function () {
    return this.text !== "";
};
/**
 * Get the available text
 * @returns {string} The text associated with the AssessmentResult.
 */
AssessmentResult.prototype.getText = function () {
    return this.text;
};
/**
 * Set the text for the assessment.
 * @param {string} text The text to be used for the text property
 * @returns {void}
 */
AssessmentResult.prototype.setText = function (text) {
    if (isUndefined(text)) {
        text = "";
    }
    this.text = text;
};
/**
 * Sets the identifier
 *
 * @param {string} identifier An alphanumeric identifier for this result.
 * @returns {void}
 */
AssessmentResult.prototype.setIdentifier = function (identifier) {
    this._identifier = identifier;
};
/**
 * Gets the identifier
 *
 * @returns {string} An alphanumeric identifier for this result.
 */
AssessmentResult.prototype.getIdentifier = function () {
    return this._identifier;
};
/**
 * Sets the marker, a pure function that can return the marks for a given Paper
 *
 * @param {Function} marker The marker to set.
 * @returns {void}
 */
AssessmentResult.prototype.setMarker = function (marker) {
    this._marker = marker;
};
/**
 * Returns whether or not this result has a marker that can be used to mark for a given Paper
 *
 * @returns {boolean} Whether or this result has a marker.
 */
AssessmentResult.prototype.hasMarker = function () {
    return this._hasMarks && this._marker !== emptyMarker;
};
/**
 * Gets the marker, a pure function that can return the marks for a given Paper
 *
 * @returns {Function} The marker.
 */
AssessmentResult.prototype.getMarker = function () {
    return this._marker;
};
/**
 * Sets the value of _hasMarks to determine if there is something to mark.
 *
 * @param {boolean} hasMarks Is there something to mark.
 * @returns {void}
 */
AssessmentResult.prototype.setHasMarks = function (hasMarks) {
    this._hasMarks = hasMarks;
};
/**
 * Returns the value of _hasMarks to determine if there is something to mark.
 *
 * @returns {boolean} Is there something to mark.
 */
AssessmentResult.prototype.hasMarks = function () {
    return this._hasMarks;
};
module.exports = AssessmentResult;



},{"lodash/isNumber":185,"lodash/isUndefined":192}],388:[function(require,module,exports){
"use strict";

var defaults = require("lodash/defaults");
/**
 * Represents a marked piece of text
 *
 * @param {Object} properties The properties of this Mark.
 * @param {string} properties.original The original text that should be marked.
 * @param {string} properties.marked The new text including marks.
 * @constructor
 */
function Mark(properties) {
  defaults(properties, { original: "", marked: "" });
  this._properties = properties;
}
/**
 * Returns the original text
 *
 * @returns {string} The original text.
 */
Mark.prototype.getOriginal = function () {
  return this._properties.original;
};
/**
 * Returns the marked text
 *
 * @returns {string} The replaced text.
 */
Mark.prototype.getMarked = function () {
  return this._properties.marked;
};
/**
 * Applies this mark to the given text
 *
 * @param {string} text The original text without the mark applied.
 * @returns {string} The A new text with the mark applied to it.
 */
Mark.prototype.applyWithReplace = function (text) {
  // Cute method to replace everything in a string without using regex.
  return text.split(this._properties.original).join(this._properties.marked);
};
module.exports = Mark;



},{"lodash/defaults":158}],389:[function(require,module,exports){
"use strict";

var defaults = require("lodash/defaults");
/**
 * Default attributes to be used by the Paper if they are left undefined.
 * @type {{keyword: string, description: string, title: string, url: string}}
 */
var defaultAttributes = {
    keyword: "",
    description: "",
    title: "",
    titleWidth: 0,
    url: "",
    locale: "en_US",
    permalink: ""
};
/**
 * Construct the Paper object and set the keyword property.
 * @param {string} text The text to use in the analysis.
 * @param {object} attributes The object containing all attributes.
 * @constructor
 */
var Paper = function Paper(text, attributes) {
    this._text = text || "";
    attributes = attributes || {};
    defaults(attributes, defaultAttributes);
    if (attributes.locale === "") {
        attributes.locale = defaultAttributes.locale;
    }
    this._attributes = attributes;
};
/**
 * Check whether a keyword is available.
 * @returns {boolean} Returns true if the Paper has a keyword.
 */
Paper.prototype.hasKeyword = function () {
    return this._attributes.keyword !== "";
};
/**
 * Return the associated keyword or an empty string if no keyword is available.
 * @returns {string} Returns Keyword
 */
Paper.prototype.getKeyword = function () {
    return this._attributes.keyword;
};
/**
 * Check whether the text is available.
 * @returns {boolean} Returns true if the paper has a text.
 */
Paper.prototype.hasText = function () {
    return this._text !== "";
};
/**
 * Return the associated text or am empty string if no text is available.
 * @returns {string} Returns text
 */
Paper.prototype.getText = function () {
    return this._text;
};
/**
 * Check whether a description is available.
 * @returns {boolean} Returns true if the paper has a description.
 */
Paper.prototype.hasDescription = function () {
    return this._attributes.description !== "";
};
/**
 * Return the description or an empty string if no description is available.
 * @returns {string} Returns the description.
 */
Paper.prototype.getDescription = function () {
    return this._attributes.description;
};
/**
 * Check whether an title is available
 * @returns {boolean} Returns true if the Paper has a title.
 */
Paper.prototype.hasTitle = function () {
    return this._attributes.title !== "";
};
/**
 * Return the title, or an empty string of no title is available.
 * @returns {string} Returns the title
 */
Paper.prototype.getTitle = function () {
    return this._attributes.title;
};
/**
 * Check whether an title width in pixels is available
 * @returns {boolean} Returns true if the Paper has a title.
 */
Paper.prototype.hasTitleWidth = function () {
    return this._attributes.titleWidth !== 0;
};
/**
 * Return the title width in pixels, or an empty string of no title width in pixels is available.
 * @returns {string} Returns the title
 */
Paper.prototype.getTitleWidth = function () {
    return this._attributes.titleWidth;
};
/**
 * Check whether an url is available
 * @returns {boolean} Returns true if the Paper has an Url.
 */
Paper.prototype.hasUrl = function () {
    return this._attributes.url !== "";
};
/**
 * Return the url, or an empty string of no url is available.
 * @returns {string} Returns the url
 */
Paper.prototype.getUrl = function () {
    return this._attributes.url;
};
/**
 * Check whether a locale is available
 * @returns {boolean} Returns true if the paper has a locale
 */
Paper.prototype.hasLocale = function () {
    return this._attributes.locale !== "";
};
/**
 * Return the locale or an empty string if no locale is available
 * @returns {string} Returns the locale
 */
Paper.prototype.getLocale = function () {
    return this._attributes.locale;
};
/**
 * Check whether a permalink is available
 * @returns {boolean} Returns true if the Paper has a permalink.
 */
Paper.prototype.hasPermalink = function () {
    return this._attributes.permalink !== "";
};
/**
 * Return the permalink, or an empty string of no permalink is available.
 * @returns {string} Returns the permalink.
 */
Paper.prototype.getPermalink = function () {
    return this._attributes.permalink;
};
module.exports = Paper;



},{"lodash/defaults":158}],390:[function(require,module,exports){
"use strict";

var getType = require("./../helpers/types.js").getType;
var isSameType = require("./../helpers/types.js").isSameType;
var defaults = require("lodash/defaults");
var forEach = require("lodash/forEach");
/**
 * Default attributes to be used by the Participle if they are left undefined.
 * @type { { auxiliaries: array, type: string } }
 */
var defaultAttributes = {
    auxiliaries: [],
    type: ""
};
/**
 * Validates the type of all attributes. Throws an error if the type is invalid.
 *
 * @param {object} attributes The object containing all attributes.
 * @returns {void}
 */
var validateAttributes = function validateAttributes(attributes) {
    forEach(attributes, function (attributeValue, attributeName) {
        var expectedType = getType(defaultAttributes[attributeName]);
        if (isSameType(attributeValue, expectedType) === false) {
            throw Error("Attribute " + attributeName + " has invalid type. Expected " + expectedType + ", got " + getType(attributeValue) + ".");
        }
    });
};
/**
 * Construct the Participle object and set the participle, sentence part, auxiliary and type.
 *
 * @param {string} participle The participle.
 * @param {string} sentencePart The sentence part where the participle is from.
 * @param {object} attributes The object containing all attributes.
 * @constructor
 */
var Participle = function Participle(participle, sentencePart, attributes) {
    this.setParticiple(participle);
    this.setSentencePart(sentencePart);
    this._determinesSentencePartIsPassive = false;
    attributes = attributes || {};
    defaults(attributes, defaultAttributes);
    validateAttributes(attributes);
    this._attributes = attributes;
};
/**
 * Sets the participle.
 * @param {string} participle The participle.
 * @returns {void}.
 */
Participle.prototype.setParticiple = function (participle) {
    if (participle === "") {
        throw Error("The participle should not be empty.");
    }
    this._participle = participle;
};
/**
 * Returns the participle.
 * @returns {String} The participle.
 */
Participle.prototype.getParticiple = function () {
    return this._participle;
};
/**
 * Sets the SentencePart.
 *
 * @param {string} sentencePart The sentence part.
 * @returns {void}.
 */
Participle.prototype.setSentencePart = function (sentencePart) {
    if (sentencePart === "") {
        throw Error("The sentence part should not be empty.");
    }
    this._sentencePart = sentencePart;
};
/**
 * Returns the sentence part.
 * @returns {String} The sentence part.
 */
Participle.prototype.getSentencePart = function () {
    return this._sentencePart;
};
/**
 * Returns the type.
 * @returns {String} The type.
 */
Participle.prototype.getType = function () {
    return this._attributes.type;
};
/**
 * Returns the auxiliaries.
 * @returns {String} The auxiliaries.
 */
Participle.prototype.getAuxiliaries = function () {
    return this._attributes.auxiliaries;
};
/**
 * Returns if the participle is passive or not.
 * @returns {boolean} True if it is passive.
 */
Participle.prototype.determinesSentencePartIsPassive = function () {
    return this._determinesSentencePartIsPassive;
};
/**
 * Determines if the sentence is passive or not.
 * @param {boolean} passive Whether the sentence part is passive.
 * @returns {void}
 */
Participle.prototype.setSentencePartPassiveness = function (passive) {
    if (!isSameType(passive, "boolean")) {
        throw Error("Passiveness had invalid type. Expected boolean, got " + getType(passive) + ".");
    }
    this._determinesSentencePartIsPassive = passive;
};
module.exports = Participle;



},{"./../helpers/types.js":267,"lodash/defaults":158,"lodash/forEach":167}],391:[function(require,module,exports){
"use strict";
/**
 * Default attributes to be used by the Sentence if they are left undefined.
 * @type {{locale: string}}
 */

var defaultAttributes = {
  locale: "en_US"
};
/**
 * Construct the Sentence object and set the sentence text and locale.
 *
 * @param {string} sentence The text of the sentence.
 * @param {string} locale The locale.
 * @constructor
 */
var Sentence = function Sentence(sentence, locale) {
  this._sentenceText = sentence || "";
  this._locale = locale || defaultAttributes.locale;
  this._isPassive = false;
};
/**
 * Returns the sentence text.
 * @returns {String} The sentence.
 */
Sentence.prototype.getSentenceText = function () {
  return this._sentenceText;
};
/**
 * Returns the locale.
 * @returns {String} The locale.
 */
Sentence.prototype.getLocale = function () {
  return this._locale;
};
module.exports = Sentence;



},{}],392:[function(require,module,exports){
"use strict";
/**
 * Constructs a sentence part object.
 *
 * @param {string} sentencePartText The text in the sentence part.
 * @param {Array} auxiliaries The list of auxiliaries from the sentence part.
 * @param {string} locale The locale used for this sentence part.
 *
 * @constructor
 */

var SentencePart = function SentencePart(sentencePartText, auxiliaries, locale) {
  this._sentencePartText = sentencePartText;
  this._auxiliaries = auxiliaries;
  this._locale = locale;
  this._isPassive = false;
};
/**
 * Returns the sentence part string.
 *
 * @returns {string} The sentence part.
 */
SentencePart.prototype.getSentencePartText = function () {
  return this._sentencePartText;
};
/**
 * Returns the passiveness of a sentence part.
 *
 * @returns {boolean} returns true if passive, otherwise returns false.
 */
SentencePart.prototype.isPassive = function () {
  return this._isPassive;
};
/**
 * Returns the list of auxiliaries from a sentence part.
 *
 * @returns {Array} The list of auxiliaries.
 */
SentencePart.prototype.getAuxiliaries = function () {
  return this._auxiliaries;
};
/**
 * Returns the locale of the sentence part.
 *
 * @returns {string} The locale of the sentence part.
 */
SentencePart.prototype.getLocale = function () {
  return this._locale;
};
/**
 * Sets the passiveness of the sentence part.
 *
 * @param {boolean} passive Whether the sentence part is passive or not.
 * @returns {void}
 */
SentencePart.prototype.setPassive = function (passive) {
  this._isPassive = passive;
};
module.exports = SentencePart;



},{}],393:[function(require,module,exports){
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



},{"lodash/forEach":167,"lodash/has":169}]},{},[2]);
