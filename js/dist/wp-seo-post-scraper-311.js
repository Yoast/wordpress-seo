(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global wp, jQuery, YoastSEO */
module.exports = (function() {
	'use strict';

	/**
	 * Renders a keyword tab as a jQuery HTML object.
	 *
	 * @param {int}    score
	 * @param {string} keyword
	 * @param {string} prefix
	 *
	 * @returns {HTMLElement}
	 */
	function renderKeywordTab( score, keyword, prefix ) {
		var placeholder = keyword.length > 0 ? keyword : '...';
		var html = wp.template( 'keyword_tab' )({
			keyword: keyword,
			placeholder: placeholder,
			score: score,
			hideRemove: true,
			prefix: prefix + ' ',
			active: true
		});

		return jQuery( html );
	}

	/**
	 * Constructor for a keyword tab object
	 * @param {Object} args
	 * @constructor
	 */
	function KeywordTab( args ) {
		this.keyword = '';
		this.prefix  = args.prefix || '';

		this.setScore( 0 );
	}

	/**
	 * Initialize a keyword tab.
	 *
	 * @param {HTMLElement} parent
	 */
	KeywordTab.prototype.init = function( parent ) {
		this.setElement( renderKeywordTab( this.score, this.keyword, this.prefix ) );

		jQuery( parent ).append( this.element );
	};

	/**
	 * Updates the keyword tabs with new values.
	 *
	 * @param {integer} score
	 * @param {string}  keyword
	 */
	KeywordTab.prototype.update = function( score, keyword ) {
		this.keyword = keyword;
		this.setScore( score );
		this.refresh();
	};

	/**
	 * Renders a new keyword tab with the current values and replaces the old tab with this one.
	 */
	KeywordTab.prototype.refresh = function() {
		var newElem = renderKeywordTab( this.score, this.keyword, this.prefix );

		this.element.replaceWith( newElem );
		this.setElement( newElem );
	};

	/**
	 * Sets the current element
	 *
	 * @param {HTMLElement} element
	 */
	KeywordTab.prototype.setElement = function( element ) {
		this.element = jQuery( element );
	};

	/**
	 * Formats the given score and store it in the attribute.
	 *
	 * @param {number} score
	 */
	KeywordTab.prototype.setScore = function( score ) {
		score = parseInt( score, 10 );

		if ( this.keyword === '' ) {
			score = 'na';
		}

		score = YoastSEO.ScoreFormatter.prototype.overallScoreRating( score );

		this.score = score;
	};

	return KeywordTab;
})();

},{}],2:[function(require,module,exports){
/* global YoastSEO, tinyMCE, ajaxurl, wpseoPostScraperL10n, YoastShortcodePlugin, YoastReplaceVarPlugin, console, require */
(function( $ ) {
	'use strict';

	var currentKeyword = '';

	var mainKeywordTab;
	var KeywordTab = require( './analysis/keywordTab' );
	var debounce = require( 'lodash/debounce' );

	/**
	 * wordpress scraper to gather inputfields.
	 * @constructor
	 */
	var PostScraper = function() {
		if ( typeof CKEDITOR === 'object' ) {
			console.warn( 'YoastSEO currently doesn\'t support ckEditor. The content analysis currently only works with the HTML editor or TinyMCE.' );
		}

		this.prepareSlugBinding();
	};

	/**
	 * On a new post, WordPress doesn't include the slug editor, since a post has not been given a slug yet.
	 * As soon as a title is chosen, an `after-autosave.update-post-slug` event fires that triggers an AJAX request
	 * to the server to generate a slug. On the response callback a slug editor is inserted into the page on which
	 * we can bind our Snippet Preview.
	 *
	 * On existing posts, the slug editor is already there and we can bind immediately.
	 */
	PostScraper.prototype.prepareSlugBinding = function() {
		if ( document.getElementById( 'editable-post-name' ) === null ) {
			var that = this;
			jQuery( document ).on( 'after-autosave.update-post-slug', function() {
				that.bindSnippetCiteEvents( 0 );
			});
		} else {
			this.bindSlugEditor();
		}
	};

	/**
	 * When the `after-autosave.update-post-slug` event is triggered, this function checks to see if the slug editor has
	 * been inserted yet. If so, it does all of the necessary event binding. If not, it retries for a maximum of 5 seconds.
	 *
	 * @param {int} time
	 */
	PostScraper.prototype.bindSnippetCiteEvents = function( time ) {
		time = time || 0;
		var slugElem = document.getElementById( 'editable-post-name' );
		var titleElem = document.getElementById( 'title' );
		var postNameElem = document.getElementById('post_name');

		if ( slugElem !== null && titleElem.value !== '' ) {
			this.bindSlugEditor();

			// Always set the post name element.
			postNameElem.value = document.getElementById('editable-post-name-full').textContent;

			YoastSEO.app.snippetPreview.unformattedText.snippet_cite = document.getElementById('editable-post-name-full').textContent;
			YoastSEO.app.analyzeTimer();
		} else if ( time < 5000 ) {
			time += 200;
			setTimeout( this.bindSnippetCiteEvents.bind( this, time ), 200 );
		}
	};

	/**
	 * We want to trigger an update of the snippetPreview on a slug update. Because the save button is not available yet, we need to
	 * bind an event within the scope of a clickevent of the edit button.
	 */
	PostScraper.prototype.bindSlugEditor = function() {
		$( '#titlediv' ).on( 'change', '#new-post-slug', function() {
			YoastSEO.app.snippetPreview.unformattedText.snippet_cite = $( '#new-post-slug' ).val();
			YoastSEO.app.refresh();
		});
	};

	/**
	 * Get data from inputfields and store them in an analyzerData object. This object will be used to fill
	 * the analyzer and the snippetpreview
	 */
	PostScraper.prototype.getData = function() {
		return {
			keyword: this.getDataFromInput( 'keyword' ),
			meta: this.getDataFromInput( 'meta' ),
			text: this.getDataFromInput( 'text' ),
			title: this.getDataFromInput( 'title' ),
			url: this.getDataFromInput( 'url' ),
			excerpt: this.getDataFromInput( 'excerpt' ),
			snippetTitle: this.getDataFromInput( 'snippetTitle' ),
			snippetMeta: this.getDataFromInput( 'snippetMeta' ),
			snippetCite: this.getDataFromInput( 'cite' ),
			usedKeywords: wpseoPostScraperL10n.keyword_usage,
			searchUrl: '<a target="_blank" href=' + wpseoPostScraperL10n.search_url + '>',
			postUrl: '<a target="_blank" href=' + wpseoPostScraperL10n.post_edit_url + '>'
		};
	};

	/**
	 * gets the values from the given input. Returns this value
	 * @param {String} inputType
	 * @returns {String}
	 */
	PostScraper.prototype.getDataFromInput = function( inputType ) {
		var newPostSlug, val = '';
		switch ( inputType ) {
			case 'text':
			case 'content':
				val = this.getContentTinyMCE();
				break;
			case 'cite':
			case 'url':
				newPostSlug = $( '#new-post-slug' );
				if ( 0 < newPostSlug.length ) {
					val = newPostSlug.val();
				}
				else if ( document.getElementById( 'editable-post-name-full' ) !== null ) {
					val = document.getElementById( 'editable-post-name-full' ).textContent;
				}
				break;
			case 'meta':
				val = document.getElementById( 'yoast_wpseo_metadesc' ) && document.getElementById( 'yoast_wpseo_metadesc' ).value || '';
				break;
			case 'snippetMeta':
				val = document.getElementById( 'yoast_wpseo_metadesc' ) && document.getElementById( 'yoast_wpseo_metadesc' ).value || '';
				break;
			case 'keyword':
				val = document.getElementById( 'yoast_wpseo_focuskw_text_input' ) && document.getElementById( 'yoast_wpseo_focuskw_text_input' ).value || '';
				currentKeyword = val;
				break;
			case 'title':
				val = document.getElementById( 'title' ) && document.getElementById( 'title' ).value || '';
				break;
			case 'snippetTitle':
				val = document.getElementById( 'yoast_wpseo_title' ) && document.getElementById( 'yoast_wpseo_title' ).value || '';
				break;
			case 'excerpt':
				if ( document.getElementById( 'excerpt' ) !== null ) {
					val = document.getElementById('excerpt') && document.getElementById('excerpt').value || '';
				}
				break;
			default:
				break;
		}
		return val;
	};

	/**
	 * When the snippet is updated, update the (hidden) fields on the page
	 * @param {Object} value
	 * @param {String} type
	 */
	PostScraper.prototype.setDataFromSnippet = function( value, type ) {
		switch ( type ) {
			case 'snippet_meta':
				document.getElementById( 'yoast_wpseo_metadesc' ).value = value;
				break;
			case 'snippet_cite':
				document.getElementById( 'post_name' ).value = value;
				if (
					document.getElementById( 'editable-post-name' ) !== null &&
					document.getElementById( 'editable-post-name-full' ) !== null ) {
					document.getElementById( 'editable-post-name' ).textContent = value;
					document.getElementById( 'editable-post-name-full' ).textContent = value;
				}
				break;
			case 'snippet_title':
				document.getElementById( 'yoast_wpseo_title' ).value = value;
				break;
			default:
				break;
		}
	};

	/**
	 * The data passed from the snippet editor.
	 *
	 * @param {Object} data
	 * @param {string} data.title
	 * @param {string} data.urlPath
	 * @param {string} data.metaDesc
	 */
	PostScraper.prototype.saveSnippetData = function( data ) {
		this.setDataFromSnippet( data.title, 'snippet_title' );
		this.setDataFromSnippet( data.urlPath, 'snippet_cite' );
		this.setDataFromSnippet( data.metaDesc, 'snippet_meta' );
	};

	/**
	 * Returns the value of the contentfield. If tinyMCE isn't initialized, or has no editors
	 * or is hidden it gets it's contents from getTinyMCEElementContent.
	 * @returns {String}
	 */
	PostScraper.prototype.getContentTinyMCE = function() {
		if ( this.isTinyMCEAvailable() === false ) {
			return this.getTinyMCEElementContent();
		}
		return tinyMCE.get( 'content' ).getContent();
	};

	/**
	 * Returns whether or not TinyMCE is available.
	 * @returns {boolean}
	 */
	PostScraper.prototype.isTinyMCEAvailable = function() {
		if ( typeof tinyMCE === 'undefined' ||
			typeof tinyMCE.editors === 'undefined' ||
			tinyMCE.editors.length === 0 ||
			tinyMCE.get( 'content' ) === null ||
			tinyMCE.get( 'content' ).isHidden() ) {
			return false;
		}

		return true;
	};

	/**
	 * Gets content from the contentfield.
	 *
	 * @returns {String}
	 */
	PostScraper.prototype.getTinyMCEElementContent = function() {
		return document.getElementById( 'content' ) && document.getElementById( 'content' ).value || '';
	};

	/**
	 * Calls the eventbinders.
	 */
	PostScraper.prototype.bindElementEvents = function( app ) {
		this.inputElementEventBinder( app );
		document.getElementById( 'yoast_wpseo_focuskw_text_input' ).addEventListener( 'keydown', app.snippetPreview.disableEnter );
		document.getElementById( 'yoast_wpseo_focuskw_text_input' ).addEventListener( 'keyup', debounce( this.updateKeywordUsage , 500 ) );
	};

	/**
	 * binds the renewData function on the change of inputelements.
	 */
	PostScraper.prototype.inputElementEventBinder = function( app ) {
		var elems = [ 'excerpt', 'content', 'yoast_wpseo_focuskw_text_input', 'title' ];
		for ( var i = 0; i < elems.length; i++ ) {
			var elem = document.getElementById( elems[ i ] );
			if ( elem !== null ) {
				document.getElementById( elems[ i ] ).addEventListener( 'input', app.analyzeTimer.bind( app ) );
			}
		}

		if( typeof tinyMCE !== 'undefined' && typeof tinyMCE.on === 'function' ) {
			//binds the input, change, cut and paste event to tinyMCE. All events are needed, because sometimes tinyMCE doesn'
			//trigger them, or takes up to ten seconds to fire an event.
			var events = [ 'input', 'change', 'cut', 'paste' ];
			tinyMCE.on( 'addEditor', function( e ) {
				for ( var i = 0; i < events.length; i++ ) {
					e.editor.on( events[i], app.analyzeTimer.bind( app ) );
				}
			});
		}
		document.getElementById( 'yoast_wpseo_focuskw_text_input' ).addEventListener( 'blur', this.resetQueue );
	};

	/**
	 * Resets the current queue if focus keyword is changed and not empty.
	 */
	PostScraper.prototype.resetQueue = function() {
		if ( YoastSEO.app.rawData.keyword !== '' ) {
			YoastSEO.app.runAnalyzer( this.rawData );
		}
	};

	/**
	 * Saves the score to the linkdex.
	 * Outputs the score in the overall target.
	 *
	 * @param {string} score
	 */
	PostScraper.prototype.saveScores = function( score ) {
		var alt;
		var cssClass;

		if ( this.isMainKeyword( currentKeyword ) ) {
			document.getElementById( 'yoast_wpseo_linkdex' ).value = score;

			if ( '' === currentKeyword ) {
				cssClass = 'na';
			} else {
				cssClass = YoastSEO.app.scoreFormatter.overallScoreRating( parseInt( score, 10 ) );
			}
			alt = YoastSEO.app.scoreFormatter.getSEOScoreText( cssClass );

			$( '.yst-traffic-light' )
				.attr( 'class', 'yst-traffic-light ' + cssClass )
				.attr( 'alt', alt );
		}

		// If multi keyword isn't available we need to update the first tab (content)
		if ( ! YoastSEO.multiKeyword ) {
			mainKeywordTab.update( score, currentKeyword );

			// Updates the input with the currentKeyword value
			$( '#yoast_wpseo_focuskw' ).val( currentKeyword );
		}

		jQuery( window ).trigger( 'YoastSEO:numericScore', score );
	};

	/**
	 * Returns whether or not the keyword is the main keyword
	 *
	 * @param {string} keyword The keyword to check
	 *
	 * @returns {boolean}
	 */
	PostScraper.prototype.isMainKeyword = function( keyword ) {
		var firstTab, mainKeyword;

		firstTab = $( '.wpseo_keyword_tab' )
			.first()
			.find( '.wpseo_tablink' );

		mainKeyword = firstTab.data( 'keyword' );

		return keyword === mainKeyword;
	};

	/**
	 * Initializes keyword tab with the correct template if multi keyword isn't available
	 */
	PostScraper.prototype.initKeywordTabTemplate = function() {
		var keyword, score;

		// If multi keyword is available we don't have to initialize this as multi keyword does this for us.
		if ( YoastSEO.multiKeyword ) {
			return;
		}

		// Remove default functionality to prevent scrolling to top.
		$( '.wpseo-metabox-tabs' ).on( 'click', '.wpseo_tablink', function( ev ) {
			ev.preventDefault();
		});

		keyword = $( '#yoast_wpseo_focuskw' ).val();
		score   = $( '#yoast_wpseo_linkdex' ).val();

		$( '#yoast_wpseo_focuskw_text_input' ).val( keyword );

		// Updates
		mainKeywordTab.update( score, keyword );
	};

	/**
	 * updates the focus keyword usage if it is not in the array yet.
	 */
	PostScraper.prototype.updateKeywordUsage = function() {
		var keyword = this.value;
		if ( typeof( wpseoPostScraperL10n.keyword_usage[ keyword ] === null ) ) {
			jQuery.post(ajaxurl, {
					action: 'get_focus_keyword_usage',
					post_id: jQuery('#post_ID').val(),
					keyword: keyword
				}, function( data ) {
					if ( data ) {
						wpseoPostScraperL10n.keyword_usage[ keyword ] = data;
						YoastSEO.app.analyzeTimer();
					}
				}, 'json'
			);
		}
	};

	/**
	 * Retrieves either a generated slug or the page title as slug for the preview
	 * @param {Object} response The AJAX response object
	 * @returns {string}
	 */
	function getUrlPath( response ) {
		if ( response.responseText === '' ) {
			return jQuery( '#title' ).val();
		}
		// Added divs to the response text, otherwise jQuery won't parse to HTML, but an array.
		return jQuery( '<div>' + response.responseText + '</div>' )
			.find( '#editable-post-name-full' )
			.text();
	}

	/**
	 * binds to the WordPress jQuery function to put the permalink on the page.
	 * If the response matches with permalinkstring, the snippet can be rerendered.
	 */
	jQuery( document ).on( 'ajaxComplete', function( ev, response, ajaxOptions ) {
		var ajax_end_point = '/admin-ajax.php';
		if ( ajax_end_point !== ajaxOptions.url.substr( 0 - ajax_end_point.length ) ) {
			return;
		}

		if ( 'string' === typeof ajaxOptions.data && -1 !== ajaxOptions.data.indexOf( 'action=sample-permalink' ) ) {
			YoastSEO.app.snippetPreview.setUrlPath( getUrlPath( response ) );
		}
	} );

	/**
	 * Initializes the snippet preview
	 *
	 * @param {PostScraper} postScraper
	 * @returns {YoastSEO.SnippetPreview}
	 */
	function initSnippetPreview( postScraper ) {
		var data = postScraper.getData();

		var snippetPreviewArgs = {
			targetElement: document.getElementById( 'wpseosnippet' ),
			placeholder: {
				urlPath: ''
			},
			defaultValue: {},
			baseURL: wpseoPostScraperL10n.base_url,
			callbacks: {
				saveSnippetData: postScraper.saveSnippetData.bind( postScraper )
			},
			metaDescriptionDate: wpseoPostScraperL10n.metaDescriptionDate,
			data: {
				title: data.snippetTitle,
				urlPath: data.snippetCite,
				metaDesc: data.snippetMeta
			}
		};

		var titlePlaceholder = wpseoPostScraperL10n.title_template;
		if ( titlePlaceholder === '' ) {
			titlePlaceholder = '%%title%% - %%sitename%%';
		}
		snippetPreviewArgs.placeholder.title = titlePlaceholder;
		snippetPreviewArgs.defaultValue.title = titlePlaceholder;

		var metaPlaceholder = wpseoPostScraperL10n.metadesc_template;
		if ( metaPlaceholder !== '' ) {
			snippetPreviewArgs.placeholder.metaDesc = metaPlaceholder;
			snippetPreviewArgs.defaultValue.metaDesc = metaPlaceholder;
		}

		return new YoastSEO.SnippetPreview( snippetPreviewArgs );
	}

	jQuery( document ).ready(function() {
		var translations;

		// Initialize an instance of the keywordword tab.
		mainKeywordTab = new KeywordTab(
			{
				prefix: wpseoPostScraperL10n.contentTab
			}
		);
		mainKeywordTab.setElement( $('.wpseo_keyword_tab') );

		var postScraper = new PostScraper();

		var args = {

			// ID's of elements that need to trigger updating the analyzer.
			elementTarget: ['content', 'yoast_wpseo_focuskw_text_input', 'yoast_wpseo_metadesc', 'excerpt', 'editable-post-name', 'editable-post-name-full'],
			targets: {
				output: 'wpseo-pageanalysis'
			},
			usedKeywords: wpseoPostScraperL10n.keyword_usage,
			searchUrl: '<a target="_blank" href=' + wpseoPostScraperL10n.search_url + '>',
			postUrl: '<a target="_blank" href=' + wpseoPostScraperL10n.post_edit_url + '>',
			callbacks: {
				getData: postScraper.getData.bind( postScraper ),
				bindElementEvents: postScraper.bindElementEvents.bind( postScraper ),
				saveScores: postScraper.saveScores.bind( postScraper ),
				saveSnippetData: postScraper.saveSnippetData.bind( postScraper )
			},
			locale: wpseoPostScraperL10n.locale
		};

		translations = wpseoPostScraperL10n.translations;

		if ( typeof translations !== 'undefined' && typeof translations.domain !== 'undefined' ) {
			translations.domain = 'js-text-analysis';
			translations.locale_data['js-text-analysis'] = translations.locale_data['wordpress-seo'];

			delete( translations.locale_data['wordpress-seo'] );

			args.translations = translations;
		}

		args.snippetPreview = initSnippetPreview( postScraper );

		window.YoastSEO.app = new YoastSEO.App( args );
		jQuery( window).trigger( 'YoastSEO:ready' );

		// Init Plugins
		new YoastReplaceVarPlugin();
		new YoastShortcodePlugin();

		postScraper.initKeywordTabTemplate();

		// Backwards compatibility.
		YoastSEO.analyzerArgs = args;
	} );
}( jQuery ));

},{"./analysis/keywordTab":1,"lodash/debounce":3}],3:[function(require,module,exports){
var isObject = require('./isObject'),
    now = require('./now'),
    toNumber = require('./toNumber');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide an options object to indicate whether `func` should be invoked on
 * the leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent calls
 * to the debounced function return the result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
 * on the trailing edge of the timeout only if the debounced function is
 * invoked more than once during the `wait` timeout.
 *
 * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
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
      result,
      timerId,
      lastCallTime = 0,
      lastInvokeTime = 0,
      leading = false,
      maxWait = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxWait = 'maxWait' in options && nativeMax(toNumber(options.maxWait) || 0, wait);
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

    return maxWait === false ? result : nativeMin(result, maxWait - timeSinceLastInvoke);
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (!lastCallTime || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxWait !== false && timeSinceLastInvoke >= maxWait));
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
    clearTimeout(timerId);
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
    lastCallTime = lastInvokeTime = 0;
    lastArgs = lastThis = timerId = undefined;
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
      // Handle invocations in a tight loop.
      clearTimeout(timerId);
      timerId = setTimeout(timerExpired, wait);
      return invokeFunc(lastCallTime);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;

},{"./isObject":5,"./now":8,"./toNumber":9}],4:[function(require,module,exports){
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

},{"./isObject":5}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{"./isObjectLike":6}],8:[function(require,module,exports){
/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @type {Function}
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred function to be invoked.
 */
var now = Date.now;

module.exports = now;

},{}],9:[function(require,module,exports){
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

},{"./isFunction":4,"./isObject":5,"./isSymbol":7}]},{},[2]);
